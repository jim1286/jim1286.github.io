import { createHash } from 'node:crypto';
import { verifyArtifact, origin } from './static-site-artifact.mjs';

// A successful SSH promotion is separate from the bytes served through public TLS.
export async function verifyPublicArtifact(artifact, source, request = fetch) {
  const manifest = verifyArtifact(artifact, source);
  for (const file of manifest.files) {
    const response = await request(origin + file.path, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    if (response.status !== 200) throw new Error(`Public status ${response.status}: ${file.path}`);
    const body = Buffer.from(await response.arrayBuffer());
    if (body.length !== file.bytes || createHash('sha256').update(body).digest('hex') !== file.sha256)
      throw new Error(`Public bytes differ: ${file.path}`);
  }
  const redirect = await request('https://www.jmstudioapps.com/ko-KR/?publication=verify', {
    redirect: 'manual', signal: AbortSignal.timeout(15000),
  });
  if (redirect.status !== 308 || redirect.headers.get('location') !== `${origin}/ko-KR/?publication=verify`)
    throw new Error('www redirect does not preserve path and query');
  for (const path of ['/__missing__', '/manifest.json', '/.env']) {
    const response = await request(origin + path, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    if (response.status !== 404) throw new Error(`Unexpected public route: ${path}`);
    await response.arrayBuffer();
  }
  return { sourceSha: manifest.sourceSha, fileCount: manifest.files.length };
}

if (import.meta.main) {
  const [artifact, source] = process.argv.slice(2);
  if (!artifact || !/^[0-9a-f]{40}$/.test(source ?? '')) throw new Error('Usage: verify-static-site-public.mjs ARTIFACT SOURCE_SHA');
  console.log(JSON.stringify(await verifyPublicArtifact(artifact, source)));
}
