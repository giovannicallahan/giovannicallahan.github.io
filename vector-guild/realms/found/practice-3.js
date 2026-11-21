/* Foundations practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d ... q15b q15c q15d). Format and rules: docs/PACK-FORMAT.md, "Practice missions".
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/found/oracle-p3.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* In this file the authored text of a mission IS its generator's build(canonical), cleaned the way the engine cleans
   generated text, so the two cannot drift apart. make(fields, guideLabels, generator):
     fields       id, parent, kind, title, brief, labels, tolerance (and uses for a challenge)
     guideLabels  the answer-box labels of each guided step, in order
     generator    {canonical, draw(R), build(p)} as in docs/PACK-FORMAT.md §3
   To read a mission as the player sees it: node qa/show-mission.js <id> --realm found --draw 3 */
const make = (fields, guideLabels, generator) => {
 const b = generator.build(generator.canonical);
 const { id, parent, kind, title, brief, labels, tolerance, uses } = fields;
 const mission = { id, parent, kind, title, brief, prompt: G.clean(b.prompt), answer: b.answer.map(G.tidy), labels, tolerance,
  hints: b.hints.map(G.clean), solution: G.clean(b.solution),
  guidance: b.guidance.map((step, i) => ({ prompt: G.clean(step.prompt), answer: step.answer.map(G.tidy), labels: guideLabels[i], explanation: G.clean(step.explanation) })) };
 if (uses) mission.uses = uses;
 add(mission, generator);
};
/* Largest whole number that divides both a and b. */
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* All answers in this file are whole numbers and must be typed exactly. */
const EXACT = 0.001;

/* ---- q11 Percent (taught: 1% = amount ÷ 100, then multiply; the rest is the whole minus the part).
        Every amount is a multiple of 100, so 1% is a whole number: multiplying decimals is not taught yet. ---- */
make({ id: 'q11b', parent: 'q11', kind: 'setting',
 title: 'The sale tag on the coat',
 brief: 'A sale tag gives a percent off, and you want to know the money before you reach the till.',
 labels: ['dollars taken off', 'sale price ($)'], tolerance: EXACT },
 [['dollars in 1%'], ['dollars taken off'], ['sale price ($)']], {
 canonical: { C: 300, p: 15 },
 /* C is at least 200, so reading "15%" as "15 dollars" never gives the right amount. Never 50% off: the two answers would be the same number. */
 draw: R => ({ C: R.pick([200, 300, 400, 500, 600, 700, 800, 900, 1200]), p: 5 * R.except(1, 14, [10]) }),
 build: ({ C, p }) => { const o = C / 100, D = p * o, S = C - D; return {
  prompt: `A winter coat is priced at $${n(C)}. The sale tag says ${n(p)}% off. Enter the dollars taken off the price, then the sale price in dollars. Type each number without commas.`,
  answer: [D, S],
  hints: [`Find 1% of the price first: ${n(C)} ÷ 100.`, `The money taken off is ${n(p)} times 1% of the price. The sale price is what is left of the $${n(C)}.`],
  solution: `1% of $${n(C)} is ${n(C)} ÷ 100 = $${n(o)}, so ${n(p)}% is ${n(p)} × ${n(o)} = $${n(D)} taken off. Sale price: ${n(C)} − ${n(D)} = $${n(S)}, which is the other ${n(100 - p)}% of the price.`,
  guidance: [
   { prompt: `What is 1% of $${n(C)}? Work out ${n(C)} ÷ 100.`, answer: [o], explanation: `Percent means out of every hundred: $${n(C)} split into 100 equal parts gives $${n(o)} per part.` },
   { prompt: `${n(p)}% off is ${n(p)} of those parts. How many dollars are taken off?`, answer: [D], explanation: `${n(p)} × ${n(o)} = $${n(D)}.` },
   { prompt: `What is the sale price? Take the $${n(D)} off the $${n(C)}.`, answer: [S], explanation: `${n(C)} − ${n(D)} = $${n(S)}. Check: ${n(100 - p)} × ${n(o)} = ${n(S)} too.` }
  ] }; }
});

make({ id: 'q11c', parent: 'q11', kind: 'applied',
 title: 'Reading the pay slip',
 brief: 'A pay slip lists two deductions as percents, and you want to see where the money goes.',
 labels: ['tax ($)', 'pension ($)', 'take-home pay ($)'], tolerance: EXACT },
 [['dollars in 1%'], ['tax ($)', 'pension ($)'], ['take-home pay ($)']], {
 canonical: { P: 2400, t: 20, s: 5 },
 draw: R => ({ P: 100 * R.int(15, 40), t: R.pick([10, 15, 20, 25, 30]), s: R.pick([3, 4, 5, 6, 8]) }),
 build: ({ P, t, s }) => { const o = P / 100, T = t * o, S = s * o, H = P - T - S; return {
  prompt: `Your pay slip shows $${n(P)} earned this month. ${n(t)}% of it is taken as tax, and ${n(s)}% of it goes into your pension. Enter the dollars of tax, then the dollars of pension, then the take-home pay that is left. Type each number without commas.`,
  answer: [T, S, H],
  hints: [`Both percents are shares of the full $${n(P)}. Find 1% once: ${n(P)} ÷ 100.`, `Tax is ${n(t)} times 1% and pension is ${n(s)} times 1%. Take both away from the $${n(P)} to get the take-home pay.`],
  solution: `1% of $${n(P)} is ${n(P)} ÷ 100 = $${n(o)}. Tax: ${n(t)} × ${n(o)} = $${n(T)}. Pension: ${n(s)} × ${n(o)} = $${n(S)}. Take-home pay: ${n(P)} − ${n(T)} − ${n(S)} = $${n(H)}. Check: ${n(t)}% and ${n(s)}% make ${n(t + s)}% taken, so ${n(100 - t - s)}% is left, and ${n(100 - t - s)} × ${n(o)} = ${n(H)}.`,
  guidance: [
   { prompt: `What is 1% of $${n(P)}? Work out ${n(P)} ÷ 100.`, answer: [o], explanation: `$${n(P)} split into 100 equal parts gives $${n(o)} per part.` },
   { prompt: `Tax is ${n(t)} of those parts and pension is ${n(s)} of them. Enter the dollars of tax, then the dollars of pension.`, answer: [T, S], explanation: `${n(t)} × ${n(o)} = $${n(T)} of tax, and ${n(s)} × ${n(o)} = $${n(S)} of pension.` },
   { prompt: `Take both away from the pay: ${n(P)} − ${n(T)} − ${n(S)}. What is the take-home pay?`, answer: [H], explanation: `${n(P)} − ${n(T)} = ${n(P - T)}, and ${n(P - T)} − ${n(S)} = $${n(H)}.` }
  ] }; }
});

