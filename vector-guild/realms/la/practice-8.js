/* Linear algebra practice missions, file 8 of 14: concepts q36–q40, three practice missions each
   (q36b q36c q36d ... q40b q40c q40d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p8.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- add missions for q36–q40 below this line ---- */

/* Helpers for this file. */
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
/* "2³", and plain "2" for a first power. */
const pw = (b, e) => e === 1 ? n(b) : n(b) + sup(e);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* "(1, 2), (1, 3) and (2, 3)": a list of node pairs in words. */
const pairs = edges => { const t = edges.map(e => vec(e)); return t.length > 1 ? t.slice(0, -1).join(', ') + ' and ' + t[t.length - 1] : t[0]; };
/* Degree of every node 1..N for a list of undirected edges. */
const degrees = (N, edges) => { const d = Array(N).fill(0); edges.forEach(([i, j]) => { d[i - 1]++; d[j - 1]++; }); return d; };
/* Group label of every node 1..N (nodes joined by edges share a label); labels are the smallest node of the group. */
const groups = (N, edges) => { const g = Array.from({ length: N }, (_, i) => i + 1); let moved = true;
 while (moved) { moved = false; edges.forEach(([i, j]) => { const m = Math.min(g[i - 1], g[j - 1]); if (g[i - 1] !== m || g[j - 1] !== m) { g[i - 1] = g[j - 1] = m; moved = true; } }); }
 return g; };

/* ---- q36 Jordan chains (taught: J=λI+N with N²=0, so Jⁿ=λⁿI+nλⁿ⁻¹N; the pitfall is to raise each entry to the power). ---- */
practice({ id: 'q36b', parent: 'q36', kind: 'setting',
 title: 'Zoom and slant, pressed again',
 brief: 'A drawing program repeats one zoom-and-slant step, and the artist wants the single matrix that does it all at once.',
 labels: ['entry 11', 'entry 12', 'entry 21', 'entry 22'], tolerance: 0.01 },
 [['entry 11'], ['entry 12'], ['entry 21', 'entry 22']], {
 canonical: { lam: 2, k: 4 },
 /* Not the parent's (2,3) or its worked example (3,2). lam ≠ k, so the two different entries never share a value. */
 draw: R => { let lam, k; do { lam = R.int(2, 5); k = R.int(2, 5); } while (lam === k || Math.pow(lam, k) > 700 || (lam === 2 && k === 3) || (lam === 3 && k === 2)); return { lam, k }; },
 build: ({ lam, k }) => { const d = Math.pow(lam, k), o = k * Math.pow(lam, k - 1); return {
  prompt: `A drawing program has a "zoom and slant" step. One press multiplies every point of the picture by J=${mat([[lam, 1], [0, lam]])}: it zooms by ${n(lam)} and slants the picture sideways. The artist presses it ${n(k)} times in a row, which multiplies every point by J${sup(k)}. Enter the four entries of J${sup(k)} row by row: the top row first, then the bottom row.`,
  answer: [d, o, 0, d],
  hints: ['Split J into λI+N with N=[[0,1],[0,0]]. Because N²=0, the power is Jⁿ=λⁿI+nλⁿ⁻¹N.', `The top right entry does not stay at 1. It is n·λⁿ⁻¹, here ${n(k)}·${pw(lam, k - 1)}.`],
  solution: `Here λ=${n(lam)} and n=${n(k)}. λⁿ=${n(lam)}${sup(k)}=${n(d)} goes on the diagonal. nλⁿ⁻¹=${n(k)}·${pw(lam, k - 1)}${k > 2 ? `=${n(k)}·${n(Math.pow(lam, k - 1))}` : ''}=${n(o)} goes top right. J${sup(k)}=${mat([[d, o], [0, d]])}: after ${n(k)} presses the zoom is ${n(d)} and the slant has grown to ${n(o)}.`,
  guidance: [
   { prompt: `Every press multiplies the zoom by ${n(lam)}. What is λⁿ=${n(lam)}${sup(k)}, the top left entry?`, answer: [d], explanation: `${n(lam)}${sup(k)}=${n(d)}. It multiplies the identity I, so it sits on both diagonal places.` },
   { prompt: `The slant entry is nλⁿ⁻¹=${n(k)}·${pw(lam, k - 1)}. What is it?`, answer: [o], explanation: `${k > 2 ? `${pw(lam, k - 1)}=${n(Math.pow(lam, k - 1))}, and ` : ''}${n(k)}·${n(Math.pow(lam, k - 1))}=${n(o)}. This number multiplies N, which has its only 1 in the top right place.` },
   { prompt: 'Now the bottom row. Enter its left entry, then its right entry.', answer: [0, d], explanation: `Neither I nor N has anything in the bottom left place, so it stays 0. The bottom right entry is λⁿ=${n(d)} again.` }
  ] }; }
});

practice({ id: 'q36c', parent: 'q36', kind: 'applied',
 title: 'The two-stage pump log',
 brief: 'A two-stage pump has run for several cycles, and the log needs the pressure in each stage now.',
 labels: ['stage 1 pressure', 'stage 2 pressure'], tolerance: 0.01 },
 [['diagonal entry', 'top right entry'], ['stage 1 pressure'], ['stage 2 pressure']], {
 canonical: { lam: 2, k: 5, x: [3, 2] },
 /* b ≥ 1, so raising each entry of J to the power (top right stays 1) always gives a wrong stage 1.
    Never the parent's (2,3) or its worked example (3,2): the player has those two powers already. */
 draw: R => { const [lam, k] = R.pick([[2, 4], [2, 5], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2]]); return { lam, k, x: [R.int(1, 5), R.int(1, 4)] }; },
 build: ({ lam, k, x }) => { const d = Math.pow(lam, k), o = k * Math.pow(lam, k - 1), [a, b] = x, y1 = d * a + o * b, y2 = d * b; return {
  prompt: `A two-stage pump runs in cycles. In each cycle the pressure in stage 2 is multiplied by ${n(lam)}. The pressure in stage 1 is multiplied by ${n(lam)} as well, and the old stage 2 pressure is added to it. So one cycle multiplies the state (stage 1, stage 2) by J=${mat([[lam, 1], [0, lam]])}. The pump starts at ${vec(x)} bar (a unit of pressure). Enter the pressures after ${n(k)} cycles: stage 1, then stage 2.`,
  answer: [y1, y2],
  hints: [`${n(k)} cycles multiply the start state by J${sup(k)}. Find J${sup(k)} first, with Jⁿ=λⁿI+nλⁿ⁻¹N.`, `Then multiply J${sup(k)} by the start state. Each answer is one row of J${sup(k)} times ${vec(x)}, entry by entry, added up.`],
  solution: `λ=${n(lam)} and n=${n(k)}: λⁿ=${n(d)} and nλⁿ⁻¹=${n(k)}·${n(Math.pow(lam, k - 1))}=${n(o)}, so J${sup(k)}=${mat([[d, o], [0, d]])}. Stage 1: ${n(d)}·${n(a)}+${n(o)}·${n(b)}=${n(d * a)}+${n(o * b)}=${n(y1)} bar. Stage 2: 0·${n(a)}+${n(d)}·${n(b)}=${n(y2)} bar.`,
  guidance: [
   { prompt: `Find J${sup(k)}. Enter its diagonal entry λⁿ=${n(lam)}${sup(k)}, then its top right entry nλⁿ⁻¹=${n(k)}·${pw(lam, k - 1)}.`, answer: [d, o], explanation: `${n(lam)}${sup(k)}=${n(d)} and ${n(k)}·${n(Math.pow(lam, k - 1))}=${n(o)}, so J${sup(k)}=${mat([[d, o], [0, d]])}.` },
   { prompt: `Multiply the top row (${n(d)}, ${n(o)}) by the start state ${vec(x)}. What is the stage 1 pressure?`, answer: [y1], explanation: `${n(d)}·${n(a)}+${n(o)}·${n(b)}=${n(d * a)}+${n(o * b)}=${n(y1)} bar. The second part is what stage 2 has fed into stage 1 over the ${n(k)} cycles.` },
   { prompt: `Multiply the bottom row (0, ${n(d)}) by the start state ${vec(x)}. What is the stage 2 pressure?`, answer: [y2], explanation: `0·${n(a)}+${n(d)}·${n(b)}=${n(y2)} bar. Stage 2 is only ever multiplied by ${n(lam)}.` }
  ] }; }
});

