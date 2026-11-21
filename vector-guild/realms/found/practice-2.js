/* Foundations practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d ... q10b q10c q10d). Format and rules: docs/PACK-FORMAT.md, "Practice missions".
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/found/oracle-p2.js.

   In this file the authored text is not typed a second time: practice(meta, generator) runs build(canonical)
   once at load and registers that as the authored mission, so the two can never drift apart. To read a mission
   as the player sees it: node qa/show-mission.js q06b --realm found --draw 3. Guided-step labels are written
   inside build (gen-core.js takes a step's own labels first). */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* Authors a mission from its generator: the text and answers of build(canonical), cleaned as the engine cleans them. */
const practice = (meta, generator) => { const b = generator.build(generator.canonical); add({
 ...meta, prompt: G.clean(b.prompt), answer: b.answer.map(G.tidy), hints: b.hints.map(G.clean), solution: G.clean(b.solution),
 guidance: b.guidance.map(s => ({ prompt: G.clean(s.prompt), answer: s.answer.map(G.tidy), labels: s.labels, explanation: G.clean(s.explanation) }))
}, generator); };

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
/* One of d equal parts of a round amount of dollars, worked through its tens, because the only division taught so far
   is of numbers up to about 300 (q04): "2400 is 240 tens. 240 ÷ 8 = 30, so one part is 30 tens: 2400 ÷ 8 = 300 dollars". */
const tensPart = (amount, d) => { const t = amount / 10; return d === 10
 ? `${n(amount)} is ${n(t)} tens, and one of 10 equal parts of ${n(t)} tens is ${n(t)} ones, so one part is ${n(amount)} ÷ 10 = ${n(t)} dollars`
 : `${n(amount)} is ${n(t)} tens. ${n(t)} ÷ ${n(d)} = ${n(t / d)}, so one part is ${n(t / d)} tens: ${n(amount)} ÷ ${n(d)} = ${n(amount / d)} dollars`; };
/* The working that follows "r × c." as q03 shows it: the two-digit number split into tens and ones, or read as tens. */
const rowsWork = (r, c) => { const o = c % 10, t = c - o;
 return r === 10 ? `That is ${n(c)} tens, written ${n(10 * c)}`
  : o === 0 ? `That is ${n(r)} × ${n(t / 10)} tens = ${n(r * t / 10)} tens, written ${n(r * c)}`
  : `Split ${n(c)} into ${n(t)} and ${n(o)}: ${n(r)} × ${n(t)} = ${n(r * t)} and ${n(r)} × ${n(o)} = ${n(r * o)}, and ${n(r * t)} + ${n(r * o)} = ${n(r * c)}`; };
/* Hundredths as text with two digits after the point: 160 → "1.60". */
const f2 = h => (h / 100).toFixed(2);
/* Every fraction in lowest terms, below 1, with a denominator from the list, as [numerator, denominator]. */
const fractions = dens => dens.flatMap(d => { const out = []; for (let k = 1; k < d; k++) if (gcd(k, d) === 1) out.push([k, d]); return out; });
/* Working for a/b + c/d: common denominator L, numerator sum s, lowest terms sn/sd, and the sentence that shows it. */
const addWork = (a, b, c, d) => {
 const L = lcm(b, d), x = a * L / b, y = c * L / d, s = x + y, k = gcd(s, L), sn = s / k, sd = L / k;
 const conv = (p, q, t) => q === L ? `${n(p)}/${n(q)} already has the denominator ${n(L)}` : `${n(p)}/${n(q)} = ${n(t)}/${n(L)}`;
 const both = `${conv(a, b, x)} and ${conv(c, d, y)}`;
 return { L, x, y, s, k, sn, sd, both,
  text: `${both}, so the sum is ${n(s)}/${n(L)}${k === 1 ? ', which is already in lowest terms' : `; dividing the top and the bottom by ${n(k)} gives ${n(sn)}/${n(sd)}`}` };
};
/* Working for e/f × g/h: unsimplified pt/pb, lowest terms pn/pd, and the sentence that shows it. */
const mulWork = (e, f, g, h) => {
 const pt = e * g, pb = f * h, j = gcd(pt, pb), pn = pt / j, pd = pb / j;
 return { pt, pb, j, pn, pd,
  text: `${n(e)}/${n(f)} × ${n(g)}/${n(h)} = ${n(pt)}/${n(pb)}${j === 1 ? ', which is already in lowest terms' : `; dividing the top and the bottom by ${n(j)} gives ${n(pn)}/${n(pd)}`}` };
};
/* Simplifying top/bottom in small steps, by 2, then 3, then 5: the divisors used and the sentence that shows them. */
const chainWork = (top, bottom) => {
 const used = [], parts = [];
 for (const f of [2, 3, 5]) while (top % f === 0 && bottom % f === 0) { top /= f; bottom /= f; parts.push(`${used.includes(f) ? `by ${f} again` : `by ${f}`}: ${n(top)}/${n(bottom)}`); used.push(f); }
 return { used, text: `Divide the top and the bottom ${parts.join('. Then ')}.` };
};

/* ---- q06 Negative numbers on the number line ---- */
practice({
 id: 'q06b', parent: 'q06', kind: 'setting',
 title: 'The hotel lift',
 brief: 'A hotel numbers its floors from the ground up and its car park levels from the ground down, and you ride the lift both ways.',
 labels: ['car park floor', 'restaurant floor'], tolerance: 0.001
}, {
 canonical: { f: 6, d: 9, u: 5 },
 /* The car is 2 to 4 levels down and the restaurant 2 to 8 floors up, never on the floor the room is on. */
 draw: R => { const f = R.int(3, 12), k = R.int(2, 4), c = R.except(2, 8, [f]); return { f, d: f + k, u: k + c }; },
 build: ({ f, d, u }) => { const k = d - f, car = f - d, c = car + u; return {
  prompt: `A hotel lift counts floors from the ground floor, which is floor 0. The car park levels below ground are floors −1, −2, −3 and so on. You are in your room on floor ${n(f)}. You ride down ${n(d)} floors to your car. Later you ride up ${n(u)} floors from the car to the restaurant. Enter the floor your car is on, then the floor the restaurant is on.`,
  answer: [car, c],
  hints: [
   'Picture the floor numbers as a number line standing on its end: riding down is subtracting, riding up is adding. Count to floor 0 first, then past it.',
   `From floor ${n(f)} it takes ${n(f)} floors down to reach floor 0. The rest of the ${n(d)} floors go below it, so the car is on a floor with a minus sign.`
  ],
  solution: `Car: ${n(f)} − ${n(d)}. Ride ${n(f)} floors down to reach floor 0, then ${n(k)} more, so the car is on floor ${n(car)}. Restaurant: ${n(car)} + ${n(u)}. Ride ${n(k)} floors up to reach floor 0, then ${n(c)} more, so the restaurant is on floor ${n(c)}.`,
  guidance: [
   { prompt: `You start on floor ${n(f)} and ride down ${n(d)} floors. After the first ${n(f)} floors you are on floor 0. How many floors are still to go?`, answer: [k], labels: ['floors below ground'], explanation: `${n(d)} − ${n(f)} = ${n(k)}, so the lift goes ${n(k)} floors below floor 0.` },
   { prompt: `The lift stops ${n(k)} floors below floor 0. Which floor is the car on? Remember the minus sign.`, answer: [car], labels: ['car park floor'], explanation: `Floors below 0 are written with a minus sign, so the car is on floor ${n(car)}: ${n(f)} − ${n(d)} = ${n(car)}.` },
   { prompt: `From floor ${n(car)} you ride up ${n(u)} floors. Which floor is the restaurant on?`, answer: [c], labels: ['restaurant floor'], explanation: `${n(k)} of the ${n(u)} floors reach floor 0, and the other ${n(c)} go above it: ${n(car)} + ${n(u)} = ${n(c)}.` }
  ] }; }
});

