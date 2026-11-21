/* Linear algebra practice missions, file 5 of 14: concepts q21–q25, three practice missions each
   (q21b q21c q21d ... q25b q25c q25d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p5.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par, vec } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* practice(meta, stepLabels, generator): the mission's prompt, answers, hints, solution and guided steps are
   build(canonical) itself. `meta` holds what a generator does not make: id, parent, kind, title, brief, labels,
   tolerance (and uses for a challenge); `stepLabels` holds the answer labels of each guided step, in order.
   To read a mission as the player sees it: node qa/show-mission.js <id> */
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer, labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer, labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* "[[2,0],[0,1]]": a matrix written row by row. */
const mat = M => '[[' + M.map(r => r.map(n).join(',')).join('],[') + ']]';
void add; void practice; void plus; void par; void vec; void mat;

/* ---- missions for q21–q25 ---- */
/* ---- shared helpers for this file ---- */
const T = G.tidy;
/* Tries random parameters until they pass the mission's own checks; the fallback is never reached in practice. */
const until = (make, ok, fallback) => { for (let i = 0; i < 2000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* "3x", "x", "−x": a first term; pco: a following term with its sign, " + 2y", " − y". */
const co = (c, s) => (c === 1 ? '' : c === -1 ? '−' : n(c)) + s;
const pco = (c, s) => (c < 0 ? ' − ' : ' + ') + (Math.abs(c) === 1 ? '' : n(Math.abs(c))) + s;
/* " + 3" / " − 2": a signed number inside a spaced sum; sumOf([3,−2,5]) → "3 − 2 + 5". */
const pm = x => (x < 0 ? ' − ' : ' + ') + n(Math.abs(x));
const sumOf = xs => xs.map((x, i) => i ? pm(x) : n(x)).join('');
/* "2·3 + (−1)·4": a row times a vector, written out. */
const rd = (row, v) => row.map((x, i) => `${i ? par(x) : n(x)}·${par(v[i])}`).join(' + ');
/* "2⁴", "(−1)³". */
const sup = k => String(k).split('').map(ch => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch]).join('');
const pw = (base, k) => par(base) + sup(k);
const mul2 = (m, v) => [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
const M2 = m => mat([[m[0], m[1]], [m[2], m[3]]]);
/* "A − 2I" / "A + 3I". */
const shift = lam => `A ${lam < 0 ? '+' : '−'} ${Math.abs(lam) === 1 ? '' : n(Math.abs(lam))}I`;

/* ==== q21 Normal equations (taught: design rows (1, t); the sums give AᵀA and Aᵀy; solve the 2×2 system; intercept
        first, then slope). The parent always uses times 0, 1, 2. Every draw here is "a line plus a wobble that the
        line cannot absorb", so a and b are whole numbers and the line never passes through all the points. ==== */

/* q21b: four samples at weeks 0–3, so the sums are 4, 6 and 14 instead of 3, 3 and 5. The wobble patterns are chosen so
   that joining the first and last points never gives the fitted slope. */
practice({ id: 'q21b', parent: 'q21', kind: 'setting',
 title: 'Lengths in the pool',
 brief: 'A swimming coach has four weeks of counts and wants the steady trend behind the good and bad weeks.',
 labels: ['start level a', 'gain per week b'], tolerance: 0.01 },
 [['sum of counts', 'sum of week × count'], ['gain per week b'], ['start level a']], {
 canonical: { ys: [7, 7, 13, 15] },
 draw: R => until(() => { const a = R.int(4, 12), b = R.int(1, 5), k = R.pick([-2, -1, 1, 2]), r = R.pick([[1, -2, 1, 0], [0, 1, -2, 1], [1, -3, 3, -1]]);
   return { ys: [0, 1, 2, 3].map(t => a + b * t + k * r[t]) }; }, p => p.ys.every(y => y >= 1) && p.ys.join() !== '7,7,13,15', { ys: [5, 10, 9, 14] }),
 build: ({ ys }) => { const Sy = ys[0] + ys[1] + ys[2] + ys[3], Sty = ys[1] + 2 * ys[2] + 3 * ys[3], D = 2 * Sty - 3 * Sy, b = D / 10, a = (Sy - 6 * b) / 4; return {
  prompt: `A coach counts how many lengths a new swimmer manages without a rest. Week 0: ${n(ys[0])}. Week 1: ${n(ys[1])}. Week 2: ${n(ys[2])}. Week 3: ${n(ys[3])}. Fit the trend line y = a + bt by least squares, where t is the week number and y is the count. Enter the start level a, then the gain per week b.`,
  answer: [a, b],
  hints: ['There are four samples here, so the sums are new. The number of samples is 4. The week numbers add to 0 + 1 + 2 + 3 = 6. Their squares add to 0 + 1 + 4 + 9 = 14.',
   'The normal equations are 4a + 6b = (sum of the counts) and 6a + 14b = (sum of week × count). Take three times the first from twice the second, and only b is left.'],
  solution: `Sum of the counts: ${sumOf(ys)} = ${n(Sy)}. Sum of week × count: 0·${n(ys[0])} + 1·${n(ys[1])} + 2·${n(ys[2])} + 3·${n(ys[3])} = ${n(Sty)}. The normal equations are 4a + 6b = ${n(Sy)} and 6a + 14b = ${n(Sty)}. Twice the second is 12a + 28b = ${n(2 * Sty)}; three times the first is 12a + 18b = ${n(3 * Sy)}. Subtract: 10b = ${n(D)}, so b = ${n(b)}. Then 4a = ${n(Sy)} − 6·${n(b)} = ${n(4 * a)}, so a = ${n(a)}. The line y = ${n(a)}${pco(b, 't')} does not pass through every count, and it is not meant to.`,
  guidance: [
   { prompt: `Add the four counts ${ys.map(n).join(', ')}. Then multiply each count by its week number (0, 1, 2, 3) and add those products. Enter the sum of the counts, then the sum of week × count.`, answer: [Sy, Sty], explanation: `${sumOf(ys)} = ${n(Sy)}, and 0·${n(ys[0])} + 1·${n(ys[1])} + 2·${n(ys[2])} + 3·${n(ys[3])} = ${n(Sty)}. These are the right-hand sides of the normal equations.` },
   { prompt: `The normal equations are 4a + 6b = ${n(Sy)} and 6a + 14b = ${n(Sty)}. Take three times the first from twice the second. What is b?`, answer: [b], explanation: `(12a + 28b) − (12a + 18b) = ${n(2 * Sty)} − ${n(3 * Sy)}, so 10b = ${n(D)} and b = ${n(b)}. That is the gain per week, in lengths.` },
   { prompt: `Put b = ${n(b)} into 4a + 6b = ${n(Sy)}. What is a?`, answer: [a], explanation: `4a = ${n(Sy)} − ${n(6 * b)} = ${n(4 * a)}, so a = ${n(a)}. That is the fitted count at week 0.` }
  ] }; }
});

/* q21c: unevenly spaced days 0, 1, 3 (sums 3, 4, 10), then a forecast from the fitted line. With uneven spacing the
   slope through the first and last points is never the fitted slope. */
practice({ id: 'q21c', parent: 'q21', kind: 'applied',
 title: 'Orders after the advert',
 brief: 'A shop has three days of order counts with one day missing, and it wants a forecast for a few days ahead.',
 labels: ['start level a', 'change per day b', 'forecast orders'], tolerance: 0.01 },
 [['sum of orders', 'sum of day × orders'], ['start level a', 'change per day b'], ['forecast orders']], {
 canonical: { ys: [12, 9, 17], day: 6 },
 draw: R => until(() => { const a = R.int(6, 20), b = R.nz(-2, 4), k = R.pick([-1, 1]);
   return a + b * 10 >= 1 ? { ys: [a + 2 * k, a + b - 3 * k, a + 3 * b + k], day: R.pick([5, 6, 7, 8, 10]) } : { ys: [0, 0, 0], day: 5 }; },
  p => p.ys.every(y => y >= 1) && p.ys.join() !== '12,9,17', { ys: [12, 9, 17], day: 8 }),
 build: ({ ys, day }) => { const Sy = ys[0] + ys[1] + ys[2], Sty = ys[1] + 3 * ys[2], D = 3 * Sty - 4 * Sy, b = D / 14, a = (Sy - 4 * b) / 3, f = a + b * day; return {
  prompt: `An online shop runs an advert and counts its orders each day. Day 0: ${n(ys[0])} orders. Day 1: ${n(ys[1])} orders. The counter was down on day 2. Day 3: ${n(ys[2])} orders. Fit the line y = a + bt by least squares, where t is the day and y is the orders. Then use the line to forecast day ${n(day)}. Enter a, then b, then the forecast for day ${n(day)}.`,
  answer: [a, b, f],
  hints: ['The days are 0, 1 and 3, not 0, 1 and 2. There are 3 samples, the days add to 4, and their squares add to 0 + 1 + 9 = 10.',
   `The normal equations are 3a + 4b = (sum of the orders) and 4a + 10b = (sum of day × orders). When you have a and b, the forecast is a + b × ${n(day)}.`],
  solution: `Sum of the orders: ${sumOf(ys)} = ${n(Sy)}. Sum of day × orders: 0·${n(ys[0])} + 1·${n(ys[1])} + 3·${n(ys[2])} = ${n(Sty)}. The normal equations are 3a + 4b = ${n(Sy)} and 4a + 10b = ${n(Sty)}. Three times the second is 12a + 30b = ${n(3 * Sty)}; four times the first is 12a + 16b = ${n(4 * Sy)}. Subtract: 14b = ${n(D)}, so b = ${n(b)}. Then 3a = ${n(Sy)} − 4·${par(b)} = ${n(3 * a)}, so a = ${n(a)}. Forecast for day ${n(day)}: ${n(a)} + ${par(b)}·${n(day)} = ${n(f)} order${f === 1 ? '' : 's'}.`,
  guidance: [
   { prompt: `Add the three order counts ${ys.map(n).join(', ')}. Then multiply each count by its day (0, 1, 3) and add those products. Enter the sum of the orders, then the sum of day × orders.`, answer: [Sy, Sty], explanation: `${sumOf(ys)} = ${n(Sy)}, and 0·${n(ys[0])} + 1·${n(ys[1])} + 3·${n(ys[2])} = ${n(Sty)}.` },
   { prompt: `The normal equations are 3a + 4b = ${n(Sy)} and 4a + 10b = ${n(Sty)}. Take four times the first from three times the second to find b, then put b back to find a. Enter a, then b.`, answer: [a, b], explanation: `(12a + 30b) − (12a + 16b) = ${n(3 * Sty)} − ${n(4 * Sy)}, so 14b = ${n(D)} and b = ${n(b)}. Then 3a = ${n(Sy)} − ${par(4 * b)} = ${n(3 * a)}, so a = ${n(a)}.` },
   { prompt: `The fitted line is y = ${n(a)}${pco(b, 't')}. What does it give at t = ${n(day)}?`, answer: [f], explanation: `${n(a)} + ${par(b)}·${n(day)} = ${n(f)} order${f === 1 ? '' : 's'}. A forecast trusts the trend to carry on.` }
  ] }; }
});

/* q21d: times on both sides of zero (−2, −1, 1, 2), so the normal equations uncouple, then the sum of squared
   residuals from q20. */
practice({ id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q20',
 title: 'Drift around noon',
 brief: 'A hull thermometer was read before and after noon, and the log needs its trend and how well that trend fits.',
 labels: ['noon value a', 'drift per hour b', 'sum of squared residuals'], tolerance: 0.01 },
 [['sum of readings', 'sum of time × reading'], ['noon value a', 'drift per hour b'], ['sum of squared residuals']], {
 canonical: { ys: [6, 2, 4, 0] },
 draw: R => until(() => { const a = R.int(-4, 9), b = R.nz(-3, 3), k = R.pick([-2, -1, 1, 2]), r = R.pick([[1, -1, -1, 1], [1, -2, 2, -1]]);
   return { ys: [-2, -1, 1, 2].map((t, i) => a + b * t + k * r[i]) }; }, p => p.ys.join() !== '6,2,4,0' && p.ys.every(y => Math.abs(y) <= 15), { ys: [3, 4, 0, 5] }),
 build: ({ ys }) => { const ts = [-2, -1, 1, 2], Sy = ys[0] + ys[1] + ys[2] + ys[3], Sty = dot(ts, ys), a = Sy / 4, b = Sty / 10,
   fit = ts.map(t => a + b * t), res = ys.map((y, i) => y - fit[i]), sse = dot(res, res); return {
  prompt: `A hull thermometer is read four times around noon. With t in hours after noon (a negative t is before noon), the samples (t, °C) are (−2, ${n(ys[0])}), (−1, ${n(ys[1])}), (1, ${n(ys[2])}) and (2, ${n(ys[3])}). Fit the line y = a + bt by least squares. Then find each residual (the reading minus the line's value at that time), square the four residuals and add them. Enter a, then b, then the sum of squared residuals.`,
  answer: [a, b, sse],
  hints: ['The four times add to 0, so each normal equation has only one unknown. The squared times add to 4 + 1 + 1 + 4 = 10. So 4a = (sum of the readings) and 10b = (sum of time × reading).',
   'For the residuals, work out a + bt at each of the four times and take it away from the reading there. Watch the signs when t is negative.'],
  solution: `Sum of the readings: ${sumOf(ys)} = ${n(Sy)}, so 4a = ${n(Sy)} and a = ${n(a)}. Sum of time × reading: ${rd(ts, ys)} = ${n(Sty)}, so 10b = ${n(Sty)} and b = ${n(b)}. The line gives ${fit.map(n).join(', ')} at the four times. Residuals: ${res.map(n).join(', ')}. Their squares add to ${res.map(x => n(x * x)).join(' + ')} = ${n(sse)}.`,
  guidance: [
   { prompt: `Add the four readings ${ys.map(n).join(', ')}. Then multiply each reading by its time (−2, −1, 1, 2) and add those products. Enter the sum of the readings, then the sum of time × reading.`, answer: [Sy, Sty], explanation: `${sumOf(ys)} = ${n(Sy)}, and ${rd(ts, ys)} = ${n(Sty)}.` },
   { prompt: `The times add to 0, so the normal equations are 4a = ${n(Sy)} and 10b = ${n(Sty)}. Enter a, then b.`, answer: [a, b], explanation: `a = ${n(Sy)} ÷ 4 = ${n(a)} °C at noon, and b = ${n(Sty)} ÷ 10 = ${n(b)} °C per hour.` },
   { prompt: `The line y = ${n(a)}${pco(b, 't')} gives ${fit.map(n).join(', ')} at t = −2, −1, 1, 2. Take each from its reading, square the four results and add them. What is the sum?`, answer: [sse], explanation: `The residuals are ${res.map(n).join(', ')}, and ${res.map(x => n(x * x)).join(' + ')} = ${n(sse)}. No other line gives a smaller sum.` }
  ] }; }
});

/* ==== q22 QR factorization (taught: q₁, q₂ from Gram–Schmidt; r₁₁ = q₁·a₁, r₁₂ = q₁·a₂, r₂₂ = q₂·a₂; positive diagonal).
        In the parent a₁ always lies on a coordinate axis. ==== */
const qr = (a1, a2) => { const r11 = Math.round(Math.hypot(...a1)), d = dot(a1, a2), q1 = a1.map(x => T(x / r11)), r12 = T(d / r11),
  proj = a1.map(x => T(x * d / (r11 * r11))), res = a2.map((x, i) => T(x - proj[i])), r22 = Math.round(Math.hypot(...res)), q2 = res.map(x => T(x / r22));
  return { r11, r12, r22, q1, q2, proj, res }; };

/* q22b: a₁ is tilted (a 3-4-5 direction in two of the axes), so its length has to be found and q₁ has decimals. */
practice({ id: 'q22b', parent: 'q22', kind: 'setting',
 title: 'A tilted first column',
 brief: 'A table of sensor readings has to be factored before a fit, and its first column does not lie along an axis.',
 labels: ['R11', 'R12', 'R22'], tolerance: 0.01 },
 [['R11'], ['R12'], ['R22']], {
 canonical: { a1: [3, 4, 0], a2: [6, 8, 7] },
 draw: R => until(() => { const i = R.int(0, 2), rest = [0, 1, 2].filter(x => x !== i), j = rest[0], k = rest[1], [P, Q] = R.bool() ? [3, 4] : [4, 3],
    sj = R.pick([-1, 1]), sk = R.pick([-1, 1]), t = R.pick([1, 1, 2]), m = R.nz(-2, 2), a1 = [0, 0, 0], a2 = [0, 0, 0];
   a1[j] = P * sj * t; a1[k] = Q * sk * t;
   if (R.next() < 0.6) { a2[j] = m * P * sj; a2[k] = m * Q * sk; a2[i] = R.nz(-9, 9); }
   else { const c = R.pick([-1, 1]); a2[j] = m * P * sj - c * Q * sk; a2[k] = m * Q * sk + c * P * sj; }
   return { a1, a2 }; }, p => p.a2.every(x => Math.abs(x) <= 12) && !(p.a1.join() === '3,4,0' && p.a2.join() === '6,8,7'), { a1: [0, 4, 3], a2: [2, -4, -3] }),
 build: ({ a1, a2 }) => { const f = qr(a1, a2), sq = a1.map(x => n(x * x)).join(' + '), rsq = f.res.map(x => n(x * x)).join(' + '); return {
  prompt: `A data table has two columns of readings from three sensors. Column 1 is a₁ = ${vec(a1)} and column 2 is a₂ = ${vec(a2)}. Before a fit, the software factors the table as A = QR. Q holds two perpendicular unit directions q₁ and q₂, and R is the small triangle of numbers that rebuilds the columns from them. Keep the diagonal of R positive. Enter r₁₁, then r₁₂, then r₂₂.`,
  answer: [f.r11, f.r12, f.r22],
  hints: ['Column 1 does not lie along an axis, so find its length first: square its entries, add them and take the square root. That length is r₁₁, and a₁ divided by it is the unit direction q₁.',
   'r₁₂ is the dot product q₁·a₂. Take r₁₂ times q₁ away from a₂. The length of what is left is r₂₂.'],
  solution: `The length of a₁ is √(${sq}) = ${n(f.r11)}, so r₁₁ = ${n(f.r11)} and q₁ = ${vec(f.q1)}. r₁₂ = q₁·a₂ = ${rd(f.q1, a2)} = ${n(f.r12)}. The part of a₂ along q₁ is ${n(f.r12)} × q₁ = ${vec(f.proj)}. What is left is ${vec(f.res)}, of length ${n(f.r22)}, so r₂₂ = ${n(f.r22)} and q₂ = ${vec(f.q2)}. R = ${mat([[f.r11, f.r12], [0, f.r22]])}.`,
  guidance: [
   { prompt: `Find the length of a₁ = ${vec(a1)}: square its entries, add them and take the square root. This length is r₁₁.`, answer: [f.r11], explanation: `√(${sq}) = ${n(f.r11)}. Dividing a₁ by ${n(f.r11)} gives the unit direction q₁ = ${vec(f.q1)}.` },
   { prompt: `With q₁ = ${vec(f.q1)}, compute r₁₂ = q₁·a₂ for a₂ = ${vec(a2)}.`, answer: [f.r12], explanation: `${rd(f.q1, a2)} = ${n(f.r12)}. This is how much of q₁ there is in column 2.` },
   { prompt: `Take ${n(f.r12)} × q₁ = ${vec(f.proj)} away from a₂ = ${vec(a2)}. Enter the length of what is left. This is r₂₂.`, answer: [f.r22], explanation: `What is left is ${vec(f.res)}, and √(${rsq}) = ${n(f.r22)}. A length is never negative, so the diagonal of R is positive.` }
  ] }; }
});

/* q22c: the factorization read backwards. Q and R are given and the player rebuilds column 2 of A. */
practice({ id: 'q22c', parent: 'q22', kind: 'applied',
 title: 'Rebuilding from Q and R',
 brief: 'A robot arm keeps its calibration table in factored form, and a technician needs one of the original columns back.',
 labels: ['column 2 x', 'column 2 y', 'column 2 z'], tolerance: 0.01 },
 [['column 1 x', 'column 1 y', 'column 1 z'], ['part x', 'part y', 'part z'], ['column 2 x', 'column 2 y', 'column 2 z']], {
 canonical: { q1: [1, 0, 0], q2: [0, 0.6, 0.8], R: [2, 3, 10] },
 draw: R => until(() => { const i = R.int(0, 2), rest = [0, 1, 2].filter(x => x !== i), [P, Q] = R.bool() ? [0.6, 0.8] : [0.8, 0.6], q1 = [0, 0, 0], q2 = [0, 0, 0];
   q1[i] = 1; q2[rest[0]] = P * R.pick([-1, 1]); q2[rest[1]] = Q * R.pick([-1, 1]);
   return { q1, q2, R: [R.int(1, 6), R.nz(-6, 6), 5 * R.int(1, 3)] }; },
  p => !(p.R[0] === p.R[1] && p.R[1] === p.R[2]) && !(p.q2.join() === '0,0.6,0.8' && p.R.join() === '2,3,10'), { q1: [0, 1, 0], q2: [0.8, 0, -0.6], R: [4, -2, 5] }),
 build: ({ q1, q2, R }) => { const [r11, r12, r22] = R, c1 = q1.map(x => T(r11 * x)), along = q1.map(x => T(r12 * x)), part = q2.map(x => T(r22 * x)), c2 = along.map((x, i) => T(x + part[i])); return {
  prompt: `A robot arm stores its calibration table A in factored form, A = QR, to save space. Q has the unit columns q₁ = ${vec(q1)} and q₂ = ${vec(q2)}, and R = ${mat([[r11, r12], [0, r22]])}. R says how to rebuild the columns of A: column 1 is r₁₁ × q₁, and column 2 is r₁₂ × q₁ plus r₂₂ × q₂. Enter column 2 of A: x, then y, then z.`,
  answer: c2,
  hints: ['Read R by its columns. The second column of R has r₁₂ on top and r₂₂ below it: these are the amounts of q₁ and q₂ in column 2 of A.',
   'Scale each unit direction first: multiply every entry of q₁ by r₁₂ and every entry of q₂ by r₂₂. Then add the two results entry by entry.'],
  solution: `Column 2 of R is (${n(r12)}, ${n(r22)}), so column 2 of A is ${n(r12)} × q₁ + ${n(r22)} × q₂. ${n(r12)} × ${vec(q1)} = ${vec(along)}, and ${n(r22)} × ${vec(q2)} = ${vec(part)}. Adding them gives ${vec(c2)}. Column 1 is simply ${n(r11)} × q₁ = ${vec(c1)}.`,
  guidance: [
   { prompt: `Start with the easy column. Column 1 of A is r₁₁ × q₁ = ${n(r11)} × ${vec(q1)}. Enter its three entries.`, answer: c1, explanation: `${n(r11)} × ${vec(q1)} = ${vec(c1)}. The 0 under r₁₁ in R says column 1 needs no q₂ at all.` },
   { prompt: `For column 2, first find the part along q₂: r₂₂ × q₂ = ${n(r22)} × ${vec(q2)}. Enter its three entries.`, answer: part, explanation: `Each entry of q₂ is multiplied by ${n(r22)}: ${vec(part)}.` },
   { prompt: `Now add the part along q₁, which is r₁₂ × q₁ = ${vec(along)}. Enter column 2 of A: x, then y, then z.`, answer: c2, explanation: `${vec(along)} + ${vec(part)} = ${vec(c2)}. Q gave the directions and R gave the amounts.` }
  ] }; }
});

/* q22d: a₁ may point backwards along its axis (so q₁ carries a minus sign), the leftover of a₂ is a 3-4-5 or 5-12-13
   triangle, and R is then used the way a fit uses it: a triangular system solved from the bottom up (q12). */
practice({ id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q12',
 title: 'Weights from the triangle',
 brief: 'Two beacon directions have to be factored, and then the triangle R is used to find the two fit weights.',
 labels: ['R11', 'R12', 'R22', 'x1', 'x2'], tolerance: 0.01 },
 [['R11', 'R12'], ['R22'], ['x1', 'x2']], {
 canonical: { a1: [0, -2, 0], a2: [3, 4, 4], c: [-2, 10] },
 draw: R => until(() => { const i = R.int(0, 2), rest = [0, 1, 2].filter(x => x !== i), a1 = [0, 0, 0], a2 = [0, 0, 0], pr = R.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]);
   a1[i] = (R.next() < 0.65 ? -1 : 1) * R.int(1, 5); a2[i] = R.nz(-6, 6); a2[rest[0]] = pr[0] * R.pick([-1, 1]); a2[rest[1]] = pr[1] * R.pick([-1, 1]);
   const f = qr(a1, a2), x1 = R.nz(-4, 4), x2 = R.nz(-3, 3);
   return { a1, a2, c: [f.r11 * x1 + f.r12 * x2, f.r22 * x2] }; },
  p => !(p.a1.join() === '0,-2,0' && p.a2.join() === '3,4,4'), { a1: [3, 0, 0], a2: [-2, 6, 8], c: [7, -10] }),
 build: ({ a1, a2, c }) => { const f = qr(a1, a2), x2 = T(c[1] / f.r22), x1 = T((c[0] - f.r12 * x2) / f.r11), rsq = f.res.map(x => n(x * x)).join(' + '),
   e1 = `${co(f.r11, 'x₁')}${pco(f.r12, 'x₂')} = ${n(c[0])}`, e2 = `${co(f.r22, 'x₂')} = ${n(c[1])}`; return {
  prompt: `Two beacons give the columns of a calibration matrix A: a₁ = ${vec(a1)} and a₂ = ${vec(a2)}. Factor A = QR with a positive diagonal in R. The fit then needs the weights x₁ and x₂ that solve the triangular system r₁₁x₁ + r₁₂x₂ = ${n(c[0])} and r₂₂x₂ = ${n(c[1])}. Enter r₁₁, r₁₂ and r₂₂, then x₁, then x₂.`,
  answer: [f.r11, f.r12, f.r22, x1, x2],
  hints: ['r₁₁ is the length of a₁, so it is never negative. The unit direction q₁ = a₁ ÷ r₁₁ carries the sign of a₁, and that sign shows up in r₁₂ = q₁·a₂.',
   'Put your three numbers into the system and solve it from the bottom up: the second equation gives x₂ at once, then the first gives x₁.'],
  solution: `a₁ has length ${n(f.r11)}, so r₁₁ = ${n(f.r11)} and q₁ = ${vec(f.q1)}. r₁₂ = q₁·a₂ = ${n(f.r12)}. Taking ${n(f.r12)} × q₁ = ${vec(f.proj)} away from a₂ leaves ${vec(f.res)}, of length √(${rsq}) = ${n(f.r22)}, so r₂₂ = ${n(f.r22)}. The system is ${e1} and ${e2}. From the second, x₂ = ${n(x2)}. Then ${co(f.r11, 'x₁')} = ${n(c[0])} − ${par(f.r12)}·${par(x2)} = ${n(f.r11 * x1)}${f.r11 === 1 ? '' : `, so x₁ = ${n(x1)}`}.`,
  guidance: [
   { prompt: `Divide a₁ = ${vec(a1)} by its length to get q₁ = ${vec(f.q1)}. Compute r₁₁ = q₁·a₁ and r₁₂ = q₁·a₂ for a₂ = ${vec(a2)}.`, answer: [f.r11, f.r12], explanation: `q₁·a₁ = ${n(f.r11)}, the length of a₁, and q₁·a₂ = ${rd(f.q1, a2)} = ${n(f.r12)}.` },
   { prompt: `Take ${n(f.r12)} × q₁ = ${vec(f.proj)} away from a₂. What is left is ${vec(f.res)}. Enter its length, r₂₂.`, answer: [f.r22], explanation: `√(${rsq}) = ${n(f.r22)}. So R = ${mat([[f.r11, f.r12], [0, f.r22]])}.` },
   { prompt: `Solve ${e2} first, then ${e1}. Enter x₁, then x₂.`, answer: [x1, x2], explanation: `x₂ = ${n(c[1])} ÷ ${n(f.r22)} = ${n(x2)}. Then ${co(f.r11, 'x₁')} = ${n(c[0])} − ${par(f.r12)}·${par(x2)} = ${n(f.r11 * x1)}${f.r11 === 1 ? '' : `, so x₁ = ${n(x1)}`}. A triangle of numbers is solved from the bottom up, with no elimination needed.` }
  ] }; }
});

