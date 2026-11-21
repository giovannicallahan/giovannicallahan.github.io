/* Linear algebra practice missions, file 9 of 14: concepts q41–q45, three practice missions each
   (q41b q41c q41d ... q45b q45c q45d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p9.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- shared helpers for this file ---- */
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* Draw until the check passes; a fixed valid set is the fallback so a draw can never fail. */
const until = (make, ok, fallback) => { for (let i = 0; i < 4000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
/* A coefficient in front of a letter: 1 is not written. */
const cf = a => a === 1 ? '' : a === -1 ? '−' : n(a);
/* "2x+3y−z" from [[2,'x'],[3,'y'],[−1,'z']]; zero terms are left out. */
const lin = terms => terms.filter(t => t[0] !== 0).map((t, i) => (i === 0 ? cf(t[0]) : (t[0] < 0 ? '−' : '+') + cf(Math.abs(t[0]))) + t[1]).join('');
const eq3 = (r, c) => `${lin([[r[0], 'x'], [r[1], 'y'], [r[2], 'z']])}=${n(c)}`;
/* An augmented row, "(0, 1, −1 | 4)". */
const row = (r, c) => `(${r.map(n).join(', ')} | ${n(c)})`;
/* "R₃←R₃−2R₂": subtract m times the source row. */
const rowop = (t, m, s) => `${t}←${t}${m === 1 ? '−' : m === -1 ? '+' : plus(-m)}${s}`;
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const T3 = A => A[0].map((_, j) => A.map(r => r[j]));
/* "1 part", "3 parts". */
const parts = k => `${n(k)} ${k === 1 ? 'part' : 'parts'}`;
/* "minus" or "minus 3 times": a multiple of 1 is not written out. */
const minusTimes = m => m === 1 ? 'minus' : `minus ${n(m)} times`;
const E6 = ['entry 11', 'entry 12', 'entry 21', 'entry 22', 'entry 31', 'entry 32'];

/* ================= q41 Lagrange multipliers =================
   Taught: minimise ax²+by² with x+y=c; at the best split the marginal costs 2ax and 2by are equal.
   Pitfall: the equal split. Every draw has unequal costs, so the equal split is never the answer. */

/* q41b: current shared by two cables; heat is resistance × current². Whole-number answers. */
practice({ id: 'q41b', parent: 'q41', kind: 'setting',
 title: 'Two cables, least heat',
 brief: 'Two power cables share one current, and the grid crew wants the split that wastes the least power as heat.',
 labels: ['current x (A)', 'current y (A)', 'least wasted power (W)'], tolerance: 0.01 },
 [['number in front of x', 'number in front of y'], ['current x (A)', 'current y (A)']], {
 canonical: { r: [2, 3], total: 10 },
 /* total is a whole number of (p+q) parts, where p:q is r1:r2 in lowest terms, so both currents are whole. */
 draw: R => until(() => { const r1 = R.int(1, 6), r2 = R.except(1, 6, [r1]), g = gcd(r1, r2); return { r: [r1, r2], total: R.int(1, 4) * (r1 + r2) / g }; },
  ({ r, total }) => total <= 20 && r[0] * r[1] * total * total / (r[0] + r[1]) <= 600 && !(r[0] === 1 && ((r[1] === 2 && total === 6) || (r[1] === 3 && total === 8))), { r: [3, 1], total: 12 }),
 build: ({ r, total }) => { const [a, b] = r, g = gcd(a, b), p = a / g, q = b / g, t = total / (p + q), x = q * t, y = p * t, fx = a * x * x, fy = b * y * y, f = fx + fy;
  const obj = `f=${cf(a)}x²+${cf(b)}y²`; return {
  prompt: `Two power cables run side by side and share a total current of ${n(total)} A. Cable 1 carries x amperes and wastes ${cf(a)}x² watts as heat. Cable 2 carries y amperes and wastes ${cf(b)}y² watts. So x+y=${n(total)}, and the wasted power is ${obj}. Find the split that wastes the least power. Enter x, then y, then the least wasted power in watts.`,
  answer: [x, y, f],
  hints: [`At the best split, moving a little current from one cable to the other saves nothing. So the two marginal costs are equal: ${n(2 * a)}x=${n(2 * b)}y.`,
   `That equation fixes the ratio of x to y. Split the ${n(total)} A in that ratio, then put your x and y into ${obj}.`],
  solution: `The marginal costs are ${n(2 * a)}x and ${n(2 * b)}y. At the best split they are equal, ${n(2 * a)}x=${n(2 * b)}y, so x and y are in the ratio ${n(q)} to ${n(p)}. That is ${n(p + q)} equal parts, and ${n(total)}/${n(p + q)}=${n(t)} A per part: x takes ${parts(q)}, ${n(x)} A, and y takes ${parts(p)}, ${n(y)} A. Wasted power: ${cf(a) ? n(a) + '·' : ''}${n(x)}²+${cf(b) ? n(b) + '·' : ''}${n(y)}²=${n(fx)}+${n(fy)}=${n(f)} W. The cable that heats more easily carries less current.`,
  guidance: [
   { prompt: `The wasted power is ${obj}. The marginal costs are its derivatives: one with respect to x, one with respect to y. The derivative of x² is 2x, and a number in front stays as a factor. Enter the number in front of x in the first, then the number in front of y in the second.`, answer: [2 * a, 2 * b], explanation: `The derivative of ${cf(a)}x² is ${n(2 * a)}x, and the derivative of ${cf(b)}y² is ${n(2 * b)}y. At the best split these two are equal.` },
   { prompt: `${n(2 * a)}x=${n(2 * b)}y means x and y are in the ratio ${n(q)} to ${n(p)}. Split the ${n(total)} A in that ratio. Enter x, then y.`, answer: [x, y], explanation: `There are ${n(p + q)} parts of ${n(t)} A each. x takes ${parts(q)}, ${n(x)} A, and y takes ${parts(p)}, ${n(y)} A. Check: ${n(2 * a)}·${n(x)}=${n(2 * a * x)} and ${n(2 * b)}·${n(y)}=${n(2 * b * y)}. Now work out the wasted power.` }
  ] }; }
});

/* q41c: the saving over the equal split (the parent's first pitfall), in three steps. total is even, so the equal split is whole. */
practice({ id: 'q41c', parent: 'q41', kind: 'applied',
 title: 'Overtime at two depots',
 brief: 'A courier firm has extra pallets to sort tonight, and the manager wants to know what the equal split would cost her.',
 labels: ['pallets at North, x', 'pallets at South, y', 'dollars saved'], tolerance: 0.01 },
 [['number in front of x', 'number in front of y'], ['pallets at North, x', 'pallets at South, y'], ['cheapest cost ($)', 'equal-split cost ($)']], {
 canonical: { a: 3, b: 1, total: 12 },
 draw: R => until(() => { const a = R.int(1, 6), b = R.except(1, 6, [a]), g = gcd(a, b); return { a, b, total: R.int(1, 4) * (a + b) / g }; },
  ({ a, b, total }) => total % 2 === 0 && total <= 20 && !(a === 1 && ((b === 2 && total === 6) || (b === 3 && total === 8))), { a: 2, b: 1, total: 6 }),
 build: ({ a, b, total }) => { const g = gcd(a, b), p = a / g, q = b / g, t = total / (p + q), x = q * t, y = p * t, f = a * x * x + b * y * y, h = total / 2, fe = (a + b) * h * h, save = fe - f;
  const obj = `${cf(a)}x²+${cf(b)}y²`; return {
  prompt: `A courier firm must sort ${n(total)} extra pallets tonight at its two depots. Sorting x pallets at the North depot costs ${cf(a)}x² dollars in overtime. Sorting y pallets at the South depot costs ${cf(b)}y² dollars. So x+y=${n(total)}. The manager plans to give each depot half. Find the cheapest split instead. Enter x, then y, then how many dollars the cheapest split saves compared with the equal split.`,
  answer: [x, y, save],
  hints: [`The equal split is not the cheapest, because the two depots do not cost the same. At the cheapest split the marginal costs ${n(2 * a)}x and ${n(2 * b)}y are equal.`,
   `Work out the cost ${obj} twice: once with your x and y, once with x and y both equal to half of ${n(total)}. The saving is the difference.`],
  solution: `Equal marginal costs: ${n(2 * a)}x=${n(2 * b)}y, so x and y are in the ratio ${n(q)} to ${n(p)}. With x+y=${n(total)} that gives x=${n(x)} and y=${n(y)}. Cheapest cost: ${cf(a) ? n(a) + '·' : ''}${n(x)}²+${cf(b) ? n(b) + '·' : ''}${n(y)}²=${n(f)} dollars. Equal split: x=y=${n(h)}, which costs ${cf(a) ? n(a) + '·' : ''}${n(h)}²+${cf(b) ? n(b) + '·' : ''}${n(h)}²=${n(fe)} dollars. Saving: ${n(fe)}−${n(f)}=${n(save)} dollars.`,
  guidance: [
   { prompt: `The total cost is f=${obj}. Its marginal costs are the derivatives with respect to x and to y. The derivative of x² is 2x, and a number in front stays as a factor. Enter the number in front of x in the first, then the number in front of y in the second.`, answer: [2 * a, 2 * b], explanation: `The marginal costs are ${n(2 * a)}x and ${n(2 * b)}y. The cheapest split makes them equal.` },
   { prompt: `${n(2 * a)}x=${n(2 * b)}y means x and y are in the ratio ${n(q)} to ${n(p)}. Split the ${n(total)} pallets in that ratio. Enter x, then y.`, answer: [x, y], explanation: `${n(p + q)} parts of ${n(t)} ${t === 1 ? 'pallet' : 'pallets'} each: x=${n(x)} and y=${n(y)}. The dearer depot gets fewer pallets.` },
   { prompt: `Put x=${n(x)}, y=${n(y)} into ${obj}. Then put x=y=${n(h)} into it. Enter the cheapest cost, then the equal-split cost.`, answer: [f, fe], explanation: `Cheapest: ${n(a * x * x)}+${n(b * y * y)}=${n(f)}. Equal split: ${n(a * h * h)}+${n(b * h * h)}=${n(fe)}. The saving is the second minus the first.` }
  ] }; }
});

/* q41d: nearest point of a line to a fixed point, with squared distance (q02) as the cost. p≠q, so x=y is never the answer;
   the lighthouse is never on the course. c = p+q−2m, so the answers are whole: x=p−m, y=q−m, squared distance 2m². Neither x nor y is 0. */
practice({ id: 'q41d', parent: 'q41', kind: 'challenge', uses: 'q02',
 title: 'Closest pass to the lighthouse',
 brief: 'A ship holds a straight course past a lighthouse, and the navigator wants the point where it passes closest.',
 labels: ['closest point x', 'closest point y', 'squared distance (km²)'], tolerance: 0.01 },
 [['x − y'], ['closest point x', 'closest point y'], ['x gap', 'y gap']], {
 canonical: { p: 9, q: 5, c: 8 },
 draw: R => until(() => { const p = R.nz(-6, 9), q = R.nz(-6, 9), m = R.nz(-4, 4); return { p, q, c: p + q - 2 * m }; },
  ({ p, q, c }) => p !== q && c !== 0 && c !== p - q && c !== q - p && !(p === 9 && q === 5 && c === 8), { p: 6, q: 2, c: 4 }),
 build: ({ p, q, c }) => { const m = (p + q - c) / 2, x = p - m, y = q - m, f = 2 * m * m, d = p - q, fx = `x${plus(-p)}`, fy = `y${plus(-q)}`; return {
  prompt: `A ship sails a straight course. On the chart, in kilometres, every point (x, y) of the course obeys x+y=${n(c)}. A lighthouse stands at (${n(p)}, ${n(q)}). The squared distance from the ship to the lighthouse is f=(${fx})²+(${fy})². Find the point of the course that is closest to the lighthouse. Enter its x, then its y, then the squared distance at that point in km².`,
  answer: [x, y, f],
  hints: [`The cost to make small is f, and the course x+y=${n(c)} is the constraint. The marginal costs are the derivatives of the two squares, 2(${fx}) and 2(${fy}). At the closest point they are equal.`,
   `Equal marginal costs give one equation in x and y. Solve it together with x+y=${n(c)}: adding the two equations removes y.`],
  solution: `Marginal costs: 2(${fx}) and 2(${fy}). Setting them equal gives ${fx}=${fy}, so x−y=${n(d)}. Add x+y=${n(c)}: 2x=${n(c + d)}, so x=${n(x)} and y=${n(c)}−${par(x)}=${n(y)}. Its gaps from the lighthouse are ${n(x)}−${par(p)}=${n(-m)} along x and ${n(y)}−${par(q)}=${n(-m)} along y, so the squared distance is ${par(-m)}²+${par(-m)}²=${n(f)} km². The halfway point of the course, where x=y, is not the closest.`,
  guidance: [
   { prompt: `Set the marginal costs equal: 2(${fx})=2(${fy}). Tidy this up into the form x−y=number. Enter the number.`, answer: [d], explanation: `Halving both sides gives ${fx}=${fy}. Moving the plain numbers to the right gives x−y=${n(d)}.` },
   { prompt: `Solve x−y=${n(d)} together with the course x+y=${n(c)}. Enter x, then y.`, answer: [x, y], explanation: `Adding the equations gives 2x=${n(c + d)}, so x=${n(x)}. Then y=${n(c)}−${par(x)}=${n(y)}.` },
   { prompt: `The closest point is (${n(x)}, ${n(y)}) and the lighthouse is at (${n(p)}, ${n(q)}). Enter the gap along x, ${n(x)}−${par(p)}, then the gap along y, ${n(y)}−${par(q)}.`, answer: [-m, -m], explanation: `Both gaps are ${n(-m)}. As in the mission on length, square each gap and add them to get the squared distance.` }
  ] }; }
});

/* ================= q42 Weighted least squares =================
   Taught: fused value = Σwy/Σw; weighted squared error = Σw(y−c)². Pitfalls: dividing by the number of readings;
   weighting the residual before squaring. */

/* q42b: three readings. Built from a whole fused value c and whole residuals with Σw·r=0, so every number is whole.
   The plain mean differs from c (Σr≠0), and some weight is above 1, so neither pitfall gives the right answers. */
practice({ id: 'q42b', parent: 'q42', kind: 'setting',
 title: 'Three scales, one sample',
 brief: 'A food lab weighs one sample on three scales that it does not trust equally, and needs one mass for the label.',
 labels: ['fused mass (g)', 'weighted squared error'], tolerance: 0.01 },
 [['weighted sum', 'weight sum'], ['fused mass (g)'], ['first weighted error', 'second weighted error']], {
 canonical: { y: [54, 51, 48], w: [1, 2, 3] },
 draw: R => until(() => { const w = [R.int(1, 4), R.int(1, 4), R.int(1, 4)], r1 = R.nz(-4, 4), r2 = R.nz(-4, 4), r3 = -(w[0] * r1 + w[1] * r2) / w[2], c = R.int(20, 60); return { y: [c + r1, c + r2, c + r3], w, r3 }; },
  ({ y, w, r3 }) => Number.isInteger(r3) && r3 !== 0 && Math.abs(r3) <= 6 && Math.max(...w) > 1 && (y[0] + y[1] + y[2]) * (w[0] + w[1] + w[2]) !== 3 * dot(w, y) && new Set(y).size === 3,
  { y: [33, 29, 31], w: [1, 2, 3] }),
 build: ({ y, w }) => { const S = dot(w, y), W = w[0] + w[1] + w[2], c = S / W, r = y.map(v => v - c), e = r.map((v, i) => w[i] * v * v), E = e[0] + e[1] + e[2]; return {
  prompt: `A food lab weighs one sample on three scales. They read ${n(y[0])}, ${n(y[1])} and ${n(y[2])} grams. The lab trusts the scales with weights ${n(w[0])}, ${n(w[1])} and ${n(w[2])}: a bigger weight means a more reliable scale. Enter the fused mass in grams, then the weighted squared error of the three readings.`,
  answer: [c, E],
  hints: [`Multiply each reading by the weight of its scale and add the three products. Then divide by the sum of the weights, not by 3.`,
   `For the error, take each reading minus the fused mass and square it. Multiply each square by the weight of that scale, then add the three results.`],
  solution: `Weighted sum: ${n(w[0])}·${n(y[0])}+${n(w[1])}·${n(y[1])}+${n(w[2])}·${n(y[2])}=${n(S)}. Sum of weights: ${n(W)}. Fused mass: ${n(S)}/${n(W)}=${n(c)} g. The readings differ from it by ${n(r[0])}, ${n(r[1])} and ${n(r[2])} g. Weighted squared error: ${n(w[0])}·${par(r[0])}²+${n(w[1])}·${par(r[1])}²+${n(w[2])}·${par(r[2])}²=${n(e[0])}+${n(e[1])}+${n(e[2])}=${n(E)}.`,
  guidance: [
   { prompt: `Readings ${n(y[0])}, ${n(y[1])}, ${n(y[2])} have weights ${n(w[0])}, ${n(w[1])}, ${n(w[2])}. Enter the sum of weight times reading, then the sum of the weights.`, answer: [S, W], explanation: `${n(w[0] * y[0])}+${n(w[1] * y[1])}+${n(w[2] * y[2])}=${n(S)}, and ${n(w[0])}+${n(w[1])}+${n(w[2])}=${n(W)}.` },
   { prompt: `Divide ${n(S)} by ${n(W)}. What is the fused mass?`, answer: [c], explanation: `${n(S)}/${n(W)}=${n(c)} g. This is the balance point: weight times (reading minus fused mass), added over the three scales, gives 0. Dividing by 3 would ignore the weights.` },
   { prompt: `At ${n(c)} g, work out the weighted squared error of the first scale, ${n(w[0])}·(${n(y[0])}−${n(c)})², then of the second scale, ${n(w[1])}·(${n(y[1])}−${n(c)})².`, answer: [e[0], e[1]], explanation: `First: ${n(w[0])}·${par(r[0])}²=${n(e[0])}. Second: ${n(w[1])}·${par(r[1])}²=${n(e[1])}. Add the third scale's part to finish.` }
  ] }; }
});

/* q42c: two polls weighted by people asked; how far off the plain average is (the first pitfall). Whole answers:
   the weighted sum divides by the weight sum, and y1+y2 is even. */
practice({ id: 'q42c', parent: 'q42', kind: 'applied',
 title: 'Two polls, unequal sizes',
 brief: 'A newsroom has two polls on the same question, one much larger than the other, and wants one honest figure.',
 labels: ['fused percentage', 'gap of the plain average'], tolerance: 0.01 },
 [['weighted sum', 'weight sum'], ['fused percentage'], ['plain average']], {
 canonical: { y: [40, 48], w: [2, 6] },
 draw: R => until(() => { const w1 = R.int(1, 9), y1 = R.int(30, 70); return { y: [y1, R.except(30, 70, [y1])], w: [w1, R.except(1, 9, [w1])] }; },
  ({ y, w }) => dot(w, y) % (w[0] + w[1]) === 0 && (y[0] + y[1]) % 2 === 0 && Math.abs(y[0] - y[1]) <= 24, { y: [44, 52], w: [3, 1] }),
 build: ({ y, w }) => { const S = dot(w, y), W = w[0] + w[1], c = S / W, avg = (y[0] + y[1]) / 2, gap = Math.abs(avg - c); return {
  prompt: `Two polls ask the same question. Poll A asked ${n(100 * w[0])} people and found ${n(y[0])}% in favour. Poll B asked ${n(100 * w[1])} people and found ${n(y[1])}% in favour. Fuse the two results, using the number of hundreds of people asked as the weight of each poll: ${n(w[0])} for poll A and ${n(w[1])} for poll B. Enter the fused percentage. Then enter how many percentage points the plain average of the two results is away from it, as a positive number.`,
  answer: [c, gap],
  hints: [`A poll that asked more people counts for more. Multiply each percentage by its weight, add the two products, and divide by the sum of the weights.`,
   `The plain average is (${n(y[0])}+${n(y[1])})/2. It treats both polls as equally large. The gap is the difference between it and your fused percentage, written without a minus sign.`],
  solution: `Weighted sum: ${n(w[0])}·${n(y[0])}+${n(w[1])}·${n(y[1])}=${n(S)}. Sum of weights: ${n(W)}. Fused percentage: ${n(S)}/${n(W)}=${n(c)}%. The plain average is (${n(y[0])}+${n(y[1])})/2=${n(avg)}%, which is ${n(gap)} ${gap === 1 ? 'point' : 'points'} away. The fused figure sits closer to the larger poll.`,
  guidance: [
   { prompt: `Results ${n(y[0])} and ${n(y[1])} have weights ${n(w[0])} and ${n(w[1])}. Enter the sum of weight times result, then the sum of the weights.`, answer: [S, W], explanation: `${n(w[0])}·${n(y[0])}+${n(w[1])}·${n(y[1])}=${n(S)}, and ${n(w[0])}+${n(w[1])}=${n(W)}.` },
   { prompt: `Divide ${n(S)} by ${n(W)}. What is the fused percentage?`, answer: [c], explanation: `${n(S)}/${n(W)}=${n(c)}%. This is the share in favour among all ${n(100 * W)} people asked.` },
   { prompt: `Now the plain average, which ignores the sizes of the polls: (${n(y[0])}+${n(y[1])})/2. What is it?`, answer: [avg], explanation: `(${n(y[0])}+${n(y[1])})/2=${n(avg)}%. Compare it with ${n(c)}% to get the gap.` }
  ] }; }
});

/* q42d: a third reading arrives and the fused value is updated. Residuals are built so that both fused values are whole.
   No reading equals the final fused value, so every residual is non-zero. */
practice({ id: 'q42d', parent: 'q42', kind: 'challenge',
 title: 'A third thermometer joins',
 brief: 'The weather station gains a third thermometer, and the fused temperature and its error must be brought up to date.',
 labels: ['fused, first two (°C)', 'fused, all three (°C)', 'weighted squared error'], tolerance: 0.01 },
 [['fused, first two (°C)'], ['weighted sum', 'weight sum'], ['first weighted error', 'second weighted error']], {
 canonical: { y: [19, 13, 11], w: [1, 2, 1] },
 draw: R => until(() => { const w1 = R.int(1, 4), w2 = R.except(1, 4, [w1]), g = gcd(w1, w2), m = R.nz(-2, 2), c = R.int(10, 25), w3 = R.int(1, 5), W = w1 + w2, g3 = gcd(w3, W + w3), s = R.pick([-1, 1]);
   return { y: [c + m * w2 / g, c - m * w1 / g, c + s * (W + w3) / g3], w: [w1, w2, w3] }; },
  ({ y, w }) => { const c = dot(w, y) / (w[0] + w[1] + w[2]); return new Set(y).size === 3 && Math.max(...y) - Math.min(...y) <= 14 && Math.min(...y) >= 1 && y.every(v => v !== c) && y.reduce((s, v, i) => s + w[i] * (v - c) * (v - c), 0) <= 200 && y.join() !== '19,13,11'; },  { y: [22, 16, 14], w: [1, 2, 1] }),
 build: ({ y, w }) => { const S2 = w[0] * y[0] + w[1] * y[1], W2 = w[0] + w[1], c2 = S2 / W2, S = S2 + w[2] * y[2], W = W2 + w[2], c = S / W, r = y.map(v => v - c), e = r.map((v, i) => w[i] * v * v), E = e[0] + e[1] + e[2]; return {
  prompt: `A weather station has two thermometers. They read ${n(y[0])} and ${n(y[1])} °C, with weights ${n(w[0])} and ${n(w[1])}. Later a third thermometer is added. It reads ${n(y[2])} °C and has weight ${n(w[2])}. Enter the fused temperature from the first two thermometers. Then enter the fused temperature from all three. Then enter the weighted squared error of all three readings around that second value.`,
  answer: [c2, c, E],
  hints: [`Fuse the first two as usual: the sum of weight times reading, divided by the sum of the weights.`,
   `For all three, add the third reading times its weight to the weighted sum, and add its weight to the weight sum. The error uses the new fused value for every reading, not the old one.`],
  solution: `First two: (${n(w[0])}·${n(y[0])}+${n(w[1])}·${n(y[1])})/(${n(w[0])}+${n(w[1])})=${n(S2)}/${n(W2)}=${n(c2)} °C. All three: (${n(S2)}+${n(w[2])}·${n(y[2])})/(${n(W2)}+${n(w[2])})=${n(S)}/${n(W)}=${n(c)} °C. The readings differ from ${n(c)} by ${n(r[0])}, ${n(r[1])} and ${n(r[2])}. Weighted squared error: ${n(w[0])}·${par(r[0])}²+${n(w[1])}·${par(r[1])}²+${n(w[2])}·${par(r[2])}²=${n(e[0])}+${n(e[1])}+${n(e[2])}=${n(E)}.`,
  guidance: [
   { prompt: `Fuse the first two readings: (${n(w[0])}·${n(y[0])}+${n(w[1])}·${n(y[1])})/(${n(w[0])}+${n(w[1])}). What is the fused temperature?`, answer: [c2], explanation: `${n(S2)}/${n(W2)}=${n(c2)} °C.` },
   { prompt: `Bring in the third reading, ${n(y[2])} with weight ${n(w[2])}. Enter the weighted sum of all three readings, then the sum of all three weights.`, answer: [S, W], explanation: `${n(S2)}+${n(w[2])}·${n(y[2])}=${n(S)}, and ${n(W2)}+${n(w[2])}=${n(W)}. The new fused temperature is ${n(S)}/${n(W)}.` },
   { prompt: `The new fused temperature is ${n(c)} °C. Work out the weighted squared error of the first thermometer, ${n(w[0])}·(${n(y[0])}−${n(c)})², then of the second, ${n(w[1])}·(${n(y[1])}−${n(c)})².`, answer: [e[0], e[1]], explanation: `First: ${n(w[0])}·${par(r[0])}²=${n(e[0])}. Second: ${n(w[1])}·${par(r[1])}²=${n(e[1])}. Add the third thermometer's part to finish.` }
  ] }; }
});

/* ================= q43 Matrix arithmetic and transpose =================
   Taught: add and scale entry by entry; the transpose swaps rows and columns, so an m×n table becomes n×m.
   Only q01–q11 come before this concept. */

/* q43b: two 2×3 tables added, then transposed to 3×2. The total listed row by row without transposing is never the answer. */
practice({ id: 'q43b', parent: 'q43', kind: 'setting',
 title: 'Weekend ticket tables',
 brief: 'Two cinemas report weekend ticket sales by film, and the booker wants the total with one row per film.',
 labels: E6, tolerance: 0.01 },
 [['total 11', 'total 12', 'total 13'], ['total 21', 'total 22', 'total 23'], ['entry 11', 'entry 12']], {
 canonical: { S: [[3, 5, 2], [4, 1, 6]], T: [[2, 3, 3], [1, 2, 1]] },
 draw: R => until(() => { const t = () => [[R.int(1, 9), R.int(1, 9), R.int(1, 9)], [R.int(1, 9), R.int(1, 9), R.int(1, 9)]]; return { S: t(), T: t() }; },
  ({ S, T }) => { const U = S.map((r, i) => r.map((x, j) => x + T[i][j])); return U.flat().join() !== T3(U).flat().join() && U[0][1] !== U[1][0] && S.flat().join() !== '3,5,2,4,1,6'; },
  { S: [[1, 4, 2], [3, 2, 5]], T: [[2, 1, 6], [4, 3, 1]] }),
 build: ({ S, T }) => { const U = S.map((r, i) => r.map((x, j) => x + T[i][j])), V = T3(U); return {
  prompt: `Two tables count tickets sold, in hundreds. Each row is a cinema (the Rex, then the Odeon). Each column is a film (comedy, thriller, cartoon). Saturday: S=${mat(S)}. Sunday: T=${mat(T)}. Add the two tables. Then transpose the total, so that each row is a film and each column is a cinema. Enter the six entries of the transposed table, row by row.`,
  answer: V.flat(),
  hints: [`Add entry by entry: each Saturday number with the Sunday number in the same place. The total still has 2 rows and 3 columns.`,
   `Transposing turns each column of the total into a row. The comedy column becomes row 1: comedy at the Rex, then comedy at the Odeon. The result has 3 rows and 2 columns.`],
  solution: `S+T=${mat(U)}, with 2 rows and 3 columns. Transposing turns its columns into rows: (S+T)ᵀ=${mat(V)}, with 3 rows and 2 columns. Row 1 is now the comedy: ${n(V[0][0])} hundred at the Rex and ${n(V[0][1])} hundred at the Odeon.`,
  guidance: [
   { prompt: `Add the first rows, the Rex: ${vec(S[0])} and ${vec(T[0])}. Enter the first row of S+T.`, answer: U[0], explanation: `${vec(S[0])}+${vec(T[0])}=${vec(U[0])}, one film at a time.` },
   { prompt: `Add the second rows, the Odeon: ${vec(S[1])} and ${vec(T[1])}. Enter the second row of S+T.`, answer: U[1], explanation: `${vec(S[1])}+${vec(T[1])}=${vec(U[1])}. So S+T=${mat(U)}.` },
   { prompt: `Transpose S+T=${mat(U)}. Its first column becomes the first row. Enter that first row.`, answer: V[0], explanation: `The first column holds ${n(U[0][0])} and ${n(U[1][0])}, so the first row of the transpose is ${vec(V[0])}. The other two columns become rows 2 and 3 in the same way.` }
  ] }; }
});

/* q43c: three tables, S+kD−T, no transpose; closing stock is never negative. */
practice({ id: 'q43c', parent: 'q43', kind: 'applied',
 title: 'Closing stock at two shops',
 brief: 'Two shops took the same deliveries and made their sales, and the stock sheet must be brought up to date.',
 labels: ['entry 11', 'entry 12', 'entry 21', 'entry 22'], tolerance: 0.01 },
 [['delivered 11', 'delivered 12'], ['entry 11', 'entry 12'], ['before sales 21', 'before sales 22']], {
 canonical: { k: 2, S: [[6, 4], [5, 8]], D: [[3, 2], [1, 4]], T: [[7, 5], [4, 9]] },
 draw: R => until(() => { const t = (lo, hi) => [[R.int(lo, hi), R.int(lo, hi)], [R.int(lo, hi), R.int(lo, hi)]]; return { k: R.pick([2, 2, 3]), S: t(2, 9), D: t(1, 5), T: t(1, 12) }; },
  ({ k, S, D, T }) => { const C = S.map((r, i) => r.map((x, j) => x + k * D[i][j] - T[i][j])); return C.flat().every(x => x >= 0) && C.flat().some(x => x > 0) && new Set(D.flat()).size > 1 && S.flat().join() !== '6,4,5,8'; },
  { k: 3, S: [[4, 7], [2, 5]], D: [[2, 1], [3, 2]], T: [[6, 8], [9, 4]] }),
 build: ({ k, S, D, T }) => { const K = D.map(r => r.map(x => k * x)), B = S.map((r, i) => r.map((x, j) => x + K[i][j])), C = B.map((r, i) => r.map((x, j) => x - T[i][j])), times = k === 2 ? 'twice' : 'three times'; return {
  prompt: `A stock table has one row per shop (Harbour, then Hill) and one column per product (lamps, then kettles). Opening stock: S=${mat(S)}. During the week the delivery D=${mat(D)} arrives ${times}. Sales for the week: T=${mat(T)}. The closing stock is S+${n(k)}D−T. Enter its four entries, row by row.`,
  answer: C.flat(),
  hints: [`Every table has the same shape, so work in one position at a time. Start by multiplying every entry of D by ${n(k)}.`,
   `In each position: opening stock, plus ${n(k)} times the delivery, minus the sales. Keep the order of the rows: Harbour, then Hill.`],
  solution: `${n(k)}D=${mat(K)}. Adding the opening stock: S+${n(k)}D=${mat(B)}. Taking away the sales: S+${n(k)}D−T=${mat(C)}. Each entry uses only the three numbers in its own position.`,
  guidance: [
   { prompt: `Start with the Harbour row. The first row of D is ${vec(D[0])}. Enter the first row of ${n(k)}D.`, answer: K[0], explanation: `${n(k)}·${vec(D[0])}=${vec(K[0])}: every entry is multiplied by ${n(k)}.` },
   { prompt: `Add that to the first row of S, ${vec(S[0])}, and subtract the first row of T, ${vec(T[0])}. Enter the Harbour row of the closing stock.`, answer: C[0], explanation: `${vec(S[0])}+${vec(K[0])}=${vec(B[0])}, and ${vec(B[0])}−${vec(T[0])}=${vec(C[0])}.` },
   { prompt: `Now the Hill row. The second rows are ${vec(S[1])} in S and ${vec(D[1])} in D. Enter the second row of S+${n(k)}D, the stock before sales.`, answer: B[1], explanation: `${vec(S[1])}+${n(k)}·${vec(D[1])}=${vec(B[1])}. Subtract the Hill sales ${vec(T[1])} to finish.` }
  ] }; }
});

/* q43d: Aᵀ times a vector (q06) for a 2×3 table: ingredient totals from orders per dish. At most one zero, and only in the soup row. */
practice({ id: 'q43d', parent: 'q43', kind: 'challenge', uses: 'q06',
 title: 'From orders to the shopping list',
 brief: 'The galley knows what one portion of each dish needs, and tonight\'s orders must become a list of ingredients.',
 labels: ['carrots', 'onions', 'potatoes'], tolerance: 0.01 },
 [['Aᵀ 11', 'Aᵀ 12'], ['carrots'], ['Aᵀ 31', 'Aᵀ 32']], {
 canonical: { A: [[2, 1, 0], [1, 3, 2]], o: [4, 5] },
 draw: R => until(() => { const o1 = R.int(2, 9); return { A: [[R.int(0, 4), R.int(0, 4), R.int(0, 4)], [R.int(0, 4), R.int(0, 4), R.int(0, 4)]], o: [o1, R.except(2, 9, [o1])] }; },
  ({ A }) => A.flat().filter(x => x === 0).length <= 1 && A[1].every(x => x > 0) && [0, 1, 2].every(j => A[0][j] + A[1][j] > 0 && A[0][j] !== A[1][j]) && A.flat().join() !== '2,1,0,1,3,2',
  { A: [[1, 2, 3], [2, 1, 4]], o: [3, 6] }),
 build: ({ A, o }) => { const At = T3(A), t = At.map(r => dot(r, o)); return {
  prompt: `A kitchen table lists what one portion needs, in pieces. Each row is a dish (soup, then pie). Each column is an ingredient (carrots, onions, potatoes): A=${mat(A)}. Tonight's orders are ${n(o[0])} soups and ${n(o[1])} pies. Transpose A, so that each row is an ingredient. Then multiply Aᵀ by the order vector ${vec(o)}. Enter the pieces needed: carrots, then onions, then potatoes.`,
  answer: t,
  hints: [`A has 2 rows and 3 columns, so Aᵀ has 3 rows and 2 columns. Each row of Aᵀ is one column of A: what the soup and the pie need of one ingredient.`,
   `Multiply each row of Aᵀ by the orders, as in the mission on matrix-vector products: first entry times ${n(o[0])}, plus second entry times ${n(o[1])}.`],
  solution: `Aᵀ=${mat(At)}: the columns of A are now rows. Carrots: ${n(At[0][0])}·${n(o[0])}+${n(At[0][1])}·${n(o[1])}=${n(t[0])}. Onions: ${n(At[1][0])}·${n(o[0])}+${n(At[1][1])}·${n(o[1])}=${n(t[1])}. Potatoes: ${n(At[2][0])}·${n(o[0])}+${n(At[2][1])}·${n(o[1])}=${n(t[2])}. A itself cannot multiply ${vec(o)}: its rows have three entries and the order vector has two.`,
  guidance: [
   { prompt: `The first row of Aᵀ is the first column of A=${mat(A)}, the carrots column. Enter that row.`, answer: At[0], explanation: `The carrots column holds ${n(A[0][0])} for the soup and ${n(A[1][0])} for the pie, so the first row of Aᵀ is ${vec(At[0])}.` },
   { prompt: `Multiply that row by the orders ${vec(o)}: ${n(At[0][0])}·${n(o[0])}+${n(At[0][1])}·${n(o[1])}. How many carrots are needed?`, answer: [t[0]], explanation: `${n(At[0][0] * o[0])}+${n(At[0][1] * o[1])}=${n(t[0])} carrots.` },
   { prompt: `The third row of Aᵀ is the third column of A, the potatoes column. Enter that row.`, answer: At[2], explanation: `The third row of Aᵀ is ${vec(At[2])}. Multiply it by ${vec(o)} for the potatoes, and do the same with the onions row.` }
  ] }; }
});

/* ================= q44 Full row reduction =================
   Taught: row operations on the whole augmented row; clear below and above each pivot until [I | solution].
   Pitfall: forgetting the right-hand side. All three systems here have a first pivot of 1 and a second pivot of 1
   after the first clearing step, so every row operation stays in whole numbers. */

/* Eliminate a system whose first row starts with 1 and whose second row has y-coefficient 1 once x is cleared. */
const elim = (A, b) => { const m21 = A[1][0], m31 = A[2][0], r2 = A[1].map((e, i) => e - m21 * A[0][i]), b2 = b[1] - m21 * b[0], r3 = A[2].map((e, i) => e - m31 * A[0][i]), b3 = b[2] - m31 * b[0];
 const k = r3[1], u33 = r3[2] - k * r2[2], bz = b3 - k * b2, z = bz / u33, y = b2 - r2[2] * z, x = b[0] - A[0][1] * y - A[0][2] * z;
 return { m21, m31, r2, b2, r3, b3, k, u33, bz, x, y, z }; };
/* The worked reduction in words, shared by the three missions. */
const story = (A, b, e) => `${e.m21 === 0 ? `The second row has no x, so it stays ${row(e.r2, e.b2)}.` : `Clear x from the second row: ${rowop('R₂', e.m21, 'R₁')} gives ${row(e.r2, e.b2)}.`} Clear x from the third row: ${rowop('R₃', e.m31, 'R₁')} gives ${row(e.r3, e.b3)}. Clear y from it: ${rowop('R₃', e.k, 'R₂')} gives ${row([0, 0, e.u33], e.bz)}${e.u33 === 1 ? '' : `, and dividing the row by ${n(e.u33)} gives ${row([0, 0, 1], e.z)}`}, so z=${n(e.z)}. Now clear above the pivots. ${rowop('R₂', e.r2[2], 'R₃')} gives ${row([0, 1, 0], e.y)}, so y=${n(e.y)}. Then ${rowop('R₁', A[0][1], 'R₂')}${A[0][2] === 1 ? '−' : plus(-A[0][2])}R₃ gives ${row([1, 0, 0], e.x)}, so x=${n(e.x)}. The reduced form is [I | ${vec([e.x, e.y, e.z])}].`;
/* A positive whole system built backwards from its elimination: row₁=(1,u12,u13), row₂=m21·row₁+(0,1,u23), row₃=m31·row₁+m32·(0,1,u23)+(0,0,u33). */
const posSystem = (R, smax) => { const u12 = R.int(1, 3), u13 = R.int(1, 3), u23 = R.pick([-1, 1, 2]), u33 = R.pick([1, 2, 3, -1]), m21 = R.int(1, 3), m31 = R.int(1, 3), m32 = R.pick([-1, 1, 2]);
 const r1 = [1, u12, u13], r2 = [0, 1, u23], A = [r1, r1.map((e, i) => m21 * e + r2[i]), r1.map((e, i) => m31 * e + m32 * r2[i] + (i === 2 ? u33 : 0))], s = [R.int(1, smax), R.int(1, smax), R.int(1, smax)];
 return { A, s, b: A.map(r => dot(r, s)) }; };
const posOk = ({ A, b, s }) => A.flat().every(e => e >= 1 && e <= 9) && b.every(e => e <= 99) && new Set(s).size === 3;

/* q44b: three receipts, three prices. Rows are receipts. */
practice({ id: 'q44b', parent: 'q44', kind: 'setting',
 title: 'Three receipts, three prices',
 brief: 'Three shoppers bought rice, beans and coffee at one stall, and their receipts hold the three prices between them.',
 labels: ['x, rice ($ per kg)', 'y, beans ($ per kg)', 'z, coffee ($ per kg)'], tolerance: 0.01 },
 [['y coefficient', 'z coefficient', 'right-hand side'], ['z coefficient', 'right-hand side'], ['z, coffee ($ per kg)', 'y, beans ($ per kg)']], {
 canonical: { A: [[1, 2, 1], [2, 5, 3], [1, 4, 5]], b: [13, 34, 41] },
 draw: R => { const p = until(() => posSystem(R, 9), p => posOk(p) && p.A.flat().join() !== '1,2,1,2,5,3,1,4,5', { A: [[1, 1, 2], [2, 3, 6], [1, 2, 5]], b: [12, 31, 23] }); return { A: p.A, b: p.b }; },
 build: ({ A, b }) => { const e = elim(A, b); return {
  prompt: `Three shoppers buy rice, beans and coffee at the same stall. One kilogram of rice costs x dollars, of beans y dollars and of coffee z dollars. Their receipts give ${eq3(A[0], b[0])}, ${eq3(A[1], b[1])} and ${eq3(A[2], b[2])}: the number in front of a letter is the kilograms bought, and the right-hand side is the dollars paid. Reduce the system to reduced row echelon form. Enter the prices x, then y, then z.`,
  answer: [e.x, e.y, e.z],
  hints: [`Write each receipt as a row of four numbers: the three amounts, then the dollars paid. Use ${rowop('R₂', e.m21, 'R₁')} and ${rowop('R₃', e.m31, 'R₁')} to clear x below the first row. Change the dollars too.`,
   `Then use the new second row to clear y from the third row. That leaves only z in the third row. Find z, and work upwards to y and x.`],
  solution: story(A, b, e),
  guidance: [
   { prompt: `Apply ${rowop('R₂', e.m21, 'R₁')} to the second receipt, ${row(A[1], b[1])}. The x entry becomes 0. Enter the new y coefficient, z coefficient and right-hand side.`, answer: [e.r2[1], e.r2[2], e.b2], explanation: `${row(A[1], b[1])} ${minusTimes(e.m21)} ${row(A[0], b[0])} is ${row(e.r2, e.b2)}. The dollars change along with the amounts.` },
   { prompt: `${rowop('R₃', e.m31, 'R₁')} turns the third receipt into ${row(e.r3, e.b3)}. Now apply ${rowop('R₃', e.k, 'R₂')} with the new second row ${row(e.r2, e.b2)}. Enter the new z coefficient and right-hand side.`, answer: [e.u33, e.bz], explanation: `${n(e.r3[2])}${plus(-e.k * e.r2[2])}=${n(e.u33)} and ${n(e.b3)}${plus(-e.k * e.b2)}=${n(e.bz)}. The third row now reads ${lin([[e.u33, 'z']])}=${n(e.bz)}.` },
   { prompt: `Solve ${lin([[e.u33, 'z']])}=${n(e.bz)} for z. Then use the second row, ${lin([[e.r2[1], 'y'], [e.r2[2], 'z']])}=${n(e.b2)}, to find y. Enter z, then y.`, answer: [e.z, e.y], explanation: `z=${n(e.z)}, and y=${n(e.b2)}${plus(-e.r2[2] * e.z)}=${n(e.y)}. Put both into the first receipt to get x.` }
  ] }; }
});

/* q44c: the player sets up the three equations from the story: x+y+z=T, y−z=D, lane metres. The lane lengths come
   from a short list for which the last pivot ly+lz−2lx is not zero. */
practice({ id: 'q44c', parent: 'q44', kind: 'applied',
 title: 'Loading the ferry',
 brief: 'The ferry deck is full, and the harbour office wants the count of cars, vans and trucks from three facts.',
 labels: ['x, cars', 'y, vans', 'z, trucks'], tolerance: 0.01 },
 [['y coefficient', 'z coefficient', 'right-hand side'], ['z coefficient', 'right-hand side'], ['z, trucks', 'y, vans']], {
 canonical: { L: [5, 7, 12], T: 22, D: 4, M: 145 },
 draw: R => until(() => { const L = R.pick([[5, 7, 12], [4, 6, 11], [5, 8, 13], [4, 6, 10], [5, 7, 11], [4, 7, 12], [5, 6, 12]]), z = R.int(2, 7), D = R.int(2, 6), y = z + D, x = R.int(6, 20); return { L, T: x + y + z, D, M: L[0] * x + L[1] * y + L[2] * z }; },
  p => !(p.T === 22 && p.D === 4 && p.M === 145), { L: [4, 6, 10], T: 20, D: 3, M: 114 }),
 build: ({ L, T, D, M }) => { const A = [[1, 1, 1], [0, 1, -1], L], b = [T, D, M], e = elim(A, b); return {
  prompt: `A ferry carries x cars, y vans and z trucks. There are ${n(T)} vehicles in all. There are ${n(D)} more vans than trucks. A car takes ${n(L[0])} m of lane, a van ${n(L[1])} m and a truck ${n(L[2])} m, and together they fill ${n(M)} m of lane. Write the three facts as equations, in that order. Then reduce the system to reduced row echelon form. Enter x, then y, then z.`,
  answer: [e.x, e.y, e.z],
  hints: [`The three equations are x+y+z=${n(T)}, y−z=${n(D)} and ${eq3(L, M)}. The second has no x, so only the third row needs x cleared.`,
   `After x and then y are cleared from the third row, only z is left in it. Find z, then work upwards: y from the second row, x from the first.`],
  solution: `The facts give x+y+z=${n(T)}, y−z=${n(D)} and ${eq3(L, M)}. ${story(A, b, e)}`,
  guidance: [
   { prompt: `The lane equation is the third row, ${row(L, M)}, and the first row is ${row(A[0], T)}. Apply ${rowop('R₃', e.m31, 'R₁')}. Enter the new y coefficient, z coefficient and right-hand side.`, answer: [e.r3[1], e.r3[2], e.b3], explanation: `${row(L, M)} ${minusTimes(e.m31)} ${row(A[0], T)} is ${row(e.r3, e.b3)}. The right-hand side changes too.` },
   { prompt: `The second row is y−z=${n(D)}, that is ${row(A[1], D)}. Apply ${rowop('R₃', e.k, 'R₂')} to the third row ${row(e.r3, e.b3)}. Enter the new z coefficient and right-hand side.`, answer: [e.u33, e.bz], explanation: `${n(e.r3[2])}${plus(-e.k * e.r2[2])}=${n(e.u33)} and ${n(e.b3)}${plus(-e.k * e.b2)}=${n(e.bz)}. The third row now reads ${lin([[e.u33, 'z']])}=${n(e.bz)}.` },
   { prompt: `Solve ${lin([[e.u33, 'z']])}=${n(e.bz)} for z. Then use y−z=${n(D)} to find y. Enter z, then y.`, answer: [e.z, e.y], explanation: `z=${n(e.z)} trucks, and y=${n(D)}+${n(e.z)}=${n(e.y)} vans. The first row then gives the cars.` }
  ] }; }
});

/* q44d: the column picture (q15, coordinates in a basis): amounts of three blends that add up to a target.
   The blends are the columns of the system. Reading them as rows gives a different answer in every draw. */
practice({ id: 'q44d', parent: 'q44', kind: 'challenge', uses: 'q15',
 title: 'Three blends for one field',
 brief: 'A grower has three fertiliser blends and one field, and needs the bags of each that give exactly what the soil test asks for.',
 labels: ['x, bags of blend 1', 'y, bags of blend 2', 'z, bags of blend 3'], tolerance: 0.01 },
 [['x coefficient', 'y coefficient', 'z coefficient', 'right-hand side'], ['y coefficient', 'z coefficient', 'right-hand side'], ['z coefficient', 'right-hand side']], {
 canonical: { blends: [[1, 1, 2], [1, 2, 3], [2, 4, 7]], need: [11, 18, 31] },
 draw: R => { const p = until(() => posSystem(R, 6), p => posOk(p) && T3(p.A).map(r => dot(r, p.s)).join() !== p.b.join() && p.A.flat().join() !== '1,1,2,1,2,4,2,3,7', { A: [[1, 2, 1], [2, 5, 3], [1, 4, 5]], s: [3, 1, 2], b: [7, 17, 17] }); return { blends: T3(p.A), need: p.b }; },
 build: ({ blends, need }) => { const A = T3(blends), b = need, e = elim(A, b); return {
  prompt: `Three fertiliser blends are mixed for one field. Each list gives the kilograms of nitrogen, phosphate and potash in one bag. Blend 1: ${vec(blends[0])}. Blend 2: ${vec(blends[1])}. Blend 3: ${vec(blends[2])}. The field needs ${vec(need)} kg. Find x, y and z, the bags of each blend, so that x times blend 1 plus y times blend 2 plus z times blend 3 equals the need. Each nutrient gives one equation. Reduce the system to reduced row echelon form. Enter x, then y, then z.`,
  answer: [e.x, e.y, e.z],
  hints: [`The blends go down the columns. The nitrogen equation takes the first number of every list: ${eq3(A[0], b[0])}. Write the phosphate and potash equations the same way.`,
   `Use ${rowop('R₂', e.m21, 'R₁')} and ${rowop('R₃', e.m31, 'R₁')} to clear x below the first row, then the new second row to clear y from the third. Find z, then work upwards.`],
  solution: `Nitrogen: ${eq3(A[0], b[0])}. Phosphate: ${eq3(A[1], b[1])}. Potash: ${eq3(A[2], b[2])}. Each blend fills one column. ${story(A, b, e)} These are the coordinates of the need in the basis made of the three blends.`,
  guidance: [
   { prompt: `Nitrogen is the first number in each list. Write the nitrogen equation: bags times nitrogen per bag, added up, equals the nitrogen needed. Enter the numbers in front of x, y and z, then the right-hand side.`, answer: [A[0][0], A[0][1], A[0][2], b[0]], explanation: `${eq3(A[0], b[0])}. In the same way phosphate gives ${eq3(A[1], b[1])} and potash gives ${eq3(A[2], b[2])}.` },
   { prompt: `Apply ${rowop('R₂', e.m21, 'R₁')} to the phosphate row ${row(A[1], b[1])}. Enter the new y coefficient, z coefficient and right-hand side.`, answer: [e.r2[1], e.r2[2], e.b2], explanation: `${row(A[1], b[1])} ${minusTimes(e.m21)} ${row(A[0], b[0])} is ${row(e.r2, e.b2)}.` },
   { prompt: `${rowop('R₃', e.m31, 'R₁')} turns the potash row into ${row(e.r3, e.b3)}. Now apply ${rowop('R₃', e.k, 'R₂')}. Enter the new z coefficient and right-hand side.`, answer: [e.u33, e.bz], explanation: `${n(e.r3[2])}${plus(-e.k * e.r2[2])}=${n(e.u33)} and ${n(e.b3)}${plus(-e.k * e.b2)}=${n(e.bz)}, so ${lin([[e.u33, 'z']])}=${n(e.bz)}. Find z, then y from the second row and x from the first.` }
  ] }; }
});

/* ================= q45 Pivoted LU =================
   Taught: swap rows to bring a usable (larger) pivot to the top; with PA=LU, L₂₁ is the multiplier and U the triangle.
   The parent's draws always have a zero in the top left, so L₂₁ is always 0 there. q45b and q45d practise the other
   case, a small top-left entry, where the multiplier is a fraction of size below 1. */
const M2 = m => mat([[m[0], m[1]], [m[2], m[3]]]);
/* a/c is ±1/2, ±1/4 or ±1/5, and d is a multiple of the denominator, so L₂₁ is a short decimal and U₂₂ is whole. */
const smallPivot = R => { const den = R.pick([2, 2, 4, 5]), a = R.nz(-2, 2), c = den * a * R.pick([-1, 1]), d = den * R.nz(-2, 2), b = R.nz(-9, 9); return { m: [a, b, c, d] }; };
const pivotOk = ({ m: [a, b, c, d] }) => Math.abs(c) <= 10 && b - a * d / c !== 0;

/* q45b: nonzero small pivot; same four boxes as the parent. */
practice({ id: 'q45b', parent: 'q45', kind: 'setting',
 title: 'The circuit solver swaps rows',
 brief: 'A circuit solver meets a small leading number, and swaps rows before it divides.',
 labels: ['L21', 'U11', 'U12', 'U22'], tolerance: 0.004 },
 [['U11', 'U12'], ['L21'], ['U22']], {
 canonical: { m: [2, 3, 8, 4] },
 draw: R => until(() => smallPivot(R), p => pivotOk(p) && p.m.join() !== '2,3,8,4', { m: [1, 5, 2, 4] }),
 build: ({ m }) => { const [a, b, c, d] = m, l = a / c, ld = a * d / c, u22 = b - ld; return {
  prompt: `A circuit solver must factor the matrix A=${M2(m)} before it can find two loop currents. The top-left entry, ${n(a)}, is smaller in size than the entry below it, ${n(c)}. So the solver first swaps the two rows, to divide by the number that is larger in size. Factor the swapped matrix, PA=LU, with 1s on the diagonal of L. Enter the multiplier L₂₁, then U₁₁, U₁₂ and U₂₂.`,
  answer: [l, c, d, u22],
  hints: [`After the swap, the old bottom row is on top. It is the pivot row, and it goes into U unchanged.`,
   `The multiplier is the new bottom-left entry divided by the pivot: ${n(a)}/${par(c)}. Subtract that multiple of the pivot row from the new bottom row.`],
  solution: `The swap P=[[0,1],[1,0]] gives PA=${M2([c, d, a, b])}. The multiplier is L₂₁=${n(a)}/${par(c)}=${n(l)}. Subtracting ${n(l)} times the pivot row from the bottom row leaves ${n(b)}−${par(l)}·${par(d)}=${n(u22)} in the last place, so U=${M2([c, d, 0, u22])} and L=${M2([1, 0, l, 1])}. The swap put the number that is larger in size in the pivot place, so the multiplier is smaller than 1 in size.`,
  guidance: [
   { prompt: `Swap the rows of A=${M2(m)}. The new top row is the first row of U. Enter it.`, answer: [c, d], explanation: `The row ${vec([c, d])} moves to the top. Its first entry, ${n(c)}, is the pivot.` },
   { prompt: `The entry below the pivot is now ${n(a)}. Divide it by the pivot ${n(c)}. What is the multiplier L₂₁?`, answer: [l], explanation: `${n(a)}/${par(c)}=${n(l)}. This number is stored in L, below the diagonal.` },
   { prompt: `Subtract ${n(l)} times the pivot row ${vec([c, d])} from the bottom row ${vec([a, b])}. The first entry becomes 0. What is the second entry, U₂₂?`, answer: [u22], explanation: `${n(b)}−${par(l)}·${par(d)}=${n(b)}${plus(-ld)}=${n(u22)}.` }
  ] }; }
});

/* q45c: the parent's zero-pivot case, carried through to the solution of the system. A draw never repeats the
   parent's worked example A=[[0,4],[2,5]], which "Review the lesson" shows already factored. */
practice({ id: 'q45c', parent: 'q45', kind: 'applied',
 title: 'Two receipts, one without coffee',
 brief: 'Two café receipts hold the price of a coffee and of a cake, but the first receipt has no coffee on it.',
 labels: ['L21', 'U22', 'x, coffee ($)', 'y, cake ($)'], tolerance: 0.01 },
 [['pivot row first', 'pivot row second', 'top total'], ['L21', 'U22'], ['y, cake ($)']], {
 canonical: { b: 3, c: 2, d: 1, r: [15, 13] },
 draw: R => until(() => { const b = R.int(2, 5), c = R.int(2, 5), d = R.int(1, 5), x = R.int(2, 6), y = R.except(2, 9, [x]); return { b, c, d, r: [b * y, c * x + d * y] }; },
  p => !(p.b === 3 && p.c === 2 && p.d === 1) && !(p.b === 4 && p.c === 2 && p.d === 5) && p.r[0] !== p.r[1], { b: 2, c: 3, d: 2, r: [8, 17] }),
 build: ({ b, c, d, r }) => { const y = r[0] / b, x = (r[1] - d * y) / c, m = [0, b, c, d]; return {
  prompt: `Two café receipts are used to find the price of a coffee, x dollars, and of a cake, y dollars. Receipt 1 has no coffee and ${n(b)} cakes, and comes to $${n(r[0])}. Receipt 2 has ${n(c)} coffees and ${n(d)} ${d === 1 ? 'cake' : 'cakes'}, and comes to $${n(r[1])}. The counts form A=${M2(m)}. Its top-left entry is 0, and a pivot of 0 cannot be divided by. So swap the two rows, and the two totals with them. Then factor the swapped matrix, PA=LU, with 1s on the diagonal of L. Enter the multiplier L₂₁, then U₂₂, then the prices x and y.`,
  answer: [0, b, x, y],
  hints: [`After the swap the receipt with coffee on it is the top row. Look at the entry below its first number: is there anything left to clear?`,
   `With U in hand, start from the bottom row, which holds only cakes. Then put the cake price into the top row to get the coffee price.`],
  solution: `The swap gives PA=${M2([c, d, 0, b])} with totals ${vec([r[1], r[0]])}. The entry below the pivot ${n(c)} is already 0, so L₂₁=0, L is the identity and U=PA, with U₂₂=${n(b)}. Bottom row: ${n(b)}y=${n(r[0])}, so y=${n(y)}. Top row: ${lin([[c, 'x'], [d, 'y']])}=${n(r[1])}, so ${n(c)}x=${n(r[1])}−${n(d * y)}=${n(c * x)} and x=${n(x)}. The zero pivot only meant the rows were in the wrong order.`,
  guidance: [
   { prompt: `Swap the two rows of A=${M2(m)} and the two totals. Enter the new top row, then the total that goes with it.`, answer: [c, d, r[1]], explanation: `Receipt 2 moves to the top: ${row([c, d], r[1])}. Its first entry ${n(c)} is a pivot that can be divided by.` },
   { prompt: `The entry below the pivot is 0. Enter the multiplier L₂₁=0/${n(c)}, then the entry U₂₂ of the bottom row.`, answer: [0, b], explanation: `Nothing needs clearing, so the multiplier is 0 and the bottom row stays ${vec([0, b])}.` },
   { prompt: `The bottom row now reads ${n(b)}y=${n(r[0])}. What is y, the price of a cake?`, answer: [y], explanation: `y=${n(r[0])}/${n(b)}=${n(y)} dollars. Put it into the top row, ${lin([[c, 'x'], [d, 'y']])}=${n(r[1])}, to get the coffee price.` }
  ] }; }
});

/* q45d: the determinant (q09) read off the factors: product of U's diagonal, sign flipped once for the swap. */
practice({ id: 'q45d', parent: 'q45', kind: 'challenge', uses: 'q09',
 title: 'Area scale from the factors',
 brief: 'A drawing program needs the signed area scale of a transform, and reads it off the factors it already has.',
 labels: ['L21', 'U22', 'product U11·U22', 'det A'], tolerance: 0.004 },
 [['L21'], ['U22'], ['ad', 'bc']], {
 canonical: { m: [3, 5, -6, 4] },
 draw: R => until(() => { const den = R.pick([2, 2, 4, 5]), a = R.pick([-3, -2, -1, 1, 2, 3]), c = den * a * R.pick([-1, 1]), d = den * R.nz(-2, 2), b = R.nz(-9, 9); return { m: [a, b, c, d] }; },
  p => Math.abs(p.m[2]) <= 12 && p.m[1] - p.m[0] * p.m[3] / p.m[2] !== 0 && Math.abs(p.m[0] * p.m[3] - p.m[1] * p.m[2]) <= 60 && p.m.join() !== '3,5,-6,4', { m: [1, 4, -2, 6] }),
 build: ({ m }) => { const [a, b, c, d] = m, l = a / c, ld = a * d / c, u22 = b - ld, prod = c * u22, det = -prod; return {
  prompt: `A drawing program transforms shapes with the matrix A=${M2(m)}. To get det A, the signed area scale, it uses the factors of A. Swap the two rows of A, then factor the swapped matrix, PA=LU, with 1s on the diagonal of L. Multiply the two diagonal entries of U. One row swap flips the sign of a determinant, so det A is minus that product. Enter L₂₁, then U₂₂, then the product U₁₁·U₂₂, then det A.`,
  answer: [l, u22, prod, det],
  hints: [`After the swap the pivot row is ${vec([c, d])}, and it is the first row of U. The multiplier is ${n(a)}/${par(c)}.`,
   `U₂₂ is what is left in the last place after the multiple of the pivot row is subtracted. You can check your det A with ad−bc on the original matrix.`],
  solution: `The swap gives PA=${M2([c, d, a, b])}. L₂₁=${n(a)}/${par(c)}=${n(l)}, and U₂₂=${n(b)}−${par(l)}·${par(d)}=${n(u22)}, so U=${M2([c, d, 0, u22])}. The product of its diagonal is ${par(c)}·${par(u22)}=${n(prod)}. One swap flips the sign: det A=${n(det)}. Check with ad−bc: ${par(a)}·${par(d)}−${par(b)}·${par(c)}=${n(a * d)}${plus(-b * c)}=${n(det)}.`,
  guidance: [
   { prompt: `Swap the rows of A=${M2(m)}. The pivot is now ${n(c)} and the entry below it is ${n(a)}. What is the multiplier L₂₁?`, answer: [l], explanation: `${n(a)}/${par(c)}=${n(l)}.` },
   { prompt: `Subtract ${n(l)} times the pivot row ${vec([c, d])} from the bottom row ${vec([a, b])}. What is left in the last place, U₂₂?`, answer: [u22], explanation: `${n(b)}−${par(l)}·${par(d)}=${n(b)}${plus(-ld)}=${n(u22)}. So the diagonal of U holds ${n(c)} and ${n(u22)}.` },
   { prompt: `Check the result on the original A=${M2(m)}, as in the mission on determinants. Here a and b are the top row, c and d the bottom row. Enter the two products ad and bc.`, answer: [a * d, b * c], explanation: `ad=${n(a * d)} and bc=${n(b * c)}, so det A=${n(a * d)}${plus(-b * c)}=${n(det)}. That is minus the product ${par(c)}·${par(u22)}=${n(prod)}, because of the one swap.` }
  ] }; }
});

})();
