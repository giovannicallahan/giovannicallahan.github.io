/* Foundations missions, file d: chapter 7 "Functions and angles" (Signal Tower), q36–q40.
   Mission objects as described in docs/PACK-FORMAT.md ("Mission"). The prompt, hints, solution and guidance
   text equals MISSION_GEN[id].build(canonical) in gen-d.js. */
(function(){
'use strict';
const source = {
 q36a: { title: 'OpenStax Precalculus 2e — 1.1 Functions and Function Notation', url: 'https://openstax.org/books/precalculus-2e/pages/1-1-functions-and-function-notation', description: 'What a function is, and how to read and evaluate f(x).', verified: '2026-11-21' },
 q36b: { title: 'OpenStax Precalculus 2e — 1.2 Domain and Range', url: 'https://openstax.org/books/precalculus-2e/pages/1-2-domain-and-range', description: 'The inputs a function allows and the outputs it can give.', verified: '2026-11-21' },
 q37a: { title: 'OpenStax Precalculus 2e — 1.5 Transformation of Functions', url: 'https://openstax.org/books/precalculus-2e/pages/1-5-transformation-of-functions', description: 'Shifting, stretching and reflecting the graph of a function.', verified: '2026-11-21' },
 q37b: { title: 'OpenStax Precalculus 2e — 1.4 Composition of Functions', url: 'https://openstax.org/books/precalculus-2e/pages/1-4-composition-of-functions', description: 'Feeding the output of one function into another.', verified: '2026-11-21' },
 q38: { title: 'OpenStax Precalculus 2e — 1.7 Inverse Functions', url: 'https://openstax.org/books/precalculus-2e/pages/1-7-inverse-functions', description: 'Functions that undo each other, and how to find an inverse.', verified: '2026-11-21' },
 q39a: { title: 'OpenStax Precalculus 2e — 4.1 Exponential Functions', url: 'https://openstax.org/books/precalculus-2e/pages/4-1-exponential-functions', description: 'Growth by repeated multiplication.', verified: '2026-11-21' },
 q39b: { title: 'OpenStax Precalculus 2e — 4.3 Logarithmic Functions', url: 'https://openstax.org/books/precalculus-2e/pages/4-3-logarithmic-functions', description: 'Logarithms as the exponent that gives a number.', verified: '2026-11-21' },
 q40a: { title: 'OpenStax Precalculus 2e — 5.4 Right Triangle Trigonometry', url: 'https://openstax.org/books/precalculus-2e/pages/5-4-right-triangle-trigonometry', description: 'Sine, cosine and tangent as ratios of the sides of a right triangle.', verified: '2026-11-21' },
 q40b: { title: 'OpenStax Precalculus 2e — 5.2 Unit Circle: Sine and Cosine Functions', url: 'https://openstax.org/books/precalculus-2e/pages/5-2-unit-circle-sine-and-cosine-functions', description: 'Sine and cosine as the coordinates of a point on the circle of radius 1.', verified: '2026-11-21' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q36', title: 'Reeling out the mast cable', topic: 'Function notation, domain and range', tier: 'Advanced', sector: 'Signal Tower',
  brief: 'The new mast needs its cable let out, and the crew must know how long the cable is at any moment of the winch run.',
  lesson: 'A function gives exactly one output for each allowed input; f(x) names the output for input x, the domain is the allowed inputs and the range is the outputs that come out.',
  prompt: 'Mast cable log. Before the winch starts, 12 m of cable already hang from the mast, and the winch lets out 3 m each minute, so the length after t minutes is L(t) = 3t + 12 metres. The winch can run for any time from 0 to 10 minutes, so that is the domain. Enter L(7), then the smallest and the largest lengths in the range.',
  answer: [33, 12, 42], labels: ['length at that time (m)', 'smallest length in the range (m)', 'largest length in the range (m)'], tolerance: 0.01,
  hints: ['L(7) means: put 7 in place of t, so work out 3 × 7 + 12.', 'The cable only gets longer, so the smallest length comes from the smallest input, t = 0, and the largest from the largest input, t = 10.'],
  solution: 'L(7) = 3 × 7 + 12 = 33 m. The smallest input, 0, gives L(0) = 12 m, and the largest input, 10, gives L(10) = 3 × 10 + 12 = 42 m. So the range runs from 12 m to 42 m.',
  xp: 200, prereqs: ['q35', 'q22'],
  artifact: { name: 'Winch log', description: 'One time in, one cable length out: the tower’s first function.' },
  sources: [source.q36a, source.q36b],
  teaching: {
   intuition: 'Think of a vending machine: you press one button and exactly one item comes out. A function is a rule like that for numbers: you put in one number, the input, and it gives back exactly one number, the output. We give the rule a name, such as L, and write L(4) for “the output when the input is 4”. The brackets here do not mean multiply; they hold the input. The domain is all the inputs the rule is allowed to take, and the range is all the outputs that can come out of it.',
   steps: [
    'Read the rule: H(t) = 2t + 5 says “take the input t, multiply it by 2, then add 5”.',
    'To find H of a number, put that number everywhere the letter appears, then work it out in the usual order: multiply first, then add.',
    'The domain is the inputs that make sense in the situation, for example any time from 0 to 8 minutes.',
    'For a rule that only grows as the input grows, the smallest output comes from the smallest input and the largest output from the largest input; together they mark the ends of the range.'
   ],
   example: {
    prompt: 'A fuel hose starts 5 m long and is unrolled 2 m each minute, so H(t) = 2t + 5, for any time from 0 to 8 minutes. Find H(3) and the range.',
    steps: ['H(3) = 2 × 3 + 5 = 6 + 5 = 11 m.', 'Smallest input 0: H(0) = 2 × 0 + 5 = 5 m. Largest input 8: H(8) = 2 × 8 + 5 = 21 m.', 'The hose only gets longer, so the range runs from 5 m to 21 m.'],
    answer: 'H(3) = 11 m; the range is from 5 m to 21 m.'
   },
   pitfalls: [
    'Reading L(4) as “L times 4”. The brackets hold the input: L(4) is the output when t is 4.',
    'Mixing up domain and range: the domain is the inputs (here, times in minutes), the range is the outputs (here, lengths in metres).',
    'Forgetting the starting amount: L(0) is not 0, because the rule still adds the number at the end.'
   ]
  },
  guidance: [
   { prompt: 'What is L(7)? Replace t with 7 in 3t + 12.', answer: [33], labels: ['length (m)'], explanation: '3 × 7 = 21, and 21 + 12 = 33.' },
   { prompt: 'What is L(0), the length before the winch has run at all?', answer: [12], labels: ['smallest length (m)'], explanation: '3 × 0 = 0, so L(0) = 12. It is the smallest length, because the cable only gets longer.' },
   { prompt: 'What is L(10), the length when the winch stops?', answer: [42], labels: ['largest length (m)'], explanation: '3 × 10 = 30, and 30 + 12 = 42. It is the largest length in the range.' }
  ]
 },
 {
  id: 'q37', title: 'Recalibrating the dish', topic: 'Transformations and composition', tier: 'Advanced', sector: 'Signal Tower',
  brief: 'The dish’s dial was refitted crooked, and the motor needs its new settings before tonight’s pass.',
  lesson: 'f(x − h) slides a graph h to the right, f(x) + k lifts it by k, and g(f(x)) runs two functions one after the other, inside first.',
  prompt: 'Dish controller. The old rule turns a dial mark d into motor steps: f(d) = 4d + 6. The dial has been refitted 2 marks out of line, so the new rule is p(d) = f(d − 2): its graph is the old graph slid 2 to the right. The motor turns 3 degrees per step: g(s) = 3s. Enter p(7) in steps, then g(p(7)) in degrees.',
  answer: [26, 78], labels: ['motor steps', 'degrees turned'], tolerance: 0.01,
  hints: ['p(7) = f(7 − 2). Work out the inside bracket first, then use the rule f.', 'g(p(7)) means: take the steps you found and feed them into g, which multiplies them by 3.'],
  solution: 'p(7) = f(7 − 2) = f(5) = 4 × 5 + 6 = 26 steps. Then g(p(7)) = g(26) = 3 × 26 = 78 degrees.',
  xp: 200, prereqs: ['q36'],
  artifact: { name: 'Dial shim', description: 'The spacer that put the dish dial back in line, two marks over.' },
  sources: [source.q37a, source.q37b],
  teaching: {
   intuition: 'You can make a new function out of an old one. If every output goes up by 5, the whole graph is lifted 5: that is f(x) + 5. If instead the input is changed before it goes in, as in f(x − 2), the graph slides sideways: the new rule gives at input 7 what the old one gave at input 5, so every point moves 2 to the right. You can also chain two machines on a conveyor belt: the output of the first becomes the input of the second. Writing g(f(x)) means “do f first, then put its answer into g”. This chaining is called composition.',
   steps: [
    'For a shift inside the bracket, such as f(x − 2), first work out the number inside the bracket, then use the old rule on that number.',
    'For a shift outside, such as f(x) + 5, use the old rule first, then add 5 to the answer.',
    'For a chain g(f(x)), always start with the innermost bracket: find f(x) first.',
    'Then feed that answer into the outer rule g, as its input.'
   ],
   example: {
    prompt: 'A pump rule is f(x) = 2x + 1. The new rule is q(x) = f(x − 3), and a meter reads m(u) = 5u. Find q(10) and m(q(10)).',
    steps: ['Inside first: 10 − 3 = 7, so q(10) = f(7).', 'f(7) = 2 × 7 + 1 = 15.', 'Now feed 15 into m: m(15) = 5 × 15 = 75.'],
    answer: 'q(10) = 15 and m(q(10)) = 75.'
   },
   pitfalls: [
    'Sliding the wrong way: f(x − 2) moves the graph 2 to the RIGHT, not the left, because the input has to be 2 bigger to give the same output.',
    'Taking f(x − 3) as f(x) − 3: the 3 inside the bracket changes the input, not the output. With f(x) = 2x + 1, f(10 − 3) = 2 × 7 + 1 = 15, not 2 × 10 + 1 − 3 = 18.',
    'Doing a chain in the wrong order: in g(f(x)) the inside rule f comes first, even though g is written first.'
   ]
  },
  guidance: [
   { prompt: 'Start inside the bracket: what is 7 − 2?', answer: [5], labels: ['dial mark used'], explanation: '7 − 2 = 5, so p(7) is the same as f(5).' },
   { prompt: 'What is f(5)? Use f(d) = 4d + 6.', answer: [26], labels: ['motor steps'], explanation: '4 × 5 = 20, and 20 + 6 = 26 steps.' },
   { prompt: 'Feed those steps into the second machine: what is g(26)?', answer: [78], labels: ['degrees turned'], explanation: 'g multiplies by 3: 3 × 26 = 78 degrees.' }
  ]
 },
 {
  id: 'q38', title: 'Reading the transmitter log backwards', topic: 'Inverse functions', tier: 'Advanced', sector: 'Signal Tower',
  brief: 'The night shift logged the transmitter’s power but forgot to write down its setting, and we need the setting to repeat the broadcast.',
  lesson: 'An inverse function undoes a function: it reverses each step, in the opposite order, and takes an output back to the input that made it.',
  prompt: 'Transmitter log. At setting s the transmitter draws P(s) = 5s + 20 watts. Last night’s log shows 65 W but not the setting. Write the inverse rule in the form P⁻¹(w) = (w − a) ÷ b, and enter a, then b, then the setting P⁻¹(65).',
  answer: [20, 5, 9], labels: ['a (number taken away)', 'b (number divided by)', 'setting'], tolerance: 0.01,
  hints: ['List what P does to s, in order, then undo the last step first.', 'P multiplies s by one number, then adds another. The number added last is taken away first, so it is a; the number multiplied by is b. Then put 65 in place of w.'],
  solution: 'P multiplies by 5, then adds 20. Undo the last step first: P⁻¹(w) = (w − 20) ÷ 5, so a = 20 and b = 5. Then P⁻¹(65) = (65 − 20) ÷ 5 = 45 ÷ 5 = 9. Check: P(9) = 5 × 9 + 20 = 65.',
  xp: 200, prereqs: ['q37', 'q17'],
  artifact: { name: 'Reverse table', description: 'A card that turns any logged wattage back into its dial setting.' },
  sources: [source.q38],
  teaching: {
   intuition: 'Getting dressed, you put on socks and then shoes; to undo it you take off the shoes first and then the socks. An inverse function works the same way. If a function takes an input, multiplies it by a number and then adds a number, its inverse takes the output, first takes away what was added, then divides by what it multiplied by. It carries any output back to the input that made it. The inverse of P is written P⁻¹ (say “P inverse”); the small ⁻¹ is a name tag here, not a power.',
   steps: [
    'List what the function does to its input, in order: for example “times 3, then plus 4”.',
    'Undo each step with its opposite: plus becomes take away, times becomes divide.',
    'Do the undoing in the reverse order: the last step is undone first.',
    'Check: put your answer back into the original function. You must get the output you started from.'
   ],
   example: {
    prompt: 'A heater uses H(s) = 3s + 4 watts at setting s. Find the inverse rule, and the setting that uses 31 W.',
    steps: ['H does “times 3, then plus 4”. Undo in reverse: take away 4, then divide by 3, so H⁻¹(w) = (w − 4) ÷ 3.', 'H⁻¹(31) = (31 − 4) ÷ 3 = 27 ÷ 3 = 9.', 'Check: H(9) = 3 × 9 + 4 = 31.'],
    answer: 'H⁻¹(w) = (w − 4) ÷ 3, and the setting is 9.'
   },
   pitfalls: [
    'Undoing in the same order instead of in reverse: for H(s) = 3s + 4 and 31 W, (31 ÷ 3) − 4 is wrong; take away 4 first, then divide by 3.',
    'Reading P⁻¹ as 1 ÷ P. The ⁻¹ on a function’s name means “inverse”, not “one over”.',
    'Forgetting the check: P of your answer must give back the logged wattage.'
   ]
  },
  guidance: [
   { prompt: 'P does two things to s: times 5, then plus 20. The inverse undoes the last one first. Which number does it take away?', answer: [20], labels: ['a'], explanation: 'The last thing P did was add 20, so the inverse starts by taking away 20: a = 20.' },
   { prompt: 'After taking away 20, what does the inverse divide by?', answer: [5], labels: ['b'], explanation: 'P multiplied by 5, so the inverse divides by 5: b = 5.' },
   { prompt: 'What is (65 − 20) ÷ 5?', answer: [9], labels: ['setting'], explanation: '65 − 20 = 45, and 45 ÷ 5 = 9. Check: 5 × 9 + 20 = 65.' }
  ]
 },
 {
  id: 'q39', title: 'Boosting the relay chain', topic: 'Exponentials and logarithms', tier: 'Advanced', sector: 'Signal Tower',
  brief: 'A faint signal has to be boosted through the relay chain, and we must know how strong it gets and how many relays a target needs.',
  lesson: 'Multiplying by the same number again and again is exponential growth, b to the power n; the logarithm counts how many times you multiplied.',
  prompt: 'Relay amplifiers. Each relay stage multiplies a signal’s strength by 3. A signal of 4 units passes through 3 stages: enter its strength afterwards. A second signal of 4 units must reach 324 units: enter how many stages it needs.',
  answer: [108, 4], labels: ['strength after the stages (units)', 'stages needed'], tolerance: 0.01,
  hints: ['Each stage multiplies by 3, so after 3 stages the strength is 4 × 3³, where 3³ means 3 copies of 3 multiplied together: 3 × 3 × 3.', 'The second signal must grow by a factor of 324 ÷ 4 = 81. Count how many 3s you must multiply together to make 81: that count is log₃ 81.'],
  solution: '3³ = 3 × 3 × 3 = 27, so the first signal ends at 4 × 27 = 108 units. The second signal must grow by a factor of 324 ÷ 4 = 81, and 3 × 3 × 3 × 3 = 81, so log₃ 81 = 4: it needs 4 stages.',
  xp: 200, prereqs: ['q38', 'q30'],
  artifact: { name: 'Relay counter', description: 'A dial that counts boosts: the logarithm in brass.' },
  sources: [source.q39a, source.q39b],
  teaching: {
   intuition: 'Some things grow by adding the same amount each time; others grow by multiplying by the same number each time, which gets big very fast. A relay that doubles a signal turns 1 into 2, then 4, then 8, then 16. After n relays the signal has been multiplied by 2 n times, which is the power 2ⁿ: this is exponential growth. A logarithm asks the question backwards: how many times must I multiply by 2 to make 16? The answer, 4, is written log₂ 16 = 4. The small number after “log” is the number you keep multiplying by, called the base.',
   steps: [
    'For growth, write the power out as a repeated product, for example 2⁴ = 2 × 2 × 2 × 2, and multiply one step at a time.',
    'Multiply the starting amount by that power to get the final amount.',
    'For a logarithm, first find how many times bigger the target is than the start: the target divided by the start. This number is called the growth factor.',
    'Then count how many copies of the base multiply together to give that factor; that count is the logarithm.'
   ],
   example: {
    prompt: 'Each booster doubles a signal. A 5 unit signal passes 4 boosters. How strong is it? How many boosters take a 5 unit signal to 160 units?',
    steps: ['2⁴ = 2 × 2 × 2 × 2 = 16, so the signal ends at 5 × 16 = 80 units.', 'The factor needed is 160 ÷ 5 = 32, and 2 × 2 × 2 × 2 × 2 = 32, which is 5 twos.', 'So log₂ 32 = 5: it takes 5 boosters.'],
    answer: '80 units; log₂ 32 = 5 boosters.'
   },
   pitfalls: [
    'Multiplying the base by the small raised number instead of by itself: 2⁵ is 2 × 2 × 2 × 2 × 2 = 32, not 2 × 5 = 10.',
    'Adding instead of multiplying: two stages that each triple a signal of 5 give 5 × 3 × 3 = 45, not 5 + 3 + 3 = 11.',
    'Forgetting to divide by the start before counting: the boosters needed to go from 5 to 160 are log₂ 32, not log₂ 160.'
   ]
  },
  guidance: [
   { prompt: 'What is 3³, that is 3 × 3 × 3?', answer: [27], labels: ['growth factor'], explanation: 'Multiply one step at a time: 3 × 3 × 3 = 27. That is how many times stronger 3 stages make a signal.' },
   { prompt: 'What is 4 × 27?', answer: [108], labels: ['strength (units)'], explanation: '4 × 27 = 108 units.' },
   { prompt: '324 ÷ 4 = 81. How many times must you multiply by 3 to reach 81? That count is log₃ 81.', answer: [4], labels: ['stages needed'], explanation: '3 × 3 × 3 × 3 = 81, which is 4 copies of 3, so log₃ 81 = 4.' }
  ]
 },
 {
  id: 'q40', title: 'Aiming the signal mast', topic: 'Right-triangle and unit-circle trigonometry', tier: 'Advanced', sector: 'Signal Tower',
  brief: 'The mast’s guy wire is fixed, and the crew needs its angle and the height of the swinging boom before they hang the antenna.',
  lesson: 'In a right triangle, sin of an angle is opposite ÷ longest side and cos is adjacent ÷ longest side; on a circle of radius 1 they are the height and the across distance of the point at that angle.',
  prompt: 'Guy wire. A cable runs from the top of the signal mast, 24 m high, in a straight line to a ground anchor 18 m from the mast’s foot; the cable is 30 m long. Let θ be the angle between the cable and the ground at the anchor. Enter sin θ, then cos θ (each as a decimal or as a fraction). Then a boom 10 m long, fixed to a pivot, swings up from flat to the same angle θ: enter how high its tip rises above the pivot, in metres.',
  answer: [0.8, 0.6, 8], labels: ['sin θ', 'cos θ', 'tip height (m)'], tolerance: 0.004, /* sin and cos can be exact hundredths (0.28, 0.96): 0.01 would accept a neighbouring hundredth */
  hints: ['Stand at the anchor. The mast is the side across from θ (opposite), the ground is the side touching θ (adjacent), and the cable is the longest side. sin θ = opposite ÷ longest; cos θ = adjacent ÷ longest.', 'On a circle of radius 1 the tip at angle θ is sin θ above the centre. A boom 10 m long is 10 times bigger, so its tip is 10 × sin θ high. Write sin θ as a fraction in lowest terms, then divide 10 by its bottom number and multiply by its top number.'],
  solution: 'sin θ = 24 ÷ 30, the fraction 24/30, which is 4/5 in lowest terms, or 0.8 as a decimal. cos θ = 18 ÷ 30, the fraction 18/30, which is 3/5 in lowest terms, or 0.6 as a decimal. The boom’s tip moves on a circle of radius 10 around the pivot, so its tip is 10 × sin θ = 10 × 4/5 high: 10 ÷ 5 = 2, and 2 × 4 = 8 m above the pivot.',
  xp: 200, prereqs: ['q39', 'q12', 'q20'],
  artifact: { name: 'Guy-wire clinometer', description: 'The angle gauge clipped to the mast cable on the day the tower went up.' },
  sources: [source.q40a, source.q40b],
  teaching: {
   intuition: 'A mast, the flat ground and a cable from the mast top to the ground make a triangle with a square corner, called a right triangle. Pick the angle where the cable meets the ground and name it θ (the Greek letter theta). Seen from that angle, the side across the triangle is the opposite side, the side along the ground that touches the angle is the adjacent side, and the slanted cable is the longest side. However big the triangle, if the angle stays the same these sides keep the same proportions, so their ratios belong to the angle itself: sin θ = opposite ÷ longest, and cos θ = adjacent ÷ longest. Now picture a stick of length 1 turning about one end. When it has turned up by θ, its tip is sin θ above the pivot and cos θ across from it: that circle of radius 1 is the unit circle. A stick r times longer reaches r times as high.',
   steps: [
    'Stand at the angle θ and name the sides: opposite (across from θ), adjacent (touching θ, not the longest), longest (across from the square corner).',
    'sin θ = opposite ÷ longest, and cos θ = adjacent ÷ longest. Both are between 0 and 1, and each can stay a fraction: 12 ÷ 13 is 12/13.',
    'On the unit circle, the point at angle θ is cos θ across and sin θ up from the centre.',
    'For an arm of length r turned to angle θ, multiply: its tip is r × sin θ up and r × cos θ across. To multiply by a fraction, divide by its bottom number and multiply by its top number.'
   ],
   example: {
    prompt: 'A ladder 13 m long leans from the ground to a wall, reaching 12 m up the wall, with its foot 5 m from the wall. Find sin and cos of the angle at the foot, and how high the tip of a 26 m arm at that angle reaches.',
    steps: ['Opposite is 12, adjacent is 5, longest is 13: sin = 12 ÷ 13 and cos = 5 ÷ 13.', 'The arm is 26 m, so its tip is 26 × 12 ÷ 13 = 24 m high.'],
    answer: 'sin = 12/13, cos = 5/13; the arm’s tip is 24 m high.'
   },
   pitfalls: [
    'Swapping opposite and adjacent: decide from where θ is, not from which side is upright.',
    'Dividing by the wrong side: sin and cos always divide by the longest side, so they can never be bigger than 1.',
    'Using cos for the height of the arm: height (up) goes with sin θ, the across distance with cos θ.'
   ]
  },
  guidance: [
   { prompt: 'From the anchor, the mast (24 m) is opposite θ and the cable (30 m) is the longest side. What is 24 ÷ 30? You may type it as the fraction 24/30.', answer: [0.8], labels: ['sin θ'], explanation: '24 ÷ 30 is the fraction 24/30, which is 4/5 in lowest terms. So sin θ = 4/5; as a decimal, 4/5 = 8/10 = 0.8.' },
   { prompt: 'The ground (18 m) is the side touching θ. What is 18 ÷ 30? You may type it as the fraction 18/30.', answer: [0.6], labels: ['cos θ'], explanation: '18 ÷ 30 is the fraction 18/30, which is 3/5 in lowest terms. So cos θ = 3/5; as a decimal, 3/5 = 6/10 = 0.6.' },
   { prompt: 'The boom is 10 m long and sin θ = 4/5. What is 10 × 4/5? Divide 10 by 5, then multiply by 4.', answer: [8], labels: ['tip height (m)'], explanation: '10 ÷ 5 = 2, and 2 × 4 = 8: the tip of a boom 10 times longer than 1 rises 10 times as high.' }
  ]
 }
);
})();
