import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, Box } from "@chakra-ui/react";
//dont think is a good idea to use that function here
export default function Roles({ roles }: { roles: string[] }) {
	if (roles == null) return <h1>To be shown</h1>;
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
