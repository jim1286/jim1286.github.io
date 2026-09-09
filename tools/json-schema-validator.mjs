import { isDeepStrictEqual } from 'node:util';

function schemaFinding(code, path, message) {
  return { code, path, message };
}

function typeMatches(value, type) {
  if (type === 'null') return value === null;
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  return typeof value === type;
}

function childPath(path, key) {
  if (typeof key === 'number') return `${path}[${key}]`;
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
}

function resolveLocalRef(rootSchema, reference) {
  if (!reference.startsWith('#/')) throw new Error(`Only local JSON Schema references are supported: ${reference}`);
  return reference
    .slice(2)
    .split('/')
    .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'))
    .reduce((value, part) => value?.[part], rootSchema);
}

const supportedSchemaKeywords = new Set([
  '$schema', '$id', '$defs', '$ref', 'title', 'description',
  'type', 'const', 'enum',
  'properties', 'required', 'additionalProperties',
  'items', 'contains', 'minItems', 'maxItems', 'uniqueItems',
  'minLength', 'maxLength', 'pattern', 'format',
  'anyOf', 'allOf', 'not', 'if', 'then', 'else',
]);

/** Fail closed when the checked-in schema uses a keyword this dependency-free engine cannot enforce. */
export function auditJsonSchema(schema) {
  const findings = [];
  const add = (code, path, message) => findings.push(schemaFinding(code, path, message));
  const visit = (node, path) => {
    if (node === true || node === false) return;
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      add('SCHEMA_DEFINITION_INVALID', path, 'Schema node must be an object or boolean.');
      return;
    }
    for (const key of Object.keys(node)) {
      if (!supportedSchemaKeywords.has(key)) {
        add('SCHEMA_KEYWORD_UNSUPPORTED', `${path}.${key}`, `Unsupported JSON Schema keyword "${key}" would not be enforced.`);
      }
    }
    if (node.$ref !== undefined) {
      if (typeof node.$ref !== 'string') {
        add('SCHEMA_REF_INVALID', `${path}.$ref`, '$ref must be a string.');
      } else {
        try {
          if (resolveLocalRef(schema, node.$ref) === undefined) add('SCHEMA_REF_MISSING', `${path}.$ref`, `Schema reference does not resolve: ${node.$ref}`);
        } catch (error) {
          add('SCHEMA_REF_UNSUPPORTED', `${path}.$ref`, error.message);
        }
      }
    }
    if (node.pattern !== undefined) {
      try {
        new RegExp(node.pattern, 'u');
      } catch (error) {
        add('SCHEMA_PATTERN_INVALID', `${path}.pattern`, `Schema pattern is invalid: ${error.message}`);
      }
    }
    if (node.format !== undefined && !['date', 'date-time', 'uri-reference'].includes(node.format)) {
      add('SCHEMA_FORMAT_UNSUPPORTED', `${path}.format`, `Unsupported format "${String(node.format)}" would not be enforced.`);
    }
    for (const mapKey of ['$defs', 'properties']) {
      if (node[mapKey] === undefined) continue;
      if (!node[mapKey] || typeof node[mapKey] !== 'object' || Array.isArray(node[mapKey])) {
        add('SCHEMA_MAP_INVALID', `${path}.${mapKey}`, `${mapKey} must be an object of schema nodes.`);
      } else {
        for (const [key, child] of Object.entries(node[mapKey])) visit(child, `${path}.${mapKey}.${key}`);
      }
    }
    if (node.additionalProperties && typeof node.additionalProperties === 'object') visit(node.additionalProperties, `${path}.additionalProperties`);
    for (const key of ['items', 'contains', 'not', 'if', 'then', 'else']) {
      if (node[key] !== undefined) visit(node[key], `${path}.${key}`);
    }
    for (const key of ['anyOf', 'allOf']) {
      if (node[key] === undefined) continue;
      if (!Array.isArray(node[key]) || node[key].length === 0) {
        add('SCHEMA_BRANCHES_INVALID', `${path}.${key}`, `${key} must be a non-empty array of schemas.`);
      } else {
        node[key].forEach((child, index) => visit(child, `${path}.${key}[${index}]`));
      }
    }
  };
  visit(schema, 'schema');
  return { ok: findings.length === 0, findings };
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validDateTime(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/);
  if (!match) return false;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, offsetHourText, offsetMinuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1
    && month <= 12
    && day >= 1
    && day <= daysInMonth[month - 1]
    && Number(hourText) <= 23
    && Number(minuteText) <= 59
    && Number(secondText) <= 59
    && (offsetHourText === undefined || Number(offsetHourText) <= 23)
    && (offsetMinuteText === undefined || Number(offsetMinuteText) <= 59)
    && !Number.isNaN(Date.parse(value));
}

function validUriReference(value) {
  if (typeof value !== 'string' || /[\u0000-\u0020]/.test(value)) return false;
  try {
    new URL(value, 'https://schema-validation.invalid/');
    return true;
  } catch {
    return false;
  }
}

