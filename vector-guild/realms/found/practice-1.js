/* Foundations practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d ... q05b q05c q05d). Format and rules: docs/PACK-FORMAT.md, "Practice missions".
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/found/oracle-p1.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* ---- q01 Place value ---- */
add({
 id: 'q01b', parent: 'q01', kind: 'setting',
 title: 'The seed locker count',
 brief: 'Seed stock for the greenhouse has arrived in sacks, trays and packets, and the locker label needs one number for all of it.',
 prompt: 'Seed locker count: sacks of 1000 seeds, 7; trays of 100, 0; packets of 10, 5; loose seeds, 3. Enter the total number of seeds (type it without commas). Then enter how many seeds the tens digit of your total stands for.',
 answer: [7053, 50], labels: ['total seeds', 'tens digit stands for'], tolerance: 0.01,
 hints: [
  'Write one digit for each place: thousands first, then hundreds, tens and ones. A place with nothing in it still needs a 0.',
  'The tens digit is the second digit from the right. Each ten is 10 seeds.'
 ],
 solution: 'Thousands 7, hundreds 0, tens 5, ones 3: written in that order the number is 7053. The tens digit is 5, so it stands for 5 tens, which is 50 seeds.',
 guidance: [
  { prompt: 'Write the digits in order: thousands 7, hundreds 0, tens 5, ones 3. What number do they make?', answer: [7053], labels: ['total seeds'], explanation: 'The digits 7, 0, 5, 3 in that order make 7053. Each digit sits in the place it counts.' },
  { prompt: 'The tens digit is 5, and each ten is 10 seeds. How many seeds does a tens digit of 5 stand for?', answer: [50], labels: ['seeds'], explanation: 'A tens digit of 5 means 5 tens, which is 50 seeds.' }
 ]
}, {
 /* Not the numbers of the q01 worked example (4, 0, 6, 1 → 4061), which is shown above this mission as "Review the lesson". */
 canonical: { a: 7, b: 0, c: 5, d: 3 },
 /* The tens digit is at least 2, so "6 tens" reads naturally and the second answer is never 0. A draw never repeats
    the thousands, hundreds and tens of the worked example. */
 draw: R => { let p; do { p = { a: R.int(1, 9), b: R.int(0, 9), c: R.int(2, 9), d: R.int(0, 9) }; } while (p.a === 4 && p.b === 0 && p.c === 6); return p; },
 build: ({ a, b, c, d }) => { const total = 1000 * a + 100 * b + 10 * c + d, tens = 10 * c; return {
  prompt: `Seed locker count: sacks of 1000 seeds, ${n(a)}; trays of 100, ${n(b)}; packets of 10, ${n(c)}; loose seeds, ${n(d)}. Enter the total number of seeds (type it without commas). Then enter how many seeds the tens digit of your total stands for.`,
  answer: [total, tens],
  hints: ['Write one digit for each place: thousands first, then hundreds, tens and ones. A place with nothing in it still needs a 0.', 'The tens digit is the second digit from the right. Each ten is 10 seeds.'],
  solution: `Thousands ${n(a)}, hundreds ${n(b)}, tens ${n(c)}, ones ${n(d)}: written in that order the number is ${n(total)}. The tens digit is ${n(c)}, so it stands for ${n(c)} tens, which is ${n(tens)} seeds.`,
  guidance: [
   { prompt: `Write the digits in order: thousands ${n(a)}, hundreds ${n(b)}, tens ${n(c)}, ones ${n(d)}. What number do they make?`, answer: [total], explanation: `The digits ${n(a)}, ${n(b)}, ${n(c)}, ${n(d)} in that order make ${n(total)}. Each digit sits in the place it counts.` },
   { prompt: `The tens digit is ${n(c)}, and each ten is 10 seeds. How many seeds does a tens digit of ${n(c)} stand for?`, answer: [tens], explanation: `A tens digit of ${n(c)} means ${n(c)} tens, which is ${n(tens)} seeds.` }
  ] }; }
});

/* ---- Shared helpers for the missions below ----
   practice(meta, stepLabels, generator) registers a mission whose prompt, answers, hints, solution and guided steps
   are build(canonical) itself, so the authored text and the generator can never drift apart. `meta` holds the fields
   a generator does not make: id, parent, kind, title, brief, labels, tolerance (and uses for a challenge);
   `stepLabels` holds the answer labels of each guided step. To read a mission as the player sees it:
   node qa/show-mission.js <id> --realm found */
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer, labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer, labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* "1 note" / "3 notes" */
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
/* "a, b and c" */
const list = xs => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
/* A whole number as its hundreds, tens and ones, zero parts left out: 126 → [100, 20, 6]. */
const parts = x => [100 * Math.floor(x / 100), 10 * (Math.floor(x / 10) % 10), x % 10].filter(v => v > 0);
/* The working for k × x with x split by place: "Split 18 into 10 and 8: 7 × 10 = 70 and 7 × 8 = 56, and 70 + 56 = 126". */
const splitMul = (k, x) => { const ps = parts(x); return ps.length < 2 ? `${n(k)} × ${n(x)} = ${n(k * x)}`
 : `Split ${n(x)} into ${list(ps.map(n))}: ${list(ps.map(p => `${n(k)} × ${n(p)} = ${n(k * p)}`))}, and ${ps.map(p => n(k * p)).join(' + ')} = ${n(k * x)}`; };
