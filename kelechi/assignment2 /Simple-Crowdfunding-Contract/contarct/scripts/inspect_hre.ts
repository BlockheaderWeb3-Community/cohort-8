import hre from "hardhat";

async function main() {
    console.log("HRE Keys:", Object.keys(hre));
    if ((hre as any).loadFixture) console.log("Found loadFixture on HRE");
    if ((hre as any).time) console.log("Found time on HRE");
    if ((hre as any).networkHelpers) console.log("Found networkHelpers on HRE");
}

main().catch(console.error);
