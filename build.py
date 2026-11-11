#!/usr/bin/env python3
"""Build the static pages of giovannicallahan.github.io from one shared header and footer.

Run from the repository root:  python3 build.py
Edit the copy in this file, then re-run; the .html files are generated.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SITE = "https://giovannicallahan.github.io"
NEUROAPP = "https://giovannicallahan.github.io/neuroapp/"
COGVIZ = "https://cogviz-research-studio.streamlit.app/"
GITHUB = "https://github.com/giovannicallahan"

CSP = ("default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; "
       "font-src 'self'; connect-src https://formspree.io; form-action https://formspree.io; "
       "object-src 'none'; base-uri 'none'")

MARK = ('<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11.5" fill="none" '
        'stroke="currentColor" stroke-width="1.6"/><path d="M4.5 18.5 C10 18.5, 9.5 7.5, 21.5 7.5" fill="none" '
        'stroke="#14a3a1" stroke-width="2.2" stroke-linecap="round"/><path d="M13 1.5v3M13 21.5v3M1.5 13h3M21.5 13h3" '
        'stroke="currentColor" stroke-width="1.6"/></svg>')

NAV = [("Home", "/"), ("NeuroApp", "/projects/neuroapp.html"), ("CogViz", "/projects/cogviz.html"),
       ("Contact", "/contact.html"), ("Feedback", "/feedback.html")]

EXT = 'rel="noopener noreferrer" target="_blank"'


def page(path, title, description, body, active=None, theme="", og_image="/img/og-home.png"):
    nav = "\n".join(
        f'      <li><a href="{href}"{" aria-current=\"page\"" if label == active else ""}>{label}</a></li>'
        for label, href in NAV)
    canonical = SITE + ("/" if path == "index.html" else "/" + path)
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="{CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}{og_image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="{'#10153a' if theme == 'neuro' else '#eef3f2'}">
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/instrument-sans-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css">
<script src="/js/site.js" defer></script>
</head>
<body{f' class="{theme}"' if theme else ''}>
<a class="skip" href="#main">Skip to content</a>
<header class="site-nav">
  <nav class="wrap" aria-label="Main">
    <a class="wordmark" href="/">{MARK}Giovanni Callahan</a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <ul class="nav-links" id="nav-links">
{nav}
    </ul>
  </nav>
</header>
<main id="main">
{body}
</main>
<footer class="site-foot">
  <div class="wrap">
    <p>© 2026 Giovanni Callahan. This site uses no cookies or trackers.</p>
    <ul>
      <li><a href="{GITHUB}" {EXT}>GitHub</a></li>
      <li><a href="/contact.html">Contact</a></li>
      <li><a href="/feedback.html">Feedback</a></li>
    </ul>
  </div>
</footer>
</body>
</html>
"""
    out = ROOT / path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print("wrote", path)