/* ==== q23 Eigenvalues (taught: an eigenvector keeps its direction, the eigenvalue is its scale factor;
        det(A − λI) = 0; a triangular matrix shows its eigenvalues on the diagonal). ==== */

/* q23b: the matrix is not given. The player writes it from a rule in words, sees that it is triangular and reads the
   diagonal. The linking number is never equal to a diagonal entry, so using it by mistake is always wrong. */
practice({ id: 'q23b', parent: 'q23', kind: 'setting',
 title: 'Two sites, one clip',
 brief: 'A clip is spreading on two linked sites, and the media desk wants its two natural growth factors.',
 labels: ['smaller eigenvalue', 'larger eigenvalue'], tolerance: 0.01 },
 [['entry 11', 'entry 12', 'entry 21', 'entry 22'], ['first diagonal', 'second diagonal']], {
 canonical: { a: 3, o: 2, d: 1.5 },
 draw: R => until(() => { const a = R.pick([0.5, 1.5, 2, 2.5, 3, 4, 5]), d = R.pick([0.5, 1.5, 2, 2.5, 3, 4, 5]); return { a, o: R.int(2, 6), d }; },
  p => p.a !== p.d && p.o !== p.a && p.o !== p.d && !(p.a === 3 && p.d === 1.5), { a: 2, o: 5, d: 4 }),
 build: ({ a, o, d }) => { const lo = Math.min(a, d), hi = Math.max(a, d), M = mat([[a, 0], [o, d]]); return {
  prompt: `A clip is posted on two sites. Each day, the daily views on site A are ${n(a)} times those of the day before. The daily views on site B are ${n(d)} times its own views of the day before, plus ${n(o)} more for every view on site A the day before, because viewers follow a link. This rule is a matrix that turns (views on A, views on B) into the next day's pair. Enter the two eigenvalues of that matrix, the smaller one first.`,
  answer: [lo, hi],
  hints: ['Write the rule as a matrix first. Row 1 builds the new A from the old (A, B) and row 2 builds the new B. Site A takes nothing from site B, so one entry of row 1 is 0.',
   'A matrix with a 0 in one corner off the diagonal is triangular, so its eigenvalues sit on its diagonal. The number that links the two sites is off the diagonal and is not an eigenvalue.'],
  solution: `New A = ${n(a)} × A + 0 × B and new B = ${n(o)} × A + ${n(d)} × B, so the matrix is ${M}. It is triangular: det(A − λI) = (${n(a)} − λ)(${n(d)} − λ), which is 0 when λ = ${n(a)} or λ = ${n(d)}. In ascending order the eigenvalues are ${n(lo)} and ${n(hi)}. The link number ${n(o)} changes the eigenvectors, not the eigenvalues.`,
  guidance: [
   { prompt: `Row 1: new A = ${n(a)} × A + 0 × B. Row 2: new B = ${n(o)} × A + ${n(d)} × B. Enter the matrix row by row.`, answer: [a, 0, o, d], explanation: `The matrix is ${M}. Each row holds the two numbers that build one new value.` },
   { prompt: `The matrix ${M} has a 0 above its diagonal, so it is triangular. Enter its two diagonal entries, top left first.`, answer: [a, d], explanation: `The diagonal entries ${n(a)} and ${n(d)} are the eigenvalues. Sorted, they are ${n(lo)} and ${n(hi)}. In the long run the clip grows by the larger factor each day.` }
  ] }; }
});

