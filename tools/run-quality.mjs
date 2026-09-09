#!/usr/bin/env node
import { runBoundQuality } from './runtime-bindings.mjs';
import { resolve } from 'node:path';
try { await runBoundQuality(resolve(import.meta.dirname, '..'), process.argv[2] ?? 'check'); }
catch (error) { console.error(error.message); process.exitCode = 1; }
