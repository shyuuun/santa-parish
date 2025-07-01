import { SupabaseClient } from "@supabase/supabase-js";

/**
 * @param supabase - An instance of SupabaseClient or a Promise that resolves to it.
 * @param uuid - The UUID of the user whose role is to be fetched.
 * @returns The role ID of the user or null if not found or an error occurs.
 * Fetches the role of a user by their UUID from the 'user_roles' table.
 */
export async function getUserRole(
	supabase: SupabaseClient | Promise<SupabaseClient>,
	uuid: string
): Promise<number | null> {
	let sbase;

	if (supabase instanceof SupabaseClient) {
		sbase = supabase;
	} else {
		sbase = await supabase;
	}

	const { data, error } = await sbase
		.from("user_roles")
		.select("role_id")
		.eq("user_id", uuid)
		.single();

	console.log("Fetching user role for UUID:", data?.role_id);

	if (error) {
		console.error("Error fetching user info:", error);
		return null;
	}
	return data ? data.role_id : null;
}
