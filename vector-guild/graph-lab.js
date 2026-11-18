/* Vector Guild: offline, dependency-free matrix and least-squares laboratories. */
(function () {
  'use strict';
  const EPS = 1e-10;
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  function determinant(a) { return a[0] * a[3] - a[1] * a[2]; }
  function transform(a, v) { return [a[0] * v[0] + a[1] * v[1], a[2] * v[0] + a[3] * v[1]]; }
  function rank(a) {
    const s = Math.max(...a.map(Math.abs));
    if (s === 0) return 0;
    const b = a.map(x => x / s);
    return Math.abs(determinant(b)) <= EPS ? 1 : 2;
  }
  function inverse(a) {
    if (rank(a) < 2) return null;
    const d = determinant(a);
    return [a[3] / d, -a[1] / d, -a[2] / d, a[0] / d];
  }
  function leastSquares(points, mode) {
    if (!points.length || points.some(p => p.length !== 2 || !p.every(finite))) return null;
    const n = points.length;
    const mx = points.reduce((s, p) => s + p[0], 0) / n;
    const my = points.reduce((s, p) => s + p[1], 0) / n;
    const sxx = points.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
    const sxy = points.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0);
    // A constant model is well-defined even when all x values coincide.
    const identifiable = mode === 'constant' || sxx > 0;
    const slope = mode === 'constant' || !identifiable ? 0 : sxy / sxx;
    const intercept = my - slope * mx;
    const residuals = points.map(p => p[1] - (intercept + slope * p[0]));
    return { intercept, slope, residuals, sse: residuals.reduce((s, r) => s + r * r, 0), meanX: mx, meanY: my, sxx, sxy, identifiable, n };
  }
  const fmt = n => {
    if (!finite(n)) return 'undefined';
    if (n === 0 || Object.is(n, -0)) return '0';
    if (Math.abs(n) < 0.001 || Math.abs(n) >= 1e5) return n.toExponential(3);
    return String(Number(n.toFixed(4)));
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const presets = {
    identity: { a: [1, 0, 0, 1], v: [2, 1], note: 'Identity preserves every point and direction.' },
    rotation: { a: [0, -1, 1, 0], v: [3, -2], note: 'q07: 90° counterclockwise rotation of (3, −2). Compare the output with the mission.' },
    shear: { a: [1, 1, 0, 1], v: [2, 1], note: 'Horizontal shear: x′ = x + y, y′ = y. Area stays the same even though angles change.' },
    reflection: { a: [-1, 0, 0, 1], v: [2, 1], note: 'Reflection across the y axis reverses orientation. Its determinant is −1.' },
    projection: { a: [0.5, 0.5, 0.5, 0.5], v: [4, 2], note: 'q18: orthogonal projection onto y = x. The square collapses to a line and area becomes zero.' },
    scale: { a: [2, 0, 0, 0.5], v: [2, 1], note: 'Stretch x by 2 and compress y by 1/2. The determinant remains 1.' },
    determinant: { a: [2, 1, 3, 1], v: [1, 1], note: 'q09: this matrix has determinant −1. The mapped square has area 1 with reversed orientation.' },
    inverse: { a: [2, 1, 1, 1], v: [1, 1], note: 'q10 source matrix. Use “Invert matrix” to see the calibration that undoes this map.' },
    zero: { a: [0, 0, 0, 0], v: [2, 1], note: 'The zero map sends the entire plane to one point. Its rank is 0.' }
  };
  /* Inside a mission the lab opens on practice numbers, so the mission's own answer is never preloaded. */
  const missionAlt = {
    rotation: { v: [1, 2], note: 'A 90° counterclockwise rotation of the practice point (1, 2). The mission point is different.' },
    determinant: { a: [3, 1, 2, 2], note: 'Practice matrix with determinant 4. The mission matrix is different; compute its determinant yourself.' },
    inverse: { a: [3, 1, 2, 1], note: 'Practice matrix with determinant 1. Use “Invert matrix” to see its inverse. The mission matrix is different.' },
    projection: { v: [1, 3], note: 'Orthogonal projection onto y = x, shown for the practice vector (1, 3).' }
  };
  function defaultPreset(q) {
    const id = q && q.id;
    return id === 'q07' ? 'rotation' : id === 'q09' ? 'determinant' : id === 'q10' ? 'inverse' : id === 'q18' ? 'projection' : 'identity';
  }
  const css = `<style>
.graph2d{--gl-ink:#e9f4ff;--gl-muted:#b0c2d3;--gl-line:#30455e;--gl-bg:#102034;--gl-cyan:#63e8de;--gl-gold:#ffcf70;color:var(--gl-ink);margin:1rem 0;padding:1rem;background:#0b1729;border:1px solid var(--gl-line);border-radius:18px;font:inherit;line-height:1.5;color-scheme:dark;min-width:0}
.graph2d *{box-sizing:border-box}.graph2d h3,.graph2d h4{margin:.3rem 0 .7rem}.graph2d p{margin:.55rem 0}.graph2d .gl-muted{color:var(--gl-muted);font-size:.9rem}.graph2d button,.graph2d input,.graph2d select{font:inherit;border:1px solid #526b86;border-radius:9px;color:var(--gl-ink);background:#152a43;min-height:44px}.graph2d button{padding:.5rem .8rem;cursor:pointer}.graph2d button:hover{background:#24415e}.graph2d button[aria-pressed=true]{background:#155650;border-color:var(--gl-cyan)}.graph2d :focus-visible{outline:3px solid var(--gl-gold);outline-offset:3px}.graph2d input{width:100%;padding:.35rem .5rem}.graph2d input:invalid{border-color:#ff9999}.graph2d select{padding:.4rem}.graph2d label{display:block}.graph2d .gl-tabs,.graph2d .gl-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin:.6rem 0}.graph2d .gl-tabs>button{flex:1}.graph2d .gl-layout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(220px,1fr);gap:1rem;align-items:start}.graph2d .gl-plot{min-width:0}.graph2d canvas{display:block;width:100%;height:auto;aspect-ratio:1;background:#0e1c2e;border:1px solid var(--gl-line);border-radius:12px;touch-action:none}.graph2d fieldset{border:1px solid var(--gl-line);border-radius:12px;margin:.6rem 0;padding:.7rem;min-width:0}.graph2d legend{color:var(--gl-cyan);padding:0 .4rem}.graph2d .gl-matrix{display:grid;grid-template-columns:1fr 1fr;gap:.55rem}.graph2d .gl-matrix label,.graph2d .gl-vector label{font-size:.85rem;color:var(--gl-muted)}.graph2d .gl-vector{display:grid;grid-template-columns:1fr 1fr;gap:.55rem}.graph2d .gl-result{background:#132b40;border-left:3px solid var(--gl-cyan);padding:.7rem;margin:.6rem 0;overflow-wrap:anywhere}.graph2d .gl-message{min-height:1.5em;color:var(--gl-gold)}.graph2d table{color:var(--gl-ink);width:100%;border-collapse:collapse;font-size:.85rem;margin:.6rem 0}.graph2d caption{text-align:left;color:var(--gl-muted);padding:.3rem 0}.graph2d th,.graph2d td{text-align:left;border-bottom:1px solid var(--gl-line);padding:.4rem .25rem}.graph2d .gl-scroll{overflow-x:auto}.graph2d .gl-data td{min-width:65px}.graph2d .gl-data input{min-width:65px}.graph2d .gl-data button{min-width:44px}.graph2d .gl-legend{display:flex;flex-wrap:wrap;gap:.35rem 1rem;font-size:.82rem}.graph2d .gl-key{display:inline-block;width:12px;height:12px;margin-right:.3rem;border-radius:50%}.graph2d .gl-cyan{color:var(--gl-cyan)}.graph2d .gl-gold{color:var(--gl-gold)}.graph2d [hidden]{display:none!important}.graph2d details{margin-top:.7rem}.graph2d summary{cursor:pointer;min-height:44px;padding:.5rem 0}.graph2d .gl-inline{display:flex;gap:.5rem;align-items:end;flex-wrap:wrap}.graph2d .gl-inline label{flex:1;min-width:100px}.graph2d .gl-number{font-variant-numeric:tabular-nums}
@media(max-width:680px){.graph2d{padding:.7rem}.graph2d .gl-layout{grid-template-columns:1fr}.graph2d .gl-tabs>button{font-size:.88rem}.graph2d canvas{max-height:none}.graph2d .gl-controls{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}.graph2d .gl-controls>.gl-result,.graph2d .gl-controls>.gl-message,.graph2d .gl-controls>.gl-wide{grid-column:1/-1}.graph2d fieldset{margin:0}.graph2d .gl-data{font-size:.8rem}}
@media(prefers-reduced-motion:reduce){.graph2d *{scroll-behavior:auto}}
</style>`;
  function html(q) {
    const scatterFirst = q && ['q20', 'q21', 'q42'].includes(q.id);
    return `${css}<section class="graph2d" aria-label="Interactive engineering graph lab">
<h3>Engineering graph lab</h3><p class="gl-muted">Experiment before answering. Every visual has editable numbers and a text equivalent. This lab never submits mission responses.</p>
<div class="gl-tabs" role="group" aria-label="Choose a graph"><button type="button" data-gl-tab="matrix" aria-pressed="${!scatterFirst}">Matrix playground</button><button type="button" data-gl-tab="scatter" aria-pressed="${!!scatterFirst}">Least-squares workshop</button></div>
<div data-gl-panel="matrix" ${scatterFirst ? 'hidden' : ''}>
<p><strong>Try this:</strong> predict where the two basis arrows and the unit square will land. Change one matrix entry, then compare your prediction. Drag the <span class="gl-gold">input point</span>, or edit x and y.</p>
<div class="gl-layout"><div class="gl-plot"><canvas width="540" height="540" data-gl-canvas="matrix" tabindex="0" aria-label="Matrix transformation plot. Edit the matrix and point below for a numeric equivalent. Arrow keys move the input point by one quarter unit."></canvas><div class="gl-legend"><span><i class="gl-key" style="background:#ffcf70"></i>Input point v / dashed unit square</span><span><i class="gl-key" style="background:#63e8de"></i>Mapped point Av / filled square</span><span><i class="gl-key" style="background:#ff98ce"></i>Mapped first basis</span><span><i class="gl-key" style="background:#a9b7ff"></i>Mapped second basis</span></div><div class="gl-actions"><button type="button" data-gl-action="zoom-in">Zoom in</button><button type="button" data-gl-action="zoom-out">Zoom out</button><button type="button" data-gl-action="fit-matrix">Fit view</button></div><p class="gl-muted">The background grid is the input frame; faint teal lines show its mapped grid. The filled polygon is A applied to the unit square, so its area is |det A|.</p></div>
<div class="gl-controls"><fieldset><legend>Matrix A</legend><div class="gl-matrix">${['a₁₁ (row 1, col 1)', 'a₁₂ (row 1, col 2)', 'a₂₁ (row 2, col 1)', 'a₂₂ (row 2, col 2)'].map((label,i) => `<label>${label}<input type="number" min="-100" max="100" step="any" data-gl-a="${i}" aria-label="${label}"></label>`).join('')}</div></fieldset>
<fieldset><legend>Input point v</legend><div class="gl-vector"><label>x<input type="number" min="-100" max="100" step="any" data-gl-v="0" aria-label="Input point x"></label><label>y<input type="number" min="-100" max="100" step="any" data-gl-v="1" aria-label="Input point y"></label></div></fieldset>
<div class="gl-wide"><label>Explore a transformation<select data-gl-preset aria-label="Transformation preset">${Object.keys(presets).map(k => `<option value="${k}">${({identity:'Identity',rotation:'90° rotation · q07',shear:'Shear',reflection:'Reflection',projection:'Projection · q18',scale:'Stretch / compress',determinant:'Area / determinant · q09',inverse:'Inverse source · q10',zero:'Zero map'})[k]}</option>`).join('')}</select></label><div class="gl-actions"><button type="button" data-gl-action="reset-matrix">Reset mission example</button><button type="button" data-gl-action="invert">Invert matrix</button></div><div class="gl-inline"><label>Rotation angle (degrees)<input type="number" min="-3600" max="3600" step="any" value="90" data-gl-angle></label><button type="button" data-gl-action="rotate">Apply angle</button></div></div>
<p class="gl-message gl-wide" data-gl-matrix-note role="status"></p><div class="gl-result gl-number" data-gl-matrix-result aria-live="polite" aria-atomic="true"></div></div></div>
<details><summary>Numeric equivalent and how to read this graph</summary><div class="gl-scroll" data-gl-matrix-table></div><p>For A = [[a,b],[c,d]], Av = (ax + by, cx + dy). The mapped basis arrows are the columns (a,c) and (b,d). The unit-square corners map to (0,0), (a,c), (a+b,c+d), (b,d).</p><p>det A = ad − bc. Its absolute value is the area scale. Rank 2 fills a plane; rank 1 collapses to a line; rank 0 collapses to the origin. A negative determinant reverses orientation. Very nearly dependent columns are reported as numerically rank 1 using relative tolerance 10⁻¹⁰.</p></details></div>
<div data-gl-panel="scatter" ${scatterFirst ? '' : 'hidden'}>
<p><strong>Try this:</strong> move an observation and predict how the fitted line changes. Drag a dot with touch or mouse, or edit its table coordinates. Residuals are vertical observed-minus-fitted differences.</p>
<div class="gl-layout"><div class="gl-plot"><canvas width="540" height="540" data-gl-canvas="scatter" aria-label="Editable scatterplot with least-squares line and vertical residuals. A complete editable point table follows."></canvas><div class="gl-legend"><span><i class="gl-key" style="background:#ffcf70"></i>Observations</span><span><i class="gl-key" style="background:#63e8de"></i>Least-squares fit</span><span><i class="gl-key" style="background:#ff98ce"></i>Vertical residuals</span></div><div class="gl-actions"><button type="button" data-gl-action="fit-scatter">Fit all points in view</button><button type="button" data-gl-action="add-point">Add observation</button></div><p class="gl-muted">During a drag, the scale stays fixed so your finger tracks the data. Use “Fit all points in view” after edits. All samples carry equal weight.</p></div>
<div><label>Model<select data-gl-model aria-label="Least-squares model"><option value="line">Line: y = intercept + slope · x</option><option value="constant">Constant: y = mean</option></select></label><div class="gl-actions"><button type="button" data-gl-action="sample-constant">q20 constant readings</button><button type="button" data-gl-action="sample-line">q21 telemetry trend</button><button type="button" data-gl-action="reset-scatter">Reset mission example</button></div><p class="gl-message" data-gl-scatter-note role="status"></p><div class="gl-result gl-number" data-gl-fit-result aria-live="polite" aria-atomic="true"></div><div class="gl-scroll"><table class="gl-data"><caption>Editable observations · values from −100 to 100</caption><thead><tr><th scope="col">Point</th><th scope="col">x</th><th scope="col">Observed y</th><th scope="col">Remove</th></tr></thead><tbody data-gl-points></tbody></table></div></div></div>
<details><summary>Fitted values, residuals, and calculation</summary><div class="gl-scroll" data-gl-residual-table></div><p>For a constant model, fitted y = mean(observed y). For a line, first compute x̄ and ȳ (the coordinate means). Slope = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)², and intercept = ȳ − slope · x̄. Σ means “sum over all observations”.</p><p>Residual rᵢ = observed yᵢ − fitted yᵢ. Least squares minimizes SSE = Σrᵢ²; this is a sum, not a mean. A line needs at least two distinct x values to have a unique slope. If all x values coincide, the graph shows the mean as one representative fit and explains that the slope is undetermined.</p></details></div>
</section>`;
  }
  function mount(root, q) {
    const host = root.matches && root.matches('.graph2d') ? root : root.querySelector('.graph2d');
    if (!host || host.dataset.glMounted) return;
    host.dataset.glMounted = 'true';
    const $ = selector => host.querySelector(selector);
    const $$ = selector => Array.from(host.querySelectorAll(selector));
    let chosen = defaultPreset(q), a = presets[chosen].a.slice(), v = presets[chosen].v.slice();
    let matrixRange = 6, scatterRange;
    let points, mode;
    let active = q && ['q20','q21','q42'].includes(q.id) ? 'scatter' : 'matrix';
    const mc = $('[data-gl-canvas="matrix"]'), sc = $('[data-gl-canvas="scatter"]');
    let lastMatrixFrame, lastScatterFrame;
    let pending = false;
    const requestDraw = () => {
      if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; if (host.isConnected) drawActive(); }); }
    };
    function setup(canvas) {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(220, rect.width || 540), h = w;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0e1c2e'; ctx.fillRect(0, 0, w, h);
      return { ctx, w, h };
    }
    function frame(canvas, bounds) {
      const base = setup(canvas); if (!base) return null;
      const { ctx, w, h } = base, pad = 34;
      const x = n => pad + (n - bounds.xmin) / (bounds.xmax - bounds.xmin) * (w - 2 * pad);
      const y = n => h - pad - (n - bounds.ymin) / (bounds.ymax - bounds.ymin) * (h - 2 * pad);
      const unmap = (px, py) => [bounds.xmin + (px - pad) / (w - 2 * pad) * (bounds.xmax - bounds.xmin), bounds.ymin + (h - pad - py) / (h - 2 * pad) * (bounds.ymax - bounds.ymin)];
      const clip = fn => { ctx.save(); ctx.beginPath(); ctx.rect(pad, pad, w - 2 * pad, h - 2 * pad); ctx.clip(); fn(); ctx.restore(); };
      const line = (p, r, color, width = 1, dash = []) => { ctx.beginPath(); ctx.setLineDash(dash); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.moveTo(x(p[0]),y(p[1])); ctx.lineTo(x(r[0]),y(r[1])); ctx.stroke(); ctx.setLineDash([]); };
      const dot = (p, color, radius = 6) => { ctx.beginPath(); ctx.arc(x(p[0]),y(p[1]),radius,0,2*Math.PI); ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#0b1729';ctx.lineWidth=2;ctx.stroke(); };
      const label = (p, text, color, dx = 8, dy = -8) => { ctx.fillStyle=color;ctx.font='12px system-ui,sans-serif';ctx.fillText(text,x(p[0])+dx,y(p[1])+dy); };
      return { ...base, ...bounds, pad, x, y, unmap, clip, line, dot, label };
    }
    function niceStep(span) {
      const raw = span / 7, power = 10 ** Math.floor(Math.log10(raw)), t = raw / power;
      return (t <= 1 ? 1 : t <= 2 ? 2 : t <= 5 ? 5 : 10) * power;
    }
    function axes(f) {
      const { ctx, pad, w, h, x, y, xmin, xmax, ymin, ymax } = f;
      const dx = niceStep(xmax-xmin), dy = niceStep(ymax-ymin);
      ctx.font='11px system-ui,sans-serif';
      for (let k=Math.ceil(xmin/dx); k<=Math.floor(xmax/dx); k++) {
        const val=k*dx;
        f.line([val,ymin],[val,ymax],'#273b51');
        ctx.fillStyle='#a9bacb';ctx.textAlign='center';ctx.fillText(fmt(val),x(val),h-12);
      }
      for (let k=Math.ceil(ymin/dy); k<=Math.floor(ymax/dy); k++) {
        const val=k*dy;
        f.line([xmin,val],[xmax,val],'#273b51');
        ctx.fillStyle='#a9bacb';ctx.textAlign='right';ctx.fillText(fmt(val),pad-6,y(val)+4);
      }
      if (ymin<=0&&ymax>=0) f.line([xmin,0],[xmax,0],'#8298ae',1.5);
      if (xmin<=0&&xmax>=0) f.line([0,ymin],[0,ymax],'#8298ae',1.5);
      ctx.textAlign='left';ctx.fillStyle='#cedfee';ctx.fillText('x',w-19,h-12);ctx.fillText('y',10,18);
    }
    function arrow(f, p, color, label) {
      f.line([0,0],p,color,2.5);
      const {ctx,x,y}=f, px=x(p[0]),py=y(p[1]),ang=Math.atan2(py-y(0),px-x(0));
      if (Math.hypot(px-x(0),py-y(0))>5) {
        ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-9*Math.cos(ang-.45),py-9*Math.sin(ang-.45));ctx.lineTo(px-9*Math.cos(ang+.45),py-9*Math.sin(ang+.45));ctx.closePath();ctx.fillStyle=color;ctx.fill();
      }
      f.label(p,label,color);
    }
    function polygon(f, coords, fill, stroke, dash) {
      const {ctx,x,y}=f;ctx.beginPath();coords.forEach((p,i)=>i?ctx.lineTo(x(p[0]),y(p[1])):ctx.moveTo(x(p[0]),y(p[1])));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.setLineDash(dash||[]);ctx.stroke();ctx.setLineDash([]);
    }
    function fitMatrix() {
      const mapped=transform(a,v), corners=[[0,0],[1,0],[1,1],[0,1]].map(p=>transform(a,p));
      const max=Math.max(2, ...v.map(Math.abs),...mapped.map(Math.abs),...corners.flat().map(Math.abs));
      matrixRange=Math.max(2.5,max*1.3);
    }
    function drawMatrix() {
      const f=frame(mc,{xmin:-matrixRange,xmax:matrixRange,ymin:-matrixRange,ymax:matrixRange});if(!f)return;
      lastMatrixFrame=f; axes(f);
      f.clip(()=>{
        for(let i=-4;i<=4;i++) {
          f.line(transform(a,[i,-4]),transform(a,[i,4]),'rgba(99,232,222,.17)');
          f.line(transform(a,[-4,i]),transform(a,[4,i]),'rgba(99,232,222,.17)');
        }
        const square=[[0,0],[1,0],[1,1],[0,1]];
        polygon(f,square,'rgba(255,207,112,.05)','#ffcf70',[5,4]);
        polygon(f,square.map(p=>transform(a,p)),'rgba(99,232,222,.24)','#63e8de');
        arrow(f,[a[0],a[2]],'#ff98ce','Ae₁');arrow(f,[a[1],a[3]],'#a9b7ff','Ae₂');
        const av=transform(a,v);f.line([0,0],v,'#ffcf70',1.5,[4,3]);f.line([0,0],av,'#63e8de',2);
        f.dot(av,'#63e8de',7);f.label(av,'Av','#63e8de',8,15);f.dot(v,'#ffcf70',7);f.label(v,'v','#ffcf70');
      });
    }
    function updateMatrix(sync) {
      if(sync){$$('[data-gl-a]').forEach((el,i)=>el.value=fmt(a[i]));$$('[data-gl-v]').forEach((el,i)=>el.value=fmt(v[i]));}
      const av=transform(a,v), d=determinant(a), r=rank(a);
      const shape=r===0?'Point collapse':r===1?'Line collapse (numerical rank)':d<0?'Orientation reversed':'Orientation preserved';
      $('[data-gl-matrix-result]').innerHTML=`<strong>Av = (${fmt(av[0])}, ${fmt(av[1])})</strong><br>det A = ${fmt(d)} · mapped area = ${fmt(Math.abs(d))}<br>Rank ${r} of 2 · ${shape}<br><span class="gl-muted">x′ = ${fmt(a[0])}·${fmt(v[0])} + ${fmt(a[1])}·${fmt(v[1])}<br>y′ = ${fmt(a[2])}·${fmt(v[0])} + ${fmt(a[3])}·${fmt(v[1])}</span>`;
      const rows=[['Input point v',v],['Mapped point Av',av],['Mapped basis e₁',[a[0],a[2]]],['Mapped basis e₂',[a[1],a[3]]],['Square corner (0,0)',[0,0]],['Square corner (1,0)',[a[0],a[2]]],['Square corner (1,1)',[a[0]+a[1],a[2]+a[3]]],['Square corner (0,1)',[a[1],a[3]]]];
      $('[data-gl-matrix-table]').innerHTML=`<table><caption>Exact coordinate description of plotted objects (rounded for display)</caption><thead><tr><th scope="col">Object</th><th scope="col">x</th><th scope="col">y</th></tr></thead><tbody>${rows.map(row=>`<tr><th scope="row">${row[0]}</th><td>${fmt(row[1][0])}</td><td>${fmt(row[1][1])}</td></tr>`).join('')}</tbody></table>`;
      requestDraw();
    }
    function loadPreset(key) {
      const alt=q?missionAlt[key]:null;
      chosen=key;a=(alt&&alt.a||presets[key].a).slice();v=(alt&&alt.v||presets[key].v).slice();$('[data-gl-preset]').value=key;
      $('[data-gl-matrix-note]').textContent=alt?alt.note:presets[key].note;fitMatrix();updateMatrix(true);
    }
    function scatterDefaults(which) {
      mode=which==='constant'?'constant':'line';
      points=q?(which==='constant'?[[0,3],[1,5],[2,10]]:[[0,2],[1,2],[2,5]]):(which==='constant'?[[0,2],[1,4],[2,9]]:[[0,1],[1,2],[2,2]]);
      $('[data-gl-model]').value=mode;
      $('[data-gl-scatter-note]').textContent=q?'Practice readings, not the mission’s data. Edit the points to explore how the fit responds.':which==='constant'?'q20: the x positions label three readings. The constant model fits one voltage to all readings.':'q21: times 0, 1, 2 with readings 1, 2, 2. Fit an intercept and a slope.';
      fitScatter();pointRows();updateScatter();
    }
    function fitScatter() {
      const fit=leastSquares(points,mode), xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
      const xlo=Math.min(...xs), xhi=Math.max(...xs), xd=Math.max(2,xhi-xlo);
      let ymin=Math.min(...ys), ymax=Math.max(...ys);
      if(fit){const ends=[fit.intercept+fit.slope*xlo,fit.intercept+fit.slope*xhi];ymin=Math.min(ymin,...ends);ymax=Math.max(ymax,...ends);}
      const yd=Math.max(2,ymax-ymin);
      scatterRange={xmin:xlo-xd*.22,xmax:xhi+xd*.22,ymin:ymin-yd*.22,ymax:ymax+yd*.22};
    }
    function pointRows() {
      $('[data-gl-points]').innerHTML=points.map((p,i)=>`<tr><th scope="row">${i+1}</th><td><input type="number" min="-100" max="100" step="any" value="${fmt(p[0])}" data-gl-point="${i}" data-gl-coordinate="0" aria-label="Point ${i+1} x"></td><td><input type="number" min="-100" max="100" step="any" value="${fmt(p[1])}" data-gl-point="${i}" data-gl-coordinate="1" aria-label="Point ${i+1} observed y"></td><td><button type="button" data-gl-remove="${i}" aria-label="Remove point ${i+1}" ${points.length<=2?'disabled':''}>×</button></td></tr>`).join('');
    }
    function updateScatter() {
      const fit=leastSquares(points,mode);if(!fit)return;
      const formula=mode==='constant'?`ŷ = ${fmt(fit.intercept)}`:`ŷ = ${fmt(fit.intercept)} ${fit.slope<0?'−':'+'} ${fmt(Math.abs(fit.slope))}x`;
      $('[data-gl-fit-result]').innerHTML=`<strong>${formula}</strong><br>SSE = ${fmt(fit.sse)} · n = ${fit.n}<br><span class="gl-muted">Mean x = ${fmt(fit.meanX)} · mean y = ${fmt(fit.meanY)}${mode==='line'?`<br>Σ(x − x̄)² = ${fmt(fit.sxx)}<br>Σ(x − x̄)(y − ȳ) = ${fmt(fit.sxy)}`:''}</span>${!fit.identifiable?'<p><strong>No unique slope:</strong> all x values are identical. The horizontal mean line is one representative fit; move or edit an x value to identify a slope.</p>':''}`;
      $('[data-gl-residual-table]').innerHTML=`<table><caption>Observed-minus-fitted residuals; squared values sum to SSE</caption><thead><tr><th scope="col">Point</th><th scope="col">Fitted y</th><th scope="col">Residual</th><th scope="col">Residual²</th></tr></thead><tbody>${points.map((p,i)=>`<tr><th scope="row">${i+1}</th><td>${fmt(fit.intercept+fit.slope*p[0])}</td><td>${fmt(fit.residuals[i])}</td><td>${fmt(fit.residuals[i]**2)}</td></tr>`).join('')}</tbody></table>`;
      requestDraw();
    }
    function drawScatter() {
      const f=frame(sc,scatterRange);if(!f)return;lastScatterFrame=f;axes(f);
      const fit=leastSquares(points,mode);if(!fit)return;
      f.clip(()=>{
        f.line([f.xmin,fit.intercept+fit.slope*f.xmin],[f.xmax,fit.intercept+fit.slope*f.xmax],'#63e8de',3);
        points.forEach((p,i)=>{const yhat=fit.intercept+fit.slope*p[0];f.line(p,[p[0],yhat],'#ff98ce',2,[4,3]);f.dot(p,'#ffcf70',7);f.label(p,String(i+1),'#ffcf70');});
      });
    }
    function drawActive(){if(active==='matrix')drawMatrix();else drawScatter();}
    function selectTab(tab) {
      active=tab;$$('[data-gl-tab]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.glTab===tab)));$$('[data-gl-panel]').forEach(el=>el.hidden=el.dataset.glPanel!==tab);requestDraw();
    }
    function numeric(el) { return el.value.trim()!==''&&el.validity.valid&&finite(el.valueAsNumber)?el.valueAsNumber:null; }
    host.addEventListener('input',event=>{
      const el=event.target;
      if(el.matches('[data-gl-a]')){const n=numeric(el);if(n===null)return;a[+el.dataset.glA]=n;$('[data-gl-matrix-note]').textContent='Custom matrix: predict its action on the basis and point, then inspect the result.';updateMatrix(false);}
      else if(el.matches('[data-gl-v]')){const n=numeric(el);if(n===null)return;v[+el.dataset.glV]=n;updateMatrix(false);}
      else if(el.matches('[data-gl-point]')){const n=numeric(el);if(n===null)return;points[+el.dataset.glPoint][+el.dataset.glCoordinate]=n;updateScatter();}
    });
    host.addEventListener('change',event=>{
      const el=event.target;
      if(el.matches('[data-gl-preset]'))loadPreset(el.value);
      if(el.matches('[data-gl-model]')){mode=el.value;$('[data-gl-scatter-note]').textContent=mode==='line'?'Line model: both intercept and slope are optimized.':'Constant model: the mean minimizes the sum of squared vertical residuals.';fitScatter();updateScatter();}
    });
    host.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button||!host.contains(button))return;
      if(button.dataset.glTab)selectTab(button.dataset.glTab);
      if(button.dataset.glRemove!==undefined){const i=+button.dataset.glRemove;if(points.length>2){points.splice(i,1);pointRows();updateScatter();const next=$(`[data-gl-point="${Math.min(i,points.length-1)}"]`);if(next)next.focus();}return;}
      switch(button.dataset.glAction){
        case 'zoom-in':matrixRange=Math.max(.1,matrixRange/1.4);requestDraw();break;
        case 'zoom-out':matrixRange=Math.min(100000,matrixRange*1.4);requestDraw();break;
        case 'fit-matrix':fitMatrix();requestDraw();break;
        case 'reset-matrix':loadPreset(defaultPreset(q));break;
        case 'invert':{const inv=inverse(a);if(!inv){$('[data-gl-matrix-note]').textContent='No reliable inverse: this matrix is singular or numerically rank deficient. A line or point collapse cannot be undone.';break;}if(inv.some(n=>!finite(n)||Math.abs(n)>100)){$('[data-gl-matrix-note]').textContent='The inverse exceeds this lab’s editable range (−100 to 100). Try a better-conditioned matrix.';break;}a=inv;$('[data-gl-matrix-note]').textContent='Showing A⁻¹. It undoes the previous linear map; the input point itself is unchanged.';fitMatrix();updateMatrix(true);break;}
        case 'rotate':{const angle=numeric($('[data-gl-angle]'));if(angle===null){$('[data-gl-matrix-note]').textContent='Enter a rotation angle from −3600 to 3600 degrees.';break;}const r=angle*Math.PI/180,clean=n=>Math.abs(n)<1e-14?0:n;a=[clean(Math.cos(r)),-clean(Math.sin(r)),clean(Math.sin(r)),clean(Math.cos(r))];$('[data-gl-matrix-note]').textContent=`Rotation by ${fmt(angle)}° counterclockwise. Distances and area are preserved.`;fitMatrix();updateMatrix(true);break;}
        case 'fit-scatter':fitScatter();updateScatter();break;
        case 'add-point':if(points.length>=12){$('[data-gl-scatter-note]').textContent='This workshop supports up to 12 observations.';break;}points.push([Math.min(100,points[points.length-1][0]+1),leastSquares(points,mode).meanY]);fitScatter();pointRows();updateScatter();$(`[data-gl-point="${points.length-1}"]`).focus();break;
        case 'sample-constant':scatterDefaults('constant');break;
        case 'sample-line':scatterDefaults('line');break;
        case 'reset-scatter':scatterDefaults(q&&q.id==='q20'?'constant':'line');break;
      }
    });
    function localPointer(canvas,event){const rect=canvas.getBoundingClientRect();return [event.clientX-rect.left,event.clientY-rect.top];}
    function attachDrag(canvas,isMatrix){
      let dragging=null,pointer=null;
      canvas.addEventListener('pointerdown',e=>{
        const f=isMatrix?lastMatrixFrame:lastScatterFrame;if(!f)return;
        const p=localPointer(canvas,e), candidates=isMatrix?[v]:points;
        let best=30,index=-1;
        candidates.forEach((val,i)=>{const d=Math.hypot(f.x(val[0])-p[0],f.y(val[1])-p[1]);if(d<best){best=d;index=i;}});
        if(index<0)return;
        e.preventDefault();dragging=index;pointer=e.pointerId;canvas.setPointerCapture(e.pointerId);
      });
      canvas.addEventListener('pointermove',e=>{
        if(dragging===null||e.pointerId!==pointer)return;
        const f=isMatrix?lastMatrixFrame:lastScatterFrame,p=localPointer(canvas,e),data=f.unmap(p[0],p[1]).map(n=>Math.max(-100,Math.min(100,Math.round(n*100)/100)));
        if(isMatrix){v=data;updateMatrix(true);}else{points[dragging]=data;$$(`[data-gl-point="${dragging}"]`).forEach(el=>el.value=fmt(data[+el.dataset.glCoordinate]));updateScatter();}
      });
      const finish=e=>{if(e.pointerId===pointer){dragging=null;pointer=null;}};
      canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);canvas.addEventListener('lostpointercapture',()=>{dragging=null;pointer=null;});
    }
    attachDrag(mc,true);attachDrag(sc,false);
    mc.addEventListener('keydown',e=>{
      const directions={ArrowLeft:[-.25,0],ArrowRight:[.25,0],ArrowUp:[0,.25],ArrowDown:[0,-.25]};const d=directions[e.key];if(!d)return;e.preventDefault();v=v.map((n,i)=>Math.max(-100,Math.min(100,n+d[i])));updateMatrix(true);
    });
    if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(()=>{if(!host.isConnected){ro.disconnect();return;}requestDraw();});ro.observe(host);}
    loadPreset(chosen);scatterDefaults(q&&q.id==='q20'?'constant':'line');selectTab(active);
    return { destroy() { host.dataset.glMounted=''; }, getState() { return { matrix:a.slice(),vector:v.slice(),points:points.map(p=>p.slice()),mode }; } };
  }
  const api={html,mount,math:{determinant,transform,rank,inverse,leastSquares},presets};
  window.Graph2D=api;window.GraphLab=api;
})();
