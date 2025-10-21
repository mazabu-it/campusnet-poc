import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'university'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'studentId',
      type: 'text',
      admin: {
        description: 'Student ID number (if applicable)',
      },
    },
    {
      name: 'employeeId',
      type: 'text',
      admin: {
        description: 'Employee ID number (if applicable)',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Rector/Dean', value: 'rector-dean' },
        { label: 'Faculty Staff', value: 'faculty-staff' },
        { label: 'Department Staff', value: 'department-staff' },
        { label: 'Professor', value: 'professor' },
        { label: 'Assistant', value: 'assistant' },
        { label: 'Student', value: 'student' },
      ],
      required: true,
    },
    {
      name: 'university',
      type: 'relationship',
      relationTo: 'universities',
      admin: {
        description: 'Primary university affiliation',
      },
    },
    {
      name: 'faculty',
      type: 'relationship',
      relationTo: 'faculties',
      admin: {
        description: 'Faculty affiliation (if applicable)',
      },
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
      admin: {
        description: 'Department affiliation (if applicable)',
      },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: {
        description: 'Program enrollment (for students)',
      },
    },
    {
      name: 'programYear',
      type: 'relationship',
      relationTo: 'program-years',
      admin: {
        description: 'Current program year (for students)',
      },
    },
    {
      name: 'profile',
      type: 'group',
      fields: [
        {
          name: 'dateOfBirth',
          type: 'date',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'address',
          type: 'textarea',
        },
        {
          name: 'emergencyContact',
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'relationship',
              type: 'text',
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
      ],
    },
    {
      name: 'academicInfo',
      type: 'group',
      fields: [
        {
          name: 'enrollmentDate',
          type: 'date',
          admin: {
            description: 'Date of enrollment (for students)',
          },
        },
        {
          name: 'expectedGraduation',
          type: 'date',
          admin: {
            description: 'Expected graduation date (for students)',
          },
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Graduated', value: 'graduated' },
            { label: 'Withdrawn', value: 'withdrawn' },
            { label: 'Suspended', value: 'suspended' },
          ],
          defaultValue: 'active',
        },
        {
          name: 'gpa',
          type: 'number',
          admin: {
            description: 'Current GPA (for students)',
          },
        },
        {
          name: 'totalCreditsEarned',
          type: 'number',
          admin: {
            description: 'Total credits earned (for students)',
          },
        },
      ],
    },
    {
      name: 'permissions',
      type: 'group',
      fields: [
        {
          name: 'canImpersonate',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can impersonate other users (Super Admin only)',
          },
        },
        {
          name: 'canManageUsers',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can manage user accounts',
          },
        },
        {
          name: 'canManageCourses',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can manage courses and assessments',
          },
        },
        {
          name: 'canGrade',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can enter and modify grades',
          },
        },
        {
          name: 'canViewReports',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can view reports and analytics',
          },
        },
        {
          name: 'scope',
          type: 'select',
          options: [
            { label: 'University-wide', value: 'university' },
            { label: 'Faculty-wide', value: 'faculty' },
            { label: 'Department-wide', value: 'department' },
            { label: 'Program-wide', value: 'program' },
            { label: 'Course-specific', value: 'course' },
            { label: 'Self-only', value: 'self' },
          ],
          defaultValue: 'self',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterLogin: [
      ({ user }) => {
        // Update last login time
        return {
          ...user,
          lastLoginAt: new Date(),
        }
      },
    ],
  },
}
