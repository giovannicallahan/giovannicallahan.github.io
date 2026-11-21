/* Linear algebra practice missions, file 4 of 14: concepts q16–q20, three practice missions each
   (q16b q16c q16d ... q20b q20c q20d; 15 missions). Format and rules: docs/PACK-FORMAT.md, "Practice missions"
   and "Linear algebra practice" (the worked sample is q01b in practice-1.js).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench, the labs and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator), or by practice(meta, stepLabels,
   generator), which takes the authored text from build(canonical) so the two cannot drift apart.
   Oracles: qa/realms/la/oracle-p4.js. This is a classic script (the Android app loads from file://): no import, no fetch. */
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

/* ---- add missions for q16–q20 below this line ---- */

/* ---- shared helpers for this file ---- */
/* "2x − y + 3z": a linear expression; a coefficient 1 is not written and a zero term is left out. */
const lin = ts => { let s = ''; for (const [c, v] of ts) { if (!c) continue; const m = Math.abs(c) === 1 ? '' : n(Math.abs(c)); s += s ? (c < 0 ? ' − ' : ' + ') + m + v : (c < 0 ? '−' : '') + m + v; } return s; };
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const T = G.tidy;
/* " + 6" or " − 12": a signed number as the next term of a written sum, with spaces round the sign. */
const pm = x => (x < 0 ? ' − ' : ' + ') + n(Math.abs(x));

/* ---- q16 Subspaces and intersections ----
   Parent: x+y+z=0 and x−y=0 with z fixed; answer x, y, z and the dimension (1). */

/* A household budget: the fixed number is x (not z) and the second rule is a ratio. */
practice({ id: 'q16b', parent: 'q16', kind: 'setting',
 title: 'Budget lines that balance',
 brief: 'A household wants to shift money between three budget lines without breaking its two rules.',
 labels: ['y (travel)', 'z (savings)', 'dimension'], tolerance: 0.01 },
 [['y (travel)'], ['z (savings)'], ['dimension']], {
 canonical: { k: 3, a: 20 },
 draw: R => ({ k: R.pick([2, 3, 4, 5]), a: 10 * R.nz(-9, 9) }),
 build: ({ k, a }) => { const y = k * a, z = -(1 + k) * a; return {
  prompt: `A household shifts money between three monthly budget lines. The changes are x for food, y for travel and z for savings, in dollars. A minus sign means a cut. Two rules hold. Rule 1: the total does not change, so x + y + z = 0. Rule 2: the travel change is ${n(k)} times the food change, so y − ${n(k)}x = 0. Enter the allowed change that has x = ${n(a)}: give y, then z. Then enter the dimension of the set of all allowed changes, counted before x is fixed.`,
  answer: [y, z, 1],
  hints: ['Rule 2 turns the food change straight into the travel change. Then rule 1 gives the savings change, because the three changes add to zero.', 'For the dimension, start from three free numbers and take one away for each independent rule. Fixing x picks one change; it does not shrink the whole set.'],
  solution: `Rule 2 gives y = ${n(k)} × ${par(a)} = ${n(y)}. Rule 1 then reads ${n(a)} + ${par(y)} + z = 0, so z = ${n(z)}. The allowed change is ${vec([a, y, z])}. Three numbers with two independent rules leave 3 − 2 = 1 free number, so all the allowed changes form a line: dimension 1.`,
  guidance: [
   { prompt: `Rule 2 says y = ${n(k)}x. With x = ${n(a)}, what is y?`, answer: [y], explanation: `${n(k)} × ${par(a)} = ${n(y)}. Travel moves the same way as food, ${n(k)} times as far.` },
   { prompt: `Rule 1 says x + y + z = 0. With x = ${n(a)} and y = ${n(y)}, what is z?`, answer: [z], explanation: `${n(a)} + ${par(y)} = ${n(a + y)}, so z must be ${n(z)} to bring the total back to zero.` },
   { prompt: 'A change is three numbers. The two rules are independent, and each one removes one free number. How many free numbers are left? That count is the dimension.', answer: [1], explanation: 'One free number is left: choose x and the rules fix y and z. The allowed changes form a line through (0, 0, 0), a subspace of dimension 1. The single change you found is one point on that line.' }
  ] }; }
});

/* A feed mix: the second rule is a weighted sum, so one elimination step is needed before the fixed number goes in. */
practice({ id: 'q16c', parent: 'q16', kind: 'applied',
 title: 'Swap the feed, keep the protein',
 brief: 'The greenhouse wants to swap grains in its feed mix while the weight and the protein both stay the same.',
 labels: ['x (oats)', 'y (barley)', 'dimension'], tolerance: 0.01 },
 [['y coefficient', 'z coefficient'], ['y (barley)'], ['x (oats)', 'dimension']], {
 canonical: { p: 2, d: 1, m: 3, z: 2, w: 2 },
 /* Protein units per kg are p, p+d and p+d·m, so y = −m·z and x = (m−1)·z are whole numbers.
    w = 2 or 4 adds a third written rule, rule 1 in half- or quarter-kilograms (w = 0: no third rule). It repeats rule 1,
    so the written rules (3) and the independent rules (2) differ and the dimension is not "3 minus the rules listed". */
 draw: R => ({ p: R.int(1, 4), d: R.int(1, 3), m: R.pick([2, 3, 4]), z: R.nz(-4, 4), w: R.pick([0, 2, 2, 4]) }),
 build: ({ p, d, m, z, w }) => { const q = p + d, r = p + d * m, y = -m * z, x = (m - 1) * z, times = p === 1 ? 'rule 1' : `${n(p)} times rule 1`, rule3 = w ? lin([[w, 'x'], [w, 'y'], [w, 'z']]) : ''; return {
  prompt: `A feed mix uses oats, barley and soy. One kilogram holds ${n(p)}, ${n(q)} and ${n(r)} units of protein, in that order. The mix is changed by x kg of oats, y kg of barley and z kg of soy, where a minus sign means less of that grain. Rule 1: the total weight stays the same, so x + y + z = 0. Rule 2: the total protein stays the same, so ${lin([[p, 'x'], [q, 'y'], [r, 'z']])} = 0.${w ? ` Rule 3: the store log counts the weight in ${w === 2 ? 'half' : 'quarter'}-kilograms, so ${rule3} = 0.` : ''} The soy change is fixed at z = ${n(z)}. Enter x, then y. Then enter the dimension of the set of all allowed swaps, counted before z is fixed.`,
  answer: [x, y, 1],
  hints: [`Remove x first: take ${times} away from rule 2. What is left has only y and z in it.`, 'Put the fixed soy change into that shorter equation to get y. Then rule 1 gives x. For the dimension, count three numbers and take away the independent rules.' + (w ? ' A rule that only repeats another rule is not independent.' : '')],
  solution: `Take ${times} away from rule 2: ${lin([[d, 'y'], [d * m, 'z']])} = 0. With z = ${n(z)} this gives y = ${n(y)}. Rule 1 then gives x = −y − z = ${n(x)}. The swap is ${vec([x, y, z])}. Check the protein: ${n(p)} × ${par(x)} + ${n(q)} × ${par(y)} + ${n(r)} × ${par(z)} = 0.${w ? ` Rule 3 is rule 1 multiplied by ${n(w)}, so it adds nothing new.` : ''} Three numbers with two independent rules leave one free number, so the allowed swaps form a line: dimension 1.`,
  guidance: [
   { prompt: `Take ${times} away from rule 2, so the x terms cancel. Enter the number left in front of y, then the number left in front of z.`, answer: [d, d * m], explanation: `In front of y: ${n(q)} − ${n(p)} = ${n(d)}. In front of z: ${n(r)} − ${n(p)} = ${n(d * m)}. The shorter rule is ${lin([[d, 'y'], [d * m, 'z']])} = 0.` },
   { prompt: `Put z = ${n(z)} into ${lin([[d, 'y'], [d * m, 'z']])} = 0 and solve for y.`, answer: [y], explanation: d === 1 ? `${n(m)} × ${par(z)} = ${n(m * z)}, so y must be ${n(y)} to bring the left side to zero.` : `${n(d * m)} × ${par(z)} = ${n(d * m * z)}, so ${lin([[d, 'y']])} = ${n(-d * m * z)} and y = ${n(y)}.` },
   { prompt: `Rule 1 says x + y + z = 0, with y = ${n(y)} and z = ${n(z)}. Enter x. Then enter the dimension: three numbers minus the number of independent rules.${w ? ` Compare rule 3 with rule 1 before you count.` : ''}`, answer: [x, 1], explanation: `x = −${par(y)} − ${par(z)} = ${n(x)}. ${w ? `Rule 3 is rule 1 multiplied by ${n(w)}, so only 2 of the 3 written rules are independent. ` : ''}Each independent rule removes one free number, so 3 − 2 = 1 is left: a line of allowed swaps, of which this is one point.` }
  ] }; }
});

