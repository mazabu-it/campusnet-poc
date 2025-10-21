import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";

export const AcademicCalendar: CollectionConfig = {
	slug: "academic-calendars",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["name", "academicYear", "isActive"],
		useAsTitle: "name",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "academicYear",
			type: "relationship",
			relationTo: "academic-years",
			required: true,
		},
		{
			name: "importantDates",
			type: "array",
			fields: [
				{
					name: "name",
					type: "text",
					required: true,
				},
				{
					name: "date",
					type: "date",
					required: true,
				},
				{
					name: "type",
					type: "select",
					options: [
						{
							label: "Enrollment Start",
							value: "enrollment-start",
						},
						{ label: "Enrollment End", value: "enrollment-end" },
						{ label: "Classes Start", value: "classes-start" },
						{ label: "Classes End", value: "classes-end" },
						{ label: "Exam Period Start", value: "exam-start" },
						{ label: "Exam Period End", value: "exam-end" },
						{
							label: "Grade Submission Deadline",
							value: "grade-deadline",
						},
						{ label: "Holiday", value: "holiday" },
						{ label: "Other", value: "other" },
					],
					required: true,
				},
				{
					name: "description",
					type: "textarea",
				},
			],
		},
		{
			name: "isActive",
			type: "checkbox",
			defaultValue: true,
		},
	],
	timestamps: true,
};
