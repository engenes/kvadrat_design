const sections = [
  ['', 'Обзор'], ['colors', 'Цвет'], ['typography', 'Типографика'],
  ['spacing', 'Ритм и форма'], ['shadows', 'Глубина'], ['accessibility', 'Доступность'],
];

const palette = [
  ['--ui-paper', 'Бумага', 'Основной фон, пространство между блоками.'],
  ['--ui-surface', 'Тихая поверхность', 'Карточки и объединённые группы.'],
  ['--ui-surface-soft', 'Второй слой', 'Вложенные элементы и вторичные действия.'],
  ['--ui-surface-raised', 'Белый', 'Поля ввода, меню и модальные окна.'],
  ['--ui-ink', 'Чернила', 'Текст, числа и основные пиктограммы.'],
  ['--ui-muted', 'Вторичный текст', 'Подписи на белом и основном фоне.'],
  ['--ui-dark', 'Графит', 'Первый экран и смысловые акцентные блоки.'],
  ['--ui-on-dark', 'Текст на графите', 'Заголовки и основной текст тёмных блоков.'],
  ['--ui-muted-on-dark', 'Подпись на графите', 'Вторичный текст тёмных блоков.'],
  ['--ui-accent', 'Небесный', 'Главное действие и выбранное состояние.'],
  ['--ui-on-accent', 'Текст на акценте', 'Тёмная подпись на небесной кнопке.'],
  ['--ui-link', 'Ссылка', 'Ссылки в тексте на светлом фоне.'],
  ['--ui-select-accent', 'Выбранный пункт · текст', 'Подпись и простая галочка в Select.'],
  ['--ui-select-selected', 'Выбранный пункт · фон', 'Постоянная отметка текущего значения.'],
  ['--ui-select-hover', 'Пункт · наведение', 'Подсветка строки под указателем.'],
  ['--ui-select-selected-hover', 'Выбор + наведение', 'Наведение на уже выбранное значение.'],
];

function liveToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function tokenButton(name, e, label = '') {
  const value = liveToken(name);
  return `<button class="fd-token" data-copy="${e(`${name}: ${value};`)}" aria-label="Скопировать ${e(label || name)}"><code>${e(name)}</code><span>${e(value)}</span><span aria-hidden="true">↗</span></button>`;
}

function swatch([name, title, description], e, compact = false) {
  return `<button class="fd-swatch${compact ? ' is-compact' : ''}" data-copy="${e(`${name}: ${liveToken(name)};`)}" aria-label="Скопировать цвет ${e(title)}: ${e(liveToken(name))}"><span class="fd-swatch-color" style="--swatch:var(${name})"><span>${e(liveToken(name).toUpperCase())}</span></span><span class="fd-swatch-caption"><strong>${e(title)}</strong><code>${e(name)}</code>${compact ? '' : `<span>${e(description)}</span>`}</span></button>`;
}

function sectionHeading(index, title, description, href = '', action = '') {
  return `<div class="fd-section-heading"><div><p class="fd-kicker">${index}</p><h2>${title}</h2></div>${href ? `<a class="fd-link" href="${href}">${action} <span aria-hidden="true">↗</span></a>` : `<p>${description}</p>`}</div>`;
}

function action(label, href, secondary = false) {
  return `<a class="fd-action${secondary ? ' is-secondary' : ''}" href="${href}">${label}<span aria-hidden="true">↗</span></a>`;
}

