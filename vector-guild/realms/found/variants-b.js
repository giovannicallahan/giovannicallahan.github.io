/* Foundations review-drill statements, file b: q13–q24. Shape: docs/PACK-FORMAT.md ("Variant setup and pool").
   Loaded before game/variants.js, which merges these tables. Each statement uses the numbers of the matching
   experiment in experiments-b.js for the same t. */
(function(){
'use strict';
const { n, vec } = window.Gen;
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q13: t => `A pallet holds ${n(12 + t)} sealed cans of c litres each and an open drum with 15 L. Mira loads 2 more cans. The total is written as (number)c + 15.`,
 q14: t => `A generator starts with 200 L and burns 8 L each hour, so after h hours it holds 200 − 8h litres. Here h = ${n(t + 11)}.`,
 q15: t => `Simplify ${n(Math.abs(t) + 2)}(c + 4) + 3c to the form (number)c + (number).`,
 q16: t => `A leak took 18 L from a tank that held x litres. The gauge now reads ${n(40 + t)} L, so x − 18 = ${n(40 + t)}.`,
 q17: t => `Solve 3(x + 2) + 12 = ${n(3 * (t + 14) + 12)}.`,
 q18: t => `A sled may carry at most ${n(200 + 10 * t)} kg. The empty sled weighs 74 kg and each can weighs 14 kg, so 14n + 74 ≤ ${n(200 + 10 * t)}. Cans come whole.`,
 q19: t => `With the depot at (0, 0), x east and y north, a cache lies ${n(Math.abs(t))} km ${t < 0 ? 'west' : 'east'} and 4 km south of the depot.`,
 q20: t => { const k = Math.abs(t) + 1; return `A cable runs straight from ${vec([1, 2])} to ${vec([1 + 3 * k, 2 + 4 * k])} on a grid in kilometres.`; },
 q21: t => `A tank’s gauge read 86 L at hour 2 and ${n(86 + 4 * t)} L at hour 6.`,
 q22: t => `A tank follows y = −7x + 150, where y is litres and x is hours. Here x = ${n(t + 11)}.`,
 q23: t => `A straight track passes ${vec([2, 5])} and ${vec([6, 5 + 4 * t])}. Write it as y = mx + b.`,
 q24: t => `A drone starts at ${vec([2, -1, 3])} and flies ${vec([-5, 4, 2])}, then ${vec([t, -6, -4])}.`
});
})();
