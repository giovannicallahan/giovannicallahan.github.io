/* Foundations practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d ... q40b q40c q40d). Format and rules: docs/PACK-FORMAT.md, "Practice missions".
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/found/oracle-p8.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* Superscript and subscript digits for powers (3⁴) and logarithm bases (log₃). */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[d]).join('');
const sub = k => String(k).split('').map(d => SUB[d]).join('');
const times = (b, k) => Array(k).fill(n(b)).join(' × ');
/* "the fraction 24/30, which is 4/5 in lowest terms" (k is the common factor), and a fraction over 5 or 25 as a decimal. */
const low = (a, b, k) => `the fraction ${n(a)}/${n(b)}` + (k > 1 ? `, which is ${n(a / k)}/${n(b / k)} in lowest terms` : '');
const dec = (a, h, v) => `${n(a)}/${n(h)} = ${n(a * (h === 5 ? 2 : 4))}/${n(h === 5 ? 10 : 100)} = ${n(v)}`;

/* q36b the domain does not start at 0: C(h) = m h + c on lo..hi days with lo >= 2, so the smallest cost is never the delivery fee c. */
add({
 id: 'q36b', parent: 'q36', kind: 'setting',
 title: 'Scaffold by the day',
 brief: 'The tower’s gutters need mending from a scaffold, and the hire yard’s price list has to be turned into the cost of any hire the yard allows.',
 prompt: 'Scaffold hire. A builders’ yard hires out a scaffold tower for 30 dollars to deliver it plus 12 dollars for each day, so the cost of d days is C(d) = 12d + 30 dollars. The yard hires it out for any whole number of days from 2 to 8, so that is the domain. Enter C(5), then the smallest and the largest costs in the range.',
 answer: [90, 54, 126], labels: ['cost of that hire (dollars)', 'smallest cost in the range (dollars)', 'largest cost in the range (dollars)'], tolerance: 0.001,
 hints: [
  'C(5) means: put 5 in place of d, so work out 12 × 5 + 30.',
  'The cost only goes up with the days, so the smallest cost comes from the smallest input and the largest cost from the largest input. Take care: the smallest input here is 2 days, not 0.'
 ],
 solution: 'C(5) = 12 × 5 + 30 = 90 dollars. The shortest hire, 2 days, gives C(2) = 12 × 2 + 30 = 54 dollars, and the longest, 8 days, gives C(8) = 12 × 8 + 30 = 126 dollars. So the range runs from 54 dollars to 126 dollars. The delivery fee alone, 30 dollars, is not in the range, because nobody can hire the tower for 0 days.',
 guidance: [
  { prompt: 'What is C(5)? Replace d with 5 in 12d + 30.', answer: [90], labels: ['cost (dollars)'], explanation: '12 × 5 = 60, and 60 + 30 = 90.' },
  { prompt: 'The shortest hire in the domain is 2 days. What is C(2)?', answer: [54], labels: ['smallest cost (dollars)'], explanation: '12 × 2 = 24, and 24 + 30 = 54. It is the smallest cost, because the cost only goes up with the days.' },
  { prompt: 'The longest hire in the domain is 8 days. What is C(8)?', answer: [126], labels: ['largest cost (dollars)'], explanation: '12 × 8 = 96, and 96 + 30 = 126. It is the largest cost in the range.' }
 ]
}, {
 canonical: { m: 12, c: 30, lo: 2, hi: 8, a: 5 },
 draw: R => { const lo = R.int(2, 3), hi = R.int(6, 10); return { m: R.int(6, 15), c: 5 * R.int(4, 10), lo, hi, a: R.int(lo + 1, hi - 1) }; },
 build: ({ m, c, lo, hi, a }) => { const A = m * a + c, B = m * lo + c, D = m * hi + c; return {
  prompt: `Scaffold hire. A builders’ yard hires out a scaffold tower for ${n(c)} dollars to deliver it plus ${n(m)} dollars for each day, so the cost of d days is C(d) = ${n(m)}d + ${n(c)} dollars. The yard hires it out for any whole number of days from ${n(lo)} to ${n(hi)}, so that is the domain. Enter C(${n(a)}), then the smallest and the largest costs in the range.`,
  answer: [A, B, D],
  hints: [`C(${n(a)}) means: put ${n(a)} in place of d, so work out ${n(m)} × ${n(a)} + ${n(c)}.`, `The cost only goes up with the days, so the smallest cost comes from the smallest input and the largest cost from the largest input. Take care: the smallest input here is ${n(lo)} days, not 0.`],
  solution: `C(${n(a)}) = ${n(m)} × ${n(a)} + ${n(c)} = ${n(A)} dollars. The shortest hire, ${n(lo)} days, gives C(${n(lo)}) = ${n(m)} × ${n(lo)} + ${n(c)} = ${n(B)} dollars, and the longest, ${n(hi)} days, gives C(${n(hi)}) = ${n(m)} × ${n(hi)} + ${n(c)} = ${n(D)} dollars. So the range runs from ${n(B)} dollars to ${n(D)} dollars. The delivery fee alone, ${n(c)} dollars, is not in the range, because nobody can hire the tower for 0 days.`,
  guidance: [
   { prompt: `What is C(${n(a)})? Replace d with ${n(a)} in ${n(m)}d + ${n(c)}.`, answer: [A], explanation: `${n(m)} × ${n(a)} = ${n(m * a)}, and ${n(m * a)} + ${n(c)} = ${n(A)}.` },
   { prompt: `The shortest hire in the domain is ${n(lo)} days. What is C(${n(lo)})?`, answer: [B], explanation: `${n(m)} × ${n(lo)} = ${n(m * lo)}, and ${n(m * lo)} + ${n(c)} = ${n(B)}. It is the smallest cost, because the cost only goes up with the days.` },
   { prompt: `The longest hire in the domain is ${n(hi)} days. What is C(${n(hi)})?`, answer: [D], explanation: `${n(m)} × ${n(hi)} = ${n(m * hi)}, and ${n(m * hi)} + ${n(c)} = ${n(D)}. It is the largest cost in the range.` }
  ] }; }
});

/* q36c the player builds the rule T(w) = a w + b from words (the fixed minutes are stated first), then evaluates it and finds the top of the range on the domain 1..hi kilograms. a (30..50) and b (10..25) never match. */
add({
 id: 'q36c', parent: 'q36', kind: 'applied',
 title: 'The roasting chart',
 brief: 'The tower crew is roasting a joint for the mast-raising supper, and the cook needs the oven time for any weight the tin holds.',
 prompt: 'Roasting chart. A cookbook says a joint of meat needs 20 minutes in the oven, plus 40 minutes for each kilogram it weighs. Write this as a rule T(w) = a × w + b for a joint of w kilograms. The roasting tin holds joints from 1 to 4 kilograms, so that is the domain. Enter a, then b, then T(3), then the longest time in the range, both times in minutes.',
 answer: [40, 20, 140, 180], labels: ['a (minutes for each kilogram)', 'b (minutes added)', 'time for that joint (minutes)', 'longest time in the range (minutes)'], tolerance: 0.001,
 hints: [
  'The number that goes with “for each kilogram” multiplies w, so it is a. The minutes that every joint needs, whatever it weighs, are added on at the end: that is b.',
  'T(3) means: put 3 in place of w. The time only grows with the weight, so the longest time comes from the heaviest joint the tin holds.'
 ],
 solution: 'Each kilogram adds 40 minutes, so a = 40; every joint gets 20 minutes more whatever it weighs, so b = 20. The rule is T(w) = 40w + 20. T(3) = 40 × 3 + 20 = 140 minutes. The heaviest joint in the domain, 4 kilograms, gives the longest time: T(4) = 40 × 4 + 20 = 180 minutes.',
 guidance: [
  { prompt: 'One number is the minutes for each kilogram, so it multiplies w. The other is added whatever the weight. Enter the multiplier a, then the added number b.', answer: [40, 20], labels: ['a', 'b'], explanation: '“40 minutes for each kilogram” multiplies the weight, so a = 40. The 20 minutes are added for every joint, so b = 20: T(w) = 40w + 20.' },
  { prompt: 'What is T(3)? Replace w with 3 in 40w + 20.', answer: [140], labels: ['time (minutes)'], explanation: '40 × 3 = 120, and 120 + 20 = 140 minutes.' },
  { prompt: 'The heaviest joint in the domain weighs 4 kilograms. What is T(4)?', answer: [180], labels: ['longest time (minutes)'], explanation: '40 × 4 = 160, and 160 + 20 = 180 minutes. It is the longest time in the range.' }
 ]
}, {
 canonical: { a: 40, b: 20, hi: 4, w: 3 },
 draw: R => { const hi = R.int(4, 6); return { a: 5 * R.int(6, 10), b: 5 * R.int(2, 5), hi, w: R.int(2, hi - 1) }; },
 build: ({ a, b, hi, w }) => { const A = a * w + b, B = a * hi + b; return {
  prompt: `Roasting chart. A cookbook says a joint of meat needs ${n(b)} minutes in the oven, plus ${n(a)} minutes for each kilogram it weighs. Write this as a rule T(w) = a × w + b for a joint of w kilograms. The roasting tin holds joints from 1 to ${n(hi)} kilograms, so that is the domain. Enter a, then b, then T(${n(w)}), then the longest time in the range, both times in minutes.`,
  answer: [a, b, A, B],
  hints: ['The number that goes with “for each kilogram” multiplies w, so it is a. The minutes that every joint needs, whatever it weighs, are added on at the end: that is b.', `T(${n(w)}) means: put ${n(w)} in place of w. The time only grows with the weight, so the longest time comes from the heaviest joint the tin holds.`],
  solution: `Each kilogram adds ${n(a)} minutes, so a = ${n(a)}; every joint gets ${n(b)} minutes more whatever it weighs, so b = ${n(b)}. The rule is T(w) = ${n(a)}w + ${n(b)}. T(${n(w)}) = ${n(a)} × ${n(w)} + ${n(b)} = ${n(A)} minutes. The heaviest joint in the domain, ${n(hi)} kilograms, gives the longest time: T(${n(hi)}) = ${n(a)} × ${n(hi)} + ${n(b)} = ${n(B)} minutes.`,
  guidance: [
   { prompt: `One number is the minutes for each kilogram, so it multiplies w. The other is added whatever the weight. Enter the multiplier a, then the added number b.`, answer: [a, b], explanation: `“${n(a)} minutes for each kilogram” multiplies the weight, so a = ${n(a)}. The ${n(b)} minutes are added for every joint, so b = ${n(b)}: T(w) = ${n(a)}w + ${n(b)}.` },
   { prompt: `What is T(${n(w)})? Replace w with ${n(w)} in ${n(a)}w + ${n(b)}.`, answer: [A], explanation: `${n(a)} × ${n(w)} = ${n(a * w)}, and ${n(a * w)} + ${n(b)} = ${n(A)} minutes.` },
   { prompt: `The heaviest joint in the domain weighs ${n(hi)} kilograms. What is T(${n(hi)})?`, answer: [B], explanation: `${n(a)} × ${n(hi)} = ${n(a * hi)}, and ${n(a * hi)} + ${n(b)} = ${n(B)} minutes. It is the longest time in the range.` }
  ] }; }
});

