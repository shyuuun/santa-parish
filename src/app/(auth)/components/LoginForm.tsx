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
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Email
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="email"
						name="email"
						type="email"
						placeholder="Email"
					/>
				</div>

				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Password
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						name="password"
						id="password"
						type="password"
						placeholder="Password"
					/>
				</div>

				<div className="flex items-center justify-between">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						{pending ? <Loader size="sm" /> : "Sign In"}
					</button>
					{/* // TODO: Change it when implemented forgot password */}
					<Link
						className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
						href="/register"
					>
						Register
					</Link>
				</div>
			</form>
		</>
	);
}
