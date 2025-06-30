import { createClient } from "@/src/utils/supabase/server";
import PostViewer from "@/src/components/PostViewer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface AnnouncementPageProps {
	params: {
		id: string;
	};
}

export const metadata: Metadata = {
	title: "Announcement | Santa Lucia Parish Multipurpose Cooperative",
	description:
		"View the full announcement from Santa Lucia Parish Multipurpose Cooperative",
};

export default async function AnnouncementPage({
	params,
}: AnnouncementPageProps) {
	const supabase = await createClient();

	const { data: announcement } = await supabase
		.from("announcements")
		.select("*")
		.eq("id", params.id)
		.single();

	if (!announcement) {
		notFound();
	}

	return (
		<main className="container mx-auto py-8 px-4">
			<div className="mb-6">
				<Link
					href="/"
					scroll={true}
					className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Announcements
				</Link>
			</div>
			<PostViewer post={announcement} />
		</main>
	);
}
