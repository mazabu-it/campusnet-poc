import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const GradingScale: CollectionConfig = {
  slug: 'grading-scales',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'scaleType', 'isActive'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'scaleType',
      type: 'select',
      options: [
        { label: 'Numeric (0-100)', value: 'numeric-100' },
        { label: 'Numeric (0-20)', value: 'numeric-20' },
        { label: 'Letter Grades', value: 'letter' },
        { label: 'Pass/Fail', value: 'pass-fail' },
        { label: 'Custom', value: 'custom' },
      ],
      required: true,
    },
    {
      name: 'gradeMappings',
      type: 'array',
      fields: [
        {
          name: 'minScore',
          type: 'number',
          required: true,
        },
        {
          name: 'maxScore',
          type: 'number',
          required: true,
        },
        {
          name: 'letterGrade',
          type: 'text',
          admin: {
            description: 'Letter grade (e.g., A+, A, B+, etc.)',
          },
        },
        {
          name: 'numericGrade',
          type: 'number',
          admin: {
            description: 'Numeric equivalent (e.g., 4.0, 3.7, etc.)',
          },
        },
        {
          name: 'isPassing',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Grade description (e.g., Excellent, Good, etc.)',
          },
        },
      ],
    },
    {
      name: 'passThreshold',
      type: 'number',
      required: true,
      admin: {
        description: 'Minimum score/grade required to pass',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
