import {
  contactGoodNightsLowUserElectricity,
  contactGoodNightsStandardUserElectricity,
  contactGoodWeekendsLowUserElectricity,
  contactGoodWeekendsStandardUserElectricity,
  contactLivingSmartGas,
} from "./providers/contact.js";
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
  genesisEnergyPlusLowUserElectricity,
  genesisEnergyPlusLowUserGas,
  genesisEnergyPlusStandardUserElectricity,
  genesisEnergyPlusStandardUserGas,
} from "./providers/genesis.js";
import {
  mercuryOpenTermLowUseElectricity,
  mercuryOpenTermLowUseGas,
  mercuryOpenTermLowUseGasUnbundled,
  mercuryOpenTermStandardUseElectricity,
  mercuryOpenTermStandardUseGas,
} from "./providers/mercury.js";

export const ElectricityPlan = {
  electricKiwiMoveMasterLowUser,
  electricKiwiMoveMasterStandardUser,
  frankLowUser,
  frankStandardUser,
  mercuryOpenTermLowUseElectricity,
  mercuryOpenTermStandardUseElectricity,
  genesisEnergyPlusLowUserElectricity,
  genesisEnergyPlusStandardUserElectricity,
  contactGoodNightsLowUserElectricity,
  contactGoodNightsStandardUserElectricity,
  contactGoodWeekendsLowUserElectricity,
  contactGoodWeekendsStandardUserElectricity,
};

/** @type {import("./types.js").ElectricityPlan[]}} */
export const ElectricityPlans = Object.values(ElectricityPlan);

export const GasPlan = {
  frankGasBundled,
  frankGasUnbundled,
  genesisEnergyPlusLowUserGas,
  genesisEnergyPlusStandardUserGas,
  mercuryOpenTermLowUseGas,
  mercuryOpenTermStandardUseGas,
  mercuryOpenTermLowUseGasUnbundled,
  contactLivingSmartGas,
};

/** @type {import("./types.js").PipedGasPlan[]} */
export const GasPlans = Object.values(GasPlan);
