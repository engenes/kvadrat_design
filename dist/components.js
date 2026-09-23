import { enhanceSelect } from './select.js';
import { compactPropertyCard } from './homepage/refresh-cards.js';
import { properties } from './homepage/data.js';
import { catalogData } from './catalog-page/data.js';

// Live specimens use the current homepage language. Archived contracts stay in Sources.
export const componentList = [
  ['Button', 'Кнопка', 'Действия', 'Один акцент, спокойная альтернатива и текстовое действие.'],
  ['ButtonCount', 'Кнопка со счётчиком', 'Действия', 'Количество результатов внутри основного действия.'],
  ['IconButton', 'Кнопка с иконкой', 'Действия', 'Компактные действия с понятным названием.'],
  ['Badge', 'Метки и фильтры', 'Основа', 'Статус, категория и выбранный фильтр.'],
  ['FilterChip', 'Условие поиска', 'Основа', 'Применённый фильтр с явным действием удаления.'],
  ['Avatar', 'Аватар', 'Основа', 'Человек, инициалы и подпись без декоративного ореола.'],
  ['Logo', 'Логотип', 'Основа', 'Фирменный знак на графитовой поверхности.'],
  ['Metric', 'Показатель', 'Основа', 'Крупное число, единица измерения и контекст.'],
  ['Input', 'Поле ввода', 'Формы', 'Постоянная подпись, подсказка и понятная ошибка.'],
  ['RangeInput', 'Диапазон значений', 'Формы', 'Связанные границы от и до с общей подписью и единицей.'],
  ['Textarea', 'Многострочное поле', 'Формы', 'Свободный текст с подсказкой и счётчиком.'],
  ['Select', 'Выбор значения', 'Формы', 'Одна непрерывная поверхность для поля и списка.'],
  ['Choice', 'Чекбокс и радио', 'Формы', 'Независимые настройки и выбор одного варианта.'],
  ['SegmentedControl', 'Выбор в капсулах', 'Формы', 'Один вариант в группе — в оформлении категорий главной.'],
  ['Switch', 'Переключатель', 'Формы', 'Мгновенное включение или выключение настройки.'],
  ['PropertyCard', 'Карточка объекта', 'Карточки', 'Тот же компонент, что используется на обновлённой главной.'],
  ['ArticleCard', 'Карточка статьи', 'Карточки', 'Редакционная подача: тема, заголовок и время чтения.'],
  ['ServiceCard', 'Карточка услуги', 'Карточки', 'Сдержанная графитовая поверхность и одно действие.'],
  ['Tabs', 'Вкладки', 'Навигация', 'Переключение связанного содержимого внутри страницы.'],
  ['Breadcrumb', 'Хлебные крошки', 'Навигация', 'Короткий путь назад к родительскому разделу.'],
  ['Pagination', 'Навигация списка', 'Навигация', 'Порции содержимого, текущая позиция и крайние состояния.'],
  ['NavBar', 'Навигация сайта', 'Навигация', 'Логотип и компактная группа основных разделов.'],
  ['Footer', 'Подвал', 'Навигация', 'Контакты, разделы и спокойная финальная иерархия.'],
  ['Alert', 'Сообщение', 'Обратная связь', 'Статус объясняется текстом и иконкой, а не только цветом.'],
  ['Toast', 'Уведомление', 'Обратная связь', 'Краткий результат действия с возможностью отмены.'],
  ['EmptyState', 'Пустое состояние', 'Обратная связь', 'Причина отсутствия данных и полезный следующий шаг.'],
  ['Loading', 'Загрузка', 'Обратная связь', 'Скелетон, индикатор и доступное название процесса.'],
  ['Dialog', 'Диалог', 'Составные', 'Одно короткое действие с возвратом фокуса.'],
  ['Accordion', 'Аккордеон', 'Составные', 'Дополнительная информация без перегрузки страницы.'],
  ['Table', 'Таблица', 'Составные', 'Данные, сортировка и выбор строк в плотном интерфейсе.'],
];

