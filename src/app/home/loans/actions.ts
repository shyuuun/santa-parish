"use server";

import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import { Database } from "@/src/utils/database.types";

type LoanApplication =
	Database["public"]["Tables"]["loan_applications"]["Insert"];

export async function createLoanApplication(formData: FormData) {
	const supabase = await createClient();

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		redirect("/login");
	}

	// Extract form data
	const loanType = formData.get("loan_type") as string;
	const amountRequested = parseFloat(
		formData.get("amount_requested") as string
	);
	const purposeLoan = formData.get("purpose_loan") as string;
	const agreeTerms = formData.get("agree_terms") as string;

	// Validate form data
	if (!loanType || !amountRequested || !purposeLoan) {
		redirect(
			"/home/loans/apply?error=" +
				encodeURIComponent("All fields are required")
		);
	}

	if (amountRequested <= 0) {
		redirect(
			"/home/loans/apply?error=" +
				encodeURIComponent("Amount must be greater than 0")
		);
	}

	if (!agreeTerms) {
		redirect(
			"/home/loans/apply?error=" +
				encodeURIComponent("You must agree to the terms and conditions")
		);
	}

	// Create loan application
	const loanApplication: LoanApplication = {
		applicant_id: user.id,
		loan_type: loanType,
		amount_requested: amountRequested,
		purpose_loan: purposeLoan,
		app_status: "pending",
	};

	const { error } = await supabase
		.from("loan_applications")
		.insert([loanApplication]);

	if (error) {
		console.error("Error creating loan application:", error);
		redirect(
			"/home/loans/apply?error=" +
				encodeURIComponent("Failed to submit loan application")
		);
	}

	redirect("/home/loans?success=true");
}

export async function getUserLoanApplications() {
	const supabase = await createClient();

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { error: "User not authenticated" };
	}

	// Get user's loan applications
	const { data: applications, error } = await supabase
		.from("loan_applications")
		.select("*")
		.eq("applicant_id", user.id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching loan applications:", error);
		return { error: "Failed to fetch loan applications" };
	}

	return { applications };
}

export async function getUserActiveLoans() {
	const supabase = await createClient();

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { error: "User not authenticated" };
	}

	// Get user's active loans with application details
	const { data: loans, error } = await supabase
		.from("loan_details")
		.select(
			`
      *,
      loan_applications (
        loan_type,
        purpose_loan,
        amount_requested
      )
    `
		)
		.eq("applicant_id", user.id)
		.eq("loan_status", "active")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching active loans:", error);
		return { error: "Failed to fetch active loans" };
	}

	return { loans };
}

export async function getUserLoanPayments(loanId: number) {
	const supabase = await createClient();

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { error: "User not authenticated" };
	}

	// Verify user owns this loan
	const { data: loan, error: loanError } = await supabase
		.from("loan_details")
		.select("applicant_id")
		.eq("id", loanId)
		.single();

	if (loanError || !loan) {
		return { error: "Loan not found" };
	}

	if (loan.applicant_id !== user.id) {
		return { error: "Unauthorized" };
	}

	// Get payments for this loan
	const { data: payments, error } = await supabase
		.from("payments")
		.select("*")
		.eq("loan_id", loanId)
		.order("payment_date", { ascending: false });

	if (error) {
		console.error("Error fetching payments:", error);
		return { error: "Failed to fetch payments" };
	}

	return { payments };
}

export async function cancelLoanApplication(applicationId: number) {
	const supabase = await createClient();

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { error: "User not authenticated" };
	}

	// Verify user owns this application and it's still pending
	const { data: application, error: appError } = await supabase
		.from("loan_applications")
		.select("applicant_id, app_status")
		.eq("app_id", applicationId)
		.single();

	if (appError || !application) {
		return { error: "Application not found" };
	}

	if (application.applicant_id !== user.id) {
		return { error: "Unauthorized" };
	}

	if (application.app_status !== "pending") {
		return { error: "Can only cancel pending applications" };
	}

	// Update application status to cancelled
	const { error } = await supabase
		.from("loan_applications")
		.update({ app_status: "denied" }) // Use 'denied' since cancelled is not in the original schema
		.eq("app_id", applicationId);

	if (error) {
		console.error("Error cancelling application:", error);
		return { error: "Failed to cancel application" };
	}

	return { success: true };
}