make({ id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q08',
 title: 'Sugar on the cereal box',
 brief: 'A food label gives sugar as a percent, and you want it as a simple fraction and in grams.',
 labels: ['numerator', 'denominator', 'grams of sugar'], tolerance: EXACT },
 [['largest number dividing both'], ['numerator', 'denominator'], ['grams of sugar']], {
 canonical: { W: 500, p: 24 },
 /* Every percent here shares a factor with 100, so the fraction p/100 always simplifies. */
 draw: R => ({ W: R.pick([200, 300, 400, 500, 600, 800]), p: R.pick([4, 5, 6, 8, 10, 12, 14, 15, 16, 18, 20, 22, 24, 25, 26, 28, 30, 32, 34, 35, 36, 38, 40, 42, 44, 45, 46, 48]) }),
 build: ({ W, p }) => { const g = gcd(p, 100), a = p / g, b = 100 / g, o = W / 100, S = p * o; return {
  prompt: `The label on a ${n(W)} g box of cereal says it is ${n(p)}% sugar. Enter the fraction of the cereal that is sugar in lowest terms, numerator then denominator. Then enter the grams of sugar in the full box.`,
  answer: [a, b, S],
  hints: [`${n(p)}% means ${n(p)} out of every 100, so start from the fraction ${n(p)}/100. Divide the top and the bottom by the largest number that divides both.`, `For the grams, find 1% of the box first: ${n(W)} ÷ 100. Then take ${n(p)} of those parts.`],
  solution: `${n(p)}% is the fraction ${n(p)}/100. The largest number that divides both ${n(p)} and 100 is ${n(g)}: ${n(p)} ÷ ${n(g)} = ${n(a)} and 100 ÷ ${n(g)} = ${n(b)}, so the fraction is ${n(a)}/${n(b)}. 1% of ${n(W)} g is ${n(W)} ÷ 100 = ${n(o)} g, so ${n(p)}% is ${n(p)} × ${n(o)} = ${n(S)} g of sugar.`,
  guidance: [
   { prompt: `${n(p)}% is the fraction ${n(p)}/100. What is the largest number that divides both ${n(p)} and 100 exactly?`, answer: [g], explanation: `${n(p)} = ${n(a)} × ${n(g)} and 100 = ${n(b)} × ${n(g)}, and no number above 1 divides both ${n(a)} and ${n(b)}, so ${n(g)} is the largest.` },
   { prompt: `Divide the top and the bottom of ${n(p)}/100 by ${n(g)}. Enter the numerator, then the denominator.`, answer: [a, b], explanation: `${n(p)} ÷ ${n(g)} = ${n(a)} and 100 ÷ ${n(g)} = ${n(b)}, so ${n(p)}% of the cereal is ${n(a)}/${n(b)} of it.` },
   { prompt: `1% of the ${n(W)} g box is ${n(W)} ÷ 100 = ${n(o)} g. How many grams are ${n(p)}%?`, answer: [S], explanation: `${n(p)} × ${n(o)} = ${n(S)} g of sugar.` }
  ] }; }
});

/* ---- q12 Ratio, rate and proportion (taught: unit rate by dividing, then scale by multiplying). ---- */
make({ id: 'q12b', parent: 'q12', kind: 'setting',
 title: 'Counting your steps',
 brief: 'A fitness band has counted the start of a walk, and you want to know what the whole walk will add up to.',
 labels: ['steps per minute', 'steps in the whole walk'], tolerance: EXACT },
 [['steps per minute'], ['steps in the whole walk']], {
 canonical: { r: 105, m: 6, T: 25 },
 draw: R => ({ r: 5 * R.int(18, 26), m: R.int(3, 8), T: 5 * R.int(3, 9) }),
 build: ({ r, m, T }) => { const L = r * m, out = r * T; return {
  prompt: `A fitness band counted ${n(L)} steps in the first ${n(m)} minutes of your walk. You keep the same steady pace all the way. Enter your pace in steps per minute, then the number of steps in the whole walk if it lasts ${n(T)} minutes from start to finish. Type each number without commas.`,
  answer: [r, out],
  hints: [`A pace in steps per minute is steps divided by minutes: ${n(L)} ÷ ${n(m)}.`, `At the same pace, ${n(T)} minutes hold ${n(T)} times the steps of one minute.`],
  solution: `Pace: ${n(L)} steps ÷ ${n(m)} min = ${n(r)} steps per minute. The ratio of steps to minutes stays the same, so ${n(T)} minutes hold ${n(r)} × ${n(T)} = ${n(out)} steps. Check: ${n(out)}/${n(T)} and ${n(L)}/${n(m)} both simplify to ${n(r)}/1.`,
  guidance: [
   { prompt: `How many steps do you take in one minute? Work out ${n(L)} ÷ ${n(m)}.`, answer: [r], explanation: `${n(L)} steps shared equally over ${n(m)} minutes is ${n(r)} steps each minute.` },
   { prompt: `At ${n(r)} steps per minute, how many steps in ${n(T)} minutes?`, answer: [out], explanation: `${n(r)} × ${n(T)} = ${n(out)} steps.` }
  ] }; }
});

