/* Calculus 1 review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md ("Variant setup and pool").
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `A rectangular seedling bed lies against a wall; its other three sides use all ${4 * (6 + (t + 10) % 10)} metres of edging.`,
 q32: t => `A rover has travelled d(t) = 3t² + 5t metres after t minutes. Take the interval from t = 1 to t = ${3 + (t + 10) % 6}.`,
 q33: t => `Find the limit of (e^(${2 + (t + 10) % 8}x) − 1) ÷ sin(2x) as x approaches 0, with x in radians, using L’Hôpital’s rule.`,
 q34: t => `Use Newton’s method on f(x) = x² − ${[13, 14, 15, 17, 18, 19, 20][(t + 10) % 7]}, starting from the guess x₀ = 4.`,
 q35: t => `Water flows in at r(t) = 6t² + ${2 * (2 + (t + 10) % 9)}t litres per minute. Take the antiderivative F(t) of r(t) whose constant is 0.`,
 q36: t => `A water level rises at 4t + 3 centimetres per hour, and at t = 2 the gauge reads ${30 + 5 * ((t + 10) % 11)} cm.`,
 q37: t => `A pump runs at r(t) = 3t² + ${2 + (t + 10) % 11} litres per minute. Estimate the water from t = 0 to t = 8 with 4 rectangles of equal width.`,
 q38: t => `Find ∫ from 0 to ${5 + (t + 10) % 8} of (8 − 2t) dt from the areas between the graph and the axis.`,
 q39: t => `Water enters at r(t) = 3t² + 6t kilolitres per hour. Find ∫ from 1 to ${2 + (t + 10) % 5} of r(t) dt with the Fundamental Theorem of Calculus.`,
 q40: t => `A reservoir holds 200 kilolitres at noon and gains water at 27 − 3t² kilolitres per hour, t hours after noon. Take the first ${2 + (t + 10) % 5} hours.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
