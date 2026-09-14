import {registry,defaults,fieldsFor} from './builder-schema.js';
const clone=value=>structuredClone(value);
const uid=()=>crypto.randomUUID();
export const rowWidth=row=>row.blocks.reduce((sum,b)=>sum+b.span,0);
export function findBlock(page,id){for(const row of page.rows){const block=row.blocks.find(b=>b.id===id);if(block)return {row,block};}return null;}
export function newBlock(kind){if(!Object.hasOwn(registry,kind))throw Error('Неизвестный тип блока');return {id:uid(),kind,span:registry[kind].width,props:defaults(kind)};}
export function initialPage(){
 const groups=[['hero_slider'],['heading'],['advantages'],['text','lead_form'],['property_grid'],['photo_gallery'],['cta_banner']];
 const rows=groups.map(kinds=>({id:uid(),blocks:kinds.map(newBlock)}));
 rows[3].blocks[0].span=7;rows[3].blocks[1].span=5;rows[5].blocks[0].span=8;
 return {version:1,title:'О компании',rows};
}
// Imported files and stored drafts enter through the same bounded schema.
export function validatePage(raw){
 if(!raw||raw.version!==1||typeof raw.title!=='string'||raw.title.length>160||!Array.isArray(raw.rows)||raw.rows.length>100)throw Error('Некорректный формат страницы');
 const ids=new Set();let count=0;
 const checkId=id=>{if(typeof id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(id)||ids.has(id))throw Error('Некорректный идентификатор');ids.add(id);return id;};
 const rows=raw.rows.map(row=>{
  const id=checkId(row.id);
  if(!Array.isArray(row.blocks)||!row.blocks.length||row.blocks.length>4)throw Error('Некорректная строка');
  const blocks=row.blocks.map(b=>{
   if(++count>300||!Object.hasOwn(registry,b.kind))throw Error('Неизвестный блок или превышен лимит');
   if(!Number.isInteger(b.span)||b.span<registry[b.kind].min||b.span>12)throw Error('Недопустимая ширина блока');
   const props=defaults(b.kind);
   for(const f of fieldsFor(b.kind)){
    const value=b.props?.[f.key]??f.value;
    if(f.type==='checkbox'?typeof value!=='boolean':f.type==='number'?(!Number.isInteger(value)||value<f.min||value>f.max):(typeof value!=='string'||value.length>5000||(f.options&&!f.options.includes(value))))throw Error('Некорректное значение настройки');
    props[f.key]=value;
   }
   return {id:checkId(b.id),kind:b.kind,span:b.span,props};
  });
  if(rowWidth({blocks})>12)throw Error('В строке больше 12 колонок');
  return {id,blocks};
 });
 return {version:1,title:raw.title,rows};
}
export class PageModel{
 constructor(page=initialPage()){this.page=validatePage(page);this.past=[];this.future=[];this.mergeKey=null;}
 change(fn,key=null){
  const next=clone(this.page);const result=fn(next);const checked=validatePage(next);
  if(JSON.stringify(checked)===JSON.stringify(this.page))return result;
  if(!key||key!==this.mergeKey)this.past.push(clone(this.page));
  if(this.past.length>80)this.past.shift();this.page=checked;this.future=[];this.mergeKey=key;return result;
 }
 undo(){if(!this.past.length)return;this.future.push(this.page);this.page=this.past.pop();this.mergeKey=null;}
 redo(){if(!this.future.length)return;this.past.push(this.page);this.page=this.future.pop();this.mergeKey=null;}
 replace(page){const valid=validatePage(page);this.change(next=>Object.assign(next,valid));}
 resize(id,span,key=null){this.change(page=>{const entry=findBlock(page,id);if(!entry)return;const max=12-rowWidth(entry.row)+entry.block.span;entry.block.span=Math.max(registry[entry.block.kind].min,Math.min(Math.round(span),max));},key);}
 update(id,key,value,mergeKey=null){this.change(page=>{const b=findBlock(page,id)?.block;if(b&&fieldsFor(b.kind).some(f=>f.key===key))b.props[key]=value;},mergeKey);}
 remove(id){this.change(page=>{const e=findBlock(page,id);if(!e)return;e.row.blocks=e.row.blocks.filter(b=>b.id!==id);page.rows=page.rows.filter(r=>r.blocks.length);});}
 duplicate(id){return this.change(page=>{const e=findBlock(page,id);if(!e)return;const b=clone(e.block);b.id=uid();const free=12-rowWidth(e.row);if(free>=registry[b.kind].min){b.span=Math.min(b.span,free);e.row.blocks.splice(e.row.blocks.indexOf(e.block)+1,0,b);}else page.rows.splice(page.rows.indexOf(e.row)+1,0,{id:uid(),blocks:[b]});return b.id;});}
 place(payload,target){return this.change(page=>{
  const existing=payload.id?findBlock(page,payload.id):null;
  const b=existing?clone(existing.block):payload.kind?newBlock(payload.kind):null;if(!b)throw Error('Блок не найден');
  const targetRow=target.rowId?page.rows.find(r=>r.id===target.rowId):null;
  if(target.rowId&&!targetRow)throw Error('Строка не найдена');
  if(targetRow===existing?.row)return b.id;
  if(targetRow){const free=12-rowWidth(targetRow);if(free<registry[b.kind].min)throw Error(`Недостаточно места: нужно ${registry[b.kind].min}, свободно ${free} колонок`);b.span=Math.min(b.span,free);}
  let index=target.beforeId?page.rows.findIndex(r=>r.id===target.beforeId):page.rows.length;
  if(index<0)throw Error('Место вставки не найдено');
  if(existing){existing.row.blocks=existing.row.blocks.filter(x=>x.id!==b.id);}
  if(targetRow)targetRow.blocks.push(b);else page.rows.splice(index,0,{id:uid(),blocks:[b]});
  page.rows=page.rows.filter(r=>r.blocks.length);return b.id;
 });}
 move(id,direction){this.change(page=>{
  const e=findBlock(page,id);if(!e)return;const i=e.row.blocks.indexOf(e.block),j=i+direction;
  if(j>=0&&j<e.row.blocks.length){[e.row.blocks[i],e.row.blocks[j]]=[e.row.blocks[j],e.row.blocks[i]];return;}
  const rowIndex=page.rows.indexOf(e.row),nextIndex=rowIndex+direction;
  if(nextIndex<0||nextIndex>=page.rows.length)return;
  e.row.blocks.splice(i,1);page.rows.splice(direction<0?nextIndex:nextIndex+1,0,{id:uid(),blocks:[e.block]});page.rows=page.rows.filter(r=>r.blocks.length);
 });}
}