make({ id: 'q12c', parent: 'q12', kind: 'applied',
 title: 'Rice for a bigger table',
 brief: 'A recipe is written for a small table, and tonight there are more people to feed.',
 labels: ['grams of rice for one person', 'grams of rice for everyone', 'millilitres of water for everyone'], tolerance: EXACT },
 [['grams of rice for one person'], ['grams of rice for everyone'], ['millilitres of water for one person', 'millilitres of water for everyone']], {
 canonical: { s: 4, g: 75, w: 180, N: 10 },
 draw: R => { const s = R.int(2, 6); return { s, g: 5 * R.int(12, 20), w: 10 * R.int(12, 22), N: s + R.int(2, 8) }; },
 build: ({ s, g, w, N }) => { const A = s * g, B = s * w; return {
  prompt: `A recipe for ${n(s)} people uses ${n(A)} g of rice and ${n(B)} millilitres (ml) of water. Tonight you are cooking for ${n(N)} people, and each person gets the same amounts as in the recipe. Enter the grams of rice for one person, then the grams of rice for ${n(N)} people, then the millilitres of water for ${n(N)} people. Type each number without commas.`,
  answer: [g, g * N, w * N],
  hints: [`Find the amount for one person first: divide each recipe amount by ${n(s)}.`, `Then scale up: multiply each amount for one person by ${n(N)}.`],
  solution: `Rice for one person: ${n(A)} ÷ ${n(s)} = ${n(g)} g. For ${n(N)} people: ${n(g)} × ${n(N)} = ${n(g * N)} g. Water for one person: ${n(B)} ÷ ${n(s)} = ${n(w)} ml. For ${n(N)} people: ${n(w)} × ${n(N)} = ${n(w * N)} ml. Check: ${n(g * N)}/${n(N)} and ${n(A)}/${n(s)} both simplify to ${n(g)}/1.`,
  guidance: [
   { prompt: `How many grams of rice does one person get? Work out ${n(A)} ÷ ${n(s)}.`, answer: [g], explanation: `${n(A)} g shared equally between ${n(s)} people is ${n(g)} g each.` },
   { prompt: `At ${n(g)} g for each person, how many grams of rice do ${n(N)} people need?`, answer: [g * N], explanation: `${n(g)} × ${n(N)} = ${n(g * N)} g.` },
   { prompt: `Do the same for the water. Enter the millilitres for one person (${n(B)} ÷ ${n(s)}), then the millilitres for ${n(N)} people.`, answer: [w, w * N], explanation: `${n(B)} ÷ ${n(s)} = ${n(w)} ml each, and ${n(w)} × ${n(N)} = ${n(w * N)} ml.` }
  ] }; }
});

make({ id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q04',
 title: 'Hut to hut on the trail map',
 brief: 'A trail map shows two huts, and the walkers need the real distance and the time on foot.',
 labels: ['km for 1 cm of map', 'km between the huts', 'hours of walking'], tolerance: EXACT },
 [['km for 1 cm of map'], ['km between the huts'], ['hours of walking']], {
 canonical: { c: 4, k: 3, d: 8, v: 4 },
 /* c cm of map stand for k × c km; the huts are d cm apart (d is not c); the walking speed v divides the distance,
    is not the same number as k, and gives a walk of 2 to 8 whole hours. */
 draw: R => { for (let i = 0; i < 300; i++) {
   const c = R.int(2, 5), k = R.int(2, 6), d = R.except(3, 9, [c]);
   const speeds = [3, 4, 5, 6].filter(v => v !== k && (k * d) % v === 0 && k * d / v >= 2 && k * d / v <= 8);
   if (speeds.length) return { c, k, d, v: R.pick(speeds) };
  } return { c: 4, k: 3, d: 8, v: 4 }; },
 build: ({ c, k, d, v }) => { const K = k * c, D = k * d, t = D / v; return {
  prompt: `On a trail map, ${n(c)} centimetres (cm) of map stand for ${n(K)} kilometres (km) on the ground. Two huts are ${n(d)} cm apart on the map. Enter the kilometres that 1 cm of map stands for, then the kilometres between the huts. You walk at a steady ${n(v)} km per hour: enter the hours the walk from hut to hut takes.`,
  answer: [k, D, t],
  hints: [`Find what 1 cm stands for: ${n(K)} ÷ ${n(c)}. Then ${n(d)} cm stand for ${n(d)} times as much.`, `Each hour of walking covers ${n(v)} km. The hours are how many lots of ${n(v)} km fit into the distance, so divide the distance by ${n(v)}.`],
  solution: `Scale: ${n(K)} km ÷ ${n(c)} cm = ${n(k)} km for each centimetre of map. The huts are ${n(d)} cm apart, so ${n(k)} × ${n(d)} = ${n(D)} km apart on the ground. Each hour covers ${n(v)} km, so the walk takes ${n(D)} ÷ ${n(v)} = ${n(t)} hours. Check: ${n(t)} hours at ${n(v)} km per hour is ${n(t)} × ${n(v)} = ${n(D)} km.`,
  guidance: [
   { prompt: `How many kilometres does 1 cm of map stand for? Work out ${n(K)} ÷ ${n(c)}.`, answer: [k], explanation: `${n(K)} km shared equally over ${n(c)} cm is ${n(k)} km for each centimetre.` },
   { prompt: `At ${n(k)} km for each centimetre, how many kilometres are ${n(d)} cm of map?`, answer: [D], explanation: `${n(k)} × ${n(d)} = ${n(D)} km between the huts.` },
   { prompt: `Each hour you cover ${n(v)} km. How many hours do ${n(D)} km take? Work out ${n(D)} ÷ ${n(v)}.`, answer: [t], explanation: `${n(D)} ÷ ${n(v)} = ${n(t)} hours, because ${n(t)} lots of ${n(v)} km make ${n(D)} km.` }
  ] }; }
});

