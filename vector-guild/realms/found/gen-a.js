/* Foundations mission generators, file a: q01–q12 (chapters 1 and 2). Shape and helpers: docs/PACK-FORMAT.md ("Generator") and game/gen-core.js.
   build(canonical) reproduces the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
/* A fraction in lowest terms with a denominator from the list. */
const frac = (R, dens) => { const d = R.pick(dens); let k = R.int(1, d - 1); while (gcd(k, d) !== 1) k = R.int(1, d - 1); return [k, d]; };
/* Hundredths as text with two decimals: 160 → "1.60". */
const f2 = h => (h / 100).toFixed(2);
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 q01: {
  canonical: { a: 3, b: 5, c: 0, d: 7 },
  draw: R => ({ a: R.int(1, 9), b: R.int(1, 9), c: R.int(0, 9), d: R.int(0, 9) }),
  build: ({ a, b, c, d }) => { const total = 1000 * a + 100 * b + 10 * c + d, hund = 100 * b, /* "1 ten" / "3 tens" */ one = (k, word) => `${n(k)} ${word}${k === 1 ? '' : 's'}`; return {
   prompt: `Depot tally of rivets: full crates of 1000, ${n(a)}; boxes of 100, ${n(b)}; bags of 10, ${n(c)}; loose rivets, ${n(d)}. Enter the total number of rivets (type it without commas). Then enter how many rivets the hundreds digit of your total stands for.`,
   answer: [total, hund],
   hints: ['Write one digit for each place, thousands first, then hundreds, tens and ones. Write 0 for a place that has none.', 'Find the hundreds digit, the second from the left. Each hundred is 100 rivets.'],
   solution: `${one(a, 'thousand')}, ${one(b, 'hundred')}, ${one(c, 'ten')} and ${one(d, 'one')} are written ${n(total)}. The hundreds digit ${n(b)} stands for ${one(b, 'hundred')}, which is ${n(hund)} rivets.`,
   guidance: [
    { prompt: `Write the digits in order: thousands, hundreds, tens, ones. What number do ${one(a, 'thousand')}, ${one(b, 'hundred')}, ${one(c, 'ten')} and ${one(d, 'one')} make?`, answer: [total], explanation: `The digits ${n(a)}, ${n(b)}, ${n(c)}, ${n(d)} in that order make ${n(total)}. Each digit sits in the place it counts.` },
    { prompt: `The hundreds digit is ${n(b)}. How many rivets ${b === 1 ? 'does 1 hundred' : `do ${n(b)} hundreds`} make?`, answer: [hund], explanation: `Each hundred is one hundred rivets, so ${b === 1 ? '1 hundred is' : `${n(b)} hundreds are`} ${n(hund)} rivets.` }
   ] }; }
 },
 q02: {
  canonical: { a: 347, b: 285, c: 198 },
  draw: R => { const a = R.int(210, 489), b = R.int(115, 389); return { a, b, c: R.int(101, Math.min(399, a + b - 50)) }; },
  build: ({ a, b, c }) => { const s = a + b, r = s - c; return {
   prompt: `Morning stock: ${n(a)} ration packs. A shuttle lands with ${n(b)} more. Then ${n(c)} packs are sent out to the survey team. Enter the number of packs after the shuttle lands, then the number left after the survey team's packs go out.`,
   answer: [s, r],
   hints: ['Line the numbers up so ones sit under ones and tens under tens. Work from the ones column to the left; carry a ten when a column adds up to 10 or more, and borrow a ten when a column is too small to subtract.', `First work out ${n(a)} + ${n(b)}. Then take ${n(c)} away from that total.`],
   solution: `Adding: ${n(a)} + ${n(b)} = ${n(s)} packs after the shuttle. Subtracting: ${n(s)} − ${n(c)} = ${n(r)} packs left. Check: ${n(r)} + ${n(c)} = ${n(s)}.`,
   guidance: [
    { prompt: `${n(a)} packs and ${n(b)} more packs. What is ${n(a)} + ${n(b)}?`, answer: [s], explanation: `Add column by column from the ones, carrying when a column reaches 10: ${n(a)} + ${n(b)} = ${n(s)}.` },
    { prompt: `There are ${n(s)} packs and ${n(c)} go out. What is ${n(s)} − ${n(c)}?`, answer: [r], explanation: `Subtract column by column from the ones, borrowing when needed: ${n(s)} − ${n(c)} = ${n(r)}. Adding back checks it: ${n(r)} + ${n(c)} = ${n(s)}.` }
   ] }; }
 },
 q03: {
  canonical: { k: 7, m: 18, r: 4 },
  draw: R => ({ k: R.int(3, 9), m: R.except(12, 29, [20]), r: R.int(2, 6) }),
  build: ({ k, m, r }) => { const o = m % 10, t = m - o, one = k * m, all = one * r;
   /* one rack split into hundreds, tens and ones (zero parts left out), each multiplied by r */
   const parts = [100 * Math.floor(one / 100), 10 * Math.floor(one / 10 % 10), one % 10].filter(x => x > 0);
   const list = xs => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
   const times = list(parts.map(x => `${n(x)} × ${n(r)} = ${n(x * r)}`)), sum = parts.map(x => n(x * r)).join(' + ');
   const split = parts.length < 2 ? `${n(one)} × ${n(r)} = ${n(all)}` : `Split ${n(one)} into ${list(parts.map(n))}: ${times}`;
   return {
   prompt: `The depot stacks water jugs on racks. One rack has ${n(k)} shelves with ${n(m)} jugs on each shelf. Enter the number of jugs on one rack, then the number of jugs on ${n(r)} identical racks. Type each number without commas.`,
   answer: [one, all],
   hints: [`Split ${n(m)} into ${n(t)} and ${n(o)}. Work out ${n(k)} × ${n(t)} and ${n(k)} × ${n(o)}, then add the two results.`, `Then multiply the jugs on one rack by ${n(r)}, the number of racks.`],
   solution: `One rack: ${n(k)} × ${n(m)}. Split ${n(m)} into ${n(t)} and ${n(o)}: ${n(k)} × ${n(t)} = ${n(k * t)} and ${n(k)} × ${n(o)} = ${n(k * o)}, and ${n(k * t)} + ${n(k * o)} = ${n(one)} jugs. ${n(r)} racks: ${parts.length < 2 ? `${split} jugs.` : `${n(one)} × ${n(r)}. ${split}, and ${sum} = ${n(all)} jugs.`}`,
   guidance: [
    { prompt: `One rack is ${n(k)} shelves of ${n(m)} jugs. What is ${n(k)} × ${n(m)}?`, answer: [one], explanation: `${n(k)} groups of ${n(t)} make ${n(k * t)} and ${n(k)} groups of ${n(o)} make ${n(k * o)}; together that is ${n(one)} jugs.` },
    { prompt: `There are ${n(r)} racks of ${n(one)} jugs. What is ${n(one)} × ${n(r)}?`, answer: [all], explanation: parts.length < 2 ? `${n(r)} groups of ${n(one)} make ${n(all)} jugs.` : `${split}; together that is ${n(all)} jugs.` }
   ] }; }
 },
 q04: {
  canonical: { d: 6, q: 22, r: 5 },
  draw: R => { const d = R.int(3, 9); return { d, q: R.int(11, 30), r: R.int(1, d - 1) }; },
  build: ({ d, q, r }) => { const dq = d * q, N = dq + r; return {
   prompt: `${n(N)} ration packs arrive loose and are packed into boxes that hold ${n(d)} packs each. Enter how many boxes are completely full, then how many packs are left over.`,
   answer: [q, r],
   hints: [`Count how many groups of ${n(d)} fit into ${n(N)}. ${n(d)} × 10 = ${n(10 * d)} is a good first step.`, `The packs left over are what remains after the full boxes; there must be fewer than ${n(d)} of them.`],
   solution: `${n(d)} × ${n(q)} = ${n(dq)}, and ${n(d)} × ${n(q + 1)} = ${n(dq + d)} is more than ${n(N)}. So ${n(q)} boxes are full, and ${n(N)} − ${n(dq)} = ${n(r)} ${r === 1 ? 'pack is' : 'packs are'} left over: ${n(N)} ÷ ${n(d)} = ${n(q)} remainder ${n(r)}.`,
   guidance: [
    { prompt: `Each box takes ${n(d)} packs. ${n(d)} × ${n(q)} = ${n(dq)} and ${n(d)} × ${n(q + 1)} = ${n(dq + d)}. What is the largest number of boxes that ${n(N)} packs can fill?`, answer: [q], explanation: `${n(dq)} is not more than ${n(N)} but ${n(dq + d)} is, so ${n(q)} boxes can be filled.` },
    { prompt: `${n(q)} full boxes use ${n(dq)} packs. How many of the ${n(N)} packs are left? Work out ${n(N)} − ${n(dq)}.`, answer: [r], explanation: `${n(N)} − ${n(dq)} = ${n(r)}, which is less than ${n(d)}, so it cannot fill another box.` }
   ] }; }
 },
 q05: {
  canonical: { a: 5, b: 3, c: 14, d: 6, e: 12, f: 5, g: 2, h: 3 },
  draw: R => { const c = R.int(10, 20); return { a: R.int(2, 9), b: R.int(2, 6), c, d: R.int(2, c - 3), e: R.int(10, 15), f: R.int(2, 9), g: R.int(2, 3), h: R.int(2, 3) }; },
  build: ({ a, b, c, d, e, f, g, h }) => { const cd = c - d, bcd = b * cd, A = a + bcd, ef = e * f, gh = g * h, B = e - gh; return {
   prompt: `Mira's stock note has two lines. Bottles line: ${n(a)} + ${n(b)} × (${n(c)} − ${n(d)}). Litres line: ${n(ef)} ÷ ${n(f)} − ${n(g)} × ${n(h)}. Work each line out in the agreed order and enter the bottles line, then the litres line.`,
   answer: [A, B],
   hints: ['Brackets first. Then every × and ÷, from left to right. Then every + and −, from left to right.', `In the bottles line, work out ${n(c)} − ${n(d)} first. In the litres line, do ${n(ef)} ÷ ${n(f)} and ${n(g)} × ${n(h)} before you subtract.`],
   solution: `Bottles line: ${n(a)} + ${n(b)} × (${n(c)} − ${n(d)}) = ${n(a)} + ${n(b)} × ${n(cd)} = ${n(a)} + ${n(bcd)} = ${n(A)}. Litres line: ${n(ef)} ÷ ${n(f)} − ${n(g)} × ${n(h)} = ${n(e)} − ${n(gh)} = ${n(B)}.`,
   guidance: [
    { prompt: `In the bottles line the bracket comes first. What is ${n(c)} − ${n(d)}?`, answer: [cd], explanation: `${n(c)} − ${n(d)} = ${n(cd)}, so the bottles line is ${n(a)} + ${n(b)} × ${n(cd)}.` },
    { prompt: `Now the bottles line is ${n(a)} + ${n(b)} × ${n(cd)}. Multiply before you add. What is its value?`, answer: [A], explanation: `${n(b)} × ${n(cd)} = ${n(bcd)}, then ${n(a)} + ${n(bcd)} = ${n(A)}.` },
    { prompt: `The litres line is ${n(ef)} ÷ ${n(f)} − ${n(g)} × ${n(h)}. Do the ÷ and the × first, then subtract. What is its value?`, answer: [B], explanation: `${n(ef)} ÷ ${n(f)} = ${n(e)} and ${n(g)} × ${n(h)} = ${n(gh)}, so the litres line is ${n(e)} − ${n(gh)} = ${n(B)}.` }
   ] }; }
 },
 q06: {
  canonical: { s: -7, u: 12, w: 15 },
  draw: R => { const s = -R.int(3, 12), u = R.int(1 - s, 9 - s); return { s, u, w: s + u + R.int(2, 10) }; },
  build: ({ s, u, w }) => { const noon = s + u, night = noon - w; return {
   prompt: `At dawn the thermometer outside the depot reads ${n(s)} °C. By noon it is ${n(u)} degrees warmer. By night it has fallen ${n(w)} degrees from the noon reading. Enter the noon reading, then the night reading, in °C.`,
   answer: [noon, night],
   hints: ['Picture the number line: warmer means moving right, colder means moving left. Count to 0 first, then past it.', `From ${n(s)} it takes ${n(-s)} degrees to reach 0; the rest of the ${n(u)} degrees go past 0. At night, count down to 0 first, then below it.`],
   solution: `Noon: ${n(s)} + ${n(u)}. Move ${n(-s)} right to reach 0, then ${n(noon)} more, so it reads ${n(noon)} °C. Night: ${n(noon)} − ${n(w)}. Move ${n(noon)} left to reach 0, then ${n(w - noon)} more, so it reads ${n(night)} °C.`,
   guidance: [
    { prompt: `The thermometer starts at ${n(s)}. How many degrees warmer must it get to read 0?`, answer: [-s], explanation: `${n(s)} is ${n(-s)} steps left of 0 on the number line, so ${n(-s)} degrees warmer brings it to 0.` },
    { prompt: `It gets ${n(u)} degrees warmer in all. What does it read at noon?`, answer: [noon], explanation: `${n(-s)} of the ${n(u)} degrees reach 0, and the other ${n(noon)} go past it: ${n(s)} + ${n(u)} = ${n(noon)}.` },
    { prompt: `From ${n(noon)} it falls ${n(w)} degrees. What does it read at night?`, answer: [night], explanation: `${noon === 1 ? '1 degree down reaches' : `${n(noon)} degrees down reach`} 0, and the other ${w - noon === 1 ? '1 goes' : `${n(w - noon)} go`} below it: ${n(noon)} − ${n(w)} = ${n(night)}.` }
   ] }; }
 },
 q07: {
  canonical: { d: 8, k: 3, w: 5 },
  draw: R => { const d = R.pick([4, 5, 6, 8, 10, 12]); return { d, k: R.int(1, d - 1), w: R.int(3, 9) }; },
  build: ({ d, k, w }) => { const bar = d * w, kw = k * w; return {
   prompt: `A ${n(bar)} g ration bar is scored into ${n(d)} equal pieces, and a recruit eats ${k === 1 ? '1 piece' : `${n(k)} pieces`}. Enter the fraction of the bar eaten, numerator then denominator, using the number of pieces the bar is scored into. Then enter the grams eaten.`,
   answer: [k, d, kw],
   hints: ['The denominator counts the equal pieces in the whole bar. The numerator counts the pieces eaten.', `One piece weighs ${n(bar)} ÷ ${n(d)} grams. Multiply that by the pieces eaten.`],
   solution: `The bar has ${n(d)} equal pieces and ${k === 1 ? '1 was' : `${n(k)} were`} eaten, so ${n(k)}/${n(d)} of the bar was eaten. One piece weighs ${n(bar)} ÷ ${n(d)} = ${n(w)} g, so ${k === 1 ? '1 piece weighs' : `${n(k)} pieces weigh`} ${n(k)} × ${n(w)} = ${n(kw)} g.`,
   guidance: [
    { prompt: `Into how many equal pieces is the bar scored?`, answer: [d], explanation: `The whole is cut into ${n(d)} equal pieces, so the denominator is ${n(d)}.` },
    { prompt: `How much does one piece weigh? Work out ${n(bar)} ÷ ${n(d)}.`, answer: [w], explanation: `${n(bar)} g shared into ${n(d)} equal pieces is ${n(w)} g each.` },
    { prompt: `How many grams ${k === 1 ? 'does 1 piece' : `do ${n(k)} pieces`} of ${n(w)} g weigh?`, answer: [kw], explanation: `${n(k)} × ${n(w)} = ${n(kw)} g, which is ${n(k)}/${n(d)} of the bar.` }
   ] }; }
 },
 q08: {
  canonical: { p: 3, q: 4, m: 6 },
  draw: R => { const q = R.int(2, 9); let p = R.int(1, q - 1); while (gcd(p, q) !== 1) p = R.int(1, q - 1); return { p, q, m: R.int(2, 8) }; },
  build: ({ p, q, m }) => { const pm = p * m, qm = q * m; return {
   prompt: `Of ${n(qm)} meal trays, ${n(pm)} have been served. Enter the fraction of the trays served in lowest terms: the numerator, then the denominator.`,
   answer: [p, q],
   hints: [`The fraction served is ${n(pm)}/${n(qm)}. Find a number that divides both ${n(pm)} and ${n(qm)} exactly, and divide the top and the bottom by it. Repeat until no number above 1 divides both.`, `The largest number that divides both ${n(pm)} and ${n(qm)} is ${n(m)}.`],
   solution: `${n(pm)} of ${n(qm)} is the fraction ${n(pm)}/${n(qm)}. The largest number that divides both is ${n(m)}: ${n(pm)} ÷ ${n(m)} = ${n(p)} and ${n(qm)} ÷ ${n(m)} = ${n(q)}. So ${n(pm)}/${n(qm)} = ${n(p)}/${n(q)}, and no number above 1 divides both ${n(p)} and ${n(q)}.`,
   guidance: [
    { prompt: `What is the largest number that divides both ${n(pm)} and ${n(qm)} exactly?`, answer: [m], explanation: `${n(pm)} = ${n(p)} × ${n(m)} and ${n(qm)} = ${n(q)} × ${n(m)}, and no number above 1 divides both ${n(p)} and ${n(q)}, so ${n(m)} is the largest.` },
    { prompt: `Divide the top by ${n(m)}. What is ${n(pm)} ÷ ${n(m)}?`, answer: [p], explanation: `${n(pm)} ÷ ${n(m)} = ${n(p)}.` },
    { prompt: `Divide the bottom by the same number. What is ${n(qm)} ÷ ${n(m)}?`, answer: [q], explanation: `${n(qm)} ÷ ${n(m)} = ${n(q)}. Dividing the top and the bottom by the same number keeps the amount the same.` }
   ] }; }
 },
 q09: {
  canonical: { a: 1, b: 2, c: 1, d: 3, e: 3, f: 4, g: 2, h: 3 },
  /* The sum stays below one litre, so no fraction larger than a whole appears before it is taught. */
  draw: R => { let a, b, c, d, guard = 0; do { [a, b] = frac(R, [2, 3, 4, 5, 6]); [c, d] = frac(R, [2, 3, 4, 5, 6].filter(x => x !== b)); } while (a * d + c * b >= b * d && guard++ < 50); if (a * d + c * b >= b * d) [a, b, c, d] = [1, 2, 1, 3]; const [e, f] = frac(R, [2, 3, 4, 5]); const [g, h] = frac(R, [2, 3, 4, 5, 6]); return { a, b, c, d, e, f, g, h }; },
  build: ({ a, b, c, d, e, f, g, h }) => {
   const L = lcm(b, d), a2 = a * L / b, c2 = c * L / d, top = a2 + c2, k = gcd(top, L), sn = top / k, sd = L / k;
   const pt = e * g, pb = f * h, j = gcd(pt, pb), pn = pt / j, pd = pb / j;
   const sumEnd = k === 1 ? `${n(top)}/${n(L)}, which is already in lowest terms` : `${n(top)}/${n(L)}; dividing the top and the bottom by ${n(k)} gives ${n(sn)}/${n(sd)}`;
   const prodEnd = j === 1 ? `${n(pt)}/${n(pb)}, which is already in lowest terms` : `${n(pt)}/${n(pb)}; dividing the top and the bottom by ${n(j)} gives ${n(pn)}/${n(pd)}`;
   return {
   prompt: `A pot gets ${n(a)}/${n(b)} litre of broth and ${n(c)}/${n(d)} litre of water. Enter the litres in the pot as a fraction in lowest terms, numerator then denominator. Then the cook uses ${n(e)}/${n(f)} of a jug that holds ${n(g)}/${n(h)} litre of oil, that is ${n(e)}/${n(f)} × ${n(g)}/${n(h)} litre. Enter that amount in lowest terms, numerator then denominator.`,
   answer: [sn, sd, pn, pd],
   hints: [`To add, the pieces must be the same size: find a number that both ${n(b)} and ${n(d)} divide into exactly, write both fractions with that denominator, then add the numerators.`, `To multiply, multiply the tops (${n(e)} × ${n(g)}) and the bottoms (${n(f)} × ${n(h)}), then simplify.`],
   solution: `Adding: ${n(a)}/${n(b)} = ${n(a2)}/${n(L)} and ${n(c)}/${n(d)} = ${n(c2)}/${n(L)}, so the sum is ${sumEnd}. Multiplying: ${n(e)}/${n(f)} × ${n(g)}/${n(h)} = ${prodEnd}.`,
   guidance: [
    { prompt: `Write ${n(a)}/${n(b)} and ${n(c)}/${n(d)} with the denominator ${n(L)}. What do the two numerators add up to?`, answer: [top], explanation: `${n(a)}/${n(b)} = ${n(a2)}/${n(L)} and ${n(c)}/${n(d)} = ${n(c2)}/${n(L)}. ${n(a2)} + ${n(c2)} = ${n(top)}, so the sum is ${n(top)}/${n(L)}.` },
    { prompt: `Write ${n(top)}/${n(L)} in lowest terms. Enter the numerator, then the denominator.`, answer: [sn, sd], explanation: k === 1 ? `No number above 1 divides both ${n(top)} and ${n(L)}, so it stays ${n(top)}/${n(L)} litre.` : `Divide the top and the bottom by ${n(k)}: ${n(sn)}/${n(sd)} litre.` },
    { prompt: `Multiply: ${n(e)} × ${n(g)} over ${n(f)} × ${n(h)}. Enter the result in lowest terms, numerator then denominator.`, answer: [pn, pd], explanation: j === 1 ? `${n(pt)}/${n(pb)} litre, already in lowest terms.` : `${n(pt)}/${n(pb)}; divide the top and the bottom by ${n(j)} to get ${n(pn)}/${n(pd)} litre.` }
   ] }; }
 },
 q10: {
  canonical: { x: 275, y: 160, z: 85, C: 8 },
  draw: R => { const x = R.int(105, 395), y = 10 * R.except(11, 39, [20, 30]), z = R.int(15, 95); return { x, y, z, C: Math.ceil((x + y + z) / 100) + R.int(1, 3) }; },
  build: ({ x, y, z, C }) => { const xy = x + y, s = xy + z, left = 100 * C - s; return {
   prompt: `Three fuel canisters hold ${n(x / 100)} L, ${n(y / 100)} L and ${n(z / 100)} L. They are emptied into one jerrycan that holds ${n(C)} L. Enter the total litres poured in, then how many more litres would fit in the jerrycan.`,
   answer: [s / 100, left / 100],
   hints: [`Give every amount two digits after the point (${n(y / 100)} is ${f2(y)}), line up the points, and add as with whole numbers.`, `Then subtract the total from ${n(C)}, which is ${f2(100 * C)}.`],
   solution: `${f2(x)} + ${f2(y)} + ${f2(z)} = ${f2(s)}, so ${n(s / 100)} L were poured in. ${f2(100 * C)} − ${f2(s)} = ${f2(left)}, so ${n(left / 100)} L more would fit.`,
   guidance: [
    { prompt: `Line up the points. What is ${f2(x)} + ${f2(y)}?`, answer: [xy / 100], explanation: `Hundredths, tenths, then ones, carrying as with whole numbers: ${f2(x)} + ${f2(y)} = ${f2(xy)}.` },
    { prompt: `Add the third canister. What is ${f2(xy)} + ${f2(z)}?`, answer: [s / 100], explanation: `${f2(xy)} + ${f2(z)} = ${f2(s)} litres in all.` },
    { prompt: `How many more litres fit in the ${n(C)} L jerrycan? Work out ${f2(100 * C)} − ${f2(s)}.`, answer: [left / 100], explanation: `${f2(100 * C)} − ${f2(s)} = ${f2(left)} litres.` }
   ] }; }
 },
 q11: {
  canonical: { C: 400, p: 35 },
  draw: R => ({ C: R.pick([200, 300, 400, 500, 600, 800, 1000, 1200]), p: 5 * R.int(1, 19) }),
  build: ({ C, p }) => { const o = C / 100, L = p * o, E = C - L; return {
   prompt: `The kitchen's water tank holds ${n(C)} L when full, and the gauge reads ${n(p)}% full. Enter the litres of water in the tank, then how many more litres would fill it. Type each number without commas.`,
   answer: [L, E],
   hints: [`Find 1% first: ${n(C)} ÷ 100 = ${n(o)} litres.`, `${n(p)}% is ${n(p)} times 1%. The empty part is the rest of the ${n(C)} L.`],
   solution: `1% of ${n(C)} L is ${n(C)} ÷ 100 = ${n(o)} L, so ${n(p)}% is ${n(p)} × ${n(o)} = ${n(L)} L. To fill the tank: ${n(C)} − ${n(L)} = ${n(E)} L, which is the other ${n(100 - p)}%.`,
   guidance: [
    { prompt: `What is 1% of ${n(C)} L? Work out ${n(C)} ÷ 100.`, answer: [o], explanation: `Percent means out of every hundred: ${n(C)} litres split into 100 equal parts gives ${n(o)} L per part.` },
    { prompt: `${n(p)}% is ${n(p)} of those parts. How many litres are in the tank?`, answer: [L], explanation: `${n(p)} × ${n(o)} = ${n(L)} L.` },
    { prompt: `How many more litres would fill the ${n(C)} L tank?`, answer: [E], explanation: `${n(C)} − ${n(L)} = ${n(E)} L. Check: ${n(100 - p)} × ${n(o)} = ${n(E)} too.` }
   ] }; }
 },
 q12: {
  canonical: { r: 14, m: 6, T: 15 },
  draw: R => { const m = R.int(3, 8); return { r: R.int(4, 18), m, T: R.except(5, 20, [m]) }; },
  build: ({ r, m, T }) => { const L = r * m, out = r * T; return {
   prompt: `The water pump delivered ${n(L)} litres in ${n(m)} minutes, at a steady rate. Enter its rate in litres per minute, then how many litres it delivers in ${n(T)} minutes at the same rate.`,
   answer: [r, out],
   hints: [`A rate per minute is litres divided by minutes: ${n(L)} ÷ ${n(m)}.`, `At the same rate, ${n(T)} minutes deliver ${n(T)} times the litres of one minute.`],
   solution: `Rate: ${n(L)} L ÷ ${n(m)} min = ${n(r)} L per minute. The ratio of litres to minutes stays the same, so ${n(T)} minutes deliver ${n(r)} × ${n(T)} = ${n(out)} L. Check: ${n(out)}/${n(T)} and ${n(L)}/${n(m)} both simplify to ${n(r)}/1.`,
   guidance: [
    { prompt: `How many litres does the pump deliver in one minute? Work out ${n(L)} ÷ ${n(m)}.`, answer: [r], explanation: `${n(L)} litres shared equally over ${n(m)} minutes is ${n(r)} litres each minute.` },
    { prompt: `At ${n(r)} litres per minute, how many litres in ${n(T)} minutes?`, answer: [out], explanation: `${n(r)} × ${n(T)} = ${n(out)} litres.` }
   ] }; }
 }
});
})();
