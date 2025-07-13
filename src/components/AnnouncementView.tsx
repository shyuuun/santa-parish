"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import PostViewer from "@/src/components/PostViewer";
import { AnnouncementViewProps } from "@/src/utils/types";

export default function AnnouncementView({
	announcement,
	isAdmin = false,
	backUrl = "/announcements",
	backLabel = "Back to Announcements",
}: AnnouncementViewProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header with back navigation */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-4xl mx-auto px-6 py-4">
					<Link
						href={backUrl}
						className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						{backLabel}
					</Link>
				</div>
			</div>

			{/* Main content */}
			<div className="max-w-4xl mx-auto px-6 py-8">
				<article className="bg-white rounded-lg shadow-lg overflow-hidden">
					{/* Featured image */}
					{announcement.image_url && (
						<div className="relative w-full h-[400px] bg-gray-200">
							<Image
								src={announcement.image_url}
								alt={announcement.title}
								fill
								className="object-cover"
								priority
							/>
						</div>
					)}

					{/* Article content */}
					<div className="p-8">
						{/* Tag and date */}
						<div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								<time dateTime={announcement.created_at}>
									{formatDate(announcement.created_at)}
								</time>
							</div>
							{announcement.tag && (
								<div className="flex items-center gap-2">
									<Tag className="w-4 h-4" />
									<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
										{announcement.tag}
									</span>
								</div>
							)}
						</div>

						{/* Title */}
						<h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
							{announcement.title}
						</h1>

						{/* Admin badge */}
						{isAdmin && (
							<div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
								<span className="text-yellow-800 text-sm font-medium">
									👑 Admin View - You can manage this
									announcement from the dashboard
								</span>
							</div>
						)}

						{/* Content */}
						<div className="prose prose-lg max-w-none">
							<PostViewer post={announcement} />
						</div>
					</div>
				</article>

				{/* Footer */}
				<div className="mt-8 text-center">
					<Link
						href={backUrl}
						className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						{isAdmin
							? "Back to Dashboard"
							: "View All Announcements"}
					</Link>
				</div>
			</div>
		</div>
	);
}
