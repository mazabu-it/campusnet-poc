import type { Block } from "payload";

export const UniversityHeroBlock: Block = {
	slug: "university-hero",
	labels: {
		singular: "University Hero",
		plural: "University Heroes",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			admin: {
				description: "Main headline for the hero section",
			},
		},
		{
			name: "subtitle",
			type: "textarea",
			required: true,
			admin: {
				description: "Subtitle or description text",
			},
		},
		{
			name: "primaryButtonText",
			type: "text",
			defaultValue: "Apply Now",
			admin: {
				description: "Text for the primary call-to-action button",
			},
		},
		{
			name: "secondaryButtonText",
			type: "text",
			defaultValue: "Watch Video",
			admin: {
				description: "Text for the secondary button",
			},
		},
		{
			name: "stats",
			type: "array",
			admin: {
				description: "Statistics to display in the hero section",
			},
			fields: [
				{
					name: "icon",
					type: "text",
					required: true,
					admin: {
						description: "Iconify icon name (e.g., 'lucide:users')",
					},
				},
				{
					name: "value",
					type: "text",
					required: true,
					admin: {
						description: "Statistic value (e.g., '10,000+')",
					},
				},
				{
					name: "label",
					type: "text",
					required: true,
					admin: {
						description: "Statistic label (e.g., 'Students')",
					},
				},
			],
		},
	],
};