practice({ id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q11',
 title: 'Winding the drift back',
 brief: 'A drifting sensor was logged only at the end of a run, and the lab needs the state it started from.',
 labels: ['start, first number', 'start, second number'], tolerance: 0.01 },
 [['diagonal entry', 'top right entry'], ['start, second number'], ['start, first number']], {
 canonical: { lam: 4, k: 2, y: [32, -32] },
 /* The parameters hold the end state the prompt prints. draw() makes it by running a whole start state forward one
    hour at a time; build() solves back with the power formula. Never the parent's (2,3) or its worked example (3,2). */
 draw: R => { const [lam, k] = R.pick([[2, 2], [2, 4], [2, 5], [3, 3], [4, 2], [5, 2]]); let y = [R.nz(-4, 5), R.nz(-3, 4)];
  for (let hour = 0; hour < k; hour++) y = [lam * y[0] + y[1], lam * y[1]]; return { lam, k, y }; },
 build: ({ lam, k, y }) => { const d = Math.pow(lam, k), o = k * Math.pow(lam, k - 1), [y1, y2] = y, b = y2 / d, a = (y1 - o * b) / d, x = [a, b]; return {
  prompt: `The Dynamics Lab models a drifting sensor with a state of two numbers. Every hour the state is multiplied by J=${mat([[lam, 1], [0, lam]])}. After ${n(k)} hours the state reads ${vec([y1, y2])}. Enter the state at the start: its first number, then its second number.`,
  answer: [a, b],
  hints: [`Work out J${sup(k)} with Jⁿ=λⁿI+nλⁿ⁻¹N. Then J${sup(k)} times the unknown start (x₁, x₂) must equal ${vec([y1, y2])}. That is two equations.`, 'The bottom row of the power has a 0 in it, so its equation holds only x₂. Solve that one first, then put x₂ into the top equation.'],
  solution: `λⁿ=${n(lam)}${sup(k)}=${n(d)} and nλⁿ⁻¹=${n(k)}·${n(Math.pow(lam, k - 1))}=${n(o)}, so J${sup(k)}=${mat([[d, o], [0, d]])}. The two rows give ${n(d)}x₁+${n(o)}x₂=${n(y1)} and ${n(d)}x₂=${n(y2)}. From the second, x₂=${n(y2)}/${n(d)}=${n(b)}. Then ${n(d)}x₁=${n(y1)}−${n(o)}·${par(b)}=${n(y1 - o * b)}, so x₁=${n(a)}. The start was ${vec(x)}.`,
  guidance: [
   { prompt: `Find J${sup(k)}. Enter its diagonal entry λⁿ=${n(lam)}${sup(k)}, then its top right entry nλⁿ⁻¹=${n(k)}·${pw(lam, k - 1)}.`, answer: [d, o], explanation: `${n(lam)}${sup(k)}=${n(d)} and ${n(k)}·${n(Math.pow(lam, k - 1))}=${n(o)}, so J${sup(k)}=${mat([[d, o], [0, d]])}.` },
   { prompt: `The bottom row says ${n(d)}x₂=${n(y2)}. What is x₂, the second number of the start?`, answer: [b], explanation: `x₂=${n(y2)}/${n(d)}=${n(b)}.` },
   { prompt: `The top row says ${n(d)}x₁+${n(o)}x₂=${n(y1)}. Put in x₂=${n(b)}. What is x₁?`, answer: [a], explanation: `${n(o)}·${par(b)}=${n(o * b)}, so ${n(d)}x₁=${n(y1)}−${par(o * b)}=${n(y1 - o * b)} and x₁=${n(a)}.` }
  ] }; }
});

/* ---- q37 Kronecker products (taught: A⊗B replaces each entry aᵢⱼ by the block aᵢⱼB; sizes multiply; eigenvalues multiply.
        Pitfalls: B⊗A is a different order; an entry of A scales a whole block). ---- */
practice({ id: 'q37b', parent: 'q37', kind: 'setting',
 title: 'Tiling a tiny picture',
 brief: 'A tiny picture is being enlarged by putting a patterned tile in place of each pixel, and one row of the result must be checked.',
 labels: ['entry 1', 'entry 2', 'entry 3', 'entry 4'], tolerance: 0.01 },
 [['row of blocks', 'row of the tile'], ['entry 1', 'entry 2'], ['entry 3', 'entry 4']], {
 canonical: { A: [[2, 5], [3, 4]], B: [[1, 2], [3, 1]], row: 3 },
 /* Entries of A are at least 2 (no block "1B"). The asked row is 2, 3 or 4. The same row of B⊗A, the wrong order,
    is never the right row, and the two rows of the tile differ, so picking the other tile row is wrong too. */
 draw: R => { let p, ok; do { p = { A: [[R.int(2, 6), R.int(2, 6)], [R.int(2, 6), R.int(2, 6)]], B: [[R.int(1, 4), R.int(1, 4)], [R.int(1, 4), R.int(1, 4)]], row: R.int(2, 4) };
   const bi = Math.ceil(p.row / 2), ti = p.row - 2 * (bi - 1), [l, r] = p.A[bi - 1], [u, v] = p.B[ti - 1], right = [l * u, l * v, r * u, r * v];
   const [x, y] = p.B[bi - 1], [s, t] = p.A[ti - 1], wrong = [x * s, x * t, y * s, y * t];
   ok = l !== r && u !== v && p.A[0][0] !== p.A[1][0] && right.some((w, i) => w !== wrong[i]) && (p.B[0][0] !== p.B[1][0] || p.B[0][1] !== p.B[1][1]); } while (!ok); return p; },
 build: ({ A, B, row }) => { const [[a, b], [c, d]] = A, bi = Math.ceil(row / 2), ti = row - 2 * (bi - 1), [l, r] = A[bi - 1], tile = B[ti - 1], [e, f] = tile, out = [l * e, l * f, r * e, r * f];
  const where = bi === 1 ? 'top' : 'lower', ord = ti === 1 ? 'first' : 'second'; return {
  prompt: `A tiny picture has 2×2 pixels with brightness A=${mat(A)}. To enlarge it, each pixel is replaced by the 2×2 tile B=${mat(B)} multiplied by that pixel's brightness. The enlarged picture is the Kronecker product A⊗B. Enter row ${n(row)} of the enlarged picture, from left to right.`,
  answer: out,
  hints: [`A⊗B is made of four blocks: ${n(a)}B and ${n(b)}B on top, ${n(c)}B and ${n(d)}B below. Each block is 2 rows tall.`, `Rows 1 and 2 run through the top blocks, rows 3 and 4 through the lower blocks. Find which row of the tile B belongs to row ${n(row)}. Then write the left block's part, followed by the right block's part.`],
  solution: `The blocks are ${n(a)}B, ${n(b)}B on top and ${n(c)}B, ${n(d)}B below. Rows 1 and 2 belong to the top blocks and rows 3 and 4 to the lower blocks, so row ${n(row)} is the ${ord} row of the ${where} blocks, ${n(l)}B and ${n(r)}B. The ${ord} row of B is ${vec(tile)}. ${n(l)}·${vec(tile)}=${vec([l * e, l * f])} and ${n(r)}·${vec(tile)}=${vec([r * e, r * f])}, so row ${n(row)} is ${vec(out)}.`,
  guidance: [
   { prompt: `Each block of A⊗B is 2 rows tall. Which row of blocks does row ${n(row)} of the enlarged picture run through (enter 1 for the top blocks, 2 for the lower blocks)? Then which row of the tile B does it use (1 or 2)?`, answer: [bi, ti], explanation: `Rows 1 and 2 are in the top blocks and rows 3 and 4 in the lower blocks. Row ${n(row)} is the ${ord} row of the ${where} blocks, so it uses the ${ord} row of B, ${vec(tile)}.` },
   { prompt: `Row ${n(row)} starts inside the ${where} left block, ${n(l)}B. Multiply the ${ord} row of B, ${vec(tile)}, by ${n(l)}. Enter the two numbers.`, answer: [l * e, l * f], explanation: `${n(l)}·${n(e)}=${n(l * e)} and ${n(l)}·${n(f)}=${n(l * f)}. The pixel with brightness ${n(l)} scales a whole copy of the tile.` },
   { prompt: `Row ${n(row)} ends inside the ${where} right block, ${n(r)}B. Multiply the ${ord} row of B, ${vec(tile)}, by ${n(r)}. Enter the two numbers.`, answer: [r * e, r * f], explanation: `${n(r)}·${n(e)}=${n(r * e)} and ${n(r)}·${n(f)}=${n(r * f)}. Row ${n(row)} is ${vec(out)}.` }
  ] }; }
});