practice({
 id: 'q06c', parent: 'q06', kind: 'applied',
 title: 'Out of the overdraft',
 brief: 'A rent payment has taken a bank account below zero, and it has to be brought back up to a safe balance.',
 labels: ['balance after rent (dollars)', 'dollars to pay in'], tolerance: 0.001
}, {
 canonical: { b: 35, r: 80, t: 20 },
 /* Whole multiples of 5 dollars. The rent always overdraws the account by 20 to 90 dollars. */
 draw: R => { const b = 5 * R.int(3, 12), m = 5 * R.int(4, 18), t = 5 * R.except(2, 10, [b / 5, m / 5]); return { b, r: b + m, t }; },
 build: ({ b, r, t }) => { const m = r - b, dep = m + t; return {
  prompt: `Your bank account holds ${n(b)} dollars. A rent payment of ${n(r)} dollars goes out. That leaves the account overdrawn: its balance is below 0 and is shown with a minus sign. Enter the balance after the rent, in dollars. Then enter how many dollars you must pay in to bring the balance up to ${n(t)} dollars.`,
  answer: [-m, dep],
  hints: [
   'Picture the balance on a number line. Money going out moves it left and money coming in moves it right. Count to 0 first, then past it.',
   `The first ${n(b)} dollars of the rent bring the balance down to 0, and the rest of the rent takes it below 0. To climb back, first pay in enough to reach 0, then ${n(t)} dollars more.`
  ],
  solution: `After the rent: ${n(b)} − ${n(r)}. The first ${n(b)} dollars reach 0 and the other ${n(m)} go below it, so the balance is ${n(-m)} dollars. To reach ${n(t)} dollars: ${n(m)} dollars bring the balance from ${n(-m)} up to 0, and ${n(t)} more bring it to ${n(t)}. ${n(m)} + ${n(t)} = ${n(dep)}, so you must pay in ${n(dep)} dollars. Check: ${n(-m)} + ${n(dep)} = ${n(t)}.`,
  guidance: [
   { prompt: `The account holds ${n(b)} dollars and ${n(r)} dollars go out. What is the balance after the rent, in dollars?`, answer: [-m], labels: ['balance after rent (dollars)'], explanation: `${n(b)} dollars of the rent reach 0 and the other ${n(m)} go below it: ${n(b)} − ${n(r)} = ${n(-m)}.` },
   { prompt: `The balance is ${n(-m)} dollars. How many dollars must come in to bring it up to 0?`, answer: [m], labels: ['dollars to reach 0'], explanation: `${n(-m)} is ${n(m)} steps left of 0 on the number line, so ${n(m)} dollars bring it to 0.` },
   { prompt: `After those ${n(m)} dollars the balance is 0. You want it to be ${n(t)} dollars. How many dollars must you pay in altogether?`, answer: [dep], labels: ['dollars to pay in'], explanation: `${n(m)} dollars to reach 0 and ${n(t)} more to reach ${n(t)}: ${n(m)} + ${n(t)} = ${n(dep)} dollars.` }
  ] }; }
});

practice({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q03',
 title: 'The camera on the cable',
 brief: 'A survey boat lowers a camera into the sea and winds it part of the way back, and the crew logs its height each time.',
 labels: ['height after lowering (m)', 'height after winding in (m)'], tolerance: 0.001
}, {
 canonical: { h: 3, a: 4, t: 6, b: 2, s: 5 },
 /* The camera goes at least 10 m under water, and the wind-in leaves it at least 2 m under: it never comes back to 0. */
 draw: R => { const h = R.int(2, 6), a = R.int(3, 6), t = R.int(Math.max(4, Math.ceil((h + 10) / a)), 8), under = a * t - h; let b, s, guard = 0;
  do { b = R.except(2, 4, [a]); s = R.int(3, 6); } while (b * s > under - 2 && guard++ < 100);
  if (b * s > under - 2) { b = 2; s = 3; }
  return { h, a, t, b, s }; },
 build: ({ h, a, t, b, s }) => { const down = a * t, under = down - h, low = h - down, up = b * s, end = low + up; return {
  prompt: `A survey boat lowers a camera on a cable. Heights are measured from the sea surface, which is 0 m; heights below the surface are negative. The camera starts on the deck, ${n(h)} m above the surface. The winch (the motor that winds the cable) lets out ${n(a)} m of cable every minute for ${n(t)} minutes, and the camera goes straight down. Then the winch winds ${n(b)} m of cable back in every minute for ${n(s)} minutes. Enter the height of the camera after it is lowered, then its height after the cable is wound back in, both in metres.`,
  answer: [low, end],
  hints: [
   'First find how far the camera moves: multiply the metres each minute by the number of minutes. Do this for the way down and again for the way up.',
   `Going down is subtracting. The first ${n(h)} m bring the camera from the deck to the surface, at 0 m; the rest of the way down is below 0. Going up is adding, which moves it back towards 0.`
  ],
  solution: `Down: ${n(a)} × ${n(t)} = ${n(down)} m of cable. ${n(h)} − ${n(down)}: the first ${n(h)} m reach the surface and the other ${n(under)} m go below it, so the camera is at ${n(low)} m. Up: ${n(b)} × ${n(s)} = ${n(up)} m of cable. ${n(low)} + ${n(up)}: the camera is ${n(under)} m below the surface and rises ${n(up)} m, so it is still ${n(under - up)} m below, at ${n(end)} m.`,
  guidance: [
   { prompt: `The winch lets out ${n(a)} m every minute for ${n(t)} minutes. How many metres does the camera go down?`, answer: [down], labels: ['metres down'], explanation: `${n(t)} equal groups of ${n(a)} m: ${n(a)} × ${n(t)} = ${n(down)} m.` },
   { prompt: `The camera starts at ${n(h)} m and goes down ${n(down)} m. What is its height now, in metres?`, answer: [low], labels: ['height after lowering (m)'], explanation: `The first ${n(h)} m reach the surface, at 0 m, and the other ${n(under)} m go below it: ${n(h)} − ${n(down)} = ${n(low)}.` },
   { prompt: `The winch winds in ${n(b)} m every minute for ${n(s)} minutes. How many metres does the camera rise?`, answer: [up], labels: ['metres up'], explanation: `${n(s)} equal groups of ${n(b)} m: ${n(b)} × ${n(s)} = ${n(up)} m.` },
   { prompt: `From ${n(low)} m the camera rises ${n(up)} m. What is its height now, in metres?`, answer: [end], labels: ['height after winding in (m)'], explanation: `Rising moves right on the number line, towards 0: ${n(low)} + ${n(up)} = ${n(end)}. The camera is still ${n(under - up)} m below the surface.` }
  ] }; }
});

