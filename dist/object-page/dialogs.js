import {mapImage} from './media.js';
import {esc,image,action,arrow} from '../homepage/ui.js';

export function consultationDialog(topic){
 return `<p class="eyebrow">Консультация</p><h2 id="object-dialog-title">${esc(topic)}</h2><p class="dialog-note">Демонстрационная форма. Данные остаются на этой странице и никуда не отправляются.</p><form class="consult-form"><label>Ваше имя<input name="name" autocomplete="given-name" maxlength="80" required></label><label>Телефон<input name="phone" type="tel" autocomplete="tel" maxlength="25" required></label><button type="submit" class="pill">Проверить заявку</button><p role="status" class="form-result"></p></form>`;
}

export function mortgageDialog(price){
 return `<p class="eyebrow">Ипотечный калькулятор</p><h2 id="object-dialog-title">Ежемесячный платёж</h2><p class="dialog-note">Демонстрационный расчёт. Укажите свою ставку: начальное значение 10% служит примером и не является предложением банка.</p><form class="mortgage-form"><label>Стоимость объекта, руб.<input name="price" type="number" min="1" max="1000000000000" step="1" value="${esc(price)}" required></label><label>Первоначальный взнос, руб.<input name="deposit" type="number" min="0" max="1000000000000" step="1" value="${esc(Math.round(Number(price)*0.2))}" required></label><div class="form-columns"><label>Годовая ставка, %<input name="rate" type="number" min="0" max="100" step="0.1" value="10" required></label><label>Срок, лет<input name="years" type="number" min="1" max="50" step="1" value="20" required></label></div><output class="payment-result" aria-live="polite"></output><p class="dialog-note">Равные ежемесячные платежи, без страховки и комиссий.</p></form>`;
}

export function galleryDialog(data,index){
 const photo=data.gallery[index];
 return `<p class="eyebrow">Фотографии объекта</p><h2 id="object-dialog-title">${esc(data.title)}</h2><div class="gallery-viewer">${image(photo.src,photo.alt,'gallery-viewer-photo','id="gallery-dialog-photo"')}<div class="gallery-viewer-controls"><button type="button" data-photo-step="-1" aria-label="Предыдущее фото">${arrow('left')}</button><output id="gallery-dialog-status" aria-live="polite">${index+1} / ${data.gallery.length}</output><button type="button" data-photo-step="1" aria-label="Следующее фото">${arrow()}</button></div><div class="gallery-viewer-thumbs" aria-label="Выбор фотографии">${data.gallery.map((item,i)=>`<button type="button" data-photo="${i}" aria-pressed="${i===index}" aria-label="Фото ${i+1}: ${esc(item.alt)}">${image(item.src,'','','loading="lazy"')}</button>`).join('')}</div></div>`;
}

export function mapDialog(data){
 return `<p class="eyebrow">Расположение</p><h2 id="object-dialog-title">${esc(data.address)}</h2><p class="dialog-note">Сохранённое изображение карты из макета. Карта не интерактивная.</p>${mapImage(data.mapImage)}`;
}

export function propertyDialog(item){
 const title=item.title||`${item.rooms}-комнатная квартира`;
 const specs=[['Площадь',`${item.area} м²`],['Этаж',item.floor],item.walls?['Стены',item.walls]:['Сдача',item.delivery]].filter(([,value])=>value!==undefined&&value!==null);
 return `${image(item.image,`${title}, ${item.address}`,'detail-photo')}<p class="eyebrow">Объект из макета</p><h2 id="object-dialog-title">${esc(title)}</h2><p>${esc(item.address)}</p><dl class="detail-specs">${specs.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p class="detail-price">${Number(item.price).toLocaleString('ru-RU')} руб.</p>${action('Узнать подробнее',`${title}, ${item.address}`)}`;
}
