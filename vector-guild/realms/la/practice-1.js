/* Linear algebra practice missions, file 1 of 14: concepts q01–q05, three practice missions each
   (q01b q01c q01d ... q05b q05c q05d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p1.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- q01 Vector addition ---- */
/* The worked sample for every author (docs/PACK-FORMAT.md, "Linear algebra practice"). The parent q01 adds two thruster
   impulses; this one moves to the cargo arm and adds two moves in metres. Three answer boxes, one per component, each
   with its own label, in the order the prompt names them. */
add({
 id: 'q01b', parent: 'q01', kind: 'setting',
 title: 'Cargo arm, two moves',
 brief: 'The cargo arm carries a supply pod to its rack in two moves, and the log needs the total move.',
 prompt: 'The cargo arm moves a supply pod twice. Each move lists metres along x, y and z. Move one is (4, −2, 1) m. Move two is (−1, 5, 3) m. Enter the total move: x, then y, then z.',
 answer: [3, 3, 4], labels: ['total x', 'total y', 'total z'], tolerance: 0.01,
 hints: [
  'Work on one axis at a time. Add the two x numbers, then the two y numbers, then the two z numbers.',
  'A minus sign means a move the other way along that axis. The x numbers are 4 and −1.'
 ],
 solution: 'x: 4−1 = 3. y: −2+5 = 3. z: 1+3 = 4. The total move is (3, 3, 4) m.',
 guidance: [
  { prompt: 'Add the two x numbers: 4 + (−1). What is the total move along x?', answer: [3], labels: ['total x'], explanation: 'Both numbers are moves along x, so they add: 4−1 = 3 m.' },
  { prompt: 'Now add the y numbers, −2 + 5, and the z numbers, 1 + 3. What are the total moves along y and z?', answer: [3, 4], labels: ['total y', 'total z'], explanation: 'Along y the total is −2+5 = 3 m, and along z it is 1+3 = 4 m. Keep the order x, y, z.' }
 ]
}, {
 /* Not the numbers of the q01 worked example ((2,1,−3) and (4,−2,1)), which is shown above this mission as "Review the lesson". */
 canonical: { a: [4, -2, 1], b: [-1, 5, 3] },
 /* No zero component, so every axis has something to add; at least one negative, so signs matter. */
 draw: R => { let p; do { p = { a: [R.nz(-9, 9), R.nz(-9, 9), R.nz(-9, 9)], b: [R.nz(-9, 9), R.nz(-9, 9), R.nz(-9, 9)] }; } while (![...p.a, ...p.b].some(x => x < 0) || (p.a[0] === 2 && p.a[1] === 1 && p.a[2] === -3)); return p; },
 build: ({ a, b }) => { const s = a.map((x, i) => x + b[i]), k = Math.max(0, a.findIndex((x, i) => x < 0 || b[i] < 0)); return {
  prompt: `The cargo arm moves a supply pod twice. Each move lists metres along x, y and z. Move one is ${vec(a)} m. Move two is ${vec(b)} m. Enter the total move: x, then y, then z.`,
  answer: s,
  hints: ['Work on one axis at a time. Add the two x numbers, then the two y numbers, then the two z numbers.', `A minus sign means a move the other way along that axis. The ${'xyz'[k]} numbers are ${n(a[k])} and ${n(b[k])}.`],
  solution: `x: ${n(a[0])}${plus(b[0])} = ${n(s[0])}. y: ${n(a[1])}${plus(b[1])} = ${n(s[1])}. z: ${n(a[2])}${plus(b[2])} = ${n(s[2])}. The total move is ${vec(s)} m.`,
  guidance: [
   { prompt: `Add the two x numbers: ${n(a[0])} + ${par(b[0])}. What is the total move along x?`, answer: [s[0]], explanation: `Both numbers are moves along x, so they add: ${n(a[0])}${plus(b[0])} = ${n(s[0])} m.` },
   { prompt: `Now add the y numbers, ${n(a[1])} + ${par(b[1])}, and the z numbers, ${n(a[2])} + ${par(b[2])}. What are the total moves along y and z?`, answer: [s[1], s[2]], explanation: `Along y the total is ${n(a[1])}${plus(b[1])} = ${n(s[1])} m, and along z it is ${n(a[2])}${plus(b[2])} = ${n(s[2])} m. Keep the order x, y, z.` }
  ] }; }
});

/* Helpers for the missions below. */
const addV = (a, b) => a.map((x, i) => x + b[i]);
const dotV = (a, b) => a.reduce((t, x, i) => t + x * b[i], 0);
/* "+ 0" turns the −0 that JavaScript makes from 0·(−3) into a plain 0. */
const crossV = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]].map(x => x + 0);
/* "4·3 + (−2)·1 + 1·2": a dot product written out. */
const dotText = (a, b) => a.map((x, i) => `${par(x)}·${par(b[i])}`).join(' + ');
/* "2+(−3)+5": a sum written out. */
const sumText = xs => xs.map((x, i) => i ? par(x) : n(x)).join(' + ');
/* "2√3", "−√3", "4": the number c·√r for r = 3 or r = 1. */
const rt = (c, r) => r === 1 || c === 0 ? n(c) : (c === 1 ? '' : c === -1 ? '−' : n(c)) + '√' + r;
const T = G.tidy;

