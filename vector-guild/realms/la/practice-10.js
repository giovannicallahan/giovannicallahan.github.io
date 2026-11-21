/* Linear algebra practice missions, file 10 of 14: concepts q46–q50, three practice missions each
   (q46b q46c q46d ... q50b q50c q50d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p10.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- helpers for this file ---- */
const inv2 = P => { const [[p, q], [r, s]] = P, det = p * s - q * r; return [[s / det + 0, -q / det + 0], [-r / det + 0, p / det + 0]]; };
const mul2 = (X, Y) => X.map(r => [0, 1].map(j => r[0] * Y[0][j] + r[1] * Y[1][j]));
const app2 = (M, v) => M.map(r => r[0] * v[0] + r[1] * v[1]);
const det2 = M => M[0][0] * M[1][1] - M[0][1] * M[1][0];
const same = (X, Y) => JSON.stringify(X) === JSON.stringify(Y);
const dot = (a, b) => a.reduce((t, x, i) => t + x * b[i], 0);
/* "2×3 + (−1)×4": a dot product written out. */
const dotT = (a, b) => a.map((x, i) => `${par(x)}×${par(b[i])}`).join(' + ');
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
/* Bases with whole-number inverses (determinant 1 or −1), none of them a shear like the parent's P. */
const BASES = [[[1, 1], [1, 2]], [[2, 1], [1, 1]], [[1, 2], [1, 3]], [[3, 2], [1, 1]], [[1, 2], [1, 1]], [[1, 1], [2, 1]], [[2, 1], [3, 2]], [[2, 3], [1, 1]]];
const col = (P, j) => [P[0][j], P[1][j]];

/* ---- q46 Change of basis and similarity (parent: B=P⁻¹AP for a diagonal A and a shear P) ---- */
/* q46b goes the other way: the stretch is known in the guide frame (B, diagonal) and the screen matrix A=PBP⁻¹ is asked. */
practice({ id: 'q46b', parent: 'q46', kind: 'setting',
 title: 'Stretch along slanted guides',
 brief: 'A photo editor stretches a picture along two slanted guide lines, and the screen needs the matrix in its own coordinates.',
 labels: ['A11', 'A12', 'A21', 'A22'], tolerance: 0.01 },
 [['inverse 11', 'inverse 12', 'inverse 21', 'inverse 22'], ['PB11', 'PB12', 'PB21', 'PB22'], ['A11', 'A12']], {
 canonical: { d: [4, 2], P: [[1, 2], [1, 3]] },
 /* Two different whole stretch factors; the wrong order P⁻¹BP never equals PBP⁻¹. */
 draw: R => { let p, guard = 0; do { const d1 = R.int(2, 6); p = { d: [d1, R.except(2, 6, [d1])], P: R.pick(BASES) }; }
  while (guard++ < 200 && same(mul2(mul2(inv2(p.P), [[p.d[0], 0], [0, p.d[1]]]), p.P), mul2(mul2(p.P, [[p.d[0], 0], [0, p.d[1]]]), inv2(p.P)))); return p; },
 build: ({ d, P }) => { const B = [[d[0], 0], [0, d[1]]], Pi = inv2(P), PB = mul2(P, B), A = mul2(PB, Pi), b1 = col(P, 0), b2 = col(P, 1), det = det2(P); return {
  prompt: `A photo editor stretches a picture along two slanted guide lines. In screen coordinates the guide directions are b₁=${vec(b1)} and b₂=${vec(b2)}; they are the columns of P=${mat(P)}. Measured along the guides the stretch is the diagonal matrix B=${mat(B)}: it multiplies by ${n(d[0])} along b₁ and by ${n(d[1])} along b₂. Because B=P⁻¹AP, the same stretch in screen coordinates is A=PBP⁻¹. Enter A row by row: A11, A12, A21, A22.`,
  answer: [A[0][0], A[0][1], A[1][0], A[1][1]],
  hints: [`P⁻¹ comes from the 2×2 rule: swap the diagonal entries, change the sign of the other two, and divide by the determinant of P.`,
   `Work in two products. First PB: because B is diagonal, it multiplies column 1 of P by ${n(d[0])} and column 2 by ${n(d[1])}. Then multiply that result by P⁻¹ on its right.`],
  solution: `The determinant of P is ${n(det)}, so P⁻¹=${mat(Pi)}. PB=${mat(PB)}. Then A=(PB)P⁻¹=${mat(A)}. Check: A times b₁=${vec(b1)} is ${vec(app2(A, b1))}, which is ${n(d[0])} times b₁, as the stretch demands.`,
  guidance: [
   { prompt: `The determinant of P=${mat(P)} is ${n(det)}. Use the 2×2 rule to enter P⁻¹ row by row.`, answer: [Pi[0][0], Pi[0][1], Pi[1][0], Pi[1][1]], explanation: `Swap the diagonal entries, change the sign of the other two and divide by ${n(det)}: P⁻¹=${mat(Pi)}.` },
   { prompt: `B=${mat(B)} is diagonal, so PB is P with column 1 multiplied by ${n(d[0])} and column 2 multiplied by ${n(d[1])}. Enter PB row by row.`, answer: [PB[0][0], PB[0][1], PB[1][0], PB[1][1]], explanation: `Column 1 becomes ${vec(col(PB, 0))} and column 2 becomes ${vec(col(PB, 1))}: PB=${mat(PB)}.` },
   { prompt: `Multiply PB=${mat(PB)} by P⁻¹=${mat(Pi)} on its right. Enter the top row of A.`, answer: A[0], explanation: `A11=${dotT(PB[0], col(Pi, 0))}=${n(A[0][0])} and A12=${dotT(PB[0], col(Pi, 1))}=${n(A[0][1])}. The bottom row of A uses the bottom row of PB in the same way.` }
  ] }; }
});

