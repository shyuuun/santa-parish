import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/src/utils/supabase/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;
	const next = searchParams.get("next") ?? "/";

	console.log("Auth confirm - token_hash:", token_hash);
	console.log("Auth confirm - type:", type);

	if (token_hash && type) {
		const supabase = await createClient();

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});

		console.log("Token verification error:", error);

		if (!error) {
			// Redirect to the password reset page for recovery type
			if (type === "recovery") {
				console.log("Redirecting to reset-password page");
				return NextResponse.redirect(
					new URL("/reset-password", request.url)
				);
			}
			// For other types, redirect to the next URL
			return NextResponse.redirect(new URL(next, request.url));
		} else {
			console.error("Token verification failed:", error);
		}
	} else {
		console.log("Missing token_hash or type");
	}

	// Return the user to an error page with some instructions
	console.log("Redirecting to auth-code-error");
	return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
