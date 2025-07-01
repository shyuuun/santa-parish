import { cancelLoanApplication } from "../../actions";
import { redirect } from "next/navigation";

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const applicationId = parseInt(params.id);

	if (isNaN(applicationId)) {
		redirect("/home/loans?error=Invalid application ID");
	}

	const result = await cancelLoanApplication(applicationId);

	if (result.error) {
		redirect(`/home/loans?error=${encodeURIComponent(result.error)}`);
	}

	redirect("/home/loans?success=Application cancelled successfully");
}