/* q46c: coordinates in the new frame, the diagonal B, and one step taken in that frame. A=PDP⁻¹ is not diagonal. */
practice({ id: 'q46c', parent: 'q46', kind: 'applied',
 title: 'Feedback loop in the mode frame',
 brief: 'A sound crew wants to follow a feedback loop in the frame where its two modes do not mix.',
 labels: ['mode coordinate 1', 'mode coordinate 2', 'B11', 'B22', 'next coordinate 1', 'next coordinate 2'], tolerance: 0.01 },
 [['mode coordinate 1', 'mode coordinate 2'], ['B11', 'B22'], ['next coordinate 1', 'next coordinate 2']], {
 canonical: { A: [[5, -2], [3, 0]], P: [[1, 2], [1, 3]], x: [-1, -4] },
 /* A=PDP⁻¹ with D=diag(d1,d2), x=Pc, all whole numbers. Using P where P⁻¹ belongs changes both the coordinates and the diagonal. */
 draw: R => { for (let guard = 0; guard < 400; guard++) {
   const P = R.pick(BASES), d1 = R.pick([-3, -2, -1, 2, 3, 4]), d2 = R.pick([-3, -2, -1, 2, 3, 4].filter(z => z !== d1)), c = [R.nz(-3, 3), R.nz(-3, 3)];
   const D = [[d1, 0], [0, d2]], Pi = inv2(P), A = mul2(mul2(P, D), Pi), x = app2(P, c), W = mul2(mul2(P, A), Pi), px = app2(P, x);
   if (A.flat().some(z => Math.abs(z) > 15) || W[0][0] === d1 || W[1][1] === d2 || px[0] === c[0] || px[1] === c[1]) continue;
   return { A, P, x };
  } return { A: [[5, -2], [3, 0]], P: [[1, 2], [1, 3]], x: [-1, -4] }; },
 build: ({ A, P, x }) => { const Pi = inv2(P), c = app2(Pi, x), AP = mul2(A, P), B = mul2(Pi, AP), d = [B[0][0], B[1][1]], b1 = col(P, 0), b2 = col(P, 1), nx = [d[0] * c[0], d[1] * c[1]], Ax = app2(A, x); return {
  prompt: `Two microphones and two speakers form a feedback loop. Each trip round the loop turns the signal pair x into Ax, with A=${mat(A)}. The sound crew works in a mode frame with basis vectors b₁=${vec(b1)} and b₂=${vec(b2)}, the columns of P=${mat(P)}. In that frame the loop's matrix B=P⁻¹AP is diagonal. The signal now is x=${vec(x)}. Enter its mode-frame coordinates P⁻¹x, first then second. Then enter B11 and B22. Then enter the mode-frame coordinates after one trip round the loop, first then second.`,
  answer: [c[0], c[1], d[0], d[1], nx[0], nx[1]],
  hints: [`P⁻¹ follows the 2×2 rule: swap the diagonal entries, change the sign of the other two, and divide by the determinant of P. The mode-frame coordinates are P⁻¹ times x.`,
   `For B, work out AP first, one column at a time: each column of AP is A times a basis vector. Then multiply by P⁻¹ on the left.`,
   `A diagonal B acts on each mode coordinate on its own: the first is multiplied by B11 and the second by B22.`],
  solution: `P⁻¹=${mat(Pi)}, so the mode-frame coordinates are P⁻¹x=${vec(c)}. AP=${mat(AP)}: its columns are ${n(d[0])} times b₁ and ${n(d[1])} times b₂, so B=P⁻¹AP=${mat(B)}. One trip multiplies the first coordinate by ${n(d[0])} and the second by ${n(d[1])}: ${vec(c)} becomes ${vec(nx)}. Check in the old frame: Ax=${vec(Ax)}, and ${n(nx[0])} times b₁ plus ${par(nx[1])} times b₂ is that same vector.`,
  guidance: [
   { prompt: `P⁻¹=${mat(Pi)}. Multiply it by x=${vec(x)}. Enter the two mode-frame coordinates.`, answer: c, explanation: `Row 1: ${dotT(Pi[0], x)}=${n(c[0])}. Row 2: ${dotT(Pi[1], x)}=${n(c[1])}. Check: ${n(c[0])} times b₁ plus ${par(c[1])} times b₂ gives back x=${vec(x)}.` },
   { prompt: `A times b₁=${vec(b1)} is ${vec(col(AP, 0))}, which is b₁ multiplied by one number. A times b₂=${vec(b2)} is ${vec(col(AP, 1))}, which is b₂ multiplied by another. Those two numbers are B11 and B22. Enter them.`, answer: d, explanation: `${vec(col(AP, 0))} is ${n(d[0])} times ${vec(b1)}, and ${vec(col(AP, 1))} is ${n(d[1])} times ${vec(b2)}. So AP is P with its columns scaled, and P⁻¹AP=${mat(B)}.` },
   { prompt: `In the mode frame one trip multiplies the first coordinate by ${n(d[0])} and the second by ${n(d[1])}. Start from ${vec(c)}. Enter the coordinates after one trip.`, answer: nx, explanation: `${n(d[0])}×${par(c[0])}=${n(nx[0])} and ${n(d[1])}×${par(c[1])}=${n(nx[1])}. In the mode frame the two coordinates never mix.` }
  ] }; }
});

/* q46d: a full (non-diagonal) A and a non-shear P, then the determinant (q09) as the check that similarity keeps it. */
practice({ id: 'q46d', parent: 'q46', kind: 'challenge', uses: 'q09',
 title: 'Robot arm in its joint frame',
 brief: 'A robot arm controller is written in workshop coordinates, and the arm needs it in its own joint frame.',
 labels: ['B11', 'B12', 'B21', 'B22', 'determinant of B'], tolerance: 0.01 },
 [['AP11', 'AP12', 'AP21', 'AP22'], ['B11', 'B12'], ['B21', 'B22'], ['determinant of B']], {
 canonical: { A: [[2, 1], [-1, 3]], P: [[2, 1], [1, 1]] },
 /* No zero off the diagonal of A; B stays small (entries up to 12, so the determinant is workable by hand); the wrong order PAP⁻¹ gives a different matrix; det(A) is not 0. */
 draw: R => { for (let guard = 0; guard < 400; guard++) {
   const A = [[R.int(-4, 5), R.nz(-4, 5)], [R.nz(-4, 5), R.int(-4, 5)]], P = R.pick(BASES), Pi = inv2(P), B = mul2(Pi, mul2(A, P));
   if (det2(A) === 0 || B.flat().some(z => Math.abs(z) > 12) || same(B, mul2(P, mul2(A, Pi))) || same(B, A)) continue;
   return { A, P };
  } return { A: [[2, 1], [-1, 3]], P: [[2, 1], [1, 1]] }; },
 build: ({ A, P }) => { const Pi = inv2(P), AP = mul2(A, P), B = mul2(Pi, AP), b1 = col(P, 0), b2 = col(P, 1), dP = det2(P), dB = det2(B); return {
  prompt: `A robot arm's controller turns a joint command x into Ax, with A=${mat(A)} in workshop coordinates. The arm's own joint frame has basis vectors b₁=${vec(b1)} and b₂=${vec(b2)}, the columns of P=${mat(P)}. Enter the controller in the joint frame, B=P⁻¹AP, row by row: B11, B12, B21, B22. Then enter the determinant of B. A change of basis leaves the determinant alone, so compare it with the determinant of A as a check.`,
  answer: [B[0][0], B[0][1], B[1][0], B[1][1], dB],
  hints: [`Find P⁻¹ with the 2×2 rule: swap the diagonal entries, change the sign of the other two, and divide by the determinant of P, which is ${n(dP)}.`,
   `Work out AP first, then multiply by P⁻¹ on the left. The order matters: PAP⁻¹ is a different matrix.`,
   `The determinant of a 2×2 matrix is (top left × bottom right) − (top right × bottom left).`],
  solution: `P⁻¹=${mat(Pi)} and AP=${mat(AP)}. B=P⁻¹(AP)=${mat(B)}. Its determinant is ${par(B[0][0])}×${par(B[1][1])} − ${par(B[0][1])}×${par(B[1][0])}=${n(dB)}. The determinant of A is ${par(A[0][0])}×${par(A[1][1])} − ${par(A[0][1])}×${par(A[1][0])}=${n(det2(A))}, the same number, as it must be.`,
  guidance: [
   { prompt: `Multiply A=${mat(A)} by P=${mat(P)}. Each column of AP is A times a basis vector. Enter AP row by row.`, answer: [AP[0][0], AP[0][1], AP[1][0], AP[1][1]], explanation: `A times b₁=${vec(b1)} is ${vec(col(AP, 0))} and A times b₂=${vec(b2)} is ${vec(col(AP, 1))}, so AP=${mat(AP)}.` },
   { prompt: `P⁻¹=${mat(Pi)}. Multiply its top row by the columns of AP=${mat(AP)}. Enter the top row of B.`, answer: B[0], explanation: `B11=${dotT(Pi[0], col(AP, 0))}=${n(B[0][0])} and B12=${dotT(Pi[0], col(AP, 1))}=${n(B[0][1])}.` },
   { prompt: `Now multiply the bottom row of P⁻¹, ${vec(Pi[1])}, by the columns of AP=${mat(AP)}. Enter the bottom row of B.`, answer: B[1], explanation: `B21=${dotT(Pi[1], col(AP, 0))}=${n(B[1][0])} and B22=${dotT(Pi[1], col(AP, 1))}=${n(B[1][1])}. So B=${mat(B)}.` },
   { prompt: `Find the determinant of B=${mat(B)}: (top left × bottom right) − (top right × bottom left).`, answer: [dB], explanation: `${par(B[0][0])}×${par(B[1][1])} − ${par(B[0][1])}×${par(B[1][0])}=${n(dB)}. The determinant of A is also ${n(det2(A))}: the two matrices describe the same controller.` }
  ] }; }
});

/* ---- q47 Fundamental subspaces (parent: a 2×3 matrix, four dimensions, one null vector tested against a row) ---- */
/* q47b: a tall rank-1 table (3×2, 4×2 or 4×3, never square, so n−r and m−r differ) and a test vector for Null(Aᵀ)
   that passes in about half the draws. */
