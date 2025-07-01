"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/cilent";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/shadcn/card";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { Textarea } from "@/src/components/shadcn/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/shadcn/select";
import { User, Briefcase, Save, X, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface AuthUser {
	id: string;
	email?: string;
}

interface UserInfo {
	name: string;
	gender: string;
	birthdate: string;
	address: string;
	uuid: string;
}

interface UserAddInfo {
	job_title: string;
	employment_type: string;
	work_address: string;
	support_docs: string;
	uuid: string;
}

export default function EditProfilePage() {
	const router = useRouter();
	const supabase = createClient();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [user, setUser] = useState<AuthUser | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo>({
		name: "",
		gender: "",
		birthdate: "",
		address: "",
		uuid: "",
	});
	const [userAddInfo, setUserAddInfo] = useState<UserAddInfo>({
		job_title: "",
		employment_type: "",
		work_address: "",
		support_docs: "",
		uuid: "",
	});

	const loadUserData = useCallback(async () => {
		try {
			const {
				data: { user: authUser },
			} = await supabase.auth.getUser();

			if (!authUser) {
				router.push("/login");
				return;
			}

			setUser(authUser);

			// Get user info
			const { data: userInfoData } = await supabase
				.from("user_info")
				.select("*")
				.eq("uuid", authUser.id)
				.single();

			// Get user additional info
			const { data: userAddInfoData } = await supabase
				.from("user_add_info")
				.select("*")
				.eq("uuid", authUser.id)
				.single();

			if (userInfoData) {
				setUserInfo({
					name: userInfoData.name || "",
					gender: userInfoData.gender || "",
					birthdate: userInfoData.birthdate || "",
					address: userInfoData.address || "",
					uuid: userInfoData.uuid,
				});
			}

			if (userAddInfoData) {
				setUserAddInfo({
					job_title: userAddInfoData.job_title || "",
					employment_type: userAddInfoData.employment_type || "",
					work_address: userAddInfoData.work_address || "",
					support_docs: userAddInfoData.support_docs || "",
					uuid: userAddInfoData.uuid,
				});
			}
		} catch (error) {
			console.error("Error loading user data:", error);
			toast.error("Failed to load user data");
		} finally {
			setLoading(false);
		}
	}, [supabase, router]);

	useEffect(() => {
		loadUserData();
	}, [loadUserData]);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) {
			toast.error("User not authenticated");
			return;
		}

		setSaving(true);

		try {
			// Upsert user_info
			const { error: userInfoError } = await supabase
				.from("user_info")
				.upsert({
					uuid: user.id,
					name: userInfo.name,
					gender: userInfo.gender,
					birthdate: userInfo.birthdate,
					address: userInfo.address,
				});

			if (userInfoError) throw userInfoError;

			// Upsert user_add_info
			const { error: userAddInfoError } = await supabase
				.from("user_add_info")
				.upsert({
					uuid: user.id,
					job_title: userAddInfo.job_title,
					employment_type: userAddInfo.employment_type,
					work_address: userAddInfo.work_address,
					support_docs: userAddInfo.support_docs || "", // Preserve existing support_docs
				});

			if (userAddInfoError) throw userAddInfoError;

			toast.success("Profile updated successfully!");
			router.push("/home/profile");
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error("Failed to update profile. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	const formatDateForInput = (dateString: string) => {
		if (!dateString) return "";
		return new Date(dateString).toISOString().split("T")[0];
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Link href="/home/profile">
					<Button variant="outline" size="sm" className="gap-2">
						<ArrowLeft className="w-4 h-4" />
						Back to Profile
					</Button>
				</Link>
				<div>
					<h1 className="text-2xl font-bold">Edit Profile</h1>
					<p className="text-muted-foreground">
						Update your personal and employment information
					</p>
				</div>
			</div>

			<form onSubmit={handleSave} className="space-y-6">
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
							<div>
								<Label
									htmlFor="name"
									className="text-sm font-medium"
								>
									Full Name{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Input
									id="name"
									value={userInfo.name}
									onChange={(e) =>
										setUserInfo({
											...userInfo,
											name: e.target.value,
										})
									}
									className="mt-1"
									required
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
									value={user?.email || ""}
									readOnly
									className="mt-1 bg-gray-50"
									type="email"
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Email cannot be changed here. Contact
									support if needed.
								</p>
							</div>

							<div>
								<Label
									htmlFor="gender"
									className="text-sm font-medium"
								>
									Gender{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Select
									value={userInfo.gender}
									onValueChange={(value) =>
										setUserInfo({
											...userInfo,
											gender: value,
										})
									}
								>
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
									Date of Birth{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Input
									id="birthdate"
									type="date"
									value={formatDateForInput(
										userInfo.birthdate
									)}
									onChange={(e) =>
										setUserInfo({
											...userInfo,
											birthdate: e.target.value,
										})
									}
									className="mt-1"
									required
								/>
							</div>

							<div>
								<Label
									htmlFor="address"
									className="text-sm font-medium"
								>
									Address{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Textarea
									id="address"
									value={userInfo.address}
									onChange={(e) =>
										setUserInfo({
											...userInfo,
											address: e.target.value,
										})
									}
									className="mt-1"
									rows={3}
									required
								/>
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
							<div>
								<Label
									htmlFor="job_title"
									className="text-sm font-medium"
								>
									Job Title{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Input
									id="job_title"
									value={userAddInfo.job_title}
									onChange={(e) =>
										setUserAddInfo({
											...userAddInfo,
											job_title: e.target.value,
										})
									}
									className="mt-1"
									required
								/>
							</div>

							<div>
								<Label
									htmlFor="employment_type"
									className="text-sm font-medium"
								>
									Employment Type{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Select
									value={userAddInfo.employment_type}
									onValueChange={(value) =>
										setUserAddInfo({
											...userAddInfo,
											employment_type: value,
										})
									}
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
									Work Address{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Textarea
									id="work_address"
									value={userAddInfo.work_address}
									onChange={(e) =>
										setUserAddInfo({
											...userAddInfo,
											work_address: e.target.value,
										})
									}
									className="mt-1"
									rows={3}
									required
								/>
							</div>

							<div className="p-4 bg-blue-50 rounded-lg">
								<p className="text-sm text-blue-700">
									<strong>Note:</strong> Changes to employment
									information may require admin verification.
									Your account status may be updated
									accordingly.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Action Buttons */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col sm:flex-row gap-4 justify-end">
							<Link href="/home/profile">
								<Button
									type="button"
									variant="outline"
									className="w-full sm:w-auto gap-2"
								>
									<X className="w-4 h-4" />
									Cancel
								</Button>
							</Link>
							<Button
								type="submit"
								disabled={saving}
								className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700"
							>
								{saving ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Save className="w-4 h-4" />
								)}
								{saving ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Help Section */}
				<Card className="bg-yellow-50 border-yellow-200">
					<CardContent className="pt-6">
						<div className="flex items-start gap-3">
							<User className="w-5 h-5 text-yellow-600 mt-0.5" />
							<div>
								<h3 className="font-semibold text-yellow-900 mb-1">
									Important Information
								</h3>
								<ul className="text-sm text-yellow-700 space-y-1">
									<li>
										• All fields marked with{" "}
										<span className="text-red-500">*</span>{" "}
										are required
									</li>
									<li>
										• Email address changes require admin
										approval
									</li>
									<li>
										• Employment information updates may
										affect your loan eligibility
									</li>
									<li>
										• Profile changes are logged for
										security purposes
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
