/* Calculus 1 missions, file d: q31–q40 (docs/CALC1-PLAN.md lists the concepts).
   Mission objects as described in docs/PACK-FORMAT.md ("Mission"); the worked sample is q01 in missions-a.js.
   Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution and guidance here exactly);
   experiments: experiments-d.js; drill statements: variants-d.js; oracles: qa/realms/calc1/oracle-d.js. */
(function(){
'use strict';
/* OpenStax Calculus Volume 1 sections. Open each page before you set `verified` to the date you saw it. */
const source = {
 s4_4: { title: 'OpenStax Calculus Volume 1 — 4.4 The Mean Value Theorem', url: 'https://openstax.org/books/calculus-volume-1/pages/4-4-the-mean-value-theorem', description: 'Rolle’s theorem and the Mean Value Theorem: a point where the tangent is parallel to the secant line.', verified: '2026-11-21' },
 s4_7: { title: 'OpenStax Calculus Volume 1 — 4.7 Applied Optimization Problems', url: 'https://openstax.org/books/calculus-volume-1/pages/4-7-applied-optimization-problems', description: 'Setting up a quantity under a constraint and finding its largest or smallest value with derivatives.', verified: '2026-11-21' },
 s4_8: { title: 'OpenStax Calculus Volume 1 — 4.8 L’Hôpital’s Rule', url: 'https://openstax.org/books/calculus-volume-1/pages/4-8-lhopitals-rule', description: 'Limits of the indeterminate forms 0 ÷ 0 and ∞ ÷ ∞ from the derivatives of the top and the bottom.', verified: '2026-11-21' },
 s4_9: { title: 'OpenStax Calculus Volume 1 — 4.9 Newton’s Method', url: 'https://openstax.org/books/calculus-volume-1/pages/4-9-newtons-method', description: 'Approximating a root by following tangent lines from one guess to the next.', verified: '2026-11-21' },
 s4_10: { title: 'OpenStax Calculus Volume 1 — 4.10 Antiderivatives', url: 'https://openstax.org/books/calculus-volume-1/pages/4-10-antiderivatives', description: 'Antiderivatives, indefinite integrals and initial value problems.', verified: '2026-11-21' },
 s5_1: { title: 'OpenStax Calculus Volume 1 — 5.1 Approximating Areas', url: 'https://openstax.org/books/calculus-volume-1/pages/5-1-approximating-areas', description: 'Left-endpoint and right-endpoint approximations and Riemann sums.', verified: '2026-11-21' },
 s5_2: { title: 'OpenStax Calculus Volume 1 — 5.2 The Definite Integral', url: 'https://openstax.org/books/calculus-volume-1/pages/5-2-the-definite-integral', description: 'The definite integral as a limit of Riemann sums, its notation, and net signed area.', verified: '2026-11-21' },
 s5_3: { title: 'OpenStax Calculus Volume 1 — 5.3 The Fundamental Theorem of Calculus', url: 'https://openstax.org/books/calculus-volume-1/pages/5-3-the-fundamental-theorem-of-calculus', description: 'Evaluating a definite integral from an antiderivative: F(b) − F(a).', verified: '2026-11-21' },
 s5_4: { title: 'OpenStax Calculus Volume 1 — 5.4 Integration Formulas and the Net Change Theorem', url: 'https://openstax.org/books/calculus-volume-1/pages/5-4-integration-formulas-and-the-net-change-theorem', description: 'The net change theorem: a quantity at the end is its starting value plus the integral of its rate of change.', verified: '2026-11-21' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: 'Laying out the seedling bed', topic: 'Optimisation problems', tier: 'Advanced', sector: 'Design Studio',
  brief: 'The greenhouse team has a fixed length of edging and wants the seedling bed that holds the most plants.',
  lesson: 'To optimise, write the quantity as a function of one variable, find where its derivative is zero, and compare with the ends of the allowed interval.',
  prompt: 'The design studio is laying out a rectangular seedling bed against the straight wall of the greenhouse. The wall side needs no edging, and the other three sides use all 60 metres of edging. Let x be the depth of the bed: the length of each of the two sides that meet the wall. Enter the depth x that gives the largest area, then the length of the side along the wall, both in metres, then that largest area in square metres.',
  answer: [15, 30, 450], labels: ['depth x (m)', 'side along the wall (m)', 'largest area (m²)'], tolerance: 0.01,
  hints: [
   'The two depth sides use 2x metres of edging, so the side along the wall is 60 − 2x metres and the area is A(x) = x(60 − 2x).',
   'Expand A(x), differentiate it with the power rule, and set A′(x) = 0 to find the critical point.'
  ],
  solution: 'The side along the wall is 60 − 2x metres, so the area is A(x) = x(60 − 2x) = 60x − 2x². Its derivative is A′(x) = 60 − 4x, which is 0 at x = 60 ÷ 4 = 15. The depth can only run from 0 to 30 metres, and at both ends the area is 0, so this critical point gives the largest area. The side along the wall is 60 − 2 × 15 = 30 metres and the area is 15 × 30 = 450 square metres.',
  xp: 200, prereqs: ['q30'],
  artifact: { name: 'Seedling bed plan', description: 'The one layout that gets the most growing space from a fixed roll of edging.' },
  sources: [source.s4_7],
  teaching: {
   intuition: 'Optimisation means finding the input that makes a quantity as large or as small as possible. Here the edging is fixed, so making the bed deeper leaves less edging for the long side. A very deep bed leaves almost no edging for the side along the wall, and a very shallow bed has a long wall side but almost no depth; both hold little. Somewhere in between, the area stops growing and starts shrinking. At that turning point the graph of the area is flat for an instant, so its slope, the derivative, is zero: that is why a critical point finds the best design. Most of the work is the set-up. Use the fixed total, the constraint, to write the quantity in terms of one variable; then the method for an absolute maximum on a closed interval does the rest.',
   steps: [
    'Name the variable and sketch the shape. Write the constraint, the fixed total, as an equation.',
    'Use the constraint to write the quantity you want at its best as a function of one variable, and note the interval of allowed values.',
    'Differentiate, set the derivative equal to zero and solve for the critical point.',
    'Compare the quantity at the critical point and at the ends of the interval; the best value wins. Then work out any other measurement asked for.'
   ],
   example: {
    prompt: 'A rectangular pen is built against a wall, with 40 metres of fencing on its other three sides. What depth x gives the largest area, and what is that area?',
    steps: [
     'The side along the wall is 40 − 2x, so A(x) = x(40 − 2x) = 40x − 2x², for x from 0 to 20.',
     'A′(x) = 40 − 4x is zero at x = 10. At the ends, A(0) = 0 and A(20) = 0.',
     'A(10) = 10 × 20 = 200, the largest value.'
    ],
    answer: 'A depth of 10 metres, a 20-metre side along the wall and 200 square metres.'
   },
   pitfalls: [
    'Edging all four sides: the wall side needs none, so the constraint is two depths plus the wall side, not a full perimeter.',
    'Stopping at the critical point and forgetting what was asked: the depth is not the area, and the side along the wall is the total minus two depths.',
    'Setting the area itself equal to zero instead of its derivative: A(x) = 0 gives the worst beds, at the ends of the interval.'
   ]
  },
  guidance: [
   { prompt: 'Write the area as A(x) = x(60 − 2x) and multiply out the bracket to get the form bx − cx². What are b and c?', answer: [60, 2], labels: ['b', 'c'], explanation: 'x × 60 = 60x and x × 2x = 2x², so A(x) = 60x − 2x²: b = 60 and c = 2.' },
   { prompt: 'Differentiate A(x) = 60x − 2x² with the power rule and set A′(x) = 0. At what depth x is the derivative zero?', answer: [15], labels: ['depth x (m)'], explanation: 'A′(x) = 60 − 4x. Setting 60 − 4x = 0 gives x = 60 ÷ 4 = 15 metres.' },
   { prompt: 'With a depth of 15 m, what are the length of the side along the wall and the area of the bed?', answer: [30, 450], labels: ['side along the wall (m)', 'area (m²)'], explanation: 'The side along the wall is 60 − 2 × 15 = 30 metres and the area is 15 × 30 = 450 square metres. At a depth of 0 or of 30 metres the area would be 0, so this is the largest.' }
  ]
 },
 {
  id: 'q32', title: 'Checking the rover’s speedometer', topic: 'The Mean Value Theorem', tier: 'Advanced', sector: 'Design Studio',
  brief: 'A prototype rover finished its test run at a known average speed, and the studio wants the moment its speedometer showed exactly that speed.',
  lesson: 'For a smooth function, somewhere inside every interval the instantaneous rate of change equals the average rate of change over the interval.',
  prompt: 'A prototype rover on the studio’s test strip has travelled d(t) = 3t² + 5t metres after t minutes. Over the interval from t = 1 to t = 4, enter its average speed in metres per minute, then the time c inside the interval at which its instantaneous speed equals that average, in minutes.',
  answer: [20, 2.5], labels: ['average speed (m/min)', 'time c (min)'], tolerance: 0.01,
  hints: [
   'The average speed is the change in distance divided by the change in time: (d(4) − d(1)) ÷ (4 − 1).',
   'The instantaneous speed is the derivative, d′(t) = 6t + 5. Set it equal to the average speed and solve for t.'
  ],
  solution: 'd(1) = 3 × 1 + 5 × 1 = 8 and d(4) = 3 × 16 + 5 × 4 = 68, so the average speed is (68 − 8) ÷ 3 = 60 ÷ 3 = 20 metres per minute. The speed at time t is d′(t) = 6t + 5. Setting 6c + 5 = 20 gives 6c = 15, so c = 2.5 minutes, inside the interval as the Mean Value Theorem promises.',
  xp: 200, prereqs: ['q13', 'q15'],
  artifact: { name: 'Speedometer certificate', description: 'Proof that the rover hit its average speed at one exact moment.' },
  sources: [source.s4_4],
  teaching: {
   intuition: 'If you average 60 kilometres per hour on a trip, then at some moment your speedometer read exactly 60. You cannot have been below 60 the whole time, or above it the whole time, and a smoothly changing speed cannot jump over 60 without passing through it. The Mean Value Theorem says the same about any smooth function, one that is continuous on the interval and has a derivative at every point inside it: there is at least one point c strictly inside the interval where the derivative f′(c) equals the average rate of change, (f(b) − f(a)) ÷ (b − a). On the graph, the tangent line at c is parallel to the secant line through the two ends. The theorem promises that such a c exists; to find it, set the derivative equal to the average rate and solve.',
   steps: [
    'Work out the function at the two ends of the interval.',
    'Divide the change in value by the length of the interval: that is the average rate of change, the slope of the secant line.',
    'Differentiate the function and set the derivative at c equal to the average rate.',
    'Solve for c and check that it lies strictly between the two ends.'
   ],
   example: {
    prompt: 'For d(t) = 2t² + 3t on the interval from t = 1 to t = 5, find the time c at which d′(c) equals the average rate of change.',
    steps: [
     'd(1) = 5 and d(5) = 50 + 15 = 65, so the average rate is (65 − 5) ÷ 4 = 15.',
     'd′(t) = 4t + 3. Setting 4c + 3 = 15 gives 4c = 12 and c = 3.'
    ],
    answer: 'c = 3, which lies inside the interval from 1 to 5.'
   },
   pitfalls: [
    'Answering with the average rate when the question asks for the time c at which it is reached.',
    'Assuming c is always the midpoint. It is for a quadratic, but not in general: for t³ from 0 to 3 the average rate is 9 and c = √3, about 1.73, not 1.5.',
    'Using the theorem on a graph with a jump or a sharp corner: there it can fail, because the rate is not smooth.'
   ]
  },
  guidance: [
   { prompt: 'Put the two times into d(t) = 3t² + 5t. What are d(1) and d(4)?', answer: [8, 68], labels: ['d at the start (m)', 'd at the end (m)'], explanation: 'd(1) = 3 × 1 + 5 × 1 = 8 and d(4) = 3 × 16 + 5 × 4 = 68.' },
   { prompt: 'The rover goes from 8 m to 68 m between t = 1 and t = 4. What is its average speed over the interval?', answer: [20], labels: ['average speed (m/min)'], explanation: '(68 − 8) ÷ (4 − 1) = 60 ÷ 3 = 20 metres per minute. This is the slope of the secant line through the two ends.' },
   { prompt: 'The speed at time t is d′(t) = 6t + 5. At what time c is it equal to 20?', answer: [2.5], labels: ['time c (min)'], explanation: '6c + 5 = 20 gives 6c = 15, so c = 15 ÷ 6 = 2.5 minutes. At that moment the tangent line is parallel to the secant line.' }
  ]
 },
 {
  id: 'q33', title: 'Calibrating the light sensor', topic: 'L’Hôpital’s rule', tier: 'Advanced', sector: 'Design Studio',
  brief: 'The new light sensor’s calibration curve needs a value at zero, where its formula gives nothing but 0 ÷ 0.',
  lesson: 'When a limit of a fraction has the form 0 ÷ 0, it equals the limit of (derivative of the top) ÷ (derivative of the bottom), provided that second limit exists.',
  prompt: 'The studio calibrates a light sensor with the limit of (e^(3x) − 1) ÷ sin(2x) as x approaches 0, with x in radians. Putting in x = 0 gives 0 ÷ 0, so use L’Hôpital’s rule. Enter the derivative of the top at x = 0, then the derivative of the bottom at x = 0, then the limit.',
  answer: [3, 2, 1.5], labels: ['top’s derivative at 0', 'bottom’s derivative at 0', 'limit'], tolerance: 0.005,
  hints: [
   'By the chain rule, the derivative of e^(3x) is 3e^(3x), and the derivative of sin(2x) is 2cos(2x).',
   'At x = 0, e⁰ = 1 and cos 0 = 1. The limit is the derivative of the top divided by the derivative of the bottom.'
  ],
  solution: 'At x = 0 the top is e⁰ − 1 = 0 and the bottom is sin 0 = 0, so the limit has the form 0 ÷ 0 and L’Hôpital’s rule applies. The derivative of the top is 3e^(3x), which is 3 × 1 = 3 at x = 0. The derivative of the bottom is 2cos(2x), which is 2 × 1 = 2 at x = 0. The limit is 3 ÷ 2 = 1.5.',
  xp: 200, prereqs: ['q21', 'q22'],
  artifact: { name: 'Sensor calibration card', description: 'The reading at zero that the formula alone could not give.' },
  sources: [source.s4_8],
  teaching: {
   intuition: 'Putting x = 0 into a fraction whose top and bottom both become 0 gives 0 ÷ 0, which is not a number. Such a limit is called indeterminate: depending on the fraction it can come out as anything. Earlier you got past 0 ÷ 0 by factoring and cancelling, but e^(3x) − 1 (e raised to the power 3x, minus 1) cannot be factored like that. Here is the picture behind L’Hôpital’s rule. Very close to 0, each smooth curve looks like its tangent line, so the top is close to (its slope at 0) × x and the bottom is close to (its slope at 0) × x. The x cancels, and the ratio is close to the ratio of the two slopes. So for a 0 ÷ 0 form (or ∞ ÷ ∞), the limit of top ÷ bottom equals the limit of the derivative of the top divided by the derivative of the bottom, as long as that second limit exists. The tangent-line picture covers 0 ÷ 0; the ∞ ÷ ∞ case is true too but needs a longer argument. Each is differentiated on its own; this is not the quotient rule. Sine and cosine take their angle in radians.',
   steps: [
    'Put the number into the top and the bottom. Use the rule only if both are 0, or both grow without bound.',
    'Differentiate the top on its own and the bottom on its own, using the chain rule where one function sits inside another.',
    'Put the number into the two derivatives.',
    'Divide: the limit is the derivative of the top over the derivative of the bottom. If that is 0 ÷ 0 again, apply the rule once more.'
   ],
   example: {
    prompt: 'Find the limit of sin(6x) ÷ (3x) as x approaches 0, with x in radians.',
    steps: [
     'At x = 0 the top is sin 0 = 0 and the bottom is 3 × 0 = 0: the form 0 ÷ 0.',
     'The derivatives are 6cos(6x) and 3. At x = 0 they are 6 and 3.',
     'The limit is 6 ÷ 3 = 2.'
    ],
    answer: 'The limit is 2.'
   },
   pitfalls: [
    'Using the quotient rule on the fraction. L’Hôpital’s rule differentiates the top and the bottom separately.',
    'Applying the rule when the fraction is not 0 ÷ 0: for (x + 3) ÷ (x + 2) at 0 the limit is simply 3 ÷ 2, and the rule would wrongly give 1.',
    'Forgetting the chain rule: the derivative of sin(2x) is 2cos(2x), not cos(2x).'
   ]
  },
  guidance: [
   { prompt: 'Put x = 0 into the top, e^(3x) − 1, and into the bottom, sin(2x). What are the two values?', answer: [0, 0], labels: ['top at 0', 'bottom at 0'], explanation: 'e⁰ − 1 = 1 − 1 = 0 and sin 0 = 0. The fraction has the form 0 ÷ 0, which on its own says nothing about the limit, so L’Hôpital’s rule applies.' },
   { prompt: 'Differentiate the top and the bottom separately, using the chain rule, then put in x = 0. What are the two values?', answer: [3, 2], labels: ['top’s derivative at 0', 'bottom’s derivative at 0'], explanation: 'The top’s derivative is 3e^(3x), which is 3 at x = 0. The bottom’s derivative is 2cos(2x), which is 2 at x = 0.' },
   { prompt: 'L’Hôpital’s rule says the limit equals the limit of the derivatives’ fraction. What is 3 ÷ 2?', answer: [1.5], labels: ['limit'], explanation: '3 ÷ 2 = 1.5. Close to 0 the top behaves like 3x and the bottom like 2x, and their ratio is 1.5.' }
  ]
 },
 {
  id: 'q34', title: 'Sizing the solar panel', topic: 'Newton’s method', tier: 'Advanced', sector: 'Design Studio',
  brief: 'A square solar panel has to cover an exact area, and the cutting machine needs its side length to three decimal places.',
  lesson: 'Newton’s method improves a guess at a root by following the tangent line to where it crosses zero: the new guess is x − f(x) ÷ f′(x).',
  prompt: 'A square solar panel must cover exactly 5 square metres, so its side is the positive root of f(x) = x² − 5. Start Newton’s method from the guess x₀ = 2. Enter the next guess x₁, then the guess after that, x₂, rounded to 3 decimal places.',
  answer: [2.25, 2.236], labels: ['x₁', 'x₂ (3 decimal places)'], tolerance: 0.0005,
  hints: [
   'Newton’s method: x₁ = x₀ − f(x₀) ÷ f′(x₀), and here f′(x) = 2x.',
   'Repeat the same step from x₁ to get x₂, then round it to 3 decimal places.'
  ],
  solution: 'f′(x) = 2x. From x₀ = 2: f(2) = 4 − 5 = −1 and f′(2) = 4, so x₁ = 2 − (−1) ÷ 4 = 2.25. From x₁: f(2.25) = 5.0625 − 5 = 0.0625 and f′(2.25) = 4.5, so x₂ = 2.25 − 0.0625 ÷ 4.5 ≈ 2.2361, which rounds to 2.236. Check: 2.236 × 2.236 is very close to 5.',
  xp: 200, prereqs: ['q10', 'q13'],
  artifact: { name: 'Panel cutting order', description: 'A side length found to three decimals in two tangent-line steps.' },
  sources: [source.s4_9],
  teaching: {
   intuition: 'Many equations cannot be solved exactly by algebra, but a root can be closed in on. Earlier you trapped a root by halving an interval again and again, which is slow. Newton’s method is much faster. Stand on the curve at your guess. Close by, the curve looks like its tangent line, and a straight line’s zero is easy to find: if the height there is f(x₀) and the slope is f′(x₀), the line reaches zero after a sideways step of f(x₀) ÷ f′(x₀). That point is the next guess: x₁ = x₀ − f(x₀) ÷ f′(x₀). The small numbers under the x (x₀, x₁, x₂, read “x nought, x one, x two”) just count the guesses. Then repeat from x₁. Near a root, each step roughly doubles the number of correct decimal places.',
   steps: [
    'Write the equation as f(x) = 0 and find the derivative f′(x).',
    'Work out f and f′ at the current guess.',
    'Take the step: new guess = old guess − f(old guess) ÷ f′(old guess).',
    'Repeat from the new guess until the digits you need stop changing, and round only at the end.'
   ],
   example: {
    prompt: 'Approximate √17 with Newton’s method on f(x) = x² − 17, starting from x₀ = 4. Find x₁ and x₂.',
    steps: [
     'f(4) = 16 − 17 = −1 and f′(4) = 8, so x₁ = 4 − (−1) ÷ 8 = 4.125.',
     'f(4.125) = 17.015625 − 17 = 0.015625 and f′(4.125) = 8.25, so x₂ = 4.125 − 0.015625 ÷ 8.25 ≈ 4.12311.'
    ],
    answer: 'x₁ = 4.125 and x₂ ≈ 4.123; √17 is 4.1231 to four decimal places.'
   },
   pitfalls: [
    'Adding the step instead of subtracting it. The rule is x₁ = x₀ − f(x₀) ÷ f′(x₀); when f(x₀) is negative, subtracting it moves the guess up.',
    'Rounding x₁ before the second step: keep every digit and round only the final answer.',
    'Dividing by x₀ or by f(x₀) alone instead of by the slope f′(x₀) = 2x₀.',
    'Starting where the curve is flat: if f′(x₀) = 0 the tangent line never crosses zero and the step cannot be taken, and a guess far from the root can wander away. Start close to the root, where the slope is not zero.'
   ]
  },
  guidance: [
   { prompt: 'For f(x) = x² − 5 the derivative is f′(x) = 2x. What are f(2) and f′(2)?', answer: [-1, 4], labels: ['f(x₀)', 'f′(x₀)'], explanation: 'f(2) = 4 − 5 = −1 and f′(2) = 2 × 2 = 4.' },
   { prompt: 'Follow the tangent line at x₀ down to where it crosses zero: x₁ = x₀ − f(x₀) ÷ f′(x₀). What is x₁?', answer: [2.25], labels: ['x₁'], explanation: 'x₁ = 2 − (−1) ÷ 4 = 2.25.' },
   { prompt: 'Take one more step from x₁ = 2.25. What is x₂ = x₁ − f(x₁) ÷ f′(x₁), rounded to 3 decimal places?', answer: [2.236], labels: ['x₂ (3 decimal places)'], explanation: 'f(2.25) = 5.0625 − 5 = 0.0625 and f′(2.25) = 4.5, so x₂ = 2.25 − 0.0625 ÷ 4.5 ≈ 2.2361, which rounds to 2.236.' }
  ]
 },
 {
  id: 'q35', title: 'Reading the inflow backwards', topic: 'Antiderivatives', tier: 'Advanced', sector: 'Reservoir',
  brief: 'The holding tank’s meter shows only how fast water flows in, and the reservoir crew wants a formula for how much is inside.',
  lesson: 'An antiderivative of f is a function whose derivative is f; the power rule run backwards raises each power by one and divides by the new power.',
  prompt: 'Water flows into the reservoir’s holding tank at r(t) = 6t² + 6t + 5 litres per minute, t minutes after the inlet opens. The volume in the tank, V(t), is an antiderivative of r(t), and every antiderivative of r(t) has the form V(t) = pt³ + qt² + st + C. Enter p, q and s.',
  answer: [2, 3, 5], labels: ['p (coefficient of t³)', 'q (coefficient of t²)', 's (coefficient of t)'], tolerance: 0.01,
  hints: [
   'Run the power rule backwards: a term kt² comes from a t³ term, and since the derivative of t³ is 3t², divide k by 3.',
   'Check your answer by differentiating pt³ + qt² + st: you must get back 6t² + 6t + 5.'
  ],
  solution: 'Raise each power by one and divide by the new power. 6t² becomes (6 ÷ 3)t³ = 2t³, 6t becomes (6 ÷ 2)t² = 3t², and the constant 5 becomes 5t. So V(t) = 2t³ + 3t² + 5t + C: p = 2, q = 3 and s = 5. Check: the derivative of 2t³ + 3t² + 5t + C is 6t² + 6t + 5.',
  xp: 200, prereqs: ['q15'],
  artifact: { name: 'Tank volume formula', description: 'The volume, rebuilt from nothing but the inflow rate.' },
  sources: [source.s4_10],
  teaching: {
   intuition: 'So far you started from a function and found its rate of change. Now the question runs the other way: you know the rate and want the quantity. A function F whose derivative is f is called an antiderivative of f. The derivative of t³ is 3t², so the derivative of 2t³ is 6t², and 2t³ is an antiderivative of 6t². Reading the power rule backwards gives the recipe: for a term k tⁿ, raise the power by one and divide by the new power, giving (k ÷ (n + 1)) tⁿ⁺¹; a constant k becomes kt. There is never just one antiderivative. Adding a constant C changes nothing in the derivative, because the derivative of a constant is 0, so answers are written with “+ C”. The usual notation is ∫ f(t) dt = F(t) + C, read “the integral of f of t, d t”: the tall S, ∫, is the integral sign, dt names the variable, and the whole thing means every antiderivative of f.',
   steps: [
    'Take the rate one term at a time.',
    'For a term with a power of t, raise the power by one and divide the coefficient by the new power: 6t² becomes 2t³, and 6t becomes 3t².',
    'A constant term k becomes kt.',
    'Add + C, then check by differentiating: you must get the rate back.'
   ],
   example: {
    prompt: 'Find the coefficients of an antiderivative of f(x) = 12x² + 10x + 3.',
    steps: [
     '12x² becomes (12 ÷ 3)x³ = 4x³, and 10x becomes (10 ÷ 2)x² = 5x².',
     'The constant 3 becomes 3x, so ∫ (12x² + 10x + 3) dx = 4x³ + 5x² + 3x + C.',
     'Check: the derivative of 4x³ + 5x² + 3x is 12x² + 10x + 3.'
    ],
    answer: '4x³ + 5x² + 3x + C: the coefficients are 4, 5 and 3.'
   },
   pitfalls: [
    'Multiplying by the new power instead of dividing: an antiderivative of 6t² is 2t³, not 18t³. Differentiating your answer catches this.',
    'Dividing without raising the power: 2t² is not an antiderivative of 6t², because its derivative is 4t.',
    'Losing the constant term: an antiderivative of 5 is 5t, not 0 and not 5.'
   ]
  },
  guidance: [
   { prompt: 'An antiderivative of 6t² is pt³. The derivative of pt³ is 3pt². What must p be?', answer: [2], labels: ['p'], explanation: '3p = 6, so p = 6 ÷ 3 = 2: the derivative of 2t³ is 6t².' },
   { prompt: 'An antiderivative of 6t is qt². The derivative of qt² is 2qt. What must q be?', answer: [3], labels: ['q'], explanation: '2q = 6, so q = 6 ÷ 2 = 3: the derivative of 3t² is 6t.' },
   { prompt: 'An antiderivative of the constant 5 is st. The derivative of st is s. What must s be?', answer: [5], labels: ['s'], explanation: 's = 5: the derivative of 5t is 5. The constant C can be anything, because its derivative is 0.' }
  ]
 },
 {
  id: 'q36', title: 'Reading the spring melt', topic: 'Initial value problems', tier: 'Advanced', sector: 'Reservoir',
  brief: 'The reservoir’s level gauge is read only once a day, but the crew knows how fast the water is rising and wants the level for later in the day.',
  lesson: 'Antidifferentiate the rate, then use one known value to fix the constant C.',
  prompt: 'In spring the reservoir’s water level rises at r(t) = 4t + 3 centimetres per hour, t hours after the melt starts. At t = 2 the level gauge reads 50 cm. The level is L(t) = pt² + st + C, where pt² + st is the antiderivative of r(t) with no constant term. Enter C, then the level at t = 6 in centimetres.',
  answer: [36, 126], labels: ['constant C (cm)', 'level at the later time (cm)'], tolerance: 0.01,
  hints: [
   'Antidifferentiate term by term: L(t) = 2t² + 3t + C.',
   'Put t = 2 into L(t) and set the result equal to the reading, 50, to find C.'
  ],
  solution: 'An antiderivative of 4t + 3 is 2t² + 3t, so L(t) = 2t² + 3t + C. At t = 2: 2 × 4 + 3 × 2 + C = 50, so 14 + C = 50 and C = 36. Then L(6) = 2 × 36 + 3 × 6 + 36 = 126 centimetres.',
  xp: 200, prereqs: ['q35', 'q16'],
  artifact: { name: 'Level forecast', description: 'One gauge reading and a rate, turned into the level at any hour.' },
  sources: [source.s4_10],
  teaching: {
   intuition: 'Knowing how fast the water rises tells you the shape of the level’s graph but not its height. Every antiderivative plus a constant C has the same slopes, so their graphs are copies of one curve slid up or down. One gauge reading picks out the copy that passes through that point. A problem that gives a rate of change together with one known value is called an initial value problem, because the known value is often the starting one, at t = 0. The same idea gives position from velocity: velocity is the derivative of position, so position is an antiderivative of velocity, fixed by one known position.',
   steps: [
    'Find an antiderivative of the rate and add + C.',
    'Put the known time into that formula and set it equal to the known value.',
    'Solve for C. If the known time is not 0, C is not the known value itself.',
    'Use the complete formula to find the value at the time asked for.'
   ],
   example: {
    prompt: 'A rover’s velocity is v(t) = 6t + 2 metres per second, and at t = 0 it is 5 metres from the dock. How far from the dock is it at t = 3?',
    steps: [
     'Position is an antiderivative of velocity: s(t) = 3t² + 2t + C.',
     's(0) = C = 5, so s(t) = 3t² + 2t + 5.',
     's(3) = 27 + 6 + 5 = 38.'
    ],
    answer: '38 metres from the dock.'
   },
   pitfalls: [
    'Setting C equal to the reading when the reading is not taken at t = 0: by then the formula has already added some height, which must be taken away.',
    'Leaving out C, which treats the level as if it started at 0.',
    'Putting the later time into the rate r(t) instead of the level L(t): the rate says how fast, not how high.'
   ]
  },
  guidance: [
   { prompt: 'Antidifferentiate r(t) = 4t + 3 term by term, writing L(t) = pt² + st + C. What are p and s?', answer: [2, 3], labels: ['p', 's'], explanation: 'The derivative of pt² is 2pt, so 2p = 4 and p = 2; the derivative of st is s, so s = 3. L(t) = 2t² + 3t + C.' },
   { prompt: 'Use the gauge reading: L(2) = 50. What is C?', answer: [36], labels: ['C (cm)'], explanation: '2 × 4 + 3 × 2 + C = 14 + C = 50, so C = 50 − 14 = 36.' },
   { prompt: 'Now L(t) = 2t² + 3t + 36. What is the level at t = 6?', answer: [126], labels: ['level (cm)'], explanation: 'L(6) = 2 × 36 + 3 × 6 + 36 = 72 + 18 + 36 = 126 centimetres.' }
  ]
 },
 {
  id: 'q37', title: 'Estimating the pumped water', topic: 'Riemann sums', tier: 'Advanced', sector: 'Reservoir',
  brief: 'The settling basin’s pump speeds up as it runs, and the reservoir crew needs an estimate of how much water it has moved.',
  lesson: 'The area under a rate graph is the total amount; a Riemann sum estimates it with rectangles whose heights are values of the rate.',
  prompt: 'A pump fills the reservoir’s settling basin at r(t) = 3t² + 5 litres per minute. Estimate the water pumped from t = 0 to t = 8 minutes with 4 rectangles of equal width. Enter the width of each rectangle in minutes, then the left-endpoint estimate, then the right-endpoint estimate, both in litres.',
  answer: [2, 376, 760], labels: ['width Δt (min)', 'left-endpoint estimate (L)', 'right-endpoint estimate (L)'], tolerance: 0.01,
  hints: [
   'Each rectangle is 8 ÷ 4 minutes wide. The left endpoints are t = 0, 2, 4 and 6; the right endpoints are t = 2, 4, 6 and 8.',
   'Each rectangle’s area is its height, the rate at one end, times its width. Add the areas, or add the heights and multiply by the width once.'
  ],
  solution: 'Each rectangle is 8 ÷ 4 = 2 minutes wide. The rates at t = 0, 2, 4, 6 and 8 are 5, 17, 53, 113 and 197 litres per minute. The left-endpoint sum uses the first 4 of them: 2 × (5 + 17 + 53 + 113) = 2 × 188 = 376 litres. The right-endpoint sum uses the last 4: 2 × (17 + 53 + 113 + 197) = 2 × 380 = 760 litres. The rate rises over the interval, so the true amount lies between the two.',
  xp: 200, prereqs: ['q36'],
  artifact: { name: 'Pump tally', description: 'Two rectangle estimates that fence in the water a speeding pump has moved.' },
  sources: [source.s5_1],
  teaching: {
   intuition: 'If water flows at a steady 5 litres per minute for 4 minutes, the total is 5 × 4 = 20 litres. On a graph of rate against time, that total is the area of a rectangle with height 5 and width 4. When the rate changes, the total is still the area under the graph, but now the region has a curved top. So cut the time into short pieces and pretend the rate is steady on each: each piece becomes a rectangle whose width is the length of the piece, Δt, and whose height is the rate at one end of it. Adding these rectangle areas gives a Riemann sum. Using the left end of each piece gives the left-endpoint sum; the right end gives the right-endpoint sum. For a rate that keeps rising, the left sum is too low and the right sum too high, so the truth lies between them, and with more, narrower rectangles both close in on it.',
   steps: [
    'Find the width of each rectangle: Δt = (end − start) ÷ the number of rectangles.',
    'List the endpoints: the left ends run from the start up to one width before the end; the right ends run from one width after the start up to the end.',
    'Work out the rate at each endpoint you need: these are the heights.',
    'Multiply each height by the width and add, or add the heights and multiply by the width once.'
   ],
   example: {
    prompt: 'Estimate the area under f(x) = x² + 2 from x = 0 to x = 3 with 3 rectangles, first with left endpoints and then with right endpoints.',
    steps: [
     'Δx = (3 − 0) ÷ 3, so each rectangle has width 1.',
     'Left heights: f(0), f(1) and f(2) are 2, 3 and 6, so the left sum is 1 × 11 = 11.',
     'Right heights: f(1), f(2) and f(3) are 3, 6 and 11, so the right sum is 1 × 20 = 20.'
    ],
    answer: 'Left sum 11 and right sum 20; the true area, 15, lies between them.'
   },
   pitfalls: [
    'Using every endpoint in one sum: with 4 rectangles there are 5 endpoints, and each sum uses only 4 of them.',
    'Forgetting to multiply by the width: the heights alone are in litres per minute, not litres.',
    'Taking the width to be the number of rectangles or the end time, instead of the length of each piece.'
   ]
  },
  guidance: [
   { prompt: 'The interval from t = 0 to t = 8 is cut into 4 rectangles of equal width. What is the width Δt?', answer: [2], labels: ['width Δt (min)'], explanation: 'Δt = (8 − 0) ÷ 4 = 2 minutes.' },
   { prompt: 'The left endpoints are t = 0, 2, 4 and 6. Add the rates there, then multiply by the width. What are the sum of the heights and the left-endpoint estimate?', answer: [188, 376], labels: ['sum of the heights (L/min)', 'left-endpoint estimate (L)'], explanation: 'The rates are 5, 17, 53 and 113, which add to 188. Times the width: 2 × 188 = 376 litres.' },
   { prompt: 'The right endpoints are t = 2, 4, 6 and 8. What are the sum of the heights there and the right-endpoint estimate?', answer: [380, 760], labels: ['sum of the heights (L/min)', 'right-endpoint estimate (L)'], explanation: 'The rates are 17, 53, 113 and 197, which add to 380. Times the width: 2 × 380 = 760 litres.' }
  ]
 },
 {
  id: 'q38', title: 'Balancing the overflow tank', topic: 'The definite integral as signed area', tier: 'Advanced', sector: 'Reservoir',
  brief: 'The overflow tank fills and then drains in the same run, and the crew wants to know how much it gained overall.',
  lesson: 'The definite integral of f from a to b is the signed area between the graph and the horizontal axis: area above counts as positive, area below as negative.',
  prompt: 'The net flow into the reservoir’s overflow tank is r(t) = 8 − 2t litres per minute: positive while the tank fills, negative once it drains. Find the definite integral ∫ from 0 to 6 of (8 − 2t) dt from areas. Enter the area of the triangle above the axis, then the area of the triangle below it, both as positive numbers, then the definite integral.',
  answer: [16, 4, 12], labels: ['area above the axis', 'area below the axis', 'definite integral'], tolerance: 0.01,
  hints: [
   'The rate is zero at t = 4, where 8 − 2t = 0. The graph is a straight line, so on each side of that time the region between the graph and the axis is a triangle.',
   'A triangle’s area is its base times its height, divided by 2. The heights are 8 at t = 0 and 4 at t = 6, where the line is below the axis. Area below the axis counts as negative.'
  ],
  solution: 'The rate is zero at t = 4. From t = 0 to t = 4 the graph and the axis enclose a triangle above the axis with base 4 and height 8: its area is 4 × 8 ÷ 2 = 16. From t = 4 to t = 6 they enclose a triangle below the axis with base 2 and height 4: its area is 2 × 4 ÷ 2 = 4. The definite integral counts area below the axis as negative: 16 − 4 = 12, so overall the tank gained 12 litres.',
  xp: 200, prereqs: ['q37'],
  artifact: { name: 'Overflow balance sheet', description: 'Water in above the line, water out below it, and the difference.' },
  sources: [source.s5_2],
  teaching: {
   intuition: 'As the rectangles of a Riemann sum get narrower and narrower, the sums settle on one exact number: the definite integral. It is written ∫ from a to b of f(t) dt, read “the integral from a to b of f of t, d t”. The ∫ sign is a stretched S, for sum; f(t) is the height of each thin rectangle and dt stands for its tiny width; a and b are where the adding starts and stops. When the rate is positive the rectangles stand above the axis and add water. When it is negative their heights are negative and they take water away. So the definite integral is a signed area: the area above the axis minus the area below it. For a straight-line graph you can find it exactly with triangles, without any rectangles.',
   steps: [
    'Sketch the graph between the two ends and find where it crosses the axis.',
    'Split the region at the crossing into pieces whose areas you know: triangles and rectangles when the graph is straight.',
    'Find each area as a positive number.',
    'Add the areas above the axis and subtract the areas below it: the result is the definite integral.'
   ],
   example: {
    prompt: 'Find ∫ from 0 to 5 of (6 − 2x) dx using areas.',
    steps: [
     '6 − 2x = 0 at x = 3. Above the axis is a triangle with base 3 and height 6, area 9.',
     'Below the axis is a triangle with base 2 and height 4 (at x = 5 the line is at −4), area 4.',
     'Signed area: 9 − 4 = 5.'
    ],
    answer: 'The definite integral is 5.'
   },
   pitfalls: [
    'Adding the area below the axis instead of subtracting it: that gives the total water moved, not the net amount gained.',
    'Forgetting to halve: a triangle’s area is half its base times its height.',
    'Measuring the second triangle’s base from 0: it runs from the crossing point to the end of the interval.'
   ]
  },
  guidance: [
   { prompt: 'At what time t is the rate 8 − 2t equal to zero?', answer: [4], labels: ['crossing time t'], explanation: '8 − 2t = 0 gives t = 8 ÷ 2 = 4. Before then the graph is above the axis, after it below.' },
   { prompt: 'What are the areas of the triangle above the axis, from t = 0 to t = 4, and of the triangle below it, from t = 4 to t = 6?', answer: [16, 4], labels: ['area above', 'area below'], explanation: 'Above: base 4, height r(0) = 8, area 4 × 8 ÷ 2 = 16. Below: base 2, height 4 (r(6) is −4), area 2 × 4 ÷ 2 = 4.' },
   { prompt: 'The definite integral is the area above the axis minus the area below it. What is it?', answer: [12], labels: ['definite integral'], explanation: '16 − 4 = 12. A negative result would mean the tank lost more than it gained.' }
  ]
 },
 {
  id: 'q39', title: 'Totting up the refill', topic: 'The Fundamental Theorem of Calculus', tier: 'Advanced', sector: 'Reservoir',
  brief: 'A refill runs for a few hours at a rising rate, and the reservoir crew wants the exact amount added, not an estimate.',
  lesson: 'If f is continuous from a to b and F is any antiderivative of f, the definite integral of f from a to b is F(b) − F(a).',
  prompt: 'During a refill, water enters the reservoir at r(t) = 3t² + 6t kilolitres per hour. Use the Fundamental Theorem of Calculus to find the water added from t = 1 to t = 4 hours, ∫ from 1 to 4 of r(t) dt. Enter F(1) and F(4) for the antiderivative F(t) of r(t) whose constant is 0, then the integral in kilolitres.',
  answer: [4, 112, 108], labels: ['F at the bottom end', 'F at the top end', 'integral (kL)'], tolerance: 0.01,
  hints: [
   'Reverse the power rule on each term of r(t): F(t) = t³ + 3t².',
   'The theorem says the integral equals F(4) − F(1): the value at the top end minus the value at the bottom end.'
  ],
  solution: 'F(t) = t³ + 3t² has F′(t) = 3t² + 6t, so it is an antiderivative. F(1) = 1 × 1 + 3 × 1 = 4 and F(4) = 1 × 64 + 3 × 16 = 112. By the Fundamental Theorem of Calculus the integral is F(4) − F(1) = 112 − 4 = 108 kilolitres.',
  xp: 200, prereqs: ['q38', 'q35'],
  artifact: { name: 'Refill receipt', description: 'An exact total from one antiderivative and one subtraction.' },
  sources: [source.s5_3],
  teaching: {
   intuition: 'The definite integral of a rate adds up the change that the rate causes. Now suppose F is an antiderivative of the rate. Then F is a quantity whose rate of change is exactly that rate, and its total change from a to b is simply F(b) − F(a). Both describe the same build-up, so they must agree. That is the Fundamental Theorem of Calculus: ∫ from a to b of f(t) dt = F(b) − F(a) for any antiderivative F of f. It needs f to have no breaks between a and b; every polynomial qualifies. It joins the two halves of calculus, rates and totals. Instead of adding thousands of thin rectangles, you find one antiderivative and subtract two of its values. Any constant C cancels in the subtraction, so you can take C = 0.',
   steps: [
    'Find an antiderivative F of the function, with constant 0.',
    'Work out F at the top end b and at the bottom end a.',
    'Subtract: F(b) − F(a), top end minus bottom end.',
    'Give the unit: a rate unit times a time unit, such as kilolitres per hour times hours, which is kilolitres.'
   ],
   example: {
    prompt: 'Evaluate ∫ from 1 to 2 of (6x² + 2x) dx.',
    steps: [
     'An antiderivative is F(x) = 2x³ + x².',
     'F(2) = 16 + 4 = 20 and F(1) = 2 + 1 = 3.',
     'F(2) − F(1) = 20 − 3 = 17.'
    ],
    answer: 'The integral is 17.'
   },
   pitfalls: [
    'Subtracting in the wrong order: F(a) − F(b) gives the right size with the wrong sign.',
    'Putting the ends into the rate f instead of into the antiderivative F.',
    'Dropping F(a) as if it were always 0: it is 0 only in special cases, such as a bottom end of 0 for a polynomial without a constant term.'
   ]
  },
  guidance: [
   { prompt: 'Write the antiderivative as F(t) = At³ + Bt². Which A and B give F′(t) = 3t² + 6t?', answer: [1, 3], labels: ['A', 'B'], explanation: 'The derivative of At³ + Bt² is 3At² + 2Bt, so 3A = 3 and 2B = 6: A = 1 and B = 3.' },
   { prompt: 'With F(t) = t³ + 3t², what are F(1) and F(4)?', answer: [4, 112], labels: ['F at the bottom end', 'F at the top end'], explanation: 'F(1) = 1 × 1 + 3 × 1 = 4 and F(4) = 1 × 64 + 3 × 16 = 112.' },
   { prompt: 'What is F(4) − F(1), the value of the integral?', answer: [108], labels: ['integral (kL)'], explanation: '112 − 4 = 108 kilolitres were added between t = 1 and t = 4.' }
  ]
 },
 {
  id: 'q40', title: 'Closing the reservoir log', topic: 'Net change', tier: 'Advanced', sector: 'Reservoir',
  brief: 'At the end of the day the reservoir log must show when the water peaked and how much is in store, from the flow record alone.',
  lesson: 'The net change in a quantity over an interval is the definite integral of its rate of change; adding it to the starting amount gives the final amount. The quantity peaks where its rate passes from positive to negative.',
  prompt: 'The reservoir gains water at r(t) = 27 − 3t² kilolitres per hour, t hours after noon; a negative rate means it is draining. At noon it holds 200 kilolitres. Enter the time in hours, between t = 0 and t = 4, at which it holds the most water, then the net change in its volume from t = 0 to t = 4, then its volume at t = 4, both in kilolitres.',
  answer: [3, 44, 244], labels: ['time of the most water (h)', 'net change (kL)', 'final volume (kL)'], tolerance: 0.01,
  hints: [
   'The volume rises while r(t) is positive and falls once r(t) is negative, so it is largest at the moment the rate passes through zero.',
   'The net change is ∫ from 0 to 4 of r(t) dt; work it out with an antiderivative and add it to the noon volume.'
  ],
  solution: 'r(t) = 0 when 3t² = 27, so t² = 9 and t = 3 hours. Before then the reservoir fills and after it drains, so it holds the most at t = 3. An antiderivative of r(t) is F(t) = 27t − t³, so the net change is F(4) − F(0) = 27 × 4 − 1 × 64 = 108 − 64 = 44 kilolitres. The volume at t = 4 is 200 + 44 = 244 kilolitres.',
  xp: 200, prereqs: ['q39', 'q27'],
  artifact: { name: 'The reservoir log', description: 'A day of rates turned into a peak, a net change and a closing total: the realm’s last page.' },
  sources: [source.s5_4],
  teaching: {
   intuition: 'This mission gathers the whole realm. A rate of change is a derivative, and where the rate passes through zero from positive to negative, the quantity stops rising and starts falling, so that is where it peaks (from negative to positive it would be a low point). Adding the rate up over time is a definite integral, and the Fundamental Theorem turns that into F(b) − F(a). Together they give the Net Change Theorem: the amount at the end is the amount at the start plus the integral of the rate, Q(b) = Q(a) + ∫ from a to b of Q′(t) dt. The net change counts draining as negative, so it can be smaller than the water that actually flowed, or even negative. Calculus 2 starts from here: it finds antiderivatives of many more functions, uses integrals for volumes, lengths and work, and adds up endless lists of terms in series.',
   steps: [
    'Find when the rate is zero: the quantity peaks or dips there.',
    'Find an antiderivative F of the rate.',
    'The net change is F(end) − F(start).',
    'The final amount is the starting amount plus the net change.'
   ],
   example: {
    prompt: 'A tank holds 50 litres and gains water at r(t) = 8 − 2t litres per minute. When during the first 6 minutes does it hold the most, what is the net change over those 6 minutes, and how much does it hold at t = 6?',
    steps: [
     '8 − 2t = 0 at t = 4, so the tank is fullest at t = 4.',
     'F(t) = 8t − t², so the net change is F(6) − F(0) = 48 − 36 = 12 litres.',
     'At t = 6 the tank holds 50 + 12 = 62 litres.'
    ],
    answer: 'Fullest at t = 4; a net change of 12 litres; 62 litres at the end.'
   },
   pitfalls: [
    'Reporting the net change as the final volume: the integral is a change, so add it to the starting amount.',
    'Taking the fullest moment to be the end of the interval: once the rate turns negative the volume falls.',
    'Counting the draining as if it were filling: the net change counts it as negative.'
   ]
  },
  guidance: [
   { prompt: 'At what time t is the rate 27 − 3t² equal to zero?', answer: [3], labels: ['time (h)'], explanation: '3t² = 27 gives t² = 9, so t = 3 hours. The volume stops rising and starts falling there.' },
   { prompt: 'An antiderivative of r(t) is F(t) = 27t − t³. What is the net change F(4) − F(0)?', answer: [44], labels: ['net change (kL)'], explanation: 'F(4) = 27 × 4 − 1 × 64 = 108 − 64 = 44 and F(0) = 0, so the net change is 44 kilolitres.' },
   { prompt: 'Add the net change to the 200 kilolitres held at noon. What is the volume at t = 4?', answer: [244], labels: ['final volume (kL)'], explanation: '200 + 44 = 244 kilolitres.' }
  ]
 }
);
})();
