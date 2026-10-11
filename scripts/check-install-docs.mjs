import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

for (const locale of ['zh', 'en', 'ja']) {
  for (const page of ['quick-install', 'backup-upgrade']) {
    const path = `src/content/docs/${locale}/${page}.md`;
    const content = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    const images = [...content.matchAll(/^\s*image:\s*(\S+)\s*$/gm)].map(match => match[1]);
    assert.deepEqual(images, ['ghcr.io/pls-1q43/dibao:latest'], `${path}: Docker examples must use latest`);
    assert.ok(content.includes('docker compose pull'), `${path}: explain how to pull updates`);
    assert.ok(content.includes('docker compose up -d'), `${path}: explain how to recreate the container`);
  }
}

console.log('Docker installation and upgrade examples use latest in all three languages.');
