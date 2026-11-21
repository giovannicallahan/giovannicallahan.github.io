/* Foundations missions, file c: chapter 5 "Systems and tables" (q25–q29) and chapter 6 "Powers and polynomials"
   (q30–q35). Mission objects as described in docs/PACK-FORMAT.md ("Mission"). The prompt, answers, hints, solution and
   guidance equal MISSION_GEN[id].build(canonical) in gen-c.js. */
(function(){
'use strict';
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q25', title: 'When the tanks match', topic: 'Where two lines meet', tier: 'Intermediate', sector: 'Logistics Office',
  brief: 'Two water tanks are filling at different speeds, and the crew needs to know when they hold the same amount.',
  lesson: 'The point where two lines cross is the one pair of numbers that fits both rules; find it by setting the two rules equal.',
  prompt: 'Two water tanks are being filled. Tank A holds 20 L and gains 6 L each hour, so after x hours it holds y = 6x + 20 litres. Tank B holds 40 L and gains 2 L each hour, so y = 2x + 40. On a graph the two lines cross where both tanks hold the same amount. Enter x, the hour when they match, then y, the litres each tank holds then.',
  answer: [5, 50], labels: ['x (hours)', 'y (litres)'], tolerance: 0.01,
  hints: ['At the crossing both rules give the same y, so set them equal: 6x + 20 = 2x + 40.', 'Take 2x and 20 from both sides: 4x = 20.'],
  solution: '6x + 20 = 2x + 40. Take 2x from both sides: 4x + 20 = 40. Take 20 from both sides: 4x = 20, so x = 20 ÷ 4 = 5 hours. Then y = 6 × 5 + 20 = 50 L. Check with tank B: 2 × 5 + 40 = 50 L.',
  xp: 150, prereqs: ['q24', 'q22'],
  artifact: { name: 'Crossing chart', description: 'Two filling lines drawn on one grid, with the moment they meet circled.' },
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 5.1 Solve Systems of Equations by Graphing', url: 'https://openstax.org/books/elementary-algebra-2e/pages/5-1-solve-systems-of-equations-by-graphing', description: 'Two linear equations together, and their solution as the point where the lines cross.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'Picture two tanks filling side by side. One starts lower but fills faster, so hour by hour it catches up, and at one moment both hold exactly the same amount. Draw each tank as a line on a graph, with hours along the bottom and litres up the side: that moment is where the two lines cross. Two rules taken together like this are called a system of equations, and the crossing point is its solution, the one pair of x and y that fits both rules at once.',
   steps: [
    'Write each line as a rule y = mx + b, where x is the hours and y the litres.',
    'At the crossing both rules give the same y, so set the two right-hand sides equal to each other.',
    'Solve that equation for x: take the smaller x term from both sides, then move the plain numbers to the other side and divide.',
    'Put x into either rule to get y, then check that the other rule gives the same y.'
   ],
   example: {
    prompt: 'One tank follows y = 3x + 4 and another follows y = x + 10. When do they hold the same amount, and how much?',
    steps: ['Set them equal: 3x + 4 = x + 10.', 'Take x from both sides: 2x + 4 = 10. Take 4 from both sides: 2x = 6, so x = 3.', 'y = 3 × 3 + 4 = 13. Check: 3 + 10 = 13.'],
    answer: 'After 3 hours both hold 13 litres: the lines cross at (3, 13).'
   },
   pitfalls: [
    'Changing only one side: from 5x + 2 = x + 14, taking x away from the left side alone gives a wrong equation. Take it from both sides: 4x + 2 = 14.',
    'Stopping at x: the crossing point has two numbers, so you still need y.',
    'Getting y from a rule you did not check: if the two rules give different y values, x is wrong.'
   ]
  },
  guidance: [
   { prompt: 'At the crossing both tanks hold the same amount, so 6x + 20 = 2x + 40. Taking 2x and 20 from both sides leaves 4x = 20. What is x?', answer: [5], labels: ['x (hours)'], explanation: 'x = 20 ÷ 4 = 5. After 5 hours both tanks hold the same amount.' },
   { prompt: 'Put x = 5 into tank A’s rule, y = 6x + 20. What is y?', answer: [50], labels: ['y (litres)'], explanation: 'y = 6 × 5 + 20 = 50 L. Tank B gives the same: 2 × 5 + 40 = 50 L.' }
  ]
 },
 {
  id: 'q26', title: 'Loading the grain cart', topic: 'Solving a system by substitution', tier: 'Intermediate', sector: 'Logistics Office',
  brief: 'A cart of grain and bean sacks has been weighed, and the store needs to know how many sacks of each are on it.',
  lesson: 'When one equation says what a letter equals, put that in place of the letter in the other equation, leaving one equation with one unknown.',
  prompt: 'Mira loads grain sacks of 4 kg and bean sacks of 3 kg onto one cart. There are 3 more bean sacks than grain sacks, so y = x + 3, where x is the number of grain sacks and y the number of bean sacks. The load weighs 58 kg, so 4x + 3y = 58. Enter x, then y.',
  answer: [7, 10], labels: ['x (grain sacks)', 'y (bean sacks)'], tolerance: 0.01,
  hints: ['Replace y in the weight equation with x + 3: 4x + 3(x + 3) = 58.', 'Multiply out and combine like terms: 7x + 9 = 58.'],
  solution: 'Substitute y = x + 3: 4x + 3(x + 3) = 58. Multiply out: 4x + 3x + 9 = 58, so 7x + 9 = 58. Take 9 from both sides: 7x = 49, so x = 49 ÷ 7 = 7. Then y = 7 + 3 = 10. Check: 4 × 7 + 3 × 10 = 28 + 30 = 58 kg.',
  xp: 150, prereqs: ['q25', 'q14'],
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 5.2 Solving Systems of Equations by Substitution', url: 'https://openstax.org/books/elementary-algebra-2e/pages/5-2-solving-systems-of-equations-by-substitution', description: 'Solving one equation for a variable and substituting it into the other.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'Sometimes one fact already tells you what one unknown equals in terms of the other. "There are 2 more bean sacks than grain sacks" says that y, the bean sacks, is the same amount as x + 2. Things that are equal can be swapped for each other. So wherever y appears in the other equation, write x + 2 in its place. That leaves one equation with only x in it, which you already know how to solve. This swap is called substitution.',
   steps: [
    'Find the equation that says what one letter equals, such as y = x + 2.',
    'In the other equation, replace that letter with what it equals, in brackets.',
    'Multiply out the brackets, combine like terms and solve for the letter that is left.',
    'Put that number back into the first equation to get the other letter, then check both equations.'
   ],
   example: {
    prompt: 'y = x + 2 and 3x + 5y = 42. Find x and y.',
    steps: ['Replace y: 3x + 5(x + 2) = 42.', 'Multiply out: 3x + 5x + 10 = 42, so 8x + 10 = 42, so 8x = 32 and x = 4.', 'y = 4 + 2 = 6. Check: 3 × 4 + 5 × 6 = 12 + 30 = 42.'],
    answer: 'x = 4 and y = 6.'
   },
   pitfalls: [
    'Multiplying only the first part of the brackets: 5(x + 2) is 5x + 10, not 5x + 2.',
    'Stopping after x: the question asks for y too, and y comes from the first equation.',
    'Forgetting the brackets: 5y with y = x + 2 is 5(x + 2), not 5x + 2.'
   ]
  },
  guidance: [
   { prompt: 'Put x + 3 in place of y: 4x + 3(x + 3) = 58, which multiplies out to 7x + 9 = 58. What is x?', answer: [7], labels: ['x (grain sacks)'], explanation: '7x = 58 − 9 = 49, so x = 49 ÷ 7 = 7 grain sacks.' },
   { prompt: 'y = x + 3 and x = 7. What is y?', answer: [10], labels: ['y (bean sacks)'], explanation: 'y = 7 + 3 = 10 bean sacks. Check: 28 kg + 30 kg = 58 kg.' }
  ]
 },
 {
  id: 'q27', title: 'Two deliveries, two parts', topic: 'Solving a system by elimination', tier: 'Intermediate', sector: 'Logistics Office',
  brief: 'Two deliveries of filter packs and valve packs arrived without a packing list, and the store needs each pack’s weight.',
  lesson: 'Take one equation away from the other so that one unknown cancels, solve for the unknown that is left, then put it back.',
  prompt: 'Two deliveries of the same two parts were weighed. Delivery 1: 3 filter packs and 2 valve packs weigh 23 kg, so 3x + 2y = 23. Delivery 2: 5 filter packs and 2 valve packs weigh 33 kg, so 5x + 2y = 33. Here x is the weight of one filter pack and y of one valve pack, in kg. Enter x, then y.',
  answer: [5, 4], labels: ['x (kg per filter pack)', 'y (kg per valve pack)'], tolerance: 0.01,
  hints: ['Both deliveries have 2 valve packs, so taking delivery 1 away from delivery 2 makes y disappear.', 'What is left is 2x = 33 − 23.'],
  solution: 'Take the first equation away from the second, side by side: (5x + 2y) − (3x + 2y) = 33 − 23, so 2x = 10 and x = 5 kg. Put x = 5 into the first equation: 3 × 5 + 2y = 23, so 2y = 8 and y = 4 kg.',
  xp: 150, prereqs: ['q26'],
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 5.3 Solve Systems of Equations by Elimination', url: 'https://openstax.org/books/elementary-algebra-2e/pages/5-3-solve-systems-of-equations-by-elimination', description: 'Adding or subtracting equations so that one variable cancels.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'Compare two crates that differ in only one way. If the second crate has the same valves as the first but 3 more filters, and it weighs 12 kg more, then those 3 filters must weigh the 12 kg. Taking one equation away from the other does exactly this on paper: whatever is the same in both cancels out, and what is left tells you about a single unknown. Removing an unknown this way is called elimination.',
   steps: [
    'Write the two equations one above the other, with x terms, y terms and totals lined up.',
    'Check that one letter has the same number in front of it in both equations.',
    'Take the first equation away from the second: x terms from x terms, y terms from y terms, total from total. That letter cancels.',
    'Solve for the letter that is left, then put it into either equation to find the other.'
   ],
   example: {
    prompt: '2x + 3y = 19 and 4x + 3y = 29. Find x and y.',
    steps: ['Both have 3y. Take the first away from the second: 2x = 10, so x = 5.', 'Put x = 5 into the first: 10 + 3y = 19, so 3y = 9 and y = 3.'],
    answer: 'x = 5 and y = 3.'
   },
   pitfalls: [
    'Taking away only some parts: every term and the total must be taken away, or the y terms will not cancel and the totals will not match.',
    'Forgetting the last division: from 3y = 9, y is 3, not 9.',
    'Subtracting the larger equation from the smaller and then dropping the minus sign; take the smaller away from the larger to keep the numbers positive.'
   ]
  },
  guidance: [
   { prompt: 'Take delivery 1 away from delivery 2: left side from left side, right side from right side. The y terms cancel. What is x?', answer: [5], labels: ['x (kg)'], explanation: '2x = 33 − 23 = 10, so x = 5 kg. The extra 2 filter packs weigh the extra 10 kg.' },
   { prompt: 'Put x = 5 into 3x + 2y = 23. What is y?', answer: [4], labels: ['y (kg)'], explanation: '3 × 5 = 15, so 2y = 23 − 15 = 8, and y = 4 kg.' }
  ]
 },
 {
  id: 'q28', title: 'Three kinds of crate', topic: 'Three equations in three unknowns', tier: 'Intermediate', sector: 'Logistics Office',
  brief: 'Three mixed loads have been weighed, and the office needs the weight of each kind of crate.',
  lesson: 'With three unknowns, use elimination more than once until each equation has a single unknown, then work backwards.',
  prompt: 'Three kinds of crate: ration boxes (x kg each), fuel cans (y kg each) and tool kits (z kg each). Load 1 is one of each and weighs 18 kg, so x + y + z = 18. Load 2 is 3 ration boxes, one fuel can and one tool kit, 26 kg, so 3x + y + z = 26. Load 3 is one ration box, one fuel can and 2 tool kits, 23 kg, so x + y + 2z = 23. Enter x, y and z.',
  answer: [4, 9, 5], labels: ['x (kg per ration box)', 'y (kg per fuel can)', 'z (kg per tool kit)'], tolerance: 0.01,
  hints: ['Take load 1 away from load 2: y and z cancel, leaving 2x = 8.', 'Take load 1 away from load 3 to find z, then use load 1 to find y.'],
  solution: 'Load 2 − load 1: 2x = 26 − 18 = 8, so x = 4. Load 3 − load 1: z = 23 − 18 = 5. Load 1: 4 + y + 5 = 18, so y = 18 − 4 − 5 = 9. A ration box weighs 4 kg, a fuel can 9 kg and a tool kit 5 kg.',
  xp: 150, prereqs: ['q27'],
  sources: [
   { title: 'OpenStax Intermediate Algebra 2e — 4.4 Solve Systems of Equations with Three Variables', url: 'https://openstax.org/books/intermediate-algebra-2e/pages/4-4-solve-systems-of-equations-with-three-variables', description: 'Linear systems in three variables, solved by elimination and back substitution.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'Three unknowns need three separate facts, one equation each. The plan is the one from the last mission, used twice. Pick two equations that differ in only one kind of crate and take one away from the other: everything else cancels, and one unknown is left alone. Do it again with another pair to get a second unknown. Then put the two numbers you know into any equation to find the third.',
   steps: [
    'Write all three equations with x, y, z and the totals lined up.',
    'Take one equation away from another so that two letters cancel, and solve for the one left.',
    'Do the same with a different pair to find a second letter.',
    'Put both numbers into one of the original equations to find the third letter, then check all three equations.'
   ],
   example: {
    prompt: 'x + y + z = 10, 2x + y + z = 13 and x + y + 4z = 19. Find x, y and z.',
    steps: ['Second minus first: x = 3.', 'Third minus first: 3z = 9, so z = 3.', 'First: 3 + y + 3 = 10, so y = 4. Check: 6 + 4 + 3 = 13 and 3 + 4 + 12 = 19.'],
    answer: 'x = 3, y = 4 and z = 3.'
   },
   pitfalls: [
    'Taking away equations that differ in two letters: then two unknowns are left and you cannot finish yet.',
    'Forgetting to divide: if 3z = 9, z is 3, not 9.',
    'Entering the numbers in the wrong order: the boxes ask for x, then y, then z.'
   ]
  },
  guidance: [
   { prompt: 'Take load 1 (x + y + z = 18) away from load 2 (3x + y + z = 26). What is x?', answer: [4], labels: ['x (kg)'], explanation: 'y and z cancel: 2x = 8, so x = 4 kg.' },
   { prompt: 'Take load 1 away from load 3 (x + y + 2z = 23). What is z?', answer: [5], labels: ['z (kg)'], explanation: 'x and y cancel: z = 5 kg.' },
   { prompt: 'Put x = 4 and z = 5 into load 1, x + y + z = 18. What is y?', answer: [9], labels: ['y (kg)'], explanation: 'y = 18 − 4 − 5 = 9 kg.' }
  ]
 },
 {
  id: 'q29', title: 'The shipping grid', topic: 'Data in a grid and summation notation', tier: 'Intermediate', sector: 'Logistics Office',
  brief: 'The shipping log for two depots over three days has to be totalled by depot, by day and overall.',
  lesson: 'In a grid each number has a row and a column; Σ is shorthand for adding a list, and its counter says which entries to add.',
  prompt: 'Crates sent out by two depots over three days, as a grid with 2 rows and 3 columns. Row 1, North depot: 12, 7, 9. Row 2, South depot: 5, 11, 8. Columns 1, 2 and 3 are days 1, 2 and 3, and a(i, j) is the number in row i, column j. Enter Σ a(2, j) for j = 1 to 3 (the row 2 sum), then Σ a(i, 3) for i = 1 to 2 (the column 3 sum), then the grand total of all six numbers.',
  answer: [24, 17, 52], labels: ['row 2 sum', 'column 3 sum', 'grand total'], tolerance: 0.01,
  hints: ['Σ a(2, j) for j = 1 to 3 is a(2, 1) + a(2, 2) + a(2, 3) = 5 + 11 + 8.', 'Σ a(i, 3) for i = 1 to 2 is a(1, 3) + a(2, 3) = 9 + 8. The grand total is the row 1 sum plus the row 2 sum.'],
  solution: 'Row 2: 5 + 11 + 8 = 24. Column 3: 9 + 8 = 17. Row 1: 12 + 7 + 9 = 28, so the grand total is 28 + 24 = 52. Check with the columns: 17 + 18 + 17 = 52.',
  xp: 150, prereqs: ['q28'],
  artifact: { name: 'Shipping ledger', description: 'Two depots, three days, every row and column added up.' },
  sources: [
   { title: 'OpenStax Precalculus 2e — 9.5 Matrices and Matrix Operations', url: 'https://openstax.org/books/precalculus-2e/pages/9-5-matrices-and-matrix-operations', description: 'Numbers arranged in rows and columns, and how each entry is named by its row and column.', verified: '2026-11-21' },
   { title: 'OpenStax Precalculus 2e — 11.4 Series and Their Notations', url: 'https://openstax.org/books/precalculus-2e/pages/11-4-series-and-their-notations', description: 'Summation notation with the Greek letter sigma and an index.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'A grid, also called a table or later a matrix, stores numbers in rows across and columns down. Think of a shelf chart: each row is one depot, each column is one day. To point at one number, give its row first, then its column: a(2, 3) means row 2, column 3. Adding a whole row or column comes up so often that it has a short form. Σ, the Greek capital letter sigma, means "add up". Σ a(2, j) for j = 1 to 3 means: let the counter j take the values 1, 2 and 3 in turn, and add a(2, 1) + a(2, 2) + a(2, 3), the whole of row 2.',
   steps: [
    'Name an entry by its row first, then its column: a(i, j) is in row i, column j.',
    'Read a Σ by its counter: the letter that changes tells you whether you move along a row (j changes) or down a column (i changes).',
    'Write out every term the counter gives, then add them.',
    'The grand total is the sum of all row sums, and also the sum of all column sums; use one to check the other.'
   ],
   example: {
    prompt: 'Row 1: 4, 6, 10. Row 2: 3, 2, 5. Find Σ a(1, j) for j = 1 to 3, Σ a(i, 2) for i = 1 to 2, and the grand total.',
    steps: ['Row 1: 4 + 6 + 10 = 20.', 'Column 2: 6 + 2 = 8.', 'Row 2 is 3 + 2 + 5 = 10, so the grand total is 20 + 10 = 30. Columns check: 7 + 8 + 15 = 30.'],
    answer: 'Row 1 sum 20, column 2 sum 8, grand total 30.'
   },
   pitfalls: [
    'Reading the column first: a(2, 3) is row 2, column 3, not row 3, column 2.',
    'Adding along the wrong direction: when i is the counter, you move down a column, not along a row.',
    'Counting a number twice in the grand total by adding a row sum and a column sum together.'
   ]
  },
  guidance: [
   { prompt: 'What is a(2, 3), the number in row 2, column 3?', answer: [8], labels: ['a(2, 3)'], explanation: 'Row 2 is 5, 11, 8; its third number is 8.' },
   { prompt: 'Add along row 2 (5 + 11 + 8), then down column 3 (9 + 8). Enter both sums.', answer: [24, 17], labels: ['row 2 sum', 'column 3 sum'], explanation: 'The row 2 sum is 24 and the column 3 sum is 17.' },
   { prompt: 'Row 1 adds to 28. What is the grand total of all six numbers?', answer: [52], labels: ['grand total'], explanation: '28 + 24 = 52. Adding the three column sums gives the same: 17 + 18 + 17 = 52.' }
  ]
 },
 {
  id: 'q30', title: 'Halving the alloy sheet', topic: 'Exponent rules', tier: 'Advanced', sector: 'Fabrication Yard',
  brief: 'The fabrication yard is cutting alloy sheets and filling a cube-shaped tank, and both counts grow by repeated multiplying.',
  lesson: 'An exponent counts how many times the base is multiplied: multiplying powers of one base adds the exponents, and a power of a power multiplies them.',
  prompt: 'A sheet of alloy is cut in half, then every piece is cut in half again, 4 times in all: that makes 2⁴ pieces. Then every piece is halved 5 more times, which multiplies the count by 2⁵. So there are 2⁴ × 2⁵ pieces. Write this as one power of 2 and enter the exponent, then enter the number of pieces. Next, a cube-shaped tank has sides of 3² = 9 decimetres (a decimetre, dm for short, is a tenth of a metre), so it holds (3²)³ cubic decimetres. Write this as one power of 3 and enter the exponent.',
  answer: [9, 512, 6], labels: ['exponent of 2', 'number of pieces', 'exponent for the tank'], tolerance: 0.01,
  hints: ['Multiplying powers of the same base adds the exponents: count all the 2s being multiplied together.', 'A power of a power multiplies the exponents: write out (3²)³ as 3² × 3² × 3² and count the 3s.'],
  solution: '2⁴ × 2⁵ is 4 twos times 5 twos, 9 twos in all: 2⁹ = 512 pieces. (3²)³ = 3² × 3² × 3², three groups of 2 threes, 6 threes in all, so it is 3⁶: the exponent is 6. The tank holds 9 × 9 × 9 = 729 dm³.',
  xp: 200, prereqs: ['q29', 'q03'],
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 6.2 Use Multiplication Properties of Exponents', url: 'https://openstax.org/books/elementary-algebra-2e/pages/6-2-use-multiplication-properties-of-exponents', description: 'Exponent notation, the product property and the power property.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'Cut a sheet in half and you have 2 pieces; halve every piece again and you have 2 × 2 = 4; again, 2 × 2 × 2 = 8. Multiplying the same number over and over is so common that it has a short form: 2⁵, read "2 to the power 5", means five 2s multiplied together, 2 × 2 × 2 × 2 × 2 = 32. The big number is the base and the small raised number is the exponent, which counts how many times the base is used. Because the exponent is only a count, two rules follow. 2³ × 2⁴ strings three 2s and four 2s together, seven 2s in all, so it is 2⁷. And (5²)³ repeats a group of two 5s three times, six 5s in all, so it is 5⁶.',
   steps: [
    'Read a power as repeated multiplying: the exponent says how many times the base appears.',
    'Multiplying powers with the same base: keep the base and add the exponents, because you are counting all the copies of the base together.',
    'A power raised to a power: keep the base and multiply the exponents, because the whole group of copies is repeated.',
    'A cube with sides s holds s × s × s = s³ unit cubes, which is why a cube’s volume is the side to the power 3 (the side cubed).'
   ],
   example: {
    prompt: 'Write 3² × 3³ as one power of 3 and work it out. Then write (2²)³ as one power of 2.',
    steps: ['3² × 3³ is two 3s times three 3s, five 3s: 3⁵ = 243.', '(2²)³ is three groups of two 2s, six 2s: 2⁶ = 64.'],
    answer: '3⁵ = 243 and 2⁶.'
   },
   pitfalls: [
    'Multiplying the exponents when you should add them: 2³ × 2⁴ is 2⁷, not 2¹².',
    'Treating the exponent as a multiplier: 2⁵ is 2 × 2 × 2 × 2 × 2 = 32, not 2 × 5 = 10.',
    'Joining different bases: 2³ × 3⁴ cannot be written as one power.'
   ]
  },
  guidance: [
   { prompt: '2⁴ × 2⁵ is 4 twos multiplied by 5 more twos. How many twos is that in all?', answer: [9], labels: ['exponent of 2'], explanation: '4 + 5 = 9, so the product is 2⁹.' },
   { prompt: 'Work out 2⁹: double 1, 9 times. How many pieces?', answer: [512], labels: ['number of pieces'], explanation: '2⁹ = 512 pieces.' },
   { prompt: '(3²)³ is 3² written three times and multiplied. How many 3s are multiplied in all?', answer: [6], labels: ['exponent for the tank'], explanation: 'Three groups of 2 make 6, so (3²)³ = 3⁶.' }
  ]
 },
 {
  id: 'q31', title: 'Square plates and braces', topic: 'Square roots and radicals', tier: 'Advanced', sector: 'Fabrication Yard',
  brief: 'A square floor plate must be cut to size, and a brace length has to be written in its simplest exact form.',
  lesson: 'The square root undoes squaring; to simplify a root, split off the largest perfect square and take its root outside.',
  prompt: 'A square floor plate has an area of 144 m². Enter the length of its side in metres. A diagonal brace in the yard measures √72 m. Simplify √72 into the form k√m, where k is a whole number and no perfect square other than 1 divides m exactly, and enter k, then m.',
  answer: [12, 6, 2], labels: ['side (m)', 'k (outside the root)', 'm (inside the root)'], tolerance: 0.01,
  hints: ['Which whole number times itself gives 144?', 'Try the perfect squares 4, 9, 16, 25, 36, 49 … and find the largest one that divides 72 exactly.'],
  solution: '12 × 12 = 144, so the side is √144 = 12 m. The largest perfect square that divides 72 is 36, and 72 = 36 × 2, so √72 = √36 × √2 = 6√2 m.',
  xp: 200, prereqs: ['q30'],
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 9.1 Simplify and Use Square Roots', url: 'https://openstax.org/books/elementary-algebra-2e/pages/9-1-simplify-and-use-square-roots', description: 'Square roots, perfect squares and the radical sign.', verified: '2026-11-21' },
   { title: 'OpenStax Elementary Algebra 2e — 9.2 Simplify Square Roots', url: 'https://openstax.org/books/elementary-algebra-2e/pages/9-2-simplify-square-roots', description: 'Using the product property to pull perfect squares out of a square root.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'A square plate with sides of 3 m has an area of 3 × 3 = 3² = 9 square metres. Going backwards, from the area to the side, is called taking the square root, written √: √9 = 3, because 3 × 3 = 9. The sign √ is called the radical sign, and a root written with it, such as √2, is called a radical. Numbers such as 1, 4, 9, 16, 25 and 36, each a whole number times itself, are called perfect squares. Most numbers are not, and their roots are not whole numbers. But a root can be split over a product, √(a × b) = √a × √b, so any perfect square hiding inside can come out: √50 = √(25 × 2) = √25 × √2 = 5√2, read "five root two".',
   steps: [
    'To find the side of a square from its area, find the whole number that times itself gives the area.',
    'To simplify a root, find the largest perfect square that divides the number exactly.',
    'Write the number as that perfect square times what is left, and split the root over the product.',
    'Take the root of the perfect square outside; what is left stays under the root, and no perfect square other than 1 should divide it exactly.'
   ],
   example: {
    prompt: 'A square plate has an area of 49 m². How long is a side? Simplify √45.',
    steps: ['7 × 7 = 49, so the side is √49 = 7 m.', '45 = 9 × 5 and 9 is the largest perfect square dividing 45, so √45 = √9 × √5 = 3√5.'],
    answer: 'A side is 7 m, and √45 = 3√5.'
   },
   pitfalls: [
    'Halving instead of taking the root: √16 is 4, because 4 × 4 = 16, not 8.',
    'Stopping too early: √48 = 2√12 is not finished, because 12 still holds the perfect square 4. The answer is 4√3.',
    'Putting the square itself outside: √(9 × 5) is 3√5, not 9√5.'
   ]
  },
  guidance: [
   { prompt: 'The side of a square, times itself, gives the area 144 m². What is the side?', answer: [12], labels: ['side (m)'], explanation: '12 × 12 = 144, so √144 = 12 m.' },
   { prompt: 'What is the largest perfect square that divides 72 exactly?', answer: [36], labels: ['largest perfect square'], explanation: '72 ÷ 36 = 2, and 36 = 6 × 6. No larger perfect square divides 72.' },
   { prompt: '√72 = √36 × √2. Enter k, the root of the perfect square, then m, the number left under the root.', answer: [6, 2], labels: ['k', 'm'], explanation: '√36 = 6, so √72 = 6√2.' }
  ]
 },
 {
  id: 'q32', title: 'Sizing the deck panels', topic: 'Adding and multiplying polynomials', tier: 'Advanced', sector: 'Fabrication Yard',
  brief: 'Two deck panels have to be ordered before their final size is chosen, so their total area must be written as a formula.',
  lesson: 'Multiply brackets by multiplying every part of one by every part of the other, then add like terms.',
  prompt: 'Two deck panels are being sized, where x stands for a length in metres that is not chosen yet. The first panel is a rectangle x + 3 m by x + 5 m, so its area is (x + 3)(x + 5) m². The second panel’s area is 2x² + 3x + 4 m². Multiply out the first area, add the second, and write the total in the form (number)x² + (number)x + (number). Enter the three numbers in that order.',
  answer: [3, 11, 19], labels: ['x² coefficient', 'x coefficient', 'constant'], tolerance: 0.01,
  hints: ['Multiply each part of the first bracket by each part of the second: (x + 3)(x + 5) = x² + 5x + 3x + 15.', 'Add like terms: x² terms together, x terms together, plain numbers together.'],
  solution: '(x + 3)(x + 5) = x × x + x × 5 + 3 × x + 3 × 5 = x² + 8x + 15. Adding 2x² + 3x + 4 gives 3x² + 11x + 19 m².',
  xp: 200, prereqs: ['q31', 'q15'],
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 6.1 Add and Subtract Polynomials', url: 'https://openstax.org/books/elementary-algebra-2e/pages/6-1-add-and-subtract-polynomials', description: 'Polynomials, like terms, and adding and subtracting them.', verified: '2026-11-21' },
   { title: 'OpenStax Elementary Algebra 2e — 6.3 Multiply Polynomials', url: 'https://openstax.org/books/elementary-algebra-2e/pages/6-3-multiply-polynomials', description: 'Multiplying binomials by distributing every term, with an area picture.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'A polynomial is a sum of terms such as 3x², 2x and 5, where x stands for a number and x² means x × x. The number in front of a term is its coefficient, and a plain number on its own is the constant. Terms with the same letter part are like terms and add just as crates do: 3x² + 2x² = 5x², but x² and x are different kinds and stay apart. To multiply two brackets, picture a rectangle with sides x + 2 and x + 4. Cut it into four pieces: an x by x square, an x by 4 strip, a 2 by x strip and a 2 by 4 block. The whole area is the sum of the pieces: x² + 4x + 2x + 8 = x² + 6x + 8.',
   steps: [
    'Multiply each part of the first bracket by each part of the second: four products for two brackets of two parts.',
    'Write the four products as a sum: x × x is x², a number times x is that number of x.',
    'Combine like terms: the two x terms add into one.',
    'To add two polynomials, add the x² coefficients, then the x coefficients, then the constants.'
   ],
   example: {
    prompt: 'Multiply out (x + 1)(x + 6), then add x² + 2x + 7.',
    steps: ['(x + 1)(x + 6) = x² + 6x + x + 6 = x² + 7x + 6.', 'Add x² + 2x + 7: (1 + 1)x² + (7 + 2)x + (6 + 7) = 2x² + 9x + 13.'],
    answer: '2x² + 9x + 13.'
   },
   pitfalls: [
    'Multiplying only first with first and last with last: (x + 2)(x + 4) is not x² + 8, because the two strips 4x and 2x are missing.',
    'Adding unlike terms: 3x² + 2x does not make 5x² or 5x³; they stay as two terms.',
    'Forgetting that x² alone has coefficient 1 when you add: x² + 2x² is 3x².'
   ]
  },
  guidance: [
   { prompt: 'Multiply out (x + 3)(x + 5): the four pieces are x², 5x, 3x and 3 × 5. Enter the x coefficient and the constant.', answer: [8, 15], labels: ['x coefficient', 'constant'], explanation: '5x + 3x = 8x and 3 × 5 = 15, so the first area is x² + 8x + 15.' },
   { prompt: 'Add x² + 8x + 15 and 2x² + 3x + 4. Enter the x² coefficient, the x coefficient and the constant.', answer: [3, 11, 19], labels: ['x² coefficient', 'x coefficient', 'constant'], explanation: '1 + 2 = 3, 8 + 3 = 11 and 15 + 4 = 19.' }
  ]
 },
 {
  id: 'q33', title: 'Finding the plate’s sides', topic: 'Factoring', tier: 'Advanced', sector: 'Fabrication Yard',
  brief: 'A plate’s area was logged as a formula, and the cutter needs its two side lengths back.',
  lesson: 'To factor x² + bx + c, find two numbers that multiply to c and add to b; they go in the two brackets.',
  prompt: 'A rectangular plate has an area of x² + 9x + 20 m², and its sides are x plus one number and x plus another number, in metres. Factor the area into the form (x + number)(x + number) and enter the two numbers, smaller first.',
  answer: [4, 5], labels: ['smaller number', 'larger number'], tolerance: 0.01,
  hints: ['Look for two whole numbers that multiply to 20 and add to 9.', 'The pairs that multiply to 20 are 1 and 20, 2 and 10, 4 and 5.'],
  solution: '4 × 5 = 20 and 4 + 5 = 9, so x² + 9x + 20 = (x + 4)(x + 5). Check: (x + 4)(x + 5) = x² + 5x + 4x + 20 = x² + 9x + 20.',
  xp: 200, prereqs: ['q32'],
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 7.2 Factor Trinomials of the Form x2+bx+c', url: 'https://openstax.org/books/elementary-algebra-2e/pages/7-2-factor-trinomials-of-the-form-x2-bx-c', description: 'Factoring x² + bx + c by finding two numbers with the right product and sum.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'Factoring is multiplying run backwards. In the last mission (x + 2)(x + 4) came out as x² + 6x + 8: the 6 in the middle is 2 + 4, the two strips added, and the 8 at the end is 2 × 4, the corner block. So to go back from a polynomial like x² + 6x + 8 to its two brackets, look for two numbers that multiply to the constant and add to the x coefficient. Those two numbers are what go in the brackets, and each bracket is one side of the rectangle.',
   steps: [
    'Read off the x coefficient and the constant.',
    'List the pairs of whole numbers that multiply to the constant.',
    'Pick the pair whose sum is the x coefficient.',
    'Write (x + first number)(x + second number), and check by multiplying it out.'
   ],
   example: {
    prompt: 'Factor x² + 7x + 10.',
    steps: ['Pairs that multiply to 10: 1 and 10, 2 and 5.', '2 + 5 = 7, so x² + 7x + 10 = (x + 2)(x + 5). Check: x² + 5x + 2x + 10.'],
    answer: '(x + 2)(x + 5).'
   },
   pitfalls: [
    'Picking a pair that multiplies correctly but adds wrongly: for x² + 7x + 12, 2 and 6 multiply to 12 but add to 8; the pair is 3 and 4.',
    'Swapping the jobs: the numbers must multiply to the constant and add to the x coefficient, not the other way round.',
    'Not checking: multiply your brackets back out; you must get the polynomial you started with.'
   ]
  },
  guidance: [
   { prompt: 'The two numbers must add to the x coefficient and multiply to the constant. Enter that sum, then that product.', answer: [9, 20], labels: ['sum', 'product'], explanation: 'In x² + 9x + 20 the x coefficient is 9 and the constant is 20.' },
   { prompt: 'The pairs that multiply to 20 are 1 and 20, 2 and 10, 4 and 5. Which pair adds to 9? Enter it, smaller first.', answer: [4, 5], labels: ['smaller number', 'larger number'], explanation: '4 + 5 = 9, so the area is (x + 4)(x + 5).' }
  ]
 },
 {
  id: 'q34', title: 'The drainage trough', topic: 'Quadratics: roots and vertex', tier: 'Advanced', sector: 'Fabrication Yard',
  brief: 'A curved drainage trough must be marked out on the yard floor, and the crew needs its edges and its deepest point.',
  lesson: 'A quadratic’s graph is a parabola; its roots are where y = 0, found by factoring, and its vertex is halfway between them.',
  prompt: 'The bottom of a drainage trough in the yard follows the curve y = x² − 8x + 12, where x is the distance along the floor and y the height above floor level, both in decimetres (dm, tenths of a metre). Floor level is y = 0. Enter the two x values where the curve meets floor level, smaller first, then the x and the y of its lowest point, the vertex.',
  answer: [2, 6, 4, -4], labels: ['first root x', 'second root x', 'vertex x', 'vertex y'], tolerance: 0.01,
  hints: ['Set y = 0 and factor: find two numbers that multiply to 12 and add to −8.', 'The vertex is halfway between the two roots. Put its x into the rule to get its y.'],
  solution: 'x² − 8x + 12 = (x − 2)(x − 6), because (−2) × (−6) = 12 and (−2) + (−6) = −8. A product is 0 only when one factor is 0, so y = 0 at x = 2 and at x = 6. The vertex is halfway: x = (2 + 6) ÷ 2 = 4. There y = 4² − 8 × 4 + 12 = 16 − 32 + 12 = −4, so the lowest point is 4 dm below floor level.',
  xp: 200, prereqs: ['q33'],
  artifact: { name: 'Trough template', description: 'A parabola traced on the yard floor, roots and vertex marked in chalk.' },
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 10.5 Graphing Quadratic Equations in Two Variables', url: 'https://openstax.org/books/elementary-algebra-2e/pages/10-5-graphing-quadratic-equations-in-two-variables', description: 'Parabolas, their intercepts, axis of symmetry and vertex.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'A rule with an x² in it, such as y = x² − 4x + 3, is called a quadratic. Its graph is not a straight line but a U-shaped curve called a parabola. Picture the cross-section of a trough: the curve dips below floor level and comes back up. Two kinds of point matter. The places where the curve crosses floor level, where y = 0, are called the roots. The lowest point is called the vertex. A parabola is the same on both sides, like a mirror image, so the vertex sits exactly halfway between the two roots.',
   steps: [
    'Set y = 0 and factor. x − 1 is x + (−1), so the last mission’s method still works with negative numbers. A negative times a negative is positive: (−2) × (−6) = 12, because multiplying by a negative reverses the direction, and reversing twice points the positive way again. When the middle sign is minus and the constant is plus, both numbers are negative: x² − 4x + 3 = (x − 1)(x − 3), since (−1) × (−3) = 3 and (−1) + (−3) = −4.',
    'A product is 0 only when one of its factors is 0, so (x − 1)(x − 3) = 0 at x = 1 and at x = 3. These are the roots.',
    'The vertex x is halfway between the roots: add them and divide by 2.',
    'Put the vertex x into the rule to get the vertex y. Below floor level it is negative.'
   ],
   example: {
    prompt: 'Find the roots and the vertex of y = x² − 10x + 16.',
    steps: ['(−2) × (−8) = 16 and (−2) + (−8) = −10, so y = (x − 2)(x − 8): roots x = 2 and x = 8.', 'Vertex x = (2 + 8) ÷ 2 = 5; y = 25 − 50 + 16 = −9.'],
    answer: 'Roots 2 and 8; vertex (5, −9).'
   },
   pitfalls: [
    'Flipping the signs of the roots: (x − 3)(x − 7) is 0 at x = 3 and x = 7, not at −3 and −7.',
    'Using the middle coefficient as the vertex x: for x² − 10x + 16 the vertex is at half of 10, which is 5, not 10.',
    'Forgetting the vertex y: the vertex is a point, so put its x back into the rule.'
   ]
  },
  guidance: [
   { prompt: 'x² − 8x + 12 = (x − 2)(x − 6). At which two x values is this 0? Enter the smaller first.', answer: [2, 6], labels: ['first root x', 'second root x'], explanation: 'x − 2 is 0 at x = 2 and x − 6 is 0 at x = 6. These are the roots.' },
   { prompt: 'The vertex sits halfway between x = 2 and x = 6. What is its x?', answer: [4], labels: ['vertex x'], explanation: '(2 + 6) ÷ 2 = 4.' },
   { prompt: 'Put x = 4 into y = x² − 8x + 12. What is y?', answer: [-4], labels: ['vertex y'], explanation: '16 − 32 + 12 = −4. The trough bottom is 4 dm below floor level.' }
  ]
 },
 {
  id: 'q35', title: 'Cutting the strip', topic: 'Rational expressions', tier: 'Advanced', sector: 'Fabrication Yard',
  brief: 'A plate whose size is still a formula is to be cut into one long strip, and the cutter needs the strip’s length.',
  lesson: 'Simplify a fraction of polynomials by factoring and cancelling a shared factor, and rule out any x that makes the bottom zero.',
  prompt: 'A plate with an area of x² + 5x + 6 m² is cut into a strip x + 2 m wide. Its length is the area divided by the width: (x² + 5x + 6) ÷ (x + 2). Simplify this to x + (a number) and enter that number. Then enter the length in metres when x = 7, and the one value of x for which you would be dividing by 0.',
  answer: [3, 10, -2], labels: ['number after x', 'length (m)', 'x not allowed'], tolerance: 0.01,
  hints: ['Factor the top: find two numbers that multiply to 6 and add to 5. One of them is 2, because the width x + 2 must be one of the brackets.', 'Which x makes the width, x + 2, equal to 0? Dividing by 0 has no meaning.'],
  solution: '(x² + 5x + 6) ÷ (x + 2) = (x + 2)(x + 3) ÷ (x + 2) = x + 3, after cancelling the shared factor x + 2. At x = 7 the length is 7 + 3 = 10 m. Check: (49 + 35 + 6) ÷ (7 + 2) = 90 ÷ 9 = 10. The bottom is 0 when x = −2, so x = −2 is not allowed.',
  xp: 200, prereqs: ['q34', 'q08'],
  sources: [
   { title: 'OpenStax Elementary Algebra 2e — 8.1 Simplify Rational Expressions', url: 'https://openstax.org/books/elementary-algebra-2e/pages/8-1-simplify-rational-expressions', description: 'Rational expressions, values that make them undefined, and simplifying by cancelling common factors.', verified: '2026-11-21' }
  ],
  teaching: {
   intuition: 'A fraction such as 6/8 simplifies by cancelling a factor that the top and the bottom share: 6/8 = (2 × 3)/(2 × 4) = 3/4. A rational expression is a fraction whose top and bottom are polynomials, such as (x² + 7x + 12) ÷ (x + 3). It simplifies the same way: factor the top and the bottom, then cancel a factor they share. Think of a plate cut into a strip: area divided by width gives length. One warning comes with it. You can never divide by zero, so any x that makes the bottom zero is not allowed, even after the fraction looks simpler.',
   steps: [
    'Factor the top (and the bottom, if it can be factored).',
    'Cancel a factor that appears in both the top and the bottom. Only whole factors cancel, never single terms.',
    'Find the x that makes the original bottom equal to 0; that x is not allowed.',
    'To get a value, put x into the simplified form, and check it against the original fraction.'
   ],
   example: {
    prompt: 'Simplify (x² + 7x + 12) ÷ (x + 3), find its value at x = 2, and say which x is not allowed.',
    steps: ['x² + 7x + 12 = (x + 3)(x + 4), so the fraction is x + 4.', 'At x = 2: 2 + 4 = 6. Check: (4 + 14 + 12) ÷ 5 = 30 ÷ 5 = 6.', 'x + 3 = 0 at x = −3, so x = −3 is not allowed.'],
    answer: 'x + 4; the value at x = 2 is 6; x = −3 is not allowed.'
   },
   pitfalls: [
    'Cancelling terms instead of factors: in (x² + 5) ÷ (x + 5) you cannot cross out the x or the 5; only a whole factor shared by top and bottom cancels.',
    'Forgetting the ruled-out value: x + 4 looks fine at x = −3, but the original bottom is 0 there.',
    'Getting the sign of the ruled-out value wrong: x + 3 is 0 at x = −3, not at x = 3.'
   ]
  },
  guidance: [
   { prompt: 'x² + 5x + 6 = (x + 2)(x + ?). Which number goes in place of the question mark?', answer: [3], labels: ['number after x'], explanation: '2 × 3 = 6 and 2 + 3 = 5, so the top is (x + 2)(x + 3) and it simplifies to x + 3.' },
   { prompt: 'The length is x + 3. What is it when x = 7?', answer: [10], labels: ['length (m)'], explanation: '7 + 3 = 10 m, the same as 90 ÷ 9.' },
   { prompt: 'For which x is the bottom, x + 2, equal to 0?', answer: [-2], labels: ['x not allowed'], explanation: '−2 + 2 = 0, so x = −2 would mean dividing by 0. It is not allowed.' }
  ]
 }
);
})();
