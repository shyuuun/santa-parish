// TODO: Section A will be home page

import Card from "../components/Card";

export default function SectionA() {
	return (
		<section className="flex flex-col gap-4 justify-center ">
			<div className="flex flex-col">
				<h3>User stats</h3>
				{/* Number of Total Members  */}
				{/* Number of Unverified Members */}
				{/* Number of Verified Members */}
				<div className="flex gap-4">
					<Card category="Total Members" totalNumber={2000} />
					<Card category="Unverified Members" totalNumber={2000} />
					<Card category="Verified Members" totalNumber={2000} />
				</div>
			</div>

			<div className="flex flex-col">
				<h3>Financial Overview</h3>
				<div className="flex gap-4">
					<Card category="Total Members" totalNumber={2000} />
					<Card category="Unverified Members" totalNumber={2000} />
					<Card category="Verified Members" totalNumber={2000} />
				</div>
			</div>

			<div className="flex flex-col">
				<h3>Transactions</h3>
				{/* Number of Transactions Today */}
				{/* Number of Loan Applications */}
				{/* Number of Rejected Applicattions */}
				{/* Number of Approved Appplications */}
				<div className="flex gap-4">
					<Card category="Transactions Today" totalNumber={2000} />
					<Card
						category="Total of Loan Applications"
						totalNumber={2000}
					/>
					<Card
						category="Total of Rejected Loan Applications"
						totalNumber={2000}
					/>
					<Card
						category="Total of Approved Loan Applications"
						totalNumber={2000}
					/>
				</div>
			</div>

			<div className="flex flex-col">
				<h3>Activities</h3>
				{/* No of Announcments */}
				{/* Feedback Recevied */}
				<div className="flex gap-4">
					<Card
						category="Number of Announcements"
						totalNumber={2000}
					/>
					<Card category="Feedback Received" totalNumber={2000} />
				</div>
			</div>
		</section>
	);
}
