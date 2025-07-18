"use client";

import { useActionState } from "react";
import { login } from "../actions";
import Loader from "@/src/components/Loader";
import Link from "next/link";
import Alert from "@/src/components/Alert";
import { Label } from "@/src/components/shadcn/label";
import { Input } from "@/src/components/shadcn/input";
import Button from "@/src/components/Button";
import { ActionStatus } from "@/src/utils/types";

export default function LoginForm() {
	// TODO: Make it simple
	const [formState, formAction, pending] = useActionState<ActionStatus>(
		async (
			state: ActionStatus,
			formData?: FormData
		): Promise<ActionStatus> => {
			if (!formData) return state; // Ensure formData is present

			const response = await login(formData); // Call login with formData
			return response || state; // Ensure we always return ActionStatus
		},
		{ type: "", msg: "" } // Initial state
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
					<Link className="link" href="/forget-password">
						Forgot Password?
					</Link>
				</div>
			</form>

			<div className="text-center mt-4">
				<p className="text-sm text-gray-600">
					Don&apos;t have an account?{" "}
					<Link className="link" href="/register">
						Register here
					</Link>
				</p>
			</div>
		</>
	);
}
