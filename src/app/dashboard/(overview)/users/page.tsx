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
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/src/components/shadcn/pagination";
import Search from "../admins/components/Search";
import { useFetchData } from "../hooks/useFetchData";
import { useState } from "react";
import { Users } from "@/src/utils/types";
import Badge from "@/src/components/Badge";

export default function UserPage() {
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const { data, isLoading } = useFetchData<Users>({
		table: "users_complete_profiles",
		page,
		limit: 5,
		searchQuery: searchQuery,
		searchColumn: ["email", "name"],
		where: [{ column: "is_deleted", operator: "eq", value: false }],
	});

	console.log(data);
	return (
		<>
			<h1 className="mb-4">Users</h1>
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Users</BreadcrumbPage>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>All Users</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Search onChange={() => {}} />

			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Gender</TableHead>
						<TableHead>Birthdate</TableHead>
						<TableHead>Account Status</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={6}>Loading...</TableCell>
						</TableRow>
					) : (
						data?.map((user: Users) => (
							<TableRow key={user.user_id}>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.gender}</TableCell>
								<TableCell>{user.birthdate}</TableCell>
								{user.role === "verified_user" ? (
									<TableCell>
										<Badge>Verified</Badge>
									</TableCell>
								) : (
									<TableCell>
										<Badge variant="warning">
											Unverified
										</Badge>
									</TableCell>
								)}
								<TableCell className="text-center">
									{/* Add action buttons here */}

									<button className="btn">View</button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" isActive>
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">3</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</>
	);
}
