import { HeaderClient } from "./Component.client";

export async function HeaderComponent() {
	// The new header doesn't use CMS data - it's hardcoded for better performance
	return <HeaderClient data={{ navItems: [] }} />;
}
