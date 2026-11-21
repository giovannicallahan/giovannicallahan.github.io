/* Calculus 1 practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions". The worked sample is q01b in practice-1.js.
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc1/oracle-p6.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* practice(meta, stepLabels, generator): the authored prompt, answers, hints, solution and guided steps are
   build(canonical) itself, so the mission and its generator cannot drift apart. `meta` holds id, parent, kind,
   title, brief, labels, tolerance (and uses); `stepLabels` the answer labels of each guided step, in order. */
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
void plus;
/* A polynomial in v from its coefficients, highest power first: poly('x', [3, -4, -12, 0, 40]) → "3x⁴ − 4x³ − 12x² + 40".
   Zero terms are left out and a coefficient 1 is not written. */
const SUP = ['', '', '²', '³', '⁴'];
const poly = (v, cs) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + SUP[p];
  out = out ? out + (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* "a − b" or "a + b" for a signed b: sgn(10, -0.4) → "10 − 0.4". */
/* The terms of a polynomial (coefficients highest power first) at x, as a sum: terms([3, -4, -12, 0, 40], 2) → "48 − 32 − 48 + 40". */
const terms = (cs, x) => { const deg = cs.length - 1, vals = cs.map((c, i) => c === 0 ? null : c * x ** (deg - i)).filter(v => v !== null);
 return vals.map((v, i) => i === 0 ? n(v) : (v < 0 ? ' − ' : ' + ') + n(Math.abs(v))).join(''); };
/* "(x − 2)", "(x + 3)" or "x": the factor of a root r. */
const fac = (v, r) => r === 0 ? v : r < 0 ? `(${v} + ${n(-r)})` : `(${v} − ${n(r)})`;
const sgn = (a, b) => `${n(a)} ${b < 0 ? '−' : '+'} ${n(Math.abs(b))}`;

/* ---- q26 Linear approximation and differentials ---- */
practice({ id: 'q26b', parent: 'q26', kind: 'setting', title: 'Swing time of the crane hook',
 brief: 'The gantry crane’s hook cable is about to be let out or reeled in, and the riggers want the new swing time before they change it.',
 labels: ['slope T′(a) (s per m)', 'change dT (s)', 'estimated period (s)'], tolerance: 0.0005 },
 [['T′(a) (s per m)'], ['change dT (s)'], ['estimated period (s)']], {
 /* Not the numbers of the q26 worked example (√9.6 at 9) nor of q26 itself (√103 at 100). */
 canonical: { L: 16, dx: 3 },
 /* L is a perfect square whose root 4, 5, 8 or 10 makes 1 ÷ √L a short decimal; the cable changes by 1 to 4 m
    either way, so dT has at most three decimals (hence the tolerance 0.0005). */
 draw: R => ({ L: R.pick([16, 25, 64, 100]), dx: R.int(1, 4) * (R.bool() ? 1 : -1) }),
 build: ({ L, dx }) => { const k = Math.sqrt(L), s = 1 / k, dT = dx / k, T0 = 2 * k, est = T0 + dT, out = dx > 0;
  return {
  prompt: `A crane hook hangs from the gantry on a cable L metres long. It swings to and fro with a period of T(L) = 2√L seconds, the time for one full swing there and back. The cable is ${n(L)} m long now, and the riggers will ${out ? 'let out' : 'reel in'} ${n(Math.abs(dx))} m of it. Estimate the new period with the linear approximation of T at L = ${n(L)}, where √${n(L)} = ${n(k)}. Enter the slope T′(${n(L)}), then the estimated change in the period dT (negative if the period gets shorter), then the estimated new period in seconds.`,
  answer: [s, dT, est],
  hints: ['Write √L as L^(1/2). The power rule gives its derivative 1 ÷ (2√L), and the 2 in front of the root stays in front.',
   'The change along the tangent line is dT = T′(a) × dL, where dL is the change in length: negative when the cable is reeled in. Add dT to the period at the known length.'],
  solution: `T′(L) = 2 × 1 ÷ (2√L) = 1 ÷ √L, so T′(${n(L)}) = 1 ÷ ${n(k)} = ${n(s)}. The length changes by dL = ${n(dx)} m, so dT = ${n(s)} × ${par(dx)} = ${n(dT)} s. At ${n(L)} m the period is T(${n(L)}) = 2 × ${n(k)} = ${n(T0)} s, so the new period is about ${sgn(T0, dT)} = ${n(est)} s.`,
  guidance: [
   { prompt: `T(L) = 2√L, so T′(L) = 2 × 1 ÷ (2√L) = 1 ÷ √L. What is T′(${n(L)})?`, answer: [s], explanation: `T′(${n(L)}) = 1 ÷ √${n(L)} = 1 ÷ ${n(k)} = ${n(s)}: each extra metre of cable adds about ${n(s)} s to the period.` },
   { prompt: `The cable ${out ? 'gets longer' : 'gets shorter'} by ${n(Math.abs(dx))} m, so dL = ${n(dx)}. What is dT = T′(${n(L)}) × dL?`, answer: [dT], explanation: `dT = ${n(s)} × ${par(dx)} = ${n(dT)} s.` },
   { prompt: `At ${n(L)} m the period is 2 × ${n(k)} = ${n(T0)} s. What is the estimated new period, T(${n(L)}) + dT?`, answer: [est], explanation: `${sgn(T0, dT)} = ${n(est)} s. The swing ${out ? 'slows' : 'quickens'} a little, as a ${out ? 'longer' : 'shorter'} cable should.` }
  ] }; }
});

practice({ id: 'q26c', parent: 'q26', kind: 'applied', title: 'Tolerance on the ballast block',
 brief: 'A steel ballast block for the gantry counterweight is cut by a saw that can be slightly off, and the crew must know whether its volume stays within the spec.',
 labels: ['dV/ds (cm³ per cm)', 'volume error dV (cm³)', 'error (% of the volume)'], tolerance: 0.005 },
 [['dV/ds (cm³ per cm)'], ['volume error dV (cm³)'], ['error (% of the volume)']], {
 canonical: { s: 20, ds: 0.2 },
 /* The percentage error is 300 × ds ÷ s, kept at 6% or less; for these sides it has at most two decimals and is never
    exactly the 4% the spec allows. */
 draw: R => { const s = R.pick([10, 20, 25, 40, 50]); const top = s === 10 ? 2 : s === 20 ? 4 : 5; return { s, ds: R.int(1, top) / 10 }; },
 build: ({ s, ds }) => { const k = 3 * s * s, dV = k * ds, V = s * s * s, pct = 100 * dV / V, ok = pct <= 4;
  return {
  prompt: `A cube-shaped steel block for the gantry counterweight is cut with a side of ${n(s)} cm, but the saw can be off by up to ${n(ds)} cm. The volume of a cube with side s is V = s³. The counterweight spec allows the volume to be off by at most 4%. Use differentials to check the block. Enter the rate dV/ds at s = ${n(s)}, then the largest error in the volume, dV, in cm³, then that error as a percentage of the block’s volume (type the numbers without commas).`,
  answer: [k, dV, pct],
  hints: ['The rate of change of V = s³ is dV/ds = 3s². The differential dV = (dV/ds) × ds estimates the change in volume.',
   'For the percentage, divide the error dV by the whole volume s³ and multiply by 100. Then compare it with the 4% the spec allows.'],
  solution: `dV/ds = 3s², so at s = ${n(s)} it is 3 × ${n(s * s)} = ${n(k)} cm³ per cm. The largest error is dV = ${n(k)} × ${n(ds)} = ${n(dV)} cm³. The block’s volume is ${n(s)}³ = ${n(V)} cm³, so the error is ${n(dV)} ÷ ${n(V)} × 100 = ${n(pct)}% of it. That is ${ok ? 'within' : 'more than'} the 4% the spec allows, so the block ${ok ? 'passes' : 'fails the check and the saw must be set more precisely'}.`,
  guidance: [
   { prompt: `V = s³ has dV/ds = 3s². What is dV/ds at s = ${n(s)}?`, answer: [k], explanation: `3 × ${n(s)}² = 3 × ${n(s * s)} = ${n(k)} cm³ for each centimetre of side.` },
   { prompt: `The side can be off by ds = ${n(ds)} cm. What is the largest error in the volume, dV = (dV/ds) × ds?`, answer: [dV], explanation: `dV = ${n(k)} × ${n(ds)} = ${n(dV)} cm³.` },
   { prompt: `The block’s volume is ${n(s)}³ = ${n(V)} cm³. What percentage of it is the error of ${n(dV)} cm³?`, answer: [pct], explanation: `${n(dV)} ÷ ${n(V)} × 100 = ${n(pct)}%, ${ok ? 'inside' : 'above'} the 4% limit.` }
  ] }; }
});

/* Pythagorean pairs (anchor distance, height) whose cable length is a whole number and whose slope x ÷ L is a short decimal. */
const CABLES = [];
[[3, 4, 5], [4, 3, 5]].forEach(([x, h, c]) => { for (let k = 2; k <= 6; k++) CABLES.push([x * k, h * k, c * k]); });
[[15, 20, 25], [20, 15, 25], [7, 24, 25], [24, 7, 25]].forEach(([x, h, c]) => { for (let k = 1; k <= 2; k++) CABLES.push([x * k, h * k, c * k]); });
practice({ id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q20', title: 'Moving the guy-cable anchor',
 brief: 'A guy cable on the gantry tower needs its anchor moved, and the riggers want the new cable length before they cut it.',
 labels: ['present length (m)', 'slope L′(a)', 'estimated new length (m)'], tolerance: 0.005 },
 [['present length (m)'], ['slope L′(a)'], ['estimated new length (m)']], {
 canonical: { x: 8, h: 6, dx: 1.5 },
 draw: R => { const [x, h] = R.pick(CABLES); return { x, h, dx: R.pick([0.5, 1, 1.5, 2]) * (R.bool() ? 1 : -1) }; },
 build: ({ x, h, dx }) => { const H = h * h, L = Math.sqrt(x * x + H), s = x / L, dL = s * dx, est = L + dL, out = dx > 0;
  return {
  prompt: `A guy cable runs from a point ${n(h)} m up the gantry tower down to a ground anchor x metres from the foot of the tower, so its length is L(x) = √(x² + ${n(H)}) metres. The anchor is now at x = ${n(x)}, and the riggers will move it ${n(Math.abs(dx))} m ${out ? 'further out' : 'closer in'}. Use the chain rule to find L′(x), then estimate the new length with the linear approximation at x = ${n(x)}. Enter the present length L(${n(x)}), then the slope L′(${n(x)}), then the estimated new length in metres.`,
  answer: [L, s, est],
  hints: ['L is the square root of a bracket. By the chain rule, L′(x) is 1 ÷ (2√(bracket)) times the derivative of the bracket, and the bracket x² + (a number) has derivative 2x.',
   'The estimated change is dL = L′(a) × dx, where dx is negative when the anchor moves in. Add it to the present length.'],
  solution: `The present length is L(${n(x)}) = √(${n(x * x)} + ${n(H)}) = √${n(L * L)} = ${n(L)} m. By the chain rule, L′(x) = 2x ÷ (2√(x² + ${n(H)})) = x ÷ √(x² + ${n(H)}), so L′(${n(x)}) = ${n(x)} ÷ ${n(L)} = ${n(s)}. The anchor moves by dx = ${n(dx)} m, so dL = ${n(s)} × ${par(dx)} = ${n(dL)} m, and the new length is about ${sgn(L, dL)} = ${n(est)} m.`,
  guidance: [
   { prompt: `What is the present length, L(${n(x)}) = √(${n(x * x)} + ${n(H)})?`, answer: [L], explanation: `${n(x * x)} + ${n(H)} = ${n(L * L)}, and √${n(L * L)} = ${n(L)} m.` },
   { prompt: `By the chain rule, L′(x) = 2x ÷ (2√(x² + ${n(H)})) = x ÷ √(x² + ${n(H)}). What is L′(${n(x)})?`, answer: [s], explanation: `L′(${n(x)}) = ${n(x)} ÷ ${n(L)} = ${n(s)}: each metre the anchor moves changes the cable by about ${n(s)} m.` },
   { prompt: `The anchor moves by dx = ${n(dx)} m, so dL = L′(${n(x)}) × dx. What is the estimated new length, L(${n(x)}) + dL?`, answer: [est], explanation: `dL = ${n(s)} × ${par(dx)} = ${n(dL)}, so the new length is about ${sgn(L, dL)} = ${n(est)} m.` }
  ] }; }
});

/* ---- q27 Critical points, increasing and decreasing ---- */
practice({ id: 'q27b', parent: 'q27', kind: 'setting', title: 'Cooling water after the deluge',
 brief: 'After a test-stand burn the deluge water in the flame deflector cools and warms again, and the pad crew needs to know when it bottoms out.',
 labels: ['time of the local minimum (min)', 'temperature there (°C)', 'minutes the temperature rises'], tolerance: 0.01 },
 [['earlier critical time (min)', 'later critical time (min)'], ['T′ at the middle time'], ['temperature there (°C)']], {
 canonical: { r1: 2, r2: 6, c: 50 },
 /* T(t) = −t³ + 3mt² − 3·r1·r2·t + c with m = (r1 + r2) ÷ 2 a whole number, so T′(t) = −3(t − r1)(t − r2). The constant
    keeps the low point between 8 and 40 °C, and the water never hotter than 95 °C (at t = 0 or at the local maximum,
    which is (r2 − r1)³ ÷ 2 above the low point). The prompt’s window ends 1 minute after r2, where T is still at or
    above the low point. Never the critical points 2 and 4 of q27, nor 1 and 5 (q28's balloon). */
 draw: R => { let r1, r2, low, c; do { r1 = R.int(1, 3); r2 = r1 + 2 * R.int(1, 3); low = R.int(8, 40); c = -0.5 * r1 * r1 * (r1 - 3 * r2) + low; }
   while ((r1 === 2 && r2 === 4) || (r1 === 1 && r2 === 5) || c > 95 || low + (r2 - r1) ** 3 / 2 > 95);
  return { r1, r2, c }; },
 build: ({ r1, r2, c }) => { const m = (r1 + r2) / 2, P = r1 * r2, low = -(r1 ** 3) + 3 * m * r1 * r1 - 3 * P * r1 + c, d = r2 - r1, mid = -3 * (m - r1) * (m - r2);
  return {
  prompt: `After a test burn, the deluge water in the flame deflector has temperature T(t) = ${poly('t', [-1, 3 * m, -3 * P, c])} °C, t minutes after the burn ends, for the first ${n(r2 + 1)} minutes. It first cools, then warms up again, then starts to cool once more. Find the critical points of T. Enter the time at which the temperature has its local minimum, then the temperature there, then for how many minutes the temperature is rising.`,
  answer: [r1, low, d],
  hints: ['Set T′(t) = 0. Take out the common factor −3 and factor the quadratic that is left.',
   'The t³ term is negative here, so do not assume the earlier critical point is a hilltop: test the sign of T′ before, between and after them. A change from falling to rising is a local minimum.'],
  solution: `T′(t) = ${poly('t', [-3, 6 * m, -3 * P])} = −3(${poly('t', [1, -2 * m, P])}) = −3(t − ${n(r1)})(t − ${n(r2)}), which is 0 at t = ${n(r1)} and t = ${n(r2)}. T′ is negative before ${n(r1)}, positive between the two (for example T′(${n(m)}) = ${n(mid)}), and negative after ${n(r2)}. So the water cools, warms, then cools again: the local minimum is at t = ${n(r1)}, where T(${n(r1)}) = ${n(-(r1 ** 3))} + ${n(3 * m * r1 * r1)} − ${n(3 * P * r1)} + ${n(c)} = ${n(low)} °C, and the temperature rises from t = ${n(r1)} to t = ${n(r2)}, for ${n(d)} minutes.`,
  guidance: [
   { prompt: `T′(t) = ${poly('t', [-3, 6 * m, -3 * P])} = −3(${poly('t', [1, -2 * m, P])}). Which two times make it zero? Enter the smaller, then the larger.`, answer: [r1, r2], explanation: `${poly('t', [1, -2 * m, P])} = (t − ${n(r1)})(t − ${n(r2)}), which is 0 at t = ${n(r1)} and t = ${n(r2)}.` },
   { prompt: `Test the sign of T′ between the critical points, at t = ${n(m)}. What is T′(${n(m)})?`, answer: [mid], explanation: `−3(${n(m - r1)})(${n(m - r2)}) = ${n(mid)}, positive, so the water warms between ${n(r1)} and ${n(r2)}. Before ${n(r1)} and after ${n(r2)} the two brackets have the same sign, so T′ < 0 there. Falling then rising: t = ${n(r1)} is a local minimum.` },
   { prompt: `What is the temperature at the local minimum, T(${n(r1)})?`, answer: [low], explanation: `T(${n(r1)}) = ${n(-(r1 ** 3))} + ${n(3 * m * r1 * r1)} − ${n(3 * P * r1)} + ${n(c)} = ${n(low)} °C.` }
  ] }; }
});

practice({ id: 'q27c', parent: 'q27', kind: 'applied', title: 'Deck vibration after ignition',
 brief: 'The gantry’s lower deck shakes after engine ignition, and the access crew may only work there while the shaking dies down.',
 labels: ['seconds the vibration decreases', 'vibration when it stops decreasing (µm)'], tolerance: 0.01 },
 [['earlier critical time (s)', 'later critical time (s)'], ['seconds the vibration decreases'], ['vibration when it stops decreasing (µm)']], {
 canonical: { r1: 1, r2: 4, c: 30 },
 /* V(t) = 2t³ − 3(r1 + r2)t² + 6·r1·r2·t + c, so V′(t) = 6(t − r1)(t − r2). The window lasts 2 to 5 seconds and the
    constant keeps the local minimum between 5 and 30 µm. Never the critical points 2 and 4 of q27. */
 draw: R => { let r1, r2; do { r1 = R.int(1, 3); r2 = r1 + R.int(2, 5); } while (r2 > 8 || (r1 === 2 && r2 === 4));
  return { r1, r2, c: Math.max(0, -r2 * r2 * (3 * r1 - r2)) + R.int(5, 30) }; },
 build: ({ r1, r2, c }) => { const S = r1 + r2, P = r1 * r2, low = 2 * r2 ** 3 - 3 * S * r2 * r2 + 6 * P * r2 + c, d = r2 - r1, tt = r1 + 1, test = 6 * (tt - r1) * (tt - r2);
  return {
  prompt: `After engine ignition on the test stand, the vibration on the gantry’s lower deck is V(t) = ${poly('t', [2, -3 * S, 6 * P, c])} micrometres, t seconds after ignition. The access crew may only work on the deck while the vibration is decreasing. For how many seconds is it decreasing, and how strong is it at the moment it stops decreasing? Enter the number of seconds, then that vibration in micrometres.`,
  answer: [d, low],
  hints: ['The vibration decreases where V′(t) < 0. First find where V′(t) = 0: take out the common factor 6 and factor what is left.',
   'The decrease ends at the later critical time. Put that time into V itself, not into V′.'],
  solution: `V′(t) = ${poly('t', [6, -6 * S, 6 * P])} = 6(${poly('t', [1, -S, P])}) = 6(t − ${n(r1)})(t − ${n(r2)}), which is 0 at t = ${n(r1)} and t = ${n(r2)}. V′ is positive before ${n(r1)}, negative between ${n(r1)} and ${n(r2)} (for example V′(${n(tt)}) = ${n(test)}), and positive after ${n(r2)}. So the vibration decreases from t = ${n(r1)} to t = ${n(r2)}, for ${n(d)} seconds. It stops decreasing at its local minimum, V(${n(r2)}) = ${n(2 * r2 ** 3)} − ${n(3 * S * r2 * r2)} + ${n(6 * P * r2)} + ${n(c)} = ${n(low)} micrometres.`,
  guidance: [
   { prompt: `V′(t) = ${poly('t', [6, -6 * S, 6 * P])} = 6(${poly('t', [1, -S, P])}). At which two times is it zero? Enter the smaller, then the larger.`, answer: [r1, r2], explanation: `${poly('t', [1, -S, P])} = (t − ${n(r1)})(t − ${n(r2)}), so the critical times are ${n(r1)} and ${n(r2)}.` },
   { prompt: `Between the two times V′ is negative: for example V′(${n(tt)}) = ${n(test)}. For how many seconds is V decreasing?`, answer: [d], explanation: `It decreases from t = ${n(r1)} to t = ${n(r2)}, which is ${n(r2)} − ${n(r1)} = ${n(d)} seconds. Before and after, V′ > 0 and the shaking grows.` },
   { prompt: `The decrease stops at t = ${n(r2)}, a local minimum. What is V(${n(r2)})?`, answer: [low], explanation: `V(${n(r2)}) = ${n(2 * r2 ** 3)} − ${n(3 * S * r2 * r2)} + ${n(6 * P * r2)} + ${n(c)} = ${n(low)} micrometres.` }
  ] }; }
});

practice({ id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q18', title: 'Peak spray from the deluge nozzle',
 brief: 'At launch a nozzle floods the pad with sound-suppression water, and the pad engineers need the moment and size of its peak flow.',
 labels: ['time of peak flow (s)', 'peak flow (L/s)', 'Q′(0) (L/s per s)'], tolerance: 0.01 },
 [['Q′(0) (L/s per s)'], ['time of peak flow (s)'], ['peak flow (L/s)']], {
 canonical: { c: 2, a: 9 },
 /* Q(t) = c·t(a − t)² with a = 3k, so Q′(t) = c(a − t)(a − 3t) and the peak is at t = k. */
 draw: R => ({ c: R.int(2, 6), a: 3 * R.int(2, 4) }),
 build: ({ c, a }) => { const k = a / 3, peak = c * k * (a - k) ** 2, q0 = c * a * a;
  return {
  prompt: `At launch, a nozzle floods the pad with sound-suppression water. Its flow is Q(t) = ${n(c)}t(${n(a)} − t)² litres per second, t seconds after its valve opens, until the valve closes at t = ${n(a)}. Use the product rule to find Q′(t). Enter the time at which the flow peaks, then the peak flow in litres per second, then how fast the flow is growing at the moment the valve opens, Q′(0) (type the numbers without commas).`,
  answer: [k, peak, q0],
  hints: [`Q is a product of two factors, ${n(c)}t and (${n(a)} − t)². Expand the second as a quadratic to differentiate it.`,
   'After the product rule, take out the common bracket and set Q′(t) = 0. The flow rises where Q′ > 0 and falls where Q′ < 0.'],
  solution: `Take f = ${n(c)}t and g = (${n(a)} − t)² = ${poly('t', [1, -2 * a, a * a])}, so f′ = ${n(c)} and g′ = 2t − ${n(2 * a)} = −2(${n(a)} − t). By the product rule, Q′(t) = ${n(c)}(${n(a)} − t)² − ${n(2 * c)}t(${n(a)} − t) = ${n(c)}(${n(a)} − t)(${n(a)} − 3t). It is 0 at t = ${n(k)} and at t = ${n(a)}. Q′ is positive before ${n(k)} and negative between ${n(k)} and ${n(a)}, so the flow rises to a peak at t = ${n(k)} and then falls: Q(${n(k)}) = ${n(c)} × ${n(k)} × ${n(a - k)}² = ${n(peak)} litres per second. At the start, Q′(0) = ${n(c)} × ${n(a)}² = ${n(q0)} litres per second each second.`,
  guidance: [
   { prompt: `By the product rule, Q′(t) = f′g + fg′ with f = ${n(c)}t and g = (${n(a)} − t)², where f′ = ${n(c)} and g′ = −2(${n(a)} − t). At t = 0 the term fg′ is 0. What is Q′(0)?`, answer: [q0], explanation: `Q′(0) = ${n(c)} × (${n(a)} − 0)² = ${n(c)} × ${n(a * a)} = ${n(q0)}.` },
   { prompt: `In full, Q′(t) = ${n(c)}(${n(a)} − t)² − ${n(2 * c)}t(${n(a)} − t) = ${n(c)}(${n(a)} − t)(${n(a)} − 3t). Apart from the closing time t = ${n(a)}, where is Q′(t) = 0?`, answer: [k], explanation: `${n(a)} − 3t = 0 gives t = ${n(k)}. Q′ is positive before it and negative after it, so the flow peaks there.` },
   { prompt: `What is the peak flow, Q(${n(k)})?`, answer: [peak], explanation: `Q(${n(k)}) = ${n(c)} × ${n(k)} × (${n(a)} − ${n(k)})² = ${n(c)} × ${n(k)} × ${n((a - k) ** 2)} = ${n(peak)} litres per second.` }
  ] }; }
});

/* ---- q28 Concavity and the second derivative test ---- */
practice({ id: 'q28b', parent: 'q28', kind: 'setting', title: 'Draining the oxygen top-off tank',
 brief: 'The liquid-oxygen top-off tank on the gantry fills and drains during a countdown hold, and the propellant crew wants its low level and the moment it drains fastest.',
 labels: ['L″ at the later critical point', 'level at the local minimum (cm)', 'time of fastest fall (min)'], tolerance: 0.01 },
 [['A (number before t)', 'B (constant term)'], ['L″ at the earlier point', 'L″ at the later point'], ['level at the local minimum (cm)'], ['time of fastest fall (min)']], {
 canonical: { r1: 1, r2: 7, c: 110 },
 /* L(t) = t³ − 3mt² + 3·r1·r2·t + c with m = (r1 + r2) ÷ 2 whole. Never the critical points 1 and 5 of q28, nor 1 and 3
    of its worked example. The constant keeps the low level between 8 and 30 cm above the lowest it could be. */
 draw: R => { let r1, r2; do { r1 = R.int(1, 3); r2 = r1 + 2 * R.int(1, 3); } while (r1 === 1 && (r2 === 5 || r2 === 3));
  const off = 0.5 * r2 * r2 * (3 * r1 - r2); return { r1, r2, c: R.int(8, 30) - Math.min(0, off) }; },
 build: ({ r1, r2, c }) => { const m = (r1 + r2) / 2, P = r1 * r2, low = r2 ** 3 - 3 * m * r2 * r2 + 3 * P * r2 + c, d = r2 - r1;
  return {
  prompt: `The liquid-oxygen top-off tank on the gantry fills and drains during a countdown hold. Its level is L(t) = ${poly('t', [1, -3 * m, 3 * P, c])} centimetres, t minutes into the hold, and its critical points are t = ${n(r1)} and t = ${n(r2)}. Enter the second derivative L″ at t = ${n(r2)}, then the level at the local minimum, then the time at which the level is falling fastest (the inflection point).`,
  answer: [3 * d, low, m],
  hints: ['Differentiate twice: L″ is the rate of change of the slope L′.',
   'At a critical point, L″ > 0 means a cup, a local minimum. The level falls fastest where its slope stops getting steeper, which is where L″ changes sign.'],
  solution: `L′(t) = ${poly('t', [3, -6 * m, 3 * P])} and L″(t) = ${poly('t', [6, -6 * m])}. At t = ${n(r1)}: L″ = ${n(-3 * d)} < 0, a cap, so t = ${n(r1)} is a local maximum. At t = ${n(r2)}: L″ = ${n(3 * d)} > 0, a cup, so t = ${n(r2)} is the local minimum, with L(${n(r2)}) = ${n(r2 ** 3)} − ${n(3 * m * r2 * r2)} + ${n(3 * P * r2)} + ${n(c)} = ${n(low)} cm. L″(t) = 0 when 6t = ${n(6 * m)}, at t = ${n(m)}, and L″ changes from − to + there: that inflection point is where the level falls fastest.`,
  guidance: [
   { prompt: `L′(t) = ${poly('t', [3, -6 * m, 3 * P])}. Differentiate again: L″(t) = A·t + B. Enter A, then B.`, answer: [6, -6 * m], explanation: `The derivative of 3t² is 6t, of ${n(-6 * m)}t is ${n(-6 * m)}, and of the constant ${n(3 * P)} is 0. So L″(t) = ${poly('t', [6, -6 * m])}.` },
   { prompt: `Evaluate L″ at both critical points: L″(${n(r1)}), then L″(${n(r2)}).`, answer: [-3 * d, 3 * d], explanation: `L″(${n(r1)}) = ${n(-3 * d)} < 0: concave down, a local maximum. L″(${n(r2)}) = ${n(3 * d)} > 0: concave up, a local minimum.` },
   { prompt: `The local minimum is at t = ${n(r2)}. What is L(${n(r2)})?`, answer: [low], explanation: `L(${n(r2)}) = ${n(r2 ** 3)} − ${n(3 * m * r2 * r2)} + ${n(3 * P * r2)} + ${n(c)} = ${n(low)} cm.` },
   { prompt: `Where is L″(t) = ${poly('t', [6, -6 * m])} equal to 0?`, answer: [m], explanation: `6t = ${n(6 * m)}, so t = ${n(m)}. Before it L″ < 0 and after it L″ > 0, so the bend changes there and the fall is steepest.` }
  ] }; }
});

practice({ id: 'q28c', parent: 'q28', kind: 'applied', title: 'Camera drone over the warning lights',
 brief: 'A camera drone dips low beside the gantry while filming, and the flight crew must be sure it clears the tower’s warning lights.',
 labels: ['altitude at the bottom of the dip (m)', 'clearance above the lights (m)'], tolerance: 0.01 },
 [['A″ at the earlier point', 'A″ at the later point'], ['altitude at the bottom of the dip (m)'], ['clearance above the lights (m)']], {
 canonical: { r1: 2, r2: 5, c: 80, H: 25 },
 /* A(t) = −2t³ + 3(r1 + r2)t² − 6·r1·r2·t + c, so A′(t) = −6(t − r1)(t − r2): the dip is at t = r1. The constant keeps
    the bottom of the dip between 15 and 50 m; the lights are at least 5 m high and the clearance is never 0. The critical points are at least 2 s apart, so at
    the end of the run, 1 s after r2, the drone is still at or above the bottom of the dip. */
 draw: R => { let r1, r2; do { r1 = R.int(1, 3); r2 = r1 + R.int(2, 4); } while (r2 > 7 || (r1 === 1 && (r2 === 5 || r2 === 3)));
  const low = R.int(15, 50), c = low - r1 * r1 * (r1 - 3 * r2), cl = R.except(-8, Math.min(20, low - 5), [0]); return { r1, r2, c, H: low - cl }; },
 build: ({ r1, r2, c, H }) => { const S = r1 + r2, P = r1 * r2, low = -2 * r1 ** 3 + 3 * S * r1 * r1 - 6 * P * r1 + c, cl = low - H, d = r2 - r1;
  return {
  prompt: `A camera drone films the rocket from beside the gantry. Its altitude is A(t) = ${poly('t', [-2, 3 * S, -6 * P, c])} metres, t seconds into its ${n(r2 + 1)}-second run: it dips, climbs, and then starts down again. Its critical points are t = ${n(r1)} and t = ${n(r2)}. The tower’s warning lights are ${n(H)} m high, and the drone must stay above them. Use the second derivative test to find the bottom of the dip. Enter the drone’s altitude there, then its clearance above the lights (negative if it dips below them).`,
  answer: [low, cl],
  hints: ['Differentiate twice. At a critical point, A″ > 0 means a cup (a local minimum) and A″ < 0 a cap (a local maximum).',
   'Put the time of the local minimum into A itself to get the altitude, then subtract the height of the lights.'],
  solution: `A′(t) = ${poly('t', [-6, 6 * S, -6 * P])} and A″(t) = ${poly('t', [-12, 6 * S])}. A″(${n(r1)}) = ${n(6 * d)} > 0, so t = ${n(r1)} is a cup, the bottom of the dip; A″(${n(r2)}) = ${n(-6 * d)} < 0, so t = ${n(r2)} is the top of the climb. At the bottom, A(${n(r1)}) = ${n(-2 * r1 ** 3)} + ${n(3 * S * r1 * r1)} − ${n(6 * P * r1)} + ${n(c)} = ${n(low)} m. The clearance is ${n(low)} − ${n(H)} = ${n(cl)} m, so the drone ${cl > 0 ? 'stays above the lights' : 'dips below the lights and its path must be raised'}.`,
  guidance: [
   { prompt: `A″(t) = ${poly('t', [-12, 6 * S])}. Evaluate it at both critical points: A″(${n(r1)}), then A″(${n(r2)}).`, answer: [6 * d, -6 * d], explanation: `A″(${n(r1)}) = ${n(6 * d)} > 0: concave up, a local minimum, the bottom of the dip. A″(${n(r2)}) = ${n(-6 * d)} < 0: concave down, the top of the climb.` },
   { prompt: `What is the altitude at the bottom of the dip, A(${n(r1)})?`, answer: [low], explanation: `A(${n(r1)}) = ${n(-2 * r1 ** 3)} + ${n(3 * S * r1 * r1)} − ${n(6 * P * r1)} + ${n(c)} = ${n(low)} m.` },
   { prompt: `The lights are ${n(H)} m high. What is the clearance, A(${n(r1)}) − ${n(H)}?`, answer: [cl], explanation: `${n(low)} − ${n(H)} = ${n(cl)} m: ${cl > 0 ? 'the drone clears the lights' : 'too low, the drone would pass below the lights'}.` }
  ] }; }
});

practice({ id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q16', title: 'The service lift’s climb',
 brief: 'A service lift on the gantry tower sinks, climbs and sinks again under a faulty controller, and the engineers want its motion at the top of the climb.',
 labels: ['acceleration at the top (m/min²)', 'height at the top (m)', 'greatest upward velocity (m/min)'], tolerance: 0.01 },
 [['earlier critical time (min)', 'later critical time (min)'], ['s″ at the earlier time', 's″ at the later time'], ['height at the top (m)'], ['greatest upward velocity (m/min)']], {
 canonical: { r1: 2, r2: 8, c: 60 },
 /* s(t) = −t³ + 3mt² − 3·r1·r2·t + c with m = (r1 + r2) ÷ 2 whole, so s′(t) = −3(t − r1)(t − r2). The constant keeps the
    lowest point between 5 and 25 m. Never the critical points 1 and 5, which would rebuild q28's balloon. */
 draw: R => { let r1, r2; do { r1 = R.int(1, 3); r2 = r1 + 2 * R.int(1, 3); } while ((r1 === 1 && r2 === 5) || r2 > 8);
  return { r1, r2, c: -0.5 * r1 * r1 * (r1 - 3 * r2) + R.int(5, 25) }; },
 build: ({ r1, r2, c }) => { const m = (r1 + r2) / 2, P = r1 * r2, d = r2 - r1, top = -(r2 ** 3) + 3 * m * r2 * r2 - 3 * P * r2 + c, vmax = -3 * (m - r1) * (m - r2);
  return {
  prompt: `A service lift on the gantry tower has height s(t) = ${poly('t', [-1, 3 * m, -3 * P, c])} metres, t minutes after the operator starts it, for the first ${n(r2 + 1)} minutes: it first sinks, then climbs, then starts to sink again. Find its critical points and use the second derivative test to find when it reaches the top of its climb. Enter the lift’s acceleration at that moment in metres per minute per minute, then its height there, then the greatest upward velocity it reaches during the climb, in metres per minute.`,
  answer: [-3 * d, top, vmax],
  hints: ['The velocity is s′(t) and the acceleration is s″(t). The critical points are where the velocity is 0; take out −3 and factor.',
   'The top of the climb is the critical point where s″ < 0. The upward velocity is greatest where it stops increasing, which is where the acceleration s″ is 0.'],
  solution: `The velocity is s′(t) = ${poly('t', [-3, 6 * m, -3 * P])} = −3(t − ${n(r1)})(t − ${n(r2)}), which is 0 at t = ${n(r1)} and t = ${n(r2)}. The acceleration is s″(t) = ${poly('t', [-6, 6 * m])}. s″(${n(r1)}) = ${n(3 * d)} > 0, a cup: the bottom of the sink. s″(${n(r2)}) = ${n(-3 * d)} < 0, a cap: the top of the climb, where the acceleration is ${n(-3 * d)} m/min². The height there is s(${n(r2)}) = ${n(-(r2 ** 3))} + ${n(3 * m * r2 * r2)} − ${n(3 * P * r2)} + ${n(c)} = ${n(top)} m. The acceleration is 0 at t = ${n(m)}, the inflection point; the velocity is greatest there: s′(${n(m)}) = −3(${n(m - r1)})(${n(m - r2)}) = ${n(vmax)} m/min.`,
  guidance: [
   { prompt: `s′(t) = ${poly('t', [-3, 6 * m, -3 * P])} = −3(${poly('t', [1, -2 * m, P])}). When is the lift’s velocity zero? Enter the earlier time, then the later.`, answer: [r1, r2], explanation: `${poly('t', [1, -2 * m, P])} = (t − ${n(r1)})(t − ${n(r2)}), so the velocity is 0 at t = ${n(r1)} and t = ${n(r2)}.` },
   { prompt: `The acceleration is s″(t) = ${poly('t', [-6, 6 * m])}. Evaluate it at both critical times.`, answer: [3 * d, -3 * d], explanation: `s″(${n(r1)}) = ${n(3 * d)} > 0: a local minimum. s″(${n(r2)}) = ${n(-3 * d)} < 0: a local maximum, the top of the climb, where the lift is slowing at ${n(3 * d)} m/min².` },
   { prompt: `What is the height at the top of the climb, s(${n(r2)})?`, answer: [top], explanation: `s(${n(r2)}) = ${n(-(r2 ** 3))} + ${n(3 * m * r2 * r2)} − ${n(3 * P * r2)} + ${n(c)} = ${n(top)} m.` },
   { prompt: `The acceleration is 0 at t = ${n(m)}, so the upward velocity is greatest there. What is s′(${n(m)})?`, answer: [vmax], explanation: `s′(${n(m)}) = −3(${n(m - r1)})(${n(m - r2)}) = ${n(vmax)} m/min.` }
  ] }; }
});

/* ---- q29 Describing a curve from its derivatives ---- */
/* f(x) = 3x⁴ − 4(a + b)x³ + 6ab·x² + c has f′(x) = 12x(x − a)(x − b). */
const quartic = (a, b, c) => x => 3 * x ** 4 - 4 * (a + b) * x ** 3 + 6 * a * b * x * x + c;
practice({ id: 'q29b', parent: 'q29', kind: 'setting', title: 'Crest and dips of the apron road',
 brief: 'The service road across the launch apron runs over a crest between two dips, and the paving crew needs its shape before they resurface it.',
 labels: ['x of the deeper dip (m)', 'height of the deeper dip (cm)', 'f″ at the crest'], tolerance: 0.01 },
 [['smaller critical point', 'larger critical point'], ['height at the left dip (cm)', 'height at the right dip (cm)'], ['f″ at the crest']], {
 canonical: { a: -1, b: 2, c: 40 },
 /* One dip on each side of x = 0, never mirror images (a = −b would give the worked example's shape and equal dips).
    The constant keeps the deeper dip between 5 and 30 cm above the drain level. */
 draw: R => { let a, b; do { a = -R.int(1, 3); b = R.int(1, 3); } while (a === -b);
  const f = quartic(a, b, 0); return { a, b, c: -Math.min(f(a), f(b)) + R.int(5, 30) }; },
 build: ({ a, b, c }) => { const f = quartic(a, b, c), fa = f(a), fb = f(b), xd = fa < fb ? a : b, low = Math.min(fa, fb), S = a + b, P = a * b;
  return {
  prompt: `The service road across the launch apron rises over a crest between two dips. Its height above the drain level is f(x) = ${poly('x', [3, -4 * S, 6 * P, 0, c])} centimetres, x metres along the road from the marker post (negative on the tower side). Describe it from its derivatives: enter the x of the deeper dip, then the height there, then the second derivative f″ at the crest.`,
  answer: [xd, low, 12 * P],
  hints: ['f′(x) is 12x times a quadratic. Factor the quadratic to find the other two critical points.',
   'The dips are the critical points where f′ changes from − to +, and the crest is where it changes from + to −. Compare the heights of the two dips.'],
  solution: `f′(x) = ${poly('x', [12, -12 * S, 12 * P, 0])} = 12x(${poly('x', [1, -S, P])}) = 12x${fac('x', a)}${fac('x', b)}, so the critical points are ${n(a)}, 0 and ${n(b)}. f′ is negative before ${n(a)}, positive between ${n(a)} and 0, negative between 0 and ${n(b)}, and positive after ${n(b)}: dips at ${n(a)} and ${n(b)}, the crest at 0. f(${n(a)}) = ${terms([3, -4 * S, 6 * P, 0, c], a)} = ${n(fa)} and f(${n(b)}) = ${terms([3, -4 * S, 6 * P, 0, c], b)} = ${n(fb)}, so the deeper dip is at x = ${n(xd)}, ${n(low)} cm above the drain level. f″(x) = ${poly('x', [36, -24 * S, 12 * P])}, so f″(0) = ${n(12 * P)}, negative: a cap, as a crest should be.`,
  guidance: [
   { prompt: `f′(x) = ${poly('x', [12, -12 * S, 12 * P, 0])} = 12x(${poly('x', [1, -S, P])}). Besides x = 0, which two x make f′ zero? Enter the smaller, then the larger.`, answer: [a, b], explanation: `${poly('x', [1, -S, P])} = ${fac('x', a)}${fac('x', b)}, so the critical points are ${n(a)}, 0 and ${n(b)}. The signs of f′ in the four gaps are −, +, −, +: dips at ${n(a)} and ${n(b)}, the crest at 0.` },
   { prompt: `Find the heights of the two dips: f(${n(a)}), then f(${n(b)}).`, answer: [fa, fb], explanation: `f(${n(a)}) = ${terms([3, -4 * S, 6 * P, 0, c], a)} = ${n(fa)} and f(${n(b)}) = ${terms([3, -4 * S, 6 * P, 0, c], b)} = ${n(fb)}. The deeper dip is the lower one, at x = ${n(xd)}.` },
   { prompt: `f″(x) = ${poly('x', [36, -24 * S, 12 * P])}. What is f″(0), at the crest?`, answer: [12 * P], explanation: `f″(0) = ${n(12 * P)}, negative: concave down, so x = 0 is indeed the crest.` }
  ] }; }
});

practice({ id: 'q29c', parent: 'q29', kind: 'applied', title: 'Placing the trench sump pump',
 brief: 'Rainwater collects in the gantry’s cable trench, and the crew must put the sump pump at the lowest point of its floor.',
 labels: ['x of the lowest point (m)', 'height of the lowest point (cm)'], tolerance: 0.01 },
 [['smaller critical point', 'larger critical point'], ['height at x = 0 (cm)', 'height at the other valley (cm)'], ['x of the lowest point (m)']], {
 canonical: { a: 1, b: 4, c: 150 },
 /* Valleys at 0 and b with a hill at a between them. f(b) − f(0) = b³(2a − b), so the lower valley is b when 2a < b and 0
    when 2a > b; 2a = b (equal valleys) and the critical points 1 and 3 of q29 are never drawn. */
 draw: R => { const [a, b] = R.pick([[1, 4], [2, 3], [2, 5], [3, 4], [3, 5]]);
  return { a, b, c: Math.max(0, -(b ** 3) * (2 * a - b)) + R.int(10, 40) }; },
 build: ({ a, b, c }) => { const f = quartic(a, b, c), fb = f(b), xl = fb < c ? b : 0, low = Math.min(c, fb), S = a + b, P = a * b;
  return {
  prompt: `Rainwater runs into the gantry’s cable trench and collects at the lowest point of its floor, where the sump pump must go. The floor’s height above the drain datum is f(x) = ${poly('x', [3, -4 * S, 6 * P, 0, c])} centimetres, x metres along the trench from its marker post. Where should the pump go? Enter the x of the lowest point of the floor, then its height.`,
  answer: [xl, low],
  hints: ['Water collects in a valley of the floor. Find the critical points, where f′(x) is zero; f′ is 12x times a quadratic.',
   'There are two valleys. Compare their heights: the pump goes at the lower one.'],
  solution: `f′(x) = ${poly('x', [12, -12 * S, 12 * P, 0])} = 12x(x − ${n(a)})(x − ${n(b)}), so the critical points are 0, ${n(a)} and ${n(b)}. f′ is negative before 0, positive between 0 and ${n(a)}, negative between ${n(a)} and ${n(b)}, and positive after ${n(b)}: valleys at 0 and ${n(b)}, a hump at ${n(a)}. f(0) = ${n(c)} and f(${n(b)}) = ${terms([3, -4 * S, 6 * P, 0, c], b)} = ${n(fb)}, so the lowest point is at x = ${n(xl)}, ${n(low)} cm above the datum. The pump goes there.`,
  guidance: [
   { prompt: `f′(x) = ${poly('x', [12, -12 * S, 12 * P, 0])} = 12x(${poly('x', [1, -S, P])}). Besides x = 0, which two x make f′ zero? Enter the smaller, then the larger.`, answer: [a, b], explanation: `${poly('x', [1, -S, P])} = (x − ${n(a)})(x − ${n(b)}). With x = 0 the critical points are 0, ${n(a)} and ${n(b)}, and the signs of f′ between them are −, +, −, +.` },
   { prompt: `So the floor has valleys at x = 0 and x = ${n(b)}, with a hump at ${n(a)} between them. Enter f(0), then f(${n(b)}).`, answer: [c, fb], explanation: `f(0) = ${n(c)} and f(${n(b)}) = ${terms([3, -4 * S, 6 * P, 0, c], b)} = ${n(fb)}.` },
   { prompt: `Which valley is lower? Enter its x.`, answer: [xl], explanation: `${n(low)} is lower than ${n(Math.max(c, fb))}, so the water collects at x = ${n(xl)}, ${n(low)} cm above the datum.` }
  ] }; }
});

/* Whole-number critical points p < q < r whose sum is a multiple of 3, so f(x) = x⁴ − (4/3)(p + q + r)x³ + … has whole
   coefficients. Not −2, 0, 2 (the q29 worked example). */
const TRIPLES = [[-3, -2, 2], [-3, 1, 2], [-2, -1, 3], [-2, 2, 3], [-1, 0, 4], [-1, 3, 4], [-3, -1, 1], [-1, 1, 3], [-2, 1, 4], [0, 2, 4]];
const quarticPQR = (p, q, r) => { const S = p + q + r, Q = p * q + p * r + q * r, Rr = p * q * r; return [1, -4 * S / 3, 2 * Q, -4 * Rr]; };
practice({ id: 'q29d', parent: 'q29', kind: 'challenge', title: 'Reading the blast wall’s edge',
 brief: 'The top edge of the blast wall beside the flame trench has an uneven profile, and the inspectors want its high and low points from the formula alone.',
 labels: ['x of the local maximum (m)', 'height at the local maximum (cm)', 'height of the lowest point (cm)'], tolerance: 0.01 },
 [['smallest critical point', 'middle critical point', 'largest critical point'], ['height at the local maximum (cm)'], ['height at the left valley (cm)', 'height at the right valley (cm)']], {
 canonical: { p: -3, q: 1, r: 2, c: 125 },
 /* The constant keeps the lowest point between 5 and 30 cm above the base line. */
 draw: R => { const [p, q, r] = R.pick(TRIPLES), cs = quarticPQR(p, q, r), f = x => cs[0] * x ** 4 + cs[1] * x ** 3 + cs[2] * x * x + cs[3] * x;
  return { p, q, r, c: -Math.min(f(p), f(r)) + R.int(5, 30) }; },
 build: ({ p, q, r, c }) => { const cs = quarticPQR(p, q, r), f = x => cs[0] * x ** 4 + cs[1] * x ** 3 + cs[2] * x * x + cs[3] * x + c, d = [4, 3 * cs[1], 2 * cs[2], cs[3]];
  const fp = f(p), fq = f(q), fr = f(r), low = Math.min(fp, fr);
  return {
  prompt: `The top edge of the blast wall beside the flame trench is cut to the profile f(x) = ${poly('x', [...cs, c])} centimetres above the wall’s base line, x metres along the wall from its middle (negative to the west). Its three critical points are whole numbers. Describe it from its derivatives: enter the x of its local maximum, then the height there, then the height of the edge’s lowest point.`,
  answer: [q, fq, low],
  hints: ['f′(x) is a cubic. Put small whole numbers into it: each one that gives 0 is a critical point.',
   'The x⁴ term is positive, so the edge rises on both far sides: the outer two critical points are valleys and the middle one is the hill. Compare the two valleys to find the lowest point.'],
  solution: `f′(x) = ${poly('x', d)} = 4${fac('x', p)}${fac('x', q)}${fac('x', r)}, so the critical points are ${n(p)}, ${n(q)} and ${n(r)}. f′ is negative before ${n(p)}, positive between ${n(p)} and ${n(q)}, negative between ${n(q)} and ${n(r)}, and positive after ${n(r)}: valleys at ${n(p)} and ${n(r)}, the local maximum at x = ${n(q)}, where f(${n(q)}) = ${terms([...cs, c], q)} = ${n(fq)} cm. The valleys have f(${n(p)}) = ${terms([...cs, c], p)} = ${n(fp)} and f(${n(r)}) = ${terms([...cs, c], r)} = ${n(fr)}, so the lowest point of the edge is ${n(low)} cm above the base line.`,
  guidance: [
   { prompt: `f′(x) = ${poly('x', d)}. Its three roots are whole numbers from −3 to 4: test them. Enter the roots from smallest to largest.`, answer: [p, q, r], explanation: `f′ is 0 at ${n(p)}, ${n(q)} and ${n(r)}, so f′(x) = 4${fac('x', p)}${fac('x', q)}${fac('x', r)}. Its signs in the four gaps are −, +, −, +.` },
   { prompt: `The signs −, +, −, + make x = ${n(q)} the local maximum. What is f(${n(q)})?`, answer: [fq], explanation: `f(${n(q)}) = ${terms([...cs, c], q)} = ${n(fq)} cm.` },
   { prompt: `The valleys are at x = ${n(p)} and x = ${n(r)}. Enter f(${n(p)}), then f(${n(r)}).`, answer: [fp, fr], explanation: `f(${n(p)}) = ${terms([...cs, c], p)} = ${n(fp)} and f(${n(r)}) = ${terms([...cs, c], r)} = ${n(fr)}. The lower of the two, ${n(low)} cm, is the lowest point of the edge.` }
  ] }; }
});

/* ---- q30 Absolute maximum and minimum on a closed interval ---- */
practice({ id: 'q30b', parent: 'q30', kind: 'setting', title: 'Tuning the fan blade pitch',
 brief: 'A cooling fan for the studio’s test rig can be built at any blade pitch in a fixed range, and the designers want its best and worst airflow across that range.',
 labels: ['largest airflow (L/s)', 'pitch that gives it', 'smallest airflow (L/s)'], tolerance: 0.01 },
 [['critical point x'], ['F at 0', 'F at the critical point', 'F at the right end'], ['largest airflow (L/s)', 'smallest airflow (L/s)']], {
 canonical: { s: 3, e: 5, c: 12 },
 /* F(x) = −x³ + 3s²x + c on [0, e] with s < e: the maximum is at the critical point s and the minimum at an end
    (e² = 3s² never happens, so the ends never tie). The constant keeps the smallest airflow between 5 and 30. */
 draw: R => { const s = R.int(1, 4), e = R.int(s + 1, 2 * s + 1), fe = e * (3 * s * s - e * e); return { s, e, c: Math.max(0, -fe) + R.int(5, 30) }; },
 build: ({ s, e, c }) => { const k = 3 * s * s, F = x => -(x ** 3) + k * x + c, fs = F(s), fe = F(e), mx = Math.max(c, fs, fe), mn = Math.min(c, fs, fe);
  return {
  prompt: `In the design studio, a cooling fan for the test rig can be built with any blade pitch x from 0 to ${n(e)}. Its airflow is F(x) = ${poly('x', [-1, 0, k, c])} litres per second. Enter the largest airflow any pitch in this range gives, then the pitch that gives it, then the smallest airflow in the range.`,
  answer: [mx, s, mn],
  hints: ['On a closed range the largest and smallest values are at a critical point inside it or at one of the two ends. Find where F′(x) = 0 first.',
   'Evaluate F at the critical point and at both ends, then compare the three values.'],
  solution: `F′(x) = ${poly('x', [-3, 0, k])} = −3(x² − ${n(s * s)}), which is 0 at x = ${n(s)} (and at ${n(-s)}, outside the range). The candidates: F(0) = ${n(c)}, F(${n(s)}) = ${n(fs)} and F(${n(e)}) = ${n(fe)}. The largest is ${n(mx)}, at pitch ${n(s)}, and the smallest is ${n(mn)}, at the ${mn === c ? 'left end, x = 0' : `right end, x = ${n(e)}`}.`,
  guidance: [
   { prompt: `F′(x) = ${poly('x', [-3, 0, k])}. Which x between 0 and ${n(e)} makes F′(x) = 0?`, answer: [s], explanation: `3x² = ${n(k)} gives x² = ${n(s * s)}, so x = ${n(s)} (the other root, ${n(-s)}, is outside the range).` },
   { prompt: `Evaluate F at the three candidates: F(0), F(${n(s)}), F(${n(e)}).`, answer: [c, fs, fe], explanation: `F(0) = ${n(c)}, F(${n(s)}) = ${n(fs)} and F(${n(e)}) = ${n(fe)}.` },
   { prompt: `Compare ${n(c)}, ${n(fs)} and ${n(fe)}. Enter the largest, then the smallest.`, answer: [mx, mn], explanation: `The largest airflow is ${n(mx)} L/s, at the critical point; the smallest is ${n(mn)} L/s, at an end of the range.` }
  ] }; }
});

practice({ id: 'q30c', parent: 'q30', kind: 'applied', title: 'Hottest setting on the heater dial',
 brief: 'A battery heater is being tuned in the design studio, and the cells must never pass their temperature limit at any dial setting.',
 labels: ['hottest temperature (°C)', 'margin below the limit (°C)'], tolerance: 0.01 },
 [['smaller critical point', 'larger critical point'], ['T at 0', 'T at the smaller critical point', 'T at the larger critical point', 'T at the right end'], ['margin below the limit (°C)']], {
 canonical: { r1: 1, r2: 3, e: 5, c: 25, lim: 60 },
 /* T(x) = 2x³ − 3(r1 + r2)x² + 6·r1·r2·x + c on [0, e], with both critical points inside: the hottest value is at r1 or
    at the right end, depending on the draw. Settings whose hottest value would pass 85 °C are not drawn; the coolest is
    at least 4 °C. The limit is at least 2 °C above T(0) and the margin is never 0. */
 draw: R => { let r1, r2, e; do { r1 = R.int(1, 2); r2 = r1 + R.int(1, 3); e = r2 + R.int(1, 2); } while (r1 === 2 && e - r2 === 2 && r2 > 3);
  const c = R.int(20, 30);
  const T = x => 2 * x ** 3 - 3 * (r1 + r2) * x * x + 6 * r1 * r2 * x + c, mx = Math.max(c, T(r1), T(r2), T(e));
  return { r1, r2, e, c, lim: mx + R.except(Math.max(-8, c + 2 - mx), 25, [0]) }; },
 build: ({ r1, r2, e, c, lim }) => { const S = r1 + r2, P = r1 * r2, T = x => 2 * x ** 3 - 3 * S * x * x + 6 * P * x + c;
  const t1 = T(r1), t2 = T(r2), te = T(e), mx = Math.max(c, t1, t2, te), mg = lim - mx;
  return {
  prompt: `In the design studio a battery heater is being tuned. With its dial at setting x, anywhere from 0 to ${n(e)}, the cells settle at T(x) = ${poly('x', [2, -3 * S, 6 * P, c])} °C. The cells must never go above ${n(lim)} °C. Enter the hottest temperature any setting on the dial can give, then the margin: ${n(lim)} minus that temperature (negative if some setting breaks the limit).`,
  answer: [mx, mg],
  hints: ['The hottest value on the dial is at a critical point inside the range or at one of the two ends. Find the critical points from T′(x) = 0.',
   'Compare T at all four candidates; the largest is the hottest the cells can get. Then subtract it from the limit.'],
  solution: `T′(x) = ${poly('x', [6, -6 * S, 6 * P])} = 6(x − ${n(r1)})(x − ${n(r2)}), which is 0 at x = ${n(r1)} and x = ${n(r2)}, both on the dial. The candidates: T(0) = ${n(c)}, T(${n(r1)}) = ${n(t1)}, T(${n(r2)}) = ${n(t2)} and T(${n(e)}) = ${n(te)}. The hottest is ${n(mx)} °C, at ${t1 === te ? `both x = ${n(r1)} and the end of the dial, x = ${n(e)}` : mx === te ? `the end of the dial, x = ${n(e)}` : `the critical point x = ${n(r1)}`}. The margin is ${n(lim)} − ${n(mx)} = ${n(mg)} °C, so ${mg > 0 ? 'every setting is safe' : 'some settings break the limit and the dial must be restricted'}.`,
  guidance: [
   { prompt: `T′(x) = ${poly('x', [6, -6 * S, 6 * P])} = 6(${poly('x', [1, -S, P])}). Which two settings make it zero? Enter the smaller, then the larger.`, answer: [r1, r2], explanation: `${poly('x', [1, -S, P])} = (x − ${n(r1)})(x − ${n(r2)}), so x = ${n(r1)} and x = ${n(r2)}, both between 0 and ${n(e)}.` },
   { prompt: `Evaluate T at the four candidates: T(0), T(${n(r1)}), T(${n(r2)}), T(${n(e)}).`, answer: [c, t1, t2, te], explanation: `T(0) = ${n(c)}, T(${n(r1)}) = ${n(t1)}, T(${n(r2)}) = ${n(t2)} and T(${n(e)}) = ${n(te)}. The largest is ${n(mx)} °C.` },
   { prompt: `The hottest the cells get is ${n(mx)} °C. What is the margin, ${n(lim)} − ${n(mx)}?`, answer: [mg], explanation: `${n(lim)} − ${n(mx)} = ${n(mg)} °C: ${mg > 0 ? 'the limit holds at every setting' : 'the limit is broken, so part of the dial must be blocked off'}.` }
  ] }; }
});

/* (k, left end, right end) with the critical point k inside, chosen so that H at both ends has at most two decimals
   for every A = 2k·M, and the two ends never tie. */
const PANELS = [];
for (let k = 2; k <= 6; k++) for (let L = 1; L < k; L++) for (let R = k + 1; R <= 3 * k; R++) {
 const ok = [2, 3, 4, 5, 6, 7, 8, 9].every(M => { const A = 2 * k * M, h = x => A * x / (x * x + k * k), t = x => Math.abs(Math.round(x * 100) - x * 100) < 1e-9; return t(h(L)) && t(h(R)) && Math.abs(h(L) - h(R)) > 1e-9; });
 if (ok) PANELS.push([k, L, R]);
}
practice({ id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q19', title: 'Tilting the radiant panel',
 brief: 'A radiant heat panel warms test samples in the design studio, and the team wants the tilt that delivers the most heat and the least it delivers in its range.',
 labels: ['tilt setting for the most heat', 'most heat (W)', 'least heat (W)'], tolerance: 0.005 },
 [['critical point x'], ['H at the left end', 'H at the critical point', 'H at the right end'], ['most heat (W)', 'least heat (W)']], {
 canonical: { A: 24, k: 3, L: 1, R: 4 },
 draw: R => { const [k, L, Rr] = R.pick(PANELS); return { A: 2 * k * R.int(2, 9), k, L, R: Rr }; },
 build: ({ A, k, L, R }) => { const K = k * k, H = x => A * x / (x * x + K), hL = H(L), hk = H(k), hR = H(R), mn = Math.min(hL, hR);
  return {
  prompt: `In the design studio a radiant panel warms a test sample. With the panel at tilt setting x, anywhere from ${n(L)} to ${n(R)}, the heat reaching the sample is H(x) = ${n(A)}x ÷ (x² + ${n(K)}) watts. Use the quotient rule to find the critical point. Enter the tilt setting that gives the most heat, then the most heat, then the least heat over the range (give decimals, not fractions).`,
  answer: [k, hk, mn],
  hints: [`By the quotient rule, H′(x) = (${n(A)}(x² + ${n(K)}) − ${n(A)}x × 2x) ÷ (x² + ${n(K)})². The bottom is never 0, so set the top equal to 0.`,
   'Compare H at the critical point inside the range and at both ends.'],
  solution: `By the quotient rule, H′(x) = (${n(A)}(x² + ${n(K)}) − ${n(A)}x × 2x) ÷ (x² + ${n(K)})² = ${n(A)}(${n(K)} − x²) ÷ (x² + ${n(K)})². The top is 0 when x² = ${n(K)}, so x = ${n(k)} (the root ${n(-k)} is outside the range). The candidates: H(${n(L)}) = ${n(A * L)} ÷ ${n(L * L + K)} = ${n(hL)}, H(${n(k)}) = ${n(A * k)} ÷ ${n(2 * K)} = ${n(hk)} and H(${n(R)}) = ${n(A * R)} ÷ ${n(R * R + K)} = ${n(hR)}. The most heat is ${n(hk)} W, at tilt ${n(k)}; the least is ${n(mn)} W, at the ${mn === hL ? 'left' : 'right'} end.`,
  guidance: [
   { prompt: `The quotient rule gives H′(x) = ${n(A)}(${n(K)} − x²) ÷ (x² + ${n(K)})². Which x between ${n(L)} and ${n(R)} makes it 0?`, answer: [k], explanation: `${n(K)} − x² = 0 gives x = ${n(k)}; ${n(-k)} is outside the range. H′ is positive before ${n(k)} and negative after it.` },
   { prompt: `Evaluate H at the three candidates: H(${n(L)}), H(${n(k)}), H(${n(R)}).`, answer: [hL, hk, hR], explanation: `H(${n(L)}) = ${n(A * L)} ÷ ${n(L * L + K)} = ${n(hL)}, H(${n(k)}) = ${n(A * k)} ÷ ${n(2 * K)} = ${n(hk)} and H(${n(R)}) = ${n(A * R)} ÷ ${n(R * R + K)} = ${n(hR)}.` },
   { prompt: `Compare the three values. Enter the largest, then the smallest.`, answer: [hk, mn], explanation: `The most heat is ${n(hk)} W at the critical point, and the least is ${n(mn)} W at the ${mn === hL ? 'left' : 'right'} end.` }
  ] }; }
});
})();