practice({ id: 'q37c', parent: 'q37', kind: 'applied',
 title: 'One pixel on the video wall',
 brief: 'A wall of screens all show one test pattern at different brightness, and a technician asks about a single pixel.',
 labels: ['pixel rows', 'pixel columns', 'pixel value'], tolerance: 0.01 },
 [['pixel rows', 'pixel columns'], ['screen row', 'screen column'], ['pixel value']], {
 canonical: { A: [[2, 5, 3], [4, 6, 2]], B: [[1, 3], [2, 5]], r: 3, s: 4 },
 /* A is 2×3 or 3×2, B is 2×2. The pixel is never in the first screen, and reading the wall as B⊗A gives another value. */
 draw: R => { let p, ok; do { const tall = R.bool(), m = tall ? 3 : 2, c = tall ? 2 : 3;
   p = { A: Array.from({ length: m }, () => Array.from({ length: c }, () => R.int(2, 6))), B: [[R.int(1, 5), R.int(1, 5)], [R.int(1, 5), R.int(1, 5)]], r: R.int(1, 2 * m), s: R.int(1, 2 * c) };
   const i = Math.ceil(p.r / 2), j = Math.ceil(p.s / 2), val = p.A[i - 1][j - 1] * p.B[p.r - 2 * (i - 1) - 1][p.s - 2 * (j - 1) - 1];
   const i2 = Math.ceil(p.r / m), j2 = Math.ceil(p.s / c), wrong = p.B[i2 - 1][j2 - 1] * p.A[p.r - m * (i2 - 1) - 1][p.s - c * (j2 - 1) - 1];
   ok = !(i === 1 && j === 1) && val !== wrong && new Set(p.B.flat()).size >= 3; } while (!ok); return p; },
 build: ({ A, B, r, s }) => { const m = A.length, c = A[0].length, i = Math.ceil(r / 2), j = Math.ceil(s / 2), k = r - 2 * (i - 1), l = s - 2 * (j - 1), f = A[i - 1][j - 1], t = B[k - 1][l - 1], val = f * t; return {
  prompt: `A video wall is ${n(m)} screens high and ${n(c)} screens wide. The matrix A gives the brightness factor of each screen, laid out like the wall: A=${mat(A)}. Every screen shows the same 2×2 test pattern B=${mat(B)}, multiplied by its factor. Pixel by pixel, the whole wall is the Kronecker product A⊗B. Enter the number of pixel rows of the wall, then the number of pixel columns, then the value of the pixel in row ${n(r)}, column ${n(s)} of the wall.`,
  answer: [2 * m, 2 * c, val],
  hints: ['Sizes multiply. Each screen is 2 pixels high and 2 pixels wide, so count 2 pixel rows for every screen row and 2 pixel columns for every screen column.', 'Find the screen first: pixel rows come in pairs, one pair for each screen row, and pixel columns likewise. Then find the place inside that screen, and multiply the screen\'s factor by that entry of B.'],
  solution: `A is ${n(m)}×${n(c)} and B is 2×2, so A⊗B has ${n(m)}·2=${n(2 * m)} rows and ${n(c)}·2=${n(2 * c)} columns. Pixel row ${n(r)} is in screen row ${n(i)} and is row ${n(k)} inside that screen. Pixel column ${n(s)} is in screen column ${n(j)} and is column ${n(l)} inside it. That screen has factor ${n(f)}, and row ${n(k)}, column ${n(l)} of B is ${n(t)}. The pixel is ${n(f)}·${n(t)}=${n(val)}.`,
  guidance: [
   { prompt: `A is ${n(m)}×${n(c)} and B is 2×2. Enter the number of rows of A⊗B, then the number of columns.`, answer: [2 * m, 2 * c], explanation: `Sizes multiply: ${n(m)}·2=${n(2 * m)} rows and ${n(c)}·2=${n(2 * c)} columns.` },
   { prompt: `Each screen takes 2 pixel rows and 2 pixel columns. Which screen holds the pixel in row ${n(r)}, column ${n(s)}? Enter the screen's row, then its column, in the wall.`, answer: [i, j], explanation: `Pixel rows ${n(2 * i - 1)} and ${n(2 * i)} belong to screen row ${n(i)}. Pixel columns ${n(2 * j - 1)} and ${n(2 * j)} belong to screen column ${n(j)}. That screen's factor is ${n(f)}.` },
   { prompt: `Inside that screen the pixel is in row ${n(k)}, column ${n(l)} of the pattern B, where B has the entry ${n(t)}. The screen's factor is ${n(f)}. What is the pixel value?`, answer: [val], explanation: `${n(f)}·${n(t)}=${n(val)}. The factor of a screen multiplies every entry of its copy of B.` }
  ] }; }
});

