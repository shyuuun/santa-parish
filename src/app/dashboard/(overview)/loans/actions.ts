"use server";

import { createClient } from "@/src/utils/supabase/server";
import { Database } from "@/src/utils/database.types";
import { ActionStatus } from "@/src/utils/types";

type LoanDetail = Database["public"]["Tables"]["loan_details"]["Insert"];

export async function approveLoanApplication(
	formData: FormData
): Promise<ActionStatus> {
	const supabase = await createClient();

	// Get current admin user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { type: "error", msg: "Authentication required" };
	}

	// Extract form data
	const applicationId = parseInt(formData.get("application_id") as string);
	const approvedAmount = parseFloat(
		formData.get("approved_amount") as string
	);
	const interestRate = parseFloat(formData.get("interest_rate") as string);
	const loanTermMonths = parseInt(formData.get("loan_term_months") as string);
	const monthlyPayment = parseFloat(
		formData.get("monthly_payment") as string
	);

	if (
		!applicationId ||
		!approvedAmount ||
		!interestRate ||
		!loanTermMonths ||
		!monthlyPayment
	) {
		return { type: "error", msg: "All fields are required" };
	}

	// Get the loan application details
	const { data: application, error: appError } = await supabase
		.from("loan_applications")
		.select("*")
		.eq("app_id", applicationId)
		.eq("app_status", "pending")
		.single();

	if (appError || !application) {
		return {
			type: "error",
			msg: "Application not found or already processed",
		};
	}

	// Calculate next payment date (1 month from now)
	const nextPaymentDate = new Date();
	nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

	try {
		// Start transaction - update application and create loan details

		// 1. Update loan application status
		const { error: updateError } = await supabase
			.from("loan_applications")
			.update({
				app_status: "approved",
				approved_amount: approvedAmount,
				interest_rate: interestRate,
				loan_term_months: loanTermMonths,
				monthly_payment: monthlyPayment,
			})
			.eq("app_id", applicationId);

		if (updateError) {
			console.error("Error updating application:", updateError);
			return {
				type: "error",
				msg: "Failed to update application status",
			};
		}

		// 2. Create loan details record
		const loanDetails: LoanDetail = {
			loan_application_id: applicationId,
			applicant_id: application.applicant_id,
			principal_amount: approvedAmount,
			remaining_balance: approvedAmount,
			monthly_payment: monthlyPayment,
			next_payment_date: nextPaymentDate.toISOString().split("T")[0],
			loan_status: "active",
		};

		const { error: createError } = await supabase
			.from("loan_details")
			.insert([loanDetails]);

		if (createError) {
			console.error("Error creating loan details:", createError);
			return { type: "error", msg: "Failed to create loan details" };
		}

		return {
			type: "success",
			msg: "Loan application approved successfully",
		};
	} catch (error) {
		console.error("Error approving loan:", error);
		return { type: "error", msg: "Failed to approve loan application" };
	}
}

export async function denyLoanApplication(
	formData: FormData
): Promise<ActionStatus> {
	const supabase = await createClient();

	// Get current admin user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { type: "error", msg: "Authentication required" };
	}

	const applicationId = parseInt(formData.get("application_id") as string);

	if (!applicationId) {
		return { type: "error", msg: "Invalid application ID" };
	}

	// Update application status to denied
	const { error } = await supabase
		.from("loan_applications")
		.update({
			app_status: "denied",
			// Note: If you want to store denial reason, you'll need to add that column to the table
		})
		.eq("app_id", applicationId)
		.eq("app_status", "pending");

	if (error) {
		console.error("Error denying loan:", error);
		return { type: "error", msg: "Failed to deny loan application" };
	}

	return { type: "success", msg: "Loan application denied successfully" };
}

export async function recordPayment(formData: FormData): Promise<ActionStatus> {
	const supabase = await createClient();

	// Get current admin user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { type: "error", msg: "Authentication required" };
	}

	const loanId = parseInt(formData.get("loan_id") as string);
	const paymentAmount = parseFloat(formData.get("payment_amount") as string);
	const paymentMethod =
		(formData.get("payment_method") as string) || "counter";
	const notes = (formData.get("notes") as string) || "";

	if (!loanId || !paymentAmount || paymentAmount <= 0) {
		return { type: "error", msg: "Invalid payment data" };
	}

	try {
		// Get current loan details
		const { data: loan, error: loanError } = await supabase
			.from("loan_details")
			.select("*")
			.eq("id", loanId)
			.eq("loan_status", "active")
			.single();

		if (loanError || !loan) {
			console.error("Error fetching loan:", loanError);
			return { type: "error", msg: "Loan not found or not active" };
		}

		// Calculate new remaining balance
		const newBalance = loan.remaining_balance - paymentAmount;
		const isFullyPaid = newBalance <= 0;

		// Calculate next payment date
		const nextPaymentDate = new Date();
		nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

		// 1. Record the payment
		const { error: paymentError } = await supabase.from("payments").insert([
			{
				loan_id: loanId,
				payment_amount: paymentAmount,
				payment_method: paymentMethod,
				recorded_by: user.id,
				notes: notes,
				payment_date: new Date().toISOString().split("T")[0],
			},
		]);

		if (paymentError) {
			console.error("Error recording payment:", paymentError);
			return {
				type: "error",
				msg: "Failed to record payment: " + paymentError.message,
			};
		}

		// 2. Update loan details
		const updateData = {
			remaining_balance: Math.max(0, newBalance),
			loan_status: isFullyPaid ? "completed" : "active",
			next_payment_date: isFullyPaid
				? null
				: nextPaymentDate.toISOString().split("T")[0],
		};

		const { error: updateError } = await supabase
			.from("loan_details")
			.update(updateData)
			.eq("id", loanId);

		if (updateError) {
			console.error("Error updating loan details:", updateError);
			return {
				type: "error",
				msg: "Payment recorded but failed to update loan balance",
			};
		}

		return {
			type: "success",
			msg: isFullyPaid
				? "Payment recorded successfully. Loan has been fully paid!"
				: "Payment recorded successfully",
		};
	} catch (error) {
		console.error("Error recording payment:", error);
		return { type: "error", msg: "Failed to record payment" };
	}
}
