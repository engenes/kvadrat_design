import {mapImage} from './media.js';
import {esc} from '../homepage/ui.js';

export function consultationDialog(topic,data){
 const aboutObject=/просмотр|объект|условиях покупки/i.test(topic);
 const viewing=/просмотр/i.test(topic);
 return `<p class="r-kicker">Обсудить с агентом</p><h2 id="object-dialog-title">${esc(topic)}</h2>${data&&aboutObject?`<p class="consult-object">${esc(data.title)} · ${esc(data.area)} м²<br><span>${esc(data.address)}</span></p>`:''}<p class="dialog-note" id="object-consult-note">Демонстрационная форма: данные никуда не отправляются и не сохраняются.</p><form class="consult-form" novalidate aria-describedby="object-consult-note">
  <div class="object-form-field"><label class="ui-field-label" for="object-contact-name">Ваше имя</label><input class="ui-input" id="object-contact-name" name="name" autocomplete="given-name" maxlength="80" required aria-describedby="object-contact-name-error"><span class="field-error ui-field-error" id="object-contact-name-error" hidden></span></div>
  <div class="object-form-field"><label class="ui-field-label" for="object-contact-phone">Телефон</label><input class="ui-input" id="object-contact-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 (___) ___-__-__" maxlength="25" required aria-describedby="object-contact-phone-error"><span class="field-error ui-field-error" id="object-contact-phone-error" hidden></span></div>
  <div class="object-form-field"><label class="ui-field-label" for="object-contact-message">${viewing?'Удобное время и вопросы':'Ваш вопрос'}</label><span class="field-hint ui-field-hint" id="object-contact-message-hint">Необязательно</span><textarea class="ui-input" id="object-contact-message" name="message" rows="3" maxlength="1000" aria-describedby="object-contact-message-hint" placeholder="${viewing?'Например, хочу посмотреть квартиру в субботу':'Что вы хотели бы обсудить с агентом'}"></textarea></div>
  <button type="submit" class="r-button">Проверить форму</button><p role="status" aria-live="polite" class="form-result"></p>
 </form>`;
}

export function mortgageDialog(price){
 return `<p class="r-kicker">Ипотечный калькулятор</p><h2 id="object-dialog-title">Рассчитать платёж</h2><p class="dialog-note" id="object-mortgage-note">Укажите ставку выбранного банка. Расчёт предварительный, без страховки и комиссий; он не является предложением банка.</p><form class="mortgage-form" novalidate aria-describedby="object-mortgage-note">
  <div class="object-form-field"><label class="ui-field-label" for="object-loan-price">Стоимость квартиры, ₽</label><input class="ui-input" id="object-loan-price" name="price" type="number" inputmode="decimal" min="1" max="1000000000000" step="1" value="${esc(price)}" required></div>
  <div class="object-form-field"><label class="ui-field-label" for="object-loan-deposit">Первоначальный взнос, ₽</label><input class="ui-input" id="object-loan-deposit" name="deposit" type="number" inputmode="decimal" min="0" max="1000000000000" step="1" value="${esc(Math.round(Number(price)*0.2))}" required></div>
  <div class="form-columns"><div class="object-form-field"><label class="ui-field-label" for="object-loan-rate">Годовая ставка, %</label><input class="ui-input" id="object-loan-rate" name="rate" type="number" inputmode="decimal" min="0" max="100" step="0.01" placeholder="Ставка банка" required></div><div class="object-form-field"><label class="ui-field-label" for="object-loan-years">Срок, лет</label><input class="ui-input" id="object-loan-years" name="years" type="number" inputmode="numeric" min="1" max="50" step="1" value="20" required></div></div>
  <output class="payment-result" aria-live="polite" aria-atomic="true" for="object-loan-price object-loan-deposit object-loan-rate object-loan-years">Введите годовую ставку, чтобы увидеть платёж.</output><p class="dialog-note">Равные ежемесячные платежи. Итоговые условия зависят от решения банка.</p>
 </form>`;
}

export function mapDialog(data){
 return `<p class="r-kicker">Расположение</p><h2 id="object-dialog-title">${esc(data.address)}</h2><p class="dialog-note">На сохранённой карте отмечен офис агентства. Расположение квартиры уточните у агента. Карта не интерактивная.</p>${mapImage(data.mapImage)}`;
}

export function shareDialog(url){
 return `<p class="r-kicker">Поделиться квартирой</p><h2 id="object-dialog-title">Ссылка на объект</h2><p class="dialog-note" id="object-share-note">Браузер не разрешил скопировать ссылку автоматически. Выделите её и скопируйте вручную.</p><div class="share-form"><div class="object-form-field"><label class="ui-field-label" for="object-share-url">Ссылка на страницу</label><input class="ui-input" id="object-share-url" type="url" value="${esc(url)}" readonly aria-describedby="object-share-note"></div><button type="button" class="r-button" data-copy-link>Попробовать скопировать</button><p class="share-result" role="status" aria-live="polite"></p></div>`;
}
