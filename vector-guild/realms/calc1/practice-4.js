/* Calculus 1 practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions". The worked sample is q01b in practice-1.js.
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc1/oracle-p4.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* Registers a practice mission whose prompt, answers, hints, solution and guided steps are taken from
   build(canonical), so the authored text and the generator cannot drift apart. */
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(G.tidy), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(G.tidy), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* A polynomial from [coefficient, letter part] pairs: zero terms dropped, a coefficient 1 not written out. */
const poly = terms => {
 let out = '';
 for (const [c, v] of terms) {
  if (c === 0) continue;
  const mag = Math.abs(c), body = (mag === 1 && v) ? v : n(mag) + v;
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body;
 }
 return out || '0';
};
/* Number of decimal places of x after rounding float noise. */
const dec = x => { const s = String(G.tidy(x)), i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
/* "6 + (−3)" style sum of already-formatted first term and a signed second number. */
const addOn = (first, x) => `${first} ${x < 0 ? '−' : '+'} ${n(Math.abs(x))}`;
void plus;

/* ---- q16 Velocity and acceleration ---- */
practice({
 id: 'q16b', parent: 'q16', kind: 'setting',
 title: 'The camera dolly beside the track',
 brief: 'A camera dolly on a rail beside the test straight keeps jerking, and the film crew want to know whether it is speeding up or slowing down at one moment.',
 labels: ['velocity (m/s)', 'acceleration (m/s²)', 'speeding up (1) or slowing down (0)'], tolerance: 0.01
}, [['velocity (m/s)'], ['acceleration (m/s²)'], ['speeding up (1) or slowing down (0)']], {
 /* Not the q16 worked example (4t² + 3t at t = 2). */
 canonical: { p: 1, b: 6, c: 5, t0: 3 },
 /* s(t) = pt³ − bt² + ct. The velocity and the acceleration are never 0 (and the velocity never ±1), so the
    speeding-up question always has an answer; all four sign cases occur over the draws. A dolly: at most 12 m/s
    and 20 m/s² in size. */
 draw: R => { let o; do { o = { p: R.int(1, 2), b: R.int(3, 12), c: R.int(2, 20), t0: R.int(1, 4) }; } while ((() => { const v = 3 * o.p * o.t0 * o.t0 - 2 * o.b * o.t0 + o.c, a = 6 * o.p * o.t0 - 2 * o.b; return Math.abs(v) <= 1 || a === 0 || Math.abs(v) > 12 || Math.abs(a) > 20; })()); return o; },
 build: ({ p, b, c, t0 }) => {
  const s = poly([[p, 't³'], [-b, 't²'], [c, 't']]), A = 3 * p, B = -2 * b, v = A * t0 * t0 + B * t0 + c, D = 6 * p, E = -2 * b, acc = D * t0 + E, up = v * acc > 0 ? 1 : 0;
  const why = v > 0 && acc > 0 ? 'The velocity and the acceleration are both positive, so the dolly is moving forward and getting faster: it is speeding up, so enter 1.'
   : v < 0 && acc < 0 ? 'The velocity and the acceleration are both negative, so the dolly is moving back and getting faster in that direction: it is speeding up, so enter 1.'
   : v > 0 ? 'The velocity is positive but the acceleration is negative, so the dolly is moving forward and losing speed: it is slowing down, so enter 0.'
   : 'The velocity is negative but the acceleration is positive, so the dolly is moving back and losing speed: it is slowing down, so enter 0.';
  return {
   prompt: `A camera dolly rolls on a rail beside the test straight to film the rovers. Its position along the rail is s(t) = ${s} metres from its parking mark, t seconds after it starts. At t = ${n(t0)}, enter its velocity in metres per second, then its acceleration in metres per second per second. Then enter 1 if the dolly is speeding up at that moment, or 0 if it is slowing down.`,
   answer: [v, acc, up],
   hints: ['Differentiate the position term by term for the velocity v(t), then differentiate v(t) for the acceleration a(t).', 'The dolly speeds up when its velocity and acceleration have the same sign, and slows down when their signs differ. A negative velocity means it is moving back.'],
   solution: `Velocity: v(t) = s′(t) = ${poly([[A, 't²'], [B, 't'], [c, '']])}, so v(${n(t0)}) = ${n(A)} × ${n(t0 * t0)} + ${par(B)} × ${n(t0)} + ${n(c)} = ${n(v)} metres per second. Acceleration: a(t) = v′(t) = ${poly([[D, 't'], [E, '']])}, so a(${n(t0)}) = ${n(D)} × ${n(t0)} + ${par(E)} = ${n(acc)} metres per second per second. ${why}`,
   guidance: [
    { prompt: `Differentiate s(t) = ${s} term by term to get the velocity v(t). What is v(${n(t0)})?`, answer: [v], explanation: `v(t) = ${poly([[A, 't²'], [B, 't'], [c, '']])}, so v(${n(t0)}) = ${n(A)} × ${n(t0 * t0)} + ${par(B)} × ${n(t0)} + ${n(c)} = ${n(v)} metres per second.` },
    { prompt: 'Differentiate v(t) once more to get the acceleration a(t). What is the acceleration at the same time?', answer: [acc], explanation: `a(t) = ${poly([[D, 't'], [E, '']])}, so a(${n(t0)}) = ${n(D)} × ${n(t0)} + ${par(E)} = ${n(acc)} metres per second per second.` },
    { prompt: `The velocity is ${n(v)} and the acceleration is ${n(acc)}. Enter 1 if the dolly is speeding up, or 0 if it is slowing down.`, answer: [up], explanation: why }
   ] };
 }
});

practice({
 id: 'q16c', parent: 'q16', kind: 'applied',
 title: 'Stopping short of the barrier',
 brief: 'A rover is braking towards the crash barrier at the end of the straight, and the track marshal needs to know whether it stops in time.',
 labels: ['stopping time (s)', 'braking distance (m)', 'gap to barrier (m)'], tolerance: 0.01
}, [['stopping time (s)'], ['braking distance (m)'], ['gap to barrier (m)']], {
 canonical: { k: 2, T: 6, gap: 18 },
 /* s(t) = 2kT·t − kt²: the velocity 2kT − 2kt is zero at t = T, the braking distance is kT². Top speed at most
    30 m/s, a braking of 2 to 6 m/s², a stop after 3 to 8 seconds and a gap of at least 3 metres. */
 draw: R => { let o; do { o = { k: R.int(1, 3), T: R.int(3, 8), gap: R.int(3, 25) }; } while (2 * o.k * o.T > 30); return o; },
 build: ({ k, T, gap }) => {
  const v0 = 2 * k * T, D = k * T * T, L = D + gap, s = poly([[v0, 't'], [-k, 't²']]);
  return {
   prompt: `A rover is running down the test straight when it brakes hard. From the moment the brakes go on, its position is s(t) = ${s} metres past the braking point, t seconds later, until it stops. A crash barrier stands ${n(L)} metres past the braking point. Enter the time in seconds at which the rover stops, the distance in metres it covers by then, then how many metres short of the barrier it comes to rest.`,
   answer: [T, D, gap],
   hints: ['The rover stops when its velocity v(t) = s′(t) is zero. Differentiate, set the velocity equal to 0 and solve for t.', 'Put the stopping time into s(t) to get the braking distance, then compare it with the distance to the barrier.'],
   solution: `The velocity is v(t) = s′(t) = ${poly([[v0, ''], [-2 * k, 't']])}, which is zero when ${n(2 * k)}t = ${n(v0)}, that is at t = ${n(v0)} ÷ ${n(2 * k)} = ${n(T)} seconds. By then the rover has covered s(${n(T)}) = ${n(v0)} × ${n(T)} − ${k === 1 ? '' : n(k) + ' × '}${n(T * T)} = ${n(v0 * T)} − ${n(D)} = ${n(D)} metres. The barrier is ${n(L)} metres away, so the rover stops ${n(L)} − ${n(D)} = ${n(gap)} metres short of it.`,
   guidance: [
    { prompt: `Differentiate s(t) = ${s} to get the velocity. At what time is the velocity zero?`, answer: [T], explanation: `v(t) = ${poly([[v0, ''], [-2 * k, 't']])}. It is zero when ${n(2 * k)}t = ${n(v0)}, so t = ${n(T)} seconds.` },
    { prompt: `How far past the braking point is the rover at t = ${n(T)}? Work out s(${n(T)}).`, answer: [D], explanation: `s(${n(T)}) = ${n(v0 * T)} − ${n(D)} = ${n(D)} metres.` },
    { prompt: `The barrier is ${n(L)} metres past the braking point. How many metres short of it does the rover stop?`, answer: [gap], explanation: `${n(L)} − ${n(D)} = ${n(gap)} metres, so the rover stops safely before the barrier.` }
   ] };
 }
});

practice({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q01',
 title: 'Two turns on the shuttle run',
 brief: 'A shuttle cart runs out, comes back and runs out again on the straight, and the crew want its turning times and its average velocity between them.',
 labels: ['earlier turning time (s)', 'later turning time (s)', 'average velocity (m/s)'], tolerance: 0.01
}, [['earlier turning time (s)', 'later turning time (s)'], ['position at earlier turn (m)', 'position at later turn (m)'], ['average velocity (m/s)']], {
 canonical: { p: 2, r1: 1, r2: 4 },
 /* s(t) = pt³ − (3p/2)(r1 + r2)t² + 3p·r1·r2·t, so v(t) = 3p(t − r1)(t − r2). The average velocity between the turns
    is −p(r2 − r1)² ÷ 2, a whole number when p is 2 or r1 + r2 is even; never −1. */
 draw: R => { let o; do { const r1 = R.int(1, 4); o = { p: R.int(1, 2), r1, r2: r1 + R.int(1, 5) }; } while ((o.p === 1 && (o.r1 + o.r2) % 2) || o.p * (o.r2 - o.r1) ** 2 === 2); return o; },
 build: ({ p, r1, r2 }) => {
  const S = r1 + r2, P = r1 * r2, b = 3 * p * S / 2, c = 3 * p * P, s = poly([[p, 't³'], [-b, 't²'], [c, 't']]);
  const pos = t => p * t ** 3 - b * t * t + c * t, s1 = pos(r1), s2 = pos(r2), d = r2 - r1, avg = (s2 - s1) / d;
  const term = t => `${p === 1 ? '' : n(p) + ' × '}${n(t ** 3)} − ${n(b)} × ${n(t * t)} + ${n(c)} × ${n(t)}`;
  return {
   prompt: `A shuttle cart on the test straight runs out, comes back and runs out again. Its position is s(t) = ${s} metres from the start line, t seconds after the start. Find the two times at which it turns round, and enter the earlier one, then the later one, in seconds. Then enter its average velocity between those two times, in metres per second.`,
   answer: [r1, r2, avg],
   hints: ['The cart turns round when its velocity v(t) = s′(t) is zero. Set v(t) = 0, divide through by the number in front of t², and factor.', 'Average velocity is the change in position divided by the time taken, as for any average rate: work out s at both turning times.'],
   solution: `The velocity is v(t) = s′(t) = ${poly([[3 * p, 't²'], [-3 * p * S, 't'], [3 * p * P, '']])} = ${n(3 * p)}(${poly([[1, 't²'], [-S, 't'], [P, '']])}) = ${n(3 * p)}(t − ${n(r1)})(t − ${n(r2)}), which is zero at t = ${n(r1)} and at t = ${n(r2)}. The positions there are s(${n(r1)}) = ${term(r1)} = ${n(s1)} and s(${n(r2)}) = ${term(r2)} = ${n(s2)}. The average velocity is the change in position over the time taken: (${n(s2)} − ${par(s1)}) ÷ (${n(r2)} − ${n(r1)}) = ${n(s2 - s1)} ÷ ${n(d)} = ${n(avg)} metres per second. It is negative because between the two turns the cart is moving back towards the start line.`,
   guidance: [
    { prompt: `Differentiate: v(t) = ${poly([[3 * p, 't²'], [-3 * p * S, 't'], [3 * p * P, '']])}. Set it equal to 0 and factor. Enter the earlier time, then the later time.`, answer: [r1, r2], explanation: `Dividing by ${n(3 * p)} gives ${poly([[1, 't²'], [-S, 't'], [P, '']])} = 0, that is (t − ${n(r1)})(t − ${n(r2)}) = 0, so t = ${n(r1)} or t = ${n(r2)}.` },
    { prompt: `Work out the positions s(${n(r1)}) and s(${n(r2)}).`, answer: [s1, s2], explanation: `s(${n(r1)}) = ${term(r1)} = ${n(s1)} and s(${n(r2)}) = ${term(r2)} = ${n(s2)}.` },
    { prompt: 'What is the average velocity between the two turns: the change in position divided by the time between them?', answer: [avg], explanation: `(${n(s2)} − ${par(s1)}) ÷ ${n(d)} = ${n(s2 - s1)} ÷ ${n(d)} = ${n(avg)} metres per second.` }
   ] };
 }
});

/* ---- q17 Review: the derivative of a polynomial model ---- */
const cubicArith = (p, q, r, d, t) => [p === 1 ? n(t ** 3) : `${n(p)} × ${n(t ** 3)}`, `${par(q)} × ${n(t * t)}`, `${par(r)} × ${n(t)}`].concat(d ? [n(d)] : []).join(' + ');
const cubicAt = (p, q, r, d, t) => p * t ** 3 + q * t * t + r * t + d;

practice({
 id: 'q17b', parent: 'q17', kind: 'setting',
 title: 'Forecasting the tyre temperature',
 brief: 'A rover’s front tyre heats up during a lap test, and the crew want its rate, how that rate is changing, and a quick forecast for the next minute.',
 labels: ['rate (degrees per minute)', 'second derivative', 'forecast (degrees)'], tolerance: 0.01
}, [['rate (degrees per minute)'], ['second derivative'], ['forecast (degrees)']], {
 /* Not the q17 worked example (t³ − 4t + 6 at t = 1). */
 canonical: { p: 1, q: -6, r: 15, d: 30, t0: 3 },
 /* The temperature stays positive from the start to one minute past t0, the rate is not 0 or ±1 and at most
    25 degrees per minute in size, and the tyre and its forecast stay at or below 130 degrees. */
 draw: R => { let o; do { o = { p: R.int(1, 2), q: -R.int(2, 9), r: R.int(2, 20), d: R.int(20, 40), t0: R.int(2, 4) }; } while ((() => { for (let t = 0; t <= o.t0 + 1; t++) { const Tv = cubicAt(o.p, o.q, o.r, o.d, t); if (Tv <= 0 || Tv > 130) return true; } const T1 = 3 * o.p * o.t0 * o.t0 + 2 * o.q * o.t0 + o.r, F = cubicAt(o.p, o.q, o.r, o.d, o.t0) + T1; return Math.abs(T1) <= 1 || Math.abs(T1) > 25 || F <= 0 || F > 130; })()); return o; },
 build: ({ p, q, r, d, t0 }) => {
  const T = poly([[p, 't³'], [q, 't²'], [r, 't'], [d, '']]), Tt = cubicAt(p, q, r, d, t0), T1 = 3 * p * t0 * t0 + 2 * q * t0 + r, T2 = 6 * p * t0 + 2 * q, F = Tt + T1;
  const d1 = poly([[3 * p, 't²'], [2 * q, 't'], [r, '']]), d2 = poly([[6 * p, 't'], [2 * q, '']]);
  return {
   prompt: `During a lap test the temperature of a rover’s front tyre is modelled by T(t) = ${T} degrees, t minutes after the start. At t = ${n(t0)}, enter the rate T′(${n(t0)}) in degrees per minute, then the second derivative T″(${n(t0)}). Then use the tangent line at t = ${n(t0)} to forecast the temperature one minute later, at t = ${n(t0 + 1)}.`,
   answer: [T1, T2, F],
   hints: ['Differentiate T(t) term by term for T′(t), and once more for T″(t).', `The tangent-line forecast starts from the temperature T(${n(t0)}) and adds the rate T′(${n(t0)}) for each minute ahead.`],
   solution: `T′(t) = ${d1}, so T′(${n(t0)}) = ${n(3 * p)} × ${n(t0 * t0)} + ${par(2 * q)} × ${n(t0)} + ${n(r)} = ${n(T1)} degrees per minute. T″(t) = ${d2}, so T″(${n(t0)}) = ${n(6 * p)} × ${n(t0)} + ${par(2 * q)} = ${n(T2)}. The tyre is at T(${n(t0)}) = ${cubicArith(p, q, r, d, t0)} = ${n(Tt)} degrees, and the tangent line changes by ${n(T1)} degrees for each minute, so one minute later it forecasts ${n(Tt)} + ${par(T1)} = ${n(F)} degrees.`,
   guidance: [
    { prompt: `Differentiate T(t) = ${T} term by term. What is T′(${n(t0)})?`, answer: [T1], explanation: `T′(t) = ${d1}, so T′(${n(t0)}) = ${n(3 * p)} × ${n(t0 * t0)} + ${par(2 * q)} × ${n(t0)} + ${n(r)} = ${n(T1)}.` },
    { prompt: 'Differentiate T′(t) again. What is the second derivative at the same time?', answer: [T2], explanation: `T″(t) = ${d2}, so T″(${n(t0)}) = ${n(6 * p)} × ${n(t0)} + ${par(2 * q)} = ${n(T2)}.` },
    { prompt: `The tyre is at T(${n(t0)}) = ${n(Tt)} degrees. What temperature does the tangent line forecast at t = ${n(t0 + 1)}?`, answer: [F], explanation: `One minute at ${n(T1)} degrees per minute: ${n(Tt)} + ${par(T1)} = ${n(F)} degrees.` }
   ] };
 }
});

practice({
 id: 'q17c', parent: 'q17', kind: 'applied',
 title: 'When the rover reaches the marker',
 brief: 'A camera has to be rolling before a rover reaches a marker on the track, and the crew time it with a straight-line forecast.',
 labels: ['position (m)', 'speed (m/s)', 'forecast time (s)'], tolerance: 0.01
}, [['position (m)'], ['speed (m/s)'], ['forecast time (s)']], {
 canonical: { p: 1, q: -3, r: 5, d: 2, t0: 2, h: 2 },
 /* The forecast reaches the marker h = 2 to 4 seconds after t0, so every answer is a whole number. The position at
    t0 is positive and the speed there 2 to 40 m/s. */
 draw: R => { let o; do { o = { p: R.int(1, 2), q: -R.int(1, 8), r: R.int(3, 20), d: R.int(0, 10), t0: R.int(1, 4), h: R.int(2, 4) }; } while (cubicAt(o.p, o.q, o.r, o.d, o.t0) <= 0 || (v => v < 2 || v > 40)(3 * o.p * o.t0 * o.t0 + 2 * o.q * o.t0 + o.r)); return o; },
 build: ({ p, q, r, d, t0, h }) => {
  const s = poly([[p, 't³'], [q, 't²'], [r, 't'], [d, '']]), st = cubicAt(p, q, r, d, t0), v = 3 * p * t0 * t0 + 2 * q * t0 + r, M = st + v * h, rem = M - st, T = t0 + h;
  return {
   prompt: `A camera must be rolling before a rover reaches the ${n(M)} metre marker on the test track. The rover’s position is s(t) = ${s} metres from the start line, t seconds after the start. At t = ${n(t0)} the crew switch to a straight-line forecast: the tangent line at t = ${n(t0)}. Enter the rover’s position at t = ${n(t0)} in metres, its rate s′(${n(t0)}) in metres per second, then the time in seconds at which the forecast says it reaches the marker.`,
   answer: [st, v, T],
   hints: [`The tangent line starts at the rover’s position at t = ${n(t0)} and gains s′(${n(t0)}) metres each second.`, `Work out how many metres are left to the marker, divide by the rate, and add the result to ${n(t0)}.`],
   solution: `The position is s(${n(t0)}) = ${cubicArith(p, q, r, d, t0)} = ${n(st)} metres. The derivative is s′(t) = ${poly([[3 * p, 't²'], [2 * q, 't'], [r, '']])}, so s′(${n(t0)}) = ${n(3 * p)} × ${n(t0 * t0)} + ${par(2 * q)} × ${n(t0)} + ${n(r)} = ${n(v)} metres per second. The forecast line gains ${n(v)} metres each second from ${n(st)} metres. The marker is ${n(M)} − ${n(st)} = ${n(rem)} metres ahead, which takes ${n(rem)} ÷ ${n(v)} = ${n(h)} seconds, so the forecast reaches it at t = ${n(t0)} + ${n(h)} = ${n(T)} seconds.`,
   guidance: [
    { prompt: `Where is the rover at t = ${n(t0)}? Work out s(${n(t0)}).`, answer: [st], explanation: `s(${n(t0)}) = ${cubicArith(p, q, r, d, t0)} = ${n(st)} metres.` },
    { prompt: `Differentiate s(t) term by term. What is s′(${n(t0)})?`, answer: [v], explanation: `s′(t) = ${poly([[3 * p, 't²'], [2 * q, 't'], [r, '']])}, so s′(${n(t0)}) = ${n(3 * p)} × ${n(t0 * t0)} + ${par(2 * q)} × ${n(t0)} + ${n(r)} = ${n(v)} metres per second.` },
    { prompt: `The forecast gains ${n(v)} metres each second from ${n(st)} metres. At what time does it reach ${n(M)} metres?`, answer: [T], explanation: `${n(rem)} metres are left, which takes ${n(rem)} ÷ ${n(v)} = ${n(h)} seconds: the forecast reaches the marker at t = ${n(T)}.` }
   ] };
 }
});

practice({
 id: 'q17d', parent: 'q17', kind: 'challenge',
 title: 'How far off is the forecast',
 brief: 'The track crew want to know how far a sprint rover runs ahead of their straight-line forecast a few seconds later.',
 labels: ['rate (m/s)', 'second derivative', 'true minus forecast (m)'], tolerance: 0.01
}, [['rate (m/s)', 'second derivative'], ['position (m)', 'forecast (m)'], ['true position (m)', 'true minus forecast (m)']], {
 canonical: { p: 2, q: -7, r: 4, d: 25, t0: 4, h: 2 },
 /* Larger coefficients than the parent and a look-ahead of 2 or 3 seconds. The gap s(t0 + h) − forecast is
    p(3t0h² + h³) + qh² = s″(t0)h² ÷ 2 + ph³; s″(t0) is kept positive, the rate at most 45 m/s, the gap at most 150 m,
    positions below 1000. */
 draw: R => { let o; do { o = { p: R.int(2, 4), q: -R.int(3, 12), r: R.nz(-10, 10), d: R.int(10, 60), t0: R.int(2, 4), h: R.int(2, 3) }; } while ((() => { const { p, q, r, d, t0, h } = o, d1 = 3 * p * t0 * t0 + 2 * q * t0 + r, st = cubicAt(p, q, r, d, t0), tr = cubicAt(p, q, r, d, t0 + h), fc = st + d1 * h; return Math.abs(d1) <= 1 || Math.abs(d1) > 45 || tr - fc > 150 || 6 * p * t0 + 2 * q < 2 || st < 2 || fc < 2 || tr < 2 || [st, fc, tr].some(x => x >= 1000); })()); return o; },
 build: ({ p, q, r, d, t0, h }) => {
  const s = poly([[p, 't³'], [q, 't²'], [r, 't'], [d, '']]), st = cubicAt(p, q, r, d, t0), d1 = 3 * p * t0 * t0 + 2 * q * t0 + r, d2 = 6 * p * t0 + 2 * q, t1 = t0 + h, tr = cubicAt(p, q, r, d, t1), fc = st + d1 * h, err = tr - fc;
  return {
   prompt: `A sprint rover’s position on the test track is s(t) = ${s} metres, t seconds after the start. The crew forecast where it will be ${n(h)} seconds after t = ${n(t0)} using the tangent line at t = ${n(t0)}. Enter s′(${n(t0)}) in metres per second, then s″(${n(t0)}), then how many metres the true position s(${n(t1)}) is ahead of the forecast.`,
   answer: [d1, d2, err],
   hints: [`Differentiate twice. The tangent-line forecast for t = ${n(t1)} is s(${n(t0)}) + s′(${n(t0)}) × ${n(h)}.`, `Work out the true position s(${n(t1)}) from the model, then subtract the forecast.`],
   solution: `s′(t) = ${poly([[3 * p, 't²'], [2 * q, 't'], [r, '']])}, so s′(${n(t0)}) = ${n(3 * p)} × ${n(t0 * t0)} + ${par(2 * q)} × ${n(t0)} + ${par(r)} = ${n(d1)} metres per second. s″(t) = ${poly([[6 * p, 't'], [2 * q, '']])}, so s″(${n(t0)}) = ${n(6 * p)} × ${n(t0)} + ${par(2 * q)} = ${n(d2)}. The rover is at s(${n(t0)}) = ${n(st)}, so the tangent line forecasts ${n(st)} + ${par(d1)} × ${n(h)} = ${n(fc)} metres at t = ${n(t1)}. The model gives s(${n(t1)}) = ${cubicArith(p, q, r, d, t1)} = ${n(tr)}, which is ${n(tr)} − ${par(fc)} = ${n(err)} metres ahead of the forecast. The second derivative is positive there, so the rate keeps rising and the straight line falls behind.`,
   guidance: [
    { prompt: `Differentiate s(t) = ${s} twice. Enter s′(${n(t0)}), then s″(${n(t0)}).`, answer: [d1, d2], explanation: `s′(t) = ${poly([[3 * p, 't²'], [2 * q, 't'], [r, '']])} gives ${n(d1)}, and s″(t) = ${poly([[6 * p, 't'], [2 * q, '']])} gives ${n(d2)}.` },
    { prompt: `Work out s(${n(t0)}), then the forecast s(${n(t0)}) + s′(${n(t0)}) × ${n(h)} for t = ${n(t1)}.`, answer: [st, fc], explanation: `s(${n(t0)}) = ${cubicArith(p, q, r, d, t0)} = ${n(st)}, and the forecast is ${n(st)} + ${par(d1)} × ${n(h)} = ${n(fc)}.` },
    { prompt: `Work out the true position s(${n(t1)}), then how far it is ahead of the forecast.`, answer: [tr, err], explanation: `s(${n(t1)}) = ${cubicArith(p, q, r, d, t1)} = ${n(tr)}, and ${n(tr)} − ${par(fc)} = ${n(err)} metres.` }
   ] };
 }
});

/* ---- q18 Product rule ---- */
practice({
 id: 'q18b', parent: 'q18', kind: 'setting',
 title: 'Power on the warming drive shaft',
 brief: 'A drive shaft’s torque falls while its spin rate climbs during warm-up, and the shop needs to know how fast the delivered power is changing.',
 labels: ['power (W)', 'rate (W/s)'], tolerance: 0.01
}, [['torque (N·m)', 'spin rate (rad/s)'], ['torque rate', 'spin-rate rate'], ['rate (W/s)']], {
 /* Not the q18 worked example ((x + 1)(x² + 3) at 1). */
 canonical: { A: 30, B: 2, c: 1, d: 4, t0: 3 },
 /* Torque A − Bt stays at least 5 at t0; the rate is never 0 or ±1. */
 draw: R => { let o; do { o = { A: R.int(20, 60), B: R.int(2, 5), c: R.int(1, 3), d: R.int(2, 9), t0: R.int(1, 4) }; } while ((() => { const tq = o.A - o.B * o.t0, w = o.c * o.t0 * o.t0 + o.d, dP = -o.B * w + tq * 2 * o.c * o.t0; return tq < 5 || Math.abs(dP) <= 1; })()); return o; },
 build: ({ A, B, c, d, t0 }) => {
  const tq = A - B * t0, w = c * t0 * t0 + d, P = tq * w, dw = 2 * c * t0, dP = -B * w + tq * dw;
  const Tq = poly([[A, ''], [-B, 't']]), W = poly([[c, 't²'], [d, '']]), wAt = `${c === 1 ? '' : n(c) + ' × '}${n(t0 * t0)} + ${n(d)}`;
  return {
   prompt: `A drive shaft in the machine shop is warming up. Its torque is T(t) = ${Tq} newton-metres and its spin rate is w(t) = ${W} radians per second, t seconds after switch-on. The power it delivers is the product P(t) = T(t) × w(t) watts. Enter P(${n(t0)}), then the rate P′(${n(t0)}) in watts per second found with the product rule (type them without commas).`,
   answer: [P, dP],
   hints: [`Call the factors u = T(t) and v = w(t). Work out u, v, u′ and v′ at t = ${n(t0)}. The torque is falling, so its derivative is negative.`, 'The product rule: P′ = u′v + uv′. Each derivative is multiplied by the other factor.'],
   solution: `At t = ${n(t0)}: the torque is ${n(A)} − ${n(B)} × ${n(t0)} = ${n(tq)} and the spin rate is ${wAt} = ${n(w)}, so P(${n(t0)}) = ${n(tq)} × ${n(w)} = ${n(P)} watts. The derivatives: the torque has u′ = ${n(-B)}, and the spin rate has v′ = ${poly([[2 * c, 't']])}, which is ${n(dw)} at t = ${n(t0)}. By the product rule P′(${n(t0)}) = u′v + uv′ = ${par(-B)} × ${n(w)} + ${n(tq)} × ${n(dw)} = ${n(-B * w)} + ${n(tq * dw)} = ${n(dP)} watts per second.`,
   guidance: [
    { prompt: `What are the torque u = ${Tq} and the spin rate v = ${W} at t = ${n(t0)}?`, answer: [tq, w], explanation: `u = ${n(A)} − ${n(B)} × ${n(t0)} = ${n(tq)} and v = ${wAt} = ${n(w)}, so P(${n(t0)}) = ${n(tq)} × ${n(w)} = ${n(P)}.` },
    { prompt: `Differentiate each factor: what are u′ and v′ at t = ${n(t0)}?`, answer: [-B, dw], explanation: `u′ = ${n(-B)}, the slope of ${Tq}, and v′ = ${poly([[2 * c, 't']])}, which is ${n(dw)} at t = ${n(t0)}.` },
    { prompt: 'Combine with the product rule: P′ = u′v + uv′. What is the rate of change of the power?', answer: [dP], explanation: `${par(-B)} × ${n(w)} + ${n(tq)} × ${n(dw)} = ${n(-B * w)} + ${n(tq * dw)} = ${n(dP)} watts per second.` }
   ] };
 }
});

practice({
 id: 'q18c', parent: 'q18', kind: 'applied',
 title: 'The plate between the rollers',
 brief: 'A hot plate grows longer and narrower as it passes through the rollers, and the shop wants to know when its area stops growing.',
 labels: ['area rate (cm² per minute)', 'time area stops growing (min)'], tolerance: 0.01
}, [['length (cm)', 'width (cm)'], ['area rate (cm² per minute)'], ['time (min)']], {
 canonical: { a: 3, m: 10, b: 2, T: 5, t0: 1 },
 /* Length a·m + at, width b(2T + m) − bt, so A′(t) = 2ab(T − t): the area stops growing at t = T, with the width
    still b(T + m) > 0. Both rates are at least 2 cm per minute, and t0 comes before T. */
 draw: R => { const T = R.int(4, 9); return { a: R.int(2, 4), m: R.int(6, 14), b: R.int(2, 3), T, t0: R.int(1, T - 2) }; },
 build: ({ a, m, b, T, t0 }) => {
  const L0 = a * m, W0 = b * (2 * T + m), L = L0 + a * t0, W = W0 - b * t0, rate = a * W - b * L, K = a * W0 - b * L0;
  return {
   prompt: `A hot steel plate is passing slowly through the rollers in the machine shop. It starts ${n(L0)} cm long and ${n(W0)} cm wide; each minute its length grows by ${n(a)} cm while its width shrinks by ${n(b)} cm. At first its area grows, but later it shrinks. With t counted in minutes since the plate entered the rollers, enter how fast the area is changing at t = ${n(t0)}, in square centimetres per minute, then the time in minutes at which the area stops growing.`,
   answer: [rate, T],
   hints: ['Write the length L(t) and the width W(t) as formulas in t. The area is the product L(t) × W(t), so use the product rule: A′ = L′W + LW′.', 'The area stops growing when A′(t) = 0. Write A′(t) as a formula in t and solve.'],
   solution: `The length is L(t) = ${poly([[L0, ''], [a, 't']])} and the width is W(t) = ${poly([[W0, ''], [-b, 't']])}, so L′ = ${n(a)} and W′ = ${n(-b)}. At t = ${n(t0)}: L = ${n(L)} and W = ${n(W)}, and by the product rule A′(${n(t0)}) = L′W + LW′ = ${n(a)} × ${n(W)} + ${n(L)} × ${par(-b)} = ${n(a * W)} − ${n(b * L)} = ${n(rate)} square centimetres per minute. In general A′(t) = ${n(a)}(${poly([[W0, ''], [-b, 't']])}) − ${n(b)}(${poly([[L0, ''], [a, 't']])}) = ${poly([[K, ''], [-2 * a * b, 't']])}, which is zero when t = ${n(K)} ÷ ${n(2 * a * b)} = ${n(T)} minutes. After that the area shrinks.`,
   guidance: [
    { prompt: `What are the length and the width of the plate at t = ${n(t0)}?`, answer: [L, W], explanation: `L = ${n(L0)} + ${n(a)} × ${n(t0)} = ${n(L)} cm and W = ${n(W0)} − ${n(b)} × ${n(t0)} = ${n(W)} cm.` },
    { prompt: `The length changes by L′ = ${n(a)} and the width by W′ = ${n(-b)} cm per minute. Use the product rule: what is A′ = L′W + LW′ at t = ${n(t0)}?`, answer: [rate], explanation: `${n(a)} × ${n(W)} + ${n(L)} × ${par(-b)} = ${n(a * W)} − ${n(b * L)} = ${n(rate)} square centimetres per minute.` },
    { prompt: `Written as a formula, A′(t) = ${n(a)}(${poly([[W0, ''], [-b, 't']])}) − ${n(b)}(${poly([[L0, ''], [a, 't']])}). At what time is it zero?`, answer: [T], explanation: `A′(t) = ${poly([[K, ''], [-2 * a * b, 't']])}, which is zero when t = ${n(K)} ÷ ${n(2 * a * b)} = ${n(T)} minutes.` }
   ] };
 }
});

practice({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q13',
 title: 'Straight edge on the bracket',
 brief: 'A steel rule has to lie along the tangent to a cast bracket’s curved edge, and the edge’s formula is a product of two factors.',
 labels: ['y at the point (cm)', 'slope', 'y-intercept (cm)'], tolerance: 0.01
}, [['u', 'v'], ['slope'], ['y-intercept (cm)']], {
 canonical: { q: -3, r: 2, s: 1, x0: 3 },
 /* y = (x² + q)(rx + s) at x0 = 1 to 3; neither factor is 0 there and the slope is not 0. */
 draw: R => { let o; do { o = { q: R.nz(-8, 8), r: R.int(2, 4), s: R.nz(-6, 6), x0: R.int(1, 3) }; } while ((() => { const u = o.x0 * o.x0 + o.q, v = o.r * o.x0 + o.s; return u === 0 || v === 0 || 2 * o.x0 * v + u * o.r === 0; })()); return o; },
 build: ({ q, r, s, x0 }) => {
  const U = poly([[1, 'x²'], [q, '']]), V = poly([[r, 'x'], [s, '']]), u = x0 * x0 + q, v = r * x0 + s, y = u * v, du = 2 * x0, m = du * v + u * r, k = y - m * x0;
  return {
   prompt: `A cast bracket in the machine shop has an edge that follows y = (${U})(${V}), with x and y in centimetres. A straight steel rule must lie along the tangent line to the edge at x = ${n(x0)}. Enter y at x = ${n(x0)}, then the slope of the tangent line, found with the product rule, then its y-intercept, so that the rule lies along y = (slope)x + (intercept).`,
   answer: [y, m, k],
   hints: ['Call the factors u and v. The tangent line passes through the point of the edge at that x, and its slope is u′v + uv′ there.', 'Once you have the slope, choose the intercept so that the line passes through the point: intercept = y − slope × x.'],
   solution: `At x = ${n(x0)}: u = ${addOn(n(x0 * x0), q)} = ${n(u)} and v = ${addOn(`${n(r)} × ${n(x0)}`, s)} = ${n(v)}, so y = ${n(u)} × ${n(v)} = ${n(y)}. The derivatives: u′ = 2x, which is ${n(du)} at x = ${n(x0)}, and v′ = ${n(r)}. By the product rule the slope is u′v + uv′ = ${n(du)} × ${par(v)} + ${par(u)} × ${n(r)} = ${n(m)}. The tangent line y = ${poly([[m, 'x']])} + k passes through (${n(x0)}, ${n(y)}), so k = ${n(y)} − ${par(m)} × ${n(x0)} = ${n(k)}, and the rule lies along y = ${poly([[m, 'x'], [k, '']])}.`,
   guidance: [
    { prompt: `The factors are u = ${U} and v = ${V}. What are u and v at x = ${n(x0)}?`, answer: [u, v], explanation: `u = ${addOn(n(x0 * x0), q)} = ${n(u)} and v = ${addOn(`${n(r)} × ${n(x0)}`, s)} = ${n(v)}, so y = ${n(u)} × ${n(v)} = ${n(y)}.` },
    { prompt: `u′ = 2x and v′ = ${n(r)}. What is the slope u′v + uv′ at x = ${n(x0)}?`, answer: [m], explanation: `${n(du)} × ${par(v)} + ${par(u)} × ${n(r)} = ${n(du * v)} + ${par(u * r)} = ${n(m)}.` },
    { prompt: `The tangent line y = ${poly([[m, 'x']])} + k passes through (${n(x0)}, ${n(y)}). What is k?`, answer: [k], explanation: `${n(y)} = ${n(m)} × ${n(x0)} + k, so k = ${n(y)} − ${par(m * x0)} = ${n(k)}.` }
   ] };
 }
});

/* ---- q19 Quotient rule ---- */
practice({
 id: 'q19b', parent: 'q19', kind: 'setting',
 title: 'Average minutes per milled part',
 brief: 'A milling batch spreads its setting-up time over every part, and the shop wants to know how fast the average time per part falls as batches grow.',
 labels: ['average time (min per part)', 'rate of change'], tolerance: 0.005
}, [['total time (min)', 'average time (min per part)'], ['f′g − fg′'], ['rate of change']], {
 /* Not the q19 worked example (x ÷ (x + 1) at 1). */
 canonical: { a: 6, b: 40, x0: 5 },
 /* M(x) = (ax + b) ÷ x; M′ = −b ÷ x². x0 is 2, 4, 5, 10 or 20, and for 4 and 20 the setting-up time b is a multiple of
    4, so both answers have at most two decimals. */
 draw: R => { const x0 = R.pick([2, 4, 5, 10, 20]), b = (x0 === 4 || x0 === 20) ? 4 * R.int(3, 15) : R.int(10, 60); return { a: R.int(2, 9), b: b === x0 * x0 ? b + 4 : b, x0 }; },
 build: ({ a, b, x0 }) => {
  const F = a * x0 + b, M = G.tidy(F / x0), dM = G.tidy(-b / (x0 * x0));
  return {
   prompt: `A milling machine needs ${n(b)} minutes of setting up before a batch, then ${n(a)} minutes for each part. Making x parts in one batch takes ${n(a)}x + ${n(b)} minutes in all, so the average time per part is M(x) = (${n(a)}x + ${n(b)}) ÷ x minutes. Enter M(${n(x0)}), the average for a batch of ${n(x0)} parts, then the rate of change M′(${n(x0)}) found with the quotient rule. Both are exact decimals.`,
   answer: [M, dM],
   hints: [`Call the top f = ${n(a)}x + ${n(b)} and the bottom g = x. Work out f, g, f′ and g′ at x = ${n(x0)}.`, 'The quotient rule: M′ = (f′g − fg′) ÷ g². A negative rate means the average time per part falls as the batch grows.'],
   solution: `At x = ${n(x0)}: f = ${n(a)} × ${n(x0)} + ${n(b)} = ${n(F)} and g = ${n(x0)}, so M(${n(x0)}) = ${n(F)} ÷ ${n(x0)} = ${n(M)} minutes per part. The derivatives are f′ = ${n(a)} and g′ = 1. By the quotient rule M′(${n(x0)}) = (${n(a)} × ${n(x0)} − ${n(F)} × 1) ÷ ${n(x0)}² = ${n(-b)} ÷ ${n(x0 * x0)} = ${n(dM)} minutes per part for each extra part. It is negative: each extra part spreads the setting-up time more thinly.`,
   guidance: [
    { prompt: `What is the total time f = ${n(a)}x + ${n(b)} for x = ${n(x0)}, and the average M(${n(x0)}) = f ÷ ${n(x0)}?`, answer: [F, M], explanation: `f = ${n(a)} × ${n(x0)} + ${n(b)} = ${n(F)} minutes, and ${n(F)} ÷ ${n(x0)} = ${n(M)} minutes per part.` },
    { prompt: `With f′ = ${n(a)}, g = ${n(x0)} and g′ = 1, work out the top of the quotient rule, f′g − fg′.`, answer: [-b], explanation: `${n(a)} × ${n(x0)} − ${n(F)} × 1 = ${n(a * x0)} − ${n(F)} = ${n(-b)}.` },
    { prompt: `Divide by g² = ${n(x0)}². What is M′(${n(x0)})?`, answer: [dM], explanation: `${n(-b)} ÷ ${n(x0 * x0)} = ${n(dM)}.` }
   ] };
 }
});

practice({
 id: 'q19c', parent: 'q19', kind: 'applied',
 title: 'Additive in the coolant tank',
 brief: 'Additive is being fed into the machine shop’s coolant tank, and the shop needs to know how soon it reaches its upper limit.',
 labels: ['concentration (g/L)', 'rate (g/L per minute)', 'minutes to limit'], tolerance: 0.005
}, [['concentration (g/L)'], ['rate (g/L per minute)'], ['minutes to limit']], {
 canonical: { V0: 40, r: 2, m: 50, t0: 5, h: 5 },
 /* c(t) = mt ÷ (V0 + rt), c′(t) = mV0 ÷ (V0 + rt)². The volume at t0 is 20, 25, 40, 50 or 100 litres; draws are kept
    only when c(t0) has at most one decimal, c′(t0) at most two, and the limit c + c′h at most one. */
 draw: R => { for (;;) { const Gv = R.pick([20, 25, 40, 50, 100]), t0 = R.int(2, 10), r = R.int(2, 5), V0 = Gv - r * t0, m = 5 * R.int(2, 20), h = R.int(2, 10); if (V0 < 10) continue; const c = m * t0 / Gv, dc = m * V0 / (Gv * Gv); if (dec(c) <= 1 && dec(dc) <= 2 && dec(c + dc * h) <= 1 && dc >= 0.1 && ![c, dc, G.tidy(dc * h)].includes(1)) return { V0, r, m, t0, h }; } },
 build: ({ V0, r, m, t0, h }) => {
  const Gv = V0 + r * t0, F = m * t0, c = G.tidy(F / Gv), N = m * Gv - F * r, dc = G.tidy(N / (Gv * Gv)), L = G.tidy(c + dc * h), gap = G.tidy(L - c);
  return {
   prompt: `The machine shop’s coolant tank starts with ${n(V0)} litres of plain water. A feed pipe then adds ${n(r)} litres of liquid each minute, carrying ${n(m)} grams of additive each minute. After t minutes the concentration is c(t) = ${n(m)}t ÷ (${n(V0)} + ${n(r)}t) grams per litre, and it must not go above ${n(L)} grams per litre. Enter c(${n(t0)}), then the rate c′(${n(t0)}) in grams per litre per minute, found with the quotient rule. Then, if the concentration kept rising at that rate, how many more minutes would it take to reach the limit?`,
   answer: [c, dc, h],
   hints: [`Call the top f = ${n(m)}t and the bottom g = ${n(V0)} + ${n(r)}t, so f′ = ${n(m)} and g′ = ${n(r)}.`, 'At a steady rate, the time left is the gap to the limit divided by the rate.'],
   solution: `At t = ${n(t0)}: f = ${n(m)} × ${n(t0)} = ${n(F)} grams and g = ${n(V0)} + ${n(r)} × ${n(t0)} = ${n(Gv)} litres, so c(${n(t0)}) = ${n(F)} ÷ ${n(Gv)} = ${n(c)} grams per litre. With f′ = ${n(m)} and g′ = ${n(r)}, the quotient rule gives c′(${n(t0)}) = (${n(m)} × ${n(Gv)} − ${n(F)} × ${n(r)}) ÷ ${n(Gv)}² = ${n(N)} ÷ ${n(Gv * Gv)} = ${n(dc)} grams per litre per minute. The limit is ${n(L)} − ${n(c)} = ${n(gap)} grams per litre away, and at ${n(dc)} per minute that takes ${n(gap)} ÷ ${n(dc)} = ${n(h)} minutes.`,
   guidance: [
    { prompt: `How much additive and how much liquid are in the tank at t = ${n(t0)}? Divide them: what is c(${n(t0)})?`, answer: [c], explanation: `${n(m)} × ${n(t0)} = ${n(F)} grams in ${n(V0)} + ${n(r)} × ${n(t0)} = ${n(Gv)} litres: ${n(F)} ÷ ${n(Gv)} = ${n(c)} grams per litre.` },
    { prompt: `Use the quotient rule with f′ = ${n(m)} and g′ = ${n(r)}: what is c′(${n(t0)}) = (f′g − fg′) ÷ g²?`, answer: [dc], explanation: `(${n(m)} × ${n(Gv)} − ${n(F)} × ${n(r)}) ÷ ${n(Gv * Gv)} = ${n(N)} ÷ ${n(Gv * Gv)} = ${n(dc)}.` },
    { prompt: `The limit is ${n(L)} grams per litre. At a steady ${n(dc)} grams per litre each minute, how many minutes until it is reached?`, answer: [h], explanation: `The gap is ${n(L)} − ${n(c)} = ${n(gap)}, and ${n(gap)} ÷ ${n(dc)} = ${n(h)} minutes.` }
   ] };
 }
});

practice({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q18',
 title: 'Throughput of the punch press',
 brief: 'A punch press is scored by a ratio whose top is itself a product, and the shop wants the score’s rate of change at one setting.',
 labels: ['score', 'rate of change'], tolerance: 0.005
}, [['top f', 'score'], ['f′'], ['rate of change']], {
 canonical: { a: 2, b: 1, d: 4, c: 3, x0: 2 },
 /* R(x) = (ax + b)(x + d) ÷ (x + c) with x0 + c in {2, 5, 10}, so both answers have at most two decimals; the
    top of the quotient rule is never 0. */
 draw: R => { let o; do { const g = R.pick([2, 5, 10]), x0 = R.int(1, g - 1); o = { a: R.int(2, 4), b: R.int(1, 6), d: R.int(1, 6), c: g - x0, x0 }; } while ((() => { const { a, b, d, c, x0 } = o, u = a * x0 + b, w = x0 + d; return (a * w + u) * (x0 + c) - u * w === 0; })()); return o; },
 build: ({ a, b, d, c, x0 }) => {
  const Uf = poly([[a, 'x'], [b, '']]), u = a * x0 + b, w = x0 + d, F = u * w, Fp = a * w + u, g = x0 + c, E = G.tidy(F / g), N = Fp * g - F, dE = G.tidy(N / (g * g));
  return {
   prompt: `The machine shop scores a punch press by the ratio R(x) = (${Uf})(x + ${n(d)}) ÷ (x + ${n(c)}), where x is the press setting. The top of the ratio is itself a product. Enter the score R(${n(x0)}), then its rate of change R′(${n(x0)}). Both are exact decimals.`,
   answer: [E, dE],
   hints: ['The top f = (' + Uf + `)(x + ${n(d)}) is a product: find f′ with the product rule first.`, `Then use the quotient rule: R′ = (f′g − fg′) ÷ g², with g = x + ${n(c)} and g′ = 1.`],
   solution: `The top is f = (${Uf})(x + ${n(d)}). At x = ${n(x0)} its factors are ${n(u)} and ${n(w)}, so f = ${n(u)} × ${n(w)} = ${n(F)}. By the product rule f′ = ${n(a)} × (x + ${n(d)}) + (${Uf}) × 1, which at x = ${n(x0)} is ${n(a)} × ${n(w)} + ${n(u)} = ${n(Fp)}. The bottom g = x + ${n(c)} is ${n(g)} at x = ${n(x0)}, with g′ = 1. So R(${n(x0)}) = ${n(F)} ÷ ${n(g)} = ${n(E)}, and by the quotient rule R′(${n(x0)}) = (${n(Fp)} × ${n(g)} − ${n(F)} × 1) ÷ ${n(g)}² = ${n(N)} ÷ ${n(g * g)} = ${n(dE)}.`,
   guidance: [
    { prompt: `What is the top f = (${Uf})(x + ${n(d)}) at x = ${n(x0)}, and the score R(${n(x0)}) = f ÷ (x + ${n(c)})?`, answer: [F, E], explanation: `f = ${n(u)} × ${n(w)} = ${n(F)}, and ${n(F)} ÷ ${n(g)} = ${n(E)}.` },
    { prompt: `Use the product rule on the top: what is f′ at x = ${n(x0)}?`, answer: [Fp], explanation: `f′ = ${n(a)} × (x + ${n(d)}) + (${Uf}) × 1 = ${n(a)} × ${n(w)} + ${n(u)} = ${n(Fp)}.` },
    { prompt: `Now the quotient rule with g = ${n(g)} and g′ = 1: what is R′(${n(x0)}) = (f′g − fg′) ÷ g²?`, answer: [dE], explanation: `(${n(Fp)} × ${n(g)} − ${n(F)} × 1) ÷ ${n(g * g)} = ${n(N)} ÷ ${n(g * g)} = ${n(dE)}.` }
   ] };
 }
});

/* ---- q20 Chain rule ---- */
practice({
 id: 'q20b', parent: 'q20', kind: 'setting',
 title: 'Milling down the cube block',
 brief: 'A cube-shaped block is being milled down evenly on every face, and the shop wants to know how fast its volume is shrinking.',
 labels: ['side (cm)', 'volume rate (cm³ per minute)'], tolerance: 0.01
}, [['side (cm)'], ['outer derivative'], ['volume rate (cm³ per minute)']], {
 /* Not the q20 worked example ((2x + 1)² at 3). */
 canonical: { b: 12, a: 2, t0: 3 },
 /* Side b − at, still 2 to 12 cm at t0; the volume rate −3a·side² stays above −1300. */
 draw: R => { const a = R.int(1, 3), t0 = R.int(1, 4), s = R.int(2, 12); return { b: s + a * t0, a, t0 }; },
 build: ({ b, a, t0 }) => {
  const inner = poly([[b, ''], [-a, 't']]), s = b - a * t0, O = 3 * s * s, Vp = -a * O;
  return {
   prompt: `A cube-shaped block is being milled down evenly on every face. Its side is s(t) = ${inner} centimetres, t minutes after milling starts, so its volume is V(t) = (${inner})³ cubic centimetres. Enter the side length at t = ${n(t0)}, then V′(${n(t0)}) found with the chain rule, in cubic centimetres per minute (type it without commas).`,
   answer: [s, Vp],
   hints: [`The inner function is the side, ${inner}; the outer function is “cube it”. Work out the side at t = ${n(t0)} first.`, 'The chain rule: the outer derivative 3s², taken at the current side, times the derivative of the side. The block is shrinking, so expect a negative rate.'],
   solution: `At t = ${n(t0)} the side is ${n(b)} − ${a === 1 ? '' : n(a) + ' × '}${n(t0)} = ${n(s)} cm. The outer function s³ has derivative 3s², which is 3 × ${n(s)}² = ${n(O)} at s = ${n(s)}. The inner function ${inner} has derivative ${n(-a)}. By the chain rule V′(${n(t0)}) = ${n(O)} × ${par(-a)} = ${n(Vp)} cubic centimetres per minute: the volume is shrinking.`,
   guidance: [
    { prompt: `What is the side ${inner} at t = ${n(t0)}?`, answer: [s], explanation: `${n(b)} − ${a === 1 ? '' : n(a) + ' × '}${n(t0)} = ${n(s)} cm.` },
    { prompt: `The outer function s³ has derivative 3s². What is it at s = ${n(s)}?`, answer: [O], explanation: `3 × ${n(s)}² = 3 × ${n(s * s)} = ${n(O)}.` },
    { prompt: `The side changes by ${n(-a)} cm each minute. Multiply: what is V′(${n(t0)})?`, answer: [Vp], explanation: `${n(O)} × ${par(-a)} = ${n(Vp)} cubic centimetres per minute. The minus sign says the volume is shrinking.` }
   ] };
 }
});

practice({
 id: 'q20c', parent: 'q20', kind: 'applied',
 title: 'Before the grinder trips',
 brief: 'A grinding wheel draws power faster and faster as it spins up, and the shop must know when the breaker will trip.',
 labels: ['power rate (W/s)', 'trip time (s)'], tolerance: 0.01
}, [['spin rate (rev/s)'], ['power rate (W/s)'], ['trip time (s)']], {
 canonical: { a: 3, b: 4, c: 2, t0: 2, T: 6 },
 /* P(t) = c(at + b)², P′(t) = 2ca(at + b), which reaches the limit 2ca(aT + b) at t = T, 2 to 10 seconds after t0. */
 draw: R => { const t0 = R.int(2, 4); return { a: R.int(2, 5), b: R.int(2, 10), c: R.int(2, 5), t0, T: t0 + R.int(2, 10) }; },
 build: ({ a, b, c, t0, T }) => {
  const inner = poly([[a, 't'], [b, '']]), w0 = a * t0 + b, O = 2 * c * w0, rate = O * a, K = 2 * c * a, Lim = K * (a * T + b), W = a * T + b;
  return {
   prompt: `A grinding wheel in the machine shop spins up after switch-on. Its spin rate is w(t) = ${inner} revolutions per second, t seconds after switch-on, and the power it draws is ${n(c)}w² watts, so P(t) = ${n(c)}(${inner})². The breaker trips when the power is rising at ${n(Lim)} watts per second. Enter P′(${n(t0)}), the rate at which the power is rising at t = ${n(t0)}, in watts per second, then the time in seconds at which the breaker trips (type them without commas).`,
   answer: [rate, T],
   hints: [`Inner function: the spin rate w(t). Outer function: ${n(c)}w², with derivative ${n(2 * c)}w. Multiply by the inner derivative.`, 'Do the same with t left as a letter to get P′(t), set it equal to the trip rate, and solve for t.'],
   solution: `At t = ${n(t0)} the spin rate is w = ${n(a)} × ${n(t0)} + ${n(b)} = ${n(w0)}. The outer function ${n(c)}w² has derivative ${n(2 * c)}w, which is ${n(2 * c)} × ${n(w0)} = ${n(O)} at w = ${n(w0)}, and the inner function has derivative ${n(a)}. By the chain rule P′(${n(t0)}) = ${n(O)} × ${n(a)} = ${n(rate)} watts per second. In general P′(t) = ${n(2 * c)}(${inner}) × ${n(a)} = ${n(K)}(${inner}). It reaches ${n(Lim)} when ${inner} = ${n(Lim)} ÷ ${n(K)} = ${n(W)}, that is when ${n(a)}t = ${n(W - b)}, at t = ${n(T)} seconds.`,
   guidance: [
    { prompt: `What is the spin rate w(${n(t0)})?`, answer: [w0], explanation: `${n(a)} × ${n(t0)} + ${n(b)} = ${n(w0)} revolutions per second.` },
    { prompt: `The outer derivative is ${n(2 * c)}w and the inner derivative is ${n(a)}. What is P′(${n(t0)})?`, answer: [rate], explanation: `${n(2 * c)} × ${n(w0)} × ${n(a)} = ${n(O)} × ${n(a)} = ${n(rate)} watts per second.` },
    { prompt: `In general P′(t) = ${n(K)}(${inner}). At what time does it reach ${n(Lim)}?`, answer: [T], explanation: `${inner} = ${n(Lim)} ÷ ${n(K)} = ${n(W)}, so ${n(a)}t = ${n(W - b)} and t = ${n(T)} seconds.` }
   ] };
 }
});

practice({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q18',
 title: 'Heat from the loaded bearing',
 brief: 'A bearing’s heat output is a product with a squared bracket in it, and the shop wants to know how fast it rises with the load.',
 labels: ['heat output (W)', 'rate (W per unit of load)'], tolerance: 0.01
}, [['inner value', 'heat output (W)'], ['derivative of the square'], ['rate (W per unit of load)']], {
 canonical: { p: 2, a: 3, b: -1, x0: 2 },
 /* H(x) = (x + p)(ax + b)²; H′ = (ax + b)² + (x + p) × 2(ax + b) × a. The inner value is at least 2. */
 draw: R => { let o; do { o = { p: R.int(1, 6), a: R.int(2, 4), b: R.nz(-6, 6), x0: R.int(1, 3) }; } while (o.a * o.x0 + o.b < 2); return o; },
 build: ({ p, a, b, x0 }) => {
  const inner = poly([[a, 'x'], [b, '']]), g = x0 + p, U = a * x0 + b, V = U * U, F = g * V, Vp = 2 * U * a, Fp = V + g * Vp;
  return {
   prompt: `A bearing in the machine shop gives off heat at H(x) = (x + ${n(p)})(${inner})² watts when it carries load x. Enter H(${n(x0)}), then the rate H′(${n(x0)}) in watts per unit of load (type them without commas).`,
   answer: [F, Fp],
   hints: [`H is a product of u = x + ${n(p)} and v = (${inner})². Use the product rule: H′ = u′v + uv′.`, 'v is a square of an inner function, so its derivative needs the chain rule: 2 times the inner value, times the inner derivative.'],
   solution: `At x = ${n(x0)}: u = ${n(x0)} + ${n(p)} = ${n(g)}, and the inner value is ${addOn(`${n(a)} × ${n(x0)}`, b)} = ${n(U)}, so v = ${n(U)}² = ${n(V)} and H(${n(x0)}) = ${n(g)} × ${n(V)} = ${n(F)} watts. The derivatives: u′ = 1, and by the chain rule v′ = 2 × ${n(U)} × ${n(a)} = ${n(Vp)}. By the product rule H′(${n(x0)}) = u′v + uv′ = 1 × ${n(V)} + ${n(g)} × ${n(Vp)} = ${n(Fp)} watts per unit of load.`,
   guidance: [
    { prompt: `What is the inner value ${inner} at x = ${n(x0)}, and H(${n(x0)})?`, answer: [U, F], explanation: `${addOn(`${n(a)} × ${n(x0)}`, b)} = ${n(U)}, so H(${n(x0)}) = (${n(x0)} + ${n(p)}) × ${n(U)}² = ${n(g)} × ${n(V)} = ${n(F)}.` },
    { prompt: `Use the chain rule on v = (${inner})²: outer derivative 2 × (inner value), times the inner derivative ${n(a)}. What is v′ at x = ${n(x0)}?`, answer: [Vp], explanation: `2 × ${n(U)} × ${n(a)} = ${n(Vp)}.` },
    { prompt: `Now the product rule: H′ = u′v + uv′ with u = ${n(g)}, u′ = 1, v = ${n(V)} and v′ = ${n(Vp)}. What is H′(${n(x0)})?`, answer: [Fp], explanation: `1 × ${n(V)} + ${n(g)} × ${n(Vp)} = ${n(V)} + ${n(g * Vp)} = ${n(Fp)}.` }
   ] };
 }
});
})();