practice({ id: 'q47b', parent: 'q47', kind: 'setting',
 title: 'The market stall sales table',
 brief: 'A market stall wants to know how much its sales table really says, since every day looks like a copy of the first.',
 labels: ['column dimension', 'row dimension', 'null dimension', 'left null dimension', 'y dot column 1', 'y in Null(Aᵀ)? 1 or 0'], tolerance: 0.01 },
 [['rows m', 'columns n', 'rank r'], ['null dimension', 'left null dimension'], ['y dot column 1']], {
 canonical: { u: [2, 1, 3], k: [3], y: [1, -2, 0] },
 /* u is the first column (sales of product 1 by day), k the multiples that give the other columns. */
 draw: R => { const shape = R.pick([[3, 1], [4, 1], [4, 2]]), u = [], k = [R.int(2, 4)];
  for (let i = 0; i < shape[0]; i++) u.push(R.int(1, 5));
  if (shape[1] === 2) k.push(R.except(2, 5, [k[0]]));
  const [i, j] = R.pick([[0, 1], [0, 2], [1, 2]]), y = u.map(() => 0); y[i] = u[j]; y[j] = -u[i];
  if (R.bool()) { const l = R.int(0, u.length - 1); y[l] += R.pick([-1, 1]); }
  return { u, k, y }; },
 build: ({ u, k, y }) => { const A = u.map(z => [z, ...k.map(f => f * z)]), m = u.length, N = k.length + 1, d = dot(y, u), yes = d === 0 ? 1 : 0; return {
  prompt: `A market stall logs its sales in a table A, one row per day and one column per product: A=${mat(A)} (${n(m)} days, ${n(N)} products). Every day the products sold in the same proportions, so each column is a multiple of the first. Enter the dimensions of Col(A), Row(A), Null(A) and Null(Aᵀ), in that order. Then test whether y=${vec(y)} is in Null(Aᵀ): enter the dot product of y with the first column of A, then 1 if y is in Null(Aᵀ) or 0 if it is not.`,
  answer: [1, 1, N - 1, m - 1, d, yes],
  hints: [`All the columns point along one direction, so count the independent columns. That count is the rank r, and it is the dimension of both Col(A) and Row(A).`,
   `Null(A) is a space of inputs: its dimension is the number of columns minus r. Null(Aᵀ) is a space of outputs: its dimension is the number of rows minus r.`,
   `A vector is in Null(Aᵀ) when its dot product with every column of A is zero. Here every column is a multiple of the first, so one dot product settles it.`],
  solution: `There are m=${n(m)} rows and n=${n(N)} columns. Every column is a multiple of the first, so the rank is r=1: Col(A) and Row(A) both have dimension 1. Null(A) has dimension n−r=${n(N)}−1=${n(N - 1)} and Null(Aᵀ) has dimension m−r=${n(m)}−1=${n(m - 1)}. The dot product of y with column 1 is ${dotT(y, u)}=${n(d)}. ${yes ? 'It is zero, and every column is a multiple of column 1, so y is perpendicular to all of Col(A): y is in Null(Aᵀ).' : 'It is not zero, so y is not perpendicular to Col(A): y is not in Null(Aᵀ).'}`,
  guidance: [
   { prompt: `A=${mat(A)}. Count its rows and its columns, and count the independent columns (each column is a multiple of the first). Enter m, n and the rank r.`, answer: [m, N, 1], explanation: `There are ${n(m)} rows (days) and ${n(N)} columns (products). One column gives all the others, so the rank is 1.` },
   { prompt: `Null(A) has dimension n−r and Null(Aᵀ) has dimension m−r, with m=${n(m)}, n=${n(N)} and r=1. Enter both dimensions.`, answer: [N - 1, m - 1], explanation: `n−r=${n(N)}−1=${n(N - 1)} and m−r=${n(m)}−1=${n(m - 1)}. Null(A) lives with the inputs (one number per product), Null(Aᵀ) with the outputs (one number per day).` },
   { prompt: `The first column of A is ${vec(u)}. Multiply it entry by entry with y=${vec(y)} and add. Enter the dot product.`, answer: [d], explanation: `${dotT(y, u)}=${n(d)}. ${yes ? 'Zero means y is perpendicular to column 1, and so to every column.' : 'It is not zero, so y is not perpendicular to column 1.'}` }
  ] }; }
});

/* q47c: 4 meters, 3 channels, rank 2: Null(A) has dimension 1 and Null(Aᵀ) has dimension 2, so mixing up n−r and m−r
   is always wrong. The null vector is pinned by "third component 1". */
practice({ id: 'q47c', parent: 'q47', kind: 'applied',
 title: 'The silent input on the sound desk',
 brief: 'A sound desk has more meters than channels, and the engineer wants the input that no meter can see.',
 labels: ['rank', 'null dimension', 'left null dimension', 'silent x1', 'silent x2'], tolerance: 0.01 },
 [['rows m', 'columns n', 'rank'], ['null dimension', 'left null dimension'], ['silent x1', 'silent x2']], {
 canonical: { a: 2, b: -3, c: 2, d: -1 },
 /* Rows: (1,0,a), (0,1,b), row 1 + row 2, c × row 1 + d × row 2. */
 draw: R => { const c = R.int(2, 3); return { a: R.nz(-4, 4), b: R.nz(-4, 4), c, d: R.pick([-2, -1, 2, 3].filter(z => z !== c)) }; },
 build: ({ a, b, c, d }) => { const r1 = [1, 0, a], r2 = [0, 1, b], r3 = r1.map((z, i) => z + r2[i]), r4 = r1.map((z, i) => c * z + d * r2[i]), A = [r1, r2, r3, r4], x = [-a, -b, 1];
  const comb = `${n(c)} × row 1 ${d > 0 ? 'plus' : 'minus'} ${Math.abs(d) === 1 ? '' : n(Math.abs(d)) + ' × '}row 2`; return {
  prompt: `A sound desk has 3 input channels and 4 level meters. The meter readings are Ax, where x lists the three channel levels and A=${mat(A)}. Meters 3 and 4 are wired from the first two: row 3 is row 1 plus row 2, and row 4 is ${comb}. Enter the rank of A, then the dimension of Null(A), then the dimension of Null(Aᵀ). Then enter a silent input, a null vector with third component 1 that moves no meter: its first component, then its second.`,
  answer: [2, 1, 2, -a, -b],
  hints: [`Rows 3 and 4 are built from rows 1 and 2, so they add nothing new. Count the rows that are left, and check that neither is a multiple of the other.`,
   `Null(A) is a space of inputs: its dimension is the number of columns minus the rank. Null(Aᵀ) is a space of outputs: its dimension is the number of rows minus the rank.`,
   `For the silent input, set the third component to 1 and use rows 1 and 2: each of them must give a reading of zero.`],
  solution: `Rows 1 and 2 are independent and rows 3 and 4 are built from them, so the rank is 2. A has n=3 columns and m=4 rows: Null(A) has dimension 3−2=1 and Null(Aᵀ) has dimension 4−2=2. With x₃=1, row 1 says x₁${plus(a)}=0 and row 2 says x₂${plus(b)}=0, so the silent input is ${vec(x)}. Rows 3 and 4 then give zero as well: ${dotT(r3, x)}=0 and ${dotT(r4, x)}=0.`,
  guidance: [
   { prompt: `A=${mat(A)}. Count its rows m and its columns n. Rows 3 and 4 are built from rows 1 and 2, and rows 1 and 2 are not multiples of each other. Enter m, n and the rank.`, answer: [4, 3, 2], explanation: `There are 4 meters (rows) and 3 channels (columns). Only rows 1 and 2 are independent, so the rank is 2.` },
   { prompt: `Null(A) has dimension n−r and Null(Aᵀ) has dimension m−r. Enter both.`, answer: [1, 2], explanation: `n−r=3−2=1: one direction of input is invisible. m−r=4−2=2: two directions of meter readings can never appear.` },
   { prompt: `Set x₃=1. Row 1, ${vec(r1)}, must give x₁${plus(a)}=0, and row 2, ${vec(r2)}, must give x₂${plus(b)}=0. Enter x₁ and x₂.`, answer: [-a, -b], explanation: `x₁=${n(-a)} and x₂=${n(-b)}, so the silent input is ${vec(x)}. Row 3 checks: ${dotT(r3, x)}=0.` }
  ] }; }
});

/* q47d: one row a, so Row(A) is the line along a and Null(A) the line perpendicular to it; the split of x uses the
   projection of q18. x = s·a + t·(−a2, a1) with whole s and t, so every part is a whole number. */
