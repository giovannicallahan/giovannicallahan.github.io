/* Linear algebra practice missions, file 12 of 14: concepts q56–q60, three practice missions each
   (q56b q56c q56d ... q60b q60c q60d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p12.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- add missions for q56–q60 below this line ---- */

/* Text helpers for this file. sp(−3) → " − 3"; tail(−1,'y') → " − y"; lin([[4,'x'],[−1,'y']]) → "4x − y"
   (a pair with an empty name is a plain number: lin([[2,''],[9,'t']]) → "2 + 9t"). */
const sp = x => (x < 0 ? ' − ' : ' + ') + n(Math.abs(x));
const body = (c, v) => { const a = Math.abs(c); return v === '' ? n(a) : (a === 1 ? '' : n(a)) + v; };
const tail = (c, v) => (c < 0 ? ' − ' : ' + ') + body(c, v);
const lin = pairs => pairs.filter(([c]) => c !== 0).map(([c, v], i) => i === 0 ? (c < 0 ? '−' : '') + body(c, v) : tail(c, v)).join('');
/* Draw until ok(p); the fallback is never reached in practice and is itself a valid parameter set. */
const until = (make, ok, fallback) => { for (let guard = 0; guard < 2000; guard++) { const p = make(); if (ok(p)) return p; } return fallback; };

/* ---- q56 Jacobi iteration ---- */
/* The parent starts from (0,0), where the off-diagonal terms vanish. Here the step starts from a real earlier reading,
   so the old values have to be put into the other row. Parameters a,b,c,d,e,f,x0,y0: a·x+b·y=e, c·x+d·y=f. */
practice({ id: 'q56b', parent: 'q56', kind: 'setting',
 title: 'Coolant loops, one pass',
 brief: 'Two coolant loops share a heat exchanger, and the controller needs one careful update from the last reading.',
 labels: ['x1', 'y1'], tolerance: 0.01 },
 [['x1'], ['y1']], {
 canonical: { a: 4, b: 1, c: 1, d: 3, e: 13, f: 8, x0: 2, y0: 1 },
 /* Strictly diagonally dominant rows. Both new values are whole numbers and both differ from the old ones, so using
    the new x in row two (the Gauss–Seidel slip) always gives a different y. */
 draw: R => until(() => { const a = R.int(2, 6), d = R.int(2, 6), b = R.nz(-(a - 1), a - 1), c = R.nz(-(d - 1), d - 1), x0 = R.nz(-4, 4), y0 = R.nz(-4, 4), x1 = R.nz(-6, 6), y1 = R.nz(-6, 6);
   return { a, b, c, d, e: a * x1 + b * y0, f: d * y1 + c * x0, x0, y0 }; },
  p => p.e !== 0 && p.f !== 0 && (p.e - p.b * p.y0) / p.a !== p.x0 && (p.f - p.c * p.x0) / p.d !== p.y0,
  { a: 5, b: -2, c: 1, d: 4, e: 9, f: -5, x0: 3, y0: -2 }),
 build: ({ a, b, c, d, e, f, x0, y0 }) => { const x1 = (e - b * y0) / a, y1 = (f - c * x0) / d;
  const isoX = `x = (${n(e)}${tail(-b, 'y')})/${n(a)}`, isoY = `y = (${n(f)}${tail(-c, 'x')})/${n(d)}`;
  const subX = `(${n(e)}${sp(-b * y0)})/${n(a)}`, subY = `(${n(f)}${sp(-c * x0)})/${n(d)}`; return {
  prompt: `Two coolant loops share a heat exchanger. Their temperatures x and y, in degrees above or below the set point, must satisfy ${lin([[a, 'x'], [b, 'y']])} = ${n(e)} and ${lin([[c, 'x'], [d, 'y']])} = ${n(f)}. The last reading was (x₀, y₀) = ${vec([x0, y0])}. Take one Jacobi step from that reading. Enter x₁, then y₁.`,
  answer: [x1, y1],
  hints: [`Solve row one for x and row two for y: ${isoX} and ${isoY}.`, `Put the last reading on the right-hand side: y₀ = ${n(y0)} goes into the x formula and x₀ = ${n(x0)} goes into the y formula. Do not use your new x when you work out y.`],
  solution: `Row one gives ${isoX}. With the old y₀ = ${n(y0)}: x₁ = ${subX} = ${n(x1)}. Row two gives ${isoY}. With the old x₀ = ${n(x0)}: y₁ = ${subY} = ${n(y1)}. Both updates use the last reading only, so the step is (x₁, y₁) = ${vec([x1, y1])}.`,
  guidance: [
   { prompt: `Row one solved for x is ${isoX}. Put in the old value y₀ = ${n(y0)}. What is x₁?`, answer: [x1], explanation: `x₁ = ${subX} = ${n(x1)}. The x update reads the old y.` },
   { prompt: `Row two solved for y is ${isoY}. Put in the old value x₀ = ${n(x0)}, not the new x. What is y₁?`, answer: [y1], explanation: `y₁ = ${subY} = ${n(y1)}. Jacobi uses the previous reading in every row. Using the new x here would be a different method (Gauss–Seidel).` }
  ] }; }
});

/* Two steps from (0,0). e=a·d·s and f=a·d·t, so both steps land on whole numbers. Parameters a,b,c,d,e,f. */
practice({ id: 'q56c', parent: 'q56', kind: 'applied',
 title: 'Substations, two passes',
 brief: 'Two substations pull on each other\'s voltage, and the controller settles them by repeating one simple update.',
 labels: ['x2', 'y2'], tolerance: 0.01 },
 [['x1', 'y1'], ['x2', 'y2']], {
 canonical: { a: 4, b: 1, c: -1, d: 3, e: 12, f: 12 },
 draw: R => until(() => { const a = R.int(2, 5), d = R.int(2, 5), b = R.nz(-(a - 1), a - 1), c = R.nz(-(d - 1), d - 1), s = R.nz(-2, 2), t = R.nz(-2, 2);
   return { a, b, c, d, e: a * d * s, f: a * d * t }; },
  p => p.e / p.a - p.b * p.f / (p.a * p.d) !== 0 && p.f / p.d - p.c * p.e / (p.a * p.d) !== 0,
  { a: 3, b: -1, c: 2, d: 5, e: 15, f: -30 }),
 build: ({ a, b, c, d, e, f }) => { const x1 = e / a, y1 = f / d, x2 = (e - b * y1) / a, y2 = (f - c * x1) / d;
  const isoX = `x = (${n(e)}${tail(-b, 'y')})/${n(a)}`, isoY = `y = (${n(f)}${tail(-c, 'x')})/${n(d)}`; return {
  prompt: `Two substations are joined by one cable. Their voltage offsets x and y, in volts above or below normal, settle where ${lin([[a, 'x'], [b, 'y']])} = ${n(e)} and ${lin([[c, 'x'], [d, 'y']])} = ${n(f)}. The controller starts from (x₀, y₀) = (0, 0) and takes two Jacobi steps, one after the other. Enter the offsets after the second step: x₂, then y₂.`,
  answer: [x2, y2],
  hints: [`Solve row one for x and row two for y: ${isoX} and ${isoY}. One Jacobi step puts the previous pair into both formulas.`, 'Do the first step from (0, 0) and write down that pair. The second step uses that whole pair: the first y goes into the x formula, and the first x goes into the y formula.'],
  solution: `Row one gives ${isoX} and row two gives ${isoY}. Step one from (0, 0): x₁ = ${n(e)}/${n(a)} = ${n(x1)} and y₁ = ${n(f)}/${n(d)} = ${n(y1)}. Step two uses that pair: x₂ = (${n(e)}${sp(-b * y1)})/${n(a)} = ${n(x2)} and y₂ = (${n(f)}${sp(-c * x1)})/${n(d)} = ${n(y2)}.`,
  guidance: [
   { prompt: `Row one gives ${isoX} and row two gives ${isoY}. Put in the start values x₀ = 0 and y₀ = 0. Enter x₁, then y₁.`, answer: [x1, y1], explanation: `With zeros on the right, x₁ = ${n(e)}/${n(a)} = ${n(x1)} and y₁ = ${n(f)}/${n(d)} = ${n(y1)}.` },
   { prompt: `Now the old pair is (x₁, y₁) = ${vec([x1, y1])}. Put y₁ into the x formula and x₁ into the y formula. Enter x₂, then y₂.`, answer: [x2, y2], explanation: `x₂ = (${n(e)}${sp(-b * y1)})/${n(a)} = ${n(x2)} and y₂ = (${n(f)}${sp(-c * x1)})/${n(d)} = ${n(y2)}. Both formulas read the pair from step one, never a value from step two.` }
  ] }; }
});

