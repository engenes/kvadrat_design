import {art} from './ui.js';

// Directions present in the approved source. No unverified discounts, rates or deadlines.
export const promotions = [
 {id:'next-home',label:'Продажа + покупка',title:'Из своей квартиры — в новую',description:'Свяжем продажу вашего жилья и подбор следующего. Согласуем последовательность сделок и расчётов.',image:art('promotion-moving.png'),imageAlt:'Кресло с голубым пледом и столик — предметная иллюстрация переезда',actionLabel:'Обсудить смену жилья',topic:'Продажа текущего жилья и покупка нового',note:'Сроки и условия зависят от обеих сделок.'},
 {id:'new-buildings',label:'От застройщиков',title:'Квартира в новостройке',description:'Сравним жилые комплексы, планировки и предложения застройщиков под ваш бюджет.',image:art('apartment-model.webp'),imageAlt:'Предметная иллюстрация планировки квартиры',actionLabel:'Смотреть новостройки',href:'property-catalog.html?market=new',note:'Наличие, цены и специальные условия уточним при подборе.'},
 {id:'home-protection',label:'Оформление полиса',title:'Страхование недвижимости',description:'Поможем разобраться в покрытии, подобрать программу и подготовить документы для полиса.',image:art('promotion-insurance.png'),imageAlt:'Страховой полис, печать и ручка',actionLabel:'Обсудить страхование',topic:'Страхование недвижимости',note:'Стоимость и условия зависят от страховой программы.'},
];
