interface LoaderProps {
	size?: "sm" | "md" | "lg" | "2xl";
	fill?: string;
}

export default function Loader({ size = "md", fill = "#CDCDCD" }: LoaderProps) {
	// Ensure size is always a valid key by providing a default fallback
	const validSize: "sm" | "md" | "lg" | "2xl" = size ?? "md";

	const sizeMap: Record<"sm" | "md" | "lg" | "2xl", number> = {
		sm: 16,
		md: 32,
		lg: 52,
		"2xl": 82,
	};

	const circleSizeMap: Record<"sm" | "md" | "lg" | "2xl", number> = {
		sm: 12,
		md: 16,
		lg: 22,
		"2xl": 30,
	};

	const svgSize = sizeMap[validSize];
	const circleSize = circleSizeMap[validSize];

	return (
		<svg
			width={svgSize * 3}
			height={svgSize}
			viewBox="0 0 120 30"
			xmlns="http://www.w3.org/2000/svg"
			fill={fill}
		>
			<circle cx="15" cy="15" r={circleSize}>
				<animate
					attributeName="r"
					from={circleSize}
					to={circleSize}
					begin="0s"
					dur="0.8s"
					values={`${circleSize};${circleSize * 0.6};${circleSize}`}
					calcMode="linear"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="fill-opacity"
					from="1"
					to="1"
					begin="0s"
					dur="0.8s"
					values="1;.5;1"
					calcMode="linear"
					repeatCount="indefinite"
				/>
			</circle>
			<circle cx="60" cy="15" r={circleSize * 0.6} fillOpacity="0.3">
				<animate
					attributeName="r"
					from={circleSize * 0.6}
					to={circleSize * 0.6}
					begin="0s"
					dur="0.8s"
					values={`${circleSize * 0.6};${circleSize};${
						circleSize * 0.6
					}`}
					calcMode="linear"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="fill-opacity"
					from="0.5"
					to="0.5"
					begin="0s"
					dur="0.8s"
					values=".5;1;.5"
					calcMode="linear"
					repeatCount="indefinite"
				/>
			</circle>
			<circle cx="105" cy="15" r={circleSize}>
				<animate
					attributeName="r"
					from={circleSize}
					to={circleSize}
					begin="0s"
					dur="0.8s"
					values={`${circleSize};${circleSize * 0.6};${circleSize}`}
					calcMode="linear"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="fill-opacity"
					from="1"
					to="1"
					begin="0s"
					dur="0.8s"
					values="1;.5;1"
					calcMode="linear"
					repeatCount="indefinite"
				/>
			</circle>
		</svg>
	);
}