/* Three unknowns, from a non-zero reading. Parameters A (3 rows), r (right-hand sides), s (last reading). */
practice({ id: 'q56d', parent: 'q56', kind: 'challenge',
 title: 'Three battery banks',
 brief: 'Three battery banks are tied together, and the balance has three unknowns instead of two.',
 labels: ['x1', 'y1', 'z1'], tolerance: 0.01 },
 [['x1'], ['y1'], ['z1']], {
 canonical: { A: [[5, 1, -1], [1, 6, 2], [-1, 2, 5]], r: [11, 21, 18], s: [1, 2, 1] },
 /* Diagonal 5..8, the other entries ±1 or ±2: every row is strictly dominated by its diagonal. The new values are
    whole numbers, each different from the old one, and updating in place (Gauss–Seidel) changes both y and z. */
 draw: R => until(() => { const A = [0, 1, 2].map(i => [0, 1, 2].map(j => i === j ? R.int(5, 8) : R.nz(-2, 2))), s = [R.nz(-3, 3), R.nz(-3, 3), R.nz(-3, 3)], w = [R.nz(-5, 5), R.nz(-5, 5), R.nz(-5, 5)];
   return { A, r: [0, 1, 2].map(i => A[i][i] * w[i] + [0, 1, 2].filter(j => j !== i).reduce((t, j) => t + A[i][j] * s[j], 0)), s }; },
  ({ A, r, s }) => { const w = [0, 1, 2].map(i => (r[i] - [0, 1, 2].filter(j => j !== i).reduce((t, j) => t + A[i][j] * s[j], 0)) / A[i][i]);
   return r.every(x => x !== 0) && w.every((x, i) => x !== s[i]) && A[2][0] * (w[0] - s[0]) + A[2][1] * (w[1] - s[1]) !== 0; },
  { A: [[6, -1, 2], [2, 7, -1], [1, -2, 5]], r: [-11, 8, -15], s: [-2, 1, 3] }),
 build: ({ A, r, s }) => { const V = ['x', 'y', 'z'], others = i => [0, 1, 2].filter(j => j !== i);
  const w = [0, 1, 2].map(i => (r[i] - others(i).reduce((t, j) => t + A[i][j] * s[j], 0)) / A[i][i]);
  const iso = i => `${V[i]} = (${n(r[i])}${others(i).map(j => tail(-A[i][j], V[j])).join('')})/${n(A[i][i])}`;
  const sub = i => `(${n(r[i])}${others(i).map(j => sp(-A[i][j] * s[j])).join('')})/${n(A[i][i])}`;
  const row = i => `${lin([0, 1, 2].map(j => [A[i][j], V[j]]))} = ${n(r[i])}`; return {
  prompt: `Three battery banks are tied together. Their charge offsets x, y and z must satisfy three balance rules. Rule one: ${row(0)}. Rule two: ${row(1)}. Rule three: ${row(2)}. The last reading was (x₀, y₀, z₀) = ${vec(s)}. Take one Jacobi step from that reading. Enter x₁, then y₁, then z₁.`,
  answer: w,
  hints: ['Each rule is solved for its own bank: rule one for x, rule two for y, rule three for z. The other two letters move to the right-hand side.', `All three updates read the last reading ${vec(s)} only. Work out all three new values before you replace any old one.`],
  solution: `Rule one gives ${iso(0)}, so x₁ = ${sub(0)} = ${n(w[0])}. Rule two gives ${iso(1)}, so y₁ = ${sub(1)} = ${n(w[1])}. Rule three gives ${iso(2)}, so z₁ = ${sub(2)} = ${n(w[2])}. Every right-hand side used the last reading ${vec(s)}.`,
  guidance: [0, 1, 2].map(i => ({ prompt: `Rule ${['one', 'two', 'three'][i]} solved for ${V[i]} is ${iso(i)}. Put in the old values ${others(i).map(j => `${V[j]}₀ = ${n(s[j])}`).join(' and ')}. What is ${V[i]}₁?`, answer: [w[i]], explanation: `${V[i]}₁ = ${sub(i)} = ${n(w[i])}.${i ? ' The old values go in, even though a newer one is already known.' : ' With three unknowns, two old values go into each formula.'}` })) }; }
});

/* ---- q57 Matrix exponential and differential systems ---- */
const expt = r => `exp(${r === 1 ? '' : r === -1 ? '−' : n(r)}t)`;
const expln = (r, m) => `exp(${r === 1 ? '' : r === -1 ? '−' : n(r) + ' '}ln ${n(m)})`;
const pw = (m, k) => k === 1 ? n(m) : `${n(m)}² = ${n(m * m)}`;

/* One entry grows and one decays (the parent has a 0 and a decay). Parameters m,g,k,u,v: A=diag(g,−k), t=ln(m). */
practice({ id: 'q57b', parent: 'q57', kind: 'setting',
 title: 'Algae and dye in the tank',
 brief: 'A sealed test tank holds growing algae and a fading tracer dye, and the lab wants both amounts at the next check.',
 labels: ['algae (g)', 'dye (g)'], tolerance: 0.01 },
 [['algae (g)'], ['dye (g)']], {
 canonical: { m: 2, g: 1, k: 2, u: 3, v: 8 },
 draw: R => { const [m, g, k] = R.pick([[2, 1, 1], [2, 1, 2], [2, 2, 1], [2, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1]]); return { m, g, k, u: R.int(2, 7), v: R.int(1, 6) * Math.pow(m, k) }; },
 build: ({ m, g, k, u, v }) => { const G = Math.pow(m, g), D = Math.pow(m, k), x1 = u * G, x2 = v / D; return {
  prompt: `A sealed test tank holds algae and a tracer dye. With x₁ the grams of algae and x₂ the grams of dye, the tank follows x′ = Ax with A = diag(${n(g)}, ${n(-k)}) and time t in days: the algae grow and the dye breaks down. At the start x(0) = ${vec([u, v])}. Enter x(t) at t = ln(${n(m)}) days: the algae, then the dye.`,
  answer: [x1, x2],
  hints: [`A is diagonal, so each amount changes on its own: x₁(t) = x₁(0)·${expt(g)} and x₂(t) = x₂(0)·${expt(-k)}.`, `At t = ln(${n(m)}), exp(t) is exactly ${n(m)}. So ${expt(g)} multiplies by ${g === 1 ? n(m) : `${n(m)}²`} and ${expt(-k)} divides by ${k === 1 ? n(m) : `${n(m)}²`}.`],
  solution: `Algae: x₁ = ${n(u)}·${expln(g, m)} = ${n(u)}·${n(G)} = ${n(x1)}. Dye: x₂ = ${n(v)}·${expln(-k, m)} = ${n(v)}/${n(D)} = ${n(x2)}. A positive diagonal entry makes its amount grow and a negative one makes it shrink.`,
  guidance: [
   { prompt: `The algae entry of A is ${n(g)}, so x₁(t) = ${n(u)}·${expt(g)}. At t = ln(${n(m)}), ${expt(g)} = ${pw(m, g)}. How many grams of algae are there?`, answer: [x1], explanation: `x₁ = ${n(u)}·${n(G)} = ${n(x1)} g. The positive entry means growth.` },
   { prompt: `The dye entry of A is ${n(-k)}, so x₂(t) = ${n(v)}·${expt(-k)}. At t = ln(${n(m)}), ${expt(-k)} is 1 divided by ${pw(m, k)}. How many grams of dye are left?`, answer: [x2], explanation: `x₂ = ${n(v)}/${n(D)} = ${n(x2)} g. The negative entry means decay.` }
  ] }; }
});

