import { getUserLoanApplications, getUserActiveLoans } from "./actions";
import Alert from "@/src/components/Alert";
import Button from "@/src/components/Button";
import Link from "next/link";
import Badge from "@/src/components/Badge";
import { Database } from "@/src/utils/database.types";

type LoanApplication = Database["public"]["Tables"]["loan_applications"]["Row"];
type LoanDetail = Database["public"]["Tables"]["loan_details"]["Row"] & {
	loan_applications?: {
		loan_type: string;
		purpose_loan: string;
		amount_requested: number;
	};
};

export default async function LoansPage({
	searchParams,
}: {
	searchParams: { success?: string };
}) {
	const { applications, error: appError } = await getUserLoanApplications();
	const { loans, error: loanError } = await getUserActiveLoans();

	if (appError) {
		return (
			<div className="p-6">
				<Alert type="error" message={appError} />
			</div>
		);
	}

	return (
		<div className="p-6 max-w-6xl mx-auto ">
			{/* Success Message */}
			{searchParams.success && (
				<Alert
					type="success"
					message="Loan application submitted successfully! Approval may take 1-2 business days."
				/>
			)}

			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						My Loans
					</h1>
					<p className="text-gray-600 mt-2">
						Manage your loan applications and active loans
					</p>
				</div>
				<Link href="/home/loans/apply">
					<Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
						Apply for Loan
					</Button>
				</Link>
			</div>

			{/* Active Loans Section */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Active Loans
				</h2>
				{loanError ? (
					<Alert type="error" message={loanError} />
				) : !loans || loans.length === 0 ? (
					<div className="bg-gray-50 rounded-lg p-8 text-center">
						<p className="text-gray-500">No active loans found</p>
					</div>
				) : (
					<div className="grid gap-4">
						{loans.map((loan: LoanDetail) => (
							<div
								key={loan.id}
								className="bg-white border rounded-lg p-6"
							>
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold text-lg text-gray-900">
											{loan.loan_applications
												?.loan_type || "N/A"}{" "}
											Loan
										</h3>
										<p className="text-gray-600 mb-2">
											{loan.loan_applications
												?.purpose_loan || "N/A"}
										</p>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
											<div>
												<span className="text-gray-500">
													Principal:
												</span>
												<p className="font-medium">
													₱
													{loan.principal_amount?.toLocaleString()}
												</p>
											</div>
											<div>
												<span className="text-gray-500">
													Remaining:
												</span>
												<p className="font-medium text-red-600">
													₱
													{loan.remaining_balance?.toLocaleString()}
												</p>
											</div>
											<div>
												<span className="text-gray-500">
													Monthly Payment:
												</span>
												<p className="font-medium">
													₱
													{loan.monthly_payment?.toLocaleString()}
												</p>
											</div>
											<div>
												<span className="text-gray-500">
													Next Payment:
												</span>
												<p className="font-medium">
													{loan.next_payment_date
														? new Date(
																loan.next_payment_date
														  ).toLocaleDateString()
														: "N/A"}
												</p>
											</div>
										</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<Badge
											variant={
												loan.loan_status === "active"
													? "success"
													: "default"
											}
										>
											{loan.loan_status}
										</Badge>
										<Link href={`/home/loans/${loan.id}`}>
											<Button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
												View Details
											</Button>
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Loan Applications Section */}
			<div>
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Application History
				</h2>
				{!applications || applications.length === 0 ? (
					<div className="bg-gray-50 rounded-lg p-8 text-center">
						<p className="text-gray-500">
							No loan applications found
						</p>
						<Link
							href="/home/loans/apply"
							className="inline-block mt-4"
						>
							<Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
								Apply for Your First Loan
							</Button>
						</Link>
					</div>
				) : (
					<div className="space-y-4">
						{applications.map((app: LoanApplication) => (
							<div
								key={app.app_id}
								className="bg-white border rounded-lg p-6"
							>
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold text-lg text-gray-900">
											{app.loan_type} Loan
										</h3>
										<p className="text-gray-600 mb-2">
											{app.purpose_loan}
										</p>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
											<div>
												<span className="text-gray-500">
													Requested Amount:
												</span>
												<p className="font-medium">
													₱
													{app.amount_requested?.toLocaleString()}
												</p>
											</div>
											{app.approved_amount && (
												<div>
													<span className="text-gray-500">
														Approved Amount:
													</span>
													<p className="font-medium">
														₱
														{app.approved_amount?.toLocaleString()}
													</p>
												</div>
											)}
											<div>
												<span className="text-gray-500">
													Applied:
												</span>
												<p className="font-medium">
													{app.created_at
														? new Date(
																app.created_at
														  ).toLocaleDateString()
														: "N/A"}
												</p>
											</div>
										</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<Badge
											variant={
												app.app_status === "approved"
													? "success"
													: app.app_status ===
													  "denied"
													? "error"
													: "warning"
											}
										>
											{app.app_status}
										</Badge>
										{app.app_status === "pending" && (
											<form
												action={`/home/loans/cancel/${app.app_id}`}
												method="POST"
											>
												<Button
													className="border border-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-50"
													type="submit"
												>
													Cancel
												</Button>
											</form>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
