"use client";
import { createContext, SetStateAction, useEffect, useState } from "react";
import { createClient } from "../supabase/cilent";
import { USER_ROLES } from "../types";
import { getUserRole } from "../supabaseUtils";

type UserInfo = {
	uuid: string;
	email: string;
	role: string;
};

export const UserInfoContext = createContext<{
	userInfo: UserInfo | null;
	setUserInfo: React.Dispatch<SetStateAction<UserInfo | null>>;
} | null>(null);

export const UserInfoProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	useEffect(() => {
		const fetchUserInfo = async () => {
			const supabase = createClient();
			const user = await supabase.auth.getUser();
			if (user.data.user!.id) {
				const role = await getUserRole(supabase, user.data.user!.id);
				const userRole = USER_ROLES[role as keyof typeof USER_ROLES];

				setUserInfo({
					uuid: user.data.user!.id,
					email: user.data.user!.email || "",
					role: userRole || "UNKNOWN",
				});
			}
		};

		fetchUserInfo();
	});

	return (
		<UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
			{children}
		</UserInfoContext.Provider>
	);
};
