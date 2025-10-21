"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UniversityHeroData {
	title: string;
	subtitle: string;
	primaryButtonText: string;
	secondaryButtonText: string;
	stats?: Array<{
		icon: string;
		value: string;
		label: string;
	}>;
}

interface Props {
	block: UniversityHeroData;
}

export const UniversityHeroComponent: React.FC<Props> = ({ block }) => {
	// Add error handling and default values
	if (!block) {
		return (
			<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
				<div className="container mx-auto px-4 py-20 text-center">
					<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
						Welcome to Demo University
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						Empowering Tomorrow's Leaders Through Excellence in
						Education
					</p>
				</div>
			</section>
		);
	}

	const {
		title = "Welcome to Demo University",
		subtitle = "Empowering Tomorrow's Leaders Through Excellence in Education",
		primaryButtonText = "Apply Now",
		secondaryButtonText = "Learn More",
		stats = [],
	} = block;

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden"
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 py-20">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.6 }}
					>
						<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
							{title}
						</h1>
					</motion.div>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.6 }}
						className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
					>
						{subtitle}
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.6 }}
						className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
					>
						<Button
							size="lg"
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
						>
							<Icon
								icon="lucide:graduation-cap"
								className="mr-2"
							/>
							{primaryButtonText}
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="px-8 py-4 text-lg"
						>
							<Icon icon="lucide:play" className="mr-2" />
							{secondaryButtonText}
						</Button>
					</motion.div>

					{/* Stats */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
					>
						{stats?.map((stat, index) => (
							<Card
								key={stat.label ?? index}
								className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"
							>
								<CardContent className="p-6 text-center">
									<Icon
										icon={stat.icon}
										className="text-4xl text-blue-600 mx-auto mb-4"
									/>
									<div className="text-3xl font-bold text-gray-900 mb-2">
										{stat.value}
									</div>
									<div className="text-gray-600">
										{stat.label}
									</div>
								</CardContent>
							</Card>
						))}
					</motion.div>
				</div>
			</div>

			{/* Floating Elements */}
			<motion.div
				animate={{ y: [0, -20, 0] }}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
			/>
			<motion.div
				animate={{ y: [0, 20, 0] }}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20"
			/>
		</motion.section>
	);
};
