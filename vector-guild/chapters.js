/* Recommended path and chapters.
   Missions are put in one dependency-respecting order (earlier tiers first), then cut into
   eight chapters. A chapter finishes roughly every eight missions, which gives the campaign
   regular milestones; sectors stay as the thematic places shown in the outpost. */
(function(){
'use strict';
const quests=window.QUESTS||[],tier={Basic:0,Intermediate:1,Advanced:2},done=new Set(),order=[];
while(order.length<quests.length){
  const ready=quests.map((q,i)=>({q,i})).filter(({q})=>!done.has(q.id)&&(q.prereqs||[]).every(id=>done.has(id)))
    .sort((a,b)=>(tier[a.q.tier]??3)-(tier[b.q.tier]??3)||a.i-b.i)[0];
  if(!ready)break; /* unreachable missions keep their original position at the end */
  done.add(ready.q.id);order.push(ready.q);
}
for(const q of quests)if(!done.has(q.id))order.push(q);
quests.splice(0,quests.length,...order);
const names=[
['Vectors and transformations','Add, measure and turn vectors; multiply matrices.'],
['Systems and spaces','Solve linear systems and describe rank, nullspace and bases.'],
['Orthogonality and first modes','Project, fit by least squares and meet eigenvalues.'],
['Factorizations and spectra','LU, diagonalization, the spectral theorem and the SVD.'],
['Stability and complex modes','Conditioning, definiteness, complex and defective matrices.'],
['Networks and optimization','Markov chains, graphs and constrained minimization.'],
['Signals and dynamics','Low-rank models, Fourier analysis and differential systems.'],
['Numerical engineering','Block, sparse and iterative methods for larger problems.']
];
const count=names.length,chapters=[];let start=0;
for(let i=0;i<count;i++){
  const size=Math.floor(order.length/count)+(i<order.length%count?1:0),slice=order.slice(start,start+size);start+=size;
  slice.forEach(q=>q.chapter=i);
  chapters.push({index:i,name:names[i][0],blurb:names[i][1],ids:slice.map(q=>q.id)});
}
window.CHAPTERS=chapters.filter(c=>c.ids.length);
})();