/* q23c: the definition used directly on a matrix that is NOT triangular. The player multiplies Av and reads off the
   scale factor. Neither diagonal entry of A is the eigenvalue. */
practice({ id: 'q23c', parent: 'q23', kind: 'applied',
 title: 'The arrow the filter keeps',
 brief: 'A photo filter leaves one arrow on its own line, and the editor wants to know by how much it scales that arrow.',
 labels: ['Av x', 'Av y', 'eigenvalue'], tolerance: 0.01 },
 [['Av x', 'Av y'], ['eigenvalue']], {
 canonical: { m: [4, -2, 1, 1], v: [2, 1] },
 draw: R => until(() => { const [p, q] = R.pick([[1, 1], [1, -1], [2, 1], [1, 2], [-1, 2], [2, -1], [3, 1], [1, 3], [1, -2], [3, -1], [-1, 3], [2, 3], [3, 2], [3, -2], [-2, 3]]),
    lam = R.except(-4, 5, [0, 1]), s = R.nz(-2, 2), t = R.nz(-2, 2);
   return { m: [lam - q * s, s * p, q * t, lam - t * p], v: [p, q] }; },
  p => p.m.every(e => Math.abs(e) <= 9) && !(p.m.join() === '4,-2,1,1' && p.v.join() === '2,1'), { m: [1, 2, 3, 2], v: [2, 3] }),
 build: ({ m, v }) => { const Av = mul2(m, v), lam = Av[0] / v[0]; return {
  prompt: `A photo filter moves every point of a picture by the matrix A = ${M2(m)}. An arrow drawn along v = ${vec(v)} stays on its own line under the filter: it is only stretched, shrunk or flipped. Work out Av. Then find the eigenvalue, the one number λ with Av = λv. Enter Av as x, then y, then enter λ.`,
  answer: [Av[0], Av[1], lam],
  hints: ['Multiply each row of A by v: the first entry of the row times the x of v, plus the second entry times the y of v.',
   'Compare Av with v entry by entry. Each entry of Av is the same multiple of the matching entry of v. This matrix is not triangular, so its diagonal does not show the eigenvalues.'],
  solution: `Av = (${rd([m[0], m[1]], v)}, ${rd([m[2], m[3]], v)}) = ${vec(Av)}. Compare with v = ${vec(v)}: ${n(Av[0])} ÷ ${par(v[0])} = ${n(lam)} and ${n(Av[1])} ÷ ${par(v[1])} = ${n(lam)}. So Av = ${co(lam, 'v')} and the eigenvalue is λ = ${n(lam)}.`,
  guidance: [
   { prompt: `Row 1 of A is (${n(m[0])}, ${n(m[1])}) and row 2 is (${n(m[2])}, ${n(m[3])}). Multiply each row by v = ${vec(v)}. Enter Av: x, then y.`, answer: Av, explanation: `x: ${rd([m[0], m[1]], v)} = ${n(Av[0])}. y: ${rd([m[2], m[3]], v)} = ${n(Av[1])}.` },
   { prompt: `Av = ${vec(Av)} and v = ${vec(v)}. Which number λ multiplies v to give Av?`, answer: [lam], explanation: `${n(Av[0])} ÷ ${par(v[0])} = ${n(lam)} and ${n(Av[1])} ÷ ${par(v[1])} = ${n(lam)}: both entries agree, so v is an eigenvector with eigenvalue ${n(lam)}.${lam < 0 ? ' A negative eigenvalue flips the arrow to point the other way along its line.' : ''}` }
  ] }; }
});

