import {image} from '../homepage/ui.js';

// The original map is a screenshot. Figma's crop excludes its browser chrome.
export function mapImage(src){return `<span class="map-image-wrap">${image(src,'Карта из макета с отметкой офиса агентства','object-map-image','width="1101" height="348" loading="lazy"')}</span>`;}
