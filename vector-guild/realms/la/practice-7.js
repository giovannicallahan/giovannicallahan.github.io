/* Linear algebra practice missions, file 7 of 14: concepts q31–q35, three practice missions each
   (q31b q31c q31d ... q35b q35c q35d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p7.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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
const sg = x => (x < 0 ? ' − ' : ' + ') + n(Math.abs(x));                                   // " + 3" / " − 2"
const co = k => k === 1 ? '' : k === -1 ? '−' : n(k);                                        // leading coefficient: "", "−", "2"
const tm = (k, unit) => (k < 0 ? ' − ' : ' + ') + (Math.abs(k) === 1 ? '' : n(Math.abs(k))) + unit; // " + 2i" / " − i²"
const im = b => co(b) + 'i';                                                                 // "i", "−i", "3i"
const cx = (a, b) => b === 0 ? n(a) : a === 0 ? im(b) : n(a) + (b < 0 ? '−' : '+') + (Math.abs(b) === 1 ? '' : n(Math.abs(b))) + 'i'; // "2−3i"
const dotx = (r, v) => r.map((x, i) => `${par(x)}·${par(v[i])}`).join('+');                  // "3·2+(−1)·3"
const until = (make, ok, fallback) => { for (let i = 0; i < 4000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const sq = x => `${par(x)}²`;
const units = k => `${n(k)} unit${k === 1 ? '' : 's'}`;                                         // "1 unit" / "3 units"
/* One row of a triangular solve that holds a single unknown: "3y₁ = 21, so y₁ = 7", or "y₁ = 7" when the coefficient is 1. */
const one = (k, name, rhs, val) => k === 1 ? `${name} = ${n(val)} as it stands` : `${n(k)}${name} = ${n(rhs)}, so ${name} = ${n(val)}`;

/* ---- q31 Quadratic forms (taught: Kx, then x·Kx; energy is half; the off-diagonal entry counts twice) ---- */
/* Setting: the spread of a two-fund holding. The second box is the taught pitfall itself: the off-diagonal entry counts twice. */
practice({ id: 'q31b', parent: 'q31', kind: 'setting',
 title: 'Swing of a two-fund holding',
 brief: 'A saver wants one number for how much a holding of two funds swings in value.',
 labels: ['swing score wᵀCw', 'part from the off-diagonal entries'], tolerance: 0.01 },
 [['Cw first', 'Cw second'], ['swing score wᵀCw'], ['part from the off-diagonal entries']], {
 canonical: { a: 3, b: -1, d: 2, w: [2, 3] },
 /* C is positive definite (a·d > b²), as a real spread table of two different funds is. Units are positive whole numbers, not both 1. */
 draw: R => until(() => ({ a: R.int(2, 5), b: R.nz(-2, 2), d: R.int(2, 5), w: [R.int(1, 3), R.int(1, 3)] }),
  p => p.a * p.d > p.b * p.b && !(p.w[0] === 1 && p.w[1] === 1), { a: 3, b: -1, d: 2, w: [2, 3] }),
 build: ({ a, b, d, w }) => { const C = mat([[a, b], [b, d]]), cw = [a * w[0] + b * w[1], b * w[0] + d * w[1]], q = w[0] * cw[0] + w[1] * cw[1], cross = 2 * b * w[0] * w[1]; return {
  prompt: `A saver holds ${units(w[0])} of fund A and ${units(w[1])} of fund B, so the holding is w=${vec(w)}. The spread table C=${C} records how much the funds swing in value. The two diagonal entries are each fund's own swing. The off-diagonal entry says how the funds swing together, and a negative entry means one tends to rise when the other falls. The swing score of the whole holding is wᵀCw. Enter wᵀCw. Then enter how much of it comes from the two off-diagonal entries together.`,
  answer: [q, cross],
  hints: ['Multiply C by w first: dot each row of C with w. That gives two numbers.', 'Then dot w with those two numbers. The off-diagonal entry sits in the table twice, so its term (entry × units of A × units of B) is counted twice.'],
  solution: `Cw = (${dotx([a, b], w)}, ${dotx([b, d], w)}) = ${vec(cw)}. wᵀCw = ${dotx(w, cw)} = ${n(q)}. The two off-diagonal entries give 2·${par(b)}·${n(w[0])}·${n(w[1])} = ${n(cross)} of that. The diagonal entries give the rest, ${n(q - cross)}.`,
  guidance: [
   { prompt: `Multiply the table by the holding: C=${C} times w=${vec(w)}. Enter the two numbers of Cw.`, answer: cw, explanation: `Row one gives ${dotx([a, b], w)} = ${n(cw[0])}, and row two gives ${dotx([b, d], w)} = ${n(cw[1])}.` },
   { prompt: `Dot w=${vec(w)} with Cw=${vec(cw)}. What is wᵀCw?`, answer: [q], explanation: `${dotx(w, cw)} = ${n(q)}. This single number is the swing score.` },
   { prompt: `The off-diagonal entry ${n(b)} appears twice in C. Each time it is multiplied by ${n(w[0])} and by ${n(w[1])}. How much do the two appearances add to the score together?`, answer: [cross], explanation: `One appearance gives ${par(b)}·${n(w[0])}·${n(w[1])} = ${n(cross / 2)}, so the two give ${n(cross)}. Counting it once is the usual slip.` }
  ] }; }
});

