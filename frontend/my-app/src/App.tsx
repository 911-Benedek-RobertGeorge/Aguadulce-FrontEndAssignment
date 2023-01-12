import * as React from "react";

import { ChakraProvider, Box, Text, Link, VStack, Code, Grid, theme, Input, GridItem, Button } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import HookForm from "./components/HookForm";
import Roles from "./components/rolesTable";
import { useEffect } from "react";

export const App = () => {
	const [isMetamaskInstalled, setIsMetamaskInstalled] = React.useState<boolean>(false);
	const [account, setAccount] = React.useState<string | null>(null);

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
	return (
		<ChakraProvider theme={theme}>
			<Box marginTop={0} textAlign="center" fontSize="xl">
				<ColorModeSwitcher padding={10} justifySelf="center" />
				<VStack spacing={20}>
					<Button onClick={connectWallet} borderRadius="50" bg="blue.400" color="white" px={100} h={20}>
						Connect wallet
					</Button>
					<Box>
						<Input marginBottom={11} maxW="md" placeholder="Basic usage" />
						<Box as="button" borderRadius="md" bg="blue.400" color="white" px={4} h={8}>
							Add new role
						</Box>
					</Box>

					<Box>
						<h1>Add a role to a member</h1>
						<HookForm />
					</Box>
					<Roles />
				</VStack>
			</Box>
		</ChakraProvider>
	);
};
