import configPromise from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload, type RequiredDataFromCollectionSlug } from "payload";
import { cache } from "react";
import { RenderBlocks } from "@/blocks/RenderBlocks";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import { homeStatic } from "@/endpoints/seed/home-static";
import { RenderHero } from "@/heros/RenderHero";
import { generateMeta } from "@/utilities/generateMeta";
import PageClient from "./page.client";

// Avoid build-time DB access; render dynamically
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
	try {
		const payload = await getPayload({ config: configPromise });
		const pages = await payload.find({
			collection: "pages",
			draft: false,
			limit: 1000,
			overrideAccess: false,
			pagination: false,
			select: { slug: true },
		});

		return (
			pages.docs
				?.filter((doc) => doc.slug !== "home")
				.map(({ slug }) => ({ slug })) || []
		);
	} catch {
		// If DB/tables don't exist at build-time, skip prebuilding
		return [];
	}
}

type Args = {
	params: Promise<{
		slug?: string;
	}>;
};

export default async function Page({ params: paramsPromise }: Args) {
	const { isEnabled: draft } = await draftMode();
	const { slug = "home" } = await paramsPromise;
	const url = `/${slug}`;

	let page: RequiredDataFromCollectionSlug<"pages"> | null;

	page = await queryPageBySlug({
		slug,
	});

	// Remove this code once your website is seeded
	if (!page && slug === "home") {
		page = homeStatic;
	}

	if (!page) {
		return <PayloadRedirects url={url} />;
	}

	const { hero, layout } = page;

	return (
		<article className="pb-24">
			<PageClient />
			{/* Allows redirects for valid pages too */}
			<PayloadRedirects disableNotFound url={url} />

			{draft && <LivePreviewListener />}

			<RenderHero {...hero} />
			<RenderBlocks blocks={layout} />
		</article>
	);
}

export async function generateMetadata({
	params: paramsPromise,
}: Args): Promise<Metadata> {
	const { slug = "home" } = await paramsPromise;
	const page = await queryPageBySlug({
		slug,
	});

	return generateMeta({ doc: page });
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode();

	try {
		const payload = await getPayload({ config: configPromise });
		const result = await payload.find({
			collection: "pages",
			draft,
			limit: 1,
			pagination: false,
			overrideAccess: draft,
			where: { slug: { equals: slug } },
		});
		return result.docs?.[0] || null;
	} catch {
		return null;
	}
});
