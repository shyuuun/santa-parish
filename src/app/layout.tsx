import { Toaster } from "../components/shadcn/sonner";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

import { Arvo, Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const arvo = Arvo({
	subsets: ["latin"],
	variable: "--font-arvo",
	weight: "700",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" title="Santa Lucia Parish Multipurpose Cooperative">
			<body className={`${inter.variable} ${arvo.variable}`}>
				<NextTopLoader color="#a78bfa" height={12} />
				{children}
				<Toaster />
			</body>
		</html>
	);
}
