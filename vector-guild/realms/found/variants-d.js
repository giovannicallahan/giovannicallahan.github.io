/* Foundations review-drill statements, file d: q36–q40. Shape: docs/PACK-FORMAT.md ("Variant setup and pool").
   Loaded before game/variants.js, which merges these tables. Each statement uses the numbers of the matching
   experiment in experiments-d.js for the same t. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q36: t => `The cable length after t minutes is L(t) = 3t + 12 metres, for any time from 0 to 10 minutes. Find L(${(t + 10) % 11}).`,
 q37: t => `The old rule is f(d) = 4d + 6 motor steps. The dial is refitted ${(t + 10) % 7 + 1} mark${(t + 10) % 7 ? 's' : ''} out of line, so the new rule is p(d) = f(d − ${(t + 10) % 7 + 1}). Find p(9).`,
 q38: t => `The transmitter draws P(s) = 5s + 20 watts at setting s. The log shows ${5 * (t + 11) + 20} W. Find the setting, P⁻¹(${5 * (t + 11) + 20}).`,
 q39: t => `Each relay stage triples a signal. A signal of 4 units must reach ${4 * 3 ** ((t + 10) % 5 + 1)} units. How many stages does it need?`,
 q40: t => `A cable runs from the top of a 24 m mast to a ground anchor 18 m from its foot; the cable is 30 m long, and θ is its angle with the ground. A ${5 * ((t + 10) % 6 + 1)} m boom swings up from flat to angle θ. How high above its pivot is its tip?`
});
})();
