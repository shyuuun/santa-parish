interface LoanCalculatorProps {
	principal: number;
	interestRate: number;
	termMonths: number;
}

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

	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<h3 className="font-semibold text-blue-900 mb-3">
				Loan Calculator
			</h3>
			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<span className="text-blue-800">Monthly Payment:</span>
					<span className="font-medium text-blue-900">
						₱{monthlyPayment.toLocaleString()}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-blue-800">Total Amount:</span>
					<span className="font-medium text-blue-900">
						₱{totalAmount.toLocaleString()}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-blue-800">Total Interest:</span>
					<span className="font-medium text-blue-900">
						₱{totalInterest.toLocaleString()}
					</span>
				</div>
			</div>
		</div>
	);
}
