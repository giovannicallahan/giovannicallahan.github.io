/* Linear algebra practice missions, file 2 of 14: concepts q06–q10, three practice missions each
   (q06b q06c q06d ... q10b q10c q10d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p2.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- add missions for q06–q10 below this line ---- */

/* Small exact helpers. z() turns −0 into 0 so no answer or text ever shows "−0". */
const z = x => x === 0 ? 0 : x;
const dot = (r, x) => z(r.reduce((s, a, i) => s + a * x[i], 0));
const app = (M, x) => M.map(r => dot(r, x));
const col = (M, j) => M.map(r => r[j]);
const mul = (A, B) => A.map(r => B[0].map((_, j) => dot(r, col(B, j))));
const det2 = M => z(M[0][0] * M[1][1] - M[0][1] * M[1][0]);
const zeros = list => list.filter(x => x === 0).length;
const same = (A, B) => String(A) === String(B);
/* "2·3 + (−1)·4": a row dotted with a list, written out. */
const dotT = (r, x) => r.map((a, i) => `${par(a)}·${par(x[i])}`).join(' + ');
const terms = (r, x) => r.map((a, i) => n(z(a * x[i]))).join(', ');
/* The quarter turn counterclockwise of q07. */
const TURN = [[0, -1], [1, 0]];
const E4 = ['entry 11', 'entry 12', 'entry 21', 'entry 22'], INV4 = ['inverse 11', 'inverse 12', 'inverse 21', 'inverse 22'];

/* ---- q06 Matrix-vector products (taught: each output is one row of the matrix dotted with the input) ---- */
/* q06b: a food table. All numbers are counts, so the work is the row rule itself. */
practice({ id: 'q06b', parent: 'q06', kind: 'setting',
 title: 'The food diary table',
 brief: 'A food diary app has to turn the servings you ate into totals of protein and fibre.',
 labels: ['protein (g)', 'fibre (g)'], tolerance: 0.01 },
 [['protein (g)'], ['fibre (g)']], {
 canonical: { A: [[5, 9, 6], [4, 0, 3]], x: [2, 1, 3] },
 /* At most one zero in the fibre row (its place still matters). The servings are not all the same number, so
    adding a row without multiplying never gives the right total. */
 draw: R => { for (;;) { const A = [[R.int(2, 9), R.int(2, 9), R.int(2, 9)], [R.int(0, 6), R.int(0, 6), R.int(0, 6)]], x = [R.int(1, 4), R.int(1, 4), R.int(1, 4)];
  if (zeros(A[1]) > 1 || (x[0] === x[1] && x[1] === x[2])) continue; return { A, x }; } },
 build: ({ A, x }) => { const y = app(A, x); return {
  prompt: `A food diary app keeps a table for three foods: oats, yoghurt and almonds, in that order. Row one is the grams of protein in one serving: ${vec(A[0])}. Row two is the grams of fibre in one serving: ${vec(A[1])}. Today you ate ${vec(x)} servings. Each total is one row of the table dotted with the servings. Enter the grams of protein, then the grams of fibre.`,
  answer: y,
  hints: ['Take one row at a time. Multiply each number in the row by the servings of the same food, then add the three results.', `For protein, start from ${dotT(A[0], x)}.`],
  solution: `Protein: ${dotT(A[0], x)} = ${n(y[0])} g. Fibre: ${dotT(A[1], x)} = ${n(y[1])} g. The table has two rows, so there are two totals.`,
  guidance: [
   { prompt: `Protein uses row one, ${vec(A[0])}, and the servings ${vec(x)}. Work out ${dotT(A[0], x)}. How many grams of protein?`, answer: [y[0]], explanation: `Food by food, the grams are ${terms(A[0], x)}. These add to ${n(y[0])} g.` },
   { prompt: `Fibre uses row two, ${vec(A[1])}, with the same servings. Work out ${dotT(A[1], x)}. How many grams of fibre?`, answer: [y[1]], explanation: `Food by food, the grams are ${terms(A[1], x)}. These add to ${n(y[1])} g.` }
  ] }; }
});

/* q06c: the product first, then a comparison with the stock on the shelf. */
practice({ id: 'q06c', parent: 'q06', kind: 'applied',
 title: 'Parts for the school order',
 brief: 'A workshop must check that its shelf holds enough motors and sensors for a school order of robot kits.',
 labels: ['motors needed', 'sensors needed', 'motors left', 'sensors left'], tolerance: 0.01 },
 [['motors needed'], ['sensors needed'], ['motors left', 'sensors left']], {
 canonical: { A: [[2, 3, 4], [1, 2, 0]], x: [5, 2, 3], stock: [40, 15] },
 /* The shelf always holds at least 2 more than the order needs, so both leftovers are whole numbers from 2 up
    (never "1 motors"). */
 draw: R => { for (;;) { const A = [[R.int(1, 4), R.int(1, 4), R.int(1, 4)], [R.int(0, 5), R.int(0, 5), R.int(0, 5)]], x = [R.int(1, 6), R.int(1, 6), R.int(1, 6)];
  if (zeros(A[1]) > 1 || (x[0] === x[1] && x[1] === x[2])) continue;
  const need = app(A, x); return { A, x, stock: [need[0] + R.int(2, 12), need[1] + R.int(2, 12)] }; } },
 build: ({ A, x, stock }) => { const y = app(A, x), left = [stock[0] - y[0], stock[1] - y[1]]; return {
  prompt: `A workshop sells three robot kits: Crawler, Gripper and Flyer, in that order. Row one of its parts table is the motors in one kit: ${vec(A[0])}. Row two is the sensors in one kit: ${vec(A[1])}. A school orders ${vec(x)} kits. The shelf holds ${n(stock[0])} motors and ${n(stock[1])} sensors. Enter the motors the order needs, then the sensors it needs, then the motors left on the shelf, then the sensors left on the shelf.`,
  answer: [y[0], y[1], left[0], left[1]],
  hints: ['The parts needed are the table times the order: dot each row with the numbers of kits.', 'What is left is what the shelf holds minus what the order needs. Do this once for motors and once for sensors.'],
  solution: `Motors needed: ${dotT(A[0], x)} = ${n(y[0])}. Sensors needed: ${dotT(A[1], x)} = ${n(y[1])}. Left on the shelf: ${n(stock[0])} − ${n(y[0])} = ${n(left[0])} motors and ${n(stock[1])} − ${n(y[1])} = ${n(left[1])} sensors.`,
  guidance: [
   { prompt: `Dot the motor row ${vec(A[0])} with the order ${vec(x)}: ${dotT(A[0], x)}. How many motors does the order need?`, answer: [y[0]], explanation: `Kit by kit, the motors needed are ${terms(A[0], x)}. These add to ${n(y[0])}.` },
   { prompt: `Dot the sensor row ${vec(A[1])} with the same order: ${dotT(A[1], x)}. How many sensors does the order need?`, answer: [y[1]], explanation: `Kit by kit, the sensors needed are ${terms(A[1], x)}. These add to ${n(y[1])}.` },
   { prompt: `The shelf holds ${n(stock[0])} motors and ${n(stock[1])} sensors. Take away the ${n(y[0])} motors and the ${n(y[1])} sensors the order needs. Enter the motors left, then the sensors left.`, answer: left, explanation: `${n(stock[0])} − ${n(y[0])} = ${n(left[0])} motors, and ${n(stock[1])} − ${n(y[1])} = ${n(left[1])} sensors.` }
  ] }; }
});

