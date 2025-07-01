"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, ChevronUp, User as UserIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import logo from "@/public/logo.svg";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/cilent";
import { getUserRole } from "@/src/utils/supabaseUtils";
import { auth, user as userRoutes, admin } from "@/src/utils/route";
import type { User } from "@supabase/supabase-js";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/src/components/shadcn/dropdown-menu";
import { Button } from "@/src/components/shadcn/button";

export default function Navbar() {
	const [yPos, setYPos] = useState(0);
	const [isTransparent, setIsTransparent] = useState(false);
	const [isHiddenLinks, setIsHiddenLinks] = useState(true);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userRole, setUserRole] = useState<number | null>(null);

	const supabase = createClient();
	const router = useRouter();

	useEffect(() => {
		const handleScroll = () => {
			const currentYPos = window.scrollY;

			if (yPos > 650) {
				setIsTransparent(false);
			} else {
				setIsTransparent(true);
			}

			setYPos(currentYPos);
		};
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [yPos]);

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setCurrentUser(user);

			if (user) {
				const role = await getUserRole(supabase, user.id);
				setUserRole(role);
			}
		};

		getUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				setCurrentUser(session?.user || null);
				if (session?.user) {
					getUserRole(supabase, session.user.id).then(setUserRole);
				}
			} else if (event === "SIGNED_OUT") {
				setCurrentUser(null);
				setUserRole(null);
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/");
	};

	const isAdmin = userRole === 1; // Assuming admin role ID is 1
	const isVerifiedUser = userRole === 2; // Assuming user role ID is 2

	return (
		<nav
			className={`${
				isTransparent ? "bg-transparent" : "bg-red-600"
			} transition-colors  md:py-4 md:px-2 py-2 px-0 w-full gap-4 md:gap-0 text-white z-50 fixed`}
		>
			<div className="relative flex flex-col md:flex-row items-center justify-around">
				<section className="flex justify-between items-center gap-4 w-full md:w-auto">
					<div className="flex items-center justify-center gap-2">
						<Image
							className="rounded-full ml-2"
							src={logo}
							alt={"Logo of Sta. Lucia Parish"}
							width={64}
							height={64}
						/>
						<h1 className="text-2xl font-serif">
							Santa Lucia Parish <br />
							Multipurpose Cooperative
						</h1>
					</div>

					<button
						className="block md:hidden p-2"
						onClick={() => setIsHiddenLinks(!isHiddenLinks)}
					>
						<span
							className={`block transition-transform duration-300 ease-in-out ${
								isHiddenLinks ? "rotate-180" : "rotate-0"
							}`}
						>
							{isHiddenLinks ? <Menu /> : <ChevronUp />}
						</span>
					</button>
				</section>
				{/* // TODO: Make a animation when clicking a button it shows the links (mobile) */}
				<section
					className={`absolute md:static left-0 top-full w-full md:w-auto md:flex bg-red-600 md:bg-transparent transition-all duration-200 ease-out origin-top ${
						isHiddenLinks
							? "max-h-0 opacity-0 scale-y-0 md:max-h-none md:opacity-100 md:scale-y-100 md:flex"
							: "max-h-[200px] opacity-100 scale-y-100"
					}`}
				>
					<div className="flex flex-col md:flex-row items-center justify-center gap-4 py-4">
						<ul className="flex flex-col md:flex-row items-center justify-center gap-4">
							<li>
								<Link href={"#home"}>Home</Link>
							</li>
							<li>
								<Link href={"#about-us"}>About Us</Link>
							</li>
							<li>
								<Link href={"#announce"}>Announcement</Link>
							</li>
						</ul>

						{/* Auth Section */}
						<div className="flex items-center gap-4">
							{currentUser ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="bg-white/10 border-white/20 text-white hover:bg-white/20"
										>
											<UserIcon className="h-4 w-4 mr-2" />
											{currentUser.email?.split("@")[0] ||
												"User"}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-56"
										align="end"
									>
										{isAdmin && (
											<>
												<DropdownMenuItem asChild>
													<Link
														href={admin.home}
														className="cursor-pointer"
													>
														Dashboard
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link
														href="/chat"
														className="cursor-pointer"
													>
														Chat
													</Link>
												</DropdownMenuItem>
											</>
										)}
										{isVerifiedUser && (
											<>
												<DropdownMenuItem asChild>
													<Link
														href={userRoutes.home}
														className="cursor-pointer"
													>
														Home
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link
														href="/chat"
														className="cursor-pointer"
													>
														Chat
													</Link>
												</DropdownMenuItem>
											</>
										)}
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleLogout}
											className="cursor-pointer"
										>
											<LogOut className="h-4 w-4 mr-2" />
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Button
									asChild
									className="bg-white text-red-600 hover:bg-red-50"
								>
									<Link href={auth.login}>Login</Link>
								</Button>
							)}
						</div>
					</div>
				</section>
			</div>
		</nav>
	);
}