/* q36d F(d) = m d + c on 1..H km: one output, the top of the range, and (with q17) the input whose output is the paid fare y = m s + c. The paid trip s (10..H−1) is longer than the evaluated trip a (3..9) and shorter than the longest. y is a parameter, so the oracle solves from the stated fare. */
add({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q17',
 title: 'The taxi up from the port',
 brief: 'A relief operator is coming up from the port by taxi, and the tower’s purse-keeper wants the fare rule read forwards and backwards.',
 prompt: 'Taxi fares. A taxi charges 5 dollars to start the meter and 3 dollars for each kilometre, so a trip of d kilometres costs F(d) = 3d + 5 dollars. The firm takes trips of any distance from 1 to 20 kilometres, so that is the domain. Enter F(8), then the largest fare in the range, then the distance in kilometres of a trip that cost 41 dollars.',
 answer: [29, 65, 12], labels: ['fare for that trip (dollars)', 'largest fare in the range (dollars)', 'distance of the paid trip (km)'], tolerance: 0.001,
 hints: [
  'F(8) means: put 8 in place of d. The fare only grows with the distance, so the largest fare belongs to the longest trip, 20 kilometres.',
  'For the last box you know the output and need the input: solve 3d + 5 = 41. Take 5 from both sides first, then divide both sides by 3.'
 ],
 solution: 'F(8) = 3 × 8 + 5 = 29 dollars. The longest trip, 20 kilometres, gives the largest fare: F(20) = 3 × 20 + 5 = 65 dollars. For the paid trip, 3d + 5 = 41. Take 5 from both sides: 3d = 36. Divide both sides by 3: d = 12 kilometres. Check: F(12) = 3 × 12 + 5 = 41.',
 guidance: [
  { prompt: 'What is F(8)? Replace d with 8 in 3d + 5.', answer: [29], labels: ['fare (dollars)'], explanation: '3 × 8 = 24, and 24 + 5 = 29 dollars.' },
  { prompt: 'The longest trip in the domain is 20 kilometres. What is F(20)?', answer: [65], labels: ['largest fare (dollars)'], explanation: '3 × 20 = 60, and 60 + 5 = 65 dollars. It is the largest fare in the range.' },
  { prompt: 'Now run the rule backwards: 3d + 5 = 41. Take 5 from both sides. What does 3d equal?', answer: [36], labels: ['value of the d term'], explanation: '41 − 5 = 36, so 3d = 36.' },
  { prompt: '3d = 36. Divide both sides by 3. What is d?', answer: [12], labels: ['distance (km)'], explanation: '36 ÷ 3 = 12 kilometres. Check: 3 × 12 + 5 = 41.' }
 ]
}, {
 canonical: { m: 3, c: 5, H: 20, a: 8, y: 41 },
 draw: R => { const m = R.int(2, 4), c = R.int(3, 9), H = 5 * R.int(3, 6), a = R.int(3, 9), s = R.int(10, H - 1); return { m, c, H, a, y: m * s + c }; },
 build: ({ m, c, H, a, y }) => { const A = m * a + c, B = m * H + c, s = (y - c) / m; return {
  prompt: `Taxi fares. A taxi charges ${n(c)} dollars to start the meter and ${n(m)} dollars for each kilometre, so a trip of d kilometres costs F(d) = ${n(m)}d + ${n(c)} dollars. The firm takes trips of any distance from 1 to ${n(H)} kilometres, so that is the domain. Enter F(${n(a)}), then the largest fare in the range, then the distance in kilometres of a trip that cost ${n(y)} dollars.`,
  answer: [A, B, s],
  hints: [`F(${n(a)}) means: put ${n(a)} in place of d. The fare only grows with the distance, so the largest fare belongs to the longest trip, ${n(H)} kilometres.`, `For the last box you know the output and need the input: solve ${n(m)}d + ${n(c)} = ${n(y)}. Take ${n(c)} from both sides first, then divide both sides by ${n(m)}.`],
  solution: `F(${n(a)}) = ${n(m)} × ${n(a)} + ${n(c)} = ${n(A)} dollars. The longest trip, ${n(H)} kilometres, gives the largest fare: F(${n(H)}) = ${n(m)} × ${n(H)} + ${n(c)} = ${n(B)} dollars. For the paid trip, ${n(m)}d + ${n(c)} = ${n(y)}. Take ${n(c)} from both sides: ${n(m)}d = ${n(y - c)}. Divide both sides by ${n(m)}: d = ${n(s)} kilometres. Check: F(${n(s)}) = ${n(m)} × ${n(s)} + ${n(c)} = ${n(y)}.`,
  guidance: [
   { prompt: `What is F(${n(a)})? Replace d with ${n(a)} in ${n(m)}d + ${n(c)}.`, answer: [A], explanation: `${n(m)} × ${n(a)} = ${n(m * a)}, and ${n(m * a)} + ${n(c)} = ${n(A)} dollars.` },
   { prompt: `The longest trip in the domain is ${n(H)} kilometres. What is F(${n(H)})?`, answer: [B], explanation: `${n(m)} × ${n(H)} = ${n(m * H)}, and ${n(m * H)} + ${n(c)} = ${n(B)} dollars. It is the largest fare in the range.` },
   { prompt: `Now run the rule backwards: ${n(m)}d + ${n(c)} = ${n(y)}. Take ${n(c)} from both sides. What does ${n(m)}d equal?`, answer: [y - c], explanation: `${n(y)} − ${n(c)} = ${n(y - c)}, so ${n(m)}d = ${n(y - c)}.` },
   { prompt: `${n(m)}d = ${n(y - c)}. Divide both sides by ${n(m)}. What is d?`, answer: [s], explanation: `${n(y - c)} ÷ ${n(m)} = ${n(s)} kilometres. Check: ${n(m)} × ${n(s)} + ${n(c)} = ${n(y)}.` }
  ] }; }
});

/* q37b a shift outside the bracket, p(h) = f(h) + r (the graph lifted r), then composition with g(x) = k x. The parent shifts inside the bracket. With m >= 10 the slip f(h + r) is far from f(h) + r. */
add({
 id: 'q37b', parent: 'q37', kind: 'setting',
 title: 'The cleaner’s new contract',
 brief: 'The tower’s cleaner has a new contract, and the pay office needs the new weekly pay and the pay for a holiday week.',
 prompt: 'Pay office. A cleaner’s pay for a week with h hours of work follows the rule f(h) = 12h + 30 dollars; the 30 dollars is travel money. A new contract adds 25 dollars to every week’s pay, so the new rule is p(h) = f(h) + 25: its graph is the old graph lifted 25. In a holiday week the firm pays double: g(x) = 2x. Enter p(20), then g(p(20)), both in dollars. Type each number without commas.',
 answer: [295, 590], labels: ['new weekly pay (dollars)', 'holiday-week pay (dollars)'], tolerance: 0.001,
 hints: [
  'p(20) = f(20) + 25. The 25 is outside the bracket, so use the old rule on 20 first, then add 25 to the result.',
  'g(p(20)) means: take the pay you found and feed it into g, which multiplies it by 2.'
 ],
 solution: 'p(20) = f(20) + 25. The old rule gives f(20) = 12 × 20 + 30 = 270, so p(20) = 270 + 25 = 295 dollars. Then g(p(20)) = g(295) = 2 × 295 = 590 dollars.',
 guidance: [
  { prompt: 'Use the old rule first: what is f(20)? Use f(h) = 12h + 30.', answer: [270], labels: ['old pay (dollars)'], explanation: '12 × 20 = 240, and 240 + 30 = 270 dollars.' },
  { prompt: 'Now lift it: what is f(20) + 25, that is 270 + 25?', answer: [295], labels: ['new pay (dollars)'], explanation: '270 + 25 = 295 dollars. The 25 is added to the output, after the old rule has done its work.' },
  { prompt: 'Feed that pay into the second rule: what is g(295)?', answer: [590], labels: ['holiday-week pay (dollars)'], explanation: 'g multiplies by 2: 2 × 295 = 590 dollars.' }
 ]
}, {
 canonical: { m: 12, c: 30, r: 25, a: 20, k: 2 },
 draw: R => ({ m: R.pick([10, 11, 12, 14, 15]), c: 10 * R.int(2, 5), r: 5 * R.pick([3, 5, 7, 9]), a: 5 * R.int(2, 8), k: R.int(2, 3) }),
 build: ({ m, c, r, a, k }) => { const F = m * a + c, P = F + r, D = k * P, word = k === 2 ? 'double' : 'triple'; return {
  prompt: `Pay office. A cleaner’s pay for a week with h hours of work follows the rule f(h) = ${n(m)}h + ${n(c)} dollars; the ${n(c)} dollars is travel money. A new contract adds ${n(r)} dollars to every week’s pay, so the new rule is p(h) = f(h) + ${n(r)}: its graph is the old graph lifted ${n(r)}. In a holiday week the firm pays ${word}: g(x) = ${n(k)}x. Enter p(${n(a)}), then g(p(${n(a)})), both in dollars. Type each number without commas.`,
  answer: [P, D],
  hints: [`p(${n(a)}) = f(${n(a)}) + ${n(r)}. The ${n(r)} is outside the bracket, so use the old rule on ${n(a)} first, then add ${n(r)} to the result.`, `g(p(${n(a)})) means: take the pay you found and feed it into g, which multiplies it by ${n(k)}.`],
  solution: `p(${n(a)}) = f(${n(a)}) + ${n(r)}. The old rule gives f(${n(a)}) = ${n(m)} × ${n(a)} + ${n(c)} = ${n(F)}, so p(${n(a)}) = ${n(F)} + ${n(r)} = ${n(P)} dollars. Then g(p(${n(a)})) = g(${n(P)}) = ${n(k)} × ${n(P)} = ${n(D)} dollars.`,
  guidance: [
   { prompt: `Use the old rule first: what is f(${n(a)})? Use f(h) = ${n(m)}h + ${n(c)}.`, answer: [F], explanation: `${n(m)} × ${n(a)} = ${n(m * a)}, and ${n(m * a)} + ${n(c)} = ${n(F)} dollars.` },
   { prompt: `Now lift it: what is f(${n(a)}) + ${n(r)}, that is ${n(F)} + ${n(r)}?`, answer: [P], explanation: `${n(F)} + ${n(r)} = ${n(P)} dollars. The ${n(r)} is added to the output, after the old rule has done its work.` },
   { prompt: `Feed that pay into the second rule: what is g(${n(P)})?`, answer: [D], explanation: `g multiplies by ${n(k)}: ${n(k)} × ${n(P)} = ${n(D)} dollars.` }
  ] }; }
});

