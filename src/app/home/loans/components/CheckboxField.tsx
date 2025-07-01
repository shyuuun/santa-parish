"use client";

import { useState } from "react";
import { Checkbox } from "@/src/components/shadcn/checkbox";

interface CheckboxFieldProps {
	id: string;
	name: string;
	label: string;
	required?: boolean;
}

export default function CheckboxField({
	id,
	name,
	label,
	required = false,
}: CheckboxFieldProps) {
	const [checked, setChecked] = useState(false);

	return (
		<div className="mt-4 flex items-start space-x-3">
			<div className="flex items-center h-5">
				<Checkbox
					id={id}
					checked={checked}
					onCheckedChange={(checkedState) =>
						setChecked(checkedState === true)
					}
					className="w-4 h-4"
				/>
				<input
					type="hidden"
					name={name}
					value={checked ? "true" : ""}
				/>
			</div>
			<div className="min-w-0 flex-1">
				<label
					htmlFor={id}
					className="text-sm text-gray-700 cursor-pointer"
				>
					{label} {required && "*"}
				</label>
			</div>
		</div>
	);
}
