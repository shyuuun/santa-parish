import Image from "next/image";
import parishLogo from "@/public/logo.svg";
import Link from "next/link";

export default function AuthCodeError() {
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
				<h1 className="text-sm md:text-2xl mb-2 text-red-600">
					Authentication Error
				</h1>
				<p className="mb-4 text-gray-600">
					The authentication link you clicked is invalid or has
					expired. Please try requesting a new password reset link.
				</p>
			</div>

			<div className="text-center">
				<Link
					href="/forget-password"
					className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors mb-4"
				>
					Request New Reset Link
				</Link>
				<br />
				<Link className="link" href="/login">
					Return to Login
				</Link>
			</div>
		</section>
	);
}