/* q37c composition both ways round: c(x) = x − k and h(x) = x ÷ 2 on a marked price x. x (80..240) and k (10, 20 or 30) are multiples of 10, so every value is whole and positive; the second order is cheaper by k ÷ 2. */
add({
 id: 'q37c', parent: 'q37', kind: 'applied',
 title: 'Coupon first or half first',
 brief: 'A signal tech is buying a winter coat on sale day and wants to know which order of discounts the till should use.',
 prompt: 'Sale day. A coupon takes 20 dollars off a price of x dollars: c(x) = x − 20. The sale rack sells at half the price: h(x) = x ÷ 2. A coat on the rack is marked 120 dollars, and the order of the two rules matters. Enter h(c(120)), the price when the coupon comes off first and the result is then halved. Then enter c(h(120)), the price when it is halved first. Then enter how many dollars cheaper the second way is.',
 answer: [50, 40, 10], labels: ['coupon first, then half (dollars)', 'half first, then coupon (dollars)', 'saving of the second way (dollars)'], tolerance: 0.001,
 hints: [
  'In h(c(120)) the inside rule c comes first: take off the coupon, then halve what is left. In c(h(120)) the inside rule is h, so halve first and then take off the coupon.',
  'For the last box, take the smaller of your two prices away from the larger.'
 ],
 solution: 'Coupon first: c(120) = 120 − 20 = 100, then h(100) = 100 ÷ 2 = 50 dollars. Half first: h(120) = 120 ÷ 2 = 60, then c(60) = 60 − 20 = 40 dollars. The second way is 50 − 40 = 10 dollars cheaper: used last, the coupon takes off its full 20 dollars; used first, its 20 dollars are halved with the rest.',
 guidance: [
  { prompt: 'Start inside: c(120) = 120 − 20 = 100. Now feed that into h: what is h(100)?', answer: [50], labels: ['price (dollars)'], explanation: 'h halves its input: 100 ÷ 2 = 50 dollars. That is h(c(120)).' },
  { prompt: 'The other order: h(120) = 120 ÷ 2 = 60. Now feed that into c: what is c(60)?', answer: [40], labels: ['price (dollars)'], explanation: 'c takes off 20: 60 − 20 = 40 dollars. That is c(h(120)).' },
  { prompt: 'How many dollars less is 40 than 50?', answer: [10], labels: ['saving (dollars)'], explanation: '50 − 40 = 10 dollars. The same two rules give different prices in a different order.' }
 ]
}, {
 canonical: { x: 120, k: 20 },
 draw: R => ({ x: 10 * R.int(8, 24), k: 10 * R.int(1, 3) }),
 build: ({ x, k }) => { const A = (x - k) / 2, B = x / 2 - k, S = A - B; return {
  prompt: `Sale day. A coupon takes ${n(k)} dollars off a price of x dollars: c(x) = x − ${n(k)}. The sale rack sells at half the price: h(x) = x ÷ 2. A coat on the rack is marked ${n(x)} dollars, and the order of the two rules matters. Enter h(c(${n(x)})), the price when the coupon comes off first and the result is then halved. Then enter c(h(${n(x)})), the price when it is halved first. Then enter how many dollars cheaper the second way is.`,
  answer: [A, B, S],
  hints: [`In h(c(${n(x)})) the inside rule c comes first: take off the coupon, then halve what is left. In c(h(${n(x)})) the inside rule is h, so halve first and then take off the coupon.`, 'For the last box, take the smaller of your two prices away from the larger.'],
  solution: `Coupon first: c(${n(x)}) = ${n(x)} − ${n(k)} = ${n(x - k)}, then h(${n(x - k)}) = ${n(x - k)} ÷ 2 = ${n(A)} dollars. Half first: h(${n(x)}) = ${n(x)} ÷ 2 = ${n(x / 2)}, then c(${n(x / 2)}) = ${n(x / 2)} − ${n(k)} = ${n(B)} dollars. The second way is ${n(A)} − ${n(B)} = ${n(S)} dollars cheaper: used last, the coupon takes off its full ${n(k)} dollars; used first, its ${n(k)} dollars are halved with the rest.`,
  guidance: [
   { prompt: `Start inside: c(${n(x)}) = ${n(x)} − ${n(k)} = ${n(x - k)}. Now feed that into h: what is h(${n(x - k)})?`, answer: [A], explanation: `h halves its input: ${n(x - k)} ÷ 2 = ${n(A)} dollars. That is h(c(${n(x)})).` },
   { prompt: `The other order: h(${n(x)}) = ${n(x)} ÷ 2 = ${n(x / 2)}. Now feed that into c: what is c(${n(x / 2)})?`, answer: [B], explanation: `c takes off ${n(k)}: ${n(x / 2)} − ${n(k)} = ${n(B)} dollars. That is c(h(${n(x)})).` },
   { prompt: `How many dollars less is ${n(B)} than ${n(A)}?`, answer: [S], explanation: `${n(A)} − ${n(B)} = ${n(S)} dollars. The same two rules give different prices in a different order.` }
  ] }; }
});

/* q37d both shifts at once on a quadratic (q34): p(x) = f(x − h) + k with f(x) = x² − Bx + C, whose roots are r and r + g (g even), so its vertex (vx, vy) has whole coordinates and is stated. The evaluated input a = u + h is drawn so that u is not the vertex and none of the slips f(a) + k, f(a) − h + k, f(a + h) + k gives p(a). */
add({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q34',
 title: 'The rebuilt dish mount',
 brief: 'The dish mount has been rebuilt further along the frame and higher up, and the crew needs the new curve’s height at one mark and its lowest point.',
 prompt: 'Dish mount. The rim of the old dish mount follows the curve f(x) = x² − 10x + 21, whose lowest point, the vertex, is at x = 5, y = −4. The mount is rebuilt, and the new curve is p(x) = f(x − 2) + 6: the old graph slid 2 to the right and lifted 6. Enter p(10), then the x and the y of the lowest point of the new curve.',
 answer: [11, 7, 2], labels: ['p at that input', 'new lowest point x', 'new lowest point y'], tolerance: 0.001,
 hints: [
  'p(10) = f(10 − 2) + 6. Work out the inside bracket first, use the rule f on that number, and add 6 at the very end.',
  'Every point of the old graph moves the same way, and so does its lowest point: a slide to the right changes only its x, and a lift changes only its y.'
 ],
 solution: 'p(10) = f(10 − 2) + 6 = f(8) + 6. The old rule gives f(8) = 8² − 10 × 8 + 21 = 64 − 80 + 21 = 5, so p(10) = 5 + 6 = 11. The old lowest point is at x = 5, y = −4. Sliding 2 to the right gives x = 5 + 2 = 7, and lifting 6 gives y = −4 + 6 = 2. The new lowest point is at x = 7, y = 2.',
 guidance: [
  { prompt: 'Start inside the bracket: what is 10 − 2?', answer: [8], labels: ['input for f'], explanation: '10 − 2 = 8, so p(10) is the same as f(8) + 6.' },
  { prompt: 'What is f(8)? Use f(x) = x² − 10x + 21.', answer: [5], labels: ['f at that input'], explanation: '8² = 64 and 10 × 8 = 80, so f(8) = 64 − 80 + 21 = 5.' },
  { prompt: 'Now add the lift: what is 5 + 6?', answer: [11], labels: ['p at that input'], explanation: '5 + 6 = 11. That is p(10).' },
  { prompt: 'The old lowest point is at x = 5, y = −4. Slide it 2 to the right and lift it 6. Enter its new x, then its new y.', answer: [7, 2], labels: ['new x', 'new y'], explanation: 'The slide adds 2 to x: 5 + 2 = 7. The lift adds 6 to y: −4 + 6 = 2.' }
 ]
}, {
 canonical: { B: 10, C: 21, vx: 5, vy: -4, h: 2, k: 6, a: 10 },
 draw: R => { const r = R.int(1, 3), g = 2 * R.int(1, 3), B = 2 * r + g, C = r * (r + g), vx = r + g / 2, vy = -(g / 2) * (g / 2), h = R.int(1, 4), k = R.int(1, 9);
  const f = x => x * x - B * x + C, ok = u => u !== vx && ![f(u + h), f(u + h) - h, f(u + 2 * h)].includes(f(u));
  return { B, C, vx, vy, h, k, a: R.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(ok)) + h }; },
 build: ({ B, C, vx, vy, h, k, a }) => { const u = a - h, fu = u * u - B * u + C, P = fu + k, X = vx + h, Y = vy + k; return {
  prompt: `Dish mount. The rim of the old dish mount follows the curve f(x) = x² − ${n(B)}x + ${n(C)}, whose lowest point, the vertex, is at x = ${n(vx)}, y = ${n(vy)}. The mount is rebuilt, and the new curve is p(x) = f(x − ${n(h)}) + ${n(k)}: the old graph slid ${n(h)} to the right and lifted ${n(k)}. Enter p(${n(a)}), then the x and the y of the lowest point of the new curve.`,
  answer: [P, X, Y],
  hints: [`p(${n(a)}) = f(${n(a)} − ${n(h)}) + ${n(k)}. Work out the inside bracket first, use the rule f on that number, and add ${n(k)} at the very end.`, 'Every point of the old graph moves the same way, and so does its lowest point: a slide to the right changes only its x, and a lift changes only its y.'],
  solution: `p(${n(a)}) = f(${n(a)} − ${n(h)}) + ${n(k)} = f(${n(u)}) + ${n(k)}. The old rule gives f(${n(u)}) = ${n(u)}² − ${n(B)} × ${n(u)} + ${n(C)} = ${n(u * u)} − ${n(B * u)} + ${n(C)} = ${n(fu)}, so p(${n(a)}) = ${n(fu)} + ${n(k)} = ${n(P)}. The old lowest point is at x = ${n(vx)}, y = ${n(vy)}. Sliding ${n(h)} to the right gives x = ${n(vx)} + ${n(h)} = ${n(X)}, and lifting ${n(k)} gives y = ${n(vy)} + ${n(k)} = ${n(Y)}. The new lowest point is at x = ${n(X)}, y = ${n(Y)}.`,
  guidance: [
   { prompt: `Start inside the bracket: what is ${n(a)} − ${n(h)}?`, answer: [u], explanation: `${n(a)} − ${n(h)} = ${n(u)}, so p(${n(a)}) is the same as f(${n(u)}) + ${n(k)}.` },
   { prompt: `What is f(${n(u)})? Use f(x) = x² − ${n(B)}x + ${n(C)}.`, answer: [fu], explanation: `${n(u)}² = ${n(u * u)} and ${n(B)} × ${n(u)} = ${n(B * u)}, so f(${n(u)}) = ${n(u * u)} − ${n(B * u)} + ${n(C)} = ${n(fu)}.` },
   { prompt: `Now add the lift: what is ${n(fu)} + ${n(k)}?`, answer: [P], explanation: `${n(fu)} + ${n(k)} = ${n(P)}. That is p(${n(a)}).` },
   { prompt: `The old lowest point is at x = ${n(vx)}, y = ${n(vy)}. Slide it ${n(h)} to the right and lift it ${n(k)}. Enter its new x, then its new y.`, answer: [X, Y], explanation: `The slide adds ${n(h)} to x: ${n(vx)} + ${n(h)} = ${n(X)}. The lift adds ${n(k)} to y: ${n(vy)} + ${n(k)} = ${n(Y)}.` }
  ] }; }
});