/* q06d: a 3×3 matrix with signs, acting on the sum of two commands (vector addition, q01). */
practice({ id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q01',
 title: 'Two hands on the drone',
 brief: 'A camera drone gets commands from its autopilot and from the pilot at once, and its mixer must turn the total into motor changes.',
 labels: ['output 1', 'output 2', 'output 3'], tolerance: 0.01 },
 [['total 1', 'total 2', 'total 3'], ['output 1'], ['output 2', 'output 3']], {
 canonical: { M: [[1, 1, 0], [1, -1, 2], [0, 2, -1]], a: [2, -1, 3], b: [1, 3, -2] },
 /* Every row of M has at least two non-zero entries. No component of the total is zero, and neither command alone
    gives the outputs of the total, so the addition cannot be skipped. */
 draw: R => { for (;;) { const row = () => [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], M = [row(), row(), row()];
  const a = [R.nz(-5, 5), R.nz(-5, 5), R.nz(-5, 5)], b = [R.nz(-5, 5), R.nz(-5, 5), R.nz(-5, 5)], s = a.map((v, i) => v + b[i]);
  if (M.some(r => zeros(r) > 1) || zeros(M.flat()) > 2 || s.some(v => v === 0)) continue;
  if (app(M, a).every(v => v === 0) || app(M, b).every(v => v === 0)) continue;
  if (!M.flat().some(v => v < 0)) continue; return { M, a, b }; } },
 build: ({ M, a, b }) => { const s = a.map((v, i) => v + b[i]), y = app(M, s); return {
  prompt: `A camera drone has three control channels. Its mixer is the matrix M with rows ${vec(M[0])}, ${vec(M[1])} and ${vec(M[2])}. The autopilot sends the command a=${vec(a)} and the pilot's sticks send b=${vec(b)}. The two commands add, and the mixer acts on the total a+b. Enter the three outputs of M(a+b): output 1, then output 2, then output 3.`,
  answer: y,
  hints: ['Add the two commands first, channel by channel. Then use the total as the input of the mixer.', 'Each output is one row of M dotted with the total command. A zero in a row removes that channel from that output.'],
  solution: `Total command: a+b=${vec(s)}. Output 1: ${dotT(M[0], s)} = ${n(y[0])}. Output 2: ${dotT(M[1], s)} = ${n(y[1])}. Output 3: ${dotT(M[2], s)} = ${n(y[2])}. So M(a+b)=${vec(y)}.`,
  guidance: [
   { prompt: `Add the commands channel by channel: ${vec(a)} + ${vec(b)}. Enter the three numbers of the total command.`, answer: s, explanation: `${a.map((v, i) => `${n(v)}${plus(b[i])} = ${n(s[i])}`).join(', ')}. The total command is ${vec(s)}.` },
   { prompt: `Dot row one of M, ${vec(M[0])}, with the total ${vec(s)}: ${dotT(M[0], s)}. What is output 1?`, answer: [y[0]], explanation: `The three channels give ${terms(M[0], s)}, and these add to ${n(y[0])}.` },
   { prompt: `Do the same with row two, ${vec(M[1])}, and row three, ${vec(M[2])}. Enter output 2, then output 3.`, answer: [y[1], y[2]], explanation: `Output 2: ${dotT(M[1], s)} = ${n(y[1])}. Output 3: ${dotT(M[2], s)} = ${n(y[2])}.` }
  ] }; }
});

/* ---- q07 Planar transformations (taught: the rotation matrix [[cos θ,−sin θ],[sin θ,cos θ]]; 90° counterclockwise
        sends (x,y) to (−y,x); the rule turns about the origin) ---- */
/* q07b: two points of one picture, so the rule is used twice with different signs. */
practice({ id: 'q07b', parent: 'q07', kind: 'setting',
 title: 'Quarter turn in the photo app',
 brief: 'A photo app turns a picture a quarter turn and has to move every marked point with it.',
 labels: ['bird new x', 'bird new y', 'lamp post new x', 'lamp post new y'], tolerance: 0.01 },
 [['bird new x', 'bird new y'], ['lamp post new x', 'lamp post new y']], {
 canonical: { p: [4, -3], q: [-2, 5] },
 /* No zero coordinate, so every sign has to be handled; at least one negative coordinate; not the lesson's example point (−4,1). */
 draw: R => { for (;;) { const p = [R.nz(-9, 9), R.nz(-9, 9)], q = [R.nz(-9, 9), R.nz(-9, 9)];
  if (same(p, q) || ![...p, ...q].some(v => v < 0) || same(p, [-4, 1]) || same(q, [-4, 1])) continue; return { p, q }; } },
 build: ({ p, q }) => { const P = [-p[1], p[0]], Q = [-q[1], q[0]]; return {
  prompt: `A photo app turns a picture a quarter turn (90°) counterclockwise about its centre, the point (0, 0). Before the turn a bird sits at ${vec(p)} and a lamp post stands at ${vec(q)}, in centimetres from the centre. Enter where the bird lands, x then y. Then enter where the lamp post lands, x then y.`,
  answer: [...P, ...Q],
  hints: ['A quarter turn counterclockwise sends (x, y) to (−y, x). Use the rule once for each point.', 'The new x is the old y with its sign changed. The new y is the old x, copied as it is.'],
  solution: `The rule is (x, y) → (−y, x). Bird: ${vec(p)} → ${vec(P)}. Lamp post: ${vec(q)} → ${vec(Q)}. Each point stays as far from the centre as it was.`,
  guidance: [
   { prompt: `The bird is at ${vec(p)}. Change the sign of its y, ${n(p[1])}, to get the new x. Copy its x, ${n(p[0])}, as the new y. Enter the bird's new x, then its new y.`, answer: P, explanation: `Changing the sign of ${n(p[1])} gives ${n(P[0])}, and the old x ${n(p[0])} becomes the new y: ${vec(P)}.` },
   { prompt: `The lamp post is at ${vec(q)}. Use the same rule, (x, y) → (−y, x). Enter its new x, then its new y.`, answer: Q, explanation: `Changing the sign of ${n(q[1])} gives ${n(Q[0])}, and the old x ${n(q[0])} becomes the new y: ${vec(Q)}.` }
  ] }; }
});

