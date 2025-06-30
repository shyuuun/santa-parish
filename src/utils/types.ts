import { Tables } from "./database.types";

// Type definitions
export interface RouteLink {
	id: string;
	name: string;
	location: string;
	isActive: boolean;
	isDropdown?: boolean;
	dropdownItems?: {
		name: string;
		location: string;
	}[];
}

export const USER_ROLES = Object.freeze({
	1: "ADMIN",
	2: "UNVERIFIED",
	3: "MEMBER",
});

// Type for user with roles view
// other way to define the type
// export type UserWithRoles =
// 	Database["public"]["Views"]["user_with_roles"]["Row"];

// shorter way to define the type
// export type UserWithRoles = Tables<"user_with_roles">;

export type Admins = Tables<"admins">;
export type Users = Tables<"users_complete_profiles">;

export type ActionStatus = {
	type: string;
	msg?: string;
};

export type UserAdditionalInfo = Tables<"user_add_info">;
