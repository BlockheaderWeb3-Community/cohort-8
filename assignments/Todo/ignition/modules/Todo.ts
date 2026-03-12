import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TodoModule", (m) => {
  const todo = m.contract("TodoContract");

  return { todo };
}); 