/* ---- q13 Variables and expressions (taught: the form (number)letter + (number); count the lots, add what is known). ---- */
make({ id: 'q13b', parent: 'q13', kind: 'setting',
 title: 'This month’s phone bill',
 brief: 'A phone bill can be written down before you know the price of the extra data.',
 labels: ['number in front of g', 'number on its own'], tolerance: EXACT },
 [['extra gigabytes used'], ['dollars added on their own']], {
 canonical: { a: 4, b: 3, d: 18 },
 /* The fixed charge is never the same number as the gigabyte count, so the two answer boxes cannot be confused. */
 draw: R => { const a = R.int(3, 9), b = R.int(2, 6); return { a, b, d: R.except(8, 30, [a + b]) }; },
 build: ({ a, b, d }) => { const k = a + b; return {
  prompt: `Your phone plan charges the same price for every extra gigabyte of data (a gigabyte is a unit of mobile data). You have not looked the price up yet, so call it g dollars. This month you used ${n(a)} extra gigabytes in the first two weeks and ${n(b)} more after that. The plan also has a fixed charge of $${n(d)} a month. Write the month’s bill in dollars as an expression of the form (number)g + (number). Enter the number in front of g, then the number added on its own.`,
  answer: [k, d],
  hints: [`Count all the extra gigabytes used in the month: ${n(a)} + ${n(b)}.`, 'Each extra gigabyte costs g dollars, so the count of gigabytes goes in front of g. The fixed charge is already in dollars, so it is added on its own.'],
  solution: `You used ${n(a)} + ${n(b)} = ${n(k)} extra gigabytes at g dollars each, which is ${n(k)}g dollars, plus the fixed charge of $${n(d)}. The bill is ${n(k)}g + ${n(d)} dollars.`,
  guidance: [
   { prompt: `How many extra gigabytes did you use in the whole month? Work out ${n(a)} + ${n(b)}.`, answer: [k], explanation: `${n(a)} + ${n(b)} = ${n(k)} gigabytes. Each costs g dollars, so together they cost ${n(k)}g dollars.` },
   { prompt: 'The fixed charge does not depend on the data you use. How many dollars does it add on its own?', answer: [d], explanation: `The fixed charge adds $${n(d)} whatever g turns out to be, so the bill is ${n(k)}g + ${n(d)}.` }
  ] }; }
});

make({ id: 'q13c', parent: 'q13', kind: 'applied',
 title: 'Measuring up the garden fence',
 brief: 'A fence has to be measured up before the panels arrive, so its length is written with a letter.',
 labels: ['number in front of p', 'number on its own'], tolerance: EXACT },
 [['panels on the two sides'], ['panels in all'], ['metres of gate']], {
 canonical: { f: 6, s: 4, g: 2 },
 draw: R => ({ f: R.int(4, 12), s: R.int(3, 8), g: R.int(1, 3) }),
 build: ({ f, s, g }) => { const side = 2 * s, k = f + side, gates = 2 * g; return {
  prompt: `You are fencing a garden. Every fence panel has the same width, but the panels have not been delivered yet, so call the width of one panel p metres. The back of the garden needs ${n(f)} panels, and each of the 2 sides needs ${n(s)} panels. The front has no panels, only 2 gates that are each ${n(g)} ${g === 1 ? 'metre' : 'metres'} (m) wide. Write the total length of the panels and gates in metres as an expression of the form (number)p + (number). Enter the number in front of p, then the number added on its own.`,
  answer: [k, gates],
  hints: [`There are 2 sides with ${n(s)} panels each. Count the side panels first, then add the ${n(f)} panels at the back.`, 'Each panel is p metres wide, so the count of panels goes in front of p. The gates are already measured in metres: add their two widths together for the number on its own.'],
  solution: `The two sides need 2 × ${n(s)} = ${n(side)} panels, and the back needs ${n(f)}, so there are ${n(f)} + ${n(side)} = ${n(k)} panels of p metres each: ${n(k)}p metres. The two gates add 2 × ${n(g)} = ${n(gates)} m. The total length is ${n(k)}p + ${n(gates)} metres.`,
  guidance: [
   { prompt: `Each of the 2 sides needs ${n(s)} panels. How many panels do the two sides need together?`, answer: [side], explanation: `2 × ${n(s)} = ${n(side)} panels.` },
   { prompt: `Add the ${n(f)} panels at the back. How many panels are there in all?`, answer: [k], explanation: `${n(f)} + ${n(side)} = ${n(k)} panels. Each is p metres wide, so together they are ${n(k)}p metres.` },
   { prompt: `The 2 gates are each ${n(g)} m wide. How many metres do the gates add on their own?`, answer: [gates], explanation: `2 × ${n(g)} = ${n(gates)} m, whatever p turns out to be, so the expression is ${n(k)}p + ${n(gates)}.` }
  ] }; }
});

