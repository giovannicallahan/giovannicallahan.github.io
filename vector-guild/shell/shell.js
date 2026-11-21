/* MathCosmos shell (index.html): wormhole intro, 3D star map of the realms, and a flat list of the same realms.
   Reads window.VG_REALMS (realms/registry.js) and window.VGSave (save-store.js, contract in docs/SAVE-V2.md).
   The flat list is the fallback when three.js or WebGL is missing, the "List view" over the map, and the
   screen-reader copy of the map while 3D runs. The pure helpers below touch no DOM and no three.js;
   qa/shell.test.js runs them under Node. */
(function(root){
'use strict';

/* ---------- Pure logic ---------- */
function safeSlice(getSlice,id){try{var s=getSlice(id);return s&&typeof s==='object'?s:null}catch(e){return null}}
/* Distinct string ids in slice.solved, capped at the part's mission count when it is known. */
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
/* A node counts as unfinished only when it has a ready part with missions left; "coming" parts never lock anything. */
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
  /* A node with nothing built yet has nothing to enter, so it carries no soft-lock sentence. */
  var parts=nodeParts(node,getSlice),anyReady=parts.some(function(p){return p.ready}),
      lock=anyReady?softLock(node,realms,getSlice):softLock({name:node.name,needs:[]},realms,getSlice),
      startHere=!(node.needs&&node.needs.length)&&!hasProgress(realms,getSlice);
  return {id:node.node,name:node.name,learn:node.learn||'',world:node.world||'',tag:startHere?'Start here':'Realm',startHere:startHere,
    single:parts.length===1,parts:parts,lock:lock,enterLabel:lock.locked?'Enter anyway':'Enter realm',
    ready:anyReady,started:parts.some(function(p){return p.started})};
}
/* 3D needs three.js and a WebGL context; the intro plays once, never under reduced motion. */
function chooseMode(o){
  o=o||{};
  if(o.forceFlat||!o.three||!o.webgl)return {mode:'flat',intro:false};
  return {mode:'3d',intro:!o.introSeen&&!o.reducedMotion};
}
/* Android Back: close the innermost open thing; null means nothing is open and Back should leave the app.
   The collection overlay covers everything else, so it goes first. */
function backAction(s){s=s||{};return s.collectionOpen?'collection':s.dialogOpen?'dialog':s.cardOpen?'card':s.listOpen?'list':null}
/* What Back and Escape may close. A card cannot be open under the list, and a list shown because the
   WebGL context is lost cannot be closed (there is no map to go back to), so Back then leaves the app. */
function overlayState(s){
  s=s||{};
  return {collectionOpen:!!s.collectionOpen,dialogOpen:!!s.dialogOpen,cardOpen:!!s.cardOpen&&!s.listOverlay,listOpen:!!s.listOverlay&&!s.contextLost};
}
/* The Android wrapper saves through a system file picker: the file exists only after the player confirms,
   under the name they pick, so the page must not claim a file was made. */
var BACKUP_NAME='mathcosmos-save.json';
function backupMessage(viaPicker){return viaPicker?'Choose where to save the backup.':'Backup file made: '+BACKUP_NAME+'.'}
/* Star-map labels. items: [{x,y,w,h,depth,prev}] with x = left edge, y = wanted top edge, depth = larger is nearer
   the camera, prev = the offset the label had last time (keeps it on the same side while the map turns).
   Nearest labels keep their place; each later one moves up or down by the least amount that clears every
   label already placed, staying between top and bottom. Returns the top edge for each item, in input order.
   If a label has no free place at all it keeps its wanted place. */
function placeLabels(items,top,bottom){
  var order=items.map(function(_,i){return i}).sort(function(a,b){return items[b].depth-items[a].depth||a-b}),placed=[],out=[],EPS=1e-6;
  order.forEach(function(i){
    var it=items[i],lo=top,hi=Math.max(top,bottom-it.h),want=Math.max(lo,Math.min(hi,it.y)),
        near=placed.filter(function(p){return p.x<it.x+it.w-EPS&&it.x<p.x+p.w-EPS}),cands=[want],best=null,bestCost=Infinity;
    near.forEach(function(p){cands.push(p.y+p.h,p.y-it.h)});
    cands.forEach(function(y){
      if(y<lo-EPS||y>hi+EPS)return;
      if(near.some(function(p){return y<p.y+p.h-EPS&&p.y<y+it.h-EPS}))return;
      var cost=Math.abs(y-it.y)-((y-it.y)*(it.prev||0)>0?6:0);
      if(cost<bestCost){bestCost=cost;best=y}
    });
    if(best==null)best=want;
    placed.push({x:it.x,y:best,w:it.w,h:it.h});out[i]=best;
  });
  return out;
}

var Logic={solvedCount:solvedCount,progressText:progressText,enterHref:enterHref,partInfo:partInfo,nodeUnfinished:nodeUnfinished,
  joinNames:joinNames,softLock:softLock,hasProgress:hasProgress,cardModel:cardModel,chooseMode:chooseMode,backAction:backAction,overlayState:overlayState,backupMessage:backupMessage,placeLabels:placeLabels};
if(typeof module==='object'&&module&&module.exports)module.exports=Logic;
if(typeof window==='undefined'||typeof document==='undefined')return;
root.VGShellLogic=Logic;

/* ---------- Page ---------- */
var $=function(id){return document.getElementById(id)};
var REALMS=Array.isArray(root.VG_REALMS)?root.VG_REALMS:[];
var Save=root.VGSave||{};
function getSlice(id){return typeof Save.realm==='function'?Save.realm(id):null}
function call(name,fallback){try{return typeof Save[name]==='function'?Save[name]():fallback}catch(e){return fallback}}
var reducedMQ=root.matchMedia?root.matchMedia('(prefers-reduced-motion: reduce)'):null;
var reduced=!!(reducedMQ&&reducedMQ.matches);
var forceFlat=/(?:^|[?&])flat=1(?:&|$)/.test(location.search.slice(1));

function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function link(cls,text,href,label){var a=el('a',cls,text);a.href=href;if(label)a.setAttribute('aria-label',label);return a}
function bar(solved,total){var b=el('div','vg-bar'),s=el('span');b.setAttribute('aria-hidden','true');s.style.width=(total>0?Math.round(100*solved/total):0)+'%';b.appendChild(s);return b}

/* Builds one realm's content: used by the 3D card and by each entry in the list. */
function renderRealm(m,host,opt){
  opt=opt||{};host.textContent='';
  host.appendChild(el('span','vg-eyebrow',m.tag));
  var h=el(opt.heading||'h2',null,m.name);if(opt.titleId){h.id=opt.titleId;h.tabIndex=-1}host.appendChild(h);
  if(m.learn)host.appendChild(el('p','vg-learn',m.learn));
  if(m.world)host.appendChild(el('p','vg-world','Out in the world: '+m.world));
  if(m.lock.locked)host.appendChild(el('p','vg-lock',m.lock.sentence));
  var actions=el('div','vg-actions');
  if(m.single){
    var p=m.parts[0];
    if(p.ready){host.appendChild(el('p','vg-progress',p.text));host.appendChild(bar(p.solved,p.total));
      var go=m.startHere&&!p.started?'Start here':m.enterLabel;actions.appendChild(link('vg-primary',go,p.href,go+': '+p.name))}
    else host.appendChild(el('p','vg-soon','Not built yet'));
  }else{
    var ul=el('ul','vg-parts');
    m.parts.forEach(function(p){
      var li=el('li','vg-part'+(p.ready?'':' is-soon')),txt=el('div','vg-part-text');
      txt.appendChild(el('strong',null,p.name));
      txt.appendChild(el('span',p.ready?'vg-progress':'vg-soon',p.text));
      if(p.ready)txt.appendChild(bar(p.solved,p.total));
      li.appendChild(txt);
      if(p.ready){var go=m.lock.locked?'Enter anyway':'Enter';li.appendChild(link('vg-primary',go,p.href,go+': '+p.name))}
      ul.appendChild(li);
    });
    host.appendChild(ul);
  }
  if(m.lock.locked&&m.lock.goHref)actions.appendChild(link(m.single&&m.parts[0].ready?'vg-secondary':'vg-primary','Go to '+m.lock.goName,m.lock.goHref));
  if(opt.close){var c=el('button','vg-secondary','Back to map');c.type='button';c.addEventListener('click',opt.close);actions.appendChild(c)}
  if(actions.childNodes.length)host.appendChild(actions);
}

var models={};
function buildModels(){REALMS.forEach(function(r){models[r.node]=cardModel(r,REALMS,getSlice)})}
function showXp(){var xp=+call('totalXp',0)||0;Array.prototype.forEach.call(document.querySelectorAll('[data-xp]'),function(e){e.textContent=String(xp)})}

/* ---------- Collection (collection/core.js and collection/ui.js; docs/COLLECTION.md) ----------
   The button shows the stardust count and opens the overlay. It stays hidden if any part did not load or the
   real save store is missing. settleAwards pays stardust for work not yet paid (a returning 2.0 player gets it
   for every mission already solved) and says so in one toast; it pays nothing twice. */
var Coll=root.VGCollection,CollUI=root.VGCollectionUI,
    hasColl=!!(Coll&&CollUI&&!Save.fallback&&typeof Save.meta==='function'&&typeof Save.putMeta==='function');
function collOpen(){try{return hasColl&&CollUI.isOpen()}catch(e){return false}}
function settleAwards(){
  if(!hasColl)return;
  var events=[];try{events=Coll.settle()||[]}catch(e){events=[]}
  try{if(events.length)CollUI.toast(events);else CollUI.refresh()}catch(e){}
}
if(hasColl)Array.prototype.forEach.call(document.querySelectorAll('[data-collection]'),function(b){b.hidden=false;CollUI.chip(b,{label:'Collection'})});

/* ---------- Flat list ---------- */
var list=$('vg-list'),grid=$('vg-list-grid'),listOverlay=false,listTabbable=true;
function renderList(){
  grid.textContent='';
  if(!REALMS.length){grid.appendChild(el('p','vg-list-note','The realm list did not load. Reload the page to try again.'));return}
  REALMS.forEach(function(r){
    var m=models[r.node],art=el('article','vg-realm'+(m.startHere?' is-start':''));
    art.setAttribute('aria-labelledby','vg-l-'+r.node);
    renderRealm(m,art,{heading:'h2'});art.querySelector('h2').id='vg-l-'+r.node;
    grid.appendChild(art);
  });
  setListTabbable(listTabbable);
}
/* While the 3D map runs, the list stays in the accessibility tree but out of the Tab order (the map labels are the tab stops). */
function setListTabbable(on){
  listTabbable=on;
  Array.prototype.forEach.call(list.querySelectorAll('a,button'),function(e){if(on)e.removeAttribute('tabindex');else e.setAttribute('tabindex','-1')});
}

/* ---------- Save backup (VGSave.exportAll / importAny) ---------- */
var dlg=$('vg-backup'),canBackup=typeof Save.exportAll==='function'&&typeof Save.importAny==='function'&&dlg&&typeof dlg.showModal==='function';
function backupMsg(text,bad){var m=$('vg-backup-msg');m.textContent=text;m.classList.toggle('is-error',!!bad)}
function openBackup(){backupMsg('');dlg.showModal()}
if(canBackup){
  Array.prototype.forEach.call(document.querySelectorAll('[data-backup]'),function(b){b.hidden=false;b.addEventListener('click',openBackup)});
  dlg.querySelector('[data-close]').addEventListener('click',function(){dlg.close()});
  $('vg-export').addEventListener('click',function(){
    try{
      var a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([JSON.stringify(Save.exportAll(),null,2)],{type:'application/json'}));
      a.download=BACKUP_NAME;document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(a.href)},60000);
      backupMsg(backupMessage(!!root.AndroidSave));
    }catch(e){backupMsg('Could not make the backup file.',true)}
  });
  $('vg-import').addEventListener('click',function(){$('vg-file').click()});
  $('vg-file').addEventListener('change',function(e){
    var f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
    var rd=new FileReader();
    rd.onerror=function(){backupMsg('Could not read that file.',true)};
    rd.onload=function(){
      var obj;try{obj=JSON.parse(String(rd.result))}catch(err){backupMsg('That file is not a MathCosmos save.',true);return}
      if(!root.confirm('Restore this backup? It replaces the progress saved on this device.'))return;
      var res;try{res=Save.importAny(obj)||{}}catch(err){res={ok:false,error:String(err&&err.message||err)}}
      if(res.ok){refresh();backupMsg('Save restored.')}else backupMsg('Not restored: '+(res.error||'the file was not accepted.'),true);
    };
    rd.readAsText(f);
  });
}

