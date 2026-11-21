/* Linear algebra practice missions, file 14 of 14: concepts q66–q68, three practice missions each
   (q66b q66c q66d ... q68b q68c q68d; 9 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p14.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- add missions for q66–q68 below this line ---- */

/* Small text helpers. co(3)="3", co(1)="", co(−1)="−": a coefficient in front of a letter. term(−2,'y')="−2y",
   term(1,'y')="+y": a signed term inside a sum. lin(2,1)="2x+y". pl(1,'plank')="1 plank", pl(3,'plank')="3 planks". */
const co = k => k === 1 ? '' : k === -1 ? '−' : n(k);
const term = (k, v) => (k < 0 ? '−' : '+') + (Math.abs(k) === 1 ? '' : n(Math.abs(k))) + v;
const lin = (a, b) => co(a) + 'x' + term(b, 'y');
const pl = (k, word) => `${n(k)} ${word}${k === 1 ? '' : 's'}`;
/* Exact halves, quarters and tenths: an integer numerator over an integer denominator, rounded only against float noise. */
const fr = (num, den) => G.tidy(num / den);

/* ---- q66 Linear programming and duality (taught: maximize c1·x+c2·y under x+y≤S and x≤U; fill the better
        product up to its cap, give the rest to the other; a price on each limit gives an upper bound, and a plan
        that reaches the bound is proved best. Pitfall: a plan that fits is not yet proved best) ---- */
/* q66b: the cap sits on the second unknown, the cakes, which earn more. Profit of cakes > profit of bread and
   0 < U < S, so (S−U, U) is the only best plan and "all bread" or "all the oven for cakes" is never right. */
practice({ id: 'q66b', parent: 'q66', kind: 'setting',
 title: 'Bread, cakes and one oven',
 brief: 'A market baker has one oven and two things to bake, and wants the day\'s plan that earns the most.',
 labels: ['bread trays x', 'cake trays y', 'largest profit'], tolerance: 0.01 },
 [['bread trays x'], ['largest profit'], ['bound']], {
 canonical: { c1: 2, c2: 5, S: 10, U: 4 },
 draw: R => { const c1 = R.int(1, 4), c2 = R.int(c1 + 1, c1 + 5), U = R.int(2, 6), S = R.int(U + 2, U + 8); return { c1, c2, S, U }; },
 build: ({ c1, c2, S, U }) => { const x = S - U, best = c1 * x + c2 * U, d = c2 - c1; return {
  prompt: `A market baker has oven room for ${n(S)} trays a day. A tray of bread earns $${n(c1)} and a tray of cakes earns $${n(c2)}, but the stall sells at most ${n(U)} trays of cakes a day. Let x be the trays of bread and y the trays of cakes. The day's profit is ${lin(c1, c2)} dollars, with x+y≤${n(S)}, y≤${n(U)} and x,y≥0. Enter the best x, then the best y, then the largest profit in dollars.`,
  answer: [x, U, best],
  hints: ['Cakes earn more for each tray, so bake as many trays of cakes as the stall can sell. Fill the rest of the oven with bread.',
   `To check that the plan is the best, put a price of $${n(c1)} on each tray of oven room and $${n(d)} on each tray of cake sales. Multiply each price by its limit and add the two results. No plan can earn more than that, so compare it with your profit.`],
  solution: `Cakes earn more, so bake all the stall can sell: y=${n(U)}. The oven has ${n(S)}−${n(U)}=${n(x)} trays left for bread, so x=${n(x)}. Profit: ${n(c1)}·${n(x)}+${n(c2)}·${n(U)}=${n(best)} dollars. Proof that nothing beats it: ${lin(c1, c2)} is the same as ${co(c1)}(x+y)${term(d, 'y')}, and that is at most ${n(c1)}·${n(S)}+${n(d)}·${n(U)}=${n(best)}. The plan reaches this bound, so it is the best.`,
  guidance: [
   { prompt: `Cakes earn more than bread, and the stall sells at most ${n(U)} trays of them. Bake y=${n(U)} trays of cakes. The oven holds ${n(S)} trays. How many trays are left for bread?`, answer: [x], explanation: `${n(S)}−${n(U)}=${n(x)}, so x=${n(x)}. Both limits are now used up.` },
   { prompt: `Work out the profit of this plan in dollars: ${n(c1)}·${n(x)}+${n(c2)}·${n(U)}.`, answer: [best], explanation: `${n(c1 * x)}+${n(c2 * U)}=${n(best)} dollars. The plan fits the limits, but that alone does not prove it is the best.` },
   { prompt: `Now the proof. Price each tray of oven room at $${n(c1)} and each tray of cake sales at $${n(d)}. Then ${lin(c1, c2)} equals ${co(c1)}(x+y)${term(d, 'y')}, so no plan can earn more than ${n(c1)}·${n(S)}+${n(d)}·${n(U)}. What is this bound?`, answer: [best], explanation: `${n(c1 * S)}+${n(d * U)}=${n(best)}. The bound equals the profit of the plan, so no other plan can do better.` }
  ] }; }
});

/* q66c: the same kind of plan, then the two prices themselves (the dual): land price = barley profit, land price
   + water price = tomato profit. S−U ≥ 2, so one more watered hectare really does swap barley for tomatoes. */
