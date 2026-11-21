/* Daily review (docs/COLLECTION.md, "Daily review"). Once per local calendar day the home page and each realm
   page show one card: three fresh-number problems from missions the player has already solved, answered in the
   card with the same number reading and the same check as a review drill (Variants.make / Variants.check).
   Finishing all three pays stardust once for that day and counts a day streak; the paying and the streak are in
   collection/core.js (VGCollection.finishDaily, which runs onDailyDone as one step across tabs), so they cannot run
   twice, and the card says "+15" only after the save holds it. State: meta.daily in the v2 save.
   Classic script, no modules, no network. Safe to load where there is no document (qa/harness.js, qa/daily.test.js).

   Where the problems come from
     realm page  this realm only: the pack on the page (window.Variants, window.QUESTS).
     home page   every realm with solved missions. The home page loads no pack, and packs reuse mission ids, so each
                 realm's pack scripts are loaded once, when the player starts, into a hidden same-origin frame.
   The card never writes a realm's slice: the realm page keeps its slice in memory and would overwrite it.

   window.VGDaily
     mount(host, opts)   draws the card into host. opts.scope: 'home' | 'realm'; opts.heading: 'h2' | 'h3'.
     refresh()           redraws the card from the save, unless a review is in progress.
     today()             the local calendar day as a whole number of days since 1970.
     setClock(fn)        tests: fn returns the Date to use as "now" (null puts the device clock back).
                         A page can also set window.VG_DAILY_NOW = () => Date before this script runs.
     logic               pure helpers, run under Node by qa/daily.test.js. */
