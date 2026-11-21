/* Foundations concept-bench experiments, file d: q36–q40. Model shape: docs/PACK-FORMAT.md ("Experiment").
   t is an integer slider value in [-10, 10]; values[0] is the target. The statements in variants-d.js use the same numbers. */
(function(){
'use strict';
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 q36: t => { t = T(t); const x = (t + 10) % 11; return E('Predict the cable length L at that time, in metres.', `L(${x}) = 3 × ${x} + 12 = ${3 * x} + 12. The domain is 0 to 10 minutes, so the range runs from L(0) = 12 m to L(10) = 42 m.`, [['Cable length (m)', 3 * x + 12], ['Minutes (input)', x], ['Metres per minute', 3], ['Starting length (m)', 12]]); },
 q37: t => { t = T(t); const h = (t + 10) % 7 + 1, b = 9 - h; return E('Predict p(9), the motor steps for dial mark 9 under the shifted rule.', `p(9) = f(9 − ${h}) = f(${b}) = 4 × ${b} + 6. The graph of p is the graph of f slid ${h} to the right.`, [['Motor steps p(9)', 4 * b + 6], ['Shift to the right', h], ['Input used by f', b], ['Old steps f(9)', 42]]); },
 q38: t => { t = T(t); const s = t + 11, y = 5 * s + 20; return E('Predict the setting that drew this many watts.', `P⁻¹(${y}) = (${y} − 20) ÷ 5 = ${y - 20} ÷ 5. Check: 5 × ${s} + 20 = ${y}.`, [['Setting', s], ['Logged watts', y], ['Watts after taking away 20', y - 20]]); },
 q39: t => { t = T(t); const k = (t + 10) % 5 + 1, F = 3 ** k, X = 4 * F; return E('Predict how many tripling stages the signal needs.', `${X} ÷ 4 = ${F}, and ${F} is ${k} threes multiplied together, so log₃ ${F} = ${k}.`, [['Stages needed', k], ['Target strength (units)', X], ['Growth factor needed', F]]); },
 q40: t => { t = T(t); const arm = 5 * ((t + 10) % 6 + 1), tip = 4 * arm / 5; return E('Predict how high the boom tip rises above the pivot, in metres.', `sin θ = 24 ÷ 30, the fraction 24/30, which is 4/5 in lowest terms. The tip of a ${arm} m boom is ${arm} × 4/5 up: ${arm} ÷ 5 = ${arm / 5}, and ${arm / 5} × 4 = ${tip} m (and ${arm / 5} × 3 = ${3 * arm / 5} m across).`, [['Tip height (m)', tip], ['Boom length (m)', arm], ['Across from the pivot (m)', 3 * arm / 5]]); }
});
})();