/* ---- q07 What a fraction means ---- */
practice({
 id: 'q07b', parent: 'q07', kind: 'setting',
 title: 'Bars on the battery',
 brief: 'A phone shows its charge as a row of equal bars, and you want to know how much has gone and how long the rest will last.',
 labels: ['numerator', 'denominator', 'hours left'], tolerance: 0.001
}, {
 canonical: { d: 5, k: 2, w: 4 },
 /* At least 2 bars lit and at least 1 used; lit and used bars always differ, so using the wrong ones shows. */
 draw: R => { const d = R.pick([4, 5, 6, 8, 10]); return { d, k: R.except(2, d - 1, [d / 2]), w: R.int(2, 6) }; },
 build: ({ d, k, w }) => { const full = d * w, u = d - k, left = k * w; return {
  prompt: `Your phone shows its charge as ${n(d)} equal bars, and a full charge lasts ${n(full)} hours. Right now ${n(k)} bars are still lit; the other bars have been used up. Enter the fraction of the charge that has been used, numerator then denominator, using the number of bars as the denominator. Then enter how many hours of charge are left.`,
  answer: [u, d, left],
  hints: [
   'The denominator counts all the equal bars. The numerator counts the bars the question asks about: here the used ones, not the lit ones.',
   `One bar is worth ${n(full)} ÷ ${n(d)} hours. The hours left come from the bars that are still lit.`
  ],
  solution: `There are ${n(d)} equal bars and ${n(k)} are lit, so ${n(d)} − ${n(k)} = ${n(u)} ${u === 1 ? 'bar has' : 'bars have'} been used: ${n(u)}/${n(d)} of the charge. One bar is worth ${n(full)} ÷ ${n(d)} = ${n(w)} hours, so the ${n(k)} lit bars give ${n(k)} × ${n(w)} = ${n(left)} hours.`,
  guidance: [
   { prompt: `There are ${n(d)} bars and ${n(k)} are still lit. How many bars have been used?`, answer: [u], labels: ['numerator'], explanation: `${n(d)} − ${n(k)} = ${n(u)}. The used bars go on top of the fraction and all ${n(d)} bars go on the bottom: ${n(u)}/${n(d)}.` },
   { prompt: `A full charge of ${n(full)} hours is shared equally over ${n(d)} bars. How many hours is one bar worth? Work out ${n(full)} ÷ ${n(d)}.`, answer: [w], labels: ['hours per bar'], explanation: `${n(full)} hours shared into ${n(d)} equal parts is ${n(w)} hours each.` },
   { prompt: `${n(k)} bars are lit and each is worth ${n(w)} hours. How many hours of charge are left?`, answer: [left], labels: ['hours left'], explanation: `${n(k)} × ${n(w)} = ${n(left)} hours, which is ${n(k)}/${n(d)} of a full charge.` }
  ] }; }
});

/* q07c: every [rent fraction, food fraction] pair with different denominators; the pay is a multiple of 10 × their
   common denominator, from 1200 up, so one part of each is a whole number of tens of dollars. No denominator is above
   10: dividing by a two-digit number has not been taught at this point. The pay is at most 300 × the smaller
   denominator, so the tens of the pay divided by a denominator give at most 30, the size of division q04 teaches;
   the hint and the solution show that step through the tens (tensPart). */
const PAY_PLANS = [[2, 5], [3, 8], [3, 10], [2, 7], [3, 7]].flatMap(rent => [[2, 9], [3, 10], [2, 7]].filter(food => food[1] !== rent[1]).map(food => {
 const step = 10 * lcm(rent[1], food[1]), pays = [];
 for (let pay = step; pay <= 300 * Math.min(rent[1], food[1]); pay += step) if (pay >= 1200) pays.push(pay);
 return { rent, food, pays };
})).filter(plan => plan.pays.length);
practice({
 id: 'q07c', parent: 'q07', kind: 'applied',
 title: 'Where the pay goes',
 brief: 'A month\'s pay has to cover rent and food first, and you want to know what is left for everything else.',
 labels: ['rent (dollars)', 'food (dollars)', 'left over (dollars)'], tolerance: 0.001
}, {
 canonical: { pay: 2400, k1: 3, d1: 8, k2: 3, d2: 10 },
 draw: R => { const plan = R.pick(PAY_PLANS); return { pay: R.pick(plan.pays), k1: plan.rent[0], d1: plan.rent[1], k2: plan.food[0], d2: plan.food[1] }; },
 build: ({ pay, k1, d1, k2, d2 }) => { const p1 = pay / d1, rent = k1 * p1, p2 = pay / d2, food = k2 * p2, both = rent + food, left = pay - both; return {
  prompt: `Your take-home pay, the money that reaches your account, is ${n(pay)} dollars a month. Rent takes ${n(k1)}/${n(d1)} of it and food takes ${n(k2)}/${n(d2)} of it. Enter the dollars that go on rent, then the dollars that go on food, then the dollars left for everything else. Type each amount without commas.`,
  answer: [rent, food, left],
  hints: [
   `To find a fraction of an amount, divide the amount by the denominator to get one part, then multiply by the numerator. Do this once for the rent and once for the food. A large round amount is easier in tens: ${n(pay)} is ${n(pay / 10)} tens, so divide the ${n(pay / 10)} and write a 0 after the result.`,
   'Add the rent and the food, then subtract that from the pay to see what is left.'
  ],
  solution: `Rent: ${tensPart(pay, d1)}, and ${n(k1)} parts are ${n(k1)} × ${n(p1)} = ${n(rent)} dollars. Food: ${tensPart(pay, d2)}, and ${n(k2)} parts are ${n(k2)} × ${n(p2)} = ${n(food)} dollars. Together that is ${n(rent)} + ${n(food)} = ${n(both)} dollars, which leaves ${n(pay)} − ${n(both)} = ${n(left)} dollars.`,
  guidance: [
   { prompt: `Rent is ${n(k1)}/${n(d1)} of ${n(pay)} dollars. One part is ${n(pay)} ÷ ${n(d1)} = ${n(p1)} dollars. How many dollars are ${n(k1)} parts?`, answer: [rent], labels: ['rent (dollars)'], explanation: `${n(k1)} × ${n(p1)} = ${n(rent)} dollars go on rent.` },
   { prompt: `Food is ${n(k2)}/${n(d2)} of ${n(pay)} dollars. ${d2 === 10 ? `${n(pay)} is ${n(pay / 10)} tens, and one of 10 equal parts of ${n(pay / 10)} tens is ${n(pay / 10)} ones, so one part is ${n(pay / 10)} dollars. Multiply it by ${n(k2)}.` : `Work out ${n(pay)} ÷ ${n(d2)}, then multiply by ${n(k2)}. To divide, think of ${n(pay)} as ${n(pay / 10)} tens: divide ${n(pay / 10)} by ${n(d2)} and write a 0 after the result.`} How many dollars go on food?`, answer: [food], labels: ['food (dollars)'], explanation: `${tensPart(pay, d2)}, and ${n(k2)} × ${n(p2)} = ${n(food)} dollars.` },
   { prompt: `Rent and food together cost ${n(rent)} + ${n(food)} = ${n(both)} dollars. How many of the ${n(pay)} dollars are left?`, answer: [left], labels: ['left over (dollars)'], explanation: `${n(pay)} − ${n(both)} = ${n(left)} dollars are left for everything else.` }
  ] }; }
});

