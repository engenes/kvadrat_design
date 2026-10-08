import {companyStories} from './company-stories.js';
import {esc, image} from './ui.js';

const number = value => String(value).padStart(2, '0');
const dateLabel = value => new Intl.DateTimeFormat('ru-RU', {day: 'numeric', month: 'long', timeZone: 'UTC'}).format(new Date(`${value}T12:00:00Z`));
const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

export function mountCompany(root = document) {
  root.querySelectorAll('[data-company-rail]').forEach(rail => {
    if (rail.dataset.companyMounted) return;
    rail.dataset.companyMounted = 'true';
    const section = rail.closest('section') || rail.parentElement;
    const cards = [...rail.querySelectorAll('[data-company-story]')];
    const prev = section.querySelector('[data-company-prev]');
    const next = section.querySelector('[data-company-next]');
    const position = section.querySelector('[data-company-position]');
    const cardOffsets = () => {
      const start = cards[0]?.getBoundingClientRect().left ?? 0;
      return cards.map(card => card.getBoundingClientRect().left - start);
    };
    const maximum = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
    let frame;

    const update = () => {
      const left = rail.scrollLeft;
      const max = maximum();
      if (prev) prev.disabled = left <= 2;
      if (next) next.disabled = left >= max - 2;
      const offsets = cardOffsets();
      const first = offsets.reduce((nearest, offset, index) => Math.abs(offset - left) < Math.abs(offsets[nearest] - left) ? index : nearest, cards.length ? 0 : -1);
      const last = cards.reduce((visible, card, index) => offsets[index] + card.offsetWidth <= left + rail.clientWidth + 2 ? index : visible, first);
      if (position) {
        position.textContent = `${number(first + 1)}${last > first ? `–${number(last + 1)}` : ''} / ${number(cards.length)}`;
        position.setAttribute('aria-label', last > first ? `Истории с ${first + 1} по ${last + 1} из ${cards.length}` : `История ${first + 1} из ${cards.length}`);
      }
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const advance = direction => {
      const left = rail.scrollLeft;
      const anchors = cardOffsets().map(offset => Math.min(maximum(), Math.max(0, offset)));
      const target = direction > 0
        ? anchors.find(anchor => anchor > left + 2) ?? maximum()
        : anchors.filter(anchor => anchor < left - 2).at(-1) ?? 0;
      rail.scrollTo({left: target, behavior: motion()});
    };

    prev?.addEventListener('click', () => advance(-1));
    next?.addEventListener('click', () => advance(1));
    rail.addEventListener('scroll', scheduleUpdate, {passive: true});
    rail.addEventListener('focusin', event => {
      const card = event.target.closest('[data-company-story]');
      if (card) card.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: 'instant'});
    });
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(rail);
    cards.forEach(card => observer.observe(card));
    update();
  });

  const dialog = root.querySelector('#company-dialog');
  const content = dialog?.querySelector('#company-story-content');
  if (!dialog || !content || dialog.dataset.companyMounted) return;
  dialog.dataset.companyMounted = 'true';
  const prev = dialog.querySelector('[data-story-prev]');
  const next = dialog.querySelector('[data-story-next]');
  const position = dialog.querySelector('[data-story-position]');
  const progress = dialog.querySelector('[data-story-progress]');
  let current = 0;
  let opener;
  let bodyOverflow;

  const restoreScroll = () => {
    if (!bodyOverflow || document.querySelector('dialog[open]')) return;
    if (bodyOverflow.value) document.body.style.setProperty('overflow', bodyOverflow.value, bodyOverflow.priority);
    else document.body.style.removeProperty('overflow');
    bodyOverflow = undefined;
  };
  // If another native dialog is above this one, retain the lock until it closes.
  document.addEventListener('close', restoreScroll, true);

  const show = (index, focusTitle = false) => {
    if (!Number.isInteger(index) || !companyStories[index]) return;
    current = index;
    const story = companyStories[current];
    const visual = story.cover
      ? image(story.cover, story.coverAlt || '', '', 'decoding="async"')
      : `<span class="company-story-symbol" aria-hidden="true">${story.tone === 'blue' ? 'Аа' : '«'}</span>`;
    content.innerHTML = `<div class="company-story-layout"><div class="company-story-image company-story-image--${esc(story.tone)}">${visual}<span class="company-story-image-label">Квадрат · изнутри</span></div><div class="company-story-copy"><p class="r-kicker">${esc(story.category)}</p><h2 id="company-story-title" tabindex="-1">${esc(story.title)}</h2><p class="company-story-meta">${story.date ? `${esc(dateLabel(story.date))} · ` : ''}${esc(story.readTime)} чтения</p><div class="company-story-prose">${story.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</div><p class="company-story-demo">Фотографии из материалов агентства. Советы — редакционные.</p></div></div>`;
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === companyStories.length - 1;
    if (position) {
      position.textContent = `${number(current + 1)} / ${number(companyStories.length)}`;
      position.setAttribute('aria-label', `История ${current + 1} из ${companyStories.length}`);
    }
    if (progress) progress.innerHTML = companyStories.map((_, index) => `<span class="${index <= current ? 'is-read' : ''}${index === current ? ' is-current' : ''}" aria-hidden="true"></span>`).join('');
    content.scrollTop = 0;
    dialog.scrollTop = 0;
    if (focusTitle) content.querySelector('h2').focus({preventScroll: true});
  };
  const open = (index, trigger) => {
    if (!Number.isInteger(index) || !companyStories[index]) return;
    opener = trigger;
    show(index);
    if (!dialog.open) {
      bodyOverflow = {value: document.body.style.getPropertyValue('overflow'), priority: document.body.style.getPropertyPriority('overflow')};
      document.body.style.setProperty('overflow', 'hidden');
      dialog.showModal();
    }
    content.querySelector('h2').focus({preventScroll: true});
  };

  root.addEventListener('click', event => {
    const trigger = event.target.closest('[data-company-story], [data-open-company]');
    if (!trigger || event.defaultPrevented || trigger.disabled) return;
    const index = Number(trigger.dataset.companyStory ?? trigger.dataset.openCompany);
    if (!Number.isInteger(index) || !companyStories[index]) return;
    event.preventDefault();
    open(index, trigger);
  });
  dialog.querySelector('[data-company-close]')?.addEventListener('click', () => dialog.close());
  prev?.addEventListener('click', () => show(current - 1, true));
  next?.addEventListener('click', () => show(current + 1, true));
  dialog.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    restoreScroll();
    if (opener?.isConnected && !document.querySelector('dialog[open]')) opener.focus({preventScroll: true});
  });
}
