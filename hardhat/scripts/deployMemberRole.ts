import { ethers } from "hardhat";

async function main() {
	const memberRoleFactory = await ethers.getContractFactory("MemberRole");

	const memberRole = await memberRoleFactory.deploy();

	await memberRole.deployed(); /// just waiting for the block to be included in a block

	console.log(`MemberRole deployed to ${memberRole.address} `);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => { 
	console.error(error);
	process.exitCode = 1;
});
