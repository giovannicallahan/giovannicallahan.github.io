/* Calculus 1 concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md ("Experiment").
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* h(t) = 3t² + 10t from t = 2 to an end time of 4 to 10 seconds; every rate is a whole number. */
 q01: t => { t = T(t); const e = 4 + (t + 10) % 7, he = 3 * e * e + 10 * e, dh = he - 32, dt = e - 2;
  return E('Predict the average rate of change of the height over the interval, in metres per second.', `h(2) = 32 and h(${n(e)}) = ${n(he)}. Δh = ${n(he)} − 32 = ${n(dh)} metres and Δt = ${n(e)} − 2 = ${n(dt)} seconds, so the average rate of change is ${n(dh)} ÷ ${n(dt)} = ${n(dh / dt)} metres per second.`, [['Average rate (m/s)', dh / dt], ['Change in height (m)', dh], ['Change in time (s)', dt]]); },
 /* d(t) = 2t² + 5t at a moment c from 1 to 5; averages over 1, 0.1 and 0.01 seconds settle on 4c + 5. */
 q02: t => { t = T(t); const c = 1 + (t + 10) % 5, r = 4 * c + 5;
  return E('Predict the instantaneous rate of change of the distance at that moment, in metres per second.', `Averages from t = ${n(c)}: over 1 second ${n(r + 2)}, over 0.1 seconds ${n(r + 0.2)}, over 0.01 seconds ${n(r + 0.02)}. The amount above ${n(r)} shrinks tenfold with the interval, so the instantaneous rate of change is ${n(r)} metres per second.`, [['Instantaneous rate (m/s)', r], ['Average over 0.1 s (m/s)', r + 0.2], ['Average over 1 s (m/s)', r + 2]]); },
 /* f(x) = (x³ − c³) ÷ (x − c) for c from 1 to 6; its limit at c is 3c². */
 q03: t => { t = T(t); const c = 1 + (t + 10) % 6, L = 3 * c * c, lo = (30000 * c * c - 300 * c + 1) / 10000, hi = (30000 * c * c + 300 * c + 1) / 10000;
  return E('Predict the limit of f(x) as x approaches the number where it has no value.', `f(${n(c - 0.01)}) = ${n(lo)} and f(${n(c + 0.01)}) = ${n(hi)}. From both sides the values close in on ${n(L)}, so the limit is ${n(L)}.`, [['Limit', L], ['f just left', lo], ['f just right', hi]]); },
 /* (x² + 1)(2x − 3) as x approaches c from −3 to 3: product law, then direct substitution. */
 q04: t => { t = T(t); const c = -3 + (t + 10) % 7, a = c * c + 1, b = 2 * c - 3;
  return E('Predict the limit, using the product law and direct substitution.', `x² + 1 approaches ${n(c * c)} + 1 = ${n(a)} and 2x − 3 approaches 2 × ${par(c)} − 3 = ${n(b)}. By the product law the limit is ${n(a)} × ${par(b)} = ${n(a * b)}.`, [['Limit', a * b], ['Limit of x² + 1', a], ['Limit of 2x − 3', b]]); },
 /* (x² + 2x − (r² + 2r)) ÷ (x − r) = x + r + 2 away from r, for r from 1 to 7. */
 q05: t => { t = T(t); const r = 1 + (t + 10) % 7, C = r * r + 2 * r, k = r + 2;
  return E('Predict the limit as x approaches the number where the formula gives 0 ÷ 0.', `x² + 2x − ${n(C)} = (x − ${n(r)})(x + ${n(k)}). Cancelling x − ${n(r)} leaves x + ${n(k)}, which approaches ${n(r)} + ${n(k)} = ${n(r + k)}.`, [['Limit', r + k], ['k in the factor x + k', k]]); },
 /* x² for x < 2 and 3x + k for x >= 2, k from 1 to 21: the jump is k + 2. */
 q06: t => { t = T(t); const k = t + 11, R = 6 + k;
  return E('Predict the jump at x = 2: the right-hand limit minus the left-hand limit.', `From the left, x² approaches 4. From the right, 3x + ${n(k)} approaches 6 + ${n(k)} = ${n(R)}. The jump is ${n(R)} − 4 = ${n(R - 4)}.`, [['Jump', R - 4], ['Left-hand limit', 4], ['Right-hand limit', R]]); },
 /* 3x + 4 for x < c and x² + k for x >= c, c from 1 to 5: continuity needs k = 3c + 4 − c². */
 q07: t => { t = T(t); const c = 1 + (t + 10) % 5, L = 3 * c + 4, k = L - c * c;
  return E('Predict the value of k that makes F continuous at the switch.', `From the left, 3x + 4 approaches 3 × ${n(c)} + 4 = ${n(L)}. At x = ${n(c)} the right piece gives ${n(c * c)} + k. Continuity needs ${n(c * c)} + k = ${n(L)}, so k = ${n(L)} − ${n(c * c)} = ${n(k)}.`, [['k', k], ['Left-hand limit', L], ['x² at the switch', c * c]]); },
 /* (px + 3) ÷ (2x + 1) with p from 2 to 22: the horizontal asymptote is p ÷ 2. */
 q08: t => { t = T(t); const p = t + 12;
  return E('Predict the limit of f(x) as x → ∞: the level of the horizontal asymptote.', `Dividing the top and the bottom by x gives (${n(p)} + 3 ÷ x) ÷ (2 + 1 ÷ x). As x → ∞, 3 ÷ x and 1 ÷ x approach 0, so the limit is ${n(p)} ÷ 2 = ${n(p / 2)}.`, [['Horizontal asymptote', p / 2], ['f(0)', 3]]); },
 /* (2x + 3) ÷ (x − c) with c from 1 to 8; just right of c the reading is 100(2c + 3) + 2. */
 q09: t => { t = T(t); const c = 1 + (t + 10) % 8, N = 2 * c + 3, up = 100 * N + 2, dn = -100 * N + 2;
  return E('Predict the reading P at the setting just right of the vertical asymptote.', `The bottom is 0 at x = ${n(c)}, where the top is ${n(N)}, so x = ${n(c)} is a vertical asymptote. At x = ${n(c + 0.01)} the top is ${n(N + 0.02)} and the bottom is 0.01, so P = ${n(N + 0.02)} × 100 = ${n(up)}.`, [['P just right', up], ['Asymptote x', c], ['P just left', dn]]); },
 /* x³ + 2x − d on [2, 3] with d from 13 to 32; three halvings. */
 q10: t => { t = T(t); const d = 13 + (t + 10) % 20, f = x => x * x * x + 2 * x - d; let lo = 2, hi = 3; const said = [];
  for (let i = 0; i < 3; i++) { const m = (lo + hi) / 2, v = f(m); if (v > 0) hi = m; else lo = m; said.push(`f(${n(m)}) is ${v > 0 ? 'positive' : 'negative'}, so keep ${n(lo)} to ${n(hi)}`); }
  return E('Predict the left end of the final interval.', `f(2) = ${n(12 - d)} and f(3) = ${n(33 - d)}. ${said.join('; ')}.`, [['Left end', lo], ['Right end', hi]]); },
});
})();
