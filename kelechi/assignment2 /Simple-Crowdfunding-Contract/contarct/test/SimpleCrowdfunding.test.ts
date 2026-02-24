import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";

describe("SimpleCrowdfunding", function () {
    let provider: ethers.BrowserProvider;

    before(async function () {
        console.log("HRE Keys:", Object.keys(hre));
        if (hre.network) {
            console.log("Network Keys:", Object.keys(hre.network));
            console.log("Network provider:", hre.network.provider);
        } else {
            console.log("hre.network is undefined");
        }

        if (!hre.network.provider) {
            // Fallback: try to see if 'provider' is on HRE directly?
            // console.log("HRE.provider:", (hre as any).provider);
        }

        // Connect manual provider to Hardhat network (if available)
        if (hre.network && hre.network.provider) {
            provider = new ethers.BrowserProvider(hre.network.provider as any);
        } else {
            throw new Error("Cannot Init Provider");
        }
    });

    const time = {
        latest: async () => {
            const block = await provider.getBlock("latest");
            if (!block) throw new Error("Could not get latest block");
            return block.timestamp;
        },
        increase: async (seconds: number) => {
            await provider.send("evm_increaseTime", [ethers.toBeHex(seconds)]);
            await provider.send("evm_mine", []);
        }
    };

    async function deployCrowdfunding() {
        const artifact = await hre.artifacts.readArtifact("SimpleCrowdfunding");

        // Get signers
        const owner = await provider.getSigner(0);
        const contributor1 = await provider.getSigner(1);
        const contributor2 = await provider.getSigner(2);

        const goal = ethers.parseEther("10"); // 10 ETH goal
        const duration = 60 * 60; // 1 hour

        const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, owner);
        const crowdfunding = await factory.deploy(goal, duration);
        await crowdfunding.waitForDeployment();

        return { crowdfunding, owner, contributor1, contributor2, goal, duration };
    }

    describe("Deployment", function () {
        it("Should set the correct owner, goal, and deadline", async function () {
            const { crowdfunding, owner, goal, duration } = await deployCrowdfunding();

            expect(await crowdfunding.owner()).to.equal(await owner.getAddress());
            expect(await crowdfunding.goal()).to.equal(goal);

            const currentBlockTime = await time.latest();
            expect(await crowdfunding.deadline()).to.be.closeTo(currentBlockTime + duration, 5);
        });
    });

    // Keep strict subset of tests for debugging
    describe("Contributions", function () {
        it("Should allow contributions and update state", async function () {
            const { crowdfunding, contributor1 } = await deployCrowdfunding();
            const contributionAmount = ethers.parseEther("1");

            const contractAsContributor = crowdfunding.connect(contributor1) as ethers.Contract;
            await contractAsContributor.contribute({ value: contributionAmount });

            expect(await crowdfunding.raisedAmount()).to.equal(contributionAmount);
            expect(await crowdfunding.getContribution(await contributor1.getAddress())).to.equal(contributionAmount);
        });
    });
});
