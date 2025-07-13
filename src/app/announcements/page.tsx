import { createClient } from "@/src/utils/supabase/server";
import Link from "next/link";
import AnnouncementCard from "@/src/components/AnnouncementCard";

export default async function PublicAnnouncementsPage() {
	const supabase = await createClient();

	// Fetch announcements
	const { data: announcements, error } = await supabase
		.from("announcements")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(10);

	if (error) {
		console.error("Error fetching announcements:", error);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-6xl mx-auto px-6 py-8">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Announcements
						</h1>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Stay updated with the latest news and announcements
							from Santa Lucia Parish Multipurpose Cooperative
						</p>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="max-w-6xl mx-auto px-6 py-8">
				{!announcements || announcements.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<svg
								className="w-16 h-16 mx-auto"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No announcements yet
						</h3>
						<p className="text-gray-600">
							Check back later for the latest updates and news.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{announcements.map((announcement) => (
							<AnnouncementCard
								key={announcement.id}
								announcement={announcement}
								isAdmin={false}
							/>
						))}
					</div>
				)}

				{/* Back to home */}
				<div className="mt-12 text-center">
					<Link
						href="/"
						className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
