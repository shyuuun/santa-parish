"use client";
import { useState } from "react";
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

import { admin } from "@/src/utils/route";
import { useFetchData } from "../hooks/useFetchData";
import AddAnnouncementDialog from "./components/AddAnnouncementDialog";
import { Announcement } from "@/src/utils/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Announcements() {
	const [page, setPage] = useState(1);
	const router = useRouter();

	const {
		data: announcements,
		pagination,
		isLoading,
		refresh,
	} = useFetchData<Announcement>({
		table: "announcements",
		page,
		limit: 3,
	});

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.lastPage) {
			setPage(newPage);
		}
	};

	return (
		<>
			<h1 className="mb-4">Announcements</h1>
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href={admin.home}>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Announcements</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex justify-end mb-4">
				<AddAnnouncementDialog onAnnouncementAdded={refresh} />
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center min-h-[200px]">
					Loading...
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
						{announcements?.map((announcement) => (
							<article
								key={announcement.id}
								onClick={() =>
									router.push(
										`/announcements/${announcement.id}`
									)
								}
								className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
							>
								{announcement.image_url && (
									<div className="relative h-48 w-full">
										<Image
											src={announcement.image_url}
											alt={announcement.title}
											width={800}
											height={400}
											className="object-cover"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										/>
									</div>
								)}
								<div className="p-4">
									<h3 className="text-lg font-semibold mb-2 line-clamp-2">
										{announcement.title}
									</h3>
									<div
										className="text-gray-600 mb-4 line-clamp-3"
										dangerouslySetInnerHTML={{
											__html:
												announcement.content.substring(
													0,
													150
												) + "...",
										}}
									/>
									<div className="text-sm text-gray-500">
										{new Date(
											announcement.created_at
										).toLocaleDateString()}
									</div>
								</div>
							</article>
						))}
					</div>

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
							{Array.from(
								{ length: pagination.lastPage },
								(_, index) => (
									<PaginationItem key={index + 1}>
										<PaginationLink
											isActive={
												pagination.page === index + 1
											}
											onClick={() =>
												handlePageChange(index + 1)
											}
										>
											{index + 1}
										</PaginationLink>
									</PaginationItem>
								)
							)}
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
			)}
		</>
	);
}
