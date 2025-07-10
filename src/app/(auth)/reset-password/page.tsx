import Image from "next/image";
import parishLogo from "@/public/logo.svg";
import UpdatePasswordForm from "@/src/app/(auth)/components/UpdatePasswordForm";
import { redirect } from "next/navigation";

interface ResetPasswordProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPassword({
	searchParams,
}: ResetPasswordProps) {
	const params = await searchParams;
	const token = params.token;
	const type = params.type;

	// Check if this is a valid password reset request
	if (!token || type !== "recovery") {
		redirect("/forget-password");
	}
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
					Reset Your Password
				</h1>
				<p className="mb-2">Enter your new password below.</p>
			</div>

			<UpdatePasswordForm />
		</section>
	);
}
