/* Calculus 1 practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions". The worked sample is q01b in practice-1.js.
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc1/oracle-p5.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* A signed term with spaces, for the middle of a formula: sg(3) → "+ 3", sg(−2) → "− 2". */
const sg = x => (x < 0 ? '− ' : '+ ') + n(Math.abs(x));
/* True when x has at most `places` decimals (float noise ignored). */
const fits = (x, places) => { const s = x * Math.pow(10, places); return Math.abs(s - Math.round(s)) < 1e-7; };
/* Rounded to 2 decimal places, and shown with both decimals (3.20) where the prompt asks for 2 decimal places. */
const r2 = x => G.tidy(Math.round(x * 100) / 100);
const f2 = x => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2);
const R3 = Math.sqrt(3);

/* ---- q21 Derivatives of sine and cosine ---- */
/* q21b: x(t) = a cos t − b sin t; x′(t) = −a sin t − b cos t, read at π and π/3. */
const g21b = {
 canonical: { a: 5, b: 7 },
 /* a and b from 2 to 9 and different, so no coefficient 1 and the two terms are told apart. */
 draw: R => { const a = R.int(2, 9); return { a, b: R.except(2, 9, [a]) }; },
 build: ({ a, b }) => { const half = a * R3 / 2, v = r2(-half - b / 2); return {
  prompt: `On the machine-shop polishing bench a buffing head swings from side to side. Its sideways position is x(t) = ${n(a)} cos t − ${n(b)} sin t centimetres, where t is the time in seconds and the angle t is in radians. Enter the head’s velocity x′(t), in centimetres per second, at t = π, then at t = π/3 (round the second to 2 decimal places).`,
  answer: [b, v],
  hints: ['Differentiate one term at a time: cos t becomes −sin t and sin t becomes cos t. The minus sign already in front of the sin term stays there.', 'Use sin π = 0 and cos π = −1; sin(π/3) = √3 ÷ 2, about 0.866, and cos(π/3) = 0.5.'],
  solution: `Differentiate each term: x′(t) = −${n(a)} sin t − ${n(b)} cos t. At t = π: −${n(a)} × 0 − ${n(b)} × (−1) = ${n(b)} cm/s. At t = π/3: −${n(a)} × (√3 ÷ 2) − ${n(b)} × 0.5 ≈ −${n(half)} − ${n(b / 2)} ≈ ${f2(v)} cm/s to 2 decimal places, so there the head is moving in the negative direction.`,
  guidance: [
   { prompt: `Differentiate x(t) = ${n(a)} cos t − ${n(b)} sin t. The result has the form x′(t) = A sin t + B cos t. Enter A, then B.`, answer: [-a, -b], explanation: `cos t becomes −sin t, so ${n(a)} cos t becomes −${n(a)} sin t. sin t becomes cos t, so −${n(b)} sin t becomes −${n(b)} cos t. So x′(t) = −${n(a)} sin t − ${n(b)} cos t.` },
   { prompt: `Put t = π into x′(t) = −${n(a)} sin t − ${n(b)} cos t, using sin π = 0 and cos π = −1. What is x′(π)?`, answer: [b], explanation: `x′(π) = −${n(a)} × 0 − ${n(b)} × (−1) = ${n(b)}.` },
   { prompt: `Now t = π/3, where sin(π/3) = √3 ÷ 2 ≈ 0.866 and cos(π/3) = 0.5. What is x′(π/3), to 2 decimal places?`, answer: [v], explanation: `−${n(a)} × (√3 ÷ 2) ≈ −${n(half)} and −${n(b)} × 0.5 = −${n(b / 2)}. Together they make about ${f2(v)}.` }
  ] }; }
};
add({
 id: 'q21b', parent: 'q21', kind: 'setting',
 title: 'The swinging buffing head',
 brief: 'A buffing head on the polishing bench swings from side to side, and the bench log needs its velocity at two moments.',
 prompt: 'On the machine-shop polishing bench a buffing head swings from side to side. Its sideways position is x(t) = 5 cos t − 7 sin t centimetres, where t is the time in seconds and the angle t is in radians. Enter the head’s velocity x′(t), in centimetres per second, at t = π, then at t = π/3 (round the second to 2 decimal places).',
 answer: [7, -7.83], labels: ['x′(π) (cm/s)', 'x′(π/3) (cm/s)'],
 hints: [
  'Differentiate one term at a time: cos t becomes −sin t and sin t becomes cos t. The minus sign already in front of the sin term stays there.',
  'Use sin π = 0 and cos π = −1; sin(π/3) = √3 ÷ 2, about 0.866, and cos(π/3) = 0.5.'
 ],
 solution: 'Differentiate each term: x′(t) = −5 sin t − 7 cos t. At t = π: −5 × 0 − 7 × (−1) = 7 cm/s. At t = π/3: −5 × (√3 ÷ 2) − 7 × 0.5 ≈ −4.3301 − 3.5 ≈ −7.83 cm/s to 2 decimal places, so there the head is moving in the negative direction.',
 guidance: [
  { prompt: 'Differentiate x(t) = 5 cos t − 7 sin t. The result has the form x′(t) = A sin t + B cos t. Enter A, then B.', answer: [-5, -7], labels: ['A (number before sin t)', 'B (number before cos t)'], explanation: 'cos t becomes −sin t, so 5 cos t becomes −5 sin t. sin t becomes cos t, so −7 sin t becomes −7 cos t. So x′(t) = −5 sin t − 7 cos t.' },
  { prompt: 'Put t = π into x′(t) = −5 sin t − 7 cos t, using sin π = 0 and cos π = −1. What is x′(π)?', answer: [7], labels: ['x′(π) (cm/s)'], explanation: 'x′(π) = −5 × 0 − 7 × (−1) = 7.' },
  { prompt: 'Now t = π/3, where sin(π/3) = √3 ÷ 2 ≈ 0.866 and cos(π/3) = 0.5. What is x′(π/3), to 2 decimal places?', answer: [-7.83], labels: ['x′(π/3) (cm/s)'], explanation: '−5 × (√3 ÷ 2) ≈ −4.3301 and −7 × 0.5 = −3.5. Together they make about −7.83.' }
 ],
 tolerance: 0.005
}, g21b);

/* q21c: shaper table x(t) = a cos t + b sin t; velocity at π/3 is −a√3/2 + b/2 (negative, since b < a); margin L − speed. */
const g21c = {
 canonical: { a: 8, b: 3, L: 8 },
 /* b below a keeps the velocity negative; the limit L is a whole number 1 to 4 above the rounded-up speed, so the margin is positive. */
 draw: R => { const a = R.int(3, 12), b = R.int(2, a - 1), speed = -r2(-a * R3 / 2 + b / 2); return { a, b, L: Math.ceil(speed) + R.int(1, 4) }; },
 build: ({ a, b, L }) => { const half = a * R3 / 2, v = r2(-half + b / 2), speed = -v, margin = G.tidy(L - speed); return {
  prompt: `The shaper in the machine shop drives its work table back and forth. The table’s position is x(t) = ${n(a)} cos t + ${n(b)} sin t centimetres, where t is in seconds and the angle t is in radians. A safety interlock stops the machine whenever the table moves faster than ${n(L)} cm/s. The operator checks the moment t = π/3. Enter the table’s velocity at that moment, in cm/s, then how far its speed is below the interlock limit, in cm/s (round both to 2 decimal places).`,
  answer: [v, margin],
  hints: ['Differentiate first: cos t becomes −sin t and sin t becomes cos t. Only then put in t = π/3.', 'A negative velocity means the table is moving backwards; its speed is the size of the velocity, without the sign. Compare that speed with the limit.'],
  solution: `x′(t) = −${n(a)} sin t + ${n(b)} cos t. At t = π/3: −${n(a)} × (√3 ÷ 2) + ${n(b)} × 0.5 ≈ −${n(half)} + ${n(b / 2)} ≈ ${f2(v)} cm/s, so the table is moving backwards at about ${f2(speed)} cm/s. That is ${n(L)} − ${f2(speed)} = ${f2(margin)} cm/s below the limit, so the interlock does not trip.`,
  guidance: [
   { prompt: `Differentiate x(t) = ${n(a)} cos t + ${n(b)} sin t. The result has the form x′(t) = A sin t + B cos t. Enter A, then B.`, answer: [-a, b], explanation: `${n(a)} cos t becomes −${n(a)} sin t, and ${n(b)} sin t becomes ${n(b)} cos t.` },
   { prompt: `At t = π/3, sin(π/3) = √3 ÷ 2 ≈ 0.866 and cos(π/3) = 0.5. What is x′(π/3), to 2 decimal places?`, answer: [v], explanation: `−${n(a)} × (√3 ÷ 2) ≈ −${n(half)} and ${n(b)} × 0.5 = ${n(b / 2)}, so x′(π/3) ≈ ${f2(v)} cm/s.` },
   { prompt: `The speed is the size of the velocity, ${f2(speed)} cm/s. How far is it below the limit of ${n(L)} cm/s?`, answer: [margin], explanation: `${n(L)} − ${f2(speed)} = ${f2(margin)} cm/s to spare.` }
  ] }; }
};
add({
 id: 'q21c', parent: 'q21', kind: 'applied',
 title: 'The shaper table interlock',
 brief: 'The shaper’s table must stay under its speed limit, and the operator wants to know how much room there is at one moment of the stroke.',
 prompt: 'The shaper in the machine shop drives its work table back and forth. The table’s position is x(t) = 8 cos t + 3 sin t centimetres, where t is in seconds and the angle t is in radians. A safety interlock stops the machine whenever the table moves faster than 8 cm/s. The operator checks the moment t = π/3. Enter the table’s velocity at that moment, in cm/s, then how far its speed is below the interlock limit, in cm/s (round both to 2 decimal places).',
 answer: [-5.43, 2.57], labels: ['velocity at t = π/3 (cm/s)', 'margin below the limit (cm/s)'],
 hints: [
  'Differentiate first: cos t becomes −sin t and sin t becomes cos t. Only then put in t = π/3.',
  'A negative velocity means the table is moving backwards; its speed is the size of the velocity, without the sign. Compare that speed with the limit.'
 ],
 solution: 'x′(t) = −8 sin t + 3 cos t. At t = π/3: −8 × (√3 ÷ 2) + 3 × 0.5 ≈ −6.9282 + 1.5 ≈ −5.43 cm/s, so the table is moving backwards at about 5.43 cm/s. That is 8 − 5.43 = 2.57 cm/s below the limit, so the interlock does not trip.',
 guidance: [
  { prompt: 'Differentiate x(t) = 8 cos t + 3 sin t. The result has the form x′(t) = A sin t + B cos t. Enter A, then B.', answer: [-8, 3], labels: ['A (number before sin t)', 'B (number before cos t)'], explanation: '8 cos t becomes −8 sin t, and 3 sin t becomes 3 cos t.' },
  { prompt: 'At t = π/3, sin(π/3) = √3 ÷ 2 ≈ 0.866 and cos(π/3) = 0.5. What is x′(π/3), to 2 decimal places?', answer: [-5.43], labels: ['x′(π/3) (cm/s)'], explanation: '−8 × (√3 ÷ 2) ≈ −6.9282 and 3 × 0.5 = 1.5, so x′(π/3) ≈ −5.43 cm/s.' },
  { prompt: 'The speed is the size of the velocity, 5.43 cm/s. How far is it below the limit of 8 cm/s?', answer: [2.57], labels: ['margin (cm/s)'], explanation: '8 − 5.43 = 2.57 cm/s to spare.' }
 ],
 tolerance: 0.005
}, g21c);

