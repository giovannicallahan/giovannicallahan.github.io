/* Linear algebra practice missions, file 11 of 14: concepts q51–q55, three practice missions each
   (q51b q51c q51d ... q55b q55c q55d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p11.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- add missions for q51–q55 below this line ---- */

/* Small text helpers for this file. tm(3,'t') "3t", tm(1,'t') "t", tm(−1,'t') "−t"; ptm(−3,'t') " − 3t", ptm(1,'t') " + t";
   cx(4,−2) "4 − 2i", cx(3,1) "3 + i": a complex number with both parts non-zero. */
const tm = (k, s) => (k === 1 ? '' : k === -1 ? '−' : n(k)) + s;
const ptm = (k, s) => (k < 0 ? ' − ' : ' + ') + (Math.abs(k) === 1 ? '' : n(Math.abs(k))) + s;
const cx = (re, im) => n(re) + ptm(im, 'i');
/* Gain pairs whose squares add to 5, 8, 10, 20 or 25, so every entry of Aᵀ/(AᵀA) is a short decimal.
   (1, 2) is left out: it is the parent q53's own column, and (1, 3) with its 0.1, 0.3 is the q53 worked example.
   GAINS_D has no equal pair: q53b says the two tracks are at different levels, and q53d has two different sensors. */
const GAINS = [[2, 1], [3, 1], [3, 4], [4, 3], [2, 4], [4, 2], [2, 2]];
const GAINS_D = [[3, 1], [2, 1], [3, 4], [4, 3], [2, 4], [4, 2]];

/* ---- q51 Span and linear dependence ---- */
/* Parent: w = au + bv with u = (1,0), v = (0,1), so a and b are read straight off w. Here the two moves are longer
   than one unit (p, q >= 2), so reading the numbers of w as a and b is wrong and the player has to divide. */
practice({ id: 'q51b', parent: 'q51', kind: 'setting',
 title: 'Mast camera preset',
 brief: 'The rover\'s mast camera has a saved preset, and the bay wants it rebuilt from plain pan and tilt steps.',
 labels: ['a (pan steps)', 'b (tilt steps)', 'dimension'], tolerance: 0.01 },
 [['a (pan steps)'], ['b (tilt steps)'], ['dimension']], {
 canonical: { p: 4, q: 5, w: [12, -10] },
 draw: R => { const p = R.int(2, 5), q = R.int(2, 5); return { p, q, w: [p * R.nz(-6, 6), q * R.nz(-6, 6)] }; },
 build: ({ p, q, w }) => { const a = w[0] / p, b = w[1] / q; return {
  prompt: `A rover's mast camera aims at a wall chart. One pan step moves the aim point by u = ${vec([p, 0])} cm and one tilt step moves it by v = ${vec([0, q])} cm. A saved preset moves the aim point by w = ${vec(w)} cm. Enter the number of pan steps a and the number of tilt steps b that make the preset, w = au + bv (a negative number means steps the other way). Then enter the dimension of the span of u, v and w.`,
  answer: [a, b, 2],
  hints: [`Only pan steps change the first number of the move, and each pan step changes it by ${n(p)}. So a is not the first number of w itself.`, 'The span is every aim point the three moves can reach. Ask whether w reaches any point that pan and tilt steps cannot already reach.'],
  solution: `First numbers: a × ${n(p)} = ${n(w[0])}, so a = ${n(a)}. Second numbers: b × ${n(q)} = ${n(w[1])}, so b = ${n(b)}. Pan and tilt point along different lines, so u and v already reach every point of the flat chart: that is 2 independent directions. w is built from u and v, so it adds no new direction. The span has dimension 2, although three vectors are listed.`,
  guidance: [
   { prompt: `Compare the first numbers in w = au + bv: a × ${n(p)} = ${n(w[0])}. What is a?`, answer: [a], explanation: `v has 0 in its first place, so only u counts there: a = ${n(w[0])} ÷ ${n(p)} = ${n(a)}.` },
   { prompt: `Compare the second numbers: b × ${n(q)} = ${n(w[1])}. What is b?`, answer: [b], explanation: `u has 0 in its second place, so only v counts there: b = ${n(w[1])} ÷ ${n(q)} = ${n(b)}.` },
   { prompt: 'u and v point along different lines, and w is a mix of u and v. How many independent directions do u, v and w have together? That number is the dimension of their span.', answer: [2], explanation: 'u and v give 2 independent directions. w lies in what they already reach, so it adds none. Count directions, not vectors.' }
  ] }; }
});

/* Vectors with three numbers. Sack U has no potash and sack V has no nitrogen, so nitrogen fixes a and potash fixes b;
   the phosphate is then worked out, not given. Three vectors of three numbers still span only a plane. */
practice({ id: 'q51c', parent: 'q51', kind: 'applied',
 title: 'Two sacks, one order',
 brief: 'A garden store fills a fertiliser order from two kinds of sack, and wants to know what the mix will contain.',
 labels: ['a (U sacks)', 'b (V sacks)', 'phosphate kg', 'dimension'], tolerance: 0.01 },
 [['a (U sacks)', 'b (V sacks)'], ['phosphate kg'], ['dimension']], {
 canonical: { U: [3, 1, 0], V: [0, 2, 4], N: 12, K: 20 },
 draw: R => { const U = [R.int(2, 5), R.int(1, 4), 0], V = [0, R.int(1, 4), R.int(2, 5)]; return { U, V, N: U[0] * R.int(2, 6), K: V[2] * R.int(2, 6) }; },
 build: ({ U, V, N, K }) => { const a = N / U[0], b = K / V[2], ph = a * U[1] + b * V[1]; return {
  prompt: `A garden store mixes fertiliser from two kinds of sack. Each sack is a vector of kilograms of (nitrogen, phosphate, potash): sack U = ${vec(U)} and sack V = ${vec(V)}. An order W must contain ${n(N)} kg of nitrogen and ${n(K)} kg of potash, and it is made from whole sacks only: W = aU + bV. Enter the number of U sacks a, then the number of V sacks b, then the kilograms of phosphate the order will contain. Last, enter the dimension of the span of U, V and W.`,
  answer: [a, b, ph, 2],
  hints: ['Only sack U holds nitrogen and only sack V holds potash. Use nitrogen to find a and potash to find b.', 'Both kinds of sack hold phosphate, so add the phosphate from the U sacks to the phosphate from the V sacks.'],
  solution: `Nitrogen: a × ${n(U[0])} = ${n(N)}, so a = ${n(a)}. Potash: b × ${n(V[2])} = ${n(K)}, so b = ${n(b)}. Phosphate: ${n(a)} × ${n(U[1])} + ${n(b)} × ${n(V[1])} = ${n(a * U[1])} + ${n(b * V[1])} = ${n(ph)} kg, so W = ${vec([N, ph, K])}. U and V are not multiples of each other, so they give 2 independent directions. W is a mix of U and V, so it adds none: the span has dimension 2, although each vector has three numbers.`,
  guidance: [
   { prompt: `Nitrogen comes only from U sacks: a × ${n(U[0])} = ${n(N)}. Potash comes only from V sacks: b × ${n(V[2])} = ${n(K)}. Enter a, then b.`, answer: [a, b], explanation: `a = ${n(N)} ÷ ${n(U[0])} = ${n(a)} and b = ${n(K)} ÷ ${n(V[2])} = ${n(b)}.` },
   { prompt: `Each U sack holds ${n(U[1])} kg of phosphate and each V sack holds ${n(V[1])} kg. How many kilograms of phosphate are in ${n(a)} U sacks and ${n(b)} V sacks together?`, answer: [ph], explanation: `${n(a)} × ${n(U[1])} + ${n(b)} × ${n(V[1])} = ${n(ph)} kg. This is the middle number of W = aU + bV.` },
   { prompt: 'U and V are not multiples of each other. W is made from U and V. What is the dimension of the span of U, V and W?', answer: [2], explanation: 'U and V give 2 independent directions and W adds no new one. Three numbers in each vector do not make the span 3-dimensional.' }
  ] }; }
});

