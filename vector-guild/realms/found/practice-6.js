/* Foundations practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d ... q30b q30c q30d). Format and rules: docs/PACK-FORMAT.md, "Practice missions".
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/found/oracle-p6.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Coefficient in front of a letter: cf(1) → "", cf(4) → "4". */
const cf = k => k === 1 ? '' : n(k);
/* Superscript digits for exponents: sup(12) → "¹²". */
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
/* A count with its noun: cnt(1, 'lamp') → "1 lamp", cnt(3, 'lamp') → "3 lamps". */
const cnt = (m, word) => `${n(m)} ${word}${m === 1 ? '' : 's'}`;
/* One unknown left after a subtraction: "2x = 26 − 18 = 8, so x = 4", or "x = 26 − 18 = 8" when its number is 1. */
const left = (k, v, top, base, val) => k === 1 ? `${v} = ${n(top)} − ${n(base)} = ${n(val)}` : `${n(k)}${v} = ${n(top)} − ${n(base)} = ${n(top - base)}, so ${v} = ${n(val)}`;
const sum = list => list.reduce((s, v) => s + v, 0);

/* ---- q26 Solving a system by substitution ---- */

/* School show tickets: y = k·x + d (a multiple and a bit more) substituted into p·x + q·y = W. */
add({
 id: 'q26b', parent: 'q26', kind: 'setting',
 title: 'Tickets for the school show',
 brief: 'The ticket money from a school show has been counted, but nobody wrote down how many adult and child tickets were sold.',
 prompt: 'Tickets for a school show cost $7 for an adult and $3 for a child. The number of child tickets sold was 5 more than twice the number of adult tickets, so y = 2x + 5, where x is the number of adult tickets and y the number of child tickets. The ticket money came to $119, so 7x + 3y = 119. Enter x, then y.',
 answer: [8, 21], labels: ['x (adult tickets)', 'y (child tickets)'], tolerance: 0.001,
 hints: [
  'Replace y in the money equation with 2x + 5, in brackets: 7x + 3(2x + 5) = 119.',
  'The 3 multiplies both parts of the brackets. Then combine the x terms, take the plain number from both sides and divide.'
 ],
 solution: 'Substitute y = 2x + 5: 7x + 3(2x + 5) = 119. Multiply out: 7x + 6x + 15 = 119, so 13x + 15 = 119. Take 15 from both sides: 13x = 104, so x = 104 ÷ 13 = 8. Then y = 2 × 8 + 5 = 21. Check: 7 × 8 + 3 × 21 = 56 + 63 = 119 dollars.',
 guidance: [
  { prompt: 'Multiply out 3(2x + 5). Enter the number in front of x, then the number on its own.', answer: [6, 15], labels: ['number in front of x', 'number on its own'], explanation: '3 × 2x = 6x and 3 × 5 = 15, so the brackets become 6x + 15.' },
  { prompt: 'Now 7x + 6x + 15 = 119, which is 13x + 15 = 119. What is x?', answer: [8], labels: ['x (adult tickets)'], explanation: '13x = 119 − 15 = 104, so x = 104 ÷ 13 = 8 adult tickets.' },
  { prompt: 'y = 2x + 5 and x = 8. What is y?', answer: [21], labels: ['y (child tickets)'], explanation: 'y = 2 × 8 + 5 = 21 child tickets. Check: $56 + $63 = $119.' }
 ]
}, {
 canonical: { x: 8, k: 2, d: 5, p: 7, q: 3 },
 /* q ≥ 2 and d ≥ 2, so multiplying only the first part of the brackets never gives the right x. */
 /* The number in front of x after combining, p + q·k, is 10 to 13, 15 or 20, so the last division stays easy. */
 draw: R => { for (let tries = 0; tries < 300; tries++) {
   const k = R.pick([2, 3]), p = R.int(6, 9), q = R.int(2, 5);
   if (![10, 11, 12, 13, 15, 20].includes(p + q * k)) continue;
   return { x: R.int(4, 15), k, d: R.int(2, 9), p, q };
  } return { x: 8, k: 2, d: 5, p: 7, q: 3 }; },
 build: ({ x, k, d, p, q }) => { const y = k * x + d, W = p * x + q * y, qk = q * k, qd = q * d, s = p + qk; return {
  prompt: `Tickets for a school show cost $${n(p)} for an adult and $${n(q)} for a child. The number of child tickets sold was ${n(d)} more than ${k === 2 ? 'twice' : 'three times'} the number of adult tickets, so y = ${n(k)}x + ${n(d)}, where x is the number of adult tickets and y the number of child tickets. The ticket money came to $${n(W)}, so ${n(p)}x + ${n(q)}y = ${n(W)}. Enter x, then y.`,
  answer: [x, y],
  hints: [`Replace y in the money equation with ${n(k)}x + ${n(d)}, in brackets: ${n(p)}x + ${n(q)}(${n(k)}x + ${n(d)}) = ${n(W)}.`, `The ${n(q)} multiplies both parts of the brackets. Then combine the x terms, take the plain number from both sides and divide.`],
  solution: `Substitute y = ${n(k)}x + ${n(d)}: ${n(p)}x + ${n(q)}(${n(k)}x + ${n(d)}) = ${n(W)}. Multiply out: ${n(p)}x + ${n(qk)}x + ${n(qd)} = ${n(W)}, so ${n(s)}x + ${n(qd)} = ${n(W)}. Take ${n(qd)} from both sides: ${n(s)}x = ${n(W - qd)}, so x = ${n(W - qd)} ÷ ${n(s)} = ${n(x)}. Then y = ${n(k)} × ${n(x)} + ${n(d)} = ${n(y)}. Check: ${n(p)} × ${n(x)} + ${n(q)} × ${n(y)} = ${n(p * x)} + ${n(q * y)} = ${n(W)} dollars.`,
  guidance: [
   { prompt: `Multiply out ${n(q)}(${n(k)}x + ${n(d)}). Enter the number in front of x, then the number on its own.`, answer: [qk, qd], explanation: `${n(q)} × ${n(k)}x = ${n(qk)}x and ${n(q)} × ${n(d)} = ${n(qd)}, so the brackets become ${n(qk)}x + ${n(qd)}.` },
   { prompt: `Now ${n(p)}x + ${n(qk)}x + ${n(qd)} = ${n(W)}, which is ${n(s)}x + ${n(qd)} = ${n(W)}. What is x?`, answer: [x], explanation: `${n(s)}x = ${n(W)} − ${n(qd)} = ${n(W - qd)}, so x = ${n(W - qd)} ÷ ${n(s)} = ${n(x)} adult tickets.` },
   { prompt: `y = ${n(k)}x + ${n(d)} and x = ${n(x)}. What is y?`, answer: [y], explanation: `y = ${n(k)} × ${n(x)} + ${n(d)} = ${n(y)} child tickets. Check: $${n(p * x)} + $${n(q * y)} = $${n(W)}.` }
  ] }; }
});

/* A week's pay: the first fact gives x (not y), x = y + d, and the answer goes on to the weekend pay. */
add({
 id: 'q26c', parent: 'q26', kind: 'applied',
 title: 'Dana’s pay slip',
 brief: 'A pay slip shows only the total for the week, and the weekday and weekend hours have to be worked back from it.',
 prompt: 'Dana is paid $12 an hour on weekdays and $18 an hour at weekends. Last week she worked 14 more weekday hours than weekend hours, so x = y + 14, where x is her weekday hours and y her weekend hours. Her pay for the week was $348, so 12x + 18y = 348. Enter y, then x, then the dollars she earned at the weekend.',
 answer: [6, 20, 108], labels: ['y (weekend hours)', 'x (weekday hours)', 'weekend pay ($)'], tolerance: 0.001,
 hints: [
  'This time the first fact says what x equals, so replace x in the pay equation: 12(y + 14) + 18y = 348.',
  'Multiply out the brackets, combine the y terms, take the plain number from both sides, then divide.',
  'Weekend pay is the weekend hours times the weekend rate.'
 ],
 solution: 'Substitute x = y + 14: 12(y + 14) + 18y = 348. Multiply out: 12y + 168 + 18y = 348, so 30y + 168 = 348. Take 168 from both sides: 30y = 180, so y = 180 ÷ 30 = 6 weekend hours. Then x = 6 + 14 = 20 weekday hours. Weekend pay: 6 × 18 = 108 dollars. Check: 12 × 20 + 108 = 240 + 108 = 348.',
 guidance: [
  { prompt: 'Put y + 14 in place of x: 12(y + 14) + 18y = 348, which multiplies out to 30y + 168 = 348. What is y?', answer: [6], labels: ['y (weekend hours)'], explanation: '30y = 348 − 168 = 180, so y = 180 ÷ 30 = 6 weekend hours.' },
  { prompt: 'x = y + 14 and y = 6. What is x?', answer: [20], labels: ['x (weekday hours)'], explanation: 'x = 6 + 14 = 20 weekday hours.' },
  { prompt: 'She worked 6 weekend hours at $18 an hour. How many dollars is that?', answer: [108], labels: ['weekend pay ($)'], explanation: '6 × 18 = 108 dollars. Weekday pay was 20 × 12 = 240 dollars, and 240 + 108 = 348.' }
 ]
}, {
 canonical: { p: 12, q: 18, y: 6, d: 14 },
 /* The two rates add to 25, 30, 40 or 50, so the last division stays easy. */
 draw: R => { const [p, q] = R.pick([[10, 15], [10, 20], [12, 18], [15, 25], [16, 24], [20, 30]]); return { p, q, y: R.int(3, 10), d: R.int(5, 20) }; },
 build: ({ p, q, y, d }) => { const x = y + d, W = p * x + q * y, s = p + q, pd = p * d; return {
  prompt: `Dana is paid $${n(p)} an hour on weekdays and $${n(q)} an hour at weekends. Last week she worked ${n(d)} more weekday hours than weekend hours, so x = y + ${n(d)}, where x is her weekday hours and y her weekend hours. Her pay for the week was $${n(W)}, so ${n(p)}x + ${n(q)}y = ${n(W)}. Enter y, then x, then the dollars she earned at the weekend.`,
  answer: [y, x, q * y],
  hints: [`This time the first fact says what x equals, so replace x in the pay equation: ${n(p)}(y + ${n(d)}) + ${n(q)}y = ${n(W)}.`, `Multiply out the brackets, combine the y terms, take the plain number from both sides, then divide.`, `Weekend pay is the weekend hours times the weekend rate.`],
  solution: `Substitute x = y + ${n(d)}: ${n(p)}(y + ${n(d)}) + ${n(q)}y = ${n(W)}. Multiply out: ${n(p)}y + ${n(pd)} + ${n(q)}y = ${n(W)}, so ${n(s)}y + ${n(pd)} = ${n(W)}. Take ${n(pd)} from both sides: ${n(s)}y = ${n(W - pd)}, so y = ${n(W - pd)} ÷ ${n(s)} = ${n(y)} weekend hours. Then x = ${n(y)} + ${n(d)} = ${n(x)} weekday hours. Weekend pay: ${n(y)} × ${n(q)} = ${n(q * y)} dollars. Check: ${n(p)} × ${n(x)} + ${n(q * y)} = ${n(p * x)} + ${n(q * y)} = ${n(W)}.`,
  guidance: [
   { prompt: `Put y + ${n(d)} in place of x: ${n(p)}(y + ${n(d)}) + ${n(q)}y = ${n(W)}, which multiplies out to ${n(s)}y + ${n(pd)} = ${n(W)}. What is y?`, answer: [y], explanation: `${n(s)}y = ${n(W)} − ${n(pd)} = ${n(W - pd)}, so y = ${n(W - pd)} ÷ ${n(s)} = ${n(y)} weekend hours.` },
   { prompt: `x = y + ${n(d)} and y = ${n(y)}. What is x?`, answer: [x], explanation: `x = ${n(y)} + ${n(d)} = ${n(x)} weekday hours.` },
   { prompt: `She worked ${n(y)} weekend hours at $${n(q)} an hour. How many dollars is that?`, answer: [q * y], explanation: `${n(y)} × ${n(q)} = ${n(q * y)} dollars. Weekday pay was ${n(x)} × ${n(p)} = ${n(p * x)} dollars, and ${n(p * x)} + ${n(q * y)} = ${n(W)}.` }
  ] }; }
});

