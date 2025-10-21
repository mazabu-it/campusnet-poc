"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { DashboardStatsComponent } from "@/blocks/DashboardStats/Component";
import { FacultyShowcaseComponent } from "@/blocks/FacultyShowcase/Component";
import { NewsEventsComponent } from "@/blocks/NewsEvents/Component";
import { ProgramsShowcaseComponent } from "@/blocks/ProgramsShowcase/Component";
import { RegistrationFormComponent } from "@/blocks/RegistrationForm/Component";
import { UniversityHeroComponent } from "@/blocks/UniversityHero/Component";

// Sample data for demonstration
const heroData = {
	title: "Welcome to Campusnet University",
	subtitle:
		"Empowering the next generation of leaders through innovative education, cutting-edge research, and transformative experiences.",
	primaryButtonText: "Apply Now",
	secondaryButtonText: "Virtual Tour",
	stats: [
		{
			icon: "lucide:users",
			value: "15,000+",
			label: "Students",
		},
		{
			icon: "lucide:graduation-cap",
			value: "500+",
			label: "Faculty",
		},
		{
			icon: "lucide:book-open",
			value: "200+",
			label: "Programs",
		},
	],
};

const programsData = {
	title: "Explore Our Programs",
	subtitle:
		"Discover a wide range of undergraduate and graduate programs designed to prepare you for success in today's dynamic world.",
	programs: [
		{
			name: "Computer Science",
			description:
				"Master the fundamentals of computing and software development with hands-on projects and industry partnerships.",
			icon: "lucide:laptop",
			level: "Bachelor",
			duration: "4 years",
			credits: 120,
			studentCount: "800+",
		},
		{
			name: "Business Administration",
			description:
				"Develop leadership skills and business acumen through real-world case studies and internships.",
			icon: "lucide:briefcase",
			level: "Master",
			duration: "2 years",
			credits: 60,
			studentCount: "300+",
		},
		{
			name: "Engineering",
			description:
				"Build innovative solutions to complex problems with state-of-the-art facilities and expert faculty.",
			icon: "lucide:cog",
			level: "Bachelor",
			duration: "4 years",
			credits: 128,
			studentCount: "600+",
		},
	],
};

const registrationData = {
	title: "Start Your Journey",
	subtitle:
		"Join thousands of students who have chosen Campusnet University for their academic and professional success.",
	programs: [
		{ label: "Computer Science", value: "cs" },
		{ label: "Business Administration", value: "business" },
		{ label: "Engineering", value: "engineering" },
		{ label: "Liberal Arts", value: "liberal-arts" },
	],
	academicYears: [
		{ label: "2024-2025", value: "2024-2025" },
		{ label: "2025-2026", value: "2025-2026" },
		{ label: "2026-2027", value: "2026-2027" },
	],
};

const dashboardData = {
	title: "University Statistics",
	subtitle:
		"See how our university is growing and making an impact in education and research.",
	metrics: [
		{
			label: "Total Students",
			value: "15,247",
			icon: "lucide:users",
			trend: "up" as const,
			change: "+8.2%",
		},
		{
			label: "Graduation Rate",
			value: "94%",
			icon: "lucide:graduation-cap",
			trend: "up" as const,
			change: "+2.1%",
		},
		{
			label: "Research Funding",
			value: "$45M",
			icon: "lucide:dollar-sign",
			trend: "up" as const,
			change: "+12.5%",
		},
		{
			label: "Faculty Ratio",
			value: "1:15",
			icon: "lucide:user-check",
			trend: "up" as const,
			change: "+0.3",
		},
	],
	enrollmentData: [
		{ month: "Jan", enrollments: 1200 },
		{ month: "Feb", enrollments: 1350 },
		{ month: "Mar", enrollments: 1420 },
		{ month: "Apr", enrollments: 1580 },
		{ month: "May", enrollments: 1650 },
		{ month: "Jun", enrollments: 1720 },
	],
	programData: [
		{ name: "Computer Science", value: 35 },
		{ name: "Engineering", value: 25 },
		{ name: "Business", value: 20 },
		{ name: "Liberal Arts", value: 15 },
		{ name: "Other", value: 5 },
	],
	goals: [
		{
			name: "Student Satisfaction",
			description: "Maintain high student satisfaction ratings",
			progress: 92,
		},
		{
			name: "Research Excellence",
			description: "Increase research publications and citations",
			progress: 78,
		},
		{
			name: "Community Impact",
			description: "Expand community outreach programs",
			progress: 85,
		},
	],
};

const newsEventsData = {
	title: "Latest News & Events",
	subtitle:
		"Stay updated with the latest happenings at Campusnet University.",
	items: [
		{
			type: "news" as const,
			title: "New AI Research Center Opens",
			excerpt:
				"Campusnet University launches a state-of-the-art AI research facility with $10M funding.",
			date: "2024-01-15",
			location: "Main Campus",
		},
		{
			type: "event" as const,
			title: "Annual Career Fair 2024",
			excerpt:
				"Join us for the biggest career fair of the year with 200+ companies and organizations.",
			date: "2024-02-20",
			location: "Student Center",
		},
		{
			type: "news" as const,
			title: "Student Wins National Competition",
			excerpt:
				"Computer Science student Sarah Johnson wins the National Programming Championship.",
			date: "2024-01-10",
			location: "Washington DC",
		},
	],
};

