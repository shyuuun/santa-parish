"use client";

import { Button } from "../../../components/shadcn/button";

export default function DashboardError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
			<h2 className="text-xl font-semibold text-gray-900 mb-2">
				Something went wrong loading the dashboard
			</h2>
			<p className="text-gray-600 mb-4">
				We couldn&apos;t load the dashboard data. Please try again.
			</p>
			<Button onClick={reset}>Try again</Button>
		</div>
	);
}
