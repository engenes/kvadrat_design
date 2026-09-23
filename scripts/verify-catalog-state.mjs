import assert from 'node:assert/strict';
import {defaultFilters} from '../dist/catalog-page/model.js';
import {defaultCatalogState,parseCatalogState,catalogUrl,filterIssue,sameFilters,objectCount,filterChips,catalogContext} from '../dist/catalog-page/state.js';

const options={deal:['buy','rent'],type:['flat','house','room'],market:['secondary','new'],rooms:['','1','2','3'],district:['','central','other'],walls:['','Монолит','Панель','Кирпич']};
const initialFilters=JSON.stringify(defaultFilters);
assert.deepEqual(parseCatalogState('',options),defaultCatalogState);
const parsed=parseCatalogState('?rooms=1',options);
parsed.filters.rooms='3';
assert.equal(JSON.stringify(defaultFilters),initialFilters,'Parsing must not return the shared default filters by reference.');

const selected={
 filters:{...defaultFilters,deal:'rent',type:'house',market:'new',rooms:'3',district:'central',minPrice:'1250000.5',maxPrice:'5000000',minArea:'45.5',maxArea:'120',minFloor:'0',maxFloor:'9',walls:'Кирпич',renovated:true},
 sort:'price-desc',page:2,pageSize:12,favoritesOnly:true
};
const base='http://127.0.0.1:4317/property-catalog.html?utm_source=local&rooms=2&sort=price-asc#catalog-results';
const serialized=catalogUrl(base,selected);
assert.deepEqual(parseCatalogState(serialized.search,options),selected,'Shareable URLs restore all applied filters, sorting, pagination and favorites mode.');
assert.equal(serialized.searchParams.get('utm_source'),'local');
assert.equal(serialized.hash,'#catalog-results');
assert.equal(serialized.searchParams.getAll('rooms').length,1,'Serialization replaces old values rather than accumulating duplicates.');
assert.equal(catalogUrl(serialized.href,selected).href,serialized.href,'Serializing an unchanged state is stable.');
const reset=catalogUrl(serialized.href,defaultCatalogState);
assert.equal(reset.search,'?utm_source=local','Reset removes catalog parameters while retaining unrelated URL parameters.');
assert.deepEqual(parseCatalogState(reset.search,options),defaultCatalogState);

for(const [name,allowed] of Object.entries(options)){
 const unknown=new URLSearchParams({[name]:'<img src=x onerror=alert(1)>'});
 assert.equal(parseCatalogState(unknown,options).filters[name],defaultFilters[name],`${name}: unknown option must fall back to the default.`);
 for(const value of allowed)assert.equal(parseCatalogState(new URLSearchParams({[name]:value}),options).filters[name],value,`${name}: recognized option is preserved.`);
}
for(const value of ['-1','0','1.5','Infinity','NaN','9007199254740992'])assert.equal(parseCatalogState(`?page=${value}`,options).page,1,`Invalid page ${value} must use the first page.`);
for(const value of ['-1','0','10','12.5','100','Infinity'])assert.equal(parseCatalogState(`?pageSize=${value}`,options).pageSize,20);
assert.equal(parseCatalogState('?sort=unknown&favorites=1&renovated=1',options).sort,'source');
assert.equal(parseCatalogState('?favorites=1&renovated=1',options).favoritesOnly,false);
assert.equal(parseCatalogState('?favorites=1&renovated=1',options).filters.renovated,false);
assert.equal(parseCatalogState('?favorites=true&renovated=true',options).favoritesOnly,true);
assert.equal(parseCatalogState('?favorites=true&renovated=true',options).filters.renovated,true);
assert.equal(parseCatalogState('?minArea=abc',options).filters.minArea,'abc','Invalid numeric URL values remain available to validation instead of silently changing the search.');

