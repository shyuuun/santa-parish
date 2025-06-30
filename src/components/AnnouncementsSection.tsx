"use client";
import { useState } from "react";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/src/components/shadcn/dialog";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/src/components/shadcn/pagination";
import { createClient } from "@/src/utils/supabase/cilent";
import PostViewer from "./PostViewer";

type Announcement = {
	id: number;
	title: string;
	content: string;
	created_at: string;
	image_url?: string;
};

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
	const [selectedAnnouncement, setSelectedAnnouncement] =
		useState<Announcement | null>(null);
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
							<article
								key={announcement.id}
								onClick={() =>
									setSelectedAnnouncement(announcement)
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

			<Dialog
				open={!!selectedAnnouncement}
				onOpenChange={() => setSelectedAnnouncement(null)}
			>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
					</DialogHeader>
					{selectedAnnouncement && (
						<PostViewer post={selectedAnnouncement} />
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
