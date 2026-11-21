/* Achievements (docs/COLLECTION.md). Each one: { id, name, text, reward, test(ctx), progress?(ctx) }.
   ctx is built by game/collection/core.js from the save only (docs/COLLECTION-API.md, "Achievement context"):
     solved, stars, chapters, landmarks      totals over every realm
     realmsWithSolves                        realms with at least one solved mission
     realms[id]                              { solved, stars, chapters, landmarks, missions, finished }
     landmarkRealm                           true when one finished realm has every landmark built
     drills, pulls                           counters
     figures, copiesMax, legendary, equipped distinct figures owned, highest copy count, owns a legendary, has one equipped
     fieldBest {have, need}, fieldDone       the field closest to complete, and whether one is complete
   test(ctx) says whether it is earned. progress(ctx) -> {have, need} exists where there is something to count.
   An achievement is paid once: its id is stored in meta.ach. Ids must never change once shipped. */
window.VG_ACHIEVEMENTS = (() => {
  'use strict';
  /* An achievement that is earned when a count reaches a goal. */
  const reach = (id, name, text, reward, goal, count) => ({ id, name, text, reward,
    test: ctx => count(ctx) >= goal,
    progress: ctx => ({ have: Math.min(goal, Math.max(0, count(ctx))), need: goal }) });
  /* An achievement that is simply done or not done. */
  const once = (id, name, text, reward, test) => ({ id, name, text, reward, test: ctx => !!test(ctx) });
  const finished = (ctx, id) => !!(ctx.realms[id] && ctx.realms[id].finished);
  return [
    once('solve-1', 'First light', 'Solve your first mission.', 15, c => c.solved >= 1),
    reach('solve-5', 'Finding your feet', 'Solve 5 missions.', 20, 5, c => c.solved),
    reach('solve-10', 'Ten down', 'Solve 10 missions.', 30, 10, c => c.solved),
    reach('solve-25', 'Steady hands', 'Solve 25 missions.', 50, 25, c => c.solved),
    reach('solve-50', 'Halfway to a hundred', 'Solve 50 missions.', 80, 50, c => c.solved),
    reach('solve-100', 'One hundred', 'Solve 100 missions.', 150, 100, c => c.solved),
    once('star-1', 'Right first time', 'Earn a first-try star.', 15, c => c.stars >= 1),
    reach('star-10', 'Ten stars', 'Earn 10 first-try stars.', 40, 10, c => c.stars),
    reach('star-25', 'A sky of stars', 'Earn 25 first-try stars.', 80, 25, c => c.stars),
    once('chapter-1', 'Chapter closed', 'Finish a chapter.', 25, c => c.chapters >= 1),
    reach('chapter-3', 'Three chapters', 'Finish 3 chapters.', 50, 3, c => c.chapters),
    once('found-done', 'Solid ground', 'Finish every mission in Foundations.', 120, c => finished(c, 'found')),
    once('la-done', 'Master of arrows', 'Finish every mission in Linear algebra.', 150, c => finished(c, 'la')),
    reach('two-realms', 'Explorer', 'Solve a mission in two realms.', 30, 2, c => c.realmsWithSolves),
    once('drill-1', 'Warm-up', 'Finish a review drill.', 15, c => c.drills >= 1),
    reach('drill-10', 'Keeping it fresh', 'Finish 10 review drills.', 40, 10, c => c.drills),
    reach('drill-25', 'Sharp memory', 'Finish 25 review drills.', 60, 25, c => c.drills),
    once('pull-1', 'First summon', 'Summon your first figure.', 15, c => c.pulls >= 1),
    reach('pull-10', 'Stargazer', 'Summon 10 times.', 30, 10, c => c.pulls),
    reach('figures-5', 'Small circle', 'Find 5 different figures.', 30, 5, c => c.figures),
    reach('figures-15', 'Good company', 'Find 15 different figures.', 60, 15, c => c.figures),
    reach('figures-30', 'Hall of minds', 'Find 30 different figures.', 120, 30, c => c.figures),
    once('legendary', 'A legend arrives', 'Find a legendary figure.', 50, c => c.legendary),
    reach('five-star', 'Old friend', 'Raise one figure to 5 stars.', 75, 5, c => c.copiesMax),
    once('equipped', 'Travelling companion', 'Equip a figure to travel with you.', 15, c => c.equipped),
    { id: 'field-set', name: 'Full table', text: 'Find every figure of one field.', reward: 100,
      test: c => !!c.fieldDone, progress: c => ({ have: c.fieldBest.have, need: c.fieldBest.need }) },
    once('landmark-1', 'Builder', 'Build a landmark.', 25, c => c.landmarks >= 1),
    once('landmark-all', 'Skyline', 'Build every landmark of one realm.', 100, c => c.landmarkRealm)
  ];
})();
