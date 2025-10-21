import type { Block } from "payload";

export const NewsEventsBlock: Block = {
	slug: "news-events",
	labels: {
		singular: "News & Events",
		plural: "News & Events",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			admin: {
				description: "Section title",
			},
		},
		{
			name: "subtitle",
			type: "textarea",
			required: true,
			admin: {
				description: "Section subtitle",
			},
		},
		{
			name: "items",
			type: "array",
			required: true,
			admin: {
				description: "News and events items",
			},
			fields: [
				{
					name: "type",
					type: "select",
					options: [
						{ label: "News", value: "news" },
						{ label: "Event", value: "event" },
					],
					required: true,
				},
				{
					name: "title",
					type: "text",
					required: true,
					admin: {
						description: "Item title",
					},
				},
				{
					name: "excerpt",
					type: "textarea",
					required: true,
					admin: {
						description: "Short description or excerpt",
					},
				},
				{
					name: "date",
					type: "date",
					required: true,
					admin: {
						description: "Publication or event date",
					},
				},
				{
					name: "location",
					type: "text",
					required: true,
					admin: {
						description: "Location (for events) or source (for news)",
					},
				},
			],
		},
	],
};
