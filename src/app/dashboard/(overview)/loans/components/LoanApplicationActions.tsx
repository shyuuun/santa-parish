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
import { LoanApplicationWithUser } from "@/src/utils/types";
import { useState } from "react";
import { approveLoanApplication, denyLoanApplication } from "../actions";
import { toast } from "sonner";

interface LoanApplicationActionsProps {
	application: LoanApplicationWithUser;
	onActionComplete: () => void;
}

export default function LoanApplicationActions({
	application,
	onActionComplete,
}: LoanApplicationActionsProps) {
	const [approvalData, setApprovalData] = useState({
		approved_amount: application.amount_requested,
		interest_rate: 5.0, // Default 5%
		loan_term_months: 12, // Default 1 year
		monthly_payment: 0,
	});
	const [denialReason, setDenialReason] = useState("");
	const [isApprovalOpen, setIsApprovalOpen] = useState(false);
	const [isDenialOpen, setIsDenialOpen] = useState(false);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Calculate monthly payment when approval data changes
	const calculateMonthlyPayment = () => {
		const { approved_amount, interest_rate, loan_term_months } =
			approvalData;
		if (approved_amount > 0 && interest_rate > 0 && loan_term_months > 0) {
			const monthlyRate = interest_rate / 100 / 12;
			const payment =
				(approved_amount *
					monthlyRate *
					Math.pow(1 + monthlyRate, loan_term_months)) /
				(Math.pow(1 + monthlyRate, loan_term_months) - 1);
			return Math.round(payment * 100) / 100; // Round to 2 decimal places
		}
		return 0;
	};

	const handleApprovalSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("application_id", application.app_id.toString());
		formData.append(
			"approved_amount",
			approvalData.approved_amount.toString()
		);
		formData.append("interest_rate", approvalData.interest_rate.toString());
		formData.append(
			"loan_term_months",
			approvalData.loan_term_months.toString()
		);
		formData.append(
			"monthly_payment",
			calculateMonthlyPayment().toString()
		);

		const result = await approveLoanApplication(formData);

		if (result.type === "success") {
			toast.success(result.msg || "Loan approved successfully", {
				duration: 3000,
			});
			setIsApprovalOpen(false);
			onActionComplete();
		} else {
			toast.error(result.msg || "Failed to approve loan", {
				duration: 3000,
			});
		}
	};

	const handleDenialSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("application_id", application.app_id.toString());
		formData.append("denial_reason", denialReason);

		const result = await denyLoanApplication(formData);

		if (result.type === "success") {
			toast.success(result.msg || "Loan denied successfully", {
				duration: 3000,
			});
			setIsDenialOpen(false);
			onActionComplete();
		} else {
			toast.error(result.msg || "Failed to deny loan", {
				duration: 3000,
			});
		}
	};

	return (
		<div className="flex gap-2">
			{/* View Details */}
			<Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" size="sm">
						View
					</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Loan Application Details</SheetTitle>
						<SheetDescription>
							Review the complete loan application information.
						</SheetDescription>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label className="font-semibold">
									Applicant Name
								</Label>
								<p>
									{application.users_complete_profiles
										?.name || "N/A"}
								</p>
							</div>
							<div>
								<Label className="font-semibold">Email</Label>
								<p>
									{application.users_complete_profiles
										?.email || "N/A"}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label className="font-semibold">
									Loan Type
								</Label>
								<p>{application.loan_type}</p>
							</div>
							<div>
								<Label className="font-semibold">
									Amount Requested
								</Label>
								<p>
									₱
									{application.amount_requested.toLocaleString()}
								</p>
							</div>
						</div>
						<div>
							<Label className="font-semibold">
								Purpose of Loan
							</Label>
							<p className="whitespace-pre-wrap">
								{application.purpose_loan}
							</p>
						</div>
						<div>
							<Label className="font-semibold">
								Application Date
							</Label>
							<p>
								{new Date(
									application.created_at || ""
								).toLocaleDateString()}
							</p>
						</div>
						<div>
							<Label className="font-semibold">Status</Label>
							<p className="capitalize">
								{application.app_status}
							</p>
						</div>
					</div>
					<SheetFooter>
						<SheetClose asChild>
							<Button variant="outline">Close</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>

			{/* Approve Application */}
			<Dialog open={isApprovalOpen} onOpenChange={setIsApprovalOpen}>
				<DialogTrigger asChild>
					<Button
						variant="default"
						size="sm"
						className="bg-green-600 hover:bg-green-700 text-white"
					>
						Approve
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Approve Loan Application</DialogTitle>
						<DialogDescription>
							Set the loan terms for{" "}
							{application.users_complete_profiles?.name}&apos;s
							application.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleApprovalSubmit}>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label
									htmlFor="approved_amount"
									className="text-right"
								>
									Amount
								</Label>
								<Input
									id="approved_amount"
									type="number"
									step="0.01"
									min="1"
									max={application.amount_requested}
									value={approvalData.approved_amount}
									onChange={(e) =>
										setApprovalData({
											...approvalData,
											approved_amount:
												parseFloat(e.target.value) || 0,
										})
									}
									className="col-span-3"
									required
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label
									htmlFor="interest_rate"
									className="text-right"
								>
									Interest Rate (%)
								</Label>
								<Input
									id="interest_rate"
									type="number"
									step="0.1"
									min="0.1"
									max="50"
									value={approvalData.interest_rate}
									onChange={(e) =>
										setApprovalData({
											...approvalData,
											interest_rate:
												parseFloat(e.target.value) || 0,
										})
									}
									className="col-span-3"
									required
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label
									htmlFor="loan_term_months"
									className="text-right"
								>
									Term (Months)
								</Label>
								<Input
									id="loan_term_months"
									type="number"
									min="1"
									max="120"
									value={approvalData.loan_term_months}
									onChange={(e) =>
										setApprovalData({
											...approvalData,
											loan_term_months:
												parseInt(e.target.value) || 0,
										})
									}
									className="col-span-3"
									required
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right">
									Monthly Payment
								</Label>
								<div className="col-span-3 font-semibold">
									₱
									{calculateMonthlyPayment().toLocaleString()}
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsApprovalOpen(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-green-600 hover:bg-green-700 text-white"
							>
								Approve Loan
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Deny Application */}
			<Dialog open={isDenialOpen} onOpenChange={setIsDenialOpen}>
				<DialogTrigger asChild>
					<Button variant="destructive" size="sm">
						Deny
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Deny Loan Application</DialogTitle>
						<DialogDescription>
							Provide a reason for denying{" "}
							{application.users_complete_profiles?.name}&apos;s
							loan application.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleDenialSubmit}>
						<div className="grid gap-4 py-4">
							<div>
								<Label htmlFor="denial_reason">
									Reason for Denial (Optional)
								</Label>
								<Textarea
									id="denial_reason"
									placeholder="Enter reason for denial..."
									value={denialReason}
									onChange={(e) =>
										setDenialReason(e.target.value)
									}
									className="min-h-[100px]"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDenialOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" variant="destructive">
								Deny Application
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
