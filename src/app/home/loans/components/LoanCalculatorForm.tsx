"use client";

import { useState } from "react";
import LoanCalculator from "./LoanCalculator";

export default function LoanCalculatorForm() {
	const [principal, setPrincipal] = useState<number>(10000);
	const [interestRate, setInterestRate] = useState<number>(2.5);
	const [termMonths, setTermMonths] = useState<number>(6);

	return (
		<div className="bg-gray-50 border rounded-lg p-6">
			<h2 className="text-xl font-semibold text-gray-900 mb-4">
				Loan Calculator
			</h2>
			<p className="text-gray-600 mb-4">
				Use this calculator to estimate your loan payments and see how
				deductions affect your net cash.
			</p>

			{/* Calculator Inputs */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div>
					<label
						htmlFor="calc-principal"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Loan Amount (₱)
					</label>
					<input
						type="number"
						id="calc-principal"
						min="1000"
						max="500000"
						step="1000"
						value={principal}
						onChange={(e) => setPrincipal(Number(e.target.value))}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label
						htmlFor="calc-interest"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Monthly Interest Rate (%)
					</label>
					<input
						type="number"
						id="calc-interest"
						min="0.1"
						max="10"
						step="0.1"
						value={interestRate}
						onChange={(e) =>
							setInterestRate(Number(e.target.value))
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label
						htmlFor="calc-term"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Term (Months)
					</label>
					<select
						id="calc-term"
						value={termMonths}
						onChange={(e) => setTermMonths(Number(e.target.value))}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value={3}>3 months</option>
						<option value={6}>6 months</option>
						<option value={12}>12 months</option>
						<option value={18}>18 months</option>
						<option value={24}>24 months</option>
						<option value={36}>36 months</option>
					</select>
				</div>
			</div>

			{/* Calculator Results */}
			{principal >= 1000 && termMonths > 0 && interestRate > 0 && (
				<LoanCalculator
					principal={principal}
					interestRate={interestRate}
					termMonths={termMonths}
				/>
			)}
		</div>
	);
}
