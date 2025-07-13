// Global utility functions

/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends (...args: any[]) => any>(
	cb: T,
	ms: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
	let timeoutId: NodeJS.Timeout;
	console.log("Debounce function initialized with delay:", ms);
	return (...args: Parameters<T>): Promise<ReturnType<T>> => {
		return new Promise((resolve) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				resolve(cb(...args));
			}, ms);
		});
	};
}

// Loan calculation utilities for chat bot and general use
export function formatCurrency(amount: number): string {
	return `₱${Math.round(amount * 100) / 100}`;
}

export function calculateLoanDeductionsDetailed(principal: number) {
	const shareCapital = Math.round(principal * 0.02 * 100) / 100; // 2%
	const savingsDeposit = Math.round(principal * 0.02 * 100) / 100; // 2%
	const serviceFee = Math.round(principal * 0.03 * 100) / 100; // 3%
	const totalDeductions = shareCapital + savingsDeposit + serviceFee;
	const netCashReceived = principal - totalDeductions;

	return {
		shareCapital,
		savingsDeposit,
		serviceFee,
		totalDeductions,
		netCashReceived,
		deductionPercentage: 7,
	};
}

export function calculateDiminishingBalanceLoan(
	principal: number,
	monthlyInterestRate: number,
	termMonths: number
) {
	if (principal <= 0 || monthlyInterestRate <= 0 || termMonths <= 0) {
		return null;
	}

	const monthlyRate = monthlyInterestRate / 100;
	const monthlyPayment =
		(principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
		(Math.pow(1 + monthlyRate, termMonths) - 1);

	const schedule = [];
	let remainingBalance = principal;
	let totalInterest = 0;

	for (let month = 1; month <= termMonths; month++) {
		const interestPayment = remainingBalance * monthlyRate;
		const principalPayment = monthlyPayment - interestPayment;
		remainingBalance = Math.max(0, remainingBalance - principalPayment);
		totalInterest += interestPayment;

		schedule.push({
			month,
			monthlyPayment: Math.round(monthlyPayment * 100) / 100,
			interestPayment: Math.round(interestPayment * 100) / 100,
			principalPayment: Math.round(principalPayment * 100) / 100,
			remainingBalance: Math.round(remainingBalance * 100) / 100,
		});
	}

	return {
		monthlyPayment: Math.round(monthlyPayment * 100) / 100,
		totalPayments: Math.round(monthlyPayment * termMonths * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		schedule,
		deductions: calculateLoanDeductionsDetailed(principal),
	};
}

// Generate markdown formatted loan explanation for chat bot
export function generateLoanExplanationMarkdown(
	principal: number,
	monthlyInterestRate: number,
	termMonths: number
): string {
	const loanCalc = calculateDiminishingBalanceLoan(
		principal,
		monthlyInterestRate,
		termMonths
	);

	if (!loanCalc) {
		return "Invalid loan parameters provided. Please check your inputs.";
	}

	const {
		monthlyPayment,
		totalPayments,
		totalInterest,
		schedule,
		deductions,
	} = loanCalc;

	let markdown = `## Loan Calculation: ${formatCurrency(
		principal
	)} for ${termMonths} months\n\n`;

	markdown += `You are applying for a **${formatCurrency(
		principal
	)} loan** payable over **${termMonths} months**. The loan uses a **${monthlyInterestRate}% monthly interest** on a diminishing balance, which means interest is calculated only on the remaining loan balance each month—not on the full amount. As you pay off the loan, your interest charges gradually decrease.\n\n`;

	// Deductions section
	markdown += `### Pre-disbursement Deductions\n\n`;
	markdown += `Before you receive the money, several deductions will be made from the loan amount:\n\n`;
	markdown += `- **${formatCurrency(
		deductions.shareCapital
	)}** (2%) goes to your share capital – this is a required contribution that acts like your investment in the cooperative.\n`;
	markdown += `- **${formatCurrency(
		deductions.savingsDeposit
	)}** (2%) goes to your savings deposit – this is a form of forced savings, which may be withdrawn later.\n`;
	markdown += `- **${formatCurrency(
		deductions.serviceFee
	)}** (3%) is charged as a service fee – this is the processing cost of the loan.\n\n`;
	markdown += `**After these deductions, you will receive a net cash amount of ${formatCurrency(
		deductions.netCashReceived
	)}.**\n\n`;

	// Payment summary
	markdown += `### Payment Summary\n\n`;
	markdown += `- **Monthly Payment:** ${formatCurrency(monthlyPayment)}\n`;
	markdown += `- **Total Payments:** ${formatCurrency(totalPayments)}\n`;
	markdown += `- **Total Interest:** ${formatCurrency(totalInterest)}\n\n`;

	// Amortization table
	markdown += `### Amortization Schedule\n\n`;
	markdown += `| Month | Payment | Interest | Principal | Balance |\n`;
	markdown += `|-------|---------|----------|-----------|----------|\n`;

	schedule.forEach((item) => {
		markdown += `| ${item.month} | ${formatCurrency(
			item.monthlyPayment
		)} | ${formatCurrency(item.interestPayment)} | ${formatCurrency(
			item.principalPayment
		)} | ${formatCurrency(item.remainingBalance)} |\n`;
	});

	markdown += `\n**How it works:** In the early months, a larger portion of your payment goes to interest. As the balance decreases, more of your payment goes toward the principal, and less toward interest.\n\n`;

	return markdown;
}
