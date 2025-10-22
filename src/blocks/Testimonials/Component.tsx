"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export const TestimonialsComponent: React.FC = () => {
	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "Software Engineer at Google",
			avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
			quote: "Campusnet transformed my career. The hands-on projects and expert mentorship prepared me perfectly for the tech industry.",
			rating: 5,
		},
		{
			name: "Michael Chen",
			role: "Data Scientist at Meta",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			quote: "The curriculum is cutting-edge and the faculty are world-class. I landed my dream job within 3 months of graduating.",
			rating: 5,
		},
		{
			name: "Emily Rodriguez",
			role: "UX Designer at Apple",
			avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
			quote: "The collaborative environment and modern facilities made learning enjoyable. Best decision of my life!",
			rating: 5,
		},
	];

	return (
		<section className="py-24 md:py-32 bg-muted/30">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Loved By{" "}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Thousands
						</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Hear what our students and alumni have to say about
						their experience
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
						>
							<Card className="h-full hover:shadow-xl transition-all duration-300 bg-card border-border">
								<CardContent className="p-6">
									{/* Stars */}
									<div className="flex gap-1 mb-4">
										{[...Array(testimonial.rating)].map(
											(_, i) => (
												<Icon
													key={`star-${testimonial.name}-${i}`}
													icon="lucide:star"
													className="h-5 w-5 text-yellow-500 fill-yellow-500"
												/>
											),
										)}
									</div>

									{/* Quote */}
									<p className="text-muted-foreground mb-6 leading-relaxed">
										"{testimonial.quote}"
									</p>

									{/* Author */}
									<div className="flex items-center gap-4">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={testimonial.avatar}
												alt={testimonial.name}
											/>
											<AvatarFallback>
												{testimonial.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-semibold text-foreground">
												{testimonial.name}
											</div>
											<div className="text-sm text-muted-foreground">
												{testimonial.role}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
