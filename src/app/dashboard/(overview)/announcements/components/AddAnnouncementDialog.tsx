import {
	Dialog,
	DialogHeader,
	DialogTrigger,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogFooter,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { createAnnouncement, uploadAnnouncementImage } from "../actions";
import { uploadImageClient } from "./uploadClient";

import Editor from "react-simple-wysiwyg";

export default function AddAnnouncementDialog({
	onAnnouncementAdded,
}: {
	onAnnouncementAdded?: () => void;
}) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tag, setTag] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSave = async () => {
		if (!title.trim() || !content.trim()) {
			toast.error("Please fill in all required fields");
			return;
		}

		setIsSaving(true);

		try {
			let imageUrl = null;

			// Upload image if provided
			if (imageFile) {
				console.log("Starting image upload...");
				setIsUploading(true);

				// Try client-side upload first
				const clientUploadResult = await uploadImageClient(imageFile);
				setIsUploading(false);

				console.log("Client upload result:", clientUploadResult);

				if (clientUploadResult.type === "error") {
					// Fallback to server-side upload
					console.log(
						"Client upload failed, trying server upload..."
					);
					setIsUploading(true);
					const formData = new FormData();
					formData.append("file", imageFile);

					const uploadResult = await uploadAnnouncementImage(
						formData
					);
					setIsUploading(false);

					console.log("Server upload result:", uploadResult);

					if (uploadResult.type === "error") {
						toast.error(`Upload failed: ${uploadResult.msg}`);
						setIsSaving(false);
						return;
					}

					imageUrl = uploadResult.data?.url;
				} else {
					imageUrl = clientUploadResult.data?.url;
				}

				console.log("Final image URL:", imageUrl);
			}

			// Create announcement
			console.log("Creating announcement...");
			const result = await createAnnouncement({
				title: title.trim(),
				content: content.trim(),
				tag: tag.trim() || undefined,
				image_url: imageUrl || undefined,
			});

			console.log("Creation result:", result);

			if (result.type === "success") {
				toast.success(result.msg);
				handleCancel();
				onAnnouncementAdded?.();
			} else {
				toast.error(result.msg);
			}
		} catch (error) {
			console.error("Error saving announcement:", error);
			toast.error(
				`An unexpected error occurred: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setTitle("");
		setContent("");
		setTag("");
		setImageFile(null);
		setImagePreview(null);
		setIsOpen(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Add Announcement</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Announcement</DialogTitle>
					<DialogDescription>
						Enter the details for the new announcement.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium mb-2"
						>
							Title *
						</label>
						<input
							id="title"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter announcement title"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="tag"
							className="block text-sm font-medium mb-2"
						>
							Tag (Optional)
						</label>
						<input
							id="tag"
							type="text"
							value={tag}
							onChange={(e) => setTag(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter tag (e.g., Important, Update, Event)"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Image (Optional)
						</label>
						<div className="space-y-3">
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							{imagePreview && (
								<div className="relative">
									<Image
										src={imagePreview}
										alt="Preview"
										width={300}
										height={200}
										className="object-cover rounded-lg"
									/>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={handleRemoveImage}
										className="absolute top-2 right-2"
									>
										Remove
									</Button>
								</div>
							)}
						</div>
					</div>

					<div>
						<label
							htmlFor="content"
							className="block text-sm font-medium mb-2"
						>
							Content *
						</label>
						<Editor
							value={content}
							onChange={(e) => setContent(e.target.value)}
							containerProps={{
								style: {
									minHeight: "200px",
									border: "1px solid #d1d5db",
									borderRadius: "6px",
								},
							}}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={handleCancel}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving || isUploading}
					>
						{isSaving
							? "Saving..."
							: isUploading
							? "Uploading..."
							: "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
