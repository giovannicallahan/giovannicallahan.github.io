/* Foundations mission generators, file b: chapters 3 and 4 (q13–q24). Shape and helpers: docs/PACK-FORMAT.md ("Generator") and game/gen-core.js.
   Every draw keeps the numbers whole and friendly: no zero divisors, no negative lengths, no untidy decimals. */
(function(){
'use strict';
const G = window.Gen, { n, par, vec } = G;
/* "+ 4" or "− 4": a signed term with spaces, for beginners. */
const term = x => x < 0 ? `− ${n(-x)}` : `+ ${n(x)}`;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {

/* Writing an expression: a cans on a pallet, b more loaded, a drum of d litres. */
q13: {
 canonical: { a: 7, b: 2, d: 15 },
 draw: R => { const a = R.int(3, 9), b = R.int(2, 5); return { a, b, d: R.except(5, 40, [a + b]) }; },
 build: ({ a, b, d }) => { const k = a + b; return {
  prompt: `Fuel store. Every sealed fuel can holds the same amount, but nobody has measured it yet, so call it c litres. A pallet holds ${n(a)} sealed cans and one open drum with ${n(d)} L in it. Mira loads ${n(b)} more sealed cans onto the pallet. Write the total litres on the pallet as an expression of the form (number)c + (number). Enter the number in front of c, then the number added on its own.`,
  answer: [k, d],
  hints: [`Count the sealed cans after loading: ${n(a)} + ${n(b)}.`, 'Each sealed can is c litres, so the count of sealed cans goes in front of c; the drum’s litres are added on their own.'],
  solution: `The pallet ends with ${n(a)} + ${n(b)} = ${n(k)} sealed cans of c litres each, which is ${n(k)}c litres, plus the drum’s ${n(d)} L. The total is ${n(k)}c + ${n(d)} litres.`,
  guidance: [
   { prompt: `How many sealed cans are on the pallet after Mira loads ${n(b)} more?`, answer: [k], explanation: `${n(a)} + ${n(b)} = ${n(k)} cans. Each holds c litres, so together they hold ${n(k)}c litres.` },
   { prompt: 'The open drum is not a sealed can, so its litres are already known. How many litres does it add on its own?', answer: [d], explanation: `The drum adds ${n(d)} L whatever c turns out to be, so the expression is ${n(k)}c + ${n(d)}.` }
  ] }; }
},

/* Substitution: S litres at the start, r litres burned per hour, read at h1 and h2 hours. */
q14: {
 canonical: { S: 120, r: 8, h1: 5, h2: 9 },
 draw: R => { const r = R.int(4, 12), h1 = R.int(2, 5), h2 = h1 + R.int(2, 5); return { S: r * h2 + R.int(5, 40), r, h1, h2 }; },
 build: ({ S, r, h1, h2 }) => { const L1 = S - r * h1, L2 = S - r * h2; return {
  prompt: `The generator in the fuel store starts a shift with ${n(S)} L in its tank and burns ${n(r)} L every hour, so the litres left after h hours are ${n(S)} − ${n(r)}h. Substitute to find the litres left after ${n(h1)} hours, then after ${n(h2)} hours.`,
  answer: [L1, L2],
  hints: [`Replace h with ${n(h1)}: ${n(S)} − ${n(r)} × ${n(h1)}. Multiply before you subtract.`, `For the second, replace h with ${n(h2)}: ${n(S)} − ${n(r)} × ${n(h2)}.`],
  solution: `After ${n(h1)} hours: ${n(S)} − ${n(r)} × ${n(h1)} = ${n(S)} − ${n(r * h1)} = ${n(L1)} L. After ${n(h2)} hours: ${n(S)} − ${n(r)} × ${n(h2)} = ${n(S)} − ${n(r * h2)} = ${n(L2)} L.`,
  guidance: [
   { prompt: `Put ${n(h1)} in place of h: ${n(S)} − ${n(r)} × ${n(h1)}. What is it?`, answer: [L1], explanation: `Multiply first: ${n(r)} × ${n(h1)} = ${n(r * h1)}. Then ${n(S)} − ${n(r * h1)} = ${n(L1)} L.` },
   { prompt: `Now put ${n(h2)} in place of h: ${n(S)} − ${n(r)} × ${n(h2)}. What is it?`, answer: [L2], explanation: `${n(r)} × ${n(h2)} = ${n(r * h2)}, and ${n(S)} − ${n(r * h2)} = ${n(L2)} L.` }
  ] }; }
},

/* Distributing and combining: k kits of (c + s) litres plus m loose cans. */
q15: {
 canonical: { k: 4, s: 2, m: 3 },
 draw: R => ({ k: R.int(2, 6), s: R.int(2, 5), m: R.int(2, 6) }),
 build: ({ k, s, m }) => { const ks = k * s, km = k + m; return {
  prompt: `Each supply kit holds one fuel can of c litres and a spare bottle of ${n(s)} L, so one kit holds c + ${n(s)} litres. The store has ${n(k)} kits and ${n(m)} loose cans: ${n(k)}(c + ${n(s)}) + ${n(m)}c litres in all. Simplify this to the form (number)c + (number). Enter the number in front of c, then the number on its own.`,
  answer: [km, ks],
  hints: [`Distribute: ${n(k)}(c + ${n(s)}) means ${n(k)} lots of c and ${n(k)} lots of ${n(s)}. Work out ${n(k)} × ${n(s)} for the number on its own.`, `Combine the like terms ${n(k)}c and ${n(m)}c: both count cans of c litres.`],
  solution: `${n(k)}(c + ${n(s)}) + ${n(m)}c = ${n(k)}c + ${n(ks)} + ${n(m)}c = ${n(km)}c + ${n(ks)} litres.`,
  guidance: [
   { prompt: `Distribute: ${n(k)}(c + ${n(s)}) = ${n(k)}c + ?. What is the number on its own?`, answer: [ks], explanation: `The ${n(k)} multiplies both parts inside the brackets: ${n(k)} × ${n(s)} = ${n(ks)}.` },
   { prompt: `Now combine ${n(k)}c + ${n(m)}c. How many c are there?`, answer: [km], explanation: `${n(k)} cans plus ${n(m)} cans is ${n(km)} cans, so ${n(k)}c + ${n(m)}c = ${n(km)}c and the total is ${n(km)}c + ${n(ks)}.` }
  ] }; }
},

/* One-step equations: x − a = b (undo by adding) and k·y = c (undo by dividing). */
q16: {
 canonical: { x: 65, a: 18, k: 5, y: 12 },
 draw: R => { const x = R.int(30, 95); return { x, a: R.int(6, x - 10), k: R.int(3, 9), y: R.int(4, 19) }; },
 build: ({ x, a, k, y }) => { const b = x - a, c = k * y; return {
  prompt: `Fuel ledger. Tank B held x litres. A leak took ${n(a)} L out and the gauge now reads ${n(b)} L, so x − ${n(a)} = ${n(b)}. Separately, ${n(k)} equal cans hold ${n(c)} L in all, so ${n(k)}y = ${n(c)}, where y is the litres in one can. Enter x, then y.`,
  answer: [x, y],
  hints: [`Undo the subtracting: add ${n(a)} to both sides.`, `Undo the multiplying: divide both sides by ${n(k)}.`],
  solution: `x − ${n(a)} = ${n(b)}, so x = ${n(b)} + ${n(a)} = ${n(x)}. ${n(k)}y = ${n(c)}, so y = ${n(c)} ÷ ${n(k)} = ${n(y)}.`,
  guidance: [
   { prompt: `x − ${n(a)} = ${n(b)}. Add ${n(a)} to both sides. What is x?`, answer: [x], explanation: `${n(b)} + ${n(a)} = ${n(x)}. Check: ${n(x)} − ${n(a)} = ${n(b)}.` },
   { prompt: `${n(k)}y = ${n(c)}. Divide both sides by ${n(k)}. What is y?`, answer: [y], explanation: `${n(c)} ÷ ${n(k)} = ${n(y)}. Check: ${n(k)} × ${n(y)} = ${n(c)}.` }
  ] }; }
},

/* Multi-step: k(x + s) + b = T. */
q17: {
 canonical: { k: 3, x: 11, s: 2, b: 12 },
 draw: R => ({ k: R.int(2, 5), x: R.int(4, 15), s: R.int(1, 4), b: R.int(5, 25) }),
 build: ({ k, x, s, b }) => { const C = k * s + b, T = k * (x + s) + b; return {
  prompt: `Mira fills ${n(k)} jerry cans. Each gets x litres from the pump plus a ${n(s)} L top-up, and all of them are poured into the rover’s tank, which already held ${n(b)} L. The gauge now reads ${n(T)} L, so ${n(k)}(x + ${n(s)}) + ${n(b)} = ${n(T)}. Solve for x. Enter what ${n(k)}x equals, then x.`,
  answer: [k * x, x],
  hints: [`Distribute and collect the plain numbers first: ${n(k)}(x + ${n(s)}) + ${n(b)} = ${n(k)}x + ${n(C)}.`, `Subtract ${n(C)} from both sides, then divide both sides by ${n(k)}.`],
  solution: `${n(k)}(x + ${n(s)}) + ${n(b)} = ${n(T)} becomes ${n(k)}x + ${n(k * s)} + ${n(b)} = ${n(T)}, so ${n(k)}x + ${n(C)} = ${n(T)}. Subtract ${n(C)}: ${n(k)}x = ${n(k * x)}. Divide by ${n(k)}: x = ${n(x)} L. Check: ${n(k)} × (${n(x)} + ${n(s)}) + ${n(b)} = ${n(k)} × ${n(x + s)} + ${n(b)} = ${n(T)}.`,
  guidance: [
   { prompt: `Tidy the left side into ${n(k)}x + (a number): distribute ${n(k)}(x + ${n(s)}) and add the ${n(b)}. What is the number?`, answer: [C], explanation: `${n(k)} × ${n(s)} = ${n(k * s)}, and ${n(k * s)} + ${n(b)} = ${n(C)}, so the equation is ${n(k)}x + ${n(C)} = ${n(T)}.` },
   { prompt: `${n(k)}x + ${n(C)} = ${n(T)}. Subtract ${n(C)} from both sides. What is ${n(k)}x?`, answer: [k * x], explanation: `${n(T)} − ${n(C)} = ${n(k * x)}, so ${n(k)}x = ${n(k * x)}.` },
   { prompt: `${n(k)}x = ${n(k * x)}. Divide both sides by ${n(k)}. What is x?`, answer: [x], explanation: `${n(k * x)} ÷ ${n(k)} = ${n(x)}, so each can got ${n(x)} L from the pump.` }
  ] }; }
},

/* Inequality: w·n + base ≤ cap, cap = base + w·nmax + extra with 0 ≤ extra < w, so the largest whole n is nmax. */
q18: {
 canonical: { w: 14, base: 74, nmax: 9, extra: 0 },
 draw: R => { const w = R.int(8, 20); return { w, base: R.int(40, 95), nmax: R.int(5, 12), extra: R.int(0, w - 1) }; },
 build: ({ w, base, nmax, extra }) => { const room = w * nmax + extra, cap = base + room;
  const left = extra ? ` remainder ${n(extra)}` : '';
  return {
  prompt: `The fuel sled may carry at most ${n(cap)} kg. The empty sled weighs ${n(base)} kg, and each full fuel can weighs ${n(w)} kg. With n cans on board the load must satisfy ${n(w)}n + ${n(base)} ≤ ${n(cap)}. Enter how many kilograms are left for cans once the empty sled is counted, then the largest whole number of cans the sled may carry.`,
  answer: [room, nmax],
  hints: [`Subtract ${n(base)} from both sides: ${n(w)}n ≤ ${n(cap)} − ${n(base)}.`, `Divide both sides by ${n(w)}. Cans come whole, so take the largest whole number that is not more than the result.`],
  solution: `${n(w)}n + ${n(base)} ≤ ${n(cap)}, so ${n(w)}n ≤ ${n(room)}. ${n(room)} ÷ ${n(w)} = ${n(nmax)}${left}, so n can be at most ${n(nmax)}. Check: ${n(nmax)} cans weigh ${n(w * nmax)} kg, which fits, but ${n(nmax + 1)} cans would weigh ${n(w * (nmax + 1))} kg, more than ${n(room)} kg. The sled may carry at most ${n(nmax)} cans.`,
  guidance: [
   { prompt: `Subtract ${n(base)} from both sides of ${n(w)}n + ${n(base)} ≤ ${n(cap)}. How many kilograms are left for cans?`, answer: [room], explanation: `${n(cap)} − ${n(base)} = ${n(room)}, so ${n(w)}n ≤ ${n(room)}.` },
   { prompt: `${n(w)}n ≤ ${n(room)}. How many whole cans of ${n(w)} kg fit in ${n(room)} kg?`, answer: [nmax], explanation: `${n(room)} ÷ ${n(w)} = ${n(nmax)}${left}. ${n(nmax)} cans weigh ${n(w * nmax)} kg, which is not more than ${n(room)} kg; one more can would be too many.` }
  ] }; }
},

/* Coordinates: cache 1 a km west and b km north; cache 2 logged as (p, −q). */
q19: {
 canonical: { a: 3, b: 5, p: 4, q: 2 },
 draw: R => ({ a: R.int(1, 9), b: R.int(1, 9), p: R.int(1, 9), q: R.int(1, 9) }),
 build: ({ a, b, p, q }) => ({
  prompt: `The map room grid has the depot at the origin (0, 0). x counts kilometres east (negative means west) and y counts kilometres north (negative means south). Cache 1 lies ${n(a)} km west and ${n(b)} km north of the depot: enter its x, then its y. Cache 2 is logged as ${vec([p, -q])}: enter how many km east it is, then how many km south, both as positive distances.`,
  answer: [-a, b, p, q],
  hints: [`West is the negative x direction, so a point ${n(a)} km west of the depot has a negative x. North is the positive y direction.`, `In ${vec([p, -q])} the first number is east–west and the second is north–south; a negative y means south.`],
  solution: `Cache 1 is at ${vec([-a, b])}: x = ${n(-a)} because it is west, and y = ${n(b)} because it is north. Cache 2 at ${vec([p, -q])} is ${n(p)} km east and ${n(q)} km south of the depot.`,
  guidance: [
   { prompt: `Cache 1 is ${n(a)} km west and ${n(b)} km north of the depot. What are its x and y?`, answer: [-a, b], explanation: `West makes x negative and north makes y positive, so cache 1 is at ${vec([-a, b])}.` },
   { prompt: `Cache 2 is at ${vec([p, -q])}. How many km east, and how many km south, is it?`, answer: [p, q], explanation: `The first number, ${n(p)}, is positive, so it is ${n(p)} km east. The second, ${n(-q)}, is negative, so it is ${n(q)} km south.` }
  ] })
},

/* Distance: a Pythagorean triple (dx, dy, d) placed anywhere on the grid, pointing in any direction. */
q20: {
 canonical: { x1: 1, y1: 2, dx: 6, dy: 8, d: 10, sx: 1, sy: 1 },
 draw: R => { const t = R.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15]]);
  return { x1: R.int(-5, 5), y1: R.int(-5, 5), dx: t[0], dy: t[1], d: t[2], sx: R.pick([1, -1]), sy: R.pick([1, -1]) }; },
 build: ({ x1, y1, dx, dy, d, sx, sy }) => { const x2 = x1 + sx * dx, y2 = y1 + sy * dy, S = dx * dx + dy * dy;
  const xa = Math.max(x1, x2), xb = Math.min(x1, x2), ya = Math.max(y1, y2), yb = Math.min(y1, y2); return {
  prompt: `A signal cable must run straight from the beacon at ${vec([x1, y1])} to the relay at ${vec([x2, y2])}; the grid is in kilometres. Enter the east–west gap, the north–south gap, and then the straight-line distance between them in km.`,
  answer: [dx, dy, d],
  hints: [`Each gap is the larger value minus the smaller: for x that is ${n(xa)} − ${par(xb)}, and for y it is ${n(ya)} − ${par(yb)}.`, 'Multiply each gap by itself and add the two results. The distance is the number that, multiplied by itself, gives that sum.'],
  solution: `East–west gap: ${n(xa)} − ${par(xb)} = ${n(dx)} km. North–south gap: ${n(ya)} − ${par(yb)} = ${n(dy)} km. The two gaps are the short sides of a triangle with a square corner, so the distance times itself is ${n(dx)} × ${n(dx)} + ${n(dy)} × ${n(dy)} = ${n(dx * dx)} + ${n(dy * dy)} = ${n(S)}. Since ${n(d)} × ${n(d)} = ${n(S)}, the square root of ${n(S)} is ${n(d)}, and the cable is ${n(d)} km long.`,
  guidance: [
   { prompt: `The x values are ${n(x1)} and ${n(x2)}. What is the east–west gap?`, answer: [dx], explanation: `${n(xa)} − ${par(xb)} = ${n(dx)} km.` },
   { prompt: `The y values are ${n(y1)} and ${n(y2)}. What is the north–south gap?`, answer: [dy], explanation: `${n(ya)} − ${par(yb)} = ${n(dy)} km.` },
   { prompt: `${n(dx)} × ${n(dx)} + ${n(dy)} × ${n(dy)} = ${n(S)}. What number times itself gives ${n(S)}?`, answer: [d], explanation: `${n(d)} × ${n(d)} = ${n(S)}, so the straight-line distance is ${n(d)} km.` }
  ] }; }
},