/* Four numbers and a list with a rule that adds nothing: the dimension comes from the rank, not from the count of rules. */
practice({ id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q13',
 title: 'Corrections to the quarterly table',
 brief: 'An analyst may correct four quarterly figures, but only in ways that obey every rule on the audit list.',
 labels: ['independent rules', 'dimension', 'x', 'z'], tolerance: 0.01 },
 [['independent among rules 1 to 3'], ['independent rules', 'dimension'], ['x', 'z']], {
 canonical: { rules: 3, a: 5, c: -2 },
 /* With four rules, rule 4 (w − y = 0) forces y = w, so the stated y equals the stated w. */
 draw: R => { const rules = R.pick([3, 4]), a = R.nz(-9, 9), c = rules === 4 ? a : R.nz(-9, 9); return { rules, a, c }; },
 build: ({ rules, a, c }) => { const four = rules === 4, rank = four ? 3 : 2, dim = 4 - rank; return {
  prompt: `A sales table has one figure for each of four quarters. An analyst may correct them by (w, x, y, z), one number per quarter in order, but the corrections must obey every rule on this list. Rule 1: the year total stays the same, so w + x + y + z = 0. Rule 2: the first half-year stays the same, so w + x = 0. Rule 3: the second half-year stays the same, so y + z = 0.${four ? ' Rule 4: quarters one and three change by the same amount, so w − y = 0.' : ''} Enter the number of independent rules, which is the rank of the list. Enter the dimension of the set of allowed corrections. Then, for the allowed correction with w = ${n(a)} and y = ${n(c)}, enter x and z.`,
  answer: [rank, dim, -a, -c],
  hints: ['Add rule 2 and rule 3 and compare the result with rule 1. A rule you can build from the others is not independent.', 'The dimension is the count of numbers in a correction minus the count of independent rules, not minus the count of rules written. Rule 2 then gives x from w, and rule 3 gives z from y.'],
  solution: `Rule 2 plus rule 3 is w + x + y + z = 0, which is rule 1, so rule 1 adds nothing: rules 1 to 3 contain only 2 independent rules.${four ? ' Rule 4 compares a first-half quarter with a second-half quarter, which rules 2 and 3 never do, so it is new.' : ''} Independent rules: ${n(rank)}. Dimension: 4 − ${n(rank)} = ${n(dim)}. With w = ${n(a)}, rule 2 gives x = ${n(-a)}. With y = ${n(c)}, rule 3 gives z = ${n(-c)}. The correction is ${vec([a, -a, c, -c])}.`,
  guidance: [
   { prompt: 'Add the left sides of rule 2 and rule 3. You get w + x + y + z, the left side of rule 1. So how many of rules 1, 2 and 3 are independent?', answer: [2], explanation: 'Rule 1 is rule 2 plus rule 3, so it adds no new information. Rules 2 and 3 use different quarters, so neither is built from the other. That leaves 2.' },
   { prompt: four ? 'Rule 4 is w − y = 0. Rules 2 and 3 never link a first-half quarter to a second-half one, so rule 4 is new. Enter the number of independent rules in the whole list. Then enter the dimension: four numbers minus that count.' : 'There are no more rules. Enter the number of independent rules in the whole list. Then enter the dimension: four numbers minus that count.', answer: [rank, dim], explanation: `The rank is ${n(rank)}, so 4 − ${n(rank)} = ${n(dim)} free ${dim === 1 ? 'number is' : 'numbers are'} left. Counting all ${n(rules)} written rules would give the wrong dimension.` },
   { prompt: `Now the correction with w = ${n(a)} and y = ${n(c)}. Rule 2 says w + x = 0 and rule 3 says y + z = 0. Enter x, then z.`, answer: [-a, -c], explanation: `x = ${n(-a)} cancels w, and z = ${n(-c)} cancels y.${four ? ` Rule 4 holds too, because w and y are both ${n(a)}.` : ''} Rule 1 then holds without any more work, because it is rule 2 plus rule 3.` }
  ] }; }
});

/* ---- q17 Linear maps ----
   Parent: T(e₁), T(e₂) in the plane, enter T(v). Pitfall: the images are columns, not rows. */

/* Two inputs, three outputs: a bakery order mapped to ingredients. */
practice({ id: 'q17b', parent: 'q17', kind: 'setting',
 title: 'From bakery order to shopping list',
 brief: 'The bakery turns each morning order into a shopping list, and the list is a linear map of the order.',
 labels: ['flour (kg)', 'butter (kg)', 'sugar (kg)'], tolerance: 0.01 },
 [['loaves flour', 'loaves butter', 'loaves sugar'], ['buns flour', 'buns butter', 'buns sugar'], ['flour (kg)', 'butter (kg)', 'sugar (kg)']], {
 canonical: { u: [4, 1, 1], w: [3, 2, 1], x: 5, y: 2 },
 draw: R => { let p; do { p = { u: [R.int(2, 6), R.int(1, 4), R.int(1, 3)], w: [R.int(2, 6), R.int(1, 4), R.int(1, 3)], x: R.int(2, 6), y: R.int(2, 6) }; } while (p.x === p.y || p.u.every((v, i) => v === p.w[i])); return p; },
 build: ({ u, w, x, y }) => { const su = u.map(v => x * v), sw = w.map(v => y * v), tot = su.map((v, i) => v + sw[i]); return {
  prompt: `A bakery works out its shopping from the order. One tray of loaves needs ${vec(u)}: kilograms of flour, butter and sugar, in that order. One tray of buns needs ${vec(w)}. Needs add up and scale with the number of trays, so the map from an order to its ingredients is linear, and these two lists are its values on the orders (1, 0) and (0, 1). Today's order is ${n(x)} trays of loaves and ${n(y)} trays of buns. Enter the kilograms of flour, then butter, then sugar.`,
  answer: tot,
  hints: [`The order is ${n(x)} lots of the loaf list plus ${n(y)} lots of the bun list.`, 'Scale each list by its number of trays first. Then add the two scaled lists entry by entry: flour with flour, butter with butter, sugar with sugar.'],
  solution: `${n(x)} × ${vec(u)} = ${vec(su)} for the loaves. ${n(y)} × ${vec(w)} = ${vec(sw)} for the buns. Added entry by entry: ${vec(tot)}. The bakery needs ${n(tot[0])} kg of flour, ${n(tot[1])} kg of butter and ${n(tot[2])} kg of sugar.`,
  guidance: [
   { prompt: `One tray of loaves needs ${vec(u)}. What do ${n(x)} trays need? Enter flour, butter, sugar.`, answer: su, explanation: `Every entry is multiplied by ${n(x)}: ${vec(su)}.` },
   { prompt: `One tray of buns needs ${vec(w)}. What do ${n(y)} trays need? Enter flour, butter, sugar.`, answer: sw, explanation: `Every entry is multiplied by ${n(y)}: ${vec(sw)}.` },
   { prompt: `Add ${vec(su)} and ${vec(sw)} entry by entry. Enter flour, butter, sugar.`, answer: tot, explanation: `${n(su[0])} + ${n(sw[0])} = ${n(tot[0])}, ${n(su[1])} + ${n(sw[1])} = ${n(tot[1])} and ${n(su[2])} + ${n(sw[2])} = ${n(tot[2])}. A linear map sends a sum of orders to the sum of their ingredient lists.` }
  ] }; }
});

