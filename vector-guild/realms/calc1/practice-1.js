/* Calculus 1 practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions". q01b is the worked sample.
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc1/oracle-p1.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* ---- q01 Average rate of change ---- */
add({
 id: 'q01b', parent: 'q01', kind: 'setting',
 title: 'Two readings from the survey rover',
 brief: 'A survey rover has reported its distance from base twice, and the tracking log needs its average rate between the two readings.',
 prompt: 'The tracking log has two readings for a survey rover, with t counted in hours since it set out: at t = 1 it was 14 km from base, and at t = 4 it was 50 km from base. Enter the change in distance in kilometres, then the average rate of change of the distance over that interval, in kilometres per hour.',
 answer: [36, 12], labels: ['change in distance (km)', 'average rate (km/h)'], tolerance: 0.01,
 hints: [
  'The change in distance is the later reading minus the earlier reading.',
  'Divide the change in distance by the time that passed between the two readings, not by the later time.'
 ],
 solution: 'The change in distance is Δd = 50 − 14 = 36 km, and the change in time is Δt = 4 − 1 = 3 hours. The average rate of change is 36 ÷ 3 = 12 km per hour.',
 guidance: [
  { prompt: 'The distance goes from 14 km to 50 km. What is the change in distance, Δd?', answer: [36], labels: ['Δd (km)'], explanation: 'Δd = 50 − 14 = 36, so the rover ended 36 km further from base.' },
  { prompt: 'The readings are at t = 1 and t = 4, so Δt = 4 − 1 = 3 hours. What is the average rate of change, 36 ÷ 3?', answer: [12], labels: ['average rate (km/h)'], explanation: '36 km in 3 hours is 36 ÷ 3 = 12 km per hour on average.' }
 ]
}, {
 canonical: { t1: 1, t2: 4, d1: 14, d2: 50 },
 /* A whole-number rate of 6 to 25 km per hour over 2 to 5 hours, so every answer is a whole number and "1 hours"
    never appears. The parameters are the four numbers the prompt states. */
 draw: R => { const t1 = R.int(1, 4), dt = R.int(2, 5), d1 = R.int(5, 30), rate = R.int(6, 25); return { t1, t2: t1 + dt, d1, d2: d1 + rate * dt }; },
 build: ({ t1, t2, d1, d2 }) => { const dd = d2 - d1, dt = t2 - t1, rate = dd / dt; return {
  prompt: `The tracking log has two readings for a survey rover, with t counted in hours since it set out: at t = ${n(t1)} it was ${n(d1)} km from base, and at t = ${n(t2)} it was ${n(d2)} km from base. Enter the change in distance in kilometres, then the average rate of change of the distance over that interval, in kilometres per hour.`,
  answer: [dd, rate],
  hints: ['The change in distance is the later reading minus the earlier reading.', 'Divide the change in distance by the time that passed between the two readings, not by the later time.'],
  solution: `The change in distance is Δd = ${n(d2)} − ${n(d1)} = ${n(dd)} km, and the change in time is Δt = ${n(t2)} − ${n(t1)} = ${n(dt)} hours. The average rate of change is ${n(dd)} ÷ ${n(dt)} = ${n(rate)} km per hour.`,
  guidance: [
   { prompt: `The distance goes from ${n(d1)} km to ${n(d2)} km. What is the change in distance, Δd?`, answer: [dd], explanation: `Δd = ${n(d2)} − ${n(d1)} = ${n(dd)}, so the rover ended ${n(dd)} km further from base.` },
   { prompt: `The readings are at t = ${n(t1)} and t = ${n(t2)}, so Δt = ${n(t2)} − ${n(t1)} = ${n(dt)} hours. What is the average rate of change, ${n(dd)} ÷ ${n(dt)}?`, answer: [rate], explanation: `${n(dd)} km in ${n(dt)} hours is ${n(dd)} ÷ ${n(dt)} = ${n(rate)} km per hour on average.` }
  ] }; }
});

/* Helpers for the missions below. sgn/trm/cst write signed terms: trm(−1, 'x') is '− x', trm(3, 'x') is '+ 3x',
   cst(−4) is '− 4'.
   practice(meta, stepLabels, generator) registers a mission through add(): its prompt, answers, hints, solution
   and guided steps are build(canonical) itself (cleaned as the engine cleans them), so the authored text and the
   generator cannot drift apart. `meta` holds id, parent, kind, title, brief, labels, tolerance (and uses);
   `stepLabels` holds the answer labels of each guided step, in order. To read a mission as the player sees it:
   node qa/show-mission.js <id> --realm calc1 */
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};

/* q01c: a balloon's height h(t) = at² + bt over [t1, t2]; its average rate a(t1 + t2) + b is a whole number, and the
   height H the winch must reach is that rate times a whole number of minutes (3 to 12), at most 990 m. */
practice({ id: 'q01c', parent: 'q01', kind: 'applied', title: 'Pacing the winch balloon',
 brief: 'The next weather balloon goes up on a steady winch, and the crew must set its rate from the last balloon’s climb and know how long it will take.',
 labels: ['average rate (m/min)', 'time to reach the height (min)'], tolerance: 0.01 },
 [['height at the start (m)', 'height at the end (m)'], ['average rate (m/min)'], ['time (min)']], {
 canonical: { a: 2, b: 15, t1: 3, t2: 7, H: 280 },
 draw: R => { let p; do { p = { a: R.int(2, 5), b: R.int(5, 20), t1: R.int(1, 5) }; p.t2 = p.t1 + R.int(2, 5); p.H = (p.a * (p.t1 + p.t2) + p.b) * R.int(3, 12); } while (p.H > 990); return p; },
 build: ({ a, b, t1, t2, H }) => { const h1 = a * t1 * t1 + b * t1, h2 = a * t2 * t2 + b * t2, dh = h2 - h1, dt = t2 - t1, rate = dh / dt, m = H / rate; return {
  prompt: `A weather balloon rises from the tracking station, and its height is h(t) = ${n(a)}t² + ${n(b)}t metres, t minutes after release. The next balloon will go up on a winch that climbs at one steady rate, set to the first balloon’s average rate of climb from t = ${n(t1)} to t = ${n(t2)}. Enter that average rate in metres per minute, then how many minutes the winch balloon takes to reach a height of ${n(H)} metres.`,
  answer: [rate, m],
  hints: ['The average rate of climb is the change in height divided by the change in time, so start with the height at each end of the interval.', 'A steady climb covers the same number of metres every minute, so divide the height to reach by the metres climbed each minute.'],
  solution: `h(${n(t1)}) = ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} = ${n(h1)} and h(${n(t2)}) = ${n(a)} × ${n(t2 * t2)} + ${n(b)} × ${n(t2)} = ${n(h2)}. Over Δt = ${n(t2)} − ${n(t1)} = ${n(dt)} minutes the balloon climbed Δh = ${n(h2)} − ${n(h1)} = ${n(dh)} metres, so its average rate of climb was ${n(dh)} ÷ ${n(dt)} = ${n(rate)} metres per minute. At that steady rate the winch balloon needs ${n(H)} ÷ ${n(rate)} = ${n(m)} minutes to reach ${n(H)} metres.`,
  guidance: [
   { prompt: `Put both ends of the interval into h(t) = ${n(a)}t² + ${n(b)}t. What are h(${n(t1)}) and h(${n(t2)})?`, answer: [h1, h2], explanation: `h(${n(t1)}) = ${n(a)} × ${n(t1 * t1)} + ${n(b)} × ${n(t1)} = ${n(h1)} and h(${n(t2)}) = ${n(a)} × ${n(t2 * t2)} + ${n(b)} × ${n(t2)} = ${n(h2)}.` },
   { prompt: `The balloon climbed from ${n(h1)} m to ${n(h2)} m between t = ${n(t1)} and t = ${n(t2)}. What is its average rate of climb, Δh ÷ Δt?`, answer: [rate], explanation: `Δh = ${n(h2)} − ${n(h1)} = ${n(dh)} metres and Δt = ${n(t2)} − ${n(t1)} = ${n(dt)} minutes, so the average rate is ${n(dh)} ÷ ${n(dt)} = ${n(rate)} metres per minute.` },
   { prompt: `The winch climbs a steady ${n(rate)} metres every minute. How many minutes does it take to reach ${n(H)} metres?`, answer: [m], explanation: `${n(H)} ÷ ${n(rate)} = ${n(m)}, so the winch balloon reaches ${n(H)} metres after ${n(m)} minutes.` }
  ] }; }
});

