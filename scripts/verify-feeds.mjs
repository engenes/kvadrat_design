import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {number,expression,run,assess,transform} from '../dist/feed-engine.js';
const data=JSON.parse(await readFile('dist/feed-reference.json','utf8')),fields=data.tree.flatMap(g=>g.fields);
assert.equal(fields.length,37);
assert.equal(number('14 500 000 руб.'),14500000);
assert.equal(number('52,1','comma'),52.1);
assert.throws(()=>number('по запросу'));
assert.throws(()=>number('12broken'));
assert.equal(expression('num(value) === 9 ? 0 : num(value)','9'),0);
assert.equal(expression("num(value) + ',' + num(src('lng'))",'55.7',{lng:'37.5'}),'55.7,37.5');
assert.equal(expression('value ? 1 : num("bad")',true),1);
assert.throws(()=>expression('window.location',0));
assert.throws(()=>expression('src.constructor("return window")()',0));
assert.deepEqual(transform(['a','','a','b'],{type:'unique',params:{}},{}),['a','','b']);
const cian=assess(fields,data.formats.cian.preset,data.formats.cian.samples);
assert.equal(cian.required,4);assert.equal(cian.covered,4);
assert.ok(cian.issues.some(i=>i.field.key==='repair_type'&&i.index===1));
const avito=assess(fields,data.formats.avito.preset,data.formats.avito.samples);
assert.equal(avito.covered,3);assert.ok(avito.issues.some(i=>i.field.key==='price'));
const fixed=structuredClone(data.formats.avito.preset);fixed.price={mode:'const',const:85000,steps:[]};
assert.equal(assess(fields,fixed,data.formats.avito.samples).covered,4);
assert.equal(run(fields.find(f=>f.key==='price'),{mode:'feed',source:'missing',steps:[]},{}).error,'Обязательное значение отсутствует');
assert.equal(assess(fields,{},[]).covered,0);
for(const file of ['feeds.html','feeds.css','feeds-ux.html']){
 const content=await readFile('dist/'+file,'utf8');
 for(const m of content.matchAll(/(?:src|href)="([^"#]+)"|url\(['"]?([^'"\)]+)['"]?\)/g)){
  const path=(m[1]||m[2]).split('#')[0];if(!path||/^(https?:|data:)/.test(path))continue;await access('dist/'+path);
 }
}
console.log('Feed checks passed: 37 fields, 3 format fixtures, all-record validation, numeric parsing, safe expressions, and local assets.');
