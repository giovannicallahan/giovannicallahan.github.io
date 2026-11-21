/* Calculus 1 practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions". The worked sample is q01b in practice-1.js.
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored text exactly. Oracles: qa/realms/calc1/oracle-p8.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* Registers a mission whose prompt, answers, hints, solution and guided steps are build(canonical), so the authored
   text and the generator cannot drift apart. meta = {id, parent, kind, title, brief, labels, tolerance, uses?};
   stepLabels = the labels of each guided step, in order. */
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(G.tidy), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(G.tidy), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* A coefficient in front of a power: co(1, 't²') is "t²", co(3, 't²') is "3t²" (no written-out 1). */
const co = (k, v) => (k === 1 ? '' : n(k)) + v;
/* "0, 2, 4 and 6" */
const list = xs => xs.length < 2 ? xs.map(n).join('') : xs.slice(0, -1).map(n).join(', ') + ' and ' + n(xs[xs.length - 1]);
/* "150 − 20" or "150 + 20": a start plus a signed change. */
const addSigned = (a, d) => `${n(a)} ${plus(d).replace(/^(.)/, '$1 ')}`;
const sum = xs => xs.reduce((s, x) => s + x, 0);

/* ---- q36 Initial value problems ---- */
practice({
 id: 'q36b', parent: 'q36', kind: 'setting',
 title: 'The skiff along the dam wall',
 brief: 'A crew skiff is working along the dam wall, and the reservoir crew wants to know where it will be from its speed and one buoy sighting.',
 labels: ['constant C (m)', 'distance at the later time (m)'], tolerance: 0.01
}, [['p', 'q'], ['C (m)'], ['distance (m)']], {
 /* Not the q36 worked example (6t + 2, 5 m at t = 0) and not the parent's numbers (4t + 3, 50 cm at t = 2). */
 canonical: { k: 8, b: 5, t1: 3, P: 70, T: 7 },
 /* v(t) = kt + b with k even, so s(t) = (k/2)t² + bt + C has whole coefficients; C is 5 to 40 m, so the skiff starts
    out from the marker side, and the later time is 2 to 4 minutes after the sighting. */
 draw: R => { let k, b; do { k = R.pick([4, 6, 8]); b = R.int(2, 9); } while (k === 6 && b === 2);
  const a = k / 2, t1 = R.int(1, 3), C = R.int(5, 40); return { k, b, t1, P: a * t1 * t1 + b * t1 + C, T: t1 + R.int(2, 4) }; },
 build: ({ k, b, t1, P, T }) => { const a = k / 2, g1 = a * t1 * t1 + b * t1, C = P - g1, sT = a * T * T + b * T + C; return {
  prompt: `A crew skiff sets off along the dam wall, moving away from the spillway marker with velocity v(t) = ${n(k)}t + ${n(b)} metres per minute, t minutes after it casts off. At t = ${n(t1)} it passes a buoy ${n(P)} m from the marker. Its distance from the marker, s(t), is an antiderivative of v(t) plus a constant C. Enter C, then the skiff’s distance from the marker at t = ${n(T)}, in metres.`,
  answer: [C, sT],
  hints: ['Velocity is the derivative of position, so s(t) is an antiderivative of v(t): raise each power of t by one and divide by the new power, then add + C.', `The buoy sighting says s(${n(t1)}) = ${n(P)}. The skiff was not at the marker at t = 0, so C is the sighting minus what the t-terms add up to by t = ${n(t1)}.`],
  solution: `Position is an antiderivative of velocity. An antiderivative of ${n(k)}t + ${n(b)} is ${n(a)}t² + ${n(b)}t, so s(t) = ${n(a)}t² + ${n(b)}t + C. At t = ${n(t1)}: ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} + C = ${n(P)}, so ${n(g1)} + C = ${n(P)} and C = ${n(C)}. Then s(${n(T)}) = ${n(a)} × ${n(T * T)} + ${n(b)} × ${n(T)} + ${n(C)} = ${n(a * T * T)} + ${n(b * T)} + ${n(C)} = ${n(sT)} metres from the marker.`,
  guidance: [
   { prompt: `The derivative of pt² + qt is 2pt + q. Which p and q make it equal to v(t) = ${n(k)}t + ${n(b)}?`, answer: [a, b], explanation: `2p = ${n(k)}, so p = ${n(a)}, and q = ${n(b)}. So s(t) = ${n(a)}t² + ${n(b)}t + C.` },
   { prompt: `At t = ${n(t1)} the skiff is ${n(P)} m from the marker. What is C?`, answer: [C], explanation: `${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} = ${n(g1)}, so ${n(g1)} + C = ${n(P)} and C = ${n(P)} − ${n(g1)} = ${n(C)}.` },
   { prompt: `Now s(t) = ${n(a)}t² + ${n(b)}t + ${n(C)}. How far from the marker is the skiff at t = ${n(T)}?`, answer: [sT], explanation: `s(${n(T)}) = ${n(a)} × ${n(T * T)} + ${n(b)} × ${n(T)} + ${n(C)} = ${n(a * T * T)} + ${n(b * T)} + ${n(C)} = ${n(sT)} metres.` }
  ] }; }
});

practice({
 id: 'q36c', parent: 'q36', kind: 'applied',
 title: 'Will the treatment tank overflow?',
 brief: 'A treatment tank is filling at a rising rate, and the filter house must know how much room is left when the valve shuts.',
 labels: ['volume when the valve closes (L)', 'room left (L)'], tolerance: 0.01
}, [['C (L)'], ['volume (L)'], ['room left (L)']], {
 canonical: { k: 6, b: 12, t1: 2, P: 186, T: 8, Cap: 600 },
 /* V(t) = (k/2)t² + bt + C with C a whole number of tens from 100 to 400 litres (the tank was part full); the valve
    closes 3 to 6 minutes after the reading, and the tank's capacity is 100 to 400 litres (in hundreds) above it. */
 draw: R => { const a = R.int(2, 5), b = R.int(5, 20), t1 = R.int(2, 4), C = 10 * R.int(10, 40), T = t1 + R.int(3, 6);
  const VT = a * T * T + b * T + C; return { k: 2 * a, b, t1, P: a * t1 * t1 + b * t1 + C, T, Cap: 100 * (Math.floor(VT / 100) + R.int(1, 4)) }; },
 build: ({ k, b, t1, P, T, Cap }) => { const a = k / 2, g1 = a * t1 * t1 + b * t1, C = P - g1, VT = a * T * T + b * T + C, room = Cap - VT; return {
  prompt: `The filter house is filling a treatment tank that holds ${n(Cap)} litres when full. Water enters at r(t) = ${n(k)}t + ${n(b)} litres per minute, t minutes after the valve opens, and the tank was already part full when it opened. At t = ${n(t1)} the tank holds ${n(P)} litres. The valve closes at t = ${n(T)}. Enter the volume in the tank when the valve closes, then how much room is left in the tank at that moment, both in litres (type them without commas).`,
  answer: [VT, room],
  hints: [`The volume V(t) is an antiderivative of the inflow rate plus a constant C. Use the reading at t = ${n(t1)} to fix C before you look ahead.`, 'The room left is the volume of the full tank minus the volume when the valve closes.'],
  solution: `An antiderivative of ${n(k)}t + ${n(b)} is ${n(a)}t² + ${n(b)}t, so V(t) = ${n(a)}t² + ${n(b)}t + C. At t = ${n(t1)}: ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} + C = ${n(P)}, so ${n(g1)} + C = ${n(P)} and C = ${n(C)}. When the valve closes, V(${n(T)}) = ${n(a)} × ${n(T * T)} + ${n(b)} × ${n(T)} + ${n(C)} = ${n(a * T * T)} + ${n(b * T)} + ${n(C)} = ${n(VT)} litres. The full tank holds ${n(Cap)} litres, so ${n(Cap)} − ${n(VT)} = ${n(room)} litres of room are left, and the tank does not overflow.`,
  guidance: [
   { prompt: `Write V(t) = ${n(a)}t² + ${n(b)}t + C, an antiderivative of the rate plus a constant. The tank holds ${n(P)} litres at t = ${n(t1)}. What is C?`, answer: [C], explanation: `${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} = ${n(g1)}, so ${n(g1)} + C = ${n(P)} and C = ${n(P)} − ${n(g1)} = ${n(C)} litres.` },
   { prompt: `With V(t) = ${n(a)}t² + ${n(b)}t + ${n(C)}, how much water is in the tank at t = ${n(T)}?`, answer: [VT], explanation: `V(${n(T)}) = ${n(a * T * T)} + ${n(b * T)} + ${n(C)} = ${n(VT)} litres.` },
   { prompt: `The full tank holds ${n(Cap)} litres. How much room is left when the valve closes?`, answer: [room], explanation: `${n(Cap)} − ${n(VT)} = ${n(room)} litres, so the tank is safe from overflowing.` }
  ] }; }
});

