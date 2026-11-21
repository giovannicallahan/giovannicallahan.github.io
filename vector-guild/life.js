/* MathCosmos 2.2: life for the realm page (life.css has the colours and the still parts).
   A classic script, loaded last by realm.html. It only decorates: no save, no answer, no score is read or changed,
   and no control changes size or place. If anything it needs is missing it does nothing.
   Under prefers-reduced-motion every function here returns at once.

   window.VGLife = {
     celebrate(el, color)   a short burst of sparks from el, in color (any CSS colour). Under 1.2 s, takes no taps.
     tick(el, from, to)     counts the number shown in el up from `from` to `to`. The final text is left as it was.
     chapterColor(index)    the palette colour of chapter `index` (0-based), read from life.css (--ch-1 ... --ch-8).
   } */
(function () {
  'use strict';
  var W = window, D = document;
  var api = { celebrate: function () {}, tick: function () {}, chapterColor: function () { return ''; } };
  W.VGLife = api;
  try {
    var mq = null;
    try { mq = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null; } catch (e) {}
    var still = function () { return !!(mq && mq.matches); };
    var now = function () { return (W.performance && performance.now) ? performance.now() : Date.now(); };
    var frame = function (fn) { return W.requestAnimationFrame ? W.requestAnimationFrame(fn) : W.setTimeout(function () { fn(now()); }, 16); };
    var FALLBACK = '#d4f36a';

    api.chapterColor = function (index) {
      try {
        var n = ((Math.floor(Number(index)) % 8) + 8) % 8 + 1;
        var v = W.getComputedStyle(D.documentElement).getPropertyValue('--ch-' + n);
        return (v && v.trim()) || FALLBACK;
      } catch (e) { return FALLBACK; }
    };

    /* ---- Counter tick-up. The element keeps the width of its final text, so nothing beside it moves. ---- */
    var ticking = (typeof WeakMap === 'function') ? new WeakMap() : null;
    api.tick = function (el, from, to) {
      try {
        if (!el || !ticking || still() || !el.isConnected) return;
        from = Number(from); to = Number(to);
        if (!isFinite(from) || !isFinite(to) || from === to) return;
        var old = ticking.get(el); if (old) old();
        var finalText = el.textContent, width = el.getBoundingClientRect().width;
        var keep = { display: el.style.display, minWidth: el.style.minWidth, textAlign: el.style.textAlign };
        var over = false, timer = 0, last = '';
        var finish = function (restoreText) {
          if (over) return; over = true; W.clearTimeout(timer); ticking.delete(el);
          el.style.display = keep.display; el.style.minWidth = keep.minWidth; el.style.textAlign = keep.textAlign;
          if (el.classList) el.classList.remove('life-tick');
          if (restoreText && el.textContent === last) el.textContent = finalText;
        };
        ticking.set(el, function () { finish(true); });
        el.style.display = 'inline-block'; el.style.minWidth = width + 'px'; el.style.textAlign = 'right';
        if (el.classList) el.classList.add('life-tick');
        var t0 = now(), DUR = 750;
        last = String(Math.round(from)); el.textContent = last;
        timer = W.setTimeout(function () { finish(true); }, DUR + 400);
        var step = function () {
          if (over) return;
          /* Someone else redrew the counter: leave their text alone. */
          if (!el.isConnected || el.textContent !== last) { finish(false); return; }
          var p = Math.min(1, (now() - t0) / DUR), e = 1 - Math.pow(1 - p, 3);
          if (p >= 1) { finish(true); return; }
          last = String(Math.round(from + (to - from) * e)); el.textContent = last;
          frame(step);
        };
        frame(step);
      } catch (e) {}
    };

    /* ---- Burst. A canvas over the page (inside the open dialog, which sits above everything else). ---- */
    var burst = null;
    api.celebrate = function (el, color) {
      try {
        if (still() || !D.body) return;
        if (burst) burst();
        var host = (el && el.closest && el.closest('dialog[open]')) || D.body;
        var vw = W.innerWidth || D.documentElement.clientWidth, vh = W.innerHeight || D.documentElement.clientHeight;
        if (!vw || !vh) return;
        var r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
        var ox = r && r.width ? r.left + r.width / 2 : vw / 2, oy = r && r.width ? r.top + r.height / 2 : vh / 2;
        ox = Math.max(20, Math.min(vw - 20, ox)); oy = Math.max(20, Math.min(vh - 20, oy));
        var c = D.createElement('canvas'), ctx = c.getContext && c.getContext('2d');
        if (!ctx) return;
        var dpr = Math.min(2, W.devicePixelRatio || 1);
        c.className = 'life-burst'; c.setAttribute('aria-hidden', 'true');
        c.width = Math.round(vw * dpr); c.height = Math.round(vh * dpr);
        /* Set here too, so the canvas is harmless even if life.css did not load. */
        c.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483000';
        host.appendChild(c);
        ctx.scale(dpr, dpr);
        var main = (typeof color === 'string' && color.trim()) || FALLBACK, tints = [main, main, main, '#edf0dd', '#f6d868'];
        var parts = [], N = 44, i;
        for (i = 0; i < N; i++) {
          var a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.7, v = 140 + Math.random() * 330;
          parts.push({ x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, size: 2 + Math.random() * 3.5,
            life: 0.55 + Math.random() * 0.5, tint: tints[i % tints.length], star: i % 3 === 0, spin: Math.random() * 6 });
        }
        var t0 = now(), prev = t0, over = false, timer = 0, LIMIT = 1100;
        var end = function () { if (over) return; over = true; W.clearTimeout(timer); if (c.parentNode) c.parentNode.removeChild(c); if (burst === end) burst = null; };
        burst = end; timer = W.setTimeout(end, LIMIT + 60);
        var draw = function () {
          if (over) return;
          var t = now(), age = (t - t0) / 1000, dt = Math.min(0.05, (t - prev) / 1000); prev = t;
          if (t - t0 >= LIMIT || !c.isConnected) { end(); return; }
          ctx.clearRect(0, 0, vw, vh);
          for (var k = 0; k < parts.length; k++) {
            var p = parts[k]; if (age > p.life) continue;
            p.vy += 620 * dt; p.vx *= (1 - 1.6 * dt); p.vy *= (1 - 0.6 * dt); p.x += p.vx * dt; p.y += p.vy * dt;
            var left = 1 - age / p.life;
            ctx.globalAlpha = Math.max(0, Math.min(1, left * 1.4));
            ctx.fillStyle = FALLBACK; ctx.fillStyle = p.tint;
            if (p.star) {
              var s = p.size * (0.7 + left);
              ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.spin + age * 5);
              ctx.beginPath(); ctx.moveTo(0, -s * 1.7); ctx.lineTo(s * 0.45, -s * 0.45); ctx.lineTo(s * 1.7, 0); ctx.lineTo(s * 0.45, s * 0.45);
              ctx.lineTo(0, s * 1.7); ctx.lineTo(-s * 0.45, s * 0.45); ctx.lineTo(-s * 1.7, 0); ctx.lineTo(-s * 0.45, -s * 0.45); ctx.closePath(); ctx.fill();
              ctx.restore();
            } else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.5 + left * 0.6), 0, Math.PI * 2); ctx.fill(); }
          }
          frame(draw);
        };
        frame(draw);
      } catch (e) {}
    };

    /* ---- After each redraw of the page: bars slide from their old width, and a chapter that has just been
       completed glows once. app.js writes the new markup; this only replays the change. ---- */
    var widths = {}, tones = {}, RANK = { '': 0, complete: 1, mastered: 2 };
    var toneOf = function (dd) { return dd.classList.contains('dd-mastered') ? 'mastered' : dd.classList.contains('dd-complete') ? 'complete' : ''; };
    function sync(root) {
      try {
        var moving = !still(), stamp = now();
        var bars = root.querySelectorAll('.dd-bar i, .progressbar span'), loose = 0, i;
        for (i = 0; i < bars.length; i++) {
          var bar = bars[i], owner = bar.closest('[data-dd]');
          var key = owner ? owner.getAttribute('data-dd') + '|' + bar.parentNode.className : 'bar|' + (loose++);
          /* The page is sometimes drawn twice in a row (a dialog closing). A change seen a moment ago is replayed
             on the new elements, so the slide is not lost. */
          var target = bar.style.width, rec = Object.prototype.hasOwnProperty.call(widths, key) ? widths[key] : { w: '0%', from: '0%', at: 0 };
          var before = rec.w === target && stamp - rec.at < 900 ? rec.from : rec.w;
          if (rec.w !== target || !rec.at) widths[key] = { w: target, from: before, at: stamp };
          if (!moving || !target || before === target) continue;
          bar.style.transition = 'none'; bar.style.width = before;
          void bar.offsetWidth;
          bar.style.transition = ''; bar.style.width = target;
        }
        var dds = root.querySelectorAll('.dd[data-ch]');
        for (i = 0; i < dds.length; i++) {
          var dd = dds[i], btn = dd.querySelector('[data-dd]'), id = btn && btn.getAttribute('data-dd'); if (!id) continue;
          var tone = toneOf(dd), was = Object.prototype.hasOwnProperty.call(tones, id) ? tones[id] : null;
          var rose = was !== null && RANK[tone] > RANK[was.tone];
          tones[id] = { tone: tone, at: rose ? stamp : was && was.tone === tone ? was.at : 0 };
          if (moving && tones[id].at && stamp - tones[id].at < 1200) glow(dd);
        }
      } catch (e) {}
    }
    function glow(dd) {
      dd.classList.add('life-glow');
      W.setTimeout(function () { dd.classList.remove('life-glow'); }, 1700);
    }
    function start() {
      try {
        var content = D.getElementById('content');
        if (!content || typeof MutationObserver !== 'function') return;
        sync(content);
        new MutationObserver(function () { sync(content); }).observe(content, { childList: true });
      } catch (e) {}
    }
    if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', start); else start();
  } catch (e) {}
})();
