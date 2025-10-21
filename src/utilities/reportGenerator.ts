import type { PayloadRequest } from 'payload'

export interface StudentReportData {
  student: {
    name: string
    studentId: string
    email: string
    program: string
    programYear: number
  }
  university: {
    name: string
    code: string
    contactInfo: {
      address: string
      phone: string
      email: string
    }
  }
  academicYear: string
  courses: Array<{
    courseCode: string
    courseTitle: string
    credits: number
    assessments: Array<{
      name: string
      score: number
      maxScore: number
      weight: number
      contribution: number
    }>
    finalGrade: number
    letterGrade: string
    passFail: string
  }>
  gpa: number
  totalCredits: number
}

export class ReportGenerator {
  private req: PayloadRequest

  constructor(req: PayloadRequest) {
    this.req = req
  }

  /**
   * Generate student grade report data
   */
  async generateStudentReport(
    studentId: string,
    academicYearId?: string,
  ): Promise<StudentReportData> {
    // Get student information
    const student = await this.req.payload.findByID({
      collection: 'users',
      id: studentId,
      depth: 3,
    })

    if (!student || student.role !== 'student') {
      throw new Error('Student not found')
    }

    // Get university information
    const university = await this.req.payload.findByID({
      collection: 'universities',
      id: student.university,
    })

    // Get academic year
    let academicYear: Record<string, unknown>
    if (academicYearId) {
      academicYear = await this.req.payload.findByID({
        collection: 'academic-years',
        id: academicYearId,
      })
    } else {
      const academicYears = await this.req.payload.find({
        collection: 'academic-years',
        where: {
          isActive: {
            equals: true,
          },
        },
        limit: 1,
        sort: '-createdAt',
      })
      academicYear = academicYears.docs[0]
    }

    // Get enrollments for the academic year
    const enrollments = await this.req.payload.find({
      collection: 'enrollments',
      where: {
        student: {
          equals: studentId,
        },
        status: {
          in: ['active', 'completed'],
        },
      },
      depth: 3,
    })

    // Get grade aggregates for these enrollments
    const gradeAggregates = await this.req.payload.find({
      collection: 'grade-aggregates',
      where: {
        enrollment: {
          in: enrollments.docs.map((e) => e.id),
        },
        isPublished: {
          equals: true,
        },
      },
      depth: 2,
    })

    // Calculate GPA
    const gpa = await this.calculateStudentGPA(studentId)

    // Calculate total credits
    const totalCredits = enrollments.docs.reduce((sum, enrollment) => {
      return (
        sum + (enrollment.creditsEarned || enrollment.courseInstance.courseVariation.credits || 0)
      )
    }, 0)

    // Build course data
    const courses = enrollments.docs.map((enrollment) => {
      const gradeAggregate = gradeAggregates.docs.find((ga) => ga.enrollment === enrollment.id)

      return {
        courseCode: enrollment.courseInstance.courseVariation.codeVariant,
        courseTitle:
          enrollment.courseInstance.courseVariation.titleVariant ||
          enrollment.courseInstance.courseVariation.course.title,
        credits:
          enrollment.creditsEarned ||
          enrollment.courseInstance.courseVariation.credits ||
          enrollment.courseInstance.courseVariation.course.credits,
        assessments:
          gradeAggregate?.assessmentBreakdown?.map((ab) => ({
            name: ab.assessmentTemplate.name || 'Assessment',
            score: ab.score || 0,
            maxScore: ab.maxScore,
            weight: ab.weight,
            contribution: ab.contribution,
          })) || [],
        finalGrade: gradeAggregate?.finalNumeric || 0,
        letterGrade: gradeAggregate?.finalLetter || 'N/A',
        passFail: gradeAggregate?.passFail || 'incomplete',
      }
    })

    return {
      student: {
        name: student.name,
        studentId: student.studentId || 'N/A',
        email: student.email,
        program: student.program?.name || 'N/A',
        programYear: student.programYear?.yearNumber || 1,
      },
      university: {
        name: university.name,
        code: university.code,
        contactInfo: university.contactInfo,
      },
      academicYear: academicYear?.yearLabel || 'N/A',
      courses,
      gpa,
      totalCredits,
    }
  }

  /**
   * Calculate student GPA
   */
  private async calculateStudentGPA(studentId: string): Promise<number> {
    const gradeAggregates = await this.req.payload.find({
      collection: 'grade-aggregates',
      where: {
        enrollment: {
          student: {
            equals: studentId,
          },
        },
        isPublished: {
          equals: true,
        },
      },
    })

    if (gradeAggregates.docs.length === 0) {
      return 0
    }

    const totalPoints = gradeAggregates.docs.reduce((sum, grade) => {
      return sum + (grade.gpaPoints || 0)
    }, 0)

    return totalPoints / gradeAggregates.docs.length
  }

  /**
   * Generate HTML for student report (for PDF conversion)
   */
  generateStudentReportHTML(data: StudentReportData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Student Grade Report - ${data.student.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .university-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .report-title {
            font-size: 18px;
            margin-bottom: 10px;
          }
          .student-info {
            margin-bottom: 30px;
          }
          .info-row {
            display: flex;
            margin-bottom: 5px;
          }
          .info-label {
            font-weight: bold;
            width: 150px;
          }
          .course-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .course-table th,
          .course-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .course-table th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .assessment-row {
            font-size: 12px;
            color: #666;
          }
          .summary {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .summary-label {
            font-weight: bold;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="university-name">${data.university.name}</div>
          <div class="report-title">Student Grade Report</div>
          <div>Academic Year: ${data.academicYear}</div>
        </div>

        <div class="student-info">
          <div class="info-row">
            <span class="info-label">Student Name:</span>
            <span>${data.student.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Student ID:</span>
            <span>${data.student.studentId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span>${data.student.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Program:</span>
            <span>${data.student.program} - Year ${data.student.programYear}</span>
          </div>
        </div>

        <table class="course-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credits</th>
              <th>Assessments</th>
              <th>Final Grade</th>
              <th>Letter Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.courses
              .map(
                (course) => `
              <tr>
                <td>${course.courseCode}</td>
                <td>${course.courseTitle}</td>
                <td>${course.credits}</td>
                <td>
                  ${course.assessments
                    .map(
                      (assessment) => `
                    <div class="assessment-row">
                      ${assessment.name}: ${assessment.score}/${assessment.maxScore} 
                      (${assessment.weight}% weight, ${assessment.contribution.toFixed(2)} pts)
                    </div>
                  `,
                    )
                    .join('')}
                </td>
                <td>${course.finalGrade.toFixed(2)}</td>
                <td>${course.letterGrade}</td>
                <td>${course.passFail}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span class="summary-label">Total Credits:</span>
            <span>${data.totalCredits}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">GPA:</span>
            <span>${data.gpa.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          <p>${data.university.name} - ${data.university.contactInfo.address}</p>
          <p>Phone: ${data.university.contactInfo.phone} | Email: ${data.university.contactInfo.email}</p>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Generate faculty summary report data
   */
  async generateFacultySummaryReport(_facultyId: string, _academicYearId?: string) {
    // Implementation for faculty summary report
    // This would include course-level distributions, pass rates, averages per program and year
    return {
      faculty: 'Faculty of Computer Science',
      academicYear: '2025-2026',
      courses: [],
      summary: {
        totalStudents: 0,
        averageGPA: 0,
        passRate: 0,
      },
    }
  }
}
