type BadgeProps = {
	children: React.ReactNode;
	className?: string;
	variant?: "default" | "warning" | "error" | "success";
	size?: "small" | "medium" | "large";
};

const badgeVariants = {
	default: "bg-blue-100 text-blue-800",
	warning: "bg-yellow-100 text-yellow-800",
	error: "bg-red-100 text-red-800",
	success: "bg-green-100 text-green-800",
};

const badgeSizes = {
	small: "px-2.5 py-0.5 text-xs",
	medium: "px-3 py-1 text-sm",
	large: "px-4 py-1.5 text-base",
};

export default function Badge({
	children,
	variant = "default",
	size = "small",
	className = "",
}: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full
        ${badgeVariants[variant]}
        ${badgeSizes[size]} 
        ${className}`}
		>
			{children}
		</span>
	);
}
