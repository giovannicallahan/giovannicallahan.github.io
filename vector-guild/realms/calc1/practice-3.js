/* Calculus 1 practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions". The worked sample is q01b in practice-1.js.
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc1/oracle-p3.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* Builds the authored mission from build(canonical), so the authored text and the generator cannot drift apart.
   meta = {id, parent, kind, title, brief, labels, tolerance, uses?}; stepLabels = the labels of each guided step. */
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(G.tidy), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(G.tidy), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* A polynomial from [coefficient, letter part] pairs: zero terms dropped, a coefficient 1 not written out,
   signs as " + " / " − ". poly([[2, 'x²'], [−3, 'x'], [5, '']]) → "2x² − 3x + 5". (As in gen-b.js.) */
const poly = terms => {
 let out = '';
 for (const [c, v] of terms) {
  if (c === 0) continue;
  const mag = Math.abs(c), body = (mag === 1 && v) ? v : n(mag) + v;
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body;
 }
 return out || '0';
};
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUP[Number(d)]).join('');
const pow = (v, k) => k === 1 ? v : v + sup(k);

/* ---- q11 Limits and continuity together ---- */
practice({
 id: 'q11b', parent: 'q11', kind: 'setting',
 title: 'The pressure regulator’s hand-over',
 brief: 'A pressure regulator hands over from one formula to another at a set valve opening, and the outlet pressure must not jump there.',
 labels: ['limit from the right', 'c'], tolerance: 0.01
}, [['number in the other factor'], ['limit from the right'], ['c']], {
 canonical: { k: 3, m: 4, j: 2 },
 /* Right piece (x² + mx − k(k + m)) ÷ (x − k) = x + k + m above k, left piece c − jx up to k. The limit from the
    right is 2k + m and c = 2k + m + jk. The hole is on the right this time and the top has a middle term. */
 draw: R => ({ k: R.int(2, 8), m: R.int(2, 6), j: R.int(2, 4) }),
 build: ({ k, m, j }) => { const N = k * (k + m), o = k + m, L = 2 * k + m, jk = j * k, c = L + jk; return {
  prompt: `A pressure regulator in Flow Control sets the outlet pressure f(x), in kilopascals, from the valve opening x, in turns. For openings up to and including ${n(k)} turns it uses f(x) = c − ${n(j)}x, where c is a number still to be set; for openings above ${n(k)} turns it uses f(x) = (x² + ${n(m)}x − ${n(N)}) ÷ (x − ${n(k)}). Enter the limit of f(x) as x approaches ${n(k)} from the right, then the value of c that makes f continuous at x = ${n(k)}.`,
  answer: [L, c],
  hints: [`Substituting ${n(k)} into the right piece gives 0 ÷ 0. The top has x − ${n(k)} as one factor: find the other factor, then cancel.`, `At x = ${n(k)} itself the left piece applies. Its value there, c − ${n(j)} × ${n(k)}, must equal the limit from the right.`],
  solution: `Above ${n(k)}: x² + ${n(m)}x − ${n(N)} = (x − ${n(k)})(x + ${n(o)}), and for x ≠ ${n(k)} the factor x − ${n(k)} cancels, leaving f(x) = x + ${n(o)}. As x approaches ${n(k)} from the right, x + ${n(o)} approaches ${n(k)} + ${n(o)} = ${n(L)}. At ${n(k)} itself the left piece gives f(${n(k)}) = c − ${n(j)} × ${n(k)} = c − ${n(jk)}, and the limit from the left is the same number, because c − ${n(j)}x is a polynomial. For f to be continuous at ${n(k)} the two sides must meet: c − ${n(jk)} = ${n(L)}, so c = ${n(L)} + ${n(jk)} = ${n(c)}.`,
  guidance: [
   { prompt: `The top, x² + ${n(m)}x − ${n(N)}, is (x − ${n(k)}) times (x + a number). What is that number?`, answer: [o], explanation: `(x − ${n(k)})(x + ${n(o)}) = x² + ${n(o)}x − ${n(k)}x − ${n(N)} = x² + ${n(m)}x − ${n(N)}, so the number is ${n(o)}.` },
   { prompt: `After cancelling x − ${n(k)}, the right piece is x + ${n(o)}. What does it approach as x approaches ${n(k)} from the right?`, answer: [L], explanation: `For every x just above ${n(k)}, f(x) = x + ${n(o)}, which closes in on ${n(k)} + ${n(o)} = ${n(L)}. The hole at x = ${n(k)} does not matter to a limit.` },
   { prompt: `The left piece at x = ${n(k)} is c − ${n(jk)}. For no jump it must equal ${n(L)}. What is c?`, answer: [c], explanation: `c − ${n(jk)} = ${n(L)}, so c = ${n(L)} + ${n(jk)} = ${n(c)}.` }
  ] }; }
});

practice({
 id: 'q11c', parent: 'q11', kind: 'applied',
 title: 'The surging drain pump',
 brief: 'The drain pump surges each time the float rises past one height, and the technicians want to know how big the surge is and how to remove it.',
 labels: ['jump (L/min)', 'new number'], tolerance: 0.01
}, [['limit from the left (L/min)'], ['jump (L/min)'], ['new number']], {
 canonical: { k: 6, j: 3, e: 5 },
 /* Left piece (x³ − kx²) ÷ (x − k) = x² below k, limit k²; right piece jx + c0 from k up, with c0 = c + e and the
    right number c = k² − jk ≥ k (j < k). The jump e is 2 to 12 litres per minute. */
 draw: R => { const k = R.int(3, 8); return { k, j: R.int(2, k - 1), e: R.int(2, 12) }; },
 build: ({ k, j, e }) => { const K = k * k, jk = j * k, c = K - jk, c0 = c + e, at = jk + c0; return {
  prompt: `A drain pump in Flow Control removes water at f(x) litres per minute, where x is the float height in centimetres. For heights below ${n(k)} cm the controller uses f(x) = (x³ − ${n(k)}x²) ÷ (x − ${n(k)}); from ${n(k)} cm up it uses f(x) = ${n(j)}x + ${n(c0)}. The pump surges as the float rises past ${n(k)} cm. Enter by how many litres per minute the flow jumps up at x = ${n(k)}, then the number that should replace ${n(c0)} in the second formula so that the flow has no jump.`,
  answer: [e, c],
  hints: [`The first formula gives 0 ÷ 0 at x = ${n(k)}. Take x² out of the top as a common factor, cancel, and find the limit from the left.`, `The jump is the value of the second formula at x = ${n(k)} minus the limit from the left.`],
  solution: `For x below ${n(k)}, x³ − ${n(k)}x² = x²(x − ${n(k)}), so after cancelling x − ${n(k)} the first formula is x², which approaches ${n(k)}² = ${n(K)} as x approaches ${n(k)} from the left. At x = ${n(k)} the second formula gives ${n(j)} × ${n(k)} + ${n(c0)} = ${n(at)}. So the flow jumps up by ${n(at)} − ${n(K)} = ${n(e)} litres per minute. For no jump the second formula must give ${n(K)} at x = ${n(k)}: ${n(jk)} + (number) = ${n(K)}, so the number is ${n(K)} − ${n(jk)} = ${n(c)}.`,
  guidance: [
   { prompt: `Write x³ − ${n(k)}x² as x²(x − ${n(k)}) and cancel x − ${n(k)}. What does the first formula approach as x approaches ${n(k)} from the left?`, answer: [K], explanation: `Just below ${n(k)} the first formula is x², which closes in on ${n(k)}² = ${n(K)} litres per minute.` },
   { prompt: `The second formula at x = ${n(k)} gives ${n(j)} × ${n(k)} + ${n(c0)}. How much higher is that than ${n(K)}?`, answer: [e], explanation: `${n(j)} × ${n(k)} + ${n(c0)} = ${n(at)}, and ${n(at)} − ${n(K)} = ${n(e)}: the flow jumps up by ${n(e)} litres per minute.` },
   { prompt: `Which number in place of ${n(c0)} makes ${n(j)} × ${n(k)} + (number) equal ${n(K)}?`, answer: [c], explanation: `${n(jk)} + (number) = ${n(K)}, so the number is ${n(K)} − ${n(jk)} = ${n(c)}: ${n(c0)} lowered by the jump of ${n(e)}.` }
  ] }; }
});

