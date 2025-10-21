import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Course: CollectionConfig = {
  slug: 'courses',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['code', 'title', 'credits', 'owningDepartment'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
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
      name: 'credits',
      type: 'number',
      required: true,
      min: 1,
      max: 30,
    },
    {
      name: 'owningDepartment',
      type: 'relationship',
      relationTo: 'departments',
      required: true,
    },
    {
      name: 'prerequisites',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },
    {
      name: 'courseType',
      type: 'select',
      options: [
        { label: 'Required', value: 'required' },
        { label: 'Elective', value: 'elective' },
        { label: 'Optional', value: 'optional' },
      ],
      defaultValue: 'required',
    },
    {
      name: 'learningOutcomes',
      type: 'array',
      fields: [
        {
          name: 'outcome',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
