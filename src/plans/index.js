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
};

/** @type {import("./types.js").PipedGasPlan[]} */
export const GasPlans = Object.values(GasPlan);
