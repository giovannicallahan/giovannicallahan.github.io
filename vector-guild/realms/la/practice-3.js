/* Linear algebra practice missions, file 3 of 14: concepts q11–q15, three practice missions each
   (q11b q11c q11d ... q15b q15c q15d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p3.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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
/* Linear expression from [[coefficient, name], ...]: "3x + 2y − z". Zero terms are skipped, a coefficient 1 is not written. */
const lin = terms => { const t = terms.filter(([c]) => c !== 0); if (!t.length) return '0';
 return t.map(([c, v], i) => { const m = Math.abs(c) === 1 ? '' : n(Math.abs(c)); return (i === 0 ? (c < 0 ? '−' : '') : (c < 0 ? ' − ' : ' + ')) + m + v; }).join(''); };
/* " + 3" / " − 2": a signed number inside a spaced sum. */
const sg = x => (x < 0 ? ' − ' : ' + ') + n(Math.abs(x));
/* "1 valve" / "3 valves" (an irregular plural is given as the third argument). */
const cnt = (k, word, plural) => `${n(k)} ${k === 1 ? word : (plural || word + 's')}`;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const total = v => v.reduce((s, x) => s + x, 0);
/* True when two rows are multiples of one another (every 2×2 block of the pair has determinant 0). */
const prop = (u, v) => u.every((_, i) => u.every((__, j) => u[i] * v[j] === u[j] * v[i]));
const same = (u, v) => u.length === v.length && u.every((x, i) => x === v[i]);
/* The last line of solving c·v = rhs: "3y = 12, so y = 4", or just "y = 4" when the coefficient is 1. */
const fin = (c, v, rhs, val) => c === 1 ? `${v} = ${n(val)}` : `${lin([[c, v]])} = ${n(rhs)}, so ${v} = ${n(val)}`;
/* The same with the arithmetic shown: "3y = 16 − 4 = 12, so y = 4", or "y = 16 − 4 = 12". */
const finc = (c, v, chain, rhs, val) => c === 1 ? `${v} = ${chain} = ${n(val)}` : `${lin([[c, v]])} = ${chain} = ${n(rhs)}, so ${v} = ${n(val)}`;

/* ================= q11 Linear systems (taught: two equations in two unknowns; add or subtract the equations, or a
   multiple of one, to remove an unknown; substitute back; check in both). The parent adds two equations with opposite y terms. ================= */

/* q11b: the same pastries on both bills, so SUBTRACTING removes them (the parent adds). Prices are whole dollars. */
practice({ id: 'q11b', parent: 'q11', kind: 'setting',
 title: 'Two café bills',
 brief: 'Two bills from the same café list different orders, and you want the price of each item.',
 labels: ['coffee price ($)', 'pastry price ($)'], tolerance: 0.01 },
 [['coffees left', 'dollars left'], ['coffee price ($)'], ['pastry price ($)']], {
 canonical: { a: 5, b: 3, c: 2, r1: 26, r2: 14 },
 /* The two prices differ, so entering them in the wrong order is caught. Order one has 2 or 3 more coffees, so a division is left. */
 draw: R => { const p = R.int(2, 6), q = R.except(1, 5, [p]), c = R.int(2, 4), a = c + R.int(2, 3), b = R.int(2, 5);
  return { a, b, c, r1: a * p + b * q, r2: c * p + b * q }; },
 build: ({ a, b, c, r1, r2 }) => { const d = a - c, p = (r1 - r2) / d, q = (r2 - c * p) / b; return {
  prompt: `Two orders at a café went on separate bills. Order one: ${n(a)} coffees and ${n(b)} pastries for $${n(r1)}. Order two: ${n(c)} coffees and ${n(b)} pastries for $${n(r2)}. Every coffee costs the same, and every pastry costs the same. Enter the price of one coffee, then the price of one pastry, in dollars.`,
  answer: [p, q],
  hints: ['Both orders hold the same number of pastries. Subtract order two from order one, items and dollars alike, and the pastries cancel.', `What is left is ${n(d)} coffees on one side and a number of dollars on the other. Divide to get one coffee, then put that price back into either order.`],
  solution: `Write x for the price of a coffee and y for the price of a pastry: ${lin([[a, 'x'], [b, 'y']])} = ${n(r1)} and ${lin([[c, 'x'], [b, 'y']])} = ${n(r2)}. Subtracting the second from the first gives ${lin([[d, 'x']])} = ${n(r1 - r2)}, so x = ${n(p)}. Order two then says ${n(c)} × ${n(p)} + ${lin([[b, 'y']])} = ${n(r2)}, so ${lin([[b, 'y']])} = ${n(r2 - c * p)} and y = ${n(q)}. A coffee costs $${n(p)} and a pastry costs $${n(q)}. Check order one: ${n(a)} × ${n(p)} + ${n(b)} × ${n(q)} = ${n(r1)}.`,
  guidance: [
   { prompt: `Write x for the price of a coffee and y for the price of a pastry. Subtract ${lin([[c, 'x'], [b, 'y']])} = ${n(r2)} from ${lin([[a, 'x'], [b, 'y']])} = ${n(r1)}. Enter the number of coffees left on the left side, then the dollars left on the right side.`, answer: [d, r1 - r2], explanation: `The pastries cancel because both orders have ${n(b)} of them. What is left is ${lin([[d, 'x']])} = ${n(r1 - r2)}.` },
   { prompt: `Solve ${lin([[d, 'x']])} = ${n(r1 - r2)}. What is the price of one coffee?`, answer: [p], explanation: `${n(r1 - r2)} ÷ ${n(d)} = ${n(p)}, so a coffee costs $${n(p)}.` },
   { prompt: `Use x = ${n(p)} in order two: ${n(c)} × ${n(p)} + ${lin([[b, 'y']])} = ${n(r2)}. What is the price of one pastry?`, answer: [q], explanation: `${lin([[b, 'y']])} = ${n(r2)} − ${n(c * p)} = ${n(r2 - c * p)}, so y = ${n(q)}. Both orders now add up.` }
  ] }; }
});

/* q11c: the two equations b + c and b − c come from two speeds the player works out first. The boat is at least
   3 km/h faster than the current, and each leg takes at least 2 whole hours. */
practice({ id: 'q11c', parent: 'q11', kind: 'applied',
 title: 'Ferry against the current',
 brief: 'A ferry timetable gives the trip with the river and the trip against it, and the pilot wants the speed of the current.',
 labels: ['boat speed (km/h)', 'current speed (km/h)'], tolerance: 0.01 },
 [['downstream speed (km/h)', 'upstream speed (km/h)'], ['boat speed (km/h)'], ['current speed (km/h)']], {
 canonical: { D: 42, t1: 3, t2: 7 },
 draw: R => { for (;;) { const b = R.int(6, 14), c = R.int(1, 5), s1 = b + c, s2 = b - c; if (s2 < 3) continue;
  const D = s1 * s2 / gcd(s1, s2), t1 = D / s1, t2 = D / s2; if (D > 180 || t1 < 2) continue; return { D, t1, t2 }; } },
 build: ({ D, t1, t2 }) => { const s1 = D / t1, s2 = D / t2, b = (s1 + s2) / 2, c = s1 - b; return {
  prompt: `A river ferry runs ${n(D)} km downstream in ${n(t1)} hours, with the current helping it. The trip back, the same ${n(D)} km upstream against the current, takes ${n(t2)} hours. Going downstream, its speed is the boat's own speed plus the speed of the current. Going upstream, it is the boat's own speed minus the speed of the current. Enter the boat's own speed, then the speed of the current, in km/h.`,
  answer: [b, c],
  hints: ['Speed is distance divided by time. Work out the downstream speed and the upstream speed first.', 'Write b for the boat and c for the current. One speed is b + c and the other is b − c. Add the two equations and c cancels.'],
  solution: `Downstream speed: ${n(D)} ÷ ${n(t1)} = ${n(s1)} km/h. Upstream speed: ${n(D)} ÷ ${n(t2)} = ${n(s2)} km/h. With b for the boat and c for the current, b + c = ${n(s1)} and b − c = ${n(s2)}. Adding gives 2b = ${n(s1 + s2)}, so b = ${n(b)}. Then b + c = ${n(s1)} gives c = ${n(s1)} − ${n(b)} = ${n(c)}. Check upstream: ${n(b)} − ${n(c)} = ${n(s2)}.`,
  guidance: [
   { prompt: `Speed is distance divided by time. Enter the downstream speed, ${n(D)} ÷ ${n(t1)}, then the upstream speed, ${n(D)} ÷ ${n(t2)}, in km/h.`, answer: [s1, s2], explanation: `${n(D)} ÷ ${n(t1)} = ${n(s1)} km/h with the current, and ${n(D)} ÷ ${n(t2)} = ${n(s2)} km/h against it.` },
   { prompt: `Write b for the boat's own speed and c for the current. Add b + c = ${n(s1)} and b − c = ${n(s2)}. The c terms cancel and leave 2b. What is b?`, answer: [b], explanation: `2b = ${n(s1)} + ${n(s2)} = ${n(s1 + s2)}, so b = ${n(b)} km/h.` },
   { prompt: `Use b = ${n(b)} in b + c = ${n(s1)}. What is c, the speed of the current?`, answer: [c], explanation: `c = ${n(s1)} − ${n(b)} = ${n(c)} km/h. Check: ${n(b)} − ${n(c)} = ${n(s2)}, the upstream speed.` }
  ] }; }
});