/* Challenge: u and v are not along the axes, so a and b come from a pair of equations (q15, coordinates in a basis).
   The second pair p, q is on one line in about half the draws, so the last box is 1 or 2 and has to be checked. */
practice({ id: 'q51d', parent: 'q51', kind: 'challenge', uses: 'q15',
 title: 'Strokes of the drawing robot',
 brief: 'Two drawing robots each know two pen strokes, and the bay needs to know what each can draw.',
 labels: ['a', 'b', 'dimension of span of u, v, w', 'dimension of span of p, q'], tolerance: 0.01 },
 [['b'], ['a'], ['dimension of span of u, v, w', 'dimension of span of p, q']], {
 canonical: { u: [2, 3], v: [1, 4], w: [8, 17], p: [2, 4], q: [6, 12] },
 draw: R => { let u, v; do { u = [R.int(2, 4), R.int(2, 4)]; v = [R.int(1, 4), R.nz(-3, 4)]; } while (u[0] * v[1] - u[1] * v[0] === 0);
  const a = R.nz(-3, 4), b = R.nz(-3, 4), p = [R.int(1, 4), R.int(1, 4)], m = R.pick([2, 3, -1, -2]), e = R.bool() ? 0 : R.pick([-1, 1]);
  return { u, v, w: [a * u[0] + b * v[0], a * u[1] + b * v[1]], p, q: [m * p[0], m * p[1] + e] }; },
 build: ({ u, v, w, p, q }) => { const det = u[0] * v[1] - u[1] * v[0], a = Math.round((w[0] * v[1] - w[1] * v[0]) / det), b = Math.round((u[0] * w[1] - u[1] * w[0]) / det);
  const cf = [4, 3, 2].find(k => u[0] % k === 0 && u[1] % k === 0) || 1, k1 = u[1] / cf, k2 = u[0] / cf, of = k => k === 1 ? 'the' : `${n(k)} times the`;
  const D = k1 * v[0] - k2 * v[1], E = k1 * w[0] - k2 * w[1], m = q[0] / p[0], line = p[0] * q[1] - p[1] * q[0] === 0, dim = line ? 1 : 2;
  const eqx = `${tm(u[0], 'a')}${ptm(v[0], 'b')} = ${n(w[0])}`, eqy = `${tm(u[1], 'a')}${ptm(v[1], 'b')} = ${n(w[1])}`;
  const why = line ? `q is ${n(m)} times p, so p and q lie on one line through the start point: dimension 1.` : `the first number of q is ${n(m)} times the first number of p, but ${n(m)} times p is ${vec([m * p[0], m * p[1]])}, which is not q. So q is not a multiple of p, and they give 2 independent directions: dimension 2.`;
  return {
  prompt: `A drawing robot knows two pen strokes, u = ${vec(u)} cm and v = ${vec(v)} cm. Find the numbers a and b that build the stroke w = ${vec(w)} from them: w = au + bv. Enter a, then b, then the dimension of the span of u, v and w. A second robot knows only the strokes p = ${vec(p)} and q = ${vec(q)}. Enter the dimension of the span of p and q.`,
  answer: [a, b, 2, dim],
  hints: ['Write one equation for the first numbers and one for the second numbers. Both use the same a and b, so solve them as a pair.', 'For a dimension, count directions, not vectors. Two strokes that are multiples of each other lie on one line and give only one direction.'],
  solution: `First numbers: ${eqx}. Second numbers: ${eqy}. Solving the pair gives a = ${n(a)} and b = ${n(b)}. Check: ${n(a)} × ${n(u[0])} + ${par(b)} × ${par(v[0])} = ${n(w[0])} and ${n(a)} × ${n(u[1])} + ${par(b)} × ${par(v[1])} = ${n(w[1])}. u and v are not multiples of each other, so they give 2 directions, and w adds none: dimension 2. For the second robot, ${why}`,
  guidance: [
   { prompt: `The first numbers give ${eqx} and the second numbers give ${eqy}. Take ${of(k1)} first equation minus ${of(k2)} second: a drops out and ${tm(D, 'b')} = ${n(E)} is left. What is b?`, answer: [b], explanation: `Both equations ${cf === u[0] && cf === u[1] ? '' : 'then '}start with ${tm(k1 * u[0], 'a')}, so subtracting removes a. ${tm(D, 'b')} = ${n(E)} gives b = ${n(b)}.` },
   { prompt: `Put b = ${n(b)} into ${eqx}. What is a?`, answer: [a], explanation: `${tm(u[0], 'a')} = ${n(w[0])} − ${par(v[0] * b)} = ${n(w[0] - v[0] * b)}, so a = ${n(a)}.` },
   { prompt: `u and v are not multiples of each other, and w = au + bv. Enter the dimension of the span of u, v and w. Then look at p = ${vec(p)} and q = ${vec(q)}: is q a multiple of p? Enter the dimension of their span (1 if they lie on one line, 2 if not).`, answer: [2, dim], explanation: `u and v give 2 directions and w adds none: 2. For the second robot, ${why}` }
  ] }; }
});

/* ---- q52 Consistency and free variables ---- */
/* Parent: x + 2y = 5 and its double. Here neither receipt is the plain equation: both are multiples of one hidden
   equation x + by = s, and the last box uses the free variable to read off one actual price. */
