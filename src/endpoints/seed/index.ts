import type { Endpoint } from 'payload'
import { seedCampusnetData } from './campusnet-seed'

export const seedCampusnetEndpoint: Endpoint = {
  path: '/seed-campusnet',
  method: 'post',
  handler: async (req) => {
    try {
      const result = await seedCampusnetData(req)

      return Response.json({
        success: true,
        message: 'Campusnet data seeded successfully',
        data: result,
      })
    } catch (error) {
      console.error('Error seeding Campusnet data:', error)
      return Response.json(
        {
          success: false,
          error: 'Failed to seed Campusnet data',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 },
      )
    }
  },
}
