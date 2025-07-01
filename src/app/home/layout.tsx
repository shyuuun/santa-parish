"use client";

import Navbar from "./components/Navbar";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<main className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 py-6">
				{children}
			</main>
		</div>
	);
}