/* q23d: two triangular maps applied in a row (q08). The product is triangular again, and its eigenvalues are not those
   of A, not those of B and not their sums. */
practice({ id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q08',
 title: 'Two gear maps in a row',
 brief: 'A rover applies two gear maps one after the other, and the drive team needs the growth factors of the pair.',
 labels: ['smaller eigenvalue', 'larger eigenvalue'], tolerance: 0.01 },
 [['AB entry 11', 'AB entry 22'], ['AB entry 12', 'AB entry 21']], {
 canonical: { A: [[2, 1], [0, -3]], B: [[-1, 2], [0, 2]] },
 draw: R => until(() => { const up = R.bool(), a = R.nz(-4, 4), d = R.nz(-4, 4), e = R.nz(-4, 4), h = R.nz(-4, 4), b = R.nz(-3, 3), f = R.nz(-3, 3);
   return up ? { A: [[a, b], [0, d]], B: [[e, f], [0, h]] } : { A: [[a, 0], [b, d]], B: [[e, 0], [f, h]] }; },
  ({ A, B }) => { const x = A[0][0] * B[0][0], y = A[1][1] * B[1][1], set = (u, w) => [u, w].sort((s, t) => s - t).join(), me = set(x, y);
   return x !== y && A[0][0] !== A[1][1] && B[0][0] !== B[1][1] && me !== set(A[0][0], A[1][1]) && me !== set(B[0][0], B[1][1]) && me !== set(A[0][0] + B[0][0], A[1][1] + B[1][1])
    && !(A.join() === '2,1,0,-3' && B.join() === '-1,2,0,2'); }, { A: [[3, 0], [1, -2]], B: [[2, 0], [-1, 2]] }),
 build: ({ A, B }) => { const P = [[dot(A[0], [B[0][0], B[1][0]]), dot(A[0], [B[0][1], B[1][1]])], [dot(A[1], [B[0][0], B[1][0]]), dot(A[1], [B[0][1], B[1][1]])]],
   lo = Math.min(P[0][0], P[1][1]), hi = Math.max(P[0][0], P[1][1]), c1 = [B[0][0], B[1][0]], c2 = [B[0][1], B[1][1]]; return {
  prompt: `A rover's drive computer applies two gear maps one after the other: first B = ${mat(B)}, then A = ${mat(A)}. The combined map is the product AB. Multiply it out, then enter the eigenvalues of AB, the smaller one first.`,
  answer: [lo, hi],
  hints: ['AB means B acts first. Each entry of AB is a row of A times a column of B.',
   'Look at the shape of your product. If it is triangular, its eigenvalues are its diagonal entries. Sort them: a negative number is smaller than a positive one.'],
  solution: `AB has entries ${rd(A[0], c1)} = ${n(P[0][0])}, ${rd(A[0], c2)} = ${n(P[0][1])}, ${rd(A[1], c1)} = ${n(P[1][0])} and ${rd(A[1], c2)} = ${n(P[1][1])}, so AB = ${mat(P)}. It is triangular, so its eigenvalues are its diagonal entries ${n(P[0][0])} and ${n(P[1][1])}. In ascending order: ${n(lo)}, ${n(hi)}.`,
  guidance: [
   { prompt: `Compute the diagonal of AB. Entry 11 is row 1 of A times column 1 of B. Entry 22 is row 2 of A times column 2 of B. Enter entry 11, then entry 22.`, answer: [P[0][0], P[1][1]], explanation: `Entry 11: ${rd(A[0], c1)} = ${n(P[0][0])}. Entry 22: ${rd(A[1], c2)} = ${n(P[1][1])}.` },
   { prompt: `Now the other two entries of AB. Enter entry 12 (row 1 of A times column 2 of B), then entry 21 (row 2 of A times column 1 of B).`, answer: [P[0][1], P[1][0]], explanation: `Entry 12: ${rd(A[0], c2)} = ${n(P[0][1])}. Entry 21: ${rd(A[1], c1)} = ${n(P[1][0])}. So AB = ${mat(P)} is triangular and its eigenvalues are ${n(lo)} and ${n(hi)}. They are not the eigenvalues of A or of B alone.` }
  ] }; }
});