/* q11d: harder numbers. Nothing cancels until one equation is multiplied through (the lesson's "a multiple of one
   equation"); the parent's first pitfall (both sides) is what the multiplying step tests. */
practice({ id: 'q11d', parent: 'q11', kind: 'challenge',
 title: 'Theatre takings',
 brief: 'The box office knows how many tickets it sold and how much money came in, and needs the split between adults and children.',
 labels: ['adult tickets', 'child tickets'], tolerance: 0.01 },
 [['new right-hand side'], ['x coefficient', 'right-hand side'], ['adult tickets', 'child tickets']], {
 canonical: { N: 30, P: 12, C: 5, R: 262 },
 draw: R => { const x = R.int(6, 25), y = R.except(6, 25, [x]), C = R.int(3, 6), P = C + R.int(3, 7); return { N: x + y, P, C, R: P * x + C * y }; },
 build: ({ N, P, C, R }) => { const d = P - C, x = (R - C * N) / d, y = N - x; return {
  prompt: `A small theatre sold ${n(N)} tickets for one show. An adult ticket cost $${n(P)} and a child ticket cost $${n(C)}. The takings were $${n(R)}. Enter the number of adult tickets sold, then the number of child tickets.`,
  answer: [x, y],
  hints: [`Write x for adult tickets and y for child tickets. Counting tickets gives x + y = ${n(N)}. Counting money gives ${n(P)}x + ${n(C)}y = ${n(R)}.`, `Nothing cancels yet. Multiply every term of x + y = ${n(N)} by ${n(C)}, the right-hand side too. Then subtract the result from the money equation.`],
  solution: `With x adult and y child tickets: x + y = ${n(N)} and ${n(P)}x + ${n(C)}y = ${n(R)}. Multiply the first equation by ${n(C)}: ${n(C)}x + ${n(C)}y = ${n(C * N)}. Subtract it from the money equation: ${lin([[d, 'x']])} = ${n(R)} − ${n(C * N)} = ${n(R - C * N)}, so x = ${n(x)}. Then y = ${n(N)} − ${n(x)} = ${n(y)}. Check the money: ${n(P)} × ${n(x)} + ${n(C)} × ${n(y)} = ${n(R)}.`,
  guidance: [
   { prompt: `Write x for adult tickets and y for child tickets, so x + y = ${n(N)} and ${n(P)}x + ${n(C)}y = ${n(R)}. Multiply every term of x + y = ${n(N)} by ${n(C)}. Enter the new right-hand side.`, answer: [C * N], explanation: `${n(C)}x + ${n(C)}y = ${n(C * N)}. Both sides were multiplied, so the equation still says the same thing.` },
   { prompt: `Subtract ${n(C)}x + ${n(C)}y = ${n(C * N)} from ${n(P)}x + ${n(C)}y = ${n(R)}. Enter the coefficient of x that is left, then the right-hand side.`, answer: [d, R - C * N], explanation: `The y terms cancel: ${lin([[d, 'x']])} = ${n(R - C * N)}.` },
   { prompt: `Solve ${lin([[d, 'x']])} = ${n(R - C * N)} for x. Then use x + y = ${n(N)} to find y. Enter x, then y.`, answer: [x, y], explanation: `x = ${n(R - C * N)} ÷ ${n(d)} = ${n(x)} adult tickets, and y = ${n(N)} − ${n(x)} = ${n(y)} child tickets.` }
  ] }; }
});

/* ================= q12 Gaussian elimination (taught: back-substitution in a triangular system, last equation first;
   a minus sign stays negative when substituting). ================= */

/* q12b: the triangular system comes from three weighings; the counter pan supplies the minus signs. All weights and
   readings are positive whole kilograms. */
practice({ id: 'q12b', parent: 'q12', kind: 'setting',
 title: 'Three weighings',
 brief: 'The cargo balance has logged three weighings of spare parts, and the manifest needs the weight of each part.',
 labels: ['filter (kg)', 'valve (kg)', 'pump (kg)'], tolerance: 0.01 },
 [['filter (kg)'], ['valve (kg)'], ['pump (kg)']], {
 canonical: { a: [2, 3], b: [2, 1], c: 4, r: [13, 7, 12] },
 draw: R => { for (;;) { const z = R.int(2, 6), y = R.int(3, 9), x = R.int(5, 20), a = [R.int(1, 3), R.int(1, 4)], b = [R.int(2, 4), R.int(1, 3)], c = R.int(2, 5);
  const r = [x + a[0] * y - a[1] * z, b[0] * y - b[1] * z, c * z]; if (r[0] < 1 || r[1] < 1 || same(a, b)) continue; return { a, b, c, r }; } },
 build: ({ a, b, c, r }) => { const z = r[2] / c, y = (r[1] + b[1] * z) / b[0], x = r[0] - a[0] * y + a[1] * z;
  const e1 = `${lin([[1, 'x'], [a[0], 'y'], [-a[1], 'z']])} = ${n(r[0])}`, e2 = `${lin([[b[0], 'y'], [-b[1], 'z']])} = ${n(r[1])}`, e3 = `${lin([[c, 'z']])} = ${n(r[2])}`; return {
  prompt: `A cargo balance shows the weight on its load pan minus the weight on its counter pan, in kg. Three weighings were logged. First: 1 pump and ${cnt(a[0], 'valve')} on the load pan, ${cnt(a[1], 'filter')} on the counter pan, reading ${n(r[0])}. Second: ${cnt(b[0], 'valve')} on the load pan, ${cnt(b[1], 'filter')} on the counter pan, reading ${n(r[1])}. Third: ${cnt(c, 'filter')} on the load pan and nothing on the counter pan, reading ${n(r[2])}. Enter the weight of one filter, then one valve, then one pump, in kg.`,
  answer: [z, y, x],
  hints: ['Start with the third weighing. It holds only filters, so one division gives the weight of a filter.', `Then use the second weighing. Parts on the counter pan are subtracted: ${cnt(b[0], 'valve')} minus ${cnt(b[1], 'filter')} reads ${n(r[1])}.`],
  solution: `Write x, y, z for the weight of a pump, a valve and a filter. The weighings say ${e1}, ${e2} and ${e3}. From the last one, z = ${n(r[2])} ÷ ${n(c)} = ${n(z)}. The second becomes ${lin([[b[0], 'y']])} − ${n(b[1] * z)} = ${n(r[1])}, so ${lin([[b[0], 'y']])} = ${n(r[1] + b[1] * z)} and y = ${n(y)}. The first becomes x + ${n(a[0] * y)} − ${n(a[1] * z)} = ${n(r[0])}, so x = ${n(x)}. A filter weighs ${n(z)} kg, a valve ${n(y)} kg and a pump ${n(x)} kg.`,
  guidance: [
   { prompt: `Write z for the weight of one filter. The third weighing says ${e3}. What is z?`, answer: [z], explanation: `${n(r[2])} ÷ ${n(c)} = ${n(z)}, so a filter weighs ${n(z)} kg.` },
   { prompt: `Write y for the weight of one valve. The second weighing says ${e2}. Put z = ${n(z)} in and solve for y.`, answer: [y], explanation: `${lin([[b[0], 'y']])} − ${n(b[1] * z)} = ${n(r[1])}, so ${lin([[b[0], 'y']])} = ${n(r[1] + b[1] * z)} and y = ${n(y)}. The filters stay subtracted.` },
   { prompt: `Write x for the weight of one pump. The first weighing says ${e1}. Put y = ${n(y)} and z = ${n(z)} in. What is x?`, answer: [x], explanation: `x + ${n(a[0] * y)} − ${n(a[1] * z)} = ${n(r[0])}, so x = ${n(r[0])} − ${n(a[0] * y)} + ${n(a[1] * z)} = ${n(x)}.` }
  ] }; }
});

