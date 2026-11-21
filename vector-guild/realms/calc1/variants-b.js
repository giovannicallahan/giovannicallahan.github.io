/* Calculus 1 review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md ("Variant setup and pool").
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => { const k = 3 + (t + 10) % 7; return `A pump’s output is f(x) = (x² − ${k * k}) ÷ (x − ${k}) for x below ${k}, and f(x) = x² − c for x of ${k} and more.`; },
 q12: t => `A rover’s distance is s(t) = 3t² + 4t metres, t seconds after it sets off. Take the time t = ${1 + (t + 10) % 6}.`,
 q13: t => `A curve is y = f(x) = 2x² − 3x + 5. Take the tangent line at x = ${1 + (t + 10) % 6}.`,
 q14: t => `Take f(x) = x to the power ${2 + (t + 10) % 5}.`,
 q15: t => `A fluid’s temperature is T(t) = 2t³ − 5t² + 4t + 9 degrees, t minutes into a run. Take the time t = ${(t + 10) % 6}.`,
 q16: t => `A rover’s position is s(t) = 2t³ − 12t² + 20t metres, t seconds after the start. Take the time t = ${(t + 10) % 5}.`,
 q17: t => `A rover’s position is s(t) = 2t³ − 9t² + 12t + 4 metres, t seconds after the start. Take the time t = ${(t + 10) % 5}.`,
 q18: t => `A motor’s output is P(x) = (3x + 2)(x² + 5) watts at dial setting x. Take the setting x = ${(t + 10) % 5}.`,
 q19: t => { const a = [2, 7][(t + 10) % 2]; return `A tool’s rating is E(x) = (3x + 2) ÷ (x + 3) at feed speed x. Take x = ${a}.`; },
 q20: t => `A fan’s air flow is F(x) = (3x − 4)³ at dial setting x. Take the setting x = ${2 + (t + 10) % 3}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
