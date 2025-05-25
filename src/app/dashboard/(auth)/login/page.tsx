import Image from "next/image";
import LoginForm from "../components/LoginForm";
export default function LoginPage() {
	return (
		<section className="h-screen flex items-center justify-center">
			<div className="flex flex-col gap-4 items-center">
				<Image
					className="rounded-full mb-4"
					src="/logo.svg"
					alt="Logo"
					width={120}
					height={120}
				/>
				<h1>Santa Lucia Parish Multipurpose Cooperative</h1>
				<LoginForm />
			</div>
		</section>
	);
}