practice({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q16',
 title: 'From the survey boat’s acceleration',
 brief: 'The survey boat’s log records only its acceleration, one speed and one position, and the crew wants to know where it will be.',
 labels: ['constant C₁ (m/min)', 'constant C₂ (m)', 'distance at the later time (m)'], tolerance: 0.01
}, [['C₁ (m/min)'], ['C₂ (m)'], ['distance (m)']], {
 canonical: { A: 12, t1: 2, V1: 29, t2: 1, S2: 27, T: 5 },
 /* a(t) = At with A = 6k, so v(t) = 3kt² + C₁ and s(t) = kt³ + C₁t + C₂ have whole coefficients. C₁ is 2 to 12 and
    C₂ is 5 to 40, so the boat always moves away from the station; the later time is at least 2 minutes after the
    position reading and at most 6, so the distance stays below 600 m. */
 draw: R => { const k = R.int(1, 2), t1 = R.int(1, 3), C1 = R.int(2, 12), t2 = R.int(1, 3), C2 = R.int(5, 40), T = R.int(Math.max(4, t2 + 2), 6);
  return { A: 6 * k, t1, V1: 3 * k * t1 * t1 + C1, t2, S2: k * t2 ** 3 + C1 * t2 + C2, T }; },
 build: ({ A, t1, V1, t2, S2, T }) => { const k = A / 6, K = 3 * k, C1 = V1 - K * t1 * t1, g2 = k * t2 ** 3 + C1 * t2, C2 = S2 - g2, sT = k * T ** 3 + C1 * T + C2; return {
  prompt: `A survey boat heads straight out across the reservoir from the shore station, speeding up as it goes. Its acceleration is a(t) = ${n(A)}t metres per minute per minute, t minutes after a timer starts. At t = ${n(t1)} its velocity is ${n(V1)} metres per minute, and at t = ${n(t2)} it is ${n(S2)} m from the station. Its velocity v(t) is an antiderivative of a(t) plus a constant C₁, and its distance s(t) from the station is an antiderivative of v(t) plus a constant C₂. Enter C₁, then C₂, then the boat’s distance from the station at t = ${n(T)}, in metres.`,
  answer: [C1, C2, sT],
  hints: [`Acceleration is the derivative of velocity, so v(t) = ${n(K)}t² + C₁. Fix C₁ with the velocity at t = ${n(t1)} first.`, `Then s(t) = ${co(k, 't³')} + C₁t + C₂. Put in the value of C₁ you found and fix C₂ with the distance at t = ${n(t2)}.`],
  solution: `Velocity is an antiderivative of acceleration: an antiderivative of ${n(A)}t is ${n(K)}t², so v(t) = ${n(K)}t² + C₁. At t = ${n(t1)}: ${n(K)} × ${n(t1 * t1)} + C₁ = ${n(V1)}, so C₁ = ${n(V1)} − ${n(K * t1 * t1)} = ${n(C1)}. Position is an antiderivative of velocity: an antiderivative of ${n(K)}t² + ${n(C1)} is ${co(k, 't³')} + ${n(C1)}t, so s(t) = ${co(k, 't³')} + ${n(C1)}t + C₂. At t = ${n(t2)}: ${n(k)} × ${n(t2 ** 3)} + ${n(C1)} × ${n(t2)} + C₂ = ${n(S2)}, so ${n(g2)} + C₂ = ${n(S2)} and C₂ = ${n(C2)}. Then s(${n(T)}) = ${n(k)} × ${n(T ** 3)} + ${n(C1)} × ${n(T)} + ${n(C2)} = ${n(k * T ** 3)} + ${n(C1 * T)} + ${n(C2)} = ${n(sT)} metres from the station.`,
  guidance: [
   { prompt: `v(t) = ${n(K)}t² + C₁, and the velocity at t = ${n(t1)} is ${n(V1)} metres per minute. What is C₁?`, answer: [C1], explanation: `${n(K)} × ${n(t1 * t1)} = ${n(K * t1 * t1)}, so ${n(K * t1 * t1)} + C₁ = ${n(V1)} and C₁ = ${n(C1)}. So v(t) = ${n(K)}t² + ${n(C1)}.` },
   { prompt: `An antiderivative of ${n(K)}t² + ${n(C1)} is ${co(k, 't³')} + ${n(C1)}t, so s(t) = ${co(k, 't³')} + ${n(C1)}t + C₂. The boat is ${n(S2)} m out at t = ${n(t2)}. What is C₂?`, answer: [C2], explanation: `${n(k)} × ${n(t2 ** 3)} + ${n(C1)} × ${n(t2)} = ${n(g2)}, so ${n(g2)} + C₂ = ${n(S2)} and C₂ = ${n(S2)} − ${n(g2)} = ${n(C2)}.` },
   { prompt: `Now s(t) = ${co(k, 't³')} + ${n(C1)}t + ${n(C2)}. How far from the station is the boat at t = ${n(T)}?`, answer: [sT], explanation: `s(${n(T)}) = ${n(k * T ** 3)} + ${n(C1 * T)} + ${n(C2)} = ${n(sT)} metres.` }
  ] }; }
});

