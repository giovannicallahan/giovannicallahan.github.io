/* Foundations mission generators, file d: chapter 7 "Functions and angles", q36–q40.
   Shape and helpers: docs/PACK-FORMAT.md ("Generator") and game/gen-core.js.
   build(canonical) reproduces the authored missions in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* Superscript and subscript digits for powers (3⁴) and logarithm bases (log₃). */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[d]).join('');
const sub = k => String(k).split('').map(d => SUB[d]).join('');
const times = (b, k) => Array(k).fill(n(b)).join(' × ');
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* q36 function notation, domain and range: L(t) = m t + c on the domain 0..H. */
 q36: {
  canonical: { m: 3, c: 12, H: 10, a: 7 },
  draw: R => { const H = R.int(5, 12); return { m: R.int(2, 9), c: R.int(5, 30), H, a: R.int(1, H - 1) }; },
  build: ({ m, c, H, a }) => { const A = m * a + c, B = m * H + c; return {
   prompt: `Mast cable log. Before the winch starts, ${n(c)} m of cable already hang from the mast, and the winch lets out ${n(m)} m each minute, so the length after t minutes is L(t) = ${n(m)}t + ${n(c)} metres. The winch can run for any time from 0 to ${n(H)} minutes, so that is the domain. Enter L(${n(a)}), then the smallest and the largest lengths in the range.`,
   answer: [A, c, B],
   hints: [`L(${n(a)}) means: put ${n(a)} in place of t, so work out ${n(m)} × ${n(a)} + ${n(c)}.`, `The cable only gets longer, so the smallest length comes from the smallest input, t = 0, and the largest from the largest input, t = ${n(H)}.`],
   solution: `L(${n(a)}) = ${n(m)} × ${n(a)} + ${n(c)} = ${n(A)} m. The smallest input, 0, gives L(0) = ${n(c)} m, and the largest input, ${n(H)}, gives L(${n(H)}) = ${n(m)} × ${n(H)} + ${n(c)} = ${n(B)} m. So the range runs from ${n(c)} m to ${n(B)} m.`,
   guidance: [
    { prompt: `What is L(${n(a)})? Replace t with ${n(a)} in ${n(m)}t + ${n(c)}.`, answer: [A], explanation: `${n(m)} × ${n(a)} = ${n(m * a)}, and ${n(m * a)} + ${n(c)} = ${n(A)}.` },
    { prompt: `What is L(0), the length before the winch has run at all?`, answer: [c], explanation: `${n(m)} × 0 = 0, so L(0) = ${n(c)}. It is the smallest length, because the cable only gets longer.` },
    { prompt: `What is L(${n(H)}), the length when the winch stops?`, answer: [B], explanation: `${n(m)} × ${n(H)} = ${n(m * H)}, and ${n(m * H)} + ${n(c)} = ${n(B)}. It is the largest length in the range.` }
   ] }; }
 },
 /* q37 a sideways shift p(d) = f(d − h) of f(d) = m d + c, then composition with g(s) = k s. */
 q37: {
  canonical: { m: 4, c: 6, h: 2, a: 7, k: 3 },
  draw: R => { const h = R.int(1, 4); return { m: R.int(2, 5), c: R.int(1, 9), h, a: R.int(h + 1, h + 8), k: R.int(2, 4) }; },
  build: ({ m, c, h, a, k }) => { const b = a - h, P = m * b + c, D = k * P; return {
   prompt: `Dish controller. The old rule turns a dial mark d into motor steps: f(d) = ${n(m)}d + ${n(c)}. The dial has been refitted ${n(h)} mark${h === 1 ? '' : 's'} out of line, so the new rule is p(d) = f(d − ${n(h)}): its graph is the old graph slid ${n(h)} to the right. The motor turns ${n(k)} degrees per step: g(s) = ${n(k)}s. Enter p(${n(a)}) in steps, then g(p(${n(a)})) in degrees.`,
   answer: [P, D],
   hints: [`p(${n(a)}) = f(${n(a)} − ${n(h)}). Work out the inside bracket first, then use the rule f.`, `g(p(${n(a)})) means: take the steps you found and feed them into g, which multiplies them by ${n(k)}.`],
   solution: `p(${n(a)}) = f(${n(a)} − ${n(h)}) = f(${n(b)}) = ${n(m)} × ${n(b)} + ${n(c)} = ${n(P)} steps. Then g(p(${n(a)})) = g(${n(P)}) = ${n(k)} × ${n(P)} = ${n(D)} degrees.`,
   guidance: [
    { prompt: `Start inside the bracket: what is ${n(a)} − ${n(h)}?`, answer: [b], explanation: `${n(a)} − ${n(h)} = ${n(b)}, so p(${n(a)}) is the same as f(${n(b)}).` },
    { prompt: `What is f(${n(b)})? Use f(d) = ${n(m)}d + ${n(c)}.`, answer: [P], explanation: `${n(m)} × ${n(b)} = ${n(m * b)}, and ${n(m * b)} + ${n(c)} = ${n(P)} steps.` },
    { prompt: `Feed those steps into the second machine: what is g(${n(P)})?`, answer: [D], explanation: `g multiplies by ${n(k)}: ${n(k)} × ${n(P)} = ${n(D)} degrees.` }
   ] }; }
 },
 /* q38 inverse of P(s) = m s + c: P⁻¹(w) = (w − c) ÷ m, evaluated at y = P(s). The logged wattage y is a parameter,
    so the oracle solves from the number the prompt states and not from the hidden setting. */
 q38: {
  canonical: { m: 5, c: 20, s: 9, y: 65 },
  draw: R => { const m = R.int(2, 9), c = R.except(5, 40, [m]), s = R.int(2, 12); return { m, c, s, y: m * s + c }; },
  build: ({ m, c, s, y }) => { return {
   prompt: `Transmitter log. At setting s the transmitter draws P(s) = ${n(m)}s + ${n(c)} watts. Last night’s log shows ${n(y)} W but not the setting. Write the inverse rule in the form P⁻¹(w) = (w − a) ÷ b, and enter a, then b, then the setting P⁻¹(${n(y)}).`,
   answer: [c, m, s],
   hints: ['List what P does to s, in order, then undo the last step first.',`P⁻¹(${n(y)}) = (${n(y)} − ${n(c)}) ÷ ${n(m)} = ${n(y - c)} ÷ ${n(m)}.`],
   solution: `P multiplies by ${n(m)}, then adds ${n(c)}. Undo the last step first: P⁻¹(w) = (w − ${n(c)}) ÷ ${n(m)}, so a = ${n(c)} and b = ${n(m)}. Then P⁻¹(${n(y)}) = (${n(y)} − ${n(c)}) ÷ ${n(m)} = ${n(y - c)} ÷ ${n(m)} = ${n(s)}. Check: P(${n(s)}) = ${n(m)} × ${n(s)} + ${n(c)} = ${n(y)}.`,
   guidance: [
    { prompt: `P does two things to s: times ${n(m)}, then plus ${n(c)}. The inverse undoes the last one first. Which number does it take away?`, answer: [c], explanation: `The last thing P did was add ${n(c)}, so the inverse starts by taking away ${n(c)}: a = ${n(c)}.` },
    { prompt: `After taking away ${n(c)}, what does the inverse divide by?`, answer: [m], explanation: `P multiplied by ${n(m)}, so the inverse divides by ${n(m)}: b = ${n(m)}.` },
    { prompt: `What is (${n(y)} − ${n(c)}) ÷ ${n(m)}?`, answer: [s], explanation: `${n(y)} − ${n(c)} = ${n(y - c)}, and ${n(y - c)} ÷ ${n(m)} = ${n(s)}. Check: ${n(m)} × ${n(s)} + ${n(c)} = ${n(y)}.` }
   ] }; }
 },
 /* q39 exponential growth S × b^n through n stages, and the logarithm log_b(T ÷ S) = k. The target strength T is a
    parameter, so the oracle counts stages up to the number the prompt states. With base 2 the stage counts start at 3:
    2² = 2 × 2 and 4 ÷ 2 = 2, so the taught mistake (base × exponent, or factor ÷ base) would give the accepted answer. */
 q39: {
  canonical: { b: 3, S: 4, n: 3, k: 4, T: 324 },
  draw: R => { const b = R.pick([2, 3, 5]), top = { 2: 6, 3: 4, 5: 3 }[b], lo = b === 2 ? 3 : 2, e = R.int(lo, top), S = R.int(2, 6), k = R.except(lo, top, [e]); return { b, S, n: e, k, T: S * b ** k }; },
  build: ({ b, S, n: e, k, T }) => { const be = b ** e, out = S * be, F = T / S; return {
   prompt: `Relay amplifiers. Each relay stage multiplies a signal’s strength by ${n(b)}. A signal of ${n(S)} units passes through ${n(e)} stages: enter its strength afterwards. A second signal of ${n(S)} units must reach ${n(T)} units: enter how many stages it needs.`,
   answer: [out, k],
   hints: [`Each stage multiplies by ${n(b)}, so after ${n(e)} stages the strength is ${n(S)} × ${n(b)}${sup(e)}, where ${n(b)}${sup(e)} means ${n(e)} copies of ${n(b)} multiplied together: ${times(b, e)}.`, `The second signal must grow by a factor of ${n(T)} ÷ ${n(S)} = ${n(F)}. Count how many ${n(b)}s you must multiply together to make ${n(F)}: that count is log${sub(b)} ${n(F)}.`],
   solution: `${n(b)}${sup(e)} = ${times(b, e)} = ${n(be)}, so the first signal ends at ${n(S)} × ${n(be)} = ${n(out)} units. The second signal must grow by a factor of ${n(T)} ÷ ${n(S)} = ${n(F)}, and ${times(b, k)} = ${n(F)}, so log${sub(b)} ${n(F)} = ${n(k)}: it needs ${n(k)} stages.`,
   guidance: [
    { prompt: `What is ${n(b)}${sup(e)}, that is ${times(b, e)}?`, answer: [be], explanation: `Multiply one step at a time: ${times(b, e)} = ${n(be)}. That is how many times stronger ${n(e)} stages make a signal.` },
    { prompt: `What is ${n(S)} × ${n(be)}?`, answer: [out], explanation: `${n(S)} × ${n(be)} = ${n(out)} units.` },
    { prompt: `${n(T)} ÷ ${n(S)} = ${n(F)}. How many times must you multiply by ${n(b)} to reach ${n(F)}? That count is log${sub(b)} ${n(F)}.`, answer: [k], explanation: `${times(b, k)} = ${n(F)}, which is ${n(k)} copies of ${n(b)}, so log${sub(b)} ${n(F)} = ${n(k)}.` }
   ] }; }
 },
 /* q40 right triangle (mast o, ground d, cable h, scaled by k): sin θ = o/h, cos θ = d/h; boom tip height arm × sin θ. */
 q40: {
  canonical: { o: 4, d: 3, h: 5, k: 6, arm: 10 },
  draw: R => { const [o, d, h] = R.pick([[3, 4, 5], [4, 3, 5], [7, 24, 25], [24, 7, 25]]); return { o, d, h, k: h === 5 ? R.int(2, 8) : 1, arm: R.pick([4, 5, 6, 8, 10, 12, 15, 20]) }; },
  build: ({ o, d, h, k, arm }) => { const H = k * o, D = k * d, L = k * h, s = G.tidy(o / h), c = G.tidy(d / h), tip = G.tidy(arm * o / h); return {
   prompt: `Guy wire. A cable runs from the top of the signal mast, ${n(H)} m high, in a straight line to a ground anchor ${n(D)} m from the mast’s foot; the cable is ${n(L)} m long. Let θ be the angle between the cable and the ground at the anchor. Enter sin θ, then cos θ (each as a decimal or as a fraction). Then a boom ${n(arm)} m long, fixed to a pivot, swings up from flat to the same angle θ: enter how high its tip rises above the pivot, in metres.`,
   answer: [s, c, tip],
   hints: [`Stand at the anchor. The mast is the side across from θ (opposite), the ground is the side touching θ (adjacent), and the cable is the longest side. sin θ = opposite ÷ longest; cos θ = adjacent ÷ longest.`, `On a circle of radius 1 the tip at angle θ is sin θ above the centre. A boom ${n(arm)} m long is ${n(arm)} times bigger, so its tip is ${n(arm)} × sin θ high.`],
   solution: `sin θ = ${n(H)} ÷ ${n(L)} = ${n(s)}, and cos θ = ${n(D)} ÷ ${n(L)} = ${n(c)}. The boom’s tip moves on a circle of radius ${n(arm)} around the pivot, so its tip is ${n(arm)} × sin θ = ${n(arm)} × ${n(s)} = ${n(tip)} m above the pivot.`,
   guidance: [
    { prompt: `From the anchor, the mast (${n(H)} m) is opposite θ and the cable (${n(L)} m) is the longest side. What is ${n(H)} ÷ ${n(L)}?`, answer: [s], explanation: `${n(H)} ÷ ${n(L)} = ${n(s)}, so sin θ = ${n(s)}.` },
    { prompt: `The ground (${n(D)} m) is the side touching θ. What is ${n(D)} ÷ ${n(L)}?`, answer: [c], explanation: `${n(D)} ÷ ${n(L)} = ${n(c)}, so cos θ = ${n(c)}.` },
    { prompt: `The boom is ${n(arm)} m long. What is ${n(arm)} × ${n(s)}?`, answer: [tip], explanation: `${n(arm)} × ${n(s)} = ${n(tip)}: the tip of a boom ${n(arm)} times longer than 1 rises ${n(arm)} times as high.` }
   ] }; }
 }
});
})();
