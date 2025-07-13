import { ReactNode } from "react";

type CardProps = {
	category: string;
	totalNumber: number;
	isLoading?: boolean;
	icon?: ReactNode;
};

export default function Card({ category, totalNumber, isLoading = false, icon }: CardProps) {
	return (
		<div className="dashboard_card bg-white rounded-lg shadow-md p-6 border border-gray-200">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{category}</p>
					{isLoading ? (
						<div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2" />
					) : (
						<p className="text-2xl font-bold text-gray-900 mt-2">
							{totalNumber.toLocaleString()}
						</p>
					)}
				</div>
				{icon && (
					<div className="text-gray-400">
						{icon}
					</div>
				)}
			</div>
		</div>
	);
}