/* Draw until the test passes (the tests below pass often, so this ends quickly); the canonical set is the fallback. */
const until = (make, ok, fallback) => { for (let i = 0; i < 400; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const digit = (x, place) => Math.floor(x / place) % 10;
/* True when top − bottom, worked in columns, never has to borrow from a 0 (the lesson only shows borrowing from a
   digit that has something to lend). */
const plainBorrow = (top, bottom) => { let lent = 0; for (let k = 1; k <= top; k *= 10) {
  const need = digit(top, k) - lent < digit(bottom, k); if (need && digit(top, 10 * k) === 0) return false; lent = need ? 1 : 0; } return true; };
/* The easy multiples of d that fit into N, as the lesson suggests trying first: "Try easy numbers first: 7 × 10 = 70 and 7 × 20 = 140." */
const easy = (d, N) => { const ms = [10, 20, 30, 40].filter(m => m === 10 || d * m <= N);
 return `Try ${ms.length < 2 ? 'an easy number' : 'easy numbers'} first: ${list(ms.map(m => `${n(d)} × ${m} = ${n(d * m)}`))}.`; };

/* q01c: a bank withdrawal read digit by digit (the number is given, the groups are asked for). */
practice({
 id: 'q01c', parent: 'q01', kind: 'applied',
 title: 'Cash for the van',
 brief: 'A used van for the supply runs is being paid for in cash, and the bank teller needs to know what to count out.',
 labels: ['bundles of 1000', '100-dollar notes', '10-dollar notes'], tolerance: 0.001
}, [['bundles of 1000'], ['100-dollar notes'], ['10-dollar notes']], {
 canonical: { a: 5, b: 0, c: 8 },
 /* Three different digits, so reading the places in the wrong order never gives the right boxes. The ones digit is 0. */
 draw: R => { const a = R.int(1, 9), b = R.except(0, 9, [a]); return { a, b, c: R.except(1, 9, [a, b]) }; },
 build: ({ a, b, c }) => { const amount = 1000 * a + 100 * b + 10 * c; return {
  prompt: `You are buying a used van for ${n(amount)} dollars in cash. The bank counts the money out in bundles of 1000 dollars, 100-dollar notes and 10-dollar notes. It always uses the biggest it can: as many bundles as fit, then as many 100-dollar notes as fit, then 10-dollar notes. Enter how many bundles of 1000 you get, then how many 100-dollar notes, then how many 10-dollar notes.`,
  answer: [a, b, c],
  hints: ['Each digit of the amount counts one kind of group. Read the amount one digit at a time from the left: thousands, hundreds, tens, ones.', 'A 0 in a place means there are none of that group, so no notes of that kind are needed.'],
  solution: `Read ${n(amount)} one digit at a time: thousands ${n(a)}, hundreds ${n(b)}, tens ${n(c)}, ones 0. So the bank counts out ${pl(a, 'bundle', 'bundles')} of 1000, ${b === 0 ? 'no notes' : pl(b, 'note', 'notes')} of 100 dollars and ${pl(c, 'note', 'notes')} of 10 dollars. Those digits stand for ${n(1000 * a)}, ${n(100 * b)} and ${n(10 * c)} dollars, the parts of ${n(amount)}.`,
  guidance: [
   { prompt: `The amount is ${n(amount)} dollars. Its first digit, on the left, counts thousands. How many bundles of 1000 dollars is that?`, answer: [a], explanation: `The thousands digit of ${n(amount)} is ${n(a)}, so the bank gives ${pl(a, 'bundle', 'bundles')} of 1000. That is ${n(1000 * a)} dollars.` },
   { prompt: `The next digit of ${n(amount)} counts hundreds. How many 100-dollar notes is that?`, answer: [b], explanation: b === 0 ? 'The hundreds digit is 0, so no 100-dollar notes are needed. The 0 is still written, to keep the other digits in their places.' : `The hundreds digit is ${n(b)}, so there ${b === 1 ? 'is' : 'are'} ${pl(b, 'note', 'notes')} of 100 dollars. That is ${n(100 * b)} dollars.` },
   { prompt: `The third digit of ${n(amount)} counts tens. How many 10-dollar notes is that?`, answer: [c], explanation: `The tens digit is ${n(c)}, so there ${c === 1 ? 'is' : 'are'} ${pl(c, 'note', 'notes')} of 10 dollars. That is ${n(10 * c)} dollars. The ones digit is 0, so no single dollars are left to pay.` }
  ] }; }
});

/* q01d: one place holds more than 9, so ten hundreds have to be traded for a thousand before the digits are written. */
practice({
 id: 'q01d', parent: 'q01', kind: 'challenge',
 title: 'The tile yard recount',
 brief: 'The builder’s yard that supplies the outpost has counted its floor tiles, but one line of the count does not fit in a single digit.',
 labels: ['total tiles', 'thousands digit stands for'], tolerance: 0.001
}, [['stacks left'], ['thousands'], ['total tiles'], ['thousands digit stands for']], {
 canonical: { a: 2, b: 13, c: 4, d: 6 },
 /* 11 to 19 stacks of 100: exactly one thousand is traded and at least one stack stays. The total stays under 10000. */
 draw: R => ({ a: R.int(1, 7), b: R.int(11, 19), c: R.int(0, 9), d: R.int(0, 9) }),
 build: ({ a, b, c, d }) => { const th = a + 1, h = b - 10, total = 1000 * th + 100 * h + 10 * c + d; return {
  prompt: `A builder's yard counts its floor tiles: pallets of 1000 tiles, ${n(a)}; stacks of 100, ${n(b)}; packs of 10, ${n(c)}; loose tiles, ${n(d)}. Take care: there are more than 9 stacks, and one place can hold only one digit. Enter the total number of tiles (type it without commas). Then enter how many tiles the thousands digit of your total stands for.`,
  answer: [total, 1000 * th],
  hints: ['Ten hundreds make one thousand. So 10 of the stacks of 100 can be counted as one more pallet of 1000.', 'After that swap no place holds more than 9. Write one digit for each place: thousands, hundreds, tens, ones.'],
  solution: `${n(b)} stacks of 100 are 10 stacks and ${n(h)} more. Ten hundreds make one thousand, so there are ${n(th)} thousands and ${pl(h, 'hundred', 'hundreds')}. With ${pl(c, 'ten', 'tens')} and ${pl(d, 'one', 'ones')} the number is ${n(total)}. The thousands digit ${n(th)} stands for ${n(th)} thousands, which is ${n(1000 * th)} tiles.`,
  guidance: [
   { prompt: `Ten stacks of 100 make 1000 tiles. Take 10 stacks out of the ${n(b)} stacks. How many stacks of 100 are still left?`, answer: [h], explanation: `${n(b)} stacks are 10 stacks and ${n(h)} more. The 10 stacks make one thousand, and ${h === 1 ? '1 stack of 100 is' : `${n(h)} stacks of 100 are`} left.` },
   { prompt: `Those 10 stacks count as 1 more thousand, on top of the ${pl(a, 'pallet', 'pallets')} of 1000. How many thousands are there now?`, answer: [th], explanation: `${pl(a, 'thousand', 'thousands')} and 1 more thousand make ${n(th)} thousands.` },
   { prompt: `Write the digits in order: thousands ${n(th)}, hundreds ${n(h)}, tens ${n(c)}, ones ${n(d)}. What number do they make?`, answer: [total], explanation: `The digits ${n(th)}, ${n(h)}, ${n(c)}, ${n(d)} in that order make ${n(total)}.` },
   { prompt: `The thousands digit is ${n(th)}. How many tiles do ${n(th)} thousands make?`, answer: [1000 * th], explanation: `Each thousand is 1000 tiles, so ${n(th)} thousands are ${n(1000 * th)} tiles.` }
  ] }; }
});

/* ---- q02 Adding and subtracting ---- */
/* q02b: money out, then money in (the parent adds first). The subtraction needs a borrow and the addition a carry. */
practice({
 id: 'q02b', parent: 'q02', kind: 'setting',
 title: 'Checking the bank balance',
 brief: 'A bill goes out of the account and the wages come in, and the balance has to be right after each.',
 labels: ['balance after the bill', 'balance after the wages'], tolerance: 0.001
}, [['balance after the bill'], ['balance after the wages']], {
 canonical: { a: 523, b: 187, c: 346 },
 draw: R => until(() => ({ a: R.int(310, 799), b: R.int(115, 289), c: R.int(125, 460) }),
  ({ a, b, c }) => a % 10 < b % 10 && plainBorrow(a, b) && a - b >= 100 && (a - b) % 10 + c % 10 >= 10 && a - b + c <= 999, { a: 523, b: 187, c: 346 }),
 build: ({ a, b, c }) => { const s = a - b, t = s + c; return {
  prompt: `Your bank account holds ${n(a)} dollars. A bill of ${n(b)} dollars is paid out of it. Later your wages of ${n(c)} dollars are paid in. Enter the balance after the bill is paid, then the balance after the wages come in.`,
  answer: [s, t],
  hints: ['Money going out is subtracted and money coming in is added. Line the numbers up on the right, ones under ones.', `First work out ${n(a)} − ${n(b)}. When a top digit is smaller than the digit below it, borrow a ten. Then add ${n(c)} to your result.`],
  solution: `After the bill: ${n(a)} − ${n(b)} = ${n(s)} dollars. Check: ${n(s)} + ${n(b)} = ${n(a)}. After the wages: ${n(s)} + ${n(c)} = ${n(t)} dollars.`,
  guidance: [
   { prompt: `The account holds ${n(a)} dollars and ${n(b)} dollars go out. What is ${n(a)} − ${n(b)}?`, answer: [s], explanation: `Subtract column by column from the ones, borrowing when the top digit is smaller: ${n(a)} − ${n(b)} = ${n(s)}. Adding back checks it: ${n(s)} + ${n(b)} = ${n(a)}.` },
   { prompt: `The balance is ${n(s)} dollars and ${n(c)} dollars come in. What is ${n(s)} + ${n(c)}?`, answer: [t], explanation: `Add column by column from the ones, carrying when a column reaches 10: ${n(s)} + ${n(c)} = ${n(t)}.` }
  ] }; }
});

/* q02c: three amounts added, then the total taken from a target. */
practice({
 id: 'q02c', parent: 'q02', kind: 'applied',
 title: 'The sponsored walk',
 brief: 'The outpost’s walking club has promised a distance for charity, and the members want to know how far they still have to go.',
 labels: ['km walked so far', 'km still to go'], tolerance: 0.001
}, [['km after two weeks'], ['km walked so far'], ['km still to go']], {
 canonical: { t: 850, a: 268, b: 187, c: 139 },
 /* The first sum carries, the total does not end in 0 (so the subtraction from a target ending in 0 borrows),
    and the target ends in 50 (so the borrow comes from a 5, never from a 0) and is at least 60 km above the total. */
 draw: R => until(() => { const a = R.int(120, 260), b = R.int(120, 260), c = R.int(85, 199), s = a + b + c;
   return { t: 100 * Math.ceil((s + 10 + R.int(0, 150)) / 100) + 50, a, b, c }; },
  ({ t, a, b, c }) => a % 10 + b % 10 >= 10 && (a + b + c) % 10 !== 0 && a !== b && t <= 950 && t - (a + b + c) >= 60 && plainBorrow(t, a + b + c), { t: 850, a: 268, b: 187, c: 139 }),
 build: ({ t, a, b, c }) => { const two = a + b, s = two + c, left = t - s; return {
  prompt: `A walking club has promised to walk ${n(t)} km (kilometres) this month for charity. In week one the members walk ${n(a)} km, in week two ${n(b)} km and in week three ${n(c)} km. Enter the total distance walked so far, then the distance still to go to reach ${n(t)} km.`,
  answer: [s, left],
  hints: ['Add the three weeks first: add two of them, then add the third to that result. Line the numbers up on the right and carry when a column reaches 10.', 'The distance still to go is what is left when the distance walked is taken away from the distance promised.'],
  solution: `Walked so far: ${n(a)} + ${n(b)} = ${n(two)}, and ${n(two)} + ${n(c)} = ${n(s)} km. Still to go: ${n(t)} − ${n(s)} = ${n(left)} km. Check: ${n(left)} + ${n(s)} = ${n(t)}.`,
  guidance: [
   { prompt: `Start with the first two weeks. What is ${n(a)} + ${n(b)}?`, answer: [two], explanation: `Add column by column from the ones, carrying when a column reaches 10: ${n(a)} + ${n(b)} = ${n(two)}.` },
   { prompt: `Now add week three. What is ${n(two)} + ${n(c)}?`, answer: [s], explanation: `${n(two)} + ${n(c)} = ${n(s)}, so the club has walked ${n(s)} km so far.` },
   { prompt: `The club promised ${n(t)} km and has walked ${n(s)} km. What is ${n(t)} − ${n(s)}?`, answer: [left], explanation: `Subtract column by column from the ones, borrowing when the top digit is smaller: ${n(t)} − ${n(s)} = ${n(left)}. Adding back checks it: ${n(left)} + ${n(s)} = ${n(t)}.` }
  ] }; }
});

/* q02d: two subtractions with four-digit meter readings; the thousands column comes from place value (q01). */
practice({
 id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01',
 title: 'Reading the electricity meter',
 brief: 'The electricity bill has arrived, and the meter readings on it should be checked before it is paid.',
 labels: ['units used', 'units for everything else'], tolerance: 0.001
}, [['units used'], ['units for everything else']], {
 canonical: { p: 4786, u: 1347, h: 648 },
 /* p + u < 10000. Subtracting the readings borrows in at least two columns; subtracting the heating borrows too. */
 draw: R => until(() => { const u = R.int(1050, 2950); return { p: R.int(1200, 6800), u, h: R.int(350, Math.min(900, u - 200)) }; },
  ({ p, u, h }) => { const c = p + u; return [1, 10, 100].filter(k => digit(c, k) < digit(p, k)).length >= 2 && u % 10 < h % 10 && plainBorrow(c, p) && plainBorrow(u, h); }, { p: 4786, u: 1347, h: 648 }),
 build: ({ p, u, h }) => { const c = p + u, rest = u - h; return {
  prompt: `An electricity meter counts the units of electricity a home has used. Three months ago it read ${n(p)}. Today it reads ${n(c)}. Enter how many units were used in the three months (type it without commas). The heating used ${n(h)} of those units. Then enter how many units everything else used.`,
  answer: [u, rest],
  hints: ["The units used are what is left when the earlier reading is taken away from today's reading. Line up four columns: thousands, hundreds, tens and ones.", 'Borrow in the same way in every column: 1 taken from the column on the left is worth 10 in this column. Then take the heating units away from the units used.'],
  solution: `Units used: ${n(c)} − ${n(p)} = ${n(u)}. Check: ${n(u)} + ${n(p)} = ${n(c)}. Everything else: ${n(u)} − ${n(h)} = ${n(rest)} units. Check: ${n(rest)} + ${n(h)} = ${n(u)}.`,
  guidance: [
   { prompt: `Today's reading is ${n(c)} and the earlier reading was ${n(p)}. What is ${n(c)} − ${n(p)}?`, answer: [u], explanation: `Work from the ones column to the thousands column, borrowing when the top digit is smaller: ${n(c)} − ${n(p)} = ${n(u)}. Adding back checks it: ${n(u)} + ${n(p)} = ${n(c)}.` },
   { prompt: `${n(u)} units were used and the heating took ${n(h)} of them. What is ${n(u)} − ${n(h)}?`, answer: [rest], explanation: `${n(u)} − ${n(h)} = ${n(rest)}. Adding back checks it: ${n(rest)} + ${n(h)} = ${n(u)}.` }
  ] }; }
});

/* ---- q03 Multiplying ---- */
/* q03b: the parent's two-step product, as phone data for calls. */
practice({
 id: 'q03b', parent: 'q03', kind: 'setting',
 title: 'Data for the video calls',
 brief: 'Calls home use up the phone’s data allowance, and it helps to know how much before the month runs out.',
 labels: ['MB for one call', 'MB for all the calls'], tolerance: 0.001
}, [['MB for one call'], ['MB for all the calls']], {
 canonical: { k: 8, m: 14, r: 5 },
 draw: R => { const k = R.int(3, 9); return { k, m: R.except(12, 29, [20]), r: R.except(2, 6, [k]) }; },
 build: ({ k, m, r }) => { const o = m % 10, t = m - o, one = k * m, all = one * r; return {
  prompt: `A video call uses ${n(m)} MB of phone data each minute (MB, short for megabytes, is how phone data is measured). One call home lasts ${n(k)} minutes. Enter the MB that one call uses, then the MB used by ${n(r)} calls of that length (type each number without commas).`,
  answer: [one, all],
  hints: [`Each minute is one equal group of ${n(m)} MB, so one call is ${n(k)} × ${n(m)}. Split ${n(m)} into ${n(t)} and ${n(o)} and multiply each part by ${n(k)}.`, `Then multiply the MB for one call by the number of calls. ${one >= 100 ? 'A three-digit number splits into hundreds, tens and ones' : 'Split it into tens and ones again'}.`],
  solution: `One call: ${n(k)} × ${n(m)}. ${splitMul(k, m)} MB. All the calls: ${n(r)} × ${n(one)}. ${splitMul(r, one)} MB.`,
  guidance: [
   { prompt: `One call is ${n(k)} minutes at ${n(m)} MB each minute. What is ${n(k)} × ${n(m)}?`, answer: [one], explanation: `${n(k)} groups of ${n(t)} make ${n(k * t)} and ${n(k)} groups of ${n(o)} make ${n(k * o)}; together that is ${n(one)} MB.` },
   { prompt: `There are ${n(r)} calls of ${n(one)} MB each. What is ${n(r)} × ${n(one)}?`, answer: [all], explanation: `${splitMul(r, one)} MB.` }
  ] }; }
});

/* q03c: two products and their sum. */
practice({
 id: 'q03c', parent: 'q03', kind: 'applied',
 title: 'Paint for the bunk room',
 brief: 'The bunk room is being repainted, and the shop bill has to be worked out before anyone goes to the till.',
 labels: ['cost of the paint', 'cost of the rollers', 'total bill'], tolerance: 0.001
}, [['cost of the paint'], ['cost of the rollers'], ['total bill']], {
 canonical: { t: 6, p: 34, b: 4, q: 13 },
 draw: R => { const t = R.int(3, 8); return { t, p: R.except(21, 48, [30, 40]), b: R.except(2, 6, [t]), q: R.int(12, 19) }; },
 build: ({ t, p, b, q }) => { const paint = t * p, roll = b * q, bill = paint + roll; return {
  prompt: `You are repainting a room. You buy ${n(t)} tins of paint at ${n(p)} dollars each and ${n(b)} rollers at ${n(q)} dollars each. Enter the cost of the paint, then the cost of the rollers, then the total bill.`,
  answer: [paint, roll, bill],
  hints: ['Every tin costs the same, so the paint is a number of equal groups: multiply the number of tins by the price of one tin. Do the same for the rollers.', 'To multiply by a two-digit price, split the price into tens and ones and multiply each part. The bill is the two costs added together.'],
  solution: `Paint: ${n(t)} × ${n(p)}. ${splitMul(t, p)} dollars. Rollers: ${n(b)} × ${n(q)}. ${splitMul(b, q)} dollars. Bill: ${n(paint)} + ${n(roll)} = ${n(bill)} dollars.`,
  guidance: [
   { prompt: `${n(t)} tins at ${n(p)} dollars each. What is ${n(t)} × ${n(p)}?`, answer: [paint], explanation: `${splitMul(t, p)} dollars.` },
   { prompt: `${n(b)} rollers at ${n(q)} dollars each. What is ${n(b)} × ${n(q)}?`, answer: [roll], explanation: `${splitMul(b, q)} dollars.` },
   { prompt: `The paint costs ${n(paint)} dollars and the rollers cost ${n(roll)} dollars. What is ${n(paint)} + ${n(roll)}?`, answer: [bill], explanation: `Add column by column from the ones: ${n(paint)} + ${n(roll)} = ${n(bill)} dollars.` }
  ] }; }
});

/* q03d: a two-digit number times a number from 12 to 19, split into 10 and the rest; "times 10" comes from place value (q01). */
practice({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q01',
 title: 'The weekly savings jar',
 brief: 'The same amount goes into a savings jar every week, and you want to know what it will hold later in the year.',
 labels: ['dollars after 10 weeks', 'dollars at the end'], tolerance: 0.001
}, [['dollars after 10 weeks'], ['dollars for the extra weeks'], ['dollars at the end']], {
 canonical: { m: 27, w: 16 },
 draw: R => ({ m: R.except(13, 49, [20, 30, 40]), w: R.int(12, 19) }),
 build: ({ m, w }) => { const ten = 10 * m, x = w - 10, rest = x * m, all = w * m; return {
  prompt: `You put ${n(m)} dollars into a savings jar every week. Enter how many dollars are in the jar after 10 weeks, then how many after ${n(w)} weeks.`,
  answer: [ten, all],
  hints: ['Ten groups of a number: each of its ones becomes a ten and each of its tens becomes a hundred. So every digit moves one place to the left and a 0 fills the ones place.', `Split ${n(w)} weeks into 10 weeks and ${n(x)} more weeks. Work out the dollars for each part, then add the two parts.`],
  solution: `After 10 weeks: 10 × ${n(m)} is ${n(m)} tens, written ${n(ten)} dollars. The other ${n(x)} weeks: ${n(x)} × ${n(m)}. ${splitMul(x, m)} dollars. After ${n(w)} weeks: ${n(ten)} + ${n(rest)} = ${n(all)} dollars.`,
  guidance: [
   { prompt: `Over 10 weeks each of the ${n(m)} dollars is put in 10 times, so the jar holds ${n(m)} tens. What is 10 × ${n(m)}?`, answer: [ten], explanation: `${n(m)} tens are written ${n(ten)}: each digit of ${n(m)} moves one place to the left and a 0 fills the ones place.` },
   { prompt: `${n(w)} weeks are 10 weeks and ${n(x)} more weeks. What is ${n(x)} × ${n(m)}?`, answer: [rest], explanation: `${splitMul(x, m)} dollars.` },
   { prompt: `Add the two parts: ${n(ten)} dollars for 10 weeks and ${n(rest)} dollars for the other ${n(x)} weeks. What is ${n(ten)} + ${n(rest)}?`, answer: [all], explanation: `${n(ten)} + ${n(rest)} = ${n(all)}, so the jar holds ${n(all)} dollars after ${n(w)} weeks.` }
  ] }; }
});

/* ---- q04 Dividing with remainders ---- */
/* q04b: grams of coffee into cups. */
practice({
 id: 'q04b', parent: 'q04', kind: 'setting',
 title: 'Cups from the coffee jar',
 brief: 'The galley coffee jar is running low, and the cook wants to know how many cups are left in it.',
 labels: ['full cups', 'grams left over'], tolerance: 0.001
}, [['full cups'], ['grams left over']], {
 canonical: { d: 7, q: 19, r: 4 },
 draw: R => { const d = R.int(6, 9); return { d, q: R.int(11, 30), r: R.int(1, d - 1) }; },
 build: ({ d, q, r }) => { const dq = d * q, N = dq + r; return {
  prompt: `A jar holds ${n(N)} g of ground coffee (g is short for grams). Each cup you make takes ${n(d)} g. Enter how many full cups the jar makes, then how many grams of coffee are left over.`,
  answer: [q, r],
  hints: [`Count how many groups of ${n(d)} g fit into ${n(N)} g. ${easy(d, N)} Then add more groups of ${n(d)} until one more would go over ${n(N)}.`, `The coffee left over is too little for another cup, so it must be less than ${n(d)} g.`],
  solution: `${n(d)} × ${n(q)} = ${n(dq)}, and ${n(d)} × ${n(q + 1)} = ${n(dq + d)} is more than ${n(N)}. So the jar makes ${n(q)} full cups, and ${n(N)} − ${n(dq)} = ${n(r)} g ${r === 1 ? 'is' : 'are'} left over: ${n(N)} ÷ ${n(d)} = ${n(q)} remainder ${n(r)}.`,
  guidance: [
   { prompt: `Each cup takes ${n(d)} g. ${n(d)} × ${n(q)} = ${n(dq)} and ${n(d)} × ${n(q + 1)} = ${n(dq + d)}. What is the largest number of cups that ${n(N)} g can make?`, answer: [q], explanation: `${n(dq)} is not more than ${n(N)} but ${n(dq + d)} is, so the jar makes ${n(q)} full cups.` },
   { prompt: `${n(q)} cups use ${n(dq)} g. How many of the ${n(N)} g are left? Work out ${n(N)} − ${n(dq)}.`, answer: [r], explanation: `${n(N)} − ${n(dq)} = ${n(r)}, which is less than ${n(d)}, so it cannot make another cup.` }
  ] }; }
});

/* q04c: the remainder still needs a vehicle, so the number to book is one more than the full ones. */
practice({
 id: 'q04c', parent: 'q04', kind: 'applied',
 title: 'Minibuses for the outing',
 brief: 'The whole crew is going on an outing, and the minibuses have to be booked today.',
 labels: ['full minibuses', 'people left over', 'minibuses to book'], tolerance: 0.001
}, [['full minibuses'], ['people left over'], ['minibuses to book']], {
 canonical: { d: 7, q: 8, r: 2 },
 draw: R => { const d = R.int(6, 9); return { d, q: R.except(5, 14, [d]), r: R.int(1, d - 1) }; },
 build: ({ d, q, r }) => { const dq = d * q, N = dq + r, folk = r === 1 ? 'person' : 'people'; return {
  prompt: `${n(N)} people are going on an outing. Each minibus seats ${n(d)} passengers. Enter how many minibuses can be completely filled, then how many people are left over after those are full, then how many minibuses must be booked so that everyone can go.`,
  answer: [q, r, q + 1],
  hints: [`Find the largest number of groups of ${n(d)} that fit into ${n(N)}. The people who do not make another full group are the remainder.`, 'The people left over still have to travel. They cannot fill a minibus, but they do need one.'],
  solution: `${n(d)} × ${n(q)} = ${n(dq)}, and ${n(d)} × ${n(q + 1)} = ${n(dq + d)} is more than ${n(N)}. So ${n(q)} minibuses are full and ${n(N)} − ${n(dq)} = ${n(r)} ${folk} ${r === 1 ? 'is' : 'are'} left over: ${n(N)} ÷ ${n(d)} = ${n(q)} remainder ${n(r)}. The ${n(r)} ${folk} left over ${r === 1 ? 'needs' : 'need'} one more minibus, so ${n(q)} + 1 = ${n(q + 1)} minibuses must be booked.`,
  guidance: [
   { prompt: `Each minibus seats ${n(d)}. ${n(d)} × ${n(q)} = ${n(dq)} and ${n(d)} × ${n(q + 1)} = ${n(dq + d)}. What is the largest number of minibuses that ${n(N)} people can fill?`, answer: [q], explanation: `${n(dq)} is not more than ${n(N)} but ${n(dq + d)} is, so ${n(q)} minibuses can be filled.` },
   { prompt: `${n(q)} full minibuses carry ${n(dq)} people. How many of the ${n(N)} people are left? Work out ${n(N)} − ${n(dq)}.`, answer: [r], explanation: `${n(N)} − ${n(dq)} = ${n(r)}, which is less than ${n(d)}, so ${r === 1 ? 'this person does' : 'these people do'} not fill another minibus.` },
   { prompt: `The ${n(r)} ${folk} left over ${r === 1 ? 'needs' : 'need'} a minibus too. How many minibuses must be booked in all?`, answer: [q + 1], explanation: `${n(q)} full minibuses and 1 more for the ${n(r)} ${folk} left over make ${n(q + 1)}. The last minibus has empty seats.` }
  ] }; }
});

/* q04d: the total is not given; it has to be found by multiplying (q03) before it is divided. */
practice({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03',
 title: 'Power cells for the rovers',
 brief: 'A delivery of power cells has to be moved from its cases onto the rover racks, and the depot wants to know how the racks will fill.',
 labels: ['cells delivered', 'full racks', 'cells left over'], tolerance: 0.001
}, [['cells delivered'], ['full racks'], ['cells left over']], {
 canonical: { k: 7, m: 18, d: 8 },
 /* 100 to 261 cells. The rack size is not the number of cases or the case size, and it leaves a remainder. */
 draw: R => until(() => ({ k: R.int(4, 9), m: R.except(14, 29, [20]), d: R.int(6, 9) }),
  ({ k, m, d }) => d !== k && k * m >= 100 && (k * m) % d !== 0 && m % d !== 0, { k: 7, m: 18, d: 8 }),
 build: ({ k, m, d }) => { const total = k * m, r = total % d, q = (total - r) / d, dq = d * q; return {
  prompt: `The depot receives ${n(k)} cases of power cells with ${n(m)} cells in each case. The cells are moved onto rover racks that hold ${n(d)} cells each. Enter the number of cells delivered, then how many racks are completely full, then how many cells are left over.`,
  answer: [total, q, r],
  hints: [`First count the cells by multiplying: ${n(k)} cases of ${n(m)}. Split ${n(m)} into tens and ones.`, `Then count how many groups of ${n(d)} fit into your total. ${easy(d, total)} Then add more groups of ${n(d)} until one more would go over.`],
  solution: `Cells delivered: ${n(k)} × ${n(m)}. ${splitMul(k, m)} cells. Racks: ${n(d)} × ${n(q)} = ${n(dq)}, and ${n(d)} × ${n(q + 1)} = ${n(dq + d)} is more than ${n(total)}. So ${n(q)} racks are full, and ${n(total)} − ${n(dq)} = ${n(r)} ${r === 1 ? 'cell is' : 'cells are'} left over: ${n(total)} ÷ ${n(d)} = ${n(q)} remainder ${n(r)}.`,
  guidance: [
   { prompt: `There are ${n(k)} cases of ${n(m)} cells. What is ${n(k)} × ${n(m)}?`, answer: [total], explanation: `${splitMul(k, m)} cells.` },
   { prompt: `Each rack takes ${n(d)} cells. ${n(d)} × ${n(q)} = ${n(dq)} and ${n(d)} × ${n(q + 1)} = ${n(dq + d)}. What is the largest number of racks that ${n(total)} cells can fill?`, answer: [q], explanation: `${n(dq)} is not more than ${n(total)} but ${n(dq + d)} is, so ${n(q)} racks can be filled.` },
   { prompt: `${n(q)} full racks use ${n(dq)} cells. How many of the ${n(total)} cells are left? Work out ${n(total)} − ${n(dq)}.`, answer: [r], explanation: `${n(total)} − ${n(dq)} = ${n(r)}, which is less than ${n(d)}, so it cannot fill another rack.` }
  ] }; }
});

/* ---- q05 Order of operations ---- */
/* q05b: two everyday sums, one with no bracket (× before +) and one where the bracket changes the order. */
practice({
 id: 'q05b', parent: 'q05', kind: 'setting',
 title: 'The taxi and the shared meal',
 brief: 'After an evening in town there are two sums to settle: the taxi fare and each friend’s share of the meal.',
 labels: ['taxi fare', 'each friend pays'], tolerance: 0.001
}, [['charge for the distance'], ['taxi fare'], ['meal and tip'], ['each friend pays']], {
 canonical: { a: 4, b: 3, c: 8, x: 62, y: 10, p: 4 },
 /* The meal and the tip together are an exact number of dollars for each friend (8 to 25 dollars). */
 draw: R => { const p = R.int(3, 6), total = p * R.int(8, 25), y = R.int(5, Math.floor(total / 4));
  return { a: R.int(3, 6), b: R.int(2, 4), c: R.int(5, 12), x: total - y, y, p }; },
 build: ({ a, b, c, x, y, p }) => { const bc = b * c, fare = a + bc, total = x + y, each = total / p; return {
  prompt: `Two sums from an evening in town, written in the agreed shorthand. Taxi line: ${n(a)} + ${n(b)} × ${n(c)}. That is a charge of ${n(a)} dollars to start, and ${n(b)} dollars for each of ${n(c)} km (kilometres). Meal line: (${n(x)} + ${n(y)}) ÷ ${n(p)}. That is a meal of ${n(x)} dollars and a tip of ${n(y)} dollars, paid in equal parts by ${n(p)} friends. Enter the taxi fare, then what each friend pays for the meal.`,
  answer: [fare, each],
  hints: ['Brackets first. Then every × and ÷, from left to right. Then every + and −, from left to right.', 'The taxi line has no bracket, so its × is done before its +. In the meal line the bracket is done first, then the ÷.'],
  solution: `Taxi line: ${n(a)} + ${n(b)} × ${n(c)} = ${n(a)} + ${n(bc)} = ${n(fare)} dollars. Meal line: (${n(x)} + ${n(y)}) ÷ ${n(p)} = ${n(total)} ÷ ${n(p)} = ${n(each)} dollars each.`,
  guidance: [
   { prompt: `Taxi line: ${n(a)} + ${n(b)} × ${n(c)}. The × is done before the +. What is ${n(b)} × ${n(c)}?`, answer: [bc], explanation: `${n(b)} × ${n(c)} = ${n(bc)}, so the taxi line is ${n(a)} + ${n(bc)}.` },
   { prompt: `Now the taxi line is ${n(a)} + ${n(bc)}. What is its value?`, answer: [fare], explanation: `${n(a)} + ${n(bc)} = ${n(fare)}, so the fare is ${n(fare)} dollars.` },
   { prompt: `Meal line: (${n(x)} + ${n(y)}) ÷ ${n(p)}. The bracket comes first. What is ${n(x)} + ${n(y)}?`, answer: [total], explanation: `${n(x)} + ${n(y)} = ${n(total)}, so the meal line is ${n(total)} ÷ ${n(p)}.` },
   { prompt: `Now the meal line is ${n(total)} ÷ ${n(p)}. What is its value?`, answer: [each], explanation: `${n(total)} ÷ ${n(p)} = ${n(each)}, because ${n(p)} × ${n(each)} = ${n(total)}. Each friend pays ${n(each)} dollars.` }
  ] }; }
});

/* q05c: one line with a bracket, a × and a −, done in three steps. */
practice({
 id: 'q05c', parent: 'q05', kind: 'applied',
 title: 'Checking the pay slip',
 brief: 'A weekend of extra shifts has been paid, and the single line on the pay slip should be checked.',
 labels: ['hours worked', 'take-home pay'], tolerance: 0.001
}, [['hours worked'], ['pay before tax'], ['take-home pay']], {
 canonical: { g: 3, h: 5, r: 14, d: 20 },
 /* 5 to 9 hours in all, two different shifts; the tax is far below the pay. */
 draw: R => { const g = R.int(2, 5), h = R.except(2, Math.min(6, 9 - g), [g]); return { g, h, r: R.int(12, 19), d: R.int(8, 30) }; },
 build: ({ g, h, r, d }) => { const hours = g + h, gross = hours * r, net = gross - d; return {
  prompt: `Your pay slip for the weekend has one line: (${n(g)} + ${n(h)}) × ${n(r)} − ${n(d)}. It means ${n(g)} hours on Saturday and ${n(h)} hours on Sunday, paid at ${n(r)} dollars an hour, with ${n(d)} dollars taken off for tax. Enter the hours worked (the value of the bracket), then the pay you take home (the value of the whole line).`,
  answer: [hours, net],
  hints: ['There are three steps, in the agreed order: the bracket, then the ×, then the −.', `Put the value of the bracket in its place and rewrite the line before you multiply. To multiply by ${n(r)}, split it into 10 and ${n(r - 10)}.`],
  solution: `(${n(g)} + ${n(h)}) × ${n(r)} − ${n(d)} = ${n(hours)} × ${n(r)} − ${n(d)} = ${n(gross)} − ${n(d)} = ${n(net)}. The bracket gives ${n(hours)} hours, and the pay you take home is ${n(net)} dollars.`,
  guidance: [
   { prompt: `The bracket comes first. What is ${n(g)} + ${n(h)}?`, answer: [hours], explanation: `${n(g)} + ${n(h)} = ${n(hours)}, so the line is ${n(hours)} × ${n(r)} − ${n(d)}.` },
   { prompt: `Now the line is ${n(hours)} × ${n(r)} − ${n(d)}. The × is done before the −. What is ${n(hours)} × ${n(r)}?`, answer: [gross], explanation: `${splitMul(hours, r)}. The line is now ${n(gross)} − ${n(d)}.` },
   { prompt: `Now the line is ${n(gross)} − ${n(d)}. What is its value?`, answer: [net], explanation: `${n(gross)} − ${n(d)} = ${n(net)}, so you take home ${n(net)} dollars.` }
  ] }; }
});

/* q05d: longer lines. In the first, ÷ and × sit side by side and so do − and +, so "left to right" decides;
   in the second, two brackets are multiplied before a product is subtracted. */
practice({
 id: 'q05d', parent: 'q05', kind: 'challenge',
 title: 'Two long lines in the fuel log',
 brief: 'Two tallies in the fuel log were each squeezed onto a single line, and nobody is sure what they come to.',
 labels: ['canisters', 'litres'], tolerance: 0.001
}, [['value of the ÷ and ×'], ['canisters'], ['brackets multiplied'], ['litres']], {
 canonical: { t: 50, u: 4, q: 6, r: 2, s: 7, a: 4, b: 6, c: 9, e: 5, f: 3, g: 8 },
 /* Canisters line: t − (u × q) ÷ q × r + s, with r ≠ q so that working strictly left to right is wrong too.
    Litres line: (a + b) × (c − e) − f × g, positive, at most 120 before the subtraction, and not equal to the
    value read without its brackets. */
 draw: R => until(() => { const u = R.int(2, 6), q = R.int(2, 6), r = R.except(2, 4, [q]), c = R.int(8, 15);
   return { t: u * r + R.int(8, 30), u, q, r, s: R.int(3, 9), a: R.int(2, 9), b: R.int(2, 9), c, e: R.int(2, c - 2), f: R.int(2, 5), g: R.int(2, 8) }; },
  ({ a, b, c, e, f, g }) => { const x = (a + b) * (c - e); return x <= 120 && x - f * g >= 2 && a + b * c - e !== x && f !== g; },
  { t: 50, u: 4, q: 6, r: 2, s: 7, a: 4, b: 6, c: 9, e: 5, f: 3, g: 8 }),
 build: ({ t, u, q, r, s, a, b, c, e, f, g }) => { const p = u * q, ur = u * r, mid = t - ur, v1 = mid + s, ab = a + b, ce = c - e, x = ab * ce, fg = f * g, v2 = x - fg; return {
  prompt: `Two tallies in the fuel log were each squeezed onto one line. Canisters line: ${n(t)} − ${n(p)} ÷ ${n(q)} × ${n(r)} + ${n(s)}. Litres line: (${n(a)} + ${n(b)}) × (${n(c)} − ${n(e)}) − ${n(f)} × ${n(g)}. Enter the value of the canisters line, then the value of the litres line.`,
  answer: [v1, v2],
  hints: ['When ÷ and × stand next to each other, do them in the order they come, from left to right. The same goes for + and −: neither one goes first.', `Canisters line: do ${n(p)} ÷ ${n(q)}, then multiply that result by ${n(r)}; only then subtract and add, from left to right. Litres line: work out both brackets first.`],
  solution: `Canisters line: ${n(p)} ÷ ${n(q)} = ${n(u)} and ${n(u)} × ${n(r)} = ${n(ur)}, so the line is ${n(t)} − ${n(ur)} + ${n(s)}. From left to right: ${n(t)} − ${n(ur)} = ${n(mid)}, then ${n(mid)} + ${n(s)} = ${n(v1)}. Litres line: the brackets are ${n(a)} + ${n(b)} = ${n(ab)} and ${n(c)} − ${n(e)} = ${n(ce)}, so the line is ${n(ab)} × ${n(ce)} − ${n(f)} × ${n(g)} = ${n(x)} − ${n(fg)} = ${n(v2)}.`,
  guidance: [
   { prompt: `Canisters line: ${n(t)} − ${n(p)} ÷ ${n(q)} × ${n(r)} + ${n(s)}. The ÷ and the × come first, from left to right. What is ${n(p)} ÷ ${n(q)} × ${n(r)}?`, answer: [ur], explanation: `${n(p)} ÷ ${n(q)} = ${n(u)}, then ${n(u)} × ${n(r)} = ${n(ur)}. The line is now ${n(t)} − ${n(ur)} + ${n(s)}.` },
   { prompt: `Now the canisters line is ${n(t)} − ${n(ur)} + ${n(s)}. Work from left to right. What is its value?`, answer: [v1], explanation: `${n(t)} − ${n(ur)} = ${n(mid)}, then ${n(mid)} + ${n(s)} = ${n(v1)}.` },
   { prompt: `Litres line: (${n(a)} + ${n(b)}) × (${n(c)} − ${n(e)}) − ${n(f)} × ${n(g)}. Work out both brackets, then multiply them together. What is (${n(a)} + ${n(b)}) × (${n(c)} − ${n(e)})?`, answer: [x], explanation: `${n(a)} + ${n(b)} = ${n(ab)} and ${n(c)} − ${n(e)} = ${n(ce)}, and ${n(ab)} × ${n(ce)} = ${n(x)}. The line is now ${n(x)} − ${n(f)} × ${n(g)}.` },
   { prompt: `Now the litres line is ${n(x)} − ${n(f)} × ${n(g)}. The × is done before the −. What is its value?`, answer: [v2], explanation: `${n(f)} × ${n(g)} = ${n(fg)}, then ${n(x)} − ${n(fg)} = ${n(v2)}.` }
  ] }; }
});
})();