practice({
 id: 'q07d', parent: 'q07', kind: 'challenge',
 title: 'How far is the whole trip?',
 brief: 'The map app says what share of a road trip is behind you, and from that you want the length of the whole trip.',
 labels: ['whole trip (km)', 'km still to drive'], tolerance: 0.001
}, {
 canonical: { k: 3, d: 5, unit: 50 },
 /* The fraction is in lowest terms with a numerator of at least 2, so finding one part is a real division. */
 draw: R => { const [k, d] = R.pick(fractions([4, 5, 6, 8, 10]).filter(f => f[0] >= 2)); return { k, d, unit: R.pick([15, 20, 25, 30, 40, 50, 60]) }; },
 build: ({ k, d, unit }) => { const part = k * unit, whole = d * unit, left = whole - part, rest = d - k === 1 ? 'the last part' : `the other ${n(d - k)} parts`; return {
  prompt: `On a road trip the map app on your phone says you have driven ${n(part)} km, and that this is ${n(k)}/${n(d)} of the whole trip. Enter the length of the whole trip in km, then the km still to drive.`,
  answer: [whole, left],
  hints: [
   `${n(k)}/${n(d)} means the trip is cut into ${n(d)} equal parts and you have driven ${n(k)} of them. So the ${n(part)} km are ${n(k)} equal parts, not the whole trip.`,
   `Divide the km driven by the numerator to get one part. The whole trip is ${n(d)} of those parts.`
  ],
  solution: `${n(k)}/${n(d)} of the trip means ${n(k)} of ${n(d)} equal parts. Those ${n(k)} parts are ${n(part)} km, so one part is ${n(part)} ÷ ${n(k)} = ${n(unit)} km. The whole trip is ${n(d)} parts: ${n(d)} × ${n(unit)} = ${n(whole)} km. Still to drive: ${n(whole)} − ${n(part)} = ${n(left)} km, which is ${rest}.`,
  guidance: [
   { prompt: `You have driven ${n(k)} of the ${n(d)} equal parts of the trip, and that is ${n(part)} km. How many km is one part? Work out ${n(part)} ÷ ${n(k)}.`, answer: [unit], labels: ['km in one part'], explanation: `${n(k)} equal parts make ${n(part)} km, so one part is ${n(part)} ÷ ${n(k)} = ${n(unit)} km.` },
   { prompt: `The whole trip is ${n(d)} parts of ${n(unit)} km. How long is the whole trip, in km?`, answer: [whole], labels: ['whole trip (km)'], explanation: `${n(d)} × ${n(unit)} = ${n(whole)} km.` },
   { prompt: `The trip is ${n(whole)} km and you have driven ${n(part)} km. How many km are still to drive?`, answer: [left], labels: ['km still to drive'], explanation: `${n(whole)} − ${n(part)} = ${n(left)} km, which is ${rest} of the trip.` }
  ] }; }
});

/* ---- q08 Equivalent fractions and simplifying ---- */
/* q08b: ride lengths in minutes that share a divisor of at least 3 with 60. */
const RIDES = []; for (let m = 8; m <= 58; m++) if (gcd(m, 60) >= 3) RIDES.push(m);
practice({
 id: 'q08b', parent: 'q08', kind: 'setting',
 title: 'A fraction of an hour',
 brief: 'Timetables give a ride in minutes, but people say it as a part of an hour, and you want the simplest way to say yours.',
 labels: ['numerator', 'denominator'], tolerance: 0.001
}, {
 canonical: { m: 45 },
 draw: R => ({ m: R.pick(RIDES) }),
 build: ({ m }) => { const g = gcd(m, 60), p = m / g, q = 60 / g; return {
  prompt: `An hour has 60 minutes. Your bus ride to work takes ${n(m)} minutes. Enter the fraction of an hour that the ride takes, in lowest terms: the numerator, then the denominator.`,
  answer: [p, q],
  hints: [
   `The fraction is ${n(m)}/60: the minutes of the ride over the minutes in an hour. Find a number that divides both ${n(m)} and 60 exactly, and divide the top and the bottom by it. Repeat until no number above 1 divides both.`,
   'Dividing by the largest number that divides both does it in one step. Check your result: no number above 1 should divide both its top and its bottom.'
  ],
  solution: `${n(m)} minutes out of 60 is the fraction ${n(m)}/60. The largest number that divides both is ${n(g)}: ${n(m)} ÷ ${n(g)} = ${n(p)} and 60 ÷ ${n(g)} = ${n(q)}. So the ride takes ${n(p)}/${n(q)} of an hour, and no number above 1 divides both ${n(p)} and ${n(q)}.`,
  guidance: [
   { prompt: `The ride is ${n(m)}/60 of an hour. What is the largest number that divides both ${n(m)} and 60 exactly?`, answer: [g], labels: ['largest number dividing both'], explanation: `${n(m)} = ${n(p)} × ${n(g)} and 60 = ${n(q)} × ${n(g)}, and no number above 1 divides both ${n(p)} and ${n(q)}, so ${n(g)} is the largest.` },
   { prompt: `Divide the top by ${n(g)}. What is ${n(m)} ÷ ${n(g)}?`, answer: [p], labels: ['numerator'], explanation: `${n(m)} ÷ ${n(g)} = ${n(p)}.` },
   { prompt: `Divide the bottom by the same number. What is 60 ÷ ${n(g)}?`, answer: [q], labels: ['denominator'], explanation: `60 ÷ ${n(g)} = ${n(q)}. The ride takes ${n(p)}/${n(q)} of an hour.` }
  ] }; }
});

