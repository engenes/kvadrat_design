import {art,image,esc} from '../homepage/ui.js';
import {refreshHeader,refreshFooter,icon,cta} from '../homepage/refresh-sections.js';
import {compactPropertyCard} from '../homepage/refresh-cards.js';
import {searchFields} from '../homepage/search-fields.js';
import {catalogData} from './data.js';
import {catalogContext} from './state.js';
import {defaultFilters} from './model.js';

const pageLinks=html=>html.replace(/href="#(services|news|blog|offers|mortgage)"/g,'href="homepage.html#$1"');
export function catalogHeader(){return pageLinks(refreshHeader({theme:'light',current:'catalog'}));}
export function catalogFooter(){return pageLinks(refreshFooter()).replace('Концепция главной · данные демонстрационные','Макет каталога · данные демонстрационные');}
const range=(name,label,unit)=>`<fieldset class="filter-range ui-range-field range-${name.toLowerCase()}"><legend>${label}<span>${unit}</span></legend><div class="range-inputs ui-range-inputs">${['min','max'].map((bound,i)=>`<label><span>${i?'до':'от'}</span><input class="ui-range-input" id="${bound}${name}" name="${bound}${name}" type="number" min="0" step="${name==='Floor'?'1':'any'}" inputmode="${name==='Floor'?'numeric':'decimal'}" aria-label="${label} ${i?'до':'от'}" placeholder="Не задано"></label>`).join('')}</div></fieldset>`;

export function catalogFilter(){return `<form id="catalog-filter" class="catalog-filter" aria-label="Подбор недвижимости" novalidate>
  <button type="button" class="filter-toggle" data-filter-toggle aria-expanded="false" aria-controls="catalog-filter-fields" aria-label="Фильтры поиска" aria-describedby="filter-collapse-summary">
    <span class="filter-toggle-icon" aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 7h7m4 0h5M4 17h3m4 0h9"/><circle cx="13" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg></span>
    <span class="filter-toggle-copy"><span class="filter-toggle-title">Фильтры поиска <span class="ui-button-count filter-applied-count" data-filter-count hidden aria-hidden="true">0</span></span><span id="filter-collapse-summary">Цена, комнаты, площадь и другие условия</span></span>
    <svg class="ui-icon filter-toggle-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </button>
  <div id="catalog-filter-fields" class="catalog-filter-fields">
  <div class="filter-heading"><h2>Параметры поиска</h2><span>Оренбург</span></div>
  <div class="catalog-primary-fields">${searchFields({names:['deal','type','market','rooms'],labelled:true})}</div>
  <div class="filter-ranges">${range('Price','Цена','₽')}${range('Area','Площадь','м²')}</div>
  <details class="extra-filters"><summary>${icon('plus')}<span>Ещё фильтры</span><span class="extra-filter-hint">Этаж, материал стен, район</span></summary><div class="extra-filter-fields">${range('Floor','Этаж','')}
    <label class="wall-filter"><span>Материал стен</span><select name="walls" aria-label="Материал стен"><option value="">Любой</option><option>Монолит</option><option>Панель</option><option>Кирпич</option></select></label>
    ${searchFields({names:['district'],labelled:true})}
    <label class="renovation"><input type="checkbox" name="renovated" role="switch"><span class="switch-track" aria-hidden="true"></span><span>С ремонтом</span></label>
    <p class="filter-data-note">В демонстрационных объектах район и ремонт не указаны.</p>
  </div></details>
  <div class="filter-bottom"><p id="filter-draft-note" role="status" hidden>Условия изменены. Примените их, чтобы обновить список.</p><div class="filter-actions"><button type="reset" class="filter-reset">Сбросить</button><button type="submit" class="r-button filter-submit" aria-label="Показать 20 объектов"><span data-submit-label>Показать объекты</span><span data-submit-count class="ui-button-count" aria-hidden="true">20</span><span class="button-icon">${icon('arrow')}</span></button></div></div>
  <p class="filter-error" id="filter-error" role="alert" tabindex="-1" hidden></p>
  </div>
</form>`;}

