import "./globals.css";

import { Arvo, Inter } from "next/font/google";

export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const arvo = Arvo({
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
				{children}
			</body>
		</html>
	);
}
