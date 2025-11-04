"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/providers/Theme/ThemeSelector";
import { useAppStore, useUserStore } from "@/stores/app-store";

export interface HeaderClientProps {
	data: {
		navItems: Array<{
			link: {
				type: "reference" | "custom";
				label: string;
				url?: string;
				reference?: {
					value: {
						slug: string;
					};
				};
			};
		}>;
	};
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data: _data }) => {
	const pathname = usePathname();
	const { user } = useAppStore();
	const { logout: logoutStore } = useUserStore();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/users/logout", {
				method: "POST",
				credentials: "include",
			});

			if (response.ok) {
				logoutStore();
				window.location.href = "/";
			} else {
				console.error("Logout failed:", await response.text());
			}
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	// Navigation items - clean and minimal
	const navItems = [
		{ href: "/", label: "Accueil" },
		{ href: "/programs", label: "Programmes" },
		{ href: "/faculty", label: "Enseignants" },
		{ href: "/news", label: "Actualités" },
		...(user.user
			? [{ href: "/dashboard", label: "Tableau de bord" }]
			: []),
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center space-x-2 text-lg font-semibold tracking-tight"
				>
					<Icon icon="lucide:graduation-cap" className="h-6 w-6" />
					<span>Campusnet</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex md:items-center md:space-x-6">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
								pathname === item.href
									? "text-foreground"
									: "text-foreground/60"
							}`}
						>
							{item.label}
						</Link>
					))}
				</div>

				{/* Desktop Actions */}
				<div className="hidden md:flex md:items-center md:space-x-4">
					<ThemeSelector />
					{user.user ? (
						<>
							<span className="text-sm text-muted-foreground">
								{user.user.name || user.user.email}
							</span>
							<Button
								size="sm"
								variant="ghost"
								onClick={handleLogout}
								className="text-sm"
							>
								<Icon
									icon="lucide:log-out"
									className="w-4 h-4 mr-2"
								/>
								Se déconnecter
							</Button>
						</>
					) : (
						<Button size="sm" asChild>
							<Link href="/login">
								<Icon
									icon="lucide:log-in"
									className="w-4 h-4 mr-2"
								/>
								Se connecter
							</Link>
						</Button>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					type="button"
					className="md:hidden rounded-md p-2 text-foreground"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					aria-label="Toggle menu"
				>
					<Icon
						icon={isMobileMenuOpen ? "lucide:x" : "lucide:menu"}
						className="h-6 w-6"
					/>
				</button>
			</nav>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden border-t border-border">
					<div className="space-y-1 px-4 pb-3 pt-2">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`block rounded-md px-3 py-2 text-base font-medium ${
									pathname === item.href
										? "bg-muted text-foreground"
										: "text-foreground/60 hover:bg-muted hover:text-foreground"
								}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{item.label}
							</Link>
						))}
						<div className="border-t border-border my-2" />
						<div className="px-3 py-2 space-y-2">
							<ThemeSelector />
							{user.user ? (
								<>
									<div className="text-sm text-muted-foreground mb-2">
										{user.user.name || user.user.email}
									</div>
									<Button
										size="sm"
										variant="ghost"
										onClick={handleLogout}
										className="w-full justify-start"
									>
										<Icon
											icon="lucide:log-out"
											className="w-4 h-4 mr-2"
										/>
										Se déconnecter
									</Button>
								</>
							) : (
								<Button
									size="sm"
									asChild
									className="w-full"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<Link href="/login">
										<Icon
											icon="lucide:log-in"
											className="w-4 h-4 mr-2"
										/>
										Se connecter
									</Link>
								</Button>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
};
