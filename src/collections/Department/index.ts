import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Department: CollectionConfig = {
  slug: 'departments',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'code', 'faculty'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'faculty',
      type: 'relationship',
      relationTo: 'faculties',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'head',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'textarea',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
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