# ── Home ─────────────────────────────────────────────────────────────────────
page("index.html", "Giovanni Callahan — psychology, decisions and the brain",
     "Psychology student at Arizona State University and Marine Corps veteran. I study how people decide where to spend effort, and I build free tools for learning about the brain and planning experiments.",
     active="Home", body=f"""
<section class="hero">
  <div class="wrap">
    <h1>Giovanni Callahan</h1>
    <p class="lede">Psychology student at Arizona State University and Marine Corps veteran. I study how
    people decide where to spend mental and physical effort, and I build free tools for learning about the
    brain and planning experiments.</p>
    <div class="actions">
      <a class="btn btn-primary" href="#apps">See my apps</a>
      <a class="btn btn-ghost" href="/contact.html">Get in touch</a>
    </div>
    <figure class="plot">
      <canvas id="calibration" role="img" aria-label="Animated plot: a noisy signal settles, trial results accumulate into proportions at nine stimulus strengths, and an S-shaped psychometric curve is fitted through them, marking the detection threshold."></canvas>
      <figcaption>
        <span>A noisy signal becomes data, and data becomes a model. Each run is freshly simulated.</span>
        <ol class="stage-list" aria-hidden="true">
          <li data-stage>Signal</li><li data-stage>Data</li><li data-stage>Model</li>
        </ol>
      </figcaption>
    </figure>
  </div>
</section>

<section class="section" id="about" aria-labelledby="about-h">
  <div class="wrap about">
    <div>
      <h2 id="about-h">About me</h2>
      <p>From 2017 to 2022 I served in the U.S. Marine Corps as a Navigational Aids Technician. My team set
      up, aligned and calibrated navigation systems in demanding conditions, and as an instructor I trained
      other Marines to do the same. That work was about turning noisy signals into readings you can trust.
      Psychology asks a version of the same question about people.</p>
      <p>Now I study psychology at Arizona State University, where I hold a 4.0 GPA and expect to finish my
      B.S. in spring 2027. I will be the first person in my family to earn a bachelor's degree.</p>
      <p>As an undergraduate researcher in Dr. Iman Feghhi's lab, I lead the development of a study on what
      happens when people face cognitive and physical demands at the same time. I programmed the experiment
      in PsychoPy and help train the research assistants who run it.</p>
      <p>I am working toward a Ph.D. in cognitive or computational neuroscience, and I am looking for research
      assistant and post-baccalaureate positions that begin in 2027.</p>
    </div>
    <dl class="facts">
      <div><dt>Studying</dt><dd>B.S. Psychology, Arizona State University (expected 2027)</dd></div>
      <div><dt>Research</dt><dd>Combined cognitive and physical load, Feghhi lab</dd></div>
      <div><dt>Before</dt><dd>U.S. Marine Corps, 2017–2022; Navigational Aids Technician and instructor</dd></div>
      <div><dt>Tools</dt><dd>Python, pandas, SciPy, statsmodels, matplotlib, PsychoPy</dd></div>
      <div><dt>Interests</dt><dd><ul class="tags">
        <li>Decision-making</li><li>Resource rationality</li><li>Effort</li>
        <li>Perception and action</li><li>Computational models</li><li>Neural networks</li></ul></dd></div>
    </dl>
  </div>
</section>

<section class="section" id="apps" aria-labelledby="apps-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="apps-h">Apps I've built</h2>
      <p>Both are free, run in a web browser and work on phones.</p>
    </div>
    <div class="apps">
      <article class="app-row neuro">
        <div class="copy">
          <h3>NeuroApp</h3>
          <p>A 3D atlas of the human brain. Spin it, slice it and tap any of 300+ structures to see what it
          does, then quiz yourself until the names stick.</p>
          <div class="actions">
            <a class="btn btn-primary" href="{NEUROAPP}">Open NeuroApp</a>
            <a class="btn btn-ghost" href="/projects/neuroapp.html">How it works</a>
          </div>
        </div>
        <div class="visual"><img src="/img/brain-oblique.webp" width="900" height="603" alt="Colour-coded 3D model of the human brain from NeuroApp" loading="lazy"></div>
      </article>
      <article class="app-row paper">
        <div class="copy">
          <h3>CogViz Research Studio</h3>
          <p>A planner for psychology experiments. Choose a design, plan the analysis, simulate the data your
          prediction implies and export a preregistration draft.</p>
          <div class="actions">
            <a class="btn btn-primary" href="{COGVIZ}" {EXT}>Open CogViz</a>
            <a class="btn btn-ghost" href="/projects/cogviz.html">How it works</a>
          </div>
          <p class="note">CogViz is hosted free on Streamlit. If nobody has used it for a while, it can take
          about a minute to wake up.</p>
        </div>
        <div class="visual"><canvas class="power" role="img" aria-label="Animated power curve: dots show simulated detection rates for growing sample sizes, and a curve through them crosses the 80 percent line."></canvas></div>
      </article>
    </div>
  </div>
</section>
""")

