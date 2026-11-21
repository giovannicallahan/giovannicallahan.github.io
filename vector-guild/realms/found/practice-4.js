/* Foundations practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d ... q20b q20c q20d). Format and rules: docs/PACK-FORMAT.md, "Practice missions".
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/found/oracle-p4.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* ---------- q16: One-step equations ---------- */

/* q16b (setting). One-step equations on a shop receipt: k·p = c (divide), then t − a = b (add). The bill t is the paint plus other items, so it is never less than the paint. */
add({
 id: 'q16b', parent: 'q16', kind: 'setting',
 title: 'The torn receipt',
 brief: 'Mira says the ledger rule works on any bill, and hands you a torn shop receipt with two numbers missing.',
 prompt: 'A shop receipt is torn, and two numbers are missing. First line: 4 identical tins of paint cost $72 in all, so 4p = 72, where p is the price of one tin in dollars. Last line: the whole bill came to t dollars, a $15 voucher was taken off it, and you paid $88, so t − 15 = 88. Enter p, then t.',
 answer: [18, 103], labels: ['p (dollars per tin)', 't (bill before the voucher)'], tolerance: 0.001,
 hints: [
  'The tins come first. Undo the multiplying: divide both sides of 4p = 72 by 4.',
  'The voucher was taken away from t, so undo the subtracting: add 15 to both sides.'
 ],
 solution: '4p = 72, so p = 72 ÷ 4 = 18: one tin costs $18. t − 15 = 88, so t = 88 + 15 = 103: the bill was $103 before the voucher. Check: 4 × 18 = 72 and 103 − 15 = 88.',
 guidance: [
  { prompt: '4p = 72. Divide both sides by 4. What is p?', answer: [18], labels: ['p'], explanation: '72 ÷ 4 = 18, so one tin costs $18. Check: 4 × 18 = 72.' },
  { prompt: 't − 15 = 88. Add 15 to both sides. What is t?', answer: [103], labels: ['t'], explanation: '88 + 15 = 103, so the bill was $103. Check: 103 − 15 = 88.' }
 ]
}, {
 canonical: { k: 4, p: 18, a: 15, extra: 31 },
 draw: R => ({ k: R.int(3, 8), p: R.int(6, 19), a: R.pick([5, 10, 15, 20, 25]), extra: R.int(8, 60) }),
 build: ({ k, p, a, extra }) => { const c = k * p, t = c + extra, b = t - a; return {
  prompt: `A shop receipt is torn, and two numbers are missing. First line: ${n(k)} identical tins of paint cost $${n(c)} in all, so ${n(k)}p = ${n(c)}, where p is the price of one tin in dollars. Last line: the whole bill came to t dollars, a $${n(a)} voucher was taken off it, and you paid $${n(b)}, so t − ${n(a)} = ${n(b)}. Enter p, then t.`,
  answer: [p, t],
  hints: [`The tins come first. Undo the multiplying: divide both sides of ${n(k)}p = ${n(c)} by ${n(k)}.`, `The voucher was taken away from t, so undo the subtracting: add ${n(a)} to both sides.`],
  solution: `${n(k)}p = ${n(c)}, so p = ${n(c)} ÷ ${n(k)} = ${n(p)}: one tin costs $${n(p)}. t − ${n(a)} = ${n(b)}, so t = ${n(b)} + ${n(a)} = ${n(t)}: the bill was $${n(t)} before the voucher. Check: ${n(k)} × ${n(p)} = ${n(c)} and ${n(t)} − ${n(a)} = ${n(b)}.`,
  guidance: [
   { prompt: `${n(k)}p = ${n(c)}. Divide both sides by ${n(k)}. What is p?`, answer: [p], explanation: `${n(c)} ÷ ${n(k)} = ${n(p)}, so one tin costs $${n(p)}. Check: ${n(k)} × ${n(p)} = ${n(c)}.` },
   { prompt: `t − ${n(a)} = ${n(b)}. Add ${n(a)} to both sides. What is t?`, answer: [t], explanation: `${n(b)} + ${n(a)} = ${n(t)}, so the bill was $${n(t)}. Check: ${n(t)} − ${n(a)} = ${n(b)}.` }
  ] }; }
});

/* q16c (applied). A chain: k·t = c gives the price of one ride, a return trip is two rides, and w − r = b gives the morning balance. */
add({
 id: 'q16c', parent: 'q16', kind: 'applied',
 title: 'Topping up the travel card',
 brief: 'A recruit back from leave cannot work out what was on her tram card that morning, and Mira asks you to settle it.',
 prompt: 'A strip of 6 tram rides costs $24, and every ride on it costs the same, t dollars, so 6t = 24. This morning your travel card held w dollars. A return trip, which is 2 rides at that price, was taken off it, and the card now shows $17. If the return trip cost r dollars, then w − r = 17. Enter t, then w.',
 answer: [4, 25], labels: ['t (dollars per ride)', 'w (dollars on the card this morning)'], tolerance: 0.001,
 hints: [
  'Start with the strip: divide both sides of 6t = 24 by 6 to get the price of one ride.',
  'A return trip is 2 rides, so r is 2 times t. Put that number in place of r, then undo the subtracting by adding it to both sides.'
 ],
 solution: '6t = 24, so t = 24 ÷ 6 = 4: one ride costs $4. A return trip is 2 rides, so r = 2 × 4 = 8. Then w − 8 = 17, so w = 17 + 8 = 25: the card held $25 this morning. Check: 25 − 8 = 17.',
 guidance: [
  { prompt: '6t = 24. Divide both sides by 6. What is t?', answer: [4], labels: ['t'], explanation: '24 ÷ 6 = 4, so one ride costs $4.' },
  { prompt: 'A return trip is 2 rides at $4 each. What is r, the cost of the return trip in dollars?', answer: [8], labels: ['r (dollars for the return trip)'], explanation: '2 × 4 = 8, so the equation for the card is w − 8 = 17.' },
  { prompt: 'w − 8 = 17. Add 8 to both sides. What is w?', answer: [25], labels: ['w'], explanation: '17 + 8 = 25. Check: 25 − 8 = 17.' }
 ]
}, {
 canonical: { k: 6, t: 4, b: 17 },
 draw: R => ({ k: R.int(4, 10), t: R.int(2, 7), b: R.int(6, 45) }),
 build: ({ k, t, b }) => { const c = k * t, r = 2 * t, w = b + r; return {
  prompt: `A strip of ${n(k)} tram rides costs $${n(c)}, and every ride on it costs the same, t dollars, so ${n(k)}t = ${n(c)}. This morning your travel card held w dollars. A return trip, which is 2 rides at that price, was taken off it, and the card now shows $${n(b)}. If the return trip cost r dollars, then w − r = ${n(b)}. Enter t, then w.`,
  answer: [t, w],
  hints: [`Start with the strip: divide both sides of ${n(k)}t = ${n(c)} by ${n(k)} to get the price of one ride.`, `A return trip is 2 rides, so r is 2 times t. Put that number in place of r, then undo the subtracting by adding it to both sides.`],
  solution: `${n(k)}t = ${n(c)}, so t = ${n(c)} ÷ ${n(k)} = ${n(t)}: one ride costs $${n(t)}. A return trip is 2 rides, so r = 2 × ${n(t)} = ${n(r)}. Then w − ${n(r)} = ${n(b)}, so w = ${n(b)} + ${n(r)} = ${n(w)}: the card held $${n(w)} this morning. Check: ${n(w)} − ${n(r)} = ${n(b)}.`,
  guidance: [
   { prompt: `${n(k)}t = ${n(c)}. Divide both sides by ${n(k)}. What is t?`, answer: [t], explanation: `${n(c)} ÷ ${n(k)} = ${n(t)}, so one ride costs $${n(t)}.` },
   { prompt: `A return trip is 2 rides at $${n(t)} each. What is r, the cost of the return trip in dollars?`, answer: [r], explanation: `2 × ${n(t)} = ${n(r)}, so the equation for the card is w − ${n(r)} = ${n(b)}.` },
   { prompt: `w − ${n(r)} = ${n(b)}. Add ${n(r)} to both sides. What is w?`, answer: [w], explanation: `${n(b)} + ${n(r)} = ${n(w)}. Check: ${n(w)} − ${n(r)} = ${n(b)}.` }
  ] }; }
});

