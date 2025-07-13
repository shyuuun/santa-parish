"use client";
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
import { useState } from "react";
import { toast } from "sonner";
import { deleteAnnouncement } from "../actions";
import { Trash2 } from "lucide-react";

interface DeleteAnnouncementDialogProps {
	announcementId: number;
	announcementTitle: string;
	onDeleted?: () => void;
}

export default function DeleteAnnouncementDialog({
	announcementId,
	announcementTitle,
	onDeleted,
}: DeleteAnnouncementDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);

		try {
			const result = await deleteAnnouncement(announcementId);

			if (result.type === "success") {
				toast.success(result.msg);
				setIsOpen(false);
				onDeleted?.();
			} else {
				toast.error(result.msg);
			}
		} catch (error) {
			console.error("Error deleting announcement:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="sm">
					<Trash2 className="w-4 h-4 mr-1" />
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Announcement</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this announcement? This
						action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<p className="text-sm text-gray-600">
						<span className="font-medium">Title:</span>{" "}
						{announcementTitle}
					</p>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsOpen(false)}
						disabled={isDeleting}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