/* The probes are (1, 0) and (1, 1), not the standard pair: linearity gives T(0, 1) first. */
practice({ id: 'q17c', parent: 'q17', kind: 'applied',
 title: 'Two test dots on the canvas',
 brief: 'A drawing program slants a picture, and only two test dots show what the tool does.',
 labels: ['T(0,1) x', 'T(0,1) y', 'landing x', 'landing y'], tolerance: 0.01 },
 [['T(0,1) x', 'T(0,1) y'], ['scaled first x', 'scaled first y'], ['landing x', 'landing y']], {
 canonical: { e1: [3, -1], s: [5, 2], v: [4, 3] },
 /* T(0,1) = s − e1 = (c, d). b ≠ c, so reading the two images as rows gives a different landing point. */
 draw: R => { let a, b, c, d; do { a = R.nz(-4, 5); b = R.nz(-4, 5); c = R.nz(-4, 5); d = R.nz(-4, 5); } while (b === c || a * d - b * c === 0); const x = R.int(2, 5); return { e1: [a, b], s: [a + c, b + d], v: [x, R.except(2, 5, [x])] }; },
 build: ({ e1, s, v }) => { const [a, b] = e1, c = s[0] - a, d = s[1] - b, [x, y] = v, f = [x * a, x * b], g = [y * c, y * d], out = [f[0] + g[0], f[1] + g[1]]; return {
  prompt: `A drawing program stretches and slants a picture with a linear map T. Two test dots show what it does. The dot at (1, 0) lands at ${vec(e1)}. The dot at (1, 1) lands at ${vec(s)}. Note that (1, 1) is (1, 0) plus (0, 1). Enter where the dot at (0, 1) lands: x, then y. Then enter where the dot at ${vec(v)} lands: x, then y.`,
  answer: [c, d, out[0], out[1]],
  hints: ['A linear map keeps sums: T(1, 1) = T(1, 0) + T(0, 1). So T(0, 1) is T(1, 1) minus T(1, 0).', `The dot ${vec(v)} is ${n(x)} lots of (1, 0) plus ${n(y)} lots of (0, 1). Scale the two landing points the same way, then add them.`],
  solution: `T(0, 1) = T(1, 1) − T(1, 0) = ${vec(s)} − ${vec(e1)} = ${vec([c, d])}. Then T${vec(v)} = ${n(x)} × ${vec(e1)} + ${n(y)} × ${vec([c, d])} = ${vec(f)} + ${vec(g)} = ${vec(out)}.`,
  guidance: [
   { prompt: `T(1, 1) = T(1, 0) + T(0, 1). Subtract: ${vec(s)} − ${vec(e1)}. Enter T(0, 1): x, then y.`, answer: [c, d], explanation: `${n(s[0])} − ${par(a)} = ${n(c)} and ${n(s[1])} − ${par(b)} = ${n(d)}. The dot at (0, 1) lands at ${vec([c, d])}.` },
   { prompt: `The dot ${vec(v)} is ${n(x)} lots of (1, 0) plus ${n(y)} lots of (0, 1). Compute ${n(x)} × T(1, 0) = ${n(x)} × ${vec(e1)}. Enter x, then y.`, answer: f, explanation: `Both entries are multiplied by ${n(x)}: ${vec(f)}.` },
   { prompt: `Now ${n(y)} × T(0, 1) = ${n(y)} × ${vec([c, d])} = ${vec(g)}. Add it to ${vec(f)}. Enter where the dot lands: x, then y.`, answer: out, explanation: `${n(f[0])}${pm(g[0])} = ${n(out[0])} and ${n(f[1])}${pm(g[1])} = ${n(out[1])}. Each landing point is used whole, as a column: its x goes to the x sum and its y to the y sum.` }
  ] }; }
});

/* The map run backwards: which input gives this output? Two equations, as in q11. */
practice({ id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q11',
 title: 'Motor turns for the robot hand',
 brief: 'The robot hand must reach a marked spot, and the crew needs the motor turns that take it there.',
 labels: ['turns of A', 'turns of B'], tolerance: 0.01 },
 [['x coefficient', 'right side'], ['turns of A'], ['turns of B']], {
 canonical: { ma: [3, 1], mb: [2, 4], target: [12, 14] },
 /* target = x·ma + y·mb with whole turns x, y. Reading the two moves as rows does not give the same target.
    The number left in front of x (a·d − b·c) is never 0, 1 or −1, so guided step 2 always has a division to do. */
 draw: R => { let a, b, c, d, x, y; do { a = R.nz(-3, 4); b = R.nz(-3, 4); c = R.pick([2, 3, 4]); d = R.pick([2, 3, 4]); x = R.nz(-4, 5); y = R.nz(-4, 5); } while (Math.abs(a * d - b * c) < 2 || c === d || x === y || (a * x + b * y === a * x + c * y && c * x + d * y === b * x + d * y)); return { ma: [a, b], mb: [c, d], target: [a * x + c * y, b * x + d * y] }; },
 build: ({ ma, mb, target }) => { const [a, b] = ma, [c, d] = mb, [p, q] = target, det = a * d - b * c, rhs = d * p - c * q, x = Math.round(rhs / det), y = Math.round((p - a * x) / c), e1 = `${lin([[a, 'x'], [c, 'y']])} = ${n(p)}`, e2 = `${lin([[b, 'x'], [d, 'y']])} = ${n(q)}`; return {
  prompt: `A robot hand is driven by two motors, and the move of its tip is a linear map of the motor turns. One turn of motor A moves the tip by ${vec(ma)} cm. One turn of motor B moves it by ${vec(mb)} cm. A negative number of turns runs a motor backwards. The tip must move by ${vec(target)} cm in total. Enter the turns of motor A, then the turns of motor B.`,
  answer: [x, y],
  hints: [`Call the turns x for motor A and y for motor B. The tip moves by x × ${vec(ma)} + y × ${vec(mb)}. Match the first entries, then the second entries, to get two equations.`, 'Solve the two equations as a linear system: multiply them so one unknown has the same number in front in both, then subtract.'],
  solution: `First entries: ${e1}. Second entries: ${e2}. Multiply the first equation by ${n(d)} and the second by ${n(c)}, then subtract the second from the first: ${lin([[det, 'x']])} = ${n(rhs)}, so x = ${n(x)}. The first equation then gives ${lin([[c, 'y']])} = ${n(p)} − ${par(a * x)} = ${n(c * y)}, so y = ${n(y)}. Check: ${n(x)} × ${vec(ma)} + ${par(y)} × ${vec(mb)} = ${vec(target)}.`,
  guidance: [
   { prompt: `With x turns of A and y turns of B, the two equations are ${e1} and ${e2}. Multiply the first by ${n(d)} and the second by ${n(c)}, then subtract the second from the first so that y cancels. Enter the number left in front of x, then the number on the right.`, answer: [det, rhs], explanation: `In front of x: ${n(d)} × ${par(a)} − ${n(c)} × ${par(b)} = ${n(det)}. On the right: ${n(d)} × ${par(p)} − ${n(c)} × ${par(q)} = ${n(rhs)}.` },
   { prompt: `Solve ${lin([[det, 'x']])} = ${n(rhs)}. How many turns of motor A?`, answer: [x], explanation: `${n(rhs)} ÷ ${par(det)} = ${n(x)}.` },
   { prompt: `Put x = ${n(x)} into ${e1} and solve for y. How many turns of motor B?`, answer: [y], explanation: `${n(a)} × ${par(x)} = ${n(a * x)}, so ${lin([[c, 'y']])} = ${n(c * y)} and y = ${n(y)}. Each motor's move is one column of the map: A's move multiplies x in both equations.` }
  ] }; }
});