/* q16d (challenge). Combine like terms (q15) to reach a one-step equation (m + p)t = T, then s − T = b with three-digit numbers. */
add({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q15',
 title: 'Boxes of floor tiles',
 brief: 'The fuel store floor has been re-tiled over two days, and the stores ledger needs the tiles per box and the stock before the job.',
 prompt: 'The fuel store floor is being re-tiled. Every box holds the same number of tiles; call it t. The crew laid 3 boxes on the first day and 5 boxes on the second day, 96 tiles in all, so 3t + 5t = 96. The stores held s tiles before the job, and taking out those 96 tiles left 354, so s − 96 = 354. Enter the number in front of t after you combine the like terms, then t, then s. Type each number without commas.',
 answer: [8, 12, 450], labels: ['number in front of t', 't (tiles per box)', 's (tiles in stock before)'], tolerance: 0.001,
 hints: [
  'Both terms on the left count boxes of t tiles, so they are like terms: add the two numbers in front of t to get one t term.',
  'Divide both sides by the new number in front of t. For the stock, undo the subtracting: add 96 to both sides.'
 ],
 solution: '3t + 5t = 8t, so 8t = 96 and t = 96 ÷ 8 = 12: each box holds 12 tiles. s − 96 = 354, so s = 354 + 96 = 450 tiles. Check: 8 × 12 = 96 and 450 − 96 = 354.',
 guidance: [
  { prompt: 'Combine 3t + 5t into one term. What is the number in front of t?', answer: [8], labels: ['number in front of t'], explanation: '3 boxes and 5 boxes make 8 boxes, so 3t + 5t = 8t and the equation is 8t = 96.' },
  { prompt: '8t = 96. Divide both sides by 8. What is t?', answer: [12], labels: ['t'], explanation: '96 ÷ 8 = 12. Check: 8 × 12 = 96.' },
  { prompt: 's − 96 = 354. Add 96 to both sides. What is s?', answer: [450], labels: ['s'], explanation: '354 + 96 = 450. Check: 450 − 96 = 354.' }
 ]
}, {
 canonical: { m: 3, p: 5, t: 12, b: 354 },
 draw: R => ({ m: R.int(2, 6), p: R.int(2, 6), t: R.pick([8, 9, 10, 12, 15, 16, 18, 20, 24, 25]), b: R.int(120, 880) }),
 build: ({ m, p, t, b }) => { const k = m + p, T = k * t, s = b + T; return {
  prompt: `The fuel store floor is being re-tiled. Every box holds the same number of tiles; call it t. The crew laid ${n(m)} boxes on the first day and ${n(p)} boxes on the second day, ${n(T)} tiles in all, so ${n(m)}t + ${n(p)}t = ${n(T)}. The stores held s tiles before the job, and taking out those ${n(T)} tiles left ${n(b)}, so s − ${n(T)} = ${n(b)}. Enter the number in front of t after you combine the like terms, then t, then s. Type each number without commas.`,
  answer: [k, t, s],
  hints: [`Both terms on the left count boxes of t tiles, so they are like terms: add the two numbers in front of t to get one t term.`, `Divide both sides by the new number in front of t. For the stock, undo the subtracting: add ${n(T)} to both sides.`],
  solution: `${n(m)}t + ${n(p)}t = ${n(k)}t, so ${n(k)}t = ${n(T)} and t = ${n(T)} ÷ ${n(k)} = ${n(t)}: each box holds ${n(t)} tiles. s − ${n(T)} = ${n(b)}, so s = ${n(b)} + ${n(T)} = ${n(s)} tiles. Check: ${n(k)} × ${n(t)} = ${n(T)} and ${n(s)} − ${n(T)} = ${n(b)}.`,
  guidance: [
   { prompt: `Combine ${n(m)}t + ${n(p)}t into one term. What is the number in front of t?`, answer: [k], explanation: `${n(m)} boxes and ${n(p)} boxes make ${n(k)} boxes, so ${n(m)}t + ${n(p)}t = ${n(k)}t and the equation is ${n(k)}t = ${n(T)}.` },
   { prompt: `${n(k)}t = ${n(T)}. Divide both sides by ${n(k)}. What is t?`, answer: [t], explanation: `${n(T)} ÷ ${n(k)} = ${n(t)}. Check: ${n(k)} × ${n(t)} = ${n(T)}.` },
   { prompt: `s − ${n(T)} = ${n(b)}. Add ${n(T)} to both sides. What is s?`, answer: [s], explanation: `${n(b)} + ${n(T)} = ${n(s)}. Check: ${n(s)} − ${n(T)} = ${n(b)}.` }
  ] }; }
});

/* ---------- q17: Multi-step equations ---------- */

/* q17b (setting). Two steps with a subtraction to undo: k·x − b = T. Add first, then divide. */
add({
 id: 'q17b', parent: 'q17', kind: 'setting',
 title: 'Cinema night with a voucher',
 brief: 'Mira wants the crew to unwrap an equation outside the fuel store too, so she sets one from a night at the cinema.',
 prompt: 'Cinema night. You buy 3 tickets at x dollars each. A $6 voucher is taken off the total and you pay $36, so 3x − 6 = 36. Solve for x. Enter what 3x equals, which is the cost of the tickets before the voucher, then x.',
 answer: [42, 14], labels: ['cost of the tickets before the voucher (dollars)', 'x (dollars per ticket)'], tolerance: 0.001,
 hints: [
  'The voucher was subtracted last, so undo it first: add 6 to both sides.',
  'Then undo the multiplying: divide both sides by 3.'
 ],
 solution: '3x − 6 = 36. Add 6 to both sides: 3x = 36 + 6 = 42. Divide both sides by 3: x = 42 ÷ 3 = 14, so one ticket costs $14. Check: 3 × 14 − 6 = 42 − 6 = 36.',
 guidance: [
  { prompt: '3x − 6 = 36. Add 6 to both sides. What is 3x?', answer: [42], labels: ['cost of the tickets (dollars)'], explanation: '36 + 6 = 42, so the tickets cost $42 before the voucher.' },
  { prompt: '3x = 42. Divide both sides by 3. What is x?', answer: [14], labels: ['x'], explanation: '42 ÷ 3 = 14, so one ticket costs $14.' }
 ]
}, {
 canonical: { k: 3, x: 14, b: 6 },
 draw: R => ({ k: R.int(2, 6), x: R.int(8, 18), b: R.pick([4, 5, 6, 8, 10]) }),
 build: ({ k, x, b }) => { const kx = k * x, T = kx - b; return {
  prompt: `Cinema night. You buy ${n(k)} tickets at x dollars each. A $${n(b)} voucher is taken off the total and you pay $${n(T)}, so ${n(k)}x − ${n(b)} = ${n(T)}. Solve for x. Enter what ${n(k)}x equals, which is the cost of the tickets before the voucher, then x.`,
  answer: [kx, x],
  hints: [`The voucher was subtracted last, so undo it first: add ${n(b)} to both sides.`, `Then undo the multiplying: divide both sides by ${n(k)}.`],
  solution: `${n(k)}x − ${n(b)} = ${n(T)}. Add ${n(b)} to both sides: ${n(k)}x = ${n(T)} + ${n(b)} = ${n(kx)}. Divide both sides by ${n(k)}: x = ${n(kx)} ÷ ${n(k)} = ${n(x)}, so one ticket costs $${n(x)}. Check: ${n(k)} × ${n(x)} − ${n(b)} = ${n(kx)} − ${n(b)} = ${n(T)}.`,
  guidance: [
   { prompt: `${n(k)}x − ${n(b)} = ${n(T)}. Add ${n(b)} to both sides. What is ${n(k)}x?`, answer: [kx], explanation: `${n(T)} + ${n(b)} = ${n(kx)}, so the tickets cost $${n(kx)} before the voucher.` },
   { prompt: `${n(k)}x = ${n(kx)}. Divide both sides by ${n(k)}. What is x?`, answer: [x], explanation: `${n(kx)} ÷ ${n(k)} = ${n(x)}, so one ticket costs $${n(x)}.` }
  ] }; }
});

