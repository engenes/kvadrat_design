import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {catalogData} from '../dist/catalog-page/data.js';
import {defaultFilters,filterProperties,sortProperties,paginate,validateFilters} from '../dist/catalog-page/model.js';
import {propertyCard} from '../dist/homepage/cards.js';
import {properties as homeProperties} from '../dist/homepage/data.js';
import {searchFields} from '../dist/homepage/search-fields.js';
const properties=catalogData.properties;
assert.equal(properties.length,20);assert.equal(new Set(properties.map(p=>p.id)).size,20);
assert.equal(filterProperties(properties,defaultFilters).length,20);
assert.equal(filterProperties(properties,{...defaultFilters,rooms:'1'}).length,10);
assert.equal(filterProperties(properties,{...defaultFilters,rooms:'2'}).length,0);
assert.equal(filterProperties(properties,{...defaultFilters,minPrice:'3000000',minArea:'80',maxFloor:'6'}).length,10);
assert.equal(filterProperties(properties,{...defaultFilters,rooms:'1',walls:'Кирпич'}).length,5);
assert.equal(filterProperties(properties,{...defaultFilters,district:'central'}).length,0);
assert.equal(filterProperties(properties,{...defaultFilters,renovated:true}).length,0);
assert.equal(validateFilters({...defaultFilters,minPrice:'9000000',maxPrice:'1000000'}),'Значение «от» должно быть не больше значения «до».');
assert.ok(validateFilters({...defaultFilters,minArea:'abc'}));
assert.ok(validateFilters({...defaultFilters,minFloor:'-2'}));
const before=JSON.stringify(properties),sorted=sortProperties(properties,'price-desc');
assert.equal(sorted[0].price,4650000);assert.equal(sorted.at(-1).price,2650000);assert.equal(JSON.stringify(properties),before);
assert.equal(paginate(properties,1,12).items.length,12);assert.equal(paginate(properties,2,12).items.length,8);assert.equal(paginate(properties,9,12).page,2);
assert.deepEqual(paginate([],1,12),{items:[],page:1,pageCount:1});
assert.match(propertyCard(properties[0]),/<dt>Стены:<\/dt><dd>Монолит/);
assert.match(propertyCard(homeProperties[0]),/<dt>Сдача:<\/dt><dd>Сдан/);
assert.ok(!propertyCard({...properties[0],walls:'<script>'}).includes('<script>'));
const catalog=await readFile('dist/property-catalog.html','utf8'),home=await readFile('dist/homepage.html','utf8');
assert.ok(catalog.includes(searchFields())&&home.includes(searchFields()));
assert.equal((catalog.match(/class="property-card"/g)||[]).length,20);
assert.ok(!catalog.includes('undefined'));assert.ok(home.includes('property-catalog.html'));
for(const file of ['dist/property-catalog.html','dist/homepage.html','dist/homepage-components.html','dist/catalog-page/styles.css']){
 const content=await readFile(file,'utf8');
 for(const match of content.matchAll(/(?:src|href)="([^"#]+)"|url\(['"]?([^'"\)]+)['"]?\)/g)){
  const path=(match[1]||match[2]).split('#')[0];if(/^(data:|https?:|tel:|mailto:)/.test(path)||!path)continue;
  await access(resolve(dirname(file),path));
 }
}
const provenance=JSON.parse(await readFile('dist/catalog-page/provenance.json','utf8'));
for(const asset of provenance.assets)assert.equal(createHash('sha256').update(await readFile(`dist/${asset.path}`)).digest('hex'),asset.sha256);
for(const dir of ['dist/homepage','dist/catalog-page'])for(const file of (await readdir(dir)).filter(f=>f.endsWith('.js'))){const result=spawnSync(process.execPath,['--check',`${dir}/${file}`],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);}
console.log('Catalog verified: real exported records/assets, filtering, validation, sorting, pagination, shared homepage rendering and local links.');