function overview(ctx) {
  const { escapeHtml: e, asset } = ctx;
  return `<section class="fd-hero">
    <div class="fd-hero-content"><p class="fd-kicker"><span class="fd-dot"></span>Квадрат · визуальный язык</p><h1>Единый характер.<br><span>В каждой детали.</span></h1><p class="fd-hero-copy">Тёплая бумага, графит и точный небесный акцент. Система компонентов, выросшая из обновлённой главной.</p>${action('Открыть компоненты', '#components')}</div>
    <div class="fd-hero-signature" aria-hidden="true"><img src="${asset('logo/kvadrat-mark.svg')}" alt=""><span>Пространство<br>для важного.</span></div>
    <div class="fd-hero-bottom"><span>Живая дизайн-система</span><a href="homepage.html">Визуальный ориентир — главная <span aria-hidden="true">↗</span></a></div>
  </section>
  <section class="fd-section" aria-labelledby="fd-principles">
    <div class="fd-section-heading"><div><p class="fd-kicker">01 / Подход</p><h2 id="fd-principles">Меньше шума.<br>Больше смысла.</h2></div><p>Иерархию создают пространство, масштаб и цвет. Каждый элемент помогает читать, выбирать и действовать.</p></div>
    <div class="fd-principles">
      <article><span class="fd-index">01</span><h3>Фон уже отделяет</h3><p>У карточки с собственным фоном нет рамки. Соседние поверхности различаются тоном и расстоянием.</p></article>
      <article><span class="fd-index">02</span><h3>Акцент ведёт к действию</h3><p>Небесный выделяет главное. Второстепенные действия спокойнее, а ссылки остаются узнаваемыми.</p></article>
      <article><span class="fd-index">03</span><h3>Одна логика на всех экранах</h3><p>Цвета, форма и состояния общие для сайта и кабинета. Плотность меняется вместе с задачей.</p></article>
    </div>
  </section>
  <section class="fd-section fd-surface-story" aria-labelledby="fd-surface-title">
    <div class="fd-surface-copy"><p class="fd-kicker">Правило поверхностей</p><h2 id="fd-surface-title">Отдельный фон.<br>Никаких рамок.</h2><p>Карточке достаточно собственного тона, внутреннего отступа и скругления. Тень появляется только там, где элемент находится над содержимым.</p><a class="fd-link" href="#foundations/shadows">Как строится глубина <span aria-hidden="true">↗</span></a></div>
    <div class="fd-surface-demo"><div class="fd-demo-caption">Пример композиции</div><article class="fd-property-mini"><div class="fd-property-mini-top"><span>Для вашего будущего</span><span aria-hidden="true">↗</span></div><h3>Место, которое<br>станет вашим.</h3><p>Поможем подобрать недвижимость<br>под ваш ритм жизни.</p>${action('Подобрать объект', '#components/Button')}</article><span class="fd-surface-annotation">Фон + пространство + форма</span></div>
  </section>
  <section class="fd-section" aria-label="Ключевая палитра">${sectionHeading('02 / Палитра', 'Природная основа.<br>Ясный акцент.', '', '#foundations/colors', 'Вся палитра')}<div class="fd-palette fd-palette-preview">${[palette[0], palette[1], palette[4], palette[6], palette[9]].map(item => swatch(item, e, true)).join('')}</div></section>
  <section class="fd-section fd-type-story" aria-labelledby="fd-type-title"><div><p class="fd-kicker">03 / Типографика</p><h2 id="fd-type-title">Характер в буквах.<br>Свобода в строках.</h2><p>Proxima Nova — одна гарнитура для крупных заголовков, спокойного текста и точных чисел.</p><a class="fd-link" href="#foundations/typography">Шкала типографики <span aria-hidden="true">↗</span></a></div><div class="fd-type-art"><span class="fd-type-art-large" aria-hidden="true">Аа</span><p>Квадрат · Proxima Nova</p><span>АБВГДЕЁЖЗИЙКЛМНОПРСТ<br>0123456789 ₽ · м²</span></div></section>
  <section class="fd-section" aria-label="Базовые правила доступности">${sectionHeading('04 / Забота в деталях', 'Удобно с первого касания.', '', '#foundations/accessibility', 'Все правила')}<div class="fd-access-strip"><article><b>44 × 44</b><h3>Комфортная цель</h3><p>Базовый размер интерактивного элемента в нашей системе, включая кнопки с иконкой.</p></article><article><b>4.5 : 1</b><h3>Читаемый текст</h3><p>Минимум для обычного текста. Светлый акцент всегда получает тёмную подпись.</p></article><article><b>⌨</b><h3>Видимый фокус</h3><p>Управление с клавиатуры, понятные подписи и обратная связь для каждого действия.</p></article></div></section>
  <div class="fd-endnote"><p>Актуальные значения живут в <code>ui-tokens.css</code>. Исторические исходники доступны отдельно в архиве.</p><a class="fd-link" href="ui-tokens.css" download>Скачать токены <span aria-hidden="true">↓</span></a></div>`;
}