practice({ id: 'q47d', parent: 'q47', kind: 'challenge', uses: 'q18',
 title: 'What the wind gauge cannot see',
 brief: 'A single wind gauge sees only part of the wind, and the mast crew wants the seen part and the unseen part.',
 labels: ['null dimension', 'row part east', 'row part north', 'null part east', 'null part north'], tolerance: 0.01 },
 [['a dot x', 'a dot a'], ['row part east', 'row part north'], ['null part east', 'null part north']], {
 canonical: { a: [2, 1], x: [8, -1] },
 draw: R => { let a; do { a = [R.int(1, 3), R.nz(-3, 3)]; } while (gcd(a[0], a[1]) !== 1); const s = R.nz(-3, 3), t = R.nz(-3, 3); return { a, x: [s * a[0] - t * a[1], s * a[1] + t * a[0]] }; },
 build: ({ a, x }) => { const ax = dot(a, x), aa = dot(a, a), s = ax / aa, row = a.map(z => s * z + 0), nul = x.map((z, i) => z - row[i] + 0); return {
  prompt: `A wind gauge on a mast gives one reading: the dot product of a=${vec(a)} with the wind x=(east, north). As a matrix the gauge is the single row A=${mat([a])}, with 1 row and 2 columns. Every wind splits into a part in Row(A), which the gauge measures, and a part in Null(A), which it cannot see; the two parts are perpendicular. For the wind x=${vec(x)} m/s enter the dimension of Null(A), then the Row(A) part (east, then north), then the Null(A) part (east, then north).`,
  answer: [1, row[0], row[1], nul[0], nul[1]],
  hints: [`A single row that is not all zeros has rank 1. Null(A) has dimension (number of columns) minus the rank.`,
   `Row(A) is the line along a. The Row(A) part of x is its projection onto a: a times (a·x)/(a·a).`,
   `The Null(A) part is what is left: x minus the Row(A) part. Its dot product with a must be zero.`],
  solution: `A has 2 columns and rank 1, so Null(A) has dimension 2−1=1. a·x=${dotT(a, x)}=${n(ax)} and a·a=${dotT(a, a)}=${n(aa)}, so the Row(A) part is (${n(ax)}/${n(aa)})a=${n(s)}×${vec(a)}=${vec(row)}. The Null(A) part is ${vec(x)}−${vec(row)}=${vec(nul)}. Check: a·${vec(nul)}=${dotT(a, nul)}=0, so the gauge reads nothing from that part.`,
  guidance: [
   { prompt: `Work out the two dot products for the projection: a·x with a=${vec(a)} and x=${vec(x)}, then a·a.`, answer: [ax, aa], explanation: `a·x=${dotT(a, x)}=${n(ax)}, which is also the gauge reading. a·a=${dotT(a, a)}=${n(aa)}.` },
   { prompt: `Divide: ${n(ax)}/${n(aa)}=${n(s)}. Multiply a=${vec(a)} by that number. Enter the Row(A) part, east then north.`, answer: row, explanation: `${n(s)}×${vec(a)}=${vec(row)}. This part lies along a, the only direction the gauge measures.` },
   { prompt: `Subtract the Row(A) part ${vec(row)} from x=${vec(x)}. Enter the Null(A) part, east then north.`, answer: nul, explanation: `${vec(x)}−${vec(row)}=${vec(nul)}. Its dot product with a is ${dotT(a, nul)}=0: it is in Null(A).` }
  ] }; }
});

/* ---- q48 Affine homogeneous transforms (parent: rotate 90° counterclockwise, then translate, one point) ---- */
/* q48b: a stretch and a slide, applied to a point (last coordinate 1) and to a direction (last coordinate 0). */
practice({ id: 'q48b', parent: 'q48', kind: 'setting',
 title: 'Stretch and slide a photo',
 brief: 'A photo app stretches and slides a picture, and it must move a corner and an edge direction the right way.',
 labels: ['corner x', 'corner y', 'edge x', 'edge y'], tolerance: 0.01 },
 [['stretched x', 'stretched y'], ['corner x', 'corner y'], ['edge x', 'edge y']], {
 canonical: { s: [2, 3], t: [5, -4], pt: [3, -1], v: [1, -2] },
 /* The slide is never zero, so sliding the direction by mistake always shows. */
 draw: R => ({ s: [R.int(2, 4), R.int(2, 4)], t: [R.nz(-9, 9), R.nz(-9, 9)], pt: [R.nz(-5, 5), R.nz(-5, 5)], v: [R.nz(-4, 4), R.nz(-4, 4)] }),
 build: ({ s, t, pt, v }) => { const M = [[s[0], 0, t[0]], [0, s[1], t[1]], [0, 0, 1]], sp = [s[0] * pt[0], s[1] * pt[1]], np = [sp[0] + t[0], sp[1] + t[1]], nv = [s[0] * v[0], s[1] * v[1]]; return {
  prompt: `A photo app stretches a picture: every x is multiplied by ${n(s[0])} and every y by ${n(s[1])}. Then it slides the picture by ${vec(t)} pixels. The homogeneous matrix for both moves is M=${mat(M)}. One corner of the picture is the point ${vec([...pt, 1])}. One edge of the picture runs along the direction ${vec([...v, 0])}; a direction has last coordinate 0. Transform both with M. Enter the new corner, x then y, and then the new edge direction, x then y.`,
  answer: [np[0], np[1], nv[0], nv[1]],
  hints: [`For the corner, the last coordinate 1 switches the slide on: stretch x and y first, then add the slide.`,
   `For the edge, the last coordinate is 0, so the third column of M is multiplied by 0. A direction is stretched but never slid.`],
  solution: `Corner: M times ${vec([...pt, 1])} is (${n(s[0])}×${par(pt[0])}${plus(t[0])}, ${n(s[1])}×${par(pt[1])}${plus(t[1])}, 1)=${vec([...np, 1])}. Edge: M times ${vec([...v, 0])} is (${n(s[0])}×${par(v[0])}, ${n(s[1])}×${par(v[1])}, 0)=${vec([...nv, 0])}. The slide moved the corner but left the direction alone.`,
  guidance: [
   { prompt: `Stretch the corner ${vec(pt)} before any slide: multiply x by ${n(s[0])} and y by ${n(s[1])}.`, answer: sp, explanation: `${n(s[0])}×${par(pt[0])}=${n(sp[0])} and ${n(s[1])}×${par(pt[1])}=${n(sp[1])}.` },
   { prompt: `Now add the slide ${vec(t)} to ${vec(sp)}. Enter the new corner.`, answer: np, explanation: `${vec(sp)} moved by ${vec(t)} is ${vec(np)}. The last coordinate stays 1: it is still a point.` },
   { prompt: `The edge direction is ${vec([...v, 0])}. Its last coordinate 0 switches the slide off. Stretch it and enter the new direction.`, answer: nv, explanation: `${n(s[0])}×${par(v[0])}=${n(nv[0])} and ${n(s[1])}×${par(v[1])}=${n(nv[1])}. Nothing is added, because the third column of M meets a 0.` }
  ] }; }
});

/* q48c: the opposite order from the parent (slide first, then turn), built as one matrix M=RT. rot: 0 = quarter turn
   counterclockwise, 1 = quarter turn clockwise, 2 = half turn. */
const TURNS = [
 { name: 'a quarter turn counterclockwise (90°)', R: [[0, -1], [1, 0]], rule: '(x, y) to (−y, x)' },
 { name: 'a quarter turn clockwise (90°)', R: [[0, 1], [-1, 0]], rule: '(x, y) to (y, −x)' },
 { name: 'a half turn (180°)', R: [[-1, 0], [0, -1]], rule: '(x, y) to (−x, −y)' }];