practice({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q01',
 title: 'Flow across the switch-over',
 brief: 'A circulation pump switches formulas at one pressure, and after the switch is sealed the crew want the average change in flow across it.',
 labels: ['c', 'average rate (L/min per bar)'], tolerance: 0.01
}, [['limit from the left'], ['c'], ['flow at the lower reading', 'flow at the higher reading'], ['average rate (L/min per bar)']], {
 canonical: { a: 4, k: 5, j: 2, d1: 2, d2: 1 },
 /* Left piece (ax² − ak²) ÷ (x − k) = a(x + k) below k, limit 2ak; right piece c − jx, so c = 2ak + jk. Average rate
    from x1 = k − d1 to x2 = k + d2 is (a·d1 − j·d2) ÷ (d1 + d2): drawn a whole number of size 2 or more, over at least 2 bar,
    with both flows positive. */
 draw: R => { let o; do { o = { a: R.int(2, 5), k: R.int(3, 8), j: R.int(2, 5), d1: R.int(1, 3), d2: R.int(1, 3) }; }
  while (o.d1 + o.d2 < 2 || (o.a * o.d1 - o.j * o.d2) % (o.d1 + o.d2) !== 0 || Math.abs(o.a * o.d1 - o.j * o.d2) < 2 * (o.d1 + o.d2) || 2 * o.a * o.k - o.j * o.d2 <= 0); return o; },
 build: ({ a, k, j, d1, d2 }) => { const ak2 = a * k * k, L = 2 * a * k, jk = j * k, c = L + jk, x1 = k - d1, x2 = k + d2,
  f1 = a * (x1 + k), f2 = c - j * x2, dx = x2 - x1, df = f2 - f1, r = df / dx; return {
  prompt: `A circulation pump in Flow Control delivers f(x) litres per minute, where x is a pressure reading in bar. Below ${n(k)} bar the controller uses f(x) = (${n(a)}x² − ${n(ak2)}) ÷ (x − ${n(k)}); from ${n(k)} bar up it uses f(x) = c − ${n(j)}x. Enter the value of c that makes f continuous at x = ${n(k)}. Then, with that c, enter the average rate of change of the flow from x = ${n(x1)} to x = ${n(x2)}, in litres per minute per bar (negative if the flow falls).`,
  answer: [c, r],
  hints: [`Take ${n(a)} out of the top as a common factor, then factor x² − ${n(k * k)} as a difference of two squares and cancel x − ${n(k)}.`, `The average rate of change is (f(${n(x2)}) − f(${n(x1)})) ÷ (${n(x2)} − ${n(x1)}). Use the first formula at ${n(x1)} and the second, with your c, at ${n(x2)}.`],
  solution: `Below ${n(k)}: ${n(a)}x² − ${n(ak2)} = ${n(a)}(x − ${n(k)})(x + ${n(k)}), so after cancelling x − ${n(k)} the first formula is ${n(a)}(x + ${n(k)}), which approaches ${n(a)} × ${n(2 * k)} = ${n(L)} as x approaches ${n(k)} from the left. The second formula at ${n(k)} is c − ${n(jk)}, so continuity needs c − ${n(jk)} = ${n(L)}, and c = ${n(c)}. Now the two flows: x = ${n(x1)} is below ${n(k)}, so f(${n(x1)}) = ${n(a)}(${n(x1)} + ${n(k)}) = ${n(f1)}; x = ${n(x2)} is not, so f(${n(x2)}) = ${n(c)} − ${n(j)} × ${n(x2)} = ${n(f2)}. The average rate of change is (${n(f2)} − ${n(f1)}) ÷ (${n(x2)} − ${n(x1)}) = ${n(df)} ÷ ${n(dx)} = ${n(r)} litres per minute per bar.`,
  guidance: [
   { prompt: `After cancelling, the first formula is ${n(a)}(x + ${n(k)}). What does it approach as x approaches ${n(k)} from the left?`, answer: [L], explanation: `${n(a)}(x + ${n(k)}) closes in on ${n(a)} × ${n(2 * k)} = ${n(L)}.` },
   { prompt: `The second formula at x = ${n(k)} is c − ${n(jk)}. For no jump it must equal ${n(L)}. What is c?`, answer: [c], explanation: `c − ${n(jk)} = ${n(L)}, so c = ${n(L)} + ${n(jk)} = ${n(c)}.` },
   { prompt: `Work out the flow at x = ${n(x1)} (below ${n(k)}, first formula) and at x = ${n(x2)} (second formula with c = ${n(c)}). Enter f(${n(x1)}), then f(${n(x2)}).`, answer: [f1, f2], explanation: `f(${n(x1)}) = ${n(a)}(${n(x1)} + ${n(k)}) = ${n(f1)} and f(${n(x2)}) = ${n(c)} − ${n(j)} × ${n(x2)} = ${n(f2)}.` },
   { prompt: `What is (${n(f2)} − ${n(f1)}) ÷ (${n(x2)} − ${n(x1)})?`, answer: [r], explanation: `The flow changes by ${n(df)} litres per minute over ${n(dx)} bar, so the average rate is ${n(df)} ÷ ${n(dx)} = ${n(r)} litres per minute per bar.` }
  ] }; }
});

