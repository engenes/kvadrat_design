import {mountHeader} from '../homepage/header.js';
mountHeader();

const forms=[...document.querySelectorAll('.c-contact-form')];
const messageForm=document.querySelector('#message-form');
const callback=document.querySelector('#callback-dialog');
const privacy=document.querySelector('#privacy-dialog');
const status=document.querySelector('.c-status');
let statusTimer;
const announce=text=>{clearTimeout(statusTimer);status.textContent=text;status.hidden=false;statusTimer=setTimeout(()=>{status.hidden=true;},6000);};
const goToForm=()=>{messageForm.querySelector('[name=name]').focus({preventScroll:true});messageForm.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
const updateRecipient=()=>{
 const director=messageForm.elements.recipient.value==='director';
 const email=document.querySelector('[data-recipient-email]');
 email.href=`mailto:${director?'korobko56@inbox.ru':'a.n.kvadrat@inbox.ru'}`;
 email.firstChild.textContent=(director?'korobko56@inbox.ru':'a.n.kvadrat@inbox.ru')+' ';
 messageForm.querySelector('.c-form-result').hidden=true;
};
messageForm.addEventListener('change',event=>{if(event.target.name==='recipient')updateRecipient();});

document.addEventListener('click',async event=>{
 const target=event.target.closest('a,button');if(!target)return;
 if(target.hasAttribute('data-copy-address')){
  const address='Оренбург, ул. Мало-Луговая, 3/1 (проспект Гагарина, 15/1), БЦ «Евразия», 4 этаж';
  try{await navigator.clipboard.writeText(address);announce('Адрес офиса скопирован');}
  catch{announce('Не удалось скопировать автоматически. Выделите адрес в блоке «Как нас найти» и скопируйте его.');}
 }
 if(target.matches('a[href="#write"]')){event.preventDefault();goToForm();}
 if(target.hasAttribute('data-to-director')){messageForm.querySelector('[value=director]').checked=true;updateRecipient();goToForm();}
 if(target.hasAttribute('data-consult')){
  if(/звонок/i.test(target.dataset.consult)){callback.showModal();}
  else{goToForm();}
 }
 if(target.hasAttribute('data-privacy'))privacy.showModal();
 if(target.hasAttribute('data-close-dialog'))target.closest('dialog').close();
});

for(const dialog of document.querySelectorAll('.c-dialog')){
 let trigger;
 dialog.addEventListener('beforetoggle',event=>{if(event.newState==='open')trigger=document.activeElement;});
 dialog.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const items=[...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),a[href]')].filter(item=>item.getClientRects().length);
  const first=items[0],last=items.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 });
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const rect=dialog.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
 });
}

function fieldError(field){
 if(field.type==='checkbox')return field.checked?'':'Подтвердите согласие на обработку данных.';
 const value=field.value.trim();
 if(field.name==='name')return value?'':'Укажите, как к вам обращаться.';
 if(field.name==='phone'){
  if(!value)return 'Укажите номер телефона для ответа.';
  const digits=value.replace(/\D/g,'');
  return /^\+?[\d\s()-]+$/.test(value)&&digits.length>=10&&digits.length<=15?'':'Проверьте номер: нужно от 10 до 15 цифр.';
 }
 if(field.name==='message')return value?'':'Напишите ваш вопрос.';
 return '';
}
function validateField(field){
 const error=fieldError(field),hint=document.getElementById(field.id+'-error');
 if(error){field.setAttribute('aria-invalid','true');hint.textContent=error;hint.hidden=false;}
 else{field.removeAttribute('aria-invalid');hint.hidden=true;hint.textContent='';}
 return !error;
}
for(const form of forms){
 const result=form.querySelector('.c-form-result');
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const fields=[...form.querySelectorAll('[required]')];
  const errors=fields.filter(field=>!validateField(field));
  result.hidden=false;
  result.classList.toggle('is-error',Boolean(errors.length));
  if(errors.length){result.textContent='Проверьте отмеченные поля — под каждым есть подсказка.';errors[0].focus();return;}
  result.textContent=form===messageForm?'Форма заполнена. Это макет: сообщение не отправлено. Для связи с агентством используйте телефон или почту.':'Форма заполнена. Это макет: обратный звонок не заказан. Позвоните нам по номеру +7 (3532) 90-33-50.';
  result.focus();
 });
 const update=event=>{
  if(event.target.name==='message')document.querySelector('[data-message-count]').textContent=`${event.target.value.length} / 2000`;
  if(event.target.hasAttribute('aria-invalid'))validateField(event.target);
  if(!result.hidden){result.hidden=true;result.textContent='';}
 };
 form.addEventListener('input',update);
 form.addEventListener('change',update);
}
