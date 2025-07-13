import { createClient } from "./supabase/server";

export interface DashboardSummary {
	pendingMembers: number;
	totalMembers: number;
	activeLoans: number;
	pendingApplications: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
	const supabase = await createClient();

	try {
		// Get pending members (users with no role assigned - they're waiting for approval)
		const { count: pendingMembers } = await supabase
			.from("user_with_roles")
			.select("*", { count: "exact", head: true })
			.eq("role", "unverified_user");

		// Get total verified members
		const { count: totalMembers } = await supabase
			.from("user_with_roles")
			.select("*", { count: "exact", head: true })
			.in("role", ["verified_user", "admin"]);

		// Get active loans (approved loan details)
		const { count: activeLoans } = await supabase
			.from("loan_details")
			.select("*", { count: "exact", head: true })
			.eq("loan_status", "active");

		// Get pending loan applications
		const { count: pendingApplications } = await supabase
			.from("loan_applications")
			.select("*", { count: "exact", head: true })
			.eq("app_status", "pending");

		return {
			pendingMembers: pendingMembers || 0,
			totalMembers: totalMembers || 0,
			activeLoans: activeLoans || 0,
			pendingApplications: pendingApplications || 0,
		};
	} catch (error) {
		console.error("Error fetching dashboard summary:", error);
		// Return zeros if there's an error to prevent crashes
		return {
			pendingMembers: 0,
			totalMembers: 0,
			activeLoans: 0,
			pendingApplications: 0,
		};
	}
}