make({ id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q03',
 title: 'Weighing the packed fuel crate',
 brief: 'The loader has a weight limit, and a packed fuel crate has to be logged before anyone weighs a can.',
 labels: ['number in front of c', 'number on its own'], tolerance: EXACT },
 [['cans in the crate'], ['kg of empty trays'], ['kg added on their own']], {
 canonical: { t: 4, r: 6, w: 3, W: 15 },
 /* The known weight (t × w + W) is never the same number as the can count (t × r). */
 draw: R => { for (let i = 0; i < 300; i++) {
   const t = R.int(3, 6), r = R.int(4, 9), w = R.int(2, 5), W = R.pick([10, 12, 15, 18, 20, 25]);
   if (t * r !== t * w + W) return { t, r, w, W };
  } return { t: 4, r: 6, w: 3, W: 15 }; },
 build: ({ t, r, w, W }) => { const cans = t * r, trays = t * w, known = trays + W; return {
  prompt: `Fuel store. A crate is packed with ${n(t)} trays, and every tray holds ${n(r)} sealed fuel cans. Nobody has weighed a full can yet, so call its weight c kilograms (kg). Each empty tray weighs ${n(w)} kg, and the empty crate weighs ${n(W)} kg. Write the weight of the packed crate in kilograms as an expression of the form (number)c + (number). Enter the number in front of c, then the number added on its own.`,
  answer: [cans, known],
  hints: [`Count the cans first: ${n(t)} trays of ${n(r)} cans is ${n(t)} × ${n(r)} cans. That count goes in front of c.`, `The number on its own is every weight you already know: ${n(t)} trays of ${n(w)} kg each, and the crate’s ${n(W)} kg.`],
  solution: `The crate holds ${n(t)} × ${n(r)} = ${n(cans)} cans of c kg each, which is ${n(cans)}c kg. The trays weigh ${n(t)} × ${n(w)} = ${n(trays)} kg and the crate weighs ${n(W)} kg, so the known weight is ${n(trays)} + ${n(W)} = ${n(known)} kg. The packed crate weighs ${n(cans)}c + ${n(known)} kg.`,
  guidance: [
   { prompt: `How many cans are in the crate? Work out ${n(t)} × ${n(r)}.`, answer: [cans], explanation: `${n(t)} trays of ${n(r)} cans is ${n(cans)} cans. Each weighs c kg, so together they weigh ${n(cans)}c kg.` },
   { prompt: `How many kilograms do the ${n(t)} empty trays weigh together, at ${n(w)} kg each?`, answer: [trays], explanation: `${n(t)} × ${n(w)} = ${n(trays)} kg.` },
   { prompt: `Add the empty crate’s ${n(W)} kg to the trays’ ${n(trays)} kg. What is the number added on its own?`, answer: [known], explanation: `${n(trays)} + ${n(W)} = ${n(known)} kg, whatever c turns out to be, so the expression is ${n(cans)}c + ${n(known)}.` }
  ] }; }
});

/* ---- q14 Substitution (taught: put the number in place of the letter, multiply before adding or subtracting). ---- */
make({ id: 'q14b', parent: 'q14', kind: 'setting',
 title: 'Filling the holiday jar',
 brief: 'A savings jar grows by the same amount each week, and you want to know what it will hold later on.',
 labels: ['dollars after the first count', 'dollars after the second count'], tolerance: EXACT },
 [['dollars after the first count'], ['dollars after the second count']], {
 canonical: { S: 45, r: 12, w1: 4, w2: 9 },
 draw: R => { const w1 = R.int(3, 6); return { S: 5 * R.int(4, 30), r: R.pick([5, 8, 10, 12, 15, 20, 25]), w1, w2: w1 + R.int(3, 8) }; },
 build: ({ S, r, w1, w2 }) => { const A = S + r * w1, B = S + r * w2; return {
  prompt: `You are saving for a holiday. The jar starts with $${n(S)} in it and you add $${n(r)} every week, so after w weeks it holds ${n(S)} + ${n(r)}w dollars. You count the money twice. Substitute to find the dollars in the jar at the first count, after ${n(w1)} weeks, then at the second count, after ${n(w2)} weeks.`,
  answer: [A, B],
  hints: [`Replace w with ${n(w1)}: ${n(S)} + ${n(r)} × ${n(w1)}. Multiply before you add.`, `For the second, replace w with ${n(w2)}: ${n(S)} + ${n(r)} × ${n(w2)}.`],
  solution: `After ${n(w1)} weeks: ${n(S)} + ${n(r)} × ${n(w1)} = ${n(S)} + ${n(r * w1)} = $${n(A)}. After ${n(w2)} weeks: ${n(S)} + ${n(r)} × ${n(w2)} = ${n(S)} + ${n(r * w2)} = $${n(B)}.`,
  guidance: [
   { prompt: `Put ${n(w1)} in place of w: ${n(S)} + ${n(r)} × ${n(w1)}. What is it?`, answer: [A], explanation: `Multiply first: ${n(r)} × ${n(w1)} = ${n(r * w1)}. Then ${n(S)} + ${n(r * w1)} = $${n(A)}.` },
   { prompt: `Now put ${n(w2)} in place of w: ${n(S)} + ${n(r)} × ${n(w2)}. What is it?`, answer: [B], explanation: `${n(r)} × ${n(w2)} = ${n(r * w2)}, and ${n(S)} + ${n(r * w2)} = $${n(B)}.` }
  ] }; }
});