/* q07c: a turn about a point that is not the origin: shift, turn, shift back (the lesson's second pitfall). */
practice({ id: 'q07c', parent: 'q07', kind: 'applied',
 title: 'The garden gate swings',
 brief: 'A garden plan has to show where the latch of a gate ends up when the gate swings open about its hinge.',
 labels: ['new x', 'new y'], tolerance: 0.01 },
 [['arrow x', 'arrow y'], ['turned x', 'turned y'], ['new x', 'new y']], {
 canonical: { H: [2, 1], L: [5, 3] },
 /* The hinge is off the origin with |Hx| ≠ |Hy|, so turning the latch about (0,0) instead gives a wrong x and a wrong y. */
 draw: R => { for (;;) { const H = [R.nz(-5, 5), R.nz(-5, 5)], d = [R.nz(-6, 6), R.nz(-6, 6)];
  if (Math.abs(H[0]) === Math.abs(H[1])) continue; return { H, L: [H[0] + d[0], H[1] + d[1]] }; } },
 build: ({ H, L }) => { const d = [L[0] - H[0], L[1] - H[1]], t = [-d[1], d[0]], N = [H[0] + t[0], H[1] + t[1]]; return {
  prompt: `Seen from above, a garden gate is hinged at the post H=${vec(H)} and its latch is at L=${vec(L)}, in metres on the garden plan. The gate swings a quarter turn (90°) counterclockwise about the hinge. The rule (x, y) → (−y, x) turns about (0, 0) only. So measure the latch from the hinge, turn that arrow, then add the hinge back. Enter the new position of the latch: x, then y.`,
  answer: N,
  hints: ['The arrow from the hinge to the latch is L minus H, one coordinate at a time.', 'Turn the arrow with (x, y) → (−y, x), not the latch position itself. Then add the hinge position to the turned arrow.'],
  solution: `Arrow from hinge to latch: L−H=(${n(L[0])} − ${par(H[0])}, ${n(L[1])} − ${par(H[1])})=${vec(d)}. Turned a quarter turn counterclockwise: ${vec(t)}. Add the hinge back: (${n(H[0])}${plus(t[0])}, ${n(H[1])}${plus(t[1])})=${vec(N)}. The latch is still as far from the hinge as before.`,
  guidance: [
   { prompt: `Measure the latch from the hinge: take H=${vec(H)} away from L=${vec(L)}. Enter the x and the y of this arrow.`, answer: d, explanation: `${n(L[0])} − ${par(H[0])} = ${n(d[0])} and ${n(L[1])} − ${par(H[1])} = ${n(d[1])}, so the arrow is ${vec(d)}.` },
   { prompt: `Turn the arrow ${vec(d)} a quarter turn counterclockwise with (x, y) → (−y, x). Enter the turned arrow, x then y.`, answer: t, explanation: `Changing the sign of ${n(d[1])} gives ${n(t[0])}, and the old x ${n(d[0])} becomes the new y: ${vec(t)}.` },
   { prompt: `Add the hinge H=${vec(H)} back to the turned arrow ${vec(t)}. Enter the new position of the latch, x then y.`, answer: N, explanation: `${n(H[0])}${plus(t[0])} = ${n(N[0])} and ${n(H[1])}${plus(t[1])} = ${n(N[1])}, so the latch ends at ${vec(N)}.` }
  ] }; }
});

/* q07d: an angle that is not 90°. The full rotation matrix is built from a given cosine and sine and applied as a
   matrix times a vector (q06). Cosine and sine are 0.6 and 0.8 and the point is in fives, so both answers are whole. */
practice({ id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q06',
 title: 'A turn that is not a right angle',
 brief: 'A game has to turn a spaceship picture by an angle that is not a right angle, so the full rotation matrix is needed.',
 labels: ['new x', 'new y'], tolerance: 0.01 },
 [['row 1 left', 'row 1 right'], ['new x'], ['new y']], {
 canonical: { cos: 0.6, sin: 0.8, v: [10, 5] },
 /* |x| ≠ |y|: then swapping cosine and sine, or putting the minus sign in the other row, changes both answers. */
 draw: R => { for (;;) { const c = R.pick([6, 8]), a = R.nz(-4, 4), b = R.nz(-4, 4);
  if (Math.abs(a) === Math.abs(b)) continue; return { cos: c / 10, sin: (14 - c) / 10, v: [5 * a, 5 * b] }; } },
 build: ({ cos, sin, v }) => { const C = Math.round(cos * 10), S = Math.round(sin * 10), [x, y] = v;
  const cx = z(C * x / 10), sy = z(S * y / 10), sx = z(S * x / 10), cy = z(C * y / 10), X = z(cx - sy), Y = z(sx + cy), deg = C === 6 ? 53 : 37; return {
  prompt: `A game turns a spaceship picture counterclockwise by an angle θ of about ${n(deg)}°, with cos θ=${n(cos)} and sin θ=${n(sin)}. Put these into the rotation matrix [[cos θ,−sin θ],[sin θ,cos θ]]. Then multiply the matrix by the position of the ship's nose, ${vec(v)}. Enter the new x, then the new y.`,
  answer: [X, Y],
  hints: ['Write the matrix with numbers first. Only the top right entry gets a minus sign: it is −sin θ.', 'Each new coordinate is one row of the matrix dotted with the old position: row one gives the new x, row two the new y.'],
  solution: `The matrix is ${mat([[cos, -sin], [sin, cos]])}. New x: ${n(cos)}·${par(x)} − ${n(sin)}·${par(y)} = ${n(cx)} − ${par(sy)} = ${n(X)}. New y: ${n(sin)}·${par(x)} + ${n(cos)}·${par(y)} = ${n(sx)} + ${par(cy)} = ${n(Y)}. The nose moves from ${vec(v)} to ${vec([X, Y])} and stays as far from the centre as before.`,
  guidance: [
   { prompt: `The top row of the rotation matrix is (cos θ, −sin θ). With cos θ=${n(cos)} and sin θ=${n(sin)}, enter its two numbers, left then right.`, answer: [cos, -sin], explanation: `The top row is (${n(cos)}, ${n(-sin)}). The bottom row is (sin θ, cos θ)=(${n(sin)}, ${n(cos)}), with no minus sign.` },
   { prompt: `Dot the top row (${n(cos)}, ${n(-sin)}) with the position ${vec(v)}: ${n(cos)}·${par(x)} − ${n(sin)}·${par(y)}. What is the new x?`, answer: [X], explanation: `${n(cos)}·${par(x)} = ${n(cx)} and ${n(sin)}·${par(y)} = ${n(sy)}, so the new x is ${n(cx)} − ${par(sy)} = ${n(X)}.` },
   { prompt: `Dot the bottom row (${n(sin)}, ${n(cos)}) with the position ${vec(v)}: ${n(sin)}·${par(x)} + ${n(cos)}·${par(y)}. What is the new y?`, answer: [Y], explanation: `${n(sin)}·${par(x)} = ${n(sx)} and ${n(cos)}·${par(y)} = ${n(cy)}, so the new y is ${n(sx)} + ${par(cy)} = ${n(Y)}.` }
  ] }; }
});