/* q17c (applied). Tidy by combining like terms (k·x + m·x), then subtract the allowance, then divide. */
add({
 id: 'q17c', parent: 'q17', kind: 'applied',
 title: 'Checking the weekend pay slip',
 brief: 'A fuel hand thinks his weekend pay slip is wrong, and Mira asks you to work out the hourly rate it was paid at.',
 prompt: 'A weekend pay slip shows $195. It covers 6 hours on Saturday and 4 hours on Sunday, all at x dollars an hour, and a $15 travel allowance, so 6x + 4x + 15 = 195. Enter the number in front of x after you combine the like terms, then the pay for the hours alone in dollars, then x.',
 answer: [10, 180, 18], labels: ['number in front of x', 'pay for the hours alone (dollars)', 'x (dollars per hour)'], tolerance: 0.001,
 hints: [
  'Both x terms count hours at x dollars, so they are like terms: add the two numbers in front of x to get one x term.',
  'Subtract the 15 allowance from both sides first. Only then divide both sides by the number in front of x.'
 ],
 solution: 'Tidy: 6x + 4x = 10x, so 10x + 15 = 195. Subtract 15 from both sides: 10x = 180, the pay for the hours alone. Divide both sides by 10: x = 180 ÷ 10 = 18, so the rate is $18 an hour. Check: 6 × 18 + 4 × 18 + 15 = 108 + 72 + 15 = 195.',
 guidance: [
  { prompt: 'Combine 6x + 4x into one term. What is the number in front of x?', answer: [10], labels: ['number in front of x'], explanation: '6 hours and 4 hours make 10 hours, so the equation is 10x + 15 = 195.' },
  { prompt: '10x + 15 = 195. Subtract 15 from both sides. What is 10x?', answer: [180], labels: ['pay for the hours alone (dollars)'], explanation: '195 − 15 = 180, so the hours alone paid $180.' },
  { prompt: '10x = 180. Divide both sides by 10. What is x?', answer: [18], labels: ['x'], explanation: '180 ÷ 10 = 18, so the rate is $18 an hour.' }
 ]
}, {
 canonical: { k: 6, m: 4, x: 18, b: 15 },
 draw: R => ({ k: R.int(3, 7), m: R.int(2, 5), x: R.int(12, 25), b: R.pick([10, 12, 15, 18, 20, 25]) }),
 build: ({ k, m, x, b }) => { const h = k + m, hx = h * x, T = hx + b; return {
  prompt: `A weekend pay slip shows $${n(T)}. It covers ${n(k)} hours on Saturday and ${n(m)} hours on Sunday, all at x dollars an hour, and a $${n(b)} travel allowance, so ${n(k)}x + ${n(m)}x + ${n(b)} = ${n(T)}. Enter the number in front of x after you combine the like terms, then the pay for the hours alone in dollars, then x.`,
  answer: [h, hx, x],
  hints: [`Both x terms count hours at x dollars, so they are like terms: add the two numbers in front of x to get one x term.`, `Subtract the ${n(b)} allowance from both sides first. Only then divide both sides by the number in front of x.`],
  solution: `Tidy: ${n(k)}x + ${n(m)}x = ${n(h)}x, so ${n(h)}x + ${n(b)} = ${n(T)}. Subtract ${n(b)} from both sides: ${n(h)}x = ${n(hx)}, the pay for the hours alone. Divide both sides by ${n(h)}: x = ${n(hx)} ÷ ${n(h)} = ${n(x)}, so the rate is $${n(x)} an hour. Check: ${n(k)} × ${n(x)} + ${n(m)} × ${n(x)} + ${n(b)} = ${n(k * x)} + ${n(m * x)} + ${n(b)} = ${n(T)}.`,
  guidance: [
   { prompt: `Combine ${n(k)}x + ${n(m)}x into one term. What is the number in front of x?`, answer: [h], explanation: `${n(k)} hours and ${n(m)} hours make ${n(h)} hours, so the equation is ${n(h)}x + ${n(b)} = ${n(T)}.` },
   { prompt: `${n(h)}x + ${n(b)} = ${n(T)}. Subtract ${n(b)} from both sides. What is ${n(h)}x?`, answer: [hx], explanation: `${n(T)} − ${n(b)} = ${n(hx)}, so the hours alone paid $${n(hx)}.` },
   { prompt: `${n(h)}x = ${n(hx)}. Divide both sides by ${n(h)}. What is x?`, answer: [x], explanation: `${n(hx)} ÷ ${n(h)} = ${n(x)}, so the rate is $${n(x)} an hour.` }
  ] }; }
});

/* q17d (challenge). Percent (q11) gives the right-hand side: P% of F. Then k(x + s) + b = that amount, solved as in the lesson. b is chosen so that x is a whole number of at least 4. */
add({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q11',
 title: 'The holiday fund',
 brief: 'Mira is saving for her next leave, and her savings app gives a percent where she wants to see her own monthly deposit.',
 prompt: 'A savings app shows a holiday fund with a target of $300, and says the fund is 40% of the way there. The money so far came from 4 monthly deposits, each made of x dollars from you and a $3 bonus from the bank, and from a $12 opening gift. So 4(x + 3) + 12 equals the amount saved so far. Enter the amount saved so far in dollars, then x.',
 answer: [120, 24], labels: ['amount saved so far (dollars)', 'x (your dollars per deposit)'], tolerance: 0.001,
 hints: [
  'Find the amount saved first: 1% of the target is 300 ÷ 100, and the fund holds 40 of those.',
  'Then tidy the left side: distribute the 4 over both parts of the bracket and add the 12. Subtract the plain number from both sides, then divide both sides by 4.'
 ],
 solution: 'Amount saved: 1% of 300 is 300 ÷ 100 = 3, so 40% is 40 × 3 = 120 dollars. The equation is 4(x + 3) + 12 = 120. Tidy: 4x + 12 + 12 = 120, so 4x + 24 = 120. Subtract 24: 4x = 96. Divide by 4: x = 24, so you put in $24 each month. Check: 4 × (24 + 3) + 12 = 4 × 27 + 12 = 120.',
 guidance: [
  { prompt: '1% of $300 is 300 ÷ 100 = 3 dollars. How many dollars is 40% of the target?', answer: [120], labels: ['amount saved so far (dollars)'], explanation: '40 × 3 = 120, so the equation is 4(x + 3) + 12 = 120.' },
  { prompt: 'Tidy the left side into 4x + (a number): distribute 4(x + 3) and add the 12. What is the number?', answer: [24], labels: ['number on its own after tidying'], explanation: '4 × 3 = 12, and 12 + 12 = 24, so the equation is 4x + 24 = 120.' },
  { prompt: '4x + 24 = 120. Subtract 24 from both sides. What is 4x?', answer: [96], labels: ['dollars from you in all the deposits'], explanation: '120 − 24 = 96, so 4x = 96.' },
  { prompt: '4x = 96. Divide both sides by 4. What is x?', answer: [24], labels: ['x'], explanation: '96 ÷ 4 = 24, so each deposit holds $24 of your own money.' }
 ]
}, {
 canonical: { F: 300, P: 40, k: 4, s: 3, b: 12 },
 draw: R => {
  /* Targets and percents whose amount saved, P × F ÷ 100, lies from 60 to 240 dollars. */
  const pairs = []; for (const F of [200, 300, 400, 500]) for (const P of [20, 25, 30, 40, 45, 60]) { const T = P * F / 100; if (T >= 60 && T <= 240) pairs.push([F, P]); }
  const [F, P] = R.pick(pairs), T = P * F / 100, k = R.int(2, 5), s = R.int(1, 4);
  /* The gift b makes T − b a multiple of k: the smallest such b from 5 up, plus 0 to 3 more lots of k. */
  let b = 5; while ((T - b) % k) b++;
  return { F, P, k, s, b: b + k * R.int(0, 3) };
 },
 build: ({ F, P, k, s, b }) => { const T = P * F / 100, C = k * s + b, kx = T - C, x = kx / k; return {
  prompt: `A savings app shows a holiday fund with a target of $${n(F)}, and says the fund is ${n(P)}% of the way there. The money so far came from ${n(k)} monthly deposits, each made of x dollars from you and a $${n(s)} bonus from the bank, and from a $${n(b)} opening gift. So ${n(k)}(x + ${n(s)}) + ${n(b)} equals the amount saved so far. Enter the amount saved so far in dollars, then x.`,
  answer: [T, x],
  hints: [`Find the amount saved first: 1% of the target is ${n(F)} ÷ 100, and the fund holds ${n(P)} of those.`, `Then tidy the left side: distribute the ${n(k)} over both parts of the bracket and add the ${n(b)}. Subtract the plain number from both sides, then divide both sides by ${n(k)}.`],
  solution: `Amount saved: 1% of ${n(F)} is ${n(F)} ÷ 100 = ${n(F / 100)}, so ${n(P)}% is ${n(P)} × ${n(F / 100)} = ${n(T)} dollars. The equation is ${n(k)}(x + ${n(s)}) + ${n(b)} = ${n(T)}. Tidy: ${n(k)}x + ${n(k * s)} + ${n(b)} = ${n(T)}, so ${n(k)}x + ${n(C)} = ${n(T)}. Subtract ${n(C)}: ${n(k)}x = ${n(kx)}. Divide by ${n(k)}: x = ${n(x)}, so you put in $${n(x)} each month. Check: ${n(k)} × (${n(x)} + ${n(s)}) + ${n(b)} = ${n(k)} × ${n(x + s)} + ${n(b)} = ${n(T)}.`,
  guidance: [
   { prompt: `1% of $${n(F)} is ${n(F)} ÷ 100 = ${n(F / 100)} dollars. How many dollars is ${n(P)}% of the target?`, answer: [T], explanation: `${n(P)} × ${n(F / 100)} = ${n(T)}, so the equation is ${n(k)}(x + ${n(s)}) + ${n(b)} = ${n(T)}.` },
   { prompt: `Tidy the left side into ${n(k)}x + (a number): distribute ${n(k)}(x + ${n(s)}) and add the ${n(b)}. What is the number?`, answer: [C], explanation: `${n(k)} × ${n(s)} = ${n(k * s)}, and ${n(k * s)} + ${n(b)} = ${n(C)}, so the equation is ${n(k)}x + ${n(C)} = ${n(T)}.` },
   { prompt: `${n(k)}x + ${n(C)} = ${n(T)}. Subtract ${n(C)} from both sides. What is ${n(k)}x?`, answer: [kx], explanation: `${n(T)} − ${n(C)} = ${n(kx)}, so ${n(k)}x = ${n(kx)}.` },
   { prompt: `${n(k)}x = ${n(kx)}. Divide both sides by ${n(k)}. What is x?`, answer: [x], explanation: `${n(kx)} ÷ ${n(k)} = ${n(x)}, so each deposit holds $${n(x)} of your own money.` }
  ] }; }
});

/* ---------- q18: Inequalities ---------- */

