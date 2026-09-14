import {readFile,writeFile} from 'node:fs/promises';
import {hero,serviceSection,mortgage,offers,catalog,search,about,editorial,consultation,newsSection,blog,footer} from '../dist/homepage/sections.js';
const copy=JSON.parse((await readFile('dist/homepage/copy.json','utf8')).replace(/^\uFEFF/,''));
const content=`<div class="dark-intro">${hero()}${serviceSection()}${mortgage(copy)}</div><div class="light-content">${offers()}${catalog(copy)}${search()}${about(copy)}${editorial(copy)}${consultation(copy)}${newsSection()}${blog(copy)}</div>${footer(copy)}`;
const template=await readFile('dist/homepage.html','utf8');
await writeFile('dist/homepage.html',template.replace(/<main id="homepage">[\s\S]*?<\/main>/,`<main id="homepage">${content}</main>`));
console.log('Homepage rendered as static HTML from shared components.');