/* Applied: two pulls on the same pair of tethers; the halving is needed twice, then a comparison. */
practice({ id: 'q31c', parent: 'q31', kind: 'applied',
 title: 'Two pulls on the cargo tethers',
 brief: 'Two elastic tethers hold a cargo pod, and the crew wants to know which test pull stores more energy.',
 labels: ['energy of pull A (J)', 'energy of pull B (J)', 'difference (J)'], tolerance: 0.01 },
 [['KA first', 'KA second'], ['xᵀKx for pull A', 'energy of pull A (J)'], ['xᵀKx for pull B', 'energy of pull B (J)']], {
 canonical: { a: 5, b: -2, d: 3, p: [1, 2], q: [2, -1] },
 /* K is positive definite, so both energies are positive; the two energies differ, so "the larger" is defined. */
 draw: R => until(() => ({ a: R.int(2, 5), b: R.nz(-2, 2), d: R.int(2, 5), p: [R.nz(-3, 3), R.nz(-3, 3)], q: [R.nz(-3, 3), R.nz(-3, 3)] }),
  ({ a, b, d, p, q }) => a * d > b * b && a * p[0] * p[0] + 2 * b * p[0] * p[1] + d * p[1] * p[1] !== a * q[0] * q[0] + 2 * b * q[0] * q[1] + d * q[1] * q[1],
  { a: 5, b: -2, d: 3, p: [1, 2], q: [2, -1] }),
 build: ({ a, b, d, p, q }) => { const K = mat([[a, b], [b, d]]), kp = [a * p[0] + b * p[1], b * p[0] + d * p[1]], kq = [a * q[0] + b * q[1], b * q[0] + d * q[1]],
  fp = p[0] * kp[0] + p[1] * kp[1], fq = q[0] * kq[0] + q[1] * kq[1], ep = fp / 2, eq = fq / 2, hi = Math.max(ep, eq), lo = Math.min(ep, eq); return {
  prompt: `Two elastic tethers hold a cargo pod at the dock. Pulling the pod by x metres stores ½xᵀKx joules of energy in the tethers, where the stiffness is K=${K} N/m. The crew tests two pulls: A=${vec(p)} m and B=${vec(q)} m. Enter the energy stored by pull A, then the energy stored by pull B, then how many joules more the larger of the two stores than the smaller.`,
  answer: [ep, eq, hi - lo],
  hints: ['For each pull, multiply K by the pull, then dot the pull with the result. That gives xᵀKx for that pull.', 'The stored energy is half of xᵀKx. Halve each one before you compare them.'],
  solution: `Pull A: K times A is ${vec(kp)}, so xᵀKx = ${dotx(p, kp)} = ${n(fp)} and the energy is ${n(ep)} J. Pull B: K times B is ${vec(kq)}, so xᵀKx = ${dotx(q, kq)} = ${n(fq)} and the energy is ${n(eq)} J. Pull ${ep > eq ? 'A' : 'B'} stores more, by ${n(hi)} − ${n(lo)} = ${n(hi - lo)} J.`,
  guidance: [
   { prompt: `Start with pull A=${vec(p)}. Multiply K=${K} by it. Enter the two numbers of the result.`, answer: kp, explanation: `Row one gives ${dotx([a, b], p)} = ${n(kp[0])}, and row two gives ${dotx([b, d], p)} = ${n(kp[1])}.` },
   { prompt: `Dot ${vec(p)} with ${vec(kp)} to get xᵀKx for pull A, then halve it. Enter xᵀKx, then the energy in joules.`, answer: [fp, ep], explanation: `${dotx(p, kp)} = ${n(fp)}, and half of ${n(fp)} is ${n(ep)} J.` },
   { prompt: `Now pull B=${vec(q)}. K times B is ${vec(kq)}. Enter xᵀKx for pull B, then its energy in joules.`, answer: [fq, eq], explanation: `${dotx(q, kq)} = ${n(fq)}, and half of ${n(fq)} is ${n(eq)} J. The gap between the two energies is ${n(hi)} − ${n(lo)} = ${n(hi - lo)} J.` }
  ] }; }
});

/* Challenge with q06: a 3×3 table and a 3-entry vector (the parent is 2×2). */
practice({ id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q06',
 title: 'Spin energy of the survey satellite',
 brief: 'Before a manoeuvre, the flight team needs the energy held in the spin of a survey satellite.',
 labels: ['wᵀJw', 'spin energy (J)'], tolerance: 0.01 },
 [['Jw first', 'Jw second', 'Jw third'], ['wᵀJw', 'spin energy (J)']], {
 canonical: { J: [[4, 1, 0], [1, 5, -2], [0, -2, 3]], w: [2, -1, 1] },
 /* Symmetric with a zero corner; each diagonal entry is larger than the sizes of the other entries in its row, so J is positive definite. */
 draw: R => until(() => { const b = R.nz(-2, 2), e = R.nz(-2, 2); return { J: [[R.int(2, 6), b, 0], [b, R.int(3, 7), e], [0, e, R.int(2, 6)]], w: [R.nz(-2, 2), R.nz(-2, 2), R.nz(-2, 2)] }; },
  ({ J }) => J[0][0] > Math.abs(J[0][1]) && J[1][1] > Math.abs(J[0][1]) + Math.abs(J[1][2]) && J[2][2] > Math.abs(J[1][2]),
  { J: [[4, 1, 0], [1, 5, -2], [0, -2, 3]], w: [2, -1, 1] }),
 build: ({ J, w }) => { const jw = J.map(r => r[0] * w[0] + r[1] * w[1] + r[2] * w[2]), q = w[0] * jw[0] + w[1] * jw[1] + w[2] * jw[2]; return {
  prompt: `A survey satellite spins at w=${vec(w)} radians per second about its x, y and z axes. Its inertia table J says how hard it is to spin about each axis and how the axes drag on each other. J has rows ${vec(J[0])}, ${vec(J[1])} and ${vec(J[2])} kg·m². The spin energy is ½wᵀJw joules. Enter wᵀJw, then the spin energy.`,
  answer: [q, q / 2],
  hints: ['Work exactly as with a 2×2 table, with one more row: dot each of the three rows of J with w to get the three numbers of Jw.', 'Then dot w with Jw to get one number. The energy is half of it.'],
  solution: `Jw = (${dotx(J[0], w)}, ${dotx(J[1], w)}, ${dotx(J[2], w)}) = ${vec(jw)}. wᵀJw = ${dotx(w, jw)} = ${n(q)}. The spin energy is half of that, ${n(q / 2)} J.`,
  guidance: [
   { prompt: `Multiply J by w=${vec(w)}: dot each row of J with w. Enter the three numbers of Jw.`, answer: jw, explanation: `Row one: ${dotx(J[0], w)} = ${n(jw[0])}. Row two: ${dotx(J[1], w)} = ${n(jw[1])}. Row three: ${dotx(J[2], w)} = ${n(jw[2])}.` },
   { prompt: `Dot w=${vec(w)} with Jw=${vec(jw)}, then halve the result. Enter wᵀJw, then the spin energy in joules.`, answer: [q, q / 2], explanation: `${dotx(w, jw)} = ${n(q)}, and half of ${n(q)} is ${n(q / 2)} J.` }
  ] }; }
});

/* ---- q32 Positive definiteness (taught: symmetric 2×2; top-left entry and determinant both strictly positive) ---- */
/* Setting: a dip in the ground given as a formula; the player builds the matrix first. The top-left entry is always
   positive, so the determinant decides: positive diagonal entries alone (the taught pitfall) fail in about half the draws. */
