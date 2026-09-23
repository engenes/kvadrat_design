import {image,esc} from '../homepage/ui.js';
import {refreshHeader,refreshFooter,icon} from '../homepage/refresh-sections.js';
import {compactPropertyCard} from '../homepage/refresh-cards.js';
import {objectView as d} from './view-data.js';
import {mapImage} from './media.js';
import {photoNavigation,photoThumbnails} from './gallery-ui.js';

const money = value => Number(value).toLocaleString('ru-RU');
const pageLinks = html => html.replace(/href="#(services|news|blog|offers|mortgage)"/g,'href="homepage.html#$1"');
const localIcon = name => `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  share:'<path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7"/>',
  pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  calculator:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 3h1m6 0h1"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
}[name]}</svg>`;
const viewingButton = (label='Записаться на просмотр') => `<button class="r-button object-viewing" data-consult="Записаться на просмотр"><span>${label}</span><span class="button-icon">${icon('diagonal')}</span></button>`;

function introduction(){return `<div class="object-topline"><nav class="object-breadcrumbs" aria-label="Хлебные крошки"><a href="property-catalog.html">${icon('back')} Квартиры в Оренбурге</a><span aria-hidden="true">/</span><span aria-current="page">Объект № ${esc(d.catalogNumber)}</span></nav><div class="object-tools"><button data-object-favorite aria-pressed="false" aria-label="Сохранить объект в избранное">${localIcon('heart')}<span data-object-favorite-label>Сохранить</span></button><button data-share aria-label="Поделиться объектом">${localIcon('share')}<span>Поделиться</span></button></div></div>
  <header class="object-heading"><p class="r-kicker">Продажа · Вторичное жильё</p><h1 id="object-title">${esc(d.title)}<span class="object-title-comma">,</span> <span class="object-title-area">${d.area} м²</span></h1><div class="object-address-line"><p>${localIcon('pin')}<span>Оренбург, Транспортная улица, 18/4</span></p><a href="#location">На карте ${icon('diagonal')}</a><span class="object-district">Ленинский район</span></div></header>`;}

function gallery(){return `<figure class="object-gallery" data-photo-gallery><div class="object-photo-stage" data-photo-swipe><div class="object-photo-frame">${image(d.gallery[0].src,d.gallery[0].alt,'','id="object-photo" width="1100" height="688" fetchpriority="high"')}</div>${photoNavigation(d.gallery)}</div>${photoThumbnails(d.gallery)}<figcaption><span>Фотографии квартиры</span><span>${d.gallery.length===1?'В объявлении 1 фотография':'Выберите фото или листайте стрелками'}</span></figcaption></figure>`;}

function facts(){return `<dl class="object-facts" aria-label="Основные характеристики"><div><dt>Общая площадь</dt><dd>36 <span>м²</span></dd></div><div><dt>Жилая</dt><dd>16 <span>м²</span></dd></div><div><dt>Кухня</dt><dd>10 <span>м²</span></dd></div><div><dt>Этаж</dt><dd>2 <span>из 10</span></dd></div></dl>`;}

function contact(){return `<aside class="object-sidebar" aria-label="Стоимость и агент"><div class="object-contact-card"><p class="object-sale-type">Стоимость квартиры</p><p class="object-price">${money(d.price)} <span>₽</span></p><p class="object-unit-price">${money(d.pricePerMeter)} ₽/м²</p><button class="object-calculator" data-calculator>${localIcon('calculator')}<span>Рассчитать ипотеку</span>${icon('arrow')}</button><div class="object-agent"><div class="object-agent-photo">${image(d.agent.image,d.agent.name,'','width="64" height="76"')}</div><div><span>Ваш агент по этому объекту</span><h2>${esc(d.agent.name)}</h2><p>Специалист по недвижимости</p></div></div><p class="object-agent-help">Расскажет о квартире и договорится<br class="object-wide-only"> о просмотре в удобное время.</p>${viewingButton()}<a class="object-phone" href="tel:${d.agent.phone.replace(/[^+\d]/g,'')}">${icon('phone')} ${esc(d.agent.phone)}</a><button class="object-question" data-consult="Задать вопрос об объекте">${icon('message')} Задать вопрос агенту</button></div><p class="object-reference">Объект № ${esc(d.catalogNumber)}<br><span>Назовите номер при обращении</span></p></aside>`;}