/* q21d: f(t) = a sin(kt) + b cos(mt) with {k, m} = {2, 3}; f′(t) = ak cos(kt) − bm sin(mt) by the chain rule; read at 0 and π/6. */
const ANG = { 2: 'π/3', 3: 'π/2' }, COS = { 2: '0.5', 3: '0' }, SIN = { 2: '√3 ÷ 2', 3: '1' };
const g21d = {
 canonical: { a: 7, b: 2, k: 2, m: 3 },
 /* k and m are 2 and 3 in either order, so the angles at t = π/6 are π/3 and π/2; f′(π/6) is never 0. */
 draw: R => { for (;;) { const k = R.pick([2, 3]), m = 5 - k, a = R.int(2, 9), b = R.int(2, 9); if (!(k === 2 && a === 3 * b)) return { a, b, k, m }; } },
 build: ({ a, b, k, m }) => { const ak = a * k, bm = b * m, v = r2(ak * Math.cos(k * Math.PI / 6) - bm * Math.sin(m * Math.PI / 6));
  const at = k === 2 ? `${n(ak)} × 0.5 − ${n(bm)} × 1 = ${n(v)} µm/s` : `${n(ak)} × 0 − ${n(bm)} × (√3 ÷ 2) = −${n(b)}√3 ≈ ${f2(v)} µm/s to 2 decimal places`;
  return {
  prompt: `A grinding wheel that is slightly out of true makes the tool rest shake. The tip of the rest is pushed out by f(t) = ${n(a)} sin(${n(k)}t) + ${n(b)} cos(${n(m)}t) micrometres, where t is in seconds and the angles are in radians. Enter its velocity f′(t), in micrometres per second, at t = 0, then at t = π/6 (round the second to 2 decimal places).`,
  answer: [ak, v],
  hints: ['Each term is a function inside a function, so the chain rule multiplies by the inside’s derivative: sin(kt) gives k cos(kt), and cos(mt) gives −m sin(mt).', 'At t = π/6 the angles are 2 × π/6 = π/3 and 3 × π/6 = π/2. Use cos(π/3) = 0.5, sin(π/3) = √3 ÷ 2, cos(π/2) = 0 and sin(π/2) = 1.'],
  solution: `By the chain rule, f′(t) = ${n(a)} × ${n(k)} cos(${n(k)}t) − ${n(b)} × ${n(m)} sin(${n(m)}t) = ${n(ak)} cos(${n(k)}t) − ${n(bm)} sin(${n(m)}t). At t = 0: ${n(ak)} × 1 − ${n(bm)} × 0 = ${n(ak)} µm/s. At t = π/6 the angles are ${n(k)}t = ${ANG[k]} and ${n(m)}t = ${ANG[m]}, so f′(π/6) = ${at}.`,
  guidance: [
   { prompt: `By the chain rule, f′(t) = A cos(${n(k)}t) + B sin(${n(m)}t). Enter A, then B.`, answer: [ak, -bm], explanation: `sin(${n(k)}t) gives ${n(k)} cos(${n(k)}t), so A = ${n(a)} × ${n(k)} = ${n(ak)}. cos(${n(m)}t) gives −${n(m)} sin(${n(m)}t), so B = −${n(b)} × ${n(m)} = −${n(bm)}.` },
   { prompt: `What is f′(0)? Use cos 0 = 1 and sin 0 = 0.`, answer: [ak], explanation: `f′(0) = ${n(ak)} × 1 − ${n(bm)} × 0 = ${n(ak)} µm/s.` },
   { prompt: `At t = π/6 the angles are ${n(k)}t = ${ANG[k]} and ${n(m)}t = ${ANG[m]}. What is f′(π/6), to 2 decimal places?`, answer: [v], explanation: `cos(${ANG[k]}) = ${COS[k]} and sin(${ANG[m]}) = ${SIN[m]}, so f′(π/6) = ${at}.` }
  ] }; }
};
add({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q20',
 title: 'The shaking tool rest',
 brief: 'A wheel that is out of true is shaking the grinder’s tool rest, and the shop wants the rest’s velocity at two moments.',
 prompt: 'A grinding wheel that is slightly out of true makes the tool rest shake. The tip of the rest is pushed out by f(t) = 7 sin(2t) + 2 cos(3t) micrometres, where t is in seconds and the angles are in radians. Enter its velocity f′(t), in micrometres per second, at t = 0, then at t = π/6 (round the second to 2 decimal places).',
 answer: [14, 1], labels: ['f′(0) (µm/s)', 'f′(π/6) (µm/s)'],
 hints: [
  'Each term is a function inside a function, so the chain rule multiplies by the inside’s derivative: sin(kt) gives k cos(kt), and cos(mt) gives −m sin(mt).',
  'At t = π/6 the angles are 2 × π/6 = π/3 and 3 × π/6 = π/2. Use cos(π/3) = 0.5, sin(π/3) = √3 ÷ 2, cos(π/2) = 0 and sin(π/2) = 1.'
 ],
 solution: 'By the chain rule, f′(t) = 7 × 2 cos(2t) − 2 × 3 sin(3t) = 14 cos(2t) − 6 sin(3t). At t = 0: 14 × 1 − 6 × 0 = 14 µm/s. At t = π/6 the angles are 2t = π/3 and 3t = π/2, so f′(π/6) = 14 × 0.5 − 6 × 1 = 1 µm/s.',
 guidance: [
  { prompt: 'By the chain rule, f′(t) = A cos(2t) + B sin(3t). Enter A, then B.', answer: [14, -6], labels: ['A (number before cos)', 'B (number before sin)'], explanation: 'sin(2t) gives 2 cos(2t), so A = 7 × 2 = 14. cos(3t) gives −3 sin(3t), so B = −2 × 3 = −6.' },
  { prompt: 'What is f′(0)? Use cos 0 = 1 and sin 0 = 0.', answer: [14], labels: ['f′(0) (µm/s)'], explanation: 'f′(0) = 14 × 1 − 6 × 0 = 14 µm/s.' },
  { prompt: 'At t = π/6 the angles are 2t = π/3 and 3t = π/2. What is f′(π/6), to 2 decimal places?', answer: [1], labels: ['f′(π/6) (µm/s)'], explanation: 'cos(π/3) = 0.5 and sin(π/2) = 1, so f′(π/6) = 14 × 0.5 − 6 × 1 = 1 µm/s.' }
 ],
 tolerance: 0.005
}, g21d);

/* ---- q22 Derivatives of e^x and ln x ---- */
/* q22b: cooling T(t) = a e^(−kt), rate −ak at t = 0; shine S(t) = b ln t, rate b ÷ d at t = d. */
const g22b = {
 canonical: { a: 120, k: 0.4, b: 14, d: 2 },
 /* a a multiple of 10 and k a tenth, so a × k is whole; b a multiple of d (d at least 2), so b ÷ d is whole. */
 draw: R => { const d = R.int(2, 6); return { a: 10 * R.int(6, 30), k: R.int(1, 5) / 10, b: d * R.int(2, 9), d }; },
 build: ({ a, k, b, d }) => { const r0 = G.tidy(-a * k), w = b / d; return {
  prompt: `In the heat-treatment corner of the machine shop a hot gear is dropped into the quench tank. Its temperature above the water’s is T(t) = ${n(a)}e^(−${n(k)}t) °C. On the next bench a buffing wheel brings up the shine of a second part as S(t) = ${n(b)} ln t units. In both, t is the time in minutes. Enter the rate of change of the gear’s temperature at t = 0, in °C per minute (negative if it is cooling), then the rate at which the shine is rising at t = ${n(d)}, in units per minute.`,
  answer: [r0, w],
  hints: ['The derivative of e^(kt) is k e^(kt). Here the number in the power is negative, so the rate comes out negative. And e^0 = 1.', 'The derivative of ln t is 1 ÷ t. A number in front stays in front.'],
  solution: `T′(t) = ${n(a)} × (−${n(k)})e^(−${n(k)}t) = ${n(r0)}e^(−${n(k)}t). At t = 0, e^0 = 1, so T′(0) = ${n(r0)} °C per minute: the gear is cooling. S′(t) = ${n(b)} ÷ t, so S′(${n(d)}) = ${n(b)} ÷ ${n(d)} = ${n(w)} units per minute.`,
  guidance: [
   { prompt: `By the chain rule, T′(t) = ${n(a)} × (−${n(k)})e^(−${n(k)}t). What is T′(0)? Remember e^0 = 1.`, answer: [r0], explanation: `${n(a)} × (−${n(k)}) = ${n(r0)}, and e^0 = 1, so T′(0) = ${n(r0)} °C per minute.` },
   { prompt: `The derivative of ${n(b)} ln t is ${n(b)} ÷ t. What is S′(${n(d)})?`, answer: [w], explanation: `${n(b)} ÷ ${n(d)} = ${n(w)} units per minute.` }
  ] }; }
};
add({
 id: 'q22b', parent: 'q22', kind: 'setting',
 title: 'Quench tank and buffing wheel',
 brief: 'A gear is cooling in the quench tank while a part is being buffed, and the shop log needs the rate of each.',
 prompt: 'In the heat-treatment corner of the machine shop a hot gear is dropped into the quench tank. Its temperature above the water’s is T(t) = 120e^(−0.4t) °C. On the next bench a buffing wheel brings up the shine of a second part as S(t) = 14 ln t units. In both, t is the time in minutes. Enter the rate of change of the gear’s temperature at t = 0, in °C per minute (negative if it is cooling), then the rate at which the shine is rising at t = 2, in units per minute.',
 answer: [-48, 7], labels: ['T′(0) (°C/min)', 'shine rate (units/min)'],
 hints: [
  'The derivative of e^(kt) is k e^(kt). Here the number in the power is negative, so the rate comes out negative. And e^0 = 1.',
  'The derivative of ln t is 1 ÷ t. A number in front stays in front.'
 ],
 solution: 'T′(t) = 120 × (−0.4)e^(−0.4t) = −48e^(−0.4t). At t = 0, e^0 = 1, so T′(0) = −48 °C per minute: the gear is cooling. S′(t) = 14 ÷ t, so S′(2) = 14 ÷ 2 = 7 units per minute.',
 guidance: [
  { prompt: 'By the chain rule, T′(t) = 120 × (−0.4)e^(−0.4t). What is T′(0)? Remember e^0 = 1.', answer: [-48], labels: ['T′(0) (°C/min)'], explanation: '120 × (−0.4) = −48, and e^0 = 1, so T′(0) = −48 °C per minute.' },
  { prompt: 'The derivative of 14 ln t is 14 ÷ t. What is S′(2)?', answer: [7], labels: ['shine rate (units/min)'], explanation: '14 ÷ 2 = 7 units per minute.' }
 ],
 tolerance: 0.01
}, g22b);

