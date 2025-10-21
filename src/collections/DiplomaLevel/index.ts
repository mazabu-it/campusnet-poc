import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const DiplomaLevel: CollectionConfig = {
  slug: 'diploma-levels',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'code', 'level'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'level',
      type: 'select',
      options: [
        { label: 'Bachelor', value: 'bachelor' },
        { label: 'Master', value: 'master' },
        { label: 'PhD', value: 'phd' },
        { label: 'Certificate', value: 'certificate' },
        { label: 'Diploma', value: 'diploma' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'typicalDuration',
      type: 'number',
      label: 'Typical Duration (years)',
      min: 1,
      max: 10,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
