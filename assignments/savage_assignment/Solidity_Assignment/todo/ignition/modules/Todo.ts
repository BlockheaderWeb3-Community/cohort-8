import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TodoModule", (m) => {
  const counter = m.contract("Todo");

  // m.call(counter, "incBy", [5n]);   
  return { counter };
});
