/* Calculus 1 mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md ("Generator") and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. The worked sample is q01 in gen-a.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A coefficient in front of a power: co(1, 't²') is "t²", co(3, 't²') is "3t²" (no written-out 1). */
const co = (k, v) => (k === 1 ? '' : n(k)) + v;
/* "0, 2, 4 and 6" */
const list = xs => xs.length < 2 ? xs.map(n).join('') : xs.slice(0, -1).map(n).join(', ') + ' and ' + n(xs[xs.length - 1]);
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 q31: {
  canonical: { L: 60 },
  /* L = 4k metres of edging, so the best depth k, the wall side 2k and the area 2k² are whole numbers; the area
     stays below 1000. Not the worked example's 40 metres. */
  draw: R => ({ L: 4 * R.except(6, 20, [10]) }),
  build: ({ L }) => { const k = L / 4, w = 2 * k, A = k * w; return {
   prompt: `The design studio is laying out a rectangular seedling bed against the straight wall of the greenhouse. The wall side needs no edging, and the other three sides use all ${n(L)} metres of edging. Let x be the depth of the bed: the length of each of the two sides that meet the wall. Enter the depth x that gives the largest area, then the length of the side along the wall, both in metres, then that largest area in square metres.`,
   answer: [k, w, A],
   hints: [`The two depth sides use 2x metres of edging, so the side along the wall is ${n(L)} − 2x metres and the area is A(x) = x(${n(L)} − 2x).`, 'Expand A(x), differentiate it with the power rule, and set A′(x) = 0 to find the critical point.'],
   solution: `The side along the wall is ${n(L)} − 2x metres, so the area is A(x) = x(${n(L)} − 2x) = ${n(L)}x − 2x². Its derivative is A′(x) = ${n(L)} − 4x, which is 0 at x = ${n(L)} ÷ 4 = ${n(k)}. The depth can only run from 0 to ${n(w)} metres, and at both ends the area is 0, so this critical point gives the largest area. The side along the wall is ${n(L)} − 2 × ${n(k)} = ${n(w)} metres and the area is ${n(k)} × ${n(w)} = ${n(A)} square metres.`,
   guidance: [
    { prompt: `Write the area as A(x) = x(${n(L)} − 2x) and multiply out the bracket to get the form bx − cx². What are b and c?`, answer: [L, 2], explanation: `x × ${n(L)} = ${n(L)}x and x × 2x = 2x², so A(x) = ${n(L)}x − 2x²: b = ${n(L)} and c = 2.` },
    { prompt: `Differentiate A(x) = ${n(L)}x − 2x² with the power rule and set A′(x) = 0. At what depth x is the derivative zero?`, answer: [k], explanation: `A′(x) = ${n(L)} − 4x. Setting ${n(L)} − 4x = 0 gives x = ${n(L)} ÷ 4 = ${n(k)} metres.` },
    { prompt: `With a depth of ${n(k)} m, what are the length of the side along the wall and the area of the bed?`, answer: [w, A], explanation: `The side along the wall is ${n(L)} − 2 × ${n(k)} = ${n(w)} metres and the area is ${n(k)} × ${n(w)} = ${n(A)} square metres. At a depth of 0 or of ${n(w)} metres the area would be 0, so this is the largest.` }
   ] }; }
 },
 q32: {
  canonical: { a: 3, b: 5, t1: 1, t2: 4 },
  /* d(t) = at² + bt with a >= 2; the interval is at least 2 minutes long. Not the worked example (2t² + 3t, 1 to 5). */
  draw: R => { let p; do { p = { a: R.int(2, 5), b: R.int(2, 9), t1: R.int(1, 4) }; p.t2 = p.t1 + R.int(2, 4); } while (p.a === 2 && p.b === 3 && p.t1 === 1 && p.t2 === 5); return p; },
  build: ({ a, b, t1, t2 }) => { const d1 = a * t1 * t1 + b * t1, d2 = a * t2 * t2 + b * t2, dd = d2 - d1, dt = t2 - t1, avg = dd / dt, c = (avg - b) / (2 * a); return {
   prompt: `A prototype rover on the studio’s test strip has travelled d(t) = ${n(a)}t² + ${n(b)}t metres after t minutes. Over the interval from t = ${n(t1)} to t = ${n(t2)}, enter its average speed in metres per minute, then the time c inside the interval at which its instantaneous speed equals that average, in minutes.`,
   answer: [avg, c],
   hints: [`The average speed is the change in distance divided by the change in time: (d(${n(t2)}) − d(${n(t1)})) ÷ (${n(t2)} − ${n(t1)}).`, `The instantaneous speed is the derivative, d′(t) = ${n(2 * a)}t + ${n(b)}. Set it equal to the average speed and solve for t.`],
   solution: `d(${n(t1)}) = ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} = ${n(d1)} and d(${n(t2)}) = ${n(a)} × ${n(t2 * t2)} + ${n(b)} × ${n(t2)} = ${n(d2)}, so the average speed is (${n(d2)} − ${n(d1)}) ÷ ${n(dt)} = ${n(dd)} ÷ ${n(dt)} = ${n(avg)} metres per minute. The speed at time t is d′(t) = ${n(2 * a)}t + ${n(b)}. Setting ${n(2 * a)}c + ${n(b)} = ${n(avg)} gives ${n(2 * a)}c = ${n(avg - b)}, so c = ${n(c)} minutes, inside the interval as the Mean Value Theorem promises.`,
   guidance: [
    { prompt: `Put the two times into d(t) = ${n(a)}t² + ${n(b)}t. What are d(${n(t1)}) and d(${n(t2)})?`, answer: [d1, d2], explanation: `d(${n(t1)}) = ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} = ${n(d1)} and d(${n(t2)}) = ${n(a)} × ${n(t2 * t2)} + ${n(b)} × ${n(t2)} = ${n(d2)}.` },
    { prompt: `The rover goes from ${n(d1)} m to ${n(d2)} m between t = ${n(t1)} and t = ${n(t2)}. What is its average speed over the interval?`, answer: [avg], explanation: `(${n(d2)} − ${n(d1)}) ÷ (${n(t2)} − ${n(t1)}) = ${n(dd)} ÷ ${n(dt)} = ${n(avg)} metres per minute. This is the slope of the secant line through the two ends.` },
    { prompt: `The speed at time t is d′(t) = ${n(2 * a)}t + ${n(b)}. At what time c is it equal to ${n(avg)}?`, answer: [c], explanation: `${n(2 * a)}c + ${n(b)} = ${n(avg)} gives ${n(2 * a)}c = ${n(avg - b)}, so c = ${n(avg - b)} ÷ ${n(2 * a)} = ${n(c)} minutes. At that moment the tangent line is parallel to the secant line.` }
   ] }; }
 },
 q33: {
  canonical: { a: 3, b: 2 },
  /* The limit a ÷ b ends in at most two decimals (b is 2, 4 or 5); a and b are at least 2, so no e^(1x) or sin(1x). */
  draw: R => { const b = R.pick([2, 4, 5]); return { a: R.except(2, 9, [b]), b }; },
  build: ({ a, b }) => { const lim = a / b; return {
   prompt: `The studio calibrates a light sensor with the limit of (e^(${n(a)}x) − 1) ÷ sin(${n(b)}x) as x approaches 0, with x in radians. Putting in x = 0 gives 0 ÷ 0, so use L’Hôpital’s rule. Enter the derivative of the top at x = 0, then the derivative of the bottom at x = 0, then the limit.`,
   answer: [a, b, lim],
   hints: [`By the chain rule, the derivative of e^(${n(a)}x) is ${n(a)}e^(${n(a)}x), and the derivative of sin(${n(b)}x) is ${n(b)}cos(${n(b)}x).`, 'At x = 0, e⁰ = 1 and cos 0 = 1. The limit is the derivative of the top divided by the derivative of the bottom.'],
   solution: `At x = 0 the top is e⁰ − 1 = 0 and the bottom is sin 0 = 0, so the limit has the form 0 ÷ 0 and L’Hôpital’s rule applies. The derivative of the top is ${n(a)}e^(${n(a)}x), which is ${n(a)} × 1 = ${n(a)} at x = 0. The derivative of the bottom is ${n(b)}cos(${n(b)}x), which is ${n(b)} × 1 = ${n(b)} at x = 0. The limit is ${n(a)} ÷ ${n(b)} = ${n(lim)}.`,
   guidance: [
    { prompt: `Put x = 0 into the top, e^(${n(a)}x) − 1, and into the bottom, sin(${n(b)}x). What are the two values?`, answer: [0, 0], explanation: 'e⁰ − 1 = 1 − 1 = 0 and sin 0 = 0. The fraction has the form 0 ÷ 0, which on its own says nothing about the limit, so L’Hôpital’s rule applies.' },
    { prompt: 'Differentiate the top and the bottom separately, using the chain rule, then put in x = 0. What are the two values?', answer: [a, b], explanation: `The top’s derivative is ${n(a)}e^(${n(a)}x), which is ${n(a)} at x = 0. The bottom’s derivative is ${n(b)}cos(${n(b)}x), which is ${n(b)} at x = 0.` },
    { prompt: `L’Hôpital’s rule says the limit equals the limit of the derivatives’ fraction. What is ${n(a)} ÷ ${n(b)}?`, answer: [lim], explanation: `${n(a)} ÷ ${n(b)} = ${n(lim)}. Close to 0 the top behaves like ${n(a)}x and the bottom like ${n(b)}x, and their ratio is ${n(lim)}.` }
   ] }; }
 },
 q34: {
  canonical: { x0: 2, N: 5 },
  /* f(x) = x² − N with N = x0² + d, d a small non-zero step. 2x0 is 4, 8, 10 or 20, so x1 has at most three
     decimals; N is never a perfect square. Not the worked example (N = 17 from 4). x₂ shown to four decimals must
     not end in 5 (9.8995 would look as if it rounds up while the true 9.89949… rounds down). */
  draw: R => { const x2of = ({ x0, N }) => { const x1 = x0 - (x0 * x0 - N) / (2 * x0); return x1 - (x1 * x1 - N) / (2 * x1); };
   let p; do { const x0 = R.pick([2, 4, 5, 10]); p = { x0, N: x0 * x0 + R.nz(-3, 3) }; } while (p.N === 1 || (p.x0 === 4 && p.N === 17) || Math.round(x2of(p) * 1e4) % 10 === 5); return p; },
  build: ({ x0, N }) => { const f0 = x0 * x0 - N, d0 = 2 * x0, x1 = x0 - f0 / d0, f1 = x1 * x1 - N, d1 = 2 * x1, x2 = x1 - f1 / d1, x2r = Math.round(x2 * 1000) / 1000; return {
   prompt: `A square solar panel must cover exactly ${n(N)} square metres, so its side is the positive root of f(x) = x² − ${n(N)}. Start Newton’s method from the guess x₀ = ${n(x0)}. Enter the next guess x₁, then the guess after that, x₂, rounded to 3 decimal places.`,
   answer: [x1, x2r],
   hints: ['Newton’s method: x₁ = x₀ − f(x₀) ÷ f′(x₀), and here f′(x) = 2x.', 'Repeat the same step from x₁ to get x₂, then round it to 3 decimal places.'],
   solution: `f′(x) = 2x. From x₀ = ${n(x0)}: f(${n(x0)}) = ${n(x0 * x0)} − ${n(N)} = ${n(f0)} and f′(${n(x0)}) = ${n(d0)}, so x₁ = ${n(x0)} − ${par(f0)} ÷ ${n(d0)} = ${n(x1)}. From x₁: f(${n(x1)}) = ${n(x1 * x1)} − ${n(N)} = ${n(f1)} and f′(${n(x1)}) = ${n(d1)}, so x₂ = ${n(x1)} − ${par(f1)} ÷ ${n(d1)} ≈ ${n(x2)}, which rounds to ${n(x2r)}. Check: ${n(x2r)} × ${n(x2r)} is very close to ${n(N)}.`,
   guidance: [
    { prompt: `For f(x) = x² − ${n(N)} the derivative is f′(x) = 2x. What are f(${n(x0)}) and f′(${n(x0)})?`, answer: [f0, d0], explanation: `f(${n(x0)}) = ${n(x0 * x0)} − ${n(N)} = ${n(f0)} and f′(${n(x0)}) = 2 × ${n(x0)} = ${n(d0)}.` },
    { prompt: 'Follow the tangent line at x₀ down to where it crosses zero: x₁ = x₀ − f(x₀) ÷ f′(x₀). What is x₁?', answer: [x1], explanation: `x₁ = ${n(x0)} − ${par(f0)} ÷ ${n(d0)} = ${n(x1)}.` },
    { prompt: `Take one more step from x₁ = ${n(x1)}. What is x₂ = x₁ − f(x₁) ÷ f′(x₁), rounded to 3 decimal places?`, answer: [x2r], explanation: `f(${n(x1)}) = ${n(x1 * x1)} − ${n(N)} = ${n(f1)} and f′(${n(x1)}) = ${n(d1)}, so x₂ = ${n(x1)} − ${par(f1)} ÷ ${n(d1)} ≈ ${n(x2)}, which rounds to ${n(x2r)}.` }
   ] }; }
 },
 q35: {
  canonical: { a: 2, b: 3, c: 5 },
  /* r(t) = 3at² + 2bt + c with a, b, c >= 2 (no written-out 1). Not the worked example (12x² + 10x + 3). */
  draw: R => { let p; do { p = { a: R.int(2, 6), b: R.int(2, 6), c: R.int(2, 9) }; } while (p.a === 4 && p.b === 5 && p.c === 3); return p; },
  build: ({ a, b, c }) => { const A = 3 * a, B = 2 * b, r = `${n(A)}t² + ${n(B)}t + ${n(c)}`; return {
   prompt: `Water flows into the reservoir’s holding tank at r(t) = ${r} litres per minute, t minutes after the inlet opens. The volume in the tank, V(t), is an antiderivative of r(t), and every antiderivative of r(t) has the form V(t) = pt³ + qt² + st + C. Enter p, q and s.`,
   answer: [a, b, c],
   hints: ['Run the power rule backwards: a term kt² comes from a t³ term, and since the derivative of t³ is 3t², divide k by 3.', `Check your answer by differentiating pt³ + qt² + st: you must get back ${r}.`],
   solution: `Raise each power by one and divide by the new power. ${n(A)}t² becomes (${n(A)} ÷ 3)t³ = ${n(a)}t³, ${n(B)}t becomes (${n(B)} ÷ 2)t² = ${n(b)}t², and the constant ${n(c)} becomes ${n(c)}t. So V(t) = ${n(a)}t³ + ${n(b)}t² + ${n(c)}t + C: p = ${n(a)}, q = ${n(b)} and s = ${n(c)}. Check: the derivative of ${n(a)}t³ + ${n(b)}t² + ${n(c)}t + C is ${r}.`,
   guidance: [
    { prompt: `An antiderivative of ${n(A)}t² is pt³. The derivative of pt³ is 3pt². What must p be?`, answer: [a], explanation: `3p = ${n(A)}, so p = ${n(A)} ÷ 3 = ${n(a)}: the derivative of ${n(a)}t³ is ${n(A)}t².` },
    { prompt: `An antiderivative of ${n(B)}t is qt². The derivative of qt² is 2qt. What must q be?`, answer: [b], explanation: `2q = ${n(B)}, so q = ${n(B)} ÷ 2 = ${n(b)}: the derivative of ${n(b)}t² is ${n(B)}t.` },
    { prompt: `An antiderivative of the constant ${n(c)} is st. The derivative of st is s. What must s be?`, answer: [c], explanation: `s = ${n(c)}: the derivative of ${n(c)}t is ${n(c)}. The constant C can be anything, because its derivative is 0.` }
   ] }; }
 },
 q36: {
  canonical: { a: 2, b: 3, t1: 2, C: 36, T: 6 },
  /* r(t) = 2at + b, so the level is at² + bt + C; C is a positive whole number and the later time is at least 2 hours on. */
  draw: R => { const t1 = R.int(1, 3); return { a: R.int(2, 5), b: R.int(2, 9), t1, C: R.int(10, 60), T: t1 + R.int(2, 5) }; },
  build: ({ a, b, t1, C, T }) => { const g1 = a * t1 * t1 + b * t1, P = g1 + C, LT = a * T * T + b * T + C; return {
   prompt: `In spring the reservoir’s water level rises at r(t) = ${n(2 * a)}t + ${n(b)} centimetres per hour, t hours after the melt starts. At t = ${n(t1)} the level gauge reads ${n(P)} cm. The level is L(t) = pt² + st + C, where pt² + st is the antiderivative of r(t) with no constant term. Enter C, then the level at t = ${n(T)} in centimetres.`,
   answer: [C, LT],
   hints: [`Antidifferentiate term by term: L(t) = ${n(a)}t² + ${n(b)}t + C.`, `Put t = ${n(t1)} into L(t) and set the result equal to the reading, ${n(P)}, to find C.`],
   solution: `An antiderivative of ${n(2 * a)}t + ${n(b)} is ${n(a)}t² + ${n(b)}t, so L(t) = ${n(a)}t² + ${n(b)}t + C. At t = ${n(t1)}: ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} + C = ${n(P)}, so ${n(g1)} + C = ${n(P)} and C = ${n(C)}. Then L(${n(T)}) = ${n(a)} × ${n(T * T)} + ${n(b)} × ${n(T)} + ${n(C)} = ${n(LT)} centimetres.`,
   guidance: [
    { prompt: `Antidifferentiate r(t) = ${n(2 * a)}t + ${n(b)} term by term, writing L(t) = pt² + st + C. What are p and s?`, answer: [a, b], explanation: `The derivative of pt² is 2pt, so 2p = ${n(2 * a)} and p = ${n(a)}; the derivative of st is s, so s = ${n(b)}. L(t) = ${n(a)}t² + ${n(b)}t + C.` },
    { prompt: `Use the gauge reading: L(${n(t1)}) = ${n(P)}. What is C?`, answer: [C], explanation: `${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} + C = ${n(g1)} + C = ${n(P)}, so C = ${n(P)} − ${n(g1)} = ${n(C)}.` },
    { prompt: `Now L(t) = ${n(a)}t² + ${n(b)}t + ${n(C)}. What is the level at t = ${n(T)}?`, answer: [LT], explanation: `L(${n(T)}) = ${n(a)} × ${n(T * T)} + ${n(b)} × ${n(T)} + ${n(C)} = ${n(a * T * T)} + ${n(b * T)} + ${n(C)} = ${n(LT)} centimetres.` }
   ] }; }
 },
 q37: {
  canonical: { a: 3, c: 5, w: 2, k: 4 },
  /* r(t) = at² + c on [0, kw] with k rectangles of width w >= 2 ("1 minutes" never appears); every sum stays below 1000. */
  draw: R => { const [w, k] = R.pick([[2, 3], [2, 4], [3, 3]]); return { a: w === 3 ? 2 : R.int(2, 3), c: R.int(2, 12), w, k }; },
  build: ({ a, c, w, k }) => { const T = k * w, ts = Array.from({ length: k + 1 }, (_, i) => i * w), hs = ts.map(t => a * t * t + c);
   const left = hs.slice(0, k), right = hs.slice(1), sL = left.reduce((s, x) => s + x, 0), sR = right.reduce((s, x) => s + x, 0), L = w * sL, Rr = w * sR; return {
   prompt: `A pump fills the reservoir’s settling basin at r(t) = ${n(a)}t² + ${n(c)} litres per minute. Estimate the water pumped from t = 0 to t = ${n(T)} minutes with ${n(k)} rectangles of equal width. Enter the width of each rectangle in minutes, then the left-endpoint estimate, then the right-endpoint estimate, both in litres.`,
   answer: [w, L, Rr],
   hints: [`Each rectangle is ${n(T)} ÷ ${n(k)} minutes wide. The left endpoints are t = ${list(ts.slice(0, k))}; the right endpoints are t = ${list(ts.slice(1))}.`, 'Each rectangle’s area is its height, the rate at one end, times its width. Add the areas, or add the heights and multiply by the width once.'],
   solution: `Each rectangle is ${n(T)} ÷ ${n(k)} = ${n(w)} minutes wide. The rates at t = ${list(ts)} are ${list(hs)} litres per minute. The left-endpoint sum uses the first ${n(k)} of them: ${n(w)} × (${left.map(n).join(' + ')}) = ${n(w)} × ${n(sL)} = ${n(L)} litres. The right-endpoint sum uses the last ${n(k)}: ${n(w)} × (${right.map(n).join(' + ')}) = ${n(w)} × ${n(sR)} = ${n(Rr)} litres. The rate rises over the interval, so the true amount lies between the two.`,
   guidance: [
    { prompt: `The interval from t = 0 to t = ${n(T)} is cut into ${n(k)} rectangles of equal width. What is the width Δt?`, answer: [w], explanation: `Δt = (${n(T)} − 0) ÷ ${n(k)} = ${n(w)} minutes.` },
    { prompt: `The left endpoints are t = ${list(ts.slice(0, k))}. Add the rates there, then multiply by the width. What are the sum of the heights and the left-endpoint estimate?`, answer: [sL, L], explanation: `The rates are ${list(left)}, which add to ${n(sL)}. Times the width: ${n(w)} × ${n(sL)} = ${n(L)} litres.` },
    { prompt: `The right endpoints are t = ${list(ts.slice(1))}. What are the sum of the heights there and the right-endpoint estimate?`, answer: [sR, Rr], explanation: `The rates are ${list(right)}, which add to ${n(sR)}. Times the width: ${n(w)} × ${n(sR)} = ${n(Rr)} litres.` }
   ] }; }
 },
 q38: {
  canonical: { b: 2, t0: 4, m: 2 },
  /* r(t) = b(t0 − t) is zero at t0 and the interval runs m minutes past it; m ≠ t0, so the integral is not 0.
     Not the worked example (6 − 2x from 0 to 5). */
  draw: R => { let p; do { p = { b: R.int(2, 5), t0: R.int(2, 6), m: R.int(1, 4) }; } while (p.m === p.t0 || (p.b === 2 && p.t0 === 3 && p.m === 2)); return p; },
  build: ({ b, t0, m }) => { const B = b * t0, T = t0 + m, bm = b * m, up = t0 * B / 2, down = m * bm / 2, I = up - down; return {
   prompt: `The net flow into the reservoir’s overflow tank is r(t) = ${n(B)} − ${n(b)}t litres per minute: positive while the tank fills, negative once it drains. Find the definite integral ∫ from 0 to ${n(T)} of (${n(B)} − ${n(b)}t) dt from areas. Enter the area of the triangle above the axis, then the area of the triangle below it, both as positive numbers, then the definite integral.`,
   answer: [up, down, I],
   hints: [`The rate is zero at t = ${n(t0)}, where ${n(B)} − ${n(b)}t = 0. The graph is a straight line, so on each side of that time the region between the graph and the axis is a triangle.`, `A triangle’s area is its base times its height, divided by 2. The heights are ${n(B)} at t = 0 and ${n(bm)} at t = ${n(T)}, where the line is below the axis. Area below the axis counts as negative.`],
   solution: `The rate is zero at t = ${n(t0)}. From t = 0 to t = ${n(t0)} the graph and the axis enclose a triangle above the axis with base ${n(t0)} and height ${n(B)}: its area is ${n(t0)} × ${n(B)} ÷ 2 = ${n(up)}. From t = ${n(t0)} to t = ${n(T)} they enclose a triangle below the axis with base ${n(m)} and height ${n(bm)}: its area is ${n(m)} × ${n(bm)} ÷ 2 = ${n(down)}. The definite integral counts area below the axis as negative: ${n(up)} − ${n(down)} = ${n(I)}, so overall the tank ${I < 0 ? 'lost' : 'gained'} ${n(Math.abs(I))} litres.`,
   guidance: [
    { prompt: `At what time t is the rate ${n(B)} − ${n(b)}t equal to zero?`, answer: [t0], explanation: `${n(B)} − ${n(b)}t = 0 gives t = ${n(B)} ÷ ${n(b)} = ${n(t0)}. Before then the graph is above the axis, after it below.` },
    { prompt: `What are the areas of the triangle above the axis, from t = 0 to t = ${n(t0)}, and of the triangle below it, from t = ${n(t0)} to t = ${n(T)}?`, answer: [up, down], explanation: `Above: base ${n(t0)}, height r(0) = ${n(B)}, area ${n(t0)} × ${n(B)} ÷ 2 = ${n(up)}. Below: base ${n(m)}, height ${n(bm)} (r(${n(T)}) is ${n(-bm)}), area ${n(m)} × ${n(bm)} ÷ 2 = ${n(down)}.` },
    { prompt: 'The definite integral is the area above the axis minus the area below it. What is it?', answer: [I], explanation: `${n(up)} − ${n(down)} = ${n(I)}. A negative result would mean the tank lost more than it gained.` }
   ] }; }
 },
 q39: {
  canonical: { a: 1, b: 3, p: 1, q: 4 },
  /* r(t) = 3at² + 2bt, F(t) = at³ + bt²; the interval is 2 or 3 hours long and ends by t = 6, so F stays below 1000. */
  draw: R => { const p = R.int(0, 3); return { a: R.int(1, 3), b: R.int(1, 5), p, q: Math.min(6, p + R.int(2, 3)) }; },
  build: ({ a, b, p, q }) => { const r = `${co(3 * a, 't²')} + ${co(2 * b, 't')}`, F = `${co(a, 't³')} + ${co(b, 't²')}`, Fp = a * p ** 3 + b * p * p, Fq = a * q ** 3 + b * q * q, I = Fq - Fp; return {
   prompt: `During a refill, water enters the reservoir at r(t) = ${r} kilolitres per hour. Use the Fundamental Theorem of Calculus to find the water added from t = ${n(p)} to t = ${n(q)} hours, ∫ from ${n(p)} to ${n(q)} of r(t) dt. Enter F(${n(p)}) and F(${n(q)}) for the antiderivative F(t) of r(t) whose constant is 0, then the integral in kilolitres.`,
   answer: [Fp, Fq, I],
   hints: [`Reverse the power rule on each term of r(t): F(t) = ${F}.`, `The theorem says the integral equals F(${n(q)}) − F(${n(p)}): the value at the top end minus the value at the bottom end.`],
   solution: `F(t) = ${F} has F′(t) = ${r}, so it is an antiderivative. F(${n(p)}) = ${n(a)} × ${n(p ** 3)} + ${n(b)} × ${n(p * p)} = ${n(Fp)} and F(${n(q)}) = ${n(a)} × ${n(q ** 3)} + ${n(b)} × ${n(q * q)} = ${n(Fq)}. By the Fundamental Theorem of Calculus the integral is F(${n(q)}) − F(${n(p)}) = ${n(Fq)} − ${n(Fp)} = ${n(I)} kilolitres.`,
   guidance: [
    { prompt: `Write the antiderivative as F(t) = At³ + Bt². Which A and B give F′(t) = ${r}?`, answer: [a, b], explanation: `The derivative of At³ + Bt² is 3At² + 2Bt, so 3A = ${n(3 * a)} and 2B = ${n(2 * b)}: A = ${n(a)} and B = ${n(b)}.` },
    { prompt: `With F(t) = ${F}, what are F(${n(p)}) and F(${n(q)})?`, answer: [Fp, Fq], explanation: `F(${n(p)}) = ${n(a)} × ${n(p ** 3)} + ${n(b)} × ${n(p * p)} = ${n(Fp)} and F(${n(q)}) = ${n(a)} × ${n(q ** 3)} + ${n(b)} × ${n(q * q)} = ${n(Fq)}.` },
    { prompt: `What is F(${n(q)}) − F(${n(p)}), the value of the integral?`, answer: [I], explanation: `${n(Fq)} − ${n(Fp)} = ${n(I)} kilolitres were added between t = ${n(p)} and t = ${n(q)}.` }
   ] }; }
 },
 q40: {
  canonical: { a: 1, t0: 3, T: 4, V0: 200 },
  /* r(t) = 3a(t0² − t²) is zero at t0, and the interval ends 1 or 2 hours after it, so the reservoir is fullest at t0. */
  draw: R => { const t0 = R.int(2, 4); return { a: R.int(1, 3), t0, T: t0 + R.int(1, 2), V0: 10 * R.int(10, 40) }; },
  build: ({ a, t0, T, V0 }) => { const c = 3 * a * t0 * t0, cT = c * T, aT3 = a * T ** 3, net = cT - aT3, V = V0 + net; return {
   prompt: `The reservoir gains water at r(t) = ${n(c)} − ${co(3 * a, 't²')} kilolitres per hour, t hours after noon; a negative rate means it is draining. At noon it holds ${n(V0)} kilolitres. Enter the time in hours, between t = 0 and t = ${n(T)}, at which it holds the most water, then the net change in its volume from t = 0 to t = ${n(T)}, then its volume at t = ${n(T)}, both in kilolitres.`,
   answer: [t0, net, V],
   hints: ['The volume rises while r(t) is positive and falls once r(t) is negative, so it is largest at the moment the rate passes through zero.', `The net change is ∫ from 0 to ${n(T)} of r(t) dt; work it out with an antiderivative and add it to the noon volume.`],
   solution: `r(t) = 0 when ${co(3 * a, 't²')} = ${n(c)}, so t² = ${n(t0 * t0)} and t = ${n(t0)} hours. Before then the reservoir fills and after it drains, so it holds the most at t = ${n(t0)}. An antiderivative of r(t) is F(t) = ${n(c)}t − ${co(a, 't³')}, so the net change is F(${n(T)}) − F(0) = ${n(c)} × ${n(T)} − ${n(a)} × ${n(T ** 3)} = ${n(cT)} − ${n(aT3)} = ${n(net)} kilolitres. The volume at t = ${n(T)} is ${n(V0)} ${plus(net).replace(/^(.)/, '$1 ')} = ${n(V)} kilolitres.`,
   guidance: [
    { prompt: `At what time t is the rate ${n(c)} − ${co(3 * a, 't²')} equal to zero?`, answer: [t0], explanation: `${co(3 * a, 't²')} = ${n(c)} gives t² = ${n(t0 * t0)}, so t = ${n(t0)} hours. The volume stops rising and starts falling there.` },
    { prompt: `An antiderivative of r(t) is F(t) = ${n(c)}t − ${co(a, 't³')}. What is the net change F(${n(T)}) − F(0)?`, answer: [net], explanation: `F(${n(T)}) = ${n(c)} × ${n(T)} − ${n(a)} × ${n(T ** 3)} = ${n(cT)} − ${n(aT3)} = ${n(net)} and F(0) = 0, so the net change is ${n(net)} kilolitres.` },
    { prompt: `Add the net change to the ${n(V0)} kilolitres held at noon. What is the volume at t = ${n(T)}?`, answer: [V], explanation: `${n(V0)} ${plus(net).replace(/^(.)/, '$1 ')} = ${n(V)} kilolitres.` }
   ] }; }
 },
});
})();
