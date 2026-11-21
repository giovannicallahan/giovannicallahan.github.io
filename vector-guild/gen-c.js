/* Mission generators, part C: q29 q30 q32 q33 q34 q35 q36 q37 q38 q39 q54 q40 q41 q42 q46 q47.
   See gen-core.js for the contract. build(canonical) reproduces the authored mission. */
(function(){
'use strict';
const G=window.Gen,{n,plus,par,vec}=G;
/* small shared helpers */
const r6=x=>Math.round(x*1e6)/1e6;
const mat=M=>'[['+M.map(row=>row.map(n).join(',')).join('],[')+']]';
const sup=k=>String(k).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
/* "2+0−2": a signed sum of terms */
const sum=t=>t.map((x,i)=>i?plus(x):n(x)).join('');
/* complex number a+bi with b≠0: "1+i", "2−3i" */
const cx=(a,b)=>n(a)+(b<0?'−':'+')+(Math.abs(b)===1?'':n(Math.abs(b)))+'i';
/* imaginary term bi: "i", "−i", "2i" */
const im=b=>b===1?'i':b===-1?'−i':n(b)+'i';
/* coefficient in front of a symbol: 1 → "", −1 → "−" */
const cf=k=>k===1?'':k===-1?'−':n(k);

/* q38: leaving probabilities (hundredths, multiples of 0.02 or 0.05) whose ratio and stationary distribution are short decimals */
const MARKOV=[];
for(let i=5;i<=90;i++)for(let j=5;j<=90;j++){
 if(i===j||(i%5!==0&&i%2!==0)||(j%5!==0&&j%2!==0))continue;
 if((100*j)%i!==0||(100*i)%(i+j)!==0)continue;
 MARKOV.push([i/100,j/100]);
}
/* q41: cost pairs with a short decimal ratio b/a */
const COSTS=[];
for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if(a!==b&&(100*b)%a===0)COSTS.push([a,b]);
/* q39: every graph on three nodes with at least one edge */
const GRAPHS=[[[1,2],[2,3]],[[1,2],[1,3]],[[1,3],[2,3]],[[1,2],[1,3],[2,3]],[[1,2]],[[1,3]],[[2,3]]];

Object.assign(window.MISSION_GEN,{
/* Pseudoinverse: two identical actuators share a demand equally. */
q29:{
 canonical:{total:6},
 draw:R=>({total:R.except(-24,24,[0,10])}),
 build:({total:T})=>{const h=T/2,sq=h*h;return {
  prompt:`Two equal actuators satisfy x₁+x₂=${n(T)}. Enter the minimum-norm solution x₁,x₂.`,
  answer:[h,h],
  hints:['By symmetry, equal sharing is the candidate.',`Minimize x₁²+(${n(T)}−x₁)².`],
  solution:`The derivative 4x₁${plus(-2*T)} vanishes at x₁=${n(h)}; x₂=${n(h)}. A⁺=(1/2,1/2)ᵀ.`,
  guidance:[
   {prompt:`Write x₂=${n(T)}−x₁. At equal sharing, what is x₁?`,answer:[h],explanation:`The symmetry condition x₁=x₂ turns the constraint into 2x₁=${n(T)}.`},
   {prompt:`For x₁=${n(h)}, compute x₂ and the squared norm x₁²+x₂².`,answer:[h,2*sq],explanation:`The solution meets demand ${n(T)} with squared norm ${n(sq)}+${n(sq)}=${n(2*sq)}.`}
  ]};}
},
/* Condition number of a positive diagonal matrix and a perturbed second equation. */
q30:{
 canonical:{a:10,c:0.1,nb:0.11},
 draw:R=>{let a,c,x;const short=v=>Math.abs(v*100-Math.round(v*100))<1e-6;
  do{a=R.int(4,20);c=R.pick([0.05,0.1,0.2,0.25,0.4,0.5]);x=R.pick([1.1,1.2,1.3,1.4,1.5,1.6,1.8,2]);}
  while(!short(c*x)||!short(a/c));
  return {a,c,nb:r6(c*x)};},
 build:({a,c,nb})=>{const k=r6(a/c),x=r6(nb/c),d=r6(nb-c);return {
  prompt:`A=diag(${n(a)},${n(c)}). Enter κ₂(A). If b=(${n(a)},${n(c)}), then its second coordinate rises to ${n(nb)}; enter the new solution x₂.`,
  answer:[k,x],
  hints:[`The singular values are ${n(a)} and ${n(c)}.`,`The second equation is ${n(c)}x₂=${n(nb)}.`],
  solution:`κ₂=${n(a)}/${n(c)}=${n(k)}. The perturbed second equation gives x₂=${n(x)}.`,
  guidance:[
   {prompt:`For diag(${n(a)},${n(c)}), enter largest and smallest singular values.`,answer:[a,c],explanation:'Positive diagonal entries are the singular values here.'},
   {prompt:`What is the absolute change in b₂ from ${n(c)} to ${n(nb)}, and the new x₂?`,answer:[d,x],explanation:`The change is ${n(d)}; dividing new b₂ by ${n(c)} gives x₂=${n(x)}.`}
  ]};}
},
/* Sylvester criterion for a symmetric 2×2 matrix [[a,b],[b,d]]. */
q32:{
 canonical:{a:4,b:1,d:2},
 draw:R=>{const want=R.bool();let p,guard=0;
  do{p={a:R.int(0,5)===0?R.int(-3,-1):R.int(1,7),b:R.nz(-4,4),d:R.int(1,8)};}
  while(((p.a>0&&p.a*p.d-p.b*p.b>0)!==want)&&guard++<200);
  return p;},
 build:({a,b,d})=>{const det=a*d-b*b,pd=a>0&&det>0,K=mat([[a,b],[b,d]]);return {
  prompt:`K=${K}. Enter its first leading principal minor, determinant, and 1 if positive definite or 0 otherwise.`,
  answer:[a,det,pd?1:0],
  hints:['The first minor is the upper-left entry.',`The determinant is ${n(a*d)}−${n(b*b)}.`],
  solution:pd?`The leading minors are ${n(a)} and ${n(det)}, both positive; K is positive definite.`
   :`The leading minors are ${n(a)} and ${n(det)}, not both positive; K is not positive definite.`,
  guidance:[
   {prompt:`Enter the first leading principal minor of ${K}.`,answer:[a],explanation:`The leading 1×1 submatrix contains only ${n(a)}.`},
   {prompt:'Compute its determinant and enter 1 if both leading minors are positive.',answer:[det,pd?1:0],
    explanation:`det=${par(a)}·${par(d)}−${par(b)}·${par(b)}=${n(det)}. `+(pd?`Both ${n(a)} and ${n(det)} are positive, so the flag is 1.`:`The minors ${n(a)} and ${n(det)} are not both positive, so the flag is 0.`)}
  ]};}
},
/* Cholesky factor of [[a,b],[b,d]]; draws start from an integer factor. */
q33:{
 canonical:{a:4,b:2,d:5},
 draw:R=>{let l11,l21,l22;do{l11=R.int(1,6);l21=R.nz(-4,4);l22=R.int(1,6);}while(l11===1&&l22===1);
  return {a:l11*l11,b:l11*l21,d:l21*l21+l22*l22};},
 build:({a,b,d})=>{const l11=Math.sqrt(a),l21=b/l11,rem=d-l21*l21,l22=Math.sqrt(rem),A=mat([[a,b],[b,d]]);return {
  prompt:`A=${A}. Enter L₁₁,L₂₁,L₂₂ for its Cholesky factor.`,
  answer:[l11,l21,l22],
  hints:[`L₁₁²=${n(a)}, and L₂₁L₁₁=${n(b)}.`,`L₂₁²+L₂₂²=${n(d)}.`],
  solution:`L=${mat([[l11,0],[l21,l22]])}; LLᵀ=${A}.`,
  guidance:[
   {prompt:`Solve L₁₁²=${n(a)} using the positive root.`,answer:[l11],explanation:`The required positive diagonal gives L₁₁=${n(l11)}.`},
   {prompt:`Solve ${cf(l11)}L₂₁=${n(b)}, then L₂₂=√(${n(d)}−L₂₁²).`,answer:[l21,l22],explanation:`L₂₁=${n(l21)} and L₂₂=√${n(rem)}=${n(l22)}.`}
  ]};}
},
/* Complex self inner product of z=(a+bi, c+di). */
q34:{
 canonical:{a:1,b:1,c:2,d:-1},
 draw:R=>({a:R.nz(-5,5),b:R.nz(-5,5),c:R.nz(-5,5),d:R.nz(-5,5)}),
 build:({a,b,c,d})=>{const m1=a*a+b*b,m2=c*c+d*d,s=m1+m2,z1=cx(a,b),z2=cx(c,d);
  const i2=q=>(q*q===1?'':n(q*q))+'i²';return {
  prompt:`For z=(${z1},${z2}), enter the real and imaginary parts of z* z.`,
  answer:[s,0],
  hints:['Each term is the squared magnitude of one component.',`|${z1}|²=${n(m1)} and |${z2}|²=${n(m2)}.`],
  solution:`z* z=${n(m1)}+${n(m2)}=${n(s)}+0i; its norm is √${n(s)}.`,
  guidance:[
   {prompt:`Compute |${z1}|².`,answer:[m1],explanation:`Multiply (${cx(a,-b)})(${z1})=${n(a*a)}−${i2(b)}=${n(m1)}.`},
   {prompt:`Compute |${z2}|² and the imaginary part of its squared magnitude.`,answer:[m2,0],explanation:`(${cx(c,-d)})(${z2})=${n(c*c)}−${i2(d)}=${n(m2)}, a real number.`}
  ]};}
},
/* Hermitian [[a,bi],[−bi,a]] has eigenvalues a±|b|. */
q35:{
 canonical:{a:2,b:1},
 draw:R=>({a:R.nz(-9,9),b:R.nz(-6,6)}),
 build:({a,b})=>{const s=Math.abs(b),sq=b*b,first=im(b),prod=(first==='i'?'i':`(${first})`)+`(${im(-b)})`;return {
  prompt:`H=[[${n(a)},${im(b)}],[${im(-b)},${n(a)}]]. Enter its eigenvalues in ascending order.`,
  answer:[a-s,a+s],
  hints:[`det(H−λI)=(${n(a)}−λ)²−${n(sq)}.`,`Solve (${n(a)}−λ)²=${n(sq)}.`],
  solution:`The characteristic roots are ${n(a-s)} and ${n(a+s)}; conjugate off-diagonal entries make H Hermitian.`,
  guidance:[
   {prompt:`Compute the real and imaginary parts of ${prod}.`,answer:[sq,0],explanation:`${prod}=−${sq===1?'':n(sq)}i²=${n(sq)}.`},
   {prompt:`For det(H−λI)=(${n(a)}−λ)²−${n(sq)}, what positive number must |${n(a)}−λ| equal?`,answer:[s],explanation:`Setting the determinant to zero gives (${n(a)}−λ)²=${n(sq)}, hence two real roots.`}
  ]};}
},
/* Power of the Jordan block [[lam,1],[0,lam]]. */
q36:{
 canonical:{lam:2,n:3},
 draw:R=>{let lam,k;do{lam=R.pick([-4,-3,-2,-1,2,3,4,5]);k=R.int(2,6);}while(Math.pow(Math.abs(lam),k)>1000);return {lam,n:k};},
 build:({lam,n:k})=>{const d=Math.pow(lam,k),o=k*Math.pow(lam,k-1);return {
  prompt:`J=${mat([[lam,1],[0,lam]])}. Enter the entries of J${sup(k)} in row-major order.`,
  answer:[d,o,0,d],
  hints:['Use N=[[0,1],[0,0]], for which N²=0.',`The off-diagonal coefficient is ${n(k)}·${par(lam)}${sup(k-1)}.`],
  solution:`J${sup(k)}=${cf(d)}I${plus(o)}N=${mat([[d,o],[0,d]])}. J has only one independent eigenvector despite its repeated eigenvalue.`,
  guidance:[
   {prompt:`For the mission λ=${n(lam)} and n=${n(k)}, compute λⁿ.`,answer:[d],explanation:`${par(lam)}${sup(k)}=${n(d)} multiplies the identity.`},
   {prompt:`Compute nλⁿ⁻¹=${n(k)}·${par(lam)}${sup(k-1)}.`,answer:[o],explanation:`This coefficient multiplies N, producing the upper-right entry ${n(o)}.`}
  ]};}
},
/* Diagonal of diag(a1,a2)⊗B. */
q37:{
 canonical:{a:[2,3],B:[[1,1],[0,1]]},
 draw:R=>{const a1=R.except(-5,6,[-1,0,1]),a2=R.except(-5,6,[-1,0,1,a1]);
  return {a:[a1,a2],B:[[R.nz(-4,5),R.int(-3,3)],[R.int(-3,3),R.nz(-4,5)]]};},
 build:({a,B})=>{const bd=[B[0][0],B[1][1]],d1=bd.map(x=>a[0]*x),d2=bd.map(x=>a[1]*x),all=[...d1,...d2];return {
  prompt:`A=diag(${n(a[0])},${n(a[1])}), B=${mat(B)}. Enter the four diagonal entries of A⊗B in order.`,
  answer:all,
  hints:[`The diagonal blocks are ${cf(a[0])}B and ${cf(a[1])}B.`,`Each B block has diagonal ${vec(bd,',')}.`],
  solution:`A⊗B has blocks ${cf(a[0])}B and ${cf(a[1])}B on its diagonal, giving ${vec(all,',')}.`,
  guidance:[
   {prompt:'For 2×2 A and 2×2 B, enter the row and column counts of A⊗B.',answer:[4,4],explanation:'Both dimensions multiply: 2·2=4.'},
   {prompt:`For the block ${cf(a[0])}B, enter its two diagonal entries.`,answer:d1,explanation:`B has diagonal ${vec(bd,',')}, so the first block diagonal is ${vec(d1,',')}. The other block is ${cf(a[1])}B.`}
  ]};}
},
/* Stationary distribution of P=[[1−a,b],[a,1−b]]: a leaves state 1, b leaves state 2. */
q38:{
 canonical:{a:0.2,b:0.3},
 draw:R=>{const [a,b]=R.pick(MARKOV);return {a,b};},
 build:({a,b})=>{const ratio=r6(b/a),p2=r6(a/(a+b)),p1=r6(b/(a+b));return {
  prompt:`P=${mat([[1-a,b],[a,1-b]])}. Enter the stationary probabilities p₁,p₂.`,
  answer:[p1,p2],
  hints:[`The first equation reduces to ${n(a)}p₁=${n(b)}p₂.`,`Combine the ratio p₁/p₂=${n(ratio)} with p₁+p₂=1.`],
  solution:`Balance gives p₁=${n(ratio)}p₂, hence p₂=${n(p2)} and p₁=${n(p1)}.`,
  guidance:[
   {prompt:`From ${n(a)}p₁=${n(b)}p₂, compute the ratio p₁/p₂.`,answer:[ratio],explanation:`Divide by ${n(a)} to obtain p₁=${n(ratio)}p₂.`},
   {prompt:`Use ${n(ratio)}p₂+p₂=1 to find p₂.`,answer:[p2],explanation:`${n(ratio+1)}p₂=1, so p₂=${n(p2)}; use normalization to finish.`}
  ]};}
},
/* Laplacian of a three-node graph applied to a state x, and its component count. */
q39:{
 canonical:{edges:[[1,2],[2,3]],x:[2,2,2]},
 draw:R=>{const edges=R.pick(GRAPHS),mode=R.int(0,9);let x;   /* about a quarter of draws give all-zero outputs */
  if(mode<2){const c=R.nz(-9,9);x=[c,c,c];}
  else if(mode===2&&edges.length===1){const c=R.nz(-6,6),d=R.except(-6,6,[c]),iso=6-edges[0][0]-edges[0][1];x=[c,c,c];x[iso-1]=d;}
  else{do{x=[R.int(-5,5),R.int(-5,5),R.int(-5,5)];}while(x[0]===x[1]&&x[1]===x[2]);}
  return {edges,x};},
 build:({edges,x})=>{
  const L=[[0,0,0],[0,0,0],[0,0,0]];
  edges.forEach(([i,j])=>{L[i-1][i-1]++;L[j-1][j-1]++;L[i-1][j-1]--;L[j-1][i-1]--;});
  const y=L.map(row=>row.reduce((s,v,i)=>s+v*x[i],0));
  const k=4-edges.length>2?2:1;            /* one edge → two components; two or three edges → one */
  let name,kind,iso=0,pair=[];
  if(edges.length===3){name='three-node triangle';kind='triangle';}
  else if(edges.length===2){const mid=[1,2,3].find(v=>edges.every(e=>e.includes(v)));name=mid===2?'three-node path':`three-node path with middle node ${mid}`;kind='path';}
  else{pair=edges[0];iso=6-pair[0]-pair[1];name=`three-node graph with the single edge ${pair[0]}–${pair[1]}`;kind='edge';}
  const constant=x[0]===x[1]&&x[1]===x[2],zero=y.every(v=>v===0),xs=vec(x,',');
  const rowTerms=r=>sum(L[r].map((v,i)=>v*x[i]));
  /* guided row: row 2 when node 2 has an edge, otherwise row 1; hint row: the first row that has an edge */
  const g=L[1][1]>0?1:0,h=L.findIndex(row=>row.some(v=>v!==0));
  const authoredPath=kind==='path'&&L[1][1]===2;
  const nb=[0,1,2].filter(i=>i!==g&&L[g][i]!==0);
  return {
  prompt:`A ${name} has L=${mat(L)}. Enter L${xs}, followed by the number of connected components.`,
  answer:[...y,k],
  hints:[constant?'A constant state has zero differences across edges.'
    :zero?'The state is equal at the two linked nodes, so it has zero difference across the edge.'
    :`Row ${h+1} of L gives ${rowTerms(h)}=${n(y[h])}; treat the other rows the same way.`,
   kind==='edge'?`Node ${iso} has no edge, so it forms a component by itself.`:`The ${kind} connects all three nodes.`],
  solution:(constant?`Every row sums to zero, so L${xs}=0.`
    :zero?`Nodes ${pair[0]} and ${pair[1]} hold the same value and node ${iso} has no edge, so L${xs}=0.`
    :`Row by row, L${xs}=${vec(y,',')}; the outputs sum to zero because every column of L sums to zero.`)
   +(kind==='edge'?` Edge ${pair[0]}–${pair[1]} and isolated node ${iso} make two components, so the nullspace is two-dimensional.`
    :` A connected ${kind} has one component and a one-dimensional nullspace.`),
  guidance:[
   {prompt:`For ${authoredPath?'the middle row':`row ${g+1} of L,`} ${vec(L[g],',')}, compute its dot product with ${xs}.`,answer:[y[g]],
    ...(authoredPath?{}:{labels:[`row ${g+1} output`]}),
    explanation:`${rowTerms(g)}=${n(y[g])}, `+(nb.every(i=>x[i]===x[g])?'expressing no local disagreement.'
     :y[g]===0?`because the differences between node ${g+1} and its neighbours cancel.`
     :nb.length===1?`the difference between node ${g+1} and its neighbour.`
     :`the summed difference between node ${g+1} and its neighbours.`)},
   {prompt:`How many connected components does a ${name} have, and what is its Laplacian nullity?`,answer:[k,k],
    explanation:kind==='edge'?`Nodes ${pair[0]} and ${pair[1]} reach each other but node ${iso} is isolated, so there are two components and two independent null directions.`
     :'Every node is reachable from every other, so there is one component and one constant null direction.'}
  ]};}
},
/* Net inflows on the chain A→B→C with flows f[0], f[1]. */
q54:{
 canonical:{f:[4,3]},
 draw:R=>({f:[R.int(1,12),R.int(1,12)]}),
 build:({f})=>{const [u,v]=f,b=u-v,ans=[-u,b,v];
  const prompt=`Edges are A→B and B→C with flows ${n(u)} and ${n(v)}. Enter net inflows at A,B,C.`;
  const sA=`A only sends ${n(u)}, giving ${n(-u)}.`,sC=`C receives ${n(v)}; sum ${sum(ans)}=0.`;
  const solution=`${sA} B receives ${n(u)} and sends ${n(v)}, giving ${n(b)}. ${sC}`;return {
  prompt,answer:ans,hints:[sA,sC],solution,
  guidance:[
   {prompt:'What is the net inflow at A? ',answer:[-u],explanation:'The edge leaves A so its incidence sign is negative.'},
   {prompt,answer:ans,explanation:solution}
  ]};}
},
/* Minimiser of ½xᵀQx−bᵀx for diagonal positive Q. */
q40:{
 canonical:{q:[2,4],b:[6,8]},
 draw:R=>{const q=[R.int(2,6),R.int(2,6)],x=[R.nz(-5,5),R.nz(-5,5)];return {q,b:[q[0]*x[0],q[1]*x[1]]};},
 build:({q,b})=>{const x=[b[0]/q[0],b[1]/q[1]],s=x.map(v=>v*v),quad=q[0]*s[0]+q[1]*s[1],t=[b[0]*x[0],b[1]*x[1]],lin=t[0]+t[1],f=quad/2-lin;
  const eqs=`${n(q[0])}x₁=${n(b[0])} and ${n(q[1])}x₂=${n(b[1])}`;return {
  prompt:`Q=diag(${n(q[0])},${n(q[1])}), b=${vec(b,',')}. Enter the minimizer x₁,x₂ and minimum f.`,
  answer:[x[0],x[1],f],
  hints:[`Solve ${eqs}.`,`Evaluate ½(${n(q[0])}·${n(s[0])}+${n(q[1])}·${n(s[1])})−(${n(t[0])}+${n(t[1])}).`],
  solution:`x=${vec(x,',')}. f=${n(quad/2)}−${n(lin)}=${n(f)}; positive definiteness guarantees the unique global minimum.`,
  guidance:[
   {prompt:`Solve ${eqs}.`,answer:x,explanation:'The diagonal quadratic separates into two scalar linear equations.'},
   {prompt:`At x=${vec(x,',')}, compute xᵀQx and bᵀx.`,answer:[quad,lin],
    explanation:`xᵀQx=${n(q[0])}·${n(s[0])}+${n(q[1])}·${n(s[1])}=${n(quad)} and bᵀx=${par(b[0])}·${par(x[0])}+${par(b[1])}·${par(x[1])}=${n(lin)}; apply the half factor only to the first.`}
  ]};}
},
/* Minimise a·x²+b·y² subject to x+y=c (a,b positive and different). */
q41:{
 canonical:{a:1,b:2,c:6},
 draw:R=>{let a,b,c;do{[a,b]=R.pick(COSTS);c=R.nz(-4,4)*(a+b)/gcd(a,b);}while(Math.abs(c)>20);return {a,b,c};},
 build:({a,b,c})=>{const ratio=r6(b/a),y=r6(a*c/(a+b)),x=r6(b*c/(a+b)),fx=r6(a*x*x),fy=r6(b*y*y),f=r6(fx+fy);
  const obj=`f=${cf(a)}x²+${cf(b)}y²`,rel=`x=${cf(ratio)}y`,con=`x+y=${n(c)}`;return {
  prompt:`Minimize ${obj} subject to ${con}. Enter optimal x,y and f.`,
  answer:[x,y,f],
  hints:[`Gradient balance gives ${n(2*a)}x=${n(2*b)}y.`,`Use ${rel} in the constraint.`],
  solution:`${rel} and ${con} give y=${n(y)},x=${n(x)}. Cost is ${n(fx)}+${n(fy)}=${n(f)}; strict convexity guarantees uniqueness.`,
  guidance:[
   {prompt:`For ${obj}, enter the coefficients in marginal costs ∂f/∂x and ∂f/∂y.`,answer:[2*a,2*b],explanation:`The gradients are ${n(2*a)}x and ${n(2*b)}y; optimal feasible redistribution equates them.`},
   {prompt:`Use ${rel} and ${con} to find y.`,answer:[y],explanation:`${n(ratio+1)}y=${n(c)}, so y=${n(y)}. Then determine x and evaluate the cost.`}
  ]};}
},
/* Weighted mean of two readings and its weighted squared error. */
q42:{
 canonical:{y:[2,8],w:[3,1]},
 draw:R=>{let y,w,guard=0;
  do{const y1=R.int(1,12),w1=R.int(2,6);y=[y1,R.except(1,12,[y1])];w=[w1,R.except(1,6,[w1])];}
  while((10*(w[0]*y[0]+w[1]*y[1]))%(w[0]+w[1])!==0&&guard++<500);
  if((10*(w[0]*y[0]+w[1]*y[1]))%(w[0]+w[1])!==0){y=[R.int(1,6),R.int(7,12)];w=[3,2];}
  return {y,w};},
 build:({y,w})=>{const S=w[0]*y[0]+w[1]*y[1],W=w[0]+w[1],c=r6(S/W),r=y.map(v=>r6(v-c)),s=r.map(v=>r6(v*v)),e=[r6(w[0]*s[0]),r6(w[1]*s[1])],E=r6(e[0]+e[1]);return {
  prompt:`Two sensors read ${n(y[0])} and ${n(y[1])} V with weights ${n(w[0])} and ${n(w[1])}. Enter the fused voltage and weighted squared error.`,
  answer:[c,E],
  hints:[`Compute (${n(w[0])}·${n(y[0])}+${n(w[1])}·${n(y[1])})/(${n(w[0])}+${n(w[1])}).`,`The residuals are ${n(-r[0])} and ${n(-r[1])}.`],
  solution:`c=${n(S)}/${n(W)}=${n(c)} V. Weighted error=${n(w[0])}·${n(s[0])}+${n(e[1])}=${n(E)}.`,
  guidance:[
   {prompt:`For readings ${n(y[0])},${n(y[1])} with weights ${n(w[0])},${n(w[1])}, enter Σwy and Σw.`,answer:[S,W],explanation:`${n(w[0])}·${n(y[0])}+${n(w[1])}·${n(y[1])}=${n(S)}, and ${n(w[0])}+${n(w[1])}=${n(W)}.`},
   {prompt:`At c=${n(c)}, compute the first weighted squared residual ${n(w[0])}(${n(y[0])}−${n(c)})².`,answer:[e[0]],explanation:`The residual is ${n(r[0])}, its square is ${n(s[0])}, and weighting gives ${n(e[0])}. Add the second weighted error to finish.`}
  ]};}
},
/* B=P⁻¹AP for diagonal A and an integer P with determinant ±1 (draws use shears). */
q46:{
 canonical:{a:[2,3],P:[[1,1],[0,1]]},
 draw:R=>{const a1=R.except(-6,6,[-1,0,1]),a2=R.except(-6,6,[0,a1]);return {a:[a1,a2],P:[[1,R.nz(-4,4)],[0,1]]};},
 build:({a,P})=>{const [[p,q],[r,s]]=P,det=p*s-q*r;
  const Pi=[[s/det,-q/det],[-r/det,p/det]],AP=[[a[0]*p,a[0]*q],[a[1]*r,a[1]*s]];
  const B=Pi.map(row=>[0,1].map(j=>row[0]*AP[0][j]+row[1]*AP[1][j]));
  const A=[[a[0],0],[0,a[1]]],t=[Pi[0][0]*AP[0][1],Pi[0][1]*AP[1][1]];return {
  prompt:`A=${mat(A)}, P=${mat(P)}. Enter B=P⁻¹AP in row-major order.`,
  answer:[B[0][0],B[0][1],B[1][0],B[1][1]],
  hints:[`P⁻¹=${mat(Pi)}.`,`AP=${mat(AP)}.`],
  solution:`P⁻¹AP=${mat(Pi)}${mat(AP)}=${mat(B)}. The diagonal eigenvalues remain ${n(a[0])} and ${n(a[1])}.`,
  guidance:[
   {prompt:`Compute the top row of AP for actual A=diag(${n(a[0])},${n(a[1])}), P=${mat(P)}.`,answer:AP[0],explanation:`Left multiplication by diagonal A scales the first row of P by ${n(a[0])}.`},
   {prompt:`The first row of P⁻¹ is ${vec(Pi[0],',')}, and the second column of AP is ${vec([AP[0][1],AP[1][1]],',')}. Compute their dot product.`,answer:[B[0][1]],explanation:`${sum(t)}=${n(B[0][1])}, the upper-right entry of the matrix in the new basis.`}
  ]};}
},
/* Four fundamental subspaces of a 2×3 matrix; nv is a null vector, row picks the row to test. */
q47:{
 canonical:{A:[[1,0,1],[0,1,1]],nv:[-1,-1,1],row:0},
 draw:R=>{const two=(nv,r)=>nv.filter((z,i)=>z*r[i]!==0).length>=2;   /* the n·r check must have real terms */
  for(let tries=0;tries<200;tries++){const p=window.MISSION_GEN.q47.draw1(R);if(two(p.nv,p.A[p.row]))return p;}
  return {A:[[1,0,1],[0,1,1]],nv:[-1,-1,1],row:R.int(0,1)};},
 draw1:R=>{const row=R.int(0,1);
  if(R.int(0,4)<3){            /* rank 2: the null vector is the reduced cross product of the rows */
   for(let guard=0;guard<300;guard++){
    const u=[R.int(-3,3),R.int(-3,3),R.int(-3,3)],v=[R.int(-3,3),R.int(-3,3),R.int(-3,3)];
    let c=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const g=gcd(gcd(c[0],c[1]),c[2]);
    if(!g)continue;
    if(u.filter(z=>z===0).length>1||v.filter(z=>z===0).length>1)continue;
    c=c.map(z=>z/g);
    if(c.some(z=>Math.abs(z)>6))continue;
    if(R.bool())c=c.map(z=>-z);
    return {A:[u,v],nv:c.map(z=>z+0),row};
   }
   return {A:[[1,0,1],[0,1,1]],nv:[-1,-1,1],row};
  }
  /* rank 1: second row is a multiple of the first; pick an integer vector perpendicular to it */
  let u;do{u=[R.int(-3,3),R.int(-3,3),R.int(-3,3)];}while(u.filter(z=>z===0).length>1);
  const k=R.pick([-3,-2,2,3]);
  const cands=[[u[1],-u[0],0],[u[2],0,-u[0]],[0,u[2],-u[1]]].filter(c=>c.some(z=>z!==0));
  let c=R.pick(cands);
  if(R.bool()){const d=R.pick(cands);const e=c.map((z,i)=>z+d[i]);if(e.some(z=>z!==0)&&e.every(z=>Math.abs(z)<=6))c=e;}
  const g=gcd(gcd(c[0],c[1]),c[2]);
  return {A:[u,u.map(z=>k*z)],nv:c.map(z=>z/g+0),row};},
 build:({A,nv,row})=>{const [u,v]=A;
  const cr=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const rk=cr.some(z=>z!==0)?2:1,i0=u.findIndex(z=>z!==0),k=rk===1?v[i0]/u[i0]:0;
  const r=A[row],terms=nv.map((z,i)=>z*r[i]),dot=terms.reduce((s,z)=>s+z,0),ns=vec(nv,','),rs=vec(r,',');
  const why=rk===2?'The two rows are independent':`The second row is ${n(k)} times the first`;return {
  prompt:`A=${mat(A)}. Enter dimensions of Col(A), Row(A), Null(A), Null(Aᵀ), then the dot product of n=${ns} with row r=${rs}.`,
  answer:[rk,rk,3-rk,2-rk,dot],
  hints:[`${why}, so rank is ${rk}; there are 3 columns and 2 rows.`,`n·r=${sum(terms)}.`],
  solution:`Rank is ${rk}, so dimensions are ${rk},${rk},3−${rk}=${3-rk},2−${rk}=${2-rk}. ${rk===2?'The':'The given'} null vector n is perpendicular to both rows; n·r=${n(dot)} verifies one orthogonality relation. `
   +(rk===2?'Column space is all of R², whose orthogonal complement is the zero left nullspace.':'Column space is a line in R², whose orthogonal complement is a one-dimensional left nullspace.'),
  guidance:[
   {prompt:rk===2?'For actual 2×3 A with two independent rows, enter m,n,r.':`For actual 2×3 A whose second row is ${n(k)} times the first, enter m,n,r.`,answer:[2,3,rk],
    explanation:`There are two output rows, three input columns, and ${rk===2?'two independent measurements':'one independent measurement'}.`},
   {prompt:`Compute n−r, m−r, and ${ns}·${rs}.`,answer:[3-rk,2-rk,dot],explanation:`The dimensions are 3−${rk}=${3-rk} and 2−${rk}=${2-rk}; the dot product is ${sum(terms)}=${n(dot)}.`}
  ]};}
}
});
})();
