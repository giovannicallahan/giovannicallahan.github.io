/* Mission generators: every mission can be rebuilt with new numbers.
   A generator has three parts:
     canonical  the parameters of the authored mission (build(canonical) reproduces it)
     draw(R)    returns a fresh, well-behaved parameter set from the seeded random source R
     build(p)   returns {prompt, answer, hints, solution, guidance} for parameters p
   Labels, tolerance, lesson, worked example and sources always come from the authored mission.
   Generator files (gen-a.js ... gen-d.js) register themselves on window.MISSION_GEN. */
window.MISSION_GEN = window.MISSION_GEN || {};
window.Gen = (() => {
  'use strict';
  /* Deterministic random source: the same (seed, mission, roll) always gives the same numbers. */
  function hash(text) { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed, id, roll) {
    let a = hash(`${seed}|${id}|${roll}`) || 1;
    const next = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
    return {
      next, int,
      /* nonzero integer in [lo, hi] */
      nz: (lo, hi) => { let v = 0; while (v === 0) v = int(lo, hi); return v; },
      pick: list => list[Math.floor(next() * list.length)],
      bool: () => next() < .5,
      /* integer in [lo, hi] that is not in the excluded list */
      except: (lo, hi, excluded) => { let v = int(lo, hi), guard = 0; while (excluded.includes(v) && guard++ < 200) v = int(lo, hi); return v; },
    };
  }
  /* Number to text: at most four decimals, no trailing zeros, typographic minus. */
  const n = x => { const r = Math.round(Number(x) * 1e4) / 1e4; return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−'); };
  /* Signed term for sums: plus(3) → "+3", plus(−2) → "−2". */
  const plus = x => (Number(x) < 0 ? '−' : '+') + n(Math.abs(Number(x)));
  /* Parenthesise negatives for products and explicit sums: par(−1) → "(−1)", par(4) → "4". */
  const par = x => Number(x) < 0 ? `(${n(x)})` : n(x);
  /* "(3, −1, 2)" with a chosen separator. */
  const vec = (v, sep = ', ') => '(' + v.map(n).join(sep) + ')';
  /* Repair signs left by interpolating raw numbers and round float noise.
     A hyphen after a letter ("rank-1") is a word hyphen and is left alone. */
  const clean = s => String(s)
    .replace(/\d+\.\d{6,}/g, m => String(Number(Number(m).toPrecision(6))))
    .replace(/\+\s*-(?=[\d.])/g, '−').replace(/−\s*-(?=[\d.])/g, '+').replace(/(?<![A-Za-z])-(?=[\d.])/g, '−');
  const numbersOk = list => Array.isArray(list) && list.length > 0 && list.every(Number.isFinite);
  /* Snap float noise in answers (2.9999999999 → 3) without changing honest decimals. */
  const tidy = x => { const r = Math.round(x * 1e9) / 1e9; return Object.is(r, -0) ? 0 : r; };

  /* Build one playable mission from the authored mission q.
     roll 0 with seed 0 is the authored mission itself. Any failure falls back to the authored mission. */
  function instance(q, seed = 0, roll = 0) {
    const g = window.MISSION_GEN[q.id];
    if (!g) return q;
    try {
      const canonical = seed === 0 && roll === 0;
      const params = canonical ? g.canonical : g.draw(rng(seed, q.id, roll));
      const b = g.build(params);
      if (!numbersOk(b.answer) || b.answer.length !== q.answer.length) throw Error('answer shape');
      if (!Array.isArray(b.hints) || !b.hints.length || !b.solution || !b.prompt) throw Error('missing text');
      const guidance = (b.guidance || []).map((step, i) => {
        if (!numbersOk(step.answer)) throw Error('guidance answer');
        const labels = step.labels || q.guidance?.[i]?.labels || step.answer.map((_, k) => 'ANSWER ' + (k + 1));
        if (labels.length !== step.answer.length) throw Error('guidance labels');
        return { prompt: clean(step.prompt), answer: step.answer.map(tidy), labels, explanation: clean(step.explanation) };
      });
      return { ...q, prompt: clean(b.prompt), answer: b.answer.map(tidy), hints: b.hints.map(clean), solution: clean(b.solution), guidance, params, generated: !canonical };
    } catch (error) {
      return q;
    }
  }
  return { rng, n, plus, par, vec, clean, tidy, instance, has: id => !!window.MISSION_GEN[id] };
})();
