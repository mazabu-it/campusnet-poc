import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";

export const ProgramYear: CollectionConfig = {
	slug: "program-years",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["program", "yearNumber", "requiredCredits"],
		useAsTitle: "title",
	},
	fields: [
		{
			name: "program",
			type: "relationship",
			relationTo: "programs",
			required: true,
		},
		{
			name: "yearNumber",
			type: "number",
			required: true,
			min: 1,
			max: 10,
		},
		{
			name: "title",
			type: "text",
			admin: {
				description: "Auto-generated from program and year number",
			},
		},
		{
			name: "requiredCredits",
			type: "number",
			required: true,
			min: 1,
		},
		{
			name: "electiveCreditsAllowed",
			type: "number",
			defaultValue: 0,
			min: 0,
		},
		{
			name: "description",
			type: "textarea",
		},
		{
			name: "isActive",
			type: "checkbox",
			defaultValue: true,
		},
	],
	timestamps: true,
	hooks: {
		beforeChange: [
			({ data }) => {
				if (data.program && data.yearNumber) {
					// This will be populated by a hook that fetches the program name
					data.title = `Year ${data.yearNumber}`;
				}
			},
		],
	},
};
