/* Linear algebra practice missions, file 6 of 14: concepts q26–q30, three practice missions each
   (q26b q26c q26d ... q30b q30c q30d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p6.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- add missions for q26–q30 below this line ---- */

/* Small helpers shared by this file. */
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const mul2 = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
/* Rounds float noise away (0.3/0.1 → 3) and never returns −0. */
const r6 = x => { const r = Math.round(x * 1e6) / 1e6; return Object.is(r, -0) ? 0 : r; };
/* "3²+(−4)²": the squares of the non-zero entries of a column, written out. */
const squares = c => c.filter(e => e !== 0).map(e => `${par(e)}²`).join('+');
/* Symmetric 2×2 matrix μI + k·uuᵀ: eigenvalue μ + k(u·u) along u, eigenvalue μ across it. */
const sym = (mu, k, u) => [[mu + k * u[0] * u[0], k * u[0] * u[1]], [k * u[0] * u[1], mu + k * u[1] * u[1]]];
const small = M => M.every(r => r.every(e => Math.abs(e) <= 9));
const MODES = [[1, 1], [1, -1], [2, 1], [2, -1], [1, 2], [1, -2]];
/* The parent's matrix [[2,1],[1,2]] and the matrix of its worked example, [[5,2],[2,5]]. */
const taught = M => M[0][0] === M[1][1] && ((M[0][0] === 2 && M[0][1] === 1) || (M[0][0] === 5 && M[0][1] === 2));

/* ---- q26 Spectral theorem (taught: apply the symmetric matrix to the stated mode, read the common scale factor,
        then use the perpendicular mode or the trace for the other eigenvalue). ---- */
/* Parent: a matrix and a normalised mode, two eigenvalues. Here: a stress table, and the player also finds the
   perpendicular main direction. */
practice({ id: 'q26b', parent: 'q26', kind: 'setting',
 title: 'Stress in the steel plate',
 brief: 'A strain gauge on a hull plate has returned a stress table, and the engineers need its two main directions.',
 labels: ['stress along u', 'y of the other direction', 'stress along the other direction'], tolerance: 0.01 },
 [['Su first', 'Su second'], ['y of the other direction'], ['stress along the other direction']], {
 canonical: { M: [[6, 2], [2, 3]], u: [2, 1] },
 /* Neither stress is 0, the two differ, and every entry stays a single digit. Never the parent's matrix [[2,1],[1,2]]
    or its worked example [[5,2],[2,5]]. */
 draw: R => { for (;;) { const u = R.pick(MODES), k = R.pick([1, -1, 2, -2, 3, -3]), mu = R.int(-5, 8), M = sym(mu, k, u), l = mu + k * dot(u, u);
  if (small(M) && mu !== 0 && l !== 0 && Math.abs(l) <= 15 && !taught(M)) return { M, u }; } },
 build: ({ M, u }) => { const Su = mul2(M, u), l = Su[0] / u[0], tr = M[0][0] + M[1][1], o = tr - l, y = r6(-u[0] / u[1]), Sw = mul2(M, [1, y]).map(r6), uy = u[1] === 1 ? 'y' : `${par(u[1])}×y`; return {
  prompt: `A strain gauge on a steel plate gives the stress table S=${mat(M)}, in megapascals. S is symmetric, so the plate has two perpendicular main directions. Along a main direction the plate is only pulled (a positive stress) or squeezed (a negative stress): S times that direction is the same direction times one number, its eigenvalue. One main direction is u=${vec(u)}. Enter the stress along u, then the y entry of the other main direction written as (1, y), then the stress along that other direction.`,
  answer: [l, y, o],
  hints: ['Multiply S by u, one row at a time. The result is u times one number. That number is the stress along u.', 'The other main direction is perpendicular to u, so its dot product with u is 0. For the last answer, the two stresses add up to the trace of S, the sum of its diagonal entries.'],
  solution: `Su=${vec(Su)}, which is ${n(l)} times ${vec(u)}, so the stress along u is ${n(l)}. A direction (1, y) is perpendicular to u when ${n(u[0])}+${uy}=0, so y=${n(y)}. The trace of S is ${n(M[0][0])}+${par(M[1][1])}=${n(tr)}, so the other stress is ${n(tr)}−${par(l)}=${n(o)}. Check: S times ${vec([1, y])} is ${vec(Sw)}, which is ${n(o)} times ${vec([1, y])}.`,
  guidance: [
   { prompt: `Multiply S=${mat(M)} by u=${vec(u)}. Enter the two entries of Su.`, answer: Su, explanation: `Row one: ${n(M[0][0])}×${par(u[0])}+${par(M[0][1])}×${par(u[1])}=${n(Su[0])}. Row two: ${n(M[1][0])}×${par(u[0])}+${par(M[1][1])}×${par(u[1])}=${n(Su[1])}. That is ${n(l)} times u, so the stress along u is ${n(l)}.` },
   { prompt: `A direction (1, y) is perpendicular to u=${vec(u)} when their dot product is 0: ${n(u[0])}+${uy}=0. Enter y.`, answer: [y], explanation: `${uy} must equal ${n(-u[0])}${u[1] === 1 ? '' : `, so y=${n(y)}`}. A symmetric matrix always has perpendicular main directions.` },
   { prompt: `The trace of S is ${n(M[0][0])}+${par(M[1][1])}=${n(tr)}, and the two stresses add up to it. One stress is ${n(l)}. Enter the other.`, answer: [o], explanation: `${n(tr)}−${par(l)}=${n(o)}.` }
  ] }; }
});

/* A symmetric matrix as a "scale along two perpendicular axes" tool: the point is given already split into modes. */
practice({ id: 'q26c', parent: 'q26', kind: 'applied',
 title: 'Squash and stretch',
 brief: 'An animator stretches a logo with one symmetric matrix and wants to know where a corner ends up.',
 labels: ['scale along u', 'scale along w', 'new x', 'new y'], tolerance: 0.01 },
 [['scale along u'], ['scale along w'], ['new x', 'new y']], {
 canonical: { M: [[3, 2], [2, 6]], u: [1, 2], w: [2, -1], c: [2, 3] },
 /* w is u turned a quarter turn, written with a positive first entry. Both scale factors are non-zero and differ. */
 draw: R => { for (;;) { const u = R.pick(MODES), k = R.pick([1, -1, 2, -2, 3]), mu = R.nz(-3, 6), M = sym(mu, k, u), l = mu + k * dot(u, u);
  const w = u[1] > 0 ? [u[1], -u[0]] : [-u[1], u[0]];
  if (small(M) && l !== 0 && Math.abs(l) <= 12 && !taught(M)) return { M, u, w, c: [R.int(2, 5), R.int(2, 5)] }; } },
 build: ({ M, u, w, c }) => { const Au = mul2(M, u), Aw = mul2(M, w), l1 = Au[0] / u[0], l2 = Aw[0] / w[0], p = [c[0] * u[0] + c[1] * w[0], c[0] * u[1] + c[1] * w[1]], out = mul2(M, p); return {
  prompt: `A drawing program has a squash and stretch tool with the matrix A=${mat(M)}. A is symmetric, so there are two perpendicular directions that the tool only scales. Here they are u=${vec(u)} and w=${vec(w)}. A corner of a logo sits at p=${n(c[0])}u+${n(c[1])}w, which is the point ${vec(p)}. Enter the scale factor along u, then the scale factor along w, then the point the tool moves the corner to: x, then y.`,
  answer: [l1, l2, ...out],
  hints: ['Multiply A by u. The result is u times one number, the scale factor (eigenvalue) along u. Do the same with w.', 'The tool scales the u part and the w part of p separately. Multiply each part by its own scale factor, then add the two parts.'],
  solution: `Au=${vec(Au)}, which is ${n(l1)} times u. Aw=${vec(Aw)}, which is ${n(l2)} times w. So Ap=${n(c[0])}×${par(l1)}×u+${n(c[1])}×${par(l2)}×w=${n(c[0] * l1)}×${vec(u)}+${par(c[1] * l2)}×${vec(w)}=${vec(out)}. Check: multiplying A by ${vec(p)} directly gives the same point.`,
  guidance: [
   { prompt: `Multiply A=${mat(M)} by u=${vec(u)}. The result is u times one number. Enter that scale factor.`, answer: [l1], explanation: `Au=${vec(Au)}, and each entry is ${n(l1)} times the matching entry of u.` },
   { prompt: `Now multiply A by w=${vec(w)}. Enter the scale factor along w.`, answer: [l2], explanation: `Aw=${vec(Aw)}, and each entry is ${n(l2)} times the matching entry of w. Note that u·w=0: the two directions are perpendicular.` },
   { prompt: `The corner is ${n(c[0])} times u plus ${n(c[1])} times w, so the tool sends it to ${n(c[0])}×${par(l1)}×u+${n(c[1])}×${par(l2)}×w. With u=${vec(u)} and w=${vec(w)}, enter the new point: x, then y.`, answer: out, explanation: `${n(c[0] * l1)}×${vec(u)}+${par(c[1] * l2)}×${vec(w)}=${vec(out)}.` }
  ] }; }
});

