#!/usr/bin/env python3
"""Build the static pages of giovannicallahan.github.io from one shared header and footer.

Run from the repository root:  python3 build.py
Edit the copy in this file, then re-run; the .html files are generated.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SITE = "https://giovannicallahan.github.io"
NEUROAPP = "https://gyrafold.com/"
COGVIZ = "https://cogviz-research-studio.streamlit.app/"
GITHUB = "https://github.com/giovannicallahan"

CSP = ("default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; "
       "font-src 'self'; connect-src https://formspree.io; form-action 'self' https://formspree.io; "
       "object-src 'none'; base-uri 'none'")

MARK = ('<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11.5" fill="none" '
        'stroke="currentColor" stroke-width="1.6"/><path d="M4.5 18.5 C10 18.5, 9.5 7.5, 21.5 7.5" fill="none" '
        'stroke="#14a3a1" stroke-width="2.2" stroke-linecap="round"/><path d="M13 1.5v3M13 21.5v3M1.5 13h3M21.5 13h3" '
        'stroke="currentColor" stroke-width="1.6"/></svg>')

NAV = [("Experiment", "/experiment.html"), ("Tools", "/projects/"), ("About", "/about.html"),
       ("CV", "/Giovanni_Callahan_CV.pdf"), ("Contact", "/contact.html")]

# One line under each tool page, so feedback sits with the tools and not in the site footer.
TOOL_FEEDBACK = """
<section class="tool-feedback">
  <div class="wrap">
    <p>Found a bug or have an idea for a tool? <a href="/feedback.html">Send feedback</a>.</p>
  </div>
</section>"""

# The four pieces of work shown on the home page and (tools only) on the Tools page.
WORK = [
    ("experiment", "/experiment.html", "Which one is the best value?",
     "My current experiment asks when people stop weighing their options and reach for a rule of thumb.",
     "Study in development. No results yet.", ["Behavioral experiment", "Runs in the browser"],
     "An example trial: four pasta brands with a price and a quality score each"),
    ("gyrafold", "/projects/gyrafold.html", "Gyrafold",
     "A 3D atlas of 300+ brain structures. Tap a structure to see what it does, then quiz yourself.",
     "", ["3D atlas", "Free, no account"],
     "Colour-coded 3D model of the human brain"),
    ("cogviz", "/projects/cogviz.html", "CogViz Research Studio",
     "A planner for psychology experiments: compare designs, plan the analysis and export the plan.",
     "", ["Python", "Streamlit"],
     "CogViz Research Studio preview"),
    ("vector-guild", "/projects/vector-guild.html", "Vector Guild",
     "A linear algebra game. Work through 68 engineering missions and build an outpost as you solve them.",
     "", ["JavaScript", "Free, no account"],
     "Vector Guild campaign screen"),
]


def work_cards(keys):
    out = []
    for key, href, name, text, status, tags, alt in WORK:
        if key not in keys:
            continue
        tag_html = "".join(f"<li>{t}</li>" for t in tags)
        status_html = f'\n      <p class="work-status">{status}</p>' if status else ""
        out.append(f"""    <li class="work-card">
      <a href="{href}"><img src="/img/work-{key}.webp" width="800" height="500" loading="lazy" alt="{alt}"></a>
      <h3><a href="{href}">{name}</a></h3>
      <p>{text}</p>{status_html}
      <ul class="tags">{tag_html}</ul>
    </li>""")
    return "\n".join(out)

EXT = 'rel="noopener noreferrer" target="_blank"'


def page(path, title, description, body, active=None, theme="", og_image="/img/og-home.png", feedback=False):
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
<meta name="theme-color" content="{'#10153a' if theme == 'neuro' else '#071523'}">
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/instrument-sans-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>
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
{body}{TOOL_FEEDBACK if feedback else ""}
</main>
<footer class="site-foot">
  <div class="wrap">
    <p>© 2026 Giovanni Callahan. This site uses no cookies or trackers.</p>
    <ul>
      <li><a href="{GITHUB}" {EXT}>GitHub</a></li>
      <li><a href="/contact.html">Contact</a></li>
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
     "Undergraduate researcher in the Feghhi Lab at Arizona State University and Marine Corps veteran. I study how people decide where to spend effort, and I build free tools for research and learning.",
     body=f"""