/* ---- q12 The derivative as a limit of difference quotients ---- */
practice({
 id: 'q12b', parent: 'q12', kind: 'setting',
 title: 'Speed on the stopping strip',
 brief: 'A rover is braking along the stopping strip, and the crew need its speed at one exact instant of the stop.',
 labels: ['difference quotient, h = 0.1 (m/s)', 'derivative (m/s)'], tolerance: 0.005
}, [['s at the instant (m)', 's a tenth of a second later (m)'], ['difference quotient (m/s)'], ['number in front of h', 'number in front of h²'], ['derivative (m/s)']], {
 canonical: { a: 3, b: 20, t0: 2 },
 /* s(t) = bt − at², braking. Speed v = b − 2at0 is 4 to 15 m/s, so the rover is still moving through the step.
    The difference quotient for h = 0.1 is v − 0.1a. */
 draw: R => { const a = R.int(2, 4), t0 = R.int(1, 3), v = R.int(4, 15); return { a, b: v + 2 * a * t0, t0 }; },
 build: ({ a, b, t0 }) => { const t1 = G.tidy(t0 + 0.1), s0 = b * t0 - a * t0 * t0, s1 = G.tidy(b * t1 - a * t1 * t1), ds = G.tidy(s1 - s0), dq = G.tidy(ds / 0.1), v = b - 2 * a * t0; return {
  prompt: `A rover brakes along the test track’s stopping strip. Its distance past the strip’s first line is s(t) = ${n(b)}t − ${n(a)}t² metres, t seconds after it crosses that line. Enter its average speed over the tenth of a second after t = ${n(t0)}, which is the difference quotient (s(${n(t0)} + h) − s(${n(t0)})) ÷ h with h = 0.1. Then enter its speed at the instant t = ${n(t0)}, the derivative s′(${n(t0)}), in metres per second.`,
  answer: [dq, v],
  hints: [`Work out s(${n(t1)}) and s(${n(t0)}), subtract, and divide by 0.1. Keep the minus sign of the t² term.`, `For the derivative keep h as a letter: expand s(${n(t0)} + h) − s(${n(t0)}), divide every term by h, then let h shrink to 0.`],
  solution: `s(${n(t0)}) = ${n(b)} × ${n(t0)} − ${n(a)} × ${n(t0 * t0)} = ${n(s0)} and s(${n(t1)}) = ${n(b)} × ${n(t1)} − ${n(a)} × ${n(G.tidy(t1 * t1))} = ${n(s1)}, so the difference quotient is (${n(s1)} − ${n(s0)}) ÷ 0.1 = ${n(ds)} ÷ 0.1 = ${n(dq)}. With h as a letter, s(${n(t0)} + h) − s(${n(t0)}) = ${n(v)}h − ${n(a)}h², and dividing by h gives ${n(v)} − ${n(a)}h. As h approaches 0 the term ${n(a)}h vanishes, so s′(${n(t0)}) = ${n(v)} metres per second. The average over the step is a little lower because the rover slows down during it.`,
  guidance: [
   { prompt: `Put t = ${n(t0)} and t = ${n(t1)} into s(t) = ${n(b)}t − ${n(a)}t². Enter s(${n(t0)}), then s(${n(t1)}).`, answer: [s0, s1], explanation: `s(${n(t0)}) = ${n(b)} × ${n(t0)} − ${n(a)} × ${n(t0 * t0)} = ${n(s0)} and s(${n(t1)}) = ${n(b)} × ${n(t1)} − ${n(a)} × ${n(G.tidy(t1 * t1))} = ${n(s1)}.` },
   { prompt: `What is (${n(s1)} − ${n(s0)}) ÷ 0.1?`, answer: [dq], explanation: `${n(s1)} − ${n(s0)} = ${n(ds)}, and ${n(ds)} ÷ 0.1 = ${n(dq)}: the average speed over that tenth of a second.` },
   { prompt: `Keep h as a letter. Expanding s(${n(t0)} + h) − s(${n(t0)}) gives (number)h + (number)h². Enter the number in front of h, then the number in front of h² (with its sign).`, answer: [v, -a], explanation: `${n(b)}(${n(t0)} + h) − ${n(a)}(${n(t0)} + h)² − ${n(s0)} = ${n(b * t0)} + ${n(b)}h − ${n(a * t0 * t0)} − ${n(2 * a * t0)}h − ${n(a)}h² − ${n(s0)} = ${n(v)}h − ${n(a)}h².` },
   { prompt: `Dividing by h leaves ${n(v)} − ${n(a)}h. What does that approach as h shrinks towards 0?`, answer: [v], explanation: `The part ${n(a)}h shrinks to 0 with h, so the difference quotients close in on ${n(v)}: s′(${n(t0)}) = ${n(v)} metres per second.` }
  ] }; }
});

practice({
 id: 'q12c', parent: 'q12', kind: 'applied',
 title: 'Flagged at the speed gate',
 brief: 'A speed gate flags rovers that pass it too fast, and the crew want to know by how much this rover was over.',
 labels: ['speed at the gate (m/s)', 'over the limit by (m/s)'], tolerance: 0.01
}, [['number in front of h', 'number in front of h²'], ['speed at the gate (m/s)'], ['over the limit by (m/s)']], {
 canonical: { p: 2, q: 5, c: 12, t0: 3, e: 4 },
 /* s(t) = pt² + qt + c; speed v = 2pt0 + q; the limit L = v − e with e from 2 to 9 and L at least 4. */
 draw: R => { let o; do { o = { p: R.int(2, 5), q: R.int(2, 9), c: R.int(3, 20), t0: R.int(1, 4), e: R.int(2, 9) }; } while (2 * o.p * o.t0 + o.q - o.e < 4); return o; },
 build: ({ p, q, c, t0, e }) => { const v = 2 * p * t0 + q, L = v - e; return {
  prompt: `When a test rover’s timer starts it is already ${n(c)} m past the start line, and t seconds later its distance from the line is s(t) = ${n(p)}t² + ${n(q)}t + ${n(c)} metres. A speed gate stands where the rover is at t = ${n(t0)}, and it flags any rover going faster than ${n(L)} m/s at that instant. Find the rover’s speed there as the limit of the difference quotients (s(${n(t0)} + h) − s(${n(t0)})) ÷ h. Enter that speed in metres per second, then by how many m/s it is over the gate’s limit.`,
  answer: [v, e],
  hints: [`The ${n(c)} m head start appears in both s(${n(t0)} + h) and s(${n(t0)}), so it cancels when you subtract.`, `Expand ${n(p)}(${n(t0)} + h)², collect the terms that contain h, divide by h and let h shrink to 0. Then compare the speed with ${n(L)}.`],
  solution: `Expanding, ${n(p)}(${n(t0)} + h)² = ${n(p * t0 * t0)} + ${n(2 * p * t0)}h + ${n(p)}h² and ${n(q)}(${n(t0)} + h) = ${n(q * t0)} + ${n(q)}h. In s(${n(t0)} + h) − s(${n(t0)}) the terms without h, including the ${n(c)}, cancel, leaving ${n(v)}h + ${n(p)}h². Dividing by h gives ${n(v)} + ${n(p)}h, which approaches ${n(v)} as h shrinks to 0. So the rover passes the gate at ${n(v)} m/s, which is ${n(v)} − ${n(L)} = ${n(e)} m/s over the limit.`,
  guidance: [
   { prompt: `Expanding s(${n(t0)} + h) − s(${n(t0)}) gives (number)h + (number)h². Enter the number in front of h, then the number in front of h².`, answer: [v, p], explanation: `${n(p)}(${n(t0)} + h)² + ${n(q)}(${n(t0)} + h) + ${n(c)} = ${n(p * t0 * t0 + q * t0 + c)} + ${n(v)}h + ${n(p)}h², and s(${n(t0)}) = ${n(p * t0 * t0 + q * t0 + c)}, so the difference is ${n(v)}h + ${n(p)}h².` },
   { prompt: `Dividing by h leaves ${n(v)} + ${n(p)}h. What does it approach as h shrinks to 0?`, answer: [v], explanation: `${n(p)}h vanishes with h, so the speed at t = ${n(t0)} is s′(${n(t0)}) = ${n(v)} m/s.` },
   { prompt: `The gate’s limit is ${n(L)} m/s. By how many m/s is the rover over it?`, answer: [e], explanation: `${n(v)} − ${n(L)} = ${n(e)}, so the gate is right to flag it.` }
  ] }; }
});

