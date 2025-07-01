"use client";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/src/components/shadcn/sheet";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/shadcn/dialog";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { Textarea } from "@/src/components/shadcn/textarea";
import { Button } from "@/src/components/shadcn/button";
import { LoanDetailWithInfo, Payment } from "@/src/utils/types";
import { useState, useEffect, useCallback } from "react";
import { recordPayment } from "../actions";
import { createClient } from "@/src/utils/supabase/cilent";
import { toast } from "sonner";

interface LoanDetailActionsProps {
	loan: LoanDetailWithInfo;
	onActionComplete: () => void;
}

export default function LoanDetailActions({
	loan,
	onActionComplete,
}: LoanDetailActionsProps) {
	const [paymentData, setPaymentData] = useState({
		payment_amount: loan.monthly_payment,
		payment_method: "counter",
		notes: "",
	});
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);

	const fetchPaymentHistory = useCallback(async () => {
		setIsLoadingHistory(true);
		const supabase = createClient();
		const { data, error } = await supabase
			.from("payments")
			.select("*")
			.eq("loan_id", loan.id)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching payment history:", error);
		} else {
			setPaymentHistory(data || []);
		}
		setIsLoadingHistory(false);
	}, [loan.id]);

	useEffect(() => {
		if (isDetailOpen) {
			fetchPaymentHistory();
		}
	}, [isDetailOpen, fetchPaymentHistory]);

	const handlePaymentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("loan_id", loan.id.toString());
		formData.append(
			"payment_amount",
			paymentData.payment_amount.toString()
		);
		formData.append("payment_method", paymentData.payment_method);
		formData.append("notes", paymentData.notes);

		const result = await recordPayment(formData);

		if (result.type === "success") {
			toast.success(result.msg || "Payment recorded successfully", {
				duration: 3000,
			});
			setIsPaymentOpen(false);
			onActionComplete();
		} else {
			toast.error(result.msg || "Failed to record payment", {
				duration: 3000,
			});
		}
	};

	const completionPercentage = Math.round(
		((loan.principal_amount - loan.remaining_balance) /
			loan.principal_amount) *
			100
	);

	return (
		<div className="flex gap-2">
			{/* View Details */}
			<Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" size="sm">
						View
					</Button>
				</SheetTrigger>
				<SheetContent className="sm:max-w-[600px]">
					<SheetHeader>
						<SheetTitle>Loan Details</SheetTitle>
						<SheetDescription>
							Complete loan information and payment history.
						</SheetDescription>
					</SheetHeader>
					<div className="grid gap-6 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
						{/* Loan Information */}
						<div className="grid gap-4">
							<h3 className="font-semibold text-lg">
								Loan Information
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="font-semibold">
										Borrower Name
									</Label>
									<p>
										{loan.loan_applications
											?.users_complete_profiles?.name ||
											"N/A"}
									</p>
								</div>
								<div>
									<Label className="font-semibold">
										Email
									</Label>
									<p>
										{loan.loan_applications
											?.users_complete_profiles?.email ||
											"N/A"}
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="font-semibold">
										Loan Type
									</Label>
									<p>
										{loan.loan_applications?.loan_type ||
											"N/A"}
									</p>
								</div>
								<div>
									<Label className="font-semibold">
										Loan Status
									</Label>
									<p className="capitalize">
										{loan.loan_status}
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="font-semibold">
										Principal Amount
									</Label>
									<p>
										₱
										{loan.principal_amount.toLocaleString()}
									</p>
								</div>
								<div>
									<Label className="font-semibold">
										Remaining Balance
									</Label>
									<p>
										₱
										{loan.remaining_balance.toLocaleString()}
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="font-semibold">
										Monthly Payment
									</Label>
									<p>
										₱{loan.monthly_payment.toLocaleString()}
									</p>
								</div>
								<div>
									<Label className="font-semibold">
										Next Payment Date
									</Label>
									<p>
										{loan.next_payment_date
											? new Date(
													loan.next_payment_date
											  ).toLocaleDateString()
											: "N/A"}
									</p>
								</div>
							</div>
							<div>
								<Label className="font-semibold">
									Progress
								</Label>
								<div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
									<div
										className="bg-green-600 h-2.5 rounded-full"
										style={{
											width: `${completionPercentage}%`,
										}}
									></div>
								</div>
								<p className="text-sm text-gray-600 mt-1">
									{completionPercentage}% paid
								</p>
							</div>
						</div>

						{/* Payment History */}
						<div className="grid gap-4">
							<h3 className="font-semibold text-lg">
								Payment History
							</h3>
							{isLoadingHistory ? (
								<p>Loading payment history...</p>
							) : paymentHistory.length === 0 ? (
								<p>No payments recorded yet.</p>
							) : (
								<div className="space-y-2 max-h-64 overflow-y-auto">
									{paymentHistory.map((payment, index) => (
										<div
											key={index}
											className="border p-3 rounded-lg"
										>
											<div className="flex justify-between items-start">
												<div>
													<p className="font-medium">
														₱
														{payment.payment_amount.toLocaleString()}
													</p>
													<p className="text-sm text-gray-600">
														{payment.created_at
															? new Date(
																	payment.created_at
															  ).toLocaleDateString()
															: "N/A"}{" "}
														-{" "}
														{payment.payment_method}
													</p>
													{payment.notes && (
														<p className="text-sm text-gray-500 mt-1">
															{payment.notes}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
					<SheetFooter>
						<SheetClose asChild>
							<Button variant="outline">Close</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>

			{/* Record Payment */}
			{loan.loan_status === "active" && (
				<Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
					<DialogTrigger asChild>
						<Button
							variant="default"
							size="sm"
							className="bg-blue-600 hover:bg-blue-700 text-white"
						>
							Record Payment
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Record Payment</DialogTitle>
							<DialogDescription>
								Record a payment for{" "}
								{
									loan.loan_applications
										?.users_complete_profiles?.name
								}
								&apos;s loan.
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handlePaymentSubmit}>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label
										htmlFor="payment_amount"
										className="text-right"
									>
										Amount
									</Label>
									<Input
										id="payment_amount"
										type="number"
										step="0.01"
										min="0.01"
										max={loan.remaining_balance}
										value={paymentData.payment_amount}
										onChange={(e) =>
											setPaymentData({
												...paymentData,
												payment_amount:
													parseFloat(
														e.target.value
													) || 0,
											})
										}
										className="col-span-3"
										required
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label
										htmlFor="payment_method"
										className="text-right"
									>
										Method
									</Label>
									<select
										id="payment_method"
										value={paymentData.payment_method}
										onChange={(e) =>
											setPaymentData({
												...paymentData,
												payment_method: e.target.value,
											})
										}
										className="col-span-3 border rounded px-3 py-2"
										required
									>
										<option value="counter">
											Counter Payment
										</option>
										<option value="bank_transfer">
											Bank Transfer
										</option>
										<option value="check">Check</option>
										<option value="cash">Cash</option>
									</select>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label
										htmlFor="notes"
										className="text-right"
									>
										Notes
									</Label>
									<Textarea
										id="notes"
										placeholder="Optional notes..."
										value={paymentData.notes}
										onChange={(e) =>
											setPaymentData({
												...paymentData,
												notes: e.target.value,
											})
										}
										className="col-span-3"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right">
										Remaining After
									</Label>
									<div className="col-span-3 font-semibold">
										₱
										{Math.max(
											0,
											loan.remaining_balance -
												paymentData.payment_amount
										).toLocaleString()}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsPaymentOpen(false)}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="bg-blue-600 hover:bg-blue-700 text-white"
								>
									Record Payment
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