/* Notes in a till: x + y = N has to be rearranged (one-step equations, q16) before it can be substituted. */
add({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q16',
 title: 'Counting the till',
 brief: 'A shop till holds two kinds of note, and only the number of notes and their total value are known.',
 prompt: 'At closing time a shop till holds 15 notes, all of them $5 or $20 notes, worth $165 in all. With x for the number of $5 notes and y for the number of $20 notes, x + y = 15 and 5x + 20y = 165. Neither equation says what a letter equals yet, so first get x on its own in x + y = 15. One rule is new here: a number in front of a bracket with a take-away multiplies both parts and the take-away stays, so 3(10 − y) is 30 − 3y. Enter x, then y.',
 answer: [9, 6], labels: ['x (smaller notes)', 'y (larger notes)'], tolerance: 0.001,
 hints: [
  'Take y from both sides of x + y = 15: x = 15 − y. Now you can substitute.',
  'Replace x with 15 − y, in brackets: 5(15 − y) + 20y = 165. The 5 multiplies both parts: 5 × 15, take away 5y.',
  'Taking 5y from 20y leaves 15y. Solve for y, then go back to x = 15 − y.'
 ],
 solution: 'Take y from both sides of x + y = 15: x = 15 − y. Substitute: 5(15 − y) + 20y = 165. Multiply out. The 5 multiplies both parts and the take-away stays: 5 lots of 15, take away 5 lots of y, so 75 − 5y + 20y = 165. Taking away 5y and then adding 20y leaves 15y more, so 75 + 15y = 165. Take 75 from both sides: 15y = 90, so y = 90 ÷ 15 = 6. Then x = 15 − 6 = 9. Check: 5 × 9 + 20 × 6 = 45 + 120 = 165 dollars.',
 guidance: [
  { prompt: 'Take y from both sides of x + y = 15 to get x = 15 − y, then replace x: 5(15 − y) + 20y = 165. Multiplying out the brackets gives a plain number, take away 5y. What is the plain number?', answer: [75], labels: ['plain number'], explanation: '5 × 15 = 75, so 5(15 − y) = 75 − 5y. The 5 multiplies both parts.' },
  { prompt: 'Now 75 − 5y + 20y = 165, which is 75 + 15y = 165. What is y?', answer: [6], labels: ['y (larger notes)'], explanation: 'Taking away 5y and then adding 20y leaves 15y more. 15y = 165 − 75 = 90, so y = 90 ÷ 15 = 6 notes of $20.' },
  { prompt: 'x = 15 − y and y = 6. What is x?', answer: [9], labels: ['x (smaller notes)'], explanation: 'x = 15 − 6 = 9 notes of $5. Check: $45 + $120 = $165.' }
 ]
}, {
 canonical: { p: 5, q: 20, x: 9, y: 6 },
 draw: R => { const [p, q] = R.pick([[5, 20], [5, 10], [10, 20], [10, 50], [5, 50]]); return { p, q, x: R.int(3, 15), y: R.int(2, 12) }; },
 build: ({ p, q, x, y }) => { const N = x + y, W = p * x + q * y, pN = p * N, k = q - p; return {
  prompt: `At closing time a shop till holds ${n(N)} notes, all of them $${n(p)} or $${n(q)} notes, worth $${n(W)} in all. With x for the number of $${n(p)} notes and y for the number of $${n(q)} notes, x + y = ${n(N)} and ${n(p)}x + ${n(q)}y = ${n(W)}. Neither equation says what a letter equals yet, so first get x on its own in x + y = ${n(N)}. One rule is new here: a number in front of a bracket with a take-away multiplies both parts and the take-away stays, so 3(10 − y) is 30 − 3y. Enter x, then y.`,
  answer: [x, y],
  hints: [`Take y from both sides of x + y = ${n(N)}: x = ${n(N)} − y. Now you can substitute.`, `Replace x with ${n(N)} − y, in brackets: ${n(p)}(${n(N)} − y) + ${n(q)}y = ${n(W)}. The ${n(p)} multiplies both parts: ${n(p)} × ${n(N)}, take away ${n(p)}y.`, `Taking ${n(p)}y from ${n(q)}y leaves ${n(k)}y. Solve for y, then go back to x = ${n(N)} − y.`],
  solution: `Take y from both sides of x + y = ${n(N)}: x = ${n(N)} − y. Substitute: ${n(p)}(${n(N)} − y) + ${n(q)}y = ${n(W)}. Multiply out. The ${n(p)} multiplies both parts and the take-away stays: ${n(p)} lots of ${n(N)}, take away ${n(p)} lots of y, so ${n(pN)} − ${n(p)}y + ${n(q)}y = ${n(W)}. Taking away ${n(p)}y and then adding ${n(q)}y leaves ${n(k)}y more, so ${n(pN)} + ${n(k)}y = ${n(W)}. Take ${n(pN)} from both sides: ${n(k)}y = ${n(W - pN)}, so y = ${n(W - pN)} ÷ ${n(k)} = ${n(y)}. Then x = ${n(N)} − ${n(y)} = ${n(x)}. Check: ${n(p)} × ${n(x)} + ${n(q)} × ${n(y)} = ${n(p * x)} + ${n(q * y)} = ${n(W)} dollars.`,
  guidance: [
   { prompt: `Take y from both sides of x + y = ${n(N)} to get x = ${n(N)} − y, then replace x: ${n(p)}(${n(N)} − y) + ${n(q)}y = ${n(W)}. Multiplying out the brackets gives a plain number, take away ${n(p)}y. What is the plain number?`, answer: [pN], explanation: `${n(p)} × ${n(N)} = ${n(pN)}, so ${n(p)}(${n(N)} − y) = ${n(pN)} − ${n(p)}y. The ${n(p)} multiplies both parts.` },
   { prompt: `Now ${n(pN)} − ${n(p)}y + ${n(q)}y = ${n(W)}, which is ${n(pN)} + ${n(k)}y = ${n(W)}. What is y?`, answer: [y], explanation: `Taking away ${n(p)}y and then adding ${n(q)}y leaves ${n(k)}y more. ${n(k)}y = ${n(W)} − ${n(pN)} = ${n(W - pN)}, so y = ${n(W - pN)} ÷ ${n(k)} = ${n(y)} notes of $${n(q)}.` },
   { prompt: `x = ${n(N)} − y and y = ${n(y)}. What is x?`, answer: [x], explanation: `x = ${n(N)} − ${n(y)} = ${n(x)} notes of $${n(p)}. Check: $${n(p * x)} + $${n(q * y)} = $${n(W)}.` }
  ] }; }
});

/* ---- q27 Solving a system by elimination ---- */

/* Campsite bills: the x terms match this time, so x cancels and y is found first. */
add({
 id: 'q27b', parent: 'q27', kind: 'setting',
 title: 'Two campsite bills',
 brief: 'Two families paid different campsite bills, and the price of a night and of a bike hire can be worked out from them.',
 prompt: 'Two families stayed at the same campsite. The Okoro family paid $82 for 3 nights and 2 bike hires, so 3x + 2y = 82. The Lind family paid $106 for 3 nights and 5 bike hires, so 3x + 5y = 106. Here x is the price of one night and y the price of one bike hire, in dollars. Enter x, then y.',
 answer: [22, 8], labels: ['x ($ per night)', 'y ($ per bike hire)'], tolerance: 0.001,
 hints: [
  'Both families paid for 3 nights, so taking the Okoro equation away from the Lind equation makes x disappear.',
  'What is left is 3y = 106 − 82. Find y first, then put it into either equation to find x.'
 ],
 solution: 'Take the first equation away from the second, side by side: (3x + 5y) − (3x + 2y) = 106 − 82, so 3y = 24 and y = 8 dollars. Put y = 8 into the first equation: 3x + 16 = 82, so 3x = 66 and x = 66 ÷ 3 = 22 dollars.',
 guidance: [
  { prompt: 'Take the Okoro equation away from the Lind equation: left side from left side, right side from right side. The x terms cancel. What is y?', answer: [8], labels: ['y ($ per bike hire)'], explanation: '3y = 106 − 82 = 24, so y = 8 dollars. The 3 extra bike hires cost the extra $24.' },
  { prompt: 'Put y = 8 into 3x + 2y = 82. What is x?', answer: [22], labels: ['x ($ per night)'], explanation: '2 bike hires cost $16, so 3x = 82 − 16 = 66, and x = 22 dollars.' }
 ]
}, {
 canonical: { a: 3, b1: 2, b2: 5, x: 22, y: 8 },
 draw: R => { const b1 = R.int(1, 3); return { a: R.int(2, 5), b1, b2: b1 + R.int(1, 3), x: R.int(12, 35), y: R.int(4, 12) }; },
 build: ({ a, b1, b2, x, y }) => { const c1 = a * x + b1 * y, c2 = a * x + b2 * y, k = b2 - b1, D = c2 - c1, h = b1 * y, r = c1 - h;
  const hire = m => cnt(m, 'bike hire'); return {
  prompt: `Two families stayed at the same campsite. The Okoro family paid $${n(c1)} for ${n(a)} nights and ${hire(b1)}, so ${n(a)}x + ${cf(b1)}y = ${n(c1)}. The Lind family paid $${n(c2)} for ${n(a)} nights and ${hire(b2)}, so ${n(a)}x + ${n(b2)}y = ${n(c2)}. Here x is the price of one night and y the price of one bike hire, in dollars. Enter x, then y.`,
  answer: [x, y],
  hints: [`Both families paid for ${n(a)} nights, so taking the Okoro equation away from the Lind equation makes x disappear.`, `What is left is ${cf(k)}y = ${n(c2)} − ${n(c1)}. Find y first, then put it into either equation to find x.`],
  solution: `Take the first equation away from the second, side by side: (${n(a)}x + ${n(b2)}y) − (${n(a)}x + ${cf(b1)}y) = ${n(c2)} − ${n(c1)}, ${k === 1 ? `so y = ${n(D)}` : `so ${n(k)}y = ${n(D)} and y = ${n(y)}`} dollars. Put y = ${n(y)} into the first equation: ${n(a)}x + ${n(h)} = ${n(c1)}, so ${n(a)}x = ${n(r)} and x = ${n(r)} ÷ ${n(a)} = ${n(x)} dollars.`,
  guidance: [
   { prompt: `Take the Okoro equation away from the Lind equation: left side from left side, right side from right side. The x terms cancel. What is y?`, answer: [y], explanation: `${cf(k)}y = ${n(c2)} − ${n(c1)} = ${n(D)}${k === 1 ? '' : `, so y = ${n(y)}`} dollars. ${k === 1 ? 'The one extra bike hire costs' : `The ${n(k)} extra bike hires cost`} the extra $${n(D)}.` },
   { prompt: `Put y = ${n(y)} into ${n(a)}x + ${cf(b1)}y = ${n(c1)}. What is x?`, answer: [x], explanation: `${hire(b1)} cost${b1 === 1 ? 's' : ''} $${n(h)}, so ${n(a)}x = ${n(c1)} − ${n(h)} = ${n(r)}, and x = ${n(x)} dollars.` }
  ] }; }
});

