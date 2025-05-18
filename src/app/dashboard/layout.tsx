// TODO : Make the CSS more readable
"use client";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { RouteLink } from "@/src/utils/types";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const links: RouteLink[] = [
		{
			id: 1,
			name: "Dashboard",
			location: "/dashboard",
			isActive: false,
		},
		{
			id: 2,
			name: "Section A",
			location: "/dashboard/sectionA",
			isActive: false,
		},
		{
			id: 3,
			name: "Section B",
			location: "/dashboard/sectionB",
			isActive: false,
		},
		{
			id: 4,
			name: "Section C",
			location: "/dashboard/sectionC",
			isActive: false,
		},
	];

	return (
		<main className={` sidebar grid grid-cols-5 h-screen`}>
			<Sidebar links={links} />
			<div className="col-span-4">
				<Navbar />
				<div className="p-4">{children}</div>
			</div>
		</main>
	);
}