/* Two equal time intervals: exp(2tA) = exp(tA)·exp(tA). Parameters m,j,k,u,v: A=diag(−j,−k), readings every ln(m).
   The two rates always differ, so the two plates never share one factor. */
practice({ id: 'q57c', parent: 'q57', kind: 'applied',
 title: 'Cooling plates on the logger',
 brief: 'Two hot test plates cool on the bench, and the logger needs the value it should show at its second reading.',
 labels: ['plate 1', 'plate 2'], tolerance: 0.01 },
 [['plate 1', 'plate 2'], ['plate 1', 'plate 2']], {
 canonical: { m: 2, j: 1, k: 2, u: 12, v: 32 },
 draw: R => { const [m, j, k] = R.pick([[2, 1, 2], [2, 2, 1], [3, 1, 2], [3, 2, 1]]); return { m, j, k, u: R.int(1, 6) * Math.pow(m, 2 * j), v: R.int(1, 6) * Math.pow(m, 2 * k) }; },
 build: ({ m, j, k, u, v }) => { const J = Math.pow(m, j), K = Math.pow(m, k), a = [u / J, v / K], b = [a[0] / J, a[1] / K], gap = Math.round(Math.log(m) * 100) / 100; return {
  prompt: `Two metal plates come out of the furnace and cool on the bench. x₁ and x₂ are how many degrees each plate is above room temperature. They follow x′ = Ax with A = diag(${n(-j)}, ${n(-k)}) and time t in minutes. At the start x(0) = ${vec([u, v])}. The logger reads the plates every ln(${n(m)}) minutes (about ${n(gap)} min). Enter x at the second reading, t = 2·ln(${n(m)}): plate 1, then plate 2.`,
  answer: b,
  hints: [`Over one interval of ln(${n(m)}) minutes, ${expt(-j)} is 1/${n(J)} and ${expt(-k)} is 1/${n(K)}. So one interval divides plate 1 by ${n(J)} and plate 2 by ${n(K)}.`, 'The second reading is one more interval after the first. Each plate is divided by its own factor again.'],
  solution: `A is diagonal, so each plate cools on its own. One interval: x₁ is multiplied by ${expln(-j, m)} = 1/${n(J)} and x₂ by ${expln(-k, m)} = 1/${n(K)}. First reading: (${n(u)}/${n(J)}, ${n(v)}/${n(K)}) = ${vec(a)}. Second reading: (${n(a[0])}/${n(J)}, ${n(a[1])}/${n(K)}) = ${vec(b)}.`,
  guidance: [
   { prompt: `At the first reading t = ln(${n(m)}). Plate 1 is multiplied by ${expt(-j)} = 1/${n(J)} and plate 2 by ${expt(-k)} = 1/${n(K)}. Start from ${vec([u, v])}. Enter plate 1, then plate 2, at the first reading.`, answer: a, explanation: `${n(u)}/${n(J)} = ${n(a[0])} and ${n(v)}/${n(K)} = ${n(a[1])}.` },
   { prompt: `The second reading is another ln(${n(m)}) minutes later, so the same two factors apply again, now to ${vec(a)}. Enter plate 1, then plate 2, at the second reading.`, answer: b, explanation: `${n(a[0])}/${n(J)} = ${n(b[0])} and ${n(a[1])}/${n(K)} = ${n(b[1])}. Equal time steps multiply by the same factors each time.` }
  ] }; }
});

/* A is not diagonal: split x(0) along the eigenvectors, as q25 does for powers. Parameters A, v1, v2, k, m, x0:
   v1=(1,p) has eigenvalue 0, v2=(1,q) has eigenvalue −k, t=ln(m). */
