"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgramsShowcaseData {
	title: string;
	subtitle: string;
	programs?: Array<{
		name: string;
		description: string;
		icon: string;
		level: string;
		duration: string;
		credits: number;
		studentCount: string;
	}>;
}

interface Props {
	block: ProgramsShowcaseData;
}

export const ProgramsShowcaseComponent: React.FC<Props> = ({ block }) => {
	// Add error handling and default values
	if (!block) {
		return (
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Our Academic Programs
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Discover world-class programs designed to prepare
							you for success
						</p>
					</div>
				</div>
			</section>
		);
	}

	const {
		title = "Our Academic Programs",
		subtitle = "Discover world-class programs designed to prepare you for success",
		programs = [],
	} = block;

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
						{title}
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						{subtitle}
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{programs?.map((program, index) => (
						<motion.div
							key={program.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
						>
							<Card className="h-full hover:shadow-xl transition-all duration-300 group">
								<CardHeader className="pb-4">
									<div className="flex items-center justify-between mb-4">
										<Icon
											icon={program.icon}
											className="text-4xl text-blue-600 group-hover:scale-110 transition-transform duration-300"
										/>
										<Badge
											variant="secondary"
											className="bg-blue-100 text-blue-800"
										>
											{program.level}
										</Badge>
									</div>
									<CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
										{program.name}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 mb-4 line-clamp-3">
										{program.description}
									</p>
									<div className="space-y-2 mb-6">
										<div className="flex items-center text-sm text-gray-500">
											<Icon
												icon="lucide:clock"
												className="mr-2"
											/>
											Duration: {program.duration}
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<Icon
												icon="lucide:graduation-cap"
												className="mr-2"
											/>
											Credits: {program.credits}
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<Icon
												icon="lucide:users"
												className="mr-2"
											/>
											Students: {program.studentCount}
										</div>
									</div>
									<Button className="w-full group-hover:bg-blue-600 transition-colors duration-300">
										Learn More
										<Icon
											icon="lucide:arrow-right"
											className="ml-2"
										/>
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className="text-center mt-12"
				>
					<Button size="lg" variant="outline" className="px-8 py-4">
						<Icon icon="lucide:book-open" className="mr-2" />
						View All Programs
					</Button>
				</motion.div>
			</div>
		</motion.section>
	);
};
