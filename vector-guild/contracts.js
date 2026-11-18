/* Linked engineering contracts. Cargo is derived only from solved mission IDs.
   This module never changes mission progress, XP, skill points, or saved rewards. */
(function(){
'use strict';
const REQUIRED=['q01','q02','q06'];
/* The practice trial uses a different demand from mission q29 so its answer is not already on screen. */
const DEMAND=10,HALF=DEMAND/2,MIN_EFFORT=2*HALF*HALF;
const jobs=[
{id:'q01',name:'Docking approach',part:'Impulse guidance installed',purpose:'Combine the thruster impulses so the cargo shuttle can approach the docking lane.'},
{id:'q02',name:'Safety cable',part:'Support cable certified',purpose:'Measure and normalize the support direction so the unloading arm can be secured.'},
{id:'q06',name:'Cargo sensors',part:'Telemetry channels calibrated',purpose:'Mix the raw sensor channels into the outputs needed to verify the unloading lane.'}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ids=s=>new Set(s instanceof Set?s:Array.isArray(s)?s:s&&Array.isArray(s.solved)?s.solved:[]);
const fmt=n=>Number.isFinite(n)?String(Number(n.toFixed(5))):'undefined';
function progress(s){const done=ids(s),count=REQUIRED.filter(id=>done.has(id)).length;return {count,total:3,delivered:count===3,completed:REQUIRED.filter(id=>done.has(id)),remaining:REQUIRED.filter(id=>!done.has(id))};}
function evaluatePair(x,y){
 const valid=Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=100&&Math.abs(y)<=100;
 if(!valid)return {valid:false,feasible:false,optimal:false};
 const sum=x+y,effort=x*x+y*y,residual=sum-DEMAND,feasible=Math.abs(residual)<=1e-8;
 return {valid:true,feasible,optimal:feasible&&Math.abs(x-HALF)<=1e-6&&Math.abs(y-HALF)<=1e-6,x,y,sum,effort,residual,correction:DEMAND-sum,gap:effort-MIN_EFFORT,minimum:MIN_EFFORT,marginalX:2*x,marginalY:2*y};
}
function nextJob(target,quests,solved){
 const map=new Map(quests.map(q=>[q.id,q])),seen=new Set();
 function visit(id){if(solved.has(id))return null;if(seen.has(id))return null;seen.add(id);const q=map.get(id);if(!q)return id;for(const p of q.prereqs||[]){if(!solved.has(p)){const candidate=visit(p);if(candidate)return candidate;}}return id;}
 return visit(target)||target;
}
const style=`<style>
.vg-contracts,.vg-allocation{--ct-bg:#102333;--ct-line:#3d566a;--ct-text:#edf4f7;--ct-muted:#b6c9d2;--ct-teal:#75e4d6;--ct-gold:#ffd48a;color:var(--ct-text);background:#0c1c2b;border:1px solid var(--ct-line);border-radius:18px;padding:1.1rem;margin:1rem 0;line-height:1.5;min-width:0}.vg-contracts *,.vg-allocation *{box-sizing:border-box}.vg-contracts h2,.vg-contracts h3,.vg-contracts h4,.vg-allocation h3,.vg-allocation h4{color:var(--ct-text);margin:.3rem 0 .65rem}.vg-contracts p,.vg-allocation p{margin:.5rem 0}.ct-eyebrow{font-size:.72rem;letter-spacing:.13em;color:var(--ct-teal);font-weight:700}.ct-muted{color:var(--ct-muted);font-size:.9rem}.ct-scene{width:100%;height:auto;display:block;max-height:230px;background:#102537;border:1px solid var(--ct-line);border-radius:12px;margin:.8rem 0}.ct-jobs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.65rem}.ct-job{background:var(--ct-bg);border:1px solid var(--ct-line);padding:.85rem;border-radius:12px}.ct-job.is-done{border-color:#4d9f8d}.ct-status{color:var(--ct-gold);font-size:.8rem;font-weight:700}.ct-job.is-done .ct-status{color:var(--ct-teal)}.ct-actions{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.65rem}.vg-contracts button,.vg-allocation button,.vg-allocation input{font:inherit;min-height:44px;border:1px solid #628190;border-radius:9px;color:var(--ct-text);background:#19364b;padding:.5rem .7rem}.vg-contracts button,.vg-allocation button{cursor:pointer}.vg-contracts button:hover,.vg-allocation button:hover{background:#245269}.vg-contracts button:focus-visible,.vg-allocation button:focus-visible,.vg-allocation input:focus-visible{outline:3px solid var(--ct-gold);outline-offset:3px}.vg-allocation button:disabled{opacity:.55;cursor:default}.ct-delivery{padding:.8rem;background:#18382e;border-left:3px solid var(--ct-teal);border-radius:5px}.ct-pending{padding:.8rem;background:#283343;border-left:3px solid var(--ct-gold);border-radius:5px}.ct-progress{height:9px;background:#24394a;border-radius:5px;overflow:hidden;margin:.6rem 0}.ct-progress span{display:block;height:100%;background:var(--ct-teal)}.ct-allocation-entry{border-top:1px solid var(--ct-line);margin-top:1rem;padding-top:.8rem}.ct-inputs{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.ct-inputs label{display:block}.ct-inputs input{width:100%;margin-top:.3rem}.ct-feedback{margin:.8rem 0;padding:.85rem;background:#152e42;border-left:3px solid var(--ct-gold);min-height:65px}.ct-feedback.is-optimal{border-color:var(--ct-teal);background:#143c35}.ct-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem}.ct-metric{padding:.7rem;background:#102333;border:1px solid var(--ct-line);border-radius:9px;overflow-wrap:anywhere}.ct-metric strong{display:block;font-variant-numeric:tabular-nums;font-size:1.2rem}.ct-history{overflow-x:auto}.vg-allocation table{width:100%;color:var(--ct-text);border-collapse:collapse;font-size:.85rem;margin:.5rem 0}.vg-allocation th,.vg-allocation td{padding:.45rem .3rem;text-align:left;border-bottom:1px solid var(--ct-line);white-space:nowrap}.vg-allocation caption{text-align:left;color:var(--ct-muted);padding:.4rem 0}.vg-allocation summary{min-height:44px;padding:.5rem 0;cursor:pointer}.ct-allocation-locked{padding:.8rem;border:1px dashed var(--ct-line);border-radius:10px}.vg-contracts [hidden],.vg-allocation [hidden]{display:none!important}.ct-dispatch-note{min-height:1.4em;color:var(--ct-gold);font-size:.9rem}
@media(max-width:700px){.ct-jobs{grid-template-columns:1fr}.vg-contracts,.vg-allocation{padding:.8rem}.ct-metrics{grid-template-columns:1fr}.ct-metric strong{display:inline;margin-right:.5rem}.ct-scene{min-height:115px}.ct-actions button{flex:1}}
</style>`;
function scene(p){
 const color=id=>p.completed.includes(id)?'#75e4d6':'#597081';
 const shipX=p.delivered?570:100;
 return `<svg class="ct-scene" viewBox="0 0 900 220" role="img" aria-label="Docking sector: ${p.count} of 3 systems restored. ${p.delivered?'Shuttle docked and cargo delivered.':'Cargo shuttle waiting for all safety systems.'}">
<path d="M30 165H870 M30 190H870" stroke="#365269" stroke-width="2"/><path d="M80 100H680" stroke="${color('q01')}" stroke-width="3" stroke-dasharray="9 8"/>
<g fill="#aac5d7"><circle cx="45" cy="32" r="2"/><circle cx="300" cy="42" r="2"/><circle cx="480" cy="25" r="2"/></g>
<g transform="translate(${shipX},72)"><path d="M0 36L30 8H108L140 36L108 65H30Z" fill="#24475b" stroke="#d9eff5" stroke-width="3"/><path d="M90 20L112 36L90 53" fill="#75e4d6"/><rect x="34" y="25" width="25" height="23" rx="3" fill="#ffd48a"/>${p.delivered?'':'<path d="M-6 27L-33 36L-6 46" fill="#ffd48a"/>'}</g>
<path d="M730 44V165H850V44Z" fill="#1c3a4c" stroke="#8da9b7" stroke-width="3"/><path d="M730 55H670V112" fill="none" stroke="${color('q02')}" stroke-width="7"/><path d="M670 112L650 137M670 112L690 137" stroke="${color('q02')}" stroke-width="4"/>
<rect x="759" y="68" width="63" height="40" rx="5" fill="#0c1c2b" stroke="${color('q06')}" stroke-width="3"/><path d="M770 88H781L787 78L796 98L802 88H813" fill="none" stroke="${color('q06')}" stroke-width="3"/>
${p.delivered?'<g fill="#ffd48a" stroke="#8b6a35" stroke-width="2"><rect x="752" y="128" width="28" height="28"/><rect x="787" y="128" width="28" height="28"/></g>':''}
<g fill="#cde4ed" font-family="system-ui,sans-serif" font-size="13"><text x="35" y="210">APPROACH LANE</text><text x="605" y="210">UNLOADING ARM</text><text x="755" y="35">CARGO BAY</text></g></svg>`;
}
function home(quests,solvedIds){
 const qs=Array.isArray(quests)?quests:window.QUESTS||[],done=ids(solvedIds),p=progress(done),map=new Map(qs.map(q=>[q.id,q]));
 return `${style}<section class="vg-contracts" aria-label="Docking restoration contract"><div class="ct-eyebrow">LINKED CONTRACT / DOCKING SECTOR</div><h2>Bring the cargo shuttle home</h2><p>Restore the approach guidance, secure the support cable, and calibrate the cargo sensors. These three mission installations work together to make one delivery possible.</p><div class="ct-progress" role="progressbar" aria-label="Docking systems restored" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${p.count}"><span style="width:${p.count/3*100}%"></span></div><p class="ct-muted">${p.count} / 3 systems restored · existing mission progress counts automatically</p>${scene(p)}
${p.delivered?'<div class="ct-delivery" role="status"><strong>✓ Cargo delivered · docking sector restored</strong><p>The shuttle has docked, the cable supports the unloading arm, and calibrated sensors confirm a clear cargo lane. Two supply crates are now in the bay.</p><p class="ct-muted">This delivery remains visible whenever q01, q02, and q06 are complete in your save.</p></div>':'<div class="ct-pending"><strong>Cargo holding for safety clearance</strong><p>Every remaining job below is required before the shuttle can unload. There is no timer or penalty.</p></div>'}
<div class="ct-jobs">${jobs.map(job=>{const complete=done.has(job.id),next=nextJob(job.id,qs,done),prereq=next!==job.id,title=map.get(next)?.title||next.toUpperCase();return `<article class="ct-job ${complete?'is-done':''}"><span class="ct-status">${complete?'✓ INSTALLED':'○ '+(prereq?'PREPARATION NEEDED':'READY TO BUILD')}</span><h3>${esc(job.name)}</h3><p>${esc(job.purpose)}</p><p class="ct-muted">${esc(job.id.toUpperCase())} · ${complete?esc(job.part):prereq?'First complete '+esc(title)+' ('+esc(next.toUpperCase())+').':'Complete this job to install its system.'}</p><div class="ct-actions"><button type="button" data-ct-mission="${esc(complete?job.id:next)}">${complete?'Review '+esc(job.id.toUpperCase()):prereq?'Prepare: '+esc(next.toUpperCase()):'Build: '+esc(job.id.toUpperCase())}</button>${prereq&&!complete?`<button type="button" data-ct-mission="${esc(job.id)}">Study ${esc(job.name.toLowerCase())} job</button>`:''}</div></article>`;}).join('')}</div>
<p class="ct-dispatch-note" data-ct-dispatch-note role="status"></p>
<div class="ct-allocation-entry"><div class="ct-eyebrow">OPTIONAL / ACTUATOR ENGINEERING</div>${done.has('q29')?'<h3>Can you meet demand with less effort?</h3><p>The pseudoinverse lesson unlocked an open-ended allocation trial. Start with any pair that sums to ${DEMAND}, then refine it.</p><button type="button" data-ct-open-allocation aria-expanded="false">Open actuator optimization trial</button><div data-ct-allocation-host hidden>'+challengeHTML()+'</div>':'<div class="ct-allocation-locked"><h3>Actuator optimization trial</h3><p>Complete q29 · Minimum-effort recovery to unlock this optional challenge. You will try feasible commands and compare their energy costs.</p><button type="button" data-ct-mission="q29">Study q29 / view prerequisites</button></div>'}</div></section>`;
}
function challengeHTML(){return `<section class="vg-allocation" aria-label="Optional actuator optimization challenge">${style}<div class="ct-eyebrow">ENGINEERING TRIAL / NO TIMER</div><h3>Deliver the load, then reduce the effort</h3><p>Two identical actuators must supply a total command of <strong>${DEMAND}</strong>. First enter any feasible pair x + y = ${DEMAND}. Then improve your design by reducing effort E = x² + y².</p><p class="ct-muted">Mira: “Many pairs can move the load. Let’s find which pair wastes the least effort.” Commands may be signed; this model has no nonnegative restriction. This is optional practice with no XP, skill-point changes, or penalties.</p><form data-ct-allocation-form><div class="ct-inputs"><label>Actuator x<input type="number" name="actuator-x" data-ct-x min="-100" max="100" step="any" inputmode="decimal" required placeholder="Choose x"></label><label>Actuator y<input type="number" name="actuator-y" data-ct-y min="-100" max="100" step="any" inputmode="decimal" required placeholder="Choose y"></label></div><div class="ct-actions"><button type="submit">Test this allocation</button><button type="button" data-ct-transfer disabled>Transfer up to 0.5 toward balance</button><button type="button" data-ct-reset-trial>Start a fresh trial</button></div></form><div class="ct-feedback" data-ct-feedback role="status" aria-live="polite" aria-atomic="true">Step 1: enter a pair of commands whose sum is ${DEMAND}. There are many valid starting designs.</div><div class="ct-metrics" aria-label="Current trial summary"><div class="ct-metric"><strong data-ct-total>—</strong>Total command / required ${DEMAND}</div><div class="ct-metric"><strong data-ct-effort>—</strong>Current squared effort</div><div class="ct-metric"><strong data-ct-best>—</strong>Best feasible effort this trial</div></div><div class="ct-history"><table><caption>Recent feasible designs (up to six)</caption><thead><tr><th scope="col">Trial</th><th scope="col">x</th><th scope="col">y</th><th scope="col">x + y</th><th scope="col">Effort</th></tr></thead><tbody data-ct-history><tr><td colspan="5">No feasible designs tested yet.</td></tr></tbody></table></div><details><summary>Mentor explanation: why balancing reduces effort</summary><p>Using y = ${DEMAND} − x, the cost becomes E = x² + (${DEMAND} − x)² = ${MIN_EFFORT} + 2(x − ${HALF})². A square cannot be negative, so the smallest possible effort is ${MIN_EFFORT}, reached only at x = y = ${HALF}.</p><p>The marginal costs are 2x and 2y. If x is larger, transferring a small command from x to y reduces effort while keeping x + y unchanged. Stop when the marginal costs match. The transfer button preserves feasibility and takes a smaller final step if needed.</p><p>Input checks accept a sum within 10⁻⁸ of ${DEMAND} to account for decimal arithmetic. A failed or higher-effort trial never removes your previous best.</p></details></section>`;}
const challengeControllers=new WeakMap(),contractControllers=new WeakMap();
function mountChallenge(root,options){
 const sections=root.matches?.('.vg-allocation')?[root]:Array.from(root.querySelectorAll('.vg-allocation'));
 const controllers=sections.map(section=>{
  if(challengeControllers.has(section))return challengeControllers.get(section);
  const opts=options||{},done=ids(opts.solvedIds);
  if((opts.requireUnlock||opts.solvedIds!==undefined)&&!done.has('q29')){
   section.innerHTML='<p class="ct-allocation-locked">Complete q29 · Minimum-effort recovery to unlock this optional challenge.</p>';
   return {locked:true};
  }
  const $=s=>section.querySelector(s);let best=null,last=null,attempt=0,history=[];
  function message(text,optimal){$('[data-ct-feedback]').textContent=text;$('[data-ct-feedback]').classList.toggle('is-optimal',!!optimal);}
  function test(x,y){
   const r=evaluatePair(x,y);
   if(!r.valid){message('Mira: “Enter a finite number from −100 to 100 for each actuator. Your previous best is safe.”');return r;}
   $('[data-ct-total]').textContent=fmt(r.sum);$('[data-ct-effort]').textContent=fmt(r.effort);
   if(!r.feasible){message(`Mira: “These commands sum to ${fmt(r.sum)}, so they miss demand ${DEMAND}. Keep x = ${fmt(x)} and change y to ${fmt(DEMAND-x)} to satisfy the constraint. First make a feasible design; then we can compare effort. Your previous best is unchanged.”`);return r;}
   const first=best===null,previousBest=best;attempt++;last=[x,y];history.push({x,y,effort:r.effort,attempt});if(best===null||r.effort<best)best=r.effort;
   $('[data-ct-best]').textContent=fmt(best);$('[data-ct-transfer]').disabled=r.optimal;
   $('[data-ct-history]').innerHTML=history.slice(-6).map(h=>`<tr><th scope="row">${h.attempt}</th><td>${fmt(h.x)}</td><td>${fmt(h.y)}</td><td>${fmt(h.x+h.y)}</td><td>${fmt(h.effort)}</td></tr>`).join('');
   if(r.optimal)message(`Mira: “You found the unique minimum: (${HALF},${HALF}) supplies ${DEMAND} with effort ${MIN_EFFORT}. Since E = ${MIN_EFFORT} + 2(x − ${HALF})², no feasible pair can do better. ${first?'You began at the optimum.':'Your refinements reached the most efficient design.'} This is a completed practice trial; no rewards were added.”`,true);
   else{
    const change=first?'You have a feasible starting design.':r.effort<previousBest-1e-8?`You reduced your best effort by ${fmt(previousBest-r.effort)}.`:Math.abs(r.effort-previousBest)<=1e-8?'This matches your best effort.':'This uses more effort; your previous best is unchanged.';
    const from=x>y?'x to y':'y to x';
    message(`Mira: “${change} E = ${fmt(x)}² + ${fmt(y)}² = ${fmt(r.effort)}. The marginal costs are 2x = ${fmt(2*x)} and 2y = ${fmt(2*y)}. Transfer a little command from ${from}, keeping the sum at ${DEMAND}. Balancing the commands reduces effort. Try another pair or use a small transfer.”`);
   }
   return r;
  }
  const form=$('[data-ct-allocation-form]');
  form.addEventListener('submit',e=>{e.preventDefault();const xe=$('[data-ct-x]'),ye=$('[data-ct-y]');test(xe.value.trim()===''?NaN:xe.valueAsNumber,ye.value.trim()===''?NaN:ye.valueAsNumber);});
  $('[data-ct-transfer]').addEventListener('click',()=>{if(!last)return;const d=Math.sign(last[0]-last[1])*Math.min(.5,Math.abs(last[0]-last[1])/2),x=last[0]-d,y=last[1]+d;$('[data-ct-x]').value=fmt(x);$('[data-ct-y]').value=fmt(y);test(x,y);});
  $('[data-ct-reset-trial]').addEventListener('click',()=>{best=null;last=null;attempt=0;history=[];form.reset();$('[data-ct-total]').textContent='—';$('[data-ct-effort]').textContent='—';$('[data-ct-best]').textContent='—';$('[data-ct-transfer]').disabled=true;$('[data-ct-history]').innerHTML='<tr><td colspan="5">No feasible designs tested yet.</td></tr>';message('Fresh practice trial. Your mission progress and rewards are unchanged. Enter any pair whose sum is '+DEMAND+'.');$('[data-ct-x]').focus();});
  const controller={test,getState:()=>({best,last:last&&last.slice(),attempt,history:history.map(h=>({...h}))})};challengeControllers.set(section,controller);return controller;
 });
 return controllers.length===1?controllers[0]:controllers;
}
function mount(root,options){
 const opts=options||{},sections=root.matches?.('.vg-contracts')?[root]:Array.from(root.querySelectorAll('.vg-contracts'));
 const result=sections.map(section=>{
  if(contractControllers.has(section)){contractControllers.get(section).update(opts.solvedIds);return contractControllers.get(section);}
  let current=Array.from(ids(opts.solvedIds)),quests=opts.quests||window.QUESTS||[],host=section;
  const handler=e=>{const button=e.target.closest('button');if(!button||!host.contains(button))return;
   if(button.dataset.ctMission){const id=button.dataset.ctMission;if(typeof opts.openMission==='function')opts.openMission(id);else{host.dispatchEvent(new CustomEvent('vector-guild:open-mission',{bubbles:true,detail:{id}}));const note=host.querySelector('[data-ct-dispatch-note]');if(note)note.textContent='Open mission '+id.toUpperCase()+' from the campaign if it did not open automatically.';}}
   if(button.hasAttribute('data-ct-open-allocation')){const target=host.querySelector('[data-ct-allocation-host]');if(!target||!ids(current).has('q29'))return;target.hidden=!target.hidden;button.setAttribute('aria-expanded',String(!target.hidden));button.textContent=target.hidden?'Open actuator optimization trial':'Close actuator optimization trial';if(!target.hidden){mountChallenge(target,{solvedIds:current,requireUnlock:true});target.querySelector('[data-ct-x]')?.focus();}}
  };
  host.addEventListener('click',handler);
  const controller={update(s){const next=Array.from(ids(s));if(next.slice().sort().join('|')===current.slice().sort().join('|'))return;current=next;const temp=document.createElement('div');temp.innerHTML=home(quests,current);const replacement=temp.querySelector('.vg-contracts');if(!replacement)return;host.removeEventListener('click',handler);contractControllers.delete(host);host.replaceWith(replacement);host=replacement;host.addEventListener('click',handler);contractControllers.set(host,controller);},getProgress:()=>progress(current)};
  contractControllers.set(host,controller);return controller;
 });
 return result.length===1?result[0]:result;
}
function update(root,solvedIds){const sections=root.matches?.('.vg-contracts')?[root]:Array.from(root.querySelectorAll('.vg-contracts'));sections.forEach(section=>{const c=contractControllers.get(section);if(c)c.update(solvedIds);});}
window.Contracts={home,html:s=>home(window.QUESTS||[],s),mount,mountChallenge,challengeHTML,update,math:{evaluatePair,progress,nextJob,DEMAND}};
})();
