/* Install from the website (docs/INSTALL.md). Classic script, loaded at the end of index.html and realm.html.
   Does nothing at all on file:// (the Android app) and in any browser without the needed features.
   1. Registers sw.js on https (or localhost), so the game works offline after one visit.
   2. On the home page: an "Install MathCosmos" button when the browser offers an install prompt,
      or one line of instructions on iPhone and iPad Safari, which has no prompt. Hidden once installed. */
(function(){
'use strict';
try{
  var root=window,doc=document,loc=root.location,nav=root.navigator;
  if(!loc||!nav||!doc)return;
  var host=String(loc.hostname||''),
      local=host==='localhost'||host==='127.0.0.1'||host==='[::1]'||/\.localhost$/.test(host),
      web=loc.protocol==='https:'||(loc.protocol==='http:'&&local);
  if(!web)return; /* file:// and anything else: nothing runs */

  if('serviceWorker' in nav){
    var reg=function(){try{var p=nav.serviceWorker.register('sw.js');if(p&&p.catch)p.catch(function(){})}catch(e){}};
    if(doc.readyState==='complete')reg();else root.addEventListener('load',reg);
  }

  var home=doc.getElementById('vg-home');
  if(!home)return; /* realm.html: only the service worker */

  var standalone=function(){
    try{return nav.standalone===true||!!(root.matchMedia&&root.matchMedia('(display-mode: standalone)').matches)}catch(e){return false}
  };
  var ua=String(nav.userAgent||''),
      ios=/iPad|iPhone|iPod/.test(ua)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1),
      iosSafari=ios&&/Safari/.test(ua)&&!/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua),
      promptEvent=null,installed=false,node=null;

  if(iosSafari&&!doc.querySelector('link[rel="apple-touch-icon"]')){
    var icon=doc.createElement('link');icon.rel='apple-touch-icon';icon.href='icons/icon-180.png';doc.head.appendChild(icon);
  }

  function build(){
    if(installed||standalone())return null;
    if(promptEvent){
      var b=doc.createElement('button');b.type='button';b.className='vg-ghost vgh-action';b.id='vg-install';
      b.textContent='Install MathCosmos';
      b.addEventListener('click',function(){
        var ev=promptEvent;if(!ev)return;
        promptEvent=null; /* a prompt can be shown once */
        try{ev.prompt()}catch(e){}
        try{if(ev.userChoice&&ev.userChoice.then)ev.userChoice.then(function(c){if(c&&c.outcome==='accepted')installed=true;place()},function(){place()});else place()}catch(e){place()}
      });
      return b;
    }
    if(iosSafari){
      var p=doc.createElement('p');p.id='vg-install';p.textContent='To install: Share, then Add to Home Screen';
      p.style.cssText='margin:0;flex-basis:100%;font-size:13px;line-height:1.5;color:#b8c7be';
      return p;
    }
    return null;
  }
  /* The home page (shell/home.js) is rebuilt when it is mounted again, so the button is placed again each time. */
  var placing=false;
  function place(){
    if(placing)return;placing=true;
    try{
      if(node&&node.parentNode){var old=node.parentNode;old.removeChild(node);if(old.getAttribute('data-install-foot')&&!old.childNodes.length&&old.parentNode)old.parentNode.removeChild(old)}
      node=null;
      var page=home.querySelector('.vgh-page');
      if(page){
        var next=build();
        if(next){
          var foot=page.querySelector('.vgh-foot');
          if(!foot){foot=doc.createElement('footer');foot.className='vgh-foot';foot.setAttribute('data-install-foot','1');page.appendChild(foot)}
          foot.appendChild(next);node=next;
        }
      }
    }catch(e){}
    placing=false;
  }

  root.addEventListener('beforeinstallprompt',function(e){
    try{e.preventDefault()}catch(x){} /* no browser banner: the button on the home page asks instead */
    promptEvent=e;place();
  });
  root.addEventListener('appinstalled',function(){installed=true;promptEvent=null;place()});
  try{var mq=root.matchMedia&&root.matchMedia('(display-mode: standalone)');if(mq&&mq.addEventListener)mq.addEventListener('change',place)}catch(e){}
  if(root.MutationObserver){
    try{new root.MutationObserver(function(){if(!placing&&!(node&&home.contains(node)))place()}).observe(home,{childList:true,subtree:true})}catch(e){}
  }
  place();
}catch(e){}
})();
