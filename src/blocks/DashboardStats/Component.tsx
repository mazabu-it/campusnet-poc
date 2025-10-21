"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import {
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DashboardStatsData {
	title: string;
	subtitle: string;
	metrics?: Array<{
		label: string;
		value: string;
		icon: string;
		trend: "up" | "down";
		change: string;
	}>;
	enrollmentData?: Array<{
		month: string;
		enrollments: number;
	}>;
	programData?: Array<{
		name: string;
		value: number;
	}>;
	goals?: Array<{
		name: string;
		description: string;
		progress: number;
	}>;
}

interface Props {
	block: DashboardStatsData;
}

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

export const DashboardStatsComponent: React.FC<Props> = ({ block }) => {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="py-20 bg-gray-50"
		>
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2, duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						{block.title}
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						{block.subtitle}
					</p>
				</motion.div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
					{block.metrics?.map((metric, index) => (
						<motion.div
							key={metric.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
						>
							<Card className="hover:shadow-lg transition-shadow duration-300">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium text-gray-600">
										{metric.label}
									</CardTitle>
									<Icon
										icon={metric.icon}
										className="h-4 w-4 text-gray-600"
									/>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold text-gray-900">
										{metric.value}
									</div>
									<div className="flex items-center text-xs text-gray-500 mt-1">
										<Icon
											icon={
												metric.trend === "up"
													? "lucide:trending-up"
													: "lucide:trending-down"
											}
											className={`mr-1 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}
										/>
										<span
											className={
												metric.trend === "up"
													? "text-green-500"
													: "text-red-500"
											}
										>
											{metric.change}
										</span>
										<span className="ml-1">
											from last month
										</span>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
					{/* Enrollment Trend */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.4, duration: 0.6 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Icon
										icon="lucide:trending-up"
										className="mr-2 text-blue-600"
									/>
									Enrollment Trends
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<LineChart data={block.enrollmentData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="month" />
										<YAxis />
										<Tooltip />
										<Line
											type="monotone"
											dataKey="enrollments"
											stroke="#3B82F6"
											strokeWidth={2}
										/>
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>

					{/* Program Distribution */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.6, duration: 0.6 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Icon
										icon="lucide:pie-chart"
										className="mr-2 text-purple-600"
									/>
									Program Distribution
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={block.programData}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={({ name, percent }) =>
												`${name} ${((percent as number) * 100).toFixed(0)}%`
											}
											outerRadius={80}
											fill="#8884d8"
											dataKey="value"
										>
											{block.programData?.map(
												(entry, index) => (
													<Cell
														key={entry.name}
														fill={
															COLORS[
																index %
																	COLORS.length
															]
														}
													/>
												),
											)}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Progress Bars */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.8, duration: 0.6 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Icon
									icon="lucide:target"
									className="mr-2 text-green-600"
								/>
								Academic Goals Progress
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{block.goals?.map((goal, _index) => (
								<div key={goal.name} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-gray-700">
											{goal.name}
										</span>
										<Badge
											variant="secondary"
											className="bg-blue-100 text-blue-800"
										>
											{goal.progress}%
										</Badge>
									</div>
									<Progress
										value={goal.progress}
										className="h-2"
									/>
									<p className="text-xs text-gray-500">
										{goal.description}
									</p>
								</div>
							))}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.section>
	);
};
