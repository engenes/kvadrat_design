const carouselSelector = '.r-promotions[data-promotion-carousel]';
const controlSelector = 'button[data-promotion-prev], button[data-promotion-next], button[data-promotion-dot]';
const rotationDelay = 5000;

export function mountPromotions(root = document) {
  const carousels = [...root.querySelectorAll(carouselSelector)];
  if (root.matches?.(carouselSelector)) carousels.unshift(root);

  carousels.forEach(carousel => {
    if (carousel.dataset.promotionsMounted) return;
    carousel.dataset.promotionsMounted = 'true';
    const slides = [...carousel.querySelectorAll('.promotion-slide')];
    const controls = [...carousel.querySelectorAll(controlSelector)];
    const dots = controls.filter(control => control.hasAttribute('data-promotion-dot'));
    const position = carousel.querySelector('[data-promotion-position]');
    const status = carousel.querySelector('[data-promotion-status]');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const count = slides.length;
    let current = Math.max(0, slides.findIndex(slide => !slide.hidden));
    let transition;

    controls.forEach(control => { control.hidden = count <= 1; });
    if (!count) return;

    const finishTransition = () => {
      if (!transition) return;
      const {outgoing, animations} = transition;
      transition = null;
      outgoing.hidden = true;
      outgoing.inert = false;
      outgoing.removeAttribute('aria-hidden');
      outgoing.classList.remove('is-exiting');
      animations.forEach(animation => animation.cancel());
    };
    const show = (index, announce = true) => {
      finishTransition();
      const next = ((index % count) + count) % count;
      const changed = next !== current;
      const outgoing = slides[current];
      const direction = index > current ? 1 : -1;
      current = next;
      slides.forEach((slide, index) => { slide.hidden = index !== current; });
      if (changed && !reducedMotion.matches && slides[current].animate) {
        outgoing.hidden = false;
        outgoing.inert = true;
        outgoing.setAttribute('aria-hidden', 'true');
        outgoing.classList.add('is-exiting');
        const timing = {duration: 420, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both'};
        const animations = [
          outgoing.animate([{transform: 'translateX(0)'}, {transform: `translateX(${-direction * 100}%)`}], timing),
          slides[current].animate([{transform: `translateX(${direction * 100}%)`}, {transform: 'translateX(0)'}], timing),
        ];
        const active = transition = {outgoing, animations};
        Promise.all(animations.map(animation => animation.finished)).then(() => {
          if (transition === active) finishTransition();
        }).catch(() => {});
      }
      dots.forEach(dot => dot.setAttribute('aria-current', String(Number(dot.dataset.promotionDot) === current)));
      if (position) position.textContent = `${String(current + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
      if (announce && changed && status) {
        const title = slides[current].querySelector('h3')?.textContent.trim().replace(/\s+/g, ' ');
        status.textContent = `Предложение ${current + 1} из ${count}${title ? `: ${title}` : ''}`;
      }
    };

    show(current, false);
    if (count <= 1) return;

    const rotation = carousel.querySelector('[data-promotion-rotation]');
    let paused = reducedMotion.matches;
    let hovered = carousel.matches(':hover');
    let visible = false;
    let timer;

    const updateRotation = () => {
      if (!rotation) return;
      rotation.textContent = paused ? 'Продолжить' : 'Пауза';
      rotation.setAttribute('aria-label', paused ? 'Продолжить смену предложений' : 'Приостановить смену предложений');
    };
    const schedule = () => {
      clearTimeout(timer);
      if (paused || hovered || !visible || document.hidden || !carousel.isConnected) return;
      timer = setTimeout(() => {
        if (!document.querySelector('dialog[open]')) show(current + 1, false);
        schedule();
      }, rotationDelay);
    };
    rotation?.addEventListener('click', () => {
      paused = !paused;
      updateRotation();
      schedule();
    });
    carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    carousel.addEventListener('focusin', event => {
      if (event.target === rotation) return;
      paused = true;
      updateRotation();
      schedule();
    });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        paused = true;
        finishTransition();
      }
      updateRotation();
      schedule();
    });
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(carousel);
    updateRotation();

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
      schedule();
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
      schedule();
    });
  });
}