/* q01c: a stock list. Three lists to add (opening stock, delivery, sales), in two stages. */
practice({ id: 'q01c', parent: 'q01', kind: 'applied',
 title: 'The café stock list',
 brief: 'A café counts three kinds of stock, and the closing count must follow from the day\'s delivery and sales.',
 labels: ['coffee', 'milk', 'sugar'], tolerance: 0.01 },
 [['coffee change', 'milk change', 'sugar change'], ['coffee', 'milk', 'sugar']], {
 canonical: { S: [24, 30, 12], D: [10, 6, 4], O: [-7, -11, -3] },
 /* Sales never empty a shelf (the smallest closing count is 12 + 2 − 12 = 2). At least one item ends the day lower
    and one higher, so the signs of the net change matter. */
 draw: R => { let p, N; do { p = { S: [R.int(12, 40), R.int(12, 40), R.int(12, 40)], D: [R.int(2, 15), R.int(2, 15), R.int(2, 15)], O: [-R.int(3, 12), -R.int(3, 12), -R.int(3, 12)] }; N = addV(p.D, p.O); } while (!N.some(x => x < 0) || !N.some(x => x > 0)); return p; },
 build: ({ S, D, O }) => { const N = addV(D, O), C = addV(S, N); return {
  prompt: `A café keeps its stock as one list, in the order (coffee, milk, sugar), counted in packs. The opening stock is ${vec(S)}. A delivery changes it by ${vec(D)}. The day's sales change it by ${vec(O)}. Enter the closing stock: coffee, then milk, then sugar.`,
  answer: C,
  hints: ['Keep the three items apart. Coffee numbers only ever add to coffee numbers.', `A minus sign is stock going out. For coffee you add three numbers: ${n(S[0])}, ${n(D[0])} and ${n(O[0])}.`],
  solution: `Net change of the day: (${n(D[0])}${plus(O[0])}, ${n(D[1])}${plus(O[1])}, ${n(D[2])}${plus(O[2])}) = ${vec(N)}. Closing stock: (${n(S[0])}${plus(N[0])}, ${n(S[1])}${plus(N[1])}, ${n(S[2])}${plus(N[2])}) = ${vec(C)} packs.`,
  guidance: [
   { prompt: `First join the two changes. Add the delivery ${vec(D)} and the sales ${vec(O)}, item by item. Enter the net change: coffee, then milk, then sugar.`, answer: N, explanation: `Coffee: ${n(D[0])}${plus(O[0])} = ${n(N[0])}. Milk: ${n(D[1])}${plus(O[1])} = ${n(N[1])}. Sugar: ${n(D[2])}${plus(O[2])} = ${n(N[2])}. A minus result means that shelf ends the day lower.` },
   { prompt: `Now add the net change ${vec(N)} to the opening stock ${vec(S)}. Enter the closing stock: coffee, then milk, then sugar.`, answer: C, explanation: `Coffee: ${n(S[0])}${plus(N[0])} = ${n(C[0])}. Milk: ${n(S[1])}${plus(N[1])} = ${n(C[1])}. Sugar: ${n(S[2])}${plus(N[2])} = ${n(C[2])}.` }
  ] }; }
});

/* q01d: the missing move. Tide + wind + paddling = the trip wanted; the paddling is the unknown. */
practice({ id: 'q01d', parent: 'q01', kind: 'challenge',
 title: 'Kayak against the tide',
 brief: 'Tide and wind will push a kayak off its line, and the paddler needs the move that makes up the difference.',
 labels: ['paddle east', 'paddle north'], tolerance: 0.01 },
 [['drift east', 'drift north'], ['paddle east'], ['paddle north']], {
 canonical: { tide: [2, -3], wind: [-1, 1], target: [5, 4] },
 /* The drift is never 0 on an axis, so the paddling is never just the target; the paddling is never 0 on an axis. */
 draw: R => { for (;;) { const p = { tide: [R.nz(-4, 4), R.nz(-4, 4)], wind: [R.nz(-3, 3), R.nz(-3, 3)], target: [R.nz(-9, 9), R.nz(-9, 9)] }, d = addV(p.tide, p.wind);
  if (d.every((x, i) => x !== 0 && p.target[i] - x !== 0)) return p; } },
 build: ({ tide, wind, target }) => { const d = addV(tide, wind), m = target.map((x, i) => x - d[i]); return {
  prompt: `You paddle a kayak across a bay. Every move is written (km east, km north), and a minus number means west or south. Over the afternoon the tide alone would carry you ${vec(tide)} and the wind alone ${vec(wind)}. You want to end the afternoon ${vec(target)} from where you start. Enter the move your paddling must add: km east, then km north.`,
  answer: m,
  hints: ['Three moves add up to the trip: tide, wind and paddling. Add the two you know first. That sum is the drift.', `Then work on east alone. The drift east plus your paddling east must come to ${n(target[0])}.`],
  solution: `Drift = tide + wind = (${n(tide[0])}${plus(wind[0])}, ${n(tide[1])}${plus(wind[1])}) = ${vec(d)}. East: ${n(d[0])} plus the paddling must be ${n(target[0])}, so the paddling is ${n(m[0])}. North: ${n(d[1])} plus the paddling must be ${n(target[1])}, so the paddling is ${n(m[1])}. Check: ${vec(d)} + ${vec(m)} = ${vec(target)}.`,
  guidance: [
   { prompt: `Add the tide ${vec(tide)} and the wind ${vec(wind)}. Enter the drift: km east, then km north.`, answer: d, explanation: `East: ${n(tide[0])}${plus(wind[0])} = ${n(d[0])}. North: ${n(tide[1])}${plus(wind[1])} = ${n(d[1])}. This is where you would end up without paddling.` },
   { prompt: `East: the drift is ${n(d[0])} and the trip must total ${n(target[0])}. Which number added to ${n(d[0])} gives ${n(target[0])}?`, answer: [m[0]], explanation: `${n(d[0])}${plus(m[0])} = ${n(target[0])}, so the east number of your paddling is ${n(m[0])}.` },
   { prompt: `North: the drift is ${n(d[1])} and the trip must total ${n(target[1])}. Which number added to ${n(d[1])} gives ${n(target[1])}?`, answer: [m[1]], explanation: `${n(d[1])}${plus(m[1])} = ${n(target[1])}, so the north number of your paddling is ${n(m[1])}. A minus number would mean paddling west or south.` }
  ] }; }
});

/* ---- q02 Norm and unit vectors ---- */
/* q02b: a two-number move on a sea chart (the parent has three numbers with a 0). A 3–4–5 triangle scaled by k, or,
   one time in three, a 7–24–25 triangle (unit parts 0.28 and 0.96), so the unit direction is not always 0.6 and 0.8. */
practice({ id: 'q02b', parent: 'q02', kind: 'setting',
 title: 'Ferry on the chart',
 brief: 'A ferry has left harbour on a straight course, and the chart needs its distance and its direction.',
 labels: ['distance', 'unit east', 'unit north'], tolerance: 0.004 },
 [['sum of squares'], ['distance'], ['unit east', 'unit north']], {
 canonical: { v: [-12, 9] },
 draw: R => { const big = R.int(0, 2) === 0, k = big ? R.pick([1, 2, 4]) : R.pick([2, 3, 4, 5, 6, 10]), base = big ? [7, 24] : [3, 4], legs = R.bool() ? base : [base[1], base[0]]; return { v: legs.map(x => x * k * (R.bool() ? 1 : -1)) }; },
 build: ({ v }) => { const sq = v.map(x => x * x), S = sq[0] + sq[1], L = T(Math.sqrt(S)), u = v.map(x => T(x / L)); return {
  prompt: `A ferry leaves harbour and sails in a straight line. On the chart its move is ${vec(v)} km, written (east, north); a minus number means west or south. Enter the straight-line distance sailed in km. Then enter the unit direction, which is the same arrow shrunk to length 1: east part, then north part.`,
  answer: [L, u[0], u[1]],
  hints: ['Square each number of the move, add the two squares, then take the square root. A square is never negative.', 'For the unit direction, divide each number of the move by the distance. Each part keeps its sign.'],
  solution: `Squares: ${par(v[0])}² + ${par(v[1])}² = ${n(sq[0])} + ${n(sq[1])} = ${n(S)}. Distance: √${n(S)} = ${n(L)} km. Unit direction: (${n(v[0])}/${n(L)}, ${n(v[1])}/${n(L)}) = ${vec(u)}, with no unit.`,
  guidance: [
   { prompt: `Square both numbers of ${vec(v)} and add the squares. What is the sum?`, answer: [S], explanation: `${par(v[0])}² + ${par(v[1])}² = ${n(sq[0])} + ${n(sq[1])} = ${n(S)}. Squaring removes the minus signs, so west and south cannot cancel east and north.` },
   { prompt: `Take the square root of ${n(S)}. How many km did the ferry sail?`, answer: [L], explanation: `${n(L)}·${n(L)} = ${n(S)}, so √${n(S)} = ${n(L)} km.` },
   { prompt: `Divide each number of ${vec(v)} by ${n(L)}. Enter the unit direction: east part, then north part.`, answer: u, explanation: `${n(v[0])}/${n(L)} = ${n(u[0])} and ${n(v[1])}/${n(L)} = ${n(u[1])}. Divide by the distance itself, not by its square.` }
  ] }; }
});

