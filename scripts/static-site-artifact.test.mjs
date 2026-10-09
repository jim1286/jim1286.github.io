import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { inventory, verifyArtifact, renderCaddy, origin } from './static-site-artifact.mjs';
function fixture() {
  const root=mkdtempSync(join(tmpdir(),'portfolio-artifact-test-')); const pub=join(root,'public');
  mkdirSync(join(pub,'ko-KR'),{recursive:true});
  writeFileSync(join(pub,'index.html'),`<link rel="canonical" href="${origin}/" />`);
  writeFileSync(join(pub,'ko-KR/index.html'),`<link rel="canonical" href="${origin}/ko-KR/" />`);
  const save=()=>writeFileSync(join(root,'manifest.json'),JSON.stringify({schemaVersion:1,origin,sourceSha:'a'.repeat(40),files:inventory(pub)}));
  save();return {root,pub,save};
}
test('artifact rejects changed, injected and symlinked public files and another source',()=> {
  const f=fixture();try {
    verifyArtifact(f.root,'a'.repeat(40));
    assert.throws(()=>verifyArtifact(f.root,'b'.repeat(40)),/identity/);
    writeFileSync(join(f.pub,'extra.txt'),'injected');assert.throws(()=>verifyArtifact(f.root),/closure/);rmSync(join(f.pub,'extra.txt'));
    writeFileSync(join(f.pub,'index.html'),'tampered');assert.throws(()=>verifyArtifact(f.root),/digest/);
    symlinkSync('/etc/passwd',join(f.pub,'external.txt'));assert.throws(()=>inventory(f.pub),/Unsupported/);
  } finally {rmSync(f.root,{recursive:true,force:true});}
});
test('a self-consistent manifest cannot publish unbuilt HTML or missing entry assets',()=> {
  const f=fixture();try {
    writeFileSync(join(f.pub,'index.html'),`<link rel="canonical" href="${origin}/" />%PORTFOLIO_TITLE%`);f.save();assert.throws(()=>verifyArtifact(f.root),/Unbuilt/);
    writeFileSync(join(f.pub,'index.html'),`<link rel="canonical" href="${origin}/" /><script src="/assets/missing.js"></script>`);f.save();assert.throws(()=>verifyArtifact(f.root),/Missing HTML asset/);
  } finally {rmSync(f.root,{recursive:true,force:true});}
});
test('edge keeps exact static files, isolated preview and owned www redirect',()=> {
  const production=renderCaddy('/srv/portfolio-site/current/public');assert.match(production,/redir https:\/\/jmstudioapps\.com\{uri\} 308/);assert.doesNotMatch(production,/try_files|reverse_proxy/);
  const preview=renderCaddy('/srv/portfolio-site/current/public',true);assert.match(preview,/admin off/);assert.doesNotMatch(preview,/www\.jmstudioapps/);
  assert.throws(()=>renderCaddy('/srv/portfolio-site/current/public\nmalicious'),/Unsafe/);
});