practice({ id: 'q57d', parent: 'q57', kind: 'challenge', uses: 'q25',
 title: 'Motor heat along eigenvectors',
 brief: 'The two wheel motors heat each other, so the system matrix is not diagonal and each mode has to be followed on its own.',
 labels: ['x1', 'x2'], tolerance: 0.01 },
 [['c1', 'c2'], ['new c2'], ['x1', 'x2']], {
 canonical: { A: [[1, -1], [2, -2]], v1: [1, 1], v2: [1, 2], k: 1, m: 2, x0: [7, 11] },
 /* q = p ± 1 keeps A whole. c1 ≠ 0 and the v2 part really shrinks, so neither "divide all of x(0)" nor "leave x₁,
    shrink x₂" (the parent's diagonal pattern) nor reading the diagonal of A alone gives the answer. */
 draw: R => until(() => { const p = R.nz(-2, 2), q = p + R.pick([-1, 1]), [m, k] = R.pick([[2, 1], [2, 2], [3, 1], [3, 2]]), f = -k / (q - p), c1 = R.nz(-4, 4), c2 = R.nz(-3, 3) * Math.pow(m, k);
   return { A: [[-p * f, f], [-p * q * f, q * f]], v1: [1, p], v2: [1, q], k, m, x0: [c1 + c2, c1 * p + c2 * q] }; },
  ({ A, v1, v2, k, m, x0 }) => { const p = v1[1], q = v2[1]; if (q === 0 || x0[0] === 0 || x0[1] === 0) return false; const D = Math.pow(m, k), c1 = (x0[0] * q - x0[1]) / (q - p), w = (x0[1] - p * x0[0]) / (q - p) / D, ans = [c1 + w, c1 * p + w * q];
   const diag = [x0[0] * Math.pow(m, A[0][0]), x0[1] * Math.pow(m, A[1][1])]; return ans[0] !== 0 && ans[1] !== 0 && Math.abs(diag[0] - ans[0]) + Math.abs(diag[1] - ans[1]) > 1e-9; },
  { A: [[1, -1], [2, -2]], v1: [1, 1], v2: [1, 2], k: 1, m: 2, x0: [5, 7] }),
 build: ({ A, v1, v2, k, m, x0 }) => { const det = v1[0] * v2[1] - v1[1] * v2[0], c1 = (x0[0] * v2[1] - x0[1] * v2[0]) / det, c2 = (v1[0] * x0[1] - v1[1] * x0[0]) / det;
  const D = Math.pow(m, k), w = c2 / D, ans = [c1 * v1[0] + w * v2[0], c1 * v1[1] + w * v2[1]];
  const eq1 = `${lin([[v1[0], 'c₁'], [v2[0], 'c₂']])} = ${n(x0[0])}`, eq2 = `${lin([[v1[1], 'c₁'], [v2[1], 'c₂']])} = ${n(x0[1])}`; return {
  prompt: `The rover's two wheel motors heat each other. Their temperatures x = (x₁, x₂), measured from the target, follow x′ = Ax with A = ${mat(A)}. A is not diagonal, but its eigenvectors are known: v₁ = ${vec(v1)} with eigenvalue 0, and v₂ = ${vec(v2)} with eigenvalue ${n(-k)}. At the start x(0) = ${vec(x0)}. Enter x(t) at t = ln(${n(m)}): x₁, then x₂.`,
  answer: ans,
  hints: ['Do not exponentiate the entries of A one by one. Split the start along the eigenvectors instead: find c₁ and c₂ with x(0) = c₁v₁ + c₂v₂.', `Each part then moves on its own. The v₁ part is multiplied by exp(0·t) = 1, so it stays. The v₂ part is multiplied by ${expt(-k)}, which at t = ln(${n(m)}) is 1/${n(D)}.`],
  solution: `Split the start: x(0) = c₁v₁ + c₂v₂ means ${eq1} and ${eq2}, so c₁ = ${n(c1)} and c₂ = ${n(c2)}. The v₁ part has eigenvalue 0 and stays. The v₂ part is multiplied by ${expln(-k, m)} = 1/${n(D)}: its coefficient becomes ${n(c2)}/${n(D)} = ${n(w)}. So x(t) = ${par(c1)}·${vec(v1)} + ${par(w)}·${vec(v2)} = ${vec(ans)}.`,
  guidance: [
   { prompt: `Write the start as x(0) = c₁v₁ + c₂v₂. Row by row that is ${eq1} and ${eq2}. Enter c₁, then c₂.`, answer: [c1, c2], explanation: `c₁ = ${n(c1)} and c₂ = ${n(c2)}: check ${par(c1)}·${vec(v1)} + ${par(c2)}·${vec(v2)} = ${vec(x0)}. These are the coordinates of the start in the eigenvector basis.` },
   { prompt: `The v₁ part has eigenvalue 0, so c₁ stays ${n(c1)}. The v₂ part has eigenvalue ${n(-k)}, so c₂ = ${n(c2)} is multiplied by ${expt(-k)}. At t = ln(${n(m)}) that factor is 1 divided by ${pw(m, k)}. What is the new coefficient of v₂?`, answer: [w], explanation: `${n(c2)}/${n(D)} = ${n(w)}. Each eigenvector direction grows or decays by its own eigenvalue.` },
   { prompt: `Put the parts back together: x(t) = ${par(c1)}·${vec(v1)} + ${par(w)}·${vec(v2)}. Enter x₁, then x₂.`, answer: ans, explanation: `x₁ = ${n(c1 * v1[0])}${sp(w * v2[0])} = ${n(ans[0])} and x₂ = ${n(c1 * v1[1])}${sp(w * v2[1])} = ${n(ans[1])}.` }
  ] }; }
});

/* ---- q58 General vector spaces and polynomials ---- */
const poly = c => lin([[c[0], ''], [c[1], 't'], [c[2], 't²']]);

/* Coordinates of the derivative, and then one value of it: the two things the parent's pitfall tells apart.
   Parameters c (three coefficients of h), T (the moment asked for). */
practice({ id: 'q58b', parent: 'q58', kind: 'setting',
 title: 'Drone climb rate',
 brief: 'A survey drone\'s height is logged as a polynomial, and the flight desk wants its climb rate.',
 labels: ['constant', 't coefficient', 'climb rate (m/s)'], tolerance: 0.01 },
 [['constant', 't coefficient'], ['climb rate (m/s)']], {
 canonical: { c: [2, 9, -2], T: 2 },
 /* c0 ≠ c1, so copying the first two coordinates of h without differentiating is never right. The drone is still
    above the ground at the moment asked for (h(T) > 0); the rate there may be negative or 0, and the text says what that means. */
 draw: R => until(() => ({ c: [R.int(1, 9), R.int(2, 12), R.nz(-3, 3)], T: R.int(1, 4) }), p => p.c[0] !== p.c[1] && p.c[0] + p.c[1] * p.T + p.c[2] * p.T * p.T > 0, { c: [3, 8, -1], T: 3 }),
 build: ({ c, T }) => { const d = [c[1], 2 * c[2]], rate = d[0] + d[1] * T, dtxt = lin([[d[0], ''], [d[1], 't']]);
  const sense = rate < 0 ? ' A negative rate means the drone is coming down.' : rate === 0 ? ' A rate of 0 means the drone is level at that moment.' : ''; return {
  prompt: `A survey drone is in the air. Its height in metres, t seconds after its log starts, is h(t) = ${poly(c)}. Its climb rate is the derivative h′(t). Enter the coordinates of h′(t) in the basis (1, t): the constant, then the t coefficient. Then enter the climb rate at t = ${n(T)}, in metres per second.`,
  answer: [d[0], d[1], rate],
  hints: ['Differentiate each basis piece: a constant becomes 0, t becomes 1, and t² becomes 2t.', 'The coordinates are the two numbers in h′(t) = (constant) + (coefficient)·t. The climb rate at one moment is a single number: put that t into h′(t).'],
  solution: `Differentiate term by term: ${n(c[0])} becomes 0, ${lin([[c[1], 't']])} becomes ${n(d[0])}, and ${lin([[c[2], 't²']])} becomes ${lin([[d[1], 't']])}. So h′(t) = ${dtxt}, with coordinates ${vec(d)} in the basis (1, t). At t = ${n(T)}: ${n(d[0])}${sp(d[1] * T)} = ${n(rate)}, so the climb rate is ${n(rate)} m/s.${sense}`,
  guidance: [
   { prompt: `Differentiate h(t) = ${poly(c)} term by term. The constant ${n(c[0])} becomes 0. What do ${lin([[c[1], 't']])} and ${lin([[c[2], 't²']])} become? Enter the constant of h′(t), then its t coefficient.`, answer: d, explanation: `${lin([[c[1], 't']])} becomes ${n(d[0])} and ${lin([[c[2], 't²']])} becomes ${lin([[d[1], 't']])}, so h′(t) = ${dtxt}.` },
   { prompt: `Now use h′(t) = ${dtxt} at the moment t = ${n(T)}. What is the climb rate?`, answer: [rate], explanation: `${n(d[0])}${sp(d[1] * T)} = ${n(rate)}.${sense} The coordinates describe the whole polynomial. This number is its value at one moment.` }
  ] }; }
});

