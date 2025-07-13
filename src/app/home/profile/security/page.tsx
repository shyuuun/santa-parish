import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/shadcn/card";
import { Button } from "@/src/components/shadcn/button";
import {
	Shield,
	Lock,
	ArrowLeft,
	Key,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { user as userRoutes } from "@/src/utils/route";
import ChangePasswordForm from "./components";

export default async function SecurityPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm" asChild>
					<Link href={userRoutes.profile}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Profile
					</Link>
				</Button>
			</div>

			<div className="flex items-center gap-3">
				<Shield className="w-8 h-8 text-blue-600" />
				<div>
					<h1 className="text-3xl font-bold">Security Settings</h1>
					<p className="text-muted-foreground">
						Manage your account security and authentication settings
					</p>
				</div>
			</div>

			{/* Account Security Overview */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CheckCircle className="w-5 h-5 text-green-600" />
						Account Security Status
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="p-4 border rounded-lg bg-green-50 border-green-200">
							<div className="flex items-center gap-2 mb-2">
								<Shield className="w-4 h-4 text-green-600" />
								<span className="font-medium text-green-900">
									Account Verified
								</span>
							</div>
							<p className="text-sm text-green-700">
								Your account has been verified and is secure
							</p>
						</div>

						<div className="p-4 border rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<Key className="w-4 h-4 text-blue-600" />
								<span className="font-medium">
									Last Password Change
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								{user.updated_at
									? formatDate(user.updated_at)
									: "Never"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Change Password */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="w-5 h-5" />
						Change Password
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="max-w-md">
						<ChangePasswordForm />
					</div>
				</CardContent>
			</Card>

			{/* Security Tips */}
			<Card className="bg-amber-50 border-amber-200">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-amber-900">
						<AlertTriangle className="w-5 h-5" />
						Security Tips
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2 text-sm text-amber-800">
						<li className="flex items-start gap-2">
							<span className="text-amber-600 mt-0.5">•</span>
							Use a strong password with at least 8 characters
							including uppercase, lowercase, numbers, and symbols
						</li>
						<li className="flex items-start gap-2">
							<span className="text-amber-600 mt-0.5">•</span>
							Never share your password with anyone, including
							staff members
						</li>
						<li className="flex items-start gap-2">
							<span className="text-amber-600 mt-0.5">•</span>
							Change your password regularly for better security
						</li>
						<li className="flex items-start gap-2">
							<span className="text-amber-600 mt-0.5">•</span>
							Log out from shared or public computers after use
						</li>
						<li className="flex items-start gap-2">
							<span className="text-amber-600 mt-0.5">•</span>
							Contact support immediately if you notice any
							suspicious activity
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