/* Rover fuel: solve for the two hourly rates, then use them to plan a third run. */
add({
 id: 'q27c', parent: 'q27', kind: 'applied',
 title: 'Fuel for the third run',
 brief: 'Two rover runs have been logged, and the office must work out how much fuel to load for the next one.',
 prompt: 'The logistics office is planning rover fuel. On run 1 a rover drove for 2 hours and drilled for 3 hours, and used 24 L of fuel, so 2x + 3y = 24. On run 2 it drove for 5 hours and drilled for 3 hours, and used 42 L, so 5x + 3y = 42. Here x is the litres used in one hour of driving and y the litres used in one hour of drilling. Enter x, then y, then the litres needed for run 3: 4 hours of driving and 2 hours of drilling.',
 answer: [6, 4, 32], labels: ['x (L per driving hour)', 'y (L per drilling hour)', 'fuel for run 3 (L)'], tolerance: 0.001,
 hints: [
  'Both runs had 3 hours of drilling, so taking run 1 away from run 2 makes y disappear.',
  'What is left is 3x = 42 − 24. Find x, then put it into run 1 to find y.',
  'For run 3, multiply each kind of hour by its litres per hour and add the two amounts.'
 ],
 solution: 'Run 2 − run 1: (5x + 3y) − (2x + 3y) = 42 − 24, so 3x = 18 and x = 6 L per hour of driving. Put x = 6 into run 1: 2 × 6 + 3y = 24, so 3y = 12 and y = 4 L per hour of drilling. Run 3: 4 × 6 + 2 × 4 = 24 + 8 = 32 L.',
 guidance: [
  { prompt: 'Take run 1 away from run 2: left side from left side, right side from right side. The y terms cancel. What is x?', answer: [6], labels: ['x (L per driving hour)'], explanation: '3x = 42 − 24 = 18, so x = 6 L. The 3 extra hours of driving used the extra 18 L.' },
  { prompt: 'Put x = 6 into 2x + 3y = 24. What is y?', answer: [4], labels: ['y (L per drilling hour)'], explanation: '2 × 6 = 12, so 3y = 24 − 12 = 12, and y = 4 L.' },
  { prompt: 'Run 3 is 4 hours of driving at 6 L an hour and 2 hours of drilling at 4 L an hour. How many litres is that?', answer: [32], labels: ['fuel for run 3 (L)'], explanation: '4 × 6 = 24 and 2 × 4 = 8, so run 3 needs 24 + 8 = 32 L.' }
 ]
}, {
 canonical: { a1: 2, a2: 5, b: 3, x: 6, y: 4, u: 4, v: 2 },
 /* x ≠ y and u ≠ v, so swapping the two rates in the last step always gives a different total. */
 draw: R => { const a1 = R.int(2, 4), a2 = a1 + R.int(1, 3), b = R.int(2, 4), x = R.int(4, 9), y = R.except(2, 7, [x]), u = R.int(3, 8), v = R.except(2, 6, [u]); return { a1, a2, b, x, y, u, v }; },
 build: ({ a1, a2, b, x, y, u, v }) => { const c1 = a1 * x + b * y, c2 = a2 * x + b * y, k = a2 - a1, D = c2 - c1, r = c1 - a1 * x, T = u * x + v * y; return {
  prompt: `The logistics office is planning rover fuel. On run 1 a rover drove for ${n(a1)} hours and drilled for ${n(b)} hours, and used ${n(c1)} L of fuel, so ${n(a1)}x + ${n(b)}y = ${n(c1)}. On run 2 it drove for ${n(a2)} hours and drilled for ${n(b)} hours, and used ${n(c2)} L, so ${n(a2)}x + ${n(b)}y = ${n(c2)}. Here x is the litres used in one hour of driving and y the litres used in one hour of drilling. Enter x, then y, then the litres needed for run 3: ${n(u)} hours of driving and ${n(v)} hours of drilling.`,
  answer: [x, y, T],
  hints: [`Both runs had ${n(b)} hours of drilling, so taking run 1 away from run 2 makes y disappear.`, `What is left is ${cf(k)}x = ${n(c2)} − ${n(c1)}. Find x, then put it into run 1 to find y.`, `For run 3, multiply each kind of hour by its litres per hour and add the two amounts.`],
  solution: `Run 2 − run 1: (${n(a2)}x + ${n(b)}y) − (${n(a1)}x + ${n(b)}y) = ${n(c2)} − ${n(c1)}, ${k === 1 ? `so x = ${n(D)}` : `so ${n(k)}x = ${n(D)} and x = ${n(x)}`} L per hour of driving. Put x = ${n(x)} into run 1: ${n(a1)} × ${n(x)} + ${n(b)}y = ${n(c1)}, so ${n(b)}y = ${n(r)} and y = ${n(y)} L per hour of drilling. Run 3: ${n(u)} × ${n(x)} + ${n(v)} × ${n(y)} = ${n(u * x)} + ${n(v * y)} = ${n(T)} L.`,
  guidance: [
   { prompt: `Take run 1 away from run 2: left side from left side, right side from right side. The y terms cancel. What is x?`, answer: [x], explanation: `${cf(k)}x = ${n(c2)} − ${n(c1)} = ${n(D)}${k === 1 ? '' : `, so x = ${n(x)}`} L. ${k === 1 ? 'The one extra hour' : `The ${n(k)} extra hours`} of driving used the extra ${n(D)} L.` },
   { prompt: `Put x = ${n(x)} into ${n(a1)}x + ${n(b)}y = ${n(c1)}. What is y?`, answer: [y], explanation: `${n(a1)} × ${n(x)} = ${n(a1 * x)}, so ${n(b)}y = ${n(c1)} − ${n(a1 * x)} = ${n(r)}, and y = ${n(y)} L.` },
   { prompt: `Run 3 is ${n(u)} hours of driving at ${n(x)} L an hour and ${n(v)} hours of drilling at ${n(y)} L an hour. How many litres is that?`, answer: [T], explanation: `${n(u)} × ${n(x)} = ${n(u * x)} and ${n(v)} × ${n(y)} = ${n(v * y)}, so run 3 needs ${n(u * x)} + ${n(v * y)} = ${n(T)} L.` }
  ] }; }
});

