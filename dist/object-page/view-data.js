import {objectData} from './data.js';
import {catalogData} from '../catalog-page/data.js';

// Presentation of the historical demo, not a source of production listing data.
// Conflicting facts are omitted or left for clarification (see OBJECT.md).
export const objectView = {
  ...objectData,
  area: 36,
  agent: {...objectData.agent, phone:objectData.agent.phone.replace(/^8/, '+7')},
  pricePerMeter: Math.round(objectData.price / 36),
  // Deliberately repeat the available image 30 times to exercise the gallery mockup.
  gallery: Array.from({length:30}, () => ({...objectData.gallery[0]})),
  description: 'Светлая однокомнатная квартира с ремонтом. Общая площадь — 36 м², жилая комната — 16 м², кухня — 10 м². Квартира находится на втором этаже десятиэтажного дома. Окна выходят во двор, есть лоджия.',
  descriptionExtra: 'Санузел совмещённый, установлены пластиковые окна и счётчики воды. Состав мебели, которая остаётся при продаже, можно уточнить у агента. Он также ответит на вопросы о доме и согласует время просмотра.',
  features: [
    {title:'О квартире', rows:[['Комнат','1'],['Общая площадь','36 м²'],['Жилая площадь','16 м²'],['Кухня','10 м²'],['Этаж','2 из 10'],['Высота потолков','2,7 м'],['Окна','Во двор'],['Балкон / лоджия','1 лоджия'],['Санузел','Совмещённый'],['Ремонт','Есть']]},
    {title:'О доме', rows:[['Тип жилья','Вторичное'],['Год постройки','2006'],['Этажей в доме','10'],['Материал стен','Уточняется'],['Лифты','2, один грузовой'],['Детская площадка','Есть'],['Парковка','Есть']]},
    {title:'Оснащение', rows:[['Отопление','Центральное'],['Плита','Электрическая'],['Окна','Пластиковые'],['Домофон','Есть'],['Счётчики воды','Есть'],['Мебель','Уточните у агента']]},
  ],
  similar: catalogData.properties.slice(0,4).map(item => ({...item, pricePerMeter:Math.round(item.price/item.area)})),
};
