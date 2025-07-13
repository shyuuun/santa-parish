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
				<NextTopLoader
					color="linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)"
					height={8}
				/>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
