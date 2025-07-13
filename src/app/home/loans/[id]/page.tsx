import { getUserLoanPayments } from "../actions";
import Alert from "@/src/components/Alert";
import Badge from "@/src/components/Badge";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import { Database } from "@/src/utils/database.types";
import { calculateLoanDeductions } from "../components/LoanCalculator";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

async function getLoanDetails(loanId: string) {
	const supabase = await createClient();

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { error: "User not authenticated" };
	}

	// Get loan details with application info
	const { data: loan, error } = await supabase
		.from("loan_details")
		.select(
			`
      *,
      loan_applications (
        loan_type,
        purpose_loan,
        amount_requested,
        created_at
      )
    `
		)
		.eq("id", parseInt(loanId))
		.eq("applicant_id", user.id)
		.single();

	if (error || !loan) {
		return { error: "Loan not found or unauthorized" };
	}

	return { loan };
}

export default async function LoanDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	// Await the params
	const { id } = await params;

	const { loan, error: loanError } = await getLoanDetails(id);
	const { payments, error: paymentsError } = await getUserLoanPayments(
		parseInt(id)
	);

	if (loanError) {
		return (
			<div className="p-6">
				<Alert type="error" message={loanError} />
			</div>
		);
	}

	if (!loan) {
		return (
			<div className="p-6">
				<Alert type="error" message="Loan not found" />
			</div>
		);
	}

	const progressPercentage =
		loan.principal_amount > 0
			? ((loan.principal_amount - loan.remaining_balance) /
					loan.principal_amount) *
			  100
			: 0;

	// Calculate what the original deductions would have been
	const originalAmount =
		loan.loan_applications?.amount_requested || loan.principal_amount;
	const deductions = calculateLoanDeductions(originalAmount);

	return (
		<div className="p-6 max-w-4xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<Link
					href="/home/loans"
					className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
				>
					← Back to Loans
				</Link>
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							{loan.loan_applications?.loan_type || "Unknown"}{" "}
							Loan Details
						</h1>
						<p className="text-gray-600 mt-2">
							{loan.loan_applications?.purpose_loan ||
								"No purpose provided"}
						</p>
					</div>
					<Badge
						variant={
							loan.loan_status === "active"
								? "success"
								: "default"
						}
					>
						{loan.loan_status}
					</Badge>
				</div>
			</div>

			{/* Loan Overview */}
			<div className="grid md:grid-cols-2 gap-6 mb-8">
				{/* Loan Information */}
				<div className="bg-white border rounded-lg p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Loan Information
					</h2>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="text-gray-600">
								Principal Amount:
							</span>
							<span className="font-medium">
								₱{loan.principal_amount?.toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Remaining Balance:
							</span>
							<span className="font-medium text-red-600">
								₱{loan.remaining_balance?.toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Monthly Payment:
							</span>
							<span className="font-medium">
								₱{loan.monthly_payment?.toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Next Payment Date:
							</span>
							<span className="font-medium">
								{loan.next_payment_date
									? new Date(
											loan.next_payment_date
									  ).toLocaleDateString()
									: "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Application Date:
							</span>
							<span className="font-medium">
								{loan.loan_applications?.created_at
									? new Date(
											loan.loan_applications.created_at
									  ).toLocaleDateString()
									: "N/A"}
							</span>
						</div>
					</div>
				</div>

				{/* Payment Progress */}
				<div className="bg-white border rounded-lg p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Payment Progress
					</h2>
					<div className="space-y-4">
						<div>
							<div className="flex justify-between text-sm text-gray-600 mb-1">
								<span>Paid</span>
								<span>{progressPercentage.toFixed(1)}%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-green-600 h-2 rounded-full transition-all duration-300"
									style={{ width: `${progressPercentage}%` }}
								></div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-gray-600">
									Amount Paid:
								</span>
								<p className="font-medium text-green-600">
									₱
									{(
										loan.principal_amount -
										loan.remaining_balance
									).toLocaleString()}
								</p>
							</div>
							<div>
								<span className="text-gray-600">
									Amount Remaining:
								</span>
								<p className="font-medium text-red-600">
									₱{loan.remaining_balance?.toLocaleString()}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Loan Deductions Information */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
				<h2 className="text-xl font-semibold text-blue-900 mb-4">
					Loan Deductions Applied
				</h2>
				<p className="text-sm text-blue-700 mb-4">
					The following deductions were applied before loan
					disbursement:
				</p>
				<div className="grid md:grid-cols-2 gap-6">
					<div className="bg-white rounded-lg p-4 border border-blue-100">
						<h3 className="font-medium text-blue-800 mb-3">
							Deduction Breakdown
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-blue-700">
									Original Loan Amount:
								</span>
								<span className="font-medium text-blue-900">
									₱{originalAmount.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between text-red-600">
								<span>Share Capital (2%):</span>
								<span>
									-₱{deductions.shareCapital.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between text-red-600">
								<span>Savings Deposit (2%):</span>
								<span>
									-₱
									{deductions.savingsDeposit.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between text-red-600">
								<span>Service Fee (3%):</span>
								<span>
									-₱{deductions.serviceFee.toLocaleString()}
								</span>
							</div>
							<hr className="border-blue-200" />
							<div className="flex justify-between font-semibold">
								<span className="text-green-700">
									Net Cash Received:
								</span>
								<span className="text-green-800">
									₱
									{deductions.netCashReceived.toLocaleString()}
								</span>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg p-4 border border-blue-100">
						<h3 className="font-medium text-blue-800 mb-3">
							Important Notes
						</h3>
						<div className="space-y-2 text-sm text-blue-700">
							<p>
								• Share Capital contributes to your membership
								investment
							</p>
							<p>
								• Savings Deposit can be withdrawn after loan
								completion
							</p>
							<p>• Service Fee covers loan processing costs</p>
							<p>
								• Interest is calculated on diminishing balance
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Payment History */}
			<div className="bg-white border rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Payment History
				</h2>
				{paymentsError ? (
					<Alert type="error" message={paymentsError} />
				) : !payments || payments.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p>No payments recorded yet</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Amount
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Method
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Notes
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{payments.map((payment: Payment) => (
									<tr key={payment.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{payment.payment_date
												? new Date(
														payment.payment_date
												  ).toLocaleDateString()
												: "N/A"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
											₱
											{payment.payment_amount?.toLocaleString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											<Badge variant="default">
												{payment.payment_method}
											</Badge>
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{payment.notes || "-"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
