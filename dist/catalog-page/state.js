import {defaultFilters} from './model.js';

export const defaultCatalogState={filters:defaultFilters,sort:'source',page:1,pageSize:20,favoritesOnly:false};
const supportedSorts=new Set(['source','price-asc','price-desc']);
const numericFields=['Price','Area','Floor'];
const rangeNames={Price:'Цена',Area:'Площадь',Floor:'Этаж'};

export function objectCount(count){
 const remainder=count%100,last=count%10;
 return `${count} ${remainder>=11&&remainder<=14?'объектов':last===1?'объект':last>=2&&last<=4?'объекта':'объектов'}`;
}

export function parseCatalogState(search,options={}){
 const query=new URLSearchParams(search),filters={...defaultFilters};
 for(const [name,initial] of Object.entries(defaultFilters)){
  if(!query.has(name))continue;
  const value=/^(min|max)(Price|Area|Floor)$/.test(name)?query.get(name).trim():query.get(name);
  if(typeof initial==='boolean')filters[name]=value==='true';
  else if(!options[name]||options[name].includes(value))filters[name]=value;
 }
 const positiveInteger=(name,fallback)=>{const value=Number(query.get(name));return Number.isSafeInteger(value)&&value>0?value:fallback;};
 return {filters,sort:supportedSorts.has(query.get('sort'))?query.get('sort'):'source',page:positiveInteger('page',1),pageSize:[12,20].includes(Number(query.get('pageSize')))?Number(query.get('pageSize')):20,favoritesOnly:query.get('favorites')==='true'};
}

export function catalogUrl(href,state){
 const url=new URL(href);
 for(const [name,initial] of Object.entries(defaultFilters)){
  url.searchParams.delete(name);
  if(state.filters[name]!==initial)url.searchParams.set(name,String(state.filters[name]));
 }
 for(const name of ['sort','page','pageSize']){
  url.searchParams.delete(name);
  if(state[name]!==defaultCatalogState[name])url.searchParams.set(name,String(state[name]));
 }
 url.searchParams.delete('favorites');
 if(state.favoritesOnly)url.searchParams.set('favorites','true');
 return url;
}

export function filterIssue(filters){
 for(const field of numericFields){
  const names=[`min${field}`,`max${field}`],values=names.map(name=>filters[name]);
  const invalid=values.findIndex(value=>value!==''&&(!/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)||!Number.isFinite(Number(value))||Number(value)<0));
  if(invalid!==-1)return {fields:[names[invalid]],message:`${rangeNames[field]}: введите число не меньше нуля.`};
  if(field==='Floor'){
   const fractional=values.findIndex(value=>value!==''&&!Number.isInteger(Number(value)));
   if(fractional!==-1)return {fields:[names[fractional]],message:'Этаж: укажите целое число.'};
  }
  if(values.every(value=>value!=='')&&Number(values[0])>Number(values[1]))return {fields:names,message:`${rangeNames[field]}: значение «от» должно быть не больше значения «до».`};
 }
 return null;
}

export function sameFilters(left,right){return Object.keys(defaultFilters).every(name=>left[name]===right[name]);}

export function filterChips(filters,labels={}){
 return Object.entries(defaultFilters).filter(([name,initial])=>filters[name]!==initial).map(([name])=>{
  const value=filters[name];
  if(name==='renovated')return {name,label:'С ремонтом'};
  const range=/^(min|max)(Price|Area|Floor)$/.exec(name);
  if(range){const [,direction,field]=range;return {name,label:`${rangeNames[field]} ${direction==='min'?'от':'до'} ${Number(value).toLocaleString('ru-RU')}${field==='Price'?' ₽':field==='Area'?' м²':''}`};}
  const label=labels[name]?.[value]||String(value);
  return {name,label:name==='walls'?`Стены: ${label}`:name==='district'?`Район: ${label}`:label};
 });
}

export function catalogContext(filters){
 const action=filters.deal==='rent'?'Снять':'Купить';
 const object={flat:'квартиру',house:'дом',room:'комнату'}[filters.type]||'недвижимость';
 const plural={flat:'Квартиры',house:'Дома',room:'Комнаты'}[filters.type]||'Недвижимость';
 const market=filters.market==='new'?'Новостройки':'Вторичное жильё';
 return {title:`${action} ${object} в Оренбурге`,breadcrumb:plural,summary:`${filters.deal==='rent'?'Аренда':'Покупка'} · ${plural} · ${market}`,subtitle:`${market}. Сравните цену, площадь и характеристики, сохраните подходящие варианты.`};
}
