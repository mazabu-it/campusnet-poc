"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CTASectionComponent: React.FC = () => {
	return (
		<section className="py-24 md:py-32 bg-background">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 md:p-16 lg:p-20"
				>
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

					<div className="relative z-10 text-center text-white">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2, duration: 0.6 }}
							className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
						>
							Ready to Start Your Journey?
						</motion.h2>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3, duration: 0.6 }}
							className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100"
						>
							Join thousands of students who have transformed
							their careers with our world-class programs
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.4, duration: 0.6 }}
							className="flex flex-col sm:flex-row gap-4 justify-center"
						>
							<Button
								asChild
								size="lg"
								className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
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
								className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
							>
								<Link href="/login">
									<Icon
										icon="lucide:calendar"
										className="mr-2 h-5 w-5"
									/>
									Schedule a Visit
								</Link>
							</Button>
						</motion.div>

						{/* Stats */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.5, duration: 0.6 }}
							className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
						>
							{[
								{ value: "10K+", label: "Active Students" },
								{ value: "50+", label: "Programs" },
								{ value: "95%", label: "Success Rate" },
								{ value: "40+", label: "Countries" },
							].map((stat) => (
								<div key={stat.label} className="text-center">
									<div className="text-3xl md:text-4xl font-bold mb-2">
										{stat.value}
									</div>
									<div className="text-sm md:text-base text-blue-100">
										{stat.label}
									</div>
								</div>
							))}
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