/* Challenge with q25 (powers through the modes). The diagonal entries are unequal, so the modes are not the (1, 1) and
   (1, −1) of q25c: one mode is given, the player finds the perpendicular one and splits the start with dot products,
   which works only because the modes of a symmetric matrix are perpendicular. */
practice({ id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q25',
 title: 'Three passes through the amplifiers',
 brief: 'Two linked amplifiers feed each other, and the lab wants the signal levels after three passes without multiplying three times.',
 labels: ['second entry of w', 'first level', 'second level'], tolerance: 0.01 },
 [['second entry of w'], ['eigenvalue of u', 'eigenvalue of w'], ['c', 'd'], ['first level', 'second level']], {
 canonical: { M: [[1, -2], [-2, -2]], u: [1, 2], wx: 2, s: [4, 3] },
 /* u is never (1, 1) or (1, −1), so the diagonal is unequal. w is u turned a quarter turn, with a positive first entry wx.
    Neither eigenvalue is 0 or 1, the start is never a pure mode, and the matrix is not the one of q26b or q26c as authored. */
 draw: R => { for (;;) { const u = R.pick([[2, 1], [2, -1], [1, 2], [1, -2]]), k = R.pick([1, -1, 2, -2]), mu = R.nz(-4, 5), M = sym(mu, k, u), l = mu + k * dot(u, u);
  const w = u[1] > 0 ? [u[1], -u[0]] : [-u[1], u[0]], c = R.int(1, 3), d = R.nz(-3, 3), s = [c * u[0] + d * w[0], c * u[1] + d * w[1]];
  const out = [c * l ** 3 * u[0] + d * mu ** 3 * w[0], c * l ** 3 * u[1] + d * mu ** 3 * w[1]], key = M.join();
  if (small(M) && l !== 0 && l !== 1 && mu !== 1 && Math.abs(l) <= 6 && out.every(e => Math.abs(e) < 1000) && key !== '1,-2,-2,-2' && key !== '6,2,2,3' && key !== '3,2,2,6') return { M, u, wx: w[0], s }; } },
 build: ({ M, u, wx, s }) => { const wy = r6(-u[0] * wx / u[1]), w = [wx, wy], Au = mul2(M, u), Aw = mul2(M, w), l1 = Au[0] / u[0], l2 = Aw[0] / w[0];
  const uu = dot(u, u), ww = dot(w, w), su = dot(s, u), sw = dot(s, w), c = su / uu, d = sw / ww, p1 = l1 ** 3, p2 = l2 ** 3, out = [c * p1 * u[0] + d * p2 * w[0], c * p1 * u[1] + d * p2 * w[1]];
  const uy = u[1] === 1 ? 'y' : `${par(u[1])}×y`; return {
  prompt: `Two linked amplifiers pass a signal back and forth. One pass turns the pair of signal levels s into As, with A=${mat(M)}. A is symmetric, so it has two perpendicular modes, and a pass only multiplies each mode by its eigenvalue. One mode is u=${vec(u)}. The other mode w is perpendicular to u and has first entry ${n(wx)}. The levels start at s=${vec(s)}. Enter the second entry of w, then the levels after 3 passes: first level, then second level.`,
  answer: [wy, ...out],
  hints: ['The dot product of two perpendicular arrows is 0. Use u·w=0 to find the second entry of w. Then multiply A by u and by w: each result is the mode times one number, its eigenvalue.', 'Split the start into the modes: s=cu+dw. Because u and w are perpendicular, c=(s·u)÷(u·u) and d=(s·w)÷(w·w). Each pass multiplies the u part by the eigenvalue of u and the w part by the eigenvalue of w, so 3 passes multiply each part by its eigenvalue cubed.'],
  solution: `Write w=(${n(wx)}, y). Then u·w=${n(u[0] * wx)}+${uy}=0, so y=${n(wy)} and w=${vec(w)}. Au=${vec(Au)}, which is ${n(l1)} times u. Aw=${vec(Aw)}, which is ${n(l2)} times w. Split the start: c=(s·u)÷(u·u)=${n(su)}÷${n(uu)}=${n(c)} and d=(s·w)÷(w·w)=${par(sw)}÷${n(ww)}=${n(d)}. Three passes multiply the u part by ${par(l1)}³=${n(p1)} and the w part by ${par(l2)}³=${n(p2)}. So the levels are ${n(c * p1)}×${vec(u)}+${par(d * p2)}×${vec(w)}=${vec(out)}.`,
  guidance: [
   { prompt: `Write the other mode as w=(${n(wx)}, y). It is perpendicular to u=${vec(u)}, so their dot product is 0: ${n(u[0] * wx)}+${uy}=0. Enter y, the second entry of w.`, answer: [wy], explanation: `${u[1] === 1 ? `y=${n(wy)}` : `${uy} must equal ${n(-u[0] * wx)}, so y=${n(wy)}`}. So w=${vec(w)}. A symmetric matrix always has perpendicular modes.` },
   { prompt: `Multiply A=${mat(M)} by u=${vec(u)} and by w=${vec(w)}. Each result is the mode times one number. Enter the eigenvalue of u, then the eigenvalue of w.`, answer: [l1, l2], explanation: `Au=${vec(Au)}, which is ${n(l1)} times u. Aw=${vec(Aw)}, which is ${n(l2)} times w.` },
   { prompt: `Split the start s=${vec(s)} as cu+dw. The modes are perpendicular, so c=(s·u)÷(u·u) and d=(s·w)÷(w·w). Enter c, then d.`, answer: [c, d], explanation: `s·u=${n(su)} and u·u=${n(uu)}, so c=${n(c)}. s·w=${n(sw)} and w·w=${n(ww)}, so d=${n(d)}. Check: ${n(c)}×${vec(u)}+${par(d)}×${vec(w)}=${vec(s)}.` },
   { prompt: `Three passes multiply the u part by ${par(l1)}³=${n(p1)} and the w part by ${par(l2)}³=${n(p2)}. Enter the levels after 3 passes, ${n(c)}×${par(p1)}×${vec(u)}+${par(d)}×${par(p2)}×${vec(w)}: first level, then second level.`, answer: out, explanation: `${n(c * p1)}×${vec(u)}+${par(d * p2)}×${vec(w)}=${vec(out)}. Each mode grew on its own, which is what the perpendicular modes of a symmetric matrix allow.` }
  ] }; }
});