practice({ id: 'q52b', parent: 'q52', kind: 'setting',
 title: 'Two receipts, one fact',
 brief: 'Two receipts from the same market stall should tell you the prices, but they only tell you one thing.',
 labels: ['c', 'k', 'free variables', 'tea price ($)'], tolerance: 0.01 },
 [['y coefficient', 'right side'], ['c', 'k'], ['free variables', 'tea price ($)']], {
 canonical: { b: 3, s: 11, m1: 2, m2: 3, t0: 2 },
 draw: R => { const b = R.int(2, 4), t0 = R.int(1, 3), m1 = R.int(2, 3), m2 = R.except(2, 5, [m1]); return { b, s: R.int(2, 6) + b * t0, m1, m2, t0 }; },
 build: ({ b, s, m1, m2, t0 }) => { const x0 = s - b * t0, e1 = `${n(m1)}x + ${n(m1 * b)}y = ${n(m1 * s)}`, e2 = `${n(m2)}x + ${n(m2 * b)}y = ${n(m2 * s)}`, base = `x + ${n(b)}y = ${n(s)}`; return {
  prompt: `A market stall sells tea at x dollars a cup and buns at y dollars each. Receipt one: ${n(m1)} teas and ${n(m1 * b)} buns cost $${n(m1 * s)}. Receipt two: ${n(m2)} teas and ${n(m2 * b)} buns cost $${n(m2 * s)}. Check that the two receipts agree, and see that together they cannot fix both prices. Let the bun price be y = t. Enter the constant c and the t coefficient k in x = c + kt, then the number of free variables. Last, enter the tea price x if a bun costs $${n(t0)}.`,
  answer: [s, -b, 1, x0],
  hints: [`Divide receipt one by ${n(m1)} and receipt two by ${n(m2)}, then compare the two equations you get.`, 'To get x alone, move the bun term to the other side. Its sign changes.'],
  solution: `Receipt one is ${e1}; divided by ${n(m1)} it is ${base}. Receipt two is ${e2}; divided by ${n(m2)} it is ${base} again. The receipts agree, so the system is consistent, but there is only one independent equation for two unknowns. With y = t: x = ${n(s)} − ${n(b)}t, so c = ${n(s)} and k = ${n(-b)}. One variable (y) is free. If a bun costs $${n(t0)}, then x = ${n(s)} − ${n(b)} × ${n(t0)} = ${n(x0)} dollars.`,
  guidance: [
   { prompt: `Receipt one says ${e1}. Divide every number by ${n(m1)}. Enter the y coefficient and the right side of the new equation.`, answer: [b, s], explanation: `${n(m1 * b)} ÷ ${n(m1)} = ${n(b)} and ${n(m1 * s)} ÷ ${n(m1)} = ${n(s)}, so receipt one says ${base}.` },
   { prompt: `Receipt two divided by ${n(m2)} gives the same equation, ${base}. Put y = t and solve for x in the form x = c + kt. Enter c, then k.`, answer: [s, -b], explanation: `x = ${n(s)} − ${n(b)}t. The bun term moves across and changes sign, so k = ${n(-b)}.` },
   { prompt: `There are two unknowns and one independent equation. How many free variables are there? Then put t = ${n(t0)} into x = ${n(s)} − ${n(b)}t and enter the tea price.`, answer: [1, x0], explanation: `2 unknowns − 1 independent equation = 1 free variable. x = ${n(s)} − ${n(b * t0)} = ${n(x0)}.` }
  ] }; }
});

/* Three unknowns, three reports, but the third is the first plus the second: two independent equations, one free variable. */
practice({ id: 'q52c', parent: 'q52', kind: 'applied',
 title: 'Three generators, two real rules',
 brief: 'Three reports describe the grid\'s three generators, and the operators need to know how much choice is left.',
 labels: ['x constant', 'x t coefficient', 'z constant', 'z t coefficient', 'free variables'], tolerance: 0.01 },
 [['y coefficient', 'right side'], ['x constant', 'x t coefficient'], ['z constant', 'z t coefficient', 'free variables']], {
 canonical: { m: 2, d: 3, T: 15 },
 draw: R => { const m = R.int(2, 3), d = R.int(1, 5); return { m, d, T: d + R.int(6, 15) }; },
 build: ({ m, d, T }) => { const r = T - d, k = m + 1, e3 = `2x${ptm(1 - m, 'y')} + z = ${n(T + d)}`; return {
  prompt: `Three generators feed the grid with x, y and z megawatts (MW, a unit of power). Report one, the total: x + y + z = ${n(T)}. Report two, a control rule: x − ${n(m)}y = ${n(d)}. Report three, from the control room log: ${e3}. Check whether report three says anything new. Then let y = t and write x and z in the form constant + coefficient × t. Enter the constant and the t coefficient of x, then the constant and the t coefficient of z, then the number of free variables.`,
  answer: [d, m, r, -k, 1],
  hints: ['Add report one and report two, side by side, and compare the result with report three.', 'Find x from report two first. Then put x and y into report one to get z. Watch the sign when the t terms move across.'],
  solution: `Report one plus report two: (x + y + z) + (x − ${n(m)}y) = 2x${ptm(1 - m, 'y')} + z, and ${n(T)} + ${n(d)} = ${n(T + d)}. That is report three exactly, so it adds nothing and does not contradict: the system is consistent with 2 independent equations. With y = t, report two gives x = ${n(d)} + ${n(m)}t. Report one gives z = ${n(T)} − x − y = ${n(T)} − ${n(d)} − ${n(m)}t − t = ${n(r)} − ${n(k)}t. Three unknowns and 2 independent equations leave 1 free variable.`,
  guidance: [
   { prompt: `Add report one and report two: (x + y + z) + (x − ${n(m)}y) on the left, ${n(T)} + ${n(d)} on the right. Enter the y coefficient of the sum, then its right side.`, answer: [1 - m, T + d], explanation: `y − ${n(m)}y = ${tm(1 - m, 'y')}, and ${n(T)} + ${n(d)} = ${n(T + d)}. The sum, ${e3}, is report three, so only two reports are independent.` },
   { prompt: `Put y = t into report two, x − ${n(m)}y = ${n(d)}, and solve for x. Enter the constant, then the t coefficient.`, answer: [d, m], explanation: `x = ${n(d)} + ${n(m)}t: the y term moves across and becomes plus.` },
   { prompt: `Put x = ${n(d)} + ${n(m)}t and y = t into x + y + z = ${n(T)} and solve for z. Enter its constant, then its t coefficient. Then enter the number of free variables.`, answer: [r, -k, 1], explanation: `z = ${n(T)} − ${n(d)} − ${n(m)}t − t = ${n(r)} − ${n(k)}t. Only t can be chosen freely, so there is 1 free variable.` }
  ] }; }
});

/* Challenge: first choose the right side that keeps the system consistent, then a third independent fact (q11, two
   equations in two unknowns) removes the free variable. Load two is never a whole-number multiple written plainly. */