<section class="hero hero-portrait">
  <div class="wrap">
    <div class="hero-copy">
      <h1><em>Researcher.</em> Marine veteran. Builder of research and learning tools.</h1>
      <p class="affil">Undergraduate researcher in the Feghhi Lab at Arizona State University</p>
      <p class="lede">I study how people decide where to spend mental and physical effort. I build free
      tools for research and learning: a 3D atlas of <strong>300+ brain structures</strong>, a planner for
      psychology experiments, and a linear algebra game with <strong>68 missions</strong>.</p>
      <p class="ask">I am looking for research assistant and post-baccalaureate positions that begin in 2027.</p>
      <div class="actions">
        <a class="btn btn-primary" href="/experiment.html">See my current research</a>
        <a class="btn btn-ghost" href="/Giovanni_Callahan_CV.pdf">Download my CV</a>
      </div>
    </div>
    <div class="portrait" role="img" aria-label="Portrait of Giovanni Callahan"></div>
  </div>
</section>

<section class="section" aria-labelledby="work-h">
  <div class="wrap">
    <h2 id="work-h">Selected work</h2>
    <ul class="work">
{work_cards(("experiment", "gyrafold", "cogviz", "vector-guild"))}
    </ul>
  </div>
</section>
""")

# ── Tools (index of the three tools) ─────────────────────────────────────────
page("projects/index.html", "Tools — Giovanni Callahan",
     "Three free tools I built for research and learning: a 3D brain atlas, a planner for psychology experiments, and a linear algebra game.",
     active="Tools", feedback=True, body=f"""
<section class="page-hero">
  <div class="wrap">
    <h1>Tools</h1>
    <p class="lede">Three free tools I built for research and learning. Each runs in a browser, with no account.</p>
    <ul class="work work-3">
{work_cards(("gyrafold", "cogviz", "vector-guild"))}
    </ul>
  </div>
</section>
""")

# ── About ────────────────────────────────────────────────────────────────────
page("about.html", "About — Giovanni Callahan",
     "Marine Corps veteran and psychology student at Arizona State University, studying decisions under cognitive and physical demand.",
     active="About", body="""
<section class="about-hero">
  <div class="wrap">
    <div>
      <h1>I spent five years making instruments tell the truth. Now I study how people decide.</h1>
      <p class="lede">I'm Giovanni Callahan, a Marine Corps veteran and psychology student at Arizona State
      University. I am looking for research assistant and post-baccalaureate positions that begin in 2027.</p>
      <div class="actions">
        <a class="btn btn-primary" href="/Giovanni_Callahan_CV.pdf">Download my CV</a>
        <a class="btn btn-ghost" href="/contact.html">Get in touch</a>
      </div>
    </div>
    <dl class="glance" aria-label="At a glance">
      <div><dt>Degree</dt><dd>B.S. Psychology, Arizona State University, expected spring 2027</dd></div>
      <div><dt>GPA</dt><dd>4.0</dd></div>
      <div><dt>Research</dt><dd>Feghhi lab: decisions under cognitive and physical demand</dd></div>
      <div><dt>Service</dt><dd>U.S. Marine Corps, 2017–2022</dd></div>
      <div><dt>Goal</dt><dd>Ph.D. in cognitive or computational neuroscience</dd></div>
    </dl>
  </div>
</section>

<section class="section" aria-labelledby="path-h">
  <div class="wrap">
    <div class="section-head"><h2 id="path-h">How I got here</h2></div>
    <ol class="timeline">
      <li>
        <p class="when">2017–2022</p>
        <div>
          <h3>U.S. Marine Corps</h3>
          <p>I served as a Navigational Aids Technician. My team set up, aligned and calibrated navigation
          systems in demanding conditions, and as an instructor I trained other Marines to do the same.
          That work was about turning noisy signals into readings you can trust.</p>
        </div>
      </li>
      <li>
        <p class="when">Now</p>
        <div>
          <h3>Psychology at Arizona State University</h3>
          <p>Psychology asks a version of the same question about people. I hold a 4.0 GPA and will be the
          first person in my family to earn a bachelor's degree.</p>
        </div>
      </li>
      <li>
        <p class="when">Now</p>
        <div>
          <h3>Research in Dr. Iman Feghhi's lab</h3>
          <p>I lead the development of a study on what happens when people face cognitive and physical
          demands at the same time. I programmed the experiment in PsychoPy and help train the research
          assistants who run it. <a href="/experiment.html">See the online version.</a></p>
        </div>
      </li>
      <li>
        <p class="when">2027</p>
        <div>
          <h3>What comes next</h3>
          <p>A research assistant or post-baccalaureate position, on the way to a Ph.D. in cognitive or
          computational neuroscience.</p>
        </div>
      </li>
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="work-h">
  <div class="wrap about-cols">
    <div>
      <h2 id="work-h">What I'm interested in</h2>
      <ul class="tags">
        <li>Decision-making</li><li>Resource rationality</li><li>Effort</li>
        <li>Perception and action</li><li>Computational models</li><li>Neural networks</li></ul>
    </div>
    <div>
      <h2>What I work with</h2>
      <ul class="tags">
        <li>Python</li><li>pandas</li><li>SciPy</li><li>statsmodels</li><li>matplotlib</li><li>PsychoPy</li></ul>
    </div>
  </div>
