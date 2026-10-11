const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Find the actual crossed edge, including a fast diagonal exit between events.
function edgePoint(point, rect, previous) {
  const {width, height} = rect;
  if (previous) {
    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    const crossings = [];
    for (const [edge, t] of [
      ['left', dx < 0 ? -previous.x / dx : Infinity],
      ['right', dx > 0 ? (width - previous.x) / dx : Infinity],
      ['top', dy < 0 ? -previous.y / dy : Infinity],
      ['bottom', dy > 0 ? (height - previous.y) / dy : Infinity],
    ]) {
      const x = previous.x + dx * t;
      const y = previous.y + dy * t;
      if (t >= 0 && t <= 1 && x >= -.1 && x <= width + .1 && y >= -.1 && y <= height + .1) crossings.push({edge, x, y, t});
    }
    if (crossings.length) return crossings.sort((a, b) => a.t - b.t)[0];
  }
  const edge = [
    ['left', Math.abs(point.x)], ['right', Math.abs(width - point.x)],
    ['top', Math.abs(point.y)], ['bottom', Math.abs(height - point.y)],
  ].sort((a, b) => a[1] - b[1])[0][0];
  return {edge, x:clamp(point.x, 0, width), y:clamp(point.y, 0, height)};
}

export function mountCardGlows(root = document) {
  const cards = [...root.querySelectorAll('.agency-service,.mortgage-preview,.mortgage-topic')].filter(card => !card.dataset.glowMounted);
  if (!cards.length) return () => {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const fine = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const enabled = () => fine.matches && !reduced.matches && !forced.matches && !document.hidden;
  const active = new Set();
  const events = new AbortController();
  const states = [];
  let frame = 0;
  let lastTime = 0;

  function paint(state) {
    state.card.style.setProperty('--glow-dx', `${state.x.toFixed(3)}px`);
    state.card.style.setProperty('--glow-dy', `${state.y.toFixed(3)}px`);
  }
  function reset(state) {
    active.delete(state);
    state.inside = false;
    state.visible = false;
    state.x = state.y = state.tx = state.ty = 0;
    for (const prop of ['--glow-dx', '--glow-dy', '--glow-opacity']) state.card.style.removeProperty(prop);
    delete state.card.dataset.glowMoving;
  }
  function resetAll() {
    cancelAnimationFrame(frame);
    frame = 0;
    states.forEach(reset);
  }
  function tick(now) {
    const elapsed = Math.min(64, now - lastTime);
    lastTime = now;
    for (const state of active) {
      const duration = state.inside ? 240 : state.transient ? 380 : 460;
      const blend = -Math.expm1(-elapsed / duration);
      state.x += (state.tx - state.x) * blend;
      state.y += (state.ty - state.y) * blend;
      const settled = Math.hypot(state.tx - state.x, state.ty - state.y) < .15;
      if (settled) {
        state.x = state.tx;
        state.y = state.ty;
      }
      paint(state);
      if (settled) {
        active.delete(state);
        delete state.card.dataset.glowMoving;
        if (!state.inside) reset(state);
      }
    }
    frame = active.size ? requestAnimationFrame(tick) : 0;
  }
  function animate(state) {
    active.add(state);
    state.card.dataset.glowMoving = '';
    if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  function coordinates(state, event) {
    state.rect = state.card.getBoundingClientRect();
    return {x:event.clientX - state.rect.left, y:event.clientY - state.rect.top};
  }
  function target(state, point) {
    state.tx = point.x - state.rect.width * state.homeX;
    state.ty = point.y - state.rect.height * state.homeY;
  }
  function outside(state, crossing) {
    // The final color stop is 78% of the ellipse radius; move it fully out of view.
    const rx = state.rect.width * state.radiusX * .78 + 4;
    const ry = state.rect.height * state.radiusY * .78 + 4;
    return {
      x:crossing.edge === 'left' ? -rx : crossing.edge === 'right' ? state.rect.width + rx : crossing.x,
      y:crossing.edge === 'top' ? -ry : crossing.edge === 'bottom' ? state.rect.height + ry : crossing.y,
    };
  }
  function scroll() {
    for (const state of states) {
      if (!state.inside) continue;
      const previous = state.pointer;
      const point = coordinates(state, state.client);
      if (point.x >= 0 && point.x <= state.rect.width && point.y >= 0 && point.y <= state.rect.height) {
        state.pointer = point;
        target(state, point);
      } else {
        state.inside = false;
        if (state.transient) target(state, outside(state, edgePoint(point, state.rect, previous)));
        else state.tx = state.ty = 0;
      }
      animate(state);
    }
  }
  for (const card of cards) {
    const css = getComputedStyle(card);
    const state = {card, transient:card.matches('.mortgage-topic'), inside:false, visible:false, x:0, y:0, tx:0, ty:0,
      homeX:parseFloat(css.getPropertyValue('--glow-home-x')) / 100,
      homeY:parseFloat(css.getPropertyValue('--glow-home-y')) / 100,
      radiusX:parseFloat(css.getPropertyValue('--glow-width')) / 200,
      radiusY:parseFloat(css.getPropertyValue('--glow-height')) / 200};
    states.push(state);
    card.dataset.glowMounted = 'true';
    const move = event => {
      if (event.pointerType !== 'mouse' || !enabled()) return;
      const point = coordinates(state, event);
      if (state.transient && !state.visible) {
        target(state, outside(state, edgePoint(point, state.rect)));
        state.x = state.tx;
        state.y = state.ty;
        paint(state);
        card.style.setProperty('--glow-opacity', '1');
      }
      state.visible = true;
      state.inside = true;
      state.pointer = point;
      state.client = {clientX:event.clientX, clientY:event.clientY};
      target(state, {x:clamp(point.x, 0, state.rect.width), y:clamp(point.y, 0, state.rect.height)});
      animate(state);
    };
    const leave = event => {
      if (event.pointerType !== 'mouse' || !state.inside) return;
      const point = coordinates(state, event);
      state.inside = false;
      if (state.transient) target(state, outside(state, edgePoint(point, state.rect, state.pointer)));
      else state.tx = state.ty = 0;
      animate(state);
    };
    card.addEventListener('pointerenter', move, {signal:events.signal, passive:true});
    card.addEventListener('pointermove', move, {signal:events.signal, passive:true});
    card.addEventListener('pointerleave', leave, {signal:events.signal, passive:true});
    card.addEventListener('pointercancel', () => reset(state), {signal:events.signal});
  }
  for (const query of [reduced, forced, fine]) query.addEventListener('change', resetAll, {signal:events.signal});
  document.addEventListener('visibilitychange', resetAll, {signal:events.signal});
  window.addEventListener('blur', resetAll, {signal:events.signal});
  window.addEventListener('resize', resetAll, {signal:events.signal});
  // Keep the same light position while scrolling changes the card's position under the cursor.
  window.addEventListener('scroll', scroll, {signal:events.signal, passive:true, capture:true});
  return () => {
    resetAll();
    events.abort();
    cards.forEach(card => delete card.dataset.glowMounted);
  };
}
