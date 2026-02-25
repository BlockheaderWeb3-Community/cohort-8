import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Erc20Module", (m) => {
  const erc20 = m.contract("ERC20", ["LONER", "LNR", 6, 1000000000000000n]);

//   m.call(erc20, "incBy", [5n]);

  return { erc20 };
});