/* ---- q27 Singular value decomposition (taught: form AᵀA, take its eigenvalues, take non-negative square roots,
        sort from largest to smallest; with perpendicular columns AᵀA is diagonal and holds the squared column lengths). ---- */
const TRIPLES = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]];
const col = (A, j) => A.map(r => r[j]);
/* Parent: singular values of a bare matrix. Here: a robot arm, and which joint owns the largest stretch. */
practice({ id: 'q27b', parent: 'q27', kind: 'setting',
 title: 'Which joint moves the hand most',
 brief: 'A two-joint robot arm is being tuned, and the team needs the strongest and weakest stretch of its motion table.',
 labels: ['largest singular value', 'smallest singular value', 'joint with the largest stretch'], tolerance: 0.01 },
 [['column 1 squared length', 'column 2 squared length'], ['largest singular value', 'smallest singular value']], {
 canonical: { A: [[0, 3], [2, 0], [0, -4]] },
 /* One column has a single entry, the other has two entries with a whole-number length (5, 10 or 13) in the other two rows,
    so the columns are perpendicular. The two lengths always differ. */
 draw: R => { for (;;) { const k = R.int(0, 2), rest = [0, 1, 2].filter(r => r !== k), sc = R.int(0, 1), s = R.nz(-9, 9), pr = R.pick(TRIPLES), sg = () => (R.bool() ? 1 : -1);
  const A = [[0, 0], [0, 0], [0, 0]]; A[k][sc] = s; A[rest[0]][1 - sc] = pr[0] * sg(); A[rest[1]][1 - sc] = pr[1] * sg();
  if (Math.abs(s) >= 2 && s * s !== pr[0] * pr[0] + pr[1] * pr[1]) return { A }; } },
 build: ({ A }) => { const c = [col(A, 0), col(A, 1)], g = c.map(v => dot(v, v)), hi = Math.max(...g), lo = Math.min(...g), s1 = Math.round(Math.sqrt(hi)), s2 = Math.round(Math.sqrt(lo)), j = g[0] > g[1] ? 1 : 2; return {
  prompt: `A robot arm has two joints. Turning joint 1 by one unit moves the hand by the first column of A, and turning joint 2 by one unit moves it by the second column, where A=${mat(A)}. Each row is one direction of the hand move (x, y, z) in centimetres. The two columns are perpendicular. Enter the largest singular value of A, then the smallest, then the number of the joint that belongs to the largest (1 or 2).`,
  answer: [s1, s2, j],
  hints: ['Form AᵀA. Because the columns are perpendicular it is diagonal, and its diagonal entries are the squared lengths of the columns: square each entry of a column and add.', 'Singular values are never negative. Take the square root of each diagonal entry of AᵀA, then sort from largest to smallest.'],
  solution: `Column 1 is ${vec(c[0])}, with squared length ${squares(c[0])}=${n(g[0])}. Column 2 is ${vec(c[1])}, with squared length ${squares(c[1])}=${n(g[1])}. So AᵀA=diag(${n(g[0])},${n(g[1])}), and the singular values are √${n(hi)}=${n(s1)} and √${n(lo)}=${n(s2)}. The largest comes from column ${n(j)}, so joint ${n(j)} moves the hand most: ${n(s1)} cm for one unit of turn.`,
  guidance: [
   { prompt: `Square each entry of column 1, ${vec(c[0])}, and add. Do the same for column 2, ${vec(c[1])}. Enter the two sums.`, answer: g, explanation: `${squares(c[0])}=${n(g[0])} and ${squares(c[1])}=${n(g[1])}. These are the diagonal entries of AᵀA, and also its eigenvalues.` },
   { prompt: `Take the square root of ${n(g[0])} and of ${n(g[1])}. Enter the largest singular value, then the smallest.`, answer: [s1, s2], explanation: `√${n(hi)}=${n(s1)} and √${n(lo)}=${n(s2)}. A minus sign inside A does not make a singular value negative.` }
  ] }; }
});

/* AᵀA is not diagonal here: equal diagonal entries, so the q26 modes (1, 1) and (1, −1) give its eigenvalues.
   A itself is not symmetric, and A×A would give the wrong answer (the parent's second pitfall). */
practice({ id: 'q27c', parent: 'q27', kind: 'applied',
 title: 'The coin that looks oval',
 brief: 'A camera lens distorts its pictures, and the optics bench wants to know how far it stretches a round coin.',
 labels: ['longest half-width', 'shortest half-width'], tolerance: 0.01 },
 [['diagonal of AᵀA', 'off-diagonal of AᵀA'], ['eigenvalue for (1, 1)', 'eigenvalue for (1, −1)'], ['longest half-width', 'shortest half-width']], {
 canonical: { A: [[3, 1], [-1, -3]] },
 /* Singular values a+b and |a−b|, both whole and different. */
 draw: R => { const a = R.int(1, 6), b = R.except(1, 6, [a]); return { A: R.bool() ? [[a, b], [-b, -a]] : [[a, -b], [b, -a]] }; },
 build: ({ A }) => { const c = [col(A, 0), col(A, 1)], D = dot(c[0], c[0]), d = dot(c[0], c[1]), G = [[D, d], [d, D]], e1 = D + d, e2 = D - d, hi = Math.round(Math.sqrt(Math.max(e1, e2))), lo = Math.round(Math.sqrt(Math.min(e1, e2))); return {
  prompt: `A camera lens distorts a picture by the matrix A=${mat(A)}. A round coin of radius 1 comes out as an oval. The longest half-width of the oval is the largest singular value of A, and the shortest half-width is the smallest singular value. The columns of A are not perpendicular, so AᵀA is not diagonal this time: you need its two eigenvalues. Enter the longest half-width, then the shortest.`,
  answer: [hi, lo],
  hints: ['Form AᵀA: each entry is one column of A dotted with a column of A. Do not use A times A.', 'Here AᵀA is symmetric with equal diagonal entries, so its modes are (1, 1) and (1, −1). Apply AᵀA to each mode to read its two eigenvalues, then take square roots.'],
  solution: `The columns of A are ${vec(c[0])} and ${vec(c[1])}. Each has squared length ${n(D)}, and their dot product is ${n(d)}, so AᵀA=${mat(G)}. AᵀA times (1, 1) is ${vec([e1, e1])}: eigenvalue ${n(e1)}. AᵀA times (1, −1) is ${vec([e2, -e2])}: eigenvalue ${n(e2)}. The square roots are ${n(Math.round(Math.sqrt(e1)))} and ${n(Math.round(Math.sqrt(e2)))}, so the longest half-width is ${n(hi)} and the shortest is ${n(lo)}.`,
  guidance: [
   { prompt: `The columns of A are ${vec(c[0])} and ${vec(c[1])}. Enter the squared length of column 1 (a diagonal entry of AᵀA), then the dot product of the two columns (the off-diagonal entry).`, answer: [D, d], explanation: `${squares(c[0])}=${n(D)}, and column 2 has the same squared length. The dot product is ${n(c[0][0])}×${par(c[1][0])}+${par(c[0][1])}×${par(c[1][1])}=${n(d)}. So AᵀA=${mat(G)}.` },
   { prompt: `Apply AᵀA=${mat(G)} to (1, 1) and to (1, −1). Each result is the mode times one number. Enter the number for (1, 1), then the number for (1, −1).`, answer: [e1, e2], explanation: `For (1, 1): ${n(D)}+${par(d)}=${n(e1)} in both rows. For (1, −1): ${n(D)}−${par(d)}=${n(e2)} in row one and the opposite in row two. These are the eigenvalues of AᵀA.` },
   { prompt: `Take the square root of ${n(e1)} and of ${n(e2)}. Enter the largest, then the smallest.`, answer: [hi, lo], explanation: `√${n(Math.max(e1, e2))}=${n(hi)} and √${n(Math.min(e1, e2))}=${n(lo)}. The oval has half-width ${n(hi)} one way and ${n(lo)} the other way.` }
  ] }; }
});

