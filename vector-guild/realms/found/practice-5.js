/* Foundations practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d ... q25b q25c q25d). Format and rules: docs/PACK-FORMAT.md, "Practice missions".
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/found/oracle-p5.js.

   Settings in this file: q21 hill trail, loan statement, freezer log; q22 prepaid phone, roasting times, plumber's
   bill; q23 taxi fares, hospital drip, outpost pipeline; q24 diver, warehouse robot, hiker's GPS; q25 tool hire,
   printers and ink, two runners. Money is in dollars and every answer is a whole number. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par, vec } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* "+ 4" or "− 4": a signed term with spaces, for beginners. */
const term = x => x < 0 ? `− ${n(-x)}` : `+ ${n(x)}`;
/* "4 + (−3) + 2": a sum with every negative number in brackets after the first. */
const sum = list => list.map((v, i) => i ? par(v) : n(v)).join(' + ');
/* A displacement in words: "4 m east, 3 m south and 6 m down" (no part is 0). */
const swim = d => `${n(Math.abs(d[0]))} m ${d[0] > 0 ? 'east' : 'west'}, ${n(Math.abs(d[1]))} m ${d[1] > 0 ? 'north' : 'south'} and ${n(Math.abs(d[2]))} m ${d[2] > 0 ? 'up' : 'down'}`;
/* "9 km north" or "3 km south" for a non-zero y. */
const ns = y => `${n(Math.abs(y))} km ${y > 0 ? 'north' : 'south'}`;

/* ───────────── q21 Slope as rate of change ───────────── */

/* q21b: heights at two kilometre posts of a trail; the slope is in metres per km (not a rate over time) and may fall. */
add({
 id: 'q21b', parent: 'q21', kind: 'setting',
 title: 'The steepness of the ridge trail',
 brief: 'A walking map gives the height of the ground at two marker posts, and the walkers want to know how steep the trail is between them.',
 prompt: 'A walking trail has a marker post every kilometre. The map gives the height of the ground at two of them: 420 m at the 3 km post and 560 m at the 7 km post. The trail slopes steadily between the two posts. Walking from the 3 km post to the 7 km post, enter the rise (the change in height in metres, negative if the trail goes down), the run (the change in km), and then the slope in metres per km.',
 answer: [140, 4, 35], labels: ['rise (metres)', 'run (km)', 'slope (metres per km)'], tolerance: 0.001,
 hints: [
  'Rise = height at the later post − height at the earlier post = 560 − 420. Run = later post − earlier post = 7 − 3.',
  'Slope = rise ÷ run, up over across. A trail that goes down has a negative rise, so its slope is negative too.'
 ],
 solution: 'Rise = 560 − 420 = 140 m. Run = 7 − 3 = 4 km. Slope = 140 ÷ 4 = 35 m per km: the trail climbs 35 m for every km walked.',
 guidance: [
  { prompt: 'Rise: the height at the 7 km post minus the height at the 3 km post, 560 − 420. What is it?', answer: [140], labels: ['rise (metres)'], explanation: '560 − 420 = 140 m.' },
  { prompt: 'Run: how many km is it from the 3 km post to the 7 km post?', answer: [4], labels: ['run (km)'], explanation: '7 − 3 = 4 km.' },
  { prompt: 'Slope = rise ÷ run = 140 ÷ 4. What is it?', answer: [35], labels: ['slope (metres per km)'], explanation: '140 ÷ 4 = 35: the height changes by 35 m for each km.' }
 ]
}, {
 canonical: { x1: 3, run: 4, m: 35, y1: 420 },
 /* Slopes of 15 to 60 m per km, up or down; heights stay between 100 m and 900 m. */
 draw: R => { const m = R.pick([15, 20, 25, 30, 35, 40, 45, 50, 60]) * (R.bool() ? 1 : -1), run = R.int(2, 6), rise = m * run;
  return { x1: R.int(1, 6), run, m, y1: 10 * (rise < 0 ? R.int(10 + Math.ceil(-rise / 10), 90) : R.int(10, 90 - Math.ceil(rise / 10))) }; },
 build: ({ x1, run, m, y1 }) => { const x2 = x1 + run, rise = m * run, y2 = y1 + rise, way = m < 0 ? 'drops' : 'climbs'; return {
  prompt: `A walking trail has a marker post every kilometre. The map gives the height of the ground at two of them: ${n(y1)} m at the ${n(x1)} km post and ${n(y2)} m at the ${n(x2)} km post. The trail slopes steadily between the two posts. Walking from the ${n(x1)} km post to the ${n(x2)} km post, enter the rise (the change in height in metres, negative if the trail goes down), the run (the change in km), and then the slope in metres per km.`,
  answer: [rise, run, m],
  hints: [`Rise = height at the later post − height at the earlier post = ${n(y2)} − ${n(y1)}. Run = later post − earlier post = ${n(x2)} − ${n(x1)}.`, 'Slope = rise ÷ run, up over across. A trail that goes down has a negative rise, so its slope is negative too.'],
  solution: `Rise = ${n(y2)} − ${n(y1)} = ${n(rise)} m. Run = ${n(x2)} − ${n(x1)} = ${n(run)} km. Slope = ${n(rise)} ÷ ${n(run)} = ${n(m)} m per km: the trail ${way} ${n(Math.abs(m))} m for every km walked.`,
  guidance: [
   { prompt: `Rise: the height at the ${n(x2)} km post minus the height at the ${n(x1)} km post, ${n(y2)} − ${n(y1)}. What is it?`, answer: [rise], explanation: `${n(y2)} − ${n(y1)} = ${n(rise)} m${m < 0 ? '; it is negative because the trail goes down' : ''}.` },
   { prompt: `Run: how many km is it from the ${n(x1)} km post to the ${n(x2)} km post?`, answer: [run], explanation: `${n(x2)} − ${n(x1)} = ${n(run)} km.` },
   { prompt: `Slope = rise ÷ run = ${n(rise)} ÷ ${n(run)}. What is it?`, answer: [m], explanation: `${n(rise)} ÷ ${n(run)} = ${n(m)}: the height changes by ${n(m)} m for each km.` }
  ] }; }
});

/* q21c: a loan falling by equal payments; the slope is found from two statement lines and then used to look ahead.
   Only "so much off per payment, so many payments" is needed for the second answer (no negative × positive yet). */
add({
 id: 'q21c', parent: 'q21', kind: 'applied',
 title: 'Reading the loan statement',
 brief: 'A loan statement shows what was still owed after two of the payments, and the borrower wants to know what will be owed later on.',
 prompt: 'An interest-free loan is being paid back in equal monthly payments. The statement shows $2550 still owed after payment 3 and $1800 still owed after payment 8, so the amount owed falls at a steady rate. Enter the slope in dollars per payment (negative, because the amount owed goes down). Then enter how many dollars will still be owed after payment 12. Type each number without commas.',
 answer: [-150, 1200], labels: ['slope (dollars per payment)', 'owed after the later payment (dollars)'], tolerance: 0.001,
 hints: [
  'Rise = later amount − earlier amount = 1800 − 2550, which is negative. Run = 8 − 3 payments. Slope = rise ÷ run.',
  'From payment 8 to payment 12 is 12 − 8 more payments. Each one takes the same number of dollars off the amount owed.'
 ],
 solution: 'Rise = 1800 − 2550 = −750 dollars. Run = 8 − 3 = 5 payments. Slope = −750 ÷ 5 = −150 dollars per payment: each payment takes $150 off the loan. From payment 8 to payment 12 is 12 − 8 = 4 more payments, which take off 4 × 150 = 600 dollars. 1800 − 600 = 1200, so $1200 is still owed after payment 12.',
 guidance: [
  { prompt: 'The amount owed went from $2550 to $1800 while the payment number went from 3 to 8. Enter the rise (later amount − earlier amount), then the run (later payment number − earlier payment number).', answer: [-750, 5], labels: ['rise (dollars)', 'run (payments)'], explanation: 'Rise = 1800 − 2550 = −750 dollars, negative because the amount owed fell. Run = 8 − 3 = 5 payments.' },
  { prompt: 'Slope = rise ÷ run = −750 ÷ 5. What is it?', answer: [-150], labels: ['slope (dollars per payment)'], explanation: '−750 ÷ 5 = −150 dollars per payment: every payment takes $150 off the loan.' },
  { prompt: 'After payment 8, $1800 is owed. Payment 12 is 4 payments later, and each payment takes $150 off. How many dollars are owed after payment 12?', answer: [1200], labels: ['dollars owed'], explanation: '4 × 150 = 600 dollars come off, and 1800 − 600 = 1200 dollars.' }
 ]
}, {
 canonical: { x1: 3, run: 5, k: 4, m: -150, y3: 1200 },
 /* y3 (still owed at the end) is at least 100, so the loan is never paid off inside the problem. */
 draw: R => ({ x1: R.int(2, 6), run: R.int(2, 5), k: R.int(2, 5), m: -R.pick([40, 50, 60, 75, 80, 100, 120, 125, 150, 200]), y3: 50 * R.int(2, 24) }),
 build: ({ x1, run, k, m, y3 }) => { const x2 = x1 + run, x3 = x2 + k, a = -m, y2 = y3 + a * k, y1 = y2 + a * run, rise = m * run; return {
  prompt: `An interest-free loan is being paid back in equal monthly payments. The statement shows $${n(y1)} still owed after payment ${n(x1)} and $${n(y2)} still owed after payment ${n(x2)}, so the amount owed falls at a steady rate. Enter the slope in dollars per payment (negative, because the amount owed goes down). Then enter how many dollars will still be owed after payment ${n(x3)}. Type each number without commas.`,
  answer: [m, y3],
  hints: [`Rise = later amount − earlier amount = ${n(y2)} − ${n(y1)}, which is negative. Run = ${n(x2)} − ${n(x1)} payments. Slope = rise ÷ run.`, `From payment ${n(x2)} to payment ${n(x3)} is ${n(x3)} − ${n(x2)} more payments. Each one takes the same number of dollars off the amount owed.`],
  solution: `Rise = ${n(y2)} − ${n(y1)} = ${n(rise)} dollars. Run = ${n(x2)} − ${n(x1)} = ${n(run)} payments. Slope = ${n(rise)} ÷ ${n(run)} = ${n(m)} dollars per payment: each payment takes $${n(a)} off the loan. From payment ${n(x2)} to payment ${n(x3)} is ${n(x3)} − ${n(x2)} = ${n(k)} more payments, which take off ${n(k)} × ${n(a)} = ${n(k * a)} dollars. ${n(y2)} − ${n(k * a)} = ${n(y3)}, so $${n(y3)} is still owed after payment ${n(x3)}.`,
  guidance: [
   { prompt: `The amount owed went from $${n(y1)} to $${n(y2)} while the payment number went from ${n(x1)} to ${n(x2)}. Enter the rise (later amount − earlier amount), then the run (later payment number − earlier payment number).`, answer: [rise, run], explanation: `Rise = ${n(y2)} − ${n(y1)} = ${n(rise)} dollars, negative because the amount owed fell. Run = ${n(x2)} − ${n(x1)} = ${n(run)} payments.` },
   { prompt: `Slope = rise ÷ run = ${n(rise)} ÷ ${n(run)}. What is it?`, answer: [m], explanation: `${n(rise)} ÷ ${n(run)} = ${n(m)} dollars per payment: every payment takes $${n(a)} off the loan.` },
   { prompt: `After payment ${n(x2)}, $${n(y2)} is owed. Payment ${n(x3)} is ${n(k)} payments later, and each payment takes $${n(a)} off. How many dollars are owed after payment ${n(x3)}?`, answer: [y3], explanation: `${n(k)} × ${n(a)} = ${n(k * a)} dollars come off, and ${n(y2)} − ${n(k * a)} = ${n(y3)} dollars.` }
  ] }; }
});