/* q02c: a length with three non-zero numbers (whole-number lengths such as (2, 3, 6) → 7), then a cost. */
practice({ id: 'q02c', parent: 'q02', kind: 'applied',
 title: 'Fibre between two roofs',
 brief: 'An installer must order one straight cable between two rooftops and wants its length and its price.',
 labels: ['cable length', 'cost'], tolerance: 0.01 },
 [['sum of squares'], ['cable length'], ['cost']], {
 canonical: { d: [6, -3, 2], price: 8 },
 /* Every base list has a whole-number length (3, 7, 9, 9, 11, 13, 11, 6, 12, 14, 15). The order and the signs are free. */
 draw: R => { const base = R.pick([[1, 2, 2], [2, 3, 6], [1, 4, 8], [4, 4, 7], [2, 6, 9], [3, 4, 12], [6, 6, 7], [2, 4, 4], [4, 8, 8], [4, 6, 12], [5, 10, 10]]).slice(), d = [];
  while (base.length) d.push(base.splice(R.int(0, base.length - 1), 1)[0] * (R.bool() ? 1 : -1));
  return { d, price: R.pick([4, 5, 6, 8, 12]) }; },
 build: ({ d, price }) => { const sq = d.map(x => x * x), S = sq[0] + sq[1] + sq[2], L = T(Math.sqrt(S)), cost = L * price; return {
  prompt: `An installer runs one straight fibre cable from a rooftop to a second rooftop. From the first roof to the second the move is ${vec(d)} m, written (east, north, up); a minus number means west, south or down. The cable costs $${n(price)} for each metre. Enter the cable length in metres, then the cost of the cable in dollars.`,
  answer: [L, cost],
  hints: ['The cable is the length of the move. Square all three numbers, add the squares, then take the square root.', 'Do not add the three numbers as they stand: that is the walk along east, north and up, not the straight cable. The cost is the length times the price of one metre.'],
  solution: `Squares: ${d.map(x => par(x) + '²').join(' + ')} = ${sq.map(n).join(' + ')} = ${n(S)}. Length: √${n(S)} = ${n(L)} m. Cost: ${n(L)} × ${n(price)} = $${n(cost)}.`,
  guidance: [
   { prompt: `Square the three numbers of ${vec(d)} and add the squares. What is the sum?`, answer: [S], explanation: `${d.map(x => par(x) + '²').join(' + ')} = ${sq.map(n).join(' + ')} = ${n(S)}.` },
   { prompt: `Take the square root of ${n(S)}. How many metres of cable are needed?`, answer: [L], explanation: `${n(L)}·${n(L)} = ${n(S)}, so the cable is ${n(L)} m long.` },
   { prompt: `Each metre costs $${n(price)}. What do ${n(L)} m cost in dollars?`, answer: [cost], explanation: `${n(L)} × ${n(price)} = $${n(cost)}.` }
  ] }; }
});

/* q02d: add two legs (q01), then the length and unit direction of the total. The total is a 3–4–5 triangle scaled by k
   on two axes; the legs cancel on the third axis. */
practice({ id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01',
 title: 'Two legs of a camera drone',
 brief: 'A camera drone has flown two legs, and the pilot must point the aerial straight at it.',
 labels: ['distance', 'unit x', 'unit y', 'unit z'], tolerance: 0.01 },
 [['total x', 'total y', 'total z'], ['sum of squares', 'distance'], ['unit x', 'unit y', 'unit z']], {
 canonical: { a: [8, -5, 6], b: [-2, -3, -6] },
 /* No leg has a 0, and leg one alone is never the total. */
 draw: R => { for (;;) { const k = R.int(1, 3), legs = R.bool() ? [3, 4] : [4, 3], zero = R.int(0, 2), s = []; let j = 0;
  for (let i = 0; i < 3; i++) s.push(i === zero ? 0 : legs[j++] * k * (R.bool() ? 1 : -1));
  const a = [R.nz(-9, 9), R.nz(-9, 9), R.nz(-9, 9)], b = s.map((x, i) => x - a[i]);
  if (b.every(x => x !== 0 && Math.abs(x) <= 12)) return { a, b }; } },
 build: ({ a, b }) => { const s = addV(a, b), sq = s.map(x => x * x), S = sq[0] + sq[1] + sq[2], L = T(Math.sqrt(S)), u = s.map(x => T(x / L)); return {
  prompt: `A camera drone flies two legs from its launch pad. Leg one is ${vec(a)} m and leg two is ${vec(b)} m, each written (x, y, z). Enter how far the drone now is from the pad in metres. Then enter the unit direction from the pad to the drone, which is the total move shrunk to length 1: x, then y, then z.`,
  answer: [L, u[0], u[1], u[2]],
  hints: ['Add the two legs first, axis by axis. The distance is the length of that total move. It is not the two leg lengths added together.', 'Square the three numbers of the total move, add the squares and take the square root. Then divide each number of the total move by that length.'],
  solution: `Total move: (${n(a[0])}${plus(b[0])}, ${n(a[1])}${plus(b[1])}, ${n(a[2])}${plus(b[2])}) = ${vec(s)} m. Squares: ${sq.map(n).join(' + ')} = ${n(S)}, so the distance is √${n(S)} = ${n(L)} m. Unit direction: (${n(s[0])}/${n(L)}, ${n(s[1])}/${n(L)}, ${n(s[2])}/${n(L)}) = ${vec(u)}.`,
  guidance: [
   { prompt: `Add leg one ${vec(a)} and leg two ${vec(b)}, axis by axis. Enter the total move: x, then y, then z.`, answer: s, explanation: `x: ${n(a[0])}${plus(b[0])} = ${n(s[0])}. y: ${n(a[1])}${plus(b[1])} = ${n(s[1])}. z: ${n(a[2])}${plus(b[2])} = ${n(s[2])}. On one axis the two legs cancel.` },
   { prompt: `Square the three numbers of ${vec(s)} and add the squares. Enter that sum, then its square root, which is the distance in metres.`, answer: [S, L], explanation: `${sq.map(n).join(' + ')} = ${n(S)}, and √${n(S)} = ${n(L)} m.` },
   { prompt: `Divide each number of ${vec(s)} by ${n(L)}. Enter the unit direction: x, then y, then z.`, answer: u, explanation: `${n(s[0])}/${n(L)} = ${n(u[0])}, ${n(s[1])}/${n(L)} = ${n(u[1])} and ${n(s[2])}/${n(L)} = ${n(u[2])}. This arrow has length 1 and no unit.` }
  ] }; }
});

