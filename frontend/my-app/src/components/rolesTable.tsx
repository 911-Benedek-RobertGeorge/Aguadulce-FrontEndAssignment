import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, Box } from "@chakra-ui/react";
//dont think is a good idea to use that function here
export default function Roles() {
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
						<Tr>
							<Td>inches</Td>
							<Td>1</Td>
						</Tr>
						<Tr>
							<Td>feet</Td>
							<Td>2</Td>
						</Tr>
						<Tr>
							<Td>yards</Td>
							<Td>3</Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}
