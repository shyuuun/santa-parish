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
			redirect("/home");
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

export async function sendPasswordResetEmail(
	formData: FormData
): Promise<ActionStatus | void> {
	const supabase = await createClient();

	const email = formData.get("email") as string;

	if (!email) {
		return {
			type: "failed",
			msg: "Email is required",
		};
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return {
			type: "failed",
			msg: "Please enter a valid email address",
		};
	}

	console.log(`Sending password reset email to: ${email}`);

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${
			process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
		}/reset-password`,
	});

	if (error) {
		console.error("Password reset error:", error);
		return {
			type: "failed",
			msg: `Error: ${error.message}`,
		};
	} else {
		return {
			type: "success",
			msg: `If an account with that email exists, a password reset link has been sent.`,
		};
	}
}

export async function updatePassword(
	formData: FormData
): Promise<ActionStatus | void> {
	const supabase = await createClient();

	// First, verify we have an authenticated user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return {
			type: "failed",
			msg: "You must be authenticated to update your password",
		};
	}

	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!password || !confirmPassword) {
		return {
			type: "failed",
			msg: "Both password fields are required",
		};
	}

	if (password !== confirmPassword) {
		return {
			type: "failed",
			msg: "Passwords do not match",
		};
	}

	if (password.length < 6) {
		return {
			type: "failed",
			msg: "Password must be at least 6 characters long",
		};
	}

	const { error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) {
		console.error("Password update error:", error);
		return {
			type: "failed",
			msg: `Error: ${error.message}`,
		};
	}

	return {
		type: "success",
		msg: "Password updated successfully!",
	};
}
