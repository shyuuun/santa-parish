import { Input } from "@/src/components/shadcn/input";

export default function Search({
	onChange,
}: {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div className="bg-red-500 flex items-center justify-between mb-4 py-2 px-4 rounded text-white">
			<Input
				type="text"
				placeholder="Search..."
				className="border rounded px-3 py-2 max-w-[300px] bg-white"
				onChange={onChange}
			/>
		</div>
	);
}
