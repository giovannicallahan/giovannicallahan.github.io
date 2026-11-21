/* Foundations missions, file a: q01–q12, chapters 1 (Number sense) and 2 (Parts and ratios).
   Mission objects as described in docs/PACK-FORMAT.md ("Mission"). Generators: gen-a.js (build(canonical) reproduces
   the prompt, hints, solution and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js. */
(function(){
'use strict';
/* OpenStax Prealgebra 2e sections, each opened on 2026-11-21 and checked against its title. */
const source = {
 s1_1: { title: 'OpenStax Prealgebra 2e — 1.1 Introduction to Whole Numbers', url: 'https://openstax.org/books/prealgebra-2e/pages/1-1-introduction-to-whole-numbers', description: 'Place value, and reading and writing whole numbers.', verified: '2026-11-21' },
 s1_2: { title: 'OpenStax Prealgebra 2e — 1.2 Add Whole Numbers', url: 'https://openstax.org/books/prealgebra-2e/pages/1-2-add-whole-numbers', description: 'Adding whole numbers, including carrying.', verified: '2026-11-21' },
 s1_3: { title: 'OpenStax Prealgebra 2e — 1.3 Subtract Whole Numbers', url: 'https://openstax.org/books/prealgebra-2e/pages/1-3-subtract-whole-numbers', description: 'Subtracting whole numbers, including borrowing.', verified: '2026-11-21' },
 s1_4: { title: 'OpenStax Prealgebra 2e — 1.4 Multiply Whole Numbers', url: 'https://openstax.org/books/prealgebra-2e/pages/1-4-multiply-whole-numbers', description: 'Multiplication as equal groups, and multiplying larger whole numbers.', verified: '2026-11-21' },
 s1_5: { title: 'OpenStax Prealgebra 2e — 1.5 Divide Whole Numbers', url: 'https://openstax.org/books/prealgebra-2e/pages/1-5-divide-whole-numbers', description: 'Division as sharing into equal groups, with remainders.', verified: '2026-11-21' },
 s2_1: { title: 'OpenStax Prealgebra 2e — 2.1 Use the Language of Algebra', url: 'https://openstax.org/books/prealgebra-2e/pages/2-1-use-the-language-of-algebra', description: 'Includes simplifying expressions with the order of operations.', verified: '2026-11-21' },
 s3_1: { title: 'OpenStax Prealgebra 2e — 3.1 Introduction to Integers', url: 'https://openstax.org/books/prealgebra-2e/pages/3-1-introduction-to-integers', description: 'Negative numbers and locating them on the number line.', verified: '2026-11-21' },
 s4_1: { title: 'OpenStax Prealgebra 2e — 4.1 Visualize Fractions', url: 'https://openstax.org/books/prealgebra-2e/pages/4-1-visualize-fractions', description: 'What fractions mean, modelled as parts of a whole, and equivalent fractions.', verified: '2026-11-21' },
 s4_2: { title: 'OpenStax Prealgebra 2e — 4.2 Multiply and Divide Fractions', url: 'https://openstax.org/books/prealgebra-2e/pages/4-2-multiply-and-divide-fractions', description: 'Simplifying fractions, and multiplying and dividing them.', verified: '2026-11-21' },
 s4_5: { title: 'OpenStax Prealgebra 2e — 4.5 Add and Subtract Fractions with Different Denominators', url: 'https://openstax.org/books/prealgebra-2e/pages/4-5-add-and-subtract-fractions-with-different-denominators', description: 'Common denominators and adding fractions.', verified: '2026-11-21' },
 s5_1: { title: 'OpenStax Prealgebra 2e — 5.1 Decimals', url: 'https://openstax.org/books/prealgebra-2e/pages/5-1-decimals', description: 'Decimal place value and adding and subtracting decimals.', verified: '2026-11-21' },
 s6_1: { title: 'OpenStax Prealgebra 2e — 6.1 Understand Percent', url: 'https://openstax.org/books/prealgebra-2e/pages/6-1-understand-percent', description: 'Percent as a ratio to 100, and converting percents.', verified: '2026-11-21' },
 s5_6: { title: 'OpenStax Prealgebra 2e — 5.6 Ratios and Rate', url: 'https://openstax.org/books/prealgebra-2e/pages/5-6-ratios-and-rate', description: 'Ratios, rates and unit rates.', verified: '2026-11-21' },
 s6_5: { title: 'OpenStax Prealgebra 2e — 6.5 Solve Proportions and their Applications', url: 'https://openstax.org/books/prealgebra-2e/pages/6-5-solve-proportions-and-their-applications', description: 'Proportions as two equal ratios, and their applications.', verified: '2026-11-21' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: 'Counting the rivet crates', topic: 'Place value', tier: 'Basic', sector: 'Supply Depot',
  brief: 'A delivery of rivets has landed in crates, boxes and bags, and the depot log needs one number for it.',
  lesson: 'Where a digit sits tells you whether it counts ones, tens, hundreds or thousands.',
  prompt: 'Depot tally of rivets: full crates of 1000, 3; boxes of 100, 5; bags of 10, 0; loose rivets, 7. Enter the total number of rivets (type it without commas). Then enter how many rivets the hundreds digit of your total stands for.',
  answer: [3507, 500], labels: ['total rivets', 'hundreds digit stands for'], tolerance: 0.01,
  hints: [
   'Write one digit for each place, thousands first, then hundreds, tens and ones. Write 0 for a place that has none.',
   'Find the hundreds digit, the second from the left. Each hundred is 100 rivets.'
  ],
  solution: '3 thousands, 5 hundreds, 0 tens and 7 ones are written 3507. The hundreds digit 5 stands for 5 hundreds, which is 500 rivets.',
  xp: 100, prereqs: [],
  artifact: { name: 'Depot tally board', description: 'The first count in the log, every digit in its place.' },
  sources: [source.s1_1],
  teaching: {
   intuition: 'We count in groups of ten. Ten loose ones make a ten, ten tens make a hundred, and ten hundreds make a thousand. A written number lists how many of each group there are, biggest group on the left, so the place where a digit sits tells you what it counts. In 2950 the 9 sits in the hundreds place, so it stands for 9 hundreds, which is 900.',
   steps: [
    'Count how many thousands, hundreds, tens and ones there are.',
    'Write those counts as digits from left to right: thousands, then hundreds, then tens, then ones.',
    'If a place has none, write 0 there, so every other digit stays in its own place.',
    'A digit stands for that many of its group: a hundreds digit of 4 means 4 hundreds, which is 400.'
   ],
   example: {
    prompt: 'A shelf holds 4 crates of 1000 washers, no boxes of 100, 6 bags of 10 and 1 loose washer. How many washers are there, and how many does the tens digit stand for?',
    steps: [
     'Thousands 4, hundreds 0, tens 6, ones 1. Written in that order the number is 4061.',
     'The tens digit is 6, so it stands for 6 tens, which is 60 washers.'
    ],
    answer: '4061 washers; the tens digit stands for 60.'
   },
   pitfalls: [
    'Leaving out the 0 for an empty place: 5 thousands, 2 hundreds, no tens and 4 ones is 5204, not 524.',
    'Confusing a digit with what it stands for: a 6 in the hundreds place stands for 600, not 6.',
    'Writing the places in the wrong order: the biggest group (thousands) goes on the left, the ones on the right.'
   ]
  },
  guidance: [
   { prompt: 'Write the digits in order: thousands, hundreds, tens, ones. What number do 3 thousands, 5 hundreds, 0 tens and 7 ones make?', answer: [3507], labels: ['total rivets'], explanation: 'The digits 3, 5, 0, 7 in that order make 3507. Each digit sits in the place it counts.' },
   { prompt: 'The hundreds digit is 5. How many rivets do 5 hundreds make?', answer: [500], labels: ['hundreds digit stands for'], explanation: 'Each hundred is one hundred rivets, so 5 hundreds are 500 rivets.' }
  ]
 },
 {
  id: 'q02', title: 'Shuttle day at the depot', topic: 'Adding and subtracting', tier: 'Basic', sector: 'Supply Depot',
  brief: 'A supply shuttle is landing and the survey team is leaving, and the ration count has to stay right through both.',
  lesson: 'Adding puts amounts together; subtracting takes an amount away. Work column by column from the ones.',
  prompt: 'Morning stock: 347 ration packs. A shuttle lands with 285 more. Then 198 packs are sent out to the survey team. Enter the number of packs after the shuttle lands, then the number left after the survey team\'s packs go out.',
  answer: [632, 434], labels: ['packs after shuttle', 'packs left'], tolerance: 0.01,
  hints: [
   'Line the numbers up so ones sit under ones and tens under tens. Work from the ones column to the left; carry a ten when a column adds up to 10 or more, and borrow a ten when a column is too small to subtract.',
   'First work out 347 + 285. Then take 198 away from that total.'
  ],
  solution: 'Adding: 347 + 285 = 632 packs after the shuttle. Subtracting: 632 − 198 = 434 packs left. Check: 434 + 198 = 632.',
  xp: 100, prereqs: ['q01'],
  sources: [source.s1_2, source.s1_3],
  teaching: {
   intuition: 'Adding means putting two piles together and counting the whole; we write it with the sign +, so 3 + 4 = 7 reads "three plus four equals seven". Subtracting means taking some away and counting what is left; we write it with −, read "minus". With big numbers you add or subtract one place at a time: ones with ones, tens with tens, hundreds with hundreds. Ten ones can always be swapped for one ten, and one ten for ten ones.',
   steps: [
    'Write the numbers one above the other so the ones line up, the tens line up and the hundreds line up.',
    'Adding: start with the ones column. If a column comes to 10 or more, write its ones digit and carry the 1 ten to the next column on the left.',
    'Subtracting: start with the ones column. If the top digit is smaller than the bottom one, borrow: take 1 from the next column on the left and add 10 to this column.',
    'Check a subtraction by adding the answer back to the amount taken away; you should get the number you started with.'
   ],
   example: {
    prompt: 'A shelf holds 256 cans and 178 more arrive. Then 159 are used. How many after the delivery, and how many are left?',
    steps: [
     '256 + 178: ones 6 + 8 = 14, write 4 and carry 1. Tens 5 + 7 + 1 = 13, write 3 and carry 1. Hundreds 2 + 1 + 1 = 4. Total 434.',
     '434 − 159: ones 4 is less than 9, so borrow: 14 − 9 = 5. Tens are now 2, less than 5, so borrow: 12 − 5 = 7. Hundreds are now 3, and 3 − 1 = 2. Left: 275.',
     'Check: 275 + 159 = 434.'
    ],
    answer: '434 cans after the delivery, 275 left.'
   },
   pitfalls: [
    'Forgetting to carry: 256 + 178 is not 324; the 14 in the ones column gives 1 ten to the tens column.',
    'Subtracting the smaller digit from the larger in every column: 434 − 159 is not 325. When the top digit is smaller, borrow a ten.',
    'Lining the numbers up on the left instead of on the right, so tens get added to hundreds.'
   ]
  },
  guidance: [
   { prompt: '347 packs and 285 more packs. What is 347 + 285?', answer: [632], labels: ['packs after shuttle'], explanation: 'Add column by column from the ones, carrying when a column reaches 10: 347 + 285 = 632.' },
   { prompt: 'There are 632 packs and 198 go out. What is 632 − 198?', answer: [434], labels: ['packs left'], explanation: 'Subtract column by column from the ones, borrowing when needed: 632 − 198 = 434. Adding back checks it: 434 + 198 = 632.' }
  ]
 },
 {
  id: 'q03', title: 'Racking the water jugs', topic: 'Multiplying', tier: 'Basic', sector: 'Supply Depot',
  brief: 'The water jugs are racked, and the depot needs the total without counting every jug.',
  lesson: 'Multiplying counts equal groups at once: rows times how many in each row.',
  prompt: 'The depot stacks water jugs on racks. One rack has 7 shelves with 18 jugs on each shelf. Enter the number of jugs on one rack, then the number of jugs on 4 identical racks.',
  answer: [126, 504], labels: ['jugs on one rack', 'jugs on all racks'], tolerance: 0.01,
  hints: [
   'Split 18 into 10 and 8. Work out 7 × 10 and 7 × 8, then add the two results.',
   'Then multiply the jugs on one rack by 4, the number of racks.'
  ],
  solution: 'One rack: 7 × 18. Split 18 into 10 and 8: 7 × 10 = 70 and 7 × 8 = 56, and 70 + 56 = 126 jugs. 4 racks: 126 × 4. Split 126 into 100, 20 and 6: 100 × 4 = 400, 20 × 4 = 80 and 6 × 4 = 24, and 400 + 80 + 24 = 504 jugs.',
  xp: 100, prereqs: ['q02'],
  sources: [source.s1_4],
  teaching: {
   intuition: 'Picture a shelf with 3 rows of 5 cans. You could add 5 + 5 + 5, but that is the same as asking: how many in 3 equal groups of 5? That is multiplying, written 3 × 5 and read "three times five"; it equals 15. A number with two digits can be split into its tens and its ones: 4 × 13 is 4 groups of 10 and 4 groups of 3, which is 40 and 12, so 52.',
   steps: [
    'Find the number of equal groups and the number in each group; their product (the result of multiplying) is the total.',
    'To multiply by a two-digit number, split it into tens and ones, multiply each part, then add the two results.',
    'A three-digit number splits the same way, into hundreds, tens and ones: multiply each part, then add the results.',
    'For groups of groups (racks of shelves of jugs), multiply one step at a time: first the jugs on one rack, then the racks.'
   ],
   example: {
    prompt: 'A rack has 5 shelves of 23 cans, and there are 3 such racks. How many cans on one rack, and on all three?',
    steps: [
     'One rack: 5 × 23. Split 23 into 20 and 3: 5 × 20 = 100 and 5 × 3 = 15, so 115 cans.',
     'Three racks: 115 × 3. Split 115 into 100, 10 and 5: 100 × 3 = 300, 10 × 3 = 30 and 5 × 3 = 15, so 300 + 30 + 15 = 345 cans.'
    ],
    answer: '115 cans on one rack, 345 on three.'
   },
   pitfalls: [
    'Multiplying only the tens: 6 × 14 is not 60; the 4 ones also have to be multiplied (6 × 4 = 24) and added on, giving 84.',
    'Adding instead of multiplying: 6 shelves of 14 jugs is 6 × 14 = 84, not 6 + 14 = 20.',
    'Stopping after one rack when the question asks about all of them.'
   ]
  },
  guidance: [
   { prompt: 'One rack is 7 shelves of 18 jugs. What is 7 × 18?', answer: [126], labels: ['jugs on one rack'], explanation: '7 groups of 10 make 70 and 7 groups of 8 make 56; together that is 126 jugs.' },
   { prompt: 'There are 4 racks of 126 jugs. What is 126 × 4?', answer: [504], labels: ['jugs on all racks'], explanation: 'Split 126 into 100, 20 and 6: 100 × 4 = 400, 20 × 4 = 80 and 6 × 4 = 24; together that is 504 jugs.' }
  ]
 },
 {
  id: 'q04', title: 'Boxing the loose rations', topic: 'Dividing with remainders', tier: 'Basic', sector: 'Supply Depot',
  brief: 'Loose ration packs have to go into boxes for the cold store, and the quartermaster wants to know what will not fit in a full box.',
  lesson: 'Dividing asks how many equal groups fit; what cannot make another full group is the remainder.',
  prompt: '137 ration packs arrive loose and are packed into boxes that hold 6 packs each. Enter how many boxes are completely full, then how many packs are left over.',
  answer: [22, 5], labels: ['full boxes', 'packs left over'], tolerance: 0.01,
  hints: [
   'Count how many groups of 6 fit into 137. 6 × 10 = 60 is a good first step.',
   'The packs left over are what remains after the full boxes; there must be fewer than 6 of them.'
  ],
  solution: '6 × 22 = 132, and 6 × 23 = 138 is more than 137. So 22 boxes are full, and 137 − 132 = 5 packs are left over: 137 ÷ 6 = 22 remainder 5.',
  xp: 100, prereqs: ['q03'],
  sources: [source.s1_5],
  teaching: {
   intuition: 'Dividing is multiplying run backwards. If 20 cans are packed 4 to a box, you ask: how many groups of 4 are in 20? Since 5 × 4 = 20, the answer is 5. We write this 20 ÷ 4 = 5, read "twenty divided by four". Often the groups do not come out even: 23 cans still fill 5 boxes of 4, and 3 cans are left over. Those 3 are the remainder, and a remainder is always smaller than the size of a group.',
   steps: [
    'Ask how many groups of the box size fit into the total. Try multiplying the box size by easy numbers such as 10 and 20 to get close.',
    'Find the largest number of boxes whose packs do not go over the total. That is how many boxes are full.',
    'Subtract the packs in the full boxes from the total. What is left is the remainder; it must be smaller than the box size.',
    'Check: full boxes times box size, then add the remainder, gives back the total.'
   ],
   example: {
    prompt: '59 bolts are bagged 8 to a bag. How many full bags, and how many bolts left over?',
    steps: [
     '8 × 7 = 56 and 8 × 8 = 64. 64 is more than 59, so 7 bags are full.',
     '59 − 56 = 3 bolts are left over. Check: 56 and 3 more make 59.'
    ],
    answer: '7 full bags, 3 bolts left over: 59 ÷ 8 = 7 remainder 3.'
   },
   pitfalls: [
    'A remainder as big as the box size: if 6 packs are left with boxes of 6, they fill one more box.',
    'Reporting the packs in the full boxes instead of the number of boxes: 59 bolts in bags of 8 fill 7 bags, not 56.',
    'Dividing the wrong way round: the total is divided by the box size, not the box size by the total.'
   ]
  },
  guidance: [
   { prompt: 'Each box takes 6 packs. 6 × 22 = 132 and 6 × 23 = 138. What is the largest number of boxes that 137 packs can fill?', answer: [22], labels: ['full boxes'], explanation: '132 is not more than 137 but 138 is, so 22 boxes can be filled.' },
   { prompt: '22 full boxes use 132 packs. How many of the 137 packs are left? Work out 137 − 132.', answer: [5], labels: ['packs left over'], explanation: '137 − 132 = 5, which is less than 6, so it cannot fill another box.' }
  ]
 },
 {
  id: 'q05', title: 'Reading Mira’s stock note', topic: 'Order of operations', tier: 'Basic', sector: 'Supply Depot',
  brief: 'Mira wrote two stock sums in the engineers’ shorthand, and the log needs their values.',
  lesson: 'Brackets first, then multiplying and dividing, then adding and subtracting, each from left to right.',
  prompt: 'Mira\'s stock note has two lines. Bottles line: 5 + 3 × (14 − 6). Litres line: 60 ÷ 5 − 2 × 3. Work each line out in the agreed order and enter the bottles line, then the litres line.',
  answer: [29, 6], labels: ['bottles', 'litres'], tolerance: 0.01,
  hints: [
   'Brackets first. Then every × and ÷, from left to right. Then every + and −, from left to right.',
   'In the bottles line, work out 14 − 6 first. In the litres line, do 60 ÷ 5 and 2 × 3 before you subtract.'
  ],
  solution: 'Bottles line: 5 + 3 × (14 − 6) = 5 + 3 × 8 = 5 + 24 = 29. Litres line: 60 ÷ 5 − 2 × 3 = 12 − 6 = 6.',
  xp: 100, prereqs: ['q04'],
  sources: [source.s2_1],
  teaching: {
   intuition: 'A line such as 2 + 3 × 4 could mean two different things: add first and get 5 × 4 = 20, or multiply first and get 2 + 12 = 14. So everyone agrees on one order. Work out anything inside brackets ( ) first. Then do every multiplying and dividing, from left to right. Then do every adding and subtracting, from left to right. So 2 + 3 × 4 = 14. Brackets are how a writer says "do this part first".',
   steps: [
    'Work out what is inside each bracket and replace the bracket by its value.',
    'Do every × and ÷, going from left to right.',
    'Do every + and −, going from left to right.',
    'Rewrite the line after each step, so you only ever do one small calculation at a time.'
   ],
   example: {
    prompt: 'Work out 2 + 4 × (9 − 3) and 36 ÷ 4 − 1 × 5.',
    steps: [
     '2 + 4 × (9 − 3): the bracket is 6, then 4 × 6 = 24, then 2 + 24 = 26.',
     '36 ÷ 4 − 1 × 5: 36 ÷ 4 = 9 and 1 × 5 = 5, then 9 − 5 = 4.'
    ],
    answer: '26 and 4.'
   },
   pitfalls: [
    'Working straight from left to right: 4 + 2 × 5 is not 6 × 5 = 30; the multiplying comes first, giving 4 + 10 = 14.',
    'Ignoring the bracket: in 2 × (10 − 4) the subtraction inside the bracket comes before the multiplying.',
    'Subtracting before dividing: in 20 ÷ 4 − 3 × 1 both the ÷ and the × are done before the −.'
   ]
  },
  guidance: [
   { prompt: 'In the bottles line the bracket comes first. What is 14 − 6?', answer: [8], labels: ['bracket'], explanation: '14 − 6 = 8, so the bottles line is 5 + 3 × 8.' },
   { prompt: 'Now the bottles line is 5 + 3 × 8. Multiply before you add. What is its value?', answer: [29], labels: ['bottles'], explanation: '3 × 8 = 24, then 5 + 24 = 29.' },
   { prompt: 'The litres line is 60 ÷ 5 − 2 × 3. Do the ÷ and the × first, then subtract. What is its value?', answer: [6], labels: ['litres'], explanation: '60 ÷ 5 = 12 and 2 × 3 = 6, so the litres line is 12 − 6 = 6.' }
  ]
 },
 {
  id: 'q06', title: 'Cold night on the ridge', topic: 'Negative numbers on the number line', tier: 'Basic', sector: 'Supply Depot',
  brief: 'The water lines freeze below 0 °C, so the depot logs the temperature at dawn, noon and night.',
  lesson: 'Numbers below zero sit to the left of 0 on the number line; adding moves right and subtracting moves left.',
  prompt: 'At dawn the thermometer outside the depot reads −7 °C. By noon it is 12 degrees warmer. By night it has fallen 15 degrees from the noon reading. Enter the noon reading, then the night reading, in °C.',
  answer: [5, -10], labels: ['noon reading (°C)', 'night reading (°C)'], tolerance: 0.01,
  hints: [
   'Picture the number line: warmer means moving right, colder means moving left. Count to 0 first, then past it.',
   'From −7 it takes 7 degrees to reach 0; the rest of the 12 degrees go past 0. At night, count down to 0 first, then below it.'
  ],
  solution: 'Noon: −7 + 12. Move 7 right to reach 0, then 5 more, so it reads 5 °C. Night: 5 − 15. Move 5 left to reach 0, then 10 more, so it reads −10 °C.',
  xp: 100, prereqs: ['q05'],
  sources: [source.s3_1],
  teaching: {
   intuition: 'Picture a long ruler with 0 in the middle: the number line. The counting numbers 1, 2, 3 go to the right of 0. To the left are numbers below zero, written with a minus sign: −1, −2, −3, read "minus one" or "negative one". A thermometer is a number line standing up: −5 °C is 5 degrees colder than 0. Getting warmer, or adding, moves you right; getting colder, or subtracting, moves you left, and you can go straight past 0.',
   steps: [
    'Mark the starting number on the number line.',
    'Adding moves right and subtracting moves left, by as many steps as the number says.',
    'When the move crosses 0, split it: count the steps to reach 0, then the steps still left after 0.',
    'An answer left of 0 is negative; write it with a minus sign.'
   ],
   example: {
    prompt: 'It is −3 °C at dawn, 8 degrees warmer by noon, and 11 degrees colder than noon by night. What are the noon and night readings?',
    steps: [
     'Noon: from −3, 3 steps right reach 0 and the other 5 steps go to 5. So −3 + 8 = 5 °C.',
     'Night: from 5, 5 steps left reach 0 and the other 6 go to −6. So 5 − 11 = −6 °C.'
    ],
    answer: 'Noon 5 °C, night −6 °C.'
   },
   pitfalls: [
    'Dropping the minus sign: 10 degrees below zero is −10, not 10.',
    'Moving the wrong way from a negative number: −6 + 10 is 4, not −16; adding always moves right.',
    'Stopping at 0: if the change is larger than the distance to 0, keep counting past it.'
   ]
  },
  guidance: [
   { prompt: 'The thermometer starts at −7. How many degrees warmer must it get to read 0?', answer: [7], labels: ['degrees to reach 0'], explanation: '−7 is 7 steps left of 0 on the number line, so 7 degrees warmer brings it to 0.' },
   { prompt: 'It gets 12 degrees warmer in all. What does it read at noon?', answer: [5], labels: ['noon reading (°C)'], explanation: '7 of the 12 degrees reach 0, and the other 5 go past it: −7 + 12 = 5.' },
   { prompt: 'From 5 it falls 15 degrees. What does it read at night?', answer: [-10], labels: ['night reading (°C)'], explanation: '5 degrees down reach 0, and the other 10 go below it: 5 − 15 = −10.' }
  ]
 },
 {
  id: 'q07', title: 'Splitting the ration bars', topic: 'What a fraction means', tier: 'Basic', sector: 'Ration Kitchen',
  brief: 'The kitchen logs how much of each ration bar is eaten, as a share of the bar and in grams.',
  lesson: 'A fraction names some of the equal parts of a whole: parts taken over equal parts in all.',
  prompt: 'A 40 g ration bar is scored into 8 equal pieces, and a recruit eats 3 pieces. Enter the fraction of the bar eaten, numerator then denominator, as the bar is scored (do not simplify). Then enter the grams eaten.',
  answer: [3, 8, 15], labels: ['numerator', 'denominator', 'grams eaten'], tolerance: 0.01,
  hints: [
   'The denominator counts the equal pieces in the whole bar. The numerator counts the pieces eaten.',
   'One piece weighs 40 ÷ 8 grams. Multiply that by the pieces eaten.'
  ],
  solution: 'The bar has 8 equal pieces and 3 were eaten, so 3/8 of the bar was eaten. One piece weighs 40 ÷ 8 = 5 g, so 3 pieces weigh 3 × 5 = 15 g.',
  xp: 100, prereqs: ['q06'],
  sources: [source.s4_1],
  teaching: {
   intuition: 'Cut a ration bar into equal pieces and take some of them. A fraction records this with two numbers, one over the other: the bottom number, the denominator, counts the equal pieces the whole is cut into; the top number, the numerator, counts the pieces taken. We write it with a slash, 2/5, read "two fifths": the bar is cut into 5 equal pieces and you have 2 of them. To find a fraction of an amount, divide the amount by the denominator to get one piece, then multiply by the numerator.',
   steps: [
    'Count the equal parts the whole is cut into. That is the denominator, the bottom number.',
    'Count the parts taken. That is the numerator, the top number.',
    'One part of an amount is the amount ÷ the denominator.',
    'The fraction of the amount is one part × the numerator.'
   ],
   example: {
    prompt: 'A 36 g loaf is cut into 4 equal slices and 3 slices are eaten. What fraction of the loaf is eaten, and how many grams?',
    steps: [
     '4 equal slices, 3 taken: the fraction is 3/4.',
     'One slice weighs 36 ÷ 4 = 9 g, so 3 slices weigh 3 × 9 = 27 g.'
    ],
    answer: '3/4 of the loaf, 27 g.'
   },
   pitfalls: [
    'Putting the pieces left on the bottom: with 2 of 6 pieces eaten the fraction is 2/6, not 2/4.',
    'Swapping top and bottom: the parts taken go on top, the parts in all go on the bottom.',
    'Multiplying the whole amount by the numerator without dividing by the denominator first.'
   ]
  },
  guidance: [
   { prompt: 'Into how many equal pieces is the bar scored?', answer: [8], labels: ['denominator'], explanation: 'The whole is cut into 8 equal pieces, so the denominator is 8.' },
   { prompt: 'How much does one piece weigh? Work out 40 ÷ 8.', answer: [5], labels: ['grams per piece'], explanation: '40 g shared into 8 equal pieces is 5 g each.' },
   { prompt: 'How many grams do 3 pieces of 5 g weigh?', answer: [15], labels: ['grams eaten'], explanation: '3 × 5 = 15 g, which is 3/8 of the bar.' }
  ]
 },
 {
  id: 'q08', title: 'Counting served trays', topic: 'Equivalent fractions and simplifying', tier: 'Basic', sector: 'Ration Kitchen',
  brief: 'The kitchen reports how much of the meal service is done, and Mira wants it in its simplest form.',
  lesson: 'Dividing the top and the bottom of a fraction by the same number gives an equal fraction with smaller numbers.',
  prompt: 'Of 24 meal trays, 18 have been served. Enter the fraction of the trays served in lowest terms: the numerator, then the denominator.',
  answer: [3, 4], labels: ['numerator', 'denominator'], tolerance: 0.01,
  hints: [
   'The fraction served is 18/24. Find a number that divides both 18 and 24 exactly, and divide the top and the bottom by it. Repeat until no number above 1 divides both.',
   'The largest number that divides both 18 and 24 is 6.'
  ],
  solution: '18 of 24 is the fraction 18/24. The largest number that divides both is 6: 18 ÷ 6 = 3 and 24 ÷ 6 = 4. So 18/24 = 3/4, and no number above 1 divides both 3 and 4.',
  xp: 100, prereqs: ['q07'],
  sources: [source.s4_1, source.s4_2],
  teaching: {
   intuition: 'Cut a bar in half and eat one half. Now picture the same bar cut into 4 equal pieces: one half is the same as 2 of the 4 pieces, and also 4 of 8 pieces. So 1/2, 2/4 and 4/8 are equal fractions: the same amount, cut finer. Multiplying or dividing the top and the bottom by the same number never changes the amount. A fraction is in lowest terms when no number bigger than 1 divides both its top and its bottom exactly.',
   steps: [
    'Find a number that divides both the numerator and the denominator exactly (with no remainder).',
    'Divide the top and the bottom by that number.',
    'Repeat until no number bigger than 1 divides both. Dividing by the largest such number does it in one step.'
   ],
   example: {
    prompt: 'Write 10/15 in lowest terms.',
    steps: [
     '5 divides both 10 and 15: 10 ÷ 5 = 2 and 15 ÷ 5 = 3.',
     'No number bigger than 1 divides both 2 and 3, so we are done.'
    ],
    answer: '10/15 = 2/3.'
   },
   pitfalls: [
    'Dividing only the top or only the bottom: that changes the amount.',
    'Subtracting the same number from the top and bottom: 20/30 is not 2/12; only multiplying or dividing keeps fractions equal.',
    'Stopping too early: 24/36 divided by 2 is 12/18, but 6 still divides both.'
   ]
  },
  guidance: [
   { prompt: 'What is the largest number that divides both 18 and 24 exactly?', answer: [6], labels: ['largest number dividing both'], explanation: '18 = 3 × 6 and 24 = 4 × 6, and no number above 1 divides both 3 and 4, so 6 is the largest.' },
   { prompt: 'Divide the top by 6. What is 18 ÷ 6?', answer: [3], labels: ['numerator'], explanation: '18 ÷ 6 = 3.' },
   { prompt: 'Divide the bottom by the same number. What is 24 ÷ 6?', answer: [4], labels: ['denominator'], explanation: '24 ÷ 6 = 4. Dividing the top and the bottom by the same number keeps the amount the same.' }
  ]
 },
 {
  id: 'q09', title: 'Mixing broth and oil', topic: 'Adding and multiplying fractions', tier: 'Basic', sector: 'Ration Kitchen',
  brief: 'A new recipe measures broth, water and oil in parts of a litre, and the cook needs the amounts written down.',
  lesson: 'Add fractions by first cutting them into same-size pieces; multiply fractions top by top and bottom by bottom.',
  prompt: 'A pot gets 1/2 litre of broth and 1/3 litre of water. Enter the litres in the pot as a fraction in lowest terms, numerator then denominator. Then the cook uses 3/4 of a jug that holds 2/3 litre of oil, that is 3/4 × 2/3 litre. Enter that amount in lowest terms, numerator then denominator.',
  answer: [5, 6, 1, 2], labels: ['sum numerator', 'sum denominator', 'oil numerator', 'oil denominator'], tolerance: 0.01,
  hints: [
   'To add, the pieces must be the same size: write both fractions with the denominator 6, then add the numerators.',
   'To multiply, multiply the tops (3 × 2) and the bottoms (4 × 3), then simplify.'
  ],
  solution: 'Adding: 1/2 = 3/6 and 1/3 = 2/6, so the sum is 5/6, which is already in lowest terms. Multiplying: 3/4 × 2/3 = 6/12; dividing the top and the bottom by 6 gives 1/2.',
  xp: 100, prereqs: ['q08'],
  sources: [source.s4_5, source.s4_2],
  teaching: {
   intuition: 'You can only add pieces of the same size: a third and a quarter are different sizes, so first cut both into twelfths. One third is 4 twelfths and one quarter is 3 twelfths, so together they make 7 twelfths, 7/12. The common bottom number is called a common denominator; a number that both denominators divide into works. Multiplying is simpler: half of a third, written 1/2 × 1/3, is the third cut in two, which is 1/6. To multiply fractions, multiply the tops together and the bottoms together. The word "of" between fractions means multiply.',
   steps: [
    'To add: find a common denominator, a number both denominators divide into exactly (the smallest such number keeps things small).',
    'Rewrite each fraction with that denominator by multiplying its top and bottom by the same number, then add the numerators and keep the denominator.',
    'To multiply: multiply the numerators to get the new numerator, and the denominators to get the new denominator.',
    'Simplify the result to lowest terms.'
   ],
   example: {
    prompt: 'Work out 1/4 + 2/3, and 2/5 × 3/4, each in lowest terms.',
    steps: [
     'Both 4 and 3 divide 12: 1/4 = 3/12 and 2/3 = 8/12, so the sum is 11/12, already in lowest terms.',
     '2 × 3 = 6 and 5 × 4 = 20, so the product is 6/20; dividing top and bottom by 2 gives 3/10.'
    ],
    answer: '11/12 and 3/10.'
   },
   pitfalls: [
    'Adding tops and bottoms: 1/3 + 1/5 is not 2/8; the pieces must be made the same size first.',
    'Changing only the denominator: to turn 1/4 into twelfths the top must be multiplied by 3 as well, giving 3/12.',
    'Forgetting to simplify the product: 4/8 should be written 1/2.'
   ]
  },
  guidance: [
   { prompt: 'Write 1/2 and 1/3 with the denominator 6. What do the two numerators add up to?', answer: [5], labels: ['numerator over common denominator'], explanation: '1/2 = 3/6 and 1/3 = 2/6. 3 + 2 = 5, so the sum is 5/6.' },
   { prompt: 'Write 5/6 in lowest terms. Enter the numerator, then the denominator.', answer: [5, 6], labels: ['numerator', 'denominator'], explanation: 'No number above 1 divides both 5 and 6, so it stays 5/6 litre.' },
   { prompt: 'Multiply: 3 × 2 over 4 × 3. Enter the result in lowest terms, numerator then denominator.', answer: [1, 2], labels: ['numerator', 'denominator'], explanation: '6/12; divide the top and the bottom by 6 to get 1/2 litre.' }
  ]
 },
 {
  id: 'q10', title: 'Pouring the fuel cans', topic: 'Decimals', tier: 'Basic', sector: 'Ration Kitchen',
  brief: 'The cooking stoves run on fuel from part-empty canisters, and the kitchen is combining them into one jerrycan.',
  lesson: 'Digits after the decimal point count tenths and hundredths; line up the points before adding or subtracting.',
  prompt: 'Three fuel canisters hold 2.75 L, 1.6 L and 0.85 L. They are emptied into one jerrycan that holds 8 L. Enter the total litres poured in, then how many more litres would fit in the jerrycan.',
  answer: [5.2, 2.8], labels: ['litres poured', 'litres more that fit'], tolerance: 0.004, /* answers are exact hundredths: 0.01 would accept a neighbouring hundredth */
  hints: [
   'Give every amount two digits after the point (1.6 is 1.60), line up the points, and add as with whole numbers.',
   'Then subtract the total from 8, which is 8.00.'
  ],
  solution: '2.75 + 1.60 + 0.85 = 5.20, so 5.2 L were poured in. 8.00 − 5.20 = 2.80, so 2.8 L more would fit.',
  xp: 100, prereqs: ['q09'],
  sources: [source.s5_1],
  teaching: {
   intuition: 'Place value carries on to the right of the ones. A dot, the decimal point, marks where the whole numbers end. The first digit after it counts tenths (a litre cut into 10 equal parts), the next counts hundredths (a litre cut into 100). So 3.45 L is 3 whole litres, 4 tenths and 5 hundredths, which is 3 and 45/100 litres. Adding a 0 at the end after the point changes nothing: 1.2 and 1.20 are the same amount.',
   steps: [
    'Give every number the same count of digits after the point by adding zeros at the end (1.2 becomes 1.20; 4 becomes 4.00).',
    'Write the numbers one above the other with the decimal points lined up.',
    'Add or subtract column by column from the right, carrying and borrowing exactly as with whole numbers.',
    'Put the decimal point in the answer straight below the other points.'
   ],
   example: {
    prompt: 'Cans of 1.45 L, 3.2 L and 0.6 L are poured into a 7 L can. How much is poured in, and how much more fits?',
    steps: [
     '1.45 + 3.20 + 0.60 = 5.25 L.',
     '7.00 − 5.25 = 1.75 L more fits.'
    ],
    answer: '5.25 L poured in, 1.75 L more fits.'
   },
   pitfalls: [
    'Lining up the last digits instead of the points: 3.45 + 2.3 is not 3.68, because the 3 in 2.3 is tenths, not hundredths; the sum is 5.75.',
    'Losing the decimal point: 1.25 + 2.50 is 3.75, not 375.',
    'Subtracting from a whole number without writing its zeros: 9 − 4.3 is 9.0 − 4.3 = 4.7.'
   ]
  },
  guidance: [
   { prompt: 'Line up the points. What is 2.75 + 1.60?', answer: [4.35], labels: ['litres in first two'], explanation: 'Hundredths, tenths, then ones, carrying as with whole numbers: 2.75 + 1.60 = 4.35.' },
   { prompt: 'Add the third canister. What is 4.35 + 0.85?', answer: [5.2], labels: ['litres poured'], explanation: '4.35 + 0.85 = 5.20 litres in all.' },
   { prompt: 'How many more litres fit in the 8 L jerrycan? Work out 8.00 − 5.20.', answer: [2.8], labels: ['litres more that fit'], explanation: '8.00 − 5.20 = 2.80 litres.' }
  ]
 },
 {
  id: 'q11', title: 'Reading the tank gauge', topic: 'Percent', tier: 'Basic', sector: 'Ration Kitchen',
  brief: 'The kitchen’s water tank gauge shows a percent, and the cooks need litres.',
  lesson: 'Percent means out of every hundred: find 1% by dividing by 100, then multiply.',
  prompt: 'The kitchen\'s water tank holds 400 L when full, and the gauge reads 35% full. Enter the litres of water in the tank, then how many more litres would fill it.',
  answer: [140, 260], labels: ['litres in tank', 'litres to fill'], tolerance: 0.01,
  hints: [
   'Find 1% first: 400 ÷ 100 = 4 litres.',
   '35% is 35 times 1%. The empty part is the rest of the 400 L.'
  ],
  solution: '1% of 400 L is 400 ÷ 100 = 4 L, so 35% is 35 × 4 = 140 L. To fill the tank: 400 − 140 = 260 L, which is the other 65%.',
  xp: 100, prereqs: ['q10'],
  sources: [source.s6_1],
  teaching: {
   intuition: 'Percent means "out of every hundred" and is written with the sign %. Imagine a full tank split into 100 equal slices: 1% is one slice, 25% is 25 slices, and 100% is the whole tank. So 25% is the fraction 25/100, the decimal 0.25, a quarter. To find a percent of an amount, first find one slice, 1%, by dividing the amount by 100, then multiply by the percent.',
   steps: [
    'Find 1% of the amount: divide it by 100.',
    'Multiply 1% by the percent you want.',
    'The rest of the whole is 100% minus that percent; check that the two parts add up to the whole amount.'
   ],
   example: {
    prompt: 'A 600 L tank is 15% full. How many litres are in it, and how many more would fill it?',
    steps: [
     '1% of 600 L is 600 ÷ 100 = 6 L.',
     '15% is 15 × 6 = 90 L. To fill it: 600 − 90 = 510 L, which is the other 85%.'
    ],
    answer: '90 L in the tank, 510 L to fill it.'
   },
   pitfalls: [
    'Forgetting to divide by 100: 20% of 300 is 60, not 20 × 300 = 6000.',
    'Answering the empty part when the full part is asked, or the other way round.',
    'Reading 40% as 40 litres: a percent is a share of the whole, not an amount.'
   ]
  },
  guidance: [
   { prompt: 'What is 1% of 400 L? Work out 400 ÷ 100.', answer: [4], labels: ['litres in 1%'], explanation: 'Percent means out of every hundred: 400 litres split into 100 equal parts gives 4 L per part.' },
   { prompt: '35% is 35 of those parts. How many litres are in the tank?', answer: [140], labels: ['litres in tank'], explanation: '35 × 4 = 140 L.' },
   { prompt: 'How many more litres would fill the 400 L tank?', answer: [260], labels: ['litres to fill'], explanation: '400 − 140 = 260 L. Check: 65 × 4 = 260 too.' }
  ]
 },
 {
  id: 'q12', title: 'Timing the water pump', topic: 'Ratio, rate and proportion', tier: 'Basic', sector: 'Ration Kitchen',
  brief: 'The kitchen must plan how long the water pump runs for each meal, from one timed test.',
  lesson: 'A rate compares two different quantities; find the amount for one unit, then scale it.',
  prompt: 'The water pump delivered 84 litres in 6 minutes, at a steady rate. Enter its rate in litres per minute, then how many litres it delivers in 15 minutes at the same rate.',
  answer: [14, 210], labels: ['litres per minute', 'litres delivered'], tolerance: 0.01,
  hints: [
   'A rate per minute is litres divided by minutes: 84 ÷ 6.',
   'At the same rate, 15 minutes deliver 15 times the litres of one minute.'
  ],
  solution: 'Rate: 84 L ÷ 6 min = 14 L per minute. The ratio of litres to minutes stays the same, so 15 minutes deliver 14 × 15 = 210 L. Check: 210/15 and 84/6 both simplify to 14/1.',
  xp: 100, prereqs: ['q11'],
  sources: [source.s5_6, source.s6_5],
  teaching: {
   intuition: 'A ratio compares two amounts: a soup with 3 cups of lentils for every 5 cups of water has lentils to water in the ratio 3 to 5, which can be written as the fraction 3/5. When the two amounts have different units, such as litres and minutes, the ratio is called a rate. The handiest rate is a unit rate, the amount for just one unit: 45 litres in 5 minutes is 45 ÷ 5 = 9 litres per minute. A proportion says two ratios are equal, so at a steady rate twice the time gives twice the litres.',
   steps: [
    'Write the ratio of the two quantities, for example litres to minutes.',
    'Find the unit rate: divide to get the amount for one unit (litres in one minute).',
    'Scale up: multiply the unit rate by the number of units you need.',
    'Check the proportion: the new litres over the new minutes should simplify to the same unit rate.'
   ],
   example: {
    prompt: 'A pump fills 45 L in 5 minutes. What is its rate, and how much does it deliver in 8 minutes?',
    steps: [
     'Unit rate: 45 ÷ 5 = 9 L per minute.',
     '8 minutes: 9 × 8 = 72 L. Check: 72/8 = 9/1, the same rate.'
    ],
    answer: '9 L per minute, 72 L in 8 minutes.'
   },
   pitfalls: [
    'Dividing the wrong way round: minutes ÷ litres gives minutes per litre, not litres per minute.',
    'Adding the extra time to the litres: if 2 minutes give 10 L, 6 minutes give 3 × 10 = 30 L, not 10 + 4 = 14 L (the 4 extra minutes are not 4 litres).',
    'Forgetting the rate must be steady; a proportion only works when the ratio stays the same.'
   ]
  },
  guidance: [
   { prompt: 'How many litres does the pump deliver in one minute? Work out 84 ÷ 6.', answer: [14], labels: ['litres per minute'], explanation: '84 litres shared equally over 6 minutes is 14 litres each minute.' },
   { prompt: 'At 14 litres per minute, how many litres in 15 minutes?', answer: [210], labels: ['litres delivered'], explanation: '14 × 15 = 210 litres.' }
  ]
 }
);
})();
