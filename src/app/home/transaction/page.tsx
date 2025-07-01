import {
	getUserTransactionHistory,
	getUserTransactionSummary,
} from "./actions";
import Alert from "@/src/components/Alert";
import Badge from "@/src/components/Badge";
import Link from "next/link";

export default async function TransactionPage() {
	const { transactions, error: transactionError } =
		await getUserTransactionHistory();
	const { summary, error: summaryError } = await getUserTransactionSummary();

	if (transactionError) {
		return (
			<div className="p-6">
				<Alert type="error" message={transactionError} />
			</div>
		);
	}

	return (
		<div className="p-6 max-w-6xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					Transaction History
				</h1>
				<p className="text-gray-600 mt-2">
					View your financial transaction history and summary
				</p>
			</div>

			{/* Summary Cards */}
			{summaryError ? (
				<Alert type="error" message={summaryError} />
			) : (
				summary && (
					<div className="grid md:grid-cols-4 gap-6 mb-8">
						<div className="bg-white border rounded-lg p-6">
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Total Loans Received
							</h3>
							<p className="text-2xl font-bold text-green-600">
								₱{summary.totalLoansReceived.toLocaleString()}
							</p>
						</div>
						<div className="bg-white border rounded-lg p-6">
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Total Payments Made
							</h3>
							<p className="text-2xl font-bold text-blue-600">
								₱{summary.totalPaymentsMade.toLocaleString()}
							</p>
						</div>
						<div className="bg-white border rounded-lg p-6">
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Net Amount
							</h3>
							<p
								className={`text-2xl font-bold ${
									summary.netAmount >= 0
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								₱{summary.netAmount.toLocaleString()}
							</p>
						</div>
						<div className="bg-white border rounded-lg p-6">
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Total Transactions
							</h3>
							<p className="text-2xl font-bold text-gray-900">
								{summary.transactionCount}
							</p>
						</div>
					</div>
				)
			)}

			{/* Transaction History */}
			<div className="bg-white border rounded-lg p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-900">
						Recent Transactions
					</h2>
					<div className="flex space-x-2">
						<Link
							href="/home/loans"
							className="text-blue-600 hover:text-blue-800 text-sm"
						>
							View Loans →
						</Link>
					</div>
				</div>

				{!transactions || transactions.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<svg
								className="mx-auto h-12 w-12"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No transactions found
						</h3>
						<p className="text-gray-500 mb-4">
							You haven&apos;t made any transactions yet.
						</p>
						<Link
							href="/home/loans/apply"
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Apply for Loan
						</Link>
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
										Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Amount
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Method
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{transactions.map((transaction) => (
									<tr
										key={transaction.id}
										className="hover:bg-gray-50"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{transaction.date
												? new Date(
														transaction.date
												  ).toLocaleDateString()
												: "N/A"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div
													className={`w-2 h-2 rounded-full mr-2 ${
														transaction.direction ===
														"incoming"
															? "bg-green-400"
															: "bg-blue-400"
													}`}
												></div>
												<span className="text-sm text-gray-900">
													{transaction.type ===
													"loan_payment"
														? "Payment"
														: "Disbursement"}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											<div>
												<p className="font-medium">
													{transaction.description}
												</p>
												{transaction.notes && (
													<p className="text-xs text-gray-500 mt-1">
														{transaction.notes}
													</p>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<span
												className={`${
													transaction.direction ===
													"incoming"
														? "text-green-600"
														: "text-blue-600"
												}`}
											>
												{transaction.direction ===
												"incoming"
													? "+"
													: "-"}
												₱
												{transaction.amount.toLocaleString()}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											<Badge variant="default">
												{transaction.method}
											</Badge>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<Badge variant="success">
												{transaction.status}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Quick Actions */}
			<div className="mt-8 bg-gray-50 border rounded-lg p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Quick Actions
				</h3>
				<div className="grid md:grid-cols-3 gap-4">
					<Link
						href="/home/loans/apply"
						className="flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
							<svg
								className="w-5 h-5 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
						<div>
							<h4 className="font-medium text-gray-900">
								Apply for Loan
							</h4>
							<p className="text-sm text-gray-500">
								Submit a new loan application
							</p>
						</div>
					</Link>

					<Link
						href="/home/loans"
						className="flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
							<svg
								className="w-5 h-5 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<h4 className="font-medium text-gray-900">
								View Loans
							</h4>
							<p className="text-sm text-gray-500">
								Check your active loans
							</p>
						</div>
					</Link>

					<Link
						href="/home/profile"
						className="flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
							<svg
								className="w-5 h-5 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<div>
							<h4 className="font-medium text-gray-900">
								Update Profile
							</h4>
							<p className="text-sm text-gray-500">
								Manage your account information
							</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
