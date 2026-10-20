import { useState, useEffect } from 'react'
import type { ICourse } from '../types.ts'
import { getCourses } from './courseService.tsx'

export function CourseList() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data)
        console.log('Courses loaded:', data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading courses:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

if (loading) {
    return <div className="p-4">Loading courses...</div>
  }

  return (
    <div className="p-4 grid gap-4">
      {courses.map((course) => (
        <div key={course.id} className="border p-4 rounded shadow-sm">
          <h2 className="text-xl font-bold">{course.title} ({course.code})</h2>
          <p className="text-gray-600">{course.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>Faculty: {course.faculty}</span> | 
            <span className="capitalize"> Level: {course.level}</span>
          </div>
        </div>
      ))}
    </div>
  )
}