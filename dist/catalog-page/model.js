export const defaultFilters={deal:'buy',type:'flat',market:'secondary',rooms:'',district:'',minPrice:'',maxPrice:'',minArea:'',maxArea:'',minFloor:'',maxFloor:'',walls:'',renovated:false};
export function filterProperties(properties,filters){
 // District and renovation are not supplied by the design: do not infer them.
 if(filters.deal!=='buy'||filters.type!=='flat'||filters.market!=='secondary'||filters.district||filters.renovated)return [];
 return properties.filter(item=>(!filters.rooms||item.rooms===Number(filters.rooms))&&(!filters.walls||item.walls===filters.walls)&&[['Price',item.price],['Area',item.area],['Floor',Number(item.floor.split('/')[0])]].every(([field,value])=>(filters[`min${field}`]===''||value>=Number(filters[`min${field}`]))&&(filters[`max${field}`]===''||value<=Number(filters[`max${field}`]))));
}
export function sortProperties(properties,sort){return sort==='price-asc'?[...properties].sort((a,b)=>a.price-b.price):sort==='price-desc'?[...properties].sort((a,b)=>b.price-a.price):[...properties];}
export function paginate(properties,page,size){const pageCount=Math.max(1,Math.ceil(properties.length/size));const current=Math.min(Math.max(1,page),pageCount);return {items:properties.slice((current-1)*size,current*size),page:current,pageCount};}
export function validateFilters(filters){for(const field of ['Price','Area','Floor']){const min=filters[`min${field}`],max=filters[`max${field}`];if([min,max].some(v=>v!==''&&(!Number.isFinite(Number(v))||Number(v)<0)))return 'Введите положительные числа в полях диапазона.';if(min!==''&&max!==''&&Number(min)>Number(max))return 'Значение «от» должно быть не больше значения «до».';}return '';}