/* q22c: wear W(t) = b ln t; rate b ÷ d at t = d; the rate falls to r at t = b ÷ r = T. */
const g22c = {
 canonical: { b: 60, d: 5, r: 3 },
 /* b = r × T with T from 6 to 30; d is a divisor of b from 2 to T − 1, so both answers are whole and the rate at d is above r. */
 draw: R => { for (;;) { const r = R.int(2, 6), T = R.int(6, 30), b = r * T, ds = [];
  for (let d = 2; d < T; d++) if (b % d === 0) ds.push(d);
  if (ds.length) return { b, d: R.pick(ds), r }; } },
 build: ({ b, d, r }) => { const w = b / d, T = b / r; return {
  prompt: `A new grinding wheel beds in over its first hour. Its wear is W(t) = ${n(b)} ln t micrometres, where t is the time in minutes, counted from t = 1. The shop raises the feed only once the wear rate has fallen to ${n(r)} micrometres per minute. Enter the wear rate at t = ${n(d)}, in micrometres per minute, then the time t, in minutes, at which the wear rate has fallen to ${n(r)}.`,
  answer: [w, T],
  hints: ['Differentiate W(t) first: the derivative of ln t is 1 ÷ t, and the number in front stays in front.', 'The wear rate is a number divided by t. Set it equal to the target rate and solve for t.'],
  solution: `W′(t) = ${n(b)} ÷ t. At t = ${n(d)}: ${n(b)} ÷ ${n(d)} = ${n(w)} µm per minute. The rate has fallen to ${n(r)} when ${n(b)} ÷ t = ${n(r)}, so t = ${n(b)} ÷ ${n(r)} = ${n(T)} minutes. From then on the feed can go up.`,
  guidance: [
   { prompt: `The derivative of ${n(b)} ln t is ${n(b)} ÷ t. What is the wear rate at t = ${n(d)}?`, answer: [w], explanation: `${n(b)} ÷ ${n(d)} = ${n(w)} micrometres per minute.` },
   { prompt: `The rate is ${n(b)} ÷ t. Solve ${n(b)} ÷ t = ${n(r)} for t.`, answer: [T], explanation: `t = ${n(b)} ÷ ${n(r)} = ${n(T)} minutes.` }
  ] }; }
};
add({
 id: 'q22c', parent: 'q22', kind: 'applied',
 title: 'Bedding in the new wheel',
 brief: 'A new grinding wheel wears fast at first, and the shop wants to know when it has settled enough to raise the feed.',
 prompt: 'A new grinding wheel beds in over its first hour. Its wear is W(t) = 60 ln t micrometres, where t is the time in minutes, counted from t = 1. The shop raises the feed only once the wear rate has fallen to 3 micrometres per minute. Enter the wear rate at t = 5, in micrometres per minute, then the time t, in minutes, at which the wear rate has fallen to 3.',
 answer: [12, 20], labels: ['wear rate (µm/min)', 'time (min)'],
 hints: [
  'Differentiate W(t) first: the derivative of ln t is 1 ÷ t, and the number in front stays in front.',
  'The wear rate is a number divided by t. Set it equal to the target rate and solve for t.'
 ],
 solution: 'W′(t) = 60 ÷ t. At t = 5: 60 ÷ 5 = 12 µm per minute. The rate has fallen to 3 when 60 ÷ t = 3, so t = 60 ÷ 3 = 20 minutes. From then on the feed can go up.',
 guidance: [
  { prompt: 'The derivative of 60 ln t is 60 ÷ t. What is the wear rate at t = 5?', answer: [12], labels: ['wear rate (µm/min)'], explanation: '60 ÷ 5 = 12 micrometres per minute.' },
  { prompt: 'The rate is 60 ÷ t. Solve 60 ÷ t = 3 for t.', answer: [20], labels: ['t (min)'], explanation: 't = 60 ÷ 3 = 20 minutes.' }
 ],
 tolerance: 0.01
}, g22c);

/* q22d: T(t) = (at + b)e^(−kt); by the product rule T′(t) = e^(−kt)(a − k(at + b)); read at 0 and at d. */
const g22d = {
 canonical: { a: 40, b: 100, k: 0.2, d: 3 },
 /* b a multiple of 10 and k one of 0.1, 0.2, 0.5, so T′(0) = a − kb is whole and positive (the part starts warming);
    the bracket at d is not 0 and has at most one decimal. d is at least 2. */
 draw: R => { for (;;) { const k = R.pick([0.1, 0.2, 0.5]), a = R.int(10, 60), b = 10 * R.int(2, 20), d = R.int(2, 6);
  const r0 = G.tidy(a - k * b), z = G.tidy(a - k * (a * d + b));
  if (r0 >= 2 && z !== 0 && Math.abs(Math.exp(-k * d) * z) >= 0.5) return { a, b, k, d }; } },
 build: ({ a, b, k, d }) => { const r0 = G.tidy(a - k * b), q = a * d + b, z = G.tidy(a - k * q), E = Math.exp(-k * d), v = r2(E * z); return {
  prompt: `A part in the annealing oven follows a heat-and-soak program. Its temperature above room temperature is T(t) = (${n(a)}t + ${n(b)})e^(−${n(k)}t) °C, where t is the time in minutes. Enter the rate of change of its temperature at t = 0, then at t = ${n(d)}, both in °C per minute (round the second to 2 decimal places; a negative rate means it is cooling).`,
  answer: [r0, v],
  hints: [`T is a product of two factors that both change with t, so use the product rule f′g + fg′. The derivative of e^(−${n(k)}t) is −${n(k)}e^(−${n(k)}t).`, `Take the common factor e^(−${n(k)}t) out of both terms. At t = 0 it is e^0 = 1; at t = ${n(d)}, work it out on a calculator.`],
  solution: `By the product rule, T′(t) = ${n(a)} × e^(−${n(k)}t) + (${n(a)}t + ${n(b)}) × (−${n(k)})e^(−${n(k)}t) = e^(−${n(k)}t)(${n(a)} − ${n(k)}(${n(a)}t + ${n(b)})). At t = 0: ${n(a)} − ${n(k)} × ${n(b)} = ${n(r0)} °C per minute. At t = ${n(d)}: ${n(a)}t + ${n(b)} = ${n(q)}, so the bracket is ${n(a)} − ${n(k)} × ${n(q)} = ${n(z)}, and e^(−${n(G.tidy(k * d))}) ≈ ${n(E)}. So T′(${n(d)}) ≈ ${n(E)} × ${par(z)} ≈ ${f2(v)} °C per minute.`,
  guidance: [
   { prompt: `The product rule gives T′(t) = e^(−${n(k)}t)(${n(a)} − ${n(k)}(${n(a)}t + ${n(b)})). What is T′(0)?`, answer: [r0], explanation: `e^0 = 1, so T′(0) = ${n(a)} − ${n(k)} × ${n(b)} = ${n(r0)} °C per minute.` },
   { prompt: `At t = ${n(d)}, what is the bracket ${n(a)} − ${n(k)}(${n(a)}t + ${n(b)})?`, answer: [z], explanation: `${n(a)} × ${n(d)} + ${n(b)} = ${n(q)}, and ${n(a)} − ${n(k)} × ${n(q)} = ${n(z)}.` },
   { prompt: `Multiply the bracket by e^(−${n(G.tidy(k * d))}) ≈ ${n(E)}. What is T′(${n(d)}), to 2 decimal places?`, answer: [v], explanation: `${n(E)} × ${par(z)} ≈ ${f2(v)} °C per minute.` }
  ] }; }
};
add({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q18',
 title: 'The annealing oven program',
 brief: 'A part in the annealing oven warms and then cools, and the heat-treat log needs its rate of change at the start and later on.',
 prompt: 'A part in the annealing oven follows a heat-and-soak program. Its temperature above room temperature is T(t) = (40t + 100)e^(−0.2t) °C, where t is the time in minutes. Enter the rate of change of its temperature at t = 0, then at t = 3, both in °C per minute (round the second to 2 decimal places; a negative rate means it is cooling).',
 answer: [20, -2.2], labels: ['T′(0) (°C/min)', 'T′ at the later time (°C/min)'],
 hints: [
  'T is a product of two factors that both change with t, so use the product rule f′g + fg′. The derivative of e^(−0.2t) is −0.2e^(−0.2t).',
  'Take the common factor e^(−0.2t) out of both terms. At t = 0 it is e^0 = 1; at t = 3, work it out on a calculator.'
 ],
 solution: 'By the product rule, T′(t) = 40 × e^(−0.2t) + (40t + 100) × (−0.2)e^(−0.2t) = e^(−0.2t)(40 − 0.2(40t + 100)). At t = 0: 40 − 0.2 × 100 = 20 °C per minute. At t = 3: 40t + 100 = 220, so the bracket is 40 − 0.2 × 220 = −4, and e^(−0.6) ≈ 0.5488. So T′(3) ≈ 0.5488 × (−4) ≈ −2.20 °C per minute.',
 guidance: [
  { prompt: 'The product rule gives T′(t) = e^(−0.2t)(40 − 0.2(40t + 100)). What is T′(0)?', answer: [20], labels: ['T′(0) (°C/min)'], explanation: 'e^0 = 1, so T′(0) = 40 − 0.2 × 100 = 20 °C per minute.' },
  { prompt: 'At t = 3, what is the bracket 40 − 0.2(40t + 100)?', answer: [-4], labels: ['bracket'], explanation: '40 × 3 + 100 = 220, and 40 − 0.2 × 220 = −4.' },
  { prompt: 'Multiply the bracket by e^(−0.6) ≈ 0.5488. What is T′(3), to 2 decimal places?', answer: [-2.2], labels: ['T′ at the later time (°C/min)'], explanation: '0.5488 × (−4) ≈ −2.20 °C per minute.' }
 ],
 tolerance: 0.005
}, g22d);

