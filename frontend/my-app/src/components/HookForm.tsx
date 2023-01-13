import { Contract, ethers } from "ethers";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Would have been easier with just 2 imports, but I wanted to see how working with form is
export default function HookForm({ contract }: { contract: Contract }) {
	const {
		register,

		formState: { errors },
	} = useForm();

	//get the values from the form, I get them onChange,
	// a better solution would be only to take them on button press
	const handleChangeAddress = (event: { target: { value: React.SetStateAction<string> } }) => {
		setAddress(event.target.value);
	};

	const handleChangeRole = (event: { target: { value: React.SetStateAction<string> } }) => {
		setRole(Number(event.target.value));
	};

	const [address, setAddress] = useState<string>("");
	const [role, setRole] = useState<number>(-1);

	//Assign a role to an address
	async function addRole(): Promise<void> {
		try {
			if (contract != null) {
				console.log("start assign role tx");

				//change the string to an address format
				let addressFormat = ethers.utils.getAddress(address);

				let tx = await contract.addRole(addressFormat, role);
				console.log(tx.hash);
				await tx.wait();
			}
		} catch (err) {
			alert("the address is not a valid address");
		}
	}

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
			<br></br>
			<button type="button" onClick={addRole} style={{ padding: 7, borderRadius: 20, backgroundColor: "#18A5D1", alignSelf: "center" }}>
				Assign a role
			</button>
		</form>
	);
}