/* q18b (setting). A money limit: w·n + base ≤ cap. The budget and the room hire are round numbers; the remainder may be 0. */
add({
 id: 'q18b', parent: 'q18', kind: 'setting',
 title: 'The birthday dinner budget',
 brief: 'Mira is planning a birthday dinner on her leave, and a fixed budget decides how many guests she can ask.',
 prompt: 'You have at most $220 to spend on a birthday dinner. Hiring the room costs $80, and each guest’s meal costs $18. With n guests the cost must satisfy 18n + 80 ≤ 220. Enter how many dollars are left for meals once the room is paid for, then the largest whole number of guests you can invite.',
 answer: [140, 7], labels: ['dollars left for meals', 'largest number of guests'], tolerance: 0.001,
 hints: [
  'Subtract the room hire from both sides: 18n ≤ 220 − 80.',
  'Divide both sides by 18. Guests come whole, so take the largest whole number that is not more than the result.'
 ],
 solution: '18n + 80 ≤ 220, so 18n ≤ 140: $140 is left for meals. 140 ÷ 18 = 7 remainder 14, so n can be at most 7. Check: 7 meals cost $126, which fits, but 8 meals would cost $144, more than $140. You can invite at most 7 guests.',
 guidance: [
  { prompt: 'Subtract 80 from both sides of 18n + 80 ≤ 220. How many dollars are left for meals?', answer: [140], labels: ['dollars left for meals'], explanation: '220 − 80 = 140, so 18n ≤ 140.' },
  { prompt: '18n ≤ 140. How many whole meals at $18 each can $140 pay for?', answer: [7], labels: ['largest number of guests'], explanation: '140 ÷ 18 = 7 remainder 14. 7 meals cost $126, which is not more than $140; one more meal would be too much.' }
 ]
}, {
 canonical: { w: 18, base: 80, nmax: 7, extra: 14 },
 draw: R => { const w = R.int(12, 25), nmax = R.int(4, 10), base = 10 * R.int(5, 12);
  /* The money left for meals is a multiple of 10, so the budget is a round number: 0 ≤ extra < w. */
  const first = (10 - (w * nmax) % 10) % 10;
  return { w, base, nmax, extra: first + 10 * R.int(0, Math.floor((w - 1 - first) / 10)) }; },
 build: ({ w, base, nmax, extra }) => { const room = w * nmax + extra, cap = base + room;
  const left = extra ? ` remainder ${n(extra)}` : '';
  return {
  prompt: `You have at most $${n(cap)} to spend on a birthday dinner. Hiring the room costs $${n(base)}, and each guest’s meal costs $${n(w)}. With n guests the cost must satisfy ${n(w)}n + ${n(base)} ≤ ${n(cap)}. Enter how many dollars are left for meals once the room is paid for, then the largest whole number of guests you can invite.`,
  answer: [room, nmax],
  hints: [`Subtract the room hire from both sides: ${n(w)}n ≤ ${n(cap)} − ${n(base)}.`, `Divide both sides by ${n(w)}. Guests come whole, so take the largest whole number that is not more than the result.`],
  solution: `${n(w)}n + ${n(base)} ≤ ${n(cap)}, so ${n(w)}n ≤ ${n(room)}: $${n(room)} is left for meals. ${n(room)} ÷ ${n(w)} = ${n(nmax)}${left}, so n can be at most ${n(nmax)}. Check: ${n(nmax)} meals cost $${n(w * nmax)}, which fits, but ${n(nmax + 1)} meals would cost $${n(w * (nmax + 1))}, more than $${n(room)}. You can invite at most ${n(nmax)} guests.`,
  guidance: [
   { prompt: `Subtract ${n(base)} from both sides of ${n(w)}n + ${n(base)} ≤ ${n(cap)}. How many dollars are left for meals?`, answer: [room], explanation: `${n(cap)} − ${n(base)} = ${n(room)}, so ${n(w)}n ≤ ${n(room)}.` },
   { prompt: `${n(w)}n ≤ ${n(room)}. How many whole meals at $${n(w)} each can $${n(room)} pay for?`, answer: [nmax], explanation: `${n(room)} ÷ ${n(w)} = ${n(nmax)}${left}. ${n(nmax)} meals cost $${n(w * nmax)}, which is not more than $${n(room)}; one more meal would be too much.` }
  ] }; }
});

/* q18c (applied). A time limit with two fixed parts: w·n + a + b ≤ cap. The division always leaves a remainder, which is the third answer. */
add({
 id: 'q18c', parent: 'q18', kind: 'applied',
 title: 'Fitting in the gym circuits',
 brief: 'The outpost medic has set the crew a timed gym session, and you need to know how many circuits fit inside it.',
 prompt: 'A gym session may last at most 75 minutes. The warm-up takes 10 minutes and the stretch at the end takes 5 minutes. Each circuit of the machines takes 8 minutes, so with n circuits the time must satisfy 8n + 10 + 5 ≤ 75. Enter how many minutes are left for circuits, then the largest whole number of circuits that fit, then how many minutes are left over after those circuits.',
 answer: [60, 7, 4], labels: ['minutes left for circuits', 'largest number of circuits', 'minutes left over'], tolerance: 0.001,
 hints: [
  'Add the warm-up and the stretch into one plain number, then subtract it from both sides.',
  'Divide the minutes left by 8. Circuits come whole, so take the largest whole number that is not more than the result. The remainder of the division is the time left over.'
 ],
 solution: 'Tidy: 10 + 5 = 15, so 8n + 15 ≤ 75. Subtract 15 from both sides: 8n ≤ 60, so 60 minutes are left for circuits. 60 ÷ 8 = 7 remainder 4, so n can be at most 7. Check: 7 circuits take 56 minutes, which fits, but 8 circuits would take 64 minutes, more than 60. After 7 circuits, 60 − 56 = 4 minutes are left over.',
 guidance: [
  { prompt: 'The warm-up and the stretch take 10 + 5 = 15 minutes. Subtract 15 from both sides of 8n + 15 ≤ 75. How many minutes are left for circuits?', answer: [60], labels: ['minutes left for circuits'], explanation: '75 − 15 = 60, so 8n ≤ 60.' },
  { prompt: '8n ≤ 60. How many whole circuits of 8 minutes fit in 60 minutes?', answer: [7], labels: ['largest number of circuits'], explanation: '60 ÷ 8 = 7 remainder 4. 7 circuits take 56 minutes; one more would not fit.' },
  { prompt: '7 circuits take 56 of the 60 minutes. How many minutes are left over?', answer: [4], labels: ['minutes left over'], explanation: '60 − 56 = 4 minutes, less than one more circuit needs.' }
 ]
}, {
 canonical: { w: 8, a: 10, b: 5, nmax: 7, extra: 4 },
 draw: R => { const w = R.int(7, 15), nmax = R.int(3, 7);
  /* The session length is a multiple of 5 minutes and the minutes left over are never 0: 1 ≤ extra < w. */
  const first = (5 - (w * nmax) % 5) % 5 || 5;
  return { w, a: R.pick([5, 10, 15]), b: R.pick([5, 10]), nmax, extra: first + 5 * R.int(0, Math.floor((w - 1 - first) / 5)) }; },
 build: ({ w, a, b, nmax, extra }) => { const fixed = a + b, room = w * nmax + extra, cap = fixed + room; return {
  prompt: `A gym session may last at most ${n(cap)} minutes. The warm-up takes ${n(a)} minutes and the stretch at the end takes ${n(b)} minutes. Each circuit of the machines takes ${n(w)} minutes, so with n circuits the time must satisfy ${n(w)}n + ${n(a)} + ${n(b)} ≤ ${n(cap)}. Enter how many minutes are left for circuits, then the largest whole number of circuits that fit, then how many minutes are left over after those circuits.`,
  answer: [room, nmax, extra],
  hints: [`Add the warm-up and the stretch into one plain number, then subtract it from both sides.`, `Divide the minutes left by ${n(w)}. Circuits come whole, so take the largest whole number that is not more than the result. The remainder of the division is the time left over.`],
  solution: `Tidy: ${n(a)} + ${n(b)} = ${n(fixed)}, so ${n(w)}n + ${n(fixed)} ≤ ${n(cap)}. Subtract ${n(fixed)} from both sides: ${n(w)}n ≤ ${n(room)}, so ${n(room)} minutes are left for circuits. ${n(room)} ÷ ${n(w)} = ${n(nmax)} remainder ${n(extra)}, so n can be at most ${n(nmax)}. Check: ${n(nmax)} circuits take ${n(w * nmax)} minutes, which fits, but ${n(nmax + 1)} circuits would take ${n(w * (nmax + 1))} minutes, more than ${n(room)}. After ${n(nmax)} circuits, ${n(room)} − ${n(w * nmax)} = ${n(extra)} ${extra === 1 ? 'minute is' : 'minutes are'} left over.`,
  guidance: [
   { prompt: `The warm-up and the stretch take ${n(a)} + ${n(b)} = ${n(fixed)} minutes. Subtract ${n(fixed)} from both sides of ${n(w)}n + ${n(fixed)} ≤ ${n(cap)}. How many minutes are left for circuits?`, answer: [room], explanation: `${n(cap)} − ${n(fixed)} = ${n(room)}, so ${n(w)}n ≤ ${n(room)}.` },
   { prompt: `${n(w)}n ≤ ${n(room)}. How many whole circuits of ${n(w)} minutes fit in ${n(room)} minutes?`, answer: [nmax], explanation: `${n(room)} ÷ ${n(w)} = ${n(nmax)} remainder ${n(extra)}. ${n(nmax)} circuits take ${n(w * nmax)} minutes; one more would not fit.` },
   { prompt: `${n(nmax)} circuits take ${n(w * nmax)} of the ${n(room)} minutes. How many minutes are left over?`, answer: [extra], explanation: `${n(room)} − ${n(w * nmax)} = ${n(extra)} ${extra === 1 ? 'minute' : 'minutes'}, less than one more circuit needs.` }
  ] }; }
});

