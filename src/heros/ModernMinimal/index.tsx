"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ModernMinimalHero: React.FC = () => {
	return (
		<div className="relative overflow-hidden bg-background py-24 md:py-32 lg:py-40">
			{/* Decorative background elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent dark:from-blue-500/10 dark:via-purple-500/10" />
			<div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
			<div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-5xl mx-auto text-center">
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="mb-8"
					>
						<Badge className="px-4 py-2 text-sm font-medium bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 transition-colors">
							<Icon
								icon="lucide:sparkles"
								className="mr-2 h-4 w-4"
							/>
							Welcome to the Future of Education
						</Badge>
					</motion.div>

					{/* Main Heading */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1, duration: 0.5 }}
						className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight"
					>
						Transform Your
						<span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
							Future Today
						</span>
					</motion.h1>

					{/* Subtitle */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
					>
						World-class education meets cutting-edge technology.
						Join thousands of students building extraordinary
						careers.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
					>
						<Button
							asChild
							size="lg"
							className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-8 py-6 h-auto"
						>
							<Link href="/programs">
								<Icon
									icon="lucide:rocket"
									className="mr-2 h-5 w-5"
								/>
								Explore Programs
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="text-lg px-8 py-6 h-auto border-2 hover:bg-accent"
						>
							<Link href="/login">
								<Icon
									icon="lucide:log-in"
									className="mr-2 h-5 w-5"
								/>
								Student Portal
							</Link>
						</Button>
					</motion.div>

					{/* Stats Grid */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
					>
						{[
							{
								icon: "lucide:users",
								label: "Active Students",
								value: "10K+",
							},
							{
								icon: "lucide:graduation-cap",
								label: "Programs",
								value: "50+",
							},
							{
								icon: "lucide:award",
								label: "Success Rate",
								value: "95%",
							},
							{
								icon: "lucide:globe",
								label: "Countries",
								value: "40+",
							},
						].map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{
									delay: 0.5 + index * 0.1,
									duration: 0.5,
								}}
								className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg"
							>
								<div className="flex items-center justify-center mb-2">
									<Icon
										icon={stat.icon}
										className="h-8 w-8 text-blue-600 dark:text-blue-400"
									/>
								</div>
								<div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 0.5 }}
				className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
			>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{
						repeat: Number.POSITIVE_INFINITY,
						duration: 2,
					}}
					className="text-muted-foreground"
				>
					<Icon icon="lucide:chevron-down" className="h-8 w-8" />
				</motion.div>
			</motion.div>
		</div>
	);
};
