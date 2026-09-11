// Version trains: how every version this portfolio records is compared.
//
// Why a train instead of an exact pin: a patch or minor release inside one major
// carries the fixes we want and no contract change we need to review, so demanding
// the identical patch string from every app buys nothing and costs a portfolio-wide
// lockstep upgrade each time one initializer moves. Reproducibility comes from the
// frozen lockfile, which records one resolved version per install; the standard only
// has to keep apps on a major it has reviewed and above the version it reviewed.
//
// So: a version recorded by the standard is a REVIEWED FLOOR INSIDE ONE MAJOR TRAIN.
// A consumer satisfies it by declaring any version in the same major that is at or
// above the floor, either exactly or through a `~`/`^` range that cannot leave the
// train. Exact equality is required only where an external system keys on the literal
// string (the Release Hub Flutter toolchain profile id, an initializer tarball
// integrity), and those places say so where they are declared.
//
// This module is projected into each app as tools/version-train.mjs, so it must stay
// dependency-free and side-effect-free.

/** Numeric compare of dotted versions; missing components count as 0. */
export function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  for (let index = 0; index < Math.max(pa.length, pb.length); index += 1) {
    const diff = (pa[index] ?? 0) - (pb[index] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Only forms whose whole satisfying set is inside one major are accepted. `^`, `~`
// and an exact version all qualify; `*`, `x`, `>=`, `||`, hyphen ranges, tags and
// non-registry protocols (git:, file:, npm:, workspace:, catalog:) do not, because
// their resolution is not bounded by the train the standard reviewed.
const SPECIFIER = /^([~^]?)(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

/**
 * Parse a manifest specifier into the lowest version it admits.
 * Returns null when the specifier is not train-bounded.
 */
export function parseSpecifier(specifier) {
  if (typeof specifier !== 'string') return null;
  const match = SPECIFIER.exec(specifier.trim());
  if (!match) return null;
  const [, operator, major, minor, patch] = match;
  return { operator: operator || '', major: Number(major), lowest: `${major}.${minor}.${patch}` };
}

/** True for a single concrete version with no range operator. */
export function isExactVersion(value) {
  const parsed = parseSpecifier(value);
  return parsed !== null && parsed.operator === '';
}

/** The major train a recorded floor belongs to. */
export function trainMajor(floor) {
  return Number(String(floor).split('.')[0]);
}

/** Human-readable train, e.g. "57.x at or above 57.0.18". */
export function trainLabel(floor) {
  return `${trainMajor(floor)}.x at or above ${floor}`;
}

/**
 * Check a declared specifier against a recorded floor.
 * Returns null when it satisfies the train, or a reason fragment that reads as
 * `<subject> <reason>` at the call site.
 */
export function trainViolation(specifier, floor) {
  const parsed = parseSpecifier(specifier);
  if (parsed === null) {
    return `is not bounded by the ${trainLabel(floor)} train; declare an exact version or a ~/^ range inside it`;
  }
  if (parsed.major !== trainMajor(floor)) {
    return `is outside the ${trainMajor(floor)}.x train`;
  }
  if (compareVersions(parsed.lowest, floor) < 0) {
    return `admits ${parsed.lowest}, below the reviewed floor ${floor}`;
  }
  return null;
}

/** Same check for a concrete resolved version (lockfile, .nvmrc, installed tool). */
export function resolvedVersionViolation(version, floor) {
  if (!isExactVersion(version)) return `is not a single resolved version inside the ${trainLabel(floor)} train`;
  return trainViolation(version, floor);
}