/* q18d (challenge). The inequality faces the other way: w·n + base ≥ G, so the answer is the smallest whole number in the range. The division always leaves a remainder, so the whole number below the result is never enough. */
add({
 id: 'q18d', parent: 'q18', kind: 'challenge',
 title: 'Weeks until the laptop',
 brief: 'A recruit is saving for a laptop out of her weekly pay, and asks how many weeks it will take to have enough.',
 prompt: 'You need at least $500 for a new laptop. You have $315 saved already and can put away $25 every week. After n weeks your savings must satisfy 25n + 315 ≥ 500; the symbol ≥ says the left side must be equal to the target or greater. Enter how many dollars you still have to save, then the smallest whole number of weeks that reaches the target, then how many dollars over the target you will be after those weeks.',
 answer: [185, 8, 15], labels: ['dollars still to save', 'smallest number of weeks', 'dollars over the target'], tolerance: 0.001,
 hints: [
  'Subtract what you have already from both sides: 25n ≥ 500 − 315.',
  'Divide both sides by 25. Weeks come whole, and here the savings must reach the target, so a number of weeks below the result is not enough: take the next whole number above it.'
 ],
 solution: '25n + 315 ≥ 500, so 25n ≥ 185: you still have to save $185. 185 ÷ 25 = 7 remainder 10, so 7 weeks are not enough: they add $175, less than $185. 8 weeks add $200, which is at least $185, so n must be at least 8. After 8 weeks you have 200 + 315 = 515 dollars, which is 515 − 500 = 15 dollars over the target.',
 guidance: [
  { prompt: 'Subtract 315 from both sides of 25n + 315 ≥ 500. How many dollars do you still have to save?', answer: [185], labels: ['dollars still to save'], explanation: '500 − 315 = 185, so 25n ≥ 185.' },
  { prompt: '185 ÷ 25 = 7 remainder 10, so 7 weeks add only $175. What is the smallest whole number of weeks that adds at least $185?', answer: [8], labels: ['smallest number of weeks'], explanation: '7 weeks fall short, and 8 weeks add $200, which is at least $185. With ≥ you take the next whole number up.' },
  { prompt: 'After 8 weeks you have 200 + 315 = 515 dollars. How many dollars over the $500 target is that?', answer: [15], labels: ['dollars over the target'], explanation: '515 − 500 = 15 dollars over.' }
 ]
}, {
 canonical: { w: 25, q: 7, r: 10, G: 500 },
 draw: R => { const w = R.pick([15, 20, 25, 30, 40, 50, 60]), q = R.int(5, 12), r = 5 * R.int(1, w / 5 - 1), need = w * q + r;
  /* The target is a multiple of 50; what is saved already (G − need) comes out between 80 and 549 dollars. */
  return { w, q, r, G: 50 * Math.ceil((need + R.int(80, 500)) / 50) }; },
 build: ({ w, q, r, G }) => { const need = w * q + r, base = G - need, weeks = q + 1, total = w * weeks + base, over = total - G; return {
  prompt: `You need at least $${n(G)} for a new laptop. You have $${n(base)} saved already and can put away $${n(w)} every week. After n weeks your savings must satisfy ${n(w)}n + ${n(base)} ≥ ${n(G)}; the symbol ≥ says the left side must be equal to the target or greater. Enter how many dollars you still have to save, then the smallest whole number of weeks that reaches the target, then how many dollars over the target you will be after those weeks.`,
  answer: [need, weeks, over],
  hints: [`Subtract what you have already from both sides: ${n(w)}n ≥ ${n(G)} − ${n(base)}.`, `Divide both sides by ${n(w)}. Weeks come whole, and here the savings must reach the target, so a number of weeks below the result is not enough: take the next whole number above it.`],
  solution: `${n(w)}n + ${n(base)} ≥ ${n(G)}, so ${n(w)}n ≥ ${n(need)}: you still have to save $${n(need)}. ${n(need)} ÷ ${n(w)} = ${n(q)} remainder ${n(r)}, so ${n(q)} weeks are not enough: they add $${n(w * q)}, less than $${n(need)}. ${n(weeks)} weeks add $${n(w * weeks)}, which is at least $${n(need)}, so n must be at least ${n(weeks)}. After ${n(weeks)} weeks you have ${n(w * weeks)} + ${n(base)} = ${n(total)} dollars, which is ${n(total)} − ${n(G)} = ${n(over)} dollars over the target.`,
  guidance: [
   { prompt: `Subtract ${n(base)} from both sides of ${n(w)}n + ${n(base)} ≥ ${n(G)}. How many dollars do you still have to save?`, answer: [need], explanation: `${n(G)} − ${n(base)} = ${n(need)}, so ${n(w)}n ≥ ${n(need)}.` },
   { prompt: `${n(need)} ÷ ${n(w)} = ${n(q)} remainder ${n(r)}, so ${n(q)} weeks add only $${n(w * q)}. What is the smallest whole number of weeks that adds at least $${n(need)}?`, answer: [weeks], explanation: `${n(q)} weeks fall short, and ${n(weeks)} weeks add $${n(w * weeks)}, which is at least $${n(need)}. With ≥ you take the next whole number up.` },
   { prompt: `After ${n(weeks)} weeks you have ${n(w * weeks)} + ${n(base)} = ${n(total)} dollars. How many dollars over the $${n(G)} target is that?`, answer: [over], explanation: `${n(total)} − ${n(G)} = ${n(over)} dollars over.` }
  ] }; }
});

/* ---------- q19: Coordinates in the plane ---------- */

/* q19b (setting). Writing coordinates from directions: east and south, then a point due west, which sits on the east–west street through the origin, so its y is 0. */
add({
 id: 'q19b', parent: 'q19', kind: 'setting',
 title: 'Pins on the city map',
 brief: 'Before the scouts trust the outpost grid, Mira has them practise on a city map app, dropping pins around the town hall.',
 prompt: 'A city map app puts the town hall at the origin (0, 0). x counts blocks east (negative means west) and y counts blocks north (negative means south). The library is 6 blocks east and 3 blocks south of the town hall: enter its x, then its y. The tram stop is 4 blocks due west of the town hall, on the same east–west street: enter its x, then its y.',
 answer: [6, -3, -4, 0], labels: ['library x', 'library y', 'tram stop x', 'tram stop y'], tolerance: 0.001,
 hints: [
  'East is the positive x direction. South is the negative y direction, so a point south of the town hall has a negative y.',
  'The tram stop is neither north nor south of the town hall, so think about what its y must be. West makes its x negative.'
 ],
 solution: 'The library is at (6, −3): x = 6 because it is east, and y = −3 because it is south. The tram stop is 4 blocks west, so x = −4, and it is no blocks north or south, so y = 0: it is at (−4, 0).',
 guidance: [
  { prompt: 'The library is 6 blocks east and 3 blocks south of the town hall. What are its x and y?', answer: [6, -3], labels: ['x', 'y'], explanation: 'East makes x positive and south makes y negative, so the library is at (6, −3).' },
  { prompt: 'The tram stop is 4 blocks west and no blocks north or south. What are its x and y?', answer: [-4, 0], labels: ['x', 'y'], explanation: 'West makes x negative, and no step north or south leaves y at 0, so the tram stop is at (−4, 0).' }
 ]
}, {
 canonical: { a: 6, b: 3, c: 4 },
 draw: R => ({ a: R.int(1, 9), b: R.int(1, 9), c: R.int(1, 9) }),
 build: ({ a, b, c }) => { /* "1 block" / "3 blocks" */ const bl = v => `${n(v)} ${v === 1 ? 'block' : 'blocks'}`; return {
  prompt: `A city map app puts the town hall at the origin (0, 0). x counts blocks east (negative means west) and y counts blocks north (negative means south). The library is ${bl(a)} east and ${bl(b)} south of the town hall: enter its x, then its y. The tram stop is ${bl(c)} due west of the town hall, on the same east–west street: enter its x, then its y.`,
  answer: [a, -b, -c, 0],
  hints: [`East is the positive x direction. South is the negative y direction, so a point south of the town hall has a negative y.`, `The tram stop is neither north nor south of the town hall, so think about what its y must be. West makes its x negative.`],
  solution: `The library is at ${G.vec([a, -b])}: x = ${n(a)} because it is east, and y = ${n(-b)} because it is south. The tram stop is ${bl(c)} west, so x = ${n(-c)}, and it is no blocks north or south, so y = 0: it is at ${G.vec([-c, 0])}.`,
  guidance: [
   { prompt: `The library is ${bl(a)} east and ${bl(b)} south of the town hall. What are its x and y?`, answer: [a, -b], explanation: `East makes x positive and south makes y negative, so the library is at ${G.vec([a, -b])}.` },
   { prompt: `The tram stop is ${bl(c)} west and no blocks north or south. What are its x and y?`, answer: [-c, 0], explanation: `West makes x negative, and no step north or south leaves y at 0, so the tram stop is at ${G.vec([-c, 0])}.` }
  ] }; }
});

