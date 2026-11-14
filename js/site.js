/* Giovanni Callahan — site scripts. No dependencies, no tracking. */
(function () {
  'use strict';

  // Paste the Formspree form ID here (e.g. 'xyzabcd') once the form exists.
  const FORMSPREE_ID = 'mppdzlyo';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mobile navigation ─────────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* ── Canvas helpers ────────────────────────────────────── */
  function setupCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const state = { ctx, w: 0, h: 0 };
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      state.w = r.width; state.h = r.height;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    new ResizeObserver(resize).observe(canvas);
    return state;
  }

  // Runs draw(t) every frame while the canvas is on screen and the tab is visible.
  // With reduced motion, draws one representative frame instead.
  function animate(canvas, draw, staticTime) {
    if (reduceMotion) {
      const once = () => draw(staticTime);
      once();
      new ResizeObserver(once).observe(canvas);
      return;
    }
    let visible = true, raf = 0, start = performance.now(), pausedAt = 0;
    function frame(now) { draw(Math.max(0, (now - start) / 1000)); raf = requestAnimationFrame(frame); }
    function play() { if (!raf && visible && !document.hidden) { if (pausedAt) start += performance.now() - pausedAt; raf = requestAnimationFrame(frame); } }
    function pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; pausedAt = performance.now(); } }
    new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? play() : pause(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
    play();
  }

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const logistic = (x, mu, s) => 1 / (1 + Math.exp(-(x - mu) / s));
  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function binom(n, p) { let k = 0; for (let i = 0; i < n; i++) if (Math.random() < p) k++; return k; }
  function css(name) { return getComputedStyle(document.body).getPropertyValue(name).trim(); }

  function drawAxes(ctx, box, xLabel, yLabel, colors) {
    const { x0, y0, x1, y1 } = box;
    ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = y1 - (y1 - y0) * i / 4;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const x = x0 + (x1 - x0) * i / 8;
      ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
    }
    ctx.strokeStyle = colors.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.fillStyle = colors.muted; ctx.font = '500 12px "Instrument Sans", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(xLabel, (x0 + x1) / 2, y1 + 34);
    ctx.save(); ctx.translate(x0 - 34, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(yLabel, 0, 0); ctx.restore();
    ctx.textAlign = 'right'; ctx.fillText('1.0', x0 - 8, y0 + 4); ctx.fillText('0.5', x0 - 8, (y0 + y1) / 2 + 4); ctx.fillText('0', x0 - 8, y1 + 4);
  }

  /* ── Home hero: calibration ───────────────────────────────
     A noisy trace settles (signal), trials accumulate into proportions (data),
     and a logistic psychometric function is fitted through them (model). */
  const calib = document.getElementById('calibration');
  if (calib) {
    const st = setupCanvas(calib);
    const stageEls = [...document.querySelectorAll('[data-stage]')];
    const CYCLE = 13;
    let cycle = -1, run = null;

    function newRun() {
      const mu = rand(0.38, 0.62), s = rand(0.06, 0.11);
      const levels = Array.from({ length: 9 }, (_, i) => 0.06 + i * 0.11);
      const n = 24;
      const pts = levels.map(x => ({ x, k: binom(n, logistic(x, mu, s)), n }));
      // least-squares fit on a grid: honest about what the curve is
      let best = { err: Infinity, mu: 0.5, s: 0.08 };
      for (let m = 0.2; m <= 0.8; m += 0.005) for (let sl = 0.03; sl <= 0.2; sl += 0.005) {
        let e = 0; for (const p of pts) { const d = p.k / p.n - logistic(p.x, m, sl); e += d * d; }
        if (e < best.err) best = { err: e, mu: m, s: sl };
      }
      const drops = pts.map(p => Array.from({ length: 10 }, () => ({ dx: rand(-0.012, 0.012), delay: rand(0, 0.9), hit: Math.random() < p.k / p.n })));
      const phase = Math.random() * 10;
      return { pts, fit: best, drops, phase };
    }

    function draw(t) {
      const c = Math.floor(t / CYCLE); const u = t - c * CYCLE;
      if (c !== cycle) { cycle = c; run = newRun(); }
      const { ctx, w, h } = st;
      const colors = { grid: css('--grid'), ink: css('--ink'), muted: css('--ink-2'), sig: css('--signal-bright'), mark: css('--marker-bright'), sigDark: css('--signal') };
      ctx.clearRect(0, 0, w, h);
      const box = { x0: 64, y0: 22, x1: w - 24, y1: h - 52 };
      const X = x => box.x0 + (box.x1 - box.x0) * x, Y = y => box.y1 - (box.y1 - box.y0) * y;
      drawAxes(ctx, box, 'Stimulus strength', 'Proportion detected', colors);
      const fadeOut = u > 11.6 ? 1 - (u - 11.6) / 1.4 : 1;
      ctx.globalAlpha = clamp01(fadeOut);

      // 1. signal: a sweeping trace whose noise shrinks as it is calibrated
      const stage = u < 3.4 ? 0 : u < 7.6 ? 1 : 2;
      stageEls.forEach((el, i) => el.classList.toggle('on', reduceMotion || i <= stage));
      if (u < 4.2) {
        const sweep = clamp01(u / 3.2);
        const alpha = u < 3.4 ? 1 : 1 - (u - 3.4) / 0.8;
        ctx.globalAlpha = clamp01(alpha) * clamp01(fadeOut);
        ctx.strokeStyle = colors.sig; ctx.lineWidth = 2; ctx.beginPath();
        const steps = Math.max(2, Math.floor(260 * sweep));
        for (let i = 0; i <= steps; i++) {
          const x = i / 260;
          const noise = (1 - x) * 0.22 * Math.sin(x * 90 + run.phase) * Math.sin(x * 23 + t * 3) + (1 - x) * 0.05 * Math.sin(x * 211 + t * 9);
          const y = 0.5 + noise;
          i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y));
        }
        ctx.stroke();
        if (sweep < 1) { ctx.fillStyle = colors.sig; ctx.beginPath(); ctx.arc(X(steps / 260), Y(0.5), 4, 0, 7); ctx.fill(); }
        ctx.globalAlpha = clamp01(fadeOut);
      }

      // 2. data: trials fall in at each stimulus level and settle into a proportion
      if (u >= 3.4) {
        run.pts.forEach((p, i) => {
          const local = u - 3.4 - i * 0.32;
          if (local <= 0) return;
          run.drops[i].forEach(d => {
            const k = clamp01((local - d.delay) / 0.55);
            if (k <= 0 || local > 2.2) return;
            const yEnd = d.hit ? 1.0 : 0.0;
            ctx.fillStyle = d.hit ? colors.sig : colors.muted;
            ctx.globalAlpha = (local > 1.7 ? clamp01(1 - (local - 1.7) / 0.5) : 0.55) * clamp01(fadeOut);
            ctx.beginPath(); ctx.arc(X(p.x + d.dx), Y(1.08 - (1.08 - yEnd) * ease(k)) , 2.2, 0, 7); ctx.fill();
          });
          ctx.globalAlpha = clamp01(fadeOut);
          const show = clamp01((local - 1.2) / 0.4);
          if (show > 0) {
            const prop = p.k / p.n, se = Math.sqrt(Math.max(prop * (1 - prop), 0.01) / p.n);
            ctx.strokeStyle = colors.mark; ctx.lineWidth = 1.5; ctx.globalAlpha = show * clamp01(fadeOut);
            ctx.beginPath(); ctx.moveTo(X(p.x), Y(clamp01(prop - se))); ctx.lineTo(X(p.x), Y(clamp01(prop + se))); ctx.stroke();
            ctx.fillStyle = colors.mark; ctx.beginPath(); ctx.arc(X(p.x), Y(prop), 5 * show, 0, 7); ctx.fill();
            ctx.globalAlpha = clamp01(fadeOut);
          }
        });
      }

      // 3. model: the fitted psychometric function and its threshold
      if (u >= 7.6) {
        const k = ease(clamp01((u - 7.6) / 2.2));
        ctx.strokeStyle = colors.sigDark; ctx.lineWidth = 3; ctx.beginPath();
        for (let i = 0; i <= 200 * k; i++) { const x = i / 200; const y = logistic(x, run.fit.mu, run.fit.s); i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }
        ctx.stroke();
        const lab = clamp01((u - 9.6) / 0.6);
        if (lab > 0) {
          ctx.globalAlpha = lab * clamp01(fadeOut);
          ctx.setLineDash([5, 5]); ctx.strokeStyle = colors.ink; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(X(run.fit.mu), Y(0)); ctx.lineTo(X(run.fit.mu), Y(0.5)); ctx.lineTo(X(0), Y(0.5)); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = colors.ink; ctx.font = '600 13px "Instrument Sans", sans-serif'; ctx.textAlign = 'left';
          ctx.fillText('threshold ≈ ' + run.fit.mu.toFixed(2), X(run.fit.mu) + 8, Y(0.5) + 18);
        }
      }
      ctx.globalAlpha = 1;
    }
    animate(calib, draw, 11);
  }

  /* ── Power curve (CogViz): simulated studies → detection rate ───── */
  document.querySelectorAll('canvas.power').forEach(canvas => {
    const st = setupCanvas(canvas);
    const CYCLE = 11, d = 0.5;
    const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
    function erf(x) { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
    const power = n => Phi(d * Math.sqrt(n / 2) - 1.96);
    const ns = Array.from({ length: 15 }, (_, i) => 10 + i * 10);
    let cycle = -1, est = [];
    function draw(t) {
      const c = Math.floor(t / CYCLE), u = t - c * CYCLE;
      if (c !== cycle) { cycle = c; est = ns.map(n => binom(200, power(n)) / 200); }
      const { ctx, w, h } = st;
      const colors = { grid: 'rgba(0,0,0,0)', ink: css('--ink'), muted: css('--ink-2'), sig: css('--signal'), mark: css('--marker-bright') };
      ctx.clearRect(0, 0, w, h);
      const box = { x0: 58, y0: 20, x1: w - 20, y1: h - 48 };
      const X = n => box.x0 + (box.x1 - box.x0) * (n - 0) / 160, Y = y => box.y1 - (box.y1 - box.y0) * y;
      drawAxes(ctx, box, 'Participants per group', 'Detection rate', colors);
      ctx.fillStyle = colors.muted; ctx.font = '500 11px "Instrument Sans", sans-serif'; ctx.textAlign = 'center';
      [0, 40, 80, 120, 160].forEach(n => ctx.fillText(String(n), X(n), box.y1 + 15));
      const fade = u > 9.8 ? clamp01(1 - (u - 9.8) / 1.2) : 1;
      ctx.globalAlpha = fade;
      ctx.setLineDash([4, 5]); ctx.strokeStyle = colors.muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(box.x0, Y(0.8)); ctx.lineTo(box.x1, Y(0.8)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = colors.muted; ctx.font = '500 11px "Instrument Sans", sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('80%', box.x1 - 28, Y(0.8) - 6);
      ns.forEach((n, i) => {
        const a = clamp01((u - 0.4 - i * 0.28) / 0.3);
        if (a <= 0) return;
        ctx.fillStyle = colors.mark; ctx.globalAlpha = a * fade;
        ctx.beginPath(); ctx.arc(X(n), Y(est[i]), 4.5, 0, 7); ctx.fill();
      });
      ctx.globalAlpha = fade;
      const k = ease(clamp01((u - 5) / 2));
      if (k > 0) {
        ctx.strokeStyle = colors.sig; ctx.lineWidth = 2.5; ctx.beginPath();
        for (let i = 0; i <= 150 * k; i++) { const n = 5 + i; const y = power(n); i ? ctx.lineTo(X(n), Y(y)) : ctx.moveTo(X(n), Y(y)); }
        ctx.stroke();
      }
      if (u > 7.2) {
        let n80 = 5; while (power(n80) < 0.8) n80++;
        ctx.globalAlpha = clamp01((u - 7.2) / 0.5) * fade;
        ctx.fillStyle = colors.ink; ctx.beginPath(); ctx.arc(X(n80), Y(0.8), 5, 0, 7); ctx.fill();
        ctx.font = '600 12px "Instrument Sans", sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('about ' + n80 + ' per group', X(n80) + 9, Y(0.8) + 18);
      }
      ctx.globalAlpha = 1;
      const steps = document.querySelectorAll('.steps li');
      if (steps.length) { const idx = reduceMotion ? 4 : Math.min(4, Math.floor(u / 2)); steps.forEach((s, i) => s.classList.toggle('on', i <= idx)); }
    }
    animate(canvas, draw, 9);
  });

  /* ── Spike raster (Gyrafold page) ────────────────────────
     Each row is a model neuron firing at random; at each stimulus the population
     fires together, the pattern a raster plot is used to show. */
  const raster = document.getElementById('raster');
  if (raster) {
    const st = setupCanvas(raster);
    const N = 28, SPAN = 4.0;
    const rates = Array.from({ length: N }, () => rand(1.5, 7));
    const spikes = []; let lastT = 0, nextStim = 1.2; const stims = [];
    function draw(t) {
      const dt = Math.min(0.05, t - lastT); lastT = t;
      if (!reduceMotion) {
        for (let i = 0; i < N; i++) if (Math.random() < rates[i] * dt) spikes.push({ i, t, burst: false });
        if (t > nextStim) {
          stims.push(t);
          for (let i = 0; i < N; i++) if (Math.random() < 0.75) spikes.push({ i, t: t + 0.03 + Math.abs(gauss()) * 0.05, burst: true });
          nextStim = t + rand(1.4, 2.4);
        }
      }
      while (spikes.length && spikes[0].t < t - SPAN) spikes.shift();
      while (stims.length && stims[0] < t - SPAN) stims.shift();
      const { ctx, w, h } = st;
      ctx.clearRect(0, 0, w, h);
      const X = s => w - (t - s) / SPAN * w, rowH = (h - 12) / N;
      stims.forEach(s => { ctx.fillStyle = 'rgba(68,215,233,0.10)'; ctx.fillRect(X(s), 0, 0.12 / SPAN * w, h); });
      spikes.forEach(s => {
        if (s.t > t) return;
        ctx.strokeStyle = s.burst ? '#44d7e9' : 'rgba(169,147,255,0.85)'; ctx.lineWidth = 1.5;
        const x = X(s.t), y = 6 + s.i * rowH;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + rowH * 0.8); ctx.stroke();
      });
    }
    if (reduceMotion) {
      // one static window of activity
      for (let s = 0; s < 4; s += 0.01) for (let i = 0; i < N; i++) if (Math.random() < rates[i] * 0.01) spikes.push({ i, t: s, burst: false });
      [0.9, 2.3, 3.4].forEach(s0 => { stims.push(s0); for (let i = 0; i < N; i++) if (Math.random() < 0.75) spikes.push({ i, t: s0 + 0.03 + Math.abs(gauss()) * 0.05, burst: true }); });
      spikes.sort((a, b) => a.t - b.t);
      animate(raster, () => { lastT = 4; draw(4); }, 4);
    } else animate(raster, draw, 4);
  }

  /* ── Copy-link buttons ─────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      try { await navigator.clipboard.writeText(text); btn.textContent = 'Link copied'; }
      catch { btn.textContent = text; }
      setTimeout(() => { btn.textContent = 'Copy link'; }, 2200);
    });
  });

  /* ── Contact and feedback forms (Formspree) ────────────── */
  document.querySelectorAll('form[data-form]').forEach(form => {
    const status = form.querySelector('.status-msg');
    const submit = form.querySelector('button[type="submit"]');
    function say(kind, text) { status.className = 'status-msg ' + kind; status.textContent = text; status.hidden = false; }
    if (!/^[A-Za-z0-9]{6,12}$/.test(FORMSPREE_ID)) {
      say('info', 'This form is not connected yet, so messages cannot be sent from here for now.');
      submit.disabled = true;
      return;
    }
    form.action = 'https://formspree.io/f/' + FORMSPREE_ID;
    form.method = 'POST';
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      submit.disabled = true; const label = submit.textContent; submit.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (res.ok) {
          form.reset();
          say('ok', form.dataset.form === 'feedback' ? 'Feedback sent. Thank you for helping improve the apps.' : 'Message sent. I will reply to the email you gave.');
        } else {
          const data = await res.json().catch(() => ({}));
          const detail = data.errors && data.errors.map(x => x.message).join(' ');
          say('err', 'The message was not sent. ' + (detail || 'Check the fields and try again.'));
        }
      } catch {
        say('err', 'The message was not sent because the connection failed. Check your internet connection and try again.');
      } finally { submit.disabled = false; submit.textContent = label; }
    });
  });
})();
