import { createClient } from "@/src/utils/supabase/server";
import { notFound } from "next/navigation";
import AnnouncementView from "@/src/components/AnnouncementView";

interface AdminAnnouncementPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function AdminAnnouncementPage({
	params,
}: AdminAnnouncementPageProps) {
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
		<AnnouncementView
			announcement={announcement}
			isAdmin={true}
			backUrl="/dashboard/announcements"
			backLabel="Back to Dashboard"
		/>
	);
}
