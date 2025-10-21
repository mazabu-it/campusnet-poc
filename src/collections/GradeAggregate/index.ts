import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const GradeAggregate: CollectionConfig = {
  slug: 'grade-aggregates',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['enrollment', 'finalNumeric', 'finalLetter', 'passFail'],
    useAsTitle: 'gradeTitle',
  },
  fields: [
    {
      name: 'enrollment',
      type: 'relationship',
      relationTo: 'enrollments',
      required: true,
    },
    {
      name: 'gradeTitle',
      type: 'text',
      admin: {
        description: 'Auto-generated title',
      },
    },
    {
      name: 'finalNumeric',
      type: 'number',
      admin: {
        description: 'Final numeric grade',
      },
    },
    {
      name: 'finalLetter',
      type: 'text',
      admin: {
        description: 'Final letter grade',
      },
    },
    {
      name: 'passFail',
      type: 'select',
      options: [
        { label: 'Pass', value: 'pass' },
        { label: 'Fail', value: 'fail' },
        { label: 'Incomplete', value: 'incomplete' },
      ],
      required: true,
    },
    {
      name: 'gpaPoints',
      type: 'number',
      admin: {
        description: 'GPA points (e.g., 4.0, 3.7, etc.)',
      },
    },
    {
      name: 'calculationMethod',
      type: 'select',
      options: [
        { label: 'Weighted Average', value: 'weighted-average' },
        { label: 'Simple Average', value: 'simple-average' },
        { label: 'Best Score', value: 'best-score' },
        { label: 'Manual Override', value: 'manual-override' },
      ],
      defaultValue: 'weighted-average',
    },
    {
      name: 'assessmentBreakdown',
      type: 'array',
      fields: [
        {
          name: 'assessmentTemplate',
          type: 'relationship',
          relationTo: 'assessment-templates',
          required: true,
        },
        {
          name: 'score',
          type: 'number',
        },
        {
          name: 'maxScore',
          type: 'number',
        },
        {
          name: 'weight',
          type: 'number',
        },
        {
          name: 'contribution',
          type: 'number',
          admin: {
            description: 'Contribution to final grade',
          },
        },
        {
          name: 'isMissing',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isExcused',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'decisionNotes',
      type: 'textarea',
      admin: {
        description: 'Notes about grade calculation or special circumstances',
      },
    },
    {
      name: 'calculatedAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'calculatedBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this grade has been published to the student',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.enrollment) {
          data.gradeTitle = `Grade Aggregate`
        }
      },
    ],
  },
}
