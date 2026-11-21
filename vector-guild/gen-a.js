/* Mission generators, part A: q01–q11, q43, q12–q17.
   Shape and helpers are described in gen-core.js and qa/generator-example.js.txt. */
(function(){
'use strict';
const G=window.Gen,{n,plus,par,vec}=G;
/* "(3,−1,2)" without spaces. */
const cv=v=>vec(v,',');
/* "[[2,0],[0,1]]" */
const mat=M=>'[['+M.map(r=>r.map(n).join(',')).join('],[')+']]';
/* Linear expression from [[coefficient, name], ...]: "x+2y−z". Zero terms are skipped, unit coefficients are implicit. */
const lin=terms=>{const t=terms.filter(([c])=>c!==0);if(!t.length)return '0';
 return t.map(([c,v],i)=>{const m=Math.abs(c)===1?'':n(Math.abs(c));return (i===0?(c<0?'−':''):(c<0?'−':'+'))+m+v;}).join('');};
/* "2+2−4" */
const sum=list=>list.map((x,i)=>i===0?n(x):plus(x)).join('');
/* "1·2+2·1−1·4": sign taken from the first factor, second factor parenthesised when negative. */
const dotText=(a,b)=>a.map((x,i)=>(i===0?n(x):plus(x))+'·'+par(b[i])).join('');
const rd=x=>{const r=Math.round(x*1e9)/1e9;return Object.is(r,-0)?0:r;};
const det2=M=>M[0][0]*M[1][1]-M[0][1]*M[1][0];
const mul2=(A,B)=>[[A[0][0]*B[0][0]+A[0][1]*B[1][0],A[0][0]*B[0][1]+A[0][1]*B[1][1]],[A[1][0]*B[0][0]+A[1][1]*B[1][0],A[1][0]*B[0][1]+A[1][1]*B[1][1]]];
const zeros=list=>list.filter(x=>x===0).length;

Object.assign(window.MISSION_GEN,{
q01:{
 canonical:{a:[3,-1,2],b:[-1,4,0]},
 draw:R=>({a:[R.nz(-6,6),R.nz(-6,6),R.int(-6,6)],b:[R.nz(-6,6),R.nz(-6,6),R.int(-6,6)]}),
 build:({a,b})=>{const s=a.map((x,i)=>x+b[i]);return {
  prompt:`Thrusters deliver impulses ${vec(a)} and ${vec(b)} N·s. Enter the resultant x, y, z.`,
  answer:s,
  hints:['Add the x components first.',`The z components are ${n(a[2])} and ${n(b[2])}.`],
  solution:`(${n(a[0])}${plus(b[0])}, ${n(a[1])}${plus(b[1])}, ${n(a[2])}${plus(b[2])}) = ${vec(s,',')} N·s.`,
  guidance:[
   {prompt:`What is the resultant x impulse: ${n(a[0])}+${par(b[0])}?`,answer:[s[0]],explanation:`Both x impulses act on the same axis, so their signed sum is ${n(s[0])} N·s.`},
   {prompt:`What are the resultant y and z impulses: ${n(a[1])}${plus(b[1])} and ${n(a[2])}${plus(b[2])}?`,answer:[s[1],s[2]],explanation:`The remaining components are ${n(s[1])} and ${n(s[2])} N·s; retain x,y,z order.`}
  ]};}
},

/* A 3–4–5 displacement, scaled, signed and placed on any two axes, so the length and unit components stay short decimals. */
q02:{
 canonical:{v:[3,4,0]},
 draw:R=>{const k=R.pick([1,1,2,2,3,4,.5,1.5]),legs=R.bool()?[3,4]:[4,3],zero=R.int(0,2),v=[];let j=0;
  for(let i=0;i<3;i++)v.push(i===zero?0:legs[j++]*k*(R.bool()?1:-1));
  return {v};},
 build:({v})=>{const sq=v.map(x=>rd(x*x)),S=rd(sq[0]+sq[1]+sq[2]),L=rd(Math.sqrt(S)),u=v.map(x=>rd(x/L));
  const legs=v.map(Math.abs).filter(x=>x!==0).sort((a,b)=>a-b),tri=[...legs,L].map(n).join('–');
  const k=legs.length===2?rd(legs[0]/3):1;
  return {
  prompt:`A cable displacement is ${cv(v)} m. Enter its length and the x, y components of its unit direction.`,
  answer:[L,u[0],u[1]],
  hints:[tri==='3–4–5'?'Use the 3–4–5 triangle.':`Use the ${tri} triangle, a 3–4–5 triangle scaled by ${n(k)}.`,`Divide each displacement component by ${n(L)}.`],
  solution:`Length √(${sq.filter(x=>x!==0).map(n).join('+')})=${n(L)} m; direction ${cv(u)}.`,
  guidance:[
   {prompt:`For ${cv(v)}, what is the sum of squared coordinates?`,answer:[S],explanation:`${v.map(x=>par(x)+'²').join('+')}=${sq.filter(x=>x!==0).map(n).join('+')}=${n(S)} m².`},
   {prompt:'Take the square root, then divide the x component by it. Enter length and unit x.',answer:[L,u[0]],explanation:`√${n(S)}=${n(L)} m and ${n(v[0])}/${n(L)}=${n(u[0])}. The remaining unit y is ${n(v[1])}/${n(L)}.`}
  ]};}
},

q03:{
 canonical:{F:[4,-2,1],d:[3,1,2]},
 draw:R=>({F:[R.nz(-6,6),R.nz(-6,6),R.nz(-6,6)],d:[R.nz(-5,5),R.nz(-5,5),R.nz(-5,5)]}),
 build:({F,d})=>{const p=F.map((x,i)=>x*d[i]),W=p[0]+p[1]+p[2],yz=p[1]+p[2];return {
  prompt:`Force F=${cv(F)} N moves a panel by d=${cv(d)} m. Enter the work in joules.`,
  answer:[W],
  hints:['Multiply matching coordinates.',`Sum ${n(p[0])}, ${n(p[1])}, and ${n(p[2])}.`],
  solution:`F·d=${dotText(F,d)}=${n(W)} J.`,
  guidance:[
   {prompt:`Enter the three coordinate products ${par(F[0])}·${par(d[0])}, ${par(F[1])}·${par(d[1])}, and ${par(F[2])}·${par(d[2])}.`,answer:p,explanation:'Each product pairs a force coordinate with the displacement coordinate on that same axis.'},
   {prompt:`Add the y and z contributions, ${n(p[1])}${plus(p[2])}.`,answer:[yz],explanation:yz===0?'They cancel, leaving only the x contribution in the total work.':`Their sum is ${n(yz)}; adding the x contribution ${n(p[0])} gives the total work ${n(W)} J.`}
  ]};}
},

/* Both vectors stay in the xy plane (as authored), so the torque points along z. */
q04:{
 canonical:{r:[2,0,0],F:[0,3,0]},
 draw:R=>{for(;;){const a=R.int(-5,5),b=R.int(-5,5),c=R.int(-5,5),d=R.int(-5,5);
  if(zeros([a,b,c,d])>1||a*d-b*c===0)continue;
  return {r:[a,b,0],F:[c,d,0]};}},
 build:({r,F})=>{const t=[r[1]*F[2]-r[2]*F[1],r[2]*F[0]-r[0]*F[2],r[0]*F[1]-r[1]*F[0]],p=r[0]*F[1],q=r[1]*F[0];return {
  prompt:`A force F=${cv(F)} N acts at r=${cv(r)} m. Enter τ_x, τ_y, τ_z in N·m.`,
  answer:t,
  hints:['Both vectors lie in the xy plane.',`The z component is ${n(r[0])}·${par(F[1])}−${par(r[1])}·${par(F[0])}.`],
  solution:`r×F=${cv(t)} N·m; reversing the cross product would reverse the sign.`,
  guidance:[
   {prompt:`For r=${cv(r)}, F=${cv(F)}, compute τx and τy.`,answer:[t[0],t[1]],explanation:'Both products in each of these components contain a zero factor.'},
   {prompt:'Compute rₓFᵧ and rᵧFₓ separately.',answer:[p,q],explanation:`The z torque is their difference: ${n(p)}−${par(q)}.`}
  ]};}
},

/* Components are [coefficient, radicand] pairs meaning coefficient·√radicand, e.g. [1,3] is √3 and [2,1] is 2.
   Draws keep the dot product and both lengths whole, so cos θ is 0.5, 0 or −0.5. */
q05:{
 canonical:{u:[[1,1],[0,1]],v:[[1,1],[1,3]]},
 draw:R=>{const s=()=>R.bool()?1:-1;
  const w=(m)=>R.bool()?[[m*s(),1],[m*s(),3]]:[[m*s(),3],[m*s(),1]];
  const val=([c,r])=>c*Math.sqrt(r);
  for(;;){let u,v;
   if(R.bool()){const a=R.nz(-4,4),m=R.int(1,3);
    if(R.bool()){u=[[a,1],[0,1]];v=[[m*s(),1],[m*s(),3]];}else{u=[[0,1],[a,1]];v=[[m*s(),3],[m*s(),1]];}
   }else{u=w(R.int(1,3));v=w(R.int(1,3));}
   const dot=val(u[0])*val(v[0])+val(u[1])*val(v[1]),L=Math.hypot(val(u[0]),val(u[1]))*Math.hypot(val(v[0]),val(v[1])),c=dot/L;
   if([.5,0,-.5].some(t=>Math.abs(c-t)<1e-9))return {u,v};}},
 build:({u,v})=>{const val=([c,r])=>c*Math.sqrt(r),sq=([c,r])=>c*c*r;
  const f=([c,r])=>r===1||c===0?n(c):(c===1?'':c===-1?'−':n(c))+'√'+r,fv=w=>'('+w.map(f).join(',')+')';
  const dot=rd(val(u[0])*val(v[0])+val(u[1])*val(v[1])),Lu=rd(Math.sqrt(sq(u[0])+sq(u[1]))),Lv=rd(Math.sqrt(sq(v[0])+sq(v[1])));
  const LL=rd(Lu*Lv),cos=rd(dot/LL),ang=rd(Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI);return {
  prompt:`Directions u=${fv(u)} and v=${fv(v)} define an angle. Enter cos θ and θ in degrees.`,
  answer:[cos,ang],
  hints:[`The two lengths are ${n(Lu)} and ${n(Lv)}.`,`Their dot product is ${n(dot)}.`],
  solution:`cos θ=${n(dot)}/(${n(Lu)}·${n(Lv)})=${n(cos)}, hence θ=${n(ang)}°.`,
  guidance:[
   {prompt:`For u=${fv(u)}, v=${fv(v)}, enter their dot product and the length of v.`,answer:[dot,Lv],explanation:`u·v=${n(dot)} and ‖v‖=√(${n(sq(v[0]))}+${n(sq(v[1]))})=${n(Lv)}.`},
   {prompt:`The length product is ${n(LL)}. What is ${n(dot)}/${n(LL)}?`,answer:[cos],explanation:'The angle is the inverse cosine of this ratio, expressed in degrees.'}
  ]};}
},

/* The second row keeps its zero first coefficient; every other coefficient and input is nonzero. */
q06:{
 canonical:{A:[[1,2,-1],[0,3,2]],x:[2,1,4]},
 draw:R=>({A:[[R.nz(-4,4),R.nz(-4,4),R.nz(-4,4)],[0,R.nz(-4,4),R.nz(-4,4)]],x:[R.nz(-5,5),R.nz(-5,5),R.nz(-5,5)]}),
 build:({A,x})=>{const t=A.map(r=>r.map((a,i)=>a*x[i])),y=t.map(r=>r[0]+r[1]+r[2]);return {
  prompt:`A has rows ${cv(A[0])}, ${cv(A[1])}. Raw x=${cv(x)}. Enter the two outputs Ax.`,
  answer:y,
  hints:['Compute one dot product per row.',`The first row gives ${sum(t[0])}.`],
  solution:`Ax=(${sum(t[0])}, ${sum(t[1])})=${cv(y)}.`,
  guidance:[
   {prompt:`Compute the first output: ${dotText(A[0],x)}.`,answer:[y[0]],explanation:`The three contributions are ${t[0].map(n).join(',')}, summing to ${n(y[0])}.`},
   {prompt:`Compute the two nonzero contributions to the second output: ${par(A[1][1])}·${par(x[1])} and ${par(A[1][2])}·${par(x[2])}.`,answer:[t[1][1],t[1][2]],explanation:'Add these to the zero first term to obtain the second output.'}
  ]};}
},

q07:{
 canonical:{v:[3,-2]},
 draw:R=>({v:[R.nz(-9,9),R.nz(-9,9)]}),
 build:({v})=>{const [x,y]=v,w=[-y,x];return {
  prompt:`Rotate the position ${cv(v)} counterclockwise by 90°. Enter the new x and y.`,
  answer:w,
  hints:['At 90°, cos θ=0 and sin θ=1.','The rule is (x,y)↦(−y,x).'],
  solution:y<0?`R${cv(v)}=(−${par(y)},${n(x)})=${cv(w)}.`:`R${cv(v)}=${cv(w)}.`, /* the middle form only adds something when y is negative */
  guidance:[
   {prompt:'For a 90° counterclockwise rotation, enter cos θ and sin θ.',answer:[0,1],explanation:'The matrix becomes [[0,−1],[1,0]].'},
   {prompt:`For ${cv(v)}, compute −y.`,answer:[-y],explanation:`Negating ${n(y)} gives ${plus(-y)}; the new y is the old x.`}
  ]};}
},

/* Either a diagonal stretch followed by a shear (as authored) or two small general matrices. */
q08:{
 canonical:{A:[[1,1],[0,1]],B:[[2,0],[0,1]]},
 draw:R=>{if(R.int(1,5)<=2){const k=R.nz(-4,4);let p=R.int(1,5),q=R.int(1,5);if(p===1&&q===1)p=2;
   return {A:R.bool()?[[1,k],[0,1]]:[[1,0],[k,1]],B:[[p,0],[0,q]]};}
  for(;;){const e=()=>R.int(-2,3),A=[[e(),e()],[e(),e()]],B=[[e(),e()],[e(),e()]];
   if(zeros(A.flat())>1||zeros(B.flat())>1||det2(A)===0||det2(B)===0||String(A)===String(B))continue; /* A=B would turn the mission into A² */
   return {A,B};}},
 build:({A,B})=>{const P=mul2(A,B),Q=mul2(B,A),c1=[B[0][0],B[1][0]],c2=[B[0][1],B[1][1]],p1=[P[0][0],P[1][0]],p2=[P[0][1],P[1][1]];
  const shear=A[0][0]===1&&A[1][1]===1&&(A[0][1]===0)!==(A[1][0]===0),stretch=B[0][1]===0&&B[1][0]===0&&B[0][0]>0&&B[1][1]>0&&!(B[0][0]===1&&B[1][1]===1);
  const same=P.flat().every((x,i)=>x===Q.flat()[i]);
  const remark=shear&&stretch?'The shear uses the already stretched coordinates.':same?'Here BA happens to equal AB, although matrix products generally depend on order.':`Reversing the order would give BA=${mat(Q)}, a different matrix.`;
  return {
  prompt:`First apply B=${mat(B)}, then A=${mat(A)}. Enter AB in row-major order.`,
  answer:P.flat(),
  hints:['Multiply each row of A by each column of B.',`The first column becomes ${cv(p1)}.`],
  solution:`AB=${mat(P)}. ${remark}`,
  guidance:[
   {prompt:`Compute the first column of AB by applying A to B’s first column ${cv(c1)}.`,answer:p1,explanation:`A${cv(c1)}=${cv(p1)}. This is the first column of the product.`},
   {prompt:`Compute the second column by applying A to ${cv(c2)}.`,answer:p2,explanation:`A${cv(c2)}=${cv(p2)}. Interleave the two columns correctly when entering row-major values.`}
  ]};}
},

q09:{
 canonical:{A:[[2,1],[3,1]]},
 draw:R=>{for(;;){const A=[[R.nz(-5,5),R.nz(-5,5)],[R.nz(-5,5),R.nz(-5,5)]];if(det2(A)!==0)return {A};}},
 build:({A})=>{const [[a,b],[c,d]]=A,ad=a*d,bc=b*c,D=ad-bc,k=Math.abs(D);return {
  prompt:`A=${mat(A)}. Enter det A and its absolute area scale.`,
  answer:[D,k],
  hints:[`Compute ${n(a)}·${par(d)}−${par(b)}·${par(c)}.`,'Area scale cannot be negative.'],
  solution:`det A=${n(ad)}−${par(bc)}=${n(D)}, so areas are ${k===1?'preserved':k===0?'collapsed to zero':'scaled by '+n(k)}${D<0?' while orientation reverses':D>0?(k===1?' and so is orientation':' while orientation is preserved'):''}.`,
  guidance:[
   {prompt:`For A=${mat(A)}, enter the diagonal products ad and bc.`,answer:[ad,bc],explanation:`The products are ${n(a)}·${par(d)}=${n(ad)} and ${n(b)}·${par(c)}=${n(bc)}.`},
   {prompt:'Subtract these products: ad−bc.',answer:[D],explanation:D<0?'A negative determinant means the map reverses orientation. Its magnitude gives the area scale.':D>0?'A positive determinant means the map preserves orientation. Its magnitude gives the area scale.':'A zero determinant means the map collapses areas to zero.'}
  ]};}
},

/* Determinant ±1 or ±2, so the inverse has whole or half entries. */
q10:{
 canonical:{A:[[2,1],[1,1]]},
 draw:R=>{for(;;){const A=[[R.nz(-5,5),R.nz(-5,5)],[R.nz(-5,5),R.nz(-5,5)]],D=det2(A);
  if(Math.abs(D)===1||(Math.abs(D)===2&&R.bool()))return {A};}},
 build:({A})=>{const [[a,b],[c,d]]=A,D=a*d-b*c,adj=[[d,-b],[-c,a]],inv=adj.map(r=>r.map(x=>rd(x/D)));return {
  prompt:`A=${mat(A)}. Enter A inverse in row-major order.`,
  answer:inv.flat(),
  hints:[`The determinant is ${n(D)}.`,`The adjugate is ${mat(adj)}.`],
  solution:`A⁻¹=${mat(inv)}; multiplying by A gives the identity.`,
  guidance:[
   {prompt:`Compute the determinant of ${mat(A)}.`,answer:[D],explanation:`${n(a)}·${par(d)}−${par(b)}·${par(c)}=${n(D)}, so inversion is valid.`},
   {prompt:'Enter the first row of its adjugate.',answer:adj[0],explanation:`The first row is (d,−b)=${cv(adj[0])}. ${D===1?'Division by determinant 1 leaves it unchanged.':`Dividing by determinant ${n(D)} gives the first row of the inverse, ${cv(inv[0])}.`}`}
  ]};}
},

/* a·x + b·y = r1 and c·x − b·y = r2, so adding the equations always eliminates y. */
q11:{
 canonical:{a:2,b:1,c:1,x:3,y:1},
 draw:R=>{for(;;){const a=R.nz(-4,5),c=R.nz(-4,5),b=R.pick([1,1,1,2,3]),x=R.nz(-5,6),y=R.nz(-5,6);
  if(Math.abs(a+c)<2)continue;return {a,b,c,x,y};}},
 build:({a,b,c,x,y})=>{const r1=a*x+b*y,r2=c*x-b*y,e1=`${lin([[a,'x'],[b,'y']])}=${n(r1)}`,e2=`${lin([[c,'x'],[-b,'y']])}=${n(r2)}`,by=lin([[b,'y']]),sx=`${lin([[a+c,'x']])}=${n(r1+r2)}`;return {
  prompt:`Currents satisfy ${e1} and ${e2}. Enter x and y in amperes.`,
  answer:[x,y],
  hints:['Add the two equations to eliminate y.',`${sx}.`],
  solution:`Adding yields x=${n(x)}; then ${n(c*x)}−${by}=${n(r2)} gives y=${n(y)} A.`,
  guidance:[
   {prompt:`Add ${e1} and ${e2}. Enter the coefficient of x and the right-hand side.`,answer:[a+c,r1+r2],explanation:`The y terms cancel; the resulting equation is ${sx}.`},
   {prompt:`Use x=${n(x)} in ${e2}. What is y?`,answer:[y],explanation:`${n(c*x)}−${by}=${n(r2)} implies −${by}=${n(r2-c*x)}, so y=${n(y)}.`}
  ]};}
},

q43:{
 canonical:{k:2,A:[[1,2],[3,4]],B:[[2,0],[-1,1]]},
 draw:R=>{for(;;){const k=R.pick([2,2,3,-2]),e=()=>R.int(-4,5),A=[[e(),e()],[e(),e()]],B=[[e(),e()],[e(),e()]];
  if(zeros(A.flat())>1||zeros(B.flat())>1||k*A[0][1]+B[0][1]===k*A[1][0]+B[1][0])continue;
  return {k,A,B};}},
 build:({k,A,B})=>{const kA=A.map(r=>r.map(x=>k*x)),S=kA.map((r,i)=>r.map((x,j)=>x+B[i][j])),T=[[S[0][0],S[1][0]],[S[0][1],S[1][1]]],K=n(k);return {
  prompt:`A=${mat(A)}, B=${mat(B)}. Enter (${K}A+B)ᵀ in row-major order.`,
  answer:T.flat(),
  hints:[`First compute ${K}A+B=${mat(S)}.`,'Exchange its off-diagonal entries when transposing.'],
  solution:`${K}A=${mat(kA)}, so ${K}A+B=${mat(S)}. Transposing gives ${mat(T)}.`,
  guidance:[
   {prompt:`Compute the first row of ${K}A+B.`,answer:S[0],explanation:`${K}${cv(A[0])}+${cv(B[0])}=${cv(S[0])}.`},
   {prompt:`Compute the second row of ${K}A+B.`,answer:S[1],explanation:`${K}${cv(A[1])}+${cv(B[1])}=${cv(S[1])}. Now use these rows as columns of the transpose.`}
  ]};}
},

/* Upper triangular system a·(x,y,z)=r1, b·(y,z)=r2, c·z=r3, built from the solution s. */
q12:{
 canonical:{a:[1,2,-1],b:[2,1],c:2,s:[0,2,1]},
 draw:R=>({a:[R.pick([1,1,1,2,3]),R.nz(-4,4),R.nz(-4,4)],b:[R.pick([2,3,4,-2,-3]),R.nz(-3,3)],c:R.pick([2,3,4,5,-2,-3]),s:[R.int(-5,5),R.nz(-4,4),R.nz(-4,4)]}),
 build:({a,b,c,s})=>{const [x,y,z]=s,r1=a[0]*x+a[1]*y+a[2]*z,r2=b[0]*y+b[1]*z,r3=c*z;
  const e1=`${lin([[a[0],'x'],[a[1],'y'],[a[2],'z']])}=${n(r1)}`,e2=`${lin([[b[0],'y'],[b[1],'z']])}=${n(r2)}`,e3=`${lin([[c,'z']])}=${n(r3)}`;
  const top=`${n(r1)}${plus(-a[1]*y)}${plus(-a[2]*z)}`;return {
  prompt:`Solve ${e1}, ${e2}, and ${e3}. Enter x,y,z.`,
  answer:[x,y,z],
  hints:[`Start with ${e3}.`,`Then ${lin([[b[0],'y']])}${plus(b[1]*z)}=${n(r2)}.`],
  solution:`z=${n(z)}, y=${n(y)}, and x=${a[0]===1?top:`(${top})/${par(a[0])}`}=${n(x)}.`,
  guidance:[
   {prompt:`From ${e3}, find z.`,answer:[z],explanation:`Divide both sides by ${n(c)}.`},
   {prompt:`Insert z=${n(z)} into ${e2} and solve for y.`,answer:[y],explanation:`${lin([[b[0],'y']])}=${n(r2-b[1]*z)}, so y=${n(y)}. Now use the first equation to finish.`}
  ]};}
},

/* Row 2 is k times row 1. Row 3 is either independent of row 1 (rank 2) or another multiple of it (rank 1). */
q13:{
 canonical:{r1:[1,2,3],k:2,r3:[0,1,1]},
 draw:R=>{for(;;){const r1=[R.int(-3,4),R.int(-3,4),R.int(-3,4)],k=R.pick([2,2,3,-2,-1,-3]);
  if(zeros(r1)>1)continue;
  if(R.int(1,3)===1){const m=R.pick([2,3,-1,-2,-3].filter(t=>t!==k));return {r1,k,r3:r1.map(x=>m*x)};}
  const r3=[R.int(-3,4),R.int(-3,4),R.int(-3,4)];
  if(zeros(r3)>1||(r1[1]*r3[2]-r1[2]*r3[1]===0&&r1[2]*r3[0]-r1[0]*r3[2]===0&&r1[0]*r3[1]-r1[1]*r3[0]===0))continue;
  return {r1,k,r3};}},
 build:({r1,k,r3})=>{const r2=r1.map(x=>k*x),par3=r1[1]*r3[2]-r1[2]*r3[1]===0&&r1[2]*r3[0]-r1[0]*r3[2]===0&&r1[0]*r3[1]-r1[1]*r3[0]===0,rank=par3?1:2,nul=3-rank;return {
  prompt:`A has rows ${cv(r1)}, ${cv(r2)}, ${cv(r3)}. Enter rank(A) and nullity(A).`,
  answer:[rank,nul],
  hints:[`Row 2 is ${k===2?'twice':n(k)+' times'} row 1.`,'The independent row count plus nullity equals three columns.'],
  solution:`${par3?'Rows 2 and 3 are both multiples of row 1':'Rows 1 and 3 are independent'}, giving rank ${rank}; rank-nullity gives nullity 3−${rank}=${nul}.`,
  guidance:[
   {prompt:'Row 2 is what scalar multiple of row 1?',answer:[k],explanation:`${cv(r2)}=${n(k)}${cv(r1)}, so row 2 adds no independent information.`},
   {prompt:`${par3?`Row ${cv(r3)} is also a multiple of ${cv(r1)}, so only one row is independent`:`Rows ${cv(r1)} and ${cv(r3)} are independent`}. If rank is ${rank} and there are 3 columns, find nullity.`,answer:[nul],explanation:`Rank-nullity gives 3−${rank}=${nul} invisible input direction${nul===1?'':'s'}.`}
  ]};}
},

/* Rows (a1,a2,a3) and (0,b2,b3); the third component z is prescribed and the other two come out whole. */
q14:{
 canonical:{A:[[1,2,3],[0,1,1]],z:1},
 draw:R=>{for(;;){const A=[[R.pick([1,1,1,2,-1,3]),R.nz(-4,4),R.nz(-4,4)],[0,R.nz(-3,3),R.nz(-4,4)]],z=R.pick([1,1,2,3,-1,-2]);
  const y=-A[1][2]*z/A[1][1],x=-(A[0][1]*y+A[0][2]*z)/A[0][0];
  if(!Number.isInteger(y)||!Number.isInteger(x)||Math.abs(x)>12||Math.abs(y)>12)continue;
  return {A,z};}},
 build:({A,z})=>{const [a,b]=A,y=rd(-b[2]*z/b[1]),known=rd(a[1]*y+a[2]*z),x=rd(-known/a[0]),ax=lin([[a[0],'x']]);return {
  prompt:`A has rows ${cv(a)}, ${cv(b)}. Find a null vector with third component ${n(z)}. Enter all three components.`,
  answer:[x,y,z],
  hints:[`The second equation gives y=${n(y)}.`,`Substitute into ${lin([[a[0],'x'],[a[1],'y']])}${plus(a[2]*z)}=0.`],
  solution:`z=${n(z)} implies y=${n(y)} and x=${n(x)}. A${cv([x,y,z])}=0.`,
  guidance:[
   {prompt:`With z=${n(z)}, solve ${lin([[b[1],'y'],[b[2],'z']])}=0.`,answer:[y],explanation:`The second row equation forces y=${n(y)}.`},
   {prompt:`With y=${n(y)} and z=${n(z)}, what is ${lin([[a[1],'y'],[a[2],'z']])}?`,answer:[known],explanation:`${n(a[1])}(${n(y)})${plus(a[2])}(${n(z)})=${n(known)}; ${ax} must cancel that value for zero output.`}
  ]};}
},

/* b2 is (m,−m), so adding the two coordinate equations always eliminates c₂. The target t is built from whole coefficients. */
q15:{
 canonical:{b1:[1,1],b2:[1,-1],t:[4,2]},
 draw:R=>{for(;;){const p=R.nz(-3,4),q=R.nz(-3,4),m=R.pick([1,1,1,2,3]),c1=R.nz(-5,5),c2=R.nz(-5,5);
  if(Math.abs(p+q)<2)continue;
  return {b1:[p,q],b2:[m,-m],t:[p*c1+m*c2,q*c1-m*c2]};}},
 build:({b1,b2,t})=>{const [p,q]=b1,m=b2[0],w=p+q,rhs=t[0]+t[1],c1=rd(rhs/w),c2=rd((t[0]-p*c1)/m);
  const e1=`${lin([[p,'c₁'],[m,'c₂']])}=${n(t[0])}`,e2=`${lin([[q,'c₁'],[-m,'c₂']])}=${n(t[1])}`,wc=lin([[w,'c₁']]),pc=lin([[-p,'c₁']]).replace(/^(?!−)/,'+');
  const back=m===1?`${n(t[0])}${pc}`:`(${n(t[0])}${pc})/${par(m)}`;
  const k1=c1===1?'':c1===-1?'−':n(c1),k2=c2===1?'+':c2===-1?'−':plus(c2);return {
  prompt:`Basis vectors b₁=${cv(b1)}, b₂=${cv(b2)}. Find c₁,c₂ so ${cv(t)}=c₁b₁+c₂b₂.`,
  answer:[c1,c2],
  hints:[`Use ${e1} and ${e2}.`,'Add the equations.'],
  solution:`${wc}=${n(rhs)}, hence c₁=${n(c1)} and c₂=${n(c2)}.`,
  guidance:[
   {prompt:`For target ${cv(t)}, add ${e1} and ${e2}. Enter the right-hand side of ${wc}.`,answer:[rhs],explanation:`The second coefficient cancels, leaving ${wc}=${n(rhs)}.`},
   {prompt:`Solve ${wc}=${n(rhs)}, then c₂=${back}.`,answer:[c1,c2],explanation:`The coefficients are ${n(c1)} and ${n(c2)}; reconstruct ${k1}${cv(b1)}${k2}${cv(b2)}=${cv(t)}.`}
  ]};}
},

/* First constraint a·x+b·y+c·z=0 varies; the second stays x−y=0, and z is prescribed so that x=y is whole. */
q16:{
 canonical:{a:[1,1,1],z:2},
 draw:R=>{for(;;){const a=[R.nz(-3,4),R.nz(-3,4),R.nz(-3,3)],z=R.nz(-6,6),w=a[0]+a[1];
  if(w===0||!Number.isInteger(a[2]*z/w))continue;
  return {a,z};}},
 build:({a,z})=>{const w=a[0]+a[1],x=rd(-a[2]*z/w),c1=lin([[a[0],'x'],[a[1],'y'],[a[2],'z']]),sub=`${lin([[w,'x']])}${plus(a[2]*z)}=0`;return {
  prompt:`Allowed v=(x,y,z) obey ${c1}=0 and x−y=0. Enter the allowed vector with z=${n(z)} as x,y,z. Then enter the dimension of the whole intersection, counted before z is fixed.`,
  answer:[x,x,z,1],
  hints:['The second equation sets x=y.',`Then ${sub}.`],
  solution:`x=y=${n(x)}. Two independent constraints in R³ leave a one-dimensional line.`,
  guidance:[
   {prompt:`Use x−y=0 to substitute y=x into ${c1}=0. Enter the resulting coefficient on x and the number of free coordinates after the two independent constraints.`,answer:[w,1],explanation:`Replacing y with x gives ${lin([[a[0],'x'],[a[1],'x'],[a[2],'z']])}=${lin([[w,'x'],[a[2],'z']])}=0, so the x coefficient is ${n(w)}. Two independent constraints in three coordinates leave one free coordinate; fixing z then selects a particular point on that line.`},
   {prompt:`Set z=${n(z)} and x=y. Solve ${sub}; enter x and y.`,answer:[x,x],explanation:`Both coordinates are ${n(x)}. The full intersection still has one free parameter before z is fixed.`}
  ]};}
},

q17:{
 canonical:{e1:[2,1],e2:[-1,3],v:[3,2]},
 draw:R=>{const c=()=>R.pick([2,3,4,5,-2,-3,2,3,4]);for(;;){const e1=[R.int(-4,5),R.int(-4,5)],e2=[R.int(-4,5),R.int(-4,5)];
  if(zeros([...e1,...e2])>1||e1[0]*e2[1]-e1[1]*e2[0]===0)continue;
  return {e1,e2,v:[c(),c()]};}},
 build:({e1,e2,v})=>{const s1=e1.map(x=>v[0]*x),s2=e2.map(x=>v[1]*x),out=[s1[0]+s2[0],s1[1]+s2[1]];return {
  prompt:`T(e₁)=${cv(e1)}, T(e₂)=${cv(e2)}. Enter T${cv(v)}.`,
  answer:out,
  hints:[`Use ${n(v[0])}T(e₁)${plus(v[1])}T(e₂).`,`Combine ${cv(s1)} and ${cv(s2)}.`],
  solution:`T${cv(v)}=${n(v[0])}${cv(e1)}${plus(v[1])}${cv(e2)}=${cv(out)}.`,
  guidance:[
   {prompt:`Compute ${n(v[0])}T(e₁) when T(e₁)=${cv(e1)}.`,answer:s1,explanation:`Scale both coordinates by the input coefficient ${n(v[0])}.`},
   {prompt:`Compute ${n(v[1])}T(e₂) when T(e₂)=${cv(e2)}.`,answer:s2,explanation:`Scale both coordinates by ${n(v[1])}, then add this vector to the first scaled image.`}
  ]};}
}
});
})();
