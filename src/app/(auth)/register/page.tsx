import Image from "next/image";
import parishLogo from "@/public/logo.svg";
import RegisterForm from "../components/RegisterForm";
export default function Register() {
	return (
		<section className="px-4 py-8 bg-white opacity-90">
			<Image
				src={parishLogo}
				alt="parish logo"
				className="rounded-full mb-2 mx-auto"
				width={64}
				height={64}
			/>
			<div className="text-center">
				<h1 className="text-sm md:text-2xl mb-2">
					Santa Lucia Parish Multipurpose Cooperative
				</h1>
				<p className="mb-2">Register to create an account</p>
			</div>
			<RegisterForm />
		</section>
	);
}
