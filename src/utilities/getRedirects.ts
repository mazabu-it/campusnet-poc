import configPromise from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

export async function getRedirects(depth = 1) {
	try {
		const payload = await getPayload({ config: configPromise });
		const { docs: redirects } = await payload.find({
			collection: "redirects",
			depth,
			limit: 0,
			pagination: false,
		});
		return redirects;
	} catch (error) {
		// During first build after a wipe, the table may not exist yet.
		// Return empty redirects so prerender doesn't fail.
		console.error(
			"getRedirects: redirects collection unavailable. Returning empty list.",
			error,
		);
		return [];
	}
}

/**
 * Returns a unstable_cache function mapped with the cache tag for 'redirects'.
 *
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
	unstable_cache(async () => getRedirects(), ["redirects"], {
		tags: ["redirects"],
	});
