"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FeaturesGridComponent: React.FC = () => {
	const features = [
		{
			icon: "lucide:brain",
			title: "Apprentissage propulsé par l’IA",
			description:
				"Parcours d’apprentissage personnalisés grâce à une intelligence artificielle de pointe.",
			color: "blue",
		},
		{
			icon: "lucide:users-round",
			title: "Enseignants experts",
			description:
				"Apprenez auprès de leaders de l’industrie et de chercheurs de renommée mondiale.",
			color: "purple",
		},
		{
			icon: "lucide:briefcase",
			title: "Services de carrière",
			description:
				"Accompagnement complet : CV, préparation aux entretiens et insertion professionnelle.",
			color: "green",
		},
		{
			icon: "lucide:globe",
			title: "Réseau mondial",
			description:
				"Rejoignez une communauté d’étudiants et d’alumni présente dans plus de 40 pays.",
			color: "indigo",
		},
		{
			icon: "lucide:laptop",
			title: "Infrastructures modernes",
			description:
				"Laboratoires, bibliothèques et espaces collaboratifs à la pointe de l’innovation.",
			color: "orange",
		},
		{
			icon: "lucide:trending-up",
			title: "95% de taux de réussite",
			description:
				"Nos diplômés intègrent des entreprises de premier plan en moins de 6 mois.",
			color: "teal",
		},
	];

	const getColorClasses = (color: string) => {
		const colors = {
			blue: "text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20",
			purple: "text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20",
			green: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20",
			indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20",
			orange: "text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/20",
			teal: "text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-500/20",
		};
		return colors[color as keyof typeof colors] || colors.blue;
	};

	return (
		<section className="py-24 md:py-32 bg-background">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Pourquoi choisir{" "}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Campusnet
						</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Tout ce dont vous avez besoin pour réussir votre
						parcours académique et professionnel
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
						>
							<Card className="h-full hover:shadow-xl transition-all duration-300 border-border group hover:border-border/80">
								<CardHeader>
									<div
										className={`w-14 h-14 rounded-2xl ${getColorClasses(feature.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
									>
										<Icon
											icon={feature.icon}
											className="h-7 w-7"
										/>
									</div>
									<CardTitle className="text-2xl font-bold">
										{feature.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
