/* Save format 2 (docs/SAVE-V2.md). One localStorage entry holds every realm's progress:
   { v: 2, seed, seeds?: { <packId>: seed }, intro, realms: { <packId>: <slice> } }
   A slice is the 1.4.1 save object without its seed, with the pack's local mission ids.
   This module never normalises a slice: only the realm page that loaded a pack validates that pack's slice.
   The 1.x entry is read once for migration and is never deleted or rewritten.
   Every function is safe when localStorage is missing or throws. */
window.VGSave = (() => {
  'use strict';
  const KEY = 'vector-guild-save-v2', V1_KEY = 'vector-guild-save-v1';
  const isObject = o => !!o && typeof o === 'object' && !Array.isArray(o);
  const clone = o => o === undefined ? undefined : JSON.parse(JSON.stringify(o));
  const validSeed = s => Number.isInteger(s) && s >= 0;
  /* New players get a random non-zero seed; tests pin it through window.VG_SEED (as in 1.4.1). */
  const newSeed = () => Number.isInteger(window.VG_SEED) ? window.VG_SEED : 1 + Math.floor(Math.random() * 2147483646);
  function storage() { try { return window.localStorage || null; } catch (e) { return null; } }
  function readRaw(key) { try { const s = storage(); return s ? s.getItem(key) : null; } catch (e) { return null; } }
  function write(data) { try { const s = storage(); if (!s) return false; s.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { return false; } }
  const isV2 = o => isObject(o) && o.v === 2 && isObject(o.realms) && Object.values(o.realms).every(isObject);
  const isV1 = o => isObject(o) && o.v === undefined && Array.isArray(o.solved) && Array.isArray(o.tools);
  /* A backup is only restored when every slice has the two lists a realm page needs to accept it (the same
     test isV1 applies to a 1.x file). The stored save is read with the lenient isV2, so it is never rejected. */
  const strings = a => Array.isArray(a) && a.every(x => typeof x === 'string');
  const isSlice = s => isObject(s) && strings(s.solved) && strings(s.tools);
  const isV2Backup = o => isV2(o) && Object.values(o.realms).every(isSlice);
  /* Per-realm seed overrides: only whole numbers >= 0 are kept. Most saves have none. */
  function tidySeeds(o) { const out = {}; if (isObject(o)) for (const [id, s] of Object.entries(o)) if (validSeed(s)) out[id] = s; return out; }
  /* A stored or imported v2 object, with only its top-level fields made safe. Slices are kept as they are. */
  function tidyV2(o) {
    const d = { v: 2, seed: validSeed(o.seed) ? o.seed : 0, intro: o.intro === true, realms: clone(o.realms) }, seeds = tidySeeds(o.seeds);
    if (Object.keys(seeds).length) d.seeds = seeds;
    return d;
  }
  /* A 1.x save becomes the linear algebra slice. Its seed moves to the top (missing means 0, the authored
     numbers). Review counts stored as bare integers (1.3) become {n, last: 0}, as 1.4 does on load. */
  function sliceFromV1(o) {
    const slice = clone(o); delete slice.seed; delete slice.v;
    if (isObject(slice.reviews)) for (const [id, r] of Object.entries(slice.reviews)) if (Number.isInteger(r) && r > 0) slice.reviews[id] = { n: Math.min(r, 999), last: 0 };
    return slice;
  }
  function fromV1(o) { return { v: 2, seed: validSeed(o.seed) ? o.seed : 0, intro: false, realms: { la: sliceFromV1(o) } }; }
  const fresh = () => ({ v: 2, seed: newSeed(), intro: false, realms: {} });
  /* The stored v2 object, or null when there is none or it cannot be read. */
  function stored() {
    const raw = readRaw(KEY); if (raw === null) return null;
    try { const o = JSON.parse(raw); if (isV2(o)) return tidyV2(o); } catch (e) { /* fall through */ }
    /* Keep an unreadable entry aside instead of losing it when a new save is written. */
    try { const s = storage(); if (s && s.getItem(KEY + '-unreadable') === null) s.setItem(KEY + '-unreadable', raw); } catch (e) { /* ignore */ }
    return null;
  }
  let cache = null;
  /* Whole v2 object, migrating from 1.x or starting fresh when needed. Never throws. */
  function load() {
    let data = stored();
    if (!data) {
      let v1 = null; try { const raw = readRaw(V1_KEY); if (raw) v1 = JSON.parse(raw); } catch (e) { v1 = null; }
      data = isV1(v1) ? fromV1(v1) : fresh();
      write(data);
    }
    cache = data;
    return clone(data);
  }
  /* Latest copy: storage first (another page may have written), else what this page holds. */
  function current() { const s = stored(); if (s) { cache = s; return s; } return cache || (load(), cache); }
  function realm(id) { const d = current(); return Object.prototype.hasOwnProperty.call(d.realms, id) ? clone(d.realms[id]) : null; }
  /* Writes one realm's slice and leaves every other realm untouched. Returns false if it could not be stored. */
  function putRealm(id, slice) { const d = current(); d.realms[id] = clone(slice); cache = d; return write(d); }
  /* The seed that decides a realm's numbers: its own override when it has one, else the global seed. */
  function seed(id) { const d = current(); return id !== undefined && d.seeds && Object.prototype.hasOwnProperty.call(d.seeds, id) && validSeed(d.seeds[id]) ? d.seeds[id] : d.seed; }
  const totalXp = () => Object.values(current().realms).reduce((n, s) => n + (Number.isFinite(s && s.xp) ? s.xp : 0), 0);
  const introSeen = () => current().intro === true;
  function setIntroSeen() { const d = current(); d.intro = true; cache = d; return write(d); }
  const exportAll = () => clone(current());
  /* Accepts a v2 backup (replaces the whole save) or a 1.x backup (replaces the linear algebra slice and
     gives that realm the backup's seed, so it keeps the numbers it had). For a 1.x file every other realm,
     and the global seed their numbers come from, stay as they are.
     Nothing is changed, and ok is false, when the file is not a complete save or the device could not store it. */
  const NOT_STORED = 'This device could not store the save. Your progress was not changed.';
  function importAny(o) {
    if (isObject(o) && o.v === 2) {
      if (!isV2Backup(o)) return { ok: false, error: 'That file is not a complete MathCosmos save.' };
      const d = tidyV2(o); if (!write(d)) return { ok: false, error: NOT_STORED, kind: 2 };
      cache = d; return { ok: true, error: null, kind: 2 };
    }
    if (isV1(o)) {
      const d = clone(current()), v = fromV1(o); d.realms.la = v.realms.la;
      if (v.seed === d.seed) { if (d.seeds) delete d.seeds.la; } else d.seeds = Object.assign(d.seeds || {}, { la: v.seed });
      if (d.seeds && !Object.keys(d.seeds).length) delete d.seeds;
      if (!write(d)) return { ok: false, error: NOT_STORED, kind: 1 };
      cache = d; return { ok: true, error: null, kind: 1 };
    }
    return { ok: false, error: 'That file is not a MathCosmos save.' };
  }
  /* A reset realm also drops its seed override, so it starts again from the global seed. */
  function reset(id) { const d = current(); delete d.realms[id]; if (d.seeds) { delete d.seeds[id]; if (!Object.keys(d.seeds).length) delete d.seeds; } cache = d; return write(d); }
  /* Everything goes, including the seed and the intro flag. The 1.x entry is still left alone. */
  function resetAll() { const d = fresh(); cache = d; return write(d); }
  return { KEY, V1_KEY, load, realm, putRealm, seed, totalXp, introSeen, setIntroSeen, exportAll, importAny, reset, resetAll };
})();