/* ---- q23 Choosing the differentiation rule ---- */
/* q23b: u = (x + p)(x² + s) product, v = x² ÷ (x + q) quotient, w = (x² + h)³ chain, all at x = c. */
const g23b = {
 canonical: { c: 2, p: 1, s: 3, q: 3, h: 1 },
 /* (c, q) pairs where v′(c) = c(c + 2q) ÷ (c + q)² has at most 2 decimals. */
 draw: R => { const [c, q] = R.pick([[1, 1], [1, 4], [2, 2], [2, 3], [2, 8]]); return { c, p: R.int(1, 6), s: R.int(1, 9), q, h: R.int(1, 4) }; },
 build: ({ c, p, s, q, h }) => { const u1 = c * c + s, u2 = (c + p) * 2 * c, du = u1 + u2, D = (c + q) * (c + q), t1 = 2 * c * (c + q), t2 = c * c, dv = G.tidy((t1 - t2) / D), I = c * c + h, dw = 3 * I * I * 2 * c; return {
  prompt: `The router in the machine shop cuts three curved tool paths: u(x) = (x + ${n(p)})(x² + ${n(s)}), v(x) = x² ÷ (x + ${n(q)}) and w(x) = (x² + ${n(h)})³, with x in centimetres. Decide which rule each path needs, then enter the slopes u′(${n(c)}), v′(${n(c)}) and w′(${n(c)}), in that order (give decimals, not fractions).`,
  answer: [du, dv, dw],
  hints: ['Look at the last operation in each formula: u multiplies two brackets (product rule), v divides one expression by another (quotient rule), and w raises a bracket to a power (chain rule).', 'For w the inside is x² plus a number, and its derivative is 2x. Do not forget that factor.'],
  solution: `u is a product: u′(x) = 1 × (x² + ${n(s)}) + (x + ${n(p)}) × 2x, so u′(${n(c)}) = ${n(u1)} + ${n(u2)} = ${n(du)}. v is a quotient: v′(x) = (2x(x + ${n(q)}) − x² × 1) ÷ (x + ${n(q)})², so v′(${n(c)}) = (${n(t1)} − ${n(t2)}) ÷ ${n(D)} = ${n(t1 - t2)} ÷ ${n(D)} = ${n(dv)}. w is a power of a bracket: w′(x) = 3(x² + ${n(h)})² × 2x, so w′(${n(c)}) = 3 × ${n(I * I)} × ${n(2 * c)} = ${n(dw)}.`,
  guidance: [
   { prompt: `Product rule for u(x) = (x + ${n(p)})(x² + ${n(s)}): u′(x) = (x² + ${n(s)}) + (x + ${n(p)}) × 2x. What is u′(${n(c)})?`, answer: [du], explanation: `${n(c)}² + ${n(s)} = ${n(u1)} and ${n(c + p)} × ${n(2 * c)} = ${n(u2)}, so u′(${n(c)}) = ${n(du)}.` },
   { prompt: `Quotient rule for v(x) = x² ÷ (x + ${n(q)}). At x = ${n(c)} the top is ${n(t2)} with derivative ${n(2 * c)}, and the bottom is ${n(c + q)} with derivative 1. Work out (${n(2 * c)} × ${n(c + q)} − ${n(t2)} × 1) ÷ ${n(c + q)}².`, answer: [dv], explanation: `(${n(t1)} − ${n(t2)}) ÷ ${n(D)} = ${n(t1 - t2)} ÷ ${n(D)} = ${n(dv)}.` },
   { prompt: `Chain rule for w(x) = (x² + ${n(h)})³: the outer part (inside)³ has derivative 3(inside)², and the inside has derivative 2x. At x = ${n(c)} the inside is ${n(I)}. What is w′(${n(c)})?`, answer: [dw], explanation: `3 × ${n(I)}² × ${n(2 * c)} = 3 × ${n(I * I)} × ${n(2 * c)} = ${n(dw)}.` }
  ] }; }
};
add({
 id: 'q23b', parent: 'q23', kind: 'setting',
 title: 'Three paths for the router',
 brief: 'The router is about to cut three curved tool paths, and each needs its slope checked at one point first.',
 prompt: 'The router in the machine shop cuts three curved tool paths: u(x) = (x + 1)(x² + 3), v(x) = x² ÷ (x + 3) and w(x) = (x² + 1)³, with x in centimetres. Decide which rule each path needs, then enter the slopes u′(2), v′(2) and w′(2), in that order (give decimals, not fractions).',
 answer: [19, 0.64, 300], labels: ['slope of path u', 'slope of path v', 'slope of path w'],
 hints: [
  'Look at the last operation in each formula: u multiplies two brackets (product rule), v divides one expression by another (quotient rule), and w raises a bracket to a power (chain rule).',
  'For w the inside is x² plus a number, and its derivative is 2x. Do not forget that factor.'
 ],
 solution: 'u is a product: u′(x) = 1 × (x² + 3) + (x + 1) × 2x, so u′(2) = 7 + 12 = 19. v is a quotient: v′(x) = (2x(x + 3) − x² × 1) ÷ (x + 3)², so v′(2) = (20 − 4) ÷ 25 = 16 ÷ 25 = 0.64. w is a power of a bracket: w′(x) = 3(x² + 1)² × 2x, so w′(2) = 3 × 25 × 4 = 300.',
 guidance: [
  { prompt: 'Product rule for u(x) = (x + 1)(x² + 3): u′(x) = (x² + 3) + (x + 1) × 2x. What is u′(2)?', answer: [19], labels: ['slope of path u'], explanation: '2² + 3 = 7 and 3 × 4 = 12, so u′(2) = 19.' },
  { prompt: 'Quotient rule for v(x) = x² ÷ (x + 3). At x = 2 the top is 4 with derivative 4, and the bottom is 5 with derivative 1. Work out (4 × 5 − 4 × 1) ÷ 5².', answer: [0.64], labels: ['slope of path v'], explanation: '(20 − 4) ÷ 25 = 16 ÷ 25 = 0.64.' },
  { prompt: 'Chain rule for w(x) = (x² + 1)³: the outer part (inside)³ has derivative 3(inside)², and the inside has derivative 2x. At x = 2 the inside is 5. What is w′(2)?', answer: [300], labels: ['slope of path w'], explanation: '3 × 5² × 4 = 3 × 25 × 4 = 300.' }
 ],
 tolerance: 0.005
}, g23b);

