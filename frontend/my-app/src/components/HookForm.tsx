import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function HookForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [data, setData] = useState("");

	const onSubmit = (data: any) => console.log(data);
	//console.log(errors);

	return (
		<form onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}>
			<label>Address: </label>
			<input type="text" placeholder="Member Address" {...(register("address"), { required: true })} />
			<br></br>
			<label>Role: </label>
			<input type="number" placeholder="Role Type" {...(register("roleType"), { required: true })} />
			{errors.address && <p>Address is required.</p>}
			<p>{data}</p>
			<input type="submit" value="Add" />
		</form>
	);
}
