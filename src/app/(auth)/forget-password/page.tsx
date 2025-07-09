import Image from "next/image";
import parishLogo from "@/public/logo.svg";
import ResetForm from "../components/ResetForm";

export default function ForgetPassword() {
	return (
		<section className="px-4 py-8 bg-white opacity-90">
			<Image
				src={parishLogo}
				alt="parish logo"
				className="rounded-full mb-2 mx-auto"
				width={64}
				height={64}
			/>
			<div className="text-center mb-4">
				<h1 className="text-sm md:text-2xl mb-2">
					Reset your password
				</h1>
				<p className="mb-2">
					Enter the email associated with your account to receive a
					password reset link.
				</p>
			</div>

			<ResetForm />
		</section>
	);
}
