import { createClient } from "@/src/utils/supabase/server";
import LogoutBtn from "./components/LogoutBtn";
import { redirect } from "next/navigation";
import { USER_ROLES } from "@/src/utils/types";
import { getUserRole } from "@/src/utils/supabaseUtils";

export default async function AccountPage() {
	const supabase = await createClient();

	const user = await supabase.auth.getUser();

	const userRoleId = await getUserRole(supabase, user.data.user?.id || "");
	const userRole =
		USER_ROLES[userRoleId as keyof typeof USER_ROLES] || "UNKNOWN";

	if (!user.data.user?.id) {
		redirect("/login");
	}

	return (
		<>
			<h1>User Info:</h1>
			<ul>
				<li>ID: {user.data.user.id} </li>
				<li>Email: {user.data.user.email}</li>
				<li>Created at: {user.data.user.created_at}</li>
				<li>Role: {userRole}</li>
			</ul>
			<LogoutBtn />
		</>
	);
}