practice({ id: 'q52d', parent: 'q52', kind: 'challenge', uses: 'q11',
 title: 'The smudged cargo log',
 brief: 'One weight in the cargo log is smudged, and the loaders still need the weight of a crate and of a drum.',
 labels: ['h (load two, kg)', 'c', 'k', 'drum kg', 'crate kg'], tolerance: 0.01 },
 [['kg in one set'], ['h (load two, kg)'], ['c', 'k'], ['drum kg', 'crate kg']], {
 canonical: { b: 2, s: 20, m1: 3, m2: 5, r: 3 },
 draw: R => { const b = R.int(2, 4), r = R.int(2, 4), m1 = R.int(2, 4), m2 = R.except(2, 6, [m1]); return { b, s: (b + r) * R.int(2, 6), m1, m2, r }; },
 build: ({ b, s, m1, m2, r }) => { const h = m2 * s, t = s / (b + r), x = r * t; return {
  prompt: `The cargo scale logged two loads of identical crates (x kg each) and identical drums (y kg each). Load one: ${n(m1)} crates and ${n(m1 * b)} drums weighed ${n(m1 * s)} kg. Load two: ${n(m2)} crates and ${n(m2 * b)} drums, but its weight is smudged. Enter the weight h that load two must show for the two logs to be consistent (to not contradict each other). With that h, let y = t and enter the constant c and the t coefficient k in x = c + kt. A third weighing then shows that one crate weighs the same as ${n(r)} drums. Enter the weight of a drum, then the weight of a crate.`,
  answer: [h, s, -b, t, x],
  hints: [`Both loads are made of the same set: one crate with ${n(b)} drums. Load one tells you what one set weighs.`, `The third weighing says x = ${n(r)}y. Put y = t into it and into x = c + kt, then solve for t.`],
  solution: `Load one is ${n(m1)} sets of one crate and ${n(b)} drums, so one set weighs ${n(m1 * s)} ÷ ${n(m1)} = ${n(s)} kg: x + ${n(b)}y = ${n(s)}. Load two is ${n(m2)} of the same sets, so it is consistent only if h = ${n(m2)} × ${n(s)} = ${n(h)} kg. Then both logs say the same thing and y is free: with y = t, x = ${n(s)} − ${n(b)}t, so c = ${n(s)} and k = ${n(-b)}. The third weighing gives x = ${n(r)}t, so ${n(r)}t = ${n(s)} − ${n(b)}t, ${n(b + r)}t = ${n(s)} and t = ${n(t)}. A drum weighs ${n(t)} kg and a crate weighs ${n(r)} × ${n(t)} = ${n(x)} kg. No free variable is left.`,
  guidance: [
   { prompt: `Load one is ${n(m1)} crates and ${n(m1 * b)} drums: that is ${n(m1)} sets of one crate with ${n(b)} drums. It weighed ${n(m1 * s)} kg. How many kilograms does one set weigh?`, answer: [s], explanation: `${n(m1 * s)} ÷ ${n(m1)} = ${n(s)}, so x + ${n(b)}y = ${n(s)}.` },
   { prompt: `Load two is ${n(m2)} crates and ${n(m2 * b)} drums: ${n(m2)} of the same sets. What weight h keeps it consistent with load one?`, answer: [h], explanation: `${n(m2)} × ${n(s)} = ${n(h)} kg. Any other weight would contradict load one.` },
   { prompt: `Both logs now say x + ${n(b)}y = ${n(s)}. Put y = t and write x = c + kt. Enter c, then k.`, answer: [s, -b], explanation: `x = ${n(s)} − ${n(b)}t, so c = ${n(s)} and k = ${n(-b)}.` },
   { prompt: `The third weighing says x = ${n(r)}y, which is x = ${n(r)}t. Set ${n(r)}t = ${n(s)} − ${n(b)}t and solve. Enter the weight of a drum (t), then of a crate (x).`, answer: [t, x], explanation: `${n(b + r)}t = ${n(s)}, so t = ${n(t)} and x = ${n(r)} × ${n(t)} = ${n(x)}. The new fact is independent, so it removes the free variable.` }
  ] }; }
});

/* ---- q53 Left and right inverses ---- */
/* Parent: the column (1, 2) and its L. Here L is found for another column and then used on stored track values. */
practice({ id: 'q53b', parent: 'q53', kind: 'setting',
 title: 'Two tracks, one sample',
 brief: 'A sound sample was saved on two tracks at different levels, and a decoder has to mix them back into one number.',
 labels: ['a', 'b', 'decoded sample'], tolerance: 0.004 },
 [['AᵀA'], ['a', 'b'], ['decoded sample']], {
 canonical: { g: [3, 1], x: 4 },
 draw: R => ({ g: R.pick(GAINS_D), x: R.pick([-8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]) }),
 build: ({ g, x }) => { const N = g[0] * g[0] + g[1] * g[1], a = g[0] / N, b = g[1] / N, tr = [g[0] * x, g[1] * x]; return {
  prompt: `A sound sample x is saved on two tracks. Track one stores ${tm(g[0], 'x')} and track two stores ${tm(g[1], 'x')}, so the recorder is the tall matrix A with the single column ${vec(g)}. A decoder L = [a, b] mixes the two tracks back into one number, and LA must be 1 so that it returns x. Use the minimum-norm left inverse L = Aᵀ/(AᵀA). Enter a, then b. The tracks now hold ${vec(tr)}: enter the sample that L decodes from them.`,
  answer: [a, b, x],
  hints: [`AᵀA is the column's dot product with itself: ${n(g[0])}² + ${n(g[1])}². Every entry of Aᵀ is divided by it.`, 'To decode, multiply a by the track one value and b by the track two value, then add.'],
  solution: `AᵀA = ${n(g[0])}² + ${n(g[1])}² = ${n(N)}. L = [${n(g[0])}, ${n(g[1])}]/${n(N)} = [${n(a)}, ${n(b)}]. Check: LA = ${n(a)} × ${n(g[0])} + ${n(b)} × ${n(g[1])} = 1. Decoding: ${n(a)} × ${par(tr[0])} + ${n(b)} × ${par(tr[1])} = ${n(a * tr[0])} + ${par(b * tr[1])} = ${n(x)}.`,
  guidance: [
   { prompt: `A is the column ${vec(g)}. What is AᵀA = ${n(g[0])}² + ${n(g[1])}²?`, answer: [N], explanation: `${n(g[0] * g[0])} + ${n(g[1] * g[1])} = ${n(N)}. This is the squared length of the column.` },
   { prompt: `Divide each entry of Aᵀ = [${n(g[0])}, ${n(g[1])}] by ${n(N)}. Enter a, then b.`, answer: [a, b], explanation: `${n(g[0])} ÷ ${n(N)} = ${n(a)} and ${n(g[1])} ÷ ${n(N)} = ${n(b)}. Then LA = ${n(a * g[0])} + ${n(b * g[1])} = 1.` },
   { prompt: `Decode the tracks ${vec(tr)}: work out ${n(a)} × ${par(tr[0])} + ${n(b)} × ${par(tr[1])}.`, answer: [x], explanation: `${n(a * tr[0])} + ${par(b * tr[1])} = ${n(x)}. L gives back the sample that was recorded.` }
  ] }; }
});

/* The other side: a wide matrix [p, q] and a right inverse, a column R with AR = 1. The lesson names it; the prompt
   gives its formula. The demand is a multiple of AAᵀ, so the two settings are whole numbers. */