/* Challenge with q03 (dot product): a lost entry is recovered from "the columns are perpendicular", then the
   singular values are the column lengths. Columns are multiples of (1,2,2), (2,1,−2), (2,−2,1): lengths 3, 6 or 9. */
const FRAME = [[1, 2, 2], [2, 1, -2], [2, -2, 1]];
const holeMat = A => '[[' + A.map(r => r.map(e => (e === null ? 'k' : n(e))).join(',')).join('],[') + ']]';
practice({ id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q03',
 title: 'The lost entry in the sensor log',
 brief: 'One number of a sensor log was lost in transmission, and the array cannot be rated until it is recovered.',
 labels: ['lost entry k', 'largest singular value', 'smallest singular value'], tolerance: 0.01 },
 [['sum of the known products'], ['lost entry k'], ['largest singular value', 'smallest singular value']], {
 /* The lost entry is written null in the parameters; the prompt prints it as k. */
 canonical: { A: [[1, 4], [2, null], [2, -4]] },
 draw: R => { const i = R.int(0, 2), j = R.except(0, 2, [i]), s = R.int(1, 3), t = R.except(1, 3, [s]), e1 = R.bool() ? 1 : -1, e2 = R.bool() ? 1 : -1;
  const A = [0, 1, 2].map(r => [e1 * s * FRAME[i][r], e2 * t * FRAME[j][r]]); A[R.int(0, 2)][R.int(0, 1)] = null; return { A }; },
 build: ({ A }) => { const hr = A.findIndex(r => r[0] === null || r[1] === null), hc = A[hr][0] === null ? 0 : 1, o = A[hr][1 - hc], rows = [0, 1, 2].filter(r => r !== hr);
  const S = rows.reduce((t, r) => t + A[r][0] * A[r][1], 0), k = r6(-S / o), F = A.map((r, i) => (i === hr ? (hc === 0 ? [k, r[1]] : [r[0], k]) : r)), c = [col(F, 0), col(F, 1)], g = c.map(v => dot(v, v));
  const hi = Math.round(Math.sqrt(Math.max(...g))), lo = Math.round(Math.sqrt(Math.min(...g))), prods = rows.map((r, i) => `${i ? par(A[r][0]) : n(A[r][0])}×${par(A[r][1])}`).join('+'), ok = o === 1 ? 'k' : `${par(o)}×k`; return {
  prompt: `Three sensors each record two sources, and the log table is A=${holeMat(A)}. One entry was lost and is written k. The two columns of A are known to be perpendicular. Enter the lost entry k, then the largest singular value of A, then the smallest.`,
  answer: [k, hi, lo],
  hints: ['Perpendicular columns have dot product 0. Multiply the two columns row by row, add the three products, and set the sum equal to 0 to find k.', 'With perpendicular columns AᵀA is diagonal and holds the squared length of each column. The singular values are the square roots.'],
  solution: `The dot product of the columns must be 0. The two rows without k give ${prods}=${n(S)}. The row with k gives ${ok}, so ${n(S)}+${ok}=0 and k=${n(k)}. Column 1 is ${vec(c[0])}, with squared length ${squares(c[0])}=${n(g[0])}. Column 2 is ${vec(c[1])}, with squared length ${squares(c[1])}=${n(g[1])}. The singular values are the square roots: ${n(hi)} and ${n(lo)}.`,
  guidance: [
   { prompt: `Multiply the two columns of A=${holeMat(A)} row by row, in the two rows without k, and add the two products. Enter that sum.`, answer: [S], explanation: `${prods}=${n(S)}.` },
   { prompt: `The row with k adds ${ok}, and the whole dot product must be 0: ${n(S)}+${ok}=0. Enter k.`, answer: [k], explanation: `${ok} must equal ${n(-S)}${o === 1 ? '' : `, so k=${n(k)}`}.` },
   { prompt: `The columns are now ${vec(c[0])} and ${vec(c[1])}. Square the entries of each column and add, then take the two square roots. Enter the largest singular value, then the smallest.`, answer: [hi, lo], explanation: `${squares(c[0])}=${n(g[0])} and ${squares(c[1])}=${n(g[1])}. √${n(Math.max(...g))}=${n(hi)} and √${n(Math.min(...g))}=${n(lo)}.` }
  ] }; }
});

/* ---- q28 Principal component analysis (taught: total variance is the trace of the covariance matrix, the first
        principal component is the largest eigenvalue's direction, the fraction is that eigenvalue ÷ the trace). ---- */
