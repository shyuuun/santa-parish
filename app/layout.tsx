import Navbar from "@/components/navbar";
import "./globals.css";
import Footer from "@/components/footer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" title="Santa Lucia Parish Multipurpose Cooperative">
			<body>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
