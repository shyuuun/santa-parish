// TODO: Section A will be home page

import Card from "../components/Card";

export default function SectionA() {
	return (
		<section className="flex flex-col justify-center items-center">
			<div className="flex">
				User stats
				{/* Number of Total Members  */}
				{/* Number of Unverified Members */}
				{/* Number of Verified Members */}
				<Card category="Users" totalNumber={20} />
				<Card category="Number of Loans" totalNumber={20} />
			</div>

			<div className="flex">
				Financial Overview
				<Card category="Users" totalNumber={20} />
				<Card category="Users" totalNumber={20} />
			</div>

			<div className="flex">
				Transactions
				{/* Number of Transactions Today */}
				{/* Number of Loan Applications */}
				{/* Number of Rejected Applicattions */}
				{/* Number of Approved Appplications */}
				<Card category="Users" totalNumber={20} />
				<Card category="Users" totalNumber={20} />
			</div>

			<div className="flex">
				Activities
				{/* No of Announcments */}
				{/* Feedback Recevied */}
				<Card category="Users" totalNumber={20} />
				<Card category="Users" totalNumber={20} />
			</div>
		</section>
	);
}