/* ---- q37 Riemann sums ---- */
practice({
 id: 'q37b', parent: 'q37', kind: 'setting',
 title: 'Tallying the spillway runoff',
 brief: 'After a storm the spillway’s flow is slowing, and the crew needs an estimate of how much water it has carried off.',
 labels: ['width Δt (h)', 'left-endpoint estimate (kL)', 'right-endpoint estimate (kL)'], tolerance: 0.01
}, [['width Δt (h)'], ['sum of the heights (kL/h)', 'left-endpoint estimate (kL)'], ['sum of the heights (kL/h)', 'right-endpoint estimate (kL)']], {
 canonical: { a: 2, c: 150, w: 2, k: 4 },
 /* r(t) = c − at² falls over [0, kw]; c is 4 to 40 above a(kw)², so the flow is still positive at the end. The width
    is at least 2 hours, so "1 hours" never appears. */
 draw: R => { const [w, k] = R.pick([[2, 3], [2, 4], [3, 3]]), a = R.int(1, 3), T = w * k; return { a, c: a * T * T + R.int(4, 40), w, k }; },
 build: ({ a, c, w, k }) => { const T = k * w, ts = Array.from({ length: k + 1 }, (_, i) => i * w), hs = ts.map(t => c - a * t * t);
  const left = hs.slice(0, k), right = hs.slice(1), sL = sum(left), sR = sum(right), L = w * sL, Rr = w * sR; return {
  prompt: `After a storm the reservoir’s spillway carries water away at r(t) = ${n(c)} − ${co(a, 't²')} kilolitres per hour, t hours after the gates open, slowing as the level drops. Estimate the water carried away from t = 0 to t = ${n(T)} hours with ${n(k)} rectangles of equal width. Enter the width of each rectangle in hours, then the left-endpoint estimate, then the right-endpoint estimate, both in kilolitres (type them without commas).`,
  answer: [w, L, Rr],
  hints: ['The width is the length of the whole interval divided by the number of rectangles.', 'Work out the rate at every endpoint first. The left sum uses all of them except the last; the right sum uses all except the first. Multiply each sum of heights by the width.'],
  solution: `Each rectangle is ${n(T)} ÷ ${n(k)} = ${n(w)} hours wide. The rates at t = ${list(ts)} are ${list(hs)} kilolitres per hour. The left-endpoint sum uses the first ${n(k)} of them: ${n(w)} × (${left.map(n).join(' + ')}) = ${n(w)} × ${n(sL)} = ${n(L)} kilolitres. The right-endpoint sum uses the last ${n(k)}: ${n(w)} × (${right.map(n).join(' + ')}) = ${n(w)} × ${n(sR)} = ${n(Rr)} kilolitres. The flow falls over the interval, so this time the left sum is too high and the right sum too low; the true amount lies between them.`,
  guidance: [
   { prompt: `The ${n(T)} hours from t = 0 to t = ${n(T)} are cut into ${n(k)} rectangles of equal width. What is the width Δt?`, answer: [w], explanation: `Δt = (${n(T)} − 0) ÷ ${n(k)} = ${n(w)} hours.` },
   { prompt: `The left endpoints are t = ${list(ts.slice(0, k))}. What are the sum of the rates there and the left-endpoint estimate?`, answer: [sL, L], explanation: `The rates are ${list(left)}, which add to ${n(sL)}. Times the width: ${n(w)} × ${n(sL)} = ${n(L)} kilolitres.` },
   { prompt: `The right endpoints are t = ${list(ts.slice(1))}. What are the sum of the rates there and the right-endpoint estimate?`, answer: [sR, Rr], explanation: `The rates are ${list(right)}, which add to ${n(sR)}. Times the width: ${n(w)} × ${n(sR)} = ${n(Rr)} kilolitres.` }
  ] }; }
});

practice({
 id: 'q37c', parent: 'q37', kind: 'applied',
 title: 'Five readings from the feed canal',
 brief: 'The feed canal’s meter was read only every few minutes, and the reservoir log needs one figure for the water that came in.',
 labels: ['left-endpoint estimate (L)', 'right-endpoint estimate (L)', 'logged estimate (L)'], tolerance: 0.01
}, [['sum of the heights (L/min)', 'left-endpoint estimate (L)'], ['sum of the heights (L/min)', 'right-endpoint estimate (L)'], ['logged estimate (L)']], {
 canonical: { w: 10, h0: 24, h1: 30, h2: 41, h3: 47, h4: 60 },
 /* Five rising readings, 2 to 15 apart, taken 5 or 10 minutes apart; every estimate is a whole number of litres or
    ends in .5. */
 draw: R => { const h0 = R.int(20, 40), h1 = h0 + R.int(2, 15), h2 = h1 + R.int(2, 15), h3 = h2 + R.int(2, 15), h4 = h3 + R.int(2, 15); return { w: R.pick([5, 10]), h0, h1, h2, h3, h4 }; },
 build: ({ w, h0, h1, h2, h3, h4 }) => { const hs = [h0, h1, h2, h3, h4], ts = hs.map((_, i) => i * w), left = hs.slice(0, 4), right = hs.slice(1), sL = sum(left), sR = sum(right), L = w * sL, Rr = w * sR, avg = (L + Rr) / 2; return {
  prompt: `The flow meter on the reservoir’s feed canal is read every ${n(w)} minutes. At t = ${list(ts)} minutes it shows ${list(hs)} litres per minute. There is no formula for the flow, so the crew treats the readings as the heights of rectangles to find how much water came in from t = 0 to t = ${n(4 * w)}. Enter the left-endpoint estimate, then the right-endpoint estimate, then their average, which goes in the log as the best estimate, all in litres (type them without commas).`,
  answer: [L, Rr, avg],
  hints: [`Each rectangle is ${n(w)} minutes wide. The left-endpoint sum uses the reading at the start of each ${n(w)}-minute stretch; the right-endpoint sum uses the reading at its end.`, 'Add the heights, multiply by the width, and then average the two estimates: add them and halve.'],
  solution: `There are 4 rectangles, each ${n(w)} minutes wide. The left-endpoint sum uses the readings ${list(left)}: ${n(w)} × (${left.map(n).join(' + ')}) = ${n(w)} × ${n(sL)} = ${n(L)} litres. The right-endpoint sum uses ${list(right)}: ${n(w)} × (${right.map(n).join(' + ')}) = ${n(w)} × ${n(sR)} = ${n(Rr)} litres. The flow rose at every reading, so the true amount lies between the two, and the log takes their average: (${n(L)} + ${n(Rr)}) ÷ 2 = ${n(avg)} litres.`,
  guidance: [
   { prompt: `The left endpoints are the first four readings, ${list(left)}. What are their sum and the left-endpoint estimate?`, answer: [sL, L], explanation: `${left.map(n).join(' + ')} = ${n(sL)}. Times the width: ${n(w)} × ${n(sL)} = ${n(L)} litres.` },
   { prompt: `The right endpoints are the last four readings, ${list(right)}. What are their sum and the right-endpoint estimate?`, answer: [sR, Rr], explanation: `${right.map(n).join(' + ')} = ${n(sR)}. Times the width: ${n(w)} × ${n(sR)} = ${n(Rr)} litres.` },
   { prompt: `The log takes the average of ${n(L)} and ${n(Rr)}. What is it?`, answer: [avg], explanation: `(${n(L)} + ${n(Rr)}) ÷ 2 = ${n(L + Rr)} ÷ 2 = ${n(avg)} litres.` }
  ] }; }
});

