import {
  electricKiwiMoveMasterLowUser,
  electricKiwiMoveMasterStandardUser,
} from "./providers/electric-kiwi.js";
import {
  frankGasBundled,
  frankGasUnbundled,
  frankLowUser,
  frankStandardUser,
} from "./providers/frank.js";
import {
  mercuryFixedTermLowUse,
  mercuryFixedTermStandardUse,
  mercuryOpenTermLowUse,
  mercuryOpenTermStandardUse,
} from "./providers/mercury.js";

export const ElectricityPlan = {
  electricKiwiMoveMasterLowUser,
  electricKiwiMoveMasterStandardUser,
  frankLowUser,
  frankStandardUser,
  mercuryOpenTermLowUse,
  mercuryFixedTermLowUse,
  mercuryOpenTermStandardUse,
  mercuryFixedTermStandardUse,
};

/** @type {import("./types.js").ElectricityPlan[]}} */
export const ElectricityPlans = Object.values(ElectricityPlan);

export const GasPlan = {
  frankGasBundled,
  frankGasUnbundled,
};

/** @type {import("./types.js").PipedGasPlan[]} */
export const GasPlans = Object.values(GasPlan);