/* ---- q18 Orthogonal projection ----
   Parent: project v onto the line of u in the plane. Pitfall: divide by u·u, not by the length of u. */

/* The projection as the nearest point of a road. */
practice({ id: 'q18b', parent: 'q18', kind: 'setting',
 title: 'Nearest spot on the road',
 brief: 'A farm needs a track to the main road, and the shortest track meets the road at its nearest spot.',
 labels: ['nearest spot x', 'nearest spot y'], tolerance: 0.01 },
 [['u·v', 'u·u'], ['projection number'], ['nearest spot x', 'nearest spot y']], {
 canonical: { u: [2, 1], v: [4, 7] },
 /* (u·v)/(u·u) is a whole number or a half, never 0 or 1, at most 4 in size; the farm is not on the road; u has no zero entry, so u·u is at least 2. */
 draw: R => { let u, v, uu, uv; do { u = [R.nz(-3, 4), R.nz(-3, 4)]; v = [R.nz(-9, 9), R.nz(-9, 9)]; uu = dot(u, u); uv = dot(u, v); } while (uv === 0 || (2 * uv) % uu !== 0 || Math.abs(uv / uu) > 4 || uv === uu || u[0] * v[1] - u[1] * v[0] === 0); return { u, v }; },
 build: ({ u, v }) => { const uv = dot(u, v), uu = dot(u, u), al = uv / uu, pr = u.map(x => T(al * x)), res = [T(v[0] - pr[0]), T(v[1] - pr[1])]; return {
  prompt: `On a map with the town square at (0, 0), a straight road runs through the square in the direction u = ${vec(u)}. A farm stands at v = ${vec(v)}, in kilometres. The spot on the road nearest the farm is the projection of v onto the road. Enter that spot: x, then y.`,
  answer: pr,
  hints: ['Start with two dot products: u·v and u·u.', 'Divide u·v by u·u, not by the length of u, to get one number. Then multiply both entries of u by that number.'],
  solution: `u·v = ${n(u[0])} × ${par(v[0])} + ${par(u[1])} × ${par(v[1])} = ${n(uv)} and u·u = ${n(uu)}. The projection number is ${n(uv)} ÷ ${n(uu)} = ${n(al)}, so the nearest spot is ${n(al)} × ${vec(u)} = ${vec(pr)}. The leftover ${vec(res)} from that spot to the farm is perpendicular to the road.`,
  guidance: [
   { prompt: `For u = ${vec(u)} and v = ${vec(v)}, compute u·v, then u·u.`, answer: [uv, uu], explanation: `u·v = ${n(u[0] * v[0])}${pm(u[1] * v[1])} = ${n(uv)}. u·u = ${n(u[0] * u[0])} + ${n(u[1] * u[1])} = ${n(uu)}.` },
   { prompt: `Divide: ${n(uv)} ÷ ${n(uu)}. What is the projection number?`, answer: [al], explanation: `${n(uv)} ÷ ${n(uu)} = ${n(al)}. The nearest spot is ${n(al)} × u.` },
   { prompt: `Multiply u = ${vec(u)} by ${n(al)}. Enter the nearest spot: x, then y.`, answer: pr, explanation: `${n(al)} × ${vec(u)} = ${vec(pr)}. From there to the farm is ${vec(res)}, and its dot product with u is 0, so the track meets the road at a right angle.` }
  ] }; }
});

/* Both parts of the split: along the rail and sideways. */
practice({ id: 'q18c', parent: 'q18', kind: 'applied',
 title: 'The push that moves the cart',
 brief: 'A loaded cart runs on a straight rail, and only part of a worker\'s push moves it.',
 labels: ['along x', 'along y', 'sideways x', 'sideways y'], tolerance: 0.01 },
 [['u·v', 'u·u'], ['along x', 'along y'], ['sideways x', 'sideways y']], {
 canonical: { u: [3, 1], v: [5, 5] },
 /* v = α·u + t·(−u_y, u_x) with whole α (−2, −1, 2, 3 or 4) and t (−3..3, not 0), so both parts are whole and no entry of either part is 0. */
 draw: R => { const a = R.nz(-3, 4), b = R.nz(-3, 4), al = R.pick([-2, -1, 2, 3, 4]), t = R.nz(-3, 3); return { u: [a, b], v: [al * a - t * b, al * b + t * a] }; },
 build: ({ u, v }) => { const uv = dot(u, v), uu = dot(u, u), al = T(uv / uu), pr = u.map(x => T(al * x)), res = [T(v[0] - pr[0]), T(v[1] - pr[1])]; return {
  prompt: `A cart can only roll along a straight rail whose direction is u = ${vec(u)}. A worker pushes it with the force v = ${vec(v)}, in newtons. Split the push into two parts: the part along the rail, which moves the cart, and the sideways part, which only presses on the rail. Enter the part along the rail: x, then y. Then enter the sideways part: x, then y.`,
  answer: [pr[0], pr[1], res[0], res[1]],
  hints: ['The part along the rail is the projection of v onto u: u multiplied by (u·v) ÷ (u·u).', 'The sideways part is what is left: v minus the part along the rail. Check it: its dot product with u should be zero.'],
  solution: `u·v = ${n(uv)} and u·u = ${n(uu)}, so the projection number is ${n(uv)} ÷ ${n(uu)} = ${n(al)}. Along the rail: ${n(al)} × ${vec(u)} = ${vec(pr)}. Sideways: ${vec(v)} − ${vec(pr)} = ${vec(res)}. Check: ${vec(res)}·${vec(u)} = ${n(res[0] * u[0])}${pm(res[1] * u[1])} = 0.`,
  guidance: [
   { prompt: `For u = ${vec(u)} and v = ${vec(v)}, compute u·v, then u·u.`, answer: [uv, uu], explanation: `u·v = ${n(u[0] * v[0])}${pm(u[1] * v[1])} = ${n(uv)}. u·u = ${n(u[0] * u[0])} + ${n(u[1] * u[1])} = ${n(uu)}.` },
   { prompt: `The projection number is ${n(uv)} ÷ ${n(uu)} = ${n(al)}. Multiply u = ${vec(u)} by it. Enter the part along the rail: x, then y.`, answer: pr, explanation: `${n(al)} × ${vec(u)} = ${vec(pr)}.${al < 0 ? ' The number is negative, so this part points backwards along the rail.' : ''}` },
   { prompt: `Subtract the part along the rail from the push: ${vec(v)} − ${vec(pr)}. Enter the sideways part: x, then y.`, answer: res, explanation: `${n(v[0])} − ${par(pr[0])} = ${n(res[0])} and ${n(v[1])} − ${par(pr[1])} = ${n(res[1])}. Its dot product with u is ${n(res[0] * u[0])}${pm(res[1] * u[1])} = 0, so it is perpendicular to the rail.` }
  ] }; }
});