/* ---- q03 Dot product ---- */
/* q03b: quantities · prices, with one item handed back (a minus quantity), so one product is negative. */
practice({ id: 'q03b', parent: 'q03', kind: 'setting',
 title: 'The stationery bill',
 brief: 'A shop order mixes new items with one item handed back, and the till needs one amount.',
 labels: ['amount to pay'], tolerance: 0.01 },
 [['notebooks', 'pens', 'folders'], ['amount to pay']], {
 canonical: { q: [3, -2, 4], c: [5, 2, 3] },
 /* Two items bought, one handed back; the three prices differ; the customer still owes money. */
 draw: R => { for (;;) { const q = [R.int(1, 6), R.int(1, 6), R.int(1, 6)], c = [R.int(2, 9), R.int(2, 9), R.int(2, 9)]; q[R.int(0, 2)] = -R.int(1, 3);
  if (new Set(c).size === 3 && dotV(q, c) > 0) return { q, c }; } },
 build: ({ q, c }) => { const p = q.map((x, i) => x * c[i]), W = p[0] + p[1] + p[2]; return {
  prompt: `A shop writes an order as two lists in the same item order: (notebooks, pens, folders). The quantities are ${vec(q)}, where a minus number counts items handed back for a refund. The prices in dollars for one of each are ${vec(c)}. Enter the amount to pay in dollars.`,
  answer: [W],
  hints: ['Multiply each quantity by the price of the same item. That gives three amounts of money.', 'Add the three amounts. The item handed back gives a minus amount, so it lowers the bill.'],
  solution: `Quantities · prices = ${dotText(q, c)} = ${sumText(p)} = ${n(W)}. The amount to pay is $${n(W)}.`,
  guidance: [
   { prompt: `Multiply matching entries of ${vec(q)} and ${vec(c)}. Enter the three amounts: notebooks, then pens, then folders.`, answer: p, explanation: `${q.map((x, i) => `${par(x)}·${par(c[i])} = ${n(p[i])}`).join(', ')}. Each amount pairs a quantity with the price of that same item.` },
   { prompt: `Add the three amounts: ${sumText(p)}. What is the amount to pay in dollars?`, answer: [W], explanation: `${sumText(p)} = ${n(W)}. The result is one number, not a list.` }
  ] }; }
});

/* q03c: one list of points dotted with two season lists, then the two scores compared. */
practice({ id: 'q03c', parent: 'q03', kind: 'applied',
 title: 'Five-a-side season scores',
 brief: 'A five-a-side league turns each player\'s season into one score, and two friends want to know who came out ahead.',
 labels: ['Ana\'s score', 'Ben\'s score', 'Ana minus Ben'], tolerance: 0.01 },
 [['Ana\'s score'], ['Ben\'s score'], ['Ana minus Ben']], {
 canonical: { w: [5, 3, -2], A: [4, 2, 3], B: [2, 5, 1] },
 /* Both players have at least one yellow card, so both scores hold a minus product; the scores differ. */
 draw: R => { for (;;) { const p = { w: [R.int(4, 6), R.int(2, 3), -R.int(1, 3)], A: [R.int(0, 5), R.int(0, 5), R.int(1, 3)], B: [R.int(0, 5), R.int(0, 5), R.int(1, 3)] };
  if (dotV(p.w, p.A) !== dotV(p.w, p.B) && (p.A[0] !== p.B[0] || p.A[1] !== p.B[1])) return p; } },
 build: ({ w, A, B }) => { const pa = w.map((x, i) => x * A[i]), pb = w.map((x, i) => x * B[i]), a = pa[0] + pa[1] + pa[2], b = pb[0] + pb[1] + pb[2], lead = a - b; return {
  prompt: `A five-a-side league scores a season with one list of points, ${vec(w)}, for each (goal, assist, yellow card). An assist is the pass that sets up a goal. Ana's season is ${vec(A)} and Ben's is ${vec(B)}, counted in the same order. A season score is the dot product of the points list with the season list. Enter Ana's score, then Ben's score, then Ana's score minus Ben's score.`,
  answer: [a, b, lead],
  hints: ['For each player, multiply every count by the points in the same place, then add the three results.', 'A yellow card has minus points, so its product is taken away. Finish both scores before you compare them.'],
  solution: `Ana: ${dotText(w, A)} = ${sumText(pa)} = ${n(a)}. Ben: ${dotText(w, B)} = ${sumText(pb)} = ${n(b)}. Ana minus Ben: ${n(a)} − ${par(b)} = ${n(lead)}, so ${lead > 0 ? 'Ana' : 'Ben'} is ahead by ${n(Math.abs(lead))}.`,
  guidance: [
   { prompt: `Ana: multiply matching entries of ${vec(w)} and ${vec(A)}, then add: ${dotText(w, A)}. What is Ana's score?`, answer: [a], explanation: `The products are ${n(pa[0])}, ${n(pa[1])} and ${n(pa[2])}. Their sum is ${n(a)}.` },
   { prompt: `Ben: do the same with ${vec(w)} and ${vec(B)}: ${dotText(w, B)}. What is Ben's score?`, answer: [b], explanation: `The products are ${n(pb[0])}, ${n(pb[1])} and ${n(pb[2])}. Their sum is ${n(b)}.` },
   { prompt: `Take Ben's score from Ana's: ${n(a)} − ${par(b)}. What is Ana's score minus Ben's score?`, answer: [lead], explanation: `${n(a)} − ${par(b)} = ${n(lead)}. ${lead > 0 ? 'A plus result means Ana is ahead.' : 'A minus result means Ben is ahead.'}` }
  ] }; }
});

