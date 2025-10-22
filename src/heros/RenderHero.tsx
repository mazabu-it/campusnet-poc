import type React from "react";
import { HighImpactHero } from "@/heros/HighImpact";
import { LowImpactHero } from "@/heros/LowImpact";
import { MediumImpactHero } from "@/heros/MediumImpact";
import { ModernMinimalHero } from "@/heros/ModernMinimal";
import type { Page } from "@/payload-types";

const heroes = {
	highImpact: HighImpactHero,
	lowImpact: LowImpactHero,
	mediumImpact: MediumImpactHero,
	modernMinimal: ModernMinimalHero,
};

export const RenderHero: React.FC<Page["hero"]> = (props) => {
	const { type } = props || {};

	if (!type || type === "none") return null;

	// Use modern minimal hero for home page
	if (type === "lowImpact") {
		return <ModernMinimalHero />;
	}

	const HeroToRender = heroes[type];

	if (!HeroToRender) return null;

	return <HeroToRender {...props} />;
};
