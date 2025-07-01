"use server";

import { createClient } from "@/src/utils/supabase/server";

export async function approveUser(userId: string) {
	console.log("Approving user with ID:", userId);
	const supabase = await createClient();

	// Update the user's role to 'user'
	const { error } = await supabase
		.from("user_roles")
		.update({
			role_id: 3,
		})
		.eq("user_id", userId);

	console.log("Update User Role Error:", error);

	if (error) {
		return {
			type: "failed",
			msg: `Error approving user: ${error.message}`,
		};
	}

	return {
		type: "success",
		msg: "User approved successfully.",
	};
}
