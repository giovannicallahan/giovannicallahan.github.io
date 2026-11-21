/* Foundations realm: the mathematics every other realm assumes, for an adult who has none yet.
   Same Kepler outpost as linear algebra, before the engineering starts: the player is a new recruit
   handling supplies, rations, fuel, maps and signals, with Mira. Fields: docs/PACK-FORMAT.md.
   Learn missions use local ids q01–q40, one per concept; the chapters below fix which id teaches what.
   Each concept also has practice missions q01b, q01c, q01d ... (docs/PACK-FORMAT.md, "Practice missions"). */
window.REALM = {
 id: 'found',
 name: 'Foundations',
 saveId: 'found',
 pageTitle: 'MathCosmos — Foundations',
 description: 'Numbers, equations, functions and graphs from the very beginning, taught at the Kepler outpost.',
 /* Declared chapters, in campaign order. Tiers: chapters 1–2 Basic (100 XP), 3–5 Intermediate (150 XP), 6–7 Advanced (200 XP). */
 chapters: [
  { name: 'Number sense', tier: 'Basic', blurb: 'Place value, the four operations, order of operations and negative numbers.', ids: ['q01', 'q02', 'q03', 'q04', 'q05', 'q06'] },
  { name: 'Parts and ratios', tier: 'Basic', blurb: 'Fractions, decimals, percent, ratio, rate and proportion.', ids: ['q07', 'q08', 'q09', 'q10', 'q11', 'q12'] },
  { name: 'Language of algebra', tier: 'Intermediate', blurb: 'Variables, expressions, equations and inequalities.', ids: ['q13', 'q14', 'q15', 'q16', 'q17', 'q18'] },
  { name: 'Lines and space', tier: 'Intermediate', blurb: 'Coordinates, distance, slope, straight lines and three-dimensional points.', ids: ['q19', 'q20', 'q21', 'q22', 'q23', 'q24'] },
  { name: 'Systems and tables', tier: 'Intermediate', blurb: 'Where lines meet, solving several equations at once, and data in a grid.', ids: ['q25', 'q26', 'q27', 'q28', 'q29'] },
  { name: 'Powers and polynomials', tier: 'Advanced', blurb: 'Exponents, roots, polynomials, factoring, quadratics and rational expressions.', ids: ['q30', 'q31', 'q32', 'q33', 'q34', 'q35'] },
  { name: 'Functions and angles', tier: 'Advanced', blurb: 'Functions, transformations, inverses, exponentials, logarithms and trigonometry.', ids: ['q36', 'q37', 'q38', 'q39', 'q40'] }
 ],
 /* Practice missions: the letter that follows the learn id, and the kind of practice it is. Every concept is
    planned to have one of each, so the full pack is 40 learn + 120 practice = 160 missions. Practice is optional:
    a chapter is complete when its learn missions are solved, and mastered when its practice is solved as well. */
 practice: { kinds: { b: 'setting', c: 'applied', d: 'challenge' } },
 /* Sector i is the place in the outpost where chapter i's missions happen; a mission's `sector` is one of these names. */
 sectors: [
  { name: 'Supply Depot', purpose: 'count and log the supplies that keep the outpost running' },
  { name: 'Ration Kitchen', purpose: 'share out rations and fuel mixes fairly' },
  { name: 'Fuel Store', purpose: 'balance the fuel ledger so no tank runs dry' },
  { name: 'Map Room', purpose: 'chart the ground and the sky around the outpost' },
  { name: 'Logistics Office', purpose: 'plan deliveries that meet every demand at once' },
  { name: 'Fabrication Yard', purpose: 'size the panels, tanks and frames we build' },
  { name: 'Signal Tower', purpose: 'aim our antennas and read the signals that come back' }
 ],
 landmarks: [
  { name: 'Supply crane', at: [45, 150], art: '<path d="M0 0V-34H22" stroke="#b4cead" stroke-width="3" fill="none"/><path d="M20 -34V-22" stroke="#d4f36a" stroke-width="2"/><rect x="15" y="-22" width="10" height="7" fill="#82b8b2"/>' },
  { name: 'Ration greenhouse', at: [120, 142], art: '<path d="M-14 0V-10A14 14 0 0 1 14 -10V0Z" fill="#3f6a5a" stroke="#b4cead"/><path d="M-6 -4V-12M0 -4V-15M6 -4V-11" stroke="#d4f36a" stroke-width="2"/>' },
  { name: 'Fuel tank farm', at: [215, 135], art: '<rect x="-16" y="-18" width="12" height="18" rx="5" fill="#607669" stroke="#b4cead"/><rect x="2" y="-24" width="14" height="24" rx="6" fill="#496866" stroke="#93b6a0"/><circle cx="9" cy="-28" r="2.5" fill="#d4f36a"/>' },
  { name: 'Survey flag line', at: [279, 98], art: '<path d="M-10 0V-22M10 0V-28" stroke="#93b6a0" stroke-width="2"/><path d="M-10 -22L-1 -19L-10 -16Z" fill="#f3c37b"/><path d="M10 -28L19 -25L10 -22Z" fill="#d4f36a"/>' },
  { name: 'Cargo rail', at: [335, 136], art: '<path d="M-20 0H20M-20 -6H20" stroke="#b4cead" stroke-width="2"/><rect x="-12" y="-16" width="14" height="9" fill="#73c6d2" stroke="#203a3d"/>' },
  { name: 'Fabrication kiln', at: [440, 151], art: '<path d="M-12 0V-18L0 -26L12 -18V0Z" fill="#607669" stroke="#b4cead"/><path d="M6 -22V-36" stroke="#f3c37b" stroke-width="3"/>' },
  { name: 'Signal mast', at: [488, 129], art: '<path d="M0 0L-5 -40L5 -40Z" fill="#82b8b2"/><path d="M-12 -30Q0 -48 12 -30M-17 -26Q0 -54 17 -26" fill="none" stroke="#d4f36a" stroke-width="2"/>' }
 ],
 landmarkCost: 4,
 /* Ranks count every solved mission, learn and practice; the top rank needs all 160. While some practice missions
    are still unwritten, the engine scales these steps down to the missions that exist (app.js, "ranks").
    learnAt is the 2.1 step, counted in concepts learned: a rank is also held by that many learn missions alone, so a
    save from before practice existed keeps its rank. That includes GUILD CANDIDATE, the top rank of 2.1, which all
    40 concepts still earn. The top rank, new with practice, has no learnAt: it needs every mission. */
 ranks: [
  { at: 0, title: 'RECRUIT' }, { at: 8, learnAt: 4, title: 'SUPPLY HAND' }, { at: 24, learnAt: 10, title: 'STORES CLERK' }, { at: 44, learnAt: 16, title: 'FUEL TECHNICIAN' },
  { at: 68, learnAt: 22, title: 'SURVEYOR' }, { at: 96, learnAt: 28, title: 'LOGISTICS OFFICER' }, { at: 128, learnAt: 34, title: 'SIGNALS OFFICER' },
  { at: 144, learnAt: 40, title: 'GUILD CANDIDATE' }, { at: 160, title: 'OUTPOST MASTER', top: true }
 ],
 tiers: ['Basic', 'Intermediate', 'Advanced'],
 /* Every mission's xp is fixed by its tier (checked by qa/harness.js). */
 tierXp: { Basic: 100, Intermediate: 150, Advanced: 200 },
 /* Every mission cites at least one OpenStax book section (Prealgebra 2e, Elementary Algebra 2e,
    Intermediate Algebra 2e, College Algebra 2e or Precalculus 2e); the title must contain "OpenStax". */
 sourceRule: { publisherPattern: /OpenStax/, label: 'OpenStax' },
 features: { workshop: false, contracts: false, board: false, docking: false, handson: false, labs: ['concept'] },
 mentor: {
  name: 'Mira', role: 'field engineer', cardEyebrow: 'MIRA / YOUR FIELD ENGINEER',
  opening: (q, purpose) => `I’m Mira. Before the engineers can build anything, we have to ${purpose}. Your task is “${q.title}.” ${q.brief} We will use ${q.topic.toLowerCase()} to get it right.`,
  closing: 'Nothing here assumes you have done this before. I’ll go through the worked example with you, and the guided steps are there whenever you want them.'
 },
 copy: {
  sceneLabel: 'KEPLER OUTPOST / SUPPLY CAMP',
  homeEyebrow: 'BEFORE THE ENGINEERING STARTS',
  homeTitle: 'Every number counts.<br><em>Learn the outpost’s language.</em>',
  firstVisit: 'Welcome to the outpost, recruit. The first supply crates have landed and nobody has counted them yet. We will start with the numbers on the crates; you do not need any mathematics to begin.',
  allDone: 'You did it. All seven stations are running, and you speak the language the engineers use. Linear algebra is waiting on the home page whenever you are ready.',
  beginFirst: 'Count the first supplies',
  missionNoun: 'foundation missions',
  chaptersNote: 'Seven chapters. Learn every concept in a chapter to unlock a landmark for the camp. Practice missions are optional.',
  skills: { eyebrow: 'YOUR DEVELOPMENT', title: 'The skill tree', text: 'Follow the prerequisite branches from counting to functions. Each mission you finish opens the ideas that are built on it.' },
  guideNoun: 'foundation topics',
  /* The celebration after a first solve. Mission titles here are scenes, not parts, so nothing is "installed". */
  heading: q => `You learned: ${q.topic} ✦`,
  consequence: (q, purpose) => `That is right. ${q.solution} ${q.sector} has a new part now, so we can ${purpose}.`,
  visual: { eyebrow: 'TRY IT YOURSELF', title: 'The concept bench', text: 'Pick any mission, change its numbers and predict the result before you check it. Nothing here affects your progress, and it all works offline.' }
 },
 help: '<div class="eyebrow">WELCOME, RECRUIT</div><h2>You can start from zero.</h2><p>Foundations teaches the mathematics the rest of the guild relies on, from place value to trigonometry. Every idea is explained before you are asked to use it, with a worked example first.</p><div class="mission-panel"><h3>HOW THE CAMP WORKS</h3><p>01 / Read the lesson and the worked example, then choose “I’m ready to try.” You can open the lesson again at any time.<br>02 / Answers are numbers. Type them without commas or spaces (6038, not 6,038). Decimals such as 2.5 and fractions such as 7/6 or 1 1/2 work. When a fraction is asked for, its top and bottom go in separate boxes. Small rounding differences are accepted.<br>03 / Hints and guided steps are free and still earn the full reward. Your first solve of a mission earns XP and one skill point; every 300 XP is a level. A solve on the first check with no help also earns a ★.<br>04 / Missions open when the missions they build on are done. A chapter is complete when every concept in it is learned; that unlocks a landmark for the camp, bought with skill points.<br>05 / Review drills ask a solved idea again with new numbers, spaced further apart each time you pass. Misses go into the error notebook at the top of the field guide.<br>06 / Each concept has one learn mission and up to three practice missions, marked B, C and D: the same skill in a new setting, a word problem with two or three steps, and a challenge. Practice opens when you solve the learn mission. It is optional, and it earns XP, skill points and stardust like any mission.</p></div><p>Progress is saved in this browser only. Use settings to export a backup or import it on another device.</p>'
};
