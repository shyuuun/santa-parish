"use client";

import Button from "@/src/components/Button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { ActionStatus } from "@/src/utils/types";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

export default function ResetForm() {
	const [formState, dispatch, pending] = useActionState<
		ActionStatus,
		FormData
	>(
		async (
			state: ActionStatus,
			formData: FormData
		): Promise<ActionStatus> => {
			// TODO: Implement your reset password logic here, e.g., call an API
			return {
				type: "success",
				msg: "If your email exists, a reset link has been sent.",
			};
		},
		{ type: "", msg: "" }
	);
	return (
		// TODO: add alert here
		<form action={dispatch}>
			<div className="mb-4">
				<Label>Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="Email"
				/>
			</div>
			<Button className="w-full mb-4" type="submit">
				{pending ? <Loader size="sm" /> : "Reset Password"}
			</Button>

			<Link className="link" href="/login">
				Return to Login
			</Link>
		</form>
	);
}
