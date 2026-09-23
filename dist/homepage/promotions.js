const carouselSelector = '.r-promotions[data-promotion-carousel]';
const controlSelector = 'button[data-promotion-prev], button[data-promotion-next], button[data-promotion-dot]';

export function mountPromotions(root = document) {
  const carousels = [...root.querySelectorAll(carouselSelector)];
  if (root.matches?.(carouselSelector)) carousels.unshift(root);

  carousels.forEach(carousel => {
    const slides = [...carousel.querySelectorAll('.promotion-slide')];
    const controls = [...carousel.querySelectorAll(controlSelector)];
    const dots = controls.filter(control => control.hasAttribute('data-promotion-dot'));
    const position = carousel.querySelector('[data-promotion-position]');
    const status = carousel.querySelector('[data-promotion-status]');
    const count = slides.length;
    let current = Math.max(0, slides.findIndex(slide => !slide.hidden));

    controls.forEach(control => { control.hidden = count <= 1; });
    if (!count) return;

    const show = (index, announce = true) => {
      const next = ((index % count) + count) % count;
      const changed = next !== current;
      current = next;
      slides.forEach((slide, index) => { slide.hidden = index !== current; });
      dots.forEach(dot => dot.setAttribute('aria-current', String(Number(dot.dataset.promotionDot) === current)));
      if (position) position.textContent = `${String(current + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
      if (announce && changed && status) {
        const title = slides[current].querySelector('h3')?.textContent.trim().replace(/\s+/g, ' ');
        status.textContent = `Предложение ${current + 1} из ${count}${title ? `: ${title}` : ''}`;
      }
    };

    show(current, false);
    if (count <= 1) return;

    const getControl = event => {
      const control = event.target.closest?.(controlSelector);
      return control?.closest(carouselSelector) === carousel && !control.disabled ? control : null;
    };

    carousel.addEventListener('click', event => {
      const control = getControl(event);
      if (!control || event.defaultPrevented) return;
      event.preventDefault();
      if (control.hasAttribute('data-promotion-prev')) show(current - 1);
      else if (control.hasAttribute('data-promotion-next')) show(current + 1);
      else {
        const index = Number(control.dataset.promotionDot);
        if (Number.isInteger(index) && index >= 0 && index < count) show(index);
      }
    });

    carousel.addEventListener('keydown', event => {
      if (!getControl(event) || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      const index = {
        ArrowLeft: current - 1,
        ArrowRight: current + 1,
        Home: 0,
        End: count - 1,
      }[event.key];
      if (index === undefined) return;
      event.preventDefault();
      show(index);
    });
  });
}
