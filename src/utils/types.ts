// Type definitions
export interface RouteLink {
	id: number;
	name: string;
	location: string;
	isActive: boolean;
}

export const USER_ROLES = Object.freeze({
	1: "ADMIN",
	2: "UNVERIFIED",
	3: "MEMBER",
});
