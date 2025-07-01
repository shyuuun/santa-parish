interface TransactionSummaryProps {
	title: string;
	amount: number;
	color: "green" | "blue" | "red" | "gray";
	icon?: React.ReactNode;
}

export default function TransactionSummaryCard({
	title,
	amount,
	color,
	icon,
}: TransactionSummaryProps) {
	const colorClasses = {
		green: "text-green-600",
		blue: "text-blue-600",
		red: "text-red-600",
		gray: "text-gray-900",
	};

	const iconColorClasses = {
		green: "bg-green-100 text-green-600",
		blue: "bg-blue-100 text-blue-600",
		red: "bg-red-100 text-red-600",
		gray: "bg-gray-100 text-gray-600",
	};

	return (
		<div className="bg-white border rounded-lg p-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						{title}
					</h3>
					<p className={`text-2xl font-bold ${colorClasses[color]}`}>
						₱{amount.toLocaleString()}
					</p>
				</div>
				{icon && (
					<div
						className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColorClasses[color]}`}
					>
						{icon}
					</div>
				)}
			</div>
		</div>
	);
}
