import { useEffect, useState } from 'react'
import {useApp} from '../../context'
import type { ICourse, IContentItem } from '../../types'
import {updateLearningProgress,fetchCompletedItemIds,updateLearningStatus} from '../../services/courseService'

  interface ContentPreviewProps {
    item: IContentItem;
    onClose: () => void;
  }

export const ContentPreviewModal: React.FC<ContentPreviewProps> = ({ item, onClose }) => {
  // The streaming URL pointing directly to your backend endpoint
  const fileUrl = `http://localhost:3000/api/content/${item.content}`;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{item.title}</h3>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="preview-body">
          {/* Render different preview elements based on the content type */}
          {item.type === 'image' && (
            <img src={fileUrl} alt={item.title} style={{ maxWidth: '100%', maxHeight: '70vh' }} />
          )}

          {item.type === 'video' && (
            <video controls width="100%" style={{ maxHeight: '70vh' }}>
              <source src={fileUrl} />
              Your browser does not support the video tag.
            </video>
          )}

          {item.type === 'pdf' && (
            <iframe src={fileUrl} title={item.title} width="100%" height="500px" />
          )}

          {item.type === 'link' && (
            <a href={item.content} target="_blank" rel="noopener noreferrer">
              Open External Link: {item.content}
            </a>
          )}
        </div>

        <div className="modal-footer">
          {/* Optional download button if they want to save it locally */}
          <a href={fileUrl} download={item.title} className="download-btn">
            Download File
          </a>
        </div>
      </div>
    </div>
  );
};


export default function StudentCourseDetail({
  selectedcourse
}: {
  selectedcourse: ICourse
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
          const data = await fetchCompletedItemIds(selectedcourse.code, currentUser.id);
          if (data && data.completedItems) {
            setCompletedIds(data.completedItems);
          }
        } catch (error) {
          console.error("Error fetching completed items:", error);
        }
      };    

      loadProgress();
  }, [selectedcourse.code,currentUser.id,selectedcourse.units]);
  


  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Course information */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {selectedcourse.title}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Course Code: {selectedcourse.code} | Faculty: {selectedcourse.faculty}
        </p>

        <p className="mt-4 leading-relaxed text-slate-300">
          {selectedcourse.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-300">
            {selectedcourse.category}
          </span>

          <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">
            {selectedcourse.level}
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
            {selectedcourse.units.length} units · Select a unit to view its materials
          </p>
        </div>

        {selectedcourse.units.map((unit, index) => {
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
                              onClick={() => {
                                setSelectedItem(item); 
                              }}
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
                              onClick={() => {
                                setSelectedItem(item); 
                              }}
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
                                  
                                  const totalContentCount = selectedcourse.units.reduce((acc, unit) => acc + unit.content.length, 0);
                                  const newPercentage = totalContentCount > 0 
                                  ? Math.round((updatedCompletedIds.length / totalContentCount) * 100) 
                                  : 0;


                                  if(newPercentage === 100){
                                    updateLearningStatus(selectedcourse.code,currentUser.id,'completed');
                                  }
                                  updateLearningProgress(selectedcourse.code,currentUser.id,newPercentage,item.id);
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
              <ContentPreviewModal 
                  item={selectedItem} 
                  onClose={() => setSelectedItem(null)} 
               />
          </div>
        </section>
      )}
    </div>
  )
}

