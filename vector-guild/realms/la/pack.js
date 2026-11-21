/* Linear algebra realm: the 1.4.1 campaign as a pack. These values reproduce 1.4.1 exactly;
   the engine (app.js, gameplay.js, chapters.js) reads them instead of hard-coding them.
   The fields are described in docs/PACK-FORMAT.md. */
window.REALM = {
 id: 'la',
 name: 'Linear algebra',
 saveId: 'la',
 pageTitle: 'MathCosmos — Engineering begins here',
 description: 'A hands-on linear algebra adventure for engineers.',
 /* null: chapters.js puts the missions in one prerequisite order and cuts it into these chapters. */
 chapters: null,
 computedChapters: [
  ['Vectors and transformations', 'Add, measure and turn vectors; multiply matrices.'],
  ['Systems and spaces', 'Solve linear systems and describe rank, nullspace and bases.'],
  ['Orthogonality and first modes', 'Project, fit by least squares and meet eigenvalues.'],
  ['Factorizations and spectra', 'LU, diagonalization, the spectral theorem and the SVD.'],
  ['Stability and complex modes', 'Conditioning, definiteness, complex and defective matrices.'],
  ['Networks and optimization', 'Markov chains, graphs and constrained minimization.'],
  ['Signals and dynamics', 'Low-rank models, Fourier analysis and differential systems.'],
  ['Numerical engineering', 'Block, sparse and iterative methods for larger problems.']
 ],
 sectors: [
  { name: 'Orbital Dock', purpose: 'bring the supply shuttle safely to port' },
  { name: 'Sensor Array', purpose: 'give our survey team reliable readings' },
  { name: 'Rover Bay', purpose: 'prepare the rover for its first crossing' },
  { name: 'Power Grid', purpose: 'keep every habitat supplied with power' },
  { name: 'Dynamics Lab', purpose: 'test movement before we send crews outside' },
  { name: 'Signal Forge', purpose: 'recover clear signals from the noise' },
  { name: 'Network Hub', purpose: 'connect our scattered teams' },
  { name: 'Guild Citadel', purpose: 'finish a home for the entire guild' }
 ],
 /* One landmark blueprint unlocks per completed chapter; it is bought with skill points. Drawn on the ridge line. */
 landmarks: [
  { name: 'Beacon mast', at: [45, 150], art: '<path d="M0 0V-34" stroke="#b4cead" stroke-width="3"/><circle cy="-38" r="5" fill="#d4f36a"/>' },
  { name: 'Survey tower', at: [120, 142], art: '<path d="M-8 0L-3 -30H3L8 0Z" fill="#496866" stroke="#93b6a0"/><rect x="-7" y="-38" width="14" height="8" fill="#82b8b2"/>' },
  { name: 'Observatory dome', at: [215, 135], art: '<path d="M-14 0V-8A14 14 0 0 1 14 -8V0Z" fill="#607669" stroke="#b4cead"/><path d="M0 -22L8 -32" stroke="#d4f36a" stroke-width="3"/>' },
  { name: 'Comms dish', at: [279, 98], art: '<path d="M0 0V-16" stroke="#93b6a0" stroke-width="3"/><path d="M-13 -28Q0 -8 13 -28" fill="none" stroke="#8cddd4" stroke-width="3"/><circle cy="-27" r="2.5" fill="#d4f36a"/>' },
  { name: 'Solar field', at: [335, 136], art: '<path d="M-18 0L-12 -12H0L-6 0ZM2 0L8 -12H20L14 0Z" fill="#73c6d2" stroke="#203a3d"/>' },
  { name: 'Relay pylons', at: [440, 151], art: '<path d="M-10 0V-24M10 0V-24M-10 -24Q0 -16 10 -24" stroke="#f3c37b" stroke-width="2.5" fill="none"/>' },
  { name: 'Signal spire', at: [488, 129], art: '<path d="M0 0L-5 -40L5 -40Z" fill="#82b8b2"/><path d="M-12 -30Q0 -48 12 -30" fill="none" stroke="#d4f36a" stroke-width="2"/>' },
  { name: 'Guild hall banner', at: [640, 170], art: '<path d="M-16 0V-14L0 -24L16 -14V0Z" fill="#496866" stroke="#b4cead"/><path d="M0 -24V-42L12 -37L0 -32" fill="#d4f36a" stroke="#d4f36a"/>' }
 ],
 landmarkCost: 6,
 /* Practice missions (docs/PACK-FORMAT.md, "Practice missions" and "Linear algebra practice"): the letter that follows
    the learn id, and the kind of practice it is. Every concept is planned to have one of each, so the full pack is
    68 learn + 204 practice = 272 missions. Practice is optional: a chapter is complete when its learn missions are
    solved, and mastered when its practice is solved as well. The 68 learn missions are those of 1.4.1, unchanged. */
 practice: { kinds: { b: 'setting', c: 'applied', d: 'challenge' } },
 /* Ranks count every solved mission, learn and practice; the top rank needs all 272. While some practice missions
    are still unwritten, the engine scales the `at` steps down to the missions that exist (app.js, "ranks").
    learnAt is the 1.4.1 step, counted in concepts learned: a rank is also held by that many learn missions alone, so
    the 1.4.1 ladder is climbed by the learn missions exactly as before and no save is demoted. That includes
    GUILD ARCHITECT, the top rank of 1.4.1, which all 68 concepts still earn. The `at` steps are set below four times
    learnAt, so practice missions can also carry a player to a rank a little sooner, as in Foundations. The one new
    rank, GUILD LUMINARY, has no learnAt: it needs every mission. */
 ranks: [
  { at: 0, title: 'CADET' }, { at: 12, learnAt: 5, title: 'ENGINEER' }, { at: 30, learnAt: 12, title: 'SPECIALIST' }, { at: 52, learnAt: 20, title: 'CHIEF ENGINEER' },
  { at: 84, learnAt: 30, title: 'VECTOR SAGE' }, { at: 120, learnAt: 40, title: 'SYSTEMS MASTER' }, { at: 160, learnAt: 50, title: 'PRINCIPAL DESIGNER' }, { at: 204, learnAt: 60, title: 'GUILD FELLOW' },
  { at: 244, learnAt: 68, title: 'GUILD ARCHITECT' }, { at: 272, title: 'GUILD LUMINARY', top: true }
 ],
 tiers: ['Basic', 'Intermediate', 'Advanced'],
 sourceRule: { publisherPattern: /MIT OpenCourseWare/, label: 'MIT OpenCourseWare' },
 features: { workshop: true, contracts: true, board: true, docking: true, handson: true, labs: ['concept', 'vector3d', 'graph2d'] },
 mentor: {
  name: 'Mira', role: 'field engineer', cardEyebrow: 'MIRA / YOUR FIELD ENGINEER',
  opening: (q, purpose) => `I’m Mira, your field engineer. We need to ${purpose}. Your assignment is “${q.title}.” ${q.brief} Use ${q.topic.toLowerCase()} to check the design before we install it.`,
  closing: 'I’ll stay with you through the worked example and guided steps.'
 },
 copy: {
  sceneLabel: 'KEPLER OUTPOST / LIVE CONSTRUCTION',
  homeEyebrow: 'BUILD A HOME BEYOND EARTH',
  homeTitle: 'Your calculations.<br><em>A living outpost.</em>',
  firstVisit: 'Our first supply shuttle is waiting. Help me combine its thruster impulses, and we can install the docking platform. Your first calculation becomes our first piece of home.',
  allDone: 'You did it. All eight sectors are online. Your careful decisions built this home. Revisit any mission to keep your skills sharp.',
  beginFirst: 'Build the docking platform',
  missionNoun: 'engineering missions',
  chaptersNote: 'Eight chapters. Finish one to unlock a landmark for the outpost.',
  skills: { eyebrow: 'YOUR DEVELOPMENT', title: 'The skill tree', text: 'Follow the prerequisite branches from foundations to advanced engineering. Master missions to unlock new concepts and earn points for workshop tools.' },
  guideNoun: 'engineering concepts',
  visual: { eyebrow: 'INTERACTIVE ENGINEERING', title: 'The visual lab', text: 'Work directly with solid 3D geometry, vectors, matrix transformations, and data. All tools work offline.' }
 },
 help: '<div class="eyebrow">WELCOME, CADET</div><h2>Your expedition starts here.</h2><p>Linear algebra is a toolkit for understanding forces, motion, systems, and data. Work through engineering missions to build your skills one concept at a time.</p><div class="mission-panel"><h3>THE RULES OF THE GUILD</h3><p>01 / Study the lesson and worked example, then choose “I’m ready to try.” Review the lesson anytime.<br>02 / Enter numerical answers as decimals or fractions (7/6); small rounding differences are accepted. Each save has its own numbers, so answers cannot be copied from another player. Hints and guided steps are free, and guidance earns full rewards.<br>03 / Earn XP and one skill point on your first successful solve; every 300 XP is a level. A solve on the first check with no help also earns a ★. After revealing the full solution, reopen the mission: it returns with new numbers and the full reward.<br>04 / Complete prerequisites to unlock missions. Spend skill points on workshop tools and outpost landmarks; a finished chapter unlocks a landmark, and a commissioned contract pays extra points.<br>05 / Review drills ask a solved concept again with new numbers, on a widening schedule. Misses are logged in the error notebook at the top of the field guide. Replays and drills never award extra XP.</p></div><p>Progress is saved in this browser only. Use settings to export a backup or import it on another device.</p>'
};
