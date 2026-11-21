/* Deterministic mission trials. Rendering and replay never write progress. */
window.Docking = (() => {
  'use strict';
  const supported = id => ['q01', 'q07', 'q48'].includes(id);
  const finite = v => Array.isArray(v) && v.every(Number.isFinite);
  const fmt = n => Number(n.toFixed(3)).toString();
  const vector = v => '(' + v.map(fmt).join(', ') + ')';
  const rotate = ([x, y], angle) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
  /* goal defaults to the authored mission; a generated mission passes its own answer. */
  function evaluate(id, candidate, goalOverride) {
    if (!supported(id)) return { valid: false };
    const goal = finite(goalOverride) ? goalOverride : id === 'q01' ? [2, 3, 2] : id === 'q07' ? [2, 3] : [2, 1, 1];
    if (!finite(candidate) || candidate.length !== goal.length) return { valid: false };
    const delta = goal.map((x, i) => x - candidate[i]);
    return { valid: true, goal, candidate: [...candidate], delta, hit: delta.every(x => Math.abs(x) <= .01) };
  }
  function guidance(id, result) {
    if (id !== 'q01') return result.hit ? 'Mira: “The transformed point reaches the target frame. Your prediction matches the matrix action.”' : id === 'q07' ? 'Mira: “For a positive quarter turn, old y becomes negative new x, and old x becomes new y. Compare your predicted point with the target.”' : 'Mira: “Compare the rotation and translation separately. A point keeps its final homogeneous coordinate 1. Use the help panel if you want a worked route.”';
    return 'Mira: “' + result.delta.map((d, i) => {
      const axis = ['X', 'Y', 'Z'][i];
      return Math.abs(d) <= .01 ? `${axis} is aligned` : `${axis} ${d > 0 ? 'falls short: that signed impulse is too small' : 'overshoots: that signed impulse is too large'}`;
    }).join('; ') + '. Add the matching components again, one axis at a time.”';
  }
  const verdict = d => Math.abs(d) <= .01 ? 'on target' : d > 0 ? 'too low' : 'too high';
  const pair = (v, fallback) => finite(v) && v.length === 2 ? v : fallback;
  const show = v => '(' + v.map(x => fmt(x).replace('-', '−')).join(',') + ')';
  function html(q) {
    if (!supported(q.id)) return '';
    const dock = q.id === 'q01', demo = q.id === 'q07';
    const point = pair(q.params?.v, [3, -2]), shift = pair(q.params?.t, [5, -1]);
    return `<section class="flight-trial" data-flight-id="${q.id}"><div class="eyebrow">${dock ? 'MISSION CONTROL / LIVE DOCKING TRIAL' : demo ? 'MIRA DEMONSTRATES → YOU TAKE CONTROL' : 'INDEPENDENT FRAME TRANSFER'}</div><h3>${dock ? 'Your impulse flies the shuttle' : demo ? 'Watch a quarter turn. Then predict your own.' : 'Plan the docking-frame transform'}</h3><p>${dock ? 'Model: initially stationary shuttle, mass 1 kg, instantaneous impulse at t=0, then 1 s of unpowered drift. Thus v=J/m and p(1)=J. The dock sits exactly where the correct resultant carries the shuttle; its coordinates are not shown. Enter the resultant impulse above, then test the approach.' : demo ? 'Mira’s example uses (1,0), not your mission point. A 90° counterclockwise turn takes it to (0,1). Then you predict and test ' + show(point) + '.' : 'You have the controls. Enter your predicted homogeneous point above, then test the complete rotation-plus-translation. Help stays optional.'}</p>${demo ? '<button class="secondary flight-demo">▶ Watch Mira’s example</button>' : ''}${q.id === 'q48' ? '<details class="flight-help"><summary>Ask Mira for a strategy</summary><p>First rotate (x,y) to (−y,x). Then add ' + show(shift) + ' because the point’s homogeneous coordinate is 1. A direction with final coordinate 0 receives no translation.</p></details>' : ''}<div class="flight-scene" role="img" aria-label="Mission trajectory will appear after you test an answer."></div><div class="flight-axis"></div><p class="flight-status" role="status">${dock ? 'Awaiting your candidate impulse.' : demo ? 'Watch the example if you wish, then test your own prediction.' : 'Awaiting your independent prediction.'}</p><div class="flight-controls"><button class="secondary flight-pause" disabled>Pause</button><button class="secondary flight-replay" disabled>Replay trial</button><button class="secondary flight-revise" disabled>Revise answer</button></div><p class="flight-mira" aria-live="polite"></p><p class="flight-note">Replay is observation only. A mission reward is considered only after a completed test of your current answer. A hit on your first test earns the first-try star.</p></section>`;
  }
  function mount(root, q, options = {}) {
    const el = root.querySelector('.flight-trial');
    if (!el || !supported(q.id)) return null;
    let frame = null, pending = null, last = null, elapsed = 0, previous = null, paused = false, disposed = false;
    const scene = el.querySelector('.flight-scene'), status = el.querySelector('.flight-status'), axes = el.querySelector('.flight-axis'), mira = el.querySelector('.flight-mira');
    const pause = el.querySelector('.flight-pause'), replay = el.querySelector('.flight-replay'), revise = el.querySelector('.flight-revise');
    const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    function stop(completed = false) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null; previous = null; paused = false; pause.textContent = 'Pause'; pause.disabled = true;
      if (pending) { const resolve = pending; pending = null; resolve({ completed }); }
    }
    function render(t, candidate, demo = false) {
      const dock = q.id === 'q01', start = demo ? [1, 0] : q.id === 'q07' ? pair(q.params?.v, [3, -2]) : pair(q.params?.p, [2, 3]);
      const shift = pair(q.params?.t, [5, -1]), turned = [-start[1], start[0]];
      const result = demo ? { goal: [0, 1], candidate: [0, 1] } : evaluate(q.id, candidate, q.answer);
      const goal = result.goal;
      const positionAt = u => dock ? candidate.map(v => v * u) : demo || q.id === 'q07' ? rotate(start, u * Math.PI / 2) : u <= .5 ? rotate(start, u * Math.PI) : [turned[0] + shift[0] * (u * 2 - 1), turned[1] + shift[1] * (u * 2 - 1)];
      const position = positionAt(t);
      const extent = Math.max(5, ...candidate.map(Math.abs), ...goal.map(Math.abs), ...start.map(Math.abs)), scale = 80 / extent;
      const panels = dock ? [[0, 1, 'X / Y'], [0, 2, 'X / Z']] : [[0, 1, demo ? 'Mira’s counterclockwise demonstration' : 'World plane / transformed point']];
      scene.innerHTML = `<svg viewBox="0 0 600 280" aria-hidden="true">${panels.map(([a,b,label], i) => {
        const cx = panels.length === 1 ? 300 : 150 + i * 300, cy = 145, point = v => [cx + v[a] * scale, cy - v[b] * scale];
        const g = point(goal), p = point(position), s = dock ? [cx,cy] : point(start), predicted = point(candidate);
        const trail = Array.from({length:41},(_,j)=>point(positionAt(t*j/40))).map((v,j)=>(j?'L':'M')+v.join(' ')).join(' ');
        return `<g><text x="${cx-125}" y="24" fill="#bbd6cd" font-size="14">${label}</text><path d="M${cx-125} ${cy}H${cx+125} M${cx} 42V250" stroke="#4d7177"/><text x="${cx+112}" y="${cy+20}" fill="#9ab7bd" font-size="13">X</text><text x="${cx+10}" y="52" fill="#9ab7bd" font-size="13">${b===2?'Z':'Y'}</text><path d="M${s[0]} ${s[1]}L${g[0]} ${g[1]}" stroke="#8fa888" stroke-dasharray="5 5"/><path d="${trail}" fill="none" stroke="#8cddd4" stroke-width="3"/>${!dock&&!demo?`<circle cx="${predicted[0]}" cy="${predicted[1]}" r="13" fill="none" stroke="#e9a2db" stroke-width="3" stroke-dasharray="3 3"/><text x="${predicted[0]+15}" y="${predicted[1]+20}" fill="#e9a2db" font-size="13">your prediction</text>`:""}<rect x="${g[0]-10}" y="${g[1]-10}" width="20" height="20" rx="3" fill="none" stroke="#d4f36a" stroke-width="3"/><path d="M${p[0]} ${p[1]-9}L${p[0]+9} ${p[1]+7}L${p[0]} ${p[1]+4}L${p[0]-9} ${p[1]+7}Z" fill="#f3c37b"/><circle cx="${s[0]}" cy="${s[1]}" r="3" fill="#cfdfcf"/></g>`;
      }).join('')}</svg>`;
      const done = t >= 1;
      if (demo) {
        // Mira's worked example uses its own numbers, so its coordinates can be shown in full.
        scene.setAttribute('aria-label', `Mira demonstration ${vector(position)}; target ${vector(goal)}. ${Math.round(t*100)} percent complete.`);
        axes.innerHTML = position.map((v,i)=>`<div><b>${['X','Y'][i]}</b><span>${fmt(v)}</span><small>target ${fmt(goal[i])}</small></div>`).join('');
      } else {
        // For the player's own trial, report each coordinate of the prediction and a verdict only.
        const names = dock ? ['X','Y','Z'] : q.id === 'q48' ? ['X','Y','W'] : ['X','Y'];
        const words = candidate.map((v,i)=>done ? verdict(goal[i]-v) : 'testing…');
        scene.setAttribute('aria-label', `${dock?'Shuttle trial':'Transformed point trial'} for your prediction ${vector(candidate)}. ${done ? names.map((n,i)=>n+' '+words[i]).join(', ')+'.' : Math.round(t*100)+' percent complete.'}`);
        axes.innerHTML = candidate.map((v,i)=>`<div><b>${names[i]}</b><span>${fmt(v)}${dock?' m':''}</span><small>${names[i]==='W'?'your W: ':'your prediction: '}${words[i]}</small></div>`).join('');
      }
    }
    function begin(candidate, rewardTrial, demo = false) {
      stop(false);
      if (disposed) return Promise.resolve({ completed: false });
      const result = demo ? { valid: true } : evaluate(q.id, candidate, q.answer);
      if (!result.valid) { status.textContent = 'Enter a finite number for each mission coordinate before testing.'; return Promise.resolve({ completed: false }); }
      elapsed = 0; last = demo ? last : [...candidate];
      pause.disabled = false; replay.disabled = true; revise.disabled = false; mira.textContent = ''; status.textContent = demo ? 'Mira demonstrates a positive quarter turn.' : 'Testing your current prediction…';
      render(0, candidate, demo);
      return new Promise(resolve => {
        pending = resolve;
        function finish() {
          render(1, candidate, demo); replay.disabled = demo || !last; pause.disabled = true;
          status.textContent = demo ? 'Mira: “Positive angles turn counterclockwise: (1,0) becomes (0,1). Now you have the controls.”' : result.hit ? 'Target reached. Trial complete.' : 'Trial complete. The candidate misses the target; revise the components marked too low or too high.';
          mira.textContent = demo ? '' : guidance(q.id, result); stop(rewardTrial && !demo);
        }
        function step(now) {
          if (disposed) { stop(false); return; }
          if (!paused) { if (previous !== null) elapsed += Math.min(100, now - previous); render(Math.min(1,elapsed/1800),candidate,demo); }
          previous = now;
          if (elapsed >= 1800) finish(); else frame = requestAnimationFrame(step);
        }
        if (reduced()) finish(); else frame = requestAnimationFrame(step);
      });
    }
    pause.onclick = () => { paused = !paused; pause.textContent = paused ? 'Resume' : 'Pause'; status.textContent = paused ? 'Trial paused. Resume or revise your answer.' : 'Trial resumed.'; };
    revise.onclick = () => { stop(false); status.textContent = 'Revise your answer above, then test again.'; options.onRevise?.(); };
    replay.onclick = () => { if (last) begin(last, false); };
    el.querySelector('.flight-demo')?.addEventListener('click', () => begin([0,1], false, true));
    if (q.id === 'q07') begin([0,1], false, true);
    return { run: candidate => begin(candidate, true), destroy: () => { disposed = true; stop(false); }, cancel: () => stop(false) };
  }
  return { supported, html, mount, evaluate, rotate, guidance };
})();