/* Protein in bars and shakes: no letter matches until one equation is multiplied through (same to both sides, q16). */
add({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q16',
 title: 'Protein in bars and shakes',
 brief: 'A hiking club’s two snack boxes are labelled only with their total protein, and the grams in one bar and in one shake have to be untangled.',
 prompt: 'A hiking club packs two kinds of snack box. A snack bar has x grams of protein and a shake has y grams. Box A holds 2 bars and 1 shake: 38 g of protein, so 2x + y = 38. Box B holds 3 bars and 2 shakes: 66 g, so 3x + 2y = 66. The y terms do not match yet, so first multiply every part of box A’s equation by 2. Enter x, then y.',
 answer: [10, 18], labels: ['x (g per bar)', 'y (g per shake)'], tolerance: 0.001,
 hints: [
  'Multiplying both sides of an equation by the same number keeps it true. Box A times 2 is 4x + 2y = 2 × 38.',
  'Now both equations have 2y. Take box B’s equation away from the new box A equation, so that y disappears.',
  'Put your x into box A’s original equation to find y.'
 ],
 solution: 'Multiply every part of box A’s equation by 2: 4x + 2y = 76. Take box B’s equation away: (4x + 2y) − (3x + 2y) = 76 − 66, so x = 10 g. Put x = 10 into box A’s original equation: 2 × 10 + y = 38, so y = 18 g.',
 guidance: [
  { prompt: 'Multiply every part of 2x + y = 38 by 2. Enter the new number in front of x, then the new total on the right.', answer: [4, 76], labels: ['number in front of x', 'new total (g)'], explanation: '2 × 2x = 4x, 2 × y = 2y and 2 × 38 = 76, so the new equation is 4x + 2y = 76.' },
  { prompt: 'Take box B’s equation (3x + 2y = 66) away from 4x + 2y = 76. The y terms cancel. What is x?', answer: [10], labels: ['x (g per bar)'], explanation: 'x = 76 − 66 = 10 g of protein in a bar.' },
  { prompt: 'Put x = 10 into 2x + y = 38. What is y?', answer: [18], labels: ['y (g per shake)'], explanation: '2 × 10 = 20, so y = 38 − 20 = 18 g of protein in a shake.' }
 ]
}, {
 canonical: { a1: 2, b: 1, m: 2, a2: 3, x: 10, y: 18 },
 /* a2 is below m·a1, so the multiplied box A equation is the larger one, and a2 ≠ a1, so x never cancels by itself. */
 draw: R => { const a1 = R.int(2, 3), m = R.pick([2, 3]); return { a1, b: R.int(1, 2), m, a2: R.except(1, m * a1 - 1, [a1]), x: R.int(6, 15), y: R.int(15, 30) }; },
 build: ({ a1, b, m, a2, x, y }) => { const P1 = a1 * x + b * y, P2 = a2 * x + m * b * y, A = m * a1, B = m * b, P = m * P1, k = A - a2, D = P - P2, r = P1 - a1 * x; return {
  prompt: `A hiking club packs two kinds of snack box. A snack bar has x grams of protein and a shake has y grams. Box A holds ${cnt(a1, 'bar')} and ${cnt(b, 'shake')}: ${n(P1)} g of protein, so ${n(a1)}x + ${cf(b)}y = ${n(P1)}. Box B holds ${cnt(a2, 'bar')} and ${cnt(B, 'shake')}: ${n(P2)} g, so ${cf(a2)}x + ${n(B)}y = ${n(P2)}. The y terms do not match yet, so first multiply every part of box A’s equation by ${n(m)}. Enter x, then y.`,
  answer: [x, y],
  hints: [`Multiplying both sides of an equation by the same number keeps it true. Box A times ${n(m)} is ${n(A)}x + ${n(B)}y = ${n(m)} × ${n(P1)}.`, `Now both equations have ${n(B)}y. Take box B’s equation away from the new box A equation, so that y disappears.`, `Put your x into box A’s original equation to find y.`],
  solution: `Multiply every part of box A’s equation by ${n(m)}: ${n(A)}x + ${n(B)}y = ${n(P)}. Take box B’s equation away: (${n(A)}x + ${n(B)}y) − (${cf(a2)}x + ${n(B)}y) = ${n(P)} − ${n(P2)}, ${k === 1 ? `so x = ${n(D)}` : `so ${n(k)}x = ${n(D)} and x = ${n(x)}`} g. Put x = ${n(x)} into box A’s original equation: ${n(a1)} × ${n(x)} + ${cf(b)}y = ${n(P1)}, ${b === 1 ? `so y = ${n(r)}` : `so ${n(b)}y = ${n(r)} and y = ${n(y)}`} g.`,
  guidance: [
   { prompt: `Multiply every part of ${n(a1)}x + ${cf(b)}y = ${n(P1)} by ${n(m)}. Enter the new number in front of x, then the new total on the right.`, answer: [A, P], explanation: `${n(m)} × ${n(a1)}x = ${n(A)}x, ${n(m)} × ${cf(b)}y = ${n(B)}y and ${n(m)} × ${n(P1)} = ${n(P)}, so the new equation is ${n(A)}x + ${n(B)}y = ${n(P)}.` },
   { prompt: `Take box B’s equation (${cf(a2)}x + ${n(B)}y = ${n(P2)}) away from ${n(A)}x + ${n(B)}y = ${n(P)}. The y terms cancel. What is x?`, answer: [x], explanation: `${cf(k)}x = ${n(P)} − ${n(P2)} = ${n(D)}${k === 1 ? '' : `, so x = ${n(x)}`} g of protein in a bar.` },
   { prompt: `Put x = ${n(x)} into ${n(a1)}x + ${cf(b)}y = ${n(P1)}. What is y?`, answer: [y], explanation: `${n(a1)} × ${n(x)} = ${n(a1 * x)}, so ${cf(b)}y = ${n(P1)} − ${n(a1 * x)} = ${n(r)}${b === 1 ? '' : `, and y = ${n(y)}`} g of protein in a shake.` }
  ] }; }
});

/* ---- q28 Three equations in three unknowns ---- */

/* Café receipts: not every equation holds every letter. x + y + z = a, x + y = b, p·x + y = c. */
add({
 id: 'q28b', parent: 'q28', kind: 'setting',
 title: 'Three café receipts',
 brief: 'Three receipts from one café show only totals, and the price of each item has to be worked out.',
 prompt: 'Three receipts from the same café. Receipt 1: one coffee, one sandwich and one cake, $13, so x + y + z = 13. Receipt 2: one coffee and one sandwich, $9, so x + y = 9. Receipt 3: 3 coffees and one sandwich, $15, so 3x + y = 15. Here x is the price of a coffee, y of a sandwich and z of a cake, in dollars. Enter x, y and z.',
 answer: [3, 6, 4], labels: ['x ($ per coffee)', 'y ($ per sandwich)', 'z ($ per cake)'], tolerance: 0.001,
 hints: [
  'Receipts 1 and 2 differ only by the cake, so taking receipt 2 away from receipt 1 leaves z on its own.',
  'Receipts 2 and 3 have no cake and differ only in coffees. Take receipt 2 away from receipt 3 to find x, then use receipt 2 to find y.'
 ],
 solution: 'Receipt 1 − receipt 2: z = 13 − 9 = 4. Receipt 3 − receipt 2: 2x = 15 − 9 = 6, so x = 3. Receipt 2: 3 + y = 9, so y = 9 − 3 = 6. A coffee costs $3, a sandwich $6 and a cake $4. Check receipt 3: 3 × 3 + 6 = 15.',
 guidance: [
  { prompt: 'Take receipt 2 (x + y = 9) away from receipt 1 (x + y + z = 13). What is z?', answer: [4], labels: ['z ($ per cake)'], explanation: 'x and y cancel: z = 13 − 9 = 4 dollars.' },
  { prompt: 'Take receipt 2 (x + y = 9) away from receipt 3 (3x + y = 15). What is x?', answer: [3], labels: ['x ($ per coffee)'], explanation: 'y cancels: 2x = 15 − 9 = 6, so x = 3 dollars.' },
  { prompt: 'Put x = 3 into receipt 2, x + y = 9. What is y?', answer: [6], labels: ['y ($ per sandwich)'], explanation: 'y = 9 − 3 = 6 dollars.' }
 ]
}, {
 canonical: { x: 3, y: 6, z: 4, p: 3 },
 draw: R => ({ x: R.int(2, 5), y: R.int(5, 9), z: R.int(2, 6), p: R.int(2, 4) }),
 build: ({ x, y, z, p }) => { const a = x + y + z, b = x + y, c = p * x + y; return {
  prompt: `Three receipts from the same café. Receipt 1: one coffee, one sandwich and one cake, $${n(a)}, so x + y + z = ${n(a)}. Receipt 2: one coffee and one sandwich, $${n(b)}, so x + y = ${n(b)}. Receipt 3: ${n(p)} coffees and one sandwich, $${n(c)}, so ${n(p)}x + y = ${n(c)}. Here x is the price of a coffee, y of a sandwich and z of a cake, in dollars. Enter x, y and z.`,
  answer: [x, y, z],
  hints: [`Receipts 1 and 2 differ only by the cake, so taking receipt 2 away from receipt 1 leaves z on its own.`, `Receipts 2 and 3 have no cake and differ only in coffees. Take receipt 2 away from receipt 3 to find x, then use receipt 2 to find y.`],
  solution: `Receipt 1 − receipt 2: z = ${n(a)} − ${n(b)} = ${n(z)}. Receipt 3 − receipt 2: ${left(p - 1, 'x', c, b, x)}. Receipt 2: ${n(x)} + y = ${n(b)}, so y = ${n(b)} − ${n(x)} = ${n(y)}. A coffee costs $${n(x)}, a sandwich $${n(y)} and a cake $${n(z)}. Check receipt 3: ${n(p)} × ${n(x)} + ${n(y)} = ${n(c)}.`,
  guidance: [
   { prompt: `Take receipt 2 (x + y = ${n(b)}) away from receipt 1 (x + y + z = ${n(a)}). What is z?`, answer: [z], explanation: `x and y cancel: z = ${n(a)} − ${n(b)} = ${n(z)} dollars.` },
   { prompt: `Take receipt 2 (x + y = ${n(b)}) away from receipt 3 (${n(p)}x + y = ${n(c)}). What is x?`, answer: [x], explanation: `y cancels: ${left(p - 1, 'x', c, b, x)} dollars.` },
   { prompt: `Put x = ${n(x)} into receipt 2, x + y = ${n(b)}. What is y?`, answer: [y], explanation: `y = ${n(b)} − ${n(x)} = ${n(y)} dollars.` }
  ] }; }
});