practice({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q06',
 title: 'Before and after the sprint gate',
 brief: 'The sprint timer records a rover just before and just after a gate, and the speed at the gate must agree from both sides.',
 labels: ['quotient, h = −0.1 (m/s)', 'quotient, h = 0.1 (m/s)', 'derivative (m/s)'], tolerance: 0.01
}, [['quotient, h = −0.1 (m/s)'], ['quotient, h = 0.1 (m/s)'], ['number in front of h', 'number in front of h²'], ['derivative (m/s)']], {
 canonical: { p: 6, q: 7, t0: 4 },
 /* s(t) = pt² + qt; quotient from the left (h = −0.1) is v − 0.1p, from the right v + 0.1p, with v = 2pt0 + q. */
 draw: R => ({ p: R.int(3, 9), q: R.int(2, 15), t0: R.int(2, 6) }),
 build: ({ p, q, t0 }) => { const tL = G.tidy(t0 - 0.1), tR = G.tidy(t0 + 0.1), s = t => G.tidy(p * t * t + q * t), s0 = s(t0), sL = s(tL), sR = s(tR),
  dL = G.tidy(sL - s0), dR = G.tidy(sR - s0), qL = G.tidy(dL / -0.1), qR = G.tidy(dR / 0.1), v = 2 * p * t0 + q; return {
  prompt: `In a sprint test a rover’s distance from the start line is s(t) = ${n(p)}t² + ${n(q)}t metres, t seconds after the start. The timer records it a tenth of a second before and a tenth of a second after t = ${n(t0)}. Enter the difference quotient (s(${n(t0)} + h) − s(${n(t0)})) ÷ h for h = −0.1, then for h = 0.1, then the derivative s′(${n(t0)}) in metres per second, the value both one-sided limits close in on.`,
  answer: [qL, qR, v],
  hints: [`For h = −0.1 the step goes back in time: use s(${n(tL)}), and divide by −0.1. A drop in distance divided by a negative step gives a positive speed.`, `For the derivative keep h as a letter. The quotient comes out as a number plus a multiple of h, for negative and positive h alike; let h approach 0 from each side.`],
  solution: `s(${n(t0)}) = ${n(p)} × ${n(t0 * t0)} + ${n(q)} × ${n(t0)} = ${n(s0)}, s(${n(tL)}) = ${n(p)} × ${n(G.tidy(tL * tL))} + ${n(q)} × ${n(tL)} = ${n(sL)} and s(${n(tR)}) = ${n(p)} × ${n(G.tidy(tR * tR))} + ${n(q)} × ${n(tR)} = ${n(sR)}. From the left: (${n(sL)} − ${n(s0)}) ÷ (−0.1) = ${n(dL)} ÷ (−0.1) = ${n(qL)}. From the right: (${n(sR)} − ${n(s0)}) ÷ 0.1 = ${n(dR)} ÷ 0.1 = ${n(qR)}. With h as a letter, s(${n(t0)} + h) − s(${n(t0)}) = ${n(v)}h + ${n(p)}h², so the quotient is ${n(v)} + ${n(p)}h. As h approaches 0 from the left or from the right, ${n(p)}h vanishes, so both one-sided limits are ${n(v)} and s′(${n(t0)}) = ${n(v)} metres per second. The two quotients sit ${n(G.tidy(0.1 * p))} below and above it.`,
  guidance: [
   { prompt: `s(${n(t0)}) = ${n(s0)} and s(${n(tL)}) = ${n(sL)}. What is (${n(sL)} − ${n(s0)}) ÷ (−0.1)?`, answer: [qL], explanation: `${n(sL)} − ${n(s0)} = ${n(dL)}, and ${n(dL)} ÷ (−0.1) = ${n(qL)}: the average speed over the tenth of a second before the gate.` },
   { prompt: `s(${n(tR)}) = ${n(sR)}. What is (${n(sR)} − ${n(s0)}) ÷ 0.1?`, answer: [qR], explanation: `${n(sR)} − ${n(s0)} = ${n(dR)}, and ${n(dR)} ÷ 0.1 = ${n(qR)}: the average speed over the tenth of a second after the gate.` },
   { prompt: `Keep h as a letter. Expanding s(${n(t0)} + h) − s(${n(t0)}) gives (number)h + (number)h². Enter the number in front of h, then the number in front of h².`, answer: [v, p], explanation: `${n(p)}(${n(t0)} + h)² + ${n(q)}(${n(t0)} + h) − ${n(s0)} = ${n(p * t0 * t0)} + ${n(2 * p * t0)}h + ${n(p)}h² + ${n(q * t0)} + ${n(q)}h − ${n(s0)} = ${n(v)}h + ${n(p)}h².` },
   { prompt: `The quotient is ${n(v)} + ${n(p)}h. What do the limits from the left and from the right both equal?`, answer: [v], explanation: `Whichever side h comes from, ${n(p)}h shrinks to 0, so both one-sided limits are ${n(v)}. They agree, so the derivative exists: s′(${n(t0)}) = ${n(v)} metres per second.` }
  ] }; }
});

/* ---- q13 The tangent line ---- */
practice({
 id: 'q13b', parent: 'q13', kind: 'setting',
 title: 'The sensor bar on the hill',
 brief: 'A straight sensor bar has to rest on a rounded hill of the cross-country loop, touching it at one point only.',
 labels: ['slope', 'y-intercept'], tolerance: 0.01
}, [['height at the point (m)'], ['slope'], ['y-intercept']], {
 canonical: { p: 2, q: 9, r: 3, a: 1 },
 /* f(x) = −px² + qx + r, a hill (the minus sign bends it downwards). Slope q − 2pa, not 0; intercept r + pa²; f(a) > 0. */
 draw: R => { let o; do { o = { p: R.int(1, 3), q: R.int(4, 12), r: R.int(2, 10), a: R.int(1, 4) }; } while (o.q - 2 * o.p * o.a === 0 || -o.p * o.a * o.a + o.q * o.a + o.r <= 0); return o; },
 build: ({ p, q, r, a }) => { const f = poly([[-p, 'x²'], [q, 'x'], [r, '']]), fa = -p * a * a + q * a + r, m = q - 2 * p * a, k = fa - m * a; return {
  prompt: `The test track’s cross-country loop runs over a rounded hill whose surface follows y = f(x) = ${f}, with x and y in metres. A straight sensor bar is laid on the hill so that it touches the surface only at x = ${n(a)}, along the tangent line there. Enter the slope of the bar, then the height at which the bar’s line crosses x = 0 (its y-intercept).`,
  answer: [m, k],
  hints: [`The bar passes through the surface point at x = ${n(a)}, so work out f(${n(a)}) first. Keep the minus sign of the x² term.`, `For px² + qx + r the slope at x = a is 2pa + q, and here p is negative. Then choose the intercept so that the line passes through the point.`],
  solution: `The point: f(${n(a)}) = ${p === 1 ? '−' + n(a * a) : n(-p) + ' × ' + n(a * a)} + ${n(q)} × ${n(a)} + ${n(r)} = ${n(fa)}, so the bar touches at (${n(a)}, ${n(fa)}). The slope: f′(x) = ${poly([[-2 * p, 'x'], [q, '']])}, so f′(${n(a)}) = ${n(-2 * p)} × ${n(a)} + ${n(q)} = ${n(m)}. The line y = ${poly([[m, 'x']])} + k passes through the point, so ${n(fa)} = ${n(m)} × ${n(a)} + k and k = ${n(fa)} − ${par(m * a)} = ${n(k)}. The bar lies along y = ${poly([[m, 'x'], [k, '']])}.`,
  guidance: [
   { prompt: `Where does the bar touch? Work out f(${n(a)}) for f(x) = ${f}.`, answer: [fa], explanation: `f(${n(a)}) = ${p === 1 ? '−' + n(a * a) : n(-p) + ' × ' + n(a * a)} + ${n(q)} × ${n(a)} + ${n(r)} = ${n(fa)}, so the touching point is (${n(a)}, ${n(fa)}).` },
   { prompt: `Here p = ${n(-p)} and q = ${n(q)}, so f′(x) = ${poly([[-2 * p, 'x'], [q, '']])}. What is the slope f′(${n(a)})?`, answer: [m], explanation: `f′(${n(a)}) = ${n(-2 * p)} × ${n(a)} + ${n(q)} = ${n(m)}.${m < 0 ? ' It is negative: at this point the hill is already sloping down.' : ''}` },
   { prompt: `The line y = ${poly([[m, 'x']])} + k must pass through (${n(a)}, ${n(fa)}). What is k?`, answer: [k], explanation: `${n(fa)} = ${n(m)} × ${n(a)} + k, so k = ${n(fa)} − ${par(m * a)} = ${n(k)}.` }
  ] }; }
});