/* ==== q24 Eigenvectors (taught: subtract λ from the diagonal, solve (A − λI)v = 0, then apply the given scale).
        The parent always asks for the eigenvector with y = 1 and a whole-number x. ==== */
/* A = [[λ + sY, −sX], [tY, λ − tX]] has the eigenvector (X, Y) for λ; the other eigenvalue is λ + sY − tX. */
const eigMatrix = (lam, X, Y, s, t) => [lam + s * Y, -s * X, t * Y, lam - t * X];
const eigOk = (m, lam) => m.every(e => Math.abs(e) <= 9) && m[0] + m[3] - lam !== lam;

/* q24b: the direction is not a whole number of x per y (it is X per Y with Y = 2 or 3), so the scale is set by a y
   value other than 1 and the player must solve the equation rather than read it. */
practice({ id: 'q24b', parent: 'q24', kind: 'setting',
 title: 'Marks on the rolled sheet',
 brief: 'A rolling mill reshapes a metal sheet, and the operator wants the direction in which marks are only scaled.',
 labels: ['arrow x', 'arrow y'], tolerance: 0.01 },
 [['first-row x coefficient', 'first-row y coefficient'], ['arrow x']], {
 canonical: { m: [5, -3, 2, 0], lam: 3, y: 2 },
 draw: R => until(() => { const Y = R.pick([2, 3]), X = R.pick(Y === 2 ? [-5, -3, -1, 1, 3, 5] : [-5, -4, -2, -1, 1, 2, 4, 5]), lam = R.nz(-4, 5), k = R.pick([1, 1, 2]);
   return { m: eigMatrix(lam, X, Y, R.nz(-2, 2), R.pick([0, 1, -1, 2, -2])), lam, y: k * Y }; },
  p => eigOk(p.m, p.lam) && !(p.m.join() === '5,-3,2,0' && p.lam === 3), { m: [-1, 1, 6, -2], lam: -4, y: 3 }),
 build: ({ m, lam, y }) => { const al = m[0] - lam, be = m[1], r2 = [m[2], m[3] - lam], x = -be * y / al, v = [x, y], Av = mul2(m, v), eq = `${co(al, 'x')}${pco(be, 'y')} = 0`; return {
  prompt: `A rolling mill reshapes a metal sheet: the mark at point v moves to Av, with A = ${M2(m)}. Marks along one special direction are only scaled, by λ = ${n(lam)}. Find the arrow v = (x, y) in that direction whose y is ${n(y)}. Enter x, then y.`,
  answer: v,
  hints: ['Subtract λ from the two diagonal entries of A. The first row of what you get is one equation in x and y, set equal to 0.',
   `Put y = ${n(y)} into that equation and solve it for x. Do not guess x: the pair must fit the equation.`],
  solution: `${shift(lam)} = ${mat([[al, be], r2])}. Its first row gives ${eq}. With y = ${n(y)}: ${co(al, 'x')} = ${n(-be * y)}, so x = ${n(x)}. The arrow is v = ${vec(v)}. Check: Av = ${vec(Av)}, which is ${n(lam)} times v.`,
  guidance: [
   { prompt: `For ${shift(lam)}, enter the first row.`, answer: [al, be], explanation: `${lam < 0 ? `Adding ${n(-lam)} to` : `Subtracting ${n(lam)} from`} the diagonal gives ${mat([[al, be], r2])}. The first row says ${eq}.` },
   { prompt: `With y = ${n(y)}, solve ${eq} for x.`, answer: [x], explanation: `${co(al, 'x')}${pm(be * y)} = 0, so x = ${n(x)}. ${r2[0] === 0 && r2[1] === 0 ? 'The second row is all zeros, so it adds nothing.' : 'The second row is a multiple of the first, so it adds nothing new.'} Check: A times ${vec(v)} is ${vec(Av)}, which is ${n(lam)} times ${vec(v)}.` }
  ] }; }
});