practice({ id: 'q32b', parent: 'q32', kind: 'setting',
 title: 'Is the parking dip a true bowl?',
 brief: 'The rover needs a parking dip that rises in every direction, so that it cannot roll away.',
 labels: ['off-diagonal entry', 'determinant', 'true bowl (1 yes, 0 no)'], tolerance: 0.01 },
 [['off-diagonal entry'], ['determinant', 'true bowl (1 yes, 0 no)']], {
 canonical: { a: 2, c: 6, d: 4 },
 draw: R => { const want = R.bool(); return until(() => ({ a: R.int(1, 6), c: 2 * R.nz(-4, 4), d: R.int(1, 6) }), p => (p.a * p.d - p.c * p.c / 4 > 0) === want, want ? { a: 3, c: -4, d: 2 } : { a: 2, c: 6, d: 4 }); },
 build: ({ a, c, d }) => { const b = c / 2, det = a * d - b * b, pd = det > 0, A = mat([[a, b], [b, d]]), h = `${co(a)}x²${tm(c, 'xy')} + ${co(d)}y²`; return {
  prompt: `The rover will park in a dip in the ground. A survey says that x metres east and y metres north of the centre of the dip, the ground stands h = ${h} centimetres above the centre (a negative h means lower ground). Write h as vᵀAv with v=(x,y) and a symmetric A: the x² number and the y² number go on the diagonal, and the xy number is split equally between the two off-diagonal entries. The dip is a true bowl, higher than its centre in every direction, only if A is positive definite. Enter the off-diagonal entry of A, then the determinant of A, then 1 if the dip is a true bowl or 0 if it is not.`,
  answer: [b, det, pd ? 1 : 0],
  hints: ['Half of the xy number goes in each off-diagonal entry, so that the two entries together give the whole xy term.', 'Both tests must pass: the top-left entry must be positive and the determinant must be positive. A determinant of zero does not pass.'],
  solution: `A=${A}. Its top-left entry (the first leading minor) is ${n(a)}, which is positive. Its determinant is ${n(a)}·${n(d)}−${par(b)}·${par(b)} = ${n(det)}` + (pd ? `, which is also positive. A is positive definite, so the dip is a true bowl.` : det === 0 ? `. Zero is not positive, so A is not positive definite: in one direction the ground stays level with the centre.` : `, which is negative. A is not positive definite: in some direction the ground falls below the centre, although both diagonal entries are positive.`),
  guidance: [
   { prompt: `The xy number in h is ${n(c)}. Split it equally between the two off-diagonal entries of A. What is each one?`, answer: [b], explanation: `Each off-diagonal entry is ${n(c)} ÷ 2 = ${n(b)}, so A=${A}.` },
   { prompt: `Compute the determinant of A=${A}. Then enter 1 if the top-left entry and the determinant are both positive, or 0 if not.`, answer: [det, pd ? 1 : 0], explanation: `det = ${n(a)}·${n(d)}−${par(b)}·${par(b)} = ${n(det)}. ` + (pd ? `Both ${n(a)} and ${n(det)} are positive, so the answer is 1.` : `The top-left entry ${n(a)} is positive, but the determinant ${n(det)} is not, so the answer is 0.`) }
  ] }; }
});

/* Applied: a trial link, then the strongest link that still passes. When a·d is a perfect square, the link whose
   square equals it gives a zero determinant and fails (the second taught pitfall). */
practice({ id: 'q32c', parent: 'q32', kind: 'applied',
 title: 'The strongest safe link',
 brief: 'Two generators are to be tied together, and the grid team wants the strongest link that keeps the grid stable.',
 labels: ['determinant for the trial link', 'stable with the trial link (1 yes, 0 no)', 'largest stable c'], tolerance: 0.01 },
 [['determinant', 'stable (1 yes, 0 no)'], ['limit for c²'], ['largest stable c']], {
 canonical: { a: 4, d: 9, c: 7 },
 /* The trial link is never the final answer. */
 draw: R => until(() => ({ a: R.int(2, 9), d: R.int(2, 9), c: R.int(1, 8) }), p => p.c !== Math.ceil(Math.sqrt(p.a * p.d)) - 1, { a: 4, d: 9, c: 7 }),
 build: ({ a, d, c }) => { const ad = a * d, det = ad - c * c, ok = det > 0, m = Math.ceil(Math.sqrt(ad)) - 1, S = mat([[a, c], [c, d]]); return {
  prompt: `Two generators on the power grid are tied together by a link. With a link of strength c, the grid is described by S=[[${n(a)},c],[c,${n(d)}]], and it stays stable only while S is positive definite. The engineers first try c=${n(c)}. Enter the determinant of S for c=${n(c)}, then 1 if that grid is stable or 0 if it is not. Then enter the largest whole number c for which the grid is stable.`,
  answer: [det, ok ? 1 : 0, m],
  hints: ['The top-left entry is positive whatever the link is, so the determinant decides. Work it out for the trial link first.', 'The determinant is the product of the diagonal entries minus c². It is positive only while c² is smaller than that product. Equal is not enough.'],
  solution: `With c=${n(c)}: det S = ${n(a)}·${n(d)}−${n(c)}·${n(c)} = ${n(det)}, which is ${ok ? 'positive, so that grid is stable' : det === 0 ? 'zero and not positive, so that grid is not stable' : 'negative, so that grid is not stable'}. For any link, det S = ${n(ad)} − c², so c² must be smaller than ${n(ad)}. ${n(m)}² = ${n(m * m)} is smaller, but ${n(m + 1)}² = ${n((m + 1) * (m + 1))} is ${(m + 1) * (m + 1) === ad ? 'equal to it, which gives a determinant of zero' : 'larger'}. The largest stable whole number is c=${n(m)}.`,
  guidance: [
   { prompt: `Put c=${n(c)} into S, which gives S=${S}. Enter its determinant, then 1 if S is positive definite or 0 if not.`, answer: [det, ok ? 1 : 0], explanation: `det = ${n(a)}·${n(d)}−${n(c)}·${n(c)} = ${n(det)}. The top-left entry ${n(a)} is positive, ${ok ? 'and the determinant is positive too, so the answer is 1' : 'but the determinant is not, so the answer is 0'}.` },
   { prompt: `For any link c, det S = ${n(a)}·${n(d)} − c². Which number must c² stay below for the determinant to be positive?`, answer: [ad], explanation: `${n(a)}·${n(d)} = ${n(ad)}, so det S = ${n(ad)} − c². It is positive only while c² is below ${n(ad)}.` },
   { prompt: `Which is the largest whole number whose square is below ${n(ad)}?`, answer: [m], explanation: `${n(m)}² = ${n(m * m)} is below ${n(ad)}, and ${n(m + 1)}² = ${n((m + 1) * (m + 1))} is not${(m + 1) * (m + 1) === ad ? ': it is equal, and a zero determinant does not pass' : ''}.` }
  ] }; }
});

/* Challenge with q31: the determinant test, then one test nudge whose energy score shows the same verdict.
   The nudge is (b, −a), (−b, a), (d, −b) or (−d, b); its score is a·det or d·det, so it has the sign of the determinant. */
