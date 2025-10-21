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
								text: "Invest in your future.",
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
								text: " to advance your career and maximize your potential.",
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
			"Transform your future with world-class education and cutting-edge technology programs at Campusnet University.",
		title: "Campusnet University - Invest in Your Future",
	},
	title: "Home",
	layout: [],
};