practice({ id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q23',
 title: 'Gains of the paired units',
 brief: 'Two signal units are run as one combined system, and the forge needs every gain the pair can show.',
 labels: ['eigenvalue 1 (smallest)', 'eigenvalue 2', 'eigenvalue 3', 'eigenvalue 4 (largest)'], tolerance: 0.01 },
 [['smaller eigenvalue of A', 'larger eigenvalue of A'], ['smaller eigenvalue of B', 'larger eigenvalue of B'], ['eigenvalue 1 (smallest)', 'eigenvalue 4 (largest)']], {
 canonical: { A: [[2, 1], [0, -3]], B: [[4, -2], [0, 5]] },
 /* Four different products, so "smallest to largest" has one reading. */
 draw: R => { const E = [-3, -2, 2, 3, 4, 5]; let p, pr; do { const a1 = R.pick(E), a2 = R.pick(E), b1 = R.pick(E), b2 = R.pick(E);
   p = { A: [[a1, R.nz(-3, 3)], [0, a2]], B: [[b1, R.nz(-3, 3)], [0, b2]] }; pr = [a1 * b1, a1 * b2, a2 * b1, a2 * b2]; } while (new Set(pr).size < 4 || p.A[0][0] === p.A[1][1] || p.B[0][0] === p.B[1][1]); return p; },
 build: ({ A, B }) => { const ea = [A[0][0], A[1][1]].sort((x, y) => x - y), eb = [B[0][0], B[1][1]].sort((x, y) => x - y);
  const all = [ea[0] * eb[0], ea[0] * eb[1], ea[1] * eb[0], ea[1] * eb[1]], sorted = all.slice().sort((x, y) => x - y); return {
  prompt: `Two signal units work side by side. Unit one has the matrix A=${mat(A)} and unit two has the matrix B=${mat(B)}. Run together they form one system with the 4×4 matrix A⊗B. Its eigenvalues are all the products of one eigenvalue of A with one eigenvalue of B. Enter the four eigenvalues of A⊗B from smallest to largest.`,
  answer: sorted,
  hints: ['Both matrices are triangular: they have a zero below the diagonal. The eigenvalues of a triangular matrix are its diagonal entries.', 'Multiply each eigenvalue of A by each eigenvalue of B. That makes four products. Mind the signs, then put the four in order.'],
  solution: `A is triangular, so its eigenvalues are its diagonal entries ${n(ea[0])} and ${n(ea[1])}. In the same way B has ${n(eb[0])} and ${n(eb[1])}. The four products are ${n(ea[0])}·${par(eb[0])}=${n(all[0])}, ${n(ea[0])}·${par(eb[1])}=${n(all[1])}, ${n(ea[1])}·${par(eb[0])}=${n(all[2])} and ${n(ea[1])}·${par(eb[1])}=${n(all[3])}. In order: ${sorted.map(n).join(', ')}.`,
  guidance: [
   { prompt: `A=${mat(A)} has a zero below its diagonal. Enter its two eigenvalues, the smaller one first.`, answer: ea, explanation: `For a triangular matrix the eigenvalues are the diagonal entries: ${n(ea[0])} and ${n(ea[1])}.` },
   { prompt: `Do the same for B=${mat(B)}. Enter its two eigenvalues, the smaller one first.`, answer: eb, explanation: `The diagonal entries of B are its eigenvalues: ${n(eb[0])} and ${n(eb[1])}.` },
   { prompt: `Form the four products of one eigenvalue of A (${n(ea[0])} or ${n(ea[1])}) with one of B (${n(eb[0])} or ${n(eb[1])}). Enter the smallest product, then the largest.`, answer: [sorted[0], sorted[3]], explanation: `The products are ${all.map(n).join(', ')}. The smallest is ${n(sorted[0])} and the largest is ${n(sorted[3])}.` }
  ] }; }
});

/* ---- q38 Markov chains (taught: columns of P say where each state's share goes, p_next=Pp; steady state Pp=p with total 1.
        Pitfall: reading rows where columns are meant). ---- */
/* q38b: leaving percents a (North→South) and b (South→North), a ≠ b, and a fleet N that splits into whole bikes,
   with a whole number of bikes crossing each way every day. */
const BIKES = [];
for (const a of [10, 20, 30, 40, 50, 60]) for (const b of [10, 20, 30, 40, 50, 60]) for (const N of [120, 150, 200, 240, 300, 360, 400, 450, 500, 600])
 if (a !== b && (N * b) % (a + b) === 0 && (N * a * b) % (100 * (a + b)) === 0) BIKES.push([N, a, b]);
practice({ id: 'q38b', parent: 'q38', kind: 'setting',
 title: 'Hire bikes, north and south',
 brief: 'Hire bikes drift between two docks every day, and the city wants to know where they settle.',
 labels: ['bikes at North', 'bikes at South'], tolerance: 0.01 },
 [['P 11', 'P 12'], ['bikes at North'], ['bikes at South']], {
 canonical: { N: 200, a: 30, b: 10 },
 draw: R => { const [N, a, b] = R.pick(BIKES); return { N, a, b }; },
 build: ({ N, a, b }) => { const g = gcd(a, b), pn = b / g, ps = a / g, north = N * b / (a + b), south = N - north, one = N / (pn + ps); return {
  prompt: `A city has ${n(N)} hire bikes shared between two docks, North and South. Every day ${n(a)}% of the bikes at North end the day at South, and ${n(b)}% of the bikes at South end the day at North. The rest end the day where they began. After many days the numbers at the docks stop changing. Enter the steady number of bikes at North, then at South.`,
  answer: [north, south],
  hints: ['Steady means that each day as many bikes leave North as arrive there. The bikes leaving are a share of North; the bikes arriving are a share of South.', `That balance gives a ratio between the two docks. Then split the ${n(N)} bikes in that ratio.`],
  solution: `As a matrix with columns (from North, from South): P=${mat([[(100 - a) / 100, b / 100], [a / 100, (100 - b) / 100]])}. Steady means Pp=p, and its first row gives ${n(a / 100)}·(North)=${n(b / 100)}·(South). So for every ${n(pn)} ${pn === 1 ? 'bike' : 'bikes'} at North there ${ps === 1 ? 'is' : 'are'} ${n(ps)} at South: ${n(pn + ps)} parts in all, and one part is ${n(N)}/${n(pn + ps)}=${n(one)} bikes. North has ${n(pn)}·${n(one)}=${n(north)} and South has ${n(ps)}·${n(one)}=${n(south)}. Check: ${n(a)}% of ${n(north)} is ${n(a * north / 100)} and ${n(b)}% of ${n(south)} is ${n(b * south / 100)}, the same number each way.`,
  guidance: [
   { prompt: `Write one day as a matrix P with columns (from North, from South) and rows (to North, to South), using shares between 0 and 1. Enter the top row: the share of North's bikes that stay at North, then the share of South's bikes that move to North.`, answer: [(100 - a) / 100, b / 100], explanation: `${n(a)}% leave North, so ${n(100 - a)}% stay: ${n((100 - a) / 100)}. ${n(b)}% of South's bikes arrive: ${n(b / 100)}. Each column of P adds up to 1.` },
   { prompt: `Steady means Pp=p. Its first row gives ${n(a / 100)}·(North)=${n(b / 100)}·(South), so North and South hold bikes in the ratio ${n(pn)} to ${n(ps)}. Share the ${n(N)} bikes in that ratio. How many are at North?`, answer: [north], explanation: `${n(pn)}+${n(ps)}=${n(pn + ps)} parts, and ${n(N)}/${n(pn + ps)}=${n(one)} bikes in a part. North has ${n(pn)}·${n(one)}=${n(north)}.` },
   { prompt: `The two docks hold all ${n(N)} bikes between them. How many are at South?`, answer: [south], explanation: `${n(N)}−${n(north)}=${n(south)}. The dock that loses the smaller share each day ends up holding more bikes.` }
  ] }; }
});

