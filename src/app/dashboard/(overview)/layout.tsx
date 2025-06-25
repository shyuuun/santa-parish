// TODO : Make the CSS more readable
"use client";
import Sidebar from "./components/Sidebar";
import { RouteLink } from "@/src/utils/types";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const links: RouteLink[] = [
		{
			id: "home",
			name: "Home",
			location: "/dashboard",
			isActive: false,
		},
		{
			id: "users-dropdown",
			name: "Users",
			location: "/dashboard/users",
			isActive: false,
			isDropdown: true,
			dropdownItems: [
				{
					name: "All Users",
					location: "/dashboard/users",
				},
				{
					name: "Admins",
					location: "/dashboard/admins",
				},
			],
		},
		{
			id: "loans",
			name: "Loans",
			location: "/dashboard/loans",
			isActive: false,
		},
		{
			id: "announcements",
			name: "Announcement",
			location: "/dashboard/announcements",
			isActive: false,
		},
	];

	return (
		<main className={`sidebar grid grid-cols-6 h-screen`}>
			<Sidebar links={links} />
			<div className="col-span-5 p-12">{children}</div>
		</main>
	);
}
