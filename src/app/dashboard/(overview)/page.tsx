import Card from "./components/Card";
import { getDashboardSummary } from "../../../utils/dashboardQueries";
import { Users, UserCheck, CreditCard, Clock } from "lucide-react";

export default async function HomeDashboard() {
	const summary = await getDashboardSummary();

	return (
		<>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
				<p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening at Santa Lucia Parish Cooperative.</p>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card 
					category="Pending Members" 
					totalNumber={summary.pendingMembers}
					icon={<Clock className="h-8 w-8" />}
				/>
				<Card 
					category="Total Members" 
					totalNumber={summary.totalMembers}
					icon={<UserCheck className="h-8 w-8" />}
				/>
				<Card 
					category="Active Loans" 
					totalNumber={summary.activeLoans}
					icon={<CreditCard className="h-8 w-8" />}
				/>
				<Card 
					category="Pending Applications" 
					totalNumber={summary.pendingApplications}
					icon={<Users className="h-8 w-8" />}
				/>
			</div>
		</>
	);
}