make({ id: 'q14c', parent: 'q14', kind: 'applied',
 title: 'Two quotes for a van',
 brief: 'Two van hire firms price a day differently, and you want the cheaper one for your trip.',
 labels: ['Firm A’s cost ($)', 'Firm B’s cost ($)', 'dollars saved with the cheaper firm'], tolerance: EXACT },
 [['Firm A’s cost ($)'], ['Firm B’s cost ($)'], ['dollars saved']], {
 canonical: { FA: 60, RA: 2, FB: 40, RB: 3, k: 30 },
 /* Firm A has the higher fixed charge and the lower charge per kilometre. The trip is never the distance at which
    the two firms cost the same, so there is always a cheaper firm. */
 draw: R => { const FA = 10 * R.int(6, 12), FB = FA - 10 * R.int(2, 5), RA = R.int(2, 3), RB = RA + R.int(1, 2);
  const even = (FA - FB) / (RB - RA); return { FA, RA, FB, RB, k: 5 * R.except(2, 12, [even / 5]) }; },
 build: ({ FA, RA, FB, RB, k }) => { const A = FA + RA * k, B = FB + RB * k, hi = Math.max(A, B), lo = Math.min(A, B), D = hi - lo, cheap = A < B ? 'A' : 'B'; return {
  prompt: `You need a van for a day and have two quotes, where k is the number of kilometres you drive. Firm A charges ${n(FA)} + ${n(RA)}k dollars. Firm B charges ${n(FB)} + ${n(RB)}k dollars. You plan to drive ${n(k)} km. Substitute to find Firm A’s cost, then Firm B’s cost. Then enter how many dollars you save by choosing the cheaper firm.`,
  answer: [A, B, D],
  hints: [`Put ${n(k)} in place of k in each quote: ${n(FA)} + ${n(RA)} × ${n(k)} and ${n(FB)} + ${n(RB)} × ${n(k)}. Multiply before you add.`, 'The saving is the gap between the two costs: take the smaller cost away from the larger one.'],
  solution: `Firm A: ${n(FA)} + ${n(RA)} × ${n(k)} = ${n(FA)} + ${n(RA * k)} = $${n(A)}. Firm B: ${n(FB)} + ${n(RB)} × ${n(k)} = ${n(FB)} + ${n(RB * k)} = $${n(B)}. Firm ${cheap} is cheaper, and the saving is ${n(hi)} − ${n(lo)} = $${n(D)}.`,
  guidance: [
   { prompt: `Firm A: put ${n(k)} in place of k in ${n(FA)} + ${n(RA)}k. What is ${n(FA)} + ${n(RA)} × ${n(k)}?`, answer: [A], explanation: `Multiply first: ${n(RA)} × ${n(k)} = ${n(RA * k)}. Then ${n(FA)} + ${n(RA * k)} = $${n(A)}.` },
   { prompt: `Firm B: put ${n(k)} in place of k in ${n(FB)} + ${n(RB)}k. What is ${n(FB)} + ${n(RB)} × ${n(k)}?`, answer: [B], explanation: `${n(RB)} × ${n(k)} = ${n(RB * k)}, and ${n(FB)} + ${n(RB * k)} = $${n(B)}.` },
   { prompt: `The costs are $${n(A)} and $${n(B)}. How many dollars apart are they?`, answer: [D], explanation: `${n(hi)} − ${n(lo)} = $${n(D)}, saved by choosing Firm ${cheap}.` }
  ] }; }
});