/* ---------- Mode ---------- */
var THREE=root.THREE;
function webglAvailable(){
  try{
    var c=document.createElement('canvas'),gl=c.getContext('webgl2')||c.getContext('webgl')||c.getContext('experimental-webgl');
    if(!gl)return false;
    var lose=gl.getExtension('WEBGL_lose_context');if(lose)lose.loseContext();
    return true;
  }catch(e){return false}
}
var hasThree=!!(THREE&&THREE.WebGLRenderer),
    choice=chooseMode({forceFlat:forceFlat,three:hasThree,webgl:hasThree&&!forceFlat&&webglAvailable(),introSeen:!!call('introSeen',true),reducedMotion:reduced});
var renderer=null,canvas=$('vg-gl');
if(choice.mode==='3d'){
  try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:(root.devicePixelRatio||1)<2,powerPreference:'default'})}catch(e){renderer=null}
  if(!renderer)choice={mode:'flat',intro:false};
}

var selected=null,lastLabel=null,contextLost=false;
function openThings(){return overlayState({collectionOpen:collOpen(),dialogOpen:!!(dlg&&dlg.open),cardOpen:!!selected,listOverlay:listOverlay,contextLost:contextLost})}
window.VectorGuildBack=function(){
  var a=backAction(openThings());
  if(a==='collection'){CollUI.back();return true}
  if(a==='dialog'){dlg.close();return true}
  if(a==='card'){closeCard();return true}
  if(a==='list'){closeList();return true}
  return false;
};
var closeCard=function(){},closeList=function(){},refreshMap=function(){};
function refresh(){buildModels();renderList();refreshMap();showXp();settleAwards()}
root.addEventListener('pageshow',function(e){if(e.persisted)refresh()});
root.addEventListener('storage',function(e){if(!e.key||/^vector-guild-save/.test(e.key))refresh()});

