/* Calculus 1 practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions". The worked sample is q01b in practice-1.js.
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored text exactly. Here the authored text is taken from build(canonical) by mk(), so the two
   cannot drift apart. Oracles: qa/realms/calc1/oracle-p2.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* mk(meta, stepLabels, generator): the authored prompt, answers, hints, solution and guided steps are build(canonical),
   cleaned exactly as the engine cleans a generated build. meta = {id, parent, kind, title, brief, labels, tolerance, uses?}. */
const mk = (meta, stepLabels, gen) => { const b = gen.build(gen.canonical); add({ ...meta,
 prompt: G.clean(b.prompt), answer: b.answer.map(G.tidy), hints: b.hints.map(G.clean), solution: G.clean(b.solution),
 guidance: b.guidance.map((s, i) => ({ prompt: G.clean(s.prompt), answer: s.answer.map(G.tidy), labels: stepLabels[i], explanation: G.clean(s.explanation) })) }, gen); };

/* Signed terms: trm(−1, 'x') is '− x', trm(3, 'x') is '+ 3x'; cst(−4) is '− 4'.
   quad('x', B, C, A) is 'Ax² + Bx + C' with zero terms left out and no coefficient 1 written. */
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
const quad = (x, B, C, A = 1) => [`${A === 1 ? '' : n(A)}${x}²`, B ? trm(B, x) : '', C ? cst(C) : ''].filter(Boolean).join(' ');
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = k => String(k).split('').map(d => SUP[d]).join('');
const r2 = v => Math.round(v * 100) / 100;
const dec = (v, places) => Math.abs(v * 10 ** places - Math.round(v * 10 ** places)) < 1e-9;
/* Halving: `times` steps from [lo, hi], each keeping the half whose ends give f opposite signs. */
const halve = (f, lo, hi, times) => { const steps = []; for (let i = 0; i < times; i++) { const m = (lo + hi) / 2, v = f(m); if (Math.sign(v) === Math.sign(f(lo))) lo = m; else hi = m; steps.push({ m, v, lo, hi }); } return steps; };
const sign = v => v > 0 ? 'positive' : 'negative';

/* ---- q06 One-sided limits ---- */
/* Antenna motor current: a straight piece while slewing (t < c) and a 0 ÷ 0 piece after lock-on (t > c), the reverse
   of the parent's order. I = mt + k on the left, (t − c)(t + e) ÷ (t − c) on the right; the jump is never 0. */
mk({ id: 'q06b', parent: 'q06', kind: 'setting',
 title: 'The antenna that locks on with a kick',
 brief: 'The tracking antenna’s motor current changes formula the moment it locks on to a satellite, and the crew wants the size of the kick.',
 labels: ['left-hand limit (A)', 'right-hand limit (A)', 'jump (A)'], tolerance: 0.01 },
 [['left-hand limit (A)'], ['right-hand limit (A)'], ['jump (A)']], {
 canonical: { c: 3, m: 4, k: 2, e: 5 },
 draw: R => { let p; do { p = { c: R.int(2, 5), m: R.int(2, 5), k: R.int(1, 9), e: R.int(1, 15) }; } while (p.m * p.c + p.k === p.c + p.e); return p; },
 build: ({ c, m, k, e }) => { const top = quad('t', e - c, -c * e), L = m * c + k, Rv = c + e, J = Rv - L, fac = `t ${cst(e)}`; return {
  prompt: `A tracking antenna’s drive motor draws a current in two pieces: I(t) = ${n(m)}t + ${n(k)} amps for t < ${n(c)}, while the antenna swings round, and I(t) = (${top}) ÷ (t − ${n(c)}) amps for t > ${n(c)}, once it has locked on, with t in seconds. Enter the limit of I(t) as t approaches ${n(c)} from the left, then from the right, then the jump in current at lock-on: the right-hand limit minus the left-hand limit.`,
  answer: [L, Rv, J],
  hints: [`From the left only the swinging piece counts, and it has no trouble at t = ${n(c)}: substitute.`, `From the right the second piece gives 0 ÷ 0 at t = ${n(c)}. Its top is 0 there, so t − ${n(c)} is one of its factors: factor and cancel before you substitute.`],
  solution: `From the left, I(t) = ${n(m)}t + ${n(k)} approaches ${n(m)} × ${n(c)} + ${n(k)} = ${n(L)}, so lim t→${n(c)}⁻ I(t) = ${n(L)} amps. From the right, ${top} = (t − ${n(c)})(${fac}), so for t > ${n(c)} the current is I(t) = ${fac}, which approaches ${n(c)} ${cst(e)} = ${n(Rv)}. So lim t→${n(c)}⁺ I(t) = ${n(Rv)} amps. The jump is ${n(Rv)} − ${n(L)} = ${n(J)}: the current ${J > 0 ? 'jumps up' : 'drops'} by ${n(Math.abs(J))} amps at lock-on, and the two-sided limit at t = ${n(c)} does not exist.`,
  guidance: [
   { prompt: `Left of ${n(c)}: what does ${n(m)}t + ${n(k)} approach as t approaches ${n(c)}?`, answer: [L], explanation: `${n(m)} × ${n(c)} + ${n(k)} = ${n(L)}, so the left-hand limit is ${n(L)} amps.` },
   { prompt: `Right of ${n(c)}: ${top} = (t − ${n(c)})(${fac}). Cancel t − ${n(c)}. What does ${fac} approach as t approaches ${n(c)}?`, answer: [Rv], explanation: `${n(c)} ${cst(e)} = ${n(Rv)}, so the right-hand limit is ${n(Rv)} amps.` },
   { prompt: `What is the right-hand limit minus the left-hand limit, ${n(Rv)} − ${n(L)}?`, answer: [J], explanation: `${n(Rv)} − ${n(L)} = ${n(J)}. The current ${J > 0 ? 'jumps up' : 'drops'} by ${n(Math.abs(J))} amps at the moment of lock-on.` }
  ] }; }
});

/* Battery swap: C(t) = p − qt before the swap at t = a, r − qt after. The pre-swap level L = p − qa is the left-hand
   limit; the jump is qj, so the charge is back at L at t = a + j, a whole number of hours. Charges stay within 0–100,
   and a fresh pack adds at least 30 points. */
