"use client";

import Button from "@/src/components/Button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { ActionStatus } from "@/src/utils/types";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { sendPasswordResetEmail } from "../actions";
import Alert from "@/src/components/Alert";

export default function ResetForm() {
	const [formState, dispatch, pending] = useActionState<
		ActionStatus,
		FormData
	>(
		async (
			state: ActionStatus,
			formData: FormData
		): Promise<ActionStatus> => {
			const response = await sendPasswordResetEmail(formData);
			return (
				response || {
					type: "success",
					msg: "If your email exists, a reset link has been sent.",
				}
			);
		},
		{ type: "", msg: "" }
	);

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
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Enter your email address"
						required
					/>
				</div>
				<Button className="w-full mb-4" type="submit">
					{pending ? <Loader size="sm" /> : "Reset Password"}
				</Button>

				<Link className="link" href="/login">
					Return to Login
				</Link>
			</form>
		</>
	);
}
