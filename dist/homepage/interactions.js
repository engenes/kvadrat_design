import {mountHeader} from './header.js';
import {esc} from './ui.js';
import {articles,news} from './data.js';
import {featuredProperties,catalogCategories} from './refresh-sections.js';
import {compactPropertyCard} from './refresh-cards.js';

export function mountInteractions(){
 const dialog=document.querySelector('#home-dialog');
 const content=document.querySelector('#dialog-content');
 const catalog=document.querySelector('#catalog');
 const propertyPanel=catalog?.querySelector('#property-list');
 const propertyList=propertyPanel?.querySelector('.property-grid');
 const categoryTabs=catalog?.querySelector('.catalog-tabs');
 const favorites=new Set();
 const setMenu=mountHeader();
 let dialogOpener;
 const announcer=document.querySelector('#home-status')||document.createElement('p');
 if(!announcer.isConnected){
  announcer.id='home-status';
  announcer.className='sr-only';
  announcer.style.cssText='position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0';
  announcer.setAttribute('role','status');
  announcer.setAttribute('aria-live','polite');
  announcer.setAttribute('aria-atomic','true');
  document.body.append(announcer);
 }
 const open=html=>{
  if(!dialog||!content)return;
  dialogOpener=document.activeElement;
  setMenu(false);
  content.innerHTML=html;
  if(!dialog.open)dialog.showModal();
 };
 dialog?.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('close',()=>{
  if(dialogOpener?.isConnected)dialogOpener.focus({preventScroll:true});
 });
 dialog?.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const bounds=dialog.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();
 });
 const consult=topic=>open(`<p class="eyebrow">Консультация</p><h2 id="dialog-title">${esc(topic)}</h2><p class="dialog-note">Демонстрационная форма. Данные остаются на этой странице и никуда не отправляются.</p><form class="consult-form"><label class="ui-field-label">Ваше имя<input class="ui-input" name="name" autocomplete="given-name" required maxlength="80"></label><label class="ui-field-label">Телефон<input class="ui-input" name="phone" type="tel" autocomplete="tel" required pattern="[+0-9\\s\\(\\)\\-]{7,25}" maxlength="25"></label><label class="ui-field-label">Вопрос или задача <span class="field-hint ui-field-hint">Необязательно</span><textarea class="ui-input" name="message" rows="3" maxlength="1000"></textarea></label><button class="pill" type="submit">Проверить форму</button><p role="status" class="form-result"></p></form>`);

 function syncFavorite(button){
  const selected=favorites.has(button.dataset.favorite);
  button.setAttribute('aria-pressed',String(selected));
  const label=button.getAttribute('aria-label')?.replace(/^(Добавить в избранное|Убрать из избранного): /,'')||'Квартира';
  button.setAttribute('aria-label',`${selected?'Убрать из избранного':'Добавить в избранное'}: ${label}`);
 }
 function updateCarousel(){
  if(!catalog||!propertyList)return;
  const count=propertyList.children.length;
  const position=catalog.querySelector('.carousel-position');
  const current=Number(catalog.dataset.slide||0);
  if(position)position.textContent=`${String(count?current+1:0).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
  catalog.querySelectorAll('[data-carousel]').forEach(button=>{button.disabled=count<2;});
 }
 function setCategory(index){
  if(!catalog||!propertyList||!Number.isInteger(index)||!catalogCategories[index])return;
  categoryTabs?.querySelectorAll('[data-category]').forEach(button=>{
   const selected=Number(button.dataset.category)===index;
   button.setAttribute('aria-selected',String(selected));
   button.tabIndex=selected?0:-1;
   if(selected)button.scrollIntoView({block:'nearest',inline:'nearest'});
  });
  propertyPanel.setAttribute('aria-labelledby',`category-${index}`);
  propertyList.innerHTML=index===0?featuredProperties.map(compactPropertyCard).join(''):'';
  propertyList.hidden=index!==0;
  propertyList.querySelectorAll('[data-favorite]').forEach(syncFavorite);
  const message=catalog.querySelector('.catalog-message');
  if(message){
   message.hidden=index===0;
   message.innerHTML=index===0?'':`В этой концепции пока нет объектов категории «${esc(catalogCategories[index])}». <button class="text-button" data-consult="Подобрать: ${esc(catalogCategories[index])}">Обсудить подбор с агентом</button>`;
  }
  const controls=catalog.querySelector('.carousel-controls');
  if(controls)controls.hidden=index!==0;
  catalog.dataset.slide='0';
  propertyList.scrollTo({left:0,behavior:'instant'});
  updateCarousel();
 }

 document.addEventListener('click',event=>{
  const target=event.target.closest('button');
  if(!target)return;
  if(target.hasAttribute('data-consult'))consult(target.dataset.consult);
  if(target.hasAttribute('data-video'))open('<p class="eyebrow">Видео</p><h2 id="dialog-title">Видео агентства</h2><p class="dialog-note">Видео пока не добавлено в макет.</p>');
  if(target.hasAttribute('data-calculator')){
   open(`<p class="eyebrow">Ипотечный калькулятор</p><h2 id="dialog-title">Ежемесячный платёж</h2><p class="dialog-note">Демонстрационный расчёт. Введите ставку и условия вашего банка: начальные значения служат примером и не являются предложением.</p><form class="mortgage-form"><label class="ui-field-label">Стоимость квартиры, руб.<input class="ui-input" name="price" type="number" min="100000" max="100000000" step="10000" value="2650000" required></label><label class="ui-field-label">Первоначальный взнос, руб.<input class="ui-input" name="deposit" type="number" min="0" step="10000" value="530000" required></label><div class="form-columns"><label class="ui-field-label">Ставка, % годовых<input class="ui-input" name="rate" type="number" min="0" max="50" step="0.1" value="10" required></label><label class="ui-field-label">Срок, лет<input class="ui-input" name="years" type="number" min="1" max="50" value="20" required></label></div><output class="payment-result" aria-live="polite"></output></form>`);
   updatePayment();
  }
  const item=target.dataset.article?articles.find(article=>article.id===target.dataset.article):target.dataset.news?news.find(article=>article.id===target.dataset.news):null;
  if(item)open(`<p class="eyebrow">${esc(item.category)}</p><h2 id="dialog-title">${esc(item.title)}</h2><p class="dialog-note">В макете есть только карточка. Полный материал пока не добавлен.</p>`);
  if(target.dataset.category!==undefined)setCategory(Number(target.dataset.category));
  if(target.dataset.favorite){
   const id=target.dataset.favorite;
   if(favorites.has(id))favorites.delete(id);else favorites.add(id);
   document.querySelectorAll('[data-favorite]').forEach(button=>{if(button.dataset.favorite===id)syncFavorite(button);});
   const property=featuredProperties.find(item=>String(item.id)===id);
   announcer.textContent=`${property?`Квартира: ${property.address}. `:''}${favorites.has(id)?'Добавлено в избранное':'Удалено из избранного'}. Выбрано в текущем просмотре: ${favorites.size}.`;
  }
  if(target.dataset.carousel==='catalog'&&catalog&&propertyList){
   const nodes=[...propertyList.children];
   if(nodes.length<2)return;
   const current=Number(catalog.dataset.slide||0);
   const next=((target.dataset.index!==undefined?Number(target.dataset.index):current+Number(target.dataset.step))+nodes.length)%nodes.length;
   const shift=(next-current+nodes.length)%nodes.length;
   catalog.dataset.slide=String(next);
   propertyList.append(...nodes.slice(shift),...nodes.slice(0,shift));
   propertyList.scrollTo({left:0,behavior:'instant'});
   updateCarousel();
  }
 });
 categoryTabs?.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const target=event.target.closest('[data-category]');
  if(!target)return;
  const current=Number(target.dataset.category);
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?catalogCategories.length-1:(current+(event.key==='ArrowRight'?1:catalogCategories.length-1))%catalogCategories.length;
  setCategory(next);
  categoryTabs.querySelector(`[data-category="${next}"]`)?.focus({preventScroll:true});
 });
 dialog?.addEventListener('submit',event=>{
  event.preventDefault();
  if(event.target.matches('.consult-form')&&event.target.reportValidity()){
   event.target.querySelector('.form-result').textContent='Форма заполнена. Это демонстрация — заявка не отправлена.';
  }
 });
 dialog?.addEventListener('input',event=>{if(event.target.closest('.mortgage-form'))updatePayment();});
 updateCarousel();

 function updatePayment(){
  const form=dialog?.querySelector('.mortgage-form');
  if(!form)return;
  const values=new FormData(form);
  const price=Number(values.get('price')),deposit=Number(values.get('deposit')),rate=Number(values.get('rate'))/1200,months=Number(values.get('years'))*12;
  const output=form.querySelector('output');
  if(!output)return;
  if(!form.checkValidity()){output.textContent='Проверьте заполнение и допустимые значения полей.';return;}
  if(deposit>=price){output.textContent='Первоначальный взнос должен быть меньше стоимости недвижимости.';return;}
  const loan=price-deposit,payment=rate===0?loan/months:loan*rate/(1-(1+rate)**(-months));
  output.innerHTML=`${Math.round(payment).toLocaleString('ru-RU')} ₽<small>в месяц · предварительно, без страховки и комиссий</small>`;
 }
}