practice({ id: 'q48c', parent: 'q48', kind: 'applied',
 title: 'Warehouse robot: slide, then turn',
 brief: 'A warehouse robot replans its floor map with a slide followed by a turn, and wants one matrix for both.',
 labels: ['M13', 'M23', 'new x', 'new y'], tolerance: 0.01 },
 [['M13', 'M23'], ['slid x', 'slid y'], ['new x', 'new y']], {
 canonical: { rot: 1, t: [2, -3], pt: [4, 1] },
 /* The slid shelf never lands on an axis, so both of its coordinates are turned into something visible. */
 draw: R => { let p; do { p = { rot: R.int(0, 2), t: [R.nz(-6, 6), R.nz(-6, 6)], pt: [R.nz(-6, 6), R.nz(-6, 6)] }; } while (p.pt[0] + p.t[0] === 0 || p.pt[1] + p.t[1] === 0); return p; },
 build: ({ rot, t, pt }) => { const T = TURNS[rot], R2 = T.R, R3 = [[...R2[0], 0], [...R2[1], 0], [0, 0, 1]], T3 = [[1, 0, t[0]], [0, 1, t[1]], [0, 0, 1]], rt = app2(R2, t).map(z => z + 0), sl = [pt[0] + t[0], pt[1] + t[1]], np = app2(R2, sl).map(z => z + 0), M = [[...R2[0], rt[0]], [...R2[1], rt[1]], [0, 0, 1]]; return {
  prompt: `A warehouse robot replans its floor map in two moves. First it slides every point by ${vec(t)} m: T=${mat(T3)}. Then it turns the map by ${T.name} about the origin: R=${mat(R3)}. The slide comes first, so the single matrix for both moves is M=RT, with T next to the point. Enter the third column of M: M13, then M23. Then enter where the shelf at the point ${vec([...pt, 1])} ends up: new x, then new y.`,
  answer: [rt[0], rt[1], np[0], np[1]],
  hints: [`Multiply R by T one column at a time. The first two columns of T are those of the identity matrix, so the first two columns of M are those of R.`,
   `The third column of M is R times the third column of T: the slide itself gets turned.`,
   `For the shelf, multiply M by the point, or do the moves in order: slide first, then turn. This turn sends ${T.rule}.`],
  solution: `M=RT. Its third column is R times ${vec([...t, 1])}: the turn sends ${T.rule}, so ${vec(t)} becomes ${vec(rt)} and M=${mat(M)}. The shelf: slide ${vec(pt)} by ${vec(t)} to get ${vec(sl)}, then turn it to get ${vec(np)}. M times ${vec([...pt, 1])} gives the same point, ${vec([...np, 1])}.`,
  guidance: [
   { prompt: `The third column of M=RT is R times the slide column ${vec([...t, 1])}. This turn sends ${T.rule}. Turn the slide ${vec(t)} and enter M13 and M23.`, answer: rt, explanation: `${vec(t)} turns into ${vec(rt)}. So M=${mat(M)}: the turn, with a turned slide in the third column.` },
   { prompt: `Follow the shelf through the first move. Slide the point ${vec(pt)} by ${vec(t)}.`, answer: sl, explanation: `${vec(pt)} moved by ${vec(t)} is ${vec(sl)}.` },
   { prompt: `Now the second move. The turn sends ${T.rule}. Turn the slid point ${vec(sl)}.`, answer: np, explanation: `${vec(sl)} turns into ${vec(np)}. Turning first and sliding second would have given a different point, so the order matters.` }
  ] }; }
});

/* q48d: undo the parent's transform (inverse, q10): take the slide off, turn back, and read the inverse matrix's third column. */
practice({ id: 'q48d', parent: 'q48', kind: 'challenge', uses: 'q10',
 title: 'From the harbour chart back to the radar',
 brief: 'A buoy is marked on the harbour chart, and the ship needs to find it on its own radar picture.',
 labels: ['radar x', 'radar y', 'inverse 13', 'inverse 23'], tolerance: 0.01 },
 [['unslid x', 'unslid y'], ['radar x', 'radar y'], ['inverse 13', 'inverse 23']], {
 canonical: { t: [4, -1], q: [-1, -3] },
 /* q is the chart point of a whole-number radar point. tx ≠ ±ty, so undoing the two moves in the wrong order is wrong in both coordinates. */
 draw: R => { let t; do { t = [R.nz(-9, 9), R.nz(-9, 9)]; } while (Math.abs(t[0]) === Math.abs(t[1])); const p = [R.nz(-6, 6), R.nz(-6, 6)]; return { t, q: [-p[1] + t[0], p[0] + t[1]] }; },
 build: ({ t, q }) => { const M = [[0, -1, t[0]], [1, 0, t[1]], [0, 0, 1]], un = [q[0] - t[0], q[1] - t[1]], p = [un[1], -un[0] + 0], o = [-t[0], -t[1]], ic = [-t[1] + 0, t[0]], Mi = [[0, 1, ic[0]], [-1, 0, ic[1]], [0, 0, 1]]; return {
  prompt: `A harbour chart is made from a ship's radar picture by the transform M=${mat(M)}: a 90° counterclockwise turn, then a slide by ${vec(t)}. A buoy is drawn on the chart at the point ${vec([...q, 1])}. To find it on the radar picture, undo the transform: take the slide off first, then turn back 90° clockwise, which sends (x, y) to (y, −x). Enter the buoy's radar x, then its radar y. Then enter the third column of the inverse matrix M⁻¹: entry 13, then entry 23.`,
  answer: [p[0], p[1], ic[0], ic[1]],
  hints: [`Undo the last move first. The slide was done last, so subtract it from the chart point before turning back.`,
   `Turning back sends (x, y) to (y, −x): the old y becomes the new x, and the old x changes sign and becomes the new y.`,
   `M⁻¹ does the same two undo moves to every point. Its third column is where it sends the chart's origin (0, 0, 1).`],
  solution: `Take the slide off: ${vec(q)}−${vec(t)}=${vec(un)}. Turn back: (x, y) goes to (y, −x), so ${vec(un)} becomes ${vec(p)}. That is the buoy on the radar picture; check: M times ${vec([...p, 1])} is ${vec([...q, 1])}. The same two moves send the chart's origin to ${vec(o)} and then to ${vec(ic)}, so M⁻¹=${mat(Mi)}, with third column (${n(ic[0])}, ${n(ic[1])}, 1).`,
  guidance: [
   { prompt: `Take the slide ${vec(t)} off the chart point ${vec(q)}: subtract x from x and y from y.`, answer: un, explanation: `${vec(q)}−${vec(t)}=${vec(un)}. This is the point just after the turn and before the slide.` },
   { prompt: `Turn ${vec(un)} back 90° clockwise: (x, y) goes to (y, −x). Enter the radar point.`, answer: p, explanation: `The y of ${vec(un)} becomes the new x, and its x changes sign and becomes the new y: ${vec(p)}.` },
   { prompt: `Do the same two moves to the chart's origin (0, 0). Taking the slide off gives ${vec(o)}. Turn that back, (x, y) to (y, −x), and enter the result: entries 13 and 23 of M⁻¹.`, answer: ic, explanation: `${vec(o)} turns back to ${vec(ic)}. So M⁻¹=${mat(Mi)}: the turn back, with this point in the third column.` }
  ] }; }
});

/* ---- q49 Low-rank SVD approximation (parent: diag with three values, rank 1) ---- */
/* q49b: four pattern strengths in no particular order, keep the best two. */
practice({ id: 'q49b', parent: 'q49', kind: 'setting',
 title: 'A photo kept as two patterns',
 brief: 'A phone must store a photo in less space, and it needs to know what the saving costs in accuracy.',
 labels: ['kept strength 1', 'kept strength 2', 'squared Frobenius error', 'spectral error'], tolerance: 0.01 },
 [['largest', 'second', 'third', 'smallest'], ['squared Frobenius error', 'spectral error']], {
 canonical: { s: [2, 7, 5, 1] },
 /* Four different strengths, never listed from largest to smallest already. */
 draw: R => { for (let guard = 0; guard < 200; guard++) { const s = []; while (s.length < 4) { const z = R.int(1, 9); if (!s.includes(z)) s.push(z); } if (!(s[0] > s[1] && s[1] > s[2] && s[2] > s[3])) return { s }; } return { s: [2, 7, 5, 1] }; },
 build: ({ s }) => { const o = [...s].sort((x, y) => y - x), err = o[2] * o[2] + o[3] * o[3]; return {
  prompt: `A phone stores a photo as a sum of 4 patterns from its SVD. Their strengths, the singular values, are listed in the order they were found: ${s.map(n).join(', ')}. To save space the phone keeps only the 2 strongest patterns, which is the best rank-2 approximation. Enter the two strengths it keeps, larger first. Then enter the squared Frobenius error of the stored photo, and then its spectral-norm error.`,
  answer: [o[0], o[1], err, o[2]],
  hints: [`Sort the strengths from largest to smallest first. The list is not in order.`,
   `The error comes only from the patterns that are dropped. Square each dropped strength and add the squares for the squared Frobenius error. The spectral error is the largest dropped strength on its own.`],
  solution: `In order the strengths are ${o.map(n).join(', ')}. The phone keeps ${n(o[0])} and ${n(o[1])} and drops ${n(o[2])} and ${n(o[3])}. Squared Frobenius error: ${n(o[2])}²+${n(o[3])}²=${n(o[2] * o[2])}+${n(o[3] * o[3])}=${n(err)}. Spectral error: the largest dropped strength, ${n(o[2])}.`,
  guidance: [
   { prompt: `The strengths as found are ${s.map(n).join(', ')}. Enter them from largest to smallest.`, answer: o, explanation: `In order: ${o.map(n).join(', ')}. A rank-2 approximation keeps the first two and drops the last two.` },
   { prompt: `The dropped strengths are ${n(o[2])} and ${n(o[3])}. Enter the squared Frobenius error (the sum of their squares), then the spectral error (the larger of the two).`, answer: [err, o[2]], explanation: `${n(o[2])}²+${n(o[3])}²=${n(err)}, and the larger dropped strength is ${n(o[2])}.` }
  ] }; }
});

