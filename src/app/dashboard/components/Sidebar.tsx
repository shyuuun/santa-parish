import Link from "next/link";
import logo from "@/public/logo.svg";
import Image from "next/image";

export default function Sidebar() {
	return (
		<aside className="bg-red-500 text-white flex flex-col py-4">
			<section className="flex items-center justify-center gap-2 mb-4 px-2">
				<Image
					className="rounded-full"
					src={logo}
					width={48}
					height={48}
					alt="Santa Parish Logo"
				/>
				<h1 className="font-serif">
					Santa Lucia Parish Multipurpose Cooperative
				</h1>
			</section>
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
		<Link
			className="py-4 px-2 w-full hover:bg-gray-500 transition duration-200 ease-in-out font-serif"
			href={location}
		>
			<li>{children}</li>
		</Link>
	);
}
