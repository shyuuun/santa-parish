import Image from "next/image";
import parishLogo from "@/public/logo.svg";
export default function Login() {
	return (
		<section className="px-4 py-8 bg-white opacity-90">
			<Image
				src={parishLogo}
				alt="parish logo"
				className="rounded-full mb-2 mx-auto"
				width={64}
				height={64}
			/>
			<div className="text-center">
				<h1 className="text-sm md:text-2xl mb-2">
					Santa Lucia Parish Multipurpose Cooperative
				</h1>
				<p className="mb-2">Sign in to start your session</p>
			</div>
			<form>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Username
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username"
						type="text"
						placeholder="Username"
					/>
				</div>

				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Password
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="password"
						type="password"
						placeholder="Password"
					/>
				</div>

				<div className="flex items-center justify-between">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="button"
					>
						Sign In
					</button>
					<a
						className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
						href="#"
					>
						Forgot Password?
					</a>
				</div>
			</form>
		</section>
	);
}