const paths = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  warning: '<path d="m12 3 10 18H2L12 3ZM12 9v5m0 3v.1"/>',
  phone: '<path d="m7 3 3 5-3 3a15 15 0 0 0 6 6l3-3 5 3-1 4C10 22 2 14 3 4l4-1Z"/>',
  sort: '<path d="M8 4v16m-4-4 4 4 4-4m4-12v16m-4-12 4-4 4 4"/>',
};
const icon = name => `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
const aliases = { iconbadge: 'IconButton', statring: 'Metric' };
const notes = {
  Button: ['Иерархия через заливку', 'Основная кнопка — циан с тёмным текстом. Вторичная — нейтральная заливка. Текстовая — для менее важного действия. В одной группе выбираем один главный акцент.', 'Во время отправки сохраняем ширину и объясняем состояние текстом. Высота 44, 52 или 58 px; зона нажатия не меньше 44 px.'],
  ButtonCount: ['Количество связано с действием', 'Нейтральная полупрозрачная капсула внутри голубой кнопки показывает число подходящих объектов. Обновление счётчика не применяет поиск само по себе.', 'Доступное имя включает количество. Во время загрузки сохраняется место под счётчик; ошибка поиска показывается рядом с формой, а не одним цветом кнопки.'],
  IconButton: ['Иконка тоже нуждается в названии', 'Круглая заливка отделяет действие от фона. Рамка и свечение не нужны. Избранное — переключаемая кнопка с aria-pressed.', 'Доступное название описывает действие; подсказка title только дополняет его.'],
  Badge: ['Метка или действие', 'Статус — обычный текст. Фильтр — кнопка с понятным действием удаления. Иконка и подпись сохраняют смысл без различения цвета.', 'Не делаем всю метку интерактивной, если у неё нет действия.'],
  FilterChip: ['Одно условие — одно действие', 'Вся капсула удаляет применённое условие. Текст и крестик объясняют действие; отдельный счётчик в условии не нужен.', 'После удаления фокус переходит к соседнему условию, а после последнего — к доступному следующему действию. Длинная подпись переносится.'],
  Avatar: ['Портрет без декоративных эффектов', 'Мягкий круг, спокойный фон и живой портрет. Если фотографии нет, используем инициалы.', 'Когда имя уже написано рядом, изображение имеет пустой alt и не повторяет подпись для скринридера.'],
  Metric: ['Число вместо украшения', 'Иерархию создают размер числа, краткая подпись и свободное пространство. Разные показатели используют одинаковый ритм.', 'Указываем единицы и контекст. Финансовые значения в библиотеке — демонстрационные.'],
  Input: ['Один компонент на всех страницах', 'Залитое поле без нижней линии и постоянной рамки. Высота 52 px, радиус 12 px, текст 16 px. На светлом фоне поле нейтральное, на нейтральной панели — белое.', 'Тот же ui-input используется на контактах и в модальных окнах главной, каталога и объекта. Подпись постоянная, фокус голубой, ошибка обозначена текстом и красным контуром.'],
  RangeInput: ['Один диапазон, две ясные границы', 'Fieldset и legend объединяют поля; «от», «до» и единицы остаются видимыми. Белая поверхность отделяет ввод от нейтрального фона фильтра без декоративного контура.', 'Любую границу можно оставить пустой. Ошибка связана с обоими полями, объясняет порядок значений и не прячет клавиатурный фокус.'],
  Textarea: ['Тот же компонент для длинного текста', 'Общая заливка, радиус, типографика, фокус и ошибка с Input. Начальная высота не меньше 144 px; поле можно растянуть по вертикали.', 'Этот же компонент используется в обращении на странице контактов и в консультациях. Счётчик и подсказка остаются видимыми.'],
  Select: ['Единая поверхность', 'Поле и список образуют одну поверхность. Выбор отмечен голубой заливкой и простой галочкой. Наведение подсвечивает строку; на выбранной строке оттенок насыщеннее. Клавиатурный фокус обозначен отдельно.', '↑ ↓ — переход; Home / End — края списка; Enter — выбор; Escape — закрыть; ввод первых букв — поиск. Исходный select сохраняет значение.'],
  Choice: ['Одинаковая галочка во всех формах', 'Общие ui-check и ui-radio: размер 22 px, голубой акцент, одинаковые фокус, ошибка и недоступность. Такой же чекбокс используется в согласии на контактах и в обратном звонке; частичный выбор показан в таблице.', 'Нативные input сохраняют поведение: Space переключает чекбокс, стрелки выбирают радио. Нажать можно на всю подпись.'],
  SegmentedControl: ['Один внешний вид, правильная семантика', 'Белая активная капсула на нейтральной поверхности — как категории каталога на главной. Общий ui-segments используется для вкладок, ссылок и выбора адресата на контактах.', 'Для значения формы используем radio с общим name и legend. Стрелки выбирают вариант, Tab переходит дальше. Длинные подписи переносят капсулы на новую строку.'],
  Switch: ['Настройка применяется сразу', 'Текст называет настройку, подпись объясняет результат. Положение, слово «Включено» и цвет вместе показывают состояние.', 'Для выбора в форме используем чекбокс. Переключатель подходит для самостоятельной настройки без дополнительной кнопки сохранения.'],
  PropertyCard: ['Одна реализация с главной', 'Галерея импортирует compactPropertyCard, поэтому иерархия цены, характеристик, фотографии и адреса не расходится с главной.', 'Изображение и название ведут к объекту. Избранное — отдельная кнопка. Обводка и постоянная тень карточке не нужны.'],
  ArticleCard: ['Редакционная иерархия', 'Нейтральная заливка, лёгкий заголовок и компактная метаинформация. Карточка отвечает на вопрос, зачем читать материал.', 'Внутри — одно основное действие. Для настоящего материала оно должно быть ссылкой на отдельную страницу.'],
  ServiceCard: ['Спокойная тёмная поверхность', 'Графитовый фон, крупный короткий заголовок и светлая подпись продолжают блок услуг главной.', 'На отдельной карточке достаточно фона. Разделители уместны между строками общего списка, а не вокруг поверхности.'],
  Tabs: ['Связанное содержимое', 'Тот же ui-segments, что в каталоге главной и выборе адресата: белая активная капсула, нейтральная общая поверхность. Здесь вкладки управляют панелью содержимого.', '← →, Home и End переводят фокус и активируют вкладку. Tab переводит фокус в открытую панель.'],
  Breadcrumb: ['Вернуться на уровень выше', 'Последний пункт — текущая страница, остальные — ссылки. Разделители скрыты от скринридера.', 'При нехватке места переносим строки. Не скрываем единственный путь назад за обрезанным текстом.'],
  Pagination: ['Понятная позиция в списке', 'Текущая порция отмечена aria-current, недоступная стрелка имеет disabled. Область списка сообщает об изменении.', 'Номера страниц уместны при известном общем количестве. Для публичного каталога с курсором используем «Показать ещё»; пример ниже демонстрирует оба варианта.'],
  Alert: ['Сообщение с действием по смыслу', 'Тональная заливка, иконка и понятный текст. Ошибку сопровождаем следующим шагом, а успех не заставляет пользователя ничего делать.', 'Статичный пример не прерывает чтение. Динамическая критичная ошибка может использовать role=alert.'],
  Toast: ['Обратная связь без потери контекста', 'Небольшое сообщение подтверждает действие и при необходимости предлагает отмену. Оно не перекрывает основной интерфейс.', 'Пример остаётся видимым до закрытия: действие «Отменить» доступно без гонки с таймером. Статус объявляется через polite live-region.'],
  EmptyState: ['Состояние тоже часть сценария', 'Короткий заголовок объясняет, что произошло; подпись и одно действие помогают продолжить.', 'Отличаем первый запуск, отсутствие результатов и ошибку. Не показываем технические детали вместо полезного следующего шага.'],
  Loading: ['Стабильная геометрия', 'Скелетон повторяет будущую компоновку без декоративного мерцания. Для измеримой загрузки используем progress с подписью.', 'Скелетон скрыт от скринридера; процесс имеет текстовый статус. При reduced motion анимация выключена.'],
  Dialog: ['Одна задача в одном окне', 'Нативный dialog удерживает фокус, закрывается по Escape и возвращает пользователя к кнопке открытия.', 'Есть явная кнопка закрытия, label каждого поля и текст результата. В образце данные никуда не отправляются.'],
  Accordion: ['Дополнительное раскрывается по запросу', 'Нативные details / summary доступны с клавиатуры и без JavaScript. Вся строка заголовка — зона нажатия.', 'Раскрытие не меняет страницу. Важные условия и ошибки не прячем внутри закрытого аккордеона.'],
  Table: ['Плотность без визуального шума', 'У таблицы одна нейтральная поверхность; разделители отделяют строки, а не обрамляют карточку.', 'Сортировка обозначена aria-sort; чекбоксы имеют имя строки. На узком экране прокручивается только таблица.'],
};

export function renderComponents(detail, main, ctx) {
  const { asset, heading, escapeHtml: e, toast } = ctx;
  const requested = aliases[detail.toLowerCase()] || detail;
  const [id, title, group, description] = componentList.find(c => c[0].toLowerCase() === requested.toLowerCase()) || componentList[0];
  const catalogComponent = ['RangeInput', 'FilterChip', 'ButtonCount'].includes(id);
  const fieldComponent = ['Input', 'Textarea', 'Choice', 'SegmentedControl'].includes(id);
  const controller = new AbortController();
  let sampleController, disposeSelect, sampleTimers = [];
  main.innerHTML = heading('Компоненты', 'Единый язык обновлённой главной: спокойные поверхности, ясная иерархия и выразительная типографика.', 'Квадрат / UI', `${componentList.length} семейств`) + `
    <div class="component-layout ui-library">
      <nav class="component-nav" aria-label="Компоненты">${componentList.map(([key, label, category], index) => `${index === 0 || componentList[index - 1][2] !== category ? `<p class="ui-nav-group">${category}</p>` : ''}<a href="#components/${key}" ${key === id ? 'aria-current="page"' : ''}><strong>${label}</strong><small>${key}</small></a>`).join('')}</nav>
      <div class="component-main"><div class="component-title"><div><p class="eyebrow">${group} / ${id}</p><h2>${title}</h2><p class="meta">${description}</p></div><a class="inline-link" href="${fieldComponent ? 'contacts.html#write' : catalogComponent ? 'property-catalog.html' : 'homepage.html'}">${fieldComponent ? 'На странице контактов ↗' : catalogComponent ? 'В каталоге ↗' : 'Эталон: главная ↗'}</a></div>
      <div class="specimen-toolbar" id="specimen-controls"></div><section class="specimen ui-specimen" id="specimen" aria-label="Живой образец: ${title}"></section>
      <div class="panel component-notes">${(notes[id] || ['Единый визуальный язык', 'Плоские заливки, свободное пространство и та же типографика, что на главной. Если поверхность отличается по фону, декоративная рамка не нужна.', 'Переходы в образце ведут на локальные страницы библиотеки.']).map((text, i) => i ? `<p>${text}</p>` : `<h3>${text}</h3>`).join('')}<p class="ui-notes-link"><a href="#foundations">Цвета, типографика и правила поверхностей →</a></p></div>
      </div></div>`;
  const controls = main.querySelector('#specimen-controls');
  const stage = main.querySelector('#specimen');
  const control = (label, name, options) => `<label class="select-label" for="demo-control-${name}">${label}<select id="demo-control-${name}" name="${name}">${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join('')}</select></label>`;
  const fieldStates = [['normal', 'Обычное'], ['filled', 'Заполнено'], ['error', 'Ошибка'], ['disabled', 'Недоступно']];
  let toolbar = '';
  if (id === 'Button') toolbar = control('Вариант', 'variant', [['primary', 'Основная'], ['secondary', 'Вторичная'], ['text', 'Текстовая']]) + control('Размер', 'size', [['md', '52 px'], ['sm', '44 px'], ['lg', '58 px']]) + control('Состояние', 'state', [['normal', 'Обычное'], ['disabled', 'Недоступно'], ['loading', 'Загрузка']]);
  if (['Input', 'Textarea'].includes(id)) toolbar = control('Состояние', 'state', [...fieldStates, ['readonly', 'Только чтение']]) + control('Окружение', 'surface', [['paper', 'Светлый фон'], ['panel', 'Нейтральная панель']]);
  if (id === 'RangeInput') toolbar = control('Диапазон', 'variant', [['price', 'Цена, ₽'], ['area', 'Площадь, м²']]) + control('Состояние', 'state', fieldStates);
  if (id === 'FilterChip') toolbar = control('Состояние', 'state', [['normal', 'Доступно'], ['disabled', 'Недоступно']]);
  if (id === 'ButtonCount') toolbar = control('Состояние', 'state', [['normal', 'Обычное'], ['disabled', 'Недоступно'], ['loading', 'Загрузка']]);
  if (id === 'Select') toolbar = control('Состояние', 'state', fieldStates) + control('Список', 'example', [['property', 'Недвижимость'], ['cities', 'Города · длинный список']]);
  if (id === 'Avatar') toolbar = control('Вариант', 'variant', [['photo', 'Фотография'], ['initials', 'Инициалы']]) + control('Размер', 'size', [['64', '64 px'], ['40', '40 px'], ['96', '96 px']]);
  if (id === 'Logo') toolbar = control('Вариант', 'variant', [['full', 'Полная версия'], ['mark', 'Знак']]);
  if (id === 'Alert') toolbar = control('Тон', 'variant', [['info', 'Информация'], ['success', 'Успех'], ['warning', 'Предупреждение'], ['danger', 'Ошибка']]);
  if (id === 'Choice') toolbar = control('Состояние', 'state', [['normal', 'Доступно'], ['error', 'Ошибка'], ['disabled', 'Недоступно']]);
  if (id === 'Switch' || id === 'SegmentedControl') toolbar = control('Состояние', 'state', [['normal', 'Доступно'], ['disabled', 'Недоступно']]);
  if (id === 'EmptyState') toolbar = control('Причина', 'variant', [['search', 'Нет результатов'], ['favorite', 'Нет избранного']]);
  if (id === 'Metric') toolbar = control('Поверхность', 'variant', [['light', 'Светлая'], ['dark', 'Графитовая']]);
  controls.innerHTML = toolbar || '<span class="meta">Интерактивный образец · клавиатура, мышь и касание</span>';

  function render() {
    sampleController?.abort();
    stage.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    disposeSelect?.(); disposeSelect = null;
    sampleTimers.forEach(clearTimeout); sampleTimers = [];
    sampleController = new AbortController();
    const { signal } = sampleController;
    const on = (target, event, callback) => target?.addEventListener(event, callback, { signal });
    const later = (callback, delay) => sampleTimers.push(setTimeout(callback, delay));
    const values = Object.fromEntries([...controls.querySelectorAll('select')].map(select => [select.name, select.value]));
    const disabled = values.state === 'disabled' ? 'disabled' : '';
    const invalid = values.state === 'error';
    const readonly = values.state === 'readonly' ? 'readonly' : '';
    const errorAttrs = invalid ? 'aria-invalid="true"' : '';
    const button = (label, action = '', variant = 'primary', extra = '') => `<button type="button" class="ui-button ui-button--${variant}" ${action ? `data-action="${action}"` : ''} ${extra}>${label}</button>`;
    const dark = ['Logo', 'NavBar', 'Footer', 'ServiceCard'].includes(id);
    stage.classList.toggle('ui-specimen--dark', dark);
    stage.classList.toggle('ui-fields-raised', ['Input', 'Textarea'].includes(id) && values.surface === 'panel');
    stage.classList.remove('dark', 'select-specimen');
    stage.innerHTML = '';
    if (id === 'Button') stage.innerHTML = `<div class="ui-stack ui-center">${button(values.state === 'loading' ? '<span class="ui-spinner" aria-hidden="true"></span> Сохраняем…' : `Оставить заявку ${icon('arrow')}`, 'button', values.variant, `data-size="${values.size}" ${values.state !== 'normal' ? 'disabled' : ''} ${values.state === 'loading' ? 'aria-busy="true"' : ''}`)}<p class="ui-hint" role="status" data-result>Нажмите, чтобы проверить обратную связь.</p></div>`;
    if (id === 'IconButton') stage.innerHTML = `<div class="ui-stack"><div class="ui-action-group" role="group" aria-label="Действия с объектом"><button type="button" class="ui-icon-button" data-action="previous" aria-label="Предыдущий объект" title="Предыдущий объект">${icon('back')}</button><button type="button" class="ui-icon-button" data-action="next" aria-label="Следующий объект" title="Следующий объект">${icon('arrow')}</button><button type="button" class="ui-icon-button" data-favorite="icon" aria-pressed="false" aria-label="Добавить в избранное" title="Избранное">${icon('heart')}</button><button type="button" class="ui-icon-button" disabled aria-label="Позвонить — недоступно" title="Недоступно">${icon('phone')}</button></div><p class="ui-hint" role="status" data-result>Объект 1 из 4</p></div>`;
    if (id === 'Badge') stage.innerHTML = `<div class="ui-stack"><div class="ui-row"><span class="ui-badge">Новостройка</span><span class="ui-badge ui-badge--success">${icon('check')} Сдан</span><span class="ui-badge ui-badge--warning">${icon('info')} На проверке</span></div><div class="ui-row"><button class="ui-filter-chip" data-action="remove-filter" aria-label="Убрать фильтр: 2 комнаты">2 комнаты ${icon('close')}</button><button class="ui-filter-chip" data-action="remove-filter" aria-label="Убрать фильтр: до 8 млн рублей">До 8 млн ₽ ${icon('close')}</button></div><p class="ui-hint" role="status" data-result>Два активных фильтра</p></div>`;
    if (id === 'RangeInput') {
      const range = values.variant === 'area' ? { label: 'Площадь', unit: 'м²', min: '35', max: '86', step: 'any' } : { label: 'Цена', unit: '₽', min: '2650000', max: '4650000', step: '1' };
      const bounds = invalid ? [range.max, range.min] : values.state === 'filled' ? [range.min, range.max] : ['', ''];
      stage.innerHTML = `<form class="ui-range-demo ui-stack" novalidate><fieldset class="ui-range-field" ${disabled}><legend>${range.label}<span>${range.unit}</span></legend><div class="ui-range-inputs">${['от', 'до'].map((bound, index) => `<label><span>${bound}</span><input class="ui-range-input" type="number" name="${index ? 'max' : 'min'}" min="0" step="${range.step}" inputmode="decimal" placeholder="Не задано" value="${bounds[index]}" aria-label="${range.label} ${bound}, ${range.unit === '₽' ? 'рубли' : 'квадратные метры'}" aria-describedby="range-help range-error" ${errorAttrs}></label>`).join('')}</div><p id="range-help" class="ui-range-help">Оставьте границу пустой, если не хотите её ограничивать.</p><p id="range-error" class="ui-range-error" role="alert" ${invalid ? '' : 'hidden'}>${invalid ? 'Значение «от» должно быть не больше значения «до».' : ''}</p></fieldset><button type="submit" class="ui-button ui-button--primary" ${disabled}>Применить диапазон ${icon('arrow')}</button><p class="ui-hint" data-result role="status">${invalid ? 'Исправьте границы диапазона.' : 'Введите значения и примените диапазон.'}</p></form>`;
    }
    if (id === 'FilterChip') stage.innerHTML = `<div class="ui-stack ui-filter-demo"><p class="ui-hint">Применённые условия</p><div class="ui-row" aria-label="Применённые фильтры">${['1 комната', 'До 4 650 000 ₽', 'Монолитный или кирпичный дом'].map(label => `<button type="button" class="ui-filter-chip" data-action="remove-catalog-filter" aria-label="Убрать условие: ${label}" ${disabled}><span>${label}</span>${icon('close')}</button>`).join('')}</div><p class="ui-hint" data-result role="status">Нажмите на условие, чтобы убрать его из поиска.</p>${button('Восстановить условия', 'restore-catalog-filters', 'text', disabled)}</div>`;
    if (id === 'ButtonCount') {
      const busy = values.state === 'loading';
      stage.innerHTML = `<div class="ui-stack ui-count-demo"><fieldset class="ui-fieldset" ${disabled || (busy ? 'disabled' : '')}><legend>Количество комнат</legend>${[['', 'Любое'], ['1', '1 комната'], ['3', '3 комнаты']].map(([value, label], index) => `<label class="ui-choice"><input class="ui-radio" type="radio" name="count-rooms" value="${value}" ${index ? '' : 'checked'}><span>${label}</span></label>`).join('')}</fieldset>${button(`${busy ? '<span class="ui-spinner" aria-hidden="true"></span><span>Подбираем объекты</span>' : '<span>Показать объекты</span>'}<span class="ui-button-count" data-count aria-hidden="true">${busy ? '…' : catalogData.properties.length}</span>`, 'apply-count', 'primary', `aria-label="${busy ? 'Подбираем объекты' : `Показать объекты: ${catalogData.properties.length}`}" ${disabled || (busy ? 'disabled aria-busy="true"' : '')}`)}<p class="ui-hint" role="status" data-result>${busy ? 'Подбираем подходящие объекты…' : 'Выберите число комнат — счётчик обновится до применения.'}</p></div>`;
    }

    if (id === 'Avatar') stage.innerHTML = `<figure class="ui-person"><span class="ui-avatar" style="--avatar-size:${values.size}px">${values.variant === 'photo' ? `<img src="${asset('images/avatar-photo-1.png')}" alt="">` : '<span aria-hidden="true">АТ</span>'}</span><figcaption><strong>Алия Татлубаева</strong><span>Агент по недвижимости</span></figcaption></figure>`;
    if (id === 'Logo') stage.innerHTML = `<img class="ui-logo" src="${asset(`logo/${values.variant === 'mark' ? 'kvadrat-mark.svg' : 'kvadrat-logo-full.svg'}`)}" alt="Квадрат — агентство недвижимости">`;
    if (id === 'Metric') stage.innerHTML = `<div class="ui-metric-grid ${values.variant === 'dark' ? 'ui-metric-grid--dark' : ''}"><div class="ui-metric"><span>Знаем город</span><strong>15 <small>лет</small></strong><p>Помогаем найти своё место</p></div><div class="ui-metric"><span>В нашей подборке</span><strong>248</strong><p>Объектов для жизни и бизнеса</p></div></div>`;
    if (id === 'Input') stage.innerHTML = `<div class="ui-form"><label class="ui-field-label" for="sample-input">Ваше имя</label><input class="ui-input" id="sample-input" name="name" autocomplete="given-name" placeholder="Например, Алия" value="${['filled', 'readonly'].includes(values.state) ? 'Алия' : ''}" aria-describedby="input-help" ${errorAttrs} ${disabled} ${readonly}><p id="input-help" class="${invalid ? 'ui-field-error' : 'ui-field-hint'}">${invalid ? 'Укажите имя, чтобы мы могли к вам обратиться.' : readonly ? 'Только чтение. Значение можно выделить и скопировать.' : 'Как к вам обращаться при звонке.'}</p></div>`;
    if (id === 'Textarea') stage.innerHTML = `<div class="ui-form"><label class="ui-field-label" for="sample-textarea">Что для вас важно</label><textarea class="ui-input" id="sample-textarea" name="message" maxlength="240" rows="4" aria-describedby="textarea-help textarea-counter" ${errorAttrs} ${disabled} ${readonly} placeholder="Район, планировка, срок переезда…">${['filled', 'readonly'].includes(values.state) ? 'Ищем светлую квартиру рядом с парком.' : ''}</textarea><div class="ui-field-meta"><p id="textarea-help" class="${invalid ? 'ui-field-error' : 'ui-field-hint'}">${invalid ? 'Опишите, какой объект вы ищете.' : readonly ? 'Только чтение. Текст можно выделить и скопировать.' : 'Необязательно. До 240 символов.'}</p><span class="ui-field-hint" id="textarea-counter"></span></div></div>`;
    if (id === 'Select') {
      const cities = values.example === 'cities';
      const options = cities ? ['Абакан', 'Анапа', 'Барнаул', 'Владивосток', 'Воронеж', 'Екатеринбург', 'Казань', 'Калининград', 'Краснодар', 'Красноярск', 'Москва', 'Нижний Новгород', 'Новосибирск', 'Омск', 'Оренбург', 'Пермь', 'Ростов-на-Дону', 'Самара', 'Санкт-Петербург', 'Сочи', 'Тюмень', 'Уфа', 'Челябинск'] : ['Квартира', 'Дом', 'Земля', 'Коммерческая недвижимость'];
      stage.innerHTML = `<div class="ui-form"><label for="sample-select">${cities ? 'Город' : 'Тип недвижимости'}</label><select id="sample-select" name="${cities ? 'city' : 'property_type'}" ${disabled} ${errorAttrs} aria-describedby="select-help"><option value="" disabled hidden ${values.state !== 'filled' ? 'selected' : ''}>${cities ? 'Выберите город' : 'Выберите тип'}</option>${options.map((label, index) => `<option value="${e(label)}" ${values.state === 'filled' && index === 0 ? 'selected' : ''}>${e(label)}</option>`).join('')}</select><p id="select-help" class="${invalid ? 'ui-error' : 'ui-hint'}">${invalid ? 'Выберите значение, чтобы продолжить.' : cities ? 'Для быстрого поиска наберите первые буквы.' : 'Выберите подходящий вариант для поиска.'}</p></div>`;
      disposeSelect = enhanceSelect(stage.querySelector('#sample-select'));
    }
    if (id === 'Choice') stage.innerHTML = `<div class="ui-choice-grid"><fieldset class="ui-fieldset" ${disabled}><legend>Дополнительно</legend><label class="ui-choice"><input class="ui-check" type="checkbox" name="features" value="balcony" checked><span>С балконом</span></label><label class="ui-choice"><input class="ui-check" type="checkbox" name="features" value="parking" ${errorAttrs} ${invalid ? 'aria-describedby="choice-error"' : ''}><span>С парковкой</span></label>${invalid ? '<p class="ui-field-error" id="choice-error">Выберите этот параметр, чтобы проверить состояние ошибки.</p>' : ''}<label class="ui-choice"><input class="ui-check" type="checkbox" disabled><span>С бассейном <small>Пока нет объектов</small></span></label></fieldset><fieldset class="ui-fieldset" ${disabled}><legend>Тип сделки</legend><label class="ui-choice"><input class="ui-radio" type="radio" name="deal" value="buy" checked><span>Покупка</span></label><label class="ui-choice"><input class="ui-radio" type="radio" name="deal" value="rent"><span>Аренда</span></label></fieldset></div>`;
    if (id === 'SegmentedControl') stage.innerHTML = `<fieldset class="ui-fieldset" ${disabled}><legend>Кому написать</legend><div class="ui-segments ui-segments--wrap"><label class="ui-segment"><input type="radio" name="recipient-demo" value="agency" checked><span>В агентство</span></label><label class="ui-segment"><input type="radio" name="recipient-demo" value="director"><span>Директору</span></label><label class="ui-segment"><input type="radio" name="recipient-demo" disabled><span>Специалисту по недвижимости</span></label></div></fieldset>`;
    if (id === 'Switch') stage.innerHTML = `<div class="ui-setting"><div><label id="switch-label" for="sample-switch">Новые объекты в подборке</label><p class="ui-hint" id="switch-help">Сообщать, когда появится подходящий вариант.</p><p class="ui-setting-state" role="status" data-result>Включено</p></div><input type="checkbox" role="switch" id="sample-switch" class="ui-switch" checked aria-labelledby="switch-label" aria-describedby="switch-help" ${disabled}></div>`;
    if (id === 'PropertyCard') stage.innerHTML = `<div class="ui-property-demo">${compactPropertyCard(properties[1])}</div><p class="ui-sr-only" role="status" data-result></p>`;
    if (id === 'ArticleCard') stage.innerHTML = `<article class="ui-article"><div class="ui-article-topic"><span>Журнал / Полезно</span>${icon('home')}</div><h3><button type="button" data-action="article">Как выбрать квартиру,<br>в которой хочется жить</button></h3><p>Свет, планировка и район: на что обратить внимание на просмотре.</p><div class="ui-article-meta"><span>5 минут чтения</span><span class="ui-icon-disc">${icon('arrow')}</span></div></article>`;
    if (id === 'ServiceCard') stage.innerHTML = `<article class="ui-service"><span class="ui-kicker">01 / Услуги</span><h3>Продать<br>недвижимость</h3><p class="ui-service-lead">С понятным планом и личным агентом</p><p>Подготовим объект, найдём покупателя и будем рядом на каждом этапе.</p><a class="ui-service-link" href="homepage.html#services">Обсудить продажу <span class="ui-icon-disc">${icon('arrow')}</span></a></article>`;
    if (id === 'Tabs') stage.innerHTML = `<div class="ui-tabs-demo"><div class="ui-tabs ui-segments" role="tablist" aria-label="Тип недвижимости">${[['apartments', 'Квартиры'], ['houses', 'Дома'], ['commercial', 'Бизнес']].map(([key, label], i) => `<button type="button" class="ui-segment" role="tab" id="tab-${key}" aria-controls="panel-${key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`).join('')}</div>${[['apartments', 'Квартира для вашего ритма', 'Светлая студия или просторная квартира для семьи.'], ['houses', 'Больше пространства для жизни', 'Дом с участком в городе или в тихом пригороде.'], ['commercial', 'Место для вашего дела', 'Офисы, торговые помещения и готовые пространства.']].map(([key, heading, text], i) => `<div class="ui-tab-panel" id="panel-${key}" role="tabpanel" aria-labelledby="tab-${key}" tabindex="0" ${i ? 'hidden' : ''}><h3>${heading}</h3><p>${text}</p></div>`).join('')}</div>`;
    if (id === 'Breadcrumb') stage.innerHTML = `<nav class="ui-breadcrumb" aria-label="Хлебные крошки"><ol><li><a href="homepage.html">Главная</a></li><li><span aria-hidden="true">/</span><a href="property-catalog.html">Недвижимость</a></li><li><span aria-hidden="true">/</span><span aria-current="page">3-комнатная квартира</span></li></ol></nav>`;
    if (id === 'Pagination') stage.innerHTML = `<div class="ui-stack ui-pagination-demo"><div class="ui-page-results" aria-live="polite" aria-atomic="true"><strong data-page-title>Объекты 1–3 из 9</strong><p class="ui-hint" data-page-description>Квартиры в центре города</p></div><nav class="ui-pagination" aria-label="Страницы результатов"><button type="button" class="ui-icon-button" data-page-step="-1" aria-label="Предыдущая страница" disabled>${icon('back')}</button>${[1, 2, 3].map(page => `<button type="button" class="ui-page-button" data-page="${page}" aria-label="Страница ${page}" ${page === 1 ? 'aria-current="page"' : ''}>${page}</button>`).join('')}<button type="button" class="ui-icon-button" data-page-step="1" aria-label="Следующая страница">${icon('arrow')}</button></nav><div class="ui-load-more">${button('Показать ещё 3 объекта', 'more', 'secondary')}<p class="ui-hint" role="status" data-more-result>Показано 3 из 9</p></div></div>`;
    if (id === 'NavBar') stage.innerHTML = `<div class="ui-site-header"><a href="homepage.html" aria-label="Квадрат — на главную"><img src="${asset('logo/kvadrat-logo-full.svg')}" alt=""></a><nav class="ui-site-nav" aria-label="Основная навигация образца"><a href="property-catalog.html">Недвижимость</a><a href="homepage.html#services">Услуги</a><a href="homepage.html#about">О нас</a><a href="homepage.html#contacts">Контакты</a></nav><a class="ui-icon-button" href="homepage.html#contacts" aria-label="Связаться с Квадратом">${icon('phone')}</a></div>`;
    if (id === 'Footer') stage.innerHTML = `<footer class="ui-footer"><div><img src="${asset('logo/kvadrat-logo-full.svg')}" alt="Квадрат"><p>Ваш личный агент<br>по недвижимости</p></div><nav aria-label="Разделы в подвале образца"><a href="property-catalog.html">Недвижимость</a><a href="homepage.html#services">Услуги агентства</a><a href="homepage.html#contacts">Контакты</a></nav><div><span class="ui-kicker">Давайте знакомиться</span><a class="ui-footer-contact" href="homepage.html#contacts">Найти свой Квадрат ${icon('arrow')}</a><p>Поможем с первым шагом</p></div></footer>`;
    if (id === 'Alert') {
      const messages = { info: ['Подборка обновляется', 'Новые объекты появятся здесь, когда мы найдём подходящие варианты.', 'info'], success: ['Изменения сохранены', 'Ваши предпочтения учтены в подборке.', 'check'], warning: ['Проверьте номер телефона', 'Без актуального номера агент не сможет с вами связаться.', 'warning'], danger: ['Не удалось сохранить', 'Проверьте подключение и попробуйте ещё раз.', 'warning'] };
      const [heading, copy, glyph] = messages[values.variant];
      stage.innerHTML = `<div class="ui-alert ui-alert--${values.variant}">${icon(glyph)}<div><h3>${heading}</h3><p>${copy}</p>${values.variant === 'danger' ? button('Попробовать снова', 'retry', 'text') : ''}</div></div><p class="ui-sr-only" role="status" data-result></p>`;
    }
    if (id === 'Toast') stage.innerHTML = `<div class="ui-stack ui-toast-demo">${button(`Добавить в избранное ${icon('heart')}`, 'show-toast', 'secondary')}<div class="ui-toast-slot"><div class="ui-toast" hidden><span class="ui-toast-mark">${icon('check')}</span><p>Объект добавлен в избранное</p><button type="button" class="ui-text-button" data-action="undo-toast">Отменить</button><button type="button" class="ui-icon-button" data-action="close-toast" aria-label="Закрыть уведомление">${icon('close')}</button></div></div><p class="ui-sr-only" role="status" aria-live="polite" data-result></p></div>`;
    if (id === 'EmptyState') stage.innerHTML = `<div class="ui-empty"><span class="ui-empty-icon">${icon(values.variant === 'favorite' ? 'heart' : 'search')}</span><h3>${values.variant === 'favorite' ? 'Здесь будет ваше избранное' : 'Пока ничего не нашли'}</h3><p>${values.variant === 'favorite' ? 'Отмечайте понравившиеся объекты сердечком, чтобы вернуться к ним позже.' : 'Попробуйте убрать часть фильтров или расширить район поиска.'}</p>${values.variant === 'favorite' ? '<a class="ui-button ui-button--secondary" href="property-catalog.html">Посмотреть объекты</a>' : button('Сбросить фильтры', 'reset-filters', 'secondary')}<p class="ui-hint" role="status" data-result></p></div>`;
    if (id === 'Loading') stage.innerHTML = `<div class="ui-loading-demo"><div class="ui-skeleton-card" aria-hidden="true"><div class="ui-skeleton ui-skeleton-photo"></div><div class="ui-skeleton ui-skeleton-title"></div><div class="ui-skeleton ui-skeleton-line"></div><div class="ui-skeleton ui-skeleton-price"></div></div><div class="ui-stack"><p class="ui-loading-label" role="status"><span class="ui-spinner" aria-hidden="true"></span>Подбираем объекты…</p><label class="ui-progress-label" for="sample-progress">Загрузка фотографий <span data-progress-value>40 %</span></label><progress id="sample-progress" value="40" max="100">40 %</progress>${button('Продолжить загрузку', 'progress', 'secondary')}</div></div>`;
    if (id === 'Dialog') stage.innerHTML = `<div class="ui-stack ui-center">${button('Обсудить подбор', 'open-dialog')}<p class="ui-hint">Короткая форма в диалоговом окне</p><p role="status" class="ui-hint" data-result></p></div>${consultationDialog()}`;
    if (id === 'Accordion') stage.innerHTML = `<div class="ui-accordion">${[['Как начинается подбор?', 'Обсуждаем район, бюджет и важные детали, затем собираем подходящие объекты для просмотра.'], ['Можно ли посмотреть несколько объектов?', 'Да. Вместе с агентом можно выбрать удобное время и объединить несколько просмотров.'], ['Какие документы подготовить?', 'Список зависит от сделки. Агент объяснит, что понадобится на каждом этапе.']].map(([title, text], i) => `<details ${i === 0 ? 'open' : ''}><summary>${title}${icon('chevron')}</summary><p>${text}</p></details>`).join('')}</div>`;
    if (id === 'Table') stage.innerHTML = `<div class="ui-table-demo"><div class="ui-table-summary"><strong>Подборка объектов</strong><span class="ui-hint" role="status" data-selection>Не выбрано</span></div><div class="ui-table-scroll" role="region" aria-label="Объекты: таблица с горизонтальной прокруткой" tabindex="0"><table class="ui-table"><caption class="ui-sr-only">Подборка из трёх объектов. Сортировка по цене.</caption><thead><tr><th scope="col"><input class="ui-check" type="checkbox" aria-label="Выбрать все объекты" data-select-all></th><th scope="col">Объект</th><th scope="col" aria-sort="none" data-sort-heading><button type="button" data-action="sort">Цена ${icon('sort')}</button></th><th scope="col">Статус</th></tr></thead><tbody>${[[1, 'Квартира в центре', 'ул. Революционная, 34', 4650000], [2, 'Светлая студия', 'ул. Тестовая, 34', 2650000], [3, 'Квартира у парка', 'ул. Пролетарская, 34', 5850000]].map(([key, title, address, price]) => `<tr data-price="${price}"><td><input class="ui-check" type="checkbox" name="selected-object" value="${key}" aria-label="Выбрать: ${title}"></td><th scope="row"><a href="property-object.html">${title}</a><span>${address}</span></th><td>${price.toLocaleString('ru-RU')} ₽</td><td><span class="ui-badge ui-badge--success">${icon('check')} В продаже</span></td></tr>`).join('')}</tbody></table></div></div>`;

    let objectIndex = 1, page = 1, loaded = 3;
    const result = message => { const output = stage.querySelector('[data-result]'); if (output) output.textContent = message; else toast(message); };
    on(stage, 'click', event => {
      const favorite = event.target.closest('[data-favorite]');
      if (favorite) { const active = favorite.getAttribute('aria-pressed') !== 'true'; favorite.setAttribute('aria-pressed', String(active)); favorite.setAttribute('aria-label', active ? 'Убрать из избранного' : 'Добавить в избранное'); result(active ? 'Объект добавлен в избранное' : 'Объект убран из избранного'); }
      const action = event.target.closest('[data-action]');
      if (!action) return;
      if (action.dataset.action === 'button') { action.style.width = `${action.getBoundingClientRect().width}px`; action.disabled = true; action.setAttribute('aria-busy', 'true'); action.innerHTML = '<span class="ui-spinner" aria-hidden="true"></span> Сохраняем…'; result('Сохраняем…'); later(() => { action.disabled = false; action.removeAttribute('aria-busy'); action.innerHTML = `Оставить заявку ${icon('arrow')}`; action.style.width = ''; result('Готово. Действие выполнено в образце.'); }, 900); }
      if (['previous', 'next'].includes(action.dataset.action)) { objectIndex = ((objectIndex - 1 + (action.dataset.action === 'next' ? 1 : -1) + 4) % 4) + 1; result(`Объект ${objectIndex} из 4`); }
      if (action.dataset.action === 'remove-filter') { const next = action.nextElementSibling || action.previousElementSibling; action.remove(); result(`Активных фильтров: ${stage.querySelectorAll('[data-action="remove-filter"]').length}`); if (next) next.focus(); else { const output = stage.querySelector('[data-result]'); output.tabIndex = -1; output.focus(); } }
      if (action.dataset.action === 'remove-catalog-filter') { const choices = [...stage.querySelectorAll('[data-action="remove-catalog-filter"]:not(:disabled)')]; const index = choices.indexOf(action); const next = choices[index + 1] || choices[index - 1] || stage.querySelector('[data-action="restore-catalog-filters"]'); action.remove(); const count = stage.querySelectorAll('[data-action="remove-catalog-filter"]').length; result(count ? 'Условие убрано. Осталось условий: ' + count + '.' : 'Все условия убраны. Поиск больше не ограничен.'); next?.focus(); }
      if (action.dataset.action === 'restore-catalog-filters') { render(); stage.querySelector('[data-action="remove-catalog-filter"]').focus(); }
      if (action.dataset.action === 'apply-count') result('Выбор применён в образце. Показано объектов: ' + stage.querySelector('[data-count]').textContent + '.');
      if (action.dataset.action === 'article') { stage.insertAdjacentHTML('beforeend', '<dialog class="ui-dialog" aria-labelledby="article-title"><form method="dialog"><button class="ui-icon-button ui-dialog-close" aria-label="Закрыть статью">' + icon('close') + '</button></form><span class="ui-kicker">Журнал / Полезно</span><h2 id="article-title">Квартира для вашего ритма</h2><p>На просмотре обратите внимание на естественный свет, расположение комнат и звуки за окном. Пройдите от дома до остановки, магазина и парка: район так же важен, как планировка.</p><p class="ui-hint">Демонстрационный материал библиотеки.</p></dialog>'); const dialog = stage.querySelector('dialog'); on(dialog, 'close', () => dialog.remove()); dialog.showModal(); }
      if (action.dataset.action === 'more') { loaded = Math.min(9, loaded + 3); stage.querySelector('[data-more-result]').textContent = `Показано ${loaded} из 9`; if (loaded === 9) { action.disabled = true; action.textContent = 'Все объекты загружены'; } }
      if (action.dataset.action === 'retry') { result('Повторная попытка выполнена. Изменения сохранены.'); const alert = stage.querySelector('.ui-alert'); alert.className = 'ui-alert ui-alert--success'; alert.querySelector(':scope>.ui-icon').outerHTML = icon('check'); const title = alert.querySelector('h3'); title.textContent = 'Изменения сохранены'; title.tabIndex = -1; alert.querySelector('p').textContent = 'Данные успешно обновлены в образце.'; action.remove(); title.focus(); }
      if (action.dataset.action === 'show-toast') { stage.querySelector('.ui-toast').hidden = false; result('Объект добавлен в избранное. Доступна отмена.'); }
      if (['undo-toast', 'close-toast'].includes(action.dataset.action)) { stage.querySelector('.ui-toast').hidden = true; stage.querySelector('[data-action="show-toast"]').focus(); result(action.dataset.action === 'undo-toast' ? 'Добавление в избранное отменено' : 'Уведомление закрыто'); }
      if (action.dataset.action === 'reset-filters') { stage.querySelector('.ui-empty h3').textContent = 'Нашлось 248 объектов'; stage.querySelector('.ui-empty>p').textContent = 'Фильтры сброшены. Теперь можно выбрать подходящий вариант.'; action.outerHTML = '<a class="ui-button ui-button--secondary" href="property-catalog.html">Открыть каталог</a>'; stage.querySelector('.ui-empty a').focus(); result('Фильтры сброшены. Нашлось 248 объектов.'); }
      if (action.dataset.action === 'progress') { const progress = stage.querySelector('progress'); progress.value = Math.min(100, progress.value + 20); stage.querySelector('[data-progress-value]').textContent = `${progress.value} %`; if (progress.value === 100) { action.disabled = true; action.textContent = 'Фотографии загружены'; stage.querySelector('.ui-loading-label').textContent = 'Загрузка завершена'; } }
      if (action.dataset.action === 'open-dialog') stage.querySelector('dialog').showModal();
      if (action.dataset.action === 'sort') { const th = stage.querySelector('[data-sort-heading]'); const asc = th.getAttribute('aria-sort') !== 'ascending'; th.setAttribute('aria-sort', asc ? 'ascending' : 'descending'); [...stage.querySelectorAll('tbody tr')].sort((a, b) => (Number(a.dataset.price) - Number(b.dataset.price)) * (asc ? 1 : -1)).forEach(row => stage.querySelector('tbody').append(row)); }
    });
    if (id === 'RangeInput') {
      const rangeForm = stage.querySelector('form');
      const fields = [...rangeForm.querySelectorAll('input')];
      const error = stage.querySelector('#range-error');
      const validate = () => {
        const invalidNumber = fields.some(field => field.validity.badInput || (field.value !== '' && (!Number.isFinite(field.valueAsNumber) || field.valueAsNumber < 0)));
        const reversed = fields.every(field => field.value !== '') && fields[0].valueAsNumber > fields[1].valueAsNumber;
        const message = invalidNumber ? 'Введите число не меньше нуля.' : reversed ? 'Значение «от» должно быть не больше значения «до».' : '';
        fields.forEach(field => { if (message) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid'); });
        error.textContent = message; error.hidden = !message;
        return !message;
      };
      on(rangeForm, 'input', () => { if (validate()) result('Диапазон изменён. Примените его, чтобы обновить поиск.'); });
      on(rangeForm, 'submit', event => {
        event.preventDefault();
        if (!validate()) { fields[0].focus(); return; }
        const unit = values.variant === 'area' ? 'м²' : '₽';
        const parts = fields.map((field, index) => field.value === '' ? '' : `${index ? 'до' : 'от'} ${field.valueAsNumber.toLocaleString('ru-RU')} ${unit}`).filter(Boolean);
        result(parts.length ? `Диапазон применён: ${parts.join(' ')}.` : 'Диапазон применён без ограничений.');
      });
    }
    if (id === 'ButtonCount') on(stage, 'change', event => {
      if (!event.target.matches('[name="count-rooms"]')) return;
      const rooms = event.target.value;
      const count = catalogData.properties.filter(item => !rooms || item.rooms === Number(rooms)).length;
      stage.querySelector('[data-count]').textContent = count;
      stage.querySelector('[data-action="apply-count"]').setAttribute('aria-label', `Показать объекты: ${count}`);
      result(`Подходит объектов: ${count}. Нажмите «Показать объекты», чтобы применить выбор.`);
    });

    const textarea = stage.querySelector('textarea');
    if (textarea) { const update = () => { stage.querySelector('#textarea-counter').textContent = `${textarea.value.length} / 240`; }; on(textarea, 'input', update); update(); }
    on(stage.querySelector('#sample-switch'), 'change', event => result(event.target.checked ? 'Включено' : 'Выключено'));
    if (id === 'Tabs') {
      const tabs = [...stage.querySelectorAll('[role="tab"]')];
      const activate = (tab, focus = false) => { tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; stage.querySelector(`#${item.getAttribute('aria-controls')}`).hidden = !active; }); if (focus) tab.focus(); };
      tabs.forEach((tab, i) => { on(tab, 'click', () => activate(tab)); on(tab, 'keydown', event => { const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === 'ArrowRight' ? (i + 1) % tabs.length : event.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : -1; if (index >= 0) { event.preventDefault(); activate(tabs[index], true); } }); });
    }
    if (id === 'Pagination') on(stage.querySelector('.ui-pagination'), 'click', event => { const target = event.target.closest('button'); if (!target) return; page = target.dataset.page ? Number(target.dataset.page) : Math.max(1, Math.min(3, page + Number(target.dataset.pageStep))); stage.querySelector('[data-page-title]').textContent = `Объекты ${page * 3 - 2}–${page * 3} из 9`; stage.querySelector('[data-page-description]').textContent = ['Квартиры в центре города', 'Дома и квартиры рядом с парком', 'Новые объекты в тихих районах'][page - 1]; stage.querySelectorAll('[data-page]').forEach(item => { if (Number(item.dataset.page) === page) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current'); }); stage.querySelector('[data-page-step="-1"]').disabled = page === 1; stage.querySelector('[data-page-step="1"]').disabled = page === 3; });
    if (id === 'Dialog') {
      const dialog = stage.querySelector('dialog');
      on(dialog.querySelector('[data-close-dialog]'), 'click', () => dialog.close());
      on(dialog.querySelector('.ui-consult-form'), 'submit', event => { event.preventDefault(); const name = new FormData(event.target).get('name').trim(); if (!name) { const field = dialog.querySelector('[name="name"]'); field.setCustomValidity('Укажите имя.'); field.reportValidity(); return; } dialog.close(); result(`Спасибо, ${name}. Форма заполнена в образце; данные не отправлялись.`); });
      on(dialog.querySelector('[name="name"]'), 'input', event => event.target.setCustomValidity(''));
    }
    if (id === 'Table') on(stage, 'change', event => { const rows = [...stage.querySelectorAll('[name="selected-object"]')]; const all = stage.querySelector('[data-select-all]'); if (event.target === all) rows.forEach(input => { input.checked = all.checked; }); const count = rows.filter(input => input.checked).length; all.checked = count === rows.length; all.indeterminate = count > 0 && count < rows.length; stage.querySelector('[data-selection]').textContent = count ? `Выбрано: ${count}` : 'Не выбрано'; rows.forEach(input => { input.closest('tr').classList.toggle('is-selected', input.checked); }); });
  }

  function consultationDialog() {
    return `<dialog class="ui-dialog" aria-labelledby="sample-dialog-title" aria-describedby="sample-dialog-description"><button type="button" class="ui-icon-button ui-dialog-close" data-close-dialog aria-label="Закрыть диалог">${icon('close')}</button><p class="ui-kicker">Личный агент</p><h2 id="sample-dialog-title">Найдём ваш Квадрат</h2><p id="sample-dialog-description">Расскажите, как к вам обращаться. Это локальный образец: данные не отправляются.</p><form class="ui-consult-form ui-form"><label class="ui-field-label" for="dialog-name">Ваше имя</label><input class="ui-input" id="dialog-name" name="name" autocomplete="given-name" required maxlength="80" placeholder="Например, Алия"><button type="submit" class="ui-button ui-button--primary">Продолжить ${icon('arrow')}</button></form></dialog>`;
  }
  controls.addEventListener('change', render, { signal: controller.signal });
  render();
  const disposeControls = [...controls.querySelectorAll('select')].map(select => enhanceSelect(select, { compact: true }));
  // Reveal the current item in either CSS layout, without scrolling the document.
  // This runs on route entry only, never when a specimen option changes.
  const nav = main.querySelector('.component-nav');
  const navBounds = nav.getBoundingClientRect();
  const currentBounds = nav.querySelector('[aria-current="page"]').getBoundingClientRect();
  const nearestOffset = (start, end, visibleStart, visibleEnd) => start < visibleStart ? start - visibleStart : end > visibleEnd ? end - visibleEnd : 0;
  nav.scrollTo({
    left: nav.scrollLeft + nearestOffset(currentBounds.left, currentBounds.right, navBounds.left, navBounds.right),
    top: nav.scrollTop + nearestOffset(currentBounds.top, currentBounds.bottom, navBounds.top, navBounds.bottom),
    behavior: 'instant',
  });
  return () => { controller.abort(); sampleController?.abort(); stage.querySelectorAll('dialog[open]').forEach(dialog => dialog.close()); disposeSelect?.(); disposeControls.forEach(dispose => dispose()); sampleTimers.forEach(clearTimeout); };
}