/* q12c: back-substitution through three job sheets, then the rates are used to price a new job. Rates are multiples
   of $5 with apprentice < fitter < lead; every count of hours is at least 2. */
practice({ id: 'q12c', parent: 'q12', kind: 'applied',
 title: 'Pricing the next job',
 brief: 'The workshop has three old job sheets and must quote the labour for a new job.',
 labels: ['apprentice ($ per hour)', 'fitter ($ per hour)', 'lead ($ per hour)', 'new job ($)'], tolerance: 0.01 },
 [['apprentice ($ per hour)', 'fitter ($ per hour)'], ['lead ($ per hour)'], ['new job ($)']], {
 canonical: { a: [2, 3, 4], b: [3, 2], c: 4, r: [250, 120, 60], h: [3, 2, 5] },
 draw: R => { for (;;) { const z = R.pick([10, 15, 20]), y = R.pick([25, 30, 35]), x = R.pick([40, 45, 50, 60]);
  const a = [R.int(2, 4), R.int(2, 5), R.int(2, 5)], b = [R.int(2, 5), R.int(2, 5)], c = R.int(2, 6), h = [R.int(2, 6), R.int(2, 6), R.int(2, 6)];
  if (same(a, h)) continue; return { a, b, c, r: [a[0] * x + a[1] * y + a[2] * z, b[0] * y + b[1] * z, c * z], h }; } },
 build: ({ a, b, c, r, h }) => { const z = r[2] / c, y = (r[1] - b[1] * z) / b[0], x = (r[0] - a[1] * y - a[2] * z) / a[0], cost = h[0] * x + h[1] * y + h[2] * z; return {
  prompt: `A workshop bills labour by the hour at three rates: lead engineer, fitter and apprentice. Three finished jobs are on file. Job A: ${n(c)} apprentice hours, $${n(r[2])}. Job B: ${n(b[0])} fitter hours and ${n(b[1])} apprentice hours, $${n(r[1])}. Job C: ${n(a[0])} lead hours, ${n(a[1])} fitter hours and ${n(a[2])} apprentice hours, $${n(r[0])}. A new job needs ${n(h[0])} lead hours, ${n(h[1])} fitter hours and ${n(h[2])} apprentice hours. Enter the hourly rate of the apprentice, then the fitter, then the lead, in dollars. Then enter the labour cost of the new job in dollars.`,
  answer: [z, y, x, cost],
  hints: ['Job A has only apprentice hours, so it gives the apprentice rate by one division. Job B then gives the fitter rate, and job C the lead rate.', 'For the new job, multiply each rate by its hours and add the three amounts.'],
  solution: `Write x, y, z for the lead, fitter and apprentice rates. Job A: ${n(c)}z = ${n(r[2])}, so z = ${n(z)}. Job B: ${n(b[0])}y + ${n(b[1])} × ${n(z)} = ${n(r[1])}, so ${n(b[0])}y = ${n(r[1] - b[1] * z)} and y = ${n(y)}. Job C: ${n(a[0])}x + ${n(a[1])} × ${n(y)} + ${n(a[2])} × ${n(z)} = ${n(r[0])}, so ${n(a[0])}x = ${n(r[0])} − ${n(a[1] * y)} − ${n(a[2] * z)} = ${n(a[0] * x)} and x = ${n(x)}. New job: ${n(h[0])} × ${n(x)} + ${n(h[1])} × ${n(y)} + ${n(h[2])} × ${n(z)} = ${n(h[0] * x)} + ${n(h[1] * y)} + ${n(h[2] * z)} = $${n(cost)}.`,
  guidance: [
   { prompt: `Write z for the apprentice rate and y for the fitter rate. Job A says ${n(c)}z = ${n(r[2])}. Job B says ${n(b[0])}y + ${n(b[1])}z = ${n(r[1])}. Solve job A first, then job B. Enter z, then y.`, answer: [z, y], explanation: `z = ${n(r[2])} ÷ ${n(c)} = ${n(z)}. Then ${n(b[0])}y = ${n(r[1])} − ${n(b[1] * z)} = ${n(r[1] - b[1] * z)}, so y = ${n(y)}.` },
   { prompt: `Write x for the lead rate. Job C says ${n(a[0])}x + ${n(a[1])}y + ${n(a[2])}z = ${n(r[0])}. Put y = ${n(y)} and z = ${n(z)} in. What is x?`, answer: [x], explanation: `${n(a[0])}x = ${n(r[0])} − ${n(a[1] * y)} − ${n(a[2] * z)} = ${n(a[0] * x)}, so x = ${n(x)}.` },
   { prompt: `The new job needs ${n(h[0])} lead hours at $${n(x)}, ${n(h[1])} fitter hours at $${n(y)} and ${n(h[2])} apprentice hours at $${n(z)}. What is its labour cost?`, answer: [cost], explanation: `${n(h[0] * x)} + ${n(h[1] * y)} + ${n(h[2] * z)} = $${n(cost)}.` }
  ] }; }
});

/* q12d: one elimination step (q11: add two equations with opposite y terms) turns the system into a chain, then
   back-substitution. The z coefficient left after adding is at least 2 in size, x has coefficient 1, and no right-hand side is 0. */
practice({ id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q11',
 title: 'Trimming the survey drone',
 brief: 'Three hover tests tie the trim settings of a survey drone together, but the tests do not form a neat chain yet.',
 labels: ['x', 'y', 'z'], tolerance: 0.01 },
 [['z coefficient', 'right-hand side'], ['z', 'y'], ['x']], {
 canonical: { a: [1, 2, -1], b: [2, 1], f: 3, r: [1, 5, 7] },
 draw: R => { for (;;) { const a = [1, R.nz(-4, 4), R.nz(-4, 4)], b = [R.int(2, 3), R.nz(-3, 3)], f = R.nz(-4, 4), s = [R.int(-5, 5), R.nz(-4, 4), R.nz(-4, 4)];
  if (Math.abs(b[1] + f) < 2) continue;
  const r = [s[0] + a[1] * s[1] + a[2] * s[2], b[0] * s[1] + b[1] * s[2], -b[0] * s[1] + f * s[2]];
  if (r.includes(0)) continue; return { a, b, f, r }; } },
 build: ({ a, b, f, r }) => { const w = b[1] + f, z = (r[1] + r[2]) / w, y = (r[1] - b[1] * z) / b[0], x = r[0] - a[1] * y - a[2] * z;
  const e1 = `${lin([[1, 'x'], [a[1], 'y'], [a[2], 'z']])} = ${n(r[0])}`, e2 = `${lin([[b[0], 'y'], [b[1], 'z']])} = ${n(r[1])}`, e3 = `${lin([[-b[0], 'y'], [f, 'z']])} = ${n(r[2])}`, ez = `${lin([[w, 'z']])} = ${n(r[1] + r[2])}`; return {
  prompt: `A survey drone has three trim settings, x, y and z. A trim can be negative. Three hover tests each pin down one combination of them: ${e1}, then ${e2}, then ${e3}. The last two tests both contain y, so this is not yet a chain you can solve from the bottom up. Remove y from the last test first, then solve. Enter x, then y, then z.`,
  answer: [x, y, z],
  hints: ['The second and third tests have opposite y terms. Add them, left sides and right sides, and y cancels.', 'After adding, one equation holds only z. Solve it, then climb the chain: the second test gives y and the first test gives x.'],
  solution: `Add the second and third tests. The y terms cancel and leave ${ez}, so z = ${n(z)}. The second test becomes ${lin([[b[0], 'y']])}${sg(b[1] * z)} = ${n(r[1])}, so ${lin([[b[0], 'y']])} = ${n(r[1] - b[1] * z)} and y = ${n(y)}. The first test gives x = ${n(r[0])}${sg(-a[1] * y)}${sg(-a[2] * z)} = ${n(x)}. The trims are x = ${n(x)}, y = ${n(y)}, z = ${n(z)}.`,
  guidance: [
   { prompt: `Add ${e2} and ${e3}, left sides and right sides. The y terms cancel. Enter the coefficient of z that is left, then the right-hand side.`, answer: [w, r[1] + r[2]], explanation: `The z terms give ${lin([[b[1], 'z'], [f, 'z']])}, which is ${lin([[w, 'z']])}, and ${n(r[1])}${sg(r[2])} = ${n(r[1] + r[2])}. The new last equation is ${ez}.` },
   { prompt: `Solve ${ez} for z. Then put z into ${e2} and solve for y. Enter z, then y.`, answer: [z, y], explanation: `z = ${n(r[1] + r[2])} ÷ ${par(w)} = ${n(z)}. Then ${lin([[b[0], 'y']])}${sg(b[1] * z)} = ${n(r[1])}, so y = ${n(y)}.` },
   { prompt: `Put y = ${n(y)} and z = ${n(z)} into ${e1}. What is x?`, answer: [x], explanation: `x = ${n(r[0])}${sg(-a[1] * y)}${sg(-a[2] * z)} = ${n(x)}. A minus sign in front of a term stays with it when you substitute.` }
  ] }; }
});

