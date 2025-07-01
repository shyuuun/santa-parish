"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/shadcn/table";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/src/components/shadcn/breadcrumb";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/src/components/shadcn/pagination";

import Search from "../admins/components/Search";
import { useFetchData } from "../hooks/useFetchData";
import { useRef, useState, useEffect } from "react";
import { LoanApplication, LoanDetail } from "@/src/utils/types";
import { debounce } from "@/src/utils/functions";
import { admin } from "@/src/utils/route";
import LoanApplicationRow from "./components/LoanApplicationRow";
import LoanDetailRow from "./components/LoanDetailRow";
import Alert from "@/src/components/Alert";

export default function LoansPage({
	searchParams,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState<"applications" | "active">(
		"applications"
	);
	const [alertMessage, setAlertMessage] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	// Handle URL parameters for success/error messages
	useEffect(() => {
		const processSearchParams = async () => {
			const params = await searchParams;
			if (params?.success) {
				setAlertMessage({
					type: "success",
					message: decodeURIComponent(params.success as string),
				});
			}
			if (params?.error) {
				setAlertMessage({
					type: "error",
					message: decodeURIComponent(params.error as string),
				});
			}
		};

		if (searchParams) {
			processSearchParams();
		}
	}, [searchParams]);

	// Fetch loan applications
	const {
		data: applications,
		isLoading: applicationsLoading,
		pagination: applicationsPagination,
		refresh: refreshApplications,
	} = useFetchData<LoanApplication>({
		table: "loan_applications",
		page: activeTab === "applications" ? page : 1,
		limit: 5,
		searchQuery: activeTab === "applications" ? searchQuery : "",
		searchColumn: ["purpose_loan"],
		where: [{ column: "app_status", operator: "eq", value: "pending" }],
	});

	// Fetch active loans
	const {
		data: activeLoans,
		isLoading: loansLoading,
		pagination: loansPagination,
		refresh: refreshLoans,
	} = useFetchData<LoanDetail>({
		table: "loan_details",
		page: activeTab === "active" ? page : 1,
		limit: 5,
		searchQuery: activeTab === "active" ? searchQuery : "",
		searchColumn: ["loan_status"],
		where: [{ column: "loan_status", operator: "eq", value: "active" }],
	});

	const debouncedSetSearchQuery = useRef(
		debounce((value: string) => setSearchQuery(value), 500)
	).current;

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSetSearchQuery(event.target.value);
	};

	const handlePageChange = (newPage: number) => {
		const pagination =
			activeTab === "applications"
				? applicationsPagination
				: loansPagination;
		if (newPage >= 1 && newPage <= pagination.lastPage) {
			setPage(newPage);
		}
	};

	const handleTabChange = (tab: "applications" | "active") => {
		setActiveTab(tab);
		setPage(1); // Reset to first page when switching tabs
		setSearchQuery(""); // Clear search when switching tabs
	};

	const handleRefresh = () => {
		refreshApplications();
		refreshLoans();
	};

	return (
		<>
			<h1 className="mb-4">Loan Management</h1>
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href={admin.home}>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Loans</BreadcrumbPage>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>
							{activeTab === "applications"
								? "Pending Applications"
								: "Active Loans"}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Alert Messages */}
			{alertMessage && (
				<div className="mb-4">
					<Alert
						type={alertMessage.type}
						message={alertMessage.message}
					/>
				</div>
			)}

			{/* Tab Navigation */}
			<div className="mb-4 border-b">
				<nav className="-mb-px flex space-x-8">
					<button
						onClick={() => handleTabChange("applications")}
						className={`py-2 px-1 border-b-2 font-medium text-sm ${
							activeTab === "applications"
								? "border-red-500 text-red-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						}`}
					>
						Pending Applications
						{applications && (
							<span className="ml-2 bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs">
								{applications.length}
							</span>
						)}
					</button>
					<button
						onClick={() => handleTabChange("active")}
						className={`py-2 px-1 border-b-2 font-medium text-sm ${
							activeTab === "active"
								? "border-red-500 text-red-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						}`}
					>
						Active Loans
						{activeLoans && (
							<span className="ml-2 bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
								{activeLoans.length}
							</span>
						)}
					</button>
				</nav>
			</div>

			<Search onChange={handleSearch} />

			{/* Applications Table */}
			{activeTab === "applications" && (
				<Table>
					<TableCaption>
						Pending loan applications requiring approval
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Applicant</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Loan Type</TableHead>
							<TableHead>Amount Requested</TableHead>
							<TableHead>Purpose</TableHead>
							<TableHead>Applied Date</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{applicationsLoading ? (
							<TableRow>
								<TableCell colSpan={7}>Loading...</TableCell>
							</TableRow>
						) : applications?.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center">
									No pending applications found
								</TableCell>
							</TableRow>
						) : (
							applications?.map(
								(application: LoanApplication) => (
									<LoanApplicationRow
										key={application.app_id}
										application={application}
										onActionComplete={handleRefresh}
									/>
								)
							)
						)}
					</TableBody>
				</Table>
			)}

			{/* Active Loans Table */}
			{activeTab === "active" && (
				<Table>
					<TableCaption>
						Active loans requiring payment management
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Borrower</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Loan Type</TableHead>
							<TableHead>Principal Amount</TableHead>
							<TableHead>Remaining Balance</TableHead>
							<TableHead>Monthly Payment</TableHead>
							<TableHead>Next Payment</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loansLoading ? (
							<TableRow>
								<TableCell colSpan={9}>Loading...</TableCell>
							</TableRow>
						) : activeLoans?.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9} className="text-center">
									No active loans found
								</TableCell>
							</TableRow>
						) : (
							activeLoans?.map((loan: LoanDetail) => (
								<LoanDetailRow
									key={loan.id}
									loan={loan}
									onActionComplete={handleRefresh}
								/>
							))
						)}
					</TableBody>
				</Table>
			)}

			{/* Pagination */}
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() =>
								handlePageChange(
									(activeTab === "applications"
										? applicationsPagination
										: loansPagination
									).page - 1
								)
							}
							aria-disabled={
								(activeTab === "applications"
									? applicationsPagination
									: loansPagination
								).page === 1
							}
							className={
								(activeTab === "applications"
									? applicationsPagination
									: loansPagination
								).page === 1
									? "pointer-events-none opacity-50"
									: ""
							}
						/>
					</PaginationItem>
					{Array.from(
						{
							length: (activeTab === "applications"
								? applicationsPagination
								: loansPagination
							).lastPage,
						},
						(_, index) => (
							<PaginationItem key={index + 1}>
								<PaginationLink
									isActive={
										(activeTab === "applications"
											? applicationsPagination
											: loansPagination
										).page ===
										index + 1
									}
									onClick={() => handlePageChange(index + 1)}
								>
									{index + 1}
								</PaginationLink>
							</PaginationItem>
						)
					)}
					<PaginationItem>
						<PaginationNext
							onClick={() =>
								handlePageChange(
									(activeTab === "applications"
										? applicationsPagination
										: loansPagination
									).page + 1
								)
							}
							aria-disabled={
								(activeTab === "applications"
									? applicationsPagination
									: loansPagination
								).page ===
								(activeTab === "applications"
									? applicationsPagination
									: loansPagination
								).lastPage
							}
							className={
								(activeTab === "applications"
									? applicationsPagination
									: loansPagination
								).page ===
								(activeTab === "applications"
									? applicationsPagination
									: loansPagination
								).lastPage
									? "pointer-events-none opacity-50"
									: ""
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</>
	);
}
