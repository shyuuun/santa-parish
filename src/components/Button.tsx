export default function Button({
	children,
	onClick,
	isDisabled = false,
	className = "",
	type = "submit",
}: {
	children: React.ReactNode;
	onClick?: () => void;
	isDisabled?: boolean;
	className?: string;
	type?: "button" | "submit" | "reset";
}) {
	return (
		<button
			className={`btn ${className}`}
			onClick={onClick}
			disabled={isDisabled}
			type={type}
		>
			{children}
		</button>
	);
}