/* q19c (applied). Moving on the grid: each leg changes x and y separately, and both cross 0 on the way (x on leg 1, y on leg 2). The second flag never lands on x = 0. */
add({
 id: 'q19c', parent: 'q19', kind: 'applied',
 title: 'Two legs to the flags',
 brief: 'A scout rover has two survey flags to plant, and the map room must log where each one ends up.',
 prompt: 'The map room grid has the depot at the origin (0, 0); x counts kilometres east (negative means west) and y counts kilometres north (negative means south). A scout rover starts at the gate, at (−5, 2). Leg 1 takes it 8 km east and 4 km north, where it plants the first flag. Leg 2 takes it 7 km west and 9 km south, where it plants the second flag. Enter the x and y of the first flag, then the x and y of the second flag.',
 answer: [3, 6, -4, -3], labels: ['first flag x', 'first flag y', 'second flag x', 'second flag y'], tolerance: 0.001,
 hints: [
  'East adds to x and west subtracts from it. North adds to y and south subtracts from it. Change one number at a time.',
  'A move can carry a number past 0. On the number line, going 8 to the right from −5 passes 0, and going 9 to the left from the first flag’s y passes 0 too.'
 ],
 solution: 'Start at (−5, 2). Leg 1: x = −5 + 8 = 3 and y = 2 + 4 = 6, so the first flag is at (3, 6). Leg 2: x = 3 − 7 = −4 and y = 6 − 9 = −3, so the second flag is at (−4, −3), which is 4 km west and 3 km south of the depot.',
 guidance: [
  { prompt: 'From (−5, 2) the rover goes 8 km east and 4 km north. What are the x and y of the first flag?', answer: [3, 6], labels: ['x', 'y'], explanation: 'East adds to x: −5 + 8 = 3. North adds to y: 2 + 4 = 6. The first flag is at (3, 6).' },
  { prompt: 'From (3, 6) the rover goes 7 km west and 9 km south. What are the x and y of the second flag?', answer: [-4, -3], labels: ['x', 'y'], explanation: 'West subtracts from x: 3 − 7 = −4. South subtracts from y: 6 − 9 = −3. The second flag is at (−4, −3).' }
 ]
}, {
 canonical: { x0: -5, y0: 2, a: 8, b: 4, c: 7, d: 9 },
 draw: R => { const x0 = -R.int(1, 8), y0 = R.int(1, 5), a = -x0 + R.int(1, 7), b = R.int(1, 5);
  return { x0, y0, a, b, c: R.except(1, 9, [x0 + a]), d: y0 + b + R.int(1, 6) }; },
 build: ({ x0, y0, a, b, c, d }) => { const x1 = x0 + a, y1 = y0 + b, x2 = x1 - c, y2 = y1 - d; return {
  prompt: `The map room grid has the depot at the origin (0, 0); x counts kilometres east (negative means west) and y counts kilometres north (negative means south). A scout rover starts at the gate, at ${G.vec([x0, y0])}. Leg 1 takes it ${n(a)} km east and ${n(b)} km north, where it plants the first flag. Leg 2 takes it ${n(c)} km west and ${n(d)} km south, where it plants the second flag. Enter the x and y of the first flag, then the x and y of the second flag.`,
  answer: [x1, y1, x2, y2],
  hints: [`East adds to x and west subtracts from it. North adds to y and south subtracts from it. Change one number at a time.`, `A move can carry a number past 0. On the number line, going ${n(a)} to the right from ${n(x0)} passes 0, and going ${n(d)} to the left from the first flag’s y passes 0 too.`],
  solution: `Start at ${G.vec([x0, y0])}. Leg 1: x = ${n(x0)} + ${n(a)} = ${n(x1)} and y = ${n(y0)} + ${n(b)} = ${n(y1)}, so the first flag is at ${G.vec([x1, y1])}. Leg 2: x = ${n(x1)} − ${n(c)} = ${n(x2)} and y = ${n(y1)} − ${n(d)} = ${n(y2)}, so the second flag is at ${G.vec([x2, y2])}, which is ${n(Math.abs(x2))} km ${x2 > 0 ? 'east' : 'west'} and ${n(Math.abs(y2))} km south of the depot.`,
  guidance: [
   { prompt: `From ${G.vec([x0, y0])} the rover goes ${n(a)} km east and ${n(b)} km north. What are the x and y of the first flag?`, answer: [x1, y1], explanation: `East adds to x: ${n(x0)} + ${n(a)} = ${n(x1)}. North adds to y: ${n(y0)} + ${n(b)} = ${n(y1)}. The first flag is at ${G.vec([x1, y1])}.` },
   { prompt: `From ${G.vec([x1, y1])} the rover goes ${n(c)} km west and ${n(d)} km south. What are the x and y of the second flag?`, answer: [x2, y2], explanation: `West subtracts from x: ${n(x1)} − ${n(c)} = ${n(x2)}. South subtracts from y: ${n(y1)} − ${n(d)} = ${n(y2)}. The second flag is at ${G.vec([x2, y2])}.` }
  ] }; }
});

/* q19d (challenge). Coordinates with a map scale (q12): every grid square is k km, so kilometres are divided by k to get squares and squares are multiplied by k to get kilometres. */
add({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q12',
 title: 'Reading the road atlas',
 brief: 'The only map of the far valley is an old road atlas, and its grid squares have to be turned into kilometres and back.',
 prompt: 'A road atlas page has a grid with the city centre at the origin (0, 0); x counts squares east (negative means west) and y counts squares north (negative means south). Every square is 5 km across, in both directions. A lake lies 20 km east and 15 km south of the centre: enter its x, then its y, in squares. A village is printed at (−6, 2): enter how many km west of the centre it is, then how many km north, both as positive distances.',
 answer: [4, -3, 30, 10], labels: ['lake x (squares)', 'lake y (squares)', 'village km west', 'village km north'], tolerance: 0.001,
 hints: [
  'One square is 5 km, so divide each distance in km by 5 to get squares. South of the centre makes y negative.',
  'For the village go the other way: multiply each number of squares by 5 to get km. In (−6, 2) the first number is east–west, and a negative x means west.'
 ],
 solution: 'Lake: 20 ÷ 5 = 4 squares east and 15 ÷ 5 = 3 squares south, so it is at (4, −3). Village at (−6, 2): 6 squares west and 2 squares north, which is 6 × 5 = 30 km west and 2 × 5 = 10 km north.',
 guidance: [
  { prompt: 'The lake is 20 km east and 15 km south, and one square is 5 km. What are its x and y in squares?', answer: [4, -3], labels: ['x (squares)', 'y (squares)'], explanation: '20 ÷ 5 = 4 squares east, so x = 4. 15 ÷ 5 = 3 squares south, so y = −3. The lake is at (4, −3).' },
  { prompt: 'The village is at (−6, 2), and one square is 5 km. How many km west, and how many km north, is it?', answer: [30, 10], labels: ['km west', 'km north'], explanation: 'The x is −6, so it is 6 squares west: 6 × 5 = 30 km. The y is 2, so it is 2 squares north: 2 × 5 = 10 km.' }
 ]
}, {
 canonical: { k: 5, a: 4, b: 3, p: 6, q: 2 },
 draw: R => ({ k: R.pick([2, 4, 5, 10, 20]), a: R.int(1, 9), b: R.int(1, 9), p: R.int(1, 9), q: R.int(1, 9) }),
 build: ({ k, a, b, p, q }) => { const A = k * a, B = k * b, W = k * p, N = k * q, /* "1 square" / "3 squares" */ sq = v => `${n(v)} ${v === 1 ? 'square' : 'squares'}`; return {
  prompt: `A road atlas page has a grid with the city centre at the origin (0, 0); x counts squares east (negative means west) and y counts squares north (negative means south). Every square is ${n(k)} km across, in both directions. A lake lies ${n(A)} km east and ${n(B)} km south of the centre: enter its x, then its y, in squares. A village is printed at ${G.vec([-p, q])}: enter how many km west of the centre it is, then how many km north, both as positive distances.`,
  answer: [a, -b, W, N],
  hints: [`One square is ${n(k)} km, so divide each distance in km by ${n(k)} to get squares. South of the centre makes y negative.`, `For the village go the other way: multiply each number of squares by ${n(k)} to get km. In ${G.vec([-p, q])} the first number is east–west, and a negative x means west.`],
  solution: `Lake: ${n(A)} ÷ ${n(k)} = ${sq(a)} east and ${n(B)} ÷ ${n(k)} = ${sq(b)} south, so it is at ${G.vec([a, -b])}. Village at ${G.vec([-p, q])}: ${sq(p)} west and ${sq(q)} north, which is ${n(p)} × ${n(k)} = ${n(W)} km west and ${n(q)} × ${n(k)} = ${n(N)} km north.`,
  guidance: [
   { prompt: `The lake is ${n(A)} km east and ${n(B)} km south, and one square is ${n(k)} km. What are its x and y in squares?`, answer: [a, -b], explanation: `${n(A)} ÷ ${n(k)} = ${sq(a)} east, so x = ${n(a)}. ${n(B)} ÷ ${n(k)} = ${sq(b)} south, so y = ${n(-b)}. The lake is at ${G.vec([a, -b])}.` },
   { prompt: `The village is at ${G.vec([-p, q])}, and one square is ${n(k)} km. How many km west, and how many km north, is it?`, answer: [W, N], explanation: `The x is ${n(-p)}, so it is ${sq(p)} west: ${n(p)} × ${n(k)} = ${n(W)} km. The y is ${n(q)}, so it is ${sq(q)} north: ${n(q)} × ${n(k)} = ${n(N)} km.` }
  ] }; }
});