mk({ id: 'q06c', parent: 'q06', kind: 'applied',
 title: 'The beacon battery swap',
 brief: 'The relay beacon got a fresh battery pack mid-shift, and the crew wants to know how much charge it gained and when it will be back where it was.',
 labels: ['charge just before the swap (%)', 'jump at the swap (points)', 'time back at that level (h)'], tolerance: 0.01 },
 [['charge just before the swap (%)'], ['jump at the swap (points)'], ['time t (h)']], {
 canonical: { p: 70, q: 5, a: 6, r: 100 },
 draw: R => { let p; do { const q = R.int(2, 5), a = R.int(3, 8), L = R.int(8, 30), j = R.int(6, 16); p = { p: L + q * a, q, a, r: L + q * (a + j) }; } while (p.r > 100 || p.r - p.p < 30); return p; },
 build: ({ p, q, a, r }) => { const L = p - q * a, Rv = r - q * a, J = Rv - L, T = (r - L) / q; return {
  prompt: `The relay beacon on the Tracking Station mast drains its battery at a steady rate. Its charge is C(t) = ${n(p)} − ${n(q)}t percent for t < ${n(a)}, with t in hours. At t = ${n(a)} the crew swaps in a fresh pack, and from then on C(t) = ${n(r)} − ${n(q)}t percent. Enter the charge the beacon was heading for just before the swap (the left-hand limit at t = ${n(a)}), then the jump in charge at the swap, then the time t at which the charge has drained back down to that pre-swap level.`,
  answer: [L, J, T],
  hints: [`Just before the swap t is still below ${n(a)}, so only the first formula counts: let t approach ${n(a)} in it.`, `The jump is the right-hand limit minus the left-hand limit. For the time, set the second formula equal to the pre-swap charge and solve for t.`],
  solution: `For t < ${n(a)}, C(t) = ${n(p)} − ${n(q)}t approaches ${n(p)} − ${n(q)} × ${n(a)} = ${n(L)}, so lim t→${n(a)}⁻ C(t) = ${n(L)} percent. For t ≥ ${n(a)}, C(t) = ${n(r)} − ${n(q)}t approaches ${n(r)} − ${n(q)} × ${n(a)} = ${n(Rv)}, so lim t→${n(a)}⁺ C(t) = ${n(Rv)} percent. The jump is ${n(Rv)} − ${n(L)} = ${n(J)} percentage points. The charge is back at ${n(L)} percent when ${n(r)} − ${n(q)}t = ${n(L)}, that is ${n(q)}t = ${n(r)} − ${n(L)} = ${n(r - L)}, so t = ${n(r - L)} ÷ ${n(q)} = ${n(T)} hours.`,
  guidance: [
   { prompt: `Before the swap only ${n(p)} − ${n(q)}t is in use. What does it approach as t approaches ${n(a)}?`, answer: [L], explanation: `${n(p)} − ${n(q)} × ${n(a)} = ${n(p)} − ${n(q * a)} = ${n(L)}. That is the charge the beacon was heading for just before the swap.` },
   { prompt: `After the swap, ${n(r)} − ${n(q)}t approaches ${n(r)} − ${n(q * a)} = ${n(Rv)} as t approaches ${n(a)}. What is the jump, ${n(Rv)} − ${n(L)}?`, answer: [J], explanation: `${n(Rv)} − ${n(L)} = ${n(J)}, so the fresh pack added ${n(J)} percentage points at once.` },
   { prompt: `When is the charge back at ${n(L)} percent? Solve ${n(r)} − ${n(q)}t = ${n(L)} for t.`, answer: [T], explanation: `${n(q)}t = ${n(r)} − ${n(L)} = ${n(r - L)}, so t = ${n(r - L)} ÷ ${n(q)} = ${n(T)} hours.` }
  ] }; }
});

/* Both pieces are 0 ÷ 0 at the switch: (x − c)(x + e1) on the left, 2(x − c)(x + e2) on the right (take out 2 first).
   e1, e2 are never 0 or −c, and the one-sided limits differ. */
mk({ id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q05',
 title: 'Two holes at the dish drive',
 brief: 'Both rules of the dish drive’s error signal break down at the switch setting, and Mira wants each side’s limit and the jump between them.',
 labels: ['left-hand limit', 'right-hand limit', 'jump'], tolerance: 0.01 },
 [['h', 'left-hand limit'], ['j', 'right-hand limit'], ['jump']], {
 canonical: { c: 4, e1: -1, e2: 3 },
 draw: R => { let p; do { const c = R.int(3, 8); p = { c, e1: R.except(-9, 9, [0, -c]), e2: R.except(-9, 9, [0, -c]) }; } while (p.c + p.e1 === 2 * (p.c + p.e2)); return p; },
 build: ({ c, e1, e2 }) => { const t1 = quad('x', e1 - c, -c * e1), t2 = quad('x', 2 * (e2 - c), -2 * c * e2, 2), in2 = quad('x', e2 - c, -c * e2),
  L = c + e1, Rv = 2 * (c + e2), J = Rv - L, f1 = `x ${cst(e1)}`, f2 = `x ${cst(e2)}`; return {
  prompt: `The tracking dish’s drive reports an error signal in two pieces: E(x) = (${t1}) ÷ (x − ${n(c)}) for x < ${n(c)} and E(x) = (${t2}) ÷ (x − ${n(c)}) for x > ${n(c)}, where x is the drive setting. Neither piece has a value at x = ${n(c)}. Enter the left-hand limit of E(x) as x approaches ${n(c)}, then the right-hand limit, then the jump from left to right (right-hand limit minus left-hand limit).`,
  answer: [L, Rv, J],
  hints: [`Each piece gives 0 ÷ 0 at x = ${n(c)}, so each top has x − ${n(c)} as a factor. Factor, cancel x − ${n(c)}, then substitute.`, 'Every number in the right-hand top is even: take out 2 before you factor what is left.'],
  solution: `Left of ${n(c)}: ${t1} = (x − ${n(c)})(${f1}), so E(x) = ${f1}, which approaches ${n(c)} ${cst(e1)} = ${n(L)}. So lim x→${n(c)}⁻ E(x) = ${n(L)}. Right of ${n(c)}: ${t2} = 2(${in2}) = 2(x − ${n(c)})(${f2}), so E(x) = 2(${f2}), which approaches 2 × ${par(c + e2)} = ${n(Rv)}. So lim x→${n(c)}⁺ E(x) = ${n(Rv)}. The jump is ${n(Rv)} − ${par(L)} = ${n(J)}, so the two-sided limit at x = ${n(c)} does not exist.`,
  guidance: [
   { prompt: `Left of ${n(c)}: ${t1} = (x − ${n(c)})(x + h). What is h, and what does x + h approach as x approaches ${n(c)}?`, answer: [e1, L], explanation: `h = ${n(e1)}, because −${n(c)} × ${par(e1)} = ${n(-c * e1)} and −${n(c)} + ${par(e1)} = ${n(e1 - c)}. So E(x) = ${f1} for x < ${n(c)}, which approaches ${n(L)}.` },
   { prompt: `Right of ${n(c)}: take out 2, so ${t2} = 2(${in2}) = 2(x − ${n(c)})(x + j). What is j, and what does 2(x + j) approach as x approaches ${n(c)}?`, answer: [e2, Rv], explanation: `j = ${n(e2)}, because −${n(c)} × ${par(e2)} = ${n(-c * e2)}. So E(x) = 2(${f2}) for x > ${n(c)}, which approaches 2 × ${par(c + e2)} = ${n(Rv)}.` },
   { prompt: `What is the jump, ${n(Rv)} − ${par(L)}?`, answer: [J], explanation: `${n(Rv)} − ${par(L)} = ${n(J)}. The one-sided limits differ, so the signal jumps at x = ${n(c)}.` }
  ] }; }
});