/* q23c: pump A flow at ÷ (t + q) (quotient), pump B flow (kt + s)² (chain); rates at t = c and their difference. */
const g23c = {
 canonical: { a: 36, q: 2, k: 2, s: 1, c: 1 },
 /* a × q is a multiple of (c + q)², so A′(c) is whole; the two rates differ by at least 2. */
 draw: R => { for (;;) { const c = R.int(1, 4), q = R.int(1, 4), a = R.int(10, 90), k = R.int(2, 3), s = R.int(1, 5);
  const D = (c + q) * (c + q), rA = a * q / D, rB = 2 * k * (k * c + s);
  if (Number.isInteger(rA) && Math.abs(rA - rB) >= 2) return { a, q, k, s, c }; } },
 build: ({ a, q, k, s, c }) => { const D = (c + q) * (c + q), rA = a * q / D, I = k * c + s, rB = 2 * I * k, diff = Math.abs(rA - rB), A_ = rA > rB; return {
  prompt: `Two coolant pumps in the machine shop are spinning up. The flow from pump A is A(t) = ${n(a)}t ÷ (t + ${n(q)}) litres per minute, and the flow from pump B is B(t) = (${n(k)}t + ${n(s)})² litres per minute, where t is the time in minutes since they started. Which flow is rising faster at t = ${n(c)}? Enter how fast A’s flow is rising, then B’s, both in litres per minute per minute, then how much faster the faster one is rising.`,
  answer: [rA, rB, diff],
  hints: ['A is a quotient, so use (f′g − fg′) ÷ g². B is a bracket squared, so use the chain rule: 2 × the bracket × the bracket’s derivative.', 'Work out both rates at the same moment, then subtract the smaller from the larger.'],
  solution: `A′(t) = (${n(a)}(t + ${n(q)}) − ${n(a)}t × 1) ÷ (t + ${n(q)})² = ${n(a * q)} ÷ (t + ${n(q)})², so A′(${n(c)}) = ${n(a * q)} ÷ ${n(D)} = ${n(rA)}. B′(t) = 2(${n(k)}t + ${n(s)}) × ${n(k)}, so B′(${n(c)}) = 2 × ${n(I)} × ${n(k)} = ${n(rB)}. Pump ${A_ ? 'A' : 'B'}’s flow is rising faster, by ${n(Math.max(rA, rB))} − ${n(Math.min(rA, rB))} = ${n(diff)} litres per minute per minute.`,
  guidance: [
   { prompt: `Quotient rule: A′(t) = (${n(a)}(t + ${n(q)}) − ${n(a)}t) ÷ (t + ${n(q)})² = ${n(a * q)} ÷ (t + ${n(q)})². What is A′(${n(c)})?`, answer: [rA], explanation: `${n(a * q)} ÷ ${n(c + q)}² = ${n(a * q)} ÷ ${n(D)} = ${n(rA)}.` },
   { prompt: `Chain rule: B′(t) = 2(${n(k)}t + ${n(s)}) × ${n(k)}. What is B′(${n(c)})?`, answer: [rB], explanation: `At t = ${n(c)} the bracket is ${n(I)}, so B′(${n(c)}) = 2 × ${n(I)} × ${n(k)} = ${n(rB)}.` },
   { prompt: `How much faster is the faster flow rising?`, answer: [diff], explanation: `${n(Math.max(rA, rB))} − ${n(Math.min(rA, rB))} = ${n(diff)}, so pump ${A_ ? 'A' : 'B'} is ahead.` }
  ] }; }
};
add({
 id: 'q23c', parent: 'q23', kind: 'applied',
 title: 'Two coolant pumps spinning up',
 brief: 'Two coolant pumps are spinning up together, and the shop wants to know whose flow is building faster.',
 prompt: 'Two coolant pumps in the machine shop are spinning up. The flow from pump A is A(t) = 36t ÷ (t + 2) litres per minute, and the flow from pump B is B(t) = (2t + 1)² litres per minute, where t is the time in minutes since they started. Which flow is rising faster at t = 1? Enter how fast A’s flow is rising, then B’s, both in litres per minute per minute, then how much faster the faster one is rising.',
 answer: [8, 12, 4], labels: ['A’s rate (L/min per min)', 'B’s rate (L/min per min)', 'difference (L/min per min)'],
 hints: [
  'A is a quotient, so use (f′g − fg′) ÷ g². B is a bracket squared, so use the chain rule: 2 × the bracket × the bracket’s derivative.',
  'Work out both rates at the same moment, then subtract the smaller from the larger.'
 ],
 solution: 'A′(t) = (36(t + 2) − 36t × 1) ÷ (t + 2)² = 72 ÷ (t + 2)², so A′(1) = 72 ÷ 9 = 8. B′(t) = 2(2t + 1) × 2, so B′(1) = 2 × 3 × 2 = 12. Pump B’s flow is rising faster, by 12 − 8 = 4 litres per minute per minute.',
 guidance: [
  { prompt: 'Quotient rule: A′(t) = (36(t + 2) − 36t) ÷ (t + 2)² = 72 ÷ (t + 2)². What is A′(1)?', answer: [8], labels: ['A′ (L/min per min)'], explanation: '72 ÷ 3² = 72 ÷ 9 = 8.' },
  { prompt: 'Chain rule: B′(t) = 2(2t + 1) × 2. What is B′(1)?', answer: [12], labels: ['B′ (L/min per min)'], explanation: 'At t = 1 the bracket is 3, so B′(1) = 2 × 3 × 2 = 12.' },
  { prompt: 'How much faster is the faster flow rising?', answer: [4], labels: ['difference (L/min per min)'], explanation: '12 − 8 = 4, so pump B is ahead.' }
 ],
 tolerance: 0.01
}, g23c);

/* q23d: f(x) = x(mx + s)³ (product and chain), g(x) = (ax + b)² ÷ (x + q) (quotient and chain), at x = c. */
const g23d = {
 canonical: { c: 2, m: 2, s: -1, a: 3, b: -4, q: 2 },
 /* The bracket mx + s is 1 to 3 at x = c, so f′(c) stays small; g′(c) has at most 2 decimals; s and b are never 0. */
 draw: R => { for (;;) { const c = R.int(1, 2), m = R.int(2, 3), s = R.int(1, 3) - m * c, a = R.int(2, 4), b = R.nz(-5, 5), q = R.int(1, 3), J = a * c + b;
  if (s !== 0 && J !== 0 && fits(J * (2 * a * (c + q) - J) / ((c + q) * (c + q)), 2)) return { c, m, s, a, b, q }; } },
 build: ({ c, m, s, a, b, q }) => { const I = m * c + s, T2 = 3 * c * I * I * m, df = I * I * I + T2, J = a * c + b, P = 2 * J * a, B = c + q, X = P * B, Y = J * J, dg = G.tidy((X - Y) / (B * B));
  const ftext = `x(${n(m)}x ${sg(s)})³`, gtext = `(${n(a)}x ${sg(b)})² ÷ (x + ${n(q)})`;
  return {
  prompt: `Two cam profiles on the machine-shop bench are each built in two layers: f(x) = ${ftext} and g(x) = ${gtext}. Enter the slopes f′(${n(c)}), then g′(${n(c)}) (give decimals, not fractions).`,
  answer: [df, dg],
  hints: ['f is a product whose second factor is a power of a bracket: use the product rule, and the chain rule to differentiate that factor.', 'g is a quotient whose top is a power of a bracket: use the quotient rule, and the chain rule to differentiate the top.'],
  solution: `f′(x) = 1 × (${n(m)}x ${sg(s)})³ + x × 3(${n(m)}x ${sg(s)})² × ${n(m)}. At x = ${n(c)} the bracket is ${n(I)}, so f′(${n(c)}) = ${n(I * I * I)} + 3 × ${n(c)} × ${n(I * I)} × ${n(m)} = ${n(I * I * I)} + ${n(T2)} = ${n(df)}. For g, the top (${n(a)}x ${sg(b)})² has derivative 2(${n(a)}x ${sg(b)}) × ${n(a)}, and the bottom x + ${n(q)} has derivative 1. At x = ${n(c)} the bracket is ${n(J)}, so the top is ${n(Y)}, its derivative is 2 × ${par(J)} × ${n(a)} = ${n(P)}, and the bottom is ${n(B)}. So g′(${n(c)}) = (${n(P)} × ${n(B)} − ${n(Y)} × 1) ÷ ${n(B)}² = (${n(X)} − ${n(Y)}) ÷ ${n(B * B)} = ${n(dg)}.`,
  guidance: [
   { prompt: `Product and chain rules give f′(x) = (${n(m)}x ${sg(s)})³ + ${n(3 * m)}x(${n(m)}x ${sg(s)})². At x = ${n(c)} the bracket is ${n(I)}. What is f′(${n(c)})?`, answer: [df], explanation: `${n(I)}³ = ${n(I * I * I)} and ${n(3 * m)} × ${n(c)} × ${n(I)}² = ${n(T2)}, so f′(${n(c)}) = ${n(df)}.` },
   { prompt: `By the chain rule the top of g, (${n(a)}x ${sg(b)})², has derivative 2(${n(a)}x ${sg(b)}) × ${n(a)}. What is that derivative at x = ${n(c)}?`, answer: [P], explanation: `At x = ${n(c)} the bracket is ${n(J)}, so the derivative is 2 × ${par(J)} × ${n(a)} = ${n(P)}.` },
   { prompt: `At x = ${n(c)} the top is ${n(Y)} with derivative ${n(P)}, and the bottom is ${n(B)} with derivative 1. Using the quotient rule, what is g′(${n(c)})?`, answer: [dg], explanation: `(${n(P)} × ${n(B)} − ${n(Y)} × 1) ÷ ${n(B)}² = (${n(X)} − ${n(Y)}) ÷ ${n(B * B)} = ${n(dg)}.` }
  ] }; }
};
add({
 id: 'q23d', parent: 'q23', kind: 'challenge',
 title: 'Cam profiles in two layers',
 brief: 'Two cam profiles each nest one rule inside another, and the bench needs both slopes before the cams are cut.',
 prompt: 'Two cam profiles on the machine-shop bench are each built in two layers: f(x) = x(2x − 1)³ and g(x) = (3x − 4)² ÷ (x + 2). Enter the slopes f′(2), then g′(2) (give decimals, not fractions).',
 answer: [135, 2.75], labels: ['slope of f', 'slope of g'],
 hints: [
  'f is a product whose second factor is a power of a bracket: use the product rule, and the chain rule to differentiate that factor.',
  'g is a quotient whose top is a power of a bracket: use the quotient rule, and the chain rule to differentiate the top.'
 ],
 solution: 'f′(x) = 1 × (2x − 1)³ + x × 3(2x − 1)² × 2. At x = 2 the bracket is 3, so f′(2) = 27 + 3 × 2 × 9 × 2 = 27 + 108 = 135. For g, the top (3x − 4)² has derivative 2(3x − 4) × 3, and the bottom x + 2 has derivative 1. At x = 2 the bracket is 2, so the top is 4, its derivative is 2 × 2 × 3 = 12, and the bottom is 4. So g′(2) = (12 × 4 − 4 × 1) ÷ 4² = (48 − 4) ÷ 16 = 2.75.',
 guidance: [
  { prompt: 'Product and chain rules give f′(x) = (2x − 1)³ + 6x(2x − 1)². At x = 2 the bracket is 3. What is f′(2)?', answer: [135], labels: ['slope of f'], explanation: '3³ = 27 and 6 × 2 × 3² = 108, so f′(2) = 135.' },
  { prompt: 'By the chain rule the top of g, (3x − 4)², has derivative 2(3x − 4) × 3. What is that derivative at x = 2?', answer: [12], labels: ['derivative of the top of g'], explanation: 'At x = 2 the bracket is 2, so the derivative is 2 × 2 × 3 = 12.' },
  { prompt: 'At x = 2 the top is 4 with derivative 12, and the bottom is 4 with derivative 1. Using the quotient rule, what is g′(2)?', answer: [2.75], labels: ['slope of g'], explanation: '(12 × 4 − 4 × 1) ÷ 4² = (48 − 4) ÷ 16 = 2.75.' }
 ],
 tolerance: 0.005
}, g23d);

