type AlertType = "info" | "success" | "warning" | "error";

export default function Alert({
	type = "info",
	message,
}: {
	type: AlertType;
	message: string;
}) {
	const baseStyle =
		"px-4 py-3 rounded-md flex items-center gap-2 text-sm font-medium";

	const alertTypes: Record<AlertType, string> = {
		info: "bg-blue-100 text-blue-700 border border-blue-300",
		success: "bg-green-100 text-green-700 border border-green-300",
		warning: "bg-yellow-100 text-yellow-700 border border-yellow-300",
		error: "bg-red-100 text-red-700 border border-red-300",
	};

	return (
		<div className={`${baseStyle} ${alertTypes[type]}`}>
			{type === "info" && "ℹ️ "}
			{type === "success" && "✅ "}
			{type === "warning" && "⚠️ "}
			{type === "error" && "❌ "}
			{message}
		</div>
	);
}
