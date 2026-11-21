/* Foundations mission generators, file c: chapters 5 and 6 (q25–q35). Shape and helpers: docs/PACK-FORMAT.md
   ("Generator") and game/gen-core.js. build(canonical) reproduces the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* Coefficient in front of a letter: cf(1) → "", cf(4) → "4". */
const cf = k => k === 1 ? '' : n(k);
/* Superscript digits for exponents: sup(12) → "¹²". */
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
/* Pairs of whole numbers that multiply to c, as "1 and 20, 2 and 10, 4 and 5". */
const pairs = c => { const out = []; for (let u = 1; u * u <= c; u++) if (c % u === 0) out.push(`${n(u)} and ${n(c / u)}`); return out.join(', '); };
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Two filling tanks y = m1·x + b1 and y = m2·x + b2 that meet at a whole hour x0. The rates differ by at least 2:
    with a difference of 1 the last step would read "x = answer" in hint 2 and in the first guided prompt. */
 q25: {
  canonical: { b1: 20, m1: 6, b2: 40, m2: 2 },
  draw: R => { const x0 = R.int(2, 8), m1 = R.int(4, 9), m2 = R.int(1, m1 - 2), b1 = 5 * R.int(2, 8); return { b1, m1, b2: b1 + (m1 - m2) * x0, m2 }; },
  build: ({ b1, m1, b2, m2 }) => { const d = m1 - m2, B = b2 - b1, x = B / d, y = m1 * x + b1; return {
   prompt: `Two water tanks are being filled. Tank A holds ${n(b1)} L and gains ${n(m1)} L each hour, so after x hours it holds y = ${cf(m1)}x + ${n(b1)} litres. Tank B holds ${n(b2)} L and gains ${n(m2)} L each hour, so y = ${cf(m2)}x + ${n(b2)}. On a graph the two lines cross where both tanks hold the same amount. Enter x, the hour when they match, then y, the litres each tank holds then.`,
   answer: [x, y],
   hints: [`At the crossing both rules give the same y, so set them equal: ${cf(m1)}x + ${n(b1)} = ${cf(m2)}x + ${n(b2)}.`, `Take ${cf(m2)}x and ${n(b1)} from both sides: ${cf(d)}x = ${n(B)}.`],
   solution: `${cf(m1)}x + ${n(b1)} = ${cf(m2)}x + ${n(b2)}. Take ${cf(m2)}x from both sides: ${cf(d)}x + ${n(b1)} = ${n(b2)}. Take ${n(b1)} from both sides: ${cf(d)}x = ${n(B)}, so x = ${n(B)} ÷ ${n(d)} = ${n(x)} hours. Then y = ${n(m1)} × ${n(x)} + ${n(b1)} = ${n(y)} L. Check with tank B: ${n(m2)} × ${n(x)} + ${n(b2)} = ${n(y)} L.`,
   guidance: [
    { prompt: `At the crossing both tanks hold the same amount, so ${cf(m1)}x + ${n(b1)} = ${cf(m2)}x + ${n(b2)}. Taking ${cf(m2)}x and ${n(b1)} from both sides leaves ${cf(d)}x = ${n(B)}. What is x?`, answer: [x], explanation: `x = ${n(B)} ÷ ${n(d)} = ${n(x)}. After ${n(x)} hours both tanks hold the same amount.` },
    { prompt: `Put x = ${n(x)} into tank A’s rule, y = ${cf(m1)}x + ${n(b1)}. What is y?`, answer: [y], explanation: `y = ${n(m1)} × ${n(x)} + ${n(b1)} = ${n(y)} L. Tank B gives the same: ${n(m2)} × ${n(x)} + ${n(b2)} = ${n(y)} L.` }
   ] }; }
 },
 /* y = x + d substituted into p·x + q·y = W. */
 q26: {
  canonical: { x: 7, d: 3, p: 4, q: 3 },
  draw: R => ({ x: R.int(2, 12), d: R.int(1, 8), p: R.int(2, 6), q: R.int(2, 6) }),
  build: ({ x, d, p, q }) => { const y = x + d, W = p * x + q * y, s = p + q, k = q * d; return {
   prompt: `Mira loads grain sacks of ${n(p)} kg and bean sacks of ${n(q)} kg onto one cart. ${d === 1 ? 'There is 1 more bean sack' : `There are ${n(d)} more bean sacks`} than grain sacks, so y = x + ${n(d)}, where x is the number of grain sacks and y the number of bean sacks. The load weighs ${n(W)} kg, so ${n(p)}x + ${n(q)}y = ${n(W)}. Enter x, then y.`,
   answer: [x, y],
   hints: [`Replace y in the weight equation with x + ${n(d)}: ${n(p)}x + ${n(q)}(x + ${n(d)}) = ${n(W)}.`, `Multiply out and combine like terms: ${n(s)}x + ${n(k)} = ${n(W)}.`],
   solution: `Substitute y = x + ${n(d)}: ${n(p)}x + ${n(q)}(x + ${n(d)}) = ${n(W)}. Multiply out: ${n(p)}x + ${n(q)}x + ${n(k)} = ${n(W)}, so ${n(s)}x + ${n(k)} = ${n(W)}. Take ${n(k)} from both sides: ${n(s)}x = ${n(W - k)}, so x = ${n(W - k)} ÷ ${n(s)} = ${n(x)}. Then y = ${n(x)} + ${n(d)} = ${n(y)}. Check: ${n(p)} × ${n(x)} + ${n(q)} × ${n(y)} = ${n(p * x)} + ${n(q * y)} = ${n(W)} kg.`,
   guidance: [
    { prompt: `Put x + ${n(d)} in place of y: ${n(p)}x + ${n(q)}(x + ${n(d)}) = ${n(W)}, which multiplies out to ${n(s)}x + ${n(k)} = ${n(W)}. What is x?`, answer: [x], explanation: `${n(s)}x = ${n(W)} − ${n(k)} = ${n(W - k)}, so x = ${n(W - k)} ÷ ${n(s)} = ${n(x)} grain sacks.` },
    { prompt: `y = x + ${n(d)} and x = ${n(x)}. What is y?`, answer: [y], explanation: `y = ${n(x)} + ${n(d)} = ${n(y)} bean sacks. Check: ${n(p * x)} kg + ${n(q * y)} kg = ${n(W)} kg.` }
   ] }; }
 },
 /* a1·x + b·y = c1 and a2·x + b·y = c2 with the same b: subtracting removes y. */
 q27: {
  canonical: { a1: 3, a2: 5, b: 2, x: 5, y: 4 },
  draw: R => { const a1 = R.int(1, 4); return { a1, a2: a1 + R.int(1, 3), b: R.int(1, 4), x: R.int(2, 9), y: R.int(2, 9) }; },
  build: ({ a1, a2, b, x, y }) => { const c1 = a1 * x + b * y, c2 = a2 * x + b * y, k = a2 - a1, D = c2 - c1, r = c1 - a1 * x;
   const packs = (m, word) => `${n(m)} ${word} pack${m === 1 ? '' : 's'}`;
   const yStep = b === 1 ? `so y = ${n(r)}` : `so ${n(b)}y = ${n(r)} and y = ${n(y)}`;
   const xStep = k === 1 ? `so x = ${n(D)}` : `so ${n(k)}x = ${n(D)} and x = ${n(x)}`;
   return {
   prompt: `Two deliveries of the same two parts were weighed. Delivery 1: ${packs(a1, 'filter')} and ${packs(b, 'valve')} weigh ${n(c1)} kg, so ${cf(a1)}x + ${cf(b)}y = ${n(c1)}. Delivery 2: ${packs(a2, 'filter')} and ${packs(b, 'valve')} weigh ${n(c2)} kg, so ${cf(a2)}x + ${cf(b)}y = ${n(c2)}. Here x is the weight of one filter pack and y of one valve pack, in kg. Enter x, then y.`,
   answer: [x, y],
   hints: [`Both deliveries have ${packs(b, 'valve')}, so taking delivery 1 away from delivery 2 makes y disappear.`, `What is left is ${cf(k)}x = ${n(c2)} − ${n(c1)}.`],
   solution: `Take the first equation away from the second, side by side: (${cf(a2)}x + ${cf(b)}y) − (${cf(a1)}x + ${cf(b)}y) = ${n(c2)} − ${n(c1)}, ${xStep} kg. Put x = ${n(x)} into the first equation: ${n(a1)} × ${n(x)} + ${cf(b)}y = ${n(c1)}, ${yStep} kg.`,
   guidance: [
    { prompt: `Take delivery 1 away from delivery 2: left side from left side, right side from right side. The y terms cancel. What is x?`, answer: [x], explanation: `${cf(k)}x = ${n(c2)} − ${n(c1)} = ${n(D)}${k === 1 ? '' : `, so x = ${n(x)}`} kg. The extra ${packs(k, 'filter')} weigh${k === 1 ? 's' : ''} the extra ${n(D)} kg.` },
    { prompt: `Put x = ${n(x)} into ${cf(a1)}x + ${cf(b)}y = ${n(c1)}. What is y?`, answer: [y], explanation: `${n(a1)} × ${n(x)} = ${n(a1 * x)}, so ${cf(b)}y = ${n(c1)} − ${n(a1 * x)} = ${n(r)}${b === 1 ? '' : `, and y = ${n(y)}`} kg.` }
   ] }; }
 },
 /* x + y + z = a, p·x + y + z = b, x + y + r·z = c: two subtractions give x and z, then y. */
 q28: {
  canonical: { x: 4, y: 9, z: 5, p: 3, r: 2 },
  draw: R => ({ x: R.int(1, 9), y: R.int(1, 9), z: R.int(1, 9), p: R.int(2, 4), r: R.int(2, 4) }),
  build: ({ x, y, z, p, r }) => { const a = x + y + z, b = p * x + y + z, c = x + y + r * z;
   /* One unknown left after a subtraction: "2x = 8, so x = 4", or just "x = 4" when its coefficient is 1. */
   const sol = (k, v, top, val) => k === 1 ? `${v} = ${n(top)} − ${n(a)} = ${n(val)}.` : `${n(k)}${v} = ${n(top)} − ${n(a)} = ${n(top - a)}, so ${v} = ${n(val)}.`;
   const why = (k, v, val) => k === 1 ? `${v} = ${n(val)} kg.` : `${n(k)}${v} = ${n(k * val)}, so ${v} = ${n(val)} kg.`;
   return {
   prompt: `Three kinds of crate: ration boxes (x kg each), fuel cans (y kg each) and tool kits (z kg each). Load 1 is one of each and weighs ${n(a)} kg, so x + y + z = ${n(a)}. Load 2 is ${n(p)} ration boxes, one fuel can and one tool kit, ${n(b)} kg, so ${n(p)}x + y + z = ${n(b)}. Load 3 is one ration box, one fuel can and ${n(r)} tool kits, ${n(c)} kg, so x + y + ${n(r)}z = ${n(c)}. Enter x, y and z.`,
   answer: [x, y, z],
   hints: [`Take load 1 away from load 2: y and z cancel, leaving ${p === 2 ? `x = ${n(b)} − ${n(a)}` : `${cf(p - 1)}x = ${n(b - a)}`}.`, `Take load 1 away from load 3 to find z, then use load 1 to find y.`],
   solution: `Load 2 − load 1: ${sol(p - 1, 'x', b, x)} Load 3 − load 1: ${sol(r - 1, 'z', c, z)} Load 1: ${n(x)} + y + ${n(z)} = ${n(a)}, so y = ${n(a)} − ${n(x)} − ${n(z)} = ${n(y)}. A ration box weighs ${n(x)} kg, a fuel can ${n(y)} kg and a tool kit ${n(z)} kg.`,
   guidance: [
    { prompt: `Take load 1 (x + y + z = ${n(a)}) away from load 2 (${n(p)}x + y + z = ${n(b)}). What is x?`, answer: [x], explanation: `y and z cancel: ${why(p - 1, 'x', x)}` },
    { prompt: `Take load 1 away from load 3 (x + y + ${n(r)}z = ${n(c)}). What is z?`, answer: [z], explanation: `x and y cancel: ${why(r - 1, 'z', z)}` },
    { prompt: `Put x = ${n(x)} and z = ${n(z)} into load 1, x + y + z = ${n(a)}. What is y?`, answer: [y], explanation: `y = ${n(a)} − ${n(x)} − ${n(z)} = ${n(y)} kg.` }
   ] }; }
 },
 /* A 2 by 3 grid of crate counts: a row sum, a column sum and the grand total. */
 q29: {
  canonical: { g: [[12, 7, 9], [5, 11, 8]] },
  draw: R => ({ g: [[R.int(2, 15), R.int(2, 15), R.int(2, 15)], [R.int(2, 15), R.int(2, 15), R.int(2, 15)]] }),
  build: ({ g }) => { const sum = list => list.reduce((s, v) => s + v, 0), r1 = sum(g[0]), r2 = sum(g[1]), c = [0, 1, 2].map(j => g[0][j] + g[1][j]), T = r1 + r2;
   const row = i => g[i].map(n).join(', '), add = i => g[i].map(n).join(' + '); return {
   prompt: `Crates sent out by two depots over three days, as a grid with 2 rows and 3 columns. Row 1, North depot: ${row(0)}. Row 2, South depot: ${row(1)}. Columns 1, 2 and 3 are days 1, 2 and 3, and a(i, j) is the number in row i, column j. Enter Σ a(2, j) for j = 1 to 3 (the row 2 sum), then Σ a(i, 3) for i = 1 to 2 (the column 3 sum), then the grand total of all six numbers.`,
   answer: [r2, c[2], T],
   hints: [`Σ a(2, j) for j = 1 to 3 is a(2, 1) + a(2, 2) + a(2, 3) = ${add(1)}.`, `Σ a(i, 3) for i = 1 to 2 is a(1, 3) + a(2, 3) = ${n(g[0][2])} + ${n(g[1][2])}. The grand total is the row 1 sum plus the row 2 sum.`],
   solution: `Row 2: ${add(1)} = ${n(r2)}. Column 3: ${n(g[0][2])} + ${n(g[1][2])} = ${n(c[2])}. Row 1: ${add(0)} = ${n(r1)}, so the grand total is ${n(r1)} + ${n(r2)} = ${n(T)}. Check with the columns: ${c.map(n).join(' + ')} = ${n(T)}.`,
   guidance: [
    { prompt: `What is a(2, 3), the number in row 2, column 3?`, answer: [g[1][2]], explanation: `Row 2 is ${row(1)}; its third number is ${n(g[1][2])}.` },
    { prompt: `Add along row 2 (${add(1)}), then down column 3 (${n(g[0][2])} + ${n(g[1][2])}). Enter both sums.`, answer: [r2, c[2]], explanation: `The row 2 sum is ${n(r2)} and the column 3 sum is ${n(c[2])}.` },
    { prompt: `Row 1 adds to ${n(r1)}. What is the grand total of all six numbers?`, answer: [T], explanation: `${n(r1)} + ${n(r2)} = ${n(T)}. Adding the three column sums gives the same: ${c.map(n).join(' + ')} = ${n(T)}.` }
   ] }; }
 },
 /* 2^m × 2^n pieces of alloy, and a cube tank of side b^p holding (b^p)³. */
 q30: {
  canonical: { m: 4, k: 5, b: 3, p: 2 },
  draw: R => { const b = R.pick([2, 3]); return { m: R.int(2, 5), k: R.int(2, 5), b, p: R.int(2, b === 2 ? 4 : 3) }; },
  build: ({ m, k, b, p }) => { const e = m + k, pieces = Math.pow(2, e), s = Math.pow(b, p), v = 3 * p, bp = `${n(b)}${sup(p)}`; return {
   prompt: `A sheet of alloy is cut in half, then every piece is cut in half again, ${n(m)} times in all: that makes 2${sup(m)} pieces. Then every piece is halved ${n(k)} more times, which multiplies the count by 2${sup(k)}. So there are 2${sup(m)} × 2${sup(k)} pieces. Write this as one power of 2 and enter the exponent, then enter the number of pieces. Next, a cube-shaped tank has sides of ${bp} = ${n(s)} decimetres (a decimetre, dm for short, is a tenth of a metre), so it holds (${bp})³ cubic decimetres. Write this as one power of ${n(b)} and enter the exponent.`,
   answer: [e, pieces, v],
   hints: [`Multiplying powers of the same base adds the exponents: count all the 2s being multiplied together.`, `A power of a power multiplies the exponents: write out (${bp})³ as ${bp} × ${bp} × ${bp} and count the ${n(b)}s.`],
   solution: `2${sup(m)} × 2${sup(k)} is ${n(m)} twos times ${n(k)} twos, ${n(e)} twos in all: 2${sup(e)} = ${n(pieces)} pieces. (${bp})³ = ${bp} × ${bp} × ${bp}, three groups of ${n(p)} ${b === 2 ? 'twos' : 'threes'}, ${n(v)} ${b === 2 ? 'twos' : 'threes'} in all, so it is ${n(b)}${sup(v)}: the exponent is ${n(v)}. The tank holds ${n(s)} × ${n(s)} × ${n(s)} = ${n(s * s * s)} dm³.`,
   guidance: [
    { prompt: `2${sup(m)} × 2${sup(k)} is ${n(m)} twos multiplied by ${n(k)} more twos. How many twos is that in all?`, answer: [e], explanation: `${n(m)} + ${n(k)} = ${n(e)}, so the product is 2${sup(e)}.` },
    { prompt: `Work out 2${sup(e)}: double 1, ${n(e)} times. How many pieces?`, answer: [pieces], explanation: `2${sup(e)} = ${n(pieces)} pieces.` },
    { prompt: `(${bp})³ is ${bp} written three times and multiplied. How many ${n(b)}s are multiplied in all?`, answer: [v], explanation: `Three groups of ${n(p)} make ${n(v)}, so (${bp})³ = ${n(b)}${sup(v)}.` }
   ] }; }
 },
 /* A square plate of area s², and √(k²·m) = k√m where no perfect square above 1 divides m. */
 q31: {
  canonical: { s: 12, k: 6, m: 2 },
  draw: R => ({ s: R.int(4, 15), k: R.int(2, 6), m: R.pick([2, 3, 5, 6, 7]) }),
  build: ({ s, k, m }) => { const A = s * s, K = k * k, N = K * m; return {
   prompt: `A square floor plate has an area of ${n(A)} m². Enter the length of its side in metres. A diagonal brace in the yard measures √${n(N)} m. Simplify √${n(N)} into the form k√m, where k is a whole number and no perfect square other than 1 divides m exactly, and enter k, then m.`,
   answer: [s, k, m],
   hints: [`Which whole number times itself gives ${n(A)}?`, `Try the perfect squares 4, 9, 16, 25, 36, 49 … and find the largest one that divides ${n(N)} exactly.`],
   solution: `${n(s)} × ${n(s)} = ${n(A)}, so the side is √${n(A)} = ${n(s)} m. The largest perfect square that divides ${n(N)} is ${n(K)}, and ${n(N)} = ${n(K)} × ${n(m)}, so √${n(N)} = √${n(K)} × √${n(m)} = ${n(k)}√${n(m)} m.`,
   guidance: [
    { prompt: `The side of a square, times itself, gives the area ${n(A)} m². What is the side?`, answer: [s], explanation: `${n(s)} × ${n(s)} = ${n(A)}, so √${n(A)} = ${n(s)} m.` },
    { prompt: `What is the largest perfect square that divides ${n(N)} exactly?`, answer: [K], explanation: `${n(N)} ÷ ${n(K)} = ${n(m)}, and ${n(K)} = ${n(k)} × ${n(k)}. No larger perfect square divides ${n(N)}.` },
    { prompt: `√${n(N)} = √${n(K)} × √${n(m)}. Enter k, the root of the perfect square, then m, the number left under the root.`, answer: [k, m], explanation: `√${n(K)} = ${n(k)}, so √${n(N)} = ${n(k)}√${n(m)}.` }
   ] }; }
 },
 /* (x + a)(x + b) multiplied out, plus p·x² + q·x + r. */
 q32: {
  canonical: { a: 3, b: 5, p: 2, q: 3, r: 4 },
  draw: R => ({ a: R.int(1, 6), b: R.int(1, 6), p: R.int(1, 3), q: R.int(1, 6), r: R.int(1, 9) }),
  build: ({ a, b, p, q, r }) => { const s = a + b, ab = a * b, B = `${cf(p)}x² + ${cf(q)}x + ${n(r)}`; return {
   prompt: `Two deck panels are being sized, where x stands for a length in metres that is not chosen yet. The first panel is a rectangle x + ${n(a)} m by x + ${n(b)} m, so its area is (x + ${n(a)})(x + ${n(b)}) m². The second panel’s area is ${B} m². Multiply out the first area, add the second, and write the total in the form (number)x² + (number)x + (number). Enter the three numbers in that order.`,
   answer: [1 + p, s + q, ab + r],
   hints: [`Multiply each part of the first bracket by each part of the second: (x + ${n(a)})(x + ${n(b)}) = x² + ${cf(b)}x + ${cf(a)}x + ${n(ab)}.`, `Add like terms: x² terms together, x terms together, plain numbers together.`],
   solution: `(x + ${n(a)})(x + ${n(b)}) = x × x + x × ${n(b)} + ${n(a)} × x + ${n(a)} × ${n(b)} = x² + ${cf(s)}x + ${n(ab)}. Adding ${B} gives ${n(1 + p)}x² + ${n(s + q)}x + ${n(ab + r)} m².`,
   guidance: [
    { prompt: `Multiply out (x + ${n(a)})(x + ${n(b)}): the four pieces are x², ${cf(b)}x, ${cf(a)}x and ${n(a)} × ${n(b)}. Enter the x coefficient and the constant.`, answer: [s, ab], explanation: `${cf(b)}x + ${cf(a)}x = ${cf(s)}x and ${n(a)} × ${n(b)} = ${n(ab)}, so the first area is x² + ${cf(s)}x + ${n(ab)}.` },
    { prompt: `Add x² + ${cf(s)}x + ${n(ab)} and ${B}. Enter the x² coefficient, the x coefficient and the constant.`, answer: [1 + p, s + q, ab + r], explanation: `1 + ${n(p)} = ${n(1 + p)}, ${n(s)} + ${n(q)} = ${n(s + q)} and ${n(ab)} + ${n(r)} = ${n(ab + r)}.` }
   ] }; }
 },
 /* x² + (p + q)x + pq factored into (x + p)(x + q), 2 ≤ p < q. With p = 1 the solution would print "1x", and a prime
    constant would leave hint 2 listing only the answer pair. */
 q33: {
  canonical: { p: 4, q: 5 },
  draw: R => { const p = R.int(2, 7); return { p, q: R.int(p + 1, 9) }; },
  build: ({ p, q }) => { const b = p + q, c = p * q; return {
   prompt: `A rectangular plate has an area of x² + ${n(b)}x + ${n(c)} m², and its sides are x plus one number and x plus another number, in metres. Factor the area into the form (x + number)(x + number) and enter the two numbers, smaller first.`,
   answer: [p, q],
   hints: [`Look for two whole numbers that multiply to ${n(c)} and add to ${n(b)}.`, `The pairs that multiply to ${n(c)} are ${pairs(c)}.`],
   solution: `${n(p)} × ${n(q)} = ${n(c)} and ${n(p)} + ${n(q)} = ${n(b)}, so x² + ${n(b)}x + ${n(c)} = (x + ${n(p)})(x + ${n(q)}). Check: (x + ${n(p)})(x + ${n(q)}) = x² + ${n(q)}x + ${n(p)}x + ${n(c)} = x² + ${n(b)}x + ${n(c)}.`,
   guidance: [
    { prompt: `The two numbers must add to the x coefficient and multiply to the constant. Enter that sum, then that product.`, answer: [b, c], explanation: `In x² + ${n(b)}x + ${n(c)} the x coefficient is ${n(b)} and the constant is ${n(c)}.` },
    { prompt: `The pairs that multiply to ${n(c)} are ${pairs(c)}. Which pair adds to ${n(b)}? Enter it, smaller first.`, answer: [p, q], explanation: `${n(p)} + ${n(q)} = ${n(b)}, so the area is (x + ${n(p)})(x + ${n(q)}).` }
   ] }; }
 },
 /* y = (x − r)(x − s) with s = r + d, d even, so the vertex has whole coordinates. */
 q34: {
  canonical: { r: 2, d: 4 },
  draw: R => ({ r: R.int(1, 6), d: R.pick([2, 4, 6, 8]) }),
  build: ({ r, d }) => { const s = r + d, b = r + s, c = r * s, h = b / 2, k = h * h - b * h + c, depth = -k; return {
   prompt: `The bottom of a drainage trough in the yard follows the curve y = x² − ${n(b)}x + ${n(c)}, where x is the distance along the floor and y the height above floor level, both in decimetres (dm, tenths of a metre). Floor level is y = 0. Enter the two x values where the curve meets floor level, smaller first, then the x and the y of its lowest point, the vertex.`,
   answer: [r, s, h, k],
   hints: [`Set y = 0 and factor: find two numbers that multiply to ${n(c)} and add to −${n(b)}.`, `The vertex is halfway between the two roots. Put its x into the rule to get its y.`],
   solution: `x² − ${n(b)}x + ${n(c)} = (x − ${n(r)})(x − ${n(s)}), because (−${n(r)}) × (−${n(s)}) = ${n(c)} and (−${n(r)}) + (−${n(s)}) = −${n(b)}. A product is 0 only when one factor is 0, so y = 0 at x = ${n(r)} and at x = ${n(s)}. The vertex is halfway: x = (${n(r)} + ${n(s)}) ÷ 2 = ${n(h)}. There y = ${n(h)}² − ${n(b)} × ${n(h)} + ${n(c)} = ${n(h * h)} − ${n(b * h)} + ${n(c)} = ${n(k)}, so the lowest point is ${n(depth)} dm below floor level.`,
   guidance: [
    { prompt: `x² − ${n(b)}x + ${n(c)} = (x − ${n(r)})(x − ${n(s)}). At which two x values is this 0? Enter the smaller first.`, answer: [r, s], explanation: `x − ${n(r)} is 0 at x = ${n(r)} and x − ${n(s)} is 0 at x = ${n(s)}. These are the roots.` },
    { prompt: `The vertex sits halfway between x = ${n(r)} and x = ${n(s)}. What is its x?`, answer: [h], explanation: `(${n(r)} + ${n(s)}) ÷ 2 = ${n(h)}.` },
    { prompt: `Put x = ${n(h)} into y = x² − ${n(b)}x + ${n(c)}. What is y?`, answer: [k], explanation: `${n(h * h)} − ${n(b * h)} + ${n(c)} = ${n(k)}. The trough bottom is ${n(depth)} dm below floor level.` }
   ] }; }
 },
 /* (x² + (a + c)x + ac) ÷ (x + a) = x + c, with x = −a not allowed. */
 q35: {
  canonical: { a: 2, c: 3, x0: 7 },
  draw: R => { const a = R.int(1, 6); return { a, c: R.except(1, 9, [a]), x0: R.int(3, 9) }; },
  build: ({ a, c, x0 }) => { const b = a + c, ac = a * c, top = x0 * x0 + b * x0 + ac, bottom = x0 + a, v = x0 + c, P = `x² + ${n(b)}x + ${n(ac)}`; return {
   prompt: `A plate with an area of ${P} m² is cut into a strip x + ${n(a)} m wide. Its length is the area divided by the width: (${P}) ÷ (x + ${n(a)}). Simplify this to x + (a number) and enter that number. Then enter the length in metres when x = ${n(x0)}, and the one value of x for which you would be dividing by 0.`,
   answer: [c, v, -a],
   hints: [`Factor the top: find two numbers that multiply to ${n(ac)} and add to ${n(b)}. One of them is ${n(a)}, because the width x + ${n(a)} must be one of the brackets.`, `Which x makes the width, x + ${n(a)}, equal to 0? Dividing by 0 has no meaning.`],
   solution: `(${P}) ÷ (x + ${n(a)}) = (x + ${n(a)})(x + ${n(c)}) ÷ (x + ${n(a)}) = x + ${n(c)}, after cancelling the shared factor x + ${n(a)}. At x = ${n(x0)} the length is ${n(x0)} + ${n(c)} = ${n(v)} m. Check: (${n(x0 * x0)} + ${n(b * x0)} + ${n(ac)}) ÷ (${n(x0)} + ${n(a)}) = ${n(top)} ÷ ${n(bottom)} = ${n(v)}. The bottom is 0 when x = −${n(a)}, so x = −${n(a)} is not allowed.`,
   guidance: [
    { prompt: `${P} = (x + ${n(a)})(x + ?). Which number goes in place of the question mark?`, answer: [c], explanation: `${n(a)} × ${n(c)} = ${n(ac)} and ${n(a)} + ${n(c)} = ${n(b)}, so the top is (x + ${n(a)})(x + ${n(c)}) and it simplifies to x + ${n(c)}.` },
    { prompt: `The length is x + ${n(c)}. What is it when x = ${n(x0)}?`, answer: [v], explanation: `${n(x0)} + ${n(c)} = ${n(v)} m, the same as ${n(top)} ÷ ${n(bottom)}.` },
    { prompt: `For which x is the bottom, x + ${n(a)}, equal to 0?`, answer: [-a], explanation: `−${n(a)} + ${n(a)} = 0, so x = −${n(a)} would mean dividing by 0. It is not allowed.` }
   ] }; }
 }
});
})();
