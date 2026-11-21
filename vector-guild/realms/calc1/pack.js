/* Calculus 1 realm ("Calculus 1: change"): rates, limits, derivatives and the first step into integrals, for an
   adult who has finished Foundations and nothing more. Same Kepler outpost, now grown: things move and flow, and
   Mira is still the mentor. Fields: docs/PACK-FORMAT.md; the concept plan is docs/CALC1-PLAN.md.
   Learn missions use local ids q01–q40, one per concept; the chapters below fix which id teaches what.
   Each concept also has practice missions q01b, q01c, q01d ... (docs/PACK-FORMAT.md, "Practice missions"). */
window.REALM = {
 id: 'calc1',
 name: 'Calculus 1: change',
 saveId: 'calc1',
 pageTitle: 'MathCosmos — Calculus 1: change',
 description: 'Rates of change, limits, derivatives and a first look at integrals, taught at the Kepler outpost.',
 /* Declared chapters, in campaign order. Tiers: chapters 1–2 Basic (100 XP), 3–5 Intermediate (150 XP), 6–7 Advanced (200 XP). */
 chapters: [
  { name: 'Rates and limits', tier: 'Basic', blurb: 'Average rates of change, closing in on an instant, and what a limit is.', ids: ['q01', 'q02', 'q03', 'q04', 'q05', 'q06'] },
  { name: 'Continuity and infinity', tier: 'Basic', blurb: 'Continuous functions, limits at infinity, asymptotes and trapping a root.', ids: ['q07', 'q08', 'q09', 'q10', 'q11'] },
  { name: 'The derivative', tier: 'Intermediate', blurb: 'The derivative as a limit, tangent lines, the power rule, velocity and acceleration.', ids: ['q12', 'q13', 'q14', 'q15', 'q16', 'q17'] },
  { name: 'Rules of differentiation', tier: 'Intermediate', blurb: 'Product, quotient and chain rules; sine, cosine, exponentials and logarithms.', ids: ['q18', 'q19', 'q20', 'q21', 'q22', 'q23'] },
  { name: 'Derivatives at work', tier: 'Intermediate', blurb: 'Implicit differentiation, related rates, linear approximation and the shape of a curve.', ids: ['q24', 'q25', 'q26', 'q27', 'q28', 'q29'] },
  { name: 'Best values and shortcuts', tier: 'Advanced', blurb: 'Largest and smallest values, optimisation, the Mean Value Theorem, L’Hôpital’s rule and Newton’s method.', ids: ['q30', 'q31', 'q32', 'q33', 'q34'] },
  { name: 'From change to accumulation', tier: 'Advanced', blurb: 'Antiderivatives, areas from rectangles, the definite integral and the Fundamental Theorem of Calculus.', ids: ['q35', 'q36', 'q37', 'q38', 'q39', 'q40'] }
 ],
 /* Practice missions: the letter that follows the learn id, and the kind of practice it is. Every concept is
    planned to have one of each, so the full pack is 40 learn + 120 practice = 160 missions. Practice is optional:
    a chapter is complete when its learn missions are solved, and mastered when its practice is solved as well. */
 practice: { kinds: { b: 'setting', c: 'applied', d: 'challenge' } },
 /* Sector i is the place in the outpost where chapter i's missions happen; a mission's `sector` is one of these names. */
 sectors: [
  { name: 'Tracking Station', purpose: 'follow everything that moves around the outpost' },
  { name: 'Flow Control', purpose: 'keep the pumps and pipes running without a break' },
  { name: 'Test Track', purpose: 'measure how fast a rover is going at any instant' },
  { name: 'Machine Shop', purpose: 'take any formula apart and find how fast it changes' },
  { name: 'Launch Gantry', purpose: 'predict how a launch will go before we light the engines' },
  { name: 'Design Studio', purpose: 'find the best design instead of guessing at it' },
  { name: 'Reservoir', purpose: 'add up a changing flow into a total we can rely on' }
 ],
 landmarks: [
  { name: 'Tracking dish', at: [45, 150], art: '<path d="M0 0V-16" stroke="#b4cead" stroke-width="3"/><path d="M-13 -30A15 15 0 0 0 13 -18Z" fill="#496866" stroke="#b4cead"/><path d="M0 -24L9 -36" stroke="#d4f36a" stroke-width="2"/><circle cx="10" cy="-37" r="2.5" fill="#d4f36a"/>' },
  { name: 'Pump house', at: [120, 142], art: '<rect x="-14" y="-14" width="20" height="14" fill="#3f6a5a" stroke="#b4cead"/><path d="M6 -8H16V0" stroke="#82b8b2" stroke-width="3" fill="none"/><circle cx="-4" cy="-7" r="4" fill="none" stroke="#d4f36a" stroke-width="2"/>' },
  { name: 'Speed gate', at: [215, 135], art: '<path d="M-14 0V-24M14 0V-24" stroke="#b4cead" stroke-width="3"/><path d="M-14 -24H14" stroke="#d4f36a" stroke-width="3"/><path d="M-8 -6H8" stroke="#f3c37b" stroke-width="2" stroke-dasharray="3 3"/>' },
  { name: 'Lathe hall', at: [279, 98], art: '<path d="M-16 0V-12L-8 -18L0 -12L8 -18L16 -12V0Z" fill="#607669" stroke="#b4cead"/><circle cx="0" cy="-5" r="3.5" fill="none" stroke="#d4f36a" stroke-width="2"/>' },
  { name: 'Launch tower', at: [335, 136], art: '<path d="M-8 0L-4 -40H4L8 0M-6 -14H6M-5 -27H5" stroke="#b4cead" stroke-width="2" fill="none"/><path d="M12 0V-30L15 -37L18 -30V0Z" fill="#73c6d2" stroke="#203a3d"/>' },
  { name: 'Drafting dome', at: [440, 151], art: '<path d="M-15 0A15 15 0 0 1 15 0Z" fill="#496866" stroke="#b4cead"/><path d="M-9 -3Q0 -22 9 -3" fill="none" stroke="#d4f36a" stroke-width="2"/>' },
  { name: 'Reservoir dam', at: [488, 129], art: '<path d="M-18 0L-12 -22H12L18 0Z" fill="#607669" stroke="#b4cead"/><path d="M-10 -18H10" stroke="#73c6d2" stroke-width="4"/><path d="M0 -10V0" stroke="#d4f36a" stroke-width="2"/>' }
 ],
 landmarkCost: 4,
 /* Ranks count every solved mission, learn and practice; the top rank needs all 160. While some missions are still
    unwritten, the engine scales these steps down to the missions that exist (app.js, "ranks"). learnAt is a number of
    concepts learned that also holds the rank, so learn missions alone climb the ladder (the same steps as
    Foundations). The top rank has no learnAt: it needs every mission. */
 ranks: [
  { at: 0, title: 'OBSERVER' }, { at: 8, learnAt: 4, title: 'TRACKER' }, { at: 24, learnAt: 10, title: 'FLOW CONTROLLER' }, { at: 44, learnAt: 16, title: 'TEST DRIVER' },
  { at: 68, learnAt: 22, title: 'MACHINIST' }, { at: 96, learnAt: 28, title: 'LAUNCH ENGINEER' }, { at: 128, learnAt: 34, title: 'CHIEF DESIGNER' },
  { at: 144, learnAt: 40, title: 'CHANGE ANALYST' }, { at: 160, title: 'MASTER OF CHANGE', top: true }
 ],
 tiers: ['Basic', 'Intermediate', 'Advanced'],
 /* Every mission's xp is fixed by its tier (checked by qa/harness.js). */
 tierXp: { Basic: 100, Intermediate: 150, Advanced: 200 },
 /* Every mission cites at least one section of OpenStax Calculus Volume 1; the title must contain "OpenStax". */
 sourceRule: { publisherPattern: /OpenStax/, label: 'OpenStax' },
 features: { workshop: false, contracts: false, board: false, docking: false, handson: false, labs: ['concept'] },
 mentor: {
  name: 'Mira', role: 'field engineer', cardEyebrow: 'MIRA / YOUR FIELD ENGINEER',
  opening: (q, purpose) => `I’m Mira. Nothing here stands still any more, and we have to ${purpose}. Your task is “${q.title}.” ${q.brief} The idea we need: ${q.topic}.`,
  closing: 'You already have everything this needs from Foundations. I’ll go through the worked example with you, and the guided steps are there whenever you want them.'
 },
 copy: {
  sceneLabel: 'KEPLER OUTPOST / FLIGHT LINE',
  homeEyebrow: 'THE OUTPOST IS MOVING',
  homeTitle: 'Nothing here stands still.<br><em>Learn to measure change.</em>',
  firstVisit: 'Welcome back. The outpost has grown: rovers drive, shuttles climb and tanks fill, and nobody can yet say how fast. We will start by timing one shuttle; everything you need you learned in Foundations.',
  allDone: 'You did it. All seven stations are running, and you can say how fast anything here changes and how much it adds up to. Calculus 2 will pick up from the reservoir when it opens.',
  beginFirst: 'Time the first shuttle',
  missionNoun: 'calculus missions',
  chaptersNote: 'Seven chapters. Learn every concept in a chapter to unlock a landmark for the outpost. Practice missions are optional.',
  skills: { eyebrow: 'YOUR DEVELOPMENT', title: 'The skill tree', text: 'Follow the prerequisite branches from average rates to integrals. Each mission you finish opens the ideas that are built on it.' },
  guideNoun: 'calculus topics',
  /* The celebration after a first solve. Mission titles here are scenes, not parts, so nothing is "installed". */
  heading: q => `You learned: ${q.topic} ✦`,
  consequence: (q, purpose) => `That is right. ${q.solution} ${q.sector} has a new part now, so we can ${purpose}.`,
  visual: { eyebrow: 'TRY IT YOURSELF', title: 'The concept bench', text: 'Pick any mission, change its numbers and predict the result before you check it. Nothing here affects your progress, and it all works offline.' }
 },
 help: '<div class="eyebrow">WELCOME BACK</div><h2>The mathematics of change.</h2><p>Calculus 1 starts where Foundations ends: with slopes, functions and graphs. It teaches limits, derivatives and a first look at integrals. Every new word and symbol is explained before you are asked to use it, with a worked example first.</p><div class="mission-panel"><h3>HOW THE OUTPOST WORKS</h3><p>01 / Read the lesson and the worked example, then choose “I’m ready to try.” You can open the lesson again at any time.<br>02 / Answers are numbers, never formulas: a slope, a value at a point, a coefficient. Type them without commas or spaces (1250, not 1,250). Decimals such as 2.5 and fractions such as 7/6 or 1 1/2 work. When an answer must be rounded, the mission says how. Angles are in radians unless a mission says otherwise.<br>03 / Hints and guided steps are free and still earn the full reward. Your first solve of a mission earns XP and one skill point; every 300 XP is a level. A solve on the first check with no help also earns a ★.<br>04 / Missions open when the missions they build on are done. A chapter is complete when every concept in it is learned; that unlocks a landmark for the outpost, bought with skill points.<br>05 / Review drills ask a solved idea again with new numbers, spaced further apart each time you pass. Misses go into the error notebook at the top of the field guide.<br>06 / Each concept has one learn mission and up to three practice missions, marked B, C and D: the same skill in a new setting, a word problem with two or three steps, and a challenge. Practice opens when you solve the learn mission. It is optional, and it earns XP, skill points and stardust like any mission.</p></div><p>Progress is saved in this browser only. Use settings to export a backup or import it on another device.</p>'
};
