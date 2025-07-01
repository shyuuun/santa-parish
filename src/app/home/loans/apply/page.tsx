import { createLoanApplication } from "../actions";
import Alert from "@/src/components/Alert";
import Button from "@/src/components/Button";
import Link from "next/link";
import CheckboxField from "../components/CheckboxField";

export default async function ApplyLoanPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const resolvedSearchParams = await searchParams;

	return (
		<div className="p-6 max-w-2xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<Link
					href="/home/loans"
					className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
				>
					← Back to Loans
				</Link>
				<h1 className="text-3xl font-bold text-gray-900">
					Apply for Loan
				</h1>
				<p className="text-gray-600 mt-2">
					Fill out the form below to submit your loan application
				</p>
			</div>

			{/* Error Message */}
			{resolvedSearchParams.error && (
				<Alert type="error" message={resolvedSearchParams.error} />
			)}

			{/* Notice */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<div className="flex">
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">
							Application Notice
						</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>• Loan approval may take 1-2 business days</p>
							<p>
								• You will be notified once your application is
								reviewed
							</p>
							<p>
								• Make sure all information is accurate before
								submitting
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Application Form */}
			<form action={createLoanApplication} className="space-y-6">
				<div className="bg-white border rounded-lg p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Loan Information
					</h2>

					{/* Loan Type */}
					<div>
						<label
							htmlFor="loan_type"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Loan Type *
						</label>
						<select
							id="loan_type"
							name="loan_type"
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Select loan type</option>
							<option value="personal">Personal Loan</option>
							<option value="business">Business Loan</option>
							<option value="emergency">Emergency Loan</option>
							<option value="home_improvement">
								Home Improvement
							</option>
							<option value="education">Education Loan</option>
						</select>
					</div>

					{/* Amount Requested */}
					<div>
						<label
							htmlFor="amount_requested"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Amount Requested (₱) *
						</label>
						<input
							type="number"
							id="amount_requested"
							name="amount_requested"
							min="1000"
							max="500000"
							step="100"
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter amount (minimum ₱1,000)"
						/>
						<p className="mt-1 text-sm text-gray-500">
							Minimum: ₱1,000 | Maximum: ₱500,000
						</p>
					</div>

					{/* Purpose of Loan */}
					<div>
						<label
							htmlFor="purpose_loan"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Purpose of Loan *
						</label>
						<textarea
							id="purpose_loan"
							name="purpose_loan"
							rows={4}
							required
							maxLength={500}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Please describe the purpose of your loan application..."
						/>
						<p className="mt-1 text-sm text-gray-500">
							Maximum 500 characters
						</p>
					</div>
				</div>

				{/* Terms and Conditions */}
				<div className="bg-gray-50 border rounded-lg p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Terms & Conditions
					</h2>
					<div className="space-y-3 text-sm text-gray-700">
						<p>
							• Interest rates and loan terms will be determined
							by the cooperative based on your application
						</p>
						<p>
							• All loans are subject to approval by the loan
							committee
						</p>
						<p>
							• Loan payments are due monthly and should be made
							at the cooperative office
						</p>
						<p>• Late payments may incur additional fees</p>
						<p>
							• The cooperative reserves the right to approve,
							modify, or deny any loan application
						</p>
					</div>

					<CheckboxField
						id="agree_terms"
						name="agree_terms"
						label="I agree to the terms and conditions stated above and understand that my application will be reviewed by the loan committee."
						required={true}
					/>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end space-x-4">
					<Link href="/home/loans">
						<Button
							className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
							type="button"
						>
							Cancel
						</Button>
					</Link>
					<Button
						className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
						type="submit"
					>
						Submit Application
					</Button>
				</div>
			</form>
		</div>
	);
}
