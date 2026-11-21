/* Foundations practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d ... q35b q35c q35d). Format and rules: docs/PACK-FORMAT.md, "Practice missions".
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/found/oracle-p7.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* In this file the authored mission is built from its generator: make(meta, generator) runs
   generator.build(generator.canonical) and registers the result with add(). The authored text and the generated text
   therefore cannot drift apart. Guided-step labels are written in build(). To read a mission as the player sees it:
   node qa/show-mission.js q31b --realm found --draw 3 */
const make = (meta, generator) => {
 const b = generator.build(generator.canonical), { uses, ...head } = meta;
 add({ ...head, prompt: G.clean(b.prompt), answer: b.answer.map(G.tidy), hints: b.hints.map(G.clean), solution: G.clean(b.solution),
  guidance: b.guidance.map(g => ({ prompt: G.clean(g.prompt), answer: g.answer.map(G.tidy), labels: g.labels, explanation: G.clean(g.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* Coefficient in front of a letter: cf(1) → "", cf(4) → "4". */
const cf = k => k === 1 ? '' : n(k);
/* Pairs of whole numbers that multiply to c, as "1 and 20, 2 and 10, 4 and 5". */
const pairList = c => { const out = []; for (let u = 1; u * u <= c; u++) if (c % u === 0) out.push([u, c / u]); return out; };
const pairs = c => pairList(c).map(([u, v]) => `${n(u)} and ${n(v)}`).join(', ');
/* Numbers with no perfect-square factor above 1: what may stay under a root. */
const FREE = [2, 3, 5, 6, 7];
/* Roots that q31 itself works out: its lesson simplifies √45, √48 and √50, and its own mission √72. */
const TAUGHT_ROOTS = [45, 48, 50, 72];
/* k and m for √(k²·m), never one of the roots q31 already simplifies. */
const rootDraw = (R, ks) => { let k, m; do { k = R.pick(ks); m = R.pick(FREE); } while (TAUGHT_ROOTS.includes(k * k * m)); return { k, m }; };
/* True when {a, b} is one of the listed pairs, in either order. */
const inPairs = (list, a, b) => list.some(([u, v]) => (u === a && v === b) || (u === b && v === a));
/* Brackets (x + a)(x + b) that q32 itself multiplies out: its mission (3, 5), its lesson (2, 4) and its example (1, 6). */
const TAUGHT_PRODUCTS = [[3, 5], [2, 4], [1, 6]];
/* Pairs that q33 itself factors: its mission (4 and 5), its lesson (2 and 4, 2 and 5) and its pitfall (3 and 4). */
const TAUGHT_PAIRS = [[4, 5], [2, 4], [2, 5], [3, 4]];
/* Roots that q34 itself finds: its mission (2 and 6), its lesson (1 and 3, 2 and 8) and its pitfall (3 and 7). */
const TAUGHT_ROOT_PAIRS = [[2, 6], [1, 3], [2, 8], [3, 7]];
/* p < q for (x + p)(x + q), never a pair q33 already factors. */
const pairDraw = (R, lo, hi, top) => { let p, q; do { p = R.int(lo, hi); q = R.int(p + 1, top); } while (inPairs(TAUGHT_PAIRS, p, q)); return { p, q }; };
/* Roots r and r + d of a parabola, d even so the vertex is whole; never a pair of roots q34 already finds. */
const rootsDraw = (R, lo, hi, gaps) => { let r, d; do { r = R.int(lo, hi); d = R.pick(gaps); } while (inPairs(TAUGHT_ROOT_PAIRS, r, r + d)); return { r, d }; };

/* ---- q31 Square roots and radicals ---- */
/* Side of a square from its area, the fence round it, and √(k²·m) = k√m. s ≥ 5 so that the fence (4s) is never the area. */
make({
 id: 'q31b', parent: 'q31', kind: 'setting',
 title: 'Fencing the allotment',
 brief: 'Two square allotment plots are known only by their areas, and the fence order needs their sides.',
 labels: ['side (m)', 'fence (m)', 'k (outside the root)', 'm (inside the root)'], tolerance: 0.001
}, {
 canonical: { s: 9, k: 5, m: 3 },
 draw: R => ({ s: R.int(5, 15), ...rootDraw(R, [2, 3, 4, 5, 6]) }),
 build: ({ s, k, m }) => { const A = s * s, K = k * k, N = K * m, F = 4 * s; return {
  prompt: `A square allotment plot has an area of ${n(A)} m². Enter the length of one side in metres, then the length of fence needed to go all the way round its four sides. The square plot next to it has an area of ${n(N)} m², so its side is exactly √${n(N)} m. Simplify √${n(N)} into the form k√m, where k is a whole number and no perfect square other than 1 divides m exactly, and enter k, then m.`,
  answer: [s, F, k, m],
  hints: [`The side is the whole number that, times itself, gives ${n(A)}. The fence is four of those sides.`, `Find the largest perfect square (4, 9, 16, 25, 36 …) that divides ${n(N)} exactly. Its root goes outside the radical sign.`],
  solution: `${n(s)} × ${n(s)} = ${n(A)}, so the side is √${n(A)} = ${n(s)} m. The fence is 4 × ${n(s)} = ${n(F)} m. The largest perfect square that divides ${n(N)} is ${n(K)}, and ${n(N)} = ${n(K)} × ${n(m)}, so √${n(N)} = √${n(K)} × √${n(m)} = ${n(k)}√${n(m)} m.`,
  guidance: [
   { prompt: `Which whole number, times itself, gives ${n(A)}? That is the side of the first plot in metres.`, answer: [s], labels: ['side (m)'], explanation: `${n(s)} × ${n(s)} = ${n(A)}, so √${n(A)} = ${n(s)} m.` },
   { prompt: `The fence runs along all four sides, each ${n(s)} m long. How many metres of fence is that?`, answer: [F], labels: ['fence (m)'], explanation: `4 × ${n(s)} = ${n(F)} m.` },
   { prompt: `What is the largest perfect square that divides ${n(N)} exactly?`, answer: [K], labels: ['largest perfect square'], explanation: `${n(N)} ÷ ${n(K)} = ${n(m)}, and ${n(K)} = ${n(k)} × ${n(k)}. No larger perfect square divides ${n(N)}.` },
   { prompt: `√${n(N)} = √${n(K)} × √${n(m)}. Enter k, the root of the perfect square, then m, the number left under the root.`, answer: [k, m], labels: ['k', 'm'], explanation: `√${n(K)} = ${n(k)}, so the second plot’s side is ${n(k)}√${n(m)} m.` }
  ] }; }
});

/* A crate of c equal square tiles covering c·k²·m cm²: one tile's area by division, then its side k√m. */
make({
 id: 'q31c', parent: 'q31', kind: 'applied',
 title: 'Heat tiles by the crate',
 brief: 'A crate of square heat tiles is labelled with its total cover only, and the furnace crew needs the side of one tile.',
 labels: ['area of one tile (cm²)', 'k (outside the root)', 'm (inside the root)'], tolerance: 0.001
}, {
 canonical: { c: 5, k: 6, m: 3 },
 draw: R => ({ c: R.pick([4, 5, 8, 10]), ...rootDraw(R, [3, 4, 5, 6, 10]) }),
 build: ({ c, k, m }) => { const K = k * k, T = K * m, total = c * T; return {
  prompt: `A crate of square heat tiles for the yard furnace covers ${n(total)} cm² in all. There are ${n(c)} tiles in the crate, all the same size. Enter the area of one tile in cm². The side of a tile is the square root of its area. Write that side in the form k√m centimetres, where k is a whole number and no perfect square other than 1 divides m exactly, and enter k, then m.`,
  answer: [T, k, m],
  hints: [`Share the total area equally between the ${n(c)} tiles: divide.`, `Look for the largest perfect square that divides the area of one tile exactly. Try 4, 9, 16, 25, 36 and 100.`],
  solution: `One tile covers ${n(total)} ÷ ${n(c)} = ${n(T)} cm², so its side is √${n(T)} cm. The largest perfect square that divides ${n(T)} is ${n(K)}, and ${n(T)} = ${n(K)} × ${n(m)}, so √${n(T)} = √${n(K)} × √${n(m)} = ${n(k)}√${n(m)} cm.`,
  guidance: [
   { prompt: `${n(c)} equal tiles cover ${n(total)} cm². What area does one tile cover, in cm²?`, answer: [T], labels: ['area of one tile (cm²)'], explanation: `${n(total)} ÷ ${n(c)} = ${n(T)} cm².` },
   { prompt: `The side of a tile is √${n(T)} cm. What is the largest perfect square that divides ${n(T)} exactly?`, answer: [K], labels: ['largest perfect square'], explanation: `${n(T)} ÷ ${n(K)} = ${n(m)}, and ${n(K)} = ${n(k)} × ${n(k)}. No larger perfect square divides ${n(T)}.` },
   { prompt: `√${n(T)} = √${n(K)} × √${n(m)}. Enter k, the root of the perfect square, then m, the number left under the root.`, answer: [k, m], labels: ['k', 'm'], explanation: `√${n(K)} = ${n(k)}, so the side of a tile is ${n(k)}√${n(m)} cm.` }
  ] }; }
});

/* Pythagoras (q20) with legs g·u and g·v, where u² + v² has no square factor: the rope is g√(u² + v²). */
make({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q20',
 title: 'The flagpole rope',
 brief: 'A rope from the top of a flagpole to a ground peg must be cut to its exact length before the pole goes up.',
 labels: ['rope length times itself', 'k (outside the root)', 'm (inside the root)'], tolerance: 0.001
}, {
 canonical: { g: 6, u: 2, v: 1 },
 draw: R => { let g, u, v; do { [u, v] = R.pick([[1, 1], [2, 1], [1, 2], [3, 1], [1, 3], [3, 2], [2, 3], [4, 1], [1, 4]]); g = R.int(2, 6); } while (TAUGHT_ROOTS.includes(g * g * (u * u + v * v))); return { g, u, v }; },
 build: ({ g, u, v }) => { const h = g * u, d = g * v, hh = h * h, dd = d * d, S = hh + dd, K = g * g, m = u * u + v * v; return {
  prompt: `A flagpole is ${n(h)} m tall and stands upright on level ground. A rope runs straight from the top of the pole to a peg in the ground, ${n(d)} m from the foot of the pole. The pole, the ground and the rope make a triangle with a right angle at the foot of the pole. Use Pythagoras’ rule to find the rope’s length multiplied by itself, and enter it. The rope’s length is the square root of that number. Write it in the form k√m metres, where k is a whole number and no perfect square other than 1 divides m exactly, and enter k, then m.`,
  answer: [S, g, m],
  hints: [`Pythagoras’ rule: multiply each short side by itself and add the two results. The short sides are the pole and the distance along the ground.`, `Find the largest perfect square (4, 9, 16, 25, 36) that divides your sum exactly. Its root goes outside the radical sign.`],
  solution: `The short sides are ${n(h)} m and ${n(d)} m. ${n(h)} × ${n(h)} + ${n(d)} × ${n(d)} = ${n(hh)} + ${n(dd)} = ${n(S)}, so the rope is √${n(S)} m long. The largest perfect square that divides ${n(S)} is ${n(K)}, and ${n(S)} = ${n(K)} × ${n(m)}, so √${n(S)} = √${n(K)} × √${n(m)} = ${n(g)}√${n(m)} m.`,
  guidance: [
   { prompt: `Multiply each short side by itself. Enter ${n(h)} × ${n(h)}, then ${n(d)} × ${n(d)}.`, answer: [hh, dd], labels: ['pole times itself', 'ground distance times itself'], explanation: `${n(h)} × ${n(h)} = ${n(hh)} and ${n(d)} × ${n(d)} = ${n(dd)}.` },
   { prompt: `Add the two results. This sum is the rope’s length multiplied by itself.`, answer: [S], labels: ['rope length times itself'], explanation: `${n(hh)} + ${n(dd)} = ${n(S)}, so the rope is √${n(S)} m long.` },
   { prompt: `What is the largest perfect square that divides ${n(S)} exactly?`, answer: [K], labels: ['largest perfect square'], explanation: `${n(S)} ÷ ${n(K)} = ${n(m)}, and ${n(K)} = ${n(g)} × ${n(g)}. No larger perfect square divides ${n(S)}.` },
   { prompt: `√${n(S)} = √${n(K)} × √${n(m)}. Enter k, the root of the perfect square, then m, the number left under the root.`, answer: [g, m], labels: ['k', 'm'], explanation: `√${n(K)} = ${n(g)}, so the rope is ${n(g)}√${n(m)} m long.` }
  ] }; }
});

/* ---- q32 Adding and multiplying polynomials ---- */
/* (x + a)(x + b) + p(x + c) = x² + (a + b + p)x + (ab + pc). */
make({
 id: 'q32b', parent: 'q32', kind: 'setting',
 title: 'Carpet for the extension',
 brief: 'A room is being extended before anyone has measured it, and the carpet order needs one formula for the whole floor.',
 labels: ['x coefficient', 'constant'], tolerance: 0.001
}, {
 canonical: { a: 3, b: 2, p: 2, c: 4 },
 draw: R => { let a, b; do { a = R.int(1, 5); b = R.int(1, 5); } while (inPairs(TAUGHT_PRODUCTS, a, b)); return { a, b, p: R.int(2, 3), c: R.int(2, 6) }; },
 build: ({ a, b, p, c }) => { const s = a + b, ab = a * b, pc = p * c; return {
  prompt: `A square living room has sides of x metres, and x has not been measured yet. An extension will make the room ${n(a)} m longer and ${n(b)} m wider, so the new floor is x + ${n(a)} m by x + ${n(b)} m. The hallway is ${n(p)} m wide and x + ${n(c)} m long. Both floors need carpet. Multiply out the two areas, add them, and write the total in the form x² + (number)x + (number) m². Enter the two numbers in that order.`,
  answer: [s + p, ab + pc],
  hints: [`The new living room floor is (x + ${n(a)})(x + ${n(b)}). Multiply each part of the first bracket by each part of the second: that gives four pieces.`, `The hallway is ${n(p)}(x + ${n(c)}): multiply both parts of the bracket by ${n(p)}. Then add like terms: x terms together, plain numbers together.`],
  solution: `Living room: (x + ${n(a)})(x + ${n(b)}) = x² + ${cf(b)}x + ${cf(a)}x + ${n(ab)} = x² + ${n(s)}x + ${n(ab)}. Hallway: ${n(p)}(x + ${n(c)}) = ${n(p)}x + ${n(pc)}. Adding like terms: x² + (${n(s)} + ${n(p)})x + (${n(ab)} + ${n(pc)}) = x² + ${n(s + p)}x + ${n(ab + pc)} m².`,
  guidance: [
   { prompt: `Multiply out (x + ${n(a)})(x + ${n(b)}): the four pieces are x², ${cf(b)}x, ${cf(a)}x and ${n(a)} × ${n(b)}. Enter the x coefficient and the constant.`, answer: [s, ab], labels: ['x coefficient', 'constant'], explanation: `${cf(b)}x + ${cf(a)}x = ${n(s)}x and ${n(a)} × ${n(b)} = ${n(ab)}, so the living room floor is x² + ${n(s)}x + ${n(ab)}.` },
   { prompt: `The hallway is ${n(p)}(x + ${n(c)}). Multiply it out into (number)x + (number) and enter the two numbers.`, answer: [p, pc], labels: ['x coefficient', 'constant'], explanation: `${n(p)} × x = ${n(p)}x and ${n(p)} × ${n(c)} = ${n(pc)}, so the hallway floor is ${n(p)}x + ${n(pc)}.` },
   { prompt: `Add x² + ${n(s)}x + ${n(ab)} and ${n(p)}x + ${n(pc)}. Enter the x coefficient and the constant of the total.`, answer: [s + p, ab + pc], labels: ['x coefficient', 'constant'], explanation: `${n(s)} + ${n(p)} = ${n(s + p)} and ${n(ab)} + ${n(pc)} = ${n(ab + pc)}. There is only one x² term, so it stays x².` }
  ] }; }
});

/* (x + a)(x + b) multiplied out, then its value at x = x0 and the cost at a price per m². a < b. */
make({
 id: 'q32c', parent: 'q32', kind: 'applied',
 title: 'Turf for the new lawn',
 brief: 'A lawn is planned with one length still open, and the turf has to be priced as soon as that length is chosen.',
 labels: ['x coefficient', 'constant', 'area (m²)', 'cost (dollars)'], tolerance: 0.001
}, {
 canonical: { a: 2, b: 5, x0: 6, price: 3 },
 draw: R => { let a, b; do { a = R.int(1, 4); b = R.int(a + 1, 7); } while (inPairs(TAUGHT_PRODUCTS, a, b)); return { a, b, x0: R.int(3, 8), price: R.pick([2, 3, 5, 10]) }; },
 build: ({ a, b, x0, price }) => { const s = a + b, ab = a * b, area = x0 * x0 + s * x0 + ab, cost = area * price; return {
  prompt: `A rectangular lawn is being planned. Its sides are x + ${n(a)} m and x + ${n(b)} m, where x is a length in metres that is still to be chosen. Multiply out the area (x + ${n(a)})(x + ${n(b)}) and write it as x² + (number)x + (number); enter those two numbers. The owner then chooses x = ${n(x0)}. Enter the lawn’s area in m², and then the cost of turf for it at ${n(price)} dollars for each m². Type each number without commas.`,
  answer: [s, ab, area, cost],
  hints: [`Multiply each part of the first bracket by each part of the second, then add the two x terms into one.`, `Put ${n(x0)} in place of x in your multiplied-out area. The cost is the area times the price of one m².`],
  solution: `(x + ${n(a)})(x + ${n(b)}) = x² + ${cf(b)}x + ${cf(a)}x + ${n(ab)} = x² + ${n(s)}x + ${n(ab)}. At x = ${n(x0)}: ${n(x0)} × ${n(x0)} + ${n(s)} × ${n(x0)} + ${n(ab)} = ${n(x0 * x0)} + ${n(s * x0)} + ${n(ab)} = ${n(area)} m². Check with the sides: ${n(x0 + a)} × ${n(x0 + b)} = ${n(area)}. The turf costs ${n(area)} × ${n(price)} = ${n(cost)} dollars.`,
  guidance: [
   { prompt: `Multiply out (x + ${n(a)})(x + ${n(b)}): the four pieces are x², ${cf(b)}x, ${cf(a)}x and ${n(a)} × ${n(b)}. Enter the x coefficient and the constant.`, answer: [s, ab], labels: ['x coefficient', 'constant'], explanation: `${cf(b)}x + ${cf(a)}x = ${n(s)}x and ${n(a)} × ${n(b)} = ${n(ab)}, so the area is x² + ${n(s)}x + ${n(ab)}.` },
   { prompt: `Put x = ${n(x0)} into x² + ${n(s)}x + ${n(ab)}. What is the area in m²?`, answer: [area], labels: ['area (m²)'], explanation: `${n(x0 * x0)} + ${n(s * x0)} + ${n(ab)} = ${n(area)} m². The sides are ${n(x0 + a)} m and ${n(x0 + b)} m, and ${n(x0 + a)} × ${n(x0 + b)} = ${n(area)} too.` },
   { prompt: `Turf costs ${n(price)} dollars for each m², and the lawn is ${n(area)} m². What does the turf cost?`, answer: [cost], labels: ['cost (dollars)'], explanation: `${n(area)} × ${n(price)} = ${n(cost)} dollars.` }
  ] }; }
});

/* (p·x + c)(x + d) + (x + a)(x + b) with p = 2 or 3: a bracket whose x has a coefficient. */
make({
 id: 'q32d', parent: 'q32', kind: 'challenge',
 title: 'Varnish for the sports hall',
 brief: 'A sports hall has two floors to varnish, and the plans give their sides only as formulas.',
 labels: ['x² coefficient', 'x coefficient', 'constant'], tolerance: 0.001
}, {
 canonical: { p: 2, c: 3, d: 4, a: 2, b: 6 },
 draw: R => { let a, b; do { a = R.int(1, 5); b = R.int(1, 6); } while (inPairs(TAUGHT_PRODUCTS, a, b)); return { p: R.int(2, 3), c: R.int(1, 5), d: R.int(2, 5), a, b }; },
 build: ({ p, c, d, a, b }) => { const pd = p * d, m1 = pd + c, cd = c * d, s = a + b, ab = a * b; return {
  prompt: `A sports hall has two floors to varnish, and x is a length in metres that is still to be fixed. The main court is ${n(p)}x + ${n(c)} m by x + ${n(d)} m. The warm-up area is x + ${n(a)} m by x + ${n(b)} m. Multiply out both areas, add them, and write the total in the form (number)x² + (number)x + (number) m². Enter the three numbers in that order.`,
  answer: [p + 1, m1 + s, cd + ab],
  hints: [`Main court: multiply each part of ${n(p)}x + ${n(c)} by each part of x + ${n(d)}. The piece ${n(p)}x × x is ${n(p)}x², and the piece ${n(p)}x × ${n(d)} is ${n(pd)}x.`, `Multiply out the warm-up area the same way. Then add like terms: x² terms together, x terms together, plain numbers together.`],
  solution: `Main court: (${n(p)}x + ${n(c)})(x + ${n(d)}) = ${n(p)}x² + ${n(pd)}x + ${cf(c)}x + ${n(cd)} = ${n(p)}x² + ${n(m1)}x + ${n(cd)}. Warm-up area: (x + ${n(a)})(x + ${n(b)}) = x² + ${cf(b)}x + ${cf(a)}x + ${n(ab)} = x² + ${n(s)}x + ${n(ab)}. Adding like terms: (${n(p)} + 1)x² + (${n(m1)} + ${n(s)})x + (${n(cd)} + ${n(ab)}) = ${n(p + 1)}x² + ${n(m1 + s)}x + ${n(cd + ab)} m².`,
  guidance: [
   { prompt: `Multiply out (${n(p)}x + ${n(c)})(x + ${n(d)}): the four pieces are ${n(p)}x × x, ${n(p)}x × ${n(d)}, ${n(c)} × x and ${n(c)} × ${n(d)}. Enter the x² coefficient, the x coefficient and the constant.`, answer: [p, m1, cd], labels: ['x² coefficient', 'x coefficient', 'constant'], explanation: `${n(p)}x × x = ${n(p)}x². The x terms are ${n(pd)}x + ${cf(c)}x = ${n(m1)}x. The constant is ${n(c)} × ${n(d)} = ${n(cd)}.` },
   { prompt: `Multiply out (x + ${n(a)})(x + ${n(b)}). Enter the x coefficient and the constant.`, answer: [s, ab], labels: ['x coefficient', 'constant'], explanation: `${cf(b)}x + ${cf(a)}x = ${n(s)}x and ${n(a)} × ${n(b)} = ${n(ab)}, so the warm-up area is x² + ${n(s)}x + ${n(ab)}.` },
   { prompt: `Add ${n(p)}x² + ${n(m1)}x + ${n(cd)} and x² + ${n(s)}x + ${n(ab)}. Enter the x² coefficient, the x coefficient and the constant.`, answer: [p + 1, m1 + s, cd + ab], labels: ['x² coefficient', 'x coefficient', 'constant'], explanation: `${n(p)} + 1 = ${n(p + 1)}, because x² alone counts as one x². Then ${n(m1)} + ${n(s)} = ${n(m1 + s)} and ${n(cd)} + ${n(ab)} = ${n(cd + ab)}.` }
  ] }; }
});

/* ---- q33 Factoring ---- */
/* Seats = x² + (p + q)x + pq = (x + p) rows of (x + q) seats, 2 ≤ p < q; then the count at x = 10, 20 or 30. */
make({
 id: 'q33b', parent: 'q33', kind: 'setting',
 title: 'Rows in the theatre',
 brief: 'A theatre’s seating plan is written as one formula, and the ushers need it as rows and seats in a row.',
 labels: ['rows: x plus', 'seats in a row: x plus', 'total seats'], tolerance: 0.001
}, {
 canonical: { p: 3, q: 8, x0: 20 },
 draw: R => ({ ...pairDraw(R, 2, 6, 9), x0: R.pick([10, 20, 30]) }),
 build: ({ p, q, x0 }) => { const b = p + q, c = p * q, rows = x0 + p, per = x0 + q, total = rows * per; return {
  prompt: `A theatre’s seating plan uses a letter so that it fits halls of different sizes. The number of seats is x² + ${n(b)}x + ${n(c)}. The seats stand in rows of equal length. The number of rows is x plus one number, and the number of seats in each row is x plus another number. There are fewer rows than seats in a row. Factor the seat count into the form (x + number)(x + number). Enter the number for the rows, then the number for the seats in a row. Then enter the total number of seats when x = ${n(x0)}. Type each number without commas.`,
  answer: [p, q, total],
  hints: [`Look for two whole numbers that multiply to ${n(c)} and add to ${n(b)}. The smaller one belongs to the rows.`, `The pairs that multiply to ${n(c)} are ${pairs(c)}. For the total, put ${n(x0)} in place of x.`],
  solution: `${n(p)} × ${n(q)} = ${n(c)} and ${n(p)} + ${n(q)} = ${n(b)}, so x² + ${n(b)}x + ${n(c)} = (x + ${n(p)})(x + ${n(q)}): x + ${n(p)} rows of x + ${n(q)} seats. When x = ${n(x0)} that is ${n(rows)} rows of ${n(per)} seats, and ${n(rows)} × ${n(per)} = ${n(total)} seats. Check with the first form: ${n(x0 * x0)} + ${n(b * x0)} + ${n(c)} = ${n(total)}.`,
  guidance: [
   { prompt: `The two numbers must add to the x coefficient of x² + ${n(b)}x + ${n(c)} and multiply to its constant. Enter that sum, then that product.`, answer: [b, c], labels: ['sum', 'product'], explanation: `The x coefficient is ${n(b)} and the constant is ${n(c)}.` },
   { prompt: `The pairs that multiply to ${n(c)} are ${pairs(c)}. Which pair adds to ${n(b)}? Enter it, smaller first.`, answer: [p, q], labels: ['smaller number', 'larger number'], explanation: `${n(p)} + ${n(q)} = ${n(b)}, so the seat count is (x + ${n(p)})(x + ${n(q)}).` },
   { prompt: `There are x + ${n(p)} rows of x + ${n(q)} seats. When x = ${n(x0)}, enter the number of rows, then the seats in a row.`, answer: [rows, per], labels: ['rows', 'seats in a row'], explanation: `${n(x0)} + ${n(p)} = ${n(rows)} rows and ${n(x0)} + ${n(q)} = ${n(per)} seats in a row.` },
   { prompt: `${n(rows)} rows of ${n(per)} seats: how many seats in all? You can also put x = ${n(x0)} into x² + ${n(b)}x + ${n(c)}.`, answer: [total], labels: ['total seats'], explanation: `${n(rows)} × ${n(per)} = ${n(total)}. The first form agrees: ${n(x0 * x0)} + ${n(b * x0)} + ${n(c)} = ${n(total)}.` }
  ] }; }
});

/* One x-by-x plate, (p + q) strips x by 1 and pq unit plates make a rectangle (x + p) by (x + q); sides at x = x0. */
make({
 id: 'q33c', parent: 'q33', kind: 'applied',
 title: 'Paving the landing pad',
 brief: 'Mira has a stack of plates and strips for a new landing pad, and needs to know what rectangle they make.',
 labels: ['smaller number', 'larger number', 'shorter side (m)', 'longer side (m)'], tolerance: 0.001
}, {
 canonical: { p: 3, q: 6, x0: 5 },
 draw: R => ({ ...pairDraw(R, 2, 5, 8), x0: R.int(3, 9) }),
 build: ({ p, q, x0 }) => { const b = p + q, c = p * q, lo = x0 + p, hi = x0 + q; return {
  prompt: `Mira is paving a rectangular landing pad with no gaps and no overlaps. She has one large square plate with sides of x metres, ${n(b)} strips that are each x metres long and 1 m wide, and ${n(c)} small square plates with sides of 1 m. Every piece is used, so the pad’s area is the sum of the pieces. The pad’s sides are x plus one number and x plus another number, in metres. Enter the two numbers, smaller first. Then enter the pad’s two side lengths in metres when x = ${n(x0)}, shorter first.`,
  answer: [p, q, lo, hi],
  hints: [`The large plate has area x², each strip has area x × 1 = x, and each small plate has area 1. Add them up to write the pad’s area as x² + (number)x + (number).`, `Now factor: find two whole numbers that multiply to the number of small plates and add to the number of strips.`],
  solution: `The area is x² for the large plate, ${n(b)}x for the ${n(b)} strips and ${n(c)} for the small plates: x² + ${n(b)}x + ${n(c)} m². ${n(p)} × ${n(q)} = ${n(c)} and ${n(p)} + ${n(q)} = ${n(b)}, so x² + ${n(b)}x + ${n(c)} = (x + ${n(p)})(x + ${n(q)}). The pad is x + ${n(p)} m by x + ${n(q)} m. When x = ${n(x0)} its sides are ${n(x0)} + ${n(p)} = ${n(lo)} m and ${n(x0)} + ${n(q)} = ${n(hi)} m.`,
  guidance: [
   { prompt: `Each strip has area x m² and each small plate 1 m². With one large plate, ${n(b)} strips and ${n(c)} small plates, the area is x² + (number)x + (number). Enter the two numbers.`, answer: [b, c], labels: ['x coefficient', 'constant'], explanation: `${n(b)} strips give ${n(b)}x and ${n(c)} small plates give ${n(c)}, so the area is x² + ${n(b)}x + ${n(c)} m².` },
   { prompt: `The pairs that multiply to ${n(c)} are ${pairs(c)}. Which pair adds to ${n(b)}? Enter it, smaller first.`, answer: [p, q], labels: ['smaller number', 'larger number'], explanation: `${n(p)} + ${n(q)} = ${n(b)}, so the area is (x + ${n(p)})(x + ${n(q)}). Along one side of the large plate lie ${n(p)} strips, along the other ${n(q)}, and the small plates fill the corner.` },
   { prompt: `The sides are x + ${n(p)} and x + ${n(q)} metres. Enter both lengths when x = ${n(x0)}, shorter first.`, answer: [lo, hi], labels: ['shorter side (m)', 'longer side (m)'], explanation: `${n(x0)} + ${n(p)} = ${n(lo)} m and ${n(x0)} + ${n(q)} = ${n(hi)} m.` }
  ] }; }
});

/* A larger constant with at least three factor pairs, then the fence 2(x + p) + 2(x + q) = P solved for x (q17). */
make({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q17',
 title: 'The paddock fence',
 brief: 'A paddock’s area is on file as a formula, and the length of its fence is the only measurement anyone has.',
 labels: ['smaller number', 'larger number', 'x', 'longer side (m)'], tolerance: 0.001
}, {
 canonical: { p: 6, q: 8, x0: 15 },
 draw: R => { let p, q; do { p = R.int(3, 8); q = R.int(p + 1, 12); } while (pairList(p * q).length < 3 || inPairs(TAUGHT_PAIRS, p, q)); return { p, q, x0: R.int(5, 20) }; },
 build: ({ p, q, x0 }) => { const b = p + q, c = p * q, b2 = 2 * b, P = 4 * x0 + b2, lo = x0 + p, hi = x0 + q; return {
  prompt: `A rectangular paddock has an area of x² + ${n(b)}x + ${n(c)} m². Its sides are x plus one number and x plus another number, in metres. Factor the area and enter the two numbers, smaller first. The fence that runs all the way round the paddock is ${n(P)} m long. Use that to find x, and enter it. Then enter the length of the longer side in metres.`,
  answer: [p, q, x0, hi],
  hints: [`List the pairs of whole numbers that multiply to ${n(c)}, and pick the pair that adds to ${n(b)}.`, `The fence is two of each side: 2 × (shorter side) + 2 × (longer side) = ${n(P)}. Write both sides with x, collect like terms, and solve the equation for x.`],
  solution: `${n(p)} × ${n(q)} = ${n(c)} and ${n(p)} + ${n(q)} = ${n(b)}, so the area is (x + ${n(p)})(x + ${n(q)}). The fence is 2(x + ${n(p)}) + 2(x + ${n(q)}) = 2x + ${n(2 * p)} + 2x + ${n(2 * q)} = 4x + ${n(b2)}, so 4x + ${n(b2)} = ${n(P)}. Take ${n(b2)} from both sides: 4x = ${n(P - b2)}. Divide both sides by 4: x = ${n(x0)}. The longer side is ${n(x0)} + ${n(q)} = ${n(hi)} m and the shorter is ${n(x0)} + ${n(p)} = ${n(lo)} m. Check: 2 × ${n(lo)} + 2 × ${n(hi)} = ${n(P)}.`,
  guidance: [
   { prompt: `The pairs that multiply to ${n(c)} are ${pairs(c)}. Which pair adds to ${n(b)}? Enter it, smaller first.`, answer: [p, q], labels: ['smaller number', 'larger number'], explanation: `${n(p)} + ${n(q)} = ${n(b)}, so the area is (x + ${n(p)})(x + ${n(q)}).` },
   { prompt: `The fence is 2(x + ${n(p)}) + 2(x + ${n(q)}). Distribute and collect like terms to get 4x + (number). Enter the number.`, answer: [b2], labels: ['plain number'], explanation: `2x + ${n(2 * p)} + 2x + ${n(2 * q)} = 4x + ${n(b2)}.` },
   { prompt: `Solve 4x + ${n(b2)} = ${n(P)} for x.`, answer: [x0], labels: ['x'], explanation: `Take ${n(b2)} from both sides: 4x = ${n(P - b2)}. Divide both sides by 4: x = ${n(x0)}.` },
   { prompt: `The longer side is x + ${n(q)} metres. How long is it when x = ${n(x0)}?`, answer: [hi], labels: ['longer side (m)'], explanation: `${n(x0)} + ${n(q)} = ${n(hi)} m. The shorter side is ${n(lo)} m, and 2 × ${n(lo)} + 2 × ${n(hi)} = ${n(P)}.` }
  ] }; }
});

/* ---- q34 Quadratics: roots and vertex ---- */
/* y = (x − r)(x − s), s = r + d with d even: a bank balance in hundreds of dollars that dips below 0. */
make({
 id: 'q34b', parent: 'q34', kind: 'setting',
 title: 'The overdrawn months',
 brief: 'A small business expects its bank balance to dip and recover, and the owner wants to know when and how far.',
 labels: ['first x with balance 0', 'second x with balance 0', 'x of the lowest balance', 'lowest balance y'], tolerance: 0.001
}, {
 canonical: { r: 3, d: 6 },
 draw: R => rootsDraw(R, 1, 8, [2, 4, 6, 8]),
 build: ({ r, d }) => { const s = r + d, b = r + s, c = r * s, h = b / 2, k = h * h - b * h + c, depth = -k; return {
  prompt: `A small business plans its bank balance for the next 18 months. The plan follows y = x² − ${n(b)}x + ${n(c)}, where x is the number of months since the plan began and y is the balance in hundreds of dollars. A negative y means the account is overdrawn. Enter the two values of x at which the balance is exactly 0, smaller first. Then enter the x at which the balance is lowest, and the balance y at that moment.`,
  answer: [r, s, h, k],
  hints: [`Set y = 0 and factor: find two numbers that multiply to ${n(c)} and add to −${n(b)}. Both of them are negative.`, `The lowest balance is at the vertex, halfway between the two roots. Put its x into the rule to get its y.`],
  solution: `x² − ${n(b)}x + ${n(c)} = (x − ${n(r)})(x − ${n(s)}), because (−${n(r)}) × (−${n(s)}) = ${n(c)} and (−${n(r)}) + (−${n(s)}) = −${n(b)}. A product is 0 only when one factor is 0, so the balance is 0 at x = ${n(r)} and at x = ${n(s)}. The vertex is halfway: x = (${n(r)} + ${n(s)}) ÷ 2 = ${n(h)}. There y = ${n(h)}² − ${n(b)} × ${n(h)} + ${n(c)} = ${n(h * h)} − ${n(b * h)} + ${n(c)} = ${n(k)}. The lowest balance comes ${n(h)} months in, when the account is ${n(depth)} hundred dollars overdrawn.`,
  guidance: [
   { prompt: `x² − ${n(b)}x + ${n(c)} = (x − ${n(r)})(x − ${n(s)}). At which two x values is the balance 0? Enter the smaller first.`, answer: [r, s], labels: ['first x', 'second x'], explanation: `x − ${n(r)} is 0 at x = ${n(r)} and x − ${n(s)} is 0 at x = ${n(s)}. Between those months the account is overdrawn.` },
   { prompt: `The lowest balance is halfway between x = ${n(r)} and x = ${n(s)}. What is that x?`, answer: [h], labels: ['x of the lowest balance'], explanation: `(${n(r)} + ${n(s)}) ÷ 2 = ${n(h)}.` },
   { prompt: `Put x = ${n(h)} into y = x² − ${n(b)}x + ${n(c)}. What is y?`, answer: [k], labels: ['lowest balance y'], explanation: `${n(h * h)} − ${n(b * h)} + ${n(c)} = ${n(k)}: the account is ${n(depth)} hundred dollars overdrawn.` }
  ] }; }
});

/* The same curve read as a trail: how long it stays below 0 (s − r), where its lowest point is, and how deep (a positive number). */
make({
 id: 'q34c', parent: 'q34', kind: 'applied',
 title: 'The trail through the gorge',
 brief: 'A walking trail drops into a gorge and climbs out again, and the guidebook needs the length and depth of the dip.',
 labels: ['km below bridge level', 'x of the lowest point (km)', 'depth below bridge level (m)'], tolerance: 0.001
}, {
 canonical: { r: 4, d: 6 },
 draw: R => rootsDraw(R, 1, 8, [2, 4, 6, 8]),
 build: ({ r, d }) => { const s = r + d, b = r + s, c = r * s, h = b / 2, k = h * h - b * h + c, depth = -k; return {
  prompt: `A walking trail starts on a ridge, drops into a gorge and climbs out again. Its height follows y = x² − ${n(b)}x + ${n(c)}, where x is the distance walked in kilometres and y is the height in metres above the level of a road bridge. A negative y means the trail is below the bridge. Enter for how many kilometres the trail stays below bridge level. Then enter the x of the trail’s lowest point. Last, enter how many metres below bridge level that point is, as a positive number.`,
  answer: [d, h, depth],
  hints: [`The trail is at bridge level where y = 0. Factor x² − ${n(b)}x + ${n(c)} to find those two x values. The trail is below the bridge between them.`, `The lowest point is the vertex, halfway between the two roots. Put its x into the rule: the y you get is negative, and its size is the depth.`],
  solution: `x² − ${n(b)}x + ${n(c)} = (x − ${n(r)})(x − ${n(s)}), because (−${n(r)}) × (−${n(s)}) = ${n(c)} and (−${n(r)}) + (−${n(s)}) = −${n(b)}. So y = 0 at x = ${n(r)} and at x = ${n(s)}, and the trail is below the bridge for ${n(s)} − ${n(r)} = ${n(d)} km. The vertex is halfway: x = (${n(r)} + ${n(s)}) ÷ 2 = ${n(h)}. There y = ${n(h)}² − ${n(b)} × ${n(h)} + ${n(c)} = ${n(h * h)} − ${n(b * h)} + ${n(c)} = ${n(k)}, so the lowest point is ${n(depth)} m below bridge level.`,
  guidance: [
   { prompt: `Factor x² − ${n(b)}x + ${n(c)}: two negative numbers multiply to ${n(c)} and add to −${n(b)}. At which two x values is y = 0? Enter the smaller first.`, answer: [r, s], labels: ['first root x', 'second root x'], explanation: `(−${n(r)}) × (−${n(s)}) = ${n(c)} and (−${n(r)}) + (−${n(s)}) = −${n(b)}, so y = (x − ${n(r)})(x − ${n(s)}), which is 0 at x = ${n(r)} and at x = ${n(s)}.` },
   { prompt: `The trail is below the bridge from x = ${n(r)} to x = ${n(s)}. Enter how many kilometres that is, then the x halfway between the two roots.`, answer: [d, h], labels: ['km below bridge level', 'x of the lowest point (km)'], explanation: `${n(s)} − ${n(r)} = ${n(d)} km, and (${n(r)} + ${n(s)}) ÷ 2 = ${n(h)}.` },
   { prompt: `Put x = ${n(h)} into y = x² − ${n(b)}x + ${n(c)}. The result is negative. How many metres below bridge level is the lowest point? Enter a positive number.`, answer: [depth], labels: ['depth below bridge level (m)'], explanation: `${n(h * h)} − ${n(b * h)} + ${n(c)} = ${n(k)}, so the lowest point is ${n(depth)} m below bridge level.` }
  ] }; }
});

/* Backwards: the roots are given, the curve (x − r)(x − s) is multiplied out (q32), then the vertex. */
make({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q32',
 title: 'Designing the skate bowl',
 brief: 'A skate park bowl must meet the ground at two marked points, and the builders need its curve and its depth.',
 labels: ['first number (no minus sign)', 'second number', 'vertex x', 'vertex y'], tolerance: 0.001
}, {
 canonical: { r: 4, d: 8 },
 draw: R => rootsDraw(R, 2, 8, [2, 4, 6, 8]),
 build: ({ r, d }) => { const s = r + d, b = r + s, c = r * s, h = b / 2, k = h * h - b * h + c, depth = -k; return {
  prompt: `A skate park bowl is being designed. Its cross-section must meet ground level at x = ${n(r)} and at x = ${n(s)}, so the designer uses the curve y = (x − ${n(r)})(x − ${n(s)}). Here x is measured in metres along the ground, and y in decimetres (dm, tenths of a metre) above ground level. Multiply out the brackets and write the curve as y = x² − (number)x + (number); enter those two numbers. The minus sign is already written, so enter the first number without it. Then enter the x and the y of the bowl’s deepest point, the vertex.`,
  answer: [b, c, h, k],
  hints: [`Multiply each part of the first bracket by each part of the second. A negative times a negative is positive, so (−${n(r)}) × (−${n(s)}) is a positive number. The pattern already has the minus sign in front of the x term, so enter that number as a positive number.`, `You do not need to factor: the brackets already show the two roots. The vertex is halfway between them, and its y comes from putting that x into the rule.`],
  solution: `(x − ${n(r)})(x − ${n(s)}) = x² − ${n(s)}x − ${n(r)}x + (−${n(r)}) × (−${n(s)}) = x² − ${n(b)}x + ${n(c)}. The roots are x = ${n(r)} and x = ${n(s)}, so the vertex is halfway: x = (${n(r)} + ${n(s)}) ÷ 2 = ${n(h)}. There y = ${n(h)}² − ${n(b)} × ${n(h)} + ${n(c)} = ${n(h * h)} − ${n(b * h)} + ${n(c)} = ${n(k)}, so the bowl is ${n(depth)} dm deep at its middle.`,
  guidance: [
   { prompt: `Multiply out (x − ${n(r)})(x − ${n(s)}): the four pieces are x², −${n(s)}x, −${n(r)}x and (−${n(r)}) × (−${n(s)}). Write the result as x² − (number)x + (number) and enter the two numbers. The minus sign is already written, so enter the first number without it.`, answer: [b, c], labels: ['first number (no minus sign)', 'second number'], explanation: `−${n(s)}x − ${n(r)}x = −${n(b)}x, and (−${n(r)}) × (−${n(s)}) = ${n(c)}, so y = x² − ${n(b)}x + ${n(c)}.` },
   { prompt: `The curve is 0 at x = ${n(r)} and at x = ${n(s)}. The vertex sits halfway between them. What is its x?`, answer: [h], labels: ['vertex x'], explanation: `(${n(r)} + ${n(s)}) ÷ 2 = ${n(h)}.` },
   { prompt: `Put x = ${n(h)} into y = x² − ${n(b)}x + ${n(c)}. What is y?`, answer: [k], labels: ['vertex y'], explanation: `${n(h * h)} − ${n(b * h)} + ${n(c)} = ${n(k)}. The bowl is ${n(depth)} dm deep at its middle.` }
  ] }; }
});

/* ---- q35 Rational expressions ---- */
/* The other bracket's number c for a bottom of x + a: never a itself, and never a division q35 already works
   (its mission: a = 2, c = 3; its example: a = 3, c = 4). */
const otherDraw = (R, a) => R.except(1, 9, a === 2 ? [2, 3] : a === 3 ? [3, 4] : [a]);
/* (x² + (a + c)x + ac) ÷ (x + a) = x + c: a shared cost, with x = −a ruled out. */
make({
 id: 'q35b', parent: 'q35', kind: 'setting',
 title: 'Sharing the coach fare',
 brief: 'A walking club hires a coach, and the treasurer wants one short rule for what each person pays.',
 labels: ['number after x', 'each pays (dollars)', 'x not allowed'], tolerance: 0.001
}, {
 canonical: { a: 4, c: 5, x0: 20 },
 draw: R => { const a = R.int(2, 6); return { a, c: otherDraw(R, a), x0: R.pick([10, 20, 30]) }; },
 build: ({ a, c, x0 }) => { const b = a + c, ac = a * c, top = x0 * x0 + b * x0 + ac, bottom = x0 + a, v = x0 + c, P = `x² + ${n(b)}x + ${n(ac)}`; return {
  prompt: `A walking club hires a coach for a day out. The total cost in dollars is ${P}, where x is the number of members who come. The club also brings ${n(a)} guests, so x + ${n(a)} people share the cost equally. Each person pays (${P}) ÷ (x + ${n(a)}) dollars. Simplify this to x + (a number) and enter that number. Then enter what each person pays, in dollars, when x = ${n(x0)}. Last, enter the one value of x for which this rule would mean dividing by 0.`,
  answer: [c, v, -a],
  hints: [`Factor the top: find two numbers that multiply to ${n(ac)} and add to ${n(b)}. One of them is ${n(a)}, because x + ${n(a)} must be one of the brackets.`, `Dividing by 0 has no meaning. Which x makes x + ${n(a)} equal to 0? It is a negative number.`],
  solution: `(${P}) ÷ (x + ${n(a)}) = (x + ${n(a)})(x + ${n(c)}) ÷ (x + ${n(a)}) = x + ${n(c)}, after cancelling the shared factor x + ${n(a)}. When x = ${n(x0)} each person pays ${n(x0)} + ${n(c)} = ${n(v)} dollars. Check: (${n(x0 * x0)} + ${n(b * x0)} + ${n(ac)}) ÷ (${n(x0)} + ${n(a)}) = ${n(top)} ÷ ${n(bottom)} = ${n(v)}. The bottom is 0 when x = −${n(a)}, so x = −${n(a)} is not allowed.`,
  guidance: [
   { prompt: `${P} = (x + ${n(a)})(x + ?). Which number goes in place of the question mark?`, answer: [c], labels: ['number after x'], explanation: `${n(a)} × ${n(c)} = ${n(ac)} and ${n(a)} + ${n(c)} = ${n(b)}, so the top is (x + ${n(a)})(x + ${n(c)}) and each person pays x + ${n(c)} dollars.` },
   { prompt: `Each person pays x + ${n(c)} dollars. How much is that when x = ${n(x0)}?`, answer: [v], labels: ['each pays (dollars)'], explanation: `${n(x0)} + ${n(c)} = ${n(v)} dollars, the same as ${n(top)} ÷ ${n(bottom)}.` },
   { prompt: `For which x is the bottom, x + ${n(a)}, equal to 0?`, answer: [-a], labels: ['x not allowed'], explanation: `−${n(a)} + ${n(a)} = 0, so x = −${n(a)} would mean dividing by 0. It is not allowed.` }
  ] }; }
});

/* The same cancelling, then three values at x = x0: the bottom (rolls), the simplified form (grams each) and the top (batch). */
make({
 id: 'q35c', parent: 'q35', kind: 'applied',
 title: 'Dough for the bread rolls',
 brief: 'A bakery sets one number each morning, and the batch weight, the roll count and the roll size all follow from it.',
 labels: ['number after x', 'rolls', 'weight of one roll (g)', 'weight of the batch (g)'], tolerance: 0.001
}, {
 canonical: { a: 6, c: 5, x0: 50 },
 draw: R => { const a = R.int(2, 9); return { a, c: otherDraw(R, a), x0: R.pick([40, 50, 60]) }; },
 build: ({ a, c, x0 }) => { const b = a + c, ac = a * c, top = x0 * x0 + b * x0 + ac, rolls = x0 + a, v = x0 + c, P = `x² + ${n(b)}x + ${n(ac)}`; return {
  prompt: `A bakery makes a batch of dough that weighs ${P} grams, where x is a number the baker sets each morning. The dough is cut into x + ${n(a)} rolls of equal weight, so one roll weighs (${P}) ÷ (x + ${n(a)}) grams. Simplify this to x + (a number) and enter that number. Today x = ${n(x0)}. Enter how many rolls are made, then the weight of one roll in grams, then the weight of the whole batch in grams. Type each number without commas.`,
  answer: [c, rolls, v, top],
  hints: [`Factor the top: find two numbers that multiply to ${n(ac)} and add to ${n(b)}. One of them is ${n(a)}, because x + ${n(a)} must be one of the brackets.`, `Put ${n(x0)} in place of x: in the number of rolls, in your simplified weight, and in the batch formula.`],
  solution: `(${P}) ÷ (x + ${n(a)}) = (x + ${n(a)})(x + ${n(c)}) ÷ (x + ${n(a)}) = x + ${n(c)}, after cancelling the shared factor x + ${n(a)}. When x = ${n(x0)} there are ${n(x0)} + ${n(a)} = ${n(rolls)} rolls, and each weighs ${n(x0)} + ${n(c)} = ${n(v)} g. The batch weighs ${n(x0 * x0)} + ${n(b * x0)} + ${n(ac)} = ${n(top)} g. Check: ${n(rolls)} × ${n(v)} = ${n(top)}.`,
  guidance: [
   { prompt: `${P} = (x + ${n(a)})(x + ?). Which number goes in place of the question mark?`, answer: [c], labels: ['number after x'], explanation: `${n(a)} × ${n(c)} = ${n(ac)} and ${n(a)} + ${n(c)} = ${n(b)}, so the top is (x + ${n(a)})(x + ${n(c)}) and one roll weighs x + ${n(c)} grams.` },
   { prompt: `There are x + ${n(a)} rolls and each weighs x + ${n(c)} grams. When x = ${n(x0)}, enter the number of rolls, then the weight of one roll.`, answer: [rolls, v], labels: ['rolls', 'weight of one roll (g)'], explanation: `${n(x0)} + ${n(a)} = ${n(rolls)} rolls and ${n(x0)} + ${n(c)} = ${n(v)} g each.` },
   { prompt: `Put x = ${n(x0)} into the batch formula ${P}. What does the batch weigh in grams?`, answer: [top], labels: ['weight of the batch (g)'], explanation: `${n(x0 * x0)} + ${n(b * x0)} + ${n(ac)} = ${n(top)} g, and ${n(rolls)} rolls of ${n(v)} g make ${n(top)} g too.` }
  ] }; }
});

/* Minus signs (q34): (x² − (r + s)x + rs) ÷ (x − r) = x − s, and the ruled-out x is +r. */
make({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q34',
 title: 'Pay for each hour worked',
 brief: 'A week’s pay is set by a formula with minus signs in it, and the worker wants to know the pay for one hour.',
 labels: ['number taken from x', 'pay for one hour (dollars)', 'x not allowed'], tolerance: 0.001
}, {
 canonical: { r: 4, s: 7, x0: 30 },
 draw: R => { const r = R.int(2, 6); return { r, s: R.except(2, 9, r === 2 ? [2, 6, 8] : r === 3 ? [3, 7] : r === 6 ? [6, 2] : [r]), x0: R.pick([20, 30, 40]) }; },
 build: ({ r, s, x0 }) => { const b = r + s, c = r * s, top = x0 * x0 - b * x0 + c, bottom = x0 - r, v = x0 - s, P = `x² − ${n(b)}x + ${n(c)}`; return {
  prompt: `An agency sets a week’s pay with a formula. For a week with x hours on the rota, the total pay in dollars is ${P}. Breaks are not paid, so the pay covers x − ${n(r)} hours of work. The pay for one hour of work is (${P}) ÷ (x − ${n(r)}) dollars. Simplify this to x − (a number) and enter that number. Then enter the pay for one hour of work, in dollars, when x = ${n(x0)}. Last, enter the one value of x for which you would be dividing by 0.`,
  answer: [s, v, r],
  hints: [`Factor the top as you did for a parabola: find two negative numbers that multiply to ${n(c)} and add to −${n(b)}. One of them is −${n(r)}, because x − ${n(r)} must be one of the brackets.`, `Which x makes x − ${n(r)} equal to 0? Take care with its sign.`],
  solution: `${P} = (x − ${n(r)})(x − ${n(s)}), because (−${n(r)}) × (−${n(s)}) = ${n(c)} and (−${n(r)}) + (−${n(s)}) = −${n(b)}. So (${P}) ÷ (x − ${n(r)}) = x − ${n(s)}, after cancelling the shared factor x − ${n(r)}. When x = ${n(x0)} the pay is ${n(x0)} − ${n(s)} = ${n(v)} dollars for one hour. Check: (${n(x0 * x0)} − ${n(b * x0)} + ${n(c)}) ÷ (${n(x0)} − ${n(r)}) = ${n(top)} ÷ ${n(bottom)} = ${n(v)}. The bottom is 0 when x = ${n(r)}, so x = ${n(r)} is not allowed.`,
  guidance: [
   { prompt: `${P} = (x − ${n(r)})(x − ?). Which number goes in place of the question mark?`, answer: [s], labels: ['number taken from x'], explanation: `(−${n(r)}) × (−${n(s)}) = ${n(c)} and (−${n(r)}) + (−${n(s)}) = −${n(b)}, so the top is (x − ${n(r)})(x − ${n(s)}) and the pay for one hour is x − ${n(s)} dollars.` },
   { prompt: `The pay for one hour is x − ${n(s)} dollars. How much is that when x = ${n(x0)}?`, answer: [v], labels: ['pay for one hour (dollars)'], explanation: `${n(x0)} − ${n(s)} = ${n(v)} dollars, the same as ${n(top)} ÷ ${n(bottom)}.` },
   { prompt: `For which x is the bottom, x − ${n(r)}, equal to 0?`, answer: [r], labels: ['x not allowed'], explanation: `${n(r)} − ${n(r)} = 0, so x = ${n(r)} would mean dividing by 0. It is not allowed. Note the sign: it is ${n(r)}, not −${n(r)}.` }
  ] }; }
});
})();