const facultyData = {
	title: "Meet Our Faculty",
	subtitle:
		"Learn from world-class educators and researchers who are passionate about your success.",
	faculty: [
		{
			name: "Dr. Sarah Chen",
			title: "Professor of Computer Science",
			department: "Computer Science",
			avatar: "",
			bio: "Leading researcher in artificial intelligence and machine learning with over 15 years of experience.",
			education: "PhD in Computer Science, MIT",
			email: "sarah.chen@campusnet.edu",
			experience: 15,
			specializations: [
				{ specialization: "AI" },
				{ specialization: "Machine Learning" },
				{ specialization: "Data Science" },
			],
		},
		{
			name: "Prof. Michael Rodriguez",
			title: "Dean of Business School",
			department: "Business Administration",
			avatar: "",
			bio: "Former Fortune 500 executive with expertise in strategic management and entrepreneurship.",
			education: "MBA, Harvard Business School",
			email: "michael.rodriguez@campusnet.edu",
			experience: 20,
			specializations: [
				{ specialization: "Strategy" },
				{ specialization: "Entrepreneurship" },
				{ specialization: "Leadership" },
			],
		},
		{
			name: "Dr. Emily Watson",
			title: "Professor of Engineering",
			department: "Engineering",
			avatar: "",
			bio: "Renowned engineer specializing in sustainable technology and renewable energy systems.",
			education: "PhD in Mechanical Engineering, Stanford",
			email: "emily.watson@campusnet.edu",
			experience: 12,
			specializations: [
				{ specialization: "Renewable Energy" },
				{ specialization: "Sustainability" },
				{ specialization: "Mechanical Design" },
			],
		},
	],
};

export default function UniversityHomepage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<UniversityHeroComponent block={heroData} />

			{/* Programs Showcase */}
			<ProgramsShowcaseComponent block={programsData} />

			{/* Registration Form */}
			<RegistrationFormComponent block={registrationData} />

			{/* Dashboard Stats */}
			<DashboardStatsComponent block={dashboardData} />

			{/* News & Events */}
			<NewsEventsComponent block={newsEventsData} />

			{/* Faculty Showcase */}
			<FacultyShowcaseComponent block={facultyData} />

			{/* Footer */}
			<motion.footer
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="bg-gray-900 text-white py-16"
			>
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-xl font-bold mb-4">
								Campusnet University
							</h3>
							<p className="text-gray-400 mb-4">
								Empowering the next generation of leaders
								through innovative education.
							</p>
							<div className="flex space-x-4">
								<Icon
									icon="lucide:facebook"
									className="text-2xl hover:text-blue-400 cursor-pointer"
								/>
								<Icon
									icon="lucide:twitter"
									className="text-2xl hover:text-blue-400 cursor-pointer"
								/>
								<Icon
									icon="lucide:linkedin"
									className="text-2xl hover:text-blue-400 cursor-pointer"
								/>
								<Icon
									icon="lucide:instagram"
									className="text-2xl hover:text-blue-400 cursor-pointer"
								/>
							</div>
						</div>
						<div>
							<h4 className="text-lg font-semibold mb-4">
								Quick Links
							</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="/admissions"
										className="hover:text-white"
									>
										Admissions
									</a>
								</li>
								<li>
									<a
										href="/programs"
										className="hover:text-white"
									>
										Programs
									</a>
								</li>
								<li>
									<a
										href="/financial-aid"
										className="hover:text-white"
									>
										Financial Aid
									</a>
								</li>
								<li>
									<a
										href="/campus-life"
										className="hover:text-white"
									>
										Campus Life
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-lg font-semibold mb-4">
								Academics
							</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="/undergraduate"
										className="hover:text-white"
									>
										Undergraduate
									</a>
								</li>
								<li>
									<a
										href="/graduate"
										className="hover:text-white"
									>
										Graduate
									</a>
								</li>
								<li>
									<a
										href="/research"
										className="hover:text-white"
									>
										Research
									</a>
								</li>
								<li>
									<a
										href="/libraries"
										className="hover:text-white"
									>
										Libraries
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-lg font-semibold mb-4">
								Contact
							</h4>
							<div className="space-y-2 text-gray-400">
								<div className="flex items-center">
									<Icon
										icon="lucide:map-pin"
										className="mr-2"
									/>
									123 University Ave, Campus City
								</div>
								<div className="flex items-center">
									<Icon
										icon="lucide:phone"
										className="mr-2"
									/>
									(555) 123-4567
								</div>
								<div className="flex items-center">
									<Icon icon="lucide:mail" className="mr-2" />
									info@campusnet.edu
								</div>
							</div>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>
							&copy; 2024 Campusnet University. All rights
							reserved.
						</p>
					</div>
				</div>
			</motion.footer>
		</div>
	);
}
