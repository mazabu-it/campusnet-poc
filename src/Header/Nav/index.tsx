"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { CMSLink } from "@/components/Link";
import type { Header as HeaderType } from "@/payload-types";

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
	const navItems = data?.navItems || [];

	return (
		<nav className="flex gap-3 items-center">
			{navItems.map(({ link }, i) => {
				// Create unique key from URL, label, or index
				const key = link.url || link.label || `nav-item-${i}`;
				return <CMSLink key={key} {...link} appearance="link" />;
			})}
			<Link href="/search">
				<span className="sr-only">Search</span>
				<SearchIcon className="w-5 text-primary" />
			</Link>
		</nav>
	);
};