/* q24c: a growth mode. The eigenvalue is not 1 and the matrix is not a table of shares (the steady state of a Markov
   chain is q38's subject); the scale of the eigenvector is set by a total, not by one coordinate. */
practice({ id: 'q24c', parent: 'q24', kind: 'applied',
 title: 'A mix that keeps its balance',
 brief: 'A lab grows yeast in two linked flasks and wants a starting mix whose proportions never change.',
 labels: ['grams in flask 1', 'grams in flask 2'], tolerance: 0.01 },
 [['entry 11', 'entry 12'], ['x'], ['grams in flask 1', 'grams in flask 2']], {
 canonical: { m: [3, 2, 1, 2], lam: 4, total: 60 },
 /* A − λI has rows k1·(−Y, X) and k2·(Y, −X), so the balanced mix is (X, Y) with X ≠ Y. Every entry of A is at least 1,
    and the other eigenvalue is not 0 and at most half of λ in size, so λ is the growth the flasks settle into. */
 draw: R => until(() => { const [X, Y] = R.pick([[2, 1], [1, 2], [3, 1], [1, 3], [3, 2], [2, 3]]), k1 = R.int(1, 2), k2 = R.int(1, 2), lam = R.int(3, 8);
   return { m: [lam - k1 * Y, k1 * X, k2 * Y, lam - k2 * X], lam, total: (X + Y) * R.pick([5, 10, 20, 30]) }; },
  s => { const other = s.m[0] + s.m[3] - s.lam; return s.m[0] >= 1 && s.m[3] >= 1 && other !== 0 && 2 * Math.abs(other) <= s.lam && !(s.m.join() === '3,2,1,2' && s.total === 60); },
  { m: [3, 1, 2, 4], lam: 5, total: 90 }),
 build: ({ m, lam, total }) => { const al = m[0] - lam, be = m[1], r2 = [m[2], m[3] - lam], g = gcd(al, be), X = be / g, Y = -al / g, unit = total / (X + Y), a = X * unit, b = Y * unit, eq = `${co(al, 'x')}${pco(be, 'y')} = 0`; return {
  prompt: `A lab grows yeast in two linked flasks. Each hour the amount x in flask 1 becomes ${co(m[0], 'x')}${pco(m[1], 'y')}, and the amount y in flask 2 becomes ${co(m[2], 'x')}${pco(m[3], 'y')}, both in grams. So one hour multiplies v = (x, y) by A = ${M2(m)}. A balanced mix is an eigenvector of A: every hour both amounts are multiplied by the same number, here λ = ${n(lam)}, so the mix keeps its proportions. The lab wants to start with ${n(total)} grams in all, in balanced proportions. Enter the grams in flask 1, then in flask 2.`,
  answer: [a, b],
  hints: ['Subtract λ from the two diagonal entries of A. The first row of the result is one equation that links x and y.',
   'That equation only fixes how the two amounts compare. Choose a handy value for y, solve for x, then scale both numbers so that they add up to the total the lab wants.'],
  solution: `${shift(lam)} = ${mat([[al, be], r2])}. Its first row gives ${eq}. With y = ${n(Y)}, x = ${n(X)}. That pair adds to ${n(X + Y)}, and the lab wants ${n(total)} grams, so scale by ${n(total)} ÷ ${n(X + Y)} = ${n(unit)}: x = ${n(a)} and y = ${n(b)}. Check the first row of Av: ${n(m[0])} × ${n(a)} + ${n(m[1])} × ${n(b)} = ${n(m[0] * a + m[1] * b)}, which is ${n(lam)} × ${n(a)}.`,
  guidance: [
   { prompt: `For ${shift(lam)}, enter the first row: entry 11, then entry 12.`, answer: [al, be], explanation: `Subtracting ${n(lam)} from the diagonal gives ${mat([[al, be], r2])}. The first row says ${eq}.` },
   { prompt: `Put y = ${n(Y)} into ${eq}. What is x?`, answer: [X], explanation: `${co(al, 'x')}${pm(be * Y)} = 0, so x = ${n(X)}. The eigenvector direction is (${n(X)}, ${n(Y)}); any multiple of it is also balanced.` },
   { prompt: `The pair (${n(X)}, ${n(Y)}) adds to ${n(X + Y)}, but the lab wants ${n(total)} grams. Multiply both numbers by ${n(total)} ÷ ${n(X + Y)}. Enter the grams in flask 1, then in flask 2.`, answer: [a, b], explanation: `${n(total)} ÷ ${n(X + Y)} = ${n(unit)}, so x = ${n(X)} × ${n(unit)} = ${n(a)} and y = ${n(Y)} × ${n(unit)} = ${n(b)}. After one hour the flasks hold ${n(lam * a)} and ${n(lam * b)} grams: both are ${n(lam)} times as large, so the proportions are the same.` }
  ] }; }
});

/* q24d: the eigenvector lies on a 3-4-5 direction; after finding it the player gives its length and the unit vector (q02). */
practice({ id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q02',
 title: 'A mode of length one',
 brief: 'A kite test gives a growth matrix, and the flight team wants its mode as a unit direction.',
 labels: ['eigenvector x', 'length', 'unit x', 'unit y'], tolerance: 0.01 },
 [['first-row x coefficient', 'first-row y coefficient'], ['eigenvector x'], ['length', 'unit x', 'unit y']], {
 canonical: { m: [6, -3, -4, 5], lam: 2, y: 8 },
 draw: R => until(() => { const [X, Y] = R.pick([[3, 4], [-3, 4], [4, 3], [-4, 3]]), lam = R.nz(-4, 5), k = R.int(1, 3);
   return { m: eigMatrix(lam, X, Y, R.pick([-1, 1]), R.pick([0, 1, -1])), lam, y: k * Y }; },
  p => eigOk(p.m, p.lam) && !(p.m.join() === '6,-3,-4,5' && p.lam === 2), { m: [1, 4, 0, -2], lam: -2, y: 6 }),
 build: ({ m, lam, y }) => { const al = m[0] - lam, be = m[1], r2 = [m[2], m[3] - lam], x = -be * y / al, len = Math.round(Math.hypot(x, y)), u = [T(x / len), T(y / len)], eq = `${co(al, 'x')}${pco(be, 'y')} = 0`; return {
  prompt: `Wind-tunnel tests give the matrix A = ${M2(m)} for how a kite's tilt changes each second. For the eigenvalue λ = ${n(lam)} there is one mode direction. Find the eigenvector with y = ${n(y)}. Enter its x, then its length, then the x and y of the unit vector that points the same way (the eigenvector divided by its length).`,
  answer: [x, len, u[0], u[1]],
  hints: [`Subtract λ from the diagonal of A. The first row gives the equation that links x and y. Use y = ${n(y)} in it.`,
   'The length is the square root of x² + y². Dividing both entries by the length gives the unit vector. Its entries are decimals between −1 and 1.'],
  solution: `${shift(lam)} = ${mat([[al, be], r2])}, so ${eq}. With y = ${n(y)}, x = ${n(x)}: the eigenvector is ${vec([x, y])}. Its length is √(${n(x * x)} + ${n(y * y)}) = ${n(len)}. Dividing by ${n(len)} gives the unit vector ${vec(u)}.`,
  guidance: [
   { prompt: `For ${shift(lam)}, enter the first row.`, answer: [al, be], explanation: `${lam < 0 ? `Adding ${n(-lam)} to` : `Subtracting ${n(lam)} from`} the diagonal gives ${mat([[al, be], r2])}. The first row says ${eq}.` },
   { prompt: `With y = ${n(y)}, solve ${eq} for x.`, answer: [x], explanation: `${co(al, 'x')}${pm(be * y)} = 0, so x = ${n(x)}. The eigenvector is ${vec([x, y])}.` },
   { prompt: `Find the length of ${vec([x, y])}, then divide both entries by it. Enter the length, then the unit vector's x, then its y.`, answer: [len, u[0], u[1]], explanation: `√(${n(x * x)} + ${n(y * y)}) = ${n(len)}. Then ${n(x)} ÷ ${n(len)} = ${n(u[0])} and ${n(y)} ÷ ${n(len)} = ${n(u[1])}. Scaling an eigenvector keeps it an eigenvector, so ${vec(u)} is the same mode with length 1.` }
  ] }; }
});

