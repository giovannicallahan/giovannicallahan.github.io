/* Foundations concept-bench experiments, file a: q01–q12. Model shape: docs/PACK-FORMAT.md ("Experiment").
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
/* Shared with variants-a.js through the formulas below: keep the two files in step. The sum 3/12 + k/12 stays below
   one whole: a fraction larger than a whole is not taught in this pack. */
const q09k = t => [1, 2, 5, 7][(t + 10) % 4];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 q01: t => { t = T(t); const h = (t + 10) % 10; return E('Predict the total number of rivets.', `Thousands 3, hundreds ${h}, tens 0, ones 7. Written in that order, with 0 for the empty tens place, the digits make ${3007 + 100 * h}.`, [['Total rivets', 3007 + 100 * h], ['Hundreds digit stands for', 100 * h], ['Thousands digit stands for', 3000]]); },
 q02: t => { t = T(t); const c = 198 + 10 * t; return E('Predict the packs left after the survey team’s packs go out.', `347 + 285 = 632 packs after the shuttle, then 632 − ${c} = ${632 - c}.`, [['Packs left', 632 - c], ['Packs after shuttle', 632], ['Packs sent out', c]]); },
 q03: t => { t = T(t); const m = 18 + t; return E('Predict the jugs on all 4 racks.', `One rack: 7 × ${m} = ${7 * m} jugs. Four racks: ${7 * m} × 4 = ${28 * m} jugs.`, [['Jugs on 4 racks', 28 * m], ['Jugs on one rack', 7 * m], ['Jugs per shelf', m]]); },
 q04: t => { t = T(t); const N = 137 + t, q = Math.floor(N / 6), r = N % 6; return E('Predict how many boxes are completely full.', `6 × ${q} = ${6 * q}, which is not more than ${N}, and 6 × ${q + 1} = ${6 * q + 6} is. So ${q} boxes are full and ${r} packs are left over.`, [['Full boxes', q], ['Packs left over', r], ['Packs in all', N]]); },
 /* The bracket is at least 2: with a bracket of 1 the wrong left-to-right reading (5 + 3) × 1 also gives 8. */
 q05: t => { t = T(t); const c = 18 + t, b = c - 6; return E('Predict the value of the line, worked out in the agreed order.', `Bracket first: ${c} − 6 = ${b}. Then 3 × ${b} = ${3 * b}. Then 5 + ${3 * b} = ${5 + 3 * b}.`, [['Value', 5 + 3 * b], ['Bracket', b], ['3 × bracket', 3 * b]]); },
 q06: t => { t = T(t); const w = 10 + t;
  const how = w > 5 ? `From 5, 5 degrees down reach 0, and ${w - 5} more go below it: 5 − ${w} = ${n(5 - w)}.` : w === 5 ? 'From 5, 5 degrees down reach exactly 0: 5 − 5 = 0.' : w > 0 ? `From 5, ${w} degrees down stop at ${5 - w}, still above 0: 5 − ${w} = ${5 - w}.` : 'No fall, so the reading stays at 5: 5 − 0 = 5.';
  return E('Predict the night reading in °C.', how, [['Night reading (°C)', 5 - w], ['Noon reading (°C)', 5], ['Degrees fallen', w]]); },
 q07: t => { t = T(t); const k = (t + 10) % 7 + 1; return E('Predict the grams eaten.', `One piece is 40 ÷ 8 = 5 g, so ${k} pieces are ${k} × 5 = ${5 * k} g, which is ${k}/8 of the bar.`, [['Grams eaten', 5 * k], ['Pieces eaten', k], ['Grams per piece', 5]]); },
 q08: t => { t = T(t); const s = (t + 10) % 23 + 1, g = gcd(s, 24); return E('Predict the denominator of the fraction served, in lowest terms.', `${s}/24: the largest number dividing both ${s} and 24 is ${g}, so ${s}/24 = ${s / g}/${24 / g}.`, [['Denominator in lowest terms', 24 / g], ['Numerator in lowest terms', s / g], ['Largest number dividing both', g]]); },
 q09: t => { t = T(t); const k = q09k(t); return E('Predict the numerator of the sum when it is written in twelfths.', `1/4 = 3/12, so 1/4 + ${k}/12 = 3/12 + ${k}/12 = ${3 + k}/12.`, [['Numerator over 12', 3 + k], ['1/4 written in twelfths', 3], ['Twelfths of water', k]]); },
 q10: t => { t = T(t); const z = 50 + 5 * (t + 10), s = 275 + 160 + z; return E('Predict the total litres.', `2.75 + 1.60 + ${(z / 100).toFixed(2)} = ${(s / 100).toFixed(2)} L.`, [['Total litres', s / 100], ['Third canister (L)', z / 100], ['First two (L)', 4.35]]); },
 q11: t => { t = T(t); const p = 50 + 5 * t; return E('Predict the litres in the tank.', `1% of 400 L is 4 L, so ${p}% is ${p} × 4 = ${4 * p} L.`, [['Litres in tank', 4 * p], ['Litres to fill', 400 - 4 * p], ['Litres in 1%', 4]]); },
 q12: t => { t = T(t); const m = t + 11; return E('Predict the litres delivered.', `Rate: 84 ÷ 6 = 14 L per minute. In ${m} minutes: 14 × ${m} = ${14 * m} L.`, [['Litres delivered', 14 * m], ['Litres per minute', 14], ['Minutes', m]]); }
});
})();
