"use server";

import { createClient } from "@/src/utils/supabase/server";

interface Transaction {
	id: string;
	type: "loan_payment" | "loan_disbursement";
	amount: number;
	date: string;
	description: string;
	status: string;
	method: string;
	direction: "incoming" | "outgoing";
	notes?: string | null;
}

export async function getUserTransactionHistory() {
	const supabase = await createClient();

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { error: "User not authenticated" };
	}

	// Get user's loan payments (outgoing transactions)
	const { data: payments, error: paymentsError } = await supabase
		.from("payments")
		.select(
			`
      *,
      loan_details (
        id,
        loan_applications (
          loan_type,
          purpose_loan
        )
      )
    `
		)
		.eq("loan_details.applicant_id", user.id)
		.order("payment_date", { ascending: false });

	if (paymentsError) {
		console.error("Error fetching payments:", paymentsError);
	}

	// Get user's loan disbursements (incoming transactions)
	const { data: loans, error: loansError } = await supabase
		.from("loan_details")
		.select(
			`
      *,
      loan_applications (
        loan_type,
        purpose_loan
      )
    `
		)
		.eq("applicant_id", user.id)
		.order("created_at", { ascending: false });

	if (loansError) {
		console.error("Error fetching loans:", loansError);
	}

	// Combine and format transactions
	const transactions: Transaction[] = [];

	// Add payments as outgoing transactions
	payments?.forEach((payment) => {
		transactions.push({
			id: `payment-${payment.id}`,
			type: "loan_payment",
			amount: payment.payment_amount,
			date: payment.payment_date || payment.created_at,
			description: `Loan payment - ${
				payment.loan_details?.loan_applications?.loan_type || "N/A"
			}`,
			status: "completed",
			method: payment.payment_method,
			direction: "outgoing",
			notes: payment.notes,
		});
	});

	// Add loan disbursements as incoming transactions
	loans?.forEach((loan) => {
		transactions.push({
			id: `disbursement-${loan.id}`,
			type: "loan_disbursement",
			amount: loan.principal_amount,
			date: loan.created_at,
			description: `Loan disbursement - ${
				loan.loan_applications?.loan_type || "N/A"
			}`,
			status: "completed",
			method: "disbursement",
			direction: "incoming",
			notes: loan.loan_applications?.purpose_loan,
		});
	});

	// Sort by date
	transactions.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return { transactions };
}

export async function getUserTransactionSummary() {
	const supabase = await createClient();

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { error: "User not authenticated" };
	}

	// Get total payments made
	const { data: payments, error: paymentsError } = await supabase
		.from("payments")
		.select("payment_amount, loan_details!inner(applicant_id)")
		.eq("loan_details.applicant_id", user.id);

	// Get total loan amounts received
	const { data: loans, error: loansError } = await supabase
		.from("loan_details")
		.select("principal_amount")
		.eq("applicant_id", user.id);

	const summary = {
		totalPaymentsMade: 0,
		totalLoansReceived: 0,
		netAmount: 0,
		transactionCount: 0,
	};

	if (!paymentsError && payments) {
		summary.totalPaymentsMade = payments.reduce(
			(sum, payment) => sum + (payment.payment_amount || 0),
			0
		);
		summary.transactionCount += payments.length;
	}

	if (!loansError && loans) {
		summary.totalLoansReceived = loans.reduce(
			(sum, loan) => sum + (loan.principal_amount || 0),
			0
		);
		summary.transactionCount += loans.length;
	}

	summary.netAmount = summary.totalLoansReceived - summary.totalPaymentsMade;

	return { summary };
}
