/* Calculus 1 practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions". The worked sample is q01b in practice-1.js.
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc1/oracle-p7.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* The authored mission is build(canonical) itself, so its text and the generator cannot drift apart.
   meta = {id, parent, kind, title, brief, labels, tolerance, uses?}; stepLabels = the labels of each guided step. */
const practice = (meta, stepLabels, gen) => {
 const b = gen.build(gen.canonical), c = G.clean;
 add(Object.assign({}, meta, {
  prompt: c(b.prompt), answer: b.answer, hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((g, i) => ({ prompt: c(g.prompt), answer: g.answer, labels: stepLabels[i], explanation: c(g.explanation) }))
 }), gen);
};
/* x rounded to d decimal places, and whether x lies too close to a rounding boundary at d places to be fair. */
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const edgy = (x, d) => { const v = Math.abs(x) * Math.pow(10, d); return Math.abs(v - Math.floor(v) - 0.5) < 0.1; };
/* "=" when x is shown exactly by n() (at most 4 decimals), "≈" otherwise. */
const eq = x => Math.abs(x - rd(x, 4)) < 1e-9 ? '=' : '≈';

/* ---- q31 Optimisation ---- */
practice({
 id: 'q31b', parent: 'q31', kind: 'setting',
 title: 'Two pens for the test drones',
 brief: 'The studio wants a fenced yard split into two equal drone pens, and it has one roll of fencing for the whole job.',
 labels: ['depth x (m)', 'long side (m)', 'largest area (m²)'], tolerance: 0.01
}, [['b'], ['depth x (m)'], ['long side (m)', 'area (m²)']], {
 canonical: { L: 84 },
 /* L = 12k metres, so the depth 2k, the long side 3k and the area 6k² are whole numbers below 1000. k = 5 would
    give the worked example's depth of 10 m. */
 draw: R => ({ L: 12 * R.except(3, 12, [5]) }),
 build: ({ L }) => { const h = L / 2, x = L / 6, y = L / 4, A = x * y, end = L / 3; return {
  prompt: `The design studio is fencing a rectangular yard for its test drones, split into two equal pens by one straight fence across the middle. The four outside sides and the middle fence use all ${n(L)} metres of fencing. Let x be the depth of the yard: the length of each end fence and of the middle fence, which run side by side. Enter the depth x that gives the largest total area, then the length of each long side, both in metres, then that largest area in square metres.`,
  answer: [x, y, A],
  hints: [`Three fences of length x and two long sides of length y use all the fencing: 3x + 2y = ${n(L)}. Solve this for y first.`, 'Write the area x × y using x alone, multiply out, and set its derivative equal to zero.'],
  solution: `The fencing gives 3x + 2y = ${n(L)}, so each long side is y = (${n(L)} − 3x) ÷ 2 = ${n(h)} − 1.5x. The area is A(x) = x(${n(h)} − 1.5x) = ${n(h)}x − 1.5x². Its derivative is A′(x) = ${n(h)} − 3x, which is 0 at x = ${n(h)} ÷ 3 = ${n(x)}. The depth can only run from 0 to ${n(end)} metres, and at both ends the area is 0, so this critical point gives the largest area. Each long side is ${n(h)} − 1.5 × ${n(x)} = ${n(y)} metres and the area is ${n(x)} × ${n(y)} = ${n(A)} square metres.`,
  guidance: [
   { prompt: `The fencing gives 3x + 2y = ${n(L)}. Solve it for the long side in the form y = b − 1.5x. What is b?`, answer: [h], explanation: `Subtract 3x and halve: y = (${n(L)} − 3x) ÷ 2 = ${n(h)} − 1.5x, so b = ${n(h)}.` },
   { prompt: `The area is A(x) = x(${n(h)} − 1.5x) = ${n(h)}x − 1.5x². At what depth x is A′(x) zero?`, answer: [x], explanation: `A′(x) = ${n(h)} − 3x. Setting ${n(h)} − 3x = 0 gives x = ${n(h)} ÷ 3 = ${n(x)} metres.` },
   { prompt: `With a depth of ${n(x)} m, what are each long side and the total area of the yard?`, answer: [y, A], explanation: `Each long side is ${n(h)} − 1.5 × ${n(x)} = ${n(y)} metres and the area is ${n(x)} × ${n(y)} = ${n(A)} square metres. At a depth of 0 or of ${n(end)} metres the area would be 0, so this is the largest.` }
  ] }; }
});