/* q03d: add two forces (q01), then the work of the total force along a move. */
practice({ id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q01',
 title: 'Two cranes, one container',
 brief: 'Two cranes share one container, and the yard log needs the work they do on it together.',
 labels: ['total force x', 'total force y', 'total force z', 'work'], tolerance: 0.01 },
 [['total force x', 'total force y', 'total force z'], ['x product', 'y product', 'z product'], ['work']], {
 canonical: { F1: [3, -2, 5], F2: [-1, 4, 4], d: [2, 3, 1] },
 /* z is up: both cranes lift and the container rises. Each crane alone does some work, so neither one alone gives
    the answer; no axis of the total force is 0. */
 draw: R => { for (;;) { const p = { F1: [R.nz(-4, 4), R.nz(-4, 4), R.int(2, 6)], F2: [R.nz(-4, 4), R.nz(-4, 4), R.int(2, 6)], d: [R.nz(-3, 3), R.nz(-3, 3), R.int(1, 4)] }, F = addV(p.F1, p.F2);
  if (F.every(x => x !== 0) && dotV(p.F1, p.d) !== 0 && dotV(p.F2, p.d) !== 0) return p; } },
 build: ({ F1, F2, d }) => { const F = addV(F1, F2), p = F.map((x, i) => x * d[i]), W = p[0] + p[1] + p[2], w1 = dotV(F1, d), w2 = dotV(F2, d); return {
  prompt: `Two cranes hold the same container. Crane one pulls with ${vec(F1)} kN and crane two with ${vec(F2)} kN, each written (x, y, z) with z pointing up. The container moves by ${vec(d)} m. A force of 1 kN acting along 1 m does 1 kJ of work. Enter the total force in kN: x, then y, then z. Then enter the work the two cranes do together, in kJ.`,
  answer: [F[0], F[1], F[2], W],
  hints: ['Both forces act on the same container, so add them axis by axis first.', 'Then take the dot product of the total force with the move: multiply matching numbers and add the three products.'],
  solution: `Total force: (${n(F1[0])}${plus(F2[0])}, ${n(F1[1])}${plus(F2[1])}, ${n(F1[2])}${plus(F2[2])}) = ${vec(F)} kN. Work: ${dotText(F, d)} = ${sumText(p)} = ${n(W)} kJ. Check: crane one alone does ${n(w1)} kJ and crane two ${n(w2)} kJ, and ${n(w1)} + ${par(w2)} = ${n(W)}.`,
  guidance: [
   { prompt: `Add the two forces ${vec(F1)} and ${vec(F2)}, axis by axis. Enter the total force: x, then y, then z.`, answer: F, explanation: `x: ${n(F1[0])}${plus(F2[0])} = ${n(F[0])}. y: ${n(F1[1])}${plus(F2[1])} = ${n(F[1])}. z: ${n(F1[2])}${plus(F2[2])} = ${n(F[2])}.` },
   { prompt: `Multiply matching numbers of the total force ${vec(F)} and the move ${vec(d)}. Enter the three products: x, then y, then z.`, answer: p, explanation: `${F.map((x, i) => `${par(x)}·${par(d[i])} = ${n(p[i])}`).join(', ')}.` },
   { prompt: `Add the three products: ${sumText(p)}. What is the work in kJ?`, answer: [W], explanation: `${sumText(p)} = ${n(W)} kJ. ${p.some(x => x < 0) ? 'A minus product is an axis where the force works against the move.' : 'Every product is plus here, so on every axis the force helps the move.'}` }
  ] }; }
});

/* ---- q04 Cross product ---- */
/* q04b: both arrows lie in the xz plane or in the yz plane (the parent keeps them in the xy plane), so the torque
   points along y or along x. Along y the formula reads r_z·F_x − r_x·F_z, the line people slip on. */
practice({ id: 'q04b', parent: 'q04', kind: 'setting',
 title: 'The long bar on the valve',
 brief: 'A fitter leans on a long bar to turn a pipeline valve, and the valve log needs the torque.',
 labels: ['torque x', 'torque y', 'torque z'], tolerance: 0.01 },
 [['first product', 'second product'], ['torque part']], {
 canonical: { r: [3, 0, -1], F: [2, 0, 4] },
 /* off = the axis on which both arrows are 0 (0 for x, 1 for y). At most one other 0, and the torque is never 0. */
 draw: R => { for (;;) { const off = R.int(0, 1), v = [R.int(-4, 4), R.int(-4, 4), R.int(-6, 6), R.int(-6, 6)];
  const r = off === 0 ? [0, v[0], v[1]] : [v[0], 0, v[1]], F = off === 0 ? [0, v[2], v[3]] : [v[2], 0, v[3]];
  if (v.filter(x => x === 0).length <= 1 && crossV(r, F)[off] !== 0) return { r, F }; } },
 build: ({ r, F }) => { const t = crossV(r, F), off = r[0] === 0 && F[0] === 0 ? 0 : 1, ax = 'xy'[off];
  const [i, j] = off === 0 ? [1, 2] : [2, 0], p = r[i] * F[j] + 0, q = r[j] * F[i] + 0, nm = k => 'xyz'[k];
  return {
  prompt: `A fitter turns a pipeline valve with a long bar. Measured from the centre of the valve, the grip is at r = ${vec(r)} m and the push on the grip is F = ${vec(F)} N. The torque r×F measures how hard the push turns the valve. Enter the torque in N·m: x part, then y part, then z part.`,
  answer: t,
  hints: ['Both arrows have a 0 in the same place. Find the two parts of the torque in which every product then holds a 0.', `For the part that is left, use its line of the lesson's formula with r first and F second: r_${nm(i)}·F_${nm(j)} − r_${nm(j)}·F_${nm(i)}.`],
  solution: `Both arrows have ${ax} = 0, so the torque points along ${ax}. Its ${ax} part is r_${nm(i)}·F_${nm(j)} − r_${nm(j)}·F_${nm(i)} = ${par(r[i])}·${par(F[j])} − ${par(r[j])}·${par(F[i])} = ${n(p)} − ${par(q)} = ${n(t[off])}. The other two parts are 0, so r×F = ${vec(t)} N·m. In the other order, F×r, the sign would flip.`,
  guidance: [
   { prompt: `Only the ${ax} part of the torque is not 0. Its formula is r_${nm(i)}·F_${nm(j)} − r_${nm(j)}·F_${nm(i)}. Enter the two products ${par(r[i])}·${par(F[j])} and ${par(r[j])}·${par(F[i])}.`, answer: [p, q], explanation: `r_${nm(i)}·F_${nm(j)} = ${n(p)} and r_${nm(j)}·F_${nm(i)} = ${n(q)}. The other two parts of the torque are 0, because each of their products holds a 0.` },
   { prompt: `Take the second product from the first: ${n(p)} − ${par(q)}. What is the ${ax} part of the torque?`, answer: [t[off]], explanation: `${n(p)} − ${par(q)} = ${n(t[off])}, so r×F = ${vec(t)} N·m.` }
  ] }; }
});