practice({ id: 'q53c', parent: 'q53', kind: 'applied',
 title: 'Two pumps, one demand',
 brief: 'Two pumps fill one tank, and the operator wants a fixed recipe that turns a demand into two pump settings.',
 labels: ['R top', 'R bottom', 'pump 1 setting', 'pump 2 setting'], tolerance: 0.004 },
 [['AAᵀ'], ['R top', 'R bottom'], ['pump 1 setting', 'pump 2 setting']], {
 canonical: { g: [3, 4], y: 50 },
 draw: R => { const g = R.pick(GAINS); return { g, y: (g[0] * g[0] + g[1] * g[1]) * R.int(2, 5) }; },
 build: ({ g, y }) => { const N = g[0] * g[0] + g[1] * g[1], r = [g[0] / N, g[1] / N], s = [g[0] * y / N, g[1] * y / N]; return {
  prompt: `Two pumps fill one tank. With settings s₁ and s₂ the tank receives ${tm(g[0], 's₁')} + ${tm(g[1], 's₂')} litres a minute, so the pumps are the wide matrix A = [${n(g[0])}, ${n(g[1])}]. A right inverse is a column R with AR = 1: it gives settings that deliver exactly 1 litre a minute. Use R = Aᵀ/(AAᵀ), the one with the smallest settings. Enter the top and the bottom entry of R. Then the tank needs ${n(y)} litres a minute: multiply R by ${n(y)} and enter the settings of pump 1 and pump 2.`,
  answer: [r[0], r[1], s[0], s[1]],
  hints: [`AAᵀ is the row's dot product with itself: ${n(g[0])}² + ${n(g[1])}². Divide each entry of the row by it to get R.`, 'R answers a demand of 1 litre a minute. For a larger demand, multiply both entries of R by the demand.'],
  solution: `AAᵀ = ${n(g[0])}² + ${n(g[1])}² = ${n(N)}. R = ${vec(g)}/${n(N)} = ${vec(r)}. Check: AR = ${n(g[0])} × ${n(r[0])} + ${n(g[1])} × ${n(r[1])} = 1. For ${n(y)} litres a minute the settings are ${n(y)} × ${vec(r)} = ${vec(s)}, and ${n(g[0])} × ${n(s[0])} + ${n(g[1])} × ${n(s[1])} = ${n(y)}. A wide matrix has a right inverse but no left inverse: one demand cannot tell you which of many settings was used.`,
  guidance: [
   { prompt: `A is the row [${n(g[0])}, ${n(g[1])}]. What is AAᵀ = ${n(g[0])}² + ${n(g[1])}²?`, answer: [N], explanation: `${n(g[0] * g[0])} + ${n(g[1] * g[1])} = ${n(N)}.` },
   { prompt: `Divide each entry of Aᵀ = ${vec(g)} by ${n(N)}. Enter the top entry of R, then the bottom entry.`, answer: [r[0], r[1]], explanation: `R = ${vec(r)}. Check: ${n(g[0])} × ${n(r[0])} + ${n(g[1])} × ${n(r[1])} = ${n(g[0] * r[0])} + ${n(g[1] * r[1])} = 1, so AR = 1.` },
   { prompt: `Multiply R = ${vec(r)} by the demand ${n(y)}. Enter the setting of pump 1, then of pump 2.`, answer: [s[0], s[1]], explanation: `${n(y)} × ${n(r[0])} = ${n(s[0])} and ${n(y)} × ${n(r[1])} = ${n(s[1])}. Check: ${n(g[0])} × ${n(s[0])} + ${n(g[1])} × ${n(s[1])} = ${n(y)} litres a minute.` }
  ] }; }
});

/* Challenge with q18 (projection): the readings are off the line of A by s times the perpendicular (−g2, g1), so
   Ly is still a whole number and A(Ly) is the projection of y, which is never y itself. */
practice({ id: 'q53d', parent: 'q53', kind: 'challenge', uses: 'q18',
 title: 'Noisy wheel sensors',
 brief: 'Two wheel sensors disagree a little, and the array needs one speed estimate and the readings that would fit it.',
 labels: ['a', 'b', 'speed estimate', 'clean reading 1', 'clean reading 2'], tolerance: 0.004 },
 [['AᵀA', 'Aᵀy'], ['a', 'b'], ['speed estimate'], ['clean reading 1', 'clean reading 2']], {
 canonical: { g: [4, 2], y: [14, 2] },
 draw: R => { const g = R.pick(GAINS_D), x = R.int(2, 6), s = R.pick([-2, -1, 1, 2]); return { g, y: [x * g[0] - s * g[1], x * g[1] + s * g[0]] }; },
 build: ({ g, y }) => { const N = g[0] * g[0] + g[1] * g[1], dot = g[0] * y[0] + g[1] * y[1], a = g[0] / N, b = g[1] / N, x = dot / N, cl = [g[0] * x, g[1] * x]; return {
  prompt: `A rover's speed x is read by two wheel sensors with gains ${n(g[0])} and ${n(g[1])}, so clean readings are Ax, where A is the single column ${vec(g)}. Today's readings are noisy: y = ${vec(y)}, which is not an exact multiple of ${vec(g)}. Enter the minimum-norm left inverse L = [a, b] = Aᵀ/(AᵀA): a, then b. Then enter the speed estimate Ly. Last, enter the clean readings A(Ly), first sensor then second. They are the projection of y onto the line of A, and they show that AL does not hand y back.`,
  answer: [a, b, x, cl[0], cl[1]],
  hints: ['Ly is the same as (Aᵀy) ÷ (AᵀA): take the dot product of the gains with the readings, then divide by AᵀA.', 'For the clean readings, multiply each gain by your speed estimate.'],
  solution: `AᵀA = ${n(g[0])}² + ${n(g[1])}² = ${n(N)}, so L = [${n(g[0])}, ${n(g[1])}]/${n(N)} = [${n(a)}, ${n(b)}]. Aᵀy = ${n(g[0])} × ${par(y[0])} + ${n(g[1])} × ${par(y[1])} = ${n(dot)}, so Ly = ${n(dot)} ÷ ${n(N)} = ${n(x)}. Clean readings: A(Ly) = ${n(x)} × ${vec(g)} = ${vec(cl)}. This is the projection of y onto the line of A. It is not y = ${vec(y)}: LA = 1, but AL is a projection, not the identity.`,
  guidance: [
   { prompt: `A is the column ${vec(g)} and y = ${vec(y)}. Enter AᵀA = ${n(g[0])}² + ${n(g[1])}², then Aᵀy = ${n(g[0])} × ${par(y[0])} + ${n(g[1])} × ${par(y[1])}.`, answer: [N, dot], explanation: `AᵀA = ${n(g[0] * g[0])} + ${n(g[1] * g[1])} = ${n(N)}. Aᵀy = ${n(g[0] * y[0])} + ${par(g[1] * y[1])} = ${n(dot)}.` },
   { prompt: `Divide each entry of Aᵀ = [${n(g[0])}, ${n(g[1])}] by ${n(N)}. Enter a, then b.`, answer: [a, b], explanation: `L = [${n(a)}, ${n(b)}], and LA = ${n(a * g[0])} + ${n(b * g[1])} = 1.` },
   { prompt: `The speed estimate is Ly = (Aᵀy) ÷ (AᵀA) = ${n(dot)} ÷ ${n(N)}. What is it?`, answer: [x], explanation: `${n(dot)} ÷ ${n(N)} = ${n(x)}. No single speed fits both noisy readings exactly; this one comes closest.` },
   { prompt: `Multiply the column ${vec(g)} by the estimate ${n(x)}. Enter the clean reading of sensor 1, then of sensor 2.`, answer: [cl[0], cl[1]], explanation: `${n(x)} × ${vec(g)} = ${vec(cl)}, the point on the line of A closest to y = ${vec(y)}. AL changed y, so AL is not the identity.` }
  ] }; }
});