/* ---- q24 Implicit differentiation ---- */
/* q24b: ax² − by² = C at (x0, y0); dy/dx = ax0 ÷ (by0); tangent y-intercept y0 − slope × x0. */
const g24b = {
 canonical: { a: 4, b: 3, x0: 3, y0: 2 },
 /* C = ax0² − by0² is positive (the curve meets the ground); slope and intercept have at most 2 decimals. */
 draw: R => { for (;;) { const p = { a: R.int(2, 6), b: R.int(2, 6), x0: R.int(2, 6), y0: R.int(1, 4) };
  const C = p.a * p.x0 * p.x0 - p.b * p.y0 * p.y0, slope = p.a * p.x0 / (p.b * p.y0);
  if (p.a !== p.b && C > 0 && fits(slope, 2) && fits(p.y0 - slope * p.x0, 2)) return p; } },
 build: ({ a, b, x0, y0 }) => { const C = a * x0 * x0 - b * y0 * y0, slope = G.tidy(a * x0 / (b * y0)), icpt = G.tidy(y0 - slope * x0); return {
  prompt: `Seen from the side, the flared skirt at the foot of the launch gantry follows the curve ${n(a)}x² − ${n(b)}y² = ${n(C)} (metres). The point (${n(x0)}, ${n(y0)}) is on it. Using implicit differentiation, enter the slope dy/dx of the skirt at that point, then the y-intercept of the tangent line there (give decimals, not fractions).`,
  answer: [slope, icpt],
  hints: ['Differentiate each term with respect to x. The y² term needs the chain rule: it gives 2y × dy/dx. Keep the minus sign in front of it.', 'Solve for dy/dx and put in the point. For the tangent line, use y = y₀ + slope × (x − x₀) with x = 0.'],
  solution: `Differentiating: ${n(2 * a)}x − ${n(2 * b)}y × dy/dx = 0, so dy/dx = ${n(2 * a)}x ÷ (${n(2 * b)}y). At (${n(x0)}, ${n(y0)}): dy/dx = ${n(2 * a * x0)} ÷ ${n(2 * b * y0)} = ${n(slope)}. The tangent line is y = ${n(y0)} + ${n(slope)} × (x − ${n(x0)}); at x = 0 it gives y = ${n(y0)} − ${n(G.tidy(slope * x0))} = ${n(icpt)}.`,
  guidance: [
   { prompt: `Differentiate ${n(a)}x² − ${n(b)}y² = ${n(C)} with respect to x. You get A·x + B·y·dy/dx = 0. Enter A, then B.`, answer: [2 * a, -2 * b], explanation: `${n(a)}x² gives ${n(2 * a)}x. −${n(b)}y² gives −${n(2 * b)}y × dy/dx by the chain rule. The constant ${n(C)} gives 0.` },
   { prompt: `So dy/dx = ${n(2 * a)}x ÷ (${n(2 * b)}y). What is it at x = ${n(x0)}, y = ${n(y0)}?`, answer: [slope], explanation: `${n(2 * a * x0)} ÷ ${n(2 * b * y0)} = ${n(slope)}.` },
   { prompt: `The tangent line goes through (${n(x0)}, ${n(y0)}) with slope ${n(slope)}. Where does it cross the y-axis (x = 0)?`, answer: [icpt], explanation: `y = ${n(y0)} + ${n(slope)} × (0 − ${n(x0)}) = ${n(y0)} − ${n(G.tidy(slope * x0))} = ${n(icpt)}.` }
  ] }; }
};
add({
 id: 'q24b', parent: 'q24', kind: 'setting',
 title: 'The flared gantry skirt',
 brief: 'The flared skirt at the foot of the gantry needs a stiffener laid along its tangent at one point.',
 prompt: 'Seen from the side, the flared skirt at the foot of the launch gantry follows the curve 4x² − 3y² = 24 (metres). The point (3, 2) is on it. Using implicit differentiation, enter the slope dy/dx of the skirt at that point, then the y-intercept of the tangent line there (give decimals, not fractions).',
 answer: [2, -4], labels: ['slope dy/dx', 'y-intercept of the tangent'],
 hints: [
  'Differentiate each term with respect to x. The y² term needs the chain rule: it gives 2y × dy/dx. Keep the minus sign in front of it.',
  'Solve for dy/dx and put in the point. For the tangent line, use y = y₀ + slope × (x − x₀) with x = 0.'
 ],
 solution: 'Differentiating: 8x − 6y × dy/dx = 0, so dy/dx = 8x ÷ (6y). At (3, 2): dy/dx = 24 ÷ 12 = 2. The tangent line is y = 2 + 2 × (x − 3); at x = 0 it gives y = 2 − 6 = −4.',
 guidance: [
  { prompt: 'Differentiate 4x² − 3y² = 24 with respect to x. You get A·x + B·y·dy/dx = 0. Enter A, then B.', answer: [8, -6], labels: ['A (number before x)', 'B (number before y·dy/dx)'], explanation: '4x² gives 8x. −3y² gives −6y × dy/dx by the chain rule. The constant 24 gives 0.' },
  { prompt: 'So dy/dx = 8x ÷ (6y). What is it at x = 3, y = 2?', answer: [2], labels: ['slope dy/dx'], explanation: '24 ÷ 12 = 2.' },
  { prompt: 'The tangent line goes through (3, 2) with slope 2. Where does it cross the y-axis (x = 0)?', answer: [-4], labels: ['y-intercept of the tangent'], explanation: 'y = 2 + 2 × (0 − 3) = 2 − 6 = −4.' }
 ],
 tolerance: 0.005
}, g24b);

/* q24c: dome ax² + by² = C; strut along the tangent at (x0, y0) down to y = 0; run = y0 ÷ |slope|; length √(run² + y0²). */
const g24c = {
 canonical: { a: 2, b: 3, x0: 3, y0: 2 },
 /* Slope and run have at most 2 decimals; the strut length is rounded. The strut’s foot is at most 1.6 times the dome’s
    half-width √(C ÷ a) from the centre line, so it lands near the dome and not far across the pad. */
 draw: R => { for (;;) { const p = { a: R.int(2, 6), b: R.int(2, 6), x0: R.int(1, 4), y0: R.int(2, 4) };
  const slope = p.a * p.x0 / (p.b * p.y0), run = p.b * p.y0 * p.y0 / (p.a * p.x0);
  const C = p.a * p.x0 * p.x0 + p.b * p.y0 * p.y0;
  if (p.a !== p.b && fits(slope, 2) && fits(run, 2) && p.x0 + run <= 1.6 * Math.sqrt(C / p.a)) return p; } },
 build: ({ a, b, x0, y0 }) => { const C = a * x0 * x0 + b * y0 * y0, slope = G.tidy(-a * x0 / (b * y0)), run = G.tidy(b * y0 * y0 / (a * x0)), xg = G.tidy(x0 + run), S = G.tidy(run * run + y0 * y0), L = r2(Math.sqrt(S)); return {
  prompt: `The dome over the gantry’s fuel valves has a cross-section along the oval ${n(a)}x² + ${n(b)}y² = ${n(C)}, where x is the distance from the centre line and y the height, in metres. A straight support strut touches the dome at the point (${n(x0)}, ${n(y0)}) and runs along the tangent line there down to the ground (y = 0). Enter the slope dy/dx of the dome at that point, then how far from the centre line the strut meets the ground, in metres, then the length of the strut, in metres (round the length to 2 decimal places).`,
  answer: [slope, xg, L],
  hints: ['Differentiate the oval implicitly to get dy/dx, then put in the point.', 'Along the tangent, the height drops by the size of the slope for each metre outwards. Find how far out it must go to drop the whole height; the strut is then the long side of a right triangle.'],
  solution: `Differentiating: ${n(2 * a)}x + ${n(2 * b)}y × dy/dx = 0, so dy/dx = −${n(2 * a)}x ÷ (${n(2 * b)}y). At (${n(x0)}, ${n(y0)}): dy/dx = −${n(2 * a * x0)} ÷ ${n(2 * b * y0)} = ${n(slope)}. To fall the full ${n(y0)} m the tangent must run ${n(y0)} ÷ ${n(-slope)} = ${n(run)} m outwards, so the strut meets the ground ${n(x0)} + ${n(run)} = ${n(xg)} m from the centre line. The strut is the long side of a right triangle with sides ${n(run)} m and ${n(y0)} m: √(${n(G.tidy(run * run))} + ${n(y0 * y0)}) = √${n(S)} ≈ ${f2(L)} m.`,
  guidance: [
   { prompt: `Differentiating ${n(a)}x² + ${n(b)}y² = ${n(C)} gives dy/dx = −${n(2 * a)}x ÷ (${n(2 * b)}y). What is the slope at (${n(x0)}, ${n(y0)})?`, answer: [slope], explanation: `−${n(2 * a * x0)} ÷ ${n(2 * b * y0)} = ${n(slope)}.` },
   { prompt: `The tangent falls ${n(-slope)} m for each metre outwards, and it must fall ${n(y0)} m to reach the ground. At what distance x from the centre line does it reach y = 0?`, answer: [xg], explanation: `It runs ${n(y0)} ÷ ${n(-slope)} = ${n(run)} m outwards from x = ${n(x0)}, reaching the ground at x = ${n(xg)}.` },
   { prompt: `The strut spans ${n(run)} m across and ${n(y0)} m down. How long is it, to 2 decimal places?`, answer: [L], explanation: `By Pythagoras, √(${n(G.tidy(run * run))} + ${n(y0 * y0)}) = √${n(S)} ≈ ${f2(L)} m.` }
  ] }; }
};
add({
 id: 'q24c', parent: 'q24', kind: 'applied',
 title: 'A strut for the valve dome',
 brief: 'The valve dome needs a straight support strut laid against it, and the crew must know where its foot goes and how long to cut it.',
 prompt: 'The dome over the gantry’s fuel valves has a cross-section along the oval 2x² + 3y² = 30, where x is the distance from the centre line and y the height, in metres. A straight support strut touches the dome at the point (3, 2) and runs along the tangent line there down to the ground (y = 0). Enter the slope dy/dx of the dome at that point, then how far from the centre line the strut meets the ground, in metres, then the length of the strut, in metres (round the length to 2 decimal places).',
 answer: [-1, 5, 2.83], labels: ['slope dy/dx', 'where the strut meets the ground (m)', 'strut length (m)'],
 hints: [
  'Differentiate the oval implicitly to get dy/dx, then put in the point.',
  'Along the tangent, the height drops by the size of the slope for each metre outwards. Find how far out it must go to drop the whole height; the strut is then the long side of a right triangle.'
 ],
 solution: 'Differentiating: 4x + 6y × dy/dx = 0, so dy/dx = −4x ÷ (6y). At (3, 2): dy/dx = −12 ÷ 12 = −1. To fall the full 2 m the tangent must run 2 ÷ 1 = 2 m outwards, so the strut meets the ground 3 + 2 = 5 m from the centre line. The strut is the long side of a right triangle with sides 2 m and 2 m: √(4 + 4) = √8 ≈ 2.83 m.',
 guidance: [
  { prompt: 'Differentiating 2x² + 3y² = 30 gives dy/dx = −4x ÷ (6y). What is the slope at (3, 2)?', answer: [-1], labels: ['slope dy/dx'], explanation: '−12 ÷ 12 = −1.' },
  { prompt: 'The tangent falls 1 m for each metre outwards, and it must fall 2 m to reach the ground. At what distance x from the centre line does it reach y = 0?', answer: [5], labels: ['ground point x (m)'], explanation: 'It runs 2 ÷ 1 = 2 m outwards from x = 3, reaching the ground at x = 5.' },
  { prompt: 'The strut spans 2 m across and 2 m down. How long is it, to 2 decimal places?', answer: [2.83], labels: ['strut length (m)'], explanation: 'By Pythagoras, √(4 + 4) = √8 ≈ 2.83 m.' }
 ],
 tolerance: 0.005
}, g24c);