/* ================= q13 Rank (taught: rank = number of independent rows, a multiple or a combination of other rows adds
   nothing; nullity = columns − rank, not rows − rank). ================= */

const PLAYERS = ['Avery', 'Blake', 'Casey'];
/* q13b: three rows, FOUR columns, so the parent's second pitfall (rows − rank) always gives a wrong nullity. One row
   is the base, one is 2 or 3 times it, and the third is either another multiple (rank 1) or independent (rank 2).
   The rows are listed in a random order. */
practice({ id: 'q13b', parent: 'q13', kind: 'setting',
 title: 'Three stat lines',
 brief: 'A coach compares the stat lines of three players and suspects that some of them show the same pattern.',
 labels: ['rank', 'nullity'], tolerance: 0.01 },
 [['row multiplier'], ['rank'], ['nullity']], {
 canonical: { rows: [[6, 2, 3, 1], [5, 7, 2, 4], [12, 4, 6, 2]] },
 draw: R => { for (;;) { const base = [R.int(1, 6), R.int(1, 6), R.int(1, 6), R.int(1, 6)], k = R.pick([2, 3]);
  if (base.reduce(gcd) !== 1) continue;
  let third; if (R.int(1, 3) === 1) { const m = R.pick([2, 3, 4].filter(t => t !== k)); third = base.map(v => m * v); }
  else { third = [R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(1, 9)]; if (prop(third, base)) continue; }
  const three = [base, base.map(v => k * v), third], order = R.pick([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]);
  return { rows: order.map(i => three[i]) }; } },
 build: ({ rows }) => { const grouped = rows.map((r, i) => rows.some((o, j) => j !== i && prop(r, o)));
  let b = -1; rows.forEach((r, i) => { if (grouped[i] && (b < 0 || total(r) < total(rows[b]))) b = i; });
  const others = [0, 1, 2].filter(i => i !== b), mult = others.filter(i => prop(rows[i], rows[b])), free = others.filter(i => !prop(rows[i], rows[b]));
  const k = i => total(rows[i]) / total(rows[b]), rank = free.length ? 2 : 1, nul = 4 - rank, j = mult[0], B = PLAYERS[b]; return {
  prompt: `A coach lists three players' tournament totals in four columns: points, rebounds, assists, steals. ${PLAYERS[0]}: ${vec(rows[0])}. ${PLAYERS[1]}: ${vec(rows[1])}. ${PLAYERS[2]}: ${vec(rows[2])}. A row that is a multiple of another row repeats the same pattern and adds nothing new. Treat the table as a matrix with 3 rows and 4 columns. Enter its rank, then its nullity.`,
  answer: [rank, nul],
  hints: ['Compare the rows two at a time. Divide each entry of the larger row by the matching entry of the smaller row. If every column gives the same number, one row is a multiple of the other.', 'Nullity is the number of columns minus the rank. Count the columns of this table, not its rows.'],
  solution: free.length
   ? `${PLAYERS[j]}'s row is ${n(k(j))} times ${B}'s row, so it adds nothing new. ${PLAYERS[free[0]]}'s row is not a multiple of ${B}'s row: no single number fits all four columns. So two rows are independent and the rank is 2. The table has 4 columns, so the nullity is 4 − 2 = 2.`
   : `${PLAYERS[mult[0]]}'s row is ${n(k(mult[0]))} times ${B}'s row, and ${PLAYERS[mult[1]]}'s row is ${n(k(mult[1]))} times ${B}'s row. Only one row is independent, so the rank is 1. The table has 4 columns, so the nullity is 4 − 1 = 3.`,
  guidance: [
   { prompt: `Look at ${B}'s row ${vec(rows[b])} and ${PLAYERS[j]}'s row ${vec(rows[j])}. ${PLAYERS[j]}'s row is what multiple of ${B}'s row?`, answer: [k(j)], explanation: `${vec(rows[j])} = ${n(k(j))} × ${vec(rows[b])} in every column, so ${PLAYERS[j]}'s row repeats ${B}'s pattern.` },
   { prompt: free.length ? `${PLAYERS[free[0]]}'s row ${vec(rows[free[0]])} is not a multiple of ${B}'s row. Count a row and its multiples only once. How many independent rows are there? That number is the rank.` : `${PLAYERS[mult[1]]}'s row ${vec(rows[mult[1]])} is ${n(k(mult[1]))} times ${B}'s row as well. Count a row and its multiples only once. How many independent rows are there? That number is the rank.`, answer: [rank], explanation: free.length ? `${B}'s row and ${PLAYERS[free[0]]}'s row are independent, and ${PLAYERS[j]}'s row adds nothing: rank 2.` : `All three rows are multiples of ${B}'s row, so only one is independent: rank 1.` },
   { prompt: `The table has 4 columns and its rank is ${rank}. What is the nullity?`, answer: [nul], explanation: `Nullity = columns − rank = 4 − ${rank} = ${nul}. Using the 3 rows instead would give the wrong number.` }
  ] }; }
});

/* q13c: FOUR rows, three columns. The total row is a sum of the months (a combination, not a multiple) and March is
   a multiple of January. February is independent of January (rank 2) or one more multiple of it (rank 1). */