/* ---- q08 Matrix multiplication (taught: "first B, then A" is AB; an entry is a row of A dotted with a column of B;
        a column of AB is A applied to a column of B; order matters) ---- */
/* q08b: two tables chained. Every entry of AB has a meaning the player can check with common sense. */
practice({ id: 'q08b', parent: 'q08', kind: 'setting',
 title: 'What a gift basket costs',
 brief: 'A shop has one table for what goes into its gift baskets and one for what each kilogram costs, and it wants a single table for whole baskets.',
 labels: ['dollars, Small', 'dollars, Large', 'minutes, Small', 'minutes, Large'], tolerance: 0.01 },
 [['dollars, Small', 'minutes, Small'], ['dollars, Large', 'minutes, Large']], {
 canonical: { A: [[4, 6], [5, 3]], B: [[2, 3], [1, 2]] },
 /* AB ≠ BA, so multiplying in the wrong order is never right. All entries are positive, so multiplying only the
    matching entries is never right either. */
 draw: R => { for (;;) { const e = () => R.int(2, 7), f = () => R.int(1, 4), A = [[e(), e()], [e(), e()]], B = [[f(), f()], [f(), f()]];
  if (same(A, B) || same(mul(A, B), mul(B, A))) continue; return { A, B }; } },
 build: ({ A, B }) => { const P = mul(A, B), b1 = col(B, 0), b2 = col(B, 1), p1 = col(P, 0), p2 = col(P, 1); return {
  prompt: `A shop packs two gift baskets, Small and Large. Table B gives the kilograms in one basket: its columns are Small and Large, its rows are fruit and nuts, and B=${mat(B)}. Table A gives the cost and the packing time for one kilogram: its columns are fruit and nuts, its rows are dollars and minutes, and A=${mat(A)}. Baskets become kilograms first (B), and kilograms then become dollars and minutes (A), so the table for whole baskets is AB. Enter AB row by row: dollars for a Small, dollars for a Large, minutes for a Small, minutes for a Large.`,
  answer: P.flat(),
  hints: ['Each entry of AB is a row of A dotted with a column of B. Row one of A is the dollars row, and column one of B is the Small basket.', `The Small column of AB is A applied to the Small column of B, ${vec(b1)}.`],
  solution: `Small basket: A${vec(b1)}=(${dotT(A[0], b1)}, ${dotT(A[1], b1)})=${vec(p1)}. Large basket: A${vec(b2)}=(${dotT(A[0], b2)}, ${dotT(A[1], b2)})=${vec(p2)}. These are the columns of the product, so AB=${mat(P)}.`,
  guidance: [
   { prompt: `A Small basket holds ${vec(b1)} kilograms of fruit and nuts: column one of B. Apply A to it. Enter the dollars, then the minutes, for one Small basket.`, answer: p1, explanation: `Dollars: ${dotT(A[0], b1)} = ${n(p1[0])}. Minutes: ${dotT(A[1], b1)} = ${n(p1[1])}. This is the first column of AB.` },
   { prompt: `A Large basket holds ${vec(b2)} kilograms: column two of B. Apply A to it. Enter the dollars, then the minutes, for one Large basket.`, answer: p2, explanation: `Dollars: ${dotT(A[0], b2)} = ${n(p2[0])}. Minutes: ${dotT(A[1], b2)} = ${n(p2[1])}. This is the second column of AB, so AB=${mat(P)}.` }
  ] }; }
});

/* q08c: the player has to decide the order from the story, build the product, then use it on a point.
   Either the turn comes first (ST) or the reshaping comes first (TS). */
