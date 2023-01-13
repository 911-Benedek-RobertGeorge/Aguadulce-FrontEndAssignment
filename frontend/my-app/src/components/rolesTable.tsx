import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Box } from "@chakra-ui/react";
//dont think is a good idea to use that function here, should use components
//Make a table with the roles names and ids
export default function Roles({ roles }: { roles: string[] }) {
	if (roles == null) return <Box></Box>;
	return (
		<Box>
			<TableContainer>
				<Table variant="simple">
					<TableCaption>Roles</TableCaption>
					<Thead>
						<Tr>
							<Th>Roles</Th>
							<Th>Ids</Th>
						</Tr>
					</Thead>

					<Tbody>
						{roles.map((name: string, index: number) => {
							return (
								<Tr>
									<Td>{name}</Td>
									<Td>{index}</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}
