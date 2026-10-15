
import { promises } from 'dns'
import type { ICourse, IUnit } from '../types.ts'

export const getCourses = async (): Promise<ICourse[]> => {
  const response = await fetch('http://localhost:3000/api/FetchCourses') //replace this with proper server address
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  const data: ICourse[] = await response.json()
  return data;
}


export const getCourse = async(courseCode: string) : Promise<ICourse> => {
    const response = await fetch(`http://localhost:3000/api/FetchCourse/${encodeURIComponent(courseCode)}`) //replace this with proper server address

  if (!response.ok) {
    const error = await response.text()
    console.error('API error:', response.status, error)
    throw new Error(`Failed to get course: ${response.status}`)
  }

  return response.json()

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



export async function createUnit(unit: IUnit,courseCode: string){
   console.log(unit);
    const response = await fetch(`http://localhost:3000/api/courses/${encodeURIComponent(courseCode)}/units` , { //replace this with proper server address
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(unit),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('API error:', response.status, error)
    throw new Error(`Failed to create unit: ${response.status}`)
  }
  return response.json()
}

