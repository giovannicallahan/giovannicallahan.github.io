/* MathCosmos home view: the page the wormhole intro leads into. A welcome, one "start/continue" button, a grid of
   realm cards with a turning 3D icon each, a closed drop-down for realms that are not built yet, and a details
   panel (bottom sheet on a phone, side panel on a wide screen) with the parts of a realm and its Enter buttons.
   Reads window.VG_REALMS (realms/registry.js) and window.VGSave (save-store.js). Classic script, no network.
   window.VGHome = { mount(container, opts), unmount(), refresh(), back() }
     opts: realms, save, three (pass null for no 3D), reducedMotion, onEnter(href),
           actions: [{label, onClick | href, place: 'top' | 'foot'}]  extra buttons (Collection, Replay intro, backup)
   The pure helpers touch no DOM and no three.js; qa/home.test.js runs them under Node.
   The card wording and soft-lock logic are a copy of shell/shell.js (cardModel, softLock, renderRealm): keep them in step. */
(function(root){
'use strict';

/* ---------- Pure logic (copied from shell.js) ---------- */
function safeSlice(getSlice,id){try{var s=getSlice(id);return s&&typeof s==='object'?s:null}catch(e){return null}}
function solvedCount(slice,total){
  if(!slice||!Array.isArray(slice.solved))return 0;
  var seen={},n=0;
  slice.solved.forEach(function(id){if(typeof id==='string'&&!Object.prototype.hasOwnProperty.call(seen,id)){seen[id]=1;n++}});
  return total>0?Math.min(n,total):n;
}
function progressText(solved,total){
  if(!(total>0))return solved+' solved';
  return solved+' / '+total+' solved'+(solved>=total?' · complete':'');
}
function enterHref(id){return 'realm.html?realm='+encodeURIComponent(id)}
function partInfo(part,getSlice){
  var ready=part.status==='ready'&&!!part.id,total=ready?Math.max(0,part.missions|0):0,
      solved=ready?solvedCount(safeSlice(getSlice,part.id),total):0;
  return {id:part.id,name:part.name||part.id,ready:ready,solved:solved,total:total,
    finished:ready&&total>0&&solved>=total,started:solved>0,
    text:ready?progressText(solved,total):'Not built yet',href:ready?enterHref(part.id):null};
}
function nodeParts(node,getSlice){return (node.parts||[]).map(function(p){return partInfo(p,getSlice)})}
function nodeUnfinished(node,getSlice){return nodeParts(node,getSlice).some(function(p){return p.ready&&!p.finished})}
function joinNames(a){return a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' and '+a[a.length-1]}
/* Soft lock: a warning and a way to the earlier realm, never a block. */
function softLock(node,realms,getSlice){
  var byId={};(realms||[]).forEach(function(r){byId[r.node]=r});
  var missing=(node.needs||[]).map(function(id){return byId[id]}).filter(function(r){return r&&nodeUnfinished(r,getSlice)});
  if(!missing.length)return {locked:false,missing:[],sentence:'',goName:'',goHref:''};
  var first=missing[0],target=nodeParts(first,getSlice).filter(function(p){return p.ready&&!p.finished})[0];
  return {locked:true,missing:missing.map(function(r){return r.node}),
    sentence:node.name+' builds on '+joinNames(missing.map(function(r){return r.name}))+', which you have not finished yet, but you can go in now.',
    goName:first.name,goHref:target.href};
}
function hasProgress(realms,getSlice){
  return (realms||[]).some(function(r){return (r.parts||[]).some(function(p){
    if(p.status!=='ready'||!p.id)return false;
    var s=safeSlice(getSlice,p.id);return !!s&&(solvedCount(s,0)>0||(+s.xp||0)>0)})});
}
function cardModel(node,realms,getSlice){
  var parts=nodeParts(node,getSlice),anyReady=parts.some(function(p){return p.ready}),
      lock=anyReady?softLock(node,realms,getSlice):softLock({name:node.name,needs:[]},realms,getSlice),
      startHere=!(node.needs&&node.needs.length)&&!hasProgress(realms,getSlice);
  return {id:node.node,name:node.name,learn:node.learn||'',world:node.world||'',tag:startHere?'Start here':'Realm',startHere:startHere,
    single:parts.length===1,parts:parts,lock:lock,enterLabel:lock.locked?'Enter anyway':'Enter realm',
    ready:anyReady,started:parts.some(function(p){return p.started})};
}

/* ---------- Pure logic (home only) ---------- */
function isReady(node){return !!node&&(node.parts||[]).some(function(p){return p.status==='ready'&&!!p.id})}
/* Realms with something to play go in the grid; the rest go in the closed drop-down. Registry order is kept. */
function splitRealms(realms){
  var ready=[],coming=[];
  (realms||[]).forEach(function(r){(isReady(r)?ready:coming).push(r)});
  return {ready:ready,coming:coming};
}
function moreTitle(n){return 'More realms on the way ('+n+')'}
/* One short line under a card's name. A registry entry may carry its own `short`; unknown realms use the start of `learn`. */
var SHORT={found:'Numbers, equations and graphs',alg:'Vectors and matrices',calc:'Change, and how it adds up',stat:'Chance and evidence',
  logic:'Valid arguments and proof',disc:'Counting and arrangements',diff:'How things evolve over time',num:'Primes and networks',
  anal:'Why calculus works',topo:'Shapes that stretch and bend',phys:'Motion, energy and fields'};
function shortLine(node){
  if(node&&typeof node.short==='string'&&node.short)return node.short;
  if(node&&Object.prototype.hasOwnProperty.call(SHORT,node.node))return SHORT[node.node];
  var s=String(node&&node.learn||'').split(/[:.]/)[0].trim();
  return s.length>44?s.slice(0,42).replace(/\s+\S*$/,'')+'…':s;
}
/* Solved and total over the ready parts of one card model. */
function nodeProgress(model){
  var solved=0,total=0;
  (model.parts||[]).forEach(function(p){if(p.ready){solved+=p.solved;total+=p.total}});
  return {solved:solved,total:total,text:progressText(solved,total)};
}
/* The status line on a card. */
function cardStatus(model){
  if(!model.ready)return 'Not built yet';
  if(model.startHere&&!model.started)return 'Start here';
  return nodeProgress(model).text;
}
/* The one primary button. The save keeps no "last played" time, so "continue" goes to the unfinished part with the
   most missions solved (registry order breaks ties); when every started part is finished it goes to the next
   unfinished part. With no progress at all it is "Start here" on the first realm that builds on nothing.
   null when nothing is playable. */
function continueTarget(realms,getSlice){
  var list=[];
  (realms||[]).forEach(function(r){(r.parts||[]).forEach(function(p){
    var i=partInfo(p,getSlice);if(!i.ready)return;
    var s=safeSlice(getSlice,p.id);
    list.push({info:i,node:r,active:i.started||(!!s&&(+s.xp||0)>0),order:list.length});
  })});
  if(!list.length)return null;
  function out(kind,c){return {kind:kind,id:c.info.id,node:c.node.node,name:c.info.name,href:c.info.href,
    label:(kind==='start'?'Start here: ':'Continue: ')+c.info.name,progress:c.info.text}}
  function bySolved(a,b){return b.info.solved-a.info.solved||a.order-b.order}
  var open=list.filter(function(c){return c.active&&!c.info.finished}).sort(bySolved);
  if(open.length)return out('continue',open[0]);
  if(list.some(function(c){return c.active})){
    var next=list.filter(function(c){return !c.info.finished})[0];
    return out('continue',next||list.slice().sort(bySolved)[0]);
  }
  return out('start',list.filter(function(c){return !(c.node.needs&&c.node.needs.length)})[0]||list[0]);
}

var Logic={solvedCount:solvedCount,progressText:progressText,enterHref:enterHref,partInfo:partInfo,softLock:softLock,hasProgress:hasProgress,
  cardModel:cardModel,isReady:isReady,splitRealms:splitRealms,moreTitle:moreTitle,shortLine:shortLine,nodeProgress:nodeProgress,
  cardStatus:cardStatus,continueTarget:continueTarget};
if(typeof module==='object'&&module&&module.exports)module.exports=Logic;
if(typeof window==='undefined'||typeof document==='undefined')return;

/* ---------- Page ---------- */
var COLORS={amber:0xffbf5e,cyan:0x8cddd4,violet:0xb69cff,warn:0xff9466,lime:0xd4f36a},INK=0xedf0dd,TAU=Math.PI*2;
function colorName(c){return Object.prototype.hasOwnProperty.call(COLORS,c)?c:'cyan'}
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function bar(solved,total){var b=el('div','vg-bar'),s=el('span');b.setAttribute('aria-hidden','true');s.style.width=(total>0?Math.round(100*solved/total):0)+'%';b.appendChild(s);return b}

/* Flat glyphs: shown when WebGL is missing or its context is lost, and in the details panel. Static strings only. */
var GLYPHS={
 found:'<path d="M24 4 41.3 14v20L24 44 6.7 34V14Z"/><path d="M24 4 12 30h24ZM6.7 14 12 30M41.3 14 36 30M24 44 12 30M24 44l12-14M6.7 34 12 30M41.3 34 36 30"/>',
 alg:'<path d="M8 38 16 10h24l-8 28ZM12 24h24M20 38l8-28"/>',
 calc:'<path d="M6 42V6M6 42h38" opacity=".6"/><path d="M6 34c8 0 8-22 16-22s8 18 20 12"/>',
 stat:'<path d="M4 40h40" opacity=".6"/><path d="M4 38c10 0 12-28 20-28s10 28 20 28"/><path d="M24 10v30" stroke-dasharray="2 3"/>',
 logic:'<path d="M24 5 44 40H4Z"/><path d="m24 19 7 9-7 9-7-9Z"/>',
 disc:'<path d="M10 12 30 8l10 18-18 14L8 30ZM10 12l12 28M30 8l-8 32M10 12l30 14"/><g fill="currentColor"><circle cx="10" cy="12" r="2.6"/><circle cx="30" cy="8" r="2.6"/><circle cx="40" cy="26" r="2.6"/><circle cx="22" cy="40" r="2.6"/><circle cx="8" cy="30" r="2.6"/></g>',
 diff:'<path d="M24 24c0-3 4-3 4 0 0 5-8 5-8 0 0-8 12-8 12 0 0 11-16 11-16 0 0-14 20-14 20 0 0 17-24 17-24 0"/>',
 num:'<g fill="currentColor" stroke="none"><circle cx="24" cy="24" r="2"/><circle cx="30" cy="21" r="2"/><circle cx="27" cy="31" r="2"/><circle cx="18" cy="28" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="28" cy="12" r="2"/><circle cx="38" cy="19" r="2"/><circle cx="37" cy="32" r="2"/><circle cx="26" cy="40" r="2"/><circle cx="13" cy="37" r="2"/><circle cx="8" cy="24" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="41" cy="8" r="2"/></g>',
 anal:'<circle cx="24" cy="20" r="14"/><ellipse cx="24" cy="20" rx="14" ry="5"/><ellipse cx="24" cy="39" rx="20" ry="5" opacity=".6"/>',
 topo:'<ellipse cx="24" cy="24" rx="20" ry="12"/><path d="M13 22c5 6 17 6 22 0M17 25c3-4 11-4 14 0"/>',
 phys:'<ellipse cx="24" cy="24" rx="20" ry="8"/><ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="2.6" fill="currentColor"/>',
 _:'<path d="M24 4 43 18 36 41H12L5 18ZM24 4v14M43 18 24 18 5 18M24 18 12 41M24 18l12 23"/>'
};
function glyph(node){
  var s=el('span','vgh-glyph');s.setAttribute('aria-hidden','true');
  s.innerHTML='<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" focusable="false">'+
    (Object.prototype.hasOwnProperty.call(GLYPHS,node)&&node!=='_'?GLYPHS[node]:GLYPHS._)+'</svg>';
  return s;
}

var S=null; /* everything one mount owns; null when not mounted */

function getSlice(id){return S&&typeof S.save.realm==='function'?S.save.realm(id):null}
function totalXp(){try{return typeof S.save.totalXp==='function'?(+S.save.totalXp()||0):0}catch(e){return 0}}
function on(target,type,fn,opt){target.addEventListener(type,fn,opt);S.off.push(function(){target.removeEventListener(type,fn,opt)})}
function go(a){
  /* Enter links are real links; a host that passes onEnter takes the navigation over. */
  a.addEventListener('click',function(e){if(S&&typeof S.onEnter==='function'){e.preventDefault();S.onEnter(a.getAttribute('href'))}});
  return a;
}
function link(cls,text,href,label){var a=el('a',cls,text);a.href=href;if(label)a.setAttribute('aria-label',label);return go(a)}

function buildModels(){S.models={};S.realms.forEach(function(r){S.models[r.node]=cardModel(r,S.realms,getSlice)})}

/* ---------- Cards ---------- */
function makeCard(r){
  var ready=isReady(r),li=el('li','vgh-cell'),c=el(ready?'button':'div','vgh-card'+(ready?'':' is-soon'));
  c.style.setProperty('--realm','var(--'+colorName(r.color)+')');
  if(ready){c.type='button';c.setAttribute('aria-haspopup','dialog');c.addEventListener('click',function(){openPanel(r.node)})}
  var icon=el('span','vgh-icon');icon.setAttribute('aria-hidden','true');icon.appendChild(glyph(r.node));c.appendChild(icon);
  c.appendChild(el('span','vgh-name',r.name));
  c.appendChild(el('span','vgh-line',shortLine(r)));
  var status=el('span','vgh-status'),barHost=el('span','vgh-barhost');
  c.appendChild(status);c.appendChild(barHost);
  li.appendChild(c);
  S.cards[r.node]={node:r,el:c,icon:icon,status:status,barHost:barHost,ready:ready};
  return li;
}
function updateCard(id){
  var c=S.cards[id],m=S.models[id],text=cardStatus(m),p=nodeProgress(m);
  c.status.textContent=text;
  c.el.classList.toggle('is-start',text==='Start here');
  c.barHost.textContent='';
  if(c.ready)c.barHost.appendChild(bar(p.solved,p.total));
}
function updateHero(){
  var t=continueTarget(S.realms,getSlice);
  S.cta.hidden=!t;S.ctaNote.hidden=!t;
  if(t){S.cta.textContent=t.label;S.cta.href=t.href;S.ctaNote.textContent=t.kind==='start'?'No maths needed to begin.':t.progress}
  S.xp.textContent=String(totalXp());
}

/* ---------- Details panel ---------- */
/* Same content and wording as renderRealm in shell.js. */
function renderPanel(){
  var m=S.models[S.open],r=S.cards[S.open].node,host=S.sheet;host.textContent='';
  host.style.setProperty('--realm','var(--'+colorName(r.color)+')');
  var head=el('div','vgh-sheet-head'),ic=el('span','vgh-sheet-icon');ic.appendChild(glyph(r.node));head.appendChild(ic);
  head.appendChild(el('span','vg-eyebrow',m.tag));
  var x=el('button','vg-close','×');x.type='button';x.setAttribute('aria-label','Close');x.addEventListener('click',closePanel);head.appendChild(x);
  host.appendChild(head);
  var h=el('h2',null,m.name);h.id='vgh-sheet-title';h.tabIndex=-1;host.appendChild(h);
  if(m.learn)host.appendChild(el('p','vg-learn',m.learn));
  if(m.world)host.appendChild(el('p','vg-world','Out in the world: '+m.world));
  if(m.lock.locked)host.appendChild(el('p','vg-lock',m.lock.sentence));
  var actions=el('div','vg-actions');
  if(m.single){
    var p=m.parts[0];
    if(p.ready){host.appendChild(el('p','vg-progress',p.text));host.appendChild(bar(p.solved,p.total));
      var label=m.startHere&&!p.started?'Start here':m.enterLabel;actions.appendChild(link('vg-primary',label,p.href,label+': '+p.name))}
    else host.appendChild(el('p','vg-soon','Not built yet'));
  }else{
    var ul=el('ul','vg-parts');
    m.parts.forEach(function(p){
      var li=el('li','vg-part'+(p.ready?'':' is-soon')),txt=el('div','vg-part-text');
      txt.appendChild(el('strong',null,p.name));
      txt.appendChild(el('span',p.ready?'vg-progress':'vg-soon',p.text));
      if(p.ready)txt.appendChild(bar(p.solved,p.total));
      li.appendChild(txt);
      if(p.ready){var label=m.lock.locked?'Enter anyway':'Enter';li.appendChild(link('vg-primary',label,p.href,label+': '+p.name))}
      ul.appendChild(li);
    });
    host.appendChild(ul);
  }
  if(m.lock.locked&&m.lock.goHref)actions.appendChild(link(m.single&&m.parts[0].ready?'vg-secondary':'vg-primary','Go to '+m.lock.goName,m.lock.goHref));
  var c=el('button','vg-secondary','Close');c.type='button';c.addEventListener('click',closePanel);actions.appendChild(c);
  host.appendChild(actions);
}
/* While the panel is open the page behind leaves the Tab order and the accessibility tree. */
function setPageInert(v){
  if('inert' in S.scroll)S.scroll.inert=v;
  if(v)S.scroll.setAttribute('aria-hidden','true');else S.scroll.removeAttribute('aria-hidden');
}
function openPanel(id){
  if(!S||!S.cards[id]||!S.cards[id].ready)return;
  S.open=id;S.lastCard=S.cards[id].el;
  renderPanel();S.scrim.hidden=false;S.sheet.scrollTop=0;setPageInert(true);
  var h=S.sheet.querySelector('#vgh-sheet-title');if(h)h.focus({preventScroll:true});
}
function closePanel(){
  if(!S||!S.open)return;
  S.open=null;S.scrim.hidden=true;setPageInert(false);S.sheet.textContent='';
  if(S.lastCard&&S.lastCard.isConnected)S.lastCard.focus({preventScroll:true});
  requestDraw();
}
function trapTab(e){
  if(e.key!=='Tab'||!S||!S.open)return;
  var f=Array.prototype.filter.call(S.sheet.querySelectorAll('a[href],button:not([disabled])'),function(n){return n.offsetParent!==null});
  if(!f.length){e.preventDefault();return}
  var first=f[0],last=f[f.length-1],a=document.activeElement;
  if(e.shiftKey&&(a===first||!S.sheet.contains(a)||a.id==='vgh-sheet-title')){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&(a===last||!S.sheet.contains(a))){e.preventDefault();first.focus()}
}

/* ---------- 3D icons: one renderer, one canvas over the page, one scissor rectangle per visible card ---------- */
function buildIcons(T){
  var pr=S.pr;
  function lineMat(c,o){return new T.LineBasicMaterial({color:c,transparent:true,opacity:o==null?0.95:o})}
  /* Point sizes are in screen pixels: three sizes attenuated points by the canvas height, not the viewport height. */
  function ptsMat(c,px){return new T.PointsMaterial({color:c,size:px*pr,sizeAttenuation:false,transparent:true,opacity:0.95})}
  function wire(g,c){var w=new T.LineSegments(new T.WireframeGeometry(g),lineMat(c));g.dispose();return w}
  function geomFrom(arr){var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(arr,3));return g}
  function rand(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}}
  /* The same shapes as the star map in shell.js. */
  var SHAPES={
   found:function(c){return wire(new T.IcosahedronGeometry(1.25,0),c)},
   alg:function(c){var m=wire(new T.BoxGeometry(1.7,1.7,1.7,2,2,2),c);m.geometry.applyMatrix4(new T.Matrix4().set(1,0.45,0,0, 0,1,0.3,0, 0,0,1,0, 0,0,0,1));return m},
   calc:function(c){var g=new T.PlaneGeometry(2.8,2.8,12,12),p=g.attributes.position;for(var i=0;i<p.count;i++){p.setZ(i,0.55*Math.sin(p.getX(i)*2)*Math.cos(p.getY(i)*2))}
     var m=wire(g,c);m.rotation.x=-1.1;var h=new T.Group();h.add(m);return h},
   stat:function(c){var R=rand(5),arr=[];for(var i=0;i<520;i++){var x=(R()+R()+R()-1.5)*1.3,z=(R()+R()+R()-1.5)*1.3;
     arr.push(x,R()*1.9*Math.exp(-(x*x+z*z)/0.9)-0.7,z)}return new T.Points(geomFrom(arr),ptsMat(c,1.3))},
   logic:function(c){var g=new T.Group();g.add(wire(new T.TetrahedronGeometry(1.4,0),c));g.add(wire(new T.OctahedronGeometry(0.6,0),INK));return g},
   disc:function(c){var n=[],arr=[],g=new T.Group();for(var i=0;i<9;i++){var u=(i/8)*2-1,a=i*2.4,s=Math.sqrt(Math.max(0,1-u*u));n.push([1.3*s*Math.cos(a),1.3*u,1.3*s*Math.sin(a)])}
     [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[0,3],[1,5],[2,6],[4,8],[0,7]].forEach(function(e){arr.push.apply(arr,n[e[0]].concat(n[e[1]]))});
     g.add(new T.LineSegments(geomFrom(arr),lineMat(c)));g.add(new T.Points(geomFrom([].concat.apply([],n)),ptsMat(INK,3)));return g},
   diff:function(c){var g=new T.Group();for(var k=0;k<3;k++){var arr=[];for(var i=0;i<=140;i++){var t=i/140*14,r=1.5*Math.exp(-0.16*t);arr.push(r*Math.cos(t+k*2.09),-0.9+t*0.13,r*Math.sin(t+k*2.09))}
     g.add(new T.Line(geomFrom(arr),lineMat(c)))}return g},
   num:function(c){var arr=[];function prime(n){if(n<2)return false;for(var d=2;d*d<=n;d++)if(n%d===0)return false;return true}
     for(var n=2;n<700;n++){if(prime(n)){var r=Math.sqrt(n)*0.058,a=Math.sqrt(n)*TAU;arr.push(r*Math.cos(a),r*Math.sin(a),0)}}return new T.Points(geomFrom(arr),ptsMat(c,2))},
   anal:function(c){var g=new T.Group();g.add(wire(new T.SphereGeometry(1.15,12,8),c));var ring=[];for(var i=0;i<64;i++){var a=i/64*TAU;ring.push(Math.cos(a)*1.8,-1.15,Math.sin(a)*1.8)}
     g.add(new T.LineLoop(geomFrom(ring),lineMat(INK,0.5)));return g},
   topo:function(c){return wire(new T.TorusKnotGeometry(0.85,0.24,90,6),c)},
   phys:function(c){var g=new T.Group();[[0.3,0],[1.2,0.5],[-0.8,1.1]].forEach(function(t,k){var ring=[];for(var i=0;i<64;i++){var a=i/64*TAU;ring.push(Math.cos(a)*(1+k*0.3),0,Math.sin(a)*(0.7+k*0.3))}
     var l=new T.LineLoop(geomFrom(ring),lineMat(c));l.rotation.set(t[0],0,t[1]);g.add(l)});g.add(new T.Points(geomFrom([0,0,0]),ptsMat(INK,4)));return g}
  };
  function defaultShape(c){return wire(new T.DodecahedronGeometry(1.2,0),c)}
  var box=new T.Box3(),sphere=new T.Sphere(),v=new T.Vector3();
  S.realms.forEach(function(r,i){
    var card=S.cards[r.node];if(!card)return;
    var col=COLORS[colorName(r.color)],shape;
    try{shape=(Object.prototype.hasOwnProperty.call(SHAPES,r.node)?SHAPES[r.node]:defaultShape)(col)}catch(e){shape=defaultShape(col)}
    /* Every shape is centred and scaled to the same radius so it fills its square. */
    box.setFromObject(shape).getBoundingSphere(sphere);
    var far=0;
    shape.traverse(function(o){
      var p=o.geometry&&o.geometry.attributes.position;if(!p)return;
      for(var j=0;j<p.count;j++){far=Math.max(far,v.fromBufferAttribute(p,j).applyMatrix4(o.matrixWorld).distanceTo(sphere.center))}
    });
    var k=1.6/(far||sphere.radius||1),fit=new T.Group(),holder=new T.Group(),scene=new T.Scene();
    shape.position.sub(sphere.center);fit.scale.setScalar(k);fit.add(shape);holder.add(fit);scene.add(holder);
    S.icons.push({el:card.icon,scene:scene,holder:holder,spin:0.6+i*0.9});
  });
}
function setupGL(){
  var T=S.THREE;
  if(!T||!T.WebGLRenderer)return;
  var canvas=el('canvas','vgh-gl');canvas.setAttribute('aria-hidden','true');
  S.pr=Math.min(root.devicePixelRatio||1,2);
  try{
    S.renderer=new T.WebGLRenderer({canvas:canvas,alpha:true,antialias:S.pr<2,powerPreference:'low-power'});
    S.renderer.setClearColor(0x000000,0);
    S.camera=new T.PerspectiveCamera(30,1,0.1,50);S.camera.position.set(0,0,6.6);
    buildIcons(T);
  }catch(e){
    if(S.renderer){try{S.renderer.dispose()}catch(err){}}
    S.renderer=null;S.icons=[];return;
  }
  S.canvas=canvas;S.root.insertBefore(canvas,S.scrim);
  on(canvas,'webglcontextlost',function(e){e.preventDefault();S.lost=true;S.root.classList.remove('vgh-3d');stop()},false);
  on(canvas,'webglcontextrestored',function(){S.lost=false;S.w=S.h=0;S.drawn=false;start();requestDraw()},false);
}
function draw(dt){
  var r=S.renderer,w=S.root.clientWidth,h=S.root.clientHeight;
  if(!w||!h)return;
  if(w!==S.w||h!==S.h){S.w=w;S.h=h;r.setPixelRatio(S.pr);r.setSize(w,h,false)}
  r.setScissorTest(false);r.clear();r.setScissorTest(true);
  var cr=S.root.getBoundingClientRect();
  S.icons.forEach(function(ic){
    if(!S.reduced)ic.spin+=dt*0.45;
    var b=ic.el.getBoundingClientRect();
    /* Off screen, or inside the closed drop-down: not drawn. */
    if(!b.width||!b.height||b.bottom<=cr.top||b.top>=cr.bottom||b.right<=cr.left||b.left>=cr.right)return;
    ic.holder.rotation.set(0.38+0.12*Math.sin(ic.spin*0.6),ic.spin,0);
    var x=b.left-cr.left,y=cr.bottom-b.bottom;
    r.setViewport(x,y,b.width,b.height);r.setScissor(x,y,b.width,b.height);
    r.render(ic.scene,S.camera);
  });
  /* The flat glyphs stay until the first frame is on the canvas. */
  if(!S.drawn){S.drawn=true;S.root.classList.add('vgh-3d')}
}
/* The loop runs only while icons turn. Under reduced motion one frame is drawn when something moves (scroll, resize, drop-down). */
function frame(now){
  if(!S)return;
  S.raf=0;
  if(!S.renderer||S.lost||document.hidden)return;
  var dt=S.last?Math.min(0.05,Math.max(0,(now-S.last)/1000)):0;S.last=now;
  draw(dt);
  if(S.running)S.raf=root.requestAnimationFrame(frame);
}
function start(){if(!S||!S.renderer||S.lost||document.hidden||S.reduced||S.running)return;S.running=true;S.last=0;if(!S.raf)S.raf=root.requestAnimationFrame(frame)}
function stop(){if(!S)return;S.running=false;if(S.raf){root.cancelAnimationFrame(S.raf);S.raf=0}}
function requestDraw(){if(!S||!S.renderer||S.lost||document.hidden||S.raf)return;S.last=0;S.raf=root.requestAnimationFrame(frame)}

