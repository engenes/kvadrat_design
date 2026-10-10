// Isolated art-direction study in /reviews. Styles are added only to this preview's iframe;
// the homepage, shared tokens, saved form data and illustrations are unchanged.
export const palettes={
  current:{name:'Текущая',surface:'#EFF4F7',panel:'#E6EEF3',muted:'#5B6B78',divider:'#D8E2E8',description:'Исходная палитра: серо-голубые поверхности, разные заливки покупки и продажи, полупрозрачные нижние полосы.'},
  porcelain:{name:'Нейтральный фарфор',surface:'#F3F5F6',panel:'#EBEFF2',muted:'#566169',divider:'#DCE2E6',description:'Светлые нейтральные поверхности, чистые белые поля и голубые действия. Самый спокойный вариант; иллюстрации и графит выходят вперёд.'},
  ice:{name:'Чистый голубой',surface:'#EFF8FE',panel:'#E2F1FC',muted:'#52616D',divider:'#D4E4EF',description:'Более светлый и чистый голубой. Цвет заметен, но белые материалы сохраняют свет. Ближе всего к нынешней голубой концепции.'},
  sky:{name:'Более насыщенный',surface:'#E4F2FC',panel:'#D5EAF9',muted:'#4C5D6A',divider:'#C8DDEA',description:'Более выраженный голубой и сильнее отделённые панели. Выглядит энергичнее, но цвет начинает конкурировать с иллюстрациями.'}
};
const frame=document.querySelector('iframe');
const description=document.querySelector('#palette-description');
const swatches=document.querySelector('#palette-swatches');
const validSections=['services','mortgage','catalog','conversation','top'];
const params=new URLSearchParams(location.search);
let chosen=Object.hasOwn(palettes,params.get('palette'))?params.get('palette'):'porcelain';
let section=validSections.includes(params.get('section'))?params.get('section'):'services';
let ready=false;
document.querySelector(`input[value="${chosen}"]`).checked=true;

function previewCss(palette){
  if(palette==='current')return '';
  const p=palettes[palette];
  return `:root{--ui-surface:${p.surface};--ui-surface-soft:${p.panel};--ui-muted:${p.muted};--ui-divider:${p.divider};--ui-surface-raised:#fff}
  .agency-service--sell{background:var(--ui-surface)}
  .agency-service-links{background:transparent}
  .promotion-image:before,.mortgage-preview:before{background:none}
  .mortgage-calc-link{background:#fff}
  .mortgage-calc-link:hover{background:var(--ui-select-hover)}
  .search-suggestions,.search-suggestions>span{color:var(--ui-muted)}
  .r-footer{background:var(--ui-surface)}
  .search-button{background:var(--ui-dark)}`;
}

function renderControls(){
  const p=palettes[chosen];
  description.textContent=p.description;
  swatches.replaceChildren(...[['Карточка',p.surface],['Поиск',p.panel],['Текст',p.muted]].map(([label,color])=>{
    const el=document.createElement('span');el.className='review-swatch';
    const chip=document.createElement('i');chip.style.setProperty('--swatch',color);chip.setAttribute('aria-hidden','true');
    const text=document.createElement('span');text.textContent=`${label} ${color}`;el.append(chip,text);return el;
  }));
  document.querySelectorAll('[data-section]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.section===section)));
  const url=new URL(location.href);url.searchParams.set('palette',chosen);url.searchParams.set('section',section);history.replaceState(null,'',url);
}

function applyPalette(){
  renderControls();
  if(!ready)return;
  let style=frame.contentDocument.getElementById('palette-study');
  if(!style){style=frame.contentDocument.createElement('style');style.id='palette-study';frame.contentDocument.head.append(style);}
  style.textContent=previewCss(chosen);
}

function navigateSection(){
  renderControls();
  if(!ready){frame.src='homepage.html'+(section==='top'?'':'#'+section);return;}
  const win=frame.contentWindow;
  if(section==='top')win.scrollTo({top:0,behavior:'instant'});
  else frame.contentDocument.getElementById(section)?.scrollIntoView({behavior:'instant',block:'start'});
}

document.querySelectorAll('input[name="palette"]').forEach(input=>input.addEventListener('change',()=>{chosen=input.value;applyPalette();}));
document.querySelectorAll('[data-section]').forEach(button=>button.addEventListener('click',()=>{section=button.dataset.section;navigateSection();}));
frame.addEventListener('load',()=>{
  ready=false;
  if(!frame.contentDocument.querySelector('#homepage'))return;
  ready=true;applyPalette();
  frame.contentDocument.fonts.ready.then(navigateSection);
});
renderControls();