practice({
 id: 'q37d', parent: 'q37', kind: 'challenge',
 title: 'Half-hour strips on the dredge log',
 brief: 'The silt dredge speeds up through its shift, and the crew wants a fenced-in estimate of the silt it lifted in one stretch.',
 labels: ['width Δt (h)', 'left-endpoint estimate (kg)', 'right-endpoint estimate (kg)', 'gap between the estimates (kg)'], tolerance: 0.01
}, [['width Δt (h)'], ['sum of the heights (kg/h)', 'left-endpoint estimate (kg)'], ['sum of the heights (kg/h)', 'right-endpoint estimate (kg)'], ['gap (kg)']], {
 canonical: { a: 4, b: 6, c: 15, s: 1, k: 6 },
 /* r(t) = at² + bt + c with a = 4 or 8 and b even, so the rate at every half hour is a whole number and every
    estimate ends in .0 or .5. The stretch starts at t = 1, 2 or 3 and is 2 or 3 hours long (4 or 6 strips of half an
    hour); every estimate stays below 1000. */
 draw: R => ({ a: R.pick([4, 8]), b: R.pick([2, 4, 6]), c: R.int(5, 30), s: R.int(1, 3), k: R.pick([4, 6]) }),
 build: ({ a, b, c, s, k }) => { const w = 0.5, E = s + k * w, ts = Array.from({ length: k + 1 }, (_, i) => s + i * w), hs = ts.map(t => a * t * t + b * t + c);
  const left = hs.slice(0, k), right = hs.slice(1), sL = sum(left), sR = sum(right), L = w * sL, Rr = w * sR, gap = Rr - L; return {
  prompt: `The silt dredge on the reservoir bed lifts silt at r(t) = ${n(a)}t² + ${n(b)}t + ${n(c)} kilograms per hour, t hours into its shift, working faster as it goes. Estimate the silt it lifts between t = ${n(s)} and t = ${n(E)} with ${n(k)} rectangles of equal width. Enter the width of each rectangle in hours, then the left-endpoint estimate and the right-endpoint estimate in kilograms, then the gap between the two estimates, which is the most either can be off by.`,
  answer: [w, L, Rr, gap],
  hints: [`Find the length of the stretch from t = ${n(s)} to t = ${n(E)} first. The left endpoints start at t = ${n(s)}, not at 0.`, 'The rate rises, so the true amount lies between the left and right sums; the gap is the right sum minus the left sum.'],
  solution: `The stretch is ${n(E)} − ${n(s)} = ${n(E - s)} hours, so each rectangle is ${n(E - s)} ÷ ${n(k)} = ${n(w)} hours wide. The rates at t = ${list(ts)} are ${list(hs)} kilograms per hour. The left-endpoint sum uses the first ${n(k)}: ${n(w)} × (${left.map(n).join(' + ')}) = ${n(w)} × ${n(sL)} = ${n(L)} kilograms. The right-endpoint sum uses the last ${n(k)}: ${n(w)} × (${right.map(n).join(' + ')}) = ${n(w)} × ${n(sR)} = ${n(Rr)} kilograms. The rate rises all through the stretch, so the true amount lies between them, and neither estimate is off by more than ${n(Rr)} − ${n(L)} = ${n(gap)} kilograms.`,
  guidance: [
   { prompt: `The stretch from t = ${n(s)} to t = ${n(E)} is cut into ${n(k)} rectangles of equal width. What is the width Δt?`, answer: [w], explanation: `Δt = (${n(E)} − ${n(s)}) ÷ ${n(k)} = ${n(E - s)} ÷ ${n(k)} = ${n(w)} hours.` },
   { prompt: `The left endpoints are t = ${list(ts.slice(0, k))}. What are the sum of the rates there and the left-endpoint estimate?`, answer: [sL, L], explanation: `The rates are ${list(left)}, which add to ${n(sL)}. Times the width: ${n(w)} × ${n(sL)} = ${n(L)} kilograms.` },
   { prompt: `The right endpoints are t = ${list(ts.slice(1))}. What are the sum of the rates there and the right-endpoint estimate?`, answer: [sR, Rr], explanation: `The rates are ${list(right)}, which add to ${n(sR)}. Times the width: ${n(w)} × ${n(sR)} = ${n(Rr)} kilograms.` },
   { prompt: `What is the gap between the right-endpoint and left-endpoint estimates?`, answer: [gap], explanation: `${n(Rr)} − ${n(L)} = ${n(gap)} kilograms. It is also the width times the difference of the last and first rates, ${n(w)} × (${n(hs[k])} − ${n(hs[0])}), because the two sums share every height except the first and the last.` }
  ] }; }
});

/* ---- q38 The definite integral as signed area ---- */
practice({
 id: 'q38b', parent: 'q38', kind: 'setting',
 title: 'The morning dip in the level',
 brief: 'The reservoir level falls while the town draws its morning water and then recovers, and the crew wants the overall change.',
 labels: ['area below the axis', 'area above the axis', 'definite integral (cm)'], tolerance: 0.01
}, [['crossing time t (h)'], ['area below', 'area above'], ['definite integral (cm)']], {
 canonical: { b: 3, B: 12, T: 7 },
 /* r(t) = bt − B is zero at t0 = B ÷ b, a whole number of hours, and the interval runs m hours past it with m ≠ t0, so
    the integral is not 0. Areas are whole numbers or end in .5. */
 draw: R => { let b, t0, m; do { b = R.int(2, 5); t0 = R.int(2, 6); m = R.int(1, 4); } while (m === t0); return { b, B: b * t0, T: t0 + m }; },
 build: ({ b, B, T }) => { const t0 = B / b, m = T - t0, hT = b * m, down = t0 * B / 2, up = m * hT / 2, I = up - down; return {
  prompt: `Through the morning the town draws water faster than the streams bring it in, and then the inflow takes over. The reservoir’s level changes at r(t) = ${n(b)}t − ${n(B)} centimetres per hour, t hours after 6 a.m.: negative while the level falls, positive once it rises. Find the definite integral ∫ from 0 to ${n(T)} of (${n(b)}t − ${n(B)}) dt from areas. Enter the area of the triangle below the axis, then the area of the triangle above it, both as positive numbers, then the definite integral, which is the change in level in centimetres.`,
  answer: [down, up, I],
  hints: [`Find when ${n(b)}t − ${n(B)} = 0. Before that time the line is below the axis; after it, above.`, 'Each region is a triangle: half its base times its height. This time the first triangle is the one below the axis, and it counts as negative.'],
  solution: `The rate is zero when ${n(b)}t = ${n(B)}, at t = ${n(t0)}. From t = 0 to t = ${n(t0)} the graph and the axis enclose a triangle below the axis with base ${n(t0)} and height ${n(B)} (r(0) is ${n(-B)}): its area is ${n(t0)} × ${n(B)} ÷ 2 = ${n(down)}. From t = ${n(t0)} to t = ${n(T)} they enclose a triangle above the axis with base ${n(m)} and height ${n(hT)}: its area is ${n(m)} × ${n(hT)} ÷ 2 = ${n(up)}. The definite integral is the area above minus the area below: ${n(up)} − ${n(down)} = ${n(I)}, so over the ${n(T)} hours the level ${I < 0 ? 'fell' : 'rose'} ${n(Math.abs(I))} centimetres.`,
  guidance: [
   { prompt: `At what time t is the rate ${n(b)}t − ${n(B)} equal to zero?`, answer: [t0], explanation: `${n(b)}t = ${n(B)} gives t = ${n(B)} ÷ ${n(b)} = ${n(t0)}. Before then the graph is below the axis, after it above.` },
   { prompt: `What are the areas of the triangle below the axis, from t = 0 to t = ${n(t0)}, and of the triangle above it, from t = ${n(t0)} to t = ${n(T)}?`, answer: [down, up], explanation: `Below: base ${n(t0)}, height ${n(B)}, area ${n(t0)} × ${n(B)} ÷ 2 = ${n(down)}. Above: base ${n(m)}, height r(${n(T)}) = ${n(hT)}, area ${n(m)} × ${n(hT)} ÷ 2 = ${n(up)}.` },
   { prompt: 'The definite integral is the area above the axis minus the area below it. What is it?', answer: [I], explanation: `${n(up)} − ${n(down)} = ${n(I)}. ${I < 0 ? 'It is negative: the level ended lower than it started.' : 'It is positive: the level ended higher than it started.'}` }
  ] }; }
});