assert.equal(filterIssue(defaultFilters),null);
for(const field of ['Price','Area','Floor']){
 for(const bound of ['min','max']){
  const name=`${bound}${field}`;
  for(const value of ['-1','abc','NaN','Infinity']){
   const issue=filterIssue({...defaultFilters,[name]:value});
   assert.deepEqual(issue?.fields,[name],`${name}=${value} must identify the invalid input.`);
   assert.ok(issue.message.length>0,'Invalid inputs need a textual error.');
  }
  assert.equal(filterIssue({...defaultFilters,[name]:'0'}),null,'Zero is allowed by the range fields.');
 }
 assert.deepEqual(filterIssue({...defaultFilters,[`min${field}`]:'9',[`max${field}`]:'2'})?.fields,[`min${field}`,`max${field}`],'Reversed ranges identify both bounds.');
 assert.equal(filterIssue({...defaultFilters,[`min${field}`]:'2',[`max${field}`]:'2'}),null,'Equal bounds are valid.');
}
for(const name of ['minFloor','maxFloor'])assert.deepEqual(filterIssue({...defaultFilters,[name]:'1.5'}),{fields:[name],message:'Этаж: укажите целое число.'});
assert.equal(filterIssue({...defaultFilters,minPrice:'12.5',maxPrice:'13.75',minArea:'20.25',maxArea:'20.5'}),null,'Price and area support fractional values.');
assert.equal(sameFilters(defaultFilters,{...defaultFilters}),true);
for(const [name,value] of Object.entries(selected.filters))if(value!==defaultFilters[name])assert.equal(sameFilters(defaultFilters,{...defaultFilters,[name]:value}),false,`Draft detection includes ${name}.`);

for(const [count,label] of [[0,'объектов'],[1,'объект'],[2,'объекта'],[4,'объекта'],[5,'объектов'],[11,'объектов'],[12,'объектов'],[14,'объектов'],[20,'объектов'],[21,'объект'],[22,'объекта'],[25,'объектов'],[101,'объект'],[111,'объектов'],[121,'объект']])assert.equal(objectCount(count),`${count} ${label}`);

assert.deepEqual(filterChips(defaultFilters),[],'Default conditions do not create redundant removable chips.');
const chips=filterChips({...defaultFilters,rooms:'2',district:'central',minPrice:'1250000',maxArea:'45.5',minFloor:'0',walls:'Кирпич',renovated:true},{rooms:{2:'2 комнаты'},district:{central:'Центральный'}});
assert.equal(new Set(chips.map(chip=>chip.name)).size,chips.length,'Each active condition has one removable chip.');
const chipLabels=Object.fromEntries(chips.map(chip=>[chip.name,chip.label.replace(/\s/g,' ')]));
assert.deepEqual(chipLabels,{rooms:'2 комнаты',district:'Район: Центральный',minPrice:'Цена от 1 250 000 ₽',maxArea:'Площадь до 45,5 м²',minFloor:'Этаж от 0',walls:'Стены: Кирпич',renovated:'С ремонтом'});
const unsafe='<img src=x onerror="alert(1)"> & текст';
assert.deepEqual(filterChips({...defaultFilters,walls:unsafe}),[{name:'walls',label:`Стены: ${unsafe}`}],'State labels remain plain text; escaping belongs to the rendering boundary.');
assert.deepEqual(filterChips({...defaultFilters,rooms:'1'},{rooms:{1:unsafe}}),[{name:'rooms',label:unsafe}]);
assert.equal(catalogContext(defaultFilters).title,'Купить квартиру в Оренбурге');
assert.equal(catalogContext({...defaultFilters,deal:'rent',type:'house',market:'new'}).title,'Снять дом в Оренбурге');
assert.equal(catalogContext({...defaultFilters,type:'unknown'}).breadcrumb,'Недвижимость');
assert.equal(JSON.stringify(defaultFilters),initialFilters,'State helpers do not mutate the model defaults.');

console.log('Catalog state verified: URL roundtrips, safe select values, numeric validation, draft detection, Russian counts, filter chips and contextual titles.');