practice({ id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q31',
 title: 'Will the camera mount settle?',
 brief: 'A self-levelling camera mount must settle after any nudge, and the control team wants proof either way.',
 labels: ['determinant', 'energy score for x', 'positive definite (1 yes, 0 no)'], tolerance: 0.01 },
 [['determinant', 'positive definite (1 yes, 0 no)'], ['Kx first', 'Kx second'], ['energy score for x']], {
 canonical: { a: 3, b: -2, d: 1, x: [1, 2] },
 draw: R => { const want = R.bool(), k = R.int(0, 3); const p = until(() => ({ a: R.int(1, 5), b: R.nz(-4, 4), d: R.int(1, 5) }),
   q => (q.a * q.d - q.b * q.b > 0) === want && Math.abs(q.a * q.d - q.b * q.b) <= 12, want ? { a: 2, b: 1, d: 3 } : { a: 3, b: -2, d: 1 });
  return { ...p, x: [[p.b, -p.a], [-p.b, p.a], [p.d, -p.b], [-p.d, p.b]][k] }; },
 build: ({ a, b, d, x }) => { const K = mat([[a, b], [b, d]]), det = a * d - b * b, pd = a > 0 && det > 0, kx = [a * x[0] + b * x[1], b * x[0] + d * x[1]], f = x[0] * kx[0] + x[1] * kx[1]; return {
  prompt: `A camera mount levels itself with two motors. For a nudge x, its energy score is xᵀKx with K=${K}. The mount settles after every nudge only if K is positive definite, which means the score is positive for every nudge except x=(0, 0). Enter the determinant of K, then the energy score for the test nudge x=${vec(x)}, then 1 if K is positive definite or 0 if it is not.`,
  answer: [det, f, pd ? 1 : 0],
  hints: ['The determinant test comes first: top-left entry times bottom-right entry, minus the off-diagonal entry squared.', 'For the score, multiply K by x, then dot x with the result. One nudge with a score of zero or less is enough to show that K is not positive definite.'],
  solution: `det K = ${n(a)}·${n(d)}−${par(b)}·${par(b)} = ${n(det)}. Test nudge: Kx = (${dotx([a, b], x)}, ${dotx([b, d], x)}) = ${vec(kx)}, and xᵀKx = ${dotx(x, kx)} = ${n(f)}. ` + (pd ? `The top-left entry ${n(a)} and the determinant ${n(det)} are both positive, so K is positive definite. The positive score agrees with that.` : det === 0 ? `The determinant is zero, so K is not positive definite. The test nudge shows why: it is not (0, 0), yet its score is 0.` : `The determinant is negative, so K is not positive definite. The test nudge shows why: its score is negative, although both diagonal entries of K are positive.`),
  guidance: [
   { prompt: `Compute the determinant of K=${K}. Then enter 1 if the top-left entry and the determinant are both positive, or 0 if not.`, answer: [det, pd ? 1 : 0], explanation: `det = ${n(a)}·${n(d)}−${par(b)}·${par(b)} = ${n(det)}. ` + (pd ? `Both ${n(a)} and ${n(det)} are positive, so the answer is 1.` : `The determinant is not positive, so the answer is 0.`) },
   { prompt: `Multiply K by the test nudge x=${vec(x)}. Enter the two numbers of Kx.`, answer: kx, explanation: `Row one gives ${dotx([a, b], x)} = ${n(kx[0])}, and row two gives ${dotx([b, d], x)} = ${n(kx[1])}.` },
   { prompt: `Dot x=${vec(x)} with Kx=${vec(kx)}. What is the energy score xᵀKx?`, answer: [f], explanation: `${dotx(x, kx)} = ${n(f)}. ` + (pd ? `A positive score is what a positive definite K gives for every nudge.` : `A score that is not positive for a real nudge confirms that K is not positive definite.`) }
  ] }; }
});

/* ---- q33 Cholesky factorization (taught: L11 = √A11, L21 = A21 ÷ L11, L22 = √(A22 − L21²), positive roots) ---- */
const chol = (a, b, d) => { const l11 = Math.sqrt(a), l21 = b / l11; return [l11, l21, Math.sqrt(d - l21 * l21)]; };
const cholSteps = (a, b, d, name) => { const [l11, l21, l22] = chol(a, b, d); return `L₁₁ = √${n(a)} = ${n(l11)}. L₂₁ = ${n(b)} ÷ ${n(l11)} = ${n(l21)}. L₂₂ = √(${n(d)}−${sq(l21)}) = √${n(d - l21 * l21)} = ${n(l22)}. So L=${mat([[l11, 0], [l21, l22]])}, and LLᵀ gives back ${name}.`; };
const fromL = (l11, l21, l22) => ({ a: l11 * l11, b: l11 * l21, d: l21 * l21 + l22 * l22 });
const taken = p => (p.a === 4 && p.b === 2 && p.d === 5) || (p.a === 9 && p.b === 3 && p.d === 5);   // the q33 mission and its worked example

/* Setting: the position uncertainty of a navigation filter (square-root filters store exactly this factor). */
practice({ id: 'q33b', parent: 'q33', kind: 'setting',
 title: 'Square root of the position uncertainty',
 brief: 'The rover\'s navigation filter keeps its position uncertainty in factored form, and the factor has to be rebuilt.',
 labels: ['L11', 'L21', 'L22'], tolerance: 0.01 },
 [['L11'], ['L21', 'L22']], {
 canonical: { a: 4, b: -6, d: 13 },
 draw: R => until(() => fromL(R.int(2, 5), R.nz(-4, 4), R.int(1, 4)), p => !taken(p), { a: 4, b: -6, d: 13 }),
 build: ({ a, b, d }) => { const [l11, l21, l22] = chol(a, b, d), P = mat([[a, b], [b, d]]); return {
  prompt: `The rover's navigation filter records how unsure it is of its position in an uncertainty table P=${P} m² (east first, then north). To stay accurate it stores a kind of square root of P instead: the lower triangular L with positive diagonal entries and LLᵀ=P. This L is the Cholesky factor of P. Enter L₁₁, then L₂₁, then L₂₂.`,
  answer: [l11, l21, l22],
  hints: ['L₁₁ is the positive square root of the top-left entry of P. Then L₂₁ times L₁₁ must equal the off-diagonal entry.', 'Subtract L₂₁² from the bottom-right entry of P. What is left is L₂₂², so take its positive root.'],
  solution: cholSteps(a, b, d, 'P'),
  guidance: [
   { prompt: `L₁₁ times itself must give the top-left entry of P, which is ${n(a)}. Enter L₁₁, the positive root.`, answer: [l11], explanation: `${n(l11)}·${n(l11)} = ${n(a)}, and the diagonal of L must be positive, so L₁₁ = ${n(l11)}.` },
   { prompt: `L₂₁ times L₁₁ must give the off-diagonal entry ${n(b)}, and L₂₁² + L₂₂² must give ${n(d)}. Enter L₂₁, then L₂₂ (the positive root).`, answer: [l21, l22], explanation: `L₂₁ = ${n(b)} ÷ ${n(l11)} = ${n(l21)}. Then L₂₂² = ${n(d)}−${sq(l21)} = ${n(d - l21 * l21)}, so L₂₂ = ${n(l22)}.` }
  ] }; }
});

