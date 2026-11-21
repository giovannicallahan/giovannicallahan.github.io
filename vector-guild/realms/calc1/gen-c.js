/* Calculus 1 mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md ("Generator") and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. The worked sample is q01 in gen-a.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A signed term with spaces, for the middle of a formula: sg(3) → "+ 3", sg(−2) → "− 2". */
const sg = x => (x < 0 ? '− ' : '+ ') + n(Math.abs(x));
/* True when x has at most `places` decimals (float noise ignored). */
const fits = (x, places) => { const s = x * Math.pow(10, places); return Math.abs(s - Math.round(s)) < 1e-7; };
const r2 = x => Math.round(x * 100) / 100;
/* Two decimals shown even when the last is 0 (3.20), for answers the prompt asks to round to 2 decimal places. */
const f2 = x => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2);
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* q21: h(t) = a sin t + b cos t; h′(t) = a cos t − b sin t, read at 0, π/2 and π/6. */
 q21: {
  canonical: { a: 6, b: 4 },
  /* a and b at least 2 (no coefficient 1 to write out) and different, so the three answers do not repeat. */
  draw: R => { const a = R.int(2, 9); return { a, b: R.except(2, 9, [a]) }; },
  build: ({ a, b }) => { const half = a * Math.sqrt(3) / 2, third = r2(half - b / 2); return {
   prompt: `In the machine shop a cam pushes a follower arm back and forth. The arm’s position is h(t) = ${n(a)} sin t + ${n(b)} cos t millimetres, where t is the time in seconds and the angle t is in radians. The velocity is the derivative h′(t). Enter the velocity in millimetres per second at t = 0, then at t = π/2, then at t = π/6 (round the last one to 2 decimal places).`,
   answer: [a, -b, third],
   hints: ['The derivative of sin t is cos t, and the derivative of cos t is −sin t. A number in front of a function stays in front of its derivative.', 'Read the unit circle: cos 0 = 1 and sin 0 = 0; cos(π/2) = 0 and sin(π/2) = 1; cos(π/6) = √3 ÷ 2, about 0.866, and sin(π/6) = 0.5.'],
   solution: `Differentiate each part: h′(t) = ${n(a)} cos t − ${n(b)} sin t. At t = 0: ${n(a)} × 1 − ${n(b)} × 0 = ${n(a)} mm/s. At t = π/2: ${n(a)} × 0 − ${n(b)} × 1 = ${n(-b)} mm/s, so the arm is moving backwards there. At t = π/6: ${n(a)} × (√3 ÷ 2) − ${n(b)} × 0.5 ≈ ${n(half)} − ${n(b / 2)} ≈ ${f2(third)} mm/s to 2 decimal places.`,
   guidance: [
    { prompt: `Differentiate h(t) = ${n(a)} sin t + ${n(b)} cos t one part at a time. The result has the form h′(t) = A cos t + B sin t. Enter A, then B.`, answer: [a, -b], explanation: `sin t becomes cos t, so ${n(a)} sin t becomes ${n(a)} cos t. cos t becomes −sin t, so ${n(b)} cos t becomes −${n(b)} sin t. So h′(t) = ${n(a)} cos t − ${n(b)} sin t.` },
    { prompt: `Put t = 0 and then t = π/2 into h′(t) = ${n(a)} cos t − ${n(b)} sin t. Use cos 0 = 1, sin 0 = 0, cos(π/2) = 0, sin(π/2) = 1.`, answer: [a, -b], explanation: `h′(0) = ${n(a)} × 1 − ${n(b)} × 0 = ${n(a)} and h′(π/2) = ${n(a)} × 0 − ${n(b)} × 1 = ${n(-b)}.` },
    { prompt: `Now t = π/6, where cos(π/6) = √3 ÷ 2 ≈ 0.866 and sin(π/6) = 0.5. What is h′(π/6), to 2 decimal places?`, answer: [third], explanation: `${n(a)} × (√3 ÷ 2) ≈ ${n(half)} and ${n(b)} × 0.5 = ${n(b / 2)}. The difference is about ${f2(third)}.` }
   ] }; }
 },
 /* q22: chips C(t) = a e^(kt), rate ak at t = 0; wear W(t) = b ln t, rate b ÷ d at t = d. */
 q22: {
  canonical: { a: 200, k: 0.3, b: 12, d: 4 },
  /* a a multiple of 50 and k a tenth, so a × k is a whole number; b a multiple of d, so b ÷ d is whole. d at least 2. */
  draw: R => { const d = R.int(2, 6); return { a: 50 * R.int(2, 16), k: R.int(1, 5) / 10, b: d * R.int(2, 9), d }; },
  build: ({ a, k, b, d }) => { const c0 = G.tidy(a * k), w = b / d; return {
   prompt: `During a long cutting run the machine shop logs two numbers. The metal chips in the collector grow as C(t) = ${n(a)}e^(${n(k)}t) chips, and the wear on the cutting edge since the 1-minute check is W(t) = ${n(b)} ln t micrometres for t ≥ 1, where t is the time in minutes. Enter the rate at which chips are piling up at t = 0, in chips per minute, then the rate at which the edge is wearing at t = ${n(d)}, in micrometres per minute.`,
   answer: [c0, w],
   hints: ['The derivative of e^x is e^x itself. With a number k multiplying t in the power, the chain rule brings that k down in front: the derivative of e^(kt) is k e^(kt). And e^0 = 1.', 'The derivative of ln t is 1 ÷ t. A number in front stays in front.'],
   solution: `C′(t) = ${n(a)} × ${n(k)} e^(${n(k)}t) = ${n(c0)}e^(${n(k)}t). At t = 0, e^0 = 1, so C′(0) = ${n(c0)} chips per minute. W′(t) = ${n(b)} ÷ t, so W′(${n(d)}) = ${n(b)} ÷ ${n(d)} = ${n(w)} micrometres per minute.`,
   guidance: [
    { prompt: `The derivative of e^(${n(k)}t) is ${n(k)}e^(${n(k)}t). Then C′(t) = ${n(a)} × ${n(k)} e^(${n(k)}t). What number multiplies e^(${n(k)}t) in C′(t)?`, answer: [c0], explanation: `${n(a)} × ${n(k)} = ${n(c0)}, so C′(t) = ${n(c0)}e^(${n(k)}t).` },
    { prompt: `At t = 0 the power is 0, and e^0 = 1. What is C′(0)?`, answer: [c0], explanation: `C′(0) = ${n(c0)} × 1 = ${n(c0)} chips per minute.` },
    { prompt: `The derivative of ${n(b)} ln t is ${n(b)} ÷ t. What is W′(${n(d)})?`, answer: [w], explanation: `${n(b)} ÷ ${n(d)} = ${n(w)} micrometres per minute.` }
   ] }; }
 },
 /* q23: u = x²(x + p) by the product rule, v = (ax + b) ÷ (x + q) by the quotient rule, w = (mx + s)³ by the chain rule, all at x = c. */
 q23: {
  canonical: { c: 1, p: 3, a: 2, q: 1, k: -1, m: 3, s: -1 },
  /* v′(c) = (aq − b) ÷ (c + q)², so b = aq − k(c + q)² makes v′(c) the whole number k. b and s are never 0, and
     mc + s is 2 or 3, so w′(c) stays small. */
  draw: R => { for (;;) {
   const c = R.int(1, 2), p = R.int(2, 6), a = R.int(2, 5), q = R.int(1, 3), k = R.nz(-3, 3), m = R.int(2, 4), s = R.pick([2, 3]) - m * c;
   const b = a * q - k * (c + q) * (c + q);
   if (b !== 0 && s !== 0 && Math.abs(b) <= 60) return { c, p, a, q, k, m, s };
  } },
  build: ({ c, p, a, q, k, m, s }) => { const b = a * q - k * (c + q) * (c + q), w = c + q, inner = m * c + s;
   const u1 = 2 * c * (c + p), u2 = c * c, du = u1 + u2, top = a * w - (a * c + b), dw = 3 * m * inner * inner;
   const vtext = `(${n(a)}x ${sg(b)}) ÷ (x + ${n(q)})`, wtext = `(${n(m)}x ${sg(s)})³`;
   return {
   prompt: `Three parts on the machine-shop bench have profiles u(x) = x²(x + ${n(p)}), v(x) = ${vtext} and w(x) = ${wtext}. Choose the right rule for each and enter the slopes u′(${n(c)}), v′(${n(c)}) and w′(${n(c)}), in that order.`,
   answer: [du, k, dw],
   hints: ['Ask what the last operation is in each formula. u multiplies two factors (product rule), v divides one by another (quotient rule), and w raises a bracket to a power (chain rule).', 'Product: f′g + fg′. Quotient: (f′g − fg′) ÷ g². Chain: the outer derivative at the inside, times the inside’s derivative.'],
   solution: `u is a product: u′(x) = 2x(x + ${n(p)}) + x² × 1, so u′(${n(c)}) = ${n(u1)} + ${n(u2)} = ${n(du)}. v is a quotient: v′(x) = (${n(a)}(x + ${n(q)}) − (${n(a)}x ${sg(b)})) ÷ (x + ${n(q)})², so v′(${n(c)}) = (${n(a * w)} − ${par(a * c + b)}) ÷ ${n(w * w)} = ${n(top)} ÷ ${n(w * w)} = ${n(k)}. w is a power of a bracket: w′(x) = 3(${n(m)}x ${sg(s)})² × ${n(m)}, so w′(${n(c)}) = 3 × ${n(inner * inner)} × ${n(m)} = ${n(dw)}.`,
   guidance: [
    { prompt: `Product rule for u(x) = x²(x + ${n(p)}): u′(x) = 2x(x + ${n(p)}) + x². What is u′(${n(c)})?`, answer: [du], explanation: `2 × ${n(c)} × ${n(c + p)} = ${n(u1)} and ${n(c)}² = ${n(u2)}, so u′(${n(c)}) = ${n(du)}.` },
    { prompt: `Quotient rule for v(x) = ${vtext}. At x = ${n(c)}, the top is ${n(a * c + b)} with derivative ${n(a)}, and the bottom is ${n(w)} with derivative 1. Work out (${n(a)} × ${n(w)} − ${par(a * c + b)} × 1) ÷ ${n(w)}².`, answer: [k], explanation: `(${n(a * w)} − ${par(a * c + b)}) ÷ ${n(w * w)} = ${n(top)} ÷ ${n(w * w)} = ${n(k)}.` },
    { prompt: `Chain rule for w(x) = ${wtext}: the outer part is (inside)³ with derivative 3(inside)², and the inside ${n(m)}x ${sg(s)} has derivative ${n(m)}. At x = ${n(c)} the inside is ${n(inner)}. What is w′(${n(c)})?`, answer: [dw], explanation: `3 × ${n(inner)}² × ${n(m)} = 3 × ${n(inner * inner)} × ${n(m)} = ${n(dw)}.` }
   ] }; }
 },
 /* q24: ax² + by² = C at (x0, y0); dy/dx = −ax0 ÷ (by0); tangent intercept y0 − slope × x0. */
 q24: {
  canonical: { a: 3, b: 2, x0: 2, y0: 3 },
  /* Coefficients 2 to 5 and unequal (equal ones make a circle, the worked example's shape), a point with positive whole
     coordinates; slope and intercept have at most 2 decimals. */
  draw: R => { for (;;) {
   const p = { a: R.int(2, 5), b: R.int(2, 5), x0: R.int(1, 4), y0: R.int(1, 4) };
   const slope = -p.a * p.x0 / (p.b * p.y0), icpt = p.y0 - slope * p.x0;
   if (p.a !== p.b && fits(slope, 2) && fits(icpt, 2) && !(p.a === 3 && p.b === 2 && p.x0 === 2 && p.y0 === 3)) return p;
  } },
  build: ({ a, b, x0, y0 }) => { const C = a * x0 * x0 + b * y0 * y0, slope = G.tidy(-a * x0 / (b * y0)), icpt = G.tidy(y0 - slope * x0); return {
   prompt: `The gantry’s crew walkway is curved along the oval ${n(a)}x² + ${n(b)}y² = ${n(C)} (on the site plan, where one unit is 10 metres, seen from above). The point (${n(x0)}, ${n(y0)}) is on it. Using implicit differentiation, enter the slope dy/dx of the walkway at that point, then the y-intercept of the tangent line there (give decimals, not fractions).`,
   answer: [slope, icpt],
   hints: [`Differentiate both sides with respect to x. The ${n(a)}x² term gives ${n(2 * a)}x as usual; ${n(b)}y² gives ${n(2 * b)}y × dy/dx, because y itself depends on x (chain rule). The constant on the right gives 0.`, 'Collect the dy/dx term on one side and divide. For the tangent line, use y = y₀ + slope × (x − x₀), where (x₀, y₀) is the point (the small 0 just marks the point’s own coordinates), and put x = 0.'],
   solution: `Differentiating: ${n(2 * a)}x + ${n(2 * b)}y × dy/dx = 0, so dy/dx = −${n(2 * a)}x ÷ (${n(2 * b)}y). At (${n(x0)}, ${n(y0)}): dy/dx = −${n(2 * a * x0)} ÷ ${n(2 * b * y0)} = ${n(slope)}. The tangent line is y = ${n(y0)} + ${par(slope)} × (x − ${n(x0)}); at x = 0 it gives y = ${n(y0)} ${sg(-slope * x0)} = ${n(icpt)}.`,
   guidance: [
    { prompt: `Differentiate ${n(a)}x² + ${n(b)}y² = ${n(C)} with respect to x. You get A·x + B·y·dy/dx = 0. Enter A, then B.`, answer: [2 * a, 2 * b], explanation: `${n(a)}x² gives ${n(2 * a)}x. ${n(b)}y² gives ${n(2 * b)}y × dy/dx by the chain rule, since y changes with x. ${n(C)} is a constant, so it gives 0.` },
    { prompt: `So dy/dx = −${n(2 * a)}x ÷ (${n(2 * b)}y). What is it at x = ${n(x0)}, y = ${n(y0)}?`, answer: [slope], explanation: `−${n(2 * a * x0)} ÷ ${n(2 * b * y0)} = ${n(slope)}.` },
    { prompt: `The tangent line goes through (${n(x0)}, ${n(y0)}) with slope ${n(slope)}. Where does it cross the y-axis (x = 0)?`, answer: [icpt], explanation: `y = ${n(y0)} + ${par(slope)} × (0 − ${n(x0)}) = ${n(y0)} ${sg(-slope * x0)} = ${n(icpt)}.` }
   ] }; }
 },
 /* q25: ladder of length L, foot x from the tower, top y high, foot sliding out at v; the top falls at xv ÷ y. */
 q25: {
  canonical: { L: 13, x: 5, y: 12, v: 0.6 },
  /* Whole-number triangles; the speed has at most 2 decimals. Never the worked example's 10 m ladder with its foot at 6 m. */
  draw: R => { const sides = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]];
   for (;;) { const [s1, s2, L] = R.pick(sides), out = R.bool(), x = out ? s1 : s2, y = out ? s2 : s1, v = R.int(2, 9) / 10;
    if (fits(x * v / y, 2) && !(L === 10 && x === 6)) return { L, x, y, v }; } },
  build: ({ L, x, y, v }) => { const down = G.tidy(x * v / y); return {
   prompt: `A ${n(L)} m access ladder leans against the launch tower. Its foot slides straight away from the tower along level ground at ${n(v)} m/s, and its top slides down the tower. At the moment the foot is ${n(x)} m from the tower, enter how high up the tower the top is, in metres, then how fast the top is sliding down, in metres per second (as a positive number).`,
   answer: [y, down],
   hints: ['Call the foot’s distance x and the top’s height y. The ladder is the long side of a right triangle, so x² + y² is the ladder’s length squared at every moment.', 'Differentiate x² + y² = constant with respect to time t: 2x dx/dt + 2y dy/dt = 0. You know x, y and dx/dt; solve for dy/dt.'],
   solution: `First the height: y² = ${n(L * L)} − ${n(x * x)} = ${n(y * y)}, so y = ${n(y)} m. Differentiating x² + y² = ${n(L * L)} with respect to time gives 2x dx/dt + 2y dy/dt = 0, so dy/dt = −x dx/dt ÷ y = −${n(x)} × ${n(v)} ÷ ${n(y)} = ${n(-down)} m/s. The minus sign means the top moves down, at ${n(down)} m/s.`,
   guidance: [
    { prompt: `By Pythagoras, ${n(x)}² + y² = ${n(L)}². How high is the top, y?`, answer: [y], explanation: `y² = ${n(L * L)} − ${n(x * x)} = ${n(y * y)}, so y = ${n(y)} m.` },
    { prompt: `Differentiating x² + y² = ${n(L * L)} with respect to time gives 2x dx/dt + 2y dy/dt = 0. Put in x = ${n(x)}, y = ${n(y)} and dx/dt = ${n(v)}. What is dy/dt?`, answer: [-down], explanation: `2 × ${n(x)} × ${n(v)} + 2 × ${n(y)} × dy/dt = 0, so dy/dt = −${n(G.tidy(2 * x * v))} ÷ ${n(2 * y)} = ${n(-down)} m/s.` },
    { prompt: `dy/dt is negative because the height is shrinking. How fast is the top sliding down, as a positive speed?`, answer: [down], explanation: `The top slides down at ${n(down)} m/s.` }
   ] }; }
 },
 /* q26: √(s² + d) ≈ s + d ÷ (2s), the tangent line of √x at s². */
 q26: {
  canonical: { s: 10, d: 3 },
  /* Square roots whose slope 1 ÷ (2s) is a short decimal; d small beside s², never 0; at most 3 decimals throughout. */
  draw: R => { const s = R.pick([4, 5, 10, 20, 25]), lim = { 4: 3, 5: 4, 10: 9, 20: 12, 25: 12 }[s];
   let d; do { d = R.nz(-lim, lim); } while (s === 10 && d === 3); return { s, d }; },
  build: ({ s, d }) => { const A = s * s, slope = G.tidy(1 / (2 * s)), dy = G.tidy(d / (2 * s)), est = G.tidy(s + d / (2 * s)); return {
   prompt: `The gantry crew needs the side length of a square blast plate whose area is ${n(A + d)} m², with no calculator. The side of a square of area x is f(x) = √x. Use the linear approximation of f at x = ${n(A)}, where √${n(A)} = ${n(s)}. Enter the slope f′(${n(A)}), then the estimated change in the side, dy, for the change in area dx = ${n(d)}, then the estimated side length in metres.`,
   answer: [slope, dy, est],
   hints: ['Write √x as x^(1/2). The power rule gives f′(x) = (1/2)x^(−1/2), which is 1 ÷ (2√x).', 'The differential dy = f′(a) × dx is the change along the tangent line. The estimate is f(a) + dy.'],
   solution: `f′(x) = 1 ÷ (2√x), so f′(${n(A)}) = 1 ÷ (2 × ${n(s)}) = ${n(slope)}. The estimated change is dy = ${n(slope)} × ${par(d)} = ${n(dy)}. So √${n(A + d)} ≈ ${n(s)} ${sg(dy)} = ${n(est)} m.`,
   guidance: [
    { prompt: `f′(x) = 1 ÷ (2√x). What is f′(${n(A)})?`, answer: [slope], explanation: `1 ÷ (2 × ${n(s)}) = 1 ÷ ${n(2 * s)} = ${n(slope)}.` },
    { prompt: `The area changes by dx = ${n(d)}. Along the tangent line the side changes by dy = f′(${n(A)}) × dx. What is dy?`, answer: [dy], explanation: `${n(slope)} × ${par(d)} = ${n(dy)}.` },
    { prompt: `Add the change to the known side: ${n(s)} ${sg(dy)}. What is the estimate?`, answer: [est], explanation: `${n(s)} ${sg(dy)} = ${n(est)} m. The true value is very close, because the curve hugs its tangent line near x = ${n(A)}.` }
   ] }; }
 },
 /* q27: P(t) = t³ − (3/2)(p + q)t² + 3pq t + d; P′(t) = 3(t − p)(t − q); local maximum at p. */
 q27: {
  canonical: { p: 2, q: 4, d: 10 },
  /* q − p even, so the t² coefficient is whole. d keeps the local minimum positive (a pressure). */
  draw: R => { const p = R.int(1, 4), q = p + 2 * R.int(1, 3), low = q * q * (1.5 * p - 0.5 * q);
   return { p, q, d: R.int(5, 40) - Math.min(0, low) }; },
  build: ({ p, q, d }) => { const B = 1.5 * (p + q), Cc = 3 * p * q, top = -0.5 * p * p * p + 1.5 * q * p * p + d;
   const f = t => t * t * t - B * t * t + Cc * t + d, mid = (p + q) / 2; return {
   prompt: `Pressure in a fuel line at the launch gantry follows P(t) = t³ − ${n(B)}t² + ${n(Cc)}t + ${n(d)} kilopascals, t minutes after the pumps start. Find the critical points of P. Enter the earlier critical time, then the later one, then the pressure at the local maximum.`,
   answer: [p, q, top],
   hints: ['A critical point is where P′(t) = 0. Use the power rule, then factor the quadratic after taking out the common factor 3.', 'P rises where P′ > 0 and falls where P′ < 0. Test one time before, between and after the two critical points; a change from rising to falling is a local maximum.'],
   solution: `P′(t) = 3t² − ${n(2 * B)}t + ${n(Cc)} = 3(t² − ${n(p + q)}t + ${n(p * q)}) = 3(t − ${n(p)})(t − ${n(q)}), which is 0 at t = ${n(p)} and t = ${n(q)}. P′ is positive before ${n(p)}, negative between ${n(p)} and ${n(q)} (for example P′(${n(mid)}) = ${n(3 * (mid - p) * (mid - q))}), and positive after ${n(q)}. So P rises, then falls, then rises: the local maximum is at t = ${n(p)}, where P(${n(p)}) = ${n(top)} kPa, and the local minimum is at t = ${n(q)}, where P = ${n(f(q))} kPa.`,
   guidance: [
    { prompt: `P′(t) = 3t² − ${n(2 * B)}t + ${n(Cc)} = 3(t² − ${n(p + q)}t + ${n(p * q)}). Which two times make it zero? Enter the smaller, then the larger.`, answer: [p, q], explanation: `t² − ${n(p + q)}t + ${n(p * q)} = (t − ${n(p)})(t − ${n(q)}), which is 0 at t = ${n(p)} and t = ${n(q)}.` },
    { prompt: `Test the sign of P′ between the critical points, at t = ${n(mid)}. What is P′(${n(mid)})?`, answer: [3 * (mid - p) * (mid - q)], explanation: `3(${n(mid)} − ${n(p)})(${n(mid)} − ${n(q)}) = ${n(3 * (mid - p) * (mid - q))}, negative, so P falls between them. Before ${n(p)} and after ${n(q)} both brackets have the same sign, so P′ > 0 there. P rises up to t = ${n(p)} and then falls: that is a local maximum.` },
    { prompt: `What is the pressure at the local maximum, P(${n(p)})?`, answer: [top], explanation: `P(${n(p)}) = ${n(p * p * p)} − ${n(B * p * p)} + ${n(Cc * p)} + ${n(d)} = ${n(top)} kPa.` }
   ] }; }
 },
 /* q28: h(t) = −t³ + (3/2)(p + q)t² − 3pq t + d; h″(t) = −6t + 3(p + q); minimum at p, maximum at q, inflection at (p + q) ÷ 2. */
 q28: {
  canonical: { p: 1, q: 5, d: 20 },
  /* q − p even so every coefficient is whole; d keeps the lowest height (at the local minimum or at the last time) at least 5 m. */
  draw: R => { const p = R.int(1, 3), q = p + 2 * R.int(1, 3), e = q + 2, low = p * p * (0.5 * p - 1.5 * q);
   const end = -e * e * e + 1.5 * (p + q) * e * e - 3 * p * q * e;   // the height at the last time, without d
   return { p, q, d: R.int(5, 30) - Math.min(0, low, end) }; },
  build: ({ p, q, d }) => { const B = 1.5 * (p + q), Cc = 3 * p * q, hp = 3 * (q - p), hq = -3 * (q - p), mid = (p + q) / 2;
   const top = q * q * (0.5 * q - 1.5 * p) + d; return {
   prompt: `A tethered test balloon above the launch gantry has height h(t) = −t³ + ${n(B)}t² − ${n(Cc)}t + ${n(d)} metres, t minutes after release, for 0 ≤ t ≤ ${n(q + 2)}. Its critical points are t = ${n(p)} and t = ${n(q)}. Enter the second derivative h″ at t = ${n(p)}, then the height at the local maximum, then the time of the inflection point.`,
   answer: [hp, top, mid],
   hints: ['Differentiate twice: h′(t) = −3t² + …, then h″(t) is the derivative of h′(t).', 'Second derivative test: h″ > 0 at a critical point means concave up, a local minimum; h″ < 0 means concave down, a local maximum. The inflection point is where h″(t) = 0 and changes sign.'],
   solution: `h′(t) = −3t² + ${n(2 * B)}t − ${n(Cc)} and h″(t) = −6t + ${n(2 * B)}. At t = ${n(p)}: h″ = ${n(-6 * p)} + ${n(2 * B)} = ${n(hp)} > 0, so the curve is concave up there and t = ${n(p)} is a local minimum. At t = ${n(q)}: h″ = ${n(hq)} < 0, so t = ${n(q)} is the local maximum, with h(${n(q)}) = ${n(top)} m. h″(t) = 0 when 6t = ${n(2 * B)}, at t = ${n(mid)}, and h″ changes sign there: that is the inflection point.`,
   guidance: [
    { prompt: `h′(t) = −3t² + ${n(2 * B)}t − ${n(Cc)}. Differentiate again: h″(t) = A·t + B. Enter A, then B.`, answer: [-6, 2 * B], explanation: `The derivative of −3t² is −6t, of ${n(2 * B)}t is ${n(2 * B)}, and of the constant −${n(Cc)} is 0. So h″(t) = −6t + ${n(2 * B)}.` },
    { prompt: `Evaluate h″ at both critical points: h″(${n(p)}), then h″(${n(q)}).`, answer: [hp, hq], explanation: `h″(${n(p)}) = ${n(hp)} > 0: concave up, a local minimum. h″(${n(q)}) = ${n(hq)} < 0: concave down, a local maximum.` },
    { prompt: `The local maximum is at t = ${n(q)}. What is h(${n(q)})?`, answer: [top], explanation: `h(${n(q)}) = −${n(q * q * q)} + ${n(B * q * q)} − ${n(Cc * q)} + ${n(d)} = ${n(top)} m.` },
    { prompt: `Where is h″(t) = −6t + ${n(2 * B)} equal to 0?`, answer: [mid], explanation: `6t = ${n(2 * B)}, so t = ${n(mid)}. Before it h″ > 0 (concave up), after it h″ < 0 (concave down).` }
   ] }; }
 },
 /* q29: f(x) = 3x⁴ − 4(a + b)x³ + 6abx²; f′ = 12x(x − a)(x − b); local max at a with value a³(2b − a); f″(b) = 12b(b − a). */
 q29: {
  canonical: { a: 1, b: 3 },
  draw: R => { let p; do { const a = R.int(1, 3); p = { a, b: a + R.int(1, 3) }; } while (p.a === 1 && p.b === 3); return p; },
  build: ({ a, b }) => { const c3 = 4 * (a + b), c2 = 6 * a * b, top = a * a * a * (2 * b - a), fb = 12 * b * (b - a), fa = 12 * a * (a - b), mid = (a + b) / 2;
   const sgn = x => 12 * x * (x - a) * (x - b); return {
   prompt: `The floor of the flame trench under the launch gantry has the profile f(x) = 3x⁴ − ${n(c3)}x³ + ${n(c2)}x² millimetres (height relative to the pad edge), x metres across from the trench’s centre line, negative on one side and positive on the other. Describe it from its derivatives: enter the x where f has its local maximum, the height f there, then the second derivative f″ at the critical point furthest to the right (the largest x).`,
   answer: [a, top, fb],
   hints: ['f′(x) = 12x³ − … ; take out 12x and factor the quadratic that is left to find the three critical points.', 'Check the sign of f′ between the critical points (or use f″): the local maximum is where f stops rising and starts falling.'],
   solution: `f′(x) = 12x³ − ${n(3 * c3)}x² + ${n(2 * c2)}x = 12x(x − ${n(a)})(x − ${n(b)}), so the critical points are 0, ${n(a)} and ${n(b)}. f′ < 0 for x < 0, f′ > 0 between 0 and ${n(a)}, f′ < 0 between ${n(a)} and ${n(b)}, f′ > 0 after ${n(b)}. So f falls, rises, falls, rises: local minima at 0 and ${n(b)}, the local maximum at x = ${n(a)}, with f(${n(a)}) = ${n(top)}. f″(x) = 36x² − ${n(6 * c3)}x + ${n(2 * c2)}, so f″(${n(a)}) = ${n(fa)} (concave down, a maximum) and f″(${n(b)}) = ${n(fb)} (concave up, a minimum).`,
   guidance: [
    { prompt: `f′(x) = 12x³ − ${n(3 * c3)}x² + ${n(2 * c2)}x = 12x(x² − ${n(a + b)}x + ${n(a * b)}). Besides x = 0, which two x make f′ zero? Enter the smaller, then the larger.`, answer: [a, b], explanation: `x² − ${n(a + b)}x + ${n(a * b)} = (x − ${n(a)})(x − ${n(b)}), so the critical points are 0, ${n(a)} and ${n(b)}.` },
    { prompt: `Test the sign of f′ between ${n(a)} and ${n(b)}, at x = ${n(mid)}. What is f′(${n(mid)})?`, answer: [sgn(mid)], explanation: `12 × ${n(mid)} × ${par(mid - a)} × ${par(mid - b)} = ${n(sgn(mid))}, negative: f falls after x = ${n(a)}. Between 0 and ${n(a)} it rises, so x = ${n(a)} is the local maximum.` },
    { prompt: `What is the height at the local maximum, f(${n(a)})?`, answer: [top], explanation: `3 × ${n(a ** 4)} − ${n(c3)} × ${n(a ** 3)} + ${n(c2)} × ${n(a * a)} = ${n(top)}.` },
    { prompt: `f″(x) = 36x² − ${n(6 * c3)}x + ${n(2 * c2)}. What is f″(${n(b)})?`, answer: [fb], explanation: `36 × ${n(b * b)} − ${n(6 * c3 * b)} + ${n(2 * c2)} = ${n(fb)}, positive: concave up, so x = ${n(b)} is a local minimum, as the signs of f′ said.` }
   ] }; }
 },
 /* q30: f(x) = x³ − 3k²x + c on [0, R]; the critical point k is inside; compare f(0), f(k), f(R). */
 q30: {
  canonical: { k: 2, R: 3, c: 20 },
  /* R between k + 1 and 2k, so sometimes the left end and sometimes the right end is highest; c keeps every value positive. */
  draw: R => { let p; do { const k = R.int(2, 4); p = { k, R: R.int(k + 1, 2 * k), c: 2 * k * k * k + R.int(2, 30) }; } while (p.k === 2 && p.R === 3 && p.c === 20); return p; },
  build: ({ k, R: r, c }) => { const K = 3 * k * k, f = x => x * x * x - K * x + c, f0 = f(0), fk = f(k), fr = f(r), hi = Math.max(f0, fr); return {
   prompt: `In the design studio, the stress in a bracket is modelled as S(x) = x³ − ${n(K)}x + ${n(c)} megapascals, where x is a thickness setting that can be anything from 0 to ${n(r)}. Enter the absolute maximum of S on this closed interval, then the absolute minimum.`,
   answer: [hi, fk],
   hints: ['On a closed interval the absolute maximum and minimum can only be at a critical point inside the interval or at one of the two ends.', 'Find where S′(x) = 3x² − … is 0 inside the interval, then evaluate S there and at both ends and compare the three values.'],
   solution: `S′(x) = 3x² − ${n(K)} = 3(x² − ${n(k * k)}), which is 0 at x = ${n(k)} (and at x = −${n(k)}, outside the interval). The candidates: S(0) = ${n(f0)}, S(${n(k)}) = ${n(k ** 3)} − ${n(K * k)} + ${n(c)} = ${n(fk)}, S(${n(r)}) = ${n(r ** 3)} − ${n(K * r)} + ${n(c)} = ${n(fr)}. The largest is ${n(hi)}, the absolute maximum, at x = ${fr > f0 ? n(r) : '0'}; the smallest is ${n(fk)}, the absolute minimum, at x = ${n(k)}.`,
   guidance: [
    { prompt: `S′(x) = 3x² − ${n(K)}. Which x between 0 and ${n(r)} makes S′(x) = 0?`, answer: [k], explanation: `3x² = ${n(K)} gives x² = ${n(k * k)}, so x = ${n(k)} (the other root, −${n(k)}, is outside the interval).` },
    { prompt: `Evaluate S at the three candidates: S(0), S(${n(k)}), S(${n(r)}).`, answer: [f0, fk, fr], explanation: `S(0) = ${n(f0)}, S(${n(k)}) = ${n(fk)} and S(${n(r)}) = ${n(fr)}.` },
    { prompt: `Compare ${n(f0)}, ${n(fk)} and ${n(fr)}. Enter the largest, then the smallest.`, answer: [hi, fk], explanation: `The absolute maximum is ${n(hi)} and the absolute minimum is ${n(fk)}. Checking only the critical point would have missed the maximum, which is at an end.` }
   ] }; }
 },
});
})();
