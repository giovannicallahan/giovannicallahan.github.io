/* Foundations concept-bench experiments, file c: q25–q35. Model shape: docs/PACK-FORMAT.md ("Experiment").
   t is an integer slider value in [-10, 10]; values[0] is the target. Most models use u = t + 11 (1 to 21) so
   counts and lengths stay positive. The matching drill statements are in variants-c.js. */
(function(){
'use strict';
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const n = window.Gen.n;
/* Superscript digits: sup(12) → "¹²". */
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
/* x² + b·x + c written without zero terms or "+ −". */
const quad = (b, c) => { let s = 'x²'; if (b) s += ` ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : n(Math.abs(b))}x`; if (c) s += ` ${c < 0 ? '−' : '+'} ${n(Math.abs(c))}`; return s; };
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 q25: t => { t = T(t); const b2 = 64 + 4 * t, x = (b2 - 20) / 4; return E('Predict the hour x when the two tanks hold the same amount.', `6x + 20 = 2x + ${n(b2)}. Take 2x and 20 from both sides: 4x = ${n(b2 - 20)}, so x = ${n(x)}.`, [['Hour x when they match', x], ['Litres in each then', 6 * x + 20], ['Tank B at the start', b2], ['Tank A at the start', 20]]); },
 q26: t => { t = T(t); const x = t + 11, W = 7 * x + 9; return E('Predict x, the number of grain sacks.', `Substitute y = x + 3: 4x + 3(x + 3) = ${n(W)}, so 7x + 9 = ${n(W)}, 7x = ${n(W - 9)} and x = ${n(x)}.`, [['x (grain sacks)', x], ['y (bean sacks)', x + 3], ['Load (kg)', W]]); },
 q27: t => { t = T(t); const y = t + 11, c1 = 15 + 2 * y, c2 = 25 + 2 * y; return E('Predict y, the weight of one valve pack in kg.', `Second minus first: 2x = ${n(c2)} − ${n(c1)} = 10, so x = 5. Then 3 × 5 + 2y = ${n(c1)}, so 2y = ${n(c1 - 15)} and y = ${n(y)}.`, [['y (kg per valve pack)', y], ['x (kg per filter pack)', 5], ['Delivery 1 (kg)', c1], ['Delivery 2 (kg)', c2]]); },
 q28: t => { t = T(t); const y = t + 11, a = 9 + y, b = 17 + y, c = 14 + y; return E('Predict y, the weight of one fuel can in kg.', `Load 2 − load 1: 2x = ${n(b)} − ${n(a)} = 8, so x = 4. Load 3 − load 1: z = ${n(c)} − ${n(a)} = 5. Load 1: y = ${n(a)} − 4 − 5 = ${n(y)}.`, [['y (kg per fuel can)', y], ['x (kg per ration box)', 4], ['z (kg per tool kit)', 5], ['Load 1 (kg)', a]]); },
 q29: t => { t = T(t); const a23 = t + 11, c3 = 9 + a23; return E('Predict the column 3 sum, Σ a(i, 3) for i = 1 to 2.', `Column 3 holds a(1, 3) = 9 and a(2, 3) = ${n(a23)}: 9 + ${n(a23)} = ${n(c3)}.`, [['Column 3 sum', c3], ['Row 2 sum', 16 + a23], ['Grand total', 44 + a23]]); },
 q30: t => { t = T(t); const k = t + 11, e = 4 + k; return E('Predict the exponent when 2⁴ × 2' + sup(k) + ' is written as one power of 2.', `Four 2s times ${n(k)} more 2s is ${n(e)} twos: 2⁴ × 2${sup(k)} = 2${sup(e)}.`, [['Exponent', e], ['First exponent', 4], ['Second exponent', k]]); },
 q31: t => { t = T(t); const s = t + 11; return E('Predict the side of the square plate in metres.', `${n(s)} × ${n(s)} = ${n(s * s)}, so √${n(s * s)} = ${n(s)}.`, [['Side (m)', s], ['Area (m²)', s * s]]); },
 q32: t => { t = T(t); const b = t + 11; return E('Predict the x coefficient of (x + 3)(x + ' + n(b) + ') multiplied out.', `(x + 3)(x + ${n(b)}) = x² + ${n(b)}x + 3x + ${n(3 * b)} = x² + ${n(3 + b)}x + ${n(3 * b)}.`, [['x coefficient', 3 + b], ['Constant', 3 * b], ['x² coefficient', 1]]); },
 q33: t => { t = T(t); const q = t + 11; return E('Predict the number that goes with 2 in the factored form.', `2 × ${n(q)} = ${n(2 * q)} and 2 + ${n(q)} = ${n(q + 2)}, so ${quad(q + 2, 2 * q)} = (x + 2)(x + ${n(q)}).`, [['Other number', q], ['x coefficient', q + 2], ['Constant', 2 * q]]); },
 /* Two positive roots r and s = r + 2g (r = 1..7, g = 1..3, a different pair for every t), as in the mission: a zero or
    negative constant would need a factoring that is not taught. variants-c.js builds the same r and g. */
 q34: t => { t = T(t); const r = (t + 10) % 7 + 1, g = Math.floor((t + 10) / 7) + 1, s = r + 2 * g, h = r + g; return E('Predict the x of the vertex.', `y = ${quad(-(r + s), r * s)} = (x − ${n(r)})(x − ${n(s)}), with roots ${n(r)} and ${n(s)}. Halfway between them: x = ${n(h)}. There y = ${n(-g * g)}.`, [['Vertex x', h], ['Smaller root', r], ['Larger root', s], ['Vertex y', -g * g]]); },
 q35: t => { t = T(t); const x = t + 11, top = x * x + 5 * x + 6; return E('Predict the strip length in metres.', `(x² + 5x + 6) ÷ (x + 2) = x + 3. At x = ${n(x)}: ${n(x)} + 3 = ${n(x + 3)}. Check: ${n(top)} ÷ ${n(x + 2)} = ${n(x + 3)}.`, [['Length (m)', x + 3], ['Area (m²)', top], ['Width (m)', x + 2]]); }
});
})();
