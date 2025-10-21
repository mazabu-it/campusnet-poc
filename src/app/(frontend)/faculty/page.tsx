"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FacultyPage() {
	const faculty = [
		{
			id: 1,
			name: "Dr. Sarah Johnson",
			title: "Professor of Computer Science",
			department: "Computer Science",
			avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
			bio: "Leading researcher in artificial intelligence and machine learning with over 15 years of experience.",
			education: "PhD in Computer Science, MIT",
			email: "sarah.johnson@university.edu",
			experience: 15,
			specializations: [
				"Machine Learning",
				"Deep Learning",
				"Computer Vision",
			],
			research: "AI Ethics and Responsible AI Development",
		},
		{
			id: 2,
			name: "Dr. Michael Chen",
			title: "Associate Professor of Software Engineering",
			department: "Software Engineering",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			bio: "Expert in software architecture and distributed systems with extensive industry experience.",
			education: "PhD in Software Engineering, Stanford",
			email: "michael.chen@university.edu",
			experience: 12,
			specializations: [
				"Software Architecture",
				"Distributed Systems",
				"Cloud Computing",
			],
			research: "Scalable Software Systems and Microservices",
		},
		{
			id: 3,
			name: "Dr. Emily Rodriguez",
			title: "Assistant Professor of Data Science",
			department: "Data Science",
			avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
			bio: "Data science researcher focusing on big data analytics and statistical modeling.",
			education: "PhD in Statistics, Harvard",
			email: "emily.rodriguez@university.edu",
			experience: 8,
			specializations: [
				"Big Data",
				"Statistical Modeling",
				"Data Visualization",
			],
			research: "Predictive Analytics and Business Intelligence",
		},
		{
			id: 4,
			name: "Dr. James Wilson",
			title: "Professor of Cybersecurity",
			department: "Information Security",
			avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			bio: "Cybersecurity expert with extensive experience in network security and cryptography.",
			education: "PhD in Computer Science, Carnegie Mellon",
			email: "james.wilson@university.edu",
			experience: 18,
			specializations: [
				"Network Security",
				"Cryptography",
				"Digital Forensics",
			],
			research: "Advanced Threat Detection and Response",
		},
		{
			id: 5,
			name: "Dr. Lisa Thompson",
			title: "Associate Professor of Human-Computer Interaction",
			department: "Computer Science",
			avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
			bio: "UX researcher specializing in user experience design and accessibility.",
			education: "PhD in Human-Computer Interaction, UC Berkeley",
			email: "lisa.thompson@university.edu",
			experience: 10,
			specializations: ["UX Design", "Accessibility", "User Research"],
			research: "Inclusive Design and Digital Accessibility",
		},
		{
			id: 6,
			name: "Dr. Robert Kim",
			title: "Professor of Database Systems",
			department: "Computer Science",
			avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
			bio: "Database systems expert with focus on distributed databases and data management.",
			education: "PhD in Computer Science, University of Washington",
			email: "robert.kim@university.edu",
			experience: 20,
			specializations: [
				"Database Systems",
				"Data Management",
				"Distributed Computing",
			],
			research: "Next-Generation Database Technologies",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Hero Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20"
			>
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-5xl md:text-6xl font-bold mb-6">
						Our Faculty
					</h1>
					<p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
						Meet our world-class faculty members who are leading
						experts in their fields
					</p>
				</div>
			</motion.div>

			{/* Faculty Grid */}
			<div className="container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{faculty.map((member, index) => (
						<motion.div
							key={member.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
						>
							<Card className="h-full hover:shadow-xl transition-all duration-300 group">
								<CardHeader className="text-center pb-4">
									<Avatar className="w-24 h-24 mx-auto mb-4">
										<AvatarImage
											src={member.avatar}
											alt={member.name}
										/>
										<AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
										{member.name}
									</CardTitle>
									<div className="text-blue-600 font-medium">
										{member.title}
									</div>
									<div className="text-gray-600 dark:text-gray-400 text-sm">
										{member.department}
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
										{member.bio}
									</p>

									<div className="space-y-2 mb-4">
										<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
											<Icon
												icon="lucide:graduation-cap"
												className="mr-2"
											/>
											{member.education}
										</div>
										<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
											<Icon
												icon="lucide:mail"
												className="mr-2"
											/>
											{member.email}
										</div>
										<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
											<Icon
												icon="lucide:briefcase"
												className="mr-2"
											/>
											{member.experience} years experience
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
												Specializations
											</h4>
											<div className="flex flex-wrap gap-1">
												{member.specializations.map(
													(spec) => (
														<Badge
															key={spec}
															variant="secondary"
															className="text-xs"
														>
															{spec}
														</Badge>
													),
												)}
											</div>
										</div>

										<div>
											<h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">
												Current Research
											</h4>
											<p className="text-xs text-gray-600 dark:text-gray-400">
												{member.research}
											</p>
										</div>
									</div>

									<Button
										className="w-full mt-4"
										variant="outline"
										size="sm"
									>
										<Icon
											icon="lucide:user-plus"
											className="mr-2"
										/>
										View Profile
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>

			{/* Stats Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="bg-gray-900 dark:bg-gray-800 text-white py-16"
			>
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
						<div>
							<div className="text-4xl font-bold text-blue-400 mb-2">
								50+
							</div>
							<div className="text-gray-300">Faculty Members</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-green-400 mb-2">
								95%
							</div>
							<div className="text-gray-300">PhD Holders</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-purple-400 mb-2">
								15+
							</div>
							<div className="text-gray-300">
								Average Years Experience
							</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-orange-400 mb-2">
								200+
							</div>
							<div className="text-gray-300">
								Research Publications
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
