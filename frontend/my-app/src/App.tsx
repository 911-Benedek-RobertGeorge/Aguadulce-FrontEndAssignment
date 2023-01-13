import * as React from "react";

import { ChakraProvider, Box, Text, Link, VStack, Code, Grid, theme, Input, GridItem, Button } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import HookForm from "./components/HookForm";
import Roles from "./components/rolesTable";
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { AbiItem } from "web3-utils";
import Abi from "./utils/MemberRole.json";
import Web3 from "web3";
import { MemberRoleABI } from "./utils/abi";
export const App = () => {
	const [isMetamaskInstalled, setIsMetamaskInstalled] = React.useState<boolean>(false);
	const [account, setAccount] = React.useState<string>("");
	const [theContract, setTheContract] = useState<Contract | null>(null);
	const [newRoleType, setNewRoleType] = useState<String>("");

	const [roleTypes, setRoleTypes] = useState<string[] | null>(null);
	const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

	useEffect(() => {
		if ((window as any).ethereum) {
			//check if Metamask wallet is installed
			setIsMetamaskInstalled(true);
		}
	}, []);

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

	async function connectContract(): Promise<void> {
		console.log("starting to get the contract");
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log("provider " + provider);

		const signer = provider.getSigner(account);
		console.log("signer " + signer);
		const contractUser = await signer.getAddress();
		const contractUserBalance = await provider.getBalance(contractUser);
		const amount = ethers.utils.formatEther(contractUserBalance);
		console.log(amount);

		const contract = new ethers.Contract(CONTRACT_ADDRESS, MemberRoleABI, signer);

		setTheContract(contract);
		// const contract = await memberRole.attach(CONTRACT_ADDRESS);

		// console.log(JSON.stringify(contract.abi));
		// //const { ethereum } = window;
		// //const cv = require("Web3");
		// const web3 = new Web3("http://localhost:8545");
		// const helloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
		// const memberRoleContract = new web3.eth.Contract(CONTRACT_ADDRESS);
		// console.log(memberRoleContract.methods.getRoleTypes());
	}

	async function addRoleType(): Promise<void> {
		await connectContract();
		console.log("Add new role type : " + newRoleType);
		if (theContract != null && newRoleType != "") {
			let tx = await theContract.addRoleType(newRoleType);
			console.log(tx.hash);
			await tx.wait();
			setNewRoleType("");
			//if (document && document.getElementById("textRole") != null) document.getElementById("textRole").value = "";
		}
	}

	async function getRoleTypesList(): Promise<void> {
		//await connectContract();

		if (theContract != null) {
			const roles = await theContract.getRoleTypes();
			setRoleTypes(roles);
		}
		console.log(roleTypes);
	}

	return (
		<ChakraProvider theme={theme}>
			<Box marginTop={0} textAlign="center" fontSize="xl">
				<ColorModeSwitcher padding={10} justifySelf="center" />
				<VStack spacing={20}>
					(! {account} && ASD &&
					<Button onClick={connectWallet} borderRadius="50" bg="blue.400" color="white" px={100} h={20}>
						Connect wallet
					</Button>
					)
					<Box>
						<Input id="textRole" onChange={(event) => setNewRoleType(event.target.value)} marginBottom={11} maxW="md" placeholder="Role name" />
						<Box as="button" onClick={addRoleType} borderRadius="md" bg="blue.400" color="white" px={4} h={8}>
							Add new role
						</Box>
					</Box>
					<Box>
						<h1>Add a role to a member</h1>
						<HookForm />
					</Box>
					<Box>
						<Button onClick={getRoleTypesList} colorScheme="teal" size="md">
							Show Roles
						</Button>

						<Roles />
					</Box>
				</VStack>
			</Box>
		</ChakraProvider>
	);
};
