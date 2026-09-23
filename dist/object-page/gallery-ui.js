import {image,esc} from '../homepage/ui.js';

const chevron = direction => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${direction<0?'m14 5-7 7 7 7':'m10 5 7 7-7 7'}"/></svg>`;

// Page gallery controls. The fullscreen view will use a library component.
export function photoNavigation(photos,index=0){
 return `<div class="object-photo-navigation" aria-label="Навигация по фотографиям">
  <button type="button" class="object-photo-arrow object-photo-previous" data-photo-step="-1" aria-label="Предыдущее фото" aria-disabled="${index===0}"${photos.length<2?' disabled':''}>${chevron(-1)}</button>
  <output class="object-photo-counter" data-photo-counter aria-live="polite" aria-atomic="true">Фото ${index+1} из ${photos.length}</output>
  <button type="button" class="object-photo-arrow object-photo-next" data-photo-step="1" aria-label="Следующее фото" aria-disabled="${index===photos.length-1}"${photos.length<2?' disabled':''}>${chevron(1)}</button>
 </div>`;
}

export function photoThumbnails(photos,index=0){
 return `<div class="object-photo-thumbnails" role="group" aria-label="Выбор фотографии. Стрелки — предыдущее и следующее, Home и End — первое и последнее">${photos.map((photo,i)=>`<button type="button" class="object-photo-thumbnail" data-photo="${i}" tabindex="${i===index?0:-1}" aria-label="Фото ${i+1}: ${esc(photo.alt)}" aria-pressed="${i===index}">${image(photo.src,'','','loading="lazy" width="112" height="76"')}<span class="object-thumbnail-number" aria-hidden="true">${i+1}</span><span class="object-thumbnail-check" aria-hidden="true">✓</span></button>`).join('')}</div>`;
}