const TESTS = ['sprint', 'jump', 'throw'];
/* Parent: two axes, fraction and direction. Here: three test scores, and the fraction kept by one and by two components. */
practice({ id: 'q28b', parent: 'q28', kind: 'setting',
 title: 'Three tests for the squad',
 brief: 'A coach has three test scores for every player and wants to know how much one or two of them already tell.',
 labels: ['fraction, first component', 'fraction, first two components'], tolerance: 0.004 }, /* answers go to hundredths: the next hundredth must not pass */
 [['total variance', 'largest variance'], ['fraction, first component'], ['fraction, first two components']], {
 canonical: { v: [6, 10, 4] },
 /* The total divides 100, so both fractions have at most two decimals. The three variances are all different. */
 draw: R => { for (;;) { const T = R.pick([10, 20, 20, 25, 25, 50, 50]), a = R.int(1, T - 2), b = R.int(1, T - 2), c = T - a - b;
  if (c >= 1 && a !== b && a !== c && b !== c) return { v: [a, b, c] }; } },
 build: ({ v }) => { const T = v[0] + v[1] + v[2], order = [0, 1, 2].sort((i, j) => v[j] - v[i]), hi = v[order[0]], mid = v[order[1]], f1 = r6(hi / T), f2 = r6((hi + mid) / T); return {
  prompt: `A coach records three test scores for every player: sprint, jump and throw. After centring (subtracting the average of each test), the covariance matrix is diagonal: [[${n(v[0])},0,0],[0,${n(v[1])},0],[0,0,${n(v[2])}]], in the order sprint, jump, throw. So each test is its own principal component, ranked by its variance. Enter the fraction of the total variance captured by the first principal component, then the fraction captured by the first two together.`,
  answer: [f1, f2],
  hints: ['The total variance is the trace: add the three diagonal entries.', 'The first principal component is the test with the largest variance, and the second is the next largest. Divide by the total. A fraction lies between 0 and 1.'],
  solution: `Total variance: ${n(v[0])}+${n(v[1])}+${n(v[2])}=${n(T)}. The largest variance is ${n(hi)} (${TESTS[order[0]]}), so the first component captures ${n(hi)}/${n(T)}=${n(f1)}. The next largest is ${n(mid)} (${TESTS[order[1]]}). Together they hold ${n(hi)}+${n(mid)}=${n(hi + mid)}, and ${n(hi + mid)}/${n(T)}=${n(f2)}.`,
  guidance: [
   { prompt: `Add the diagonal entries ${n(v[0])}, ${n(v[1])} and ${n(v[2])}. Enter the total variance, then the largest single variance.`, answer: [T, hi], explanation: `The trace is ${n(T)}. The largest entry is ${n(hi)}, the ${TESTS[order[0]]} test: that axis is the first principal component.` },
   { prompt: `Divide the largest variance by the total: ${n(hi)}/${n(T)}. Enter the fraction captured by the first component.`, answer: [f1], explanation: `${n(hi)}/${n(T)}=${n(f1)}.` },
   { prompt: `The second component is the ${TESTS[order[1]]} test, with variance ${n(mid)}. Enter the fraction captured by the first two together: (${n(hi)}+${n(mid)})/${n(T)}.`, answer: [f2], explanation: `${n(hi + mid)}/${n(T)}=${n(f2)}. Dropping the ${TESTS[order[2]]} test would lose the remaining ${n(r6(1 - f2))}.` }
  ] }; }
});

/* The player builds the covariance matrix from centred data first. The variance rule is stated in the prompt. */
const sq4 = x => x.map(e => `${par(e)}²`).join('+');
practice({ id: 'q28c', parent: 'q28', kind: 'applied',
 title: 'Coffee and tea at the café',
 brief: 'A café has four days of sales for two drinks and wants to know which one carries most of the day-to-day change.',
 labels: ['coffee variance', 'tea variance', 'variance fraction'], tolerance: 0.004 }, /* answers go to hundredths: the next hundredth must not pass */
 [['coffee variance'], ['tea variance'], ['total variance', 'variance fraction']], {
 canonical: { x: [-3, 1, -1, 3], y: [-2, -6, 6, 2] },
 /* Both lists add up to 0 (centred), their products add up to 0 (covariance 0), the variances differ and the
    fraction has at most two decimals. A list sum of 0 makes the sum of squares even, so a variance is whole or ends in .5. */
 draw: R => { for (;;) { const x = [R.int(-6, 6), R.int(-6, 6), R.int(-6, 6)], y = [R.int(-6, 6), R.int(-6, 6), R.int(-6, 6)]; x.push(-x[0] - x[1] - x[2]); y.push(-y[0] - y[1] - y[2]);
  const sx = dot(x, x), sy = dot(y, y), ok = v => Math.abs(v[3]) <= 6 && v.filter(e => e !== 0).length >= 3;
  if (ok(x) && ok(y) && dot(x, y) === 0 && sx !== sy && (100 * Math.max(sx, sy)) % (sx + sy) === 0) return { x, y }; } },
 build: ({ x, y }) => { const sx = dot(x, x), sy = dot(y, y), vx = sx / 4, vy = sy / 4, T = vx + vy, hi = Math.max(vx, vy), f = r6(hi / T), name = vx > vy ? 'coffee' : 'tea'; return {
  prompt: `A café logs four days of sales. After centring (subtracting the average of each drink), the coffee numbers are ${vec(x)} cups and the tea numbers are ${vec(y)} cups. The two lists do not move together: their covariance is 0. The variance of a centred list is the average of its squares. Enter the variance of coffee, then the variance of tea, then the fraction of the total variance captured by the first principal component.`,
  answer: [vx, vy, f],
  hints: ['Square the four coffee numbers, add them, and divide by 4. Do the same for tea.', 'The covariance matrix is diagonal, with the two variances on its diagonal. The first principal component is the drink with the larger variance. Divide that variance by the sum of both.'],
  solution: `Coffee: (${sq4(x)})/4=${n(sx)}/4=${n(vx)}. Tea: (${sq4(y)})/4=${n(sy)}/4=${n(vy)}. The covariance matrix is [[${n(vx)},0],[0,${n(vy)}]]. Total variance: ${n(vx)}+${n(vy)}=${n(T)}. The larger variance is ${n(hi)}, so the first principal component is the ${name} axis and it captures ${n(hi)}/${n(T)}=${n(f)} of the total.`,
  guidance: [
   { prompt: `Square the coffee numbers ${vec(x)}, add the squares and divide by 4. Enter the variance of coffee.`, answer: [vx], explanation: `${sq4(x)}=${n(sx)}, and ${n(sx)}/4=${n(vx)}.` },
   { prompt: `Do the same for the tea numbers ${vec(y)}. Enter the variance of tea.`, answer: [vy], explanation: `${sq4(y)}=${n(sy)}, and ${n(sy)}/4=${n(vy)}.` },
   { prompt: `The covariance matrix is [[${n(vx)},0],[0,${n(vy)}]]. Enter the total variance (the trace), then the fraction captured by the first principal component.`, answer: [T, f], explanation: `The trace is ${n(vx)}+${n(vy)}=${n(T)}. The larger variance is ${n(hi)} (${name}), and ${n(hi)}/${n(T)}=${n(f)}.` }
  ] }; }
});

/* Challenge with q26 (perpendicular modes of a symmetric matrix): the covariance is not diagonal, so the largest
   diagonal entry ÷ trace (always 0.5 here) is wrong. */