/* ==== q25 Diagonalization (taught: write the state as a combination of eigenvectors, raise each eigenvalue to the
        number of steps, recombine; Aⁿ is not an entry-by-entry power). The parent gives a triangular A and three steps. ==== */

/* q25b: the matrix is never shown. The eigenvectors, their eigenvalues and the starting split are given, and the player
   advances each part by a power. Multiplying by eigenvalue × frames instead of a power never gives the right point. */
const after = (c1, l1, v1, c2, l2, v2, k) => [0, 1].map(i => c1 * l1 ** k * v1[i] + c2 * l2 ** k * v2[i]);
practice({ id: 'q25b', parent: 'q25', kind: 'setting',
 title: 'Frame by frame',
 brief: 'An animation applies the same matrix on every frame, and the artist wants to know where a point ends up.',
 labels: ['point x', 'point y'], tolerance: 0.01 },
 [['power of first eigenvalue', 'power of second eigenvalue'], ['amount of v1', 'amount of v2'], ['point x', 'point y']], {
 canonical: { v1: [1, 1], v2: [1, -1], l1: 2, l2: -1, c1: 3, c2: 2, steps: 4 },
 draw: R => until(() => { const dirs = [[1, 1], [1, -1], [2, 1], [1, 2], [1, 0], [0, 1], [-1, 2], [2, -1], [1, 3], [3, 1]], l1 = R.pick([2, 3]);
   return { v1: R.pick(dirs), v2: R.pick(dirs), l1, l2: R.except(-2, 3, [0, l1]), c1: R.nz(-3, 3), c2: R.nz(-3, 3), steps: R.pick([3, 4]) }; },
  p => { const out = after(p.c1, p.l1, p.v1, p.c2, p.l2, p.v2, p.steps), slip = [0, 1].map(i => p.c1 * p.l1 * p.steps * p.v1[i] + p.c2 * p.l2 * p.steps * p.v2[i]);
   return p.v1[0] * p.v2[1] - p.v1[1] * p.v2[0] !== 0 && out.every(e => Math.abs(e) <= 500) && out.join() !== slip.join()
    && !(p.v1.join() === '1,1' && p.v2.join() === '1,-1' && p.l1 === 2 && p.l2 === -1); },
  { v1: [2, 1], v2: [0, 1], l1: 3, l2: 1, c1: 1, c2: -2, steps: 3 }),
 build: ({ v1, v2, l1, l2, c1, c2, steps }) => { const p1 = l1 ** steps, p2 = l2 ** steps, k1 = c1 * p1, k2 = c2 * p2, out = after(c1, l1, v1, c2, l2, v2, steps), s1 = v1.map(e => k1 * e), s2 = v2.map(e => k2 * e); return {
  prompt: `An animation moves a point by the same matrix on every frame. The matrix has two eigenvectors. Along v₁ = ${vec(v1)} a point is multiplied by ${n(l1)} on each frame, and along v₂ = ${vec(v2)} it is multiplied by ${n(l2)}. The point starts at x₀ = ${co(c1, 'v₁')}${pco(c2, 'v₂')}. Where is it after ${n(steps)} frames? Enter x, then y.`,
  answer: out,
  hints: ['Each eigenvector part moves on its own. After several frames its amount has been multiplied by its eigenvalue once per frame. That is a power of the eigenvalue, not the eigenvalue times the number of frames.',
   'Find the two new amounts first. Then multiply v₁ and v₂ by their new amounts and add the two results entry by entry.'],
  solution: `After ${n(steps)} frames the amount of v₁ is ${n(c1)} × ${pw(l1, steps)} = ${n(c1)} × ${n(p1)} = ${n(k1)}, and the amount of v₂ is ${n(c2)} × ${pw(l2, steps)} = ${n(c2)} × ${par(p2)} = ${n(k2)}. The point is ${n(k1)} × ${vec(v1)} + ${par(k2)} × ${vec(v2)} = ${vec(s1)} + ${vec(s2)} = ${vec(out)}.`,
  guidance: [
   { prompt: `Each frame multiplies the v₁ part by ${n(l1)} and the v₂ part by ${n(l2)}. Enter ${pw(l1, steps)}, then ${pw(l2, steps)}.`, answer: [p1, p2], explanation: `${pw(l1, steps)} = ${n(p1)} and ${pw(l2, steps)} = ${n(p2)}: one multiplication for each of the ${n(steps)} frames.` },
   { prompt: `The starting amounts are ${n(c1)} of v₁ and ${n(c2)} of v₂. Multiply them by ${n(p1)} and ${n(p2)}. Enter the new amount of v₁, then of v₂.`, answer: [k1, k2], explanation: `${n(c1)} × ${n(p1)} = ${n(k1)} and ${n(c2)} × ${par(p2)} = ${n(k2)}.` },
   { prompt: `Add ${n(k1)} × ${vec(v1)} and ${par(k2)} × ${vec(v2)}. Enter the point: x, then y.`, answer: out, explanation: `${vec(s1)} + ${vec(s2)} = ${vec(out)}. The matrix itself was never needed: its eigenvectors and eigenvalues carry everything.` }
  ] }; }
});

/* q25c: the whole route on a symmetric two-server matrix [[a,b],[b,a]]: split the start into (1,1) and (1,−1), raise
   the eigenvalues a+b and a−b to the number of hours, recombine. Taking entry-by-entry powers of A never gives the answer. */
