import Image from "next/image";
import parishPlace from "@/public/parish-place.jpg";
import aboutImg from "@/public/about.jpg";

export default function Home() {
	return (
		<main className="bg-red-50">
			<div className="h-screen flex justify-center flex-col items-center relative mb-8">
				<section className="absolute inset-0">
					<figure>
						<Image
							className="object-cover h-screen"
							src={parishPlace}
							alt="Parish Place"
							priority
						/>
						<div className="absolute inset-0 bg-red-600 opacity-30"></div>
					</figure>
				</section>
				<section className="max-w-3/4 mx-auto relative text-white">
					<h1 className="text-4xl text-center mb-4">
						Empowering our community through financial growth and
						cooperation
					</h1>
					<p className="italic text-center">
						&quot;Affordable loans, secure savings, and livelihood
						programs for a brighter tomorrow&quot;
					</p>
				</section>
			</div>
			<section className="max-w-3/4 mx-auto gap-4 flex flex-col md:flex-row items-center justify-around mb-8">
				<h1 className="text-5xl font-bold mb-4 text-center">
					About Us
				</h1>
				<figure className=" rounded-2xl overflow-hidden">
					<Image
						src={aboutImg}
						alt="Members of Sta Parish"
						className="w-full h-auto max-w-sm md:max-w-md object-cover rounded-2xl"
					/>
				</figure>
			</section>
			<section className="max-w-3/4 mx-auto">
				<h3 className="text-center text-2xl font-bold mb-8">
					Who are we?
				</h3>
				<p className="text-center font-serif mb-4">
					Sta. Lucia Parish Multipurpose Cooperative is a
					community-driven financial institution dedicated to
					fostering economic growth and stability. Established to
					support individuals and small businesses.
				</p>
				<p className="text-center font-serif mb-4">
					We provide accessible financial solutions that promote
					savings, responsible lending, and livelihood development.
					With a commitment to integrity and mutual cooperation,
				</p>
				<p className="text-center font-serif mb-16">
					We strive to empower our members and strengthen our local
					economy.
				</p>
			</section>
			<section className="max-w-3/4 mx-auto">
				<h3 className="text-center text-2xl font-bold mb-8">
					What can we offer
				</h3>
				<article className="flex gap-4">
					<Card />
					<Card />
					<Card />
				</article>
			</section>
		</main>
	);
}

function Card() {
	return (
		<div className="bg-sky-200 flex flex-col justify-center items-center p-4 relative">
			<div className="absolute border-white rounded-full top-[3rem]">
				l
			</div>
			<h3 className="font-bold text-2xl">Savings & Deposits</h3>
			<p className="text-center">
				Secure and flexible savings accounts with competitive interest
				rates to help you grow your wealth
			</p>
		</div>
	);
}