practice({ id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q26',
 title: 'The tilted cloud of GPS fixes',
 brief: 'A receiver that sits still reports a tilted cloud of positions, and the navigators want its main axis.',
 labels: ['largest eigenvalue', 'variance fraction', 'direction y'], tolerance: 0.004 },
 [['eigenvalue for (1, 1)', 'eigenvalue for (1, −1)'], ['total variance', 'variance fraction'], ['direction y']], {
 canonical: { a: 5, b: -2 },
 /* |b| < a keeps both variances positive. The fraction (a+|b|)/(2a) has at most two decimals for these a. */
 draw: R => { const a = R.pick([5, 5, 10, 10, 10, 20]), m = a === 20 ? 2 * R.int(1, 9) : R.int(1, a - 1); return { a, b: R.bool() ? m : -m }; },
 build: ({ a, b }) => { const C = [[a, b], [b, a]], e1 = a + b, e2 = a - b, hi = Math.max(e1, e2), f = r6(hi / (2 * a)), y = e1 > e2 ? 1 : -1; return {
  prompt: `A GPS receiver sits still, but its position fixes scatter. The centred east and north errors, in metres, have the covariance matrix C=${mat(C)}. C is symmetric with equal diagonal entries, so its two perpendicular modes are (1, 1) and (1, −1). The first principal component is the mode with the larger eigenvalue. Enter that larger eigenvalue, then the fraction of the total variance it captures, then the y entry of its direction written as (1, y).`,
  answer: [hi, f, y],
  hints: ['Apply C to (1, 1) and to (1, −1). Each result is the mode times one number: its eigenvalue, which is the variance along that mode.', 'The total variance is the trace of C. Divide the larger eigenvalue by it. Do not use a diagonal entry of C as the largest variance: the cloud is tilted.'],
  solution: `C times (1, 1) is ${vec([e1, e1])}: eigenvalue ${n(e1)}. C times (1, −1) is ${vec([e2, -e2])}: eigenvalue ${n(e2)}. The larger is ${n(hi)}, along (1, ${n(y)}). The total variance is the trace, ${n(a)}+${n(a)}=${n(2 * a)}, so the fraction is ${n(hi)}/${n(2 * a)}=${n(f)}.`,
  guidance: [
   { prompt: `Apply C=${mat(C)} to (1, 1) and to (1, −1). Each result is the mode times one number. Enter the number for (1, 1), then the number for (1, −1).`, answer: [e1, e2], explanation: `For (1, 1): ${n(a)}+${par(b)}=${n(e1)} in both rows. For (1, −1): ${n(a)}−${par(b)}=${n(e2)} in row one and the opposite in row two.` },
   { prompt: `The larger eigenvalue is ${n(hi)}. Enter the total variance (the trace of C), then the fraction ${n(hi)} is of it.`, answer: [2 * a, f], explanation: `The trace is ${n(a)}+${n(a)}=${n(2 * a)}, and ${n(hi)}/${n(2 * a)}=${n(f)}.` },
   { prompt: `Which mode has the eigenvalue ${n(hi)}? Enter its y entry: 1 for (1, 1), or −1 for (1, −1).`, answer: [y], explanation: `The eigenvalue ${n(hi)} belongs to (1, ${n(y)}). The cloud of fixes is longest along that diagonal.` }
  ] }; }
});

/* ---- q29 Pseudoinverse (taught: among all exact solutions pick the smallest sum of squares; identical units share
        equally; check that the shares add up to the demand). ---- */
/* Parent: two actuators, the equal split. Here: three heaters, and a lopsided plan to compare with. */
practice({ id: 'q29b', parent: 'q29', kind: 'setting',
 title: 'Three heaters, one load',
 brief: 'Three identical heaters must cover one heating load, and a lopsided plan is on the table.',
 labels: ['suggested plan, sum of squares', 'load per heater', 'minimum sum of squares'], tolerance: 0.01 },
 [['suggested plan, sum of squares'], ['load per heater'], ['minimum sum of squares']], {
 canonical: { T: 12, plan: [6, 4, 2] },
 /* The total is a multiple of 3. The suggested plan meets the demand, every heater does something, and it is not the equal split. */
 draw: R => { for (;;) { const h = R.int(2, 8), T = 3 * h, a = R.int(1, T - 2), b = R.int(1, T - 2), c = T - a - b;
  if (c >= 1 && !(a === h && b === h)) return { T, plan: [a, b, c] }; } },
 build: ({ T, plan }) => { const S = dot(plan, plan), h = T / 3, E = 3 * h * h; return {
  prompt: `Three identical heaters must deliver ${n(T)} kW in total: x₁+x₂+x₃=${n(T)}. Wear on a heater grows with the square of its load, so the best plan is the one with the smallest sum of squares x₁²+x₂²+x₃², called the minimum-norm plan. A technician suggests the plan ${vec(plan)}. Enter the sum of squares of that plan, then the load on each heater in the minimum-norm plan, then the sum of squares of the minimum-norm plan.`,
  answer: [S, h, E],
  hints: ['Square each of the three loads in the suggested plan and add the squares.', 'The heaters are identical, so the minimum-norm plan shares the total equally among the three.'],
  solution: `Suggested plan: ${squares(plan)}=${n(S)}. The heaters are identical, so the minimum-norm plan shares equally: ${n(T)}/3=${n(h)} kW each. Its sum of squares is 3×${n(h)}²=${n(E)}, which is less than ${n(S)}. Both plans deliver ${n(T)} kW.`,
  guidance: [
   { prompt: `The suggested plan is ${vec(plan)}. Square each load and add. Enter the sum of squares.`, answer: [S], explanation: `${squares(plan)}=${n(S)}.` },
   { prompt: `Equal sharing gives the smallest sum of squares for identical heaters. Enter the load on each heater: ${n(T)}/3.`, answer: [h], explanation: `${n(T)}/3=${n(h)} kW. Check: three loads of ${n(h)} add up to ${n(T)}.` },
   { prompt: `Enter the sum of squares of the equal plan (${n(h)}, ${n(h)}, ${n(h)}).`, answer: [E], explanation: `3×${n(h)}²=${n(E)}. That is ${n(S - E)} less than the suggested plan.` }
  ] }; }
});

/* A word problem around the same equal split: find the demand first, then the split, then what the split saves. */
practice({ id: 'q29c', parent: 'q29', kind: 'applied',
 title: 'Two cables to the workshop',
 brief: 'A workshop is fed by two identical cables, and the electrician wants the split that wastes the least heat.',
 labels: ['total current (A)', 'current per cable (A)', 'heat units saved'], tolerance: 0.01 },
 [['total current (A)'], ['current per cable (A)', 'heat units, two cables'], ['heat units, one cable', 'heat units saved']], {
 canonical: { m: [6, 5, 3] },
 /* The total is even, so the equal split is a whole number of amps. */
 draw: R => { for (;;) { const m = [R.int(2, 12), R.int(2, 12), R.int(2, 12)], T = m[0] + m[1] + m[2]; if (T % 2 === 0 && T <= 30) return { m }; } },
 build: ({ m }) => { const T = m[0] + m[1] + m[2], h = T / 2, two = 2 * h * h, one = T * T; return {
  prompt: `A workshop runs three machines that draw ${n(m[0])} A, ${n(m[1])} A and ${n(m[2])} A at the same time. Two identical cables feed the workshop, and together they must carry the whole current. The heat lost in a cable grows with the square of its current: count the heat of a cable as its current squared, in heat units, so 3 A gives 9 heat units. Enter the total current, then the current in each cable for the split that loses the least heat, then the heat units this split saves compared with sending the whole current down one cable.`,
  answer: [T, h, one - two],
  hints: ['Add the three machine currents first. That total is the demand: the two cable currents must add up to it.', 'Identical cables lose the least heat when the sum of the two squared currents is smallest, which is the equal split. Compare that sum with the total current squared, the heat in one cable alone.'],
  solution: `Total current: ${n(m[0])}+${n(m[1])}+${n(m[2])}=${n(T)} A. The minimum-norm split is equal: ${n(T)}/2=${n(h)} A in each cable. Heat with two cables: ${n(h)}²+${n(h)}²=${n(two)} units. Heat with one cable: ${n(T)}²=${n(one)} units. Saved: ${n(one)}−${n(two)}=${n(one - two)} units.`,
  guidance: [
   { prompt: `Add the machine currents: ${n(m[0])}+${n(m[1])}+${n(m[2])}. Enter the total current.`, answer: [T], explanation: `${n(m[0])}+${n(m[1])}+${n(m[2])}=${n(T)} A. The cable currents must satisfy x₁+x₂=${n(T)}.` },
   { prompt: `The cables are identical, so the minimum-norm split is equal. Enter the current in each cable, then the heat units of the two cables together (the two squares added).`, answer: [h, two], explanation: `${n(T)}/2=${n(h)} A each, and ${n(h)}²+${n(h)}²=${n(two)} heat units.` },
   { prompt: `One cable alone would carry ${n(T)} A. Enter its heat units, then the heat units saved by sharing.`, answer: [one, one - two], explanation: `${n(T)}²=${n(one)}, and ${n(one)}−${n(two)}=${n(one - two)}. Sharing equally halves the heat.` }
  ] }; }
});