const times = (k, thing) => k === 1 ? thing : `${n(k)} times ${thing}`;
practice({ id: 'q25c', parent: 'q25', kind: 'applied',
 title: 'Mirrored servers',
 brief: 'Two linked servers copy files to each other every hour, and the operator wants the load a few hours ahead.',
 labels: ['load x', 'load y'], tolerance: 0.01 },
 [['c1', 'c2'], ['amount of v1', 'amount of v2'], ['load x', 'load y']], {
 canonical: { m: [2, 1, 1, 2], x0: [5, 1], steps: 4 },
 draw: R => until(() => { const a = R.int(1, 4), b = R.int(1, 2), c1 = R.int(1, 4), c2 = R.nz(-c1, c1); return { m: [a, b, b, a], x0: [c1 + c2, c1 - c2], steps: R.pick([3, 4, 5]) }; },
  ({ m, x0, steps }) => { const a = m[0], b = m[1], c1 = (x0[0] + x0[1]) / 2, c2 = (x0[0] - x0[1]) / 2, out = after(c1, a + b, [1, 1], c2, a - b, [1, -1], steps), slip = mul2(m.map(e => e ** steps), x0);
   return a !== b && out.every(e => Math.abs(e) < 1000) && out.join() !== slip.join() && !(m.join() === '2,1,1,2' && x0.join() === '5,1'); },
  { m: [3, 1, 1, 3], x0: [3, 1], steps: 3 }),
 build: ({ m, x0, steps }) => { const a = m[0], b = m[1], l1 = a + b, l2 = a - b, c1 = (x0[0] + x0[1]) / 2, c2 = (x0[0] - x0[1]) / 2, p1 = l1 ** steps, p2 = l2 ** steps, k1 = c1 * p1, k2 = c2 * p2, out = [k1 + k2, k1 - k2]; return {
  prompt: `Two linked data servers copy files every hour. After each hour a server holds ${times(a, 'its own load')} plus ${times(b, "the other server's load")}, so the load vector (x, y) is multiplied by A = ${M2(m)}. The eigenvectors of A are v₁ = (1, 1) with eigenvalue ${n(l1)} and v₂ = (1, −1) with eigenvalue ${n(l2)}. The starting load is x₀ = ${vec(x0)}. Write x₀ as c₁v₁ + c₂v₂, then use the eigenvalues to find the load after ${n(steps)} hours. Enter x, then y.`,
  answer: out,
  hints: ['Matching the x entries and then the y entries of c₁v₁ + c₂v₂ = x₀ gives two equations in c₁ and c₂. Add the two equations to find c₁.',
   'Each amount is multiplied by its own eigenvalue once per hour. Raise each eigenvalue to the number of hours, multiply the amounts, and only then put the two eigenvectors back together.'],
  solution: `c₁(1, 1) + c₂(1, −1) = ${vec(x0)} means c₁ + c₂ = ${n(x0[0])} and c₁ − c₂ = ${n(x0[1])}. Adding gives 2c₁ = ${n(x0[0] + x0[1])}, so c₁ = ${n(c1)} and c₂ = ${n(c2)}. After ${n(steps)} hours the amounts are ${n(c1)} × ${pw(l1, steps)} = ${n(k1)} and ${n(c2)} × ${pw(l2, steps)} = ${n(k2)}. The load is ${n(k1)} × (1, 1) + ${par(k2)} × (1, −1) = ${vec(out)}.`,
  guidance: [
   { prompt: `Find c₁ and c₂ with c₁(1, 1) + c₂(1, −1) = ${vec(x0)}. That is c₁ + c₂ = ${n(x0[0])} and c₁ − c₂ = ${n(x0[1])}. Enter c₁, then c₂.`, answer: [c1, c2], explanation: `Adding the equations gives 2c₁ = ${n(x0[0] + x0[1])}, so c₁ = ${n(c1)}. Then c₂ = ${n(x0[0])} − ${n(c1)} = ${n(c2)}.` },
   { prompt: `After ${n(steps)} hours the amount of v₁ is c₁ × ${pw(l1, steps)} and the amount of v₂ is c₂ × ${pw(l2, steps)}. Enter both amounts, v₁ first.`, answer: [k1, k2], explanation: `${pw(l1, steps)} = ${n(p1)} and ${pw(l2, steps)} = ${n(p2)}, so the amounts are ${n(c1)} × ${n(p1)} = ${n(k1)} and ${n(c2)} × ${par(p2)} = ${n(k2)}.` },
   { prompt: `Recombine: ${n(k1)} × (1, 1) + ${par(k2)} × (1, −1). Enter the load: x, then y.`, answer: out, explanation: `x = ${n(k1)}${pm(k2)} = ${n(out[0])} and y = ${n(k1)}${pm(-k2)} = ${n(out[1])}. Multiplying by A hour after hour gives the same pair.` }
  ] }; }
});

/* q25d: nothing is handed over except the triangular A. The player finds the second eigenvector as in q24, splits the
   start, and advances several cycles, more than is pleasant to do by repeated multiplication. */
practice({ id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q24',
 title: 'Modes from scratch',
 brief: 'The Dynamics Lab must advance a state by several cycles, and this time nobody has worked out the modes.',
 labels: ['eigenvector x', 'state x', 'state y'], tolerance: 0.01 },
 [['eigenvector x'], ['c1', 'c2'], ['state x', 'state y']], {
 canonical: { m: [2, 3, 0, -1], x0: [1, 2], steps: 5 },
 draw: R => until(() => { const a = R.pick([-2, -1, 1, 2, 3]), d = R.pick([-2, -1, 1, 2, 3]), w = R.nz(-3, 3), c2 = R.nz(-3, 3), c1 = R.nz(-3, 3);
   return { m: [a, w * (d - a), 0, d], x0: [c1 + c2 * w, c2], steps: R.pick([4, 5, 6]) }; },
  ({ m, x0, steps }) => { const a = m[0], d = m[3]; if (a === d) return false; const w = m[1] / (d - a), c2 = x0[1], c1 = x0[0] - c2 * w, out = after(c1, a, [1, 0], c2, d, [w, 1], steps);
   return Math.max(Math.abs(a), Math.abs(d)) >= 2 && Math.abs(m[1]) <= 9 && out.every(e => Math.abs(e) < 1000) && !(m.join() === '2,3,0,-1' && x0.join() === '1,2'); },
  { m: [1, 2, 0, 3], x0: [3, 1], steps: 4 }),
 build: ({ m, x0, steps }) => { const a = m[0], o = m[1], d = m[3], w = o / (d - a), c2 = x0[1], c1 = x0[0] - c2 * w, pa = a ** steps, pd = d ** steps, k1 = c1 * pa, k2 = c2 * pd, out = [k1 + k2 * w, k2], eq = `${co(a - d, 'x')}${pm(o)} = 0`; return {
  prompt: `The Dynamics Lab steps a two-number state forward once per cycle by A = ${M2(m)}. A is triangular, so its eigenvalues are ${n(a)} and ${n(d)}, and (1, 0) is an eigenvector for the eigenvalue ${n(a)}. First find the eigenvector for λ = ${n(d)} that has y = 1. Then write the starting state x₀ = ${vec(x0)} as a combination of the two eigenvectors and find the state after ${n(steps)} cycles. Enter the x of that eigenvector, then the state: x, then y.`,
  answer: [w, out[0], out[1]],
  hints: [`For λ = ${n(d)}, ${d < 0 ? `add ${n(-d)} to` : `subtract ${n(d)} from`} the two diagonal entries of A. The first row of the result is the equation that links x and y.`,
   'Only the second eigenvector has a y part, so its amount in x₀ is the y of x₀. Whatever x is still missing comes from (1, 0). Then raise each eigenvalue to the number of cycles.'],
  solution: `${shift(d)} has first row (${n(a - d)}, ${n(o)}), so with y = 1: ${eq} and x = ${n(w)}. The eigenvector is v₂ = ${vec([w, 1])}. Split the start: ${vec(x0)} = c₁(1, 0) + c₂${vec([w, 1])} gives c₂ = ${n(c2)} and c₁ = ${n(x0[0])} − ${par(c2)}·${par(w)} = ${n(c1)}. After ${n(steps)} cycles the amounts are ${n(c1)} × ${pw(a, steps)} = ${n(k1)} and ${n(c2)} × ${pw(d, steps)} = ${n(k2)}. The state is ${n(k1)} × (1, 0) + ${par(k2)} × ${vec([w, 1])} = ${vec(out)}.`,
  guidance: [
   { prompt: `${shift(d)} has first row (${n(a - d)}, ${n(o)}). With y = 1, solve ${eq}. What is x?`, answer: [w], explanation: `x = ${n(w)}, so v₂ = ${vec([w, 1])} is an eigenvector for λ = ${n(d)}.` },
   { prompt: `Write x₀ = ${vec(x0)} as c₁(1, 0) + c₂${vec([w, 1])}. Match the y entries first, then the x entries. Enter c₁, then c₂.`, answer: [c1, c2], explanation: `The y entries give c₂ = ${n(c2)}. The x entries give c₁ + ${par(c2)}·${par(w)} = ${n(x0[0])}, so c₁ = ${n(c1)}.` },
   { prompt: `After ${n(steps)} cycles the amounts are c₁ × ${pw(a, steps)} = ${n(k1)} and c₂ × ${pw(d, steps)} = ${n(k2)}. Recombine: ${n(k1)} × (1, 0) + ${par(k2)} × ${vec([w, 1])}. Enter the state: x, then y.`, answer: out, explanation: `x = ${n(k1)} + ${par(k2)}·${par(w)} = ${n(out[0])} and y = ${n(k2)}. Multiplying by A ${n(steps)} times would give the same state, with far more arithmetic.` }
  ] }; }
});

})();
