import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/shadcn/card";
import Badge from "@/src/components/Badge";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { Textarea } from "@/src/components/shadcn/textarea";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/shadcn/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/shadcn/select";
import {
	User,
	Calendar,
	Briefcase,
	Edit3,
	Shield,
	CreditCard,
} from "lucide-react";
import Link from "next/link";
import { user as userRoutes } from "@/src/utils/route";

export default async function ProfilePage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get user info
	const { data: userInfo } = await supabase
		.from("user_info")
		.select("*")
		.eq("uuid", user.id)
		.single();

	// Get user additional info
	const { data: userAddInfo } = await supabase
		.from("user_add_info")
		.select("*")
		.eq("uuid", user.id)
		.single();

	// Get user role
	const { data: userRole } = await supabase
		.from("user_with_roles")
		.select("*")
		.eq("user_id", user.id)
		.single();

	const getInitials = (name: string) => {
		return (
			name
				?.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase() || "U"
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-6">
			{/* Profile Header */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20">
								<AvatarImage
									src=""
									alt={userInfo?.name || "User"}
								/>
								<AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-600">
									{getInitials(userInfo?.name || "User")}
								</AvatarFallback>
							</Avatar>
							<div>
								<h1 className="text-2xl font-bold">
									{userInfo?.name || "User"}
								</h1>
								<p className="text-muted-foreground">
									{user.email}
								</p>
								<div className="flex items-center gap-2 mt-2">
									<Badge variant="success">
										<Shield className="w-3 h-3 mr-1" />
										Verified Member
									</Badge>
									<Badge variant="default">
										{userRole?.role || "Member"}
									</Badge>
								</div>
							</div>
						</div>
						<div className="ml-auto">
							<Button variant="outline" className="gap-2" asChild>
								<Link href={userRoutes.profileEdit}>
									<Edit3 className="w-4 h-4" />
									Edit Profile
								</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Personal Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="w-5 h-5" />
							Personal Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4">
							<div>
								<Label
									htmlFor="name"
									className="text-sm font-medium"
								>
									Full Name
								</Label>
								<Input
									id="name"
									value={userInfo?.name || ""}
									readOnly
									className="mt-1"
								/>
							</div>

							<div>
								<Label
									htmlFor="email"
									className="text-sm font-medium"
								>
									Email Address
								</Label>
								<Input
									id="email"
									value={user.email || ""}
									readOnly
									className="mt-1"
									type="email"
								/>
							</div>

							<div>
								<Label
									htmlFor="gender"
									className="text-sm font-medium"
								>
									Gender
								</Label>
								<Select value={userInfo?.gender || ""} disabled>
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="MALE">
											Male
										</SelectItem>
										<SelectItem value="FEMALE">
											Female
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label
									htmlFor="birthdate"
									className="text-sm font-medium"
								>
									Date of Birth
								</Label>
								<Input
									id="birthdate"
									value={
										userInfo?.birthdate
											? formatDate(userInfo.birthdate)
											: ""
									}
									readOnly
									className="mt-1"
								/>
							</div>

							<div>
								<Label
									htmlFor="address"
									className="text-sm font-medium"
								>
									Address
								</Label>
								<Textarea
									id="address"
									value={userInfo?.address || ""}
									readOnly
									className="mt-1"
									rows={3}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Employment Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Briefcase className="w-5 h-5" />
							Employment Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4">
							<div>
								<Label
									htmlFor="job_title"
									className="text-sm font-medium"
								>
									Job Title
								</Label>
								<Input
									id="job_title"
									value={userAddInfo?.job_title || ""}
									readOnly
									className="mt-1"
								/>
							</div>

							<div>
								<Label
									htmlFor="employment_type"
									className="text-sm font-medium"
								>
									Employment Type
								</Label>
								<Select
									value={userAddInfo?.employment_type || ""}
									disabled
								>
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Select employment type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="FULL_TIME">
											Full Time
										</SelectItem>
										<SelectItem value="PART_TIME">
											Part Time
										</SelectItem>
										<SelectItem value="SELF_EMPLOYED">
											Self Employed
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label
									htmlFor="work_address"
									className="text-sm font-medium"
								>
									Work Address
								</Label>
								<Textarea
									id="work_address"
									value={userAddInfo?.work_address || ""}
									readOnly
									className="mt-1"
									rows={3}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Account Overview */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CreditCard className="w-5 h-5" />
						Account Overview
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-1">
						<div className="p-4 border rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-muted-foreground">
									Member Since
								</span>
								<Calendar className="w-4 h-4 text-muted-foreground" />
							</div>
							<p className="text-lg font-semibold">
								{user.created_at
									? formatDate(user.created_at)
									: "N/A"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Profile Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						<Button
							variant="outline"
							className="justify-start gap-2"
							asChild
						>
							<Link href={userRoutes.profileEdit}>
								<Edit3 className="w-4 h-4" />
								Edit Profile
							</Link>
						</Button>

						<Button
							variant="outline"
							className="justify-start gap-2"
							asChild
						>
							<Link href={userRoutes.profileSecurity}>
								<Shield className="w-4 h-4" />
								Security Settings
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Privacy Notice */}
			<Card className="bg-blue-50 border-blue-200">
				<CardContent>
					<div className="flex items-start gap-3">
						<Shield className="w-5 h-5 text-blue-600 mt-0.5" />
						<div>
							<h3 className="font-semibold text-blue-900 mb-1">
								Privacy & Security
							</h3>
							<p className="text-sm text-blue-700">
								Your personal information is protected and
								encrypted. Only authorized personnel can access
								your data for verification and service purposes.
								We never share your information with third
								parties without your consent.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