(function (root) {
  'use strict';
  var DAY_MS = 86400000;
  var FALLBACK = { dust: 15, problems: 3, unlock: 3, milestones: [[3, 20], [7, 40], [14, 80], [30, 150]] };
  function rules() { var C = root.VGCollection; return C && C.DAILY ? C.DAILY : FALLBACK; }
  function isObject(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /* ---------- the date ---------- */
  var clockFn = null;
  function now() {
    try { if (clockFn) return clockFn(); if (typeof root.VG_DAILY_NOW === 'function') return root.VG_DAILY_NOW(); } catch (e) { /* fall through */ }
    return new Date();
  }
  /* The calendar day the device shows, as days since 1970: local midnight to local midnight is one day. */
  function dayOf(d) {
    if (!d || typeof d.getFullYear !== 'function') d = new Date(d);
    var n = Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
    return Number.isFinite(n) ? n : 0;
  }
  function today() { return dayOf(now()); }

  /* ---------- reading a typed number: the same rules as the mission and drill fields (app.js) ---------- */
  function parseNumber(raw) {
    var t = String(raw == null ? '' : raw).trim().replace(/[−–]/g, '-').replace(/\s+/g, ' '); if (!t) return NaN;
    var m = t.match(/^([-+]?)(?:(\d+) )?(\d+) ?\/ ?(\d+)$/);
    if (m) { var d = Number(m[4]); if (!d) return NaN; var v = Number(m[2] || 0) + Number(m[3]) / d; return m[1] === '-' ? -v : v; }
    var plain = t.replace(',', '.');
    return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(plain) ? Number(plain) : NaN;
  }
  var GROUPED = /^[-+]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/;
  function readNumber(raw, fits) {
    var v = parseNumber(raw), t = String(raw == null ? '' : raw).trim().replace(/[−–]/g, '-');
    if (!GROUPED.test(t)) return v;
    var g = Number(t.replace(/,/g, ''));
    return !Number.isFinite(v) || (fits && !fits(v) && fits(g)) ? g : v;
  }

  /* ---------- what the card says today ---------- */
  /* daily: meta.daily (or nothing); day: today; solved: missions solved in the card's scope.
     state  'done'    today's review is paid
            'clock'   the device's date is earlier than the last paid day: nothing can be earned until it passes
            'locked'  fewer than three missions solved
            'ready'   there is a review to do
     streak the streak as it stands today: 0 after a missed day (nothing else is lost). */
  function status(daily, day, solved) {
    var R = rules(), d = isObject(daily) ? daily : {}, last = Number.isInteger(d.day) ? d.day : null;
    var kept = last === null ? 0 : (Number.isInteger(d.streak) && d.streak > 0 ? d.streak : 1);
    var best = Math.max(Number.isInteger(d.best) ? d.best : 0, kept), paid = Array.isArray(d.paid) ? d.paid : [];
    var state = last !== null && day < last ? 'clock' : last !== null && day === last ? 'done' : (solved | 0) < R.unlock ? 'locked' : 'ready';
    var alive = last !== null && day <= last + 1, streak = alive ? kept : 0;
    var progress = state === 'ready' && isObject(d.at) && d.at.day === day && Number.isInteger(d.at.n) ? Math.max(0, Math.min(R.problems - 1, d.at.n)) : 0;
    var next = null;
    for (var i = 0; i < R.milestones.length && !next; i++) { var ms = R.milestones[i]; if (ms[0] > streak && paid.indexOf(ms[0]) < 0) next = { days: ms[0], dust: ms[1], left: ms[0] - streak }; }
    return { state: state, streak: streak, best: best, lapsed: last !== null && !alive && kept > 0, progress: progress, next: next, last: last, need: Math.max(0, R.unlock - (solved | 0)) };
  }

  /* ---------- which missions to ask ---------- */
  /* A practice mission (q07b) belongs to its learn mission's concept (q07) and shares its problem model. */
  function conceptId(id) { var m = /^(q\d+)[a-z]$/.exec(id); return m ? m[1] : id; }
  function solvedIds(slice) {
    var out = [], seen = {};
    if (isObject(slice) && Array.isArray(slice.solved)) slice.solved.forEach(function (id) { if (typeof id === 'string' && id && !has(seen, id)) { seen[id] = 1; out.push(id); } });
    return out;
  }
  /* An open notebook entry: a miss that no later passed drill has closed (the rule app.js uses). */
  function openError(slice, id) {
    var e = isObject(slice.errors) && has(slice.errors, id) ? slice.errors[id] : null, r = isObject(slice.reviews) && has(slice.reviews, id) ? slice.reviews[id] : null;
    return isObject(e) && !(isObject(r) && r.n > 0 && r.last > e.last);
  }
  /* One entry per solved concept that has a problem model. lib: { has(id), quest(id) } for that realm.
     stale: days since the concept was last practised (a review drill, or an earlier daily review), 60 when never
     or longer. misses: notebook misses while the entry is open, else 0. */
  function pool(realmId, slice, lib, daily, day) {
    var out = [], seen = {}, asked = isObject(daily) && isObject(daily.seen) ? daily.seen : {};
    solvedIds(slice).forEach(function (id) {
      var q = lib.quest(id), cid = q && typeof q.parent === 'string' ? q.parent : conceptId(id);
      if (has(seen, cid) || !lib.has(cid)) return; seen[cid] = 1;
      var r = isObject(slice.reviews) && has(slice.reviews, cid) ? slice.reviews[cid] : null, last = null, key = realmId + ':' + cid;
      if (isObject(r) && Number.isFinite(r.last) && r.last > 0) last = dayOf(new Date(r.last));
      if (has(asked, key) && Number.isInteger(asked[key]) && (last === null || asked[key] > last)) last = asked[key];
      var open = openError(slice, cid), c = lib.quest(cid) || q || {};
      out.push({ realm: realmId, id: cid, key: key, title: String(c.title || cid.toUpperCase()), topic: String(c.topic || ''),
        stale: last === null ? 60 : Math.max(0, Math.min(60, day - last)), misses: open ? Math.max(1, Number.isInteger(slice.errors[cid].n) ? slice.errors[cid].n : 1) : 0 });
    });
    return out;
  }
  /* Least recently practised first, and concepts with notebook misses well ahead of the rest. */
  function weight(e) { return 1 + e.stale + (e.misses > 0 ? 30 + 5 * Math.min(e.misses, 6) : 0); }
  /* n entries by weighted draw without repeats; with fewer than n concepts, the ones drawn come round again
     (each time with new numbers). rng returns a number in [0, 1). */
  function pick(list, n, rng) {
    var rest = (Array.isArray(list) ? list : []).slice(), out = [], next = typeof rng === 'function' ? rng : Math.random;
    while (out.length < n && rest.length) {
      var total = rest.reduce(function (s, e) { return s + weight(e); }, 0), x = next();
      x = (Number.isFinite(x) && x >= 0 && x < 1 ? x : 0) * total;
      var i = 0; for (; i < rest.length - 1; i++) { x -= weight(rest[i]); if (x < 0) break; }
      out.push(rest.splice(i, 1)[0]);
    }
    for (var k = 0, base = out.length; base && out.length < n; k++) out.push(out[k % base]);
    return out;
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  /* The toast for the events VGCollection.onDailyDone returned ('' when nothing was paid). */
  function rewardLine(events) {
    var dust = 0, parts = [];
    (Array.isArray(events) ? events : []).forEach(function (e) {
      if (!isObject(e)) return; dust += Number.isFinite(e.dust) ? e.dust : 0;
      if (e.type === 'daily') parts.push('daily review done'); else if (e.type === 'streak') parts.push(e.days + '-day streak');
      else if (e.type === 'achievement') parts.push('achievement: ' + e.name);
    });
    return dust > 0 ? '+' + dust + ' stardust · ' + parts.join(', ') : '';
  }
  var Logic = { dayOf: dayOf, status: status, conceptId: conceptId, solvedIds: solvedIds, openError: openError, pool: pool, weight: weight, pick: pick,
    parseNumber: parseNumber, readNumber: readNumber, rewardLine: rewardLine, plural: plural };
  var API = { logic: Logic, today: today, setClock: function (fn) { clockFn = typeof fn === 'function' ? fn : null; }, mount: function () {}, refresh: function () {} };
  root.VGDaily = API;
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;

  /* ---------- the save ---------- */
  function store() { var S = root.VGSave; return S && !S.fallback && typeof S.meta === 'function' && typeof S.putMeta === 'function' ? S : null; }
  function dailyNow() { try { var S = store(), m = S && S.meta(); return m && isObject(m.daily) ? m.daily : null; } catch (e) { return null; } }
  function patchDaily(change) {
    try {
      var S = store(); if (!S) return false;
      var m = S.meta(), d = isObject(m.daily) ? m.daily : (m.daily = { day: null, streak: 0, best: 0, paid: [], seen: {} });
      if (!isObject(d.seen)) d.seen = {};
      change(d); return S.putMeta(m);
    } catch (e) { return false; }
  }
  function slices() { try { var S = store(), all = S && S.exportAll(); return all && isObject(all.realms) ? all.realms : {}; } catch (e) { return {}; } }
  function pageRealmId() { var R = root.REALM; return isObject(R) && typeof (R.saveId || R.id) === 'string' ? (R.saveId || R.id) : null; }
  var SAFE_ID = /^[a-z0-9]+$/;
  /* The realms the card draws from: [id, slice]. */
  function scopeSlices(scope) {
    var all = slices(), out = [];
    if (scope === 'realm') { var id = pageRealmId(); if (id && has(all, id) && isObject(all[id])) out.push([id, all[id]]); return out; }
    Object.keys(all).forEach(function (id) { if (SAFE_ID.test(id) && isObject(all[id]) && solvedIds(all[id]).length) out.push([id, all[id]]); });
    return out;
  }
  function realmName(id) {
    if (pageRealmId() === id && root.REALM.name) return String(root.REALM.name);
    var name = id;
    (Array.isArray(root.VG_REALMS) ? root.VG_REALMS : []).forEach(function (node) { (node && Array.isArray(node.parts) ? node.parts : []).forEach(function (p) { if (p && p.id === id) name = String(p.name || node.name || id); }); });
    return name;
  }

  /* ---------- a realm's problem models ---------- */
  function libOf(w) {
    var V = w && w.Variants; if (!V || typeof V.make !== 'function' || typeof V.check !== 'function') return null;
    var by = {}; (Array.isArray(w.QUESTS) ? w.QUESTS : []).forEach(function (q) { if (q && typeof q.id === 'string') by[q.id] = q; });
    return { has: function (id) { try { return !!V.has(id); } catch (e) { return false; } }, quest: function (id) { return has(by, id) ? by[id] : null; },
      make: function (id) { return V.make(id); }, check: function (v, x) { return V.check(v, x); },
      show: function (n) { return String(typeof V.show === 'function' ? V.show(n) : n).replace(/-/g, '−'); } };
  }
  /* Home page: the pack's scripts run in a hidden frame of their own, so two realms' q01 never meet.
     The frame is written with document.write, so it has this page's origin and base address (works from file://). */
  var frames = {};
  API._frame = function (id) { if (has(frames, id)) frames[id].done(); };
  function sandbox(id, cb) {
    if (pageRealmId() === id) { cb(libOf(root)); return; }
    if (!SAFE_ID.test(id)) { cb(null); return; }
    if (has(frames, id)) { if (frames[id].ready) cb(frames[id].lib); else frames[id].wait.push(cb); return; }
    var f = document.createElement('iframe'), rec = frames[id] = { ready: false, lib: null, wait: [cb], done: null };
    rec.done = function () {
      if (rec.ready) return; rec.ready = true;
      try { rec.lib = libOf(f.contentWindow); } catch (e) { rec.lib = null; }
      rec.wait.splice(0).forEach(function (fn) { fn(rec.lib); });
    };
    f.hidden = true; f.className = 'vgd-frame'; f.tabIndex = -1; f.title = 'Daily review data'; f.setAttribute('aria-hidden', 'true');
    try {
      (document.body || document.documentElement).appendChild(f);
      var d = f.contentWindow.document, tag = function (body, src) { return '<script' + (src ? ' src="' + src + '"' : '') + '>' + body + '<\/script>'; };
      d.open();
      d.write('<!doctype html><html><head><meta charset="utf-8"></head><body>' + tag('', 'realms/packs.js') +
        tag('(function(){var p=(window.VG_PACKS||{})["' + id + '"];if(p&&p.status!=="coming"&&p.scripts)p.scripts.forEach(function(f){document.write(\'<script src="\'+f+\'"><\\/script>\')})})()') +
        tag('try{parent.VGDaily._frame("' + id + '")}catch(e){}') + '</body></html>');
      d.close();
    } catch (e) { rec.done(); return; }
    setTimeout(rec.done, 12000);
  }

  /* ---------- the card ---------- */
  var M = null;   /* { host, scope, heading, session } */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function button(cls, text, onClick) { var b = el('button', cls, text); b.type = 'button'; b.addEventListener('click', onClick); return b; }
  function solvedInScope() { return scopeSlices(M.scope).reduce(function (n, pair) { return n + solvedIds(pair[1]).length; }, 0); }
  function streakText(st) { return 'Day streak: ' + st.streak + (st.best > st.streak ? ' · best ' + st.best : ''); }
  function frame(st) {
    var card = el('section', 'vgd'), head = el('div', 'vgd-head'), h = el(M.heading, 'vgd-title', 'Daily review');
    h.id = 'vgd-title'; card.setAttribute('aria-labelledby', 'vgd-title'); card.setAttribute('data-state', st.state);
    head.appendChild(h); head.appendChild(el('span', 'vgd-streak', streakText(st)));
    var body = el('div', 'vgd-body'); card.appendChild(head); card.appendChild(body);
    M.host.textContent = ''; M.host.appendChild(card);
    return body;
  }
  function milestoneLine(st) {
    return st.next ? plural(st.next.left, 'more day', 'more days') + ' in a row for the ' + st.next.days + '-day bonus: ' + st.next.dust + ' stardust.' : '';
  }
  function drawIdle() {
    if (!M) return;
    M.session = null;
    if (!store() || !root.VGCollection || typeof root.VGCollection.onDailyDone !== 'function') { M.host.textContent = ''; M.host.hidden = true; return; }
    M.host.hidden = false;
    var R = rules(), st = status(dailyNow(), today(), solvedInScope()), body = frame(st);
    if (st.state === 'done') {
      body.appendChild(el('p', 'vgd-text', 'Done for today. Come back tomorrow for three new problems.'));
      if (st.next) body.appendChild(el('p', 'vgd-note', milestoneLine(st)));
    } else if (st.state === 'clock') {
      body.appendChild(el('p', 'vgd-text', 'The date on this device is earlier than your last daily review. The next review opens once the date has passed that day. Nothing was lost.'));
    } else if (st.state === 'locked') {
      body.appendChild(el('p', 'vgd-text', 'Three short problems a day, with fresh numbers, from missions you have already solved. It unlocks after three solved missions' + (M.scope === 'realm' ? ' in this realm' : '') + '.'));
      body.appendChild(el('p', 'vgd-note', st.need === R.unlock ? 'Solve three missions to unlock it.' : 'Solve ' + plural(st.need, 'more mission', 'more missions') + ' to unlock it.'));
    } else {
      body.appendChild(el('p', 'vgd-text', 'Three short problems with fresh numbers, from missions you have already solved. Finish all three for ' + R.dust + ' stardust.'));
      if (st.lapsed) body.appendChild(el('p', 'vgd-note', 'You missed a day, so your streak starts again today. Nothing was taken away: your stardust is safe, and your best streak of ' + plural(st.best, 'day', 'days') + ' still stands.'));
      else if (st.next) body.appendChild(el('p', 'vgd-note', st.streak ? 'Keep the streak going: ' + milestoneLine(st) : 'Do it several days in a row for bonus stardust at 3, 7, 14 and 30 days.'));
      var row = el('div', 'vgd-actions');
      row.appendChild(button('vgd-btn vgd-primary', st.progress ? 'Continue: ' + st.progress + ' of ' + R.problems + ' done' : 'Start today’s review', start));
      body.appendChild(row);
    }
  }
  function message(text) {
    var st = status(dailyNow(), today(), solvedInScope()), body = frame(st);
    body.appendChild(el('p', 'vgd-text', text));
    return body;
  }
  /* Loads the problem models of every realm in scope, draws the three missions, and shows the first problem. */
  function start() {
    if (!M) return;
    var R = rules(), day = today(), daily = dailyNow(), st = status(daily, day, solvedInScope());
    if (st.state !== 'ready') { drawIdle(); return; }
    var pairs = scopeSlices(M.scope), left = pairs.length, all = [], libs = {}, session = M.session = { day: day, loading: true };
    message('Loading today’s problems…').setAttribute('aria-live', 'polite');
    if (!left) { drawIdle(); return; }
    pairs.forEach(function (pair) {
      sandbox(pair[0], function (lib) {
        if (lib) { libs[pair[0]] = lib; try { all = all.concat(pool(pair[0], pair[1], lib, daily, day)); } catch (e) { /* that realm is skipped */ } }
        if (--left || !M || M.session !== session) return;
        var items = pick(all, R.problems);
        if (!items.length) {
          M.session = null;
          message(Object.keys(libs).length ? 'None of your solved missions has a short problem yet. Solve one more mission and come back.' : 'Today’s problems could not be loaded here. Open a realm and use the daily review on its page.');
          return;
        }
        M.session = { day: day, items: items, libs: libs, i: Math.min(st.progress, items.length - 1), misses: 0, variant: null };
        drawProblem(true);
      });
    });
  }
  function drawProblem(focus) {
    var s = M.session, R = rules(), item = s.items[s.i], lib = s.libs[item.realm], v = null;
    try { v = lib.make(item.id); } catch (e) { v = null; }
    if (!v || !Number.isFinite(v.target)) { advance(false); return; }
    s.variant = v;
    var st = status(dailyNow(), s.day, R.unlock), body = frame(st), inputId = 'vgd-answer';
    var step = el('p', 'vgd-step', 'Problem ' + (s.i + 1) + ' of ' + s.items.length + ' · ' + realmName(item.realm) + (item.topic ? ' · ' + item.topic : ''));
    body.appendChild(step);
    if (v.setup) body.appendChild(el('p', 'vgd-text', v.setup));
    var ask = el('p', 'vgd-text'); ask.appendChild(el('b', null, v.prompt)); ask.appendChild(document.createTextNode(' ' + (v.note || 'Answers within 2% are accepted.'))); body.appendChild(ask);
    var field = el('div', 'vgd-field'), label = el('label', 'vgd-label', v.label || 'ANSWER'), input = el('input', 'vgd-input');
    label.htmlFor = inputId; input.id = inputId; input.type = 'text'; input.setAttribute('inputmode', 'decimal'); input.autocomplete = 'off'; input.setAttribute('autocapitalize', 'off'); input.spellcheck = false;
    input.setAttribute('aria-describedby', 'vgd-feedback');
    field.appendChild(label); field.appendChild(input); body.appendChild(field);
    var row = el('div', 'vgd-actions'), out = el('p', 'vgd-feedback'); out.id = 'vgd-feedback'; out.setAttribute('aria-live', 'polite');
    var check = button('vgd-btn vgd-primary', 'Check', function () {
      var raw = readNumber(input.value, function (x) { return lib.check(v, x); });
      if (!Number.isFinite(raw)) { out.textContent = 'Enter a number first.'; return; }
      var ok = lib.check(v, raw), last = s.i === s.items.length - 1;
      check.disabled = true; check.hidden = true; input.readOnly = true; out.setAttribute('data-ok', ok ? 'yes' : 'no');
      var after;
      if (ok) {
        out.textContent = 'Correct. ' + (v.formula || '');
        after = button('vgd-btn vgd-primary', last ? 'Finish' : 'Next problem', function () { advance(true); });
      } else if (s.misses < 1) {
        s.misses++;
        out.textContent = 'Not quite: ' + (v.label || 'the answer') + ' = ' + lib.show(v.target) + '. ' + (v.formula || '') + ' Try it once more with new numbers.';
        after = button('vgd-btn vgd-primary', 'Try new numbers', function () { drawProblem(true); });
      } else {
        out.textContent = 'Not quite: ' + (v.label || 'the answer') + ' = ' + lib.show(v.target) + '. ' + (v.formula || '') + ' That is fine. This one will come back another day.';
        after = button('vgd-btn vgd-primary', last ? 'Finish' : 'Next problem', function () { advance(false); });
      }
      row.appendChild(after); try { after.focus(); } catch (e) { /* ignore */ }
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !check.disabled) { e.preventDefault(); check.click(); } });
    row.appendChild(check); body.appendChild(row); body.appendChild(out);
    body.appendChild(el('p', 'vgd-hint', 'Decimals or fractions are accepted, for example 1.5 or 7/6.'));
    if (focus) try { input.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
  /* The problem is over (passed, or missed twice). Stores how far today's review is, then the next one or the reward. */
  function advance(passed) {
    var s = M.session; if (!s || s.closing || !s.items) return;
    var item = s.items[s.i], n = s.i + 1, lastOne = n >= s.items.length;
    s.misses = 0; s.i = n; if (lastOne) s.closing = true; /* a second press on Finish does nothing */
    /* A missed concept is not marked as practised, so it stays near the front of the queue. */
    patchDaily(function (d) { if (passed) d.seen[item.key] = s.day; if (!lastOne && !(Number.isInteger(d.day) && d.day >= s.day)) d.at = { day: s.day, n: n }; });
    if (!lastOne) { drawProblem(true); return; }
    /* The reward is drawn when the collection reports back: at once, or as soon as this tab holds the save's lock. */
    var C = root.VGCollection, shown = false;
    var show = function (events) { if (shown) return; shown = true; if (M && M.session === s) finished(s, Array.isArray(events) ? events : []); };
    try { if (typeof C.finishDaily === 'function') C.finishDaily(s.day, show); else show(C.onDailyDone(s.day)); } catch (e) { show([]); }
  }
  function finished(s, events) {
    M.session = null;
    var st = status(dailyNow(), s.day, rules().unlock), body = frame(st), paid = events.filter(function (e) { return e && (e.type === 'daily' || e.type === 'streak'); });
    if (paid.length) {
      var dust = paid.reduce(function (t, e) { return t + e.dust; }, 0), lines = paid.filter(function (e) { return e.type === 'streak'; }).map(function (e) { return e.dust + ' for your ' + e.days + '-day streak'; });
      var done = el('p', 'vgd-text', 'All three done. +' + dust + ' stardust' + (lines.length ? ': ' + rules().dust + ' for today, ' + lines.join(', ') + '.' : '.')); done.tabIndex = -1; body.appendChild(done);
      body.appendChild(el('p', 'vgd-note', 'Day streak: ' + st.streak + '. ' + (st.next ? milestoneLine(st) + ' ' : '') + 'Come back tomorrow for three new problems.'));
      try { done.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      var UI = root.VGCollectionUI; try { if (UI && typeof UI.toast === 'function') UI.toast(rewardLine(events)); } catch (e) { /* ignore */ }
    } else if (st.state === 'done') {
      body.appendChild(el('p', 'vgd-text', 'All three done. Today’s stardust was already paid, so nothing more is added. Come back tomorrow for three new problems.'));
    } else {
      body.appendChild(el('p', 'vgd-text', 'All three done, but this device could not store the reward. Your other progress is unchanged.'));
    }
  }

  function refresh() { if (M && !M.session) drawIdle(); }
  function mount(host, opts) {
    if (!host) return;
    opts = opts || {};
    M = { host: host, scope: opts.scope === 'realm' ? 'realm' : 'home', heading: opts.heading === 'h3' ? 'h3' : 'h2', session: null };
    host.classList.add('vgd-slot');
    drawIdle();
  }
  API.mount = mount; API.refresh = refresh;
  if (typeof root.addEventListener === 'function') {
    root.addEventListener('storage', function (e) { if (!e.key || /^vector-guild-save/.test(e.key)) refresh(); });
    root.addEventListener('pageshow', function (e) { if (e.persisted) refresh(); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
  }

  /* ---------- realm page: the card sits in the campaign view, right after the review-drill bar ----------
     app.js redraws #content on every change, so the card's own element is kept and put back each time. */
  function realmPage() {
    var content = document.getElementById('content');
    if (!content || !root.VG_PACK_ID || !pageRealmId() || typeof root.MutationObserver !== 'function') return;
    var host = el('div');
    mount(host, { scope: 'realm', heading: 'h3' });
    var place = function () {
      if (content.contains(host)) return;
      var bar = content.querySelector('.review-bar'); if (!bar || !bar.parentNode) return;
      bar.parentNode.insertBefore(host, bar.nextSibling); refresh();
    };
    new root.MutationObserver(place).observe(content, { childList: true });
    place();
  }
  try { realmPage(); } catch (e) { /* the card is optional */ }
})(typeof window !== 'undefined' ? window : this);