practice({
 id: 'q38c', parent: 'q38', kind: 'applied',
 title: 'The two-way pump’s meter',
 brief: 'A reversible pump fed the overflow tank and then pumped some back, and the crew must square the pipe meter with the tank.',
 labels: ['water through the meter (kL)', 'overall gain (kL)'], tolerance: 0.01
}, [['crossing time t (h)'], ['area above', 'area below'], ['water through the meter (kL)', 'overall gain (kL)']], {
 canonical: { b: 4, B: 20, T: 7 },
 /* r(t) = B − bt is zero at t0 = B ÷ b, and the pump runs m hours past it with m < t0, so the tank gains overall. */
 draw: R => { const b = R.int(2, 5), t0 = R.int(3, 6), m = R.int(1, t0 - 1); return { b, B: b * t0, T: t0 + m }; },
 build: ({ b, B, T }) => { const t0 = B / b, m = T - t0, hT = b * m, up = t0 * B / 2, down = m * hT / 2, total = up + down, I = up - down; return {
  prompt: `A reversible pump links the reservoir to its overflow tank. Its flow into the tank is r(t) = ${n(B)} − ${n(b)}t kilolitres per hour, t hours after it starts; a negative flow means it is pumping water back out. It runs until t = ${n(T)}. The meter on the pipe counts every kilolitre that passes through it, in either direction. Enter the meter’s count, then how much water the tank gained overall, both in kilolitres.`,
  answer: [total, I],
  hints: ['Find when the flow is zero. The graph is a straight line, so on each side of that time the region between the graph and the axis is a triangle.', 'The meter counts both triangles as water moved. The tank’s overall gain is the definite integral, which counts the water pumped back out as negative.'],
  solution: `The flow is zero when ${n(b)}t = ${n(B)}, at t = ${n(t0)}. Up to then the triangle above the axis has base ${n(t0)} and height ${n(B)}, so ${n(t0)} × ${n(B)} ÷ 2 = ${n(up)} kilolitres went into the tank. After it the triangle below the axis has base ${n(m)} and height ${n(hT)}, so ${n(m)} × ${n(hT)} ÷ 2 = ${n(down)} kilolitres were pumped back. The meter counts both: ${n(up)} + ${n(down)} = ${n(total)} kilolitres. The tank’s gain is the definite integral ∫ from 0 to ${n(T)} of (${n(B)} − ${n(b)}t) dt, the area above minus the area below: ${n(up)} − ${n(down)} = ${n(I)} kilolitres.`,
  guidance: [
   { prompt: `At what time t does the flow ${n(B)} − ${n(b)}t change direction?`, answer: [t0], explanation: `${n(B)} − ${n(b)}t = 0 gives t = ${n(B)} ÷ ${n(b)} = ${n(t0)} hours. Before then water goes into the tank; after it, back out.` },
   { prompt: `What are the areas of the triangle above the axis, from t = 0 to t = ${n(t0)}, and of the triangle below it, from t = ${n(t0)} to t = ${n(T)}?`, answer: [up, down], explanation: `Above: ${n(t0)} × ${n(B)} ÷ 2 = ${n(up)}. Below: base ${n(m)}, height ${n(hT)} (r(${n(T)}) is ${n(-hT)}), area ${n(m)} × ${n(hT)} ÷ 2 = ${n(down)}.` },
   { prompt: 'The meter adds the two areas; the tank’s gain is the area above minus the area below. What are the two figures?', answer: [total, I], explanation: `Meter: ${n(up)} + ${n(down)} = ${n(total)} kilolitres. Gain: ${n(up)} − ${n(down)} = ${n(I)} kilolitres.` }
  ] }; }
});

practice({
 id: 'q38d', parent: 'q38', kind: 'challenge',
 title: 'The filter bed log between half hours',
 brief: 'The filter bed’s flow log covers only part of a run, with the flow turning round on a half minute, and the crew wants the exact net amount.',
 labels: ['crossing time (min)', 'area above the axis', 'area below the axis', 'definite integral'], tolerance: 0.005
}, [['crossing time t (min)'], ['r at the start (L/min)', 'r at the end, as a positive number (L/min)'], ['area above', 'area below'], ['definite integral']], {
 canonical: { b: 4, B: 14, p: 1, q: 5 },
 /* r(t) = B − bt with b even is zero at a half minute t0 = j + 0.5; the log runs from a whole minute p before t0 to a
    whole minute q after it. The rates at p and q are whole numbers; areas end in .25, .5, .75 or nothing, and the two
    areas are never equal. */
 draw: R => { let p; do { const b = R.pick([2, 4, 6]), j = R.int(2, 5), t0 = j + 0.5; p = { b, B: b * t0, p: R.int(1, j), q: j + R.int(1, 3) }; }
  while (Math.abs((p.B - p.b * p.p) * (p.B / p.b - p.p) - (p.b * p.q - p.B) * (p.q - p.B / p.b)) < 1e-9); return p; },
 build: ({ b, B, p, q }) => { const t0 = B / b, hp = B - b * p, hq = b * q - B, up = (t0 - p) * hp / 2, down = (q - t0) * hq / 2, I = up - down; return {
  prompt: `The net flow into the reservoir’s filter bed is r(t) = ${n(B)} − ${n(b)}t litres per minute, and the log covers only the stretch from t = ${n(p)} to t = ${n(q)} minutes. Find the definite integral ∫ from ${n(p)} to ${n(q)} of (${n(B)} − ${n(b)}t) dt from areas. Enter the time at which the flow is zero, then the area above the axis and the area below it, both as positive numbers, then the definite integral. Give exact values; they may have up to two decimal places.`,
  answer: [t0, up, down, I],
  hints: [`The flow is zero at a time between two whole minutes. The triangle above the axis starts at t = ${n(p)}, not at 0, so its base is measured from there.`, 'The heights of the two triangles are the sizes of the flow at the two ends of the log. Each area is half its base times its height.'],
  solution: `${n(B)} − ${n(b)}t = 0 at t = ${n(B)} ÷ ${n(b)} = ${n(t0)}. At t = ${n(p)} the flow is ${n(B)} − ${n(b * p)} = ${n(hp)}, and at t = ${n(q)} it is ${n(B)} − ${n(b * q)} = ${n(-hq)}. Above the axis, from t = ${n(p)} to t = ${n(t0)}, is a triangle with base ${n(t0 - p)} and height ${n(hp)}: area ${n(t0 - p)} × ${n(hp)} ÷ 2 = ${n(up)}. Below the axis, from t = ${n(t0)} to t = ${n(q)}, is a triangle with base ${n(q - t0)} and height ${n(hq)}: area ${n(q - t0)} × ${n(hq)} ÷ 2 = ${n(down)}. The definite integral is ${n(up)} − ${n(down)} = ${n(I)}, so over the logged stretch the filter bed ${I < 0 ? 'lost' : 'gained'} ${n(Math.abs(I))} litres.`,
  guidance: [
   { prompt: `At what time t is ${n(B)} − ${n(b)}t equal to zero?`, answer: [t0], explanation: `t = ${n(B)} ÷ ${n(b)} = ${n(t0)} minutes, halfway between two whole minutes.` },
   { prompt: `What is the flow at t = ${n(p)}, and how far below zero is it at t = ${n(q)}?`, answer: [hp, hq], explanation: `r(${n(p)}) = ${n(B)} − ${n(b * p)} = ${n(hp)} and r(${n(q)}) = ${n(B)} − ${n(b * q)} = ${n(-hq)}, which is ${n(hq)} below zero.` },
   { prompt: `What are the areas of the triangle above the axis, from t = ${n(p)} to t = ${n(t0)}, and of the triangle below it, from t = ${n(t0)} to t = ${n(q)}?`, answer: [up, down], explanation: `Above: ${n(t0 - p)} × ${n(hp)} ÷ 2 = ${n(up)}. Below: ${n(q - t0)} × ${n(hq)} ÷ 2 = ${n(down)}.` },
   { prompt: 'What is the definite integral, the area above minus the area below?', answer: [I], explanation: `${n(up)} − ${n(down)} = ${n(I)}.` }
  ] }; }
});