practice({
 id: 'q08c', parent: 'q08', kind: 'applied',
 title: 'How full is the phone?',
 brief: 'A phone\'s settings page shows the free space, and you want the used share of its storage in simplest form.',
 labels: ['numerator', 'denominator'], tolerance: 0.001
}, {
 canonical: { total: 64, p: 5, q: 8 },
 /* The used share p/q has an odd numerator over 4, 8 or 16, so it is never one half and never equals the free share. */
 draw: R => { const total = R.pick([32, 64, 128]), q = R.pick([4, 8, 16]); return { total, p: 2 * R.int(0, q / 2 - 1) + 1, q }; },
 build: ({ total, p, q }) => { const g = total / q, used = p * g, free = total - used; return {
  prompt: `A phone has ${n(total)} GB of storage (GB, short for gigabytes, measures how much a phone can hold). Its settings page says that ${n(free)} GB are free. Enter the fraction of the storage that is used, in lowest terms: the numerator, then the denominator.`,
  answer: [p, q],
  hints: [
   'The settings page gives the free space, but the question asks about the used space. Find the used GB first, then write the used GB over the total GB.',
   'Both numbers are even, so halve the top and the bottom. Keep halving for as long as both are still even.'
  ],
  solution: `Used: ${n(total)} − ${n(free)} = ${n(used)} GB, so the fraction used is ${n(used)}/${n(total)}. The largest number that divides both is ${n(g)}: ${n(used)} ÷ ${n(g)} = ${n(p)} and ${n(total)} ÷ ${n(g)} = ${n(q)}. So ${n(p)}/${n(q)} of the storage is used, and no number above 1 divides both ${n(p)} and ${n(q)}.`,
  guidance: [
   { prompt: `The phone holds ${n(total)} GB and ${n(free)} GB are free. How many GB are used?`, answer: [used], labels: ['GB used'], explanation: `${n(total)} − ${n(free)} = ${n(used)} GB are used, so the fraction used is ${n(used)}/${n(total)}.` },
   { prompt: `What is the largest number that divides both ${n(used)} and ${n(total)} exactly? One way: halve both numbers for as long as both are even, then multiply together the 2s you divided by.`, answer: [g], labels: ['largest number dividing both'], explanation: `${n(used)} = ${n(p)} × ${n(g)} and ${n(total)} = ${n(q)} × ${n(g)}, and no number above 1 divides both ${n(p)} and ${n(q)}, so ${n(g)} is the largest.` },
   { prompt: `Divide the top and the bottom of ${n(used)}/${n(total)} by ${n(g)}, or keep the result of your halving. Enter the numerator, then the denominator.`, answer: [p, q], labels: ['numerator', 'denominator'], explanation: `${n(used)} ÷ ${n(g)} = ${n(p)} and ${n(total)} ÷ ${n(g)} = ${n(q)}, so ${n(p)}/${n(q)} of the storage is used.` }
  ] }; }
});

practice({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q03',
 title: 'Tiling the kitchen floor',
 brief: 'A tiler is part of the way through a kitchen floor, and the owner asks how much of it is done.',
 labels: ['tiles in all', 'numerator', 'denominator'], tolerance: 0.001
}, {
 canonical: { r: 9, c: 20, p: 3, q: 5 },
 /* Rows and row lengths have only the factors 2, 3 and 5, so the fraction always simplifies by those in small steps.
    There are at most 10 rows: q03 teaches a one-digit number times a two-digit number, and q01 teaches times 10. */
 draw: R => { const r = R.pick([5, 6, 8, 9, 10]), c = R.pick([12, 15, 16, 18, 20]), q = R.pick([3, 4, 5, 6, 8].filter(x => r * c % x === 0)); return { r, c, p: R.pick(fractions([q]).filter(x => x[0] >= 2))[0], q }; },
 build: ({ r, c, p, q }) => { const total = r * c, g = total / q, laid = p * g, chain = chainWork(laid, total); return {
  prompt: `A tiler is laying a kitchen floor of ${n(r)} rows with ${n(c)} tiles in each row. So far ${n(laid)} tiles are laid. Enter the number of tiles the whole floor needs. Then enter the fraction of the floor that is laid, in lowest terms: the numerator, then the denominator.`,
  answer: [total, p, q],
  hints: [
   `The whole floor is ${n(r)} equal rows of ${n(c)} tiles, so multiply: think of ${n(c)} as its tens and its ones. The tiles laid go on top of the fraction and the tiles in all go on the bottom.`,
   'Simplify in small steps. While both numbers are even, halve them. While 3 divides both, divide both by 3. Then try 5 the same way. Stop when no number above 1 divides both.'
  ],
  solution: `Tiles in all: ${n(r)} × ${n(c)}. ${rowsWork(r, c)}. The fraction laid is ${n(laid)}/${n(total)}. ${chain.text} No number above 1 divides both ${n(p)} and ${n(q)}, so ${n(p)}/${n(q)} of the floor is laid. In one step: the largest number that divides both ${n(laid)} and ${n(total)} is ${n(g)}.`,
  guidance: [
   { prompt: `The floor is ${n(r)} rows of ${n(c)} tiles. How many tiles does the whole floor need?`, answer: [total], labels: ['tiles in all'], explanation: `${n(r)} equal rows of ${n(c)} tiles: ${n(r)} × ${n(c)}. ${rowsWork(r, c)} tiles.` },
   { prompt: `The fraction laid is ${n(laid)}/${n(total)}. What is the largest number that divides both ${n(laid)} and ${n(total)} exactly? One way: divide both by 2, 3 or 5 as often as you can, then multiply together the numbers you divided by.`, answer: [g], labels: ['largest number dividing both'], explanation: `${chain.text} The numbers divided by multiply to ${chain.used.join(' × ')} = ${n(g)}.` },
   { prompt: `Divide the top and the bottom of ${n(laid)}/${n(total)} by ${n(g)}, or keep the result of your small steps. Enter the numerator, then the denominator.`, answer: [p, q], labels: ['numerator', 'denominator'], explanation: `${n(laid)} ÷ ${n(g)} = ${n(p)} and ${n(total)} ÷ ${n(g)} = ${n(q)}, so ${n(p)}/${n(q)} of the floor is laid.` }
  ] }; }
});

/* ---- q09 Adding and multiplying fractions ---- */
/* Sums of two fractions in lowest terms with different denominators that stay below one whole. */
const sumsBelowOne = (dens, keep) => { const all = fractions(dens), out = [];
 for (const [a, b] of all) for (const [c, d] of all) if (b !== d && a * d + c * b < b * d && (!keep || keep(a, b, c, d))) out.push([a, b, c, d]);
 return out; };