practice({ id: 'q08c', parent: 'q08', kind: 'applied',
 title: 'Turn and reshape a sticker',
 brief: 'A design app applies two changes to a sticker one after the other and wants a single matrix that does both.',
 labels: [...E4, 'new x', 'new y'], tolerance: 0.01 },
 [['entry 11', 'entry 21'], ['entry 12', 'entry 22'], ['new x', 'new y']], {
 canonical: { S: [[1, 2], [0, 1]], turnFirst: true, v: [3, 1] },
 /* S does not commute with the quarter turn, and the corner lands somewhere else in the wrong order. */
 draw: R => { for (;;) { const e = () => R.int(-3, 3), S = [[e(), e()], [e(), e()]], turnFirst = R.bool(), v = [R.nz(-4, 4), R.nz(-4, 4)];
  if (zeros(S.flat()) > 1 || det2(S) === 0 || same(S, TURN)) continue;
  const ST = mul(S, TURN), TS = mul(TURN, S);
  if (same(ST, TS) || same(app(ST, v), app(TS, v))) continue; return { S, turnFirst, v }; } },
 build: ({ S, turnFirst, v }) => { const F = turnFirst ? TURN : S, L = turnFirst ? S : TURN, fN = turnFirst ? 'T' : 'S', lN = turnFirst ? 'S' : 'T';
  const P = mul(L, F), Q = mul(F, L), w = app(P, v), c1 = col(F, 0), c2 = col(F, 1), p1 = col(P, 0), p2 = col(P, 1); return {
  prompt: `A design app moves the points of a sticker with matrices. T=${mat(TURN)} is a quarter turn counterclockwise. S=${mat(S)} reshapes the sticker. The sticker is ${turnFirst ? 'turned first and reshaped second' : 'reshaped first and turned second'}. One matrix does both jobs: the product with the first job on the right. Enter that matrix row by row. Then use it to move the sticker's corner at ${vec(v)}: enter the new x, then the new y.`,
  answer: [...P.flat(), ...w],
  hints: ['The job done first stands on the right. Decide which job comes first, then dot each row of the left matrix with each column of the right matrix.', `For the corner, dot each row of your matrix with ${vec(v)}.`],
  solution: `The first job is ${fN}, so the matrix is ${lN}${fN}=${mat(P)}. Corner: (${dotT(P[0], v)}, ${dotT(P[1], v)})=${vec(w)}. In the other order the matrix would be ${fN}${lN}=${mat(Q)}, which is different.`,
  guidance: [
   { prompt: `The first job is ${fN}, so the matrix is ${lN}${fN}. Its first column is ${lN} applied to the first column of ${fN}, which is ${vec(c1)}. Enter that column, top then bottom.`, answer: p1, explanation: `${lN}${vec(c1)}=(${dotT(L[0], c1)}, ${dotT(L[1], c1)})=${vec(p1)}.` },
   { prompt: `The second column is ${lN} applied to the second column of ${fN}, which is ${vec(c2)}. Enter that column, top then bottom.`, answer: p2, explanation: `${lN}${vec(c2)}=(${dotT(L[0], c2)}, ${dotT(L[1], c2)})=${vec(p2)}. So ${lN}${fN}=${mat(P)}.` },
   { prompt: `Now apply ${lN}${fN}=${mat(P)} to the corner ${vec(v)}: dot each row with it. Enter the new x, then the new y.`, answer: w, explanation: `New x: ${dotT(P[0], v)} = ${n(w[0])}. New y: ${dotT(P[1], v)} = ${n(w[1])}.` }
  ] }; }
});

/* q08d: a 2×3 table times a 3×2 table. Each column of the product is a 2×3 matrix times a vector (q06);
   the entries count two-flight trips. */
practice({ id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q06',
 title: 'Two flights to the islands',
 brief: 'A travel desk wants to know how many two-flight trips link each city to each island through three hub airports.',
 labels: ['Northport to Alba', 'Eastbay to Alba', 'Northport to Coral', 'Eastbay to Coral'], tolerance: 0.01 },
 [['Northport to Alba', 'Northport to Coral'], ['Eastbay to Alba', 'Eastbay to Coral']], {
 canonical: { A: [[1, 2, 0], [3, 1, 2]], B: [[2, 1], [0, 3], [1, 1]] },
 /* Each island is served from at least two hubs and each city flies to at least two hubs; at most three zeros in all. */
 draw: R => { for (;;) { const e = () => R.int(0, 3), A = [[e(), e(), e()], [e(), e(), e()]], B = [[e(), e()], [e(), e()], [e(), e()]];
  if (A.some(r => zeros(r) > 1) || zeros(col(B, 0)) > 1 || zeros(col(B, 1)) > 1 || zeros([...A.flat(), ...B.flat()]) > 3) continue;
  if (same(col(B, 0), col(B, 1)) || same(A[0], A[1])) continue; return { A, B }; } },
 build: ({ A, B }) => { const P = mul(A, B), b1 = col(B, 0), b2 = col(B, 1), p1 = col(P, 0), p2 = col(P, 1); return {
  prompt: `Two cities, Northport and Eastbay, fly to three hub airports, and the hubs fly on to two islands, Alba and Coral. B counts the daily flights into the hubs: its columns are Northport and Eastbay, its rows are hubs 1, 2 and 3, and B=${mat(B)}. A counts the daily flights out of the hubs: its columns are hubs 1, 2 and 3, its rows are Alba and Coral, and A=${mat(A)}. The number of two-flight trips from each city to each island is the product AB. Enter AB row by row: Northport to Alba, Eastbay to Alba, Northport to Coral, Eastbay to Coral.`,
  answer: P.flat(),
  hints: ['A column of B now has three numbers, one for each hub. A row of A also has three, so a row of A can still be dotted with a column of B.', 'AB has one row for each island and one column for each city: two rows and two columns.'],
  solution: `Northport column: A${vec(b1)}=(${dotT(A[0], b1)}, ${dotT(A[1], b1)})=${vec(p1)}. Eastbay column: A${vec(b2)}=(${dotT(A[0], b2)}, ${dotT(A[1], b2)})=${vec(p2)}. So AB=${mat(P)}. Each product in a sum counts the trips through one hub.`,
  guidance: [
   { prompt: `Northport's flights into the three hubs are column one of B, ${vec(b1)}. Apply A to it: dot each row of A with it. Enter the trips from Northport to Alba, then from Northport to Coral.`, answer: p1, explanation: `To Alba: ${dotT(A[0], b1)} = ${n(p1[0])}. To Coral: ${dotT(A[1], b1)} = ${n(p1[1])}. This is the first column of AB.` },
   { prompt: `Eastbay's flights into the hubs are column two of B, ${vec(b2)}. Apply A to it. Enter the trips from Eastbay to Alba, then from Eastbay to Coral.`, answer: p2, explanation: `To Alba: ${dotT(A[0], b2)} = ${n(p2[0])}. To Coral: ${dotT(A[1], b2)} = ${n(p2[1])}. This is the second column of AB.` }
  ] }; }
});