/* q38b the steps come in the other order from the parent: C(g) = m(g − f) takes away, then multiplies, so the inverse divides, then adds: C⁻¹(x) = x ÷ m + f. m and f differ, so a and b cannot be swapped, and the same-order slip (y + f) ÷ m never gives the answer. The charge y is a parameter. */
add({
 id: 'q38b', parent: 'q38', kind: 'setting',
 title: 'The extra data charge',
 brief: 'The tower’s phone bill shows an extra data charge, and Mira wants to know how much data was really used.',
 prompt: 'Phone data. A phone plan includes 5 gigabytes of data each month. Each gigabyte beyond that costs 3 dollars, so a month that uses g gigabytes (5 or more) adds C(g) = 3 × (g − 5) dollars to the bill. Last month the added charge was 27 dollars. Write the inverse rule in the form C⁻¹(x) = x ÷ a + b, and enter a, then b, then the gigabytes used last month, C⁻¹(27).',
 answer: [3, 5, 14], labels: ['a (number divided by)', 'b (number added)', 'gigabytes used'], tolerance: 0.001,
 hints: [
  'List what C does to g, in order: first it takes a number away, then it multiplies. The inverse undoes the last step first.',
  'Multiplying was the last step, so the inverse divides first: a is the number C multiplied by. Then it adds back the number C took away: that is b. Then put 27 in place of x.'
 ],
 solution: 'C takes away 5, then multiplies by 3. Undo the last step first: divide by 3, then add 5. So C⁻¹(x) = x ÷ 3 + 5: a = 3 and b = 5. Then C⁻¹(27) = 27 ÷ 3 + 5 = 9 + 5 = 14 gigabytes. Check: C(14) = 3 × (14 − 5) = 3 × 9 = 27.',
 guidance: [
  { prompt: 'C does two things to g: takes away 5, then times 3. The inverse undoes the last one first. Which number does it divide by?', answer: [3], labels: ['a'], explanation: 'The last thing C did was multiply by 3, so the inverse starts by dividing by 3: a = 3.' },
  { prompt: 'After dividing by 3, which number does the inverse add back?', answer: [5], labels: ['b'], explanation: 'C took away 5, so the inverse adds 5: b = 5.' },
  { prompt: 'What is 27 ÷ 3 + 5?', answer: [14], labels: ['gigabytes used'], explanation: '27 ÷ 3 = 9, and 9 + 5 = 14 gigabytes. Check: 3 × (14 − 5) = 27.' }
 ]
}, {
 canonical: { m: 3, f: 5, y: 27 },
 draw: R => { const m = R.int(2, 6), f = R.pick([4, 5, 8, 10, 12, 15, 20].filter(v => v !== m)); return { m, f, y: m * R.int(2, 12) }; },
 build: ({ m, f, y }) => { const e = y / m, g = e + f; return {
  prompt: `Phone data. A phone plan includes ${n(f)} gigabytes of data each month. Each gigabyte beyond that costs ${n(m)} dollars, so a month that uses g gigabytes (${n(f)} or more) adds C(g) = ${n(m)} × (g − ${n(f)}) dollars to the bill. Last month the added charge was ${n(y)} dollars. Write the inverse rule in the form C⁻¹(x) = x ÷ a + b, and enter a, then b, then the gigabytes used last month, C⁻¹(${n(y)}).`,
  answer: [m, f, g],
  hints: ['List what C does to g, in order: first it takes a number away, then it multiplies. The inverse undoes the last step first.', `Multiplying was the last step, so the inverse divides first: a is the number C multiplied by. Then it adds back the number C took away: that is b. Then put ${n(y)} in place of x.`],
  solution: `C takes away ${n(f)}, then multiplies by ${n(m)}. Undo the last step first: divide by ${n(m)}, then add ${n(f)}. So C⁻¹(x) = x ÷ ${n(m)} + ${n(f)}: a = ${n(m)} and b = ${n(f)}. Then C⁻¹(${n(y)}) = ${n(y)} ÷ ${n(m)} + ${n(f)} = ${n(e)} + ${n(f)} = ${n(g)} gigabytes. Check: C(${n(g)}) = ${n(m)} × (${n(g)} − ${n(f)}) = ${n(m)} × ${n(e)} = ${n(y)}.`,
  guidance: [
   { prompt: `C does two things to g: takes away ${n(f)}, then times ${n(m)}. The inverse undoes the last one first. Which number does it divide by?`, answer: [m], explanation: `The last thing C did was multiply by ${n(m)}, so the inverse starts by dividing by ${n(m)}: a = ${n(m)}.` },
   { prompt: `After dividing by ${n(m)}, which number does the inverse add back?`, answer: [f], explanation: `C took away ${n(f)}, so the inverse adds ${n(f)}: b = ${n(f)}.` },
   { prompt: `What is ${n(y)} ÷ ${n(m)} + ${n(f)}?`, answer: [g], explanation: `${n(y)} ÷ ${n(m)} = ${n(e)}, and ${n(e)} + ${n(f)} = ${n(g)} gigabytes. Check: ${n(m)} × (${n(g)} − ${n(f)}) = ${n(y)}.` }
  ] }; }
});

/* q38c two inverses of the parent’s kind and a comparison. The budget y is a multiple of 10; each joining fee is y minus a whole number of visits, between 10 and 45 dollars, so both visit counts are whole. The prices differ, the fees differ and the counts differ. */
add({
 id: 'q38c', parent: 'q38', kind: 'applied',
 title: 'Two gyms, one budget',
 brief: 'The night shift wants a gym pass for the off-season, and the question is which gym gives more visits for the same money.',
 prompt: 'Two gyms. Gym A charges 30 dollars to join and 6 dollars a visit, so n visits cost A(n) = 6n + 30 dollars. Gym B charges 14 dollars to join and 8 dollars a visit: B(n) = 8n + 14 dollars. You have 150 dollars to spend. Run each rule backwards to find how many visits that money buys. Enter the visits at gym A, then the visits at gym B, then how many more visits the better gym gives.',
 answer: [20, 17, 3], labels: ['visits at gym A', 'visits at gym B', 'extra visits at the better gym'], tolerance: 0.001,
 hints: [
  'You know the output, 150 dollars, and need the input. Each rule multiplies the visits by a number and then adds the joining fee, so its inverse takes the fee away first and then divides by the price of a visit.',
  'For gym A work out (150 − 30) ÷ 6. Do the same for gym B with its own two numbers, then take the smaller count from the larger.'
 ],
 solution: 'A multiplies by 6, then adds 30, so A⁻¹(x) = (x − 30) ÷ 6, and A⁻¹(150) = (150 − 30) ÷ 6 = 120 ÷ 6 = 20 visits. B multiplies by 8, then adds 14, so B⁻¹(x) = (x − 14) ÷ 8, and B⁻¹(150) = (150 − 14) ÷ 8 = 136 ÷ 8 = 17 visits. Gym A gives 20 − 17 = 3 more visits. Check: 6 × 20 + 30 = 150 and 8 × 17 + 14 = 150.',
 guidance: [
  { prompt: 'Gym A: take away the joining fee, then divide by the price of a visit. What is (150 − 30) ÷ 6?', answer: [20], labels: ['visits at gym A'], explanation: '150 − 30 = 120, and 120 ÷ 6 = 20 visits. Check: 6 × 20 + 30 = 150.' },
  { prompt: 'Gym B, the same way: what is (150 − 14) ÷ 8?', answer: [17], labels: ['visits at gym B'], explanation: '150 − 14 = 136, and 136 ÷ 8 = 17 visits. Check: 8 × 17 + 14 = 150.' },
  { prompt: 'How many more visits is 20 than 17?', answer: [3], labels: ['extra visits'], explanation: '20 − 17 = 3: gym A gives 3 more visits for the same money.' }
 ]
}, {
 canonical: { y: 150, m1: 6, c1: 30, m2: 8, c2: 14 },
 draw: R => { for (let guard = 0; guard < 60; guard++) {
   const y = 10 * R.int(10, 30), m1 = R.int(4, 9), m2 = R.except(4, 9, [m1]);
   const n1 = Math.floor((y - 10) / m1) - R.int(0, 3), n2 = Math.floor((y - 10) / m2) - R.int(0, 3), c1 = y - m1 * n1, c2 = y - m2 * n2;
   if (n1 !== n2 && c1 !== c2) return { y, m1, c1, m2, c2 };
  } return { y: 150, m1: 6, c1: 30, m2: 8, c2: 14 }; },
 build: ({ y, m1, c1, m2, c2 }) => { const n1 = (y - c1) / m1, n2 = (y - c2) / m2, big = Math.max(n1, n2), small = Math.min(n1, n2), best = n1 > n2 ? 'A' : 'B'; return {
  prompt: `Two gyms. Gym A charges ${n(c1)} dollars to join and ${n(m1)} dollars a visit, so n visits cost A(n) = ${n(m1)}n + ${n(c1)} dollars. Gym B charges ${n(c2)} dollars to join and ${n(m2)} dollars a visit: B(n) = ${n(m2)}n + ${n(c2)} dollars. You have ${n(y)} dollars to spend. Run each rule backwards to find how many visits that money buys. Enter the visits at gym A, then the visits at gym B, then how many more visits the better gym gives.`,
  answer: [n1, n2, big - small],
  hints: [`You know the output, ${n(y)} dollars, and need the input. Each rule multiplies the visits by a number and then adds the joining fee, so its inverse takes the fee away first and then divides by the price of a visit.`, `For gym A work out (${n(y)} − ${n(c1)}) ÷ ${n(m1)}. Do the same for gym B with its own two numbers, then take the smaller count from the larger.`],
  solution: `A multiplies by ${n(m1)}, then adds ${n(c1)}, so A⁻¹(x) = (x − ${n(c1)}) ÷ ${n(m1)}, and A⁻¹(${n(y)}) = (${n(y)} − ${n(c1)}) ÷ ${n(m1)} = ${n(y - c1)} ÷ ${n(m1)} = ${n(n1)} visits. B multiplies by ${n(m2)}, then adds ${n(c2)}, so B⁻¹(x) = (x − ${n(c2)}) ÷ ${n(m2)}, and B⁻¹(${n(y)}) = (${n(y)} − ${n(c2)}) ÷ ${n(m2)} = ${n(y - c2)} ÷ ${n(m2)} = ${n(n2)} visits. Gym ${best} gives ${n(big)} − ${n(small)} = ${n(big - small)} more visits. Check: ${n(m1)} × ${n(n1)} + ${n(c1)} = ${n(y)} and ${n(m2)} × ${n(n2)} + ${n(c2)} = ${n(y)}.`,
  guidance: [
   { prompt: `Gym A: take away the joining fee, then divide by the price of a visit. What is (${n(y)} − ${n(c1)}) ÷ ${n(m1)}?`, answer: [n1], explanation: `${n(y)} − ${n(c1)} = ${n(y - c1)}, and ${n(y - c1)} ÷ ${n(m1)} = ${n(n1)} visits. Check: ${n(m1)} × ${n(n1)} + ${n(c1)} = ${n(y)}.` },
   { prompt: `Gym B, the same way: what is (${n(y)} − ${n(c2)}) ÷ ${n(m2)}?`, answer: [n2], explanation: `${n(y)} − ${n(c2)} = ${n(y - c2)}, and ${n(y - c2)} ÷ ${n(m2)} = ${n(n2)} visits. Check: ${n(m2)} × ${n(n2)} + ${n(c2)} = ${n(y)}.` },
   { prompt: `How many more visits is ${n(big)} than ${n(small)}?`, answer: [big - small], explanation: `${n(big)} − ${n(small)} = ${n(big - small)}: gym ${best} gives ${n(big - small)} more visits for the same money.` }
  ] }; }
});