/* Hut wiring: three device ratings by two subtractions, then the draw of a new hut. */
add({
 id: 'q28c', parent: 'q28', kind: 'applied',
 title: 'Wiring the new hut',
 brief: 'Three huts have had their power draw measured, and the office needs the draw of a fourth before it is wired.',
 prompt: 'Three huts are wired with the same three devices: heater panels (x watts each), lamps (y watts each) and fans (z watts each). A watt, W for short, measures how fast a device uses electricity. Hut 1 has one of each and draws 130 W, so x + y + z = 130. Hut 2 has one heater panel, 3 lamps and one fan and draws 170 W, so x + 3y + z = 170. Hut 3 has 2 heater panels, one lamp and one fan and draws 210 W, so 2x + y + z = 210. Enter x, y and z, then the watts drawn by a new hut with 3 heater panels, 4 lamps and 2 fans.',
 answer: [80, 20, 30, 380], labels: ['x (W per heater panel)', 'y (W per lamp)', 'z (W per fan)', 'new hut (W)'], tolerance: 0.001,
 hints: [
  'Take hut 1 away from hut 2: x and z cancel and only lamps are left. Take hut 1 away from hut 3: only heater panels are left.',
  'Use hut 1 to find z once you know x and y.',
  'For the new hut, multiply each device’s watts by how many there are, then add the three amounts.'
 ],
 solution: 'Hut 2 − hut 1: 2y = 170 − 130 = 40, so y = 20. Hut 3 − hut 1: x = 210 − 130 = 80. Hut 1: 80 + 20 + z = 130, so z = 130 − 80 − 20 = 30. New hut: 3 × 80 + 4 × 20 + 2 × 30 = 240 + 80 + 60 = 380 W.',
 guidance: [
  { prompt: 'Take hut 1 (x + y + z = 130) away from hut 2 (x + 3y + z = 170). What is y?', answer: [20], labels: ['y (W per lamp)'], explanation: 'x and z cancel: 2y = 170 − 130 = 40, so y = 20 W.' },
  { prompt: 'Take hut 1 away from hut 3 (2x + y + z = 210). What is x?', answer: [80], labels: ['x (W per heater panel)'], explanation: 'y and z cancel: x = 210 − 130 = 80 W.' },
  { prompt: 'Put x = 80 and y = 20 into hut 1, x + y + z = 130, to find z. Then work out the new hut: 3 heater panels, 4 lamps and 2 fans. Enter z, then the new hut’s watts.', answer: [30, 380], labels: ['z (W per fan)', 'new hut (W)'], explanation: 'z = 130 − 80 − 20 = 30 W. New hut: 240 + 80 + 60 = 380 W.' }
 ]
}, {
 canonical: { x: 80, y: 20, z: 30, p: 2, q: 3, u: 3, v: 4, w: 2 },
 draw: R => ({ x: 10 * R.int(5, 12), y: 5 * R.int(2, 8), z: 5 * R.int(3, 9), p: R.int(2, 3), q: R.int(2, 3), u: R.int(2, 4), v: R.int(3, 6), w: R.int(1, 3) }),
 build: ({ x, y, z, p, q, u, v, w }) => { const a = x + y + z, b = x + q * y + z, c = p * x + y + z, T = u * x + v * y + w * z; return {
  prompt: `Three huts are wired with the same three devices: heater panels (x watts each), lamps (y watts each) and fans (z watts each). A watt, W for short, measures how fast a device uses electricity. Hut 1 has one of each and draws ${n(a)} W, so x + y + z = ${n(a)}. Hut 2 has one heater panel, ${n(q)} lamps and one fan and draws ${n(b)} W, so x + ${n(q)}y + z = ${n(b)}. Hut 3 has ${n(p)} heater panels, one lamp and one fan and draws ${n(c)} W, so ${n(p)}x + y + z = ${n(c)}. Enter x, y and z, then the watts drawn by a new hut with ${n(u)} heater panels, ${n(v)} lamps and ${cnt(w, 'fan')}.`,
  answer: [x, y, z, T],
  hints: [`Take hut 1 away from hut 2: x and z cancel and only lamps are left. Take hut 1 away from hut 3: only heater panels are left.`, `Use hut 1 to find z once you know x and y.`, `For the new hut, multiply each device’s watts by how many there are, then add the three amounts.`],
  solution: `Hut 2 − hut 1: ${left(q - 1, 'y', b, a, y)}. Hut 3 − hut 1: ${left(p - 1, 'x', c, a, x)}. Hut 1: ${n(x)} + ${n(y)} + z = ${n(a)}, so z = ${n(a)} − ${n(x)} − ${n(y)} = ${n(z)}. New hut: ${n(u)} × ${n(x)} + ${n(v)} × ${n(y)} + ${n(w)} × ${n(z)} = ${n(u * x)} + ${n(v * y)} + ${n(w * z)} = ${n(T)} W.`,
  guidance: [
   { prompt: `Take hut 1 (x + y + z = ${n(a)}) away from hut 2 (x + ${n(q)}y + z = ${n(b)}). What is y?`, answer: [y], explanation: `x and z cancel: ${left(q - 1, 'y', b, a, y)} W.` },
   { prompt: `Take hut 1 away from hut 3 (${n(p)}x + y + z = ${n(c)}). What is x?`, answer: [x], explanation: `y and z cancel: ${left(p - 1, 'x', c, a, x)} W.` },
   { prompt: `Put x = ${n(x)} and y = ${n(y)} into hut 1, x + y + z = ${n(a)}, to find z. Then work out the new hut: ${n(u)} heater panels, ${n(v)} lamps and ${cnt(w, 'fan')}. Enter z, then the new hut’s watts.`, answer: [z, T], explanation: `z = ${n(a)} − ${n(x)} − ${n(y)} = ${n(z)} W. New hut: ${n(u * x)} + ${n(v * y)} + ${n(w * z)} = ${n(T)} W.` }
  ] }; }
});

/* Sports day points: one subtraction gives z, and what is left is a two-equation elimination (q27). */
add({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q27',
 title: 'Sports day points',
 brief: 'The sports day scoreboard shows team totals only, and the points for each place have to be recovered.',
 prompt: 'At a sports day a first place earns x points, a second place y points and a third place z points. Red team had one first, one second and one third place: 10 points, so x + y + z = 10. Blue team had one first, one second and 3 third places: 14 points, so x + y + 3z = 14. Green team had 2 first places, one second and 2 third places: 17 points, so 2x + y + 2z = 17. Green differs from Red in two letters, so find z first and put its value into the Red and Green equations. Enter x, y and z.',
 answer: [5, 3, 2], labels: ['x (points for first)', 'y (points for second)', 'z (points for third)'], tolerance: 0.001,
 hints: [
  'Take Red away from Blue: x and y cancel, leaving 2z = 14 − 10.',
  'Put your z into Red and into Green. That leaves two equations with only x and y in them, each with a single y.',
  'Take the new Red equation away from the new Green equation to find x, then use Red to find y.'
 ],
 solution: 'Blue − Red: 2z = 14 − 10 = 4, so z = 2. Put z = 2 into Red: x + y + 2 = 10, so x + y = 8. Put z = 2 into Green: 2x + y + 4 = 17, so 2x + y = 13. Take the first of these away from the second: x = 13 − 8 = 5. Then y = 8 − 5 = 3. A first place earns 5 points, a second 3 and a third 2.',
 guidance: [
  { prompt: 'Take Red (x + y + z = 10) away from Blue (x + y + 3z = 14). What is z?', answer: [2], labels: ['z (points for third)'], explanation: 'x and y cancel: 2z = 14 − 10 = 4, so z = 2.' },
  { prompt: 'Put z = 2 into Red and take the third-place points from both sides: what does x + y equal? Do the same in Green, 2x + y + 2z = 17: what does 2x + y equal? Enter both numbers.', answer: [8, 13], labels: ['what x + y equals', 'what Green’s x and y terms equal'], explanation: 'Red: x + y = 10 − 2 = 8. Green: 2 × 2 = 4, so 2x + y = 17 − 4 = 13.' },
  { prompt: 'Take x + y = 8 away from 2x + y = 13 to find x, then use x + y = 8 to find y. Enter x, then y.', answer: [5, 3], labels: ['x (points for first)', 'y (points for second)'], explanation: 'y cancels: x = 13 − 8 = 5. Then y = 8 − 5 = 3.' }
 ]
}, {
 canonical: { x: 5, y: 3, z: 2, r: 3, p: 2, s: 2 },
 /* First beats second beats third: x > y > z ≥ 1. */
 draw: R => { const z = R.int(1, 4), y = z + R.int(1, 3), x = y + R.int(1, 4); return { x, y, z, r: R.int(2, 4), p: R.int(2, 3), s: R.int(2, 4) }; },
 build: ({ x, y, z, r, p, s }) => { const a = x + y + z, b = x + y + r * z, c = p * x + y + s * z, A = a - z, B = c - s * z; return {
  prompt: `At a sports day a first place earns x points, a second place y points and a third place z points. Red team had one first, one second and one third place: ${n(a)} points, so x + y + z = ${n(a)}. Blue team had one first, one second and ${n(r)} third places: ${n(b)} points, so x + y + ${n(r)}z = ${n(b)}. Green team had ${n(p)} first places, one second and ${n(s)} third places: ${n(c)} points, so ${n(p)}x + y + ${n(s)}z = ${n(c)}. Green differs from Red in two letters, so find z first and put its value into the Red and Green equations. Enter x, y and z.`,
  answer: [x, y, z],
  hints: [`Take Red away from Blue: x and y cancel, leaving ${cf(r - 1)}z = ${n(b)} − ${n(a)}.`, `Put your z into Red and into Green. That leaves two equations with only x and y in them, each with a single y.`, `Take the new Red equation away from the new Green equation to find x, then use Red to find y.`],
  solution: `Blue − Red: ${left(r - 1, 'z', b, a, z)}. Put z = ${n(z)} into Red: x + y + ${n(z)} = ${n(a)}, so x + y = ${n(A)}. Put z = ${n(z)} into Green: ${n(p)}x + y + ${n(s * z)} = ${n(c)}, so ${n(p)}x + y = ${n(B)}. Take the first of these away from the second: ${left(p - 1, 'x', B, A, x)}. Then y = ${n(A)} − ${n(x)} = ${n(y)}. A first place earns ${n(x)} points, a second ${n(y)} and a third ${n(z)}.`,
  guidance: [
   { prompt: `Take Red (x + y + z = ${n(a)}) away from Blue (x + y + ${n(r)}z = ${n(b)}). What is z?`, answer: [z], explanation: `x and y cancel: ${left(r - 1, 'z', b, a, z)}.` },
   { prompt: `Put z = ${n(z)} into Red and take the third-place points from both sides: what does x + y equal? Do the same in Green, ${n(p)}x + y + ${n(s)}z = ${n(c)}: what does ${n(p)}x + y equal? Enter both numbers.`, answer: [A, B], explanation: `Red: x + y = ${n(a)} − ${n(z)} = ${n(A)}. Green: ${n(s)} × ${n(z)} = ${n(s * z)}, so ${n(p)}x + y = ${n(c)} − ${n(s * z)} = ${n(B)}.` },
   { prompt: `Take x + y = ${n(A)} away from ${n(p)}x + y = ${n(B)} to find x, then use x + y = ${n(A)} to find y. Enter x, then y.`, answer: [x, y], explanation: `y cancels: ${left(p - 1, 'x', B, A, x)}. Then y = ${n(A)} − ${n(x)} = ${n(y)}.` }
  ] }; }
});

/* ---- q29 Data in a grid and summation notation ---- */