/* Applied: what the factor is for in a simulation: g = Lz turns independent numbers into numbers with the spread C. */
practice({ id: 'q33c', parent: 'q33', kind: 'applied',
 title: 'Gusts for the flight simulator',
 brief: 'A flight simulator must produce wind gusts at two nearby points that rise and fall together the way real wind does.',
 labels: ['L11', 'L21', 'L22', 'gust 1', 'gust 2'], tolerance: 0.01 },
 [['L11'], ['L21', 'L22'], ['gust 1', 'gust 2']], {
 canonical: { a: 4, b: 6, d: 10, z: [1, -2] },
 draw: R => until(() => ({ ...fromL(R.int(2, 4), R.nz(-3, 3), R.int(1, 4)), z: [R.nz(-3, 3), R.nz(-3, 3)] }), p => !taken(p), { a: 4, b: 6, d: 10, z: [1, -2] }),
 build: ({ a, b, d, z }) => { const [l11, l21, l22] = chol(a, b, d), C = mat([[a, b], [b, d]]), L = mat([[l11, 0], [l21, l22]]), g = [l11 * z[0], l21 * z[0] + l22 * z[1]]; return {
  prompt: `A flight simulator needs wind gusts at two nearby points that rise and fall together the way real wind does. Their spread table is C=${C}. The simulator factors C=LLᵀ, with L lower triangular and its diagonal positive (the Cholesky factor). Then it turns two independent random numbers z=${vec(z)} into the two gusts g=Lz. Enter L₁₁, L₂₁ and L₂₂, then the gusts g₁ and g₂.`,
  answer: [l11, l21, l22, g[0], g[1]],
  hints: ['Find L one entry at a time: L₁₁ from the top-left entry of C, L₂₁ from the off-diagonal entry, L₂₂ from what is left of the bottom-right entry.', 'L has a zero in its top-right corner, so the first gust uses only the first random number. The second gust uses both.'],
  solution: `${cholSteps(a, b, d, 'C')} Gusts: g = Lz = (${dotx([l11, 0], z)}, ${dotx([l21, l22], z)}) = ${vec(g)}.`,
  guidance: [
   { prompt: `L₁₁ times itself must give the top-left entry of C, which is ${n(a)}. Enter L₁₁, the positive root.`, answer: [l11], explanation: `${n(l11)}·${n(l11)} = ${n(a)}, so L₁₁ = ${n(l11)}.` },
   { prompt: `L₂₁ times ${n(l11)} must give ${n(b)}, and L₂₁² + L₂₂² must give ${n(d)}. Enter L₂₁, then L₂₂ (the positive root).`, answer: [l21, l22], explanation: `L₂₁ = ${n(b)} ÷ ${n(l11)} = ${n(l21)}. Then L₂₂² = ${n(d)}−${sq(l21)} = ${n(d - l21 * l21)}, so L₂₂ = ${n(l22)}.` },
   { prompt: `Now multiply L=${L} by z=${vec(z)}. Enter the two gusts.`, answer: g, explanation: `Row one gives ${dotx([l11, 0], z)} = ${n(g[0])}, and row two gives ${dotx([l21, l22], z)} = ${n(g[1])}.` }
  ] }; }
});

/* Challenge with q12: the factor is used to solve Ax=f by two triangular solves. Draws start from whole L and whole x. */
practice({ id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q12',
 title: 'Two triangular solves for the frame',
 brief: 'A steel frame carries two loads, and the structural solver finds how far its joints move by using a Cholesky factor.',
 labels: ['y1', 'y2', 'x1', 'x2'], tolerance: 0.01 },
 [['L11', 'L21', 'L22'], ['y1', 'y2'], ['x1', 'x2']], {
 canonical: { a: 9, b: -3, d: 5, f: [21, -11] },
 draw: R => until(() => { const l11 = R.int(1, 3), l21 = R.nz(-2, 2), l22 = R.int(1, 3), x = [R.nz(-3, 3), R.nz(-3, 3)], y = [l11 * x[0] + l21 * x[1], l22 * x[1]];
   return (l11 === 1 && l22 === 1) || y[0] === 0 ? null : { ...fromL(l11, l21, l22), f: [l11 * y[0], l21 * y[0] + l22 * y[1]] }; },
  p => p && !taken(p), { a: 9, b: -3, d: 5, f: [21, -11] }),
 build: ({ a, b, d, f }) => { const [l11, l21, l22] = chol(a, b, d), A = mat([[a, b], [b, d]]), L = mat([[l11, 0], [l21, l22]]), LT = mat([[l11, l21], [0, l22]]),
  y1 = f[0] / l11, y2 = (f[1] - l21 * y1) / l22, x2 = y2 / l22, x1 = (y1 - l21 * x2) / l11, y = [y1, y2], x = [x1, x2]; return {
  prompt: `A steel frame has stiffness A=${A}. Under the loads f=${vec(f)}, its two joints move by x, where Ax=f. The solver uses the Cholesky factor: A=LLᵀ with L lower triangular and a positive diagonal. First it solves Ly=f from the top row down. Then it solves Lᵀx=y from the bottom row up. Enter y₁ and y₂, then x₁ and x₂.`,
  answer: [y1, y2, x1, x2],
  hints: ['Factor A first: L₁₁ is the root of the top-left entry, L₂₁ is the off-diagonal entry divided by L₁₁, and L₂₂ is the root of what is left of the bottom-right entry after subtracting L₂₁².', 'In Ly=f the top row has only y₁ in it, so solve it first and put y₁ into the second row. Lᵀ is L flipped across its diagonal, so in Lᵀx=y the bottom row has only x₂ in it.'],
  solution: `L=${L}. Ly=f: ${one(l11, 'y₁', f[0], y1)}. Then ${co(l21)}y₁${tm(l22, 'y₂')} = ${n(f[1])} gives y₂ = ${n(y2)}. Lᵀ=${LT}. Lᵀx=y: ${one(l22, 'x₂', y2, x2)}. Then ${co(l11)}x₁${tm(l21, 'x₂')} = ${n(y1)} gives x₁ = ${n(x1)}. Check: Ax = (${dotx([a, b], x)}, ${dotx([b, d], x)}) = ${vec(f)}.`,
  guidance: [
   { prompt: `Factor A=${A} as LLᵀ. Enter L₁₁, then L₂₁, then L₂₂.`, answer: [l11, l21, l22], explanation: `L₁₁ = √${n(a)} = ${n(l11)}. L₂₁ = ${n(b)} ÷ ${n(l11)} = ${n(l21)}. L₂₂ = √(${n(d)}−${sq(l21)}) = ${n(l22)}.` },
   { prompt: `Solve Ly=f with L=${L} and f=${vec(f)}, top row first. Enter y₁, then y₂.`, answer: y, explanation: `Top row: ${one(l11, 'y₁', f[0], y1)}. Second row: ${co(l21)}y₁${tm(l22, 'y₂')} = ${n(f[1])}, so y₂ = ${n(y2)}.` },
   { prompt: `Solve Lᵀx=y with Lᵀ=${LT} and y=${vec(y)}, bottom row first. Enter x₁, then x₂.`, answer: x, explanation: `Bottom row: ${one(l22, 'x₂', y2, x2)}. Top row: ${co(l11)}x₁${tm(l21, 'x₂')} = ${n(y1)}, so x₁ = ${n(x1)}.` }
  ] }; }
});