practice({
 id: 'q13c', parent: 'q13', kind: 'applied',
 title: 'Aiming the laser from the ramp lip',
 brief: 'On the scale model of the launch ramp, a laser at the lip points along the ramp’s direction, and the crew must place a target board where the beam will hit.',
 labels: ['slope of the beam', 'height on the board (cm)'], tolerance: 0.01
}, [['height of the lip (cm)'], ['slope of the beam'], ['height on the board (cm)']], {
 canonical: { p: 1, q: -2, r: 3, a: 3, d: 4 },
 /* Ramp y = px² + qx + r ending at x = a; beam along the tangent, board at b = a + d. Slope m = 2pa + q > 0,
    height on the board f(a) + m·d. Not the worked example (x² + 1 at 2). */
 draw: R => { let o; do { o = { p: R.int(1, 2), q: R.pick([-1, 1]) * R.int(1, 5), r: R.int(1, 6), a: R.int(2, 5), d: R.int(2, 6) }; }
  while (2 * o.p * o.a + o.q <= 0 || o.p * o.a * o.a + o.q * o.a + o.r < 2); return o; },
 build: ({ p, q, r, a, d }) => { const f = poly([[p, 'x²'], [q, 'x'], [r, '']]), fa = p * a * a + q * a + r, m = 2 * p * a + q, b = a + d, rise = m * d, H = fa + rise; return {
  prompt: `On the scale model of the test track’s launch ramp, the ramp curves upwards along y = ${f}, with x and y in centimetres, and ends at x = ${n(a)}. A laser at the lip of the model ramp is aimed straight along the tangent line there, towards a target board standing at x = ${n(b)}. Enter the slope of the beam, then the height in centimetres at which it hits the board.`,
  answer: [m, H],
  hints: [`The beam starts at the lip, the point (${n(a)}, f(${n(a)})), and climbs at the slope f′(${n(a)}).`, `From the lip to the board is ${n(d)} centimetres across, and the beam rises (slope) centimetres for every centimetre across. Add that rise to the height of the lip.`],
  solution: `The lip: f(${n(a)}) = ${p === 1 ? n(a * a) : n(p) + ' × ' + n(a * a)} + ${par(q)} × ${n(a)} + ${n(r)} = ${n(fa)}, so the lip is ${n(fa)} cm high. The slope: f′(x) = ${poly([[2 * p, 'x'], [q, '']])}, so f′(${n(a)}) = ${n(2 * p)} × ${n(a)} + ${par(q)} = ${n(m)}. From x = ${n(a)} to x = ${n(b)} is ${n(d)} centimetres across, so the beam rises ${n(m)} × ${n(d)} = ${n(rise)} centimetres and hits the board at ${n(fa)} + ${n(rise)} = ${n(H)} centimetres.`,
  guidance: [
   { prompt: `How high is the lip? Work out f(${n(a)}).`, answer: [fa], explanation: `f(${n(a)}) = ${p === 1 ? n(a * a) : n(p) + ' × ' + n(a * a)} + ${par(q)} × ${n(a)} + ${n(r)} = ${n(fa)}.` },
   { prompt: `Here f′(x) = ${poly([[2 * p, 'x'], [q, '']])}. What is the slope f′(${n(a)})?`, answer: [m], explanation: `f′(${n(a)}) = ${n(2 * p)} × ${n(a)} + ${par(q)} = ${n(m)}: the beam climbs ${n(m)} cm for every centimetre across.` },
   { prompt: `The board is ${n(d)} centimetres further across. At what height does the beam reach it?`, answer: [H], explanation: `The beam rises ${n(m)} × ${n(d)} = ${n(rise)} centimetres, so it hits the board at ${n(fa)} + ${n(rise)} = ${n(H)} centimetres.` }
  ] }; }
});

practice({
 id: 'q13d', parent: 'q13', kind: 'challenge',
 title: 'Where the guard rails meet',
 brief: 'Two straight guard rails touch the inside edge of a hairpin bend at two points, and the welder needs the point where their lines cross.',
 labels: ['slope of the first rail', 'slope of the second rail', 'x where they meet', 'y where they meet'], tolerance: 0.01
}, [['slope of the first rail', 'intercept of the first rail'], ['slope of the second rail', 'intercept of the second rail'], ['x where they meet'], ['y where they meet']], {
 canonical: { p: 2, q: -3, r: 10, a1: -3, a2: 1 },
 /* f(x) = px² + qx + r; tangents at a1 < 0 < a2 (same parity, so they meet at the whole number x = (a1 + a2) ÷ 2),
    y there = p·a1·a2 + q·x + r. Slopes not 0. */
 draw: R => { let o; do { o = { p: R.int(1, 3), q: R.pick([-1, 1]) * R.int(1, 6), r: R.int(2, 15), a1: -R.int(1, 5), a2: R.int(1, 5) }; }
  while ((o.a1 + o.a2) % 2 !== 0 || 2 * o.p * o.a1 + o.q === 0 || 2 * o.p * o.a2 + o.q === 0); return o; },
 build: ({ p, q, r, a1, a2 }) => { const f = poly([[p, 'x²'], [q, 'x'], [r, '']]), F = x => p * x * x + q * x + r, f1 = F(a1), f2 = F(a2),
  m1 = 2 * p * a1 + q, m2 = 2 * p * a2 + q, k1 = f1 - m1 * a1, k2 = f2 - m2 * a2, X = (k2 - k1) / (m1 - m2), Y = m1 * X + k1; return {
  prompt: `On the site plan, seen from above, the inside edge of a hairpin bend on the test track follows y = ${f}, with x and y in metres. Two straight guard rails are fixed against the edge: the first touches it only at x = ${n(a1)}, the second only at x = ${n(a2)}, each along the tangent line there. Enter the slope of the first rail, the slope of the second, then the x and the y of the point where the two rails’ lines meet.`,
  answer: [m1, m2, X, Y],
  hints: [`For each rail find the touching point and the slope f′ there, then write its line as y = mx + k.`, `Where the lines meet they give the same y for the same x: set the two expressions equal and solve for x, then put that x into either line.`],
  solution: `Here f′(x) = ${poly([[2 * p, 'x'], [q, '']])}. First rail: f(${n(a1)}) = ${n(f1)} and f′(${n(a1)}) = ${n(m1)}, so k = ${n(f1)} − ${par(m1 * a1)} = ${n(k1)} and the line is y = ${poly([[m1, 'x'], [k1, '']])}. Second rail: f(${n(a2)}) = ${n(f2)} and f′(${n(a2)}) = ${n(m2)}, so k = ${n(f2)} − ${par(m2 * a2)} = ${n(k2)} and the line is y = ${poly([[m2, 'x'], [k2, '']])}. Setting them equal: ${poly([[m1, 'x'], [k1, '']])} = ${poly([[m2, 'x'], [k2, '']])}, so ${poly([[m1 - m2, 'x']])} = ${n(k2 - k1)} and x = ${n(X)}. Then y = ${n(m1)} × ${par(X)} + ${par(k1)} = ${n(Y)}. The rails meet at (${n(X)}, ${n(Y)}).`,
  guidance: [
   { prompt: `First rail: f(${n(a1)}) = ${n(f1)}. Enter its slope f′(${n(a1)}), then its intercept k.`, answer: [m1, k1], explanation: `f′(${n(a1)}) = ${n(2 * p)} × ${par(a1)} + ${par(q)} = ${n(m1)}, and k = ${n(f1)} − ${par(m1)} × ${par(a1)} = ${n(k1)}.` },
   { prompt: `Second rail: f(${n(a2)}) = ${n(f2)}. Enter its slope f′(${n(a2)}), then its intercept k.`, answer: [m2, k2], explanation: `f′(${n(a2)}) = ${n(2 * p)} × ${n(a2)} + ${par(q)} = ${n(m2)}, and k = ${n(f2)} − ${par(m2)} × ${n(a2)} = ${n(k2)}.` },
   { prompt: `Solve ${poly([[m1, 'x'], [k1, '']])} = ${poly([[m2, 'x'], [k2, '']])} for x.`, answer: [X], explanation: `Collecting the x terms on the left: ${poly([[m1 - m2, 'x']])} = ${n(k2 - k1)}, so x = ${n(k2 - k1)} ÷ ${par(m1 - m2)} = ${n(X)}.` },
   { prompt: `Put x = ${n(X)} into the first rail’s line. What is y?`, answer: [Y], explanation: `y = ${n(m1)} × ${par(X)} + ${par(k1)} = ${n(Y)}. The second line gives the same: ${n(m2)} × ${par(X)} + ${par(k2)} = ${n(Y)}.` }
  ] }; }
});