/* Phone data, 3 rows by 4 columns: name one entry, add along a chosen row and down a chosen column. */
add({
 id: 'q29b', parent: 'q29', kind: 'setting',
 title: 'The family data plan',
 brief: 'A shared phone plan lists each person’s data use week by week, and the bill-payer wants three figures from it.',
 prompt: 'A family’s phone data use in gigabytes (GB), as a grid with 3 rows and 4 columns. Row 1, Ana: 4, 7, 2, 6. Row 2, Ben: 3, 5, 8, 1. Row 3, Cleo: 6, 2, 9, 5. Columns 1 to 4 are weeks 1 to 4, and a(i, j) is the number in row i, column j. Enter a(3, 2), then Σ a(1, j) for j = 1 to 4, then Σ a(i, 4) for i = 1 to 3.',
 answer: [2, 19, 12], labels: ['single entry (GB)', 'first sum (GB)', 'second sum (GB)'], tolerance: 0.001,
 hints: [
  'Row first, then column: for a(3, 2) count down to row 3, then across to column 2.',
  'In Σ a(1, j) the counter is j, the column number. So you stay in row 1 and add across: a(1, 1) + a(1, 2) + a(1, 3) + a(1, 4).',
  'In Σ a(i, 4) the counter is i, the row number. So you stay in column 4 and add down: a(1, 4) + a(2, 4) + a(3, 4).'
 ],
 solution: 'a(3, 2) is in row 3 (Cleo), column 2: 2 GB. Σ a(1, j) for j = 1 to 4 is the whole of row 1: 4 + 7 + 2 + 6 = 19 GB, the data Ana used in the four weeks. Σ a(i, 4) for i = 1 to 3 is the whole of column 4: 6 + 1 + 5 = 12 GB, the data the family used in week 4.',
 guidance: [
  { prompt: 'Row 3 is 6, 2, 9, 5. Which of its numbers is in column 2? That is a(3, 2).', answer: [2], labels: ['single entry (GB)'], explanation: 'Counting across row 3 to place 2 gives 2, so a(3, 2) = 2.' },
  { prompt: 'Σ a(1, j) for j = 1 to 4 adds along row 1: 4 + 7 + 2 + 6. What is the sum?', answer: [19], labels: ['first sum (GB)'], explanation: '4 + 7 + 2 + 6 = 19 GB. The row number stayed at 1 while j went from 1 to 4.' },
  { prompt: 'Σ a(i, 4) for i = 1 to 3 adds down column 4: take number 4 from each row. What is the sum?', answer: [12], labels: ['second sum (GB)'], explanation: '6 + 1 + 5 = 12 GB. The column number stayed at 4 while i went from 1 to 3.' }
 ]
}, {
 canonical: { g: [[4, 7, 2, 6], [3, 5, 8, 1], [6, 2, 9, 5]], e: [3, 2], r: 1, c: 4 },
 /* Reading the entry column-first, adding down when the sum runs across, or across when it runs down, always
    gives a different number from the right one. */
 draw: R => { for (let tries = 0; tries < 300; tries++) {
   const g = [0, 1, 2].map(() => [0, 1, 2, 3].map(() => R.int(1, 9))), ei = R.int(1, 3), ej = R.except(1, 4, [ei]), r = R.int(1, 3), c = R.int(1, 4);
   const rows = g.map(sum), cols = [0, 1, 2, 3].map(j => g[0][j] + g[1][j] + g[2][j]);
   if (ej <= 3 && g[ei - 1][ej - 1] === g[ej - 1][ei - 1]) continue;
   if (rows[r - 1] === cols[r - 1] || (c <= 3 && cols[c - 1] === rows[c - 1])) continue;
   return { g, e: [ei, ej], r, c };
  } return { g: [[4, 7, 2, 6], [3, 5, 8, 1], [6, 2, 9, 5]], e: [3, 2], r: 1, c: 4 }; },
 build: ({ g, e, r, c }) => { const [ei, ej] = e, who = ['Ana', 'Ben', 'Cleo'], v = g[ei - 1][ej - 1], rs = sum(g[r - 1]), col = g.map(line => line[c - 1]), cs = sum(col);
  const row = i => g[i].map(n).join(', '); return {
  prompt: `A family’s phone data use in gigabytes (GB), as a grid with 3 rows and 4 columns. Row 1, Ana: ${row(0)}. Row 2, Ben: ${row(1)}. Row 3, Cleo: ${row(2)}. Columns 1 to 4 are weeks 1 to 4, and a(i, j) is the number in row i, column j. Enter a(${n(ei)}, ${n(ej)}), then Σ a(${n(r)}, j) for j = 1 to 4, then Σ a(i, ${n(c)}) for i = 1 to 3.`,
  answer: [v, rs, cs],
  hints: [`Row first, then column: for a(${n(ei)}, ${n(ej)}) count down to row ${n(ei)}, then across to column ${n(ej)}.`, `In Σ a(${n(r)}, j) the counter is j, the column number. So you stay in row ${n(r)} and add across: a(${n(r)}, 1) + a(${n(r)}, 2) + a(${n(r)}, 3) + a(${n(r)}, 4).`, `In Σ a(i, ${n(c)}) the counter is i, the row number. So you stay in column ${n(c)} and add down: a(1, ${n(c)}) + a(2, ${n(c)}) + a(3, ${n(c)}).`],
  solution: `a(${n(ei)}, ${n(ej)}) is in row ${n(ei)} (${who[ei - 1]}), column ${n(ej)}: ${n(v)} GB. Σ a(${n(r)}, j) for j = 1 to 4 is the whole of row ${n(r)}: ${g[r - 1].map(n).join(' + ')} = ${n(rs)} GB, the data ${who[r - 1]} used in the four weeks. Σ a(i, ${n(c)}) for i = 1 to 3 is the whole of column ${n(c)}: ${col.map(n).join(' + ')} = ${n(cs)} GB, the data the family used in week ${n(c)}.`,
  guidance: [
   { prompt: `Row ${n(ei)} is ${row(ei - 1)}. Which of its numbers is in column ${n(ej)}? That is a(${n(ei)}, ${n(ej)}).`, answer: [v], explanation: `Counting across row ${n(ei)} to place ${n(ej)} gives ${n(v)}, so a(${n(ei)}, ${n(ej)}) = ${n(v)}.` },
   { prompt: `Σ a(${n(r)}, j) for j = 1 to 4 adds along row ${n(r)}: ${g[r - 1].map(n).join(' + ')}. What is the sum?`, answer: [rs], explanation: `${g[r - 1].map(n).join(' + ')} = ${n(rs)} GB. The row number stayed at ${n(r)} while j went from 1 to 4.` },
   { prompt: `Σ a(i, ${n(c)}) for i = 1 to 3 adds down column ${n(c)}: take number ${n(c)} from each row. What is the sum?`, answer: [cs], explanation: `${col.map(n).join(' + ')} = ${n(cs)} GB. The column number stayed at ${n(c)} while i went from 1 to 3.` }
  ] }; }
});

/* Rover hours, 2 rows by 5 columns: two partial sums along one row (the second starts at j = 4), then fuel. */
add({
 id: 'q29c', parent: 'q29', kind: 'applied',
 title: 'Flat days and ridge days',
 brief: 'The rover log gives hours driven each day, and the office needs one rover’s fuel use where the ridge days burn more.',
 prompt: 'The logistics office logs the hours two rovers drove on each of five days, as a grid with 2 rows and 5 columns. Row 1, rover Ibis: 6, 4, 3, 3, 2. Row 2, rover Kite: 5, 7, 3, 4, 4. Columns 1 to 5 are days 1 to 5, and a(i, j) is the number in row i, column j. Days 1 to 3 were on the flat, where a rover burns 4 L of fuel an hour. Days 4 and 5 were on the ridge, where it burns 7 L an hour. For rover Kite, enter Σ a(2, j) for j = 1 to 3, then Σ a(2, j) for j = 4 to 5, then the litres of fuel it burned over the five days.',
 answer: [15, 8, 116], labels: ['flat hours', 'ridge hours', 'fuel burned (L)'], tolerance: 0.001,
 hints: [
  'Rover Kite is row 2. The counter j is the column number, and it does not have to start at 1: for j = 4 to 5, add only a(2, 4) + a(2, 5).',
  'Fuel is hours times litres an hour. Work out the flat days and the ridge days separately, then add the two amounts.'
 ],
 solution: 'Rover Kite is row 2: 5, 7, 3, 4, 4. Σ a(2, j) for j = 1 to 3 is 5 + 7 + 3 = 15 hours on the flat. Σ a(2, j) for j = 4 to 5 is 4 + 4 = 8 hours on the ridge. Fuel: 15 × 4 + 8 × 7 = 60 + 56 = 116 L.',
 guidance: [
  { prompt: 'Row 2 is 5, 7, 3, 4, 4. Σ a(2, j) for j = 1 to 3 adds its first three numbers. What is the sum?', answer: [15], labels: ['flat hours'], explanation: '5 + 7 + 3 = 15 hours on the flat.' },
  { prompt: 'Σ a(2, j) for j = 4 to 5 adds the numbers in columns 4 and 5 of row 2. What is the sum?', answer: [8], labels: ['ridge hours'], explanation: '4 + 4 = 8 hours on the ridge.' },
  { prompt: '15 hours at 4 L an hour, and 8 hours at 7 L an hour. How many litres in all?', answer: [116], labels: ['fuel burned (L)'], explanation: '15 × 4 = 60 and 8 × 7 = 56, so the rover burned 60 + 56 = 116 L.' }
 ]
}, {
 canonical: { g: [[6, 4, 3, 3, 2], [5, 7, 3, 4, 4]], r: 2, f: 4, k: 7 },
 /* The two rovers differ in both partial sums, so reading the wrong row never gives a right answer. */
 draw: R => { for (let tries = 0; tries < 300; tries++) {
   const g = [0, 1].map(() => [0, 1, 2, 3, 4].map(() => R.int(1, 8))), r = R.int(1, 2), f = R.int(3, 5), k = R.int(6, 9);
   if (g[0][0] + g[0][1] + g[0][2] === g[1][0] + g[1][1] + g[1][2] || g[0][3] + g[0][4] === g[1][3] + g[1][4]) continue;
   return { g, r, f, k };
  } return { g: [[6, 4, 3, 3, 2], [5, 7, 3, 4, 4]], r: 2, f: 4, k: 7 }; },
 build: ({ g, r, f, k }) => { const who = ['Ibis', 'Kite'][r - 1], h = g[r - 1], flat = h[0] + h[1] + h[2], ridge = h[3] + h[4], fuel = f * flat + k * ridge;
  const row = i => g[i].map(n).join(', '); return {
  prompt: `The logistics office logs the hours two rovers drove on each of five days, as a grid with 2 rows and 5 columns. Row 1, rover Ibis: ${row(0)}. Row 2, rover Kite: ${row(1)}. Columns 1 to 5 are days 1 to 5, and a(i, j) is the number in row i, column j. Days 1 to 3 were on the flat, where a rover burns ${n(f)} L of fuel an hour. Days 4 and 5 were on the ridge, where it burns ${n(k)} L an hour. For rover ${who}, enter Σ a(${n(r)}, j) for j = 1 to 3, then Σ a(${n(r)}, j) for j = 4 to 5, then the litres of fuel it burned over the five days.`,
  answer: [flat, ridge, fuel],
  hints: [`Rover ${who} is row ${n(r)}. The counter j is the column number, and it does not have to start at 1: for j = 4 to 5, add only a(${n(r)}, 4) + a(${n(r)}, 5).`, `Fuel is hours times litres an hour. Work out the flat days and the ridge days separately, then add the two amounts.`],
  solution: `Rover ${who} is row ${n(r)}: ${row(r - 1)}. Σ a(${n(r)}, j) for j = 1 to 3 is ${n(h[0])} + ${n(h[1])} + ${n(h[2])} = ${n(flat)} hours on the flat. Σ a(${n(r)}, j) for j = 4 to 5 is ${n(h[3])} + ${n(h[4])} = ${n(ridge)} hours on the ridge. Fuel: ${n(flat)} × ${n(f)} + ${n(ridge)} × ${n(k)} = ${n(f * flat)} + ${n(k * ridge)} = ${n(fuel)} L.`,
  guidance: [
   { prompt: `Row ${n(r)} is ${row(r - 1)}. Σ a(${n(r)}, j) for j = 1 to 3 adds its first three numbers. What is the sum?`, answer: [flat], explanation: `${n(h[0])} + ${n(h[1])} + ${n(h[2])} = ${n(flat)} hours on the flat.` },
   { prompt: `Σ a(${n(r)}, j) for j = 4 to 5 adds the numbers in columns 4 and 5 of row ${n(r)}. What is the sum?`, answer: [ridge], explanation: `${n(h[3])} + ${n(h[4])} = ${n(ridge)} hours on the ridge.` },
   { prompt: `${n(flat)} hours at ${n(f)} L an hour, and ${n(ridge)} hours at ${n(k)} L an hour. How many litres in all?`, answer: [fuel], explanation: `${n(flat)} × ${n(f)} = ${n(f * flat)} and ${n(ridge)} × ${n(k)} = ${n(k * ridge)}, so the rover burned ${n(f * flat)} + ${n(k * ridge)} = ${n(fuel)} L.` }
  ] }; }
});

