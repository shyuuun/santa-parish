"use client";

import { createClient } from "@/src/utils/supabase/cilent";
import { LoanApplication, Users } from "@/src/utils/types";
import { useEffect, useState } from "react";
import Badge from "@/src/components/Badge";
import LoanApplicationActions from "./LoanApplicationActions";
import { TableCell, TableRow } from "@/src/components/shadcn/table";

interface LoanApplicationRowProps {
	application: LoanApplication;
	onActionComplete: () => void;
}

export default function LoanApplicationRow({
	application,
	onActionComplete,
}: LoanApplicationRowProps) {
	const [user, setUser] = useState<Users | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			if (!application.applicant_id) return;

			const supabase = createClient();
			const { data, error } = await supabase
				.from("users_complete_profiles")
				.select("*")
				.eq("user_id", application.applicant_id)
				.single();

			if (error) {
				console.error("Error fetching user:", error);
			} else {
				setUser(data);
			}
			setIsLoading(false);
		};

		fetchUser();
	}, [application.applicant_id]);

	if (isLoading) {
		return (
			<TableRow>
				<TableCell colSpan={7} className="text-center">
					Loading user data...
				</TableCell>
			</TableRow>
		);
	}

	return (
		<TableRow>
			<TableCell>{user?.name || "N/A"}</TableCell>
			<TableCell>{user?.email || "N/A"}</TableCell>
			<TableCell>
				<Badge variant="default">{application.loan_type}</Badge>
			</TableCell>
			<TableCell>
				₱{application.amount_requested.toLocaleString()}
			</TableCell>
			<TableCell className="max-w-[200px] truncate">
				{application.purpose_loan}
			</TableCell>
			<TableCell>
				{application.created_at
					? new Date(application.created_at).toLocaleDateString()
					: "N/A"}
			</TableCell>
			<TableCell>
				<LoanApplicationActions
					application={{
						...application,
						users_complete_profiles: user
							? {
									name: user.name || "",
									email: user.email || "",
							  }
							: undefined,
					}}
					onActionComplete={onActionComplete}
				/>
			</TableCell>
		</TableRow>
	);
}
