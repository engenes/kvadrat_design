import {escapeHtml} from './html.js';
export {escapeHtml};
const main = document.querySelector('main');
let disposeRoute,routeRevision=0;
export const ref = path => `references/${path.split('/').map(encodeURIComponent).join('/')}`;
export const asset = name => ref(`kvadrat-ds/assets/${name}`);
export let catalog;
let toastTimer;
export function toast(message) { const box=document.querySelector('#toast');box.textContent=message;box.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.hidden=true,2600); }
export async function copy(value) { try { await navigator.clipboard.writeText(value);toast('Скопировано'); } catch { toast('Буфер обмена недоступен в этом браузере'); } }
export function heading(title, description, eyebrow='Библиотека Квадрата', label='') { return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${description}</p></div>${label?`<span class="label-pill">${label}</span>`:''}</div>`; }
function pages() {
 const card=({href,title,description,label,number})=>`<a class="page-card" href="${href}"><span class="page-card-top"><span class="page-card-label">${label}</span>${number?`<span class="page-card-number" aria-hidden="true">${number}</span>`:''}</span><h3>${title}</h3><p>${description}</p><span class="page-card-action">Открыть <span aria-hidden="true">→</span></span></a>`;
 const publicPages=[
  {href:'homepage.html',title:'Главная',description:'Новая концепция: поиск, объекты, услуги, команда и журнал.',label:'Публичный сайт · обновлено',number:'01'},
  {href:'property-catalog.html',title:'Каталог недвижимости',description:'Карточки объектов, поиск и фильтры. Отсюда можно открыть отдельный объект.',label:'Публичный сайт',number:'02'},
  {href:'property-object.html',title:'Страница объекта',description:'Фотографии квартиры, цена, характеристики, описание и контакты агента.',label:'Публичный сайт',number:'03'},
  {href:'contacts.html',title:'Контакты',description:'Телефоны, почта, офис на карте и обращение в агентство или директору.',label:'Публичный сайт · обновлено',number:'04'}
 ];
 const adminPages=[
  {href:'feeds.html',title:'Импорт-фиды',description:'Список источников, настройки, сопоставление полей и проверка данных.',label:'Интерактивный прототип'},
  {href:'#builder',title:'Конструктор страниц',description:'Сборка страницы из блоков, редактирование содержимого и предпросмотр.',label:'Интерактивный прототип'}
 ];
 const libraryPages=[
  {href:'homepage-components.html',title:'Компоненты главной',description:'Новые карточки, группы действий, услуги и журнал в одном визуальном языке.',label:'Галерея компонентов'},
  {href:'#foundations',title:'Основы дизайн-системы',description:'Цвета, типографика, отступы и тени Квадрата.',label:'Дизайн-система'},
  {href:'#components',title:'Библиотека компонентов',description:'Кнопки, поля, карточки и другие элементы с примерами состояний.',label:'Дизайн-система'},
  {href:'feeds-ux.html',title:'Обзор UX импорта',description:'Пояснения к интерфейсу импорт-фидов и предложенным изменениям.',label:'Разбор интерфейса'},
  {href:'#screens',title:'Архив макетов',description:'Исходные изображения главной, админ-панели, расписания и эталон меню пользователя.',label:'Скриншоты и эталоны'},
  {href:'#sources',title:'Исходные файлы',description:'Дизайн-хендоффы, оригиналы макетов, токены, изображения и шрифты.',label:'Материалы'}
 ];
 return heading('Все страницы проекта','Здесь собраны все свёрстанные страницы и материалы Квадрата. Выберите экран, чтобы открыть его.','Квадрат в Sites')+
 `<section class="pages-section" aria-labelledby="public-pages-title"><div class="section-head"><div><h2 id="public-pages-title">Публичный сайт</h2><p>Основной путь: главная → каталог → объект недвижимости.</p></div></div><div class="page-grid page-grid-public">${publicPages.map(card).join('')}</div></section>
 <section class="pages-section" aria-labelledby="admin-pages-title"><div class="section-head"><div><h2 id="admin-pages-title">Прототипы админ-панели</h2><p>Интерактивные экраны с демонстрационными данными.</p></div></div><div class="page-grid page-grid-admin">${adminPages.map(card).join('')}</div></section>
 <section class="pages-section" aria-labelledby="design-pages-title"><div class="section-head"><div><h2 id="design-pages-title">Дизайн и материалы</h2><p>Компоненты, пояснения и исходные макеты для сверки.</p></div></div><div class="page-grid page-grid-library">${libraryPages.map(card).join('')}</div></section>`;
}
async function route(){
 const revision=++routeRevision;
 disposeRoute?.();disposeRoute=null;
 const [requestedSection, detail=''] = (location.hash.slice(1)||'pages').split('/');
 const section=['pages','foundations','components','screens','sources','file','builder'].includes(requestedSection)?requestedSection:'pages';
 document.body.dataset.section=section;
 document.querySelector('.sidebar-materials').open=['foundations','components','screens','sources','file'].includes(section);
 document.querySelectorAll('[data-nav]').forEach(a=>{a.removeAttribute('aria-current');if(a.dataset.nav===section)a.setAttribute('aria-current','page')});
 document.querySelector('#breadcrumb').textContent=({pages:'Все страницы',foundations:'Основы',components:'Компоненты',screens:'Архив макетов',sources:'Исходные файлы',file:'Исходный файл',builder:'Конструктор страниц'})[section];
 if(section==='pages')main.innerHTML=pages();
 else if(section==='builder'){const {mountBuilder}=await import('./builder.js');if(revision!==routeRevision)return;disposeRoute=mountBuilder(main,{asset,toast});}
 else if(section==='foundations'){const {renderFoundations}=await import('./foundations.js');if(revision!==routeRevision)return;renderFoundations(detail,main,{escapeHtml,asset});}
 else {const { renderLibrary }=await import('./library.js');if(revision!==routeRevision)return;disposeRoute=await renderLibrary(section,detail,main,{catalog,escapeHtml,ref,asset,heading,copy,toast});}
 document.title=`${document.querySelector('#breadcrumb').textContent} — Квадрат`;
 if(!location.hash.includes('#file/'))window.scrollTo(0,0);
}
document.addEventListener('click',e=>{const target=e.target.closest('[data-copy]');if(target)copy(target.dataset.copy)});
document.querySelector('#close-viewer').onclick=()=>document.querySelector('#viewer').close();
document.querySelector('.skip').onclick=e=>{e.preventDefault();main.focus();main.scrollIntoView()};
document.querySelector('#viewer').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
try { const response=await fetch('catalog.json');if(!response.ok)throw new Error('catalog');catalog=await response.json();window.addEventListener('hashchange',()=>route().catch(showError));await route(); }catch{showError()}
function showError(){main.innerHTML='<div class="error"><h2>Не удалось открыть библиотеку</h2><p>Обновите страницу, чтобы загрузить материалы повторно.</p></div>'}