</section>
""")

# ── Experiment (introduction; the task itself is /study/) ────────────────────
page("experiment.html", "Experiment — which one is the best value?",
     "An online decision experiment: pick the best-value brand of an everyday product while holding a few digits or a pattern in mind. About 15 minutes in your browser.",
     active="Experiment", body="""
<section class="page-hero">
  <div class="wrap split">
    <div>
      <h1>Which one is the best value?</h1>
      <p class="lede">My current experiment asks when people stop weighing their options and reach for a
      rule of thumb. You pick the best value among four brands of an everyday product, such as pasta, bread or laundry detergent, while holding something in mind: a few digits, a string of letters, or a pattern of squares.</p>
      <form class="version-form" action="/study/" method="get">
        <div class="field"><label for="v-type">Version</label>
          <select id="v-type" name="version">
            <option value="A">Number memory, household products</option>
            <option value="B">Pattern memory, food products</option>
            <option value="C">Letter memory, other everyday goods</option>
          </select></div>
        <div class="field"><label for="v-limit">Time limit per choice</label>
          <select id="v-limit" name="limit">
            <option value="4">4 seconds</option><option value="6">6 seconds</option><option value="8">8 seconds</option>
            <option value="12" selected>12 seconds</option><option value="20">20 seconds</option><option value="none">No limit</option>
          </select></div>
        <div class="field"><label for="v-len">Length</label>
          <select id="v-len" name="debug">
            <option value="1">Demo: about 3 minutes, not saved</option>
            <option value="0">Full: 15 minutes, saved</option>
          </select></div>
        <button class="btn btn-primary" type="submit">Start</button>
      </form>
      <p class="note">Works on a phone or a computer.</p>
    </div>
    <table class="pasta" aria-label="Example trial: four brands of pasta with price and quality score">
      <thead><tr><th></th><th>Velmo</th><th>Tarsi</th><th>Quendo</th><th>Bafra</th></tr></thead>
      <tbody>
        <tr><th>Price</th><td>$1.25</td><td class="best">$1.75</td><td>$3.50</td><td>$2.50</td></tr>
        <tr><th>Quality</th><td>3/10</td><td class="best">9/10</td><td>10/10</td><td>4/10</td></tr>
      </tbody>
      <caption>An example pasta trial. The cheapest brand is not the best value here.</caption>
    </table>
  </div>
</section>
<section class="section" aria-labelledby="expect-h">
  <div class="wrap">
    <div class="section-head"><h2 id="expect-h">What to expect</h2></div>
    <ul class="feature-list">
      <li><strong>A short practice first</strong><span>Six practice trials with feedback, so the rule is clear before anything counts.</span></li>
      <li><strong>Three versions</strong><span>Number memory: hold a few digits while choosing household products. Pattern memory: hold squares on a grid while choosing food products. Letter memory: hold a string of letters while choosing other everyday goods, such as pens and umbrellas. Every brand name is made up.</span></li>
      <li><strong>Two parts of 44 choices</strong><span>One part has a small memory load on each trial and the other a larger one.</span></li>
      <li><strong>Anonymous responses</strong><span>The task does not ask for your name or email. Your choices and their timing are saved under a random code when you finish.</span></li>
      <li><strong>Just looking?</strong><span>The one-minute demo runs a few trials and saves nothing. A full session saves your responses.</span></li>
    </ul>
  </div>
