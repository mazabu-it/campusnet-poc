"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Header } from "@/payload-types";
import { useHeaderTheme } from "@/providers/HeaderTheme";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/utilities/ui";

interface HeaderClientProps {
	data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data: _data }) => {
	/* Storing the value in a useState to avoid hydration errors */
	const [theme, setTheme] = useState<string | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { headerTheme, setHeaderTheme } = useHeaderTheme();
	const pathname = usePathname();
	const { user } = useAppStore();

	useEffect(() => {
		setHeaderTheme(null);
	}, [setHeaderTheme]);

	useEffect(() => {
		if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
	}, [headerTheme, theme]);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Role-aware dashboard link
	const getDashboardHref = () => {
		if (!user.user) return "/login";
		if (
			user.user.role === "professor" ||
			user.user.role === "faculty-staff"
		) {
			return "/professor";
		}
		return "/dashboard";
	};

	const navigationItems = [
		{ label: "Home", href: "/", icon: "lucide:home" },
		{ label: "University", href: "/university", icon: "lucide:building" },
		{ label: "Programs", href: "/programs", icon: "lucide:graduation-cap" },
		{ label: "Faculty", href: "/faculty", icon: "lucide:users" },
		{ label: "News", href: "/news", icon: "lucide:newspaper" },
		{
			label: "Dashboard",
			href: getDashboardHref(),
			icon: "lucide:bar-chart-3",
		},
	];

	return (
		<motion.header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
				isScrolled
					? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700"
					: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
			)}
			{...(theme ? { "data-theme": theme } : {})}
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between py-4">
					{/* Logo */}
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Link href="/" className="flex items-center space-x-2">
							<Logo loading="eager" priority="high" />
						</Link>
					</motion.div>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center space-x-1">
						{navigationItems.map((item, index) => (
							<motion.div
								key={item.href}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Link
									href={item.href}
									className={cn(
										"px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
										pathname === item.href
											? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
											: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50",
									)}
								>
									{item.label}
								</Link>
							</motion.div>
						))}
					</nav>

					{/* Action Buttons */}
					<div className="hidden lg:flex items-center space-x-3">
						<Button variant="ghost" size="sm" asChild>
							<Link
								href="/login"
								className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							>
								Sign in
							</Link>
						</Button>
						<Button
							size="sm"
							asChild
							className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
						>
							<Link href="/registration">Get started</Link>
						</Button>
					</div>

					{/* Mobile Menu */}
					<Sheet
						open={isMobileMenuOpen}
						onOpenChange={setIsMobileMenuOpen}
					>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="lg:hidden"
							>
								<Icon icon="lucide:menu" className="w-5 h-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-80">
							<div className="flex flex-col space-y-6 mt-8">
								<div className="flex items-center space-x-2 pb-4 border-b">
									<Logo className="w-8 h-8" />
									<div>
										<h2 className="font-bold text-lg">
											Demo University
										</h2>
										<p className="text-sm text-gray-600">
											Excellence in Education
										</p>
									</div>
								</div>

								<nav className="flex flex-col space-y-2">
									{navigationItems.map((item) => (
										<Link
											key={item.href}
											href={item.href}
											onClick={() =>
												setIsMobileMenuOpen(false)
											}
											className={cn(
												"flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
												pathname === item.href
													? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
													: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
											)}
										>
											<Icon
												icon={item.icon}
												className="w-5 h-5"
											/>
											<span className="font-medium">
												{item.label}
											</span>
											{item.label === "News" && (
												<Badge
													variant="secondary"
													className="ml-auto text-xs"
												>
													New
												</Badge>
											)}
										</Link>
									))}
								</nav>

								<div className="pt-4 border-t space-y-3">
									<Button
										variant="outline"
										className="w-full"
										asChild
									>
										<Link
											href="/login"
											onClick={() =>
												setIsMobileMenuOpen(false)
											}
										>
											<Icon
												icon="lucide:log-in"
												className="w-4 h-4 mr-2"
											/>
											Login
										</Link>
									</Button>
									<Button className="w-full" asChild>
										<Link
											href="/registration"
											onClick={() =>
												setIsMobileMenuOpen(false)
											}
										>
											<Icon
												icon="lucide:user-plus"
												className="w-4 h-4 mr-2"
											/>
											Apply Now
										</Link>
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</motion.header>
	);
};
