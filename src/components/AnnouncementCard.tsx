import Image from "next/image";
import Link from "next/link";

export type Announcement = {
	id: number;
	title: string;
	tag?: string;
	content: string;
	image_url?: string;
	created_at: string;
};

interface AnnouncementCardProps {
	announcement: Announcement;
}

export default function AnnouncementCard({
	announcement,
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

	return (
		<Link href={`/announcements/${announcement.id}`}>
			<article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
				<div className="relative">
					{announcement.image_url ? (
						<Image
							src={announcement.image_url}
							alt={announcement.title}
							width={800}
							height={400}
							className="w-full h-[200px] object-cover"
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
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold line-clamp-2">
							{announcement.title}
						</h2>
						{announcement.tag && (
							<span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm whitespace-nowrap ml-2">
								{announcement.tag}
							</span>
						)}
					</div>

					<div className="text-sm text-gray-500 flex justify-between items-center">
						<span>
							Posted on {formatDate(announcement.created_at)}
						</span>
						<span className="text-red-600 hover:text-red-700">
							Read
						</span>
					</div>
				</div>
			</article>
		</Link>
	);
}
