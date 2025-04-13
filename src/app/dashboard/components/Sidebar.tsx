import Link from "next/link";

export default function Sidebar() {
	return (
		<aside className="bg-red-500 text-white flex flex-col py-4">
			<section>Header</section>
			<ul className="flex flex-col items-center justify-center">
				<SidebarLink location="/dashboard">Home</SidebarLink>
				<SidebarLink location="/dashboard/sectionA">
					Section 1
				</SidebarLink>
				<SidebarLink location="/dashboard/sectionB">
					Section 2
				</SidebarLink>
				<SidebarLink location="/dashboard/sectionC">
					Section 3
				</SidebarLink>
			</ul>
		</aside>
	);
}

function SidebarLink({
	children,
	location,
}: {
	children: React.ReactNode;
	location: string;
}) {
	return (
		<li className="py-4 px-2 w-full text-center hover:bg-gray-500 transition duration-200 ease-in-out">
			<Link href={location}>{children}</Link>
		</li>
	);
}