/* q04c: a full cross product (no 0 pattern) of two triangle edges, then the right-angle check with a dot product. */
practice({ id: 'q04c', parent: 'q04', kind: 'applied',
 title: 'Lighting a triangle',
 brief: 'A 3D artist needs the arrow that sticks straight out of a triangle, so the light falls on it correctly.',
 labels: ['cross x', 'cross y', 'cross z'], tolerance: 0.01 },
 [['cross x'], ['cross y', 'cross z'], ['x product', 'y product', 'z product']], {
 canonical: { a: [2, 1, 3], b: [1, -2, 2] },
 /* At most one 0 in each edge; the result has no 0 part, so no part can be skipped. */
 draw: R => { for (;;) { const a = [R.int(-3, 4), R.int(-3, 4), R.int(-3, 4)], b = [R.int(-3, 4), R.int(-3, 4), R.int(-3, 4)];
  if (a.filter(x => x === 0).length <= 1 && b.filter(x => x === 0).length <= 1 && crossV(a, b).every(x => x !== 0)) return { a, b }; } },
 build: ({ a, b }) => { const c = crossV(a, b), ch = c.map((x, i) => x * a[i] + 0); return {
  prompt: `A 3D artist lights a flat triangle on a model. Two edges of the triangle start at the same corner: a = ${vec(a)} and b = ${vec(b)}. The cross product a×b is an arrow that sticks straight out of the triangle, and the lighting needs it. Use the lesson's formula with a in the place of r and b in the place of F. Enter a×b: x part, then y part, then z part.`,
  answer: c,
  hints: ['Each part of the cross product uses the other two axes. The x part uses only the y and z numbers of a and b.', `The y part is the one people slip on. It is a_z·b_x − a_x·b_z = ${par(a[2])}·${par(b[0])} − ${par(a[0])}·${par(b[2])}.`],
  solution: `x part: a_y·b_z − a_z·b_y = ${par(a[1])}·${par(b[2])} − ${par(a[2])}·${par(b[1])} = ${n(c[0])}. y part: a_z·b_x − a_x·b_z = ${par(a[2])}·${par(b[0])} − ${par(a[0])}·${par(b[2])} = ${n(c[1])}. z part: a_x·b_y − a_y·b_x = ${par(a[0])}·${par(b[1])} − ${par(a[1])}·${par(b[0])} = ${n(c[2])}. So a×b = ${vec(c)}. Check with a dot product: ${dotText(c, a)} = 0, so the arrow is at a right angle to edge a.`,
  guidance: [
   { prompt: `The x part is a_y·b_z − a_z·b_y = ${par(a[1])}·${par(b[2])} − ${par(a[2])}·${par(b[1])}. What is it?`, answer: [c[0]], explanation: `${n(a[1] * b[2])} − ${par(a[2] * b[1])} = ${n(c[0])}.` },
   { prompt: `The y part is a_z·b_x − a_x·b_z = ${par(a[2])}·${par(b[0])} − ${par(a[0])}·${par(b[2])}. The z part is a_x·b_y − a_y·b_x = ${par(a[0])}·${par(b[1])} − ${par(a[1])}·${par(b[0])}. Enter the y part, then the z part.`, answer: [c[1], c[2]], explanation: `y: ${n(a[2] * b[0])} − ${par(a[0] * b[2])} = ${n(c[1])}. z: ${n(a[0] * b[1])} − ${par(a[1] * b[0])} = ${n(c[2])}. So a×b = ${vec(c)}.` },
   { prompt: `Check the result. An arrow that sticks straight out is at a right angle to edge a, so their dot product must be 0. Multiply matching numbers of ${vec(c)} and ${vec(a)}. Enter the three products: x, then y, then z.`, answer: ch, explanation: `${sumText(ch)} = 0. The three products cancel, so a×b is at a right angle to edge a. The same check works with edge b.` }
  ] }; }
});

/* q04d: add two forces (q01), then the full torque of the total force. */
practice({ id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q01',
 title: 'Robot arm with a drill',
 brief: 'A robot arm presses a drill against a wall, and its shoulder motor must hold against the torque.',
 labels: ['torque x', 'torque y', 'torque z'], tolerance: 0.01 },
 [['total force x', 'total force y', 'total force z'], ['torque x'], ['torque y', 'torque z']], {
 canonical: { r: [2, 1, 1], F1: [0, 0, -5], F2: [-3, 2, 0] },
 /* The weight pulls straight down (minus z); the wall pushes back level (no z). r has at most one 0 and no part of
    the torque is 0. */
 draw: R => { for (;;) { const p = { r: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], F1: [0, 0, -R.int(2, 9)], F2: [R.nz(-6, 6), R.nz(-6, 6), 0] };
  if (p.r.filter(x => x === 0).length <= 1 && crossV(p.r, addV(p.F1, p.F2)).every(x => x !== 0)) return p; } },
 build: ({ r, F1, F2 }) => { const F = addV(F1, F2), t = crossV(r, F); return {
  prompt: `A robot arm holds a drill against a wall. Measured from the shoulder joint, the drill is at r = ${vec(r)} m. Two forces act on the drill: its weight ${vec(F1)} N and the push back from the wall ${vec(F2)} N. The shoulder feels the torque r×F of the total force F. Enter that torque in N·m: x part, then y part, then z part.`,
  answer: t,
  hints: ['Add the two forces first, axis by axis. The torque formula then needs only r and that one total force.', 'Keep the order in every part: r first, then the total force. Swapping them flips every sign.'],
  solution: `Total force: F = ${vec(F1)} + ${vec(F2)} = ${vec(F)} N. x part: r_y·F_z − r_z·F_y = ${par(r[1])}·${par(F[2])} − ${par(r[2])}·${par(F[1])} = ${n(t[0])}. y part: r_z·F_x − r_x·F_z = ${par(r[2])}·${par(F[0])} − ${par(r[0])}·${par(F[2])} = ${n(t[1])}. z part: r_x·F_y − r_y·F_x = ${par(r[0])}·${par(F[1])} − ${par(r[1])}·${par(F[0])} = ${n(t[2])}. The torque is ${vec(t)} N·m.`,
  guidance: [
   { prompt: `Add the weight ${vec(F1)} and the wall's push ${vec(F2)}, axis by axis. Enter the total force: x, then y, then z.`, answer: F, explanation: `On every axis one of the two forces has a 0, so the other number carries over. The total force is ${vec(F)} N.` },
   { prompt: `With r = ${vec(r)} and F = ${vec(F)}, the x part of the torque is r_y·F_z − r_z·F_y = ${par(r[1])}·${par(F[2])} − ${par(r[2])}·${par(F[1])}. What is it?`, answer: [t[0]], explanation: `${n(r[1] * F[2])} − ${par(r[2] * F[1])} = ${n(t[0])}.` },
   { prompt: `The y part is r_z·F_x − r_x·F_z = ${par(r[2])}·${par(F[0])} − ${par(r[0])}·${par(F[2])}. The z part is r_x·F_y − r_y·F_x = ${par(r[0])}·${par(F[1])} − ${par(r[1])}·${par(F[0])}. Enter the y part, then the z part.`, answer: [t[1], t[2]], explanation: `y: ${n(r[2] * F[0])} − ${par(r[0] * F[2])} = ${n(t[1])}. z: ${n(r[0] * F[1])} − ${par(r[1] * F[0])} = ${n(t[2])}.` }
  ] }; }
});