/* ---- q54 Incidence matrices and flow ---- */
/* Parent: a path A→B→C. Here the three arrows close a loop, so every node both receives and sends. */
practice({ id: 'q54b', parent: 'q54', kind: 'setting',
 title: 'Settling up the flat',
 brief: 'Three flatmates pay each other in a circle, and each wants to know where the evening leaves them.',
 labels: ['Ana net inflow ($)', 'Ben net inflow ($)', 'Cal net inflow ($)'], tolerance: 0.01 },
 [['Ana net inflow ($)'], ['Ben net inflow ($)', 'Cal net inflow ($)'], ['sum of the three']], {
 canonical: { f: [40, 25, 10] },
 draw: R => { let f; do { f = [5 * R.int(1, 12), 5 * R.int(1, 12), 5 * R.int(1, 12)]; } while (f[0] === f[1] || f[1] === f[2] || f[0] === f[2]); return { f }; },
 build: ({ f }) => { const net = [f[2] - f[0], f[0] - f[1], f[1] - f[2]]; return {
  prompt: `Three flatmates settle up in one evening. Ana sends Ben $${n(f[0])}. Ben sends Cal $${n(f[1])}. Cal sends Ana $${n(f[2])}. Treat each payment as a flow along an arrow from the sender to the receiver. Enter each person's net inflow, which is money received minus money sent: Ana, then Ben, then Cal.`,
  answer: net,
  hints: ['Money received counts as plus and money sent counts as minus. Ana receives from Cal and sends to Ben.', 'The three net inflows must add up to 0, because every dollar sent is a dollar received by someone else.'],
  solution: `Ana receives ${n(f[2])} and sends ${n(f[0])}: ${n(f[2])} − ${n(f[0])} = ${n(net[0])}. Ben receives ${n(f[0])} and sends ${n(f[1])}: ${n(f[0])} − ${n(f[1])} = ${n(net[1])}. Cal receives ${n(f[1])} and sends ${n(f[2])}: ${n(f[1])} − ${n(f[2])} = ${n(net[2])}. Check: ${n(net[0])} + ${par(net[1])} + ${par(net[2])} = 0.`,
  guidance: [
   { prompt: `Ana is the receiver of Cal's $${n(f[2])} (sign +1) and the sender of $${n(f[0])} to Ben (sign −1). What is Ana's net inflow?`, answer: [net[0]], explanation: `${n(f[2])} − ${n(f[0])} = ${n(net[0])}. A negative number means Ana ends the evening with less money.` },
   { prompt: `Ben receives $${n(f[0])} and sends $${n(f[1])}. Cal receives $${n(f[1])} and sends $${n(f[2])}. Enter Ben's net inflow, then Cal's.`, answer: [net[1], net[2]], explanation: `Ben: ${n(f[0])} − ${n(f[1])} = ${n(net[1])}. Cal: ${n(f[1])} − ${n(f[2])} = ${n(net[2])}.` },
   { prompt: `Add the three net inflows: ${n(net[0])} + ${par(net[1])} + ${par(net[2])}. What is the sum?`, answer: [0], explanation: 'Each payment counts −1 for its sender and +1 for its receiver, so the totals cancel to 0. If your three numbers do not add to 0, one sign is wrong.' }
  ] }; }
});

/* A node with zero net inflow gives an equation for the one unknown flow; then the town is fed by two pipes. */
practice({ id: 'q54c', parent: 'q54', kind: 'applied',
 title: 'The junction keeps nothing',
 brief: 'One pipe of the water network has no meter, and the hub must still account for every litre.',
 labels: ['J→F flow', 'R net inflow', 'F net inflow', 'T net inflow'], tolerance: 0.01 },
 [['J→F flow'], ['R net inflow', 'F net inflow'], ['T net inflow', 'sum of all four']], {
 canonical: { f1: 12, f2: 5, f4: 3 },
 draw: R => { const f2 = R.int(3, 9), f3 = R.int(4, 9); return { f1: f2 + f3, f2, f4: R.int(1, f3 - 1) }; },
 build: ({ f1, f2, f4 }) => { const f3 = f1 - f2, nF = f3 - f4, nT = f2 + f4; return {
  prompt: `A water network has four nodes: reservoir R, junction J, farm F and town T. Its pipes carry these flows in litres per second: R→J carries ${n(f1)}, J→T carries ${n(f2)}, F→T carries ${n(f4)}, and J→F has no meter. The junction stores nothing, so its net inflow is 0. Enter the flow on J→F. Then enter the net inflows at R, at F and at T.`,
  answer: [f3, -f1, nF, nT],
  hints: ['At the junction, what flows in equals what flows out. One pipe flows in and two flow out.', 'A node\'s net inflow is the flows arriving minus the flows leaving. The town has two pipes arriving.'],
  solution: `Junction: ${n(f1)} flows in and ${n(f2)} plus the J→F flow leave, so the J→F flow is ${n(f1)} − ${n(f2)} = ${n(f3)}. R only sends ${n(f1)}: net inflow ${n(-f1)}. F receives ${n(f3)} and sends ${n(f4)}: ${n(f3)} − ${n(f4)} = ${n(nF)}. T receives ${n(f2)} and ${n(f4)}: ${n(nT)}. Check: ${n(-f1)} + 0 + ${n(nF)} + ${n(nT)} = 0.`,
  guidance: [
   { prompt: `At J, ${n(f1)} litres per second arrive from R and ${n(f2)} leave towards T. The rest leaves towards F, because J keeps nothing. What is the flow on J→F?`, answer: [f3], explanation: `Net inflow at J is ${n(f1)} − ${n(f2)} − flow = 0, so the flow is ${n(f3)}.` },
   { prompt: `R only sends ${n(f1)} along R→J. F receives ${n(f3)} from J and sends ${n(f4)} to T. Enter the net inflow at R, then at F.`, answer: [-f1, nF], explanation: `R is the source of its pipe, so its sign is −1: ${n(-f1)}. F: ${n(f3)} − ${n(f4)} = ${n(nF)}.` },
   { prompt: `T receives ${n(f2)} from J and ${n(f4)} from F and sends nothing. Enter the net inflow at T. Then add the net inflows of all four nodes and enter the sum.`, answer: [nT, 0], explanation: `T: ${n(f2)} + ${n(f4)} = ${n(nT)}. Sum: ${n(-f1)} + 0 + ${n(nF)} + ${n(nT)} = 0, as it must be for any incidence matrix.` }
  ] }; }
});

/* Challenge with q11: the net inflows are known and the flows are the unknowns. Link 2 is listed C→B, so its flow
   is negative whenever packets really run from B to C. */