/* Polynomials added and scaled as vectors, then differentiated. Parameters a, b (the weights), p, q (coefficients). */
practice({ id: 'q58c', parent: 'q58', kind: 'applied',
 title: 'Blended arm profiles',
 brief: 'The robot arm blends two stored motion profiles, and the motor driver needs the speed of the blend.',
 labels: ['constant', 't coefficient'], tolerance: 0.01 },
 [['constant', 't coefficient', 't² coefficient'], ['constant', 't coefficient']], {
 canonical: { a: 2, b: -1, p: [1, 2, -1], q: [3, -1, 2] },
 /* Every coordinate of the blend is non-zero, and its first two differ, so skipping the derivative is never right. */
 draw: R => until(() => ({ a: R.int(2, 3), b: R.pick([-2, -1]), p: [R.nz(-5, 5), R.nz(-5, 5), R.nz(-4, 4)], q: [R.nz(-5, 5), R.nz(-5, 5), R.nz(-4, 4)] }),
  ({ a, b, p, q }) => { const r = p.map((x, i) => a * x + b * q[i]); return r.every(x => x !== 0) && r[0] !== r[1]; },
  { a: 3, b: -2, p: [2, 1, 3], q: [1, -2, 2] }),
 build: ({ a, b, p, q }) => { const r = p.map((x, i) => a * x + b * q[i]), d = [r[1], 2 * r[2]], combo = `${n(a)}p(t) − ${b === -1 ? '' : n(-b)}q(t)`; return {
  prompt: `A robot arm stores each motion profile as a polynomial of degree at most 2, with coordinates in the basis (1, t, t²). Profile p is p(t) = ${poly(p)} and profile q is q(t) = ${poly(q)}. The controller plays the blend r(t) = ${combo}. Enter the coordinates of the blend's speed r′(t) in the basis (1, t): the constant, then the t coefficient.`,
  answer: d,
  hints: [`Polynomials add and scale like vectors, one coordinate at a time. In the basis (1, t, t²), p is ${vec(p)} and q is ${vec(q)}.`, 'Find the three coordinates of r first. Then differentiate: the constant drops out, t becomes 1, and t² becomes 2t.'],
  solution: `In the basis (1, t, t²), p = ${vec(p)} and q = ${vec(q)}. The blend is ${n(a)}·${vec(p)} − ${b === -1 ? '' : n(-b) + '·'}${vec(q)} = ${vec(r)}, so r(t) = ${poly(r)}. Differentiate: r′(t) = ${lin([[d[0], ''], [d[1], 't']])}, with coordinates ${vec(d)} in the basis (1, t).`,
  guidance: [
   { prompt: `In the basis (1, t, t²), p = ${vec(p)} and q = ${vec(q)}. Work out ${n(a)}·${vec(p)} − ${b === -1 ? '' : n(-b) + '·'}${vec(q)} one coordinate at a time. Enter the coordinates of r: the constant, the t coefficient, then the t² coefficient.`, answer: r, explanation: `Constant: ${n(a * p[0])}${sp(b * q[0])} = ${n(r[0])}. t: ${n(a * p[1])}${sp(b * q[1])} = ${n(r[1])}. t²: ${n(a * p[2])}${sp(b * q[2])} = ${n(r[2])}. So r(t) = ${poly(r)}.` },
   { prompt: `Differentiate r(t) = ${poly(r)}. Enter the coordinates of r′(t) in the basis (1, t): the constant, then the t coefficient.`, answer: d, explanation: `The constant ${n(r[0])} drops out, ${lin([[r[1], 't']])} becomes ${n(d[0])}, and ${lin([[r[2], 't²']])} becomes ${lin([[d[1], 't']])}. The coordinates are ${vec(d)}.` }
  ] }; }
});

/* The same polynomial in two bases (q15: coordinates depend on the basis). Parameters h (the clock delay) and a, b, c
   (coordinates in the basis (1, t−h, (t−h)²)). */
practice({ id: 'q58d', parent: 'q58', kind: 'challenge', uses: 'q15',
 title: 'The late tracking clock',
 brief: 'A tracking station started its clock late, so its record of the rover\'s path uses a different basis from mission control\'s.',
 labels: ['constant', 't coefficient', 't² coefficient'], tolerance: 0.01 },
 [['constant', 't coefficient'], ['constant'], ['t coefficient', 't² coefficient']], {
 canonical: { h: 1, a: 4, b: 3, c: 2 },
 draw: R => until(() => ({ h: R.int(1, 3), a: R.nz(-6, 6), b: R.nz(-5, 5), c: R.nz(-3, 3) }), ({ h, a, b, c }) => c * h * h - b * h !== 0 && a - b * h + c * h * h !== 0 && b - 2 * c * h !== 0, { h: 2, a: 5, b: -1, c: 1 }),
 build: ({ h, a, b, c }) => { const K = a - b * h + c * h * h, T = b - 2 * c * h, s = `(t − ${n(h)})`, sq = `t² − ${n(2 * h)}t + ${n(h * h)}`; return {
  prompt: `A tracking station started its clock ${n(h)} second${h === 1 ? '' : 's'} after launch. It stored the rover's path p in the basis (1, t − ${n(h)}, ${s}²) with coordinates ${vec([a, b, c])}, which means p(t) = ${n(a)}${tail(b, s)}${tail(c, s + '²')}. Mission control uses the basis (1, t, t²). Enter the coordinates of the same p in mission control's basis: the constant, the t coefficient, then the t² coefficient.`,
  answer: [K, T, c],
  hints: [`The numbers ${vec([a, b, c])} are coordinates in the station's basis only. Multiply out ${s}² and collect what stands with 1, with t and with t².`, `${s}² gives a t² piece, a t piece and a constant. The term with ${s} also gives a constant. All of them count.`],
  solution: `${s}² = ${sq}. Constants: ${n(a)} from the first term, ${n(-b * h)} from ${lin([[b, s]])} and ${n(c * h * h)} from the square: ${n(a)}${sp(-b * h)}${sp(c * h * h)} = ${n(K)}. t terms: ${n(b)} from ${lin([[b, s]])} and ${n(-2 * c * h)} from the square: ${n(b)}${sp(-2 * c * h)} = ${n(T)}. t² term: ${n(c)}. So p(t) = ${poly([K, T, c])}, with coordinates ${vec([K, T, c])} in the basis (1, t, t²).`,
  guidance: [
   { prompt: `Multiply out ${s}² = ${s}·${s}. The t² coefficient is 1. Enter its constant, then its t coefficient.`, answer: [h * h, -2 * h], explanation: `${s}² = ${sq}: constant ${n(h * h)}, t coefficient ${n(-2 * h)}.` },
   { prompt: `Collect the constants of p(t) = ${n(a)}${tail(b, s)}${tail(c, s + '²')}: ${n(a)} from the first term, ${par(b)}·${par(-h)} from the middle term, and ${par(c)}·${n(h * h)} from the square. What is the constant of p?`, answer: [K], explanation: `${n(a)}${sp(-b * h)}${sp(c * h * h)} = ${n(K)}.` },
   { prompt: `Collect the t terms: ${n(b)} from the middle term and ${par(c)}·${par(-2 * h)} from the square. The t² term comes from the square alone. Enter the t coefficient, then the t² coefficient.`, answer: [T, c], explanation: `t coefficient: ${n(b)}${sp(-2 * c * h)} = ${n(T)}. t² coefficient: ${n(c)}. Same path, new basis, new coordinates: ${vec([K, T, c])}.` }
  ] }; }
});

/* ---- q59 Dual vectors and linear functionals ---- */
const fn = l => lin([[l[0], 'x₁'], [l[1], 'x₂']]);
const on = (l, b) => `${n(l[0])}·${par(b[0])} ${l[1] < 0 ? '−' : '+'} ${n(Math.abs(l[1]))}·${par(b[1])}`;
const dot = (l, b) => l[0] * b[0] + l[1] * b[1];