/* q24d: ax² + xy + by² = C at (x0, y0); dy/dx = −(2ax + y) ÷ (x + 2by) using the product rule on xy. */
const g24d = {
 canonical: { a: 2, b: 4, x0: 2, y0: 1 },
 /* Slope and tangent y-intercept have at most 2 decimals. */
 draw: R => { for (;;) { const p = { a: R.int(2, 5), b: R.int(2, 5), x0: R.int(1, 4), y0: R.int(1, 4) };
  const slope = -(2 * p.a * p.x0 + p.y0) / (p.x0 + 2 * p.b * p.y0);
  if (fits(slope, 2) && fits(p.y0 - slope * p.x0, 2)) return p; } },
 build: ({ a, b, x0, y0 }) => { const C = a * x0 * x0 + x0 * y0 + b * y0 * y0, N = 2 * a * x0 + y0, D = x0 + 2 * b * y0, slope = G.tidy(-N / D), icpt = G.tidy(y0 - slope * x0); return {
  prompt: `The cable guide on the gantry’s crew lift follows the tilted oval ${n(a)}x² + xy + ${n(b)}y² = ${n(C)} (metres). The point (${n(x0)}, ${n(y0)}) is on it. Enter the slope dy/dx of the guide at that point, then the y-intercept of the tangent line there (give decimals, not fractions).`,
  answer: [slope, icpt],
  hints: ['The xy term is a product of two things that both change with x. By the product rule its derivative is y + x × dy/dx.', 'Gather every term with dy/dx on one side, take dy/dx out as a common factor, and divide.'],
  solution: `Differentiating term by term: ${n(2 * a)}x + (y + x × dy/dx) + ${n(2 * b)}y × dy/dx = 0. So (x + ${n(2 * b)}y) × dy/dx = −(${n(2 * a)}x + y), and dy/dx = −(${n(2 * a)}x + y) ÷ (x + ${n(2 * b)}y). At (${n(x0)}, ${n(y0)}): dy/dx = −${n(N)} ÷ ${n(D)} = ${n(slope)}. The tangent line is y = ${n(y0)} + ${par(slope)} × (x − ${n(x0)}); at x = 0 it gives y = ${n(y0)} + ${n(G.tidy(-slope * x0))} = ${n(icpt)}.`,
  guidance: [
   { prompt: `Differentiating ${n(a)}x² + xy + ${n(b)}y² = ${n(C)} and collecting gives (${n(2 * a)}x + y) + (x + ${n(2 * b)}y) × dy/dx = 0. At (${n(x0)}, ${n(y0)}), enter the value of ${n(2 * a)}x + y, then of x + ${n(2 * b)}y.`, answer: [N, D], explanation: `${n(2 * a)} × ${n(x0)} + ${n(y0)} = ${n(N)} and ${n(x0)} + ${n(2 * b)} × ${n(y0)} = ${n(D)}.` },
   { prompt: `So ${n(N)} + ${n(D)} × dy/dx = 0. What is dy/dx?`, answer: [slope], explanation: `dy/dx = −${n(N)} ÷ ${n(D)} = ${n(slope)}.` },
   { prompt: `The tangent line goes through (${n(x0)}, ${n(y0)}) with slope ${n(slope)}. Where does it cross the y-axis (x = 0)?`, answer: [icpt], explanation: `y = ${n(y0)} + ${par(slope)} × (0 − ${n(x0)}) = ${n(y0)} + ${n(G.tidy(-slope * x0))} = ${n(icpt)}.` }
  ] }; }
};
add({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q18',
 title: 'The tilted cable guide',
 brief: 'The crew lift’s cable guide bends along a tilted oval, and the riggers need its slope and tangent at one fixing point.',
 prompt: 'The cable guide on the gantry’s crew lift follows the tilted oval 2x² + xy + 4y² = 14 (metres). The point (2, 1) is on it. Enter the slope dy/dx of the guide at that point, then the y-intercept of the tangent line there (give decimals, not fractions).',
 answer: [-0.9, 2.8], labels: ['slope dy/dx', 'y-intercept of the tangent'],
 hints: [
  'The xy term is a product of two things that both change with x. By the product rule its derivative is y + x × dy/dx.',
  'Gather every term with dy/dx on one side, take dy/dx out as a common factor, and divide.'
 ],
 solution: 'Differentiating term by term: 4x + (y + x × dy/dx) + 8y × dy/dx = 0. So (x + 8y) × dy/dx = −(4x + y), and dy/dx = −(4x + y) ÷ (x + 8y). At (2, 1): dy/dx = −9 ÷ 10 = −0.9. The tangent line is y = 1 + (−0.9) × (x − 2); at x = 0 it gives y = 1 + 1.8 = 2.8.',
 guidance: [
  { prompt: 'Differentiating 2x² + xy + 4y² = 14 and collecting gives (4x + y) + (x + 8y) × dy/dx = 0. At (2, 1), enter the value of 4x + y, then of x + 8y.', answer: [9, 10], labels: ['value of the x-part', 'value of the dy/dx factor'], explanation: '4 × 2 + 1 = 9 and 2 + 8 × 1 = 10.' },
  { prompt: 'So 9 + 10 × dy/dx = 0. What is dy/dx?', answer: [-0.9], labels: ['slope dy/dx'], explanation: 'dy/dx = −9 ÷ 10 = −0.9.' },
  { prompt: 'The tangent line goes through (2, 1) with slope −0.9. Where does it cross the y-axis (x = 0)?', answer: [2.8], labels: ['y-intercept of the tangent'], explanation: 'y = 1 + (−0.9) × (0 − 2) = 1 + 1.8 = 2.8.' }
 ],
 tolerance: 0.005
}, g24d);

/* ---- q25 Related rates ---- */
/* q25b: camera g m from the pad, rocket rising at v; distance D = √(g² + h²); dD/dt = h v ÷ D. */
const g25b = {
 canonical: { g: 150, h: 200, v: 30 },
 /* Whole-number right triangles scaled by 10 or 20; the rate has at most 2 decimals. */
 draw: R => { const T = [[3, 4], [5, 12], [8, 15], [7, 24], [20, 21], [9, 40]];
  for (;;) { const [p, q] = R.pick(T), s = R.pick([10, 20]), flip = R.bool(), g = s * (flip ? q : p), h = s * (flip ? p : q), v = R.int(10, 60);
   if (fits(h * v / Math.hypot(g, h), 2)) return { g, h, v }; } },
 build: ({ g, h, v }) => { const D = Math.round(Math.hypot(g, h)), rate = G.tidy(h * v / D); return {
  prompt: `A tracking camera stands on level ground ${n(g)} m from the launch pad. A test rocket rises straight up from the pad at a steady ${n(v)} m/s. When the rocket is ${n(h)} m high, enter its distance from the camera, in metres (type it without commas), then how fast that distance is growing, in metres per second.`,
  answer: [D, rate],
  hints: ['The camera, the pad and the rocket make a right triangle: the ground distance stays fixed, the height grows, and the distance to the rocket is the long side.', 'Differentiate D² = (ground distance)² + h² with respect to time. The ground distance does not change, so its term gives 0.'],
  solution: `First the distance: D² = ${n(g)}² + ${n(h)}² = ${n(g * g)} + ${n(h * h)} = ${n(D * D)}, so D = ${n(D)} m. The ground distance is fixed, so differentiating D² = ${n(g)}² + h² with respect to time gives 2D dD/dt = 2h dh/dt. So dD/dt = h dh/dt ÷ D = ${n(h)} × ${n(v)} ÷ ${n(D)} = ${n(rate)} m/s.`,
  guidance: [
   { prompt: `By Pythagoras, D² = ${n(g)}² + ${n(h)}². What is the distance D from the camera to the rocket?`, answer: [D], explanation: `D² = ${n(g * g)} + ${n(h * h)} = ${n(D * D)}, so D = ${n(D)} m.` },
   { prompt: `Differentiating gives 2D dD/dt = 2h dh/dt. Put in D = ${n(D)}, h = ${n(h)} and dh/dt = ${n(v)}. What is dD/dt?`, answer: [rate], explanation: `dD/dt = ${n(h)} × ${n(v)} ÷ ${n(D)} = ${n(h * v)} ÷ ${n(D)} = ${n(rate)} m/s.` }
  ] }; }
};
add({
 id: 'q25b', parent: 'q25', kind: 'setting',
 title: 'Tracking the test rocket',
 brief: 'A ground camera is following a test rocket up from the pad, and the tracking crew needs to know how fast the range is opening.',
 prompt: 'A tracking camera stands on level ground 150 m from the launch pad. A test rocket rises straight up from the pad at a steady 30 m/s. When the rocket is 200 m high, enter its distance from the camera, in metres (type it without commas), then how fast that distance is growing, in metres per second.',
 answer: [250, 24], labels: ['distance to the rocket (m)', 'rate the distance grows (m/s)'],
 hints: [
  'The camera, the pad and the rocket make a right triangle: the ground distance stays fixed, the height grows, and the distance to the rocket is the long side.',
  'Differentiate D² = (ground distance)² + h² with respect to time. The ground distance does not change, so its term gives 0.'
 ],
 solution: 'First the distance: D² = 150² + 200² = 22500 + 40000 = 62500, so D = 250 m. The ground distance is fixed, so differentiating D² = 150² + h² with respect to time gives 2D dD/dt = 2h dh/dt. So dD/dt = h dh/dt ÷ D = 200 × 30 ÷ 250 = 24 m/s.',
 guidance: [
  { prompt: 'By Pythagoras, D² = 150² + 200². What is the distance D from the camera to the rocket?', answer: [250], labels: ['distance D (m)'], explanation: 'D² = 22500 + 40000 = 62500, so D = 250 m.' },
  { prompt: 'Differentiating gives 2D dD/dt = 2h dh/dt. Put in D = 250, h = 200 and dh/dt = 30. What is dD/dt?', answer: [24], labels: ['dD/dt (m/s)'], explanation: 'dD/dt = 200 × 30 ÷ 250 = 6000 ÷ 250 = 24 m/s.' }
 ],
 tolerance: 0.005
}, g25b);

