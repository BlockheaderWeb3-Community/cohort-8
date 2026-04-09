import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TodoModule", (m) => {
  const counter = m.contract("Todo");

  return { counter };
});
