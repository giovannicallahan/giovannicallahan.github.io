/* Recommended path and chapters.
   A pack either declares its chapters (REALM.chapters: names, blurbs and mission ids, in order) or leaves
   them null. With null, missions are put in one dependency-respecting order (earlier tiers first), then cut
   into the pack's computedChapters; for linear algebra a chapter finishes roughly every eight missions,
   which gives the campaign regular milestones. Sectors stay as the thematic places shown in the outpost. */
(function(){
'use strict';
const R=window.REALM||{},quests=window.QUESTS||[];
/* Practice missions (docs/PACK-FORMAT.md, "Practice missions"). A pack's practice files push raw entries to
   window.PRACTICE: {id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints, solution, guidance}.
   Each one becomes a full mission here: everything that teaches (topic, lesson, teaching, sources) and places it
   (tier, xp, sector, chapter) is taken from its parent, the "learn" mission of the same concept, and it unlocks
   when the parent is solved. In the campaign order a concept's practice missions follow its learn mission.
   A chapter's `ids` stay its learn missions (they decide when the chapter is complete); `practice` lists the rest.
   An entry whose parent is not a learn mission of this pack is left out; qa/harness.js reports it.
   This file must load after the pack's practice files. */
const INHERITED=['topic','tier','sector','lesson','teaching','sources','xp','chapter'];
function addPractice(chapters){
  const learn=new Map(quests.filter(q=>!q.parent).map(q=>[q.id,q])),taken=new Set(quests.map(q=>q.id)),of=new Map();
  for(const p of Array.isArray(window.PRACTICE)?window.PRACTICE:[]){
    if(!p||typeof p.id!=='string'||taken.has(p.id)||!learn.has(p.parent))continue;
    taken.add(p.id);
    const parent=learn.get(p.parent),q=Object.assign({},p);
    for(const key of INHERITED)q[key]=parent[key];
    q.prereqs=[parent.id];delete q.artifact;
    if(!of.has(parent.id))of.set(parent.id,[]);
    of.get(parent.id).push(q);
  }
  for(const list of of.values())list.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
  quests.splice(0,quests.length,...quests.flatMap(q=>[q,...(of.get(q.id)||[])]));
  for(const c of chapters)c.practice=c.ids.flatMap(id=>(of.get(id)||[]).map(q=>q.id));
  return chapters;
}
if(Array.isArray(R.chapters)){
  /* Declared chapters. A declared id with no mission yet is left out; an empty chapter keeps its place
     (and its landmark index) and simply shows no missions. Missions in no chapter go last; the harness reports them. */
  const byId=new Map(quests.map(q=>[q.id,q])),placed=new Set(),order=[];
  const chapters=R.chapters.map((c,i)=>{const ids=(c.ids||[]).filter(id=>byId.has(id)&&!placed.has(id));ids.forEach(id=>{placed.add(id);byId.get(id).chapter=i;order.push(byId.get(id))});return {index:i,name:c.name,blurb:c.blurb,ids}});
  for(const q of quests)if(!placed.has(q.id))order.push(q);
  quests.splice(0,quests.length,...order);
  window.CHAPTERS=addPractice(chapters);
  return;
}
const tier=Object.fromEntries((R.tiers||['Basic','Intermediate','Advanced']).map((t,i)=>[t,i])),done=new Set(),order=[];
while(order.length<quests.length){
  const ready=quests.map((q,i)=>({q,i})).filter(({q})=>!done.has(q.id)&&(q.prereqs||[]).every(id=>done.has(id)))
    .sort((a,b)=>(tier[a.q.tier]??3)-(tier[b.q.tier]??3)||a.i-b.i)[0];
  if(!ready)break; /* unreachable missions keep their original position at the end */
  done.add(ready.q.id);order.push(ready.q);
}
for(const q of quests)if(!done.has(q.id))order.push(q);
quests.splice(0,quests.length,...order);
const names=R.computedChapters||[['Campaign','Every mission in order.']];
const count=names.length,chapters=[];let start=0;
for(let i=0;i<count;i++){
  const size=Math.floor(order.length/count)+(i<order.length%count?1:0),slice=order.slice(start,start+size);start+=size;
  slice.forEach(q=>q.chapter=i);
  chapters.push({index:i,name:names[i][0],blurb:names[i][1],ids:slice.map(q=>q.id)});
}
window.CHAPTERS=addPractice(chapters.filter(c=>c.ids.length));
})();