/* ---- q14 The power rule ---- */
practice({
 id: 'q14b', parent: 'q14', kind: 'setting',
 title: 'The battery on the hill climb',
 brief: 'The energy a rover’s battery has used on the hill climb follows a single power of time, and the crew want the rate it is being drawn.',
 labels: ['coefficient', 'power', 'rate (kJ per minute)'], tolerance: 0.01
}, [['coefficient'], ['power'], ['rate (kJ per minute)']], {
 canonical: { k: 5, a: 2 },
 /* E(t) = tᵏ; E′(a) = k·aᵏ⁻¹, at most 6 × 4⁵ = 6144. Not the worked example (x³ at 4) or the parent (t⁴ at 2). */
 draw: R => { let o; do { o = { k: R.int(3, 6), a: R.int(2, 4) }; } while ((o.k === 3 && o.a === 4) || (o.k === 4 && o.a === 2)); return o; },
 build: ({ k, a }) => { const pw = k - 1, ap = Math.pow(a, pw), d = k * ap; return {
  prompt: `On the hill-climb test the energy a rover’s battery has used is E(t) = ${pow('t', k)} kilojoules, t minutes after the climb starts. By the power rule E′(t) is a number times a power of t. Enter that number, then the power, then E′(${n(a)}), the rate at which energy is being drawn at t = ${n(a)}, in kilojoules per minute (type it without commas).`,
  answer: [k, pw, d],
  hints: ['The old exponent becomes the number in front, and the new exponent is one less than the old one.', `To find E′(${n(a)}), raise ${n(a)} to the new power before you multiply.`],
  solution: `By the power rule the derivative of ${pow('t', k)} is ${n(k)}${pow('t', pw)}: the exponent ${n(k)} comes down in front and the new power is ${n(k)} − 1 = ${n(pw)}. At t = ${n(a)}: E′(${n(a)}) = ${n(k)} × ${n(a)}${sup(pw)} = ${n(k)} × ${n(ap)} = ${n(d)} kilojoules per minute.`,
  guidance: [
   { prompt: `E(t) = ${pow('t', k)}. Which number comes down in front of E′(t)?`, answer: [k], explanation: `The exponent ${n(k)} comes down as the number in front.` },
   { prompt: `What is the power of t in E′(t)?`, answer: [pw], explanation: `${n(k)} − 1 = ${n(pw)}, so E′(t) = ${n(k)}${pow('t', pw)}.` },
   { prompt: `Put t = ${n(a)} into E′(t) = ${n(k)}${pow('t', pw)}. What is E′(${n(a)})?`, answer: [d], explanation: `${n(a)}${sup(pw)} = ${n(ap)}, and ${n(k)} × ${n(ap)} = ${n(d)} kilojoules per minute.` }
  ] }; }
});

practice({
 id: 'q14c', parent: 'q14', kind: 'applied',
 title: 'Cutting the rocket sled',
 brief: 'A rocket sled’s motor is cut the moment it reaches a set speed, and the crew must know when that happens and how much track it needs.',
 labels: ['time (s)', 'distance (m)'], tolerance: 0.01
}, [['time (s)'], ['distance (m)']], {
 canonical: { k: 3, T: 4 },
 /* d(t) = tᵏ, speed k·tᵏ⁻¹ = X at the whole-number time T; distance Tᵏ. Speeds stay at most 147 m/s (a rocket sled). */
 draw: R => { const k = R.int(3, 5); return { k, T: k === 3 ? R.int(2, 7) : k === 4 ? R.int(2, 3) : 2 }; },
 build: ({ k, T }) => { const pw = k - 1, Tp = Math.pow(T, pw), X = k * Tp, D = Math.pow(T, k); return {
  prompt: `A rocket sled runs on the test track’s long straight. Its distance from the start is d(t) = ${pow('t', k)} metres, t seconds after it fires, and the rocket is cut the moment its speed reaches ${n(X)} m/s. Enter the time in seconds at which the speed reaches ${n(X)} m/s, then the distance in metres the sled has covered by then.`,
  answer: [T, D],
  hints: ['The speed is d′(t). Write it with the power rule and set it equal to the cut-off speed.', 'Divide both sides by the number in front, then ask which whole number, raised to the remaining power, gives the result.'],
  solution: `The speed is d′(t) = ${n(k)}${pow('t', pw)}. Setting ${n(k)}${pow('t', pw)} = ${n(X)} gives ${pow('t', pw)} = ${n(X)} ÷ ${n(k)} = ${n(Tp)}, and ${n(T)}${sup(pw)} = ${n(Tp)}, so t = ${n(T)} seconds. By then the sled has covered d(${n(T)}) = ${n(T)}${sup(k)} = ${n(D)} metres.`,
  guidance: [
   { prompt: `d′(t) = ${n(k)}${pow('t', pw)}. Solve ${n(k)}${pow('t', pw)} = ${n(X)}: first find ${pow('t', pw)}, then t. Enter t.`, answer: [T], explanation: `${pow('t', pw)} = ${n(X)} ÷ ${n(k)} = ${n(Tp)}, and ${n(T)}${sup(pw)} = ${n(Tp)}, so t = ${n(T)} seconds.` },
   { prompt: `How far has the sled gone at t = ${n(T)}? Work out d(${n(T)}) = ${n(T)}${sup(k)}.`, answer: [D], explanation: `${n(T)}${sup(k)} = ${n(D)}, so the sled needs ${n(D)} metres of track before the cut.` }
  ] }; }
});

