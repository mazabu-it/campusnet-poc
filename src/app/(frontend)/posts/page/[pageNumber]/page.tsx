import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { getPayload } from "payload";
import { CollectionArchive } from "@/components/CollectionArchive";
import { PageRange } from "@/components/PageRange";
import { Pagination } from "@/components/Pagination";
import PageClient from "./page.client";

// Avoid build-time DB access; render dynamically
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Args = {
	params: Promise<{
		pageNumber: string;
	}>;
};

export default async function Page({ params: paramsPromise }: Args) {
	const { pageNumber } = await paramsPromise;
	const sanitizedPageNumber = Number(pageNumber);

	if (!Number.isInteger(sanitizedPageNumber)) notFound();

	try {
		const payload = await getPayload({ config: configPromise });
		const posts = await payload.find({
			collection: "posts",
			depth: 1,
			limit: 12,
			page: sanitizedPageNumber,
			overrideAccess: false,
		});

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
					{posts?.page && posts?.totalPages > 1 && (
						<Pagination
							page={posts.page}
							totalPages={posts.totalPages}
						/>
					)}
				</div>
			</div>
		);
	} catch {
		// If DB/tables don't exist, show empty state
		return (
			<div className="pt-24 pb-24">
				<PageClient />
				<div className="container mb-16">
					<div className="prose dark:prose-invert max-w-none">
						<h1>Posts</h1>
						<p>No posts available yet.</p>
					</div>
				</div>
			</div>
		);
	}
}

export async function generateMetadata({
	params: paramsPromise,
}: Args): Promise<Metadata> {
	const { pageNumber } = await paramsPromise;
	return {
		title: `Payload Website Template Posts Page ${pageNumber || ""}`,
	};
}

export async function generateStaticParams() {
	try {
		const payload = await getPayload({ config: configPromise });
		const { totalDocs } = await payload.count({
			collection: "posts",
			overrideAccess: false,
		});

		const totalPages = Math.ceil(totalDocs / 10);
		const pages: { pageNumber: string }[] = [];

		for (let i = 1; i <= totalPages; i++) {
			pages.push({ pageNumber: String(i) });
		}

		return pages;
	} catch {
		// If DB/tables don't exist at build-time, skip prebuilding
		return [];
	}
}
