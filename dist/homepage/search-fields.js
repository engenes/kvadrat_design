import {art,image,esc} from './ui.js';

// Shared by the homepage's compact search and the catalog's full filter.
const fields=[
 {name:'deal',label:'Тип сделки',icon:'calculator.svg',options:[['buy','Купить'],['rent','Снять']]},
 {name:'type',label:'Тип объекта',icon:'home.svg',options:[['flat','Квартиру'],['house','Дом'],['room','Комнату']]},
 {name:'market',label:'Рынок недвижимости',icon:'calendar.svg',options:[['secondary','Вторичка'],['new','Новостройка']]},
 {name:'rooms',label:'Количество комнат',icon:'plans.svg',options:[['','Комнат'],['1','1 комната'],['2','2 комнаты'],['3','3 комнаты']]},
 {name:'district',label:'Район',icon:'pin.svg',options:[['','Район'],['central','Центральный'],['other','Другой']]}
];
export function searchFields({names,labelled=false}={}){return `<div class="search-fields">${fields.filter(field=>!names||names.includes(field.name)).map(field=>`<label>${labelled?`<span class="search-field-label">${esc(field.label)}</span>`:''}${image(art(field.icon),'','search-field-icon','width="28" height="28"')}<select name="${field.name}" aria-label="${field.label}">${field.options.map(([value,label])=>`<option value="${value}">${esc(labelled&&value===''?(field.name==='rooms'?'Любое':'Любой'):label)}</option>`).join('')}</select></label>`).join('')}</div>`;}
