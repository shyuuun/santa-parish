import { createClient } from "@/src/utils/supabase/server";
import LogoutBtn from "./components/LogoutBtn";
import { redirect } from "next/navigation";
import { USER_ROLES } from "@/src/utils/types";
import { getUserRole } from "@/src/utils/supabaseUtils";

export default async function AccountPage() {
	return (
		<>
			<h1>User Info:</h1>
		</>
	);
}