/* q01d: h(t) = −t³ + pt² + qt at three times. Every average rate of a polynomial with whole coefficients between whole
   times is a whole number: −(u² + uv + v²) + p(u + v) + q. The drone climbs on the first stretch and sinks on the
   second, and h(t3) > 0, so it stays in the air throughout. */
practice({ id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The drone that climbs and sinks',
 brief: 'A survey drone rose and then sank on its programmed path, and the tracking log needs its average rates over each stretch and over the whole flight.',
 labels: ['rate, first stretch (m/s)', 'rate, second stretch (m/s)', 'rate, whole stretch (m/s)'], tolerance: 0.01 },
 [['first height (m)', 'second height (m)', 'third height (m)'], ['first rate (m/s)', 'second rate (m/s)'], ['whole-stretch rate (m/s)']], {
 canonical: { p: 8, q: 12, t1: 1, t2: 4, t3: 8 },
 draw: R => { const h = (p, t) => -t * t * t + p.p * t * t + p.q * t; let p; do { p = { p: R.int(6, 9), q: R.int(4, 20), t1: R.int(1, 3) }; p.t2 = p.t1 + R.int(2, 3); p.t3 = p.t2 + R.int(2, 4); }
  while (!(h(p, p.t2) > h(p, p.t1) && h(p, p.t3) < h(p, p.t2) && h(p, p.t3) > 0)); return p; },
 build: ({ p, q, t1, t2, t3 }) => { const parts = t => [t * t * t, p * t * t, q * t], h = t => -t * t * t + p * t * t + q * t, h1 = h(t1), h2 = h(t2), h3 = h(t3),
  work = t => { const [x, y, z] = parts(t); return `h(${n(t)}) = −${n(x)} + ${n(y)} + ${n(z)} = ${n(h(t))}`; },
  d12 = h2 - h1, d23 = h3 - h2, d13 = h3 - h1, A1 = d12 / (t2 - t1), A2 = d23 / (t3 - t2), A13 = d13 / (t3 - t1); return {
  prompt: `A survey drone flies a programmed path above the tracking station. Its height is h(t) = −t³ + ${n(p)}t² + ${n(q)}t metres, t seconds after launch. Enter its average rate of change of height from t = ${n(t1)} to t = ${n(t2)}, then from t = ${n(t2)} to t = ${n(t3)}, then over the whole stretch from t = ${n(t1)} to t = ${n(t3)}. All three are in metres per second; a negative rate means the drone lost height on average.`,
  answer: [A1, A2, A13],
  hints: [`Work out the height at all three times first. Cube before you put the minus sign in front: at t = ${n(t2)}, −t³ is ${n(-t2 * t2 * t2)}.`, 'For the whole stretch, use the heights at its two ends and its own change in time. Do not average the other two rates.'],
  solution: `${work(t1)}, ${work(t2)} and ${work(t3)}. From t = ${n(t1)} to t = ${n(t2)} the average rate is (${n(h2)} − ${n(h1)}) ÷ (${n(t2)} − ${n(t1)}) = ${n(d12)} ÷ ${n(t2 - t1)} = ${n(A1)} m/s, so the drone climbed. From t = ${n(t2)} to t = ${n(t3)} it is (${n(h3)} − ${n(h2)}) ÷ (${n(t3)} − ${n(t2)}) = ${n(d23)} ÷ ${n(t3 - t2)} = ${n(A2)} m/s, so it lost height on average. Over the whole stretch it is (${n(h3)} − ${n(h1)}) ÷ (${n(t3)} − ${n(t1)}) = ${n(d13)} ÷ ${n(t3 - t1)} = ${n(A13)} m/s.`,
  guidance: [
   { prompt: `Put the three times into h(t) = −t³ + ${n(p)}t² + ${n(q)}t. What are h(${n(t1)}), h(${n(t2)}) and h(${n(t3)})?`, answer: [h1, h2, h3], explanation: `${work(t1)}, ${work(t2)} and ${work(t3)}.` },
   { prompt: `What is the average rate from t = ${n(t1)} to t = ${n(t2)}, and from t = ${n(t2)} to t = ${n(t3)}?`, answer: [A1, A2], explanation: `${n(d12)} ÷ ${n(t2 - t1)} = ${n(A1)} m/s on the first stretch, and ${n(d23)} ÷ ${n(t3 - t2)} = ${n(A2)} m/s on the second. The negative rate means the drone was coming down.` },
   { prompt: `Now the whole stretch. What is (h(${n(t3)}) − h(${n(t1)})) ÷ (${n(t3)} − ${n(t1)})?`, answer: [A13], explanation: `(${n(h3)} − ${n(h1)}) ÷ ${n(t3 - t1)} = ${n(d13)} ÷ ${n(t3 - t1)} = ${n(A13)} m/s. It is a change over the whole stretch divided by the whole time, not the middle of the two rates.` }
  ] }; }
});

/* ---- q02 Instantaneous rate of change ---- */
/* q02b: F(t) = F0 − at² at t = c. Averages over 1, 0.1 and 0.01 minutes are −2ac minus a, a ÷ 10 and a ÷ 100.
   F0 is 300 to 500 and a(c + 1)² is at most 294, so the tank never runs dry. */
