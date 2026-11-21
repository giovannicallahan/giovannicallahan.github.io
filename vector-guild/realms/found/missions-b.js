/* Foundations missions, file b: chapter 3 "Language of algebra" (q13–q18, Fuel Store) and chapter 4 "Lines and space" (q19–q24, Map Room).
   Mission objects as described in docs/PACK-FORMAT.md ("Mission"). The prompt, answers, hints, solution and guided steps
   are exactly what build(canonical) in gen-b.js produces; change both together. */
(function(){
'use strict';
const source = {
 q13a: { title: 'OpenStax Elementary Algebra 2e — 1.2 Use the Language of Algebra', url: 'https://openstax.org/books/elementary-algebra-2e/pages/1-2-use-the-language-of-algebra', description: 'Variables, constants, expressions and translating words into symbols.', verified: '2026-11-21' },
 q13b: { title: 'OpenStax Prealgebra 2e — 2.1 Use the Language of Algebra', url: 'https://openstax.org/books/prealgebra-2e/pages/2-1-use-the-language-of-algebra', description: 'Variables and algebraic expressions, written from everyday phrases.', verified: '2026-11-21' },
 q14: { title: 'OpenStax Prealgebra 2e — 2.2 Evaluate, Simplify, and Translate Expressions', url: 'https://openstax.org/books/prealgebra-2e/pages/2-2-evaluate-simplify-and-translate-expressions', description: 'Evaluating an expression by putting a number in place of its variable.', verified: '2026-11-21' },
 q15a: { title: 'OpenStax Prealgebra 2e — 7.3 Distributive Property', url: 'https://openstax.org/books/prealgebra-2e/pages/7-3-distributive-property', description: 'Multiplying a number across a sum in brackets.', verified: '2026-11-21' },
 q15b: { title: 'OpenStax Prealgebra 2e — 2.2 Evaluate, Simplify, and Translate Expressions', url: 'https://openstax.org/books/prealgebra-2e/pages/2-2-evaluate-simplify-and-translate-expressions', description: 'Identifying like terms and combining them.', verified: '2026-11-21' },
 q16a: { title: 'OpenStax Elementary Algebra 2e — 2.1 Solve Equations Using the Subtraction and Addition Properties of Equality', url: 'https://openstax.org/books/elementary-algebra-2e/pages/2-1-solve-equations-using-the-subtraction-and-addition-properties-of-equality', description: 'Undoing addition and subtraction on both sides of an equation.', verified: '2026-11-21' },
 q16b: { title: 'OpenStax Elementary Algebra 2e — 2.2 Solve Equations using the Division and Multiplication Properties of Equality', url: 'https://openstax.org/books/elementary-algebra-2e/pages/2-2-solve-equations-using-the-division-and-multiplication-properties-of-equality', description: 'Undoing multiplication and division on both sides of an equation.', verified: '2026-11-21' },
 q17: { title: 'OpenStax Elementary Algebra 2e — 2.4 Use a General Strategy to Solve Linear Equations', url: 'https://openstax.org/books/elementary-algebra-2e/pages/2-4-use-a-general-strategy-to-solve-linear-equations', description: 'Simplifying each side, then undoing operations in reverse order.', verified: '2026-11-21' },
 q18: { title: 'OpenStax Elementary Algebra 2e — 2.7 Solve Linear Inequalities', url: 'https://openstax.org/books/elementary-algebra-2e/pages/2-7-solve-linear-inequalities', description: 'Inequality symbols and solving inequalities like equations.', verified: '2026-11-21' },
 q19: { title: 'OpenStax Elementary Algebra 2e — 4.1 Use the Rectangular Coordinate System', url: 'https://openstax.org/books/elementary-algebra-2e/pages/4-1-use-the-rectangular-coordinate-system', description: 'Plotting and reading points as ordered pairs (x, y).', verified: '2026-11-21' },
 q20: { title: 'OpenStax Intermediate Algebra 2e — 11.1 Distance and Midpoint Formulas; Circles', url: 'https://openstax.org/books/intermediate-algebra-2e/pages/11-1-distance-and-midpoint-formulas-circles', description: 'The distance between two points from the Pythagorean theorem.', verified: '2026-11-21' },
 q21: { title: 'OpenStax Elementary Algebra 2e — 4.4 Understand Slope of a Line', url: 'https://openstax.org/books/elementary-algebra-2e/pages/4-4-understand-slope-of-a-line', description: 'Slope as rise over run between two points.', verified: '2026-11-21' },
 q22: { title: 'OpenStax Elementary Algebra 2e — 4.5 Use the Slope-Intercept Form of an Equation of a Line', url: 'https://openstax.org/books/elementary-algebra-2e/pages/4-5-use-the-slope-intercept-form-of-an-equation-of-a-line', description: 'Reading slope and y-intercept from y = mx + b and using the line in applications.', verified: '2026-11-21' },
 q23: { title: 'OpenStax Elementary Algebra 2e — 4.6 Find the Equation of a Line', url: 'https://openstax.org/books/elementary-algebra-2e/pages/4-6-find-the-equation-of-a-line', description: 'Finding the equation of a line from two points.', verified: '2026-11-21' },
 q24a: { title: 'OpenStax Precalculus 2e — 8.8 Vectors', url: 'https://openstax.org/books/precalculus-2e/pages/8-8-vectors', description: 'Vectors written in components and added component by component.', verified: '2026-11-21' },
 q24b: { title: 'OpenStax Prealgebra 2e — 3.2 Add Integers', url: 'https://openstax.org/books/prealgebra-2e/pages/3-2-add-integers', description: 'Adding positive and negative numbers.', verified: '2026-11-21' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q13', title: 'Labelling the fuel pallets', topic: 'Variables and expressions', tier: 'Intermediate', sector: 'Fuel Store',
  brief: 'The fuel store logs pallets before anyone has measured how much one sealed can holds.',
  lesson: 'A letter can stand for an unknown number, and an expression such as 5c + 3 is a calculation written with it.',
  prompt: 'Fuel store. Every sealed fuel can holds the same amount, but nobody has measured it yet, so call it c litres. A pallet holds 7 sealed cans and one open drum with 15 L in it. Mira loads 2 more sealed cans onto the pallet. Write the total litres on the pallet as an expression of the form (number)c + (number). Enter the number in front of c, then the number added on its own.',
  answer: [9, 15], labels: ['number in front of c', 'number on its own'], tolerance: 0.01,
  hints: ['Count the sealed cans after loading: 7 + 2.', 'Each sealed can is c litres, so the count of sealed cans goes in front of c; the drum’s litres are added on their own.'],
  solution: 'The pallet ends with 7 + 2 = 9 sealed cans of c litres each, which is 9c litres, plus the drum’s 15 L. The total is 9c + 15 litres.',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Pallet tag', description: 'A label that says what is on the pallet before anyone knows the number.' },
  sources: [source.q13a, source.q13b],
  teaching: {
   intuition: 'Sometimes we know how a total is made up but not one of the amounts in it. We give that unknown amount a letter, such as c, and work with the letter as if it were the number. An expression is a calculation written with numbers and letters. When a number is written right next to a letter it means multiply: 5c means 5 × c, five lots of c. So 5c + 3 reads as five cans of c litres each, plus 3 litres more.',
   steps: [
    'Choose a letter for the amount you do not know, and say what it stands for, for example c = litres in one can.',
    'Count how many lots of that unknown amount there are; that count is the number written in front of the letter.',
    'Add any amount you already know as a plain number on its own, after a + sign.'
   ],
   example: {
    prompt: 'A shelf holds 4 crates of b bolts each and 6 loose bolts. 3 more crates arrive. Write the total number of bolts.',
    steps: ['Crates after the delivery: 4 + 3 = 7, so the crates hold 7b bolts.', 'The 6 loose bolts are known, so they are added on their own: 7b + 6.'],
    answer: '7b + 6 bolts.'
   },
   pitfalls: [
    'Adding the known amount into the number in front of the letter: 6 cans of c litres plus 10 L is 6c + 10, not 16c.',
    'Forgetting items that arrive later: count every can that ends up on the pallet before writing the number in front of c.',
    'Reading 6c as six plus c: a number written right next to a letter means multiply.'
   ]
  },
  guidance: [
   { prompt: 'How many sealed cans are on the pallet after Mira loads 2 more?', answer: [9], labels: ['cans on the pallet'], explanation: '7 + 2 = 9 cans. Each holds c litres, so together they hold 9c litres.' },
   { prompt: 'The open drum is not a sealed can, so its litres are already known. How many litres does it add on its own?', answer: [15], labels: ['litres in the drum'], explanation: 'The drum adds 15 L whatever c turns out to be, so the expression is 9c + 15.' }
  ]
 },
 {
  id: 'q14', title: 'Reading the generator’s tank', topic: 'Substitution', tier: 'Intermediate', sector: 'Fuel Store',
  brief: 'The night crew needs to know how much fuel the generator will have left at two check times.',
  lesson: 'To evaluate an expression, put the number in place of the letter and work it out, multiplying before you add or subtract.',
  prompt: 'The generator in the fuel store starts a shift with 120 L in its tank and burns 8 L every hour, so the litres left after h hours are 120 − 8h. Substitute to find the litres left after 5 hours, then after 9 hours.',
  answer: [80, 48], labels: ['litres after the first check', 'litres after the second check'], tolerance: 0.01,
  hints: ['Replace h with 5: 120 − 8 × 5. Multiply before you subtract.', 'For the second, replace h with 9: 120 − 8 × 9.'],
  solution: 'After 5 hours: 120 − 8 × 5 = 120 − 40 = 80 L. After 9 hours: 120 − 8 × 9 = 120 − 72 = 48 L.',
  xp: 150, prereqs: ['q13'],
  artifact: { name: 'Gauge card', description: 'A rule on a card that turns hours into litres left.' },
  sources: [source.q14],
  teaching: {
   intuition: 'An expression with a letter is like a recipe with a blank in it. Substituting means filling in the blank: you replace the letter with the number it stands for, then do the arithmetic. Remember that a number next to a letter means multiply, and follow the order of operations: multiply before you add or subtract. So if h is 3, then 50 − 4h becomes 50 − 4 × 3 = 50 − 12 = 38.',
   steps: [
    'Write the expression out again with the number in place of the letter, adding the × sign that was hidden: 4h with h = 3 becomes 4 × 3.',
    'Do any multiplying first.',
    'Then do the adding or subtracting, from left to right.'
   ],
   example: {
    prompt: 'A heater tank starts with 90 L and burns 6 L each hour, so after h hours it holds 90 − 6h litres. How much is left after 4 hours, and after 10 hours?',
    steps: ['h = 4: 90 − 6 × 4 = 90 − 24 = 66 L.', 'h = 10: 90 − 6 × 10 = 90 − 60 = 30 L.'],
    answer: '66 L after 4 hours, 30 L after 10 hours.'
   },
   pitfalls: [
    'Working left to right instead of multiplying first: 100 − 6 × 5 is 100 − 30 = 70, not 94 × 5.',
    'Writing the number beside the letter as digits: if h is 5, then 6h means 6 × 5 = 30, not 65.'
   ]
  },
  guidance: [
   { prompt: 'Put 5 in place of h: 120 − 8 × 5. What is it?', answer: [80], labels: ['litres after the first check'], explanation: 'Multiply first: 8 × 5 = 40. Then 120 − 40 = 80 L.' },
   { prompt: 'Now put 9 in place of h: 120 − 8 × 9. What is it?', answer: [48], labels: ['litres after the second check'], explanation: '8 × 9 = 72, and 120 − 72 = 48 L.' }
  ]
 },
 {
  id: 'q15', title: 'Counting the supply kits', topic: 'Distributing and combining like terms', tier: 'Intermediate', sector: 'Fuel Store',
  brief: 'Mira wants the fuel in the kits and the loose cans written as one short expression for the inventory.',
  lesson: 'A number in front of brackets multiplies every part inside them, and terms that count the same thing can be added together.',
  prompt: 'Each supply kit holds one fuel can of c litres and a spare bottle of 2 L, so one kit holds c + 2 litres. The store has 4 kits and 3 loose cans: 4(c + 2) + 3c litres in all. Simplify this to the form (number)c + (number). Enter the number in front of c, then the number on its own.',
  answer: [7, 8], labels: ['number in front of c', 'number on its own'], tolerance: 0.01,
  hints: ['Distribute: 4(c + 2) means 4 lots of c and 4 lots of 2. Work out 4 × 2 for the number on its own.', 'Combine the like terms 4c and 3c: both count cans of c litres.'],
  solution: '4(c + 2) + 3c = 4c + 8 + 3c = 7c + 8 litres.',
  xp: 150, prereqs: ['q14'],
  sources: [source.q15a, source.q15b],
  teaching: {
   intuition: 'Brackets group things together. 3(c + 2) means 3 lots of everything inside the brackets: 3 cans and 3 bottles, so it is 3c + 6. Spreading the multiplication over every part inside is called distributing. Like terms are parts that count the same kind of thing: 4c and 2c both count cans of c litres, so together they are 6c. A plain number such as 5 is not a like term with 6c, because it counts litres, not cans, so 6c + 5 stays as it is.',
   steps: [
    'Distribute: multiply the number in front of the brackets by each part inside.',
    'Group the like terms: all the terms with c together, and all the plain numbers together.',
    'Add the numbers in front of c to get one c term, and add the plain numbers to get one number.'
   ],
   example: {
    prompt: 'Simplify 5(c + 3) + 2c.',
    steps: ['Distribute: 5(c + 3) = 5c + 15.', 'Combine the c terms: 5c + 2c = 7c, so the whole thing is 7c + 15.'],
    answer: '7c + 15.'
   },
   pitfalls: [
    'Multiplying only the first part inside the brackets: 2(c + 5) is 2c + 10, not 2c + 5.',
    'Combining unlike terms: 6c + 4 is not 10c, because 4 counts litres, not cans.'
   ]
  },
  guidance: [
   { prompt: 'Distribute: 4(c + 2) = 4c + ?. What is the number on its own?', answer: [8], labels: ['number on its own'], explanation: 'The 4 multiplies both parts inside the brackets: 4 × 2 = 8.' },
   { prompt: 'Now combine 4c + 3c. How many c are there?', answer: [7], labels: ['number in front of c'], explanation: '4 cans plus 3 cans is 7 cans, so 4c + 3c = 7c and the total is 7c + 8.' }
  ]
 },
 {
  id: 'q16', title: 'Balancing the fuel ledger', topic: 'One-step equations', tier: 'Intermediate', sector: 'Fuel Store',
  brief: 'Two entries in the fuel ledger are missing and must be worked out from what the gauges show.',
  lesson: 'Undo what was done to the unknown, doing the same to both sides: add to undo subtracting, divide to undo multiplying.',
  prompt: 'Fuel ledger. Tank B held x litres. A leak took 18 L out and the gauge now reads 47 L, so x − 18 = 47. Separately, 5 equal cans hold 60 L in all, so 5y = 60, where y is the litres in one can. Enter x, then y.',
  answer: [65, 12], labels: ['x (litres before the leak)', 'y (litres per can)'], tolerance: 0.01,
  hints: ['Undo the subtracting: add 18 to both sides.', 'Undo the multiplying: divide both sides by 5.'],
  solution: 'x − 18 = 47, so x = 47 + 18 = 65. 5y = 60, so y = 60 ÷ 5 = 12.',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Balance scale', description: 'Whatever goes on one pan goes on the other.' },
  sources: [source.q16a, source.q16b],
  teaching: {
   intuition: 'An equation says that two amounts are equal, like a balance scale with the same weight on each pan. A letter such as x stands for the number we do not know yet. To find it, undo what was done to it, and do the same to both sides so the scale stays level. Adding undoes subtracting, and dividing undoes multiplying: if 3y = 24, divide both sides by 3 to get y = 8.',
   steps: [
    'Look at what was done to the unknown: was a number taken away from it, or was it multiplied by a number?',
    'Do the opposite to both sides: add back the number that was taken away, or divide by the number it was multiplied by.',
    'Check: put your answer back into the original equation. Both sides must come out the same.'
   ],
   example: {
    prompt: 'Solve x − 9 = 31 and 4y = 36.',
    steps: ['x − 9 = 31: add 9 to both sides, so x = 31 + 9 = 40. Check: 40 − 9 = 31.', '4y = 36: divide both sides by 4, so y = 36 ÷ 4 = 9. Check: 4 × 9 = 36.'],
    answer: 'x = 40 and y = 9.'
   },
   pitfalls: [
    'Subtracting again instead of adding: from x − 6 = 20 the answer is 20 + 6 = 26, not 14.',
    'Dividing the wrong way round: from 4y = 32, y is 32 ÷ 4 = 8, not 4 ÷ 32.'
   ]
  },
  guidance: [
   { prompt: 'x − 18 = 47. Add 18 to both sides. What is x?', answer: [65], labels: ['x'], explanation: '47 + 18 = 65. Check: 65 − 18 = 47.' },
   { prompt: '5y = 60. Divide both sides by 5. What is y?', answer: [12], labels: ['y'], explanation: '60 ÷ 5 = 12. Check: 5 × 12 = 60.' }
  ]
 },
 {
  id: 'q17', title: 'Refuelling the rover', topic: 'Multi-step equations', tier: 'Intermediate', sector: 'Fuel Store',
  brief: 'The rover’s gauge shows the total after refuelling, and Mira needs to know how much went into each jerry can.',
  lesson: 'Tidy each side first, then undo the operations in reverse order: adding or subtracting before multiplying.',
  prompt: 'Mira fills 3 jerry cans. Each gets x litres from the pump plus a 2 L top-up, and all of them are poured into the rover’s tank, which already held 12 L. The gauge now reads 51 L, so 3(x + 2) + 12 = 51. Solve for x. Enter what 3x equals, then x.',
  answer: [33, 11], labels: ['value of 3x', 'x (litres from the pump per can)'], tolerance: 0.01,
  hints: ['Distribute and collect the plain numbers first: 3(x + 2) + 12 = 3x + 18.', 'Subtract 18 from both sides, then divide both sides by 3.'],
  solution: '3(x + 2) + 12 = 51 becomes 3x + 6 + 12 = 51, so 3x + 18 = 51. Subtract 18: 3x = 33. Divide by 3: x = 11 L. Check: 3 × (11 + 2) + 12 = 3 × 13 + 12 = 51.',
  xp: 150, prereqs: ['q16'],
  sources: [source.q17],
  teaching: {
   intuition: 'Some equations wrap the unknown in several layers, like a parcel. To unwrap it, first tidy each side: distribute any brackets and add up the plain numbers. Then peel the layers off in reverse order, because the last thing done to x comes off first. Usually that means undoing adding or subtracting before undoing multiplying. Do the same to both sides at every step and the equation stays balanced.',
   steps: [
    'Tidy each side: distribute any brackets and combine like terms.',
    'Undo adding or subtracting: take the plain number away from the side with x, and do the same to the other side.',
    'Undo multiplying: divide both sides by the number in front of x.',
    'Check by putting your x back into the original equation.'
   ],
   example: {
    prompt: 'Solve 2(x + 4) + 5 = 31.',
    steps: ['Tidy: 2x + 8 + 5 = 31, so 2x + 13 = 31.', 'Subtract 13 from both sides: 2x = 18. Divide both sides by 2: x = 9.', 'Check: 2 × (9 + 4) + 5 = 2 × 13 + 5 = 31.'],
    answer: 'x = 9.'
   },
   pitfalls: [
    'Dividing before subtracting: in 4x + 12 = 40 the 4 multiplies only x, so take away 12 first (4x = 28), then divide (x = 7).',
    'Forgetting to distribute to the second part: 3(x + 2) is 3x + 6, not 3x + 2.',
    'Doing a step to one side only: whatever you subtract on the left you must also subtract on the right.'
   ]
  },
  guidance: [
   { prompt: 'Tidy the left side into 3x + (a number): distribute 3(x + 2) and add the 12. What is the number?', answer: [18], labels: ['number on its own after tidying'], explanation: '3 × 2 = 6, and 6 + 12 = 18, so the equation is 3x + 18 = 51.' },
   { prompt: '3x + 18 = 51. Subtract 18 from both sides. What is 3x?', answer: [33], labels: ['value of 3x'], explanation: '51 − 18 = 33, so 3x = 33.' },
   { prompt: '3x = 33. Divide both sides by 3. What is x?', answer: [11], labels: ['x'], explanation: '33 ÷ 3 = 11, so each can got 11 L from the pump.' }
  ]
 },
 {
  id: 'q18', title: 'The sled’s load limit', topic: 'Inequalities', tier: 'Intermediate', sector: 'Fuel Store',
  brief: 'The fuel sled has a weight limit, and the crew wants to know how many cans it can take on one run.',
  lesson: 'An inequality is solved like an equation; its answer is a range, so pick the largest whole number inside it when items come whole.',
  prompt: 'The fuel sled may carry at most 200 kg. The empty sled weighs 74 kg, and each full fuel can weighs 14 kg. With n cans on board the load must satisfy 14n + 74 ≤ 200. Enter how many kilograms are left for cans once the empty sled is counted, then the largest whole number of cans the sled may carry.',
  answer: [126, 9], labels: ['kg left for cans', 'largest number of cans'], tolerance: 0.01,
  hints: ['Subtract 74 from both sides: 14n ≤ 200 − 74.', 'Divide both sides by 14. Cans come whole, so take the largest whole number that is not more than the result.'],
  solution: '14n + 74 ≤ 200, so 14n ≤ 126. 126 ÷ 14 = 9, so n can be at most 9. Check: 9 cans weigh 126 kg, which fits, but 10 cans would weigh 140 kg, more than 126 kg. The sled may carry at most 9 cans.',
  xp: 150, prereqs: ['q17'],
  artifact: { name: 'Load plate', description: 'The sled’s limit, stamped in steel.' },
  sources: [source.q18],
  teaching: {
   intuition: 'An inequality is like an equation, but instead of saying two sides are equal it says one side must not be bigger than the other. The symbol ≤ means “is less than or equal to”, so load ≤ 200 means the load can be 200 kg or anything under it. Likewise < means “is less than”, ≥ means “is greater than or equal to” and > means “is greater than”; the open side of the symbol faces the bigger amount. You solve it the same way as an equation: subtract the same amount from both sides, or divide both sides by the same positive number, and the symbol stays as it is. The answer is a range of allowed values, not a single number.',
   steps: [
    'Undo the adding: subtract the fixed weight from both sides. The symbol does not change.',
    'Undo the multiplying: divide both sides by the weight of one item, a positive number, so the symbol still does not change.',
    'If the items come whole, the answer is the largest whole number that is not more than the result.'
   ],
   example: {
    prompt: 'A cart may carry at most 150 kg. The empty cart weighs 38 kg and each crate weighs 12 kg, so 12n + 38 ≤ 150. How many crates can it take?',
    steps: ['Subtract 38 from both sides: 12n ≤ 112.', '112 ÷ 12 = 9 remainder 4, so n can be at most 9: 9 crates weigh 108 kg, but 10 would weigh 120 kg.'],
    answer: 'At most 9 crates.'
   },
   pitfalls: [
    'Rounding up: if the division gives 9 with something left over, 10 items would break the limit; the largest whole number allowed is 9.',
    'Treating ≤ as =: the answer is every value up to the limit, and the question asks for the largest whole one.',
    'Dividing both sides by a negative number reverses the symbol (≤ becomes ≥). Here every number you divide by is positive, so the symbol stays.'
   ]
  },
  guidance: [
   { prompt: 'Subtract 74 from both sides of 14n + 74 ≤ 200. How many kilograms are left for cans?', answer: [126], labels: ['kg left for cans'], explanation: '200 − 74 = 126, so 14n ≤ 126.' },
   { prompt: '14n ≤ 126. How many whole cans of 14 kg fit in 126 kg?', answer: [9], labels: ['largest number of cans'], explanation: '126 ÷ 14 = 9. 9 cans weigh 126 kg, which is not more than 126 kg; one more can would be too many.' }
  ]
 },
 {
  id: 'q19', title: 'Plotting the supply caches', topic: 'Coordinates in the plane', tier: 'Intermediate', sector: 'Map Room',
  brief: 'The scouts have hidden supply caches around the camp, and the map room needs them on the grid.',
  lesson: 'A point on a flat map is fixed by two signed numbers written (x, y): east–west first, then north–south.',
  prompt: 'The map room grid has the depot at the origin (0, 0). x counts kilometres east (negative means west) and y counts kilometres north (negative means south). Cache 1 lies 3 km west and 5 km north of the depot: enter its x, then its y. Cache 2 is logged as (4, −2): enter how many km east it is, then how many km south, both as positive distances.',
  answer: [-3, 5, 4, 2], labels: ['cache 1 x', 'cache 1 y', 'cache 2 km east', 'cache 2 km south'], tolerance: 0.01,
  hints: ['West is the negative x direction, so a point 3 km west of the depot has a negative x. North is the positive y direction.', 'In (4, −2) the first number is east–west and the second is north–south; a negative y means south.'],
  solution: 'Cache 1 is at (−3, 5): x = −3 because it is west, and y = 5 because it is north. Cache 2 at (4, −2) is 4 km east and 2 km south of the depot.',
  xp: 150, prereqs: ['q18'],
  artifact: { name: 'Grid map', description: 'The camp on squared paper, with the depot at its centre.' },
  sources: [source.q19],
  teaching: {
   intuition: 'Picture the map as a sheet of squared paper with the depot in the middle. Two number lines cross at the depot: one runs east–west, the other north–south. Any spot is found with two signed numbers: first how far east it is (a negative number means west), then how far north (a negative number means south). We write the pair in brackets, east–west first, like (6, −1): 6 km east and 1 km south. The two numbers are the point’s coordinates, called x and y, and the depot itself is (0, 0), the origin.',
   steps: [
    'For x, count the steps east or west of the origin: east is positive, west is negative.',
    'For y, count the steps north or south: north is positive, south is negative.',
    'Write the point as (x, y), always x first.'
   ],
   example: {
    prompt: 'A beacon is 6 km east and 1 km south of the depot. A well is logged at (−7, 8). Write the beacon’s coordinates and describe where the well is.',
    steps: ['East makes x = 6 and south makes y = −1, so the beacon is at (6, −1).', 'In (−7, 8) the x is negative, so the well is 7 km west, and the y is positive, so it is 8 km north.'],
    answer: 'The beacon is at (6, −1); the well is 7 km west and 8 km north.'
   },
   pitfalls: [
    'Swapping the order: (2, 6) means 2 km east and 6 km north, not 6 east and 2 north.',
    'Forgetting the sign: a point west of the depot has a negative x, and a point south has a negative y.'
   ]
  },
  guidance: [
   { prompt: 'Cache 1 is 3 km west and 5 km north of the depot. What are its x and y?', answer: [-3, 5], labels: ['x', 'y'], explanation: 'West makes x negative and north makes y positive, so cache 1 is at (−3, 5).' },
   { prompt: 'Cache 2 is at (4, −2). How many km east, and how many km south, is it?', answer: [4, 2], labels: ['km east', 'km south'], explanation: 'The first number, 4, is positive, so it is 4 km east. The second, −2, is negative, so it is 2 km south.' }
  ]
 },
 {
  id: 'q20', title: 'Laying the signal cable', topic: 'Distance between two points', tier: 'Intermediate', sector: 'Map Room',
  brief: 'A signal cable has to run straight between two points on the map, and stores need its length before they cut it.',
  lesson: 'The straight distance between two points comes from the east–west and north–south gaps: multiply each by itself, add, and take the square root.',
  prompt: 'A signal cable must run straight from the beacon at (1, 2) to the relay at (7, 10); the grid is in kilometres. Enter the east–west gap, the north–south gap, and then the straight-line distance between them in km.',
  answer: [6, 8, 10], labels: ['east–west gap (km)', 'north–south gap (km)', 'distance (km)'], tolerance: 0.01,
  hints: ['Each gap is the larger value minus the smaller: for x that is 7 − 1, and for y it is 10 − 2.', 'Multiply each gap by itself and add the two results. The distance is the number that, multiplied by itself, gives that sum.'],
  solution: 'East–west gap: 7 − 1 = 6 km. North–south gap: 10 − 2 = 8 km. The two gaps are the short sides of a triangle with a square corner, so the distance times itself is 6 × 6 + 8 × 8 = 36 + 64 = 100. Since 10 × 10 = 100, the square root of 100 is 10, and the cable is 10 km long.',
  xp: 150, prereqs: ['q19'],
  sources: [source.q20],
  teaching: {
   intuition: 'To get from one point on the grid to another you could walk east–west and then north–south, but a cable can run straight across. The east–west gap, the north–south gap and the straight cable make a triangle with a square corner, called a right angle. Such triangles follow a reliable rule, known as Pythagoras’ rule: multiply each short side by itself and add the two results; that sum equals the long side multiplied by itself. To get back from “a number times itself” to the number, take its square root: the square root of 25 is 5, because 5 × 5 = 25. When one value is negative, count the gap along the number line: from −3 to 5 is 3 steps up to 0 and then 5 more, so the gap is 3 + 5 = 8. Written as a subtraction that is 5 − (−3) = 8: taking away a negative number is the same as adding its size.',
   steps: [
    'Find the east–west gap: the larger x minus the smaller x. A gap is never negative.',
    'Find the north–south gap the same way with the y values.',
    'Multiply each gap by itself and add the two results.',
    'Take the square root of that sum: find the number that, multiplied by itself, gives it. That is the distance.'
   ],
   example: {
    prompt: 'How far apart are the points (2, 1) and (5, 5)?',
    steps: ['Gaps: 5 − 2 = 3 across and 5 − 1 = 4 up.', '3 × 3 + 4 × 4 = 9 + 16 = 25, and 5 × 5 = 25, so the distance is 5.'],
    answer: '5 units.'
   },
   pitfalls: [
    'Adding the gaps: 3 + 4 = 7 is the walking route along the grid lines, longer than the straight line, which is 5.',
    'Stopping at the sum: 25 is the distance times itself; the distance is its square root, 5.',
    'Losing a sign when a coordinate is negative: from x = −2 to x = 4 the gap is 4 − (−2) = 6, not 2.'
   ]
  },
  guidance: [
   { prompt: 'The x values are 1 and 7. What is the east–west gap?', answer: [6], labels: ['east–west gap (km)'], explanation: '7 − 1 = 6 km.' },
   { prompt: 'The y values are 2 and 10. What is the north–south gap?', answer: [8], labels: ['north–south gap (km)'], explanation: '10 − 2 = 8 km.' },
   { prompt: '6 × 6 + 8 × 8 = 100. What number times itself gives 100?', answer: [10], labels: ['distance (km)'], explanation: '10 × 10 = 100, so the straight-line distance is 10 km.' }
  ]
 },
 {
  id: 'q21', title: 'The fuel log’s slope', topic: 'Slope as rate of change', tier: 'Intermediate', sector: 'Map Room',
  brief: 'The fuel log for one tank has two readings, and Mira wants its rate of change drawn on the planning chart.',
  lesson: 'Slope is rise ÷ run: how much the graph goes up (or down) for each one step across, which is a rate of change.',
  prompt: 'The log for fuel tank C: at hour 2 the gauge read 86 L, and at hour 6 it read 62 L. The level changed at a steady rate between the readings. On a graph with hours across and litres up these are the points (2, 86) and (6, 62). Enter the rise (the change in litres, negative if the level fell), the run (the change in hours), and then the slope in litres per hour.',
  answer: [-24, 4, -6], labels: ['rise (litres)', 'run (hours)', 'slope (litres per hour)'], tolerance: 0.01,
  hints: ['Rise = later litres − earlier litres = 62 − 86. Run = later hour − earlier hour = 6 − 2.', 'Slope = rise ÷ run: divide your rise by your run, keeping the sign of the rise.'],
  solution: 'Rise = 62 − 86 = −24 L. Run = 6 − 2 = 4 hours. Slope = −24 ÷ 4 = −6 L per hour: the tank lost 6 L every hour.',
  xp: 150, prereqs: ['q20'],
  artifact: { name: 'Gradient ruler', description: 'Up over across, in one glance.' },
  sources: [source.q21],
  teaching: {
   intuition: 'A rate of change says how much one thing changes for each single step of another, like litres used per hour. On a graph, walk from one point to a later one: the run is how far you move across and the rise is how far you move up; a fall counts as a negative rise. The slope is rise ÷ run, the change up for each one step across. A positive slope means the line climbs as you read from left to right, and a negative slope means it falls. A negative number divided by a positive number is negative: −12 ÷ 3 = −4.',
   steps: [
    'Rise: the later y minus the earlier y. It is negative if the value went down.',
    'Run: the later x minus the earlier x, in the same order.',
    'Slope = rise ÷ run, in units of y per unit of x.'
   ],
   example: {
    prompt: 'At hour 1 a tank held 30 L; at hour 5 it held 50 L, filling at a steady rate. Find the rise, the run and the slope.',
    steps: ['Rise = 50 − 30 = 20 L. Run = 5 − 1 = 4 hours.', 'Slope = 20 ÷ 4 = 5 L per hour: the tank gained 5 L each hour.'],
    answer: 'Rise 20, run 4, slope 5 L per hour.'
   },
   pitfalls: [
    'Dividing run by rise: slope is rise ÷ run, up over across.',
    'Subtracting in mixed orders: if the rise is later minus earlier, the run must also be later minus earlier.',
    'Dropping the minus sign: a falling level gives a negative slope.'
   ]
  },
  guidance: [
   { prompt: 'Rise: the later reading minus the earlier one, 62 − 86. What is it?', answer: [-24], labels: ['rise (litres)'], explanation: '62 − 86 = −24 L; it is negative because the level fell.' },
   { prompt: 'Run: the later hour minus the earlier one, 6 − 2. What is it?', answer: [4], labels: ['run (hours)'], explanation: '6 − 2 = 4 hours.' },
   { prompt: 'Slope = rise ÷ run = −24 ÷ 4. What is it?', answer: [-6], labels: ['slope (litres per hour)'], explanation: '−24 ÷ 4 = −6: a change of −6 L for each hour.' }
  ]
 },
 {
  id: 'q22', title: 'The heater’s fuel line', topic: 'The line y = mx + b', tier: 'Intermediate', sector: 'Map Room',
  brief: 'The heater’s fuel rule is pinned up in the map room as a line, and the night shift needs to read it.',
  lesson: 'In y = mx + b, m is the slope (the change per step) and b is the starting value, where the line crosses the y-axis.',
  prompt: 'The litres y in the heater tank x hours after the start of a shift follow the line y = −7x + 150. Enter the slope m (litres per hour), the starting amount b (the litres at x = 0), and then the litres in the tank after 12 hours.',
  answer: [-7, 150, 66], labels: ['slope m', 'starting amount b', 'litres after the shift'], tolerance: 0.01,
  hints: ['In y = mx + b the number multiplying x is the slope m, and the number on its own is the starting value b.', 'Substitute x = 12: y = −7 × 12 + 150. Multiply before you add.'],
  solution: 'Reading y = −7x + 150: the slope is m = −7 L per hour and the starting amount is b = 150 L. After 12 hours, y = −7 × 12 + 150 = −84 + 150 = 66 L.',
  xp: 150, prereqs: ['q21'],
  sources: [source.q22],
  teaching: {
   intuition: 'Many straight-line graphs follow a simple rule: start somewhere, then change by the same amount for every step. If a tank starts with 40 L and gains 3 L each hour, after x hours it holds y = 3x + 40 litres. In general we write y = mx + b. The m is the slope, the change in y for each one step of x, and b is the starting value, the y when x is 0. On the graph, b is where the line crosses the up–down axis (the y-axis), and m tells you how steeply the line climbs, or falls if m is negative. A negative number times a positive number is negative: −7 × 12 = −84, because it is 12 lots of −7.',
   steps: [
    'Read m: the number multiplying x, with its sign.',
    'Read b: the number on its own. It is the value of y when x = 0.',
    'To find y for a given x, put that x into the rule: multiply by m first, then add b.'
   ],
   example: {
    prompt: 'A tank follows y = 3x + 40. What are the slope and the starting amount, and how much does it hold after 6 hours?',
    steps: ['m = 3 L per hour and b = 40 L.', 'y = 3 × 6 + 40 = 18 + 40 = 58 L.'],
    answer: 'm = 3, b = 40, and 58 L after 6 hours.'
   },
   pitfalls: [
    'Mixing up m and b: m is the number multiplying x; b stands alone.',
    'Dropping the sign of m: in y = −5x + 60 the slope is −5, so the line falls.',
    'Adding before multiplying when you substitute: −5 × 4 + 60 is −20 + 60 = 40.'
   ]
  },
  guidance: [
   { prompt: 'In y = −7x + 150, what number multiplies x?', answer: [-7], labels: ['slope m'], explanation: 'The slope is −7: the tank changes by −7 L for each hour.' },
   { prompt: 'What is y when x = 0, before any hours have passed?', answer: [150], labels: ['starting amount b'], explanation: '−7 × 0 + 150 = 150, so the tank starts with 150 L. That is b.' },
   { prompt: 'Put x = 12 into the rule: −7 × 12 + 150. What is y?', answer: [66], labels: ['litres after the shift'], explanation: '−7 × 12 = −84, and −84 + 150 = 66 L.' }
  ]
 },
 {
  id: 'q23', title: 'Charting the supply track', topic: 'The line through two points', tier: 'Intermediate', sector: 'Map Room',
  brief: 'A straight supply track joins two marked points on the map, and the survey wants its equation.',
  lesson: 'Two points fix a line: their rise ÷ run gives m, and putting one point into y = mx + b gives b.',
  prompt: 'A straight supply track on the map passes the pump at (2, 5) and the store at (6, 17). Find its equation in the form y = mx + b. Enter m, then b.',
  answer: [3, -1], labels: ['slope m', 'b'], tolerance: 0.01,
  hints: ['m = rise ÷ run = (17 − 5) ÷ (6 − 2).', 'Put the pump’s x and y, and your m, into y = mx + b: 5 = m × 2 + b, then solve for b.'],
  solution: 'm = (17 − 5) ÷ (6 − 2) = 12 ÷ 4 = 3. Using the pump (2, 5): 5 = 3 × 2 + b = 6 + b, so b = 5 − 6 = −1. The track is y = 3x − 1. Check with the store: 3 × 6 − 1 = 17.',
  xp: 150, prereqs: ['q22'],
  sources: [source.q23],
  teaching: {
   intuition: 'Two points are enough to fix a straight line, like pulling a string tight between two pegs. To write its rule y = mx + b, first find how steep it is: the slope m is rise ÷ run between the two points. Then find b: put one point’s x and y into y = mx + b together with your m, and what is left is a one-step equation for b. Finally check that the other point fits the rule too. Points can have negative coordinates, so two sign rules help. A negative number times a negative number is positive: −3 × (−2) = 6. And taking away a negative number is the same as adding its size: −11 − (−4) = −11 + 4 = −7.',
   steps: [
    'Slope: m = (second y − first y) ÷ (second x − first x).',
    'Put one point’s x and y, and your m, into y = mx + b.',
    'Solve that one-step equation for b.',
    'Check: the other point must fit y = mx + b as well.'
   ],
   example: {
    prompt: 'Find the line through (1, 4) and (3, 10).',
    steps: ['m = (10 − 4) ÷ (3 − 1) = 6 ÷ 2 = 3.', 'Using (1, 4): 4 = 3 × 1 + b, so b = 4 − 3 = 1.', 'Check with (3, 10): 3 × 3 + 1 = 10.'],
    answer: 'y = 3x + 1.'
   },
   pitfalls: [
    'Using one point’s x with the other point’s y when you solve for b.',
    'Taking the rise and the run in opposite orders, which flips the sign of m.',
    'Skipping the check with the second point, which catches a wrong b at once.'
   ]
  },
  guidance: [
   { prompt: 'Rise ÷ run between the two points: (17 − 5) ÷ (6 − 2). What is m?', answer: [3], labels: ['slope m'], explanation: 'The rise is 12 and the run is 4, so m = 12 ÷ 4 = 3.' },
   { prompt: '5 = 3 × 2 + b, which is 5 = 6 + b. What is b?', answer: [-1], labels: ['b'], explanation: 'Subtract 6 from both sides: b = 5 − 6 = −1.' }
  ]
 },
 {
  id: 'q24', title: 'Flying the survey drone', topic: 'Three-dimensional coordinates and signed displacements', tier: 'Intermediate', sector: 'Map Room',
  brief: 'The survey drone has flown two legs, and the map room must log where it ended up, height included.',
  lesson: 'A point in space is (x, y, z); to follow several moves, add the east parts together, the north parts together and the up parts together.',
  prompt: 'A survey drone leaves its pad at (2, −1, 3), in grid units of 100 m east, north and up from the depot. It flies the displacement (−5, 4, 2) and then (1, −6, −4). Enter its final x, y and z.',
  answer: [-2, -3, 1], labels: ['final x', 'final y', 'final z'], tolerance: 0.01,
  hints: ['Add matching positions only: x with x, y with y, z with z.', 'For x: 2 + (−5) + 1.'],
  solution: 'x: 2 + (−5) + 1 = −2. y: −1 + 4 + (−6) = −3. z: 3 + 2 + (−4) = 1. The drone ends at (−2, −3, 1).',
  xp: 150, prereqs: ['q23'],
  artifact: { name: 'Drone log', description: 'Three numbers for every place the drone has been.' },
  sources: [source.q24a, source.q24b],
  teaching: {
   intuition: 'So far a point needed two numbers, east and north. In the air, or on a tall shelf, we need a third: how far up. A point in space is written (x, y, z): east, north, up, always in that order, with negative numbers for west, south and down. A displacement is a move written the same way, as three signed changes: (2, −3, 1) means 2 east, 3 south and 1 up. To follow two moves one after the other, add them position by position: the east changes together, the north changes together and the up changes together. The three directions never mix.',
   steps: [
    'Line up the start and every move in the order x, y, z.',
    'Add the x numbers, signs included; adding a negative number is the same as taking away.',
    'Do the same for the y numbers and then the z numbers, and write the result as (x, y, z).'
   ],
   example: {
    prompt: 'A crane hook starts at (1, 0, 2) and moves (3, −2, 1), then (−4, 5, −2). Where does it end?',
    steps: ['x: 1 + 3 + (−4) = 0. y: 0 + (−2) + 5 = 3.', 'z: 2 + 1 + (−2) = 1, so the hook ends at (0, 3, 1).'],
    answer: '(0, 3, 1).'
   },
   pitfalls: [
    'Adding all the numbers into one total: the answer is three numbers, one for each direction.',
    'Mixing positions: the third number is always up–down, so add it only to other third numbers.',
    'Losing a sign: adding −6 is the same as taking away 6.'
   ]
  },
  guidance: [
   { prompt: 'Final x: start 2, then −5, then 1. What is 2 + (−5) + 1?', answer: [-2], labels: ['final x'], explanation: '2 + (−5) + 1 = −2.' },
   { prompt: 'Final y: what is −1 + 4 + (−6)?', answer: [-3], labels: ['final y'], explanation: '−1 + 4 + (−6) = −3.' },
   { prompt: 'Final z: what is 3 + 2 + (−4)?', answer: [1], labels: ['final z'], explanation: '3 + 2 + (−4) = 1, so the drone ends at (−2, −3, 1).' }
  ]
 }
);
})();