buildModels();showXp();settleAwards();
if(choice.mode==='flat'){
  document.body.classList.add('vg-flat');
  if(!forceFlat&&REALMS.length)$('vg-list-note').hidden=false;
  renderList();
  document.body.classList.remove('vg-booting');
  return;
}

/* ---------- 3D: setup ---------- */
document.body.classList.add('vg-3d');
var stage=$('vg-stage'),labels=$('vg-labels'),flash=$('vg-flash'),hint=$('vg-hint'),card=$('vg-card');
stage.hidden=false;list.classList.add('vg-sr');list.setAttribute('aria-label','Realm list');
renderList();setListTabbable(false);
document.body.classList.remove('vg-booting');

function hex(name){return {amber:0xffbf5e,cyan:0x8cddd4,violet:0xb69cff,warn:0xff9466,lime:0xd4f36a}[name]||0x8cddd4}
var C={void:0x081114,ink:0xedf0dd,dim:0x91a29f,lime:0xd4f36a,amber:0xffbf5e,cyan:0x8cddd4,violet:0xb69cff,warn:0xff9466};
var TAU=Math.PI*2;
renderer.setClearColor(C.void,1);
var scene=new THREE.Scene();scene.fog=new THREE.FogExp2(C.void,0.008);
var camera=new THREE.PerspectiveCamera(58,1,0.1,900);
var W=1,H=1,mapDist=34,mapRadius=20;

function lineMat(c,o){return new THREE.LineBasicMaterial({color:c,transparent:true,opacity:o==null?0.9:o})}
function ptsMat(c,s,o){return new THREE.PointsMaterial({color:c,size:s,transparent:true,opacity:o==null?0.9:o,sizeAttenuation:true})}
function wire(g,c){var w=new THREE.LineSegments(new THREE.WireframeGeometry(g),lineMat(c));g.dispose();return w}
function geomFrom(arr){var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));return g}
function rgb(h){return [((h>>16)&255)/255,((h>>8)&255)/255,(h&255)/255]}
function rand(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}}

/* ---------- 3D: wormhole ----------
   All rings, wall ribs and speed streaks are one LineSegments draw call and the glow beads one Points call;
   the vertex shader moves, twists and bends them, so the CPU only updates a few uniforms per frame.
   smoothstep edges are always written low, high: GLSL ES leaves the result undefined otherwise. */
