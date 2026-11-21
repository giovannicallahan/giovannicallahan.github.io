/* Calculus 1 concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md ("Experiment").
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* f(x) = 5 sin x + B cos x with B = t + 12 (2 to 22); f′(π/2) = −B. */
 q21: t => { t = T(t); const B = t + 12;
  return E('Predict the rate of change f′(π/2).', `f′(x) = 5 cos x − ${n(B)} sin x. At x = π/2, cos = 0 and sin = 1, so f′(π/2) = 5 × 0 − ${n(B)} × 1 = ${n(-B)}.`, [['f′(π/2)', -B], ['f′(0)', 5], ['B', B]]); },
 /* f(x) = 4c ln x with c = t + 12; f′(4) = 4c ÷ 4 = c. */
 q22: t => { t = T(t); const c = t + 12, k = 4 * c;
  return E('Predict the rate of change f′(4).', `The derivative of ln x is 1 ÷ x, so f′(x) = ${n(k)} ÷ x and f′(4) = ${n(k)} ÷ 4 = ${n(c)}.`, [['f′(4)', c], ['Coefficient of ln x', k]]); },
 /* u(x) = x²(x + p) with p = t + 11; u′(2) = 4(2 + p) + 4. */
 q23: t => { t = T(t); const p = t + 11, d = 4 * (2 + p) + 4;
  return E('Predict the slope u′(2), using the product rule.', `u′(x) = 2x(x + ${n(p)}) + x², so u′(2) = 4 × ${n(2 + p)} + 4 = ${n(d)}.`, [['u′(2)', d], ['First part, 2x(x + p) at 2', 4 * (2 + p)], ['Second part, x² at 2', 4]]); },
 /* x² + y² = t² + 16 at (t, 4); dy/dx = −t ÷ 4. */
 q24: t => { t = T(t); const C = t * t + 16, s = -t / 4;
  return E('Predict the slope dy/dx of the circle at the point.', `2x + 2y dy/dx = 0, so dy/dx = −x ÷ y = −${window.Gen.par(t)} ÷ 4 = ${n(s)}.`, [['Slope dy/dx', s], ['Circle constant x² + y²', C]]); },
 /* 10 m ladder, foot 6 m out, top 8 m up, foot sliding out at v = 0.04(t + 11) m/s; the top falls at 0.75v. */
 q25: t => { t = T(t); const v = 0.04 * (t + 11), down = 0.03 * (t + 11);
  return E('Predict how fast the top of the ladder slides down, in metres per second.', `2x dx/dt + 2y dy/dt = 0, so dy/dt = −6 × ${n(v)} ÷ 8 = ${n(-down)}. The top slides down at ${n(down)} m/s.`, [['Speed of the top (m/s)', Math.round(down * 1000) / 1000], ['Foot speed (m/s)', Math.round(v * 1000) / 1000]]); },
 /* √(400 + d) with d = t + 11 (1 to 21, never reaching the next square, 441): 20 + d ÷ 40. */
 q26: t => { t = T(t); const d = t + 11, est = Math.round((20 + d / 40) * 1000) / 1000;
  return E('Predict the linear approximation of the square root.', `f′(400) = 1 ÷ 40 = 0.025, so √${n(400 + d)} ≈ 20 + 0.025 × ${n(d)} = ${n(est)}.`, [['Estimate', est], ['Change dy', Math.round(d / 40 * 1000) / 1000]]); },
 /* f(x) = x³ − 3k²x with k = 1 to 5: local minimum at x = k, value −2k³. */
 q27: t => { t = T(t); const k = 1 + (t + 10) % 5, K = 3 * k * k;
  return E('Predict the value of f at its local minimum.', `f′(x) = 3x² − ${n(K)} = 0 at x = ±${n(k)}. f′ goes from negative to positive at x = ${n(k)}, a local minimum, where f = ${n(k ** 3)} − ${n(K * k)} = ${n(-2 * k ** 3)}.`, [['Local minimum value', -2 * k ** 3], ['Critical point x', k]]); },
 /* f(x) = x³ − 3m x² + 5x with m = t + 11; f″(x) = 6x − 6m is 0 at x = m. */
 q28: t => { t = T(t); const m = t + 11;
  return E('Predict the x of the inflection point.', `f″(x) = 6x − ${n(6 * m)}, which is 0 at x = ${n(m)} and changes sign there.`, [['Inflection x', m], ['f″(0)', -6 * m]]); },
 /* f(x) = 3x⁴ − 4(1 + b)x³ + 6bx² with b = 2 to 7; local maximum at x = 1, value 2b − 1. */
 q29: t => { t = T(t); const b = 2 + (t + 10) % 6, top = 2 * b - 1;
  return E('Predict the height of the local maximum.', `f′(x) = 12x(x − 1)(x − ${n(b)}); f rises from 0 to 1 and falls from 1 to ${n(b)}, so the local maximum is f(1) = 3 − ${n(4 * (1 + b))} + ${n(6 * b)} = ${n(top)}.`, [['Local maximum value', top], ['Other critical point', b]]); },
 /* f(x) = x³ − 12x on [0, R], R = 3 to 6; candidates f(0) = 0, f(2) = −16, f(R). */
 q30: t => { t = T(t); const R = 3 + (t + 10) % 4, fr = R ** 3 - 12 * R, hi = Math.max(0, fr);
  return E('Predict the absolute maximum on the interval.', `The critical point inside is x = 2. f(0) = 0, f(2) = −16 and f(${n(R)}) = ${n(fr)}, so the absolute maximum is ${n(hi)}.`, [['Absolute maximum', hi], ['Absolute minimum', -16], ['Value at the right end', fr]]); },
});
})();