/* ---------- q20: Distance between two points ---------- */

/* q20b (setting). Pythagoras’ rule without a grid: the sides of a rectangle are the two short sides, its diagonal is the long side. `what` picks the thing being marked out: 0 patio, 1 deck, 2 lawn, 3 vegetable bed. */
add({
 id: 'q20b', parent: 'q20', kind: 'setting',
 title: 'Squaring the corners',
 brief: 'Mira learned Pythagoras’ rule from a builder who used it to check square corners, and she passes his test on to you.',
 prompt: 'You are marking out a rectangular patio, 9 m wide and 12 m long. Builders check that the corners are square by measuring the diagonal, the straight line from one corner to the opposite corner. The width, the length and the diagonal make a triangle with a square corner. Enter the width times itself plus the length times itself, then the length the diagonal must be, in metres.',
 answer: [225, 15], labels: ['width × width + length × length', 'diagonal (m)'], tolerance: 0.001,
 hints: [
  'The two short sides of the triangle are the width and the length. Multiply each by itself, then add the two results.',
  'The diagonal is the square root of that sum: the number that, multiplied by itself, gives it. It is longer than the 12 m side, so start trying numbers just above 12.'
 ],
 solution: 'Width times itself: 9 × 9 = 81. Length times itself: 12 × 12 = 144. Sum: 81 + 144 = 225. The diagonal times itself is 225, and 15 × 15 = 225, so the square root of 225 is 15. If the corners are square, the diagonal of the patio measures 15 m.',
 guidance: [
  { prompt: 'Multiply each side by itself: 9 × 9, then 12 × 12. What are the two results?', answer: [81, 144], labels: ['width times itself', 'length times itself'], explanation: '9 × 9 = 81 and 12 × 12 = 144.' },
  { prompt: 'Add the two results, 81 and 144. What is the sum?', answer: [225], labels: ['sum of the two results'], explanation: '81 + 144 = 225. This is the diagonal times itself.' },
  { prompt: 'What number times itself gives 225?', answer: [15], labels: ['diagonal (m)'], explanation: '15 × 15 = 225, so the diagonal is 15 m.' }
 ]
}, {
 canonical: { W: 9, L: 12, d: 15, what: 0 },
 draw: R => { const t = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25], [7, 24, 25], [10, 24, 26], [18, 24, 30]]);
  return { W: t[0], L: t[1], d: t[2], what: R.int(0, 3) }; },
 build: ({ W, L, d, what }) => { const S = W * W + L * L, thing = ['patio', 'deck', 'lawn', 'vegetable bed'][what]; return {
  prompt: `You are marking out a rectangular ${thing}, ${n(W)} m wide and ${n(L)} m long. Builders check that the corners are square by measuring the diagonal, the straight line from one corner to the opposite corner. The width, the length and the diagonal make a triangle with a square corner. Enter the width times itself plus the length times itself, then the length the diagonal must be, in metres.`,
  answer: [S, d],
  hints: [`The two short sides of the triangle are the width and the length. Multiply each by itself, then add the two results.`, `The diagonal is the square root of that sum: the number that, multiplied by itself, gives it. It is longer than the ${n(L)} m side, so start trying numbers just above ${n(L)}.`],
  solution: `Width times itself: ${n(W)} × ${n(W)} = ${n(W * W)}. Length times itself: ${n(L)} × ${n(L)} = ${n(L * L)}. Sum: ${n(W * W)} + ${n(L * L)} = ${n(S)}. The diagonal times itself is ${n(S)}, and ${n(d)} × ${n(d)} = ${n(S)}, so the square root of ${n(S)} is ${n(d)}. If the corners are square, the diagonal of the ${thing} measures ${n(d)} m.`,
  guidance: [
   { prompt: `Multiply each side by itself: ${n(W)} × ${n(W)}, then ${n(L)} × ${n(L)}. What are the two results?`, answer: [W * W, L * L], explanation: `${n(W)} × ${n(W)} = ${n(W * W)} and ${n(L)} × ${n(L)} = ${n(L * L)}.` },
   { prompt: `Add the two results, ${n(W * W)} and ${n(L * L)}. What is the sum?`, answer: [S], explanation: `${n(W * W)} + ${n(L * L)} = ${n(S)}. This is the diagonal times itself.` },
   { prompt: `What number times itself gives ${n(S)}?`, answer: [d], explanation: `${n(d)} × ${n(d)} = ${n(S)}, so the diagonal is ${n(d)} m.` }
  ] }; }
});

/* q20c (applied). One right triangle, two routes: the road is the sum of the gaps (the lesson’s first pitfall, here asked for on purpose) and the ferry is the straight distance. Ashby’s x is always negative, so the east–west gap is counted from a negative number. */
add({
 id: 'q20c', parent: 'q20', kind: 'applied',
 title: 'Road or ferry',
 brief: 'Mira is planning her trip home on leave and wants to know how much shorter the ferry is than the road.',
 prompt: 'Two towns are marked on a map grid in kilometres: Ashby at (−2, 1) and Brook at (10, −4). The road between them follows the grid lines, first east–west and then north–south. A ferry crosses the bay in a straight line from one town to the other. Enter the length of the road route in km, then the length of the ferry crossing in km, then how many km shorter the ferry is.',
 answer: [17, 13, 4], labels: ['road route (km)', 'ferry crossing (km)', 'km shorter by ferry'], tolerance: 0.001,
 hints: [
  'Find the two gaps first: for each direction, the larger value minus the smaller. Taking away a negative number adds its size.',
  'The road is the two gaps added together. The ferry is the long side of the triangle: multiply each gap by itself, add the two results, and take the square root.'
 ],
 solution: 'East–west gap: 10 − (−2) = 12 km. North–south gap: 1 − (−4) = 5 km. Road: 12 + 5 = 17 km. Ferry: 12 × 12 + 5 × 5 = 144 + 25 = 169, and 13 × 13 = 169, so the square root of 169 is 13 and the crossing is 13 km. The ferry is 17 − 13 = 4 km shorter.',
 guidance: [
  { prompt: 'The x values are −2 and 10; the y values are 1 and −4. What are the east–west gap and the north–south gap?', answer: [12, 5], labels: ['east–west gap (km)', 'north–south gap (km)'], explanation: '10 − (−2) = 12 km and 1 − (−4) = 5 km.' },
  { prompt: '12 × 12 + 5 × 5 = 169. What number times itself gives 169? That is the ferry crossing.', answer: [13], labels: ['ferry crossing (km)'], explanation: '13 × 13 = 169, so the ferry crossing is 13 km.' },
  { prompt: 'The road covers both gaps, 12 km and 5 km. How long is the road route, and how many km shorter is the 13 km ferry?', answer: [17, 4], labels: ['road route (km)', 'km shorter by ferry'], explanation: '12 + 5 = 17 km by road, and 17 − 13 = 4 km shorter by ferry.' }
 ]
}, {
 canonical: { x1: -2, y1: 1, dx: 12, dy: 5, d: 13, sy: -1 },
 draw: R => { const t = R.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [8, 15, 17], [15, 8, 17], [12, 16, 20], [16, 12, 20]]);
  return { x1: -R.int(1, 6), y1: R.int(-5, 5), dx: t[0], dy: t[1], d: t[2], sy: R.pick([1, -1]) }; },
 build: ({ x1, y1, dx, dy, d, sy }) => { const x2 = x1 + dx, y2 = y1 + sy * dy, S = dx * dx + dy * dy, road = dx + dy, saved = road - d;
  const ya = Math.max(y1, y2), yb = Math.min(y1, y2); return {
  prompt: `Two towns are marked on a map grid in kilometres: Ashby at ${G.vec([x1, y1])} and Brook at ${G.vec([x2, y2])}. The road between them follows the grid lines, first east–west and then north–south. A ferry crosses the bay in a straight line from one town to the other. Enter the length of the road route in km, then the length of the ferry crossing in km, then how many km shorter the ferry is.`,
  answer: [road, d, saved],
  hints: [`Find the two gaps first: for each direction, the larger value minus the smaller. Taking away a negative number adds its size.`, `The road is the two gaps added together. The ferry is the long side of the triangle: multiply each gap by itself, add the two results, and take the square root.`],
  solution: `East–west gap: ${n(x2)} − ${par(x1)} = ${n(dx)} km. North–south gap: ${n(ya)} − ${par(yb)} = ${n(dy)} km. Road: ${n(dx)} + ${n(dy)} = ${n(road)} km. Ferry: ${n(dx)} × ${n(dx)} + ${n(dy)} × ${n(dy)} = ${n(dx * dx)} + ${n(dy * dy)} = ${n(S)}, and ${n(d)} × ${n(d)} = ${n(S)}, so the square root of ${n(S)} is ${n(d)} and the crossing is ${n(d)} km. The ferry is ${n(road)} − ${n(d)} = ${n(saved)} km shorter.`,
  guidance: [
   { prompt: `The x values are ${n(x1)} and ${n(x2)}; the y values are ${n(y1)} and ${n(y2)}. What are the east–west gap and the north–south gap?`, answer: [dx, dy], explanation: `${n(x2)} − ${par(x1)} = ${n(dx)} km and ${n(ya)} − ${par(yb)} = ${n(dy)} km.` },
   { prompt: `${n(dx)} × ${n(dx)} + ${n(dy)} × ${n(dy)} = ${n(S)}. What number times itself gives ${n(S)}? That is the ferry crossing.`, answer: [d], explanation: `${n(d)} × ${n(d)} = ${n(S)}, so the ferry crossing is ${n(d)} km.` },
   { prompt: `The road covers both gaps, ${n(dx)} km and ${n(dy)} km. How long is the road route, and how many km shorter is the ${n(d)} km ferry?`, answer: [road, saved], explanation: `${n(dx)} + ${n(dy)} = ${n(road)} km by road, and ${n(road)} − ${n(d)} = ${n(saved)} km shorter by ferry.` }
  ] }; }
});