/* ---- q09 Determinants (taught: det [[a,b],[c,d]] = ad−bc; its size is the area scale; a minus sign means mirrored) ---- */
/* q09b: the area scale is used on a real area. */
practice({ id: 'q09b', parent: 'q09', kind: 'setting',
 title: 'The printed leaf',
 brief: 'A fabric printer stretches and slants a pattern, and the designer needs to know how big a leaf comes out.',
 labels: ['determinant', 'printed area (cm²)'], tolerance: 0.01 },
 [['ad', 'bc'], ['determinant'], ['printed area (cm²)']], {
 canonical: { A: [[3, 1], [2, -1]], area: 4 },
 /* No zero entry, so ad+bc is never the determinant or its size. The area scale is at least 2, so the area changes. */
 draw: R => { for (;;) { const e = () => R.nz(-4, 4), A = [[e(), e()], [e(), e()]];
  if (Math.abs(det2(A)) < 2 || same(A, [[1, 4], [2, 3]]) || same(A, [[2, 1], [3, 1]])) continue; return { A, area: R.int(2, 6) }; } },
 build: ({ A, area }) => { const [[a, b], [c, d]] = A, ad = a * d, bc = b * c, D = ad - bc, k = Math.abs(D), out = k * area; return {
  prompt: `A fabric printer stretches and slants a pattern with the matrix A=${mat(A)}. One leaf of the pattern covers ${n(area)} cm² before printing. Enter det A, then the area of the printed leaf in cm².`,
  answer: [D, out],
  hints: [`The determinant is ad−bc. Here ad is ${n(a)}·${par(d)} and bc is ${n(b)}·${par(c)}.`, 'An area is never negative. Multiply the area of the leaf by the size of the determinant, without its sign.'],
  solution: `det A=${n(a)}·${par(d)} − ${par(b)}·${par(c)}=${n(ad)} − ${par(bc)}=${n(D)}. The area scale is ${n(k)}, so the printed leaf covers ${n(k)}·${n(area)}=${n(out)} cm².${D < 0 ? ' The minus sign means the leaf is printed mirrored; its area is still positive.' : ''}`,
  guidance: [
   { prompt: `For A=${mat(A)}, enter the two products ad and bc.`, answer: [ad, bc], explanation: `ad=${n(a)}·${par(d)}=${n(ad)} and bc=${n(b)}·${par(c)}=${n(bc)}.` },
   { prompt: `Subtract: ${n(ad)} − ${par(bc)}. What is det A?`, answer: [D], explanation: `${n(ad)} − ${par(bc)} = ${n(D)}.${D < 0 ? ' A negative determinant means the printed pattern is mirrored.' : ' A positive determinant means the pattern is not mirrored.'}` },
   { prompt: `The area scale is the size of the determinant, ${n(k)}. The leaf covers ${n(area)} cm² before printing. What area does the printed leaf cover?`, answer: [out], explanation: `${n(k)}·${n(area)} = ${n(out)} cm².` }
  ] }; }
});

/* q09c: the determinant as the area of a slanted plot, then a cost. */
practice({ id: 'q09c', parent: 'q09', kind: 'applied',
 title: 'Compost for a slanted flower bed',
 brief: 'A gardener needs the area of a slanted flower bed to know how much compost to buy.',
 labels: ['determinant', 'area (m²)', 'cost ($)'], tolerance: 0.01 },
 [['determinant'], ['area (m²)'], ['cost ($)']], {
 canonical: { u: [5, 1], v: [2, 4], price: 3 },
 draw: R => { for (;;) { const u = [R.nz(-6, 6), R.nz(-6, 6)], v = [R.nz(-6, 6), R.nz(-6, 6)], k = Math.abs(u[0] * v[1] - v[0] * u[1]);
  if (k < 4 || k > 40) continue; return { u, v, price: R.int(2, 5) }; } },
 build: ({ u, v, price }) => { const M = [[u[0], v[0]], [u[1], v[1]]], ad = u[0] * v[1], bc = v[0] * u[1], D = ad - bc, k = Math.abs(D), cost = k * price; return {
  prompt: `A flower bed is a parallelogram: a rectangle pushed over to a slant. From one corner, its two sides run along the arrows u=${vec(u)} and v=${vec(v)}, in metres. Write u and v as the two columns of a matrix. This matrix turns the unit square, which has area 1 m², into the flower bed, so the area of the bed is the size of its determinant. Compost costs $${n(price)} for each square metre. Enter the determinant, then the area of the bed in m², then the cost of the compost in dollars.`,
  answer: [D, k, cost],
  hints: [`With u and v as columns the matrix is ${mat(M)}. Its determinant is ad−bc.`, 'The area is the determinant without its sign. The cost is the area times the price of one square metre.'],
  solution: `The matrix is ${mat(M)}. Determinant: ${n(u[0])}·${par(v[1])} − ${par(v[0])}·${par(u[1])}=${n(ad)} − ${par(bc)}=${n(D)}. Area: ${n(k)} m². Cost: ${n(k)}·${n(price)}=$${n(cost)}.`,
  guidance: [
   { prompt: `With u and v as columns the matrix is ${mat(M)}. Work out ad−bc: ${n(u[0])}·${par(v[1])} − ${par(v[0])}·${par(u[1])}. What is the determinant?`, answer: [D], explanation: `ad=${n(ad)} and bc=${n(bc)}, so the determinant is ${n(ad)} − ${par(bc)} = ${n(D)}.` },
   { prompt: `The area of the bed is the size of the determinant ${n(D)}, without its sign. What is the area in m²?`, answer: [k], explanation: D < 0 ? `The size of ${n(D)} is ${n(k)}, so the bed covers ${n(k)} m². The minus sign only says that v lies clockwise from u.` : `The determinant is positive, so the area is the same number: ${n(k)} m².` },
   { prompt: `Compost costs $${n(price)} for each square metre and the bed covers ${n(k)} m². What does the compost cost in dollars?`, answer: [cost], explanation: `${n(k)}·${n(price)} = $${n(cost)}.` }
  ] }; }
});