/* ---- q07 Continuity at a point ---- */
/* The unknown is a slope this time: P = x² + a for x < c, kx − b for x ≥ c, with a = kc − b − c² ≥ 1. */
mk({ id: 'q07b', parent: 'q07', kind: 'setting',
 title: 'No pressure step at the pipe joint',
 brief: 'A coolant pipe changes bore at a joint, and the pressure rule beyond the joint needs a slope that meets the rule before it.',
 labels: ['left-hand limit (kPa)', 'k'], tolerance: 0.01 },
 [['left-hand limit (kPa)'], ['multiple of k'], ['k']], {
 canonical: { c: 4, k: 6, b: 3 },
 draw: R => { let p; do { p = { c: R.int(2, 5), k: R.int(2, 12), b: R.int(1, 9) }; } while (p.k * p.c - p.b - p.c * p.c < 1 || p.k * p.c - p.b - p.c * p.c > 40); return p; },
 build: ({ c, k, b }) => { const a = k * c - b - c * c, L = c * c + a; return {
  prompt: `Along a coolant pipe at Flow Control the pressure is P(x) = x² + ${n(a)} kPa for x < ${n(c)} and P(x) = kx − ${n(b)} kPa for x ≥ ${n(c)}, where x is the distance in metres from the pump and k is a number still to be set. Enter the limit of P(x) as x approaches ${n(c)} from the left, then the value of k that makes P continuous at x = ${n(c)}, so the pressure has no step at the joint.`,
  answer: [L, k],
  hints: [`From the left only x² + ${n(a)} is in use: put x = ${n(c)} into it.`, `At x = ${n(c)} the second rule gives ${n(c)}k − ${n(b)}. Continuity needs that to equal the limit from the left; solve for k.`],
  solution: `From the left, P(x) = x² + ${n(a)} approaches ${n(c * c)} + ${n(a)} = ${n(L)} kPa. At x = ${n(c)}, and from the right, P(x) = kx − ${n(b)} gives ${n(c)}k − ${n(b)}. Continuity needs ${n(c)}k − ${n(b)} = ${n(L)}, so ${n(c)}k = ${n(L + b)} and k = ${n(L + b)} ÷ ${n(c)} = ${n(k)}.`,
  guidance: [
   { prompt: `What does x² + ${n(a)} approach as x approaches ${n(c)} from the left?`, answer: [L], explanation: `${n(c)}² + ${n(a)} = ${n(c * c)} + ${n(a)} = ${n(L)} kPa.` },
   { prompt: `At x = ${n(c)} the second rule gives ${n(c)}k − ${n(b)}. For that to equal ${n(L)}, what must ${n(c)}k be?`, answer: [L + b], explanation: `${n(c)}k − ${n(b)} = ${n(L)} means ${n(c)}k = ${n(L)} + ${n(b)} = ${n(L + b)}.` },
   { prompt: `So what is k?`, answer: [k], explanation: `k = ${n(L + b)} ÷ ${n(c)} = ${n(k)}. Both rules now give ${n(L)} kPa at the joint, so the pressure is continuous.` }
  ] }; }
});

/* Ramp up F = at + b, then wind down F = k − t²; continuity gives k = ac + b + c² = s², so the flow stops at t = s. */
mk({ id: 'q07c', parent: 'q07', kind: 'applied',
 title: 'When the transfer pump runs dry',
 brief: 'The transfer pump must switch from ramping up to winding down without a jolt, and the crew needs to know when the flow will stop.',
 labels: ['flow at the switch (L/min)', 'k', 'time the flow stops (min)'], tolerance: 0.01 },
 [['flow at the switch (L/min)'], ['k'], ['time t (min)']], {
 canonical: { a: 4, b: 28, c: 3 },
 draw: R => { let p; do { const c = R.int(2, 4), s = R.int(c + 2, 10), a = R.int(2, 6); p = { a, b: s * s - c * c - a * c, c }; } while (p.b < 1 || p.b > 60); return p; },
 build: ({ a, b, c }) => { const L = a * c + b, K = L + c * c, s = Math.sqrt(K); return {
  prompt: `A transfer pump at Flow Control ramps up and then winds down. Its flow is F(t) = ${n(a)}t + ${n(b)} litres per minute for t < ${n(c)}, and F(t) = k − t² litres per minute for t ≥ ${n(c)}, with t in minutes. The number k must make F continuous at t = ${n(c)}, so the pipes are not jolted at the switch. Enter the flow at the switch, then k, then the time t when the flow has wound down to 0.`,
  answer: [L, K, s],
  hints: [`The flow at the switch is the limit from the left: let t approach ${n(c)} in the ramp-up rule.`, `Continuity needs k − ${n(c * c)} to equal that flow. Once you know k, the flow is 0 when t² = k.`],
  solution: `From the left, F(t) = ${n(a)}t + ${n(b)} approaches ${n(a)} × ${n(c)} + ${n(b)} = ${n(L)} litres per minute. At t = ${n(c)} the second rule gives k − ${n(c)}² = k − ${n(c * c)}. Continuity needs k − ${n(c * c)} = ${n(L)}, so k = ${n(K)}. The flow k − t² = ${n(K)} − t² is 0 when t² = ${n(K)}, and t is positive, so t = ${n(s)} minutes.`,
  guidance: [
   { prompt: `What does ${n(a)}t + ${n(b)} approach as t approaches ${n(c)} from the left?`, answer: [L], explanation: `${n(a)} × ${n(c)} + ${n(b)} = ${n(L)} litres per minute: that is the flow at the switch.` },
   { prompt: `At t = ${n(c)} the second rule gives k − ${n(c * c)}. Which k makes this equal ${n(L)}?`, answer: [K], explanation: `k − ${n(c * c)} = ${n(L)}, so k = ${n(L)} + ${n(c * c)} = ${n(K)}.` },
   { prompt: `Now the flow after the switch is ${n(K)} − t². At what time t is it 0?`, answer: [s], explanation: `${n(K)} − t² = 0 means t² = ${n(K)}, and the positive time is t = ${n(s)} minutes.` }
  ] }; }
});

/* Left rule is 0 ÷ 0 at c: (x − c)(x + e) ÷ (x − c); right rule mx + k. Continuity: k = c + e − mc, never 0. */
mk({ id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q05',
 title: 'Patching the mixing valve rule',
 brief: 'The mixing valve’s first control rule breaks down at the switch setting, and the second rule needs a constant that meets it there.',
 labels: ['left-hand limit', 'k'], tolerance: 0.01 },
 [['h'], ['left-hand limit'], ['k']], {
 canonical: { c: 5, e: 3, m: 3 },
 draw: R => { let p; do { const c = R.int(2, 6); p = { c, e: R.except(-5, 9, [0, -c]), m: R.int(2, 6) }; } while (p.c + p.e - p.m * p.c === 0); return p; },
 build: ({ c, e, m }) => { const top = quad('x', e - c, -c * e), L = c + e, K = L - m * c, fac = `x ${cst(e)}`; return {
  prompt: `A mixing valve at Flow Control switches control rules at the setting x = ${n(c)}. Its output is V(x) = (${top}) ÷ (x − ${n(c)}) for x < ${n(c)} and V(x) = ${n(m)}x + k for x ≥ ${n(c)}, where k is a constant. The first rule gives 0 ÷ 0 at x = ${n(c)}. Enter the limit of V(x) as x approaches ${n(c)} from the left, then the value of k that makes V continuous at x = ${n(c)}.`,
  answer: [L, K],
  hints: [`The top of the first rule is 0 at x = ${n(c)}, so x − ${n(c)} is one of its factors. Factor, cancel, and substitute.`, `At x = ${n(c)} the second rule gives ${n(m)} × ${n(c)} + k. Set that equal to the limit from the left and solve for k, keeping its sign.`],
  solution: `${top} = (x − ${n(c)})(${fac}), so for x < ${n(c)} the output is V(x) = ${fac}, which approaches ${n(c)} ${cst(e)} = ${n(L)}. At x = ${n(c)} the second rule gives ${n(m)} × ${n(c)} + k = ${n(m * c)} + k. Continuity needs ${n(m * c)} + k = ${n(L)}, so k = ${n(L)} − ${n(m * c)} = ${n(K)}.`,
  guidance: [
   { prompt: `${top} = (x − ${n(c)})(x + h). What is h?`, answer: [e], explanation: `h must multiply with −${n(c)} to give ${n(-c * e)} and add to −${n(c)} to give ${n(e - c)}: h = ${n(e)}.` },
   { prompt: `For x < ${n(c)}, V(x) = ${fac} once x − ${n(c)} is cancelled. What does it approach as x approaches ${n(c)}?`, answer: [L], explanation: `${n(c)} ${cst(e)} = ${n(L)}, so the left-hand limit is ${n(L)}.` },
   { prompt: `At x = ${n(c)} the second rule gives ${n(m * c)} + k. Which k makes ${n(m * c)} + k = ${n(L)}?`, answer: [K], explanation: `k = ${n(L)} − ${n(m * c)} = ${n(K)}. Both rules now meet at ${n(L)}, so V is continuous at x = ${n(c)}.` }
  ] }; }
});

