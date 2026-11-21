/* Linear algebra practice missions, file 13 of 14: concepts q61–q65, three practice missions each
   (q61b q61c q61d ... q65b q65c q65d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p13.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- add missions for q61–q65 below this line ---- */

/* ---- helpers for this file ---- */
const T = G.tidy;
/* One term of a linear equation: co(4,'x',true) → "4x", co(−1,'y') → " − y", co(3,'y') → " + 3y". */
const co = (k, v, first) => { const m = Math.abs(k) === 1 ? '' : n(Math.abs(k)); return first ? (k < 0 ? '−' : '') + m + v : (k < 0 ? ' − ' : ' + ') + m + v; };
/* Fisher–Yates with the seeded source. */
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* num/den has at most one decimal place. */
const oneDec = (num, den) => (Math.abs(num) * 10) % den === 0;
/* "1 dollar", "3 dollars". */
const count = (k, word) => `${n(k)} ${word}${Math.abs(k) === 1 ? '' : 's'}`;
/* A product that does not print a factor 1: times(1,'x₁') → "x₁", times(3,'x₂') → "3×x₂". */
const times = (k, v) => k === 1 ? v : `${n(k)}×${v}`;
const list = items => items.length < 2 ? items.join('') : items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];

/* ---- q61 Block matrices and Schur complements (taught: eliminate x from a·x+b·y=f, c·x+d·y=g; S = d − c·b/a,
   reduced right side g − c·f/a, then y and x). ---- */
/* Setting: a café delivery. Asks for the reduced right side as well, which the parent only shows in its solution. */
practice({ id: 'q61b', parent: 'q61', kind: 'setting',
 title: 'Coffee, tea and one elimination',
 brief: 'A café delivery is known only by its total weight and the shelf space it fills, and the order sheet needs the two counts.',
 labels: ['S', 'reduced right side', 'y (boxes of tea)', 'x (bags of coffee)'], tolerance: 0.01 },
 [['S'], ['reduced right side'], ['y (boxes of tea)', 'x (bags of coffee)']], {
 canonical: { a: 4, b: 2, c: 3, d: 5, x: 3, y: 2 },
 /* a is 2, 4 or 5 and the draw keeps S and the reduced right side to one decimal place at most. a ≠ d, so eliminating the wrong unknown gives
    a different coefficient; x ≠ y, so the order of the last two boxes matters. Not the parent's worked example (2,1,1,2). */
 draw: R => { for (let i = 0; i < 500; i++) {
   const a = R.pick([2, 4, 5]), b = R.int(1, 4), c = R.int(1, 5), d = R.int(2, 6), x = R.int(1, 6), y = R.int(1, 6);
   if (a * d - b * c !== 0 && a !== d && x !== y && oneDec(c * b, a) && oneDec(c * (a * x + b * y), a) && !(a === 2 && b === 1 && c === 1)) return { a, b, c, d, x, y };
  } return { a: 4, b: 2, c: 3, d: 5, x: 3, y: 2 }; },
 build: ({ a, b, c, d, x, y }) => { const f = a * x + b * y, g = c * x + d * y, S = T(d - c * b / a), rhs = T(g - c * f / a); return {
  prompt: `A café restocks with x bags of coffee and y boxes of tea. A bag weighs ${n(a)} kg and a box weighs ${n(b)} kg, and the delivery weighs ${n(f)} kg in all: ${co(a, 'x', true)}${co(b, 'y')} = ${n(f)}. A bag fills ${count(c, 'shelf slot')} and a box fills ${n(d)}, and the delivery fills ${n(g)} slots: ${co(c, 'x', true)}${co(d, 'y')} = ${n(g)}. Eliminate x using the weight equation. Enter the Schur coefficient S (the number left in front of y), then the reduced right side, then y, then x.`,
  answer: [S, rhs, y, x],
  hints: [`Solve the weight equation for x: x = (${n(f)} − ${co(b, 'y', true)}) ÷ ${n(a)}. Put that in place of x in the shelf equation.`, 'S is what stays in front of y: the shelf number for tea, minus (shelf number for coffee) × (weight of a box) ÷ (weight of a bag). The right side loses (shelf number for coffee) × (total weight) ÷ (weight of a bag).'],
  solution: `From the weight equation, x = (${n(f)} − ${co(b, 'y', true)}) ÷ ${n(a)}. Put this into the shelf equation. In front of y: S = ${n(d)} − ${n(c)}×${n(b)}÷${n(a)} = ${n(S)}. On the right: ${n(g)} − ${n(c)}×${n(f)}÷${n(a)} = ${n(rhs)}. So ${co(S, 'y', true)} = ${n(rhs)} and y = ${n(y)}. Then x = (${n(f)} − ${n(b)}×${n(y)}) ÷ ${n(a)} = ${n(x)}.`,
  guidance: [
   { prompt: `Removing x takes ${n(c)}×${n(b)}÷${n(a)} away from the ${n(d)} in front of y. What is S = ${n(d)} − ${n(c)}×${n(b)}÷${n(a)}?`, answer: [S], explanation: `${n(c)}×${n(b)}÷${n(a)} = ${n(T(c * b / a))}, so S = ${n(d)} − ${n(T(c * b / a))} = ${n(S)}. This is the Schur coefficient: what is left of the tea column once coffee is eliminated.` },
   { prompt: `The right side changes the same way: it loses ${n(c)}×${n(f)}÷${n(a)}. What is ${n(g)} − ${n(c)}×${n(f)}÷${n(a)}?`, answer: [rhs], explanation: `${n(c)}×${n(f)}÷${n(a)} = ${n(T(c * f / a))}, so the reduced right side is ${n(g)} − ${n(T(c * f / a))} = ${n(rhs)}.` },
   { prompt: `Now ${co(S, 'y', true)} = ${n(rhs)}. Enter y, then x from x = (${n(f)} − ${co(b, 'y', true)}) ÷ ${n(a)}.`, answer: [y, x], explanation: `y = ${n(rhs)} ÷ ${par(S)} = ${n(y)}, and x = (${n(f)} − ${n(b)}×${n(y)}) ÷ ${n(a)} = ${n(x)}.` }
  ] }; }
});

/* Applied: a real block system. Two rooms (a diagonal block) are eliminated together, leaving one equation for the boiler.
   b_i = a_i·k_i, so every number stays whole. */
