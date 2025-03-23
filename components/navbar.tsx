"use client";

import { useState } from "react";
import { Menu, ChevronUp } from "lucide-react";

export default function Navbar() {
	const [isHidden, setIsHidden] = useState(true);

	return (
		<nav className="bg-red-600 md:py-4 md:px-2 py-2 px-0 w-full gap-4 md:gap-0 text-white z-50 fixed">
			<div className="relative flex flex-col md:flex-row items-center justify-around">
				<section className="flex justify-between items-center gap-4">
					<h1 className="text-2xl">
						Santa Lucia Parish <br />
						Multipurpose Cooperative
					</h1>
					<button
						className="block md:hidden p-2 "
						onClick={() => setIsHidden(!isHidden)}
					>
						<span
							className={`block transition-transform duration-300 ease-in-out ${
								isHidden ? "rotate-180" : "rotate-0"
							}`}
						>
							{isHidden ? <Menu /> : <ChevronUp />}
						</span>
					</button>
				</section>
				{/* // TODO: Make a animation when clicking a button it shows the links (mobile) */}
				<section
					className={`absolute md:static left-0 top-full w-full md:w-auto md:flex bg-red-600 md:bg-transparent transition-all duration-200 ease-out origin-top ${
						isHidden
							? "max-h-0 opacity-0 scale-y-0 md:max-h-none md:opacity-100 md:scale-y-100 md:flex"
							: "max-h-[200px] opacity-100 scale-y-100"
					}`}
				>
					<ul className="flex flex-col md:flex-row  items-center justify-center gap-4 py-4">
						<li>Home</li>
						<li>Announments</li>
						<li>Contact Us</li>
						<li>About Us</li>
					</ul>
				</section>
			</div>
		</nav>
	);
}
