import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root=resolve('dist');
const catalog=JSON.parse(await readFile(join(root,'catalog.json'),'utf8'));
const failures=[];
for(const file of catalog.files){
 const bytes=await readFile(join(root,'references',file.path));
 const hash=createHash('sha256').update(bytes).digest('hex');
 if(hash!==file.sha256||bytes.length!==file.size)failures.push(`Changed reference: ${file.path}`);
 if(file.size>25*1024*1024)failures.push(`Asset too large: ${file.path}`);
}
for(const file of ['index.html','styles.css',...['fonts','colors','typography','spacing','shadows'].map(name=>`references/kvadrat-ds/tokens/${name}.css`)]){
 const content=await readFile(join(root,file),'utf8');
 const paths=[...content.matchAll(/(?:src|href)="([^"#]+)"|url\(['"]?([^'"\)]+)['"]?\)/g)].map(match=>match[1]||match[2]);
 for(const path of paths){if(/^(data:|https?:)/.test(path))continue;try{await access(resolve(dirname(join(root,file)),path))}catch{failures.push(`Missing local asset: ${file} -> ${path}`)}}
}
for(const file of ['app.js','library.js','components.js']){
 const check=spawnSync(process.execPath,['--check',join(root,file)],{encoding:'utf8'});
 if(check.status!==0)failures.push(check.stderr||String(check.error||`Syntax check failed: ${file}`));
}
if(catalog.files.length!==167)failures.push('Unexpected reference count');
if(catalog.files.filter(f=>f.path.includes('/screenshots/')).length!==28)failures.push('Unexpected screenshot count');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Verified ${catalog.files.length} reference hashes, 28 screenshots, local entrypoints, token font paths and JavaScript syntax.`);
