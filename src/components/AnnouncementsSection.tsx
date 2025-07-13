"use client";
import { useState } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/src/components/shadcn/pagination";
import { createClient } from "@/src/utils/supabase/cilent";
import AnnouncementCard from "@/src/components/AnnouncementCard";
import { Announcement } from "@/src/utils/types";

interface AnnouncementsSectionProps {
	initialAnnouncements: Announcement[];
	totalCount: number;
}

export default function AnnouncementsSection({
	initialAnnouncements,
	totalCount,
}: AnnouncementsSectionProps) {
	const [announcements, setAnnouncements] = useState(initialAnnouncements);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const itemsPerPage = 3;
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const fetchAnnouncements = async (pageNumber: number) => {
		setIsLoading(true);
		const supabase = createClient();
		const start = (pageNumber - 1) * itemsPerPage;
		const end = start + itemsPerPage - 1;

		const { data } = await supabase
			.from("announcements")
			.select("*")
			.order("created_at", { ascending: false })
			.range(start, end);

		if (data) {
			setAnnouncements(data);
		}
		setIsLoading(false);
	};

	const handlePageChange = async (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
			await fetchAnnouncements(newPage);
		}
	};

	return (
		<>
			{isLoading ? (
				<div className="flex justify-center items-center min-h-[200px]">
					Loading...
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
						{announcements.map((announcement) => (
							<AnnouncementCard
								key={announcement.id}
								announcement={announcement}
								isAdmin={false}
							/>
						))}
					</div>

					{totalPages > 1 && (
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											handlePageChange(page - 1)
										}
										aria-disabled={page === 1}
										className={
											page === 1
												? "pointer-events-none opacity-50"
												: ""
										}
									/>
								</PaginationItem>
								{Array.from(
									{ length: totalPages },
									(_, index) => (
										<PaginationItem key={index + 1}>
											<PaginationLink
												isActive={page === index + 1}
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
											handlePageChange(page + 1)
										}
										aria-disabled={page === totalPages}
										className={
											page === totalPages
												? "pointer-events-none opacity-50"
												: ""
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}
		</>
	);
}
