import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ERC721Module", (m) => {
  const erc721 = m.contract("ERC721", [
    "DEFI-WOMAN",
    "WIDNFT",
    "ipfs://bafkreih4myeqd4jpuxj2lv7aqdyayvfvj2wa25yus52jnq7nnge5vacmti/"
  ]);

  return { erc721 };
});