practice({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q13',
 title: 'A rail along the power curve',
 brief: 'On the track drawing a curved edge follows a single power of x, and a straight rail must touch it at one point.',
 labels: ['slope', 'y-intercept'], tolerance: 0.01
}, [['value at the point'], ['slope'], ['y-intercept']], {
 canonical: { k: 3, a: -2 },
 /* f(x) = xᵏ, tangent at a (±2 or ±3): slope k·aᵏ⁻¹, intercept aᵏ − slope·a = (1 − k)·aᵏ (at most 972 in size). */
 draw: R => ({ k: R.int(3, 5), a: R.pick([-3, -2, 2, 3]) }),
 build: ({ k, a }) => { const pw = k - 1, fa = Math.pow(a, k), ap = Math.pow(a, pw), m = k * ap, b = fa - m * a; return {
  prompt: `On the test track’s plan, drawn in grid units, the edge of a curve follows y = f(x) = ${pow('x', k)}. A straight rail touches the edge at x = ${n(a)}, along the tangent line there. Enter the slope of the rail, then its y-intercept, so that the rail is y = (slope)x + (intercept).`,
  answer: [m, b],
  hints: [`The rail passes through (${n(a)}, f(${n(a)})). Work out ${par(a)}${sup(k)}${a < 0 ? ' with care for the sign' : ''}.`, `The slope is f′(${n(a)}), from the power rule. Then choose the intercept so that the line passes through the touching point.`],
  solution: `The point: f(${n(a)}) = ${par(a)}${sup(k)} = ${n(fa)}, so the rail touches at (${n(a)}, ${n(fa)}). The slope: f′(x) = ${n(k)}${pow('x', pw)}, so f′(${n(a)}) = ${n(k)} × ${par(a)}${sup(pw)} = ${n(k)} × ${n(ap)} = ${n(m)}. The line y = ${poly([[m, 'x']])} + c passes through the point, so ${n(fa)} = ${n(m)} × ${par(a)} + c and c = ${n(fa)} − ${par(m * a)} = ${n(b)}. The rail is y = ${poly([[m, 'x'], [b, '']])}.`,
  guidance: [
   { prompt: `Where does the rail touch? Work out f(${n(a)}) = ${par(a)}${sup(k)}.`, answer: [fa], explanation: `${par(a)}${sup(k)} = ${n(fa)}${a < 0 ? (k % 2 ? ': an odd power of a negative number is negative' : ': an even power of a negative number is positive') : ''}.` },
   { prompt: `By the power rule f′(x) = ${n(k)}${pow('x', pw)}. What is the slope f′(${n(a)})?`, answer: [m], explanation: `${par(a)}${sup(pw)} = ${n(ap)}, and ${n(k)} × ${n(ap)} = ${n(m)}.` },
   { prompt: `The line y = ${poly([[m, 'x']])} + c must pass through (${n(a)}, ${n(fa)}). What is c?`, answer: [b], explanation: `${n(fa)} = ${n(m)} × ${par(a)} + c, so c = ${n(fa)} − ${par(m * a)} = ${n(b)}.` }
  ] }; }
});

/* ---- q15 Constant multiple, sum and difference rules ---- */
practice({
 id: 'q15b', parent: 'q15', kind: 'setting',
 title: 'How steep is the test hill',
 brief: 'The designers modelled a rolling section of the test track with a cubic, and the crew need its steepness at one marker.',
 labels: ['A', 'B', 'C', 'steepness (cm per metre)'], tolerance: 0.01
}, [['A'], ['B', 'C'], ['steepness (cm per metre)']], {
 canonical: { a: -1, b: 6, c: -5, d: 40, x0: 2 },
 /* h(x) = d + cx + bx² + ax³, written lowest power first; h′(x) = 3ax² + 2bx + c. The steepness is not ±1 or 0. */
 draw: R => { let o; do { o = { a: -R.int(1, 3), b: R.int(2, 9), c: R.pick([-1, 1]) * R.int(2, 9), d: R.int(20, 60), x0: R.int(1, 4) }; }
  while ([-1, 0, 1].includes(3 * o.a * o.x0 * o.x0 + 2 * o.b * o.x0 + o.c)); return o; },
 build: ({ a, b, c, d, x0 }) => { const H = poly([[d, ''], [c, 'x'], [b, 'x²'], [a, 'x³']]), A = 3 * a, B = 2 * b, C = c, v = A * x0 * x0 + B * x0 + C; return {
  prompt: `A rolling section of the test track is modelled so that its height above the base level is h(x) = ${H} centimetres, x metres past a marker. Differentiate term by term and write h′(x) = Ax² + Bx + C, highest power first. Enter A, B and C, then h′(${n(x0)}), the steepness of the track at x = ${n(x0)} in centimetres per metre.`,
  answer: [A, B, C, v],
  hints: ['The terms are written lowest power first. Differentiate each one with its sign and its number, then reorder from the highest power down.', 'A term in x³ gives a term in x², a term in x² gives a term in x, and a term in x gives a plain number.'],
  solution: `Term by term: ${n(d)} gives 0, ${n(c)}x gives ${n(C)}, ${n(b)}x² gives ${n(b)} × 2x = ${n(B)}x, and ${poly([[a, 'x³']])} gives ${n(a)} × 3x² = ${n(A)}x². So h′(x) = ${poly([[A, 'x²'], [B, 'x'], [C, '']])}, with A = ${n(A)}, B = ${n(B)} and C = ${n(C)}. At x = ${n(x0)}: h′(${n(x0)}) = ${n(A)} × ${n(x0 * x0)} + ${n(B)} × ${n(x0)} + ${par(C)} = ${n(v)} centimetres per metre.${v < 0 ? ' The minus sign means the track is going downhill there.' : ''}`,
  guidance: [
   { prompt: `The highest term is ${poly([[a, 'x³']])}. Its derivative is Ax². What is A?`, answer: [A], explanation: `${n(a)} × 3x² = ${n(A)}x², so A = ${n(A)}.` },
   { prompt: `Now ${n(b)}x² and ${n(c)}x. Enter B, then C. (The constant ${n(d)} gives 0.)`, answer: [B, C], explanation: `${n(b)} × 2x = ${n(B)}x, so B = ${n(B)}; ${n(c)}x gives ${n(C)}, so C = ${n(C)}.` },
   { prompt: `h′(x) = ${poly([[A, 'x²'], [B, 'x'], [C, '']])}. What is h′(${n(x0)})?`, answer: [v], explanation: `${n(A)} × ${n(x0 * x0)} + ${n(B)} × ${n(x0)} + ${par(C)} = ${n(v)} centimetres per metre.` }
  ] }; }
});