/* ---------- Mount ---------- */
function actionButton(a){
  var b=a.href?el('a','vg-ghost vgh-action',a.label):el('button','vg-ghost vgh-action',a.label);
  if(a.href)b.href=a.href;else b.type='button';
  if(typeof a.onClick==='function')b.addEventListener('click',a.onClick);
  return b;
}
function mount(container,opts){
  if(S)unmount();
  if(!container)return;
  opts=opts||{};
  var mq=root.matchMedia?root.matchMedia('(prefers-reduced-motion: reduce)'):null;
  S={container:container,realms:Array.isArray(opts.realms)?opts.realms:(Array.isArray(root.VG_REALMS)?root.VG_REALMS:[]),
    save:opts.save||root.VGSave||{},THREE:'three' in opts?opts.three:root.THREE,onEnter:opts.onEnter,
    reduced:opts.reducedMotion!=null?!!opts.reducedMotion:!!(mq&&mq.matches),
    off:[],cards:{},models:{},icons:[],open:null,lastCard:null,renderer:null,canvas:null,camera:null,
    raf:0,last:0,running:false,lost:false,drawn:false,w:0,h:0,pr:1};
  var actions=(Array.isArray(opts.actions)?opts.actions:[]).filter(function(a){return a&&a.label}),
      split=splitRealms(S.realms);

  var rootEl=el('div','vgh'),scroll=el('div','vgh-scroll'),page=el('div','vgh-page');
  S.root=rootEl;S.scroll=scroll;

  var top=el('header','vgh-top'),brand=el('div','vg-brand'),mark=el('span','vg-mark','◇');
  mark.setAttribute('aria-hidden','true');mark.appendChild(el('i',null,'✳'));brand.appendChild(mark);brand.appendChild(el('strong',null,'MATHCOSMOS'));
  var tools=el('div','vgh-tools'),xp=el('span','vg-xp'),star=el('i',null,'✦');star.setAttribute('aria-hidden','true');
  S.xp=el('b',null,'0');xp.appendChild(star);xp.appendChild(document.createTextNode(' '));xp.appendChild(S.xp);xp.appendChild(document.createTextNode(' XP'));
  tools.appendChild(xp);
  actions.forEach(function(a){if(a.place==='top')tools.appendChild(actionButton(a))});
  top.appendChild(brand);top.appendChild(tools);page.appendChild(top);

  var main=el('main','vgh-main');main.setAttribute('aria-labelledby','vgh-title');
  var hero=el('section','vgh-hero'),h1=el('h1',null,'Welcome to MathCosmos');h1.id='vgh-title';h1.tabIndex=-1;
  hero.appendChild(h1);
  hero.appendChild(el('p','vgh-lead','Learn maths from zero, one short mission at a time. Pick a realm below and go in. Every mission you solve builds your outpost.'));
  S.cta=go(el('a','vg-primary vgh-cta',''));S.ctaNote=el('p','vgh-cta-note','');
  hero.appendChild(S.cta);hero.appendChild(S.ctaNote);main.appendChild(hero);

  var pick=el('section','vgh-pick'),h2=el('h2',null,'Choose a realm');h2.id='vgh-pick-title';pick.setAttribute('aria-labelledby','vgh-pick-title');
  pick.appendChild(h2);
  if(!S.realms.length)pick.appendChild(el('p','vgh-note','The realm list did not load. Reload the page to try again.'));
  else if(!split.ready.length)pick.appendChild(el('p','vgh-note','No realm is ready to play yet.'));
  else{
    pick.appendChild(el('p','vgh-note','Tap a realm to see what is inside.'));
    var grid=el('ul','vgh-grid');split.ready.forEach(function(r){grid.appendChild(makeCard(r))});pick.appendChild(grid);
  }
  main.appendChild(pick);
  if(split.coming.length){
    var more=el('details','vgh-more'),sum=el('summary',null,moreTitle(split.coming.length)),g2=el('ul','vgh-grid');
    split.coming.forEach(function(r){g2.appendChild(makeCard(r))});
    more.appendChild(sum);more.appendChild(g2);main.appendChild(more);
    on(more,'toggle',requestDraw);
  }
  page.appendChild(main);
  var footActions=actions.filter(function(a){return a.place!=='top'});
  if(footActions.length){var foot=el('footer','vgh-foot');footActions.forEach(function(a){foot.appendChild(actionButton(a))});page.appendChild(foot)}
  scroll.appendChild(page);rootEl.appendChild(scroll);

  S.scrim=el('div','vgh-scrim');S.scrim.hidden=true;
  S.sheet=el('div','vgh-sheet vg-realm');S.sheet.setAttribute('role','dialog');S.sheet.setAttribute('aria-modal','true');S.sheet.setAttribute('aria-labelledby','vgh-sheet-title');
  S.scrim.appendChild(S.sheet);rootEl.appendChild(S.scrim);
  on(S.scrim,'click',function(e){if(e.target===S.scrim)closePanel()});
  on(S.sheet,'keydown',trapTab);
  on(document,'keydown',function(e){
    if(e.key!=='Escape'||!S||!S.open||document.querySelector('dialog[open]'))return;
    e.preventDefault();closePanel();
  });

  container.appendChild(rootEl);
  refresh();
  setupGL();
  on(scroll,'scroll',requestDraw,{passive:true});
  on(root,'resize',requestDraw);
  on(document,'visibilitychange',function(){if(document.hidden)stop();else{start();requestDraw()}});
  on(root,'pageshow',function(e){if(e.persisted)refresh()});
  on(root,'storage',function(e){if(!e.key||/^vector-guild-save/.test(e.key))refresh()});
  if(mq&&opts.reducedMotion==null){
    var onMQ=function(e){if(!S)return;S.reduced=e.matches;if(S.reduced)stop();else start();requestDraw()};
    if(mq.addEventListener){mq.addEventListener('change',onMQ);S.off.push(function(){mq.removeEventListener('change',onMQ)})}
    else if(mq.addListener){mq.addListener(onMQ);S.off.push(function(){mq.removeListener(onMQ)})}
  }
  start();requestDraw();
}
function refresh(){
  if(!S)return;
  buildModels();
  Object.keys(S.cards).forEach(updateCard);
  updateHero();
  if(S.open){
    var inside=S.sheet.contains(document.activeElement);
    renderPanel();
    if(inside){var h=S.sheet.querySelector('#vgh-sheet-title');if(h)h.focus({preventScroll:true})}
  }
  requestDraw();
}
function back(){if(!S||!S.open)return false;closePanel();return true}
function unmount(){
  if(!S)return;
  stop();
  S.off.forEach(function(f){try{f()}catch(e){}});
  S.icons.forEach(function(ic){ic.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()})});
  if(S.renderer){try{S.renderer.dispose();S.renderer.forceContextLoss()}catch(e){}}
  if(S.root&&S.root.parentNode)S.root.parentNode.removeChild(S.root);
  S=null;
}

root.VGHomeLogic=Logic;
root.VGHome={mount:mount,unmount:unmount,refresh:refresh,back:back};
})(this);
