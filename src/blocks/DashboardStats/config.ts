import type { Block } from "payload";

export const DashboardStatsBlock: Block = {
	slug: "dashboard-stats",
	labels: {
		singular: "Dashboard Stats",
		plural: "Dashboard Stats",
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
			name: "metrics",
			type: "array",
			required: true,
			admin: {
				description: "Key metrics to display",
			},
			fields: [
				{
					name: "label",
					type: "text",
					required: true,
					admin: {
						description: "Metric label",
					},
				},
				{
					name: "value",
					type: "text",
					required: true,
					admin: {
						description: "Metric value",
					},
				},
				{
					name: "icon",
					type: "text",
					required: true,
					admin: {
						description: "Iconify icon name",
					},
				},
				{
					name: "trend",
					type: "select",
					options: [
						{ label: "Up", value: "up" },
						{ label: "Down", value: "down" },
					],
					required: true,
				},
				{
					name: "change",
					type: "text",
					required: true,
					admin: {
						description: "Change percentage (e.g., '+12%')",
					},
				},
			],
		},
		{
			name: "enrollmentData",
			type: "array",
			admin: {
				description: "Enrollment trend data",
			},
			fields: [
				{
					name: "month",
					type: "text",
					required: true,
				},
				{
					name: "enrollments",
					type: "number",
					required: true,
				},
			],
		},
		{
			name: "programData",
			type: "array",
			admin: {
				description: "Program distribution data",
			},
			fields: [
				{
					name: "name",
					type: "text",
					required: true,
				},
				{
					name: "value",
					type: "number",
					required: true,
				},
			],
		},
		{
			name: "goals",
			type: "array",
			admin: {
				description: "Academic goals progress",
			},
			fields: [
				{
					name: "name",
					type: "text",
					required: true,
				},
				{
					name: "description",
					type: "text",
					required: true,
				},
				{
					name: "progress",
					type: "number",
					min: 0,
					max: 100,
					required: true,
				},
			],
		},
	],
};