/* q20d (challenge). Two straight legs, so the rule is used twice and the results are added. The legs have different lengths, and leg 2 heads back towards the depot’s side of the grid so that gaps cross 0. */
add({
 id: 'q20d', parent: 'q20', kind: 'challenge',
 title: 'The drone’s supply run',
 brief: 'A supply drone must visit two caches in one flight, and the map room needs the length of the whole run to check its battery.',
 prompt: 'The map room grid is in kilometres. A supply drone takes off from the pad at (−3, 2), flies straight to cache 1 at (5, −4), then flies straight on to cache 2 at (−4, 8), where it lands. Enter the length of the first leg, then the second leg, then the whole run, in km.',
 answer: [10, 15, 25], labels: ['first leg (km)', 'second leg (km)', 'whole run (km)'], tolerance: 0.001,
 hints: [
  'Work on one leg at a time. For each leg find the east–west gap and the north–south gap: the larger value minus the smaller. Taking away a negative number adds its size.',
  'For each leg, multiply each gap by itself, add the two results, and take the square root. Add the two legs only at the very end.'
 ],
 solution: 'Leg 1, from (−3, 2) to (5, −4): the gaps are 5 − (−3) = 8 km and 2 − (−4) = 6 km. 8 × 8 + 6 × 6 = 64 + 36 = 100, and 10 × 10 = 100, so leg 1 is 10 km. Leg 2, from (5, −4) to (−4, 8): the gaps are 5 − (−4) = 9 km and 8 − (−4) = 12 km. 9 × 9 + 12 × 12 = 81 + 144 = 225, and 15 × 15 = 225, so leg 2 is 15 km. Whole run: 10 + 15 = 25 km.',
 guidance: [
  { prompt: 'Leg 1 runs from (−3, 2) to (5, −4). What are its east–west gap and its north–south gap?', answer: [8, 6], labels: ['east–west gap (km)', 'north–south gap (km)'], explanation: '5 − (−3) = 8 km and 2 − (−4) = 6 km.' },
  { prompt: '8 × 8 + 6 × 6 = 100. What number times itself gives 100?', answer: [10], labels: ['first leg (km)'], explanation: '10 × 10 = 100, so leg 1 is 10 km.' },
  { prompt: 'Leg 2 runs from (5, −4) to (−4, 8). What are its east–west gap and its north–south gap?', answer: [9, 12], labels: ['east–west gap (km)', 'north–south gap (km)'], explanation: '5 − (−4) = 9 km and 8 − (−4) = 12 km.' },
  { prompt: '9 × 9 + 12 × 12 = 225. What number times itself gives 225?', answer: [15], labels: ['second leg (km)'], explanation: '15 × 15 = 225, so leg 2 is 15 km.' },
  { prompt: 'The legs are 10 km and 15 km. How long is the whole run?', answer: [25], labels: ['whole run (km)'], explanation: '10 + 15 = 25 km.' }
 ]
}, {
 canonical: { x0: -3, y0: 2, dx1: 8, dy1: 6, d1: 10, sx1: 1, sy1: -1, dx2: 9, dy2: 12, d2: 15 },
 draw: R => { const T = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [8, 15, 17], [15, 8, 17], [12, 16, 20], [16, 12, 20]];
  const t1 = R.pick(T), t2 = R.pick(T.filter(t => t[2] !== t1[2]));
  return { x0: R.int(-6, 6), y0: R.int(-6, 6), dx1: t1[0], dy1: t1[1], d1: t1[2], sx1: R.pick([1, -1]), sy1: R.pick([1, -1]), dx2: t2[0], dy2: t2[1], d2: t2[2] }; },
 build: ({ x0, y0, dx1, dy1, d1, sx1, sy1, dx2, dy2, d2 }) => {
  const x1 = x0 + sx1 * dx1, y1 = y0 + sy1 * dy1;
  /* Leg 2 turns back: west if cache 1 is east of the depot line, otherwise east; south if it is north, otherwise north. */
  const x2 = x1 + (x1 > 0 ? -1 : 1) * dx2, y2 = y1 + (y1 > 0 ? -1 : 1) * dy2;
  const S1 = dx1 * dx1 + dy1 * dy1, S2 = dx2 * dx2 + dy2 * dy2, total = d1 + d2;
  const hi = (u, v) => n(Math.max(u, v)), lo = (u, v) => par(Math.min(u, v)); return {
  prompt: `The map room grid is in kilometres. A supply drone takes off from the pad at ${G.vec([x0, y0])}, flies straight to cache 1 at ${G.vec([x1, y1])}, then flies straight on to cache 2 at ${G.vec([x2, y2])}, where it lands. Enter the length of the first leg, then the second leg, then the whole run, in km.`,
  answer: [d1, d2, total],
  hints: [`Work on one leg at a time. For each leg find the east–west gap and the north–south gap: the larger value minus the smaller. Taking away a negative number adds its size.`, `For each leg, multiply each gap by itself, add the two results, and take the square root. Add the two legs only at the very end.`],
  solution: `Leg 1, from ${G.vec([x0, y0])} to ${G.vec([x1, y1])}: the gaps are ${hi(x0, x1)} − ${lo(x0, x1)} = ${n(dx1)} km and ${hi(y0, y1)} − ${lo(y0, y1)} = ${n(dy1)} km. ${n(dx1)} × ${n(dx1)} + ${n(dy1)} × ${n(dy1)} = ${n(dx1 * dx1)} + ${n(dy1 * dy1)} = ${n(S1)}, and ${n(d1)} × ${n(d1)} = ${n(S1)}, so leg 1 is ${n(d1)} km. Leg 2, from ${G.vec([x1, y1])} to ${G.vec([x2, y2])}: the gaps are ${hi(x1, x2)} − ${lo(x1, x2)} = ${n(dx2)} km and ${hi(y1, y2)} − ${lo(y1, y2)} = ${n(dy2)} km. ${n(dx2)} × ${n(dx2)} + ${n(dy2)} × ${n(dy2)} = ${n(dx2 * dx2)} + ${n(dy2 * dy2)} = ${n(S2)}, and ${n(d2)} × ${n(d2)} = ${n(S2)}, so leg 2 is ${n(d2)} km. Whole run: ${n(d1)} + ${n(d2)} = ${n(total)} km.`,
  guidance: [
   { prompt: `Leg 1 runs from ${G.vec([x0, y0])} to ${G.vec([x1, y1])}. What are its east–west gap and its north–south gap?`, answer: [dx1, dy1], explanation: `${hi(x0, x1)} − ${lo(x0, x1)} = ${n(dx1)} km and ${hi(y0, y1)} − ${lo(y0, y1)} = ${n(dy1)} km.` },
   { prompt: `${n(dx1)} × ${n(dx1)} + ${n(dy1)} × ${n(dy1)} = ${n(S1)}. What number times itself gives ${n(S1)}?`, answer: [d1], explanation: `${n(d1)} × ${n(d1)} = ${n(S1)}, so leg 1 is ${n(d1)} km.` },
   { prompt: `Leg 2 runs from ${G.vec([x1, y1])} to ${G.vec([x2, y2])}. What are its east–west gap and its north–south gap?`, answer: [dx2, dy2], explanation: `${hi(x1, x2)} − ${lo(x1, x2)} = ${n(dx2)} km and ${hi(y1, y2)} − ${lo(y1, y2)} = ${n(dy2)} km.` },
   { prompt: `${n(dx2)} × ${n(dx2)} + ${n(dy2)} × ${n(dy2)} = ${n(S2)}. What number times itself gives ${n(S2)}?`, answer: [d2], explanation: `${n(d2)} × ${n(d2)} = ${n(S2)}, so leg 2 is ${n(d2)} km.` },
   { prompt: `The legs are ${n(d1)} km and ${n(d2)} km. How long is the whole run?`, answer: [total], explanation: `${n(d1)} + ${n(d2)} = ${n(total)} km.` }
  ] }; }
});
})();