/* A price formula is a functional; its coefficients in the crate basis are the crate prices. Parameters l, b1, b2. */
practice({ id: 'q59b', parent: 'q59', kind: 'setting',
 title: 'Crates on the supply ledger',
 brief: 'The supply ledger prices food by the kilogram, but the depot ships it in two fixed crates.',
 labels: ['cost of crate one', 'cost of crate two'], tolerance: 0.01 },
 [['cost of crate one'], ['cost of crate two']], {
 canonical: { l: [3, 2], b1: [2, 1], b2: [3, 4] },
 /* The crates are independent, and mixing up rows and columns of B (rice of both crates, beans of both crates) never
    gives the two crate prices. */
 draw: R => until(() => ({ l: [R.int(2, 9), R.int(2, 9)], b1: [R.int(1, 4), R.int(1, 4)], b2: [R.int(1, 4), R.int(1, 4)] }),
  ({ l, b1, b2 }) => l[0] !== l[1] && b1[0] * b2[1] - b1[1] * b2[0] !== 0 && !(dot(l, [b1[0], b2[0]]) === dot(l, b1) && dot(l, [b1[1], b2[1]]) === dot(l, b2)),
  { l: [5, 2], b1: [1, 3], b2: [2, 1] }),
 build: ({ l, b1, b2 }) => { const v1 = dot(l, b1), v2 = dot(l, b2); return {
  prompt: `The supply ledger prices an order with one formula: ℓ(x) = ${fn(l)} credits, where x₁ is kilograms of rice and x₂ is kilograms of beans. The depot ships only two fixed crates. Crate one holds b₁ = ${vec(b1)} and crate two holds b₂ = ${vec(b2)}, each written as (kg of rice, kg of beans). An order counted in crates uses the basis (b₁, b₂). Enter the two coefficients of ℓ in that basis: the cost of crate one, then the cost of crate two.`,
  answer: [v1, v2],
  hints: ['The coefficient that goes with a basis vector is what ℓ reads on that vector. Put crate one\'s kilograms into the cost formula.', `For crate two use b₂ = ${vec(b2)}: its rice goes in for x₁ and its beans for x₂. A functional changes basis as the row ℓB, so no inverse is needed.`],
  solution: `ℓ(b₁) = ${on(l, b1)} = ${n(v1)}. ℓ(b₂) = ${on(l, b2)} = ${n(v2)}. In the crate basis the formula is ${lin([[v1, 'c₁'], [v2, 'c₂']])} for c₁ crates of type one and c₂ of type two.`,
  guidance: [
   { prompt: `Put crate one, b₁ = ${vec(b1)}, into ℓ(x) = ${fn(l)}. What does crate one cost?`, answer: [v1], explanation: `ℓ(b₁) = ${on(l, b1)} = ${n(v1)} credits. That is the first coefficient of ℓ in the crate basis.` },
   { prompt: `Now put crate two, b₂ = ${vec(b2)}, into the same formula. What does crate two cost?`, answer: [v2], explanation: `ℓ(b₂) = ${on(l, b2)} = ${n(v2)} credits. The new coefficients are the readings of ℓ on the basis vectors.` }
  ] }; }
});

/* The functional in the new basis, then used on new coordinates, then checked the long way. Parameters w, b1, b2, c. */
practice({ id: 'q59c', parent: 'q59', kind: 'applied',
 title: 'Scoring a striker\'s season',
 brief: 'A scout rates a striker with one formula and wants to score a whole season from a count of two kinds of month.',
 labels: ['score of month one', 'score of month two', 'season score'], tolerance: 0.01 },
 [['score of month one', 'score of month two'], ['season score'], ['goals', 'assists']], {
 canonical: { w: [4, 3], b1: [3, 1], b2: [2, 2], c: [5, 4] },
 /* Applying the weights straight to the month counts (w·c), or to rows of B, never gives the season score. */
 draw: R => until(() => ({ w: [R.int(1, 4), R.int(1, 4)], b1: [R.int(1, 3), R.int(1, 3)], b2: [R.int(1, 3), R.int(1, 3)], c: [R.int(2, 5), R.int(2, 5)] }),
  ({ w, b1, b2, c }) => { const v = [dot(w, b1), dot(w, b2)]; return w[0] !== w[1] && b1[0] * b2[1] - b1[1] * b2[0] !== 0 && v[0] !== v[1] && !(dot(w, [b1[0], b2[0]]) === v[0] && dot(w, [b1[1], b2[1]]) === v[1]) && dot(w, c) !== dot(v, c); },
  { w: [3, 1], b1: [2, 1], b2: [1, 3], c: [4, 2] }),
 build: ({ w, b1, b2, c }) => { const v = [dot(w, b1), dot(w, b2)], total = dot(v, c), x = [c[0] * b1[0] + c[1] * b2[0], c[0] * b1[1] + c[1] * b2[1]]; return {
  prompt: `A scout scores a striker with one formula: ℓ(x) = ${fn(w)}, where x₁ is goals and x₂ is assists. The striker has two kinds of month. A home-heavy month is b₁ = ${vec(b1)} and an away-heavy month is b₂ = ${vec(b2)}, each written as (goals, assists). Last season was ${n(c[0])} months of the first kind and ${n(c[1])} of the second, so x = ${n(c[0])}b₁ + ${n(c[1])}b₂. Enter the coefficients of ℓ in the basis (b₁, b₂), which are the score of one month of each kind. Then enter the season score.`,
  answer: [v[0], v[1], total],
  hints: ['The coefficients of ℓ in the new basis are its readings on the basis vectors: put each kind of month into the formula.', 'Once you have a score per month, the season is a count of months: multiply each month score by how many such months there were, then add.'],
  solution: `ℓ(b₁) = ${on(w, b1)} = ${n(v[0])} and ℓ(b₂) = ${on(w, b2)} = ${n(v[1])}. In month coordinates the formula is ${lin([[v[0], 'c₁'], [v[1], 'c₂']])}. The season is c = ${vec(c)}: ${n(v[0])}·${n(c[0])} + ${n(v[1])}·${n(c[1])} = ${n(total)}. Check the long way: x = ${vec(x)} goals and assists, and ℓ(x) = ${on(w, x)} = ${n(total)}.`,
  guidance: [
   { prompt: `Put each kind of month into ℓ(x) = ${fn(w)}: first b₁ = ${vec(b1)}, then b₂ = ${vec(b2)}. Enter the score of month one, then of month two.`, answer: v, explanation: `ℓ(b₁) = ${on(w, b1)} = ${n(v[0])} and ℓ(b₂) = ${on(w, b2)} = ${n(v[1])}. These are the coefficients of ℓ in the basis (b₁, b₂).` },
   { prompt: `The season is ${n(c[0])} months worth ${n(v[0])} each and ${n(c[1])} months worth ${n(v[1])} each. What is the season score?`, answer: [total], explanation: `${n(v[0])}·${n(c[0])} + ${n(v[1])}·${n(c[1])} = ${n(total)}. The row of new coefficients acts on the month counts.` },
   { prompt: `Check the long way. The season's totals are x = ${n(c[0])}·${vec(b1)} + ${n(c[1])}·${vec(b2)}. Enter the goals, then the assists.`, answer: x, explanation: `x = ${vec(x)}, and ℓ(x) = ${on(w, x)} = ${n(total)}. Both routes give the same score, as they must.` }
  ] }; }
});

/* The reverse of the parent: the readings on a basis are known, the weights are not. Two equations (q11).
   Parameters b1, b2 (test pushes) and r (their readings). */
