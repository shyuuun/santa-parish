"use client";

import { useActionState } from "react";
import { AuthStatus, login } from "../actions";
import Loader from "@/src/components/Loader";
import Link from "next/link";
import Alert from "@/src/components/Alert";

export default function LoginForm() {
	// TODO: Make it simple
	const [formState, formAction, pending] = useActionState<AuthStatus>(
		async (state: AuthStatus, formData?: FormData) => {
			if (!formData) return state; // Ensure formData is present

			const response = await login(formData); // Call login with formData
			return response;
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
					<label>Email</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="Email"
					/>
				</div>

				<div className="mb-4">
					<label>Password</label>
					<input
						name="password"
						id="password"
						type="password"
						placeholder="Password"
					/>
				</div>

				<div className="flex items-center justify-between">
					<button className="btn" type="submit">
						{pending ? <Loader size="sm" /> : "Sign In"}
					</button>
					{/* // TODO: Change it when implemented forgot password */}
					<Link className="link" href="/register">
						Register
					</Link>
				</div>
			</form>
		</>
	);
}
