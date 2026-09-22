import { escapeHtml as e } from './html.js';

let sequence = 0;
const chevron = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const check = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 8 2.5 2.5L12 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Keep the native control as the form value and progressive fallback.
export function enhanceSelect(select, { compact = false } = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  const id = `kv-select-${++sequence}`;
  const labels = [...select.labels];
  const originalLabelTargets = labels.map(label => label.getAttribute('for'));
  const originalHidden = select.hidden;
  const labelText = select.getAttribute('aria-label') || labels.map(label => {
    const copy = label.cloneNode(true);
    copy.querySelectorAll('select').forEach(node => node.remove());
    return copy.textContent.trim();
  }).join(' ');
  const root = document.createElement('span');
  root.className = `kv-select${compact ? ' kv-select--compact' : ''}`;
  root.innerHTML = `<span class="kv-select__surface"><button type="button" class="kv-select__trigger" id="${id}" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list" aria-label="${e(labelText)}"><span class="kv-select__value"></span><span class="kv-select__chevron">${chevron}</span></button><span class="kv-select__panel" hidden><span class="kv-select__list" id="${id}-list" role="listbox" aria-label="${e(labelText)}"></span></span></span>`;
  select.before(root);
  root.prepend(select);
  select.hidden = true;
  labels.forEach(label => label.htmlFor = id);
  const trigger = root.querySelector('button');
  const surface = root.querySelector('.kv-select__surface');
  const panel = root.querySelector('.kv-select__panel');
  const list = root.querySelector('[role="listbox"]');
  const value = root.querySelector('.kv-select__value');
  let active = -1;
  let opened = false;
  let typed = '';
  let typedAt = 0;
  const enabled = () => [...select.options].map((option, index) => ({ option, index })).filter(({ option }) => !option.hidden && !option.disabled).map(({ index }) => index);

  function sync() {
    value.textContent = select.selectedOptions[0]?.textContent || '';
    trigger.disabled = select.disabled;
    trigger.classList.toggle('is-placeholder', select.value === '');
    root.classList.toggle('is-disabled', select.disabled);
    root.classList.toggle('is-invalid', select.getAttribute('aria-invalid') === 'true');
    for (const attribute of ['aria-describedby', 'aria-invalid', 'aria-labelledby']) {
      if (select.hasAttribute(attribute)) trigger.setAttribute(attribute, select.getAttribute(attribute));
      else trigger.removeAttribute(attribute);
    }
    trigger.setAttribute('aria-required', String(select.required));
    list.innerHTML = [...select.options].map((option, index) => option.hidden ? '' : `<span id="${id}-option-${index}" class="kv-select__option" role="option" aria-selected="${index === select.selectedIndex}" ${option.disabled ? 'aria-disabled="true"' : ''} data-index="${index}"><span class="kv-select__option-copy"><span>${e(option.textContent)}</span>${option.dataset.description ? `<small>${e(option.dataset.description)}</small>` : ''}</span><span class="kv-select__check">${check}</span></span>`).join('');
    if (select.disabled) close();
  }

  function highlight(index, scroll = true) {
    active = index;
    list.querySelectorAll('[role="option"]').forEach(option => option.classList.toggle('is-active', Number(option.dataset.index) === active));
    const option = document.getElementById(`${id}-option-${active}`);
    if (!option) return;
    trigger.setAttribute('aria-activedescendant', option.id);
    if (scroll) {
      const top = option.offsetTop;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (top + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + option.offsetHeight - list.clientHeight;
    }
  }

  function open() {
    if (opened || select.disabled || !enabled().length) return;
    opened = true;
    panel.hidden = false;
    root.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    highlight(enabled().includes(select.selectedIndex) ? select.selectedIndex : enabled()[0]);
    // Preserve the joined downward surface, including near the viewport edge.
    const bounds = surface.getBoundingClientRect();
    if (bounds.bottom > window.innerHeight - 16 || bounds.top < 16) surface.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }

  function close() {
    opened = false;
    panel.hidden = true;
    root.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    typed = '';
  }

  function commit() {
    const changed = active >= 0 && select.selectedIndex !== active;
    if (active >= 0) select.selectedIndex = active;
    close();
    sync();
    if (changed) {
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  trigger.addEventListener('click', () => opened ? close() : open(), { signal });
  trigger.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.isComposing) return;
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp', 'Enter', ' ', 'Escape'];
    if (keys.includes(event.key)) event.preventDefault();
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Tab') { if (opened) commit(); return; }
    if (event.key === 'Enter' || (event.key === ' ' && (!typed || Date.now() - typedAt > 700))) { if (opened) commit(); else open(); return; }
    if (event.altKey && event.key === 'ArrowUp') { if (opened) commit(); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(event.key)) {
      const wasOpen = opened;
      open();
      const indices = enabled();
      if (!indices.length) return;
      let position = indices.indexOf(active);
      if (event.key === 'Home') position = 0;
      else if (event.key === 'End') position = indices.length - 1;
      else if (wasOpen && !event.altKey) position += ({ ArrowDown: 1, ArrowUp: -1, PageDown: 10, PageUp: -10 })[event.key];
      highlight(indices[Math.max(0, Math.min(indices.length - 1, position))]);
      return;
    }
    if (event.key.length === 1 && !event.altKey) {
      event.preventDefault();
      open();
      const now = Date.now();
      typed = now - typedAt > 700 ? event.key : typed + event.key;
      typedAt = now;
      const query = [...typed].every(char => char === typed[0]) ? typed[0] : typed;
      const indices = enabled();
      const start = query.length === 1 ? indices.indexOf(active) + 1 : 0;
      const ordered = [...indices.slice(start), ...indices.slice(0, start)];
      const match = ordered.find(index => select.options[index].textContent.trim().toLocaleLowerCase('ru').startsWith(query.toLocaleLowerCase('ru')));
      if (match !== undefined) highlight(match);
    }
  }, { signal });
  list.addEventListener('pointerdown', event => event.preventDefault(), { signal });
  list.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const option = event.target.closest('[data-index]');
    if (option && option.getAttribute('aria-disabled') !== 'true') highlight(Number(option.dataset.index), false);
  }, { signal });
  list.addEventListener('click', event => {
    const option = event.target.closest('[data-index]');
    if (!option || option.getAttribute('aria-disabled') === 'true') return;
    event.preventDefault(); // Do not let a wrapping label activate the trigger again.
    active = Number(option.dataset.index);
    commit();
    if (trigger.isConnected) trigger.focus({ preventScroll: true });
  }, { signal });
  document.addEventListener('pointerdown', event => { if (opened && !root.contains(event.target)) close(); }, { signal });
  root.addEventListener('focusout', event => { if (opened && !root.contains(event.relatedTarget)) close(); }, { signal });
  select.addEventListener('change', sync, { signal });
  select.addEventListener('invalid', event => {
    event.preventDefault();
    select.setAttribute('aria-invalid', 'true');
    sync();
    trigger.focus();
    open();
  }, { signal });
  select.form?.addEventListener('reset', () => queueMicrotask(() => { if (!signal.aborted) { close(); sync(); } }), { signal });
  sync();
  return () => {
    controller.abort();
    root.replaceWith(select);
    select.hidden = originalHidden;
    labels.forEach((label, index) => originalLabelTargets[index] === null ? label.removeAttribute('for') : label.setAttribute('for', originalLabelTargets[index]));
  };
}
