import {
  contactFastFibre,
  contactGoodNightsLowUserElectricity,
  contactGoodNightsStandardUserElectricity,
  contactGoodWeekendsLowUserElectricity,
  contactGoodWeekendsStandardUserElectricity,
  contactLivingSmartGas,
} from "./providers/contact.js";
import {
  electricKiwiInternet,
  electricKiwiKiwiLowUser,
  electricKiwiKiwiStandardUser,
  electricKiwiMoveMasterLowUser,
  electricKiwiMoveMasterStandardUser,
  electricKiwiPrepay300LowUser,
  electricKiwiPrepay300StandardUser,
} from "./providers/electric-kiwi.js";
import {
  flickFlatLow,
  flickFlatStandard,
  flickOffPeakLow,
  flickOffPeakStandard,
} from "./providers/flick.js";
import {
  frankGasBundled,
  frankGasUnbundled,
  frankLowUser,
  frankStandardUser,
} from "./providers/frank.js";
import {
  genesisEnergyPlusLowUserElectricity,
  genesisEnergyPlusLowUserElectricityBundled,
  genesisEnergyPlusLowUserGas,
  genesisEnergyPlusLowUserGasBundled,
  genesisEnergyPlusStandardUserElectricity,
  genesisEnergyPlusStandardUserElectricityBundled,
  genesisEnergyPlusStandardUserGas,
  genesisEnergyPlusStandardUserGasBundled,
} from "./providers/genesis.js";
import {
  mercuryFibreClassicInternet,
  mercuryOpenTermLowUserElectricity,
  mercuryOpenTermLowUserGas,
  mercuryOpenTermLowUserGasUnbundled,
  mercuryOpenTermStandardUserElectricity,
  mercuryOpenTermStandardUserGas,
} from "./providers/mercury.js";
import { quicRunner } from "./providers/quic.js";

export const ElectricityPlan = {
  electricKiwiMoveMasterLowUser,
  electricKiwiMoveMasterStandardUser,
  electricKiwiKiwiLowUser,
  electricKiwiKiwiStandardUser,
  electricKiwiPrepay300LowUser,
  electricKiwiPrepay300StandardUser,
  frankLowUser,
  frankStandardUser,
  mercuryOpenTermLowUserElectricity,
  mercuryOpenTermStandardUserElectricity,
  genesisEnergyPlusLowUserElectricity,
  genesisEnergyPlusStandardUserElectricity,
  genesisEnergyPlusLowUserElectricityBundled,
  genesisEnergyPlusStandardUserElectricityBundled,
  contactGoodNightsLowUserElectricity,
  contactGoodNightsStandardUserElectricity,
  contactGoodWeekendsLowUserElectricity,
  contactGoodWeekendsStandardUserElectricity,
  flickFlatLow,
  flickFlatStandard,
  flickOffPeakLow,
  flickOffPeakStandard,
};

/** @type {import("./types.js").ElectricityPlan[]}} */
export const ElectricityPlans = Object.values(ElectricityPlan);

export const GasPlan = {
  frankGasBundled,
  frankGasUnbundled,
  genesisEnergyPlusLowUserGas,
  genesisEnergyPlusStandardUserGas,
  genesisEnergyPlusLowUserGasBundled,
  genesisEnergyPlusStandardUserGasBundled,
  mercuryOpenTermLowUserGas,
  mercuryOpenTermStandardUserGas,
  mercuryOpenTermLowUserGasUnbundled,
  contactLivingSmartGas,
};

/** @type {import("./types.js").PipedGasPlan[]} */
export const GasPlans = Object.values(GasPlan);

export const InternetPlan = {
  quicRunner,
  contactFastFibre,
  electricKiwiInternet,
  mercuryFibreClassicInternet,
};

/** @type {import("./types.js").InternetPlan[]} */
export const InternetPlans = Object.values(InternetPlan);
