import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export async function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		about: [
			{ label: "About Us", href: "/university" },
			{ label: "Programs", href: "/programs" },
			{ label: "Faculty", href: "/faculty" },
			{ label: "News & Events", href: "/news" },
		],
		support: [
			{ label: "Contact", href: "/contact" },
			{ label: "FAQ", href: "/faq" },
			{ label: "Help Center", href: "/help" },
			{ label: "Terms", href: "/terms" },
		],
		connect: [
			{ label: "LinkedIn", href: "#", icon: "lucide:linkedin" },
			{ label: "Twitter", href: "#", icon: "lucide:twitter" },
			{ label: "Facebook", href: "#", icon: "lucide:facebook" },
			{ label: "Instagram", href: "#", icon: "lucide:instagram" },
		],
	};

	return (
		<footer className="w-full border-t border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
					{/* Brand Column */}
					<div className="space-y-4">
						<Link
							href="/"
							className="flex items-center space-x-2 text-lg font-semibold"
						>
							<Icon icon="lucide:graduation-cap" className="h-6 w-6" />
							<span>Campusnet</span>
						</Link>
						<p className="text-sm text-muted-foreground max-w-xs">
							Excellence in education, empowering tomorrow's leaders
							through innovative learning.
						</p>
					</div>

					{/* About Links */}
					<div>
						<h3 className="mb-4 text-sm font-semibold">About</h3>
						<ul className="space-y-3">
							{footerLinks.about.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support Links */}
					<div>
						<h3 className="mb-4 text-sm font-semibold">Support</h3>
						<ul className="space-y-3">
							{footerLinks.support.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Connect Links */}
					<div>
						<h3 className="mb-4 text-sm font-semibold">Connect</h3>
						<ul className="space-y-3">
							{footerLinks.connect.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.icon && (
											<Icon icon={link.icon} className="h-4 w-4" />
										)}
										<span>{link.label}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 md:flex-row">
					<p className="text-sm text-muted-foreground">
						© {currentYear} Campusnet University. All rights reserved.
					</p>
					<div className="flex items-center space-x-4">
						<Link
							href="/privacy"
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							Privacy
						</Link>
						<Link
							href="/terms"
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							Terms
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
