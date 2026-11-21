/* Calculus 1 review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md ("Variant setup and pool").
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `A cam arm moves as f(x) = 5 sin x + ${n(t + 12)} cos x, with x in radians.`,
 q22: t => `A wear gauge reads f(x) = ${n(4 * (t + 12))} ln x for x ≥ 1.`,
 q23: t => `A bench part has the profile u(x) = x²(x + ${n(t + 11)}).`,
 q24: t => `A walkway follows the circle x² + y² = ${n(t * t + 16)} and passes through the point (${n(t)}, 4).`,
 q25: t => `A 10 m ladder leans against a tower. Its foot is 6 m out and its top 8 m up, and the foot slides away at ${n(Math.round(0.04 * (t + 11) * 1000) / 1000)} m/s.`,
 q26: t => `Estimate √${n(400 + t + 11)} with the tangent line of √x at x = 400.`,
 q27: t => { const k = 1 + (t + 10) % 5; return `A pressure model is f(x) = x³ − ${n(3 * k * k)}x.`; },
 q28: t => `A height model is f(x) = x³ − ${n(3 * (t + 11))}x² + 5x.`,
 q29: t => { const b = 2 + (t + 10) % 6; return `A trench profile is f(x) = 3x⁴ − ${n(4 * (1 + b))}x³ + ${n(6 * b)}x².`; },
 q30: t => `A stress model is f(x) = x³ − 12x on the closed interval from 0 to ${n(3 + (t + 10) % 4)}.`,
});
Object.assign(window.VARIANT_POOL, {
 /* Points off the y-axis, so the slope is never 0. */
 q24: [-6, -5, -3, -2, -1, 1, 2, 3, 5, 6],
});
})();