var DEPTH=300,RINGS=150,SEG=48,RIBS=8,STREAKS=520,GAP=DEPTH/RINGS;
var TUNNEL_VS=[
 'uniform float uTravel;uniform float uTime;uniform float uDepth;uniform float uRadius;uniform float uStretch;uniform float uSize;',
 'attribute float aOff;attribute float aTail;attribute vec3 aColor;',
 'varying vec3 vColor;varying float vFade;',
 'void main(){',
 '  float z=mod(position.z+uTravel,uDepth)-uDepth+6.0+aOff-aTail*uStretch;',
 '  float tw=z*0.014+uTime*0.5;float c=cos(tw);float s=sin(tw);',
 '  vec2 p=vec2(position.x*c-position.y*s,position.x*s+position.y*c)*uRadius;',
 '  p.x+=sin(z*0.021+uTime*0.6)*(-z*0.034);',
 '  p.y+=cos(z*0.017+uTime*0.45)*(-z*0.028);',
 '  vec4 mv=modelViewMatrix*vec4(p,z,1.0);',
 '  gl_Position=projectionMatrix*mv;',
 '  float d=-z;',
 '  vFade=(1.0-smoothstep(uDepth*0.38,uDepth*0.98,d))*smoothstep(0.5,9.0,d);',
 '  vColor=aColor;',
 '  #ifdef POINTS',
 '  gl_PointSize=min(48.0,uSize*70.0/max(d,1.0));',
 '  #endif',
 '}'].join('\n');
var TUNNEL_FS=[
 'uniform float uGain;varying vec3 vColor;varying float vFade;',
 'void main(){',
 '  float a=vFade*uGain;',
 '  #ifdef POINTS',
 '  a*=1.0-smoothstep(0.0,0.5,length(gl_PointCoord-0.5));',
 '  #endif',
 '  gl_FragColor=vec4(vColor,clamp(a,0.0,1.0));',
 '}'].join('\n');
var tunnelU={uTravel:{value:0},uTime:{value:0},uDepth:{value:DEPTH},uRadius:{value:5},uStretch:{value:1},uSize:{value:1},uGain:{value:1}};
function tunnelMat(points){
  return new THREE.ShaderMaterial({uniforms:tunnelU,vertexShader:TUNNEL_VS,fragmentShader:TUNNEL_FS,defines:points?{POINTS:1}:{},
    transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
}
function tunnelGeom(pos,off,tail,col){
  var g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('aOff',new THREE.Float32BufferAttribute(off,1));
  g.setAttribute('aTail',new THREE.Float32BufferAttribute(tail,1));g.setAttribute('aColor',new THREE.Float32BufferAttribute(col,3));
  return g;
}
var tunnel=new THREE.Group();scene.add(tunnel);
(function(){
  var R=rand(7),pal=[rgb(C.amber),rgb(C.cyan),rgb(C.violet)],P=[],O=[],T=[],K=[],bp=[],bo=[],bt=[],bk=[];
  function v(x,y,z,off,tl,c,f){P.push(x,y,z);O.push(off);T.push(tl);K.push(c[0]*f,c[1]*f,c[2]*f)}
  for(var k=0;k<RINGS;k++){
    var z=-k*GAP,c=k%10===0?rgb(C.lime):pal[k%3];
    for(var i=0;i<SEG;i++){var a0=i/SEG*TAU,a1=(i+1)/SEG*TAU,f=i%6===0?1:0.7;
      v(Math.cos(a0),Math.sin(a0),z,0,0,c,f);v(Math.cos(a1),Math.sin(a1),z,0,0,c,f)}
    for(var j=0;j<RIBS;j++){var a=(j+0.5)/RIBS*TAU;v(Math.cos(a),Math.sin(a),z,0,0,c,0.28);v(Math.cos(a),Math.sin(a),z,-GAP,0,c,0.28)}
    for(var b=0;b<12;b++){var ab=b/12*TAU+(k%2)*0.26;bp.push(Math.cos(ab),Math.sin(ab),z);bo.push(0);bt.push(0);bk.push(c[0],c[1],c[2])}
  }
  var ink=rgb(C.ink);
  for(var s=0;s<STREAKS;s++){var as=R()*TAU,r=0.2+R()*0.68,zs=-R()*DEPTH,fs=0.45+R()*0.55;
    v(Math.cos(as)*r,Math.sin(as)*r,zs,0,0,ink,fs);v(Math.cos(as)*r,Math.sin(as)*r,zs,0,1,ink,fs*0.05)}
  var lines=new THREE.LineSegments(tunnelGeom(P,O,T,K),tunnelMat(false));lines.frustumCulled=false;tunnel.add(lines);
  var beads=new THREE.Points(tunnelGeom(bp,bo,bt,bk),tunnelMat(true));beads.frustumCulled=false;tunnel.add(beads);
})();
function glowTexture(){
  var cv=document.createElement('canvas');cv.width=cv.height=128;var cx=cv.getContext('2d'),g=cx.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(0.25,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');
  cx.fillStyle=g;cx.fillRect(0,0,128,128);var t=new THREE.CanvasTexture(cv);return t;
}
var core=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color:C.lime,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
tunnel.add(core);
var EQ=['e^{iπ} + 1 = 0','∫ f′(x) dx = f(x) + C','det(A − λI) = 0','∇ · F = ρ / ε₀','P(A|B) = P(B|A)P(A) / P(B)','a² + b² = c²','Σ 1/n² = π²/6',
  '∂u/∂t = α∇²u','lim sin x / x = 1','V − E + F = 2','F = ma','dy/dx = ky','ℤ / nℤ','p ⇒ q','x = (−b ± √(b² − 4ac)) / 2a','σ² = E[(X − μ)²]',
  'Av = λv','‖u + v‖ ≤ ‖u‖ + ‖v‖','y = mx + b','3/4 + 1/4 = 1'];
var sprites=[];
EQ.forEach(function(txt,i){
  var cv=document.createElement('canvas'),cx=cv.getContext('2d'),font='500 44px monospace';cx.font=font;
  var w=Math.ceil(cx.measureText(txt).width)+24;cv.width=w;cv.height=64;cx=cv.getContext('2d');
  cx.font=font;cx.fillStyle='#fff';cx.textBaseline='middle';cx.fillText(txt,12,34);
  var tex=new THREE.CanvasTexture(cv);tex.minFilter=THREE.LinearFilter;tex.generateMipmaps=false;
  var s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:[C.amber,C.cyan,C.violet,C.lime][i%4],transparent:true,opacity:0.95,depthWrite:false}));
  s.scale.set(w/64*0.9,0.9,1);s.userData={z0:-(i+0.5)*(DEPTH/EQ.length),a:i*2.399,r:0.62+(i%3)*0.07};tunnel.add(s);sprites.push(s);
});
/* Same bend and twist as the vertex shader, for objects placed from JavaScript. */
function bendX(z,t){return Math.sin(z*0.021+t*0.6)*(-z*0.034)}
function bendY(z,t){return Math.cos(z*0.017+t*0.45)*(-z*0.028)}
function wrapZ(z0,travel){var z=(z0+travel)%DEPTH;if(z<0)z+=DEPTH;return z-DEPTH+6}

