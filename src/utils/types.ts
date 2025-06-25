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
