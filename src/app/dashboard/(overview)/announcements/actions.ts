"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateAnnouncementData {
	title: string;
	content: string;
	image_url?: string;
	tag?: string;
}

export async function createAnnouncement(data: CreateAnnouncementData) {
	try {
		const supabase = await createClient();

		const { data: announcement, error } = await supabase
			.from("announcements")
			.insert({
				title: data.title,
				content: data.content,
				image_url: data.image_url,
				tag: data.tag,
			})
			.select()
			.single();

		if (error) {
			console.error("Error creating announcement:", error);
			return {
				type: "error",
				msg: "Failed to create announcement. Please try again.",
			};
		}

		revalidatePath("/dashboard/announcements");
		revalidatePath("/announcements");

		return {
			type: "success",
			msg: "Announcement created successfully!",
			data: announcement,
		};
	} catch (error) {
		console.error("Unexpected error creating announcement:", error);
		return {
			type: "error",
			msg: "An unexpected error occurred. Please try again.",
		};
	}
}

export async function uploadAnnouncementImage(formData: FormData) {
	try {
		const supabase = await createClient();
		const file = formData.get("file") as File;

		console.log("Upload attempt:", {
			hasFile: !!file,
			fileName: file?.name,
			fileSize: file?.size,
			fileType: file?.type,
		});

		if (!file) {
			return {
				type: "error",
				msg: "No file provided",
			};
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return {
				type: "error",
				msg: "Please upload only image files",
			};
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return {
				type: "error",
				msg: "File size must be less than 5MB",
			};
		}

		// Generate unique filename
		const fileExt = file.name.split(".").pop();
		const fileName = `${Date.now()}-${Math.random()
			.toString(36)
			.substring(2)}.${fileExt}`;

		console.log("Uploading file:", fileName);

		// Upload to Supabase Storage
		const { data, error } = await supabase.storage
			.from("announcements")
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (error) {
			console.error("Supabase storage error:", error);
			return {
				type: "error",
				msg: `Upload failed: ${error.message}`,
			};
		}

		console.log("Upload successful:", data);

		// Get public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from("announcements").getPublicUrl(data.path);

		console.log("Public URL:", publicUrl);

		return {
			type: "success",
			msg: "Image uploaded successfully!",
			data: {
				url: publicUrl,
				path: data.path,
			},
		};
	} catch (error) {
		console.error("Unexpected error uploading image:", error);
		return {
			type: "error",
			msg: `Upload error: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		};
	}
}

export async function deleteAnnouncement(id: number) {
	try {
		const supabase = await createClient();

		// First, get the announcement to check if it has an image
		const { data: announcement } = await supabase
			.from("announcements")
			.select("image_url")
			.eq("id", id)
			.single();

		// Delete the announcement
		const { error } = await supabase
			.from("announcements")
			.delete()
			.eq("id", id);

		if (error) {
			console.error("Error deleting announcement:", error);
			return {
				type: "error",
				msg: "Failed to delete announcement. Please try again.",
			};
		}

		// Delete associated image if exists
		if (announcement?.image_url) {
			const imagePath = announcement.image_url.split("/").pop();
			if (imagePath) {
				await supabase.storage
					.from("announcements")
					.remove([imagePath]);
			}
		}

		revalidatePath("/dashboard/announcements");
		revalidatePath("/announcements");

		return {
			type: "success",
			msg: "Announcement deleted successfully!",
		};
	} catch (error) {
		console.error("Unexpected error deleting announcement:", error);
		return {
			type: "error",
			msg: "An unexpected error occurred. Please try again.",
		};
	}
}
