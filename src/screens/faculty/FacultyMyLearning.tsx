import { useApp } from '../../context'
import { CourseCard, Btn, EmptyState } from '../../components/ui'
import {getFacultyEnrolledCourses,getStudentEnrolledCourses} from '../../services/courseService'
import { IEnrolledCourse } from '@/types'
import { useEffect, useState } from 'react'


export default function FacultyMyLearning() {
  const {currentUser, courses, navigate } = useApp()
  const [enrolled,setEnrolled] =useState<IEnrolledCourse[]>();
  if(!currentUser) return;

  useEffect(() => {
    getFacultyEnrolledCourses(currentUser.id)
    .then((data)=>{
        setEnrolled(data);
    })
    .catch((err) => console.error('Failed to fetch courses in AppContext:', err))
    
  },[])

  

  if (enrolled?.length === 0) {
    return <EmptyState icon="📖" title="No enrolled courses" message="You have not enrolled in any courses yet. Browse the course grid to get started." />
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>My Learning</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>Courses you're enrolled in as a learner.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolled?.map(({course, progress, status }) => course && (
          <div key={course.code} className="rounded-xl p-5 flex flex-col gap-4 transition-colors"
            style={{ background: '#111827', border: '1px solid #1a2540' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.15)' }}>📚</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs mb-1" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{course.code}</div>
                <div className="font-semibold text-white text-sm leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</div>
                <div className="text-xs mt-1" style={{ color: '#64748b' }}>👤 {course.faculty}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2" style={{ color: '#64748b' }}>
                <span>Progress</span>
                <span style={{ color: progress === 100 ? '#2dd4bf' : '#a78bfa' }}>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: '#1e2d4e' }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, background: progress === 100 ? '#0d9488' : '#7c3aed' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status === 'completed' ? (
                <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(13,148,136,0.15)', color: '#2dd4bf' }}>✓ Completed</span>
              ) : (
                <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>⟳ In Progress</span>
              )}
            </div>
            <Btn
              variant={status === 'completed' ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => navigate('faculty-course-info', {course: courses.find(c=>c.id === course.id)})}>
              {status === 'completed' ? 'Review Course' : 'Continue Learning →'}
            </Btn>
          </div>
        ))}
      </div>
    </div>
  )
}
