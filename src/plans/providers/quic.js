import { $ToMc, internetPlan } from "../utils.js";

export const quicRunner = internetPlan({
  id: "quicRunner",
  provider: "Quic",
  name: "Runner",
  monthlyMillicents: $ToMc(79),
  bundle: [],
});