practice({ id: 'q38c', parent: 'q38', kind: 'applied',
 title: 'Dry or wet in two days',
 brief: 'A simple weather model gives the chances for tomorrow, and the launch crew needs the chances for the day after.',
 labels: ['dry in two days', 'wet in two days'], tolerance: 0.004 },
 [['dry tomorrow', 'wet tomorrow'], ['dry in two days'], ['wet in two days']], {
 canonical: { D: 8, W: 4 },
 /* D and W are tenths. D > W always, so tomorrow's chances are never the answer for the day after.
    The answers are hundredths, so the tolerance is under half a hundredth: 0.57 must not pass for 0.56. */
 draw: R => ({ D: R.int(6, 9), W: R.int(2, 5) }),
 build: ({ D, W }) => { const d = D / 10, w = W / 10, dd = D * D, wd = W * (10 - D), dry = (dd + wd) / 100, wet = (100 - dd - wd) / 100; return {
  prompt: `A simple weather model has two states, dry and wet. After a dry day, the next day is dry with probability ${n(d)}. After a wet day, the next day is dry with probability ${n(w)}. With columns (after dry, after wet) and rows (dry next, wet next) the matrix is P=${mat([[d, w], [(10 - D) / 10, (10 - W) / 10]])}. Today is dry, so today's probabilities are (1, 0). Enter the probability that the day after tomorrow is dry, then the probability that it is wet.`,
  answer: [dry, wet],
  hints: ['One day ahead is p_next=Pp. Two days ahead means doing that twice: find tomorrow first, then use tomorrow as the new start.', 'P times (1, 0) is the first column of P. Multiply P by that column to reach the day after tomorrow.'],
  solution: `Tomorrow: P·(1, 0) is the first column, ${vec([d, (10 - D) / 10])}. The day after: dry is ${n(d)}·${n(d)}+${n(w)}·${n((10 - D) / 10)}=${n(dd / 100)}+${n(wd / 100)}=${n(dry)}, and wet is ${n((10 - D) / 10)}·${n(d)}+${n((10 - W) / 10)}·${n((10 - D) / 10)}=${n(wet)}. The two add up to 1.`,
  guidance: [
   { prompt: `Start from today, p=(1, 0), and work out Pp. Enter the probability that tomorrow is dry, then that it is wet.`, answer: [d, (10 - D) / 10], explanation: `Multiplying P by (1, 0) picks out its first column: ${vec([d, (10 - D) / 10])}.` },
   { prompt: `Now multiply the top row of P, ${vec([d, w])}, by tomorrow's probabilities ${vec([d, (10 - D) / 10])}. What is the probability of dry on the day after tomorrow?`, answer: [dry], explanation: `${n(d)}·${n(d)}+${n(w)}·${n((10 - D) / 10)}=${n(dd / 100)}+${n(wd / 100)}=${n(dry)}. The first part is dry then dry; the second is wet then dry.` },
   { prompt: 'The day after tomorrow is either dry or wet. What is the probability that it is wet?', answer: [wet], explanation: `1−${n(dry)}=${n(wet)}. The bottom row of P gives the same number.` }
  ] }; }
});

practice({ id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q12',
 title: 'Three depots in a line',
 brief: 'Delivery vans shuffle between three depots each night, and the planner wants the numbers they settle at.',
 labels: ['vans at West', 'vans at Central', 'vans at East'], tolerance: 0.01 },
 [['West parts', 'Central parts', 'East parts'], ['vans in one part'], ['vans at West', 'vans at Central', 'vans at East']], {
 canonical: { a: 2, b: 1, c: 3, d: 2, N: 120 },
 /* a, b, c, d are tenths: West→Central a, Central→West b, Central→East c, East→Central d. The steady parts are
    (bd, ad, ac) with common factors removed; at most 20 parts; never three equal parts; reading rows as columns
    (a↔b, c↔d) never gives the same split. */
 draw: R => { let p, ok; do { const a = R.int(1, 4), b = R.int(1, 4), c = R.int(1, 4), d = R.int(1, 4), w = [b * d, a * d, a * c], g = gcd(gcd(w[0], w[1]), w[2]), S = (w[0] + w[1] + w[2]) / g;
   const v = [a * c, b * c, b * d];
   ok = S <= 20 && !(w[0] === w[1] && w[1] === w[2]) && !(w[0] * v[1] === w[1] * v[0] && w[1] * v[2] === w[2] * v[1]);
   p = { a, b, c, d, N: S * R.pick([5, 10, 20]) }; } while (!ok); return p; },
 build: ({ a, b, c, d, N }) => { const raw = [b * d, a * d, a * c], g = gcd(gcd(raw[0], raw[1]), raw[2]), w = raw.map(x => x / g), S = w[0] + w[1] + w[2], one = N / S, ans = w.map(x => x * one);
  const t = x => n(x / 10), P = [[(10 - a) / 10, b / 10, 0], [a / 10, (10 - b - c) / 10, d / 10], [0, c / 10, (10 - d) / 10]];
  const g1 = gcd(a, b), g2 = gcd(c, d); return {
  prompt: `A courier has ${n(N)} vans and three depots in a line: West, Central and East. Each night some vans move to a neighbouring depot. The matrix P gives the shares, with one column for where a van starts (West, Central, East) and one row for where it ends (West, Central, East): P=${mat(P)}. After many nights the numbers at the depots stop changing. Enter the steady number of vans at West, at Central, then at East.`,
  answer: ans,
  hints: ['Steady means Pp=p. The first row of that has only West and Central in it, and the third row has only Central and East.', `Each of those rows gives a ratio between two depots. Chain the two ratios into one, then share the ${n(N)} vans so the three numbers add up to ${n(N)}.`],
  solution: `Write p=(p₁, p₂, p₃) for West, Central, East. Row 1 of Pp=p: ${t(10 - a)}p₁+${t(b)}p₂=p₁, so ${t(a)}p₁=${t(b)}p₂ and West : Central = ${n(b / g1)} : ${n(a / g1)}. Row 3: ${t(c)}p₂+${t(10 - d)}p₃=p₃, so ${t(c)}p₂=${t(d)}p₃ and Central : East = ${n(d / g2)} : ${n(c / g2)}. Together West : Central : East = ${n(w[0])} : ${n(w[1])} : ${n(w[2])}, which is ${n(S)} parts. One part is ${n(N)}/${n(S)}=${n(one)} vans, so the depots hold ${n(ans[0])}, ${n(ans[1])} and ${n(ans[2])} vans.`,
  guidance: [
   { prompt: `Row 1 of Pp=p simplifies to ${t(a)}p₁=${t(b)}p₂, and row 3 to ${t(c)}p₂=${t(d)}p₃. Write the steady split West : Central : East in whole numbers with no common factor. Enter the three numbers.`, answer: w, explanation: `West : Central = ${n(b / g1)} : ${n(a / g1)} and Central : East = ${n(d / g2)} : ${n(c / g2)}. Making the Central numbers match gives ${n(w[0])} : ${n(w[1])} : ${n(w[2])}.` },
   { prompt: `The split ${n(w[0])} : ${n(w[1])} : ${n(w[2])} has ${n(w[0])}+${n(w[1])}+${n(w[2])} parts in all, and the parts share ${n(N)} vans. How many vans are in one part?`, answer: [one], explanation: `There are ${n(S)} parts, and ${n(N)}/${n(S)}=${n(one)} vans in each.` },
   { prompt: `Multiply each number of the split ${n(w[0])} : ${n(w[1])} : ${n(w[2])} by the vans in one part. Enter the vans at West, at Central, then at East.`, answer: ans, explanation: `${n(w[0])}·${n(one)}=${n(ans[0])}, ${n(w[1])}·${n(one)}=${n(ans[1])} and ${n(w[2])}·${n(one)}=${n(ans[2])}. They add up to ${n(N)}.` }
  ] }; }
});

/* ---- q39 Graph Laplacians (taught: L=D−A, each output is degree × own value − neighbours; constant states give 0;
        nullity of L = number of connected components). ---- */
