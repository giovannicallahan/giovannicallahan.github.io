/* Calculus 1 concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md ("Experiment").
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Seedling bed against a wall with L = 4k metres of edging, k = 6 to 15: best depth k, wall side 2k, area 2k². */
 q31: t => { t = T(t); const k = 6 + (t + 10) % 10, L = 4 * k;
  return E('Predict the largest area the bed can have, in square metres.', `A(x) = x(${n(L)} − 2x) = ${n(L)}x − 2x², so A′(x) = ${n(L)} − 4x is zero at x = ${n(k)}. The side along the wall is ${n(2 * k)} metres and the area is ${n(k)} × ${n(2 * k)} = ${n(2 * k * k)} square metres.`, [['Largest area (m²)', 2 * k * k], ['Depth x (m)', k], ['Side along the wall (m)', 2 * k]]); },
 /* d(t) = 3t² + 5t from t = 1 to an end time e of 3 to 8 minutes: the Mean Value time is (1 + e) ÷ 2. */
 q32: t => { t = T(t); const e = 3 + (t + 10) % 6, de = 3 * e * e + 5 * e, avg = (de - 8) / (e - 1), c = (avg - 5) / 6;
  return E('Predict the time c at which the rover’s speed equals its average speed, in minutes.', `d(1) = 8 and d(${n(e)}) = ${n(de)}, so the average speed is (${n(de)} − 8) ÷ ${n(e - 1)} = ${n(avg)} metres per minute. d′(t) = 6t + 5, and 6c + 5 = ${n(avg)} gives c = ${n(c)} minutes.`, [['Time c (min)', c], ['Average speed (m/min)', avg]]); },
 /* (e^(kx) − 1) ÷ sin(2x) as x approaches 0, k = 2 to 9: the limit is k ÷ 2. */
 q33: t => { t = T(t); const k = 2 + (t + 10) % 8;
  return E('Predict the limit as x approaches 0.', `At x = 0 the fraction is 0 ÷ 0. The derivative of the top is ${n(k)}e^(${n(k)}x), which is ${n(k)} at 0; the derivative of the bottom is 2cos(2x), which is 2 at 0. The limit is ${n(k)} ÷ 2 = ${n(k / 2)}.`, [['Limit', k / 2], ['Top’s derivative at 0', k], ['Bottom’s derivative at 0', 2]]); },
 /* One Newton step for x² − N from x₀ = 4, N = 13 to 20 without 16: x₁ = 4 + (N − 16) ÷ 8, at most three decimals. */
 q34: t => { t = T(t); const N = [13, 14, 15, 17, 18, 19, 20][(t + 10) % 7], f0 = 16 - N, x1 = 4 - f0 / 8;
  return E('Predict the next guess x₁.', `f(4) = 16 − ${n(N)} = ${n(f0)} and f′(4) = 8, so x₁ = 4 − ${f0 < 0 ? `(${n(f0)})` : n(f0)} ÷ 8 = ${n(x1)}.`, [['Next guess x₁', x1], ['f(x₀)', f0], ['f′(x₀)', 8]]); },
 /* The antiderivative of 6t² + 2bt with constant 0 is 2t³ + bt², b = 2 to 10; its value at t = 2 is 16 + 4b. */
 q35: t => { t = T(t); const b = 2 + (t + 10) % 9;
  return E('Predict F(2) for the antiderivative F(t) whose constant is 0.', `F(t) = 2t³ + ${n(b)}t², because its derivative is 6t² + ${n(2 * b)}t. F(2) = 2 × 8 + ${n(b)} × 4 = ${n(16 + 4 * b)}.`, [['F(2)', 16 + 4 * b], ['Coefficient of t²', b], ['Coefficient of t³', 2]]); },
 /* Level rate 4t + 3 cm per hour with L(2) = P, P = 30 to 80: C = P − 14 and L(6) = P + 76. */
 q36: t => { t = T(t); const P = 30 + 5 * ((t + 10) % 11), C = P - 14;
  return E('Predict the level at t = 6, in centimetres.', `L(t) = 2t² + 3t + C and L(2) = 14 + C = ${n(P)}, so C = ${n(C)}. L(6) = 72 + 18 + ${n(C)} = ${n(P + 76)} centimetres.`, [['Level at t = 6 (cm)', P + 76], ['Constant C (cm)', C]]); },
 /* r(t) = 3t² + c from 0 to 8 with 4 rectangles of width 2, c = 2 to 12: right sum 720 + 8c, left sum 336 + 8c. */
 q37: t => { t = T(t); const c = 2 + (t + 10) % 11, R = [2, 4, 6, 8].map(x => 3 * x * x + c), sR = R.reduce((s, x) => s + x, 0);
  return E('Predict the right-endpoint estimate, in litres.', `The rates at t = 2, 4, 6 and 8 are ${R.slice(0, 3).map(n).join(', ')} and ${n(R[3])}, which add to ${n(sR)}. Times the width 2: ${n(2 * sR)} litres.`, [['Right-endpoint estimate (L)', 2 * sR], ['Left-endpoint estimate (L)', 336 + 8 * c], ['Width (min)', 2]]); },
 /* ∫ from 0 to e of (8 − 2t) dt, e = 5 to 12: 16 above the axis, (e − 4)² below it. */
 q38: t => { t = T(t); const e = 5 + (t + 10) % 8, d = (e - 4) * (e - 4);
  return E('Predict the definite integral.', `The rate is zero at t = 4. Above the axis: 4 × 8 ÷ 2 = 16. Below it: base ${n(e - 4)} and height ${n(2 * (e - 4))}, area ${n(d)}. The integral is 16 − ${n(d)} = ${n(16 - d)}.`, [['Definite integral', 16 - d], ['Area above the axis', 16], ['Area below the axis', d]]); },
 /* ∫ from 1 to e of (3t² + 6t) dt with F(t) = t³ + 3t², e = 2 to 6. */
 q39: t => { t = T(t); const e = 2 + (t + 10) % 5, Fe = e ** 3 + 3 * e * e;
  return E('Predict the integral, in kilolitres.', `F(t) = t³ + 3t², so F(1) = 4 and F(${n(e)}) = ${n(e ** 3)} + ${n(3 * e * e)} = ${n(Fe)}. The integral is ${n(Fe)} − 4 = ${n(Fe - 4)} kilolitres.`, [['Integral (kL)', Fe - 4], ['F at the top end', Fe], ['F at the bottom end', 4]]); },
 /* Rate 27 − 3t² kilolitres per hour from 200 kilolitres at noon, over the first e hours, e = 2 to 6. */
 q40: t => { t = T(t); const e = 2 + (t + 10) % 5, net = 27 * e - e ** 3, V = 200 + net;
  return E('Predict the volume at the end, in kilolitres.', `F(t) = 27t − t³, so the net change is 27 × ${n(e)} − ${n(e ** 3)} = ${n(net)} kilolitres. The volume is 200 ${net < 0 ? '−' : '+'} ${n(Math.abs(net))} = ${n(V)} kilolitres.`, [['Final volume (kL)', V], ['Net change (kL)', net]]); },
});
})();
