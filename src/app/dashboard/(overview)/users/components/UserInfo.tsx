"use client";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/src/components/shadcn/sheet";
import Button from "@/src/components/Button";
import { UserAdditionalInfo, Users } from "@/src/utils/types";
import Badge from "@/src/components/Badge";
import { createClient } from "@/src/utils/supabase/cilent";
import { useState } from "react";

interface UserInfoProps {
	user: Users;
	onApprove?: (userId: string) => Promise<void>;
}

export default function UserInfo({ user, onApprove }: UserInfoProps) {
	const isUnverified = user.role === "unverified_user";

	const supabase = createClient();
	const [additionalInfo, setAdditionalInfo] =
		useState<UserAdditionalInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchUserInfo = async () => {
		if (!user.user_id) return;
		setIsLoading(true);
		const { data, error } = await supabase
			.from("user_add_info")
			.select("*")
			.eq("uuid", user.user_id)
			.single();

		if (error) {
			console.error("Error fetching additional user info:", error);
		}
		if (data) {
			setAdditionalInfo(data);
		}
		setIsLoading(false);
	};

	return (
		<Sheet
			onOpenChange={(open) => {
				if (open) {
					fetchUserInfo();
				}
			}}
		>
			<SheetTrigger asChild>
				<Button>View Info</Button>
			</SheetTrigger>
			<SheetContent className="sm:max-w-md">
				<SheetHeader>
					<SheetTitle>User Information</SheetTitle>
					<SheetDescription>Details for {user.name}</SheetDescription>
				</SheetHeader>

				<div className="p-4 space-y-4">
					<div className="flex flex-col space-y-2 items-start">
						<h4 className="text-sm font-medium">Status</h4>
						<Badge variant={isUnverified ? "warning" : "success"}>
							{isUnverified ? "Unverified" : "Verified"}
						</Badge>
					</div>

					<div className="flex flex-col space-y-2">
						<h4 className="text-sm font-medium">Email</h4>
						<p className="text-sm">{user.email}</p>
					</div>

					<div className="flex flex-col space-y-2">
						<h4 className="text-sm font-medium">Gender</h4>
						<p className="text-sm capitalize">{user.gender}</p>
					</div>

					<div className="flex flex-col space-y-2">
						<h4 className="text-sm font-medium">Birthdate</h4>
						<p className="text-sm">{user.birthdate}</p>
					</div>

					<div className="flex flex-col space-y-2">
						<h4 className="text-sm font-medium">Member Since</h4>
						<p className="text-sm">
							{new Date(user.created_at!).toLocaleString()}
						</p>
					</div>
				</div>

				{/* Additional User Info Section */}
				<div className="border-t p-4">
					<h3 className="text-lg font-medium mb-4">
						Additional Information
					</h3>
					{isLoading ? (
						<div className="flex justify-center items-center py-4">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
						</div>
					) : additionalInfo ? (
						<div className="space-y-4">
							<div className="flex flex-col space-y-2">
								<h4 className="text-sm font-medium">
									Work Address
								</h4>
								<p className="text-sm">
									{additionalInfo.work_address || "N/A"}
								</p>
							</div>
							<div className="flex flex-col space-y-2">
								<h4 className="text-sm font-medium">
									Employment Type
								</h4>
								<p className="text-sm capitalize">
									{additionalInfo.employment_type || "N/A"}
								</p>
							</div>
							<div className="flex flex-col space-y-2">
								<h4 className="text-sm font-medium">
									Job Title
								</h4>
								<p className="text-sm">
									{additionalInfo.job_title || "N/A"}
								</p>
							</div>
						</div>
					) : (
						<div>
							<p>No data found</p>
						</div>
					)}
				</div>

				<SheetFooter>
					<div className="flex gap-2">
						<SheetClose asChild>
							<Button>Close</Button>
						</SheetClose>
						{isUnverified && user.user_id && (
							<SheetClose asChild>
								<Button
									onClick={() => onApprove!(user.user_id!)}
								>
									Approve User
								</Button>
							</SheetClose>
						)}
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
