import Image from "next/image";
import parishPlace from "@/public/parish-place.jpg";
import aboutImg from "@/public/about.jpg";
import {
	Coins,
	HandCoins,
	HandHeart,
	House,
	PersonStanding,
	Shield,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
	return (
		<>
			<Navbar />
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
						<h1 className="text-4xl text-center mb-4 font-serif">
							Empowering our community through financial growth
							and cooperation
						</h1>
						<p className="text-2xl italic text-center">
							&quot;Affordable loans, secure savings, and
							livelihood programs for a brighter tomorrow&quot;
						</p>
					</section>
				</div>
				<section className="max-w-3/4 mx-auto gap-4 flex flex-col md:flex-row items-center justify-around mb-8">
					<h1 className="text-5xl font-bold mb-4 text-center font-serif text-sky-800">
						About Us
					</h1>
					<figure className="overflow-hidden">
						<Image
							src={aboutImg}
							alt="Members of Sta Parish"
							className="w-full h-auto max-w-sm md:max-w-md object-cover"
						/>
					</figure>
				</section>
				<section className="max-w-3/4 mx-auto">
					<h3 className="text-center text-2xl font-bold mb-8 font-serif text-sky-500">
						Who are we?
					</h3>
					<p className="text-center mb-4 text-lg">
						Sta. Lucia Parish Multipurpose Cooperative is a
						community-driven financial institution dedicated to
						fostering economic growth and stability. Established to
						support individuals and small businesses.
					</p>
					<p className="text-center  mb-4 text-lg">
						We provide accessible financial solutions that promote
						savings, responsible lending, and livelihood
						development. With a commitment to integrity and mutual
						cooperation,
					</p>
					<p className="text-center  mb-16 text-lg">
						We strive to empower our members and strengthen our
						local economy.
					</p>
				</section>
				<section className="max-w-3/4 mx-auto">
					<h3 className="text-center text-2xl font-bold mb-8 font-serif text-sky-500">
						What can we offer
					</h3>
					<article className="flex flex-col md:flex-row gap-8 md:gap-4 mb-8">
						<Card
							title="Savings & Deposits"
							desc="Secure and flexible savings accounts with competitive interest rates to help you grow your wealth"
							icon={<Coins />}
						/>
						<Card
							title="Affordable Loans"
							desc="Accessible loan programs for personal, business, and emergency needs, designed to empower financial independence."
							icon={<HandCoins />}
						/>
						<Card
							title="Microfinance & Livelihood Support"
							desc="Assistance for small businesses and entrepreneurs through funding and training programs."
							icon={<House />}
						/>
					</article>
					<article className="flex flex-col md:flex-row gap-8 md:gap-4 mb-8">
						<Card
							title="Community Development Programs"
							desc="Initiatives that support education, skills training, and community welfare projects."
							icon={<PersonStanding />}
						/>
						<Card
							title="Insurance & Financial Protection"
							desc="Comprehensive insurance options to safeguard your future and provide peace of mind."
							icon={<Shield />}
						/>
						<Card
							title="Investment & Wealth-Building Opportunities"
							desc="Programs that help members maximize their financial potential through strategic investments."
							icon={<HandHeart />}
						/>
					</article>
				</section>
				<section className="max-w-3/4 mx-auto p-12 ">
					<h1 className="text-center text-2xl md:text-5xl  font-serif">
						Announcements
					</h1>
					<p className="text-center">To be Added</p>
				</section>
			</main>

			<Footer />
		</>
	);
}

type CardOffer = {
	title: string;
	desc: string;
	icon: React.ReactNode;
};

function Card({ title, desc, icon }: CardOffer) {
	return (
		<div className="bg-sky-200 flex flex-col justify-center items-center px-4 pt-8 pb-4 relative">
			<div
				className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 w-10 h-10 flex items-center justify-center 
             border-2 border-white rounded-full bg-sky-500 text-white font-bold"
			>
				{icon}
			</div>
			<h3 className="font-bold text-2xl text-center font-serif">
				{title}
			</h3>
			<p className="text-center">{desc}</p>
		</div>
	);
}