const times = k => k === 1 ? '' : `${par(k)} times `;
practice({ id: 'q59d', parent: 'q59', kind: 'challenge', uses: 'q11',
 title: 'Lost sensor weights',
 brief: 'A strain sensor on the antenna mast has lost its calibration sheet, but two logged test pushes are enough to rebuild it.',
 labels: ['w1', 'w2'], tolerance: 0.01 },
 [['w2'], ['w1']], {
 canonical: { b1: [1, 2], b2: [3, 1], r: [7, 11] },
 /* Whole-number weights by construction; the first number of each push is 1, 2 or 3. The readings are not the weights, and treating the readings as a column
    (B⁻¹r, the rule for vector coordinates) instead of a row never gives the weights. */
 draw: R => until(() => { const l = [R.nz(-5, 5), R.nz(-5, 5)], b1 = [R.int(1, 3), R.nz(-3, 3)], b2 = [R.int(1, 3), R.nz(-3, 3)]; return { b1, b2, r: [dot(l, b1), dot(l, b2)] }; },
  ({ b1, b2, r }) => { const det = b1[0] * b2[1] - b1[1] * b2[0]; if (det === 0 || r[0] === 0 || r[1] === 0) return false;
   const l = [(r[0] * b2[1] - r[1] * b1[1]) / det, (b1[0] * r[1] - b2[0] * r[0]) / det]; if (Math.abs(r[0] - l[0]) + Math.abs(r[1] - l[1]) < 1e-9) return false;
   const col = [(b2[1] * r[0] - b2[0] * r[1]) / det, (b1[0] * r[1] - b1[1] * r[0]) / det]; return Math.abs(col[0] - l[0]) + Math.abs(col[1] - l[1]) > 1e-9; },
  { b1: [2, 1], b2: [1, -3], r: [1, 11] }),
 build: ({ b1, b2, r }) => { let g = b1[0], y = b2[0]; while (y) [g, y] = [y, g % y];
  const m1 = b2[0] / g, m2 = b1[0] / g, K = m1 * b1[1] - m2 * b2[1], Rr = m1 * r[0] - m2 * r[1], l2 = Rr / K, l1 = (r[0] - b1[1] * l2) / b1[0];
  const eq1 = `${lin([[b1[0], 'w₁'], [b1[1], 'w₂']])} = ${n(r[0])}`, eq2 = `${lin([[b2[0], 'w₁'], [b2[1], 'w₂']])} = ${n(r[1])}`;
  const combo = `${times(m1)}the first equation minus ${times(m2)}the second`, left = `${lin([[K, 'w₂']])} = ${n(Rr)}${K === 1 ? '' : `, so w₂ = ${n(l2)}`}`; return {
  prompt: `A strain sensor on the antenna mast turns a push x = (x₁, x₂) into one number, ℓ(x) = w₁x₁ + w₂x₂, but its two weights w₁ and w₂ were lost. Two test pushes are in the log. The push b₁ = ${vec(b1)} gave a reading of ${n(r[0])}, and the push b₂ = ${vec(b2)} gave a reading of ${n(r[1])}. Find the weights. Enter w₁, then w₂.`,
  answer: [l1, l2],
  hints: [`A reading is ℓ on that push. Test one says ${eq1}. Write the same kind of equation for test two.`, 'You now have two equations in w₁ and w₂. Eliminate one weight, as for any linear system. The two readings are the coefficients of ℓ in the basis (b₁, b₂), not the weights themselves.'],
  solution: `Test one: ${eq1}. Test two: ${eq2}. Take ${combo}: ${left}. Back in the first equation: ${lin([[b1[0], 'w₁']])}${sp(b1[1] * l2)} = ${n(r[0])}, so w₁ = ${n(l1)}. Check on b₂: ${on([l1, l2], b2)} = ${n(r[1])}.`,
  guidance: [
   { prompt: `Each test push gives one equation: ${eq1} and ${eq2}. Take ${combo}, so that w₁ drops out. What is w₂?`, answer: [l2], explanation: `The w₁ terms cancel and leave ${left}.` },
   { prompt: `Put w₂ = ${n(l2)} into the first equation: ${lin([[b1[0], 'w₁']])}${sp(b1[1] * l2)} = ${n(r[0])}. What is w₁?`, answer: [l1], explanation: `${lin([[b1[0], 'w₁']])} = ${n(r[0])}${sp(-b1[1] * l2)} = ${n(r[0] - b1[1] * l2)}${b1[0] === 1 ? '' : `, so w₁ = ${n(l1)}`}. Check on the second push: ${on([l1, l2], b2)} = ${n(r[1])}.` }
  ] }; }
});

/* ---- q60 Generalized eigenproblems ---- */
/* Asks for the frequencies √λ (the parent asks for λ), and the racks are not listed in ascending order.
   Parameters k (two stiffnesses), m (two masses). */
practice({ id: 'q60b', parent: 'q60', kind: 'setting',
 title: 'Racks on spring mounts',
 brief: 'Two instrument racks sit on spring mounts, and the lab must know how fast each one shakes before the pumps are switched on.',
 labels: ['lower frequency', 'higher frequency'], tolerance: 0.01 },
 [['lambda of rack A', 'lambda of rack B'], ['lower frequency', 'higher frequency']], {
 canonical: { k: [50, 36], m: [2, 4] },
 /* λ is a perfect square from 4 to 36, different for the two racks, so each frequency is a whole number and is never
    equal to its λ. */
 draw: R => until(() => { const la = R.pick([4, 9, 16, 25, 36]), lb = R.pick([4, 9, 16, 25, 36]), m = [R.int(2, 6), R.int(2, 6)]; return { k: [la * m[0], lb * m[1]], m }; },
  ({ k, m }) => k[0] / m[0] !== k[1] / m[1] && k[0] <= 150 && k[1] <= 150, { k: [48, 45], m: [3, 5] }),
 build: ({ k, m }) => { const lam = [k[0] / m[0], k[1] / m[1]], f = lam.map(Math.sqrt).map(Math.round), lo = Math.min(f[0], f[1]), hi = Math.max(f[0], f[1]), low = f[0] < f[1] ? 'A' : 'B'; return {
  prompt: `Two instrument racks each sit on their own spring mount. Rack A has stiffness ${n(k[0])} newtons per metre and mass ${n(m[0])} kg. Rack B has stiffness ${n(k[1])} newtons per metre and mass ${n(m[1])} kg. So K = diag${vec(k)} and M = diag${vec(m)}. Each rack shakes at the angular frequency √λ, where Kv = λMv. Enter the two angular frequencies in radians per second, the lower one first.`,
  answer: [lo, hi],
  hints: ['K and M are diagonal, so each rack is its own mode: stiffness = λ × mass, which gives λ = stiffness ÷ mass.', 'The frequency is the square root of λ, not λ itself. Compare the two frequencies before you enter them: the racks may not be listed in order.'],
  solution: `Rack A: λ = ${n(k[0])}/${n(m[0])} = ${n(lam[0])}, so its frequency is √${n(lam[0])} = ${n(f[0])}. Rack B: λ = ${n(k[1])}/${n(m[1])} = ${n(lam[1])}, so its frequency is √${n(lam[1])} = ${n(f[1])}. Rack ${low} is the slower one: the frequencies are ${n(lo)} and ${n(hi)} radians per second.`,
  guidance: [
   { prompt: `For each rack, λ = stiffness ÷ mass: ${n(k[0])}/${n(m[0])} for rack A and ${n(k[1])}/${n(m[1])} for rack B. Enter λ for rack A, then for rack B.`, answer: lam, explanation: `${n(k[0])}/${n(m[0])} = ${n(lam[0])} and ${n(k[1])}/${n(m[1])} = ${n(lam[1])}. The mass matters: stiffness alone would give the wrong numbers.` },
   { prompt: `The angular frequency is √λ. Take the square roots of ${n(lam[0])} and ${n(lam[1])}. Enter the lower frequency, then the higher one.`, answer: [lo, hi], explanation: `√${n(lam[0])} = ${n(f[0])} and √${n(lam[1])} = ${n(f[1])}. In ascending order: ${n(lo)}, then ${n(hi)}.` }
  ] }; }
});

/* The mass matrix changes and the stiffness does not; the order of the eigenvalues can flip.
   Parameters k, m (before loading) and dm (mass added to the body, part one). */