make({ id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q06',
 title: 'A day at the market stall',
 brief: 'A market stall has a cost to cover, and you want to know what a slow day and a good day leave you with.',
 labels: ['result on the slow day ($)', 'result on the good day ($)'], tolerance: EXACT },
 [['dollars from jars on the slow day'], ['result on the slow day ($)'], ['result on the good day ($)']], {
 canonical: { R: 6, F: 60, n1: 4, n2: 15 },
 /* The slow day never covers the stall (R × n1 < F), so its result is below zero; the good day always does. */
 draw: R => { const price = R.int(3, 8), F = 10 * R.int(4, 9), most = Math.ceil(F / price) - 1;
  return { R: price, F, n1: R.int(2, Math.min(9, most)), n2: Math.floor(F / price) + R.int(2, 10) }; },
 build: ({ R, F, n1, n2 }) => { const a = R * n1, b = R * n2, short = F - a, slow = a - F, good = b - F; return {
  prompt: `You sell jars of jam at a market. Each jar sells for $${n(R)} and the stall costs $${n(F)} for the day, so selling j jars leaves you with ${n(R)}j − ${n(F)} dollars. A result below zero means you have lost money. Substitute to find the result for a slow day with ${n(n1)} jars sold, then for a good day with ${n(n2)} jars sold.`,
  answer: [slow, good],
  hints: [`Replace j with ${n(n1)}: ${n(R)} × ${n(n1)} − ${n(F)}. Multiply first, then subtract.`, 'If you must take away more than you have, you go past 0 on the number line. Work out how much is still to take away once you reach 0, and write it with a minus sign.'],
  solution: `Slow day: ${n(R)} × ${n(n1)} − ${n(F)} = ${n(a)} − ${n(F)}. Taking away ${n(a)} reaches 0 and there are still ${n(short)} to take away, so the result is ${n(slow)} dollars: a loss of $${n(short)}. Good day: ${n(R)} × ${n(n2)} − ${n(F)} = ${n(b)} − ${n(F)} = ${n(good)} dollars.`,
  guidance: [
   { prompt: `Put ${n(n1)} in place of j and multiply first. What is ${n(R)} × ${n(n1)}?`, answer: [a], explanation: `${n(R)} × ${n(n1)} = ${n(a)}: the jars bring in $${n(a)} on the slow day.` },
   { prompt: `Now take away the stall cost: ${n(a)} − ${n(F)}. Taking away ${n(a)} reaches 0, and the rest of the ${n(F)} takes you below 0. What is the result?`, answer: [slow], explanation: `${n(F)} − ${n(a)} = ${n(short)} is still to take away after reaching 0, so ${n(a)} − ${n(F)} = ${n(slow)}. You are $${n(short)} short of the stall cost.` },
   { prompt: `Now the good day: put ${n(n2)} in place of j. What is ${n(R)} × ${n(n2)} − ${n(F)}?`, answer: [good], explanation: `${n(R)} × ${n(n2)} = ${n(b)}, and ${n(b)} − ${n(F)} = ${n(good)} dollars.` }
  ] }; }
});

/* ---- q15 Distributing and combining like terms (taught: k(x + s) = kx + ks; add the x terms; add the plain numbers). ---- */
make({ id: 'q15b', parent: 'q15', kind: 'setting',
 title: 'Booking the cinema seats',
 brief: 'A group cinema booking mixes online tickets and tickets bought at the door, and the total should be one short expression.',
 labels: ['number in front of t', 'number on its own'], tolerance: EXACT },
 [['number on its own'], ['number in front of t']], {
 canonical: { k: 5, s: 2, m: 3 },
 /* The two answers are never the same number (k + m is not k × s). */
 draw: R => { const k = R.int(2, 8), s = R.int(2, 5); return { k, s, m: R.except(2, 7, [k * s - k]) }; },
 build: ({ k, s, m }) => { const ks = k * s, km = k + m; return {
  prompt: `A cinema ticket costs t dollars. Every ticket booked online has a $${n(s)} booking fee added, so one online ticket costs t + ${n(s)} dollars. Your group books ${n(k)} tickets online and buys ${n(m)} more at the door with no fee: ${n(k)}(t + ${n(s)}) + ${n(m)}t dollars in all. Simplify this to the form (number)t + (number). Enter the number in front of t, then the number on its own.`,
  answer: [km, ks],
  hints: [`Distribute: ${n(k)}(t + ${n(s)}) means ${n(k)} lots of t and ${n(k)} lots of ${n(s)}. Work out ${n(k)} × ${n(s)} for the number on its own.`, `Combine the like terms ${n(k)}t and ${n(m)}t: both count tickets of t dollars.`],
  solution: `${n(k)}(t + ${n(s)}) + ${n(m)}t = ${n(k)}t + ${n(ks)} + ${n(m)}t = ${n(km)}t + ${n(ks)} dollars: ${n(km)} tickets and $${n(ks)} of booking fees.`,
  guidance: [
   { prompt: `Distribute: ${n(k)}(t + ${n(s)}) = ${n(k)}t + ?. What is the number on its own?`, answer: [ks], explanation: `The ${n(k)} multiplies both parts inside the brackets: ${n(k)} × ${n(s)} = ${n(ks)}, the booking fees in dollars.` },
   { prompt: `Now combine ${n(k)}t + ${n(m)}t. How many t are there?`, answer: [km], explanation: `${n(k)} tickets plus ${n(m)} tickets is ${n(km)} tickets, so ${n(k)}t + ${n(m)}t = ${n(km)}t and the total is ${n(km)}t + ${n(ks)}.` }
  ] }; }
});

