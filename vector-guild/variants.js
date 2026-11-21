/* Fresh-number variants of each mission's concept model.
   Each experiment model already computes its answer from an integer parameter t.
   This module adds (1) a problem statement that does not contain the answer,
   (2) tidy number formatting, and (3) a generator used by the concept bench,
   the review drill, and the retry check after a revealed solution. */
(function(){
'use strict';
const models=window.EXPERIMENTS=window.EXPERIMENTS||{};
const T=t=>Math.max(-10,Math.min(10,Math.round(Number(t)||0)));
/* Round float noise (10.100000000000001), then repair signs produced by
   interpolating negative numbers: "2+-4" → "2−4", "2−-4" → "2+4", "-4" → "−4". */
const clean=s=>String(s)
  .replace(/\d+\.\d{6,}/g,m=>String(Number(Number(m).toPrecision(6))))
  .replace(/\+\s*-(?=[\d.])/g,'−').replace(/−\s*-(?=[\d.])/g,'+').replace(/(?<![A-Za-z])-(?=[\d.])/g,'−');
/* Linear algebra's statements are built in. Other packs supply theirs through window.VARIANT_SETUP and
   window.VARIANT_POOL (registered by their variants-*.js files, which load before this file); a pack may
   also add to or override the built-in table that way. The built-in tables apply only to linear algebra. */
const builtIn=(window.REALM?.id||'la')==='la';
const LA_SETUP={
q01:t=>`Thrusters deliver impulses u=(${3+t},−1,2) and v=(−1,4,0) N·s.`,
q02:t=>`A cable displacement is r=(3,${4+t},0) m.`,
q03:t=>`Force F=(4,−2,1) N moves a panel by d=(3,${1+t},2) m.`,
q04:t=>`A force F=(0,${3+t},0) N acts at r=(2,0,0) m.`,
q05:t=>`Directions are u=(1,0) and v=(1,${t}).`,
q06:t=>`A has rows (1,2,−1) and (0,3,2). The raw input is x=(2,${1+t},4).`,
q07:t=>`Rotate v=(3,−2) counterclockwise by ${9*t}°.`,
q08:t=>`First apply B=[[2,0],[0,1]], then A=[[1,${t}],[0,1]], to v=(1,2).`,
q09:t=>`A=[[2,1],[${t},1]].`,
q10:t=>`A=[[2,1],[1,${1+t*t}]].`,
q11:t=>`Currents satisfy 2x+y=${7+t} and x−y=2.`,
q12:t=>`Solve x+2y−z=3, 2y+z=5 and 2z=${2+t}.`,
q13:t=>`A sensor matrix has rows (1,2,3), (2,4,6) and (0,${t},${t}).`,
q14:t=>`A has rows (1,2,3) and (0,1,1). Find the null vector whose z component is ${t}.`,
q15:t=>`Basis vectors are b₁=(1,1) and b₂=(1,−1). Write (${4+t},2)=c₁b₁+c₂b₂.`,
q16:t=>`Vectors obey x+y+z=0 and x−y=0. Take z=${t}.`,
q17:t=>`T(e₁)=(2,1) and T(e₂)=(−1,3). Evaluate T(3,${t}).`,
q18:t=>`Project v=(4,${t}) onto the line spanned by u=(1,1).`,
q19:t=>`a₁=(1,0,0) and a₂=(1,${t},1). Run Gram–Schmidt to get q₁ and q₂.`,
q20:t=>`Three readings are 2, 4 and ${9+t} V. Fit one constant with equal weights.`,
q21:t=>`Samples (time, y) are (0,1), (1,2) and (2,${2+t}). Fit the line y=a+b·time.`,
q22:t=>`A has columns a₁=(1,0,0) and a₂=(${t},2,0). Use the thin QR factorization with positive diagonal R.`,
q23:t=>`A=[[${3+t},1],[0,2]].`,
q24:t=>`A=[[3,${t}],[0,2]] has eigenvalue 2 with an eigenvector of the form (x,1).`,
q25:t=>`A=[[3,1],[0,2]] and x₀=(0,1). Apply A ${Math.abs(t)} time${Math.abs(t)===1?'':'s'}.`,
q26:t=>`S=[[2,${t/5}],[${t/5},2]] is symmetric. Consider the mode q=(1,1)/√2.`,
q27:t=>`A=[[3,0],[0,${t/2}],[0,0]].`,
q28:t=>`Centered data have covariance diag(4,${1+t*t}). Keep one principal component.`,
q29:t=>`Two identical bidirectional actuators must satisfy x₁+x₂=${6+t} while minimizing x₁²+x₂².`,
q30:t=>`A=diag(10,${.1*(1+t*t)}).`,
q31:t=>`K=[[4,1],[1,2]] N/m and x=(1,${t}) m. Elastic energy is ½xᵀKx.`,
q32:t=>`K=[[4,1],[1,${2+t}]].`,
q33:t=>`A=[[4,2],[2,${2+t*t}]]=LLᵀ with a positive diagonal in L.`,
q34:t=>`z=(1+${t}i, 2−i). The star conjugates and transposes.`,
q35:t=>`H=[[2,${t}i],[${-t}i,2]] is Hermitian and x=(1,i).`,
q36:t=>`A=[[2,1],[0,2]] and v=(0,${t}).`,
q37:t=>`A=diag(${t},2) and B=diag(3,1).`,
q38:t=>`Column-stochastic P=[[0.8,0.2],[0.2,0.8]] and p₀=(${.5+t/20},${.5-t/20}).`,
q39:t=>`A unit-weight path graph 1—2—3 carries node values x=(${t},1,0).`,
q40:t=>`H=diag(2,4), x=(${t},1) and f(x)=½xᵀHx.`,
q41:t=>`Minimize x²+y² subject to x+y=${t}.`,
q42:t=>`Fit one constant to readings 2 and 4 with positive weights 1 and ${t+11}.`,
q43:t=>`A=[[1,${t}],[2,3]].`,
q44:t=>`The system is x+y=${t} and 2x+2y=${2*t}. Take the free variable y=1.`,
q45:t=>`A=[[0,${t+11}],[2,5]]. Swap the two rows, then read the pivots of U.`,
q46:t=>`B=[[1,1],[0,1]], D=diag(2,${t}) and A=BDB⁻¹.`,
q47:t=>`A=[1,${t}] has a single row.`,
q48:t=>`The homogeneous transform [[1,0,${t}],[0,1,${-t}],[0,0,1]] acts on the point (1,2,1).`,
q49:t=>`A=diag(12,${t}). Keep its best rank-one approximation.`,
q50:t=>`Calibration A=[1;2] and redundant readings b=(${t},${2*t+1}). Solve by least squares.`,
q51:t=>`u=(1,0), v=(0,1) and w=(${t},3)=au+bv.`,
q52:t=>`x+2y=5 and 2x+4y=10 are dependent. Set the free variable y=${t}.`,
q53:t=>`A=[1;${t}] has one column. Its minimum-norm left inverse is L=Aᵀ/(AᵀA).`,
q54:t=>`Edges A→B and B→C carry signed flows ${t} and 3.`,
q55:t=>`x=(${t},0,${-t},0). Use the unnormalized four-point DFT.`,
q56:t=>`4x+y=9 and x+3y=7. The old iterate is (x₀,y₀)=(${t},0). Take one simultaneous Jacobi step.`,
q57:t=>`x′=diag(0,−1)x with x(0)=(3,4). Evaluate the solution at time ${t}.`,
q58:t=>`p(s)=2−3s+${t}s².`,
q59:t=>`The functional ℓ(x)=2x₁−x₂ acts on x=(${t},1).`,
q60:t=>`K=diag(8,18) and M=diag(2,${t+11}) in Kv=λMv. Use coordinate order.`,
q61:t=>`2x+y=${t} and x+3y=5. Eliminate x with a Schur complement.`,
q62:t=>`P swaps coordinates 1 and 3, and x=(${t},−1,3).`,
q63:t=>`A is 4×4 with diagonal 2 and adjacent diagonals −1. x=(${t},2,2,1).`,
q64:t=>`A=diag(1,2), b=(2,4) and ridge parameter λ=${t+11}.`,
q65:t=>`Samples (1,4,${t}) sit at positions (0,0.5,1).`,
q66:t=>`Maximize 3x+2y subject to x+y≤${t+11}, x≤2 and x,y≥0.`,
q67:t=>`x=(1,${t},3) and h=(1,−1), with zeros outside each signal. Form the full convolution.`,
q68:t=>`f(x)=½xᵀdiag(2,4)x−(2,4)·x, x₀=(${t},0) and step α=0.25. Take one gradient step.`
};
/* Parameter pools. The default keeps numbers small; listed pools avoid
   degenerate or unwieldy cases (zero vectors, 3¹⁰, awkward angles). */
const DEFAULT=[-6,-5,-4,-3,-2,-1,1,2,3,4,5,6];
const LA_POOL={q05:[-3,-2,-1,1,2,3],q07:[-10,-5,5],q25:[1,2,4,5],q57:[1,2,3],q02:[-8,-4,-3,-1,1,2,4],q19:[-3,-2,-1,1,2,3]};
const SETUP=Object.assign({},builtIn?LA_SETUP:{},window.VARIANT_SETUP||{}),POOL=Object.assign({},builtIn?LA_POOL:{},window.VARIANT_POOL||{});
for(const id of Object.keys(models)){
  const base=models[id];
  models[id]=t=>{const r=base(t),setup=SETUP[id]?clean(SETUP[id](T(t))):'';return {...r,prompt:clean(r.prompt),formula:clean(r.formula),setup};};
}
const last={};
function make(id,random=Math.random){
  const model=models[id];if(typeof model!=='function')return null;
  const pool=(POOL[id]||DEFAULT).filter(t=>t!==last[id]);
  const t=pool[Math.floor(random()*pool.length)%pool.length];last[id]=t;
  const r=model(t),target=Number(r.target),rule=accept(target,r);
  return {id,t,prompt:r.prompt,setup:r.setup,formula:r.formula,label:r.values[0][0],target,tolerance:rule.tolerance,exact:rule.exact,note:rule.note};
}
/* How close a typed answer must be to a model's target (docs/PACK-FORMAT.md section 5).
   Linear algebra keeps the 1.4.1 rule: within 2% of the target, at least 0.02.
   Other packs: a model's own `tolerance` (> 0) wins. Otherwise a whole-number target must be typed exactly,
   and so must a target with one to three decimal places (5.05 accepts 5.05, not 5.04 or 5.15), because
   a slip in whole-number or decimal arithmetic is rarely 2% away. Any other target (a repeating decimal,
   a root) keeps the 2% rule. The concept bench uses the same rule. */
const BAND=x=>Math.max(.02,Math.abs(x)*.02);
function accept(target,r){
  const own=r&&Number(r.tolerance);
  if(Number.isFinite(own)&&own>0)return {tolerance:own,exact:own<BAND(target),note:own<BAND(target)?'Type the exact value.':'Answers close to the exact value are accepted.'};
  if(!builtIn&&Number.isFinite(target)){
    if(Number.isInteger(target))return {tolerance:1e-9,exact:true,note:'Type the exact whole number.'};
    for(let d=1;d<=3;d++){const scaled=target*10**d;if(Math.abs(scaled-Math.round(scaled))<1e-7)return {tolerance:1e-6,exact:true,note:'Type the exact value.'}}
  }
  return {tolerance:BAND(target),exact:false,note:'Answers within 2% are accepted.'};
}
const tolerance=(target,r)=>accept(Number(target),r).tolerance;
const check=(variant,guess)=>Number.isFinite(guess)&&Math.abs(guess-variant.target)<=variant.tolerance;
const show=n=>Math.abs(n)<1e-10?'0':String(Number(Number(n).toPrecision(5)));
window.Variants={make,check,clean,show,tolerance,accept,has:id=>typeof models[id]==='function'&&!!SETUP[id]};
})();
