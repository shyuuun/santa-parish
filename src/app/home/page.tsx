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

	// Mock data for demonstration - replace with actual data from your database
	const activeLoanAmount = 5000.0;
	const nextPaymentDate = "2025-01-15";

	const quickActions = [
		{
			title: "Apply for Loan",
			href: "/home/loans/apply",
			icon: CreditCard,
			color: "bg-red-500",
		},
		{
			title: "View Transactions",
			href: "/home/transactions",
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

	const recentTransactions = [
		{
			id: 1,
			type: "Deposit",
			amount: 500,
			date: "2025-01-02",
			description: "Salary Deposit",
		},
		{
			id: 2,
			type: "Withdrawal",
			amount: -150,
			date: "2025-01-01",
			description: "ATM Withdrawal",
		},
		{
			id: 3,
			type: "Transfer",
			amount: -200,
			date: "2024-12-28",
			description: "Bill Payment",
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
						<div className="text-2xl font-bold">
							₱{activeLoanAmount.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							Next payment: {nextPaymentDate}
						</p>
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
						<Link href="/home/transactions">
							<Button variant="outline" size="sm">
								View All
							</Button>
						</Link>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentTransactions.map((transaction) => (
								<div
									key={transaction.id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center space-x-3">
										<div
											className={`p-2 rounded-full ${
												transaction.type === "Deposit"
													? "bg-green-100"
													: transaction.type ===
													  "Withdrawal"
													? "bg-red-100"
													: "bg-blue-100"
											}`}
										>
											<DollarSign
												className={`h-4 w-4 ${
													transaction.type ===
													"Deposit"
														? "text-green-600"
														: transaction.type ===
														  "Withdrawal"
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
												{transaction.date}
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
