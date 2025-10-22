import { Icon } from "@iconify/react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

import { ThemeSelector } from "@/providers/Theme/ThemeSelector";

export async function FooterComponent() {
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
	];

	return (
		<footer className="bg-gray-900 text-white">
			{/* Main Footer Content */}
			<div className="container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
					{/* University Info */}
					<div className="lg:col-span-2">
						<div className="flex items-center mb-4">
							{/* Custom University Logo */}
							<div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
								<svg
									className="w-5 h-5 text-white"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-label="University logo"
									role="img"
								>
									<title>University Logo</title>
									<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
								</svg>
							</div>
							<div>
								<h2 className="text-xl font-bold text-white">
									Campusnet University
								</h2>
								<p className="text-gray-400 text-sm">
									Excellence in Education
								</p>
							</div>
						</div>
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
									aria-label={social.label}
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
											className="text-gray-300 hover:text-white transition-colors"
										>
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
							© 2025 Campusnet University. All rights reserved.
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