/* Slope: two gauge readings, a whole-number rate m (never 0). */
q21: {
 canonical: { x1: 2, run: 4, m: -6, y1: 86 },
 draw: R => { const x1 = R.int(0, 4), run = R.int(2, 6), m = R.nz(-9, 9);
  return { x1, run, m, y1: m < 0 ? R.int(-m * run + 10, 120) : R.int(10, 120 - m * run) }; },
 build: ({ x1, run, m, y1 }) => { const x2 = x1 + run, rise = m * run, y2 = y1 + rise; return {
  prompt: `The log for fuel tank C: at hour ${n(x1)} the gauge read ${n(y1)} L, and at hour ${n(x2)} it read ${n(y2)} L. The level changed at a steady rate between the readings. On a graph with hours across and litres up these are the points ${vec([x1, y1])} and ${vec([x2, y2])}. Enter the rise (the change in litres, negative if the level fell), the run (the change in hours), and then the slope in litres per hour.`,
  answer: [rise, run, m],
  hints: [`Rise = later litres − earlier litres = ${n(y2)} − ${n(y1)}. Run = later hour − earlier hour = ${n(x2)} − ${n(x1)}.`, 'Slope = rise ÷ run: divide your rise by your run, keeping the sign of the rise.'],
  solution: `Rise = ${n(y2)} − ${n(y1)} = ${n(rise)} L. Run = ${n(x2)} − ${n(x1)} = ${n(run)} hours. Slope = ${n(rise)} ÷ ${n(run)} = ${n(m)} L per hour: the tank ${m < 0 ? 'lost' : 'gained'} ${n(Math.abs(m))} L every hour.`,
  guidance: [
   { prompt: `Rise: the later reading minus the earlier one, ${n(y2)} − ${n(y1)}. What is it?`, answer: [rise], explanation: `${n(y2)} − ${n(y1)} = ${n(rise)} L${m < 0 ? '; it is negative because the level fell' : ''}.` },
   { prompt: `Run: the later hour minus the earlier one, ${n(x2)} − ${n(x1)}. What is it?`, answer: [run], explanation: `${n(x2)} − ${n(x1)} = ${n(run)} hours.` },
   { prompt: `Slope = rise ÷ run = ${n(rise)} ÷ ${n(run)}. What is it?`, answer: [m], explanation: `${n(rise)} ÷ ${n(run)} = ${n(m)}: a change of ${n(m)} L for each hour.` }
  ] }; }
},