function validateNode(value, schema, rootSchema, path) {
  const findings = [];
  const add = (code, message, findingPath = path) => findings.push(schemaFinding(code, findingPath, message));
  if (schema === true || schema === undefined) return findings;
  if (schema === false) {
    add('SCHEMA_FALSE', 'Value is prohibited by the JSON Schema.');
    return findings;
  }
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    add('SCHEMA_DEFINITION_INVALID', 'Schema node must be an object or boolean.');
    return findings;
  }

  if (schema.$ref) {
    let target;
    try {
      target = resolveLocalRef(rootSchema, schema.$ref);
    } catch (error) {
      add('SCHEMA_REF_UNSUPPORTED', error.message);
      return findings;
    }
    if (target === undefined) {
      add('SCHEMA_REF_MISSING', `Schema reference does not resolve: ${schema.$ref}`);
      return findings;
    }
    findings.push(...validateNode(value, target, rootSchema, path));
  }

  if (schema.type !== undefined) {
    const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!expectedTypes.some((type) => typeMatches(value, type))) {
      add('SCHEMA_TYPE', `Expected ${expectedTypes.join(' or ')}, received ${value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value}.`);
      return findings;
    }
  }
  if (Object.hasOwn(schema, 'const') && !isDeepStrictEqual(value, schema.const)) {
    add('SCHEMA_CONST', `Value must equal ${JSON.stringify(schema.const)}.`);
  }
  if (Array.isArray(schema.enum) && !schema.enum.some((candidate) => isDeepStrictEqual(value, candidate))) {
    add('SCHEMA_ENUM', `Value must be one of ${schema.enum.map((item) => JSON.stringify(item)).join(', ')}.`);
  }

  if (Array.isArray(schema.anyOf)) {
    const alternatives = schema.anyOf.map((candidate) => validateNode(value, candidate, rootSchema, path));
    if (!alternatives.some((candidateFindings) => candidateFindings.length === 0)) {
      add('SCHEMA_ANY_OF', 'Value does not satisfy any anyOf branch.');
    }
  }
  if (Array.isArray(schema.allOf)) {
    for (const candidate of schema.allOf) findings.push(...validateNode(value, candidate, rootSchema, path));
  }
  if (schema.not !== undefined && validateNode(value, schema.not, rootSchema, path).length === 0) {
    add('SCHEMA_NOT', 'Value must not match the forbidden schema.');
  }
  if (schema.if !== undefined) {
    const conditionMatches = validateNode(value, schema.if, rootSchema, path).length === 0;
    if (conditionMatches && schema.then !== undefined) findings.push(...validateNode(value, schema.then, rootSchema, path));
    if (!conditionMatches && schema.else !== undefined) findings.push(...validateNode(value, schema.else, rootSchema, path));
  }

  if (typeof value === 'string') {
    if (Number.isInteger(schema.minLength) && value.length < schema.minLength) add('SCHEMA_MIN_LENGTH', `String length must be at least ${schema.minLength}.`);
    if (Number.isInteger(schema.maxLength) && value.length > schema.maxLength) add('SCHEMA_MAX_LENGTH', `String length must be at most ${schema.maxLength}.`);
    if (schema.pattern !== undefined) {
      try {
        if (!new RegExp(schema.pattern, 'u').test(value)) add('SCHEMA_PATTERN', `String must match /${schema.pattern}/.`);
      } catch (error) {
        add('SCHEMA_PATTERN_INVALID', `Schema pattern is invalid: ${error.message}`);
      }
    }
    if (schema.format === 'date' && !validDate(value)) add('SCHEMA_FORMAT_DATE', 'String must be a real RFC 3339 full-date.');
    if (schema.format === 'date-time' && !validDateTime(value)) add('SCHEMA_FORMAT_DATE_TIME', 'String must be an RFC 3339 date-time with an explicit offset.');
    if (schema.format === 'uri-reference' && !validUriReference(value)) add('SCHEMA_FORMAT_URI_REFERENCE', 'String must be a valid URI reference.');
  }

  if (Array.isArray(value)) {
    if (Number.isInteger(schema.minItems) && value.length < schema.minItems) add('SCHEMA_MIN_ITEMS', `Array must contain at least ${schema.minItems} item(s).`);
    if (Number.isInteger(schema.maxItems) && value.length > schema.maxItems) add('SCHEMA_MAX_ITEMS', `Array must contain at most ${schema.maxItems} item(s).`);
    if (schema.uniqueItems === true) {
      for (let left = 0; left < value.length; left += 1) {
        for (let right = left + 1; right < value.length; right += 1) {
          if (isDeepStrictEqual(value[left], value[right])) add('SCHEMA_UNIQUE_ITEMS', `Array items ${left} and ${right} must be unique.`, childPath(path, right));
        }
      }
    }
    if (schema.items !== undefined) {
      value.forEach((item, index) => findings.push(...validateNode(item, schema.items, rootSchema, childPath(path, index))));
    }
    if (schema.contains !== undefined && !value.some((item, index) => validateNode(item, schema.contains, rootSchema, childPath(path, index)).length === 0)) {
      add('SCHEMA_CONTAINS', 'Array must contain an item matching the contains schema.');
    }
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required || []) {
      if (!Object.hasOwn(value, required)) add('SCHEMA_REQUIRED', 'Required property is missing.', childPath(path, required));
    }
    const declaredProperties = schema.properties || {};
    for (const [key, childSchema] of Object.entries(declaredProperties)) {
      if (Object.hasOwn(value, key)) findings.push(...validateNode(value[key], childSchema, rootSchema, childPath(path, key)));
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(declaredProperties, key)) add('SCHEMA_ADDITIONAL_PROPERTY', 'Property is not allowed by the JSON Schema.', childPath(path, key));
      }
    } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(declaredProperties, key)) findings.push(...validateNode(value[key], schema.additionalProperties, rootSchema, childPath(path, key)));
      }
    }
  }

  return findings;
}

export function validateWithJsonSchema(value, schema, { path = 'contract' } = {}) {
  const findings = validateNode(value, schema, schema, path);
  return { ok: findings.length === 0, findings };
}
