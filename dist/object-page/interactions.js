import {objectView} from './view-data.js';
import {catalogData} from '../catalog-page/data.js';
import {mountHeader} from '../homepage/header.js';
import {consultationDialog,mortgageDialog,mapDialog,shareDialog} from './dialogs.js';

let mounted=false;
const favoritesKey='kvadrat.catalog.favorites.v1';
const objectFavoriteKey='kvadrat.object.favorite.123123.v1';
const catalogIds=new Set(catalogData.properties.map(item=>String(item.id)));

export function mountInteractions(){
 if(mounted)return;
 const dialog=document.querySelector('#object-dialog');
 const content=document.querySelector('#object-dialog-content');
 if(!dialog||!content)return;
 mounted=true;
 const setMenu=mountHeader();
 const photoCount=objectView.gallery.length;
 const favorites=new Set();
 let opener=null,photoIndex=0,objectFavorite=false,catalogStorageAvailable=true,statusTimer;
 dialog.setAttribute('aria-labelledby','object-dialog-title');

 function announce(message){
  const status=document.querySelector('#object-status');
  if(!status)return;
  clearTimeout(statusTimer);
  status.textContent=message;
  statusTimer=setTimeout(()=>{status.textContent='';},7000);
 }

 function open(html,mode='default',source=document.activeElement){
  if(!dialog.open)opener=source;
  setMenu(false);
  dialog.dataset.mode=mode;
  dialog.classList.toggle('map-dialog',mode==='map');
  content.innerHTML=html;
  if(!dialog.open)dialog.showModal();
  else dialog.querySelector('.dialog-close')?.focus();
  if(mode==='consult')content.querySelector('input')?.focus({preventScroll:true});
  if(mode==='share'){const field=content.querySelector('input');field?.focus({preventScroll:true});field?.select();}
 }

 dialog.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{
  dialog.dataset.mode='';
  content.replaceChildren();
  if(opener?.isConnected)opener.focus({preventScroll:true});
 });
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const box=dialog.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
 });

 function restoreFavorites(serialized){
  try{
   const value=JSON.parse(serialized||'[]');
   favorites.clear();
   if(Array.isArray(value))value.filter(id=>typeof id==='string'&&catalogIds.has(id)).forEach(id=>favorites.add(id));
  }catch{favorites.clear();}
 }
 function readFavorites(){
  if(!catalogStorageAvailable)return;
  try{restoreFavorites(localStorage.getItem(favoritesKey));}catch{catalogStorageAvailable=false;}
 }
 function syncFavorites(){
  document.querySelectorAll('[data-object-favorite]').forEach(button=>{
   button.setAttribute('aria-pressed',String(objectFavorite));
   button.setAttribute('aria-label',objectFavorite?'Убрать эту квартиру из избранного':'Добавить эту квартиру в избранное');
   const label=button.querySelector('[data-object-favorite-label]');
   if(label)label.textContent=objectFavorite?'В избранном':'В избранное';
  });
  document.querySelectorAll('[data-favorite]').forEach(button=>{
   const selected=favorites.has(button.dataset.favorite);
   const label=(button.getAttribute('aria-label')||'Объект').replace(/^(Добавить в избранное|Убрать из избранного): /,'');
   button.setAttribute('aria-pressed',String(selected));
   button.setAttribute('aria-label',`${selected?'Убрать из избранного':'Добавить в избранное'}: ${label}`);
  });
 }
 function toggleFavorite(button){
  let saved=true,selected;
  if(button.hasAttribute('data-object-favorite')){
   objectFavorite=!objectFavorite;selected=objectFavorite;
   try{localStorage.setItem(objectFavoriteKey,String(objectFavorite));}catch{saved=false;}
  }else{
   const id=button.dataset.favorite;
   if(!catalogIds.has(id))return;
   readFavorites();
   if(favorites.has(id))favorites.delete(id);else favorites.add(id);
   selected=favorites.has(id);
   try{localStorage.setItem(favoritesKey,JSON.stringify([...favorites]));}catch{saved=false;catalogStorageAvailable=false;}
  }
  syncFavorites();
  announce(`${selected?'Квартира добавлена в избранное.':'Квартира удалена из избранного.'}${saved?'':' Браузер не разрешил сохранить выбор: он доступен до закрытия страницы.'}`);
 }

 async function share(button){
  const url=new URL(location.href);url.hash='';
  try{
   if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(url.href);
   if(dialog.open&&dialog.dataset.mode==='share')content.querySelector('.share-result').textContent='Ссылка скопирована.';
   else announce('Ссылка на квартиру скопирована.');
  }catch{
   if(dialog.open&&dialog.dataset.mode==='share'){
    content.querySelector('.share-result').textContent='Не удалось скопировать автоматически. Ссылка выделена — скопируйте её вручную.';
    const field=content.querySelector('#object-share-url');field?.focus({preventScroll:true});field?.select();
   }else open(shareDialog(url.href),'share',button);
  }
 }

 function setPhoto(index){
  if(!photoCount||!Number.isInteger(index))return;
  photoIndex=Math.max(0,Math.min(photoCount-1,index));
  const photo=objectView.gallery[photoIndex];
  const img=document.querySelector('#object-photo');
  if(img){img.src=photo.src;img.alt=photo.alt;}
  document.querySelectorAll('[data-photo]').forEach(button=>{
   const selected=Number(button.dataset.photo)===photoIndex;
   button.setAttribute('aria-pressed',String(selected));
   button.tabIndex=selected?0:-1;
   if(selected){
    const strip=button.parentElement;
    const left=button.offsetLeft;
    if(left<strip.scrollLeft)strip.scrollLeft=Math.max(0,left-4);
    else if(left+button.offsetWidth>strip.scrollLeft+strip.clientWidth)strip.scrollLeft=left+button.offsetWidth-strip.clientWidth+4;
   }
  });
  document.querySelectorAll('[data-photo-counter]').forEach(status=>{
   status.textContent=`Фото ${photoIndex+1} из ${photoCount}`;
  });
  document.querySelectorAll('[data-photo-step]').forEach(button=>{
   button.disabled=photoCount<2;
   button.setAttribute('aria-disabled',String(Number(button.dataset.photoStep)<0?photoIndex===0:photoIndex===photoCount-1));
  });
 }

 function validateContact(form,{focus=false}={}){
  const name=form.elements.namedItem('name'),phone=form.elements.namedItem('phone');
  const digits=phone.value.replace(/\D/g,'');
  const issues=[
   [name,name.value.trim()?'':'Укажите ваше имя.'],
   [phone,!phone.value.trim()?'Укажите номер телефона.':!/^[+\d\s()-]+$/.test(phone.value)||digits.length<7||digits.length>15?'Укажите телефон: от 7 до 15 цифр.':'']
  ];
  for(const [field,message] of issues){
   const output=form.querySelector(`#${field.id}-error`);
   field.setAttribute('aria-invalid',String(Boolean(message)));
   output.textContent=message;output.hidden=!message;
  }
  const first=issues.find(([,message])=>message);
  if(first&&focus)first[0].focus();
  return !first;
 }

 function updatePayment(){
  const form=content.querySelector('.mortgage-form');
  if(!form)return;
  const output=form.querySelector('output');
  const priceInput=form.elements.namedItem('price'),depositInput=form.elements.namedItem('deposit');
  const rateInput=form.elements.namedItem('rate'),yearsInput=form.elements.namedItem('years');
  const price=priceInput.valueAsNumber,deposit=depositInput.valueAsNumber;
  const annualRate=rateInput.valueAsNumber,months=yearsInput.valueAsNumber*12;
  const overDeposit=Number.isFinite(deposit)&&Number.isFinite(price)&&deposit>price;
  depositInput.setCustomValidity(overDeposit?'Взнос не может превышать стоимость квартиры.':'');
  const fields=[priceInput,depositInput,rateInput,yearsInput];
  fields.forEach(field=>field.setAttribute('aria-invalid',String(!field.validity.valid&&(field.value!==''||field.validity.badInput))));
  if(fields.some(field=>!field.validity.valid)){
   const onlyMissingRate=rateInput.value===''&&!rateInput.validity.badInput&&fields.filter(field=>field!==rateInput).every(field=>field.validity.valid);
   output.dataset.state=onlyMissingRate?'empty':'error';
   output.textContent=overDeposit?'Взнос не может превышать стоимость квартиры.':onlyMissingRate?'Введите годовую ставку, чтобы увидеть платёж.':'Проверьте значения: цена больше нуля, взнос от 0, ставка от 0 до 100%, срок от 1 до 50 лет.';
   return;
  }
  const loan=price-deposit,rate=annualRate/1200;
  const payment=loan===0?0:rate===0?loan/months:loan*rate/(1-(1+rate)**(-months));
  output.dataset.state='ready';
  output.innerHTML=`${Math.round(payment).toLocaleString('ru-RU')} ₽<small>${loan===0?'Стоимость полностью покрыта взносом':`в месяц · сумма кредита ${loan.toLocaleString('ru-RU')} ₽`}</small>`;
 }

 document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  if(button.hasAttribute('data-photo'))setPhoto(Number(button.dataset.photo));
  else if(button.hasAttribute('data-photo-step')&&button.getAttribute('aria-disabled')!=='true')setPhoto(photoIndex+Number(button.dataset.photoStep));
  else if(button.hasAttribute('data-consult'))open(consultationDialog(button.dataset.consult||'Записаться на просмотр',objectView),'consult');
  else if(button.hasAttribute('data-calculator')){open(mortgageDialog(objectView.price),'mortgage');updatePayment();}
  else if(button.hasAttribute('data-map'))open(mapDialog(objectView),'map');
  else if(button.hasAttribute('data-share')||button.hasAttribute('data-copy-link'))void share(button);
  else if(button.hasAttribute('data-object-favorite')||button.hasAttribute('data-favorite'))toggleFavorite(button);
 });

 document.addEventListener('keydown',event=>{
  if(photoCount<2||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const inGallery=!dialog.open&&Boolean(event.target.closest('[data-photo-gallery]'));
  if(!inGallery)return;
  event.preventDefault();
  setPhoto(event.key==='Home'?0:event.key==='End'?photoCount-1:photoIndex+(event.key==='ArrowRight'?1:-1));
  if(event.target.hasAttribute('data-photo'))event.target.closest('[data-photo-gallery]')?.querySelector(`[data-photo="${photoIndex}"]`)?.focus({preventScroll:true});
 });
 let swipe=null;
 document.addEventListener('pointerdown',event=>{
  const surface=event.target.closest('[data-photo-swipe]');
  if(photoCount<2||!surface||event.pointerType!=='touch'||!event.isPrimary||event.target.closest('[data-photo-step]'))return;
  swipe={surface,id:event.pointerId,x:event.clientX,y:event.clientY};
 });
 document.addEventListener('pointerup',event=>{
  if(!swipe||swipe.id!==event.pointerId)return;
  const gesture=swipe;swipe=null;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.4)return;
  setPhoto(photoIndex+(dx<0?1:-1));
 });
 document.addEventListener('pointercancel',()=>{swipe=null;});
 dialog.addEventListener('input',event=>{
  const form=event.target.closest('form');
  if(form?.matches('.consult-form')){
   if(form.dataset.attempted)validateContact(form);
   const result=form.querySelector('.form-result');result.textContent='';delete result.dataset.state;
  }
  if(form?.matches('.mortgage-form'))updatePayment();
 });
 dialog.addEventListener('submit',event=>{
  event.preventDefault();
  if(event.target.matches('.consult-form')){
   const form=event.target;form.dataset.attempted='true';
   const valid=validateContact(form,{focus:true}),result=form.querySelector('.form-result');
   result.dataset.state=valid?'success':'error';
   result.textContent=valid?'Форма заполнена корректно. Это демонстрация — заявка не отправлена, просмотр не назначен.':'Проверьте выделенные поля.';
  }else if(event.target.matches('.mortgage-form'))updatePayment();
 });
 window.addEventListener('storage',event=>{
  if(event.key===favoritesKey||event.key===null)restoreFavorites(event.newValue);
  if(event.key===objectFavoriteKey||event.key===null)objectFavorite=event.newValue==='true';
  if(event.key===favoritesKey||event.key===objectFavoriteKey||event.key===null)syncFavorites();
 });
 readFavorites();
 try{objectFavorite=localStorage.getItem(objectFavoriteKey)==='true';}catch{/* The button still works during this visit. */}
 syncFavorites();setPhoto(0);
}

mountInteractions();
