"use client";

import { useActionState } from "react";
import { register } from "../actions";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import Loader from "@/src/components/Loader";
import Link from "next/link";
import Alert from "@/src/components/Alert";
import Button from "@/src/components/Button";
import { ActionStatus } from "@/src/utils/types";

export default function RegisterForm() {
	// TODO: Make it simple
	const [formState, formAction, pending] = useActionState<ActionStatus>(
		async (
			state: ActionStatus,
			formData?: FormData
		): Promise<ActionStatus> => {
			if (!formData) return state; // Ensure formData is present

			const response = await register(formData); // Call register with formData
			return response || state; // Ensure we always return ActionStatus
		},
		{ type: "", msg: "" } // Initial state
	);

	console.log(`---> FormState:${formState.type}`);
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
			<form action={formAction}>
				<div className="mb-4">
					<Label>Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Email"
					/>
				</div>

				<div className="mb-4">
					<Label>Password</Label>
					<Input
						name="password"
						id="password"
						type="password"
						placeholder="Password"
					/>
				</div>

				<div className="flex items-center justify-between">
					<Button>
						{pending ? <Loader size="sm" /> : "Sign In"}
					</Button>
					{/* // TODO: Change it when implemented forgot password */}
					<Link
						className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
						href="/login"
					>
						Have an account? Sign In
					</Link>
				</div>
			</form>
		</>
	);
}