/* y = mx + b: read m and b, then evaluate at x1 (never below zero litres). */
q22: {
 canonical: { m: -7, b: 150, x1: 12 },
 draw: R => { const m = R.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]), x1 = R.int(2, 10); return { m, x1, b: m < 0 ? R.int(-m * x1 + 5, 160) : R.int(5, 100) }; },
 build: ({ m, b, x1 }) => { const y = m * x1 + b; return {
  prompt: `${m > 0 ? 'The heater is switched off and the refill line is open. ' : ''}The litres y in the heater tank x hours after the start of a shift follow the line y = ${n(m)}x + ${n(b)}. Enter the slope m (litres per hour), the starting amount b (the litres at x = 0), and then the litres in the tank after ${n(x1)} hours.`,
  answer: [m, b, y],
  hints: ['In y = mx + b the number multiplying x is the slope m, and the number on its own is the starting value b.', `Substitute x = ${n(x1)}: y = ${n(m)} × ${n(x1)} + ${n(b)}. Multiply before you add.`],
  solution: `Reading y = ${n(m)}x + ${n(b)}: the slope is m = ${n(m)} L per hour and the starting amount is b = ${n(b)} L. After ${n(x1)} hours, y = ${n(m)} × ${n(x1)} + ${n(b)} = ${n(m * x1)} + ${n(b)} = ${n(y)} L.`,
  guidance: [
   { prompt: `In y = ${n(m)}x + ${n(b)}, what number multiplies x?`, answer: [m], explanation: `The slope is ${n(m)}: the tank changes by ${n(m)} L for each hour.` },
   { prompt: `What is y when x = 0, before any hours have passed?`, answer: [b], explanation: `${n(m)} × 0 + ${n(b)} = ${n(b)}, so the tank starts with ${n(b)} L. That is b.` },
   { prompt: `Put x = ${n(x1)} into the rule: ${n(m)} × ${n(x1)} + ${n(b)}. What is y?`, answer: [y], explanation: `${n(m)} × ${n(x1)} = ${n(m * x1)}, and ${n(m * x1)} + ${n(b)} = ${n(y)} L.` }
  ] }; }
},

