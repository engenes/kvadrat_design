// Self-contained runtime reused by the preview and exported HTML.
export function previewRuntime(){
 const page=document.querySelector('.pb-page');if(!page)return;
 const dialog=document.createElement('dialog');dialog.className='pb-preview-dialog';dialog.innerHTML='<button type="button" class="pb-button" data-close>Закрыть ×</button><div class="pb-dialog-body"></div>';document.body.append(dialog);
 const show=(title,text,img)=>{const body=dialog.querySelector('.pb-dialog-body');body.replaceChildren();const h=document.createElement('h2');h.textContent=title;body.append(h);if(img){const el=document.createElement('img');el.src=img;el.alt=title;body.append(el);}if(text){const p=document.createElement('p');p.textContent=text;body.append(p);}dialog.showModal();};
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.onclick=event=>{if(event.target===dialog)dialog.close();};
 const slide=(slider,index)=>{const slides=[...slider.querySelectorAll('.pb-slide')];index=(index+slides.length)%slides.length;slider.dataset.current=index;slides.forEach((s,i)=>s.hidden=i!==index);slider.querySelectorAll('[data-slide-index]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));};
 page.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-next')){const s=b.closest('[data-slider]');slide(s,Number(s.dataset.current||0)+1);}
  if(b.hasAttribute('data-slide-index'))slide(b.closest('[data-slider]'),Number(b.dataset.slideIndex));
  if(b.hasAttribute('data-scroll')){const track=b.closest('[data-carousel]').querySelector('.pb-carousel-track');track.scrollBy({left:Number(b.dataset.scroll)*track.clientWidth*.8,behavior:'smooth'});}
  if(b.hasAttribute('data-lightbox')){const img=b.querySelector('img');show(img.alt,'',img.src);}
  if(b.hasAttribute('data-property')){const card=b.closest('.pb-property');show(card.querySelector('strong').textContent,card.querySelector('div').innerText.replace('Подробнее →',''),card.querySelector('img').src);}
  if(b.hasAttribute('data-contact')){const form=page.querySelector('.pb-form');if(form){form.scrollIntoView({behavior:'smooth',block:'center'});form.querySelector('input')?.focus({preventScroll:true});}else show('Консультация','Это интерактивный макет. Добавьте блок «Форма заявки», чтобы проверить переход к форме.');}
  if(b.hasAttribute('data-catalog')){const grid=page.querySelector('[data-listings]');if(grid)grid.scrollIntoView({behavior:'smooth',block:'center'});else show('Объекты недвижимости','Добавьте блок «Объекты недвижимости» на страницу.');}
 });
 page.addEventListener('submit',event=>{event.preventDefault();const form=event.target;if(!form.matches('.pb-form'))return;form.querySelector('.pb-form-result').textContent='Готово! Форма проверена. Это макет: заявка не отправлена.';form.reset();});
 page.addEventListener('toggle',event=>{const d=event.target;if(d.tagName==='DETAILS'&&d.open&&d.closest('[data-accordion]')?.dataset.accordion==='Один')d.parentElement.querySelectorAll('details').forEach(other=>{if(other!==d)other.open=false;});},true);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{
  if(document.hidden)return;
  page.querySelectorAll('[data-auto="true"]').forEach(el=>{if(el.matches(':hover')||el.contains(document.activeElement))return;if(el.hasAttribute('data-slider'))slide(el,Number(el.dataset.current||0)+1);else{const track=el.querySelector('.pb-carousel-track');track.scrollTo({left:track.scrollLeft+track.clientWidth>=track.scrollWidth-5?0:track.scrollLeft+track.clientWidth*.8,behavior:'smooth'});}});
 },5000);
}
