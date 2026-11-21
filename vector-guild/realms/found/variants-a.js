/* Foundations review-drill statements, file a: q01–q12. Shape: docs/PACK-FORMAT.md ("Variant setup and pool").
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `Depot tally of rivets: full crates of 1000, 3; boxes of 100, ${(t + 10) % 10}; bags of 10, 0; loose rivets, 7. Type the total without commas.`,
 q02: t => `Morning stock: 347 ration packs. A shuttle lands with 285 more. Then ${198 + 10 * t} packs are sent out to the survey team.`,
 q03: t => `One rack has 7 shelves with ${18 + t} water jugs on each shelf. The depot has 4 identical racks.`,
 q04: t => `${137 + t} ration packs are packed into boxes that hold 6 packs each.`,
 q05: t => `Mira's stock note reads 5 + 3 × (${18 + t} − 6) bottles.`,
 q06: t => `At noon the thermometer outside the depot reads 5 °C. By night it has fallen ${10 + t} degrees.`,
 q07: t => `A 40 g ration bar is scored into 8 equal pieces, and a recruit eats ${(t + 10) % 7 + 1} pieces.`,
 q08: t => `Of 24 meal trays, ${(t + 10) % 23 + 1} have been served. Write the fraction served in lowest terms.`,
 q09: t => `A pot gets 1/4 litre of broth and ${[1, 2, 5, 7][(t + 10) % 4]}/12 litre of water.`,
 q10: t => `Three fuel canisters hold 2.75 L, 1.6 L and ${window.Gen.n((50 + 5 * (t + 10)) / 100)} L, all poured into one jerrycan.`,
 q11: t => `The kitchen's 400 L water tank reads ${50 + 5 * t}% full.`,
 q12: t => `The water pump delivered 84 litres in 6 minutes, at a steady rate. It now runs for ${t + 11} minutes.`
});
Object.assign(window.VARIANT_POOL, {
 /* t = −5 gives a night reading of exactly 0, where a dropped minus sign would still pass; below that the fall
    does not cross zero, which is the idea being drilled. */
 q06: [-4, -3, -2, -1, 1, 2, 3, 4, 5, 6],
 /* t = 0 makes the full part equal the empty part (50%), so a swapped answer would pass. */
 q11: [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]
});
})();