function overview(){return `<nav class="object-section-nav" aria-label="Разделы объекта"><a href="#description">Описание</a><a href="#features">Характеристики</a><a href="#location">Расположение</a></nav><section class="object-section object-description" id="description" aria-labelledby="description-title"><div class="object-section-heading"><span class="object-section-number">01</span><h2 id="description-title">О квартире</h2></div><div class="object-highlights"><span>${icon('check')} С ремонтом</span><span>${icon('check')} Окна во двор</span><span>${icon('check')} Есть лоджия</span></div><p>${esc(d.description)}</p><p>${esc(d.descriptionExtra)}</p></section>`;}

const featureRows = group => `<dl>${group.rows.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd${value.includes('Уточ')?' class="object-fact-pending"':''}>${esc(value)}</dd></div>`).join('')}</dl>`;
function features(){return `<section class="object-section object-features" id="features" aria-labelledby="features-title"><div class="object-section-heading"><span class="object-section-number">02</span><h2 id="features-title">Характеристики</h2></div><div class="object-feature-columns">${d.features.slice(0,2).map(group=>`<section><h3>${esc(group.title)}</h3>${featureRows(group)}</section>`).join('')}</div><details class="object-equipment"><summary>Оснащение квартиры <span class="object-equipment-action">Показать ${icon('plus')}</span></summary>${featureRows(d.features[2])}</details></section>`;}

function location(){return `<section class="object-section object-location" id="location" aria-labelledby="location-title"><div class="object-section-heading"><span class="object-section-number">03</span><h2 id="location-title">Расположение</h2></div><p class="object-location-address">Оренбург, Транспортная улица, 18/4<span>Ленинский район</span></p><button class="object-map" data-map aria-label="Увеличить карту с офисом агентства">${mapImage(d.mapImage)}<span class="object-map-context">На карте — офис агентства</span><span class="object-map-label">${localIcon('expand')} Увеличить карту</span></button><p class="object-map-note">На изображении отмечен офис агентства. Расположение квартиры уточните у агента.</p></section>`;}

function support(){return `<section class="object-support" aria-labelledby="support-title"><span class="object-support-icon">${localIcon('shield')}</span><div><h2 id="support-title">Поможем разобраться в деталях</h2><p>Уточним условия покупки, ответим на вопросы о документах и объясним порядок сделки.</p><button class="r-text-link" data-consult="Вопрос об условиях покупки">Обсудить с агентом ${icon('arrow')}</button></div></section>`;}

function similar(){return `<section class="object-similar" id="similar" aria-labelledby="similar-title"><div class="object-similar-heading"><div><p class="r-kicker">Продолжить поиск</p><h2 id="similar-title">Посмотрите другие квартиры</h2></div><a href="property-catalog.html" class="object-all-link">Весь каталог ${icon('arrow')}</a></div><div class="property-grid">${d.similar.map(item=>compactPropertyCard(item,{showWalls:true})).join('')}</div><p class="object-demo-note">Демонстрационные объекты и цены. Карточки открывают пример страницы квартиры.</p></section>`;}

export function objectPage(){return `${pageLinks(refreshHeader({theme:'light'}))}
  <main class="r-container" id="object-page" aria-labelledby="object-title">
    ${introduction()}
    <div class="object-layout">${gallery()}${contact()}${facts()}${overview()}${features()}${location()}${support()}</div>
    ${similar()}
  </main>
  ${pageLinks(refreshFooter()).replace('Концепция главной · данные демонстрационные','Макет объекта · данные демонстрационные')}
  <div class="object-mobile-contact" aria-label="Быстрая запись на просмотр"><div><strong>${money(d.price)} ₽</strong><span>${d.area} м² · 1 комната</span></div>${viewingButton('На просмотр')}</div>
  <p class="object-status" id="object-status" role="status" aria-live="polite"></p>`;}