practice({ id: 'q39b', parent: 'q39', kind: 'setting',
 title: 'The ferry map',
 brief: 'A ferry company has drawn its routes between four islands, and the hub wants the map as a Laplacian.',
 labels: ['L 11', 'L 22', 'L 33', 'L 44', 'components'], tolerance: 0.01 },
 [['L 11', 'L 22'], ['L 33', 'L 44'], ['components', 'nullity']], {
 canonical: { edges: [[1, 2], [1, 3], [2, 3]] },
 /* Two to four of the six possible routes, listed in order. */
 draw: R => { const all = [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]], m = R.int(2, 4), keep = new Set(); while (keep.size < m) keep.add(R.int(0, 5)); return { edges: all.filter((_, i) => keep.has(i)) }; },
 build: ({ edges }) => { const d = degrees(4, edges), g = groups(4, edges), k = new Set(g).size, lone = d.filter(x => x === 0).length;
  const described = [...new Set(g)].map(r => '{' + g.map((x, i) => x === r ? i + 1 : 0).filter(Boolean).join(', ') + '}').join(' and ').replace(/ and (?=.* and )/g, ', '); return {
  prompt: `Four islands are numbered 1 to 4. Ferries run both ways between these pairs of islands: ${pairs(edges)}. Treat the islands as nodes and the ferry routes as edges, and build the Laplacian L=D−A. Enter the four diagonal entries of L, from island 1 to island 4. Then enter the number of connected components: the groups of islands joined by ferries, where an island with no ferry is a group of its own.`,
  answer: [...d, k],
  hints: ['The diagonal of L is D, the degrees. The degree of an island is the number of ferry routes that touch it, and an island with no ferry gets a zero.', 'For the components, start at any island and mark every island you can reach by ferry, changing boats if you need to. That is one group. Start again from an island that is not marked yet.'],
  solution: `Count the routes that touch each island: ${d.map((x, i) => `island ${i + 1} has ${n(x)}`).join(', ')}. These degrees are the diagonal of L: ${vec(d)}. Following the ferries, the islands fall into ${k === 1 ? 'one group' : `${n(k)} groups`}: ${described}. So there ${k === 1 ? 'is 1 connected component' : `are ${n(k)} connected components`}, and L has nullity ${n(k)}.${lone ? ' An island with no ferry still counts as a component.' : ''}`,
  guidance: [
   { prompt: `The routes are ${pairs(edges)}. How many routes touch island 1, and how many touch island 2?`, answer: [d[0], d[1]], explanation: `Island 1 is in ${n(d[0])} of the listed pairs and island 2 is in ${n(d[1])}. These are the first two diagonal entries of L.` },
   { prompt: 'How many routes touch island 3, and how many touch island 4?', answer: [d[2], d[3]], explanation: `Island 3 is in ${n(d[2])} of the pairs and island 4 is in ${n(d[3])}. The diagonal of L is ${vec(d)}.` },
   { prompt: 'Follow the ferries to group the islands. Enter the number of connected components, then the nullity of L (the dimension of its null space: how many independent states L sends to zero).', answer: [k, k], explanation: `The groups are ${described}. Each group can hold its own constant state that L sends to zero, so the nullity equals the number of components: ${n(k)}.` }
  ] }; }
});

/* q39c: connected door plans for four rooms. */
const PLANS = [[[1, 2], [2, 3], [3, 4]], [[1, 2], [2, 3], [2, 4]], [[1, 2], [1, 3], [1, 4]], [[1, 2], [1, 4], [2, 3], [3, 4]], [[1, 2], [1, 3], [2, 3], [3, 4]], [[1, 3], [2, 3], [2, 4]], [[1, 4], [2, 4], [3, 4]], [[1, 2], [2, 4], [3, 4]]];
practice({ id: 'q39c', parent: 'q39', kind: 'applied',
 title: 'Warm rooms, cool rooms',
 brief: 'Four rooms of a flat sit at different temperatures, and the heating log wants to know which rooms are out of step with their neighbours.',
 labels: ['output room 1', 'output room 2', 'output room 3', 'output room 4'], tolerance: 0.01 },
 [['doors', 'sum next door'], ['output'], ['output, first listed room', 'output, second listed room', 'output, third listed room']], {
 canonical: { edges: [[1, 2], [2, 3], [2, 4]], x: [18, 21, 17, 22] },
 /* At least three rooms are out of step, so the outputs are not mostly zeros. */
 draw: R => { let p, y; do { p = { edges: R.pick(PLANS), x: [R.int(15, 24), R.int(15, 24), R.int(15, 24), R.int(15, 24)] }; const d = degrees(4, p.edges);
   y = p.x.map((v, i) => d[i] * v - p.edges.reduce((s, [a, b]) => s + (a === i + 1 ? p.x[b - 1] : b === i + 1 ? p.x[a - 1] : 0), 0)); } while (y.filter(v => v !== 0).length < 3 || new Set(p.x).size < 3); return p; },
 build: ({ edges, x }) => { const d = degrees(4, edges), nb = i => edges.filter(e => e.includes(i)).map(e => e[0] === i ? e[1] : e[0]);
  const sum = i => nb(i).reduce((s, j) => s + x[j - 1], 0), y = [1, 2, 3, 4].map(i => d[i - 1] * x[i - 1] - sum(i));
  const m = d.indexOf(Math.max(...d)) + 1, rest = [1, 2, 3, 4].filter(i => i !== m);
  const line = (i, cap) => `${cap === true ? 'Room' : 'room'} ${i}: ${n(d[i - 1])}·${n(x[i - 1])}−${nb(i).length > 1 ? '(' + nb(i).map(j => n(x[j - 1])).join('+') + ')' : n(sum(i))}=${n(y[i - 1])}`; return {
  prompt: `A flat has four rooms, numbered 1 to 4. Doors join these pairs of rooms: ${pairs(edges)}. The room temperatures are x=${vec(x)} °C. The Laplacian L=D−A of the door plan compares each room with the rooms next door: its output for a room is (the number of doors of the room) × (its temperature) − (the temperatures next door, added up). Enter Lx: the output for room 1, room 2, room 3, then room 4.`,
  answer: y,
  hints: ['Count the doors of each room first. That count is the degree of the room, its diagonal entry in L.', 'A check for the end: the four outputs always add up to zero, because every door is counted once from each side.'],
  solution: `Use degree × own temperature − sum next door for each room. ${[1, 2, 3, 4].map((i, at) => line(i, at === 0)).join('; ')}. So Lx=${vec(y)}. A positive output marks a room warmer than its neighbours on balance, a negative one a cooler room, and the four outputs add up to 0.`,
  guidance: [
   { prompt: `Start with room ${n(m)}. How many doors does it have, and what do the temperatures of the rooms next door add up to?`, answer: [d[m - 1], sum(m)], explanation: `Room ${n(m)} is joined to ${nb(m).length > 1 ? 'rooms' : 'room'} ${nb(m).join(', ').replace(/, (\d+)$/, ' and $1')}, so it has ${n(d[m - 1])} ${d[m - 1] === 1 ? 'door' : 'doors'}. Next door: ${nb(m).map(j => n(x[j - 1])).join('+')}${nb(m).length > 1 ? '=' + n(sum(m)) : ''} °C.` },
   { prompt: `Room ${n(m)} is at ${n(x[m - 1])} °C. Work out ${n(d[m - 1])}·${n(x[m - 1])}−${n(sum(m))}, the output for room ${n(m)}.`, answer: [y[m - 1]], explanation: `${n(d[m - 1])}·${n(x[m - 1])}=${n(d[m - 1] * x[m - 1])}, and ${n(d[m - 1] * x[m - 1])}−${n(sum(m))}=${n(y[m - 1])}.` },
   { prompt: `Do the same for the other rooms. Enter the outputs for rooms ${rest.join(', ')}, in that order.`, answer: rest.map(i => y[i - 1]), explanation: `${rest.map((i, at) => line(i, at === 0)).join('; ')}. With room ${n(m)} the four outputs add up to 0.` }
  ] }; }
});

