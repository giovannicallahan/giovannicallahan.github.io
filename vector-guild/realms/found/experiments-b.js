/* Foundations concept-bench experiments, file b: q13–q24. Model shape: docs/PACK-FORMAT.md ("Experiment").
   t is an integer slider value in [-10, 10]; values[0] is the target. Each model uses the numbers of its
   statement in variants-b.js for the same t. */
(function(){
'use strict';
const { n, par, vec } = window.Gen;
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 q13: t => { t = T(t); const a = 12 + t; return E('Predict the number in front of c.', `${n(a)} cans + 2 more cans = ${n(a + 2)} cans of c litres each, so the total is ${n(a + 2)}c + 15 litres.`, [['Number in front of c', a + 2], ['Cans before loading', a], ['Cans loaded', 2], ['Litres in the drum', 15]]); },
 q14: t => { t = T(t); const h = t + 11; return E('Predict the litres left.', `Put ${n(h)} in place of h: 200 − 8 × ${n(h)} = 200 − ${n(8 * h)} = ${n(200 - 8 * h)}.`, [['Litres left', 200 - 8 * h], ['Hours h', h], ['Litres burned', 8 * h]]); },
 q15: t => { t = T(t); const k = Math.abs(t) + 2; return E('Predict the number on its own after simplifying.', `${n(k)}(c + 4) + 3c = ${n(k)}c + ${n(4 * k)} + 3c = ${n(k + 3)}c + ${n(4 * k)}.`, [['Number on its own', 4 * k], ['Number in front of c', k + 3], ['Kits', k]]); },
 q16: t => { t = T(t); const b = 40 + t; return E('Predict x, the litres in the tank before the leak.', `x − 18 = ${n(b)}. Add 18 to both sides: x = ${n(b)} + 18 = ${n(b + 18)}.`, [['x (litres before)', b + 18], ['Litres lost', 18], ['Litres now', b]]); },
 q17: t => { t = T(t); const x = t + 12, R = 3 * (x + 2) + 12; return E('Predict x.', `3(x + 2) + 12 = ${n(R)} tidies to 3x + 18 = ${n(R)}. Subtract 18: 3x = ${n(3 * x)}. Divide by 3: x = ${n(x)}.`, [['x', x], ['3x', 3 * x], ['Right-hand side', R]]); },
 q18: t => { t = T(t); const cap = 200 + 10 * t, room = cap - 74, most = Math.floor(room / 14); return E('Predict the largest whole number of cans n.', `14n + 74 ≤ ${n(cap)}, so 14n ≤ ${n(room)}. ${n(room)} ÷ 14 = ${n(most)} remainder ${n(room - 14 * most)}, so n is at most ${n(most)}.`, [['Largest number of cans', most], ['Kg left for cans', room], ['Load limit (kg)', cap]]); },
 q19: t => { t = T(t); return E('Predict the cache’s x coordinate.', `${n(Math.abs(t))} km ${t < 0 ? 'west makes x negative' : 'east makes x positive or zero'}, and 4 km south makes y = −4, so the cache is at ${vec([t, -4])}.`, [['x', t], ['y', -4]]); },
 q20: t => { t = T(t); const k = Math.abs(t) + 1, a = 3 * k, b = 4 * k; return E('Predict the straight-line distance in km.', `Gaps ${n(a)} and ${n(b)}: ${n(a)} × ${n(a)} + ${n(b)} × ${n(b)} = ${n(a * a + b * b)}, and ${n(5 * k)} × ${n(5 * k)} = ${n(25 * k * k)}, so the distance is ${n(5 * k)} km.`, [['Distance (km)', 5 * k], ['East–west gap', a], ['North–south gap', b]]); },
 q21: t => { t = T(t); return E('Predict the slope in litres per hour.', `Rise = ${n(86 + 4 * t)} − 86 = ${n(4 * t)} L. Run = 6 − 2 = 4 hours. Slope = ${n(4 * t)} ÷ 4 = ${n(t)}.`, [['Slope (L per hour)', t], ['Rise (L)', 4 * t], ['Run (hours)', 4]]); },
 q22: t => { t = T(t); const x = t + 11, y = 150 - 7 * x; return E('Predict the litres y.', `y = −7 × ${n(x)} + 150 = ${n(-7 * x)} + 150 = ${n(y)}.`, [['Litres y', y], ['Hours x', x], ['Slope m', -7], ['Start b', 150]]); },
 q23: t => { t = T(t); const b = 5 - 2 * t; return E('Predict b, where the line crosses the y-axis.', `m = (${n(5 + 4 * t)} − 5) ÷ (6 − 2) = ${n(4 * t)} ÷ 4 = ${n(t)}. Then 5 = ${n(t)} × 2 + b, so b = 5 − ${par(2 * t)} = ${n(b)}.`, [['b', b], ['Slope m', t], ['Rise', 4 * t]]); },
 q24: t => { t = T(t); return E('Predict the drone’s final x.', `x: 2 + (−5) + ${par(t)} = ${n(t - 3)}. The y and z are −1 + 4 + (−6) = −3 and 3 + 2 + (−4) = 1.`, [['Final x', t - 3], ['Final y', -3], ['Final z', 1]]); }
});
})();
