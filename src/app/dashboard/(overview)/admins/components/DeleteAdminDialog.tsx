import Button from "@/src/components/Button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/src/components/shadcn/dialog";

export default function DeleteAdminDialog({
	onDelete,
	adminEmail,
	userId,
}: {
	onDelete: (userId: string) => Promise<void>;
	adminEmail: string;
	userId: string;
}) {
	return (
		<>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						Do you really want to delete this admin ({adminEmail})?
						This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex gap-2">
					<DialogClose asChild>
						<Button>Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={() => onDelete(userId)}>Delete</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</>
	);
}
