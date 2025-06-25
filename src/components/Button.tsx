export default function Button({
	children,
	onClick,
	isDisabled = false,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	isDisabled?: boolean;
}) {
	return (
		<button
			className="btn"
			onClick={onClick}
			disabled={isDisabled}
			type="submit"
		>
			{children}
		</button>
	);
}
