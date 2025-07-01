"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/src/utils/supabase/server";
import { getUserRole } from "@/src/utils/supabaseUtils";
import { ActionStatus } from "@/src/utils/types";

export async function login(formData: FormData): Promise<ActionStatus | void> {
	const supabase = await createClient();

	const dataForm = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	console.log(dataForm);

	const { data, error } = await supabase.auth.signInWithPassword(dataForm);

	console.log(`----------> ${data.user?.email}`);
	console.log(`----------> ${data.user?.id}`);

	if (error) {
		return {
			type: "failed",
			msg: `${error}`,
		};
	}

	const getRole = await getUserRole(supabase, data.user?.id || "");

	console.log(`----------> User role: ${getRole}`);

	if (getRole === null) {
		return {
			type: "failed",
			msg: `Error fetching user role.`,
		};
	}

	switch (getRole.toString()) {
		case "1":
			console.log("ADMIN");
			redirect("/dashboard");
		case "2":
			console.log("Unverified");
			// After login, we are still given a token, but the user is not verified
			// We need to remove the session token, by signing out
			await supabase.auth.signOut();
			// Redirect to login with a message
			return {
				type: "failed",
				msg: `Your account is not verified. Please wait for admin approval.`,
			};
		case "3":
			console.log("Verified");
			redirect("/account");
		default:
			redirect("/login");
	}
}

export async function register(
	formData: FormData
): Promise<ActionStatus | void> {
	const supabase = await createClient();

	const dataForm = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	console.log(dataForm);

	const { data, error } = await supabase.auth.signUp(dataForm);

	console.log(`----------> ${data.user?.email}`);

	if (error) {
		return {
			type: "failed",
			msg: `${error}`,
		};
	} else {
		return {
			type: "success",
			msg: `Successfully registered!`,
		};
	}
}