export function mapStrip(){return `<button type="button" class="catalog-map-link" data-map aria-haspopup="dialog"><span class="map-thumbnail" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><span><b>Посмотреть карту</b><small>Обзор из макета</small></span>${icon('diagonal')}</button>`;}
export function developmentBanner(){return `<aside class="development-banner" aria-label="Подбор квартиры в новостройке"><div class="banner-copy"><p class="r-kicker">Покупка от застройщика</p><h3>Рассматриваете новостройку?</h3><p>Поможем сравнить планировки, сроки сдачи и условия покупки.</p>${cta('Обсудить подбор','Подбор квартиры в новостройке')}</div><div class="banner-image">${image(catalogData.bannerImage,'Жилые дома в Оренбурге','','loading="lazy" width="600" height="400"')}<span>Квартиры в новых домах ${icon('diagonal')}</span></div></aside>`;}
export function resultCards(items,{banner=true}={}){return items.map((item,index)=>`${index===12&&banner?developmentBanner():''}${compactPropertyCard(item,{showWalls:true})}`).join('');}
export function results(){return `<section class="catalog-results" id="catalog-results" aria-labelledby="results-count" tabindex="-1">
  <div class="results-heading"><div><p class="r-kicker" id="applied-summary">${esc(catalogContext(defaultFilters).summary)}</p><h2 id="results-count" aria-live="polite" aria-atomic="true">20 объектов</h2></div>${mapStrip()}</div>
  <div id="active-filters" class="active-filters" aria-label="Применённые фильтры" hidden></div>
  <div class="results-toolbar"><div class="result-tools"><a href="#catalog-filter" class="edit-filters" data-edit-filters>${icon('plus')} Изменить поиск</a><button type="button" class="favorites-filter" data-favorites-only aria-pressed="false">${heart()}<span>Избранное</span><span data-favorites-count>0</span></button></div><label class="catalog-sort"><span>Сортировка</span><select name="sort" aria-label="Сортировка"><option value="source">По умолчанию</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option></select></label></div>
  <div id="catalog-cards" class="property-grid">${resultCards(catalogData.properties)}</div>
  <div class="catalog-empty" hidden><span class="empty-symbol" aria-hidden="true">${icon('search')}</span><h3>Объекты не найдены</h3><p>Увеличьте бюджет или уберите часть условий поиска.</p><div><button type="button" class="pill" data-clear>Сбросить фильтры</button><button type="button" class="empty-consult" data-consult="Подбор недвижимости">Помощь с подбором ${icon('diagonal')}</button></div></div>
  <div class="catalog-pagination"><p class="page-status">1–20 из 20</p><nav id="catalog-pages" aria-label="Страницы каталога"><button type="button" data-page="1" aria-current="page" aria-label="Страница 1">1</button></nav><label><span>Показывать</span><select name="pageSize" aria-label="Объектов на странице"><option value="20">20</option><option value="12">12</option></select></label></div>
  <p class="catalog-source-note">Объекты и цены из исходного макета. Карточки открывают пример страницы квартиры.</p>
</section>`;}
function heart(){return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';}

export function helpSection(){return `<section class="purchase-help" id="purchase-help" aria-labelledby="help-title"><div class="help-copy"><p class="r-kicker">Помощь покупателю</p><h2 id="help-title">От выбора квартиры<br>до оформления сделки</h2><p>Обсудим бюджет и требования к жилью, организуем просмотры и поможем подготовить документы.</p>${cta('Подобрать с агентом','Подбор недвижимости')}</div><div class="catalog-faq"><details><summary>Как выбрать подходящую квартиру? ${icon('plus')}</summary><p>Начните с бюджета, количества комнат и площади. Сравните этаж, материал стен и расположение. Понравившиеся варианты добавьте в избранное, чтобы вернуться к ним позже.</p></details><details><summary>Как записаться на просмотр? ${icon('plus')}</summary><p>Откройте карточку квартиры и обратитесь к специалисту. Уточните доступность объекта, удобное время и вопросы, которые хотите обсудить на просмотре.</p></details><details><summary>Можно ли купить квартиру в ипотеку? ${icon('plus')}</summary><p>Возможность покупки зависит от объекта и условий банка. Специалист поможет сравнить программы и подготовиться к подаче заявки.</p><a class="r-text-link" href="homepage.html#mortgage">Подробнее об ипотеке ${icon('arrow')}</a></details></div></section>`;}
export function pageContent(){const context=catalogContext(defaultFilters);return `${catalogHeader()}<main id="catalog-page" class="r-container"><nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="homepage.html">Главная</a><span aria-hidden="true">/</span><span id="catalog-context" aria-current="page">${esc(context.breadcrumb)}</span></nav><div class="catalog-intro"><div><p class="r-kicker">Каталог недвижимости</p><h1 id="catalog-title">${esc(context.title)}</h1></div><p id="catalog-subtitle">${esc(context.subtitle)}</p></div>${catalogFilter()}${results()}${helpSection()}</main>${catalogFooter()}<p class="favorite-status sr-only" role="status" aria-live="polite"></p>`;}