/* A savings plan: Σ of a rule in the counter, each term found by substitution (q14). */
add({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q14',
 title: 'The savings jar plan',
 brief: 'A savings plan grows by a fixed step each week, and the saver wants to know one week’s amount and the running total.',
 prompt: 'A savings plan: in week j you put 3j + 10 dollars into a jar. So in week 1 you put in 3 × 1 + 10 = 13 dollars, and each week after that you put in $3 more than the week before. Enter the dollars for week 5, then Σ (3j + 10) for j = 1 to 5, the total saved over the first 5 weeks.',
 answer: [25, 95], labels: ['that week ($)', 'total saved ($)'], tolerance: 0.001,
 hints: [
  'Here the Σ adds a rule, not a row of a grid. Put the week number in place of j: week 5 is 3 × 5 + 10.',
  'The Σ says: let j be 1, then 2, and so on up to 5. Work out 3j + 10 each time and add all 5 amounts.'
 ],
 solution: 'Week 5: 3 × 5 + 10 = 25 dollars. For j = 1 to 5 the amounts are 13, 16, 19, 22, 25. Their sum is 13 + 16 + 19 + 22 + 25 = 95 dollars.',
 guidance: [
  { prompt: 'Put j = 2 into 3j + 10. How many dollars go into the jar in week 2?', answer: [16], labels: ['week 2 ($)'], explanation: '3 × 2 + 10 = 16 dollars, $3 more than week 1.' },
  { prompt: 'Put j = 5 into 3j + 10. How many dollars go in during week 5?', answer: [25], labels: ['that week ($)'], explanation: '3 × 5 + 10 = 25 dollars.' },
  { prompt: 'For j = 1 to 5 the amounts are 13, 16, 19, 22, 25. What do they add up to?', answer: [95], labels: ['total saved ($)'], explanation: '13 + 16 + 19 + 22 + 25 = 95 dollars saved in 5 weeks.' }
 ]
}, {
 canonical: { m: 3, c: 10, N: 5 },
 draw: R => ({ m: R.int(2, 5), c: R.pick([5, 10, 15, 20]), N: R.int(4, 6) }),
 build: ({ m, c, N }) => { const terms = []; for (let j = 1; j <= N; j++) terms.push(m * j + c); const last = terms[N - 1], S = sum(terms); return {
  prompt: `A savings plan: in week j you put ${n(m)}j + ${n(c)} dollars into a jar. So in week 1 you put in ${n(m)} × 1 + ${n(c)} = ${n(m + c)} dollars, and each week after that you put in $${n(m)} more than the week before. Enter the dollars for week ${n(N)}, then Σ (${n(m)}j + ${n(c)}) for j = 1 to ${n(N)}, the total saved over the first ${n(N)} weeks.`,
  answer: [last, S],
  hints: [`Here the Σ adds a rule, not a row of a grid. Put the week number in place of j: week ${n(N)} is ${n(m)} × ${n(N)} + ${n(c)}.`, `The Σ says: let j be 1, then 2, and so on up to ${n(N)}. Work out ${n(m)}j + ${n(c)} each time and add all ${n(N)} amounts.`],
  solution: `Week ${n(N)}: ${n(m)} × ${n(N)} + ${n(c)} = ${n(last)} dollars. For j = 1 to ${n(N)} the amounts are ${terms.map(n).join(', ')}. Their sum is ${terms.map(n).join(' + ')} = ${n(S)} dollars.`,
  guidance: [
   { prompt: `Put j = 2 into ${n(m)}j + ${n(c)}. How many dollars go into the jar in week 2?`, answer: [terms[1]], explanation: `${n(m)} × 2 + ${n(c)} = ${n(terms[1])} dollars, $${n(m)} more than week 1.` },
   { prompt: `Put j = ${n(N)} into ${n(m)}j + ${n(c)}. How many dollars go in during week ${n(N)}?`, answer: [last], explanation: `${n(m)} × ${n(N)} + ${n(c)} = ${n(last)} dollars.` },
   { prompt: `For j = 1 to ${n(N)} the amounts are ${terms.map(n).join(', ')}. What do they add up to?`, answer: [S], explanation: `${terms.map(n).join(' + ')} = ${n(S)} dollars saved in ${n(N)} weeks.` }
  ] }; }
});

/* ---- q30 Exponent rules ---- */

/* Phone storage (product of powers) and bytes in a megabyte or gigabyte (power of a power). */
add({
 id: 'q30b', parent: 'q30', kind: 'setting',
 title: 'Storage on the new phone',
 brief: 'Phone storage is sold in powers of 2, and a shopper wants to compare two models and see how many bytes the bigger units really hold.',
 prompt: 'A basic phone has 2⁵ gigabytes (GB) of storage. The top model has 2³ times as much, so it has 2⁵ × 2³ GB. Write this as one power of 2 and enter the exponent, then enter the number of GB. Next, file sizes are counted in bytes. A computer counts 1 kilobyte as 2¹⁰ bytes and 1 megabyte as 2¹⁰ kilobytes, so 1 megabyte is 2¹⁰ × 2¹⁰ = (2¹⁰)² bytes. Write this as one power of 2 and enter the exponent. Type each number without commas.',
 answer: [8, 256, 20], labels: ['exponent for the top model', 'GB in the top model', 'exponent for the bytes'], tolerance: 0.001,
 hints: [
  '2⁵ × 2³ is a string of 2s multiplied together. Count how many 2s there are in all.',
  '(2¹⁰)² is 2¹⁰ written twice and multiplied, and each 2¹⁰ is ten 2s.'
 ],
 solution: '2⁵ × 2³ is 5 twos times 3 twos, 8 twos in all: 2⁸ = 256 GB. (2¹⁰)² is 2 groups of ten 2s, 20 twos in all, so 1 megabyte is 2²⁰ bytes: the exponent is 20.',
 guidance: [
  { prompt: '2⁵ × 2³ is 5 twos multiplied by 3 more twos. How many twos is that in all?', answer: [8], labels: ['exponent for the top model'], explanation: '5 + 3 = 8, so the top model has 2⁸ GB.' },
  { prompt: '2⁵ = 32. Double it 3 more times to get 2⁸. How many GB is that?', answer: [256], labels: ['GB in the top model'], explanation: 'Starting from 32 and doubling 3 times gives 2⁸ = 256 GB.' },
  { prompt: '(2¹⁰)² is 2 groups of ten 2s, all multiplied together. How many 2s is that in all?', answer: [20], labels: ['exponent for the bytes'], explanation: '2 groups of 10 make 20, so (2¹⁰)² = 2²⁰.' }
 ]
}, {
 canonical: { m: 5, k: 3, u: 2 },
 /* m ≥ 3, so m + k never equals m × k; 10 × u never equals 10 + u. */
 draw: R => ({ m: R.int(3, 6), k: R.int(2, 4), u: R.pick([2, 3]) }),
 build: ({ m, k, u }) => { const e = m + k, base = Math.pow(2, m), gb = Math.pow(2, e), v = 10 * u, unit = u === 2 ? 'megabyte' : 'gigabyte'; return {
  prompt: `A basic phone has 2${sup(m)} gigabytes (GB) of storage. The top model has 2${sup(k)} times as much, so it has 2${sup(m)} × 2${sup(k)} GB. Write this as one power of 2 and enter the exponent, then enter the number of GB. Next, file sizes are counted in bytes. A computer counts 1 kilobyte as 2¹⁰ bytes${u === 2 ? ' and 1 megabyte as 2¹⁰ kilobytes, so 1 megabyte is 2¹⁰ × 2¹⁰ = (2¹⁰)² bytes' : ', 1 megabyte as 2¹⁰ kilobytes and 1 gigabyte as 2¹⁰ megabytes, so 1 gigabyte is 2¹⁰ × 2¹⁰ × 2¹⁰ = (2¹⁰)³ bytes'}. Write this as one power of 2 and enter the exponent. Type each number without commas.`,
  answer: [e, gb, v],
  hints: [`2${sup(m)} × 2${sup(k)} is a string of 2s multiplied together. Count how many 2s there are in all.`, `(2¹⁰)${sup(u)} is 2¹⁰ written ${u === 2 ? 'twice' : 'three times'} and multiplied, and each 2¹⁰ is ten 2s.`],
  solution: `2${sup(m)} × 2${sup(k)} is ${n(m)} twos times ${n(k)} twos, ${n(e)} twos in all: 2${sup(e)} = ${n(gb)} GB. (2¹⁰)${sup(u)} is ${n(u)} groups of ten 2s, ${n(v)} twos in all, so 1 ${unit} is 2${sup(v)} bytes: the exponent is ${n(v)}.`,
  guidance: [
   { prompt: `2${sup(m)} × 2${sup(k)} is ${n(m)} twos multiplied by ${n(k)} more twos. How many twos is that in all?`, answer: [e], explanation: `${n(m)} + ${n(k)} = ${n(e)}, so the top model has 2${sup(e)} GB.` },
   { prompt: `2${sup(m)} = ${n(base)}. Double it ${n(k)} more times to get 2${sup(e)}. How many GB is that?`, answer: [gb], explanation: `Starting from ${n(base)} and doubling ${n(k)} times gives 2${sup(e)} = ${n(gb)} GB.` },
   { prompt: `(2¹⁰)${sup(u)} is ${n(u)} groups of ten 2s, all multiplied together. How many 2s is that in all?`, answer: [v], explanation: `${n(u)} groups of 10 make ${n(v)}, so (2¹⁰)${sup(u)} = 2${sup(v)}.` }
  ] }; }
});