practice({ id: 'q66c', parent: 'q66', kind: 'applied',
 title: 'What the land and the pump are worth',
 brief: 'A farmer plans two crops and asks what one more hectare of land, or of watering, would be worth.',
 labels: ['tomato hectares', 'barley hectares', 'largest profit', 'land price', 'water price'], tolerance: 0.01 },
 [['tomato hectares', 'barley hectares'], ['largest profit'], ['land price', 'water price']], {
 canonical: { c1: 7, c2: 3, S: 12, U: 5 },
 draw: R => { const c2 = R.int(1, 5), c1 = R.int(c2 + 1, c2 + 4), U = R.int(2, 6), S = R.int(U + 2, U + 9); return { c1, c2, S, U }; },
 build: ({ c1, c2, S, U }) => { const y = S - U, best = c1 * U + c2 * y, d = c1 - c2; return {
  prompt: `A farmer has ${n(S)} hectares of land. A hectare of tomatoes earns $${n(c1)} thousand and a hectare of barley earns $${n(c2)} thousand. Tomatoes need watering, and the pump can water only ${n(U)} hectares. First find the plan with the largest profit. Then find what the two limits are worth. The price of a limit is what one more hectare of it would add to the largest profit: the land price is for one more hectare of land with the same pump, and the water price is for one more watered hectare on the same land. Enter the hectares of tomatoes, the hectares of barley, the largest profit in thousand dollars, then the land price and the water price in thousand dollars for each hectare.`,
  answer: [U, y, best, c2, d],
  hints: ['Tomatoes earn more, so plant them on every hectare the pump can water. Barley goes on the land that is left.',
   'One more hectare of land can only grow barley, because the pump is already fully used. One more watered hectare lets tomatoes take over one hectare from barley, so it adds the difference between the two crops.'],
  solution: `Tomatoes earn more, so plant ${n(U)} hectares of tomatoes, all the pump can water. Barley takes the other ${n(S)}−${n(U)}=${n(y)} hectares. Profit: ${n(c1)}·${n(U)}+${n(c2)}·${n(y)}=${n(best)} thousand dollars. Land price: one more hectare of land can only grow barley, so it adds ${n(c2)}. Water price: one more watered hectare swaps a hectare of barley for tomatoes, so it adds ${n(c1)}−${n(c2)}=${n(d)}. Check: at these prices the land and the water are worth ${n(c2)}·${n(S)}+${n(d)}·${n(U)}=${n(best)} thousand dollars, the same as the profit. That match proves the plan is the best one.`,
  guidance: [
   { prompt: `Plant tomatoes on all ${n(U)} hectares the pump can water, and barley on the rest of the ${n(S)} hectares. Enter the hectares of tomatoes, then the hectares of barley.`, answer: [U, y], explanation: `Tomatoes: ${n(U)}. Barley: ${n(S)}−${n(U)}=${n(y)}. All the land and all the water are in use.` },
   { prompt: `Work out the profit in thousand dollars: ${n(c1)}·${n(U)}+${n(c2)}·${n(y)}.`, answer: [best], explanation: `${n(c1 * U)}+${n(c2 * y)}=${n(best)} thousand dollars.` },
   { prompt: `Now the prices, in thousand dollars. One more hectare of land could only grow barley, because the pump is fully used: how much would it add? One more watered hectare would let tomatoes replace barley on one hectare: how much would that add? Enter the land price, then the water price.`, answer: [c2, d], explanation: `Land: ${n(c2)}, the profit of one hectare of barley. Water: ${n(c1)}−${n(c2)}=${n(d)}, the gain from the swap. Check: ${n(c2)}·${n(S)}+${n(d)}·${n(U)}=${n(best)}, the profit of the plan. A plan whose profit equals the worth of the limits cannot be beaten.` }
  ] }; }
});

/* q66d: two general limits (wood and hours). The best corner is where both are tight: a pair of linear equations
   (q11). The profit is built as p·(wood row)+q·(hours row) with p,q>0, so that corner is the only best plan and
   the prices p,q prove it. Chairs and tables are whole numbers from 1 to 6. */
