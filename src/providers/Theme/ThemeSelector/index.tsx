"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { useTheme } from "..";
import type { Theme } from "./types";
import { themeLocalStorageKey } from "./types";

export const ThemeSelector: React.FC = () => {
	const { setTheme } = useTheme();
	const [value, setValue] = useState("");

	const onThemeChange = (themeToSet: Theme & "auto") => {
		if (themeToSet === "auto") {
			setTheme(null);
			setValue("auto");
		} else {
			setTheme(themeToSet);
			setValue(themeToSet);
		}
	};

	React.useEffect(() => {
		const preference = window.localStorage.getItem(themeLocalStorageKey);
		setValue(preference ?? "auto");
	}, []);

	const getIcon = () => {
		switch (value) {
			case "light":
				return "lucide:sun";
			case "dark":
				return "lucide:moon";
			default:
				return "lucide:monitor";
		}
	};

	return (
		<Select onValueChange={onThemeChange} value={value}>
			<SelectTrigger
				aria-label="Select a theme"
				className="w-[60px] bg-transparent gap-2 pl-2 pr-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
			>
				<Icon icon={getIcon()} className="w-4 h-4 mx-auto" />
			</SelectTrigger>
			<SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
				<SelectItem
					value="auto"
					className="hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<div className="flex items-center gap-2">
						<Icon icon="lucide:monitor" className="w-4 h-4" />
						<span>Auto</span>
					</div>
				</SelectItem>
				<SelectItem
					value="light"
					className="hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<div className="flex items-center gap-2">
						<Icon icon="lucide:sun" className="w-4 h-4" />
						<span>Light</span>
					</div>
				</SelectItem>
				<SelectItem
					value="dark"
					className="hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<div className="flex items-center gap-2">
						<Icon icon="lucide:moon" className="w-4 h-4" />
						<span>Dark</span>
					</div>
				</SelectItem>
			</SelectContent>
		</Select>
	);
};