/* Tiling: a power of a power for the floor, a product of powers for the pallet, then both worked out. */
add({
 id: 'q30c', parent: 'q30', kind: 'applied',
 title: 'Tiles for the kitchen floor',
 brief: 'A square kitchen floor is to be tiled from one pallet, and the tiler wants to know how many tiles will be left over.',
 prompt: 'A square kitchen floor takes 2³ = 8 tiles along each side, so it needs (2³)² tiles. Write this as one power of 2 and enter the exponent. Tiles are sold by the pallet, a large stack of boxes. One pallet is 2³ boxes with 2⁵ tiles in each box, so it has 2³ × 2⁵ tiles. Write this as one power of 2 and enter the exponent. Then enter how many tiles are left over when one pallet is used to tile the floor. Type each number without commas.',
 answer: [6, 8, 192], labels: ['exponent for the floor', 'exponent for the pallet', 'tiles left over'], tolerance: 0.001,
 hints: [
  '(2³)² is 2³ × 2³: count the 2s in both groups together.',
  '2³ × 2⁵ strings 3 twos and 5 twos together, so count them all.',
  'Work out both powers as ordinary numbers by doubling, then take the floor’s tiles away from the pallet’s tiles.'
 ],
 solution: '(2³)² is two groups of 3 twos, 6 twos in all: 2⁶ = 64 tiles for the floor. 2³ × 2⁵ is 3 twos times 5 twos, 8 twos in all: 2⁸ = 256 tiles on the pallet. Left over: 256 − 64 = 192 tiles.',
 guidance: [
  { prompt: '(2³)² is 2³ written twice and multiplied. How many 2s are multiplied in all?', answer: [6], labels: ['exponent for the floor'], explanation: 'Two groups of 3 make 6, so the floor needs 2⁶ tiles.' },
  { prompt: '2³ × 2⁵ is 3 twos multiplied by 5 more twos. How many twos is that in all?', answer: [8], labels: ['exponent for the pallet'], explanation: '3 + 5 = 8, so the pallet has 2⁸ tiles.' },
  { prompt: 'The floor needs 2⁶ = 64 tiles. Keep doubling from 64 to reach 2⁸, the tiles on the pallet, then take away 64. How many tiles are left over?', answer: [192], labels: ['tiles left over'], explanation: '2⁸ = 256, and 256 − 64 = 192 tiles left over.' }
 ]
}, {
 canonical: { p: 3, m: 3, k: 5 },
 /* p ≥ 3 so 2 × p is never p + 2; m + k is at least 8, so it is never m × k. The pallet holds 4 or 8 times what the
    floor needs, so the tiles left over are never the same number as the floor's tiles. */
 draw: R => { const p = R.pick([3, 4]), e = 2 * p + R.int(2, 3), m = R.int(2, e - 2); return { p, m, k: e - m }; },
 build: ({ p, m, k }) => { const s = Math.pow(2, p), fe = 2 * p, F = Math.pow(2, fe), e = m + k, P = Math.pow(2, e), spare = P - F; return {
  prompt: `A square kitchen floor takes 2${sup(p)} = ${n(s)} tiles along each side, so it needs (2${sup(p)})² tiles. Write this as one power of 2 and enter the exponent. Tiles are sold by the pallet, a large stack of boxes. One pallet is 2${sup(m)} boxes with 2${sup(k)} tiles in each box, so it has 2${sup(m)} × 2${sup(k)} tiles. Write this as one power of 2 and enter the exponent. Then enter how many tiles are left over when one pallet is used to tile the floor. Type each number without commas.`,
  answer: [fe, e, spare],
  hints: [`(2${sup(p)})² is 2${sup(p)} × 2${sup(p)}: count the 2s in both groups together.`, `2${sup(m)} × 2${sup(k)} strings ${n(m)} twos and ${n(k)} twos together, so count them all.`, `Work out both powers as ordinary numbers by doubling, then take the floor’s tiles away from the pallet’s tiles.`],
  solution: `(2${sup(p)})² is two groups of ${n(p)} twos, ${n(fe)} twos in all: 2${sup(fe)} = ${n(F)} tiles for the floor. 2${sup(m)} × 2${sup(k)} is ${n(m)} twos times ${n(k)} twos, ${n(e)} twos in all: 2${sup(e)} = ${n(P)} tiles on the pallet. Left over: ${n(P)} − ${n(F)} = ${n(spare)} tiles.`,
  guidance: [
   { prompt: `(2${sup(p)})² is 2${sup(p)} written twice and multiplied. How many 2s are multiplied in all?`, answer: [fe], explanation: `Two groups of ${n(p)} make ${n(fe)}, so the floor needs 2${sup(fe)} tiles.` },
   { prompt: `2${sup(m)} × 2${sup(k)} is ${n(m)} twos multiplied by ${n(k)} more twos. How many twos is that in all?`, answer: [e], explanation: `${n(m)} + ${n(k)} = ${n(e)}, so the pallet has 2${sup(e)} tiles.` },
   { prompt: `The floor needs 2${sup(fe)} = ${n(F)} tiles. Keep doubling from ${n(F)} to reach 2${sup(e)}, the tiles on the pallet, then take away ${n(F)}. How many tiles are left over?`, answer: [spare], explanation: `2${sup(e)} = ${n(P)}, and ${n(P)} − ${n(F)} = ${n(spare)} tiles left over.` }
  ] }; }
});

/* Crates of cubes: both rules in one expression, then a missing exponent found with a one-step equation (q16). */
add({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q16',
 title: 'Cubes for the relay mast',
 brief: 'Alloy cubes leave the fabrication yard in cube-shaped crates, and the yard needs to know how many rover loads the relay mast will take.',
 prompt: 'The fabrication yard packs alloy cubes into cube-shaped crates with 2² = 4 cubes along each edge, so a crate holds (2²)³ cubes. A rover load is 2⁴ crates, so one load carries (2²)³ × 2⁴ cubes. Write this as one power of 2 and enter the exponent, then enter the number of cubes in one load. The relay mast needs 2¹³ cubes in all, which is the cubes in one load multiplied by another power of 2. Enter the exponent of that power. Type each number without commas.',
 answer: [10, 1024, 3], labels: ['exponent for one load', 'cubes in one load', 'exponent for the loads'], tolerance: 0.001,
 hints: [
  'Deal with the brackets first: (2²)³ is three groups of 2 twos.',
  'Multiplying by 2⁴ then adds 4 more twos to the count.',
  'Multiplying powers of 2 adds their exponents, so the exponent for one load plus the missing exponent equals 13. Solve that one-step equation.'
 ],
 solution: '(2²)³ is three groups of 2 twos, 6 twos: 2⁶. Then 2⁶ × 2⁴ is 6 twos times 4 twos, 10 twos in all: 2¹⁰ = 1024 cubes in one load. For the mast, 10 + x = 13, so x = 13 − 10 = 3: the mast takes 2³ = 8 loads.',
 guidance: [
  { prompt: '(2²)³ is 2² written three times and multiplied. How many 2s are multiplied in all?', answer: [6], labels: ['exponent for one crate'], explanation: 'Three groups of 2 make 6, so a crate holds 2⁶ cubes.' },
  { prompt: '2⁶ × 2⁴ is 6 twos multiplied by 4 more twos. How many twos is that in all?', answer: [10], labels: ['exponent for one load'], explanation: '6 + 4 = 10, so one load carries 2¹⁰ cubes.' },
  { prompt: 'A crate holds 2⁶ = 64 cubes. Double that 4 times to get 2¹⁰. How many cubes are in one load?', answer: [1024], labels: ['cubes in one load'], explanation: 'Starting from 64 and doubling 4 times gives 2¹⁰ = 1024 cubes.' },
  { prompt: '2¹⁰ times the missing power must be 2¹³, so 10 + x = 13. What is x?', answer: [3], labels: ['exponent for the loads'], explanation: 'x = 13 − 10 = 3. The mast takes 2³ = 8 loads.' }
 ]
}, {
 canonical: { p: 2, r: 4, x: 3 },
 /* One load is at most 2¹² = 4096 cubes. 3p + r is never 3p × r, and E + x is never E × x. */
 draw: R => { const p = R.pick([2, 3]); return { p, r: p === 2 ? R.int(2, 5) : R.int(2, 3), x: R.int(2, 4) }; },
 build: ({ p, r, x }) => { const s = Math.pow(2, p), ce = 3 * p, C = Math.pow(2, ce), E = ce + r, L = Math.pow(2, E), T = E + x; return {
  prompt: `The fabrication yard packs alloy cubes into cube-shaped crates with 2${sup(p)} = ${n(s)} cubes along each edge, so a crate holds (2${sup(p)})³ cubes. A rover load is 2${sup(r)} crates, so one load carries (2${sup(p)})³ × 2${sup(r)} cubes. Write this as one power of 2 and enter the exponent, then enter the number of cubes in one load. The relay mast needs 2${sup(T)} cubes in all, which is the cubes in one load multiplied by another power of 2. Enter the exponent of that power. Type each number without commas.`,
  answer: [E, L, x],
  hints: [`Deal with the brackets first: (2${sup(p)})³ is three groups of ${n(p)} twos.`, `Multiplying by 2${sup(r)} then adds ${n(r)} more twos to the count.`, `Multiplying powers of 2 adds their exponents, so the exponent for one load plus the missing exponent equals ${n(T)}. Solve that one-step equation.`],
  solution: `(2${sup(p)})³ is three groups of ${n(p)} twos, ${n(ce)} twos: 2${sup(ce)}. Then 2${sup(ce)} × 2${sup(r)} is ${n(ce)} twos times ${n(r)} twos, ${n(E)} twos in all: 2${sup(E)} = ${n(L)} cubes in one load. For the mast, ${n(E)} + x = ${n(T)}, so x = ${n(T)} − ${n(E)} = ${n(x)}: the mast takes 2${sup(x)} = ${n(Math.pow(2, x))} loads.`,
  guidance: [
   { prompt: `(2${sup(p)})³ is 2${sup(p)} written three times and multiplied. How many 2s are multiplied in all?`, answer: [ce], explanation: `Three groups of ${n(p)} make ${n(ce)}, so a crate holds 2${sup(ce)} cubes.` },
   { prompt: `2${sup(ce)} × 2${sup(r)} is ${n(ce)} twos multiplied by ${n(r)} more twos. How many twos is that in all?`, answer: [E], explanation: `${n(ce)} + ${n(r)} = ${n(E)}, so one load carries 2${sup(E)} cubes.` },
   { prompt: `A crate holds 2${sup(ce)} = ${n(C)} cubes. Double that ${n(r)} times to get 2${sup(E)}. How many cubes are in one load?`, answer: [L], explanation: `Starting from ${n(C)} and doubling ${n(r)} times gives 2${sup(E)} = ${n(L)} cubes.` },
   { prompt: `2${sup(E)} times the missing power must be 2${sup(T)}, so ${n(E)} + x = ${n(T)}. What is x?`, answer: [x], explanation: `x = ${n(T)} − ${n(E)} = ${n(x)}. The mast takes 2${sup(x)} = ${n(Math.pow(2, x))} loads.` }
  ] }; }
});
})();
