export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<main className="h-screen flex items-center justify-center bg-red-100">
				<section></section>
				<section>{children}</section>
			</main>
		</>
	);
}