practice({ id: 'q02b', parent: 'q02', kind: 'setting', title: 'Draining the beacon tank',
 brief: 'A beacon’s fuel tank is being drained for cleaning, and the crew wants to know how fast the fuel is falling at one exact minute.',
 labels: ['average over 1 min (L/min)', 'average over 0.1 min (L/min)', 'instantaneous rate (L/min)'], tolerance: 0.005 },
 [['fuel at the start (L)', 'fuel a minute later (L)', 'average rate (L/min)'], ['fuel after 0.1 min (L)', 'average rate (L/min)'], ['instantaneous rate (L/min)']], {
 canonical: { F0: 400, a: 3, c: 4 },
 draw: R => ({ F0: R.pick([300, 400, 500]), a: R.int(2, 6), c: R.int(2, 6) }),
 build: ({ F0, a, c }) => { const u = 10 * c + 1, v = 100 * c + 1, cA = u / 10, cB = v / 100,
  Fc = F0 - a * c * c, F1 = F0 - a * (c + 1) * (c + 1), FA = (100 * F0 - a * u * u) / 100, FB = (10000 * F0 - a * v * v) / 10000,
  avg1 = F1 - Fc, dA = -a * (20 * c + 1) / 100, dB = -a * (200 * c + 1) / 10000, avg01 = -a * (20 * c + 1) / 10, avg001 = -a * (200 * c + 1) / 100, inst = -2 * a * c; return {
  prompt: `A beacon’s fuel tank is being drained for cleaning, and it holds F(t) = ${n(F0)} − ${n(a)}t² litres, t minutes after the valve opens. Enter the average rate of change of the fuel from t = ${n(c)} to t = ${n(c + 1)}, then from t = ${n(c)} to t = ${n(cA)}, then the instantaneous rate of change at t = ${n(c)}: the whole number the averages settle on as the interval shrinks. All three are in litres per minute, and all three are negative, because the fuel goes down.`,
  answer: [avg1, avg01, inst],
  hints: [`From t = ${n(c)} to t = ${n(cA)} the change in time is 0.1 minutes, so divide the change in fuel by 0.1. The fuel goes down, so that change is negative.`, `Work out one more average, over the 0.01 minutes from t = ${n(c)} to t = ${n(cB)}, and compare the three. The part that shrinks with the interval is disappearing; what stays is the instantaneous rate.`],
  solution: `F(${n(c)}) = ${n(F0)} − ${n(a)} × ${n(c * c)} = ${n(Fc)} and F(${n(c + 1)}) = ${n(F0)} − ${n(a)} × ${n((c + 1) * (c + 1))} = ${n(F1)}, so from t = ${n(c)} to t = ${n(c + 1)} the average rate is (${n(F1)} − ${n(Fc)}) ÷ 1 = ${n(avg1)} L/min. F(${n(cA)}) = ${n(F0)} − ${n(a)} × ${n(u * u / 100)} = ${n(FA)}, so from t = ${n(c)} to t = ${n(cA)} it is (${n(FA)} − ${n(Fc)}) ÷ 0.1 = ${n(dA)} ÷ 0.1 = ${n(avg01)} L/min. Over 0.01 minutes, F(${n(cB)}) = ${n(FB)}, so the average rate is (${n(FB)} − ${n(Fc)}) ÷ 0.01 = ${n(dB)} ÷ 0.01 = ${n(avg001)} L/min. The averages sit ${n(a)}, then ${n(a / 10)}, then ${n(a / 100)} below ${n(inst)}: ten times closer each time the interval is ten times shorter. They settle on ${n(inst)}, so the instantaneous rate of change at t = ${n(c)} is ${n(inst)} litres per minute: at that moment the tank is losing ${n(-inst)} litres a minute.`,
  guidance: [
   { prompt: `Start with the one-minute interval. What are F(${n(c)}) and F(${n(c + 1)}), and the average rate of change between them?`, answer: [Fc, F1, avg1], explanation: `F(${n(c)}) = ${n(F0)} − ${n(a)} × ${n(c * c)} = ${n(Fc)} and F(${n(c + 1)}) = ${n(F0)} − ${n(a)} × ${n((c + 1) * (c + 1))} = ${n(F1)}. The change in time is 1 minute, so the average rate is (${n(F1)} − ${n(Fc)}) ÷ 1 = ${n(avg1)} L/min.` },
   { prompt: `Shrink the interval to 0.1 minutes, from t = ${n(c)} to t = ${n(cA)}. What is F(${n(cA)}), and what is the average rate (F(${n(cA)}) − F(${n(c)})) ÷ 0.1?`, answer: [FA, avg01], explanation: `F(${n(cA)}) = ${n(F0)} − ${n(a)} × ${n(u * u / 100)} = ${n(FA)}. The change in fuel is ${n(FA)} − ${n(Fc)} = ${n(dA)} litres, and ${n(dA)} ÷ 0.1 = ${n(avg01)} L/min.` },
   { prompt: `Over 0.01 minutes, F(${n(cB)}) = ${n(FB)}, and the average rate is (${n(FB)} − ${n(Fc)}) ÷ 0.01 = ${n(avg001)}. The averages are ${n(avg1)}, ${n(avg01)} and ${n(avg001)}. Which whole number are they closing in on?`, answer: [inst], explanation: `Each time the interval gets ten times shorter, the averages sit ten times closer to ${n(inst)}: ${n(a)}, then ${n(a / 10)}, then ${n(a / 100)} below it. So the instantaneous rate of change at t = ${n(c)} is ${n(inst)} L/min.` }
  ] }; }
});

/* q02c: d(t) = at² + bt, readings only up to t = c, so the intervals end at c. Averages over the 0.1 and 0.01 seconds
   before c are 2ac + b minus a ÷ 10 and a ÷ 100. The dish limit L is 3 to 15 m/s above the speed, and the drone's speed is at most 40 m/s. */
practice({ id: 'q02c', parent: 'q02', kind: 'applied', title: 'Can the dish keep up?',
 brief: 'A test drone is pulling away from the tracking station, and Mira needs to know whether the dish can still follow it at one exact moment.',
 labels: ['average over 0.1 s (m/s)', 'instantaneous rate (m/s)', 'margin below the limit (m/s)'], tolerance: 0.005 },
 [['distance at the end (m)', 'distance 0.1 s earlier (m)', 'average rate (m/s)'], ['average over 0.01 s (m/s)', 'instantaneous rate (m/s)'], ['margin (m/s)']], {
 canonical: { a: 3, b: 4, c: 5, L: 40 },
 draw: R => { let a, b, c; do { a = R.int(2, 5); b = R.int(2, 12); c = R.int(3, 7); } while (2 * a * c + b > 40); return { a, b, c, L: 2 * a * c + b + R.int(3, 15) }; },
 build: ({ a, b, c, L }) => { const u = 10 * c - 1, v = 100 * c - 1, cL = u / 10, cM = v / 100, inst = 2 * a * c + b,
  dc = a * c * c + b * c, dl = (a * u * u + 10 * b * u) / 100, dl2 = (a * v * v + 100 * b * v) / 10000,
  avgL = (10 * inst - a) / 10, avg001 = (100 * inst - a) / 100, margin = L - inst; return {
  prompt: `A test drone is flying away from the tracking station, and its distance from the dish is d(t) = ${n(a)}t² + ${n(b)}t metres, t seconds after take-off. The dish can follow a target that moves away at up to ${n(L)} metres per second. The logger only kept readings up to t = ${n(c)}, so every interval has to end at t = ${n(c)}. Enter the average rate of change of the distance from t = ${n(cL)} to t = ${n(c)}, then the instantaneous rate of change at t = ${n(c)} (a whole number), then how many metres per second the drone is below the dish’s limit at that moment.`,
  answer: [avgL, inst, margin],
  hints: [`From t = ${n(cL)} to t = ${n(c)} the change in time is 0.1 seconds, so the average rate is (d(${n(c)}) − d(${n(cL)})) ÷ 0.1: the later reading minus the earlier one.`, `Shrink the interval to the 0.01 seconds before t = ${n(c)}. The averages creep up towards one whole number, and that number is the rate at the instant.`],
  solution: `d(${n(c)}) = ${n(a)} × ${n(c * c)} + ${n(b)} × ${n(c)} = ${n(dc)} and d(${n(cL)}) = ${n(a)} × ${n(u * u / 100)} + ${n(b)} × ${n(cL)} = ${n(dl)}. From t = ${n(cL)} to t = ${n(c)} the average rate is (${n(dc)} − ${n(dl)}) ÷ 0.1 = ${n(dc - dl)} ÷ 0.1 = ${n(avgL)} m/s. Over the last 0.01 seconds, d(${n(cM)}) = ${n(dl2)}, so the average rate is (${n(dc)} − ${n(dl2)}) ÷ 0.01 = ${n(avg001)} m/s. The amount below ${n(inst)} goes ${n(a / 10)}, then ${n(a / 100)}: ten times smaller each time the interval is, so the averages settle on ${n(inst)}. At t = ${n(c)} the drone moves away at ${n(inst)} metres per second, which is ${n(L)} − ${n(inst)} = ${n(margin)} m/s below the dish’s limit, so the dish can still follow it.`,
  guidance: [
   { prompt: `What are d(${n(c)}) and d(${n(cL)}), and the average rate (d(${n(c)}) − d(${n(cL)})) ÷ 0.1?`, answer: [dc, dl, avgL], explanation: `d(${n(c)}) = ${n(a)} × ${n(c * c)} + ${n(b)} × ${n(c)} = ${n(dc)} and d(${n(cL)}) = ${n(a)} × ${n(u * u / 100)} + ${n(b)} × ${n(cL)} = ${n(dl)}. The drone covered ${n(dc - dl)} metres in 0.1 seconds, and ${n(dc - dl)} ÷ 0.1 = ${n(avgL)} m/s.` },
   { prompt: `Over the last 0.01 seconds, d(${n(cM)}) = ${n(dl2)}. What is the average rate (${n(dc)} − ${n(dl2)}) ÷ 0.01, and which whole number are the averages closing in on?`, answer: [avg001, inst], explanation: `${n(dc)} − ${n(dl2)} = ${n((dc - dl2))}, and dividing by 0.01 gives ${n(avg001)} m/s. The averages ${n(avgL)} and ${n(avg001)} sit ${n(a / 10)} and ${n(a / 100)} below ${n(inst)}, so the rate at t = ${n(c)} is ${n(inst)} m/s.` },
   { prompt: `The dish can follow up to ${n(L)} m/s. How many metres per second below that is the drone at t = ${n(c)}?`, answer: [margin], explanation: `${n(L)} − ${n(inst)} = ${n(margin)}, so the drone is ${n(margin)} m/s inside the dish’s limit.` }
  ] }; }
});

