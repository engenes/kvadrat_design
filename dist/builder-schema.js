// Block names, default widths and minimum widths follow PageBuilder.dc.html.
const text=(key,label,value,multiline=false)=>({key,label,value,type:multiline?'textarea':'text'});
const number=(key,label,value,max=12)=>({key,label,value,type:'number',min:1,max});
const toggle=(key,label,value)=>({key,label,value,type:'checkbox'});
const select=(key,label,value,options)=>({key,label,value,type:'select',options});
export const images=['hero-building-1.jpg','hero-building-2.png','city-aerial-2.png','apartment-interior-1.jpg','listing-thumb-1.png','newbuild-3.png','newbuild-4.png','newbuild-5.png','city-street-1.png'];
const alignment=()=>select('align','Выравнивание','Слева',['Слева','По центру']);
const imageSelect=()=>select('image','Изображение',images[0],images);
export const registry={
 hero_slider:{name:'Слайдер',category:'Медиа',icon:'▣',width:12,min:12,shrink:'Нет',fields:[text('title','Заголовок','Ваш личный агент\nпо недвижимости',true),text('eyebrow','Надзаголовок','Агентство недвижимости'),number('count','Слайдов',3,6),toggle('auto','Автопрокрутка',true),select('height','Высота','480',['320','480','640']),select('indicators','Индикаторы','Точки',['Точки','Полоски']),imageSelect()]},
 photo_gallery:{name:'Фотогалерея',category:'Медиа',icon:'▦',width:12,min:6,shrink:'Да',fields:[number('columns','Колонок',3,4),number('count','Фотографий',5,9),select('gap','Отступ между фото','Средний',['Нет','Малый','Средний','Большой']),toggle('lightbox','Лайтбокс',true),toggle('captions','Подписи',false)]},
 carousel:{name:'Карусель',category:'Медиа',icon:'▥',width:12,min:6,shrink:'Частично',fields:[select('kind','Тип карточки','Объекты',['Объекты','Услуги']),number('columns','Карточек в кадре',3,4),toggle('auto','Автопрокрутка',false)]},
 property_grid:{name:'Объекты недвижимости',category:'Недвижимость',icon:'⌂',width:12,min:6,shrink:'Да',fields:[select('source','Источник','Фильтр',['Ручной','Фильтр']),select('filter','Фильтр объектов','Все',['Все','До 10 млн ₽','От 10 млн ₽']),text('manual','Номера объектов через запятую','1, 2, 3, 4'),number('count','Объектов',4,8),select('view','Вид карточки','Стандарт',['Стандарт','Компактный']),select('sort','Сортировка','Сначала новые',['Сначала новые','Сначала дешевле','Сначала дороже'])]},
 single_property:{name:'Объект (карточка)',category:'Недвижимость',icon:'▤',width:4,min:3,shrink:'Да',fields:[select('property','Объект','1',['1','2','3','4']),select('view','Вид','Полный',['Компактный','Полный']),toggle('button','Кнопка «Подробнее»',true)]},
 heading:{name:'Заголовок',category:'Контент',icon:'H',width:12,min:4,shrink:'Да',fields:[text('title','Заголовок','Почему нам доверяют'),text('eyebrow','Надзаголовок','Агентство недвижимости'),select('size','Размер','32',['24','32','40','48']),select('align','Выравнивание','По центру',['Слева','По центру']),toggle('line','Подчёркивающая черта',true)]},
 text:{name:'Текстовый блок',category:'Контент',icon:'☰',width:8,min:4,shrink:'Да',fields:[text('eyebrow','Надзаголовок','О компании'),text('title','Заголовок','Сопровождение сделки под ключ'),text('body','Содержимое','«Квадрат» — агентство недвижимости полного цикла. С 2014 года помогаем купить, продать и снять жильё: подбор объекта, проверка юридической чистоты, ипотечный брокеридж и регистрация сделки.\n\nЗа каждым клиентом закреплён личный агент — он ведёт вас от первого звонка до получения ключей и остаётся на связи после сделки.',true),alignment(),select('columns','Колонки текста','1',['1','2'])]},
 cards:{name:'Карточки',category:'Контент',icon:'▥',width:12,min:6,shrink:'Да',fields:[number('count','Карточек',3,6),select('media','Медиа','Иконка',['Иконка','Фото']),toggle('link','Ссылка на карточке',true),text('titles','Заголовки · по одному в строке','Покупка недвижимости\nПродажа недвижимости\nЮридическая поддержка',true)]},
 advantages:{name:'Преимущества',category:'Контент',icon:'✧',width:12,min:6,shrink:'Да',fields:[number('columns','Колонок',4,4),select('style','Стиль','Цифры',['Цифры','Иконки']),text('items','Значение | подпись · по одному в строке','12 | лет на рынке\n5 200 | сделок закрыто\n8,4% | ставка по ипотеке\n24/7 | на связи',true)]},
 accordion:{name:'Аккордеон',category:'Контент',icon:'≡',width:8,min:6,shrink:'Да',fields:[number('count','Пунктов',3,8),toggle('first','Первый раскрыт',true),select('mode','Режим','Один',['Один','Несколько']),text('items','Вопрос | ответ · по одному в строке','Как проходит первая встреча? | Знакомимся, обсуждаем пожелания и составляем план поиска.\nПоможете с ипотекой? | Подберём подходящую программу и поможем подготовить документы.\nКто проверяет документы? | Юрист сопровождает каждый этап сделки.',true)]},
 lead_form:{name:'Форма заявки',category:'Действие',icon:'▤',width:6,min:4,shrink:'Да',fields:[text('title','Заголовок','Оставить заявку'),text('subtitle','Подпись','Перезвоним в течение 15 минут'),select('fields','Поля','Имя, телефон',['Имя, телефон','Имя, email','Имя, телефон, комментарий']),toggle('consent','Согласие на обработку данных',true)]},
 cta_banner:{name:'CTA-баннер',category:'Действие',icon:'↗',width:12,min:12,shrink:'Нет',fields:[text('title','Заголовок','Найдём объект по вашим пожеланиям'),text('body','Подпись','Оставьте заявку — подберём варианты в день обращения'),select('background','Фон баннера','Фото',['Цвет','Фото']),text('button','Текст кнопки','Заказать консультацию')]}
};
export const sharedFields=[select('padding','Вертикальный отступ','M',['S','M','L','XL']),select('backgroundColor','Фон секции','Белый',['Белый','Светлый','Тёмный'])];
export const fieldsFor=kind=>[...registry[kind].fields,...sharedFields];
export const defaults=kind=>Object.fromEntries(fieldsFor(kind).map(f=>[f.key,f.value]));
export const properties=[
 {id:'1',title:'ЖК «Ривер»',price:8400000,info:'2-комн · 64 м² · 6/12 этаж',image:'listing-thumb-1.png'},
 {id:'2',title:'Москва, ЦАО',price:12900000,info:'3-комн · 86 м² · 4/10 этаж',image:'newbuild-3.png'},
 {id:'3',title:'ЖК «Парк»',price:6200000,info:'1-комн · 38 м² · 9/16 этаж',image:'newbuild-4.png'},
 {id:'4',title:'Москва, ЗАО',price:18500000,info:'4-комн · 112 м² · 7/9 этаж',image:'newbuild-5.png'}
];