const FENCE_SUMS = sumsBelowOne([2, 3, 4, 5, 6]);
/* q09b: a tin of paint holds at least half a litre. */
const TINS = fractions([2, 3, 4, 5]).filter(([g, h]) => 2 * g >= h);
practice({
 id: 'q09b', parent: 'q09', kind: 'setting',
 title: 'Painting the garden fence',
 brief: 'A fence is being painted over a weekend, and you want to know how much is done and how much paint the gate will take.',
 labels: ['fence numerator', 'fence denominator', 'paint numerator', 'paint denominator'], tolerance: 0.001
}, {
 canonical: { a: 1, b: 3, c: 2, d: 5, e: 2, f: 3, g: 3, h: 4 },
 draw: R => { const [a, b, c, d] = R.pick(FENCE_SUMS), [e, f] = R.pick(fractions([2, 3, 4, 5])), [g, h] = R.pick(TINS); return { a, b, c, d, e, f, g, h }; },
 build: ({ a, b, c, d, e, f, g, h }) => { const S = addWork(a, b, c, d), P = mulWork(e, f, g, h); return {
  prompt: `You are painting a garden fence. On Saturday you paint ${n(a)}/${n(b)} of it and on Sunday another ${n(c)}/${n(d)} of it. Enter the fraction of the fence painted so far, in lowest terms: the numerator, then the denominator. A tin holds ${n(g)}/${n(h)} litre of paint and the gate needs ${n(e)}/${n(f)} of a tin, which is ${n(e)}/${n(f)} × ${n(g)}/${n(h)} litre. Enter the litres for the gate in lowest terms: the numerator, then the denominator.`,
  answer: [S.sn, S.sd, P.pn, P.pd],
  hints: [
   `To add the two days, cut both shares into pieces of the same size: find a number that both ${n(b)} and ${n(d)} divide into exactly, write both fractions with that denominator, then add the numerators.`,
   `"Of" means multiply. Multiply the tops (${n(e)} × ${n(g)}) and the bottoms (${n(f)} × ${n(h)}), then simplify.`
  ],
  solution: `Fence: ${S.text}. Gate, in litres: ${P.text}.`,
  guidance: [
   { prompt: `Write Saturday's ${n(a)}/${n(b)} and Sunday's ${n(c)}/${n(d)} with the denominator ${n(S.L)}. What do the two numerators add up to?`, answer: [S.s], labels: ['numerator over common denominator'], explanation: `${S.both}. ${n(S.x)} + ${n(S.y)} = ${n(S.s)}, so ${n(S.s)}/${n(S.L)} of the fence is painted.` },
   { prompt: `Write ${n(S.s)}/${n(S.L)} in lowest terms. Enter the numerator, then the denominator.`, answer: [S.sn, S.sd], labels: ['numerator', 'denominator'], explanation: S.k === 1 ? `No number above 1 divides both ${n(S.s)} and ${n(S.L)}, so it stays ${n(S.s)}/${n(S.L)} of the fence.` : `Divide the top and the bottom by ${n(S.k)}: ${n(S.sn)}/${n(S.sd)} of the fence.` },
   { prompt: `For the gate, multiply ${n(e)} × ${n(g)} for the top and ${n(f)} × ${n(h)} for the bottom. Enter the result in lowest terms: the numerator, then the denominator.`, answer: [P.pn, P.pd], labels: ['numerator', 'denominator'], explanation: P.j === 1 ? `${n(P.pt)}/${n(P.pb)} litre, already in lowest terms.` : `${n(P.pt)}/${n(P.pb)}; divide the top and the bottom by ${n(P.j)} to get ${n(P.pn)}/${n(P.pd)} litre.` }
  ] }; }
});

/* q09c: e/f of a recipe that needs g/h cup of milk, then c/d cup of water. The milk fraction and the water fraction
   have different denominators, their common denominator is at most 30, and the two together stay below one cup. */
const PANCAKES = []; for (const [e, f] of fractions([2, 3, 4])) for (const [g, h] of fractions([2, 3, 4, 5, 6])) for (const [c, d] of fractions([2, 3, 4, 5, 6, 8])) {
 const P = mulWork(e, f, g, h);
 if (P.pd !== d && P.pd <= 12 && lcm(P.pd, d) <= 30 && P.pn * d + c * P.pd < P.pd * d) PANCAKES.push({ e, f, g, h, c, d });
}
practice({
 id: 'q09c', parent: 'q09', kind: 'applied',
 title: 'A smaller batch of pancakes',
 brief: 'You are cooking only part of a pancake recipe, so the milk has to be cut down before the water goes in.',
 labels: ['milk numerator', 'milk denominator', 'total numerator', 'total denominator'], tolerance: 0.001
}, {
 canonical: { e: 2, f: 3, g: 3, h: 4, c: 1, d: 3 },
 draw: R => ({ ...R.pick(PANCAKES) }),
 build: ({ e, f, g, h, c, d }) => { const P = mulWork(e, f, g, h), S = addWork(P.pn, P.pd, c, d); return {
  prompt: `A pancake recipe needs ${n(g)}/${n(h)} cup of milk. You make only ${n(e)}/${n(f)} of the recipe, so you need ${n(e)}/${n(f)} × ${n(g)}/${n(h)} cup of milk. Enter that amount in lowest terms: the numerator, then the denominator. You then stir in ${n(c)}/${n(d)} cup of water as well. Enter the cups of milk and water together, in lowest terms: the numerator, then the denominator.`,
  answer: [P.pn, P.pd, S.sn, S.sd],
  hints: [
   `"${n(e)}/${n(f)} of the recipe" means multiply. Multiply the tops (${n(e)} × ${n(g)}) and the bottoms (${n(f)} × ${n(h)}), then simplify.`,
   `To add the water, the pieces must be the same size: write your milk fraction and ${n(c)}/${n(d)} with a common denominator, then add the numerators.`
  ],
  solution: `Milk, in cups: ${P.text}. Milk and water, in cups: ${S.text}.`,
  guidance: [
   { prompt: `Multiply ${n(e)} × ${n(g)} for the top and ${n(f)} × ${n(h)} for the bottom. Enter the cups of milk in lowest terms: the numerator, then the denominator.`, answer: [P.pn, P.pd], labels: ['milk numerator', 'milk denominator'], explanation: P.j === 1 ? `${n(P.pt)}/${n(P.pb)} cup, already in lowest terms.` : `${n(P.pt)}/${n(P.pb)}; divide the top and the bottom by ${n(P.j)} to get ${n(P.pn)}/${n(P.pd)} cup.` },
   { prompt: `Now add the milk, ${n(P.pn)}/${n(P.pd)} cup, and the water, ${n(c)}/${n(d)} cup. Write both with the denominator ${n(S.L)}. What do the two numerators add up to?`, answer: [S.s], labels: ['numerator over common denominator'], explanation: `${S.both}. ${n(S.x)} + ${n(S.y)} = ${n(S.s)}, so together they make ${n(S.s)}/${n(S.L)} cup.` },
   { prompt: `Write ${n(S.s)}/${n(S.L)} in lowest terms. Enter the numerator, then the denominator.`, answer: [S.sn, S.sd], labels: ['total numerator', 'total denominator'], explanation: S.k === 1 ? `No number above 1 divides both ${n(S.s)} and ${n(S.L)}, so it stays ${n(S.s)}/${n(S.L)} cup.` : `Divide the top and the bottom by ${n(S.k)}: ${n(S.sn)}/${n(S.sd)} cup.` }
  ] }; }
});