/* q02d: d(t) = t³ + bt at t = c. Averages over 1, 0.1 and 0.01 seconds are 3c² + b plus 3c + 1, 0.3c + 0.01 and
   0.03c + 0.0001: the extra part shrinks, though not by exactly ten each time. The 0.01-second average is given. */
practice({ id: 'q02d', parent: 'q02', kind: 'challenge', title: 'The core drill’s speed at one instant',
 brief: 'A core drill bores faster and faster, and the station needs its exact speed at one moment from a cubic depth formula.',
 labels: ['average over 1 s (cm/s)', 'average over 0.1 s (cm/s)', 'instantaneous rate (cm/s)'], tolerance: 0.0005 },
 [['depth at the start (cm)', 'depth one second later (cm)', 'average rate (cm/s)'], ['cube', 'depth after 0.1 s (cm)', 'average rate (cm/s)'], ['instantaneous rate (cm/s)']], {
 canonical: { b: 6, c: 2 },
 draw: R => ({ b: R.int(2, 15), c: R.int(2, 5) }),
 build: ({ b, c }) => { const u = 10 * c + 1, cA = u / 10, cB = (100 * c + 1) / 100, k = u * u * u / 1000,
  d0 = c * c * c + b * c, d1 = (c + 1) * (c + 1) * (c + 1) + b * (c + 1), dA = (u * u * u + 100 * b * u) / 1000,
  avg1 = d1 - d0, avg01 = (300 * c * c + 30 * c + 1 + 100 * b) / 100, avg001 = (30000 * c * c + 300 * c + 1 + 10000 * b) / 10000, inst = 3 * c * c + b; return {
  prompt: `A core drill at the tracking station bores into the ground, and its depth is d(t) = t³ + ${n(b)}t centimetres, t seconds after it starts. The engineers have already found that from t = ${n(c)} to t = ${n(cB)} the average rate of change of the depth is ${n(avg001)} centimetres per second. Enter the average rate from t = ${n(c)} to t = ${n(c + 1)}, then from t = ${n(c)} to t = ${n(cA)}, then the instantaneous rate of change at t = ${n(c)}, which is a whole number. All three are in centimetres per second.`,
  answer: [avg1, avg01, inst],
  hints: [`Keep every decimal: ${n(cA)}³ has three decimal places, and the change in depth over 0.1 seconds is small.`, 'Here the part above the final rate does not shrink by exactly ten each time, but it still shrinks towards 0 as the interval does. The whole number the averages approach is the instantaneous rate.'],
  solution: `d(${n(c)}) = ${n(c)}³ + ${n(b)} × ${n(c)} = ${n(c * c * c)} + ${n(b * c)} = ${n(d0)} and d(${n(c + 1)}) = ${n(c + 1)}³ + ${n(b)} × ${n(c + 1)} = ${n(d1)}, so over 1 second the average rate is (${n(d1)} − ${n(d0)}) ÷ 1 = ${n(avg1)} cm/s. ${n(cA)}³ = ${n(k)}, so d(${n(cA)}) = ${n(k)} + ${n(b)} × ${n(cA)} = ${n(dA)}, and over 0.1 seconds the average rate is (${n(dA)} − ${n(d0)}) ÷ 0.1 = ${n(dA - d0)} ÷ 0.1 = ${n(avg01)} cm/s. Over 0.01 seconds it is ${n(avg001)} cm/s. The part above ${n(inst)} goes ${n(avg1 - inst)}, ${n(avg01 - inst)}, ${n(avg001 - inst)}: it shrinks towards 0 as the interval shrinks. So the instantaneous rate of change at t = ${n(c)} is ${n(inst)} centimetres per second.`,
  guidance: [
   { prompt: `Start with the one-second interval. What are d(${n(c)}) and d(${n(c + 1)}), and the average rate between them?`, answer: [d0, d1, avg1], explanation: `d(${n(c)}) = ${n(c * c * c)} + ${n(b * c)} = ${n(d0)} and d(${n(c + 1)}) = ${n((c + 1) * (c + 1) * (c + 1))} + ${n(b * (c + 1))} = ${n(d1)}. Over 1 second the average rate is ${n(avg1)} cm/s.` },
   { prompt: `Now 0.1 seconds. What is ${n(cA)}³, what is d(${n(cA)}), and what is the average rate (d(${n(cA)}) − d(${n(c)})) ÷ 0.1?`, answer: [k, dA, avg01], explanation: `${n(cA)} × ${n(cA)} × ${n(cA)} = ${n(k)}, so d(${n(cA)}) = ${n(k)} + ${n(b * cA)} = ${n(dA)}. The change in depth is ${n(dA)} − ${n(d0)} = ${n(dA - d0)} cm, and ${n(dA - d0)} ÷ 0.1 = ${n(avg01)} cm/s.` },
   { prompt: `The averages are ${n(avg1)}, ${n(avg01)} and ${n(avg001)}. Which whole number are they closing in on?`, answer: [inst], explanation: `The part above ${n(inst)} is ${n(avg1 - inst)}, then ${n(avg01 - inst)}, then ${n(avg001 - inst)}, and it keeps shrinking towards 0 as the interval does. So the drill’s instantaneous rate at t = ${n(c)} is ${n(inst)} cm/s.` }
  ] }; }
});

/* ---- q03 The limit of a function ---- */
/* q03b: f(x) = (x³ − c²x) ÷ (x − c), which is x(x + c) away from x = c, so f(c ± 0.1) = 2c² ± 0.3c + 0.01 and the
   limit is 2c². c runs 2 to 10, nine different prompts. */
practice({ id: 'q03b', parent: 'q03', kind: 'setting', title: 'Gain at the aligner’s blind spot',
 brief: 'The antenna aligner must run at the one setting where its gain formula gives 0 ÷ 0, so the crew reads the gain from the settings around it.',
 labels: ['f a tenth to the left', 'f a tenth to the right', 'limit'], tolerance: 0.0005 },
 [['top on the left', 'f on the left'], ['top on the right', 'f on the right'], ['limit']], {
 canonical: { c: 3 },
 draw: R => ({ c: R.int(2, 10) }),
 build: ({ c }) => { const C2 = c * c, ul = 10 * c - 1, ur = 10 * c + 1, xl = ul / 10, xh = ur / 10,
  kl = ul * ul * ul / 1000, kh = ur * ur * ur / 1000, ml = C2 * ul / 10, mh = C2 * ur / 10,
  lo = (200 * C2 - 30 * c + 1) / 100, hi = (200 * C2 + 30 * c + 1) / 100, topL = -lo / 10, topR = hi / 10,
  lo2 = (20000 * C2 - 300 * c + 1) / 10000, hi2 = (20000 * C2 + 300 * c + 1) / 10000, L = 2 * C2; return {
  prompt: `The antenna aligner at the tracking station sets its gain with f(x) = (x³ − ${n(C2)}x) ÷ (x − ${n(c)}), where x is the dial setting. The aligner has to run at x = ${n(c)}, where the formula gives 0 ÷ 0, so the crew read the gain from settings nearby. Their table already has f(${n(c - 0.01)}) = ${n(lo2)} and f(${n(c + 0.01)}) = ${n(hi2)}. Enter f(${n(xl)}) and f(${n(xh)}), then the gain the values close in on as x approaches ${n(c)}, which is a whole number.`,
  answer: [lo, hi, L],
  hints: [`For f(${n(xl)}), cube ${n(xl)}, take away ${n(C2)} × ${n(xl)}, then divide by ${n(xl)} − ${n(c)}, which is −0.1.`, 'Put the four values in order of x and read the number that both sides close in on.'],
  solution: `${n(xl)}³ = ${n(kl)} and ${n(C2)} × ${n(xl)} = ${n(ml)}, so f(${n(xl)}) = (${n(kl)} − ${n(ml)}) ÷ (−0.1) = ${n(topL)} ÷ (−0.1) = ${n(lo)}. ${n(xh)}³ = ${n(kh)} and ${n(C2)} × ${n(xh)} = ${n(mh)}, so f(${n(xh)}) = (${n(kh)} − ${n(mh)}) ÷ 0.1 = ${n(topR)} ÷ 0.1 = ${n(hi)}. From the left the gains are ${n(lo)} and then ${n(lo2)}; from the right ${n(hi)} and then ${n(hi2)}. Both sides close in on ${n(L)}, so lim x→${n(c)} f(x) = ${n(L)}, even though f(${n(c)}) itself has no value.`,
  guidance: [
   { prompt: `Start on the left of ${n(c)}. What is the top, ${n(xl)}³ − ${n(C2)} × ${n(xl)}, and what is f(${n(xl)})?`, answer: [topL, lo], explanation: `${n(xl)}³ = ${n(kl)} and ${n(C2)} × ${n(xl)} = ${n(ml)}, so the top is ${n(topL)}. The bottom is ${n(xl)} − ${n(c)} = −0.1, and ${n(topL)} ÷ (−0.1) = ${n(lo)}.` },
   { prompt: `Now the right of ${n(c)}. What is the top, ${n(xh)}³ − ${n(C2)} × ${n(xh)}, and what is f(${n(xh)})?`, answer: [topR, hi], explanation: `${n(xh)}³ = ${n(kh)} and ${n(C2)} × ${n(xh)} = ${n(mh)}, so the top is ${n(topR)}. The bottom is 0.1, and ${n(topR)} ÷ 0.1 = ${n(hi)}.` },
   { prompt: `Line up the table in order of x: ${n(lo)}, ${n(lo2)}, ${n(hi2)}, ${n(hi)}. Which whole number is the gain heading for?`, answer: [L], explanation: `From the left the values rise towards ${n(L)}, and from the right they fall towards it. So the limit as x approaches ${n(c)} is ${n(L)}.` }
  ] }; }
});

