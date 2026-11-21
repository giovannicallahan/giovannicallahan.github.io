/* The collection interface (docs/COLLECTION.md, "Interface"): the overlay with Summon, Figures and
   Achievements, the toasts, and the small chip with the equipped emblem and the stardust count.
   Used by the star map (index.html) and the realm page. All rules live in collection/core.js
   (window.VGCollection); this file only draws what the core returns. Styles: collection/collection.css.
   Classic script, no modules, no network.

   window.VGCollectionUI
     open(tab?)       opens the overlay. tab: 'summon' (default) | 'figures' | 'achievements'. Safe to call twice.
     close()          closes it and puts the focus back where it was.
     toast(events)    shows one line for a list of award events (VGCollection.describe); also takes a string.
                      Returns true when something was shown. Also redraws every chip.
     chip(el, opts?)  draws the equipped emblem and the stardust count into el and keeps it up to date.
                      A <button> or <a> opens the overlay when pressed. opts.label: text before the count.
                      opts.name: how the button's spoken name and tooltip start (default: the label, else "Collection").
     refresh()        redraws chips and the open overlay after something changed elsewhere.
     isOpen()         whether the overlay is open.
     back()           what Escape and Android Back do: figure card -> grid, else close. true if it did something.
   While the overlay is open, window.VectorGuildBack is wrapped so Android Back closes the overlay first.
   The pure helpers at the top touch no DOM; qa/shell.test.js runs them under Node. */
