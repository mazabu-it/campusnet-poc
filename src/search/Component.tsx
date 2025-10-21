"use client";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/utilities/useDebounce";

export const Search: React.FC = () => {
	const [value, setValue] = useState("");
	const router = useRouter();
	const searchId = useId();

	const debouncedValue = useDebounce(value);

	useEffect(() => {
		router.push(`/search${debouncedValue ? `?q=${debouncedValue}` : ""}`);
	}, [debouncedValue, router]);

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<Label htmlFor={searchId} className="sr-only">
					Search
				</Label>
				<Input
					id={searchId}
					onChange={(event) => {
						setValue(event.target.value);
					}}
					placeholder="Search"
				/>
				<button type="submit" className="sr-only">
					submit
				</button>
			</form>
		</div>
	);
};
