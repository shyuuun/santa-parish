import Card from "./components/Card";
import { Clock, UserCheck, CreditCard, Users } from "lucide-react";

export default function DashboardLoading() {
	return (
		<>
			<div className="mb-6">
				<div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-2" />
				<div className="h-4 w-96 bg-gray-200 animate-pulse rounded" />
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card 
					category="Pending Members" 
					totalNumber={0} 
					isLoading={true}
					icon={<Clock className="h-8 w-8" />}
				/>
				<Card 
					category="Total Members" 
					totalNumber={0} 
					isLoading={true}
					icon={<UserCheck className="h-8 w-8" />}
				/>
				<Card 
					category="Active Loans" 
					totalNumber={0} 
					isLoading={true}
					icon={<CreditCard className="h-8 w-8" />}
				/>
				<Card 
					category="Pending Applications" 
					totalNumber={0} 
					isLoading={true}
					icon={<Users className="h-8 w-8" />}
				/>
			</div>
		</>
	);
}
