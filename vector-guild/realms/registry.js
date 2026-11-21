/* Realm registry: the star map and the realm loader both read this list.
   node      one shape on the star map
   needs     map nodes this one builds on (soft lock: a warning, never a block)
   parts     playable realms inside the node. status 'ready' = a pack exists; 'coming' = not built yet.
             missions = every mission of the full pack, learn and practice (Foundations: 40 learn + 120 practice;
             linear algebra: 68 learn + 204 practice).
             learn = the learn missions alone, one per concept, where a pack has practice missions as well.
   A part with status 'ready' has a pack id; its scripts are listed in VG_PACKS (realms/packs.js). */
window.VG_REALMS = [
 {node:'found',name:'Foundations',pos:[0,-1,2],color:'amber',needs:[],
  learn:'Numbers, equations, functions and graphs: the language every other realm speaks.',
  world:'Split a bill, read a chart in the news, work out how long a trip takes.',
  parts:[{id:'found',name:'Foundations',status:'ready',missions:160,learn:40}]},
 {node:'alg',name:'Algebra',pos:[-8,2,3],color:'cyan',needs:['found'],
  learn:'Vectors, matrices and the structures behind them.',
  world:'Steer a spacecraft, compress a photo, rank web pages.',
  parts:[{id:'la',name:'Linear algebra',status:'ready',missions:272,learn:68},{id:'abstract',name:'Abstract algebra',status:'coming'}]},
 {node:'calc',name:'Calculus',pos:[7,1,4],color:'violet',needs:['found'],
  learn:'How things change and how change adds up, first along a line and then across surfaces.',
  world:'Find the fastest route, the dose that lasts, the shape that uses least material.',
  parts:[{id:'calc1',name:'Calculus 1: change',status:'coming'},{id:'calc2',name:'Calculus 2: accumulation',status:'coming'},{id:'calc3',name:'Calculus 3: many variables',status:'coming'}]},
 {node:'stat',name:'Statistics & probability',pos:[2,-7,-4],color:'cyan',needs:['found'],
  learn:'Reasoning under uncertainty: chance, evidence and what a sample can tell you.',
  world:'Judge a medical test, a poll, or whether a result is luck.',
  parts:[{id:'prob',name:'Probability',status:'coming'},{id:'stats',name:'Data and inference',status:'coming'}]},
 {node:'logic',name:'Logic',pos:[-4,7,-5],color:'amber',needs:['found'],
  learn:'What it means for an argument to be valid, and how to prove something for certain.',
  world:'Spot a flawed argument, design a circuit, write a rule a computer can check.',
  parts:[{id:'logic',name:'Logic and proof',status:'coming'}]},
 {node:'disc',name:'Discrete math',pos:[-9,-5,-3],color:'violet',needs:['found'],
  learn:'Counting, arrangements and step-by-step structures: the math of things you can list.',
  world:'Schedule a tournament, count passwords, plan deliveries.',
  parts:[{id:'disc',name:'Discrete mathematics',status:'coming'}]},
 {node:'diff',name:'Differential equations',pos:[13,6,-2],color:'amber',needs:['calc','alg'],
  learn:'Equations that describe how something evolves from moment to moment.',
  world:'Predict an outbreak, cool a battery, damp a bridge.',
  parts:[{id:'ode',name:'Differential equations',status:'coming'}]},
 {node:'num',name:'Number & graph theory',pos:[-15,-9,2],color:'cyan',needs:['disc'],
  learn:'Primes and divisibility, and networks of points joined by links.',
  world:'Keep a message secret, route the internet, map friendships.',
  parts:[{id:'number',name:'Number theory',status:'coming'},{id:'graph',name:'Graph theory',status:'coming'}]},
 {node:'anal',name:'Real & complex analysis',pos:[5,11,-9],color:'cyan',needs:['calc','logic'],
  learn:'Why calculus works: limits made exact, then extended to complex numbers.',
  world:'Trust a numerical simulation, shape an aerofoil, filter a signal.',
  parts:[{id:'real',name:'Real analysis',status:'coming'},{id:'complex',name:'Complex analysis',status:'coming'}]},
 {node:'topo',name:'Topology',pos:[-2,15,-13],color:'violet',needs:['anal'],
  learn:'The properties of a shape that survive stretching and bending.',
  world:'Untangle DNA, find holes in data, plan a robot arm\'s reach.',
  parts:[{id:'topo',name:'Topology',status:'coming'}]},
 {node:'phys',name:'Physics',pos:[14,-4,6],color:'warn',needs:['calc'],
  learn:'The laws of motion, energy and fields, written in the math from the other realms.',
  world:'Land a rover, size a solar array, tune an antenna.',
  parts:[{id:'mech',name:'Mechanics',status:'coming'},{id:'em',name:'Electricity and magnetism',status:'coming'},{id:'waves',name:'Waves',status:'coming'}]}
];
