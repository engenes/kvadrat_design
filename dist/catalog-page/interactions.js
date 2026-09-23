import {mountHeader} from '../homepage/header.js';
import {catalogData} from './data.js';
import {defaultFilters,filterProperties,sortProperties,paginate} from './model.js';
import {resultCards} from './components.js';
import {esc,image} from '../homepage/ui.js';
import {enhanceSelect} from '../select.js';
import {parseCatalogState,catalogUrl,filterIssue,sameFilters,objectCount,filterChips,catalogContext} from './state.js';

const form=document.querySelector('#catalog-filter');
const filterToggle=form.querySelector('[data-filter-toggle]'),filterFields=form.querySelector('#catalog-filter-fields');
function setFilterExpanded(open){
 form.classList.toggle('is-expanded',open);filterToggle.setAttribute('aria-expanded',String(open));
}
const dialog=document.querySelector('#catalog-dialog'),dialogContent=document.querySelector('#catalog-dialog-content');
const results=document.querySelector('#catalog-results');
const sortControl=document.querySelector('select[name="sort"]'),sizeControl=document.querySelector('[name="pageSize"]');
const setMenu=mountHeader();
const favoritesKey='kvadrat.catalog.favorites.v1';
const propertyIds=new Set(catalogData.properties.map(item=>String(item.id)));
let state={filters:{...defaultFilters},sort:'source',page:1,pageSize:20,favoritesOnly:false};
let syncing=false,opener;
const favorites=new Set();
const optionValues={},optionLabels={};
form.querySelectorAll('select[name]').forEach(select=>{
 optionValues[select.name]=[...select.options].map(option=>option.value);
 optionLabels[select.name]=Object.fromEntries([...select.options].map(option=>[option.value,option.textContent.trim()]));
});

function restoreFavorites(serialized){
 try{const value=JSON.parse(serialized||'[]');if(!Array.isArray(value))return;favorites.clear();value.filter(id=>typeof id==='string'&&propertyIds.has(id)).forEach(id=>favorites.add(id));}catch{/* A damaged saved value must not stop catalog browsing. */}
}
try{restoreFavorites(localStorage.getItem(favoritesKey));}catch{/* Favorites remain available for this visit if storage is blocked. */}
function saveFavorites(){try{localStorage.setItem(favoritesKey,JSON.stringify([...favorites]));return true;}catch{return false;}}

