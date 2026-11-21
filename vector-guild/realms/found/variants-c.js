/* Foundations review-drill statements, file c: q25–q35. Shape: docs/PACK-FORMAT.md ("Variant setup and pool").
   Loaded before game/variants.js, which merges these tables. Each statement uses the same numbers as the
   experiment in experiments-c.js for that t. */
(function(){
'use strict';
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
const n = x => String(Math.abs(x));
const quad = (b, c) => { let s = 'x²'; if (b) s += ` ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : n(b)}x`; if (c) s += ` ${c < 0 ? '−' : '+'} ${n(c)}`; return s; };
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q25: t => `Tank A holds 20 L and gains 6 L each hour: y = 6x + 20. Tank B holds ${64 + 4 * t} L and gains 2 L each hour: y = 2x + ${64 + 4 * t}.`,
 q26: t => `Grain sacks weigh 4 kg and bean sacks 3 kg. There are 3 more bean sacks than grain sacks, y = x + 3, and the load weighs ${7 * (t + 11) + 9} kg: 4x + 3y = ${7 * (t + 11) + 9}.`,
 q27: t => `Delivery 1: 3x + 2y = ${15 + 2 * (t + 11)} kg. Delivery 2: 5x + 2y = ${25 + 2 * (t + 11)} kg. x is a filter pack’s weight and y a valve pack’s.`,
 q28: t => `x + y + z = ${20 + t}, 3x + y + z = ${28 + t} and x + y + 2z = ${25 + t}, where x, y and z are the kg of a ration box, a fuel can and a tool kit.`,
 q29: t => `Shipping grid. Row 1: 12, 7, 9. Row 2: 5, 11, ${t + 11}. a(i, j) is the number in row i, column j.`,
 q30: t => `A sheet is halved 4 times, making 2⁴ pieces, then every piece is halved ${t + 11} more times: 2⁴ × 2${sup(t + 11)} pieces.`,
 q31: t => `A square floor plate has an area of ${(t + 11) * (t + 11)} m².`,
 q32: t => `A panel measures x + 3 m by x + ${t + 11} m, so its area is (x + 3)(x + ${t + 11}) m².`,
 q33: t => `A plate’s area is ${quad(t + 13, 2 * (t + 11))} m², and one side is x + 2 m.`,
 q34: t => { const r = (t + 10) % 7 + 1, g = Math.floor((t + 10) / 7) + 1; return `A trough follows y = ${quad(-(2 * r + 2 * g), r * (r + 2 * g))}. Its two roots are ${2 * g} apart.`; },
 q35: t => `A plate of area x² + 5x + 6 m² is cut into a strip x + 2 m wide, and x = ${t + 11}.`
});
})();