/* ---- q34 Complex vectors (taught: conjugate, then multiply and add; |a+bi|² = a²+b²; z* z is real) ---- */
const mag = z => z[0] * z[0] + z[1] * z[1];
/* Setting: a wifi router. Every imaginary part is non-zero, so a²−b² (the taught pitfall) never gives a²+b². */
practice({ id: 'q34b', parent: 'q34', kind: 'setting',
 title: 'Power at the router antennas',
 brief: 'A wifi router hears one phone on two antennas and needs the power of what it receives.',
 labels: ['power at antenna 1', 'power at antenna 2', 'total power'], tolerance: 0.01 },
 [['power at antenna 1', 'imaginary part'], ['power at antenna 2', 'total power']], {
 canonical: { a: 3, b: -2, c: 1, d: 4 },
 draw: R => until(() => ({ a: R.nz(-4, 4), b: R.nz(-4, 4), c: R.nz(-4, 4), d: R.nz(-4, 4) }),
  p => !(p.a === 1 && p.b === 1 && p.c === 2 && p.d === -1) && !(p.a === 2 && p.b === 1 && p.c === 1 && p.d === -3), { a: 3, b: -2, c: 1, d: 4 }),
 build: ({ a, b, c, d }) => { const z1 = cx(a, b), z2 = cx(c, d), m1 = a * a + b * b, m2 = c * c + d * d, s = m1 + m2; return {
  prompt: `A wifi router hears one phone on two antennas. Each reading is a complex number: its real and imaginary parts together record how strong the wave is and when it arrives. The readings are z=(${z1}, ${z2}). The power at an antenna is the squared magnitude of its reading, and the total power is z* z. Enter the power at antenna 1, then the power at antenna 2, then the total power.`,
  answer: [m1, m2, s],
  hints: ['The power at one antenna is (real part)² + (number in front of i)². Both squares are added, never subtracted.', 'z* z adds the two powers. Conjugating first is what makes every term real, so the total has no imaginary part.'],
  solution: `|${z1}|² = ${sq(a)}+${sq(b)} = ${n(m1)}. |${z2}|² = ${sq(c)}+${sq(d)} = ${n(m2)}. z* z = ${n(m1)}+${n(m2)} = ${n(s)}, a real number.`,
  guidance: [
   { prompt: `The conjugate of ${z1} is ${cx(a, -b)}. Multiply the two: (${cx(a, -b)})(${z1}). Enter the real part of the product, then its imaginary part.`, answer: [m1, 0], explanation: `(${cx(a, -b)})(${z1}) = ${n(a * a)}−${b * b === 1 ? '' : n(b * b)}i² = ${n(a * a)}+${n(b * b)} = ${n(m1)}, because i² = −1. The terms with i cancel, so the imaginary part is 0.` },
   { prompt: `Do the same for the second reading, ${z2}: its power is (real part)² + (number in front of i)². Then add the two powers. Enter the power at antenna 2, then the total power.`, answer: [m2, s], explanation: `${sq(c)}+${sq(d)} = ${n(m2)}, and ${n(m1)}+${n(m2)} = ${n(s)}.` }
  ] }; }
});

/* Applied: the inner product of two different vectors, where the conjugate matters. Forgetting it changes the real
   part (b·f + d·h ≠ 0), and conjugating v instead of u changes the imaginary part (it is never 0). */
practice({ id: 'q34c', parent: 'q34', kind: 'applied',
 title: 'Matching a sonar echo',
 brief: 'A sonar compares the echo it hears with the ping it sent, and needs their match score.',
 labels: ['real part', 'imaginary part'], tolerance: 0.01 },
 [['first product, real part', 'first product, imaginary part'], ['second product, real part', 'second product, imaginary part'], ['real part', 'imaginary part']], {
 canonical: { u: [[1, 2], [3, -1]], v: [[2, 1], [1, 1]] },
 draw: R => { const z = () => [R.nz(-3, 3), R.nz(-3, 3)]; return until(() => ({ u: [z(), z()], v: [z(), z()] }),
  ({ u, v }) => u[0][0] * v[0][1] - u[0][1] * v[0][0] + u[1][0] * v[1][1] - u[1][1] * v[1][0] !== 0 && u[0][1] * v[0][1] + u[1][1] * v[1][1] !== 0,
  { u: [[1, 2], [3, -1]], v: [[2, 1], [1, 1]] }); },
 build: ({ u, v }) => { const prod = ([a, b], [e, f]) => [a * e + b * f, a * f - b * e], t1 = prod(u[0], v[0]), t2 = prod(u[1], v[1]), re = t1[0] + t2[0], imp = t1[1] + t2[1];
  const C = z => cx(z[0], z[1]), cj = z => cx(z[0], -z[1]);
  const ex = ([a, b], [e, f], t) => `(${cx(a, -b)})(${cx(e, f)}) = ${n(a * e)}${tm(a * f, 'i')}${tm(-b * e, 'i')}${tm(-b * f, 'i²')} = ${cx(t[0], t[1])}`; return {
  prompt: `A sonar sends out the ping u=(${C(u[0])}, ${C(u[1])}) and hears the echo v=(${C(v[0])}, ${C(v[1])}). Each entry is a complex number that records the strength and timing of one tone. The match score between ping and echo is the complex inner product u* v: conjugate each entry of u, multiply it by the matching entry of v, and add. Enter the real part of u* v, then its imaginary part.`,
  answer: [re, imp],
  hints: ['Conjugate u only: flip the sign of the imaginary part of each entry of u. Leave v as it is.', 'Multiply out each pair like two brackets and replace i² with −1. Then add the real parts together and the imaginary parts together.'],
  solution: `First pair: ${ex(u[0], v[0], t1)}. Second pair: ${ex(u[1], v[1], t2)}. Each time i² = −1 turns the last term into a real number. Adding the two products gives u* v = ${cx(re, imp)}: real part ${n(re)}, imaginary part ${n(imp)}.`,
  guidance: [
   { prompt: `The first entry of u is ${C(u[0])}, so its conjugate is ${cj(u[0])}. Multiply: (${cj(u[0])})(${C(v[0])}). Enter the real part of the product, then its imaginary part.`, answer: t1, explanation: `${ex(u[0], v[0], t1)}, using i² = −1.` },
   { prompt: `The second entry of u is ${C(u[1])}, so its conjugate is ${cj(u[1])}. Multiply: (${cj(u[1])})(${C(v[1])}). Enter the real part of the product, then its imaginary part.`, answer: t2, explanation: `${ex(u[1], v[1], t2)}, using i² = −1.` },
   { prompt: `Add the two products. Their real parts are ${n(t1[0])} and ${n(t2[0])}, and their imaginary parts are ${n(t1[1])} and ${n(t2[1])}. Enter the real part of u* v, then its imaginary part.`, answer: [re, imp], explanation: `Real parts: ${n(t1[0])}${plus(t2[0])} = ${n(re)}. Imaginary parts: ${n(t1[1])}${plus(t2[1])} = ${n(imp)}.` }
  ] }; }
});