/* q21d: three readings of a freezer that warms from below zero to above it and cools back below zero: two slopes,
   one of each sign, and both rises cross zero (number line with negatives, q06). */
add({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q06',
 title: 'The freezer that was switched off',
 brief: 'A freezer was switched off for a repair and then switched back on, and its log should show how fast it warmed and how fast it cooled.',
 prompt: 'A freezer was switched off for a repair and later switched on again. Its thermometer log reads −14 °C at hour 1, 6 °C at hour 5 and −9 °C at hour 8. The temperature changed at a steady rate between one reading and the next. Enter the slope in °C per hour from hour 1 to hour 5, then the slope from hour 5 to hour 8.',
 answer: [5, -5], labels: ['slope while warming (°C per hour)', 'slope while cooling (°C per hour)'], tolerance: 0.001,
 hints: [
  'For each stretch, rise = later temperature − earlier temperature and run = later hour − earlier hour. The first rise is 6 − (−14).',
  'Taking away a negative number is the same as adding its size. On the second stretch the temperature falls, so its rise and its slope are negative.'
 ],
 solution: 'First stretch: rise = 6 − (−14) = 6 + 14 = 20 °C and run = 5 − 1 = 4 hours, so the slope is 20 ÷ 4 = 5 °C per hour. Second stretch: rise = −9 − 6 = −15 °C and run = 8 − 5 = 3 hours, so the slope is −15 ÷ 3 = −5 °C per hour. The freezer warmed by 5 °C each hour, then cooled by 5 °C each hour.',
 guidance: [
  { prompt: 'First stretch: the temperature went from −14 °C to 6 °C. What is the rise, 6 − (−14)?', answer: [20], labels: ['first rise (°C)'], explanation: 'From −14 up to 0 is 14 degrees, and then 6 more: 6 − (−14) = 6 + 14 = 20 °C.' },
  { prompt: 'The run is 5 − 1 = 4 hours. What is the first slope, 20 ÷ 4?', answer: [5], labels: ['first slope (°C per hour)'], explanation: '20 ÷ 4 = 5 °C per hour.' },
  { prompt: 'Second stretch: the temperature went from 6 °C to −9 °C. What is the rise, −9 − 6?', answer: [-15], labels: ['second rise (°C)'], explanation: 'From 6 down to 0 is 6 degrees, and then 9 more: a fall of 15 degrees, so the rise is −15 °C.' },
  { prompt: 'The run is 8 − 5 = 3 hours. What is the second slope, −15 ÷ 3?', answer: [-5], labels: ['second slope (°C per hour)'], explanation: '−15 ÷ 3 = −5 °C per hour: a negative number divided by a positive number is negative.' }
 ]
}, {
 canonical: { t1: 1, r1: 4, a1: 5, T2: 6, r2: 3, a2: 5 },
 /* T2 (the warmest reading) is 1 to 10 °C. The first reading is below zero (down to −25 °C) and so is the last. */
 draw: R => { const r1 = R.int(2, 6), a1 = R.int(2, 5), up = a1 * r1, T2 = R.int(Math.max(1, up - 25), Math.min(10, up - 2)),
   r2 = R.int(2, 6), lo = Math.max(2, Math.floor(T2 / r2) + 1); return { t1: R.int(1, 4), r1, a1, T2, r2, a2: R.int(lo, lo + 2) }; },
 build: ({ t1, r1, a1, T2, r2, a2 }) => { const t2 = t1 + r1, t3 = t2 + r2, rise1 = a1 * r1, rise2 = -a2 * r2, T1 = T2 - rise1, T3 = T2 + rise2, m2 = -a2; return {
  prompt: `A freezer was switched off for a repair and later switched on again. Its thermometer log reads ${n(T1)} °C at hour ${n(t1)}, ${n(T2)} °C at hour ${n(t2)} and ${n(T3)} °C at hour ${n(t3)}. The temperature changed at a steady rate between one reading and the next. Enter the slope in °C per hour from hour ${n(t1)} to hour ${n(t2)}, then the slope from hour ${n(t2)} to hour ${n(t3)}.`,
  answer: [a1, m2],
  hints: [`For each stretch, rise = later temperature − earlier temperature and run = later hour − earlier hour. The first rise is ${n(T2)} − ${par(T1)}.`, 'Taking away a negative number is the same as adding its size. On the second stretch the temperature falls, so its rise and its slope are negative.'],
  solution: `First stretch: rise = ${n(T2)} − ${par(T1)} = ${n(T2)} + ${n(-T1)} = ${n(rise1)} °C and run = ${n(t2)} − ${n(t1)} = ${n(r1)} hours, so the slope is ${n(rise1)} ÷ ${n(r1)} = ${n(a1)} °C per hour. Second stretch: rise = ${n(T3)} − ${n(T2)} = ${n(rise2)} °C and run = ${n(t3)} − ${n(t2)} = ${n(r2)} hours, so the slope is ${n(rise2)} ÷ ${n(r2)} = ${n(m2)} °C per hour. The freezer warmed by ${n(a1)} °C each hour, then cooled by ${n(a2)} °C each hour.`,
  guidance: [
   { prompt: `First stretch: the temperature went from ${n(T1)} °C to ${n(T2)} °C. What is the rise, ${n(T2)} − ${par(T1)}?`, answer: [rise1], explanation: `From ${n(T1)} up to 0 is ${n(-T1)} degrees, and then ${n(T2)} more: ${n(T2)} − ${par(T1)} = ${n(T2)} + ${n(-T1)} = ${n(rise1)} °C.` },
   { prompt: `The run is ${n(t2)} − ${n(t1)} = ${n(r1)} hours. What is the first slope, ${n(rise1)} ÷ ${n(r1)}?`, answer: [a1], explanation: `${n(rise1)} ÷ ${n(r1)} = ${n(a1)} °C per hour.` },
   { prompt: `Second stretch: the temperature went from ${n(T2)} °C to ${n(T3)} °C. What is the rise, ${n(T3)} − ${n(T2)}?`, answer: [rise2], explanation: `From ${n(T2)} down to 0 is ${T2 === 1 ? '1 degree' : `${n(T2)} degrees`}, and then ${n(-T3)} more: a fall of ${n(-rise2)} degrees, so the rise is ${n(rise2)} °C.` },
   { prompt: `The run is ${n(t3)} − ${n(t2)} = ${n(r2)} hours. What is the second slope, ${n(rise2)} ÷ ${n(r2)}?`, answer: [m2], explanation: `${n(rise2)} ÷ ${n(r2)} = ${n(m2)} °C per hour: a negative number divided by a positive number is negative.` }
  ] }; }
});

/* ───────────── q22 The line y = mx + b ───────────── */

/* q22b: the rule is told in words, not given: the player reads m (negative) and b from the situation, then evaluates. */
add({
 id: 'q22b', parent: 'q22', kind: 'setting',
 title: 'Credit on the prepaid phone',
 brief: 'A prepaid phone loses the same amount of credit with every day pass for data, and its owner wants the rule for the credit that is left.',
 prompt: 'A prepaid phone starts the month with $50 of credit. Each day pass for mobile data takes $4 off the credit. After x day passes the credit left is y dollars, and y follows a line y = mx + b. Enter the slope m (dollars per day pass, with its sign), the starting value b, and then the dollars of credit left after 7 day passes.',
 answer: [-4, 50, 22], labels: ['slope m', 'starting value b', 'credit left (dollars)'], tolerance: 0.001,
 hints: [
  'The slope m is the change in y for one more step of x. Every day pass makes the credit go down, so m is negative.',
  'The starting value b is the credit when x = 0. For the last answer, put x = 7 into your rule and multiply before you add.'
 ],
 solution: 'Each day pass changes the credit by −4 dollars, so m = −4. Before any day pass is bought the credit is $50, so b = 50. The rule is y = −4x + 50. After 7 day passes, y = −4 × 7 + 50 = −28 + 50 = 22 dollars.',
 guidance: [
  { prompt: 'One more day pass changes the credit by how many dollars? Enter the change with its sign.', answer: [-4], labels: ['slope m'], explanation: 'Each pass takes $4 off, which is a change of −4 dollars, so m = −4.' },
  { prompt: 'How many dollars of credit are there when x = 0, before any day pass is bought?', answer: [50], labels: ['starting value b'], explanation: 'The phone starts with $50, so b = 50 and the rule is y = −4x + 50.' },
  { prompt: 'Put x = 7 into y = −4x + 50: −4 × 7 + 50. What is y?', answer: [22], labels: ['credit left (dollars)'], explanation: '−4 × 7 = −28, and −28 + 50 = 22 dollars.' }
 ]
}, {
 canonical: { a: 4, b: 50, x1: 7 },
 /* The credit never runs out: b is more than a × x1. b differs from a, so swapping m and b is always wrong. */
 draw: R => { const a = R.int(2, 6), x1 = R.int(3, 9); return { a, x1, b: R.int(a * x1 + 2, a * x1 + 30) }; },
 build: ({ a, b, x1 }) => { const m = -a, y = m * x1 + b; return {
  prompt: `A prepaid phone starts the month with $${n(b)} of credit. Each day pass for mobile data takes $${n(a)} off the credit. After x day passes the credit left is y dollars, and y follows a line y = mx + b. Enter the slope m (dollars per day pass, with its sign), the starting value b, and then the dollars of credit left after ${n(x1)} day passes.`,
  answer: [m, b, y],
  hints: ['The slope m is the change in y for one more step of x. Every day pass makes the credit go down, so m is negative.', `The starting value b is the credit when x = 0. For the last answer, put x = ${n(x1)} into your rule and multiply before you add.`],
  solution: `Each day pass changes the credit by ${n(m)} dollars, so m = ${n(m)}. Before any day pass is bought the credit is $${n(b)}, so b = ${n(b)}. The rule is y = ${n(m)}x + ${n(b)}. After ${n(x1)} day passes, y = ${n(m)} × ${n(x1)} + ${n(b)} = ${n(m * x1)} + ${n(b)} = ${n(y)} dollars.`,
  guidance: [
   { prompt: `One more day pass changes the credit by how many dollars? Enter the change with its sign.`, answer: [m], explanation: `Each pass takes $${n(a)} off, which is a change of ${n(m)} dollars, so m = ${n(m)}.` },
   { prompt: 'How many dollars of credit are there when x = 0, before any day pass is bought?', answer: [b], explanation: `The phone starts with $${n(b)}, so b = ${n(b)} and the rule is y = ${n(m)}x + ${n(b)}.` },
   { prompt: `Put x = ${n(x1)} into y = ${n(m)}x + ${n(b)}: ${n(m)} × ${n(x1)} + ${n(b)}. What is y?`, answer: [y], explanation: `${n(m)} × ${n(x1)} = ${n(m * x1)}, and ${n(m * x1)} + ${n(b)} = ${n(y)} dollars.` }
  ] }; }
});

