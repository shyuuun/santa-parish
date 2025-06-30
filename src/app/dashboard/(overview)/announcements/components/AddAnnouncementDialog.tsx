import {
	Dialog,
	DialogHeader,
	DialogTrigger,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/src/components/shadcn/dialog";

import Editor from "react-simple-wysiwyg";

export default function AddAnnouncementDialog({}) {
	return (
		<Dialog>
			<DialogTrigger className="btn">Add Announcement</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Announcement</DialogTitle>
					<DialogDescription>
						Enter the details for the new announcement.
					</DialogDescription>
				</DialogHeader>
				<Editor />
			</DialogContent>
		</Dialog>
	);
}
