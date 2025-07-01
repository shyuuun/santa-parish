"use client";
import Link from "next/link";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { RouteLink } from "@/src/utils/types";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
	links: RouteLink[];
}

export default function Sidebar({ links }: SidebarProps) {
	const pathname = usePathname();
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	const toggleDropdown = (id: string) => {
		setOpenDropdown(openDropdown === id ? null : id);
	};

	return (
		<aside className="flex flex-col dashboard_sidebar">
			<section className="flex items-center justify-center gap-2 mb-4 px-2">
				<Image
					className="rounded-full hidden lg:block"
					src={logo}
					width={48}
					height={48}
					alt="Santa Parish Logo"
				/>
				<p className="font-serif">
					Santa Lucia Parish Multipurpose Cooperative
				</p>
			</section>
			<ul className="flex flex-col flex-1">
				{links.map((link) => {
					if (link.isDropdown && link.dropdownItems) {
						link.dropdownItems.some(
							(item) => pathname === item.location
						);
						const isOpen = openDropdown === link.id;
						return (
							<li key={link.id} className="relative">
								<button
									onClick={() => toggleDropdown(link.id)}
									className={`sidebar_link w-full flex justify-between items-center
									}`}
								>
									<span>{link.name}</span>
									<svg
										className={`w-4 h-4 ml-2 transition-transform duration-200 ${
											isOpen ? "rotate-180" : ""
										}`}
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								<ul
									className={`overflow-hidden transition-all duration-200 ${
										isOpen
											? "max-h-[500px] opacity-100"
											: "max-h-0 opacity-0"
									}`}
								>
									{link.dropdownItems.map((item) => (
										<li key={item.location}>
											<Link
												href={item.location}
												className={`sidebar_link pl-8 block ${
													pathname === item.location
														? "active"
														: ""
												}`}
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</li>
						);
					}
					return (
						<SidebarLink
							key={link.id}
							location={link.location}
							routeName={link.name}
							isActive={pathname === link.location}
						/>
					);
				})}
				<button
					className="sidebar_link gap-4 flex justify-start items-center mt-auto"
					onClick={() => console.log("logout click")}
				>
					<LogOut size={16} strokeWidth={1.5} />
					Logout
				</button>
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