practice({ id: 'q13c', parent: 'q13', kind: 'applied',
 title: 'The padded ledger',
 brief: 'A club ledger has four rows of spending, and the treasurer wants to know how much of it is real information.',
 labels: ['rank', 'nullity', 'rows to delete'], tolerance: 0.01 },
 [['row multiplier'], ['rank'], ['nullity', 'rows to delete']], {
 canonical: { rows: [[2, 1, 3], [1, 4, 2], [4, 2, 6], [7, 7, 11]] },
 draw: R => { for (;;) { const jan = [R.int(1, 5), R.int(1, 5), R.int(1, 5)], k = R.pick([2, 3, 4]);
  if (jan.reduce(gcd) !== 1) continue;
  let feb; if (R.int(1, 3) === 1) { const m = R.pick([2, 3].filter(t => t !== k)); feb = jan.map(v => m * v); }
  else { feb = [R.int(1, 6), R.int(1, 6), R.int(1, 6)]; if (prop(feb, jan)) continue; }
  const mar = jan.map(v => k * v); return { rows: [jan, feb, mar, jan.map((v, i) => v + feb[i] + mar[i])] }; } },
 build: ({ rows }) => { const [jan, feb, mar, tot] = rows, k = total(mar) / total(jan), dep = prop(feb, jan), m = total(feb) / total(jan), rank = dep ? 1 : 2, nul = 3 - rank, del = 4 - rank; return {
  prompt: `A sports club records its spending in three columns: hall hire, kit and travel, in hundreds of dollars. January: ${vec(jan)}. February: ${vec(feb)}. March: ${vec(mar)}. A fourth row holds the total of the three months: ${vec(tot)}. Treat the four rows as a matrix with 4 rows and 3 columns. Enter its rank, then its nullity, then the number of rows you could delete without losing any information.`,
  answer: [rank, nul, del],
  hints: ['A total row is the sum of other rows, so it is a combination of them and adds nothing new. Then look for a month that is a multiple of another month.', 'Rank counts the independent rows. Nullity is columns minus rank. The rows you could delete are the rows minus the rank.'],
  solution: dep
   ? `The total row is January + February + March, a combination of the other rows, so it is not independent. March is ${n(k)} times January and February is ${n(m)} times January. Only January is independent, so the rank is 1. Nullity = 3 columns − 1 = 2. Rows you could delete: 4 − 1 = 3 (February, March and the total).`
   : `The total row is January + February + March, a combination of the other rows, so it is not independent. March is ${n(k)} times January, so it is not independent either. February is not a multiple of January, so January and February are independent and the rank is 2. Nullity = 3 columns − 2 = 1. Rows you could delete: 4 − 2 = 2 (March and the total).`,
  guidance: [
   { prompt: `Compare March ${vec(mar)} with January ${vec(jan)}. March is what multiple of January?`, answer: [k], explanation: `${vec(mar)} = ${n(k)} × ${vec(jan)}, so March repeats January's pattern.` },
   { prompt: `The total row is a sum of the months, and March is a multiple of January. ${dep ? `February is ${n(m)} times January as well.` : 'February is not a multiple of January.'} How many independent rows are there? That number is the rank.`, answer: [rank], explanation: dep ? 'Only January is independent. Every other row is built from it: rank 1.' : 'January and February are independent. March and the total are built from them: rank 2.' },
   { prompt: `The matrix has 3 columns, 4 rows and rank ${rank}. Enter the nullity (columns minus rank), then the number of rows you could delete (rows minus rank).`, answer: [nul, del], explanation: `Nullity = 3 − ${rank} = ${nul}. Rows to delete = 4 − ${rank} = ${del}. The two counts differ because the table has more rows than columns.` }
  ] }; }
});

/* q13d: one entry t is free. Row 2 starts as k × row 1, so t = k × (third entry of row 1) makes it a full multiple.
   Row 3 is (0, p, q) with p not 0, independent of row 1 (ranks 2, then 3), or a multiple of row 1 (ranks 1, then 2). */
practice({ id: 'q13d', parent: 'q13', kind: 'challenge',
 title: 'The gain that hides a sensor',
 brief: 'One sensor has an adjustable setting, and a careless choice would turn it into a copy of its neighbour.',
 labels: ['t', 'rank at that t', 'nullity at that t', 'rank for any other t'], tolerance: 0.01 },
 [['row multiplier'], ['t'], ['rank at that t', 'nullity at that t'], ['rank for any other t']], {
 canonical: { r1: [1, -2, 3], k: 2, r3: [0, 1, 2] },
 draw: R => { const r1 = [R.nz(-3, 4), R.nz(-3, 4), R.nz(-3, 4)], k = R.pick([2, 3, -2, -3]);
  if (R.int(1, 3) === 1) { const m = R.pick([2, 3, -1, -2].filter(t => t !== k)); return { r1, k, r3: r1.map(v => m * v) }; }
  return { r1, k, r3: [0, R.nz(-3, 3), R.int(-3, 3)] }; },
 build: ({ r1, k, r3 }) => { const t = k * r1[2], dep = r3[0] !== 0, m = dep ? r3[0] / r1[0] : 0, rank = dep ? 1 : 2, nul = 3 - rank, other = rank + 1, left = `(0, 0, t${t < 0 ? ' + ' : ' − '}${n(Math.abs(t))})`; return {
  prompt: `Three sensors each report a row of three readings. Sensor 1: ${vec(r1)}. Sensor 2: (${n(k * r1[0])}, ${n(k * r1[1])}, t), where t is a number the technician can set. Sensor 3: ${vec(r3)}. For exactly one value of t, sensor 2 becomes a multiple of sensor 1 and tells you nothing new. Enter that value of t. Then enter the rank and the nullity of the matrix of three rows for that t. Last, enter the rank for any other value of t.`,
  answer: [t, rank, nul, other],
  hints: ['Compare the first two entries of sensor 2 with those of sensor 1 to find the multiplier. The third entry must follow the same multiplier.', 'For any other t, take that multiple of sensor 1 away from sensor 2. Only its last entry is left, and it is not zero. Ask whether that leftover row can be built from the other independent rows.'],
  solution: dep
   ? `Sensor 2 starts (${n(k * r1[0])}, ${n(k * r1[1])}), which is ${n(k)} times (${n(r1[0])}, ${n(r1[1])}), so t must be ${n(k)} × ${par(r1[2])} = ${n(t)}. Sensor 3 is ${n(m)} times sensor 1 whatever t is. With t = ${n(t)} all three rows are multiples of sensor 1: rank 1, nullity 3 − 1 = 2. For any other t, sensor 2 is not a multiple of sensor 1, so rows 1 and 2 are independent and row 3 still adds nothing: rank 2.`
   : `Sensor 2 starts (${n(k * r1[0])}, ${n(k * r1[1])}), which is ${n(k)} times (${n(r1[0])}, ${n(r1[1])}), so t must be ${n(k)} × ${par(r1[2])} = ${n(t)}. With t = ${n(t)}, row 2 is ${n(k)} times row 1. Row 3 starts with 0 and row 1 does not, so row 3 is not a multiple of row 1: two independent rows, rank 2, nullity 3 − 2 = 1. For any other t, take ${n(k)} times row 1 away from row 2. What is left is ${left}, with a last entry that is not zero. The rows ${vec(r1)}, ${vec(r3)} and ${left} step down like a staircase, each starting one place later, so none can be built from the others: rank 3.`,
  guidance: [
   { prompt: `Sensor 2 starts (${n(k * r1[0])}, ${n(k * r1[1])}) and sensor 1 starts (${n(r1[0])}, ${n(r1[1])}). What multiplier turns the first two entries of sensor 1 into those of sensor 2?`, answer: [k], explanation: `${n(k)} × ${par(r1[0])} = ${n(k * r1[0])} and ${n(k)} × ${par(r1[1])} = ${n(k * r1[1])}, so the multiplier is ${n(k)}.` },
   { prompt: `The third entry of sensor 1 is ${n(r1[2])}. Use the same multiplier on it. What must t be?`, answer: [t], explanation: `${n(k)} × ${par(r1[2])} = ${n(t)}. With t = ${n(t)}, sensor 2 is ${n(k)} times sensor 1 in every column.` },
   { prompt: `With t = ${n(t)}, sensor 2 is a multiple of sensor 1. ${dep ? `Sensor 3 is ${n(m)} times sensor 1 as well.` : 'Sensor 3 starts with 0, so it is not a multiple of sensor 1.'} Enter the rank, then the nullity (3 columns minus the rank).`, answer: [rank, nul], explanation: dep ? 'Only one row is independent: rank 1, and nullity 3 − 1 = 2.' : 'Sensors 1 and 3 are independent and sensor 2 adds nothing: rank 2, and nullity 3 − 2 = 1.' },
   { prompt: dep ? `Now let t be any other number. Sensor 2 is then not a multiple of sensor 1. Sensor 3 is still ${n(m)} times sensor 1. How many independent rows are there now?` : `Now let t be any other number. Take ${n(k)} times sensor 1 away from sensor 2. What is left is ${left}, and its last entry is not zero. Sensor 1 starts in the first place, sensor 3 in the second place and this leftover row in the third place, so none of them can be built from the others. How many independent rows are there now?`, answer: [other], explanation: dep ? 'Sensors 1 and 2 are independent and sensor 3 adds nothing: rank 2. Changing t brought one row of information back.' : 'All three rows are independent: rank 3. Changing t brought one row of information back.' }
  ] }; }
});

/* ================= q14 Nullspace (taught: a null vector x has every row · x = 0; fix one component, solve the simpler
   equation first, substitute; every multiple of a null vector is a null vector). ================= */