/* q25c: crawlers x m east (speed u) and y m north (speed w); gap s; ds/dt = (xu + yw) ÷ s. */
const g25c = {
 canonical: { x: 12, y: 16, u: 2, w: 5 },
 /* Whole-number right triangles scaled by 2 to 6; ds/dt has at most 2 decimals. */
 draw: R => { const T = [[3, 4], [5, 12], [8, 15], [7, 24]];
  for (;;) { const [p, q] = R.pick(T), k = R.int(2, 6), flip = R.bool(), x = k * (flip ? q : p), y = k * (flip ? p : q), u = R.int(2, 9), w = R.int(2, 9), s = Math.hypot(x, y);
   if (u !== w && fits((x * u + y * w) / s, 2)) return { x, y, u, w }; } },
 build: ({ x, y, u, w }) => { const s = Math.round(Math.hypot(x, y)), P = x * u + y * w, rate = G.tidy(P / s); return {
  prompt: `Two crawlers are driving away from the foot of the launch gantry, one due east at ${n(u)} m/s and the other due north at ${n(w)} m/s. Their radio link weakens as the gap between them grows. At the moment the east crawler is ${n(x)} m out and the north crawler is ${n(y)} m out, enter the gap between them, in metres, then how fast the gap is growing, in metres per second.`,
  answer: [s, rate],
  hints: ['The gantry foot and the two crawlers form a right triangle with the gap as its long side, so s² = x² + y² at every moment.', 'Differentiate with respect to time: 2s ds/dt = 2x dx/dt + 2y dy/dt. Put in the values of this moment, then solve for ds/dt.'],
  solution: `The gap is s = √(${n(x)}² + ${n(y)}²) = √${n(s * s)} = ${n(s)} m. Differentiating s² = x² + y² with respect to time gives 2s ds/dt = 2x dx/dt + 2y dy/dt, so ds/dt = (x dx/dt + y dy/dt) ÷ s = (${n(x)} × ${n(u)} + ${n(y)} × ${n(w)}) ÷ ${n(s)} = ${n(P)} ÷ ${n(s)} = ${n(rate)} m/s.`,
  guidance: [
   { prompt: `By Pythagoras, how far apart are the crawlers, s = √(${n(x)}² + ${n(y)}²)?`, answer: [s], explanation: `${n(x * x)} + ${n(y * y)} = ${n(s * s)}, and √${n(s * s)} = ${n(s)} m.` },
   { prompt: `Differentiating s² = x² + y² gives s ds/dt = x dx/dt + y dy/dt. What is x dx/dt + y dy/dt here?`, answer: [P], explanation: `${n(x)} × ${n(u)} + ${n(y)} × ${n(w)} = ${n(x * u)} + ${n(y * w)} = ${n(P)}.` },
   { prompt: `So ${n(s)} × ds/dt = ${n(P)}. How fast is the gap growing?`, answer: [rate], explanation: `ds/dt = ${n(P)} ÷ ${n(s)} = ${n(rate)} m/s.` }
  ] }; }
};
add({
 id: 'q25c', parent: 'q25', kind: 'applied',
 title: 'Two crawlers drifting apart',
 brief: 'Two crawlers are driving away from the gantry on different headings, and the radio crew needs to know how fast their gap is opening.',
 prompt: 'Two crawlers are driving away from the foot of the launch gantry, one due east at 2 m/s and the other due north at 5 m/s. Their radio link weakens as the gap between them grows. At the moment the east crawler is 12 m out and the north crawler is 16 m out, enter the gap between them, in metres, then how fast the gap is growing, in metres per second.',
 answer: [20, 5.2], labels: ['gap (m)', 'rate the gap grows (m/s)'],
 hints: [
  'The gantry foot and the two crawlers form a right triangle with the gap as its long side, so s² = x² + y² at every moment.',
  'Differentiate with respect to time: 2s ds/dt = 2x dx/dt + 2y dy/dt. Put in the values of this moment, then solve for ds/dt.'
 ],
 solution: 'The gap is s = √(12² + 16²) = √400 = 20 m. Differentiating s² = x² + y² with respect to time gives 2s ds/dt = 2x dx/dt + 2y dy/dt, so ds/dt = (x dx/dt + y dy/dt) ÷ s = (12 × 2 + 16 × 5) ÷ 20 = 104 ÷ 20 = 5.2 m/s.',
 guidance: [
  { prompt: 'By Pythagoras, how far apart are the crawlers, s = √(12² + 16²)?', answer: [20], labels: ['gap s (m)'], explanation: '144 + 256 = 400, and √400 = 20 m.' },
  { prompt: 'Differentiating s² = x² + y² gives s ds/dt = x dx/dt + y dy/dt. What is x dx/dt + y dy/dt here?', answer: [104], labels: ['x dx/dt + y dy/dt'], explanation: '12 × 2 + 16 × 5 = 24 + 80 = 104.' },
  { prompt: 'So 20 × ds/dt = 104. How fast is the gap growing?', answer: [5.2], labels: ['ds/dt (m/s)'], explanation: 'ds/dt = 104 ÷ 20 = 5.2 m/s.' }
 ],
 tolerance: 0.005
}, g25c);

/* q25d: trolley on ax² + by² = C at (x0, y0) with dx/dt = u; dy/dx = −ax0 ÷ (by0) and dy/dt = dy/dx × u. */
const g25d = {
 canonical: { a: 3, b: 4, x0: 4, y0: 5, u: 1.5 },
 /* Larger coefficients and points than the parent; the slope is at most 3 in size, and slope and dy/dt have at most 2 decimals. */
 draw: R => { for (;;) { const p = { a: R.int(2, 9), b: R.int(2, 9), x0: R.int(2, 6), y0: R.int(2, 6), u: R.int(2, 20) / 10 };
  const slope = -p.a * p.x0 / (p.b * p.y0);
  if (p.a !== p.b && Math.abs(slope) <= 3 && fits(slope, 2) && fits(slope * p.u, 2)) return p; } },
 build: ({ a, b, x0, y0, u }) => { const C = a * x0 * x0 + b * y0 * y0, slope = G.tidy(-a * x0 / (b * y0)), rate = G.tidy(slope * u); return {
  prompt: `An inspection trolley runs on an oval rail around the gantry, along ${n(a)}x² + ${n(b)}y² = ${n(C)} (metres, seen from above). As it passes the point (${n(x0)}, ${n(y0)}), its x-coordinate is growing at ${n(u)} m/s. Enter the slope dy/dx of the rail at that point, then the rate dy/dt at which the trolley’s y-coordinate is changing, in m/s.`,
  answer: [slope, rate],
  hints: ['Differentiate the rail’s equation implicitly with respect to x to get the slope at the point.', 'Along the rail, y changes dy/dx times as fast as x: by the chain rule, dy/dt = dy/dx × dx/dt.'],
  solution: `Differentiating with respect to x: ${n(2 * a)}x + ${n(2 * b)}y × dy/dx = 0, so dy/dx = −${n(2 * a)}x ÷ (${n(2 * b)}y). At (${n(x0)}, ${n(y0)}): dy/dx = −${n(2 * a * x0)} ÷ ${n(2 * b * y0)} = ${n(slope)}. Both coordinates change with time, and by the chain rule dy/dt = dy/dx × dx/dt = ${n(slope)} × ${n(u)} = ${n(rate)} m/s. The minus sign means y is shrinking there.`,
  guidance: [
   { prompt: `Differentiating ${n(a)}x² + ${n(b)}y² = ${n(C)} gives dy/dx = −${n(2 * a)}x ÷ (${n(2 * b)}y). What is the slope at (${n(x0)}, ${n(y0)})?`, answer: [slope], explanation: `−${n(2 * a * x0)} ÷ ${n(2 * b * y0)} = ${n(slope)}.` },
   { prompt: `dy/dt = dy/dx × dx/dt, and dx/dt = ${n(u)}. What is dy/dt?`, answer: [rate], explanation: `${n(slope)} × ${n(u)} = ${n(rate)} m/s.` }
  ] }; }
};
add({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q24',
 title: 'The trolley on the oval rail',
 brief: 'An inspection trolley is rounding the gantry’s oval rail, and the crew wants to know how fast it is moving north or south.',
 prompt: 'An inspection trolley runs on an oval rail around the gantry, along 3x² + 4y² = 148 (metres, seen from above). As it passes the point (4, 5), its x-coordinate is growing at 1.5 m/s. Enter the slope dy/dx of the rail at that point, then the rate dy/dt at which the trolley’s y-coordinate is changing, in m/s.',
 answer: [-0.6, -0.9], labels: ['slope dy/dx', 'dy/dt (m/s)'],
 hints: [
  'Differentiate the rail’s equation implicitly with respect to x to get the slope at the point.',
  'Along the rail, y changes dy/dx times as fast as x: by the chain rule, dy/dt = dy/dx × dx/dt.'
 ],
 solution: 'Differentiating with respect to x: 6x + 8y × dy/dx = 0, so dy/dx = −6x ÷ (8y). At (4, 5): dy/dx = −24 ÷ 40 = −0.6. Both coordinates change with time, and by the chain rule dy/dt = dy/dx × dx/dt = −0.6 × 1.5 = −0.9 m/s. The minus sign means y is shrinking there.',
 guidance: [
  { prompt: 'Differentiating 3x² + 4y² = 148 gives dy/dx = −6x ÷ (8y). What is the slope at (4, 5)?', answer: [-0.6], labels: ['slope dy/dx'], explanation: '−24 ÷ 40 = −0.6.' },
  { prompt: 'dy/dt = dy/dx × dx/dt, and dx/dt = 1.5. What is dy/dt?', answer: [-0.9], labels: ['dy/dt (m/s)'], explanation: '−0.6 × 1.5 = −0.9 m/s.' }
 ],
 tolerance: 0.005
}, g25d);
})();
