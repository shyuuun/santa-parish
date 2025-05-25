"use client";

import Alert from "@/src/components/Alert";

export default function LoginForm() {
	return (
		<form>
			<div className="mb-4">
				<Alert message="hello" type="error" />
			</div>
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
					id="password"
					name="password"
					type="password"
					placeholder="Password"
				/>
			</div>
			<button className="btn w-full">Login</button>
		</form>
	);
}
