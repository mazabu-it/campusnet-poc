import configPromise from "@payload-config";
import type { Metadata } from "next/types";
import { getPayload } from "payload";
import type { CardPostData } from "@/components/Card";
import { CollectionArchive } from "@/components/CollectionArchive";
import { Search } from "@/search/Component";
import PageClient from "./page.client";

// Avoid build-time DB access; render dynamically
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Args = {
	searchParams: Promise<{
		q: string;
	}>;
};
export default async function Page({
	searchParams: searchParamsPromise,
}: Args) {
	const { q: query } = await searchParamsPromise;
    let posts: { docs: CardPostData[]; totalDocs: number } = {
        docs: [],
        totalDocs: 0,
    };

    try {
        const payload = await getPayload({ config: configPromise });
        const result = await payload.find({
            collection: "search",
            depth: 1,
            limit: 12,
            select: {
                title: true,
                slug: true,
                categories: true,
                meta: true,
            },
            // pagination: false reduces overhead if you don't need totalDocs
            pagination: false,
            ...(query
                ? {
                        where: {
                            or: [
                                { title: { like: query } },
                                { "meta.description": { like: query } },
                                { "meta.title": { like: query } },
                                { slug: { like: query } },
                            ],
                        },
                    }
                : {}),
        });
        posts = {
            docs: (result.docs as CardPostData[]) ?? [],
            totalDocs: result.totalDocs ?? 0,
        };
    } catch (error) {
        console.error(
            "Search page: collection not available yet. Rendering empty results.",
            error,
        );
    }

	return (
		<div className="pt-24 pb-24">
			<PageClient />
			<div className="container mb-16">
				<div className="prose dark:prose-invert max-w-none text-center">
					<h1 className="mb-8 lg:mb-16">Search</h1>

					<div className="max-w-[50rem] mx-auto">
						<Search />
					</div>
				</div>
			</div>

			{posts.totalDocs > 0 ? (
				<CollectionArchive posts={posts.docs as CardPostData[]} />
			) : (
				<div className="container">No results found.</div>
			)}
		</div>
	);
}

export function generateMetadata(): Metadata {
	return {
		title: `Payload Website Template Search`,
	};
}
