/* Tap-to-define words. Two parts:
   1. window.VG_GLOSSARY = { <pack id>: { <term>: { term, means, example, taught, also, avoid } } }
        term     the word as it is shown at the top of the definition
        means    one plain sentence
        example  one tiny example
        taught   the id of the learn mission that teaches the word
        also     other spellings that are the same word (plurals are added automatically)
        avoid    optional: a pattern; where the text around a match fits it, the word has another sense there and is left alone
   2. window.VGGlossary: wrap(root, packId) turns the first use of each term in each block of lesson, prompt, hint and
      solution text into a button; pressing it opens a small definition, which is also read out by a screen reader
      (a polite live region, see announce()). The wrapping is done on the page's text nodes
      after the text is drawn, never inside inputs, code, pictures, buttons, links or headings. Mission text itself is
      never changed, so the generators and the tests see the same text as before (qa/glossary.test.js).
   Loaded as a classic script; it touches the page only when wrap() is called. */
(() => {
  'use strict';
  /* [term, taught, means, example, also?, avoid?] */
  const FOUND = [
    ['digit', 'q01', 'One of the ten symbols 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9 that numbers are written with.', 'The number 2950 has four digits: 2, 9, 5 and 0.'],
    ['place value', 'q01', 'What a digit is worth because of where it sits in a number.', 'In 2950 the 9 sits in the hundreds place, so it is worth 900.'],
    ['sum', 'q02', 'The result of adding numbers together.', 'The sum of 3 and 4 is 7.', [], 'two sums from'],
    ['product', 'q03', 'The result of multiplying numbers together.', 'The product of 3 and 5 is 15.'],
    ['remainder', 'q04', 'What is left over when a number does not split into equal groups exactly.', '23 ÷ 4 is 5 with remainder 3, because 5 × 4 = 20 and 3 are left.'],
    ['order of operations', 'q05', 'The agreed order for a calculation: brackets first, then multiplying and dividing, then adding and subtracting.', '2 + 3 × 4 = 2 + 12 = 14, not 20.'],
    ['brackets', 'q05', 'The signs ( ) that group things together; in a calculation, the part inside them is worked out first.', '(2 + 3) × 4 = 5 × 4 = 20.', ['bracket']],
    ['number line', 'q06', 'A line with a number at every point: 0 in the middle, bigger numbers to the right and numbers below zero to the left.', 'On the number line, −2 is two steps to the left of 0.'],
    ['negative number', 'q06', 'A number below zero, written with a minus sign in front.', '−5 °C is 5 degrees colder than 0 °C.', ['negative']],
    ['fraction', 'q07', 'A number that names equal parts of a whole, written as one number over another.', '2/5 means the whole is cut into 5 equal pieces and you have 2 of them.'],
    ['numerator', 'q07', 'The top number of a fraction; it counts the pieces taken.', 'In 2/5 the numerator is 2.'],
    ['denominator', 'q07', 'The bottom number of a fraction; it counts the equal pieces the whole is cut into.', 'In 2/5 the denominator is 5.'],
    ['lowest terms', 'q08', 'A fraction is in lowest terms when no number bigger than 1 divides both its top and its bottom exactly.', '6/8 in lowest terms is 3/4.'],
    ['common denominator', 'q09', 'A bottom number that two fractions can share, so that their pieces are the same size and can be added.', 'For 1/3 and 1/4 a common denominator is 12: 4/12 + 3/12 = 7/12.'],
    ['decimal point', 'q10', 'The dot in a number that marks where the whole numbers end.', 'In 3.45 the 3 counts whole litres and the 45 counts parts of a litre.'],
    ['decimal', 'q10', 'A number written with a decimal point; the digits after the point count tenths, then hundredths, and so on.', '0.25 is 2 tenths and 5 hundredths.'],
    ['tenths', 'q10', 'Pieces you get when a whole is cut into 10 equal parts.', '0.4 is 4 tenths.', ['tenth']],
    ['hundredths', 'q10', 'Pieces you get when a whole is cut into 100 equal parts.', '0.07 is 7 hundredths.', ['hundredth']],
    ['percent', 'q11', 'Out of every hundred; it is written with the sign %.', '25% is 25 out of 100, which is a quarter.'],
    ['ratio', 'q12', 'A comparison of two amounts that says how much of one there is for a given amount of the other.', '3 cups of lentils for every 5 cups of water is the ratio 3 to 5.'],
    ['rate', 'q12', 'A ratio of two amounts that have different units.', '45 litres in 5 minutes is a rate.'],
    ['unit rate', 'q12', 'The amount for just one unit.', '45 litres in 5 minutes is 45 ÷ 5 = 9 litres per minute.'],
    ['proportion', 'q12', 'A statement that two ratios are equal.', '3/5 = 6/10 is a proportion.'],
    ['expression', 'q13', 'A calculation written with numbers and letters.', '5c + 3 means 5 × c, plus 3.'],
    ['unknown', 'q13', 'An amount we do not know yet, usually given a letter such as x.', 'In 3y = 24 the unknown is y.'],
    ['substituting', 'q14', 'Replacing a letter with the number, or the expression, that it is equal to.', 'If h is 3, then 50 − 4h becomes 50 − 4 × 3 = 38.', ['substitution', 'substitute']],
    ['distributing', 'q15', 'Multiplying every part inside a pair of brackets by the number in front of them.', '3(c + 2) = 3c + 6.', ['distribute']],
    ['like terms', 'q15', 'Parts of an expression that count the same kind of thing, so they can be added together.', '4c + 2c = 6c, but 6c + 5 stays as it is.', ['like term']],
    ['equation', 'q16', 'A statement that two amounts are equal, written with the sign =.', '3y = 24 is an equation; it is true when y is 8.'],
    ['inequality', 'q18', 'A statement that one amount is less than, or greater than, another, written with <, >, ≤ or ≥.', 'load ≤ 200 means the load can be 200 or anything under it.', ['inequalities']],
    ['coordinates', 'q19', 'The signed numbers that say where a point is: how far across first, then how far up.', '(6, −1) is 6 east and 1 south of the starting point.', ['coordinate']],
    ['right angle', 'q20', 'A square corner, like the corner of a sheet of paper.', 'A wall meets a flat floor at a right angle.'],
    ['Pythagoras’ rule', 'q20', 'In a triangle with a right angle, the two short sides each multiplied by itself add up to the long side multiplied by itself.', 'Short sides 3 and 4 give 9 + 16 = 25, so the long side is 5.'],
    ['rate of change', 'q21', 'How much one thing changes for each single step of another.', 'A tank that gains 3 litres every hour has a rate of change of 3 litres per hour.'],
    ['slope', 'q21', 'How steep a line is: the rise divided by the run, which is the change up for each one step across.', 'A line that goes up 6 while it moves 2 across has slope 6 ÷ 2 = 3.'],
    ['displacement', 'q24', 'A move, written as a signed change in each direction.', '(2, −3, 1) means 2 east, 3 south and 1 up.'],
    ['system of equations', 'q25', 'Two or more equations that must all be true at the same time.', 'y = 2x and y = x + 3 together are a system; x = 3 and y = 6 fit both.', ['systems of equations']],
    ['elimination', 'q27', 'Removing an unknown by taking one equation away from another, so that the unknown cancels.', 'x + y = 7 take away x − y = 1 leaves 2y = 6.'],
    ['matrix', 'q29', 'A grid of numbers arranged in rows and columns.', 'In a matrix a, a(2, 3) is the number in row 2, column 3.', ['matrices']],
    ['row', 'q29', 'A line of things going across.', 'In the grid with rows 1 2 3 and 4 5 6, row 2 is 4 5 6.'],
    ['column', 'q29', 'A line of things going down.', 'In the grid with rows 1 2 3 and 4 5 6, column 1 is 1 and 4.'],
    ['Σ', 'q29', 'The Greek capital letter sigma; in maths it means “add up”.', 'Σ a(2, j) for j = 1 to 3 means a(2, 1) + a(2, 2) + a(2, 3).', ['sigma']],
    ['exponent', 'q30', 'The small raised number that counts how many times the base is multiplied together.', 'In 2⁵ the exponent is 5: 2 × 2 × 2 × 2 × 2 = 32.'],
    ['power', 'q30', 'A number multiplied by itself a counted number of times.', '2 to the power 5 is 2 × 2 × 2 × 2 × 2 = 32.', [], 'power cell'],
    ['square root', 'q31', 'The number that, multiplied by itself, gives the number you started with; it is written with the sign √.', '√9 = 3, because 3 × 3 = 9.'],
    ['radical', 'q31', 'A root written with the sign √.', '√2 is a radical.'],
    ['perfect square', 'q31', 'A whole number multiplied by itself.', '1, 4, 9, 16 and 25 are perfect squares.'],
    ['polynomial', 'q32', 'A sum of terms such as 3x², 2x and 5, where x stands for a number.', 'x² + 6x + 8 is a polynomial with three terms.'],
    ['coefficient', 'q32', 'The number in front of a term.', 'In 3x² the coefficient is 3.'],
    ['factoring', 'q33', 'Writing a polynomial as brackets multiplied together; it is multiplying run backwards.', 'x² + 6x + 8 = (x + 2)(x + 4).'],
    ['factor', 'q33', 'A number or a bracket that is multiplied by others to make a product.', '2 and 3 are factors of 6, and (x + 2) is a factor of x² + 6x + 8.'],
    ['quadratic', 'q34', 'A rule whose highest power of x is x².', 'y = x² − 4x + 3 is a quadratic.'],
    ['parabola', 'q34', 'The U-shaped curve that is the graph of a quadratic.', 'The graph of y = x² is a parabola with its lowest point at (0, 0).'],
    ['vertex', 'q34', 'The lowest point of a parabola that opens upward, or the highest point of one that opens downward.', 'y = x² − 4x + 3 has its vertex at (2, −1).'],
    ['rational expression', 'q35', 'A fraction whose top and bottom are polynomials.', '(x² + 7x + 12) ÷ (x + 3) is a rational expression; it simplifies to x + 4 when x is not −3.'],
    ['function', 'q36', 'A rule that takes one number in and gives exactly one number back.', 'If L(x) = 2x + 1, then L(4) = 9.'],
    ['domain', 'q36', 'All the inputs a function is allowed to take.', 'A cable can be reeled out for 0 to 10 minutes, so the domain is 0 to 10.'],
    ['inverse function', 'q38', 'The function that undoes another one: it carries each output back to the input that made it.', 'If P(x) = 2x + 3, then P⁻¹(x) = (x − 3) ÷ 2.', ['inverse']],
    ['exponential growth', 'q39', 'Growth by multiplying by the same number at every step.', 'Doubling gives 1, 2, 4, 8, 16.'],
    ['logarithm', 'q39', 'The exponent that a base needs to make a given number.', 'log₂ 16 = 4, because 2⁴ = 16.'],
    ['right triangle', 'q40', 'A triangle with one right angle.', 'A mast, flat ground and a cable from the mast top to the ground make a right triangle.']
  ];
  const LA = [
    ['vector', 'q01', 'An ordered list of numbers, one signed amount along each axis.', '(3, −1, 2) means +3 along x, −1 along y and +2 along z.'],
    ['component', 'q01', 'One of the numbers in a vector: its amount along one axis.', 'The y component of (3, −1, 2) is −1.', [], 'connected|principal|component-nullity|as a component|for the components'],
    ['norm', 'q02', 'The length of a vector: the square root of the sum of its squared components.', 'The norm of (3, 4) is √(9 + 16) = 5.'],
    ['magnitude', 'q02', 'The size of a quantity; for a vector it is its length, also called its norm.', 'The magnitude of (3, 4) is 5.'],
    ['unit vector', 'q02', 'A vector of length one.', '(3, 4) divided by its length 5 is the unit vector (0.6, 0.8).'],
    ['dot product', 'q03', 'The sum of the products of the matching components of two vectors; it measures how much they point along one another.', '(1, 2) · (3, 4) = 1 × 3 + 2 × 4 = 11.'],
    ['cross product', 'q04', 'For two vectors in three dimensions, the vector perpendicular to both whose length is the area of the parallelogram they span.', '(1, 0, 0) × (0, 1, 0) = (0, 0, 1).'],
    ['perpendicular', 'q03', 'At a right angle; two vectors are perpendicular exactly when their dot product is zero.', '(1, 2) · (2, −1) = 2 − 2 = 0, so they are perpendicular.'],
    ['orthogonal', 'q18', 'Another word for perpendicular: two vectors are orthogonal when their dot product is zero.', '(1, 0) and (0, 1) are orthogonal.'],
    ['matrix', 'q06', 'A rectangular table of numbers; each row is a recipe that turns the input values into one output.', 'A 2×3 matrix takes three values in and gives two values out.', ['matrices']],
    ['origin', 'q07', 'The point where every coordinate is zero.', 'In the plane the origin is (0, 0).'],
    ['rotation', 'q07', 'A transformation that turns every point around the origin and keeps every length the same.', 'A counterclockwise turn of 90° sends (1, 0) to (0, 1).'],
    ['matrix product', 'q08', 'The single matrix that does the work of two matrices one after the other; AB means first B, then A.', '[1 2; 0 1][3; 4] = [1 × 3 + 2 × 4; 4] = [11; 4].', ['matrix multiplication']],
    ['determinant', 'q09', 'A number worked out from a square matrix that says how it scales area or volume, with a sign for orientation; zero means space is flattened.', 'det [a b; c d] = ad − bc, so det [2 1; 1 3] = 6 − 1 = 5.'],
    ['inverse', 'q10', 'The matrix that undoes a square matrix: A⁻¹A = I.', 'The inverse of [2 0; 0 4] is [0.5 0; 0 0.25].', [], 'inverse (cosine|sine|tangent|varianc|iteration|power)|(left|right) inverse'],
    ['identity matrix', 'q10', 'The square matrix with ones on the diagonal and zeros everywhere else; multiplying by it changes nothing.', 'The 2×2 identity matrix is [1 0; 0 1].'],
    ['linear system', 'q11', 'Several linear equations that must all hold at once.', '2x + y = 5 and x − y = 1 together; the solution is x = 2, y = 1.'],
    ['elimination', 'q11', 'Adding a multiple of one equation to another so that a variable disappears, without changing the solution.', 'Adding x − y = 1 to 2x + y = 5 gives 3x = 6.'],
    ['transpose', 'q43', 'The matrix you get by exchanging rows and columns.', 'The transpose of [1 2 3; 4 5 6] is [1 4; 2 5; 3 6].', ['transposition', 'transposing']],
    ['upper triangular', 'q12', 'Having only zeros below the diagonal.', '[2 1; 0 3] is upper triangular.'],
    ['back-substitution', 'q12', 'Solving a triangular system from the last equation upward, putting each value found into the equation above.', 'From 3y = 6 get y = 2, then 2x + y = 4 gives x = 1.', ['back substitution']],
    ['rank', 'q13', 'The number of independent rows of a matrix, which always equals the number of independent columns.', '[1 2; 2 4] has rank 1, because the second row is twice the first.'],
    ['nullity', 'q13', 'The number of independent input directions that a matrix sends to zero; rank plus nullity equals the number of columns.', '[1 2; 2 4] has 2 columns and rank 1, so its nullity is 1.'],
    ['nullspace', 'q14', 'All the vectors x that a matrix A sends to zero: Ax = 0.', 'The nullspace of [1 2; 2 4] is every multiple of (2, −1).', ['null space']],
    ['basis', 'q15', 'A set of independent vectors whose combinations give every vector of the space, each in exactly one way.', '(1, 0) and (0, 1) are the standard basis of the plane.', ['bases']],
    ['subspace', 'q16', 'A set of vectors that contains the zero vector and stays closed when its vectors are added or scaled.', 'A plane through the origin is a subspace of three-dimensional space.'],
    ['linear map', 'q17', 'A rule T on vectors that respects addition and scaling: T(u + v) = T(u) + T(v) and T(cv) = cT(v).', 'T(x, y) = (2x, x + y) is a linear map.', ['linear transformation']],
    ['projection', 'q18', 'The closest point to a vector on a line or subspace.', 'The projection of (3, 4) onto the x axis is (3, 0).'],
    ['residual', 'q18', 'What is left over: a measured value minus the fitted or projected one.', '(3, 4) minus its projection (3, 0) leaves the residual (0, 4).'],
    ['orthonormal', 'q19', 'Mutually perpendicular, and each of length one.', '(0.6, 0.8) and (−0.8, 0.6) are orthonormal.'],
    ['Gram–Schmidt', 'q19', 'A procedure that turns independent vectors into orthonormal ones with the same span, by subtracting projections and then scaling to length one.', 'From (1, 0) and (1, 1) it gives (1, 0) and (0, 1).', ['Gram-Schmidt']],
    ['span', 'q51', 'All the linear combinations of a set of vectors.', 'The span of (1, 0) and (0, 1) is the whole plane.'],
    ['linear combination', 'q51', 'A sum of vectors, each multiplied by a number.', '2(1, 0) − 3(0, 1) = (2, −3).'],
    ['least squares', 'q20', 'Choosing the unknowns that make the sum of the squared residuals as small as possible.', 'For the readings 2, 4 and 6 the least-squares constant is their mean, 4.', ['least-squares']],
    ['normal equations', 'q21', 'The equations AᵀAx = Aᵀb, whose solution is the least-squares fit.', 'Fitting one constant c to the readings 2, 4 and 6 gives 3c = 12, so c = 4.'],
    ['QR factorization', 'q22', 'Writing a matrix as A = QR, with orthonormal columns in Q and an upper triangular R.', '[3; 4] = [0.6; 0.8][5].', ['QR']],
    ['eigenvalue', 'q23', 'A number λ with Av = λv for some nonzero vector v: the factor by which the matrix scales that direction.', '[2 0; 0 3] has eigenvalues 2 and 3.'],
    ['eigenvector', 'q24', 'A nonzero vector that a matrix only scales: Av = λv.', 'For [2 0; 0 3], (1, 0) is an eigenvector with eigenvalue 2.'],
    ['quadratic form', 'q31', 'The single number xᵀKx made from a vector x and a square matrix K.', 'With K = [2 0; 0 3] and x = (1, 1), xᵀKx = 2 + 3 = 5.'],
    ['row reduction', 'q44', 'Replacing equations with equivalent ones, row by row, until each variable has its own pivot.', 'Subtracting 2 × row 1 from row 2 turns [1 1 | 3; 2 3 | 8] into [1 1 | 3; 0 1 | 2].'],
    ['pivot', 'q44', 'The first nonzero entry of a row in elimination; it is used to clear the other entries in its column.', 'In [2 1; 0 3] the pivots are 2 and 3.', ['pivoting']],
    ['homogeneous coordinates', 'q48', 'Coordinates with an extra 1 added at the end, so that a shift becomes a matrix product.', 'The point (x, y) becomes (x, y, 1).'],
    ['translation', 'q48', 'A shift that moves every point by the same vector.', 'Translating by (2, 1) sends (0, 0) to (2, 1) and (1, 1) to (3, 2).'],
    ['free variable', 'q52', 'A variable with no pivot in its column; it can take any value.', 'In x + 2y = 3 alone, y is free and x = 3 − 2y.'],
    ['column space', 'q52', 'All the vectors Ax that a matrix A can produce: the span of its columns.', 'The column space of [1 2; 2 4] is every multiple of (1, 2).'],
    ['left inverse', 'q53', 'A matrix L with LA = I.', 'For A = [1; 0], L = [1 0] is a left inverse, because LA = [1].'],
    ['right inverse', 'q53', 'A matrix R with AR = I.', 'For A = [1 0], R = [1; 0] is a right inverse, because AR = [1].'],
    ['diagonalization', 'q25', 'Writing A = PDP⁻¹ with D diagonal: the columns of P are eigenvectors and the diagonal of D holds their eigenvalues.', 'Then Aᵏ = PDᵏP⁻¹, so only the diagonal entries are raised to the power k.'],
    ['diagonal', 'q25', 'The entries of a square matrix that run from the top left to the bottom right.', 'The diagonal of [2 1; 0 3] is 2 and 3.', [], 'off-diagonal'],
    ['symmetric', 'q26', 'Equal to its own transpose: Aᵀ = A.', '[2 1; 1 3] is symmetric.'],
    ['singular value', 'q27', 'A nonnegative stretch factor of a matrix: the square root of an eigenvalue of AᵀA.', '[3 0; 0 −2] has singular values 3 and 2.'],
    ['covariance matrix', 'q28', 'A square table with the variance of each coordinate on its diagonal and the covariance of each pair of coordinates off it.', 'A covariance matrix [4 0; 0 1] says the first coordinate varies more and the two do not move together.'],
    ['trace', 'q28', 'The sum of the diagonal entries of a square matrix; it equals the sum of the eigenvalues.', 'The trace of [2 1; 0 3] is 2 + 3 = 5.'],
    ['pseudoinverse', 'q29', 'The matrix A⁺ for which x = A⁺b is the least-squares solution with the smallest norm.', 'For A = [1 1], A⁺ = [0.5; 0.5], so a demand of 4 is shared as (2, 2).'],
    ['condition number', 'q30', 'The largest singular value divided by the smallest; it limits how much relative errors can grow when a system is solved.', '[10 0; 0 0.1] has condition number 10 ÷ 0.1 = 100.'],
    ['positive definite', 'q32', 'A symmetric matrix K is positive definite when xᵀKx is greater than zero for every nonzero vector x.', '[2 0; 0 3] is positive definite: xᵀKx = 2x₁² + 3x₂².', ['positive definiteness']],
    ['conjugate', 'q34', 'The complex number with the sign of its imaginary part flipped.', 'The conjugate of 3 + 2i is 3 − 2i.', ['conjugation']],
    ['Hermitian', 'q35', 'Equal to its own conjugate transpose: H* = H.', '[2 i; −i 3] is Hermitian.'],
    ['Kronecker product', 'q37', 'A block matrix in which each entry of the first matrix multiplies a whole copy of the second.', '[1 2] ⊗ [1; 1] = [1 2; 1 2].'],
    ['stationary distribution', 'q38', 'A probability vector p that one step of the chain leaves unchanged: Pp = p.', 'For P = [0.9 0.2; 0.1 0.8], p = (2/3, 1/3) is stationary.'],
    ['adjacency matrix', 'q39', 'The matrix of a graph with a 1 in row i, column j when nodes i and j are joined by an edge, and 0 otherwise.', 'Two joined nodes have adjacency matrix [0 1; 1 0].'],
    ['gradient', 'q40', 'The vector of first partial derivatives of a function; it points in the direction of fastest increase.', 'For f(x, y) = x² + 3y the gradient is (2x, 3).'],
    ['Lagrange multiplier', 'q41', 'A shared number λ that, at a constrained optimum, makes the gradient of the cost equal λ times the gradient of the constraint.', 'Minimising x² + y² with x + y = 2 gives 2x = λ and 2y = λ, so x = y = 1.'],
    ['Frobenius norm', 'q49', 'The square root of the sum of the squared entries of a matrix.', 'The Frobenius norm of [3 0; 0 4] is √(9 + 16) = 5.'],
    ['Schur complement', 'q61', 'What is left of one block of a matrix after the other block has been eliminated: d − ca⁻¹b.', 'For [2 1; 4 5] it is 5 − 4 × (1 ÷ 2) × 1 = 3.'],
    ['permutation matrix', 'q62', 'A square matrix with exactly one 1 in every row and column and zeros elsewhere; it reorders coordinates.', '[0 1; 1 0] swaps the two coordinates of a vector.'],
    ['scalar', 'q01', 'A single number, as opposed to a vector or a matrix.', 'In 3(1, 2) = (3, 6) the scalar is 3.']
  ];
  /* Calculus 1 (docs/CALC1-PLAN.md). `taught` is the learn mission the plan gives the word to; a word is offered on
     the page once that mission's text uses it. */
  const CALC1 = [
    ['rate of change', 'q01', 'How fast one quantity changes compared with another: a change in the output divided by the change in the input.', 'A tank that gains 12 litres in 4 minutes fills at 3 litres per minute.'],
    ['average rate of change', 'q01', 'The change in a function’s value over an interval, divided by the length of the interval.', 'From t = 1 to t = 3 a height rises from 5 m to 21 m: 16 ÷ 2 = 8 m per second.'],
    ['interval', 'q01', 'All the numbers between a starting value and an ending value.', 'The interval from t = 2 to t = 6 lasts 4 seconds.'],
    ['Δ', 'q01', 'The Greek letter delta; written in front of a quantity it means “the change in” that quantity.', 'If t goes from 2 to 6, then Δt = 6 − 2 = 4.', ['delta']],
    ['secant line', 'q01', 'The straight line through two points of a curve; its slope is the average rate of change between them.', 'The secant line through (1, 5) and (3, 21) has slope 16 ÷ 2 = 8.', ['secant']],
    ['instantaneous rate of change', 'q02', 'The rate of change at one single moment: the number that average rates settle on as the interval shrinks.', 'A speedometer shows an instantaneous rate of change of distance.', ['instantaneous rate']],
    ['limit', 'q03', 'The value that a function’s outputs get closer and closer to as the input gets close to a chosen number.', 'As x gets close to 2, x² gets close to 4, so the limit is 4.', [], 'speed limit|weight limit|safety limit|limit switch'],
    ['direct substitution', 'q04', 'Finding a limit by simply putting the number into the formula, which works wherever the function is continuous.', 'The limit of 3x + 1 as x approaches 2 is 3 × 2 + 1 = 7.'],
    ['limit law', 'q04', 'One of the rules that say limits behave well under adding, subtracting, multiplying, dividing and taking powers.', 'By the sum law, the limit of x² + 3x as x approaches 2 is 4 + 6 = 10.', ['sum law', 'difference law', 'product law', 'quotient law', 'power law', 'constant multiple law']],
    ['hole', 'q05', 'A single missing point in a graph, where the formula has no value although the limit exists.', 'y = (x² − 4) ÷ (x − 2) is the line y = x + 2 with a hole at x = 2.'],
    ['one-sided limit', 'q06', 'A limit that looks at inputs on only one side of the chosen number, the left or the right.', 'From the right of 0, 1 ÷ x grows without bound; from the left it falls without bound.'],
    ['left-hand limit', 'q06', 'The value a function closes in on as the input approaches a number from below, written with a small minus sign.', 'For f(x) = x + 1 when x < 1, the left-hand limit at 1 is 2.'],
    ['right-hand limit', 'q06', 'The value a function closes in on as the input approaches a number from above, written with a small plus sign.', 'For f(x) = 3x when x ≥ 1, the right-hand limit at 1 is 3.'],
    ['continuous', 'q07', 'Having no break, jump or hole: at each point the limit equals the function’s value there.', 'f(x) = x² is continuous; a graph you can draw without lifting the pen.', ['continuity']],
    ['∞', 'q08', 'The symbol for infinity: not a number, but shorthand for growing beyond every number you can name.', 'As x → ∞, 1 ÷ x shrinks towards 0.', ['infinity']],
    ['asymptote', 'q08', 'A straight line that a graph gets closer and closer to without settling on it.', 'The graph of y = 1 ÷ x has the asymptotes y = 0 and x = 0.'],
    ['horizontal asymptote', 'q08', 'A level line y = L that a graph approaches as x grows very large in either direction.', 'y = (2x + 1) ÷ x has the horizontal asymptote y = 2.'],
    ['vertical asymptote', 'q09', 'An upright line x = a beside which the function’s values grow or fall without bound.', 'y = 1 ÷ (x − 3) has the vertical asymptote x = 3.'],
    ['Intermediate Value Theorem', 'q10', 'A continuous function on an interval takes every value between its values at the two ends.', 'If f(1) = −2 and f(2) = 3, a continuous f is 0 somewhere between 1 and 2.'],
    ['difference quotient', 'q12', 'The fraction (f(a + h) − f(a)) ÷ h: the average rate of change of f from a to a + h.', 'For f(x) = x² at a = 3 with h = 1: (16 − 9) ÷ 1 = 7.'],
    ['derivative', 'q12', 'The instantaneous rate of change of a function: the limit of its difference quotients as the step shrinks to zero.', 'The derivative of x² is 2x, so at x = 3 the rate of change is 6.'],
    ['prime notation', 'q12', 'Writing a derivative with a small mark after the function’s name: f′ for the derivative of f and f″ for the second derivative.', 'If f(x) = x², then f′(3) = 6, read “f prime of 3”.'],
    ['tangent line', 'q13', 'The straight line that touches a curve at a point and has the curve’s slope there.', 'At x = 3 the tangent line to y = x² has slope 6: y = 6x − 9.', ['tangent'], 'tangent of|tangent ratio'],
    ['derivative function', 'q13', 'The function f′ that gives, for each input x, the derivative of f at that x.', 'For f(x) = x² the derivative function is f′(x) = 2x.'],
    ['power rule', 'q14', 'The rule that the derivative of xⁿ is n times x to the power n − 1.', 'The derivative of x⁵ is 5x⁴.'],
    ['differentiate', 'q15', 'To work out the derivative of a function.', 'Differentiate x³ + 2x to get 3x² + 2.', ['differentiating', 'differentiated', 'differentiation']],
    ['constant multiple rule', 'q15', 'A number multiplying a function stays in front when you take the derivative.', 'The derivative of 5x³ is 5 × 3x² = 15x².'],
    ['sum rule', 'q15', 'The derivative of a sum of functions is the sum of their derivatives.', 'The derivative of x² + x³ is 2x + 3x².'],
    ['difference rule', 'q15', 'The derivative of one function minus another is the first derivative minus the second.', 'The derivative of x³ − x² is 3x² − 2x.'],
    ['velocity', 'q16', 'The rate of change of position: the derivative of position with respect to time, with a sign for direction.', 'If s(t) = 5t², the velocity is 10t, which is 20 m per second at t = 2.'],
    ['acceleration', 'q16', 'The rate of change of velocity: the derivative of velocity, and so the second derivative of position.', 'If the velocity is 10t, the acceleration is 10 m per second each second.'],
    ['second derivative', 'q16', 'The derivative of the derivative; it tells how fast the rate of change is itself changing.', 'For f(x) = x³: f′(x) = 3x² and f″(x) = 6x.'],
    ['product rule', 'q18', 'The rule for the derivative of a product: (fg)′ = f′g + fg′.', 'For x² · sin x the derivative is 2x sin x + x² cos x.'],
    ['quotient rule', 'q19', 'The rule for the derivative of a fraction: (f ÷ g)′ = (f′g − fg′) ÷ g².', 'For x ÷ (x + 1) the derivative is 1 ÷ (x + 1)².'],
    ['chain rule', 'q20', 'The rule for a function inside another: the derivative of the outer one, at the inner one, times the derivative of the inner one.', 'For (3x + 1)² the derivative is 2(3x + 1) × 3.'],
    ['inner function', 'q20', 'In a function inside another, the one that is worked out first: the part inside the brackets.', 'In (3x − 4)³ the inner function is 3x − 4.'],
    ['outer function', 'q20', 'In a function inside another, the one applied last, to the result of the inner function.', 'In (3x − 4)³ the outer function is “cube it”.'],
    ['radian', 'q21', 'A unit of angle: the angle whose arc on a circle is as long as the radius, so a full turn is 2π radians.', 'A half turn, 180°, is π radians, about 3.14.'],
    ['unit circle', 'q21', 'The circle of radius 1 centred at the origin; the point at angle t on it is (cos t, sin t).', 'At angle 0 the point on the unit circle is (1, 0).'],
    ['the number e', 'q22', 'A constant, about 2.718, used as a base because e^x is then its own derivative.', 'e² is about 7.389.'],
    ['natural logarithm', 'q22', 'The logarithm with base e, written ln x: the power you raise e to in order to get x.', 'ln 1 = 0, because e⁰ = 1.', ['ln']],
    ['implicit differentiation', 'q24', 'Differentiating both sides of an equation in x and y as it stands, treating y as a function of x.', 'From x² + y² = 25: 2x + 2y · dy/dx = 0, so dy/dx = −x ÷ y.'],
    ['related rates', 'q25', 'Problems in which two changing quantities are tied by an equation, so the rate of one gives the rate of the other.', 'A balloon’s radius grows, so its volume grows at a rate tied to it.'],
    ['linear approximation', 'q26', 'Estimating a function near a point by its tangent line there: f(a) + f′(a)(x − a).', '√4.1 is about 2 + 0.25 × 0.1 = 2.025.', ['linearization', 'linearisation']],
    ['differential', 'q26', 'A small change measured along the tangent line: dx for the input and dy = f′(a) × dx for the output.', 'For f(x) = x² at a = 3 with dx = 0.1, dy = 6 × 0.1 = 0.6.'],
    ['critical point', 'q27', 'An input where the derivative is zero or does not exist; highs and lows inside an interval can only occur there.', 'f(x) = x² − 4x has f′(x) = 2x − 4, so its critical point is x = 2.'],
    ['increasing', 'q27', 'Rising as the input grows; a function is increasing where its derivative is positive.', 'f(x) = x² is increasing for x > 0.'],
    ['decreasing', 'q27', 'Falling as the input grows; a function is decreasing where its derivative is negative.', 'f(x) = x² is decreasing for x < 0.'],
    ['local maximum', 'q27', 'A point where a function is higher than at every input near it: a hilltop of the graph.', 'f(x) = −x² has a local maximum at x = 0.'],
    ['local minimum', 'q27', 'A point where a function is lower than at every input near it: a valley floor of the graph.', 'f(x) = x² has a local minimum at x = 0.'],
    ['first derivative test', 'q27', 'A critical point is a local maximum if f′ changes from positive to negative there, and a local minimum if from negative to positive.', 'For x², f′ = 2x goes from negative to positive at 0: a local minimum.'],
    ['concave', 'q28', 'Bending one way: concave up means the slope is rising (f″ > 0), concave down means the slope is falling (f″ < 0).', 'y = x² is concave up everywhere, like a cup.', ['concavity', 'concave up', 'concave down']],
    ['inflection point', 'q28', 'A point where a graph changes from concave up to concave down, or the other way round.', 'y = x³ has an inflection point at x = 0.'],
    ['second derivative test', 'q28', 'At a critical point, f″ > 0 means a local minimum and f″ < 0 means a local maximum.', 'For x² − 4x, f″ = 2 > 0 at the critical point x = 2: a local minimum.'],
    ['absolute maximum', 'q30', 'The largest value a function takes anywhere on the interval being considered.', 'On the interval from 0 to 3, f(x) = x² has absolute maximum 9, at x = 3.'],
    ['absolute minimum', 'q30', 'The smallest value a function takes anywhere on the interval being considered.', 'On the interval from −1 to 3, f(x) = x² has absolute minimum 0, at x = 0.'],
    ['closed interval', 'q30', 'An interval that includes both of its end points.', 'The closed interval from 0 to 3 contains 0, 3 and everything between.'],
    ['Extreme Value Theorem', 'q30', 'A continuous function on a closed interval has both an absolute maximum and an absolute minimum.', 'On the closed interval from 0 to 3, x² has minimum 0 and maximum 9.'],
    ['optimisation', 'q31', 'Finding the input that makes a quantity as large or as small as possible, often under a constraint.', 'Of all rectangles with perimeter 20 m, the 5 m by 5 m square has the largest area.', ['optimization']],
    ['constraint', 'q31', 'A condition that the quantities in a problem must satisfy, which ties one of them to the others.', 'A fence of 20 m around a rectangle is the constraint 2x + 2y = 20.'],
    ['Mean Value Theorem', 'q32', 'For a smooth curve on an interval, at some point inside it the tangent has the same slope as the secant line through the ends.', 'Averaging 60 km per hour over a trip, you drove at exactly 60 at some moment.'],
    ['L’Hôpital’s rule', 'q33', 'For a limit of a fraction of the form 0 ÷ 0 or ∞ ÷ ∞, the limit of the derivatives’ fraction gives the same value.', 'As x approaches 0, sin x ÷ x has the same limit as cos x ÷ 1, which is 1.', ['L\'Hôpital\'s rule', 'L’Hopital’s rule']],
    ['indeterminate', 'q33', 'Said of a limit whose form, such as 0 ÷ 0, does not by itself tell you its value.', 'As x approaches 0, sin x ÷ x has the indeterminate form 0 ÷ 0, yet its limit is 1.', ['indeterminate form']],
    ['Newton’s method', 'q34', 'A way to close in on a root: follow the tangent line from the current guess down to where it crosses zero, and repeat.', 'For x² − 2 from the guess 1.5: 1.5 − 0.25 ÷ 3, about 1.4167.', ['Newton\'s method']],
    ['antiderivative', 'q35', 'A function whose derivative is the given function; any constant may be added to it.', 'x³ is an antiderivative of 3x², and so is x³ + 7.'],
    ['∫', 'q35', 'The integral sign, a tall S; ∫ f(t) dt stands for every antiderivative of f.', '∫ 2t dt = t² + C.', ['integral sign']],
    ['initial value problem', 'q36', 'Finding a function from its derivative together with one known value, which fixes the constant.', 'If v(t) = 6t and s(0) = 4, then s(t) = 3t² + 4.'],
    ['Riemann sum', 'q37', 'An estimate of the area under a curve: the sum of the areas of thin rectangles whose heights are values of the function.', 'With 4 rectangles of width 0.5 the area is 0.5 times the sum of the 4 heights.'],
    ['left-endpoint sum', 'q37', 'A Riemann sum in which each rectangle’s height is the function’s value at the left end of its piece.', 'From 0 to 2 in 2 pieces, x² gives 1 × (0 + 1) = 1.'],
    ['right-endpoint sum', 'q37', 'A Riemann sum in which each rectangle’s height is the function’s value at the right end of its piece.', 'From 0 to 2 in 2 pieces, x² gives 1 × (1 + 4) = 5.'],
    ['integral', 'q38', 'The total built up from a rate: on a graph, the signed area between the curve and the horizontal axis.', 'A flow of 3 litres per minute for 4 minutes adds up to 12 litres.'],
    ['definite integral', 'q38', 'The signed area between a curve and the horizontal axis from one input to another, written ∫ from a to b.', 'The definite integral of 2x from 0 to 3 is 9.'],
    ['Fundamental Theorem of Calculus', 'q39', 'The definite integral of f from a to b equals F(b) − F(a) for any antiderivative F of f.', 'For 2x from 1 to 3: F(x) = x², so the integral is 9 − 1 = 8.'],
    ['Net Change Theorem', 'q40', 'The amount at the end equals the amount at the start plus the integral of the rate of change over the interval.', 'A tank with 10 litres, filled at 3 litres per minute for 4 minutes, ends with 22 litres.'],
    ['net change', 'q40', 'How much a quantity has changed overall: the integral of its rate of change over the interval.', 'Filling at 5 and then draining at 2 litres per minute, a minute each, is a net change of 3 litres.']
  ];
  const build = rows => {
    const out = {};
    for (const [term, taught, means, example, also, avoid] of rows) out[term.toLowerCase()] = { term, taught, means, example, also: also || [], ...(avoid ? { avoid } : {}) };
    return out;
  };
  window.VG_GLOSSARY = { found: build(FOUND), la: build(LA), calc1: build(CALC1) };

  /* ---------- matching (no page needed; qa/glossary.test.js uses it) ---------- */
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const plural = w => /[a-z]$/i.test(w) && !/s$/i.test(w) ? [w + 's'] : [];
  const matchers = {};
  /* For one pack: every spelling, longest first, as one pattern, and the entry each spelling belongs to. */
  function matcher(packId) {
    if (matchers[packId]) return matchers[packId];
    const pack = (window.VG_GLOSSARY || {})[packId]; if (!pack) return null;
    const forms = new Map();
    for (const [key, e] of Object.entries(pack)) for (const base of [e.term, ...e.also]) for (const w of [base, ...plural(base)]) if (!forms.has(w.toLowerCase())) forms.set(w.toLowerCase(), key);
    const words = [...forms.keys()].sort((a, b) => b.length - a.length);
    const re = new RegExp('(?<![\\p{L}\\p{N}])(' + words.map(escapeRe).join('|') + ')(?![\\p{L}\\p{N}])', 'giu');
    const avoid = {}; for (const [key, e] of Object.entries(pack)) if (e.avoid) avoid[key] = new RegExp(e.avoid, 'i');
    return matchers[packId] = { pack, forms, re, avoid };
  }
  /* The glossary words in one piece of text: [{ index, text, key }], left to right. used: keys already taken in this block. */
  function find(text, packId, used) {
    const m = matcher(packId), out = []; if (!m || !text) return out;
    const taken = used || new Set(); m.re.lastIndex = 0;
    for (let hit; (hit = m.re.exec(text));) {
      const key = m.forms.get(hit[1].toLowerCase());
      if (!key || taken.has(key)) continue;
      if (m.avoid[key] && m.avoid[key].test(text.slice(Math.max(0, hit.index - 24), hit.index + hit[1].length + 24))) continue;
      taken.add(key); out.push({ index: hit.index, text: hit[1], key });
    }
    return out;
  }

  /* ---------- the page ---------- */
  /* Blocks of lesson, prompt, hint and solution text. Each term becomes a button once per block. */
  const BLOCKS = '.teaching, .guide-body, .hint, #objective-heading ~ p:not([class]):not([style])';
  const NEVER = 'a, button, input, textarea, select, option, label, code, pre, kbd, svg, canvas, summary, h1, h2, h3, h4, [contenteditable], .gloss-pop';
  let pop = null, trigger = null, listening = false, count = 0;
  const doc = () => window.document || null;
  function wrap(root, packId) {
    const d = doc(), id = packId || (window.REALM && window.REALM.id);
    if (!d || !root || typeof root.querySelectorAll !== 'function' || typeof d.createTreeWalker !== 'function' || !matcher(id)) return 0;
    listen();
    let made = 0;
    const blocks = [...root.querySelectorAll(BLOCKS)]; if (typeof root.matches === 'function' && root.matches(BLOCKS)) blocks.unshift(root);
    for (const block of blocks) {
      if (block.hasAttribute('data-glossed') || (block.parentElement && block.parentElement.closest('[data-glossed]'))) continue;
      block.setAttribute('data-glossed', '');
      const walker = d.createTreeWalker(block, 4 /* text nodes */), nodes = [], used = new Set();
      for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue && n.nodeValue.trim() && n.parentElement && !n.parentElement.closest(NEVER)) nodes.push(n);
      for (const node of nodes) {
        const text = node.nodeValue, hits = find(text, id, used); if (!hits.length) continue;
        const frag = d.createDocumentFragment(); let at = 0;
        for (const h of hits) {
          if (h.index > at) frag.appendChild(d.createTextNode(text.slice(at, h.index)));
          const b = d.createElement('button'); b.type = 'button'; b.className = 'gloss'; b.textContent = h.text;
          b.setAttribute('data-gloss', h.key); b.setAttribute('data-gloss-pack', id); b.setAttribute('aria-expanded', 'false');
          frag.appendChild(b); at = h.index + h.text.length; made++;
        }
        if (at < text.length) frag.appendChild(d.createTextNode(text.slice(at)));
        node.parentNode.replaceChild(frag, node);
      }
    }
    if (made) try { region(root.closest ? root.closest('dialog') : null); } catch (e) { /* the definition is still shown */ }
    return made;
  }
  /* Screen readers. Focus stays on the word, and a description added to a control that already has focus is not read
     again, so the definition is also put into a live region. The region is a direct child of the dialog (or of the
     page), is made when the words are wrapped, so it exists before anything is said in it, and is emptied when the
     definition closes. It is not visible; the visible definition is the pop-up. */
  const HIDDEN = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap';
  function region(host) {
    const d = doc(), parent = host || (d && d.body); if (!d || !parent) return null;
    let r = [...(parent.children || [])].find(n => n.className === 'gloss-live');
    if (!r) { r = d.createElement('div'); r.className = 'gloss-live'; r.setAttribute('aria-live', 'polite'); r.setAttribute('aria-atomic', 'true'); r.style.cssText = HIDDEN; parent.appendChild(r); }
    return r;
  }
  let live = null, said = 0;
  function announce(host, text) {
    const turn = ++said; try { if (live) live.textContent = ''; live = text ? region(host) : live; } catch (e) { live = null; }
    if (!live || !text) return;
    live.textContent = '';
    /* A moment later, so the change is a change even when the same word is opened twice. */
    const say = () => { if (turn === said && live) live.textContent = text; };
    if (typeof window.setTimeout === 'function') window.setTimeout(say, 60); else say();
  }
  const titleOf = id => { const q = (window.QUESTS || []).find(x => x.id === id); return q ? `${id.toUpperCase()} · ${q.title}` : id.toUpperCase(); };
  function close(refocus) {
    if (!pop) return false;
    const t = trigger; pop.remove(); pop = null; trigger = null; announce(null, '');
    if (t) { t.setAttribute('aria-expanded', 'false'); t.removeAttribute('aria-describedby'); if (refocus && t.isConnected) try { t.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    return true;
  }
  /* The definition sits under the word (above it when there is no room below) and never leaves the screen. */
  function place() {
    if (!pop || !trigger) return;
    if (!trigger.isConnected) { close(false); return; }
    const d = doc(), vw = d.documentElement.clientWidth, vh = window.innerHeight || d.documentElement.clientHeight, gap = 8;
    pop.style.left = '0px'; pop.style.top = '0px';
    const zero = pop.getBoundingClientRect(), r = trigger.getBoundingClientRect(); // zero: where "0, 0" really is, whatever the positioned parent
    const left = Math.max(gap, Math.min(r.left + r.width / 2 - zero.width / 2, vw - zero.width - gap));
    const below = r.bottom + gap, top = below + zero.height <= vh - gap || r.top - gap - zero.height < gap ? below : r.top - gap - zero.height;
    pop.style.left = Math.round(left - zero.left) + 'px'; pop.style.top = Math.round(top - zero.top) + 'px';
  }
  function open(button) {
    const d = doc(), packId = button.getAttribute('data-gloss-pack'), e = ((window.VG_GLOSSARY || {})[packId] || {})[button.getAttribute('data-gloss')];
    close(false); if (!e) return;
    pop = d.createElement('div'); pop.className = 'gloss-pop'; pop.id = 'gloss-pop-' + (++count); pop.setAttribute('role', 'note');
    const line = (cls, text, lead) => { const p = d.createElement('p'); p.className = cls; if (lead) { const b = d.createElement('b'); b.textContent = lead + ' '; p.appendChild(b); } p.appendChild(d.createTextNode(text)); pop.appendChild(p); };
    line('gloss-term', e.term.charAt(0).toUpperCase() + e.term.slice(1)); line('gloss-means', e.means); line('gloss-example', e.example, 'Example:'); line('gloss-taught', titleOf(e.taught), 'Taught in:');
    /* Inside an open dialog the definition must be in the dialog, or it would sit behind it. */
    const host = button.closest('dialog[open]');
    (host || d.body).appendChild(pop);
    trigger = button; button.setAttribute('aria-expanded', 'true'); button.setAttribute('aria-describedby', pop.id);
    const lines = [...pop.children].map(p => p.textContent);
    announce(host, lines[0] + ': ' + lines.slice(1).join(' '));
    place();
  }
  function listen() {
    const d = doc(); if (listening || !d || typeof d.addEventListener !== 'function') return; listening = true;
    /* Capture phase: an outside tap closes the definition before anything else reacts to it. */
    d.addEventListener('click', ev => {
      const t = ev.target, button = t && t.closest ? t.closest('button.gloss') : null;
      if (button) { ev.preventDefault(); ev.stopPropagation(); if (button === trigger) close(false); else open(button); return; }
      if (!pop || (t && t.closest && t.closest('.gloss-pop'))) return;
      close(false);
      /* A tap on the dimmed area around the dialog closed the definition; it should not close the mission as well. */
      if (t && t.tagName === 'DIALOG') ev.stopPropagation();
    }, true);
    d.addEventListener('keydown', ev => { if (pop && (ev.key === 'Escape' || ev.key === 'Esc')) { ev.preventDefault(); ev.stopPropagation(); close(true); } }, true);
    d.addEventListener('cancel', ev => { if (pop) { ev.preventDefault(); close(true); } }, true);
    d.addEventListener('scroll', () => place(), true);
    if (typeof window.addEventListener === 'function') window.addEventListener('resize', () => place());
  }
  window.VGGlossary = { wrap, find, close: () => close(true), isOpen: () => !!pop, BLOCKS, NEVER };
})();