/* q49c: choose the smallest rank that meets an error limit. s is in descending order; E lies between the error at
   the answer rank and the error one rank lower, so the answer is unique. */
const tail = (s, k) => s.slice(k).reduce((t, z) => t + z * z, 0);
practice({ id: 'q49c', parent: 'q49', kind: 'applied',
 title: 'Film ratings on an error budget',
 brief: 'A film site wants the smallest ratings table that still stays inside its error limit.',
 labels: ['smallest rank k', 'squared Frobenius error', 'spectral error'], tolerance: 0.01 },
 [['error at rank 1', 'error at rank 2'], ['error at rank 3', 'smallest rank k'], ['spectral error']], {
 canonical: { s: [8, 5, 3, 2], E: 15 },
 draw: R => { const s = []; while (s.length < 4) { const z = R.int(1, 9); if (!s.includes(z)) s.push(z); } s.sort((x, y) => y - x);
  const k = R.int(1, 3), lo = tail(s, k), hi = tail(s, k - 1) - 1; return { s, E: lo + R.int(0, Math.min(hi - lo, 8)) }; },
 build: ({ s, E }) => { const T = [1, 2, 3].map(k => tail(s, k)), k = T.findIndex(z => z <= E) + 1, sq = z => `${n(z)}²`; return {
  prompt: `A film site's ratings table has 4 singular values: ${s.map(n).join(', ')}. The site wants the smallest table that is still accurate enough: the best rank-k approximation with the smallest k whose squared Frobenius error is at most ${n(E)}. Enter that smallest rank k. Then enter the squared Frobenius error at that rank, and then the spectral-norm error at that rank.`,
  answer: [k, T[k - 1], s[k]],
  hints: [`Rank k keeps the k largest singular values and drops the rest. Each dropped value adds its square to the squared Frobenius error.`,
   `Start at the lowest rank and go up one rank at a time until the error fits under the limit.`,
   `The spectral error is the largest singular value that was dropped.`],
  solution: `Rank 1 drops ${n(s[1])}, ${n(s[2])} and ${n(s[3])}: error ${sq(s[1])}+${sq(s[2])}+${sq(s[3])}=${n(T[0])}. Rank 2 drops ${n(s[2])} and ${n(s[3])}: error ${sq(s[2])}+${sq(s[3])}=${n(T[1])}. Rank 3 drops only the smallest value, ${n(s[3])}: error ${sq(s[3])}=${n(T[2])}. The limit is ${n(E)}, and the first rank that fits is k=${n(k)}, with squared Frobenius error ${n(T[k - 1])}. The largest value dropped at that rank is ${n(s[k])}, the spectral error.`,
  guidance: [
   { prompt: `The singular values are ${s.map(n).join(', ')}. Enter the squared Frobenius error at rank 1 (the first value kept, three dropped), then at rank 2 (two kept, two dropped).`, answer: [T[0], T[1]], explanation: `Rank 1: ${sq(s[1])}+${sq(s[2])}+${sq(s[3])}=${n(T[0])}. Rank 2: ${sq(s[2])}+${sq(s[3])}=${n(T[1])}.` },
   { prompt: `Enter the squared Frobenius error at rank 3 (only the smallest value, ${n(s[3])}, is dropped). Then compare the three errors ${n(T[0])}, ${n(T[1])} and this one with the limit ${n(E)}, and enter the smallest rank that fits.`, answer: [T[2], k], explanation: `Rank 3 has error ${sq(s[3])}=${n(T[2])}. Going up from rank 1, the first error that is at most ${n(E)} is ${n(T[k - 1])}, at rank ${n(k)}.` },
   { prompt: `${k === 3 ? `At rank 3 the only dropped singular value is ${n(s[3])}` : `At rank ${n(k)} the dropped singular values are ${s.slice(k, 3).map(n).join(', ')} and ${n(s[3])}`}. Enter the spectral error.`, answer: [s[k]], explanation: `The spectral error is the largest dropped singular value, ${n(s[k])}. It is not squared.` }
  ] }; }
});

/* q49d: a symmetric 2×2 block [[a,b],[b,a]] with a > |b| > 0 and a, b of the same parity (q26: eigenvalues a+b along
   (1,1) and a−b along (1,−1), both positive, so they are the singular values). The best rank-1 approximation is not
   "keep the biggest entries". */
practice({ id: 'q49d', parent: 'q49', kind: 'challenge', uses: 'q26',
 title: 'A two-by-two pixel block',
 brief: 'A picture codec squeezes a tiny pixel block down to one pattern and must report what was lost.',
 labels: ['larger singular value', 'smaller singular value', 'A₁ entry 11', 'A₁ entry 12', 'squared Frobenius error', 'spectral error'], tolerance: 0.01 },
 [['eigenvalue for (1, 1)', 'eigenvalue for (1, −1)'], ['A₁ entry 11', 'A₁ entry 12'], ['squared Frobenius error', 'spectral error']], {
 canonical: { a: 7, b: -3 },
 draw: R => { const m = R.int(1, 4), b = R.bool() ? m : -m; return { a: m + 2 * R.int(1, 3), b }; },
 build: ({ a, b }) => { const A = [[a, b], [b, a]], e1 = a + b, e2 = a - b, big = Math.max(e1, e2), small = Math.min(e1, e2), sg = b > 0 ? 1 : -1, h = big / 2, g = small / 2, dir = sg > 0 ? '(1, 1)' : '(1, −1)', A1 = [[h, sg * h], [sg * h, h]], E = [[g, -sg * g], [-sg * g, g]]; return {
  prompt: `A picture codec takes the average brightness away from a tiny 2×2 block of a picture, so an entry can be negative. What is left is A=${mat(A)}. A is symmetric, its eigenvectors lie along (1, 1) and (1, −1), and both eigenvalues are positive, so they are also its singular values. Enter the two singular values, larger first. The best rank-1 approximation A₁ keeps only the larger one: A₁ is that singular value times qqᵀ, where q is its eigenvector scaled to length 1 and qqᵀ is the 2×2 table whose entry in row i, column j is qᵢ times qⱼ. Enter entry 11 of A₁, then entry 12. Then enter the squared Frobenius error, and then the spectral-norm error.`,
  answer: [big, small, h, sg * h, small * small, small],
  hints: [`Multiply A by (1, 1) and by (1, −1). Each product is the same vector times a number: those two numbers are the eigenvalues.`,
   `(1, 1) and (1, −1) both have length √2, so every entry of qqᵀ is one half or minus one half. Multiply those entries by the larger singular value.`,
   `Only the smaller singular value is dropped, so it alone sets both errors.`],
  solution: `A times (1, 1) is ${vec([e1, e1])}, so that eigenvalue is ${n(e1)}. A times (1, −1) is ${vec([e2, -e2])}, so that eigenvalue is ${n(e2)}. The singular values are ${n(big)} and ${n(small)}. The larger belongs to ${dir}; with q=${dir}/√2, qqᵀ=${mat([[0.5, sg * 0.5], [sg * 0.5, 0.5]])} and A₁=${n(big)}qqᵀ=${mat(A1)}. The dropped singular value is ${n(small)}: squared Frobenius error ${n(small)}²=${n(small * small)}, spectral error ${n(small)}. Check: A−A₁=${mat(E)}, and its four squared entries add up to ${n(small * small)}.`,
  guidance: [
   { prompt: `Multiply A=${mat(A)} by (1, 1): each entry of the result is a row sum. Multiply A by (1, −1): the result is (1, −1) times a number. Enter the eigenvalue for (1, 1), then the eigenvalue for (1, −1).`, answer: [e1, e2], explanation: `A(1, 1)=${vec([e1, e1])}=${n(e1)}×(1, 1), and A(1, −1)=${vec([e2, -e2])}=${n(e2)}×(1, −1). Both are positive, so the singular values are ${n(big)} and ${n(small)}.` },
   { prompt: `The larger singular value ${n(big)} belongs to ${dir}. With q=${dir}/√2, qqᵀ=${mat([[0.5, sg * 0.5], [sg * 0.5, 0.5]])}. Multiply by ${n(big)} and enter entries 11 and 12 of A₁.`, answer: [h, sg * h], explanation: `${n(big)}×0.5=${n(h)}, so A₁=${mat(A1)}. Every row of A₁ is a multiple of one row: its rank is 1.` },
   { prompt: `Only the singular value ${n(small)} is dropped. Enter the squared Frobenius error, then the spectral error.`, answer: [small * small, small], explanation: `Squared Frobenius error: ${n(small)}²=${n(small * small)}. Spectral error: ${n(small)}. Subtracting entry by entry agrees: A−A₁=${mat(E)}.` }
  ] }; }
});

