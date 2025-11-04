"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export const TestimonialsComponent: React.FC = () => {
	const testimonials = [
		{
			name: "Christelle Mbemba",
			role: "Ingénieure logicielle chez Google",
			avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
			quote: "Campusnet a transformé ma carrière. Les projets pratiques et le mentorat d'experts m'ont parfaitement préparée pour l'industrie technologique.",
			rating: 5,
		},
		{
			name: "Moïse Ilunga",
			role: "Data Scientist chez Meta",
			avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
			quote: "Le programme est à la pointe de la technologie et les enseignants sont de classe mondiale. J'ai décroché mon emploi de rêve dans les 3 mois suivant ma graduation.",
			rating: 5,
		},
		{
			name: "Merveille Kasongo",
			role: "Designer UX chez Apple",
			avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
			quote: "L'environnement collaboratif et les installations modernes ont rendu l'apprentissage agréable. La meilleure décision de ma vie !",
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
						Aimé par des{" "}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							milliers
						</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Découvrez ce que nos étudiants et anciens élèves pensent de
						leur expérience
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
