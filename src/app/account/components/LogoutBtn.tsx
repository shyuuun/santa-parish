"use client";

import { createClient } from "@/src/utils/supabase/cilent";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
	const supabase = createClient();
	const router = useRouter();



	const logout = async () => {
		await supabase.auth.signOut();
		router.replace("/login");
	};

	return <button onClick={logout}>Log out</button>;
}
