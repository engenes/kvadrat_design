import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const snapshotPath=process.argv[2];
if(!snapshotPath)throw new Error('Pass the Local Figma Reader snapshot path.');
const bytes=await readFile(snapshotPath),snapshot=JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''));
if(snapshot.format!=='local-figma-reader'||snapshot.warnings.length)throw new Error('Expected a complete Local Figma Reader snapshot.');
const root=snapshot.roots.find(r=>r.document.id==='49:0')?.document;
if(!root)throw new Error('Catalog frame 49:0 is missing.');
const flatten=node=>[node,...(node.children||[]).flatMap(flatten)];
const nodes=flatten(root),byId=new Map(nodes.map(n=>[n.id,n]));
const text=id=>{const node=byId.get(id);if(node?.type!=='TEXT')throw new Error(`Missing text ${id}`);return node.characters.trim();};
const localAssets=await readdir('dist/references/kvadrat-ds/assets/images/fig');
await mkdir('dist/catalog-page/assets',{recursive:true});
const assets={},provenance=[];
for(const asset of snapshot.assets){
 const key=asset.key;
 if(!['preview','image'].includes(asset.kind)||asset.encoding!=='base64'||typeof asset.data!=='string'||(asset.kind==='image'&&!/^[a-f0-9]{40}$/.test(asset.imageHash)))throw new Error('Unexpected image metadata.');
 const content=Buffer.from(asset.data,'base64'),sha256=createHash('sha256').update(content).digest('hex');
 const ext=asset.kind==='preview'||content[0]===137?'png':'jpg';
 let path;
 if(asset.imageHash){
  const candidate=localAssets.find(name=>name.startsWith(asset.imageHash.slice(0,16)));
  if(candidate){const candidatePath=`dist/references/kvadrat-ds/assets/images/fig/${candidate}`;if(createHash('sha256').update(await readFile(candidatePath)).digest('hex')===sha256)path=candidatePath.slice(5);}
 }
 if(!path){path=asset.kind==='preview'?'catalog-page/reference.png':`catalog-page/assets/${asset.imageHash}.${ext}`;await writeFile(`dist/${path}`,content);}
 assets[key]=path;provenance.push({key,path,sha256,bytes:content.length});
}
const titles=nodes.filter(n=>n.type==='TEXT'&&/^\d-комнатная квартира$/.test(n.characters)).sort((a,b)=>a.absoluteBoundingBox.y-b.absoluteBoundingBox.y||a.absoluteBoundingBox.x-b.absoluteBoundingBox.x);
const properties=titles.map((title,index)=>{
 const box=title.absoluteBoundingBox;
 const photo=nodes.filter(n=>n.type==='RECTANGLE'&&n.fills?.some(f=>f.type==='IMAGE')&&Math.abs(n.absoluteBoundingBox.x-(box.x-25))<3&&n.absoluteBoundingBox.y<box.y&&box.y-n.absoluteBoundingBox.y<220).sort((a,b)=>b.absoluteBoundingBox.y-a.absoluteBoundingBox.y)[0];
 if(!photo)throw new Error(`Missing card photo near ${title.id}`);
 const pbox=photo.absoluteBoundingBox;
 const nearby=nodes.filter(n=>n.type==='TEXT'&&n.absoluteBoundingBox.x>=pbox.x&&n.absoluteBoundingBox.x<pbox.x+270&&n.absoluteBoundingBox.y>=pbox.y+170&&n.absoluteBoundingBox.y<pbox.y+350);
 const match=pattern=>{const node=nearby.find(n=>pattern.test(n.characters));if(!node)throw new Error(`Missing ${pattern} near ${title.id}`);return node.characters.trim();};
 const imagePath=assets[`image:${photo.fills.find(f=>f.type==='IMAGE').imageRef}`];
 if(!imagePath)throw new Error(`Missing original image for ${title.id}`);
 return {id:`catalog-${index+1}`,sourceId:title.id,rooms:Number(title.characters[0]),address:match(/^ул\./),area:Number(match(/^\d+ м2$/).split(' ')[0]),floor:match(/^\d+\/\d+$/),walls:match(/^(Монолит|Панель|Кирпич)$/),price:Number(match(/^[\d ]+ руб$/).replace(/\D/g,'')),pricePerMeter:Number(match(/^[\d ]+ руб\/м2$/).split(' руб')[0].replace(/\D/g,'')),image:imagePath};
});
if(properties.length!==20)throw new Error(`Expected 20 visible cards, got ${properties.length}.`);
const data={title:text('49:54'),properties,contacts:{address:text('49:42'),phones:[text('49:45'),text('169:370')]},help:{eyebrow:text('87:382'),title:text('87:383'),lead:text('87:391'),body:text('87:384')},footer:{'536':text('49:542'),'538':text('49:544'),'540':text('49:546'),'542':text('49:548')},mapImage:assets['image:c9cb37ac4f729bcbe8d037a5f159f48bd50a12fc'],bannerImage:assets['image:0f3b9ff0a9e2ef25c3f1dd77acab8f52b05928c5']};
await writeFile('dist/catalog-page/data.js',`// Extracted from Catalog 49:0. Do not invent records beyond the exported frame.\nexport const catalogData=${JSON.stringify(data,null,2)};\n`);
const audit={source:{...snapshot.source,nodeId:root.id,completedAt:snapshot.completedAt,sha256:createHash('sha256').update(bytes).digest('hex')},nodeCount:nodes.length,frame:root.absoluteBoundingBox,assets:provenance,visibleCards:properties.length,referenceCountLabel:text('87:118'),limitations:['The frame contains 20 cards; the illustrated 56-result count is not a dataset.','No district, renovation flag, listing date or geographic coordinates were exported.','No mobile frame or icon vector paths were exported.'],measurements:{contentWidth:1143,columns:4,columnGap:21,rowGap:40,card:{width:270,height:350,photoHeight:169,bodyInset:25},filter:{y:371,height:317},map:{y:713.1,height:130.1},firstCardY:936,bannerY:2135,helpY:3350,footerY:3942}};
await writeFile('dist/catalog-page/provenance.json',JSON.stringify(audit,null,2)+'\n');
await mkdir('.sites-runtime/catalog-audit',{recursive:true});
await writeFile('.sites-runtime/catalog-audit/nodes.json',JSON.stringify(nodes.map(n=>({id:n.id,name:n.name,type:n.type,text:n.characters,style:n.style,bounds:n.absoluteBoundingBox,fills:n.fills})),null,2));
console.log(`Imported ${nodes.length} layers, ${properties.length} cards and ${provenance.length} assets. Existing byte-identical images reused.`);