/* ---- q08 Limits at infinity ---- */
/* Cooling water: T(t) = (pt + b) ÷ (qt + d), q, d in {2, 4, 5}, starting hot (40 to 95 °C) and settling at
   15 °C or more, at least 5 °C below the start. */
mk({ id: 'q08b', parent: 'q08', kind: 'setting',
 title: 'Where the exchanger water settles',
 brief: 'Hot water from the heat exchanger cools after start-up, and the crew wants the temperature it settles at and how far it falls.',
 labels: ['T(0) (°C)', 'long-run limit (°C)', 'total fall (°C)'], tolerance: 0.005 },
 [['T(0) (°C)'], ['long-run limit (°C)'], ['total fall (°C)']], {
 canonical: { p: 36, q: 2, b: 340, d: 4 },
 draw: R => { let p; do { p = { p: R.int(30, 300), q: R.pick([2, 4, 5]), b: R.int(80, 475), d: R.pick([2, 4, 5]) }; } while (p.b / p.d < p.p / p.q + 5 || p.b / p.d > 95 || p.b / p.d < 40 || p.p / p.q < 15); return p; },
 build: ({ p, q, b, d }) => { const S = b / d, L = p / q, D = S - L; return {
  prompt: `Hot water leaves a heat exchanger at Flow Control and cools as the exchanger settles. Its temperature is T(t) = (${n(p)}t + ${n(b)}) ÷ (${n(q)}t + ${n(d)}) °C, t minutes after start-up. Enter the starting temperature T(0), then the temperature the water settles towards in the long run (the limit as t grows without bound), then how many degrees it falls in all, from the start to that level.`,
  answer: [S, L, D],
  hints: ['At t = 0 every term with t in it is 0, so only the constant terms are left.', 'For the long run, divide the top and the bottom by t. The pieces that still have t on the bottom of a fraction shrink towards 0.'],
  solution: `T(0) = ${n(b)} ÷ ${n(d)} = ${n(S)} °C. Dividing the top and the bottom by t gives T(t) = (${n(p)} + ${n(b)} ÷ t) ÷ (${n(q)} + ${n(d)} ÷ t). As t → ∞, ${n(b)} ÷ t → 0 and ${n(d)} ÷ t → 0, so T(t) → ${n(p)} ÷ ${n(q)} = ${n(L)} °C: the horizontal asymptote. The water falls from ${n(S)} °C towards ${n(L)} °C, a fall of ${n(S)} − ${n(L)} = ${n(D)} degrees, which it approaches but never quite completes.`,
  guidance: [
   { prompt: `What is T(0)?`, answer: [S], explanation: `At t = 0 the top is ${n(b)} and the bottom is ${n(d)}, so T(0) = ${n(b)} ÷ ${n(d)} = ${n(S)} °C.` },
   { prompt: `Divide the top and the bottom by t: T(t) = (${n(p)} + ${n(b)} ÷ t) ÷ (${n(q)} + ${n(d)} ÷ t). What does T(t) approach as t → ∞?`, answer: [L], explanation: `${n(b)} ÷ t and ${n(d)} ÷ t shrink towards 0, leaving ${n(p)} ÷ ${n(q)} = ${n(L)} °C.` },
   { prompt: `How many degrees is it from ${n(S)} °C down to ${n(L)} °C?`, answer: [D], explanation: `${n(S)} − ${n(L)} = ${n(D)} degrees.` }
  ] }; }
});

/* Nutrient level c(t) = (pt + b) ÷ (qt + d) rising towards p ÷ q; the target V (one decimal) is reached at a whole
   number of minutes T = (Vd − b) ÷ (p − Vq), between 3 and 15, and is at least 0.5 below the long-run level. */
mk({ id: 'q08c', parent: 'q08', kind: 'applied',
 title: 'When the sprayers may open',
 brief: 'The greenhouse sprayers must wait until the feed line’s nutrient level is strong enough, and the crew wants to know when that will be.',
 labels: ['long-run level (g/L)', 'time (min)'], tolerance: 0.005 },
 [['long-run level (g/L)'], ['number times t', 'number on the right'], ['time t (min)']], {
 canonical: { p: 24, q: 2, b: 8, d: 4, V: 9.5 },
 draw: R => { for (;;) { const p = R.int(10, 60), q = R.pick([2, 4, 5]), b = R.int(1, 20), d = R.pick([2, 3, 4, 5]), T = R.int(3, 15), V = (p * T + b) / (q * T + d);
  if (dec(V, 1) && b / d < V && p / q - V >= 0.5 && p - V * q >= 2) return { p, q, b, d, V: Math.round(V * 10) / 10 }; } },
 build: ({ p, q, b, d, V }) => { const L = p / q, A = p - V * q, B = V * d - b, T = B / A; return {
  prompt: `The greenhouse feed line at Flow Control doses nutrient into water. Its nutrient level is c(t) = (${n(p)}t + ${n(b)}) ÷ (${n(q)}t + ${n(d)}) grams per litre, t minutes after dosing starts, and the sprayers may open once the level reaches ${n(V)} grams per litre. Enter the level that c(t) approaches in the long run, then the time in minutes at which it reaches ${n(V)}.`,
  answer: [L, T],
  hints: ['For the long run, divide the top and the bottom by t: only the numbers in front of t survive.', `For the time, set c(t) = ${n(V)}, multiply both sides by the bottom, and solve the straight-line equation for t.`],
  solution: `Dividing the top and the bottom by t gives c(t) = (${n(p)} + ${n(b)} ÷ t) ÷ (${n(q)} + ${n(d)} ÷ t), which approaches ${n(p)} ÷ ${n(q)} = ${n(L)} grams per litre as t → ∞. The target ${n(V)} is below that level, so it is reached. Setting c(t) = ${n(V)} and multiplying by the bottom gives ${n(p)}t + ${n(b)} = ${n(V)}(${n(q)}t + ${n(d)}) = ${n(V * q)}t + ${n(V * d)}. So ${n(A)}t = ${n(B)}, and t = ${n(B)} ÷ ${n(A)} = ${n(T)} minutes.`,
  guidance: [
   { prompt: `Divide the top and the bottom by t. What level does c(t) approach as t → ∞?`, answer: [L], explanation: `${n(b)} ÷ t and ${n(d)} ÷ t shrink towards 0, leaving ${n(p)} ÷ ${n(q)} = ${n(L)} grams per litre. The target ${n(V)} lies below it, so the level does get there.` },
   { prompt: `Multiply both sides of c(t) = ${n(V)} by the bottom: ${n(p)}t + ${n(b)} = ${n(V)}(${n(q)}t + ${n(d)}). Expand, then gather the t terms on the left and the plain numbers on the right. What number multiplies t, and what number is on the right?`, answer: [A, B], explanation: `${n(V)}(${n(q)}t + ${n(d)}) = ${n(V * q)}t + ${n(V * d)}. Then ${n(p)}t − ${n(V * q)}t = ${n(V * d)} − ${n(b)}, which is ${n(A)}t = ${n(B)}.` },
   { prompt: `Solve ${n(A)}t = ${n(B)}. What is t?`, answer: [T], explanation: `t = ${n(B)} ÷ ${n(A)} = ${n(T)} minutes after dosing starts.` }
  ] }; }
});

