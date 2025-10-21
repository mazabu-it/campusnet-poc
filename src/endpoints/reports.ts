import type { Endpoint } from 'payload'
import { ReportGenerator } from '../utilities/reportGenerator'

export const generateStudentReportEndpoint: Endpoint = {
  path: '/generate-student-report/:studentId',
  method: 'get',
  handler: async (req) => {
    try {
      const { studentId } = req.params
      const { academicYear } = req.query

      if (!studentId) {
        return Response.json({ error: 'Student ID is required' }, { status: 400 })
      }

      const generator = new ReportGenerator(req)
      const reportData = await generator.generateStudentReport(studentId, academicYear as string)

      // Generate HTML
      const html = generator.generateStudentReportHTML(reportData)

      return Response.json({
        success: true,
        data: reportData,
        html,
      })
    } catch (error) {
      console.error('Error generating student report:', error)
      return Response.json({ error: 'Failed to generate student report' }, { status: 500 })
    }
  },
}

export const generateFacultySummaryEndpoint: Endpoint = {
  path: '/generate-faculty-summary/:facultyId',
  method: 'get',
  handler: async (req) => {
    try {
      const { facultyId } = req.params
      const { academicYear } = req.query

      if (!facultyId) {
        return Response.json({ error: 'Faculty ID is required' }, { status: 400 })
      }

      const generator = new ReportGenerator(req)
      const reportData = await generator.generateFacultySummaryReport(
        facultyId,
        academicYear as string,
      )

      return Response.json({
        success: true,
        data: reportData,
      })
    } catch (error) {
      console.error('Error generating faculty summary:', error)
      return Response.json({ error: 'Failed to generate faculty summary' }, { status: 500 })
    }
  },
}
