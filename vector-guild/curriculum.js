/* Authored engineering missions with worked teaching examples and guided practice. */
window.QUESTS = [
  {
    "id": "q01",
    "title": "Docking thrusters",
    "topic": "Vector addition",
    "tier": "Basic",
    "sector": "Orbital Dock",
    "brief": "Combine two impulse commands.",
    "lesson": "Vectors add component by component; each coordinate carries the same physical unit.",
    "prompt": "Thrusters deliver impulses (3, −1, 2) and (−1, 4, 0) N·s. Enter the resultant x, y, z.",
    "answer": [
      2,
      3,
      2
    ],
    "labels": [
      "x impulse",
      "y impulse",
      "z impulse"
    ],
    "tolerance": 0.01,
    "hints": [
      "Add the x components first.",
      "The z components are 2 and 0."
    ],
    "solution": "(3−1, −1+4, 2+0) = (2,3,2) N·s.",
    "xp": 100,
    "prereqs": [],
    "artifact": {
      "name": "Vector compass",
      "description": "A coordinate frame for navigating the guild."
    },
    "teaching": {
      "intuition": "A vector is an ordered list of signed changes along named axes. Combining impulses means adding the change along each axis independently. N·s means newton-seconds, the unit of impulse.",
      "steps": [
        "Match x with x, y with y, and z with z.",
        "Add signed numbers in each position.",
        "Keep the coordinate order and units in your final vector."
      ],
      "example": {
        "prompt": "Combine impulses (2,1,−3) and (4,−2,1) N·s.",
        "steps": [
          "x: 2+4=6.",
          "y: 1−2=−1; z: −3+1=−2."
        ],
        "answer": "(6,−1,−2) N·s."
      },
      "pitfalls": [
        "Do not add all coordinates into one scalar.",
        "A negative component describes direction, not an invalid impulse."
      ]
    },
    "guidance": [
      {
        "prompt": "What is the resultant x impulse: 3+(−1)?",
        "answer": [
          2
        ],
        "labels": [
          "x impulse"
        ],
        "explanation": "Both x impulses act on the same axis, so their signed sum is 2 N·s."
      },
      {
        "prompt": "What are the resultant y and z impulses: −1+4 and 2+0?",
        "answer": [
          3,
          2
        ],
        "labels": [
          "y impulse",
          "z impulse"
        ],
        "explanation": "The remaining components are 3 and 2 N·s; retain x,y,z order."
      }
    ]
  },
  {
    "id": "q02",
    "title": "Cable length",
    "topic": "Norm and unit vectors",
    "tier": "Basic",
    "sector": "Orbital Dock",
    "brief": "Calibrate a diagonal support cable.",
    "lesson": "The Euclidean norm is √(x²+y²+z²). Divide a nonzero vector by its norm to obtain a unit direction.",
    "prompt": "A cable displacement is (3,4,0) m. Enter its length and the x, y components of its unit direction.",
    "answer": [
      5,
      0.6,
      0.8
    ],
    "labels": [
      "length",
      "unit x",
      "unit y"
    ],
    "tolerance": 0.01,
    "hints": [
      "Use the 3–4–5 triangle.",
      "Divide each displacement component by 5."
    ],
    "solution": "Length √(9+16)=5 m; direction (0.6,0.8,0).",
    "xp": 100,
    "prereqs": [
      "q01"
    ],
    "teaching": {
      "intuition": "Length ignores direction: squaring coordinates prevents positive and negative components from canceling. A unit vector retains direction but has length one.",
      "steps": [
        "Square each coordinate and add the results.",
        "Take the nonnegative square root to obtain the length.",
        "Divide each coordinate by that length; unit-vector components have no units."
      ],
      "example": {
        "prompt": "Find the length and unit direction of (0,6,8) m.",
        "steps": [
          "The squared length is 0+36+64=100 m².",
          "The length is 10 m; divide each component by 10."
        ],
        "answer": "Length 10 m; unit vector (0,0.6,0.8)."
      },
      "pitfalls": [
        "Do not divide by the squared length.",
        "The zero vector has no unit direction because division by zero is undefined."
      ]
    },
    "guidance": [
      {
        "prompt": "For (3,4,0), what is the sum of squared coordinates?",
        "answer": [
          25
        ],
        "labels": [
          "squared length"
        ],
        "explanation": "3²+4²+0²=9+16=25 m²."
      },
      {
        "prompt": "Take the square root, then divide the x component by it. Enter length and unit x.",
        "answer": [
          5,
          0.6
        ],
        "labels": [
          "length",
          "unit x"
        ],
        "explanation": "√25=5 m and 3/5=0.6. The remaining unit y is 4/5."
      }
    ]
  },
  {
    "id": "q03",
    "title": "Work at the airlock",
    "topic": "Dot product",
    "tier": "Basic",
    "sector": "Orbital Dock",
    "brief": "Measure useful work from an angled force.",
    "lesson": "The dot product F·d gives work for a constant force; perpendicular force components contribute zero.",
    "prompt": "Force F=(4,−2,1) N moves a panel by d=(3,1,2) m. Enter the work in joules.",
    "answer": [
      12
    ],
    "labels": [
      "work"
    ],
    "tolerance": 0.01,
    "hints": [
      "Multiply matching coordinates.",
      "Sum 12, −2, and 2."
    ],
    "solution": "F·d=4·3−2·1+1·2=12 J.",
    "xp": 100,
    "prereqs": [
      "q01"
    ],
    "teaching": {
      "intuition": "A dot product measures how much two vectors point along one another. For force and displacement it counts only the force that contributes to the motion, producing work in joules.",
      "steps": [
        "Multiply coordinates in matching positions.",
        "Add the three signed products.",
        "Use N·m=J for force dotted with displacement."
      ],
      "example": {
        "prompt": "Find work for F=(2,1,−1) N and d=(1,3,2) m.",
        "steps": [
          "Coordinate products are 2,3,−2 N·m.",
          "Their sum is 2+3−2=3."
        ],
        "answer": "3 J."
      },
      "pitfalls": [
        "The dot product is a scalar, not a vector.",
        "Keep negative products: a force opposing displacement removes work."
      ]
    },
    "guidance": [
      {
        "prompt": "Enter the three coordinate products 4·3, (−2)·1, and 1·2.",
        "answer": [
          12,
          -2,
          2
        ],
        "labels": [
          "x product",
          "y product",
          "z product"
        ],
        "explanation": "Each product pairs a force coordinate with the displacement coordinate on that same axis."
      },
      {
        "prompt": "Add the y and z contributions, −2+2.",
        "answer": [
          0
        ],
        "labels": [
          "y plus z work"
        ],
        "explanation": "They cancel, leaving only the x contribution in the total work."
      }
    ]
  },
  {
    "id": "q04",
    "title": "Attitude torque",
    "topic": "Cross product",
    "tier": "Basic",
    "sector": "Orbital Dock",
    "brief": "Find the torque of an offset thruster.",
    "lesson": "Torque τ=r×F follows the right-hand rule. Its components are (r_yF_z−r_zF_y, r_zF_x−r_xF_z, r_xF_y−r_yF_x).",
    "prompt": "A force F=(0,3,0) N acts at r=(2,0,0) m. Enter τ_x, τ_y, τ_z in N·m.",
    "answer": [
      0,
      0,
      6
    ],
    "labels": [
      "torque x",
      "torque y",
      "torque z"
    ],
    "tolerance": 0.01,
    "hints": [
      "Both vectors lie in the xy plane.",
      "The z component is 2·3−0·0."
    ],
    "solution": "r×F=(0,0,6) N·m; reversing the cross product would reverse the sign.",
    "xp": 100,
    "prereqs": [
      "q02",
      "q03"
    ],
    "teaching": {
      "intuition": "Torque records the tendency to rotate about an origin. Its direction is perpendicular to the lever arm r and force F, and its sign follows the right-hand rule.",
      "steps": [
        "Write torque as r×F in this order.",
        "Compute each component using the cross-product formula in the lesson.",
        "Check that torque is perpendicular to both vectors and has units N·m."
      ],
      "example": {
        "prompt": "Find torque for r=(0,2,0) m and F=(0,0,4) N.",
        "steps": [
          "τx=2·4−0·0=8.",
          "τy=0·0−0·4=0 and τz=0·0−2·0=0."
        ],
        "answer": "(8,0,0) N·m."
      },
      "pitfalls": [
        "F×r has the opposite sign to r×F.",
        "Cross product gives a vector; do not substitute a dot product."
      ]
    },
    "guidance": [
      {
        "prompt": "For r=(2,0,0), F=(0,3,0), compute τx and τy.",
        "answer": [
          0,
          0
        ],
        "labels": [
          "torque x",
          "torque y"
        ],
        "explanation": "Both products in each of these components contain a zero factor."
      },
      {
        "prompt": "Compute rₓFᵧ and rᵧFₓ separately.",
        "answer": [
          6,
          0
        ],
        "labels": [
          "first z product",
          "second z product"
        ],
        "explanation": "The z torque is their difference: 6−0."
      }
    ]
  },
  {
    "id": "q05",
    "title": "Sensor alignment",
    "topic": "Angles and similarity",
    "tier": "Basic",
    "sector": "Sensor Array",
    "brief": "Test whether two sensor directions agree.",
    "lesson": "For nonzero vectors, cos θ=(u·v)/(‖u‖‖v‖). Cosine similarity is independent of positive rescaling.",
    "prompt": "Directions u=(1,0) and v=(1,√3) define an angle. Enter cos θ and θ in degrees.",
    "answer": [
      0.5,
      60
    ],
    "labels": [
      "cosine",
      "angle degrees"
    ],
    "tolerance": 0.01,
    "hints": [
      "The two lengths are 1 and 2.",
      "Their dot product is 1."
    ],
    "solution": "cos θ=1/(1·2)=0.5, hence θ=60°.",
    "xp": 100,
    "prereqs": [
      "q02",
      "q03"
    ],
    "teaching": {
      "intuition": "Dividing the dot product by both lengths removes the effect of vector magnitude. The remaining cosine describes direction alone; inverse cosine converts it to an angle.",
      "steps": [
        "Calculate the dot product.",
        "Calculate each nonzero vector length.",
        "Divide by the product of lengths, then take inverse cosine in the requested angle unit."
      ],
      "example": {
        "prompt": "Find the angle between u=(2,0) and v=(1,1).",
        "steps": [
          "u·v=2; lengths are 2 and √2.",
          "cos θ=2/(2√2)=1/√2; inverse cosine gives 45°."
        ],
        "answer": "Cosine ≈0.7071; angle 45°."
      },
      "pitfalls": [
        "A calculator in radians will not directly return degrees.",
        "Cosine similarity is undefined if either vector is zero."
      ]
    },
    "guidance": [
      {
        "prompt": "For u=(1,0), v=(1,√3), enter their dot product and the length of v.",
        "answer": [
          1,
          2
        ],
        "labels": [
          "dot product",
          "length v"
        ],
        "explanation": "u·v=1 and ‖v‖=√(1+3)=2."
      },
      {
        "prompt": "The length product is 2. What is 1/2?",
        "answer": [
          0.5
        ],
        "labels": [
          "cosine"
        ],
        "explanation": "The angle is the inverse cosine of this ratio, expressed in degrees."
      }
    ]
  },
  {
    "id": "q06",
    "title": "Telemetry mixer",
    "topic": "Matrix-vector products",
    "tier": "Basic",
    "sector": "Sensor Array",
    "brief": "Mix raw channels into calibrated outputs.",
    "lesson": "Each output of Ax is a row of A dotted with x. A 2×3 matrix maps three input channels to two outputs.",
    "prompt": "A has rows (1,2,−1), (0,3,2). Raw x=(2,1,4). Enter the two outputs Ax.",
    "answer": [
      0,
      11
    ],
    "labels": [
      "output 1",
      "output 2"
    ],
    "tolerance": 0.01,
    "hints": [
      "Compute one dot product per row.",
      "The first row gives 2+2−4."
    ],
    "solution": "Ax=(2+2−4, 0+3+8)=(0,11).",
    "xp": 100,
    "prereqs": [
      "q03"
    ],
    "teaching": {
      "intuition": "A matrix is a collection of output recipes. Each row lists how much of each input channel contributes to one output. A 2×3 matrix therefore consumes three values and returns two.",
      "steps": [
        "Check that the number of input coordinates equals the number of columns.",
        "Take the dot product of the first row with the input.",
        "Repeat for every remaining row, preserving row order."
      ],
      "example": {
        "prompt": "A has rows (2,0,1) and (1,−1,0); x=(3,2,4). Find Ax.",
        "steps": [
          "First output: 2·3+0·2+1·4=10.",
          "Second output: 1·3−1·2+0·4=1."
        ],
        "answer": "Ax=(10,1)."
      },
      "pitfalls": [
        "Rows produce outputs; columns describe input effects.",
        "A zero coefficient contributes zero, but its position still matters."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the first output: 1·2+2·1−1·4.",
        "answer": [
          0
        ],
        "labels": [
          "first output"
        ],
        "explanation": "The three contributions are 2,2,−4, summing to 0."
      },
      {
        "prompt": "Compute the two nonzero contributions to the second output: 3·1 and 2·4.",
        "answer": [
          3,
          8
        ],
        "labels": [
          "second-row middle term",
          "second-row last term"
        ],
        "explanation": "Add these to the zero first term to obtain the second output."
      }
    ]
  },
  {
    "id": "q07",
    "title": "Rotate the rover",
    "topic": "Planar transformations",
    "tier": "Basic",
    "sector": "Rover Bay",
    "brief": "Turn a rover heading through a right angle.",
    "lesson": "A counterclockwise rotation by θ has matrix [[cos θ,−sin θ],[sin θ,cos θ]].",
    "prompt": "Rotate the position (3,−2) counterclockwise by 90°. Enter the new x and y.",
    "answer": [
      2,
      3
    ],
    "labels": [
      "new x",
      "new y"
    ],
    "tolerance": 0.01,
    "hints": [
      "At 90°, cos θ=0 and sin θ=1.",
      "The rule is (x,y)↦(−y,x)."
    ],
    "solution": "R(3,−2)=(−(−2),3)=(2,3).",
    "xp": 100,
    "prereqs": [
      "q06"
    ],
    "teaching": {
      "intuition": "A planar rotation moves a point around the origin while preserving its length. Counterclockwise 90° sends the positive x axis to the positive y axis.",
      "steps": [
        "Choose the rotation matrix for the stated direction and angle.",
        "For 90° counterclockwise use (x,y)→(−y,x).",
        "Substitute coordinates with their signs and preserve x,y output order."
      ],
      "example": {
        "prompt": "Rotate (−4,1) counterclockwise by 90°.",
        "steps": [
          "Negate the old y coordinate: new x=−1.",
          "Copy the old x coordinate: new y=−4."
        ],
        "answer": "(−1,−4)."
      },
      "pitfalls": [
        "Clockwise uses a different sign pattern.",
        "The formula assumes rotation about the origin."
      ]
    },
    "guidance": [
      {
        "prompt": "For a 90° counterclockwise rotation, enter cos θ and sin θ.",
        "answer": [
          0,
          1
        ],
        "labels": [
          "cosine",
          "sine"
        ],
        "explanation": "The matrix becomes [[0,−1],[1,0]]."
      },
      {
        "prompt": "For (3,−2), compute −y.",
        "answer": [
          2
        ],
        "labels": [
          "new x"
        ],
        "explanation": "Negating −2 gives +2; the new y is the old x."
      }
    ]
  },
  {
    "id": "q08",
    "title": "Ordered actuators",
    "topic": "Matrix multiplication",
    "tier": "Basic",
    "sector": "Rover Bay",
    "brief": "Compose a stretch and a shear in the correct order.",
    "lesson": "If B acts first and A second, their combined matrix is AB. Matrix multiplication generally depends on order.",
    "prompt": "First apply B=[[2,0],[0,1]], then A=[[1,1],[0,1]]. Enter AB in row-major order.",
    "answer": [
      2,
      1,
      0,
      1
    ],
    "labels": [
      "entry 11",
      "entry 12",
      "entry 21",
      "entry 22"
    ],
    "tolerance": 0.01,
    "hints": [
      "Multiply each row of A by each column of B.",
      "The first column becomes (2,0)."
    ],
    "solution": "AB=[[2,1],[0,1]]. The shear uses the already stretched coordinates.",
    "xp": 100,
    "prereqs": [
      "q06",
      "q07"
    ],
    "teaching": {
      "intuition": "Matrix products compose operations. The rightmost matrix acts on a column vector first, so AB means first B, then A.",
      "steps": [
        "Write the transformation order from right to left.",
        "For each entry of AB, dot a row of A with a column of B.",
        "Enter entries row by row, rather than column by column."
      ],
      "example": {
        "prompt": "B=diag(3,2), A=[[1,2],[0,1]]. Find AB.",
        "steps": [
          "First row against the columns of B gives 3 and 4.",
          "Second row gives 0 and 2."
        ],
        "answer": "AB=[[3,4],[0,2]]."
      },
      "pitfalls": [
        "AB and BA generally differ.",
        "Do not multiply only matching entries; matrix multiplication uses row-column sums."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the first column of AB by applying A to B’s first column (2,0).",
        "answer": [
          2,
          0
        ],
        "labels": [
          "first column top",
          "first column bottom"
        ],
        "explanation": "A(2,0)=(2,0). This is the first column of the product."
      },
      {
        "prompt": "Compute the second column by applying A to (0,1).",
        "answer": [
          1,
          1
        ],
        "labels": [
          "second column top",
          "second column bottom"
        ],
        "explanation": "A(0,1)=(1,1). Interleave the two columns correctly when entering row-major values."
      }
    ]
  },
  {
    "id": "q09",
    "title": "Area certificate",
    "topic": "Determinants",
    "tier": "Basic",
    "sector": "Rover Bay",
    "brief": "Check whether a coordinate map reverses orientation.",
    "lesson": "For [[a,b],[c,d]], det A=ad−bc. Absolute determinant is the area scale; its sign records orientation.",
    "prompt": "A=[[2,1],[3,1]]. Enter det A and its absolute area scale.",
    "answer": [
      -1,
      1
    ],
    "labels": [
      "determinant",
      "area scale"
    ],
    "tolerance": 0.01,
    "hints": [
      "Compute 2·1−1·3.",
      "Area scale cannot be negative."
    ],
    "solution": "det A=2−3=−1, so areas are preserved while orientation reverses.",
    "xp": 100,
    "prereqs": [
      "q08"
    ],
    "teaching": {
      "intuition": "A determinant measures signed area scaling in two dimensions. A negative sign indicates orientation reversal; a zero determinant indicates collapse onto a lower-dimensional set.",
      "steps": [
        "For [[a,b],[c,d]], form ad and bc.",
        "Subtract bc from ad to get the signed determinant.",
        "Take the absolute value to get physical area scaling."
      ],
      "example": {
        "prompt": "Find determinant and area scale for [[1,4],[2,3]].",
        "steps": [
          "ad=3 and bc=8.",
          "det=3−8=−5; its magnitude is 5."
        ],
        "answer": "Determinant −5; area scale 5."
      },
      "pitfalls": [
        "Area scale is nonnegative even when determinant is negative.",
        "For a 2×2 matrix use ad−bc, not ad+bc."
      ]
    },
    "guidance": [
      {
        "prompt": "For A=[[2,1],[3,1]], enter the diagonal products ad and bc.",
        "answer": [
          2,
          3
        ],
        "labels": [
          "ad",
          "bc"
        ],
        "explanation": "The products are 2·1=2 and 1·3=3."
      },
      {
        "prompt": "Subtract these products: ad−bc.",
        "answer": [
          -1
        ],
        "labels": [
          "determinant"
        ],
        "explanation": "A negative determinant means the map reverses orientation. Its magnitude gives the area scale."
      }
    ]
  },
  {
    "id": "q10",
    "title": "Undo calibration",
    "topic": "Matrix inverse",
    "tier": "Basic",
    "sector": "Sensor Array",
    "brief": "Recover two uncalibrated channels.",
    "lesson": "An invertible matrix has a unique inverse. For 2×2 matrices swap the diagonal, negate off-diagonal entries, and divide by the determinant.",
    "prompt": "A=[[2,1],[1,1]]. Enter A inverse in row-major order.",
    "answer": [
      1,
      -1,
      -1,
      2
    ],
    "labels": [
      "inverse 11",
      "inverse 12",
      "inverse 21",
      "inverse 22"
    ],
    "tolerance": 0.01,
    "hints": [
      "The determinant is 1.",
      "The adjugate is [[1,−1],[−1,2]]."
    ],
    "solution": "A⁻¹=[[1,−1],[−1,2]]; multiplying by A gives the identity.",
    "xp": 100,
    "prereqs": [
      "q09"
    ],
    "artifact": {
      "name": "Inverse calibration key",
      "description": "A machined two-channel calibration key. Its paired channels undo mixing and restore the original instrument readings."
    },
    "teaching": {
      "intuition": "An inverse undoes a square linear transformation. It exists only if no nonzero input is collapsed to zero; for 2×2 matrices this is equivalent to a nonzero determinant.",
      "steps": [
        "Compute det A=ad−bc and check that it is nonzero.",
        "Form the adjugate [[d,−b],[−c,a]].",
        "Divide every adjugate entry by det A and check AA⁻¹=I."
      ],
      "example": {
        "prompt": "Invert A=[[3,1],[2,1]].",
        "steps": [
          "det A=3−2=1.",
          "Swap 3 and 1, negate 1 and 2, then divide by 1."
        ],
        "answer": "A⁻¹=[[1,−1],[−2,3]]."
      },
      "pitfalls": [
        "Negate only the off-diagonal entries when forming the adjugate.",
        "A matrix with determinant zero has no ordinary inverse."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the determinant of [[2,1],[1,1]].",
        "answer": [
          1
        ],
        "labels": [
          "determinant"
        ],
        "explanation": "2·1−1·1=1, so inversion is valid."
      },
      {
        "prompt": "Enter the first row of its adjugate.",
        "answer": [
          1,
          -1
        ],
        "labels": [
          "adjugate 11",
          "adjugate 12"
        ],
        "explanation": "The first row is (d,−b)=(1,−1). Division by determinant 1 leaves it unchanged."
      }
    ]
  },
  {
    "id": "q11",
    "title": "Two-loop balance",
    "topic": "Linear systems",
    "tier": "Basic",
    "sector": "Power Grid",
    "brief": "Solve two coupled current constraints.",
    "lesson": "A linear system Ax=b asks which input x produces the measured output b. Elimination combines equations without changing their common solutions.",
    "prompt": "Currents satisfy 2x+y=7 and x−y=2. Enter x and y in amperes.",
    "answer": [
      3,
      1
    ],
    "labels": [
      "current x",
      "current y"
    ],
    "tolerance": 0.01,
    "hints": [
      "Add the two equations to eliminate y.",
      "3x=9."
    ],
    "solution": "Adding yields x=3; then 3−y=2 gives y=1 A.",
    "xp": 100,
    "prereqs": [
      "q06"
    ],
    "teaching": {
      "intuition": "Each equation is a constraint; the solution must obey both at once. Elimination adds a multiple of one equation to another to remove a variable while preserving the common solution.",
      "steps": [
        "Find coefficients that cancel one variable.",
        "Add or subtract the equations and solve the remaining one-variable equation.",
        "Substitute into either original equation, then check both."
      ],
      "example": {
        "prompt": "Solve x+y=8 and x−y=4.",
        "steps": [
          "Add the equations: 2x=12, so x=6.",
          "Substitute into x+y=8 to get y=2."
        ],
        "answer": "x=6, y=2."
      },
      "pitfalls": [
        "Adding equations requires adding both left and right sides.",
        "Check the solution in the original equations to catch sign errors."
      ]
    },
    "guidance": [
      {
        "prompt": "Add 2x+y=7 and x−y=2. Enter the coefficient of x and the right-hand side.",
        "answer": [
          3,
          9
        ],
        "labels": [
          "x coefficient",
          "right-hand side"
        ],
        "explanation": "The y terms cancel; the resulting equation is 3x=9."
      },
      {
        "prompt": "Use x=3 in x−y=2. What is y?",
        "answer": [
          1
        ],
        "labels": [
          "y"
        ],
        "explanation": "3−y=2 implies −y=−1, so y=1."
      }
    ]
  },
  {
    "id": "q12",
    "title": "Three-stage elimination",
    "topic": "Gaussian elimination",
    "tier": "Intermediate",
    "sector": "Power Grid",
    "brief": "Recover three flow rates from nested balances.",
    "lesson": "Back-substitution solves an upper triangular system from its last equation upward.",
    "prompt": "Solve x+2y−z=3, 2y+z=5, and 2z=2. Enter x,y,z.",
    "answer": [
      0,
      2,
      1
    ],
    "labels": [
      "flow x",
      "flow y",
      "flow z"
    ],
    "tolerance": 0.01,
    "hints": [
      "Start with 2z=2.",
      "Then 2y+1=5."
    ],
    "solution": "z=1, y=2, and x=3−4+1=0.",
    "xp": 150,
    "prereqs": [
      "q11"
    ],
    "teaching": {
      "intuition": "An upper triangular system is a chain: the last equation determines the last unknown, which then unlocks the equation above it. This is back-substitution.",
      "steps": [
        "Solve the last equation for z.",
        "Substitute z into the second equation to solve for y.",
        "Substitute both known values into the first equation to solve for x."
      ],
      "example": {
        "prompt": "Solve x+y−z=4, 3y+z=8, and 2z=4.",
        "steps": [
          "2z=4 gives z=2.",
          "3y+2=8 gives y=2; x+2−2=4 gives x=4."
        ],
        "answer": "(x,y,z)=(4,2,2)."
      },
      "pitfalls": [
        "Start at the bottom, not by guessing all variables.",
        "A minus sign before z stays negative when substituting."
      ]
    },
    "guidance": [
      {
        "prompt": "From 2z=2, find z.",
        "answer": [
          1
        ],
        "labels": [
          "z"
        ],
        "explanation": "Divide both sides by 2."
      },
      {
        "prompt": "Insert z=1 into 2y+z=5 and solve for y.",
        "answer": [
          2
        ],
        "labels": [
          "y"
        ],
        "explanation": "2y=4, so y=2. Now use the first equation to finish."
      }
    ]
  },
  {
    "id": "q13",
    "title": "Redundant sensors",
    "topic": "Rank",
    "tier": "Intermediate",
    "sector": "Sensor Array",
    "brief": "Count independent measurements.",
    "lesson": "Rank counts independent columns or rows. A row that is a combination of others adds no new information.",
    "prompt": "A has rows (1,2,3), (2,4,6), (0,1,1). Enter rank(A) and nullity(A).",
    "answer": [
      2,
      1
    ],
    "labels": [
      "rank",
      "nullity"
    ],
    "tolerance": 0.01,
    "hints": [
      "Row 2 is twice row 1.",
      "The independent row count plus nullity equals three columns."
    ],
    "solution": "Rows 1 and 3 are independent, giving rank 2; rank-nullity gives nullity 3−2=1.",
    "xp": 150,
    "prereqs": [
      "q12"
    ],
    "teaching": {
      "intuition": "Rank counts genuinely independent measurements, not the number of rows written down. Nullity counts input directions that remain invisible. Their sum equals the number of input columns.",
      "steps": [
        "Identify proportional or otherwise dependent rows.",
        "Count the independent rows, using elimination if needed.",
        "Subtract rank from the number of columns to obtain nullity."
      ],
      "example": {
        "prompt": "A has rows (1,0,2), (2,0,4), (0,0,0). Find rank and nullity.",
        "steps": [
          "Only the first row provides an independent equation, so rank=1.",
          "There are three columns, so nullity=3−1=2."
        ],
        "answer": "Rank 1; nullity 2."
      },
      "pitfalls": [
        "A nonzero row can still be dependent on another row.",
        "Rank plus nullity equals columns, not necessarily rows."
      ]
    },
    "guidance": [
      {
        "prompt": "Row 2 is what scalar multiple of row 1?",
        "answer": [
          2
        ],
        "labels": [
          "row multiplier"
        ],
        "explanation": "(2,4,6)=2(1,2,3), so row 2 adds no independent information."
      },
      {
        "prompt": "Rows (1,2,3) and (0,1,1) are independent. If rank is 2 and there are 3 columns, find nullity.",
        "answer": [
          1
        ],
        "labels": [
          "nullity"
        ],
        "explanation": "Rank-nullity gives 3−2=1 invisible input direction."
      }
    ]
  },
  {
    "id": "q14",
    "title": "Invisible actuator motion",
    "topic": "Nullspace",
    "tier": "Intermediate",
    "sector": "Rover Bay",
    "brief": "Find an input that sensors cannot detect.",
    "lesson": "The nullspace consists of all x with Ax=0. A nonzero null vector describes an invisible input direction.",
    "prompt": "A has rows (1,2,3), (0,1,1). Find a null vector with third component 1. Enter all three components.",
    "answer": [
      -1,
      -1,
      1
    ],
    "labels": [
      "null x",
      "null y",
      "null z"
    ],
    "tolerance": 0.01,
    "hints": [
      "The second equation gives y=−1.",
      "Substitute into x+2y+3=0."
    ],
    "solution": "z=1 implies y=−1 and x=−1. A(−1,−1,1)=0.",
    "xp": 150,
    "prereqs": [
      "q13"
    ],
    "teaching": {
      "intuition": "A null vector is an actuator combination that produces zero measured output. All its scalar multiples are also invisible, so a prescribed component chooses one representative.",
      "steps": [
        "Set every row-dot-vector output equal to zero.",
        "Use the prescribed component to solve the simpler equation first.",
        "Substitute into the other equation and verify all outputs vanish."
      ],
      "example": {
        "prompt": "A has rows (1,1,1),(0,1,2). Find a null vector with z=2.",
        "steps": [
          "The second row gives y+4=0, so y=−4.",
          "The first gives x−4+2=0, so x=2."
        ],
        "answer": "(2,−4,2)."
      },
      "pitfalls": [
        "The zero vector always belongs to the nullspace but may not meet the normalization.",
        "A null vector is an input; its length equals the number of columns."
      ]
    },
    "guidance": [
      {
        "prompt": "With z=1, solve y+z=0.",
        "answer": [
          -1
        ],
        "labels": [
          "y"
        ],
        "explanation": "The second row equation forces y=−1."
      },
      {
        "prompt": "With y=−1 and z=1, what is 2y+3z?",
        "answer": [
          1
        ],
        "labels": [
          "known terms in row 1"
        ],
        "explanation": "2(−1)+3(1)=1; x must cancel that value for zero output."
      }
    ]
  },
  {
    "id": "q15",
    "title": "Independent toolkit",
    "topic": "Basis and coordinates",
    "tier": "Intermediate",
    "sector": "Rover Bay",
    "brief": "Express a displacement in an oblique frame.",
    "lesson": "A basis is an independent spanning set. Coordinates are coefficients in its linear combination, not necessarily Cartesian coordinates.",
    "prompt": "Basis vectors b₁=(1,1), b₂=(1,−1). Find c₁,c₂ so (4,2)=c₁b₁+c₂b₂.",
    "answer": [
      3,
      1
    ],
    "labels": [
      "coefficient 1",
      "coefficient 2"
    ],
    "tolerance": 0.01,
    "hints": [
      "Use c₁+c₂=4 and c₁−c₂=2.",
      "Add the equations."
    ],
    "solution": "2c₁=6, hence c₁=3 and c₂=1.",
    "xp": 150,
    "prereqs": [
      "q11",
      "q13"
    ],
    "teaching": {
      "intuition": "Coordinates depend on the chosen basis. In an oblique frame, the coordinate numbers say how much of each basis vector to combine; they need not equal the point’s Cartesian coordinates.",
      "steps": [
        "Write the target as c₁b₁+c₂b₂.",
        "Match Cartesian components to obtain a linear system.",
        "Solve for coefficients and reconstruct the target as a check."
      ],
      "example": {
        "prompt": "For b₁=(1,1), b₂=(1,−1), express (6,2).",
        "steps": [
          "Matching coordinates gives c₁+c₂=6 and c₁−c₂=2.",
          "Add to obtain 2c₁=8, then c₂=2."
        ],
        "answer": "Basis coordinates (4,2)."
      },
      "pitfalls": [
        "Do not report the original Cartesian coordinates as basis coefficients.",
        "A basis must be linearly independent and span the space."
      ]
    },
    "guidance": [
      {
        "prompt": "For target (4,2), add c₁+c₂=4 and c₁−c₂=2. Enter the right-hand side of 2c₁.",
        "answer": [
          6
        ],
        "labels": [
          "combined right side"
        ],
        "explanation": "The second coefficient cancels, leaving 2c₁=6."
      },
      {
        "prompt": "Solve 2c₁=6, then c₂=4−c₁.",
        "answer": [
          3,
          1
        ],
        "labels": [
          "c1",
          "c2"
        ],
        "explanation": "The coefficients are 3 and 1; reconstruct 3(1,1)+(1,−1)=(4,2)."
      }
    ]
  },
  {
    "id": "q16",
    "title": "Shared motion plane",
    "topic": "Subspaces and intersections",
    "tier": "Intermediate",
    "sector": "Orbital Dock",
    "brief": "Find motions allowed by two safety constraints.",
    "lesson": "The intersection of homogeneous linear constraints is a subspace. Independent constraints reduce the number of free coordinates.",
    "prompt": "Allowed v=(x,y,z) obey x+y+z=0 and x−y=0. Enter the allowed vector with z=2 as x,y,z. Then enter the dimension of the whole intersection, counted before z is fixed.",
    "answer": [
      -1,
      -1,
      2,
      1
    ],
    "labels": [
      "x",
      "y",
      "z",
      "dimension"
    ],
    "tolerance": 0.01,
    "hints": [
      "The second equation sets x=y.",
      "Then 2x+2=0."
    ],
    "solution": "x=y=−1. Two independent constraints in R³ leave a one-dimensional line.",
    "xp": 150,
    "prereqs": [
      "q14",
      "q15"
    ],
    "teaching": {
      "intuition": "A homogeneous constraint passes through the origin, so its solutions form a subspace. Intersecting independent planes through the origin in three dimensions usually leaves a line.",
      "steps": [
        "Use one equation to express a variable in terms of another.",
        "Substitute into the other constraint and use the prescribed coordinate.",
        "Count free parameters, or subtract independent constraints from ambient dimension."
      ],
      "example": {
        "prompt": "Find vectors satisfying x+y+z=0, x−y=0, with z=−4.",
        "steps": [
          "x=y, so 2x−4=0 and x=y=2.",
          "Two independent constraints in R³ leave one free parameter."
        ],
        "answer": "(2,2,−4); intersection dimension 1."
      },
      "pitfalls": [
        "A selected point with fixed z is not itself the entire subspace.",
        "Subtract the number of independent constraints, not just the number written."
      ]
    },
    "guidance": [
      {
        "prompt": "Use x−y=0 to substitute y=x into x+y+z=0. Enter the resulting coefficient on x and the number of free coordinates after the two independent constraints.",
        "answer": [
          2,
          1
        ],
        "labels": [
          "x coefficient after substitution",
          "free coordinates"
        ],
        "explanation": "Replacing y with x gives x+x+z=2x+z=0, so the x coefficient is 2. Two independent constraints in three coordinates leave one free coordinate; fixing z then selects a particular point on that line."
      },
      {
        "prompt": "Set z=2 and x=y. Solve 2x+2=0; enter x and y.",
        "answer": [
          -1,
          -1
        ],
        "labels": [
          "x",
          "y"
        ],
        "explanation": "Both coordinates are −1. The full intersection still has one free parameter before z is fixed."
      }
    ]
  },
  {
    "id": "q17",
    "title": "Map from probes",
    "topic": "Linear maps",
    "tier": "Intermediate",
    "sector": "Sensor Array",
    "brief": "Reconstruct a linear calibration from basis probes.",
    "lesson": "A linear map is determined by its values on a basis. In standard coordinates these images are the columns of its matrix.",
    "prompt": "T(e₁)=(2,1), T(e₂)=(−1,3). Enter T(3,2).",
    "answer": [
      4,
      9
    ],
    "labels": [
      "output x",
      "output y"
    ],
    "tolerance": 0.01,
    "hints": [
      "Use 3T(e₁)+2T(e₂).",
      "Combine (6,3) and (−2,6)."
    ],
    "solution": "T(3,2)=3(2,1)+2(−1,3)=(4,9).",
    "xp": 150,
    "prereqs": [
      "q06",
      "q15"
    ],
    "teaching": {
      "intuition": "A linear map respects addition and scaling. Knowing its action on each standard basis vector tells you its action on every vector, because every vector is a combination of those basis vectors.",
      "steps": [
        "Write the input as a weighted sum of basis vectors.",
        "Scale each known basis image by the corresponding input coordinate.",
        "Add the scaled output vectors."
      ],
      "example": {
        "prompt": "If T(e₁)=(1,2), T(e₂)=(3,−1), find T(2,1).",
        "steps": [
          "T(2,1)=2T(e₁)+T(e₂).",
          "Combine (2,4)+(3,−1)."
        ],
        "answer": "T(2,1)=(5,3)."
      },
      "pitfalls": [
        "Images of standard basis vectors form matrix columns, not rows.",
        "This method assumes T is linear; a separate translation would violate it."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute 3T(e₁) when T(e₁)=(2,1).",
        "answer": [
          6,
          3
        ],
        "labels": [
          "first image x",
          "first image y"
        ],
        "explanation": "Scale both coordinates by the input coefficient 3."
      },
      {
        "prompt": "Compute 2T(e₂) when T(e₂)=(−1,3).",
        "answer": [
          -2,
          6
        ],
        "labels": [
          "second image x",
          "second image y"
        ],
        "explanation": "Scale both coordinates by 2, then add this vector to the first scaled image."
      }
    ]
  },
  {
    "id": "q18",
    "title": "Project a load",
    "topic": "Orthogonal projection",
    "tier": "Intermediate",
    "sector": "Orbital Dock",
    "brief": "Isolate force along a support rail.",
    "lesson": "The projection onto nonzero u is u(u·v)/(u·u). The residual is perpendicular to u.",
    "prompt": "Project v=(4,2) onto the line spanned by u=(1,1). Enter the projected x,y.",
    "answer": [
      3,
      3
    ],
    "labels": [
      "projection x",
      "projection y"
    ],
    "tolerance": 0.01,
    "hints": [
      "u·v=6 and u·u=2.",
      "Multiply u by 3."
    ],
    "solution": "projᵤv=(6/2)(1,1)=(3,3); residual (1,−1) is perpendicular to u.",
    "xp": 150,
    "prereqs": [
      "q03",
      "q15"
    ],
    "teaching": {
      "intuition": "An orthogonal projection is the closest point on a line to a vector. The leftover residual points sideways to that line and has zero dot product with its direction.",
      "steps": [
        "Compute u·v and u·u.",
        "Divide to get the coefficient α=(u·v)/(u·u).",
        "Multiply u by α; check the residual v−αu is perpendicular to u."
      ],
      "example": {
        "prompt": "Project v=(5,1) onto u=(2,0).",
        "steps": [
          "u·v=10 and u·u=4, giving α=2.5.",
          "αu=(5,0); residual (0,1) is perpendicular to u."
        ],
        "answer": "Projection (5,0)."
      },
      "pitfalls": [
        "Divide by u·u, not by ‖u‖, unless using a unit vector formulation.",
        "The spanning direction u must be nonzero."
      ]
    },
    "guidance": [
      {
        "prompt": "For u=(1,1), v=(4,2), compute u·v and u·u.",
        "answer": [
          6,
          2
        ],
        "labels": [
          "numerator",
          "denominator"
        ],
        "explanation": "The dot products are 4+2=6 and 1+1=2."
      },
      {
        "prompt": "Find α=6/2, then the projected x coordinate α·1.",
        "answer": [
          3,
          3
        ],
        "labels": [
          "projection coefficient",
          "projection x"
        ],
        "explanation": "The same coefficient multiplies the y coordinate of u as well."
      }
    ]
  },
  {
    "id": "q19",
    "title": "Build orthonormal axes",
    "topic": "Gram–Schmidt",
    "tier": "Intermediate",
    "sector": "Sensor Array",
    "brief": "Remove overlap between two measurement channels.",
    "lesson": "Gram–Schmidt subtracts projections onto previous orthonormal directions, then normalizes the residual.",
    "prompt": "Let a₁=(1,0,0), a₂=(1,2,0). After Gram–Schmidt, enter q₂.",
    "answer": [
      0,
      1,
      0
    ],
    "labels": [
      "q2 x",
      "q2 y",
      "q2 z"
    ],
    "tolerance": 0.01,
    "hints": [
      "Subtract the projection (1,0,0) from a₂.",
      "Normalize (0,2,0)."
    ],
    "solution": "q₁=(1,0,0); a₂−(q₁·a₂)q₁=(0,2,0), so q₂=(0,1,0).",
    "xp": 150,
    "prereqs": [
      "q18",
      "q02"
    ],
    "teaching": {
      "intuition": "Gram–Schmidt turns independent directions into perpendicular unit directions without changing their span. Subtracting a projection removes the part already explained by earlier axes.",
      "steps": [
        "Normalize the first vector to obtain q₁.",
        "Subtract (q₁·a₂)q₁ from a₂.",
        "Normalize the nonzero residual to obtain q₂."
      ],
      "example": {
        "prompt": "Apply Gram–Schmidt to a₁=(0,2,0), a₂=(3,1,0).",
        "steps": [
          "q₁=(0,1,0); projection of a₂ onto q₁ is (0,1,0).",
          "Residual is (3,0,0), with length 3."
        ],
        "answer": "q₂=(1,0,0)."
      },
      "pitfalls": [
        "Normalize after subtracting the projection.",
        "A zero residual means dependence; it cannot be normalized into a new direction."
      ]
    },
    "guidance": [
      {
        "prompt": "For q₁=(1,0,0), a₂=(1,2,0), compute q₁·a₂.",
        "answer": [
          1
        ],
        "labels": [
          "projection coefficient"
        ],
        "explanation": "Only the first coordinate contributes."
      },
      {
        "prompt": "Subtract the projection (1,0,0) from a₂. Enter the residual and its length.",
        "answer": [
          0,
          2,
          0,
          2
        ],
        "labels": [
          "residual x",
          "residual y",
          "residual z",
          "residual length"
        ],
        "explanation": "The residual is (0,2,0), whose Euclidean length is 2. Divide by 2 to get q₂."
      }
    ]
  },
  {
    "id": "q20",
    "title": "Noisy constant signal",
    "topic": "Least squares",
    "tier": "Intermediate",
    "sector": "Sensor Array",
    "brief": "Estimate a fixed signal from noisy samples.",
    "lesson": "Least squares minimizes the sum of squared residuals. A constant fit equals the sample mean.",
    "prompt": "A constant voltage c is fitted to measurements 2,4,9 V with equal weights. Enter c and the sum of squared residuals.",
    "answer": [
      5,
      26
    ],
    "labels": [
      "fitted voltage",
      "squared error"
    ],
    "tolerance": 0.01,
    "hints": [
      "Average all three samples.",
      "Residuals are −3,−1,4."
    ],
    "solution": "c=15/3=5 V. Squared error=9+1+16=26 V².",
    "xp": 150,
    "prereqs": [
      "q18"
    ],
    "teaching": {
      "intuition": "When repeated measurements disagree, least squares chooses the constant that balances their signed residuals. With equal weights this balancing point is the ordinary mean.",
      "steps": [
        "Add all measurements and divide by their count.",
        "Subtract the fitted constant from every measurement.",
        "Square those residuals and sum them to quantify fit error."
      ],
      "example": {
        "prompt": "Fit a constant to 1,3,8 V.",
        "steps": [
          "The mean is 12/3=4 V.",
          "Residuals are −3,−1,4 V, whose squares sum to 9+1+16."
        ],
        "answer": "Fitted value 4 V; squared error 26 V²."
      },
      "pitfalls": [
        "Sum of squared residuals differs from mean squared error, which divides by the count.",
        "Residual signs disappear only after squaring."
      ]
    },
    "guidance": [
      {
        "prompt": "Sum the three readings 2,4,9 and enter the count.",
        "answer": [
          15,
          3
        ],
        "labels": [
          "sum",
          "count"
        ],
        "explanation": "The equal-weight least-squares constant is their sum divided by their count."
      },
      {
        "prompt": "For fitted value 5, enter squared residuals from readings 2 and 4.",
        "answer": [
          9,
          1
        ],
        "labels": [
          "first squared residual",
          "second squared residual"
        ],
        "explanation": "(2−5)²=9 and (4−5)²=1. Add the third squared residual to finish."
      }
    ]
  },
  {
    "id": "q21",
    "title": "Trend from telemetry",
    "topic": "Normal equations",
    "tier": "Intermediate",
    "sector": "Sensor Array",
    "brief": "Fit a line to three noisy observations.",
    "lesson": "For a full column rank design A, least squares solves AᵀAx=Aᵀb. The residual is orthogonal to the design columns.",
    "prompt": "Fit y=a+bt to samples (t,y)=(0,1),(1,2),(2,2). Enter a and b.",
    "answer": [
      1.1666666666666667,
      0.5
    ],
    "labels": [
      "intercept a",
      "slope b"
    ],
    "tolerance": 0.01,
    "hints": [
      "The normal equations are 3a+3b=5 and 3a+5b=6.",
      "Subtract them to get 2b=1."
    ],
    "solution": "b=1/2; 3a=5−3/2=7/2, so a=7/6.",
    "xp": 150,
    "prereqs": [
      "q20",
      "q12"
    ],
    "teaching": {
      "intuition": "A fitted line chooses an intercept a and slope b to reconcile all points together. The normal equations force the residual to be perpendicular to the constant column and the time column. Here Aᵀ means the transpose: swap rows and columns. The column of ones encodes the intercept; the time column encodes the slope.",
      "steps": [
        "Build design rows (1,t) and parameter vector (a,b).",
        "Form AᵀA and Aᵀy, then solve their 2×2 system.",
        "Report intercept first, then slope; slope has output units per time unit."
      ],
      "example": {
        "prompt": "Fit y=a+bt to (0,2),(1,2),(2,5).",
        "steps": [
          "Normal equations: 3a+3b=9 and 3a+5b=12.",
          "Subtract to get 2b=3; then a=1.5."
        ],
        "answer": "a=1.5, b=1.5."
      },
      "pitfalls": [
        "Normal equations need full column rank for a unique parameter solution.",
        "The fitted line need not pass through every noisy observation."
      ]
    },
    "guidance": [
      {
        "prompt": "For times 0,1,2, enter Σ1, Σt, and Σt².",
        "answer": [
          3,
          3,
          5
        ],
        "labels": [
          "sample count",
          "sum times",
          "sum squared times"
        ],
        "explanation": "These define AᵀA=[[3,3],[3,5]]."
      },
      {
        "prompt": "For y=1,2,2, enter Σy and Σty.",
        "answer": [
          5,
          6
        ],
        "labels": [
          "sum y",
          "sum time times y"
        ],
        "explanation": "Σy=5 and Σty=0·1+1·2+2·2=6, the right-hand side of the normal equations."
      }
    ]
  },
  {
    "id": "q22",
    "title": "QR engine",
    "topic": "QR factorization",
    "tier": "Intermediate",
    "sector": "Sensor Array",
    "brief": "Factor a tall calibration matrix without squaring its condition number.",
    "lesson": "For thin QR, A=QR with orthonormal columns in Q and upper triangular R. Entries rᵢⱼ=qᵢ·aⱼ.",
    "prompt": "A has columns (1,0,0) and (1,2,0). Using positive diagonal R, enter r₁₁,r₁₂,r₂₂.",
    "answer": [
      1,
      1,
      2
    ],
    "labels": [
      "R11",
      "R12",
      "R22"
    ],
    "tolerance": 0.01,
    "hints": [
      "Use the axes from Gram–Schmidt.",
      "Q columns are (1,0,0) and (0,1,0)."
    ],
    "solution": "Dot products give R=[[1,1],[0,2]], with Q the first two coordinate axes.",
    "xp": 150,
    "prereqs": [
      "q19",
      "q21"
    ],
    "artifact": {
      "name": "Orthogonal array prism",
      "description": "A sensor-bay prism whose perpendicular faces represent the Q directions, with etched R coefficients preserving the original calibration."
    },
    "teaching": {
      "intuition": "QR separates direction from scale and overlap. Q contains perpendicular unit directions; R stores how the original columns combine those directions. Thin QR retains only the needed columns of Q. The notation QᵀQ=I says the columns of Q have unit length and zero pairwise dot products; I is the identity map.",
      "steps": [
        "Use Gram–Schmidt to obtain orthonormal columns q₁,q₂.",
        "Compute r₁₁=q₁·a₁ and r₁₂=q₁·a₂.",
        "Compute r₂₂=q₂·a₂ and choose positive diagonal entries for this convention."
      ],
      "example": {
        "prompt": "Find thin QR for columns a₁=(2,0,0), a₂=(3,4,0).",
        "steps": [
          "q₁=(1,0,0), q₂=(0,1,0).",
          "Dot products give r₁₁=2, r₁₂=3, r₂₂=4."
        ],
        "answer": "R=[[2,3],[0,4]] and Q has columns e₁,e₂."
      },
      "pitfalls": [
        "R is triangular; its lower-left entry is zero.",
        "Positive diagonal fixes sign choices here, assuming independent columns."
      ]
    },
    "guidance": [
      {
        "prompt": "Using q₁=(1,0,0), compute q₁·a₁ and q₁·a₂.",
        "answer": [
          1,
          1
        ],
        "labels": [
          "R11",
          "R12"
        ],
        "explanation": "These are the top row coefficients of R."
      },
      {
        "prompt": "Using q₂=(0,1,0), compute q₂·a₂ for a₂=(1,2,0).",
        "answer": [
          2
        ],
        "labels": [
          "R22"
        ],
        "explanation": "The second orthonormal axis extracts the second coordinate, giving 2."
      }
    ]
  },
  {
    "id": "q23",
    "title": "Natural growth modes",
    "topic": "Eigenvalues",
    "tier": "Intermediate",
    "sector": "Dynamics Lab",
    "brief": "Identify independent amplification rates.",
    "lesson": "An eigenvector preserves its direction under A; its eigenvalue is the scale factor. Eigenvalues solve det(A−λI)=0.",
    "prompt": "For A=[[3,1],[0,2]], enter its eigenvalues in ascending order.",
    "answer": [
      2,
      3
    ],
    "labels": [
      "smaller eigenvalue",
      "larger eigenvalue"
    ],
    "tolerance": 0.01,
    "hints": [
      "A triangular matrix has its diagonal entries as eigenvalues.",
      "The characteristic polynomial is (3−λ)(2−λ)."
    ],
    "solution": "The roots are λ=2 and λ=3.",
    "xp": 150,
    "prereqs": [
      "q09",
      "q17"
    ],
    "teaching": {
      "intuition": "Most directions change direction under a matrix, but eigenvector directions only scale. Eigenvalues are the possible scale factors; triangular matrices expose them on their diagonal.",
      "steps": [
        "Form A−λI by subtracting λ from each diagonal entry.",
        "Set its determinant equal to zero.",
        "For triangular matrices, solve the product of diagonal factors and sort as requested."
      ],
      "example": {
        "prompt": "Find the eigenvalues of [[4,2],[0,−1]].",
        "steps": [
          "The characteristic equation is (4−λ)(−1−λ)=0.",
          "Each factor can vanish independently."
        ],
        "answer": "Eigenvalues in ascending order: −1,4."
      },
      "pitfalls": [
        "The off-diagonal entry does not change eigenvalues of a triangular matrix.",
        "Eigenvalues may be negative or complex for general matrices."
      ]
    },
    "guidance": [
      {
        "prompt": "For A=[[3,1],[0,2]], enter its two diagonal entries in their original order.",
        "answer": [
          3,
          2
        ],
        "labels": [
          "first diagonal",
          "second diagonal"
        ],
        "explanation": "Because A is triangular, these are its eigenvalues."
      },
      {
        "prompt": "Evaluate det(A−2I).",
        "answer": [
          0
        ],
        "labels": [
          "determinant at lambda 2"
        ],
        "explanation": "One diagonal factor is 2−2=0, so the determinant vanishes and 2 is an eigenvalue."
      }
    ]
  },
  {
    "id": "q24",
    "title": "Mode shape",
    "topic": "Eigenvectors",
    "tier": "Intermediate",
    "sector": "Dynamics Lab",
    "brief": "Recover a vibration direction from its rate.",
    "lesson": "For known λ solve (A−λI)v=0. Eigenvectors may be rescaled, so a normalization constraint makes the answer unique.",
    "prompt": "For A=[[3,1],[0,2]] and λ=2, find an eigenvector with y=1. Enter x,y.",
    "answer": [
      -1,
      1
    ],
    "labels": [
      "eigenvector x",
      "eigenvector y"
    ],
    "tolerance": 0.01,
    "hints": [
      "The first row gives x+y=0.",
      "Use y=1."
    ],
    "solution": "(A−2I)v=0 gives x=−y. Thus v=(−1,1), and Av=(−2,2)=2v.",
    "xp": 150,
    "prereqs": [
      "q23",
      "q14"
    ],
    "teaching": {
      "intuition": "An eigenvector for λ is a nonzero vector that becomes zero under A−λI. Its scale is arbitrary, so the specified y coordinate selects a unique representative here.",
      "steps": [
        "Subtract λ from A’s diagonal.",
        "Solve the resulting homogeneous equations.",
        "Apply the given coordinate normalization and check Av=λv."
      ],
      "example": {
        "prompt": "For A=[[4,2],[0,2]] and λ=2, find an eigenvector with y=3.",
        "steps": [
          "A−2I=[[2,2],[0,0]], so x+y=0.",
          "Set y=3, giving x=−3."
        ],
        "answer": "v=(−3,3); Av=(−6,6)=2v."
      },
      "pitfalls": [
        "The zero vector is never an eigenvector.",
        "Normalize only after deriving the relation between coordinates."
      ]
    },
    "guidance": [
      {
        "prompt": "For A−2I, enter the first row.",
        "answer": [
          1,
          1
        ],
        "labels": [
          "first-row x coefficient",
          "first-row y coefficient"
        ],
        "explanation": "Subtracting 2 from the diagonal gives [[1,1],[0,0]]."
      },
      {
        "prompt": "With y=1, solve x+1=0.",
        "answer": [
          -1
        ],
        "labels": [
          "x"
        ],
        "explanation": "x must be −1. The second row adds no restriction."
      }
    ]
  },
  {
    "id": "q25",
    "title": "Fast repeated dynamics",
    "topic": "Diagonalization",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Advance a state using its independent modes.",
    "lesson": "If A=PDP⁻¹, then Aⁿ=PDⁿP⁻¹. Raising diagonal eigenvalues to powers advances each mode separately.",
    "prompt": "A=[[3,1],[0,2]], x₀=(0,1). Enter x₃=A³x₀.",
    "answer": [
      19,
      8
    ],
    "labels": [
      "state x",
      "state y"
    ],
    "tolerance": 0.01,
    "hints": [
      "One step gives (1,2); two give (5,4).",
      "The third step is (3·5+4,2·4)."
    ],
    "solution": "x₁=(1,2), x₂=(5,4), x₃=(19,8). Equivalently x₀=(1,0)+(−1,1), so x₃=27(1,0)+8(−1,1).",
    "xp": 200,
    "prereqs": [
      "q24",
      "q10"
    ],
    "teaching": {
      "intuition": "In an eigenbasis, repeated updates act independently on each mode. You raise each mode’s eigenvalue to the step count, then combine the modes back in the original frame. An eigenvector v obeys Av=λv: the number λ is its scale factor. P contains a basis of those vectors, and D has their scale factors on its diagonal.",
      "steps": [
        "Write the initial state as a combination of eigenvectors, or advance it directly for a small exponent.",
        "Raise each eigenvalue to the number of updates.",
        "Recombine the scaled modes and check against a direct update."
      ],
      "example": {
        "prompt": "For A=diag(2,3) and x₀=(1,2), find x₂.",
        "steps": [
          "The axes are eigenvectors with eigenvalues 2 and 3.",
          "After two steps the coordinates are 2²·1 and 3²·2."
        ],
        "answer": "x₂=(4,18)."
      },
      "pitfalls": [
        "Aⁿ is a matrix product, not an entrywise power.",
        "Diagonalization requires a full basis of eigenvectors; not every matrix has one."
      ]
    },
    "guidance": [
      {
        "prompt": "Advance x₀=(0,1) once under A=[[3,1],[0,2]].",
        "answer": [
          1,
          2
        ],
        "labels": [
          "x1 first",
          "x1 second"
        ],
        "explanation": "Multiply each row by (0,1) to get x₁=(1,2)."
      },
      {
        "prompt": "Advance x₁=(1,2) once more.",
        "answer": [
          5,
          4
        ],
        "labels": [
          "x2 first",
          "x2 second"
        ],
        "explanation": "x₂=(3·1+2,2·2)=(5,4). One final multiplication gives x₃."
      }
    ]
  },
  {
    "id": "q26",
    "title": "Symmetric mode splitter",
    "topic": "Spectral theorem",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Separate orthogonal modes of a coupled device.",
    "lesson": "Every real symmetric matrix has an orthonormal eigenbasis and real eigenvalues. This allows energy to split cleanly across perpendicular modes.",
    "prompt": "A=[[2,1],[1,2]]. For normalized mode q=(1,1)/√2, enter its eigenvalue and the other eigenvalue.",
    "answer": [
      3,
      1
    ],
    "labels": [
      "q eigenvalue",
      "other eigenvalue"
    ],
    "tolerance": 0.01,
    "hints": [
      "A(1,1)=(3,3).",
      "The trace equals the sum of the two eigenvalues."
    ],
    "solution": "q has eigenvalue 3. The perpendicular direction (1,−1)/√2 has eigenvalue 1.",
    "xp": 200,
    "prereqs": [
      "q24",
      "q19"
    ],
    "teaching": {
      "intuition": "Symmetry guarantees a particularly clean modal description: real eigenvalues and mutually perpendicular eigenvectors. Normalizing those vectors produces an orthogonal coordinate change. Orthonormal means mutually perpendicular and unit length. Aᵀ=A defines a real symmetric matrix, where transpose Aᵀ swaps its rows and columns.",
      "steps": [
        "Apply the matrix to the stated candidate mode.",
        "Find the common scale factor to identify its eigenvalue.",
        "Use a perpendicular mode or trace to find the remaining eigenvalue."
      ],
      "example": {
        "prompt": "For S=[[5,2],[2,5]], find eigenvalues along (1,1) and (1,−1).",
        "steps": [
          "S(1,1)=(7,7), so the equal-coordinate mode has eigenvalue 7.",
          "S(1,−1)=(3,−3), so the opposite-coordinate mode has eigenvalue 3."
        ],
        "answer": "Eigenvalues 7 and 3, with orthonormal modes after division by √2."
      },
      "pitfalls": [
        "The spectral theorem here assumes a real symmetric matrix.",
        "Dividing an eigenvector by its norm changes its length, not its eigenvalue."
      ]
    },
    "guidance": [
      {
        "prompt": "Apply A=[[2,1],[1,2]] to (1,1).",
        "answer": [
          3,
          3
        ],
        "labels": [
          "output first",
          "output second"
        ],
        "explanation": "The result is three times the input direction."
      },
      {
        "prompt": "Compute trace(A), the sum of diagonal entries.",
        "answer": [
          4
        ],
        "labels": [
          "trace"
        ],
        "explanation": "The two eigenvalues must sum to 4, so knowing one determines the other."
      }
    ]
  },
  {
    "id": "q27",
    "title": "Stretch spectrum",
    "topic": "Singular value decomposition",
    "tier": "Advanced",
    "sector": "Sensor Array",
    "brief": "Measure strongest and weakest signal amplification.",
    "lesson": "Singular values are square roots of eigenvalues of AᵀA. They are nonnegative and describe stretching between orthonormal input and output directions.",
    "prompt": "A=[[3,0],[0,−2],[0,0]]. Enter its singular values in descending order.",
    "answer": [
      3,
      2
    ],
    "labels": [
      "largest singular value",
      "second singular value"
    ],
    "tolerance": 0.01,
    "hints": [
      "AᵀA=diag(9,4).",
      "Take nonnegative square roots."
    ],
    "solution": "AᵀA has eigenvalues 9 and 4; singular values are 3 and 2.",
    "xp": 200,
    "prereqs": [
      "q26",
      "q22"
    ],
    "artifact": {
      "name": "Singular spectrum lens",
      "description": "An adjustable survey lens engraved with principal stretch factors. It reveals which input directions amplify signal and which conceal it."
    },
    "teaching": {
      "intuition": "SVD finds perpendicular input directions and their output stretches, even when the matrix is rectangular. Singular values describe lengths, so they are always nonnegative. Here Aᵀ is the transpose, obtained by swapping rows and columns. An eigenvalue μ of AᵀA satisfies (AᵀA)v=μv for a nonzero direction v; its square root is a singular value.",
      "steps": [
        "Form the square symmetric matrix AᵀA.",
        "Find its eigenvalues, which are nonnegative.",
        "Take nonnegative square roots and sort from largest to smallest."
      ],
      "example": {
        "prompt": "Find singular values of A=[[4,0],[0,−1],[0,0]].",
        "steps": [
          "AᵀA=diag(16,1).",
          "Its eigenvalues are 16 and 1, so their square roots are 4 and 1."
        ],
        "answer": "Singular values 4,1."
      },
      "pitfalls": [
        "A negative diagonal entry of A does not imply a negative singular value.",
        "Use AᵀA, not A², for a general rectangular matrix."
      ]
    },
    "guidance": [
      {
        "prompt": "For the mission A, enter the diagonal of AᵀA.",
        "answer": [
          9,
          4
        ],
        "labels": [
          "Gram diagonal 1",
          "Gram diagonal 2"
        ],
        "explanation": "The squared column lengths are 3²=9 and (−2)²=4; columns are perpendicular."
      },
      {
        "prompt": "Take the nonnegative square root of the larger eigenvalue 9.",
        "answer": [
          3
        ],
        "labels": [
          "largest singular value"
        ],
        "explanation": "The largest stretch is 3; take the square root of 4 for the other stretch."
      }
    ]
  },
  {
    "id": "q28",
    "title": "Compress the survey",
    "topic": "Principal component analysis",
    "tier": "Advanced",
    "sector": "Sensor Array",
    "brief": "Choose the most informative survey axis.",
    "lesson": "PCA diagonalizes the covariance matrix. The leading eigenvector maximizes variance captured by a unit direction.",
    "prompt": "A centered survey has covariance [[4,0],[0,1]]. Enter the fraction of total variance captured by the first principal component and its x,y unit direction with positive x.",
    "answer": [
      0.8,
      1,
      0
    ],
    "labels": [
      "variance fraction",
      "direction x",
      "direction y"
    ],
    "tolerance": 0.01,
    "hints": [
      "Total variance is the trace, 5.",
      "The largest eigenvalue is 4 along the x axis."
    ],
    "solution": "The x axis captures 4/(4+1)=0.8 of the variance; direction (1,0).",
    "xp": 200,
    "prereqs": [
      "q26",
      "q27"
    ],
    "teaching": {
      "intuition": "PCA looks for the direction in which centered observations vary most. Covariance eigenvalues measure variance along principal axes; their sum is total variance. A covariance matrix records coordinate variances on its diagonal and pairwise covariances off the diagonal. Its trace is the sum of diagonal entries.",
      "steps": [
        "Verify that covariance describes centered data.",
        "Find its largest eigenvalue and a corresponding unit eigenvector.",
        "Divide that eigenvalue by the trace to obtain the retained variance fraction."
      ],
      "example": {
        "prompt": "Covariance is diag(6,2). Find the first PCA direction and retained fraction.",
        "steps": [
          "The largest eigenvalue is 6 along the x axis.",
          "Total variance is 6+2=8; fraction is 6/8."
        ],
        "answer": "Direction (1,0); retained fraction 0.75."
      },
      "pitfalls": [
        "Variance fraction is a number between 0 and 1, not an eigenvalue itself.",
        "PCA depends on feature scales; covariance PCA assumes the supplied units/scaling are intended."
      ]
    },
    "guidance": [
      {
        "prompt": "For covariance diag(4,1), enter total variance and largest eigenvalue.",
        "answer": [
          5,
          4
        ],
        "labels": [
          "total variance",
          "leading variance"
        ],
        "explanation": "The trace is 5 and the leading eigenvalue is 4."
      },
      {
        "prompt": "Which positive unit x direction corresponds to the leading diagonal entry?",
        "answer": [
          1,
          0
        ],
        "labels": [
          "direction x",
          "direction y"
        ],
        "explanation": "The x axis is the principal direction because its variance 4 exceeds y variance 1."
      }
    ]
  },
  {
    "id": "q29",
    "title": "Minimum-effort recovery",
    "topic": "Pseudoinverse",
    "tier": "Advanced",
    "sector": "Rover Bay",
    "brief": "Distribute demand across redundant actuators.",
    "lesson": "The Moore–Penrose pseudoinverse chooses the least Euclidean norm solution among exact solutions when the system is underdetermined.",
    "prompt": "Two equal actuators satisfy x₁+x₂=6. Enter the minimum-norm solution x₁,x₂.",
    "answer": [
      3,
      3
    ],
    "labels": [
      "actuator 1",
      "actuator 2"
    ],
    "tolerance": 0.01,
    "hints": [
      "By symmetry, equal sharing is the candidate.",
      "Minimize x₁²+(6−x₁)²."
    ],
    "solution": "The derivative 4x₁−12 vanishes at x₁=3; x₂=3. A⁺=(1/2,1/2)ᵀ.",
    "xp": 200,
    "prereqs": [
      "q27",
      "q20"
    ],
    "teaching": {
      "intuition": "Redundant actuators allow many exact solutions. The pseudoinverse chooses the solution with smallest sum of squared actuator commands, which means equal sharing for two identical actuators. The Euclidean norm is √(x₁²+x₂²); minimizing it is equivalent to minimizing its square. A⁺ denotes the Moore–Penrose pseudoinverse.",
      "steps": [
        "Express one actuator in terms of the other using the demand equation.",
        "Minimize the sum of squared commands, or use symmetry for identical actuators.",
        "Check that commands sum to the required demand."
      ],
      "example": {
        "prompt": "Find the minimum-norm solution of x₁+x₂=10.",
        "steps": [
          "Let x₂=10−x₁; minimize x₁²+(10−x₁)².",
          "Its derivative is 4x₁−20, so x₁=5."
        ],
        "answer": "(x₁,x₂)=(5,5)."
      },
      "pitfalls": [
        "Minimum Euclidean norm is equivalent to minimum squared norm, not minimum signed sum.",
        "Equal sharing relies on equal actuator coefficients and equal effort weights."
      ]
    },
    "guidance": [
      {
        "prompt": "Write x₂=6−x₁. At equal sharing, what is x₁?",
        "answer": [
          3
        ],
        "labels": [
          "first actuator"
        ],
        "explanation": "The symmetry condition x₁=x₂ turns the constraint into 2x₁=6."
      },
      {
        "prompt": "For x₁=3, compute x₂ and the squared norm x₁²+x₂².",
        "answer": [
          3,
          18
        ],
        "labels": [
          "second actuator",
          "squared norm"
        ],
        "explanation": "The solution meets demand 6 with squared norm 9+9=18."
      }
    ]
  },
  {
    "id": "q30",
    "title": "Fragile calibration",
    "topic": "Condition number",
    "tier": "Advanced",
    "sector": "Sensor Array",
    "brief": "Identify a measurement direction that magnifies error.",
    "lesson": "For full rank A, κ₂(A)=σmax/σmin. A large ratio means some relative input errors can be greatly amplified in solving Ax=b.",
    "prompt": "A=diag(10,0.1). Enter κ₂(A). If b=(10,0.1), then its second coordinate rises to 0.11; enter the new solution x₂.",
    "answer": [
      100,
      1.1
    ],
    "labels": [
      "condition number",
      "new x2"
    ],
    "tolerance": 0.01,
    "hints": [
      "The singular values are 10 and 0.1.",
      "The second equation is 0.1x₂=0.11."
    ],
    "solution": "κ₂=10/0.1=100. The perturbed second equation gives x₂=1.1.",
    "xp": 200,
    "prereqs": [
      "q27",
      "q10"
    ],
    "teaching": {
      "intuition": "Condition number compares the strongest and weakest stretch. A weakly measured direction can cause large changes in the recovered solution when measurements are perturbed. The subscript 2 indicates the Euclidean length-based norm; σ denotes a singular value, the nonnegative stretch of an orthonormal input direction.",
      "steps": [
        "Find largest and smallest nonzero singular values.",
        "Divide to get κ₂; a singular matrix has infinite condition number in this convention.",
        "For the requested perturbation, solve the affected scalar equation directly."
      ],
      "example": {
        "prompt": "A=diag(8,0.2). Find κ₂ and x₂ if b₂=0.24.",
        "steps": [
          "Singular values are 8 and 0.2, so κ₂=40.",
          "The second equation is 0.2x₂=0.24, so x₂=1.2."
        ],
        "answer": "κ₂=40; x₂=1.2."
      },
      "pitfalls": [
        "Condition number is a worst-case relative sensitivity measure, not the exact error for every perturbation.",
        "Divide by the small diagonal coefficient when solving; do not multiply by it."
      ]
    },
    "guidance": [
      {
        "prompt": "For diag(10,0.1), enter largest and smallest singular values.",
        "answer": [
          10,
          0.1
        ],
        "labels": [
          "largest stretch",
          "smallest stretch"
        ],
        "explanation": "Positive diagonal entries are the singular values here."
      },
      {
        "prompt": "What is the absolute change in b₂ from 0.1 to 0.11, and the new x₂?",
        "answer": [
          0.01,
          1.1
        ],
        "labels": [
          "measurement change",
          "new solution x2"
        ],
        "explanation": "The change is 0.01; dividing new b₂ by 0.1 gives x₂=1.1."
      }
    ]
  },
  {
    "id": "q31",
    "title": "Elastic energy",
    "topic": "Quadratic forms",
    "tier": "Intermediate",
    "sector": "Dynamics Lab",
    "brief": "Evaluate stored energy in a coupled spring model.",
    "lesson": "For symmetric K, elastic energy is ½xᵀKx. Off-diagonal terms contribute twice inside xᵀKx.",
    "prompt": "K=[[4,1],[1,2]] N/m and x=(1,2) m. Enter xᵀKx and the elastic energy.",
    "answer": [
      16,
      8
    ],
    "labels": [
      "quadratic form",
      "energy joules"
    ],
    "tolerance": 0.01,
    "hints": [
      "Kx=(6,5).",
      "Dot (1,2) with (6,5)."
    ],
    "solution": "xᵀKx=6+10=16; stored energy is 8 J.",
    "xp": 150,
    "prereqs": [
      "q06",
      "q03"
    ],
    "teaching": {
      "intuition": "A quadratic form combines displacement with stiffness to describe stored energy. Off-diagonal stiffness couples different coordinates. The physical elastic energy includes a factor of one half. The notation xᵀ means the row vector formed by transposing the column x. Thus xᵀKx is a row-times-column scalar, not a matrix of coordinate squares.",
      "steps": [
        "Multiply K by displacement x to obtain the restoring-load magnitude vector Kx.",
        "Dot x with Kx to get the scalar quadratic form.",
        "Multiply by 1/2 to obtain elastic energy in joules."
      ],
      "example": {
        "prompt": "For K=[[2,1],[1,3]] N/m and x=(2,1) m, find elastic energy.",
        "steps": [
          "Kx=(5,5) N.",
          "xᵀKx=2·5+1·5=15 J; energy is half."
        ],
        "answer": "Elastic energy 7.5 J."
      },
      "pitfalls": [
        "xᵀKx is twice the elastic energy in this model.",
        "The standard stiffness-energy interpretation assumes symmetric K."
      ]
    },
    "guidance": [
      {
        "prompt": "For mission K and x, compute Kx.",
        "answer": [
          6,
          5
        ],
        "labels": [
          "Kx first",
          "Kx second"
        ],
        "explanation": "The rows give 4·1+1·2=6 and 1·1+2·2=5 N."
      },
      {
        "prompt": "Dot x=(1,2) with (6,5).",
        "answer": [
          16
        ],
        "labels": [
          "quadratic form"
        ],
        "explanation": "1·6+2·5=16 J; halve it to obtain stored energy."
      }
    ]
  },
  {
    "id": "q32",
    "title": "Stable stiffness",
    "topic": "Positive definiteness",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Certify that every nonzero displacement stores positive energy.",
    "lesson": "A symmetric 2×2 matrix is positive definite exactly when its first leading principal minor and determinant are positive (Sylvester criterion).",
    "prompt": "K=[[4,1],[1,2]]. Enter its first leading principal minor, determinant, and 1 if positive definite or 0 otherwise.",
    "answer": [
      4,
      7,
      1
    ],
    "labels": [
      "first minor",
      "determinant",
      "positive definite"
    ],
    "tolerance": 0.01,
    "hints": [
      "The first minor is the upper-left entry.",
      "The determinant is 8−1."
    ],
    "solution": "The leading minors are 4 and 7, both positive; K is positive definite.",
    "xp": 200,
    "prereqs": [
      "q31",
      "q09"
    ],
    "teaching": {
      "intuition": "Positive definiteness means the quadratic form is positive for every nonzero displacement. For a symmetric 2×2 stiffness matrix, two leading principal minors provide a complete test. A leading principal minor is the determinant of the top-left k×k block; for this 2×2 test, k is 1 and then 2.",
      "steps": [
        "Check that the matrix is symmetric.",
        "Compute its upper-left entry and its determinant.",
        "Declare positive definite only if both are strictly positive."
      ],
      "example": {
        "prompt": "Test [[3,1],[1,2]] for positive definiteness.",
        "steps": [
          "The matrix is symmetric, with first leading minor 3.",
          "The determinant is 3·2−1=5; both minors are positive."
        ],
        "answer": "Positive definite."
      },
      "pitfalls": [
        "Positive diagonal entries alone are insufficient.",
        "Zero minors do not pass the strict positive-definite test."
      ]
    },
    "guidance": [
      {
        "prompt": "Enter the first leading principal minor of [[4,1],[1,2]].",
        "answer": [
          4
        ],
        "labels": [
          "first minor"
        ],
        "explanation": "The leading 1×1 submatrix contains only 4."
      },
      {
        "prompt": "Compute its determinant and enter 1 if both leading minors are positive.",
        "answer": [
          7,
          1
        ],
        "labels": [
          "determinant",
          "positive definite flag"
        ],
        "explanation": "det=4·2−1·1=7. Both 4 and 7 are positive, so the flag is 1."
      }
    ]
  },
  {
    "id": "q33",
    "title": "Cholesky assembly",
    "topic": "Cholesky factorization",
    "tier": "Advanced",
    "sector": "Power Grid",
    "brief": "Build a stable triangular solver for a positive definite system.",
    "lesson": "A real symmetric positive definite A has A=LLᵀ with lower triangular L and positive diagonal.",
    "prompt": "A=[[4,2],[2,5]]. Enter L₁₁,L₂₁,L₂₂ for its Cholesky factor.",
    "answer": [
      2,
      1,
      2
    ],
    "labels": [
      "L11",
      "L21",
      "L22"
    ],
    "tolerance": 0.01,
    "hints": [
      "L₁₁²=4, and L₂₁L₁₁=2.",
      "L₂₁²+L₂₂²=5."
    ],
    "solution": "L=[[2,0],[1,2]]; LLᵀ=[[4,2],[2,5]].",
    "xp": 200,
    "prereqs": [
      "q32"
    ],
    "teaching": {
      "intuition": "Cholesky expresses a symmetric positive definite matrix as a triangular factor times its transpose. It is a structured way to build a solver while preserving positive energy. The superscript T in Lᵀ means transpose, not exponentiation: rows and columns exchange positions.",
      "steps": [
        "Write L=[[l₁₁,0],[l₂₁,l₂₂]] and expand LLᵀ.",
        "Choose l₁₁ as the positive square root of A₁₁, then solve l₂₁l₁₁=A₂₁.",
        "Use l₂₂=√(A₂₂−l₂₁²), choosing the positive root."
      ],
      "example": {
        "prompt": "Factor A=[[9,3],[3,5]] as LLᵀ.",
        "steps": [
          "l₁₁=3 and l₂₁=3/3=1.",
          "l₂₂=√(5−1)=2."
        ],
        "answer": "L=[[3,0],[1,2]]."
      },
      "pitfalls": [
        "Use transpose rather than an inverse in LLᵀ.",
        "The real positive-diagonal factor requires positive definiteness."
      ]
    },
    "guidance": [
      {
        "prompt": "Solve L₁₁²=4 using the positive root.",
        "answer": [
          2
        ],
        "labels": [
          "L11"
        ],
        "explanation": "The required positive diagonal gives L₁₁=2."
      },
      {
        "prompt": "Solve 2L₂₁=2, then L₂₂=√(5−L₂₁²).",
        "answer": [
          1,
          2
        ],
        "labels": [
          "L21",
          "L22"
        ],
        "explanation": "L₂₁=1 and L₂₂=√4=2."
      }
    ]
  },
  {
    "id": "q34",
    "title": "Phasor inner product",
    "topic": "Complex vectors",
    "tier": "Advanced",
    "sector": "Signal Forge",
    "brief": "Measure a complex signal against itself.",
    "lesson": "The complex inner product is u* v, where * conjugates and transposes. Conjugation makes u* u real and nonnegative.",
    "prompt": "For z=(1+i,2−i), enter the real and imaginary parts of z* z.",
    "answer": [
      7,
      0
    ],
    "labels": [
      "real part",
      "imaginary part"
    ],
    "tolerance": 0.01,
    "hints": [
      "Each term is the squared magnitude of one component.",
      "|1+i|²=2 and |2−i|²=5."
    ],
    "solution": "z* z=2+5=7+0i; its norm is √7.",
    "xp": 200,
    "prereqs": [
      "q03",
      "q02"
    ],
    "teaching": {
      "intuition": "Complex signal coordinates have real and imaginary parts, with i²=−1. Conjugation changes i to −i. Conjugating before the dot product makes a signal’s self-inner-product equal its total squared magnitude. The symbol * means conjugate transpose: first flip the sign of every imaginary part, then exchange rows and columns.",
      "steps": [
        "Conjugate each component of the first vector.",
        "Multiply each conjugated component by the matching original component.",
        "Add; self-inner-products must have zero imaginary part and nonnegative real part."
      ],
      "example": {
        "prompt": "Find z* z for z=(2+i,1−3i).",
        "steps": [
          "|2+i|²=2²+1²=5.",
          "|1−3i|²=1²+3²=10; sum is 15."
        ],
        "answer": "15+0i."
      },
      "pitfalls": [
        "An ordinary transpose omits conjugation and gives the wrong complex inner product.",
        "The squared magnitude of a+bi is a²+b², not a²−b²."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute |1+i|².",
        "answer": [
          2
        ],
        "labels": [
          "first squared magnitude"
        ],
        "explanation": "Multiply (1−i)(1+i)=1−i²=2."
      },
      {
        "prompt": "Compute |2−i|² and the imaginary part of its squared magnitude.",
        "answer": [
          5,
          0
        ],
        "labels": [
          "second squared magnitude",
          "imaginary part"
        ],
        "explanation": "(2+i)(2−i)=4−i²=5, a real number."
      }
    ]
  },
  {
    "id": "q35",
    "title": "Hermitian coupler",
    "topic": "Hermitian matrices",
    "tier": "Advanced",
    "sector": "Signal Forge",
    "brief": "Check the real spectral behavior of complex coupling.",
    "lesson": "A Hermitian matrix equals its conjugate transpose. Its eigenvalues are real, and it admits a unitary eigenbasis.",
    "prompt": "H=[[2,i],[−i,2]]. Enter its eigenvalues in ascending order.",
    "answer": [
      1,
      3
    ],
    "labels": [
      "smaller eigenvalue",
      "larger eigenvalue"
    ],
    "tolerance": 0.01,
    "hints": [
      "det(H−λI)=(2−λ)²−1.",
      "Solve (2−λ)²=1."
    ],
    "solution": "The characteristic roots are 1 and 3; conjugate off-diagonal entries make H Hermitian.",
    "xp": 200,
    "prereqs": [
      "q34",
      "q26"
    ],
    "teaching": {
      "intuition": "Hermitian is the complex analogue of symmetric: entries across the diagonal are complex conjugates. Hermitian coupling has real eigenvalues even though some entries are imaginary. The condition H*=H uses conjugate transpose *. Eigenvalues λ solve Hv=λv for some nonzero complex vector v.",
      "steps": [
        "Check conjugate symmetry and real diagonal entries.",
        "Form det(H−λI), keeping i²=−1.",
        "Solve the real characteristic equation and sort the roots."
      ],
      "example": {
        "prompt": "Find eigenvalues of H=[[3,2i],[−2i,3]].",
        "steps": [
          "The off-diagonal product is (2i)(−2i)=4.",
          "det(H−λI)=(3−λ)²−4=0."
        ],
        "answer": "Eigenvalues 1 and 5."
      },
      "pitfalls": [
        "The conjugate transpose differs from the ordinary transpose.",
        "In the determinant subtract the off-diagonal product, which is positive here."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the real and imaginary parts of i(−i).",
        "answer": [
          1,
          0
        ],
        "labels": [
          "product real",
          "product imaginary"
        ],
        "explanation": "i(−i)=−i²=1."
      },
      {
        "prompt": "For det(H−λI)=(2−λ)²−1, what positive number must |2−λ| equal?",
        "answer": [
          1
        ],
        "labels": [
          "absolute difference"
        ],
        "explanation": "Setting the determinant to zero gives (2−λ)²=1, hence two real roots."
      }
    ]
  },
  {
    "id": "q36",
    "title": "Defective drive",
    "topic": "Jordan chains",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Handle a system without enough eigenvectors.",
    "lesson": "A Jordan block J=λI+N with N²=0 satisfies Jⁿ=λⁿI+nλⁿ⁻¹N. Generalized eigenvectors complete the chain when ordinary eigenvectors do not.",
    "prompt": "J=[[2,1],[0,2]]. Enter the entries of J³ in row-major order.",
    "answer": [
      8,
      12,
      0,
      8
    ],
    "labels": [
      "entry 11",
      "entry 12",
      "entry 21",
      "entry 22"
    ],
    "tolerance": 0.01,
    "hints": [
      "Use N=[[0,1],[0,0]], for which N²=0.",
      "The off-diagonal coefficient is 3·2²."
    ],
    "solution": "J³=8I+12N=[[8,12],[0,8]]. J has only one independent eigenvector despite its repeated eigenvalue.",
    "xp": 200,
    "prereqs": [
      "q25"
    ],
    "artifact": {
      "name": "Jordan chain stabilizer",
      "description": "A drive-lab diagnostic module that tracks generalized modes when ordinary eigenvectors cannot span the full state space."
    },
    "teaching": {
      "intuition": "A repeated eigenvalue need not supply enough independent eigenvectors. Jordan blocks retain a small coupling between generalized modes; this coupling produces an extra polynomial factor in repeated updates. A generalized eigenvector w can satisfy (J−λI)w=v for an ordinary eigenvector v. The pair forms a Jordan chain; I is the identity matrix and N is the remaining off-diagonal coupling.",
      "steps": [
        "Split J into λI+N.",
        "Check that N²=0 for this 2×2 Jordan block.",
        "Use Jⁿ=λⁿI+nλⁿ⁻¹N and enter the resulting matrix row by row."
      ],
      "example": {
        "prompt": "Find [[3,1],[0,3]]².",
        "steps": [
          "λ=3 and N=[[0,1],[0,0]], with N²=0.",
          "J²=9I+2·3N=9I+6N."
        ],
        "answer": "[[9,6],[0,9]]."
      },
      "pitfalls": [
        "Do not simply cube each entry.",
        "The short formula depends on N²=0; larger Jordan blocks can require additional terms."
      ]
    },
    "guidance": [
      {
        "prompt": "For the mission λ=2 and n=3, compute λⁿ.",
        "answer": [
          8
        ],
        "labels": [
          "diagonal coefficient"
        ],
        "explanation": "2³=8 multiplies the identity."
      },
      {
        "prompt": "Compute nλⁿ⁻¹=3·2².",
        "answer": [
          12
        ],
        "labels": [
          "off-diagonal coefficient"
        ],
        "explanation": "This coefficient multiplies N, producing the upper-right entry 12."
      }
    ]
  },
  {
    "id": "q37",
    "title": "Coupled subsystem tensor",
    "topic": "Kronecker products",
    "tier": "Advanced",
    "sector": "Signal Forge",
    "brief": "Combine operators for two separable subsystems.",
    "lesson": "A⊗B replaces each scalar aᵢⱼ by the block aᵢⱼB. Eigenvalue products describe independent tensor-product modes.",
    "prompt": "A=diag(2,3), B=[[1,1],[0,1]]. Enter the four diagonal entries of A⊗B in order.",
    "answer": [
      2,
      2,
      3,
      3
    ],
    "labels": [
      "diagonal 1",
      "diagonal 2",
      "diagonal 3",
      "diagonal 4"
    ],
    "tolerance": 0.01,
    "hints": [
      "The diagonal blocks are 2B and 3B.",
      "Each B block has diagonal (1,1)."
    ],
    "solution": "A⊗B has blocks 2B and 3B on its diagonal, giving (2,2,3,3).",
    "xp": 200,
    "prereqs": [
      "q08",
      "q23"
    ],
    "teaching": {
      "intuition": "A Kronecker product models paired subsystem coordinates. Each entry of the first matrix scales an entire copy of the second matrix, so dimensions multiply rather than add. The symbol ⊗ denotes the Kronecker product, a block construction rather than ordinary matrix multiplication. The coordinate order here is the first subsystem index followed by the second.",
      "steps": [
        "If A is m×n and B is p×q, expect an mp×nq result.",
        "Replace every entry aᵢⱼ by block aᵢⱼB.",
        "Read the requested entries using this block order."
      ],
      "example": {
        "prompt": "Let A=diag(4,1), B=[[2,0],[1,3]]. Find the diagonal of A⊗B.",
        "steps": [
          "The diagonal blocks are 4B and B.",
          "Their diagonals are (8,12) and (2,3)."
        ],
        "answer": "Diagonal (8,12,2,3)."
      },
      "pitfalls": [
        "A⊗B usually differs from B⊗A in coordinate ordering.",
        "Do not treat a scalar entry of A as only one entry of the final matrix; it scales a whole block."
      ]
    },
    "guidance": [
      {
        "prompt": "For 2×2 A and 2×2 B, enter the row and column counts of A⊗B.",
        "answer": [
          4,
          4
        ],
        "labels": [
          "rows",
          "columns"
        ],
        "explanation": "Both dimensions multiply: 2·2=4."
      },
      {
        "prompt": "For the block 2B, enter its two diagonal entries.",
        "answer": [
          2,
          2
        ],
        "labels": [
          "block diagonal 1",
          "block diagonal 2"
        ],
        "explanation": "B has diagonal (1,1), so the first block diagonal is (2,2). The other block is 3B."
      }
    ]
  },
  {
    "id": "q38",
    "title": "Traffic equilibrium",
    "topic": "Markov chains",
    "tier": "Advanced",
    "sector": "Network Hub",
    "brief": "Predict the long-run distribution of packet routes.",
    "lesson": "For a column-stochastic transition matrix P, state probabilities evolve by p_next=Pp. A stationary distribution satisfies Pp=p and sums to one.",
    "prompt": "P=[[0.8,0.3],[0.2,0.7]]. Enter the stationary probabilities p₁,p₂.",
    "answer": [
      0.6,
      0.4
    ],
    "labels": [
      "state 1 probability",
      "state 2 probability"
    ],
    "tolerance": 0.01,
    "hints": [
      "The first equation reduces to 0.2p₁=0.3p₂.",
      "Combine the ratio p₁/p₂=1.5 with p₁+p₂=1."
    ],
    "solution": "Balance gives p₁=1.5p₂, hence p₂=0.4 and p₁=0.6.",
    "xp": 200,
    "prereqs": [
      "q24",
      "q11"
    ],
    "teaching": {
      "intuition": "A Markov matrix moves probability between states. With column-stochastic convention, each column lists where probability leaving one state goes. A stationary distribution is unchanged by that movement. The vector p lists state probabilities, and p_next is the vector one time step later. Stationarity is an eigenvector equation with eigenvalue 1 plus probability normalization.",
      "steps": [
        "Verify columns sum to one and use p_next=Pp.",
        "Set Pp=p and rearrange one independent equation into a ratio.",
        "Combine the ratio with p₁+p₂=1 and require nonnegative probabilities."
      ],
      "example": {
        "prompt": "Find the stationary distribution of P=[[0.9,0.2],[0.1,0.8]].",
        "steps": [
          "Stationarity gives 0.1p₁=0.2p₂, hence p₁=2p₂.",
          "Normalization gives 3p₂=1."
        ],
        "answer": "p=(2/3,1/3)."
      },
      "pitfalls": [
        "Row-stochastic texts use a different vector convention.",
        "Stationary does not by itself guarantee convergence from every starting state; this strictly positive matrix does converge."
      ]
    },
    "guidance": [
      {
        "prompt": "From 0.2p₁=0.3p₂, compute the ratio p₁/p₂.",
        "answer": [
          1.5
        ],
        "labels": [
          "probability ratio"
        ],
        "explanation": "Divide by 0.2 to obtain p₁=1.5p₂."
      },
      {
        "prompt": "Use 1.5p₂+p₂=1 to find p₂.",
        "answer": [
          0.4
        ],
        "labels": [
          "state 2 probability"
        ],
        "explanation": "2.5p₂=1, so p₂=0.4; use normalization to finish."
      }
    ]
  },
  {
    "id": "q39",
    "title": "Network consensus",
    "topic": "Graph Laplacians",
    "tier": "Advanced",
    "sector": "Network Hub",
    "brief": "Read conservation and connectivity from a network.",
    "lesson": "For an undirected graph, L=D−A is positive semidefinite and L1=0. The dimension of its nullspace equals the number of connected components.",
    "prompt": "A three-node path has L=[[1,−1,0],[−1,2,−1],[0,−1,1]]. Enter L(2,2,2), followed by the number of connected components.",
    "answer": [
      0,
      0,
      0,
      1
    ],
    "labels": [
      "output 1",
      "output 2",
      "output 3",
      "components"
    ],
    "tolerance": 0.01,
    "hints": [
      "A constant state has zero differences across edges.",
      "The path connects all three nodes."
    ],
    "solution": "Every row sums to zero, so L(2,2,2)=0. A connected path has one component and a one-dimensional nullspace.",
    "xp": 200,
    "prereqs": [
      "q14",
      "q32"
    ],
    "teaching": {
      "intuition": "A graph Laplacian computes differences between neighboring node states. Uniform states have no disagreement, so they lie in its nullspace. Each disconnected component can hold its own independent constant. Here D is the diagonal matrix of node degrees and A is the adjacency matrix. The symbol 1 in L1=0 denotes an all-ones vector, not a scalar multiplication.",
      "steps": [
        "For each node, subtract neighbors from degree times its own value.",
        "For a constant vector, exploit the zero row sums.",
        "Count connected components; this equals the Laplacian nullity for an undirected graph."
      ],
      "example": {
        "prompt": "For two disconnected edges on four nodes, what are L(3,3,3,3) and nullity(L)?",
        "steps": [
          "Each edge sees equal values at both ends, so every difference is zero.",
          "There are two connected components, each supporting an independent constant mode."
        ],
        "answer": "Output (0,0,0,0); nullity 2."
      },
      "pitfalls": [
        "The component-nullity statement here assumes an undirected graph Laplacian.",
        "A connected graph has one zero eigenvalue, not zero zero-eigenvalues."
      ]
    },
    "guidance": [
      {
        "prompt": "For the middle row (−1,2,−1), compute its dot product with (2,2,2).",
        "answer": [
          0
        ],
        "labels": [
          "middle output"
        ],
        "explanation": "−2+4−2=0, expressing no local disagreement."
      },
      {
        "prompt": "How many connected components does a three-node path have, and what is its Laplacian nullity?",
        "answer": [
          1,
          1
        ],
        "labels": [
          "components",
          "nullity"
        ],
        "explanation": "Every node is reachable from every other, so there is one component and one constant null direction."
      }
    ]
  },
  {
    "id": "q40",
    "title": "Optimal power dispatch",
    "topic": "Quadratic optimization",
    "tier": "Advanced",
    "sector": "Power Grid",
    "brief": "Choose a dispatch that minimizes a convex cost.",
    "lesson": "For f(x)=½xᵀQx−bᵀx with symmetric positive definite Q, the unique minimizer solves Qx=b because ∇f=Qx−b.",
    "prompt": "Q=diag(2,4), b=(6,8). Enter the minimizer x₁,x₂ and minimum f.",
    "answer": [
      3,
      2,
      -17
    ],
    "labels": [
      "optimal x1",
      "optimal x2",
      "minimum cost"
    ],
    "tolerance": 0.01,
    "hints": [
      "Solve 2x₁=6 and 4x₂=8.",
      "Evaluate ½(2·9+4·4)−(18+16)."
    ],
    "solution": "x=(3,2). f=17−34=−17; positive definiteness guarantees the unique global minimum.",
    "xp": 200,
    "prereqs": [
      "q32",
      "q11"
    ],
    "teaching": {
      "intuition": "A positive definite quadratic cost curves upward in every direction. Its unique lowest point is where its gradient vanishes, converting optimization into a linear solve. The gradient ∇f is the vector of first partial derivatives: its coordinates measure marginal cost for changing each command. At an unconstrained differentiable minimum it vanishes.",
      "steps": [
        "Use symmetry to write ∇f=Qx−b.",
        "Solve Qx=b for the stationary point.",
        "Evaluate the original cost including its one-half factor; positive definiteness certifies a global minimum."
      ],
      "example": {
        "prompt": "Minimize f=½xᵀdiag(2,6)x−(4,6)ᵀx.",
        "steps": [
          "The gradient equations are 2x₁=4 and 6x₂=6, giving x=(2,1).",
          "The cost is ½(8+6)−(8+6)=−7."
        ],
        "answer": "Minimizer (2,1), minimum −7."
      },
      "pitfalls": [
        "The formula ∇f=Qx−b uses symmetric Q.",
        "Dropping the one-half changes the gradient and the minimizer."
      ]
    },
    "guidance": [
      {
        "prompt": "Solve 2x₁=6 and 4x₂=8.",
        "answer": [
          3,
          2
        ],
        "labels": [
          "optimal x1",
          "optimal x2"
        ],
        "explanation": "The diagonal quadratic separates into two scalar linear equations."
      },
      {
        "prompt": "At x=(3,2), compute xᵀQx and bᵀx.",
        "answer": [
          34,
          34
        ],
        "labels": [
          "quadratic term before half",
          "linear term"
        ],
        "explanation": "xᵀQx=2·9+4·4=34 and bᵀx=6·3+8·2=34; apply the half factor only to the first."
      }
    ]
  },
  {
    "id": "q41",
    "title": "Constrained allocation",
    "topic": "Lagrange multipliers",
    "tier": "Advanced",
    "sector": "Power Grid",
    "brief": "Minimize actuator effort under a conservation law.",
    "lesson": "Equality-constrained quadratic problems combine the gradient condition with the constraint. With unequal costs, optimal sharing need not be equal.",
    "prompt": "Minimize f=x²+2y² subject to x+y=6. Enter optimal x,y and f.",
    "answer": [
      4,
      2,
      24
    ],
    "labels": [
      "optimal x",
      "optimal y",
      "minimum effort"
    ],
    "tolerance": 0.01,
    "hints": [
      "Gradient balance gives 2x=4y.",
      "Use x=2y in the constraint."
    ],
    "solution": "x=2y and x+y=6 give y=2,x=4. Cost is 16+8=24; strict convexity guarantees uniqueness.",
    "xp": 200,
    "prereqs": [
      "q40",
      "q29"
    ],
    "teaching": {
      "intuition": "A conservation constraint restricts feasible commands to a line. At the optimum, shifting a small amount of demand between actuators cannot reduce cost, so their marginal costs must match. A Lagrange multiplier is a shared scalar equated to each partial derivative after adding the constraint. Equating marginal costs here follows because both variables enter x+y with coefficient one.",
      "steps": [
        "Use the constraint to eliminate one variable, or equate partial derivatives with a Lagrange multiplier.",
        "Solve the resulting derivative balance together with the constraint.",
        "Check feasibility and evaluate the original weighted cost."
      ],
      "example": {
        "prompt": "Minimize x²+3y² subject to x+y=8.",
        "steps": [
          "Equal marginal costs give 2x=6y, so x=3y.",
          "Then 4y=8, giving y=2 and x=6."
        ],
        "answer": "(x,y)=(6,2), cost 36+12=48."
      },
      "pitfalls": [
        "Equal sharing is not optimal when effort weights differ.",
        "This equality-only problem imposes no additional actuator bounds."
      ]
    },
    "guidance": [
      {
        "prompt": "For f=x²+2y², enter the coefficients in marginal costs ∂f/∂x and ∂f/∂y.",
        "answer": [
          2,
          4
        ],
        "labels": [
          "x derivative coefficient",
          "y derivative coefficient"
        ],
        "explanation": "The gradients are 2x and 4y; optimal feasible redistribution equates them."
      },
      {
        "prompt": "Use x=2y and x+y=6 to find y.",
        "answer": [
          2
        ],
        "labels": [
          "optimal y"
        ],
        "explanation": "3y=6, so y=2. Then determine x and evaluate the cost."
      }
    ]
  },
  {
    "id": "q42",
    "title": "Weighted sensor fusion",
    "topic": "Weighted least squares",
    "tier": "Advanced",
    "sector": "Sensor Array",
    "brief": "Give accurate sensors greater influence.",
    "lesson": "Weighted least squares minimizes Σwᵢ(c−yᵢ)². The constant estimate is Σwᵢyᵢ/Σwᵢ; inverse-variance weights favor precise measurements.",
    "prompt": "Two sensors read 2 and 8 V with weights 3 and 1. Enter the fused voltage and weighted squared error.",
    "answer": [
      3.5,
      27
    ],
    "labels": [
      "fused voltage",
      "weighted error"
    ],
    "tolerance": 0.01,
    "hints": [
      "Compute (3·2+1·8)/(3+1).",
      "The residuals are 1.5 and −4.5."
    ],
    "solution": "c=14/4=3.5 V. Weighted error=3·2.25+20.25=27.",
    "xp": 200,
    "prereqs": [
      "q20",
      "q21"
    ],
    "teaching": {
      "intuition": "Weighted least squares treats some readings as more reliable. With positive weights, a larger weight pulls the estimate more strongly toward that reading; inverse variances are a common statistical choice. The symbol Σ means sum over the sensor readings; wᵢ is the positive reliability weight for reading yᵢ.",
      "steps": [
        "Multiply each reading by its weight.",
        "Divide the sum of weighted readings by the sum of weights.",
        "Calculate weighted error by multiplying each squared residual by its weight before summing."
      ],
      "example": {
        "prompt": "Readings are 1 and 7 V with weights 2 and 1. Find fused voltage and weighted error.",
        "steps": [
          "c=(2·1+1·7)/(2+1)=3 V.",
          "Weighted error=2(1−3)²+(7−3)²=8+16=24."
        ],
        "answer": "Fused voltage 3 V; weighted error 24 V²."
      },
      "pitfalls": [
        "Do not divide by the number of sensors instead of the sum of weights.",
        "Weight the squared residual, not just the residual before squaring."
      ]
    },
    "guidance": [
      {
        "prompt": "For readings 2,8 with weights 3,1, enter Σwy and Σw.",
        "answer": [
          14,
          4
        ],
        "labels": [
          "weighted sum",
          "weight sum"
        ],
        "explanation": "3·2+1·8=14, and 3+1=4."
      },
      {
        "prompt": "At c=3.5, compute the first weighted squared residual 3(2−3.5)².",
        "answer": [
          6.75
        ],
        "labels": [
          "first weighted error"
        ],
        "explanation": "The residual is −1.5, its square is 2.25, and weighting gives 6.75. Add the second weighted error to finish."
      }
    ]
  },
  {
    "id": "q43",
    "title": "Matrix workbench",
    "topic": "Matrix arithmetic and transpose",
    "tier": "Basic",
    "sector": "Sensor Array",
    "brief": "Combine two calibration corrections and exchange input/output indexing.",
    "lesson": "Matrix addition and scalar multiplication act entry by entry. Transposition exchanges rows and columns: (Aᵀ)ᵢⱼ=Aⱼᵢ.",
    "prompt": "A=[[1,2],[3,4]], B=[[2,0],[−1,1]]. Enter (2A+B)ᵀ in row-major order.",
    "answer": [
      4,
      5,
      4,
      9
    ],
    "labels": [
      "entry 11",
      "entry 12",
      "entry 21",
      "entry 22"
    ],
    "tolerance": 0.01,
    "hints": [
      "First compute 2A+B=[[4,4],[5,9]].",
      "Exchange its off-diagonal entries when transposing."
    ],
    "solution": "2A=[[2,4],[6,8]], so 2A+B=[[4,4],[5,9]]. Transposing gives [[4,5],[4,9]].",
    "xp": 100,
    "prereqs": [
      "q06"
    ],
    "teaching": {
      "intuition": "Matrix arithmetic combines equally shaped tables entry by entry. Transposition exchanges input and output indexing: rows become columns, so an m×n matrix becomes n×m.",
      "steps": [
        "Scale each entry of A by 2.",
        "Add the matching entry of B.",
        "Transpose the sum and then list its entries by rows."
      ],
      "example": {
        "prompt": "A=[[0,1],[2,−1]], B=[[3,2],[1,4]]. Find (2A+B)ᵀ.",
        "steps": [
          "2A+B=[[3,4],[5,2]].",
          "Exchange rows and columns to get [[3,5],[4,2]]."
        ],
        "answer": "[[3,5],[4,2]]."
      },
      "pitfalls": [
        "Addition requires matching dimensions.",
        "Transpose is not inversion; it exchanges indices without solving a system."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the first row of 2A+B.",
        "answer": [
          4,
          4
        ],
        "labels": [
          "sum 11",
          "sum 12"
        ],
        "explanation": "2(1,2)+(2,0)=(4,4)."
      },
      {
        "prompt": "Compute the second row of 2A+B.",
        "answer": [
          5,
          9
        ],
        "labels": [
          "sum 21",
          "sum 22"
        ],
        "explanation": "2(3,4)+(−1,1)=(5,9). Now use these rows as columns of the transpose."
      }
    ]
  },
  {
    "id": "q44",
    "title": "Eliminate the coupled manifold",
    "topic": "Full row reduction",
    "tier": "Intermediate",
    "sector": "Power Grid",
    "brief": "Separate three tightly coupled flow constraints.",
    "lesson": "Elementary row operations preserve the solution set. Reduce the augmented matrix by creating pivots and clearing their columns, including entries above each pivot.",
    "prompt": "Reduce the augmented system x+y+z=6, 2x+3y+z=11, x−y+2z=5 to reduced row echelon form. Enter the final right-hand column x,y,z.",
    "answer": [
      1,
      2,
      3
    ],
    "labels": [
      "x",
      "y",
      "z"
    ],
    "tolerance": 0.01,
    "hints": [
      "Use R₂←R₂−2R₁ and R₃←R₃−R₁ to get rows (0,1,−1|−1) and (0,−2,1|−1).",
      "Then R₃←R₃+2R₂ gives (0,0,−1|−3); normalize and clear above."
    ],
    "solution": "After eliminating the first column, the second and third equations are y−z=−1 and −2y+z=−1. Add twice the second row to the third: −z=−3. Normalize to z=3, clear z from the y row to get y=2, then clear y,z from row 1 to get x=1. The augmented RREF is [I | (1,2,3)ᵀ].",
    "xp": 150,
    "prereqs": [
      "q12",
      "q43"
    ],
    "teaching": {
      "intuition": "Row reduction replaces equations with equivalent equations until each variable has its own pivot. Every operation applies to the full augmented row, including the right-hand side.",
      "steps": [
        "Use the first row to clear x from lower rows.",
        "Use the new second row to clear y below it, then normalize the z pivot.",
        "Clear entries above each pivot to reach [I|solution]."
      ],
      "example": {
        "prompt": "Reduce x+y+z=5, 2x+3y+z=9, x−y+2z=4.",
        "steps": [
          "R₂−2R₁ gives y−z=−1; R₃−R₁ gives −2y+z=−1.",
          "Add twice the new second row to the third: −z=−3. Thus z=3, y=2, and x=0."
        ],
        "answer": "RREF=[I|(0,2,3)ᵀ]."
      },
      "pitfalls": [
        "A row operation must also change the right-hand side.",
        "RREF clears both above and below pivots; triangular form alone is only an intermediate stage."
      ]
    },
    "guidance": [
      {
        "prompt": "Apply R₂←R₂−2R₁ to the actual system. Enter new coefficients of y,z and the right-hand side.",
        "answer": [
          1,
          -1,
          -1
        ],
        "labels": [
          "y coefficient",
          "z coefficient",
          "right-hand side"
        ],
        "explanation": "(2,3,1|11)−2(1,1,1|6)=(0,1,−1|−1)."
      },
      {
        "prompt": "The updated third row is (0,−2,1|−1). Add twice the updated second row. Enter z coefficient and right-hand side.",
        "answer": [
          -1,
          -3
        ],
        "labels": [
          "z coefficient",
          "right-hand side"
        ],
        "explanation": "1+2(−1)=−1 and −1+2(−1)=−3, so −z=−3. Back-substitute, then clear above pivots."
      }
    ]
  },
  {
    "id": "q45",
    "title": "Pivot before dividing",
    "topic": "Pivoted LU",
    "tier": "Intermediate",
    "sector": "Power Grid",
    "brief": "Factor a solvable system whose first diagonal entry is zero.",
    "lesson": "Partial pivoting swaps a larger available pivot into position before elimination. With the convention PA=LU, P records row swaps and L records elimination multipliers.",
    "prompt": "A=[[0,2],[1,3]]. Swap its two rows, then factor PA=LU with unit diagonal L. Enter the elimination multiplier L₂₁ and U₁₁,U₁₂,U₂₂.",
    "answer": [
      0,
      1,
      3,
      2
    ],
    "labels": [
      "L21",
      "U11",
      "U12",
      "U22"
    ],
    "tolerance": 0.01,
    "hints": [
      "After the swap, PA=[[1,3],[0,2]].",
      "The entry below the first pivot is already zero."
    ],
    "solution": "P=[[0,1],[1,0]] gives PA=[[1,3],[0,2]], already upper triangular. Thus L=I, multiplier L₂₁=0, and U=[[1,3],[0,2]]. The initial zero pivot indicates a need to swap, not singularity.",
    "xp": 150,
    "prereqs": [
      "q44",
      "q09"
    ],
    "teaching": {
      "intuition": "A zero leading entry can block elimination even when a matrix is invertible. Row pivoting reorders equations to obtain a usable pivot. In PA=LU, P records that reordering.",
      "steps": [
        "Choose a nonzero pivot in the current column and swap rows if needed.",
        "Record the swap in P.",
        "Store elimination multipliers in unit-diagonal L and the resulting upper triangular matrix in U."
      ],
      "example": {
        "prompt": "For A=[[0,4],[2,5]], swap rows and find PA=LU.",
        "steps": [
          "After swapping, PA=[[2,5],[0,4]].",
          "No elimination is needed below the first pivot, so L=I and U=PA."
        ],
        "answer": "L=I, U=[[2,5],[0,4]], P=[[0,1],[1,0]]."
      },
      "pitfalls": [
        "A zero pivot does not automatically mean the original matrix is singular.",
        "The convention here is PA=LU, not A=PLU; keep the permutation placement explicit."
      ]
    },
    "guidance": [
      {
        "prompt": "Swap the rows of actual A. Enter the new top row.",
        "answer": [
          1,
          3
        ],
        "labels": [
          "pivot row first",
          "pivot row second"
        ],
        "explanation": "The second original row becomes the first row, giving a nonzero leading pivot 1."
      },
      {
        "prompt": "The entry below the pivot is 0 and the pivot is 1. Compute its elimination multiplier 0/1 and the lower-right U entry.",
        "answer": [
          0,
          2
        ],
        "labels": [
          "L21",
          "U22"
        ],
        "explanation": "The multiplier is zero, so the bottom row remains (0,2)."
      }
    ]
  },
  {
    "id": "q46",
    "title": "Reframe the dynamics",
    "topic": "Change of basis and similarity",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Express an operator in the coordinates of its mode frame.",
    "lesson": "If P has the new basis vectors as columns in the old frame, then x=P[x]new and the operator in the new frame is B=P⁻¹AP. Similarity changes coordinates while preserving eigenvalues.",
    "prompt": "A=[[2,0],[0,3]], P=[[1,1],[0,1]]. Enter B=P⁻¹AP in row-major order.",
    "answer": [
      2,
      -1,
      0,
      3
    ],
    "labels": [
      "B11",
      "B12",
      "B21",
      "B22"
    ],
    "tolerance": 0.01,
    "hints": [
      "P⁻¹=[[1,−1],[0,1]].",
      "AP=[[2,2],[0,3]]."
    ],
    "solution": "P⁻¹AP=[[1,−1],[0,1]][[2,2],[0,3]]=[[2,−1],[0,3]]. The diagonal eigenvalues remain 2 and 3.",
    "xp": 200,
    "prereqs": [
      "q15",
      "q25",
      "q10"
    ],
    "teaching": {
      "intuition": "Changing basis changes the coordinate description, not the physical operator. P converts new coordinates to old; P⁻¹ converts old outputs back to new coordinates, explaining the order P⁻¹AP. Similarity means the two matrices describe the same linear operator in different bases. P⁻¹ denotes the inverse coordinate conversion, not the transpose unless P is orthogonal.",
      "steps": [
        "Interpret columns of P as the new basis in old coordinates.",
        "Compute AP, the old-coordinate outputs for those basis vectors.",
        "Multiply on the left by P⁻¹ to express those outputs in the new basis."
      ],
      "example": {
        "prompt": "A=diag(4,5), P=[[1,2],[0,1]]. Find P⁻¹AP.",
        "steps": [
          "P⁻¹=[[1,−2],[0,1]] and AP=[[4,8],[0,5]].",
          "Left multiplication gives [[4,−2],[0,5]]."
        ],
        "answer": "New matrix [[4,−2],[0,5]]."
      },
      "pitfalls": [
        "P must be invertible: its columns must form a basis.",
        "P⁻¹AP and PAP⁻¹ correspond to opposite coordinate conventions."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the top row of AP for actual A=diag(2,3), P=[[1,1],[0,1]].",
        "answer": [
          2,
          2
        ],
        "labels": [
          "AP11",
          "AP12"
        ],
        "explanation": "Left multiplication by diagonal A scales the first row of P by 2."
      },
      {
        "prompt": "The first row of P⁻¹ is (1,−1), and the second column of AP is (2,3). Compute their dot product.",
        "answer": [
          -1
        ],
        "labels": [
          "B12"
        ],
        "explanation": "2−3=−1, the upper-right entry of the matrix in the new basis."
      }
    ]
  },
  {
    "id": "q47",
    "title": "Four spaces audit",
    "topic": "Fundamental subspaces",
    "tier": "Advanced",
    "sector": "Sensor Array",
    "brief": "Audit which inputs and measurements a redundant sensor matrix can represent.",
    "lesson": "For an m×n rank-r matrix, column and row spaces have dimension r, nullspace has dimension n−r, and left nullspace has dimension m−r. Null(A) is perpendicular to Row(A); Null(Aᵀ) is perpendicular to Col(A).",
    "prompt": "A=[[1,0,1],[0,1,1]]. Enter dimensions of Col(A), Row(A), Null(A), Null(Aᵀ), then the dot product of n=(−1,−1,1) with row r=(1,0,1).",
    "answer": [
      2,
      2,
      1,
      0,
      0
    ],
    "labels": [
      "column dimension",
      "row dimension",
      "null dimension",
      "left null dimension",
      "n dot r"
    ],
    "tolerance": 0.01,
    "hints": [
      "The two rows are independent, so rank is 2; there are 3 columns and 2 rows.",
      "n·r=−1+0+1."
    ],
    "solution": "Rank is 2, so dimensions are 2,2,3−2=1,2−2=0. The null vector n is perpendicular to both rows; n·r=0 verifies one orthogonality relation. Column space is all of R², whose orthogonal complement is the zero left nullspace.",
    "xp": 200,
    "prereqs": [
      "q13",
      "q14",
      "q18"
    ],
    "teaching": {
      "intuition": "A matrix has two spaces in its input coordinates and two in its output coordinates. The input splits into visible row-space directions and invisible nullspace directions; the output splits into attainable column-space directions and left-null directions. Col(A) is the span of A’s columns and Row(A) is the span of its rows. Null(A) solves Ax=0; Null(Aᵀ) solves Aᵀy=0, where Aᵀ swaps rows and columns.",
      "steps": [
        "Identify dimensions m outputs, n inputs, and rank r.",
        "Assign dimensions r,r,n−r,m−r to column, row, null, and left-null spaces.",
        "Check orthogonality with a dot product in the appropriate ambient space."
      ],
      "example": {
        "prompt": "A=[[1,0,0],[0,0,0]]. Find dimensions of its four fundamental subspaces.",
        "steps": [
          "Here m=2, n=3, r=1.",
          "Column and row dimensions are 1; nullity=2 and left nullity=1."
        ],
        "answer": "Dimensions in column,row,null,left-null order: 1,1,2,1."
      },
      "pitfalls": [
        "Row space and nullspace live in Rⁿ; column space and left nullspace live in Rᵐ.",
        "Null(Aᵀ) is the left nullspace, not the ordinary nullspace of A."
      ]
    },
    "guidance": [
      {
        "prompt": "For actual 2×3 A with two independent rows, enter m,n,r.",
        "answer": [
          2,
          3,
          2
        ],
        "labels": [
          "outputs m",
          "inputs n",
          "rank r"
        ],
        "explanation": "There are two output rows, three input columns, and two independent measurements."
      },
      {
        "prompt": "Compute n−r, m−r, and (−1,−1,1)·(1,0,1).",
        "answer": [
          1,
          0,
          0
        ],
        "labels": [
          "nullity",
          "left nullity",
          "orthogonality dot"
        ],
        "explanation": "The dimensions are 3−2=1 and 2−2=0; the dot product is −1+0+1=0."
      }
    ]
  },
  {
    "id": "q48",
    "title": "Docking frame translation",
    "topic": "Affine homogeneous transforms",
    "tier": "Intermediate",
    "sector": "Orbital Dock",
    "brief": "Combine rotation and translation in a single coordinate transform.",
    "lesson": "A planar affine map uses homogeneous coordinates (x,y,1). A 3×3 matrix embeds a 2×2 linear map and a translation; points use final coordinate 1 and direction vectors use 0.",
    "prompt": "A docking transform rotates 90° counterclockwise, then translates by (5,−1). Its homogeneous matrix is [[0,−1,5],[1,0,−1],[0,0,1]]. Transform point (2,3,1). Enter all three homogeneous coordinates.",
    "answer": [
      2,
      1,
      1
    ],
    "labels": [
      "new x",
      "new y",
      "homogeneous coordinate"
    ],
    "tolerance": 0.01,
    "hints": [
      "The rotation alone sends (2,3) to (−3,2).",
      "Add the translation (5,−1)."
    ],
    "solution": "The product is (−3+5,2−1,1)=(2,1,1). Translation affects points because their last coordinate is 1.",
    "xp": 150,
    "prereqs": [
      "q07",
      "q08",
      "q43"
    ],
    "teaching": {
      "intuition": "A translation cannot be represented by a 2×2 linear map about the origin. Homogeneous coordinates add a third coordinate so rotation and translation become one matrix product.",
      "steps": [
        "Represent a point as (x,y,1).",
        "Multiply the linear 2×2 block by (x,y), then add the translation column times the final coordinate.",
        "Retain the last coordinate; a direction vector would use 0 and receive no translation."
      ],
      "example": {
        "prompt": "Rotate point (1,4) counterclockwise 90°, then translate by (2,3).",
        "steps": [
          "Rotation gives (−4,1).",
          "Add translation: (−4+2,1+3)=(−2,4)."
        ],
        "answer": "Homogeneous output (−2,4,1)."
      },
      "pitfalls": [
        "The stated order is rotation first, translation second.",
        "Points use homogeneous coordinate 1; free directions use 0."
      ]
    },
    "guidance": [
      {
        "prompt": "Rotate actual point (2,3) counterclockwise by 90°, before translation.",
        "answer": [
          -3,
          2
        ],
        "labels": [
          "rotated x",
          "rotated y"
        ],
        "explanation": "The rule (x,y)→(−y,x) gives (−3,2)."
      },
      {
        "prompt": "Add translation (5,−1) to (−3,2).",
        "answer": [
          2,
          1
        ],
        "labels": [
          "translated x",
          "translated y"
        ],
        "explanation": "Add coordinatewise: (−3+5,2−1)=(2,1). Keep final homogeneous coordinate 1."
      }
    ]
  },
  {
    "id": "q49",
    "title": "Keep the dominant scan",
    "topic": "Low-rank SVD approximation",
    "tier": "Advanced",
    "sector": "Sensor Array",
    "brief": "Compress a scan while quantifying the discarded signal.",
    "lesson": "Truncating an SVD to its largest k singular values gives a best rank-k approximation in Frobenius and spectral norms. Its squared Frobenius error is the sum of squares of discarded singular values.",
    "prompt": "A=diag(5,3,1). Enter the diagonal of its best rank-1 SVD approximation, the squared Frobenius reconstruction error, and the spectral-norm error.",
    "answer": [
      5,
      0,
      0,
      10,
      3
    ],
    "labels": [
      "approx diagonal 1",
      "approx diagonal 2",
      "approx diagonal 3",
      "squared Frobenius error",
      "spectral error"
    ],
    "tolerance": 0.01,
    "hints": [
      "Keep singular value 5 and discard 3 and 1.",
      "The squared Frobenius error is 3²+1²; spectral error is the largest discarded singular value."
    ],
    "solution": "A₁=diag(5,0,0). The residual is diag(0,3,1), so ‖A−A₁‖F²=9+1=10 and ‖A−A₁‖₂=3. Frobenius error itself is √10.",
    "xp": 200,
    "prereqs": [
      "q27",
      "q28"
    ],
    "teaching": {
      "intuition": "SVD orders independent patterns by their strength. Keeping only the strongest patterns compresses the matrix. The discarded singular values exactly quantify the reconstruction error in two common norms. The Frobenius norm ‖E‖F is the square root of the sum of squared entries of error E. The spectral norm ‖E‖₂ is its largest singular value. The question asks for the square of the first norm.",
      "steps": [
        "Keep the largest singular value and its outer-product mode for a rank-1 approximation.",
        "Square and sum discarded singular values for squared Frobenius error.",
        "Take the largest discarded singular value for spectral-norm error."
      ],
      "example": {
        "prompt": "For A=diag(7,4,2), find the best rank-1 approximation and its errors.",
        "steps": [
          "Keep only 7: A₁=diag(7,0,0).",
          "Discarded values are 4 and 2, so squared Frobenius error is 16+4=20 and spectral error is 4."
        ],
        "answer": "A₁=diag(7,0,0); ‖A−A₁‖F²=20; ‖A−A₁‖₂=4."
      },
      "pitfalls": [
        "Squared Frobenius error differs from Frobenius error by a square root.",
        "Keeping matrix entries by size is not a general substitute for truncated SVD; diagonal positive A makes this example simple."
      ]
    },
    "guidance": [
      {
        "prompt": "For actual A=diag(5,3,1), enter the retained singular value and the two discarded ones.",
        "answer": [
          5,
          3,
          1
        ],
        "labels": [
          "retained",
          "discarded first",
          "discarded second"
        ],
        "explanation": "A rank-1 approximation keeps only the largest singular mode 5."
      },
      {
        "prompt": "From discarded values 3,1, compute squared Frobenius error and spectral error.",
        "answer": [
          10,
          3
        ],
        "labels": [
          "squared Frobenius error",
          "spectral error"
        ],
        "explanation": "3²+1²=10; the largest discarded singular value is 3."
      }
    ]
  },
  {
    "id": "q50",
    "title": "Guild master commissioning",
    "topic": "Engineering capstone",
    "tier": "Advanced",
    "sector": "Guild Citadel",
    "brief": "Commission an estimator, actuator allocation, and network monitor as one integrated station.",
    "lesson": "An engineering pipeline connects estimation, minimum-effort control, and stability analysis. Least squares reconciles inconsistent readings; a pseudoinverse allocates redundant actuators; eigenvalues reveal network mixing; covariance eigenvalues quantify compression.",
    "prompt": "A constant load is estimated from readings 2,4,6 using equal-weight least squares. Two identical actuators must sum to that estimate and use minimum Euclidean norm. Network P=[[0.75,0.25],[0.25,0.75]] monitors dispatch. A scan covariance is diag(9,1). Enter: estimated load; actuator 1; actuator 2; stationary network probability for node 1; nonstationary eigenvalue of P; fraction of scan variance retained by one PCA axis.",
    "answer": [
      4,
      2,
      2,
      0.5,
      0.5,
      0.9
    ],
    "labels": [
      "estimated load",
      "actuator 1",
      "actuator 2",
      "stationary p1",
      "mixing eigenvalue",
      "PCA retained fraction"
    ],
    "tolerance": 0.01,
    "hints": [
      "Average the readings; then share the resulting load equally between identical actuators.",
      "P is symmetric and stochastic, with eigenvalues 1 and 0.5; total scan variance is 10."
    ],
    "solution": "The least-squares load is (2+4+6)/3=4. Minimum-norm allocation is (2,2). Network symmetry gives stationary distribution (0.5,0.5); the difference mode (1,−1) has eigenvalue 0.5, so imbalance halves each step. The leading covariance eigenvalue retains 9/(9+1)=0.9 of scan variance. These checks commission the full sensing, dispatch, and monitoring pipeline.",
    "xp": 200,
    "prereqs": [
      "q29",
      "q30",
      "q38",
      "q39",
      "q41",
      "q46",
      "q47",
      "q48",
      "q49"
    ],
    "artifact": {
      "name": "Guild master seal",
      "description": "A titanium commissioning seal etched with the station’s validated estimation, control, and network certificates. It marks completion of the guild’s integrated engineering trial."
    },
    "teaching": {
      "intuition": "Commissioning links several mathematical tools into one consistent pipeline. Estimate the demand before allocating it; check the monitoring network independently; then quantify how much scan information compression retains. The nonstationary eigenvalue multiplies a probability imbalance at each update. A covariance eigenvalue measures variance along its principal direction; dividing by the trace turns it into a retained fraction.",
      "steps": [
        "Average equal-weight observations, then split the estimated demand equally for identical minimum-norm actuators.",
        "For the symmetric two-state stochastic matrix, use a uniform stationary distribution and apply it to the difference mode to find the other eigenvalue.",
        "For diagonal scan covariance, divide its largest diagonal entry by its trace. Report the six requested values in order."
      ],
      "example": {
        "prompt": "Readings 3,6,9 feed two equal actuators. P=[[0.8,0.2],[0.2,0.8]], and scan covariance is diag(8,2). Find the corresponding commissioning values.",
        "steps": [
          "Mean load is 6, so minimum-norm actuator commands are 3 and 3.",
          "Symmetric P has stationary p₁=0.5 and difference-mode eigenvalue 0.6.",
          "Leading scan variance fraction is 8/(8+2)=0.8."
        ],
        "answer": "Load 6; actuators 3,3; stationary p₁=0.5; mixing eigenvalue 0.6; retained fraction 0.8."
      },
      "pitfalls": [
        "The network’s stationary eigenvalue is 1; the requested nonstationary eigenvalue controls decay of imbalance.",
        "A retained variance fraction is not a reconstruction-error fraction; read each requested field carefully."
      ]
    },
    "guidance": [
      {
        "prompt": "Average actual readings 2,4,6, then divide that estimate equally between two identical actuators. Enter load and both commands.",
        "answer": [
          4,
          2,
          2
        ],
        "labels": [
          "estimated load",
          "actuator 1",
          "actuator 2"
        ],
        "explanation": "The average is 12/3=4. Equal sharing (2,2) meets that demand with minimum squared effort."
      },
      {
        "prompt": "For actual P, compute the coefficient on (1,−1); for covariance diag(9,1), compute its leading variance fraction.",
        "answer": [
          0.5,
          0.9
        ],
        "labels": [
          "difference-mode eigenvalue",
          "retained fraction"
        ],
        "explanation": "P(1,−1)=(0.5,−0.5), so the nonstationary eigenvalue is 0.5. The variance fraction is 9/(9+1)=0.9; symmetry gives stationary p₁=0.5."
      }
    ]
  }
];