practice({ id: 'q66d', parent: 'q66', kind: 'challenge', uses: 'q11',
 title: 'Chairs, tables and a price check',
 brief: 'A workshop has a week\'s wood and hours to share between chairs and tables, and wants proof that its plan is the best.',
 labels: ['chairs x', 'tables y', 'profit', 'bound from prices'], tolerance: 0.01 },
 [['chairs x', 'tables y'], ['profit'], ['bound from prices']], {
 canonical: { A: [[2, 1], [1, 3]], r: [11, 13], c: [4, 7], price: [1, 2] },
 draw: R => { for (;;) { const e = () => R.int(1, 3), A = [[e(), e()], [e(), e()]], x = R.int(1, 6), y = R.int(1, 6), p = R.int(1, 2), q = R.int(1, 2);
  if (A[0][0] * A[1][1] - A[0][1] * A[1][0] === 0) continue;
  return { A, r: [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y], c: [p * A[0][0] + q * A[1][0], p * A[0][1] + q * A[1][1]], price: [p, q] }; } },
 build: ({ A, r, c, price }) => { const [[a1, b1], [a2, b2]] = A, [r1, r2] = r, [c1, c2] = c, [p, q] = price;
  const k = a2 * b1 - a1 * b2, rhs = a2 * r1 - a1 * r2, y = fr(rhs, k), x = fr(r1 - b1 * y, a1), best = c1 * x + c2 * y, bound = p * r1 + q * r2;
  const e1 = `${lin(a1, b1)}=${n(r1)}`, e2 = `${lin(a2, b2)}=${n(r2)}`;
  /* How x is removed, without "multiply by 1": equal x-coefficients are subtracted as they stand. */
  const same = a1 === a2, ky = same ? b1 - b2 : k, ry = same ? r1 - r2 : rhs, scale = [a2 !== 1 ? `the wood equation by ${n(a2)}` : '', a1 !== 1 ? `the hours equation by ${n(a1)}` : ''].filter(Boolean).join(' and ');
  const elim = same ? 'Both equations have the same number of x, so subtract the hours equation from the wood equation to remove x' : `Multiply ${scale}, then subtract the hours equation from the wood equation to remove x`; return {
  prompt: `A workshop builds chairs and tables. A chair takes ${pl(a1, 'plank')} of wood and ${pl(a2, 'hour')} of work. A table takes ${pl(b1, 'plank')} and ${pl(b2, 'hour')}. This week there are ${n(r1)} planks and ${n(r2)} hours. A chair earns $${n(c1)} and a table earns $${n(c2)}. Let x be the chairs and y the tables: maximize ${lin(c1, c2)} with ${lin(a1, b1)}≤${n(r1)}, ${lin(a2, b2)}≤${n(r2)} and x,y≥0. The best plan uses up all the wood and all the hours, so both limits hold with an equals sign. Solve those two equations for x and y. Then prove the plan is best: with a price of $${n(p)} on each plank and $${n(q)} on each hour, no plan can earn more than ${n(p)}·${n(r1)}+${n(q)}·${n(r2)} dollars. Enter x, then y, then the profit in dollars, then the bound from the prices.`,
  answer: [x, y, best, bound],
  hints: ['Write the two limits as equations and solve them together. Remove one unknown first, as with any pair of linear equations.',
   'For the bound, multiply each price by the amount there is this week, then add the two results. Compare the bound with the profit of your plan.'],
  solution: `Wood: ${e1}. Hours: ${e2}. Solving the pair gives x=${n(x)} and y=${n(y)}. Check: wood ${n(a1)}·${n(x)}+${n(b1)}·${n(y)}=${n(r1)}, hours ${n(a2)}·${n(x)}+${n(b2)}·${n(y)}=${n(r2)}. Profit: ${n(c1)}·${n(x)}+${n(c2)}·${n(y)}=${n(best)} dollars. Bound: ${n(p)}·${n(r1)}+${n(q)}·${n(r2)}=${n(bound)} dollars. The plan reaches the bound, so no other plan earns more.`,
  guidance: [
   { prompt: `Both limits are used up: ${e1} and ${e2}. Solve the pair. Enter x, then y.`, answer: [x, y], explanation: `${elim}: ${co(ky)}y=${n(ry)}${ky === 1 ? '' : `, so y=${n(y)}`}. Put y=${n(y)} back into the wood equation: ${co(a1)}x+${n(b1 * y)}=${n(r1)}, so x=${n(x)}.` },
   { prompt: `Work out the profit of this plan in dollars: ${n(c1)}·${n(x)}+${n(c2)}·${n(y)}.`, answer: [best], explanation: `${n(c1 * x)}+${n(c2 * y)}=${n(best)} dollars. The plan fits both limits, but that alone does not prove it is the best.` },
   { prompt: `Price each plank at $${n(p)} and each hour at $${n(q)}. A chair then uses up ${n(p)}·${n(a1)}+${n(q)}·${n(a2)}=${n(c1)} dollars of wood and hours, exactly what it earns, and a table uses ${n(p)}·${n(b1)}+${n(q)}·${n(b2)}=${n(c2)} dollars. So no plan can earn more than all the wood and hours are worth: ${n(p)}·${n(r1)}+${n(q)}·${n(r2)}. What is this bound?`, answer: [bound], explanation: `${n(p * r1)}+${n(q * r2)}=${n(bound)} dollars. It equals the profit of the plan, so the plan is the best one.` }
  ] }; }
});

/* ---- q67 Convolution (taught: full linear convolution of three samples with a two-tap filter, zeros outside
        the signal, 3+2−1=4 outputs. Pitfall: no wrapping round from the end to the start) ---- */