/* ---- q39 The Fundamental Theorem of Calculus ---- */
practice({
 id: 'q39b', parent: 'q39', kind: 'setting',
 title: 'Evaporation on a hot afternoon',
 brief: 'Sun on the open water is driving up evaporation, and the crew wants the exact amount lost over part of the day.',
 labels: ['F at the start', 'F at the end', 'water lost (kL)'], tolerance: 0.01
}, [['A', 'B'], ['F at the start', 'F at the end'], ['water lost (kL)']], {
 canonical: { B: 4, c: 7, p: 2, q: 6 },
 /* e(t) = Bt + c with B = 2b even, so F(t) = bt² + ct has whole coefficients; the interval is 2 to 5 hours long and
    ends by t = 9, so F stays below 1000. Not the q39 worked example (6x² + 2x from 1 to 2). */
 draw: R => { const p = R.int(1, 4); return { B: 2 * R.int(1, 5), c: R.int(2, 9), p, q: p + R.int(2, 5) }; },
 build: ({ B, c, p, q }) => { const b = B / 2, F = `${co(b, 't²')} + ${n(c)}t`, Fp = b * p * p + c * p, Fq = b * q * q + c * q, I = Fq - Fp; return {
  prompt: `On a hot day water evaporates from the open reservoir at e(t) = ${n(B)}t + ${n(c)} kilolitres per hour, t hours after sunrise. Use the Fundamental Theorem of Calculus to find how much water evaporates between t = ${n(p)} and t = ${n(q)}. Take F, the antiderivative of e(t) with no constant term. Enter F at the start of that time, then F at its end, then the water lost in kilolitres.`,
  answer: [Fp, Fq, I],
  hints: [`An antiderivative of ${n(B)}t is a multiple of t², and an antiderivative of the constant ${n(c)} is ${n(c)}t.`, 'The water lost is the integral of the rate: F at the end time minus F at the start time.'],
  solution: `F(t) = ${F} has F′(t) = ${n(B)}t + ${n(c)}, so it is an antiderivative of e(t). F(${n(p)}) = ${n(b)} × ${n(p * p)} + ${n(c)} × ${n(p)} = ${n(Fp)} and F(${n(q)}) = ${n(b)} × ${n(q * q)} + ${n(c)} × ${n(q)} = ${n(Fq)}. By the Fundamental Theorem of Calculus, ∫ from ${n(p)} to ${n(q)} of e(t) dt = F(${n(q)}) − F(${n(p)}) = ${n(Fq)} − ${n(Fp)} = ${n(I)} kilolitres evaporated.`,
  guidance: [
   { prompt: `Write F(t) = At² + Bt. Which A and B give F′(t) = ${n(B)}t + ${n(c)}?`, answer: [b, c], explanation: `The derivative of At² + Bt is 2At + B, so 2A = ${n(B)} and B = ${n(c)}: A = ${n(b)}.` },
   { prompt: `With F(t) = ${F}, what are F(${n(p)}) and F(${n(q)})?`, answer: [Fp, Fq], explanation: `F(${n(p)}) = ${n(b)} × ${n(p * p)} + ${n(c)} × ${n(p)} = ${n(Fp)} and F(${n(q)}) = ${n(b)} × ${n(q * q)} + ${n(c)} × ${n(q)} = ${n(Fq)}.` },
   { prompt: `What is F(${n(q)}) − F(${n(p)}), the water lost?`, answer: [I], explanation: `${n(Fq)} − ${n(Fp)} = ${n(I)} kilolitres.` }
  ] }; }
});

practice({
 id: 'q39c', parent: 'q39', kind: 'applied',
 title: 'Room below the spillway',
 brief: 'A night pump is topping up the reservoir, and the crew must know whether the water will stay below the spillway.',
 labels: ['water added (kL)', 'room left (kL)'], tolerance: 0.01
}, [['F at the start', 'F at the end'], ['water added (kL)'], ['room left (kL)']], {
 canonical: { A: 3, c: 12, p: 1, q: 4, room: 300 },
 /* r(t) = At² + c with A = 3a, so F(t) = at³ + ct; the pump runs 2 or 3 hours and stops by t = 6. The room below the
    spillway is a whole number of hundreds, 1 to 4 hundred above the water added. */
 draw: R => { const a = R.int(1, 2), c = R.int(5, 20), p = R.int(1, 3), q = p + R.int(2, 3), I = a * (q ** 3 - p ** 3) + c * (q - p);
  return { A: 3 * a, c, p, q, room: 100 * (Math.floor(I / 100) + R.int(1, 4)) }; },
 build: ({ A, c, p, q, room }) => { const a = A / 3, F = `${co(a, 't³')} + ${n(c)}t`, Fp = a * p ** 3 + c * p, Fq = a * q ** 3 + c * q, I = Fq - Fp, left = room - I; return {
  prompt: `The reservoir has room for ${n(room)} more kilolitres before water reaches the spillway. A night pump adds water at r(t) = ${n(A)}t² + ${n(c)} kilolitres per hour, t hours after midnight, from t = ${n(p)} until it switches off at t = ${n(q)}. How much water does the pump add, and how much room is left below the spillway afterwards? Enter both in kilolitres.`,
  answer: [I, left],
  hints: [`Find an antiderivative F of r(t) with constant 0. By the Fundamental Theorem, the water added is F(${n(q)}) − F(${n(p)}).`, 'The room left is the room before the pump started minus the water it added.'],
  solution: `An antiderivative of ${n(A)}t² + ${n(c)} is F(t) = ${F}. F(${n(p)}) = ${n(a)} × ${n(p ** 3)} + ${n(c)} × ${n(p)} = ${n(Fp)} and F(${n(q)}) = ${n(a)} × ${n(q ** 3)} + ${n(c)} × ${n(q)} = ${n(Fq)}. By the Fundamental Theorem of Calculus the pump adds ∫ from ${n(p)} to ${n(q)} of r(t) dt = ${n(Fq)} − ${n(Fp)} = ${n(I)} kilolitres. That leaves ${n(room)} − ${n(I)} = ${n(left)} kilolitres of room, so the water stays below the spillway.`,
  guidance: [
   { prompt: `An antiderivative of r(t) is F(t) = ${F}. What are F(${n(p)}) and F(${n(q)})?`, answer: [Fp, Fq], explanation: `F(${n(p)}) = ${n(a)} × ${n(p ** 3)} + ${n(c)} × ${n(p)} = ${n(Fp)} and F(${n(q)}) = ${n(a)} × ${n(q ** 3)} + ${n(c)} × ${n(q)} = ${n(Fq)}.` },
   { prompt: `How much water does the pump add, F(${n(q)}) − F(${n(p)})?`, answer: [I], explanation: `${n(Fq)} − ${n(Fp)} = ${n(I)} kilolitres.` },
   { prompt: `There was room for ${n(room)} kilolitres. How much room is left?`, answer: [left], explanation: `${n(room)} − ${n(I)} = ${n(left)} kilolitres, so the spillway stays dry.` }
  ] }; }
});