/* Challenge with q18 (projection: the closest point, and what is left over is perpendicular): unequal coefficients,
   so the equal split of the parent is wrong (its second pitfall). The answer is αa with α = T ÷ (a·a). */
const coef = a => (a === 1 ? '' : n(a));
practice({ id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q18',
 title: 'A strong thruster and a weak one',
 brief: 'A probe has two thrusters of different strength, and the pilot wants the gentlest pair of commands that still gives the push.',
 labels: ['command 1', 'command 2'], tolerance: 0.01 },
 [['a·a'], ['α'], ['command 1', 'command 2']], {
 canonical: { a: [3, 1], T: 20 },
 /* a·a divides the demand into a whole number or a half, so both commands are whole numbers or halves. α is never 1. */
 draw: R => { const a = R.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1], [3, 4], [4, 3]]), ss = dot(a, a), al = ss % 2 === 0 ? R.pick([0.5, 1.5, 2, 2.5, 3]) : R.int(2, 5); return { a, T: al * ss }; },
 build: ({ a, T }) => { const ss = dot(a, a), al = r6(T / ss), x = [r6(al * a[0]), r6(al * a[1])]; return {
  prompt: `A probe has two thrusters of different strength. One unit of command gives ${n(a[0])} N from thruster 1 and ${n(a[1])} N from thruster 2, and the probe needs ${n(T)} N in all: ${coef(a[0])}x₁+${coef(a[1])}x₂=${n(T)}. Many pairs of commands do that. The minimum-norm pair is the point of that line closest to the origin. The shortest path from the origin meets the line at a right angle, and that direction is the coefficient vector a=${vec(a)}, so x=αa for one number α. Enter the minimum-norm commands: x₁, then x₂.`,
  answer: x,
  hints: ['Put x=αa into the demand equation. Its left side becomes α times a·a, the dot product of a with itself.', 'Equal sharing is not the answer here, because the thrusters are not equal. The stronger thruster gets the larger command.'],
  solution: `a·a=${n(a[0])}²+${n(a[1])}²=${n(ss)}. With x=αa the demand reads α×${n(ss)}=${n(T)}, so α=${n(T)}/${n(ss)}=${n(al)}. Then x=${n(al)}×${vec(a)}=${vec(x)}. Check: ${n(a[0])}×${n(x[0])}+${n(a[1])}×${n(x[1])}=${n(T)}.`,
  guidance: [
   { prompt: `The coefficient vector is a=${vec(a)}. Enter a·a, the dot product of a with itself.`, answer: [ss], explanation: `${n(a[0])}²+${n(a[1])}²=${n(ss)}.` },
   { prompt: `With x=αa the demand becomes α×${n(ss)}=${n(T)}. Enter α.`, answer: [al], explanation: `α=${n(T)}/${n(ss)}=${n(al)}.` },
   { prompt: `Multiply a=${vec(a)} by α=${n(al)}. Enter the commands: x₁, then x₂.`, answer: x, explanation: `${n(al)}×${vec(a)}=${vec(x)}. Any other pair that gives ${n(T)} N has a larger sum of squares.` }
  ] }; }
});

/* ---- q30 Condition number (taught: κ₂ = largest singular value ÷ smallest; for the asked change solve the one
        scalar equation it touches, dividing by the small coefficient). ---- */
/* Parent: κ₂ of diag(10, 0.1) and one perturbed solution. Here: a stretched map, and the same slip in both directions. */
practice({ id: 'q30b', parent: 'q30', kind: 'setting',
 title: 'The stretched hiking map',
 brief: 'A hiking map is drawn with two different scales, and a walker wants to know how far a small ruler slip can throw a position off.',
 labels: ['condition number', 'east error (km)', 'north error (km)'], tolerance: 0.004 }, /* answers go to hundredths: the next hundredth must not pass */
 [['largest singular value', 'smallest singular value'], ['condition number'], ['east error (km)', 'north error (km)']], {
 canonical: { a: 10, c: 0.5, s: 2 },
 draw: R => ({ a: R.pick([2, 4, 5, 10, 20]), c: R.pick([0.2, 0.25, 0.5]), s: R.int(1, 3) }),
 build: ({ a, c, s }) => { const k = r6(a / c), e = r6(s / a), f = r6(s / c); return {
  prompt: `A hiking map is stretched: 1 km east is drawn as ${n(a)} cm, but 1 km north is drawn as only ${n(c)} cm. So the map turns a real position x, in km, into a drawn position Ax, in cm, with A=diag(${n(a)},${n(c)}). Enter the condition number κ₂(A). Then a ruler slips by ${n(s)} cm on the map: enter the error this makes in the real position if the slip is in the east direction, then if it is in the north direction, both in km.`,
  answer: [k, e, f],
  hints: ['The singular values of a diagonal matrix with positive entries are the entries themselves. Divide the largest by the smallest.', 'To go from the map back to the ground, divide the slip by the scale of that direction. Do not multiply by it.'],
  solution: `The singular values are ${n(a)} and ${n(c)}, so κ₂=${n(a)}/${n(c)}=${n(k)}. East: ${n(a)}×error=${n(s)}, so the error is ${n(s)}/${n(a)}=${n(e)} km. North: ${n(c)}×error=${n(s)}, so the error is ${n(s)}/${n(c)}=${n(f)} km. The weakly drawn direction turns the same slip into an error ${n(k)} times as large.`,
  guidance: [
   { prompt: `For A=diag(${n(a)},${n(c)}), enter the largest singular value, then the smallest.`, answer: [a, c], explanation: `Both diagonal entries are positive, so they are the singular values: ${n(a)} and ${n(c)}.` },
   { prompt: `Divide the largest by the smallest: ${n(a)}/${n(c)}. Enter κ₂.`, answer: [k], explanation: `${n(a)}/${n(c)}=${n(k)}.` },
   { prompt: `A slip of ${n(s)} cm east means ${n(a)}×error=${n(s)}. A slip of ${n(s)} cm north means ${n(c)}×error=${n(s)}. Enter the east error, then the north error, in km.`, answer: [e, f], explanation: `${n(s)}/${n(a)}=${n(e)} km east and ${n(s)}/${n(c)}=${n(f)} km north. The second is ${n(k)} times the first, which is the condition number.` }
  ] }; }
});

