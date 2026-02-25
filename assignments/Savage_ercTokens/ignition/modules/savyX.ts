import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ERC20Module", (m) => {
  const erc20 = m.contract("SavyXERC20", ["SAVYX", "SVX", 6, 2000000000]);

  return { erc20 };
});