/* Three dimensions, and the length of the leftover (q02). */
practice({ id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q02',
 title: 'Feeder pipe to the habitat',
 brief: 'A new habitat must be joined to the supply pipe with the shortest feeder pipe possible.',
 labels: ['nearest x', 'nearest y', 'nearest z', 'feeder length'], tolerance: 0.01 },
 [['u·v', 'u·u'], ['nearest x', 'nearest y', 'nearest z'], ['leftover x', 'leftover y', 'leftover z'], ['feeder length']], {
 canonical: { u: [1, 2, 2], v: [4, 5, 2] },
 /* u and w are two rows of the perpendicular triple (1,2,2), (2,1,−2), (2,−2,1), with the axes shuffled and flipped the
    same way in both. v = α·u + t·w, so the nearest point is α·u and the feeder length is 3|t|. */
 draw: R => { const B = [[1, 2, 2], [2, 1, -2], [2, -2, 1]], perm = R.pick([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]), sg = [R.bool() ? 1 : -1, R.bool() ? 1 : -1, R.bool() ? 1 : -1], i = R.int(0, 2), j = R.except(0, 2, [i]), al = R.pick([-2, -1, 2, 3]), t = R.pick([-2, -1, 1, 2]), tr = r => perm.map((k, c) => sg[c] * r[k]), u = tr(B[i]), w = tr(B[j]); return { u, v: u.map((x, k) => al * x + t * w[k]) }; },
 build: ({ u, v }) => { const uv = dot(u, v), uu = dot(u, u), al = T(uv / uu), pr = u.map(x => T(al * x)), res = v.map((x, k) => T(x - pr[k])), sq = dot(res, res), len = T(Math.sqrt(sq)); return {
  prompt: `A straight supply pipe leaves the base at (0, 0, 0) and runs in the direction u = ${vec(u)}. A new habitat stands at v = ${vec(v)}, in kilometres. A feeder pipe will join the habitat to the nearest point of the supply pipe. Enter that nearest point: x, y, z. Then enter the length of the feeder pipe in kilometres, which is the length of the leftover vector from the nearest point to the habitat.`,
  answer: [pr[0], pr[1], pr[2], len],
  hints: ['The nearest point is the projection of v onto u. With three entries, each dot product has three products to add.', 'The leftover is v minus the nearest point. Its length is the square root of the sum of its three squared entries.'],
  solution: `u·v = ${n(uv)} and u·u = ${n(uu)}, so the projection number is ${n(uv)} ÷ ${n(uu)} = ${n(al)}. Nearest point: ${n(al)} × ${vec(u)} = ${vec(pr)}. Leftover: ${vec(v)} − ${vec(pr)} = ${vec(res)}. Its length is √(${res.map(x => n(x * x)).join(' + ')}) = √${n(sq)} = ${n(len)} km.`,
  guidance: [
   { prompt: `For u = ${vec(u)} and v = ${vec(v)}, compute u·v, then u·u.`, answer: [uv, uu], explanation: `u·v = ${n(u[0] * v[0])}${pm(u[1] * v[1])}${pm(u[2] * v[2])} = ${n(uv)}. u·u = ${u.map(x => n(x * x)).join(' + ')} = ${n(uu)}.` },
   { prompt: `The projection number is ${n(uv)} ÷ ${n(uu)} = ${n(al)}. Multiply u = ${vec(u)} by it. Enter the nearest point: x, y, z.`, answer: pr, explanation: `${n(al)} × ${vec(u)} = ${vec(pr)}. Dividing by the length of u, which is ${n(T(Math.sqrt(uu)))}, instead of by u·u would land 3 times too far along the pipe.` },
   { prompt: `Subtract: ${vec(v)} − ${vec(pr)}. Enter the leftover vector: x, y, z.`, answer: res, explanation: `The leftover is ${vec(res)}. Its dot product with u is 0, so the feeder pipe meets the supply pipe at a right angle.` },
   { prompt: `Find the length of ${vec(res)}: square each entry, add, and take the square root.`, answer: [len], explanation: `${res.map(x => n(x * x)).join(' + ')} = ${n(sq)}, and √${n(sq)} = ${n(len)}. The feeder pipe is ${n(len)} km long.` }
  ] }; }
});

/* ---- q19 Gram–Schmidt ----
   Parent: a₁ along an axis, a₂ in a coordinate plane, enter q₂. Pitfall: normalise after subtracting. */

/* A camera's "look" and "up" axes; a₁ is not a unit vector and the leftover is not along an axis. */
practice({ id: 'q19b', parent: 'q19', kind: 'setting',
 title: 'A true up for the camera',
 brief: 'A 3D camera needs an up axis at a right angle to its view, and the artist only gave a rough one.',
 labels: ['q2 x', 'q2 y', 'q2 z'], tolerance: 0.01 },
 [['q1·a2'], ['leftover x', 'leftover y', 'leftover z', 'leftover length'], ['q2 x', 'q2 y', 'q2 z']], {
 canonical: { a1: [0, 0, 4], a2: [3, 4, 2] },
 /* a₁ lies on one axis with length 2 to 5 (either way round). On the other two axes a₂ is a multiple of (3, 4) or
    (4, 3) with any signs, so the leftover has length 5 or 10 and q₂ has entries 0, ±0.6 and ±0.8. */
 draw: R => { const ax = R.int(0, 2), k = R.pick([2, 3, 4, 5, -2, -3]), h = R.nz(-6, 6), pat = R.bool() ? [3, 4] : [4, 3], t = R.pick([1, 1, 2]), o = [0, 1, 2].filter(i => i !== ax), a1 = [0, 0, 0], a2 = [0, 0, 0]; a1[ax] = k; a2[ax] = h; a2[o[0]] = (R.bool() ? 1 : -1) * pat[0] * t; a2[o[1]] = (R.bool() ? 1 : -1) * pat[1] * t; return { a1, a2 }; },
 build: ({ a1, a2 }) => { const L = T(Math.sqrt(dot(a1, a1))), q1 = a1.map(x => T(x / L)), cf = T(dot(q1, a2)), pj = q1.map(x => T(cf * x)), res = a2.map((x, i) => T(x - pj[i])), len = T(Math.sqrt(dot(res, res))), q2 = res.map(x => T(x / len)); return {
  prompt: `A 3D camera needs two perpendicular unit axes. Its viewing direction is a₁ = ${vec(a1)}. The artist's rough "up" direction is a₂ = ${vec(a2)}, which leans partly along the view. Gram–Schmidt cleans it: make the unit vector q₁ from a₁, remove from a₂ its part along q₁, then scale what is left to length 1. Enter the true up axis q₂: x, y, z.`,
  answer: q2,
  hints: ['q₁ is a₁ divided by its own length, so it is a unit vector along one axis.', 'Take the dot product q₁·a₂ and subtract that many q₁ from a₂. Only then divide the leftover by its length.'],
  solution: `a₁ has length ${n(L)}, so q₁ = ${vec(q1)}. q₁·a₂ = ${n(cf)}, and the part of a₂ along q₁ is ${n(cf)} × ${vec(q1)} = ${vec(pj)}. The leftover is ${vec(a2)} − ${vec(pj)} = ${vec(res)}, with length √${n(dot(res, res))} = ${n(len)}. Dividing by ${n(len)} gives q₂ = ${vec(q2)}.`,
  guidance: [
   { prompt: `a₁ = ${vec(a1)} has length ${n(L)}, so q₁ = ${vec(q1)}. For a₂ = ${vec(a2)}, compute q₁·a₂.`, answer: [cf], explanation: `q₁ has a single non-zero entry, so only the matching entry of a₂ counts: q₁·a₂ = ${q1.map((x, i) => [x, a2[i]]).filter(t => t[0]).map(t => `${n(t[0])} × ${par(t[1])}`).join('')} = ${n(cf)}. Using a₁ itself here, before it is scaled to length 1, would give the wrong amount.` },
   { prompt: `Subtract ${n(cf)} × q₁ = ${vec(pj)} from a₂ = ${vec(a2)}. Enter the leftover vector: x, y, z. Then enter its length.`, answer: [res[0], res[1], res[2], len], explanation: `The leftover is ${vec(res)}, and its length is √(${res.filter(x => x).map(x => n(x * x)).join(' + ')}) = √${n(dot(res, res))} = ${n(len)}. It is perpendicular to q₁, but it is not a unit vector yet.` },
   { prompt: `Divide the leftover ${vec(res)} by its length ${n(len)}. Enter q₂: x, y, z.`, answer: q2, explanation: `Each entry is divided by ${n(len)}: q₂ = ${vec(q2)}. The scaling comes last, after the part along q₁ is gone.` }
  ] }; }
});