practice({
 id: 'q31c', parent: 'q31', kind: 'applied',
 title: 'The cheapest edging for the test plot',
 brief: 'A test plot of fixed size goes against the studio’s glass wall, and the budget needs the layout with the least edging to buy.',
 labels: ['depth x (m)', 'edging (m)', 'cost (credits)'], tolerance: 0.01
}, [['depth x (m)'], ['side along the wall (m)', 'edging (m)'], ['cost (credits)']], {
 canonical: { m: 6, P: 5 },
 /* The area is 2m², so the best depth m, the wall side 2m and the edging 4m are whole numbers. m = 10 would give
    the worked example's depth. */
 draw: R => ({ m: R.except(4, 15, [10]), P: R.int(3, 9) }),
 build: ({ m, P }) => { const Ar = 2 * m * m, w = 2 * m, E = 4 * m, cost = E * P; return {
  prompt: `The design studio is planning a rectangular test plot of exactly ${n(Ar)} square metres outside its glass wall. The wall side needs no edging; the other three sides get edging that costs ${n(P)} credits per metre. Let x be the depth of the plot, the length of each side that meets the wall. Enter the depth x that needs the least edging, in metres, then that least length of edging in metres, then what it costs in credits.`,
  answer: [m, E, cost],
  hints: [`The side along the wall is ${n(Ar)} ÷ x, so the edging is E(x) = 2x + ${n(Ar)} ÷ x. Write ${n(Ar)} ÷ x as ${n(Ar)}x⁻¹ to differentiate it with the power rule.`, 'Set E′(x) = 0, solve for x², then take the positive square root.'],
  solution: `The area is x times the side along the wall, so that side is ${n(Ar)} ÷ x metres and the edging is E(x) = 2x + ${n(Ar)} ÷ x. By the power rule the derivative of ${n(Ar)}x⁻¹ is −${n(Ar)}x⁻², so E′(x) = 2 − ${n(Ar)} ÷ x². Setting it equal to 0 gives x² = ${n(Ar)} ÷ 2 = ${n(m * m)}, so x = ${n(m)} metres. The edging grows without limit when x is close to 0 or very large, so this critical point gives the least edging. The side along the wall is ${n(Ar)} ÷ ${n(m)} = ${n(w)} metres, so the edging is ${n(m)} + ${n(m)} + ${n(w)} = ${n(E)} metres, and it costs ${n(E)} × ${n(P)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `The edging is E(x) = 2x + ${n(Ar)} ÷ x, so E′(x) = 2 − ${n(Ar)} ÷ x². At what depth x is E′(x) = 0?`, answer: [m], explanation: `2 − ${n(Ar)} ÷ x² = 0 gives x² = ${n(Ar)} ÷ 2 = ${n(m * m)}, so x = ${n(m)} metres; a depth cannot be negative.` },
   { prompt: `With a depth of ${n(m)} m, how long is the side along the wall, and how much edging is needed in all?`, answer: [w, E], explanation: `The side along the wall is ${n(Ar)} ÷ ${n(m)} = ${n(w)} metres, and the edging is ${n(m)} + ${n(m)} + ${n(w)} = ${n(E)} metres.` },
   { prompt: `Edging costs ${n(P)} credits per metre. What does the least edging cost?`, answer: [cost], explanation: `${n(E)} × ${n(P)} = ${n(cost)} credits. Every other depth needs more edging, so this is the cheapest plot.` }
  ] }; }
});

practice({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q28',
 title: 'Folding the parts tray',
 brief: 'The studio folds open-top parts trays from square metal sheets and wants the corner cut that holds the most.',
 labels: ['cut x (cm)', 'largest volume (cm³)', 'V″ at the cut'], tolerance: 0.01
}, [['b', 'c'], ['cut x (cm)'], ['volume (cm³)', 'V″ at the cut']], {
 canonical: { s: 30 },
 /* s = 6k, so the best cut k, the volume 16k³ and V″ = −24k are whole numbers; the volume stays below 17000. */
 draw: R => ({ s: 6 * R.int(2, 10) }),
 build: ({ s }) => { const x = s / 6, half = s / 2, side = s - 2 * x, V = x * side * side, Vpp = 24 * x - 8 * s; return {
  prompt: `The design studio makes an open-top parts tray from a square metal sheet ${n(s)} cm wide: it cuts a square of side x cm from each corner and folds up the four flaps. The tray’s volume is V(x) = x(${n(s)} − 2x)² cubic centimetres, for x from 0 to ${n(half)}. Enter the cut x that gives the largest volume, in cm, then that volume in cubic centimetres (type it without commas), then the second derivative V″ at that cut.`,
  answer: [x, V, Vpp],
  hints: [`Multiply out V(x) into the form 4x³ − bx² + cx, differentiate, set V′(x) = 0 and solve the quadratic. One of its roots is the end of the interval, where the tray is flat.`, 'Find V″ by differentiating V′. A negative second derivative at the critical point means the graph is concave down there, so the point is a maximum.'],
  solution: `Since (${n(s)} − 2x)² = ${n(s * s)} − ${n(4 * s)}x + 4x², the volume is V(x) = 4x³ − ${n(4 * s)}x² + ${n(s * s)}x, so V′(x) = 12x² − ${n(8 * s)}x + ${n(s * s)}. The quadratic formula gives x = (${n(8 * s)} ± ${n(4 * s)}) ÷ 24, so x = ${n(half)} or x = ${n(x)}. At x = ${n(half)} the flaps take the whole sheet and the volume is 0, so the useful cut is x = ${n(x)} cm. The volume is ${n(x)} × ${n(side)}² = ${n(x)} × ${n(side * side)} = ${n(V)} cubic centimetres. The second derivative is V″(x) = 24x − ${n(8 * s)}, which at x = ${n(x)} is ${n(24 * x)} − ${n(8 * s)} = ${n(Vpp)}. It is negative, so the graph is concave down there and this cut gives the largest volume.`,
  guidance: [
   { prompt: `Multiply out V(x) = x(${n(s)} − 2x)² into the form 4x³ − bx² + cx. What are b and c?`, answer: [4 * s, s * s], explanation: `(${n(s)} − 2x)² = ${n(s * s)} − ${n(4 * s)}x + 4x², and multiplying by x gives 4x³ − ${n(4 * s)}x² + ${n(s * s)}x: b = ${n(4 * s)} and c = ${n(s * s)}.` },
   { prompt: `V′(x) = 12x² − ${n(8 * s)}x + ${n(s * s)}. One zero is x = ${n(half)}, where the tray is flat. What is the other, smaller zero?`, answer: [x], explanation: `The quadratic formula gives x = (${n(8 * s)} ± ${n(4 * s)}) ÷ 24, which is ${n(half)} or ${n(x)}. The cut must be below ${n(half)}, so it is ${n(x)} cm.` },
   { prompt: `What is the volume at a cut of ${n(x)} cm, and what is V″ there, with V″(x) = 24x − ${n(8 * s)}?`, answer: [V, Vpp], explanation: `V(${n(x)}) = ${n(x)} × ${n(side)}² = ${n(V)} cubic centimetres, and V″(${n(x)}) = ${n(24 * x)} − ${n(8 * s)} = ${n(Vpp)}. A negative V″ means a maximum.` }
  ] }; }
});

/* ---- q32 The Mean Value Theorem ---- */
practice({
 id: 'q32b', parent: 'q32', kind: 'setting',
 title: 'The climb rate of the test drone',
 brief: 'A test drone climbed straight up from the studio roof, and the flight log needs the moment its climb rate matched its average.',
 labels: ['average climb rate (m/s)', 'time c (s)'], tolerance: 0.01
}, [['h at the start (m)', 'h at the end (m)'], ['average climb rate (m/s)'], ['time c (s)']], {
 canonical: { a: 2, b: 30, t1: 1, t2: 6 },
 /* h(t) = bt − at² with b > 2a·t2, so the drone is still climbing at the end of the interval and every height is
    positive; the interval is at least 2 seconds long. */
 draw: R => { const a = R.int(2, 4), t1 = R.int(1, 3), t2 = t1 + R.int(2, 5); return { a, b: 2 * a * t2 + R.int(2, 12), t1, t2 }; },
 build: ({ a, b, t1, t2 }) => { const h1 = b * t1 - a * t1 * t1, h2 = b * t2 - a * t2 * t2, dh = h2 - h1, dt = t2 - t1, avg = dh / dt, c = (b - avg) / (2 * a); return {
  prompt: `The design studio’s test drone climbs straight up from the studio’s roof pad. Its height after t seconds is h(t) = ${n(b)}t − ${n(a)}t² metres, and it is still climbing at t = ${n(t2)}. Between t = ${n(t1)} and t = ${n(t2)}, enter its average rate of climb in metres per second, then the time c inside that interval at which its rate of climb at that instant equals the average, in seconds.`,
  answer: [avg, c],
  hints: [`The average rate of climb is the change in height divided by the time taken: (h(${n(t2)}) − h(${n(t1)})) ÷ (${n(t2)} − ${n(t1)}).`, `The rate of climb at an instant is the derivative, h′(t) = ${n(b)} − ${n(2 * a)}t. Set it equal to the average and solve for t.`],
  solution: `h(${n(t1)}) = ${n(b)} × ${n(t1)} − ${n(a)} × ${n(t1 * t1)} = ${n(h1)} and h(${n(t2)}) = ${n(b)} × ${n(t2)} − ${n(a)} × ${n(t2 * t2)} = ${n(h2)}, so the average rate of climb is (${n(h2)} − ${n(h1)}) ÷ ${n(dt)} = ${n(dh)} ÷ ${n(dt)} = ${n(avg)} metres per second. The rate of climb at time t is h′(t) = ${n(b)} − ${n(2 * a)}t. Setting ${n(b)} − ${n(2 * a)}c = ${n(avg)} gives ${n(2 * a)}c = ${n(b - avg)}, so c = ${n(c)} seconds, inside the interval as the Mean Value Theorem promises.`,
  guidance: [
   { prompt: `Put the two times into h(t) = ${n(b)}t − ${n(a)}t². What are h(${n(t1)}) and h(${n(t2)})?`, answer: [h1, h2], explanation: `h(${n(t1)}) = ${n(b)} × ${n(t1)} − ${n(a)} × ${n(t1 * t1)} = ${n(h1)} and h(${n(t2)}) = ${n(b)} × ${n(t2)} − ${n(a)} × ${n(t2 * t2)} = ${n(h2)}.` },
   { prompt: `The drone rises from ${n(h1)} m to ${n(h2)} m between t = ${n(t1)} and t = ${n(t2)}. What is its average rate of climb?`, answer: [avg], explanation: `(${n(h2)} − ${n(h1)}) ÷ (${n(t2)} − ${n(t1)}) = ${n(dh)} ÷ ${n(dt)} = ${n(avg)} metres per second: the slope of the secant line through the two ends.` },
   { prompt: `The rate of climb at time t is h′(t) = ${n(b)} − ${n(2 * a)}t. At what time c is it equal to ${n(avg)}?`, answer: [c], explanation: `${n(b)} − ${n(2 * a)}c = ${n(avg)} gives ${n(2 * a)}c = ${n(b - avg)}, so c = ${n(b - avg)} ÷ ${n(2 * a)} = ${n(c)} seconds. There the tangent line is parallel to the secant line.` }
  ] }; }
});

practice({
 id: 'q32c', parent: 'q32', kind: 'applied',
 title: 'The speed cap on the corridor cart',
 brief: 'The studio’s delivery cart has a speed cap, and its trip log is enough to tell whether the cap was broken.',
 labels: ['average speed (m/s)', 'above the cap (m/s)', 'shortest legal time (s)'], tolerance: 0.01
}, [['average speed (m/s)'], ['above the cap (m/s)'], ['shortest legal time (s)']], {
 canonical: { D: 120, T: 15, v: 5 },
 /* The average speed s is a whole number above the cap v, and the shortest legal time D ÷ v has at most one decimal. */
 draw: R => { let p; do { const v = R.int(3, 8), s = v + R.int(1, 4), T = R.int(6, 20); p = { D: s * T, T, v }; } while ((p.D * 10) % p.v !== 0); return p; },
 build: ({ D, T, v }) => { const avg = D / T, over = avg - v, tmin = D / v; return {
  prompt: `The design studio’s delivery cart has a speed cap of ${n(v)} metres per second. Its log shows that it covered the ${n(D)} metres of the long corridor in ${n(T)} seconds, its distance changing smoothly the whole way. Enter its average speed in metres per second, then how many metres per second above the cap its speed must have been at some instant, then the shortest time in seconds the trip could take if the cart never went faster than the cap.`,
  answer: [avg, over, tmin],
  hints: ['By the Mean Value Theorem, at some instant of the trip the speed equals the average speed, the distance divided by the time.', 'A cart that never goes faster than the cap cannot average more than the cap, so the trip takes at least the distance divided by the cap.'],
  solution: `The average speed is ${n(D)} ÷ ${n(T)} = ${n(avg)} metres per second. The distance changes smoothly, so the Mean Value Theorem says that at some instant the speed was exactly ${n(avg)} m/s, which is ${n(avg)} − ${n(v)} = ${n(over)} m/s above the cap: the cap was broken. If the speed never passed ${n(v)} m/s, the theorem says the average could not pass it either, so the trip would take at least ${n(D)} ÷ ${n(v)} = ${n(tmin)} seconds.`,
  guidance: [
   { prompt: `The cart covered ${n(D)} metres in ${n(T)} seconds. What was its average speed?`, answer: [avg], explanation: `${n(D)} ÷ ${n(T)} = ${n(avg)} metres per second.` },
   { prompt: `The Mean Value Theorem says that at some instant the cart’s speed equalled its average speed. How many metres per second above the ${n(v)} m/s cap was it at that instant?`, answer: [over], explanation: `At that instant the speed was ${n(avg)} m/s, which is ${n(avg)} − ${n(v)} = ${n(over)} m/s above the cap.` },
   { prompt: `If the speed never passed ${n(v)} m/s, the average speed could not pass it either. What is the shortest time the ${n(D)} metres could then take?`, answer: [tmin], explanation: `An average of at most ${n(v)} m/s over ${n(D)} metres needs at least ${n(D)} ÷ ${n(v)} = ${n(tmin)} seconds, longer than the ${n(T)} seconds in the log.` }
  ] }; }
});

practice({
 id: 'q32d', parent: 'q32', kind: 'challenge',
 title: 'The magnetic sled on the bench rail',
 brief: 'A magnetic sled speeds up all along the studio’s bench rail, and the designers want the moment it matches its average speed, which is not halfway.',
 labels: ['average speed (cm/s)', 'time c (s, 2 decimal places)'], tolerance: 0.005
}, [['d at the start (cm)', 'd at the end (cm)'], ['average speed (cm/s)'], ['time c (s, 2 decimal places)']], {
 canonical: { a: 2, b: 5, t1: 1, t2: 3 },
 /* d(t) = at³ + bt; c = √((t1² + t1·t2 + t2²) ÷ 3) is never exact to 2 decimals and never close to a rounding boundary. */
 draw: R => { let p, c; do { const t1 = R.int(0, 3); p = { a: R.int(2, 4), b: R.int(2, 9), t1, t2: t1 + R.int(2, 4) }; c = Math.sqrt((p.t1 * p.t1 + p.t1 * p.t2 + p.t2 * p.t2) / 3); } while (Math.abs(c * 100 - Math.round(c * 100)) < 1e-6 || edgy(c, 2)); return p; },
 build: ({ a, b, t1, t2 }) => { const d1 = a * t1 ** 3 + b * t1, d2 = a * t2 ** 3 + b * t2, dd = d2 - d1, dt = t2 - t1, avg = dd / dt, k = 3 * a, rest = avg - b, c = Math.sqrt(rest / k), cr = rd(c, 2), mid = (t1 + t2) / 2; return {
  prompt: `The bench rail log gives the distance of a magnetic sled as d(t) = ${n(a)}t³ + ${n(b)}t centimetres, t seconds after launch. The sled speeds up the whole time, so the moment it matches its average speed is not halfway through. For the stretch from t = ${n(t1)} to t = ${n(t2)}, enter the average speed in centimetres per second, then the time c at which the speed equals it, in seconds, rounded to 2 decimal places.`,
  answer: [avg, cr],
  hints: ['Find d at both ends of the stretch and divide the change by the length of the interval.', `The speed is d′(t) = ${n(k)}t² + ${n(b)}. Set it equal to the average speed, solve for t², then take the positive square root.`],
  solution: `d(${n(t1)}) = ${n(a)} × ${n(t1 ** 3)} + ${n(b)} × ${n(t1)} = ${n(d1)} and d(${n(t2)}) = ${n(a)} × ${n(t2 ** 3)} + ${n(b)} × ${n(t2)} = ${n(d2)}, so the average speed is (${n(d2)} − ${n(d1)}) ÷ ${n(dt)} = ${n(dd)} ÷ ${n(dt)} = ${n(avg)} centimetres per second. The speed is d′(t) = ${n(k)}t² + ${n(b)}. Setting ${n(k)}c² + ${n(b)} = ${n(avg)} gives ${n(k)}c² = ${n(rest)}, so c² = ${n(rest)} ÷ ${n(k)} and c = √(${n(rest)} ÷ ${n(k)}) ≈ ${n(rd(c, 4))}, which rounds to ${n(cr)} seconds. It lies inside the interval but later than its midpoint, ${n(mid)}, because the sled keeps speeding up.`,
  guidance: [
   { prompt: `Put the two times into d(t) = ${n(a)}t³ + ${n(b)}t. What are d(${n(t1)}) and d(${n(t2)})?`, answer: [d1, d2], explanation: `d(${n(t1)}) = ${n(a)} × ${n(t1 ** 3)} + ${n(b)} × ${n(t1)} = ${n(d1)} and d(${n(t2)}) = ${n(a)} × ${n(t2 ** 3)} + ${n(b)} × ${n(t2)} = ${n(d2)}.` },
   { prompt: `The sled goes from ${n(d1)} cm to ${n(d2)} cm between t = ${n(t1)} and t = ${n(t2)}. What is its average speed?`, answer: [avg], explanation: `(${n(d2)} − ${n(d1)}) ÷ (${n(t2)} − ${n(t1)}) = ${n(dd)} ÷ ${n(dt)} = ${n(avg)} centimetres per second.` },
   { prompt: `The speed is d′(t) = ${n(k)}t² + ${n(b)}. At what time c inside the interval is it equal to ${n(avg)}? Round to 2 decimal places.`, answer: [cr], explanation: `${n(k)}c² + ${n(b)} = ${n(avg)} gives c² = ${n(rest)} ÷ ${n(k)}, so c ≈ ${n(rd(c, 4))}, which rounds to ${n(cr)} seconds.` }
  ] }; }
});

/* ---- q33 L’Hôpital’s rule ---- */
practice({
 id: 'q33b', parent: 'q33', kind: 'setting',
 title: 'Zeroing the strain gauge',
 brief: 'The studio’s new strain gauge computes a ratio that its formula leaves blank at zero load.',
 labels: ['top’s derivative at 0', 'bottom’s derivative at 0', 'reading at zero load'], tolerance: 0.005
}, [['top at 0', 'bottom at 0'], ['top’s derivative at 0', 'bottom’s derivative at 0'], ['reading at zero load']], {
 canonical: { a: 7, b: 4 },
 /* The reading a ÷ b ends in at most two decimals (b is 2, 4 or 5); a and b are at least 2. */
 draw: R => { const b = R.pick([2, 4, 5]); return { a: R.except(2, 9, [b]), b }; },
 build: ({ a, b }) => { const lim = a / b; return {
  prompt: `The studio’s strain gauge reports the ratio sin(${n(a)}x) ÷ ln(1 + ${n(b)}x) at load x, with the sine taken in radians. At zero load the formula gives 0 ÷ 0, so the gauge shows the limit as x approaches 0 instead. Use L’Hôpital’s rule: enter the derivative of the top at x = 0, then the derivative of the bottom at x = 0, then the reading at zero load.`,
  answer: [a, b, lim],
  hints: ['Differentiate the top and the bottom on their own, each with the chain rule. The derivative of ln(u) is 1 ÷ u times the derivative of u.', 'At x = 0, cos 0 = 1 and 1 + 0 = 1. The reading is the top’s derivative divided by the bottom’s derivative.'],
  solution: `At x = 0 the top is sin 0 = 0 and the bottom is ln 1 = 0, so the limit has the form 0 ÷ 0 and L’Hôpital’s rule applies. The derivative of the top is ${n(a)}cos(${n(a)}x), which is ${n(a)} × 1 = ${n(a)} at x = 0. The derivative of the bottom is ${n(b)} ÷ (1 + ${n(b)}x), which is ${n(b)} ÷ 1 = ${n(b)} at x = 0. The reading is ${n(a)} ÷ ${n(b)} = ${n(lim)}.`,
  guidance: [
   { prompt: `Put x = 0 into the top, sin(${n(a)}x), and into the bottom, ln(1 + ${n(b)}x). What are the two values?`, answer: [0, 0], explanation: 'sin 0 = 0 and ln 1 = 0. The form 0 ÷ 0 says nothing about the limit on its own, so L’Hôpital’s rule applies.' },
   { prompt: 'Differentiate the top and the bottom separately, using the chain rule, then put in x = 0. What are the two values?', answer: [a, b], explanation: `The top’s derivative is ${n(a)}cos(${n(a)}x), which is ${n(a)} at x = 0. The bottom’s derivative is ${n(b)} ÷ (1 + ${n(b)}x), which is ${n(b)} at x = 0.` },
   { prompt: `What is the reading at zero load, ${n(a)} ÷ ${n(b)}?`, answer: [lim], explanation: `${n(a)} ÷ ${n(b)} = ${n(lim)}. Close to 0 the top behaves like ${n(a)}x and the bottom like ${n(b)}x.` }
  ] }; }
});

practice({
 id: 'q33c', parent: 'q33', kind: 'applied',
 title: 'Starting torque of the spindle',
 brief: 'The spindle’s torque formula breaks down at the very start, and the studio must know whether the starting torque is within the shaft’s rating.',
 labels: ['limit of the fraction', 'starting torque (N·m)', 'margin below the rating (N·m)'], tolerance: 0.005
}, [['top’s derivative at 0', 'bottom’s derivative at 0'], ['limit of the fraction', 'starting torque (N·m)'], ['margin below the rating (N·m)']], {
 canonical: { a: 9, b: 4, M: 40, F: 120 },
 /* M is a multiple of 20 and b is 2, 4 or 5, so the starting torque M × a ÷ b is a whole number; the rating is 10 to
    60 above it. */
 draw: R => { const b = R.pick([2, 4, 5]), a = R.except(2, 9, [b]), M = 20 * R.int(1, 5); return { a, b, M, F: M * a / b + 5 * R.int(2, 12) }; },
 build: ({ a, b, M, F }) => { const lim = a / b, T0 = M * lim, margin = F - T0; return {
  prompt: `The torque sensor on the studio’s new spindle gives T(x) = ${n(M)} × sin(${n(a)}x) ÷ (e^(${n(b)}x) − 1) newton-metres, where x is the angle the spindle has turned since starting, in radians. At the start, x = 0, the formula gives 0 ÷ 0, so the starting torque is the limit as x approaches 0. The shaft is rated for ${n(F)} newton-metres. Enter the limit of sin(${n(a)}x) ÷ (e^(${n(b)}x) − 1) as x approaches 0, then the starting torque, then how many newton-metres it stays below the rating.`,
  answer: [lim, T0, margin],
  hints: ['Both the top and the bottom are 0 at x = 0. Differentiate each on its own with the chain rule, then put in x = 0.', `The starting torque is ${n(M)} times the limit of the fraction.`],
  solution: `At x = 0 the top is sin 0 = 0 and the bottom is e⁰ − 1 = 0, so L’Hôpital’s rule applies. The derivative of the top is ${n(a)}cos(${n(a)}x), which is ${n(a)} at x = 0, and the derivative of the bottom is ${n(b)}e^(${n(b)}x), which is ${n(b)} at x = 0. So the fraction tends to ${n(a)} ÷ ${n(b)} = ${n(lim)}, and the starting torque is ${n(M)} × ${n(lim)} = ${n(T0)} newton-metres. That is ${n(F)} − ${n(T0)} = ${n(margin)} newton-metres below the rating, so the shaft is safe at the start.`,
  guidance: [
   { prompt: `Differentiate the top, sin(${n(a)}x), and the bottom, e^(${n(b)}x) − 1, separately, then put in x = 0. What are the two values?`, answer: [a, b], explanation: `The top’s derivative is ${n(a)}cos(${n(a)}x), which is ${n(a)} at x = 0. The bottom’s derivative is ${n(b)}e^(${n(b)}x), which is ${n(b)} at x = 0.` },
   { prompt: `What is the limit of the fraction, and what is the starting torque, ${n(M)} times that limit?`, answer: [lim, T0], explanation: `By L’Hôpital’s rule the fraction tends to ${n(a)} ÷ ${n(b)} = ${n(lim)}, so the starting torque is ${n(M)} × ${n(lim)} = ${n(T0)} newton-metres.` },
   { prompt: `The shaft is rated for ${n(F)} newton-metres. How many newton-metres below the rating is the starting torque?`, answer: [margin], explanation: `${n(F)} − ${n(T0)} = ${n(margin)} newton-metres to spare, so the start is safe.` }
  ] }; }
});

practice({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q16',
 title: 'The sag at the reflector’s centre',
 brief: 'The curved reflector’s sag formula gives 0 ÷ 0 at its centre twice over, and the studio still needs the value there.',
 labels: ['top’s second derivative at 0', 'bottom’s second derivative at 0', 'limit'], tolerance: 0.005
}, [['top’s first derivative at 0', 'bottom’s first derivative at 0'], ['top’s second derivative at 0', 'bottom’s second derivative at 0'], ['limit']], {
 canonical: { a: 6, b: 4 },
 /* The limit a² ÷ (2b) ends in at most two decimals; a and b are at least 2. */
 draw: R => { let p; do { p = { a: R.int(2, 9), b: R.int(2, 6) }; } while (Math.abs(p.a * p.a / (2 * p.b) * 100 - Math.round(p.a * p.a / (2 * p.b) * 100)) > 1e-9); return p; },
 build: ({ a, b }) => { const a2 = a * a, b2 = 2 * b, lim = a2 / b2; return {
  prompt: `The sag of the studio’s curved reflector is described by the ratio (1 − cos(${n(a)}x)) ÷ (${n(b)}x²), with x in radians, and the designers need its value at the centre: the limit as x approaches 0. One use of L’Hôpital’s rule still gives 0 ÷ 0, so use it a second time. Enter the second derivative of the top at x = 0, then the second derivative of the bottom at x = 0, then the limit.`,
  answer: [a2, b2, lim],
  hints: ['Differentiate the top and the bottom separately. Both derivatives are 0 again at x = 0, so differentiate each once more: that is its second derivative.', 'The derivative of cos(kx) is −k sin(kx), the derivative of sin(kx) is k cos(kx), and cos 0 = 1.'],
  solution: `At x = 0 the top is 1 − cos 0 = 0 and the bottom is 0: the form 0 ÷ 0. The first derivatives are ${n(a)}sin(${n(a)}x) and ${n(b2)}x, which are both 0 at x = 0, so the form is still 0 ÷ 0 and the rule is used again. The second derivatives are ${n(a2)}cos(${n(a)}x) and ${n(b2)}, which are ${n(a2)} and ${n(b2)} at x = 0. So the limit is ${n(a2)} ÷ ${n(b2)} = ${n(lim)}.`,
  guidance: [
   { prompt: `Differentiate the top, 1 − cos(${n(a)}x), and the bottom, ${n(b)}x², once, and put in x = 0. What are the two values?`, answer: [0, 0], explanation: `The first derivatives are ${n(a)}sin(${n(a)}x) and ${n(b2)}x. At x = 0 both are 0, so the form is still 0 ÷ 0.` },
   { prompt: 'Differentiate both once more and put in x = 0. What are the two second derivatives there?', answer: [a2, b2], explanation: `The derivative of ${n(a)}sin(${n(a)}x) is ${n(a2)}cos(${n(a)}x), which is ${n(a2)} at x = 0. The derivative of ${n(b2)}x is ${n(b2)}.` },
   { prompt: `By L’Hôpital’s rule used twice, the limit is ${n(a2)} ÷ ${n(b2)}. What is it?`, answer: [lim], explanation: `${n(a2)} ÷ ${n(b2)} = ${n(lim)}.` }
  ] }; }
});

/* ---- q34 Newton’s method ---- */
/* Cube edge, f(x) = x³ − N with N = x0³ + d: d ÷ (3x0²) has at most three decimals, so x₁ is exact; x₂ is kept away
   from a rounding boundary at three decimals. */
const CUBE = [[2, 3], [2, 6], [2, -3], [2, -6], [4, 6], [4, -6], [4, 12], [4, -12], [5, 3], [5, -3], [5, 6], [5, -6], [10, 15], [10, -15], [10, 30], [10, -30]]
 .map(([x0, d]) => ({ x0, N: x0 ** 3 + d }))
 .filter(({ x0, N }) => { const x1 = x0 - (x0 ** 3 - N) / (3 * x0 * x0); return !edgy(x1 - (x1 ** 3 - N) / (3 * x1 * x1), 3); });
practice({
 id: 'q34b', parent: 'q34', kind: 'setting',
 title: 'Casting the ballast cube',
 brief: 'The drone rig needs a cube of ballast with an exact volume, and the mould maker wants its edge to three decimal places.',
 labels: ['x₁', 'x₂ (3 decimal places)'], tolerance: 0.0005
}, [['f(x₀)', 'f′(x₀)'], ['x₁'], ['x₂ (3 decimal places)']], {
 canonical: { x0: 5, N: 131 },
 draw: R => R.pick(CUBE),
 build: ({ x0, N }) => { const f0 = x0 ** 3 - N, d0 = 3 * x0 * x0, x1 = rd(x0 - f0 / d0, 6), c1 = x1 ** 3, f1 = c1 - N, d1 = 3 * x1 * x1, x2 = x1 - f1 / d1, x2r = rd(x2, 3); return {
  prompt: `A ballast cube for the studio’s drone rig must have a volume of exactly ${n(N)} cubic decimetres, so its edge in decimetres is the root of f(x) = x³ − ${n(N)}. Start Newton’s method from the guess x₀ = ${n(x0)}. Enter the next guess x₁, then the guess after that, x₂, rounded to 3 decimal places.`,
  answer: [x1, x2r],
  hints: ['Newton’s method: x₁ = x₀ − f(x₀) ÷ f′(x₀), and the power rule gives f′(x) = 3x².', 'Repeat the same step from x₁, keeping all its digits, then round x₂ to 3 decimal places.'],
  solution: `f′(x) = 3x². From x₀ = ${n(x0)}: f(${n(x0)}) = ${n(x0 ** 3)} − ${n(N)} = ${n(f0)} and f′(${n(x0)}) = 3 × ${n(x0 * x0)} = ${n(d0)}, so x₁ = ${n(x0)} − ${par(f0)} ÷ ${n(d0)} = ${n(x1)}. From x₁: f(${n(x1)}) ${eq(c1)} ${n(c1)} − ${n(N)} ${eq(f1)} ${n(f1)} and f′(${n(x1)}) ${eq(d1)} ${n(d1)}, so x₂ = ${n(x1)} − ${par(rd(f1, 4))} ÷ ${n(d1)} ≈ ${n(rd(x2, 4))}, which rounds to ${n(x2r)}. Check: ${n(x2r)} cubed is very close to ${n(N)}.`,
  guidance: [
   { prompt: `For f(x) = x³ − ${n(N)} the derivative is f′(x) = 3x². What are f(${n(x0)}) and f′(${n(x0)})?`, answer: [f0, d0], explanation: `f(${n(x0)}) = ${n(x0 ** 3)} − ${n(N)} = ${n(f0)} and f′(${n(x0)}) = 3 × ${n(x0 * x0)} = ${n(d0)}.` },
   { prompt: 'Follow the tangent line at x₀ to where it crosses zero: x₁ = x₀ − f(x₀) ÷ f′(x₀). What is x₁?', answer: [x1], explanation: `x₁ = ${n(x0)} − ${par(f0)} ÷ ${n(d0)} = ${n(x1)}.` },
   { prompt: `Take one more step from x₁ = ${n(x1)}. What is x₂, rounded to 3 decimal places?`, answer: [x2r], explanation: `f(${n(x1)}) ${eq(f1)} ${n(f1)} and f′(${n(x1)}) ${eq(d1)} ${n(d1)}, so x₂ = ${n(x1)} − ${par(rd(f1, 4))} ÷ ${n(d1)} ≈ ${n(rd(x2, 4))}, which rounds to ${n(x2r)}.` }
  ] }; }
});

/* Sample case, f(x) = x³ + x² − V with V = x0³ + x0² + d: d ÷ f′(x0) has at most three decimals, so x₁ is exact;
   x₂ is kept away from a rounding boundary at two decimals. */
const CASE = [[2, 2], [2, -2], [2, 4], [2, -4], [2, 8], [4, 7], [4, -7], [4, 14], [4, -14], [5, 17], [5, -17], [6, 6], [6, -6], [6, 15], [6, -15], [6, 30], [10, 16], [10, -16], [10, 40], [10, -40]]
 .map(([x0, d]) => ({ x0, V: x0 ** 3 + x0 * x0 + d }))
 .filter(({ x0, V }) => { const x1 = x0 - (x0 ** 3 + x0 * x0 - V) / (3 * x0 * x0 + 2 * x0); return !edgy(x1 - (x1 ** 3 + x1 * x1 - V) / (3 * x1 * x1 + 2 * x1), 2); });
practice({
 id: 'q34c', parent: 'q34', kind: 'applied',
 title: 'Cutting the sample case',
 brief: 'A sample case whose height is tied to its base must hold an exact volume, and the cutter needs its side to the nearest hundredth.',
 labels: ['x₁ (dm)', 'side x₂ (dm, 2 decimal places)'], tolerance: 0.0005
}, [['f(x₀)', 'f′(x₀)'], ['x₁ (dm)'], ['side x₂ (dm, 2 decimal places)']], {
 canonical: { x0: 4, V: 94 },
 draw: R => R.pick(CASE),
 build: ({ x0, V }) => { const f0 = x0 ** 3 + x0 * x0 - V, d0 = 3 * x0 * x0 + 2 * x0, x1 = rd(x0 - f0 / d0, 6), f1 = x1 ** 3 + x1 * x1 - V, d1 = 3 * x1 * x1 + 2 * x1, x2 = x1 - f1 / d1, x2r = rd(x2, 2); return {
  prompt: `The studio is designing a sample case with a square base of side x decimetres and a height 1 decimetre more than that side, so it holds x²(x + 1) litres. It must hold exactly ${n(V)} litres, and no algebra trick solves x²(x + 1) = ${n(V)}. Use Newton’s method from the guess x₀ = ${n(x0)}. Enter the next guess x₁, then x₂ rounded to 2 decimal places, the side in decimetres that the cutter will use.`,
  answer: [x1, x2r],
  hints: [`Move everything to one side and multiply out: f(x) = x³ + x² − ${n(V)}, so f′(x) = 3x² + 2x.`, 'Each step is new guess = old guess − f(old guess) ÷ f′(old guess). Round only at the end.'],
  solution: `Write the equation as f(x) = x²(x + 1) − ${n(V)} = x³ + x² − ${n(V)}, so f′(x) = 3x² + 2x. From x₀ = ${n(x0)}: f(${n(x0)}) = ${n(x0 ** 3)} + ${n(x0 * x0)} − ${n(V)} = ${n(f0)} and f′(${n(x0)}) = ${n(3 * x0 * x0)} + ${n(2 * x0)} = ${n(d0)}, so x₁ = ${n(x0)} − ${par(f0)} ÷ ${n(d0)} = ${n(x1)}. From x₁: f(${n(x1)}) ${eq(f1)} ${n(f1)} and f′(${n(x1)}) ${eq(d1)} ${n(d1)}, so x₂ = ${n(x1)} − ${par(rd(f1, 4))} ÷ ${n(d1)} ≈ ${n(rd(x2, 4))}, which rounds to ${n(x2r)} decimetres. The case is cut with a side of ${n(x2r)} dm and a height of ${n(rd(x2r + 1, 2))} dm.`,
  guidance: [
   { prompt: `Write the equation as f(x) = x³ + x² − ${n(V)} = 0, so f′(x) = 3x² + 2x. What are f(${n(x0)}) and f′(${n(x0)})?`, answer: [f0, d0], explanation: `f(${n(x0)}) = ${n(x0 ** 3)} + ${n(x0 * x0)} − ${n(V)} = ${n(f0)} and f′(${n(x0)}) = ${n(3 * x0 * x0)} + ${n(2 * x0)} = ${n(d0)}.` },
   { prompt: 'Take one Newton step: x₁ = x₀ − f(x₀) ÷ f′(x₀). What is x₁?', answer: [x1], explanation: `x₁ = ${n(x0)} − ${par(f0)} ÷ ${n(d0)} = ${n(x1)} decimetres.` },
   { prompt: `Take one more step from x₁ = ${n(x1)}. What is x₂, rounded to 2 decimal places?`, answer: [x2r], explanation: `f(${n(x1)}) ${eq(f1)} ${n(f1)} and f′(${n(x1)}) ${eq(d1)} ${n(d1)}, so x₂ ≈ ${n(rd(x2, 4))}, which rounds to ${n(x2r)}.` }
  ] }; }
});

/* Shade angle, f(x) = x − a·cos(x): x₁ and x₂ to three decimals stay the same whether a player keeps every digit or
   works from f(x₀), f′(x₀) and x₁ rounded to three decimals; f(x₁) is large enough to print. */
const SHADE = [];
for (const a of [2, 3, 4, 5, 6, 7, 8]) for (const x0 of [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6]) {
 const f = x => x - a * Math.cos(x), fp = x => 1 + a * Math.sin(x);
 const x1 = x0 - f(x0) / fp(x0), x2 = x1 - f(x1) / fp(x1);
 const x1b = x0 - rd(f(x0), 3) / rd(fp(x0), 3), x2b = rd(x1, 3) - f(rd(x1, 3)) / fp(rd(x1, 3));
 if (edgy(x1, 3) || edgy(x2, 3) || edgy(f(x0), 3) || edgy(fp(x0), 3) || rd(x1b, 3) !== rd(x1, 3) || rd(x2b, 3) !== rd(x2, 3) || Math.abs(f(x1)) < 0.00015) continue;
 SHADE.push({ a, x0 });
}
practice({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q21',
 title: 'Tilting the solar shade',
 brief: 'The solar shade’s tilt angle is fixed by an equation mixing an angle with its cosine, which no algebra can solve.',
 labels: ['x₁ (3 decimal places)', 'x₂ (3 decimal places)'], tolerance: 0.0005
}, [['f(x₀) (3 decimal places)', 'f′(x₀) (3 decimal places)'], ['x₁ (3 decimal places)'], ['x₂ (3 decimal places)']], {
 canonical: { a: 4, x0: 1.4 },
 draw: R => R.pick(SHADE),
 build: ({ a, x0 }) => { const f = x => x - a * Math.cos(x), fp = x => 1 + a * Math.sin(x), f0 = f(x0), d0 = fp(x0), x1 = x0 - f0 / d0, f1 = f(x1), d1 = fp(x1), x2 = x1 - f1 / d1; return {
  prompt: `The tilt angle x of the studio’s solar shade, in radians, must satisfy x = ${n(a)}cos(x), so it is the root of f(x) = x − ${n(a)}cos(x). Start Newton’s method from the guess x₀ = ${n(x0)}. Enter the next guess x₁, then the guess after that, x₂, both rounded to 3 decimal places.`,
  answer: [rd(x1, 3), rd(x2, 3)],
  hints: [`The derivative of cos(x) is −sin(x), so f′(x) = 1 + ${n(a)}sin(x). Set your calculator to radians.`, 'Keep every digit of x₁ when you take the second step, and round only what you enter.'],
  solution: `f′(x) = 1 + ${n(a)}sin(x). From x₀ = ${n(x0)}: f(${n(x0)}) = ${n(x0)} − ${n(a)}cos(${n(x0)}) ≈ ${n(rd(f0, 4))} and f′(${n(x0)}) = 1 + ${n(a)}sin(${n(x0)}) ≈ ${n(rd(d0, 4))}, so x₁ = ${n(x0)} − ${par(rd(f0, 4))} ÷ ${n(rd(d0, 4))} ≈ ${n(rd(x1, 4))}, which rounds to ${n(rd(x1, 3))}. From x₁: f(x₁) ≈ ${n(rd(f1, 4))} and f′(x₁) ≈ ${n(rd(d1, 4))}, so x₂ ≈ ${n(rd(x2, 4))}, which rounds to ${n(rd(x2, 3))}. The guesses are settling, so the angle is about ${n(rd(x2, 3))} radians.`,
  guidance: [
   { prompt: `With f(x) = x − ${n(a)}cos(x) and f′(x) = 1 + ${n(a)}sin(x), what are f(${n(x0)}) and f′(${n(x0)}), rounded to 3 decimal places?`, answer: [rd(f0, 3), rd(d0, 3)], explanation: `f(${n(x0)}) = ${n(x0)} − ${n(a)}cos(${n(x0)}) ≈ ${n(rd(f0, 4))} and f′(${n(x0)}) = 1 + ${n(a)}sin(${n(x0)}) ≈ ${n(rd(d0, 4))}, with the calculator in radians.` },
   { prompt: 'What is x₁ = x₀ − f(x₀) ÷ f′(x₀), rounded to 3 decimal places?', answer: [rd(x1, 3)], explanation: `x₁ = ${n(x0)} − ${par(rd(f0, 4))} ÷ ${n(rd(d0, 4))} ≈ ${n(rd(x1, 4))}, which rounds to ${n(rd(x1, 3))}.` },
   { prompt: 'Take one more step from x₁. What is x₂, rounded to 3 decimal places?', answer: [rd(x2, 3)], explanation: `f(x₁) ≈ ${n(rd(f1, 4))} and f′(x₁) ≈ ${n(rd(d1, 4))}, so x₂ ≈ ${n(rd(x2, 4))}, which rounds to ${n(rd(x2, 3))}.` }
  ] }; }
});

/* ---- q35 Antiderivatives ---- */
practice({
 id: 'q35b', parent: 'q35', kind: 'setting',
 title: 'Silt in the settling trap',
 brief: 'Silt piles up in the reservoir’s settling trap at a known rate, and the crew wants a formula for the mass inside.',
 labels: ['p (coefficient of t⁴)', 'q (coefficient of t³)', 'k (coefficient of t)'], tolerance: 0.01
}, [['p'], ['q'], ['k']], {
 canonical: { a: 3, b: 2, c: 7 },
 /* s(t) = 4at³ + 3bt² + c with a, b, c at least 2, so no coefficient is a written-out 1. */
 draw: R => ({ a: R.int(2, 5), b: R.int(2, 6), c: R.int(2, 9) }),
 build: ({ a, b, c }) => { const A = 4 * a, B = 3 * b, s = `${n(A)}t³ + ${n(B)}t² + ${n(c)}`; return {
  prompt: `Silt settles into the reservoir’s settling trap at s(t) = ${s} kilograms per day, t days into the flood season. The mass of silt in the trap, M(t), is an antiderivative of s(t), and every antiderivative of s(t) has the form M(t) = pt⁴ + qt³ + kt + C. Enter p, q and k.`,
  answer: [a, b, c],
  hints: ['A t³ term comes from a t⁴ term. The derivative of t⁴ is 4t³, so divide that coefficient by 4.', 'Check by differentiating pt⁴ + qt³ + kt: you must get back s(t).'],
  solution: `Raise each power by one and divide by the new power. ${n(A)}t³ becomes (${n(A)} ÷ 4)t⁴ = ${n(a)}t⁴, ${n(B)}t² becomes (${n(B)} ÷ 3)t³ = ${n(b)}t³, and the constant ${n(c)} becomes ${n(c)}t. So M(t) = ${n(a)}t⁴ + ${n(b)}t³ + ${n(c)}t + C: p = ${n(a)}, q = ${n(b)} and k = ${n(c)}. Check: the derivative of ${n(a)}t⁴ + ${n(b)}t³ + ${n(c)}t + C is ${s}.`,
  guidance: [
   { prompt: `An antiderivative of ${n(A)}t³ is pt⁴. The derivative of pt⁴ is 4pt³. What must p be?`, answer: [a], explanation: `4p = ${n(A)}, so p = ${n(A)} ÷ 4 = ${n(a)}: the derivative of ${n(a)}t⁴ is ${n(A)}t³.` },
   { prompt: `An antiderivative of ${n(B)}t² is qt³. The derivative of qt³ is 3qt². What must q be?`, answer: [b], explanation: `3q = ${n(B)}, so q = ${n(B)} ÷ 3 = ${n(b)}: the derivative of ${n(b)}t³ is ${n(B)}t².` },
   { prompt: `An antiderivative of the constant ${n(c)} is kt. What must k be?`, answer: [c], explanation: `k = ${n(c)}: the derivative of ${n(c)}t is ${n(c)}. The constant C can be anything, because its derivative is 0.` }
  ] }; }
});

practice({
 id: 'q35c', parent: 'q35', kind: 'applied',
 title: 'Room left in the overflow basin',
 brief: 'Storm runoff is pouring into the overflow basin, and the crew must know whether the basin still has room after the first minutes.',
 labels: ['runoff in (L)', 'room left (L)'], tolerance: 0.01
}, [['p', 'q', 's'], ['runoff in (L)'], ['room left (L)']], {
 canonical: { a: 2, b: 4, c: 3, T: 5, cap: 600 },
 /* r(t) = 3at² + 2bt + c with a, b, c at least 2; the room is a whole number of hundreds of litres, 1 to 600 litres more
    than the runoff, so the room left is positive. Not the worked example's 12x² + 10x + 3. */
 draw: R => { let a, b, c; do { a = R.int(2, 4); b = R.int(2, 6); c = R.int(2, 9); } while (a === 4 && b === 5 && c === 3);
  const T = R.int(3, 8), gain = a * T ** 3 + b * T * T + c * T; return { a, b, c, T, cap: (Math.floor(gain / 100) + R.int(1, 6)) * 100 }; },
 build: ({ a, b, c, T, cap }) => { const A = 3 * a, B = 2 * b, gain = a * T ** 3 + b * T * T + c * T, left = cap - gain; return {
  prompt: `During a storm, runoff flows into the reservoir’s overflow basin at r(t) = ${n(A)}t² + ${n(B)}t + ${n(c)} litres per minute, t minutes after it starts. The volume in the basin is V(t) = pt³ + qt² + st + C, an antiderivative of r(t). Putting t = 0 into it leaves only C, so C is what the basin held when the runoff started. At that moment it had room for ${n(cap)} more litres. Enter the litres that flow in during the first ${n(T)} minutes, V(${n(T)}) − C, then the room left after ${n(T)} minutes (type numbers without commas).`,
  answer: [gain, left],
  hints: ['First find p, q and s by running the power rule backwards: raise each power by one and divide by the new power.', `Subtracting C leaves only the terms with t: V(${n(T)}) − C = p × ${n(T ** 3)} + q × ${n(T * T)} + s × ${n(T)}.`],
  solution: `Running the power rule backwards, ${n(A)}t² becomes ${n(a)}t³, ${n(B)}t becomes ${n(b)}t² and ${n(c)} becomes ${n(c)}t, so V(t) = ${n(a)}t³ + ${n(b)}t² + ${n(c)}t + C. Then V(${n(T)}) − C = ${n(a)} × ${n(T ** 3)} + ${n(b)} × ${n(T * T)} + ${n(c)} × ${n(T)} = ${n(a * T ** 3)} + ${n(b * T * T)} + ${n(c * T)} = ${n(gain)} litres flow in. The room left is ${n(cap)} − ${n(gain)} = ${n(left)} litres, so the basin does not overflow in that time.`,
  guidance: [
   { prompt: `Run the power rule backwards on r(t) = ${n(A)}t² + ${n(B)}t + ${n(c)}. What are p, q and s in V(t) = pt³ + qt² + st + C?`, answer: [a, b, c], explanation: `${n(A)} ÷ 3 = ${n(a)}, ${n(B)} ÷ 2 = ${n(b)}, and the constant ${n(c)} becomes ${n(c)}t: V(t) = ${n(a)}t³ + ${n(b)}t² + ${n(c)}t + C.` },
   { prompt: `V(${n(T)}) − C is the volume now minus the volume at the start, and the C drops out of it. How many litres flow in during the first ${n(T)} minutes?`, answer: [gain], explanation: `${n(a)} × ${n(T ** 3)} + ${n(b)} × ${n(T * T)} + ${n(c)} × ${n(T)} = ${n(a * T ** 3)} + ${n(b * T * T)} + ${n(c * T)} = ${n(gain)} litres.` },
   { prompt: `The basin had room for ${n(cap)} litres. How much room is left after ${n(T)} minutes?`, answer: [left], explanation: `${n(cap)} − ${n(gain)} = ${n(left)} litres, so it has not overflowed yet.` }
  ] }; }
});

practice({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q21',
 title: 'The tidal sluice inflow',
 brief: 'Water through the tidal sluice rises and falls with a sine wave, and the crew wants the volume formula behind it.',
 labels: ['p (coefficient of cos t)', 'q (coefficient of t³)', 'k (coefficient of t)'], tolerance: 0.01
}, [['p'], ['q'], ['k']], {
 canonical: { A: 4, q: 2, s: 7 },
 /* The constant s is larger than A, so the inflow A·sin(t) + 3qt² + s is always positive. */
 draw: R => { const A = R.int(2, 9); return { A, q: R.int(2, 5), s: A + R.int(1, 8) }; },
 build: ({ A, q, s }) => { const B = 3 * q, r = `${n(A)}sin(t) + ${n(B)}t² + ${n(s)}`; return {
  prompt: `Water from a tidal sluice enters the reservoir’s intake channel at r(t) = ${r} cubic metres per hour, t hours after the sluice opens, with the sine taken in radians. The volume that has come through, V(t), is an antiderivative of r(t), and every antiderivative of r(t) has the form V(t) = p cos(t) + qt³ + kt + C. Enter p, q and k.`,
  answer: [-A, q, s],
  hints: ['Which function has derivative sin(t)? The derivative of cos(t) is −sin(t), so watch the sign of p.', 'Take each term on its own, then check by differentiating p cos(t) + qt³ + kt: you must get r(t) back.'],
  solution: `The derivative of cos(t) is −sin(t), so the derivative of ${n(-A)}cos(t) is ${n(A)}sin(t): p = ${n(-A)}. ${n(B)}t² becomes (${n(B)} ÷ 3)t³ = ${n(q)}t³, so q = ${n(q)}, and the constant ${n(s)} becomes ${n(s)}t, so k = ${n(s)}. So V(t) = ${n(-A)}cos(t) + ${n(q)}t³ + ${n(s)}t + C. Check: its derivative is ${r}.`,
  guidance: [
   { prompt: `The derivative of p cos(t) is −p sin(t). It must equal ${n(A)}sin(t). What is p?`, answer: [-A], explanation: `−p = ${n(A)}, so p = ${n(-A)}: the derivative of ${n(-A)}cos(t) is ${n(A)}sin(t).` },
   { prompt: `An antiderivative of ${n(B)}t² is qt³. What must q be?`, answer: [q], explanation: `3q = ${n(B)}, so q = ${n(B)} ÷ 3 = ${n(q)}.` },
   { prompt: `An antiderivative of the constant ${n(s)} is kt. What must k be?`, answer: [s], explanation: `k = ${n(s)}: the derivative of ${n(s)}t is ${n(s)}.` }
  ] }; }
});
})();
