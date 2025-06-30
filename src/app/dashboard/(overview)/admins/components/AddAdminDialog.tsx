"use client";

import Button from "@/src/components/Button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";

export default function AddAdminDialog({
	formAction,
}: {
	formAction: () => void;
}) {
	return (
		<>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Admin</DialogTitle>
					<DialogDescription>
						Enter the details for the new admin.
					</DialogDescription>
				</DialogHeader>
				<form className="space-y-4" action={formAction}>
					<div>
						<Label>Email</Label>
						<Input
							type="email"
							name="email"
							className="w-full border rounded px-3 py-2"
							placeholder="admin@email.com"
						/>
					</div>
					<div>
						<Label>Password</Label>
						<Input
							type="password"
							name="password"
							className="w-full border rounded px-3 py-2"
							placeholder="Password"
						/>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button">Close</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button type="submit">Add</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</>
	);
}
