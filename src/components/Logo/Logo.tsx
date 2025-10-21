import clsx from "clsx";

interface Props {
	className?: string;
	loading?: "lazy" | "eager";
	priority?: "auto" | "high" | "low";
}

export const Logo = (props: Props) => {
	const { className } = props;

	return (
		<div className={clsx("flex items-center space-x-2", className)}>
			{/* Custom University Logo */}
			<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
				<svg
					className="w-5 h-5 text-white"
					fill="currentColor"
					viewBox="0 0 20 20"
					aria-label="University logo"
					role="img"
				>
					<title>University Logo</title>
					<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
				</svg>
			</div>
			<div className="hidden sm:block">
				<h1 className="text-xl font-bold text-gray-900 dark:text-white">
					Campusnet University
				</h1>
				<p className="text-xs text-gray-600 dark:text-gray-400">
					Excellence in Education
				</p>
			</div>
		</div>
	);
};