/* r(t) = c + k ÷ t; the part from k ÷ t is k(ln q − ln p). Shown to 4 decimals in the working, rounded to 2 in the answers. */
const r2 = x => Math.round(x * 100) / 100, r4 = x => Math.round(x * 1e4) / 1e4;
practice({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q22',
 title: 'The stream easing after the storm',
 brief: 'After a storm the stream into the reservoir is easing off, and the crew wants the exact inflow over a few hours, not an estimate.',
 labels: ['part from the ÷ t term (kL)', 'water in (kL)'], tolerance: 0.005
}, [['part from the constant term (kL)'], ['part from the ÷ t term (kL)'], ['water in (kL)']], {
 canonical: { c: 6, k: 10, p: 1, q: 4 },
 /* The interval is 2 to 4 hours long and starts at t = 1, 2 or 3. The logarithm part, k ln(q ÷ p), is never within
    0.0005 of a rounding boundary in its second decimal, so the rounded answers are unambiguous. */
 draw: R => { let p; do { const s = R.int(1, 3); p = { c: R.int(2, 9), k: R.int(2, 12), p: s, q: s + R.int(2, 4) }; }
  while (Math.abs((p.k * Math.log(p.q / p.p) * 100) % 1 - 0.5) < 0.05); return p; },
 build: ({ c, k, p, q }) => { const cp = c * (q - p), lp = k * Math.log(q / p), lpR = r2(lp), tot = r2(cp + lp); return {
  prompt: `After a storm the stream into the reservoir eases off: its flow is r(t) = ${n(c)} + ${n(k)} ÷ t kilolitres per hour, t hours after the rain stops. Use the Fundamental Theorem of Calculus to find the water that flows in from t = ${n(p)} to t = ${n(q)}. Enter the part of the integral that comes from the ${n(k)} ÷ t term, then the whole integral, both in kilolitres rounded to 2 decimal places.`,
  answer: [lpR, tot],
  hints: [`The derivative of ln t is 1 ÷ t, so ${n(k)} ln t is an antiderivative of ${n(k)} ÷ t; an antiderivative of the constant ${n(c)} is ${n(c)}t.`, `Take F(${n(q)}) − F(${n(p)}) one part at a time: the constant gives ${n(c)} × (${n(q)} − ${n(p)}), the other term gives ${n(k)} × (ln ${n(q)} − ln ${n(p)}). Round only at the end.`],
  solution: `An antiderivative of r(t) is F(t) = ${n(c)}t + ${n(k)} ln t, because the derivative of ln t is 1 ÷ t. By the Fundamental Theorem of Calculus the water is F(${n(q)}) − F(${n(p)}) = ${n(c)} × (${n(q)} − ${n(p)}) + ${n(k)} × (ln ${n(q)} − ln ${n(p)}). The first part is ${n(c)} × ${n(q - p)} = ${n(cp)}. ${p === 1 ? `ln 1 = 0 and ln ${n(q)} ≈ ${n(r4(Math.log(q)))}` : `ln ${n(q)} ≈ ${n(r4(Math.log(q)))} and ln ${n(p)} ≈ ${n(r4(Math.log(p)))}`}, so the second part is ${n(k)} × (ln ${n(q)} − ln ${n(p)}) ≈ ${n(r4(lp))}, which rounds to ${n(lpR)}. The whole integral is ${n(cp)} + ${n(r4(lp))} ≈ ${n(r4(cp + lp))}, which rounds to ${n(tot)} kilolitres.`,
  guidance: [
   { prompt: `The constant ${n(c)} has antiderivative ${n(c)}t. What does it add from t = ${n(p)} to t = ${n(q)}?`, answer: [cp], explanation: `${n(c)} × ${n(q)} − ${n(c)} × ${n(p)} = ${n(c)} × ${n(q - p)} = ${n(cp)} kilolitres.` },
   { prompt: `The term ${n(k)} ÷ t has antiderivative ${n(k)} ln t. What is ${n(k)} × (ln ${n(q)} − ln ${n(p)}), rounded to 2 decimal places?`, answer: [lpR], explanation: `${n(k)} × (ln ${n(q)} − ln ${n(p)}) = ${n(k)} ln(${n(q)} ÷ ${n(p)}) ≈ ${n(r4(lp))}, which rounds to ${n(lpR)}.` },
   { prompt: 'Add the two parts. What is the whole integral, rounded to 2 decimal places?', answer: [tot], explanation: `${n(cp)} + ${n(r4(lp))} ≈ ${n(r4(cp + lp))}, which rounds to ${n(tot)} kilolitres.` }
  ] }; }
});

/* ---- q40 Net change ---- */
practice({
 id: 'q40b', parent: 'q40', kind: 'setting',
 title: 'The hatchery pond at dawn',
 brief: 'The fish hatchery’s pond loses water through the early morning before its feed catches up, and the log needs its low point and closing volume.',
 labels: ['time of the least water (h)', 'net change (kL)', 'final volume (kL)'], tolerance: 0.01
}, [['time (h)'], ['net change (kL)'], ['final volume (kL)']], {
 canonical: { A: 6, c: 54, T: 5, V0: 150 },
 /* r(t) = At² − c with A = 3a and c = 3a·t0², so the rate is zero at t0 = 2, 3 or 4 and the interval ends 1 or 2 hours
    after it. The 4 a.m. volume is a whole number of tens at least 30 kL above what the pond loses by t0, so it never
    runs dry. */
 draw: R => { const a = R.int(1, 3), t0 = R.int(2, 4), T = t0 + R.int(1, 2), loss = 2 * a * t0 ** 3;
  return { A: 3 * a, c: 3 * a * t0 * t0, T, V0: 10 * (Math.ceil(loss / 10) + R.int(3, 20)) }; },
 build: ({ A, c, T, V0 }) => { const a = A / 3, t0 = Math.round(Math.sqrt(c / A)), aT3 = a * T ** 3, cT = c * T, net = aT3 - cT, V = V0 + net; return {
  prompt: `The fish hatchery’s holding pond is fed from the reservoir. In the early morning the hatchery draws more than flows in, so the pond gains water at r(t) = ${n(A)}t² − ${n(c)} kilolitres per hour, t hours after 4 a.m.; a negative rate means it is losing water. At 4 a.m. it holds ${n(V0)} kilolitres. Enter the time in hours, between t = 0 and t = ${n(T)}, at which it holds the least water, then the net change in its volume from t = 0 to t = ${n(T)}, then its volume at t = ${n(T)}, both in kilolitres.`,
  answer: [t0, net, V],
  hints: ['The volume falls while r(t) is negative and rises once it turns positive, so the pond is lowest where the rate passes through zero.', `The net change is ∫ from 0 to ${n(T)} of r(t) dt. It may be negative; add it, sign and all, to the 4 a.m. volume.`],
  solution: `r(t) = 0 when ${n(A)}t² = ${n(c)}, so t² = ${n(t0 * t0)} and t = ${n(t0)} hours. Before then the pond loses water and after it gains, so it holds the least at t = ${n(t0)}. An antiderivative of r(t) is F(t) = ${co(a, 't³')} − ${n(c)}t, so the net change is F(${n(T)}) − F(0) = ${n(a)} × ${n(T ** 3)} − ${n(c)} × ${n(T)} = ${n(aT3)} − ${n(cT)} = ${n(net)} kilolitres. The volume at t = ${n(T)} is ${addSigned(V0, net)} = ${n(V)} kilolitres.`,
  guidance: [
   { prompt: `At what time t is the rate ${n(A)}t² − ${n(c)} equal to zero?`, answer: [t0], explanation: `${n(A)}t² = ${n(c)} gives t² = ${n(t0 * t0)}, so t = ${n(t0)} hours. The volume stops falling and starts rising there.` },
   { prompt: `An antiderivative of r(t) is F(t) = ${co(a, 't³')} − ${n(c)}t. What is the net change F(${n(T)}) − F(0)?`, answer: [net], explanation: `F(${n(T)}) = ${n(a)} × ${n(T ** 3)} − ${n(c)} × ${n(T)} = ${n(aT3)} − ${n(cT)} = ${n(net)} and F(0) = 0, so the net change is ${n(net)} kilolitres.` },
   { prompt: `Add the net change to the ${n(V0)} kilolitres held at 4 a.m. What is the volume at t = ${n(T)}?`, answer: [V], explanation: `${addSigned(V0, net)} = ${n(V)} kilolitres.` }
  ] }; }
});

