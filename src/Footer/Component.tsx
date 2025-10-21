import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";
import { CMSLink } from "@/components/Link";
import { Logo } from "@/components/Logo/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import type { Footer } from "@/payload-types";

import { ThemeSelector } from "@/providers/Theme/ThemeSelector";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { cn } from "@/utilities/ui";

export async function Footer() {
	const footerData: Footer = await getCachedGlobal("footer", 1)();

	const navItems = footerData?.navItems || [];

	const footerSections = [
		{
			title: "Academics",
			links: [
				{ label: "Programs", href: "/programs" },
				{ label: "Admissions", href: "/admissions" },
				{ label: "Academic Calendar", href: "/calendar" },
				{ label: "Course Catalog", href: "/courses" },
			],
		},
		{
			title: "Student Life",
			links: [
				{ label: "Campus Life", href: "/campus-life" },
				{ label: "Housing", href: "/housing" },
				{ label: "Dining", href: "/dining" },
				{ label: "Student Services", href: "/student-services" },
			],
		},
		{
			title: "Resources",
			links: [
				{ label: "Library", href: "/library" },
				{ label: "Career Services", href: "/career-services" },
				{ label: "Financial Aid", href: "/financial-aid" },
				{ label: "Alumni", href: "/alumni" },
			],
		},
		{
			title: "About",
			links: [
				{ label: "About Us", href: "/university" },
				{ label: "Faculty", href: "/faculty" },
				{ label: "News", href: "/news" },
				{ label: "Contact", href: "/contact" },
			],
		},
	];

	const socialLinks = [
		{ icon: "lucide:facebook", href: "#", label: "Facebook" },
		{ icon: "lucide:twitter", href: "#", label: "Twitter" },
		{ icon: "lucide:instagram", href: "#", label: "Instagram" },
		{ icon: "lucide:linkedin", href: "#", label: "LinkedIn" },
		{ icon: "lucide:youtube", href: "#", label: "YouTube" },
	];

	return (
		<footer className="bg-gray-900 text-white">
			{/* Newsletter Section */}
			<div className="bg-blue-600 py-12">
				<div className="container mx-auto px-4">
					<div className="text-center">
						<h3 className="text-2xl font-bold mb-2">
							Stay Updated
						</h3>
						<p className="text-blue-100 mb-6 max-w-2xl mx-auto">
							Subscribe to our newsletter for the latest news,
							events, and updates from Demo University.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
							<Input
								placeholder="Enter your email"
								className="bg-white text-gray-900"
								type="email"
							/>
							<Button className="bg-white text-blue-600 hover:bg-gray-100">
								<Icon
									icon="lucide:mail"
									className="w-4 h-4 mr-2"
								/>
								Subscribe
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Footer Content */}
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
					{/* University Info */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center mb-4">
							<Logo className="w-8 h-8 mr-3" />
							<div>
								<h2 className="text-xl font-bold">
									Demo University
								</h2>
								<p className="text-gray-400 text-sm">
									Excellence in Education
								</p>
							</div>
						</Link>
						<p className="text-gray-300 mb-6 max-w-sm">
							Empowering tomorrow&apos;s leaders through
							world-class education, innovative research, and
							transformative experiences.
						</p>
						<div className="flex space-x-4">
							{socialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
								>
									<Icon
										icon={social.icon}
										className="w-5 h-5"
									/>
								</a>
							))}
						</div>
					</div>

					{/* Footer Sections */}
					{footerSections.map((section) => (
						<div key={section.title}>
							<h3 className="font-semibold mb-4">
								{section.title}
							</h3>
							<ul className="space-y-3">
								{section.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="text-gray-300 hover:text-white transition-colors flex items-center group"
										>
											<Icon
												icon="lucide:chevron-right"
												className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
											/>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<Separator className="my-8 bg-gray-700" />

				{/* Bottom Footer */}
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
						<p className="text-gray-400 text-sm">
							© 2025 Demo University. All rights reserved.
						</p>
						<div className="flex space-x-6">
							<Link
								href="/privacy"
								className="text-gray-400 hover:text-white text-sm transition-colors"
							>
								Privacy Policy
							</Link>
							<Link
								href="/terms"
								className="text-gray-400 hover:text-white text-sm transition-colors"
							>
								Terms of Service
							</Link>
							<Link
								href="/accessibility"
								className="text-gray-400 hover:text-white text-sm transition-colors"
							>
								Accessibility
							</Link>
						</div>
					</div>

					<div className="mt-4 md:mt-0">
						<ThemeSelector />
					</div>
				</div>

				{/* Quick Stats */}
				<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-400">
							2,500+
						</div>
						<div className="text-gray-400 text-sm">Students</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-400">
							150+
						</div>
						<div className="text-gray-400 text-sm">Faculty</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-400">
							25+
						</div>
						<div className="text-gray-400 text-sm">Programs</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-400">
							95%
						</div>
						<div className="text-gray-400 text-sm">
							Success Rate
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
