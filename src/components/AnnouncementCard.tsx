import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { AnnouncementCardProps } from "@/src/utils/types";
import DeleteAnnouncementDialog from "@/src/app/dashboard/(overview)/announcements/components/DeleteAnnouncementDialog";

export default function AnnouncementCard({
	announcement,
	isAdmin = false,
	onRefresh,
}: AnnouncementCardProps) {
	// Format the date string
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const cardContent = (
		<article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
			<div className="relative">
				{announcement.image_url ? (
					<Image
						src={announcement.image_url}
						alt={announcement.title}
						width={800}
						height={400}
						className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-105"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				) : (
					<div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
						<span className="text-gray-400">
							No image available
						</span>
					</div>
				)}
			</div>

			<div className="p-6">
				<div className="flex items-center justify-between mb-3">
					<div className="text-sm text-gray-500">
						{formatDate(announcement.created_at)}
					</div>
					{announcement.tag && (
						<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
							{announcement.tag}
						</span>
					)}
				</div>

				<h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900">
					{announcement.title}
				</h2>

				<div
					className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed"
					dangerouslySetInnerHTML={{
						__html: announcement.content.substring(0, 150) + "...",
					}}
				/>

				{isAdmin ? (
					<div className="pt-3 border-t border-gray-100 flex justify-between items-center">
						<span className="text-blue-600 text-sm font-medium">
							Click to view
						</span>
						<div
							className="flex gap-2"
							onClick={(e) => e.stopPropagation()}
						>
							<Link
								href={
									isAdmin
										? `/dashboard/announcements/${announcement.id}`
										: `/announcements/${announcement.id}`
								}
								className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
								title="View announcement"
							>
								<Eye className="w-4 h-4" />
							</Link>
							{onRefresh && (
								<DeleteAnnouncementDialog
									announcementId={announcement.id}
									announcementTitle={announcement.title}
									onDeleted={onRefresh}
								/>
							)}
						</div>
					</div>
				) : (
					<div className="pt-3 border-t border-gray-100">
						<span className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
							Read full announcement →
						</span>
					</div>
				)}
			</div>
		</article>
	);

	return isAdmin ? (
		<div>{cardContent}</div>
	) : (
		<Link href={`/announcements/${announcement.id}`} className="group">
			{cardContent}
		</Link>
	);
}