practice({ id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q13',
 title: 'Sensor field, broken links',
 brief: 'A storm has cut some radio links in a field of sensors, and the hub must know how badly the network has split.',
 labels: ['components', 'nullity of L', 'rank of L'], tolerance: 0.01 },
 [['sensors in the group'], ['components', 'nullity of L'], ['rank of L']], {
 canonical: { N: 7, edges: [[1, 4], [1, 6], [2, 5], [3, 7], [4, 6]] },
 /* 6 to 8 sensors in 2 to 4 groups. Each group is joined up by a chain of links, sometimes with one spare link;
    a group of one is a sensor with no link. Sensor numbers are shuffled so the groups are not runs of numbers. */
 draw: R => { const N = R.int(6, 8), k = R.int(2, 4), order = Array.from({ length: N }, (_, i) => i + 1);
  for (let i = N - 1; i > 0; i--) { const j = R.int(0, i); [order[i], order[j]] = [order[j], order[i]]; }
  const size = Array(k).fill(1); for (let i = k; i < N; i++) size[R.int(0, k - 1)]++;
  const edges = []; let at = 0;
  for (const s of size) { const mem = order.slice(at, at + s); at += s;
   for (let i = 1; i < s; i++) edges.push([mem[i], mem[R.int(0, i - 1)]]);
   if (s >= 3 && R.bool()) { const has = (a, b) => edges.some(e => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)); let done = false;
    for (let i = 0; i < s && !done; i++) for (let j = i + 1; j < s && !done; j++) if (!has(mem[i], mem[j])) { edges.push([mem[i], mem[j]]); done = true; } } }
  return { N, edges: edges.map(([a, b]) => a < b ? [a, b] : [b, a]).sort((p, q) => p[0] - q[0] || p[1] - q[1]) }; },
 build: ({ N, edges }) => { const g = groups(N, edges), roots = [...new Set(g)], k = roots.length, own = g.filter(x => x === g[0]).length;
  const show = r => '{' + g.map((x, i) => x === r ? i + 1 : 0).filter(Boolean).join(', ') + '}', listed = roots.map(show).join(', '); return {
  prompt: `A field has ${n(N)} sensors, numbered 1 to ${n(N)}. After a storm, radio links still join these pairs of sensors: ${pairs(edges)}. A sensor that is in none of the pairs is cut off on its own. The Laplacian L of this network is a ${n(N)}×${n(N)} matrix. Enter the number of connected components of the network, then the nullity of L (the dimension of its null space), then the rank of L.`,
  answer: [k, k, N - k],
  hints: ['Group the sensors. Pick one, follow its links, and keep going until no new sensor joins. Then start again from a sensor that is not in a group yet.', 'The nullity of L equals the number of groups. The rank and the nullity of a matrix always add up to its number of columns.'],
  solution: `Following the links, the sensors fall into these groups: ${listed}. That is ${n(k)} connected components. Each group can hold its own constant state that L sends to zero, so the nullity of L is ${n(k)}. L has ${n(N)} columns, and rank + nullity = ${n(N)}, so the rank is ${n(N)}−${n(k)}=${n(N - k)}.`,
  guidance: [
   { prompt: 'Start with sensor 1 and follow the links as far as they go. How many sensors are in its group, counting sensor 1 itself?', answer: [own], explanation: `Sensor 1's group is ${show(g[0])}: ${n(own)} ${own === 1 ? 'sensor' : 'sensors'}.` },
   { prompt: 'Group the rest in the same way. Enter the number of connected components, then the nullity of L.', answer: [k, k], explanation: `The groups are ${listed}: ${n(k)} components. The nullity of an undirected graph's Laplacian equals the number of components, so it is ${n(k)} too.` },
   { prompt: `L has ${n(N)} columns and nullity ${n(k)}. Rank and nullity add up to the number of columns. What is the rank of L?`, answer: [N - k], explanation: `${n(N)}−${n(k)}=${n(N - k)}.` }
  ] }; }
});

/* ---- q40 Quadratic optimization (taught: f=½xᵀQx−bᵀx is lowest where Qx=b; evaluate f with its one-half.
        Pitfall: dropping the one-half). ---- */
practice({ id: 'q40b', parent: 'q40', kind: 'setting',
 title: 'Two machines, best speeds',
 brief: 'A workshop wants the speeds for its two machines that leave the lowest net cost per hour.',
 labels: ['best x1', 'best x2', 'lowest net cost'], tolerance: 0.01 },
 [['best x1', 'best x2'], ['wear cost', 'income'], ['lowest net cost']], {
 canonical: { q: [4, 2], b: [12, 10] },
 /* Speeds are positive whole numbers; not the parent's Q=diag(2,4), b=(6,8). */
 draw: R => { let q, x; do { q = [R.int(2, 6), R.int(2, 6)]; x = [R.int(1, 6), R.int(1, 6)]; } while (q[0] === q[1] || x[0] === x[1] || (q[0] === 2 && q[1] === 4 && x[0] === 3 && x[1] === 2)); return { q, b: [q[0] * x[0], q[1] * x[1]] }; },
 build: ({ q, b }) => { const x = [b[0] / q[0], b[1] / q[1]], wear = (q[0] * x[0] * x[0] + q[1] * x[1] * x[1]) / 2, inc = b[0] * x[0] + b[1] * x[1], f = wear - inc; return {
  prompt: `A workshop runs two machines at speeds x₁ and x₂. Wear grows with the square of a speed and income grows with the speed itself, so the net cost per hour is f=½(${n(q[0])}x₁²+${n(q[1])}x₂²)−(${n(b[0])}x₁+${n(b[1])}x₂). This is f=½xᵀQx−bᵀx with Q=diag(${n(q[0])},${n(q[1])}) and b=${vec(b)}. Enter the speeds x₁ and x₂ that make the net cost lowest, then that lowest net cost.`,
  answer: [x[0], x[1], f],
  hints: ['The lowest point is where Qx=b. Q is diagonal, so that is one small equation for each machine.', 'Put the two speeds back into f. Keep the one-half on the squared part only. A negative net cost is fine: it means the income beats the wear.'],
  solution: `Qx=b reads ${n(q[0])}x₁=${n(b[0])} and ${n(q[1])}x₂=${n(b[1])}, so x=${vec(x)}. Wear: ½(${n(q[0])}·${n(x[0] * x[0])}+${n(q[1])}·${n(x[1] * x[1])})=½·${n(2 * wear)}=${n(wear)}. Income: ${n(b[0])}·${n(x[0])}+${n(b[1])}·${n(x[1])}=${n(inc)}. Lowest net cost: ${n(wear)}−${n(inc)}=${n(f)}.`,
  guidance: [
   { prompt: `Solve ${n(q[0])}x₁=${n(b[0])} and ${n(q[1])}x₂=${n(b[1])}. Enter x₁, then x₂.`, answer: x, explanation: `${n(b[0])}/${n(q[0])}=${n(x[0])} and ${n(b[1])}/${n(q[1])}=${n(x[1])}. With a diagonal Q each machine has its own equation.` },
   { prompt: `At x=${vec(x)}, work out the wear cost ½(${n(q[0])}x₁²+${n(q[1])}x₂²), then the income ${n(b[0])}x₁+${n(b[1])}x₂.`, answer: [wear, inc], explanation: `Wear: ½(${n(q[0] * x[0] * x[0])}+${n(q[1] * x[1] * x[1])})=${n(wear)}. Income: ${n(b[0] * x[0])}+${n(b[1] * x[1])}=${n(inc)}. At the best point the wear is always half the income.` },
   { prompt: `The net cost is the wear cost minus the income: ${n(wear)}−${n(inc)}. What is it?`, answer: [f], explanation: `${n(wear)}−${n(inc)}=${n(f)}. No other pair of speeds gives a lower value, because Q is positive definite.` }
  ] }; }
});

