/* The collection: stardust, summoned figures, perks and achievements (docs/COLLECTION.md).
   Pure logic over VGSave.meta() / VGSave.putMeta(); no DOM. The interface (collection/ui.js, the shell and
   the realm page) calls this and draws what it returns. The exact API is in docs/COLLECTION-API.md.
   Reads window.VG_FIGURES, window.VG_ACHIEVEMENTS, window.VG_REALMS and, on a realm page, window.REALM,
   window.CHAPTERS and window.QUESTS, each time they are needed, so script order does not matter.
   Every call reads the save again, so two open pages do not overwrite each other's collection.
   Nothing here changes XP, answers, hints or what counts as solved. */
window.VGCollection = (() => {
  'use strict';
  const RULES = Object.freeze({
    solve: 10, star: 5, chapter: 25, drill: 2,          /* stardust per event */
    cost: 60,                                           /* one summon; the first one ever is free */
    rates: Object.freeze({ common: 0.70, rare: 0.24, legendary: 0.06 }),
    rareEvery: 5, legendEvery: 20,                      /* guarantees */
    refund: Object.freeze({ common: 20, rare: 35, legendary: 60 }),
    maxStars: 5,
    perkStardust: 0.10, perkChapter: 15, perkDrill: 2   /* +10% rounded up, +15 per chapter, drills x2 */
  });
  const RARITIES = ['common', 'rare', 'legendary'];
  const PERKS = Object.freeze({
    stardust: Object.freeze({ id: 'stardust', name: 'Star gatherer', text: 'Missions give 10% more stardust.' }),
    chapter: Object.freeze({ id: 'chapter', name: 'Chapter bonus', text: 'Each chapter you finish gives 15 extra stardust.' }),
    secondlook: Object.freeze({ id: 'secondlook', name: 'Second look', text: 'Once per mission, a wrong first check does not cost the first-try star.' }),
    drill: Object.freeze({ id: 'drill', name: 'Drill partner', text: 'Review drills give double stardust.' })
  });
  const isObject = o => !!o && typeof o === 'object' && !Array.isArray(o);
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const isText = x => typeof x === 'string' && x !== '';
  const PRACTICE_ID = /^q\d+[a-z]$/;
  /* Realm ids index plain objects. Writing the key "__proto__" would swap the object's prototype instead of
     adding a key, so a slice with that name (only a damaged or hand-edited backup has one) is left alone.
     Every read of a realm's record goes through has(), so names like "constructor" are ordinary keys. */
  const safeId = id => isText(id) && id !== '__proto__';
  const texts = a => Array.isArray(a) ? [...new Set(a.filter(isText))] : [];
  const store = () => window.VGSave || null;
  const EMPTY = () => ({ v: 1, dust: 0, earned: 0, owned: {}, equipped: null, ach: [], pulls: 0, sinceRare: 0, sinceLegend: 0, paid: {}, drills: 0, looks: {} });
  function read() { try { const s = store(); if (s) return s.meta(); } catch (e) { /* fall through */ } return EMPTY(); }
  /* Whether the last change reached the device's storage. False on a page that only holds it in memory. */
  let lastStored = true;
  /* Stores a changed collection. `before` is the collection as text before the change. Returns true when the
     change holds: it was stored, or (storage blocked altogether) this page keeps it in memory, as it does for
     realm progress. A device that can read its save but not write it keeps the old collection: false. */
  function commit(m, before) {
    const s = store(); if (!s) return false;
    let ok = false; try { ok = s.putMeta(m) === true; } catch (e) { ok = false; }
    lastStored = ok; if (ok) return true;
    try { return JSON.stringify(s.meta()) !== before; } catch (e) { return false; }
  }

  /* ---------- figures ---------- */
  const figureList = () => Array.isArray(window.VG_FIGURES) ? window.VG_FIGURES.filter(f => isObject(f) && isText(f.id)) : [];
  const figure = id => figureList().find(f => f.id === id) || null;
  const rarityOf = f => f && RARITIES.includes(f.rarity) ? f.rarity : 'common';
  /* The legacy perk id "xp" means "chapter". An id this build does not know gives no perk. */
  const perkOf = f => { const p = f && (f.perk === 'xp' ? 'chapter' : f.perk); return isText(p) && has(PERKS, p) ? p : null; };
  const starsFor = n => Math.max(0, Math.min(RULES.maxStars, Number.isInteger(n) ? n : 0));
  const perkInfo = id => { const p = id === 'xp' ? 'chapter' : id; return isText(p) && has(PERKS, p) ? PERKS[p] : null; };

  /* ---------- the realm on this page ---------- */
  /* A realm page knows its chapters; the star map does not. Chapters can only be paid where they are known. */
  function pageRealm() {
    const R = window.REALM, chapters = window.CHAPTERS, quests = window.QUESTS;
    if (!isObject(R) || !Array.isArray(chapters) || !Array.isArray(quests)) return null;
    const id = R.saveId || R.id; if (!isText(id)) return null;
    /* learn: the learn missions, one per concept. A mission with a parent is practice for that concept (docs/PACK-FORMAT.md). */
    return { id, missions: quests.length, learn: quests.filter(q => !(q && q.parent)).length, ids: quests.map(q => q.id), chapters: chapters.map((c, i) => ({ index: i, name: c.name, ids: (c.ids || []).slice() })) };
  }
  function tidyRealm(rc) {
    if (!isObject(rc) || !isText(rc.id)) return null;
    const chapters = (Array.isArray(rc.chapters) ? rc.chapters : []).map((c, i) => isObject(c) ? { index: Number.isInteger(c.index) && c.index >= 0 ? c.index : i, name: isText(c.name) ? c.name : '', ids: texts(c.ids) } : null).filter(Boolean);
    return { id: rc.id, missions: Number.isInteger(rc.missions) && rc.missions > 0 ? rc.missions : null, learn: Number.isInteger(rc.learn) && rc.learn > 0 ? rc.learn : null, ids: Array.isArray(rc.ids) ? new Set(texts(rc.ids)) : null, chapters };
  }
  const realmOf = rc => tidyRealm(rc === undefined || rc === null ? pageRealm() : rc);
  function slices() { try { const s = store(), all = s && s.exportAll(); return all && isObject(all.realms) ? all.realms : {}; } catch (e) { return {}; } }

  /* ---------- achievement context: built from the save only ---------- */
  function context(m, realms, rc) {
    /* missions: every mission of a realm, learn and practice. learns: its learn missions alone, where the registry
       or the realm page says so; a realm without practice missions has no entry and its learn count is its mission count. */
    const missions = {}, learns = {};
    for (const node of Array.isArray(window.VG_REALMS) ? window.VG_REALMS : []) for (const p of (node && Array.isArray(node.parts) ? node.parts : [])) if (isObject(p) && isText(p.id) && Number.isInteger(p.missions) && p.missions > 0) { missions[p.id] = p.missions; if (Number.isInteger(p.learn) && p.learn > 0) learns[p.id] = p.learn; }
    /* The realm page counts the missions that are written. While a pack's planned practice missions are still being
       written the registry plans more than the page has, and the larger number stands, so "every mission" is never
       reached early. */
    if (rc && rc.missions) missions[rc.id] = Math.max(rc.missions, has(missions, rc.id) ? missions[rc.id] : 0);
    if (rc && rc.learn) learns[rc.id] = rc.learn;
    const ctx = { solved: 0, practice: 0, stars: 0, chapters: 0, landmarks: 0, realmsWithSolves: 0, realms: {}, landmarkRealm: false,
      drills: m.drills, pulls: m.pulls, figures: 0, copiesMax: 0, legendary: false, equipped: !!m.equipped, fieldBest: { have: 0, need: 1 }, fieldDone: false };
    for (const [id, slice] of Object.entries(realms)) {
      if (!isObject(slice) || !safeId(id)) continue;
      const solved = texts(slice.solved), done = new Set(solved), stars = texts(slice.clean).filter(q => done.has(q)).length;
      const landmarks = Array.isArray(slice.landmarks) ? new Set(slice.landmarks.filter(n => Number.isInteger(n) && n >= 0)).size : 0;
      const chapters = has(m.paid, id) ? m.paid[id].chapters.length : 0, total = has(missions, id) ? missions[id] : null;
      const finished = total !== null && solved.length >= total;
      /* A practice mission's id is its learn mission's id and a letter (q01b). complete: every concept is learned,
         which is what finishes the chapters; finished: every mission is solved, practice included. */
      const learned = solved.filter(q => !PRACTICE_ID.test(q)).length, learn = total === null ? null : has(learns, id) ? Math.min(learns[id], total) : total;
      const complete = learn !== null && learned >= learn;
      ctx.realms[id] = { solved: solved.length, stars, chapters, landmarks, missions: total, finished, learn, learned, complete };
      ctx.solved += solved.length; ctx.practice += solved.length - learned; ctx.stars += stars; ctx.chapters += chapters; ctx.landmarks += landmarks;
      if (solved.length) ctx.realmsWithSolves++;
      /* Each chapter has one landmark, and a realm with every concept learned has every chapter paid. */
      if (complete && chapters > 0 && landmarks >= chapters) ctx.landmarkRealm = true;
    }
    const counts = Object.values(m.owned);
    ctx.figures = counts.length; ctx.copiesMax = counts.length ? Math.max(...counts) : 0;
    const fields = new Map();
    for (const f of figureList()) {
      const mine = has(m.owned, f.id);
      if (mine && rarityOf(f) === 'legendary') ctx.legendary = true;
      const key = isText(f.field) ? f.field : ''; if (!fields.has(key)) fields.set(key, { have: 0, need: 0 });
      const g = fields.get(key); g.need++; if (mine) g.have++;
    }
    /* A field with a single figure would be no set at all, so such fields only count when there is no larger one. */
    let groups = [...fields.values()]; if (groups.some(g => g.need >= 2)) groups = groups.filter(g => g.need >= 2);
    /* The field closest to complete: the highest share owned, and among equals the one with fewest still missing. */
    let best = null;
    for (const g of groups) { if (!best || g.have * best.need > best.have * g.need || (g.have * best.need === best.have * g.need && g.need - g.have < best.need - best.have)) best = g; if (g.have >= g.need) ctx.fieldDone = true; }
    if (best) ctx.fieldBest = { have: best.have, need: best.need };
    return ctx;
  }
  const defs = () => Array.isArray(window.VG_ACHIEVEMENTS) ? window.VG_ACHIEVEMENTS.filter(a => isObject(a) && isText(a.id) && typeof a.test === 'function') : [];
  const rewardOf = a => Number.isInteger(a.reward) && a.reward > 0 ? a.reward : 0;
  /* Adds every achievement that is now earned to m and returns their events. Rewards never earn another one. */
  function award(m, realms, rc) {
    const out = []; let ctx = null;
    for (const a of defs()) {
      if (m.ach.includes(a.id)) continue;
      if (!ctx) ctx = context(m, realms, rc);
      let earned = false; try { earned = a.test(ctx) === true; } catch (e) { earned = false; }
      if (!earned) continue;
      m.ach.push(a.id); const dust = rewardOf(a); m.dust += dust; m.earned += dust;
      out.push({ type: 'achievement', id: a.id, name: String(a.name || a.id), text: String(a.text || ''), dust });
    }
    return out;
  }

  /* ---------- stardust ---------- */
  const paidFor = (m, id) => has(m.paid, id) ? m.paid[id] : (m.paid[id] = { solved: [], clean: [], chapters: [] });
  /* Pays everything that is solved, starred or finished and not yet paid, then checks the achievements.
     Safe to call at any time and as often as you like: what is listed in meta.paid is never paid again.
     realmCtx: {id, chapters: [{index, name, ids}], missions?, ids?}; left out, the realm on this page (if any).
     opts.perks: true only when the call follows a solve the player has just made. Then the equipped figure's
     stardust perk applies, and its chapter perk applies to a chapter that one of the missions paid in this
     same call completes. Every other call (page load, import, reset) pays past work at the base rates, so a
     figure equipped later never raises what earlier work is worth. */
  function settle(realmCtx, opts) {
    if (!store()) return [];
    const rc = realmOf(realmCtx), m = read(), before = JSON.stringify(m), realms = slices(), events = [];
    const perk = isObject(opts) && opts.perks === true ? perkOf(figure(m.equipped)) : null, mission = n => perk === 'stardust' ? n + Math.ceil(n * RULES.perkStardust) : n;
    const pay = e => { m.dust += e.dust; m.earned += e.dust; events.push(e); };
    for (const [id, slice] of Object.entries(realms)) {
      if (!isObject(slice) || !safeId(id)) continue;
      const here = rc && rc.id === id, all = texts(slice.solved), done = new Set(all), clean = new Set(texts(slice.clean));
      const solved = here && rc.ids ? all.filter(q => rc.ids.has(q)) : all;
      const was = has(m.paid, id) ? m.paid[id] : { solved: [], clean: [], chapters: [] }, paidSolved = new Set(was.solved), paidClean = new Set(was.clean), paidChapters = new Set(was.chapters), fresh = new Set();
      for (const qid of solved) {
        if (!paidSolved.has(qid)) { paidFor(m, id).solved.push(qid); fresh.add(qid); pay({ type: 'solve', realm: id, qid, dust: mission(RULES.solve) }); }
        if (clean.has(qid) && !paidClean.has(qid)) { paidFor(m, id).clean.push(qid); pay({ type: 'star', realm: id, qid, dust: mission(RULES.star) }); }
      }
      if (here) for (const c of rc.chapters) {
        if (!c.ids.length || !c.ids.every(q => done.has(q)) || paidChapters.has(c.index)) continue;
        paidFor(m, id).chapters.push(c.index);
        pay({ type: 'chapter', realm: id, chapter: c.index, name: c.name, dust: RULES.chapter + (perk === 'chapter' && c.ids.some(q => fresh.has(q)) ? RULES.perkChapter : 0) });
      }
    }
    events.push(...award(m, realms, rc));
    if (!events.length || !commit(m, before)) return [];
    return events;
  }
  /* One review drill is done: counts it, pays it, checks the achievements. Call it once per drill. */
  function onDrillDone() {
    if (!store()) return [];
    const m = read(), before = JSON.stringify(m), dust = RULES.drill * (perkOf(figure(m.equipped)) === 'drill' ? RULES.perkDrill : 1);
    m.drills++; m.dust += dust; m.earned += dust;
    const events = [{ type: 'drill', dust }, ...award(m, slices(), realmOf())];
    return commit(m, before) ? events : [];
  }
  /* The daily review of one local calendar day is finished (game/daily.js; docs/COLLECTION.md, "Daily review").
     day: whole days since 1970 in local time. Pays DAILY.dust once per day and counts the day streak; a streak
     milestone pays once ever. A day that is not later than the last paid day pays nothing, so a reload, a second
     tab, or a device clock set back never pays twice. A missed day starts the streak again at 1; nothing is taken. */
  const DAILY = Object.freeze({ dust: 15, problems: 3, unlock: 3, milestones: Object.freeze([[3, 20], [7, 40], [14, 80], [30, 150]].map(Object.freeze)) });
  function onDailyDone(day) {
    if (!store() || !Number.isInteger(day) || day < 0) return [];
    /* Another tab may write the save between this call's read and its write. So the save is read once more just
       before the write; if it is no longer what was read, nothing is written and the whole step starts again from
       the newer save (which then usually shows the day as paid). finishDaily() below closes the gap completely
       where the browser has cross-tab locks. */
    for (let tries = 0; tries < 4; tries++) { const events = dailyOnce(day); if (events) return events; }
    return [];
  }
  /* One attempt: the events, or null when the save changed underneath it. */
  function dailyOnce(day) {
    const m = read(), before = JSON.stringify(m), d = isObject(m.daily) ? m.daily : (m.daily = { day: null, streak: 0, best: 0, paid: [], seen: {} });
    if (Number.isInteger(d.day) && day <= d.day) return [];
    const streak = Number.isInteger(d.day) && day === d.day + 1 ? (Number.isInteger(d.streak) && d.streak > 0 ? d.streak : 1) + 1 : 1;
    const paid = Array.isArray(d.paid) ? d.paid : [], events = [{ type: 'daily', day, streak, dust: DAILY.dust }];
    for (const [days, dust] of DAILY.milestones) if (streak >= days && !paid.includes(days)) { paid.push(days); events.push({ type: 'streak', days, dust }); }
    Object.assign(d, { day, streak, best: Math.max(Number.isInteger(d.best) ? d.best : 0, streak), paid }); delete d.at;
    for (const e of events) { m.dust += e.dust; m.earned += e.dust; }
    events.push(...award(m, slices(), realmOf()));
    if (JSON.stringify(read()) !== before) return null;
    return commit(m, before) ? events : [];
  }
  /* The same, as one step across tabs: done(events) is called once, with what onDailyDone returned. Where the browser
     has Web Locks (navigator.locks), the read, the day check and the write run while this page holds the lock every
     page takes for this step, so two tabs that finish at the same moment cannot both be paid or both say so. Without
     locks (file://, older browsers, tests) it is onDailyDone straight away. If the lock does not come within a
     moment, the step runs without it rather than leaving the player waiting. The interface shows the reward from
     inside done, so it is only ever shown after the save holds it. */
  function finishDaily(day, done) {
    let fired = false;
    const run = () => { if (fired) return; fired = true; let events = []; try { events = onDailyDone(day); } catch (e) { events = []; } if (typeof done === 'function') done(events); };
    let locks = null; try { locks = window.navigator && window.navigator.locks; } catch (e) { locks = null; }
    if (!locks || typeof locks.request !== 'function' || typeof window.setTimeout !== 'function') { run(); return; }
    try {
      const held = locks.request('mathcosmos-save', () => { run(); });
      if (held && typeof held.then === 'function') held.then(null, run);
      window.setTimeout(run, 1500);
    } catch (e) { run(); }
  }
  /* Totals of a list of events, for a toast. */
  function summary(events) {
    const s = { dust: 0, solves: 0, stars: 0, chapters: 0, drills: 0, achievements: [] };
    for (const e of Array.isArray(events) ? events : []) {
      if (!isObject(e)) continue; s.dust += Number.isFinite(e.dust) ? e.dust : 0;
      if (e.type === 'solve') s.solves++; else if (e.type === 'star') s.stars++; else if (e.type === 'chapter') s.chapters++; else if (e.type === 'drill') s.drills++; else if (e.type === 'achievement') s.achievements.push(e);
    }
    return s;
  }
  /* One short plain sentence for a list of events, or '' when nothing was earned. */
  function describe(events) {
    const s = summary(events), n = (k, one, many) => k ? [k === 1 ? one : k + ' ' + many] : [];
    if (!s.dust && !s.achievements.length) return '';
    const parts = [...n(s.solves, 'mission solved', 'missions solved'), ...n(s.stars, 'first-try star', 'first-try stars'), ...n(s.chapters, 'chapter finished', 'chapters finished'), ...n(s.drills, 'drill done', 'drills done'),
      ...(s.achievements.length === 1 ? ['achievement: ' + s.achievements[0].name] : s.achievements.length ? [s.achievements.length + ' achievements'] : [])];
    return '+' + s.dust + ' stardust' + (parts.length ? ' · ' + parts.join(', ') : '');
  }

  /* ---------- summoning ---------- */
  /* A number in [0, 1): from the system's random source when there is one, else Math.random. */
  function random() {
    try { const c = window.crypto || (typeof crypto !== 'undefined' ? crypto : null); if (c && typeof c.getRandomValues === 'function') { const a = new Uint32Array(1); c.getRandomValues(a); return a[0] / 4294967296; } } catch (e) { /* fall through */ }
    return Math.random();
  }
  const draw = rng => { const x = rng(); return Number.isFinite(x) && x >= 0 && x < 1 ? x : Math.random(); };
  /* The rarity of the next summon, from one random number and the two counters. Legendary sits at the low end. */
  /* The chances of one summon, given the two counters. rollRarity() and odds() both come from this, so what
     the player is shown is what is drawn. */
  function chances(sinceRare, sinceLegend) {
    const r = RULES.rates;
    if (sinceLegend >= RULES.legendEvery - 1) return { common: 0, rare: 0, legendary: 1 };
    if (sinceRare >= RULES.rareEvery - 1) { const s = r.rare + r.legendary; return { common: 0, rare: r.rare / s, legendary: r.legendary / s }; }
    return { common: r.common, rare: r.rare, legendary: r.legendary };
  }
  function rollRarity(x, sinceRare, sinceLegend) {
    const p = chances(sinceRare, sinceLegend);
    return x < p.legendary ? 'legendary' : p.common === 0 || x < p.legendary + p.rare ? 'rare' : 'common';
  }
  const cost = () => read().pulls === 0 ? 0 : RULES.cost;
  const canPull = () => { const m = read(); return figureList().length > 0 && (m.pulls === 0 || m.dust >= RULES.cost); };
  /* The chances of the next summon: the usual ones, or the guaranteed ones when a guarantee is due. */
  const odds = () => { const m = read(); return chances(m.sinceRare, m.sinceLegend); };
  /* The usual chances, when no guarantee is due. */
  const baseOdds = () => chances(0, 0);
  function guarantees() { const m = read(); return { rareEvery: RULES.rareEvery, legendEvery: RULES.legendEvery, rareIn: Math.max(1, RULES.rareEvery - m.sinceRare), legendIn: Math.max(1, RULES.legendEvery - m.sinceLegend) }; }
  /* One summon. rng: optional function returning a number in [0, 1) (two are used: rarity, then figure).
     opts.expect: the price the player was shown. If the real price is different now (another page used the
     free first summon), nothing is taken and the reason is 'price'. */
  function pull(rng, opts) {
    const figs = figureList(); if (!figs.length || !store()) return { ok: false, reason: 'empty' };
    const m = read(), before = JSON.stringify(m), free = m.pulls === 0, price = free ? 0 : RULES.cost;
    if (isObject(opts) && Number.isFinite(opts.expect) && opts.expect !== price) return { ok: false, reason: 'price', cost: price, dust: m.dust };
    if (m.dust < price) return { ok: false, reason: 'dust', cost: price, dust: m.dust };
    const next = typeof rng === 'function' ? rng : random;
    let rarity = rollRarity(draw(next), m.sinceRare, m.sinceLegend);
    /* If the list has no figure of that rarity (unfinished data), the nearest rarity that has one is used. */
    const pools = Object.fromEntries(RARITIES.map(r => [r, figs.filter(f => rarityOf(f) === r)]));
    if (!pools[rarity].length) rarity = ({ common: ['rare', 'legendary'], rare: ['common', 'legendary'], legendary: ['rare', 'common'] })[rarity].find(r => pools[r].length);
    const pool = pools[rarity], fig = pool[Math.min(pool.length - 1, Math.floor(draw(next) * pool.length))];
    m.pulls++; m.dust -= price;
    m.sinceLegend = rarity === 'legendary' ? 0 : m.sinceLegend + 1;
    m.sinceRare = rarity === 'common' ? m.sinceRare + 1 : 0;
    const duplicate = has(m.owned, fig.id), refund = duplicate ? RULES.refund[rarity] : 0;
    m.owned[fig.id] = (duplicate ? m.owned[fig.id] : 0) + 1; m.dust += refund;
    const events = award(m, slices(), realmOf());
    if (!commit(m, before)) return { ok: false, reason: 'storage' };
    return { ok: true, figure: fig, rarity, duplicate, refund, free, cost: price, count: m.owned[fig.id], stars: starsFor(m.owned[fig.id]), dust: m.dust, events };
  }

  /* ---------- figures owned, equipping, perks ---------- */
  const row = (f, m) => { const count = has(m.owned, f.id) ? m.owned[f.id] : 0; return { figure: f, id: f.id, rarity: rarityOf(f), perk: perkInfo(perkOf(f)), owned: count > 0, count, stars: starsFor(count), equipped: m.equipped === f.id }; };
  const figures = () => { const m = read(); return figureList().map(f => row(f, m)); };
  const owned = () => figures().filter(r => r.owned);
  function counts() {
    const all = figures(), byRarity = {};
    for (const r of RARITIES) byRarity[r] = { owned: all.filter(x => x.owned && x.rarity === r).length, total: all.filter(x => x.rarity === r).length };
    return { owned: all.filter(x => x.owned).length, total: all.length, copies: all.reduce((n, x) => n + x.count, 0), byRarity };
  }
  /* Equips an owned figure; equip(null) takes the figure off. */
  function equip(id) {
    const m = read(), before = JSON.stringify(m);
    if (id === null || id === undefined) { if (m.equipped === null) return { ok: true, events: [] }; m.equipped = null; return commit(m, before) ? { ok: true, events: [] } : { ok: false, reason: 'storage', events: [] }; }
    if (!figure(id)) return { ok: false, reason: 'unknown', events: [] };
    if (!has(m.owned, id)) return { ok: false, reason: 'not-owned', events: [] };
    if (m.equipped === id) return { ok: true, events: [] };
    m.equipped = id; const events = award(m, slices(), realmOf());
    return commit(m, before) ? { ok: true, events } : { ok: false, reason: 'storage', events: [] };
  }
  const equipped = () => { const m = read(), f = figure(m.equipped); return f ? row(f, m) : null; };
  /* The perk id in effect ('stardust' | 'chapter' | 'secondlook' | 'drill'), or null. */
  const perk = () => perkOf(figure(read().equipped));
  /* Second look: with that perk equipped, one wrong first check per mission keeps the first-try star. */
  const lookUsed = (m, realmId, qid) => has(m.looks, realmId) && Array.isArray(m.looks[realmId]) && m.looks[realmId].includes(qid);
  function secondLookAvailable(realmId, qid) { if (!safeId(realmId) || !isText(qid)) return false; const m = read(); return perkOf(figure(m.equipped)) === 'secondlook' && !lookUsed(m, realmId, qid); }
  /* Uses it up for that mission. True when the star is kept; false when there was none to use. */
  function useSecondLook(realmId, qid) {
    if (!safeId(realmId) || !isText(qid)) return false;
    const m = read(), before = JSON.stringify(m);
    if (perkOf(figure(m.equipped)) !== 'secondlook' || lookUsed(m, realmId, qid)) return false;
    (has(m.looks, realmId) ? m.looks[realmId] : (m.looks[realmId] = [])).push(qid);
    return commit(m, before);
  }

  /* ---------- achievements ---------- */
  /* Every achievement with whether it is earned and, where it can be counted, how far along it is. Earned first. */
  function achievements() {
    const m = read(), ctx = context(m, slices(), realmOf());
    const list = defs().map(a => {
      const earned = m.ach.includes(a.id); let progress = null;
      if (typeof a.progress === 'function') try { const p = a.progress(ctx); if (isObject(p) && Number.isFinite(p.have) && Number.isFinite(p.need) && p.need > 0) progress = { have: earned ? p.need : Math.max(0, Math.min(p.need, p.have)), need: p.need }; } catch (e) { progress = null; }
      return { id: a.id, name: String(a.name || a.id), text: String(a.text || ''), reward: rewardOf(a), earned, progress };
    });
    return [...list.filter(a => a.earned), ...list.filter(a => !a.earned)];
  }
  const dust = () => read().dust;
  const earned = () => read().earned;
  const state = () => read();
  const stored = () => lastStored;
  return { RULES, RARITIES, PERKS, DAILY, settle, onDrillDone, onDailyDone, finishDaily, summary, describe, pull, canPull, cost, odds, baseOdds, guarantees, rollRarity,
    equip, equipped, perk, perkInfo, secondLookAvailable, useSecondLook, figures, owned, counts, figure, achievements, context: () => context(read(), slices(), realmOf()),
    dust, earned, state, stored, pageRealm };
})();