function colors(ctx) {
  const { escapeHtml: e } = ctx;
  const statuses = [
    ['success', 'Успех', 'Изменения сохранены', '✓'],
    ['warning', 'Внимание', 'Проверьте указанные данные', '!'],
    ['danger', 'Ошибка', 'Введите номер телефона', '×'],
    ['info', 'Информация', 'Подборка обновляется', 'i'],
  ];
  return `<div class="fd-palette">${palette.map(item => swatch(item, e)).join('')}</div><p class="fd-note">Нажмите на образец, чтобы скопировать актуальное значение. Используйте роль цвета, а не новый оттенок для каждого компонента.</p>
  <section class="fd-section">${sectionHeading('01 / Смысловые состояния', 'Цвет поддерживает сообщение.', 'Статус обозначается текстом и символом. Одного изменения цвета недостаточно.')}<div class="fd-status-grid">${statuses.map(([key, title, message, symbol]) => `<article class="fd-status" style="--status:var(--ui-${key});--status-bg:var(--ui-${key}-surface)"><div><span aria-hidden="true">${symbol}</span><strong>${title}</strong></div><p>${message}</p><code>--ui-${key}</code></article>`).join('')}</div></section>
  <section class="fd-section">${sectionHeading('02 / Проверенные пары', 'Контраст закладывается в палитру.', 'Расчёт ниже выполняется по текущим значениям токенов. Для обычного текста — минимум 4.5 : 1.')}<div class="fd-contrast-list">${[
    ['--ui-ink', '--ui-paper', 'Основной текст'],
    ['--ui-muted', '--ui-paper', 'Вторичный текст'],
    ['--ui-ink', '--ui-surface', 'Текст карточки'],
    ['--ui-on-dark', '--ui-dark', 'Текст тёмного блока'],
    ['--ui-on-accent', '--ui-accent', 'Подпись главной кнопки'],
    ['--ui-link', '--ui-paper', 'Ссылка в тексте'],
    ['--ui-select-accent', '--ui-select-selected', 'Выбранный пункт Select'],
    ['--ui-select-accent', '--ui-select-selected-hover', 'Выбор + наведение в Select'],
  ].map(([foreground, background, label]) => `<article class="fd-contrast-row"><span class="fd-contrast-example" style="color:var(${foreground});background:var(${background})">Аа</span><div><strong>${label}</strong><code>${foreground} / ${background}</code></div><b>${contrast(liveToken(foreground), liveToken(background)).toFixed(2)} : 1</b><span class="fd-pass">AA · текст</span></article>`).join('')}</div><p class="fd-note">Небесный <code>--ui-accent</code> — цвет заливки, а не мелкого текста на белом. Для ссылки используйте <code>--ui-link</code>.</p></section>
  <section class="fd-section fd-plain-guidance"><h2>Поверхности без обводки.</h2><p>Разница фона уже создаёт границу карточки. Разделитель нужен между строками данных или частями одной группы. Фокус и сообщение об ошибке показывают состояние элемента, а не украшают его.</p><div class="fd-token-grid">${['--ui-divider', '--ui-focus', '--ui-accent-hover'].map(name => tokenButton(name, e)).join('')}</div></section>`;
}