/* Quadratic over quadratic: c(t) = (kt² + bt + e) ÷ (qt² + dt + f); the long-run level is k ÷ q = L, so k = Lq.
   Then the reading at t = 2, by direct substitution (q04), is N ÷ D with at most two decimals. */
mk({ id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q04',
 title: 'Tuning the settling tank’s long run',
 brief: 'The settling tank’s clarity must level off at a set value, and the dosing pump setting that does it has to be found before the tank is filled.',
 labels: ['k', 'limit as t approaches 2'], tolerance: 0.005 },
 [['k'], ['top at t = 2', 'bottom at t = 2'], ['limit as t approaches 2']], {
 canonical: { L: 4.5, q: 4, b: 3, d: 2, e: 6, f: 8 },
 draw: R => { for (;;) { const q = R.pick([2, 4, 5]), k = R.int(3, 40), b = R.int(1, 9), d = R.int(1, 9), e = R.int(1, 20), f = R.int(1, 9);
  if (k === q || k === 18 && q === 4) continue; const v = (4 * k + 2 * b + e) / (4 * q + 2 * d + f); if (dec(v, 2)) return { L: k / q, q, b, d, e, f }; } },
 build: ({ L, q, b, d, e, f }) => { const k = Math.round(L * q), N = 4 * k + 2 * b + e, D = 4 * q + 2 * d + f, v = N / D; return {
  prompt: `A settling tank at Flow Control clears as sediment drops out. Its clarity reading is c(t) = (kt² ${trm(b, 't')} + ${n(e)}) ÷ (${quad('t', d, f, q)}), t hours after filling, where k is a setting on the dosing pump. The engineers want the reading to level off at ${n(L)} in the long run. Enter the value of k that does this, then, with that k, the limit of c(t) as t approaches 2.`,
  answer: [k, v],
  hints: ['Here the highest power on the top and on the bottom is t². Divide every term by t²; as t grows, each piece that still has t on the bottom of a fraction shrinks towards 0.', 'Near t = 2 the bottom does not approach 0, so the limit laws allow direct substitution.'],
  solution: `Dividing the top and the bottom by t² gives c(t) = (k + ${n(b)} ÷ t + ${n(e)} ÷ t²) ÷ (${n(q)} + ${n(d)} ÷ t + ${n(f)} ÷ t²). As t → ∞ every piece with t on the bottom shrinks to 0, so c(t) → k ÷ ${n(q)}. For that to be ${n(L)}, k = ${n(L)} × ${n(q)} = ${n(k)}. With k = ${n(k)}, as t approaches 2 the top approaches ${n(k)} × 4 + ${n(b)} × 2 + ${n(e)} = ${n(N)} and the bottom approaches ${n(q)} × 4 + ${n(d)} × 2 + ${n(f)} = ${n(D)}, which is not 0. So the limit is ${n(N)} ÷ ${n(D)} = ${n(v)}.`,
  guidance: [
   { prompt: `Divide the top and the bottom by t². In the long run only k ÷ ${n(q)} is left. Which k makes k ÷ ${n(q)} = ${n(L)}?`, answer: [k], explanation: `k = ${n(L)} × ${n(q)} = ${n(k)}.` },
   { prompt: `With k = ${n(k)}, what do the top and the bottom approach as t approaches 2?`, answer: [N, D], explanation: `Top: ${n(k)} × 4 + ${n(b)} × 2 + ${n(e)} = ${n(N)}. Bottom: ${n(q)} × 4 + ${n(d)} × 2 + ${n(f)} = ${n(D)}, which is not 0.` },
   { prompt: `By the quotient law, what is the limit, ${n(N)} ÷ ${n(D)}?`, answer: [v], explanation: `${n(N)} ÷ ${n(D)} = ${n(v)}, the reading at t = 2 hours.` }
  ] }; }
});

/* ---- q09 Infinite limits ---- */
/* Q(x) = (ax + b) ÷ (d − x): the bottom is +0.01 on the LEFT of d and −0.01 on the right, the reverse of the parent.
   N = ad + b, |N| >= 2; Q(d − 0.01) = 100N − a, Q(d + 0.01) = −100N − a. */
mk({ id: 'q09b', parent: 'q09', kind: 'setting',
 title: 'The nozzle gate that blows up',
 brief: 'A spray nozzle’s flow reading runs off the scale near one gate opening, and Mira wants that opening marked and both sides checked.',
 labels: ['asymptote at x =', 'Q just left', 'Q just right'], tolerance: 0.01 },
 [['x'], ['Q on the left'], ['Q on the right']], {
 canonical: { a: 3, b: -2, d: 5 },
 draw: R => { let p; do { p = { a: R.int(2, 5), b: R.except(-9, 9, [0]), d: R.int(2, 8) }; } while (Math.abs(p.a * p.d + p.b) < 2); return p; },
 build: ({ a, b, d }) => { const N = a * d + b, xl = d - 0.01, xr = d + 0.01, tl = N - a / 100, tr = N + a / 100, L = 100 * N - a, Rv = -100 * N - a,
  up = N > 0 ? '∞' : '−∞', dn = N > 0 ? '−∞' : '∞'; return {
  prompt: `A spray nozzle at Flow Control has the flow reading Q(x) = (${n(a)}x ${cst(b)}) ÷ (${n(d)} − x), where x is the gate opening. Enter the opening x where Q has a vertical asymptote, then Q(${n(xl)}) and Q(${n(xr)}). Type the numbers without commas.`,
  answer: [d, L, Rv],
  hints: ['A vertical asymptote sits where the bottom is 0 but the top is not.', `Watch the sign of the bottom. Here it is ${n(d)} − x, so just left of ${n(d)} it is a tiny positive number, and just right of ${n(d)} a tiny negative one.`],
  solution: `The bottom ${n(d)} − x is 0 at x = ${n(d)}, where the top is ${n(a)} × ${n(d)} ${cst(b)} = ${n(N)}, not 0, so the line x = ${n(d)} is a vertical asymptote. At x = ${n(xl)} the bottom is ${n(d)} − ${n(xl)} = 0.01, so Q(${n(xl)}) = ${n(tl)} ÷ 0.01 = ${n(L)}. At x = ${n(xr)} the bottom is −0.01, so Q(${n(xr)}) = ${n(tr)} ÷ (−0.01) = ${n(Rv)}. Closer still the readings grow without bound: as x → ${n(d)}⁻, Q(x) → ${up}, and as x → ${n(d)}⁺, Q(x) → ${dn}.`,
  guidance: [
   { prompt: `Where is the bottom, ${n(d)} − x, equal to 0? (Check that the top is not 0 there.)`, answer: [d], explanation: `${n(d)} − x = 0 at x = ${n(d)}, and the top there is ${n(a)} × ${n(d)} ${cst(b)} = ${n(N)}, so the vertical asymptote is x = ${n(d)}.` },
   { prompt: `Just to the left: at x = ${n(xl)} the top is ${n(tl)} and the bottom is ${n(d)} − ${n(xl)} = 0.01. What is Q(${n(xl)})?`, answer: [L], explanation: `${n(tl)} ÷ 0.01 = ${n(tl)} × 100 = ${n(L)}.` },
   { prompt: `Just to the right: at x = ${n(xr)} the top is ${n(tr)} and the bottom is −0.01. What is Q(${n(xr)})?`, answer: [Rv], explanation: `${n(tr)} ÷ (−0.01) = ${n(tr)} × (−100) = ${n(Rv)}. Because the bottom is ${n(d)} − x rather than x − ${n(d)}, the left side is the one that heads ${N > 0 ? 'up' : 'down'}.` }
  ] }; }
});

