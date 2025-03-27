"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/src/utils/supabase/server";

export type AuthStatus = {
	type: string;
	msg?: string;
};

export async function login(formData: FormData) {
	const supabase = await createClient();

	const dataForm = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	console.log(dataForm);

	const { data, error } = await supabase.auth.signInWithPassword(dataForm);

	console.log(`----------> ${data.user?.email}`);

	// if (error) {
	// 	console.log(`--------------> ${error}`);
	// 	// redirect("/error");

	// 	return `ERROR: ${error}`;
	// }

	if (error) {
		return {
			type: "failed",
			msg: `${error}`,
		};
	} else {
		redirect("/account");
	}

	// return `You login as ${data.user?.email}`;

	// revalidatePath("/", "layout");
	// redirect("/");
}

export async function register(formData: FormData) {
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
