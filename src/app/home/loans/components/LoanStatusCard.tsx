import Badge from "@/src/components/Badge";

interface LoanStatusCardProps {
	title: string;
	status: "pending" | "approved" | "denied" | "active" | "completed";
	amount: number;
	date: string;
	description?: string;
	children?: React.ReactNode;
}

export default function LoanStatusCard({
	title,
	status,
	amount,
	date,
	description,
	children,
}: LoanStatusCardProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
			case "active":
				return "success";
			case "denied":
				return "error";
			case "completed":
				return "default";
			default:
				return "warning";
		}
	};

	return (
		<div className="bg-white border rounded-lg p-6">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="font-semibold text-lg text-gray-900">
						{title}
					</h3>
					{description && (
						<p className="text-gray-600 text-sm mt-1">
							{description}
						</p>
					)}
				</div>
				<Badge variant={getStatusColor(status)}>{status}</Badge>
			</div>

			<div className="grid grid-cols-2 gap-4 text-sm mb-4">
				<div>
					<span className="text-gray-500">Amount:</span>
					<p className="font-medium">₱{amount.toLocaleString()}</p>
				</div>
				<div>
					<span className="text-gray-500">Date:</span>
					<p className="font-medium">{date}</p>
				</div>
			</div>

			{children && <div>{children}</div>}
		</div>
	);
}