practice({
 id: 'q40c', parent: 'q40', kind: 'applied',
 title: 'Will the upper dam spill?',
 brief: 'Snowmelt is pouring into the upper reservoir, and the crew must know whether the water will reach the top of the dam.',
 labels: ['largest volume (kL)', 'room below the spill level (kL)'], tolerance: 0.01
}, [['time of the peak (h)'], ['net change (kL)'], ['largest volume (kL)', 'room below the spill level (kL)']], {
 canonical: { c: 54, A: 6, V0: 620, cap: 800 },
 /* r(t) = c − At² with A = 3a and c = 3a·t0², zero at t0 = 2, 3 or 4; the reservoir gains 2a·t0³ up to then. The spill
    level is a whole number of hundreds, 1 to 3 hundred above the peak. The prompt’s window ends 2 hours after t0, where
    the volume is still at least V0 − 48. */
 draw: R => { const a = R.int(1, 3), t0 = R.int(2, 4), V0 = 10 * R.int(30, 150), peak = V0 + 2 * a * t0 ** 3;
  return { c: 3 * a * t0 * t0, A: 3 * a, V0, cap: 100 * (Math.floor(peak / 100) + R.int(1, 3)) }; },
 build: ({ c, A, V0, cap }) => { const a = A / 3, t0 = Math.round(Math.sqrt(c / A)), ct = c * t0, at3 = a * t0 ** 3, gain = ct - at3, peak = V0 + gain, room = cap - peak; return {
  prompt: `Snowmelt fills the upper reservoir at r(t) = ${n(c)} − ${n(A)}t² kilolitres per hour, t hours after 9 a.m., for the next ${n(t0 + 2)} hours; once the rate turns negative, the outlet is taking away more than the melt brings in. At 9 a.m. the reservoir holds ${n(V0)} kilolitres, and water spills over the dam once it holds ${n(cap)} kilolitres. Enter the largest volume the reservoir reaches in that time, then how far that peak stays below the spill level, both in kilolitres (type them without commas).`,
  answer: [peak, room],
  hints: ['The volume is largest at the moment the rate passes through zero. Find that time first.', 'The water gained up to that time is the integral of r(t) from 0 to that time; add it to the 9 a.m. volume.'],
  solution: `r(t) = 0 when ${n(A)}t² = ${n(c)}, so t² = ${n(t0 * t0)} and t = ${n(t0)} hours. The reservoir fills before then and drains after, so it peaks at t = ${n(t0)}. An antiderivative of r(t) is F(t) = ${n(c)}t − ${co(a, 't³')}, so the net change up to the peak is F(${n(t0)}) − F(0) = ${n(c)} × ${n(t0)} − ${n(a)} × ${n(t0 ** 3)} = ${n(ct)} − ${n(at3)} = ${n(gain)} kilolitres. The largest volume is ${n(V0)} + ${n(gain)} = ${n(peak)} kilolitres, which is ${n(cap)} − ${n(peak)} = ${n(room)} kilolitres below the spill level, so the dam does not spill.`,
  guidance: [
   { prompt: `At what time t is the rate ${n(c)} − ${n(A)}t² equal to zero?`, answer: [t0], explanation: `${n(A)}t² = ${n(c)} gives t² = ${n(t0 * t0)}, so t = ${n(t0)} hours. The volume stops rising there.` },
   { prompt: `An antiderivative of r(t) is F(t) = ${n(c)}t − ${co(a, 't³')}. What is the net change from t = 0 to t = ${n(t0)}?`, answer: [gain], explanation: `F(${n(t0)}) − F(0) = ${n(ct)} − ${n(at3)} − 0 = ${n(gain)} kilolitres.` },
   { prompt: `What is the largest volume, and how far is it below the spill level of ${n(cap)} kilolitres?`, answer: [peak, room], explanation: `${n(V0)} + ${n(gain)} = ${n(peak)} kilolitres, and ${n(cap)} − ${n(peak)} = ${n(room)} kilolitres of room are left.` }
  ] }; }
});

practice({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q16',
 title: 'The sampling float on its cable',
 brief: 'A sampling float is let out on a cable and reeled back in, and the crew needs both where it ended and how much cable work it did.',
 labels: ['turning time (min)', 'final distance from the walkway (m)', 'total distance travelled (m)'], tolerance: 0.01
}, [['turning time (min)'], ['distance out (m)', 'distance back (m)'], ['final distance (m)', 'total distance (m)']], {
 canonical: { c: 48, A: 3, s0: 20, T: 6 },
 /* v(t) = c − At² with A = 3a and c = 3a·t0², zero at t0 = 2, 3 or 4; the interval ends 1 or 2 minutes after it. The
    start s0 is a whole number of tens, large enough that the float never comes back past the walkway. */
 draw: R => { let p; do { const a = R.int(1, 2), t0 = R.int(2, 4); p = { c: 3 * a * t0 * t0, A: 3 * a, s0: 10 * R.int(1, 8), T: t0 + R.int(1, 2) }; }
  while (p.s0 + p.c * p.T - (p.A / 3) * p.T ** 3 < 5); return p; },
 build: ({ c, A, s0, T }) => { const a = A / 3, t0 = Math.round(Math.sqrt(c / A)), Ft0 = c * t0 - a * t0 ** 3, FT = c * T - a * T ** 3, out = Ft0, back = Ft0 - FT, fin = s0 + FT, total = out + back; return {
  prompt: `A sampling float is let out on a cable from the dam’s inspection walkway and later reeled back in. Its velocity along the cable is v(t) = ${n(c)} − ${n(A)}t² metres per minute, t minutes after it is released ${n(s0)} m from the walkway; a negative velocity means it is being reeled in. Enter the time at which it turns around, then its distance from the walkway at t = ${n(T)}, then the total distance it travels along the cable from t = 0 to t = ${n(T)}, both in metres.`,
  answer: [t0, fin, total],
  hints: ['The float turns around when its velocity is zero. Up to then it moves out; after that it comes back.', `The final distance is the start plus the net change, F(${n(T)}) − F(0). The total distance adds the way out and the way back as positive amounts, so split the interval at the turning time.`],
  solution: `v(t) = 0 when ${n(A)}t² = ${n(c)}, so t² = ${n(t0 * t0)} and the float turns around at t = ${n(t0)} minutes. An antiderivative of v(t) is F(t) = ${n(c)}t − ${co(a, 't³')}. On the way out it moves F(${n(t0)}) − F(0) = ${n(c * t0)} − ${n(a * t0 ** 3)} = ${n(out)} metres. F(${n(T)}) = ${n(c * T)} − ${n(a * T ** 3)} = ${n(FT)}, so on the way back it moves F(${n(t0)}) − F(${n(T)}) = ${n(Ft0)} − ${par(FT)} = ${n(back)} metres towards the walkway. The net change in its position is F(${n(T)}) − F(0) = ${n(FT)}, so at t = ${n(T)} it is ${addSigned(s0, FT)} = ${n(fin)} metres from the walkway. The total distance travelled is ${n(out)} + ${n(back)} = ${n(total)} metres.`,
  guidance: [
   { prompt: `At what time t is the velocity ${n(c)} − ${n(A)}t² equal to zero?`, answer: [t0], explanation: `${n(A)}t² = ${n(c)} gives t² = ${n(t0 * t0)}, so t = ${n(t0)} minutes.` },
   { prompt: `With F(t) = ${n(c)}t − ${co(a, 't³')}, how far does the float move out from t = 0 to t = ${n(t0)}, and how far back from t = ${n(t0)} to t = ${n(T)}?`, answer: [out, back], explanation: `Out: F(${n(t0)}) − F(0) = ${n(out)} metres. Back: F(${n(t0)}) − F(${n(T)}) = ${n(Ft0)} − ${par(FT)} = ${n(back)} metres.` },
   { prompt: `It started ${n(s0)} m from the walkway. Where does it end, and how far has it travelled in all?`, answer: [fin, total], explanation: `The net change is ${n(out)} − ${n(back)} = ${n(FT)}, so it ends ${addSigned(s0, FT)} = ${n(fin)} metres from the walkway. In all it travelled ${n(out)} + ${n(back)} = ${n(total)} metres.` }
  ] }; }
});
})();
