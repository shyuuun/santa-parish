import { createClient } from "@/src/utils/supabase/server";
import LogoutBtn from "./components/LogoutBtn";
import { redirect } from "next/navigation";

export default async function AccountPage() {
	const supabase = await createClient();

	const user = await supabase.auth.getUser();

	if (!user.data.user?.id) {
		redirect("/login");
	}

	return (
		<>
			<h1>Hello {user.data.user?.email}</h1>
			<LogoutBtn />
		</>
	);
}