/* q03c: P(x) = (x² + kx − C) ÷ (x − c) with C = c² + kc, which is x + c + k away from x = c: the limit is 2c + k,
   and the battery of E = (2c + k) × H watt-hours lasts H hours (4 to 12). */
practice({ id: 'q03c', parent: 'q03', kind: 'applied', title: 'How long the relay beacon lasts',
 brief: 'A relay beacon must run at the one setting where its power formula breaks, and the crew needs to know how long its battery will last there.',
 labels: ['P a tenth to the left (W)', 'P a tenth to the right (W)', 'power draw (W)', 'battery life (h)'], tolerance: 0.01 },
 [['P on the left (W)', 'P on the right (W)'], ['power draw (W)'], ['battery life (h)']], {
 canonical: { c: 4, k: 3, E: 66 },
 draw: R => { const c = R.int(3, 7), k = R.int(2, 9); return { c, k, E: (2 * c + k) * R.int(4, 12) }; },
 build: ({ c, k, E }) => { const C = c * c + k * c, L = 2 * c + k, H = E / L, ul = 10 * c - 1, ur = 10 * c + 1, xl = ul / 10, xh = ur / 10,
  lo = (10 * L - 1) / 10, hi = (10 * L + 1) / 10, topL = -(10 * L - 1) / 100, topR = (10 * L + 1) / 100; return {
  prompt: `A relay beacon at the tracking station draws P(x) = (x² + ${n(k)}x − ${n(C)}) ÷ (x − ${n(c)}) watts, where x is its transmitter setting. It has to run at x = ${n(c)}, where the formula gives 0 ÷ 0, and its battery holds ${n(E)} watt-hours. Enter P(${n(xl)}) and P(${n(xh)}), then the power draw the values close in on as x approaches ${n(c)}, in watts, then how many hours the full battery lasts at that draw.`,
  answer: [lo, hi, L, H],
  hints: [`At x = ${n(xl)} the bottom is ${n(xl)} − ${n(c)} = −0.1, so a negative top divided by it gives a positive draw.`, 'A battery lasts its watt-hours divided by the watts it draws, in hours.'],
  solution: `At x = ${n(xl)} the top is ${n(ul * ul / 100)} + ${n(k * ul / 10)} − ${n(C)} = ${n(topL)} and the bottom is −0.1, so P(${n(xl)}) = ${n(topL)} ÷ (−0.1) = ${n(lo)}. At x = ${n(xh)} the top is ${n(ur * ur / 100)} + ${n(k * ur / 10)} − ${n(C)} = ${n(topR)} and the bottom is 0.1, so P(${n(xh)}) = ${n(topR)} ÷ 0.1 = ${n(hi)}. Closer in, P(${n(c - 0.01)}) = ${n(L - 0.01)} and P(${n(c + 0.01)}) = ${n(L + 0.01)}. Both sides close in on ${n(L)}, so at x = ${n(c)} the beacon draws ${n(L)} watts. The battery lasts ${n(E)} ÷ ${n(L)} = ${n(H)} hours.`,
  guidance: [
   { prompt: `The bottoms at x = ${n(xl)} and x = ${n(xh)} are −0.1 and 0.1. What are P(${n(xl)}) and P(${n(xh)})?`, answer: [lo, hi], explanation: `On the left the top is ${n(ul * ul / 100)} + ${n(k * ul / 10)} − ${n(C)} = ${n(topL)}, and ${n(topL)} ÷ (−0.1) = ${n(lo)}. On the right it is ${n(ur * ur / 100)} + ${n(k * ur / 10)} − ${n(C)} = ${n(topR)}, and ${n(topR)} ÷ 0.1 = ${n(hi)}.` },
   { prompt: `Closer in, P(${n(c - 0.01)}) = ${n(L - 0.01)} and P(${n(c + 0.01)}) = ${n(L + 0.01)}. What whole number of watts do the values close in on?`, answer: [L], explanation: `The left values rise and the right values fall towards ${n(L)}, so the limit, the draw at x = ${n(c)}, is ${n(L)} watts.` },
   { prompt: `The battery holds ${n(E)} watt-hours. How many hours does it last at ${n(L)} watts?`, answer: [H], explanation: `${n(E)} ÷ ${n(L)} = ${n(H)}, so the beacon runs for ${n(H)} hours on a full battery.` }
  ] }; }
});

/* q03d (uses q02): Q(h) = (d(c + h) − d(c)) ÷ h for d(t) = at² + bt is 2ac + b + ah away from h = 0, so Q(±0.1) and
   Q(±0.01) sit a ÷ 10 and a ÷ 100 either side of the speed 2ac + b. c >= 2, so c − 0.1 is a real moment of the flight. */
