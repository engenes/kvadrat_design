import {readFile,writeFile} from 'node:fs/promises';
import {renderRefresh} from '../dist/homepage/refresh-sections.js';
const content=renderRefresh();
const source=(await readFile('dist/homepage.html','utf8')).replace('href="homepage/styles.css"','href="homepage/refresh.css"');
const pageSource=source.replace(/<title>[\s\S]*?<\/title>/,'<title>Квадрат — недвижимость в Оренбурге: покупка, продажа и аренда</title>').replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="Агентство «Квадрат» в Оренбурге. Каталог недвижимости, подбор квартир и домов, помощь с продажей, арендой и оформлением ипотеки.">');
const template=pageSource.includes('href="select.css"')?pageSource:pageSource.replace('<link rel="stylesheet" href="homepage/refresh.css">','<link rel="stylesheet" href="select.css">\n  <link rel="stylesheet" href="homepage/refresh.css">');
await writeFile('dist/homepage.html',template.replace('class="skip-link" href="#search"','class="skip-link" href="#services"').replace(/<main id="homepage">[\s\S]*?<\/main>/,`<main id="homepage">${content}</main>`));
console.log('Homepage v3 rendered: services, team, mortgage and shared property search.');