/* q09d: two maps in a row (matrix product, q08). The player finds that the determinants multiply. */
practice({ id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q08',
 title: 'Two filters, one area scale',
 brief: 'A photo passes through two filters in a row, and the editor wants the area scale of both together.',
 labels: ['det A', 'det B', 'det AB', 'area scale'], tolerance: 0.01 },
 [['det A', 'det B'], E4, ['det AB']], {
 canonical: { A: [[2, 1], [0, -1]], B: [[1, 2], [-1, 1]] },
 draw: R => { for (;;) { const e = () => R.int(-3, 3), A = [[e(), e()], [e(), e()]], B = [[e(), e()], [e(), e()]], dA = det2(A), dB = det2(B);
  if (zeros(A.flat()) > 1 || zeros(B.flat()) > 1 || dA === 0 || dB === 0 || same(A, B)) continue;
  if (Math.abs(dA * dB) < 2 || Math.abs(dA * dB) > 30) continue; return { A, B }; } },
 build: ({ A, B }) => { const P = mul(A, B), dA = det2(A), dB = det2(B), dP = det2(P), k = Math.abs(dP);
  const dt = M => `${n(M[0][0])}·${par(M[1][1])} − ${par(M[0][1])}·${par(M[1][0])}`; return {
  prompt: `A photo passes through two filters. Filter B=${mat(B)} acts first, then filter A=${mat(A)}. Both filters together are the matrix AB. Enter det A, then det B, then the determinant of AB, then the area scale of the two filters together.`,
  answer: [dA, dB, dP, k],
  hints: ['Find det A and det B with ad−bc, one matrix at a time.', 'For both filters together, multiply the matrices first: each entry of AB is a row of A dotted with a column of B. Then take the determinant of AB in the same way.'],
  solution: `det A=${dt(A)}=${n(dA)}. det B=${dt(B)}=${n(dB)}. AB=${mat(P)}, so det AB=${dt(P)}=${n(dP)}. The area scale is ${n(k)}. Notice that det AB equals det A times det B: ${n(dA)}·${par(dB)}=${n(dP)}. Area scales multiply when maps follow each other.`,
  guidance: [
   { prompt: `Use ad−bc on A=${mat(A)} and on B=${mat(B)}. Enter det A, then det B.`, answer: [dA, dB], explanation: `det A=${dt(A)}=${n(dA)}. det B=${dt(B)}=${n(dB)}.` },
   { prompt: `B acts first, so both filters together are AB. Dot each row of A with each column of B. Enter AB row by row.`, answer: P.flat(), explanation: `Row one: ${dotT(A[0], col(B, 0))} = ${n(P[0][0])} and ${dotT(A[0], col(B, 1))} = ${n(P[0][1])}. Row two: ${dotT(A[1], col(B, 0))} = ${n(P[1][0])} and ${dotT(A[1], col(B, 1))} = ${n(P[1][1])}.` },
   { prompt: `Use ad−bc on AB=${mat(P)}. What is det AB?`, answer: [dP], explanation: `${dt(P)}=${n(dP)}. Its size, ${n(k)}, is the area scale of both filters together.` }
  ] }; }
});

/* ---- q10 Matrix inverse (taught: det ≠ 0; swap the diagonal, change the sign of the other two entries
        (the adjugate), divide by the determinant) ---- */
/* q10b: the inverse as "the table that goes back". Determinant ±1 or ±2: whole numbers or halves. */
practice({ id: 'q10b', parent: 'q10', kind: 'setting',
 title: 'From ratings back to goals',
 brief: 'A hockey analyst turns goals and assists into two ratings, and now needs the table that goes back the other way.',
 labels: INV4, tolerance: 0.01 },
 [['determinant'], ['adjugate 11', 'adjugate 12', 'adjugate 21', 'adjugate 22'], ['inverse 11', 'inverse 12']], {
 canonical: { A: [[3, 1], [5, 2]] },
 /* Not the matrix of the q10 mission or of its worked example. The two diagonal entries differ, so the swap shows. */
 draw: R => { for (;;) { const e = () => R.int(1, 6), A = [[e(), e()], [e(), e()]], D = Math.abs(det2(A));
  if ((D !== 1 && D !== 2) || A[0][0] === A[1][1] || same(A, [[2, 1], [1, 1]]) || same(A, [[3, 1], [2, 1]])) continue; return { A }; } },
 build: ({ A }) => { const [[a, b], [c, d]] = A, D = det2(A), adj = [[d, -b], [-c, a]], inv = adj.map(r => r.map(x => z(x / D))); return {
  prompt: `A hockey analyst turns a player's goals and assists into two ratings with the matrix A=${mat(A)}. Row one gives the attack rating and row two the team rating. She wants the matrix that turns the two ratings back into goals and assists. That matrix is the inverse, A⁻¹. Enter A⁻¹ row by row.`,
  answer: inv.flat(),
  hints: [`Start with the determinant, ad−bc: ${n(a)}·${n(d)} − ${n(b)}·${n(c)}.`, 'Swap the two diagonal entries and change the sign of the other two. Then divide every entry by the determinant.'],
  solution: `det A=${n(a)}·${n(d)} − ${n(b)}·${n(c)}=${n(D)}. Swap ${n(a)} and ${n(d)}, and change the sign of ${n(b)} and ${n(c)}: the adjugate is ${mat(adj)}. Divide every entry by ${n(D)}: A⁻¹=${mat(inv)}. Check: A times A⁻¹ gives [[1,0],[0,1]].`,
  guidance: [
   { prompt: `Work out the determinant of A=${mat(A)}: ${n(a)}·${n(d)} − ${n(b)}·${n(c)}.`, answer: [D], explanation: `${n(a * d)} − ${n(b * c)} = ${n(D)}. It is not zero, so A has an inverse.` },
   { prompt: `Swap the diagonal entries ${n(a)} and ${n(d)}, and change the sign of the other two entries. Enter this new matrix (the adjugate) row by row.`, answer: adj.flat(), explanation: `The adjugate is ${mat(adj)}. Only the entries off the diagonal change sign.` },
   { prompt: `Divide the first row of the adjugate, ${vec(adj[0])}, by the determinant ${n(D)}. Enter the first row of A⁻¹.`, answer: inv[0], explanation: `${n(adj[0][0])} ÷ ${par(D)} = ${n(inv[0][0])} and ${n(adj[0][1])} ÷ ${par(D)} = ${n(inv[0][1])}. The second row is divided in the same way: ${vec(inv[1])}.` }
  ] }; }
});

