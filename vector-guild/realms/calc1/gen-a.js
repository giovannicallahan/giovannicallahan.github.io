/* Calculus 1 mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md ("Generator") and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. q01 is the worked sample. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Signed terms for letter expressions: trm(−1, 'x') is '− x', trm(3, 'x') is '+ 3x'; cst(−4) is '− 4'; sgn gives the sign alone. */
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
/* q10: three halvings of [k, k + 1] for f(x) = x³ + cx − d, keeping the half where f changes sign. */
const bisect = ({ k, c, d }) => { const f = x => x * x * x + c * x - d, steps = []; let lo = k, hi = k + 1;
 for (let i = 0; i < 3; i++) { const m = (lo + hi) / 2, v = f(m); if (v > 0) hi = m; else lo = m; steps.push({ m, v, lo, hi }); }
 return { steps }; };
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 q01: {
  canonical: { a: 3, b: 10, t1: 2, t2: 6 },
  /* h(t) = at² + bt with a >= 2 (no coefficient 1 to write out), an interval at least 2 seconds long ("1 seconds"
     never appears) and heights below 1000 (no thousands to type). Not the worked example's interval, 1 to 3. */
  draw: R => { let p; do { p = { a: R.int(2, 6), b: R.int(4, 20), t1: R.int(1, 5) }; p.t2 = p.t1 + R.int(2, 5); } while (p.t1 === 1 && p.t2 === 3); return p; },
  build: ({ a, b, t1, t2 }) => { const h1 = a * t1 * t1 + b * t1, h2 = a * t2 * t2 + b * t2, dh = h2 - h1, dt = t2 - t1, rate = dh / dt; return {
   prompt: `The tracking station models a supply shuttle’s height as h(t) = ${n(a)}t² + ${n(b)}t metres, where t is the number of seconds since lift-off. Over the interval from t = ${n(t1)} to t = ${n(t2)}, enter the change in height in metres, then the average rate of change of the height in metres per second.`,
   answer: [dh, rate],
   hints: ['Put the start time and the end time of the interval into h(t), one at a time, to get the two heights.', `The average rate of change is the change in height divided by the change in time: (h(${n(t2)}) − h(${n(t1)})) ÷ (${n(t2)} − ${n(t1)}).`],
   solution: `h(${n(t1)}) = ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} = ${n(h1)} and h(${n(t2)}) = ${n(a)} × ${n(t2 * t2)} + ${n(b)} × ${n(t2)} = ${n(h2)}. The change in height is Δh = ${n(h2)} − ${n(h1)} = ${n(dh)} metres, and the change in time is Δt = ${n(t2)} − ${n(t1)} = ${n(dt)} seconds. The average rate of change is ${n(dh)} ÷ ${n(dt)} = ${n(rate)} metres per second.`,
   guidance: [
    { prompt: `Put the two times into h(t) = ${n(a)}t² + ${n(b)}t. What are h(${n(t1)}) and h(${n(t2)})?`, answer: [h1, h2], explanation: `h(${n(t1)}) = ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} = ${n(h1)} and h(${n(t2)}) = ${n(a)} × ${n(t2 * t2)} + ${n(b)} × ${n(t2)} = ${n(h2)}.` },
    { prompt: `The height goes from ${n(h1)} m to ${n(h2)} m while the time goes from t = ${n(t1)} to t = ${n(t2)}. What are the change in height Δh and the change in time Δt?`, answer: [dh, dt], explanation: `Δh = ${n(h2)} − ${n(h1)} = ${n(dh)} metres and Δt = ${n(t2)} − ${n(t1)} = ${n(dt)} seconds. Both are end minus start.` },
    { prompt: `Divide the change in height by the change in time. What is ${n(dh)} ÷ ${n(dt)}?`, answer: [rate], explanation: `${n(dh)} ÷ ${n(dt)} = ${n(rate)}, so over this interval the shuttle gained ${n(rate)} metres of height per second on average.` }
   ] }; }
 },
 /* d(t) = at² + bt at the moment t = c. Averages over 1, 0.1 and 0.01 seconds are 2ac + b plus a, a ÷ 10 and
    a ÷ 100: they settle on 2ac + b. a >= 2 (no written coefficient 1), and no
    average above 40 m/s (a rover). Not the worked example (t² + 3t at t = 1). */
 q02: {
  canonical: { a: 2, b: 5, c: 3 },
  draw: R => { let p; do { p = { a: R.int(2, 6), b: R.int(2, 15), c: R.int(2, 5) }; } while (2 * p.a * p.c + p.b + p.a > 40); return p; },
  build: ({ a, b, c }) => { const inst = 2 * a * c + b, r1 = inst + a, r01 = inst + a / 10, r001 = inst + a / 100,
   d0 = a * c * c + b * c, d1 = a * (c + 1) * (c + 1) + b * (c + 1), u = 10 * c + 1, v = 100 * c + 1,
   dA = (a * u * u + 10 * b * u) / 100, dB = (a * v * v + 100 * b * v) / 10000, cA = c + 0.1, cB = c + 0.01; return {
   prompt: `A tracking dish follows a rover whose distance from the dish is d(t) = ${n(a)}t² + ${n(b)}t metres, t seconds after it sets off. Enter the average rate of change of its distance from t = ${n(c)} to t = ${n(c + 1)}, then from t = ${n(c)} to t = ${n(cA)}, then the instantaneous rate of change at t = ${n(c)}: the whole number these averages settle on as the interval shrinks. All three are in metres per second.`,
   answer: [r1, r01, inst],
   hints: [`From t = ${n(c)} to t = ${n(cA)} the change in time is only 0.1 seconds, so the average rate is (d(${n(cA)}) − d(${n(c)})) ÷ 0.1.`, `Shrink the interval once more, to the 0.01 seconds from t = ${n(c)} to t = ${n(cB)}, and compare the three averages: the part that shrinks with the interval is disappearing, and what stays is the instantaneous rate.`],
   solution: `d(${n(c)}) = ${n(d0)}, d(${n(c + 1)}) = ${n(d1)} and d(${n(cA)}) = ${n(dA)}. From t = ${n(c)} to t = ${n(c + 1)} the average rate is (${n(d1)} − ${n(d0)}) ÷ 1 = ${n(r1)} m/s. From t = ${n(c)} to t = ${n(cA)} it is (${n(dA)} − ${n(d0)}) ÷ 0.1 = ${n(dA - d0)} ÷ 0.1 = ${n(r01)} m/s. Over 0.01 seconds, d(${n(cB)}) = ${n(dB)}, so the average rate is (${n(dB)} − ${n(d0)}) ÷ 0.01 = ${n(r001)} m/s. The amount above ${n(inst)} goes ${n(a)}, ${n(a / 10)}, ${n(a / 100)}: ten times smaller each time the interval is. The averages settle on ${n(inst)}, so the instantaneous rate of change at t = ${n(c)} is ${n(inst)} metres per second.`,
   guidance: [
    { prompt: `Start with the one-second interval. What are d(${n(c)}) and d(${n(c + 1)}), and the average rate of change between them?`, answer: [d0, d1, r1], explanation: `d(${n(c)}) = ${n(a)} × ${n(c * c)} + ${n(b)} × ${n(c)} = ${n(d0)} and d(${n(c + 1)}) = ${n(a)} × ${n((c + 1) * (c + 1))} + ${n(b)} × ${n(c + 1)} = ${n(d1)}. The change in time is 1 second, so the average rate is ${n(d1 - d0)} ÷ 1 = ${n(r1)} m/s.` },
    { prompt: `Shrink the interval to 0.1 seconds, from t = ${n(c)} to t = ${n(cA)}. What is d(${n(cA)}), and what is the average rate (d(${n(cA)}) − d(${n(c)})) ÷ 0.1?`, answer: [dA, r01], explanation: `d(${n(cA)}) = ${n(a)} × ${n(cA * cA)} + ${n(b)} × ${n(cA)} = ${n(dA)}. The change in distance is ${n(dA)} − ${n(d0)} = ${n(dA - d0)} metres, and ${n(dA - d0)} ÷ 0.1 = ${n(r01)} m/s.` },
    { prompt: `Shrink it again, to 0.01 seconds: d(${n(cB)}) = ${n(dB)}. What is the average rate (${n(dB)} − ${n(d0)}) ÷ 0.01?`, answer: [r001], explanation: `${n(dB)} − ${n(d0)} = ${n(dB - d0)}, and dividing by 0.01 is the same as multiplying by 100: ${n(r001)} m/s.` },
    { prompt: `The averages are ${n(r1)}, ${n(r01)} and ${n(r001)}. Which whole number are they closing in on?`, answer: [inst], explanation: `Each time the interval gets ten times shorter, the part above ${n(inst)} gets ten times smaller: ${n(a)}, then ${n(a / 10)}, then ${n(a / 100)}. Shrinking the interval further takes that part as close to 0 as you like, so the instantaneous rate of change at t = ${n(c)} is ${n(inst)} m/s.` }
   ] }; }
 },
 /* f(x) = (x³ − c³) ÷ (x − c), which is x² + cx + c² away from x = c. f(c ± 0.1) = 3c² ± 0.3c + 0.01 exactly. */
 q03: {
  canonical: { c: 2 },
  draw: R => ({ c: R.int(2, 9) }),
  build: ({ c }) => { const c3 = c * c * c, L = 3 * c * c, lo = (300 * c * c - 30 * c + 1) / 100, hi = (300 * c * c + 30 * c + 1) / 100,
   lo2 = (30000 * c * c - 300 * c + 1) / 10000, hi2 = (30000 * c * c + 300 * c + 1) / 10000,
   xl = c - 0.1, xh = c + 0.1, kl = Math.pow(10 * c - 1, 3) / 1000, kh = Math.pow(10 * c + 1, 3) / 1000; return {
   prompt: `The tracking station calibrates its dish with f(x) = (x³ − ${n(c3)}) ÷ (x − ${n(c)}). At x = ${n(c)} the formula gives 0 ÷ 0, which has no value, so the engineers look at inputs close to ${n(c)}. They have already found f(${n(c - 0.01)}) = ${n(lo2)} and f(${n(c + 0.01)}) = ${n(hi2)}. Enter f(${n(xl)}) and f(${n(xh)}), then the limit of f(x) as x approaches ${n(c)}, which is a whole number.`,
   answer: [lo, hi, L],
   hints: [`To find f(${n(xl)}), cube ${n(xl)}, subtract ${n(c3)}, then divide by ${n(xl)} − ${n(c)}, which is −0.1.`, `Line up the four values in order of x: f(${n(xl)}), f(${n(c - 0.01)}), f(${n(c + 0.01)}), f(${n(xh)}). The limit is the number they close in on from both sides.`],
   solution: `${n(xl)}³ = ${n(kl)}, so f(${n(xl)}) = (${n(kl)} − ${n(c3)}) ÷ (−0.1) = ${n(kl - c3)} ÷ (−0.1) = ${n(lo)}. ${n(xh)}³ = ${n(kh)}, so f(${n(xh)}) = (${n(kh)} − ${n(c3)}) ÷ 0.1 = ${n(kh - c3)} ÷ 0.1 = ${n(hi)}. From the left the values are ${n(lo)} and then ${n(lo2)}; from the right ${n(hi)} and then ${n(hi2)}. Both sides close in on ${n(L)}, so lim x→${n(c)} f(x) = ${n(L)}, even though f(${n(c)}) itself has no value.`,
   guidance: [
    { prompt: `Start on the left of ${n(c)}. What is ${n(xl)}³, and what is f(${n(xl)}) = (${n(xl)}³ − ${n(c3)}) ÷ (−0.1)?`, answer: [kl, lo], explanation: `${n(xl)} × ${n(xl)} × ${n(xl)} = ${n(kl)}. Then ${n(kl)} − ${n(c3)} = ${n(kl - c3)}, and dividing by −0.1 gives ${n(lo)}.` },
    { prompt: `Now the right of ${n(c)}. What is ${n(xh)}³, and what is f(${n(xh)}) = (${n(xh)}³ − ${n(c3)}) ÷ 0.1?`, answer: [kh, hi], explanation: `${n(xh)} × ${n(xh)} × ${n(xh)} = ${n(kh)}. Then ${n(kh)} − ${n(c3)} = ${n(kh - c3)}, and dividing by 0.1 gives ${n(hi)}.` },
    { prompt: `From the left: ${n(lo)}, ${n(lo2)}. From the right: ${n(hi)}, ${n(hi2)}. What whole number do both sides close in on?`, answer: [L], explanation: `The left values creep up and the right values creep down towards ${n(L)}, and the gap shrinks as x gets closer to ${n(c)}. So the limit as x approaches ${n(c)} is ${n(L)}.` }
   ] }; }
 },
 /* S(x) = (ax² + p) ÷ (x + q) as x → c, with p = k(c + q) − ac² so the limit k is a whole number; p is never 0. */
 q04: {
  canonical: { a: 2, p: 12, c: 3, q: 2 },
  draw: R => { let p; do { const a = R.int(2, 4), c = R.int(2, 6), q = R.int(1, 5), k = R.int(2, 9); p = { a, c, q, p: k * (c + q) - a * c * c }; } while (p.p === 0); return p; },
  build: ({ a, p, c, q }) => { const top = a * c * c + p, bot = c + q, L = top / bot, sp = p < 0 ? '−' : '+'; return {
   prompt: `The tracking station models a signal’s strength as S(x) = (${n(a)}x² ${sp} ${n(Math.abs(p))}) ÷ (x + ${n(q)}). Use the limit laws to find the limit of S(x) as x approaches ${n(c)}: enter the limit of the top, then the limit of the bottom, then the limit of S(x).`,
   answer: [top, bot, L],
   hints: [`The top is a ${p < 0 ? 'difference' : 'sum'}, so its limit is the limit of ${n(a)}x² ${p < 0 ? 'minus' : 'plus'} the limit of the constant ${n(Math.abs(p))}. By the power law, x² approaches ${n(c)}² as x approaches ${n(c)}.`, `The bottom does not approach 0, so the quotient law applies: divide the limit of the top by the limit of the bottom.`],
   solution: `By the power law x² approaches ${n(c)}² = ${n(c * c)}, so by the constant multiple law ${n(a)}x² approaches ${n(a)} × ${n(c * c)} = ${n(a * c * c)}. A constant stays put, so by the ${p < 0 ? 'difference' : 'sum'} law the top approaches ${n(a * c * c)} ${sp} ${n(Math.abs(p))} = ${n(top)}. The bottom approaches ${n(c)} + ${n(q)} = ${n(bot)}, which is not 0. By the quotient law the limit is ${n(top)} ÷ ${n(bot)} = ${n(L)}. This is exactly what direct substitution of x = ${n(c)} gives.`,
   guidance: [
    { prompt: `What does the top, ${n(a)}x² ${sp} ${n(Math.abs(p))}, approach as x approaches ${n(c)}?`, answer: [top], explanation: `${n(a)} × ${n(c)}² = ${n(a)} × ${n(c * c)} = ${n(a * c * c)}, and ${n(a * c * c)} ${sp} ${n(Math.abs(p))} = ${n(top)}.` },
    { prompt: `What does the bottom, x + ${n(q)}, approach?`, answer: [bot], explanation: `${n(c)} + ${n(q)} = ${n(bot)}. It is not 0, so the quotient law may be used.` },
    { prompt: `Divide the two limits. What is ${n(top)} ÷ ${n(bot)}?`, answer: [L], explanation: `${n(top)} ÷ ${n(bot)} = ${n(L)}, so the signal strength approaches ${n(L)} as x approaches ${n(c)}.` }
   ] }; }
 },
 /* g(x) = (x − r)(x + e) ÷ (x − r), written out as x² + Bx + C over x − r. B = e − r and C = −re are never 0. */
 q05: {
  canonical: { r: 3, e: 4 },
  draw: R => { let p; do { p = { r: R.int(2, 6), e: R.except(-5, 7, [0]) }; } while (p.e === p.r || p.e === -p.r); return p; },
  build: ({ r, e }) => { const B = e - r, C = -r * e, L = r + e, top = `x² ${trm(B, 'x')} ${cst(C)}`, fac = `x ${cst(e)}`; return {
   prompt: `The tracking station logs a rover’s wheel slip with g(x) = (${top}) ÷ (x − ${n(r)}). At x = ${n(r)} the top and the bottom are both 0. The top factors as (x − ${n(r)})(x + k). Enter k, then the limit of g(x) as x approaches ${n(r)}.`,
   answer: [e, L],
   hints: [`Look for two numbers that multiply to ${n(C)} and add to ${n(B)}. One of them is −${n(r)}, because x − ${n(r)} is a factor.`, `Cancel the shared factor x − ${n(r)}: that is allowed because x comes close to ${n(r)} without ever equalling it. Then put x = ${n(r)} into what is left.`],
   solution: `At x = ${n(r)} the top is ${n(r * r)} ${sgn(B * r)} ${n(Math.abs(B * r))} ${sgn(C)} ${n(Math.abs(C))} = 0 and the bottom is ${n(r)} − ${n(r)} = 0, so direct substitution gives 0 ÷ 0, which tells us nothing. The numbers −${n(r)} and ${n(e)} multiply to ${n(C)} and add to ${n(B)}, so ${top} = (x − ${n(r)})(${fac}), and k = ${n(e)}. For every x other than ${n(r)}, g(x) = (x − ${n(r)})(${fac}) ÷ (x − ${n(r)}) = ${fac}. As x approaches ${n(r)}, ${fac} approaches ${n(r)} ${cst(e)} = ${n(L)}, so the limit is ${n(L)}.`,
   guidance: [
    { prompt: `Try direct substitution first. What are the top and the bottom of g at x = ${n(r)}?`, answer: [0, 0], explanation: `The top is ${n(r * r)} ${sgn(B * r)} ${n(Math.abs(B * r))} ${sgn(C)} ${n(Math.abs(C))} = 0 and the bottom is ${n(r)} − ${n(r)} = 0. 0 ÷ 0 has no value, so the limit needs another route.` },
    { prompt: `${top} = (x − ${n(r)})(x + k). What is k?`, answer: [e], explanation: `k has to multiply with −${n(r)} to give ${n(C)} and add to −${n(r)} to give ${n(B)}: k = ${n(e)}. Check: (x − ${n(r)})(${fac}) = ${top}.` },
    { prompt: `After cancelling x − ${n(r)}, g(x) = ${fac} near x = ${n(r)}. What does it approach as x approaches ${n(r)}?`, answer: [L], explanation: `${n(r)} ${cst(e)} = ${n(L)}. The hole in the graph sits at height ${n(L)}, and that height is the limit.` }
   ] }; }
 },
 /* s(t) = (t − c)(t + e) ÷ (t − c) for t < c and mt + k for t >= c; the jump (mc + k) − (c + e) is never 0. */
 q06: {
  canonical: { c: 2, e: 5, m: 4, k: 3 },
  draw: R => { let p; do { p = { c: R.int(2, 5), e: R.except(-4, 7, [0]), m: R.int(2, 5), k: R.except(-6, 9, [0]) }; } while (p.e === p.c || p.e === -p.c || p.m * p.c + p.k === p.c + p.e); return p; },
  build: ({ c, e, m, k }) => { const B = e - c, C = -c * e, Lv = c + e, Rv = m * c + k, J = Rv - Lv, top = `t² ${trm(B, 't')} ${cst(C)}`, fac = `t ${cst(e)}`; return {
   prompt: `A beacon’s signal is modelled in two pieces: s(t) = (${top}) ÷ (t − ${n(c)}) for t < ${n(c)}, and s(t) = ${n(m)}t ${cst(k)} for t ≥ ${n(c)}. Enter the left-hand limit of s(t) as t approaches ${n(c)}, then the right-hand limit, then the jump: the right-hand limit minus the left-hand limit (negative if the signal drops).`,
   answer: [Lv, Rv, J],
   hints: [`From the left, t stays below ${n(c)}, so only the first piece counts. It gives 0 ÷ 0 at t = ${n(c)}, so factor the top and cancel t − ${n(c)} first.`, `From the right, only the second piece counts, and it has no trouble at t = ${n(c)}: use direct substitution.`],
   solution: `For t < ${n(c)}: ${top} = (t − ${n(c)})(${fac}), so s(t) = ${fac}, which approaches ${n(c)} ${cst(e)} = ${n(Lv)}. So lim t→${n(c)}⁻ s(t) = ${n(Lv)}. For t ≥ ${n(c)}: s(t) = ${n(m)}t ${cst(k)} approaches ${n(m)} × ${n(c)} ${cst(k)} = ${n(Rv)}, so lim t→${n(c)}⁺ s(t) = ${n(Rv)}. The jump is ${n(Rv)} − ${par(Lv)} = ${n(J)}. The two one-sided limits differ, so the two-sided limit of s(t) as t approaches ${n(c)} does not exist.`,
   guidance: [
    { prompt: `Left of ${n(c)}: factor ${top} as (t − ${n(c)})(${fac}) and cancel. What does ${fac} approach as t approaches ${n(c)}?`, answer: [Lv], explanation: `${n(c)} ${cst(e)} = ${n(Lv)}, so the left-hand limit is ${n(Lv)}.` },
    { prompt: `Right of ${n(c)}: what does ${n(m)}t ${cst(k)} approach as t approaches ${n(c)}?`, answer: [Rv], explanation: `${n(m)} × ${n(c)} ${cst(k)} = ${n(Rv)}, so the right-hand limit is ${n(Rv)}.` },
    { prompt: `What is the right-hand limit minus the left-hand limit, ${n(Rv)} − ${par(Lv)}?`, answer: [J], explanation: `${n(Rv)} − ${par(Lv)} = ${n(J)}. The signal ${J > 0 ? 'jumps up' : 'drops'} by ${n(Math.abs(J))} at t = ${n(c)}, so it has no two-sided limit there.` }
   ] }; }
 },
 /* F(t) = at + b for t < c and t² + k for t >= c; continuity needs k = ac + b − c², never 0. Not the example (2t + 1 at 3). */
 q07: {
  canonical: { a: 5, b: 2, c: 3 },
  draw: R => { let p; do { p = { a: R.int(2, 6), b: R.int(1, 9), c: R.int(2, 5) }; } while (p.a * p.c + p.b === p.c * p.c || (p.a === 2 && p.b === 1 && p.c === 3)); return p; },
  build: ({ a, b, c }) => { const L = a * c + b, c2 = c * c, K = L - c2; return {
   prompt: `At Flow Control a pump’s flow rate ramps up and then follows a curve: F(t) = ${n(a)}t + ${n(b)} litres per minute for t < ${n(c)}, and F(t) = t² + k for t ≥ ${n(c)}, with t in minutes. Enter the limit of F(t) as t approaches ${n(c)} from the left, then the value of k that makes F continuous at t = ${n(c)}, so the flow has no sudden jump.`,
   answer: [L, K],
   hints: [`From the left, F(t) = ${n(a)}t + ${n(b)}, so its limit comes from putting t = ${n(c)} into that piece.`, `At t = ${n(c)} the second piece gives F(${n(c)}) = ${n(c2)} + k. For F to be continuous this value must match the limit from the left.`],
   solution: `From the left, F(t) = ${n(a)}t + ${n(b)} approaches ${n(a)} × ${n(c)} + ${n(b)} = ${n(L)}. From the right, and at t = ${n(c)} itself, F(t) = t² + k gives ${n(c2)} + k. Continuity needs the value and both one-sided limits to agree: ${n(c2)} + k = ${n(L)}, so k = ${n(L)} − ${n(c2)} = ${n(K)}.`,
   guidance: [
    { prompt: `What does ${n(a)}t + ${n(b)} approach as t approaches ${n(c)} from the left?`, answer: [L], explanation: `${n(a)} × ${n(c)} + ${n(b)} = ${n(L)} litres per minute.` },
    { prompt: `The second piece is t² + k. What is t² at t = ${n(c)}?`, answer: [c2], explanation: `${n(c)}² = ${n(c2)}, so F(${n(c)}) = ${n(c2)} + k, and the right-hand limit is the same.` },
    { prompt: `Choose k so that ${n(c2)} + k = ${n(L)}. What is k?`, answer: [K], explanation: `k = ${n(L)} − ${n(c2)} = ${n(K)}. Now both pieces meet at ${n(L)} litres per minute and the flow is continuous.` }
   ] }; }
 },
 /* c(t) = (pt + b) ÷ (qt + d) with q, d in {2, 4, 5}, so c(0) = b ÷ d and the asymptote p ÷ q have at most two decimals;
    the asymptote is at least 0.5 above the start, so the brine gets stronger. b ≠ d keeps c(0) from being 1 ("1 grams"). */
 q08: {
  canonical: { p: 30, q: 4, b: 8, d: 2 },
  draw: R => { let p; do { p = { p: R.int(3, 60), q: R.pick([2, 4, 5]), b: R.int(1, 30), d: R.pick([2, 4, 5]) }; } while (p.p / p.q < p.b / p.d + 0.5 || p.b === p.d || p.p === p.q); return p; },
  build: ({ p, q, b, d }) => { const S = b / d, L = p / q; return {
   prompt: `A mixing tank at Flow Control starts with weak brine, and stronger brine is pumped in. The salt concentration is c(t) = (${n(p)}t + ${n(b)}) ÷ (${n(q)}t + ${n(d)}) grams per litre, t minutes after the pump starts. Enter the concentration at t = 0, then the limit of c(t) as t grows without bound: the level of the horizontal asymptote.`,
   answer: [S, L],
   hints: [`At t = 0 every term with t in it is 0, so only the constant terms are left.`, `Divide the top and the bottom by t: c(t) = (${n(p)} + ${n(b)} ÷ t) ÷ (${n(q)} + ${n(d)} ÷ t). As t grows, ${n(b)} ÷ t and ${n(d)} ÷ t shrink towards 0.`],
   solution: `c(0) = ${n(b)} ÷ ${n(d)} = ${n(S)} grams per litre. Dividing the top and the bottom by t gives c(t) = (${n(p)} + ${n(b)} ÷ t) ÷ (${n(q)} + ${n(d)} ÷ t). As t → ∞, ${n(b)} ÷ t → 0 and ${n(d)} ÷ t → 0, so c(t) → ${n(p)} ÷ ${n(q)} = ${n(L)}. The horizontal asymptote is the level ${n(L)}: the concentration climbs towards ${n(L)} grams per litre without ever quite reaching it.`,
   guidance: [
    { prompt: `What is c(0)?`, answer: [S], explanation: `At t = 0 the top is ${n(b)} and the bottom is ${n(d)}, so c(0) = ${n(b)} ÷ ${n(d)} = ${n(S)} grams per litre.` },
    { prompt: `Divide the top and the bottom by t. When t is huge, the pieces ${n(b)} ÷ t and ${n(d)} ÷ t are almost 0. Which numbers are left on the top and on the bottom?`, answer: [p, q], explanation: `(${n(p)}t + ${n(b)}) ÷ t = ${n(p)} + ${n(b)} ÷ t, which is nearly ${n(p)}, and (${n(q)}t + ${n(d)}) ÷ t = ${n(q)} + ${n(d)} ÷ t, which is nearly ${n(q)}.` },
    { prompt: `So what is the limit of c(t) as t → ∞?`, answer: [L], explanation: `${n(p)} ÷ ${n(q)} = ${n(L)}. The graph levels off along the horizontal asymptote at ${n(L)} grams per litre.` }
   ] }; }
 },
 /* P(x) = (ax + b) ÷ (x − c); the top at c is N = ac + b (|N| >= 2), P(c + 0.01) = 100N + a and P(c − 0.01) = −100N + a. */
 q09: {
  canonical: { a: 2, b: 3, c: 4 },
  draw: R => { let p; do { p = { a: R.int(2, 5), b: R.except(-9, 9, [0]), c: R.int(2, 8) }; } while (Math.abs(p.a * p.c + p.b) < 2); return p; },
  build: ({ a, b, c }) => { const N = a * c + b, up = 100 * N + a, dn = -100 * N + a, xu = c + 0.01, xd = c - 0.01, tu = N + a / 100, td = N - a / 100,
   inf = N > 0 ? '∞' : '−∞', minf = N > 0 ? '−∞' : '∞'; return {
   prompt: `A valve at Flow Control has the pressure reading P(x) = (${n(a)}x ${cst(b)}) ÷ (x − ${n(c)}), where x is the valve setting. Enter the setting x where P has a vertical asymptote, then P(${n(xu)}) and P(${n(xd)}). Type the numbers without commas.`,
   answer: [c, up, dn],
   hints: [`A vertical asymptote sits where the bottom is 0 but the top is not.`, `At x = ${n(xu)} the bottom is ${n(xu)} − ${n(c)} = 0.01, a tiny positive number, and dividing by 0.01 is the same as multiplying by 100.`],
   solution: `The bottom x − ${n(c)} is 0 at x = ${n(c)}, where the top is ${n(a)} × ${n(c)} ${cst(b)} = ${n(N)}, not 0, so the line x = ${n(c)} is a vertical asymptote. P(${n(xu)}) = ${n(tu)} ÷ 0.01 = ${n(up)} and P(${n(xd)}) = ${n(td)} ÷ (−0.01) = ${n(dn)}. Closer still, the readings grow without bound: as x → ${n(c)}⁺, P(x) → ${inf}, and as x → ${n(c)}⁻, P(x) → ${minf}.`,
   guidance: [
    { prompt: `Where is the bottom, x − ${n(c)}, equal to 0? (Check that the top is not 0 there.)`, answer: [c], explanation: `x − ${n(c)} = 0 at x = ${n(c)}, and the top there is ${n(a)} × ${n(c)} ${cst(b)} = ${n(N)}, so the vertical asymptote is x = ${n(c)}.` },
    { prompt: `Just to the right: at x = ${n(xu)} the top is ${n(tu)} and the bottom is 0.01. What is P(${n(xu)})?`, answer: [up], explanation: `${n(tu)} ÷ 0.01 = ${n(tu)} × 100 = ${n(up)}.` },
    { prompt: `Just to the left: at x = ${n(xd)} the top is ${n(td)} and the bottom is −0.01. What is P(${n(xd)})?`, answer: [dn], explanation: `${n(td)} ÷ (−0.01) = ${n(td)} × (−100) = ${n(dn)}. The two sides shoot off in opposite directions.` }
   ] }; }
 },
 /* f(x) = x³ + cx − d, increasing, with f(k) < 0 < f(k + 1); three halvings, no midpoint value within 0.01 of 0. */
 q10: {
  canonical: { k: 2, c: 2, d: 20 },
  draw: R => { const f = (p, x) => x * x * x + p.c * x - p.d; let p; do { const k = R.int(1, 3), c = R.int(1, 5); p = { k, c, d: R.int(k * k * k + c * k + 1, (k + 1) * (k + 1) * (k + 1) + c * (k + 1) - 1) }; } while (bisect(p).steps.some(s => Math.abs(s.v) < 0.01)); return p; },
  build: p => { const { k, c, d } = p, B = bisect(p), fk = k * k * k + c * k - d, fk1 = (k + 1) * (k + 1) * (k + 1) + c * (k + 1) - d, s = B.steps, fx = `x³ ${trm(c, 'x')} − ${n(d)}`,
   sign = v => v > 0 ? 'positive' : 'negative', about = v => n(Math.round(v * 100) / 100),
   say = st => `f(${n(st.m)}) is about ${about(st.v)}, which is ${sign(st.v)}, so keep ${n(st.lo)} to ${n(st.hi)}`; return {
   prompt: `Flow Control balances a valve when f(x) = ${fx} is 0, where x is the valve opening in centimetres. f is continuous, f(${n(k)}) is negative and f(${n(k + 1)}) is positive, so a root lies between ${n(k)} and ${n(k + 1)}. Halve the interval three times, each time keeping the half whose ends give f opposite signs, and enter the left end and then the right end of the final interval.`,
   answer: [s[2].lo, s[2].hi],
   hints: [`The first midpoint is ${n(s[0].m)}. Work out f(${n(s[0].m)}): if it is positive, the sign change is in the left half; if it is negative, it is in the right half.`, `Each halving keeps a piece half as long as before, so the final interval is 0.125 long.`],
   solution: `f(${n(k)}) = ${n(fk)} and f(${n(k + 1)}) = ${n(fk1)}, so by the Intermediate Value Theorem f is 0 somewhere between ${n(k)} and ${n(k + 1)}. ${say(s[0])}. ${say(s[1])}. ${say(s[2])}. The root lies between ${n(s[2].lo)} and ${n(s[2].hi)}.`,
   guidance: [
    { prompt: `Check the ends first. What are f(${n(k)}) and f(${n(k + 1)})?`, answer: [fk, fk1], explanation: `f(${n(k)}) = ${n(k * k * k)} + ${n(c * k)} − ${n(d)} = ${n(fk)} and f(${n(k + 1)}) = ${n((k + 1) * (k + 1) * (k + 1))} + ${n(c * (k + 1))} − ${n(d)} = ${n(fk1)}. One is negative and one positive, and f is continuous, so it crosses 0 in between.` },
    { prompt: `First halving: the midpoint is ${n(s[0].m)}. Which interval do you keep? Enter its left end, then its right end.`, answer: [s[0].lo, s[0].hi], explanation: `${say(s[0])}: its ends give f opposite signs.` },
    { prompt: `Second halving: the midpoint of ${n(s[0].lo)} and ${n(s[0].hi)} is ${n(s[1].m)}. Which interval do you keep?`, answer: [s[1].lo, s[1].hi], explanation: `${say(s[1])}.` },
    { prompt: `Third halving: the midpoint of ${n(s[1].lo)} and ${n(s[1].hi)} is ${n(s[2].m)}. Which interval do you keep?`, answer: [s[2].lo, s[2].hi], explanation: `${say(s[2])}. The root is trapped in an interval 0.125 long.` }
   ] }; }
 },
});
})();