const conv = (x, h) => [x[0] * h[0], x[1] * h[0] + x[0] * h[1], x[2] * h[0] + x[1] * h[1], x[2] * h[1]];
/* q67b: direct sound and one echo. The two strengths differ, so using them in the wrong order shows. */
practice({ id: 'q67b', parent: 'q67', kind: 'setting',
 title: 'A drum hit in an echoing hall',
 brief: 'A sound engineer records a drum in a hall that sends every sound back once, and wants to know what the recorder will hold.',
 labels: ['y0', 'y1', 'y2', 'y3'], tolerance: 0.01 },
 [['y0'], ['y1', 'y2'], ['y3']], {
 canonical: { x: [3, -2, 4], h: [2, 1] },
 draw: R => { const g = R.int(2, 4), e = R.int(1, g - 1); return { x: [R.nz(-4, 6), R.nz(-4, 6), R.nz(-4, 6)], h: [g, e] }; },
 build: ({ x, h }) => { const [g, e] = h, y = conv(x, h); return {
  prompt: `A recorder samples a drum hit three times: x=${vec(x)}. The hall answers every sample twice: at once with strength ${n(g)}, and one step later as an echo with strength ${n(e)}. So the hall is the filter h=${vec(h)}, and the recording is x convolved with h, with silence (zeros) before and after the hit. Enter the four recorded samples in order.`,
  answer: y,
  hints: ['Each recorded sample is the newest drum sample times the first strength, plus the drum sample before it times the echo strength.',
   'There are four recorded samples. The first has no earlier sample to echo, and the last is only the echo of the final drum sample.'],
  solution: `y₀=${n(g)}·${par(x[0])}=${n(y[0])}. y₁=${n(g)}·${par(x[1])}+${n(e)}·${par(x[0])}=${n(y[1])}. y₂=${n(g)}·${par(x[2])}+${n(e)}·${par(x[1])}=${n(y[2])}. y₃=${n(e)}·${par(x[2])}=${n(y[3])}. The recording is ${vec(y)}: three samples and a two-part filter give 3+2−1=4 samples.`,
  guidance: [
   { prompt: `The first recorded sample holds only the direct sound of the first drum sample. Work out ${n(g)}·${par(x[0])}.`, answer: [y[0]], explanation: `${n(g)}·${par(x[0])}=${n(y[0])}. There is silence before the hit, so nothing echoes yet.` },
   { prompt: `The next two samples hold direct sound plus the echo of the sample before. Work out ${n(g)}·${par(x[1])}+${n(e)}·${par(x[0])}, then ${n(g)}·${par(x[2])}+${n(e)}·${par(x[1])}.`, answer: [y[1], y[2]], explanation: `${n(g * x[1])}${plus(e * x[0])}=${n(y[1])} and ${n(g * x[2])}${plus(e * x[1])}=${n(y[2])}.` },
   { prompt: `The last recorded sample is only the echo of the final drum sample. Work out ${n(e)}·${par(x[2])}.`, answer: [y[3]], explanation: `${n(e)}·${par(x[2])}=${n(y[3])}. The echo does not wrap round to the start: the recording simply gets one sample longer.` }
  ] }; }
});

/* q67c: a workload spread over two days is a convolution; the total is a check (groups × hours for each group). */
practice({ id: 'q67c', parent: 'q67', kind: 'applied',
 title: 'Guide hours at the museum',
 brief: 'A museum runs three days of school workshops and has to book its guides for every day the work spills into.',
 labels: ['day 1 hours', 'day 2 hours', 'day 3 hours', 'day 4 hours', 'total hours'], tolerance: 0.01 },
 [['day 1 hours', 'day 4 hours'], ['day 2 hours', 'day 3 hours'], ['total hours']], {
 canonical: { x: [4, 2, 5], h: [3, 1] },
 draw: R => { const h0 = R.int(2, 5), h1 = R.except(1, 3, [h0]); return { x: [R.int(1, 6), R.int(1, 6), R.int(1, 6)], h: [h0, h1] }; },
 build: ({ x, h }) => { const [h0, h1] = h, y = conv(x, h), total = y[0] + y[1] + y[2] + y[3], groups = x[0] + x[1] + x[2]; return {
  prompt: `A museum runs school workshops on three days: ${pl(x[0], 'group')} on day 1, ${pl(x[1], 'group')} on day 2 and ${pl(x[2], 'group')} on day 3. Every group needs a guide for ${pl(h0, 'hour')} on the day of its visit and for ${pl(h1, 'hour')} on the day after, to pack away its work. The guide hours on each day are the visits x=${vec(x)} convolved with the pattern h=${vec(h)}. Enter the guide hours on day 1, day 2, day 3 and day 4, then the total guide hours over the four days.`,
  answer: [...y, total],
  hints: ['On each day, count the visit hours for the groups that come that day, and add the packing hours for the groups of the day before.',
   'Day 1 has no groups from the day before, and day 4 has only packing hours. For the total, add the four days.'],
  solution: `Day 1: ${n(h0)}·${n(x[0])}=${n(y[0])}. Day 2: ${n(h0)}·${n(x[1])}+${n(h1)}·${n(x[0])}=${n(y[1])}. Day 3: ${n(h0)}·${n(x[2])}+${n(h1)}·${n(x[1])}=${n(y[2])}. Day 4: ${n(h1)}·${n(x[2])}=${n(y[3])}. Total: ${n(y[0])}+${n(y[1])}+${n(y[2])}+${n(y[3])}=${n(total)} hours. A quick check: each of the ${n(groups)} groups needs ${n(h0)}+${n(h1)}=${n(h0 + h1)} hours in all, and ${n(groups)}·${n(h0 + h1)}=${n(total)}.`,
  guidance: [
   { prompt: `Start with the two ends. Day 1 has only the visit hours of its own groups: ${n(h0)}·${n(x[0])}. Day 4 has only the packing hours for day 3: ${n(h1)}·${n(x[2])}. Enter the hours on day 1, then on day 4.`, answer: [y[0], y[3]], explanation: `Day 1: ${pl(y[0], "hour")}. Day 4: ${pl(y[3], "hour")}. Three days of visits and a two-day pattern give 3+2−1=4 days of work.` },
   { prompt: `The middle days have visit hours and packing hours. Day 2: ${n(h0)}·${n(x[1])}+${n(h1)}·${n(x[0])}. Day 3: ${n(h0)}·${n(x[2])}+${n(h1)}·${n(x[1])}. Enter the hours on day 2, then on day 3.`, answer: [y[1], y[2]], explanation: `Day 2: ${n(h0 * x[1])}+${n(h1 * x[0])}=${n(y[1])}. Day 3: ${n(h0 * x[2])}+${n(h1 * x[1])}=${n(y[2])}.` },
   { prompt: `Add the four days: ${n(y[0])}+${n(y[1])}+${n(y[2])}+${n(y[3])}. What is the total number of guide hours?`, answer: [total], explanation: `The total is ${n(total)} hours. It equals the number of groups times the hours for one group: ${n(groups)}·${n(h0 + h1)}=${n(total)}.` }
  ] }; }
});

