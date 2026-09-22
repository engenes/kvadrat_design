import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname,relative,isAbsolute,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {objectPage} from '../dist/object-page/components.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),dist=resolve(root,'dist');
const read=path=>readFile(path,'utf8');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const within=(base,path)=>{const rel=relative(base,path);assert.ok(rel!== '..'&&!rel.startsWith(`..${process.platform==='win32'?'\\':'/'}`)&&!isAbsolute(rel),`Path leaves ${base}: ${path}`);return path;};
const localUrl=(value,from)=>{
 const url=value.replaceAll('&amp;','&').trim();
 if(!url||/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url))return null;
 const path=url.split(/[?#]/)[0];
 return within(dist,path?resolve(url.startsWith('/')?dist:dirname(from),decodeURIComponent(path.replace(/^\//,''))):from);
};
const verifiedFiles=new Set();
async function exists(path){if(verifiedFiles.has(path))return;assert.ok((await stat(path)).isFile(),`Expected local file: ${path}`);verifiedFiles.add(path);}

const provenance=JSON.parse(await read(resolve(dist,'object-page/provenance.json')));
assert.equal(provenance.source.nodeId,'88:0','Wrong source frame provenance.');
assert.match(provenance.source.sha256,/^[a-f\d]{64}$/);
const originalIcons=JSON.parse(await read(resolve(dist,'object-page/assets/provenance.json'))).originalIcons;
assert.deepEqual(provenance.originalIcons,originalIcons,'Original icon manifests differ; rerun source import.');
const sourceAssets=[...provenance.assets,...originalIcons];
for(const asset of sourceAssets){
 const path=within(dist,resolve(dist,asset.path)),bytes=await readFile(path);
 assert.equal(hash(bytes),asset.sha256,`Source asset changed: ${asset.path}`);
 assert.equal(bytes.length,asset.bytes,`Source asset size changed: ${asset.path}`);
}
if(process.argv[2])assert.equal(hash(await readFile(resolve(process.argv[2]))),provenance.source.sha256,'Figma JSON differs from the recorded source.');

const htmlPath=resolve(dist,'property-object.html'),html=await read(htmlPath),rendered=objectPage();
assert.equal(objectPage(),rendered,'objectPage() is not deterministic.');
assert.ok(rendered.length>0&&html.includes(rendered),'Generated HTML is stale; run node scripts/build-object.mjs.');
assert.equal(html.indexOf(rendered),html.lastIndexOf(rendered),'Page content was generated more than once.');

const styles=new Set(),modules=new Set([resolve(dist,'object-page/components.js')]);
for(const match of html.matchAll(/\b(src|href)\s*=\s*(["'])(.*?)\2/gs)){
 const path=localUrl(match[3],htmlPath);if(!path)continue;
 await exists(path);
 if(extname(path)==='.css')styles.add(path);
 if(extname(path)==='.js')modules.add(path);
}
for(const path of styles){
 const css=await read(path);
 for(const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gs)){
  const target=localUrl(match[2],path);if(!target)continue;
  await exists(target);if(extname(target)==='.css')styles.add(target);
 }
}

const scriptPaths=['scripts/import-object.mjs','scripts/build-object.mjs','scripts/verify-object.mjs'].map(path=>resolve(root,path));
for(const path of [...modules,...scriptPaths])modules.add(path);
for(const path of modules){
 await exists(path);
 const source=await read(path);
 const imports=[...source.matchAll(/\b(?:import|export)\s+(?:[^;\n]*?\sfrom\s*)?["']([^"']+)["']/g),...source.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)].map(match=>match[1]);
 for(const specifier of imports){
  if(specifier.startsWith('node:'))continue;
  assert.ok(specifier.startsWith('./')||specifier.startsWith('../'),`Unexpected external module ${specifier} in ${relative(root,path)}`);
  const target=within(root,resolve(dirname(path),specifier));await exists(target);
  if(/\.m?js$/.test(target))modules.add(target);
 }
 const result=spawnSync(process.execPath,['--check',path],{encoding:'utf8',windowsHide:true});
 if(result.error)throw result.error;
 assert.equal(result.status,0,`Invalid JavaScript ${relative(root,path)}:\n${result.stderr}`);
}
console.log(`Object verified: ${sourceAssets.length} source asset hashes, ${verifiedFiles.size} local files, ${styles.size} stylesheets, ${modules.size} JavaScript modules, and current deterministic static HTML${process.argv[2]?', including original JSON hash':''}.`);
