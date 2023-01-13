import { Contract, ethers } from "ethers";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function HookForm({ contract }: { contract: Contract }) {
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const handleChangeAddress = (event: { target: { value: React.SetStateAction<string> } }) => {
		setAddress(event.target.value);
	};

	const handleChangeRole = (event: { target: { value: React.SetStateAction<string> } }) => {
		setRole(Number(event.target.value));
	};

	const [data, setData] = useState("");
	const [address, setAddress] = useState<string>("");
	const [role, setRole] = useState<number>(-1);

	async function addRole(): Promise<void> {
		try {
			if (contract != null) {
				console.log("start assign role tx");

				let addressFormat = ethers.utils.getAddress(address);

				let tx = await contract.addRole(addressFormat, role);
				console.log(tx.hash);
				await tx.wait();
				// if (roleTypes !== null) {
				// 	let list = roleTypes;
				// 	list.push(newRoleType);
				// 	setRoleTypes(list);
				// 	render(<HookForm />);
				// }
				// console.log(roleTypes);
			}
		} catch (err) {
			alert("the address is not a valid address");
		}
	}
	//console.log(errors);

	return (
		<form>
			<label>Address: </label>
			<input onChange={handleChangeAddress} type="text" placeholder="Member Address" {...(register("address"), { required: true })} />
			<br></br>

			<label> Role: </label>
			<input
				onChange={handleChangeRole}
				style={{ marginTop: 10, marginBottom: 10, marginLeft: 30 }}
				type="number"
				placeholder="Role type id"
				{...(register("roleType"), { required: true })}
			/>

			<p>{data}</p>
			<button type="button" onClick={addRole} style={{ padding: 7, borderRadius: 20, backgroundColor: "#18A5D1", alignSelf: "center" }}>
				Assign a role
			</button>
		</form>
	);
}