/* Challenge with q02: three entries, and the length √(z* z). Draws keep z* z a perfect square, so the length is whole. */
practice({ id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q02',
 title: 'Size of a three-phase current',
 brief: 'A three-phase generator sends current down three wires, and the grid team wants one number for the size of the whole signal.',
 labels: ['z* z', 'length of z'], tolerance: 0.01 },
 [['squared magnitude 1', 'squared magnitude 2', 'squared magnitude 3'], ['z* z', 'length of z']], {
 canonical: { z: [[2, -1], [3, 3], [1, 1]] },
 draw: R => { const e = () => [R.nz(-4, 4), R.nz(-4, 4)]; return until(() => ({ z: [e(), e(), e()] }), ({ z }) => { const s = mag(z[0]) + mag(z[1]) + mag(z[2]), r = Math.round(Math.sqrt(s)); return r * r === s; }, { z: [[2, -1], [3, 3], [1, 1]] }); },
 build: ({ z }) => { const m = z.map(mag), s = m[0] + m[1] + m[2], r = Math.round(Math.sqrt(s)), t = z.map(e => cx(e[0], e[1])); return {
  prompt: `A three-phase generator sends current down three wires. Engineers record each current as a complex number, so the three together make the vector z=(${t[0]}, ${t[1]}, ${t[2]}) amperes. The size of the whole signal is the length of z, which is the square root of z* z. Enter z* z, then the length of z.`,
  answer: [s, r],
  hints: ['z* z is the sum of the squared magnitudes of the three entries. For each entry, square the real part, square the number in front of i, and add the two squares.', 'The length is the square root of z* z, the same way the length of an ordinary vector is the root of the sum of its squares.'],
  solution: `|${t[0]}|² = ${sq(z[0][0])}+${sq(z[0][1])} = ${n(m[0])}. |${t[1]}|² = ${sq(z[1][0])}+${sq(z[1][1])} = ${n(m[1])}. |${t[2]}|² = ${sq(z[2][0])}+${sq(z[2][1])} = ${n(m[2])}. z* z = ${n(m[0])}+${n(m[1])}+${n(m[2])} = ${n(s)}, and the length is √${n(s)} = ${n(r)} amperes.`,
  guidance: [
   { prompt: `Enter the squared magnitude of each entry of z: first ${t[0]}, then ${t[1]}, then ${t[2]}.`, answer: m, explanation: `${sq(z[0][0])}+${sq(z[0][1])} = ${n(m[0])}, ${sq(z[1][0])}+${sq(z[1][1])} = ${n(m[1])}, and ${sq(z[2][0])}+${sq(z[2][1])} = ${n(m[2])}.` },
   { prompt: `Add the three squared magnitudes to get z* z. Then take the square root for the length. Enter z* z, then the length.`, answer: [s, r], explanation: `${n(m[0])}+${n(m[1])}+${n(m[2])} = ${n(s)}, and √${n(s)} = ${n(r)} because ${n(r)}·${n(r)} = ${n(s)}.` }
  ] }; }
});

/* ---- q35 Hermitian matrices (taught: conjugate transpose; the off-diagonal product is positive; real eigenvalues) ---- */
const parentH = (a, k) => (a === 2 && Math.abs(k) === 1) || (a === 3 && Math.abs(k) === 2);   // the q35 mission and its worked example
/* Setting: a radio coupler. The first box is the taught pitfall: the off-diagonal product is a positive real number. */
practice({ id: 'q35b', parent: 'q35', kind: 'setting',
 title: 'Gains of the radio coupler',
 brief: 'Two radio channels are joined by a coupler, and the signal team needs the two gains it can give.',
 labels: ['off-diagonal product', 'smaller eigenvalue', 'larger eigenvalue'], tolerance: 0.01 },
 [['off-diagonal product'], ['smaller eigenvalue', 'larger eigenvalue']], {
 canonical: { a: 5, b: -3 },
 draw: R => until(() => ({ a: R.nz(-9, 9), b: R.nz(-6, 6) }), p => !parentH(p.a, p.b), { a: 5, b: -3 }),
 build: ({ a, b }) => { const s = Math.abs(b), m = b * b, H = `[[${n(a)},${im(b)}],[${im(-b)},${n(a)}]]`; return {
  prompt: `Two radio channels are joined by a coupler that also shifts the timing of the signal, which is why its matrix has entries with i: H=${H}. H is Hermitian (it equals its own conjugate transpose), so its eigenvalues are real numbers. They are the two gains the coupler can give a signal. Enter the product of the two off-diagonal entries, which is a real number. Then enter the two eigenvalues, smaller first.`,
  answer: [m, a - s, a + s],
  hints: ['Multiply the two off-diagonal entries and replace i² with −1. The result is a positive real number.', 'det(H−λI) is (diagonal entry − λ)² minus that product. Set it to zero: the diagonal entry minus λ is plus or minus the square root of the product.'],
  solution: `(${im(b)})(${im(-b)}) = −${m === 1 ? '' : n(m)}i² = ${n(m)}. det(H−λI) = (${n(a)}−λ)² − ${n(m)} = 0, so ${n(a)}−λ is ${n(s)} or ${n(-s)}. The eigenvalues are ${n(a - s)} and ${n(a + s)}.`,
  guidance: [
   { prompt: `Multiply the off-diagonal entries: (${im(b)})(${im(-b)}). Use i² = −1. What real number do you get?`, answer: [m], explanation: `(${im(b)})(${im(-b)}) = −${m === 1 ? '' : n(m)}i² = ${n(m)}. It is positive, and it is subtracted in the determinant.` },
   { prompt: `det(H−λI) = (${n(a)}−λ)² − ${n(m)}. Setting it to zero gives (${n(a)}−λ)² = ${n(m)}. Enter the two values of λ, smaller first.`, answer: [a - s, a + s], explanation: `${n(a)}−λ is ${n(s)} or ${n(-s)}, so λ is ${n(a - s)} or ${n(a + s)}. Both are real, as they must be for a Hermitian matrix.` }
  ] }; }
});

/* Applied: restore the missing entry by conjugate symmetry, then the eigenvalues of a Hermitian matrix with unequal
   diagonal entries. Draws use (a−d)² + 4(p²+q²) = a perfect square, so both eigenvalues are whole numbers. */
