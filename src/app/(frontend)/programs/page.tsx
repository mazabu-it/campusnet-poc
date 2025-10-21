"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgramsPage() {
	const programs = [
		{
			id: 1,
			name: "Bachelor of Science in Software Engineering",
			code: "BSE",
			duration: "4 years",
			credits: 120,
			description:
				"Comprehensive software engineering program covering modern development practices, algorithms, and system design.",
			features: [
				"Full-stack Development",
				"Mobile App Development",
				"Cloud Computing",
				"AI/ML Integration",
			],
			careerPaths: [
				"Software Engineer",
				"Full-stack Developer",
				"DevOps Engineer",
				"Tech Lead",
			],
			color: "blue",
		},
		{
			id: 2,
			name: "Master of Science in Computer Science",
			code: "MSCS",
			duration: "2 years",
			credits: 60,
			description:
				"Advanced computer science program focusing on research, algorithms, and cutting-edge technologies.",
			features: [
				"Advanced Algorithms",
				"Machine Learning",
				"Distributed Systems",
				"Research Methods",
			],
			careerPaths: [
				"Research Scientist",
				"Senior Software Engineer",
				"Data Scientist",
				"Technical Architect",
			],
			color: "purple",
		},
		{
			id: 3,
			name: "Bachelor of Science in Data Science",
			code: "BSDS",
			duration: "4 years",
			credits: 120,
			description:
				"Interdisciplinary program combining statistics, computer science, and domain expertise for data-driven decision making.",
			features: [
				"Statistical Analysis",
				"Big Data Processing",
				"Machine Learning",
				"Data Visualization",
			],
			careerPaths: [
				"Data Scientist",
				"Data Analyst",
				"Business Intelligence",
				"Data Engineer",
			],
			color: "green",
		},
	];

	const getColorClasses = (color: string) => {
		const colors = {
			blue: "bg-blue-50 border-blue-200 text-blue-900",
			purple: "bg-purple-50 border-purple-200 text-purple-900",
			green: "bg-green-50 border-green-200 text-green-900",
		};
		return colors[color as keyof typeof colors] || colors.blue;
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Hero Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20"
			>
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-5xl md:text-6xl font-bold mb-6">
						Academic Programs
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
						Discover our comprehensive range of programs designed to
						prepare you for the future of technology
					</p>
				</div>
			</motion.div>

			{/* Programs Grid */}
			<div className="container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
					{programs.map((program, index) => (
						<motion.div
							key={program.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
						>
							<Card
								className={`h-full hover:shadow-xl transition-all duration-300 border-2 ${getColorClasses(program.color)}`}
							>
								<CardHeader>
									<div className="flex items-start justify-between mb-4">
										<div>
											<CardTitle className="text-2xl font-bold mb-2">
												{program.name}
											</CardTitle>
											<Badge
												variant="outline"
												className="mb-3"
											>
												{program.code}
											</Badge>
										</div>
										<div className="text-right text-sm">
											<div className="font-semibold">
												{program.duration}
											</div>
											<div>{program.credits} credits</div>
										</div>
									</div>
									<p className="text-gray-600 dark:text-gray-300">
										{program.description}
									</p>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<h4 className="font-semibold mb-3 flex items-center">
											<Icon
												icon="lucide:star"
												className="mr-2"
											/>
											Key Features
										</h4>
										<div className="grid grid-cols-2 gap-2">
											{program.features.map((feature) => (
												<div
													key={feature}
													className="flex items-center text-sm"
												>
													<Icon
														icon="lucide:check"
														className="mr-2 text-green-600"
													/>
													{feature}
												</div>
											))}
										</div>
									</div>

									<div>
										<h4 className="font-semibold mb-3 flex items-center">
											<Icon
												icon="lucide:briefcase"
												className="mr-2"
											/>
											Career Paths
										</h4>
										<div className="flex flex-wrap gap-2">
											{program.careerPaths.map(
												(career) => (
													<Badge
														key={career}
														variant="secondary"
														className="text-xs"
													>
														{career}
													</Badge>
												),
											)}
										</div>
									</div>

									<Button
										className="w-full"
										variant="outline"
									>
										<Icon
											icon="lucide:arrow-right"
											className="mr-2"
										/>
										Learn More
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>

			{/* CTA Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="bg-gray-900 dark:bg-gray-800 text-white py-16"
			>
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl font-bold mb-6">
						Ready to Start Your Journey?
					</h2>
					<p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
						Join thousands of students who have transformed their
						careers with our programs
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-blue-600 hover:bg-blue-700"
						>
							<Icon icon="lucide:calendar" className="mr-2" />
							Schedule a Visit
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-white text-white hover:bg-white hover:text-gray-900"
						>
							<Icon icon="lucide:download" className="mr-2" />
							Download Brochure
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