practice({ id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q02', title: 'Closing in on the glider from both sides',
 brief: 'Mira wants the glider’s speed at one instant as a true two-sided limit, using stretches of time both before and after the moment.',
 labels: ['Q(−0.1) (m/s)', 'Q(0.1) (m/s)', 'limit (m/s)'], tolerance: 0.005 },
 [['d at the moment (m)', 'd 0.1 s earlier (m)', 'Q(−0.1) (m/s)'], ['d 0.1 s later (m)', 'Q(0.1) (m/s)'], ['limit (m/s)']], {
 canonical: { a: 4, b: 3, c: 2 },
 draw: R => ({ a: R.int(2, 6), b: R.int(2, 12), c: R.int(2, 6) }),
 build: ({ a, b, c }) => { const ul = 10 * c - 1, ur = 10 * c + 1, cl = ul / 10, ch = ur / 10, inst = 2 * a * c + b,
  dc = a * c * c + b * c, dl = (a * ul * ul + 10 * b * ul) / 100, dr = (a * ur * ur + 10 * b * ur) / 100,
  Qm = (10 * inst - a) / 10, Qp = (10 * inst + a) / 10, Qm2 = (100 * inst - a) / 100, Qp2 = (100 * inst + a) / 100; return {
  prompt: `The tracking dish follows a glider whose distance from the station is d(t) = ${n(a)}t² + ${n(b)}t metres, t seconds after launch. Mira writes Q(h) = (d(${n(c)} + h) − d(${n(c)})) ÷ h for the average rate of change over the stretch from t = ${n(c)} to t = ${n(c)} + h; a negative h gives a stretch that ends at t = ${n(c)}. Q(0) would be 0 ÷ 0, so she finds the limit of Q(h) as h approaches 0 from both sides, and she already has Q(0.01) = ${n(Qp2)} and Q(−0.01) = ${n(Qm2)}. Enter Q(−0.1), then Q(0.1), then that limit, which is the glider’s instantaneous speed at t = ${n(c)} in metres per second.`,
  answer: [Qm, Qp, inst],
  hints: [`For h = −0.1 the top is d(${n(cl)}) − d(${n(c)}), which is negative, and the bottom is −0.1, so Q(−0.1) comes out positive.`, 'Both sides count: the values for negative h and for positive h must close in on the same number.'],
  solution: `d(${n(c)}) = ${n(a)} × ${n(c * c)} + ${n(b)} × ${n(c)} = ${n(dc)}, d(${n(cl)}) = ${n(a)} × ${n(ul * ul / 100)} + ${n(b)} × ${n(cl)} = ${n(dl)} and d(${n(ch)}) = ${n(a)} × ${n(ur * ur / 100)} + ${n(b)} × ${n(ch)} = ${n(dr)}. So Q(−0.1) = (${n(dl)} − ${n(dc)}) ÷ (−0.1) = ${n(dl - dc)} ÷ (−0.1) = ${n(Qm)} and Q(0.1) = (${n(dr)} − ${n(dc)}) ÷ 0.1 = ${n(dr - dc)} ÷ 0.1 = ${n(Qp)}. With Q(−0.01) = ${n(Qm2)} and Q(0.01) = ${n(Qp2)}, the values close in on ${n(inst)} from below and from above. So the limit of Q(h) as h approaches 0 is ${n(inst)}: at t = ${n(c)} the glider moves away at ${n(inst)} metres per second.`,
  guidance: [
   { prompt: `What are d(${n(c)}) and d(${n(cl)}), and what is Q(−0.1) = (d(${n(cl)}) − d(${n(c)})) ÷ (−0.1)?`, answer: [dc, dl, Qm], explanation: `d(${n(c)}) = ${n(a)} × ${n(c * c)} + ${n(b)} × ${n(c)} = ${n(dc)} and d(${n(cl)}) = ${n(a)} × ${n(ul * ul / 100)} + ${n(b)} × ${n(cl)} = ${n(dl)}. The top is ${n(dl - dc)}, and ${n(dl - dc)} ÷ (−0.1) = ${n(Qm)}: the two minus signs cancel.` },
   { prompt: `What is d(${n(ch)}), and what is Q(0.1) = (d(${n(ch)}) − d(${n(c)})) ÷ 0.1?`, answer: [dr, Qp], explanation: `d(${n(ch)}) = ${n(a)} × ${n(ur * ur / 100)} + ${n(b)} × ${n(ch)} = ${n(dr)}. The top is ${n(dr - dc)}, and ${n(dr - dc)} ÷ 0.1 = ${n(Qp)}.` },
   { prompt: `On one side Q(−0.1) = ${n(Qm)} and Q(−0.01) = ${n(Qm2)}; on the other Q(0.01) = ${n(Qp2)} and Q(0.1) = ${n(Qp)}. What number do both sides close in on?`, answer: [inst], explanation: `The values for negative h rise towards ${n(inst)} and those for positive h fall towards it, each ten times closer when h is ten times smaller. So the limit is ${n(inst)} m/s, the glider’s speed at t = ${n(c)}.` }
  ] }; }
});

/* ---- q04 Limit laws and direct substitution ---- */
/* q04b: B(x) = (x³ + e) ÷ (ax − q) as x → c, with the bottom ac − q at least 2 and e = L(ac − q) − c³ so the limit L
   (2 to 12) is a whole number; e is never 0. */
practice({ id: 'q04b', parent: 'q04', kind: 'setting', title: 'The homing beacon’s flash rate',
 brief: 'Mira wants the flash rate a homing beacon heads towards as its power setting is turned, worked out by the rules rather than a table.',
 labels: ['limit of the top', 'limit of the bottom', 'limit of B(x)'], tolerance: 0.01 },
 [['limit of the top'], ['limit of the bottom'], ['limit of B(x)']], {
 canonical: { a: 3, c: 2, q: 1, e: 12 },
 draw: R => { let p; do { const a = R.int(2, 5), c = R.int(2, 4), q = R.int(1, a * c - 2), L = R.int(2, 12); p = { a, c, q, e: L * (a * c - q) - c * c * c }; } while (p.e === 0); return p; },
 build: ({ a, c, q, e }) => { const c3 = c * c * c, top = c3 + e, bot = a * c - q, L = top / bot; return {
  prompt: `A homing beacon at the tracking station flashes B(x) = (x³ ${cst(e)}) ÷ (${n(a)}x − ${n(q)}) times a minute, where x is its power setting. Mira wants the flash rate the beacon heads towards as x approaches ${n(c)}, worked out with the limit laws instead of a table. Enter the limit of the top, then the limit of the bottom, then the limit of B(x).`,
  answer: [top, bot, L],
  hints: [`By the power law, x³ approaches ${n(c)}³ as x approaches ${n(c)}, and the constant in the top stays as it is.`, `For the bottom, use the constant multiple law on ${n(a)}x. Check that the bottom’s limit is not 0 before you divide.`],
  solution: `By the power law x³ approaches ${n(c)}³ = ${n(c3)}, and a constant stays put, so by the sum law the top approaches ${n(c3)} ${cst(e)} = ${n(top)}. By the constant multiple law ${n(a)}x approaches ${n(a)} × ${n(c)} = ${n(a * c)}, so the bottom approaches ${n(a * c)} − ${n(q)} = ${n(bot)}, which is not 0. By the quotient law the limit of B(x) is ${n(top)} ÷ ${n(bot)} = ${n(L)} flashes a minute, the same as putting x = ${n(c)} straight into the formula.`,
  guidance: [
   { prompt: `What does the top, x³ ${cst(e)}, approach as x approaches ${n(c)}?`, answer: [top], explanation: `${n(c)}³ = ${n(c3)}, and ${n(c3)} ${cst(e)} = ${n(top)}.` },
   { prompt: `What does the bottom, ${n(a)}x − ${n(q)}, approach?`, answer: [bot], explanation: `${n(a)} × ${n(c)} − ${n(q)} = ${n(a * c)} − ${n(q)} = ${n(bot)}. It is not 0, so the quotient law may be used.` },
   { prompt: `By the quotient law, what is ${n(top)} ÷ ${n(bot)}?`, answer: [L], explanation: `${n(top)} ÷ ${n(bot)} = ${n(L)}, so the beacon heads towards ${n(L)} flashes a minute as x approaches ${n(c)}.` }
  ] }; }
});

/* q04c: R(x) = (x² + p) ÷ (x − q) as x → c, bottom c − q at least 2, p = L(c − q) − c² (never 0) so the turning
   rate L (3 to 12) is a whole number; the sweep D = L × s is at most 360 degrees. */
