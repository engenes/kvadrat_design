import {catalogData} from './data.js';
import {defaultFilters,filterProperties,sortProperties,paginate,validateFilters} from './model.js';
import {resultCards} from './components.js';
import {esc,image} from '../homepage/ui.js';

const form=document.querySelector('#catalog-filter');
const dialog=document.querySelector('#catalog-dialog'),dialogContent=document.querySelector('#catalog-dialog-content');
const results=document.querySelector('#catalog-results');
let filters={...defaultFilters},sort='source',page=1,pageSize=20,opener;
function readFilters(){const data=new FormData(form);return Object.fromEntries(Object.entries(defaultFilters).map(([name,value])=>[name,typeof value==='boolean'?data.has(name):String(data.get(name)??'')]));}
function showFormError(error){const output=form.querySelector('.filter-error');output.hidden=!error;output.textContent=error;}
function updateCandidateCount(){const candidate=readFilters();form.querySelector('.filter-submit').textContent=`Показать ${filterProperties(catalogData.properties,candidate).length} объектов`;}
function render({focus=false}={}){
 const found=sortProperties(filterProperties(catalogData.properties,filters),sort);
 const slice=paginate(found,page,pageSize);page=slice.page;
 document.querySelector('#results-count').textContent=`Найдено ${found.length} объектов`;
 document.querySelector('#catalog-cards').innerHTML=resultCards(slice.items);
 const empty=document.querySelector('.catalog-empty');empty.hidden=found.length>0;
 empty.querySelector('p').textContent=filters.district||filters.renovated?'В сохранённом макете нет сведений о районе и ремонте. Уберите эти условия, чтобы посмотреть доступные объекты.':'Попробуйте изменить условия поиска.';
 document.querySelector('.page-status').textContent=found.length?`${(page-1)*pageSize+1}–${Math.min(page*pageSize,found.length)} из ${found.length} объектов`:'Нет объектов';
 document.querySelector('#catalog-pages').innerHTML=Array.from({length:slice.pageCount},(_,index)=>`<button type="button" data-page="${index+1}" ${index+1===page?'aria-current="page"':''} aria-label="Страница ${index+1}">${index+1}</button>`).join('');
 document.querySelector('[data-sort="source"]').setAttribute('aria-pressed',String(sort==='source'));
 const price=document.querySelector('[data-sort="price"]');price.setAttribute('aria-pressed',String(sort!=='source'));price.setAttribute('aria-label',sort==='price-asc'?'По цене: сначала дешевле. Нажмите, чтобы показать сначала дороже.':sort==='price-desc'?'По цене: сначала дороже. Нажмите, чтобы показать сначала дешевле.':'Сортировать по цене: сначала дешевле');
 price.querySelector('.price-direction').textContent=sort==='price-asc'?'↑':sort==='price-desc'?'↓':'';
 if(focus){results.focus({preventScroll:true});results.scrollIntoView({block:'start'});}
}
function apply(){const candidate=readFilters(),error=validateFilters(candidate);showFormError(error);if(error)return;filters=candidate;page=1;render({focus:true});}
form.addEventListener('submit',event=>{event.preventDefault();apply();});
form.addEventListener('input',()=>{showFormError('');updateCandidateCount();});
form.addEventListener('change',updateCandidateCount);
form.addEventListener('reset',()=>{queueMicrotask(()=>{filters={...defaultFilters};page=1;showFormError('');updateCandidateCount();render();});});
document.querySelector('[name="pageSize"]').addEventListener('change',event=>{pageSize=Number(event.target.value);page=1;render({focus:true});});
function open(html,{map=false}={}){if(!dialog.open)opener=document.activeElement;dialog.classList.toggle('map-dialog',map);dialogContent.innerHTML=html;if(!dialog.open)dialog.showModal();else dialog.querySelector('.dialog-close').focus();}
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>opener?.isConnected&&opener.focus({preventScroll:true}));
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
function consult(topic){open(`<p class="eyebrow">Консультация</p><h2 id="catalog-dialog-title">${esc(topic)}</h2><p class="catalog-dialog-note">Демонстрационная форма. Заявки не отправляются.</p><form class="consult-form"><label>Ваше имя<input name="name" autocomplete="given-name" maxlength="80" required></label><label>Телефон<input name="phone" type="tel" autocomplete="tel" pattern="[+0-9\\s\\(\\)\\-]{7,25}" maxlength="25" required></label><button type="submit" class="pill">Проверить заявку</button><p role="status" class="form-result"></p></form>`);}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.hasAttribute('data-clear'))form.reset();
 if(button.dataset.sort){sort=button.dataset.sort==='source'?'source':sort==='price-asc'?'price-desc':'price-asc';page=1;render();}
 if(button.dataset.page){page=Number(button.dataset.page);render({focus:true});}
 if(button.hasAttribute('data-map'))open(`<h2 id="catalog-dialog-title">Карта из макета</h2><p class="catalog-dialog-note">Это сохранённое изображение карты. Координаты объектов не приложены, поэтому фильтры не меняют точки на изображении.</p>${image(catalogData.mapImage,'Карта Оренбурга из исходного макета','map-full')}`,{map:true});
 if(button.dataset.consult)consult(button.dataset.consult);
});
dialog.addEventListener('submit',event=>{if(event.target.matches('.consult-form')){event.preventDefault();event.target.querySelector('.form-result').textContent='Форма заполнена. Это демонстрация — заявка не отправлена.';}});

// Accept the same GET fields from the homepage search and catalog links.
const query=new URLSearchParams(location.search);
for(const [name,value] of Object.entries(defaultFilters)){
 if(!query.has(name))continue;
 const field=form.elements.namedItem(name);
 if(!field)continue;
 if(typeof value==='boolean')field.checked=query.get(name)==='true';
 else if(field.tagName!=='SELECT'||[...field.options].some(option=>option.value===query.get(name)))field.value=query.get(name);
}
if(query.size){
 const candidate=readFilters(),error=validateFilters(candidate);
 showFormError(error);
 if(!error){filters=candidate;updateCandidateCount();render();}
}