/* ---------- 3D: star map ---------- */
var map=new THREE.Group();map.visible=false;
var stars=(function(){var R=rand(11),arr=[];for(var i=0;i<1400;i++){var u=R()*2-1,a=R()*TAU,r=120+R()*260,s=Math.sqrt(1-u*u);arr.push(r*s*Math.cos(a),r*u,r*s*Math.sin(a))}
  var p=new THREE.Points(geomFrom(arr),ptsMat(C.dim,0.9,0.7));p.visible=false;scene.add(p);return p})();
var SHAPES={
 found:function(c){return wire(new THREE.IcosahedronGeometry(1.25,0),c)},
 alg:function(c){var m=wire(new THREE.BoxGeometry(1.7,1.7,1.7,2,2,2),c);m.geometry.applyMatrix4(new THREE.Matrix4().set(1,0.45,0,0, 0,1,0.3,0, 0,0,1,0, 0,0,0,1));return m},
 calc:function(c){var g=new THREE.PlaneGeometry(2.8,2.8,12,12),p=g.attributes.position;for(var i=0;i<p.count;i++){p.setZ(i,0.55*Math.sin(p.getX(i)*2)*Math.cos(p.getY(i)*2))}
   var m=wire(g,c);m.rotation.x=-1.1;var h=new THREE.Group();h.add(m);return h},
 stat:function(c){var R=rand(5),arr=[];for(var i=0;i<520;i++){var x=(R()+R()+R()-1.5)*1.3,z=(R()+R()+R()-1.5)*1.3;
   arr.push(x,R()*1.9*Math.exp(-(x*x+z*z)/0.9)-0.7,z)}return new THREE.Points(geomFrom(arr),ptsMat(c,0.07))},
 logic:function(c){var g=new THREE.Group();g.add(wire(new THREE.TetrahedronGeometry(1.4,0),c));g.add(wire(new THREE.OctahedronGeometry(0.6,0),C.ink));return g},
 disc:function(c){var n=[],arr=[],g=new THREE.Group();for(var i=0;i<9;i++){var u=(i/8)*2-1,a=i*2.4,s=Math.sqrt(Math.max(0,1-u*u));n.push([1.3*s*Math.cos(a),1.3*u,1.3*s*Math.sin(a)])}
   [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[0,3],[1,5],[2,6],[4,8],[0,7]].forEach(function(e){arr.push.apply(arr,n[e[0]].concat(n[e[1]]))});
   g.add(new THREE.LineSegments(geomFrom(arr),lineMat(c)));g.add(new THREE.Points(geomFrom([].concat.apply([],n)),ptsMat(C.ink,0.22)));return g},
 diff:function(c){var g=new THREE.Group();for(var k=0;k<3;k++){var arr=[];for(var i=0;i<=140;i++){var t=i/140*14,r=1.5*Math.exp(-0.16*t);arr.push(r*Math.cos(t+k*2.09),-0.9+t*0.13,r*Math.sin(t+k*2.09))}
   g.add(new THREE.Line(geomFrom(arr),lineMat(c)))}return g},
 num:function(c){var arr=[];function prime(n){if(n<2)return false;for(var d=2;d*d<=n;d++)if(n%d===0)return false;return true}
   for(var n=2;n<700;n++){if(prime(n)){var r=Math.sqrt(n)*0.058,a=Math.sqrt(n)*TAU;arr.push(r*Math.cos(a),r*Math.sin(a),0)}}return new THREE.Points(geomFrom(arr),ptsMat(c,0.09))},
 anal:function(c){var g=new THREE.Group();g.add(wire(new THREE.SphereGeometry(1.15,12,8),c));var ring=[];for(var i=0;i<64;i++){var a=i/64*TAU;ring.push(Math.cos(a)*1.8,-1.15,Math.sin(a)*1.8)}
   g.add(new THREE.LineLoop(geomFrom(ring),lineMat(C.ink,0.5)));return g},
 topo:function(c){return wire(new THREE.TorusKnotGeometry(0.85,0.24,90,6),c)},
 phys:function(c){var g=new THREE.Group();[[0.3,0],[1.2,0.5],[-0.8,1.1]].forEach(function(t,k){var ring=[];for(var i=0;i<64;i++){var a=i/64*TAU;ring.push(Math.cos(a)*(1+k*0.3),0,Math.sin(a)*(0.7+k*0.3))}
   var l=new THREE.LineLoop(geomFrom(ring),lineMat(c));l.rotation.set(t[0],0,t[1]);g.add(l)});g.add(new THREE.Points(geomFrom([0,0,0]),ptsMat(C.ink,0.4)));return g}
};
function defaultShape(c){return wire(new THREE.DodecahedronGeometry(1.2,0),c)}
var nodes={},byNode={},edgeArr=[],centre=new THREE.Vector3();
REALMS.forEach(function(r){byNode[r.node]=r;centre.add(new THREE.Vector3(r.pos[0],r.pos[1],r.pos[2]))});
if(REALMS.length)centre.multiplyScalar(1/REALMS.length);
REALMS.forEach(function(r){
  var holder=new THREE.Group(),col=hex(r.color);holder.position.set(r.pos[0],r.pos[1],r.pos[2]);
  var shape;try{shape=(SHAPES[r.node]||defaultShape)(col)}catch(e){shape=defaultShape(col)}
  holder.add(shape);
  /* one small orbiting point per part: a node with several parts reads as a little cluster */
  var orbit=null;
  if((r.parts||[]).length>1){
    var op=[],oc=[],lime=new THREE.Color(C.lime),dim=new THREE.Color(C.dim);
    r.parts.forEach(function(p,i){var a=i/r.parts.length*TAU;op.push(Math.cos(a)*2.1,0,Math.sin(a)*2.1);var cc=p.status==='ready'?lime:dim;oc.push(cc.r,cc.g,cc.b)});
    var og=geomFrom(op);og.setAttribute('color',new THREE.Float32BufferAttribute(oc,3));
    orbit=new THREE.Points(og,new THREE.PointsMaterial({size:0.32,vertexColors:true,transparent:true,opacity:0.95}));orbit.rotation.x=0.35;holder.add(orbit);
  }
  map.add(holder);
  var b=document.createElement('button');b.type='button';b.className='vg-node';b.hidden=true;
  b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','vg-card');
  var pill=el('span','vg-pill');pill.appendChild(el('span','vg-dot'));pill.appendChild(el('span',null,r.name));
  var start=el('span','vg-start','· Start here');start.hidden=true;pill.appendChild(start);b.appendChild(pill);
  b.addEventListener('click',function(){if(selected===r.node)closeCard();else select(r.node)});
  labels.appendChild(b);
  nodes[r.node]={holder:holder,shape:shape,orbit:orbit,btn:b,pill:pill,start:start,scale:1,w:0,dy:null,ty:0};
  mapRadius=Math.max(mapRadius,holder.position.distanceTo(centre)+3);
  (r.needs||[]).forEach(function(n){if(byNode[n])edgeArr.push.apply(edgeArr,byNode[n].pos.concat(r.pos))});
});
if(edgeArr.length)map.add(new THREE.LineSegments(geomFrom(edgeArr),lineMat(C.dim,0.35)));
map.position.copy(centre).multiplyScalar(-1);
var pivot=new THREE.Group();scene.add(pivot);pivot.add(map);

