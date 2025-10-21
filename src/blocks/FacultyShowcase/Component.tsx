"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FacultyShowcaseData {
	title: string;
	subtitle: string;
	faculty?: Array<{
		name: string;
		title: string;
		department: string;
		avatar?: string;
		bio: string;
		education: string;
		email: string;
		experience: number;
		specializations?: Array<{
			specialization: string;
		}>;
	}>;
}

interface Props {
	block: FacultyShowcaseData;
}

export const FacultyShowcaseComponent: React.FC<Props> = ({ block }) => {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="py-20 bg-gray-50"
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
						{block.title || "Our Faculty"}
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						{block.subtitle ||
							"Meet our world-class faculty members"}
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{block.faculty?.map((member) => (
						<motion.div
							key={member.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1, duration: 0.6 }}
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
									<CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
										{member.name}
									</CardTitle>
									<div className="text-blue-600 font-medium">
										{member.title}
									</div>
									<div className="text-gray-600 text-sm">
										{member.department}
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 mb-4 line-clamp-3">
										{member.bio}
									</p>

									<div className="space-y-2 mb-4">
										<div className="flex items-center text-sm text-gray-500">
											<Icon
												icon="lucide:graduation-cap"
												className="mr-2"
											/>
											{member.education}
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<Icon
												icon="lucide:mail"
												className="mr-2"
											/>
											{member.email}
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<Icon
												icon="lucide:briefcase"
												className="mr-2"
											/>
											{member.experience} years experience
										</div>
									</div>

									<div className="flex flex-wrap gap-2 mb-4">
										{member.specializations?.map((spec) => (
											<Badge
												key={spec.specialization}
												variant="secondary"
												className="text-xs"
											>
												{spec.specialization}
											</Badge>
										))}
									</div>

									<div className="flex space-x-2">
										<Button
											variant="outline"
											size="sm"
											className="flex-1"
										>
											<Icon
												icon="lucide:mail"
												className="mr-1"
											/>
											Contact
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="flex-1"
										>
											<Icon
												icon="lucide:user"
												className="mr-1"
											/>
											Profile
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
						<Icon icon="lucide:users" className="mr-2" />
						Meet All Faculty
					</Button>
				</motion.div>
			</div>
		</motion.section>
	);
};
