import Image from "next/image";
import parishLogo from "@/public/logo.svg";

export default function Footer() {
	return (
		<footer className="py-4 px-8  bg-red-500 text-white">
			<div className="max-w-3/4 mx-auto flex gap-4 ">
				<div className="flex justify-center items-center flex-1/2">
					<Image
						src={parishLogo}
						className="rounded-full mr-4"
						alt="Logo of Santa Lucia Parish Multipurpose Cooperative"
						width={"64"}
						height={"64"}
					/>
					<div className="flex flex-col">
						<h1 className="font-serif font-bold text-lg uppercase ">
							Santa Lucia Parish <br />
							Multipurpose Cooperative
						</h1>
						<p>CDA Reg. No. 9520-16011641</p>
						<p>TIN No. 004-743-326-000</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
