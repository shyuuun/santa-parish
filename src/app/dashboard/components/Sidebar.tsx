import Link from "next/link";

export default function Sidebar() {
	return (
		<aside className="flex flex-col py-4 px-2">
			<section>Header</section>
			<ul className="flex flex-col">
				<li>
					<Link href={"#"}>Home</Link>
				</li>
				<li>
					<Link href={"#"}>Section</Link>
				</li>
				<li>
					<Link href={"#"}>Section 1</Link>
				</li>
				<li>
					<Link href={"#"}>Section 2</Link>
				</li>
			</ul>
		</aside>
	);
}
