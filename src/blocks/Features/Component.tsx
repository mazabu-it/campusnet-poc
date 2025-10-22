"use client";

import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
	icon: string;
	title: string;
	description: string;
}

interface FeaturesBlockProps {
	block: {
		title?: string;
		subtitle?: string;
		features?: Feature[];
	};
}

export const FeaturesComponent: React.FC<FeaturesBlockProps> = ({ block }) => {
	const {
		title = "Why Choose Us",
		subtitle = "Everything you need for academic excellence",
		features = [],
	} = block;

	return (
		<section className="py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						{title}
					</h2>
					{subtitle && (
						<p className="mt-4 text-lg text-muted-foreground">
							{subtitle}
						</p>
					)}
				</div>

				{/* Features Grid */}
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
						{features.map((feature) => (
							<Card
								key={feature.title}
								className="group relative overflow-hidden transition-all hover:shadow-lg"
							>
								<CardContent className="p-6">
									<dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
											<Icon
												icon={feature.icon}
												className="h-6 w-6 text-primary"
											/>
										</div>
										<span>{feature.title}</span>
									</dt>
									<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
										<p className="flex-auto">{feature.description}</p>
									</dd>
								</CardContent>
							</Card>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
};

