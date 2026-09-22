import {readFile,writeFile} from 'node:fs/promises';
import {renderRefresh} from '../dist/homepage/refresh-sections.js';
const content=renderRefresh();
const template=await readFile('dist/homepage.html','utf8');
await writeFile('dist/homepage.html',template.replace('href="homepage/styles.css"','href="homepage/refresh.css"').replace('class="skip-link" href="#services"','class="skip-link" href="#search"').replace(/<main id="homepage">[\s\S]*?<\/main>/,`<main id="homepage">${content}</main>`));
console.log('Homepage rendered: September 2026 concept, shared property data and search fields.');
