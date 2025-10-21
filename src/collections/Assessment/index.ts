import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Assessment: CollectionConfig = {
  slug: 'assessments',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['assessmentTemplate', 'date', 'status'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'assessmentTemplate',
      type: 'relationship',
      relationTo: 'assessment-templates',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'startTime',
      type: 'text',
      admin: {
        description: 'Start time (HH:MM format)',
      },
    },
    {
      name: 'endTime',
      type: 'text',
      admin: {
        description: 'End time (HH:MM format)',
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Open', value: 'open' },
        { label: 'Locked', value: 'locked' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'submissionWindow',
      type: 'group',
      fields: [
        {
          name: 'opensAt',
          type: 'date',
          admin: {
            description: 'When students can start submitting',
          },
        },
        {
          name: 'closesAt',
          type: 'date',
          admin: {
            description: 'When submissions close',
          },
        },
        {
          name: 'lateSubmissionAllowed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'latePenaltyPercent',
          type: 'number',
          defaultValue: 0,
          min: 0,
          max: 100,
          admin: {
            description: 'Penalty percentage for late submissions',
          },
        },
      ],
    },
    {
      name: 'gradingWindow',
      type: 'group',
      fields: [
        {
          name: 'opensAt',
          type: 'date',
          admin: {
            description: 'When grading can begin',
          },
        },
        {
          name: 'closesAt',
          type: 'date',
          admin: {
            description: 'When grading must be completed',
          },
        },
        {
          name: 'allowLateGrading',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'instructions',
      type: 'textarea',
      admin: {
        description: 'Specific instructions for this assessment instance',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for staff',
      },
    },
  ],
  timestamps: true,
}
