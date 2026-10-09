
import {seedDatabase} from '../Server.ts'
import type { ICourse } from '../types.ts'

export const getCourses = async (): Promise<ICourse[]> => {
  const response = await fetch('http://localhost:3000/api/FetchCourses') //replace this with proper server address
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  const data: ICourse[] = await response.json()
  return data;
}

export async function createCourse(courseData: ICourse) {
  const response = await fetch('http://localhost:3000/api/AddCourses' , { //replace this with proper server address
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
  })

if (!response.ok) {
  const error = await response.text()
  console.error('API error:', response.status, error)
  throw new Error(`Failed to create course: ${response.status}`)
}

  return response.json()
}

// export const SetCourses = async (course: Partial<ICourse>) => {

//   await seedDatabase(course);
// }