/* Two rigs to compare. Entries may be negative or out of order, so "first ÷ second" and signed ratios are wrong. */
const size = Math.abs;
practice({ id: 'q30c', parent: 'q30', kind: 'applied',
 title: 'Two camera rigs on the pitch',
 brief: 'Two camera rigs can track the players, and the analysts want the one that spreads reading errors less.',
 labels: ['κ₂ of rig 1', 'κ₂ of rig 2', 'better rig'], tolerance: 0.01 },
 [['rig 1 largest', 'rig 1 smallest'], ['rig 2 largest', 'rig 2 smallest'], ['κ₂ of rig 1', 'κ₂ of rig 2']], {
 canonical: { P: [-8, 0.5], Q: [2, 5] },
 /* Each rig: one size from 3…12 and a smaller one from 0.2…2, in either order, one of them sometimes negative.
    The two condition numbers always differ. */
 draw: R => { const rig = () => { const big = R.pick([3, 4, 5, 6, 8, 10, 12]), sm = R.pick([0.2, 0.25, 0.5, 2]), neg = R.int(0, 2), d = [neg === 1 ? -big : big, neg === 2 ? -sm : sm]; return R.bool() ? d : [d[1], d[0]]; };
  for (;;) { const P = rig(), Q = rig(), kap = d => r6(Math.max(size(d[0]), size(d[1])) / Math.min(size(d[0]), size(d[1]))); if (kap(P) !== kap(Q)) return { P, Q }; } },
 build: ({ P, Q }) => { const sv = d => [Math.max(size(d[0]), size(d[1])), Math.min(size(d[0]), size(d[1]))], p = sv(P), q = sv(Q), k1 = r6(p[0] / p[1]), k2 = r6(q[0] / q[1]), j = k1 < k2 ? 1 : 2; return {
  prompt: `Two camera rigs track a player on the pitch. Rig 1 turns the real position (x, y) into the reading (${n(P[0])}x, ${n(P[1])}y), so its matrix is diag(${n(P[0])},${n(P[1])}). Rig 2 has the matrix diag(${n(Q[0])},${n(Q[1])}). A minus sign only means that axis is mirrored. The rig with the smaller condition number spreads reading errors less. Enter κ₂ of rig 1, then κ₂ of rig 2, then the number of the better rig (1 or 2).`,
  answer: [k1, k2, j],
  hints: ['Singular values are never negative. For a diagonal matrix they are the sizes of the diagonal entries, without their signs.', 'For each rig divide the largest singular value by the smallest. The largest is not always the first entry.'],
  solution: `Rig 1 has singular values ${n(p[0])} and ${n(p[1])}, so κ₂=${n(p[0])}/${n(p[1])}=${n(k1)}. Rig 2 has singular values ${n(q[0])} and ${n(q[1])}, so κ₂=${n(q[0])}/${n(q[1])}=${n(k2)}. The smaller is ${n(Math.min(k1, k2))}, so rig ${n(j)} is the better one.`,
  guidance: [
   { prompt: `Rig 1 is diag(${n(P[0])},${n(P[1])}). Drop any minus sign. Enter its largest singular value, then its smallest.`, answer: p, explanation: `The sizes of the entries are ${n(size(P[0]))} and ${n(size(P[1]))}, so the largest is ${n(p[0])} and the smallest is ${n(p[1])}.` },
   { prompt: `Rig 2 is diag(${n(Q[0])},${n(Q[1])}). Enter its largest singular value, then its smallest.`, answer: q, explanation: `The sizes of the entries are ${n(size(Q[0]))} and ${n(size(Q[1]))}, so the largest is ${n(q[0])} and the smallest is ${n(q[1])}.` },
   { prompt: `Divide largest by smallest for each rig: ${n(p[0])}/${n(p[1])} and ${n(q[0])}/${n(q[1])}. Enter κ₂ of rig 1, then κ₂ of rig 2.`, answer: [k1, k2], explanation: `${n(p[0])}/${n(p[1])}=${n(k1)} and ${n(q[0])}/${n(q[1])}=${n(k2)}. The smaller one, ${n(Math.min(k1, k2))}, marks the better rig: rig ${n(j)}.` }
  ] }; }
});

/* Challenge with q27 (singular values of a tall matrix with perpendicular columns): three readings, two unknowns. */
const SUB = ['₁', '₂'];
practice({ id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q27',
 title: 'The weak axis of the star tracker',
 brief: 'A star tracker turns two unknowns into three readings, and one of its axes is barely measured.',
 labels: ['largest singular value', 'smallest singular value', 'condition number', 'change in that unknown'], tolerance: 0.004 },
 [['column 1 length', 'column 2 length'], ['condition number'], ['change in that unknown']], {
 canonical: { A: [[3, 0], [0, 0.5], [4, 0]], d: 0.2 },
 /* The strong column has two entries with length 5, 10 or 13; the weak column has one small entry in the remaining row.
    That row therefore reads one unknown alone. */
 draw: R => { const k = R.int(0, 2), rest = [0, 1, 2].filter(r => r !== k), wc = R.int(0, 1), pr = R.pick(TRIPLES), sg = () => (R.bool() ? 1 : -1), A = [[0, 0], [0, 0], [0, 0]];
  A[k][wc] = R.pick([0.1, 0.2, 0.25, 0.5]); A[rest[0]][1 - wc] = pr[0] * sg(); A[rest[1]][1 - wc] = pr[1] * sg(); return { A, d: R.pick([0.1, 0.2, 0.3, 0.5]) }; },
 build: ({ A, d }) => { const c = [col(A, 0), col(A, 1)], L = c.map(v => r6(Math.sqrt(dot(v, v)))), hi = Math.max(...L), lo = Math.min(...L), K = r6(hi / lo), wc = L[0] < L[1] ? 0 : 1, k = c[wc].findIndex(e => e !== 0), w = c[wc][k], ch = r6(d / w), xw = 'x' + SUB[wc]; return {
  prompt: `A star tracker turns two unknowns x₁ and x₂ into three readings b=Ax, with A=${mat(A)}. The two columns of A are perpendicular. Enter the largest singular value of A, then the smallest, then the condition number κ₂(A). Then the reading in row ${n(k + 1)} rises by ${n(d)} while the other two stay the same: enter how much ${xw} changes.`,
  answer: [hi, lo, K, ch],
  hints: ['The columns are perpendicular, so AᵀA is diagonal. Its entries are the squared column lengths, and the singular values are the lengths themselves.', `Row ${n(k + 1)} of A has only one entry that is not 0, so that reading depends on one unknown alone. Divide the rise by that entry. Do not multiply by it.`],
  solution: `Column 1 is ${vec(c[0])}, with length √(${squares(c[0])})=${n(L[0])}. Column 2 is ${vec(c[1])}, with length √(${squares(c[1])})=${n(L[1])}. The singular values are ${n(hi)} and ${n(lo)}, so κ₂=${n(hi)}/${n(lo)}=${n(K)}. Row ${n(k + 1)} reads ${n(w)}×${xw}, so a rise of ${n(d)} changes ${xw} by ${n(d)}/${n(w)}=${n(ch)}.`,
  guidance: [
   { prompt: `The columns of A are ${vec(c[0])} and ${vec(c[1])}. Square the entries of each column, add, and take the square root. Enter the length of column 1, then of column 2.`, answer: L, explanation: `√(${squares(c[0])})=${n(L[0])} and √(${squares(c[1])})=${n(L[1])}. With perpendicular columns these lengths are the singular values.` },
   { prompt: `The largest singular value is ${n(hi)} and the smallest is ${n(lo)}. Enter κ₂=${n(hi)}/${n(lo)}.`, answer: [K], explanation: `${n(hi)}/${n(lo)}=${n(K)}. The tracker measures one direction ${n(K)} times more strongly than the other.` },
   { prompt: `Row ${n(k + 1)} of A says that this reading is ${n(w)}×${xw}. The reading rises by ${n(d)}. Enter the change in ${xw}.`, answer: [ch], explanation: `${n(w)}×change=${n(d)}, so the change is ${n(d)}/${n(w)}=${n(ch)}. A small entry in A turns a small rise in a reading into a larger change in the unknown.` }
  ] }; }
});

})();
