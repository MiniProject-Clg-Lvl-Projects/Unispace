
import type { ICourse } from '../types.ts'


export const getCourses = async (): Promise<ICourse[]> => {
  const response = await fetch('http://localhost:3000/api/FetchCourses')
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  const data: ICourse[] = await response.json()
  return data;
}