/* q22c: a roasting rule evaluated for two weights; the difference shows the slope at work (the extra b cancels). */
add({
 id: 'q22c', parent: 'q22', kind: 'applied',
 title: 'Roasting times for two turkeys',
 brief: 'A recipe gives the roasting time as a rule, and the cook has two turkeys of different weights to plan for.',
 prompt: 'A recipe says: roast a turkey for 40 minutes for each kilogram, plus 25 minutes extra. So a turkey of x kg needs y = 40x + 25 minutes in the oven. Enter the minutes for a 3 kg turkey, then the minutes for a 5 kg turkey, and then how many more minutes the larger turkey needs than the smaller one.',
 answer: [145, 225, 80], labels: ['minutes for the smaller turkey', 'minutes for the larger turkey', 'extra minutes'], tolerance: 0.001,
 hints: [
  'Put the weight in place of x and multiply before you add: for 3 kg that is 40 × 3 + 25.',
  'For the last answer, subtract the smaller time from the larger one. The extra minutes come only from the extra kilograms.'
 ],
 solution: 'For 3 kg: y = 40 × 3 + 25 = 120 + 25 = 145 minutes. For 5 kg: y = 40 × 5 + 25 = 200 + 25 = 225 minutes. The larger turkey needs 225 − 145 = 80 more minutes. That is the slope at work: 2 more kilograms at 40 minutes each is 2 × 40 = 80 minutes, and the 25 extra minutes are the same for both.',
 guidance: [
  { prompt: 'Put x = 3 into y = 40x + 25: 40 × 3 + 25. How many minutes is that?', answer: [145], labels: ['minutes'], explanation: '40 × 3 = 120, and 120 + 25 = 145 minutes.' },
  { prompt: 'Put x = 5 into the same rule: 40 × 5 + 25. How many minutes is that?', answer: [225], labels: ['minutes'], explanation: '40 × 5 = 200, and 200 + 25 = 225 minutes.' },
  { prompt: 'How many more minutes is 225 than 145?', answer: [80], labels: ['extra minutes'], explanation: '225 − 145 = 80 minutes. Each of the 2 extra kilograms adds 40 minutes, the slope.' }
 ]
}, {
 canonical: { m: 40, b: 25, x1: 3, dx: 2 },
 draw: R => { const m = R.pick([20, 25, 30, 35, 40, 45, 50, 55]); return { m, b: R.pick([10, 15, 20, 25, 30, 35, 40].filter(v => v !== m)), x1: R.int(2, 3), dx: R.int(2, 3) }; },
 build: ({ m, b, x1, dx }) => { const x2 = x1 + dx, y1 = m * x1 + b, y2 = m * x2 + b, extra = y2 - y1; return {
  prompt: `A recipe says: roast a turkey for ${n(m)} minutes for each kilogram, plus ${n(b)} minutes extra. So a turkey of x kg needs y = ${n(m)}x + ${n(b)} minutes in the oven. Enter the minutes for a ${n(x1)} kg turkey, then the minutes for a ${n(x2)} kg turkey, and then how many more minutes the larger turkey needs than the smaller one.`,
  answer: [y1, y2, extra],
  hints: [`Put the weight in place of x and multiply before you add: for ${n(x1)} kg that is ${n(m)} × ${n(x1)} + ${n(b)}.`, 'For the last answer, subtract the smaller time from the larger one. The extra minutes come only from the extra kilograms.'],
  solution: `For ${n(x1)} kg: y = ${n(m)} × ${n(x1)} + ${n(b)} = ${n(m * x1)} + ${n(b)} = ${n(y1)} minutes. For ${n(x2)} kg: y = ${n(m)} × ${n(x2)} + ${n(b)} = ${n(m * x2)} + ${n(b)} = ${n(y2)} minutes. The larger turkey needs ${n(y2)} − ${n(y1)} = ${n(extra)} more minutes. That is the slope at work: ${n(dx)} more kilograms at ${n(m)} minutes each is ${n(dx)} × ${n(m)} = ${n(extra)} minutes, and the ${n(b)} extra minutes are the same for both.`,
  guidance: [
   { prompt: `Put x = ${n(x1)} into y = ${n(m)}x + ${n(b)}: ${n(m)} × ${n(x1)} + ${n(b)}. How many minutes is that?`, answer: [y1], explanation: `${n(m)} × ${n(x1)} = ${n(m * x1)}, and ${n(m * x1)} + ${n(b)} = ${n(y1)} minutes.` },
   { prompt: `Put x = ${n(x2)} into the same rule: ${n(m)} × ${n(x2)} + ${n(b)}. How many minutes is that?`, answer: [y2], explanation: `${n(m)} × ${n(x2)} = ${n(m * x2)}, and ${n(m * x2)} + ${n(b)} = ${n(y2)} minutes.` },
   { prompt: `How many more minutes is ${n(y2)} than ${n(y1)}?`, answer: [extra], explanation: `${n(y2)} − ${n(y1)} = ${n(extra)} minutes. Each of the ${n(dx)} extra kilograms adds ${n(m)} minutes, the slope.` }
  ] }; }
});

/* q22d: the rule read forwards (hours to bill) and then backwards (bill to hours), a two-step equation (q17). */
add({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q17',
 title: 'Checking the plumber’s bill',
 brief: 'A plumber charges a call-out fee and an hourly rate, and a customer wants to check one bill and work out the hours behind another.',
 prompt: 'A plumber charges a call-out fee of $60 and then $45 for each hour of work. The bill y in dollars for x hours of work follows y = 45x + 60. Enter the bill for a job of 3 hours. A second job is billed at $375: enter how many hours it took.',
 answer: [195, 7], labels: ['bill for the first job (dollars)', 'hours for the second job'], tolerance: 0.001,
 hints: [
  'For the first answer, put x = 3 into the rule: 45 × 3 + 60.',
  'For the second, y is known and x is not: 45x + 60 = 375. Undo the adding first and then the multiplying, doing the same to both sides.'
 ],
 solution: 'Job of 3 hours: y = 45 × 3 + 60 = 135 + 60 = 195 dollars. Bill of $375: 45x + 60 = 375. Take 60 from both sides: 45x = 315. Divide both sides by 45: x = 315 ÷ 45 = 7 hours. Check: 45 × 7 + 60 = 375.',
 guidance: [
  { prompt: 'Put x = 3 into y = 45x + 60: 45 × 3 + 60. What is the bill?', answer: [195], labels: ['bill (dollars)'], explanation: '45 × 3 = 135, and 135 + 60 = 195 dollars.' },
  { prompt: 'For the second job, 45x + 60 = 375. Take the call-out fee of 60 from both sides. How many dollars are left for the hours?', answer: [315], labels: ['dollars for the hours'], explanation: '375 − 60 = 315, so 45x = 315.' },
  { prompt: '45x = 315. Divide both sides by 45. What is x?', answer: [7], labels: ['hours'], explanation: '315 ÷ 45 = 7 hours. Check: 45 × 7 + 60 = 375.' }
 ]
}, {
 canonical: { m: 45, b: 60, x1: 3, x2: 7 },
 draw: R => { const m = R.pick([35, 40, 45, 50, 55, 60, 65]); return { m, b: R.pick([30, 40, 50, 60, 70, 80, 90].filter(v => v !== m)), x1: R.int(2, 5), x2: R.int(6, 9) }; },
 build: ({ m, b, x1, x2 }) => { const y1 = m * x1 + b, T = m * x2 + b; return {
  prompt: `A plumber charges a call-out fee of $${n(b)} and then $${n(m)} for each hour of work. The bill y in dollars for x hours of work follows y = ${n(m)}x + ${n(b)}. Enter the bill for a job of ${n(x1)} hours. A second job is billed at $${n(T)}: enter how many hours it took.`,
  answer: [y1, x2],
  hints: [`For the first answer, put x = ${n(x1)} into the rule: ${n(m)} × ${n(x1)} + ${n(b)}.`, `For the second, y is known and x is not: ${n(m)}x + ${n(b)} = ${n(T)}. Undo the adding first and then the multiplying, doing the same to both sides.`],
  solution: `Job of ${n(x1)} hours: y = ${n(m)} × ${n(x1)} + ${n(b)} = ${n(m * x1)} + ${n(b)} = ${n(y1)} dollars. Bill of $${n(T)}: ${n(m)}x + ${n(b)} = ${n(T)}. Take ${n(b)} from both sides: ${n(m)}x = ${n(T - b)}. Divide both sides by ${n(m)}: x = ${n(T - b)} ÷ ${n(m)} = ${n(x2)} hours. Check: ${n(m)} × ${n(x2)} + ${n(b)} = ${n(T)}.`,
  guidance: [
   { prompt: `Put x = ${n(x1)} into y = ${n(m)}x + ${n(b)}: ${n(m)} × ${n(x1)} + ${n(b)}. What is the bill?`, answer: [y1], explanation: `${n(m)} × ${n(x1)} = ${n(m * x1)}, and ${n(m * x1)} + ${n(b)} = ${n(y1)} dollars.` },
   { prompt: `For the second job, ${n(m)}x + ${n(b)} = ${n(T)}. Take the call-out fee of ${n(b)} from both sides. How many dollars are left for the hours?`, answer: [T - b], explanation: `${n(T)} − ${n(b)} = ${n(T - b)}, so ${n(m)}x = ${n(T - b)}.` },
   { prompt: `${n(m)}x = ${n(T - b)}. Divide both sides by ${n(m)}. What is x?`, answer: [x2], explanation: `${n(T - b)} ÷ ${n(m)} = ${n(x2)} hours. Check: ${n(m)} × ${n(x2)} + ${n(b)} = ${n(T)}.` }
  ] }; }
});

/* ───────────── q23 The line through two points ───────────── */

