"use client";

import { createClient } from "@/src/utils/supabase/cilent";
import { LoanDetail, LoanApplication, Users } from "@/src/utils/types";
import { useEffect, useState } from "react";
import Badge from "@/src/components/Badge";
import LoanDetailActions from "./LoanDetailActions";
import { TableCell, TableRow } from "@/src/components/shadcn/table";

interface LoanDetailRowProps {
	loan: LoanDetail;
	onActionComplete: () => void;
}

export default function LoanDetailRow({
	loan,
	onActionComplete,
}: LoanDetailRowProps) {
	const [loanApplication, setLoanApplication] =
		useState<LoanApplication | null>(null);
	const [user, setUser] = useState<Users | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchLoanData = async () => {
			if (!loan.loan_application_id) return;

			const supabase = createClient();

			// Fetch loan application
			const { data: appData, error: appError } = await supabase
				.from("loan_applications")
				.select("*")
				.eq("app_id", loan.loan_application_id)
				.single();

			if (appError) {
				console.error("Error fetching loan application:", appError);
				setIsLoading(false);
				return;
			}

			setLoanApplication(appData);

			// Fetch user data
			if (appData.applicant_id) {
				const { data: userData, error: userError } = await supabase
					.from("users_complete_profiles")
					.select("*")
					.eq("user_id", appData.applicant_id)
					.single();

				if (userError) {
					console.error("Error fetching user:", userError);
				} else {
					setUser(userData);
				}
			}

			setIsLoading(false);
		};

		fetchLoanData();
	}, [loan.loan_application_id]);

	if (isLoading) {
		return (
			<TableRow>
				<TableCell colSpan={9} className="text-center">
					Loading loan data...
				</TableCell>
			</TableRow>
		);
	}

	return (
		<TableRow>
			<TableCell>{user?.name || "N/A"}</TableCell>
			<TableCell>{user?.email || "N/A"}</TableCell>
			<TableCell>
				<Badge variant="default">
					{loanApplication?.loan_type || "N/A"}
				</Badge>
			</TableCell>
			<TableCell>₱{loan.principal_amount.toLocaleString()}</TableCell>
			<TableCell>₱{loan.remaining_balance.toLocaleString()}</TableCell>
			<TableCell>₱{loan.monthly_payment.toLocaleString()}</TableCell>
			<TableCell>
				{loan.next_payment_date
					? new Date(loan.next_payment_date).toLocaleDateString()
					: "N/A"}
			</TableCell>
			<TableCell>
				<Badge
					variant={
						loan.loan_status === "active" ? "success" : "default"
					}
				>
					{loan.loan_status}
				</Badge>
			</TableCell>
			<TableCell>
				<LoanDetailActions
					loan={{
						...loan,
						loan_applications: loanApplication
							? {
									...loanApplication,
									users_complete_profiles: user
										? {
												name: user.name || "",
												email: user.email || "",
										  }
										: undefined,
							  }
							: undefined,
					}}
					onActionComplete={onActionComplete}
				/>
			</TableCell>
		</TableRow>
	);
}
