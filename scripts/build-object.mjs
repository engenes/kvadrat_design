import {writeFile} from 'node:fs/promises';
import {objectPage} from '../dist/object-page/components.js';
const html=`<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="1-комнатная квартира, 36 м², на Транспортной улице в Оренбурге. Макет агентства недвижимости Квадрат."><title>1-комнатная квартира, 36 м² — Квадрат</title><link rel="icon" href="references/kvadrat-ds/assets/logo/kvadrat-mark.svg"><link rel="stylesheet" href="homepage/refresh.css"><link rel="stylesheet" href="object-page/styles.css"><script type="module" src="object-page/interactions.js"></script></head>
<body class="object-page"><a class="skip-link" href="#object-page">Перейти к объекту</a>${objectPage()}<dialog id="object-dialog" aria-labelledby="object-dialog-title"><button type="button" class="dialog-close" aria-label="Закрыть">×</button><div id="object-dialog-content"></div></dialog><noscript><p class="noscript-note">Страница доступна для просмотра. Для переключения фотографий, избранного и демонстрационных форм включите JavaScript.</p></noscript></body></html>`;
await writeFile('dist/property-object.html',html);
console.log('Property detail built as static HTML with shared site components.');
