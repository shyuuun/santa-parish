import { createClient } from "@/src/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import PostViewer from "@/src/components/PostViewer";

interface AnnouncementPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function AnnouncementPage({
	params,
}: AnnouncementPageProps) {
	// Await the params
	const { id } = await params;

	// Create Supabase client
	const supabase = await createClient();

	// Fetch the announcement data
	const { data: announcement } = await supabase
		.from("announcements")
		.select("*")
		.eq("id", id)
		.single();

	if (!announcement) {
		notFound();
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4">{announcement.title}</h1>
			<div className="text-gray-600 mb-4">
				{new Date(announcement.created_at).toLocaleDateString()}
			</div>
			{announcement.image_url && (
				<div className="relative w-full h-[400px] mb-6">
					<Image
						src={announcement.image_url}
						alt={announcement.title}
						fill
						className="object-cover rounded-lg"
					/>
				</div>
			)}
			<PostViewer post={announcement} />
		</div>
	);
}
