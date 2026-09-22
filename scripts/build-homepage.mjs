import {readFile,writeFile} from 'node:fs/promises';
import {renderRefresh} from '../dist/homepage/refresh-sections.js';
const content=renderRefresh();
const source=(await readFile('dist/homepage.html','utf8')).replace('href="homepage/styles.css"','href="homepage/refresh.css"');
const template=source.includes('href="select.css"')?source:source.replace('<link rel="stylesheet" href="homepage/refresh.css">','<link rel="stylesheet" href="select.css">\n  <link rel="stylesheet" href="homepage/refresh.css">');
await writeFile('dist/homepage.html',template.replace('class="skip-link" href="#services"','class="skip-link" href="#search"').replace(/<main id="homepage">[\s\S]*?<\/main>/,`<main id="homepage">${content}</main>`));
console.log('Homepage rendered: September 2026 concept, shared property data and search fields.');
