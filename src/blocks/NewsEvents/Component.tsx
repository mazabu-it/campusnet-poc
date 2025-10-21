"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
interface NewsEventsData {
	title: string;
	subtitle: string;
	items?: Array<{
		type: "news" | "event";
		title: string;
		excerpt: string;
		date: string;
		location: string;
	}>;
}

interface Props {
	block: NewsEventsData;
}

export const NewsEventsComponent: React.FC<Props> = ({ block }) => {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="py-20 bg-white"
		>
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2, duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						{block.title}
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						{block.subtitle}
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{block.items?.map((item, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
						>
							<Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
								<CardHeader className="pb-4">
									<div className="flex items-center justify-between mb-4">
										<Badge 
											variant={item.type === 'news' ? 'default' : 'secondary'}
											className={item.type === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
										>
											<Icon 
												icon={item.type === 'news' ? 'lucide:newspaper' : 'lucide:calendar'} 
												className="mr-1" 
											/>
											{item.type === 'news' ? 'News' : 'Event'}
										</Badge>
										<span className="text-sm text-gray-500">
											{format(new Date(item.date), 'MMM dd, yyyy')}
										</span>
									</div>
									<CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
										{item.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 mb-4 line-clamp-3">
										{item.excerpt}
									</p>
									<div className="flex items-center justify-between">
										<div className="flex items-center text-sm text-gray-500">
											<Icon icon="lucide:map-pin" className="mr-1" />
											{item.location}
										</div>
										<Button variant="ghost" size="sm" className="group-hover:text-blue-600 transition-colors duration-300">
											Read More
											<Icon icon="lucide:arrow-right" className="ml-1" />
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className="text-center mt-12"
				>
					<Button size="lg" variant="outline" className="px-8 py-4">
						<Icon icon="lucide:newspaper" className="mr-2" />
						View All News & Events
					</Button>
				</motion.div>
			</div>
		</motion.section>
	);
};