practice({ id: 'q04c', parent: 'q04', kind: 'applied', title: 'Timing the dish sweep',
 brief: 'The big dish is being run up to a new motor setting for a sweep, and the crew needs to know how long the sweep will take.',
 labels: ['turning rate (degrees/s)', 'sweep time (s)'], tolerance: 0.01 },
 [['limit of the top', 'limit of the bottom'], ['turning rate (degrees/s)'], ['sweep time (s)']], {
 canonical: { c: 5, q: 2, p: 2, D: 180 },
 draw: R => { let p; do { const c = R.int(3, 7), q = R.int(1, c - 2), L = R.int(3, 12); p = { c, q, p: L * (c - q) - c * c, D: L * R.int(5, Math.floor(360 / L)) }; } while (p.p === 0); return p; },
 build: ({ c, q, p, D }) => { const c2 = c * c, top = c2 + p, bot = c - q, L = top / bot, s = D / L; return {
  prompt: `The big tracking dish turns at R(x) = (x² ${cst(p)}) ÷ (x − ${n(q)}) degrees per second when its motor setting is x. The crew are turning the setting up towards ${n(c)} to make a sweep of ${n(D)} degrees. Use the limit laws to find the turning rate that R(x) heads towards as x approaches ${n(c)}, in degrees per second, then enter how many seconds the ${n(D)}-degree sweep takes at that rate.`,
  answer: [L, s],
  hints: ['Check the bottom first. If its limit is not 0, the quotient law applies: the limit of the top divided by the limit of the bottom.', 'At a steady rate, the sweep takes its total degrees divided by the degrees turned each second.'],
  solution: `By the power law x² approaches ${n(c)}² = ${n(c2)}, so by the sum law the top approaches ${n(c2)} ${cst(p)} = ${n(top)}. The bottom approaches ${n(c)} − ${n(q)} = ${n(bot)}, which is not 0, so by the quotient law R(x) approaches ${n(top)} ÷ ${n(bot)} = ${n(L)} degrees per second. At that rate the sweep of ${n(D)} degrees takes ${n(D)} ÷ ${n(L)} = ${n(s)} seconds.`,
  guidance: [
   { prompt: `What do the top, x² ${cst(p)}, and the bottom, x − ${n(q)}, approach as x approaches ${n(c)}?`, answer: [top, bot], explanation: `The top approaches ${n(c)}² ${cst(p)} = ${n(c2)} ${cst(p)} = ${n(top)}, and the bottom approaches ${n(c)} − ${n(q)} = ${n(bot)}.` },
   { prompt: `The bottom does not approach 0. What turning rate does R(x) head towards?`, answer: [L], explanation: `By the quotient law, ${n(top)} ÷ ${n(bot)} = ${n(L)} degrees per second.` },
   { prompt: `The dish turns ${n(L)} degrees each second. How many seconds does a sweep of ${n(D)} degrees take?`, answer: [s], explanation: `${n(D)} ÷ ${n(L)} = ${n(s)}, so the sweep takes ${n(s)} seconds.` }
  ] }; }
});

/* q04d: S(x) = (ax² + bx + p) ÷ (x² + q) as x → c, with c negative (−6 to −2) and b negative or positive (never ±1, so
   no coefficient 1 is written out). The limit L is a whole number or ends in .5, and p is never 0. */
practice({ id: 'q04d', parent: 'q04', kind: 'challenge', title: 'The shaded-side sensor',
 brief: 'A sensor on the cold side of the station is drifting towards a temperature below zero, and Mira wants the reading it heads towards.',
 labels: ['limit of x²', 'limit of the top', 'limit of S(x)'], tolerance: 0.01 },
 [['limit of x²'], ['limit of the top'], ['limit of S(x)']], {
 canonical: { a: 2, b: -5, p: 12, q: 1, c: -3 },
 draw: R => { let p; do { const c = -R.int(2, 6), a = R.int(2, 4), b = R.except(-7, 7, [0, 1, -1]), q = R.int(1, 6), top = R.int(3, 25) * (c * c + q) / 2;
  p = { a, b, q, c, p: top - a * c * c - b * c }; } while (!Number.isInteger(p.p) || p.p === 0); return p; },
 build: ({ a, b, p, q, c }) => { const c2 = c * c, ac2 = a * c2, bc = b * c, top = ac2 + bc + p, bot = c2 + q, L = top / bot, poly = `${n(a)}x² ${trm(b, 'x')} ${cst(p)}`; return {
  prompt: `A sensor on the shaded side of the tracking station reads S(x) = (${poly}) ÷ (x² + ${n(q)}), where x is the temperature in degrees, and the temperature is falling towards ${n(c)}. Use the limit laws to find the reading S(x) heads towards: enter what x² approaches, then what the top approaches, then the limit of S(x).`,
  answer: [c2, top, L],
  hints: ['x approaches a negative number, so square it before you multiply by the number in front, and keep track of the sign of the x term: ' + (b < 0 ? 'a minus times a minus is a plus.' : 'a plus times a minus is a minus.'), 'The bottom does not approach 0, so the quotient law applies.'],
  solution: `By the power law x² approaches ${par(c)}² = ${n(c2)}. By the constant multiple law ${n(a)}x² approaches ${n(a)} × ${n(c2)} = ${n(ac2)}, and ${n(b)}x approaches ${n(b)} × ${par(c)} = ${n(bc)}. So by the sum law the top approaches ${n(ac2)} ${cst(bc)} ${cst(p)} = ${n(top)}. The bottom approaches ${n(c2)} + ${n(q)} = ${n(bot)}, which is not 0, so by the quotient law S(x) approaches ${n(top)} ÷ ${n(bot)} = ${n(L)}.`,
  guidance: [
   { prompt: `x approaches ${n(c)}. What does x² approach?`, answer: [c2], explanation: `${par(c)} × ${par(c)} = ${n(c2)}. A negative number times a negative number is positive.` },
   { prompt: `What does the top, ${poly}, approach?`, answer: [top], explanation: `${n(a)} × ${n(c2)} = ${n(ac2)} and ${n(b)} × ${par(c)} = ${n(bc)}, so the top approaches ${n(ac2)} ${cst(bc)} ${cst(p)} = ${n(top)}.` },
   { prompt: `The bottom approaches ${n(c2)} + ${n(q)} = ${n(bot)}. What does S(x) approach?`, answer: [L], explanation: `${n(top)} ÷ ${n(bot)} = ${n(L)}, so the sensor reading heads towards ${n(L)}.` }
  ] }; }
});

/* ---- q05 Limits at a hole: factor and cancel ---- */
/* q05b: T(x) = (x + r)(x + m) ÷ (x + r) as x → −r, written out as x² + Bx + C; B = r + m and C = rm are never 0, and
   m ≠ r keeps the top from being a perfect square. The limit m − r may be negative. */
practice({ id: 'q05b', parent: 'q05', kind: 'setting', title: 'The winch log with a hole below zero',
 brief: 'The cable winch must sit at a dial reading below zero where its tension formula gives 0 ÷ 0, and the crew needs the tension it heads for.',
 labels: ['m', 'limit'], tolerance: 0.01 },
 [['m'], ['limit']], {
 canonical: { r: 3, m: 8 },
 draw: R => { let p; do { p = { r: R.int(2, 6), m: R.except(-6, 9, [0]) }; } while (p.m === p.r || p.m === -p.r); return p; },
 build: ({ r, m }) => { const B = r + m, C = r * m, L = m - r, top = `x² ${trm(B, 'x')} ${cst(C)}`, fac = `x ${cst(m)}`; return {
  prompt: `The cable winch at the tracking station logs its tension with T(x) = (${top}) ÷ (x + ${n(r)}), where x is a dial reading that can go below zero. The winch is set to x = ${n(-r)}, where the top and the bottom are both 0. The top factors as (x + ${n(r)})(x + m). Enter m, then the limit of T(x) as x approaches ${n(-r)}.`,
  answer: [m, L],
  hints: [`Look for two numbers that multiply to ${n(C)} and add to ${n(B)}. One of them is ${n(r)}, because x + ${n(r)} is a factor.`, `After cancelling x + ${n(r)}, put x = ${n(-r)} into what is left. Mind the minus sign.`],
  solution: `At x = ${n(-r)} the top is ${n(r * r)} ${cst(-B * r)} ${cst(C)} = 0 and the bottom is ${n(-r)} + ${n(r)} = 0, so direct substitution gives 0 ÷ 0, which tells us nothing. The numbers ${n(r)} and ${n(m)} multiply to ${n(C)} and add to ${n(B)}, so ${top} = (x + ${n(r)})(${fac}), and m = ${n(m)}. For every x other than ${n(-r)}, T(x) = (x + ${n(r)})(${fac}) ÷ (x + ${n(r)}) = ${fac}. As x approaches ${n(-r)}, ${fac} approaches ${n(-r)} ${cst(m)} = ${n(L)}, so the limit is ${n(L)}.`,
  guidance: [
   { prompt: `Which two numbers multiply to ${n(C)} and add to ${n(B)}? One of them is ${n(r)}; enter the other one, m.`, answer: [m], explanation: `${n(r)} × ${par(m)} = ${n(C)} and ${n(r)} ${cst(m)} = ${n(B)}, so m = ${n(m)}. Check: (x + ${n(r)})(${fac}) = ${top}.` },
   { prompt: `After cancelling x + ${n(r)}, T(x) = ${fac} near x = ${n(-r)}. What does it approach as x approaches ${n(-r)}?`, answer: [L], explanation: `${n(-r)} ${cst(m)} = ${n(L)}. The graph of T has a hole at x = ${n(-r)}, at height ${n(L)}, and that height is the limit.` }
  ] }; }
});

