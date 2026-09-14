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
function foundations() {
 const colors=['--blue-500','--blue-600','--neutral-900','--surface-wash','--ink-900'];
 const labels=['Брендовый синий','Глубокий синий','Графит','Фон страницы','Основной текст'];
 return heading('Основы дизайн-системы','Цвет, типографика и ритм, которые объединяют все экраны приложения.','Квадрат / Foundation','Proxima Nova · 13 компонентов')+
 `<nav class="tabs" aria-label="Основы"><a class="active" href="#foundations">Обзор</a><a href="#foundations/colors">Цвета</a><a href="#foundations/typography">Типографика</a><a href="#foundations/spacing">Отступы и форма</a><a href="#foundations/shadows">Тени</a></nav>
 <div class="intro-grid"><section class="brand-panel"><img class="mark" src="${asset('logo/kvadrat-mark.svg')}" alt=""><div><div class="tiny">АГЕНТСТВО НЕДВИЖИМОСТИ</div><h2 style="margin-top:15px">Личный агент.<br>Единый характер.</h2><p>Синий акцент, графитовые поверхности и мягкий свет.</p></div><div class="tiny">КВАДРАТ / ВИЗУАЛЬНЫЙ ЯЗЫК</div></section><section class="type-panel"><div><div class="letters">Аа</div><p>АБВГДЕЁЖЗИЙКЛМНОПРСТ<br>абвгдеёжзийклмнопрст<br>0123456789</p></div><div class="type-info"><strong>Proxima Nova</strong><p>Regular / Semibold<br>Bold / Extrabold</p></div></section></div>
 <div class="section-head"><div><h2>Ключевая палитра</h2><p>Точные значения из исходной дизайн-системы</p></div><a class="btn text" href="#foundations/colors">Все цвета →</a></div><div class="swatches">${colors.map((name,i)=>{const token=catalog.tokens.colors.find(t=>t.name===name);return `<button class="swatch" data-copy="${name}: ${escapeHtml(token.value)};" aria-label="Скопировать ${labels[i]}"><span class="swatch-color" style="background:var(${name})"></span><span class="swatch-info"><strong>${labels[i]}</strong><code>${name}</code><code>${token.value}</code></span></button>`}).join('')}</div><p class="section-note">Нажмите на цвет, чтобы скопировать его CSS-токен.</p>
 <div class="section-head"><h2>В одном визуальном языке</h2><a class="btn text" href="#components">Компоненты →</a></div><div class="two-col"><section class="panel"><h3>Действия</h3><p class="meta" style="margin:5px 0 22px">Скруглённая форма, градиент и контур</p><div class="row"><button class="btn" data-copy="--radius-pill: 100px;">Оставить заявку</button><button class="btn outline" data-copy="--border-subtle: var(--ink-200);">Все объекты</button></div></section><section class="panel"><h3>От компонентов к экранам</h3><p style="color:#60727e;margin:8px 0 14px">Главная, админ-панель, импорт, расписание и меню пользователя.</p><a class="btn text" href="#screens">Открыть каталог макетов →</a></section></div>`;
}
async function route(){
 const revision=++routeRevision;
 disposeRoute?.();disposeRoute=null;
 const [section='foundations', detail=''] = location.hash.slice(1).split('/');
 document.querySelectorAll('[data-nav]').forEach(a=>{a.removeAttribute('aria-current');if(a.dataset.nav===section)a.setAttribute('aria-current','page')});
 document.querySelector('#breadcrumb').textContent=({foundations:'Основы',components:'Компоненты',screens:'Макеты',sources:'Исходные файлы',file:'Исходный файл',builder:'Конструктор страниц'})[section]||'Основы';
 if(section==='builder'){const {mountBuilder}=await import('./builder.js');if(revision!==routeRevision)return;disposeRoute=mountBuilder(main,{asset,toast});}
 else if(section==='foundations'&&!detail) main.innerHTML=foundations();
 else {const { renderLibrary }=await import('./library.js');if(revision!==routeRevision)return;await renderLibrary(section,detail,main,{catalog,escapeHtml,ref,asset,heading,copy,toast});}
 document.title=`${document.querySelector('#breadcrumb').textContent} — Квадрат`;
 if(!location.hash.includes('#file/'))window.scrollTo(0,0);
}
document.addEventListener('click',e=>{const target=e.target.closest('[data-copy]');if(target)copy(target.dataset.copy)});
document.querySelector('#close-viewer').onclick=()=>document.querySelector('#viewer').close();
document.querySelector('.skip').onclick=e=>{e.preventDefault();main.focus();main.scrollIntoView()};
document.querySelector('#viewer').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
try { const response=await fetch('catalog.json');if(!response.ok)throw new Error('catalog');catalog=await response.json();window.addEventListener('hashchange',()=>route().catch(showError));await route(); }catch{showError()}
function showError(){main.innerHTML='<div class="error"><h2>Не удалось открыть библиотеку</h2><p>Обновите страницу, чтобы загрузить материалы повторно.</p></div>'}