/* q23b: two taxi rides are the two points; m is the price per km and b the pick-up charge (both positive, b ≠ m). */
add({
 id: 'q23b', parent: 'q23', kind: 'setting',
 title: 'Working out the taxi fare',
 brief: 'Two taxi receipts from the same firm are enough to work out how the firm sets its fares.',
 prompt: 'A taxi firm charges a fixed amount for the pick-up, plus the same amount for every kilometre. A ride of 4 km cost $17 and a ride of 9 km cost $32. With x for the kilometres and y for the cost in dollars, the two rides are the points (4, 17) and (9, 32) on a line y = mx + b. Enter m, the dollars per km, then b, the pick-up charge in dollars.',
 answer: [3, 5], labels: ['slope m (dollars per km)', 'b (pick-up charge, dollars)'], tolerance: 0.001,
 hints: [
  'm = rise ÷ run = (32 − 17) ÷ (9 − 4): the extra dollars divided by the extra kilometres.',
  'Put one ride’s x and y, and your m, into y = mx + b. For the shorter ride that is 17 = m × 4 + b. Then solve for b.'
 ],
 solution: 'm = (32 − 17) ÷ (9 − 4) = 15 ÷ 5 = 3 dollars per km. Using the shorter ride (4, 17): 17 = 3 × 4 + b = 12 + b, so b = 17 − 12 = 5. The fare rule is y = 3x + 5: $5 for the pick-up and $3 for each km. Check with the longer ride: 3 × 9 + 5 = 32.',
 guidance: [
  { prompt: 'The longer ride cost $32 and the shorter one $17; they were 9 km and 4 km long. Enter how many dollars more the longer ride cost (the rise), then how many km longer it was (the run).', answer: [15, 5], labels: ['extra dollars', 'extra km'], explanation: 'Rise = 32 − 17 = 15 dollars. Run = 9 − 4 = 5 km.' },
  { prompt: 'm = rise ÷ run = 15 ÷ 5. What is m?', answer: [3], labels: ['slope m'], explanation: '15 ÷ 5 = 3: every km adds $3 to the fare.' },
  { prompt: 'Put the shorter ride into y = mx + b: 17 = 3 × 4 + b, which is 17 = 12 + b. What is b?', answer: [5], labels: ['b'], explanation: 'Subtract 12 from both sides: b = 17 − 12 = 5. The pick-up charge is $5.' }
 ]
}, {
 canonical: { m: 3, b: 5, x1: 4, run: 5 },
 draw: R => { const m = R.int(2, 5); return { m, b: R.except(3, 12, [m]), x1: R.int(2, 6), run: R.int(2, 6) }; },
 build: ({ m, b, x1, run }) => { const x2 = x1 + run, y1 = m * x1 + b, y2 = m * x2 + b, rise = m * run; return {
  prompt: `A taxi firm charges a fixed amount for the pick-up, plus the same amount for every kilometre. A ride of ${n(x1)} km cost $${n(y1)} and a ride of ${n(x2)} km cost $${n(y2)}. With x for the kilometres and y for the cost in dollars, the two rides are the points ${vec([x1, y1])} and ${vec([x2, y2])} on a line y = mx + b. Enter m, the dollars per km, then b, the pick-up charge in dollars.`,
  answer: [m, b],
  hints: [`m = rise ÷ run = (${n(y2)} − ${n(y1)}) ÷ (${n(x2)} − ${n(x1)}): the extra dollars divided by the extra kilometres.`, `Put one ride’s x and y, and your m, into y = mx + b. For the shorter ride that is ${n(y1)} = m × ${n(x1)} + b. Then solve for b.`],
  solution: `m = (${n(y2)} − ${n(y1)}) ÷ (${n(x2)} − ${n(x1)}) = ${n(rise)} ÷ ${n(run)} = ${n(m)} dollars per km. Using the shorter ride ${vec([x1, y1])}: ${n(y1)} = ${n(m)} × ${n(x1)} + b = ${n(m * x1)} + b, so b = ${n(y1)} − ${n(m * x1)} = ${n(b)}. The fare rule is y = ${n(m)}x + ${n(b)}: $${n(b)} for the pick-up and $${n(m)} for each km. Check with the longer ride: ${n(m)} × ${n(x2)} + ${n(b)} = ${n(y2)}.`,
  guidance: [
   { prompt: `The longer ride cost $${n(y2)} and the shorter one $${n(y1)}; they were ${n(x2)} km and ${n(x1)} km long. Enter how many dollars more the longer ride cost (the rise), then how many km longer it was (the run).`, answer: [rise, run], explanation: `Rise = ${n(y2)} − ${n(y1)} = ${n(rise)} dollars. Run = ${n(x2)} − ${n(x1)} = ${n(run)} km.` },
   { prompt: `m = rise ÷ run = ${n(rise)} ÷ ${n(run)}. What is m?`, answer: [m], explanation: `${n(rise)} ÷ ${n(run)} = ${n(m)}: every km adds $${n(m)} to the fare.` },
   { prompt: `Put the shorter ride into y = mx + b: ${n(y1)} = ${n(m)} × ${n(x1)} + b, which is ${n(y1)} = ${n(m * x1)} + b. What is b?`, answer: [b], explanation: `Subtract ${n(m * x1)} from both sides: b = ${n(y1)} − ${n(m * x1)} = ${n(b)}. The pick-up charge is $${n(b)}.` }
  ] }; }
});

/* q23c: two readings of an emptying drip bag fix the line (negative m, b = the full bag), then the rule looks ahead. */
add({
 id: 'q23c', parent: 'q23', kind: 'applied',
 title: 'The drip bag on the ward',
 brief: 'A nurse has noted the level of a drip bag twice and needs to know how full it was at the start and how much will be left later.',
 prompt: 'A hospital drip empties at a steady rate. 2 hours after the bag was hung it held 450 mL, and 4 hours after it was hung it held 300 mL. With x for the hours since the bag was hung and y for the mL left, the readings are the points (2, 450) and (4, 300) on a line y = mx + b. Enter m (mL per hour), then b (the mL in the bag when it was hung), and then the mL left 6 hours after it was hung. Type each number without commas.',
 answer: [-75, 600, 150], labels: ['slope m (mL per hour)', 'b (mL at the start)', 'mL left at the later time'], tolerance: 0.001,
 hints: [
  'm = rise ÷ run = (300 − 450) ÷ (4 − 2). The bag is emptying, so m is negative.',
  'Put the first reading and your m into y = mx + b: 450 = m × 2 + b. A negative m makes m × 2 negative, so b is larger than 450. For the last answer, put x = 6 into your finished rule.'
 ],
 solution: 'm = (300 − 450) ÷ (4 − 2) = −150 ÷ 2 = −75 mL per hour. Using (2, 450): 450 = −75 × 2 + b = −150 + b, so b = 450 − (−150) = 450 + 150 = 600 mL. The rule is y = −75x + 600. Check with (4, 300): −75 × 4 + 600 = −300 + 600 = 300. After 6 hours: y = −75 × 6 + 600 = −450 + 600 = 150 mL.',
 guidance: [
  { prompt: 'Rise ÷ run between the two readings: (300 − 450) ÷ (4 − 2). What is m?', answer: [-75], labels: ['slope m'], explanation: 'The rise is −150 and the run is 2, so m = −150 ÷ 2 = −75 mL per hour.' },
  { prompt: '450 = −75 × 2 + b, which is 450 = −150 + b. What is b?', answer: [600], labels: ['b'], explanation: 'b = 450 − (−150) = 450 + 150 = 600. The bag held 600 mL when it was hung.' },
  { prompt: 'Put x = 6 into y = −75x + 600: −75 × 6 + 600. What is y?', answer: [150], labels: ['mL left'], explanation: '−75 × 6 = −450, and −450 + 600 = 150 mL.' }
 ]
}, {
 canonical: { m: -75, x1: 2, run: 2, k: 2, y3: 150 },
 /* y3, the amount left at the last time asked about, is at least 50 mL: the bag is never empty inside the problem. */
 draw: R => ({ m: -R.pick([50, 60, 75, 80, 100, 120, 125]), x1: R.int(2, 3), run: R.int(2, 3), k: R.int(1, 2), y3: 25 * R.int(2, 12) }),
 build: ({ m, x1, run, k, y3 }) => { const x2 = x1 + run, x3 = x2 + k, b = y3 - m * x3, y1 = m * x1 + b, y2 = m * x2 + b, rise = m * run; return {
  prompt: `A hospital drip empties at a steady rate. ${n(x1)} hours after the bag was hung it held ${n(y1)} mL, and ${n(x2)} hours after it was hung it held ${n(y2)} mL. With x for the hours since the bag was hung and y for the mL left, the readings are the points ${vec([x1, y1])} and ${vec([x2, y2])} on a line y = mx + b. Enter m (mL per hour), then b (the mL in the bag when it was hung), and then the mL left ${n(x3)} hours after it was hung. Type each number without commas.`,
  answer: [m, b, y3],
  hints: [`m = rise ÷ run = (${n(y2)} − ${n(y1)}) ÷ (${n(x2)} − ${n(x1)}). The bag is emptying, so m is negative.`, `Put the first reading and your m into y = mx + b: ${n(y1)} = m × ${n(x1)} + b. A negative m makes m × ${n(x1)} negative, so b is larger than ${n(y1)}. For the last answer, put x = ${n(x3)} into your finished rule.`],
  solution: `m = (${n(y2)} − ${n(y1)}) ÷ (${n(x2)} − ${n(x1)}) = ${n(rise)} ÷ ${n(run)} = ${n(m)} mL per hour. Using ${vec([x1, y1])}: ${n(y1)} = ${n(m)} × ${n(x1)} + b = ${n(m * x1)} + b, so b = ${n(y1)} − ${par(m * x1)} = ${n(y1)} + ${n(-m * x1)} = ${n(b)} mL. The rule is y = ${n(m)}x + ${n(b)}. Check with ${vec([x2, y2])}: ${n(m)} × ${n(x2)} + ${n(b)} = ${n(m * x2)} + ${n(b)} = ${n(y2)}. After ${n(x3)} hours: y = ${n(m)} × ${n(x3)} + ${n(b)} = ${n(m * x3)} + ${n(b)} = ${n(y3)} mL.`,
  guidance: [
   { prompt: `Rise ÷ run between the two readings: (${n(y2)} − ${n(y1)}) ÷ (${n(x2)} − ${n(x1)}). What is m?`, answer: [m], explanation: `The rise is ${n(rise)} and the run is ${n(run)}, so m = ${n(rise)} ÷ ${n(run)} = ${n(m)} mL per hour.` },
   { prompt: `${n(y1)} = ${n(m)} × ${n(x1)} + b, which is ${n(y1)} = ${n(m * x1)} + b. What is b?`, answer: [b], explanation: `b = ${n(y1)} − ${par(m * x1)} = ${n(y1)} + ${n(-m * x1)} = ${n(b)}. The bag held ${n(b)} mL when it was hung.` },
   { prompt: `Put x = ${n(x3)} into y = ${n(m)}x + ${n(b)}: ${n(m)} × ${n(x3)} + ${n(b)}. What is y?`, answer: [y3], explanation: `${n(m)} × ${n(x3)} = ${n(m * x3)}, and ${n(m * x3)} + ${n(b)} = ${n(y3)} mL.` }
  ] }; }
});