refreshMap=function(){
  REALMS.forEach(function(r){var m=models[r.node],n=nodes[r.node];
    n.btn.classList.toggle('is-ready',m.ready);n.btn.classList.toggle('is-started',m.started);n.start.hidden=!m.startHere;
    n.btn.setAttribute('aria-label',r.name+(m.startHere?', start here':'')+': show details');n.w=0});
  if(selected)renderCard();
};
refreshMap();

/* ---------- 3D: card ---------- */
function renderCard(){renderRealm(models[selected],card,{heading:'h2',titleId:'vg-card-title',close:function(){closeCard()}})}
function select(id){
  selected=id;lastLabel=nodes[id].btn;
  REALMS.forEach(function(x){nodes[x.node].btn.setAttribute('aria-expanded',x.node===id?'true':'false')});
  renderCard();card.hidden=false;
  var h=$('vg-card-title');if(h)h.focus({preventScroll:true});
}
closeCard=function(){
  if(!selected)return;selected=null;card.hidden=true;
  REALMS.forEach(function(x){nodes[x.node].btn.setAttribute('aria-expanded','false')});
  if(lastLabel&&!lastLabel.hidden)lastLabel.focus({preventScroll:true});
};
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape'||(dlg&&dlg.open)||collOpen())return;
  var a=backAction(openThings());
  if(a==='card'){closeCard();e.preventDefault()}else if(a==='list'){closeList();e.preventDefault()}
});

/* ---------- List view over the map ---------- */
var listBtn=$('vg-listbtn'),listBack=$('vg-list-back'),listNote=$('vg-list-note'),listTitle=$('vg-list-title'),listAuto=false;
var NOTE_FAILED=listNote.textContent,NOTE_PAUSED='The star map is paused on this device, so the realms are listed here.';
listTitle.tabIndex=-1;
/* While the list covers the stage, the stage's buttons leave the Tab order and the accessibility tree.
   inert does both; aria-hidden and tabindex cover WebViews without it. */