function contrast(foreground, background) {
  const luminance = color => {
    const hex = color.replace('#', '');
    const rgb = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}

function typography(ctx) {
  const { escapeHtml: e } = ctx;
  const scale = [
    ['--ui-heading-display', 'Display', 'Для большого начала.', '400 · 1.0 · −.055em'],
    ['--ui-heading-lg', 'Заголовок страницы', 'Пространство для жизни', '400 · 1.08 · −.035em'],
    ['--ui-heading-md', 'Заголовок раздела', 'Ближе к вашему дому', '400 · 1.08 · −.035em'],
    ['--ui-heading-sm', 'Заголовок блока', 'Поможем сделать выбор', '400 · 1.15 · −.025em'],
    ['--ui-text-xl', 'Заголовок карточки', '2-комнатная квартира', '600 · 1.25'],
    ['--ui-text-lg', 'Вводный текст', 'Недвижимость под ваш ритм жизни.', '400 · 1.55'],
    ['--ui-text-base', 'Основной текст', 'Понятный следующий шаг на каждом экране.', '400 · 1.55'],
    ['--ui-text-sm', 'Подпись и интерфейс', 'Выберите город, район и тип недвижимости.', '400 / 600 · 1.5'],
    ['--ui-text-xs', 'Метаданные', 'ОБНОВЛЕНО СЕГОДНЯ · 10:30', '400 / 600 · 1.5'],
  ];
  return `<div class="fd-font-intro"><div><span class="fd-kicker">Одна гарнитура</span><h2>Proxima Nova</h2><p>Regular 400 · Semibold 600 · Bold 700</p></div><span aria-hidden="true">Аа Бб 123</span></div><div class="fd-type-scale">${scale.map(([token, label, sample, metadata], index) => `<article class="fd-type-row"><div class="fd-type-meta"><strong>${label}</strong><code>${token}</code><small>${e(liveToken(token))}<br>${metadata}</small></div><p class="fd-type-example fd-type-example-${index}" style="--type-size:var(${token})">${sample}</p><button class="fd-copy-icon" data-copy="${e(`${token}: ${liveToken(token)};`)}" aria-label="Скопировать размер: ${label}">↗</button></article>`).join('')}</div>
  <section class="fd-section"><div class="fd-two-columns"><article class="fd-text-guide"><p class="fd-kicker">Чтение</p><h2>Сначала смысл,<br>потом размер.</h2><p>Один <code>h1</code> на странице, разделы — <code>h2</code>, заголовки карточек — <code>h3</code>. Внешний размер не меняет смысловую иерархию.</p><p>Основной текст — 16 px с интерлиньяжем 1.55. Длинная строка ограничена 65 символами; короткие подписи не заменяют полноценное описание.</p></article><article class="fd-numbers"><p class="fd-kicker">Цифры и данные</p><p class="fd-price">8 450 000 ₽</p><p class="fd-price-detail">64,5 м² <span>·</span> 3 / 9 этаж</p><p class="fd-note">Неразрывные пробелы связывают число и единицу. Табличные цифры помогают сравнивать цены и строки данных.</p><code>font-variant-numeric: tabular-nums;</code></article></div></section>`;
}

function spacing(ctx) {
  const { escapeHtml: e } = ctx;
  const spaces = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
  const roles = ['Микроотступ', 'Иконка и подпись', 'Связанные элементы', 'Текст и действие', 'Внутри карточки', 'Между карточками', 'Группа элементов', 'Крупный блок', 'Мобильная секция', 'Раздел', 'Просторная секция'];
  return `<div class="fd-rhythm-hero"><span>4</span><div><p class="fd-kicker">Базовый шаг</p><h2>Ритм из четырёх пикселей.</h2><p>Близкие по смыслу элементы стоят ближе друг к другу. Воздух между группами заметнее внутренних отступов.</p></div></div><div class="fd-spacing-list">${spaces.map((number, index) => { const token = `--ui-space-${number}`; return `<button class="fd-spacing-row" data-copy="${e(`${token}: ${liveToken(token)};`)}" aria-label="Скопировать ${token}"><code>${token}</code><strong>${liveToken(token)}</strong><span class="fd-spacing-track"><span style="width:var(${token})"></span></span><span>${roles[index]}</span></button>`; }).join('')}</div>
  <section class="fd-section">${sectionHeading('01 / Форма', 'Мягкость без случайности.', 'Три радиуса для контейнеров. Капсула — для действия или компактной группы, а не для каждого блока.')}<div class="fd-shape-grid">${[
    ['--ui-radius-sm', 'Малые элементы', 'Миниатюры, уведомления и элементы внутри меню.'],
    ['--ui-radius-md', 'Карточки', 'Основные содержательные карточки и промоблоки.'],
    ['--ui-radius-lg', 'Крупные поверхности', 'Модальные окна, крупные карточки и поисковые группы.'],
    ['--ui-radius-pill', 'Действия', 'Кнопки, поля и компактные переключатели.'],
  ].map(([token, title, description]) => `<article class="fd-shape"><div style="border-radius:var(${token})">${liveToken(token)}</div><h3>${title}</h3><p>${description}</p>${tokenButton(token, e)}</article>`).join('')}</div></section>
  <section class="fd-section">${sectionHeading('02 / Плотность', 'Один язык. Разный контекст.', 'Публичному сайту нужно пространство, рабочему экрану — собранность. Минимальная цель касания сохраняется.')}<div class="fd-control-sizes">${[['--ui-control-sm', '44 px', 'Компактно', 'Панели, таблицы и кнопки с иконкой.'], ['--ui-control-md', '52 px', 'По умолчанию', 'Основные поля и кнопки интерфейса.'], ['--ui-control-lg', '58 px', 'Выразительно', 'Поиск, формы и крупные целевые действия.']].map(([token, size, title, description]) => `<article><div class="fd-control-sample" style="min-height:var(${token})">${size}<span aria-hidden="true">→</span></div><h3>${title}</h3><p>${description}</p>${tokenButton(token, e)}</article>`).join('')}</div></section>
  <section class="fd-section fd-plain-guidance"><h2>Сетка подстраивается под содержание.</h2><p>На широком экране — до четырёх колонок, затем две и одна. Содержание задаёт минимальную ширину карточки. Типографика и вертикальные интервалы масштабируются плавно; мобильная версия сохраняет порядок чтения и действий.</p><div class="fd-token-grid">${['--ui-content-width', '--ui-section-space', '--ui-text-width'].map(token => tokenButton(token, e)).join('')}</div></section>`;
}

function shadows(ctx) {
  const { escapeHtml: e } = ctx;
  return `<div class="fd-elevation-grid"><article><div class="fd-elevation-stage"><div class="fd-elevation-card"><span class="fd-kicker">Уровень 0</span><h3>На странице</h3><p>Собственный фон.<br>Без рамки и без тени.</p></div></div><h2>Спокойная основа</h2><p>Карточки, плашки, вкладки и группы действий встроены в страницу. Для отделения достаточно тона и отступов.</p>${tokenButton('--ui-shadow-none', e)}</article><article><div class="fd-elevation-stage"><div class="fd-elevation-card is-popover"><span class="fd-kicker">Уровень 1</span><h3>Поверх содержимого</h3><div class="fd-menu-example"><span>По умолчанию</span><span>Сначала новые <b>✓</b></span><span>Сначала дешевле</span></div></div></div><h2>Меню и подсказки</h2><p>Мягкая тень объясняет, что меню временно открыто над страницей. Сам контейнер остаётся без обводки.</p>${tokenButton('--ui-shadow-popover', e)}</article><article><div class="fd-elevation-stage is-overlay"><div class="fd-elevation-card is-dialog"><span class="fd-kicker">Уровень 2</span><h3>Важный момент</h3><p>Один фокус внимания.<br>Ясный способ закрыть.</p><span class="fd-demo-pill">Продолжить <span>↗</span></span></div></div><h2>Диалоги</h2><p>Затемнение отделяет фон; тень поддерживает глубину. Закрытие по Escape и возврат фокуса обязательны.</p>${tokenButton('--ui-shadow-dialog', e)}</article></div>
  <section class="fd-section"><div class="fd-two-columns"><article class="fd-text-guide"><p class="fd-kicker">Движение по делу</p><h2>Плавно.<br>Без лишней сцены.</h2><p>Переход помогает увидеть смену состояния. Кнопке достаточно изменения цвета, меню — короткого появления. У элемента есть стабильное место; движение не сдвигает соседний контент.</p></article><article class="fd-motion-panel"><div class="fd-motion-track"><span></span></div><h3>Попробуйте наведение или фокус</h3><button class="fd-motion-trigger">Изменить состояние <span aria-hidden="true">→</span></button><p>Короткая обратная связь: 140–200 ms. Появление слоя: 260 ms. При reduced motion переходы отключаются.</p></article></div><div class="fd-token-grid">${['--ui-motion-fast', '--ui-motion-base', '--ui-motion-enter', '--ui-ease'].map(token => tokenButton(token, e)).join('')}</div></section>`;
}

function accessibility(ctx) {
  const { escapeHtml: e } = ctx;
  const cards = [
    ['01', 'Размер цели', 'Наша базовая цель — 44 × 44 CSS px. WCAG 2.2 AA задаёт минимум 24 × 24 px с исключениями; в библиотеке мы выбираем более удобный размер.'],
    ['02', 'Контраст и смысл', 'Обычный текст — от 4.5 : 1; крупный текст и значимые нетекстовые элементы — от 3 : 1. Состояние всегда дублируется подписью или символом.'],
    ['03', 'Клавиатура', 'Порядок Tab совпадает с порядком чтения. Стрелки работают внутри составного элемента. Escape закрывает временный слой, фокус возвращается к его кнопке.'],
    ['04', 'Фокус', 'Контрастное кольцо показывает текущий элемент. Его не обрезает контейнер и не закрывает липкая панель. Фокусное кольцо допустимо на любой поверхности.'],
    ['05', 'Форма', 'У поля есть постоянная подпись. Ошибка расположена рядом, связана с полем и объясняет исправление. Введённые данные сохраняются.'],
    ['06', 'Обратная связь', 'Загрузка, успех, ошибка и отсутствие данных различаются. Уведомление объявляет результат без переноса фокуса. Важное действие доступно повторно.'],
    ['07', 'Масштаб и содержание', 'При ширине 320 CSS px и увеличении текста содержание остаётся доступным. Длинные названия переносятся, таблицы получают собственную область прокрутки.'],
    ['08', 'Движение', 'Учитываем prefers-reduced-motion. Автоматическое движение можно остановить. Полезная информация доступна без анимации и наведения.'],
  ];
  return `<div class="fd-access-intro"><div><p class="fd-kicker">Доступность — часть качества</p><h2>Красиво, когда<br>удобно каждому.</h2><p>Эти правила задают поведение компонентов и критерии их проверки. Визуальный образец сам по себе не подтверждает соответствие готового приложения WCAG.</p></div><div class="fd-focus-demo"><span class="fd-kicker">Попробуйте Tab</span><a class="fd-focus-target" href="#components/Button">Продолжить <span aria-hidden="true">↗</span></a><span>Фокус виден.<br>Действие понятно.</span></div></div><div class="fd-access-grid">${cards.map(([number, title, description]) => `<article><span class="fd-index">${number}</span><h3>${title}</h3><p>${description}</p></article>`).join('')}</div>
  <section class="fd-section fd-plain-guidance"><h2>Обводка состояния — осмысленный сигнал.</h2><p>У заполненной карточки нет декоративной рамки. При этом контрастное кольцо фокуса, индикатор выбора, граница поля при ошибке и разделитель строк выполняют конкретную функцию и остаются допустимыми.</p><div class="fd-token-grid">${['--ui-focus', '--ui-focus-width', '--ui-focus-offset'].map(token => tokenButton(token, e)).join('')}</div></section>
  <div class="fd-source-links"><span class="fd-kicker">Первоисточники</span><a class="fd-link" href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" target="_blank" rel="noreferrer">Размер цели · WCAG 2.2 <span aria-hidden="true">↗</span></a><a class="fd-link" href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">Контраст текста <span aria-hidden="true">↗</span></a><a class="fd-link" href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">Поведение компонентов · ARIA APG <span aria-hidden="true">↗</span></a></div>`;
}

export function renderFoundations(detail, main, ctx) {
  const selected = sections.some(([key]) => key === detail) ? detail : '';
  const titles = {
    colors: ['Цвет, у которого есть роль.', 'Нейтральные поверхности создают спокойный фон. Небесный акцент выделяет действие, а смысловые цвета объясняют состояние.'],
    typography: ['Типографика с характером.', 'Выразительные заголовки, спокойный набор и точные числа. Единая шкала для публичного сайта и рабочих экранов.'],
    spacing: ['Ритм объединяет детали.', 'Пространство показывает связи. Предсказуемые отступы и форма собирают разные компоненты в один интерфейс.'],
    shadows: ['Глубина по смыслу.', 'Плоская страница, временные слои и один фокус внимания. Тень помогает понять устройство интерфейса.'],
    accessibility: ['Забота в каждом состоянии.', 'Интерфейс понятен при касании, работе с клавиатурой, увеличении текста и использовании вспомогательных технологий.'],
  };
  const renderers = { colors, typography, spacing, shadows, accessibility };
  main.innerHTML = `<div class="fd-foundations"><nav class="fd-nav" aria-label="Основы дизайн-системы">${sections.map(([key, title]) => `<a href="#foundations${key ? `/${key}` : ''}"${selected === key ? ' aria-current="page"' : ''}>${title}</a>`).join('')}</nav>${selected ? `<header class="fd-page-heading"><p class="fd-kicker">Квадрат / Основы</p><h1>${titles[selected][0]}</h1><p>${titles[selected][1]}</p></header>${renderers[selected](ctx)}` : overview(ctx)}</div>`;
}
