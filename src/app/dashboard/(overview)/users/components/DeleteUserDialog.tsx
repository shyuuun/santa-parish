import Button from "@/src/components/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/shadcn/dialog";

export default function DeleteUserDialog({
	onDelete,
	email,
	userId,
}: {
	onDelete: (userId: string) => Promise<void>;
	email: string;
	userId: string;
}) {
	return (
		<Dialog>
			<DialogTrigger className="btn">Delete</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						Do you really want to delete this user({email})? This
						action cannot be undone.
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
		</Dialog>
	);
}