/* ---- q05 Angles and similarity ---- */
/* q05b: whole numbers only. One path lies along a map axis; the other is a 3–4–5 triangle scaled by k, so the cosine is
   ±0.6 or ±0.8 and the angle (36.87°, 53.13°, 126.87° or 143.13°) needs the inverse cosine key. The parent q05 and its
   generator, and q05d below, keep to √3 arrows and the angles 60°, 90° and 120°. */
practice({ id: 'q05b', parent: 'q05', kind: 'setting',
 title: 'Two paths from the fountain',
 brief: 'Two straight paths leave a park fountain, and the map maker wants the angle between them.',
 labels: ['cosine', 'angle degrees'], tolerance: 0.01 },
 [['dot product'], ['length of u', 'length of v'], ['cosine', 'angle degrees']], {
 canonical: { u: [-2, 0], v: [9, 12] },
 draw: R => { const a = R.nz(-5, 5), k = R.int(1, 3), s = () => R.bool() ? 1 : -1, legs = R.bool() ? [3, 4] : [4, 3]; return { u: R.bool() ? [a, 0] : [0, a], v: legs.map(x => x * k * s()) }; },
 build: ({ u, v }) => { const east = u[1] === 0, a = east ? u[0] : u[1], live = east ? v[0] : v[1], sq = v.map(x => x * x), S = sq[0] + sq[1];
  const dot = a * live, Lu = Math.abs(a), Lv = T(Math.sqrt(S)), LL = Lu * Lv, cos = T(dot / LL), ang = Math.acos(cos) * 180 / Math.PI, shown = n(Math.round(ang * 100) / 100);
  return {
  prompt: `Two straight paths leave the fountain in a park. On the map, path A runs along u = ${vec(u)} and path B runs along v = ${vec(v)}, each written (east, north); a minus number means west or south. Enter the cosine of the angle between the two paths, then the angle in degrees, rounded to two decimals.`,
  answer: [cos, ang],
  hints: ['Start with the dot product: multiply the two east parts, multiply the two north parts, then add. The 0 in u makes one of the products 0.', 'Divide the dot product by the two lengths multiplied together. That is the cosine. For the angle, use the inverse cosine key (cos⁻¹) on a calculator set to degrees.'],
  solution: `u·v = ${dotText(u, v)} = ${n(dot)}. Length of u: ${n(Lu)}. Length of v: √(${n(sq[0])} + ${n(sq[1])}) = √${n(S)} = ${n(Lv)}. cos θ = ${n(dot)}/(${n(Lu)}·${n(Lv)}) = ${n(cos)}, and the inverse cosine gives θ ≈ ${shown}°.`,
  guidance: [
   { prompt: `Multiply matching parts of u = ${vec(u)} and v = ${vec(v)}, then add: ${dotText(u, v)}. What is the dot product?`, answer: [dot], explanation: `Only the ${east ? 'east' : 'north'} parts count: ${par(a)}·${par(live)} = ${n(dot)}. The other product has a 0 in it.` },
   { prompt: `Enter the length of u, then the length of v. For v, square both parts, add the squares and take the square root: √(${n(sq[0])} + ${n(sq[1])}).`, answer: [Lu, Lv], explanation: `u has one part that is not 0, so its length is ${n(Lu)}. A length is never a minus number. For v: √(${n(sq[0])} + ${n(sq[1])}) = √${n(S)} = ${n(Lv)}.` },
   { prompt: `Divide the dot product ${n(dot)} by the lengths multiplied, ${n(Lu)}·${n(Lv)} = ${n(LL)}. Enter the cosine, then its inverse cosine in degrees, rounded to two decimals.`, answer: [cos, ang], explanation: `${n(dot)}/${n(LL)} = ${n(cos)}, and the inverse cosine of ${n(cos)} is about ${shown}°. ${cos > 0 ? 'A plus cosine is an angle below 90°.' : 'A minus cosine is an angle above 90°: the paths head apart.'}` }
  ] }; }
});

/* q05c: cosine similarity as a film service uses it. Every list is a 3–4–5 triangle scaled, or lies along one axis,
   so every length is a whole number and every cosine has at most two decimals. */