/* q38d undoing a chain g(f(n)) (q37), last rule first: f(n) = m n + c, g(p) = k p, board y = k(m n + c). c differs from m. y is a parameter. */
add({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q37',
 title: 'The swim gala board',
 brief: 'The outpost swim gala posted only the final boards, and the tower crew wants to know how far their finalist really swam.',
 prompt: 'Swim gala. A swimmer who swims n lengths earns f(n) = 4n + 6 points. In the final, the points are multiplied by 3: g(p) = 3p, so a finalist’s board shows g(f(n)). One finalist’s board shows 126 points. Undo the chain, last rule first: enter her points before they were multiplied, then the number of lengths she swam.',
 answer: [42, 9], labels: ['points before multiplying', 'lengths swum'], tolerance: 0.001,
 hints: [
  'The chain did f first and g second, so undo g first: g multiplied, so divide.',
  'Then undo f on the points you found. f multiplied by 4 and then added 6, so take away 6 first and then divide by 4.'
 ],
 solution: 'The board shows g(f(n)) = 126. Undo g first: g multiplied by 3, so f(n) = 126 ÷ 3 = 42 points. Now undo f, last step first: take away 6, 42 − 6 = 36, then divide by 4: 36 ÷ 4 = 9 lengths. Check: f(9) = 4 × 9 + 6 = 42, and g(42) = 3 × 42 = 126.',
 guidance: [
  { prompt: 'g multiplied the points by 3. Undo it: what is 126 ÷ 3?', answer: [42], labels: ['points before multiplying'], explanation: '126 ÷ 3 = 42: she had 42 points before the final multiplied them.' },
  { prompt: 'Those 42 points are f(n) = 4n + 6. The last thing f did was add 6. Undo that first: what is 42 − 6?', answer: [36], labels: ['points left'], explanation: '42 − 6 = 36, so 4n = 36.' },
  { prompt: 'f multiplied the lengths by 4. What is 36 ÷ 4?', answer: [9], labels: ['lengths swum'], explanation: '36 ÷ 4 = 9 lengths. Check: 3 × (4 × 9 + 6) = 126.' }
 ]
}, {
 canonical: { m: 4, c: 6, k: 3, y: 126 },
 draw: R => { const m = R.int(2, 6), c = R.except(2, 12, [m]), k = R.int(2, 4); return { m, c, k, y: k * (m * R.int(4, 20) + c) }; },
 build: ({ m, c, k, y }) => { const P = y / k, L = (P - c) / m; return {
  prompt: `Swim gala. A swimmer who swims n lengths earns f(n) = ${n(m)}n + ${n(c)} points. In the final, the points are multiplied by ${n(k)}: g(p) = ${n(k)}p, so a finalist’s board shows g(f(n)). One finalist’s board shows ${n(y)} points. Undo the chain, last rule first: enter her points before they were multiplied, then the number of lengths she swam.`,
  answer: [P, L],
  hints: ['The chain did f first and g second, so undo g first: g multiplied, so divide.', `Then undo f on the points you found. f multiplied by ${n(m)} and then added ${n(c)}, so take away ${n(c)} first and then divide by ${n(m)}.`],
  solution: `The board shows g(f(n)) = ${n(y)}. Undo g first: g multiplied by ${n(k)}, so f(n) = ${n(y)} ÷ ${n(k)} = ${n(P)} points. Now undo f, last step first: take away ${n(c)}, ${n(P)} − ${n(c)} = ${n(P - c)}, then divide by ${n(m)}: ${n(P - c)} ÷ ${n(m)} = ${n(L)} lengths. Check: f(${n(L)}) = ${n(m)} × ${n(L)} + ${n(c)} = ${n(P)}, and g(${n(P)}) = ${n(k)} × ${n(P)} = ${n(y)}.`,
  guidance: [
   { prompt: `g multiplied the points by ${n(k)}. Undo it: what is ${n(y)} ÷ ${n(k)}?`, answer: [P], explanation: `${n(y)} ÷ ${n(k)} = ${n(P)}: she had ${n(P)} points before the final multiplied them.` },
   { prompt: `Those ${n(P)} points are f(n) = ${n(m)}n + ${n(c)}. The last thing f did was add ${n(c)}. Undo that first: what is ${n(P)} − ${n(c)}?`, answer: [P - c], explanation: `${n(P)} − ${n(c)} = ${n(P - c)}, so ${n(m)}n = ${n(P - c)}.` },
   { prompt: `f multiplied the lengths by ${n(m)}. What is ${n(P - c)} ÷ ${n(m)}?`, answer: [L], explanation: `${n(P - c)} ÷ ${n(m)} = ${n(L)} lengths. Check: ${n(k)} × (${n(m)} × ${n(L)} + ${n(c)}) = ${n(y)}.` }
  ] }; }
});

/* q39b the base is not stated: it is read from three counts S, S b, S b² (hours 0, 1, 2). Then S × b^e and log_b(T ÷ S) = k, with e and k both at least 3 (beyond the listed hours) and different, so base × exponent, factor ÷ base and adding the hourly gap all miss. T is a parameter. */
add({
 id: 'q39b', parent: 'q39', kind: 'setting',
 title: 'The germ count',
 brief: 'The tower galley’s cleaning cloth was tested for germs, and the medic needs to know how fast the count is growing.',
 prompt: 'Kitchen hygiene test. The germs on a damp cloth were counted each hour: 40 at the start, 120 after 1 hour and 360 after 2 hours. The count is multiplied by the same number every hour. Enter that number, then the count after 4 hours, then the number of hours after the start at which the count reaches 9720. Type each number without commas.',
 answer: [3, 3240, 5], labels: ['number it is multiplied by each hour', 'count after those hours', 'hours to reach the target'], tolerance: 0.001,
 hints: [
  'Divide one count by the count an hour before it, for example 120 ÷ 40. The result is the number the count is multiplied by each hour. It is not the gap between two counts: this count grows by multiplying, not by adding.',
  'After 4 hours the starting count has been multiplied by that number 4 times. For the last box, divide 9720 by the starting count to get the growth factor, then count how many copies of the hourly number multiply together to make it.'
 ],
 solution: '120 ÷ 40 = 3, and 360 ÷ 120 = 3 too, so the count is multiplied by 3 every hour. After 4 hours: 3⁴ = 3 × 3 × 3 × 3 = 81, and 40 × 81 = 3240 germs. To reach 9720 the count must grow by a factor of 9720 ÷ 40 = 243, and 3 × 3 × 3 × 3 × 3 = 243, so log₃ 243 = 5: it takes 5 hours.',
 guidance: [
  { prompt: 'What is 120 ÷ 40? That is the number the count is multiplied by each hour.', answer: [3], labels: ['hourly multiplier'], explanation: '120 ÷ 40 = 3. The next pair agrees: 360 ÷ 120 = 3.' },
  { prompt: 'After 4 hours the count is 40 × 3⁴, and 3⁴ = 3 × 3 × 3 × 3 = 81. What is 40 × 81?', answer: [3240], labels: ['count'], explanation: '40 × 81 = 3240 germs.' },
  { prompt: '9720 ÷ 40 = 243. How many times must you multiply by 3 to reach 243? That count is log₃ 243.', answer: [5], labels: ['hours'], explanation: '3 × 3 × 3 × 3 × 3 = 243, which is 5 copies of 3, so log₃ 243 = 5.' }
 ]
}, {
 canonical: { b: 3, S: 40, e: 4, T: 9720 },
 draw: R => { const b = R.pick([2, 3, 5]), top = { 2: 7, 3: 5, 5: 4 }[b], e = R.int(3, top), k = R.except(3, top, [e]), S = 10 * R.int(2, 5); return { b, S, e, T: S * b ** k }; },
 build: ({ b, S, e, T }) => { const be = b ** e, out = S * be, F = T / S, k = Math.round(Math.log(F) / Math.log(b)); return {
  prompt: `Kitchen hygiene test. The germs on a damp cloth were counted each hour: ${n(S)} at the start, ${n(S * b)} after 1 hour and ${n(S * b * b)} after 2 hours. The count is multiplied by the same number every hour. Enter that number, then the count after ${n(e)} hours, then the number of hours after the start at which the count reaches ${n(T)}. Type each number without commas.`,
  answer: [b, out, k],
  hints: [`Divide one count by the count an hour before it, for example ${n(S * b)} ÷ ${n(S)}. The result is the number the count is multiplied by each hour. It is not the gap between two counts: this count grows by multiplying, not by adding.`, `After ${n(e)} hours the starting count has been multiplied by that number ${n(e)} times. For the last box, divide ${n(T)} by the starting count to get the growth factor, then count how many copies of the hourly number multiply together to make it.`],
  solution: `${n(S * b)} ÷ ${n(S)} = ${n(b)}, and ${n(S * b * b)} ÷ ${n(S * b)} = ${n(b)} too, so the count is multiplied by ${n(b)} every hour. After ${n(e)} hours: ${n(b)}${sup(e)} = ${times(b, e)} = ${n(be)}, and ${n(S)} × ${n(be)} = ${n(out)} germs. To reach ${n(T)} the count must grow by a factor of ${n(T)} ÷ ${n(S)} = ${n(F)}, and ${times(b, k)} = ${n(F)}, so log${sub(b)} ${n(F)} = ${n(k)}: it takes ${n(k)} hours.`,
  guidance: [
   { prompt: `What is ${n(S * b)} ÷ ${n(S)}? That is the number the count is multiplied by each hour.`, answer: [b], explanation: `${n(S * b)} ÷ ${n(S)} = ${n(b)}. The next pair agrees: ${n(S * b * b)} ÷ ${n(S * b)} = ${n(b)}.` },
   { prompt: `After ${n(e)} hours the count is ${n(S)} × ${n(b)}${sup(e)}, and ${n(b)}${sup(e)} = ${times(b, e)} = ${n(be)}. What is ${n(S)} × ${n(be)}?`, answer: [out], explanation: `${n(S)} × ${n(be)} = ${n(out)} germs.` },
   { prompt: `${n(T)} ÷ ${n(S)} = ${n(F)}. How many times must you multiply by ${n(b)} to reach ${n(F)}? That count is log${sub(b)} ${n(F)}.`, answer: [k], explanation: `${times(b, k)} = ${n(F)}, which is ${n(k)} copies of ${n(b)}, so log${sub(b)} ${n(F)} = ${n(k)}.` }
  ] }; }
});