/* P(x) = N ÷ (c − x) for x < c; the gauge rating M is reached at c − x = g = N ÷ M (two decimals at most). */
mk({ id: 'q09c', parent: 'q09', kind: 'applied',
 title: 'How far to open the relief valve',
 brief: 'The relief valve’s pressure shoots up near full setting, and the crew needs the largest setting the line’s gauge can take.',
 labels: ['asymptote at x =', 'largest safe setting'], tolerance: 0.005 },
 [['x'], ['gap to the asymptote'], ['largest safe setting']], {
 canonical: { c: 6, N: 60, M: 400 },
 draw: R => { for (;;) { const c = R.int(3, 9), M = R.pick([200, 250, 400, 500, 800]), g = R.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.4, 0.5]), N = Math.round(g * M);
  if (Math.abs(N - g * M) < 1e-9 && !(c === 6 && N === 60 && M === 400)) return { c, N, M }; } },
 build: ({ c, N, M }) => { const g = N / M, X = c - g; return {
  prompt: `A relief valve at Flow Control builds a line pressure of P(x) = ${n(N)} ÷ (${n(c)} − x) kPa at the setting x, for settings below ${n(c)}. The gauge on the line can read at most ${n(M)} kPa. Enter the setting where P has a vertical asymptote, then the largest setting that keeps the pressure within the gauge’s range.`,
  answer: [c, X],
  hints: [`P blows up where its bottom, ${n(c)} − x, is 0.`, `The pressure grows as x gets closer to ${n(c)}, so the largest safe setting is where P equals ${n(M)} exactly. Solve for the gap ${n(c)} − x first.`],
  solution: `The bottom ${n(c)} − x is 0 at x = ${n(c)} while the top is ${n(N)}, so x = ${n(c)} is a vertical asymptote: as x → ${n(c)}⁻, P(x) → ∞. The pressure reaches ${n(M)} kPa when ${n(N)} ÷ (${n(c)} − x) = ${n(M)}, so ${n(c)} − x = ${n(N)} ÷ ${n(M)} = ${n(g)} and x = ${n(c)} − ${n(g)} = ${n(X)}. Any setting closer to ${n(c)} gives a pressure above the gauge’s range, so the largest safe setting is ${n(X)}.`,
  guidance: [
   { prompt: `Where is the bottom, ${n(c)} − x, equal to 0?`, answer: [c], explanation: `${n(c)} − x = 0 at x = ${n(c)}, and the top is ${n(N)}, so x = ${n(c)} is the vertical asymptote. Near it the pressure climbs without bound.` },
   { prompt: `The pressure is ${n(M)} kPa when ${n(N)} ÷ (${n(c)} − x) = ${n(M)}. What is the gap ${n(c)} − x then?`, answer: [g], explanation: `${n(c)} − x = ${n(N)} ÷ ${n(M)} = ${n(g)}.` },
   { prompt: `So what is the largest safe setting x?`, answer: [X], explanation: `x = ${n(c)} − ${n(g)} = ${n(X)}. Any setting closer to ${n(c)} makes the gap smaller and the pressure larger than ${n(M)} kPa.` }
  ] }; }
});

/* Hole or wall: R(x) = (x − r)(x + e) ÷ ((x − r)(x − s)), expanded. Hole at r with height (r + e) ÷ (r − s), r − s in
   ±{1, 2, 4, 5}; asymptote at s, where the top is not 0; R(s + 0.01) = 100(s + e) + 1. */
mk({ id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q05',
 title: 'Hole or wall in the meter formula',
 brief: 'The flow meter’s conversion formula divides by zero at two settings, and Mira wants to know which is a harmless hole and which is a real wall.',
 labels: ['asymptote at x =', 'limit at the hole', 'R just right of the asymptote'], tolerance: 0.005 },
 [['top at the first zero', 'top at the second zero'], ['limit at the hole'], ['R just right']], {
 canonical: { r: 2, s: 4, e: 3 },
 draw: R => { let p; do { p = { r: R.int(1, 9), s: R.int(1, 9), e: R.except(-6, 9, [0]) }; } while (![1, 2, 4, 5].includes(Math.abs(p.r - p.s)) || p.s + p.e === 0 || p.r + p.e === 0); return p; },
 build: ({ r, s, e }) => { const top = quad('x', e - r, -r * e), bot = quad('x', -(r + s), r * s), H = (r + e) / (r - s), W = 100 * (s + e) + 1,
  lo = Math.min(r, s), hi = Math.max(r, s), tlo = (lo - r) * (lo + e), thi = (hi - r) * (hi + e), xr = s + 0.01, fac = `x ${cst(e)}`; return {
  prompt: `A flow meter at Flow Control converts its reading with R(x) = (${top}) ÷ (${bot}), where x is the meter setting. The bottom is 0 at two settings: at one of them R has a vertical asymptote, and at the other its graph only has a hole. Enter the setting of the vertical asymptote, then the limit of R(x) at the hole, then the value of R at the setting 0.01 to the right of the asymptote. Type the numbers without commas.`,
  answer: [s, H, W],
  hints: ['Factor the bottom, then check the top at each of its zeros. A zero of the bottom where the top is 0 too can be a hole; one where the top is not 0 is a vertical asymptote.', 'At the hole, cancel the shared factor and substitute. Just right of the asymptote the bottom of what is left is 0.01, and dividing by 0.01 is multiplying by 100.'],
  solution: `The bottom factors as ${bot} = (x − ${n(lo)})(x − ${n(hi)}), so it is 0 at x = ${n(lo)} and x = ${n(hi)}. The top is ${n(tlo)} at x = ${n(lo)} and ${n(thi)} at x = ${n(hi)}. It is 0 at x = ${n(r)}, so x = ${n(r)} is a hole, and not 0 at x = ${n(s)}, so x = ${n(s)} is the vertical asymptote. The top factors as (x − ${n(r)})(${fac}); cancelling x − ${n(r)} leaves R(x) = (${fac}) ÷ (x − ${n(s)}), which approaches ${n(r + e)} ÷ ${par(r - s)} = ${n(H)} as x approaches ${n(r)}. At x = ${n(xr)} the top is ${n(xr + e)} and the bottom is 0.01, so R(${n(xr)}) = ${n(xr + e)} ÷ 0.01 = ${n(W)}.`,
  guidance: [
   { prompt: `The bottom factors as (x − ${n(lo)})(x − ${n(hi)}). What is the top, ${top}, at x = ${n(lo)} and at x = ${n(hi)}?`, answer: [tlo, thi], explanation: `At x = ${n(lo)} the top is ${n(tlo)} and at x = ${n(hi)} it is ${n(thi)}. Where the top is 0 as well, at x = ${n(r)}, there is a hole; at x = ${n(s)} the top is not 0, so that is the vertical asymptote.` },
   { prompt: `The top is (x − ${n(r)})(${fac}). Cancel x − ${n(r)}: near x = ${n(r)}, R(x) = (${fac}) ÷ (x − ${n(s)}). What does it approach as x approaches ${n(r)}?`, answer: [H], explanation: `(${n(r)} ${cst(e)}) ÷ (${n(r)} − ${n(s)}) = ${n(r + e)} ÷ ${par(r - s)} = ${n(H)}. That is the height of the hole.` },
   { prompt: `At x = ${n(xr)} the top of (${fac}) ÷ (x − ${n(s)}) is ${n(xr + e)} and the bottom is 0.01. What is R(${n(xr)})?`, answer: [W], explanation: `${n(xr + e)} ÷ 0.01 = ${n(xr + e)} × 100 = ${n(W)}. The values run off without bound as x comes closer to ${n(s)}.` }
  ] }; }
});

