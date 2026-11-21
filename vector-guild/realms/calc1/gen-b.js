/* Calculus 1 mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md ("Generator") and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. The worked sample is q01 in gen-a.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
window.MISSION_GEN = window.MISSION_GEN || {};
/* A polynomial written from [coefficient, letter part] pairs: zero terms dropped, a coefficient 1 not written out
   ("x²", "− t"), signs as " + " / " − ". poly([[2, 'x²'], [−3, 'x'], [5, '']]) → "2x² − 3x + 5". */
const poly = terms => {
 let out = '';
 for (const [c, v] of terms) {
  if (c === 0) continue;
  const mag = Math.abs(c), body = (mag === 1 && v) ? v : n(mag) + v;
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body;
 }
 return out || '0';
};
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUP[Number(d)]).join('');
/* x to the power k as text: "x" for 1, "x²" for 2. */
const pow = (v, k) => k === 1 ? v : v + sup(k);
Object.assign(window.MISSION_GEN, {
 /* q11: left piece (x² − k²) ÷ (x − k) below k, right piece jx² − c from k on (a rising output). The limit from the left is 2k
    and the closing value is c = jk² − 2k, which is positive and not 2k. k = 3 with j = 1 is the worked example. */
 q11: {
  canonical: { k: 5, j: 1 },
  draw: R => { let o; do { o = { k: R.int(2, 9), j: R.int(1, 3) }; } while ((o.k === 3 && o.j === 1) || o.j * o.k * o.k - 2 * o.k <= 0 || o.j * o.k === 4); return o; },
  build: ({ k, j }) => { const kk = k * k, jk = j * kk, sq = poly([[j, 'x²']]), lim = 2 * k, c = jk - lim; return {
   prompt: `A flow controller sets a pump’s output f(x), in litres per minute, from a dial setting x. Below the setting ${n(k)} it uses f(x) = (x² − ${n(kk)}) ÷ (x − ${n(k)}); at ${n(k)} and above it uses f(x) = ${sq} − c, where c is a number still to be stored. Enter the limit of f(x) as x approaches ${n(k)} from the left, then the value of c that makes f continuous at x = ${n(k)}.`,
   answer: [lim, c],
   hints: [`Direct substitution of ${n(k)} into the left piece gives 0 ÷ 0, so factor the top as a difference of two squares and cancel the common factor first.`, `For no jump, the right piece’s value at x = ${n(k)}, which is ${n(jk)} − c, must equal the limit from the left.`],
   solution: `Below ${n(k)}: x² − ${n(kk)} = (x − ${n(k)})(x + ${n(k)}), and for x ≠ ${n(k)} the factor x − ${n(k)} cancels, leaving f(x) = x + ${n(k)}. As x approaches ${n(k)} from the left, x + ${n(k)} approaches ${n(k)} + ${n(k)} = ${n(lim)}. At ${n(k)} itself f(${n(k)}) = ${j === 1 ? n(kk) + ' − c' : n(j) + ' × ' + n(kk) + ' − c = ' + n(jk) + ' − c'}, and the limit from the right is the same number, because ${sq} − c is a polynomial. For f to be continuous at ${n(k)} the two sides must meet: ${n(jk)} − c = ${n(lim)}, so c = ${n(jk)} − ${n(lim)} = ${n(c)}.`,
   guidance: [
    { prompt: `Factor x² − ${n(kk)} as (x − ${n(k)})(x + ${n(k)}) and cancel x − ${n(k)} from the top and the bottom. The left piece is now x + ${n(k)}. What does it approach as x approaches ${n(k)} from the left?`, answer: [lim], explanation: `For every x just below ${n(k)}, f(x) = x + ${n(k)}, and x + ${n(k)} closes in on ${n(k)} + ${n(k)} = ${n(lim)}. The hole at x = ${n(k)} does not matter to a limit.` },
    { prompt: `The right piece at x = ${n(k)} is ${n(jk)} − c. For no jump it must equal ${n(lim)}. What is c?`, answer: [c], explanation: `${n(jk)} − c = ${n(lim)}, so c = ${n(jk)} − ${n(lim)} = ${n(c)}.` },
    { prompt: `Check: with c = ${n(c)}, what is f(${n(k)}) from the right piece?`, answer: [lim], explanation: `f(${n(k)}) = ${n(jk)} − ${n(c)} = ${n(lim)}, the same as the limit from the left, so the pump’s output has no jump at the setting ${n(k)}.` }
   ] }; }
 },
 /* q12: s(t) = at² + bt; difference quotient with h = 0.1 is 2at0 + b + 0.1a, derivative 2at0 + b. */
 q12: {
  canonical: { a: 3, b: 4, t0: 2 },
  draw: R => { let o; do { o = { a: R.int(2, 5), b: R.int(2, 9), t0: R.int(1, 5) }; } while (2 * o.a * o.t0 + o.b > 40); return o; },
  build: ({ a, b, t0 }) => { const t1 = G.tidy(t0 + 0.1), s0 = a * t0 * t0 + b * t0, s1 = G.tidy(a * t1 * t1 + b * t1), ds = G.tidy(s1 - s0), dq = G.tidy(ds / 0.1), d = 2 * a * t0 + b; return {
   prompt: `On the test track a rover’s distance from the start line is s(t) = ${n(a)}t² + ${n(b)}t metres, t seconds after it sets off. Enter the difference quotient (s(${n(t0)} + h) − s(${n(t0)})) ÷ h for the step h = 0.1, then the derivative s′(${n(t0)}), the rover’s speed at the instant t = ${n(t0)}, in metres per second.`,
   answer: [dq, d],
   hints: [`For h = 0.1 you need s(${n(t1)}) and s(${n(t0)}): subtract them and divide by 0.1.`, `For the derivative keep h as a letter: expand s(${n(t0)} + h) − s(${n(t0)}), divide by h, and see what is left when h shrinks to 0.`],
   solution: `s(${n(t0)}) = ${n(a)} × ${n(t0 * t0)} + ${n(b)} × ${n(t0)} = ${n(s0)} and s(${n(t1)}) = ${n(a)} × ${n(G.tidy(t1 * t1))} + ${n(b)} × ${n(t1)} = ${n(s1)}, so the difference quotient is (${n(s1)} − ${n(s0)}) ÷ 0.1 = ${n(ds)} ÷ 0.1 = ${n(dq)}. With h as a letter, s(${n(t0)} + h) − s(${n(t0)}) = ${n(2 * a * t0 + b)}h + ${n(a)}h², and dividing by h gives ${n(d)} + ${n(a)}h. As h approaches 0 the term ${n(a)}h vanishes, so s′(${n(t0)}) = ${n(d)} metres per second.`,
   guidance: [
    { prompt: `Put t = ${n(t0)} and t = ${n(t1)} into s(t) = ${n(a)}t² + ${n(b)}t. What are s(${n(t0)}) and s(${n(t1)})?`, answer: [s0, s1], explanation: `s(${n(t0)}) = ${n(a)} × ${n(t0 * t0)} + ${n(b)} × ${n(t0)} = ${n(s0)} and s(${n(t1)}) = ${n(a)} × ${n(G.tidy(t1 * t1))} + ${n(b)} × ${n(t1)} = ${n(s1)}.` },
    { prompt: `Divide the change in distance by the step. What is (${n(s1)} − ${n(s0)}) ÷ 0.1?`, answer: [dq], explanation: `${n(s1)} − ${n(s0)} = ${n(ds)}, and ${n(ds)} ÷ 0.1 = ${n(dq)}: the average speed over that tenth of a second.` },
    { prompt: `Now keep h as a letter. Expanding s(${n(t0)} + h) − s(${n(t0)}) gives (number)h + (number)h². Enter the number in front of h, then the number in front of h².`, answer: [d, a], explanation: `${n(a)}(${n(t0)} + h)² + ${n(b)}(${n(t0)} + h) − ${n(s0)} = ${n(a * t0 * t0)} + ${n(2 * a * t0)}h + ${n(a)}h² + ${n(b * t0)} + ${n(b)}h − ${n(s0)} = ${n(d)}h + ${n(a)}h².` },
    { prompt: `Dividing by h leaves ${n(d)} + ${n(a)}h. What does that approach as h shrinks towards 0?`, answer: [d], explanation: `The part ${n(a)}h shrinks to 0 with h, so the difference quotients close in on ${n(d)}. That limit is the derivative: s′(${n(t0)}) = ${n(d)} metres per second.` }
   ] }; }
 },
 /* q13: tangent to f(x) = px² + qx + r at x = a: slope 2pa + q, intercept r − pa². The worked example is x² + 1 at 2. */
 q13: {
  canonical: { p: 2, q: -3, r: 5, a: 3 },
  draw: R => { let o; do { o = { p: R.int(2, 4), q: R.pick([-1, 1]) * R.int(2, 9), r: R.int(1, 12), a: R.int(1, 4) }; } while (2 * o.p * o.a + o.q === 0); return o; },
  build: ({ p, q, r, a }) => { const f = poly([[p, 'x²'], [q, 'x'], [r, '']]), fa = p * a * a + q * a + r, m = 2 * p * a + q, k = fa - m * a; return {
   prompt: `On the test track the centre line of a banked curve follows y = f(x) = ${f}, with x and y in metres. A straight guide rail must just touch the curve at x = ${n(a)}, along the tangent line there. Enter the slope of the tangent line, then its y-intercept, so that the rail is y = (slope)x + (intercept).`,
   answer: [m, k],
   hints: [`The tangent line passes through the point of the curve at x = ${n(a)}, so first work out f(${n(a)}).`, `For px² + qx + r the derivative is f′(x) = 2px + q. Its value at x = ${n(a)} is the slope; then make the line pass through the point to find the intercept.`],
   solution: `The point: f(${n(a)}) = ${n(p)} × ${n(a * a)} + ${par(q)} × ${n(a)} + ${n(r)} = ${n(fa)}, so the rail touches at (${n(a)}, ${n(fa)}). The slope: f′(x) = ${poly([[2 * p, 'x'], [q, '']])}, so f′(${n(a)}) = ${n(2 * p)} × ${n(a)} + ${par(q)} = ${n(m)}. The line y = ${poly([[m, 'x']])} + k passes through the point, so ${n(fa)} = ${n(m)} × ${n(a)} + k and k = ${n(fa)} − ${par(m * a)} = ${n(k)}. The rail is y = ${poly([[m, 'x'], [k, '']])}.`,
   guidance: [
    { prompt: `Where does the rail touch? Work out f(${n(a)}) for f(x) = ${f}.`, answer: [fa], explanation: `f(${n(a)}) = ${n(p)} × ${n(a * a)} + ${par(q)} × ${n(a)} + ${n(r)} = ${n(fa)}, so the touching point is (${n(a)}, ${n(fa)}).` },
    { prompt: `The slope of the tangent line is f′(${n(a)}), and here f′(x) = ${n(2 * p)}x ${plus(q).replace(/^([+−])/, '$1 ')}. What is f′(${n(a)})?`, answer: [m], explanation: `f′(${n(a)}) = ${n(2 * p)} × ${n(a)} + ${par(q)} = ${n(m)}. The constant ${n(r)} only lifts the curve; it does not change its steepness.` },
    { prompt: `The line y = ${poly([[m, 'x']])} + k must pass through (${n(a)}, ${n(fa)}). What is k?`, answer: [k], explanation: `${n(fa)} = ${n(m)} × ${n(a)} + k, so k = ${n(fa)} − ${par(m * a)} = ${n(k)}. The rail is y = ${poly([[m, 'x'], [k, '']])}.` }
   ] }; }
 },
 /* q14: d(t) = tⁿ; d′(t) = n tⁿ⁻¹, d′(a) = n aⁿ⁻¹, in centimetres per second (at most 6 × 3⁵ = 1458 cm/s, about
    15 m/s; "without commas" is asked only from 1000 on). The worked example is x³ at 4. */
 q14: {
  canonical: { k: 4, a: 2 },
  draw: R => ({ k: R.int(3, 6), a: R.int(2, 3) }),
  build: ({ k, a }) => { const pw = k - 1, ap = Math.pow(a, pw), d = k * ap; return {
   prompt: `A test rover’s data logger fits its distance from the start line as d(t) = ${pow('t', k)} centimetres, t seconds after it sets off. Use the power rule to write d′(t) = (coefficient) × t to a power. Enter the coefficient, then the power, then d′(${n(a)}), the rover’s speed in centimetres per second at t = ${n(a)}${d >= 1000 ? ' (type it without commas)' : ''}.`,
   answer: [k, pw, d],
   hints: ['The power rule: bring the exponent down in front as the coefficient, then lower the exponent by one.', `Once you have d′(t), put t = ${n(a)} into it: work out the power of ${n(a)} first, then multiply.`],
   solution: `By the power rule the derivative of ${pow('t', k)} is ${n(k)}${pow('t', pw)}: the exponent ${n(k)} comes down as the coefficient and the new power is ${n(k)} − 1 = ${n(pw)}. At t = ${n(a)}: d′(${n(a)}) = ${n(k)} × ${n(a)}${sup(pw)} = ${n(k)} × ${n(ap)} = ${n(d)} centimetres per second.`,
   guidance: [
    { prompt: `In d(t) = ${pow('t', k)} the exponent is ${n(k)}. The power rule brings the exponent down in front. What is the coefficient of d′(t)?`, answer: [k], explanation: `The exponent ${n(k)} becomes the coefficient.` },
    { prompt: `The power rule then lowers the exponent by one. What is the new power?`, answer: [pw], explanation: `${n(k)} − 1 = ${n(pw)}, so d′(t) = ${n(k)}${pow('t', pw)}.` },
    { prompt: `Put t = ${n(a)} into d′(t) = ${n(k)}${pow('t', pw)}. What is d′(${n(a)})?`, answer: [d], explanation: `${n(a)}${sup(pw)} = ${n(ap)}, and ${n(k)} × ${n(ap)} = ${n(d)}. At t = ${n(a)} the distance is growing at ${n(d)} centimetres per second.` }
   ] }; }
 },
 /* q15: T(t) = at³ + bt² + ct + d; T′(t) = 3at² + 2bt + c, at most 60 degrees per minute in size. */
 q15: {
  canonical: { a: 2, b: -5, c: 4, d: 9, t0: 3 },
  draw: R => { let o; do { o = { a: R.int(2, 4), b: R.pick([-1, 1]) * R.int(2, 6), c: R.pick([-1, 1]) * R.int(2, 9), d: R.int(2, 20), t0: R.int(2, 4) }; } while ((v => Math.abs(v) === 1 || Math.abs(v) > 60)(3 * o.a * o.t0 * o.t0 + 2 * o.b * o.t0 + o.c)); return o; },
  build: ({ a, b, c, d, t0 }) => { const T = poly([[a, 't³'], [b, 't²'], [c, 't'], [d, '']]), A = 3 * a, B = 2 * b, C = c, v = A * t0 * t0 + B * t0 + C; return {
   prompt: `The test track’s brake-cooling fluid has temperature T(t) = ${T} degrees, t minutes into a test run. Using the constant multiple, sum and difference rules, write T′(t) = At² + Bt + C. Enter A, B and C, then T′(${n(t0)}), the rate at which the temperature is changing at t = ${n(t0)}, in degrees per minute.`,
   answer: [A, B, C, v],
   hints: ['Differentiate one term at a time with the power rule, keeping each term’s number in front as a multiplier. A constant term has derivative 0.', `Put t = ${n(t0)} into your T′(t): square ${n(t0)} for the first term.`],
   solution: `Term by term: ${n(a)}t³ gives ${n(a)} × 3t² = ${n(A)}t², ${n(b)}t² gives ${n(b)} × 2t = ${n(B)}t, ${n(c)}t gives ${n(C)}, and the constant ${n(d)} gives 0. So T′(t) = ${poly([[A, 't²'], [B, 't'], [C, '']])}, with A = ${n(A)}, B = ${n(B)} and C = ${n(C)}. At t = ${n(t0)}: T′(${n(t0)}) = ${n(A)} × ${n(t0 * t0)} + ${par(B)} × ${n(t0)} + ${par(C)} = ${n(A * t0 * t0)} + ${par(B * t0)} + ${par(C)} = ${n(v)} degrees per minute.`,
   guidance: [
    { prompt: `The first term is ${n(a)}t³. By the power rule t³ has derivative 3t², and the constant multiple rule keeps the ${n(a)}. What is A?`, answer: [A], explanation: `${n(a)} × 3t² = ${n(A)}t², so A = ${n(A)}.` },
    { prompt: `Do the same for ${n(b)}t² and ${n(c)}t, and remember that the constant ${n(d)} does not change. Enter B, then C.`, answer: [B, C], explanation: `${n(b)} × 2t = ${n(B)}t, so B = ${n(B)}; ${n(c)}t has derivative ${n(C)}, so C = ${n(C)}. The constant ${n(d)} has derivative 0.` },
    { prompt: `T′(t) = ${poly([[A, 't²'], [B, 't'], [C, '']])}. What is T′(${n(t0)})?`, answer: [v], explanation: `${n(A)} × ${n(t0 * t0)} + ${par(B)} × ${n(t0)} + ${par(C)} = ${n(v)}, so at t = ${n(t0)} the temperature changes by ${n(v)} degrees per minute.` }
   ] }; }
 },
 /* q16: s(t) = pt³ − 3pm·t² + ct; v(t) = 3pt² − 6pmt + c, a(t) = 6pt − 6pm, zero at t = m (2 to 4, so never "1 seconds").
    c < 3pm², so the velocity changes sign twice and the rover really does run back and forth; |v(t0)| is at most 40 m/s. */
 q16: {
  canonical: { p: 2, m: 2, c: 20, t0: 4 },
  draw: R => { let o; do { const p = R.int(1, 3), m = R.int(2, 4); o = { p, m, c: R.int(2, Math.min(30, 3 * p * m * m - 1)), t0: R.except(1, 6, [m]) }; } while ((v => Math.abs(v) === 1 || Math.abs(v) > 40)(3 * o.p * o.t0 * o.t0 - 6 * o.p * o.m * o.t0 + o.c)); return o; },
  build: ({ p, m, c, t0 }) => { const b = 3 * p * m, s = poly([[p, 't³'], [-b, 't²'], [c, 't']]), A = 3 * p, B = -2 * b, v = A * t0 * t0 + B * t0 + c, D = 6 * p, E = -2 * b, acc = D * t0 + E; return {
   prompt: `A test rover runs back and forth on a straight track. Its position, measured from the start line, is s(t) = ${s} metres, t seconds after the start. Enter its velocity at t = ${n(t0)} in metres per second, its acceleration at t = ${n(t0)} in metres per second per second, then the time in seconds at which its acceleration is zero.`,
   answer: [v, acc, m],
   hints: ['The velocity is v(t) = s′(t): differentiate the position term by term. The acceleration is the derivative of the velocity, s″(t).', 'The acceleration comes out as a number times t plus a constant. Set it equal to 0 and solve for t.'],
   solution: `Velocity: v(t) = s′(t) = ${poly([[A, 't²'], [B, 't'], [c, '']])}, so v(${n(t0)}) = ${n(A)} × ${n(t0 * t0)} + ${par(B)} × ${n(t0)} + ${n(c)} = ${n(v)} metres per second. Acceleration: a(t) = v′(t) = s″(t) = ${poly([[D, 't'], [E, '']])}, so a(${n(t0)}) = ${n(D)} × ${n(t0)} + ${par(E)} = ${n(acc)} metres per second per second. The acceleration is zero when ${n(D)}t = ${n(-E)}, that is at t = ${n(-E)} ÷ ${n(D)} = ${n(m)} seconds.`,
   guidance: [
    { prompt: `Differentiate s(t) = ${s} term by term to get the velocity v(t) = At² + Bt + C. Enter A, B and C.`, answer: [A, B, c], explanation: `${poly([[p, 't³']])} gives ${n(A)}t², ${n(-b)}t² gives ${n(B)}t and ${n(c)}t gives ${n(c)}: v(t) = ${poly([[A, 't²'], [B, 't'], [c, '']])}.` },
    { prompt: `What is the velocity v(${n(t0)})?`, answer: [v], explanation: `${n(A)} × ${n(t0 * t0)} + ${par(B)} × ${n(t0)} + ${n(c)} = ${n(v)} metres per second.${v < 0 ? ' The minus sign means the rover is moving back towards the start line.' : ''}` },
    { prompt: `Differentiate v(t) once more to get the acceleration a(t) = Dt + E. Enter D, then E.`, answer: [D, E], explanation: `${n(A)}t² gives ${n(D)}t, ${n(B)}t gives ${n(E)}, and the constant ${n(c)} gives 0: a(t) = ${poly([[D, 't'], [E, '']])}.` },
    { prompt: `Enter a(${n(t0)}), then the time at which a(t) = 0.`, answer: [acc, m], explanation: `a(${n(t0)}) = ${n(D)} × ${n(t0)} + ${par(E)} = ${n(acc)}. And ${n(D)}t + ${par(E)} = 0 when t = ${n(-E)} ÷ ${n(D)} = ${n(m)}.` }
   ] }; }
 },
 /* q17: s(t) = pt³ + qt² + rt + d at t0: s′(t0), s″(t0) and the tangent's intercept s(t0) − s′(t0)·t0. */
 q17: {
  canonical: { p: 2, q: -9, r: 12, d: 4, t0: 3 },
  draw: R => { let o; do { o = { p: R.int(1, 3), q: R.pick([-1, 1]) * R.int(2, 9), r: R.pick([-1, 1]) * R.int(2, 15), d: R.int(0, 10), t0: R.int(1, 4) }; } while ((v => Math.abs(v) <= 1 || Math.abs(v) > 40)(3 * o.p * o.t0 * o.t0 + 2 * o.q * o.t0 + o.r)); return o; },
  build: ({ p, q, r, d, t0 }) => { const s = poly([[p, 't³'], [q, 't²'], [r, 't'], [d, '']]), st = p * t0 ** 3 + q * t0 * t0 + r * t0 + d, d1 = 3 * p * t0 * t0 + 2 * q * t0 + r, d2 = 6 * p * t0 + 2 * q, k = st - d1 * t0; return {
   prompt: `A rover’s position along the test track is modelled by s(t) = ${s} metres, t seconds after the start. At t = ${n(t0)}, enter the rate of change s′(${n(t0)}) in metres per second, then the second derivative s″(${n(t0)}), then the intercept k of the tangent line y = s′(${n(t0)})t + k that the track crew use as a straight-line forecast.`,
   answer: [d1, d2, k],
   hints: [`Write s′(t) term by term with the power rule, then differentiate s′(t) again for s″(t). Put t = ${n(t0)} into each.`, `The tangent line touches the curve at (${n(t0)}, s(${n(t0)})). Work out s(${n(t0)}) and choose k so that the line passes through that point.`],
   solution: `s′(t) = ${poly([[3 * p, 't²'], [2 * q, 't'], [r, '']])}, so s′(${n(t0)}) = ${n(3 * p)} × ${n(t0 * t0)} + ${par(2 * q)} × ${n(t0)} + ${par(r)} = ${n(d1)} metres per second. s″(t) = ${poly([[6 * p, 't'], [2 * q, '']])}, so s″(${n(t0)}) = ${n(6 * p)} × ${n(t0)} + ${par(2 * q)} = ${n(d2)}. The touching point: s(${n(t0)}) = ${n(st)}. The line y = ${poly([[d1, 't']])} + k passes through (${n(t0)}, ${n(st)}), so k = ${n(st)} − ${par(d1)} × ${n(t0)} = ${n(k)}, and the forecast is y = ${poly([[d1, 't'], [k, '']])}.`,
   guidance: [
    { prompt: `Where is the rover at t = ${n(t0)}? Work out s(${n(t0)}).`, answer: [st], explanation: `s(${n(t0)}) = ${n(p)} × ${n(t0 ** 3)} + ${par(q)} × ${n(t0 * t0)} + ${par(r)} × ${n(t0)} + ${n(d)} = ${n(st)}.` },
    { prompt: `Differentiate term by term: s′(t) = ${poly([[3 * p, 't²'], [2 * q, 't'], [r, '']])}. What is s′(${n(t0)})?`, answer: [d1], explanation: `${n(3 * p)} × ${n(t0 * t0)} + ${par(2 * q)} × ${n(t0)} + ${par(r)} = ${n(d1)}.` },
    { prompt: `Differentiate s′(t) again: s″(t) = ${poly([[6 * p, 't'], [2 * q, '']])}. What is s″(${n(t0)})?`, answer: [d2], explanation: `${n(6 * p)} × ${n(t0)} + ${par(2 * q)} = ${n(d2)}. ${d2 > 0 ? 'It is positive, so the rate of change is itself rising.' : d2 < 0 ? 'It is negative, so the rate of change is itself falling.' : 'It is 0, so at this instant the rate of change is neither rising nor falling.'}` },
    { prompt: `The tangent line y = ${poly([[d1, 't']])} + k passes through (${n(t0)}, ${n(st)}). What is k?`, answer: [k], explanation: `${n(st)} = ${n(d1)} × ${n(t0)} + k, so k = ${n(st)} − ${par(d1 * t0)} = ${n(k)}.` }
   ] }; }
 },
 /* q18: P(x) = (ax + b)(cx² + d); P′ = a(cx² + d) + (ax + b)(2cx). The worked example is (x + 1)(x² + 3) at 1. */
 q18: {
  canonical: { a: 3, b: 2, c: 1, d: 5, x0: 2 },
  draw: R => ({ a: R.int(2, 5), b: R.int(1, 9), c: R.int(1, 3), d: R.int(1, 9), x0: R.int(1, 3) }),
  build: ({ a, b, c, d, x0 }) => { const U = poly([[a, 'x'], [b, '']]), V = poly([[c, 'x²'], [d, '']]), u = a * x0 + b, v = c * x0 * x0 + d, du = a, dv = 2 * c * x0, P = u * v, dP = du * v + u * dv; return {
   prompt: `In the machine shop a motor’s output is modelled as P(x) = (${U})(${V}) watts, where x is the control-dial setting. Enter P(${n(x0)}), then the rate of change P′(${n(x0)}) found with the product rule, in watts per dial step.`,
   answer: [P, dP],
   hints: [`Call the factors u = ${U} and v = ${V}. Work out u, v, u′ and v′ at x = ${n(x0)}.`, 'The product rule: P′ = u′v + uv′. The derivative of a product is not the product of the derivatives.'],
   solution: `At x = ${n(x0)}: u = ${n(a)} × ${n(x0)} + ${n(b)} = ${n(u)} and v = ${c === 1 ? '' : n(c) + ' × '}${n(x0 * x0)} + ${n(d)} = ${n(v)}, so P(${n(x0)}) = ${n(u)} × ${n(v)} = ${n(P)}. The derivatives: u′ = ${n(du)} and v′ = ${n(2 * c)}x, which is ${n(dv)} at x = ${n(x0)}. By the product rule P′(${n(x0)}) = u′v + uv′ = ${n(du)} × ${n(v)} + ${n(u)} × ${n(dv)} = ${n(du * v)} + ${n(u * dv)} = ${n(dP)} watts per dial step.`,
   guidance: [
    { prompt: `The factors are u = ${U} and v = ${V}. What are u and v at x = ${n(x0)}?`, answer: [u, v], explanation: `u = ${n(a)} × ${n(x0)} + ${n(b)} = ${n(u)} and v = ${c === 1 ? '' : n(c) + ' × '}${n(x0 * x0)} + ${n(d)} = ${n(v)}, so P(${n(x0)}) = ${n(u)} × ${n(v)} = ${n(P)}.` },
    { prompt: `Differentiate each factor: what are u′ and v′ at x = ${n(x0)}?`, answer: [du, dv], explanation: `u′ = ${n(a)}, and v′ = ${n(2 * c)}x, which is ${n(dv)} at x = ${n(x0)}.` },
    { prompt: `Combine with the product rule: P′ = u′v + uv′. What is P′(${n(x0)})?`, answer: [dP], explanation: `${n(du)} × ${n(v)} + ${n(u)} × ${n(dv)} = ${n(du * v)} + ${n(u * dv)} = ${n(dP)}.` }
   ] }; }
 },
 /* q19: E(x) = (ax + b) ÷ (x + c) with x0 + c in {2, 5, 10}: E′ = (ac − b) ÷ (x0 + c)², at most two decimals.
    The worked example is x ÷ (x + 1) at 1. */
 q19: {
  canonical: { a: 3, b: 2, c: 3, x0: 2 },
  draw: R => { let o; do { const D = R.pick([2, 5, 10]), x0 = R.int(1, D - 1); o = { a: R.int(2, 6), b: R.int(1, 9), c: D - x0, x0 }; } while (o.a * o.c === o.b); return o; },
  build: ({ a, b, c, x0 }) => { const top = a * x0 + b, bot = x0 + c, E = G.tidy(top / bot), num = a * bot - top, dE = G.tidy(num / (bot * bot)); return {
   prompt: `The machine shop rates a cutting tool by the ratio E(x) = (${poly([[a, 'x'], [b, '']])}) ÷ (x + ${n(c)}), where x is the feed speed. Enter E(${n(x0)}), then the rate of change E′(${n(x0)}) found with the quotient rule. Both are exact decimals.`,
   answer: [E, dE],
   hints: [`Call the top f = ${poly([[a, 'x'], [b, '']])} and the bottom g = x + ${n(c)}. Work out f, g, f′ and g′ at x = ${n(x0)}.`, 'The quotient rule: E′ = (f′g − fg′) ÷ g². Keep the order on top: the bottom times the derivative of the top comes first.'],
   solution: `At x = ${n(x0)}: f = ${n(top)} and g = ${n(bot)}, so E(${n(x0)}) = ${n(top)} ÷ ${n(bot)} = ${n(E)}. The derivatives are f′ = ${n(a)} and g′ = 1. By the quotient rule E′(${n(x0)}) = (${n(a)} × ${n(bot)} − ${n(top)} × 1) ÷ ${n(bot)}² = ${n(num)} ÷ ${n(bot * bot)} = ${n(dE)}.`,
   guidance: [
    { prompt: `What are the top f = ${poly([[a, 'x'], [b, '']])} and the bottom g = x + ${n(c)} at x = ${n(x0)}?`, answer: [top, bot], explanation: `f = ${n(a)} × ${n(x0)} + ${n(b)} = ${n(top)} and g = ${n(x0)} + ${n(c)} = ${n(bot)}, so E(${n(x0)}) = ${n(top)} ÷ ${n(bot)} = ${n(E)}.` },
    { prompt: 'What are the derivatives f′ and g′?', answer: [a, 1], explanation: `f′ = ${n(a)}, the slope of ${poly([[a, 'x'], [b, '']])}, and g′ = 1, the slope of x + ${n(c)}.` },
    { prompt: `Work out the top of the quotient rule, f′g − fg′, at x = ${n(x0)}.`, answer: [num], explanation: `${n(a)} × ${n(bot)} − ${n(top)} × 1 = ${n(a * bot)} − ${n(top)} = ${n(num)}.` },
    { prompt: `Divide by g² = ${n(bot)}². What is E′(${n(x0)})?`, answer: [dE], explanation: `${n(num)} ÷ ${n(bot * bot)} = ${n(dE)}.` }
   ] }; }
 },
 /* q20: F(x) = (ax + b)^k; F′ = k(ax + b)^(k − 1) × a. Inner value u = ax0 + b ≥ 2, and b ≠ 0.
    The worked example is (2x + 1)² at 3. */
 q20: {
  canonical: { a: 3, b: -4, k: 3, x0: 2 },
  draw: R => { let o; do { const k = R.int(2, 4), a = R.int(2, 5), x0 = R.int(1, 3), u = R.int(2, k === 4 ? 3 : 5); o = { a, b: u - a * x0, k, x0 }; } while (o.b === 0); return o; },
  build: ({ a, b, k, x0 }) => { const inner = poly([[a, 'x'], [b, '']]), u = a * x0 + b, outer = k * Math.pow(u, k - 1), d = outer * a; return {
   prompt: `In the machine shop a cooling fan’s air flow is modelled as F(x) = (${inner})${sup(k)} litres per second at dial setting x. Enter the value of the inside part ${inner} at x = ${n(x0)}, then F′(${n(x0)}) found with the chain rule.`,
   answer: [u, d],
   hints: [`The outer function is “something to the power ${n(k)}”, and the inner function is ${inner}. Work out the inner value at x = ${n(x0)} first.`, 'The chain rule: the derivative of the outer function, taken at the inner value, times the derivative of the inner function.'],
   solution: `The inner value at x = ${n(x0)} is u = ${n(a)} × ${n(x0)} ${plus(b).replace(/^([+−])/, '$1 ')} = ${n(u)}. The outer function ${pow('u', k)} has derivative ${n(k)}${pow('u', k - 1)}, which is ${n(k)} × ${n(u)}${k - 1 === 1 ? '' : sup(k - 1)} = ${n(outer)} at u = ${n(u)}. The inner function ${inner} has derivative ${n(a)}. By the chain rule F′(${n(x0)}) = ${n(outer)} × ${n(a)} = ${n(d)} litres per second per dial step.`,
   guidance: [
    { prompt: `What is the inside part ${inner} at x = ${n(x0)}?`, answer: [u], explanation: `${n(a)} × ${n(x0)} ${plus(b).replace(/^([+−])/, '$1 ')} = ${n(u)}.` },
    { prompt: `The outer function ${pow('u', k)} has derivative ${n(k)}${pow('u', k - 1)}. What is it at u = ${n(u)}?`, answer: [outer], explanation: `${n(k)} × ${n(u)}${k - 1 === 1 ? '' : sup(k - 1)} = ${n(outer)}. That is how fast the outer function changes per unit change of its inside.` },
    { prompt: `The inside part changes ${n(a)} times as fast as x. Multiply: what is F′(${n(x0)})?`, answer: [d], explanation: `${n(outer)} × ${n(a)} = ${n(d)}. The outer rate is scaled by the inner rate, like two gears in a row.` }
   ] }; }
 },
});
})();