# ── NeuroApp ─────────────────────────────────────────────────────────────────
page("projects/neuroapp.html", "NeuroApp — explore the human brain in 3D",
     "A free 3D brain atlas that runs in your browser: spin and slice the brain, tap any of 300+ structures to learn what it does, and quiz yourself with spaced review.",
     active="NeuroApp", theme="neuro", og_image="/img/og-neuroapp.png", body=f"""
<section class="page-hero">
  <div class="wrap split">
    <div>
      <h1>NeuroApp</h1>
      <p class="lede">Explore the human brain in 3D, right in your browser. Tap a structure to see what it
      does and what it connects to, then quiz yourself until the names stick.</p>
      <div class="actions">
        <a class="btn btn-primary" href="{NEUROAPP}">Open NeuroApp</a>
        <a class="btn btn-ghost" href="{NEUROAPP}atlas-viewer.html?start=tour">Take the 5-minute tour</a>
      </div>
      <p class="note">Free. No account. Works on a phone.</p>
    </div>
    <div class="brain-shot"><img src="/img/brain-oblique.webp" width="900" height="603" alt="Colour-coded 3D model of the human brain, seen from the left and slightly above"></div>
  </div>
</section>

<section class="section" aria-labelledby="raster-h">
  <div class="wrap">
    <h2 id="raster-h">How a brain signals</h2>
    <figure class="raster">
      <canvas id="raster" role="img" aria-label="Animated spike raster: rows of tick marks show model neurons firing; at each stimulus, highlighted in cyan, most neurons fire together."></canvas>
      <figcaption>Each row is a model neuron and each tick is a spike. Most of the time the neurons fire at
      random; when a stimulus arrives (the cyan band), many fire together. This is a simulation for
      illustration, not recorded data.</figcaption>
    </figure>
  </div>
</section>

<section class="section" aria-labelledby="what-h">
  <div class="wrap split">
    <div>
      <h2 id="what-h">What you can do</h2>
      <ul class="feature-list">
        <li><strong>Explore in 3D</strong><span>Rotate, zoom and cut through the brain on three planes. Isolate any region to see it alone.</span></li>
        <li><strong>Drill into the parts</strong><span>Open a region such as the thalamus and step into each of its nuclei, with what each one does.</span></li>
        <li><strong>Learn at your level</strong><span>Beginner and expert lessons for each structure, with every claim linked to its source.</span></li>
        <li><strong>Practice that sticks</strong><span>Find-it and name-it quizzes with spaced review bring back what you are about to forget.</span></li>
        <li><strong>Use it anywhere</strong><span>On a phone the panel becomes a sheet you drag up; one finger rotates, two fingers zoom.</span></li>
      </ul>
    </div>
    <div><img class="phone-shot" src="/img/neuroapp-phone.webp" width="390" height="664" alt="NeuroApp on a phone: the brain at the top and a structure page for the left superior frontal gyrus in a sheet below" loading="lazy"></div>
  </div>
</section>

<section class="section" aria-labelledby="made-h">
  <div class="wrap">
    <h2 id="made-h">How it's made</h2>
    <ul class="feature-list">
      <li><strong>Real anatomy</strong><span>The 3D models come from the SPL/NAC Brain Atlas (Halle et al., 2017). A Python and VTK pipeline converts its 359 source files into 328 web-ready models.</span></li>
      <li><strong>Cited lessons</strong><span>Every point in a lesson links to its source, mostly peer-reviewed StatPearls chapters and OpenStax textbooks.</span></li>
      <li><strong>Learning science</strong><span>Quizzes use retrieval practice and a Leitner spaced-review schedule, and they ask how confident you were.</span></li>
      <li><strong>Private by design</strong><span>No accounts, cookies or trackers. Your progress stays in your own browser.</span></li>
      <li><strong>Open source</strong><span>Built with AI assistance. The source is <a href="https://github.com/giovannicallahan/neuroapp" {EXT}>open on GitHub</a>.</span></li>
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="share-n">
  <div class="wrap">
    <h2 id="share-n">Share it</h2>
    <div class="share">
      <img src="/img/qr-brain.svg" width="132" height="132" alt="QR code that opens NeuroApp">
      <div>
        <p>Scan the code with a phone camera, or share the short link:</p>
        <p><code>giovannicallahan.github.io/brain</code> <button class="btn btn-ghost copy-btn" data-copy="https://giovannicallahan.github.io/brain/">Copy link</button></p>
      </div>
    </div>
  </div>
</section>
""")