/* q67d: the convolution run backwards. The four received samples give a staircase of equations solved from the
   top, one unknown at a time (substitution in a triangular system, q12). The sent samples are whole numbers. The
   first strength is 2 or 3 and the echo strength is never 1 or −1, so no received sample is a sent sample as it
   stands (or with only its sign changed), and the hint does not write out the last equation. */
practice({ id: 'q67d', parent: 'q67', kind: 'challenge', uses: 'q12',
 title: 'Taking the echo off the line',
 brief: 'A phone line adds an echo to every call, and the exchange wants to recover the samples that were really sent.',
 labels: ['x0', 'x1', 'x2'], tolerance: 0.01 },
 [['x0'], ['x1'], ['x2']], {
 canonical: { y: [6, 7, 1, 6], h: [2, 3] },
 draw: R => { const h0 = R.int(2, 3), h1 = R.pick([-3, -2, 2, 3].filter(t => t !== h0)), h = [h0, h1]; return { y: conv([R.nz(-4, 5), R.nz(-4, 5), R.nz(-4, 5)], h), h }; },
 build: ({ y, h }) => { const [h0, h1] = h, x0 = fr(y[0], h0), x1 = fr(y[1] - h1 * x0, h0), x2 = fr(y[2] - h1 * x1, h0), x = [x0, x1, x2]; return {
  prompt: `A phone line adds an echo. It acts as the filter h=${vec(h)}: each received sample is ${h0 === 1 ? '' : n(h0) + ' times '}the newest sent sample plus ${h1 === 1 ? '' : par(h1) + ' times '}the sent sample before it. Three samples x₀, x₁, x₂ were sent, with silence (zeros) before and after, and the far end received y=${vec(y)}, which is x convolved with h. Work backwards to find what was sent. Enter x₀, then x₁, then x₂.`,
  answer: x,
  hints: [`Write out the convolution with the sent samples as unknowns: ${co(h0)}x₀=${n(y[0])}, then ${co(h0)}x₁${term(h1, 'x₀')}=${n(y[1])}, then ${co(h0)}x₂${term(h1, 'x₁')}=${n(y[2])}. The last received sample is only the echo of x₂: keep it for a check.`,
   'Solve from the top. The first equation has one unknown. Put its value into the second equation, then do the same for the third. Then test your x₂ against the last received sample.'],
  solution: `First sample: ${co(h0)}x₀=${n(y[0])}, so x₀=${n(x0)}. Second: ${co(h0)}x₁${plus(h1 * x0)}=${n(y[1])}, so x₁=${n(x1)}. Third: ${co(h0)}x₂${plus(h1 * x1)}=${n(y[2])}, so x₂=${n(x2)}. Check with the last received sample: ${par(h1)}·${par(x2)}=${n(y[3])}, as received. The sent samples were ${vec(x)}.`,
  guidance: [
   { prompt: `The first received sample has no echo in it, because nothing was sent before x₀: ${co(h0)}x₀=${n(y[0])}. What is x₀?`, answer: [x0], explanation: `${n(y[0])}÷${n(h0)}=${n(x0)}, so x₀=${n(x0)}.` },
   { prompt: `The second received sample is ${co(h0)}x₁ plus the echo of x₀, which is ${par(h1)}·${par(x0)}=${n(h1 * x0)}. So ${co(h0)}x₁${plus(h1 * x0)}=${n(y[1])}. What is x₁?`, answer: [x1], explanation: `${co(h0)}x₁=${n(y[1])}${plus(-h1 * x0)}=${n(y[1] - h1 * x0)}, so x₁=${n(x1)}.` },
   { prompt: `The third received sample is ${co(h0)}x₂ plus the echo of x₁, which is ${par(h1)}·${par(x1)}=${n(h1 * x1)}. So ${co(h0)}x₂${plus(h1 * x1)}=${n(y[2])}. What is x₂?`, answer: [x2], explanation: `${co(h0)}x₂=${n(y[2])}${plus(-h1 * x1)}=${n(y[2] - h1 * x1)}, so x₂=${n(x2)}. Check with the last received sample, which is only an echo: ${par(h1)}·${par(x2)}=${n(y[3])}.` }
  ] }; }
});

/* ---- q68 Gradient descent (taught: f=½xᵀHx−bᵀx has gradient Hx−b; one step is x−α·gradient; the update
        matrix is I−αH; the steps settle only if 0<α<2/λmax. Pitfall: a step that is too large diverges) ---- */