/* The plane, with a slanted a₁: q₁ itself has to be worked out, and so does the dot product. */
practice({ id: 'q19c', parent: 'q19', kind: 'applied',
 title: 'Square grid on a slanted street',
 brief: 'A town planner wants a square street grid, but the two streets she starts from are not at right angles.',
 labels: ['q1 x', 'q1 y', 'q1·a2', 'q2 x', 'q2 y'], tolerance: 0.01 },
 [['length of a1', 'q1 x', 'q1 y'], ['q1·a2', 'part x', 'part y'], ['leftover length', 'q2 x', 'q2 y']], {
 canonical: { a1: [3, 4], a2: [2, 11] },
 /* a₁ = s·e with e = (±3, ±4) or (±4, ±3) and s = 1 or 2; a₂ = m·e + t·e⊥ with e⊥ = (−e_y, e_x), m = 1 or 2,
    t = ±1 or ±2. So q₁·a₂ = 5m, the leftover has length 5|t|, and every entry of q₁ and q₂ is ±0.6 or ±0.8. */
 draw: R => { const pat = R.bool() ? [3, 4] : [4, 3], e = [(R.bool() ? 1 : -1) * pat[0], (R.bool() ? 1 : -1) * pat[1]], s = R.pick([1, 1, 2]), m = R.pick([1, 2]), t = R.pick([-2, -1, 1, 2]); return { a1: [s * e[0], s * e[1]], a2: [m * e[0] - t * e[1], m * e[1] + t * e[0]] }; },
 build: ({ a1, a2 }) => { const sq1 = dot(a1, a1), L = T(Math.sqrt(sq1)), q1 = a1.map(x => T(x / L)), cf = T(dot(q1, a2)), pj = q1.map(x => T(cf * x)), res = a2.map((x, i) => T(x - pj[i])), sq = T(dot(res, res)), len = T(Math.sqrt(sq)), q2 = res.map(x => T(x / len)); return {
  prompt: `A town planner wants a square street grid. The main street runs along a₁ = ${vec(a1)}. A side street runs along a₂ = ${vec(a2)}, which is not at a right angle to it. Gram–Schmidt gives two perpendicular unit directions. Enter q₁, the unit direction of the main street: x, then y. Enter the number q₁·a₂, the amount of a₂ that lies along q₁. Then enter q₂, the unit direction left when that part is removed from a₂: x, then y.`,
  answer: [q1[0], q1[1], cf, q2[0], q2[1]],
  hints: ['The length of a₁ is the square root of its two entries squared and added. Divide a₁ by that length to get q₁.', 'Subtract (q₁·a₂) times q₁ from a₂. Then divide what is left by its own length to get q₂.'],
  solution: `a₁ has length √${n(sq1)} = ${n(L)}, so q₁ = ${vec(q1)}. q₁·a₂ = ${n(q1[0])} × ${par(a2[0])} + ${par(q1[1])} × ${par(a2[1])} = ${n(cf)}. The part of a₂ along q₁ is ${n(cf)} × ${vec(q1)} = ${vec(pj)}. The leftover is ${vec(a2)} − ${vec(pj)} = ${vec(res)}, with length √${n(sq)} = ${n(len)}, so q₂ = ${vec(q2)}.`,
  guidance: [
   { prompt: `Find the length of a₁ = ${vec(a1)}: square the entries, add, take the square root. Then divide a₁ by it. Enter the length, then q₁: x, then y.`, answer: [L, q1[0], q1[1]], explanation: `${n(a1[0] * a1[0])} + ${n(a1[1] * a1[1])} = ${n(sq1)} and √${n(sq1)} = ${n(L)}. So q₁ = ${vec(q1)}, a vector of length 1.` },
   { prompt: `Compute q₁·a₂ for q₁ = ${vec(q1)} and a₂ = ${vec(a2)}. Then multiply q₁ by that number. Enter q₁·a₂, then the part of a₂ along q₁: x, then y.`, answer: [cf, pj[0], pj[1]], explanation: `q₁·a₂ = ${n(T(q1[0] * a2[0]))}${pm(T(q1[1] * a2[1]))} = ${n(cf)}, and ${n(cf)} × ${vec(q1)} = ${vec(pj)}.` },
   { prompt: `Subtract: ${vec(a2)} − ${vec(pj)} = ${vec(res)}. Enter the length of this leftover. Then divide the leftover by it and enter q₂: x, then y.`, answer: [len, q2[0], q2[1]], explanation: `The length is √${n(sq)} = ${n(len)}, so q₂ = ${vec(q2)}. Check: q₁·q₂ = ${n(T(q1[0] * q2[0]))}${pm(T(q1[1] * q2[1]))} = 0, so the two streets of the grid meet at a right angle.` }
  ] }; }
});

