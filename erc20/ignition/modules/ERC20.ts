import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule('ERC20Module', (m) => {
    const erc20 = m.contract('ERC20', ['LONER', 'LNR', 6, 2000000000])
    return {erc20}
})