/* The cost written out for a diagonal H: "½(3x²+y²)−4x+y". */
const bowl = (h, b) => `½(${co(h[0])}x²+${co(h[1])}y²)${term(-b[0], 'x')}${term(-b[1], 'y')}`;
/* A product with the coefficient 1 left out: mulT(3,−2)="3·(−2)", mulT(1,−2)="(−2)", mulT(1,4)="4". */
const mulT = (k, v) => k === 1 ? par(v) : `${n(k)}·${par(v)}`;
const grad = (h, b) => `(${co(h[0])}x${plus(-b[0])}, ${co(h[1])}y${plus(-b[1])})`;
/* q68b: one step from a start that is not zero. The step size is 1/m. Both parts of the gradient are non-zero and
   chosen so that the step is a whole number or a half; b is non-zero, so "the gradient is −b" is never right. */
practice({ id: 'q68b', parent: 'q68', kind: 'setting',
 title: 'Two dials against the hiss',
 brief: 'A sound engineer turns two dials to make a hiss as quiet as possible, one careful downhill step at a time.',
 labels: ['gradient x', 'gradient y', 'new x', 'new y'], tolerance: 0.01 },
 [['gradient x', 'gradient y'], ['new x', 'new y']], {
 canonical: { h: [3, 1], b: [4, 1], x0: [2, -2], m: 2 },
 draw: R => { for (;;) { const m = R.pick([2, 4, 10]), top = m === 2 ? 3 : 6, u = m === 2 ? 1 : m === 4 ? 2 : 5, h1 = R.int(1, top), h = [h1, R.except(1, top, [h1])];
  const x0 = [R.nz(-4, 4), R.nz(-4, 4)], g = [u * R.nz(-3, 3), u * R.nz(-3, 3)], b = [h[0] * x0[0] - g[0], h[1] * x0[1] - g[1]];
  if (b.some(t => t === 0 || Math.abs(t) > 20)) continue; return { h, b, x0, m }; } },
 build: ({ h, b, x0, m }) => { const al = 1 / m, g = [h[0] * x0[0] - b[0], h[1] * x0[1] - b[1]], s = [fr(g[0], m), fr(g[1], m)], x1 = [fr(m * x0[0] - g[0], m), fr(m * x0[1] - g[1], m)]; return {
  prompt: `A sound engineer has two dials, bass x and treble y, and wants the hiss f to be as small as possible. The hiss is f=${bowl(h, b)}. Its gradient, the uphill direction, is ${grad(h, b)}. The dials stand at (x,y)=${vec(x0)}. One step of gradient descent moves the dials against the gradient: new dials = old dials − α·gradient, with step size α=${n(al)}. Enter the two parts of the gradient at the present dials, then the new x and the new y.`,
  answer: [g[0], g[1], x1[0], x1[1]],
  hints: ['Put the present dial settings into the gradient formula, one part at a time.',
   'Multiply each part of the gradient by the step size, then subtract the result from that dial. Subtracting a negative number moves the dial up.'],
  solution: `Gradient: ${mulT(h[0], x0[0])}${plus(-b[0])}=${n(g[0])} and ${mulT(h[1], x0[1])}${plus(-b[1])}=${n(g[1])}, so the gradient is ${vec(g)}. Step: ${n(al)}·${par(g[0])}=${n(s[0])} and ${n(al)}·${par(g[1])}=${n(s[1])}. New dials: ${n(x0[0])}−${par(s[0])}=${n(x1[0])} and ${n(x0[1])}−${par(s[1])}=${n(x1[1])}.`,
  guidance: [
   { prompt: `Put x=${n(x0[0])} and y=${n(x0[1])} into the gradient ${grad(h, b)}. Enter its two parts.`, answer: g, explanation: `${mulT(h[0], x0[0])}${plus(-b[0])}=${n(g[0])} and ${mulT(h[1], x0[1])}${plus(-b[1])}=${n(g[1])}. The gradient ${vec(g)} points uphill, so the step goes the other way.` },
   { prompt: `Step against the gradient ${vec(g)} with α=${n(al)}: work out ${n(x0[0])}−${n(al)}·${par(g[0])} and ${n(x0[1])}−${n(al)}·${par(g[1])}. Enter the new x, then the new y.`, answer: x1, explanation: `${n(x0[0])}−${par(s[0])}=${n(x1[0])} and ${n(x0[1])}−${par(s[1])}=${n(x1[1])}. The dials now stand at ${vec(x1)}.` }
  ] }; }
});

/* q68c: two steps from zero; the gradient is worked out again after the first step. Step size 1/m with b a
   multiple of 2 (m=2) or 8 (m=4), so both steps land on whole numbers or halves. */
