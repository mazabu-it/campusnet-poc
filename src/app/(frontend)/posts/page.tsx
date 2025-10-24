import configPromise from "@payload-config";
import type { Metadata } from "next/types";
import { getPayload } from "payload";
import { CollectionArchive } from "@/components/CollectionArchive";
import { PageRange } from "@/components/PageRange";
import { Pagination } from "@/components/Pagination";
import PageClient from "./page.client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PostsResult = {
	docs: any[];
	totalDocs: number;
	totalPages: number;
	page: number;
};

export default async function Page() {
	let posts: PostsResult = {
		docs: [],
		totalDocs: 0,
		totalPages: 0,
		page: 1,
	};

	try {
		const payload = await getPayload({ config: configPromise });
		const result = await payload.find({
			collection: "posts",
			depth: 1,
			limit: 12,
			overrideAccess: false,
			select: {
				title: true,
				slug: true,
				categories: true,
				meta: true,
			},
		});
		posts = {
			docs: result.docs ?? [],
			totalDocs: result.totalDocs ?? 0,
			totalPages: result.totalPages ?? 0,
			page: result.page ?? 1,
		};
	} catch (error) {
		console.error(
			"Posts page build: posts collection not available yet. Rendering empty list.",
			error,
		);
	}

	return (
		<div className="pt-24 pb-24">
			<PageClient />
			<div className="container mb-16">
				<div className="prose dark:prose-invert max-w-none">
					<h1>Posts</h1>
				</div>
			</div>

			<div className="container mb-8">
				<PageRange
					collection="posts"
					currentPage={posts.page}
					limit={12}
					totalDocs={posts.totalDocs}
				/>
			</div>

			<CollectionArchive posts={posts.docs} />

			<div className="container">
				{posts.totalPages > 1 && posts.page && (
					<Pagination
						page={posts.page}
						totalPages={posts.totalPages}
					/>
				)}
			</div>
		</div>
	);
}

export function generateMetadata(): Metadata {
	return {
		title: `Payload Website Template Posts`,
	};
}