/* ---- q10 Intermediate Value Theorem: halving ---- */
/* A falling cubic: f(x) = d − x³ − cx², positive at k and negative at k + 1; three halvings, no midpoint value within 0.01 of 0. */
const f10b = ({ c, d }) => x => d - x * x * x - c * x * x;
mk({ id: 'q10b', parent: 'q10', kind: 'setting',
 title: 'The drain that holds the tank steady',
 brief: 'A tank holds steady at one drain opening that no formula gives exactly, so the crew wants it trapped between two close readings.',
 labels: ['left end', 'right end'], tolerance: 0.0005 },
 [['f at the left end', 'f at the right end'], ['left end', 'right end'], ['left end', 'right end'], ['left end', 'right end']], {
 canonical: { k: 1, c: 3, d: 12 },
 draw: R => { let p; do { const k = R.int(1, 3), c = R.int(1, 4); p = { k, c, d: R.int(k * k * k + c * k * k + 1, (k + 1) ** 3 + c * (k + 1) ** 2 - 1) }; } while (halve(f10b(p), p.k, p.k + 1, 3).some(s => Math.abs(s.v) < 0.01)); return p; },
 build: p => { const { k, c, d } = p, f = f10b(p), s = halve(f, k, k + 1, 3), fk = f(k), fk1 = f(k + 1), fx = `${n(d)} − x³ ${trm(-c, 'x²')}`,
  say = st => `f(${n(st.m)}) is about ${n(r2(st.v))}, which is ${sign(st.v)}, so keep ${n(st.lo)} to ${n(st.hi)}`; return {
  prompt: `A tank at Flow Control holds steady when the net inflow f(x) = ${fx} litres per minute is 0, where x is the drain opening in centimetres. f is continuous, f(${n(k)}) is positive and f(${n(k + 1)}) is negative. Halve the interval from ${n(k)} to ${n(k + 1)} three times, keeping each time the half whose ends give f opposite signs, and enter the two ends of the interval you are left with, smaller first.`,
  answer: [s[2].lo, s[2].hi],
  hints: ['Here f falls as x grows: it is positive on the left and negative on the right. So a negative value at a midpoint puts the sign change, and the root, in the left half.', 'Three halvings cut the length of 1 to 1 ÷ 8 = 0.125, so the two ends you enter should be 0.125 apart.'],
  solution: `f(${n(k)}) = ${n(fk)} and f(${n(k + 1)}) = ${n(fk1)}, so by the Intermediate Value Theorem f is 0 somewhere between ${n(k)} and ${n(k + 1)}. ${say(s[0])}. ${say(s[1])}. ${say(s[2])}. The steady opening lies between ${n(s[2].lo)} and ${n(s[2].hi)} centimetres.`,
  guidance: [
   { prompt: `Check the ends first. What are f(${n(k)}) and f(${n(k + 1)})?`, answer: [fk, fk1], explanation: `f(${n(k)}) = ${n(d)} − ${n(k ** 3)} − ${n(c * k * k)} = ${n(fk)} and f(${n(k + 1)}) = ${n(d)} − ${n((k + 1) ** 3)} − ${n(c * (k + 1) ** 2)} = ${n(fk1)}. One is positive and one negative, and f is continuous, so it crosses 0 in between.` },
   { prompt: `First halving: the midpoint is ${n(s[0].m)}. Which interval do you keep? Enter its left end, then its right end.`, answer: [s[0].lo, s[0].hi], explanation: `${say(s[0])}: its ends give f opposite signs.` },
   { prompt: `Second halving: the midpoint of ${n(s[0].lo)} and ${n(s[0].hi)} is ${n(s[1].m)}. Which interval do you keep?`, answer: [s[1].lo, s[1].hi], explanation: `${say(s[1])}.` },
   { prompt: `Third halving: the midpoint of ${n(s[1].lo)} and ${n(s[1].hi)} is ${n(s[2].m)}. Which interval do you keep?`, answer: [s[2].lo, s[2].hi], explanation: `${say(s[2])}. The opening is trapped in an interval 0.125 long.` }
  ] }; }
});