/* A third vector: two parts to remove before normalising. */
practice({ id: 'q19d', parent: 'q19', kind: 'challenge',
 title: 'Third axis for the drone frame',
 brief: 'The drone\'s sensor frame has two finished axes, and the third raw direction overlaps both of them.',
 labels: ['q1·a3', 'q2·a3', 'q3 x', 'q3 y', 'q3 z'], tolerance: 0.01 },
 [['q1·a3', 'q2·a3'], ['part x', 'part y', 'part z'], ['leftover x', 'leftover y', 'leftover z', 'leftover length'], ['q3 x', 'q3 y', 'q3 z']], {
 canonical: { q1: [1, 0, 0], q2: [0, 0.6, 0.8], a3: [2, -1, 7] },
 /* q₁ is a coordinate axis; q₂ = (c, d) on the other two axes with (|c|, |d|) = (0.6, 0.8) or (0.8, 0.6).
    a₃ = α·q₁ + 5β·q₂ + 5γ·(−d, c): whole entries, q₂·a₃ = 5β, leftover length 5|γ|. */
 draw: R => { const ax = R.int(0, 2), o = [0, 1, 2].filter(i => i !== ax), pat = R.bool() ? [3, 4] : [4, 3], c = (R.bool() ? 1 : -1) * pat[0], d = (R.bool() ? 1 : -1) * pat[1], al = R.nz(-5, 5), be = R.pick([1, 2, -1]), ga = R.pick([-2, -1, 1, 2]), q1 = [0, 0, 0], q2 = [0, 0, 0], a3 = [0, 0, 0]; q1[ax] = 1; q2[o[0]] = c / 5; q2[o[1]] = d / 5; a3[ax] = al; a3[o[0]] = be * c - ga * d; a3[o[1]] = be * d + ga * c; return { q1, q2, a3 }; },
 build: ({ q1, q2, a3 }) => { const c1 = T(dot(q1, a3)), c2 = T(dot(q2, a3)), p1 = q1.map(x => T(c1 * x)), p2 = q2.map(x => T(c2 * x)), res = a3.map((x, i) => T(x - p1[i] - p2[i])), sq = T(dot(res, res)), len = T(Math.sqrt(sq)), q3 = res.map(x => T(x / len)); return {
  prompt: `A drone's sensor frame needs three perpendicular unit axes. Two are already built: q₁ = ${vec(q1)} and q₂ = ${vec(q2)}. The third raw direction is a₃ = ${vec(a3)}. Gram–Schmidt removes from a₃ its part along q₁ and its part along q₂, then scales what is left to length 1. Enter q₁·a₃, then q₂·a₃. Then enter the third axis q₃: x, y, z.`,
  answer: [c1, c2, q3[0], q3[1], q3[2]],
  hints: ['Find the two dot products first. Each one says how many of that axis to subtract from a₃.', 'Subtract both parts before you scale. The leftover must have a zero dot product with q₁ and with q₂.'],
  solution: `q₁·a₃ = ${n(c1)} and q₂·a₃ = ${n(c2)}. The parts to remove are ${n(c1)} × q₁ = ${vec(p1)} and ${n(c2)} × q₂ = ${vec(p2)}. The leftover is ${vec(a3)} − ${vec(p1)} − ${vec(p2)} = ${vec(res)}, with length √${n(sq)} = ${n(len)}. So q₃ = ${vec(q3)}.`,
  guidance: [
   { prompt: `For a₃ = ${vec(a3)}, compute q₁·a₃ with q₁ = ${vec(q1)}, then q₂·a₃ with q₂ = ${vec(q2)}.`, answer: [c1, c2], explanation: `q₁ picks out one entry of a₃: ${n(c1)}. q₂·a₃ = ${q2.map((x, i) => [x, a3[i]]).filter(t => t[0]).map((t, i) => `${i ? par(t[0]) : n(t[0])} × ${par(t[1])}`).join(' + ')} = ${n(c2)}.` },
   { prompt: `The part along q₁ is ${n(c1)} × q₁ = ${vec(p1)}. Compute the part along q₂: ${n(c2)} × ${vec(q2)}. Enter x, y, z.`, answer: p2, explanation: `Each entry of q₂ is multiplied by ${n(c2)}: ${vec(p2)}.` },
   { prompt: `Subtract both parts from a₃: ${vec(a3)} − ${vec(p1)} − ${vec(p2)}. Enter the leftover: x, y, z. Then enter its length.`, answer: [res[0], res[1], res[2], len], explanation: `The leftover is ${vec(res)}, with length √${n(sq)} = ${n(len)}. It is perpendicular to both finished axes, but it is not a unit vector yet.` },
   { prompt: `Divide the leftover ${vec(res)} by its length ${n(len)}. Enter q₃: x, y, z.`, answer: q3, explanation: `Each entry is divided by ${n(len)}: q₃ = ${vec(q3)}. The scaling comes last, after both parts are gone.` }
  ] }; }
});

/* ---- q20 Least squares ----
   Parent: fit a constant to three voltages; enter the mean and the sum of squared residuals. Pitfall: the sum is not divided by the count. */
const sumOf = r => r.reduce((s, x) => s + x, 0);
/* Four whole readings with a whole mean M: gaps d₁..d₃ in −4..4, the fourth gap balances them and is at most 5 in size, at least three gaps non-zero. */
const fourReadings = (R, lo, hi) => { const M = R.int(lo, hi); let d; do { d = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)]; d.push(-sumOf(d)); } while (Math.abs(d[3]) > 5 || d.filter(x => x !== 0).length < 3); return d.map(x => M + x); };

/* Four lap times instead of three voltages. */
practice({ id: 'q20b', parent: 'q20', kind: 'setting',
 title: 'One number for four laps',
 brief: 'A coach has four timings of the same runner and wants the one lap time that fits them best.',
 labels: ['fitted lap time (s)', 'sum of squared gaps'], tolerance: 0.01 },
 [['sum', 'count'], ['fitted lap time (s)'], ['gap 1', 'gap 2', 'gap 3', 'gap 4'], ['sum of squared gaps']], {
 canonical: { r: [62, 65, 61, 68] },
 draw: R => ({ r: fourReadings(R, 55, 75) }),
 build: ({ r }) => { const s = sumOf(r), M = s / r.length, g = r.map(x => x - M), sse = sumOf(g.map(x => x * x)); return {
  prompt: `A coach times the same runner over four laps of the track: ${r.slice(0, 3).map(n).join(', ')} and ${n(r[3])} seconds. She wants one number to stand for the runner's lap time, chosen so that the sum of the squared gaps (the residuals) between it and the four timings is as small as possible. Enter that lap time in seconds. Then enter the sum of the squared gaps.`,
  answer: [M, sse],
  hints: ['The number with the smallest sum of squared gaps is the mean: add the four timings and divide by how many there are.', 'Take the mean away from each timing, square each gap, and add the four squares. Do not divide that sum by the number of laps.'],
  solution: `Sum: ${r.map(n).join(' + ')} = ${n(s)}. Mean: ${n(s)} ÷ 4 = ${n(M)} seconds. Gaps: ${g.map(n).join(', ')}. Squares: ${g.map(x => n(x * x)).join(' + ')} = ${n(sse)}.`,
  guidance: [
   { prompt: `Add the four timings ${r.map(n).join(', ')}. Enter the sum, then how many timings there are.`, answer: [s, r.length], explanation: `${r.map(n).join(' + ')} = ${n(s)}, from 4 timings.` },
   { prompt: `Divide ${n(s)} by 4. What is the fitted lap time?`, answer: [M], explanation: `${n(s)} ÷ 4 = ${n(M)} seconds. With equal trust in every timing, the least-squares value is the mean.` },
   { prompt: `Take ${n(M)} away from each timing, in order. Enter the four gaps, keeping the minus signs.`, answer: g, explanation: `The gaps are ${g.map(n).join(', ')}, and they add to 0, as gaps to the mean always do.` },
   { prompt: `Square each of the gaps ${g.map(n).join(', ')} and add the four squares. What is the sum of the squared gaps?`, answer: [sse], explanation: `${g.map(x => n(x * x)).join(' + ')} = ${n(sse)}. A squared gap is never a minus number. The sum is not divided by 4.` }
  ] }; }
});

