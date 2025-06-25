// Routes for the application

type Route = Record<string, string>;

export const auth: Route = {
	login: "/login",
	logout: "/logout",
	register: "/register",
	forgetPassword: "/forget-password",
};

export const user: Route = {};

export const admin: Route = {
	dashboard: "/d"
};