/* q39c growth by doubling where one stage is a period of P years: years ÷ P stages, S × 2^e, and log₂(T ÷ S) = k doublings, k × P years. e (3..5) and k (3..7) differ. The stated years Y and target T are parameters. */
add({
 id: 'q39c', parent: 'q39', kind: 'applied',
 title: 'The doubling bond',
 brief: 'The crew’s welfare fund is going into a long-term bond, and the treasurer wants its value later on and the wait for a target.',
 prompt: 'Savings bond. A long-term bond doubles the money in it every 8 years. Today 300 dollars are paid in and then left alone. Enter the bond’s value in dollars after 24 years. Then enter how many years after today it takes to be worth 9600 dollars. Type each number without commas.',
 answer: [2400, 40], labels: ['value after those years (dollars)', 'years to reach the target'], tolerance: 0.001,
 hints: [
  'Count the doublings first: 24 years hold 24 ÷ 8 doubling periods. Each period multiplies the money by 2, so that many copies of 2 are multiplied together.',
  'For the second box, find the growth factor 9600 ÷ 300, count how many 2s multiply together to make it, and remember that each doubling takes 8 years.'
 ],
 solution: '24 ÷ 8 = 3 doubling periods. 2³ = 2 × 2 × 2 = 8, so after 24 years the bond is worth 300 × 8 = 2400 dollars. To reach 9600 dollars the money must grow by a factor of 9600 ÷ 300 = 32, and 2 × 2 × 2 × 2 × 2 = 32, so log₂ 32 = 5 doublings. Each one takes 8 years: 5 × 8 = 40 years.',
 guidance: [
  { prompt: 'How many doubling periods fit into 24 years? Work out 24 ÷ 8.', answer: [3], labels: ['doubling periods'], explanation: '24 ÷ 8 = 3, so the money doubles 3 times.' },
  { prompt: '2³ = 2 × 2 × 2 = 8. What is 300 × 8?', answer: [2400], labels: ['value (dollars)'], explanation: '300 × 8 = 2400 dollars.' },
  { prompt: '9600 ÷ 300 = 32. How many 2s multiply together to make 32? Enter that count, log₂ 32, then the years it takes: the count times 8.', answer: [5, 40], labels: ['doublings', 'years'], explanation: '2 × 2 × 2 × 2 × 2 = 32, which is 5 copies of 2, so log₂ 32 = 5 doublings. 5 × 8 = 40 years.' }
 ]
}, {
 canonical: { P: 8, S: 300, Y: 24, T: 9600 },
 draw: R => { const P = R.pick([6, 8, 9, 10, 12]), S = 100 * R.int(1, 5), e = R.int(3, 5), k = R.except(3, 7, [e]); return { P, S, Y: e * P, T: S * 2 ** k }; },
 build: ({ P, S, Y, T }) => { const e = Y / P, be = 2 ** e, out = S * be, F = T / S, k = Math.round(Math.log2(F)), years = k * P; return {
  prompt: `Savings bond. A long-term bond doubles the money in it every ${n(P)} years. Today ${n(S)} dollars are paid in and then left alone. Enter the bond’s value in dollars after ${n(Y)} years. Then enter how many years after today it takes to be worth ${n(T)} dollars. Type each number without commas.`,
  answer: [out, years],
  hints: [`Count the doublings first: ${n(Y)} years hold ${n(Y)} ÷ ${n(P)} doubling periods. Each period multiplies the money by 2, so that many copies of 2 are multiplied together.`, `For the second box, find the growth factor ${n(T)} ÷ ${n(S)}, count how many 2s multiply together to make it, and remember that each doubling takes ${n(P)} years.`],
  solution: `${n(Y)} ÷ ${n(P)} = ${n(e)} doubling periods. 2${sup(e)} = ${times(2, e)} = ${n(be)}, so after ${n(Y)} years the bond is worth ${n(S)} × ${n(be)} = ${n(out)} dollars. To reach ${n(T)} dollars the money must grow by a factor of ${n(T)} ÷ ${n(S)} = ${n(F)}, and ${times(2, k)} = ${n(F)}, so log₂ ${n(F)} = ${n(k)} doublings. Each one takes ${n(P)} years: ${n(k)} × ${n(P)} = ${n(years)} years.`,
  guidance: [
   { prompt: `How many doubling periods fit into ${n(Y)} years? Work out ${n(Y)} ÷ ${n(P)}.`, answer: [e], explanation: `${n(Y)} ÷ ${n(P)} = ${n(e)}, so the money doubles ${n(e)} times.` },
   { prompt: `2${sup(e)} = ${times(2, e)} = ${n(be)}. What is ${n(S)} × ${n(be)}?`, answer: [out], explanation: `${n(S)} × ${n(be)} = ${n(out)} dollars.` },
   { prompt: `${n(T)} ÷ ${n(S)} = ${n(F)}. How many 2s multiply together to make ${n(F)}? Enter that count, log₂ ${n(F)}, then the years it takes: the count times ${n(P)}.`, answer: [k, years], explanation: `${times(2, k)} = ${n(F)}, which is ${n(k)} copies of 2, so log₂ ${n(F)} = ${n(k)} doublings. ${n(k)} × ${n(P)} = ${n(years)} years.` }
  ] }; }
});

/* q39d two banks of e1 and e2 stages: b^e1 × b^e2 = b^(e1 + e2) (q30), then S × b^(e1 + e2), then the extra stages x = log_b(T ÷ strength). e1 and e2 are not both 2 (2 + 2 = 2 × 2), and never a pair of exponents the q30 lesson itself works out (2³ × 2⁴, 2⁴ × 2⁵, 3² × 3³, in either order). Base 2 has 2 to 4 stages in a bank; base 3 always has 6 stages in all (2 + 4, 4 + 2 or 3 + 3), which keeps the numbers small. x is 3 or 4 for base 2 and 2 for base 3, so (growth ÷ base) is never x. T is a parameter. */
add({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q30',
 title: 'Two relay banks',
 brief: 'Two relay banks now stand in a row on the ridge, and the far station still needs a stronger signal than they give.',
 prompt: 'Relay banks. Every relay stage multiplies a signal’s strength by 2. The signal passes bank A, which has 2 stages, and then bank B, which has 4 stages, so the two banks together multiply it by 2² × 2⁴. Write that as one power of 2 and enter its exponent. A signal of 5 units goes in: enter its strength after both banks. The far station needs 5120 units: enter how many more stages must be added after bank B. Type each number without commas.',
 answer: [6, 320, 4], labels: ['exponent of the one power', 'strength after both banks (units)', 'more stages needed'], tolerance: 0.001,
 hints: [
  'Multiplying powers of the same base adds the exponents: count all the 2s being multiplied together. Then work that power out one step at a time and multiply the starting strength by it.',
  'For the last box, divide 5120 by the strength after both banks. That is the growth still needed. Count how many 2s multiply together to make it. If the division is awkward, keep multiplying the strength by 2 until you reach 5120, and count the steps.'
 ],
 solution: '2² × 2⁴ is 2 copies of 2 times 4 more, 6 copies in all: 2⁶, so the exponent is 6. 2⁶ = 2 × 2 × 2 × 2 × 2 × 2 = 64, so the signal leaves bank B at 5 × 64 = 320 units. It still has to grow by a factor of 5120 ÷ 320 = 16, and 2 × 2 × 2 × 2 = 16, so log₂ 16 = 4: 4 more stages are needed.',
 guidance: [
  { prompt: '2² × 2⁴ is 2 copies of 2 multiplied by 4 more. How many copies of 2 is that in all?', answer: [6], labels: ['exponent'], explanation: '2 + 4 = 6, so the two banks together multiply by 2⁶.' },
  { prompt: '2⁶ = 2 × 2 × 2 × 2 × 2 × 2 = 64. What is 5 × 64?', answer: [320], labels: ['strength (units)'], explanation: '5 × 64 = 320 units.' },
  { prompt: 'The far station needs 5120 units and the signal has 320. What is 5120 ÷ 320? That is the growth still needed.', answer: [16], labels: ['growth still needed'], explanation: '5120 ÷ 320 = 16: the signal must become 16 times stronger. Check: 320 × 16 = 5120.' },
  { prompt: 'How many times must you multiply by 2 to reach 16? That count is log₂ 16.', answer: [4], labels: ['more stages'], explanation: '2 × 2 × 2 × 2 = 16, which is 4 copies of 2, so log₂ 16 = 4 more stages.' }
 ]
}, {
 canonical: { b: 2, S: 5, e1: 2, e2: 4, T: 5120 },
 draw: R => { const b = R.pick([2, 3]), [e1, e2] = R.pick(b === 2 ? [[2, 3], [3, 2], [2, 4], [4, 2], [3, 3], [4, 4]] : [[2, 4], [4, 2], [3, 3]]), E = e1 + e2;
  const x = b === 2 ? R.int(3, 4) : 2, S = b === 2 ? R.int(3, 9) : R.int(2, 4); return { b, S, e1, e2, T: S * b ** (E + x) }; },
 build: ({ b, S, e1, e2, T }) => { const E = e1 + e2, bE = b ** E, out = S * bE, F = T / out, x = Math.round(Math.log(F) / Math.log(b)); return {
  prompt: `Relay banks. Every relay stage multiplies a signal’s strength by ${n(b)}. The signal passes bank A, which has ${n(e1)} stages, and then bank B, which has ${n(e2)} stages, so the two banks together multiply it by ${n(b)}${sup(e1)} × ${n(b)}${sup(e2)}. Write that as one power of ${n(b)} and enter its exponent. A signal of ${n(S)} units goes in: enter its strength after both banks. The far station needs ${n(T)} units: enter how many more stages must be added after bank B. Type each number without commas.`,
  answer: [E, out, x],
  hints: [`Multiplying powers of the same base adds the exponents: count all the ${n(b)}s being multiplied together. Then work that power out one step at a time and multiply the starting strength by it.`, `For the last box, divide ${n(T)} by the strength after both banks. That is the growth still needed. Count how many ${n(b)}s multiply together to make it. If the division is awkward, keep multiplying the strength by ${n(b)} until you reach ${n(T)}, and count the steps.`],
  solution: `${n(b)}${sup(e1)} × ${n(b)}${sup(e2)} is ${n(e1)} copies of ${n(b)} times ${n(e2)} more, ${n(E)} copies in all: ${n(b)}${sup(E)}, so the exponent is ${n(E)}. ${n(b)}${sup(E)} = ${times(b, E)} = ${n(bE)}, so the signal leaves bank B at ${n(S)} × ${n(bE)} = ${n(out)} units. It still has to grow by a factor of ${n(T)} ÷ ${n(out)} = ${n(F)}, and ${times(b, x)} = ${n(F)}, so log${sub(b)} ${n(F)} = ${n(x)}: ${n(x)} more stages are needed.`,
  guidance: [
   { prompt: `${n(b)}${sup(e1)} × ${n(b)}${sup(e2)} is ${n(e1)} copies of ${n(b)} multiplied by ${n(e2)} more. How many copies of ${n(b)} is that in all?`, answer: [E], explanation: `${n(e1)} + ${n(e2)} = ${n(E)}, so the two banks together multiply by ${n(b)}${sup(E)}.` },
   { prompt: `${n(b)}${sup(E)} = ${times(b, E)} = ${n(bE)}. What is ${n(S)} × ${n(bE)}?`, answer: [out], explanation: `${n(S)} × ${n(bE)} = ${n(out)} units.` },
   { prompt: `The far station needs ${n(T)} units and the signal has ${n(out)}. What is ${n(T)} ÷ ${n(out)}? That is the growth still needed.`, answer: [F], explanation: `${n(T)} ÷ ${n(out)} = ${n(F)}: the signal must become ${n(F)} times stronger. Check: ${n(out)} × ${n(F)} = ${n(T)}.` },
   { prompt: `How many times must you multiply by ${n(b)} to reach ${n(F)}? That count is log${sub(b)} ${n(F)}.`, answer: [x], explanation: `${times(b, x)} = ${n(F)}, which is ${n(x)} copies of ${n(b)}, so log${sub(b)} ${n(F)} = ${n(x)} more stages.` }
  ] }; }
});

