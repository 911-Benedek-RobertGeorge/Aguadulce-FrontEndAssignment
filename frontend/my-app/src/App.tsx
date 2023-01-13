import * as React from "react";

import { ChakraProvider, Box, VStack, theme, Input, Button } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import HookForm from "./components/HookForm";
import Roles from "./components/rolesTable";
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { MemberRoleABI } from "./utils/abi";

export const App = () => {
	//the address of the metamask account conected
	const [account, setAccount] = React.useState<string>("");

	// the MemberRole Contract instance
	const [theContract, setTheContract] = useState<Contract | null>(null);

	// the Role type that is going to be added to the contract
	const [newRoleType, setNewRoleType] = useState<string>("");

	// an array of roles read from the contract
	const [roleTypes, setRoleTypes] = useState<string[] | null>(null);

	// the address of the contract
	const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

	// when we got the metamask address we now can get the contract instance
	useEffect(() => {
		console.log("Get the contract");
		if (account !== "" && theContract == null) connectContract();
	}, [account]);

	// connect to the metamask wallet and get the account
	async function connectWallet(): Promise<void> {
		//to get around type checking
		(window as any).ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts: string[]) => {
				setAccount(accounts[0]);
			})
			.catch((error: any) => {
				alert(`Something went wrong: ${error}`);
			});
	}

	// get the contract instance and store it in theContract state variable
	async function connectContract(): Promise<void> {
		console.log("starting to get the contract");
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		const signer = provider.getSigner();

		//just curiosity of how getting the balance works and debugging
		const contractUser = await signer.getAddress();
		const contractUserBalance = await provider.getBalance(contractUser);
		const amount = ethers.utils.formatEther(contractUserBalance);
		console.log(amount);

		//I intentionally removed dotenv from .gitignore so you can see the file
		// const dotenv = require("dotenv");
		// dotenv.config();
		// const addr = String(process.env.CONTRACT_ADDRESS);

		const contract = new ethers.Contract(CONTRACT_ADDRESS, MemberRoleABI, signer);

		setTheContract(contract);
		console.log("Got the contract" + contract.address);
	}

	//adding a new role name to the contract
	async function addRoleType(): Promise<void> {
		if (theContract == null) await connectContract();
		console.log("Add new role type : " + newRoleType);
		if (theContract != null && newRoleType !== "") {
			console.log("start tx");
			let tx = await theContract.addRoleType(newRoleType);
			console.log(tx.hash);
			await tx.wait();
			setNewRoleType("");
		} else {
			alert("You have to give a name to the role");
		}
	}

	// just for debugging purpouse
	async function addRole(): Promise<void> {
		if (theContract != null) {
			console.log("start assign role tx");
			let tx = await theContract.addRole("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92111", 1);
			console.log(tx.hash);
			await tx.wait();
			getAddresses();
		}
	}

	// I just wanted to verify if we add any members to the contract
	async function getAddresses(): Promise<void> {
		if (theContract != null) {
			console.log("Getting the addresses");
			console.log("start assign role tx");
			const index = await theContract.membersCount();

			const addresses = await theContract.addresses(index - 1); // last added member
			console.log(addresses);
		}
	}

	//get the list of roles from the contract
	async function getRoleTypesList(): Promise<void> {
		if (theContract != null) {
			await connectContract();
			console.log("Getting the roles");
			const roles = await theContract.getRoleTypes();
			setRoleTypes(roles);
		}
	}

	return (
		<ChakraProvider theme={theme}>
			<Box marginTop={0} textAlign="center" fontSize="xl">
				<ColorModeSwitcher padding={10} justifySelf="center" />
				<VStack spacing={20}>
					<Button onClick={connectWallet} borderRadius="50" bg="blue.400" color="white" px={100} h={20}>
						Connect wallet
					</Button>

					<Box>
						<Input id="textRole" onChange={(event) => setNewRoleType(event.target.value)} marginBottom={11} maxW="md" placeholder="Role name" />
						<Box as="button" onClick={addRoleType} borderRadius="md" bg="blue.400" color="white" px={4} h={8}>
							Add new role
						</Box>
					</Box>
					<Box>
						<HookForm contract={theContract!} />
					</Box>
					<Box>
						<Button onClick={getRoleTypesList} colorScheme="teal" size="md">
							Show Roles
						</Button>
						<Roles roles={roleTypes!} />
					</Box>
				</VStack>
			</Box>
		</ChakraProvider>
	);
};
