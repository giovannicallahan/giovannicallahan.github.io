/* Contract board. Each contract needs three missions from different branches of the
   skill tree and ends with one commissioning problem that combines them.
   This module only renders and checks; app.js owns the save and the reward. */
window.Board=(()=>{
'use strict';
const REWARD=3;
const defs=[
{id:'c1',name:'Survey calibration',needs:['q13','q18','q20'],
 brief:'The survey team wants one trusted reading from three redundant sensors.',
 prompt:'Three redundant sensors read b=(3,5,10). Fit one constant c by projecting b onto a=(1,1,1). Enter c, the dot product of the residual b−c·a with a, and the rank of the one-column matrix [a].',
 labels:['fitted c','residual · a','rank of [a]'],answer:[6,0,1],
 explain:'c=(a·b)/(a·a)=18/3=6. The residual (−3,−1,4) is orthogonal to a, so its dot product with a is 0. One nonzero column has rank 1.'},
{id:'c2',name:'Vibration audit',needs:['q24','q26','q32'],
 brief:'The dynamics crew must certify a coupled mount before crews work outside.',
 prompt:'A symmetric stiffness matrix is K=[[3,1],[1,3]]. Enter its eigenvalues in ascending order, then 1 if K is positive definite or 0 otherwise, then xᵀKx for the mode x=(1,−1).',
 labels:['smaller eigenvalue','larger eigenvalue','positive definite (1 or 0)','xᵀKx'],answer:[2,4,1,4],
 explain:'The modes (1,−1) and (1,1) have eigenvalues 3−1=2 and 3+1=4. Both are positive, so K is positive definite. For x=(1,−1), xᵀKx=λ‖x‖²=2·2=4.'},
{id:'c3',name:'Relay network',needs:['q29','q38','q39'],
 brief:'Scattered teams need a relay plan that balances traffic and effort.',
 prompt:'Relay traffic follows the column-stochastic matrix P=[[0.9,0.4],[0.1,0.6]]. A load of 8 units is split across two identical relays with minimum Euclidean norm. The relay graph is a three-node path with Laplacian L. Enter the stationary probability of state 1, the load on each relay, and the first entry of L·(5,5,5).',
 labels:['stationary p₁','load per relay','first entry of L·(5,5,5)'],answer:[0.8,4,0],
 explain:'0.1p₁=0.4p₂ with p₁+p₂=1 gives p₁=0.8. Identical relays share the load equally, 4 each. A Laplacian sends every constant vector to zero.'}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ready=(def,solved)=>def.needs.every(id=>solved.has(id));
function check(id,values){
  const def=defs.find(d=>d.id===id);
  if(!def||!Array.isArray(values)||values.length!==def.answer.length||!values.every(Number.isFinite))return {valid:false,ok:false,checks:[]};
  const checks=def.answer.map((a,i)=>Math.abs(values[i]-a)<=.01);
  return {valid:true,ok:checks.every(Boolean),checks};
}
/* First unsolved mission on the way to target: an unmet prerequisite if there is one. */
function route(target,byId,solved,seen=new Set()){
  if(solved.has(target)||seen.has(target))return null;seen.add(target);
  for(const p of byId.get(target)?.prereqs||[]){const step=route(p,byId,solved,seen);if(step)return step}
  return target;
}
function html(quests,solvedIds,doneIds){
  const solved=new Set(solvedIds),done=new Set(doneIds),byId=new Map(quests.map(q=>[q.id,q]));
  return `<section class="vg-board" aria-label="Contract board"><div class="eyebrow">CONTRACT BOARD / CHOOSE YOUR BRANCH</div><h2>Engineering contracts</h2><p>Each contract needs three missions from different branches of the skill tree, then one commissioning problem that uses all three together. A commissioned contract pays ${REWARD} skill points. There is no timer.</p><div class="board-grid">${defs.map(def=>{
    const complete=done.has(def.id),open=ready(def,solved),count=def.needs.filter(id=>solved.has(id)).length;
    return `<article class="board-card ${complete?'is-done':open?'is-open':''}"><span class="badge">${complete?'✓ COMMISSIONED · +'+REWARD+' SP':open?'READY TO COMMISSION':count+' / '+def.needs.length+' MISSIONS'}</span><h3>${esc(def.name)}</h3><p>${esc(def.brief)}</p><ul class="board-needs">${def.needs.map(id=>{
      const q=byId.get(id),ok=solved.has(id),step=ok?id:route(id,byId,solved)||id;
      return `<li><span>${ok?'✓':'○'} ${esc(id.toUpperCase())} · ${esc(q?.topic||id)}</span>${ok?'':`<button type="button" class="secondary" data-board-mission="${esc(step)}">${step===id?'Open':'Start at '+esc(step.toUpperCase())}</button>`}</li>`}).join('')}</ul>${
      complete?`<p class="board-explain">${esc(def.explain)}</p>`:
      open?`<div class="board-problem"><h4>COMMISSIONING PROBLEM</h4><p>${esc(def.prompt)}</p><div class="answer-grid">${def.labels.map((label,i)=>`<div><label for="board-${def.id}-${i}">${esc(label)}</label><input id="board-${def.id}-${i}" data-board-input="${def.id}" type="number" step="any" inputmode="decimal"></div>`).join('')}</div><button type="button" class="primary" data-board-check="${def.id}">Commission contract ↗</button><p class="board-feedback" data-board-feedback="${def.id}" role="status"></p></div>`:
      `<p class="board-locked">The commissioning problem opens when all three missions are complete.</p>`}</article>`}).join('')}</div></section>`;
}
return {defs,html,check,route,REWARD};
})();