(function (root) {
  'use strict';

  /* ---------- Pure helpers ---------- */
  var TABS = ['summon', 'figures', 'achievements'];
  var TAB_NAMES = { summon: 'Summon', figures: 'Figures', achievements: 'Achievements' };
  var RARITY_NAMES = { common: 'Common', rare: 'Rare', legendary: 'Legendary' };
  var HOSTS = {
    'mathshistory.st-andrews.ac.uk': 'MacTutor, University of St Andrews', 'en.wikipedia.org': 'Wikipedia',
    'nasa.gov': 'NASA', 'ahf.nuclearmuseum.org': 'Atomic Heritage Foundation', 'rss.org.uk': 'Royal Statistical Society',
    'york.ac.uk': 'University of York', 'pmc.ncbi.nlm.nih.gov': 'PubMed Central', 'abelprize.no': 'The Abel Prize',
    'mathwomen.agnesscott.org': 'Agnes Scott College', 'claymath.org': 'Clay Mathematics Institute',
    'history.aip.org': 'American Institute of Physics', 'britannica.com': 'Britannica', 'nobelprize.org': 'The Nobel Prize'
  };
  function pickTab(t) { return TABS.indexOf(t) >= 0 ? t : 'summon'; }
  /* Only plain https links leave the app, as with the reading links in app.js. */
  function safeUrl(u) { return typeof u === 'string' && /^https:\/\/[^\s"'<>\\]+$/.test(u) ? u : null; }
  function hostOf(u) { var m = /^https:\/\/([^\/?#:]+)/.exec(u || ''); return m ? m[1].toLowerCase().replace(/^www\./, '') : ''; }
  function sourceLabel(u) { var h = hostOf(u); return Object.prototype.hasOwnProperty.call(HOSTS, h) ? HOSTS[h] : h; }
  function years(f) {
    var b = f && f.born != null ? String(f.born).trim() : '', d = f && f.died != null ? String(f.died).trim() : '';
    return b && d ? b + ' to ' + d : b ? 'Born ' + b : d ? 'Died ' + d : '';
  }
  function percent(x) { return Math.round((+x || 0) * 100) + '%'; }
  function rarityName(r) { return RARITY_NAMES[r] || RARITY_NAMES.common; }
  function summonLabel(cost) { return cost > 0 ? 'Summon for ' + cost + ' stardust' : 'Summon for free'; }
  /* The line under the Summon button. */
  function summonNote(cost, dust, total) {
    if (!(total > 0)) return 'The figure list did not load. Reload the page to try again.';
    if (!(cost > 0)) return 'Your first summon is free.';
    if (dust >= cost) return 'You have ' + dust + ' stardust. One summon uses ' + cost + '.';
    return 'You need ' + (cost - dust) + ' more stardust. Solve missions to earn it.';
  }
  function withinText(n) { return n <= 1 ? 'Your next summon is one for sure.' : 'One is certain within your next ' + n + ' summons.'; }
  /* The Chances block. When a guarantee is due the next summon has its own chances, so the heading says
     "next summon" and the usual chances are given in one line. */
  function sameOdds(a, b) { return !!a && !!b && ['common', 'rare', 'legendary'].every(function (r) { return Math.abs((+a[r] || 0) - (+b[r] || 0)) < 1e-9; }); }
  function oddsTitle(now, usual) { return !usual || sameOdds(now, usual) ? 'Chances' : 'Chances for your next summon'; }
  function usualLine(now, usual) { return !usual || sameOdds(now, usual) ? '' : 'A guarantee is due. Usual chances: common ' + percent(usual.common) + ', rare ' + percent(usual.rare) + ', legendary ' + percent(usual.legendary) + '.'; }
  function guaranteeLines(g) {
    g = g || {};
    return ['At least one rare or legendary figure in every ' + g.rareEvery + ' summons. ' + withinText(g.rareIn),
      'At least one legendary figure in every ' + g.legendEvery + ' summons. ' + withinText(g.legendIn)];
  }
  function starsText(stars, max) { return stars + ' of ' + (max || 5) + ' stars'; }
  /* What a summon gave, in one or two short sentences. */
  function pullText(r, max) {
    max = max || 5;
    if (!r || !r.ok) return '';
    if (!r.duplicate) return 'New figure found.';
    var back = r.refund > 0 ? ' ' + r.refund + ' stardust came back.' : '';
    return (r.count > max ? 'You have this one at ' + max + ' stars already.' : 'You have this one. It is now at ' + starsText(r.stars, max) + '.') + back;
  }
  function failText(reason) {
    return reason === 'dust' ? 'Not enough stardust yet.' : reason === 'empty' ? 'The figure list did not load. Reload the page to try again.'
      : reason === 'storage' ? 'This device could not store that. Nothing was used.' : reason === 'price' ? 'The cost changed. Nothing was used. Check it and try again.' : reason === 'not-owned' ? 'You have not found this figure yet.' : 'That did not work. Try again.';
  }
  /* Emblems are inner svg markup from figures.js. Anything that could run code is not drawn. */
  function emblemOk(s) { return typeof s === 'string' && s !== '' && !/<\s*(script|foreignObject|iframe|image|use|a)\b|\son\w+\s*=|javascript:|href\s*=/i.test(s); }
  function chipLabel(label, dust, name) { return (label || 'Collection') + ': ' + dust + ' stardust' + (name ? ', ' + name + ' equipped' : ''); }
  /* Escape and Android Back close the innermost thing. */
  function backStep(s) { s = s || {}; return !s.open ? null : s.detail ? 'detail' : 'overlay'; }

  var Pure = { TABS: TABS, pickTab: pickTab, safeUrl: safeUrl, hostOf: hostOf, sourceLabel: sourceLabel, years: years, percent: percent, rarityName: rarityName,
    summonLabel: summonLabel, summonNote: summonNote, guaranteeLines: guaranteeLines, starsText: starsText, pullText: pullText, failText: failText,
    emblemOk: emblemOk, chipLabel: chipLabel, backStep: backStep, sameOdds: sameOdds, oddsTitle: oddsTitle, usualLine: usualLine };
  if (typeof module === 'object' && module && module.exports) module.exports = Pure;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  /* ---------- Page ---------- */
  var SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">';
  var SPARK = '<path d="M32 8C33.6 22 42 30.4 56 32C42 33.6 33.6 42 32 56C30.4 42 22 33.6 8 32C22 30.4 30.4 22 32 8Z" fill="currentColor" stroke="none"/>';
  var UNKNOWN = '<circle cx="32" cy="32" r="22" stroke-width="1.6" stroke-dasharray="4 5"/><path d="M26 26a6 6 0 1 1 8.5 5.5c-1.7.9-2.5 2-2.5 4" stroke-width="1.8" stroke-linecap="round"/><circle cx="32" cy="42.5" r="1.3" fill="currentColor" stroke="none"/>';
  function core() { return root.VGCollection || null; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function add(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }
  function button(cls, text, fn) { var b = el('button', cls, text); b.type = 'button'; if (fn) b.addEventListener('click', fn); return b; }
  function art(cls, inner) { var s = el('span', cls); s.setAttribute('aria-hidden', 'true'); s.innerHTML = SVG + inner + '</svg>'; return s; }
  function emblem(f, cls) { return art(cls, f && emblemOk(f.emblem) ? f.emblem : UNKNOWN); }
  function sr(text) { return el('span', 'vgc-sr', text); }
  function starRow(stars, max) {
    var w = el('span', 'vgc-stars'), s = el('span'); s.setAttribute('aria-hidden', 'true');
    s.textContent = new Array(stars + 1).join('★') + new Array(Math.max(0, max - stars) + 1).join('☆');
    return add(w, s, sr(starsText(stars, max)));
  }
  function safe(fn, fallback) { try { var v = fn(); return v == null ? fallback : v; } catch (e) { return fallback; } }
  function maxStars() { var C = core(); return C && C.RULES && C.RULES.maxStars || 5; }
  function focusOn(node) { if (node && typeof node.focus === 'function') try { node.focus({ preventScroll: true }); } catch (e) { try { node.focus(); } catch (e2) { /* nothing to do */ } } }

  var dlg = null, native = false, isOpen = false, tab = 'summon', detail = null, reveal = null, fresh = false, message = '', returnTo = null;
  var titleEl, dustEl, paneEl, liveEl, tabEls = {}, toastBox = null, chips = [], escAt = 0, quotedCost = 0;

  /* ---------- Chips ---------- */
  function drawChip(c) {
    var C = core(), dust = C ? safe(C.dust, 0) : 0, eq = C ? safe(C.equipped, null) : null, name = eq ? eq.figure.name : '';
    var key = dust + '|' + (eq ? eq.id + '|' + eq.rarity : '') + '|' + c.label + '|' + c.name;
    if (c.key === key) return; c.key = key;
    c.el.textContent = '';
    add(c.el, eq ? emblem(eq.figure, 'vgc-chip-emblem is-' + eq.rarity) : art('vgc-chip-emblem is-spark', SPARK),
      c.label ? el('span', 'vgc-chip-label', c.label) : null, el('b', 'vgc-chip-dust', String(dust)));
    /* A pressable chip says what it is: a spoken name, and the same words as a tooltip for a pointer. */
    if (c.press) { var words = chipLabel(c.name || c.label, dust, name); c.el.setAttribute('aria-label', words); c.el.title = words; }
    else c.el.appendChild(sr(' stardust' + (name ? ', ' + name + ' equipped' : '')));
  }
  function chip(node, opts) {
    if (!node || node.nodeType !== 1) return null;
    opts = opts || {};
    var c = node.__vgcChip;
    if (!c) {
      c = node.__vgcChip = { el: node, label: '', name: '', key: null, press: node.tagName === 'BUTTON' || node.tagName === 'A' };
      chips.push(c); node.classList.add('vgc-chip');
      if (c.press) node.addEventListener('click', function (e) { if (node.tagName === 'A') e.preventDefault(); open(); });
    }
    if (typeof opts.label === 'string') c.label = opts.label;
    if (typeof opts.name === 'string') c.name = opts.name;
    drawChip(c);
    return c;
  }
  function drawChips() { chips = chips.filter(function (c) { return c.el.isConnected !== false; }); chips.forEach(drawChip); }

  /* ---------- Toasts ---------- */
  /* A modal dialog covers the page, so a toast has to sit inside the top open dialog to be seen. */
  function toastHost() {
    var open = document.querySelectorAll('dialog[open]'), host = document.body;
    for (var i = 0; i < open.length; i++) { try { if (open[i].matches(':modal')) host = open[i]; } catch (e) { host = open[i]; } }
    if (isOpen && dlg) host = dlg;
    return host;
  }
  function placeToasts() {
    if (!toastBox) { toastBox = el('div', 'vgc-root vgc-toasts'); toastBox.setAttribute('role', 'status'); toastBox.setAttribute('aria-live', 'polite'); }
    var host = toastHost(); if (toastBox.parentNode !== host) host.appendChild(toastBox);
    /* The page's own dialogs (a mission, the settings) close without telling this file, and a closed dialog
       hides what is inside it. So when one closes, the toasts move to wherever they can be seen. */
    if (host !== document.body && host !== dlg && !host.__vgcToastWatch && typeof host.addEventListener === 'function') {
      host.__vgcToastWatch = true;
      host.addEventListener('close', function () {
        if (!toastBox || toastBox.parentNode !== host) return;
        if (toastBox.childNodes.length) placeToasts(); else host.removeChild(toastBox);
      });
    }
  }
  function toast(events) {
    var C = core(), text = typeof events === 'string' ? events : C ? safe(function () { return C.describe(events); }, '') : '';
    refresh();
    if (!text || !document.body) return false;
    placeToasts();
    while (toastBox.childNodes.length >= 3) toastBox.removeChild(toastBox.firstChild);
    var t = add(el('div', 'vgc-toast'), art('vgc-toast-icon', SPARK), el('span', null, text));
    var gone = function () { if (t.parentNode) t.parentNode.removeChild(t); };
    /* A toast takes no presses (collection.css): a press goes to the control underneath. It leaves by itself. */
    setTimeout(gone, 6500);
    toastBox.appendChild(t);
    return true;
  }

  /* ---------- Overlay frame ---------- */
  function say(text) { if (liveEl) { liveEl.textContent = ''; setTimeout(function () { liveEl.textContent = text; }, 30); } }
  function build() {
    if (dlg) return;
    native = typeof root.HTMLDialogElement === 'function' && typeof document.createElement('dialog').showModal === 'function';
    dlg = el(native ? 'dialog' : 'div', 'vgc-root vgc-dialog');
    if (!native) { dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.hidden = true; }
    dlg.setAttribute('aria-labelledby', 'vgc-title');
    var panel = el('div', 'vgc-panel'), head = el('header', 'vgc-head'), names = el('div', 'vgc-head-text');
    titleEl = el('h2', null, 'Your collection'); titleEl.id = 'vgc-title';
    add(names, el('span', 'vgc-eyebrow', 'Collection'), titleEl);
    dustEl = el('p', 'vgc-dust');
    var x = button('vgc-close', '×', function () { close(); }); x.setAttribute('aria-label', 'Close the collection');
    add(head, names, dustEl, x);
    var tabs = el('div', 'vgc-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Collection sections');
    TABS.forEach(function (id) {
      var b = button('vgc-tab', TAB_NAMES[id], function () { show(id); });
      b.id = 'vgc-tab-' + id; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'vgc-pane');
      tabEls[id] = b; tabs.appendChild(b);
    });
    tabs.addEventListener('keydown', function (e) {
      var i = TABS.indexOf(tab), n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : null;
      if (n === null) return;
      e.preventDefault(); show(TABS[(n + TABS.length) % TABS.length]); focusOn(tabEls[tab]);
    });
    paneEl = el('div', 'vgc-pane'); paneEl.id = 'vgc-pane'; paneEl.setAttribute('role', 'tabpanel'); paneEl.tabIndex = -1;
    liveEl = el('p', 'vgc-sr'); liveEl.setAttribute('role', 'status'); liveEl.setAttribute('aria-live', 'polite');
    add(panel, head, tabs, paneEl, liveEl); dlg.appendChild(panel);
    /* A press on the dark area around the panel closes the overlay. */
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); escAt = Date.now(); back(); return; }
      if (e.key !== 'Tab') return;
      /* Keep Tab inside the overlay (the native dialog does most of this; the plain fallback needs it). */
      var f = Array.prototype.filter.call(dlg.querySelectorAll('button,a[href],[tabindex="0"]'), function (n) { return !n.disabled && n.tabIndex >= 0 && n.getClientRects().length; });
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !dlg.contains(at))) { e.preventDefault(); focusOn(last); }
      else if (!e.shiftKey && (at === last || !dlg.contains(at))) { e.preventDefault(); focusOn(first); }
    });
    /* Escape pressed while the focus is outside the panel still reaches the dialog as "cancel". */
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); if (Date.now() - escAt > 150) back(); });
    /* The close event comes later, on its own turn: only tidy up if the dialog really is shut. */
    dlg.addEventListener('close', function () { if (isOpen && !dlg.open) finishClose(); });
    document.body.appendChild(dlg);
  }
  function wrapBack() {
    var prev = root.VectorGuildBack;
    if (prev && prev.__vgc) return;
    var w = function () { if (back()) return true; return typeof prev === 'function' ? !!prev() : false; };
    w.__vgc = true; root.VectorGuildBack = w;
  }
  function open(t) {
    if (!document.body) return;
    build();
    if (isOpen) { if (t != null) show(pickTab(t)); return; }
    returnTo = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
    isOpen = true; tab = pickTab(t); detail = null; reveal = null; fresh = false; message = '';
    wrapBack();
    if (native) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } } else dlg.hidden = false;
    document.documentElement.classList.add('vgc-lock');
    if (toastBox && toastBox.childNodes.length) placeToasts();
    render(); paneEl.scrollTop = 0;
    focusOn(tabEls[tab]);
  }
  function finishClose() {
    isOpen = false; detail = null; reveal = null; message = '';
    document.documentElement.classList.remove('vgc-lock');
    if (toastBox && toastBox.parentNode === dlg) { if (toastBox.childNodes.length) document.body.appendChild(toastBox); else dlg.removeChild(toastBox); }
    var back = returnTo; returnTo = null;
    if (back && back.isConnected !== false && !back.hidden) focusOn(back);
  }
  function close() {
    if (!isOpen || !dlg) return;
    if (native) { try { dlg.close(); } catch (e) { dlg.removeAttribute('open'); } } else dlg.hidden = true;
    finishClose();
  }
  function back() {
    var step = backStep({ open: isOpen, detail: detail });
    if (!step) return false;
    if (step === 'detail') { var id = detail; detail = null; render(); focusOn(tileFor(id) || tabEls[tab]); return true; }
    close(); return true;
  }
  function tileFor(id) { var all = paneEl.querySelectorAll('[data-figure]'); for (var i = 0; i < all.length; i++) if (all[i].getAttribute('data-figure') === id) return all[i]; return null; }
  function show(t) { tab = pickTab(t); detail = null; message = ''; render(); paneEl.scrollTop = 0; }

  /* ---------- Overlay content ---------- */
  function drawHead() {
    var C = core(), dust = C ? safe(C.dust, 0) : 0, n = C ? safe(C.counts, null) : null, ach = C ? safe(C.achievements, []) : [];
    dustEl.textContent = '';
    add(dustEl, art('vgc-dust-icon', SPARK), el('b', null, String(dust)), document.createTextNode(' stardust'));
    var counts = { summon: '', figures: n ? n.owned + '/' + n.total : '', achievements: ach.length ? ach.filter(function (a) { return a.earned; }).length + '/' + ach.length : '' };
    TABS.forEach(function (id) {
      var b = tabEls[id], on = id === tab;
      b.textContent = TAB_NAMES[id];
      if (counts[id]) { var k = el('span', 'vgc-tab-count', counts[id]); k.setAttribute('aria-hidden', 'true'); b.appendChild(k); }
      b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; b.classList.toggle('is-on', on);
    });
    paneEl.setAttribute('aria-labelledby', 'vgc-tab-' + tab);
  }
  function render() {
    if (!dlg || !isOpen) return;
    drawHead();
    paneEl.textContent = '';
    var C = core();
    if (!C) { paneEl.appendChild(el('p', 'vgc-empty', 'The collection did not load. Reload the page to try again.')); return; }
    if (tab === 'summon') drawSummon(C); else if (tab === 'figures') { if (detail && C.figure(detail)) drawCard(C); else { detail = null; drawGrid(C); } } else drawAchievements(C);
    if (C.stored && C.stored() === false) paneEl.appendChild(el('p', 'vgc-warn', 'This device is not storing your collection. It may be gone when you leave this page.'));
  }
  function refresh() {
    drawChips();
    if (!isOpen || !dlg) return;
    /* Do not rebuild under the player's finger or focus; the header is always safe to redraw. */
    if (!paneEl.contains(document.activeElement)) { render(); return; }
    drawHead();
    /* The Summon button must never show an old price or state, so it is brought up to date in place. */
    if (tab === 'summon') syncSummon();
  }
  /* Brings the Summon tab up to date without rebuilding what the player is on: the button's price and state,
     the line under it, and the chances and guarantees (plain text, never focused). */
  function syncSummon() {
    var C = core(), go = document.getElementById('vgc-pull'), note = document.getElementById('vgc-pull-note'), old = document.getElementById('vgc-rules');
    if (!C || !go) return;
    var cost = safe(C.cost, quotedCost), dust = safe(C.dust, 0), n = safe(C.counts, null), can = safe(C.canPull, false), had = document.activeElement === go;
    quotedCost = cost; go.textContent = summonLabel(cost); go.disabled = !can;
    if (note && !message) note.textContent = summonNote(cost, dust, n ? n.total : 0);
    if (old && old.parentNode) try { old.parentNode.replaceChild(rulesBlock(C), old); } catch (e) { /* keep what is shown */ }
    if (had && go.disabled) focusOn(tabEls[tab]);
  }
  function list(cls, lines) { var ul = el('ul', cls); lines.forEach(function (t) { ul.appendChild(el('li', null, t)); }); return ul; }

  function drawSummon(C) {
    var cost = C.cost(), dust = C.dust(), total = C.counts().total, can = C.canPull(), wrap = el('div', 'vgc-summon');
    quotedCost = cost;
    var main = el('section', 'vgc-summon-main');
    main.appendChild(el('p', 'vgc-lead', 'Call a figure from the history of maths and science. Each one has a short life story and one small perk.'));
    if (reveal) main.appendChild(revealCard(C));
    var go = button('vgc-primary vgc-pull', summonLabel(cost), doPull); go.id = 'vgc-pull'; go.disabled = !can;
    go.setAttribute('aria-describedby', 'vgc-pull-note');
    var note = el('p', 'vgc-note' + (message ? ' is-bad' : ''), message || summonNote(cost, dust, total)); note.id = 'vgc-pull-note';
    add(main, go, note);
    add(wrap, main, rulesBlock(C)); paneEl.appendChild(wrap);
  }
  /* Chances, guarantees and the small print. The chances are those of the next summon. */
  function rulesBlock(C) {
    var odds = C.odds(), usual = typeof C.baseOdds === 'function' ? C.baseOdds() : null, R = C.RULES, rules = el('section', 'vgc-rules'); rules.id = 'vgc-rules';
    rules.appendChild(el('h3', 'vgc-h', oddsTitle(odds, usual)));
    var ol = el('ul', 'vgc-odds');
    C.RARITIES.forEach(function (r) {
      var li = el('li', 'is-' + r), bar = el('span', 'vgc-bar'), fill = el('span');
      bar.setAttribute('aria-hidden', 'true'); fill.style.width = percent(odds[r]); bar.appendChild(fill);
      add(li, el('span', 'vgc-odds-name', rarityName(r)), bar, el('b', null, percent(odds[r])));
      ol.appendChild(li);
    });
    rules.appendChild(ol);
    if (usualLine(odds, usual)) rules.appendChild(el('p', 'vgc-note', usualLine(odds, usual)));
    add(rules, el('h3', 'vgc-h', 'Guarantees'), list('vgc-list', guaranteeLines(C.guarantees())), el('h3', 'vgc-h', 'Good to know'),
      list('vgc-list', ['Every common figure is equally likely. The same goes for rare and for legendary.',
        'A figure you already have gains a star, up to ' + R.maxStars + ', and gives stardust back: ' + R.refund.common + ' for common, ' + R.refund.rare + ' for rare, ' + R.refund.legendary + ' for legendary.',
        'Stardust comes only from playing: missions, chapters, review drills and achievements.']));
    return rules;
  }
  function revealCard(C) {
    var r = reveal, f = r.figure, row = safe(function () { return C.figures().filter(function (x) { return x.id === f.id; })[0]; }, null);
    var box = el('div', 'vgc-reveal is-' + r.rarity + (fresh ? ' is-fresh' : '')); box.id = 'vgc-reveal'; box.tabIndex = -1;
    box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Your summon');
    var text = el('div', 'vgc-reveal-text');
    add(text, el('span', 'vgc-tag', (r.duplicate ? 'Found again' : 'New') + ' · ' + rarityName(r.rarity)), el('h3', null, f.name), el('p', 'vgc-known', f.knownFor || ''), el('p', 'vgc-reveal-what', pullText(r, maxStars())));
    (r.events || []).forEach(function (e) { if (e && e.type === 'achievement') text.appendChild(el('p', 'vgc-reveal-ach', 'Achievement: ' + e.name + '. +' + e.dust + ' stardust.')); });
    var acts = el('div', 'vgc-actions');
    acts.appendChild(button('vgc-secondary', 'See the card', function () { tab = 'figures'; detail = f.id; message = ''; render(); paneEl.scrollTop = 0; focusOn(document.getElementById('vgc-card-name')); }));
    if (row && row.owned && !row.equipped) acts.appendChild(button('vgc-secondary', 'Equip', function () { doEquip(f.id, 'vgc-reveal'); }));
    else if (row && row.equipped) acts.appendChild(el('span', 'vgc-pill', 'Equipped'));
    text.appendChild(acts);
    fresh = false;
    return add(box, emblem(f, 'vgc-reveal-emblem'), text);
  }
  function doPull() {
    var C = core(); if (!C) return;
    /* The core is told the price this button showed. If it has changed, nothing is taken. */
    var r = safe(function () { return C.pull(undefined, { expect: quotedCost }); }, { ok: false, reason: 'error' });
    if (r.ok) { reveal = r; fresh = true; message = ''; } else message = failText(r.reason);
    drawChips(); render();
    if (r.ok) {
      say(rarityName(r.rarity) + ' figure: ' + r.figure.name + '. ' + pullText(r, maxStars()));
      var box = document.getElementById('vgc-reveal'); paneEl.scrollTop = 0; focusOn(box);
    } else { say(message); var go = document.getElementById('vgc-pull'); focusOn(go && !go.disabled ? go : tabEls[tab]); }
  }
  function doEquip(id, focusId) {
    var C = core(); if (!C) return;
    var r = safe(function () { return C.equip(id); }, { ok: false, reason: 'error', events: [] }), f = id ? C.figure(id) : null;
    drawChips(); render();
    if (r.ok) { say(f ? f.name + ' is equipped.' : 'No figure is equipped now.'); if (r.events && r.events.length) toast(r.events); }
    else say(failText(r.reason));
    focusOn(document.getElementById(focusId) || tabEls[tab]);
  }

  function drawGrid(C) {
    var rows = C.figures(), n = C.counts(), max = maxStars();
    if (!rows.length) { paneEl.appendChild(el('p', 'vgc-empty', 'The figure list did not load. Reload the page to try again.')); return; }
    var sum = el('p', 'vgc-count'); sum.appendChild(el('b', null, n.owned + ' of ' + n.total + ' found'));
    C.RARITIES.forEach(function (r) { sum.appendChild(el('span', 'is-' + r, rarityName(r) + ' ' + n.byRarity[r].owned + '/' + n.byRarity[r].total)); });
    paneEl.appendChild(sum);
    if (!n.owned) {
      var none = el('div', 'vgc-none');
      add(none, el('p', null, 'No figures yet. ' + (C.cost() > 0 ? 'Summon one to start your collection.' : 'Your first summon is free.')), button('vgc-primary', 'Go to Summon', function () { show('summon'); focusOn(tabEls[tab]); }));
      paneEl.appendChild(none);
    }
    /* Found figures first, each group in list order. */
    var ul = el('ul', 'vgc-grid');
    rows.filter(function (x) { return x.owned; }).concat(rows.filter(function (x) { return !x.owned; })).forEach(function (x) {
      var li = el('li'), t;
      if (x.owned) {
        t = button('vgc-tile is-' + x.rarity + (x.equipped ? ' is-equipped' : ''), null, function () { detail = x.id; message = ''; render(); paneEl.scrollTop = 0; focusOn(document.getElementById('vgc-card-name')); });
        t.setAttribute('data-figure', x.id);
        add(t, emblem(x.figure, 'vgc-tile-emblem'), el('span', 'vgc-tile-name', x.figure.name), el('span', 'vgc-tile-meta', rarityName(x.rarity)), starRow(x.stars, max), x.equipped ? el('span', 'vgc-pill', 'Equipped') : null);
      } else {
        t = el('div', 'vgc-tile is-locked is-' + x.rarity);
        add(t, art('vgc-tile-emblem', UNKNOWN), el('span', 'vgc-tile-name', 'Not found yet'), el('span', 'vgc-tile-meta', rarityName(x.rarity)));
      }
      li.appendChild(t); ul.appendChild(li);
    });
    paneEl.appendChild(ul);
  }
  function fact(dl, name, value) { if (!value) return; var d = el('div'); add(d, el('dt', null, name), el('dd', null, value)); dl.appendChild(d); }
  function part(card, title, text) { if (!text) return; add(card, el('h4', 'vgc-h', title), el('p', 'vgc-text', text)); }
  function drawCard(C) {
    var x = C.figures().filter(function (r) { return r.id === detail; })[0], f = x.figure, max = maxStars(), inApp = !!(root.AndroidSave || root.AndroidSpeech);
    paneEl.appendChild(button('vgc-back', '← All figures', function () { back(); }));
    var card = el('article', 'vgc-card is-' + x.rarity + (x.owned ? '' : ' is-locked')); card.setAttribute('aria-labelledby', 'vgc-card-name');
    var top = el('div', 'vgc-card-top'), tt = el('div', 'vgc-card-title'), h = el('h3', null, x.owned ? f.name : 'Not found yet'); h.id = 'vgc-card-name'; h.tabIndex = -1;
    add(tt, el('span', 'vgc-tag', rarityName(x.rarity) + (f.field ? ' · ' + f.field : '')), h);
    if (!x.owned) { add(top, art('vgc-card-emblem', UNKNOWN), tt); card.appendChild(top); card.appendChild(el('p', 'vgc-text', 'Summon to find this figure.')); paneEl.appendChild(card); return; }
    add(tt, el('p', 'vgc-known', f.knownFor || ''), starRow(x.stars, max));
    add(top, emblem(f, 'vgc-card-emblem'), tt); card.appendChild(top);
    var dl = el('dl', 'vgc-facts'); fact(dl, 'Lived', years(f)); fact(dl, 'Place', f.place); fact(dl, 'Field', f.field);
    card.appendChild(dl);
    part(card, 'Life', f.bio); part(card, 'The idea', f.idea);
    if (x.perk) { card.appendChild(el('h4', 'vgc-h', 'Perk when equipped')); var p = el('p', 'vgc-text vgc-perk'); add(p, el('b', null, x.perk.name + '. '), document.createTextNode(x.perk.text)); card.appendChild(p); }
    var links = (Array.isArray(f.sources) ? f.sources : []).map(safeUrl).filter(Boolean);
    if (links.length) {
      card.appendChild(el('h4', 'vgc-h', 'Sources'));
      var ul = el('ul', 'vgc-sources');
      links.forEach(function (u) {
        /* Same way out as the reading links in app.js: a plain https link. The Android app hands it to the
           phone's browser (MainActivity.shouldOverrideUrlLoading); in a browser it opens a new tab. */
        var a = el('a', 'vgc-link'), li = el('li'); a.href = u; a.rel = 'noopener noreferrer'; if (!inApp) a.target = '_blank';
        var out = el('span', 'vgc-out', ' ↗'); out.setAttribute('aria-hidden', 'true');
        add(a, el('span', null, sourceLabel(u)), out, sr(inApp ? ' (opens in your browser)' : ' (opens in a new tab)'));
        li.appendChild(a); ul.appendChild(li);
      });
      card.appendChild(ul);
    }
    var acts = el('div', 'vgc-actions'), b;
    if (x.equipped) { acts.appendChild(el('span', 'vgc-pill', 'Equipped')); b = button('vgc-secondary', 'Take off', function () { doEquip(null, 'vgc-equip'); }); }
    else b = button('vgc-primary', 'Equip', function () { doEquip(x.id, 'vgc-equip'); });
    b.id = 'vgc-equip'; acts.appendChild(b);
    if (message) acts.appendChild(el('p', 'vgc-note is-bad', message));
    card.appendChild(acts); paneEl.appendChild(card);
  }

  function drawAchievements(C) {
    var all = C.achievements();
    if (!all.length) { paneEl.appendChild(el('p', 'vgc-empty', 'The achievement list did not load. Reload the page to try again.')); return; }
    var sum = el('p', 'vgc-count'); sum.appendChild(el('b', null, all.filter(function (a) { return a.earned; }).length + ' of ' + all.length + ' earned'));
    paneEl.appendChild(sum);
    var ul = el('ul', 'vgc-ach');
    all.forEach(function (a) {
      var li = el('li', 'vgc-ach-item' + (a.earned ? ' is-earned' : '')), text = el('div', 'vgc-ach-text'), side = el('div', 'vgc-ach-side');
      add(text, el('strong', null, a.name), el('p', null, a.text));
      side.appendChild(el('span', 'vgc-ach-reward', '+' + a.reward + ' stardust'));
      if (a.earned) side.appendChild(el('span', 'vgc-pill', 'Earned'));
      else if (a.progress) {
        var bar = el('span', 'vgc-bar'), fill = el('span'); bar.setAttribute('aria-hidden', 'true');
        fill.style.width = Math.round(100 * a.progress.have / a.progress.need) + '%'; bar.appendChild(fill);
        add(side, el('span', 'vgc-ach-progress', a.progress.have + ' of ' + a.progress.need), bar);
      } else side.appendChild(el('span', 'vgc-ach-progress', 'Not yet'));
      add(li, text, side); ul.appendChild(li);
    });
    paneEl.appendChild(ul);
  }

  root.addEventListener('storage', function (e) { if (!e.key || /^vector-guild-save/.test(e.key)) refresh(); });
  root.addEventListener('pageshow', function (e) { if (e.persisted) refresh(); });

  root.VGCollectionUI = { open: open, close: close, toast: toast, chip: chip, refresh: refresh, isOpen: function () { return isOpen; }, back: back, logic: Pure };
})(this);
