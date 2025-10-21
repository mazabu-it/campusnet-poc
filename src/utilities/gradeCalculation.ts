import type { PayloadRequest } from 'payload'

export interface AssessmentBreakdown {
  assessmentTemplate: string
  score?: number
  maxScore: number
  weight: number
  contribution: number
  isMissing: boolean
  isExcused: boolean
}

export interface GradeCalculationResult {
  finalNumeric: number
  finalLetter: string
  passFail: 'pass' | 'fail' | 'incomplete'
  gpaPoints: number
  assessmentBreakdown: AssessmentBreakdown[]
  calculationMethod: string
}

export class GradeCalculationEngine {
  private req: PayloadRequest

  constructor(req: PayloadRequest) {
    this.req = req
  }

  /**
   * Calculate final grade for an enrollment
   */
  async calculateGrade(enrollmentId: string): Promise<GradeCalculationResult> {
    const enrollment = await this.req.payload.findByID({
      collection: 'enrollments',
      id: enrollmentId,
    })

    if (!enrollment) {
      throw new Error('Enrollment not found')
    }

    // Get all assessments for this course instance
    const assessments = await this.req.payload.find({
      collection: 'assessments',
      where: {
        'assessmentTemplate.courseInstance': {
          equals: enrollment.courseInstance,
        },
        status: {
          in: ['locked', 'published'],
        },
      },
      depth: 2,
    })

    // Get assessment templates
    const assessmentTemplates = await this.req.payload.find({
      collection: 'assessment-templates',
      where: {
        courseInstance: {
          equals: enrollment.courseInstance,
        },
      },
    })

    // Get all scores for this student
    const scores = await this.req.payload.find({
      collection: 'scores',
      where: {
        student: {
          equals: enrollment.student,
        },
        assessment: {
          in: assessments.docs.map((a) => a.id),
        },
      },
    })

    // Get grading scale
    const courseInstance = await this.req.payload.findByID({
      collection: 'course-instances',
      id: enrollment.courseInstance,
      depth: 3,
    })

    const university = await this.req.payload.findByID({
      collection: 'universities',
      id: courseInstance.courseVariation.department.faculty.university,
      depth: 1,
    })

    const gradingScale = await this.req.payload.findByID({
      collection: 'grading-scales',
      id: university.gradingScale,
    })

    return this.calculateWeightedGrade(
      assessmentTemplates.docs,
      scores.docs,
      gradingScale,
      university.configuration,
    )
  }

  /**
   * Calculate weighted grade based on assessment templates and scores
   */
  private calculateWeightedGrade(
    templates: Record<string, unknown>[],
    scores: Record<string, unknown>[],
    gradingScale: Record<string, unknown>,
    config: Record<string, unknown>,
  ): GradeCalculationResult {
    const breakdown: AssessmentBreakdown[] = []
    let totalWeightedScore = 0
    let totalWeight = 0
    let hasMissingRequired = false

    for (const template of templates) {
      const score = scores.find((s) => s.assessment.assessmentTemplate === template.id)

      const isMissing = !score && !template.isOptional
      const isExcused = score?.isExcused || false

      if (isMissing && !template.isOptional) {
        hasMissingRequired = true
      }

      const scoreValue = score?.finalValue || 0
      const maxScore = template.maxScore
      const weight = template.weightPercent / 100

      const contribution = isExcused ? 0 : scoreValue * weight

      breakdown.push({
        assessmentTemplate: template.id,
        score: scoreValue,
        maxScore,
        weight: template.weightPercent,
        contribution,
        isMissing,
        isExcused,
      })

      if (!isMissing && !isExcused) {
        totalWeightedScore += contribution
        totalWeight += weight
      }
    }

    // Calculate final numeric score
    const finalNumeric = totalWeight > 0 ? totalWeightedScore / totalWeight : 0

    // Apply rounding
    const roundedNumeric = this.applyRounding(
      finalNumeric,
      config.roundingRule,
      config.decimalPrecision,
    )

    // Determine letter grade and pass/fail
    const gradeMapping = this.findGradeMapping(roundedNumeric, gradingScale)

    return {
      finalNumeric: roundedNumeric,
      finalLetter: gradeMapping.letterGrade || '',
      passFail: hasMissingRequired ? 'incomplete' : gradeMapping.isPassing ? 'pass' : 'fail',
      gpaPoints: gradeMapping.numericGrade || 0,
      assessmentBreakdown: breakdown,
      calculationMethod: 'weighted-average',
    }
  }

  /**
   * Apply rounding based on university configuration
   */
  private applyRounding(value: number, rule: string, precision: number): number {
    const factor = Math.pow(10, precision)

    switch (rule) {
      case 'bankers':
        // Banker's rounding (round half to even)
        return Math.round(value * factor) / factor
      case 'round-half-up':
        return Math.round(value * factor + 0.5) / factor
      case 'round-half-down':
        return Math.floor(value * factor + 0.5) / factor
      default:
        return Math.round(value * factor) / factor
    }
  }

  /**
   * Find the appropriate grade mapping for a numeric score
   */
  private findGradeMapping(
    score: number,
    gradingScale: Record<string, unknown>,
  ): Record<string, unknown> {
    for (const mapping of gradingScale.gradeMappings) {
      if (score >= mapping.minScore && score <= mapping.maxScore) {
        return mapping
      }
    }

    // Return the lowest grade if no mapping found
    return (
      gradingScale.gradeMappings[gradingScale.gradeMappings.length - 1] || {
        letterGrade: 'F',
        numericGrade: 0,
        isPassing: false,
      }
    )
  }

  /**
   * Calculate GPA for a student
   */
  async calculateStudentGPA(studentId: string): Promise<number> {
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
      depth: 2,
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
   * Update grade aggregate for an enrollment
   */
  async updateGradeAggregate(enrollmentId: string): Promise<void> {
    const calculation = await this.calculateGrade(enrollmentId)

    // Check if grade aggregate already exists
    const existing = await this.req.payload.find({
      collection: 'grade-aggregates',
      where: {
        enrollment: {
          equals: enrollmentId,
        },
      },
    })

    if (existing.docs.length > 0) {
      // Update existing
      await this.req.payload.update({
        collection: 'grade-aggregates',
        id: existing.docs[0].id,
        data: {
          ...calculation,
          calculatedAt: new Date(),
        },
      })
    } else {
      // Create new
      await this.req.payload.create({
        collection: 'grade-aggregates',
        data: {
          enrollment: enrollmentId,
          ...calculation,
          calculatedAt: new Date(),
        },
      })
    }
  }
}
