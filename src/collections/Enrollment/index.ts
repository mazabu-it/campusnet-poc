import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Enrollment: CollectionConfig = {
  slug: 'enrollments',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['student', 'courseInstance', 'status', 'enrolledAt'],
    useAsTitle: 'enrollmentTitle',
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'courseInstance',
      type: 'relationship',
      relationTo: 'course-instances',
      required: true,
    },
    {
      name: 'enrollmentTitle',
      type: 'text',
      admin: {
        description: 'Auto-generated title',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Dropped', value: 'dropped' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Withdrawn', value: 'withdrawn' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'enrolledAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'droppedAt',
      type: 'date',
    },
    {
      name: 'completedAt',
      type: 'date',
    },
    {
      name: 'enrollmentType',
      type: 'select',
      options: [
        { label: 'Required', value: 'required' },
        { label: 'Elective', value: 'elective' },
        { label: 'Optional', value: 'optional' },
      ],
      defaultValue: 'required',
    },
    {
      name: 'creditsEarned',
      type: 'number',
      admin: {
        description: 'Credits earned (may differ from course credits)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this enrollment',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.student && data.courseInstance) {
          data.enrollmentTitle = `Enrollment`
        }
      },
    ],
  },
}