# ── CogViz ───────────────────────────────────────────────────────────────────
page("projects/cogviz.html", "CogViz Research Studio — plan psychology experiments",
     "A free browser-based planner for psychology experiments: compare designs, plan analyses, simulate what a prediction implies and export a preregistration draft.",
     active="CogViz", og_image="/img/og-cogviz.png", body=f"""
<section class="page-hero">
  <div class="wrap split">
    <div>
      <h1>CogViz Research Studio</h1>
      <p class="lede">A planner for psychology experiments. Compare research designs, plan the analysis,
      see what your prediction implies and export the whole plan.</p>
      <div class="actions">
        <a class="btn btn-primary" href="{COGVIZ}" {EXT}>Open CogViz</a>
        <a class="btn btn-ghost" href="#steps">See the steps</a>
      </div>
      <p class="note">Hosted free on Streamlit. If nobody has used it for a while, it can take about a minute
      to wake up.</p>
    </div>
    <figure class="plot flush">
      <canvas class="power" role="img" aria-label="Animated power curve: dots show the share of simulated studies that detect an effect at each sample size, and a curve through them crosses the 80 percent line."></canvas>
      <figcaption><span>Simulation-based power: the share of simulated studies of each size that detect an
      effect of d = 0.5. An illustration of one CogViz tool.</span></figcaption>
    </figure>
  </div>
</section>

<section class="section" id="steps" aria-labelledby="steps-h">
  <div class="wrap">
    <div class="section-head"><h2 id="steps-h">Five steps from question to plan</h2>
      <p>A check mark appears on each step once it holds what the next step needs.</p></div>
    <ol class="steps">
      <li><strong>Question</strong><span>State what you want to find out. A worked example fills every field if you want to see one first.</span></li>
      <li><strong>Design</strong><span>Compare designs side by side, with what each gains and costs.</span></li>
      <li><strong>Analysis</strong><span>Plan the test, and check it fits your variables.</span></li>
      <li><strong>Predictions</strong><span>Simulate data from your predicted means and estimate power.</span></li>
      <li><strong>Plan</strong><span>Export a Markdown plan and a preregistration draft.</span></li>
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="feat-h">
  <div class="wrap">
    <h2 id="feat-h">What's inside</h2>
    <ul class="feature-list">
      <li><strong>Power by simulation</strong><span>From predicted means, a spread and a sample size, CogViz simulates 1,000 studies and reports how often the test reaches p &lt; .05 (Lakens &amp; Caldwell, 2021).</span></li>
      <li><strong>Preregistration draft</strong><span>The plan follows the section order of the OSF Preregistration template, with every missing field marked "To complete".</span></li>
      <li><strong>Sources you can check</strong><span>Each built-in design, analysis and model cites the work it comes from, in APA 7 style with DOI links.</span></li>
      <li><strong>A model library</strong><span>21 models of perception, choice, response time, effort, learning and memory, including signal detection and the drift-diffusion model.</span></li>
      <li><strong>A plan check</strong><span>Each step flags gaps and mismatches, such as a binary outcome paired with a t-test.</span></li>
      <li><strong>Your files, not a server's</strong><span>Save the study as a small file and open it later; the server stores nothing.</span></li>
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="share-c">
  <div class="wrap">
    <h2 id="share-c">Share it</h2>
    <div class="share">
      <img src="/img/qr-cogviz.svg" width="132" height="132" alt="QR code that opens CogViz Research Studio">
      <div>
        <p>Scan the code with a phone camera, or share the short link:</p>
        <p><code>giovannicallahan.github.io/cogviz</code> <button class="btn btn-ghost copy-btn" data-copy="https://giovannicallahan.github.io/cogviz/">Copy link</button></p>
      </div>
    </div>
  </div>
</section>
""")

# ── Contact ──────────────────────────────────────────────────────────────────
page("contact.html", "Contact — Giovanni Callahan",
     "Send Giovanni Callahan a message about research, opportunities, his apps, or just to say hello.",
     active="Contact", body="""
<section class="page-hero">
  <div class="wrap contact-grid">
    <div>
      <h1>Say hello</h1>
      <p class="lede">A question about my research or apps, an opportunity, or just a hello: send a message and
      I'll reply by email.</p>
      <form class="form" data-form="contact" novalidate>
        <input type="hidden" name="_subject" value="New message from your website">
        <div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="c-email">Your email</label><p class="hint" id="c-email-hint">Used only to reply to you.</p>
          <input id="c-email" name="email" type="email" autocomplete="email" aria-describedby="c-email-hint" required></div>
        <fieldset class="field"><legend>What is it about?</legend>
          <div class="choices">
            <label><input type="radio" name="topic" value="Research or lab opportunity" required> Research or a lab opportunity</label>
            <label><input type="radio" name="topic" value="Question about an app"> A question about an app</label>
            <label><input type="radio" name="topic" value="Collaboration"> Working together</label>
            <label><input type="radio" name="topic" value="Hello"> Just saying hello</label>
            <label><input type="radio" name="topic" value="Other"> Something else</label>
          </div></fieldset>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required></textarea></div>
        <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
        <p class="status-msg" role="status" hidden></p>
        <div><button class="btn btn-primary" type="submit">Send message</button></div>
      </form>
    </div>
    <aside class="aside-box">
      <h2 class="h-small">Other ways</h2>
      <ul>
        <li>Code and projects: <a href="https://github.com/giovannicallahan" rel="noopener noreferrer" target="_blank">GitHub</a></li>
        <li>Found a bug or have an idea for an app? Use the <a href="/feedback.html">feedback form</a>.</li>
      </ul>
      <p class="note">Messages go to my inbox through Formspree, a form service. Your address is used only so I
      can reply.</p>
    </aside>
  </div>
</section>
""")

