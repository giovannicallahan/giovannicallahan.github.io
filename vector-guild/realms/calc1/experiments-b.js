/* Calculus 1 concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md ("Experiment").
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* f(x) = (x² − k²) ÷ (x − k) below k, x² − c from k on, k = 3 … 9: c = k² − 2k. */
 q11: t => { t = T(t); const k = 3 + (t + 10) % 7, kk = k * k, lim = 2 * k, c = kk - lim;
  return E('Predict the value of c that makes f continuous where the two pieces meet.', `Below ${n(k)}, (x² − ${n(kk)}) ÷ (x − ${n(k)}) = x + ${n(k)}, which approaches ${n(lim)}. The right piece at ${n(k)} is ${n(kk)} − c, so ${n(kk)} − c = ${n(lim)} and c = ${n(kk)} − ${n(lim)} = ${n(c)}.`, [['c', c], ['Limit from the left', lim], ['k²', kk]]); },
 /* s(t) = 3t² + 4t at t0 = 1 … 6: s′(t0) = 6t0 + 4. */
 q12: t => { t = T(t); const a = 1 + (t + 10) % 6, d = 6 * a + 4;
  return E('Predict the derivative s′ at the given time, in metres per second.', `s(${n(a)} + h) − s(${n(a)}) = ${n(d)}h + 3h², so the difference quotient is ${n(d)} + 3h, which approaches ${n(d)} as h approaches 0.`, [['Derivative (m/s)', d], ['Difference quotient, h = 0.1', Math.round((d + 0.3) * 10) / 10]]); },
 /* f(x) = 2x² − 3x + 5 at a = 1 … 6: slope 4a − 3, intercept 5 − 2a². */
 q13: t => { t = T(t); const a = 1 + (t + 10) % 6, fa = 2 * a * a - 3 * a + 5, m = 4 * a - 3, k = fa - m * a;
  return E('Predict the y-intercept of the tangent line at the given point.', `f(${n(a)}) = ${n(fa)} and f′(${n(a)}) = 4 × ${n(a)} − 3 = ${n(m)}, so k = ${n(fa)} − ${n(m)} × ${n(a)} = ${n(k)}.`, [['Intercept', k], ['Slope', m], ['f at the point', fa]]); },
 /* f(x) = xⁿ, n = 2 … 6, at x = 2: n × 2ⁿ⁻¹. */
 q14: t => { t = T(t); const k = 2 + (t + 10) % 5, ap = Math.pow(2, k - 1), d = k * ap;
  return E('Predict f′(2).', `By the power rule f′(x) = ${n(k)} × x to the power ${n(k - 1)}, so f′(2) = ${n(k)} × ${n(ap)} = ${n(d)}.`, [['f′(2)', d], ['Coefficient', k], ['Power', k - 1]]); },
 /* T(t) = 2t³ − 5t² + 4t + 9 at t0 = 0 … 5: T′(t0) = 6t0² − 10t0 + 4. */
 q15: t => { t = T(t); const a = (t + 10) % 6, v = 6 * a * a - 10 * a + 4;
  return E('Predict the rate of change of the temperature at the given time, in degrees per minute.', `T′(t) = 6t² − 10t + 4, so T′(${n(a)}) = ${n(6 * a * a)} − ${n(10 * a)} + 4 = ${n(v)}.`, [['Rate (degrees per minute)', v], ['6t²', 6 * a * a], ['10t', 10 * a]]); },
 /* s(t) = 2t³ − 12t² + 20t at t0 = 0 … 4: v = 6t² − 24t + 20, a = 12t − 24. */
 q16: t => { t = T(t); const a = (t + 10) % 5, v = 6 * a * a - 24 * a + 20, acc = 12 * a - 24;
  return E('Predict the velocity at the given time, in metres per second.', `v(t) = s′(t) = 6t² − 24t + 20, so v(${n(a)}) = ${n(6 * a * a)} − ${n(24 * a)} + 20 = ${n(v)}. The acceleration there is 12 × ${n(a)} − 24 = ${n(acc)}.`, [['Velocity (m/s)', v], ['Acceleration (m/s²)', acc]]); },
 /* s(t) = 2t³ − 9t² + 12t + 4 at t0 = 0 … 4: s′ = 6t² − 18t + 12, s″ = 12t − 18. */
 q17: t => { t = T(t); const a = (t + 10) % 5, d1 = 6 * a * a - 18 * a + 12, d2 = 12 * a - 18, st = 2 * a ** 3 - 9 * a * a + 12 * a + 4;
  return E('Predict s′ at the given time.', `s′(t) = 6t² − 18t + 12, so s′(${n(a)}) = ${n(6 * a * a)} − ${n(18 * a)} + 12 = ${n(d1)}. Also s″(${n(a)}) = ${n(d2)} and s(${n(a)}) = ${n(st)}.`, [['s′ (m/s)', d1], ['s″', d2], ['s (m)', st]]); },
 /* P(x) = (3x + 2)(x² + 5) at x0 = 0 … 4: P′ = 3(x² + 5) + (3x + 2)(2x). */
 q18: t => { t = T(t); const a = (t + 10) % 5, u = 3 * a + 2, v = a * a + 5, dv = 2 * a, d = 3 * v + u * dv;
  return E('Predict P′ at the given setting.', `u = ${n(u)}, v = ${n(v)}, u′ = 3, v′ = ${n(dv)}, so P′ = 3 × ${n(v)} + ${n(u)} × ${n(dv)} = ${n(d)}.`, [['P′', d], ['P', u * v]]); },
 /* E(x) = (3x + 2) ÷ (x + 3) at x0 = 2 or 7 (bottom 5, 10): E′ = 7 ÷ (x + 3)². */
 q19: t => { t = T(t); const a = [2, 7][(t + 10) % 2], top = 3 * a + 2, bot = a + 3, d = 7 / (bot * bot);
  return E('Predict E′ at the given feed speed.', `f = ${n(top)}, g = ${n(bot)}, f′ = 3, g′ = 1, so E′ = (3 × ${n(bot)} − ${n(top)} × 1) ÷ ${n(bot * bot)} = 7 ÷ ${n(bot * bot)} = ${n(d)}.`, [['E′', d], ['E', top / bot]]); },
 /* F(x) = (3x − 4)³ at x0 = 2 … 4: F′ = 3u² × 3 with u = 3x − 4 (positive, so the flow is too). */
 q20: t => { t = T(t); const a = 2 + (t + 10) % 3, u = 3 * a - 4, outer = 3 * u * u, d = outer * 3;
  return E('Predict F′ at the given setting.', `The inside is u = 3 × ${n(a)} − 4 = ${n(u)}. The outer derivative 3u² is ${n(outer)}, and times the inner derivative 3 that gives ${n(d)}.`, [['F′', d], ['Inside value', u], ['Outer derivative', outer]]); },
});
})();
