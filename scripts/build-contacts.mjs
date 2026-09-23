import {writeFile} from 'node:fs/promises';
import {contactsPage} from '../dist/contacts-page/components.js';
const html=`<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="Контакты агентства недвижимости Квадрат в Оренбурге: телефоны, почта, адрес офиса и часы работы."><title>Контакты — агентство недвижимости Квадрат</title><link rel="icon" href="references/kvadrat-ds/assets/logo/kvadrat-mark.svg"><link rel="stylesheet" href="homepage/refresh.css"><link rel="stylesheet" href="contacts-page/styles.css"><script type="module" src="contacts-page/interactions.js"></script></head><body class="contacts-page"><a class="skip-link" href="#contacts-main">Перейти к контактам</a>${contactsPage()}<div class="c-status" role="status" aria-live="polite" hidden></div></body></html>`;
await writeFile('dist/contacts.html',html);
console.log('Contacts built with shared Kvadrat header, footer and design tokens.');
