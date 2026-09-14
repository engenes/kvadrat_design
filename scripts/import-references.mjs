import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, join, relative, dirname } from 'node:path';
import { createHash } from 'node:crypto';
const source = resolve(process.argv[2]);
const target = resolve('dist/references');
const files = [];
async function walk(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) await walk(path);
    else {
      const name = relative(source, path).replaceAll('\\', '/');
      const destination = join(target, name);
      await mkdir(dirname(destination), { recursive: true });
      await copyFile(path, destination);
      const bytes = await readFile(destination);
      files.push({ path: name, size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
    }
  }
}
await walk(source);
const tokens = {};
for (const group of ['colors', 'typography', 'spacing', 'shadows']) {
  const css = await readFile(join(source, 'kvadrat-ds/tokens', `${group}.css`), 'utf8');
  tokens[group] = [...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => ({ name, value: value.trim() }));
}
await writeFile('dist/catalog.json', JSON.stringify({ imported: '2026-09-14', files: files.sort((a,b) => a.path.localeCompare(b.path)), tokens }, null, 2));
console.log(`Imported ${files.length} files with SHA-256 verification metadata.`);
