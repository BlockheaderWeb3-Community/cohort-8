import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TodoModule", (m) => {
  const todo = m.contract("Todo");
  

  //m.call(counter, "incBy", [5n]);

  return { todo };
});
