"use client";

import {
	Table,
	TableBody,
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

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/shadcn/dialog";

import Search from "./components/Search";
import { useFetchData } from "../hooks/useFetchData";
import { useActionState, useRef, useState } from "react";
import { ActionStatus, Admins } from "@/src/utils/types";
import { debounce } from "@/src/utils/functions";
import Button from "@/src/components/Button";
import AddAdminDialog from "./components/AddAdminDialog";
import { createAdminUser } from "./actions";

export default function AdminSection() {
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const { data, pagination, isLoading, refresh } = useFetchData<Admins>({
		table: "admins",
		page,
		limit: 5,
		searchQuery: searchQuery,
		searchColumn: ["email"],
	});

	async function action<ActionStatus>(
		state: ActionStatus,
		formData?: FormData
	) {
		if (!formData) return state; // Ensure formData is present

		const res = await createAdminUser(formData);

		if (res.type === "success") {
			refresh(); // 🔁 refetch after adding admin
		}
		return res;
	}

	const [formState, formAction] = useActionState<ActionStatus>(action, {
		type: "",
		msg: "",
	});

	console.log("Admin Data:", data);

	console.log("formState:", formState);

	// WRONG: creates a new debounce function on every render
	// const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	debounce(() => {
	// 		setSearchQuery(event.target.value);
	// 	}, 500);
	// };

	// INSTEAD
	// Create the debounced function once
	const debouncedSetSearchQuery = useRef(
		debounce((value: string) => setSearchQuery(value), 500)
	).current;

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSetSearchQuery(event.target.value);
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.lastPage) {
			setPage(newPage);
		}
	};

	return (
		<>
			<h1 className="mb-4">Admin</h1>
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
						<BreadcrumbPage>Admin</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<Search onChange={handleSearch} />

			<div className="flex justify-end mb-4">
				<Dialog>
					<DialogTrigger className="btn">Add Admin</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Admin</DialogTitle>
							<DialogDescription>
								Enter the details for the new admin.
							</DialogDescription>
						</DialogHeader>
						<AddAdminDialog formAction={formAction} />
					</DialogContent>
				</Dialog>
			</div>

			<Table className="mb-4">
				{/* <TableCaption>A list of your recent invoices.</TableCaption> */}
				<TableHeader>
					<TableRow>
						<TableHead>UUID</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Created at</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={3} className="text-center">
								Loading...
							</TableCell>
						</TableRow>
					) : (
						data?.map((admin: Admins) => (
							<TableRow key={admin.user_id}>
								<TableCell className="font-medium">
									{admin.user_id}
								</TableCell>
								<TableCell>{admin.email}</TableCell>
								<TableCell>
									{admin.created_at
										? new Date(
												admin.created_at
										  ).toLocaleString()
										: "N/A"}
								</TableCell>
								<TableCell>
									<Button>Delete</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() =>
								handlePageChange(pagination.page - 1)
							}
							aria-disabled={pagination.page === 1}
							className={
								pagination.page === 1
									? "pointer-events-none opacity-50"
									: ""
							}
						/>
					</PaginationItem>
					{Array.from({ length: pagination.lastPage }, (_, index) => (
						<PaginationItem key={index + 1}>
							<PaginationLink
								isActive={pagination.page === index + 1}
								onClick={() => handlePageChange(index + 1)}
							>
								{index + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							onClick={() =>
								handlePageChange(pagination.page + 1)
							}
							aria-disabled={
								pagination.page === pagination.lastPage
							}
							className={
								pagination.page === pagination.lastPage
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
