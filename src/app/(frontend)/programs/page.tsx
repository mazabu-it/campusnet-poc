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
			blue: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
			purple: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100",
			green: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
		};
		return colors[color as keyof typeof colors] || colors.blue;
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section - Modern Minimal Design */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="relative overflow-hidden py-24 md:py-32"
			>
				{/* Subtle gradient background */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent dark:from-blue-500/10 dark:via-purple-500/10" />

				{/* Decorative elements */}
				<div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
				<div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />

				<div className="container mx-auto px-4 text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}
					>
						<Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
							<Icon
								icon="lucide:graduation-cap"
								className="mr-2 h-4 w-4"
							/>
							Explore Our Programs
						</Badge>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
					>
						Shape Your
						<span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Future Career
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.6 }}
						className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
					>
						World-class programs designed to transform your passion
						into expertise
					</motion.p>

					{/* Quick stats */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.6 }}
						className="flex flex-wrap justify-center gap-8 mt-12"
					>
						{[
							{
								icon: "lucide:users",
								label: "10K+ Students",
								value: "10,000+",
							},
							{
								icon: "lucide:award",
								label: "50+ Programs",
								value: "50+",
							},
							{
								icon: "lucide:briefcase",
								label: "95% Employment",
								value: "95%",
							},
						].map((stat) => (
							<div key={stat.label} className="text-center">
								<div className="flex items-center justify-center gap-2 text-foreground font-bold text-2xl mb-1">
									<Icon
										icon={stat.icon}
										className="h-6 w-6 text-blue-600 dark:text-blue-400"
									/>
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</div>
						))}
					</motion.div>
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
				className="bg-card text-card-foreground py-16"
			>
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl font-bold mb-6">
						Ready to Start Your Journey?
					</h2>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Join thousands of students who have transformed their
						careers with our programs
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							variant="outline"
							className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-white dark:text-white dark:hover:bg-white/10"
						>
							<Icon icon="lucide:calendar" className="mr-2" />
							Schedule a Visit
						</Button>
						<Button size="lg" variant="outline">
							<Icon icon="lucide:download" className="mr-2" />
							Download Brochure
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
