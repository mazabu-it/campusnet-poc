import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";

export const CourseInstance: CollectionConfig = {
	slug: "course-instances",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["courseVariation", "academicYear", "professors"],
		useAsTitle: "instanceTitle",
	},
	fields: [
		{
			name: "courseVariation",
			type: "relationship",
			relationTo: "course-variations",
			required: true,
		},
		{
			name: "academicYear",
			type: "relationship",
			relationTo: "academic-years",
			required: true,
		},
		{
			name: "instanceTitle",
			type: "text",
			admin: {
				description: "Auto-generated title for this instance",
			},
		},
		{
			name: "professors",
			type: "relationship",
			relationTo: "users",
			hasMany: true,
			required: false,
			admin: {
				description: "Professors assigned to this course instance",
			},
			validate: (value) => {
				// Explicitly allow undefined, null, or empty array
				if (
					value === undefined ||
					value === null ||
					(Array.isArray(value) && value.length === 0)
				) {
					return true;
				}
				// If it's an array with values, validate each item
				if (Array.isArray(value)) {
					const isValid = value.every(
						(item) => typeof item === "number" || typeof item === "object",
					);
					return isValid
						? true
						: "All professor items must be valid user IDs or objects";
				}
				return true;
			},
		},
		{
			name: "assistants",
			type: "relationship",
			relationTo: "users",
			hasMany: true,
		},
		{
			name: "maxEnrollment",
			type: "number",
			min: 1,
		},
		{
			name: "currentEnrollment",
			type: "number",
			defaultValue: 0,
			admin: {
				readOnly: true,
			},
		},
		{
			name: "schedule",
			type: "group",
			fields: [
				{
					name: "days",
					type: "select",
					hasMany: true,
					options: [
						{ label: "Monday", value: "monday" },
						{ label: "Tuesday", value: "tuesday" },
						{ label: "Wednesday", value: "wednesday" },
						{ label: "Thursday", value: "thursday" },
						{ label: "Friday", value: "friday" },
						{ label: "Saturday", value: "saturday" },
						{ label: "Sunday", value: "sunday" },
					],
				},
				{
					name: "startTime",
					type: "text",
					admin: {
						description: "Format: HH:MM (e.g., 09:00)",
					},
				},
				{
					name: "endTime",
					type: "text",
					admin: {
						description: "Format: HH:MM (e.g., 11:00)",
					},
				},
				{
					name: "room",
					type: "text",
				},
			],
		},
		{
			name: "status",
			type: "select",
			options: [
				{ label: "Planning", value: "planning" },
				{ label: "Open for Enrollment", value: "open" },
				{ label: "Enrollment Closed", value: "closed" },
				{ label: "In Progress", value: "in-progress" },
				{ label: "Completed", value: "completed" },
				{ label: "Cancelled", value: "cancelled" },
			],
			defaultValue: "planning",
		},
		{
			name: "notes",
			type: "textarea",
		},
	],
	timestamps: true,
	hooks: {
		beforeChange: [
			({ data }) => {
				if (data.courseVariation && data.academicYear) {
					// This will be populated by a hook that fetches the course and year info
					data.instanceTitle = `Course Instance`;
				}
			},
		],
	},
};