function setStageInert(on){
  if('inert' in stage)stage.inert=on;
  if(on)stage.setAttribute('aria-hidden','true');else stage.removeAttribute('aria-hidden');
  Array.prototype.forEach.call(stage.querySelectorAll('button'),function(b){if(on)b.setAttribute('tabindex','-1');else b.removeAttribute('tabindex')});
}
/* With the context lost there is no map to go back to: no "Back to map", and a line that says why. */
function showPaused(){listBack.hidden=contextLost;listNote.textContent=contextLost?NOTE_PAUSED:NOTE_FAILED;listNote.hidden=!contextLost}
function openList(auto){
  if(listOverlay)return;listOverlay=true;listAuto=!!auto;closeCard();
  list.classList.remove('vg-sr');list.classList.add('is-overlay');showPaused();setListTabbable(true);stop();
  setStageInert(true);list.scrollTop=0;
  (listBack.hidden?listTitle:listBack).focus({preventScroll:true});
}
closeList=function(){
  if(!listOverlay||contextLost)return;listOverlay=false;listAuto=false;
  list.classList.remove('is-overlay');list.classList.add('vg-sr');listBack.hidden=true;listNote.hidden=true;setListTabbable(false);
  setStageInert(false);start();
  if(!listBtn.hidden)listBtn.focus({preventScroll:true});
};
listBtn.addEventListener('click',function(){openList(false)});
listBack.addEventListener('click',function(){closeList()});

/* ---------- Drag to turn ---------- */
var rotY=0.35,rotX=0.12,drag=null;
canvas.addEventListener('pointerdown',function(e){if(phase!=='map')return;drag={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.classList.add('dragging');try{canvas.setPointerCapture(e.pointerId)}catch(err){}});
canvas.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;rotY+=(e.clientX-drag.x)*0.006;rotX=Math.max(-0.7,Math.min(0.7,rotX+(e.clientY-drag.y)*0.006));drag.x=e.clientX;drag.y=e.clientY});
function endDrag(){drag=null;canvas.classList.remove('dragging')}
canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);

/* ---------- Size ---------- */
function resize(){
  W=stage.clientWidth||root.innerWidth||1;H=stage.clientHeight||root.innerHeight||1;
  renderer.setPixelRatio(Math.min(root.devicePixelRatio||1,2));renderer.setSize(W,H,false);
  camera.aspect=W/H;camera.updateProjectionMatrix();
  var half=Math.tan(58*Math.PI/360);mapDist=Math.max(mapRadius/half,mapRadius/(half*camera.aspect));
  tunnelU.uSize.value=Math.min(root.devicePixelRatio||1,2);
  layoutMap();
}
/* Portrait: the map sphere is fitted to the narrow width, which leaves most of the height empty. Stretch the map
   vertically into that height (each realm's shape is scaled back in mapFrame, so only the spacing grows) and
   centre it in the space below the top bar. Labels are kept below the top bar in every layout. */
var topBar=stage.querySelector('.vg-top'),labelTop=0,spreadY=1,rowH=36;
function layoutMap(){
  var tr=topBar.getBoundingClientRect(),sr=stage.getBoundingClientRect();
  labelTop=Math.max(0,Math.min(H*0.4,tr.bottom-sr.top))+4;
  var portrait=phase==='map'&&W<H;
  spreadY=portrait?Math.max(1,Math.min(2.3,(H-labelTop)/W)):1;
  pivot.scale.set(1,spreadY,1);
  if(portrait)camera.setViewOffset(W,H,0,-Math.round(labelTop/2),W,H);else camera.clearViewOffset();
  REALMS.forEach(function(r){nodes[r.node].w=0});
}
var phase='tunnel';
root.addEventListener('resize',resize);root.addEventListener('orientationchange',resize);resize();

/* ---------- Phases ---------- */
var clock=0,t0=0,mapT=0,mapFlash=false,travel=0,INTRO=4.4,v3=new THREE.Vector3();
var narrow=root.matchMedia?root.matchMedia('(max-width: 650px)'):null;
function ease(x){return x*x*(3-2*x)}
function startTunnel(){
  phase='tunnel';t0=clock;travel=0;tunnel.visible=true;map.visible=false;stars.visible=false;scene.fog.density=0.008;
  camera.position.set(0,0,0);camera.rotation.set(0,0,0);camera.fov=58;camera.updateProjectionMatrix();
  hint.textContent='Entering the wormhole';$('vg-skip').hidden=false;$('vg-replay').hidden=true;listBtn.hidden=true;closeCard();
  REALMS.forEach(function(r){nodes[r.node].btn.hidden=true});
  layoutMap();
  call('setIntroSeen');
}
/* flashIn: the tunnel ran to its end, so the map fades in from the flash; a skip or a direct start does not flash. */
function startMap(flashIn){
  phase='map';mapT=clock;mapFlash=!!flashIn;if(!mapFlash)flash.style.opacity='0';tunnel.visible=false;map.visible=true;stars.visible=true;scene.fog.density=0.0035;
  camera.fov=58;camera.updateProjectionMatrix();
  hint.textContent=narrow&&narrow.matches?'Drag to turn. Tap a realm.':'Drag to turn the map. Pick a realm.';
  var skip=$('vg-skip'),hadFocus=document.activeElement===skip;skip.hidden=true;$('vg-replay').hidden=reduced;listBtn.hidden=false;
  REALMS.forEach(function(r){var n=nodes[r.node];n.btn.hidden=false;n.dy=null});
  layoutMap();
  if(hadFocus){var f=nodes[REALMS[0]&&REALMS[0].node];if(f)f.btn.focus({preventScroll:true})}
}
$('vg-skip').addEventListener('click',function(){startMap(false)});
$('vg-replay').addEventListener('click',function(){if(!reduced)startTunnel()});
if(reducedMQ){var onMQ=function(e){reduced=e.matches;if(phase==='map')$('vg-replay').hidden=reduced;if(reduced&&phase==='tunnel')startMap(false)};
  if(reducedMQ.addEventListener)reducedMQ.addEventListener('change',onMQ);else if(reducedMQ.addListener)reducedMQ.addListener(onMQ)}