practice({ id: 'q68c', parent: 'q68', kind: 'applied',
 title: 'Two steps for the greenhouse heaters',
 brief: 'A greenhouse computer creeps towards the cheapest heater settings, and the grower wants to know where two steps take it.',
 labels: ['north x', 'south y'], tolerance: 0.01 },
 [['north x', 'south y'], ['gradient x', 'gradient y'], ['north x', 'south y']], {
 canonical: { h: [1, 3], b: [4, 6], m: 2 },
 draw: R => { const m = R.pick([2, 4]), top = m === 2 ? 3 : 6, u = m === 2 ? 2 : 8, kmax = m === 2 ? 5 : 3, h1 = R.int(1, top); return { h: [h1, R.except(1, top, [h1])], b: [u * R.int(1, kmax), u * R.int(1, kmax)], m }; },
 build: ({ h, b, m }) => { const al = 1 / m, x1 = [fr(b[0], m), fr(b[1], m)], g = [h[0] * x1[0] - b[0], h[1] * x1[1] - b[1]], s = [fr(g[0], m), fr(g[1], m)], x2 = [fr(m * x1[0] - g[0], m), fr(m * x1[1] - g[1], m)];
  const tell = (t, bed) => t > 0 ? `The ${bed} part is positive: the first step went too far, so the next step turns that heater down.` : t < 0 ? `The ${bed} part is negative: that heater still has to go up.` : `The ${bed} part is 0: that heater is already at its best setting and will not move.`; return {
  prompt: `A greenhouse computer sets two heaters: x for the north bed and y for the south bed. The running cost is f=${bowl(h, b)}, and its gradient is ${grad(h, b)}. Both heaters start switched off, at (0,0). The computer takes two steps of gradient descent with step size α=${n(al)}. Each step is new setting = old setting − α·gradient, and the gradient is worked out afresh at each new setting. Enter the north setting x, then the south setting y, after the second step.`,
  answer: x2,
  hints: ['With both heaters off, only the last number in each part of the gradient is left. The first step is the step size times those two numbers, with the sign changed.',
   'For the second step, put the settings after step one into the gradient formula again. Do not reuse the first gradient.'],
  solution: `At (0,0) the gradient is ${vec([-b[0], -b[1]])}. Step one: 0−${n(al)}·${par(-b[0])}=${n(x1[0])} and 0−${n(al)}·${par(-b[1])}=${n(x1[1])}, so the heaters stand at ${vec(x1)}. The gradient there is ${mulT(h[0], x1[0])}−${n(b[0])}=${n(g[0])} and ${mulT(h[1], x1[1])}−${n(b[1])}=${n(g[1])}. Step two: ${n(x1[0])}−${n(al)}·${par(g[0])}=${n(x2[0])} and ${n(x1[1])}−${n(al)}·${par(g[1])}=${n(x2[1])}. After two steps the heaters stand at ${vec(x2)}.`,
  guidance: [
   { prompt: `Step one. At (0,0) the gradient is ${vec([-b[0], -b[1]])}. Work out 0−${n(al)}·${par(-b[0])} and 0−${n(al)}·${par(-b[1])}. Enter the north setting x, then the south setting y, after the first step.`, answer: x1, explanation: `${n(al)}·${n(b[0])}=${n(x1[0])} and ${n(al)}·${n(b[1])}=${n(x1[1])}. Both heaters go up, to ${vec(x1)}.` },
   { prompt: `Now the gradient at the new settings ${vec(x1)}. Work out ${mulT(h[0], x1[0])}−${n(b[0])} and ${mulT(h[1], x1[1])}−${n(b[1])}. Enter the two parts of the gradient.`, answer: g, explanation: `The gradient at ${vec(x1)} is ${vec(g)}. ${tell(g[0], 'north')} ${tell(g[1], 'south')}` },
   { prompt: `Step two. Work out ${n(x1[0])}−${n(al)}·${par(g[0])} and ${n(x1[1])}−${n(al)}·${par(g[1])}. Enter the north setting x, then the south setting y.`, answer: x2, explanation: `${n(x1[0])}−${par(s[0])}=${n(x2[0])} and ${n(x1[1])}−${par(s[1])}=${n(x2[1])}. After two steps the heaters stand at ${vec(x2)}.` }
  ] }; }
});

/* q68d: H=[[a,c],[c,a]] is not diagonal. Its modes are (1,1) and (1,−1) (spectral theorem, q26) with eigenvalues
   a+c and a−c; a>|c|>0 and a+|c| is 4, 5, 8 or 10, so the step limit 2/λmax is 0.5, 0.4, 0.25 or 0.2. The step
   size 1/m is never equal to the limit, so "safe or not" always has one answer. The two parts of the starting
   gradient never have the same size, so the start is off the best trims along both modes: a step size above the
   limit then really does run away from the trims the player is given (it cannot land on the minimum or just bounce). */
