//TODO : Implement the course detail view for students. Currently,
// the 'student-course-detail' screen is routed to StudentMyLearning, 
// but it should display detailed information about a specific course, 
// including its content, progress, and any relevant actions (like starting or continuing the course).

import { useEffect, useState } from 'react'
import {useApp} from '../../context'
import type { ICourse, IContentItem } from '../../types'
import {updateLearningProgress,fetchCompletedItemIds,updateLearningStatus} from '../../services/courseService'



export default function StudentCourseDetail({
  course
}: {
  course: ICourse
}) {
  const {currentUser}= useApp();
  if(!currentUser) return;

  const [expandedUnits, setExpandedUnits] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<IContentItem | null>(null)
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const toggleUnit = (unitId: string) => {

    setExpandedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    )
  }

  useEffect(() => {
      const loadProgress = async () => {
        try {
          const data = await fetchCompletedItemIds(course.code, currentUser.id);
          if (data && data.completedItems) {
            setCompletedIds(data.completedItems);
          }
        } catch (error) {
          console.error("Error fetching completed items:", error);
        }
      };    

      loadProgress();
  }, [course.code,currentUser.id]);
  


  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Course information */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {course.title}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Course Code: {course.code} | Faculty: {course.faculty}
        </p>

        <p className="mt-4 leading-relaxed text-slate-300">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-300">
            {course.category}
          </span>

          <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">
            {course.level}
          </span>
        </div>
      </div>

      {/* Course units */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Course Units
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {course.units.length} units · Select a unit to view its materials
          </p>
        </div>

        {course.units.map((unit, index) => {
          const isExpanded = expandedUnits.includes(unit.id)

          return (
            <div
              key={unit.id}
              className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
            >
              {/* Unit heading */}
              <button
                type="button"
                onClick={() => toggleUnit(unit.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-800"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
                    Unit {index + 1}
                  </p>

                  <h3 className="mt-1 font-semibold text-white">
                    {unit.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {unit.content.length} learning materials
                  </p>
                </div>

                <span className="text-xl text-slate-400">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>

              {/* Unit content */}
              {isExpanded && (
                  <div className="space-y-3 border-t border-slate-700 p-4">
                    {unit.content.map(item => {
                      const isSelected = selectedItem?.id === item.id;
                      const isCompleted = completedIds.includes(String(item.id));

                      return (
                        <div
                          key={item.id}
                          className={`rounded-lg border p-4 transition ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/10'
                              : 'border-slate-700 bg-slate-800'
                          }`}
                        >
                          {/* Top Row: Title, Type Badge, and View/Select Button */}
                          <div className="flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="text-left flex-1 focus:outline-none"
                            >
                              <h4 className="font-medium text-white hover:text-indigo-400 transition">
                                {item.title}
                              </h4>
                            </button>
                        
                            <div className="flex items-center gap-2">
                              <span className="shrink-0 rounded bg-slate-700 px-2 py-1 text-xs uppercase text-slate-300">
                                {item.type}
                              </span>
                        
                              {/* Persistent Green Checkmark if completed */}
                              {isCompleted && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
                            
                          {/* Bottom Action Row: Mark as Complete / Completed status */}
                          <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-3">
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="text-xs text-indigo-400 hover:underline"
                            >
                              {isSelected ? 'Currently Viewing' : 'View Content'}
                            </button>
                            
                            {!isCompleted ? (
                              <button
                                type="button"
                                onClick={async () => {
                                  const updatedCompletedIds = [...completedIds, String(item.id)];
                                  setCompletedIds(updatedCompletedIds);
                                  
                                  const totalContentCount = course.units.reduce((acc, unit) => acc + unit.content.length, 0);
                                  const newPercentage = totalContentCount > 0 
                                  ? Math.round((updatedCompletedIds.length / totalContentCount) * 100) 
                                  : 0;

                                  console.log(newPercentage);
                                  if(newPercentage === 100){
                                    updateLearningStatus(course.code,currentUser.id,'completed');
                                  }
                                  updateLearningProgress(course.code,currentUser.id,newPercentage,item.id);
                                }}
                                className="rounded bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-emerald-600 hover:text-white transition"
                              >
                                Mark as Complete
                              </button>
                            ) : (
                              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                                Completed ✓
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
              )}
            </div>
          )
        })}
      </section>

      {/* Selected learning material */}
      {selectedItem && (
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-400">
                {selectedItem.type}
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                {selectedItem.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-white"
              aria-label="Close learning material"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 whitespace-pre-wrap leading-7 text-slate-300">
            {selectedItem.content}
          </div>
        </section>
      )}
    </div>
  )
}

