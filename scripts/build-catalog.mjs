import {writeFile} from 'node:fs/promises';
import {pageContent} from '../dist/catalog-page/components.js';
const html=`<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="Каталог недвижимости Квадрат. Сравните квартиры в Оренбурге по цене, площади и расположению."><title>Купить квартиру в Оренбурге — Квадрат</title><link rel="stylesheet" href="select.css"><link rel="stylesheet" href="homepage/refresh.css"><link rel="stylesheet" href="catalog-page/styles.css"><script type="module" src="catalog-page/interactions.js"></script></head>
<body class="catalog-page"><a class="skip-link" href="#catalog-page">Перейти к каталогу</a>${pageContent()}<dialog id="catalog-dialog" aria-labelledby="catalog-dialog-title"><button type="button" class="dialog-close" aria-label="Закрыть">×</button><div id="catalog-dialog-content"></div></dialog><noscript><p class="noscript-note">Вы видите все 20 объектов макета. Для фильтрации, сортировки и избранного включите JavaScript.</p></noscript></body></html>`;
await writeFile('dist/property-catalog.html',html);
console.log('Catalog built with the current shared design system.');
