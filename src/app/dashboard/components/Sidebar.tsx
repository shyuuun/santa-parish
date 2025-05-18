import Link from "next/link";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { RouteLink } from "@/src/utils/types";
import { usePathname } from "next/navigation";

interface SidebarProps {
	links: RouteLink[];
}

export default function Sidebar({ links }: SidebarProps) {
	const pathname = usePathname();
	return (
		<aside className="flex flex-col dashboard_sidebar">
			<section className="flex items-center justify-center gap-2 mb-4 px-2">
				<Image
					className="rounded-full"
					src={logo}
					width={48}
					height={48}
					alt="Santa Parish Logo"
				/>
				<p className="font-serif">
					Santa Lucia Parish Multipurpose Cooperative
				</p>
			</section>
			<ul className="flex flex-col items-center justify-center">
				{links.map((link) => (
					<SidebarLink
						key={link.id}
						location={link.location}
						routeName={link.name}
						isActive={pathname === link.location}
					/>
				))}
			</ul>
		</aside>
	);
}

function SidebarLink({
	routeName,
	location,
	isActive,
}: {
	routeName: string;
	location: string;
	isActive: boolean;
}) {
	return (
		<Link
			className={`sidebar_link ${isActive ? "active" : ""}`}
			href={location}
		>
			<li>{routeName}</li>
		</Link>
	);
}
