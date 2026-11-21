/* Drag-to-explore widgets for three missions. Exploration only: nothing here writes
 * game progress or touches the mission's answer fields. */
window.HandsOn = (() => {
  'use strict';

  const IDS = ['q18', 'q21', 'q24'];
  const DEFAULTS = {
    q18: { v: [4, 2], u: [1, 1] },
    q21: { ys: [1, 2, 2] },
    q24: { m: [3, 1, 0, 2] }
  };
  const NOTE = 'Explore here, then enter the exact values above. Nothing in this panel is scored.';

  /* ---------- pure math (exported as HandsOn.math) ---------- */

  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const len = a => Math.hypot(a[0], a[1]);
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const scale = (a, k) => [a[0] * k, a[1] * k];
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

  /* Angle between two vectors in degrees, 0..180. NaN if either has no length. */
  function angleDeg(a, b) {
    const n = len(a) * len(b);
    if (n < 1e-12) return NaN;
    return Math.acos(clamp(dot(a, b) / n, -1, 1)) * 180 / Math.PI;
  }

  /* Angle between the LINES through two vectors, 0..90 (0 means same line). */
  function lineAngleDeg(a, b) {
    const t = angleDeg(a, b);
    return Number.isNaN(t) ? NaN : Math.min(t, 180 - t);
  }

  /* The s that makes s*u the orthogonal projection of v onto span(u): s = (v.u)/(u.u). */
  const projectionScalar = (v, u) => dot(v, u) / dot(u, u);
  const projection = (v, u) => scale(u, projectionScalar(v, u));

  /* Largest "nice" number (1, 2 or 5 times a power of ten) that is <= x. */
  function niceStep(x) {
    if (!(x > 0)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(x)));
    const f = x / p;
    return (f >= 5 ? 5 : f >= 2 ? 2 : 1) * p;
  }

  /* 2x2 matrix m = [a, b, c, d] (row-major) times a vector. */
  const apply = (m, v) => [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
  const unit = deg => [Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180)];

  /* Largest stretch A applies to any unit vector: sqrt of the top eigenvalue of A^T A. */
  function maxStretch(m) {
    const p = m[0] * m[0] + m[2] * m[2];
    const q = m[0] * m[1] + m[2] * m[3];
    const r = m[1] * m[1] + m[3] * m[3];
    return Math.sqrt((p + r) / 2 + Math.hypot((p - r) / 2, q));
  }

  /* Directions (degrees in [0,180)) that A keeps on their own line.
   * v = (cos t, sin t) is such a direction when v x Av = 0, i.e.
   *   c cos^2 + (d - a) cos sin - b sin^2 = 0.
   * Returns null when every direction qualifies (A is a multiple of I). */
  function eigenAngles(m) {
    const [a, b, c, d] = m;
    const k = d - a;
    const out = [];
    const push = deg => {
      const t = ((deg % 180) + 180) % 180;
      if (!out.some(x => Math.abs(x - t) < 1e-9)) out.push(t);
    };
    if (Math.abs(b) < 1e-12) {
      if (Math.abs(k) < 1e-12 && Math.abs(c) < 1e-12) return null;
      push(90); // cos = 0 solves the equation when b = 0
      if (Math.abs(k) > 1e-12) push(Math.atan(-c / k) * 180 / Math.PI);
    } else {
      // divide by cos^2: b tan^2 - (d - a) tan - c = 0
      const disc = k * k + 4 * b * c;
      if (disc < 0) return [];
      const root = Math.sqrt(disc);
      push(Math.atan((k + root) / (2 * b)) * 180 / Math.PI);
      push(Math.atan((k - root) / (2 * b)) * 180 / Math.PI);
    }
    return out.sort((x, y) => x - y);
  }

  /* Signed stretch along a unit direction: (Av).v */
  const stretchFactor = (m, deg) => dot(apply(m, unit(deg)), unit(deg));

  /* Is this whole-degree direction an eigen-direction, as closely as a 1 degree dial allows? */
  function isEigenDirection(m, deg) {
    const v = unit(deg);
    const w = apply(m, v);
    if (len(w) < 1e-9) return true; // A sends v to zero: factor 0
    if (lineAngleDeg(v, w) <= 1) return true;
    const angles = eigenAngles(m);
    if (angles === null) return true;
    const t = ((deg % 180) + 180) % 180;
    return angles.some(x => Math.min(Math.abs(x - t), 180 - Math.abs(x - t)) <= 0.5 + 1e-9);
  }

  /* Least squares for samples at times 0, 1, 2. */
  const residuals = (ys, a, b) => ys.map((y, t) => y - (a + b * t));
  const sse = (ys, a, b) => residuals(ys, a, b).reduce((s, r) => s + r * r, 0);
  function bestFit(ys) {
    const mean = (ys[0] + ys[1] + ys[2]) / 3;
    const b = (ys[2] - ys[0]) / 2; // sum((t-1)(y-mean)) / sum((t-1)^2)
    const a = mean - b;            // the line passes through (1, mean)
    return { a, b, sse: sse(ys, a, b) };
  }

  const math = {
    dot, len, angleDeg, lineAngleDeg, projectionScalar, projection, niceStep, apply, unit,
    maxStretch, eigenAngles, stretchFactor, isEigenDirection, residuals, sse, bestFit
  };

  /* ---------- formatting and small DOM helpers ---------- */

  function fmt(n, digits = 2) {
    const x = Number(n.toFixed(digits));
    return String(x === 0 ? 0 : x); // also turns -0 into 0
  }
  const vec = (v, digits) => '(' + v.map(x => fmt(x, digits)).join(', ') + ')';
  const esc = s => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const num = n => fmt(n, 3); // numbers written into SVG attributes

  const finiteList = (x, n) => Array.isArray(x) && x.length === n && x.every(Number.isFinite);

  /* Validated parameters, falling back to the defaults for anything malformed. */
  function paramsFor(q) {
    const p = (q && q.params) || {};
    const d = DEFAULTS[q.id];
    if (q.id === 'q18') {
      const ok = finiteList(p.v, 2) && finiteList(p.u, 2) && len(p.u) > 1e-9;
      return ok ? { v: [...p.v], u: [...p.u] } : d;
    }
    if (q.id === 'q21') return finiteList(p.ys, 3) ? { ys: [...p.ys] } : d;
    return finiteList(p.m, 4) ? { m: [...p.m] } : d;
  }

  const supported = id => IDS.includes(id);

  /* One labelled slider with - and + nudge buttons. */
  function sliderRow(id, name, label, min, max, step, value) {
    const inputId = `hands-on-${id}-${name}`;
    return `
      <div class="hands-on-control">
        <label for="${esc(inputId)}">${esc(label)}: <span class="hands-on-value" data-out="${esc(name)}"></span></label>
        <div class="hands-on-row">
          <button type="button" class="hands-on-nudge" data-nudge="${esc(name)}" data-dir="-1" aria-label="Decrease ${esc(label)} by one step">&minus;</button>
          <input type="range" id="${esc(inputId)}" data-slider="${esc(name)}" min="${esc(min)}" max="${esc(max)}" step="${esc(step)}" value="${esc(value)}">
          <button type="button" class="hands-on-nudge" data-nudge="${esc(name)}" data-dir="1" aria-label="Increase ${esc(label)} by one step">+</button>
        </div>
      </div>`;
  }

  const tile = (key, label) =>
    `<div><b>${esc(label)}</b><span data-read="${esc(key)}"></span></div>`;

  function frame(id, title, lead, svg, readings, controls, extra = '') {
    return `
<section class="hands-on" data-hands-on="${esc(id)}" aria-label="${esc(title)}">
  <p class="hands-on-eyebrow">HANDS-ON</p>
  <h3>${esc(title)}</h3>
  <p class="hands-on-lead">${lead}</p>
  <div class="hands-on-scene">${svg}</div>
  <div class="hands-on-readings" aria-hidden="true">${readings}</div>
  <p class="hands-on-status" role="status" aria-live="polite">Move a control to begin.</p>
  <div class="hands-on-controls">${controls}</div>
  ${extra}
  <p class="hands-on-note">${esc(NOTE)}</p>
</section>`;
  }

  /* ---------- plane geometry shared by q18 and q24 ---------- */

  const SIZE = 320;       // viewBox is SIZE x SIZE user units
  const HALF = SIZE / 2;
  const REACH = 148;      // user units from the centre to the edge of the drawn plane

  /* World (x, y) -> SVG user units, y up; half is the world distance shown from centre to edge. */
  const toScreen = (p, half) => [HALF + p[0] * REACH / half, HALF - p[1] * REACH / half];
  const toWorld = (s, half) => [(s[0] - HALF) * half / REACH, (HALF - s[1]) * half / REACH];

  /* Grid, axes and tick labels for a square plane centred on the origin. */
  function planeBackdrop(half) {
    const tick = niceStep(half / 2.5);
    const parts = [];
    const labels = [];
    for (let k = Math.ceil(-half / tick); k <= Math.floor(half / tick); k++) {
      if (k === 0) continue;
      const w = k * tick;
      const [x] = toScreen([w, 0], half);
      const [, y] = toScreen([0, w], half);
      parts.push(`<line class="hands-on-grid" x1="${num(x)}" y1="12" x2="${num(x)}" y2="${SIZE - 12}"/>`);
      parts.push(`<line class="hands-on-grid" x1="12" y1="${num(y)}" x2="${SIZE - 12}" y2="${num(y)}"/>`);
      labels.push(`<text class="hands-on-tick" x="${num(x)}" y="${HALF + 13}" text-anchor="middle">${esc(fmt(w))}</text>`);
      labels.push(`<text class="hands-on-tick" x="${HALF - 5}" y="${num(y + 3.5)}" text-anchor="end">${esc(fmt(w))}</text>`);
    }
    return parts.join('') +
      `<line class="hands-on-axis" x1="12" y1="${HALF}" x2="${SIZE - 12}" y2="${HALF}"/>` +
      `<line class="hands-on-axis" x1="${HALF}" y1="12" x2="${HALF}" y2="${SIZE - 12}"/>` +
      labels.join('');
  }

  /* Arrow from (x1,y1) to (x2,y2): a shaft that stops at the base of a triangular head. */
  function arrowGeometry(from, to, head = 10) {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const L = Math.hypot(dx, dy);
    if (L < 1e-6) return { shaft: [from[0], from[1], from[0], from[1]], head: '' };
    const h = Math.min(head, L);
    const ux = dx / L;
    const uy = dy / L;
    const bx = to[0] - ux * h;
    const by = to[1] - uy * h;
    const w = h * 0.45;
    return {
      shaft: [from[0], from[1], bx, by],
      head: [[to[0], to[1]], [bx - uy * w, by + ux * w], [bx + uy * w, by - ux * w]]
        .map(p => num(p[0]) + ',' + num(p[1])).join(' ')
    };
  }
  const arrowMarkup = (cls, key) =>
    `<g class="hands-on-arrow ${esc(cls)}" data-el="${esc(key)}"><line/><polygon/></g>`;
  function setArrow(group, from, to) {
    const g = arrowGeometry(from, to);
    const line = group.querySelector('line');
    ['x1', 'y1', 'x2', 'y2'].forEach((a, i) => line.setAttribute(a, num(g.shaft[i])));
    group.querySelector('polygon').setAttribute('points', g.head);
  }
  function setLine(line, a, b) {
    line.setAttribute('x1', num(a[0]));
    line.setAttribute('y1', num(a[1]));
    line.setAttribute('x2', num(b[0]));
    line.setAttribute('y2', num(b[1]));
  }
  function setAt(el, p, dx = 0, dy = 0) {
    el.setAttribute('x', num(clamp(p[0] + dx, 14, SIZE - 14)));
    el.setAttribute('y', num(clamp(p[1] + dy, 16, SIZE - 8)));
  }
  /* A draggable handle: a big invisible hit circle (touch target) around a visible dot. */
  const handleMarkup = key =>
    `<g class="hands-on-handle" data-el="${esc(key)}"><circle class="hands-on-hit" r="24"/><circle class="hands-on-dot" r="7"/></g>`;
  const moveHandle = (g, p) => g.setAttribute('transform', `translate(${num(p[0])} ${num(p[1])})`);

  /* ---------- wiring helpers ---------- */

  /* Everything a widget needs from its section, with listeners tracked for destroy(). */
  function wiring(section) {
    const listeners = [];
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      listeners.push([target, type, fn, opts]);
    };
    const el = key => section.querySelector(`[data-el="${key}"]`);
    const read = key => section.querySelector(`[data-read="${key}"]`);
    const out = key => section.querySelector(`[data-out="${key}"]`);
    const slider = key => section.querySelector(`[data-slider="${key}"]`);
    const svg = section.querySelector('svg');
    const status = section.querySelector('.hands-on-status');

    const get = key => parseFloat(slider(key).value);
    /* Setting .value lets the browser clamp and snap to the slider's own min/max/step. */
    const set = (key, x) => { slider(key).value = String(Number(x.toFixed(6))); };

    function say(text) {
      if (status.textContent !== text) status.textContent = text;
      svg.setAttribute('aria-label', text);
    }

    /* Pointer position in SVG user units (the SVG scales with its width). */
    function svgPoint(e) {
      const r = svg.getBoundingClientRect();
      const box = svg.viewBox.baseVal;
      return [(e.clientX - r.left) * box.width / r.width, (e.clientY - r.top) * box.height / r.height];
    }

    /* Drag with pointer capture, so no window-level listeners are needed. */
    function draggable(handle, onMove) {
      let active = null;
      on(handle, 'pointerdown', e => {
        active = e.pointerId;
        try { handle.setPointerCapture(e.pointerId); } catch (err) { /* older WebView */ }
        handle.classList.add('is-dragging');
        e.preventDefault();
        onMove(svgPoint(e));
      });
      on(handle, 'pointermove', e => {
        if (e.pointerId !== active) return;
        e.preventDefault();
        onMove(svgPoint(e));
      });
      const end = e => {
        if (e.pointerId !== active) return;
        active = null;
        handle.classList.remove('is-dragging');
      };
      on(handle, 'pointerup', end);
      on(handle, 'pointercancel', end);
      on(handle, 'lostpointercapture', end);
    }

    /* Sliders and their nudge buttons all funnel into one update(). */
    function controls(update) {
      section.querySelectorAll('[data-slider]').forEach(input => on(input, 'input', update));
      section.querySelectorAll('[data-nudge]').forEach(button => on(button, 'click', () => {
        const key = button.dataset.nudge;
        set(key, get(key) + Number(button.dataset.dir) * parseFloat(slider(key).step));
        update();
      }));
    }

    function destroy() {
      listeners.forEach(([target, type, fn, opts]) => target.removeEventListener(type, fn, opts));
      listeners.length = 0;
    }
    return { on, el, read, out, slider, svg, say, get, set, draggable, controls, destroy };
  }

  /* ---------- q18: orthogonal projection ---------- */

  function setup18(q) {
    const { v, u } = paramsFor(q);
    const reach = Math.max(1.1 * len(v), 1);       // how far along the line P may travel
    const half = reach * 1.15;                     // world half-width of the picture
    const step = niceStep(0.05 / len(u));          // one step moves P about 0.05 units
    const max = Math.ceil(reach / len(u) / step) * step;
    const target = projectionScalar(v, u);
    // Start at the origin unless that already is the foot of the perpendicular.
    let start = 0;
    if (Math.abs(target) <= Math.max(step, 0.15 * max)) {
      start = Math.round(0.6 * max / step) * step * (target > 0 ? -1 : 1);
    }
    return { v, u, half, step, max, start, target };
  }

  function html18(q) {
    const c = setup18(q);
    const edge = scale(c.u, 3 * c.half / len(c.u)); // far enough that the line is clipped by the frame
    const a = toScreen(edge, c.half);
    const b = toScreen(scale(edge, -1), c.half);
    const tip = toScreen(c.v, c.half);
    const arrow = arrowGeometry([HALF, HALF], tip);
    const svg = `
      <svg viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Plane with the vector v, the line along u and your point P.">
        <defs><clipPath id="hands-on-clip-q18"><rect x="6" y="6" width="${SIZE - 12}" height="${SIZE - 12}"/></clipPath></defs>
        ${planeBackdrop(c.half)}
        <g clip-path="url(#hands-on-clip-q18)">
          <line class="hands-on-span" x1="${num(a[0])}" y1="${num(a[1])}" x2="${num(b[0])}" y2="${num(b[1])}"/>
          <line class="hands-on-link" data-el="link"/>
          <polyline class="hands-on-corner" data-el="corner" points=""/>
          <g class="hands-on-arrow hands-on-v">
            <line x1="${num(arrow.shaft[0])}" y1="${num(arrow.shaft[1])}" x2="${num(arrow.shaft[2])}" y2="${num(arrow.shaft[3])}"/>
            <polygon points="${arrow.head}"/>
          </g>
        </g>
        <text class="hands-on-label hands-on-v-label" x="${num(clamp(tip[0] + 8, 14, SIZE - 14))}" y="${num(clamp(tip[1] - 8, 16, SIZE - 8))}">v</text>
        <text class="hands-on-label hands-on-p-label" data-el="p-label">P</text>
        ${handleMarkup('p')}
      </svg>`;
    const lead = `The arrow is <b>v = ${esc(vec(c.v))}</b>. The pale line holds every multiple of <b>u = ${esc(vec(c.u))}</b>. ` +
      'Slide <b>P = s·u</b> along the line until the dashed segment from P to the tip of v meets the line at a right angle.';
    const readings = tile('p', 'Your point P') + tile('s', 's') + tile('angle', 'Angle at P');
    const controls = sliderRow('q18', 's', 'Multiplier s', -c.max, c.max, c.step, c.start);
    return frame('q18', 'Find the foot of the perpendicular', lead, svg, readings, controls);
  }

  function mount18(section, q) {
    const c = setup18(q);
    const w = wiring(section);
    const digits = Math.max(2, Math.ceil(-Math.log10(c.step)));
    const tip = toScreen(c.v, c.half);

    function update() {
      const s = w.get('s');
      const P = scale(c.u, s);
      const p = toScreen(P, c.half);
      const gap = sub(c.v, P);
      const angle = angleDeg(gap, c.u);
      const onTip = len(gap) < 1e-9; // v already lies on the line
      const nearest = Math.abs(s - c.target) <= c.step / 2 + 1e-9;
      const found = onTip || Math.abs(angle - 90) <= 1 || nearest;

      moveHandle(w.el('p'), p);
      setLine(w.el('link'), p, tip);
      setAt(w.el('p-label'), p, 10, 18);

      // Little square in the corner at P, drawn only once the angle is right.
      let corner = '';
      if (found && !onTip) {
        const along = scale(c.u, 1 / len(c.u));
        const e1 = [along[0] * 11, -along[1] * 11];               // screen y points down
        const e2 = [gap[0] / len(gap) * 11, -gap[1] / len(gap) * 11];
        corner = [[p[0] + e1[0], p[1] + e1[1]], [p[0] + e1[0] + e2[0], p[1] + e1[1] + e2[1]], [p[0] + e2[0], p[1] + e2[1]]]
          .map(k => num(k[0]) + ',' + num(k[1])).join(' ');
      }
      w.el('corner').setAttribute('points', corner);
      section.classList.toggle('is-found', found);

      const angleText = onTip ? 'none (P is at the tip of v)' : Math.round(angle) + '°';
      w.out('s').textContent = fmt(s, digits);
      w.read('p').textContent = vec(P);
      w.read('s').textContent = fmt(s, digits);
      w.read('angle').textContent = onTip ? '-' : angleText;
      let verdict;
      if (onTip) verdict = 'P is the tip of v: v already lies on the line, so P is the projection of v.';
      else if (found) verdict = 'Perpendicular: P is the projection of v.';
      else verdict = 'Not perpendicular yet. Keep sliding P.';
      w.say(`P = ${vec(P)}, s = ${fmt(s, digits)}. Angle between the segment and the line: ${angleText}. ${verdict}`);
    }

    // Dragging: drop the pointer onto the line (s = w.u / u.u) and snap to the slider's step.
    w.draggable(w.el('p'), point => {
      w.set('s', projectionScalar(toWorld(point, c.half), c.u));
      update();
    });
    w.controls(update);
    update();
    return { destroy: w.destroy };
  }

  /* ---------- q24: eigen-directions ---------- */

  function setup24(q) {
    const { m } = paramsFor(q);
    // Show the whole of A.v when it is modest; keep the unit circle readable when it is not.
    const half = clamp(maxStretch(m) * 1.12, 1.6, 5);
    let start = 30;
    for (let i = 0; i < 18 && isEigenDirection(m, start); i++) start = (start + 20) % 360;
    return { m, half, start };
  }

  function html24(q) {
    const c = setup24(q);
    const r = REACH / c.half; // radius of the unit circle in user units
    const svg = `
      <svg viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Plane with a unit vector v and the vector A times v.">
        ${planeBackdrop(c.half)}
        <circle class="hands-on-circle" cx="${HALF}" cy="${HALF}" r="${num(r)}"/>
        ${arrowMarkup('hands-on-av', 'av')}
        ${arrowMarkup('hands-on-v', 'v')}
        <text class="hands-on-label hands-on-av-label" data-el="av-label">A·v</text>
        <text class="hands-on-label hands-on-v-label" data-el="v-label">v</text>
        ${handleMarkup('p')}
      </svg>`;
    const matrix = `<span class="hands-on-matrix" role="img" aria-label="matrix with rows ${esc(fmt(c.m[0]))}, ${esc(fmt(c.m[1]))} and ${esc(fmt(c.m[2]))}, ${esc(fmt(c.m[3]))}">` +
      c.m.map(x => `<span>${esc(fmt(x))}</span>`).join('') + '</span>';
    const lead = `<b>A</b> = ${matrix} acts on the unit vector <b>v</b>. Turn v around the circle and watch <b>A·v</b>. ` +
      'Most directions get turned. Find a direction where v and A·v lie on one line.';
    const readings = tile('theta', 'Direction θ') + tile('v', 'v') + tile('av', 'A·v') + tile('angle', 'Angle v to A·v');
    const controls = sliderRow('q24', 'theta', 'Direction θ in degrees', 0, 359, 1, c.start);
    return frame('q24', 'Turn the vector until the matrix does not turn it', lead, svg, readings, controls);
  }

  function mount24(section, q) {
    const c = setup24(q);
    const w = wiring(section);
    const origin = [HALF, HALF];

    function update() {
      const theta = w.get('theta');
      const v = unit(theta);
      const av = apply(c.m, v);
      const size = len(av);
      const found = isEigenDirection(c.m, theta);
      const factor = dot(av, v);

      // A.v longer than the picture is drawn shortened (dashed) and its true size reported.
      const limit = c.half * 0.98;
      const shortened = size > limit;
      const drawn = shortened ? scale(av, limit / size) : av;
      const pv = toScreen(v, c.half);
      const pav = toScreen(drawn, c.half);

      setArrow(w.el('v'), origin, pv);
      setArrow(w.el('av'), origin, pav);
      w.el('av').classList.toggle('is-shortened', shortened);
      moveHandle(w.el('p'), pv);
      // Labels: "v" sits beside the handle (a quarter turn round from it), "A.v" just past its tip.
      setAt(w.el('v-label'), pv, -v[1] * 34 - 4, -v[0] * 34 + 5);
      const along = size < 1e-9 ? v : scale(av, 1 / size);
      setAt(w.el('av-label'), pav, along[0] * 20 - 12, -along[1] * 20 + 5);
      section.classList.toggle('is-found', found);

      const between = size < 1e-9 ? NaN : angleDeg(v, av);
      const angleText = Number.isNaN(between) ? 'none (A·v is zero)' : Math.round(between) + '°';
      w.out('theta').textContent = theta + '°';
      w.read('theta').textContent = theta + '°';
      w.read('v').textContent = vec(v);
      w.read('av').textContent = vec(av) + (shortened ? ' (drawn shortened)' : '');
      w.read('angle').textContent = Number.isNaN(between) ? '-' : angleText;
      let verdict;
      if (found) {
        verdict = `Eigen-direction found: A stretches this direction by a factor of about ${fmt(factor)}` +
          (factor < -0.005 ? ' (negative: it flips the vector).' : '.');
      } else {
        verdict = 'A turns this direction. Keep turning v.';
      }
      w.say(`θ = ${theta}°, v = ${vec(v)}, A·v = ${vec(av)}. Angle between v and A·v: ${angleText}. ${verdict}`);
    }

    // Dragging: the handle follows the pointer's direction from the origin, in whole degrees.
    w.draggable(w.el('p'), point => {
      const p = toWorld(point, c.half);
      if (len(p) < 1e-6) return;
      const deg = Math.round(Math.atan2(p[1], p[0]) * 180 / Math.PI);
      w.set('theta', (deg + 360) % 360);
      update();
    });
    w.controls(update);
    update();
    return { destroy: w.destroy };
  }

  /* ---------- q21: least-squares line ---------- */

  const PLOT = { w: 320, h: 290, left: 34, right: 10, top: 10, bottom: 28, t0: -0.45, t1: 2.45 };

  function setup21(q) {
    const { ys } = paramsFor(q);
    const lo = Math.min(...ys, 0);          // 0 is included because the line starts at y = 0
    const hi = Math.max(...ys, 0);
    const span = Math.max(hi - lo, 2);
    const dataSpan = Math.max(...ys) - Math.min(...ys);
    // Slider ranges come from the spread of the data only, never from the fitted line itself.
    const aMin = Math.floor(lo - span / 2) - 1;
    const aMax = Math.ceil(hi + span / 2) + 1;
    const bMax = Math.max(2, Math.ceil(dataSpan / 2) + 1);
    const best = bestFit(ys);
    // Start flat at zero unless that is already the best line.
    const a0 = Math.abs(best.a) < 0.3 && Math.abs(best.b) < 0.3 ? 1 : 0;
    return {
      ys, aMin, aMax, bMin: -bMax, bMax, a0, b0: 0,
      yMin: lo - span * 0.22, yMax: hi + span * 0.22
    };
  }

  /* Plot coordinates: time across, reading up. */
  function plotScale(c) {
    const innerW = PLOT.w - PLOT.left - PLOT.right;
    const innerH = PLOT.h - PLOT.top - PLOT.bottom;
    return {
      x: t => PLOT.left + (t - PLOT.t0) / (PLOT.t1 - PLOT.t0) * innerW,
      y: y => PLOT.top + (c.yMax - y) / (c.yMax - c.yMin) * innerH,
      yInverse: py => c.yMax - (py - PLOT.top) / innerH * (c.yMax - c.yMin),
      perUnit: innerH / (c.yMax - c.yMin),
      innerW, innerH
    };
  }

  function html21(q) {
    const c = setup21(q);
    const s = plotScale(c);
    const tick = Math.max(1, niceStep((c.yMax - c.yMin) / 5));
    const parts = [];
    for (let k = Math.ceil(c.yMin / tick); k <= Math.floor(c.yMax / tick); k++) {
      const y = s.y(k * tick);
      parts.push(`<line class="${k === 0 ? 'hands-on-axis' : 'hands-on-grid'}" x1="${PLOT.left}" y1="${num(y)}" x2="${PLOT.w - PLOT.right}" y2="${num(y)}"/>`);
      parts.push(`<text class="hands-on-tick" x="${PLOT.left - 5}" y="${num(y + 3.5)}" text-anchor="end">${esc(fmt(k * tick))}</text>`);
    }
    for (let t = 0; t <= 2; t++) {
      const x = s.x(t);
      parts.push(`<line class="hands-on-grid" x1="${num(x)}" y1="${PLOT.top}" x2="${num(x)}" y2="${PLOT.h - PLOT.bottom}"/>`);
      parts.push(`<text class="hands-on-tick" x="${num(x)}" y="${PLOT.h - PLOT.bottom + 14}" text-anchor="middle">time ${t}</text>`);
    }
    const squares = c.ys.map((y, t) => `<rect class="hands-on-square" data-el="square-${t}"/>`).join('');
    const points = c.ys.map((y, t) =>
      `<circle class="hands-on-point" cx="${num(s.x(t))}" cy="${num(s.y(y))}" r="5"/>`).join('');
    const svg = `
      <svg viewBox="0 0 ${PLOT.w} ${PLOT.h}" role="img" aria-label="Plot of three readings and your line.">
        <defs><clipPath id="hands-on-clip-q21"><rect x="${PLOT.left}" y="${PLOT.top}" width="${num(s.innerW)}" height="${num(s.innerH)}"/></clipPath></defs>
        <rect class="hands-on-plot" x="${PLOT.left}" y="${PLOT.top}" width="${num(s.innerW)}" height="${num(s.innerH)}"/>
        ${parts.join('')}
        <g clip-path="url(#hands-on-clip-q21)">
          ${squares}
          <line class="hands-on-fit" data-el="fit"/>
        </g>
        ${points}
        ${handleMarkup('h0')}
        ${handleMarkup('h2')}
      </svg>`;
    const lead = `Three readings were taken at times 0, 1 and 2: <b>${esc(c.ys.map(y => fmt(y)).join(', '))}</b>. ` +
      'Your line is <b>y = a + b·time</b>. Each square has the miss at one reading as its side. ' +
      'Move the line to make the total area of the squares as small as you can.';
    const readings = tile('a', 'Intercept a') + tile('b', 'Slope b') +
      tile('sse', 'Sum of squares') + tile('best', 'Smallest so far');
    const controls =
      sliderRow('q21', 'a', 'Intercept a', c.aMin, c.aMax, 0.05, c.a0) +
      sliderRow('q21', 'b', 'Slope b', c.bMin, c.bMax, 0.05, c.b0);
    const extra = '<button type="button" class="hands-on-reset" data-el="reset">Reset</button>';
    return frame('q21', 'Drag the line; shrink the squares', lead, svg, readings, controls, extra);
  }

  function mount21(section, q) {
    const c = setup21(q);
    const s = plotScale(c);
    const w = wiring(section);
    let smallest = Infinity;
    let previous = null;

    function update() {
      const a = w.get('a');
      const b = w.get('b');
      const total = sse(c.ys, a, b);
      const improved = total < smallest - 1e-9;
      smallest = Math.min(smallest, total);

      // The line, drawn well past both ends and clipped by the plot frame.
      setLine(w.el('fit'), [s.x(-1), s.y(a - b)], [s.x(3), s.y(a + 3 * b)]);
      // Handles stay inside the frame even when the line leaves it, so they can be grabbed back.
      const inside = y => clamp(s.y(y), PLOT.top + 4, PLOT.h - PLOT.bottom - 4);
      moveHandle(w.el('h0'), [s.x(0), inside(a)]);
      moveHandle(w.el('h2'), [s.x(2), inside(a + 2 * b)]);

      // One square per reading; its side on screen is the size of the miss.
      residuals(c.ys, a, b).forEach((r, t) => {
        const side = Math.abs(r) * s.perUnit;
        const rect = w.el('square-' + t);
        rect.setAttribute('x', num(t === 2 ? s.x(t) - side : s.x(t)));
        rect.setAttribute('y', num(Math.min(s.y(c.ys[t]), s.y(a + b * t))));
        rect.setAttribute('width', num(side));
        rect.setAttribute('height', num(side));
      });

      w.out('a').textContent = fmt(a);
      w.out('b').textContent = fmt(b);
      w.read('a').textContent = fmt(a);
      w.read('b').textContent = fmt(b);
      w.read('sse').textContent = total.toFixed(3);
      w.read('best').textContent = smallest.toFixed(3);
      let trend = '';
      if (previous !== null && Math.abs(total - previous) > 1e-9) {
        trend = total < previous ? ' The squares shrank.' : ' The squares grew.';
        if (improved) trend += ' New smallest.';
      }
      previous = total;
      w.say(`Line y = ${fmt(a)} + ${fmt(b)}·time. Sum of squared residuals: ${total.toFixed(3)}. ` +
        `Smallest so far: ${smallest.toFixed(3)}.${trend}`);
    }

    // Dragging one end keeps the other end where it is: a = y(0), b = (y(2) - y(0)) / 2.
    w.draggable(w.el('h0'), point => {
      const y2 = w.get('a') + 2 * w.get('b');
      w.set('a', s.yInverse(point[1]));
      w.set('b', (y2 - w.get('a')) / 2);
      update();
    });
    w.draggable(w.el('h2'), point => {
      w.set('b', (s.yInverse(point[1]) - w.get('a')) / 2);
      update();
    });
    w.on(w.el('reset'), 'click', () => {
      w.set('a', c.a0);
      w.set('b', c.b0);
      smallest = Infinity;
      previous = null;
      update();
    });
    w.controls(update);
    update();
    return { destroy: w.destroy };
  }

  /* ---------- public API ---------- */

  const BUILD = { q18: html18, q21: html21, q24: html24 };
  const WIRE = { q18: mount18, q21: mount21, q24: mount24 };

  function html(q) {
    return q && supported(q.id) ? BUILD[q.id](q) : '';
  }

  function mount(root, q) {
    if (!root || !q || !supported(q.id)) return null;
    const selector = `.hands-on[data-hands-on="${q.id}"]`;
    const section = root.matches && root.matches(selector) ? root : root.querySelector(selector);
    return section ? WIRE[q.id](section, q) : null;
  }

  return { supported, html, mount, math };
})();
