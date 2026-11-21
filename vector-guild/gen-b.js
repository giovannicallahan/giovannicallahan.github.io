/* Mission generators, group B: q18–q28, q31, q44, q45, q48, q51–q53.
   Shape follows qa/generator-example.js.txt: canonical parameters, draw(R), build(p). */
(function(){
'use strict';
const G=window.Gen,{n,plus,par,vec}=G;

/* ---------- shared text helpers ---------- */
const V=v=>vec(v,',');                                   // "(3,−1,2)"
const M2=m=>`[[${n(m[0])},${n(m[1])}],[${n(m[2])},${n(m[3])}]]`;
const cf=c=>c===1?'':c===-1?'−':n(c);                    // leading coefficient: "", "−", "2"
const sc=c=>c===1?'+':c===-1?'−':plus(c);                // later coefficient: "+", "−", "+2", "−2"
/* "2x−y+3z" from [[2,'x'],[−1,'y'],[3,'z']]; zero terms are skipped. */
const lin=terms=>{let s='';for(const [c,v] of terms){if(!c)continue;s+=(s?sc(c):cf(c))+v;}return s||'0';};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
/* Reduced fraction text: frac(7,6) → "7/6", frac(−6,2) → "−3". */
const frac=(a,b)=>{if(b<0){a=-a;b=-b;}const g=gcd(a,b)||1;a/=g;b/=g;return b===1?n(a):`${n(a)}/${b}`;};
const pfrac=(a,b)=>(a*b<0?'−':'+')+frac(Math.abs(a),Math.abs(b));
/* Dot product written out with every coefficient shown: "4·1+1·2", "4·1−1·(−2)". */
const dotx=(c,x)=>{let s='';c.forEach((ci,i)=>{if(!ci)return;s+=(s?(ci<0?'−':'+')+n(Math.abs(ci)):n(ci))+'·'+par(x[i]);});return s||'0';};
/* Row times vector with unit coefficients dropped: "3·5+4", "2·4". */
const rowdot=(c,x)=>{let s='';c.forEach((ci,i)=>{if(!ci)return;const a=Math.abs(ci);
  if(!s)s=ci===1?n(x[i]):ci===-1?'−'+par(x[i]):`${n(ci)}·${par(x[i])}`;
  else s+=(ci<0?'−':'+')+(a===1?par(x[i]):`${n(a)}·${par(x[i])}`);});return s||'0';};
const sq=x=>`${par(x)}²`;
const short=x=>Math.abs(x*1e4-Math.round(x*1e4))<1e-9;
const ORD=['first','second','third'];
const WORD=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const word=k=>(k<0?'minus ':'')+(WORD[Math.abs(k)]||n(Math.abs(k)));
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const mul2=(m,x)=>[m[0]*x[0]+m[1]*x[1],m[2]*x[0]+m[3]*x[1]];
/* Rejection sampling with a guaranteed stop: falls back to a known-good parameter set. */
const until=(make,ok,fallback)=>{for(let i=0;i<4000;i++){const p=make();if(ok(p))return p;}return fallback;};

/* ---------- Gram–Schmidt geometry shared by q19 and q22 ---------- */
function gs(a1,a2){
 const l1=Math.hypot(...a1),q1=a1.map(x=>x/l1),c=dot(q1,a2),proj=q1.map(x=>c*x),res=a2.map((x,i)=>x-proj[i]),len=Math.hypot(...res),q2=res.map(x=>x/len);
 return {l1,q1,c,proj,res,len,q2,i:a1.findIndex(x=>x!==0)};
}
/* a₁ lies on a coordinate axis; the part of a₂ off that axis has an integer length. */
function drawGS(R,cmax){
 const i=R.int(0,2),others=[0,1,2].filter(k=>k!==i),a1=[0,0,0],a2=[0,0,0];
 a1[i]=R.nz(-cmax,cmax);a2[i]=R.nz(-6,6);
 if(R.next()<.6){a2[R.pick(others)]=R.nz(-6,6);}
 else{const pr=R.pick([[3,4],[4,3],[6,8],[8,6]]);a2[others[0]]=pr[0]*(R.bool()?1:-1);a2[others[1]]=pr[1]*(R.bool()?1:-1);}
 return {a1,a2};
}
const drawGSnew=(R,cmax)=>until(()=>drawGS(R,cmax),({a1,a2})=>!(a1.join()==='1,0,0'&&a2.join()==='1,2,0'),{a1:[2,0,0],a2:[3,4,0]});
/* Index j if q is exactly the positive coordinate axis e_j, else −1. */
const axisOf=q=>{const nzs=q.filter(x=>Math.abs(x)>1e-12);return nzs.length===1&&Math.abs(nzs[0]-1)<1e-12?q.findIndex(x=>Math.abs(x)>1e-12):-1;};
const negAxisOf=q=>axisOf(q.map(x=>-x));

Object.assign(window.MISSION_GEN,{

/* ---------- q18 orthogonal projection ---------- */
q18:{
 canonical:{v:[4,2],u:[1,1]},
 draw:R=>until(()=>({v:[R.int(-9,9),R.int(-9,9)],u:[R.nz(-4,4),R.nz(-4,4)]}),
  ({v,u})=>{const uv=dot(u,v),uu=dot(u,u);return uv!==0&&(2*uv)%uu===0&&uv!==uu&&u[0]*v[1]-u[1]*v[0]!==0&&!(v.join()==='4,2'&&u.join()==='1,1');},{v:[5,1],u:[1,2]}),
 build:({v,u})=>{const uv=dot(u,v),uu=dot(u,u),al=uv/uu,p=u.map(x=>al*x),r=v.map((x,i)=>x-p[i]);return {
  prompt:`Project v=${V(v)} onto the line spanned by u=${V(u)}. Enter the projected x,y.`,
  answer:p,
  hints:[`u·v=${n(uv)} and u·u=${n(uu)}.`,`Multiply u by ${n(al)}.`],
  solution:`projᵤv=(${n(uv)}/${n(uu)})${V(u)}=${V(p)}; residual ${V(r)} is perpendicular to u.`,
  guidance:[
   {prompt:`For u=${V(u)}, v=${V(v)}, compute u·v and u·u.`,answer:[uv,uu],explanation:`The dot products are ${n(u[0]*v[0])}${plus(u[1]*v[1])}=${n(uv)} and ${n(u[0]*u[0])}+${n(u[1]*u[1])}=${n(uu)}.`},
   {prompt:`Find α=${n(uv)}/${n(uu)}, then the projected x coordinate α·${par(u[0])}.`,answer:[al,p[0]],explanation:'The same coefficient multiplies the y coordinate of u as well.'}
  ]};}
},

/* ---------- q19 Gram–Schmidt ---------- */
q19:{
 canonical:{a1:[1,0,0],a2:[1,2,0]},
 draw:R=>drawGSnew(R,4),
 build:({a1,a2})=>{const g=gs(a1,a2);return {
  prompt:`Let a₁=${V(a1)}, a₂=${V(a2)}. After Gram–Schmidt, enter q₂.${g.q2.some(e=>e<0)?' Normalise the residual without flipping its sign.':''}`,
  answer:g.q2,
  hints:[`Subtract the projection ${V(g.proj)} from a₂.`,`Normalize ${V(g.res)}.`],
  solution:`q₁=${V(g.q1)}; a₂−(q₁·a₂)q₁=${V(g.res)}, so q₂=${V(g.q2)}.`,
  guidance:[
   {prompt:`For q₁=${V(g.q1)}, a₂=${V(a2)}, compute q₁·a₂.`,answer:[g.c],explanation:`Only the ${ORD[g.i]} coordinate contributes.`},
   {prompt:`Subtract the projection ${V(g.proj)} from a₂. Enter the residual and its length.`,answer:[...g.res,g.len],explanation:`The residual is ${V(g.res)}, whose Euclidean length is ${n(g.len)}. Divide by ${n(g.len)} to get q₂.`}
  ]};}
},

/* ---------- q20 least-squares constant ---------- */
q20:{
 canonical:{ys:[2,4,9]},
 draw:R=>until(()=>({ys:[R.int(-3,12),R.int(-3,12),R.int(-3,12)]}),
  ({ys})=>(ys[0]+ys[1]+ys[2])%3===0&&ys[0]!==ys[1]&&ys[1]!==ys[2]&&ys[0]!==ys[2]&&ys.join()!=='2,4,9',{ys:[1,3,8]}),
 build:({ys})=>{const s=ys[0]+ys[1]+ys[2],c=s/3,r=ys.map(y=>y-c),q=r.map(x=>x*x),sse=q[0]+q[1]+q[2],mc=c===0?'−0':plus(-c);return {
  prompt:`A constant voltage c is fitted to measurements ${ys.map(n).join(',')} V with equal weights. Enter c and the sum of squared residuals.`,
  answer:[c,sse],
  hints:['Average all three samples.',`Residuals are ${r.map(n).join(',')}.`],
  solution:`c=${n(s)}/3=${n(c)} V. Squared error=${q.map(n).join('+')}=${n(sse)} V².`,
  guidance:[
   {prompt:`Sum the three readings ${ys.map(n).join(',')} and enter the count.`,answer:[s,3],explanation:'The equal-weight least-squares constant is their sum divided by their count.'},
   {prompt:`For fitted value ${n(c)}, enter squared residuals from readings ${n(ys[0])} and ${n(ys[1])}.`,answer:[q[0],q[1]],explanation:`(${n(ys[0])}${mc})²=${n(q[0])} and (${n(ys[1])}${mc})²=${n(q[1])}. Add the third squared residual to finish.`}
  ]};}
},

/* ---------- q21 normal equations (times 0,1,2) ---------- */
q21:{
 canonical:{ys:[1,2,2]},
 draw:R=>until(()=>({ys:[R.int(-5,9),R.int(-5,9),R.int(-5,9)]}),({ys})=>ys[0]!==ys[2]&&!(ys[0]===1&&ys[1]===2&&ys[2]===2),{ys:[2,2,5]}),
 build:({ys})=>{const sy=ys[0]+ys[1]+ys[2],sty=ys[1]+2*ys[2],d=sty-sy;      // 2b=d
  const a=(5*sy-3*sty)/6,b=d/2;return {
  prompt:`Fit y=a+bt to samples (t,y)=(0,${n(ys[0])}),(1,${n(ys[1])}),(2,${n(ys[2])}). Enter a and b.`,
  answer:[a,b],
  hints:[`The normal equations are 3a+3b=${n(sy)} and 3a+5b=${n(sty)}.`,`Subtract them to get 2b=${n(d)}.`],
  solution:`b=${frac(d,2)}; 3a=${n(sy)}${pfrac(-3*d,2)}=${frac(2*sy-3*d,2)}, so a=${frac(2*sy-3*d,6)}.`,
  guidance:[
   {prompt:'For times 0,1,2, enter Σ1, Σt, and Σt².',answer:[3,3,5],explanation:'These define AᵀA=[[3,3],[3,5]].'},
   {prompt:`For y=${ys.map(n).join(',')}, enter Σy and Σty.`,answer:[sy,sty],explanation:`Σy=${n(sy)} and Σty=0·${par(ys[0])}+1·${par(ys[1])}+2·${par(ys[2])}=${n(sty)}, the right-hand side of the normal equations.`}
  ]};}
},

/* ---------- q22 thin QR ---------- */
q22:{
 canonical:{a1:[1,0,0],a2:[1,2,0]},
 draw:R=>drawGSnew(R,5),
 build:({a1,a2})=>{const g=gs(a1,a2),r11=g.l1,r12=g.c,r22=g.len,i=axisOf(g.q1),j=axisOf(g.q2),nj=negAxisOf(g.q2);
  const qText=i===0&&j===1?'Q the first two coordinate axes':i>=0&&j>=0?`Q the ${ORD[i]} and ${ORD[j]} coordinate axes`:`Q columns ${V(g.q1)} and ${V(g.q2)}`;
  const last=j>=0?`The second orthonormal axis extracts the ${ORD[j]} coordinate, giving ${n(r22)}.`
   :nj>=0?`The second orthonormal axis extracts the negated ${ORD[nj]} coordinate, giving ${n(r22)}.`
   :`The second orthonormal axis gives ${dotx(g.q2,a2)}=${n(r22)}.`;
  return {
  prompt:`A has columns ${V(a1)} and ${V(a2)}. Using positive diagonal R, enter r₁₁,r₁₂,r₂₂.`,
  answer:[r11,r12,r22],
  hints:['Use the axes from Gram–Schmidt.',`Q columns are ${V(g.q1)} and ${V(g.q2)}.`],
  solution:`Dot products give R=[[${n(r11)},${n(r12)}],[0,${n(r22)}]], with ${qText}.`,
  guidance:[
   {prompt:`Using q₁=${V(g.q1)}, compute q₁·a₁ and q₁·a₂.`,answer:[r11,r12],explanation:'These are the top row coefficients of R.'},
   {prompt:`Using q₂=${V(g.q2)}, compute q₂·a₂ for a₂=${V(a2)}.`,answer:[r22],explanation:last}
  ]};}
},

/* ---------- q23 eigenvalues of a triangular matrix ---------- */
q23:{
 canonical:{m:[3,1,0,2]},
 draw:R=>until(()=>{const a=R.nz(-6,9),d=R.except(-6,9,[0,a]),o=R.nz(-5,5);return {m:R.bool()?[a,o,0,d]:[a,0,o,d]};},({m})=>m.join()!=='3,1,0,2',{m:[4,2,0,-1]}),
 build:({m})=>{const a=m[0],d=m[3],lo=Math.min(a,d),hi=Math.max(a,d);return {
  prompt:`For A=${M2(m)}, enter its eigenvalues in ascending order.`,
  answer:[lo,hi],
  hints:['A triangular matrix has its diagonal entries as eigenvalues.',`The characteristic polynomial is (${n(a)}−λ)(${n(d)}−λ).`],
  solution:`The roots are λ=${n(lo)} and λ=${n(hi)}.`,
  guidance:[
   {prompt:`For A=${M2(m)}, enter its two diagonal entries in their original order.`,answer:[a,d],explanation:'Because A is triangular, these are its eigenvalues.'},
   {prompt:`Evaluate det(A${sc(-lo)}I).`,answer:[0],labels:[`determinant at lambda ${n(lo)}`],explanation:`One diagonal factor is ${n(lo)}−${par(lo)}=0, so the determinant vanishes and ${n(lo)} is an eigenvalue.`}
  ]};}
},

/* ---------- q24 eigenvector with y=1 ---------- */
q24:{
 canonical:{m:[3,1,0,2],lam:2},
 /* A−λI = [[α, −αx],[kα, −kαx]]: rank one, first row nonzero, the other eigenvalue differs from λ. */
 draw:R=>until(()=>{const lam=R.nz(-5,6),al=R.nz(-3,3),x=R.nz(-4,4),k=R.pick([0,0,0,1,-1,2,-2]);
   return {m:[lam+al,-al*x,k*al,lam-k*al*x],lam};},
  ({m,lam})=>m.every(e=>Math.abs(e)<=9)&&m[0]+m[3]-lam!==lam&&!(m.join()==='3,1,0,2'&&lam===2),{m:[4,2,0,2],lam:2}),
 build:({m,lam})=>{const al=m[0]-lam,be=m[1],r2=[m[2],m[3]-lam],x=-be/al,v=[x,1],Av=mul2(m,v),AmL=`A${sc(-lam)}I`;return {
  prompt:`For A=${M2(m)} and λ=${n(lam)}, find an eigenvector with y=1. Enter x,y.`,
  answer:v,
  hints:[`The first row gives ${lin([[al,'x'],[be,'y']])}=0.`,'Use y=1.'],
  solution:`(${AmL})v=0 gives x=${cf(x)}y. Thus v=${V(v)}, and Av=${V(Av)}=${cf(lam)}v.`,
  guidance:[
   {prompt:`For ${AmL}, enter the first row.`,answer:[al,be],explanation:`${lam<0?`Adding ${n(-lam)} to`:`Subtracting ${n(lam)} from`} the diagonal gives [[${n(al)},${n(be)}],[${n(r2[0])},${n(r2[1])}]].`},
   {prompt:`With y=1, solve ${cf(al)}x${plus(be)}=0.`,answer:[x],explanation:`x must be ${n(x)}. ${r2[0]===0&&r2[1]===0?'The second row adds no restriction.':'The second row is a multiple of the first, so it adds no restriction.'}`}
  ]};}
},

/* ---------- q25 powers through eigen-modes (triangular A) ---------- */
q25:{
 canonical:{m:[3,1,0,2],x0:[0,1]},
 draw:R=>until(()=>{const a=R.pick([-3,-2,2,3]),d=R.except(-3,3,[-1,0,1,a]),o=R.nz(-3,3);
   return {m:R.bool()?[a,o,0,d]:[a,0,o,d],x0:[R.int(-3,3),R.int(-3,3)]};},
  p=>{const w=q25split(p);return w!==null&&w.every(c=>c.some(e=>e!==0))&&p.x0.some(e=>Math.abs(e)===1||e===0)&&mul2(p.m,mul2(p.m,mul2(p.m,p.x0))).every(e=>Math.abs(e)<=150)&&!(p.m.join()==='3,1,0,2'&&p.x0.join()==='0,1');},{m:[2,1,0,3],x0:[1,1]}),
 build:({m,x0})=>{const x1=mul2(m,x0),x2=mul2(m,x1),x3=mul2(m,x2),w=q25split({m,x0}),a=m[0],d=m[3];
  const step=x=>`(${rowdot([m[0],m[1]],x)},${rowdot([m[2],m[3]],x)})`;return {
  prompt:`A=${M2(m)}, x₀=${V(x0)}. Enter x₃=A³x₀.`,
  answer:x3,
  hints:[`One step gives ${V(x1)}; two give ${V(x2)}.`,`The third step is ${step(x2)}.`],
  solution:`x₁=${V(x1)}, x₂=${V(x2)}, x₃=${V(x3)}. Equivalently x₀=${V(w[0])}+${V(w[1])}, so x₃=${n(a**3)}${V(w[0])}${plus(d**3)}${V(w[1])}.`,
  guidance:[
   {prompt:`Advance x₀=${V(x0)} once under A=${M2(m)}.`,answer:x1,explanation:`Multiply each row by ${V(x0)} to get x₁=${V(x1)}.`},
   {prompt:`Advance x₁=${V(x1)} once more.`,answer:x2,explanation:`x₂=${step(x1)}=${V(x2)}. One final multiplication gives x₃.`}
  ]};}
},

/* ---------- q26 spectral theorem ---------- */
q26:{
 canonical:{m:[2,1,1,2],u:[1,1]},
 /* A = μI + k·uuᵀ: u has eigenvalue μ+k(u·u), the perpendicular direction has eigenvalue μ. */
 draw:R=>until(()=>{const u=R.pick([[1,1],[1,1],[1,-1],[1,-1],[1,2],[2,1],[1,-2],[2,-1]]),k=R.pick([1,-1,2,-2,3,-3]),mu=R.int(-6,8);
   return {m:[mu+k*u[0]*u[0],k*u[0]*u[1],k*u[0]*u[1],mu+k*u[1]*u[1]],u};},
  ({m,u})=>{const l=mul2(m,u)[0]/u[0];return m.every(e=>Math.abs(e)<=9)&&Math.abs(l)>1&&Math.abs(l)<=20&&!(m.join()==='2,1,1,2'&&u.join()==='1,1');},{m:[3,2,2,3],u:[1,-1]}),
 build:({m,u})=>{const Au=mul2(m,u),l=Au[0]/u[0],tr=m[0]+m[3],o=tr-l,uu=dot(u,u);let w=[u[1],-u[0]];if(w[0]<0)w=[-w[0],-w[1]];return {
  prompt:`A=${M2(m)}. For normalized mode q=${V(u)}/√${uu}, enter its eigenvalue and the other eigenvalue.`,
  answer:[l,o],
  hints:[`A${V(u)}=${V(Au)}.`,'The trace equals the sum of the two eigenvalues.'],
  solution:`q has eigenvalue ${n(l)}. The perpendicular direction ${V(w)}/√${uu} has eigenvalue ${n(o)}.`,
  guidance:[
   {prompt:`Apply A=${M2(m)} to ${V(u)}.`,answer:Au,explanation:`The result is ${l===2?'twice':word(l)+' times'} the input direction.`},
   {prompt:'Compute trace(A), the sum of diagonal entries.',answer:[tr],explanation:`The two eigenvalues must sum to ${n(tr)}, so knowing one determines the other.`}
  ]};}
},

/* ---------- q27 singular values (perpendicular columns) ---------- */
q27:{
 canonical:{A:[[3,0],[0,-2],[0,0]]},
 draw:R=>until(()=>{const A=[[0,0],[0,0],[0,0]],rows=[0,1,2],k=R.int(0,2),rest=rows.filter(r=>r!==k),sg=()=>R.bool()?1:-1;
   if(R.next()<.7){const i=R.pick(rest);A[k][0]=R.nz(-9,9);A[i][1]=R.nz(-9,9);}
   else{const c=R.int(0,1),pr=R.pick([[3,4],[4,3]]);A[k][c]=R.nz(-9,9);A[rest[0]][1-c]=pr[0]*sg();A[rest[1]][1-c]=pr[1]*sg();}
   return {A};},
  ({A})=>{const g=[0,1].map(c=>A.reduce((s,r)=>s+r[c]*r[c],0));return g[0]!==g[1]&&!(g[0]===9&&g[1]===4&&A[0][0]===3&&A[1][1]===-2);},{A:[[0,5],[2,0],[0,0]]}),
 build:({A})=>{const cols=[0,1].map(c=>A.map(r=>r[c])),g=cols.map(c=>dot(c,c)),hi=Math.max(...g),lo=Math.min(...g),s1=Math.sqrt(hi),s2=Math.sqrt(lo);
  const ss=c=>c.filter(e=>e!==0).map(sq).join('+');return {
  prompt:`A=[${A.map(r=>`[${r.map(n).join(',')}]`).join(',')}]. Enter its singular values in descending order.`,
  answer:[s1,s2],
  hints:[`AᵀA=diag(${n(g[0])},${n(g[1])}).`,'Take nonnegative square roots.'],
  solution:`AᵀA has eigenvalues ${n(hi)} and ${n(lo)}; singular values are ${n(s1)} and ${n(s2)}.`,
  guidance:[
   {prompt:'For the mission A, enter the diagonal of AᵀA.',answer:g,explanation:`The squared column lengths are ${ss(cols[0])}=${n(g[0])} and ${ss(cols[1])}=${n(g[1])}; columns are perpendicular.`},
   {prompt:`Take the nonnegative square root of the larger eigenvalue ${n(hi)}.`,answer:[s1],explanation:`The largest stretch is ${n(s1)}; take the square root of ${n(lo)} for the other stretch.`}
  ]};}
},

/* ---------- q28 PCA of a diagonal covariance ---------- */
q28:{
 canonical:{sx:4,sy:1},
 draw:R=>until(()=>{const t=R.pick([4,5,8,10,10,16,16,20,20,25,25,32,40,50]),a=R.int(1,t-1);return R.bool()?{sx:a,sy:t-a}:{sx:t-a,sy:a};},
  ({sx,sy})=>sx!==sy&&Math.max(sx,sy)<=36&&short(Math.max(sx,sy)/(sx+sy))&&!(sx===4&&sy===1),{sx:3,sy:1}),
 build:({sx,sy})=>{const xl=sx>sy,hi=Math.max(sx,sy),lo=Math.min(sx,sy),t=sx+sy,f=hi/t,ax=xl?'x':'y',ot=xl?'y':'x',dir=xl?[1,0]:[0,1];return {
  prompt:`A centered survey has covariance [[${n(sx)},0],[0,${n(sy)}]]. Enter the fraction of total variance captured by the first principal component and its x,y unit direction with positive ${ax}.`,
  answer:[f,...dir],
  hints:[`Total variance is the trace, ${n(t)}.`,`The largest eigenvalue is ${n(hi)} along the ${ax} axis.`],
  solution:`The ${ax} axis captures ${n(hi)}/(${n(hi)}+${n(lo)})=${n(f)} of the variance; direction ${V(dir)}.`,
  guidance:[
   {prompt:`For covariance diag(${n(sx)},${n(sy)}), enter total variance and largest eigenvalue.`,answer:[t,hi],explanation:`The trace is ${n(t)} and the leading eigenvalue is ${n(hi)}.`},
   {prompt:`Which positive unit ${ax} direction corresponds to the ${xl?'leading':'largest'} diagonal entry?`,answer:dir,explanation:`The ${ax} axis is the principal direction because its variance ${n(hi)} exceeds ${ot} variance ${n(lo)}.`}
  ]};}
},

/* ---------- q31 quadratic form / elastic energy (K symmetric positive definite) ---------- */
q31:{
 canonical:{K:[4,1,1,2],x:[1,2]},
 draw:R=>until(()=>{const b=R.nz(-3,3);return {K:[R.int(1,8),b,b,R.int(1,8)],x:[R.nz(-4,4),R.nz(-4,4)]};},
  ({K,x})=>K[0]*K[3]>K[1]*K[1]&&!(K.join()==='4,1,1,2'&&x.join()==='1,2'),{K:[2,1,1,3],x:[2,1]}),
 build:({K,x})=>{const kx=mul2(K,x),t=[x[0]*kx[0],x[1]*kx[1]],q=t[0]+t[1];return {
  prompt:`K=${M2(K)} N/m and x=${V(x)} m. Enter xᵀKx and the elastic energy.`,
  answer:[q,q/2],
  hints:[`Kx=${V(kx)}.`,`Dot ${V(x)} with ${V(kx)}.`],
  solution:`xᵀKx=${n(t[0])}${plus(t[1])}=${n(q)}; stored energy is ${n(q/2)} J.`,
  guidance:[
   {prompt:'For mission K and x, compute Kx.',answer:kx,explanation:`The rows give ${dotx([K[0],K[1]],x)}=${n(kx[0])} and ${dotx([K[2],K[3]],x)}=${n(kx[1])} N.`},
   {prompt:`Dot x=${V(x)} with ${V(kx)}.`,answer:[q],explanation:`${dotx(x,kx)}=${n(q)} J; halve it to obtain stored energy.`}
  ]};}
},

/* ---------- q44 full row reduction of a 3×3 system ---------- */
q44:{
 canonical:{A:[[1,1,1],[2,3,1],[1,-1,2]],b:[6,11,5]},
 /* Built backwards from the elimination: row₁=(1,u₁₂,u₁₃), updated row₂=(0,1,u₂₃), final row₃=(0,0,u₃₃). */
 draw:R=>until(()=>{const u12=R.nz(-3,3),u13=R.nz(-3,3),u23=R.nz(-3,3),u33=R.pick([-1,-1,2,-2,3,-3]),m21=R.nz(-3,3),m31=R.nz(-3,3),m32=R.nz(-3,3);
   const s=[R.int(-4,5),R.int(-4,5),R.int(-4,5)],r1=[1,u12,u13],r2=[0,1,u23],r3=[0,0,u33];
   const A=[r1,r1.map((e,i)=>m21*e+r2[i]),r1.map((e,i)=>m31*e+m32*r2[i]+r3[i])];
   return {A,b:A.map(r=>dot(r,s))};},
  ({A,b})=>A.every(r=>r.every(e=>e!==0&&Math.abs(e)<=9))&&b.every(e=>Math.abs(e)<=40)&&b.some(e=>e!==0)&&!(A[1].join()==='2,3,1'&&A[2].join()==='1,-1,2'&&A[0].join()==='1,1,1'),
  {A:[[1,1,1],[2,3,1],[1,-1,2]],b:[5,9,4]}),
 build:({A,b})=>{const m21=A[1][0],m31=A[2][0];
  const r2=A[1].map((e,i)=>e-m21*A[0][i]),b2=b[1]-m21*b[0],r3=A[2].map((e,i)=>e-m31*A[0][i]),b3=b[2]-m31*b[0];
  const k=-r3[1]/r2[1],u33=r3[2]+k*r2[2],bz=b3+k*b2;                     // R₃←R₃+k·R₂
  const z=bz/u33,y=(b2-r2[2]*z)/r2[1],x=b[0]-A[0][1]*y-A[0][2]*z,sol=[x,y,z];
  const row=(r,c)=>`(${r.map(n).join(',')}|${n(c)})`,eq=(r,c)=>`${lin([[r[0],'x'],[r[1],'y'],[r[2],'z']])}=${n(c)}`;
  const ka=Math.abs(k),times=ka===1?'':ka===2?'twice ':`${word(ka)} times `,km=(k<0?'−':'+')+(ka===1?'':n(ka));
  const kp=e=>ka===1?par(e):`(${n(e)})`;
  const addSol=k>0?`Add ${times}the second row to the third`:`Subtract ${times}the second row from the third`;
  const addG=k>0?`Add ${times}the updated second row.`:`Subtract ${times}the updated second row.`;
  return {
  prompt:`Reduce the augmented system ${eq(A[0],b[0])}, ${eq(A[1],b[1])}, ${eq(A[2],b[2])} to reduced row echelon form. Enter the final right-hand column x,y,z.`,
  answer:sol,
  hints:[`Use R₂←R₂${sc(-m21)}R₁ and R₃←R₃${sc(-m31)}R₁ to get rows ${row(r2,b2)} and ${row(r3,b3)}.`,
   `Then R₃←R₃${sc(k)}R₂ gives ${row([0,0,u33],bz)}; normalize and clear above.`],
  solution:`After eliminating the first column, the second and third equations are ${eq(r2,b2)} and ${eq(r3,b3)}. ${addSol}: ${eq([0,0,u33],bz)}. Normalize to z=${n(z)}, clear z from the y row to get y=${n(y)}, then clear y,z from row 1 to get x=${n(x)}. The augmented RREF is [I | ${V(sol)}ᵀ].`,
  guidance:[
   {prompt:`Apply R₂←R₂${sc(-m21)}R₁ to the actual system. Enter new coefficients of y,z and the right-hand side.`,answer:[r2[1],r2[2],b2],explanation:`${row(A[1],b[1])}${sc(-m21)}${row(A[0],b[0])}=${row(r2,b2)}.`},
   {prompt:`The updated third row is ${row(r3,b3)}. ${addG} Enter z coefficient and right-hand side.`,answer:[u33,bz],explanation:`${n(r3[2])}${km}${kp(r2[2])}=${n(u33)} and ${n(b3)}${km}${kp(b2)}=${n(bz)}, so ${eq([0,0,u33],bz)}. Back-substitute, then clear above pivots.`}
  ]};}
},

/* ---------- q45 pivoted LU of a 2×2 matrix ---------- */
q45:{
 canonical:{m:[0,2,1,3]},
 /* Draws keep the top-left entry 0 (the mission is about a zero leading pivot); build also handles a nonzero one. */
 draw:R=>until(()=>({m:[0,R.nz(-9,9),R.nz(-9,9),R.nz(-9,9)]}),
  ({m:[a,b,c,d]})=>Math.abs(c)>Math.abs(a)&&(100*a)%c===0&&Math.abs(b-a/c*d)>1e-9&&!(a===0&&b===2&&c===1&&d===3),{m:[0,3,2,1]}),
 build:({m})=>{const [a,b,c,d]=m,l=a/c,u22=b-l*d,PA=M2([c,d,a,b]),U=M2([c,d,0,u22]),zero=a===0,la=n(Math.abs(l));return {
  prompt:`A=${M2(m)}. Swap its two rows, then factor PA=LU with unit diagonal L. Enter the elimination multiplier L₂₁ and U₁₁,U₁₂,U₂₂.`,
  answer:[l,c,d,u22],
  hints:[`After the swap, PA=${PA}.`,zero?'The entry below the first pivot is already zero.':l>0?`Subtract ${la} times the pivot row from the bottom row.`:`Add ${la} times the pivot row to the bottom row.`],
  solution:zero
   ?`P=[[0,1],[1,0]] gives PA=${PA}, already upper triangular. Thus L=I, multiplier L₂₁=0, and U=${U}. The initial zero pivot indicates a need to swap, not singularity.`
   :`P=[[0,1],[1,0]] gives PA=${PA}. The multiplier is L₂₁=${n(a)}/${par(c)}=${n(l)}, so R₂←R₂${plus(-l)}R₁ gives U=${U}. Partial pivoting moved the larger-magnitude entry ${n(c)} into the pivot position, so the multiplier has size at most 1.`,
  guidance:[
   {prompt:'Swap the rows of actual A. Enter the new top row.',answer:[c,d],explanation:`The second original row becomes the first row, giving ${zero?'a nonzero':'the larger-magnitude'} leading pivot ${n(c)}.`},
   {prompt:`The entry below the pivot is ${n(a)} and the pivot is ${n(c)}. Compute its elimination multiplier ${n(a)}/${par(c)} and the lower-right U entry.`,answer:[l,u22],
    explanation:zero?`The multiplier is zero, so the bottom row remains ${V([0,u22])}.`:`The multiplier is ${n(l)}, so the bottom row becomes ${V([a,b])}${plus(-l)}${V([c,d])}=${V([0,u22])}.`}
  ]};}
},

/* ---------- q48 homogeneous transform: rotate 90° counterclockwise, then translate ---------- */
q48:{
 canonical:{p:[2,3],t:[5,-1]},
 draw:R=>until(()=>({p:[R.nz(-6,6),R.nz(-6,6)],t:[R.nz(-6,6),R.nz(-6,6)]}),({p,t})=>!(p[0]===2&&p[1]===3&&t[0]===5&&t[1]===-1),{p:[3,2],t:[1,4]}),
 build:({p,t})=>{const r=[-p[1],p[0]],o=[r[0]+t[0],r[1]+t[1]];return {
  prompt:`A docking transform rotates 90° counterclockwise, then translates by ${V(t)}. Its homogeneous matrix is [[0,−1,${n(t[0])}],[1,0,${n(t[1])}],[0,0,1]]. Transform point ${V([p[0],p[1],1])}. Enter all three homogeneous coordinates.`,
  answer:[o[0],o[1],1],
  hints:[`The rotation alone sends ${V(p)} to ${V(r)}.`,`Add the translation ${V(t)}.`],
  solution:`The product is (${n(r[0])}${plus(t[0])},${n(r[1])}${plus(t[1])},1)=${V([o[0],o[1],1])}. Translation affects points because their last coordinate is 1.`,
  guidance:[
   {prompt:`Rotate actual point ${V(p)} counterclockwise by 90°, before translation.`,answer:r,explanation:`The rule (x,y)→(−y,x) gives ${V(r)}.`},
   {prompt:`Add translation ${V(t)} to ${V(r)}.`,answer:o,explanation:`Add coordinatewise: (${n(r[0])}${plus(t[0])},${n(r[1])}${plus(t[1])})=${V(o)}. Keep final homogeneous coordinate 1.`}
  ]};}
},

/* ---------- q51 span and dependence (u and v on different coordinate axes) ---------- */
q51:{
 canonical:{u:[1,0],v:[0,1],w:[2,3]},
 draw:R=>until(()=>{const S=[1,1,1,1,2,-1,3,-2],p=R.pick(S),q=R.pick(S),a=R.nz(-5,5),b=R.nz(-5,5);
   return R.next()<.7?{u:[p,0],v:[0,q],w:[a*p,b*q]}:{u:[0,p],v:[q,0],w:[b*q,a*p]};},
  ({u,v,w})=>!(u[0]===1&&v[1]===1&&w[0]===2&&w[1]===3),{u:[1,0],v:[0,1],w:[3,-2]}),
 build:({u,v,w})=>{const ax=u[0]!==0?0:1,ay=1-ax,N=['x','y'],p=u[ax],q=v[ay],a=w[ax]/p,b=w[ay]/q;
  const cmp=(name,c,s,target,val)=>s===1?`Compare ${name} coordinates: ${c}=${n(val)}.`:`Compare ${name} coordinates: ${cf(s)}${c}=${n(target)}, so ${c}=${n(val)}.`;
  const cA=cmp(N[ax],'a',p,w[ax],a),cB=cmp(N[ay],'b',q,w[ay],b),ind='u and v are independent, so the span has dimension 2; w adds no dimension.';
  const prompt=`Actuator vectors are u=${V(u)}, v=${V(v)}, w=${V(w)}. Enter coefficients a,b in w=au+bv, then the dimension of their span.`,sol=`${cA} ${cB} ${ind}`;
  return {
  prompt,answer:[a,b,2],hints:[cA,ind],solution:sol,
  guidance:[
   {prompt:`Which coefficient of u gives the target ${N[ax]} coordinate ${n(w[ax])}?`,answer:[a],explanation:`Only u contributes to ${N[ax]}.`},
   {prompt,answer:[a,b,2],explanation:sol}
  ]};}
},

/* ---------- q52 consistent dependent system: px+qy=r and m times it ---------- */
q52:{
 canonical:{p:1,q:2,r:5,m:2},
 draw:R=>until(()=>{const p=R.pick([1,1,1,1,2,-1,3]),c=R.nz(-6,6),k=R.nz(-4,4);return {p,q:-k*p,r:c*p,m:R.pick([2,2,3,4,-1,-2,-3])};},
  ({p,q,r,m})=>Math.abs(m*q)<=24&&Math.abs(m*r)<=36&&!(p===1&&q===2&&r===5&&m===2),{p:1,q:3,r:4,m:2}),
 build:({p,q,r,m})=>{const c=r/p,k=-q/p,e1=`${lin([[p,'x'],[q,'y']])}=${n(r)}`,e2=`${lin([[m*p,'x'],[m*q,'y']])}=${n(m*r)}`;
  const mw=m===2?'twice the first':m===-1?'the negative of the first':m>0&&m<=12?`${word(m)} times the first`:`${n(m)} times the first`;
  const h1=`The second equation is ${mw}, so no contradiction occurs.`,h2='One nonpivot variable y is free.';
  const prompt=`Commands satisfy ${e1} and ${e2}. Let y=t. Enter the constant and t coefficient in x=c+kt, then number of free variables.`;
  const sol=`${h1} Solve the first equation: x=${n(c)}${sc(k)}t and y=t. ${h2}`;
  return {
  prompt,answer:[c,k,1],hints:[h1,h2],solution:sol,
  guidance:[
   {prompt:'At t=0, what is x?',answer:[c],explanation:`Substitute y=0 in ${e1}.`},
   {prompt,answer:[c,k,1],explanation:sol}
  ]};}
},

/* ---------- q53 left inverse of a single column (p,q); entries are multiples of 0.5 ---------- */
q53:{
 canonical:{p:1,q:2},
 draw:R=>until(()=>({p:R.nz(-16,16)/2,q:R.nz(-16,16)/2}),({p,q})=>{const N=p*p+q*q,ok=e=>Math.abs(e)>=.1-1e-9&&Math.abs(e*1e3-Math.round(e*1e3))<1e-9;return N<=100&&ok(p/N)&&ok(q/N)&&!(p===1&&q===2);},{p:2,q:1}),
 build:({p,q})=>{const N=p*p+q*q,a=p/N,b=q/N,ss=`${sq(p)}+${sq(q)}`;
  const h1=`AᵀA=${ss}=${n(N)}.`,h2=`Check LA=${n(a*p)}+${n(b*q)}=1; AL is a 2×2 projection, not I₂.`;
  const prompt=`A maps x to (${cf(p)}x,${cf(q)}x). L=[a,b] must recover x. Choose the minimum-norm L=Aᵀ/(AᵀA). Enter a,b.`;
  const sol=`${h1} L=[${n(p)},${n(q)}]/${n(N)}=[${n(a)},${n(b)}]. ${h2}`;
  return {
  prompt,answer:[a,b],hints:[h1,h2],solution:sol,
  guidance:[
   {prompt:`What is the first entry ${n(p)}/(${ss})?`,answer:[a],explanation:`The denominator is the squared column norm ${n(N)}.`},
   {prompt,answer:[a,b],explanation:sol}
  ]};}
}
});

/* x₀ split into eigen-components [part for λ=a, part for λ=d] of a triangular A; null if not all integers. */
function q25split({m,x0}){
 const [a,b,c,d]=m,[p,q]=x0;let wa,wd;
 if(c===0){const s=q*b/(d-a);wd=[s,q];wa=[p-s,0];}
 else{const s=p*c/(a-d);wa=[p,s];wd=[0,q-s];}
 return [wa,wd].every(w=>w.every(Number.isInteger))?[wa,wd]:null;
}
})();