/* q05c: the average speed A(t) = (t² + bt − K) ÷ (t − c) with K = d(c) = c² + bc; it is t + c + b away from t = c,
   so the speed at t = c is 2c + b. The rating V is 2 to 12 m/s above it. */
practice({ id: 'q05c', parent: 'q05', kind: 'applied', title: 'Speed check on the monorail',
 brief: 'A cargo cart is nearing the monorail points, and the crew must check its speed at one instant against the points’ rating.',
 labels: ['k', 'speed at the instant (m/s)', 'margin below the rating (m/s)'], tolerance: 0.01 },
 [['k'], ['speed at the instant (m/s)'], ['margin (m/s)']], {
 canonical: { b: 6, c: 4, V: 20 },
 draw: R => { const b = R.int(2, 10), c = R.int(2, 6); return { b, c, V: 2 * c + b + R.int(2, 12) }; },
 build: ({ b, c, V }) => { const K = c * c + b * c, k = c + b, speed = 2 * c + b, margin = V - speed; return {
  prompt: `A cargo cart runs on the monorail beside the tracking station, and its distance along the rail is d(t) = t² + ${n(b)}t metres, t seconds after it sets off. Its average speed between t = ${n(c)} and another time t is A(t) = (t² + ${n(b)}t − ${n(K)}) ÷ (t − ${n(c)}), which gives 0 ÷ 0 at t = ${n(c)} itself. The rail’s points are rated for carts up to ${n(V)} metres per second. Enter the number k with t² + ${n(b)}t − ${n(K)} = (t − ${n(c)})(t + k), then the cart’s speed at t = ${n(c)}, which is the limit of A(t) as t approaches ${n(c)}, then how many metres per second it is below the rating.`,
  answer: [k, speed, margin],
  hints: [`t − ${n(c)} is a factor, so look for two numbers that multiply to −${n(K)} and add to ${n(b)}. One of them is −${n(c)}.`, `Cancel t − ${n(c)}, then put t = ${n(c)} into what is left: that limit is the speed at the instant t = ${n(c)}.`],
  solution: `The numbers −${n(c)} and ${n(k)} multiply to −${n(K)} and add to ${n(b)}, so t² + ${n(b)}t − ${n(K)} = (t − ${n(c)})(t + ${n(k)}), and k = ${n(k)}. For every t other than ${n(c)}, A(t) = t + ${n(k)}. As t approaches ${n(c)}, t + ${n(k)} approaches ${n(c)} + ${n(k)} = ${n(speed)}, so the cart’s speed at t = ${n(c)} is ${n(speed)} metres per second. That is ${n(V)} − ${n(speed)} = ${n(margin)} m/s below the rating, so the points are safe.`,
  guidance: [
   { prompt: `Factor the top: t² + ${n(b)}t − ${n(K)} = (t − ${n(c)})(t + k). What is k?`, answer: [k], explanation: `k has to multiply with −${n(c)} to give −${n(K)} and add to −${n(c)} to give ${n(b)}: k = ${n(k)}. Check: (t − ${n(c)})(t + ${n(k)}) = t² + ${n(b)}t − ${n(K)}.` },
   { prompt: `After cancelling t − ${n(c)}, A(t) = t + ${n(k)} near t = ${n(c)}. What does it approach as t approaches ${n(c)}?`, answer: [speed], explanation: `${n(c)} + ${n(k)} = ${n(speed)}. The limit of the average speed is the speed at the instant t = ${n(c)}: ${n(speed)} m/s.` },
   { prompt: `The points are rated for ${n(V)} m/s. How many metres per second below that is the cart?`, answer: [margin], explanation: `${n(V)} − ${n(speed)} = ${n(margin)}, so the cart passes the points ${n(margin)} m/s under their rating.` }
  ] }; }
});

/* q05d: N(x) = (x − r)(x + e) ÷ ((x − r)(x + r)), written out as (x² + Bx + C) ÷ (x² − r²); the limit (r + e) ÷ 2r
   has at most two decimals (r is 4, 5 or 10; never 2, whose x² − 4 is the q05 worked example). e ≠ r (the top is not
   the bottom) and e ≠ −r (no double root). */
practice({ id: 'q05d', parent: 'q05', kind: 'challenge', title: 'A hole in the top and the bottom',
 brief: 'A ratio of two dish readings gives 0 ÷ 0 at the setting the crew uses, and both its top and its bottom have to be factored to rescue it.',
 labels: ['e', 'limit'], tolerance: 0.005 },
 [['e'], ['s'], ['limit']], {
 canonical: { r: 5, e: 3 },
 draw: R => { let p; do { p = { r: R.pick([4, 5, 10]), e: R.except(-4, 9, [0]) }; } while (p.e === p.r || p.e === -p.r || !Number.isInteger(100 * (p.r + p.e) / (2 * p.r))); return p; },
 build: ({ r, e }) => { const B = e - r, C = -r * e, R2 = r * r, L = (r + e) / (2 * r), top = `x² ${trm(B, 'x')} ${cst(C)}`, fac = `x ${cst(e)}`; return {
  prompt: `The tracking station compares two dish readings with the ratio N(x) = (${top}) ÷ (x² − ${n(R2)}). At x = ${n(r)} both the top and the bottom are 0. Factor the top and the bottom, cancel the factor they share, and find the limit of N(x) as x approaches ${n(r)}. Enter the number e with ${top} = (x − ${n(r)})(x + e), then the limit.`,
  answer: [e, L],
  hints: ['The bottom is a difference of two squares, so it splits into two factors that differ only in a sign.', `After cancelling x − ${n(r)}, what is left on the top and what is left on the bottom are both ordinary numbers at x = ${n(r)}: divide them.`],
  solution: `At x = ${n(r)} the top is ${n(R2)} ${cst(B * r)} ${cst(C)} = 0 and the bottom is ${n(R2)} − ${n(R2)} = 0. The numbers −${n(r)} and ${n(e)} multiply to ${n(C)} and add to ${n(B)}, so ${top} = (x − ${n(r)})(${fac}), and e = ${n(e)}. The bottom is a difference of two squares: x² − ${n(R2)} = (x − ${n(r)})(x + ${n(r)}). For every x other than ${n(r)}, N(x) = (${fac}) ÷ (x + ${n(r)}). As x approaches ${n(r)} this approaches (${n(r)} ${cst(e)}) ÷ (${n(r)} + ${n(r)}) = ${n(r + e)} ÷ ${n(2 * r)} = ${n(L)}.`,
  guidance: [
   { prompt: `${top} = (x − ${n(r)})(x + e). What is e?`, answer: [e], explanation: `e has to multiply with −${n(r)} to give ${n(C)} and add to −${n(r)} to give ${n(B)}: e = ${n(e)}.` },
   { prompt: `The bottom is x² − ${n(R2)} = (x − ${n(r)})(x + s). What is s?`, answer: [r], explanation: `s × (−${n(r)}) has to be −${n(R2)}, and the x terms have to cancel, so s = ${n(r)}: the two factors differ only in a sign.` },
   { prompt: `After cancelling x − ${n(r)}, N(x) = (${fac}) ÷ (x + ${n(r)}). What does it approach as x approaches ${n(r)}?`, answer: [L], explanation: `(${n(r)} ${cst(e)}) ÷ (${n(r)} + ${n(r)}) = ${n(r + e)} ÷ ${n(2 * r)} = ${n(L)}. The hole in the graph sits at height ${n(L)}.` }
  ] }; }
});
})();
