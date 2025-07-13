import { createClient } from "@/src/utils/supabase/cilent";

export async function uploadImageClient(
	file: File
): Promise<{
	type: string;
	msg: string;
	data?: { url: string; path: string };
}> {
	try {
		const supabase = createClient();

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return {
				type: "error",
				msg: "Please upload only image files",
			};
		}

		// Generate unique filename
		const fileExt = file.name.split(".").pop();
		const fileName = `${Date.now()}-${Math.random()
			.toString(36)
			.substring(2)}.${fileExt}`;

		console.log("Client-side upload:", {
			fileName,
			fileSize: file.size,
			fileType: file.type,
		});

		// Upload to Supabase Storage
		const { data, error } = await supabase.storage
			.from("announcements")
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (error) {
			console.error("Client upload error:", error);
			return {
				type: "error",
				msg: `Upload failed: ${error.message}`,
			};
		}

		// Get public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from("announcements").getPublicUrl(data.path);

		return {
			type: "success",
			msg: "Image uploaded successfully!",
			data: {
				url: publicUrl,
				path: data.path,
			},
		};
	} catch (error) {
		console.error("Client upload error:", error);
		return {
			type: "error",
			msg: `Upload error: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		};
	}
}