function tunnelFrame(dt){
  var t=clock,k=Math.min(1,(t-t0)/INTRO),e=ease(k),speed=28+230*e*e;
  travel=(travel+speed*dt)%DEPTH;
  tunnelU.uTravel.value=travel;tunnelU.uTime.value=t;tunnelU.uStretch.value=0.6+speed*0.05;tunnelU.uGain.value=0.7+0.7*e;
  sprites.forEach(function(s){
    var z=wrapZ(s.userData.z0,travel),tw=z*0.014+t*0.5+s.userData.a,r=s.userData.r*5;
    s.position.set(bendX(z,t)+Math.cos(tw)*r,bendY(z,t)+Math.sin(tw)*r,z);
    s.material.opacity=Math.max(0,Math.min(0.95,(-z-3)/14,(DEPTH*0.9+z)/40));
  });
  var cz=-DEPTH*0.62;core.position.set(bendX(cz,t),bendY(cz,t),cz);core.scale.setScalar(60+520*Math.pow(k,6));
  core.material.opacity=0.45+0.55*e;
  camera.rotation.set(0,0,Math.sin(t*0.5)*0.16+e*0.35);
  camera.position.set((Math.random()-0.5)*0.05*e,(Math.random()-0.5)*0.05*e,0);
  camera.fov=58+40*e;camera.updateProjectionMatrix();
  flash.style.opacity=k>0.84?String(ease((k-0.84)/0.16)):'0';
  if(k>=1)startMap(true);
}
function mapFrame(dt){
  var m=Math.min(1,(clock-mapT)/1.8),e=1-Math.pow(1-m,3);
  if(mapFlash){flash.style.opacity=String(Math.max(0,1-m*1.6));if(m>=0.625)mapFlash=false}
  if(!drag&&!reduced&&!selected&&!(W<H&&W<=650))rotY+=dt*0.045; /* no drift on a phone: targets must hold still */
  pivot.rotation.set(rotX,rotY,0);
  camera.rotation.set(0,0,0);camera.position.set(0,0,mapDist*(reduced?1:2.4-1.4*e));camera.lookAt(0,0,0);
  if(!reduced&&nodes)REALMS.forEach(function(r){var o=nodes[r.node].orbit;if(o)o.rotation.y+=dt*0.6});
  pivot.updateMatrixWorld();
  var shown=[],items=[];
  REALMS.forEach(function(r){
    var n=nodes[r.node];
    if(!reduced){n.shape.rotation.y+=dt*0.35;n.shape.rotation.x+=dt*0.12}
    var target=selected===r.node?1.6:1;n.scale+=(target-n.scale)*Math.min(1,dt*8);n.holder.scale.set(n.scale,n.scale/spreadY,n.scale);
    n.holder.getWorldPosition(v3);var depth=v3.z;v3.project(camera);
    if(v3.z>1){n.btn.style.opacity='0';n.btn.style.visibility='hidden';n.dy=null;return}
    n.btn.style.visibility='';
    if(!n.w){n.w=n.btn.offsetWidth||120;rowH=Math.ceil(((n.pill.offsetHeight||28)+44)/2)+1;
      /* Phone: give every realm a wide row of its own so a thumb cannot land on a neighbour. */
      if(W<H&&W<=650)rowH=Math.max(rowH,Math.min(60,Math.floor((H-12-labelTop)/Math.max(1,REALMS.length))))}
    var x=(v3.x*0.5+0.5)*W,y=(-v3.y*0.5+0.5)*H+18,half=n.w/2;
    x=Math.max(half+4,Math.min(W-half-4,x));
    n.btn.style.opacity=(0.5+0.5*Math.max(0,Math.min(1,(depth+18)/30))).toFixed(2);
    n.btn.style.zIndex=String(1000+Math.round(depth*10));
    shown.push(n);items.push({x:x-half-3,y:y,w:n.w+6,h:rowH,depth:depth,prev:n.ty});
  });
  /* No two labels may cross: a pill is rowH apart from its neighbours, so its 44px touch area (shell.css)
     reaches the next pill's edge and no further. Offsets ease in so labels do not jump while the map turns. */
  var ys=placeLabels(items,labelTop,H-12),k=reduced?1:Math.min(1,dt*10);
  shown.forEach(function(n,i){
    var it=items[i];n.ty=ys[i]-it.y;n.dy=n.dy==null?n.ty:n.dy+(n.ty-n.dy)*k;
    n.btn.style.transform='translate('+(it.x+3).toFixed(1)+'px,'+(it.y+n.dy-(44-rowH)/2).toFixed(1)+'px)';
  });
}

/* ---------- Loop: paused while hidden, while the list covers the map, and while the context is lost ---------- */
var raf=0,last=0,running=false;
function frame(now){
  raf=0;if(!running)return;
  if(collOpen()){last=now;raf=requestAnimationFrame(frame);return} /* the collection covers the map: draw nothing until it closes */
  var dt=last?Math.min(0.05,Math.max(0,(now-last)/1000)):0;last=now;clock+=dt;
  if(phase==='tunnel')tunnelFrame(dt);else mapFrame(dt);
  renderer.render(scene,camera);
  raf=requestAnimationFrame(frame);
}
function start(){if(running||contextLost||listOverlay||document.hidden)return;running=true;last=0;raf=requestAnimationFrame(frame)}
function stop(){running=false;if(raf){cancelAnimationFrame(raf);raf=0}}
document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start()});
canvas.addEventListener('webglcontextlost',function(e){e.preventDefault();contextLost=true;stop();if(phase==='tunnel')startMap(false);
  if(listOverlay){var hadBack=document.activeElement===listBack;showPaused();if(hadBack)listTitle.focus({preventScroll:true})}else openList(true)},false);
canvas.addEventListener('webglcontextrestored',function(){contextLost=false;resize();if(listAuto)closeList();else{if(listOverlay)showPaused();start()}},false);

if(choice.intro)startTunnel();else startMap(false);
start();
})(this);