/* q40b the across distance of an arm (arm × cos θ), where the parent asks for the height (arm × sin θ). Triangles are 3-4-5 scaled by k = 2..6 or 7-24-25 scaled by 1 or 2, rise shorter than floor distance; the second escalator is a whole multiple of 5 m (or 25 m) and never as long as the first. Tolerance 0.004 because sin and cos can be exact hundredths. */
add({
 id: 'q40b', parent: 'q40', kind: 'setting',
 title: 'The second escalator',
 brief: 'The supply centre in port is fitting a second escalator at the same slope, and the fitters need to know how much floor it will cover.',
 prompt: 'Shopping centre. An escalator 15 m long carries shoppers up 9 m to the next level; its top is 12 m further along the floor than its foot. Let θ be the angle between the escalator and the floor at its foot. Enter sin θ, then cos θ (each as a decimal or as a fraction). A second escalator, 10 m long, is set at the same angle θ: enter how far along the floor it reaches, in metres.',
 answer: [0.6, 0.8, 8], labels: ['sin θ', 'cos θ', 'floor distance (m)'], tolerance: 0.004,
 hints: [
  'Stand at the foot. The rise is the side across from θ (opposite), the floor distance is the side touching θ (adjacent), and the escalator itself is the longest side. sin θ = opposite ÷ longest; cos θ = adjacent ÷ longest.',
  'An arm of length 1 at angle θ reaches cos θ across. The second escalator is 10 times longer, so it reaches 10 × cos θ across. Write cos θ as a fraction in lowest terms, then divide 10 by its bottom number and multiply by its top number.'
 ],
 solution: 'sin θ = 9 ÷ 15, the fraction 9/15, which is 3/5 in lowest terms, or 0.6 as a decimal. cos θ = 12 ÷ 15, the fraction 12/15, which is 4/5 in lowest terms, or 0.8 as a decimal. The second escalator is an arm of length 10 at the same angle, so it reaches 10 × cos θ = 10 × 4/5 across: 10 ÷ 5 = 2, and 2 × 4 = 8 m along the floor. The across distance goes with cos θ; sin θ would give its height.',
 guidance: [
  { prompt: 'From the foot, the rise (9 m) is opposite θ and the escalator (15 m) is the longest side. What is 9 ÷ 15? You may type it as the fraction 9/15.', answer: [0.6], labels: ['sin θ'], explanation: '9 ÷ 15 is the fraction 9/15, which is 3/5 in lowest terms. So sin θ = 3/5; as a decimal, 3/5 = 6/10 = 0.6.' },
  { prompt: 'The floor distance (12 m) is the side touching θ. What is 12 ÷ 15? You may type it as the fraction 12/15.', answer: [0.8], labels: ['cos θ'], explanation: '12 ÷ 15 is the fraction 12/15, which is 4/5 in lowest terms. So cos θ = 4/5; as a decimal, 4/5 = 8/10 = 0.8.' },
  { prompt: 'The second escalator is 10 m long and cos θ = 4/5. What is 10 × 4/5? Divide 10 by 5, then multiply by 4.', answer: [8], labels: ['floor distance (m)'], explanation: '10 ÷ 5 = 2, and 2 × 4 = 8: an arm 10 times longer than 1 reaches 10 times as far across.' }
 ]
}, {
 canonical: { o: 3, d: 4, h: 5, k: 3, arm: 10 },
 draw: R => { const [o, d, h] = R.pick([[3, 4, 5], [3, 4, 5], [7, 24, 25]]); const k = h === 5 ? R.int(2, 6) : R.int(1, 2); return { o, d, h, k, arm: h === 5 ? 5 * R.except(1, 6, [k]) : 25 * R.except(1, 3, [k]) }; },
 build: ({ o, d, h, k, arm }) => { const H = k * o, D = k * d, L = k * h, s = G.tidy(o / h), c = G.tidy(d / h), per = arm / h, reach = G.tidy(per * d); return {
  prompt: `Shopping centre. An escalator ${n(L)} m long carries shoppers up ${n(H)} m to the next level; its top is ${n(D)} m further along the floor than its foot. Let θ be the angle between the escalator and the floor at its foot. Enter sin θ, then cos θ (each as a decimal or as a fraction). A second escalator, ${n(arm)} m long, is set at the same angle θ: enter how far along the floor it reaches, in metres.`,
  answer: [s, c, reach],
  hints: ['Stand at the foot. The rise is the side across from θ (opposite), the floor distance is the side touching θ (adjacent), and the escalator itself is the longest side. sin θ = opposite ÷ longest; cos θ = adjacent ÷ longest.', `An arm of length 1 at angle θ reaches cos θ across. The second escalator is ${n(arm)} times longer, so it reaches ${n(arm)} × cos θ across. Write cos θ as a fraction in lowest terms, then divide ${n(arm)} by its bottom number and multiply by its top number.`],
  solution: `sin θ = ${n(H)} ÷ ${n(L)}, ${low(H, L, k)}, or ${n(s)} as a decimal. cos θ = ${n(D)} ÷ ${n(L)}, ${low(D, L, k)}, or ${n(c)} as a decimal. The second escalator is an arm of length ${n(arm)} at the same angle, so it reaches ${n(arm)} × cos θ = ${n(arm)} × ${n(d)}/${n(h)} across: ${n(arm)} ÷ ${n(h)} = ${n(per)}, and ${n(per)} × ${n(d)} = ${n(reach)} m along the floor. The across distance goes with cos θ; sin θ would give its height.`,
  guidance: [
   { prompt: `From the foot, the rise (${n(H)} m) is opposite θ and the escalator (${n(L)} m) is the longest side. What is ${n(H)} ÷ ${n(L)}? You may type it as the fraction ${n(H)}/${n(L)}.`, answer: [s], explanation: `${n(H)} ÷ ${n(L)} is ${low(H, L, k)}. So sin θ = ${n(o)}/${n(h)}; as a decimal, ${dec(o, h, s)}.` },
   { prompt: `The floor distance (${n(D)} m) is the side touching θ. What is ${n(D)} ÷ ${n(L)}? You may type it as the fraction ${n(D)}/${n(L)}.`, answer: [c], explanation: `${n(D)} ÷ ${n(L)} is ${low(D, L, k)}. So cos θ = ${n(d)}/${n(h)}; as a decimal, ${dec(d, h, c)}.` },
   { prompt: `The second escalator is ${n(arm)} m long and cos θ = ${n(d)}/${n(h)}. What is ${n(arm)} × ${n(d)}/${n(h)}? Divide ${n(arm)} by ${n(h)}, then multiply by ${n(d)}.`, answer: [reach], explanation: `${n(arm)} ÷ ${n(h)} = ${n(per)}, and ${n(per)} × ${n(d)} = ${n(reach)}: an arm ${n(arm)} times longer than 1 reaches ${n(arm)} times as far across.` }
  ] }; }
});

