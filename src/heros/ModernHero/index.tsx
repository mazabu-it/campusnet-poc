"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ModernHeroProps {
	title: string;
	subtitle?: string;
	primaryCTA?: {
		label: string;
		href: string;
	};
	secondaryCTA?: {
		label: string;
		href: string;
	};
	stats?: Array<{
		value: string;
		label: string;
	}>;
}

export const ModernHero: React.FC<ModernHeroProps> = ({
	title,
	subtitle,
	primaryCTA,
	secondaryCTA,
	stats,
}) => {
	return (
		<section className="relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
			
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex min-h-[600px] flex-col items-center justify-center py-20 text-center">
					{/* Main Content */}
					<div className="max-w-3xl space-y-8">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
							{title}
						</h1>
						
						{subtitle && (
							<p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
								{subtitle}
							</p>
						)}

						{/* CTAs */}
						{(primaryCTA || secondaryCTA) && (
							<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
								{primaryCTA && (
									<Button size="lg" asChild>
										<Link href={primaryCTA.href}>
											{primaryCTA.label}
											<Icon
												icon="lucide:arrow-right"
												className="ml-2 h-4 w-4"
											/>
										</Link>
									</Button>
								)}
								{secondaryCTA && (
									<Button size="lg" variant="outline" asChild>
										<Link href={secondaryCTA.href}>
											{secondaryCTA.label}
										</Link>
									</Button>
								)}
							</div>
						)}
					</div>

					{/* Stats */}
					{stats && stats.length > 0 && (
						<div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
							{stats.map((stat) => (
								<div
									key={stat.label}
									className="flex flex-col items-center justify-center space-y-2 border-l border-border pl-4 first:border-l-0 first:pl-0"
								>
									<div className="text-3xl font-bold">{stat.value}</div>
									<div className="text-sm text-muted-foreground">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

