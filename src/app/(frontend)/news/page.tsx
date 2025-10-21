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
			image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
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
			image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
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
			image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop",
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
			image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
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
			image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
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
			image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=250&fit=crop",
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
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Hero Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-20"
			>
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-5xl md:text-6xl font-bold mb-6">
						University News
					</h1>
					<p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
						Stay updated with the latest news, research
						breakthroughs, and campus events
					</p>
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
								<p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
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
										width={400}
										height={250}
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
									<p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
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
				className="bg-gray-900 dark:bg-gray-800 text-white py-16"
			>
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
					<p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
						Subscribe to our newsletter for the latest news,
						research updates, and campus events
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