/* The mean against a guess: the same squared-gap sum worked out twice. */
practice({ id: 'q20c', parent: 'q20', kind: 'applied',
 title: 'A typical price, tested',
 brief: 'A buyer has four shop prices for the same charger and wants to know whether her guess at a typical price is the best one.',
 labels: ['least-squares price ($)', 'squared gaps for the mean', 'squared gaps for the guess'], tolerance: 0.01 },
 [['least-squares price ($)'], ['squared gaps for the mean'], ['squared gaps for the guess']], {
 canonical: { r: [12, 15, 9, 16], g: 12 },
 draw: R => { const r = fourReadings(R, 9, 30), M = sumOf(r) / 4; return { r, g: M + R.pick([-2, -1, 1, 2]) }; },
 build: ({ r, g }) => { const s = sumOf(r), M = s / r.length, dm = r.map(x => x - M), dg = r.map(x => x - g), sm = sumOf(dm.map(x => x * x)), sg = sumOf(dg.map(x => x * x)); return {
  prompt: `The same phone charger costs ${r.slice(0, 3).map(n).join(', ')} and ${n(r[3])} dollars in four shops. A buyer wants one typical price. Her first guess is ${n(g)} dollars. Then she works out the least-squares price, the one number with the smallest sum of squared gaps to the four prices. A gap is a price minus that number. Enter the least-squares price. Enter the sum of squared gaps for that price. Then enter the sum of squared gaps for her guess of ${n(g)} dollars.`,
  answer: [M, sm, sg],
  hints: ['The least-squares price is the mean of the four prices.', 'Do the gap work twice, once with the mean and once with the guess: take the number away from each price, square each gap, and add. The guess should come out worse.'],
  solution: `Mean: (${r.map(n).join(' + ')}) ÷ 4 = ${n(s)} ÷ 4 = ${n(M)} dollars. Gaps to the mean: ${dm.map(n).join(', ')}, with squares ${dm.map(x => n(x * x)).join(' + ')} = ${n(sm)}. Gaps to the guess: ${dg.map(n).join(', ')}, with squares ${dg.map(x => n(x * x)).join(' + ')} = ${n(sg)}. The guess is worse by ${n(sg - sm)}, as any number other than the mean must be.`,
  guidance: [
   { prompt: `Add the four prices ${r.map(n).join(', ')} and divide by 4. What is the least-squares price?`, answer: [M], explanation: `${r.map(n).join(' + ')} = ${n(s)}, and ${n(s)} ÷ 4 = ${n(M)} dollars.` },
   { prompt: `The gaps between the prices and ${n(M)} are ${dm.map(n).join(', ')}. Square each one and add. What is the sum of squared gaps for the mean?`, answer: [sm], explanation: `${dm.map(x => n(x * x)).join(' + ')} = ${n(sm)}. The sum is not divided by 4.` },
   { prompt: `The gaps between the prices and the guess ${n(g)} are ${dg.map(n).join(', ')}. Square each one and add. What is the sum of squared gaps for the guess?`, answer: [sg], explanation: `${dg.map(x => n(x * x)).join(' + ')} = ${n(sg)}. That is ${n(sg - sm)} more than for the mean: no other single number beats the mean.` }
  ] }; }
});

/* A line through zero fitted by projection (q18): the data vector is projected onto the load vector. */
practice({ id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q18',
 title: 'Stretch per kilogram',
 brief: 'A spring for the cargo scale was tested with three loads, and the readings do not agree on its stretch per kilogram.',
 labels: ['m (cm per kg)', 'sum of squared gaps'], tolerance: 0.01 },
 [['t·y', 't·t'], ['m (cm per kg)'], ['gap 1', 'gap 2', 'gap 3'], ['sum of squared gaps']], {
 canonical: { t: [1, 2, 3], y: [5, 9, 11] },
 /* y = m·t + r with whole m (2 to 6) and a whole leftover r perpendicular to t, entries −2..2, not all 0. The entries
    of r do not add to 0 and neither do the r/t ratios, so "mean stretch ÷ mean load" and "mean of the three ratios"
    both miss m. */
 draw: R => { let t, m, r, y; do { t = R.pick([[1, 2, 3], [1, 2, 4], [2, 3, 4], [1, 3, 4]]); m = R.int(2, 6); r = [R.int(-2, 2), R.int(-2, 2), R.int(-2, 2)]; y = t.map((x, i) => m * x + r[i]); } while (dot(r, t) !== 0 || r.every(x => x === 0) || sumOf(r) === 0 || Math.abs(sumOf(r.map((x, i) => x / t[i]))) < 1e-9 || y.some(x => x <= 0)); return { t, y }; },
 build: ({ t, y }) => { const ty = dot(t, y), tt = dot(t, t), m = T(ty / tt), fit = t.map(x => T(m * x)), g = y.map((x, i) => T(x - fit[i])), sse = sumOf(g.map(x => x * x)); return {
  prompt: `A spring is tested with three loads. Loads of ${n(t[0])}, ${n(t[1])} and ${n(t[2])} kg stretch it by ${n(y[0])}, ${n(y[1])} and ${n(y[2])} cm. The model is stretch = m × load, a straight line through zero, and the readings are a little noisy. Write the loads as a vector t and the stretches as a vector y. The least-squares m is the projection number of y onto t, which is (t·y) ÷ (t·t). Enter m in cm per kg. Then enter the sum of the squared gaps between each reading and m × its load.`,
  answer: [m, sse],
  hints: ['t·y multiplies each load by its stretch and adds the three products. t·t squares each load and adds.', 'After m, work out m × load for each load, take it away from the reading, square each gap, and add. Do not divide the sum by the number of readings.'],
  solution: `t·y = ${t.map((x, i) => `${n(x)} × ${n(y[i])}`).join(' + ')} = ${n(ty)} and t·t = ${t.map(x => n(x * x)).join(' + ')} = ${n(tt)}, so m = ${n(ty)} ÷ ${n(tt)} = ${n(m)} cm per kg. The model gives ${vec(fit)} cm. Gaps: ${vec(y)} − ${vec(fit)} = ${vec(g)}. Squares: ${g.map(x => n(x * x)).join(' + ')} = ${n(sse)}.`,
  guidance: [
   { prompt: `For t = ${vec(t)} and y = ${vec(y)}, compute t·y, then t·t.`, answer: [ty, tt], explanation: `t·y = ${t.map((x, i) => n(x * y[i])).join(' + ')} = ${n(ty)}. t·t = ${t.map(x => n(x * x)).join(' + ')} = ${n(tt)}.` },
   { prompt: `Divide: ${n(ty)} ÷ ${n(tt)}. What is m?`, answer: [m], explanation: `m = ${n(m)} cm per kg. This is the projection of y onto t: m × t is the point on the line of t nearest to y.` },
   { prompt: `The model gives ${n(m)} × ${vec(t)} = ${vec(fit)} cm. Take these away from the readings ${vec(y)}, in order. Enter the three gaps, keeping the minus signs.`, answer: g, explanation: `The gaps are ${vec(g)}. The gap vector is perpendicular to t: its dot product with t is 0.` },
   { prompt: `Square each of the gaps ${g.map(n).join(', ')} and add the three squares. What is the sum of the squared gaps?`, answer: [sse], explanation: `${g.map(x => n(x * x)).join(' + ')} = ${n(sse)}. The sum is not divided by 3.` }
  ] }; }
});

})();