const lcm = (a, b) => { let x = a, y = b; while (y) [x, y] = [y, x % y]; return a * b / x; };
practice({ id: 'q60c', parent: 'q60', kind: 'applied',
 title: 'Rock samples on board',
 brief: 'The rover is about to take on rock samples, and extra mass changes how its body bounces on the suspension.',
 labels: ['lambda1', 'lambda2'], tolerance: 0.01 },
 [['lambda1 before', 'lambda2 before'], ['lambda1', 'lambda2']], {
 canonical: { k: [24, 32], m: [2, 4], dm: 2 },
 /* All four quotients are whole numbers, and the two eigenvalues differ both before and after loading. */
 draw: R => until(() => { const [m1, dm] = R.pick([[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 4], [3, 1], [3, 3], [4, 2], [4, 4]]), m2 = R.int(2, 5); return { k: [R.int(1, 4) * lcm(m1, m1 + dm), R.int(1, 12) * m2], m: [m1, m2], dm }; },
  ({ k, m, dm }) => k[0] <= 60 && k[1] <= 60 && k[0] / m[0] !== k[1] / m[1] && k[0] / (m[0] + dm) !== k[1] / m[1], { k: [36, 20], m: [3, 4], dm: 3 }),
 build: ({ k, m, dm }) => { const before = [k[0] / m[0], k[1] / m[1]], M1 = m[0] + dm, after = [k[0] / M1, k[1] / m[1]], asc = v => [Math.min(v[0], v[1]), Math.max(v[0], v[1])], bs = asc(before), as = asc(after);
  const flip = (before[0] < before[1]) !== (after[0] < after[1]); return {
  prompt: `The rover has two parts that bounce on their own springs. The body has stiffness ${n(k[0])} newtons per metre and mass ${n(m[0])} kg. The sample arm has stiffness ${n(k[1])} newtons per metre and mass ${n(m[1])} kg. So K = diag${vec(k)} and M = diag${vec(m)}. The crew now loads rock samples, which add ${n(dm)} kg to the mass of the body only. Enter the two generalized eigenvalues λ of the loaded rover, from Kv = λMv, in ascending order.`,
  answer: as,
  hints: [`Loading changes M, not K. The new mass matrix is M = diag(${n(m[0])} + ${n(dm)}, ${n(m[1])}).`, 'Each eigenvalue is a stiffness divided by its own mass. Work both out again with the new M, then put them in ascending order.'],
  solution: `Before loading: ${n(k[0])}/${n(m[0])} = ${n(before[0])} for the body and ${n(k[1])}/${n(m[1])} = ${n(before[1])} for the arm. Loading makes the body's mass ${n(m[0])} + ${n(dm)} = ${n(M1)}, so its eigenvalue becomes ${n(k[0])}/${n(M1)} = ${n(after[0])}. The arm keeps ${n(after[1])}. In ascending order the loaded rover has λ = ${n(as[0])} and ${n(as[1])}.${flip ? ' The body used to be the faster part and is now the slower one: mass changed the order.' : ' More mass on the same spring gives a smaller eigenvalue, so a slower bounce.'}`,
  guidance: [
   { prompt: `Start with the empty rover. Divide each stiffness by its own mass: ${n(k[0])}/${n(m[0])} for the body and ${n(k[1])}/${n(m[1])} for the arm. Enter the two eigenvalues in ascending order.`, answer: bs, explanation: `Body: ${n(before[0])}. Arm: ${n(before[1])}. Ascending: ${n(bs[0])}, then ${n(bs[1])}.` },
   { prompt: `Now load the body: its mass is ${n(m[0])} + ${n(dm)} = ${n(M1)}, and its stiffness is still ${n(k[0])}. The arm is unchanged. Enter the two eigenvalues of the loaded rover in ascending order.`, answer: as, explanation: `Body: ${n(k[0])}/${n(M1)} = ${n(after[0])}. Arm: still ${n(after[1])}. Ascending: ${n(as[0])}, then ${n(as[1])}.` }
  ] }; }
});

/* K is not diagonal: det(K − λM) = 0, the q23 method with M in place of I. Parameters a, c, m:
   K = [[a, −c], [−c, a]], M = diag(m, m). */
practice({ id: 'q60d', parent: 'q60', kind: 'challenge', uses: 'q23',
 title: 'Pumps on one frame',
 brief: 'Two identical pumps are bolted to one flexible frame, so pushing one moves the other and the stiffness matrix is no longer diagonal.',
 labels: ['lambda1', 'lambda2'], tolerance: 0.01 },
 [['smaller value', 'larger value'], ['lambda1', 'lambda2']], {
 canonical: { a: 10, c: 6, m: 2 },
 /* a − c and a + c are both whole multiples of m, with a > c > 0, so both eigenvalues are positive whole numbers. */
 draw: R => until(() => { const m = R.int(2, 5), l1 = R.int(1, 6), l2 = l1 + R.int(1, 8); return { a: m * (l1 + l2) / 2, c: m * (l2 - l1) / 2, m }; },
  ({ a, c }) => Number.isInteger(a) && Number.isInteger(c) && a <= 40, { a: 12, c: 3, m: 3 }),
 build: ({ a, c, m }) => { const lo = a - c, hi = a + c, l1 = lo / m, l2 = hi / m, d = `${n(a)} − ${n(m)}λ`; return {
  prompt: `Two identical pumps, each of mass ${n(m)} kg, are bolted to one flexible frame, so pushing one pump also moves the other. The stiffness matrix is K = ${mat([[a, -c], [-c, a]])} and the mass matrix is M = diag${vec([m, m])}. The vibration modes solve Kv = λMv, which needs det(K − λM) = 0. Enter the two generalized eigenvalues in ascending order.`,
  answer: [l1, l2],
  hints: [`Solve the pair together. In K − λM the mass ${n(m)} multiplies λ on both diagonal places, and the other two entries of K stay as they are.`, 'A 2×2 determinant is (top left)·(bottom right) − (top right)·(bottom left). Set it to zero and solve for λ. The eigenvalues of K alone are not the answer.'],
  solution: `K − λM = [[${d}, ${n(-c)}],[${n(-c)}, ${d}]]. Its determinant is (${d})² − ${n(c * c)}. A square equals ${n(c * c)} when the number squared is ${n(c)} or ${n(-c)}, so the determinant is zero when ${d} = ${n(c)} or ${d} = ${n(-c)}. That gives ${n(m)}λ = ${n(lo)} or ${n(m)}λ = ${n(hi)}. Dividing by the mass ${n(m)}: λ = ${n(l1)} and λ = ${n(l2)}.`,
  guidance: [
   { prompt: `K − λM has ${d} in both diagonal places and ${n(-c)} in the other two. Its determinant is (${d})² − ${n(c * c)}, which is zero when ${d} = ${n(c)} or ${d} = ${n(-c)}. Enter the two possible values of ${n(m)}λ, the smaller first.`, answer: [lo, hi], explanation: `${d} = ${n(c)} gives ${n(m)}λ = ${n(lo)}, and ${d} = ${n(-c)} gives ${n(m)}λ = ${n(hi)}. These two numbers are the eigenvalues of K alone, before the mass is counted.` },
   { prompt: `Now count the mass: divide ${n(lo)} and ${n(hi)} by ${n(m)}. Enter the two generalized eigenvalues in ascending order.`, answer: [l1, l2], explanation: `${n(lo)}/${n(m)} = ${n(l1)} and ${n(hi)}/${n(m)} = ${n(l2)}. The pair K and M is solved together, not K alone.` }
  ] }; }
});

})();