practice({ id: 'q54d', parent: 'q54', kind: 'challenge', uses: 'q11',
 title: 'Flows from the relay log',
 brief: 'The hub logged what each relay gained or lost, and the link flows have to be worked back from that.',
 labels: ['link 1 flow', 'link 2 flow', 'link 3 flow', 'C net inflow'], tolerance: 0.01 },
 [['link 1 flow'], ['link 2 flow'], ['link 3 flow', 'C net inflow']], {
 canonical: { nA: -9, nB: 5, nD: 3 },
 draw: R => { const f1 = R.int(3, 12), f2 = R.nz(-8, 8), f3 = R.int(1, 8); return { nA: -f1, nB: f1 + f2, nD: f3 }; },
 build: ({ nA, nB, nD }) => { const f1 = -nA, f2 = nB - f1, f3 = nD, nC = -f2 - f3; return {
  prompt: `The hub logs the net inflow (packets in minus packets out, each second) at four relays joined by three links. The links are listed with these directions: link 1 is A→B, link 2 is C→B, link 3 is C→D. A flow is positive when it runs along the listed direction and negative when it runs against it. The log shows net inflow ${n(nA)} at A, ${n(nB)} at B and ${n(nD)} at D. Enter the flows on link 1, link 2 and link 3, then the net inflow at C.`,
  answer: [f1, f2, f3, nC],
  hints: ['Start at a relay that touches only one link. A is the source of link 1, so its net inflow is minus that flow.', 'B is the destination of both link 1 and link 2, so their two flows add up to the net inflow at B. C is the source of links 2 and 3.'],
  solution: `A is the source of link 1: −f₁ = ${n(nA)}, so f₁ = ${n(f1)}. B is the destination of links 1 and 2: f₁ + f₂ = ${n(nB)}, so f₂ = ${n(nB)} − ${n(f1)} = ${n(f2)}${f2 < 0 ? ' (packets really run from B to C)' : ''}. D is the destination of link 3: f₃ = ${n(f3)}. C is the source of links 2 and 3: net inflow −f₂ − f₃ = ${n(-f2)} − ${n(f3)} = ${n(nC)}. Check: ${n(nA)} + ${par(nB)} + ${par(nC)} + ${n(nD)} = 0.`,
  guidance: [
   { prompt: `A touches only link 1 and is its source, so the net inflow at A is −f₁. The log says ${n(nA)}. What is the flow on link 1?`, answer: [f1], explanation: `−f₁ = ${n(nA)}, so f₁ = ${n(f1)}.` },
   { prompt: `B is the destination of link 1 and of link 2, so f₁ + f₂ = ${n(nB)}. With f₁ = ${n(f1)}, what is the flow on link 2?`, answer: [f2], explanation: `f₂ = ${n(nB)} − ${n(f1)} = ${n(f2)}. ${f2 < 0 ? 'The minus sign means packets run against the listed direction, from B to C.' : 'It is positive, so packets run along the listed direction, from C to B.'}` },
   { prompt: `D touches only link 3 and is its destination, so f₃ is the net inflow at D. C is the source of links 2 and 3, so its net inflow is −f₂ − f₃. Enter the flow on link 3, then the net inflow at C.`, answer: [f3, nC], explanation: `f₃ = ${n(f3)}. At C: ${n(-f2)} − ${n(f3)} = ${n(nC)}. The four net inflows add to 0.` }
  ] }; }
});

/* ---- q55 Discrete Fourier transform and FFT ---- */
/* Parent: the samples (1, 0, −1, 0). Here the second and fourth samples are equal, which keeps the result real, and
   X₀ is tied to the average. x0 differs from x2, so X₁ is not 0; the sum is a multiple of 4. */
practice({ id: 'q55b', parent: 'q55', kind: 'setting',
 title: 'Four pixels in a row',
 brief: 'A picture is checked one row at a time, and the forge wants this row split into its frequency parts.',
 labels: ['X0', 'average brightness', 'X1', 'X2'], tolerance: 0.01 },
 [['X0', 'average brightness'], ['X1'], ['X2']], {
 canonical: { x0: 7, s: 2, x2: 5 },
 draw: R => { let p; do { p = { x0: R.int(0, 9), s: R.int(1, 9), x2: R.int(0, 9) }; } while (p.x0 === p.x2 || (p.x0 + p.x2 + 2 * p.s) % 4 !== 0 || p.x0 + p.x2 === 2 * p.s); return p; },
 build: ({ x0, s, x2 }) => { const X0 = x0 + x2 + 2 * s, X1 = x0 - x2, X2 = x0 + x2 - 2 * s, si = tm(s, 'i'); return {
  prompt: `One row of a picture has four pixels with brightness ${vec([x0, s, x2, s])}. Take the unnormalized four-point DFT of the row (unnormalized means nothing is divided by 4). The second and fourth pixels are equal, so every imaginary part is zero. Enter X₀, then the average brightness X₀/4, then X₁, then X₂. (X₃ equals X₁ for this row.)`,
  answer: [X0, X0 / 4, X1, X2],
  hints: ['X₀ is the plain sum of the four pixels. For X₁ the four pixels are multiplied in turn by 1, −i, −1 and i; the two i terms cancel here because those pixels are equal.', 'For X₂ the four pixels are multiplied in turn by 1, −1, 1 and −1.'],
  solution: `X₀ = ${n(x0)} + ${n(s)} + ${n(x2)} + ${n(s)} = ${n(X0)}, so the average brightness is ${n(X0)} ÷ 4 = ${n(X0 / 4)}. X₁ uses the factors 1, −i, −1, i: ${n(x0)} − ${si} − ${n(x2)} + ${si} = ${n(X1)}. X₂ uses the factors 1, −1, 1, −1: ${n(x0)} − ${n(s)} + ${n(x2)} − ${n(s)} = ${n(X2)}. X₃ uses 1, i, −1, −i and is also ${n(X1)}.`,
  guidance: [
   { prompt: `Add the four pixels: ${n(x0)} + ${n(s)} + ${n(x2)} + ${n(s)}. Enter X₀, then divide it by 4 for the average brightness.`, answer: [X0, X0 / 4], explanation: `X₀ = ${n(X0)} and ${n(X0)} ÷ 4 = ${n(X0 / 4)}. X₀ is 4 times the average because the DFT is not normalized.` },
   { prompt: `For X₁ multiply the pixels by 1, −i, −1, i and add: ${n(x0)} − ${si} − ${n(x2)} + ${si}. What is X₁?`, answer: [X1], explanation: `The i terms cancel, leaving ${n(x0)} − ${n(x2)} = ${n(X1)}.` },
   { prompt: `For X₂ multiply the pixels by 1, −1, 1, −1 and add: ${n(x0)} − ${n(s)} + ${n(x2)} − ${n(s)}. What is X₂?`, answer: [X2], explanation: `${n(x0 + x2)} − ${n(2 * s)} = ${n(X2)}. X₂ measures how much the row flips between neighbouring pixels.` }
  ] }; }
});

/* The FFT split from the lesson, done by hand: two two-point DFTs (the lesson's worked example), then the combine
   step, which the prompt states. x1 differs from x3, so the imaginary part is not 0 and its sign matters. */
