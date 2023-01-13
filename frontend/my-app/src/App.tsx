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
			if (roleTypes !== null) {
				roleTypes.push(newRoleType);
			}
			setNewRoleType("");

			//if (document && document.getElementById("textRole") != null) document.getElementById("textRole").value = "";
		}
		render(<HookForm />);
	}

	async function getRoleTypesList(): Promise<void> {
		//console.log(theContract?.address);
		if (theContract == null) await connectContract();

		if (theContract != null) {
			console.log("Getting the roles");
			const roles = await theContract.getRoleTypes();

			setRoleTypes(roles);

			console.log(roles);
			let index = 0;
			let newArr = roles.map((item: string) => {
				return index + roles[index++];
			});
			console.log(newArr);
		}
	}

	return (
		<ChakraProvider theme={theme}>
			<Box marginTop={0} textAlign="center" fontSize="xl">
				<ColorModeSwitcher padding={10} justifySelf="center" />
				<VStack spacing={20}>
					(! {account} &&
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
						<Roles roles={roleTypes!} />
					</Box>
				</VStack>
			</Box>
		</ChakraProvider>
	);
};