/* ---- q50 Engineering capstone (parent: mean of readings, two equal actuators, symmetric P, PCA fraction kept) ---- */
/* q50b: the same four tools at a water works: four readings, three equal pumps, a network told in words, and the
   variance fraction that is lost (never one half, so "kept" and "lost" cannot be mixed up unnoticed).
   q is in hundredths; cov holds the two scan variances. */
practice({ id: 'q50b', parent: 'q50', kind: 'setting',
 title: 'Switching on the water works',
 brief: 'A town water works is being switched on, and its meters, pumps, depots and pipe scan each need one check.',
 labels: ['estimated demand', 'each pump', 'mixing eigenvalue', 'variance fraction lost'], tolerance: 0.004 },
 [['estimated demand', 'each pump'], ['mixing eigenvalue'], ['total variance', 'variance fraction lost']], {
 canonical: { r: [10, 13, 11, 14], q: 20, cov: [2, 8] },
 draw: R => { let r = [10, 13, 11, 14];
  for (let guard = 0; guard < 200; guard++) { const mean = 3 * R.int(2, 9), t = [mean + R.int(-3, 3), mean + R.int(-3, 3), mean + R.int(-3, 3)]; t.push(4 * mean - t[0] - t[1] - t[2]);
   if (t.every(z => z >= 1) && new Set(t).size >= 3 && Math.abs(t[3] - mean) <= 4) { r = t; break; } }
  const total = R.pick([4, 5, 10, 10, 20, 20]), lo = R.int(1, Math.ceil(total / 2) - 1), hi = total - lo;
  return { r, q: 5 * R.except(1, 9, [5]), cov: R.bool() ? [hi, lo] : [lo, hi] }; },
 build: ({ r, q, cov }) => { const sum = r.reduce((t, z) => t + z, 0), L = sum / 4, u = L / 3, stay = (100 - q) / 100, go = q / 100, lam = (100 - 2 * q) / 100, P = [[stay, go], [go, stay]], total = cov[0] + cov[1], lo = Math.min(...cov), lost = lo / total; return {
  prompt: `A town water works is being switched on. Four meters read the same steady demand as ${r.map(n).join(', ')} litres per second; estimate the demand by equal-weight least squares. Three identical pumps must add up to that estimate with the smallest Euclidean norm. Each hour a fraction ${n(go)} of the repair crews at each of two depots moves to the other depot, so the depot network is P=${mat(P)}. A pipe scan has covariance diag${vec(cov, ',')}. Enter the estimated demand, then the command for one pump, then the eigenvalue of P that is not 1, and then the fraction of scan variance that is lost when only the stronger PCA axis is kept.`,
  answer: [L, u, lam, lost],
  hints: [`Equal-weight least squares for one steady value is the average of the readings. Identical pumps with the smallest norm share the demand equally.`,
   `P sends the difference vector (1, −1) to a multiple of itself. That multiple is the eigenvalue that is not 1.`,
   `The scan's total variance is the sum of the two diagonal entries. Keeping the stronger axis loses the smaller entry's share of that total.`],
  solution: `The estimate is the average: (${r.map(n).join('+')})/4=${n(sum)}/4=${n(L)} litres per second. Three equal pumps share it: ${n(L)}/3=${n(u)} each. P times (1, −1) is ${vec([lam, -lam])}, so the eigenvalue that is not 1 is ${n(lam)}: any imbalance between the depots is multiplied by ${n(lam)} each hour. The scan's total variance is ${n(cov[0])}+${n(cov[1])}=${n(total)}; the stronger axis keeps ${n(total - lo)} of it, so the fraction lost is ${n(lo)}/${n(total)}=${n(lost)}.`,
  guidance: [
   { prompt: `Add the four readings ${r.map(n).join(', ')} and divide by 4. Then share that demand equally between 3 pumps. Enter the estimated demand, then the command for one pump.`, answer: [L, u], explanation: `The sum is ${n(sum)}, so the average is ${n(L)}. Equal sharing gives ${n(L)}/3=${n(u)} for each pump, the smallest-norm way to reach the total.` },
   { prompt: `Multiply P=${mat(P)} by (1, −1). The result is (1, −1) times one number. Enter that number.`, answer: [lam], explanation: `Row 1 gives ${n(stay)}−${n(go)}=${n(lam)} and row 2 gives ${n(go)}−${n(stay)}=${n(-lam)}, so P(1, −1)=${n(lam)}×(1, −1).` },
   { prompt: `The scan covariance is diag${vec(cov, ',')}. Enter the total variance, then the fraction of it that the weaker axis holds (the fraction lost).`, answer: [total, lost], explanation: `Total: ${n(cov[0])}+${n(cov[1])}=${n(total)}. The weaker axis holds ${n(lo)}, so ${n(lo)}/${n(total)}=${n(lost)} is lost and ${n(1 - lost)} is kept.` }
  ] }; }
});

/* q50c: estimate a fleet, then a two-station chain that is not symmetric, so the long-run split is not half and half.
   a and b are in tenths: the fraction of station 1's bikes that go to station 2 each day, and the reverse. */