/* q14b: the null vector is a change of menu that leaves two nutrient totals alone. Cheese has no fibre, so the fibre
   row starts with 0, as in the parent. All table entries are positive, so the nut packs always go down. */
practice({ id: 'q14b', parent: 'q14', kind: 'setting',
 title: 'A swap the totals cannot see',
 brief: 'A hiker wants more oat bars in the pack without changing the protein or the fibre of the food plan.',
 labels: ['change in cheese cubes', 'change in nut packs'], tolerance: 0.01 },
 [['change in nut packs'], ['protein change so far (g)'], ['change in cheese cubes']], {
 canonical: { A: [[2, 3, 4], [0, 1, 2]], z: 1 },
 draw: R => { for (;;) { const b2 = R.int(1, 3), m = R.int(1, 3), A = [[R.int(1, 4), R.int(1, 6), R.int(1, 6)], [0, b2, b2 * m]], z = R.pick([1, 1, 2, 3]);
  const x = z * (A[0][1] * m - A[0][2]) / A[0][0]; if (!Number.isInteger(x) || x === 0 || Math.abs(x) > 9) continue; return { A, z }; } },
 build: ({ A, z }) => { const [a, b] = A, y = -b[2] * z / b[1], known = a[1] * y + a[2] * z, x = -known / a[0];
  const say = (v, w) => v > 0 ? `add ${cnt(v, w)}` : `take out ${cnt(-v, w)}`; return {
  prompt: `A hiker's food plan must keep its totals of protein and fibre exactly as they are. Per portion, a cheese cube has ${n(a[0])} g of protein and 0 g of fibre, a nut pack has ${n(a[1])} g of protein and ${n(b[1])} g of fibre, and an oat bar has ${n(a[2])} g of protein and ${n(b[2])} g of fibre. The hiker adds ${cnt(z, 'oat bar')}. How must the numbers of cheese cubes and nut packs change so that both totals stay the same? Enter the change in cheese cubes, then the change in nut packs. A portion taken out is a negative number.`,
  answer: [x, y],
  hints: ['Write x, y, z for the changes in cheese cubes, nut packs and oat bars. A total stays the same when its row of grams times the changes adds up to 0. Write one such equation for protein and one for fibre.', 'Start with fibre. Cheese has none, so that equation holds only the nut packs and the oat bars.'],
  solution: `Let x, y, z be the changes in cheese cubes, nut packs and oat bars, with z = ${n(z)}. Fibre must not change: ${lin([[b[1], 'y']])} + ${n(b[2])} × ${n(z)} = 0, so y = ${n(y)}. Protein must not change: ${lin([[a[0], 'x']])} + ${n(a[1])} × ${par(y)} + ${n(a[2])} × ${n(z)} = 0, which is ${lin([[a[0], 'x']])}${sg(known)} = 0, so x = ${n(x)}. So ${say(x, 'cheese cube')} and ${say(y, 'nut pack')}. The change ${vec([x, y, z])} is a null vector of the table: neither total can see it.`,
  guidance: [
   { prompt: `Write y for the change in nut packs. Fibre must stay the same: ${lin([[b[1], 'y']])} + ${n(b[2])} × ${n(z)} = 0. What is y?`, answer: [y], explanation: `${fin(b[1], 'y', -b[2] * z, y)}. The fibre of the new oat ${z === 1 ? 'bar' : 'bars'} is cancelled by taking out nut packs.` },
   { prompt: `Now protein. The nut packs change by y = ${n(y)} and the oat bars by ${n(z)}. By how many grams has the protein changed so far? Work out ${n(a[1])} × ${par(y)} + ${n(a[2])} × ${n(z)}.`, answer: [known], explanation: `${n(a[1] * y)} + ${n(a[2] * z)} = ${n(known)} g. The cheese cubes must cancel exactly that.` },
   { prompt: `Write x for the change in cheese cubes. Protein must stay the same: ${lin([[a[0], 'x']])}${sg(known)} = 0. What is x?`, answer: [x], explanation: `${fin(a[0], 'x', -known, x)}: ${say(x, 'cheese cube')}.` }
  ] }; }
});

/* q14c: find the null vector with z = 1, then use "every multiple is a null vector" to hit a target for motor 1.
   The scale factor is never 1, so the z = 1 vector itself is always a wrong answer. */
practice({ id: 'q14c', parent: 'q14', kind: 'applied',
 title: 'Drift on the camera gantry',
 brief: 'A camera gantry can creep in a way that neither of its two position sensors reports.',
 labels: ['motor 2 turns', 'motor 3 turns'], tolerance: 0.01 },
 [['y when z = 1'], ['x when z = 1'], ['motor 2 turns', 'motor 3 turns']], {
 canonical: { A: [[1, 1, -4], [0, 1, -2]], T: 6 },
 draw: R => { for (;;) { const A = [[R.pick([1, 1, 1, 2, -1, 3]), R.nz(-4, 4), R.nz(-4, 4)], [0, R.nz(-3, 3), R.nz(-4, 4)]];
  const y = -A[1][2] / A[1][1], x = -(A[0][1] * y + A[0][2]) / A[0][0];
  if (!Number.isInteger(y) || !Number.isInteger(x) || x === 0 || Math.abs(x) > 6 || Math.abs(y) > 6) continue;
  return { A, T: R.pick([2, 3, 4, -2, -3]) * x }; } },
 build: ({ A, T }) => { const [a, b] = A, y0 = -b[2] / b[1], x0 = -(a[1] * y0 + a[2]) / a[0], s = T / x0, s1 = lin([[a[0], 'x'], [a[1], 'y'], [a[2], 'z']]), s2 = lin([[b[1], 'y'], [b[2], 'z']]); return {
  prompt: `A camera gantry has three motors and two position sensors. When the motors make x, y and z turns, sensor 1 reads ${s1} and sensor 2 reads ${s2}. A hidden drift is a set of turns, not all zero, that leaves both readings at 0. First find the hidden drift with z = 1. Every multiple of a hidden drift is hidden too. Use that to find the hidden drift in which motor 1 makes ${n(T)} turns. Enter the turns of motor 2, then of motor 3, for that drift. A negative number is a turn backwards.`,
  answer: [y0 * s, s],
  hints: ['With z = 1, sensor 2 gives y on its own. Then sensor 1 gives x.', 'Compare the x of your drift with the turns motor 1 must make. Multiply all three numbers of the drift by that same factor.'],
  solution: `With z = 1, sensor 2 reads 0 when ${lin([[b[1], 'y']])}${sg(b[2])} = 0, so y = ${n(y0)}. Sensor 1 reads 0 when ${lin([[a[0], 'x']])}${sg(a[1] * y0)}${sg(a[2])} = 0, so x = ${n(x0)}. The hidden drift with z = 1 is ${vec([x0, y0, 1])}. Motor 1 must make ${n(T)} turns, and ${n(T)} ÷ ${par(x0)} = ${n(s)}, so multiply the drift by ${n(s)}: ${vec([T, y0 * s, s])}. Motor 2 makes ${n(y0 * s)} turns and motor 3 makes ${n(s)}.`,
  guidance: [
   { prompt: `Set z = 1. Sensor 2 must read 0: ${lin([[b[1], 'y']])}${sg(b[2])} = 0. What is y?`, answer: [y0], explanation: `${fin(b[1], 'y', -b[2], y0)}.` },
   { prompt: `Sensor 1 must read 0 as well: ${s1} = 0 with y = ${n(y0)} and z = 1. What is x?`, answer: [x0], explanation: `${lin([[a[0], 'x']])}${sg(a[1] * y0)}${sg(a[2])} = 0, so x = ${n(x0)}. The hidden drift with z = 1 is ${vec([x0, y0, 1])}.` },
   { prompt: `Motor 1 must make ${n(T)} turns, not ${n(x0)}. Multiply the whole drift ${vec([x0, y0, 1])} by ${n(T)} ÷ ${par(x0)}. Enter the turns of motor 2, then of motor 3.`, answer: [y0 * s, s], explanation: `The factor is ${n(s)}. ${n(s)} × ${vec([x0, y0, 1])} = ${vec([T, y0 * s, s])}, and both sensors still read 0.` }
  ] }; }
});