practice({ id: 'q05c', parent: 'q05', kind: 'applied',
 title: 'Which film fits the viewer',
 brief: 'A film service compares a viewer\'s taste with two films and must pick the closer match.',
 labels: ['cosine A', 'cosine B', 'closer match'], tolerance: 0.004 },
 [['length of t', 'length of a', 'length of b'], ['dot product t·a', 'dot product t·b'], ['cosine A', 'cosine B']], {
 canonical: { t: [3, 4], A: [4, 3], B: [15, 0] },
 /* The film with the larger dot product is always the worse match, so comparing dot products alone gives the wrong
    film: only dividing by the lengths finds the closer one. */
 draw: R => { const dirs = [[3, 4], [4, 3], [5, 0], [0, 5]], sc = (v, k) => v.map(x => x * k);
  for (;;) { const t = sc(dirs[R.int(0, 1)], R.int(1, 2)), i = R.int(0, 3), j = R.except(0, 3, [i]), A = sc(dirs[i], R.int(1, 3)), B = sc(dirs[j], R.int(1, 3));
   const Lt = Math.hypot(t[0], t[1]), ca = dotV(t, A) / (Lt * Math.hypot(A[0], A[1])), cb = dotV(t, B) / (Lt * Math.hypot(B[0], B[1]));
   if (Math.abs(ca - cb) > 1e-9 && (dotV(t, A) - dotV(t, B)) * (ca - cb) < 0) return { t, A, B }; } },
 build: ({ t, A, B }) => { const len = v => T(Math.sqrt(v[0] * v[0] + v[1] * v[1])), Lt = len(t), La = len(A), Lb = len(B), da = dotV(t, A), db = dotV(t, B);
  const ca = T(da / (Lt * La)), cb = T(db / (Lt * Lb)), best = ca > cb ? 1 : 2, sqs = v => `√(${n(v[0] * v[0])} + ${n(v[1] * v[1])})`;
  return {
  prompt: `A film service describes taste with two scores, written (action, comedy). A viewer's taste is t = ${vec(t)}. Film A scores a = ${vec(A)} and film B scores b = ${vec(B)}. The closer match is the film whose arrow makes the smaller angle with t, and the smaller angle has the larger cosine. Enter the cosine for film A, then the cosine for film B, then the closer match (1 for film A, 2 for film B).`,
  answer: [ca, cb, best],
  hints: ['A long arrow gives a large dot product even when it points the wrong way. Divide each dot product by both lengths before you compare.', `Every length here is a whole number. The length of t is ${sqs(t)} = ${n(Lt)}.`],
  solution: `Lengths: t is ${n(Lt)}, a is ${n(La)}, b is ${n(Lb)}. Film A: t·a = ${dotText(t, A)} = ${n(da)}, so the cosine is ${n(da)}/(${n(Lt)}·${n(La)}) = ${n(ca)}. Film B: t·b = ${dotText(t, B)} = ${n(db)}, so the cosine is ${n(db)}/(${n(Lt)}·${n(Lb)}) = ${n(cb)}. The larger cosine is film ${best === 1 ? 'A' : 'B'}'s, so film ${best === 1 ? 'A' : 'B'} is the closer match${(da - db) * (ca - cb) < 0 ? `, although film ${best === 1 ? 'B' : 'A'} has the larger dot product` : ''}.`,
  guidance: [
   { prompt: `Find the three lengths: square both scores, add, take the square root. Enter the length of t = ${vec(t)}, then of a = ${vec(A)}, then of b = ${vec(B)}.`, answer: [Lt, La, Lb], explanation: `t: ${sqs(t)} = ${n(Lt)}. a: ${sqs(A)} = ${n(La)}. b: ${sqs(B)} = ${n(Lb)}.` },
   { prompt: `Now the two dot products with the taste t = ${vec(t)}. Enter t·a, then t·b.`, answer: [da, db], explanation: `t·a = ${dotText(t, A)} = ${n(da)} and t·b = ${dotText(t, B)} = ${n(db)}. These still depend on how long the arrows are.` },
   { prompt: `Divide each dot product by its two lengths multiplied: ${n(da)}/(${n(Lt)}·${n(La)}) and ${n(db)}/(${n(Lt)}·${n(Lb)}). Enter the cosine for film A, then for film B.`, answer: [ca, cb], explanation: `${n(da)}/${n(Lt * La)} = ${n(ca)} and ${n(db)}/${n(Lt * Lb)} = ${n(cb)}. The larger cosine belongs to film ${best === 1 ? 'A' : 'B'}, the closer match.` }
  ] }; }
});

/* q05d: add two legs (q01), then the angle between leg one and the straight line from start to finish.
   Leg one is (a, 0); leg two is (c, k·√r) with r = 3 or r = 1. For r = 3 the total east part is +|k| or −|k|
   (60° or 120°); for r = 1 it is 0 (90°). */
practice({ id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q01',
 title: 'The straight line to the finish',
 brief: 'A runner on a two-leg course wants the angle between the first leg and the straight line to the finish.',
 labels: ['cosine', 'angle degrees'], tolerance: 0.01 },
 [['total east'], ['dot product', 'length of p + q'], ['cosine', 'angle degrees']], {
 canonical: { a: 5, c: -3, k: 2, r: 3 },
 /* a > 0 and c ≠ 0, so the angle between the two legs themselves is never the answer. */
 draw: R => { for (;;) { const a = R.int(1, 6), k = R.int(1, 4) * (R.bool() ? 1 : -1), r = R.int(0, 3) ? 3 : 1, e = r === 3 ? Math.abs(k) * (R.bool() ? 1 : -1) : 0, c = e - a;
  if (c !== 0) return { a, c, k, r }; } },
 build: ({ a, c, k, r }) => { const e = a + c, ak = Math.abs(k), L = r === 3 ? 2 * ak : ak, dot = a * e, cos = T(dot / (a * L)), ang = cos > 0 ? 60 : cos < 0 ? 120 : 90;
  const north = rt(k, r), qt = `(${n(c)}, ${north})`, st = `(${n(e)}, ${north})`, sq = r === 3 ? `√(${n(e * e)} + ${n(3 * k * k)}) = √${n(L * L)} = ${n(L)}` : `${n(L)}, because its east part is 0`;
  return {
  prompt: `An orienteering course has two legs, each written (east, north) in units of 100 m. Leg one is p = (${n(a)}, 0) and leg two is q = ${qt}.${r === 3 ? ' Here √3 is the number whose square is 3.' : ''} The straight line from the start to the finish is p + q. Enter the cosine of the angle between leg one and that straight line, then the angle in degrees.`,
  answer: [cos, ang],
  hints: [`Add the two legs first. Only the east parts need work: the north part of p + q is ${north}, because leg one has no north part.`, 'Then use the angle recipe on p and p + q, not on p and q: dot product, the two lengths, divide, and take the inverse cosine in degrees.'],
  solution: `p + q = (${n(a)}${plus(c)}, ${north}) = ${st}. Dot product: p·(p + q) = ${par(a)}·${par(e)} + 0 = ${n(dot)}. Lengths: p is ${n(a)} and p + q is ${sq}. cos θ = ${n(dot)}/(${n(a)}·${n(L)}) = ${n(cos)}, and the inverse cosine gives θ = ${n(ang)}°.`,
  guidance: [
   { prompt: `Add the east parts of p = (${n(a)}, 0) and q = ${qt}. What is the east part of p + q?`, answer: [e], explanation: `${n(a)}${plus(c)} = ${n(e)}. Leg one has no north part, so the north part stays ${north} and p + q = ${st}.` },
   { prompt: `Now compare p = (${n(a)}, 0) with p + q = ${st}. Enter their dot product, then the length of p + q.`, answer: [dot, L], explanation: `Dot product: ${par(a)}·${par(e)} + 0 = ${n(dot)}. The length of p + q is ${sq}.` },
   { prompt: `The length of p is ${n(a)}. Divide the dot product ${n(dot)} by ${n(a)}·${n(L)} = ${n(a * L)}. Enter the cosine, then its inverse cosine in degrees.`, answer: [cos, ang], explanation: `${n(dot)}/${n(a * L)} = ${n(cos)}, and the inverse cosine of ${n(cos)} is ${n(ang)}°.` }
  ] }; }
});


})();
