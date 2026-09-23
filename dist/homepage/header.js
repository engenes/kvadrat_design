// Shared disclosure behavior; CSS alone determines the responsive layout.
export function mountHeader(root=document){
 const header=root.querySelector('.r-header');
 const navigation=header?.querySelector('.r-navigation'),toggle=header?.querySelector('.menu-toggle');
 if(!navigation||!toggle)return ()=>{};
 const compact=()=>Boolean(toggle.getClientRects().length);
 let wasCompact=compact(),lastFocused=document.activeElement;
 const isOpen=()=>toggle.getAttribute('aria-expanded')==='true';
 const setMenu=open=>{
  navigation.classList.toggle('is-open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
 };
 toggle.addEventListener('click',()=>{
  const open=!isOpen();setMenu(open);
  if(open)navigation.querySelector('a')?.focus({preventScroll:true});
 });
 navigation.addEventListener('click',event=>{
  if(!event.target.closest('a'))return;
  const returnFocus=isOpen()&&compact();setMenu(false);
  if(returnFocus)toggle.focus({preventScroll:true});
 });
 document.addEventListener('keydown',event=>{
  if(event.key!=='Escape'||event.defaultPrevented||!isOpen())return;
  event.preventDefault();setMenu(false);toggle.focus({preventScroll:true});
 });
 document.addEventListener('click',event=>{
  if(!isOpen()||navigation.contains(event.target)||toggle.contains(event.target))return;
  const returnFocus=navigation.contains(document.activeElement);setMenu(false);
  if(returnFocus)toggle.focus({preventScroll:true});
 });
 document.addEventListener('focusin',event=>{
  lastFocused=event.target;
  if(isOpen()&&!navigation.contains(event.target)&&!toggle.contains(event.target))setMenu(false);
 });
 window.addEventListener('resize',()=>{
  const nowCompact=compact();if(nowCompact===wasCompact)return;
  wasCompact=nowCompact;
  // Browsers may blur a newly hidden link before dispatching resize.
  const focused=document.activeElement===document.body?lastFocused:document.activeElement;setMenu(false);
  if(nowCompact&&navigation.contains(focused))toggle.focus({preventScroll:true});
  else if(!nowCompact&&focused===toggle)navigation.querySelector('a')?.focus({preventScroll:true});
 });
 return setMenu;
}