function readFilters(){
 const data=new FormData(form);
 return Object.fromEntries(Object.entries(defaultFilters).map(([name,value])=>[name,typeof value==='boolean'?data.has(name):String(data.get(name)??'')]));
}
function syncControls({filters=false,values=state.filters}={}){
 syncing=true;
 if(filters)for(const [name,value] of Object.entries(values)){
  const field=form.elements.namedItem(name);if(!field)continue;
  if(typeof value==='boolean')field.checked=value;
  else{
   if(field.dataset.numericInput){field.type='number';delete field.dataset.numericInput;}
   field.value=value;
   // Keep a malformed value from a shared link visible instead of letting the
   // browser silently erase it from a number input before the user can fix it.
   if(field.type==='number'&&value!==''&&field.value!==String(value)){
    field.dataset.numericInput='true';field.type='text';field.value=value;
   }
  }
  if(field.tagName==='SELECT')field.dispatchEvent(new Event('change'));
 }
 for(const [control,value] of [[sortControl,state.sort],[sizeControl,state.pageSize]]){
  if(control){control.value=String(value);control.dispatchEvent(new Event('change'));}
 }
 syncing=false;
}
function issueFor(candidate){
 for(const field of form.querySelectorAll('input[type="number"]')){
  if(field.validity.badInput)return {fields:[field.name],message:'Введите число в выделенном поле.'};
 }
 return filterIssue(candidate);
}
function showFormError(issue,{focus=false}={}){
 const output=form.querySelector('.filter-error');
 output.hidden=!issue;output.textContent=issue?.message||'';
 form.querySelectorAll('[aria-invalid="true"]').forEach(field=>{
  field.removeAttribute('aria-invalid');
  const description=(field.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!=='filter-error').join(' ');
  if(description)field.setAttribute('aria-describedby',description);else field.removeAttribute('aria-describedby');
 });
 if(!issue)return;
 setFilterExpanded(true);
 issue.fields.forEach(name=>{
  const field=form.elements.namedItem(name);if(!field)return;
  field.setAttribute('aria-invalid','true');
  field.setAttribute('aria-describedby',[...(field.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean),'filter-error'].join(' '));
  const details=field.closest('details');if(details)details.open=true;
 });
 if(focus)(form.elements.namedItem(issue.fields[0])||output).focus();
}
function candidates(filters){
 const found=filterProperties(catalogData.properties,filters);
 return state.favoritesOnly?found.filter(item=>favorites.has(String(item.id))):found;
}
function updateCandidateCount(){
 const candidate=readFilters(),issue=issueFor(candidate);
 const button=form.querySelector('.filter-submit'),label=button.querySelector('[data-submit-label]'),count=button.querySelector('[data-submit-count]');
 const total=candidates(candidate).length;
 label.textContent=issue?'Проверить параметры':'Показать объекты';
 if(count){count.hidden=Boolean(issue);count.textContent=String(total);}
 button.setAttribute('aria-label',issue?'Проверить параметры':`Показать ${objectCount(total)}`);
 const note=document.querySelector('#filter-draft-note');
 if(note){note.hidden=!issue&&sameFilters(candidate,state.filters);note.textContent=note.hidden?'':'Условия изменены. Нажмите «Показать», чтобы обновить результаты.';}
 const applied=filterChips(state.filters,optionLabels),badge=filterToggle.querySelector('[data-filter-count]');
 badge.hidden=!applied.length;badge.textContent=String(applied.length);
 const summary=form.querySelector('#filter-collapse-summary');
 const draft=Boolean(issue)||!sameFilters(candidate,state.filters);
 summary.textContent=issue?'Проверьте параметры поиска':draft?'Есть неприменённые изменения':applied.length?applied.slice(0,2).map(item=>item.label).join(' · ')+(applied.length>2?' · и ещё '+(applied.length-2):''):'Цена, комнаты, площадь и другие условия';
 filterToggle.classList.toggle('has-draft',draft);
}
function syncFavorites(){
 document.querySelectorAll('[data-favorite]').forEach(button=>{
  const selected=favorites.has(button.dataset.favorite);
  button.setAttribute('aria-pressed',String(selected));
  const label=(button.getAttribute('aria-label')||'Объект').replace(/^(Добавить в избранное|Убрать из избранного): /,'');
  button.setAttribute('aria-label',`${selected?'Убрать из избранного':'Добавить в избранное'}: ${label}`);
 });
 document.querySelectorAll('[data-favorites-only]').forEach(button=>button.setAttribute('aria-pressed',String(state.favoritesOnly)));
 document.querySelectorAll('[data-favorites-count]').forEach(output=>output.textContent=String(favorites.size));
}
function emptyMessage(){
 if(state.favoritesOnly&&favorites.size===0)return ['В избранном пока нет объектов','Нажмите на сердечко в карточке, чтобы сохранить понравившийся объект. Вернитесь ко всем объектам и начните подбор.'];
 if(state.filters.deal!=='buy'||state.filters.type!=='flat'||state.filters.market!=='secondary')return ['В этой категории пока нет объектов','В сохранённом макете представлены квартиры на вторичном рынке в продаже. Измените тип сделки, объекта или рынок.'];
 if(state.filters.district||state.filters.renovated)return ['Не хватает данных для такого поиска','В сохранённом макете район и ремонт не указаны. Уберите эти условия, чтобы увидеть доступные объекты.'];
 if(state.favoritesOnly)return ['В избранном нет совпадений','Измените условия поиска или отключите «Избранное», чтобы посмотреть все подходящие объекты.'];
 return ['По вашему запросу ничего не найдено','Попробуйте расширить диапазон цены или площади, изменить количество комнат или убрать часть условий.'];
}
function writeUrl(mode='push'){
 const url=catalogUrl(location.href,state);
 if(url.href!==location.href)history[mode==='replace'?'replaceState':'pushState'](null,'',url);
}
function focusResults(){results.focus({preventScroll:true});results.scrollIntoView({block:'start',behavior:'instant'});}
function render({focus=false,historyMode=null}={}){
 const found=sortProperties(candidates(state.filters),state.sort),slice=paginate(found,state.page,state.pageSize);state.page=slice.page;
 document.querySelector('#results-count').textContent=objectCount(found.length);
 document.querySelector('#catalog-cards').innerHTML=resultCards(slice.items,{banner:!state.favoritesOnly});
 const empty=document.querySelector('.catalog-empty');empty.hidden=found.length>0;
 const [title,description]=emptyMessage();empty.querySelector('h3').textContent=title;empty.querySelector('p').textContent=description;
 const clear=empty.querySelector('[data-clear]');if(clear)clear.textContent=state.favoritesOnly?'Показать все объекты':'Сбросить фильтры';
 document.querySelector('.page-status').textContent=found.length?`${(state.page-1)*state.pageSize+1}–${Math.min(state.page*state.pageSize,found.length)} из ${found.length}`:'Нет объектов';
 document.querySelector('.catalog-pagination').hidden=!found.length;
 document.querySelector('.catalog-sort').hidden=!found.length;
 document.querySelector('#catalog-pages').innerHTML=Array.from({length:slice.pageCount},(_,index)=>`<button type="button" data-page="${index+1}" ${index+1===state.page?'aria-current="page"':''} aria-label="Страница ${index+1}">${index+1}</button>`).join('');
 const chips=document.querySelector('#active-filters');
 if(chips){chips.innerHTML=filterChips(state.filters,optionLabels).map(({name,label})=>`<button type="button" class="active-filter ui-filter-chip" data-remove-filter="${esc(name)}" aria-label="Убрать условие: ${esc(label)}"><span>${esc(label)}</span><span aria-hidden="true">×</span></button>`).join('');chips.hidden=!chips.childElementCount;}
 const context=catalogContext(state.filters);
 for(const [selector,text] of [['#catalog-title',context.title],['#catalog-subtitle',context.subtitle],['#catalog-context',context.breadcrumb],['#applied-summary',context.summary]]){const output=document.querySelector(selector);if(output)output.textContent=text;}
 document.title=`${context.title} — Квадрат`;
 syncControls();syncFavorites();updateCandidateCount();
 if(historyMode)writeUrl(historyMode);
 if(focus)focusResults();
}
function apply(){
 const candidate=readFilters(),issue=issueFor(candidate);showFormError(issue,{focus:true});if(issue)return;
 state.filters=candidate;state.page=1;setFilterExpanded(false);render({focus:true,historyMode:'push'});
}
form.noValidate=true;
filterToggle.addEventListener('click',()=>setFilterExpanded(filterToggle.getAttribute('aria-expanded')!=='true'));
// Keep the active field visible if the viewport becomes narrow during editing.
filterFields.addEventListener('focusin',()=>setFilterExpanded(true));
window.addEventListener('resize',()=>{
 if(document.activeElement===filterToggle&&!filterToggle.getClientRects().length)(filterFields.querySelector('.kv-select__trigger')||filterFields.querySelector('select,input')).focus({preventScroll:true});
});
form.addEventListener('submit',event=>{event.preventDefault();apply();});
form.addEventListener('input',event=>{
 if(syncing)return;
 const field=event.target;
 if(field.dataset.numericInput&&!filterIssue({...defaultFilters,[field.name]:field.value})){
  const value=field.value;field.type='number';field.value=value;delete field.dataset.numericInput;
 }
 if(!form.querySelector('.filter-error').hidden)showFormError(issueFor(readFilters()));
 updateCandidateCount();
});
form.addEventListener('change',()=>{if(!syncing)updateCandidateCount();});
form.addEventListener('reset',()=>{queueMicrotask(()=>{state.filters={...defaultFilters};state.page=1;showFormError(null);syncControls({filters:true});render({historyMode:'push'});});});
sortControl?.addEventListener('change',()=>{if(syncing)return;state.sort=sortControl.value;state.page=1;render({historyMode:'push'});});
sizeControl?.addEventListener('change',()=>{if(syncing)return;state.pageSize=Number(sizeControl.value);state.page=1;render({historyMode:'push'});});