</section>
""")

# ── Vector Guild (introduction; the game itself is /vector-guild/) ───────────
page("projects/vector-guild.html", "Vector Guild — a linear algebra adventure",
     "A free browser game for learning linear algebra: 68 engineering missions, and every first solve builds part of an outpost.",
     active="Tools", feedback=True, body="""
<section class="page-hero">
  <div class="wrap">
    <h1>Vector Guild</h1>
    <p class="lede">A linear algebra adventure. Work through 68 engineering missions, and every first
    solve builds another part of your outpost.</p>
    <div class="actions">
      <a class="btn btn-primary" href="/vector-guild/">Play Vector Guild</a>
    </div>
    <p class="note">Free. No account. Runs in your browser.</p>
  </div>
</section>
<section class="section" aria-labelledby="vg-h">
  <div class="wrap">
    <div class="section-head"><h2 id="vg-h">What's inside</h2></div>
    <ul class="feature-list">
      <li><strong>68 missions in eight chapters</strong><span>Each mission is one calculation with a purpose, ordered so every idea builds on the last.</span></li>
      <li><strong>Hints, guided steps and labs</strong><span>A graph lab and a 3D bench let you see the vectors before you commit to an answer.</span></li>
      <li><strong>Linked to the source</strong><span>Missions point to the matching MIT OpenCourseWare 18.06 lecture.</span></li>
      <li><strong>Your progress stays with you</strong><span>The game saves in your browser, and you can export a backup from its settings.</span></li>
    </ul>
  </div>
</section>
""")

# ── Gyrafold ─────────────────────────────────────────────────────────────────
page("projects/gyrafold.html", "Gyrafold — explore the human brain in 3D",
     "A free 3D brain atlas that runs in your browser: spin and slice the brain, tap any of 300+ structures to learn what it does, and quiz yourself with spaced review.",
     active="Tools", feedback=True, theme="neuro", og_image="/img/og-neuroapp.png", body=f"""
<section class="page-hero">
  <div class="wrap split">
    <div>
      <h1>Gyrafold</h1>
      <p class="lede">Explore the human brain in 3D, right in your browser. Tap a structure to see what it
      does and what it connects to, then quiz yourself until the names stick.</p>
      <div class="actions">
        <a class="btn btn-primary" href="{NEUROAPP}">Open Gyrafold</a>
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
    <div><img class="phone-shot" src="/img/neuroapp-phone.webp" width="390" height="664" alt="Gyrafold on a phone: the brain at the top and a structure page for the left superior frontal gyrus in a sheet below" loading="lazy"></div>
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
      <li><strong>Open source</strong><span>Built with AI assistance. The source is <a href="https://github.com/giovannicallahan/gyrafold" {EXT}>open on GitHub</a>.</span></li>
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="share-n">
  <div class="wrap">
    <h2 id="share-n">Share it</h2>
    <div class="share">
      <img src="/img/qr-brain.svg" width="132" height="132" alt="QR code that opens Gyrafold">
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
     active="Tools", feedback=True, og_image="/img/og-cogviz.png", body=f"""
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
     "Tell Giovanni Callahan what works and what gets in your way in Gyrafold, CogViz or this website.",
     active=None, body="""
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
            <label><input type="radio" name="app" value="Gyrafold" required> Gyrafold</label>
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
        <li>For Gyrafold, whether it happened on a phone or a computer</li>
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
      <a class="btn btn-ghost" href="https://gyrafold.com/">Open Gyrafold</a>
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


redirect("brain/index.html", NEUROAPP, "Gyrafold")
redirect("projects/neuroapp.html", "/projects/gyrafold.html", "Gyrafold")
# Old NeuroApp addresses (the app was renamed Gyrafold)
for _old in ("index.html", "atlas-viewer.html", "neuron.html", "imaging.html"):
    redirect("neuroapp/" + _old, NEUROAPP + ("" if _old == "index.html" else _old), "Gyrafold")
redirect("cogviz/index.html", COGVIZ, "CogViz Research Studio")

(ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
urls = ["/", "/projects/", "/projects/gyrafold.html", "/about.html", "/experiment.html", "/projects/cogviz.html", "/projects/vector-guild.html", "/vector-guild/", "/contact.html", "/feedback.html"]
(ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                                  + "".join(f"  <url><loc>{SITE}{u}</loc></url>\n" for u in urls) + "</urlset>\n")
print("wrote robots.txt, sitemap.xml")
