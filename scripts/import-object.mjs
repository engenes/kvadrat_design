import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const snapshotPath=process.argv[2];
if(!snapshotPath)throw new Error('Pass the Local Figma Reader snapshot path.');
const bytes=await readFile(snapshotPath),snapshot=JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''));
if(snapshot.format!=='local-figma-reader'||snapshot.warnings?.length)throw new Error('Expected a complete Local Figma Reader snapshot.');
const root=snapshot.roots.find(r=>r.document.id==='88:0')?.document;
if(!root)throw new Error('Object frame 88:0 is missing.');
const flatten=node=>[node,...(node.children||[]).flatMap(flatten)];
const nodes=flatten(root),byId=new Map(nodes.map(n=>[n.id,n]));
const node=id=>{const value=byId.get(id);if(!value)throw new Error(`Missing node ${id}`);return value;};
const text=id=>{const value=node(id);if(value.type!=='TEXT')throw new Error(`Missing text ${id}`);return value.characters.trim();};
const number=id=>Number(text(id).split(' руб')[0].replace(/\D/g,''));
const sha256=value=>createHash('sha256').update(value).digest('hex');
const outputPath=path=>resolve(projectRoot,'dist',path);
const localAssets=await readdir(outputPath('references/kvadrat-ds/assets/images/fig'));
await mkdir(outputPath('object-page/assets'),{recursive:true});
const assets={},provenance=[];
for(const asset of snapshot.assets){
 if(!['preview','image'].includes(asset.kind)||asset.encoding!=='base64'||typeof asset.data!=='string'||(asset.kind==='image'&&!/^[a-f0-9]{40}$/.test(asset.imageHash)))throw new Error('Unexpected image metadata.');
 const content=Buffer.from(asset.data,'base64'),digest=sha256(content);
 const ext=content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'png':content[0]===255&&content[1]===216?'jpg':null;
 if(!ext)throw new Error(`Unsupported original image ${asset.key}`);
 let path,reused=false;
 if(asset.imageHash){
  const candidate=localAssets.find(name=>name.startsWith(asset.imageHash.slice(0,16)));
  if(candidate){const candidatePath=`references/kvadrat-ds/assets/images/fig/${candidate}`;if(sha256(await readFile(outputPath(candidatePath)))===digest){path=candidatePath;reused=true;}}
 }
 if(!path){path=asset.kind==='preview'?'object-page/reference.png':`object-page/assets/${asset.imageHash}.${ext}`;await writeFile(outputPath(path),content);}
 assets[asset.key]=path;provenance.push({key:asset.key,path,sha256:digest,bytes:content.length,reused});
}
const image=id=>{const fill=node(id).fills?.find(f=>f.type==='IMAGE');const path=assets[`image:${fill?.imageRef}`];if(!path)throw new Error(`Missing original image ${id}`);return path;};
const titles=nodes.filter(n=>n.type==='TEXT'&&/^\d-комнатная квартира$/.test(n.characters)&&n.absoluteBoundingBox.y>root.absoluteBoundingBox.y+2200).sort((a,b)=>a.absoluteBoundingBox.x-b.absoluteBoundingBox.x);
const similar=titles.map((title,index)=>{
 const box=title.absoluteBoundingBox;
 const photo=nodes.filter(n=>n.type==='RECTANGLE'&&n.fills?.some(f=>f.type==='IMAGE')&&Math.abs(n.absoluteBoundingBox.x-(box.x-25))<3&&n.absoluteBoundingBox.y<box.y&&box.y-n.absoluteBoundingBox.y<220).sort((a,b)=>b.absoluteBoundingBox.y-a.absoluteBoundingBox.y)[0];
 if(!photo)throw new Error(`Missing card photo near ${title.id}`);
 const pbox=photo.absoluteBoundingBox;
 const nearby=nodes.filter(n=>n.type==='TEXT'&&n.absoluteBoundingBox.x>=pbox.x&&n.absoluteBoundingBox.x<pbox.x+270&&n.absoluteBoundingBox.y>=pbox.y+170&&n.absoluteBoundingBox.y<pbox.y+350);
 const match=pattern=>{const item=nearby.find(n=>pattern.test(n.characters));if(!item)throw new Error(`Missing ${pattern} near ${title.id}`);return item.characters.trim();};
 return {id:`object-similar-${index+1}`,sourceId:title.id,rooms:Number(title.characters[0]),address:match(/^ул\./),area:Number(match(/^\d+ м2$/).split(' ')[0]),floor:match(/^\d+\/\d+$/),walls:match(/^(Монолит|Панель|Кирпич)$/),price:Number(match(/^[\d ]+ руб$/).replace(/\D/g,'')),pricePerMeter:Number(match(/^[\d ]+ руб\/м2$/).split(' руб')[0].replace(/\D/g,'')),image:image(photo.id)};
});
if(similar.length!==4)throw new Error(`Expected four visible similar cards, got ${similar.length}.`);
const feature=(titleId,labelId,valueId)=>{
 const labels=text(labelId).split('\n').map(value=>value.replace(/\r/g,'').replace(/\.+$/,'').trim());
 const values=text(valueId).split('\n').map(value=>value.replace(/\r/g,'').trim());
 if(labels.length!==values.length)throw new Error(`Unpaired feature rows ${titleId}`);
 return {title:text(titleId),rows:labels.map((label,index)=>[label,values[index]])};
};
const data={
 title:text('88:35'),address:text('97:0'),price:number('88:43'),pricePerMeter:number('88:48'),
 gallery:['97:5','97:6','97:7','97:8'].map(id=>({src:image(id),alt:'Интерьер 1-комнатной квартиры на Транспортной улице, 18/4'})),
 agent:{name:text('97:18'),phone:text('97:16'),email:text('97:17'),image:image('97:21')},
 mapImage:image('97:184'),similar,description:text('88:372'),
 features:[feature('101:2','101:3','101:4'),feature('101:5','101:6','101:7'),feature('98:244','97:105','98:243')],
 safety:text('98:175').split('\n').map(value=>value.replace(/\u2028/g,' ').replace(/ +/g,' ').trim()),
 catalogNumber:text('97:4').split(':').at(-1).trim(),addedDate:text('97:14').split(':').at(-1).trim(),
 contacts:{address:text('88:30'),phones:[text('88:32'),text('88:28')]},
 footer:{'536':text('88:293'),'538':text('88:295'),'540':text('88:297'),'542':text('88:299')}
};
await writeFile(outputPath('object-page/data.js'),`// Extracted from Object 88:0. Preserve the exported frame's content and source images.\nexport const objectData=${JSON.stringify(data,null,2)};\n`);
const bounds=id=>{const b=node(id).absoluteBoundingBox;return {x:b.x-root.absoluteBoundingBox.x,y:b.y-root.absoluteBoundingBox.y,width:b.width,height:b.height};};
const audit={
 source:{...snapshot.source,nodeId:root.id,completedAt:snapshot.completedAt,sha256:sha256(bytes)},nodeCount:nodes.length,frame:root.absoluteBoundingBox,assets:provenance,visibleSimilarCards:similar.length,
 limitations:[
  'Only a desktop frame was exported. Responsive layout is an implementation adaptation.',
  'The four gallery thumbnails deliberately repeat the same exported interior photo; no additional room photos were provided.',
  'The source description states 40 m2 while the summary and detailed area say 36 m2. Both are preserved.',
  'The summary says brick walls while the detailed house type says panel construction. Both are preserved.',
  'The map is the original exported raster image, retaining its native map marker; no geographic coordinates or live map data were exported. The exact branded vector pin was unavailable and is not approximated.',
  'The third safety benefit contains placeholder copy in the source and is preserved.',
  'No mobile frame or icon vector paths were exported.'
 ],
 measurements:{
  contentWidth:1143,contentLeft:390,breadcrumb:bounds('88:336'),gallery:bounds('88:54'),thumbnail:bounds('97:5'),thumbnailGap:15.1632,summary:bounds('88:36'),summaryInset:31,agentBand:bounds('97:15'),agentPortrait:bounds('97:21'),
  descriptionHeading:bounds('88:371'),description:bounds('88:372'),safety:bounds('98:174'),detailsHeading:bounds('97:104'),featureColumnX:[390,754,1113],featureHeadingY:1253,featureRowsY:1297,featureRowStep:31.328125,
  mapHeading:bounds('97:181'),mapFrame:bounds('97:183'),mapImage:bounds('97:184'),mapPin:bounds('164:2334'),mapImageTransform:node('97:184').fills.find(f=>f.type==='IMAGE').imageTransform,
  similarHeading:bounds('97:154'),similarCardsY:2282,similarCard:{width:270,height:350,photoHeight:169,columnGap:21,bodyInset:25},footerY:2825,footerMainHeight:462,footerBottomHeight:56
 },
 imageFills:['88:54','97:5','97:6','97:7','97:8','97:21','97:184'].map(id=>({id,bounds:bounds(id),fill:node(id).fills.find(f=>f.type==='IMAGE')})),
 typography:{fontFamily:'Proxima Nova',body:{size:14,weight:400,lineHeight:21.328125},title:{size:24,weight:800,lineHeight:23.90625},sectionHeading:{size:28,weight:800,lineHeight:27.890625},subheading:{size:22,weight:800,lineHeight:21.9140625},featureHeading:{size:18,weight:700,lineHeight:27.421875},featureLabel:{size:14,weight:300,lineHeight:21.328125,paragraphSpacing:10}},
 colors:{text:'#1b1b1b',muted:'#9f9f9f',cyan:'#24a9e2',deepCyan:'#178cbe',paleBlue:'#f3f9fc',footer:'#2d2d2d'},
 sourceTextIds:{title:'88:35',address:'97:0',price:'88:43',pricePerMeter:'88:48',description:'88:372',safety:'98:175',catalogNumber:'97:4',addedDate:'97:14',agent:{name:'97:18',phone:'97:16',email:'97:17'}}
};
try{audit.originalIcons=JSON.parse(await readFile(outputPath('object-page/assets/provenance.json'),'utf8')).originalIcons;}catch(error){if(error.code!=='ENOENT')throw error;}
await writeFile(outputPath('object-page/provenance.json'),JSON.stringify(audit,null,2)+'\n');
console.log(`Imported ${nodes.length} layers, ${similar.length} similar cards and ${provenance.length} assets. Reused ${provenance.filter(a=>a.reused).length} byte-identical original images.`);