/* q10c: the inverse is used to recover two unknown amounts from two totals. */
practice({ id: 'q10c', parent: 'q10', kind: 'applied',
 title: 'How many bags of each mix',
 brief: 'A café knows how many scoops of nuts and raisins it used today, and wants to know how many bags of each trail mix that made.',
 labels: ['Sunrise bags', 'Dusk bags'], tolerance: 0.01 },
 [['determinant'], INV4, ['Sunrise bags', 'Dusk bags']], {
 canonical: { A: [[2, 3], [1, 2]], t: [13, 8] },
 /* The bag counts are whole numbers from 1 to 8 and differ from each other; the totals are A times the bag counts. */
 draw: R => { for (;;) { const e = () => R.int(1, 5), A = [[e(), e()], [e(), e()]], D = Math.abs(det2(A)), x = [R.int(1, 8), R.int(1, 8)];
  if ((D !== 1 && D !== 2) || x[0] === x[1]) continue; return { A, t: app(A, x) }; } },
 build: ({ A, t }) => { const [[a, b], [c, d]] = A, D = det2(A), adj = [[d, -b], [-c, a]], inv = adj.map(r => r.map(x => z(x / D))), x = [z((d * t[0] - b * t[1]) / D), z((a * t[1] - c * t[0]) / D)]; return {
  prompt: `A café makes two trail mixes. One bag of Sunrise uses ${n(a)} ${a === 1 ? 'scoop' : 'scoops'} of nuts and ${n(c)} ${c === 1 ? 'scoop' : 'scoops'} of raisins. One bag of Dusk uses ${n(b)} ${b === 1 ? 'scoop' : 'scoops'} of nuts and ${n(d)} ${d === 1 ? 'scoop' : 'scoops'} of raisins. Today the café used ${n(t[0])} scoops of nuts and ${n(t[1])} scoops of raisins, with nothing left over. Take A=${mat(A)}: its rows are nuts and raisins, its columns are Sunrise and Dusk. A times the bag counts gives the scoops used, so the bag counts are A⁻¹ times ${vec(t)}. Enter the number of Sunrise bags, then the number of Dusk bags.`,
  answer: x,
  hints: ['Find A⁻¹ first: work out the determinant, swap the diagonal entries, change the sign of the other two, and divide by the determinant.', `Then dot each row of A⁻¹ with the scoops used, ${vec(t)}. Row one gives the Sunrise bags.`],
  solution: `det A=${n(a)}·${n(d)} − ${n(b)}·${n(c)}=${n(D)}, so A⁻¹=${mat(inv)}. Sunrise: ${dotT(inv[0], t)} = ${n(x[0])} ${x[0] === 1 ? 'bag' : 'bags'}. Dusk: ${dotT(inv[1], t)} = ${n(x[1])} ${x[1] === 1 ? 'bag' : 'bags'}. Check with the nuts: ${dotT(A[0], x)} = ${n(t[0])}.`,
  guidance: [
   { prompt: `Work out the determinant of A=${mat(A)}: ${n(a)}·${n(d)} − ${n(b)}·${n(c)}.`, answer: [D], explanation: `${n(a * d)} − ${n(b * c)} = ${n(D)}. It is not zero, so A has an inverse and the bag counts can be recovered.` },
   { prompt: `Swap the diagonal entries of A, change the sign of the other two, and divide every entry by ${n(D)}. Enter A⁻¹ row by row.`, answer: inv.flat(), explanation: `The adjugate is ${mat(adj)}. Dividing by ${n(D)} gives A⁻¹=${mat(inv)}.` },
   { prompt: `Apply A⁻¹=${mat(inv)} to the scoops used, ${vec(t)}: dot each row with it. Enter the Sunrise bags, then the Dusk bags.`, answer: x, explanation: `Sunrise: ${dotT(inv[0], t)} = ${n(x[0])}. Dusk: ${dotT(inv[1], t)} = ${n(x[1])}.` }
  ] }; }
});

/* q10d: undoing two steps at once (matrix product, q08). Both determinants are ±1, so every entry is whole. */
practice({ id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q08',
 title: 'Undo a double scramble',
 brief: 'A code club scrambles pairs of numbers twice, and the decoder needs one matrix that undoes both scrambles.',
 labels: INV4, tolerance: 0.01 },
 [E4, ['determinant'], INV4], {
 canonical: { A: [[3, 2], [1, 1]], B: [[1, 1], [1, 2]] },
 /* AB ≠ BA, so inverting the product in the wrong order is never right. The inverse differs from AB itself,
    so entering AB is never right. A is not the matrix of the q10 mission. */
 draw: R => { for (;;) { const e = () => R.int(-2, 3), A = [[e(), e()], [e(), e()]], B = [[e(), e()], [e(), e()]];
  if (zeros(A.flat()) > 1 || zeros(B.flat()) > 1 || Math.abs(det2(A)) !== 1 || Math.abs(det2(B)) !== 1 || same(A, B)) continue;
  { const P = mul(A, B), D = det2(P); if (same(P, mul(B, A)) || same(P, [[P[1][1] / D, -P[0][1] / D], [-P[1][0] / D, P[0][0] / D]].map(r => r.map(z))) || same(A, [[2, 1], [1, 1]])) continue; }
  return { A, B }; } },
 build: ({ A, B }) => { const P = mul(A, B), [[a, b], [c, d]] = P, D = det2(P), adj = [[d, z(-b)], [z(-c), a]], inv = adj.map(r => r.map(x => z(x / D))); return {
  prompt: `A code club scrambles a pair of numbers twice: first with B=${mat(B)}, then with A=${mat(A)}. The two scrambles together are the matrix AB. The decoder needs one matrix that undoes both: the inverse of AB. Enter the inverse of AB row by row.`,
  answer: inv.flat(),
  hints: ['Multiply first. B acts first, so the product is AB: each entry is a row of A dotted with a column of B.', 'Then invert AB like any 2×2 matrix: find its determinant, swap the diagonal entries, change the sign of the other two, and divide by the determinant.'],
  solution: `AB=${mat(P)}. Its determinant is ${n(a)}·${par(d)} − ${par(b)}·${par(c)}=${n(D)}. The adjugate is ${mat(adj)}, and dividing by ${n(D)} gives the inverse of AB: ${mat(inv)}. The same matrix comes from undoing A first and B second, which is B⁻¹A⁻¹.`,
  guidance: [
   { prompt: `B acts first, so both scrambles together are AB. Dot each row of A=${mat(A)} with each column of B=${mat(B)}. Enter AB row by row.`, answer: P.flat(), explanation: `Row one: ${dotT(A[0], col(B, 0))} = ${n(a)} and ${dotT(A[0], col(B, 1))} = ${n(b)}. Row two: ${dotT(A[1], col(B, 0))} = ${n(c)} and ${dotT(A[1], col(B, 1))} = ${n(d)}.` },
   { prompt: `Work out the determinant of AB=${mat(P)}: ${n(a)}·${par(d)} − ${par(b)}·${par(c)}.`, answer: [D], explanation: `${n(z(a * d))} − ${par(z(b * c))} = ${n(D)}. It is not zero, so AB has an inverse.` },
   { prompt: `Swap the diagonal entries of AB, change the sign of the other two, and divide every entry by ${n(D)}. Enter the inverse of AB row by row.`, answer: inv.flat(), explanation: `The adjugate is ${mat(adj)}. Dividing by ${n(D)} gives ${mat(inv)}.` }
  ] }; }
});

})();