practice({ id: 'q35c', parent: 'q35', kind: 'applied',
 title: 'The damaged coupler log',
 brief: 'One entry of a laser coupler\'s matrix is unreadable in the log, and the signal team must restore it and find the coupler\'s eigenvalues.',
 labels: ['missing entry, real part', 'missing entry, imaginary part', 'smaller eigenvalue', 'larger eigenvalue'], tolerance: 0.01 },
 [['missing entry, real part', 'missing entry, imaginary part'], ['off-diagonal product', 'determinant of H'], ['smaller eigenvalue', 'larger eigenvalue']], {
 canonical: { a: 6, d: 2, p: 1, q: 2 },
 /* [a−d, |p|, |q|]: each row makes (a−d)² + 4(p²+q²) a perfect square. */
 draw: R => until(() => { const [diff, P, Q] = R.pick([[1, 1, 1], [4, 1, 2], [4, 2, 1], [2, 2, 2], [3, 1, 3], [3, 3, 1], [7, 2, 2], [0, 3, 4], [0, 4, 3]]), d = R.nz(-4, 6);
   return { a: d + (R.bool() ? diff : -diff), d, p: R.bool() ? P : -P, q: R.bool() ? Q : -Q }; }, p => p.a !== 0, { a: 6, d: 2, p: 1, q: 2 }),
 build: ({ a, d, p, q }) => { const h = cx(p, q), hc = cx(p, -q), m = p * p + q * q, T = a + d, D = a * d - m, gap = Math.round(Math.sqrt((a - d) * (a - d) + 4 * m)), l1 = (T - gap) / 2, l2 = (T + gap) / 2;
  const poly = 'λ²' + (T ? tm(-T, 'λ') : '') + (D ? sg(D) : ''), fac = l => l === 0 ? 'λ' : `(λ${sg(-l)})`; return {
  prompt: `The log of a laser coupler is damaged. Its matrix reads H=[[${n(a)},${h}],[?,${n(d)}]], and the lower-left entry cannot be read. The coupler is known to be Hermitian: H equals its conjugate transpose, so entries across the diagonal are complex conjugates of each other. Enter the real part of the missing entry, then its imaginary part. Then enter the two eigenvalues of H, smaller first.`,
  answer: [p, -q, l1, l2],
  hints: ['The missing entry is the conjugate of the top-right entry: the same real part, and the imaginary part with its sign flipped.', 'An entry times its conjugate is (real part)² + (imaginary part)². In det(H−λI), multiply (first diagonal entry − λ) by (second diagonal entry − λ), subtract that product, and set the result to zero.', 'Multiplied out, the equation is λ² − (sum of the diagonal entries)·λ + (determinant of H) = 0. Look for two numbers that add up to that sum and multiply to that determinant.'],
  solution: `The missing entry is the conjugate of ${h}, which is ${hc}. The off-diagonal product is (${h})(${hc}) = ${sq(p)}+${sq(q)} = ${n(m)}. det(H−λI) = (${n(a)}−λ)(${n(d)}−λ) − ${n(m)} = ${poly} = ${fac(l1)}${fac(l2)}. The eigenvalues are ${n(l1)} and ${n(l2)}, both real.`,
  guidance: [
   { prompt: `The top-right entry is ${h}. The missing lower-left entry is its conjugate. Enter its real part, then its imaginary part.`, answer: [p, -q], explanation: `Conjugating keeps the real part ${n(p)} and flips the sign of the imaginary part, giving ${hc}.` },
   { prompt: `Multiply the two off-diagonal entries: (${h})(${hc}). Enter the product, which is a real number. Then enter the determinant of H: the product of the diagonal entries minus this product.`, answer: [m, D], explanation: `(${h})(${hc}) = ${sq(p)}+${sq(q)} = ${n(m)}. det H = ${par(a)}·${par(d)} − ${n(m)} = ${n(D)}.` },
   { prompt: `The eigenvalues solve ${poly} = 0. They are the two numbers that add up to ${n(T)} and multiply to ${n(D)}. Enter them, smaller first.`, answer: [l1, l2], explanation: `${n(l1)}${plus(l2)} = ${n(T)} and ${par(l1)}·${par(l2)} = ${n(D)}, so ${poly} = ${fac(l1)}${fac(l2)}. The eigenvalues are ${n(l1)} and ${n(l2)}.` }
  ] }; }
});

/* Challenge with q24: check a complex eigenvector by multiplying it out. v=(1, i) or (1, −i); Hv = (a − s·c)·v. */
practice({ id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q24',
 title: 'A mode of the linked lasers',
 brief: 'Two linked lasers can settle into a steady pattern, and the signal team wants to test one candidate pattern.',
 labels: ['Hv first entry', 'Hv second entry, number in front of i', 'eigenvalue of v', 'other eigenvalue'], tolerance: 0.01 },
 [['Hv first entry'], ['Hv second entry, number in front of i', 'eigenvalue of v'], ['other eigenvalue']], {
 canonical: { a: 4, c: 3, s: -1 },
 draw: R => until(() => ({ a: R.nz(-6, 8), c: R.nz(-5, 5), s: R.pick([1, -1]) }), p => p.a - p.s * p.c !== 0 && !parentH(p.a, p.c), { a: 4, c: 3, s: -1 }),
 build: ({ a, c, s }) => { const mu = a - s * c, other = a + s * c, k = a * s - c, H = `[[${n(a)},${im(c)}],[${im(-c)},${n(a)}]]`, v = `(1, ${im(s)})`, m = c * c; return {
  prompt: `Two linked lasers are described by the Hermitian matrix H=${H}. A mode is a pattern v that H only rescales: Hv is a number times v. That makes v an eigenvector, and the number is its eigenvalue. Test the pattern v=${v}. Hv comes out as a real number followed by a multiple of i. Enter the first entry of Hv, then the number in front of i in the second entry, then the eigenvalue that v belongs to, then the other eigenvalue of H.`,
  answer: [mu, k, mu, other],
  hints: ['Multiply row by column as for real matrices. Wherever i meets i, replace i² with −1.', 'The first entry of v is 1. So if Hv is a number times v, that number is the first entry of Hv. Check that the second entry of Hv is the same number times the second entry of v.', 'For the other eigenvalue use det(H−λI) = (diagonal entry − λ)² − (off-diagonal product) = 0. It has two roots, and you already hold one.'],
  solution: `First entry: ${n(a)}·1 + (${im(c)})(${im(s)}) = ${n(a)}${tm(c * s, 'i²')} = ${n(a)}${sg(-c * s)} = ${n(mu)}. Second entry: (${im(-c)})·1 + ${par(a)}·${s === 1 ? 'i' : '(−i)'} = ${im(-c)}${tm(a * s, 'i')} = ${im(k)}. So Hv = (${n(mu)}, ${im(k)}), which is ${n(mu)} times v: v is an eigenvector with eigenvalue ${n(mu)}. The eigenvalues solve (${n(a)}−λ)² = ${n(m)}, so they are ${n(Math.min(mu, other))} and ${n(Math.max(mu, other))}. The other one is ${n(other)}.`,
  guidance: [
   { prompt: `First entry of Hv: the top row of H is (${n(a)}, ${im(c)}) and v=${v}. Work out ${n(a)}·1 + (${im(c)})(${im(s)}), using i² = −1.`, answer: [mu], explanation: `(${im(c)})(${im(s)}) = ${co(c * s)}i² = ${n(-c * s)}, so the first entry is ${n(a)}${sg(-c * s)} = ${n(mu)}.` },
   { prompt: `Second entry of Hv: the bottom row of H is (${im(-c)}, ${n(a)}). Work out (${im(-c)})·1 + ${par(a)}·${s === 1 ? 'i' : '(−i)'} and enter the number in front of i. Then enter the eigenvalue of v: the number that multiplies v=${v} to give Hv.`, answer: [k, mu], explanation: `${im(-c)}${tm(a * s, 'i')} = ${im(k)}, so the number in front of i is ${n(k)}. Hv = (${n(mu)}, ${im(k)}) is ${n(mu)} times ${v}, so the eigenvalue is ${n(mu)}.` },
   { prompt: `The eigenvalues of H solve (${n(a)}−λ)² = ${n(m)}. One root is ${n(mu)}. Enter the other.`, answer: [other], explanation: `${n(a)}−λ is ${n(Math.abs(c))} or ${n(-Math.abs(c))}, so λ is ${n(a - Math.abs(c))} or ${n(a + Math.abs(c))}. The one that is not ${n(mu)} is ${n(other)}.` }
  ] }; }
});

})();
