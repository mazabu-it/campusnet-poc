import type { RequiredDataFromCollectionSlug } from "payload";

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<"pages"> = {
	slug: "home",
	_status: "published",
	hero: {
		type: "lowImpact",
		richText: {
			root: {
				type: "root",
				children: [
					{
						type: "heading",
						children: [
							{
								type: "text",
								detail: 0,
								format: 0,
								mode: "normal",
								style: "",
								text: "Welcome to Campusnet",
								version: 1,
							},
						],
						direction: "ltr",
						format: "",
						indent: 0,
						tag: "h1",
						version: 1,
					},
					{
						type: "paragraph",
						children: [
							{
								type: "link",
								children: [
									{
										type: "text",
										detail: 0,
										format: 0,
										mode: "normal",
										style: "",
										text: "Access the admin dashboard",
										version: 1,
									},
								],
								direction: "ltr",
								fields: {
									linkType: "custom",
									newTab: false,
									url: "/admin",
								},
								format: "",
								indent: 0,
								version: 2,
							},
							{
								type: "text",
								detail: 0,
								format: 0,
								mode: "normal",
								style: "",
								text: " to manage your academic system and explore the demo data.",
								version: 1,
							},
						],
						direction: "ltr",
						format: "",
						indent: 0,
						textFormat: 0,
						version: 1,
					},
				],
				direction: "ltr",
				format: "",
				indent: 0,
				version: 1,
			},
		},
	},
	meta: {
		description:
			"A comprehensive academic management system built with Payload CMS and Next.js.",
		title: "Campusnet - Academic Management System",
	},
	title: "Home",
	layout: [],
};