/* q14d: the null vector is a set of throttles whose pulls cancel (the columns of the matrix are the pull arrows).
   Neither row has a zero, so the two equations are solved by adding them (q11): tug 2 pulls (m, −m).
   Tug 3's throttle is 2 or 3, so its pull has to be worked out. The throttles of tugs 1 and 2 come out as positive whole numbers, and no part of tug 3's arrow is 0 or beyond 9. */
practice({ id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q11',
 title: 'Three tugs, one still barge',
 brief: 'Three tugboats pull on a barge, and the harbour pilot wants it to stay exactly where it is.',
 labels: ['tug 1 throttle', 'tug 2 throttle'], tolerance: 0.01 },
 [['tug 3 east (kN)', 'tug 3 north (kN)'], ['x coefficient', 'right-hand side'], ['tug 1 throttle', 'tug 2 throttle']], {
 canonical: { d1: [3, 1], d2: [1, -1], d3: [-5, 1], z: 2 },
 draw: R => { for (;;) { const p = R.nz(-3, 4), q = R.nz(-3, 4), m = R.pick([1, 1, 2, 3, -1, -2]), u = R.int(1, 3), v = R.int(1, 3), z = R.pick([2, 2, 3]);
  if (Math.abs(p + q) < 2) continue;
  const d3 = [-(u * p + v * m), -(u * q - v * m)]; if (d3[0] === 0 || d3[1] === 0 || Math.abs(d3[0]) > 9 || Math.abs(d3[1]) > 9) continue;
  return { d1: [p, q], d2: [m, -m], d3, z }; } },
 build: ({ d1, d2, d3, z }) => { const [p, q] = d1, m = d2[0], F = [d3[0] * z, d3[1] * z], e = -F[0], f = -F[1], w = p + q, x = (e + f) / w, y = (e - p * x) / m;
  const E1 = `${lin([[p, 'x'], [m, 'y']])} = ${n(e)}`, E2 = `${lin([[q, 'x'], [-m, 'y']])} = ${n(f)}`, ex = `${lin([[w, 'x']])} = ${n(e + f)}`; return {
  prompt: `Three tugboats hold a barge still. Each tug's pull is its throttle setting times its pull arrow, in kN, written (east, north). Per unit of throttle, tug 1 pulls ${vec(d1)}, tug 2 pulls ${vec(d2)} and tug 3 pulls ${vec(d3)}. Tug 3 is at throttle ${n(z)}. The barge stays still only if the three pulls add up to zero, east and north alike. Enter the throttle of tug 1, then of tug 2.`,
  answer: [x, y],
  hints: ['Write x and y for the throttles of tugs 1 and 2. The east parts of the three pulls must add to zero, and so must the north parts. That gives two equations.', 'Move the numbers that come from tug 3 to the right-hand side. The y terms of the two equations are then opposite, so add the equations.'],
  solution: `Tug 3 pulls ${n(z)} × ${vec(d3)} = ${vec(F)} kN. East parts: ${lin([[p, 'x'], [m, 'y']])}${sg(F[0])} = 0, so ${E1}. North parts: ${lin([[q, 'x'], [-m, 'y']])}${sg(F[1])} = 0, so ${E2}. Adding the two equations gives ${ex}, so x = ${n(x)}. The east equation then gives ${finc(m, 'y', `${n(e)}${sg(-p * x)}`, e - p * x, y)}. Check: the pulls ${vec([p * x, q * x])}, ${vec([m * y, -m * y])} and ${vec(F)} add up to (0, 0). The throttles ${vec([x, y, z])} are a null vector: together they give no pull at all.`,
  guidance: [
   { prompt: `Tug 3 is at throttle ${n(z)} and its pull arrow is ${vec(d3)}. Multiply the arrow by the throttle. Enter tug 3's pull east, then north, in kN.`, answer: F, explanation: `${n(z)} × ${vec(d3)} = ${vec(F)} kN. The other two tugs must cancel exactly this.` },
   { prompt: `Write x and y for the throttles of tugs 1 and 2. East parts adding to zero gives ${E1}. North parts adding to zero gives ${E2}. Add the two equations. Enter the coefficient of x, then the right-hand side.`, answer: [w, e + f], explanation: `The y terms cancel and leave ${ex}.` },
   { prompt: `Solve ${ex} for x. Then put x into ${E1} and solve for y. Enter x, then y.`, answer: [x, y], explanation: `x = ${n(e + f)} ÷ ${par(w)} = ${n(x)}. Then ${finc(m, 'y', `${n(e)}${sg(-p * x)}`, e - p * x, y)}. The throttles ${vec([x, y, z])} make the pulls cancel.` }
  ] }; }
});

/* ================= q15 Basis and coordinates (taught: write the target as c₁b₁ + c₂b₂, match components to get two
   equations, solve, rebuild the target as a check; the coefficients are not the Cartesian coordinates). ================= */

/* q15b: line B runs along (m, m), so the two equations share the same b term and are SUBTRACTED (the parent adds).
   The answer is never the museum's own (east, north) numbers. */
practice({ id: 'q15b', parent: 'q15', kind: 'setting',
 title: 'Two slanted tram lines',
 brief: 'A visitor has a map in blocks east and north, but the trams of this city run on a slant.',
 labels: ['stops on line A', 'stops on line B'], tolerance: 0.01 },
 [['a coefficient', 'right-hand side'], ['stops on line A'], ['stops on line B']], {
 canonical: { b1: [3, 1], b2: [1, 1], t: [9, 5] },
 draw: R => { for (;;) { const p = R.nz(-3, 4), q = R.nz(-3, 4), m = R.pick([1, 1, 1, 2, 3]), c1 = R.nz(-4, 5), c2 = R.nz(-4, 5);
  if (Math.abs(p - q) < 2) continue; const t = [p * c1 + m * c2, q * c1 + m * c2];
  if ((t[0] === c1 && t[1] === c2) || (t[0] === c2 && t[1] === c1)) continue; return { b1: [p, q], b2: [m, m], t }; } },
 build: ({ b1, b2, t }) => { const [p, q] = b1, m = b2[0], w = p - q, rhs = t[0] - t[1], c1 = rhs / w, c2 = (t[0] - p * c1) / m;
  const E1 = `${lin([[p, 'a'], [m, 'b']])} = ${n(t[0])}`, E2 = `${lin([[q, 'a'], [m, 'b']])} = ${n(t[1])}`, ea = `${lin([[w, 'a']])} = ${n(rhs)}`; return {
  prompt: `In a river city the tram lines run on a slant. From the depot, each stop on line A carries you ${vec(b1)} blocks, written (east, north), and each stop on line B carries you ${vec(b2)} blocks. The museum is ${vec(t)} blocks from the depot. How many stops on each line get you there? Enter the stops on line A, then the stops on line B. A negative number means riding that line backwards.`,
  answer: [c1, c2],
  hints: ['Write a and b for the numbers of stops. Match east with east and north with north. That gives two equations in a and b.', 'Both equations have the same b term. Subtract the north equation from the east equation, left sides and right sides, so that only a is left.'],
  solution: `With a stops on line A and b stops on line B, east gives ${E1} and north gives ${E2}. Subtracting the north equation from the east equation gives ${ea}, so a = ${n(c1)}. The east equation then gives ${finc(m, 'b', `${n(t[0])}${sg(-p * c1)}`, t[0] - p * c1, c2)}. Check: ${n(c1)} × ${vec(b1)}${sg(c2)} × ${vec(b2)} = ${vec(t)}.`,
  guidance: [
   { prompt: `Write a and b for the stops on lines A and B. East gives ${E1}. North gives ${E2}. Subtract the north equation from the east equation. Enter the coefficient of a that is left, then the right-hand side.`, answer: [w, rhs], explanation: `The b terms cancel and leave ${ea}.` },
   { prompt: `Solve ${ea}. What is a, the number of stops on line A?`, answer: [c1], explanation: `a = ${n(rhs)} ÷ ${par(w)} = ${n(c1)}.` },
   { prompt: `Put a = ${n(c1)} into ${E1}. What is b, the number of stops on line B?`, answer: [c2], explanation: `${finc(m, 'b', `${n(t[0])}${sg(-p * c1)}`, t[0] - p * c1, c2)}. These two numbers are the museum's coordinates in the tram lines' own frame, not its blocks east and north.` }
  ] }; }
});

