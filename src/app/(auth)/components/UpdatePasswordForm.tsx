"use client";

import Button from "@/src/components/Button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { ActionStatus } from "@/src/utils/types";
import Loader from "@/src/components/Loader";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { updatePassword } from "../actions";
import Alert from "@/src/components/Alert";
import { useRouter } from "next/navigation";

export default function UpdatePasswordForm() {
	const router = useRouter();
	const [formState, dispatch, pending] = useActionState<
		ActionStatus,
		FormData
	>(
		async (
			state: ActionStatus,
			formData: FormData
		): Promise<ActionStatus> => {
			const response = await updatePassword(formData);
			return (
				response || {
					type: "success",
					msg: "Password updated successfully!",
				}
			);
		},
		{ type: "", msg: "" }
	);

	// Redirect to login after successful password update
	useEffect(() => {
		if (
			formState.type === "success" &&
			formState.msg?.includes("successfully")
		) {
			const timer = setTimeout(() => {
				router.push("/login");
			}, 2000); // Wait 2 seconds to show success message
			return () => clearTimeout(timer);
		}
	}, [formState, router]);

	return (
		<>
			{formState.msg && (
				<div
					className={`transition-opacity duration-300 my-4 ${
						formState.msg ? "opacity-100" : "opacity-0 hidden"
					}`}
				>
					<Alert
						type={formState.type === "failed" ? "error" : "success"}
						message={formState.msg ?? ""}
					/>
				</div>
			)}
			<form action={dispatch}>
				<div className="mb-4">
					<Label htmlFor="password">New Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="Enter your new password"
						minLength={6}
						required
					/>
					<p className="text-xs text-gray-600 mt-1">
						Password must be at least 6 characters long
					</p>
				</div>
				<div className="mb-4">
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						placeholder="Confirm your new password"
						minLength={6}
						required
					/>
				</div>
				<Button className="w-full mb-4" type="submit">
					{pending ? <Loader size="sm" /> : "Update Password"}
				</Button>

				<Link className="link" href="/login">
					Return to Login
				</Link>
			</form>
		</>
	);
}
