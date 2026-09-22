import {objectData} from './data.js';
import {consultationDialog,mortgageDialog,galleryDialog,mapDialog,propertyDialog} from './dialogs.js';

let mounted=false;

export function mountInteractions(){
 if(mounted)return;
 const dialog=document.querySelector('#object-dialog');
 const content=document.querySelector('#object-dialog-content');
 if(!dialog||!content)return;
 mounted=true;
 let opener=null,photoIndex=0;
 const photoCount=objectData.gallery.length;
 dialog.setAttribute('aria-labelledby','object-dialog-title');

 function open(html,mode='default'){
  if(!dialog.open)opener=document.activeElement;
  dialog.dataset.mode=mode;
  dialog.classList.toggle('gallery-dialog',mode==='gallery');
  dialog.classList.toggle('map-dialog',mode==='map');
  content.innerHTML=html;
  if(!dialog.open)dialog.showModal();
  else dialog.querySelector('.dialog-close')?.focus();
 }

 dialog.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{
  dialog.dataset.mode='';
  if(opener?.isConnected)opener.focus({preventScroll:true});
 });
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const box=dialog.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
 });

 function setPhoto(index){
  if(!photoCount||!Number.isInteger(index))return;
  photoIndex=((index%photoCount)+photoCount)%photoCount;
  const photo=objectData.gallery[photoIndex];
  document.querySelectorAll('#object-photo,#gallery-dialog-photo').forEach(img=>{img.src=photo.src;img.alt=photo.alt;});
  document.querySelectorAll('[data-photo]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.photo)===photoIndex)));
  document.querySelectorAll('#gallery-status,#gallery-dialog-status').forEach(status=>{status.textContent=`${photoIndex+1} / ${photoCount}`;});
  document.querySelectorAll('[data-photo-step]').forEach(button=>{button.disabled=photoCount<2;});
 }

 function validateContact(form){
  const name=form.elements.namedItem('name'),phone=form.elements.namedItem('phone');
  name.setCustomValidity(name.value&&!name.value.trim()?'Укажите ваше имя.':'');
  const digits=phone.value.replace(/\D/g,'');
  phone.setCustomValidity(phone.value&&(!/^[+\d\s()-]+$/.test(phone.value)||digits.length<7||digits.length>15)?'Укажите телефон: от 7 до 15 цифр.':'');
 }

 function updatePayment(){
  const form=content.querySelector('.mortgage-form');
  if(!form)return;
  const values=new FormData(form),price=Number(values.get('price')),deposit=Number(values.get('deposit'));
  const annualRate=Number(values.get('rate')),months=Number(values.get('years'))*12;
  const output=form.querySelector('output'),depositInput=form.elements.namedItem('deposit');
  depositInput.setCustomValidity(deposit>price?'Взнос не может превышать стоимость объекта.':'');
  if(!form.checkValidity()){
   output.textContent=deposit>price?'Взнос не может превышать стоимость объекта.':'Проверьте значения всех полей.';
   return;
  }
  const loan=price-deposit,rate=annualRate/1200;
  if(loan===0){output.textContent='0 ₽ в месяц — стоимость полностью покрыта взносом.';return;}
  const payment=rate===0?loan/months:loan*rate/(1-(1+rate)**(-months));
  output.innerHTML=`${Math.round(payment).toLocaleString('ru-RU')} ₽<small>в месяц · сумма кредита ${loan.toLocaleString('ru-RU')} ₽</small>`;
 }

 const similar=document.querySelector('#similar');
 const grid=similar?.querySelector('.property-grid');
 function carouselStops(){
  if(!grid?.children.length)return [0];
  const origin=grid.firstElementChild.getBoundingClientRect().left+grid.scrollLeft;
  const max=Math.max(0,grid.scrollWidth-grid.clientWidth);
  const points=[...grid.children].map(card=>Math.max(0,Math.min(max,card.getBoundingClientRect().left+grid.scrollLeft-origin)));
  return points.filter((point,index)=>index===0||Math.abs(point-points[index-1])>1);
 }
 function currentSlide(stops){return stops.reduce((best,point,index)=>Math.abs(point-grid.scrollLeft)<Math.abs(stops[best]-grid.scrollLeft)?index:best,0);}
 function updateCarousel(){
  if(!grid)return;
  const stops=carouselStops(),current=currentSlide(stops);
  similar.dataset.slide=String(current);
  similar.querySelectorAll('[data-carousel="similar"][data-index]').forEach(button=>{
   const index=Number(button.dataset.index);
   button.disabled=index>=stops.length;
   button.setAttribute('aria-pressed',String(index===current));
  });
  similar.querySelectorAll('[data-carousel="similar"][data-step]').forEach(button=>{
   button.disabled=Number(button.dataset.step)<0?current===0:current===stops.length-1;
  });
 }
 function moveCarousel(button){
  if(!grid)return;
  const stops=carouselStops(),current=currentSlide(stops);
  const candidate=button.dataset.index===undefined?current+Number(button.dataset.step):Number(button.dataset.index);
  const index=Math.min(stops.length-1,Math.max(0,candidate));
  if(!Number.isInteger(index))return;
  grid.scrollTo({left:stops[index],behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }

 document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  if(button.hasAttribute('data-photo'))setPhoto(Number(button.dataset.photo));
  else if(button.hasAttribute('data-photo-step'))setPhoto(photoIndex+Number(button.dataset.photoStep));
  else if(button.hasAttribute('data-gallery-open')&&photoCount){open(galleryDialog(objectData,photoIndex),'gallery');setPhoto(photoIndex);}
  else if(button.hasAttribute('data-consult'))open(consultationDialog(button.dataset.consult||'Консультация по объекту'));
  else if(button.hasAttribute('data-calculator')){open(mortgageDialog(objectData.price));updatePayment();}
  else if(button.hasAttribute('data-map'))open(mapDialog(objectData),'map');
  else if(button.hasAttribute('data-property')){
   const item=objectData.similar.find(property=>String(property.id)===button.dataset.property);
   if(item)open(propertyDialog(item));
  }
  else if(button.dataset.carousel==='similar')moveCarousel(button);
 });

 document.addEventListener('keydown',event=>{
  if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
  const inGallery=dialog.open?dialog.dataset.mode==='gallery':Boolean(event.target.closest('.object-gallery,[data-photo],[data-photo-step],[data-gallery-open]'));
  if(!inGallery)return;
  event.preventDefault();
  setPhoto(photoIndex+(event.key==='ArrowRight'?1:-1));
 });
 dialog.addEventListener('input',event=>{
  const form=event.target.closest('form');
  if(form?.matches('.consult-form')){validateContact(form);form.querySelector('.form-result').textContent='';}
  if(form?.matches('.mortgage-form'))updatePayment();
 });
 dialog.addEventListener('submit',event=>{
  event.preventDefault();
  if(event.target.matches('.consult-form')){
   validateContact(event.target);
   if(event.target.reportValidity())event.target.querySelector('.form-result').textContent='Форма заполнена. Это демонстрация — заявка не отправлена.';
  }
  else if(event.target.matches('.mortgage-form'))updatePayment();
 });
 if(grid){
  let scheduled=false;
  grid.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;updateCarousel();});}},{passive:true});
  new ResizeObserver(updateCarousel).observe(grid);
  updateCarousel();
 }
 setPhoto(0);
}

mountInteractions();