/* q23d: the two points are given in words (west and south are negative, q19), one each side of the depot, so the
   run crosses zero and the slope may be negative; the finished rule then places a valve. */
add({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q19',
 title: 'The pipeline past the depot',
 brief: 'A straight pipeline has to be drawn on the map room grid from two surveyed points, and a valve must be placed on it.',
 prompt: 'On the map room grid the depot is the origin (0, 0); x counts kilometres east and y counts kilometres north. A straight pipeline passes the well, which is 4 km west and 9 km north of the depot, and the pump house, which is 2 km east and 3 km south of the depot. Find the pipeline’s equation in the form y = mx + b: enter m, then b. A valve must sit on the pipeline 5 km east of the depot: enter the valve’s y (negative if it is south of the depot).',
 answer: [-2, 1, -9], labels: ['slope m', 'b', 'valve y'], tolerance: 0.001,
 hints: [
  'West and south are the negative directions: a place west of the depot has a negative x, and a place south of it has a negative y. Write the well and the pump house as points (x, y) first.',
  'm = rise ÷ run between the two points, both taken in the same order. Then put one point and your m into y = mx + b and solve for b. For the valve, put x = 5 into your finished rule.'
 ],
 solution: 'The well is at (−4, 9) and the pump house is at (2, −3). m = (−3 − 9) ÷ (2 − (−4)) = −12 ÷ 6 = −2. Using the pump house (2, −3): −3 = −2 × 2 + b = −4 + b, so b = −3 − (−4) = −3 + 4 = 1. The pipeline is y = −2x + 1. Check with the well: −2 × (−4) + 1 = 8 + 1 = 9. Valve: y = −2 × 5 + 1 = −10 + 1 = −9, so the valve is 9 km south of the depot.',
 guidance: [
  { prompt: 'The well is 4 km west and 9 km north of the depot. Enter its x, then its y.', answer: [-4, 9], labels: ['well x', 'well y'], explanation: 'West makes x negative and north makes y positive: the well is at (−4, 9). In the same way the pump house is at (2, −3).' },
  { prompt: 'From the well (−4, 9) to the pump house (2, −3): rise ÷ run = (−3 − 9) ÷ (2 − (−4)). What is m?', answer: [-2], labels: ['slope m'], explanation: 'The rise is −12 and the run is 2 + 4 = 6, so m = −12 ÷ 6 = −2.' },
  { prompt: 'Put the pump house into y = mx + b: −3 = −2 × 2 + b, which is −3 = −4 + b. What is b?', answer: [1], labels: ['b'], explanation: 'b = −3 − (−4) = −3 + 4 = 1, so the pipeline is y = −2x + 1.' },
  { prompt: 'The valve is at x = 5. What is y = −2 × 5 + 1?', answer: [-9], labels: ['valve y'], explanation: '−2 × 5 = −10, and −10 + 1 = −9: the valve is 9 km south of the depot.' }
 ]
}, {
 canonical: { a: 4, c: 2, m: -2, b: 1, k: 3 },
 /* The well is a km west and the pump house c km east. No point lies on the east–west line (y is never 0),
    b is never 0, and the valve is k km further east than the pump house. */
 draw: R => { const a = R.int(2, 5), c = R.int(2, 5), k = R.int(1, 3), m = R.pick([-4, -3, -2, 2, 3, 4]);
  return { a, c, m, b: R.except(-6, 6, [0, m * a, -m * c, -m * (c + k)]), k }; },
 build: ({ a, c, m, b, k }) => { const x1 = -a, x2 = c, x3 = c + k, y1 = m * x1 + b, y2 = m * x2 + b, y3 = m * x3 + b, rise = y2 - y1, run = x2 - x1,
   bStep = m < 0 ? ` = ${n(y2)} + ${n(-m * x2)}` : ''; return {
  prompt: `On the map room grid the depot is the origin (0, 0); x counts kilometres east and y counts kilometres north. A straight pipeline passes the well, which is ${n(a)} km west and ${ns(y1)} of the depot, and the pump house, which is ${n(c)} km east and ${ns(y2)} of the depot. Find the pipeline’s equation in the form y = mx + b: enter m, then b. A valve must sit on the pipeline ${n(x3)} km east of the depot: enter the valve’s y (negative if it is south of the depot).`,
  answer: [m, b, y3],
  hints: ['West and south are the negative directions: a place west of the depot has a negative x, and a place south of it has a negative y. Write the well and the pump house as points (x, y) first.', `m = rise ÷ run between the two points, both taken in the same order. Then put one point and your m into y = mx + b and solve for b. For the valve, put x = ${n(x3)} into your finished rule.`],
  solution: `The well is at ${vec([x1, y1])} and the pump house is at ${vec([x2, y2])}. m = (${n(y2)} − ${par(y1)}) ÷ (${n(x2)} − ${par(x1)}) = ${n(rise)} ÷ ${n(run)} = ${n(m)}. Using the pump house ${vec([x2, y2])}: ${n(y2)} = ${n(m)} × ${n(x2)} + b = ${n(m * x2)} + b, so b = ${n(y2)} − ${par(m * x2)}${bStep} = ${n(b)}. The pipeline is y = ${n(m)}x ${term(b)}. Check with the well: ${n(m)} × ${par(x1)} ${term(b)} = ${n(m * x1)} ${term(b)} = ${n(y1)}. Valve: y = ${n(m)} × ${n(x3)} ${term(b)} = ${n(m * x3)} ${term(b)} = ${n(y3)}, so the valve is ${ns(y3)} of the depot.`,
  guidance: [
   { prompt: `The well is ${n(a)} km west and ${ns(y1)} of the depot. Enter its x, then its y.`, answer: [x1, y1], explanation: `West makes x negative${y1 < 0 ? ' and south makes y negative' : ' and north makes y positive'}: the well is at ${vec([x1, y1])}. In the same way the pump house is at ${vec([x2, y2])}.` },
   { prompt: `From the well ${vec([x1, y1])} to the pump house ${vec([x2, y2])}: rise ÷ run = (${n(y2)} − ${par(y1)}) ÷ (${n(x2)} − ${par(x1)}). What is m?`, answer: [m], explanation: `The rise is ${n(rise)} and the run is ${n(x2)} + ${n(a)} = ${n(run)}, so m = ${n(rise)} ÷ ${n(run)} = ${n(m)}.` },
   { prompt: `Put the pump house into y = mx + b: ${n(y2)} = ${n(m)} × ${n(x2)} + b, which is ${n(y2)} = ${n(m * x2)} + b. What is b?`, answer: [b], explanation: `b = ${n(y2)} − ${par(m * x2)}${bStep} = ${n(b)}, so the pipeline is y = ${n(m)}x ${term(b)}.` },
   { prompt: `The valve is at x = ${n(x3)}. What is y = ${n(m)} × ${n(x3)} ${term(b)}?`, answer: [y3], explanation: `${n(m)} × ${n(x3)} = ${n(m * x3)}, and ${n(m * x3)} ${term(b)} = ${n(y3)}: the valve is ${ns(y3)} of the depot.` }
  ] }; }
});

/* ───────────── q24 Three-dimensional coordinates and signed displacements ───────────── */

/* q24b: the moves are told in words (west, south and down are negative) and z stays below the surface throughout. */
add({
 id: 'q24b', parent: 'q24', kind: 'setting',
 title: 'Logging the reef dive',
 brief: 'A diver has swum two stretches along a reef, and the dive log needs her final position, depth included.',
 prompt: 'A dive log gives positions as (x, y, z) in metres from the dive boat: x east, y north and z up, so a point below the surface has a negative z. A diver starts at the anchor, at (2, 1, −3). She swims 4 m east, 3 m south and 6 m down, and then 1 m west, 5 m north and 4 m up. Enter her final x, y and z.',
 answer: [5, 3, -5], labels: ['final x', 'final y', 'final z'], tolerance: 0.001,
 hints: [
  'Write each swim as three signed changes in the order (x, y, z): east, north and up are positive; west, south and down are negative.',
  'Then add matching positions only: the starting x and the two x changes together, then the same for y and for z.'
 ],
 solution: 'The first swim is the displacement (4, −3, −6) and the second is (−1, 5, 4). x: 2 + 4 + (−1) = 5. y: 1 + (−3) + 5 = 3. z: −3 + (−6) + 4 = −5. She ends at (5, 3, −5), which is 5 m below the surface.',
 guidance: [
  { prompt: 'The first swim is 4 m east, 3 m south and 6 m down. Write it as a displacement: enter its x, y and z changes, with signs.', answer: [4, -3, -6], labels: ['x change', 'y change', 'z change'], explanation: 'East, north and up are positive; west, south and down are negative. The first swim is (4, −3, −6).' },
  { prompt: 'The second swim is 1 m west, 5 m north and 4 m up. Enter its x, y and z changes, with signs.', answer: [-1, 5, 4], labels: ['x change', 'y change', 'z change'], explanation: 'The second swim is (−1, 5, 4).' },
  { prompt: 'Start at (2, 1, −3) and add (4, −3, −6) and then (−1, 5, 4), position by position. Enter the final x, y and z.', answer: [5, 3, -5], labels: ['final x', 'final y', 'final z'], explanation: 'x: 2 + 4 + (−1) = 5. y: 1 + (−3) + 5 = 3. z: −3 + (−6) + 4 = −5. She ends at (5, 3, −5).' }
 ]
}, {
 canonical: { s: [2, 1, -3], d1: [4, -3, -6], d2: [-1, 5, 4] },
 /* The diver is 1 m to 20 m below the surface at every stage, and no part of a swim is 0. */
 draw: R => { const s = [R.int(-6, 6), R.int(-6, 6), -R.int(2, 8)], d1 = [R.nz(-9, 9), R.nz(-9, 9), 0], d2 = [R.nz(-9, 9), R.nz(-9, 9), 0];
  d1[2] = R.except(Math.max(-9, -20 - s[2]), Math.min(9, -1 - s[2]), [0]); const z = s[2] + d1[2];
  d2[2] = R.except(Math.max(-9, -20 - z), Math.min(9, -1 - z), [0]); return { s, d1, d2 }; },
 build: ({ s, d1, d2 }) => { const f = s.map((v, i) => v + d1[i] + d2[i]), row = i => sum([s[i], d1[i], d2[i]]); return {
  prompt: `A dive log gives positions as (x, y, z) in metres from the dive boat: x east, y north and z up, so a point below the surface has a negative z. A diver starts at the anchor, at ${vec(s)}. She swims ${swim(d1)}, and then ${swim(d2)}. Enter her final x, y and z.`,
  answer: f,
  hints: ['Write each swim as three signed changes in the order (x, y, z): east, north and up are positive; west, south and down are negative.', 'Then add matching positions only: the starting x and the two x changes together, then the same for y and for z.'],
  solution: `The first swim is the displacement ${vec(d1)} and the second is ${vec(d2)}. x: ${row(0)} = ${n(f[0])}. y: ${row(1)} = ${n(f[1])}. z: ${row(2)} = ${n(f[2])}. She ends at ${vec(f)}, which is ${n(-f[2])} m below the surface.`,
  guidance: [
   { prompt: `The first swim is ${swim(d1)}. Write it as a displacement: enter its x, y and z changes, with signs.`, answer: d1, explanation: `East, north and up are positive; west, south and down are negative. The first swim is ${vec(d1)}.` },
   { prompt: `The second swim is ${swim(d2)}. Enter its x, y and z changes, with signs.`, answer: d2, explanation: `The second swim is ${vec(d2)}.` },
   { prompt: `Start at ${vec(s)} and add ${vec(d1)} and then ${vec(d2)}, position by position. Enter the final x, y and z.`, answer: f, explanation: `x: ${row(0)} = ${n(f[0])}. y: ${row(1)} = ${n(f[1])}. z: ${row(2)} = ${n(f[2])}. She ends at ${vec(f)}.` }
  ] }; }
});

