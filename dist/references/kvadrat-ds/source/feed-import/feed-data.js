/* Квадрат — движок маппинга фида. Единый парсер для live-превью и импорта.
   Чистая бизнес-логика: реестр наших полей, образец CIAN, каталог трансформов,
   стартовый пресет и сам движок. Загружается как обычный скрипт → window.KvFeedData. */
(function () {
  "use strict";

  /* ============ 1. Реестр наших полей (LISTINGS §2 колонки + §3 attributes) ============ */
  var tree = [
    { key: "g_common", group: "Основные поля", note: "Общие для всех типов — колонки таблицы listings.", fields: [
      { key: "external_id", label: "external_id", type: "string", required: true, store: "col", hint: "Внешний ID объекта в источнике. Драйвер идемпотентного upsert — без него импорт плодит дубли." },
      { key: "deal_type", label: "deal_type", type: "enum", required: true, store: "col", enumv: ["sale", "rent_long", "rent_daily"], hint: "Тип сделки. У Cian закодирован в теге Category вместе с типом объекта." },
      { key: "property_type", label: "property_type", type: "enum", required: true, store: "col", enumv: ["flat", "room", "house", "townhouse", "land", "office", "retail", "warehouse", "garage"], hint: "Тип объекта (17 листов). Тоже вынимается из Category." },
      { key: "price", label: "price", type: "number", required: true, store: "col", hint: "Цена как введена. Нормализация в price_normalized — на стороне БД." },
      { key: "currency", label: "currency", type: "enum", store: "col", enumv: ["RUB", "USD", "KZT"], hint: "Код валюты объявления." },
      { key: "title", label: "title", type: "string", store: "col", hint: "Заголовок → полнотекстовый поиск (вес A)." },
      { key: "description", label: "description", type: "string", store: "col", hint: "Описание → полнотекстовый поиск (вес B). Часто приходит с HTML." },
      { key: "address", label: "address", type: "string", store: "col", hint: "Адрес свободным текстом. Может собираться из нескольких полей фида." },
      { key: "coords", label: "coords", type: "geo", store: "col", hint: "geography(Point,4326). Координаты напрямую из фида либо геокодирование адреса." },
      { key: "city_id", label: "city_id", type: "ref", store: "col", hint: "FK → cities. Сопоставление по названию города через словарь." },
      { key: "photos", label: "photos[]", type: "collection", store: "media", hint: "Коллекция URL фото → скачивание в S3 → job миниатюр." }
    ] },
    { key: "g_flat", group: "Квартира / комната", badge: "G-flat", note: "Группа полей flat, room. Часть — колонки, хвост — attributes jsonb.", fields: [
      { key: "rooms", label: "rooms", type: "number", store: "col", hint: "Комнатность 1/2/3/4+. У Cian FlatRoomsCount: 9 = студия, 7 = свободная планировка." },
      { key: "is_studio", label: "is_studio", type: "bool", store: "col", hint: "Студия. У Cian выводится из FlatRoomsCount = 9." },
      { key: "is_new_building", label: "is_new_building", type: "bool", store: "col", hint: "Вторичка / новостройка." },
      { key: "area", label: "area", type: "number", store: "col", hint: "Общая площадь, м²." },
      { key: "floor", label: "floor", type: "number", store: "col" },
      { key: "floors_count", label: "floors_count", type: "number", store: "col" },
      { key: "room_type", label: "room_type", type: "enum", store: "jsonb", enumv: ["combined", "separate", "both"] },
      { key: "living_area", label: "living_area", type: "number", store: "jsonb", hint: "Жилая площадь. В фиде часто с десятичной запятой." },
      { key: "kitchen_area", label: "kitchen_area", type: "number", store: "jsonb" },
      { key: "repair_type", label: "repair_type", type: "enum", store: "jsonb", enumv: ["cosmetic", "design", "euro", "no"] },
      { key: "windows_view", label: "windows_view", type: "enum", store: "jsonb", enumv: ["street", "yard", "yardAndStreet"] },
      { key: "is_apartments", label: "is_apartments", type: "bool", store: "jsonb", hint: "Юридически апартаменты." },
      { key: "ceiling_height", label: "ceiling_height", type: "number", store: "jsonb" },
      { key: "material_type", label: "building.material_type", type: "enum", store: "jsonb", enumv: ["brick", "monolith", "panel", "block", "wood"] },
      { key: "build_year", label: "building.build_year", type: "number", store: "jsonb" }
    ] },
    { key: "g_rent", group: "Аренда — overlay", badge: "deal:rent", note: "Накладывается поверх любой группы для rent_long / rent_daily.", fields: [
      { key: "deposit", label: "deposit", type: "number", store: "jsonb" },
      { key: "pets_allowed", label: "pets_allowed", type: "bool", store: "jsonb" },
      { key: "children_allowed", label: "children_allowed", type: "bool", store: "jsonb" },
      { key: "utilities_included", label: "utilities_included", type: "bool", store: "jsonb" }
    ] },
    { key: "g_house", group: "Дом / участок", badge: "G-house · G-land", note: "house, townhouse, land. Показаны ключевые поля.", collapsed: true, fields: [
      { key: "material_types", label: "material_types[]", type: "collection", store: "jsonb", hint: "Мультивыбор материалов стен." },
      { key: "land_area", label: "land_area", type: "number", store: "col", hint: "Площадь участка, каноническая единица — м² (сотки/га → множитель)." },
      { key: "heating_type", label: "heating_type", type: "enum", store: "jsonb", enumv: ["autonomousGas", "electric", "stove", "no"] },
      { key: "permitted_use", label: "land.permitted_use", type: "enum", store: "jsonb", enumv: ["individualHousingConstruction", "gardening", "farm"] }
    ] },
    { key: "g_comm", group: "Коммерция", badge: "G-commercial", note: "office, retail, warehouse и др. Показаны ключевые поля.", collapsed: true, fields: [
      { key: "class_type", label: "class_type", type: "enum", store: "jsonb", enumv: ["a", "aPlus", "b", "bPlus", "bMinus", "c"] },
      { key: "layout", label: "layout", type: "enum", store: "jsonb", enumv: ["cabinet", "openSpace", "corridorPlan", "mixed"] },
      { key: "purpose_types", label: "purpose_types[]", type: "collection", store: "jsonb", hint: "Назначение помещения — свободный список." }
    ] }
  ];

  /* ============ 2. Образец фида — параллельно нескольким записям (плоские пути) ============ */
  var samples = [
    { _id: "CN-882145", _label: "flatSale · 3-комн.", data: {
      "Category": "flatSale", "ExternalId": " CN-882145 ",
      "Address": "", "City": "Москва", "Street": "ул. Льва Толстого", "House": "16",
      "BargainTerms.Price": "14 500 000", "BargainTerms.Currency": "rur",
      "FlatRoomsCount": "3", "TotalArea": "86.4", "LivingArea": "52,1", "KitchenArea": "12,3",
      "FloorNumber": "6", "Building.FloorsCount": "10", "Building.MaterialType": "monolith",
      "Building.BuildYear": "2019", "RepairType": "euro", "WindowsViewType": "yardAndStreet",
      "IsApartments": "no", "CeilingHeight": "3.1",
      "Coordinates.Lat": "55.7340", "Coordinates.Lng": "37.5870",
      "Photos": "photos/882145-1.jpg;photos/882145-2.jpg;photos/882145-2.jpg; ",
      "Title": "  Продаётся 3-комнатная квартира в Хамовниках  ",
      "Description": "<p>Просторная квартира с <b>дизайнерским</b> ремонтом &amp; панорамными окнами.</p>",
      "Phones.Phone.Number": "+7 495 777-33-50", "Apartment": "144", "HasInternet": "yes", "HasFurniture": "1", "CadastralNumber": "77:01:0006012:1234"
    } },
    { _id: "CN-901233", _label: "flatRent · 2-комн.", data: {
      "Category": "flatRent", "ExternalId": "CN-901233",
      "Address": "", "City": "Москва", "Street": "Пресненская наб.", "House": "12",
      "BargainTerms.Price": "85 000", "BargainTerms.Currency": "rur",
      "FlatRoomsCount": "2", "TotalArea": "54", "LivingArea": "31,5", "KitchenArea": "10",
      "FloorNumber": "3", "Building.FloorsCount": "17", "Building.MaterialType": "monolith",
      "Building.BuildYear": "2021", "RepairType": "renovated", "WindowsViewType": "yard",
      "IsApartments": "1", "CeilingHeight": "2.8",
      "Coordinates.Lat": "55.7500", "Coordinates.Lng": "37.5390",
      "Photos": "photos/901233-1.jpg;photos/901233-2.jpg",
      "Title": "Аренда 2-комнатной квартиры, Москва-Сити",
      "Description": "<p>Видовая квартира, <i>меблирована</i>, заезд сразу.</p>",
      "Phones.Phone.Number": "+7 495 777-33-50", "Apartment": "212", "PetsAllowed": "no", "ChildrenAllowed": "yes", "HasFurniture": "yes", "Deposit": "85 000"
    } },
    { _id: "CN-777881", _label: "flatSale · студия", data: {
      "Category": "flatSale", "ExternalId": "CN-777881",
      "Address": "", "City": "Сочи", "Street": "ул. Курортный проспект", "House": "75к1",
      "BargainTerms.Price": "9 900 000", "BargainTerms.Currency": "rur",
      "FlatRoomsCount": "9", "TotalArea": "28", "LivingArea": "24", "KitchenArea": "",
      "FloorNumber": "12", "Building.FloorsCount": "16", "Building.MaterialType": "brick",
      "Building.BuildYear": "2023", "RepairType": "euro", "WindowsViewType": "street",
      "IsApartments": "no", "CeilingHeight": "3.0",
      "Coordinates.Lat": "43.5855", "Coordinates.Lng": "39.7231",
      "Photos": "photos/777881-1.jpg",
      "Title": "Студия у моря, вид на горы",
      "Description": "<p>Апартаменты-студия, 200 м до пляжа.</p>",
      "Phones.Phone.Number": "+7 495 777-33-50", "Apartment": "1204", "HasInternet": "yes", "CadastralNumber": "23:49:0201005:5678"
    } }
  ];

  /* ============ 3. Каталог трансформов (optgroup-структура как у Drupal Tamper) ============ */
  // editor: none | generic | dictionary | boolean | math | expression | template
  var catalog = [
    { group: "Тип / логика", items: [
      { type: "to_boolean", name: "В логическое", desc: "yes/no · 1/0 · да/нет → true/false", editor: "boolean", defaults: { truthy: "yes, 1, true, да", falsy: "no, 0, false, нет", fallback: "error" } },
      { type: "dictionary", name: "Словарь значений", desc: "Таблица «значение фида → наше значение» + fallback", editor: "dictionary", defaults: { rows: [], fallback: "", ci: true } },
      { type: "to_int", name: "Привести к целому", desc: "Отбросить всё, кроме цифр, → целое число", editor: "none" },
      { type: "default_value", name: "Значение по умолчанию", desc: "Подставить, если значение пустое", editor: "generic", defaults: { value: "" }, spec: [{ key: "value", label: "Значение по умолчанию", ctl: "text" }] }
    ] },
    { group: "Число", items: [
      { type: "number_clean", name: "Очистить и разобрать число", desc: "Убрать «руб», «м²», пробелы; выбрать десятичный разделитель", editor: "generic", defaults: { decimal: "auto" }, spec: [{ key: "decimal", label: "Десятичный разделитель", ctl: "select", options: ["auto", "comma", "dot"] }] },
      { type: "number_format", name: "Округление / формат", desc: "Округлить до N знаков", editor: "generic", defaults: { round: "round", decimals: 0 }, spec: [{ key: "round", label: "Округление", ctl: "select", options: ["round", "floor", "ceil"] }, { key: "decimals", label: "Знаков после запятой", ctl: "number" }] },
      { type: "math", name: "Математическое выражение", desc: "value · множители · единицы (га → м²)", editor: "math", defaults: { expr: "value" } }
    ] },
    { group: "Текст", items: [
      { type: "trim", name: "Обрезать пробелы", desc: "Убрать пробелы по краям", editor: "none" },
      { type: "convert_case", name: "Изменить регистр", desc: "нижний / ВЕРХНИЙ / С Заглавной", editor: "generic", defaults: { mode: "lower" }, spec: [{ key: "mode", label: "Регистр", ctl: "select", options: ["lower", "upper", "ucfirst", "title"] }] },
      { type: "find_replace", name: "Найти и заменить", desc: "Простая замена подстроки", editor: "generic", defaults: { search: "", replace: "", ci: false }, spec: [{ key: "search", label: "Найти", ctl: "text" }, { key: "replace", label: "Заменить на", ctl: "text" }, { key: "ci", label: "Без учёта регистра", ctl: "check" }] },
      { type: "regex", name: "Найти и заменить (regex)", desc: "Регулярное выражение", editor: "generic", defaults: { pattern: "", replace: "", flags: "g" }, spec: [{ key: "pattern", label: "Шаблон", ctl: "text", ph: "\\s+" }, { key: "replace", label: "Заменить на", ctl: "text", ph: "$1" }, { key: "flags", label: "Флаги", ctl: "text", ph: "g" }] },
      { type: "truncate", name: "Усечь текст", desc: "Обрезать до N символов с многоточием", editor: "generic", defaults: { limit: 120, ellipsis: "…" }, spec: [{ key: "limit", label: "Максимум символов", ctl: "number" }, { key: "ellipsis", label: "Окончание", ctl: "text" }] },
      { type: "template", name: "Шаблон / склейка", desc: "Собрать строку из нескольких полей фида", editor: "template", defaults: { template: "{{ value }}" } }
    ] },
    { group: "HTML", items: [
      { type: "strip_tags", name: "Убрать HTML-теги", desc: "Оставить только текст", editor: "none" },
      { type: "html_decode", name: "Декодировать HTML-сущности", desc: "&amp; → & , &lt; → <", editor: "none" },
      { type: "absolute_url", name: "Сделать URL абсолютными", desc: "Дописать базовый домен к относительным ссылкам", editor: "generic", defaults: { base: "" }, spec: [{ key: "base", label: "Базовый URL", ctl: "text", ph: "https://cdn.example.com" }] }
    ] },
    { group: "Дата / время", items: [
      { type: "strtotime", name: "Строка → Unix-время", desc: "Распознать дату и вернуть timestamp", editor: "none" },
      { type: "date_format", name: "Дата → ISO 8601", desc: "Нормализовать к YYYY-MM-DD", editor: "none" }
    ] },
    { group: "Список / коллекция", items: [
      { type: "explode", name: "Разбить по разделителю", desc: "Строка → список элементов", editor: "generic", defaults: { delimiter: ";" }, spec: [{ key: "delimiter", label: "Разделитель", ctl: "text", ph: ";" }] },
      { type: "array_filter", name: "Убрать пустые", desc: "Отбросить пустые элементы списка", editor: "none" },
      { type: "unique", name: "Только уникальные", desc: "Дедупликация элементов", editor: "none" },
      { type: "limit", name: "Ограничить количество", desc: "Оставить первые N элементов", editor: "generic", defaults: { max: 30 }, spec: [{ key: "max", label: "Максимум элементов", ctl: "number" }] },
      { type: "implode", name: "Собрать в строку", desc: "Список → строка через соединитель", editor: "generic", defaults: { glue: ", " }, spec: [{ key: "glue", label: "Соединитель", ctl: "text", ph: ", " }] }
    ] },
    { group: "Продвинутое", items: [
      { type: "expression", name: "Своя функция", desc: "Произвольное выражение JS: value, src('Путь'), Math, helpers", editor: "expression", defaults: { code: "value" } },
      { type: "geocode", name: "Геокодировать адрес", desc: "Адрес → координаты (при импорте)", editor: "none" }
    ] },
    { group: "Фильтр", items: [
      { type: "required", name: "Обязательное", desc: "Пустое значение → запись пропускается", editor: "none" },
      { type: "keyword_filter", name: "Фильтр по ключевым словам", desc: "Пропустить запись, если нет ни одного слова", editor: "generic", defaults: { keywords: "" }, spec: [{ key: "keywords", label: "Ключевые слова (через запятую)", ctl: "text" }] }
    ] }
  ];

  var byType = {};
  catalog.forEach(function (g) { g.items.forEach(function (it) { byType[it.type] = it; }); });

  /* ============ 4. Стартовый пресет CIAN (автомаппинг — оператор корректирует) ============ */
  function step(type, params) { return { id: type + "_" + (Math.random().toString(36).slice(2, 7)), type: type, enabled: true, params: Object.assign({}, (byType[type] || {}).defaults, params || {}) }; }
  function map(mode, source, steps) { return { mode: mode, source: source || "", const: "", steps: steps || [] }; }

  var preset = {
    external_id: map("feed", "ExternalId", [step("trim"), step("required")]),
    deal_type: map("feed", "Category", [step("dictionary", { rows: [
      { from: "flatSale", to: "sale" }, { from: "newBuildingFlatSale", to: "sale" }, { from: "flatShareSale", to: "sale" },
      { from: "flatRent", to: "rent_long" }, { from: "dailyFlatRent", to: "rent_daily" }
    ], fallback: "" })]),
    property_type: map("feed", "Category", [step("dictionary", { rows: [
      { from: "flatSale", to: "flat" }, { from: "flatRent", to: "flat" }, { from: "dailyFlatRent", to: "flat" },
      { from: "newBuildingFlatSale", to: "flat" }, { from: "flatShareSale", to: "flat" }
    ], fallback: "" })]),
    price: map("feed", "BargainTerms.Price", [step("number_clean", { decimal: "dot" })]),
    currency: map("feed", "BargainTerms.Currency", [step("dictionary", { rows: [{ from: "rur", to: "RUB" }, { from: "usd", to: "USD" }, { from: "kzt", to: "KZT" }], fallback: "RUB" })]),
    title: map("feed", "Title", [step("trim")]),
    description: map("feed", "Description", [step("strip_tags"), step("html_decode"), step("trim")]),
    address: map("feed", "", [step("template", { template: "{{ field:City }}, {{ field:Street }}, {{ field:House }}" })]),
    photos: map("feed", "Photos", [step("explode", { delimiter: ";" }), step("array_filter"), step("unique"), step("limit", { max: 30 })]),
    rooms: map("feed", "FlatRoomsCount", [step("to_int")]),
    is_studio: map("feed", "FlatRoomsCount", [step("expression", { code: "num(value) === 9" })]),
    area: map("feed", "TotalArea", [step("number_clean", { decimal: "auto" })]),
    living_area: map("feed", "LivingArea", [step("number_clean", { decimal: "comma" })]),
    kitchen_area: map("feed", "KitchenArea", [step("number_clean", { decimal: "comma" })]),
    floor: map("feed", "FloorNumber", [step("to_int")]),
    floors_count: map("feed", "Building.FloorsCount", [step("to_int")]),
    material_type: map("feed", "Building.MaterialType", []),
    build_year: map("feed", "Building.BuildYear", [step("to_int")]),
    repair_type: map("feed", "RepairType", [step("dictionary", { rows: [
      { from: "cosmetic", to: "cosmetic" }, { from: "design", to: "design" }, { from: "euro", to: "euro" }, { from: "no", to: "no" }
    ], fallback: "" })]),
    windows_view: map("feed", "WindowsViewType", []),
    is_apartments: map("feed", "IsApartments", [step("to_boolean")]),
    ceiling_height: map("feed", "CeilingHeight", [step("number_clean", { decimal: "dot" })]),
    coords: map("feed", "Coordinates.Lat", [step("expression", { code: "num(value) + ',' + num(src('Coordinates.Lng'))" })])
    // остальные поля — не замаплены (mode implicit empty), демонстрируют статус «пусто»
  };

  /* ============ 5. Движок парсинга ============ */
  var CASE = {
    lower: function (s) { return s.toLowerCase(); },
    upper: function (s) { return s.toUpperCase(); },
    ucfirst: function (s) { return s.charAt(0).toUpperCase() + s.slice(1); },
    title: function (s) { return s.replace(/\S+/g, function (w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }); }
  };
  function escapeReg(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function toNum(v) { var n = parseFloat(String(v == null ? "" : v).replace(/[^\d.,\-]/g, "").replace(",", ".")); return isNaN(n) ? 0 : n; }

  function evalExpr(code, value, record) {
    var src = function (path) { return record ? record[path] : undefined; };
    var body = /\breturn\b/.test(code) ? code : "return (" + code + ");";
    try {
      var fn = new Function("value", "src", "record", "Math", "round", "floor", "ceil", "abs", "min", "max", "num", "len", body);
      return fn(value, src, record, Math, Math.round, Math.floor, Math.ceil, Math.abs, Math.min, Math.max, toNum, function (v) { return v == null ? 0 : ("" + v).length; });
    } catch (e) { throw new Error("выражение: " + e.message); }
  }
  function renderTemplate(tpl, value, record) {
    return String(tpl).replace(/\{\{\s*([^}]+?)\s*\}\}/g, function (m, expr) {
      expr = expr.trim();
      if (expr === "value") return value == null ? "" : String(value);
      var fm = expr.match(/^field:(.+)$/);
      if (fm) { var v = record ? record[fm[1].trim()] : ""; return v == null ? "" : String(v); }
      return "";
    });
  }

  function applyStep(value, s, record) {
    var p = s.params || {}, i;
    switch (s.type) {
      case "trim": return typeof value === "string" ? value.trim() : value;
      case "convert_case": return typeof value === "string" ? (CASE[p.mode || "lower"])(value) : value;
      case "strip_tags": return typeof value === "string" ? value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : value;
      case "html_decode": return typeof value === "string" ? value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ") : value;
      case "find_replace":
        if (typeof value !== "string") return value;
        if (p.ci) return value.replace(new RegExp(escapeReg(p.search || ""), "gi"), p.replace || "");
        return (p.search || "") === "" ? value : value.split(p.search).join(p.replace || "");
      case "regex":
        if (typeof value !== "string") return value;
        try { return value.replace(new RegExp(p.pattern || "", p.flags || "g"), p.replace || ""); }
        catch (e) { throw new Error("regex: " + e.message); }
      case "truncate":
        if (typeof value !== "string") return value;
        var n = +p.limit || 120; return value.length > n ? value.slice(0, n) + (p.ellipsis || "…") : value;
      case "default_value":
        var empty = value == null || value === "" || (Array.isArray(value) && !value.length);
        return empty ? (p.value == null ? "" : p.value) : value;
      case "to_int":
        var iv = parseInt(String(value == null ? "" : value).replace(/[^0-9\-]/g, ""), 10);
        if (isNaN(iv)) throw new Error("не удалось привести к числу");
        return iv;
      case "number_clean":
        if (value == null || value === "") throw new Error("пустое значение");
        var t = String(value).replace(/[^\d.,\-\s]/g, "").trim();
        if ((p.decimal || "auto") === "comma") t = t.replace(/\s/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
        else if (p.decimal === "dot") t = t.replace(/\s/g, "").replace(/,/g, "");
        else { t = t.replace(/\s/g, ""); if (t.indexOf(",") > -1 && t.indexOf(".") === -1) t = t.replace(",", "."); else t = t.replace(/,/g, ""); }
        var fn = parseFloat(t); if (isNaN(fn)) throw new Error("не удалось разобрать число");
        return fn;
      case "number_format":
        var nf = typeof value === "number" ? value : parseFloat(value);
        if (isNaN(nf)) throw new Error("не число");
        var d = p.decimals == null ? 0 : +p.decimals, k = Math.pow(10, d);
        var rf = p.round === "floor" ? Math.floor : p.round === "ceil" ? Math.ceil : Math.round;
        return rf(nf * k) / k;
      case "math": return evalExpr(p.expr || "value", value, record);
      case "expression": return evalExpr(p.code || "value", value, record);
      case "template": return renderTemplate(p.template || "", value, record);
      case "to_boolean":
        var tt = String(p.truthy || "").split(",").map(function (x) { return x.trim().toLowerCase(); });
        var ff = String(p.falsy || "").split(",").map(function (x) { return x.trim().toLowerCase(); });
        var sv = String(value == null ? "" : value).trim().toLowerCase();
        if (tt.indexOf(sv) > -1) return true;
        if (ff.indexOf(sv) > -1) return false;
        if (p.fallback === "true") return true;
        if (p.fallback === "false") return false;
        throw new Error("неизвестный токен «" + value + "»");
      case "dictionary":
        var dv = String(value == null ? "" : value), ci = p.ci !== false, rows = p.rows || [];
        for (i = 0; i < rows.length; i++) { var r = rows[i]; if (ci ? String(r.from).toLowerCase() === dv.toLowerCase() : String(r.from) === dv) return r.to; }
        if (p.fallback != null && p.fallback !== "") return p.fallback;
        throw new Error("нет в словаре: «" + dv + "»");
      case "explode": return String(value == null ? "" : value).split(p.delimiter || ";").map(function (x) { return x.trim(); });
      case "implode": return Array.isArray(value) ? value.join(p.glue == null ? ", " : p.glue) : value;
      case "unique": return Array.isArray(value) ? value.filter(function (v, ix, a) { return a.indexOf(v) === ix; }) : value;
      case "array_filter": return Array.isArray(value) ? value.filter(function (v) { return v != null && v !== ""; }) : value;
      case "limit": return Array.isArray(value) ? value.slice(0, +p.max || 10) : value;
      case "strtotime": var ts = Date.parse(value); if (isNaN(ts)) throw new Error("не дата"); return Math.floor(ts / 1000);
      case "date_format": var td = Date.parse(value); if (isNaN(td)) throw new Error("не дата"); return new Date(td).toISOString().slice(0, 10);
      case "absolute_url":
        var base = (p.base || "").replace(/\/$/, "");
        if (Array.isArray(value)) return value.map(function (u) { return /^https?:\/\//.test(u) || !base ? u : base + "/" + String(u).replace(/^\//, ""); });
        return /^https?:\/\//.test(value) || !base ? value : base + "/" + String(value).replace(/^\//, "");
      case "geocode": return value;
      case "required": if (value == null || value === "" || (Array.isArray(value) && !value.length)) throw new Error("пусто — запись будет пропущена"); return value;
      case "keyword_filter": return value;
      default: return value;
    }
  }

  function runPipeline(field, m, record) {
    var stages = [], value, i;
    if (!m || m.mode === "empty" || (m.mode === "feed" && !m.source && !(m.steps || []).some(function (s) { return s.type === "template" || s.type === "expression"; }))) {
      return { stages: [{ label: "не задано", value: null, empty: true }], final: null, empty: true, ok: !field.required, error: field.required ? "обязательное поле не заполнено" : null };
    }
    var raw = m.mode === "const" ? m.const : (record ? record[m.source] : undefined);
    stages.push({ label: "Источник", sub: m.mode === "const" ? "константа" : (m.source || "выражение"), value: raw, source: true });
    value = raw;
    var steps = (m.steps || []).filter(function (s) { return s.enabled !== false; });
    var error = null;
    for (i = 0; i < steps.length; i++) {
      try { value = applyStep(value, steps[i], record); stages.push({ id: steps[i].id, value: value }); }
      catch (e) { error = e.message; stages.push({ id: steps[i].id, value: value, error: e.message }); break; }
    }
    var ok = !error, warn = null;
    if (!error) {
      if (field.type === "enum" && field.enumv && field.enumv.indexOf(value) < 0) warn = "значение вне enum: «" + value + "»";
      if (field.type === "number" && (typeof value !== "number" || !isFinite(value))) { ok = false; error = "ожидалось число"; }
      if (field.type === "bool" && typeof value !== "boolean") warn = "ожидалось true / false";
      if (field.required && (value == null || value === "")) { ok = false; error = "обязательное поле пусто"; }
    }
    return { stages: stages, final: value, ok: ok, error: error, warn: warn };
  }

  // Собрать неизвестные значения enum по всем записям образца (для «захвата» в словарь)
  function unknownForDict(source, dictStep, records) {
    var known = {}, seen = {}, out = [];
    (dictStep.params.rows || []).forEach(function (r) { known[String(r.from).toLowerCase()] = 1; });
    records.forEach(function (rec) {
      var v = rec.data[source]; if (v == null || v === "") return;
      var key = String(v).toLowerCase();
      if (!known[key] && !seen[key]) { seen[key] = 1; out.push(String(v)); }
    });
    return out;
  }

  window.KvFeedData = {
    tree: tree, samples: samples, catalog: catalog, byType: byType, preset: preset,
    engine: { applyStep: applyStep, runPipeline: runPipeline, evalExpr: evalExpr, renderTemplate: renderTemplate, unknownForDict: unknownForDict },
    newStep: step
  };
})();
