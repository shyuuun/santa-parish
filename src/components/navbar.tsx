"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, ChevronUp } from "lucide-react";

import logo from "@/public/logo.svg";
import Link from "next/link";

export default function Navbar() {
	const [yPos, setYPos] = useState(0);
	const [isTransparent, setIsTransparent] = useState(false);
	const [isHiddenLinks, setIsHiddenLinks] = useState(true);

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

	return (
		<nav
			className={`${
				isTransparent ? "bg-transparent" : "bg-red-600"
			} transition-colors  md:py-4 md:px-2 py-2 px-0 w-full gap-4 md:gap-0 text-white z-50 fixed`}
		>
			<div className="relative flex flex-col md:flex-row items-center justify-around">
				<section className="flex justify-between items-center gap-4">
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
						className="block md:hidden p-2 "
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
					<ul className="flex flex-col md:flex-row  items-center justify-center gap-4 py-4">
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
				</section>
			</div>
		</nav>
	);
}
