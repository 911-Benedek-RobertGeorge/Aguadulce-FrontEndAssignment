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
import { stringify } from "querystring";
import { render } from "@testing-library/react";

import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from "@chakra-ui/react";

export const App = () => {
	const [isMetamaskInstalled, setIsMetamaskInstalled] = React.useState<boolean>(false);
	const [account, setAccount] = React.useState<string>("");
	const [theContract, setTheContract] = useState<Contract | null>(null);
	const [newRoleType, setNewRoleType] = useState<string>("");

	const [roleTypes, setRoleTypes] = useState<string[] | null>(null);
	const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

	useEffect(() => {
		if ((window as any).ethereum) {
			//check if Metamask wallet is installed
			setIsMetamaskInstalled(true);
		}
	}, []);

	useEffect(() => {
		console.log("Get the contract");
		if (account !== "" && theContract == null) connectContract();
	}, [account]);

	useEffect(() => {
		console.log("Show the table");
	}, [roleTypes]);

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

		const signer = provider.getSigner();

		const contractUser = await signer.getAddress();
		const contractUserBalance = await provider.getBalance(contractUser);
		const amount = ethers.utils.formatEther(contractUserBalance);
		console.log(amount);

		const contract = new ethers.Contract(CONTRACT_ADDRESS, MemberRoleABI, signer);

		setTheContract(contract);
		console.log("Got the contract" + contract.address);
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
		if (theContract == null) await connectContract();
		console.log("Add new role type : " + newRoleType);
		if (theContract != null && newRoleType != "") {
			console.log("start tx");
			let tx = await theContract.addRoleType(newRoleType);
			console.log(tx.hash);
			await tx.wait();
			// if (roleTypes !== null) {
			// 	let list = roleTypes;
			// 	list.push(newRoleType);
			// 	setRoleTypes(list);
			// 	render(<HookForm />);
			// }
			// console.log(roleTypes);
			setNewRoleType("");
		}
	}
	async function addRole(): Promise<void> {
		if (theContract != null) {
			console.log("start assign role tx");
			let tx = await theContract.addRole("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92111", 1);
			console.log(tx.hash);
			await tx.wait();

			getAddresses();
			// if (roleTypes !== null) {
			// 	let list = roleTypes;
			// 	list.push(newRoleType);
			// 	setRoleTypes(list);
			// 	render(<HookForm />);
			// }
			// console.log(roleTypes);
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

	async function getRoleTypesList(): Promise<void> {
		//console.log(theContract?.address);
		if (theContract == null) await connectContract();

		if (theContract != null) {
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
						<Button onClick={addRole} colorScheme="teal" size="md">
							Show Roles
						</Button>
						<Roles roles={roleTypes!} />
					</Box>
				</VStack>
			</Box>
		</ChakraProvider>
	);
};
