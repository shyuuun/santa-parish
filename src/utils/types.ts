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
	1: "admin",
	2: "unverified",
	3: "verified",
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

// Loan types
export type LoanApplication = Tables<"loan_applications">;
export type LoanDetail = Tables<"loan_details">;
export type Payment = Tables<"payments">;

// Combined loan application with user info for admin dashboard
export type LoanApplicationWithUser = LoanApplication & {
	users_complete_profiles?: {
		name: string;
		email: string;
	};
};

// Combined loan detail with application and user info
export type LoanDetailWithInfo = LoanDetail & {
	loan_applications?: LoanApplication & {
		users_complete_profiles?: {
			name: string;
			email: string;
		};
	};
};

// Announcement types
export type Announcement = Tables<"announcements">;

export type AnnouncementCardProps = {
	announcement: Announcement;
	isAdmin?: boolean;
	onDelete?: () => void;
	onRefresh?: () => void;
};

export type AnnouncementViewProps = {
	announcement: Announcement;
	isAdmin?: boolean;
	backUrl?: string;
	backLabel?: string;
};
