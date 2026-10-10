export type Role = 'faculty' | 'student'
export type CourseStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'in-progress'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
export type EnrollStatus = 'not-started' | 'in-progress' | 'completed'
export type LearningStatus = 'not-started' | 'in-progress' | 'completed'

export interface IContentItem {
  id: string
  title: string
  type: 'pdf' | 'video' | 'quiz'
  content: string
}

export interface IUnit {
  id: string
  title: string
  content: IContentItem[]
}

export interface ISyllabusItem {
  id: string
  topic: string
  hours: number
  description: string
}

export interface IExperiment {
  id: string
  title: string
  description: string
  materials: string
}

export interface ICourse {
  id: string
  title: string
  code: string
  description: string
  faculty: string
  facultyId: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  Learning : LearningStatus
  status: CourseStatus
  approvalStatus: ApprovalStatus
  units: IUnit[]
  syllabus: ISyllabusItem[]
  experiments: IExperiment[]
  enrolledStudents: string[]
  createdAt: string
}

export interface ILogin extends Document {
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnrolledCourse {
  courseId: string
  progress: number
  status: EnrollStatus
  currentUnit: string
  enrolledAt: string
  completedAt?: string
}

export interface IStudent {
  id: string
  name: string
  email: string
  password:string 
  studentId: string
  enrolledCourses: IEnrolledCourse[]
}

export interface IFaculty  {
  id: string
  name: string
  email: string
  facultyId: string
  enrolledCourses: IEnrolledCourse[]
}

export interface IUser {
  id: string
  name: string
  email: string
  role: Role
  department?: string
}

export type Screen =
  | 'landing'
  | 'login'
  | 'register'
  | 'faculty-dashboard'
  | 'faculty-my-learning'
  | 'faculty-course-approval'
  | 'faculty-created-courses'
  | 'faculty-create-course'
  | 'faculty-course-grid'
  | 'faculty-course-info'
  | 'faculty-course-content'
  | 'faculty-selected-course'
  | 'faculty-course-preview'
  | 'faculty-document-preview'
  | 'faculty-learners'
  | 'faculty-assign-students'
  | 'student-dashboard'
  | 'student-global-courses'
  | 'student-search'
  | 'student-my-learning'
  | 'student-total-courses'
  | 'student-course-detail'
  | 'student-completed-courses'
  | 'student-inprogress-courses'
  | 'student-notstarted-courses'
