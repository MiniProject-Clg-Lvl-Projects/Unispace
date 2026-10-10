import { createContext, useContext, useState,useEffect, useCallback, type ReactNode } from 'react'
import type { ICourse, IStudent, IUser, Screen, IContentItem } from './types.ts'

import { getCourses,createCourse } from './services/courseService.tsx' 

interface NavData {
  course?: ICourse
  content?: IContentItem[]
  filter?: string
}

interface AppState {
  currentUser: IUser | null
  currentScreen: Screen 
  courses: ICourse[]
  students: IStudent[]
  selectedCourse: ICourse | null
  selectedContent: IContentItem[] | undefined
  screenFilter: string
  navigate: (screen: Screen, data?: NavData) => void
  goBack: () => void
  setCourses: React.Dispatch<React.SetStateAction<ICourse[]>>
  setStudents: React.Dispatch<React.SetStateAction<IStudent[]>>
  setSelectedCourse: (c: ICourse | null) => void
  login: (role: 'faculty' | 'student', name: string, email: string) => void
  logout: () => void
  toast: string | null
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  toastType: 'success' | 'error' | 'info'
  loading: boolean //added loading state to AppState
}

export const AppCtx = createContext<AppState>({} as AppState)
export const useApp = () => useContext(AppCtx)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing')
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [students, setStudents] = useState<IStudent[]>([])
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null)
  const [selectedContent, setSelectedContent] = useState<IContentItem[] | undefined>(undefined)
  const [screenFilter, setScreenFilter] = useState<string>('')
  const [history, setHistory] = useState<Screen[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')



  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data)
      })
      .catch((err) => console.error('Failed to load courses in AppContext:', err))
      .finally(() => setLoading(false))
  }, []) // empty dependency array ensures this runs only once on mount

  const navigate = useCallback((screen: Screen, data?: NavData) => {
    setHistory(prev => [...prev, currentScreen])
    setCurrentScreen(screen)
    if (data?.course !== undefined) setSelectedCourse(data.course)
    if (data?.content !== undefined) setSelectedContent(data.content)
    if (data?.filter !== undefined) setScreenFilter(data.filter)
    window.scrollTo(0, 0)
  }, [currentScreen])

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev
      const next = [...prev]
      const last = next.pop()!
      setCurrentScreen(last)
      return next
    })
  }, [])

  const login = useCallback((role: 'faculty' | 'student', name: string, email: string ) => {
    setCurrentUser({ id: role === 'faculty' ? 'f1' : 'st_logged', name, email, role, department: 'Computer Science Engineering' })
    setCurrentScreen(role === 'faculty' ? 'faculty-dashboard' : 'student-dashboard')
    setHistory([])
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setCurrentScreen('landing')
    setHistory([])
    setSelectedCourse(null)
  }, [])

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast(msg)
    setToastType(type)
    setTimeout(() => setToast(null), 3200)
  }, [])

  return (
    <AppCtx.Provider value={{
      currentUser, currentScreen, courses,loading, students, selectedCourse,
      selectedContent, screenFilter, navigate, goBack,
      setCourses, setStudents, setSelectedCourse,
      login, logout, toast, showToast, toastType
    }}>
      {children}
    </AppCtx.Provider>
  )
}