/* q24c: the unknown is a displacement, not a position: add the two moves, then find the move that undoes the total. */
add({
 id: 'q24c', parent: 'q24', kind: 'applied',
 title: 'Sending the stacker robot home',
 brief: 'A warehouse robot has made two moves away from its charging dock and now needs one move that takes it straight back.',
 prompt: 'A stacker robot in a warehouse logs each move as a displacement (x, y, z) in metres: x east along the aisle, y north across the aisles and z up. From its charging dock on the floor it moves (6, −2, 3) to collect a box and then (−9, 7, 2) to put the box on its shelf. Enter the one displacement that takes the robot straight back to its dock: its x, y and z.',
 answer: [3, -5, -5], labels: ['x of the trip back', 'y of the trip back', 'z of the trip back'], tolerance: 0.001,
 hints: [
  'First add the two moves position by position. That total is where the robot is now, measured from its dock.',
  'The trip back must undo the total in every position: its x added to the total x must make 0, and the same for y and z. A change of 20 is undone by −20, and a change of −20 by 20.'
 ],
 solution: 'Total of the two moves: x: 6 + (−9) = −3. y: −2 + 7 = 5. z: 3 + 2 = 5. So the robot is (−3, 5, 5) from its dock. The trip back undoes each part, so it is (3, −5, −5). Check: −3 + 3 = 0, 5 + (−5) = 0 and 5 + (−5) = 0.',
 guidance: [
  { prompt: 'Add the two moves (6, −2, 3) and (−9, 7, 2) position by position. Enter the total x, y and z.', answer: [-3, 5, 5], labels: ['total x', 'total y', 'total z'], explanation: 'x: 6 + (−9) = −3. y: −2 + 7 = 5. z: 3 + 2 = 5. The robot is (−3, 5, 5) from its dock.' },
  { prompt: 'The robot is (−3, 5, 5) from its dock. What must be added to each of the three numbers to bring it back to 0? Enter the x, y and z of the trip back.', answer: [3, -5, -5], labels: ['x of the trip back', 'y of the trip back', 'z of the trip back'], explanation: 'Each part is undone by its opposite: (3, −5, −5). For x, −3 + 3 = 0.' }
 ]
}, {
 canonical: { d1: [6, -2, 3], d2: [-9, 7, 2] },
 /* The robot stays above the floor (z at least 1 after each move), and the total move is non-zero in every position,
    so entering the total itself instead of its opposite is wrong in all three boxes. */
 draw: R => { const d1 = [R.nz(-8, 8), R.nz(-8, 8), R.int(1, 6)]; return { d1, d2: [R.except(-9, 9, [0, -d1[0]]), R.except(-9, 9, [0, -d1[1]]), R.except(1 - d1[2], 5, [0])] }; },
 build: ({ d1, d2 }) => { const t = d1.map((v, i) => v + d2[i]), back = t.map(v => -v), row = i => sum([d1[i], d2[i]]); return {
  prompt: `A stacker robot in a warehouse logs each move as a displacement (x, y, z) in metres: x east along the aisle, y north across the aisles and z up. From its charging dock on the floor it moves ${vec(d1)} to collect a box and then ${vec(d2)} to put the box on its shelf. Enter the one displacement that takes the robot straight back to its dock: its x, y and z.`,
  answer: back,
  hints: ['First add the two moves position by position. That total is where the robot is now, measured from its dock.', 'The trip back must undo the total in every position: its x added to the total x must make 0, and the same for y and z. A change of 20 is undone by −20, and a change of −20 by 20.'],
  solution: `Total of the two moves: x: ${row(0)} = ${n(t[0])}. y: ${row(1)} = ${n(t[1])}. z: ${row(2)} = ${n(t[2])}. So the robot is ${vec(t)} from its dock. The trip back undoes each part, so it is ${vec(back)}. Check: ${sum([t[0], back[0]])} = 0, ${sum([t[1], back[1]])} = 0 and ${sum([t[2], back[2]])} = 0.`,
  guidance: [
   { prompt: `Add the two moves ${vec(d1)} and ${vec(d2)} position by position. Enter the total x, y and z.`, answer: t, explanation: `x: ${row(0)} = ${n(t[0])}. y: ${row(1)} = ${n(t[1])}. z: ${row(2)} = ${n(t[2])}. The robot is ${vec(t)} from its dock.` },
   { prompt: `The robot is ${vec(t)} from its dock. What must be added to each of the three numbers to bring it back to 0? Enter the x, y and z of the trip back.`, answer: back, explanation: `Each part is undone by its opposite: ${vec(back)}. For x, ${sum([t[0], back[0]])} = 0.` }
  ] }; }
});

/* q24d: three legs, then the map distance from the start (x and y only), which is a whole number because the total
   east–west and north–south changes are the short sides of a 3-4-5, 6-8-10 or 5-12-13 triangle (q20). */
add({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q20',
 title: 'Three legs on the hill walk',
 brief: 'A hiker’s GPS has logged three legs of a hill walk, and she wants to know where she is and how far from the hut that is on the map.',
 prompt: 'A hiker’s GPS logs each leg of a walk as a displacement (x, y, z) in units of 100 m: east, north and up. She starts at the hut, at (−2, 1, 4), and walks the legs (5, 3, 2), (−4, 6, −1) and (−9, −3, 3). Enter her final x, y and z. Then enter the straight-line distance on the flat map, which uses x and y only, from the hut to the point where she ends, in the same units.',
 answer: [-10, 7, 8, 10], labels: ['final x', 'final y', 'final z', 'map distance from the hut'], tolerance: 0.001,
 hints: [
  'Add matching positions only: all the x numbers together, then all the y numbers, then all the z numbers.',
  'For the map distance, find the east–west gap and the north–south gap between the hut and the end point. Multiply each gap by itself, add the two results and take the square root. The heights play no part.'
 ],
 solution: 'x: −2 + 5 + (−4) + (−9) = −10. y: 1 + 3 + 6 + (−3) = 7. z: 4 + 2 + (−1) + 3 = 8. She ends at (−10, 7, 8). On the map the hut is at (−2, 1) and the end point is at (−10, 7). East–west gap: −2 − (−10) = 8. North–south gap: 7 − 1 = 6. 8 × 8 + 6 × 6 = 64 + 36 = 100, and 10 × 10 = 100, so the map distance is 10 units, which is 1000 m.',
 guidance: [
  { prompt: 'Final x: what is −2 + 5 + (−4) + (−9)? Final y: what is 1 + 3 + 6 + (−3)? Enter x, then y.', answer: [-10, 7], labels: ['final x', 'final y'], explanation: 'x: −2 + 5 + (−4) + (−9) = −10. y: 1 + 3 + 6 + (−3) = 7.' },
  { prompt: 'Final z: what is 4 + 2 + (−1) + 3?', answer: [8], labels: ['final z'], explanation: '4 + 2 + (−1) + 3 = 8, so she ends at (−10, 7, 8).' },
  { prompt: 'On the map the hut is at (−2, 1) and the end point is at (−10, 7). Enter the east–west gap between them, then the north–south gap. A gap is never negative.', answer: [8, 6], labels: ['east–west gap', 'north–south gap'], explanation: 'East–west: −2 − (−10) = 8. North–south: 7 − 1 = 6.' },
  { prompt: '8 × 8 + 6 × 6 = 100. What number times itself gives 100?', answer: [10], labels: ['map distance'], explanation: '10 × 10 = 100, so the map distance is 10 units of 100 m.' }
 ]
}, {
 canonical: { s: [-2, 1, 4], d1: [5, 3, 2], d2: [-4, 6, -1], d3: [-9, -3, 3] },
 /* The three legs add up to (±a, ±b) with a, b, h a whole-number right triangle. Every leg part is non-zero and at
    most 9 in size, and the height z stays at 1 or more. */
 draw: R => { const [a, b] = R.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]), T = [R.bool() ? a : -a, R.bool() ? b : -b];
  const s = [R.int(-5, 5), R.int(-5, 5), R.int(2, 9)], d1 = [0, 0, 0], d2 = [0, 0, 0], d3 = [0, 0, 0];
  for (let i = 0; i < 2; i++) { d1[i] = R.nz(-5, 5); const rest = T[i] - d1[i], ok = [];
   for (let v = -9; v <= 9; v++) if (v !== 0 && rest - v !== 0 && Math.abs(rest - v) <= 9) ok.push(v);
   d2[i] = R.pick(ok); d3[i] = rest - d2[i]; }
  let z = s[2]; for (const d of [d1, d2, d3]) { d[2] = R.except(Math.max(-3, 1 - z), 3, [0]); z += d[2]; }
  return { s, d1, d2, d3 }; },
 build: ({ s, d1, d2, d3 }) => { const f = s.map((v, i) => v + d1[i] + d2[i] + d3[i]), row = i => sum([s[i], d1[i], d2[i], d3[i]]),
   gx = Math.abs(f[0] - s[0]), gy = Math.abs(f[1] - s[1]), sq = gx * gx + gy * gy, dist = Math.round(Math.sqrt(sq)),
   gap = (u, v) => `${n(Math.max(u, v))} − ${par(Math.min(u, v))}`; return {
  prompt: `A hiker’s GPS logs each leg of a walk as a displacement (x, y, z) in units of 100 m: east, north and up. She starts at the hut, at ${vec(s)}, and walks the legs ${vec(d1)}, ${vec(d2)} and ${vec(d3)}. Enter her final x, y and z. Then enter the straight-line distance on the flat map, which uses x and y only, from the hut to the point where she ends, in the same units.`,
  answer: [f[0], f[1], f[2], dist],
  hints: ['Add matching positions only: all the x numbers together, then all the y numbers, then all the z numbers.', 'For the map distance, find the east–west gap and the north–south gap between the hut and the end point. Multiply each gap by itself, add the two results and take the square root. The heights play no part.'],
  solution: `x: ${row(0)} = ${n(f[0])}. y: ${row(1)} = ${n(f[1])}. z: ${row(2)} = ${n(f[2])}. She ends at ${vec(f)}. On the map the hut is at ${vec([s[0], s[1]])} and the end point is at ${vec([f[0], f[1]])}. East–west gap: ${gap(f[0], s[0])} = ${n(gx)}. North–south gap: ${gap(f[1], s[1])} = ${n(gy)}. ${n(gx)} × ${n(gx)} + ${n(gy)} × ${n(gy)} = ${n(gx * gx)} + ${n(gy * gy)} = ${n(sq)}, and ${n(dist)} × ${n(dist)} = ${n(sq)}, so the map distance is ${n(dist)} units, which is ${n(dist * 100)} m.`,
  guidance: [
   { prompt: `Final x: what is ${row(0)}? Final y: what is ${row(1)}? Enter x, then y.`, answer: [f[0], f[1]], explanation: `x: ${row(0)} = ${n(f[0])}. y: ${row(1)} = ${n(f[1])}.` },
   { prompt: `Final z: what is ${row(2)}?`, answer: [f[2]], explanation: `${row(2)} = ${n(f[2])}, so she ends at ${vec(f)}.` },
   { prompt: `On the map the hut is at ${vec([s[0], s[1]])} and the end point is at ${vec([f[0], f[1]])}. Enter the east–west gap between them, then the north–south gap. A gap is never negative.`, answer: [gx, gy], explanation: `East–west: ${gap(f[0], s[0])} = ${n(gx)}. North–south: ${gap(f[1], s[1])} = ${n(gy)}.` },
   { prompt: `${n(gx)} × ${n(gx)} + ${n(gy)} × ${n(gy)} = ${n(sq)}. What number times itself gives ${n(sq)}?`, answer: [dist], explanation: `${n(dist)} × ${n(dist)} = ${n(sq)}, so the map distance is ${n(dist)} units of 100 m.` }
  ] }; }
});

