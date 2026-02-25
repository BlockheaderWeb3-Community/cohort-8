import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Erc721ModuleV3", (m) => {
  const erc721 = m.contract("ERC721", ["LONER", "LNR", "ipfs://bafybeigzethrlb2nu7hlhg6q2lx55irmjsasedonyckmdad262anokgefu/"]);

//   m.call(erc20, "incBy", [5n]);

  return { erc721 };
});