practice({ id: 'q40c', parent: 'q40', kind: 'applied',
 title: 'What the fan settings waste',
 brief: 'Two cooling fans are running at settings picked by hand, and the grid office asks how much the best settings would save.',
 labels: ['best x1', 'best x2', 'cost drop'], tolerance: 0.01 },
 [['best x1', 'best x2'], ['lowest cost', 'cost now'], ['cost drop']], {
 canonical: { q: [2, 4], b: [10, 12], cur: [3, 4] },
 /* Both current settings are off the best ones, by 1 or 2, and stay at 1 or more. */
 draw: R => { const q = [R.int(2, 6), R.int(2, 6)], x = [R.int(3, 6), R.int(3, 6)]; return { q, b: [q[0] * x[0], q[1] * x[1]], cur: [x[0] + R.pick([-2, -1, 1, 2]), x[1] + R.pick([-2, -1, 1, 2])] }; },
 build: ({ q, b, cur }) => { const x = [b[0] / q[0], b[1] / q[1]], F = v => (q[0] * v[0] * v[0] + q[1] * v[1] * v[1]) / 2 - (b[0] * v[0] + b[1] * v[1]), fmin = F(x), fcur = F(cur), drop = fcur - fmin;
  const parts = v => `½(${n(q[0])}·${n(v[0] * v[0])}+${n(q[1])}·${n(v[1] * v[1])})−(${n(b[0])}·${n(v[0])}+${n(b[1])}·${n(v[1])})=${n((q[0] * v[0] * v[0] + q[1] * v[1] * v[1]) / 2)}−${n(b[0] * v[0] + b[1] * v[1])}=${n(F(v))}`; return {
  prompt: `Two cooling fans run at settings x₁ and x₂. Their hourly cost is f=½xᵀQx−bᵀx with Q=diag(${n(q[0])},${n(q[1])}) and b=${vec(b)}. Right now the fans are set to ${vec(cur)}. Enter the best settings x₁ and x₂, then how far the hourly cost drops when the fans are moved from the settings they have now to the best ones.`,
  answer: [x[0], x[1], drop],
  hints: ['The best settings solve Qx=b, one equation for each fan.', 'Work out f twice with the same formula: once at the best settings and once at the settings the fans have now. The drop is the cost now minus the lowest cost. Both costs may come out negative; only the gap between them matters.'],
  solution: `Qx=b reads ${n(q[0])}x₁=${n(b[0])} and ${n(q[1])}x₂=${n(b[1])}, so the best settings are ${vec(x)}. Lowest cost: ${parts(x)}. Cost now, at ${vec(cur)}: ${parts(cur)}. The drop is ${n(fcur)}−${par(fmin)}=${n(drop)}.`,
  guidance: [
   { prompt: `Solve ${n(q[0])}x₁=${n(b[0])} and ${n(q[1])}x₂=${n(b[1])}. Enter the best x₁, then the best x₂.`, answer: x, explanation: `${n(b[0])}/${n(q[0])}=${n(x[0])} and ${n(b[1])}/${n(q[1])}=${n(x[1])}.` },
   { prompt: `Work out f=½(${n(q[0])}x₁²+${n(q[1])}x₂²)−(${n(b[0])}x₁+${n(b[1])}x₂) at the best settings ${vec(x)}, then at the settings now, ${vec(cur)}. Enter the two costs in that order.`, answer: [fmin, fcur], explanation: `Best: ${parts(x)}. Now: ${parts(cur)}.` },
   { prompt: `How far does the cost drop? Work out ${n(fcur)}−${par(fmin)}.`, answer: [drop], explanation: `${n(fcur)}−${par(fmin)}=${n(drop)}. Any settings other than the best ones cost more, so the drop is positive.` }
  ] }; }
});

practice({ id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q11',
 title: 'Where the platform settles',
 brief: 'A loaded platform rests on two linked springs, and the grid crew needs to know where it comes to rest.',
 labels: ['x1', 'x2', 'lowest f'], tolerance: 0.01 },
 [['x1'], ['x2'], ['Fᵀx', 'lowest f']], {
 canonical: { K: [[3, -1], [-1, 2]], F: [2, 6] },
 /* K is symmetric and positive definite with a coupling h ≠ 0; x is a pair of positive whole numbers; both loads are
    positive; Fᵀx is even so the lowest f is a whole number. Ignoring the coupling never gives the right x. */
 draw: R => { let p, ok; do { const a = R.int(2, 5), c = R.int(2, 5), h = R.pick([-2, -1, 1, 2]), x = [R.int(1, 5), R.int(1, 5)], F = [a * x[0] + h * x[1], h * x[0] + c * x[1]];
   ok = a * c - h * h >= 2 && F[0] > 0 && F[1] > 0 && (F[0] * x[0] + F[1] * x[1]) % 2 === 0; p = { K: [[a, h], [h, c]], F }; } while (!ok); return p; },
 build: ({ K, F }) => { const a = K[0][0], h = K[0][1], c = K[1][1], det = a * c - h * h, x1 = (c * F[0] - h * F[1]) / det, x2 = (F[1] - h * x1) / c, T = F[0] * x1 + F[1] * x2, f = -T / 2, H = Math.abs(h);
  /* The two equations with a coefficient of 1 left unwritten, and the elimination step in words. */
  const co = (v, first) => (Math.abs(v) === 1 ? (v < 0 ? '−' : first ? '' : '+') : first ? n(v) : plus(v));
  const eq1 = `${co(a, true)}x₁${co(h, false)}x₂=${n(F[0])}`, eq2 = `${co(h, true)}x₁${co(c, false)}x₂=${n(F[1])}`;
  const how = H === 1 ? `multiply the first equation by ${n(c)}, then ${h > 0 ? 'subtract the second from it' : 'add the second to it'}` : `multiply the first equation by ${n(c)} and the second by ${n(H)}, then ${h > 0 ? 'subtract the second from the first' : 'add them'}`;
  const sum = `${n(c * F[0])}${h > 0 ? '−' : '+'}${n(H * F[1])}=${n(c * F[0] - h * F[1])}`; return {
  prompt: `A loaded platform rests on two linked springs. Its supports sink by x₁ and x₂ centimetres. The energy of the set-up is f=½xᵀKx−Fᵀx, with the stiffness matrix K=${mat(K)} and the loads F=${vec(F)}. The platform settles where f is lowest. Enter x₁, then x₂, then the lowest value of f.`,
  answer: [x1, x2, f],
  hints: ['The lowest point is where Kx=F. K is not diagonal, so this is a pair of equations in x₁ and x₂ that must be solved together.', 'At the lowest point Kx equals F, so xᵀKx equals Fᵀx. Work out Fᵀx once and use it in both parts of f, keeping the one-half on the first part.'],
  solution: `Kx=F reads ${eq1} and ${eq2}. To remove x₂, ${how}: ${n(det)}x₁=${sum}, so x₁=${n(x1)}. The second equation gives ${n(c)}x₂=${n(F[1])}−${par(h * x1)}=${n(F[1] - h * x1)}, so x₂=${n(x2)}. Fᵀx=${n(F[0])}·${n(x1)}+${n(F[1])}·${n(x2)}=${n(T)}, and xᵀKx is the same number because Kx=F. Lowest f=½·${n(T)}−${n(T)}=${n(f)}.`,
  guidance: [
   { prompt: `Kx=F reads ${eq1} and ${eq2}. To remove x₂, ${how}. What is x₁?`, answer: [x1], explanation: `The x₂ terms cancel and leave ${n(det)}x₁=${sum}, so x₁=${n(x1)}.` },
   { prompt: `Put x₁=${n(x1)} into the second equation, ${eq2}. What is x₂?`, answer: [x2], explanation: `${n(c)}x₂=${n(F[1])}−${par(h * x1)}=${n(F[1] - h * x1)}, so x₂=${n(x2)}.` },
   { prompt: `At x=${vec([x1, x2])}, work out Fᵀx=${co(F[0], true)}x₁${co(F[1], false)}x₂. Then enter the lowest f, which is ½xᵀKx−Fᵀx with xᵀKx equal to Fᵀx here.`, answer: [T, f], explanation: `Fᵀx=${n(F[0] * x1)}+${n(F[1] * x2)}=${n(T)}. So f=½·${n(T)}−${n(T)}=${n(f)}: at the lowest point f is always minus one half of Fᵀx.` }
  ] }; }
});

})();
