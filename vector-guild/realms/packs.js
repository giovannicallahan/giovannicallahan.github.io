/* Realm packs: the scripts realm.html loads for each playable realm, in order.
   realm.html?realm=<id> writes these <link> and <script> tags, then app.js last. Only one pack is
   loaded per page, so packs may reuse local mission ids (q01 ...); saves are kept per realm (save-store.js).
   A feature that is off in a pack's REALM config has no script here, so its module is never loaded.
   title   the realm's display name (the star map registry, realms/registry.js, has the card text)
   styles  stylesheets, in cascade order
   scripts classic scripts, in load order, without app.js
   VG_REALM_SHARED is loaded on every realm page, whatever the pack: the collection (docs/COLLECTION.md).
   styles  after the pack's stylesheets
   before  classic scripts before the pack's scripts (data and logic, no page code; save-store.js is already loaded)
   after   classic scripts after the pack's scripts and before app.js (page code) */
window.VG_REALM_SHARED = {
 styles: ['collection/collection.css'],
 before: ['realms/registry.js', 'collection/figures.js', 'collection/achievements.js', 'collection/core.js'],
 after: ['collection/ui.js']
};
window.VG_PACKS = {
 la: {
  title: 'Linear algebra',
  styles: ['styles.css', 'docking.css', 'update.css', 'handson.css'],
  scripts: ['realms/la/pack.js', 'curriculum.js', 'extra-quests.js', 'chapters.js', 'gen-core.js', 'gen-a.js', 'gen-b.js', 'gen-c.js', 'gen-d.js', 'reading-links.js', 'gameplay.js', 'lab3d.js', 'graph-lab.js', 'experiment-low.js', 'experiment-high.js', 'variants.js', 'concept-lab.js', 'docking.js', 'handson.js', 'contracts.js', 'board.js']
 },
 found: {
  title: 'Foundations',
  styles: ['styles.css', 'update.css'],
  scripts: ['realms/found/pack.js', 'realms/found/missions-a.js', 'realms/found/missions-b.js', 'realms/found/missions-c.js', 'realms/found/missions-d.js', 'gen-core.js', 'realms/found/gen-a.js', 'realms/found/gen-b.js', 'realms/found/gen-c.js', 'realms/found/gen-d.js', 'gameplay.js', 'realms/found/experiments-a.js', 'realms/found/experiments-b.js', 'realms/found/experiments-c.js', 'realms/found/experiments-d.js', 'realms/found/variants-a.js', 'realms/found/variants-b.js', 'realms/found/variants-c.js', 'realms/found/variants-d.js', 'realms/found/practice-1.js', 'realms/found/practice-2.js', 'realms/found/practice-3.js', 'realms/found/practice-4.js', 'realms/found/practice-5.js', 'realms/found/practice-6.js', 'realms/found/practice-7.js', 'realms/found/practice-8.js', 'variants.js', 'concept-lab.js', 'chapters.js']
 }
};