/* ───────────── q25 Where two lines meet ───────────── */

/* q25b: two hire shops, a low fee with a high daily price against a high fee with a low daily price. */
add({
 id: 'q25b', parent: 'q25', kind: 'setting',
 title: 'Hiring the floor sander',
 brief: 'Two shops hire out the same floor sander on different terms, and the customer wants to know when they cost the same.',
 prompt: 'Two shops hire out the same floor sander. Shop A charges a $20 fee and $14 a day, so hiring it for x days costs y = 14x + 20 dollars. Shop B charges a $50 fee and $9 a day, so y = 9x + 50. Enter x, the number of days for which the two shops cost the same, then y, that cost in dollars.',
 answer: [6, 104], labels: ['x (days)', 'y (dollars)'], tolerance: 0.001,
 hints: [
  'The costs match when both rules give the same y: 14x + 20 = 9x + 50.',
  'Take 9x from both sides, then take 20 from both sides. That leaves a number of x on the left and a plain number on the right.'
 ],
 solution: '14x + 20 = 9x + 50. Take 9x from both sides: 5x + 20 = 50. Take 20 from both sides: 5x = 30, so x = 30 ÷ 5 = 6 days. Then y = 14 × 6 + 20 = 104 dollars. Check with shop B: 9 × 6 + 50 = 104 dollars. For a shorter hire shop A is cheaper, and for a longer one shop B is.',
 guidance: [
  { prompt: 'Start from 14x + 20 = 9x + 50. Take 9x from both sides: how many x are left on the left? Then take 20 from both sides: what plain number is left on the right? Enter the two numbers in that order.', answer: [5, 30], labels: ['x terms left', 'plain number'], explanation: '14x − 9x = 5x, and 50 − 20 = 30, so 5x = 30.' },
  { prompt: '5x = 30. What is x?', answer: [6], labels: ['x (days)'], explanation: 'x = 30 ÷ 5 = 6. For 6 days the two shops cost the same.' },
  { prompt: 'Put x = 6 into shop A’s rule, y = 14x + 20. What is y?', answer: [104], labels: ['y (dollars)'], explanation: 'y = 14 × 6 + 20 = 104 dollars. Shop B gives the same: 9 × 6 + 50 = 104 dollars.' }
 ]
}, {
 canonical: { b1: 20, m1: 14, b2: 50, m2: 9 },
 /* The daily prices differ by 2 to 6 dollars (never 1, so the last step is a real division); they match after 2 to 9 days. */
 draw: R => { const x0 = R.int(2, 9), m2 = R.int(8, 20), d = R.int(2, 6), b1 = 5 * R.int(2, 8); return { b1, m1: m2 + d, b2: b1 + d * x0, m2 }; },
 build: ({ b1, m1, b2, m2 }) => { const d = m1 - m2, B = b2 - b1, x = B / d, y = m1 * x + b1; return {
  prompt: `Two shops hire out the same floor sander. Shop A charges a $${n(b1)} fee and $${n(m1)} a day, so hiring it for x days costs y = ${n(m1)}x + ${n(b1)} dollars. Shop B charges a $${n(b2)} fee and $${n(m2)} a day, so y = ${n(m2)}x + ${n(b2)}. Enter x, the number of days for which the two shops cost the same, then y, that cost in dollars.`,
  answer: [x, y],
  hints: [`The costs match when both rules give the same y: ${n(m1)}x + ${n(b1)} = ${n(m2)}x + ${n(b2)}.`, `Take ${n(m2)}x from both sides, then take ${n(b1)} from both sides. That leaves a number of x on the left and a plain number on the right.`],
  solution: `${n(m1)}x + ${n(b1)} = ${n(m2)}x + ${n(b2)}. Take ${n(m2)}x from both sides: ${n(d)}x + ${n(b1)} = ${n(b2)}. Take ${n(b1)} from both sides: ${n(d)}x = ${n(B)}, so x = ${n(B)} ÷ ${n(d)} = ${n(x)} days. Then y = ${n(m1)} × ${n(x)} + ${n(b1)} = ${n(y)} dollars. Check with shop B: ${n(m2)} × ${n(x)} + ${n(b2)} = ${n(y)} dollars. For a shorter hire shop A is cheaper, and for a longer one shop B is.`,
  guidance: [
   { prompt: `Start from ${n(m1)}x + ${n(b1)} = ${n(m2)}x + ${n(b2)}. Take ${n(m2)}x from both sides: how many x are left on the left? Then take ${n(b1)} from both sides: what plain number is left on the right? Enter the two numbers in that order.`, answer: [d, B], explanation: `${n(m1)}x − ${n(m2)}x = ${n(d)}x, and ${n(b2)} − ${n(b1)} = ${n(B)}, so ${n(d)}x = ${n(B)}.` },
   { prompt: `${n(d)}x = ${n(B)}. What is x?`, answer: [x], explanation: `x = ${n(B)} ÷ ${n(d)} = ${n(x)}. For ${n(x)} days the two shops cost the same.` },
   { prompt: `Put x = ${n(x)} into shop A’s rule, y = ${n(m1)}x + ${n(b1)}. What is y?`, answer: [y], explanation: `y = ${n(m1)} × ${n(x)} + ${n(b1)} = ${n(y)} dollars. Shop B gives the same: ${n(m2)} × ${n(x)} + ${n(b2)} = ${n(y)} dollars.` }
  ] }; }
});

/* q25c: the two rules are not given; after the crossing, the gap between the lines at a later x is the saving. */
add({
 id: 'q25c', parent: 'q25', kind: 'applied',
 title: 'The cheap printer and its ink',
 brief: 'One printer is cheap to buy but dear to feed with ink, the other is the reverse, and a shopper wants to know which costs less in the long run.',
 prompt: 'Printer A costs $60 and each ink cartridge for it costs $15. Printer B costs $100 and each of its cartridges costs $7. Let x be the number of cartridges bought and y the total cost in dollars, printer included. Enter the x at which the two printers have cost the same, then that cost y. Then enter how many dollars cheaper printer B is than printer A once 9 cartridges have been bought.',
 answer: [5, 135, 32], labels: ['x (cartridges)', 'y (dollars)', 'dollars cheaper with printer B'], tolerance: 0.001,
 hints: [
  'Write a rule y = mx + b for each printer: the price of a cartridge multiplies x, and the price of the printer is the starting value.',
  'Set the two rules equal and solve for x, then put x into either rule to get y. For the last answer, work out each printer’s total at x = 9 and subtract.'
 ],
 solution: 'Printer A: y = 15x + 60. Printer B: y = 7x + 100. Equal cost: 15x + 60 = 7x + 100. Take 7x from both sides: 8x + 60 = 100. Take 60 from both sides: 8x = 40, so x = 40 ÷ 8 = 5 cartridges. Then y = 15 × 5 + 60 = 135 dollars; check with printer B: 7 × 5 + 100 = 135. After 9 cartridges printer A has cost 15 × 9 + 60 = 195 dollars and printer B has cost 7 × 9 + 100 = 163 dollars, so printer B is 195 − 163 = 32 dollars cheaper.',
 guidance: [
  { prompt: 'Printer A’s total is y = 15x + 60 and printer B’s is y = 7x + 100. Setting them equal and taking 7x and 60 from both sides leaves 8x = 40. What is x?', answer: [5], labels: ['x (cartridges)'], explanation: 'x = 40 ÷ 8 = 5. After 5 cartridges the two printers have cost the same.' },
  { prompt: 'Put x = 5 into printer A’s rule, y = 15x + 60. What is y?', answer: [135], labels: ['y (dollars)'], explanation: 'y = 15 × 5 + 60 = 135 dollars. Printer B gives the same: 7 × 5 + 100 = 135 dollars.' },
  { prompt: 'After 9 cartridges printer A has cost 15 × 9 + 60 dollars and printer B has cost 7 × 9 + 100 dollars. Work out both totals. How many dollars cheaper is printer B?', answer: [32], labels: ['dollars cheaper'], explanation: 'Printer A: 135 + 60 = 195. Printer B: 63 + 100 = 163. 195 − 163 = 32 dollars.' }
 ]
}, {
 canonical: { b1: 60, m1: 15, b2: 100, m2: 7, N: 9 },
 /* Printer A is cheaper to buy and dearer per cartridge by 2 to 8 dollars. The costs match at 3 to 9 cartridges,
    and N is 2 to 6 cartridges beyond that, so printer B really is cheaper there. */
 draw: R => { const x0 = R.int(3, 9), m2 = R.int(6, 15), d = R.int(2, 8), b1 = 10 * R.int(4, 9); return { b1, m1: m2 + d, b2: b1 + d * x0, m2, N: x0 + R.int(2, 6) }; },
 build: ({ b1, m1, b2, m2, N }) => { const d = m1 - m2, B = b2 - b1, x = B / d, y = m1 * x + b1, yA = m1 * N + b1, yB = m2 * N + b2, save = yA - yB; return {
  prompt: `Printer A costs $${n(b1)} and each ink cartridge for it costs $${n(m1)}. Printer B costs $${n(b2)} and each of its cartridges costs $${n(m2)}. Let x be the number of cartridges bought and y the total cost in dollars, printer included. Enter the x at which the two printers have cost the same, then that cost y. Then enter how many dollars cheaper printer B is than printer A once ${n(N)} cartridges have been bought.`,
  answer: [x, y, save],
  hints: ['Write a rule y = mx + b for each printer: the price of a cartridge multiplies x, and the price of the printer is the starting value.', `Set the two rules equal and solve for x, then put x into either rule to get y. For the last answer, work out each printer’s total at x = ${n(N)} and subtract.`],
  solution: `Printer A: y = ${n(m1)}x + ${n(b1)}. Printer B: y = ${n(m2)}x + ${n(b2)}. Equal cost: ${n(m1)}x + ${n(b1)} = ${n(m2)}x + ${n(b2)}. Take ${n(m2)}x from both sides: ${n(d)}x + ${n(b1)} = ${n(b2)}. Take ${n(b1)} from both sides: ${n(d)}x = ${n(B)}, so x = ${n(B)} ÷ ${n(d)} = ${n(x)} cartridges. Then y = ${n(m1)} × ${n(x)} + ${n(b1)} = ${n(y)} dollars; check with printer B: ${n(m2)} × ${n(x)} + ${n(b2)} = ${n(y)}. After ${n(N)} cartridges printer A has cost ${n(m1)} × ${n(N)} + ${n(b1)} = ${n(yA)} dollars and printer B has cost ${n(m2)} × ${n(N)} + ${n(b2)} = ${n(yB)} dollars, so printer B is ${n(yA)} − ${n(yB)} = ${n(save)} dollars cheaper.`,
  guidance: [
   { prompt: `Printer A’s total is y = ${n(m1)}x + ${n(b1)} and printer B’s is y = ${n(m2)}x + ${n(b2)}. Setting them equal and taking ${n(m2)}x and ${n(b1)} from both sides leaves ${n(d)}x = ${n(B)}. What is x?`, answer: [x], explanation: `x = ${n(B)} ÷ ${n(d)} = ${n(x)}. After ${n(x)} cartridges the two printers have cost the same.` },
   { prompt: `Put x = ${n(x)} into printer A’s rule, y = ${n(m1)}x + ${n(b1)}. What is y?`, answer: [y], explanation: `y = ${n(m1)} × ${n(x)} + ${n(b1)} = ${n(y)} dollars. Printer B gives the same: ${n(m2)} × ${n(x)} + ${n(b2)} = ${n(y)} dollars.` },
   { prompt: `After ${n(N)} cartridges printer A has cost ${n(m1)} × ${n(N)} + ${n(b1)} dollars and printer B has cost ${n(m2)} × ${n(N)} + ${n(b2)} dollars. Work out both totals. How many dollars cheaper is printer B?`, answer: [save], explanation: `Printer A: ${n(m1 * N)} + ${n(b1)} = ${n(yA)}. Printer B: ${n(m2 * N)} + ${n(b2)} = ${n(yB)}. ${n(yA)} − ${n(yB)} = ${n(save)} dollars.` }
  ] }; }
});