practice({
 id: 'q15c', parent: 'q15', kind: 'applied',
 title: 'The leaking cooling tank',
 brief: 'The test track’s water-cooling tank has sprung a leak, and the crew need to know how fast it is emptying and how long the water would last.',
 labels: ['leak rate (L/min)', 'minutes left'], tolerance: 0.01
}, [['V′ at the check (L/min)'], ['coolant left (L)'], ['minutes left']], {
 canonical: { a: 2, b: 3, t0: 4, M: 6 },
 /* V(t) = V0 − bt − at²; leak rate 2at0 + b; V(t0) = M × rate, so the minutes left are the whole number M. */
 draw: R => ({ a: R.int(2, 4), b: R.int(2, 8), t0: R.int(2, 6), M: R.int(2, 15) }),
 build: ({ a, b, t0, M }) => { const rate = 2 * a * t0 + b, left = M * rate, V0 = left + b * t0 + a * t0 * t0, V = poly([[V0, ''], [-b, 't'], [-a, 't²']]); return {
  prompt: `The test track’s water-cooling tank is leaking. t minutes after the leak starts it holds V(t) = ${V} litres. The crew check it at t = ${n(t0)}. Enter how fast the coolant is running out at that moment, in litres per minute (as a positive number), then how many minutes the coolant left at t = ${n(t0)} would last if it kept running out at exactly that rate.`,
  answer: [rate, M],
  hints: [`Differentiate V(t) term by term. V′(${n(t0)}) is negative because the volume is falling; the leak rate is that number without its minus sign.`, `Find how much coolant is left at t = ${n(t0)}, then divide it by the leak rate.`],
  solution: `Term by term, V′(t) = ${poly([[-b, ''], [-2 * a, 't']])}, so V′(${n(t0)}) = −${n(b)} − ${n(2 * a)} × ${n(t0)} = ${n(-rate)}: the coolant is running out at ${n(rate)} litres per minute. At t = ${n(t0)} the tank holds V(${n(t0)}) = ${n(V0)} − ${n(b * t0)} − ${n(a * t0 * t0)} = ${n(left)} litres. At ${n(rate)} litres per minute that lasts ${n(left)} ÷ ${n(rate)} = ${n(M)} minutes.`,
  guidance: [
   { prompt: `V′(t) = ${poly([[-b, ''], [-2 * a, 't']])}. What is V′(${n(t0)})?`, answer: [-rate], explanation: `V′(${n(t0)}) = −${n(b)} − ${n(2 * a)} × ${n(t0)} = ${n(-rate)}, so the coolant runs out at ${n(rate)} litres per minute.` },
   { prompt: `How much coolant is left at t = ${n(t0)}? Work out V(${n(t0)}).`, answer: [left], explanation: `${n(V0)} − ${n(b)} × ${n(t0)} − ${n(a)} × ${n(t0 * t0)} = ${n(V0)} − ${n(b * t0)} − ${n(a * t0 * t0)} = ${n(left)} litres.` },
   { prompt: `At ${n(rate)} litres per minute, how many minutes do ${n(left)} litres last?`, answer: [M], explanation: `${n(left)} ÷ ${n(rate)} = ${n(M)} minutes.` }
  ] }; }
});

practice({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q01',
 title: 'Tyre heat over the long run',
 brief: 'The tyre temperature on a long test run follows a cubic, and the crew compare its rate at two moments with its average rate between them.',
 labels: ['rate at the first time (°/min)', 'rate at the second time (°/min)', 'average rate (°/min)'], tolerance: 0.01
}, [['A', 'B', 'C'], ['rate at the first time (°/min)', 'rate at the second time (°/min)'], ['temperature at the first time', 'temperature at the second time'], ['average rate (°/min)']], {
 canonical: { a: -1, b: 9, c: -12, d: 30, t1: 1, t2: 3 },
 /* T(t) = at³ + bt² + ct + d with T at least 5 at every whole minute from t1 to t2. For a polynomial with whole-number
    coefficients the average rate over whole-number times is a whole number. No rate or change is ±1 ("1 degrees"). */
 draw: R => { let o; const T = (o, t) => o.a * t ** 3 + o.b * t * t + o.c * t + o.d, D = (o, t) => 3 * o.a * t * t + 2 * o.b * t + o.c;
  do { const t1 = R.int(0, 3); o = { a: R.pick([-2, -1, 1, 2]), b: R.pick([-1, 1]) * R.int(2, 9), c: R.pick([-1, 1]) * R.int(2, 20), d: R.int(15, 40), t1, t2: t1 + R.int(2, 3) }; }
  while ([0, 1, 2, 3, 4, 5, 6].some(t => t >= o.t1 && t <= o.t2 && T(o, t) < 5) || [D(o, o.t1), D(o, o.t2), T(o, o.t2) - T(o, o.t1), (T(o, o.t2) - T(o, o.t1)) / (o.t2 - o.t1)].some(v => Math.abs(v) === 1)); return o; },
 build: ({ a, b, c, d, t1, t2 }) => { const Tx = poly([[a, 't³'], [b, 't²'], [c, 't'], [d, '']]), T = t => a * t ** 3 + b * t * t + c * t + d,
  A = 3 * a, B = 2 * b, C = c, D = t => A * t * t + B * t + C, r1 = D(t1), r2 = D(t2), T1 = T(t1), T2 = T(t2), dT = T2 - T1, dt = t2 - t1, avg = dT / dt; return {
  prompt: `On a long test run the temperature of a rover’s tyres is modelled by T(t) = ${Tx} degrees, t minutes after the start. Enter the instantaneous rate of change T′(${n(t1)}), then T′(${n(t2)}), both in degrees per minute, then the average rate of change of the temperature from t = ${n(t1)} to t = ${n(t2)}.`,
  answer: [r1, r2, avg],
  hints: ['Differentiate term by term, then put each time into T′(t).', `The average rate needs the temperatures themselves, not the derivative: (T(${n(t2)}) − T(${n(t1)})) ÷ (${n(t2)} − ${n(t1)}).`],
  solution: `Term by term, T′(t) = ${poly([[A, 't²'], [B, 't'], [C, '']])}. So T′(${n(t1)}) = ${n(A)} × ${n(t1 * t1)} + ${par(B)} × ${n(t1)} + ${par(C)} = ${n(r1)} and T′(${n(t2)}) = ${n(A)} × ${n(t2 * t2)} + ${par(B)} × ${n(t2)} + ${par(C)} = ${n(r2)} degrees per minute. For the average rate: T(${n(t1)}) = ${n(T1)} and T(${n(t2)}) = ${n(T2)}, so the temperature changes by ${n(T2)} − ${n(T1)} = ${n(dT)} degrees over ${n(dt)} minutes, an average of ${n(dT)} ÷ ${n(dt)} = ${n(avg)} degrees per minute.`,
  guidance: [
   { prompt: `Differentiate T(t) = ${Tx} term by term into T′(t) = At² + Bt + C. Enter A, B and C.`, answer: [A, B, C], explanation: `${poly([[a, 't³']])} gives ${n(A)}t², ${n(b)}t² gives ${n(B)}t, ${n(c)}t gives ${n(C)}, and ${n(d)} gives 0.` },
   { prompt: `Enter T′(${n(t1)}), then T′(${n(t2)}).`, answer: [r1, r2], explanation: `T′(${n(t1)}) = ${n(A)} × ${n(t1 * t1)} + ${par(B)} × ${n(t1)} + ${par(C)} = ${n(r1)} and T′(${n(t2)}) = ${n(A)} × ${n(t2 * t2)} + ${par(B)} × ${n(t2)} + ${par(C)} = ${n(r2)}.` },
   { prompt: `Now the temperatures themselves. Enter T(${n(t1)}), then T(${n(t2)}).`, answer: [T1, T2], explanation: `Putting each time into T(t) gives T(${n(t1)}) = ${n(T1)} and T(${n(t2)}) = ${n(T2)} degrees.` },
   { prompt: `What is (${n(T2)} − ${n(T1)}) ÷ ${n(dt)}?`, answer: [avg], explanation: `${n(dT)} ÷ ${n(dt)} = ${n(avg)} degrees per minute on average.` }
  ] }; }
});
})();
