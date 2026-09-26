/**
 * Inspect rendered local components and JSX attributes with the consumer's TypeScript parser.
 * The source is embedded by app-standard.mjs so generated checkers have no extra runtime package.
 * A textual opening-tag regex attributed a nested NativeText style to BurnTok's Sheet (2026-09-23).
 */
export function analyzeHjmSource(ts, { program, files, boundaryEntries, routeEntries, rendererPackage, providerSymbol, resolveImport }) {
  const byPath = new Map(files.map((file) => [file.path, program.getSourceFile(file.path)]).filter(([, source]) => source));
  const checker = program.getTypeChecker();
  const imports = new Map();
  const definitions = new Map();
  const defaults = new Map();
  const reexports = new Map();
  const tags = new Map();
  const paletteRanges = new Map();
  const compositionProps = new Set(['layoutStyle', 'headerStyle', 'copyStyle', 'actionStyle', 'contentStyle']);
  const legacy = (name) => /(?:Style|^style)$/.test(name) && !compositionProps.has(name);
  const unwrap = (node) => {
    while (node && (ts.isParenthesizedExpression(node) || ts.isNonNullExpression(node))) node = node.expression;
    return node;
  };
  const callable = (node) => {
    node = unwrap(node);
    if (node && ts.isCallExpression(node) && /^(?:React\.)?(?:memo|forwardRef)$/.test(node.expression.getText())) return callable(node.arguments[0]);
    return node && (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isFunctionDeclaration(node)) ? node : null;
  };
  const key = (path, name) => path + ':' + name;
  for (const [path, source] of byPath) {
    const fileImports = new Map();
    imports.set(path, fileImports);
    const fileExports = [];
    reexports.set(path, fileExports);
    for (const statement of source.statements) {
      if (ts.isExportDeclaration(statement) && !statement.isTypeOnly
        && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        const target = statement.moduleSpecifier.text;
        if (!statement.exportClause) fileExports.push({ target });
        else if (ts.isNamedExports(statement.exportClause)) for (const item of statement.exportClause.elements) {
          if (!item.isTypeOnly) fileExports.push({ target, name: item.name.text, exported: item.propertyName?.text ?? item.name.text });
        }
      }
      if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
        const target = statement.moduleSpecifier.text;
        if (statement.importClause?.name) fileImports.set(statement.importClause.name.text, { target, exported: 'default' });
        const bindings = statement.importClause?.namedBindings;
        if (bindings && ts.isNamedImports(bindings)) for (const specifier of bindings.elements) {
          if (!specifier.isTypeOnly && !statement.importClause?.isTypeOnly) fileImports.set(specifier.name.text, { target, exported: specifier.propertyName?.text ?? specifier.name.text });
        }
      }
      if (ts.isFunctionDeclaration(statement)) {
        const name = statement.name?.text ?? 'default';
        definitions.set(key(path, name), statement);
        if (statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) defaults.set(path, name);
      }
      if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) definitions.set(key(path, declaration.name.text), declaration.initializer);
      }
      if (ts.isExportAssignment(statement)) {
        if (ts.isIdentifier(statement.expression)) defaults.set(path, statement.expression.text);
        else { definitions.set(key(path, 'default'), statement.expression); defaults.set(path, 'default'); }
      }
    }
    const isRenderer = (target) => target === rendererPackage || target.startsWith(rendererPackage + '/');
    const containsAssertion = (node, seen = new Set()) => {
      if (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) return true;
      if (ts.isIdentifier(node) && !seen.has(node.text)) {
        const declaration = definitions.get(key(path, node.text));
        if (declaration) { seen.add(node.text); if (containsAssertion(declaration, seen)) return true; }
      }
      let found = false;
      ts.forEachChild(node, (child) => { if (containsAssertion(child, seen)) found = true; });
      return found;
    };
    const safeSpread = (node) => {
      if (containsAssertion(node)) return false;
      const safe = (type) => {
        if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return false;
        if (type.isUnion()) return type.types.every(safe);
        if (checker.getIndexInfosOfType(type).length) return false;
        return checker.getPropertiesOfType(type).every((property) => !legacy(property.name));
      };
      return safe(checker.getTypeAtLocation(node));
    };
    const fileTags = [];
    const ranges = [];
    const visit = (node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const name = node.tagName.getText(source);
        const imported = fileImports.get(name);
        fileTags.push({
          name,
          exported: imported && isRenderer(imported.target) ? imported.exported : null,
          props: node.attributes.properties.filter(ts.isJsxAttribute).map((attribute) => attribute.name.getText(source)),
          unsafeSpread: node.attributes.properties.filter(ts.isJsxSpreadAttribute).some((attribute) => !safeSpread(attribute.expression)),
          line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        });
      }
      // Only explicit palette arguments to the canonical resolver are token definitions.
      // Arbitrary files named theme.ts and inline component styles are still inspected.
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const imported = fileImports.get(node.expression.text);
        if (imported?.exported === 'resolveDesignSystemProviderValue' && imported.target.startsWith('@hjmds/design-contracts')) {
          const options = node.arguments[1];
          if (options && ts.isObjectLiteralExpression(options)) for (const property of options.properties) {
            if (ts.isPropertyAssignment(property) && property.name.getText(source) === 'brandPalette' && ts.isObjectLiteralExpression(property.initializer)) {
              ranges.push([property.initializer.getStart(), property.initializer.end]);
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source); tags.set(path, fileTags); paletteRanges.set(path, ranges);
  }
  const resolveDefinition = (path, name, seen = new Set()) => {
    const id = key(path, name);
    if (seen.has(id)) return null;
    seen.add(id);
    const value = definitions.get(id);
    if (value) {
      if (ts.isIdentifier(value)) return resolveDefinition(path, value.text, seen);
      return { path, node: value };
    }
    const imported = imports.get(path)?.get(name);
    if (!imported) {
      // Product adapters are commonly re-exported through ui/index.ts. Follow
      // those bindings, instead of requiring decorative foundation tags at root.
      for (const entry of reexports.get(path) ?? []) {
        if (entry.name && entry.name !== name) continue;
        const target = resolveImport(path, entry.target);
        if (!target) continue;
        const result = resolveDefinition(target, entry.exported ?? name, new Set(seen));
        if (result) return result;
      }
      return null;
    }
    const target = resolveImport(path, imported.target);
    if (!target) return null;
    return resolveDefinition(target, imported.exported === 'default' ? defaults.get(target) ?? 'default' : imported.exported, seen);
  };
  const returnExpressions = (fn) => {
    const body = callable(fn)?.body;
    if (!body) return [];
    if (!ts.isBlock(body)) return [body];
    const returns = [];
    const visit = (node) => {
      if (node !== body && ts.isFunctionLike(node)) return;
      if (ts.isReturnStatement(node) && node.expression) returns.push(node.expression);
      else ts.forEachChild(node, visit);
    };
    visit(body);
    return returns;
  };
  const trace = (entries) => {
    const rendered = new Set();
    const active = new Set();
    const forwardsChildren = (definition) => {
      const fn = callable(definition.node);
      const aliases = new Set();
      const objects = new Set();
      for (const parameter of fn?.parameters ?? []) {
        if (ts.isIdentifier(parameter.name)) objects.add(parameter.name.text);
        if (ts.isObjectBindingPattern(parameter.name)) for (const binding of parameter.name.elements) {
          if ((binding.propertyName?.getText() ?? binding.name.getText()) === 'children') aliases.add(binding.name.getText());
        }
      }
      const usesSlot = (node) => {
        node = unwrap(node);
        if (!node) return false;
        if (ts.isIdentifier(node)) return aliases.has(node.text);
        if (ts.isPropertyAccessExpression(node)) return ts.isIdentifier(node.expression) && objects.has(node.expression.text) && node.name.text === 'children';
        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && node.left.kind === ts.SyntaxKind.FalseKeyword) return false;
        if (ts.isJsxElement(node) || ts.isJsxFragment(node)) return node.children.some(usesSlot);
        if (ts.isJsxExpression(node)) return usesSlot(node.expression);
        if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
          return node.attributes.properties.some((attribute) =>
            ts.isJsxSpreadAttribute(attribute) && ts.isIdentifier(attribute.expression) && objects.has(attribute.expression.text)
            || ts.isJsxAttribute(attribute) && attribute.name.getText() === 'children'
              && attribute.initializer && ts.isJsxExpression(attribute.initializer) && usesSlot(attribute.initializer.expression));
        }
        if (ts.isConditionalExpression(node)) return usesSlot(node.whenTrue) || usesSlot(node.whenFalse);
        if (ts.isBinaryExpression(node)) return usesSlot(node.left) || usesSlot(node.right);
        return false;
      };
      return returnExpressions(definition.node).some(usesSlot);
    };
    const walk = (path, node) => {
      node = unwrap(node);
      if (!node) return;
      if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
        const opening = ts.isJsxElement(node) ? node.openingElement : node;
        const name = opening.tagName.getText();
        const imported = imports.get(path)?.get(name);
        if (imported && (imported.target === rendererPackage || imported.target.startsWith(rendererPackage + '/'))) {
          const theme = opening.attributes.properties.find((attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText() === 'theme');
          const invalidTheme = imported.exported === providerSymbol && theme?.initializer && ts.isStringLiteral(theme.initializer)
            && !['system', 'light', 'dark'].includes(theme.initializer.text);
          if (!invalidTheme) rendered.add(imported.exported);
        }
        const definition = resolveDefinition(path, name);
        if (definition) {
          const id = key(definition.path, name);
          if (!active.has(id)) {
            active.add(id);
            for (const expression of returnExpressions(definition.node)) walk(definition.path, expression);
            active.delete(id);
          }
        }
        // A locally known component that drops its children cannot carry a provider
        // hidden in those children. Imported-but-unused and false JSX remain dead.
        if (ts.isJsxElement(node) && (!definition || forwardsChildren(definition))) for (const child of node.children) walk(path, child);
        return;
      }
      if (ts.isJsxFragment(node)) { for (const child of node.children) walk(path, child); return; }
      if (ts.isJsxExpression(node)) { walk(path, node.expression); return; }
      if (ts.isConditionalExpression(node)) {
        if (node.condition.kind !== ts.SyntaxKind.FalseKeyword) walk(path, node.whenTrue);
        if (node.condition.kind !== ts.SyntaxKind.TrueKeyword) walk(path, node.whenFalse);
        return;
      }
      if (ts.isBinaryExpression(node) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(node.operatorToken.kind)) {
        if (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && node.left.kind === ts.SyntaxKind.FalseKeyword) return;
        walk(path, node.left); walk(path, node.right); return;
      }
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'map') {
        for (const argument of node.arguments) for (const expression of returnExpressions(argument)) walk(path, expression);
        return;
      }
      if (ts.isIdentifier(node)) {
        const definition = resolveDefinition(path, node.text);
        const id = key(path, node.text);
        if (definition && !active.has(id)) { active.add(id); walk(definition.path, definition.node); active.delete(id); }
      }
    };
    for (const path of entries) {
      const candidates = new Set([defaults.get(path), 'App', 'RootLayout'].filter(Boolean));
      for (const name of candidates) {
        const definition = resolveDefinition(path, name);
        if (definition) for (const expression of returnExpressions(definition.node)) walk(definition.path, expression);
      }
    }
    return rendered;
  };
  return { tags, paletteRanges, providerFound: trace(boundaryEntries).has(providerSymbol), renderedFoundations: trace(routeEntries) };
}
