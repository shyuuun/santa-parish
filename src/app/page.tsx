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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/src/components/shadcn/accordion";

import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import AnnouncementsSection from "@/src/components/AnnouncementsSection";
import { createClient } from "../utils/supabase/server";

export default async function Home() {
	const supabase = await createClient();

	// Fetch initial announcements for server-side rendering
	const { data: initialAnnouncements, count } = await supabase
		.from("announcements")
		.select("*", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(0, 2);

	return (
		<>
			<Navbar />
			<main className="bg-red-50" id="home">
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
						<h1 className="text-center">
							Empowering our community through financial growth
							and cooperation
						</h1>
						<p className="text-2xl italic text-center">
							&quot;Affordable loans, secure savings, and
							livelihood programs for a brighter tomorrow&quot;
						</p>
						<div className="flex justify-center mt-8">
							<a
								href="#about-us"
								className="border-2 border-red-100 text-red-100 bg-transparent hover:border-red-500 hover:bg-red-500 hover:text-white font-semibold px-8 py-3 rounded shadow transition-colors duration-200 text-lg"
							>
								Learn More &amp; Join Us
							</a>
						</div>
					</section>
				</div>
				<section
					className="max-w-3/4 mx-auto gap-4 flex flex-col md:flex-row items-center justify-around mb-8"
					id="about-us"
				>
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
				<section className="max-w-3/4 mx-auto mb-16">
					<h3 className="text-center text-2xl font-bold mb-8 font-serif text-sky-500">
						Frequently Asked Questions
					</h3>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1">
							<AccordionTrigger>
								How do I become a member of the cooperative?
							</AccordionTrigger>
							<AccordionContent>
								To become a member, you need to: 1) Complete our
								online registration form, 2) Submit required
								documents for verification, 3) Pay the
								membership fee and initial share capital, and 4)
								Wait for admin approval. Once approved,
								you&apos;ll have full access to our services.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2">
							<AccordionTrigger>
								What types of loans do you offer?
							</AccordionTrigger>
							<AccordionContent>
								We offer various loan types including: Personal
								Loans, Business Loans, Emergency Loans, and
								Microfinance Loans. Each loan type has different
								terms, interest rates, and requirements. Members
								must be in good standing to qualify for loans.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3">
							<AccordionTrigger>
								What are the benefits of being a member?
							</AccordionTrigger>
							<AccordionContent>
								Members enjoy: Access to low-interest loans,
								competitive savings rates, dividend shares from
								cooperative profits, free financial literacy
								training, insurance coverage options, and
								participation in community development programs.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-4">
							<AccordionTrigger>
								How long does the loan approval process take?
							</AccordionTrigger>
							<AccordionContent>
								Typically, loan applications are processed
								within 1-2 business days. However, the actual
								approval time may vary depending on the loan
								type, amount, and completeness of submitted
								requirements. Emergency loans may be processed
								more quickly.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-5">
							<AccordionTrigger>
								How can I check my account balance and
								transaction history?
							</AccordionTrigger>
							<AccordionContent>
								Members can access their account information
								through our online portal. Simply log in to your
								account to view your balance, transaction
								history, loan status, and other important
								account details. You can also visit our office
								for in-person assistance.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</section>
				<section className="bg-white py-16" id="announce">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h1 className="text-center text-4xl md:text-5xl font-serif mb-12 text-sky-800">
							Latest Announcements
						</h1>
						<AnnouncementsSection
							initialAnnouncements={initialAnnouncements || []}
							totalCount={count || 0}
						/>
					</div>
				</section>

				<Footer />
			</main>
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