/* Pressurising a line: P(t) = t³ + ct², alarm at d with P(k) < d < P(k + 1); two halvings of P(t) − d, then the midpoint. */
const P10c = ({ c }) => t => t * t * t + c * t * t;
mk({ id: 'q10c', parent: 'q10', kind: 'applied',
 title: 'Timing the pressure alarm',
 brief: 'The line under test will set off its pressure alarm partway through a second, and the crew wants a good estimate of when.',
 labels: ['left end (s)', 'right end (s)', 'estimate (s)'], tolerance: 0.0005 },
 [['left end (s)', 'right end (s)'], ['left end (s)', 'right end (s)'], ['estimate (s)']], {
 canonical: { k: 2, c: 2, d: 40 },
 draw: R => { let p; do { const k = R.int(1, 4), c = R.int(1, 4), P = P10c({ c }); p = { k, c, d: R.int(P(k) + 1, P(k + 1) - 1) }; } while (halve(t => P10c(p)(t) - p.d, p.k, p.k + 1, 2).some(s => Math.abs(s.v) < 0.01)); return p; },
 build: p => { const { k, c, d } = p, P = P10c(p), s = halve(t => P(t) - d, k, k + 1, 2), mid = (s[1].lo + s[1].hi) / 2,
  say = st => `P(${n(st.m)}) is about ${n(r2(P(st.m)))} kPa, which is ${P(st.m) > d ? 'above' : 'below'} ${n(d)}, so keep ${n(st.lo)} to ${n(st.hi)}`; return {
  prompt: `A sealed line at Flow Control is being pressurised, and its pressure is P(t) = t³ ${trm(c, 't²')} kPa after t seconds. The alarm sounds when P reaches ${n(d)} kPa. P is continuous, P(${n(k)}) = ${n(P(k))} and P(${n(k + 1)}) = ${n(P(k + 1))}, so the alarm sounds between t = ${n(k)} and t = ${n(k + 1)}. Halve that interval twice, each time keeping the half where P(t) − ${n(d)} changes sign. Enter the left and right ends of the interval you are left with, then its midpoint as the best estimate of the alarm time.`,
  answer: [s[1].lo, s[1].hi, mid],
  hints: [`Work with P(t) − ${n(d)}: it is negative before the alarm and positive after. Equivalently, keep the half where P goes from below ${n(d)} to above it.`, 'The midpoint of an interval is its two ends added and divided by 2.'],
  solution: `P(t) − ${n(d)} is continuous, negative at t = ${n(k)} and positive at t = ${n(k + 1)}, so by the Intermediate Value Theorem P reaches ${n(d)} in between. ${say(s[0])}. ${say(s[1])}. The alarm time lies between ${n(s[1].lo)} and ${n(s[1].hi)} seconds, and the midpoint (${n(s[1].lo)} + ${n(s[1].hi)}) ÷ 2 = ${n(mid)} seconds is within 0.125 seconds of it.`,
  guidance: [
   { prompt: `First halving: the midpoint is ${n(s[0].m)}, and P(${n(s[0].m)}) is about ${n(r2(P(s[0].m)))} kPa. Which interval do you keep? Enter its left end, then its right end.`, answer: [s[0].lo, s[0].hi], explanation: `${say(s[0])}: P is below ${n(d)} at one end and above it at the other.` },
   { prompt: `Second halving: the midpoint of ${n(s[0].lo)} and ${n(s[0].hi)} is ${n(s[1].m)}. Work out P(${n(s[1].m)}). Which interval do you keep?`, answer: [s[1].lo, s[1].hi], explanation: `${say(s[1])}.` },
   { prompt: `What is the midpoint of ${n(s[1].lo)} and ${n(s[1].hi)}?`, answer: [mid], explanation: `(${n(s[1].lo)} + ${n(s[1].hi)}) ÷ 2 = ${n(mid)}. The alarm time is in an interval 0.25 long, so this estimate is off by at most 0.125 seconds.` }
  ] }; }
});

/* A root below zero: f(x) = x³ + cx + d with f(−k − 1) < 0 < f(−k); three halvings, then the number of halvings that
   makes 1 ÷ 2ⁿ shorter than w: the smallest n with 2ⁿ > 1 ÷ w. */
const f10d = ({ c, d }) => x => x * x * x + c * x + d;
const W10 = { 0.1: 10, 0.05: 20, 0.02: 50, 0.01: 100, 0.005: 200, 0.002: 500, 0.001: 1000 };
mk({ id: 'q10d', parent: 'q10', kind: 'challenge',
 title: 'Hunting the balance below zero',
 brief: 'The coolant mixer balances at a temperature below freezing that no formula gives, and the crew wants it trapped and the cost of a tighter trap.',
 labels: ['left end (°C)', 'right end (°C)', 'halvings needed'], tolerance: 0.0005 },
 [['f at the left end', 'f at the right end'], ['left end', 'right end'], ['left end', 'right end'], ['left end', 'right end'], ['halvings']], {
 canonical: { k: 2, c: 4, d: 30, w: 0.01 },
 draw: R => { let p; do { const k = R.int(1, 3), c = R.int(1, 5); p = { k, c, d: R.int(k ** 3 + c * k + 1, (k + 1) ** 3 + c * (k + 1) - 1), w: R.pick([0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001]) }; } while (halve(f10d(p), -p.k - 1, -p.k, 3).some(s => Math.abs(s.v) < 0.01)); return p; },
 build: p => { const { k, c, d, w } = p, f = f10d(p), a = -k - 1, b = -k, s = halve(f, a, b, 3), fa = f(a), fb = f(b), inv = W10[w];
  let N = 0; while (2 ** N <= inv) N++;
  const say = st => `f(${n(st.m)}) is about ${n(r2(st.v))}, which is ${sign(st.v)}, so keep ${n(st.lo)} to ${n(st.hi)}`; return {
  prompt: `The coolant mixer at Flow Control is balanced at the temperature x °C where f(x) = x³ ${trm(c, 'x')} + ${n(d)} is 0. f is continuous, f(${n(a)}) is negative and f(${n(b)}) is positive, so the balance temperature lies between ${n(a)} and ${n(b)}. Halve that interval three times, keeping the half where f changes sign, and enter the left end and the right end of the final interval. Then enter how many halvings in all, starting from the interval of length 1, would trap the temperature in an interval shorter than ${n(w)} °C.`,
  answer: [s[2].lo, s[2].hi, N],
  hints: [`The ends are negative, but the method is the same: the midpoint of ${n(a)} and ${n(b)} is their sum divided by 2. Cube a negative number carefully: the result is negative.`, 'Each halving halves the length, so after n halvings the interval is 1 ÷ 2ⁿ long.'],
  solution: `f(${n(a)}) = ${n(fa)} and f(${n(b)}) = ${n(fb)}, so by the Intermediate Value Theorem f is 0 somewhere between ${n(a)} and ${n(b)}. ${say(s[0])}. ${say(s[1])}. ${say(s[2])}. The balance temperature lies between ${n(s[2].lo)} and ${n(s[2].hi)} °C. After n halvings the interval is 1 ÷ 2ⁿ long, which is shorter than ${n(w)} exactly when 2ⁿ is greater than 1 ÷ ${n(w)} = ${n(inv)}. 2${sup(N - 1)} = ${n(2 ** (N - 1))} is not, and 2${sup(N)} = ${n(2 ** N)} is, so ${n(N)} halvings are needed.`,
  guidance: [
   { prompt: `Check the ends first. What are f(${n(a)}) and f(${n(b)})?`, answer: [fa, fb], explanation: `f(${n(a)}) = ${n(a ** 3)} − ${n(c * -a)} + ${n(d)} = ${n(fa)} and f(${n(b)}) = ${n(b ** 3)} − ${n(c * -b)} + ${n(d)} = ${n(fb)}. One is negative and one positive, and f is continuous, so it crosses 0 in between.` },
   { prompt: `First halving: the midpoint is ${n(s[0].m)}. Which interval do you keep? Enter its left end, then its right end.`, answer: [s[0].lo, s[0].hi], explanation: `${say(s[0])}: its ends give f opposite signs.` },
   { prompt: `Second halving: the midpoint of ${n(s[0].lo)} and ${n(s[0].hi)} is ${n(s[1].m)}. Which interval do you keep?`, answer: [s[1].lo, s[1].hi], explanation: `${say(s[1])}.` },
   { prompt: `Third halving: the midpoint of ${n(s[1].lo)} and ${n(s[1].hi)} is ${n(s[2].m)}. Which interval do you keep?`, answer: [s[2].lo, s[2].hi], explanation: `${say(s[2])}. The temperature is trapped in an interval 0.125 long.` },
   { prompt: `After n halvings the interval is 1 ÷ 2ⁿ long. For it to be shorter than ${n(w)}, 2ⁿ must be greater than 1 ÷ ${n(w)} = ${n(inv)}. What is the smallest such n?`, answer: [N], explanation: `2${sup(N - 1)} = ${n(2 ** (N - 1))} is not greater than ${n(inv)}, but 2${sup(N)} = ${n(2 ** N)} is, so ${n(N)} halvings are needed.` }
  ] }; }
});
})();
