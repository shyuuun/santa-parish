import {
	LoanDeductions,
	AmortizationScheduleItem,
} from "../../../../utils/types";

interface LoanCalculatorProps {
	principal: number;
	interestRate: number;
	termMonths: number;
}

// Calculate deductions (total 7%)
export function calculateLoanDeductions(principal: number): LoanDeductions {
	const shareCapital = principal * 0.02; // 2%
	const savingsDeposit = principal * 0.02; // 2%
	const serviceFee = principal * 0.03; // 3%
	const totalDeductions = shareCapital + savingsDeposit + serviceFee;
	const netCashReceived = principal - totalDeductions;

	return {
		shareCapital: Math.round(shareCapital * 100) / 100,
		savingsDeposit: Math.round(savingsDeposit * 100) / 100,
		serviceFee: Math.round(serviceFee * 100) / 100,
		totalDeductions: Math.round(totalDeductions * 100) / 100,
		netCashReceived: Math.round(netCashReceived * 100) / 100,
	};
}

// Calculate monthly payment using standard amortization formula
export function calculateLoanPayment({
	principal,
	interestRate,
	termMonths,
}: LoanCalculatorProps) {
	if (principal <= 0 || interestRate <= 0 || termMonths <= 0) {
		return 0;
	}

	const monthlyRate = interestRate / 100 / 12;
	const monthlyPayment =
		(principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
		(Math.pow(1 + monthlyRate, termMonths) - 1);

	return Math.round(monthlyPayment * 100) / 100;
}

// Generate amortization schedule for diminishing balance
export function generateAmortizationSchedule({
	principal,
	interestRate,
	termMonths,
}: LoanCalculatorProps): AmortizationScheduleItem[] {
	const monthlyPayment = calculateLoanPayment({
		principal,
		interestRate,
		termMonths,
	});
	const monthlyRate = interestRate / 100 / 12;
	const schedule: AmortizationScheduleItem[] = [];
	let remainingBalance = principal;

	for (let month = 1; month <= termMonths; month++) {
		const interestPayment = remainingBalance * monthlyRate;
		const principalPayment = monthlyPayment - interestPayment;
		remainingBalance = Math.max(0, remainingBalance - principalPayment);

		schedule.push({
			month,
			monthlyPayment: Math.round(monthlyPayment * 100) / 100,
			interestPayment: Math.round(interestPayment * 100) / 100,
			principalPayment: Math.round(principalPayment * 100) / 100,
			remainingBalance: Math.round(remainingBalance * 100) / 100,
		});
	}

	return schedule;
}

export function calculateTotalAmount({
	principal,
	interestRate,
	termMonths,
}: LoanCalculatorProps) {
	const monthlyPayment = calculateLoanPayment({
		principal,
		interestRate,
		termMonths,
	});
	return monthlyPayment * termMonths;
}

export function calculateTotalInterest({
	principal,
	interestRate,
	termMonths,
}: LoanCalculatorProps) {
	const totalAmount = calculateTotalAmount({
		principal,
		interestRate,
		termMonths,
	});
	return totalAmount - principal;
}

export default function LoanCalculator({
	principal,
	interestRate,
	termMonths,
}: LoanCalculatorProps) {
	const monthlyPayment = calculateLoanPayment({
		principal,
		interestRate,
		termMonths,
	});
	const totalAmount = calculateTotalAmount({
		principal,
		interestRate,
		termMonths,
	});
	const totalInterest = calculateTotalInterest({
		principal,
		interestRate,
		termMonths,
	});
	const deductions = calculateLoanDeductions(principal);

	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<h3 className="font-semibold text-blue-900 mb-3">
				Loan Calculator - Diminishing Balance
			</h3>

			{/* Loan Details */}
			<div className="space-y-3 text-sm">
				<div className="bg-white rounded-lg p-3 border border-blue-100">
					<h4 className="font-medium text-blue-800 mb-2">
						Loan Amount & Deductions
					</h4>
					<div className="space-y-1">
						<div className="flex justify-between">
							<span className="text-blue-700">
								Requested Amount:
							</span>
							<span className="font-medium text-blue-900">
								₱{principal.toLocaleString()}
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
								-₱{deductions.savingsDeposit.toLocaleString()}
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
								₱{deductions.netCashReceived.toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				{/* Payment Summary */}
				<div className="bg-white rounded-lg p-3 border border-blue-100">
					<h4 className="font-medium text-blue-800 mb-2">
						Payment Summary
					</h4>
					<div className="space-y-1">
						<div className="flex justify-between">
							<span className="text-blue-700">
								Monthly Payment:
							</span>
							<span className="font-medium text-blue-900">
								₱{monthlyPayment.toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-blue-700">Term:</span>
							<span className="font-medium text-blue-900">
								{termMonths} months
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-blue-700">
								Interest Rate:
							</span>
							<span className="font-medium text-blue-900">
								{interestRate}% monthly (diminishing)
							</span>
						</div>
						<hr className="border-blue-200" />
						<div className="flex justify-between">
							<span className="text-blue-700">
								Total Amount to Pay:
							</span>
							<span className="font-medium text-blue-900">
								₱{totalAmount.toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-blue-700">
								Total Interest:
							</span>
							<span className="font-medium text-blue-900">
								₱{totalInterest.toLocaleString()}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-3 text-xs text-blue-600 bg-blue-100 rounded p-2">
				<strong>Note:</strong> Interest is calculated on diminishing
				balance - you pay less interest over time as your principal
				balance decreases.
			</div>
		</div>
	);
}
