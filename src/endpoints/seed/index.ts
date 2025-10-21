import type { Endpoint } from "payload";
import { seedCampusnetDemoData } from "./campusnet-demo-seed";

export const seedCampusnetEndpoint: Endpoint = {
	path: "/seed-campusnet",
	method: "post",
	handler: async (req) => {
		try {
			const result = await seedCampusnetDemoData(req.payload);

			return Response.json({
				success: true,
				message: "Campusnet demo data seeded successfully",
				data: result,
			});
		} catch (error) {
			console.error("Error seeding Campusnet demo data:", error);
			return Response.json(
				{
					success: false,
					error: "Failed to seed Campusnet demo data",
					details: error instanceof Error ? error.message : "Unknown error",
				},
				{ status: 500 },
			);
		}
	},
};