/* q15c: the target vector is not given; it is the move from the pen's position to the target point. The motors move
   the pen along (g, g) and (h, −h), as on a real belt-driven plotter, so adding the equations removes b. */
practice({ id: 'q15c', parent: 'q15', kind: 'applied',
 title: 'Turns for the plotter',
 brief: 'A pen plotter is driven by two motors that each move the pen on a diagonal, and it needs its next move in motor turns.',
 labels: ['turns of motor A', 'turns of motor B'], tolerance: 0.01 },
 [['move right (mm)', 'move up (mm)'], ['turns of motor A'], ['turns of motor B']], {
 canonical: { P: [4, 1], Q: [16, 1], g: 2, h: 3 },
 draw: R => { for (;;) { const g = R.int(1, 5), h = R.int(1, 5), c1 = R.nz(-5, 5), c2 = R.nz(-5, 5), P = [R.nz(-5, 9), R.nz(-5, 9)], t = [g * c1 + h * c2, g * c1 - h * c2];
  if (g === 1 && h === 1) continue; if ((t[0] === c1 && t[1] === c2) || (t[0] === c2 && t[1] === c1)) continue;
  return { P, Q: [P[0] + t[0], P[1] + t[1]], g, h }; } },
 build: ({ P, Q, g, h }) => { const t = [Q[0] - P[0], Q[1] - P[1]], c1 = (t[0] + t[1]) / (2 * g), c2 = (t[0] - g * c1) / h;
  const E1 = `${lin([[g, 'a'], [h, 'b']])} = ${n(t[0])}`, E2 = `${lin([[g, 'a'], [-h, 'b']])} = ${n(t[1])}`, ea = `${lin([[2 * g, 'a']])} = ${n(t[0] + t[1])}`; return {
  prompt: `A plotter moves its pen with two motors. One turn of motor A moves the pen ${vec([g, g])} mm and one turn of motor B moves it ${vec([h, -h])} mm, written (right, up). The pen is at the point ${vec(P)} and must go to the point ${vec(Q)}. First find the move the pen has to make. Then find how many turns of each motor make that move. Enter the turns of motor A, then of motor B. A negative number is a turn backwards.`,
  answer: [c1, c2],
  hints: ['The move is the target point minus the starting point, one coordinate at a time.', 'Write a and b for the turns of motors A and B. Match right with right and up with up. The b terms of the two equations are opposite, so add the equations.'],
  solution: `The move is ${vec(Q)} − ${vec(P)} = ${vec(t)} mm. With a turns of motor A and b turns of motor B, right gives ${E1} and up gives ${E2}. Adding gives ${ea}, so a = ${n(c1)}. Then ${finc(h, 'b', `${n(t[0])}${sg(-g * c1)}`, t[0] - g * c1, c2)}. Check: ${n(c1)} × ${vec([g, g])}${sg(c2)} × ${vec([h, -h])} = ${vec(t)}.`,
  guidance: [
   { prompt: `Subtract the starting point ${vec(P)} from the target point ${vec(Q)}, one coordinate at a time. Enter the move to the right, then the move up, in mm.`, answer: t, explanation: `${n(Q[0])} − ${par(P[0])} = ${n(t[0])} and ${n(Q[1])} − ${par(P[1])} = ${n(t[1])}. The pen must move ${vec(t)} mm.` },
   { prompt: `Write a and b for the turns of motors A and B. Right gives ${E1}. Up gives ${E2}. Add the two equations and solve for a.`, answer: [c1], explanation: `The b terms cancel and leave ${ea}, so a = ${n(c1)}.` },
   { prompt: `Put a = ${n(c1)} into ${E1}. What is b, the turns of motor B?`, answer: [c2], explanation: `${finc(h, 'b', `${n(t[0])}${sg(-g * c1)}`, t[0] - g * c1, c2)}. The turns ${vec([c1, c2])} are the move's coordinates in the motors' own frame.` }
  ] }; }
});

/* q15d: a basis of three vectors in a staircase shape, so matching components gives a triangular system that is
   solved from the bottom up (q12). Each preset's own colour (the diagonal) is 2 or 3, the other entries 1 to 3.
   Levels are whole numbers from 1 to 5 and never equal the colour's own numbers. */
practice({ id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q12',
 title: 'Mixing a stage colour',
 brief: 'A lighting designer wants one exact colour from a lamp that only offers three fixed presets.',
 labels: ['level of preset A', 'level of preset B', 'level of preset C'], tolerance: 0.01 },
 [['level of preset C'], ['level of preset B'], ['level of preset A']], {
 canonical: { A: [2, 0, 0], B: [1, 2, 0], C: [3, 1, 2], t: [13, 8, 4] },
 draw: R => { for (;;) { const A = [R.int(2, 3), 0, 0], B = [R.int(1, 3), R.int(2, 3), 0], C = [R.int(1, 3), R.int(1, 3), R.int(2, 3)], c = [R.int(1, 5), R.int(1, 5), R.int(1, 5)];
  const t = [0, 1, 2].map(i => c[0] * A[i] + c[1] * B[i] + c[2] * C[i]); if (same(t, c)) continue; return { A, B, C, t }; } },
 build: ({ A, B, C, t }) => { const c3 = t[2] / C[2], c2 = (t[1] - C[1] * c3) / B[1], c1 = (t[0] - B[0] * c2 - C[0] * c3) / A[0];
  const eb = `${lin([[C[2], 'c']])} = ${n(t[2])}`, eg = `${lin([[B[1], 'b'], [C[1], 'c']])} = ${n(t[1])}`, er = `${lin([[A[0], 'a'], [B[0], 'b'], [C[0], 'c']])} = ${n(t[0])}`; return {
  prompt: `A stage lamp mixes red, green and blue light, written (red, green, blue). It has three presets. At level 1, preset A gives ${vec(A)}, preset B gives ${vec(B)} and preset C gives ${vec(C)}. A preset set to level k gives k times its light, and the lights of the three presets add up. The designer wants the colour ${vec(t)}. Enter the level of preset A, then B, then C.`,
  answer: [c1, c2, c3],
  hints: ['Write a, b, c for the three levels and match one colour at a time. Blue comes from preset C only, so start there.', 'Green comes from presets B and C. Once you know c, the green equation gives b. Red comes last and gives a.'],
  solution: `With levels a, b, c: blue gives ${eb}, so c = ${n(c3)}. Green gives ${eg}, so ${lin([[B[1], 'b']])} = ${n(t[1])} − ${n(C[1] * c3)} = ${n(t[1] - C[1] * c3)} and b = ${n(c2)}. Red gives ${er}, so ${lin([[A[0], 'a']])} = ${n(t[0])} − ${n(B[0] * c2)} − ${n(C[0] * c3)} = ${n(A[0] * c1)} and a = ${n(c1)}. Check: ${n(c1)} × ${vec(A)} + ${n(c2)} × ${vec(B)} + ${n(c3)} × ${vec(C)} = ${vec(t)}.`,
  guidance: [
   { prompt: `Write c for the level of preset C. Only preset C has blue in it, so the blue parts give ${eb}. What is c?`, answer: [c3], explanation: `c = ${n(t[2])} ÷ ${n(C[2])} = ${n(c3)}.` },
   { prompt: `Write b for the level of preset B. The green parts give ${eg}. Put c = ${n(c3)} in and solve for b.`, answer: [c2], explanation: `${lin([[B[1], 'b']])} = ${n(t[1])} − ${n(C[1] * c3)} = ${n(t[1] - C[1] * c3)}, so b = ${n(c2)}.` },
   { prompt: `Write a for the level of preset A. The red parts give ${er}. Put b = ${n(c2)} and c = ${n(c3)} in and solve for a.`, answer: [c1], explanation: `${lin([[A[0], 'a']])} = ${n(t[0])} − ${n(B[0] * c2)} − ${n(C[0] * c3)} = ${n(A[0] * c1)}, so a = ${n(c1)}. The levels ${vec([c1, c2, c3])} are the colour's coordinates in the presets' frame.` }
  ] }; }
});

})();
