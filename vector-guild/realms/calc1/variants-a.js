/* Calculus 1 review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md ("Variant setup and pool").
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `A shuttle’s height is h(t) = 3t² + 10t metres, t seconds after lift-off. Take the interval from t = 2 to t = ${4 + (t + 10) % 7}.`,
 q02: t => `A rover’s distance from the dish is d(t) = 2t² + 5t metres, t seconds after it sets off. Look at the moment t = ${1 + (t + 10) % 5}.`,
 q03: t => { const c = 1 + (t + 10) % 6; return `f(x) = (x³ − ${c * c * c}) ÷ (x − ${c}), which has no value at x = ${c}.`; },
 q04: t => `Find the limit of (x² + 1)(2x − 3) as x approaches ${window.Gen.n(-3 + (t + 10) % 7)}.`,
 q05: t => { const r = 1 + (t + 10) % 7; return `g(x) = (x² + 2x − ${r * r + 2 * r}) ÷ (x − ${r}), which gives 0 ÷ 0 at x = ${r}.`; },
 q06: t => `f(x) = x² for x < 2, and f(x) = 3x + ${t + 11} for x ≥ 2.`,
 q07: t => { const c = 1 + (t + 10) % 5; return `A pump’s flow is F(x) = 3x + 4 for x < ${c}, and F(x) = x² + k for x ≥ ${c}.`; },
 q08: t => `f(x) = (${t + 12}x + 3) ÷ (2x + 1).`,
 q09: t => { const c = 1 + (t + 10) % 8; return `A valve reads P(x) = (2x + 3) ÷ (x − ${c}). Take the setting x = ${window.Gen.n(c + 0.01)}.`; },
 q10: t => `f(x) = x³ + 2x − ${13 + (t + 10) % 20} is continuous, negative at x = 2 and positive at x = 3. Halve the interval from 2 to 3 three times, each time keeping the half where f changes sign.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
