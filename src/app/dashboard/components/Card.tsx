type CardProps = {
	category: string;
	totalNumber: number;
};

export default function Card({ category, totalNumber }: CardProps) {
	return (
		<div className="dashboard_card ">
			<h1>{category}</h1>
			<p>{totalNumber}</p>
		</div>
	);
}
