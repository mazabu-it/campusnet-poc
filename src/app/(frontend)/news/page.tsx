"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewsPage() {
	const newsItems = [
		{
			id: 1,
			title: "New AI Research Lab Opens at Campusnet University",
			excerpt:
				"The university announces the opening of a state-of-the-art AI research facility with cutting-edge equipment and world-class researchers.",
			date: "2024-01-15",
			category: "Research",
			image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
			author: "Dr. Sarah Johnson",
			readTime: "5 min read",
		},
		{
			id: 2,
			title: "Student Hackathon Results in Innovative Solutions",
			excerpt:
				"Over 200 students participated in the annual hackathon, creating innovative solutions for real-world problems in healthcare and sustainability.",
			date: "2024-01-12",
			category: "Events",
			image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
			author: "Tech Team",
			readTime: "3 min read",
		},
		{
			id: 3,
			title: "University Partners with Leading Tech Companies",
			excerpt:
				"Campusnet University announces strategic partnerships with major tech companies to provide students with internship and job opportunities.",
			date: "2024-01-10",
			category: "Partnerships",
			image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
			author: "Partnership Office",
			readTime: "4 min read",
		},
		{
			id: 4,
			title: "New Scholarship Program for Underrepresented Students",
			excerpt:
				"The university launches a comprehensive scholarship program aimed at increasing diversity in STEM fields and supporting underrepresented students.",
			date: "2024-01-08",
			category: "Scholarships",
			image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
			author: "Financial Aid Office",
			readTime: "6 min read",
		},
		{
			id: 5,
			title: "Faculty Research Published in Top Journals",
			excerpt:
				"Several faculty members have had their research published in prestigious academic journals, contributing to the university's growing reputation.",
			date: "2024-01-05",
			category: "Research",
			image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
			author: "Research Office",
			readTime: "7 min read",
		},
		{
			id: 6,
			title: "Campus Sustainability Initiative Reaches New Milestone",
			excerpt:
				"The university's sustainability program has achieved carbon neutrality, making it one of the greenest campuses in the region.",
			date: "2024-01-03",
			category: "Sustainability",
			image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
			author: "Sustainability Team",
			readTime: "5 min read",
		},
	];

	const categories = [
		"All",
		"Research",
		"Events",
		"Partnerships",
		"Scholarships",
		"Sustainability",
	];

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
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-blue-500/5 to-transparent dark:from-indigo-500/10 dark:via-blue-500/10" />

				{/* Decorative elements */}
				<div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl" />
				<div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />

				<div className="container mx-auto px-4 text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}
					>
						<Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
							<Icon
								icon="lucide:newspaper"
								className="mr-2 h-4 w-4"
							/>
							Latest Updates
						</Badge>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
					>
						Campus
						<span className="block mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
							News & Events
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.6 }}
						className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
					>
						Stay connected with research breakthroughs and community
						stories
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
								icon: "lucide:newspaper",
								label: "Stories Published",
								value: "500+",
							},
							{
								icon: "lucide:calendar",
								label: "Events This Year",
								value: "150+",
							},
							{
								icon: "lucide:trending-up",
								label: "Research Papers",
								value: "200+",
							},
						].map((stat) => (
							<div key={stat.label} className="text-center">
								<div className="flex items-center justify-center gap-2 text-foreground font-bold text-2xl mb-1">
									<Icon
										icon={stat.icon}
										className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
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

			{/* Filter Categories */}
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-wrap gap-2 justify-center mb-8">
					{categories.map((category) => (
						<Button
							key={category}
							variant={category === "All" ? "default" : "outline"}
							size="sm"
							className="rounded-full"
						>
							{category}
						</Button>
					))}
				</div>

				{/* Featured Article */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-12"
				>
					<Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
						<div className="md:flex">
							<div className="md:w-1/2">
								<Image
									src={newsItems[0].image}
									alt={newsItems[0].title}
									width={400}
									height={250}
									className="w-full h-64 md:h-full object-cover"
								/>
							</div>
							<div className="md:w-1/2 p-8">
								<div className="flex items-center gap-2 mb-4">
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-800"
									>
										{newsItems[0].category}
									</Badge>
									<span className="text-sm text-gray-500">
										{newsItems[0].readTime}
									</span>
								</div>
								<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
									{newsItems[0].title}
								</h2>
								<p className="text-muted-foreground mb-6 text-lg">
									{newsItems[0].excerpt}
								</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-gray-300 rounded-full"></div>
										<div>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{newsItems[0].author}
											</p>
											<p className="text-xs text-gray-500">
												{new Date(
													newsItems[0].date,
												).toLocaleDateString()}
											</p>
										</div>
									</div>
									<Button>
										Read More
										<Icon
											icon="lucide:arrow-right"
											className="ml-2"
										/>
									</Button>
								</div>
							</div>
						</div>
					</Card>
				</motion.div>

				{/* News Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{newsItems.slice(1).map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
						>
							<Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
								<div className="relative">
									<Image
										src={item.image}
										alt={item.title}
										width={1200}
										height={800}
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="w-full h-48 object-cover"
									/>
									<div className="absolute top-4 left-4">
										<Badge
											variant="secondary"
											className="bg-white/90 text-gray-900"
										>
											{item.category}
										</Badge>
									</div>
								</div>
								<CardContent className="p-6">
									<div className="flex items-center gap-2 mb-3">
										<span className="text-sm text-gray-500">
											{item.readTime}
										</span>
										<span className="text-gray-300">•</span>
										<span className="text-sm text-gray-500">
											{new Date(
												item.date,
											).toLocaleDateString()}
										</span>
									</div>
									<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
										{item.title}
									</h3>
									<p className="text-muted-foreground mb-4 line-clamp-3">
										{item.excerpt}
									</p>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-6 h-6 bg-gray-300 rounded-full"></div>
											<span className="text-sm text-gray-500">
												{item.author}
											</span>
										</div>
										<Button variant="ghost" size="sm">
											Read More
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>

			{/* Newsletter CTA */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="bg-card text-card-foreground py-16"
			>
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Subscribe to our newsletter for the latest news,
						research updates, and campus events
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<Button className="bg-blue-600 hover:bg-blue-700">
							Subscribe
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