make({ id: 'q15c', parent: 'q15', kind: 'applied',
 title: 'Ordering the club kit',
 brief: 'A sports club is ordering two kinds of kit, and the treasurer wants the order as one short expression.',
 labels: ['number in front of s', 'number on its own'], tolerance: EXACT },
 [['plain number from the adult kits'], ['plain number from the junior kits', 'number on its own'], ['number in front of s']], {
 canonical: { a: 3, p: 12, b: 5, q: 8 },
 draw: R => ({ a: R.int(2, 6), p: R.pick([10, 12, 15, 18, 20]), b: R.int(2, 8), q: R.pick([5, 6, 8, 9]) }),
 build: ({ a, p, b, q }) => { const ap = a * p, bq = b * q, c = ap + bq, k = a + b; return {
  prompt: `A sports club orders kit. Every shirt costs s dollars. An adult kit is one shirt plus adult shorts that cost $${n(p)}, so an adult kit costs s + ${n(p)} dollars. A junior kit is one shirt plus junior shorts that cost $${n(q)}, so a junior kit costs s + ${n(q)} dollars. The club orders ${n(a)} adult kits and ${n(b)} junior kits: ${n(a)}(s + ${n(p)}) + ${n(b)}(s + ${n(q)}) dollars in all. Simplify this to the form (number)s + (number). Enter the number in front of s, then the number on its own.`,
  answer: [k, c],
  hints: [`Distribute each bracket on its own: ${n(a)}(s + ${n(p)}) is ${n(a)} lots of s and ${n(a)} lots of ${n(p)}; ${n(b)}(s + ${n(q)}) is ${n(b)} lots of s and ${n(b)} lots of ${n(q)}.`, 'Then gather the like terms: the two s terms together, and the two plain numbers together.'],
  solution: `${n(a)}(s + ${n(p)}) + ${n(b)}(s + ${n(q)}) = ${n(a)}s + ${n(ap)} + ${n(b)}s + ${n(bq)}. The s terms: ${n(a)}s + ${n(b)}s = ${n(k)}s. The plain numbers: ${n(ap)} + ${n(bq)} = ${n(c)}. The order costs ${n(k)}s + ${n(c)} dollars: ${n(k)} shirts and $${n(c)} of shorts.`,
  guidance: [
   { prompt: `Distribute the first bracket: ${n(a)}(s + ${n(p)}) = ${n(a)}s + ?. What is the plain number?`, answer: [ap], explanation: `The ${n(a)} multiplies both parts inside the brackets: ${n(a)} × ${n(p)} = ${n(ap)}.` },
   { prompt: `Distribute the second bracket: ${n(b)}(s + ${n(q)}) = ${n(b)}s + ?. Enter its plain number, then the two plain numbers added together.`, answer: [bq, c], explanation: `${n(b)} × ${n(q)} = ${n(bq)}, and ${n(ap)} + ${n(bq)} = ${n(c)}: the shorts cost $${n(c)} in all.` },
   { prompt: `Now combine ${n(a)}s + ${n(b)}s. How many s are there?`, answer: [k], explanation: `${n(a)} shirts plus ${n(b)} shirts is ${n(k)} shirts, so ${n(a)}s + ${n(b)}s = ${n(k)}s and the total is ${n(k)}s + ${n(c)}.` }
  ] }; }
});

make({ id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q14',
 title: 'Fuelling the rover convoy',
 brief: 'A rover convoy is leaving the fuel store, and Mira wants its fuel as one short expression and then as a number.',
 labels: ['number in front of c', 'number on its own', 'total litres'], tolerance: EXACT },
 [['number on its own'], ['number in front of c'], ['total litres']], {
 canonical: { k: 4, s: 3, m: 2, e: 18, v: 25 },
 /* The drum never holds the same number of litres as the flasks together (e is not k × s), so the two plain numbers read apart. */
 draw: R => { const k = R.int(3, 7), s = R.int(2, 6); return { k, s, m: R.int(2, 5), e: R.pick([10, 12, 15, 18, 20, 25, 30].filter(x => x !== k * s)), v: R.pick([15, 20, 25, 30, 40]) }; },
 build: ({ k, s, m, e, v }) => { const ks = k * s, c0 = ks + e, km = k + m, total = km * v + c0; return {
  prompt: `Fuel store. Each rover in a convoy carries one fuel tank of c litres and a reserve flask of ${n(s)} L, so one rover carries c + ${n(s)} litres. The convoy has ${n(k)} rovers, and its supply sled brings ${n(m)} more tanks and a part-full drum with ${n(e)} L in it: ${n(k)}(c + ${n(s)}) + ${n(m)}c + ${n(e)} litres in all. Simplify this to the form (number)c + (number), and enter the number in front of c, then the number on its own. Then the tanks are measured: each holds ${n(v)} L, so c is ${n(v)}. Enter the total litres the convoy carries.`,
  answer: [km, c0, total],
  hints: [`Distribute first: ${n(k)}(c + ${n(s)}) is ${n(k)} lots of c and ${n(k)} lots of ${n(s)}. The plain numbers to add are ${n(k)} × ${n(s)} and the drum’s ${n(e)}.`, `Combine the c terms. Then put ${n(v)} in place of c in your short expression, and multiply before you add.`],
  solution: `${n(k)}(c + ${n(s)}) + ${n(m)}c + ${n(e)} = ${n(k)}c + ${n(ks)} + ${n(m)}c + ${n(e)} = ${n(km)}c + ${n(c0)} litres. With c = ${n(v)}: ${n(km)} × ${n(v)} + ${n(c0)} = ${n(km * v)} + ${n(c0)} = ${n(total)} L. Check with the first form: ${n(k)} × ${n(v + s)} + ${n(m)} × ${n(v)} + ${n(e)} = ${n(k * (v + s))} + ${n(m * v)} + ${n(e)} = ${n(total)} L.`,
  guidance: [
   { prompt: `Distribute: ${n(k)}(c + ${n(s)}) = ${n(k)}c + ?. Then add the drum’s ${n(e)} to that plain number. What is the number on its own?`, answer: [c0], explanation: `${n(k)} × ${n(s)} = ${n(ks)} litres in the flasks, and ${n(ks)} + ${n(e)} = ${n(c0)}. Both are plain litres, so they are like terms.` },
   { prompt: `Now combine ${n(k)}c + ${n(m)}c. How many c are there?`, answer: [km], explanation: `${n(k)} tanks plus ${n(m)} tanks is ${n(km)} tanks, so the short expression is ${n(km)}c + ${n(c0)}.` },
   { prompt: `Put ${n(v)} in place of c: ${n(km)} × ${n(v)} + ${n(c0)}. What is the total?`, answer: [total], explanation: `Multiply first: ${n(km)} × ${n(v)} = ${n(km * v)}. Then ${n(km * v)} + ${n(c0)} = ${n(total)} L.` }
  ] }; }
});
})();
