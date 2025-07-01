"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/cilent";
import { user } from "@/src/utils/route";

export default function Navbar() {
	const supabase = createClient();
	const router = useRouter();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.replace("/login");
	};

	return (
		<nav className="w-full bg-red-500 text-white">
			<div className="max-w-[1200px] mx-auto px-4 md:max-w-[770px] lg:max-w-[1200px] flex flex-col items-center">
				<div className="flex justify-center items-center h-16">
					<div className="flex items-center gap-2">
						<Image
							src={logo}
							alt="Logo"
							width={40}
							height={40}
							className="rounded-full"
						/>
						<h1 className="text-lg font-serif hidden md:block">
							Santa Lucia Parish Multipurpose Cooperative
						</h1>
					</div>
				</div>
				<div className="py-2">
					<div className="flex gap-4">
						<Link href={user.home} className="hover:text-gray-200">
							Home
						</Link>
						<Link href={user.loan} className="hover:text-gray-200">
							Loans
						</Link>
						<Link
							href={user.transaction}
							className="hover:text-gray-200"
						>
							Transactions
						</Link>
						<Link
							href={user.profile}
							className="hover:text-gray-200"
						>
							Profile
						</Link>
						<button
							onClick={handleLogout}
							className="hover:text-gray-200 cursor-pointer"
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