practice({ id: 'q61c', parent: 'q61', kind: 'applied',
 title: 'Two rooms, one boiler',
 brief: 'The heating model couples two rooms through one boiler, and the controller wants the boiler setting before the rooms.',
 labels: ['S', 'y', 'x1', 'x2'], tolerance: 0.01 },
 [['S'], ['reduced right side'], ['y', 'x1', 'x2']], {
 canonical: { a: [2, 3], k: [2, 1], c: [1, 2], d: 9, x: [3, 2], y: 2 },
 /* S is never 0, and x1 ≠ x2 so the order of the boxes matters. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const a = [R.int(2, 4), R.int(2, 4)], k = [R.int(1, 2), R.int(1, 2)], c = [R.int(1, 3), R.int(1, 3)], d = R.int(3, 12), x = [R.int(1, 5), R.int(1, 5)], y = R.int(1, 4);
   if (d - c[0] * k[0] - c[1] * k[1] !== 0 && x[0] !== x[1]) return { a, k, c, d, x, y };
  } return { a: [2, 3], k: [2, 1], c: [1, 2], d: 9, x: [3, 2], y: 2 }; },
 build: ({ a, k, c, d, x, y }) => {
  const b = [a[0] * k[0], a[1] * k[1]], f = [a[0] * x[0] + b[0] * y, a[1] * x[1] + b[1] * y], g = c[0] * x[0] + c[1] * x[1] + d * y;
  const S = d - c[0] * k[0] - c[1] * k[1], cut = [c[0] * f[0] / a[0], c[1] * f[1] / a[1]], rhs = g - cut[0] - cut[1];
  return {
  prompt: `A heating model has two rooms and one shared boiler. The unknowns are the room settings x₁ and x₂ and the boiler setting y. Room 1: ${co(a[0], 'x₁', true)}${co(b[0], 'y')} = ${n(f[0])}. Room 2: ${co(a[1], 'x₂', true)}${co(b[1], 'y')} = ${n(f[1])}. Boiler: ${co(c[0], 'x₁', true)}${co(c[1], 'x₂')}${co(d, 'y')} = ${n(g)}. Each room equation holds only its own x, so both rooms can be eliminated, each from its own row. Enter the Schur coefficient S left in front of y in the boiler equation, then y, then x₁, then x₂.`,
  answer: [S, y, x[0], x[1]],
  hints: [`Solve each room equation for its own x: x₁ = (${n(f[0])} − ${n(b[0])}y) ÷ ${n(a[0])} and x₂ = (${n(f[1])} − ${n(b[1])}y) ÷ ${n(a[1])}. Put both into the boiler equation.`, 'Each room takes its own piece away from the number in front of y: (its number in the boiler equation) × (its y number) ÷ (its x number). The right side loses a piece from each room in the same way.'],
  solution: `Room 1 gives x₁ = (${n(f[0])} − ${n(b[0])}y) ÷ ${n(a[0])} and room 2 gives x₂ = (${n(f[1])} − ${n(b[1])}y) ÷ ${n(a[1])}. Put both into the boiler equation. In front of y: S = ${n(d)} − ${n(c[0])}×${n(b[0])}÷${n(a[0])} − ${n(c[1])}×${n(b[1])}÷${n(a[1])} = ${n(d)} − ${n(c[0] * k[0])} − ${n(c[1] * k[1])} = ${n(S)}. On the right: ${n(g)} − ${n(c[0])}×${n(f[0])}÷${n(a[0])} − ${n(c[1])}×${n(f[1])}÷${n(a[1])} = ${n(g)} − ${n(cut[0])} − ${n(cut[1])} = ${n(rhs)}. So ${co(S, 'y', true)} = ${n(rhs)} and y = ${n(y)}. Then x₁ = (${n(f[0])} − ${n(b[0])}×${n(y)}) ÷ ${n(a[0])} = ${n(x[0])} and x₂ = (${n(f[1])} − ${n(b[1])}×${n(y)}) ÷ ${n(a[1])} = ${n(x[1])}.`,
  guidance: [
   { prompt: `Room 1 takes ${n(c[0])}×${n(b[0])}÷${n(a[0])} away from the ${n(d)} in front of y, and room 2 takes ${n(c[1])}×${n(b[1])}÷${n(a[1])}. What is S?`, answer: [S], explanation: `${n(c[0])}×${n(b[0])}÷${n(a[0])} = ${n(c[0] * k[0])} and ${n(c[1])}×${n(b[1])}÷${n(a[1])} = ${n(c[1] * k[1])}, so S = ${n(d)} − ${n(c[0] * k[0])} − ${n(c[1] * k[1])} = ${n(S)}.` },
   { prompt: `The right side loses ${n(c[0])}×${n(f[0])}÷${n(a[0])} for room 1 and ${n(c[1])}×${n(f[1])}÷${n(a[1])} for room 2. What is left of ${n(g)}?`, answer: [rhs], explanation: `${n(g)} − ${n(cut[0])} − ${n(cut[1])} = ${n(rhs)}. This is the reduced right side.` },
   { prompt: `Now ${co(S, 'y', true)} = ${n(rhs)}. Enter y, then x₁ = (${n(f[0])} − ${n(b[0])}y) ÷ ${n(a[0])}, then x₂ = (${n(f[1])} − ${n(b[1])}y) ÷ ${n(a[1])}.`, answer: [y, x[0], x[1]], explanation: `y = ${n(rhs)} ÷ ${par(S)} = ${n(y)}. Then x₁ = (${n(f[0])} − ${n(b[0] * y)}) ÷ ${n(a[0])} = ${n(x[0])} and x₂ = (${n(f[1])} − ${n(b[1] * y)}) ÷ ${n(a[1])} = ${n(x[1])}.` }
  ] }; }
});

/* Challenge with q09 (determinants): two circuit loops with a shared resistor, so both coupling numbers are negative;
   the determinant of the 2×2 matrix equals a × S. */
practice({ id: 'q61d', parent: 'q61', kind: 'challenge', uses: 'q09',
 title: 'Two loops, one shared resistor',
 brief: 'Two loops of a power circuit share a resistor, and the engineer wants the loop currents and a check on the matrix.',
 labels: ['S', 'determinant', 'y', 'x'], tolerance: 0.01 },
 [['S'], ['determinant'], ['reduced right side'], ['y', 'x']], {
 canonical: { a: 4, r: 2, d: 5, x: 3, y: 2 },
 /* r < a and r < d (the shared resistor is part of each loop), so the determinant is positive. Voltages are positive.
    S and the reduced right side have one decimal place at most. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const a = R.pick([2, 4, 4, 5, 5]), r = R.int(1, a - 1), d = R.int(r + 1, 8), x = R.int(1, 5), y = R.int(1, 5);
   if (x !== y && a !== d && oneDec(r * r, a) && oneDec(r * (a * x - r * y), a) && a * x - r * y > 0 && d * y - r * x > 0) return { a, r, d, x, y };
  } return { a: 4, r: 2, d: 5, x: 3, y: 2 }; },
 build: ({ a, r, d, x, y }) => { const f = a * x - r * y, g = d * y - r * x, S = T(d - r * r / a), det = a * d - r * r, rhs = T(g + r * f / a); return {
  prompt: `Two loops of a circuit share one resistor. With loop currents x and y in amps, the loop equations are ${co(a, 'x', true)}${co(-r, 'y')} = ${n(f)} and ${co(-r, 'x', true)}${co(d, 'y')} = ${n(g)} (the right sides are the battery voltages). Eliminate x. Enter the Schur coefficient S, then the determinant of the matrix ${mat([[a, -r], [-r, d]])}, then y, then x.`,
  answer: [S, det, y, x],
  hints: ['Both coupling numbers are negative, and two minus signs multiply to a plus. Take care with that product when you form S and the determinant.', 'A check: the determinant of the 2×2 matrix equals its top-left entry × S.'],
  solution: `From the first loop, x = (${n(f)} + ${co(r, 'y', true)}) ÷ ${n(a)}. S = ${n(d)} − (${n(-r)})×(${n(-r)})÷${n(a)} = ${n(d)} − ${n(T(r * r / a))} = ${n(S)}. The determinant is ${n(a)}×${n(d)} − (${n(-r)})×(${n(-r)}) = ${n(a * d)} − ${n(r * r)} = ${n(det)}, which is ${n(a)} × S. The reduced right side is ${n(g)} − (${n(-r)})×${n(f)}÷${n(a)} = ${n(g)} + ${n(T(r * f / a))} = ${n(rhs)}. So y = ${n(rhs)} ÷ ${n(S)} = ${n(y)} and x = (${n(f)} + ${n(r)}×${n(y)}) ÷ ${n(a)} = ${n(x)}.`,
  guidance: [
   { prompt: `The two coupling numbers are both ${n(-r)}. What is S = ${n(d)} − (${n(-r)})×(${n(-r)})÷${n(a)}?`, answer: [S], explanation: `(${n(-r)})×(${n(-r)}) = ${n(r * r)}, and ${n(r * r)}÷${n(a)} = ${n(T(r * r / a))}. So S = ${n(d)} − ${n(T(r * r / a))} = ${n(S)}.` },
   { prompt: `For a 2×2 matrix the determinant is (top left × bottom right) − (top right × bottom left). What is it for ${mat([[a, -r], [-r, d]])}?`, answer: [det], explanation: `${n(a)}×${n(d)} − (${n(-r)})×(${n(-r)}) = ${n(a * d)} − ${n(r * r)} = ${n(det)}. It equals ${n(a)} × ${n(S)}: the first pivot times the Schur coefficient.` },
   { prompt: `The right side becomes ${n(g)} − (${n(-r)})×${n(f)}÷${n(a)}. What is this reduced right side?`, answer: [rhs], explanation: `(${n(-r)})×${n(f)}÷${n(a)} = ${n(T(-r * f / a))}, and subtracting a negative adds: ${n(g)} + ${n(T(r * f / a))} = ${n(rhs)}.` },
   { prompt: `Now ${co(S, 'y', true)} = ${n(rhs)}. Enter y, then x from x = (${n(f)} + ${co(r, 'y', true)}) ÷ ${n(a)}.`, answer: [y, x], explanation: `y = ${n(rhs)} ÷ ${n(S)} = ${count(y, 'amp')}, and x = (${n(f)} + ${n(r * y)}) ÷ ${n(a)} = ${count(x, 'amp')}.` }
  ] }; }
});

/* ---- q62 Permutation and orthogonal matrices (taught: a permutation matrix reorders entries; PᵀP = I; orthogonal
   matrices keep lengths and dot products; reflections count too, and the determinant sign tells them apart). ---- */
const CYCLES = { 1: { P: [[0, 0, 1], [1, 0, 0], [0, 1, 0]], src: [2, 0, 1] }, 2: { P: [[0, 1, 0], [0, 0, 1], [1, 0, 0]], src: [1, 2, 0] } };
const ORDW = ['first', 'second', 'third'];
/* Setting: colour channels of a pixel. The parent swaps two entries in words; here P is a written-out matrix that
   moves all three entries round, and the player multiplies. */
practice({ id: 'q62b', parent: 'q62', kind: 'setting',
 title: 'Reordering a pixel',
 brief: 'A file converter stores colour channels in another order, and the image team must know what it does to a pixel.',
 labels: ['new entry 1', 'new entry 2', 'new entry 3', 'squared norm'], tolerance: 0.01 },
 [['new entry 1'], ['new entry 2', 'new entry 3'], ['squared norm']], {
 canonical: { v: [7, 2, 5], k: 1 },
 /* Three different brightness values, so every wrong order gives a wrong answer. */
 draw: R => ({ v: shuffle(R, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), k: R.pick([1, 2]) }),
 build: ({ v, k }) => { const { P, src } = CYCLES[k], w = src.map(j => v[j]), sq = v.reduce((s, t) => s + t * t, 0);
  const row = i => `${n(P[i][0])}×${n(v[0])} + ${n(P[i][1])}×${n(v[1])} + ${n(P[i][2])}×${n(v[2])}`; return {
  prompt: `A pixel stores three brightness values as the vector (red, green, blue) = ${vec(v)}. A file converter multiplies this vector by the permutation matrix P=${mat(P)}, which only moves the entries to new places. Enter the three entries of the new vector, top to bottom, then its squared norm (the sum of the squares of its entries).`,
  answer: [...w, sq],
  hints: ['Each row of P holds a single 1. The column that 1 sits in tells you which old entry that row picks.', 'Moving entries around does not change the squares being added, so the squared norm can be worked out from either vector.'],
  solution: `Row 1 of P picks the ${ORDW[src[0]]} entry, row 2 the ${ORDW[src[1]]} and row 3 the ${ORDW[src[2]]}: the new vector is ${vec(w)}. Its squared norm is ${w.map(t => n(t * t)).join(' + ')} = ${n(sq)}, the same as for ${vec(v)}, because a permutation matrix is orthogonal.`,
  guidance: [
   { prompt: `Row 1 of P is ${vec(P[0])}. Multiply it into ${vec(v)}: ${row(0)}. What is the first new entry?`, answer: [w[0]], explanation: `Only the 1 counts, and it sits in column ${n(src[0] + 1)}, so the first new entry is the ${ORDW[src[0]]} old entry, ${n(w[0])}.` },
   { prompt: `Rows 2 and 3 of P are ${vec(P[1])} and ${vec(P[2])}. Enter the second and third new entries.`, answer: [w[1], w[2]], explanation: `Row 2 picks the ${ORDW[src[1]]} old entry, ${n(w[1])}. Row 3 picks the ${ORDW[src[2]]} old entry, ${n(w[2])}. The new vector is ${vec(w)}.` },
   { prompt: `Square each entry of ${vec(w)} and add. What is the squared norm?`, answer: [sq], explanation: `${w.map(t => n(t * t)).join(' + ')} = ${n(sq)}. The old vector gives the same total, because the same three squares are added in another order.` }
  ] }; }
});

const STORED = { 1: ['up', 'east', 'north'], 2: ['north', 'up', 'east'] };
/* Applied: undo a permutation with Pᵀ, then use the fact that dot products survive it. */
practice({ id: 'q62c', parent: 'q62', kind: 'applied',
 title: 'Unscrambling the rover log',
 brief: 'The rover logger stores each move with its entries in the wrong order, and the navigator needs the real moves back.',
 labels: ['east', 'north', 'up', 'dot product'], tolerance: 0.01 },
 [['east'], ['north', 'up'], ['dot product']], {
 canonical: { y: [2, 5, -3], w: [1, -4, 6], k: 1 },
 /* The first stored move has three different entries, so applying P again instead of Pᵀ gives a wrong answer. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const y = [R.nz(-6, 6), R.nz(-6, 6), R.nz(-6, 6)], w = [R.nz(-6, 6), R.nz(-6, 6), R.nz(-6, 6)];
   if (new Set(y).size === 3 && y.some(t => t < 0)) return { y, w, k: R.pick([1, 2]) };
  } return { y: [2, 5, -3], w: [1, -4, 6], k: 2 }; },
 build: ({ y, w, k }) => { const order = STORED[k], at = name => order.indexOf(name), orig = v => ['east', 'north', 'up'].map(name => v[at(name)]);
  const x = orig(y), u = orig(w), dot = y.reduce((s, t, i) => s + t * w[i], 0), prod = (p, q) => p.map((t, i) => `${par(t)}×${par(q[i])}`).join(' + '); return {
  prompt: `A rover measures each move as (east, north, up) in metres. Its logger multiplies the move by a permutation matrix P and stores it in the order (${order.join(', ')}). Two stored moves are ${vec(y)} and ${vec(w)}. Undo the reordering of the first stored move with Pᵀ: enter its east, north and up values. Then enter the dot product of the two original moves.`,
  answer: [...x, dot],
  hints: [`Pᵀ sends every entry back to where it came from. Read the stored order label by label: the place of the word east in that list is the place of the east value in a stored move.`, 'P is orthogonal, so it keeps dot products. The dot product of the two stored moves is the dot product of the two original moves.'],
  solution: `The stored order is (${order.join(', ')}). In ${vec(y)} the east value is the ${ORDW[at('east')]} entry, ${n(x[0])}; north is the ${ORDW[at('north')]} entry, ${n(x[1])}; up is the ${ORDW[at('up')]} entry, ${n(x[2])}. The original move is ${vec(x)}. Dot products are kept by P, so use the stored moves: ${prod(y, w)} = ${n(dot)}. Check with the originals ${vec(x)} and ${vec(u)}: ${prod(x, u)} = ${n(dot)}.`,
  guidance: [
   { prompt: `The stored order is (${order.join(', ')}). In the stored move ${vec(y)}, which number is the east value?`, answer: [x[0]], explanation: `East is the ${ORDW[at('east')]} label in the stored order, so the east value is the ${ORDW[at('east')]} stored entry, ${n(x[0])}.` },
   { prompt: `In the same stored move ${vec(y)}, enter the north value, then the up value.`, answer: [x[1], x[2]], explanation: `North is the ${ORDW[at('north')]} stored entry, ${n(x[1])}, and up is the ${ORDW[at('up')]}, ${n(x[2])}. The original move is ${vec(x)}. This is what Pᵀ does.` },
   { prompt: `P keeps dot products, so the stored moves will do. Work out ${prod(y, w)}.`, answer: [dot], explanation: `${y.map((t, i) => n(t * w[i])).map((t, i) => i ? (t[0] === '−' ? ' − ' + t.slice(1) : ' + ' + t) : t).join('')} = ${n(dot)}. The two original moves have the same dot product, because the same three products are added in another order.` }
  ] }; }
});

/* Challenge with q09 (determinants): an orthogonal matrix built on the 3-4-5 triangle. The determinant, 1 or −1,
   tells a rotation from a mirror flip (the parent's two pitfalls). */
practice({ id: 'q62d', parent: 'q62', kind: 'challenge', uses: 'q09',
 title: 'Turned or mirrored sprite',
 brief: 'A game engine moves a sprite with an orthogonal matrix, and the artist asks whether the sprite was turned or flipped.',
 labels: ['new x', 'new y', 'squared norm', 'determinant'], tolerance: 0.01 },
 [['new x'], ['new y'], ['squared norm'], ['determinant']], {
 canonical: { c: 3, s: 4, refl: false, p: 2, q: 1 },
 /* The corner is (5p, 5q) so the new corner is whole. A corner the matrix leaves in place is not drawn. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const c = R.pick([3, 4]), s = (c === 3 ? 4 : 3) * R.pick([1, -1]), refl = R.bool(), p = R.nz(-3, 3), q = R.nz(-3, 3);
   const nx = refl ? c * p + s * q : c * p - s * q, ny = refl ? s * p - c * q : s * p + c * q;
   if (!(nx === 5 * p && ny === 5 * q) && !(c === 3 && s === 4 && !refl && p === 2 && q === 1)) return { c, s, refl, p, q };
  } return { c: 4, s: 3, refl: true, p: 1, q: 2 }; },
 build: ({ c, s, refl, p, q }) => { const M = refl ? [[c, s], [s, -c]] : [[c, -s], [s, c]], X = 5 * p, Y = 5 * q;
  const nx = (M[0][0] * X + M[0][1] * Y) / 5, ny = (M[1][0] * X + M[1][1] * Y) / 5, sq = X * X + Y * Y, det = refl ? -1 : 1;
  const ad = M[0][0] * M[1][1], bc = M[0][1] * M[1][0], rowx = i => `(${par(M[i][0])}×${par(X)} + ${par(M[i][1])}×${par(Y)}) ÷ 5`; return {
  prompt: `A game engine moves a corner of a sprite with the matrix Q = (1/5)·${mat(M)}: every entry of ${mat(M)} is divided by 5. The corner is at ${vec([X, Y])}. Enter the new corner, x then y. Then enter its squared norm, and the determinant of Q (1 means the sprite was turned, −1 means it was mirrored).`,
  answer: [nx, ny, sq, det],
  hints: [`Multiply by ${mat(M)} first and divide by 5 at the end: that keeps every step in whole numbers.`, 'Q is orthogonal, so the squared norm of the new corner must equal that of the old corner: a check on your first two answers. For the determinant, divide every entry by 5 before you use ad − bc.'],
  solution: `New x: ${rowx(0)} = ${n(M[0][0] * X + M[0][1] * Y)} ÷ 5 = ${n(nx)}. New y: ${rowx(1)} = ${n(M[1][0] * X + M[1][1] * Y)} ÷ 5 = ${n(ny)}. Squared norm: ${par(nx)}² + ${par(ny)}² = ${n(nx * nx)} + ${n(ny * ny)} = ${n(sq)}, the same as ${par(X)}² + ${par(Y)}² for the old corner, because Q is orthogonal. Determinant: the entries of Q are ${n(M[0][0])}/5, ${n(M[0][1])}/5, ${n(M[1][0])}/5 and ${n(M[1][1])}/5, so ad − bc = ${n(ad)}/25 − ${par(bc)}/25 = ${n(det)}. The sprite was ${refl ? 'mirrored' : 'turned'}.`,
  guidance: [
   { prompt: `Row 1 of Q gives the new x. Work out ${rowx(0)}.`, answer: [nx], explanation: `${par(M[0][0])}×${par(X)} = ${n(M[0][0] * X)} and ${par(M[0][1])}×${par(Y)} = ${n(M[0][1] * Y)}. Their sum is ${n(M[0][0] * X + M[0][1] * Y)}, and dividing by 5 gives ${n(nx)}.` },
   { prompt: `Row 2 of Q gives the new y. Work out ${rowx(1)}.`, answer: [ny], explanation: `${par(M[1][0])}×${par(X)} = ${n(M[1][0] * X)} and ${par(M[1][1])}×${par(Y)} = ${n(M[1][1] * Y)}. Their sum is ${n(M[1][0] * X + M[1][1] * Y)}, and dividing by 5 gives ${n(ny)}.` },
   { prompt: `Square the entries of the new corner ${vec([nx, ny])} and add. What is its squared norm?`, answer: [sq], explanation: `${n(nx * nx)} + ${n(ny * ny)} = ${n(sq)}. The old corner gives ${n(X * X)} + ${n(Y * Y)} = ${n(sq)} too: an orthogonal matrix keeps lengths.` },
   { prompt: `The entries of Q are a = ${n(M[0][0])}/5, b = ${n(M[0][1])}/5, c = ${n(M[1][0])}/5 and d = ${n(M[1][1])}/5. What is the determinant ad − bc?`, answer: [det], explanation: `ad = ${n(ad)}/25 and bc = ${n(bc)}/25, so ad − bc = ${n(ad - bc)}/25 = ${n(det)}. ${refl ? 'A determinant of −1 means a mirror flip. It is still orthogonal: lengths are kept.' : 'A determinant of 1 means a rotation, with no flip.'}` }
  ] }; }
});

/* ---- q63 Sparse matrices and storage (taught: store only the nonzero entries; the 2, −1 stencil; multiply using
   the pattern; count the nonzeros; zeros still fix the shape). ---- */
/* Setting: a table of plays stored as (row, column, value) triples. A listener with no plays has a row of zeros. */
practice({ id: 'q63b', parent: 'q63', kind: 'setting',
 title: 'A playlist table stored as triples',
 brief: 'A music app keeps a table that is mostly zeros, and the weekly report needs the minutes each listener spent.',
 labels: ['listener 1 minutes', 'listener 2 minutes', 'listener 3 minutes', 'listener 4 minutes', 'zeros not stored'], tolerance: 0.01 },
 [['listener 1 minutes'], ['listener 2 minutes', 'listener 3 minutes', 'listener 4 minutes'], ['zeros not stored']], {
 canonical: { e: [[1, 1, 3], [1, 4, 2], [2, 2, 5], [4, 1, 1], [4, 3, 3]], x: [3, 4, 2, 5] },
 /* 5 to 7 triples; listener 1 always has at least one; in some draws another listener has none (a row of zeros). */
 draw: R => { const counts = R.pick([[2, 2, 1, 1], [2, 1, 2, 1], [1, 2, 2, 1], [2, 2, 2, 1], [2, 0, 2, 2], [2, 2, 0, 1], [1, 2, 1, 2], [2, 1, 0, 2], [2, 2, 1, 0], [1, 1, 2, 2]]), e = [];
  counts.forEach((k, i) => shuffle(R, [1, 2, 3, 4]).slice(0, k).sort((p, q) => p - q).forEach(col => e.push([i + 1, col, R.int(1, 5)])));
  return { e, x: [R.int(2, 6), R.int(2, 6), R.int(2, 6), R.int(2, 6)] }; },
 build: ({ e, x }) => { const rows = [1, 2, 3, 4].map(i => e.filter(t => t[0] === i)), y = rows.map(r => r.reduce((s, t) => s + t[2] * x[t[1] - 1], 0)), zeros = 16 - e.length;
  const tri = t => `(${t.join(',')})`, sum = r => r.map(t => `${n(t[2])}×${n(x[t[1] - 1])}`).join(' + ');
  const line = i => rows[i].length ? `Listener ${i + 1}: ${sum(rows[i])} = ${n(y[i])}.` : `Listener ${i + 1} has no triple, so that row of A is all zeros and the total is 0.`; return {
  prompt: `A music app keeps a 4×4 table A: one row for each listener, one column for each song, and each entry is a number of plays. Most entries are 0, so the app stores only the nonzero ones, as (row, column, plays): ${e.map(tri).join(', ')}. The four songs last x=${vec(x, ',')} minutes. Enter Ax, the minutes each listener spent, listener 1 to listener 4. Then enter how many zero entries the app did not have to store.`,
  answer: [...y, zeros],
  hints: ['Take the triples one at a time. A triple (row, column, plays) adds plays × the length of the song in that column to the total of that row.', 'A row with no triple is a row of zeros. A 4×4 table has 16 entries in all, whatever is stored.'],
  solution: `${[0, 1, 2, 3].map(line).join(' ')} So Ax=${vec(y, ',')}. The table has 4×4 = 16 entries and ${n(e.length)} are stored, so 16 − ${n(e.length)} = ${n(zeros)} zeros were not stored.`,
  guidance: [
   { prompt: `Listener 1 has the ${rows[0].length > 1 ? 'triples' : 'triple'} ${list(rows[0].map(tri))}. Multiply each number of plays by the length of its song and add: ${sum(rows[0])}.`, answer: [y[0]], explanation: `${sum(rows[0])} = ${n(y[0])} minutes. Only the stored entries of row 1 are used; the zeros add nothing.` },
   { prompt: 'Do the same for listeners 2, 3 and 4, using only the triples whose first number is that row. Enter their three totals.', answer: [y[1], y[2], y[3]], explanation: [1, 2, 3].map(line).join(' ') },
   { prompt: `The table is 4×4 and the app stores ${n(e.length)} triples. How many zero entries are not stored?`, answer: [zeros], explanation: `4×4 = 16 entries in all, and 16 − ${n(e.length)} = ${n(zeros)}. The zeros still belong to the table and fix its shape; they just take no storage.` }
  ] }; }
});

/* Applied: the same 2, −1 pattern on a long line, where the saving shows; one inner entry of Ax from three readings. */
practice({ id: 'q63c', parent: 'q63', kind: 'applied',
 title: 'A long line of probes',
 brief: 'The pipeline has far more probes than the test rig, and the engineer wants to know what storing only the pattern saves.',
 labels: ['nonzero entries', 'entries in the full table', 'entry of Ax'], tolerance: 0.01 },
 [['nonzero entries'], ['entries in the full table'], ['entry of Ax']], {
 canonical: { N: 10, k: 4, t: [18, 21, 20] },
 /* Probe k is never an end probe, so its row has both neighbours. The three readings are not all equal. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const N = R.pick([6, 7, 8, 9, 10, 11, 12, 20, 25, 30, 40, 50]), k = R.int(2, Math.min(N - 1, 9)), t = [R.int(8, 30), R.int(8, 30), R.int(8, 30)];
   if (new Set(t).size > 1) return { N, k, t };
  } return { N: 10, k: 4, t: [18, 21, 20] }; },
 build: ({ N, k, t }) => { const nz = 3 * N - 2, full = N * N, y = 2 * t[1] - t[0] - t[2]; return {
  prompt: `A pipeline has ${n(N)} temperature probes in a line. Its heat matrix A is ${n(N)}×${n(N)}: every diagonal entry is 2, the entries just left and just right of the diagonal are −1, and all the others are 0. Enter how many entries of A are nonzero, then how many entries a full ${n(N)}×${n(N)} table holds. The vector x holds the ${n(N)} probe readings, in order. Probes ${n(k - 1)}, ${n(k)} and ${n(k + 1)} read ${n(t[0])}, ${n(t[1])} and ${n(t[2])} degrees: enter entry ${n(k)} of Ax.`,
  answer: [nz, full, y],
  hints: ['Count the diagonal first, then the line of −1 entries above it and the line below it. Each of those two lines is one entry shorter than the diagonal.', `Row ${n(k)} of A has only three nonzero entries: −1, 2 and −1, in columns ${n(k - 1)}, ${n(k)} and ${n(k + 1)}. No other reading is needed.`],
  solution: `The diagonal has ${n(N)} entries, and the lines above and below it have ${n(N - 1)} each: ${n(N)} + ${n(N - 1)} + ${n(N - 1)} = ${n(nz)} nonzero entries. A full table holds ${n(N)}×${n(N)} = ${n(full)} entries. Row ${n(k)} of A gives −${n(t[0])} + 2×${n(t[1])} − ${n(t[2])} = ${n(y)}.`,
  guidance: [
   { prompt: `The diagonal of A has ${n(N)} entries. The line of −1 entries just above it has ${n(N - 1)}, and so has the line just below. How many nonzero entries is that in all?`, answer: [nz], explanation: `${n(N)} + ${n(N - 1)} + ${n(N - 1)} = ${n(nz)}. The first and last rows have only one neighbour each, which is why it is not 3×${n(N)}.` },
   { prompt: `How many entries does a full table with ${n(N)} rows and ${n(N)} columns hold?`, answer: [full], explanation: `${n(N)}×${n(N)} = ${n(full)}. Storing only the pattern keeps ${n(nz)} numbers in place of ${n(full)}.` },
   { prompt: `Row ${n(k)} of A is −1, 2, −1 on probes ${n(k - 1)}, ${n(k)} and ${n(k + 1)}, which read ${n(t[0])}, ${n(t[1])} and ${n(t[2])}. Work out −${n(t[0])} + 2×${n(t[1])} − ${n(t[2])}.`, answer: [y], explanation: `−${n(t[0])} + ${n(2 * t[1])} − ${n(t[2])} = ${n(y)}. Every other entry of that row is 0, so the other ${n(N - 3)} readings do not matter.` }
  ] }; }
});

const TOWN = 'ABCDE';
/* Challenge with q39 (graph Laplacians): L = D − A of a five-town road map is sparse; multiply town by town and
   count the nonzeros from the list of roads. */
practice({ id: 'q63d', parent: 'q63', kind: 'challenge', uses: 'q39',
 title: 'Road map Laplacian',
 brief: 'A water board models five towns joined by a few roads, and the planner needs the Laplacian of the map applied to the levels.',
 labels: ['town A', 'town B', 'town C', 'town D', 'town E', 'nonzeros'], tolerance: 0.01 },
 [['town A'], ['town B', 'town C'], ['town D', 'town E'], ['nonzeros']], {
 canonical: { extra: [[0, 3]], x: [3, 1, 4, 0, 2] },
 /* The roads A–B, B–C, C–D, D–E are always there; one or two more are added. The levels are not all equal
    (equal levels would give Lx = 0 everywhere). */
 draw: R => { for (let i = 0; i < 500; i++) {
   const extra = shuffle(R, [[0, 2], [0, 3], [0, 4], [1, 3], [1, 4], [2, 4]]).slice(0, R.pick([1, 2])).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
   const x = [R.int(0, 6), R.int(0, 6), R.int(0, 6), R.int(0, 6), R.int(0, 6)];
   if (new Set(x).size >= 3) return { extra, x };
  } return { extra: [[1, 3]], x: [2, 5, 1, 3, 0] }; },
 build: ({ extra, x }) => { const edges = [[0, 1], [1, 2], [2, 3], [3, 4], ...extra], m = edges.length;
  const nb = [0, 1, 2, 3, 4].map(i => edges.filter(e => e.includes(i)).map(e => e[0] === i ? e[1] : e[0]).sort((p, q) => p - q));
  const y = nb.map((js, i) => js.length * x[i] - js.reduce((s, j) => s + x[j], 0)), nz = 5 + 2 * m;
  const road = e => `${TOWN[e[0]]}–${TOWN[e[1]]}`, expr = i => `${n(nb[i].length)}×${n(x[i])}${nb[i].map(j => ' − ' + n(x[j])).join('')}`;
  const line = i => `Town ${TOWN[i]} has ${nb[i].length > 1 ? 'roads' : 'a road'} to ${list(nb[i].map(j => TOWN[j]))}: ${expr(i)} = ${n(y[i])}.`; return {
  prompt: `Five towns, A to E, are joined by these roads: ${list(edges.map(road))}. The Laplacian L of the road map is a sparse 5×5 matrix: the diagonal entry for a town is the number of roads at that town, the entry for two towns joined by a road is −1, and every other entry is 0. The water levels at the towns are x=${vec(x, ',')}, in the order A to E. Enter Lx, town A to town E, then the number of nonzero entries of L.`,
  answer: [...y, nz],
  hints: ['For one town: (number of roads at the town) × (its own level), minus the level of each town a road leads to. A town with no road to it does not appear.', 'For the count: one diagonal entry for each town, and each road puts a −1 in two places, once in each of its two rows.'],
  solution: `${[0, 1, 2, 3, 4].map(line).join(' ')} So Lx=${vec(y, ',')}; the entries add to 0, as they always do for a Laplacian. Nonzero entries: 5 on the diagonal and 2 for each of the ${n(m)} roads, 5 + 2×${n(m)} = ${n(nz)}, out of 25.`,
  guidance: [
   { prompt: `Town A has ${nb[0].length > 1 ? 'roads' : 'a road'} to ${list(nb[0].map(j => TOWN[j]))}. Its row of L gives ${expr(0)}. What is the entry of Lx for town A?`, answer: [y[0]], explanation: `${expr(0)} = ${n(y[0])}. The row has a ${n(nb[0].length)} on the diagonal and a −1 for each road, and zeros elsewhere.` },
   { prompt: 'Do the same for town B, then town C: (roads at the town) × (its level), minus the level at the end of each road.', answer: [y[1], y[2]], explanation: `${line(1)} ${line(2)}` },
   { prompt: 'Now town D, then town E.', answer: [y[3], y[4]], explanation: `${line(3)} ${line(4)} All five entries add to 0, a check on the work.` },
   { prompt: `L has one diagonal entry for each of the 5 towns, and each of the ${n(m)} roads adds two entries of −1. How many nonzero entries does L have?`, answer: [nz], explanation: `5 + 2×${n(m)} = ${n(nz)}. A full 5×5 table has 25 entries, so ${n(25 - nz)} of them are zeros that need no storage.` }
  ] }; }
});

/* ---- q64 Ridge regularization (taught: (AᵀA+λI)x = Aᵀb; for A = diag(a), x_i = a_i·b_i ÷ (a_i² + λ); the penalty
   changes the answer on purpose). ---- */
/* Setting: a two-channel recorder. Asks for the exact solve as well, so the shrinking shows. */
practice({ id: 'q64b', parent: 'q64', kind: 'setting',
 title: 'Two-channel recorder',
 brief: 'A field recorder has two channels with different gains, and the sound team wants a steadier estimate than the exact one.',
 labels: ['exact x1', 'exact x2', 'ridge x1', 'ridge x2'], tolerance: 0.01 },
 [['exact x1', 'exact x2'], ['diagonal 1', 'diagonal 2'], ['ridge x1', 'ridge x2']], {
 canonical: { a: [2, 1], t: [5, 6], lam: 1 },
 /* b_i = a_i·t_i, so the exact solve is whole; the ridge values have at most one decimal. The two gains differ.
    Not the parent's worked example (A = I) or its canonical numbers. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const a = [R.int(1, 4), R.int(1, 4)], t = [R.int(2, 12), R.int(2, 12)], lam = R.int(1, 6);
   if (a[0] !== a[1] && t[0] !== t[1] && a.every((g, j) => oneDec(g * g * t[j], g * g + lam)) && !(a[0] === 1 && a[1] === 2 && lam === 1)) return { a, t, lam };
  } return { a: [2, 1], t: [5, 6], lam: 1 }; },
 build: ({ a, t, lam }) => { const b = a.map((g, i) => g * t[i]), den = a.map(g => g * g + lam), num = a.map((g, i) => g * b[i]), x = num.map((v, i) => T(v / den[i])); return {
  prompt: `A recorder has two channels. Channel 1 multiplies the true sound level by ${n(a[0])} and channel 2 multiplies it by ${n(a[1])}, so A=diag${vec(a, ',')}. The readings are b=${vec(b, ',')}. First solve Ax=b exactly: enter x₁, then x₂. Then use ridge with λ=${n(lam)}, which solves (AᵀA+λI)x=Aᵀb: enter the ridge x₁, then the ridge x₂.`,
  answer: [t[0], t[1], x[0], x[1]],
  hints: ['For the exact solve, divide each reading by the gain of its channel.', 'For ridge, A is diagonal, so AᵀA squares each gain. Add λ to each square. Aᵀb multiplies each reading by its gain. Then divide entry by entry.'],
  solution: `Exact: x₁ = ${n(b[0])} ÷ ${n(a[0])} = ${n(t[0])} and x₂ = ${n(b[1])} ÷ ${n(a[1])} = ${n(t[1])}. Ridge: AᵀA+λI = diag(${n(a[0] * a[0])} + ${n(lam)}, ${n(a[1] * a[1])} + ${n(lam)}) = diag${vec(den, ', ')} and Aᵀb = (${n(a[0])}×${n(b[0])}, ${n(a[1])}×${n(b[1])}) = ${vec(num)}. So ridge x₁ = ${n(num[0])} ÷ ${n(den[0])} = ${n(x[0])} and ridge x₂ = ${n(num[1])} ÷ ${n(den[1])} = ${n(x[1])}. Both are smaller than the exact values: the penalty pulls the answer toward 0 on purpose.`,
  guidance: [
   { prompt: `Solve Ax=b exactly: ${times(a[0], 'x₁')} = ${n(b[0])} and ${times(a[1], 'x₂')} = ${n(b[1])}. Enter x₁, then x₂.`, answer: [t[0], t[1]], explanation: `${n(b[0])} ÷ ${n(a[0])} = ${n(t[0])} and ${n(b[1])} ÷ ${n(a[1])} = ${n(t[1])}. This fits the readings exactly, noise and all.` },
   { prompt: `AᵀA squares each gain: diag(${n(a[0] * a[0])}, ${n(a[1] * a[1])}). Add λ=${n(lam)} to each. Enter the two diagonal entries of AᵀA+λI.`, answer: [den[0], den[1]], explanation: `${n(a[0] * a[0])} + ${n(lam)} = ${n(den[0])} and ${n(a[1] * a[1])} + ${n(lam)} = ${n(den[1])}.` },
   { prompt: `Aᵀb = (${n(a[0])}×${n(b[0])}, ${n(a[1])}×${n(b[1])}) = ${vec(num)}. Divide each entry by the matching diagonal entry, ${n(den[0])} and ${n(den[1])}. Enter the ridge x₁, then the ridge x₂.`, answer: [x[0], x[1]], explanation: `${n(num[0])} ÷ ${n(den[0])} = ${n(x[0])} and ${n(num[1])} ÷ ${n(den[1])} = ${n(x[1])}. Each is smaller than the exact value, and the channel with the smaller gain shrinks more in proportion.` }
  ] }; }
});

/* Applied: A is one column (three rides), so AᵀA and Aᵀb are single numbers and ridge is one division. */
practice({ id: 'q64c', parent: 'q64', kind: 'applied',
 title: 'Taxi fare from three rides',
 brief: 'A visitor has three taxi receipts that do not quite agree, and wants one cautious price for each kilometre.',
 labels: ['AᵀA', 'Aᵀb', 'ridge x'], tolerance: 0.01 },
 [['AᵀA'], ['Aᵀb'], ['ridge x']], {
 canonical: { a: [1, 2, 3], b: [2, 5, 8], lam: 6 },
 /* Three different distances; fares near a whole price for each km, off by at most 1 dollar; x has at most one decimal. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const a = shuffle(R, [1, 2, 3, 4, 5]).slice(0, 3).sort((p, q) => p - q), price = R.int(2, 4), b = a.map(d => d * price + R.int(-1, 1)), lam = R.int(1, 6);
   const D = a.reduce((s, d) => s + d * d, 0) + lam, Nn = a.reduce((s, d, j) => s + d * b[j], 0);
   if (oneDec(Nn, D)) return { a, b, lam };
  } return { a: [1, 2, 3], b: [2, 5, 8], lam: 6 }; },
 build: ({ a, b, lam }) => { const AA = a.reduce((s, d) => s + d * d, 0), Ab = a.reduce((s, d, j) => s + d * b[j], 0), x = T(Ab / (AA + lam)); return {
  prompt: `A visitor wants the taxi fare for each kilometre from three rides: ${n(a[0])} km cost ${count(b[0], 'dollar')}, ${n(a[1])} km cost ${count(b[1], 'dollar')} and ${n(a[2])} km cost ${count(b[2], 'dollar')}. The model is fare = distance × x, so A is the single column ${vec(a, ',')} and b=${vec(b, ',')}. Use ridge with λ=${n(lam)}, which solves (AᵀA+λ)x=Aᵀb; with one column, AᵀA and Aᵀb are single numbers. Enter AᵀA, then Aᵀb, then the ridge x in dollars for each kilometre.`,
  answer: [AA, Ab, x],
  hints: ['AᵀA is the column dotted with itself: square each distance and add.', 'Aᵀb is the column dotted with the fares: multiply each distance by its fare and add. Then one division is left, and λ belongs in the number you divide by.'],
  solution: `AᵀA = ${a.map(d => n(d * d)).join(' + ')} = ${n(AA)}. Aᵀb = ${a.map((d, j) => `${n(d)}×${n(b[j])}`).join(' + ')} = ${n(Ab)}. Ridge: (${n(AA)} + ${n(lam)})x = ${n(Ab)}, so x = ${n(Ab)} ÷ ${n(AA + lam)} = ${count(x, 'dollar')} for each kilometre. Without the penalty the division would be by ${n(AA)} and the price a little higher; ridge trades some fit for a smaller, steadier number.`,
  guidance: [
   { prompt: `AᵀA is the column ${vec(a, ',')} dotted with itself. Work out ${a.map(d => `${n(d)}×${n(d)}`).join(' + ')}.`, answer: [AA], explanation: `${a.map(d => n(d * d)).join(' + ')} = ${n(AA)}.` },
   { prompt: `Aᵀb is the column ${vec(a, ',')} dotted with the fares ${vec(b, ',')}. Work out ${a.map((d, j) => `${n(d)}×${n(b[j])}`).join(' + ')}.`, answer: [Ab], explanation: `${a.map((d, j) => n(d * b[j])).join(' + ')} = ${n(Ab)}.` },
   { prompt: `Ridge adds λ=${n(lam)} to AᵀA before dividing: (${n(AA)} + ${n(lam)})x = ${n(Ab)}. What is x?`, answer: [x], explanation: `${n(Ab)} ÷ ${n(AA + lam)} = ${count(x, 'dollar')} for each kilometre. Leaving λ out would divide by ${n(AA)}, which is ordinary least squares, a different problem.` }
  ] }; }
});

/* Challenge with q30 (condition number): ridge also makes the system steadier. Compare the condition number of AᵀA
   with that of AᵀA + λI, then solve. */
practice({ id: 'q64d', parent: 'q64', kind: 'challenge', uses: 'q30',
 title: 'Ridge steadies the rig',
 brief: 'One sensor of a rig is far weaker than the other, and the analyst wants to see how much ridge steadies the equations.',
 labels: ['condition number of AᵀA', 'condition number with ridge', 'ridge x1', 'ridge x2'], tolerance: 0.004 },
 [['condition number of AᵀA'], ['condition number with ridge'], ['ridge x1', 'ridge x2']], {
 canonical: { a: [1, 3], b: [4, 20], lam: 1 },
 /* a1 < a2. Both condition numbers and both ridge values have at most one decimal (the first at most two). */
 draw: R => { for (let i = 0; i < 500; i++) {
   const a1 = R.pick([1, 1, 2]), a = [a1, R.int(a1 + 1, 6)], lam = R.int(1, 6), b = [R.int(1, 30), R.int(1, 30)];
   if (oneDec(a[1] * a[1] + lam, a[0] * a[0] + lam) && a.every((g, j) => oneDec(g * b[j], g * g + lam)) && !(a[0] === 1 && a[1] === 3 && lam === 1 && b[0] === 4)) return { a, b, lam };
  } return { a: [1, 2], b: [6, 9], lam: 2 }; },
 build: ({ a, b, lam }) => { const sq = a.map(g => g * g), den = sq.map(v => v + lam), num = a.map((g, j) => g * b[j]), k0 = T(sq[1] / sq[0]), k1 = T(den[1] / den[0]), x = num.map((v, j) => T(v / den[j])); return {
  prompt: `A two-sensor rig has A=diag${vec(a, ',')} and readings b=${vec(b, ',')}. For a diagonal matrix with positive entries, the condition number is the largest entry divided by the smallest. Enter the condition number of AᵀA. Ridge with λ=${n(lam)} replaces AᵀA by AᵀA+λI: enter the condition number of that matrix. Then enter the ridge solution of (AᵀA+λI)x=Aᵀb, x₁ then x₂.`,
  answer: [k0, k1, x[0], x[1]],
  hints: ['AᵀA is diagonal too: its entries are the squares of the entries of A. Divide the larger square by the smaller.', 'Adding λ to both diagonal entries lifts the small one far more, in proportion, than the large one. Use the two new entries for the second condition number and as the divisors for x.'],
  solution: `AᵀA = diag${vec(sq, ', ')}, with condition number ${n(sq[1])} ÷ ${n(sq[0])} = ${n(k0)}. AᵀA+λI = diag${vec(den, ', ')}, with condition number ${n(den[1])} ÷ ${n(den[0])} = ${n(k1)}: smaller, so the ridge equations are steadier. Aᵀb = (${n(a[0])}×${n(b[0])}, ${n(a[1])}×${n(b[1])}) = ${vec(num)}. So x₁ = ${n(num[0])} ÷ ${n(den[0])} = ${n(x[0])} and x₂ = ${n(num[1])} ÷ ${n(den[1])} = ${n(x[1])}.`,
  guidance: [
   { prompt: `AᵀA = diag(${n(a[0])}×${n(a[0])}, ${n(a[1])}×${n(a[1])}) = diag${vec(sq, ', ')}. What is its condition number, the largest entry divided by the smallest?`, answer: [k0], explanation: `${n(sq[1])} ÷ ${n(sq[0])} = ${n(k0)}. A large ratio means small errors in the readings can swing the answer.` },
   { prompt: `Adding λ=${n(lam)} to each diagonal entry gives AᵀA+λI = diag${vec(den, ', ')}. What is its condition number?`, answer: [k1], explanation: `${n(den[1])} ÷ ${n(den[0])} = ${n(k1)}, down from ${n(k0)}. This is why ridge is called a stabiliser.` },
   { prompt: `Aᵀb = (${n(a[0])}×${n(b[0])}, ${n(a[1])}×${n(b[1])}) = ${vec(num)}. Divide by the diagonal entries ${n(den[0])} and ${n(den[1])}. Enter x₁, then x₂.`, answer: [x[0], x[1]], explanation: `${n(num[0])} ÷ ${n(den[0])} = ${n(x[0])} and ${n(num[1])} ÷ ${n(den[1])} = ${n(x[1])}.` }
  ] }; }
});

/* ---- q65 Finite differences as linear maps (taught: forward difference (f_next − f) ÷ h; the spacing belongs in
   the divisor; spacing choices are part of the model). ---- */
/* Setting: a trip log. Four samples, so three differences, and the spacing is a time. The spacing is never 1, so
   leaving out the division is always wrong. */
practice({ id: 'q65b', parent: 'q65', kind: 'setting',
 title: 'Speeds from a trip log',
 brief: 'A trip computer logs only distances, and the rider wants the speed over each stretch of the ride.',
 labels: ['first speed', 'second speed', 'third speed'], tolerance: 0.01 },
 [['first speed'], ['second speed', 'third speed']], {
 canonical: { h: 50, s0: 3, v: [18, 14, 22] },
 /* h is in hundredths of an hour. The speeds are chosen so every logged distance is whole; they are not all equal. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const h = R.pick([50, 50, 25, 20, 200]), unit = h === 50 ? 2 : h === 25 ? 4 : h === 20 ? 5 : 1, lo = Math.ceil(8 / unit), hi = Math.floor((h === 200 ? 24 : 32) / unit);
   const v = [unit * R.int(lo, hi), unit * R.int(lo, hi), unit * R.int(lo, hi)];
   if (new Set(v).size > 1) return { h, s0: R.int(0, 9), v };
  } return { h: 50, s0: 3, v: [18, 14, 22] }; },
 build: ({ h, s0, v }) => { const step = h / 100, s = [s0]; v.forEach(t => s.push(s[s.length - 1] + t * h / 100)); const d = i => `(${n(s[i + 1])} − ${n(s[i])}) ÷ ${n(step)}`; return {
  prompt: `A cyclist's trip computer logs the distance from home every ${n(step)} hours: ${list(s.map(n))} km. A forward difference of this log is the average speed over one stretch, in km per hour. Enter the three forward differences, first stretch to third stretch.`,
  answer: v,
  hints: [`Subtract each logged distance from the next one. That gives the km covered in one stretch of ${n(step)} hours.`, `Km in one stretch is not yet km per hour. Divide each by the time spacing, ${n(step)} hours.`],
  solution: `The spacing is h = ${n(step)} hours. First: ${d(0)} = ${n(s[1] - s[0])} ÷ ${n(step)} = ${n(v[0])}. Second: ${d(1)} = ${n(s[2] - s[1])} ÷ ${n(step)} = ${n(v[1])}. Third: ${d(2)} = ${n(s[3] - s[2])} ÷ ${n(step)} = ${n(v[2])} km per hour.`,
  guidance: [
   { prompt: `Between the first two log entries the cyclist covers ${n(s[1])} − ${n(s[0])} km in ${n(step)} hours. Work out ${d(0)}.`, answer: [v[0]], explanation: `${n(s[1] - s[0])} km in ${n(step)} hours is ${n(s[1] - s[0])} ÷ ${n(step)} = ${n(v[0])} km per hour. A speed is a change divided by the time it took.` },
   { prompt: `Do the same for the next two stretches: ${d(1)}, then ${d(2)}.`, answer: [v[1], v[2]], explanation: `${n(s[2] - s[1])} ÷ ${n(step)} = ${n(v[1])} and ${n(s[3] - s[2])} ÷ ${n(step)} = ${n(v[2])} km per hour.` }
  ] }; }
});

/* Applied: the same rule twice. Heights give two climb speeds; the two speeds give one acceleration. */
practice({ id: 'q65c', parent: 'q65', kind: 'applied',
 title: 'Drone climb and acceleration',
 brief: 'A drone logs only its height, and the flight check needs its climb speeds and how fast the climb is changing.',
 labels: ['first speed', 'second speed', 'acceleration'], tolerance: 0.01 },
 [['first speed'], ['second speed'], ['acceleration']], {
 canonical: { h: 50, z0: 4, v: [6, 10] },
 /* h is in hundredths of a second. Heights and the acceleration are whole; the two speeds differ, so the acceleration is not 0. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const h = R.pick([50, 50, 25, 200]), unit = h === 50 ? 2 : h === 25 ? 4 : 1, v = [unit * R.int(1, Math.floor(12 / unit)), unit * R.int(1, Math.floor(12 / unit))];
   if (v[0] !== v[1] && (h !== 200 || (v[1] - v[0]) % 2 === 0)) return { h, z0: R.int(1, 9), v };
  } return { h: 50, z0: 4, v: [6, 10] }; },
 build: ({ h, z0, v }) => { const step = h / 100, z = [z0, z0 + v[0] * h / 100, z0 + (v[0] + v[1]) * h / 100], acc = (v[1] - v[0]) * 100 / h; return {
  prompt: `A drone logs its height every ${n(step)} seconds: ${n(z[0])}, ${n(z[1])} and ${n(z[2])} metres. A forward difference of the heights is a climb speed in metres per second. Enter the first climb speed, then the second. Then take the forward difference of those two speeds, with the same spacing, to get the acceleration in metres per second, each second.`,
  answer: [v[0], v[1], acc],
  hints: [`A climb speed is (next height − this height) ÷ ${n(step)}. There are two of them.`, `The acceleration uses the same rule one level up: (second speed − first speed) ÷ ${n(step)}. The division by the spacing is needed both times.`],
  solution: `First speed: (${n(z[1])} − ${n(z[0])}) ÷ ${n(step)} = ${count(v[0], 'metre')} per second. Second speed: (${n(z[2])} − ${n(z[1])}) ÷ ${n(step)} = ${n(v[1])}. Acceleration: (${n(v[1])} − ${n(v[0])}) ÷ ${n(step)} = ${count(acc, 'metre')} per second, each second${acc < 0 ? '; the minus sign means the climb is slowing' : ''}.`,
  guidance: [
   { prompt: `From the first log entry to the second the height changes by ${n(z[1])} − ${n(z[0])} metres in ${n(step)} seconds. Work out (${n(z[1])} − ${n(z[0])}) ÷ ${n(step)}.`, answer: [v[0]], explanation: `${n(z[1] - z[0])} ÷ ${n(step)} = ${count(v[0], 'metre')} per second.` },
   { prompt: `Now the second climb speed: (${n(z[2])} − ${n(z[1])}) ÷ ${n(step)}.`, answer: [v[1]], explanation: `${n(z[2] - z[1])} ÷ ${n(step)} = ${count(v[1], 'metre')} per second.` },
   { prompt: `The speed goes from ${n(v[0])} to ${n(v[1])} metres per second in ${n(step)} seconds. Work out (${n(v[1])} − ${n(v[0])}) ÷ ${n(step)}.`, answer: [acc], explanation: `${n(v[1] - v[0])} ÷ ${n(step)} = ${n(acc)}. A difference of differences: the same rule applied to the speeds${acc < 0 ? ', and a negative result because the climb is slowing' : ''}.` }
  ] }; }
});

/* Challenge (harder numbers): markers that are not evenly spaced, so each difference has its own spacing; slopes go
   down as well as up. */
practice({ id: 'q65d', parent: 'q65', kind: 'challenge',
 title: 'Slopes between uneven markers',
 brief: 'A road survey has heights at markers that are not evenly spaced, and the route planner needs the slope of each stretch.',
 labels: ['first slope', 'second slope', 'third slope'], tolerance: 0.01 },
 [['first spacing', 'second spacing', 'third spacing'], ['first slope'], ['second slope', 'third slope']], {
 canonical: { x0: 1, d: [50, 200, 25], m: [12, -8, 20], f0: 420 },
 /* d: the three spacings in hundredths of a km, never 1 km and not all equal. m: slopes in metres per km, chosen so
    every height is whole and stays above 0; at least one stretch goes down. */
 draw: R => { for (let i = 0; i < 500; i++) {
   const d = [0, 0, 0].map(() => R.pick([50, 200, 25, 400, 20, 500]));
   const m = d.map(s => { const unit = s === 50 ? 2 : s === 25 ? 4 : s === 20 ? 5 : 1, top = s >= 400 ? 12 : Math.floor(20 / unit); return unit * R.nz(-top, top); });
   if (new Set(d).size > 1 && m.some(t => t < 0) && new Set(m).size > 1) return { x0: R.int(0, 3), d, m, f0: 10 * R.int(40, 90) };
  } return { x0: 1, d: [50, 200, 25], m: [12, -8, 20], f0: 420 }; },
 build: ({ x0, d, m, f0 }) => { const hs = d.map(s => s / 100), pos = [x0], f = [f0]; hs.forEach((s, i) => { pos.push(T(pos[i] + s)); f.push(f[i] + m[i] * d[i] / 100); });
  const q = i => `(${n(f[i + 1])} − ${n(f[i])}) ÷ ${n(hs[i])}`; return {
  prompt: `A road survey gives the height of a road at four markers that are not evenly spaced. The markers are at ${list(pos.map(n))} km along the road, and the heights there are ${list(f.map(n))} metres. Each forward difference must be divided by the spacing of its own stretch. Enter the three slopes in metres per km, first stretch to third stretch. A stretch that goes down has a negative slope.`,
  answer: m,
  hints: ['Find the three spacings first: subtract each marker position from the next one. They are not all the same.', 'For each stretch: (next height − this height) ÷ (the spacing of that stretch). Keep the minus sign when the road goes down.'],
  solution: `The spacings are ${list(pos.slice(1).map((p, i) => `${n(p)} − ${n(pos[i])} = ${n(hs[i])}`))} km. First slope: ${q(0)} = ${n(f[1] - f[0])} ÷ ${n(hs[0])} = ${n(m[0])}. Second slope: ${q(1)} = ${n(f[2] - f[1])} ÷ ${n(hs[1])} = ${n(m[1])}. Third slope: ${q(2)} = ${n(f[3] - f[2])} ÷ ${n(hs[2])} = ${count(m[2], 'metre')} per km.`,
  guidance: [
   { prompt: `The markers are at ${list(pos.map(n))} km. Enter the three spacings between neighbouring markers, in order.`, answer: hs, explanation: `${list(pos.slice(1).map((p, i) => `${n(p)} − ${n(pos[i])} = ${n(hs[i])}`))}. On an uneven grid every stretch brings its own spacing.` },
   { prompt: `On the first stretch the height changes by ${n(f[1])} − ${n(f[0])} metres over ${n(hs[0])} km. Work out ${q(0)}.`, answer: [m[0]], explanation: `${n(f[1] - f[0])} ÷ ${n(hs[0])} = ${count(m[0], 'metre')} per km.` },
   { prompt: `Now the second stretch, ${q(1)}, then the third, ${q(2)}.`, answer: [m[1], m[2]], explanation: `${n(f[2] - f[1])} ÷ ${n(hs[1])} = ${n(m[1])} and ${n(f[3] - f[2])} ÷ ${n(hs[2])} = ${count(m[2], 'metre')} per km. Each difference is divided by its own spacing, not by one common number.` }
  ] }; }
});

})();