function open(html,{map=false}={}){
 if(!dialog.open)opener=document.activeElement;
 setMenu(false);dialog.classList.toggle('map-dialog',map);dialogContent.innerHTML=html;
 if(!dialog.open)dialog.showModal();else dialog.querySelector('.dialog-close').focus();
}
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>opener?.isConnected&&opener.focus({preventScroll:true}));
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
function consult(topic){open(`<p class="eyebrow">Консультация</p><h2 id="catalog-dialog-title">${esc(topic)}</h2><p class="catalog-dialog-note">Демонстрационная форма. Данные остаются на этой странице и никуда не отправляются.</p><form class="consult-form"><label class="ui-field-label">Ваше имя<input class="ui-input" name="name" autocomplete="given-name" maxlength="80" required></label><label class="ui-field-label">Телефон<input class="ui-input" name="phone" type="tel" autocomplete="tel" pattern="[+0-9\\s\\(\\)\\-]{7,25}" maxlength="25" required></label><label class="ui-field-label">Ваш вопрос <span class="field-hint ui-field-hint">Необязательно</span><textarea class="ui-input" name="message" rows="3" maxlength="1000"></textarea></label><button type="submit" class="pill">Проверить форму</button><p role="status" class="form-result"></p></form>`);}
document.addEventListener('click',event=>{
 const edit=event.target.closest('[data-edit-filters]');
 if(edit){event.preventDefault();setFilterExpanded(true);form.scrollIntoView({block:'start',behavior:'instant'});(form.querySelector('.kv-select__trigger')||form.querySelector('select,input')).focus({preventScroll:true});return;}
 const button=event.target.closest('button');if(!button)return;
 if(button.hasAttribute('data-clear')){state.favoritesOnly=false;form.reset();queueMicrotask(focusResults);}
 if(button.dataset.removeFilter){
  const name=button.dataset.removeFilter;if(!(name in defaultFilters))return;
  state.filters={...state.filters,[name]:defaultFilters[name]};state.page=1;showFormError(null);syncControls({filters:true,values:{[name]:defaultFilters[name]}});render({historyMode:'push'});
  const next=document.querySelector('[data-remove-filter]');if(next)next.focus({preventScroll:true});else results.focus({preventScroll:true});
 }
 if(button.dataset.page){state.page=Number(button.dataset.page);render({focus:true,historyMode:'push'});}
 if(button.hasAttribute('data-favorites-only')){state.favoritesOnly=!state.favoritesOnly;state.page=1;render({historyMode:'push'});}
 if(button.dataset.favorite){
  const id=button.dataset.favorite;if(!propertyIds.has(id))return;
  if(favorites.has(id))favorites.delete(id);else favorites.add(id);
  const saved=saveFavorites();
  const status=document.querySelector('.favorite-status');
  if(status)status.textContent=`${favorites.has(id)?'Объект добавлен в избранное.':'Объект удалён из избранного.'} Сохранено: ${objectCount(favorites.size)}.${saved?'':' Избранное доступно до закрытия страницы: браузер не разрешил сохранить его.'}`;
  if(state.favoritesOnly){render({historyMode:'replace'});(document.querySelector('[data-favorite]')||document.querySelector('[data-favorites-only]'))?.focus({preventScroll:true});}
  else{syncFavorites();updateCandidateCount();}
 }
 if(button.hasAttribute('data-map'))open(`<p class="eyebrow">Расположение</p><h2 id="catalog-dialog-title">Карта Оренбурга</h2><p class="catalog-dialog-note">Это сохранённое изображение из макета. Координаты объектов не приложены, поэтому точки на карте не меняются при фильтрации.</p><div class="map-canvas">${image(catalogData.mapImage,'Сохранённая карта Оренбурга; точки не связаны с текущими результатами','map-full')}</div>`,{map:true});
 if(button.dataset.consult)consult(button.dataset.consult);
});
dialog.addEventListener('submit',event=>{if(event.target.matches('.consult-form')){event.preventDefault();event.target.querySelector('.form-result').textContent='Форма заполнена. Это демонстрация — заявка не отправлена.';}});
window.addEventListener('storage',event=>{
 if(event.key!==favoritesKey&&event.key!==null)return;
 restoreFavorites(event.newValue);
 if(!state.favoritesOnly){syncFavorites();updateCandidateCount();return;}
 const focused=document.activeElement,cards=document.querySelector('#catalog-cards');
 const restoreFocus=!dialog.open&&cards.contains(focused);
 const card=restoreFocus?focused.closest('.property-card'):null;
 const id=card?.querySelector('[data-favorite]')?.dataset.favorite;
 const linkIndex=card?[...card.querySelectorAll('a')].indexOf(focused):-1;
 render({historyMode:'replace'});
 if(restoreFocus&&!focused.isConnected){
  const favorite=[...cards.querySelectorAll('[data-favorite]')].find(button=>button.dataset.favorite===id);
  const replacement=linkIndex>=0?favorite?.closest('.property-card')?.querySelectorAll('a')[linkIndex]:favorite;
  (replacement||cards.querySelector('[data-favorite]')||results).focus({preventScroll:true});
 }
});

function restoreLocation({initial=false}={}){
 state=parseCatalogState(location.search,optionValues);syncControls({filters:true});
 const issue=filterIssue(state.filters);showFormError(issue?{...issue,message:`Параметры из ссылки не применены. ${issue.message}`}:null);
 if(issue)state.filters={...defaultFilters};
 const details=form.querySelector('.extra-filters');
 if(details&&['district','minFloor','maxFloor','walls','renovated'].some(name=>state.filters[name]!==defaultFilters[name]))details.open=true;
 render({historyMode:issue||initial?'replace':null});
}
document.querySelectorAll('#catalog-filter select,select[name="sort"],select[name="pageSize"]').forEach(select=>enhanceSelect(select,{compact:true}));
form.classList.add('is-collapsible');
window.addEventListener('popstate',()=>restoreLocation());
restoreLocation({initial:true});