/* Line through two points: whole slope m, whole non-zero intercept b (b = 0 would print "y = mx + 0"); neither point has x = 0, which would state b outright. */
q23: {
 canonical: { m: 3, b: -1, x1: 2, run: 4 },
 draw: R => { const x1 = R.except(-3, 3, [0]); return { m: R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), b: R.nz(-8, 8), x1, run: R.except(1, 4, [-x1]) }; },
 build: ({ m, b, x1, run }) => { const x2 = x1 + run, y1 = m * x1 + b, y2 = m * x2 + b, rise = m * run; return {
  prompt: `A straight supply track on the map passes the pump at ${vec([x1, y1])} and the store at ${vec([x2, y2])}. Find its equation in the form y = mx + b. Enter m, then b.`,
  answer: [m, b],
  hints: [`m = rise ÷ run = (${n(y2)} − ${par(y1)}) ÷ (${n(x2)} − ${par(x1)}).`, `Put the pump’s x and y, and your m, into y = mx + b: ${n(y1)} = m × ${par(x1)} + b, then solve for b.`],
  solution: `m = (${n(y2)} − ${par(y1)}) ÷ (${n(x2)} − ${par(x1)}) = ${n(rise)} ÷ ${n(run)} = ${n(m)}. Using the pump ${vec([x1, y1])}: ${n(y1)} = ${n(m)} × ${par(x1)} + b = ${n(m * x1)} + b, so b = ${n(y1)} − ${par(m * x1)} = ${n(b)}. The track is y = ${n(m)}x ${term(b)}. Check with the store: ${n(m)} × ${par(x2)} ${term(b)} = ${n(y2)}.`,
  guidance: [
   { prompt: `Rise ÷ run between the two points: (${n(y2)} − ${par(y1)}) ÷ (${n(x2)} − ${par(x1)}). What is m?`, answer: [m], explanation: `The rise is ${n(rise)} and the run is ${n(run)}, so m = ${n(rise)} ÷ ${n(run)} = ${n(m)}.` },
   { prompt: `${n(y1)} = ${n(m)} × ${par(x1)} + b, which is ${n(y1)} = ${n(m * x1)} + b. What is b?`, answer: [b], explanation: `Subtract ${n(m * x1)} from both sides: b = ${n(y1)} − ${par(m * x1)} = ${n(b)}.` }
  ] }; }
},

