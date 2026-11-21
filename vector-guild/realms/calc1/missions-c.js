/* Calculus 1 missions, file c: q21–q30 (docs/CALC1-PLAN.md lists the concepts).
   Mission objects as described in docs/PACK-FORMAT.md ("Mission"); the worked sample is q01 in missions-a.js.
   Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution and guidance here exactly);
   experiments: experiments-c.js; drill statements: variants-c.js; oracles: qa/realms/calc1/oracle-c.js. */
(function(){
'use strict';
/* OpenStax Calculus Volume 1 sections. Open each page before you set `verified` to the date you saw it. */
const source = {
 s3_3: { title: 'OpenStax Calculus Volume 1 — 3.3 Differentiation Rules', url: 'https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules', description: 'The power, constant multiple, sum, product and quotient rules.', verified: '2026-11-21' },
 s3_5: { title: 'OpenStax Calculus Volume 1 — 3.5 Derivatives of Trigonometric Functions', url: 'https://openstax.org/books/calculus-volume-1/pages/3-5-derivatives-of-trigonometric-functions', description: 'The derivatives of sine and cosine, and of the other trigonometric functions, with angles in radians.', verified: '2026-11-21' },
 s3_6: { title: 'OpenStax Calculus Volume 1 — 3.6 The Chain Rule', url: 'https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule', description: 'Differentiating a function inside another function.', verified: '2026-11-21' },
 s3_8: { title: 'OpenStax Calculus Volume 1 — 3.8 Implicit Differentiation', url: 'https://openstax.org/books/calculus-volume-1/pages/3-8-implicit-differentiation', description: 'Finding dy/dx from an equation in x and y, and tangent lines to such curves.', verified: '2026-11-21' },
 s3_9: { title: 'OpenStax Calculus Volume 1 — 3.9 Derivatives of Exponential and Logarithmic Functions', url: 'https://openstax.org/books/calculus-volume-1/pages/3-9-derivatives-of-exponential-and-logarithmic-functions', description: 'The derivatives of e^x, of ln x and of other exponentials and logarithms.', verified: '2026-11-21' },
 s4_1: { title: 'OpenStax Calculus Volume 1 — 4.1 Related Rates', url: 'https://openstax.org/books/calculus-volume-1/pages/4-1-related-rates', description: 'Linking the rates of quantities tied by an equation, such as a sliding ladder.', verified: '2026-11-21' },
 s4_2: { title: 'OpenStax Calculus Volume 1 — 4.2 Linear Approximations and Differentials', url: 'https://openstax.org/books/calculus-volume-1/pages/4-2-linear-approximations-and-differentials', description: 'Estimating values with the tangent line, and the differentials dx and dy.', verified: '2026-11-21' },
 s4_3: { title: 'OpenStax Calculus Volume 1 — 4.3 Maxima and Minima', url: 'https://openstax.org/books/calculus-volume-1/pages/4-3-maxima-and-minima', description: 'Critical points, local extrema, and absolute extrema on a closed interval.', verified: '2026-11-21' },
 s4_5: { title: 'OpenStax Calculus Volume 1 — 4.5 Derivatives and the Shape of a Graph', url: 'https://openstax.org/books/calculus-volume-1/pages/4-5-derivatives-and-the-shape-of-a-graph', description: 'Increasing and decreasing, the first and second derivative tests, concavity and inflection points.', verified: '2026-11-21' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: 'Timing the cam follower', topic: 'Derivatives of sine and cosine', tier: 'Intermediate', sector: 'Machine Shop',
  brief: 'A cam on the lathe drives a follower arm back and forth, and the shop needs the arm’s speed at three moments of its cycle.',
  lesson: 'With the angle in radians, the derivative of sin x is cos x and the derivative of cos x is −sin x.',
  prompt: 'In the machine shop a cam pushes a follower arm back and forth. The arm’s position is h(t) = 6 sin t + 4 cos t millimetres, where t is the time in seconds and the angle t is in radians. The velocity is the derivative h′(t). Enter the velocity in millimetres per second at t = 0, then at t = π/2, then at t = π/6 (round the last one to 2 decimal places).',
  answer: [6, -4, 3.2], labels: ['h′(0) (mm/s)', 'h′(π/2) (mm/s)', 'h′(π/6) (mm/s)'], tolerance: 0.005,
  hints: [
   'The derivative of sin t is cos t, and the derivative of cos t is −sin t. A number in front of a function stays in front of its derivative.',
   'Read the unit circle: cos 0 = 1 and sin 0 = 0; cos(π/2) = 0 and sin(π/2) = 1; cos(π/6) = √3 ÷ 2, about 0.866, and sin(π/6) = 0.5.'
  ],
  solution: 'Differentiate each part: h′(t) = 6 cos t − 4 sin t. At t = 0: 6 × 1 − 4 × 0 = 6 mm/s. At t = π/2: 6 × 0 − 4 × 1 = −4 mm/s, so the arm is moving backwards there. At t = π/6: 6 × (√3 ÷ 2) − 4 × 0.5 ≈ 5.1962 − 2 ≈ 3.20 mm/s to 2 decimal places.',
  xp: 150, prereqs: ['q15', 'q16'],
  sources: [source.s3_5],
  teaching: {
   intuition: 'In calculus, angles are measured in radians. One radian is the angle whose arc along a circle is exactly as long as the radius, so on a circle of radius 1 the angle and the arc length are the same number: a full turn is 2π radians, a half turn is π, and a quarter turn is π/2 (that is, π ÷ 2). Now picture a point walking around that circle at a steady 1 unit of arc per second, so after t seconds it has turned through t radians. Its height is sin t and its sideways position is cos t. The point always moves at right angles to the radius, at speed 1. At t = 0 it is at the far right, moving straight up at full speed: the height changes at rate 1, which is cos 0. At the top, t = π/2, it moves purely sideways, so for that instant its height is not changing: rate 0, which is cos(π/2). Follow it all the way round and the rate of change of the height is always cos t, while the sideways position changes at −sin t (it moves left while it is above the centre). That is why the derivative of sin is cos and the derivative of cos is −sin. In degrees the same rules would need an extra factor, which is why calculus uses radians.',
   steps: [
    'Check that the angle is in radians: the rules below hold only in radians.',
    'Replace each sin by cos, and each cos by −sin. A number in front stays in front, and a sum is differentiated term by term.',
    'Put the time into the derivative, using unit-circle values: sin 0 = 0, cos 0 = 1, sin(π/2) = 1, cos(π/2) = 0, sin(π/6) = 0.5, cos(π/6) = √3 ÷ 2.',
    'Read the sign: a negative rate means the quantity is decreasing at that moment.'
   ],
   example: {
    prompt: 'A swinging sensor sits at s(t) = 3 sin t − 2 cos t centimetres, t in seconds, with the angle in radians. What is its velocity at t = π?',
    steps: ['s′(t) = 3 cos t − 2 × (−sin t) = 3 cos t + 2 sin t.', 'At t = π: cos π = −1 and sin π = 0, so s′(π) = 3 × (−1) + 2 × 0 = −3.'],
    answer: '−3 centimetres per second: at that moment the sensor is moving backwards.'
   },
   pitfalls: [
    'Giving cos the derivative sin. The minus sign matters: the derivative of cos t is −sin t.',
    'Using degrees. π/6 is an angle in radians (the same turn as 30°), about 0.52. A calculator left in degree mode treats that 0.52 as 0.52°, a tiny angle, and gives cos ≈ 1.00 instead of 0.866.',
    'Putting the time in before differentiating. The derivative of sin t at t = 0 is cos 0 = 1, not sin 0 = 0.'
   ]
  },
  guidance: [
   { prompt: 'Differentiate h(t) = 6 sin t + 4 cos t one part at a time. The result has the form h′(t) = A cos t + B sin t. Enter A, then B.', answer: [6, -4], labels: ['A (number before cos t)', 'B (number before sin t)'], explanation: 'sin t becomes cos t, so 6 sin t becomes 6 cos t. cos t becomes −sin t, so 4 cos t becomes −4 sin t. So h′(t) = 6 cos t − 4 sin t.' },
   { prompt: 'Put t = 0 and then t = π/2 into h′(t) = 6 cos t − 4 sin t. Use cos 0 = 1, sin 0 = 0, cos(π/2) = 0, sin(π/2) = 1.', answer: [6, -4], labels: ['h′(0) (mm/s)', 'h′(π/2) (mm/s)'], explanation: 'h′(0) = 6 × 1 − 4 × 0 = 6 and h′(π/2) = 6 × 0 − 4 × 1 = −4.' },
   { prompt: 'Now t = π/6, where cos(π/6) = √3 ÷ 2 ≈ 0.866 and sin(π/6) = 0.5. What is h′(π/6), to 2 decimal places?', answer: [3.2], labels: ['h′(π/6) (mm/s)'], explanation: '6 × (√3 ÷ 2) ≈ 5.1962 and 4 × 0.5 = 2. The difference is about 3.20.' }
  ]
 },
 {
  id: 'q22', title: 'Chips and wear on the long cut', topic: 'Derivatives of e to the x and the natural logarithm', tier: 'Intermediate', sector: 'Machine Shop',
  brief: 'A long cutting run is filling the chip collector and wearing down the tool, and the shop wants to know how fast each is happening.',
  lesson: 'The derivative of e^x is e^x itself, and the derivative of ln x is 1 ÷ x.',
  prompt: 'During a long cutting run the machine shop logs two numbers. The metal chips in the collector grow as C(t) = 200e^(0.3t) chips, and the wear on the cutting edge since the 1-minute check is W(t) = 12 ln t micrometres for t ≥ 1, where t is the time in minutes. Enter the rate at which chips are piling up at t = 0, in chips per minute, then the rate at which the edge is wearing at t = 4, in micrometres per minute.',
  answer: [60, 3], labels: ['chip rate at t = 0 (chips/min)', 'wear rate (µm/min)'], tolerance: 0.01,
  hints: [
   'The derivative of e^x is e^x itself. With a number k multiplying t in the power, the chain rule brings that k down in front: the derivative of e^(kt) is k e^(kt). And e^0 = 1.',
   'The derivative of ln t is 1 ÷ t. A number in front stays in front.'
  ],
  solution: 'C′(t) = 200 × 0.3 e^(0.3t) = 60e^(0.3t). At t = 0, e^0 = 1, so C′(0) = 60 chips per minute. W′(t) = 12 ÷ t, so W′(4) = 12 ÷ 4 = 3 micrometres per minute.',
  xp: 150, prereqs: ['q20'],
  sources: [source.s3_9],
  teaching: {
   intuition: 'The number e, about 2.718, is the base that makes growth simplest. For any base b, the slope of the graph of b^x is proportional to its height: the bigger it is, the faster it grows. For base 2 the slope is about 0.69 times the height; for base 3 it is about 1.10 times. Somewhere between them is the one base where the slope is exactly equal to the height, and that base is e. So the derivative of e^x is e^x itself: at every point the rate of growth equals the amount. With e^(kt), the chain rule brings out the k: the derivative is k e^(kt), so a bigger k means faster growth. The natural logarithm ln x is the inverse of e^x: ln x is the power you raise e to in order to get x. Its graph is the graph of e^x mirrored in the line y = x, and mirroring swaps rise and run, so each slope turns into its reciprocal. At the point (x, ln x) on the log curve, the mirror point on e^x has height x, so slope x; the log curve there has slope 1 ÷ x. That is why the derivative of ln x is 1 ÷ x: it climbs steeply near 0 and ever more slowly further out.',
   steps: [
    'For e^x the derivative is e^x. For e^(kt) it is k e^(kt): by the chain rule, the derivative of the power kt is k.',
    'For ln x the derivative is 1 ÷ x, for x greater than 0.',
    'A number in front stays in front: the derivative of a e^(kt) is a × k e^(kt), and of b ln t it is b ÷ t.',
    'Put in the time. At t = 0, e^0 = 1, so the rate of a e^(kt) there is just a × k.'
   ],
   example: {
    prompt: 'A battery’s charge is Q(t) = 50e^(0.2t) units and a seal’s creep is S(t) = 9 ln t millimetres, t in hours. Find Q′(0) and S′(3).',
    steps: ['Q′(t) = 50 × 0.2 e^(0.2t) = 10e^(0.2t), and e^0 = 1, so Q′(0) = 10.', 'S′(t) = 9 ÷ t, so S′(3) = 9 ÷ 3 = 3.'],
    answer: 'Q′(0) = 10 units per hour and S′(3) = 3 millimetres per hour.'
   },
   pitfalls: [
    'Using the power rule on e^x. The variable is in the power, not the base, so “bring the power down” does not apply: the derivative of e^x is e^x.',
    'Forgetting the k from the chain rule: the derivative of e^(0.7t) is 0.7e^(0.7t), not e^(0.7t).',
    'Writing the derivative of ln t as 1 ÷ ln t. It is simply 1 ÷ t.'
   ]
  },
  guidance: [
   { prompt: 'The derivative of e^(0.3t) is 0.3e^(0.3t). Then C′(t) = 200 × 0.3 e^(0.3t). What number multiplies e^(0.3t) in C′(t)?', answer: [60], labels: ['number in front of e^(kt)'], explanation: '200 × 0.3 = 60, so C′(t) = 60e^(0.3t).' },
   { prompt: 'At t = 0 the power is 0, and e^0 = 1. What is C′(0)?', answer: [60], labels: ['C′(0) (chips/min)'], explanation: 'C′(0) = 60 × 1 = 60 chips per minute.' },
   { prompt: 'The derivative of 12 ln t is 12 ÷ t. What is W′(4)?', answer: [3], labels: ['wear rate (µm/min)'], explanation: '12 ÷ 4 = 3 micrometres per minute.' }
  ]
 },
 {
  id: 'q23', title: 'Three parts, three rules', topic: 'Choosing the differentiation rule', tier: 'Intermediate', sector: 'Machine Shop',
  brief: 'Three new parts are waiting on the bench, and each profile needs its slope checked before it goes to the lathe.',
  lesson: 'Before differentiating, find the last operation in the formula: a product, a quotient, or a function applied to a bracket.',
  prompt: 'Three parts on the machine-shop bench have profiles u(x) = x²(x + 3), v(x) = (2x + 6) ÷ (x + 1) and w(x) = (3x − 1)³. Choose the right rule for each and enter the slopes u′(1), v′(1) and w′(1), in that order.',
  answer: [9, -1, 36], labels: ['slope of u', 'slope of v', 'slope of w'], tolerance: 0.01,
  hints: [
   'Ask what the last operation is in each formula. u multiplies two factors (product rule), v divides one by another (quotient rule), and w raises a bracket to a power (chain rule).',
   'Product: f′g + fg′. Quotient: (f′g − fg′) ÷ g². Chain: the outer derivative at the inside, times the inside’s derivative.'
  ],
  solution: 'u is a product: u′(x) = 2x(x + 3) + x² × 1, so u′(1) = 8 + 1 = 9. v is a quotient: v′(x) = (2(x + 1) − (2x + 6)) ÷ (x + 1)², so v′(1) = (4 − 8) ÷ 4 = −4 ÷ 4 = −1. w is a power of a bracket: w′(x) = 3(3x − 1)² × 3, so w′(1) = 3 × 4 × 3 = 36.',
  xp: 150, prereqs: ['q19', 'q20'],
  sources: [source.s3_3, source.s3_6],
  teaching: {
   intuition: 'Every rule so far answers one question: how is this formula built? Imagine working it out by hand for one number x, and notice the very last thing you would do. If the last step multiplies two pieces that both contain x, it is a product, and the product rule f′g + fg′ applies: each factor takes its turn to change while the other holds still. If the last step divides, it is a quotient: (f′g − fg′) ÷ g². If the last step applies a function (a power, a sine, an exponential or a logarithm) to a whole bracket that itself depends on x, it is a function inside a function, and the chain rule applies: the outer rate times the inner rate, like two gears in a train. A plain sum of powers needs only the power rule, term by term. Choosing by the last operation means you never apply a rule to the wrong shape, and even a big formula breaks into these few pieces.',
   steps: [
    'Find the last operation you would do to evaluate the formula at a number.',
    'Product: f′g + fg′. Quotient: (f′g − fg′) ÷ g². A function of a bracket: the outer derivative at the bracket, times the bracket’s derivative.',
    'Differentiate the pieces with the power rule (and the sine, cosine, e^x and ln x rules when they appear).',
    'Put the number in only at the end, after the rule has been applied.'
   ],
   example: {
    prompt: 'Find the slopes at x = 2 of p(x) = x(x + 4), r(x) = x ÷ (x + 2) and s(x) = (2x − 3)⁴.',
    steps: ['p is a product: p′(x) = (x + 4) + x, so p′(2) = 6 + 2 = 8.', 'r is a quotient: r′(x) = ((x + 2) − x) ÷ (x + 2)² = 2 ÷ (x + 2)², so r′(2) = 2 ÷ 16 = 0.125.', 's is a power of a bracket: s′(x) = 4(2x − 3)³ × 2, so s′(2) = 4 × 1 × 2 = 8.'],
    answer: 'p′(2) = 8, r′(2) = 0.125 and s′(2) = 8.'
   },
   pitfalls: [
    'Multiplying the two derivatives for a product: the derivative of x²(x + 7) is not 2x × 1.',
    'Reversing the top of the quotient rule. It is f′g − fg′, with the top function’s derivative first; swapping them flips the sign.',
    'Forgetting the inside derivative in the chain rule: the derivative of (5x + 2)³ is 3(5x + 2)² × 5, not just 3(5x + 2)².'
   ]
  },
  guidance: [
   { prompt: 'Product rule for u(x) = x²(x + 3): u′(x) = 2x(x + 3) + x². What is u′(1)?', answer: [9], labels: ['slope of u'], explanation: '2 × 1 × 4 = 8 and 1² = 1, so u′(1) = 9.' },
   { prompt: 'Quotient rule for v(x) = (2x + 6) ÷ (x + 1). At x = 1, the top is 8 with derivative 2, and the bottom is 2 with derivative 1. Work out (2 × 2 − 8 × 1) ÷ 2².', answer: [-1], labels: ['slope of v'], explanation: '(4 − 8) ÷ 4 = −4 ÷ 4 = −1.' },
   { prompt: 'Chain rule for w(x) = (3x − 1)³: the outer part is (inside)³ with derivative 3(inside)², and the inside 3x − 1 has derivative 3. At x = 1 the inside is 2. What is w′(1)?', answer: [36], labels: ['slope of w'], explanation: '3 × 2² × 3 = 3 × 4 × 3 = 36.' }
  ]
 },
 {
  id: 'q24', title: 'The curved walkway', topic: 'Implicit differentiation', tier: 'Intermediate', sector: 'Launch Gantry',
  brief: 'The crew walkway around the gantry curves along an oval, and the railing crew needs its slope at a fixing point.',
  lesson: 'Differentiate both sides of an equation in x and y, treat y as a function of x, and solve for dy/dx.',
  prompt: 'The gantry’s crew walkway is curved along the oval 3x² + 2y² = 30 (on the site plan, where one unit is 10 metres, seen from above). The point (2, 3) is on it. Using implicit differentiation, enter the slope dy/dx of the walkway at that point, then the y-intercept of the tangent line there (give decimals, not fractions).',
  answer: [-1, 5], labels: ['slope dy/dx', 'y-intercept of the tangent'], tolerance: 0.005,
  hints: [
   'Differentiate both sides with respect to x. The 3x² term gives 6x as usual; 2y² gives 4y × dy/dx, because y itself depends on x (chain rule). The constant on the right gives 0.',
   'Collect the dy/dx term on one side and divide. For the tangent line, use y = y₀ + slope × (x − x₀), where (x₀, y₀) is the point (the small 0 just marks the point’s own coordinates), and put x = 0.'
  ],
  solution: 'Differentiating: 6x + 4y × dy/dx = 0, so dy/dx = −6x ÷ (4y). At (2, 3): dy/dx = −12 ÷ 12 = −1. The tangent line is y = 3 + (−1) × (x − 2); at x = 0 it gives y = 3 + 2 = 5.',
  xp: 150, prereqs: ['q13', 'q20'],
  sources: [source.s3_8],
  teaching: {
   intuition: 'Not every curve is a graph y = f(x). An oval such as x² + 4y² = 20 is an equation that ties x and y together, and solving it for y gives an awkward square root, in fact two of them (top and bottom). Implicit differentiation avoids that. Near any point where the curve is not vertical, a short piece of it is an ordinary graph, so there y behaves like a function of x. Both sides of the equation stay equal as you move along the curve, so their rates of change with x must be equal too. So differentiate each side with respect to x (that is, with x as the variable that changes). A term in x alone works as usual. A term in y needs the chain rule, because y itself changes with x: the derivative of y² is 2y times dy/dx. Here dy/dx means the derivative of y with respect to x, which is the slope of the curve. It is one symbol, read “d y d x”, not a division of d times y by d times x. The result is one equation with dy/dx in it; solve it like any linear equation. The slope then depends on both coordinates of the point, which is how the formula knows whether you are on the top or the bottom of the oval.',
   steps: [
    'Differentiate every term of both sides with respect to x.',
    'For each term containing y, use the chain rule: differentiate as if y were x, then multiply by dy/dx.',
    'A constant gives 0. Collect the terms with dy/dx on one side and divide to get dy/dx.',
    'Put in the coordinates of the point. For the tangent line, use y = y₀ + slope × (x − x₀), where (x₀, y₀) is the point (the small 0 just marks the point’s own coordinates).'
   ],
   example: {
    prompt: 'On the circle x² + y² = 25, find the slope at (3, 4) and where the tangent line there crosses the y-axis.',
    steps: ['2x + 2y × dy/dx = 0, so dy/dx = −x ÷ y.', 'At (3, 4): dy/dx = −3 ÷ 4 = −0.75.', 'Tangent line: y = 4 + (−0.75) × (x − 3). At x = 0: y = 4 + 2.25 = 6.25.'],
    answer: 'Slope −0.75; the tangent line crosses the y-axis at 6.25.'
   },
   pitfalls: [
    'Writing the derivative of y² as 2y and forgetting the dy/dx. y depends on x, so the chain rule adds that factor.',
    'Differentiating the constant on the right as itself. The derivative of a fixed number is 0.',
    'Swapping the coordinates: in dy/dx = −ax ÷ (by), x and y must be the point’s own x and y.'
   ]
  },
  guidance: [
   { prompt: 'Differentiate 3x² + 2y² = 30 with respect to x. You get A·x + B·y·dy/dx = 0. Enter A, then B.', answer: [6, 4], labels: ['A (number before x)', 'B (number before y·dy/dx)'], explanation: '3x² gives 6x. 2y² gives 4y × dy/dx by the chain rule, since y changes with x. 30 is a constant, so it gives 0.' },
   { prompt: 'So dy/dx = −6x ÷ (4y). What is it at x = 2, y = 3?', answer: [-1], labels: ['slope dy/dx'], explanation: '−12 ÷ 12 = −1.' },
   { prompt: 'The tangent line goes through (2, 3) with slope −1. Where does it cross the y-axis (x = 0)?', answer: [5], labels: ['y-intercept of the tangent'], explanation: 'y = 3 + (−1) × (0 − 2) = 3 + 2 = 5.' }
  ]
 },
 {
  id: 'q25', title: 'The sliding ladder', topic: 'Related rates', tier: 'Intermediate', sector: 'Launch Gantry',
  brief: 'An access ladder on the launch tower has started to slip, and the crew at the top needs to know how fast they are coming down.',
  lesson: 'When quantities are linked by an equation, differentiate it with respect to time to link their rates.',
  prompt: 'A 13 m access ladder leans against the launch tower. Its foot slides straight away from the tower along level ground at 0.6 m/s, and its top slides down the tower. At the moment the foot is 5 m from the tower, enter how high up the tower the top is, in metres, then how fast the top is sliding down, in metres per second (as a positive number).',
  answer: [12, 0.25], labels: ['height of the top (m)', 'speed of the top downwards (m/s)'], tolerance: 0.005,
  hints: [
   'Call the foot’s distance x and the top’s height y. The ladder is the long side of a right triangle, so x² + y² is the ladder’s length squared at every moment.',
   'Differentiate x² + y² = constant with respect to time t: 2x dx/dt + 2y dy/dt = 0. You know x, y and dx/dt; solve for dy/dt.'
  ],
  solution: 'First the height: y² = 169 − 25 = 144, so y = 12 m. Differentiating x² + y² = 169 with respect to time gives 2x dx/dt + 2y dy/dt = 0, so dy/dt = −x dx/dt ÷ y = −5 × 0.6 ÷ 12 = −0.25 m/s. The minus sign means the top moves down, at 0.25 m/s.',
  xp: 150, prereqs: ['q24'],
  sources: [source.s4_1],
  teaching: {
   intuition: 'When two quantities are tied by an equation, their rates of change are tied as well. Problems like this are called related rates. A ladder against a wall makes a right triangle whose long side, the ladder, has a fixed length L: if the foot is x out and the top is y up, then x² + y² = L² at every moment. As the foot slides out, x grows, so y must shrink to keep the sum the same. How fast? Both x and y are functions of time t, and the equation holds at every instant, so we can differentiate both sides with respect to t, exactly as in implicit differentiation but with time as the variable. The chain rule gives 2x dx/dt + 2y dy/dt = 0, where dx/dt is the foot’s rate and dy/dt is the top’s rate. At a given instant we know x, y and dx/dt, so dy/dt follows. Notice that the top does not fall at a steady speed even when the foot slides steadily: dy/dt = −x dx/dt ÷ y, so when y is small the top drops very fast. That is why we differentiate first and put in the numbers of the instant only afterwards.',
   steps: [
    'Name every changing quantity (here x and y) and every fixed one (the ladder’s length).',
    'Write the equation that links them at every moment, such as x² + y² = L².',
    'Differentiate both sides with respect to time t, using the chain rule on each changing quantity.',
    'Only now put in the values at the instant asked about, and solve for the unknown rate. Read its sign: negative means decreasing.'
   ],
   example: {
    prompt: 'A 10 m ladder’s foot slides away from a wall at 1 m/s. How fast is the top sliding down when the foot is 6 m out?',
    steps: ['The top is √(100 − 36) = 8 m up.', '2x dx/dt + 2y dy/dt = 0 gives dy/dt = −x dx/dt ÷ y = −6 × 1 ÷ 8 = −0.75.'],
    answer: 'The top slides down at 0.75 m/s.'
   },
   pitfalls: [
    'Putting the numbers in before differentiating. The foot’s distance is that value only at one instant; with it fixed as a number, its rate would wrongly vanish.',
    'Assuming the top moves at the same speed as the foot. The rates are linked through x and y, and are equal only when x = y.',
    'Dropping the minus sign without knowing why. dy/dt is negative because the height decreases; the speed down is its size.'
   ]
  },
  guidance: [
   { prompt: 'By Pythagoras, 5² + y² = 13². How high is the top, y?', answer: [12], labels: ['height y (m)'], explanation: 'y² = 169 − 25 = 144, so y = 12 m.' },
   { prompt: 'Differentiating x² + y² = 169 with respect to time gives 2x dx/dt + 2y dy/dt = 0. Put in x = 5, y = 12 and dx/dt = 0.6. What is dy/dt?', answer: [-0.25], labels: ['dy/dt (m/s)'], explanation: '2 × 5 × 0.6 + 2 × 12 × dy/dt = 0, so dy/dt = −6 ÷ 24 = −0.25 m/s.' },
   { prompt: 'dy/dt is negative because the height is shrinking. How fast is the top sliding down, as a positive speed?', answer: [0.25], labels: ['speed of the top downwards (m/s)'], explanation: 'The top slides down at 0.25 m/s.' }
  ]
 },
 {
  id: 'q26', title: 'Sizing the blast plate', topic: 'Linear approximation and differentials', tier: 'Intermediate', sector: 'Launch Gantry',
  brief: 'A blast plate for the gantry is being cut square to a given area, and the crew wants its side length without waiting for a calculator.',
  lesson: 'Near a point a, f(x) ≈ f(a) + f′(a)(x − a): the tangent line stands in for the curve.',
  prompt: 'The gantry crew needs the side length of a square blast plate whose area is 103 m², with no calculator. The side of a square of area x is f(x) = √x. Use the linear approximation of f at x = 100, where √100 = 10. Enter the slope f′(100), then the estimated change in the side, dy, for the change in area dx = 3, then the estimated side length in metres.',
  answer: [0.05, 0.15, 10.15], labels: ['slope f′(a)', 'change dy (m)', 'estimated side (m)'], tolerance: 0.0005,
  hints: [
   'Write √x as x^(1/2). The power rule gives f′(x) = (1/2)x^(−1/2), which is 1 ÷ (2√x).',
   'The differential dy = f′(a) × dx is the change along the tangent line. The estimate is f(a) + dy.'
  ],
  solution: 'f′(x) = 1 ÷ (2√x), so f′(100) = 1 ÷ (2 × 10) = 0.05. The estimated change is dy = 0.05 × 3 = 0.15. So √103 ≈ 10 + 0.15 = 10.15 m.',
  xp: 150, prereqs: ['q13', 'q14'],
  sources: [source.s4_2],
  teaching: {
   intuition: 'Zoom in on a smooth curve and it looks more and more like a straight line: the tangent line at that point. So close to a point a where we know everything, we can let the tangent line stand in for the curve. This is the linear approximation: f(x) ≈ f(a) + f′(a) × (x − a). Start from the known value f(a) and add the slope times how far you moved. The step in the input is written dx, and the matching change along the tangent line is dy = f′(a) × dx. These two are called differentials: small changes measured along the tangent line rather than along the curve itself. For square roots this is very handy. We know √49 = 7 exactly, and the slope of √x at 49 tells us how much the root moves for each unit the input moves, so √51 is about 7 plus 2 times that slope. The further you move from a, the more the curve bends away from its tangent, so the estimate is best for small dx.',
   steps: [
    'Pick a nearby point a where f(a) is easy (for a square root, a perfect square).',
    'Find the slope f′(a). For √x, write it as x^(1/2): the power rule gives (1/2)x^(−1/2), which is 1 ÷ (2√x).',
    'The differential dy = f′(a) × dx is the estimated change, where dx is how far the input moves from a.',
    'The estimate is f(a) + dy.'
   ],
   example: {
    prompt: 'Estimate √9.6 with the tangent line of √x at x = 9.',
    steps: ['√9 = 3 and f′(9) = 1 ÷ (2 × 3), which is 1 ÷ 6.', 'dx = 0.6, so dy = 0.6 ÷ 6 = 0.1.', 'Estimate: 3 + 0.1 = 3.1. The true value is 3.098…, very close.'],
    answer: '√9.6 ≈ 3.1'
   },
   pitfalls: [
    'Taking the slope at the point you are estimating instead of at the known point a.',
    'Adding dx instead of dy: the input moves by dx, but the output moves by f′(a) × dx.',
    'Forgetting the sign when the input is below a: then dx is negative and the estimate is below f(a).'
   ]
  },
  guidance: [
   { prompt: 'f′(x) = 1 ÷ (2√x). What is f′(100)?', answer: [0.05], labels: ['slope f′(a)'], explanation: '1 ÷ (2 × 10) = 1 ÷ 20 = 0.05.' },
   { prompt: 'The area changes by dx = 3. Along the tangent line the side changes by dy = f′(100) × dx. What is dy?', answer: [0.15], labels: ['change dy (m)'], explanation: '0.05 × 3 = 0.15.' },
   { prompt: 'Add the change to the known side: 10 + 0.15. What is the estimate?', answer: [10.15], labels: ['estimated side (m)'], explanation: '10 + 0.15 = 10.15 m. The true value is very close, because the curve hugs its tangent line near x = 100.' }
  ]
 },
 {
  id: 'q27', title: 'Pressure peaks in the fuel line', topic: 'Critical points, increasing and decreasing', tier: 'Intermediate', sector: 'Launch Gantry',
  brief: 'Fuel-line pressure rises and falls after the pumps start, and the launch team needs the times it turns around and its peak.',
  lesson: 'A function rises where f′ > 0 and falls where f′ < 0; its turning points are among the critical points, where f′ = 0 or does not exist.',
  prompt: 'Pressure in a fuel line at the launch gantry follows P(t) = t³ − 9t² + 24t + 10 kilopascals, t minutes after the pumps start. Find the critical points of P. Enter the earlier critical time, then the later one, then the pressure at the local maximum.',
  answer: [2, 4, 30], labels: ['earlier critical time (min)', 'later critical time (min)', 'local maximum pressure (kPa)'], tolerance: 0.01,
  hints: [
   'A critical point is where P′(t) = 0. Use the power rule, then factor the quadratic after taking out the common factor 3.',
   'P rises where P′ > 0 and falls where P′ < 0. Test one time before, between and after the two critical points; a change from rising to falling is a local maximum.'
  ],
  solution: 'P′(t) = 3t² − 18t + 24 = 3(t² − 6t + 8) = 3(t − 2)(t − 4), which is 0 at t = 2 and t = 4. P′ is positive before 2, negative between 2 and 4 (for example P′(3) = −3), and positive after 4. So P rises, then falls, then rises: the local maximum is at t = 2, where P(2) = 30 kPa, and the local minimum is at t = 4, where P = 26 kPa.',
  xp: 150, prereqs: ['q15'],
  sources: [source.s4_3, source.s4_5],
  teaching: {
   intuition: 'The derivative is the slope, and the slope tells you which way the graph is going. Where f′(x) > 0 the function is increasing (uphill from left to right); where f′(x) < 0 it is decreasing. To change from one to the other, a smooth slope has to pass through 0, so the top of a hill or the bottom of a valley can only be where f′(x) = 0, or where the derivative does not exist (at a sharp corner). Those inputs are called critical points. A hilltop, higher than everything near it, is a local maximum; a valley floor is a local minimum. Not every critical point is a turn: a graph can flatten for a moment and carry on the same way. So after finding the critical points, check the sign of f′ on each side (the first derivative test): + then − is a local maximum, − then + is a local minimum, and the same sign on both sides is no turn at all.',
   steps: [
    'Differentiate and set f′(x) = 0. Solve it (factor if you can) to get the critical points.',
    'They cut the number line into pieces. Pick a test number in each piece and find the sign of f′ there.',
    'f′ > 0 means increasing, f′ < 0 means decreasing. A change from + to − is a local maximum; from − to + a local minimum.',
    'Put the critical point into f itself to get the value of the maximum or minimum.'
   ],
   example: {
    prompt: 'Where does g(x) = x³ − 12x + 5 have its local maximum, and what is the value there?',
    steps: ['g′(x) = 3x² − 12 = 3(x − 2)(x + 2), so the critical points are −2 and 2.', 'g′(−3) = 15 > 0, g′(0) = −12 < 0, g′(3) = 15 > 0: rising, falling, rising.', 'The local maximum is at x = −2: g(−2) = −8 + 24 + 5 = 21.'],
    answer: 'A local maximum of 21 at x = −2 (and a local minimum at x = 2).'
   },
   pitfalls: [
    'Putting the critical point into f′ to get the height. f′ is 0 there by definition; the value comes from f.',
    'Calling every critical point a maximum or minimum without testing the signs. f(x) = x³ has f′(0) = 0 but keeps rising.',
    'Mixing up the two turns: for a cubic whose leading term is positive, the earlier critical point is the hilltop.'
   ]
  },
  guidance: [
   { prompt: 'P′(t) = 3t² − 18t + 24 = 3(t² − 6t + 8). Which two times make it zero? Enter the smaller, then the larger.', answer: [2, 4], labels: ['earlier critical time (min)', 'later critical time (min)'], explanation: 't² − 6t + 8 = (t − 2)(t − 4), which is 0 at t = 2 and t = 4.' },
   { prompt: 'Test the sign of P′ between the critical points, at t = 3. What is P′(3)?', answer: [-3], labels: ['P′ at the middle time'], explanation: '3(3 − 2)(3 − 4) = −3, negative, so P falls between them. Before 2 and after 4 both brackets have the same sign, so P′ > 0 there. P rises up to t = 2 and then falls: that is a local maximum.' },
   { prompt: 'What is the pressure at the local maximum, P(2)?', answer: [30], labels: ['local maximum pressure (kPa)'], explanation: 'P(2) = 8 − 36 + 48 + 10 = 30 kPa.' }
  ]
 },
 {
  id: 'q28', title: 'The tethered balloon', topic: 'Concavity and the second derivative test', tier: 'Intermediate', sector: 'Launch Gantry',
  brief: 'A tethered test balloon dips, climbs and drops again above the gantry, and the weather crew wants its high point and the moment its climb is fastest.',
  lesson: 'f″ > 0 means concave up (a cup) and f″ < 0 concave down (a cap); at a critical point this tells a minimum from a maximum.',
  prompt: 'A tethered test balloon above the launch gantry has height h(t) = −t³ + 9t² − 15t + 20 metres, t minutes after release, for 0 ≤ t ≤ 7. Its critical points are t = 1 and t = 5. Enter the second derivative h″ at t = 1, then the height at the local maximum, then the time of the inflection point.',
  answer: [12, 45, 3], labels: ['h″ at the earlier critical point', 'height at the local maximum (m)', 'time of the inflection point (min)'], tolerance: 0.01,
  hints: [
   'Differentiate twice: h′(t) = −3t² + …, then h″(t) is the derivative of h′(t).',
   'Second derivative test: h″ > 0 at a critical point means concave up, a local minimum; h″ < 0 means concave down, a local maximum. The inflection point is where h″(t) = 0 and changes sign.'
  ],
  solution: 'h′(t) = −3t² + 18t − 15 and h″(t) = −6t + 18. At t = 1: h″ = −6 + 18 = 12 > 0, so the curve is concave up there and t = 1 is a local minimum. At t = 5: h″ = −12 < 0, so t = 5 is the local maximum, with h(5) = 45 m. h″(t) = 0 when 6t = 18, at t = 3, and h″ changes sign there: that is the inflection point.',
  xp: 150, prereqs: ['q16', 'q27'],
  sources: [source.s4_5],
  teaching: {
   intuition: 'The second derivative f″ is the rate of change of the slope. If f″ > 0 the slope is increasing, so the graph bends upward like a cup: it is concave up. If f″ < 0 the slope is decreasing and the graph bends downward like a cap: concave down. This gives a quick test at a critical point, where the slope is 0. If the graph is a cup there, the slope passes from negative to positive through 0: the bottom of a valley, a local minimum. If it is a cap, the slope passes from positive to negative: a local maximum. That is the second derivative test. (If f″ is 0 at the critical point, the test says nothing, and you go back to the signs of f′.) A point where the graph switches from cup to cap, or back, is an inflection point; there f″ changes sign. When a climbing balloon’s graph switches from cup to cap, that is the moment the climb is fastest: before it the climb speeds up, after it the climb slows down. (A switch from cap to cup would be the slowest moment instead.)',
   steps: [
    'Differentiate twice to get f″.',
    'At each critical point find the sign of f″: positive means concave up, a local minimum; negative means concave down, a local maximum.',
    'Solve f″ = 0 and check that f″ changes sign there: that is an inflection point.',
    'Put the time of the maximum into f itself to get its height.'
   ],
   example: {
    prompt: 'g(x) = x³ − 6x² + 9x has critical points 1 and 3. Classify them and find the inflection point.',
    steps: ['g′(x) = 3x² − 12x + 9, so g″(x) = 6x − 12.', 'g″(1) = −6 < 0: a local maximum. g″(3) = 6 > 0: a local minimum.', 'g″(x) = 0 at x = 2, and g″ changes from − to + there, so the inflection point is at x = 2.'],
    answer: 'Local maximum at x = 1, local minimum at x = 3, inflection point at x = 2.'
   },
   pitfalls: [
    'Reading the sign the wrong way round: f″ > 0 is a cup, so a minimum, even though the number is positive.',
    'Taking every x with f″ = 0 as an inflection point without checking that the bend really changes.',
    'Putting the time into h″ or h′ when the height is asked for. Heights come from h itself.'
   ]
  },
  guidance: [
   { prompt: 'h′(t) = −3t² + 18t − 15. Differentiate again: h″(t) = A·t + B. Enter A, then B.', answer: [-6, 18], labels: ['A (number before t)', 'B (constant term)'], explanation: 'The derivative of −3t² is −6t, of 18t is 18, and of the constant −15 is 0. So h″(t) = −6t + 18.' },
   { prompt: 'Evaluate h″ at both critical points: h″(1), then h″(5).', answer: [12, -12], labels: ['h″ at the earlier point', 'h″ at the later point'], explanation: 'h″(1) = 12 > 0: concave up, a local minimum. h″(5) = −12 < 0: concave down, a local maximum.' },
   { prompt: 'The local maximum is at t = 5. What is h(5)?', answer: [45], labels: ['height at the local maximum (m)'], explanation: 'h(5) = −125 + 225 − 75 + 20 = 45 m.' },
   { prompt: 'Where is h″(t) = −6t + 18 equal to 0?', answer: [3], labels: ['time of the inflection point (min)'], explanation: '6t = 18, so t = 3. Before it h″ > 0 (concave up), after it h″ < 0 (concave down).' }
  ]
 },
 {
  id: 'q29', title: 'Profiling the flame trench', topic: 'Describing a curve from its derivatives', tier: 'Intermediate', sector: 'Launch Gantry',
  brief: 'The flame trench floor has to be graded before the next launch, and the crew needs its shape described from its formula alone.',
  lesson: 'f′ tells where a curve rises and falls, f″ tells how it bends, and together they fix its shape.',
  prompt: 'The floor of the flame trench under the launch gantry has the profile f(x) = 3x⁴ − 16x³ + 18x² millimetres (height relative to the pad edge), x metres across from the trench’s centre line, negative on one side and positive on the other. Describe it from its derivatives: enter the x where f has its local maximum, the height f there, then the second derivative f″ at the critical point furthest to the right (the largest x).',
  answer: [1, 5, 72], labels: ['x of the local maximum', 'height at the local maximum (mm)', 'f″ at the rightmost critical point'], tolerance: 0.01,
  hints: [
   'f′(x) = 12x³ − … ; take out 12x and factor the quadratic that is left to find the three critical points.',
   'Check the sign of f′ between the critical points (or use f″): the local maximum is where f stops rising and starts falling.'
  ],
  solution: 'f′(x) = 12x³ − 48x² + 36x = 12x(x − 1)(x − 3), so the critical points are 0, 1 and 3. f′ < 0 for x < 0, f′ > 0 between 0 and 1, f′ < 0 between 1 and 3, f′ > 0 after 3. So f falls, rises, falls, rises: local minima at 0 and 3, the local maximum at x = 1, with f(1) = 5. f″(x) = 36x² − 96x + 36, so f″(1) = −24 (concave down, a maximum) and f″(3) = 72 (concave up, a minimum).',
  xp: 150, prereqs: ['q27', 'q28'],
  sources: [source.s4_5],
  teaching: {
   intuition: 'You can picture a curve without plotting dozens of points, just by asking its derivatives. The first derivative gives the direction: find where f′ = 0 (the critical points), and the sign of f′ between them tells you where the curve climbs and where it falls, so you know the order of the hills and valleys. The second derivative gives the bend: f″ > 0 is a cup and f″ < 0 a cap, which confirms each valley (cup) and hill (cap). The values of f at the critical points give the heights. For example, a degree-four curve with a positive leading term rises on both far sides, so with three critical points it is shaped like a W: valley, hill, valley. Used together, this chapter’s tools turn a formula into a picture you can trust.',
   steps: [
    'Find f′, factor it, and list the critical points in order.',
    'Test the sign of f′ in each gap to see where f rises and falls; read off the local maxima and minima.',
    'Use f″ at a critical point to confirm: negative is a cap (maximum), positive is a cup (minimum).',
    'Evaluate f at the critical points to get the heights of the hills and valleys.'
   ],
   example: {
    prompt: 'Describe the shape of g(x) = x⁴ − 8x².',
    steps: ['g′(x) = 4x³ − 16x = 4x(x − 2)(x + 2): critical points −2, 0 and 2.', 'The signs of g′ in the four gaps are −, +, −, +: valleys at −2 and 2, a hill at 0.', 'g(0) = 0 and g(2) = g(−2) = 16 − 32 = −16. g″(x) = 12x² − 16, so g″(0) = −16 (cap) and g″(2) = 32 (cup).'],
    answer: 'A W shape: local maximum 0 at x = 0, local minima of −16 at x = −2 and x = 2.'
   },
   pitfalls: [
    'Losing the critical point x = 0 when x is taken out as a common factor of f′.',
    'Judging a maximum by the size of f″ instead of its sign.',
    'Giving the x of the maximum when its height is asked for, or the other way round.'
   ]
  },
  guidance: [
   { prompt: 'f′(x) = 12x³ − 48x² + 36x = 12x(x² − 4x + 3). Besides x = 0, which two x make f′ zero? Enter the smaller, then the larger.', answer: [1, 3], labels: ['smaller critical point', 'larger critical point'], explanation: 'x² − 4x + 3 = (x − 1)(x − 3), so the critical points are 0, 1 and 3.' },
   { prompt: 'Test the sign of f′ between 1 and 3, at x = 2. What is f′(2)?', answer: [-24], labels: ['f′ between them'], explanation: '12 × 2 × 1 × (−1) = −24, negative: f falls after x = 1. Between 0 and 1 it rises, so x = 1 is the local maximum.' },
   { prompt: 'What is the height at the local maximum, f(1)?', answer: [5], labels: ['height at the local maximum (mm)'], explanation: '3 × 1 − 16 × 1 + 18 × 1 = 5.' },
   { prompt: 'f″(x) = 36x² − 96x + 36. What is f″(3)?', answer: [72], labels: ['f″ at the rightmost critical point'], explanation: '36 × 9 − 288 + 36 = 72, positive: concave up, so x = 3 is a local minimum, as the signs of f′ said.' }
  ]
 },
 {
  id: 'q30', title: 'Stress test on the bracket', topic: 'Absolute maximum and minimum on a closed interval', tier: 'Advanced', sector: 'Design Studio',
  brief: 'A bracket can be made at any thickness setting in a fixed range, and the studio needs its worst and best stress across that range.',
  lesson: 'On a closed interval, compare f at the critical points inside and at the two ends: the largest is the absolute maximum, the smallest the absolute minimum.',
  prompt: 'In the design studio, the stress in a bracket is modelled as S(x) = x³ − 12x + 20 megapascals, where x is a thickness setting that can be anything from 0 to 3. Enter the absolute maximum of S on this closed interval, then the absolute minimum.',
  answer: [20, 4], labels: ['absolute maximum (MPa)', 'absolute minimum (MPa)'], tolerance: 0.01,
  hints: [
   'On a closed interval the absolute maximum and minimum can only be at a critical point inside the interval or at one of the two ends.',
   'Find where S′(x) = 3x² − … is 0 inside the interval, then evaluate S there and at both ends and compare the three values.'
  ],
  solution: 'S′(x) = 3x² − 12 = 3(x² − 4), which is 0 at x = 2 (and at x = −2, outside the interval). The candidates: S(0) = 20, S(2) = 8 − 24 + 20 = 4, S(3) = 27 − 36 + 20 = 11. The largest is 20, the absolute maximum, at x = 0; the smallest is 4, the absolute minimum, at x = 2.',
  xp: 200, prereqs: ['q27'],
  sources: [source.s4_3],
  teaching: {
   intuition: 'A local maximum is only higher than its neighbours. The absolute maximum is the highest value anywhere in the allowed range, and the absolute minimum is the lowest. When the range is a closed interval, which includes both of its end points, a continuous function always has both (this is the Extreme Value Theorem). Where can they be? Either at a point inside where the graph turns, a critical point, or at one of the two ends, where the graph is simply cut off while it is still climbing or falling. Nowhere else: at any other inside point the slope is not zero, so moving a little one way or the other would go higher or lower. So the method is a short list of candidates and a comparison. The ends are easy to forget, and they are often where the answer is.',
   steps: [
    'Find the critical points of f and keep only those inside the interval.',
    'Evaluate f at each of those critical points and at both ends of the interval.',
    'The largest of these values is the absolute maximum, and the smallest is the absolute minimum.'
   ],
   example: {
    prompt: 'Find the absolute maximum and minimum of g(x) = x³ − 3x + 2 on the interval from 0 to 2.',
    steps: ['g′(x) = 3x² − 3 is 0 at x = 1 (and at −1, outside the interval).', 'g(0) = 2, g(1) = 0 and g(2) = 4.', 'The largest is 4 and the smallest is 0.'],
    answer: 'Absolute maximum 4, at x = 2; absolute minimum 0, at x = 1.'
   },
   pitfalls: [
    'Checking only the critical points and forgetting the two ends of the interval.',
    'Keeping a critical point that lies outside the interval.',
    'Reporting where the maximum is (the x) instead of the maximum value itself.'
   ]
  },
  guidance: [
   { prompt: 'S′(x) = 3x² − 12. Which x between 0 and 3 makes S′(x) = 0?', answer: [2], labels: ['critical point x'], explanation: '3x² = 12 gives x² = 4, so x = 2 (the other root, −2, is outside the interval).' },
   { prompt: 'Evaluate S at the three candidates: S(0), S(2), S(3).', answer: [20, 4, 11], labels: ['S at 0', 'S at the critical point', 'S at the right end'], explanation: 'S(0) = 20, S(2) = 4 and S(3) = 11.' },
   { prompt: 'Compare 20, 4 and 11. Enter the largest, then the smallest.', answer: [20, 4], labels: ['absolute maximum (MPa)', 'absolute minimum (MPa)'], explanation: 'The absolute maximum is 20 and the absolute minimum is 4. Checking only the critical point would have missed the maximum, which is at an end.' }
  ]
 }
);
})();