/* q40c a small triangle from a sign (3-4-5 or 4-3-5 scaled by k = 2..4, or 7-24-25 scaled by 1 or 2) gives sin θ and cos θ; the whole cable (200 to 800 m, a multiple of 100) is the long arm: climb = cable × sin θ, forward = cable × cos θ. Tolerance 0.004 because sin θ can be 0.28. */
add({
 id: 'q40c', parent: 'q40', kind: 'applied',
 title: 'The cable car on the map',
 brief: 'The survey map must show the new cable car line, and a map shows only how far forward a line runs, not how high it climbs.',
 prompt: 'Cable car on the map. A cable car line climbs in a straight line at an angle θ to the flat ground. A sign at the bottom station says that every 25 m of cable climbs 7 m and moves 24 m forward on the map. Enter sin θ (as a decimal or as a fraction). The whole cable is 300 m long: enter the height it climbs in metres, then the forward distance the map shows in metres.',
 answer: [0.28, 84, 288], labels: ['sin θ', 'height climbed (m)', 'forward distance on the map (m)'], tolerance: 0.004,
 hints: [
  'The sign describes a right triangle: the climb is the side across from θ (opposite), the forward distance is the side touching θ (adjacent), and the cable is the longest side. sin θ = opposite ÷ longest.',
  'The whole cable is a longer arm at the same angle: the climb is 300 × sin θ and the forward distance is 300 × cos θ, where cos θ = adjacent ÷ longest. Write each as a fraction in lowest terms, then divide 300 by the bottom number and multiply by the top number.'
 ],
 solution: 'sin θ = 7 ÷ 25, the fraction 7/25, or 0.28 as a decimal. The whole cable is an arm of length 300 at angle θ, so it climbs 300 × sin θ = 300 × 7/25: 300 ÷ 25 = 12, and 12 × 7 = 84 m. cos θ = 24 ÷ 25, the fraction 24/25, so the map shows 300 × cos θ = 300 × 24/25: 12 × 24 = 288 m forward.',
 guidance: [
  { prompt: 'On the sign, the climb (7 m) is opposite θ and the cable (25 m) is the longest side. What is 7 ÷ 25? You may type it as the fraction 7/25.', answer: [0.28], labels: ['sin θ'], explanation: '7 ÷ 25 is the fraction 7/25. So sin θ = 7/25; as a decimal, 7/25 = 28/100 = 0.28.' },
  { prompt: 'The whole cable is 300 m long and sin θ = 7/25. What is 300 × 7/25? Divide 300 by 25, then multiply by 7.', answer: [84], labels: ['height climbed (m)'], explanation: '300 ÷ 25 = 12, and 12 × 7 = 84 m climbed.' },
  { prompt: 'The forward distance on the sign (24 m) touches θ, so cos θ = 24 ÷ 25, which is 24/25. What is 300 × 24/25?', answer: [288], labels: ['forward distance (m)'], explanation: '300 ÷ 25 = 12, and 12 × 24 = 288 m forward on the map.' }
 ]
}, {
 canonical: { o: 7, d: 24, h: 25, k: 1, total: 300 },
 draw: R => { const [o, d, h] = R.pick([[3, 4, 5], [4, 3, 5], [7, 24, 25]]); return { o, d, h, k: h === 5 ? R.int(2, 4) : R.int(1, 2), total: 100 * R.pick([2, 3, 4, 5, 6, 8]) }; },
 build: ({ o, d, h, k, total }) => { const H = k * o, D = k * d, L = k * h, s = G.tidy(o / h), per = total / h, up = G.tidy(per * o), fwd = G.tidy(per * d); return {
  prompt: `Cable car on the map. A cable car line climbs in a straight line at an angle θ to the flat ground. A sign at the bottom station says that every ${n(L)} m of cable climbs ${n(H)} m and moves ${n(D)} m forward on the map. Enter sin θ (as a decimal or as a fraction). The whole cable is ${n(total)} m long: enter the height it climbs in metres, then the forward distance the map shows in metres.`,
  answer: [s, up, fwd],
  hints: ['The sign describes a right triangle: the climb is the side across from θ (opposite), the forward distance is the side touching θ (adjacent), and the cable is the longest side. sin θ = opposite ÷ longest.', `The whole cable is a longer arm at the same angle: the climb is ${n(total)} × sin θ and the forward distance is ${n(total)} × cos θ, where cos θ = adjacent ÷ longest. Write each as a fraction in lowest terms, then divide ${n(total)} by the bottom number and multiply by the top number.`],
  solution: `sin θ = ${n(H)} ÷ ${n(L)}, ${low(H, L, k)}, or ${n(s)} as a decimal. The whole cable is an arm of length ${n(total)} at angle θ, so it climbs ${n(total)} × sin θ = ${n(total)} × ${n(o)}/${n(h)}: ${n(total)} ÷ ${n(h)} = ${n(per)}, and ${n(per)} × ${n(o)} = ${n(up)} m. cos θ = ${n(D)} ÷ ${n(L)}, ${low(D, L, k)}, so the map shows ${n(total)} × cos θ = ${n(total)} × ${n(d)}/${n(h)}: ${n(per)} × ${n(d)} = ${n(fwd)} m forward.`,
  guidance: [
   { prompt: `On the sign, the climb (${n(H)} m) is opposite θ and the cable (${n(L)} m) is the longest side. What is ${n(H)} ÷ ${n(L)}? You may type it as the fraction ${n(H)}/${n(L)}.`, answer: [s], explanation: `${n(H)} ÷ ${n(L)} is ${low(H, L, k)}. So sin θ = ${n(o)}/${n(h)}; as a decimal, ${dec(o, h, s)}.` },
   { prompt: `The whole cable is ${n(total)} m long and sin θ = ${n(o)}/${n(h)}. What is ${n(total)} × ${n(o)}/${n(h)}? Divide ${n(total)} by ${n(h)}, then multiply by ${n(o)}.`, answer: [up], explanation: `${n(total)} ÷ ${n(h)} = ${n(per)}, and ${n(per)} × ${n(o)} = ${n(up)} m climbed.` },
   { prompt: `The forward distance on the sign (${n(D)} m) touches θ, so cos θ = ${n(D)} ÷ ${n(L)}, which is ${n(d)}/${n(h)}. What is ${n(total)} × ${n(d)}/${n(h)}?`, answer: [fwd], explanation: `${n(total)} ÷ ${n(h)} = ${n(per)}, and ${n(per)} × ${n(d)} = ${n(fwd)} m forward on the map.` }
  ] }; }
});

/* q40d the longest side is not given: Pythagoras’ rule (q20) finds it, then sin θ and cos θ. Triangles are 3-4-5 or 4-3-5 scaled by k = 4, 5 or 10, or the bare 7-24-25 or 24-7-25. Never a triangle met before: the bare 3, 4, 5 of the q20 lesson, the 6, 8, 10 of the q20 mission, the 9, 12, 15 of q20b, or the 18, 24, 30 of the q40 mission itself. Tolerance 0.004 because sin and cos can be exact hundredths. */
add({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q20',
 title: 'The barn rafter',
 brief: 'The barn roof by the tower needs new rafters, and the plan gives the rise and the level distance but not the rafter itself.',
 prompt: 'Roof frame. A straight rafter runs from the top of a wall up to the ridge of a barn roof. The ridge is 12 m higher than the wall top and 16 m across from it, measured level. The rafter’s length is not on the plan: find it with Pythagoras’ rule. Then let θ be the angle between the rafter and the level line at the wall top. Enter the rafter’s length in metres, then sin θ, then cos θ (each as a decimal or as a fraction).',
 answer: [20, 0.6, 0.8], labels: ['rafter length (m)', 'sin θ', 'cos θ'], tolerance: 0.004,
 hints: [
  'The rise and the level distance are the two short sides of a right triangle, and the rafter is its longest side. Multiply each short side by itself, add the two results, and take the square root of the sum.',
  'Stand at the wall top. The rise is across from θ (opposite) and the level distance touches θ (adjacent). sin θ = opposite ÷ longest and cos θ = adjacent ÷ longest, with the rafter you found as the longest side.'
 ],
 solution: '12 × 12 + 16 × 16 = 144 + 256 = 400, and 20 × 20 = 400, so the rafter is 20 m long. sin θ = 12 ÷ 20, the fraction 12/20, which is 3/5 in lowest terms, or 0.6 as a decimal. cos θ = 16 ÷ 20, the fraction 16/20, which is 4/5 in lowest terms, or 0.8 as a decimal.',
 guidance: [
  { prompt: 'Multiply each short side by itself and add: what is 12 × 12 + 16 × 16?', answer: [400], labels: ['sum of the two results'], explanation: '12 × 12 = 144 and 16 × 16 = 256; together 400. That is the rafter’s length multiplied by itself.' },
  { prompt: 'Which number multiplied by itself gives 400? That square root is the rafter’s length.', answer: [20], labels: ['rafter length (m)'], explanation: '20 × 20 = 400, so the rafter is 20 m long.' },
  { prompt: 'From the wall top, the rise (12 m) is opposite θ and the rafter (20 m) is the longest side. What is 12 ÷ 20? You may type it as the fraction 12/20.', answer: [0.6], labels: ['sin θ'], explanation: '12 ÷ 20 is the fraction 12/20, which is 3/5 in lowest terms. So sin θ = 3/5; as a decimal, 3/5 = 6/10 = 0.6.' },
  { prompt: 'The level distance (16 m) is the side touching θ. What is 16 ÷ 20? You may type it as the fraction 16/20.', answer: [0.8], labels: ['cos θ'], explanation: '16 ÷ 20 is the fraction 16/20, which is 4/5 in lowest terms. So cos θ = 4/5; as a decimal, 4/5 = 8/10 = 0.8.' }
 ]
}, {
 canonical: { o: 3, d: 4, h: 5, k: 4 },
 draw: R => { const [o, d, h] = R.pick([[3, 4, 5], [3, 4, 5], [4, 3, 5], [4, 3, 5], [7, 24, 25], [24, 7, 25]]); return { o, d, h, k: h === 5 ? R.pick([4, 5, 10]) : 1 }; },
 build: ({ o, d, h, k }) => { const H = k * o, D = k * d, L = k * h, s = G.tidy(o / h), c = G.tidy(d / h), sum = H * H + D * D; return {
  prompt: `Roof frame. A straight rafter runs from the top of a wall up to the ridge of a barn roof. The ridge is ${n(H)} m higher than the wall top and ${n(D)} m across from it, measured level. The rafter’s length is not on the plan: find it with Pythagoras’ rule. Then let θ be the angle between the rafter and the level line at the wall top. Enter the rafter’s length in metres, then sin θ, then cos θ (each as a decimal or as a fraction).`,
  answer: [L, s, c],
  hints: ['The rise and the level distance are the two short sides of a right triangle, and the rafter is its longest side. Multiply each short side by itself, add the two results, and take the square root of the sum.', 'Stand at the wall top. The rise is across from θ (opposite) and the level distance touches θ (adjacent). sin θ = opposite ÷ longest and cos θ = adjacent ÷ longest, with the rafter you found as the longest side.'],
  solution: `${n(H)} × ${n(H)} + ${n(D)} × ${n(D)} = ${n(H * H)} + ${n(D * D)} = ${n(sum)}, and ${n(L)} × ${n(L)} = ${n(sum)}, so the rafter is ${n(L)} m long. sin θ = ${n(H)} ÷ ${n(L)}, ${low(H, L, k)}, or ${n(s)} as a decimal. cos θ = ${n(D)} ÷ ${n(L)}, ${low(D, L, k)}, or ${n(c)} as a decimal.`,
  guidance: [
   { prompt: `Multiply each short side by itself and add: what is ${n(H)} × ${n(H)} + ${n(D)} × ${n(D)}?`, answer: [sum], explanation: `${n(H)} × ${n(H)} = ${n(H * H)} and ${n(D)} × ${n(D)} = ${n(D * D)}; together ${n(sum)}. That is the rafter’s length multiplied by itself.` },
   { prompt: `Which number multiplied by itself gives ${n(sum)}? That square root is the rafter’s length.`, answer: [L], explanation: `${n(L)} × ${n(L)} = ${n(sum)}, so the rafter is ${n(L)} m long.` },
   { prompt: `From the wall top, the rise (${n(H)} m) is opposite θ and the rafter (${n(L)} m) is the longest side. What is ${n(H)} ÷ ${n(L)}? You may type it as the fraction ${n(H)}/${n(L)}.`, answer: [s], explanation: `${n(H)} ÷ ${n(L)} is ${low(H, L, k)}. So sin θ = ${n(o)}/${n(h)}; as a decimal, ${dec(o, h, s)}.` },
   { prompt: `The level distance (${n(D)} m) is the side touching θ. What is ${n(D)} ÷ ${n(L)}? You may type it as the fraction ${n(D)}/${n(L)}.`, answer: [c], explanation: `${n(D)} ÷ ${n(L)} is ${low(D, L, k)}. So cos θ = ${n(d)}/${n(h)}; as a decimal, ${dec(d, h, c)}.` }
  ] }; }
});
})();
