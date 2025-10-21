'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Course {
  id: string
  title: string
  code: string
  credits: number
  status: string
  professor: string
}

interface Assessment {
  id: string
  title: string
  date: string
  status: string
  score?: number
  maxScore: number
  weight: number
}

interface GradeReport {
  courseTitle: string
  courseCode: string
  credits: number
  assessments: Assessment[]
  finalGrade: number
  letterGrade: string
  passFail: string
}

export function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [grades, setGrades] = useState<GradeReport[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'courses' | 'grades'>('courses')

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      // Fetch enrolled courses
      const coursesResponse = await fetch('/api/enrollments?student=true')
      const coursesData = await coursesResponse.json()
      setCourses(coursesData.docs || [])

      // Fetch grade reports
      const gradesResponse = await fetch('/api/grade-aggregates?student=true')
      const gradesData = await gradesResponse.json()
      setGrades(gradesData.docs || [])
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPassFailColor = (passFail: string) => {
    switch (passFail) {
      case 'pass':
        return 'bg-green-100 text-green-800'
      case 'fail':
        return 'bg-red-100 text-red-800'
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your courses and view your grades</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'grades'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Grade Reports
            </button>
          </nav>
        </div>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">My Courses</h2>
            <Button
              onClick={() => {
                /* Navigate to course enrollment */
              }}
            >
              Enroll in Course
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{course.code}</span>
                    <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-medium">{course.credits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Professor:</span>
                      <span className="font-medium">{course.professor}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Grades Tab */}
      {activeTab === 'grades' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Grade Reports</h2>
            <Button
              onClick={() => {
                /* Generate PDF report */
              }}
            >
              Download Report
            </Button>
          </div>

          <div className="space-y-4">
            {grades.map((grade, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{grade.courseTitle}</CardTitle>
                      <p className="text-sm text-gray-600">{grade.courseCode}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{grade.finalGrade}</div>
                      <div className="text-sm text-gray-600">{grade.letterGrade}</div>
                      <Badge className={getPassFailColor(grade.passFail)}>{grade.passFail}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Assessment Breakdown</h4>
                    <div className="space-y-2">
                      {grade.assessments.map((assessment, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 border-b border-gray-100"
                        >
                          <div>
                            <span className="font-medium">{assessment.title}</span>
                            <span className="text-sm text-gray-600 ml-2">
                              ({assessment.weight}% weight)
                            </span>
                          </div>
                          <div className="text-right">
                            {assessment.score !== undefined ? (
                              <span className="font-medium">
                                {assessment.score}/{assessment.maxScore}
                              </span>
                            ) : (
                              <span className="text-gray-400">Not graded</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
