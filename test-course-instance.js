// test-course-instance.js
import { getPayload } from "payload";
import config from "./src/payload.config.js";

async function testCourseInstance() {
	try {
		const payload = await getPayload({ config });

		console.log("Testing course instance creation...");

		// Create a minimal course instance
		const result = await payload.create({
			collection: "course-instances",
			data: {
				courseVariation: 1, // This will fail if no course variation exists
				academicYear: 1, // This will fail if no academic year exists
				instanceTitle: "Test Course Instance",
				maxEnrollment: 30,
				currentEnrollment: 0,
				status: "open",
			},
		});

		console.log("✅ Course instance created successfully:", result);
	} catch (error) {
		console.error("❌ Error creating course instance:", error);
	}
}

testCourseInstance();
