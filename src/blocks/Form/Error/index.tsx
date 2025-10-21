"use client";

import { useFormContext } from "react-hook-form";

export const FormError = ({ name }: { name: string }) => {
	const {
		formState: { errors },
	} = useFormContext();
	return (
		<div className="mt-2 text-red-500 text-sm">
			{(errors[name]?.message as string) || "This field is required"}
		</div>
	);
};