/* q25d: each runner's line comes from two logged positions (slope = rise ÷ run, q21; the minute-0 mark is b);
   the faster runner starts behind, and the lines cross where she catches up. */
add({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q21',
 title: 'Catching up on the trail',
 brief: 'Two runners are on the same trail at different speeds, and the race marshal wants to know when and where the faster one catches up.',
 prompt: 'Two runners are on the same long, straight trail, and a drone logs how far each of them is from the start line. At minute 0 Asha is at the 400 m mark, and at minute 4 she is at the 1200 m mark. At minute 0 Ben is at the 1000 m mark, and at minute 4 he is at the 1600 m mark. Each runs at a steady speed. With x for the minutes and y for the metres from the start line, each runner follows a line y = mx + b. Enter Asha’s slope, then Ben’s slope, both in metres per minute. Then enter x, the minute when Asha catches up with Ben, and y, the mark where that happens. Type each number without commas.',
 answer: [200, 150, 12, 2800], labels: ['Asha’s slope (m per minute)', 'Ben’s slope (m per minute)', 'x (minutes)', 'y (metres)'], tolerance: 0.001,
 hints: [
  'A slope is rise ÷ run. Asha’s rise is 1200 − 400 metres over a run of 4 minutes. Find Ben’s slope in the same way.',
  'The mark at minute 0 is each runner’s b. Write both rules y = mx + b, set them equal and solve for x. Then put x into either rule to get y.'
 ],
 solution: 'Asha: slope = (1200 − 400) ÷ 4 = 800 ÷ 4 = 200 m per minute, and b = 400, so y = 200x + 400. Ben: slope = (1600 − 1000) ÷ 4 = 600 ÷ 4 = 150 m per minute, and b = 1000, so y = 150x + 1000. Same mark: 200x + 400 = 150x + 1000. Take 150x from both sides: 50x + 400 = 1000. Take 400 from both sides: 50x = 600, so x = 600 ÷ 50 = 12 minutes. Then y = 200 × 12 + 400 = 2800 m. Check with Ben: 150 × 12 + 1000 = 2800 m.',
 guidance: [
  { prompt: 'Asha went from the 400 m mark to the 1200 m mark in 4 minutes. What is her slope, (1200 − 400) ÷ 4?', answer: [200], labels: ['Asha’s slope'], explanation: '800 ÷ 4 = 200 m per minute. She starts at 400, so her rule is y = 200x + 400.' },
  { prompt: 'Ben went from the 1000 m mark to the 1600 m mark in 4 minutes. What is his slope, (1600 − 1000) ÷ 4?', answer: [150], labels: ['Ben’s slope'], explanation: '600 ÷ 4 = 150 m per minute. He starts at 1000, so his rule is y = 150x + 1000.' },
  { prompt: 'They are at the same mark when 200x + 400 = 150x + 1000. Taking 150x and 400 from both sides leaves 50x = 600. What is x?', answer: [12], labels: ['x (minutes)'], explanation: 'x = 600 ÷ 50 = 12. Asha catches up after 12 minutes.' },
  { prompt: 'Put x = 12 into Asha’s rule, y = 200x + 400. What is y?', answer: [2800], labels: ['y (metres)'], explanation: 'y = 200 × 12 + 400 = 2800 m. Ben’s rule gives the same: 150 × 12 + 1000 = 2800 m.' }
 ]
}, {
 canonical: { b1: 400, m1: 200, b2: 1000, m2: 150, t: 4 },
 /* Speeds are whole tens of metres per minute, 20 to 50 apart; Asha starts behind and catches up after 6 to 15
    minutes, always later than the second logged minute t. */
 draw: R => { const x0 = R.int(6, 15), m2 = 10 * R.int(12, 20), d = 10 * R.int(2, 5), b1 = 100 * R.int(1, 4); return { b1, m1: m2 + d, b2: b1 + d * x0, m2, t: R.int(2, 5) }; },
 build: ({ b1, m1, b2, m2, t }) => { const d = m1 - m2, B = b2 - b1, x = B / d, y = m1 * x + b1, p1 = m1 * t + b1, p2 = m2 * t + b2; return {
  prompt: `Two runners are on the same long, straight trail, and a drone logs how far each of them is from the start line. At minute 0 Asha is at the ${n(b1)} m mark, and at minute ${n(t)} she is at the ${n(p1)} m mark. At minute 0 Ben is at the ${n(b2)} m mark, and at minute ${n(t)} he is at the ${n(p2)} m mark. Each runs at a steady speed. With x for the minutes and y for the metres from the start line, each runner follows a line y = mx + b. Enter Asha’s slope, then Ben’s slope, both in metres per minute. Then enter x, the minute when Asha catches up with Ben, and y, the mark where that happens. Type each number without commas.`,
  answer: [m1, m2, x, y],
  hints: [`A slope is rise ÷ run. Asha’s rise is ${n(p1)} − ${n(b1)} metres over a run of ${n(t)} minutes. Find Ben’s slope in the same way.`, 'The mark at minute 0 is each runner’s b. Write both rules y = mx + b, set them equal and solve for x. Then put x into either rule to get y.'],
  solution: `Asha: slope = (${n(p1)} − ${n(b1)}) ÷ ${n(t)} = ${n(p1 - b1)} ÷ ${n(t)} = ${n(m1)} m per minute, and b = ${n(b1)}, so y = ${n(m1)}x + ${n(b1)}. Ben: slope = (${n(p2)} − ${n(b2)}) ÷ ${n(t)} = ${n(p2 - b2)} ÷ ${n(t)} = ${n(m2)} m per minute, and b = ${n(b2)}, so y = ${n(m2)}x + ${n(b2)}. Same mark: ${n(m1)}x + ${n(b1)} = ${n(m2)}x + ${n(b2)}. Take ${n(m2)}x from both sides: ${n(d)}x + ${n(b1)} = ${n(b2)}. Take ${n(b1)} from both sides: ${n(d)}x = ${n(B)}, so x = ${n(B)} ÷ ${n(d)} = ${n(x)} minutes. Then y = ${n(m1)} × ${n(x)} + ${n(b1)} = ${n(y)} m. Check with Ben: ${n(m2)} × ${n(x)} + ${n(b2)} = ${n(y)} m.`,
  guidance: [
   { prompt: `Asha went from the ${n(b1)} m mark to the ${n(p1)} m mark in ${n(t)} minutes. What is her slope, (${n(p1)} − ${n(b1)}) ÷ ${n(t)}?`, answer: [m1], explanation: `${n(p1 - b1)} ÷ ${n(t)} = ${n(m1)} m per minute. She starts at ${n(b1)}, so her rule is y = ${n(m1)}x + ${n(b1)}.` },
   { prompt: `Ben went from the ${n(b2)} m mark to the ${n(p2)} m mark in ${n(t)} minutes. What is his slope, (${n(p2)} − ${n(b2)}) ÷ ${n(t)}?`, answer: [m2], explanation: `${n(p2 - b2)} ÷ ${n(t)} = ${n(m2)} m per minute. He starts at ${n(b2)}, so his rule is y = ${n(m2)}x + ${n(b2)}.` },
   { prompt: `They are at the same mark when ${n(m1)}x + ${n(b1)} = ${n(m2)}x + ${n(b2)}. Taking ${n(m2)}x and ${n(b1)} from both sides leaves ${n(d)}x = ${n(B)}. What is x?`, answer: [x], explanation: `x = ${n(B)} ÷ ${n(d)} = ${n(x)}. Asha catches up after ${n(x)} minutes.` },
   { prompt: `Put x = ${n(x)} into Asha’s rule, y = ${n(m1)}x + ${n(b1)}. What is y?`, answer: [y], explanation: `y = ${n(m1)} × ${n(x)} + ${n(b1)} = ${n(y)} m. Ben’s rule gives the same: ${n(m2)} × ${n(x)} + ${n(b2)} = ${n(y)} m.` }
  ] }; }
});
})();
