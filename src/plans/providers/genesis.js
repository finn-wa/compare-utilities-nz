import { dailyRate } from "../utils.js";

const provider = "Genesis";

/**
 * Energy Plus plan can have up to 11% in discounts:
 * - 1% for receiving your bills by email (yes)
 * - 2% for Auto-pay, Direct Debit (yes)
 * - 5% for having 2 fuels with us (maybe)
 * - 1% for Auto-pay, Credit Card (no)
 * - 3% for going fixed term (no)
 */
const discount = {
  /** @param {number} mc */
  unbundled: (mc) => Math.round(mc * 0.97),
  /** @param {number} mc */
  bundled: (mc) => Math.round(mc * 0.92),
};

// Standard User

/** @type {import("../types.js").ElectricityPlan} */
export const genesisEnergyPlusStandardUserElectricity = {
  id: "genesisEnergyPlusStandardUserElectricity",
  provider,
  name: "Electricity - Energy Plus",
  variant: "Standard User",
  dailyMillicents: discount.unbundled(260_980),
  rates: dailyRate(discount.unbundled(22_440)),
  bundle: [],
};

/** @type {import("../types.js").ElectricityPlan} */
export const genesisEnergyPlusStandardUserElectricityBundled = {
  id: "genesisEnergyPlusStandardUserElectricityBundled",
  provider,
  name: "Electricity - Energy Plus Bundle",
  variant: "Standard User",
  dailyMillicents: discount.bundled(260_980),
  rates: dailyRate(discount.bundled(22_440)),
  bundle: ["gas"],
};

/** @type {import("../types.js").PipedGasPlan} */
export const genesisEnergyPlusStandardUserGas = {
  id: "genesisEnergyPlusStandardUserGas",
  provider,
  name: "Gas - Energy Plus",
  variant: "Standard User",
  dailyMillicents: discount.unbundled(179_780),
  kwhMillicents: discount.unbundled(11_910),
  bundle: [],
};

/** @type {import("../types.js").PipedGasPlan} */
export const genesisEnergyPlusStandardUserGasBundled = {
  id: "genesisEnergyPlusStandardUserGasBundled",
  provider,
  name: "Gas - Energy Plus Bundle",
  variant: "Standard User",
  dailyMillicents: discount.bundled(179_780),
  kwhMillicents: discount.bundled(11_910),
  bundle: ["electricity"],
};

// Low User

/** @type {import("../types.js").ElectricityPlan} */
export const genesisEnergyPlusLowUserElectricity = {
  id: "genesisEnergyPlusLowUserElectricity",
  provider,
  name: "Electricity - Energy Plus",
  variant: "Low User",
  dailyMillicents: discount.unbundled(103_500),
  rates: dailyRate(discount.unbundled(29_580)),
  bundle: [],
};

/** @type {import("../types.js").ElectricityPlan} */
export const genesisEnergyPlusLowUserElectricityBundled = {
  id: "genesisEnergyPlusLowUserElectricityBundled",
  provider,
  name: "Electricity - Energy Plus Bundle",
  variant: "Low User",
  dailyMillicents: discount.bundled(103_500),
  rates: dailyRate(discount.bundled(29_580)),
  bundle: ["gas"],
};

/** @type {import("../types.js").PipedGasPlan} */
export const genesisEnergyPlusLowUserGas = {
  id: "genesisEnergyPlusLowUserGas",
  provider,
  name: "Gas - Energy Plus",
  variant: "Low User",
  dailyMillicents: discount.unbundled(164_150),
  kwhMillicents: discount.unbundled(13_350),
  bundle: [],
};

/** @type {import("../types.js").PipedGasPlan} */
export const genesisEnergyPlusLowUserGasBundled = {
  id: "genesisEnergyPlusLowUserGasBundled",
  provider,
  name: "Gas - Energy Plus Bundle",
  variant: "Low User",
  dailyMillicents: discount.bundled(164_150),
  kwhMillicents: discount.bundled(13_350),
  bundle: ["electricity"],
};