practice({ id: 'q68d', parent: 'q68', kind: 'challenge', uses: 'q26',
 title: 'Is the drone step safe',
 brief: 'A drone trims two motors that disturb each other, and the pilot must judge whether the autopilot\'s step size will settle or run away.',
 labels: ['new x', 'new y', 'largest eigenvalue', 'step limit', 'safe (1 or 0)'], tolerance: 0.004 },
 [['gradient x', 'gradient y'], ['new x', 'new y'], ['eigenvalue for (1,1)', 'eigenvalue for (1,−1)'], ['step limit', 'safe (1 or 0)']], {
 canonical: { a: 3, c: -2, b: [2, 2], x0: [2, 1], m: 2 },
 draw: R => { for (;;) { const [a, c0] = R.pick([[3, 1], [3, 2], [4, 1], [5, 3], [6, 2], [7, 1], [6, 4], [7, 3], [8, 2], [9, 1]]), c = R.bool() ? c0 : -c0, top = a + c0;
  const m = R.pick([1, 2, 4, 10]); if (2 * m === top) continue;
  const u = m === 4 ? 2 : m === 10 ? 5 : 1, x0 = [R.nz(-3, 3), R.nz(-3, 3)], g = [u * R.nz(-3, 3), u * R.nz(-3, 3)], b = [a * x0[0] + c * x0[1] - g[0], c * x0[0] + a * x0[1] - g[1]];
  if (Math.abs(g[0]) === Math.abs(g[1])) continue;
  if (b.some(t => t === 0 || Math.abs(t) > 20)) continue; return { a, c, b, x0, m }; } },
 build: ({ a, c, b, x0, m }) => { const al = 1 / m, H = [[a, c], [c, a]], Hx = [a * x0[0] + c * x0[1], c * x0[0] + a * x0[1]], g = [Hx[0] - b[0], Hx[1] - b[1]];
  const s = [fr(g[0], m), fr(g[1], m)], x1 = [fr(m * x0[0] - g[0], m), fr(m * x0[1] - g[1], m)], e1 = a + c, e2 = a - c, top = Math.max(e1, e2), limit = fr(2, top), safe = al < limit ? 1 : 0;
  /* Why a step size above the limit fails from these trims: along the mode of the largest eigenvalue the distance
     from the best trims is multiplied by 1−α·λmax at every step, and that number is below −1. */
  const runaway = `Along ${e1 > e2 ? '(1,1)' : '(1,−1)'} each step multiplies the distance from the best trims by 1−${n(al)}·${n(top)}=${n(fr(m - top, m))}, so that distance grows`; return {
  prompt: `A drone trims two motors, x and y. The motors disturb each other, so the wobble cost is f=½xᵀHx−bᵀx with H=${mat(H)} and b=${vec(b)}. Its gradient is Hx−b. The trims stand at ${vec(x0)}. First take one step of gradient descent with step size α=${n(al)}: new trims = old trims − α·gradient. Then judge the step size. H is symmetric and its two modes are the directions (1,1) and (1,−1): apply H to each one to read off its eigenvalue. Steps of this size settle down only if α is below 2 divided by the largest eigenvalue. Enter the new x, the new y, the largest eigenvalue of H, the step limit (2 divided by that eigenvalue), then 1 if this α is safe or 0 if it is not.`,
  answer: [x1[0], x1[1], top, limit, safe],
  hints: ['For the gradient, multiply H by the present trims (dot each row of H with the trims), then subtract b.',
   'H times (1,1) adds the two entries of each row. H times (1,−1) subtracts the second entry from the first. Each result is the same direction times one number, and that number is the eigenvalue.'],
  solution: `H times the trims: ${n(a)}·${par(x0[0])}+${par(c)}·${par(x0[1])}=${n(Hx[0])} and ${par(c)}·${par(x0[0])}+${n(a)}·${par(x0[1])}=${n(Hx[1])}. Subtract b: the gradient is ${vec(g)}. Step: ${n(x0[0])}−${n(al)}·${par(g[0])}=${n(x1[0])} and ${n(x0[1])}−${n(al)}·${par(g[1])}=${n(x1[1])}. Eigenvalues: H(1,1)=${vec([e1, e1])}, which is ${n(e1)} times (1,1), and H(1,−1)=${vec([e2, -e2])}, which is ${n(e2)} times (1,−1). The largest is ${n(top)}, so the step limit is 2÷${n(top)}=${n(limit)}. ${safe ? `α=${n(al)} is below the limit, so the steps settle down: enter 1.` : `α=${n(al)} is above the limit, so the steps do not settle down. ${runaway}: enter 0.`}`,
  guidance: [
   { prompt: `Multiply H=${mat(H)} by the trims ${vec(x0)}, then subtract b=${vec(b)}. Enter the two parts of the gradient.`, answer: g, explanation: `H times the trims is ${vec(Hx)}: ${n(a)}·${par(x0[0])}+${par(c)}·${par(x0[1])}=${n(Hx[0])} and ${par(c)}·${par(x0[0])}+${n(a)}·${par(x0[1])}=${n(Hx[1])}. Subtracting b gives ${vec(g)}.` },
   { prompt: `Step against the gradient ${vec(g)} with α=${n(al)}: work out ${n(x0[0])}−${n(al)}·${par(g[0])} and ${n(x0[1])}−${n(al)}·${par(g[1])}. Enter the new x, then the new y.`, answer: x1, explanation: `${n(x0[0])}−${par(s[0])}=${n(x1[0])} and ${n(x0[1])}−${par(s[1])}=${n(x1[1])}.` },
   { prompt: `Apply H=${mat(H)} to (1,1), then to (1,−1). Each result is the same direction times one number. Enter the eigenvalue for (1,1), then the eigenvalue for (1,−1).`, answer: [e1, e2], explanation: `H(1,1)=${vec([e1, e1])}=${n(e1)}·(1,1). H(1,−1)=${vec([e2, -e2])}=${n(e2)}·(1,−1). The largest eigenvalue is ${n(top)}.` },
   { prompt: `The steps settle down only if α is below 2 divided by the largest eigenvalue, ${n(top)}. Enter that limit, then 1 if α=${n(al)} is below it or 0 if it is not.`, answer: [limit, safe], explanation: `2÷${n(top)}=${n(limit)}. ${safe ? `${n(al)} is below ${n(limit)}, so this step size is safe.` : `${n(al)} is above ${n(limit)}, so this step size is too large. ${runaway} and the trims run away.`}` }
  ] }; }
});

})();
