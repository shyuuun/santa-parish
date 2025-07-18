// Routes for the application

type Route = Record<string, string>;

export const auth: Route = {
	login: "/login",
	logout: "/logout",
	register: "/register",
	forgetPassword: "/forget-password",
};

export const user: Route = {
	home: "/home",
	loan: "/home/loans",
	profile: "/home/profile",
	profileEdit: "/home/profile/edit",
	profileSecurity: "/home/profile/security",
	transaction: "/home/transaction",
};

export const admin: Route = {
	home: "/dashboard",
	users: "/dashboard/users",
	admins: "/dashboard/admins",
	announcements: "/dashboard/announcements",
	loans: "/dashboard/loans",
};