practice({ id: 'q55c', parent: 'q55', kind: 'applied',
 title: 'A year of sales, split in two',
 brief: 'A shop wants its four quarterly sales figures turned into a total, a swing and a flip, the fast way.',
 labels: ['X0', 'X2', 'real part of X1', 'imaginary part of X1'], tolerance: 0.01 },
 [['even sum', 'even difference'], ['odd sum', 'odd difference'], ['X0', 'X2', 'real part of X1', 'imaginary part of X1']], {
 canonical: { x: [8, 3, 2, 6] },
 draw: R => { let x; do { x = [R.int(1, 12), R.int(1, 12), R.int(1, 12), R.int(1, 12)]; } while (x[0] === x[2] || x[1] === x[3] || x[0] + x[2] === x[1] + x[3]); return { x }; },
 build: ({ x }) => { const E0 = x[0] + x[2], E1 = x[0] - x[2], O0 = x[1] + x[3], O1 = x[1] - x[3]; return {
  prompt: `A shop's sales in the four quarters of a year were ${vec(x)}, in thousands of dollars. Find the unnormalized four-point DFT the FFT way. Number the samples 0, 1, 2, 3 and split them into the even pair (samples 0 and 2) and the odd pair (samples 1 and 3). Take the two-point DFT of each pair: its sum, and its difference (first minus second). Then combine: X₀ = even sum + odd sum, X₂ = even sum − odd sum, and X₁ = even difference − i × odd difference. Enter X₀, then X₂, then the real part and the imaginary part of X₁.`,
  answer: [E0 + O0, E0 - O0, E1, -O1],
  hints: ['Numbering from 0, the even pair is the first and third numbers of the list and the odd pair is the second and fourth.', 'In X₁ the odd difference is multiplied by −i, so the imaginary part of X₁ is minus the odd difference.'],
  solution: `Even pair ${vec([x[0], x[2]])}: sum ${n(E0)}, difference ${n(E1)}. Odd pair ${vec([x[1], x[3]])}: sum ${n(O0)}, difference ${n(O1)}. X₀ = ${n(E0)} + ${n(O0)} = ${n(E0 + O0)}, the total for the year. X₂ = ${n(E0)} − ${n(O0)} = ${n(E0 - O0)}. X₁ = ${n(E1)} − i × ${par(O1)} = ${cx(E1, -O1)}, so its real part is ${n(E1)} and its imaginary part is ${n(-O1)}.`,
  guidance: [
   { prompt: `The even pair is ${vec([x[0], x[2]])}. Enter its sum, then its difference (first minus second).`, answer: [E0, E1], explanation: `${n(x[0])} + ${n(x[2])} = ${n(E0)} and ${n(x[0])} − ${n(x[2])} = ${n(E1)}. This is the two-point DFT of the even samples.` },
   { prompt: `The odd pair is ${vec([x[1], x[3]])}. Enter its sum, then its difference (first minus second).`, answer: [O0, O1], explanation: `${n(x[1])} + ${n(x[3])} = ${n(O0)} and ${n(x[1])} − ${n(x[3])} = ${n(O1)}.` },
   { prompt: `Combine: X₀ = ${n(E0)} + ${n(O0)}, X₂ = ${n(E0)} − ${n(O0)}, and X₁ = ${n(E1)} − i × ${par(O1)}. Enter X₀, then X₂, then the real part and the imaginary part of X₁.`, answer: [E0 + O0, E0 - O0, E1, -O1], explanation: `X₀ = ${n(E0 + O0)} and X₂ = ${n(E0 - O0)}. X₁ = ${cx(E1, -O1)}: real part ${n(E1)}, imaginary part ${n(-O1)}. The FFT reached the same numbers as the full formula with fewer multiplications.` }
  ] }; }
});

/* Challenge with q11: the transform is known and the samples are the unknowns. Sums and differences give pairs of
   small equations. Both parts of X₁ are non-zero. */
practice({ id: 'q55d', parent: 'q55', kind: 'challenge', uses: 'q11',
 title: 'Only the spectrum arrived',
 brief: 'A beacon\'s four samples were lost in transit, but their transform got through and the forge must rebuild them.',
 labels: ['x0', 'x1', 'x2', 'x3'], tolerance: 0.01 },
 [['x0 + x2', 'x1 + x3'], ['x0', 'x2'], ['x1', 'x3']], {
 canonical: { X0: 12, X2: 4, re1: 4, im1: 2 },
 draw: R => { let x; do { x = [R.int(-4, 9), R.int(-4, 9), R.int(-4, 9), R.int(-4, 9)]; } while (x[0] === x[2] || x[1] === x[3] || x[0] + x[2] === x[1] + x[3]);
  return { X0: x[0] + x[1] + x[2] + x[3], X2: x[0] - x[1] + x[2] - x[3], re1: x[0] - x[2], im1: x[3] - x[1] }; },
 build: ({ X0, X2, re1, im1 }) => { const A = (X0 + X2) / 2, B = (X0 - X2) / 2, Q = -im1, x = [(A + re1) / 2, (B + Q) / 2, (A - re1) / 2, (B - Q) / 2]; return {
  prompt: `A beacon sent four real samples x = (x₀, x₁, x₂, x₃), but only their unnormalized four-point DFT arrived: X₀ = ${n(X0)}, X₁ = ${cx(re1, im1)}, X₂ = ${n(X2)}, X₃ = ${cx(re1, -im1)}. Rebuild the samples from what each value means: X₀ = x₀ + x₁ + x₂ + x₃, X₂ = x₀ − x₁ + x₂ − x₃, and X₁ = (x₀ − x₂) − i(x₁ − x₃). Enter x₀, x₁, x₂, x₃.`,
  answer: x,
  hints: ['Add X₀ and X₂: the odd samples cancel and you get twice x₀ + x₂. Subtract X₂ from X₀ to get twice x₁ + x₃.', 'The real part of X₁ is x₀ − x₂. The imaginary part of X₁ is minus (x₁ − x₃). A sum and a difference of two numbers fix both of them.'],
  solution: `X₀ + X₂ = ${n(X0)} + ${par(X2)} = ${n(X0 + X2)} = 2(x₀ + x₂), so x₀ + x₂ = ${n(A)}. X₀ − X₂ = ${n(X0 - X2)} = 2(x₁ + x₃), so x₁ + x₃ = ${n(B)}. The real part of X₁ gives x₀ − x₂ = ${n(re1)}, so x₀ = (${n(A)} + ${par(re1)}) ÷ 2 = ${n(x[0])} and x₂ = ${n(A)} − ${par(x[0])} = ${n(x[2])}. The imaginary part of X₁ is ${n(im1)} = −(x₁ − x₃), so x₁ − x₃ = ${n(Q)}, x₁ = (${n(B)} + ${par(Q)}) ÷ 2 = ${n(x[1])} and x₃ = ${n(B)} − ${par(x[1])} = ${n(x[3])}. The samples are ${vec(x)}.`,
  guidance: [
   { prompt: `X₀ + X₂ is twice x₀ + x₂, and X₀ − X₂ is twice x₁ + x₃. With X₀ = ${n(X0)} and X₂ = ${n(X2)}, enter x₀ + x₂, then x₁ + x₃.`, answer: [A, B], explanation: `(${n(X0)} + ${par(X2)}) ÷ 2 = ${n(A)} and (${n(X0)} − ${par(X2)}) ÷ 2 = ${n(B)}.` },
   { prompt: `The real part of X₁ is x₀ − x₂ = ${n(re1)}, and x₀ + x₂ = ${n(A)}. Solve the pair. Enter x₀, then x₂.`, answer: [x[0], x[2]], explanation: `Adding the two equations gives 2x₀ = ${n(A + re1)}, so x₀ = ${n(x[0])} and x₂ = ${n(A)} − ${par(x[0])} = ${n(x[2])}.` },
   { prompt: `The imaginary part of X₁ is ${n(im1)}, and it equals −(x₁ − x₃), so x₁ − x₃ = ${n(Q)}. Also x₁ + x₃ = ${n(B)}. Enter x₁, then x₃.`, answer: [x[1], x[3]], explanation: `Adding the two equations gives 2x₁ = ${n(B + Q)}, so x₁ = ${n(x[1])} and x₃ = ${n(B)} − ${par(x[1])} = ${n(x[3])}.` }
  ] }; }
});

})();
