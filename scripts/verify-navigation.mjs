import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {dirname,resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../dist');
const pages=(await readdir(root)).filter(name=>name.endsWith('.html')).sort();
assert.equal(pages.length,7,'Update the authored-page inventory when adding a page.');
const documents=new Map(await Promise.all(pages.map(async name=>[name,await readFile(resolve(root,name),'utf8')])));
const indexRoutes=new Set(['pages','foundations','components','screens','sources','file','builder']);
const feedsScript=await readFile(resolve(root,'feeds.js'),'utf8');
const feedIds=new Set([...feedsScript.matchAll(/\bid:'([^']+)'/g)].map(match=>match[1]));
const graph=new Map(pages.map(page=>[page,new Set()]));
const hub='index.html#pages',builder='index.html#builder';
graph.set(hub,new Set(['index.html']));
graph.set(builder,new Set(['index.html']));
let localReferences=0,anchors=0,propertyCards=0;

const attributes=tag=>Object.fromEntries([...tag.matchAll(/\b([\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map(match=>[match[1],match[3].replaceAll('&amp;','&')]));
const tags=html=>[...html.matchAll(/<([a-z][\w-]*)\b[^>]*>/gi)].map(match=>({name:match[1].toLowerCase(),attributes:attributes(match[0])}));
const ids=new Map([...documents].map(([page,html])=>[page,new Set(tags(html).map(tag=>tag.attributes.id).filter(Boolean))]));
const localPath=url=>{
 const path=resolve(root,'.'+decodeURIComponent(url.pathname));
 const rel=relative(root,path);
 assert.ok(rel!== '..'&&!rel.startsWith('..\\')&&!rel.startsWith('../')&&!isAbsolute(rel),`Local path leaves dist: ${url.pathname}`);
 return path;
};

async function validateFragment(page,hash,from,href){
 if(!hash)return;
 const fragment=decodeURIComponent(hash.slice(1));
 if(ids.get(page)?.has(fragment))return;
 if(page==='index.html'){
  const [route,...details]=fragment.split('/');
  assert.ok(indexRoutes.has(route),`${from}: unknown library route ${href}`);
  if(route==='file'){
   assert.ok(details.length,`${from}: missing file route path ${href}`);
   const file=resolve(root,'references',details.join('/'));
   assert.ok((await stat(file)).isFile(),`${from}: missing reference ${href}`);
  }else if(route==='screens')assert.ok(!details.length||['homepage','admin','scheduling','topbar'].includes(details.join('/')),`${from}: unknown screen group ${href}`);
  else if(route==='foundations')assert.ok(!details.length||['colors','typography','spacing','shadows'].includes(details.join('/')),`${from}: unknown foundation ${href}`);
  else if(route!=='components')assert.equal(details.length,0,`${from}: unexpected route detail ${href}`);
  return;
 }
 if(page==='feeds.html'){
  if(['list','new'].includes(fragment))return;
  const match=fragment.match(/^feed\/([^/]+)\/(settings|mapping|check)$/);
  assert.ok(match&&feedIds.has(match[1]),`${from}: unknown feed route ${href}`);
  return;
 }
 assert.ok(ids.get(page)?.has(fragment),`${from}: missing fragment ${href}`);
}

for(const [page,html] of documents){
 for(const tag of tags(html)){
  for(const attribute of ['href','src']){
   const href=tag.attributes[attribute];
   if(!href||href.includes('${')||href.includes('{{')||/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href))continue;
   const url=new URL(href,`http://local/${page}`);
   assert.ok((await stat(localPath(url))).isFile(),`${page}: missing local file ${href}`);
   localReferences++;
   const target=decodeURIComponent(url.pathname.slice(1));
   if(documents.has(target))await validateFragment(target,url.hash,page,href);
   if(tag.name==='a'&&attribute==='href'&&documents.has(target)){
    anchors++;
    const routeNode=target==='index.html'&&['#pages','#builder'].includes(url.hash)?target+url.hash:target;
    graph.get(page).add(routeNode);
   }
  }
 }
}

const reachable=start=>{
 const visited=new Set(),pending=[start];
 while(pending.length){const node=pending.pop();if(visited.has(node))continue;visited.add(node);pending.push(...(graph.get(node)||[]));}
 return visited;
};
const fromHub=reachable(hub);
for(const page of [...pages,builder])assert.ok(fromHub.has(page),`Unreachable authored page from All pages: ${page}`);
for(const page of pages)assert.ok(reachable(page).has(hub),`No return path to All pages from ${page}`);
assert.ok(graph.get('feeds.html').has('feeds-ux.html'),'Feed prototype must link to its UX review.');
assert.ok(graph.get('feeds-ux.html').has('feeds.html'),'UX review must link back to the feed prototype.');

const home=documents.get('homepage.html');
const navigation=home.match(/<nav\b[^>]*aria-label="Основная навигация"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
assert.ok(navigation,'Homepage primary navigation is missing.');
const realEstate=[...navigation.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].find(match=>match[2].replace(/<[^>]*>/g,'').trim()==='Недвижимость');
assert.equal(attributes(realEstate?.[1]||'').href,'property-catalog.html','Homepage real-estate navigation must open the catalog.');

for(const page of ['homepage.html','property-catalog.html','property-object.html','homepage-components.html']){
 const html=documents.get(page);
 const cards=[...html.matchAll(/<article\b[^>]*class="[^"]*\bproperty-card\b[^"]*"[^>]*>([\s\S]*?)<\/article>/g)];
 assert.ok(cards.length,`${page}: missing property cards`);
 for(const [index,card] of cards.entries()){
  const links=tags(card[1]).filter(tag=>tag.name==='a');
  assert.ok(links.length,`${page}: property card ${index+1} has no ordinary link`);
  for(const link of links)assert.equal(link.attributes.href,'property-object.html',`${page}: property card ${index+1} must open the authored Figma object page`);
  assert.ok(!/<button\b[^>]*\bdata-property(?:=|\s|>)/.test(card[1]),`${page}: property card ${index+1} still uses a dialog button`);
  propertyCards++;
 }
}

console.log(`Navigation verified: ${pages.length} authored pages and builder reachable from All pages, return paths, ${anchors} local page links, ${localReferences} local references, valid fragments, and ${propertyCards} cards opening the object page.`);