/* q09d: two monthly shares of a price whose sum, in lowest terms, has a numerator of at least 2 and a denominator of at
   most 10 (dividing by a two-digit number above 10 has not been taught, the same rule as q07c); the price is a
   multiple of 10 × the common denominator, from 600 up, so every part is a whole number of tens of dollars. The price
   is at most 300 × the denominator of the sum, so the tens of the price divided by it give at most 30, the size of
   division q04 teaches; the solution shows that step through the tens (tensPart). 1/2 + 1/3 is left out: it is the
   sum the q09 mission itself asks for. */
const SAVINGS = sumsBelowOne([2, 3, 4, 5, 6, 8, 10], (a, b, c, d) => { const S = addWork(a, b, c, d); return S.sn >= 2 && S.sd <= 10 && lcm(b, d) <= 40 && !(a === 1 && c === 1 && b * d === 6); }).map(([a, b, c, d]) => {
 const step = 10 * lcm(b, d), top = 300 * addWork(a, b, c, d).sd, prices = [];
 for (let price = step; price <= top; price += step) if (price >= 600) prices.push(price);
 return { a, b, c, d, prices };
}).filter(plan => plan.prices.length);
practice({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q07',
 title: 'Saving for a laptop',
 brief: 'Two months of saving have each covered a share of a laptop\'s price, and you want to know how far there is to go.',
 labels: ['numerator', 'denominator', 'dollars saved', 'dollars still to save'], tolerance: 0.001
}, {
 canonical: { price: 1600, a: 1, b: 4, c: 3, d: 8 },
 draw: R => { const plan = R.pick(SAVINGS); return { price: R.pick(plan.prices), a: plan.a, b: plan.b, c: plan.c, d: plan.d }; },
 build: ({ price, a, b, c, d }) => { const S = addWork(a, b, c, d), unit = price / S.sd, saved = S.sn * unit, left = price - saved; return {
  prompt: `You are saving for a laptop that costs ${n(price)} dollars. In January you save ${n(a)}/${n(b)} of the price, and in February another ${n(c)}/${n(d)} of the price. Enter the fraction of the price saved so far, in lowest terms: the numerator, then the denominator. Then enter the dollars saved so far, and then the dollars still to save (type them without commas).`,
  answer: [S.sn, S.sd, saved, left],
  hints: [
   `Add the two fractions first: find a number that both ${n(b)} and ${n(d)} divide into exactly, write both fractions with that denominator, then add the numerators and simplify.`,
   `Then take that fraction of ${n(price)} dollars: divide the price by the denominator to get one part, and multiply by the numerator. The price is easier in tens: ${n(price)} is ${n(price / 10)} tens, so divide the ${n(price / 10)} and write a 0 after the result.`
  ],
  solution: `Fraction saved: ${S.text}. ${tensPart(price, S.sd)}, and ${n(S.sn)} parts are ${n(S.sn)} × ${n(unit)} = ${n(saved)} dollars. Still to save: ${n(price)} − ${n(saved)} = ${n(left)} dollars.`,
  guidance: [
   { prompt: `Write ${n(a)}/${n(b)} and ${n(c)}/${n(d)} with the denominator ${n(S.L)}. What do the two numerators add up to?`, answer: [S.s], labels: ['numerator over common denominator'], explanation: `${S.both}. ${n(S.x)} + ${n(S.y)} = ${n(S.s)}, so ${n(S.s)}/${n(S.L)} of the price is saved.` },
   { prompt: `Write ${n(S.s)}/${n(S.L)} in lowest terms. Enter the numerator, then the denominator.`, answer: [S.sn, S.sd], labels: ['numerator', 'denominator'], explanation: S.k === 1 ? `No number above 1 divides both ${n(S.s)} and ${n(S.L)}, so it stays ${n(S.s)}/${n(S.L)} of the price.` : `Divide the top and the bottom by ${n(S.k)}: ${n(S.sn)}/${n(S.sd)} of the price.` },
   { prompt: `One part of the price is ${n(price)} ÷ ${n(S.sd)} = ${n(unit)} dollars. How many dollars are ${n(S.sn)} parts?`, answer: [saved], labels: ['dollars saved'], explanation: `${n(S.sn)} × ${n(unit)} = ${n(saved)} dollars are saved.` },
   { prompt: `The laptop costs ${n(price)} dollars and ${n(saved)} dollars are saved. How many dollars are still to save?`, answer: [left], labels: ['dollars still to save'], explanation: `${n(price)} − ${n(saved)} = ${n(left)} dollars.` }
  ] }; }
});

/* ---- q10 Decimals ---- (parameters are whole hundredths, so the arithmetic is exact) */
practice({
 id: 'q10b', parent: 'q10', kind: 'setting',
 title: 'Timing the sprint',
 brief: 'Two friends have timed each other over a sprint with a stopwatch, and they want to compare the two times.',
 labels: ['seconds faster', 'both times together (s)'], tolerance: 0.004 /* answers are exact hundredths */
}, {
 canonical: { A: 1340, B: 1285 },
 /* Ana's time has one digit after the point and Ben's has two, so the points must be lined up. Ben is 0.11 to 1.49 s faster. */
 draw: R => { const A = 10 * R.except(124, 169, [130, 140, 150, 160]), gap = R.except(11, 149, [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140]); return { A, B: A - gap }; },
 build: ({ A, B }) => { const gap = A - B, sum = A + B; return {
  prompt: `Two friends time each other over a 100 m sprint. Ana runs it in ${n(A / 100)} seconds and Ben runs it in ${n(B / 100)} seconds, so Ben is the faster one. Enter how many seconds faster Ben is. Then enter the two times added together, in seconds.`,
  answer: [gap / 100, sum / 100],
  hints: [
   `Give both times two digits after the point (${n(A / 100)} is ${f2(A)}), then write them one above the other with the points lined up.`,
   'For "how much faster", subtract the smaller time from the larger one. For the two times together, add. Work column by column from the right, as with whole numbers.'
  ],
  solution: `Faster by: ${f2(A)} − ${f2(B)} = ${f2(gap)}, so Ben is ${n(gap / 100)} seconds faster. Together: ${f2(A)} + ${f2(B)} = ${f2(sum)}, so the two times add up to ${n(sum / 100)} seconds.`,
  guidance: [
   { prompt: `Write Ana's time as ${f2(A)} and line up the points. What is ${f2(A)} − ${f2(B)}?`, answer: [gap / 100], labels: ['seconds faster'], explanation: `Hundredths, tenths, then ones, borrowing as with whole numbers: ${f2(A)} − ${f2(B)} = ${f2(gap)}. Check: ${f2(B)} + ${f2(gap)} = ${f2(A)}.` },
   { prompt: `Now add the two times with the points lined up. What is ${f2(A)} + ${f2(B)}?`, answer: [sum / 100], labels: ['both times together (s)'], explanation: `Hundredths, tenths, then ones, carrying as with whole numbers: ${f2(A)} + ${f2(B)} = ${f2(sum)}.` }
  ] }; }
});

