/* Original missions; source links support further study, not copied exercises. */
(function(){
'use strict';
const sources = {
 core: {title:'MIT OpenCourseWare 18.06 — Linear Algebra: calendar',url:'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/calendar/',description:'Gilbert Strang; Spring 2010. Core linear algebra topic sequence.',verified:'2026-11-18'},
 syllabus: {title:'MIT OpenCourseWare 18.06 — syllabus',url:'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/syllabus/',description:'Course scope, prerequisites and learning context.',verified:'2026-11-18'},
 applied: {title:'MIT OpenCourseWare 18.065 — Matrix Methods: calendar',url:'https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/pages/calendar/',description:'Gilbert Strang; Spring 2018. Applied matrix, Fourier, convolution and optimization topics.',verified:'2026-11-18'},
 text: {title:'UC Davis — Linear Algebra open textbook',url:'https://www.math.ucdavis.edu/~linear/linear-guest.pdf',description:'Open textbook by David Cherney, Tom Denton, Rohit Thomas and Andrew Waldron; vector spaces, linear maps and matrix methods.',verified:'2026-11-18'}
};
window.CURRICULUM_SOURCES=Object.values(sources);
window.CURRICULUM_SCOPE='A finite, original 68-mission engineering survey of foundational and selected advanced linear algebra: vectors, systems, spaces, decompositions, spectra, optimization, networks, signals and numerical methods. Topic coverage is cross-checked against MIT OpenCourseWare 18.06 and selected 18.065 topics, with UC Davis open-text support. Missions are introductory worked practice, not a complete university course or proof-based treatment. Neural networks, stochastic optimization, randomized algorithms, full FFT implementation and advanced functional analysis are outside this survey. Sources are further reading; MIT and UC Davis do not endorse this game. External readings require internet access; lessons and exercises remain available offline.';
const additions = [
  {
    "id": "q51",
    "title": "Redundant actuator",
    "topic": "Span and linear dependence",
    "tier": "Intermediate",
    "sector": "Rover Bay",
    "brief": "Redundant actuator. Complete the engineering check.",
    "lesson": "The span contains all linear combinations. A dependent vector adds no new direction; a basis removes redundancy without changing the span.",
    "prompt": "Actuator vectors are u=(1,0), v=(0,1), w=(2,3). Enter coefficients a,b in w=au+bv, then the dimension of their span.",
    "answer": [
      2,
      3,
      2
    ],
    "labels": [
      "a",
      "b",
      "dimension"
    ],
    "tolerance": 0.01,
    "hints": [
      "Compare x coordinates: a=2.",
      "u and v are independent, so the span has dimension 2; w adds no dimension."
    ],
    "solution": "Compare x coordinates: a=2. Compare y coordinates: b=3. u and v are independent, so the span has dimension 2; w adds no dimension.",
    "xp": 180,
    "prereqs": [
      "q13",
      "q15"
    ],
    "teaching": {
      "intuition": "The span contains all linear combinations. A dependent vector adds no new direction; a basis removes redundancy without changing the span.",
      "steps": [
        "Compare x coordinates: a=2.",
        "Compare y coordinates: b=3.",
        "u and v are independent, so the span has dimension 2; w adds no dimension."
      ],
      "example": {
        "prompt": "For u=(1,0), v=(0,1), express (4,−2) and find the span dimension.",
        "steps": [
          "Read its x and y components as coefficients.",
          "Both coordinate directions remain independent."
        ],
        "answer": "4u−2v; dimension 2."
      },
      "pitfalls": [
        "Three listed vectors need not span three dimensions.",
      "Check whether a new vector adds a direction instead of counting the list length."
      ]
    },
    "guidance": [
      {
        "prompt": "Which coefficient of u gives the target x coordinate 2?",
        "answer": [
          2
        ],
        "labels": [
          "a"
        ],
        "explanation": "Only u contributes to x."
      },
      {
        "prompt": "Actuator vectors are u=(1,0), v=(0,1), w=(2,3). Enter coefficients a,b in w=au+bv, then the dimension of their span.",
        "answer": [
          2,
          3,
          2
        ],
        "labels": [
          "a",
          "b",
          "dimension"
        ],
        "explanation": "Compare x coordinates: a=2. Compare y coordinates: b=3. u and v are independent, so the span has dimension 2; w adds no dimension."
      }
    ]
  },
  {
    "id": "q52",
    "title": "Compatible power commands",
    "topic": "Consistency and free variables",
    "tier": "Intermediate",
    "sector": "Power Grid",
    "brief": "Compatible power commands. Complete the engineering check.",
    "lesson": "A system is consistent when its right side lies in the column space. Dependent equations can leave free variables; a contradictory zero row makes the system inconsistent.",
    "prompt": "Commands satisfy x+2y=5 and 2x+4y=10. Let y=t. Enter the constant and t coefficient in x=c+kt, then number of free variables.",
    "answer": [
      5,
      -2,
      1
    ],
    "labels": [
      "c",
      "k",
      "free variables"
    ],
    "tolerance": 0.01,
    "hints": [
      "The second equation is twice the first, so no contradiction occurs.",
      "One nonpivot variable y is free."
    ],
    "solution": "The second equation is twice the first, so no contradiction occurs. Solve the first equation: x=5−2t and y=t. One nonpivot variable y is free.",
    "xp": 180,
    "prereqs": [
      "q14",
      "q44"
    ],
    "teaching": {
      "intuition": "A system is consistent when its right side lies in the column space. Dependent equations can leave free variables; a contradictory zero row makes the system inconsistent.",
      "steps": [
        "The second equation is twice the first, so no contradiction occurs.",
        "Solve the first equation: x=5−2t and y=t.",
        "One nonpivot variable y is free."
      ],
      "example": {
        "prompt": "Solve x+3y=7 and 2x+6y=14 with y=t.",
        "steps": [
          "The second row is redundant.",
          "Isolate x=7−3t."
        ],
        "answer": "x=7−3t, y=t; one free variable."
      },
      "pitfalls": [
        "A free variable does not mean the equations are inconsistent.",
      "Substitute a proposed particular solution back into every original equation."
      ]
    },
    "guidance": [
      {
        "prompt": "At t=0, what is x?",
        "answer": [
          5
        ],
        "labels": [
          "c"
        ],
        "explanation": "Substitute y=0 in x+2y=5."
      },
      {
        "prompt": "Commands satisfy x+2y=5 and 2x+4y=10. Let y=t. Enter the constant and t coefficient in x=c+kt, then number of free variables.",
        "answer": [
          5,
          -2,
          1
        ],
        "labels": [
          "c",
          "k",
          "free variables"
        ],
        "explanation": "The second equation is twice the first, so no contradiction occurs. Solve the first equation: x=5−2t and y=t. One nonpivot variable y is free."
      }
    ]
  },
  {
    "id": "q53",
    "title": "Rectangular decoder",
    "topic": "Left and right inverses",
    "tier": "Intermediate",
    "sector": "Sensor Array",
    "brief": "Rectangular decoder. Complete the engineering check.",
    "lesson": "A tall full-column-rank matrix can have a left inverse L with LA=I. A wide full-row-rank matrix can have a right inverse R with AR=I; these are different conditions.",
    "prompt": "A maps x to (x,2x). L=[a,b] must recover x. Choose the minimum-norm L=Aᵀ/(AᵀA). Enter a,b.",
    "answer": [
      0.2,
      0.4
    ],
    "labels": [
      "a",
      "b"
    ],
    "tolerance": 0.01,
    "hints": [
      "AᵀA=1²+2²=5.",
      "Check LA=0.2+0.8=1; AL is a 2×2 projection, not I₂."
    ],
    "solution": "AᵀA=1²+2²=5. L=[1,2]/5=[0.2,0.4]. Check LA=0.2+0.8=1; AL is a 2×2 projection, not I₂.",
    "xp": 180,
    "prereqs": [
      "q10",
      "q13"
    ],
    "teaching": {
      "intuition": "A tall full-column-rank matrix can have a left inverse L with LA=I. A wide full-row-rank matrix can have a right inverse R with AR=I; these are different conditions.",
      "steps": [
        "AᵀA=1²+2²=5.",
        "L=[1,2]/5=[0.2,0.4].",
        "Check LA=0.2+0.8=1; AL is a 2×2 projection, not I₂."
      ],
      "example": {
        "prompt": "A maps x to (x,3x). Find its minimum-norm left inverse.",
        "steps": [
          "AᵀA=10.",
          "Divide [1,3] by 10."
        ],
        "answer": "[0.1,0.3]."
      },
      "pitfalls": [
        "A rectangular matrix cannot have a two-sided inverse.",
      "Check which side of an inverse identity is dimensionally possible."
      ]
    },
    "guidance": [
      {
        "prompt": "What is the first entry 1/(1²+2²)?",
        "answer": [
          0.2
        ],
        "labels": [
          "a"
        ],
        "explanation": "The denominator is the squared column norm 5."
      },
      {
        "prompt": "A maps x to (x,2x). L=[a,b] must recover x. Choose the minimum-norm L=Aᵀ/(AᵀA). Enter a,b.",
        "answer": [
          0.2,
          0.4
        ],
        "labels": [
          "a",
          "b"
        ],
        "explanation": "AᵀA=1²+2²=5. L=[1,2]/5=[0.2,0.4]. Check LA=0.2+0.8=1; AL is a 2×2 projection, not I₂."
      }
    ]
  },
  {
    "id": "q54",
    "title": "Pipeline conservation",
    "topic": "Incidence matrices and flow",
    "tier": "Intermediate",
    "sector": "Network Hub",
    "brief": "Pipeline conservation. Complete the engineering check.",
    "lesson": "A directed incidence column has −1 at the source and +1 at the destination. Multiplying by edge flows gives net inflow at each node; totals cancel.",
    "prompt": "Edges are A→B and B→C with flows 4 and 3. Enter net inflows at A,B,C.",
    "answer": [
      -4,
      1,
      3
    ],
    "labels": [
      "A inflow",
      "B inflow",
      "C inflow"
    ],
    "tolerance": 0.01,
    "hints": [
      "A only sends 4, giving −4.",
      "C receives 3; sum −4+1+3=0."
    ],
    "solution": "A only sends 4, giving −4. B receives 4 and sends 3, giving 1. C receives 3; sum −4+1+3=0.",
    "xp": 180,
    "prereqs": [
      "q39",
      "q06"
    ],
    "teaching": {
      "intuition": "A directed incidence column has −1 at the source and +1 at the destination. Multiplying by edge flows gives net inflow at each node; totals cancel.",
      "steps": [
        "A only sends 4, giving −4.",
        "B receives 4 and sends 3, giving 1.",
        "C receives 3; sum −4+1+3=0."
      ],
      "example": {
        "prompt": "Flows on A→B and B→C are 6 and 2. Find node net inflows.",
        "steps": [
          "A contributes −6.",
          "B has 6−2=4; C has 2."
        ],
        "answer": "(−6,4,2)."
      },
      "pitfalls": [
        "Net inflow uses signed incidence, not unsigned adjacency.",
      "Keep each edge orientation consistent when assembling incidence columns."
      ]
    },
    "guidance": [
      {
        "prompt": "What is the net inflow at A? ",
        "answer": [
          -4
        ],
        "labels": [
          "A inflow"
        ],
        "explanation": "The edge leaves A so its incidence sign is negative."
      },
      {
        "prompt": "Edges are A→B and B→C with flows 4 and 3. Enter net inflows at A,B,C.",
        "answer": [
          -4,
          1,
          3
        ],
        "labels": [
          "A inflow",
          "B inflow",
          "C inflow"
        ],
        "explanation": "A only sends 4, giving −4. B receives 4 and sends 3, giving 1. C receives 3; sum −4+1+3=0."
      }
    ]
  },
  {
    "id": "q55",
    "title": "Four-sample beacon",
    "topic": "Discrete Fourier transform and FFT",
    "tier": "Advanced",
    "sector": "Signal Forge",
    "brief": "Four-sample beacon. Complete the engineering check.",
    "lesson": "The DFT resolves samples into frequency modes. Use Xₖ=Σₙxₙ exp(−2πikn/N); the FFT evaluates this same transform efficiently by splitting even and odd samples.",
    "prompt": "For samples x=(1,0,−1,0), use the unnormalized four-point DFT. Enter the real values X₀,X₁,X₂,X₃ (all imaginary parts are zero).",
    "answer": [
      0,
      2,
      0,
      2
    ],
    "labels": [
      "X0",
      "X1",
      "X2",
      "X3"
    ],
    "tolerance": 0.01,
    "hints": [
      "X₀=1−1=0.",
      "For k=2 the n=2 factor is +1, so X₂=0."
    ],
    "solution": "X₀=1−1=0. For k=1 and k=3, the n=2 factor is −1, so 1+(−1)(−1)=2. For k=2 the n=2 factor is +1, so X₂=0.",
    "xp": 180,
    "prereqs": [
      "q34",
      "q35"
    ],
    "teaching": {
      "intuition": "The DFT resolves samples into frequency modes. Use Xₖ=Σₙxₙ exp(−2πikn/N); the FFT evaluates this same transform efficiently by splitting even and odd samples.",
      "steps": [
        "X₀=1−1=0.",
        "For k=1 and k=3, the n=2 factor is −1, so 1+(−1)(−1)=2.",
        "For k=2 the n=2 factor is +1, so X₂=0."
      ],
      "example": {
        "prompt": "Find the two-point DFT of (3,1).",
        "steps": [
          "DC is the sum 3+1.",
          "The other frequency is the difference 3−1."
        ],
        "answer": "(4,2)."
      },
      "pitfalls": [
        "FFT changes the algorithm, not the transform or normalization.",
      "State the normalization convention before comparing coefficient magnitudes."
      ]
    },
    "guidance": [
      {
        "prompt": "What is X₀, the sum of the four samples?",
        "answer": [
          0
        ],
        "labels": [
          "X0"
        ],
        "explanation": "DC measures the total signal before normalization."
      },
      {
        "prompt": "For samples x=(1,0,−1,0), use the unnormalized four-point DFT. Enter the real values X₀,X₁,X₂,X₃ (all imaginary parts are zero).",
        "answer": [
          0,
          2,
          0,
          2
        ],
        "labels": [
          "X0",
          "X1",
          "X2",
          "X3"
        ],
        "explanation": "X₀=1−1=0. For k=1 and k=3, the n=2 factor is −1, so 1+(−1)(−1)=2. For k=2 the n=2 factor is +1, so X₂=0."
      }
    ]
  },
  {
    "id": "q56",
    "title": "Iterative thermal solve",
    "topic": "Jacobi iteration",
    "tier": "Advanced",
    "sector": "Power Grid",
    "brief": "Iterative thermal solve. Complete the engineering check.",
    "lesson": "Jacobi iteration solves each row for its diagonal variable, using only the previous iterate for other variables. Strict diagonal dominance is a sufficient convergence condition.",
    "prompt": "For 4x+y=9 and x+3y=7, start (x₀,y₀)=(0,0). Enter x₁,y₁ after one simultaneous Jacobi step.",
    "answer": [
      2.25,
      2.3333333333333335
    ],
    "labels": [
      "x1",
      "y1"
    ],
    "tolerance": 0.01,
    "hints": [
      "Isolate x=(9−y)/4 and y=(7−x)/3.",
      "Use old x₀=0 to obtain y₁=7/3."
    ],
    "solution": "Isolate x=(9−y)/4 and y=(7−x)/3. Use old y₀=0 to obtain x₁=9/4. Use old x₀=0 to obtain y₁=7/3.",
    "xp": 180,
    "prereqs": [
      "q11",
      "q30"
    ],
    "teaching": {
      "intuition": "Jacobi iteration solves each row for its diagonal variable, using only the previous iterate for other variables. Strict diagonal dominance is a sufficient convergence condition.",
      "steps": [
        "Isolate x=(9−y)/4 and y=(7−x)/3.",
        "Use old y₀=0 to obtain x₁=9/4.",
        "Use old x₀=0 to obtain y₁=7/3."
      ],
      "example": {
        "prompt": "For 5x+y=10, x+4y=8, start at zero and take one Jacobi step.",
        "steps": [
          "Use y₀=0 in the first row.",
          "Use x₀=0 in the second row."
        ],
        "answer": "(2,2)."
      },
      "pitfalls": [
        "Using newly computed x₁ for y₁ would be Gauss–Seidel, not Jacobi.",
      "Use only the previous iteration values on every Jacobi update."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute (9−0)/4.",
        "answer": [
          2.25
        ],
        "labels": [
          "x1"
        ],
        "explanation": "The first iterate uses the previous y value."
      },
      {
        "prompt": "For 4x+y=9 and x+3y=7, start (x₀,y₀)=(0,0). Enter x₁,y₁ after one simultaneous Jacobi step.",
        "answer": [
          2.25,
          2.3333333333333335
        ],
        "labels": [
          "x1",
          "y1"
        ],
        "explanation": "Isolate x=(9−y)/4 and y=(7−x)/3. Use old y₀=0 to obtain x₁=9/4. Use old x₀=0 to obtain y₁=7/3."
      }
    ]
  },
  {
    "id": "q57",
    "title": "Decay controller",
    "topic": "Matrix exponential and differential systems",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Decay controller. Complete the engineering check.",
    "lesson": "For a constant matrix A, x(t)=exp(tA)x(0) solves x′=Ax. A diagonal A exponentiates each diagonal entry; eigenvalues control growth and decay.",
    "prompt": "A=diag(0,−2), x(0)=(3,4). At time t=ln(2), enter x(t).",
    "answer": [
      3,
      1
    ],
    "labels": [
      "x1",
      "x2"
    ],
    "tolerance": 0.01,
    "hints": [
      "The first component is 3exp(0t)=3.",
      "Zero eigenvalues preserve a component; negative ones decay."
    ],
    "solution": "The first component is 3exp(0t)=3. The second is 4exp(−2ln2)=4/4=1. Zero eigenvalues preserve a component; negative ones decay.",
    "xp": 180,
    "prereqs": [
      "q25"
    ],
    "teaching": {
      "intuition": "For a constant matrix A, x(t)=exp(tA)x(0) solves x′=Ax. A diagonal A exponentiates each diagonal entry; eigenvalues control growth and decay.",
      "steps": [
        "The first component is 3exp(0t)=3.",
        "The second is 4exp(−2ln2)=4/4=1.",
        "Zero eigenvalues preserve a component; negative ones decay."
      ],
      "example": {
        "prompt": "For A=diag(0,−1), x(0)=(2,6), evaluate at ln(3).",
        "steps": [
          "First component stays 2.",
          "Second is 6/3."
        ],
        "answer": "(2,2)."
      },
      "pitfalls": [
        "exp(tA) is not obtained by exponentiating every matrix entry independently for general A.",
      "Retain powers of the full matrix when expanding the exponential series."
      ]
    },
    "guidance": [
      {
        "prompt": "What is the unchanged first component?",
        "answer": [
          3
        ],
        "labels": [
          "x1"
        ],
        "explanation": "Its differential equation is x₁′=0."
      },
      {
        "prompt": "A=diag(0,−2), x(0)=(3,4). At time t=ln(2), enter x(t).",
        "answer": [
          3,
          1
        ],
        "labels": [
          "x1",
          "x2"
        ],
        "explanation": "The first component is 3exp(0t)=3. The second is 4exp(−2ln2)=4/4=1. Zero eigenvalues preserve a component; negative ones decay."
      }
    ]
  },
  {
    "id": "q58",
    "title": "Polynomial trajectory space",
    "topic": "General vector spaces and polynomials",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Polynomial trajectory space. Complete the engineering check.",
    "lesson": "Polynomials of degree at most two form a vector space with basis (1,t,t²). Coefficients are coordinates, and differentiation is a linear map between polynomial spaces.",
    "prompt": "For p(t)=2−3t+4t², enter coordinates of p′(t) in basis (1,t).",
    "answer": [
      -3,
      8
    ],
    "labels": [
      "constant",
      "t coefficient"
    ],
    "tolerance": 0.01,
    "hints": [
      "Differentiate the constant 2 to zero.",
      "The derivative of 4t² is 8t, giving coordinates (−3,8)."
    ],
    "solution": "Differentiate the constant 2 to zero. The derivative of −3t is −3. The derivative of 4t² is 8t, giving coordinates (−3,8).",
    "xp": 180,
    "prereqs": [
      "q15",
      "q17"
    ],
    "teaching": {
      "intuition": "Polynomials of degree at most two form a vector space with basis (1,t,t²). Coefficients are coordinates, and differentiation is a linear map between polynomial spaces.",
      "steps": [
        "Differentiate the constant 2 to zero.",
        "The derivative of −3t is −3.",
        "The derivative of 4t² is 8t, giving coordinates (−3,8)."
      ],
      "example": {
        "prompt": "Differentiate 5+2t−3t² and give coordinates in (1,t).",
        "steps": [
          "Differentiate each basis term.",
          "The derivative is 2−6t."
        ],
        "answer": "(2,−6)."
      },
      "pitfalls": [
        "Coordinates depend on the stated basis; a polynomial is not a point sample.",
      "Keep basis coefficients distinct from evaluating the polynomial at one input."
      ]
    },
    "guidance": [
      {
        "prompt": "What is the constant coefficient of p′? ",
        "answer": [
          -3
        ],
        "labels": [
          "constant"
        ],
        "explanation": "The linear term contributes −3."
      },
      {
        "prompt": "For p(t)=2−3t+4t², enter coordinates of p′(t) in basis (1,t).",
        "answer": [
          -3,
          8
        ],
        "labels": [
          "constant",
          "t coefficient"
        ],
        "explanation": "Differentiate the constant 2 to zero. The derivative of −3t is −3. The derivative of 4t² is 8t, giving coordinates (−3,8)."
      }
    ]
  },
  {
    "id": "q59",
    "title": "Sensor as a functional",
    "topic": "Dual vectors and linear functionals",
    "tier": "Advanced",
    "sector": "Sensor Array",
    "brief": "Sensor as a functional. Complete the engineering check.",
    "lesson": "A linear functional maps a vector to one scalar. Its row coordinates act on column coordinates; after x=Bc, the functional row becomes ℓB in the new basis.",
    "prompt": "A sensor reads ℓ(x)=2x₁−x₂. The new basis columns are b₁=(1,1), b₂=(1,−1). Enter the two coefficients of ℓ in this basis.",
    "answer": [
      1,
      3
    ],
    "labels": [
      "ℓ(b1)",
      "ℓ(b2)"
    ],
    "tolerance": 0.01,
    "hints": [
      "Evaluate ℓ(b₁)=2−1=1.",
      "Thus ℓ(Bc)=c₁+3c₂."
    ],
    "solution": "Evaluate ℓ(b₁)=2−1=1. Evaluate ℓ(b₂)=2+1=3. Thus ℓ(Bc)=c₁+3c₂.",
    "xp": 180,
    "prereqs": [
      "q15",
      "q03"
    ],
    "teaching": {
      "intuition": "A linear functional maps a vector to one scalar. Its row coordinates act on column coordinates; after x=Bc, the functional row becomes ℓB in the new basis.",
      "steps": [
        "Evaluate ℓ(b₁)=2−1=1.",
        "Evaluate ℓ(b₂)=2+1=3.",
        "Thus ℓ(Bc)=c₁+3c₂."
      ],
      "example": {
        "prompt": "For ℓ(x)=x₁+3x₂ and basis (1,0),(1,1), find the functional coordinates.",
        "steps": [
          "Evaluate ℓ(1,0)=1.",
          "Evaluate ℓ(1,1)=4."
        ],
        "answer": "(1,4)."
      },
      "pitfalls": [
        "A functional transforms as a row ℓB, not as the vector coordinates B⁻¹x.",
      "Track whether the functional acts on the left or a vector acts on the right."
      ]
    },
    "guidance": [
      {
        "prompt": "Evaluate 2(1)−1 for the first basis vector.",
        "answer": [
          1
        ],
        "labels": [
          "ℓ(b1)"
        ],
        "explanation": "The dual coefficients are the readings on each basis vector."
      },
      {
        "prompt": "A sensor reads ℓ(x)=2x₁−x₂. The new basis columns are b₁=(1,1), b₂=(1,−1). Enter the two coefficients of ℓ in this basis.",
        "answer": [
          1,
          3
        ],
        "labels": [
          "ℓ(b1)",
          "ℓ(b2)"
        ],
        "explanation": "Evaluate ℓ(b₁)=2−1=1. Evaluate ℓ(b₂)=2+1=3. Thus ℓ(Bc)=c₁+3c₂."
      }
    ]
  },
  {
    "id": "q60",
    "title": "Mass-weighted vibration",
    "topic": "Generalized eigenproblems",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Mass-weighted vibration. Complete the engineering check.",
    "lesson": "Vibration modes satisfy Kv=λMv, where stiffness K and positive definite mass M use different physical units. The frequency is √λ; solve the pair, not K alone.",
    "prompt": "K=diag(8,18), M=diag(2,2). Enter the two generalized eigenvalues in ascending order.",
    "answer": [
      4,
      9
    ],
    "labels": [
      "lambda1",
      "lambda2"
    ],
    "tolerance": 0.01,
    "hints": [
      "For mode e₁, 8=λ·2, so λ=4.",
      "Their natural angular frequencies are 2 and 3."
    ],
    "solution": "For mode e₁, 8=λ·2, so λ=4. For mode e₂, 18=λ·2, so λ=9. Their natural angular frequencies are 2 and 3.",
    "xp": 180,
    "prereqs": [
      "q24",
      "q32"
    ],
    "teaching": {
      "intuition": "Vibration modes satisfy Kv=λMv, where stiffness K and positive definite mass M use different physical units. The frequency is √λ; solve the pair, not K alone.",
      "steps": [
        "For mode e₁, 8=λ·2, so λ=4.",
        "For mode e₂, 18=λ·2, so λ=9.",
        "Their natural angular frequencies are 2 and 3."
      ],
      "example": {
        "prompt": "K=diag(6,20), M=diag(2,5). Find generalized eigenvalues.",
        "steps": [
          "Divide each stiffness by its corresponding mass.",
          "6/2=3 and 20/5=4."
        ],
        "answer": "(3,4)."
      },
      "pitfalls": [
        "Eigenvalues of K alone ignore mass and give the wrong vibration model.",
      "Use the same mass matrix in the generalized eigen-equation and normalization."
      ]
    },
    "guidance": [
      {
        "prompt": "What is 8/2 for the first mode?",
        "answer": [
          4
        ],
        "labels": [
          "lambda1"
        ],
        "explanation": "The mass scales the eigenvalue equation."
      },
      {
        "prompt": "K=diag(8,18), M=diag(2,2). Enter the two generalized eigenvalues in ascending order.",
        "answer": [
          4,
          9
        ],
        "labels": [
          "lambda1",
          "lambda2"
        ],
        "explanation": "For mode e₁, 8=λ·2, so λ=4. For mode e₂, 18=λ·2, so λ=9. Their natural angular frequencies are 2 and 3."
      }
    ]
  },
  {
    "id": "q61",
    "title": "Coupled subsystem elimination",
    "topic": "Block matrices and Schur complements",
    "tier": "Advanced",
    "sector": "Power Grid",
    "brief": "Coupled subsystem elimination. Complete the engineering check.",
    "lesson": "A block system can eliminate one subsystem first. For ax+by=f and cx+dy=g with a invertible, substitution gives (d−ca⁻¹b)y=g−ca⁻¹f; the coefficient is a Schur complement.",
    "prompt": "Solve 2x+y=5 and x+3y=5 by eliminating x. Enter the Schur coefficient S, y, then x.",
    "answer": [
      2.5,
      1,
      2
    ],
    "labels": [
      "S",
      "y",
      "x"
    ],
    "tolerance": 0.01,
    "hints": [
      "From the first row, x=(5−y)/2.",
      "Thus y=1 and x=2."
    ],
    "solution": "From the first row, x=(5−y)/2. S=3−1·(1/2)·1=2.5 and reduced right side is 5−2.5=2.5. Thus y=1 and x=2.",
    "xp": 180,
    "prereqs": [
      "q12",
      "q08"
    ],
    "teaching": {
      "intuition": "A block system can eliminate one subsystem first. For ax+by=f and cx+dy=g with a invertible, substitution gives (d−ca⁻¹b)y=g−ca⁻¹f; the coefficient is a Schur complement.",
      "steps": [
        "From the first row, x=(5−y)/2.",
        "S=3−1·(1/2)·1=2.5 and reduced right side is 5−2.5=2.5.",
        "Thus y=1 and x=2."
      ],
      "example": {
        "prompt": "For 2x+y=4 and x+2y=5, find the Schur coefficient.",
        "steps": [
          "Eliminate x using x=(4−y)/2.",
          "The coefficient is 2−1/2."
        ],
        "answer": "S=1.5; y=2 and x=1."
      },
      "pitfalls": [
        "Block multiplication preserves order; general matrix blocks do not commute.",
      "Check the dimensions of each block product before adding results."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute 3−1/2.",
        "answer": [
          2.5
        ],
        "labels": [
          "S"
        ],
        "explanation": "This is the coefficient left after removing x."
      },
      {
        "prompt": "Solve 2x+y=5 and x+3y=5 by eliminating x. Enter the Schur coefficient S, y, then x.",
        "answer": [
          2.5,
          1,
          2
        ],
        "labels": [
          "S",
          "y",
          "x"
        ],
        "explanation": "From the first row, x=(5−y)/2. S=3−1·(1/2)·1=2.5 and reduced right side is 5−2.5=2.5. Thus y=1 and x=2."
      }
    ]
  },
  {
    "id": "q62",
    "title": "Coordinate rerouting",
    "topic": "Permutation and orthogonal matrices",
    "tier": "Advanced",
    "sector": "Rover Bay",
    "brief": "Coordinate rerouting. Complete the engineering check.",
    "lesson": "A permutation matrix reorders coordinates and is orthogonal: PᵀP=I. Orthogonal transformations preserve lengths and dot products, including reflections and permutations.",
    "prompt": "P swaps the first and third coordinates. For x=(2,−1,3), enter Px and its squared norm.",
    "answer": [
      3,
      -1,
      2,
      14
    ],
    "labels": [
      "new x",
      "new y",
      "new z",
      "squared norm"
    ],
    "tolerance": 0.01,
    "hints": [
      "Swap the first and third entries: Px=(3,−1,2).",
      "The original squared norm is also 4+1+9=14."
    ],
    "solution": "Swap the first and third entries: Px=(3,−1,2). Its squared norm is 9+1+4=14. The original squared norm is also 4+1+9=14.",
    "xp": 180,
    "prereqs": [
      "q43",
      "q19"
    ],
    "teaching": {
      "intuition": "A permutation matrix reorders coordinates and is orthogonal: PᵀP=I. Orthogonal transformations preserve lengths and dot products, including reflections and permutations.",
      "steps": [
        "Swap the first and third entries: Px=(3,−1,2).",
        "Its squared norm is 9+1+4=14.",
        "The original squared norm is also 4+1+9=14."
      ],
      "example": {
        "prompt": "Swap two coordinates of (3,4). Find the result and norm.",
        "steps": [
          "The result is (4,3).",
          "Its norm remains √25."
        ],
        "answer": "(4,3), norm 5."
      },
      "pitfalls": [
        "Orthogonal does not necessarily mean a rotation; reflections also qualify.",
      "Use the determinant sign to distinguish orientation-preserving rotations."
      ]
    },
    "guidance": [
      {
        "prompt": "What is the first coordinate after the swap?",
        "answer": [
          3
        ],
        "labels": [
          "new x"
        ],
        "explanation": "The first output reads the third input."
      },
      {
        "prompt": "P swaps the first and third coordinates. For x=(2,−1,3), enter Px and its squared norm.",
        "answer": [
          3,
          -1,
          2,
          14
        ],
        "labels": [
          "new x",
          "new y",
          "new z",
          "squared norm"
        ],
        "explanation": "Swap the first and third entries: Px=(3,−1,2). Its squared norm is 9+1+4=14. The original squared norm is also 4+1+9=14."
      }
    ]
  },
  {
    "id": "q63",
    "title": "Sparse heat stencil",
    "topic": "Sparse matrices and storage",
    "tier": "Advanced",
    "sector": "Power Grid",
    "brief": "Sparse heat stencil. Complete the engineering check.",
    "lesson": "Sparse matrices store only significant entries. A local one-dimensional diffusion stencil has diagonal 2 and adjacent entries −1; matrix-vector products can use this pattern without storing a dense array.",
    "prompt": "A is 4×4 with diagonal 2 and adjacent diagonals −1, all else zero. For x=(1,2,2,1), enter Ax, then the number of nonzero matrix entries.",
    "answer": [
      0,
      1,
      1,
      0,
      10
    ],
    "labels": [
      "row1",
      "row2",
      "row3",
      "row4",
      "nonzeros"
    ],
    "tolerance": 0.01,
    "hints": [
      "Rows give 2−2=0; −1+4−2=1.",
      "There are 4 diagonal and 3+3 off-diagonal entries, totaling 10."
    ],
    "solution": "Rows give 2−2=0; −1+4−2=1. The remaining rows give −2+4−1=1 and −2+2=0. There are 4 diagonal and 3+3 off-diagonal entries, totaling 10.",
    "xp": 180,
    "prereqs": [
      "q06",
      "q43"
    ],
    "teaching": {
      "intuition": "Sparse matrices store only significant entries. A local one-dimensional diffusion stencil has diagonal 2 and adjacent entries −1; matrix-vector products can use this pattern without storing a dense array.",
      "steps": [
        "Rows give 2−2=0; −1+4−2=1.",
        "The remaining rows give −2+4−1=1 and −2+2=0.",
        "There are 4 diagonal and 3+3 off-diagonal entries, totaling 10."
      ],
      "example": {
        "prompt": "For the analogous 3×3 matrix and x=(1,1,1), compute Ax.",
        "steps": [
          "Boundary rows are 2−1.",
          "The interior row is −1+2−1."
        ],
        "answer": "(1,0,1), with 7 nonzeros."
      },
      "pitfalls": [
        "Zeros still define matrix shape but need not occupy storage slots.",
      "Do not infer dimensions from the nonzero entries alone."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the first row: 2·1−2.",
        "answer": [
          0
        ],
        "labels": [
          "row1"
        ],
        "explanation": "The first node has only one neighbor in this stencil."
      },
      {
        "prompt": "A is 4×4 with diagonal 2 and adjacent diagonals −1, all else zero. For x=(1,2,2,1), enter Ax, then the number of nonzero matrix entries.",
        "answer": [
          0,
          1,
          1,
          0,
          10
        ],
        "labels": [
          "row1",
          "row2",
          "row3",
          "row4",
          "nonzeros"
        ],
        "explanation": "Rows give 2−2=0; −1+4−2=1. The remaining rows give −2+4−1=1 and −2+2=0. There are 4 diagonal and 3+3 off-diagonal entries, totaling 10."
      }
    ]
  },
  {
    "id": "q64",
    "title": "Stable calibration",
    "topic": "Ridge regularization",
    "tier": "Advanced",
    "sector": "Sensor Array",
    "brief": "Stable calibration. Complete the engineering check.",
    "lesson": "Ridge regression minimizes ||Ax−b||²+λ||x||² for λ>0. Its equation (AᵀA+λI)x=Aᵀb trades exact fit for smaller, more stable coefficients.",
    "prompt": "A=diag(1,2), b=(2,4), λ=1. Enter the ridge solution x.",
    "answer": [
      1,
      1.6
    ],
    "labels": [
      "x1",
      "x2"
    ],
    "tolerance": 0.01,
    "hints": [
      "AᵀA+I=diag(2,5).",
      "Divide coordinatewise: x=(1,8/5)=(1,1.6)."
    ],
    "solution": "AᵀA+I=diag(2,5). Aᵀb=(2,8). Divide coordinatewise: x=(1,8/5)=(1,1.6).",
    "xp": 180,
    "prereqs": [
      "q21",
      "q30"
    ],
    "teaching": {
      "intuition": "Ridge regression minimizes ||Ax−b||²+λ||x||² for λ>0. Its equation (AᵀA+λI)x=Aᵀb trades exact fit for smaller, more stable coefficients.",
      "steps": [
        "AᵀA+I=diag(2,5).",
        "Aᵀb=(2,8).",
        "Divide coordinatewise: x=(1,8/5)=(1,1.6)."
      ],
      "example": {
        "prompt": "For A=I, b=(6,2), λ=2, find the ridge solution.",
        "steps": [
          "The coefficient matrix is 3I.",
          "Divide b by 3."
        ],
        "answer": "(2,2/3)."
      },
      "pitfalls": [
        "The penalty changes the target problem; it is not merely a faster exact solve.",
      "Choose the regularization strength with the bias tradeoff in mind."
      ]
    },
    "guidance": [
      {
        "prompt": "What is the first component 2/(1+1)?",
        "answer": [
          1
        ],
        "labels": [
          "x1"
        ],
        "explanation": "The regularized diagonal is 2."
      },
      {
        "prompt": "A=diag(1,2), b=(2,4), λ=1. Enter the ridge solution x.",
        "answer": [
          1,
          1.6
        ],
        "labels": [
          "x1",
          "x2"
        ],
        "explanation": "AᵀA+I=diag(2,5). Aᵀb=(2,8). Divide coordinatewise: x=(1,8/5)=(1,1.6)."
      }
    ]
  },
  {
    "id": "q65",
    "title": "Spatial gradient grid",
    "topic": "Finite differences as linear maps",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Spatial gradient grid. Complete the engineering check.",
    "lesson": "Finite differences turn sampled fields into discrete derivatives. A forward difference approximates f′ at a grid interval by (fᵢ₊₁−fᵢ)/h; spacing and boundary choices are part of the model.",
    "prompt": "Temperature samples are (1,4,9) at positions (0,0.5,1). Enter the two forward differences.",
    "answer": [
      6,
      10
    ],
    "labels": [
      "first slope",
      "second slope"
    ],
    "tolerance": 0.01,
    "hints": [
      "The common spacing is h=0.5.",
      "Second slope is (9−4)/0.5=10."
    ],
    "solution": "The common spacing is h=0.5. First slope is (4−1)/0.5=6. Second slope is (9−4)/0.5=10.",
    "xp": 180,
    "prereqs": [
      "q17",
      "q54"
    ],
    "teaching": {
      "intuition": "Finite differences turn sampled fields into discrete derivatives. A forward difference approximates f′ at a grid interval by (fᵢ₊₁−fᵢ)/h; spacing and boundary choices are part of the model.",
      "steps": [
        "The common spacing is h=0.5.",
        "First slope is (4−1)/0.5=6.",
        "Second slope is (9−4)/0.5=10."
      ],
      "example": {
        "prompt": "Samples (2,6,12) are spaced by h=2. Find forward differences.",
        "steps": [
          "Subtract consecutive samples.",
          "Divide differences 4 and 6 by 2."
        ],
        "answer": "(2,3)."
      },
      "pitfalls": [
        "A difference without division by spacing has the wrong derivative units.",
      "Keep the grid spacing in the denominator, especially on non-unit grids."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the first change divided by spacing: (4−1)/0.5.",
        "answer": [
          6
        ],
        "labels": [
          "first slope"
        ],
        "explanation": "The derivative is change per unit distance."
      },
      {
        "prompt": "Temperature samples are (1,4,9) at positions (0,0.5,1). Enter the two forward differences.",
        "answer": [
          6,
          10
        ],
        "labels": [
          "first slope",
          "second slope"
        ],
        "explanation": "The common spacing is h=0.5. First slope is (4−1)/0.5=6. Second slope is (9−4)/0.5=10."
      }
    ]
  },
  {
    "id": "q66",
    "title": "Resource allocation certificate",
    "topic": "Linear programming and duality",
    "tier": "Advanced",
    "sector": "Guild Citadel",
    "brief": "Resource allocation certificate. Complete the engineering check.",
    "lesson": "A linear program optimizes a linear objective under linear inequalities. A dual feasible price vector provides an upper bound; matching primal and dual values certifies global optimality.",
    "prompt": "Maximize 3x+2y with x+y≤4, x≤2, x,y≥0. Enter optimal x,y, then maximum value.",
    "answer": [
      2,
      2,
      10
    ],
    "labels": [
      "x",
      "y",
      "maximum"
    ],
    "tolerance": 0.01,
    "hints": [
      "Use x=2 and y=2, satisfying both resource limits.",
      "The feasible allocation reaches 10, so it is globally optimal."
    ],
    "solution": "Use x=2 and y=2, satisfying both resource limits. A dual price (2,1) on the two limits gives upper bound 2·4+1·2=10: 2(x+y)+x=3x+2y. The feasible allocation reaches 10, so it is globally optimal.",
    "xp": 180,
    "prereqs": [
      "q41",
      "q59"
    ],
    "teaching": {
      "intuition": "A linear program optimizes a linear objective under linear inequalities. A dual feasible price vector provides an upper bound; matching primal and dual values certifies global optimality.",
      "steps": [
        "Use x=2 and y=2, satisfying both resource limits.",
        "A dual price (2,1) on the two limits gives upper bound 2·4+1·2=10: 2(x+y)+x=3x+2y.",
        "The feasible allocation reaches 10, so it is globally optimal."
      ],
      "example": {
        "prompt": "Maximize 2x+y subject to x+y≤3, x≤1, x,y≥0.",
        "steps": [
          "Choose x=1,y=2 for value 4.",
          "The bound (x+y)+x≤3+1=4 matches."
        ],
        "answer": "(1,2), maximum 4."
      },
      "pitfalls": [
        "A feasible point alone does not prove optimality; a matching bound does.",
      "Check primal and dual feasibility before claiming equal optimal values."
      ]
    },
    "guidance": [
      {
        "prompt": "At x=2 and x+y=4, what is y?",
        "answer": [
          2
        ],
        "labels": [
          "y"
        ],
        "explanation": "The remaining shared resource allows y=2."
      },
      {
        "prompt": "Maximize 3x+2y with x+y≤4, x≤2, x,y≥0. Enter optimal x,y, then maximum value.",
        "answer": [
          2,
          2,
          10
        ],
        "labels": [
          "x",
          "y",
          "maximum"
        ],
        "explanation": "Use x=2 and y=2, satisfying both resource limits. A dual price (2,1) on the two limits gives upper bound 2·4+1·2=10: 2(x+y)+x=3x+2y. The feasible allocation reaches 10, so it is globally optimal."
      }
    ]
  },
  {
    "id": "q67",
    "title": "Short signal filter",
    "topic": "Convolution and Toeplitz matrices",
    "tier": "Advanced",
    "sector": "Signal Forge",
    "brief": "Short signal filter. Complete the engineering check.",
    "lesson": "Linear convolution applies a shift-invariant filter. For finite signals, zero padding produces a full output of length N+M−1; the same operation is multiplication by a Toeplitz matrix.",
    "prompt": "Convolve x=(1,2,3) with h=(1,−1), using zeros outside x. Enter all four output samples.",
    "answer": [
      1,
      1,
      1,
      -3
    ],
    "labels": [
      "y0",
      "y1",
      "y2",
      "y3"
    ],
    "tolerance": 0.01,
    "hints": [
      "The first output is 1.",
      "The final output is 0−3=−3."
    ],
    "solution": "The first output is 1. Interior outputs are 2−1=1 and 3−2=1. The final output is 0−3=−3.",
    "xp": 180,
    "prereqs": [
      "q08",
      "q55"
    ],
    "teaching": {
      "intuition": "Linear convolution applies a shift-invariant filter. For finite signals, zero padding produces a full output of length N+M−1; the same operation is multiplication by a Toeplitz matrix.",
      "steps": [
        "The first output is 1.",
        "Interior outputs are 2−1=1 and 3−2=1.",
        "The final output is 0−3=−3."
      ],
      "example": {
        "prompt": "Convolve (2,5) with (1,1).",
        "steps": [
          "The boundary outputs are 2 and 5.",
          "The center combines both samples: 2+5."
        ],
        "answer": "(2,7,5)."
      },
      "pitfalls": [
        "Circular convolution wraps boundaries; this mission uses full linear convolution.",
      "Pad signals when using a circular FFT to recover linear convolution."
      ]
    },
    "guidance": [
      {
        "prompt": "What is the first output x₀h₀?",
        "answer": [
          1
        ],
        "labels": [
          "y0"
        ],
        "explanation": "All other first-output terms are zero outside the signal."
      },
      {
        "prompt": "Convolve x=(1,2,3) with h=(1,−1), using zeros outside x. Enter all four output samples.",
        "answer": [
          1,
          1,
          1,
          -3
        ],
        "labels": [
          "y0",
          "y1",
          "y2",
          "y3"
        ],
        "explanation": "The first output is 1. Interior outputs are 2−1=1 and 3−2=1. The final output is 0−3=−3."
      }
    ]
  },
  {
    "id": "q68",
    "title": "Downhill controller tuning",
    "topic": "Gradient descent for quadratic systems",
    "tier": "Advanced",
    "sector": "Dynamics Lab",
    "brief": "Downhill controller tuning. Complete the engineering check.",
    "lesson": "For f(x)=½xᵀHx−bᵀx with symmetric H, ∇f=Hx−b. Gradient descent updates x⁺=x−α∇f; for positive definite H, 0<α<2/λmax ensures convergence.",
    "prompt": "H=diag(2,4), b=(2,4), x₀=(0,0), α=0.25. Enter x₁ and the largest eigenvalue of the update matrix I−αH.",
    "answer": [
      0.5,
      1,
      0.5
    ],
    "labels": [
      "x1 first",
      "x1 second",
      "update eigenvalue"
    ],
    "tolerance": 0.01,
    "hints": [
      "At zero, gradient is −b=(−2,−4).",
      "I−0.25H=diag(0.5,0), whose largest eigenvalue is 0.5."
    ],
    "solution": "At zero, gradient is −b=(−2,−4). Subtract 0.25 times the gradient to obtain (0.5,1). I−0.25H=diag(0.5,0), whose largest eigenvalue is 0.5.",
    "xp": 180,
    "prereqs": [
      "q40",
      "q32"
    ],
    "teaching": {
      "intuition": "For f(x)=½xᵀHx−bᵀx with symmetric H, ∇f=Hx−b. Gradient descent updates x⁺=x−α∇f; for positive definite H, 0<α<2/λmax ensures convergence.",
      "steps": [
        "At zero, gradient is −b=(−2,−4).",
        "Subtract 0.25 times the gradient to obtain (0.5,1).",
        "I−0.25H=diag(0.5,0), whose largest eigenvalue is 0.5."
      ],
      "example": {
        "prompt": "H=2I, b=(4,2), start at zero with α=0.25. Compute one step.",
        "steps": [
          "The gradient is (−4,−2).",
          "Subtract one quarter of it."
        ],
        "answer": "(1,0.5); update eigenvalues both 0.5."
      },
      "pitfalls": [
        "An excessively large step can make a convex quadratic iteration diverge.",
      "Set the step size against the largest curvature of the quadratic."
      ]
    },
    "guidance": [
      {
        "prompt": "Compute the first update 0−0.25(−2).",
        "answer": [
          0.5
        ],
        "labels": [
          "x1 first"
        ],
        "explanation": "Moving opposite the negative gradient increases the first coordinate."
      },
      {
        "prompt": "H=diag(2,4), b=(2,4), x₀=(0,0), α=0.25. Enter x₁ and the largest eigenvalue of the update matrix I−αH.",
        "answer": [
          0.5,
          1,
          0.5
        ],
        "labels": [
          "x1 first",
          "x1 second",
          "update eigenvalue"
        ],
        "explanation": "At zero, gradient is −b=(−2,−4). Subtract 0.25 times the gradient to obtain (0.5,1). I−0.25H=diag(0.5,0), whose largest eigenvalue is 0.5."
      }
    ]
  }
];
window.QUESTS.push(...additions);
const appliedIds=new Set(['q27','q28','q29','q30','q37','q40','q41','q42','q49','q55','q64','q67','q68']);
const textIds=new Set(['q04','q36','q53','q58','q59','q60','q61','q63','q65']);
window.QUESTS.forEach(q=>{q.sources=[sources.core];if(appliedIds.has(q.id))q.sources.push(sources.applied);if(textIds.has(q.id))q.sources.push(sources.text);q.sourceNote='Original engineering example; references cover the underlying concepts. Links verified 18 November 2026.';});
})();
