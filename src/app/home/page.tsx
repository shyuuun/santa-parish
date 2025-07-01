import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/shadcn/card";
import Badge from "@/src/components/Badge";
import { Button } from "@/src/components/shadcn/button";
import Link from "next/link";
import {
	CreditCard,
	DollarSign,
	FileText,
	Calendar,
	Bell,
	User,
	Settings,
} from "lucide-react";

async function getUserActiveLoans(userId: string) {
	const supabase = await createClient();

	const { data: loans, error } = await supabase
		.from("loan_details")
		.select(
			`
			*,
			loan_applications (
				loan_type,
				purpose_loan
			)
		`
		)
		.eq("applicant_id", userId)
		.eq("loan_status", "active")
		.order("created_at", { ascending: false })
		.limit(1);

	if (error) {
		console.error("Error fetching active loans:", error);
		return null;
	}

	return loans?.[0] || null;
}

async function getUserRecentTransactions(userId: string) {
	const supabase = await createClient();

	// Get recent payments
	const { data: payments, error: paymentsError } = await supabase
		.from("payments")
		.select(
			`
			*,
			loan_details!inner (
				applicant_id,
				loan_applications (
					loan_type
				)
			)
		`
		)
		.eq("loan_details.applicant_id", userId)
		.order("payment_date", { ascending: false })
		.limit(3);

	// Get recent loan disbursements
	const { data: loans, error: loansError } = await supabase
		.from("loan_details")
		.select(
			`
			*,
			loan_applications (
				loan_type
			)
		`
		)
		.eq("applicant_id", userId)
		.order("created_at", { ascending: false })
		.limit(2);

	interface Transaction {
		id: string;
		type: string;
		amount: number;
		date: string;
		description: string;
	}

	const transactions: Transaction[] = [];

	// Add payments as transactions
	if (!paymentsError && payments) {
		payments.forEach((payment) => {
			transactions.push({
				id: `payment-${payment.id}`,
				type: "Payment",
				amount: -payment.payment_amount,
				date: payment.payment_date || payment.created_at || "",
				description: `Loan Payment - ${
					payment.loan_details?.loan_applications?.loan_type || "Loan"
				}`,
			});
		});
	}

	// Add disbursements as transactions
	if (!loansError && loans) {
		loans.forEach((loan) => {
			transactions.push({
				id: `disbursement-${loan.id}`,
				type: "Disbursement",
				amount: loan.principal_amount,
				date: loan.created_at || "",
				description: `Loan Disbursement - ${
					loan.loan_applications?.loan_type || "Loan"
				}`,
			});
		});
	}

	// Sort by date and return top 3
	return transactions
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 3);
}

export default async function HomePage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get user info
	const { data: userInfo } = await supabase
		.from("user_info")
		.select("*")
		.eq("uuid", user.id)
		.single();

	// Get real data
	const activeLoan = await getUserActiveLoans(user.id);
	const recentTransactions = await getUserRecentTransactions(user.id);

	const quickActions = [
		{
			title: "Apply for Loan",
			href: "/home/loans/apply",
			icon: CreditCard,
			color: "bg-red-500",
		},
		{
			title: "View Transactions",
			href: "/home/transaction",
			icon: FileText,
			color: "bg-blue-500",
		},
		{
			title: "Loan Management",
			href: "/home/loans",
			icon: Calendar,
			color: "bg-red-600",
		},
	];

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-lg p-6 text-white">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold mb-2">
							Welcome back, {userInfo?.name || user.email}!
						</h1>
						<p className="text-red-100">
							Here&apos;s your financial overview for today
						</p>
					</div>
					<div className="text-right">
						<Badge className="bg-white/20 text-white border-white/30">
							Verified Member
						</Badge>
					</div>
				</div>
			</div>

			{/* Active Loan Overview */}
			<div className="grid gap-4 md:grid-cols-1">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Loan
						</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{activeLoan ? (
							<>
								<div className="text-2xl font-bold">
									₱
									{activeLoan.remaining_balance?.toLocaleString()}
								</div>
								<p className="text-xs text-muted-foreground">
									Remaining balance • Next payment:{" "}
									{activeLoan.next_payment_date
										? new Date(
												activeLoan.next_payment_date
										  ).toLocaleDateString()
										: "TBD"}
								</p>
								<div className="mt-2">
									<Link href="/home/loans">
										<Button size="sm" variant="outline">
											View Details
										</Button>
									</Link>
								</div>
							</>
						) : (
							<>
								<div className="text-2xl font-bold text-gray-400">
									₱0
								</div>
								<p className="text-xs text-muted-foreground">
									No active loans
								</p>
								<div className="mt-2">
									<Link href="/home/loans/apply">
										<Button size="sm" variant="outline">
											Apply for Loan
										</Button>
									</Link>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						{quickActions.map((action, index) => (
							<Link key={index} href={action.href}>
								<Button
									variant="outline"
									className="h-20 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50"
								>
									<div
										className={`p-2 rounded-full ${action.color}`}
									>
										<action.icon className="h-5 w-5 text-white" />
									</div>
									<span className="text-sm font-medium">
										{action.title}
									</span>
								</Button>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			<div className="grid gap-6 md:grid-cols-1">
				{/* Recent Transactions */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Recent Transactions</CardTitle>
						<Link href="/home/transaction">
							<Button variant="outline" size="sm">
								View All
							</Button>
						</Link>
					</CardHeader>
					<CardContent>
						{recentTransactions.length > 0 ? (
							<div className="space-y-4">
								{recentTransactions.map((transaction) => (
									<div
										key={transaction.id}
										className="flex items-center justify-between"
									>
										<div className="flex items-center space-x-3">
											<div
												className={`p-2 rounded-full ${
													transaction.type ===
													"Disbursement"
														? "bg-green-100"
														: transaction.type ===
														  "Payment"
														? "bg-red-100"
														: "bg-blue-100"
												}`}
											>
												<DollarSign
													className={`h-4 w-4 ${
														transaction.type ===
														"Disbursement"
															? "text-green-600"
															: transaction.type ===
															  "Payment"
															? "text-red-600"
															: "text-blue-600"
													}`}
												/>
											</div>
											<div>
												<p className="text-sm font-medium">
													{transaction.description}
												</p>
												<p className="text-xs text-muted-foreground">
													{transaction.date
														? new Date(
																transaction.date
														  ).toLocaleDateString()
														: "N/A"}
												</p>
											</div>
										</div>
										<div
											className={`text-sm font-medium ${
												transaction.amount > 0
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{transaction.amount > 0 ? "+" : ""}₱
											{Math.abs(
												transaction.amount
											).toLocaleString()}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-4">
								<p className="text-sm text-muted-foreground">
									No recent transactions
								</p>
								<Link
									href="/home/loans/apply"
									className="inline-block mt-2"
								>
									<Button size="sm" variant="outline">
										Apply for Loan
									</Button>
								</Link>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Quick Links */}
			<Card>
				<CardHeader>
					<CardTitle>Need Help?</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<Link href="/chat">
							<Button
								variant="outline"
								className="w-full justify-start"
							>
								<Settings className="mr-2 h-4 w-4" />
								Chat with AI Assistant
							</Button>
						</Link>
						<Link href="/home/profile">
							<Button
								variant="outline"
								className="w-full justify-start"
							>
								<User className="mr-2 h-4 w-4" />
								Update Profile
							</Button>
						</Link>
						<Link href="/announcements">
							<Button
								variant="outline"
								className="w-full justify-start"
							>
								<Bell className="mr-2 h-4 w-4" />
								View Announcements
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
