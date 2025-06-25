import { createClient } from "@/src/utils/supabase/server";
import Card from "./components/Card";

export default async function HomeDashboard() {

	return (
		<>
			<h1 className="mb-4">Home</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card category="Pending Members" totalNumber={0} />
				<Card category="Total Members" totalNumber={0} />
				<Card category="Active Loans" totalNumber={0} />
				<Card category="Pending Applications" totalNumber={0} />
			</div>
		</>
	);
}