# ── Feedback ─────────────────────────────────────────────────────────────────
page("feedback.html", "Feedback — Giovanni Callahan",
     "Tell Giovanni Callahan what works and what gets in your way in NeuroApp, CogViz or this website.",
     active="Feedback", body="""
<section class="page-hero">
  <div class="wrap contact-grid">
    <div>
      <h1>Feedback</h1>
      <p class="lede">Found a bug, got stuck, or have an idea? Tell me what happened. Every note gets read,
      and the apps change because of them.</p>
      <form class="form" data-form="feedback" novalidate>
        <input type="hidden" name="_subject" value="New feedback from your website">
        <fieldset class="field"><legend>Which one is it about?</legend>
          <div class="choices">
            <label><input type="radio" name="app" value="NeuroApp" required> NeuroApp</label>
            <label><input type="radio" name="app" value="CogViz"> CogViz</label>
            <label><input type="radio" name="app" value="Website"> This website</label>
          </div></fieldset>
        <fieldset class="field"><legend>How was it to use?</legend>
          <div class="choices scale">
            <label><input type="radio" name="rating" value="1"><b>1</b>Frustrating</label>
            <label><input type="radio" name="rating" value="2"><b>2</b></label>
            <label><input type="radio" name="rating" value="3"><b>3</b>Okay</label>
            <label><input type="radio" name="rating" value="4"><b>4</b></label>
            <label><input type="radio" name="rating" value="5"><b>5</b>Great</label>
          </div></fieldset>
        <div class="field"><label for="f-bad">What got in your way?</label><p class="hint" id="f-bad-hint">Describe what you tried and what happened instead.</p>
          <textarea id="f-bad" name="problem" aria-describedby="f-bad-hint"></textarea></div>
        <div class="field"><label for="f-good">What worked well, or what would you add?</label><textarea id="f-good" name="ideas"></textarea></div>
        <div class="field"><label for="f-device">What were you using?</label>
          <select id="f-device" name="device"><option value="">Choose one</option><option>Phone</option><option>Tablet</option><option>Laptop or desktop</option></select></div>
        <div class="field"><label for="f-email">Your email (optional)</label><p class="hint" id="f-email-hint">Add it only if you would like a reply.</p>
          <input id="f-email" name="email" type="email" autocomplete="email" aria-describedby="f-email-hint"></div>
        <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
        <p class="status-msg" role="status" hidden></p>
        <div><button class="btn btn-primary" type="submit">Send feedback</button></div>
      </form>
    </div>
    <aside class="aside-box">
      <h2 class="h-small">Helpful details</h2>
      <ul>
        <li>The page or structure you were on</li>
        <li>What you expected, and what you saw</li>
        <li>For NeuroApp, whether it happened on a phone or a computer</li>
      </ul>
      <p class="note">Want a conversation instead? <a href="/contact.html">Send a message</a>.</p>
    </aside>
  </div>
</section>
""")

# ── 404 ──────────────────────────────────────────────────────────────────────
page("404.html", "Page not found — Giovanni Callahan", "This page does not exist.", body="""
<section class="lost">
  <div class="wrap">
    <h1>This page doesn't exist</h1>
    <p class="lede">The link may be mistyped or out of date. These are the places you can go from here:</p>
    <div class="actions">
      <a class="btn btn-primary" href="/">Go to the home page</a>
      <a class="btn btn-ghost" href="https://giovannicallahan.github.io/neuroapp/">Open NeuroApp</a>
      <a class="btn btn-ghost" href="/projects/cogviz.html">About CogViz</a>
    </div>
  </div>
</section>
""")


# ── Short links ──────────────────────────────────────────────────────────────
def redirect(path, target, label):
    (ROOT / path).parent.mkdir(parents=True, exist_ok=True)
    (ROOT / path).write_text(f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0; url={target}">
<link rel="canonical" href="{target}">
<title>Opening {label}</title></head>
<body style="font-family:system-ui,sans-serif;background:#eef3f2;color:#13233a;padding:2rem">
<p>Opening {label}. If nothing happens, <a href="{target}">open {label}</a>.</p>
</body></html>
""", encoding="utf-8")
    print("wrote", path)


redirect("brain/index.html", NEUROAPP, "NeuroApp")
redirect("cogviz/index.html", COGVIZ, "CogViz Research Studio")

(ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
urls = ["/", "/projects/neuroapp.html", "/projects/cogviz.html", "/contact.html", "/feedback.html"]
(ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                                  + "".join(f"  <url><loc>{SITE}{u}</loc></url>\n" for u in urls) + "</urlset>\n")
print("wrote robots.txt, sitemap.xml")