practice({
 id: 'q10c', parent: 'q10', kind: 'applied',
 title: 'Change at the checkout',
 brief: 'Three things are in the shopping basket, there is a coupon in your pocket, and you want to check your change.',
 labels: ['bill before coupon ($)', 'amount to pay ($)', 'change ($)'], tolerance: 0.004 /* answers are exact cents */
}, {
 canonical: { x: 285, y: 640, z: 799, c: 250, N: 20 },
 /* Prices in cents. The amount to pay is always under 20 dollars, so a 20-dollar note covers it. */
 draw: R => { let x, y, z, c, guard = 0;
  do { x = R.int(165, 395); y = R.int(425, 795); z = R.int(549, 899); c = R.pick([75, 125, 150, 250]); } while (x + y + z - c > 1975 && guard++ < 100);
  if (x + y + z - c > 1975) { x = 285; y = 640; z = 799; c = 250; }
  return { x, y, z, c, N: 20 }; },
 build: ({ x, y, z, c, N }) => { const bill = x + y + z, pay = bill - c, change = 100 * N - pay; return {
  prompt: `At the supermarket you buy bread for $${f2(x)}, cheese for $${f2(y)} and coffee for $${f2(z)}. You hand over a coupon that takes $${f2(c)} off the bill, and you pay with a $${n(N)} note. Enter the bill before the coupon, then the amount to pay after the coupon, then your change, all in dollars.`,
  answer: [bill / 100, pay / 100, change / 100],
  hints: [
   'Write the three prices one above the other with the decimal points lined up, and add column by column from the right, carrying as with whole numbers.',
   `Subtract the coupon from the bill. Then subtract what you have to pay from ${n(N)}.00 to get the change.`
  ],
  solution: `Bill: ${f2(x)} + ${f2(y)} + ${f2(z)} = ${f2(bill)} dollars. After the coupon: ${f2(bill)} − ${f2(c)} = ${f2(pay)} dollars to pay. Change: ${n(N)}.00 − ${f2(pay)} = ${f2(change)} dollars.`,
  guidance: [
   { prompt: `Line up the points and add the three prices. What is ${f2(x)} + ${f2(y)} + ${f2(z)}?`, answer: [bill / 100], labels: ['bill before coupon ($)'], explanation: `${f2(x)} + ${f2(y)} = ${f2(x + y)}, and ${f2(x + y)} + ${f2(z)} = ${f2(bill)} dollars.` },
   { prompt: `The coupon takes $${f2(c)} off. What is ${f2(bill)} − ${f2(c)}?`, answer: [pay / 100], labels: ['amount to pay ($)'], explanation: `${f2(bill)} − ${f2(c)} = ${f2(pay)} dollars to pay.` },
   { prompt: `You pay with a $${n(N)} note. Write it as ${n(N)}.00. What is ${n(N)}.00 − ${f2(pay)}?`, answer: [change / 100], labels: ['change ($)'], explanation: `${n(N)}.00 − ${f2(pay)} = ${f2(change)} dollars of change. Check: ${f2(pay)} + ${f2(change)} = ${n(N)}.00.` }
  ] }; }
});

practice({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q06',
 title: 'The cold store overnight',
 brief: 'Mira wants the cold store\'s thermometer readings for the night and the morning, to the hundredth of a degree.',
 labels: ['night reading (°C)', 'morning reading (°C)'], tolerance: 0.004 /* answers are exact hundredths */
}, {
 canonical: { s: 240, w: 585, u: 470 },
 /* Hundredths of a degree. The dusk reading and the rise have at most one digit after the point, the fall has two. The night
    reading is 0.51 to 5.99 degrees below zero and the morning reading 0.21 to 3.99 degrees above it. */
 draw: R => { const s = 10 * R.int(5, 45), below = R.except(51, 599, Array.from({ length: 60 }, (_, i) => 10 * i)); const u = 10 * R.int(Math.ceil((below + 20) / 10), Math.floor((below + 400) / 10)); return { s, w: s + below, u }; },
 build: ({ s, w, u }) => { const below = w - s, night = -below / 100, up = u - below, morning = up / 100; return {
  prompt: `Mira checks the cold store in the ration kitchen. At dusk its thermometer reads ${n(s / 100)} °C. Overnight the reading falls by ${w === 100 ? '1 degree' : `${n(w / 100)} degrees`}. In the morning the door is left open, and the reading rises by ${u === 100 ? '1 degree' : `${n(u / 100)} degrees`} from its night value. Enter the night reading, then the morning reading, in °C.`,
  answer: [night, morning],
  hints: [
   `Work as on the number line: falling moves left and rising moves right. The first ${s === 100 ? '1 degree of the fall brings' : `${n(s / 100)} degrees of the fall bring`} the reading down to 0, and the rest of the fall goes below 0.`,
   'To find "the rest", subtract with the decimal points lined up, after giving every number two digits after the point.'
  ],
  solution: `Night: ${n(s / 100)} − ${n(w / 100)}. The first ${f2(s)} degrees of the fall reach 0, and ${f2(w)} − ${f2(s)} = ${f2(below)} degrees are left to go below it, so the night reading is ${n(night)} °C. Morning: ${n(night)} + ${n(u / 100)}. The first ${f2(below)} degrees of the rise reach 0, and ${f2(u)} − ${f2(below)} = ${f2(up)} degrees are left to go above it, so the morning reading is ${n(morning)} °C.`,
  guidance: [
   { prompt: `The reading starts at ${n(s / 100)} °C and falls ${w === 100 ? '1 degree' : `${n(w / 100)} degrees`}. The first ${s === 100 ? '1 degree brings' : `${n(s / 100)} degrees bring`} it to 0. How many degrees of the fall are left? Work out ${f2(w)} − ${f2(s)}.`, answer: [below / 100], labels: ['degrees below 0'], explanation: `With the points lined up: ${f2(w)} − ${f2(s)} = ${f2(below)}.` },
   { prompt: `The reading goes ${below === 100 ? '1 degree' : `${n(below / 100)} degrees`} below 0. What is the night reading, in °C? Remember the minus sign.`, answer: [night], labels: ['night reading (°C)'], explanation: `Readings below 0 are written with a minus sign: ${n(s / 100)} − ${n(w / 100)} = ${n(night)}.` },
   { prompt: `From ${n(night)} °C the reading rises ${u === 100 ? '1 degree' : `${n(u / 100)} degrees`}. The first ${below === 100 ? '1 degree brings' : `${n(below / 100)} degrees bring`} it back to 0. What is the morning reading, in °C? Work out ${f2(u)} − ${f2(below)}.`, answer: [morning], labels: ['morning reading (°C)'], explanation: `With the points lined up: ${f2(u)} − ${f2(below)} = ${f2(up)}, so ${n(night)} + ${n(u / 100)} = ${n(morning)}.` }
  ] }; }
});
})();
