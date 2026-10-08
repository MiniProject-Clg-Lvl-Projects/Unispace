import { useApp, AppProvider } from './context'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Landing from './screens/Landing'
import Login from './screens/Login'
import FacultyDashboard from './screens/faculty/FacultyDashboard'
import FacultyMyLearning from './screens/faculty/FacultyMyLearning'
import CourseApproval from './screens/faculty/CourseApproval'
import CreatedCourses from './screens/faculty/CreatedCourses'
import CreateCourse from './screens/faculty/CreateCourse'
import CourseGrid from './screens/faculty/CourseGrid'
import CourseInformation from './screens/faculty/CourseInformation'
import CourseContent from './screens/faculty/CourseContent'
import SelectedCourse from './screens/faculty/SelectedCourse'
import CoursePreview from './screens/faculty/CoursePreview'
import DocumentPreview from './screens/faculty/DocumentPreview'
import Learners from './screens/faculty/Learners'
import AssignStudents from './screens/faculty/AssignStudents'
import StudentDashboard from './screens/student/StudentDashboard'
import GlobalCourses from './screens/student/GlobalCourses'
import SearchCourse from './screens/student/SearchCourse'
import StudentMyLearning from './screens/student/StudentMyLearning'


const AUTH_SCREENS = new Set(['landing', 'login', 'register'])

function AppShell() {
  const { currentScreen, toast, toastType } = useApp()

  const isAuth = AUTH_SCREENS.has(currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing': return <Landing />
      case 'login': return <Login />
      case 'register': return <Login />
      case 'faculty-dashboard': return <FacultyDashboard />
      case 'faculty-my-learning': return <FacultyMyLearning />
      case 'faculty-course-approval': return <CourseApproval />
      case 'faculty-created-courses': return <CreatedCourses />
      case 'faculty-create-course': return <CreateCourse />
      case 'faculty-course-grid': return <CourseGrid />
      case 'faculty-course-info': return <CourseInformation />
      case 'faculty-course-content': return <CourseContent />
      case 'faculty-selected-course': return <SelectedCourse />
      case 'faculty-course-preview': return <CoursePreview />
      case 'faculty-document-preview': return <DocumentPreview />
      case 'faculty-learners': return <Learners />
      case 'faculty-assign-students': return <AssignStudents />
      case 'student-dashboard': return <StudentDashboard />
      case 'student-global-courses': return <GlobalCourses />
      case 'student-search': return <SearchCourse />
      case 'student-my-learning': return <StudentMyLearning />
      case 'student-total-courses': return <StudentMyLearning />
      case 'student-completed-courses': return <StudentMyLearning />
      case 'student-inprogress-courses': return <StudentMyLearning />
      case 'student-notstarted-courses': return <StudentMyLearning />
      default: return <Landing />
    }
  }

  const toastColors: Record<string, string> = {
    success: '#7c3aed',
    error: '#dc2626',
    info: '#0d9488',
  }

  if (isAuth) {
    return (
      <div style={{ minHeight: '100vh', background: '#080d16', fontFamily: 'Inter, sans-serif' }}>
        {renderScreen()}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm text-white"
            style={{ background: toastColors[toastType] ?? '#7c3aed', maxWidth: '380px' }}>
            <span>{toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : 'ℹ'}</span>
            {toast}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080d16', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
          {renderScreen()}
        </main>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm text-white"
          style={{ background: toastColors[toastType] ?? '#7c3aed', maxWidth: '380px' }}>
          <span>{toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : 'ℹ'}</span>
          {toast}
        </div>
      )}
    </div>
  )
}


export default function App() {
  console.log('App rendered') 
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