practice({ id: 'q50c', parent: 'q50', kind: 'applied',
 title: 'Bike scheme fleet check',
 brief: 'A city bike scheme wants to know its fleet size, where the bikes settle, and how fast an uneven start evens out.',
 labels: ['fleet estimate', 'long-run station 1', 'long-run station 2', 'mixing eigenvalue'], tolerance: 0.01 },
 [['fleet estimate'], ['stationary share 1', 'stationary share 2'], ['long-run station 1', 'mixing eigenvalue']], {
 canonical: { counts: [116, 121, 123], a: 2, b: 3 },
 /* a+b is 0.4 or 0.5 and the fleet is a multiple of 20, so the shares are short decimals and the bikes are whole.
    The eigenvalue 1−a−b (0.6 or 0.5) is never an entry of P or a stated fraction, so it cannot be copied from the prompt. */
 draw: R => { const [a, b] = R.pick([[1, 3], [3, 1], [1, 4], [4, 1], [2, 3], [3, 2]]), N = 20 * R.int(2, 10); let e1, e2;
  do { e1 = R.int(-6, 6); e2 = R.int(-6, 6); } while (e1 === 0 && e2 === 0);
  return { counts: [N + e1, N + e2, N - e1 - e2], a, b }; },
 build: ({ counts, a, b }) => { const sum = counts.reduce((t, z) => t + z, 0), N = sum / 3, fa = a / 10, fb = b / 10, P = [[(10 - a) / 10, fb], [fa, (10 - b) / 10]], p1 = b / (a + b), p2 = a / (a + b), s1 = N * b / (a + b), s2 = N * a / (a + b), lam = (10 - a - b) / 10; return {
  prompt: `A city bike scheme has two stations. Three night counts of the whole fleet gave ${counts.map(n).join(', ')} bikes; estimate the fleet size by equal-weight least squares. Each day a fraction ${n(fa)} of the bikes at station 1 ends the day at station 2, and a fraction ${n(fb)} of the bikes at station 2 ends the day at station 1. With the column-stochastic matrix P=${mat(P)}, the shares of the fleet follow p_next=Pp. Enter the estimated fleet size. Then enter the long-run number of bikes at station 1 and at station 2 (the stationary shares times the fleet). Then enter the eigenvalue of P that is not 1, which multiplies any imbalance each day.`,
  answer: [N, s1, s2, lam],
  hints: [`Equal-weight least squares for one steady value is the average of the counts.`,
   `In the long run the bikes leaving station 1 each day balance the bikes arriving: ${n(fa)} × (share 1) = ${n(fb)} × (share 2), and the two shares add up to 1.`,
   `P sends the difference vector (1, −1) to a multiple of itself. That multiple is the eigenvalue that is not 1.`],
  solution: `The fleet estimate is the average: ${n(sum)}/3=${n(N)} bikes. Balance: ${n(fa)}p₁=${n(fb)}p₂ with p₁+p₂=1 gives p₁=${n(fb)}/${n((a + b) / 10)}=${n(p1)} and p₂=${n(p2)}. Long-run bikes: ${n(p1)}×${n(N)}=${n(s1)} at station 1 and ${n(p2)}×${n(N)}=${n(s2)} at station 2. P times (1, −1) is ${vec([lam, -lam])}, so the other eigenvalue is ${n(lam)}: each day the gap from the long-run split is multiplied by ${n(lam)}.`,
  guidance: [
   { prompt: `Add the three counts ${counts.map(n).join(', ')} and divide by 3. Enter the fleet estimate.`, answer: [N], explanation: `The sum is ${n(sum)}, and ${n(sum)}/3=${n(N)}. The average is the equal-weight least-squares estimate of one steady value.` },
   { prompt: `Stationary shares do not change from day to day: ${n(fa)} × p₁ = ${n(fb)} × p₂, and p₁+p₂=1. Enter p₁, then p₂.`, answer: [p1, p2], explanation: `p₁=${n(fb)}/(${n(fa)}+${n(fb)})=${n(p1)} and p₂=${n(fa)}/(${n(fa)}+${n(fb)})=${n(p2)}. Check: ${n(fa)}×${n(p1)} and ${n(fb)}×${n(p2)} are the same number.` },
   { prompt: `Multiply the share p₁=${n(p1)} by the fleet of ${n(N)} bikes. Then multiply P=${mat(P)} by (1, −1) and read off the number that multiplies (1, −1). Enter the long-run bikes at station 1, then that eigenvalue.`, answer: [s1, lam], explanation: `${n(p1)}×${n(N)}=${n(s1)} bikes, which leaves ${n(s2)} at station 2. P(1, −1)=${vec([lam, -lam])}, so the eigenvalue is ${n(lam)}.` }
  ] }; }
});

/* q50d: a weighted estimate (q42) feeds three thrusters with unequal gains (the minimum-norm command is a multiple
   of g), then the variance kept by two of three PCA axes. g·g is 6 or 9 and the load is a multiple of it. */
practice({ id: 'q50d', parent: 'q50', kind: 'challenge', uses: 'q42',
 title: 'Cargo tug: unequal sensors, unequal thrusters',
 brief: 'A cargo tug is commissioned with two sensors of different quality and three thrusters of different strength.',
 labels: ['fused load', 'thruster 1', 'thruster 2', 'thruster 3', 'PCA retained fraction'], tolerance: 0.004 },
 [['weighted sum', 'weight total', 'fused load'], ['g dot g', 'multiplier'], ['thruster 1', 'thruster 2', 'thruster 3'], ['total variance', 'PCA retained fraction']], {
 canonical: { y: [20, 12], w: [3, 1], g: [1, 2, 2], cov: [3, 12, 5] },
 /* The weights differ and the readings differ, so the plain average of the two readings is never the fused load. */
 draw: R => { const g = R.pick([[1, 2, 2], [2, 1, 2], [2, 2, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1]]), gg = dot(g, g); let y, w;
  do { const L = gg * R.int(1, 4), e = R.nz(-2, 2); w = R.pick([[3, 1], [1, 3], [2, 1], [1, 2], [4, 1], [1, 4], [3, 2], [2, 3]]); y = [L + w[1] * e, L - w[0] * e]; } while (y.some(z => z < 1));
  const total = R.pick([10, 20]), lo = R.int(1, total === 10 ? 2 : 5), mid = R.int(lo + 1, Math.floor((total - lo - 1) / 2)), hi = total - lo - mid, cov = R.pick([[lo, mid, hi], [lo, hi, mid], [mid, lo, hi], [mid, hi, lo], [hi, lo, mid], [hi, mid, lo]]);
  return { y, w, g, cov }; },
 build: ({ y, w, g, cov }) => { const ws = w[0] * y[0] + w[1] * y[1], wt = w[0] + w[1], L = ws / wt, gg = dot(g, g), c = L / gg, u = g.map(z => c * z), total = cov[0] + cov[1] + cov[2], lo = Math.min(...cov), kept = (total - lo) / total; return {
  prompt: `A cargo tug is commissioned in three checks. Two sensors read the same load: ${n(y[0])} kN with weight ${n(w[0])}, and ${n(y[1])} kN with weight ${n(w[1])}; fuse them by weighted least squares. Three thrusters have gains g=${vec(g)}: each one pushes with its gain times its command, so the commands u must satisfy g·u=load. Choose the command u with the smallest Euclidean norm; that minimum-norm command is a multiple of g. A scan has covariance diag${vec(cov, ',')}. Enter the fused load, then the three thruster commands in order, and then the fraction of scan variance kept by the two strongest PCA axes.`,
  answer: [L, u[0], u[1], u[2], kept],
  hints: [`The weighted least-squares value is (sum of weight × reading) divided by (sum of the weights), not by the number of sensors.`,
   `Write the command as u=c×g. Then g·u=c×(g·g), and this must equal the fused load: that fixes c.`,
   `Two axes kept means the weakest axis is dropped. Divide the variance kept by the total variance.`],
  solution: `Fused load: (${n(w[0])}×${n(y[0])}+${n(w[1])}×${n(y[1])})/(${n(w[0])}+${n(w[1])})=${n(ws)}/${n(wt)}=${n(L)} kN. g·g=${dotT(g, g)}=${n(gg)}, so c=${n(L)}/${n(gg)}=${n(c)} and u=${n(c)}×${vec(g)}=${vec(u)}; check: g·u=${dotT(g, u)}=${n(L)}. The scan's total variance is ${cov.map(n).join('+')}=${n(total)}. Dropping the weakest axis, ${n(lo)}, keeps ${n(total - lo)}: the fraction kept is ${n(total - lo)}/${n(total)}=${n(kept)}.`,
  guidance: [
   { prompt: `Multiply each reading by its weight and add: ${n(w[0])}×${n(y[0])}+${n(w[1])}×${n(y[1])}. Add the weights. Divide the first by the second. Enter the weighted sum, the weight total and the fused load.`, answer: [ws, wt, L], explanation: `${n(w[0] * y[0])}+${n(w[1] * y[1])}=${n(ws)}, the weights add to ${n(wt)}, and ${n(ws)}/${n(wt)}=${n(L)} kN. The reading with the larger weight pulls the answer towards itself.` },
   { prompt: `The command is u=c×g with g=${vec(g)}. Enter g·g, then the multiplier c that makes c×(g·g) equal to the load ${n(L)}.`, answer: [gg, c], explanation: `g·g=${dotT(g, g)}=${n(gg)}, and c=${n(L)}/${n(gg)}=${n(c)}.` },
   { prompt: `Multiply g=${vec(g)} by c=${n(c)}. Enter the three thruster commands.`, answer: u, explanation: `u=${vec(u)}. A thruster with a larger gain gets a larger command, and g·u=${n(L)} as required.` },
   { prompt: `The scan covariance is diag${vec(cov, ',')}. Enter the total variance, then the fraction kept when the weakest axis (${n(lo)}) is dropped.`, answer: [total, kept], explanation: `Total: ${cov.map(n).join('+')}=${n(total)}. Kept: ${n(total - lo)}/${n(total)}=${n(kept)}.` }
  ] }; }
});


})();
