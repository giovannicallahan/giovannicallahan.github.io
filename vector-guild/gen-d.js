/* Mission generators, part D: q49, q50, q55–q68.
   Each entry follows the contract in gen-core.js: canonical parameters reproduce the authored
   mission, draw(R) returns fresh well-behaved parameters, build(p) writes the mission for them. */
(function(){
'use strict';
const G=window.Gen,{n,plus,par,vec}=G;
/* One term of a linear expression: term(1,'x',true) → "x", term(−2,'y') → "−2y", term(3,'y') → "+3y". */
const term=(c,v,first)=>{const m=Math.abs(c)===1?'':n(Math.abs(c));return (c<0?'−':(first?'':'+'))+m+v;};
const lin=(a,u,b,v)=>term(a,u,true)+term(b,v);
/* Sum of the nonzero entries written out: [1,0,−1,0] → "1−1". */
const sumExpr=list=>{const t=list.filter(x=>x!==0);return t.length?t.map((x,i)=>i?plus(x):n(x)).join(''):'0';};
/* Round away float noise from products of short decimals. */
const r6=x=>Math.round(x*1e6)/1e6;
const root=x=>Number.isInteger(Math.sqrt(x))?n(Math.sqrt(x)):'√'+n(x);
const ORD=['first','second','third'];
Object.assign(window.MISSION_GEN,{
q49:{
 canonical:{d:[5,3,1]},
 draw:R=>{const a=R.int(1,9),b=R.except(1,9,[a]),c=R.except(1,9,[a,b]);return {d:[a,b,c]};},
 build:({d})=>{
  const top=Math.max(...d),k=d.indexOf(top),rest=d.filter((_,i)=>i!==k).sort((x,y)=>y-x); /* descending, the usual SVD order */
  const kept=d.map((x,i)=>i===k?x:0),resid=d.map((x,i)=>i===k?0:x);
  const err=rest[0]*rest[0]+rest[1]*rest[1],spec=Math.max(...rest);
  return {
  prompt:`A=diag${vec(d,',')}. Enter the diagonal of its best rank-1 SVD approximation, the squared Frobenius reconstruction error, and the spectral-norm error.`,
  answer:[...kept,err,spec],
  hints:[`Keep singular value ${n(top)} and discard ${n(rest[0])} and ${n(rest[1])}.`,
   `The squared Frobenius error is ${n(rest[0])}²+${n(rest[1])}²; spectral error is the largest discarded singular value.`],
  solution:`A₁=diag${vec(kept,',')}. The residual is diag${vec(resid,',')}, so ‖A−A₁‖F²=${n(rest[0]*rest[0])}+${n(rest[1]*rest[1])}=${n(err)} and ‖A−A₁‖₂=${n(spec)}. Frobenius error itself is √${n(err)}.`,
  guidance:[
   {prompt:`For actual A=diag${vec(d,',')}, enter the retained singular value and the two discarded ones.${d[0]>d[1]&&d[1]>d[2]?'':' List the discarded values from larger to smaller.'}`,answer:[top,rest[0],rest[1]],explanation:`A rank-1 approximation keeps only the largest singular mode ${n(top)}.`},
   {prompt:`From discarded values ${n(rest[0])},${n(rest[1])}, compute squared Frobenius error and spectral error.`,answer:[err,spec],explanation:`${n(rest[0])}²+${n(rest[1])}²=${n(err)}; the largest discarded singular value is ${n(spec)}.`}
  ]};}
},
q50:{
 /* r: readings; q: off-diagonal entry of P in hundredths; cov: the two diagonal scan variances. */
 canonical:{r:[2,4,6],q:25,cov:[9,1]},
 draw:R=>{
  let r=[2,4,6];
  for(let guard=0;guard<200;guard++){
   const count=R.pick([3,3,4]),mean=R.int(2,9),t=[];
   for(let i=0;i<count-1;i++)t.push(mean+R.int(-3,3));
   t.push(count*mean-t.reduce((s,x)=>s+x,0));
   if(t.every(x=>x>=1&&x<=14)&&new Set(t).size>1){r=t;break;}
  }
  const q=R.pick([5,10,15,20,25,30,35,40,45]);
  const total=R.pick([4,5,8,10,10,20,20]),lo=R.int(1,Math.ceil(total/2)-1),hi=total-lo;
  return {r,q,cov:R.bool()?[hi,lo]:[lo,hi]};
 },
 build:({r,q,cov})=>{
  const sum=r.reduce((s,x)=>s+x,0),load=sum/r.length,half=load/2;
  const stay=(100-q)/100,off=q/100,eig=(100-2*q)/100;
  const hi=Math.max(...cov),total=cov[0]+cov[1],frac=hi/total;
  const P=`[[${n(stay)},${n(off)}],[${n(off)},${n(stay)}]]`;
  const decay=eig===0.5?'halves':`is multiplied by ${n(eig)}`;
  const fracText=`${n(hi)}/(${n(cov[0])}+${n(cov[1])})=${n(frac)}`;
  return {
  prompt:`A constant load is estimated from readings ${r.map(n).join(',')} using equal-weight least squares. Two identical actuators must sum to that estimate and use minimum Euclidean norm. Network P=${P} monitors dispatch. A scan covariance is diag${vec(cov,',')}. Enter: estimated load; actuator 1; actuator 2; stationary network probability for node 1; nonstationary eigenvalue of P; fraction of scan variance retained by one PCA axis.`,
  answer:[load,half,half,0.5,eig,frac],
  hints:['Average the readings; then share the resulting load equally between identical actuators.',
   `P is symmetric and stochastic, with eigenvalues 1 and ${n(eig)}; total scan variance is ${n(total)}.`],
  solution:`The least-squares load is (${r.map(n).join('+')})/${r.length}=${n(load)}. Minimum-norm allocation is ${vec([half,half],',')}. Network symmetry gives stationary distribution (0.5,0.5); the difference mode (1,−1) has eigenvalue ${n(eig)}, so imbalance ${decay} each step. The leading covariance eigenvalue retains ${fracText} of scan variance. These checks commission the full sensing, dispatch, and monitoring pipeline.`,
  guidance:[
   {prompt:`Average actual readings ${r.map(n).join(',')}, then divide that estimate equally between two identical actuators. Enter load and both commands.`,answer:[load,half,half],explanation:`The average is ${n(sum)}/${r.length}=${n(load)}. Equal sharing ${vec([half,half],',')} meets that demand with minimum squared effort.`},
   {prompt:`For actual P, compute the coefficient on (1,−1); for covariance diag${vec(cov,',')}, compute its leading variance fraction.`,answer:[eig,frac],explanation:`P(1,−1)=${vec([eig,-eig],',')}, so the nonstationary eigenvalue is ${n(eig)}. The variance fraction is ${fracText}; symmetry gives stationary p₁=0.5.`}
  ]};}
},
q55:{
 /* Samples are (a,b,c,b): equal odd samples keep every DFT value real. */
 canonical:{a:1,b:0,c:-1},
 draw:R=>({a:R.nz(-9,9),b:R.bool()?0:R.nz(-4,4),c:R.nz(-9,9)}),
 build:({a,b,c})=>{
  const X0=a+2*b+c,X1=a-c,X2=a-2*b+c;
  const prompt=`For samples x=${vec([a,b,c,b],',')}, use the unnormalized four-point DFT. Enter the real values X₀,X₁,X₂,X₃ (all imaginary parts are zero).`;
  const s0=`X₀=${sumExpr([a,b,c,b])}=${n(X0)}.`;
  const s1=`For k=1 and k=3, the n=2 factor is −1, so ${n(a)}+(−1)(${n(c)})=${n(X1)}.`+(b?' The n=1 and n=3 factors are −i and +i (swapped for k=3), so the equal samples x₁=x₃ cancel.':'');
  const s2=b?`For k=2 the n=2 factor is +1 and the n=1, n=3 factors are −1, so X₂=${sumExpr([a,-b,c,-b])}=${n(X2)}.`:`For k=2 the n=2 factor is +1, so X₂=${n(X2)}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[X0,X1,X2,X1],hints:[s0,s2],solution,
  guidance:[
   {prompt:'What is X₀, the sum of the four samples?',answer:[X0],explanation:'DC measures the total signal before normalization.'},
   {prompt,answer:[X0,X1,X2,X1],explanation:solution}
  ]};}
},
q56:{
 /* a·x+b·y=e and c·x+d·y=f, strictly diagonally dominant. */
 canonical:{a:4,b:1,c:1,d:3,e:9,f:7},
 draw:R=>{
  const a=R.int(2,6),d=R.int(2,6);
  return {a,b:R.nz(-(a-1),a-1),c:R.nz(-(d-1),d-1),d,e:R.nz(-9,12),f:R.nz(-9,12)};
 },
 build:({a,b,c,d,e,f})=>{
  const x1=e/a,y1=f/d;
  const frac=(p,q)=>`${n(p)}/${n(q)}`+(Number.isInteger(p/q)?`=${n(p/q)}`:'');
  const prompt=`For ${lin(a,'x',b,'y')}=${n(e)} and ${lin(c,'x',d,'y')}=${n(f)}, start (x₀,y₀)=(0,0). Enter x₁,y₁ after one simultaneous Jacobi step.`;
  const s0=`Isolate x=(${n(e)}${term(-b,'y')})/${n(a)} and y=(${n(f)}${term(-c,'x')})/${n(d)}.`;
  const s1=`Use old y₀=0 to obtain x₁=${frac(e,a)}.`,s2=`Use old x₀=0 to obtain y₁=${frac(f,d)}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[x1,y1],hints:[s0,s2],solution,
  guidance:[
   {prompt:`Compute (${n(e)}${b>0?'−':'+'}${Math.abs(b)===1?'':n(Math.abs(b))+'·'}0)/${n(a)}.`,answer:[x1],explanation:'The first iterate uses the previous y value.'},
   {prompt,answer:[x1,y1],explanation:solution}
  ]};}
},
q57:{
 /* A=diag(0,−k), x(0)=(u,v), t=ln(m). */
 canonical:{k:2,m:2,u:3,v:4},
 draw:R=>{
  const [m,k]=R.pick([[2,1],[3,1],[4,1],[5,1],[6,1],[2,2],[3,2],[4,2],[2,3],[2,4]]),D=Math.pow(m,k);
  const top=Math.max(1,Math.min(6,Math.floor(36/D)));
  return {k,m,u:R.nz(-9,9),v:R.nz(-top,top)*D};
 },
 build:({k,m,u,v})=>{
  const D=Math.pow(m,k),x2=v/D;
  const prompt=`A=diag(0,${n(-k)}), x(0)=${vec([u,v],',')}. At time t=ln(${n(m)}), enter x(t).`;
  const s0=`The first component is ${n(u)}exp(0t)=${n(u)}.`;
  const s1=`The second is ${n(v)}exp(−${k===1?'':n(k)}ln${n(m)})=${n(v)}/${n(D)}=${n(x2)}.`;
  const s2='Zero eigenvalues preserve a component; negative ones decay.';
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[u,x2],hints:[s0,s2],solution,
  guidance:[
   {prompt:'What is the unchanged first component?',answer:[u],explanation:'Its differential equation is x₁′=0.'},
   {prompt,answer:[u,x2],explanation:solution}
  ]};}
},
q58:{
 /* p(t)=c0+c1·t+c2·t². */
 canonical:{c:[2,-3,4]},
 draw:R=>({c:[R.nz(-9,9),R.nz(-9,9),R.nz(-6,6)]}),
 build:({c})=>{
  const d=[c[1],2*c[2]];
  const prompt=`For p(t)=${n(c[0])}${term(c[1],'t')}${term(c[2],'t²')}, enter coordinates of p′(t) in basis (1,t).`;
  const s0=`Differentiate the constant ${n(c[0])} to zero.`;
  const s1=`The derivative of ${term(c[1],'t',true)} is ${n(d[0])}.`;
  const s2=`The derivative of ${term(c[2],'t²',true)} is ${term(d[1],'t',true)}, giving coordinates ${vec(d,',')}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:d,hints:[s0,s2],solution,
  guidance:[
   {prompt:'What is the constant coefficient of p′? ',answer:[d[0]],explanation:`The linear term contributes ${n(d[0])}.`},
   {prompt,answer:d,explanation:solution}
  ]};}
},
q59:{
 /* ℓ(x)=l[0]·x₁+l[1]·x₂; basis columns b1, b2. */
 canonical:{l:[2,-1],b1:[1,1],b2:[1,-1]},
 draw:R=>{
  for(let guard=0;guard<500;guard++){
   const l=[R.nz(-5,5),R.nz(-5,5)],b1=[R.nz(-3,3),R.nz(-3,3)],b2=[R.nz(-3,3),R.nz(-3,3)];
   const v1=l[0]*b1[0]+l[1]*b1[1],v2=l[0]*b2[0]+l[1]*b2[1];
   if(b1[0]*b2[1]-b1[1]*b2[0]!==0&&v1!==0&&v2!==0)return {l,b1,b2};
  }
  return {l:[3,2],b1:[1,2],b2:[2,-1]};
 },
 build:({l,b1,b2})=>{
  const val=b=>l[0]*b[0]+l[1]*b[1],v1=val(b1),v2=val(b2);
  /* The functional with a basis vector substituted, as in "2(1)−1". */
  const sub=(c,v,first)=>(c<0?'−':(first?'':'+'))+(Math.abs(c)===1?par(v):`${n(Math.abs(c))}(${n(v)})`);
  const prompt=`A sensor reads ℓ(x)=${lin(l[0],'x₁',l[1],'x₂')}. The new basis columns are b₁=${vec(b1,',')}, b₂=${vec(b2,',')}. Enter the two coefficients of ℓ in this basis.`;
  const s0=`Evaluate ℓ(b₁)=${n(l[0]*b1[0])}${plus(l[1]*b1[1])}=${n(v1)}.`;
  const s1=`Evaluate ℓ(b₂)=${n(l[0]*b2[0])}${plus(l[1]*b2[1])}=${n(v2)}.`;
  const s2=`Thus ℓ(Bc)=${lin(v1,'c₁',v2,'c₂')}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[v1,v2],hints:[s0,s2],solution,
  guidance:[
   {prompt:`Evaluate ${sub(l[0],b1[0],true)}${sub(l[1],b1[1])} for the first basis vector.`,answer:[v1],explanation:'The dual coefficients are the readings on each basis vector.'},
   {prompt,answer:[v1,v2],explanation:solution}
  ]};}
},
q60:{
 /* K=diag(lam[i]·m[i]), M=diag(m); lam is ascending and distinct. */
 canonical:{lam:[4,9],m:[2,2]},
 draw:R=>{
  for(let guard=0;guard<500;guard++){
   const pool=R.bool()?[1,4,9,16,25]:[1,2,3,4,5,6,7,8,9,10,12,16];
   const a=R.pick(pool),b=R.pick(pool),m=[R.int(2,6),R.int(2,6)];
   const lam=[Math.min(a,b),Math.max(a,b)];
   if(a!==b&&lam[0]*m[0]<=60&&lam[1]*m[1]<=60)return {lam,m};
  }
  return {lam:[4,9],m:[3,2]};
 },
 build:({lam,m})=>{
  const K=[lam[0]*m[0],lam[1]*m[1]];
  const prompt=`K=diag${vec(K,',')}, M=diag${vec(m,',')}. Enter the two generalized eigenvalues in ascending order.`;
  const s0=`For mode e₁, ${n(K[0])}=λ·${n(m[0])}, so λ=${n(lam[0])}.`;
  const s1=`For mode e₂, ${n(K[1])}=λ·${n(m[1])}, so λ=${n(lam[1])}.`;
  const s2=`Their natural angular frequencies are ${root(lam[0])} and ${root(lam[1])}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:lam,hints:[s0,s2],solution,
  guidance:[
   {prompt:`What is ${n(K[0])}/${n(m[0])} for the first mode?`,answer:[lam[0]],explanation:'The mass scales the eigenvalue equation.'},
   {prompt,answer:lam,explanation:solution}
  ]};}
},
q61:{
 /* a·x+b·y=f and c·x+d·y=g, built backwards from the integer solution (x,y). */
 canonical:{a:2,b:1,c:1,d:3,x:2,y:1},
 draw:R=>{
  for(let guard=0;guard<500;guard++){
   const a=R.pick([2,2,4,5]),b=R.nz(-4,4),c=R.nz(-4,4),d=R.nz(-6,6),x=R.nz(-5,5),y=R.nz(-5,5);
   const f=a*x+b*y,g=c*x+d*y;
   if(a*d-b*c!==0&&f!==0&&g!==0&&Math.abs(f)<=30&&Math.abs(g)<=30)return {a,b,c,d,x,y};
  }
  return {a:2,b:1,c:3,d:4,x:1,y:2};
 },
 build:({a,b,c,d,x,y})=>{
  const f=a*x+b*y,g=c*x+d*y,S=r6(d-c*b/a),shift=r6(c*f/a),rhs=r6(g-c*f/a);
  const prompt=`Solve ${lin(a,'x',b,'y')}=${n(f)} and ${lin(c,'x',d,'y')}=${n(g)} by eliminating x. Enter the Schur coefficient S, y, then x.`;
  const s0=`From the first row, x=(${n(f)}${term(-b,'y')})/${n(a)}.`;
  const s1=`S=${n(d)}−${par(c)}·(1/${n(a)})·${par(b)}=${n(S)} and reduced right side is ${n(g)}${plus(-shift)}=${n(rhs)}.`;
  const s2=`Thus y=${n(y)} and x=${n(x)}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[S,y,x],hints:[s0,s2],solution,
  guidance:[
   {prompt:`Compute ${n(d)}${plus(-c*b)}/${n(a)}.`,answer:[S],explanation:'This is the coefficient left after removing x.'},
   {prompt,answer:[S,y,x],explanation:solution}
  ]};}
},
q62:{
 /* P swaps coordinate 1 with coordinate j (2 or 3, stored zero-based). */
 canonical:{x:[2,-1,3],j:2},
 draw:R=>{
  for(let guard=0;guard<500;guard++){
   const x=[R.nz(-6,6),R.nz(-6,6),R.nz(-6,6)],j=R.pick([1,2,2]);
   if(x[0]!==x[j])return {x,j};
  }
  return {x:[4,-2,1],j:2};
 },
 build:({x,j})=>{
  const y=x.slice();y[0]=x[j];y[j]=x[0];
  const sq=v=>v.map(t=>n(t*t)).join('+'),norm=x.reduce((s,t)=>s+t*t,0);
  const prompt=`P swaps the first and ${ORD[j]} coordinates. For x=${vec(x,',')}, enter Px and its squared norm.`;
  const s0=`Swap the first and ${ORD[j]} entries: Px=${vec(y,',')}.`;
  const s1=`Its squared norm is ${sq(y)}=${n(norm)}.`;
  const s2=`The original squared norm is also ${sq(x)}=${n(norm)}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[...y,norm],hints:[s0,s2],solution,
  guidance:[
   {prompt:'What is the first coordinate after the swap?',answer:[y[0]],explanation:`The first output reads the ${ORD[j]} input.`},
   {prompt,answer:[...y,norm],explanation:solution}
  ]};}
},
q63:{
 canonical:{x:[1,2,2,1]},
 draw:R=>({x:[R.nz(-4,6),R.nz(-4,6),R.nz(-4,6),R.nz(-4,6)]}),
 build:({x})=>{
  const y=[2*x[0]-x[1],-x[0]+2*x[1]-x[2],-x[1]+2*x[2]-x[3],-x[2]+2*x[3]];
  const prompt=`A is 4×4 with diagonal 2 and adjacent diagonals −1, all else zero. For x=${vec(x,',')}, enter Ax, then the number of nonzero matrix entries.`;
  const s0=`Rows give ${n(2*x[0])}${plus(-x[1])}=${n(y[0])}; ${n(-x[0])}${plus(2*x[1])}${plus(-x[2])}=${n(y[1])}.`;
  const s1=`The remaining rows give ${n(-x[1])}${plus(2*x[2])}${plus(-x[3])}=${n(y[2])} and ${n(-x[2])}${plus(2*x[3])}=${n(y[3])}.`;
  const s2='There are 4 diagonal and 3+3 off-diagonal entries, totaling 10.';
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[...y,10],hints:[s0,s2],solution,
  guidance:[
   {prompt:`Compute the first row: 2·${par(x[0])}${plus(-x[1])}.`,answer:[y[0]],explanation:'The first node has only one neighbor in this stencil.'},
   {prompt,answer:[...y,10],explanation:solution}
  ]};}
},
q64:{
 /* A=diag(a), b, ridge weight lam; b is chosen so both answers are short decimals. */
 canonical:{a:[1,2],b:[2,4],lam:1},
 draw:R=>{
  for(let guard=0;guard<500;guard++){
   const a=[R.int(1,4),R.int(1,4)],lam=R.int(1,6),b=[R.nz(-9,9),R.nz(-9,9)];
   if(a.every((t,i)=>(Math.abs(t*b[i])*100)%(t*t+lam)===0)&&!(a[0]===1&&a[1]===1))return {a,b,lam};
  }
  return {a:[2,3],b:[4,5],lam:1};
 },
 build:({a,b,lam})=>{
  const den=a.map(t=>t*t+lam),num=a.map((t,i)=>t*b[i]),x=num.map((t,i)=>t/den[i]);
  const whole=x.every(Number.isInteger);
  const shown=num.map((t,i)=>Number.isInteger(x[i])?n(x[i]):`${n(t)}/${n(den[i])}`);
  const prompt=`A=diag${vec(a,',')}, b=${vec(b,',')}, λ=${n(lam)}. Enter the ridge solution x.`;
  const s0=`AᵀA+${lam===1?'':n(lam)}I=diag${vec(den,',')}.`;
  const s1=`Aᵀb=${vec(num,',')}.`;
  const s2=`Divide coordinatewise: x=(${shown.join(',')})${whole?'':'='+vec(x,',')}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:x,hints:[s0,s2],solution,
  guidance:[
   {prompt:`What is the first component ${n(num[0])}/(${n(a[0]*a[0])}+${n(lam)})?`,answer:[x[0]],explanation:`The regularized diagonal is ${n(den[0])}.`},
   {prompt,answer:x,explanation:solution}
  ]};}
},
q65:{
 /* Samples f at positions x0, x0+h, x0+2h; h is stored in hundredths. */
 canonical:{f:[1,4,9],x0:0,h:50},
 draw:R=>{
  for(let guard=0;guard<500;guard++){
   const h=R.pick([50,50,25,20,10,200]),unit=h===200?2:1;
   const f0=R.int(-9,9),f1=f0+unit*R.nz(-5,5),f2=f1+unit*R.nz(-5,5);
   if(Math.abs(f1)<=12&&Math.abs(f2)<=12)return {f:[f0,f1,f2],x0:R.int(-2,3),h};
  }
  return {f:[2,5,3],x0:1,h:50};
 },
 build:({f,x0,h})=>{
  const step=h/100,pos=[x0,r6(x0+step),r6(x0+2*step)];
  const s=[(f[1]-f[0])*100/h,(f[2]-f[1])*100/h];
  const diff=i=>`(${n(f[i+1])}${f[i]===0?'−0':plus(-f[i])})/${n(step)}`;
  const prompt=`Temperature samples are ${vec(f,',')} at positions ${vec(pos,',')}. Enter the two forward differences.`;
  const s0=`The common spacing is h=${n(step)}.`;
  const s1=`First slope is ${diff(0)}=${n(s[0])}.`;
  const s2=`Second slope is ${diff(1)}=${n(s[1])}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:s,hints:[s0,s2],solution,
  guidance:[
   {prompt:`Compute the first change divided by spacing: ${diff(0)}.`,answer:[s[0]],explanation:'The derivative is change per unit distance.'},
   {prompt,answer:s,explanation:solution}
  ]};}
},
q66:{
 /* Maximize c1·x+c2·y with x+y≤S, x≤U, x,y≥0. c1>c2>0 and 0<U<S make (U,S−U) the unique optimum. */
 canonical:{c1:3,c2:2,S:4,U:2},
 draw:R=>{const c2=R.int(1,6),c1=R.int(c2+1,9),U=R.int(1,7),S=R.int(U+1,12);return {c1,c2,S,U};},
 build:({c1,c2,S,U})=>{
  const y=S-U,best=c1*U+c2*y,extra=c1-c2;
  const prompt=`Maximize ${lin(c1,'x',c2,'y')} with x+y≤${n(S)}, x≤${n(U)}, x,y≥0. Enter optimal x,y, then maximum value.`;
  const s0=`Use x=${n(U)} and y=${n(y)}, satisfying both resource limits.`;
  const s1=`A dual price ${vec([c2,extra],',')} on the two limits gives upper bound ${n(c2)}·${n(S)}+${n(extra)}·${n(U)}=${n(best)}: ${c2===1?'':n(c2)}(x+y)${term(extra,'x')}=${lin(c1,'x',c2,'y')}.`;
  const s2=`The feasible allocation reaches ${n(best)}, so it is globally optimal.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[U,y,best],hints:[s0,s2],solution,
  guidance:[
   {prompt:`At x=${n(U)} and x+y=${n(S)}, what is y?`,answer:[y],explanation:`The remaining shared resource allows y=${n(y)}.`},
   {prompt,answer:[U,y,best],explanation:solution}
  ]};}
},
q67:{
 canonical:{x:[1,2,3],h:[1,-1]},
 draw:R=>({x:[R.nz(-5,6),R.nz(-5,6),R.nz(-5,6)],h:[R.nz(-3,3),R.nz(-3,3)]}),
 build:({x,h})=>{
  const y=[x[0]*h[0],x[1]*h[0]+x[0]*h[1],x[2]*h[0]+x[1]*h[1],x[2]*h[1]];
  const prompt=`Convolve x=${vec(x,',')} with h=${vec(h,',')}, using zeros outside x. Enter all four output samples.`;
  const s0=`The first output is ${n(y[0])}.`;
  const s1=`Interior outputs are ${n(x[1]*h[0])}${plus(x[0]*h[1])}=${n(y[1])} and ${n(x[2]*h[0])}${plus(x[1]*h[1])}=${n(y[2])}.`;
  const s2=`The final output is 0${plus(x[2]*h[1])}=${n(y[3])}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:y,hints:[s0,s2],solution,
  guidance:[
   {prompt:'What is the first output x₀h₀?',answer:[y[0]],explanation:'All other first-output terms are zero outside the signal.'},
   {prompt,answer:y,explanation:solution}
  ]};}
},
q68:{
 /* H=diag(h), b, step α=al/1000. b[0]>0, and α·h≤1 so no update eigenvalue is negative. */
 canonical:{h:[2,4],b:[2,4],al:250},
 draw:R=>{
  const [al,top]=R.pick([[100,9],[100,9],[200,5],[200,5],[250,4],[250,4],[125,8],[500,2]]);
  const h1=R.int(1,top),h2=R.except(1,top,[h1]);
  return {h:[h1,h2],b:[R.int(1,9),R.nz(-9,9)],al};
 },
 build:({h,b,al})=>{
  const alpha=al/1000,x=b.map(t=>t*al/1000),e=h.map(t=>(1000-al*t)/1000),big=Math.max(...e);
  const prompt=`H=diag${vec(h,',')}, b=${vec(b,',')}, x₀=(0,0), α=${n(alpha)}. Enter x₁ and the largest eigenvalue of the update matrix I−αH.`;
  const s0=`At zero, gradient is −b=${vec([-b[0],-b[1]],',')}.`;
  const s1=`Subtract ${n(alpha)} times the gradient to obtain ${vec(x,',')}.`;
  const s2=`I−${n(alpha)}H=diag${vec(e,',')}, whose largest eigenvalue is ${n(big)}.`;
  const solution=`${s0} ${s1} ${s2}`;
  return {prompt,answer:[x[0],x[1],big],hints:[s0,s2],solution,
  guidance:[
   {prompt:`Compute the first update 0−${n(alpha)}(${n(-b[0])}).`,answer:[x[0]],explanation:'Moving opposite the negative gradient increases the first coordinate.'},
   {prompt,answer:[x[0],x[1],big],explanation:solution}
  ]};}
}
});
})();
