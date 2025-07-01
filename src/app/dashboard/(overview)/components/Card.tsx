type CardProps = {
	category: string;
	totalNumber: number;
};

export default function Card({ category, totalNumber }: CardProps) {
	return (
		<div className="dashboard_card">
			<h4>{category}</h4>
			<p className="font-medium">{totalNumber}</p>
		</div>
	);
}
