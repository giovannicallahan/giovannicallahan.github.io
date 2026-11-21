/* Calculus 1 missions, file b: q11–q20 (docs/CALC1-PLAN.md lists the concepts).
   Mission objects as described in docs/PACK-FORMAT.md ("Mission"); the worked sample is q01 in missions-a.js.
   Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution and guidance here exactly);
   experiments: experiments-b.js; drill statements: variants-b.js; oracles: qa/realms/calc1/oracle-b.js. */
(function(){
'use strict';
/* OpenStax Calculus Volume 1 sections. Open each page before you set `verified` to the date you saw it. */
const source = {
 s2_3: { title: 'OpenStax Calculus Volume 1 — 2.3 The Limit Laws', url: 'https://openstax.org/books/calculus-volume-1/pages/2-3-the-limit-laws', description: 'Limit laws, direct substitution, and limits found by factoring and cancelling.', verified: '2026-11-21' },
 s2_4: { title: 'OpenStax Calculus Volume 1 — 2.4 Continuity', url: 'https://openstax.org/books/calculus-volume-1/pages/2-4-continuity', description: 'Continuity at a point, kinds of discontinuity, and the Intermediate Value Theorem.', verified: '2026-11-21' },
 s3_1: { title: 'OpenStax Calculus Volume 1 — 3.1 Defining the Derivative', url: 'https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative', description: 'The derivative at a point as the limit of difference quotients, and the tangent line.', verified: '2026-11-21' },
 s3_2: { title: 'OpenStax Calculus Volume 1 — 3.2 The Derivative as a Function', url: 'https://openstax.org/books/calculus-volume-1/pages/3-2-the-derivative-as-a-function', description: 'The derivative function, its graph, and higher derivatives.', verified: '2026-11-21' },
 s3_3: { title: 'OpenStax Calculus Volume 1 — 3.3 Differentiation Rules', url: 'https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules', description: 'The power, constant multiple, sum, difference, product and quotient rules.', verified: '2026-11-21' },
 s3_4: { title: 'OpenStax Calculus Volume 1 — 3.4 Derivatives as Rates of Change', url: 'https://openstax.org/books/calculus-volume-1/pages/3-4-derivatives-as-rates-of-change', description: 'Velocity and acceleration as first and second derivatives of position.', verified: '2026-11-21' },
 s3_6: { title: 'OpenStax Calculus Volume 1 — 3.6 The Chain Rule', url: 'https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule', description: 'The derivative of a function inside another function.', verified: '2026-11-21' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: 'Sealing the pump dial', topic: 'Limits and continuity together', tier: 'Basic', sector: 'Flow Control',
  brief: 'A pump controller switches formulas at one dial setting, and the switch-over must not make the flow jump.',
  lesson: 'To join two formulas without a jump, find the limit of one where they meet and make the other take the same value there.',
  prompt: 'A flow controller sets a pump’s output f(x), in litres per minute, from a dial setting x. Below the setting 5 it uses f(x) = (x² − 25) ÷ (x − 5); at 5 and above it uses f(x) = x² − c, where c is a number still to be stored. Enter the limit of f(x) as x approaches 5 from the left, then the value of c that makes f continuous at x = 5.',
  answer: [10, 15], labels: ['limit from the left', 'c'], tolerance: 0.01,
  hints: [
   'Direct substitution of 5 into the left piece gives 0 ÷ 0, so factor the top as a difference of two squares and cancel the common factor first.',
   'For no jump, the right piece’s value at x = 5, which is 25 − c, must equal the limit from the left.'
  ],
  solution: 'Below 5: x² − 25 = (x − 5)(x + 5), and for x ≠ 5 the factor x − 5 cancels, leaving f(x) = x + 5. As x approaches 5 from the left, x + 5 approaches 5 + 5 = 10. At 5 itself f(5) = 25 − c, and the limit from the right is the same number, because x² − c is a polynomial. For f to be continuous at 5 the two sides must meet: 25 − c = 10, so c = 25 − 10 = 15.',
  xp: 100, prereqs: ['q06', 'q07'],
  artifact: { name: 'Seamless valve map', description: 'A pump curve built from two formulas that meet without a jump.' },
  sources: [source.s2_3, source.s2_4],
  teaching: {
   intuition: 'This chapter has built three tools, and a controller that switches formulas needs all three at once. First, a limit is the value a function’s outputs close in on as the input gets close to a number, whatever happens at the number itself. When direct substitution gives 0 ÷ 0, the formula has a hole there: factor, cancel the common factor, and substitute into what is left. Second, a one-sided limit looks at inputs from one side only; at a switch-over point the left piece decides the limit from the left and the right piece the limit from the right. Third, a function is continuous at a point when both one-sided limits agree and equal the value the function actually takes there, so its graph can be drawn through that point without lifting the pen. Closing a gap is then a matter of making the right piece land exactly where the left piece is heading.',
   steps: [
    'Find the limit from the left using the formula for inputs below the switch-over point; if substitution gives 0 ÷ 0, factor and cancel first.',
    'Find the limit from the right and the value at the point using the formula that holds there. For a polynomial piece, direct substitution gives both.',
    'For continuity, set the value from the right piece equal to the limit from the left, and solve for the unknown number.',
    'Check: with the number in place, the two one-sided limits and the value at the point are all the same.'
   ],
   example: {
    prompt: 'For x below 3, g(x) = (x² − 9) ÷ (x − 3); for x of 3 and more, g(x) = x² − c. Which c makes g continuous at 3?',
    steps: [
     'x² − 9 = (x − 3)(x + 3), so below 3 the formula is x + 3, which approaches 6 as x approaches 3 from the left.',
     'The right piece at 3 is 9 − c; continuity needs 9 − c = 6.',
     'So c = 9 − 6 = 3, and then g(3) = 9 − 3 = 6, matching the limit from the left.'
    ],
    answer: 'c = 3 (the limit from the left is 6).'
   },
   pitfalls: [
    'Stopping at 0 ÷ 0 and calling the limit undefined. 0 ÷ 0 only says that more work is needed: factor and cancel.',
    'Setting c itself equal to the limit. The right piece’s value is a square minus c, so c must make that whole expression equal the limit.',
    'Using the right piece to find the limit from the left. Each side of the switch-over point has its own formula.'
   ]
  },
  guidance: [
   { prompt: 'Factor x² − 25 as (x − 5)(x + 5) and cancel x − 5 from the top and the bottom. The left piece is now x + 5. What does it approach as x approaches 5 from the left?', answer: [10], labels: ['limit from the left'], explanation: 'For every x just below 5, f(x) = x + 5, and x + 5 closes in on 5 + 5 = 10. The hole at x = 5 does not matter to a limit.' },
   { prompt: 'The right piece at x = 5 is 25 − c. For no jump it must equal 10. What is c?', answer: [15], labels: ['c'], explanation: '25 − c = 10, so c = 25 − 10 = 15.' },
   { prompt: 'Check: with c = 15, what is f(5) from the right piece?', answer: [10], labels: ['value at the meeting point'], explanation: 'f(5) = 25 − 15 = 10, the same as the limit from the left, so the pump’s output has no jump at the setting 5.' }
  ]
 },
 {
  id: 'q12', title: 'Speed at the timing gate', topic: 'The derivative as a limit of difference quotients', tier: 'Intermediate', sector: 'Test Track',
  brief: 'The timing gate on the test track needs the rover’s speed at one exact instant, not over a stretch of time.',
  lesson: 'The derivative at a point is the limit of the difference quotients as the step h shrinks to 0.',
  prompt: 'On the test track a rover’s distance from the start line is s(t) = 3t² + 4t metres, t seconds after it sets off. Enter the difference quotient (s(2 + h) − s(2)) ÷ h for the step h = 0.1, then the derivative s′(2), the rover’s speed at the instant t = 2, in metres per second.',
  answer: [16.3, 16], labels: ['difference quotient, h = 0.1 (m/s)', 'derivative (m/s)'], tolerance: 0.005,
  hints: [
   'For h = 0.1 you need s(2.1) and s(2): subtract them and divide by 0.1.',
   'For the derivative keep h as a letter: expand s(2 + h) − s(2), divide by h, and see what is left when h shrinks to 0.'
  ],
  solution: 's(2) = 3 × 4 + 4 × 2 = 20 and s(2.1) = 3 × 4.41 + 4 × 2.1 = 21.63, so the difference quotient is (21.63 − 20) ÷ 0.1 = 1.63 ÷ 0.1 = 16.3. With h as a letter, s(2 + h) − s(2) = 16h + 3h², and dividing by h gives 16 + 3h. As h approaches 0 the term 3h vanishes, so s′(2) = 16 metres per second.',
  xp: 150, prereqs: ['q02', 'q05'],
  artifact: { name: 'Timing-gate trace', description: 'Average speeds over shrinking steps, closing in on one instant.' },
  sources: [source.s3_1],
  teaching: {
   intuition: 'An average speed needs two moments, but a speedometer shows a speed at one moment. The way out is the one you met when average rates were taken over shrinking intervals: start at a time a, step forward a small amount h, and take the average rate over that step. That fraction, (f(a + h) − f(a)) ÷ h, is called the difference quotient; on a graph it is the slope of the secant line from the point at a to the point at a + h. Now let h shrink. The two points slide together and the secant line swings towards a line that only touches the curve at a. The limit of the difference quotients as h approaches 0 is the derivative of f at a, written f′(a) and read “f prime of a”; writing a derivative with this little mark is called prime notation. The step h may also be negative, a small step back; for the smooth formulas here both directions close in on the same number. It is the instantaneous rate of change: for a distance, the speed at that very instant. You cannot set h = 0 straight away, because that gives 0 ÷ 0; instead expand the top, cancel h as you did at a hole, and only then let h go to 0.',
   steps: [
    'Write the difference quotient (f(a + h) − f(a)) ÷ h for the point a you want.',
    'For a feel of the answer, try a small step such as h = 0.1: work out both values, subtract, divide by h.',
    'To get the exact value, keep h as a letter: expand f(a + h), subtract f(a), and the top becomes a sum of terms that each contain h.',
    'Divide every term by h, then let h approach 0: the terms that still contain h vanish, and what is left is f′(a).'
   ],
   example: {
    prompt: 'For f(x) = x², find the difference quotient at x = 3 with h = 0.1, and then f′(3).',
    steps: [
     'With h = 0.1: f(3.1) = 9.61 and f(3) = 9, so (9.61 − 9) ÷ 0.1 = 6.1.',
     'With h as a letter: (3 + h)² − 9 = 9 + 6h + h² − 9 = 6h + h², and dividing by h gives 6 + h.',
     'As h approaches 0, 6 + h approaches 6, so f′(3) = 6.'
    ],
    answer: 'Difference quotient 6.1 with h = 0.1; derivative f′(3) = 6.'
   },
   pitfalls: [
    'Putting h = 0 into the difference quotient at the start. That gives 0 ÷ 0; cancel h first, then let it go to 0.',
    'Squaring a + h as a² + h². The square of a sum has a middle term: (a + h)² = a² + 2ah + h².',
    'Taking the answer for h = 0.1 as the derivative. It is only an average over a short step; the derivative is the value the quotients close in on.'
   ]
  },
  guidance: [
   { prompt: 'Put t = 2 and t = 2.1 into s(t) = 3t² + 4t. What are s(2) and s(2.1)?', answer: [20, 21.63], labels: ['s at the start (m)', 's a tenth of a second later (m)'], explanation: 's(2) = 3 × 4 + 4 × 2 = 20 and s(2.1) = 3 × 4.41 + 4 × 2.1 = 21.63.' },
   { prompt: 'Divide the change in distance by the step. What is (21.63 − 20) ÷ 0.1?', answer: [16.3], labels: ['difference quotient (m/s)'], explanation: '21.63 − 20 = 1.63, and 1.63 ÷ 0.1 = 16.3: the average speed over that tenth of a second.' },
   { prompt: 'Now keep h as a letter. Expanding s(2 + h) − s(2) gives (number)h + (number)h². Enter the number in front of h, then the number in front of h².', answer: [16, 3], labels: ['number in front of h', 'number in front of h²'], explanation: '3(2 + h)² + 4(2 + h) − 20 = 12 + 12h + 3h² + 8 + 4h − 20 = 16h + 3h².' },
   { prompt: 'Dividing by h leaves 16 + 3h. What does that approach as h shrinks towards 0?', answer: [16], labels: ['derivative (m/s)'], explanation: 'The part 3h shrinks to 0 with h, so the difference quotients close in on 16. That limit is the derivative: s′(2) = 16 metres per second.' }
  ]
 },
 {
  id: 'q13', title: 'Laying the guide rail', topic: 'The tangent line: slope and equation', tier: 'Intermediate', sector: 'Test Track',
  brief: 'A straight guide rail has to meet the banked curve of the test track at one point without cutting into it.',
  lesson: 'The tangent line at x = a passes through (a, f(a)) and has slope f′(a).',
  prompt: 'On the test track the centre line of a banked curve follows y = f(x) = 2x² − 3x + 5, with x and y in metres. A straight guide rail must just touch the curve at x = 3, along the tangent line there. Enter the slope of the tangent line, then its y-intercept, so that the rail is y = (slope)x + (intercept).',
  answer: [9, -13], labels: ['slope', 'y-intercept'], tolerance: 0.01,
  hints: [
   'The tangent line passes through the point of the curve at x = 3, so first work out f(3).',
   'For px² + qx + r the derivative is f′(x) = 2px + q. Its value at x = 3 is the slope; then make the line pass through the point to find the intercept.'
  ],
  solution: 'The point: f(3) = 2 × 9 + (−3) × 3 + 5 = 14, so the rail touches at (3, 14). The slope: f′(x) = 4x − 3, so f′(3) = 4 × 3 + (−3) = 9. The line y = 9x + k passes through the point, so 14 = 9 × 3 + k and k = 14 − 27 = −13. The rail is y = 9x − 13.',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Guide-rail template', description: 'A straight line that touches the curve and shares its steepness at one point.' },
  sources: [source.s3_1],
  teaching: {
   intuition: 'Zoom in far enough on a smooth curve and it looks straight. That straight line is the tangent line at the point: it touches the curve there and runs in exactly the curve’s direction. Two facts pin it down. It passes through the point of the curve, (a, f(a)). And its slope is the limit the secant slopes close in on as the second point slides onto the first, which is the derivative f′(a) from the last mission. For a quadratic f(x) = px² + qx + r, that limit can be worked once and for all: the difference quotient comes out as 2pa + q + ph, so f′(a) = 2pa + q. The same working holds at every point, so we can let the point vary and write f′(x) = 2px + q: a new function, the derivative function, that gives the slope of the curve at each x. The constant r cancels in the subtraction f(a + h) − f(a), which makes sense, since lifting a curve up or down does not change how steep it is. With a slope m and a point, the line y = mx + k is found by choosing the intercept k so that the point lies on it.',
   steps: [
    'Find the point of contact: work out f(a).',
    'Find the slope: f′(a). For px² + qx + r it is 2pa + q.',
    'Write the line as y = mx + k with m = f′(a), put in the point (a, f(a)), and solve for k: k = f(a) − m × a.',
    'Check that the line gives f(a) at x = a.'
   ],
   example: {
    prompt: 'Find the tangent line to y = x² + 1 at x = 2.',
    steps: [
     'The point: 2² + 1 = 5, so (2, 5).',
     'The slope: here p = 1 and q = 0, so f′(2) = 2 × 1 × 2 + 0 = 4.',
     'The intercept: 5 = 4 × 2 + k, so k = 5 − 8 = −3.'
    ],
    answer: 'y = 4x − 3 (slope 4, intercept −3).'
   },
   pitfalls: [
    'Using f(a) as the slope. f(a) says where the curve is; f′(a) says how steep it is.',
    'Using the point’s x-value as the intercept. The intercept is where the line crosses x = 0, so solve f(a) = m × a + k for k.',
    'Letting the constant term change the slope. The number r moves the curve up or down but adds nothing to f′.'
   ]
  },
  guidance: [
   { prompt: 'Where does the rail touch? Work out f(3) for f(x) = 2x² − 3x + 5.', answer: [14], labels: ['value at the point'], explanation: 'f(3) = 2 × 9 + (−3) × 3 + 5 = 14, so the touching point is (3, 14).' },
   { prompt: 'The slope of the tangent line is f′(3), and here f′(x) = 4x − 3. What is f′(3)?', answer: [9], labels: ['slope'], explanation: 'f′(3) = 4 × 3 + (−3) = 9. The constant 5 only lifts the curve; it does not change its steepness.' },
   { prompt: 'The line y = 9x + k must pass through (3, 14). What is k?', answer: [-13], labels: ['y-intercept'], explanation: '14 = 9 × 3 + k, so k = 14 − 27 = −13. The rail is y = 9x − 13.' }
  ]
 },
 {
  id: 'q14', title: 'The odometer shortcut', topic: 'The power rule', tier: 'Intermediate', sector: 'Test Track',
  brief: 'The track’s data logger fits distance with a single power of time, and the crew want speeds without a page of algebra each time.',
  lesson: 'Power rule: the derivative of xⁿ is n times x to the power n − 1.',
  prompt: 'A test rover’s data logger fits its distance from the start line as d(t) = t⁴ centimetres, t seconds after it sets off. Use the power rule to write d′(t) = (coefficient) × t to a power. Enter the coefficient, then the power, then d′(2), the rover’s speed in centimetres per second at t = 2.',
  answer: [4, 3, 32], labels: ['coefficient', 'power', 'speed (cm/s)'], tolerance: 0.01,
  hints: [
   'The power rule: bring the exponent down in front as the coefficient, then lower the exponent by one.',
   'Once you have d′(t), put t = 2 into it: work out the power of 2 first, then multiply.'
  ],
  solution: 'By the power rule the derivative of t⁴ is 4t³: the exponent 4 comes down as the coefficient and the new power is 4 − 1 = 3. At t = 2: d′(2) = 4 × 2³ = 4 × 8 = 32 centimetres per second.',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Power-rule card', description: 'Bring the exponent down, lower it by one.' },
  sources: [source.s3_3],
  teaching: {
   intuition: 'Working out a derivative from the limit every time is slow, so look for a pattern. From the limit you have seen that x² has derivative 2x. Try x³: (x + h)³ = x³ + 3x²h + 3xh² + h³, so the difference quotient is 3x² + 3xh + h², and as h shrinks only 3x² survives. In general, when (x + h)ⁿ is expanded, the only term with exactly one h is n times xⁿ⁻¹ times h, because each of the n factors can supply the single h; every other term has h² or more and vanishes in the limit. That gives the power rule: the derivative of xⁿ is n xⁿ⁻¹. Bring the exponent down in front, then lower the exponent by one. A plain x is x¹, so its derivative is 1, and a constant, which never changes, has derivative 0. The rule also works for negative and fractional powers, which later missions use.',
   steps: [
    'Identify the exponent n in xⁿ.',
    'Bring it down as the coefficient: n.',
    'Lower the exponent by one: n − 1. The derivative is n xⁿ⁻¹.',
    'To get the rate at a point, put the input into the derivative: work out the power first, then multiply by the coefficient.'
   ],
   example: {
    prompt: 'For f(x) = x³, find f′(x) and f′(4).',
    steps: [
     'The exponent 3 comes down and the new power is 2: f′(x) = 3x².',
     'At x = 4: 4² = 16, and 3 × 16 = 48.'
    ],
    answer: 'f′(x) = 3x², so f′(4) = 48.'
   },
   pitfalls: [
    'Lowering the exponent but forgetting to bring it down: the derivative of x⁴ is 4x³, not x³.',
    'Multiplying before taking the power: 4 × 2³ is 4 × 8 = 32, not 8³.',
    'Raising the exponent instead of lowering it. Lowering by one is the derivative; raising belongs to the reverse process met at the end of the course.'
   ]
  },
  guidance: [
   { prompt: 'In d(t) = t⁴ the exponent is 4. The power rule brings the exponent down in front. What is the coefficient of d′(t)?', answer: [4], labels: ['coefficient'], explanation: 'The exponent 4 becomes the coefficient.' },
   { prompt: 'The power rule then lowers the exponent by one. What is the new power?', answer: [3], labels: ['power'], explanation: '4 − 1 = 3, so d′(t) = 4t³.' },
   { prompt: 'Put t = 2 into d′(t) = 4t³. What is d′(2)?', answer: [32], labels: ['speed (cm/s)'], explanation: '2³ = 8, and 4 × 8 = 32. At t = 2 the distance is growing at 32 centimetres per second.' }
  ]
 },
 {
  id: 'q15', title: 'Cooling the brakes', topic: 'The constant multiple, sum and difference rules', tier: 'Intermediate', sector: 'Test Track',
  brief: 'The brake-cooling loop on the test track needs to know how fast the fluid is heating up partway through a run.',
  lesson: 'A polynomial is differentiated term by term: each term by the power rule, keeping its number in front, and a constant gives 0.',
  prompt: 'The test track’s brake-cooling fluid has temperature T(t) = 2t³ − 5t² + 4t + 9 degrees, t minutes into a test run. Using the constant multiple, sum and difference rules, write T′(t) = At² + Bt + C. Enter A, B and C, then T′(3), the rate at which the temperature is changing at t = 3, in degrees per minute.',
  answer: [6, -10, 4, 28], labels: ['A', 'B', 'C', 'rate (degrees per minute)'], tolerance: 0.01,
  hints: [
   'Differentiate one term at a time with the power rule, keeping each term’s number in front as a multiplier. A constant term has derivative 0.',
   'Put t = 3 into your T′(t): square 3 for the first term.'
  ],
  solution: 'Term by term: 2t³ gives 2 × 3t² = 6t², −5t² gives −5 × 2t = −10t, 4t gives 4, and the constant 9 gives 0. So T′(t) = 6t² − 10t + 4, with A = 6, B = −10 and C = 4. At t = 3: T′(3) = 6 × 9 + (−10) × 3 + 4 = 54 + (−30) + 4 = 28 degrees per minute.',
  xp: 150, prereqs: ['q14'],
  artifact: { name: 'Term-by-term gauge', description: 'A polynomial taken apart and differentiated one piece at a time.' },
  sources: [source.s3_3],
  teaching: {
   intuition: 'Many models are polynomials, sums of several powers each with its own number in front. Finding a derivative is called differentiating; to differentiate a formula is to work out its derivative. Three rules let you treat them one piece at a time. The constant multiple rule: if a quantity is always 5 times another, it changes 5 times as fast, so the derivative of 5x³ is 5 × 3x² = 15x². The sum rule: when two quantities are added, their rates add, just as two pipes filling one tank add their flows. The difference rule: when one is subtracted, its rate is subtracted. Together with the power rule, a polynomial is differentiated term by term. A lone number has derivative 0, because a constant does not change. The derivative of a cubic is a quadratic: every power drops by one.',
   steps: [
    'Split the polynomial into its terms, keeping each sign with its term.',
    'For each term c xⁿ, the derivative is c × n xⁿ⁻¹: keep the number, apply the power rule.',
    'A term c x becomes c, and a constant term becomes 0.',
    'Add the results, then put in the input to get the rate at a point.'
   ],
   example: {
    prompt: 'For g(t) = 4t³ + 2t² − 7t + 1, find g′(t) and g′(2).',
    steps: [
     'Term by term: 4t³ gives 12t², 2t² gives 4t, −7t gives −7 and 1 gives 0, so g′(t) = 12t² + 4t − 7.',
     'At t = 2: 12 × 4 + 4 × 2 − 7 = 48 + 8 − 7 = 49.'
    ],
    answer: 'g′(t) = 12t² + 4t − 7, so g′(2) = 49.'
   },
   pitfalls: [
    'Dropping the minus sign of a term: the derivative of −5t² is −10t, not 10t.',
    'Keeping the constant: a lone number like 9 has derivative 0, so it does not appear in the derivative.',
    'Differentiating the number in front as well: the derivative of 3t² is 3 × 2t = 6t, not 0 × t² or 3 × 2.'
   ]
  },
  guidance: [
   { prompt: 'The first term is 2t³. By the power rule t³ has derivative 3t², and the constant multiple rule keeps the 2. What is A?', answer: [6], labels: ['A'], explanation: '2 × 3t² = 6t², so A = 6.' },
   { prompt: 'Do the same for −5t² and 4t, and remember that the constant 9 does not change. Enter B, then C.', answer: [-10, 4], labels: ['B', 'C'], explanation: '−5 × 2t = −10t, so B = −10; 4t has derivative 4, so C = 4. The constant 9 has derivative 0.' },
   { prompt: 'T′(t) = 6t² − 10t + 4. What is T′(3)?', answer: [28], labels: ['rate (degrees per minute)'], explanation: '6 × 9 + (−10) × 3 + 4 = 28, so at t = 3 the temperature changes by 28 degrees per minute.' }
  ]
 },
 {
  id: 'q16', title: 'Back and forth on the straight', topic: 'Velocity and acceleration', tier: 'Intermediate', sector: 'Test Track',
  brief: 'A rover is running back and forth on the straight, and the crew need its velocity and acceleration from the position log.',
  lesson: 'Velocity is the derivative of position; acceleration is the derivative of velocity, the second derivative of position.',
  prompt: 'A test rover runs back and forth on a straight track. Its position, measured from the start line, is s(t) = 2t³ − 12t² + 20t metres, t seconds after the start. Enter its velocity at t = 4 in metres per second, its acceleration at t = 4 in metres per second per second, then the time in seconds at which its acceleration is zero.',
  answer: [20, 24, 2], labels: ['velocity (m/s)', 'acceleration (m/s²)', 'time of zero acceleration (s)'], tolerance: 0.01,
  hints: [
   'The velocity is v(t) = s′(t): differentiate the position term by term. The acceleration is the derivative of the velocity, s″(t).',
   'The acceleration comes out as a number times t plus a constant. Set it equal to 0 and solve for t.'
  ],
  solution: 'Velocity: v(t) = s′(t) = 6t² − 24t + 20, so v(4) = 6 × 16 + (−24) × 4 + 20 = 20 metres per second. Acceleration: a(t) = v′(t) = s″(t) = 12t − 24, so a(4) = 12 × 4 + (−24) = 24 metres per second per second. The acceleration is zero when 12t = 24, that is at t = 24 ÷ 12 = 2 seconds.',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Motion triple', description: 'Position, velocity and acceleration from one formula.' },
  sources: [source.s3_4, source.s3_2],
  teaching: {
   intuition: 'When something moves along a straight line, its position s(t) is its signed distance from a fixed mark: positive on one side, negative on the other. The rate of change of position is the velocity, v(t) = s′(t). Velocity is speed with a direction: positive when the position is increasing, negative when the rover is coming back, and zero at the moment it turns round. Velocity itself can change, and its rate of change is the acceleration, a(t) = v′(t). Because acceleration is the derivative of a derivative, it is called the second derivative of position, written s″(t) and read “s double prime”. Its unit is metres per second per second: how many metres per second the velocity gains each second. A positive acceleration with a negative velocity means the rover is slowing down as it comes back, so read the signs together.',
   steps: [
    'Differentiate the position term by term to get the velocity v(t) = s′(t).',
    'Put in the time to get the velocity there; its sign gives the direction of motion.',
    'Differentiate the velocity to get the acceleration a(t) = s″(t), and put in the time.',
    'To find when a rate is zero, set its formula equal to 0 and solve for t.'
   ],
   example: {
    prompt: 'A cart’s position is s(t) = 4t² + 3t metres. Find its velocity and acceleration at t = 2.',
    steps: [
     'v(t) = s′(t) = 8t + 3, so v(2) = 19 metres per second.',
     'a(t) = v′(t) = 8, so the acceleration is 8 metres per second per second at every time.'
    ],
    answer: 'Velocity 19 m/s, acceleration 8 m/s² at t = 2.'
   },
   pitfalls: [
    'Putting the time into the position and calling it the velocity. s(t) says where the rover is; v(t) = s′(t) says how fast it moves.',
    'Taking the acceleration from s′ instead of s″. Acceleration is the derivative of velocity, so differentiate twice.',
    'Dropping the sign of a velocity. A negative velocity is a real answer: the rover is moving back towards the start line.'
   ]
  },
  guidance: [
   { prompt: 'Differentiate s(t) = 2t³ − 12t² + 20t term by term to get the velocity v(t) = At² + Bt + C. Enter A, B and C.', answer: [6, -24, 20], labels: ['A', 'B', 'C'], explanation: '2t³ gives 6t², −12t² gives −24t and 20t gives 20: v(t) = 6t² − 24t + 20.' },
   { prompt: 'What is the velocity v(4)?', answer: [20], labels: ['velocity (m/s)'], explanation: '6 × 16 + (−24) × 4 + 20 = 20 metres per second.' },
   { prompt: 'Differentiate v(t) once more to get the acceleration a(t) = Dt + E. Enter D, then E.', answer: [12, -24], labels: ['D', 'E'], explanation: '6t² gives 12t, −24t gives −24, and the constant 20 gives 0: a(t) = 12t − 24.' },
   { prompt: 'Enter a(4), then the time at which a(t) = 0.', answer: [24, 2], labels: ['acceleration (m/s²)', 'time (s)'], explanation: 'a(4) = 12 × 4 + (−24) = 24. And 12t + (−24) = 0 when t = 24 ÷ 12 = 2.' }
  ]
 },
 {
  id: 'q17', title: 'The straight-line forecast', topic: 'Review: the derivative of a polynomial model', tier: 'Intermediate', sector: 'Test Track',
  brief: 'Before handing the track to the next team, the crew want one full report on a rover’s run: rate, change of rate and a short-term forecast.',
  lesson: 'From a polynomial model: s′ gives the rate, s″ how the rate is changing, and the tangent line a straight-line forecast near the point.',
  prompt: 'A rover’s position along the test track is modelled by s(t) = 2t³ − 9t² + 12t + 4 metres, t seconds after the start. At t = 3, enter the rate of change s′(3) in metres per second, then the second derivative s″(3), then the intercept k of the tangent line y = s′(3)t + k that the track crew use as a straight-line forecast.',
  answer: [12, 18, -23], labels: ['rate (m/s)', 'second derivative', 'intercept k (m)'], tolerance: 0.01,
  hints: [
   'Write s′(t) term by term with the power rule, then differentiate s′(t) again for s″(t). Put t = 3 into each.',
   'The tangent line touches the curve at (3, s(3)). Work out s(3) and choose k so that the line passes through that point.'
  ],
  solution: 's′(t) = 6t² − 18t + 12, so s′(3) = 6 × 9 + (−18) × 3 + 12 = 12 metres per second. s″(t) = 12t − 18, so s″(3) = 12 × 3 + (−18) = 18. The touching point: s(3) = 13. The line y = 12t + k passes through (3, 13), so k = 13 − 12 × 3 = −23, and the forecast is y = 12t − 23.',
  xp: 150, prereqs: ['q13', 'q16'],
  artifact: { name: 'Track report', description: 'A rate, its change and a tangent-line forecast from one model.' },
  sources: [source.s3_2, source.s3_3],
  teaching: {
   intuition: 'A polynomial model now gives three things at once. The derivative s′(t), found term by term, is itself a function, the derivative function: for each time it gives the rate of change at that instant. Differentiating once more gives the second derivative s″(t), which says whether that rate is rising (positive) or falling (negative). And the tangent line at a chosen time, which has the curve’s value and the curve’s slope there, is the best straight-line forecast for times close by: it is how the crew estimate the next few moments without the full model. All three come from the same few rules, so the work is mostly careful bookkeeping of signs.',
   steps: [
    'Differentiate the model term by term to get s′(t); differentiate again to get s″(t).',
    'Put the chosen time into s, s′ and s″.',
    'The tangent line is y = s′(t₀)t + k; choose k so that it passes through (t₀, s(t₀)): k = s(t₀) − s′(t₀) × t₀.',
    'Read the signs: s′ gives the direction of change; s″ says whether the rate s′ is rising (positive) or falling (negative).'
   ],
   example: {
    prompt: 'For s(t) = t³ − 4t + 6, find s′(1), s″(1) and the tangent line at t = 1.',
    steps: [
     's′(t) = 3t² − 4 gives s′(1) = −1; s″(t) = 6t gives s″(1) = 6.',
     's(1) = 1 − 4 + 6 = 3, and the line y = −t + k through (1, 3) has k = 3 + 1 = 4.'
    ],
    answer: 's′(1) = −1, s″(1) = 6, tangent line y = −t + 4.'
   },
   pitfalls: [
    'Using s(t₀) in place of s′(t₀) for the slope of the forecast line.',
    'Taking s″ as the derivative of s instead of the derivative of s′: differentiate twice.',
    'Sign slips when a term is negative: keep each term’s sign through both derivatives and into the arithmetic.'
   ]
  },
  guidance: [
   { prompt: 'Where is the rover at t = 3? Work out s(3).', answer: [13], labels: ['position (m)'], explanation: 's(3) = 2 × 27 + (−9) × 9 + 12 × 3 + 4 = 13.' },
   { prompt: 'Differentiate term by term: s′(t) = 6t² − 18t + 12. What is s′(3)?', answer: [12], labels: ['rate (m/s)'], explanation: '6 × 9 + (−18) × 3 + 12 = 12.' },
   { prompt: 'Differentiate s′(t) again: s″(t) = 12t − 18. What is s″(3)?', answer: [18], labels: ['second derivative'], explanation: '12 × 3 + (−18) = 18. It is positive, so the rate of change is itself rising.' },
   { prompt: 'The tangent line y = 12t + k passes through (3, 13). What is k?', answer: [-23], labels: ['intercept k (m)'], explanation: '13 = 12 × 3 + k, so k = 13 − 36 = −23.' }
  ]
 },
 {
  id: 'q18', title: 'Two factors on the lathe', topic: 'The product rule', tier: 'Intermediate', sector: 'Machine Shop',
  brief: 'A motor’s output in the machine shop is the product of two parts that both change with the dial, and its rate of change is needed.',
  lesson: 'Product rule: (uv)′ = u′v + uv′.',
  prompt: 'In the machine shop a motor’s output is modelled as P(x) = (3x + 2)(x² + 5) watts, where x is the control-dial setting. Enter P(2), then the rate of change P′(2) found with the product rule, in watts per dial step.',
  answer: [72, 59], labels: ['output (W)', 'rate (W per dial step)'], tolerance: 0.01,
  hints: [
   'Call the factors u = 3x + 2 and v = x² + 5. Work out u, v, u′ and v′ at x = 2.',
   'The product rule: P′ = u′v + uv′. The derivative of a product is not the product of the derivatives.'
  ],
  solution: 'At x = 2: u = 3 × 2 + 2 = 8 and v = 4 + 5 = 9, so P(2) = 8 × 9 = 72. The derivatives: u′ = 3 and v′ = 2x, which is 4 at x = 2. By the product rule P′(2) = u′v + uv′ = 3 × 9 + 8 × 4 = 27 + 32 = 59 watts per dial step.',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Product-rule plate', description: 'The growing rectangle that shows where u′v + uv′ comes from.' },
  sources: [source.s3_3],
  teaching: {
   intuition: 'Picture a rectangle with sides u and v; its area is the product uv. Now let both sides grow a little: u by a small amount Δu and v by Δv. The new area is the old one plus a strip Δu × v along one side, a strip u × Δv along the other, and a tiny corner Δu × Δv. Divide by the small change in x and let it shrink: the two strips become u′v and uv′, while the corner, a small amount times a small amount, vanishes. That is the product rule: the derivative of a product uv is u′v + uv′. Each factor’s change counts, weighted by the size of the other factor. It is not u′ times v′, which would be only the vanishing corner.',
   steps: [
    'Name the two factors u and v.',
    'Find u′ and v′ with the rules you already have.',
    'At the chosen input, work out u, v, u′ and v′ as numbers.',
    'Combine: the derivative is u′v + uv′.'
   ],
   example: {
    prompt: 'For P(x) = (x + 1)(x² + 3), find P′(1).',
    steps: [
     'u = x + 1 and v = x² + 3; u′ = 1 and v′ = 2x.',
     'At x = 1: u = 2, v = 4, u′ = 1, v′ = 2.',
     'P′(1) = 1 × 4 + 2 × 2 = 8.'
    ],
    answer: 'P′(1) = 8.'
   },
   pitfalls: [
    'Multiplying the derivatives: u′ × v′ is not the derivative of uv.',
    'Using only one of the two terms. Both factors change, so both u′v and uv′ are needed.',
    'Mixing up the pairing: each derivative is multiplied by the other factor, not by itself.'
   ]
  },
  guidance: [
   { prompt: 'The factors are u = 3x + 2 and v = x² + 5. What are u and v at x = 2?', answer: [8, 9], labels: ['u', 'v'], explanation: 'u = 3 × 2 + 2 = 8 and v = 4 + 5 = 9, so P(2) = 8 × 9 = 72.' },
   { prompt: 'Differentiate each factor: what are u′ and v′ at x = 2?', answer: [3, 4], labels: ['u′', 'v′'], explanation: 'u′ = 3, and v′ = 2x, which is 4 at x = 2.' },
   { prompt: 'Combine with the product rule: P′ = u′v + uv′. What is P′(2)?', answer: [59], labels: ['rate (W per dial step)'], explanation: '3 × 9 + 8 × 4 = 27 + 32 = 59.' }
  ]
 },
 {
  id: 'q19', title: 'Rating the cutting tool', topic: 'The quotient rule', tier: 'Intermediate', sector: 'Machine Shop',
  brief: 'A cutting tool’s rating is a ratio of two quantities that both depend on the feed speed, and the shop needs its rate of change.',
  lesson: 'Quotient rule: (f ÷ g)′ = (f′g − fg′) ÷ g².',
  prompt: 'The machine shop rates a cutting tool by the ratio E(x) = (3x + 2) ÷ (x + 3), where x is the feed speed. Enter E(2), then the rate of change E′(2) found with the quotient rule. Both are exact decimals.',
  answer: [1.6, 0.28], labels: ['ratio', 'rate of change'], tolerance: 0.005,
  hints: [
   'Call the top f = 3x + 2 and the bottom g = x + 3. Work out f, g, f′ and g′ at x = 2.',
   'The quotient rule: E′ = (f′g − fg′) ÷ g². Keep the order on top: the bottom times the derivative of the top comes first.'
  ],
  solution: 'At x = 2: f = 8 and g = 5, so E(2) = 8 ÷ 5 = 1.6. The derivatives are f′ = 3 and g′ = 1. By the quotient rule E′(2) = (3 × 5 − 8 × 1) ÷ 5² = 7 ÷ 25 = 0.28.',
  xp: 150, prereqs: ['q18'],
  artifact: { name: 'Ratio gauge', description: 'How fast a ratio moves when its top and bottom both change.' },
  sources: [source.s3_3],
  teaching: {
   intuition: 'A ratio f ÷ g rises when its top grows and falls when its bottom grows, so its rate of change has two parts that pull against each other. Growth of the top counts in proportion to the bottom, f′g; growth of the bottom counts against it, in proportion to the top, fg′. Their difference, f′g − fg′, is then divided by g², the square of the bottom: a ratio with a large bottom moves less. That is the quotient rule: the derivative of f ÷ g is (f′g − fg′) ÷ g². It follows from the product rule. Call the ratio q, so f = q × g. The product rule gives f′ = q′g + qg′. Solve for q′: q′ = (f′ − qg′) ÷ g. Put q = f ÷ g back in and tidy up: q′ = (f′g − fg′) ÷ g². The order on top matters because of the minus sign; a way to remember it: “bottom times derivative of top, minus top times derivative of bottom, over bottom squared”.',
   steps: [
    'Name the top f and the bottom g, and find f′ and g′.',
    'At the chosen input, work out f, g, f′ and g′ as numbers.',
    'Work out the top of the rule, f′g − fg′, keeping that order.',
    'Divide by g², the bottom squared.'
   ],
   example: {
    prompt: 'For E(x) = x ÷ (x + 1), find E′(1).',
    steps: [
     'f = x and g = x + 1, so f′ = 1 and g′ = 1. At x = 1: f = 1 and g = 2.',
     'Top of the rule: 1 × 2 − 1 × 1 = 1. Bottom: 2² = 4.',
     'E′(1) = 1 ÷ 4 = 0.25.'
    ],
    answer: 'E′(1) = 0.25.'
   },
   pitfalls: [
    'Swapping the order on top: fg′ − f′g gives the right size with the wrong sign.',
    'Dividing by g instead of g². The bottom of the rule is the bottom squared.',
    'Dividing the derivatives: f′ ÷ g′ is not the derivative of f ÷ g.'
   ]
  },
  guidance: [
   { prompt: 'What are the top f = 3x + 2 and the bottom g = x + 3 at x = 2?', answer: [8, 5], labels: ['top f', 'bottom g'], explanation: 'f = 3 × 2 + 2 = 8 and g = 2 + 3 = 5, so E(2) = 8 ÷ 5 = 1.6.' },
   { prompt: 'What are the derivatives f′ and g′?', answer: [3, 1], labels: ['f′', 'g′'], explanation: 'f′ = 3, the slope of 3x + 2, and g′ = 1, the slope of x + 3.' },
   { prompt: 'Work out the top of the quotient rule, f′g − fg′, at x = 2.', answer: [7], labels: ['f′g − fg′'], explanation: '3 × 5 − 8 × 1 = 15 − 8 = 7.' },
   { prompt: 'Divide by g² = 5². What is E′(2)?', answer: [0.28], labels: ['rate of change'], explanation: '7 ÷ 25 = 0.28.' }
  ]
 },
 {
  id: 'q20', title: 'Gears inside the fan', topic: 'The chain rule', tier: 'Intermediate', sector: 'Machine Shop',
  brief: 'A fan’s air flow depends on a power of a quantity that itself depends on the dial, and the shop wants to know how fast the flow responds.',
  lesson: 'Chain rule: the derivative of an outer function of an inner one is the outer derivative, at the inner value, times the inner derivative.',
  prompt: 'In the machine shop a cooling fan’s air flow is modelled as F(x) = (3x − 4)³ litres per second at dial setting x. Enter the value of the inside part 3x − 4 at x = 2, then F′(2) found with the chain rule.',
  answer: [2, 36], labels: ['inside value', 'rate of change'], tolerance: 0.01,
  hints: [
   'The outer function is “something to the power 3”, and the inner function is 3x − 4. Work out the inner value at x = 2 first.',
   'The chain rule: the derivative of the outer function, taken at the inner value, times the derivative of the inner function.'
  ],
  solution: 'The inner value at x = 2 is u = 3 × 2 − 4 = 2. The outer function u³ has derivative 3u², which is 3 × 2² = 12 at u = 2. The inner function 3x − 4 has derivative 3. By the chain rule F′(2) = 12 × 3 = 36 litres per second per dial step.',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Gear-train card', description: 'Rates multiply through a chain, like gears in a row.' },
  sources: [source.s3_6],
  teaching: {
   intuition: 'Some formulas are one function inside another. In (3x − 4)³ the inner function is u = 3x − 4 and the outer function is “cube it”, u³. Think of two gears in a row. When x moves, u moves 3 times as fast. When u moves, u³ moves 3u² times as fast, by the power rule. So u³ moves 3u² × 3 times as fast as x: the rates multiply. That is the chain rule: the derivative of an outer function of an inner one is the outer derivative, taken at the inner value, times the derivative of the inner function. Expanding (3x − 4)³ first would also work, but it is long; the chain rule keeps the inside packed up and just multiplies the two rates.',
   steps: [
    'Spot the inner function u (the part inside the brackets) and the outer function (what is done to it).',
    'Work out the inner value u at the chosen x.',
    'Differentiate the outer function as if u were the variable, and put in the inner value.',
    'Multiply by the derivative of the inner function.'
   ],
   example: {
    prompt: 'For F(x) = (2x + 1)², find F′(3).',
    steps: [
     'Inner u = 2x + 1, which is 7 at x = 3. Outer u², with derivative 2u.',
     'Outer derivative at u = 7: 2 × 7 = 14. Inner derivative: 2.',
     'F′(3) = 14 × 2 = 28.'
    ],
    answer: 'F′(3) = 28.'
   },
   pitfalls: [
    'Forgetting to multiply by the inner derivative: the derivative of (3x − 4)³ is 3(3x − 4)² × 3, not just 3(3x − 4)².',
    'Putting x instead of the inner value into the outer derivative: use u, the value of the inside.',
    'Applying the power rule to the inside alone, as if (3x − 4)³ were 3x³ − 4³.'
   ]
  },
  guidance: [
   { prompt: 'What is the inside part 3x − 4 at x = 2?', answer: [2], labels: ['inside value'], explanation: '3 × 2 − 4 = 2.' },
   { prompt: 'The outer function u³ has derivative 3u². What is it at u = 2?', answer: [12], labels: ['outer derivative'], explanation: '3 × 2² = 12. That is how fast the outer function changes per unit change of its inside.' },
   { prompt: 'The inside part changes 3 times as fast as x. Multiply: what is F′(2)?', answer: [36], labels: ['rate of change'], explanation: '12 × 3 = 36. The outer rate is scaled by the inner rate, like two gears in a row.' }
  ]
 }
);
})();
