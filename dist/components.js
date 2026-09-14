const componentList=[
 ['Button','Кнопка','core','Основное действие, контур и текстовая ссылка'],['Badge','Бейдж','core','Метки объектов и фильтров'],['IconBadge','Иконка в круге','core','Контурные и светящиеся рамки'],['Avatar','Аватар','core','Портрет агента со световым ореолом'],['Logo','Логотип','core','Фирменный знак и полная версия'],['StatRing','Кольцо показателя','core','Ставка или цена на тёмном фоне'],['Input','Поле ввода','forms','Текст, телефон и состояния поля'],['Select','Выбор значения','forms','Один вариант из списка'],['PropertyCard','Карточка объекта','cards','Фотография, характеристики и цена'],['ArticleCard','Карточка статьи','cards','Категория, заголовок и дата'],['ServiceCard','Карточка услуги','cards','Предложение агентства'],['NavBar','Навигация','navigation','Верхняя строка публичной части'],['Footer','Подвал','navigation','Контакты и ссылки агентства']
];
export function renderComponents(detail,main,ctx){
 const {asset,heading,escapeHtml:e,toast}=ctx;
 const selected=componentList.find(c=>c[0].toLowerCase()===detail.toLowerCase())||componentList[0];
 const [id,title,group,description]=selected;
 main.innerHTML=heading('Компоненты','Живые образцы на исходных токенах. Выберите компонент и проверьте его варианты.','Библиотека интерфейса','13 компонентов')+`<div class="component-layout"><nav class="component-nav" aria-label="Компоненты">${componentList.map(([key,label])=>`<a href="#components/${key}" ${key===id?'aria-current="page"':''}><strong>${label}</strong><small>${key}</small></a>`).join('')}</nav><div class="component-main"><div class="component-title"><div><p class="eyebrow">${group} / ${id}</p><h2>${title}</h2><p class="meta">${description}</p></div><a class="inline-link" href="#file/${encodeURIComponent(`kvadrat-ds/components/${group}/${id}.md`)}">Описание и контракт ↗</a></div><div class="specimen-toolbar" id="specimen-controls"></div><section class="specimen" id="specimen" aria-label="Живой образец"></section><div class="panel component-notes"><h3>Образец и оригинал</h3><p>Образцы в каталоге построены на исходных токенах. Полный контракт, точные размеры и референс-реализация сохранены в описании каждого компонента. Текст элементов управления каталога — от 14 px.</p><p>Временные настройки образца сбрасываются при переходе к другому компоненту.</p></div></div></div>`;
 const controls=main.querySelector('#specimen-controls'),stage=main.querySelector('#specimen');
 const select=(label,name,values)=>`<label class="select-label">${label}<select name="${name}">${values.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></label>`;
 const sizes=[['md','50 px'],['sm','40 px']];
 let content='';
 if(id==='Button')content=select('Вариант','variant',[['','Основная'],['outline','Контурная'],['outline-dark','На тёмном'],['text','Текстовая']])+select('Размер','size',sizes)+select('Состояние','state',[['normal','Обычное'],['disabled','Недоступно'],['loading','Загрузка']]);
 if(id==='Badge')content=select('Вариант','variant',[['','Контур'],['solid','Синий']]);
 if(id==='Input')content=select('Состояние','state',[['normal','Обычное'],['error','Ошибка'],['disabled','Недоступно']]);
 if(id==='Select')content=select('Состояние','state',[['normal','Обычное'],['disabled','Недоступно']]);
 if(['PropertyCard','ArticleCard'].includes(id))content=select('Тень','elevation',[['resting','Обычная'],['featured','Акцентная']]);
 if(id==='Logo')content=select('Вариант','variant',[['full','Полный логотип'],['mark','Знак']]);
 if(id==='Avatar')content=select('Размер','size',[['80','80 px'],['120','120 px'],['160','160 px']]);
 if(id==='IconBadge')content=select('Вариант','variant',[['ring','Контур'],['ring-dark','На тёмном'],['glow','Сияние']]);
 if(id==='StatRing')content=select('Показатель','variant',[['rate','8,4 %'],['price','650 тыс. руб.']]);
 controls.innerHTML=content||'<span class="meta">Образец из публичной части приложения</span>';
 function render(){
  const values=Object.fromEntries([...controls.querySelectorAll('select')].map(el=>[el.name,el.value]));
  stage.classList.toggle('dark',['StatRing','Logo','Footer','NavBar'].includes(id)||['outline-dark','ring-dark'].includes(values.variant));
  const disabled=values.state==='disabled'?'disabled':'';
  if(id==='Button')stage.innerHTML=`<button id="sample-action" class="btn ${values.variant} ${values.size==='sm'?'sm':''}" ${values.state!=='normal'?'disabled':''}>${values.state==='loading'?'<span class="spinner" aria-hidden="true"></span> Сохраняем…':'Оставить заявку'}</button>`;
  if(id==='Badge')stage.innerHTML=`<div class="row"><span class="badge ${values.variant}">Коммерческая недвижимость</span><span class="badge ${values.variant}">Сдан</span></div>`;
  if(id==='Input')stage.innerHTML=`<div class="sample-form"><label for="sample-input">Ваше имя</label><input id="sample-input" class="pill-input ${values.state==='error'?'invalid':''}" placeholder="Как к Вам обращаться" ${disabled} ${values.state==='error'?'aria-invalid="true" aria-describedby="input-error"':''}>${values.state==='error'?'<p id="input-error" class="field-error">Укажите имя, чтобы мы могли к Вам обратиться.</p>':'<p class="meta">Например, Александр</p>'}</div>`;
  if(id==='Select')stage.innerHTML=`<div class="sample-form"><label for="sample-select">Тип недвижимости</label><select id="sample-select" class="pill-input" ${disabled}><option value="">Выберите тип</option>Квартира</option><option>Дом</option><option>Земля</option><option>Коммерческая недвижимость</option></select></div>`;
  if(id==='Logo')stage.innerHTML=`<img src="${asset('logo/'+(values.variant==='mark'?'kvadrat-mark.svg':'kvadrat-logo-full.svg'))}" alt="Квадрат — агентство недвижимости" style="height:${values.variant==='mark'?'120':'90'}px;width:auto;max-width:90%">`;
  if(id==='Avatar')stage.innerHTML=`<figure class="agent"><div class="avatar" style="--avatar-size:${values.size}px"><img src="${asset('images/avatar-photo-1.png')}" alt="Портрет агента из макета"></div><figcaption><strong>Агент по недвижимости</strong><span>Портрет из дизайн-хендоффа</span></figcaption></figure>`;
  if(id==='IconBadge')stage.innerHTML=`<div class="row"><button class="icon-badge ${values.variant}" data-demo="Предыдущий объект" aria-label="Предыдущий объект">←</button><button class="icon-badge ${values.variant}" data-demo="Следующий объект" aria-label="Следующий объект">→</button></div>`;
  if(id==='StatRing')stage.innerHTML=`<div class="stat-ring"><span class="orbit-dot"></span><strong>${values.variant==='rate'?'8,4':'650'}<small>${values.variant==='rate'?'%':'тыс. руб.'}</small></strong></div>`;
  if(id==='PropertyCard')stage.innerHTML=`<article class="property-card" style="box-shadow:var(--shadow-card-${values.elevation})"><div class="property-image"><img src="${asset('images/listing-thumb-1.png')}" alt="Жилой дом из макета"><span class="badge solid">Сдан</span></div><div class="property-content"><strong>3-комнатная квартира</strong><span>ул. Революционная, 34</span><p>86 м² <span class="divider">·</span> 6/10 этаж</p><b>4 650 000 руб.</b></div></article>`;
  if(id==='ServiceCard')stage.innerHTML=`<article class="service-card"><h3>Продажа недвижимости</h3><p>Поддержка на каждом этапе сделки</p><img src="${asset('images/listing-thumb-1.png')}" alt=""></article>`;
  if(id==='ArticleCard')stage.innerHTML=`<article class="article-card" style="box-shadow:var(--shadow-card-${values.elevation})"><img src="${asset('images/news-thumb-1.jpg')}" alt="Иллюстрация новости из макета"><div><span class="eyebrow">Застройщики</span><h3>Тестовый заголовок новости для примера</h3><p class="meta">21 ноября 2018</p></div></article>`;
  if(id==='NavBar')stage.innerHTML=`<nav class="sample-navbar" aria-label="Пример публичной навигации">${['Услуги','Недвижимость','Спецпредложения','Цены','Отзывы','Контакты'].map(t=>`<button class="demo-nav-link" data-demo="${t}">${t}</button>`).join('')}<span class="open-status">Сейчас открыты</span></nav>`;
  if(id==='Footer')stage.innerHTML=`<div class="sample-footer"><img src="${asset('logo/kvadrat-logo-full.svg')}" alt="Квадрат"><div><strong>+7 (999) 777-33-50</strong><p>Ваш личный агент по недвижимости</p></div><nav aria-label="Пример навигации подвала"><button class="demo-nav-link" data-demo="Недвижимость">Недвижимость</button><button class="demo-nav-link" data-demo="Услуги агентства">Услуги агентства</button><button class="demo-nav-link" data-demo="Контакты">Контакты</button></nav></div>`;
  stage.querySelectorAll('[data-demo]').forEach(button=>button.onclick=()=>toast(`Пример действия: ${button.dataset.demo}`));
  const action=stage.querySelector('#sample-action');if(action)action.onclick=()=>toast('Кнопка нажата — демонстрация состояния');
 }
 controls.onchange=render;render();
}
