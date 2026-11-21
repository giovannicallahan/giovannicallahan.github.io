/* Skip-ahead check: the rules, kept free of the page so they can be tested directly (qa/skip.test.js).
   app.js draws the check and changes the save; nothing here touches the page or storage.

   A chapter that is not complete offers a check: one fresh problem (new numbers, no hints, no guided steps, one
   try each) from every learn mission of the chapter. Passing all of them marks the chapter's learn missions
   solved, exactly as if each had been solved, except that none gets a first-try star. Failing loses nothing.

   The save holds one small record per chapter that was failed and is not complete yet, and nothing else:
     slice.skips = { "<chapter index>": { last: time of the fail, miss: [learn mission ids to study], seen: true|false, n: fails so far } }
   `seen` becomes true when the player opens one of the listed lessons. A new try needs `seen` or a new day.
   The record goes when the chapter is complete. A save without `skips` is a save where no check was failed. */
window.VGSkip = (() => {
  'use strict';
  const FIRST_ROLL = 5000, ROLLS_PER_TRY = 40;
  const isObject = o => !!o && typeof o === 'object' && !Array.isArray(o);
  /* The local calendar day of a time stamp, as one number. */
  const dayOf = t => { const d = new Date(t); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
  /* A check can be taken on a chapter that is not complete and whose missions need nothing unsolved from outside
     the chapter, so the chapters before it are learned or checked first. Returns 'done', 'early' or 'open'. */
  function status(chapter, byId, done) {
    const ids = chapter && Array.isArray(chapter.ids) ? chapter.ids : [];
    if (!ids.length || ids.every(id => done.has(id))) return 'done';
    const inside = new Set(ids);
    for (const id of ids) for (const need of (byId.get(id) || {}).prereqs || []) if (!inside.has(need) && !done.has(need)) return 'early';
    return 'open';
  }
  /* After a fail: a new try is allowed once one of the listed lessons was opened, or on a later day. */
  const canRetry = (record, now) => !record || record.seen === true || dayOf(now) !== dayOf(record.last);
  /* One fresh problem for a learn mission: generated numbers that are neither the authored problem nor any prompt
     in `avoid` (what the player's own mission shows, and what earlier tries showed). Hints, guided steps and the
     worked solution are left out. A mission without a generator keeps its authored problem. */
  function problem(base, gen, seed, start, avoid) {
    let pick = base;
    if (gen && gen.has(base.id)) {
      const tried = [];
      for (let r = start; r < start + ROLLS_PER_TRY; r++) { const m = gen.instance(base, seed || 1, r); if (m !== base) { tried.push(m); if (m.prompt !== base.prompt && !avoid.has(m.prompt)) break; } }
      pick = tried.find(m => m.prompt !== base.prompt && !avoid.has(m.prompt)) || tried.find(m => m.prompt !== base.prompt) || tried[0] || base;
    }
    return { id: base.id, topic: base.topic, title: base.title, prompt: pick.prompt, answer: Array.from(pick.answer), labels: Array.from(base.labels || []), tolerance: base.tolerance ?? .01 };
  }
  /* The whole check for a chapter. tries: fails so far (each try starts at other rolls); salt: differs per page load. */
  function build(chapter, byId, gen, seed, opts) {
    const o = opts || {}, start = FIRST_ROLL + (Number(o.salt) || 0) + ROLLS_PER_TRY * (Number(o.tries) || 0), avoid = o.avoid instanceof Set ? o.avoid : new Set(o.avoid || []);
    return chapter.ids.map(id => byId.get(id)).filter(Boolean).map(base => problem(base, gen, seed, start, avoid));
  }
  const fits = (item, i) => x => Math.abs(x - Number(item.answer[i])) <= item.tolerance;
  /* typed: for each problem, the numbers read from its fields (NaN for an empty or unreadable field).
     A problem is right only when every field is right. */
  function grade(items, typed) {
    const right = items.map((item, k) => { const row = (typed || [])[k] || []; return item.answer.every((_, i) => Number.isFinite(row[i]) && fits(item, i)(row[i])); });
    return { right, missed: items.filter((_, k) => !right[k]).map(item => item.id), passed: right.length > 0 && right.every(Boolean) };
  }
  const failRecord = (old, missed, now) => ({ last: now, miss: Array.from(missed), seen: false, n: Math.min(((old && old.n) || 0) + 1, 999) });
  /* The records worth keeping from a save, or null when there are none: only chapters that are not complete,
     only learn missions of that chapter. Anything else is dropped. */
  function tidy(skips, chapters, done) {
    if (!isObject(skips)) return null;
    const out = {};
    for (const [key, r] of Object.entries(skips)) {
      const i = Number(key), c = /^\d+$/.test(key) ? chapters[i] : null;
      if (!c || !isObject(r) || !c.ids.length || c.ids.every(id => done.has(id))) continue;
      const miss = Array.isArray(r.miss) ? [...new Set(r.miss.filter(id => typeof id === 'string' && c.ids.includes(id)))] : [];
      if (!miss.length) continue;
      out[String(i)] = { last: Number.isFinite(r.last) && r.last > 0 ? r.last : 0, miss, seen: r.seen === true, n: Number.isInteger(r.n) && r.n > 0 ? Math.min(r.n, 999) : 1 };
    }
    return Object.keys(out).length ? out : null;
  }
  return { FIRST_ROLL, ROLLS_PER_TRY, dayOf, status, canRetry, problem, build, fits, grade, failRecord, tidy };
})();
