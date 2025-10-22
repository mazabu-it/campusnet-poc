import type { Block } from "payload";

export const Features: Block = {
	slug: "features",
	interfaceName: "FeaturesBlock",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			defaultValue: "Why Choose Us",
		},
		{
			name: "subtitle",
			type: "text",
			defaultValue: "Everything you need for academic excellence",
		},
		{
			name: "features",
			type: "array",
			fields: [
				{
					name: "icon",
					type: "text",
					required: true,
					defaultValue: "lucide:check",
				},
				{
					name: "title",
					type: "text",
					required: true,
				},
				{
					name: "description",
					type: "textarea",
					required: true,
				},
			],
		},
	],
};

