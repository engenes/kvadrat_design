import {readFile,writeFile} from 'node:fs/promises';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(await readFile('dist/references/kvadrat-ds/source/feed-import/feed-data.js','utf8'),context);
const {tree,samples,catalog,preset}=JSON.parse(JSON.stringify(context.window.KvFeedData));
const labels={external_id:'ID в источнике',deal_type:'Тип сделки',property_type:'Тип недвижимости',price:'Цена',currency:'Валюта',title:'Заголовок',description:'Описание',address:'Адрес',coords:'Координаты',city_id:'Город',photos:'Фотографии',rooms:'Количество комнат',is_studio:'Студия',is_new_building:'Новостройка',area:'Общая площадь',floor:'Этаж',floors_count:'Этажей в доме',room_type:'Планировка комнат',living_area:'Жилая площадь',kitchen_area:'Площадь кухни',repair_type:'Ремонт',windows_view:'Вид из окон',is_apartments:'Апартаменты',ceiling_height:'Высота потолков',material_type:'Материал дома',build_year:'Год постройки',deposit:'Залог',pets_allowed:'Можно с животными',children_allowed:'Можно с детьми',utilities_included:'Коммунальные включены',material_types:'Материалы стен',land_area:'Площадь участка',heating_type:'Отопление',permitted_use:'Назначение земли',class_type:'Класс здания',layout:'Планировка',purpose_types:'Назначения помещения'};
tree.forEach(g=>{if(g.key==='g_rent')g.group='Аренда';g.fields.forEach(f=>f.label=labels[f.key])});
// Keep the original design's examples and registry; create matching demo adapters for the other two formats.
const avitoPaths={ExternalId:'Id',Category:'OperationType','BargainTerms.Price':'Price','BargainTerms.Currency':'Currency',Title:'Title',Description:'Description',FlatRoomsCount:'Rooms',TotalArea:'Square',LivingArea:'LivingSpace',KitchenArea:'KitchenSpace',FloorNumber:'Floor','Building.FloorsCount':'Floors','Building.MaterialType':'WallsType','Building.BuildYear':'BuiltYear',RepairType:'Renovation',WindowsViewType:'WindowsView',IsApartments:'IsApartments',CeilingHeight:'CeilingHeight','Coordinates.Lat':'Latitude','Coordinates.Lng':'Longitude',Photos:'Images.Image.@url'};
const yrlPaths={ExternalId:'@internal-id',Category:'type','BargainTerms.Price':'price.value','BargainTerms.Currency':'price.currency',Title:'title',Description:'description',FlatRoomsCount:'rooms',TotalArea:'area.value',LivingArea:'living-space.value',KitchenArea:'kitchen-space.value',FloorNumber:'floor','Building.FloorsCount':'floors-total','Building.MaterialType':'building-type','Building.BuildYear':'built-year',RepairType:'renovation',WindowsViewType:'windows-view',IsApartments:'apartments',CeilingHeight:'ceiling-height','Coordinates.Lat':'location.latitude','Coordinates.Lng':'location.longitude',Photos:'image',City:'location.locality-name',Street:'location.address',House:'location.house'};
function adapt(paths,format){const out=samples.map((s,i)=>({...s,_id:(format==='avito'?'AV-':'YR-')+(882145+i),data:Object.fromEntries(Object.entries(s.data).map(([k,v])=>[paths[k]||k,v]))}));out.forEach(s=>{s.data[paths.ExternalId]=s._id});const p=structuredClone(preset);Object.values(p).forEach(m=>{m.source=paths[m.source]||m.source;m.steps.forEach(s=>{for(const k of ['code','template'])if(s.params?.[k])for(const [a,b]of Object.entries(paths))s.params[k]=s.params[k].replaceAll(a,b)})});return {samples:out,preset:p};}
const formats={cian:{samples,preset},avito:adapt(avitoPaths,'avito'),yrl:adapt(yrlPaths,'yrl')};
formats.avito.samples.forEach((s,i)=>{s.data.OperationType=i===1?'Сдам':'Продам';s.data.ObjectType='Квартира'});
formats.avito.preset.deal_type.steps[0].params.rows=[{from:'Продам',to:'sale'},{from:'Сдам',to:'rent_long'}];
formats.avito.preset.property_type.source='ObjectType';formats.avito.preset.property_type.steps[0].params.rows=[{from:'Квартира',to:'flat'}];
formats.avito.samples[1].data.Price='по запросу';
formats.yrl.samples.forEach(s=>{s.data.type='продажа';s.data.category='офис'});
formats.yrl.preset.deal_type.steps[0].params.rows=[{from:'продажа',to:'sale'},{from:'аренда',to:'rent_long'}];
formats.yrl.preset.property_type.source='category';formats.yrl.preset.property_type.steps[0].params.rows=[{from:'офис',to:'office'}];
// Conditional studio data should not present 9 as a real room count.
for(const f of Object.values(formats))f.preset.rooms.steps=[{id:'rooms-normalize',type:'expression',enabled:true,params:{code:'num(value) === 9 ? 0 : num(value)'}}];
await writeFile('dist/feed-reference.json',JSON.stringify({tree,catalog,formats},null,2)+'\n');
console.log('Saved design registry: '+tree.reduce((n,g)=>n+g.fields.length,0)+' fields and three demo formats.');
