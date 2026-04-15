/**
 * hash-assets.mjs
 * Reads style.css, js/main.js, js/sanity.js — computes a 10-char SHA-256
 * fingerprint for each — then rewrites the ?v= query strings in index.html.
 *
 * Usage:  node scripts/hash-assets.mjs
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function hash(file) {
  return createHash('sha256')
    .update(readFileSync(join(root, file)))
    .digest('hex')
    .slice(0, 10);
}

const assets = {
  'style.css':    hash('style.css'),
  'js/main.js':   hash('js/main.js'),
  'js/sanity.js': hash('js/sanity.js'),
};

let html = readFileSync(join(root, 'index.html'), 'utf8');

html = html.replace(/href="\/style\.css\?v=[^"]*"/, `href="/style.css?v=${assets['style.css']}"`);
html = html.replace(/src="\/js\/main\.js\?v=[^"]*"/, `src="/js/main.js?v=${assets['js/main.js']}"`);
html = html.replace(/src="\/js\/sanity\.js\?v=[^"]*"/, `src="/js/sanity.js?v=${assets['js/sanity.js']}"`);

writeFileSync(join(root, 'index.html'), html, 'utf8');

console.log('Asset hashes updated:');
Object.entries(assets).forEach(([f, h]) => console.log(`  ${f} → ${h}`));
