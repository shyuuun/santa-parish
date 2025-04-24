// TODO : Make the CSS more readable

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className={` sidebar grid grid-cols-5 h-screen`}>
			<Sidebar />
			<div className="col-span-4">
				<Navbar />
				{children}
			</div>
		</main>
	);
}
