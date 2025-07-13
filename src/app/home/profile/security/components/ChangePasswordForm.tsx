"use client";

import { useState } from "react";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import Alert from "@/src/components/Alert";
import { createClient } from "@/src/utils/supabase/cilent";
import { Eye, EyeOff, Lock } from "lucide-react";

interface ChangePasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export default function ChangePasswordForm() {
	const [formData, setFormData] = useState<ChangePasswordFormData>({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [alert, setAlert] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const supabase = createClient();

	const handleInputChange = (field: keyof ChangePasswordFormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		// Clear alert when user types
		if (alert) setAlert(null);
	};

	const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const validateForm = (): string | null => {
		if (!formData.currentPassword) {
			return "Current password is required";
		}
		if (!formData.newPassword) {
			return "New password is required";
		}
		if (formData.newPassword.length < 8) {
			return "New password must be at least 8 characters long";
		}
		if (formData.newPassword === formData.currentPassword) {
			return "New password must be different from current password";
		}
		if (formData.newPassword !== formData.confirmPassword) {
			return "Passwords do not match";
		}
		// Password strength validation
		const hasUpperCase = /[A-Z]/.test(formData.newPassword);
		const hasLowerCase = /[a-z]/.test(formData.newPassword);
		const hasNumbers = /\d/.test(formData.newPassword);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);

		if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
			return "Password must contain uppercase, lowercase, numbers, and special characters";
		}
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const validationError = validateForm();
		if (validationError) {
			setAlert({ type: "error", message: validationError });
			return;
		}

		setIsLoading(true);
		setAlert(null);

		try {
			// Update password using Supabase
			const { error } = await supabase.auth.updateUser({
				password: formData.newPassword,
			});

			if (error) {
				throw error;
			}

			setAlert({
				type: "success",
				message: "Password updated successfully! Please keep your new password secure.",
			});

			// Reset form
			setFormData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error: unknown) {
			console.error("Password update error:", error);
			setAlert({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to update password. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const getPasswordStrength = (password: string) => {
		if (!password) return { strength: 0, label: "", color: "" };
		
		let score = 0;
		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[a-z]/.test(password)) score++;
		if (/\d/.test(password)) score++;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

		if (score <= 2) return { strength: score, label: "Weak", color: "bg-red-500" };
		if (score <= 3) return { strength: score, label: "Fair", color: "bg-yellow-500" };
		if (score <= 4) return { strength: score, label: "Good", color: "bg-blue-500" };
		return { strength: score, label: "Strong", color: "bg-green-500" };
	};

	const passwordStrength = getPasswordStrength(formData.newPassword);

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{alert && (
				<Alert type={alert.type} message={alert.message} />
			)}

			{/* Current Password */}
			<div className="space-y-2">
				<Label htmlFor="currentPassword">Current Password</Label>
				<div className="relative">
					<Input
						id="currentPassword"
						type={showPasswords.current ? "text" : "password"}
						value={formData.currentPassword}
						onChange={(e) => handleInputChange("currentPassword", e.target.value)}
						placeholder="Enter your current password"
						className="pr-10"
						required
					/>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
						onClick={() => togglePasswordVisibility("current")}
					>
						{showPasswords.current ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>

			{/* New Password */}
			<div className="space-y-2">
				<Label htmlFor="newPassword">New Password</Label>
				<div className="relative">
					<Input
						id="newPassword"
						type={showPasswords.new ? "text" : "password"}
						value={formData.newPassword}
						onChange={(e) => handleInputChange("newPassword", e.target.value)}
						placeholder="Enter your new password"
						className="pr-10"
						required
					/>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
						onClick={() => togglePasswordVisibility("new")}
					>
						{showPasswords.new ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</Button>
				</div>
				
				{/* Password Strength Indicator */}
				{formData.newPassword && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">
								Password strength:
							</span>
							<span className={`text-sm font-medium ${
								passwordStrength.label === "Strong" ? "text-green-600" :
								passwordStrength.label === "Good" ? "text-blue-600" :
								passwordStrength.label === "Fair" ? "text-yellow-600" :
								"text-red-600"
							}`}>
								{passwordStrength.label}
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
								style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Confirm Password */}
			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirm New Password</Label>
				<div className="relative">
					<Input
						id="confirmPassword"
						type={showPasswords.confirm ? "text" : "password"}
						value={formData.confirmPassword}
						onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
						placeholder="Confirm your new password"
						className="pr-10"
						required
					/>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
						onClick={() => togglePasswordVisibility("confirm")}
					>
						{showPasswords.confirm ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</Button>
				</div>
				{formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
					<p className="text-sm text-red-600">Passwords do not match</p>
				)}
			</div>

			{/* Submit Button */}
			<Button
				type="submit"
				className="w-full"
				disabled={isLoading}
			>
				<Lock className="w-4 h-4 mr-2" />
				{isLoading ? "Updating Password..." : "Update Password"}
			</Button>

			{/* Password Requirements */}
			<div className="text-xs text-muted-foreground space-y-1">
				<p className="font-medium">Password Requirements:</p>
				<ul className="space-y-1 ml-4">
					<li className={`${formData.newPassword.length >= 8 ? "text-green-600" : ""}`}>
						• At least 8 characters long
					</li>
					<li className={`${/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}`}>
						• Contains uppercase letters (A-Z)
					</li>
					<li className={`${/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}`}>
						• Contains lowercase letters (a-z)
					</li>
					<li className={`${/\d/.test(formData.newPassword) ? "text-green-600" : ""}`}>
						• Contains numbers (0-9)
					</li>
					<li className={`${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? "text-green-600" : ""}`}>
						• Contains special characters (!@#$%^&*)
					</li>
				</ul>
			</div>
		</form>
	);
}
