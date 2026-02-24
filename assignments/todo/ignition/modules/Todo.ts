import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Todo", (m) => {
    const todo = m.contract("Todo");

    return {
        todo,
    };
})