"use server";

/**
 * This file contains server actions for creating and deleting users in supabase
 */

import { createClient } from "@supabase/supabase-js";

export async function createUser(formData: FormData) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SERVICE_ROLE!
	);

	const dataForm = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	if (!dataForm.email || !dataForm.password) {
		return {
			type: "failed",
			msg: "Email and password are required.",
		};
	}

	// Create a new user in Supabase
	const { data, error } = await supabase.auth.admin.createUser({
		email: dataForm.email,
		password: dataForm.password,
		email_confirm: true,
	});

	console.log("Create User Data:", data.user?.email);
	console.log("Create User Data:", data.user?.id);

	// Will upsert the user role to ADMIN
	const { data: userRoleData } = await supabase
		.from("user_roles")
		.upsert(
			{
				user_id: data.user?.id,
				role_id: 1, // Use the enum value here
			},
			{ onConflict: "user_id" }
		) // Specify the conflict target
		.select()
		.single();

	console.log("updated role", userRoleData);

	if (error) {
		return {
			type: "failed",
			msg: `Error creating user: ${error.message}`,
		};
	}

	return {
		type: "success",
		msg: `User ${data.user?.email} created successfully.`,
	};
}

export async function deleteUser(id: string) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SERVICE_ROLE!
	);

	const { error } = await supabase.auth.admin.deleteUser(id, true);
	console.log("Error deleting admn", error);
	if (error) {
		return {
			type: "failed",
			msg: `Error deleting user: ${error.message}`,
		};
	}

	return {
		type: "success",
		msg: `User with ID ${id} deleted successfully.`,
	};
}
