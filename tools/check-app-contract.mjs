#!/usr/bin/env node

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkAppConformance } from './app-standard-core.mjs';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stageIndex = process.argv.indexOf('--target-stage');
const targetStage = stageIndex === -1 ? undefined : process.argv[stageIndex + 1];
const result = await checkAppConformance(appRoot, { targetStage });
if (result.mode === 'rehearsal') {
  const actionable = result.findings.filter((item) => !result.blockedByPortfolioAuthority.includes(item));
  process.stdout.write('app contract rehearsal (' + result.targetStage + '): '
    + actionable.length + ' actionable, ' + result.blockedByPortfolioAuthority.length + ' blocked by portfolio authority; no stage is granted by a rehearsal\n');
  for (const finding of actionable) process.stderr.write('  - [' + finding.code + '] ' + finding.path + ': ' + finding.message + '\n');
  for (const finding of result.blockedByPortfolioAuthority) process.stderr.write('  ~ [' + finding.code + '] ' + finding.path + ' (portfolio authority)\n');
  if (!result.ok) process.exitCode = 1;
} else if (result.ok) {
  process.stdout.write('app contract: ready (' + result.stage + ')\n');
} else {
  for (const finding of result.findings) {
    process.stderr.write('[' + finding.code + '] ' + finding.path + ': ' + finding.message + '\n');
  }
  process.exitCode = 1;
}
