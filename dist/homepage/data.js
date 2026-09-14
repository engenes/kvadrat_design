import {photo} from './ui.js';
export const properties=[
 {id:'testovaya',rooms:1,address:'ул. Тестовая, 34',area:36,floor:'2/10',delivery:'Сдан',price:2650000,image:photo('a9ab1ca827388d01.png')},
 {id:'revolutsionnaya',rooms:3,address:'ул. Револционная, 34',area:86,floor:'6/10',delivery:'1 кв. 2019',price:4650000,image:photo('16018cf6e66fdbb9.png')},
 {id:'kazakhstanskaya',rooms:1,address:'ул. Казахстанская, 34',area:36,floor:'2/10',delivery:'Сдан',price:2650000,image:photo('a9ab1ca827388d01.png')},
 {id:'proletarskaya',rooms:3,address:'ул. Пролетарская, 34',area:86,floor:'6/10',delivery:'1 кв.2019',price:4650000,image:photo('16018cf6e66fdbb9.png')}
];
export const categories=['Новостройки','Квартиры','Комнаты','Дома','Коммерческая недвижимость','Земельные участки','Гаражи'];
export const agents=[{name:'Жанслу Татлубаева',period:'месяца',phone:'+7 (5555) 55-55-83',email:'903383@mail.kz',image:photo('4a18204de262b712.png')},{name:'Алибек',period:'недели',phone:'+7 (666) 666-66-66',email:'oleg-p56@mail.kz',image:photo('47b7195c9da4b365.png')}];
export const articles=[
 {id:'walls',category:'Полезно',title:'Квартиры в кирпичных, панельных, монолитных домах - что выбрать?',author:'Гульмира Суеналимова',role:'Риелтор, директор агентства',image:photo('880316dc7fbbcd57.png')},
 {id:'selling',category:'Полезно',title:'Как быстро продать квартиру в Оренбурге?',author:'Олеся Тестовая',role:'Ипотечный брокер',image:photo('6aa10d98acb25b1f.png')},
 {id:'documents',category:'Важно',title:'Какие документы проверить при покупке квартиры?',author:'Зоя Зарипова',role:'Риелтор',image:photo('b4552943fd22e8f6.png')},
 {id:'new-home',category:'Полезно',title:'Вторичка или новостройка - что выбрать?',author:'Тестовая Тест',role:'Риелтор',image:photo('9105a941312ee594.png')}
];
export const news=[{id:'offer',category:'Акция',title:'Тестовый заголовок акции для примера',image:photo('a005fbedcccf8482.jpg')},{id:'builders',category:'Застройщики',title:'Тестовый заголовок новости для примера',image:photo('41cd0a0530a4be35.jpg')}];
