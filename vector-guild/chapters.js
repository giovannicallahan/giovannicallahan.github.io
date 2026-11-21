/* Recommended path and chapters.
   A pack either declares its chapters (REALM.chapters: names, blurbs and mission ids, in order) or leaves
   them null. With null, missions are put in one dependency-respecting order (earlier tiers first), then cut
   into the pack's computedChapters; for linear algebra a chapter finishes roughly every eight missions,
   which gives the campaign regular milestones. Sectors stay as the thematic places shown in the outpost. */
(function(){
'use strict';
const R=window.REALM||{},quests=window.QUESTS||[];
if(Array.isArray(R.chapters)){
  /* Declared chapters. A declared id with no mission yet is left out; an empty chapter keeps its place
     (and its landmark index) and simply shows no missions. Missions in no chapter go last; the harness reports them. */
  const byId=new Map(quests.map(q=>[q.id,q])),placed=new Set(),order=[];
  const chapters=R.chapters.map((c,i)=>{const ids=(c.ids||[]).filter(id=>byId.has(id)&&!placed.has(id));ids.forEach(id=>{placed.add(id);byId.get(id).chapter=i;order.push(byId.get(id))});return {index:i,name:c.name,blurb:c.blurb,ids}});
  for(const q of quests)if(!placed.has(q.id))order.push(q);
  quests.splice(0,quests.length,...order);
  window.CHAPTERS=chapters;
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
window.CHAPTERS=chapters.filter(c=>c.ids.length);
})();
