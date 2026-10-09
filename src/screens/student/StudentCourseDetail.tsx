//TODO : Implement the course detail view for students. Currently,
// the 'student-course-detail' screen is routed to StudentMyLearning, 
// but it should display detailed information about a specific course, 
// including its content, progress, and any relevant actions (like starting or continuing the course).

import { useState } from 'react'
import type { ICourse, IContentItem } from '../../types'

export default function StudentCourseDetail({
  course,
  content
}: {
  course: ICourse
  content: IContentItem[] | undefined
}) {
  const [expandedUnits, setExpandedUnits] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<IContentItem | null>(null)

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    )
  }

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
                  {unit.content.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={`block w-full rounded-lg border p-4 text-left transition ${
                        selectedItem?.id === item.id
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-medium text-white">
                          {item.title}
                        </h4>

                        <span className="shrink-0 rounded bg-slate-700 px-2 py-1 text-xs uppercase text-slate-300">
                          {item.type}
                        </span>
                      </div>
                    </button>
                  ))}
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

