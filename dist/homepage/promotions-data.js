import {art} from './ui.js';

// Editorial examples for the local mockup, not live commercial offers.
// Every record uses the same layout; text is plain text, not custom HTML.
export const promotions = [
  {
    id: 'home-protection',
    label: 'Оформление полиса',
    title: 'Страхование недвижимости',
    description: 'Обсудите со специалистом страхование недвижимости: что входит в покрытие, какие документы понадобятся и от чего зависит стоимость полиса.',
    image: art('promotion-insurance.png'),
    imageAlt: 'Страховой полис, печать и ручка',
    actionLabel: 'Контакты агентства',
    href: '#contacts',
    note: 'Условия и стоимость зависят от страховой программы.',
  },
  {
    id: 'new-buildings',
    label: 'От застройщиков',
    title: 'Квартиры в новостройках',
    description: 'Сравните расположение домов, планировки и квартиры в каталоге. Поможем подобрать объект под ваш бюджет.',
    image: art('promotion-new-home.png'),
    imageAlt: 'Пара с ключами от новой квартиры',
    actionLabel: 'Смотреть новостройки',
    href: 'property-catalog.html?market=new',
    note: 'Наличие и условия уточняйте у агента.',
  },
  {
    id: 'next-home',
    label: 'Смена жилья',
    title: 'Продажа и покупка жилья',
    description: 'Планируете продать квартиру и купить другую? Начните с подбора нового жилья: укажите бюджет, район и желаемые сроки переезда.',
    image: art('promotion-moving.png'),
    imageAlt: 'Светлое кресло с голубым пледом и столик с вазой',
    actionLabel: 'Подбор нового жилья',
    href: '#consultation',
    note: '',
  },
];