/* 3D coordinates: start s (z at least 1), two signed displacements that never take the drone below the ground. */
q24: {
 canonical: { s: [2, -1, 3], d1: [-5, 4, 2], d2: [1, -6, -4] },
 draw: R => { const s = [R.int(-5, 5), R.int(-5, 5), R.int(1, 6)], d1 = [R.nz(-6, 6), R.nz(-6, 6), 0], d2 = [R.nz(-6, 6), R.nz(-6, 6), 0];
  d1[2] = R.int(-s[2], 6); d2[2] = R.int(-(s[2] + d1[2]), 6); return { s, d1, d2 }; },
 build: ({ s, d1, d2 }) => { const f = s.map((v, i) => v + d1[i] + d2[i]), sum = i => `${n(s[i])} + ${par(d1[i])} + ${par(d2[i])}`; return {
  prompt: `A survey drone leaves its pad at ${vec(s)}, in grid units of 100 m east, north and up from the depot. It flies the displacement ${vec(d1)} and then ${vec(d2)}. Enter its final x, y and z.`,
  answer: f,
  hints: ['Add matching positions only: x with x, y with y, z with z.', `For x: ${sum(0)}.`],
  solution: `x: ${sum(0)} = ${n(f[0])}. y: ${sum(1)} = ${n(f[1])}. z: ${sum(2)} = ${n(f[2])}. The drone ends at ${vec(f)}.`,
  guidance: [
   { prompt: `Final x: start ${n(s[0])}, then ${n(d1[0])}, then ${n(d2[0])}. What is ${sum(0)}?`, answer: [f[0]], explanation: `${sum(0)} = ${n(f[0])}.` },
   { prompt: `Final y: what is ${sum(1)}?`, answer: [f[1]], explanation: `${sum(1)} = ${n(f[1])}.` },
   { prompt: `Final z: what is ${sum(2)}?`, answer: [f[2]], explanation: `${sum(2)} = ${n(f[2])}, so the drone ends at ${vec(f)}.` }
  ] }; }
}
});
})();
