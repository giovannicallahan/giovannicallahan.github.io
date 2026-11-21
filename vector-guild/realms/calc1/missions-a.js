/* Calculus 1 missions, file a: q01–q10 (docs/CALC1-PLAN.md lists the concepts). q01 is the worked sample.
   Mission objects as described in docs/PACK-FORMAT.md ("Mission"). Generators: gen-a.js (build(canonical) reproduces
   the prompt, hints, solution and guidance here exactly); experiments: experiments-a.js; drill statements:
   variants-a.js; oracles: qa/realms/calc1/oracle-a.js. */
(function(){
'use strict';
/* OpenStax Calculus Volume 1 sections. Open each page before you set `verified` to the date you saw it. */
const source = {
 s2_1: { title: 'OpenStax Calculus Volume 1 — 2.1 A Preview of Calculus', url: 'https://openstax.org/books/calculus-volume-1/pages/2-1-a-preview-of-calculus', description: 'The slope of a secant line as a rate of change over an interval, and average velocity.', verified: '2026-11-21' },
 s2_2: { title: 'OpenStax Calculus Volume 1 — 2.2 The Limit of a Function', url: 'https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function', description: 'Limits read from tables of values, one-sided limits, and infinite limits with vertical asymptotes.', verified: '2026-11-21' },
 s2_3: { title: 'OpenStax Calculus Volume 1 — 2.3 The Limit Laws', url: 'https://openstax.org/books/calculus-volume-1/pages/2-3-the-limit-laws', description: 'The limit laws, direct substitution, and limits of the form 0 ÷ 0 found by factoring and cancelling.', verified: '2026-11-21' },
 s2_4: { title: 'OpenStax Calculus Volume 1 — 2.4 Continuity', url: 'https://openstax.org/books/calculus-volume-1/pages/2-4-continuity', description: 'Continuity at a point, kinds of discontinuity, and the Intermediate Value Theorem.', verified: '2026-11-21' },
 s4_6: { title: 'OpenStax Calculus Volume 1 — 4.6 Limits at Infinity and Asymptotes', url: 'https://openstax.org/books/calculus-volume-1/pages/4-6-limits-at-infinity-and-asymptotes', description: 'Limits as x grows without bound and horizontal asymptotes of rational functions.', verified: '2026-11-21' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: 'Clocking the supply shuttle', topic: 'Average rate of change', tier: 'Basic', sector: 'Tracking Station',
  brief: 'A supply shuttle is climbing away from the pad, and flight control wants one number for how fast it gained height over a stretch of the climb.',
  lesson: 'The average rate of change over an interval is the change in the output divided by the change in the input.',
  prompt: 'The tracking station models a supply shuttle’s height as h(t) = 3t² + 10t metres, where t is the number of seconds since lift-off. Over the interval from t = 2 to t = 6, enter the change in height in metres, then the average rate of change of the height in metres per second.',
  answer: [136, 34], labels: ['change in height (m)', 'average rate (m/s)'], tolerance: 0.01,
  hints: [
   'Put the start time and the end time of the interval into h(t), one at a time, to get the two heights.',
   'The average rate of change is the change in height divided by the change in time: (h(6) − h(2)) ÷ (6 − 2).'
  ],
  solution: 'h(2) = 3 × 4 + 10 × 2 = 32 and h(6) = 3 × 36 + 10 × 6 = 168. The change in height is Δh = 168 − 32 = 136 metres, and the change in time is Δt = 6 − 2 = 4 seconds. The average rate of change is 136 ÷ 4 = 34 metres per second.',
  xp: 100, prereqs: [],
  artifact: { name: 'Tracking log, page one', description: 'Two readings and the first rate of change worked out from them.' },
  sources: [source.s2_1],
  teaching: {
   intuition: 'A rate of change says how fast one quantity changes while another one changes. Speed is the everyday example: distance covered, divided by the time it took. A climbing shuttle keeps getting faster, so it has no single speed, but we can still ask for one fair number over a stretch of time: the total change, divided by the time that passed. That number is the average rate of change over the interval, which is the stretch from the starting moment to the ending moment. We write Δ, the Greek letter delta, for “the change in”, so for a height h and a time t the average rate of change is Δh ÷ Δt. On a graph, it is the slope of the straight line through the two end points. That line is called a secant line.',
   steps: [
    'Work out the value of the function at the start of the interval and at the end.',
    'Subtract to get the change in the output: Δh is the value at the end minus the value at the start.',
    'Subtract to get the change in the input: Δt is the end time minus the start time.',
    'Divide: the average rate of change is Δh ÷ Δt. Its unit is the output unit per input unit, such as metres per second.'
   ],
   example: {
    prompt: 'A rover’s distance from the garage is d(t) = t² + 4t metres after t seconds. What is the average rate of change of its distance from t = 1 to t = 3?',
    steps: [
     'The two distances: d(1) = 1 + 4 = 5 and d(3) = 9 + 12 = 21.',
     'The changes: Δd = 21 − 5 = 16 metres and Δt = 3 − 1 = 2 seconds.',
     'Divide: 16 ÷ 2 = 8.'
    ],
    answer: '8 metres per second.'
   },
   pitfalls: [
    'Dividing by the end time instead of the change in time: from t = 3 to t = 8 the time that passes is 5 seconds, not 8.',
    'Subtracting in opposite orders on the top and on the bottom. Take end minus start both times, or the sign comes out wrong.',
    'Averaging the two heights. An average rate of change is a change divided by a time, not the middle of two values.'
   ]
  },
  guidance: [
   { prompt: 'Put the two times into h(t) = 3t² + 10t. What are h(2) and h(6)?', answer: [32, 168], labels: ['h at the start (m)', 'h at the end (m)'], explanation: 'h(2) = 3 × 4 + 10 × 2 = 32 and h(6) = 3 × 36 + 10 × 6 = 168.' },
   { prompt: 'The height goes from 32 m to 168 m while the time goes from t = 2 to t = 6. What are the change in height Δh and the change in time Δt?', answer: [136, 4], labels: ['Δh (m)', 'Δt (s)'], explanation: 'Δh = 168 − 32 = 136 metres and Δt = 6 − 2 = 4 seconds. Both are end minus start.' },
   { prompt: 'Divide the change in height by the change in time. What is 136 ÷ 4?', answer: [34], labels: ['average rate (m/s)'], explanation: '136 ÷ 4 = 34, so over this interval the shuttle gained 34 metres of height per second on average.' }
  ]
 },
 {
  id: 'q02', title: 'Catching the rover mid-stride', topic: 'Instantaneous rate of change', tier: 'Basic', sector: 'Tracking Station',
  brief: 'The dish has to point where the rover is heading, so the crew wants the rover’s speed at one exact moment, not over a stretch.',
  lesson: 'Average rates of change over shorter and shorter intervals settle on one number: the instantaneous rate of change at that moment.',
  prompt: 'A tracking dish follows a rover whose distance from the dish is d(t) = 2t² + 5t metres, t seconds after it sets off. Enter the average rate of change of its distance from t = 3 to t = 4, then from t = 3 to t = 3.1, then the instantaneous rate of change at t = 3: the whole number these averages settle on as the interval shrinks. All three are in metres per second.',
  answer: [19, 17.2, 17], labels: ['average over 1 s (m/s)', 'average over 0.1 s (m/s)', 'instantaneous rate (m/s)'], tolerance: 0.005,
  hints: [
   'From t = 3 to t = 3.1 the change in time is only 0.1 seconds, so the average rate is (d(3.1) − d(3)) ÷ 0.1.',
   'Shrink the interval once more, to the 0.01 seconds from t = 3 to t = 3.01, and compare the three averages: the part that shrinks with the interval is disappearing, and what stays is the instantaneous rate.'
  ],
  solution: 'd(3) = 33, d(4) = 52 and d(3.1) = 34.72. From t = 3 to t = 4 the average rate is (52 − 33) ÷ 1 = 19 m/s. From t = 3 to t = 3.1 it is (34.72 − 33) ÷ 0.1 = 1.72 ÷ 0.1 = 17.2 m/s. Over 0.01 seconds, d(3.01) = 33.1702, so the average rate is (33.1702 − 33) ÷ 0.01 = 17.02 m/s. The amount above 17 goes 2, 0.2, 0.02: ten times smaller each time the interval is. The averages settle on 17, so the instantaneous rate of change at t = 3 is 17 metres per second.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Tracking log, page two', description: 'A column of averages over shrinking intervals, settling on one rate.' },
  sources: [source.s2_1],
  teaching: {
   intuition: 'An average rate of change smooths a whole stretch into one number. A rover that keeps speeding up is slower than that average at the start of the stretch and faster at the end, so the average hides what happens at any single moment. The cure is to make the stretch short. Over one second the rover’s speed changes a fair amount; over a tenth of a second it barely changes; over a hundredth it hardly changes at all. So as the interval shrinks towards the single moment, the average rates stop wandering and settle on one number. That number is the instantaneous rate of change: the rate at one instant, the reading a speedometer would show. We cannot simply use an interval of zero length, because the change in distance and the change in time would both be 0, and 0 ÷ 0 says nothing. That is why we close in on the instant through ever shorter intervals instead of landing on it. On a graph, the secant line through the moment and a nearby point swings round and settles into one slope as the nearby point slides in.',
   steps: [
    'Pick the moment t = c and work out the output there.',
    'Work out the average rate of change from c to a slightly later time, such as c + 1, c + 0.1 and c + 0.01, dividing each change in output by the change in time: 1, 0.1 or 0.01.',
    'Compare the averages. The part that depends on the length of the interval shrinks as the interval shrinks.',
    'The number the averages settle on is the instantaneous rate of change at t = c. Its unit is the output unit per input unit, as for an average rate.'
   ],
   example: {
    prompt: 'A drone’s height is h(t) = t² + 3t metres after t seconds. Estimate its instantaneous rate of change at t = 1.',
    steps: [
     'The heights: h(1) = 4, h(2) = 10, h(1.1) = 1.21 + 3.3 = 4.51 and h(1.01) = 1.0201 + 3.03 = 4.0501.',
     'The average rates: (10 − 4) ÷ 1 = 6, then (4.51 − 4) ÷ 0.1 = 5.1, then (4.0501 − 4) ÷ 0.01 = 5.01.',
     'The amount above 5 goes 1, 0.1, 0.01, shrinking with the interval, so the averages settle on 5.'
    ],
    answer: '5 metres per second at t = 1.'
   },
   pitfalls: [
    'Dividing by 1 out of habit. Over the interval from t = 5 to t = 5.1 the change in time is 0.1, so the change in distance is divided by 0.1, which multiplies it by 10.',
    'Rounding the distances before subtracting. The change over a short interval is small, so a rounded value can wipe it out; keep every decimal.',
    'Taking the average over the first, longest interval as the rate at the instant. That average still includes all the speeding up during the interval.'
   ]
  },
  guidance: [
   { prompt: 'Start with the one-second interval. What are d(3) and d(4), and the average rate of change between them?', answer: [33, 52, 19], labels: ['d at the start (m)', 'd one second later (m)', 'average rate (m/s)'], explanation: 'd(3) = 2 × 9 + 5 × 3 = 33 and d(4) = 2 × 16 + 5 × 4 = 52. The change in time is 1 second, so the average rate is 19 ÷ 1 = 19 m/s.' },
   { prompt: 'Shrink the interval to 0.1 seconds, from t = 3 to t = 3.1. What is d(3.1), and what is the average rate (d(3.1) − d(3)) ÷ 0.1?', answer: [34.72, 17.2], labels: ['d after 0.1 s (m)', 'average rate (m/s)'], explanation: 'd(3.1) = 2 × 9.61 + 5 × 3.1 = 34.72. The change in distance is 34.72 − 33 = 1.72 metres, and 1.72 ÷ 0.1 = 17.2 m/s.' },
   { prompt: 'Shrink it again, to 0.01 seconds: d(3.01) = 33.1702. What is the average rate (33.1702 − 33) ÷ 0.01?', answer: [17.02], labels: ['average rate (m/s)'], explanation: '33.1702 − 33 = 0.1702, and dividing by 0.01 is the same as multiplying by 100: 17.02 m/s.' },
   { prompt: 'The averages are 19, 17.2 and 17.02. Which whole number are they closing in on?', answer: [17], labels: ['instantaneous rate (m/s)'], explanation: 'Each time the interval gets ten times shorter, the part above 17 gets ten times smaller: 2, then 0.2, then 0.02. Shrinking the interval further takes that part as close to 0 as you like, so the instantaneous rate of change at t = 3 is 17 m/s.' }
  ]
 },
 {
  id: 'q03', title: 'The dish that divides by zero', topic: 'The limit of a function', tier: 'Basic', sector: 'Tracking Station',
  brief: 'The dish’s calibration formula breaks down at exactly the setting the crew needs, and Mira wants a value they can trust there anyway.',
  lesson: 'The limit of f(x) as x approaches a number is the value f(x) closes in on from both sides; f need not even have a value at that number.',
  prompt: 'The tracking station calibrates its dish with f(x) = (x³ − 8) ÷ (x − 2). At x = 2 the formula gives 0 ÷ 0, which has no value, so the engineers look at inputs close to 2. They have already found f(1.99) = 11.9401 and f(2.01) = 12.0601. Enter f(1.9) and f(2.1), then the limit of f(x) as x approaches 2, which is a whole number.',
  answer: [11.41, 12.61, 12], labels: ['f a tenth to the left', 'f a tenth to the right', 'limit'], tolerance: 0.0005,
  hints: [
   'To find f(1.9), cube 1.9, subtract 8, then divide by 1.9 − 2, which is −0.1.',
   'Line up the four values in order of x: f(1.9), f(1.99), f(2.01), f(2.1). The limit is the number they close in on from both sides.'
  ],
  solution: '1.9³ = 6.859, so f(1.9) = (6.859 − 8) ÷ (−0.1) = −1.141 ÷ (−0.1) = 11.41. 2.1³ = 9.261, so f(2.1) = (9.261 − 8) ÷ 0.1 = 1.261 ÷ 0.1 = 12.61. From the left the values are 11.41 and then 11.9401; from the right 12.61 and then 12.0601. Both sides close in on 12, so lim x→2 f(x) = 12, even though f(2) itself has no value.',
  xp: 100, prereqs: ['q02'],
  artifact: { name: 'Calibration table', description: 'Values creeping in from both sides towards one number.' },
  sources: [source.s2_2],
  teaching: {
   intuition: 'Some formulas break at a single point. f(x) = (x² − 9) ÷ (x − 3) gives 0 ÷ 0 at x = 3, which has no value, yet everywhere near 3 it behaves perfectly well. Put in 2.9 and you get 5.9; put in 3.01 and you get 6.01. The outputs are homing in on 6 from both sides, and they get as close to 6 as you like once x is close enough to 3. That target is called the limit. We write lim x→3 f(x) = 6 and read it “the limit of f(x) as x approaches 3 is 6”. The arrow → means “approaches”: x comes as close to 3 as we like but never has to equal it. This is the same move as with the shrinking intervals of the last mission: we could not use an interval of zero length, so we watched where the averages were heading. A limit is about where the values are heading, not about the value at the point itself, which may not exist.',
   steps: [
    'Choose inputs closer and closer to the number from the left, such as 4.9 and 4.99 when the number is 5, and from the right, such as 5.1 and 5.01.',
    'Work out f at each of them and write them in a table in order of x.',
    'Look at both sides. If the outputs on the left and on the right close in on the same number, that number is the limit.',
    'Write the result as lim x→a f(x) = L. Do not use the value at the number itself; the limit does not look at it.'
   ],
   example: {
    prompt: 'g(x) = (x² − 25) ÷ (x − 5). Find the limit of g(x) as x approaches 5 from a table of values.',
    steps: [
     'From the left: g(4.9) = (24.01 − 25) ÷ (−0.1) = 9.9 and g(4.99) = (24.9001 − 25) ÷ (−0.01) = 9.99.',
     'From the right: g(5.1) = (26.01 − 25) ÷ 0.1 = 10.1 and g(5.01) = (25.1001 − 25) ÷ 0.01 = 10.01.',
     'Both sides close in on 10.'
    ],
    answer: 'lim x→5 g(x) = 10, although g(5) itself has no value.'
   },
   pitfalls: [
    'Putting the number itself into the formula, getting 0 ÷ 0, and deciding the limit is 0 or does not exist. The limit comes from the nearby inputs, not from the point.',
    'Checking only one side. The values must close in on the same number from the left and from the right.',
    'Dividing by 0.1 when the bottom is −0.1. Left of the number, x minus that number is negative, and the two minus signs cancel.'
   ]
  },
  guidance: [
   { prompt: 'Start on the left of 2. What is 1.9³, and what is f(1.9) = (1.9³ − 8) ÷ (−0.1)?', answer: [6.859, 11.41], labels: ['cube', 'f on the left'], explanation: '1.9 × 1.9 × 1.9 = 6.859. Then 6.859 − 8 = −1.141, and dividing by −0.1 gives 11.41.' },
   { prompt: 'Now the right of 2. What is 2.1³, and what is f(2.1) = (2.1³ − 8) ÷ 0.1?', answer: [9.261, 12.61], labels: ['cube', 'f on the right'], explanation: '2.1 × 2.1 × 2.1 = 9.261. Then 9.261 − 8 = 1.261, and dividing by 0.1 gives 12.61.' },
   { prompt: 'From the left: 11.41, 11.9401. From the right: 12.61, 12.0601. What whole number do both sides close in on?', answer: [12], labels: ['limit'], explanation: 'The left values creep up and the right values creep down towards 12, and the gap shrinks as x gets closer to 2. So the limit as x approaches 2 is 12.' }
  ]
 },
 {
  id: 'q04', title: 'Signal strength by the rules', topic: 'Limit laws and direct substitution', tier: 'Basic', sector: 'Tracking Station',
  brief: 'Mira wants the signal strength the station is heading towards as the dial nears a setting, worked out without a table.',
  lesson: 'Limits respect sums, differences, constant multiples, products, powers and quotients, so for a formula whose bottom does not approach 0 the limit is found by direct substitution.',
  prompt: 'The tracking station models a signal’s strength as S(x) = (2x² + 12) ÷ (x + 2). Use the limit laws to find the limit of S(x) as x approaches 3: enter the limit of the top, then the limit of the bottom, then the limit of S(x).',
  answer: [30, 5, 6], labels: ['limit of the top', 'limit of the bottom', 'limit of S(x)'], tolerance: 0.01,
  hints: [
   'The top is a sum, so its limit is the limit of 2x² plus the limit of the constant 12. By the power law, x² approaches 3² as x approaches 3.',
   'The bottom does not approach 0, so the quotient law applies: divide the limit of the top by the limit of the bottom.'
  ],
  solution: 'By the power law x² approaches 3² = 9, so by the constant multiple law 2x² approaches 2 × 9 = 18. A constant stays put, so by the sum law the top approaches 18 + 12 = 30. The bottom approaches 3 + 2 = 5, which is not 0. By the quotient law the limit is 30 ÷ 5 = 6. This is exactly what direct substitution of x = 3 gives.',
  xp: 100, prereqs: ['q03'],
  artifact: { name: 'Rulebook of limits', description: 'A handful of short laws that turn a table of values into one substitution.' },
  sources: [source.s2_3],
  teaching: {
   intuition: 'Tables of values work, but they are slow, and the limit laws let us skip them. They say limits behave the way you would hope. If x approaches 5, then x² approaches 25, because squaring numbers near 5 gives numbers near 25: that is the power law. Multiplying by a constant multiplies the limit (the constant multiple law), adding two quantities adds their limits (the sum law), subtracting subtracts their limits (the difference law), multiplying two quantities multiplies their limits (the product law), and a constant just stays what it is. Dividing divides the limits too, as long as the limit of the bottom is not 0 (the quotient law); dividing by something that approaches 0 is exactly where things can go wrong. Put together, for a formula built from these pieces the limit is what you get by simply putting the number in. That shortcut is called direct substitution. It fails only where substituting breaks, such as a bottom that approaches 0, and the next mission deals with that case.',
   steps: [
    'Check the bottom first: work out its limit. If it is not 0, the quotient law may be used.',
    'Find the limit of the top piece by piece: powers by the power law, a number times a term by the constant multiple law, and terms added together by the sum law.',
    'Divide the limit of the top by the limit of the bottom.',
    'Notice that the result is what putting the number straight into the formula gives: that is direct substitution.'
   ],
   example: {
    prompt: 'Find the limit of (x² + 5) ÷ (x + 1) as x approaches 4.',
    steps: [
     'The bottom approaches 4 + 1 = 5, which is not 0, so the quotient law applies.',
     'The top: x² approaches 16, so x² + 5 approaches 21.',
     'Divide the limits: 21 ÷ 5 = 4.2.'
    ],
    answer: '4.2, the same as putting x = 4 straight into the formula.'
   },
   pitfalls: [
    'Using the quotient law when the bottom approaches 0. Then the laws say nothing, and another method is needed.',
    'Multiplying before squaring: 2x² at x = 5 is 2 × 25 = 50, not 10² = 100.',
    'Thinking the limit laws and substitution could disagree. Where the bottom does not approach 0 they give the same number; the laws are the reason substitution works.'
   ]
  },
  guidance: [
   { prompt: 'What does the top, 2x² + 12, approach as x approaches 3?', answer: [30], labels: ['limit of the top'], explanation: '2 × 3² = 2 × 9 = 18, and 18 + 12 = 30.' },
   { prompt: 'What does the bottom, x + 2, approach?', answer: [5], labels: ['limit of the bottom'], explanation: '3 + 2 = 5. It is not 0, so the quotient law may be used.' },
   { prompt: 'Divide the two limits. What is 30 ÷ 5?', answer: [6], labels: ['limit of S(x)'], explanation: '30 ÷ 5 = 6, so the signal strength approaches 6 as x approaches 3.' }
  ]
 },
 {
  id: 'q05', title: 'The hole in the slip log', topic: 'Limits at a hole: factor and cancel', tier: 'Basic', sector: 'Tracking Station',
  brief: 'The wheel-slip formula gives 0 ÷ 0 at the very reading the rover runs at, and the crew needs the value it is heading for.',
  lesson: 'When direct substitution gives 0 ÷ 0, factor the top, cancel the factor it shares with the bottom, and substitute into what is left.',
  prompt: 'The tracking station logs a rover’s wheel slip with g(x) = (x² + x − 12) ÷ (x − 3). At x = 3 the top and the bottom are both 0. The top factors as (x − 3)(x + k). Enter k, then the limit of g(x) as x approaches 3.',
  answer: [4, 7], labels: ['k', 'limit'], tolerance: 0.01,
  hints: [
   'Look for two numbers that multiply to −12 and add to 1. One of them is −3, because x − 3 is a factor.',
   'Cancel the shared factor x − 3: that is allowed because x comes close to 3 without ever equalling it. Then put x = 3 into what is left.'
  ],
  solution: 'At x = 3 the top is 9 + 3 − 12 = 0 and the bottom is 3 − 3 = 0, so direct substitution gives 0 ÷ 0, which tells us nothing. The numbers −3 and 4 multiply to −12 and add to 1, so x² + x − 12 = (x − 3)(x + 4), and k = 4. For every x other than 3, g(x) = (x − 3)(x + 4) ÷ (x − 3) = x + 4. As x approaches 3, x + 4 approaches 3 + 4 = 7, so the limit is 7.',
  xp: 100, prereqs: ['q04'],
  artifact: { name: 'Slip log, patched', description: 'A formula with one missing point, and the height of the hole.' },
  sources: [source.s2_3],
  teaching: {
   intuition: 'When putting the number in gives 0 ÷ 0, the formula is not broken everywhere, only at that single point. If a polynomial on the top of a fraction is 0 at x = 5, then 5 is a root of the top, so x − 5 is one of its factors, just as x² + bx + c with roots r and s factors as (x − r)(x − s). The bottom here is x − 5 itself, so the top and the bottom share that factor. For every x other than 5, the shared factor divides out to 1, and the fraction equals a simpler formula. The two formulas agree everywhere except at x = 5 itself, and a limit never looks at x = 5 itself, only at inputs near it. So the two have the same limit, and the simpler formula has no trouble: substitute directly. On a graph the original is the simpler graph with one point missing, a hole, and the limit is the height of the hole.',
   steps: [
    'Substitute first. If you get a number over a number that is not 0, that is the limit. If you get 0 ÷ 0, go on.',
    'Factor the top. Because it is 0 at x = a, one factor is x − a: look for two numbers that multiply to the constant term and add to the number in front of x, one of them being −a.',
    'Cancel the factor x − a from the top and the bottom. This is allowed because x approaches a without ever equalling it.',
    'Substitute x = a into the simpler formula that is left.'
   ],
   example: {
    prompt: 'Find the limit of (x² − 4) ÷ (x − 2) as x approaches 2.',
    steps: [
     'Substituting gives (4 − 4) ÷ (2 − 2) = 0 ÷ 0, so go on.',
     'Factor the top: x² − 4 = (x − 2)(x + 2).',
     'Cancel x − 2, leaving x + 2, which approaches 2 + 2 = 4.'
    ],
    answer: 'The limit is 4.'
   },
   pitfalls: [
    'Reading 0 ÷ 0 as 0, or as “no limit”. It only means substitution failed; the limit may well be an ordinary number.',
    'Cancelling terms instead of factors: (x² − 2x − 8) ÷ (x − 4) is not x² − 2x + 2. Only a factor that multiplies the whole top can be cancelled.',
    'Pairing with the wrong sign. The factor x − a carries −a, so the other number must multiply with −a to give the constant term.'
   ]
  },
  guidance: [
   { prompt: 'Try direct substitution first. What are the top and the bottom of g at x = 3?', answer: [0, 0], labels: ['top', 'bottom'], explanation: 'The top is 9 + 3 − 12 = 0 and the bottom is 3 − 3 = 0. 0 ÷ 0 has no value, so the limit needs another route.' },
   { prompt: 'x² + x − 12 = (x − 3)(x + k). What is k?', answer: [4], labels: ['k'], explanation: 'k has to multiply with −3 to give −12 and add to −3 to give 1: k = 4. Check: (x − 3)(x + 4) = x² + x − 12.' },
   { prompt: 'After cancelling x − 3, g(x) = x + 4 near x = 3. What does it approach as x approaches 3?', answer: [7], labels: ['limit'], explanation: '3 + 4 = 7. The hole in the graph sits at height 7, and that height is the limit.' }
  ]
 },
 {
  id: 'q06', title: 'The beacon that switches modes', topic: 'One-sided limits and jumps', tier: 'Basic', sector: 'Tracking Station',
  brief: 'The beacon changes formula partway through each pulse, and Mira suspects its signal leaps at the switch.',
  lesson: 'A one-sided limit looks at inputs from one side only; the two-sided limit exists only when the left-hand and right-hand limits agree.',
  prompt: 'A beacon’s signal is modelled in two pieces: s(t) = (t² + 3t − 10) ÷ (t − 2) for t < 2, and s(t) = 4t + 3 for t ≥ 2. Enter the left-hand limit of s(t) as t approaches 2, then the right-hand limit, then the jump: the right-hand limit minus the left-hand limit (negative if the signal drops).',
  answer: [7, 11, 4], labels: ['left-hand limit', 'right-hand limit', 'jump'], tolerance: 0.01,
  hints: [
   'From the left, t stays below 2, so only the first piece counts. It gives 0 ÷ 0 at t = 2, so factor the top and cancel t − 2 first.',
   'From the right, only the second piece counts, and it has no trouble at t = 2: use direct substitution.'
  ],
  solution: 'For t < 2: t² + 3t − 10 = (t − 2)(t + 5), so s(t) = t + 5, which approaches 2 + 5 = 7. So lim t→2⁻ s(t) = 7. For t ≥ 2: s(t) = 4t + 3 approaches 4 × 2 + 3 = 11, so lim t→2⁺ s(t) = 11. The jump is 11 − 7 = 4. The two one-sided limits differ, so the two-sided limit of s(t) as t approaches 2 does not exist.',
  xp: 100, prereqs: ['q05'],
  artifact: { name: 'Beacon trace', description: 'Two pieces of a signal that fail to meet at the switch.' },
  sources: [source.s2_2],
  teaching: {
   intuition: 'So far the values closed in on the same number from both sides. A device that switches from one formula to another can break that. Approaching the switch time from below, only the first formula is in use, so the values close in on whatever the first formula is heading for. Approaching from above, only the second formula is in use. Each of these is a one-sided limit. We write lim t→a⁻ for the left-hand limit, which uses only inputs below a (the small minus sign), and lim t→a⁺ for the right-hand limit, which uses only inputs above a (the small plus sign). If the two agree, the ordinary limit exists and equals them. If they differ, the graph jumps at a, and the two-sided limit does not exist, because there is no single number the values close in on. Each one-sided limit is found with the tools of this chapter: direct substitution, or factoring and cancelling when a piece gives 0 ÷ 0.',
   steps: [
    'Decide which piece of the formula is in use on each side of the switch point a.',
    'Left-hand limit: use the piece for inputs below a. Substitute, or factor and cancel first if it gives 0 ÷ 0.',
    'Right-hand limit: use the piece for inputs at or above a, in the same way.',
    'Compare. The jump is the right-hand limit minus the left-hand limit. If it is 0 the two-sided limit exists; otherwise it does not.'
   ],
   example: {
    prompt: 'f(x) = x + 1 for x < 1 and f(x) = 3x for x ≥ 1. Find the one-sided limits at x = 1 and the jump.',
    steps: [
     'From the left, x + 1 approaches 1 + 1 = 2.',
     'From the right, 3x approaches 3 × 1 = 3.',
     'The jump is 3 − 2 = 1, so lim x→1 f(x) does not exist.'
    ],
    answer: 'Left-hand limit 2, right-hand limit 3, jump 1.'
   },
   pitfalls: [
    'Using the wrong piece on a side. The piece marked “for t < a” is the only one that matters from the left, even though the other piece holds at a itself.',
    'Stopping at 0 ÷ 0 on the factored side instead of factoring and cancelling, as in the last mission.',
    'Subtracting in the wrong order. The jump is right minus left, so a drop gives a negative number.'
   ]
  },
  guidance: [
   { prompt: 'Left of 2: factor t² + 3t − 10 as (t − 2)(t + 5) and cancel. What does t + 5 approach as t approaches 2?', answer: [7], labels: ['left-hand limit'], explanation: '2 + 5 = 7, so the left-hand limit is 7.' },
   { prompt: 'Right of 2: what does 4t + 3 approach as t approaches 2?', answer: [11], labels: ['right-hand limit'], explanation: '4 × 2 + 3 = 11, so the right-hand limit is 11.' },
   { prompt: 'What is the right-hand limit minus the left-hand limit, 11 − 7?', answer: [4], labels: ['jump'], explanation: '11 − 7 = 4. The signal jumps up by 4 at t = 2, so it has no two-sided limit there.' }
  ]
 },
 {
  id: 'q07', title: 'Smoothing the pump ramp', topic: 'Continuity at a point', tier: 'Basic', sector: 'Flow Control',
  brief: 'A pump that switches its flow rule mid-run must not jolt the pipes, so the second rule needs a constant that matches the first.',
  lesson: 'A function is continuous at a when f(a) exists, the limit as x approaches a exists, and the two are equal.',
  prompt: 'At Flow Control a pump’s flow rate ramps up and then follows a curve: F(t) = 5t + 2 litres per minute for t < 3, and F(t) = t² + k for t ≥ 3, with t in minutes. Enter the limit of F(t) as t approaches 3 from the left, then the value of k that makes F continuous at t = 3, so the flow has no sudden jump.',
  answer: [17, 8], labels: ['left-hand limit (L/min)', 'k'], tolerance: 0.01,
  hints: [
   'From the left, F(t) = 5t + 2, so its limit comes from putting t = 3 into that piece.',
   'At t = 3 the second piece gives F(3) = 9 + k. For F to be continuous this value must match the limit from the left.'
  ],
  solution: 'From the left, F(t) = 5t + 2 approaches 5 × 3 + 2 = 17. From the right, and at t = 3 itself, F(t) = t² + k gives 9 + k. Continuity needs the value and both one-sided limits to agree: 9 + k = 17, so k = 17 − 9 = 8.',
  xp: 100, prereqs: ['q06'],
  artifact: { name: 'Pump ramp, smoothed', description: 'Two flow rules joined without a jolt.' },
  sources: [source.s2_4],
  teaching: {
   intuition: 'A continuous function is one whose graph you can draw without lifting the pen: no holes, no jumps, no breaks. For a pump, being continuous means the flow never leaps from one rate to another in an instant, which is what keeps the pipes from banging. At a single point a, continuity asks for three things. First, f(a) has a value. Second, the limit as x approaches a exists, which means the left-hand and right-hand limits agree. Third, that limit equals f(a). The beacon of the last mission failed the second test, because its one-sided limits differed. When a formula switches at a, the piece on the right usually also gives the value at a itself, so continuity comes down to one equation: the value the left piece is heading for must equal the value the right piece gives at a. If the right piece contains an unknown constant, that equation tells you what the constant must be.',
   steps: [
    'Find the left-hand limit: substitute a into the piece used for inputs below a.',
    'Find the value at a from the piece used for inputs at or above a; it contains the unknown constant k. This is also the right-hand limit.',
    'Set the two equal, because continuity needs them to match.',
    'Solve that equation for k.'
   ],
   example: {
    prompt: 'f(x) = 2x + 1 for x < 3 and f(x) = x² + k for x ≥ 3. Which k makes f continuous at x = 3?',
    steps: [
     'From the left, 2x + 1 approaches 2 × 3 + 1 = 7.',
     'At x = 3 the right piece gives 9 + k.',
     'Continuity needs 9 + k = 7, so k = −2.'
    ],
    answer: 'k = −2.'
   },
   pitfalls: [
    'Setting k equal to the left-hand limit itself. The right piece already has a² in it, so k is only the difference.',
    'Refusing a negative k. If the left piece is heading below a², the constant must pull the right piece down.',
    'Thinking a function is continuous because each piece is. The pieces must also meet where they switch.'
   ]
  },
  guidance: [
   { prompt: 'What does 5t + 2 approach as t approaches 3 from the left?', answer: [17], labels: ['left-hand limit (L/min)'], explanation: '5 × 3 + 2 = 17 litres per minute.' },
   { prompt: 'The second piece is t² + k. What is t² at t = 3?', answer: [9], labels: ['t² at the switch'], explanation: '3² = 9, so F(3) = 9 + k, and the right-hand limit is the same.' },
   { prompt: 'Choose k so that 9 + k = 17. What is k?', answer: [8], labels: ['k'], explanation: 'k = 17 − 9 = 8. Now both pieces meet at 17 litres per minute and the flow is continuous.' }
  ]
 },
 {
  id: 'q08', title: 'Where the brine levels off', topic: 'Limits at infinity and horizontal asymptotes', tier: 'Basic', sector: 'Flow Control',
  brief: 'The mixing tank will run all shift, and the crew wants to know the strength the brine settles at in the long run.',
  lesson: 'As the input grows without bound, a fraction whose top and bottom have the same highest power approaches the ratio of the numbers in front of those highest powers; that level is a horizontal asymptote.',
  prompt: 'A mixing tank at Flow Control starts with weak brine, and stronger brine is pumped in. The salt concentration is c(t) = (30t + 8) ÷ (4t + 2) grams per litre, t minutes after the pump starts. Enter the concentration at t = 0, then the limit of c(t) as t grows without bound: the level of the horizontal asymptote.',
  answer: [4, 7.5], labels: ['concentration at t = 0 (g/L)', 'long-run limit (g/L)'], tolerance: 0.005,
  hints: [
   'At t = 0 every term with t in it is 0, so only the constant terms are left.',
   'Divide the top and the bottom by t: c(t) = (30 + 8 ÷ t) ÷ (4 + 2 ÷ t). As t grows, 8 ÷ t and 2 ÷ t shrink towards 0.'
  ],
  solution: 'c(0) = 8 ÷ 2 = 4 grams per litre. Dividing the top and the bottom by t gives c(t) = (30 + 8 ÷ t) ÷ (4 + 2 ÷ t). As t → ∞, 8 ÷ t → 0 and 2 ÷ t → 0, so c(t) → 30 ÷ 4 = 7.5. The horizontal asymptote is the level 7.5: the concentration climbs towards 7.5 grams per litre without ever quite reaching it.',
  xp: 100, prereqs: ['q04'],
  artifact: { name: 'Brine chart', description: 'A curve flattening out along a level line.' },
  sources: [source.s4_6],
  teaching: {
   intuition: 'Some questions are not about approaching a number but about going on and on: what is the tank like after hours and hours? We write t → ∞ and read it “t grows without bound”. The symbol ∞, infinity, is not a number you can reach; it is shorthand for “bigger than any number you name”. The limit as t → ∞ is the value the outputs settle near once t is large enough. For a fraction like (6t + 1) ÷ (2t + 5), think of t as a million: the top is 6000001 and the bottom is 2000005, and the 1 and the 5 are crumbs next to the t terms. So the fraction is very nearly 6t ÷ 2t = 3. Dividing the top and the bottom by t makes this exact: the fraction becomes (6 + 1 ÷ t) ÷ (2 + 5 ÷ t), and 1 ÷ t and 5 ÷ t shrink towards 0 as t grows. The graph flattens out along the level line y = 3. A line that a graph gets closer and closer to is called an asymptote, and a level one is a horizontal asymptote.',
   steps: [
    'Find the highest power of the input on the top and on the bottom. In this mission they are the same: the input itself.',
    'Divide every term on the top and on the bottom by the input.',
    'Let the input grow: each number divided by it shrinks towards 0 and drops out.',
    'What is left is the number in front of the input on the top divided by the number in front of the input on the bottom. That is the limit at ∞ and the level of the horizontal asymptote.'
   ],
   example: {
    prompt: 'Find the limit of (10x + 4) ÷ (4x − 2) as x → ∞.',
    steps: [
     'Divide the top and the bottom by x: (10 + 4 ÷ x) ÷ (4 − 2 ÷ x).',
     'As x grows, 4 ÷ x and 2 ÷ x approach 0.',
     'The limit is 10 ÷ 4 = 2.5.'
    ],
    answer: 'The limit is 2.5, so y = 2.5 is a horizontal asymptote.'
   },
   pitfalls: [
    'Dividing the constant terms instead of the numbers in front of t. In the long run the constants are crumbs; they matter only near t = 0.',
    'Treating ∞ as a number and putting it into the formula. ∞ ÷ ∞ means nothing; divide by t first.',
    'Expecting the graph to reach the asymptote. Here the concentration gets as close to the level as you like but never equals it.'
   ]
  },
  guidance: [
   { prompt: 'What is c(0)?', answer: [4], labels: ['c(0) (g/L)'], explanation: 'At t = 0 the top is 8 and the bottom is 2, so c(0) = 8 ÷ 2 = 4 grams per litre.' },
   { prompt: 'Divide the top and the bottom by t. When t is huge, the pieces 8 ÷ t and 2 ÷ t are almost 0. Which numbers are left on the top and on the bottom?', answer: [30, 4], labels: ['top', 'bottom'], explanation: '(30t + 8) ÷ t = 30 + 8 ÷ t, which is nearly 30, and (4t + 2) ÷ t = 4 + 2 ÷ t, which is nearly 4.' },
   { prompt: 'So what is the limit of c(t) as t → ∞?', answer: [7.5], labels: ['limit (g/L)'], explanation: '30 ÷ 4 = 7.5. The graph levels off along the horizontal asymptote at 7.5 grams per litre.' }
  ]
 },
 {
  id: 'q09', title: 'The valve that runs away', topic: 'Infinite limits and vertical asymptotes', tier: 'Basic', sector: 'Flow Control',
  brief: 'Near one setting the valve’s pressure reading goes wild, and Mira wants that setting marked and the behaviour on each side measured.',
  lesson: 'Where the bottom of a fraction approaches 0 but the top does not, the values grow without bound and the graph has a vertical asymptote.',
  prompt: 'A valve at Flow Control has the pressure reading P(x) = (2x + 3) ÷ (x − 4), where x is the valve setting. Enter the setting x where P has a vertical asymptote, then P(4.01) and P(3.99). Type the numbers without commas.',
  answer: [4, 1102, -1098], labels: ['asymptote at x =', 'P just right', 'P just left'], tolerance: 0.01,
  hints: [
   'A vertical asymptote sits where the bottom is 0 but the top is not.',
   'At x = 4.01 the bottom is 4.01 − 4 = 0.01, a tiny positive number, and dividing by 0.01 is the same as multiplying by 100.'
  ],
  solution: 'The bottom x − 4 is 0 at x = 4, where the top is 2 × 4 + 3 = 11, not 0, so the line x = 4 is a vertical asymptote. P(4.01) = 11.02 ÷ 0.01 = 1102 and P(3.99) = 10.98 ÷ (−0.01) = −1098. Closer still, the readings grow without bound: as x → 4⁺, P(x) → ∞, and as x → 4⁻, P(x) → −∞.',
  xp: 100, prereqs: ['q06', 'q08'],
  artifact: { name: 'Valve warning tag', description: 'One setting where the readings run off without bound.' },
  sources: [source.s2_2],
  teaching: {
   intuition: 'Divide 7 by smaller and smaller numbers: 7 ÷ 0.1 = 70, 7 ÷ 0.01 = 700, 7 ÷ 0.001 = 7000. When the bottom of a fraction shrinks towards 0 while the top stays near a number that is not 0, the fraction grows without bound. Then no number is the limit, and we write ∞ to say how it fails: lim x→a⁺ f(x) = ∞ means the values climb past any number you name as x comes towards a from the right, and −∞ means they fall below any negative number you name. The side matters. Just right of a, x − a is a tiny positive number; just left of a, it is a tiny negative one, so the two sides usually head off in opposite directions, one up and one down. The graph hugs the upright line x = a without ever touching it. That line is a vertical asymptote. Compare the earlier missions: 0 ÷ 0 at a point is a hole to investigate, but a number that is not 0, divided by something approaching 0, is a wall.',
   steps: [
    'Find where the bottom is 0.',
    'Check the top there. If it is not 0, that input is a vertical asymptote; if it is 0 as well, you may have a hole instead, so factor and cancel.',
    'Test just to the right, at a + 0.01. The bottom is 0.01, so the value is about the top times 100, and its sign tells you whether the right-hand limit is ∞ or −∞.',
    'Test just to the left, at a − 0.01. The bottom is −0.01, so the value is about the top times −100, heading the other way.'
   ],
   example: {
    prompt: 'g(x) = 1 ÷ (x − 2). Where is its vertical asymptote, and what are g(2.01) and g(1.99)?',
    steps: [
     'The bottom is 0 at x = 2 and the top is 1, so x = 2 is a vertical asymptote.',
     'g(2.01) = 1 ÷ 0.01 = 100.',
     'g(1.99) = 1 ÷ (−0.01) = −100.'
    ],
    answer: 'x = 2, with g(2.01) = 100 and g(1.99) = −100: g → ∞ from the right and −∞ from the left.'
   },
   pitfalls: [
    'Calling every zero of the bottom a vertical asymptote. If the top is 0 there too, it can be a hole, as in the factor-and-cancel mission.',
    'Losing the sign on the left. x − a is negative just left of a, so the value flips sign.',
    'Giving a large number such as 5000 as the limit. The values grow without bound, so the limit is ∞, not any number.'
   ]
  },
  guidance: [
   { prompt: 'Where is the bottom, x − 4, equal to 0? (Check that the top is not 0 there.)', answer: [4], labels: ['x'], explanation: 'x − 4 = 0 at x = 4, and the top there is 2 × 4 + 3 = 11, so the vertical asymptote is x = 4.' },
   { prompt: 'Just to the right: at x = 4.01 the top is 11.02 and the bottom is 0.01. What is P(4.01)?', answer: [1102], labels: ['P on the right'], explanation: '11.02 ÷ 0.01 = 11.02 × 100 = 1102.' },
   { prompt: 'Just to the left: at x = 3.99 the top is 10.98 and the bottom is −0.01. What is P(3.99)?', answer: [-1098], labels: ['P on the left'], explanation: '10.98 ÷ (−0.01) = 10.98 × (−100) = −1098. The two sides shoot off in opposite directions.' }
  ]
 },
 {
  id: 'q10', title: 'Trapping the balance point', topic: 'The Intermediate Value Theorem', tier: 'Basic', sector: 'Flow Control',
  brief: 'The valve’s balance opening cannot be solved for exactly, so Mira wants it trapped in a narrow interval instead.',
  lesson: 'If a continuous function is negative at one end of an interval and positive at the other, it is 0 somewhere in between; halving the interval again and again traps that root.',
  prompt: 'Flow Control balances a valve when f(x) = x³ + 2x − 20 is 0, where x is the valve opening in centimetres. f is continuous, f(2) is negative and f(3) is positive, so a root lies between 2 and 3. Halve the interval three times, each time keeping the half whose ends give f opposite signs, and enter the left end and then the right end of the final interval.',
  answer: [2.375, 2.5], labels: ['left end', 'right end'], tolerance: 0.0005,
  hints: [
   'The first midpoint is 2.5. Work out f(2.5): if it is positive, the sign change is in the left half; if it is negative, it is in the right half.',
   'Each halving keeps a piece half as long as before, so the final interval is 0.125 long.'
  ],
  solution: 'f(2) = −8 and f(3) = 13, so by the Intermediate Value Theorem f is 0 somewhere between 2 and 3. f(2.5) is about 0.63, which is positive, so keep 2 to 2.5. f(2.25) is about −4.11, which is negative, so keep 2.25 to 2.5. f(2.375) is about −1.85, which is negative, so keep 2.375 to 2.5. The root lies between 2.375 and 2.5.',
  xp: 100, prereqs: ['q07'],
  artifact: { name: 'Halving gauge', description: 'An interval cut in half three times around a hidden root.' },
  sources: [source.s2_4],
  teaching: {
   intuition: 'Walk from a valley floor below sea level to a hilltop above it, and somewhere you cross sea level: you cannot get from below to above without passing through. The Intermediate Value Theorem says the same about a continuous function on an interval: it takes every value between its values at the two ends. In particular, if f is negative at one end and positive at the other, then f is 0 somewhere in between, at a root. Continuity is essential, since a function with a jump could leap over 0. A polynomial is continuous at every point, because direct substitution always gives its limit, so the theorem applies to it on any interval. The theorem does not say where the root is, but it gives a way to hunt for it. Cut the interval in half at its midpoint and check the sign of f there. One half still has ends where f has opposite signs, so a root is in that half; keep it and throw the other away. Each halving makes the trap half as long, so three halvings shrink an interval of length 1 to length 0.125, and ten would shrink it to about 0.001.',
   steps: [
    'Check the ends: f must be continuous, negative at one end and positive at the other.',
    'Find the midpoint by adding the two ends and dividing by 2, and work out f there.',
    'Keep the half whose two ends give f opposite signs. If f at the midpoint has the same sign as at the left end, keep the right half; otherwise keep the left half. If f at the midpoint is exactly 0, you have found the root and can stop.',
    'Repeat with the interval you kept. The root is always inside it.'
   ],
   example: {
    prompt: 'f(x) = x² − 5 has f(2) = −1 and f(3) = 4. Halve the interval from 2 to 3 twice.',
    steps: [
     'Midpoint 2.5: f(2.5) = 6.25 − 5 = 1.25, which is positive, so keep 2 to 2.5.',
     'Midpoint 2.25: f(2.25) = 5.0625 − 5 = 0.0625, which is positive, so keep 2 to 2.25.'
    ],
    answer: 'The root, √5, about 2.236, lies between 2 and 2.25.'
   },
   pitfalls: [
    'Keeping the wrong half. Compare the sign at the midpoint with the signs at the ends, and keep the half where the sign changes.',
    'Giving the midpoint as the root. The root is somewhere in the final interval, not necessarily at its middle.',
    'Using the theorem on a function with a break. Without continuity, a sign change does not promise a root.'
   ]
  },
  guidance: [
   { prompt: 'Check the ends first. What are f(2) and f(3)?', answer: [-8, 13], labels: ['f at the left end', 'f at the right end'], explanation: 'f(2) = 8 + 4 − 20 = −8 and f(3) = 27 + 6 − 20 = 13. One is negative and one positive, and f is continuous, so it crosses 0 in between.' },
   { prompt: 'First halving: the midpoint is 2.5. Which interval do you keep? Enter its left end, then its right end.', answer: [2, 2.5], labels: ['left end', 'right end'], explanation: 'f(2.5) is about 0.63, which is positive, so keep 2 to 2.5: its ends give f opposite signs.' },
   { prompt: 'Second halving: the midpoint of 2 and 2.5 is 2.25. Which interval do you keep?', answer: [2.25, 2.5], labels: ['left end', 'right end'], explanation: 'f(2.25) is about −4.11, which is negative, so keep 2.25 to 2.5.' },
   { prompt: 'Third halving: the midpoint of 2.25 and 2.5 is 2.375. Which interval do you keep?', answer: [2.375, 2.5], labels: ['left end', 'right end'], explanation: 'f(2.375) is about −1.85, which is negative, so keep 2.375 to 2.5. The root is trapped in an interval 0.125 long.' }
  ]
 }
);
})();
