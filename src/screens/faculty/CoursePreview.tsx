import { useApp } from '../../context'
import { Btn, EmptyState } from '../../components/ui'
import { ContentType, ICourse, type IContentItem } from '../../types'
import { useState,useRef, useEffect} from 'react'
import {AddContentToUnit} from '../../services/FileRelatedServices'
export default function CoursePreview() {
  const { setSelectedCourse,selectedCourse: selectedcourse, navigate } = useApp()

  if (!selectedcourse) return <EmptyState icon="👁" title="No course selected" message="Select a course to preview." />
  const [course,setCourse] = useState<ICourse>();
  const [activeUnitForDropdown, setActiveUnitForDropdown] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [targetUnitId, setTargetUnitId] = useState<string | null>(null);
  const [fileAccept, setFileAccept] = useState<string>('*');
  const [type, setType] = useState<ContentType>('pdf');
  
  const uploadTypeRef = useRef<ContentType>('pdf');

  useEffect(()=>{
    setCourse(selectedcourse);
  },[course])

  const handleOpenFileDialog = (unitId: string,contentType: ContentType) => {
    setTargetUnitId(unitId);
    setSelectedContentType(contentType);
    
    uploadTypeRef.current = contentType;
    
    setType(contentType);
    setActiveUnitForDropdown(null);
    
    const targetAccept = ACCEPTED_FILE_TYPES[contentType];
    setFileAccept(targetAccept);
    console.log(fileAccept);

    if (fileInputRef.current) {
      fileInputRef.current.accept = targetAccept;
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
    
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetUnitId) return;

    const formData = new FormData();
    formData.append('file',file);
    formData.append('unitId', targetUnitId);   
    formData.append('contentType', uploadTypeRef.current);

    
    try {
      if (!course || !course.id) return;
      const result = await AddContentToUnit(selectedcourse.id, formData);
      const newContentItem = result.contentItem as IContentItem;
      newContentItem.type = selectedContentType!;
      const updatedCourse = {
        ...course,
        units: course?.units.map((unit) => {
          if (unit.id === targetUnitId) {
            
            return {
              ...unit,
              content: [...(unit.content || []), newContentItem]
            };
          }
          return unit;
        })
      };

      setCourse(updatedCourse);
      setSelectedCourse(updatedCourse);

    e.target.value = '';
    setTargetUnitId(null);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }


  };

  const ACCEPTED_FILE_TYPES: Record<string, string> = {
    image: 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp',
    pdf: 'application/pdf,.pdf',
    video: 'video/mp4,video/webm,video/quicktime,.mov,.mkv,.mp4',
  };

  const handleContentClick = (item: IContentItem) => {
   
    if (item.type === 'image' || item.type === 'pdf' || item.type === 'video') {
      const fileUrl = `http://localhost:3000/api/content/${item.content}`;
       console.log(item.type);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Course Preview</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>This is how students see this course.</p>
        </div>
        <Btn variant="secondary" onClick={() => navigate('faculty-course-info', { course: selectedcourse })}>← Back to Course</Btn>
      </div>

      {/* Hero */}
      <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a3d, #0a2330)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124,58,237,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(13,148,136,0.2) 0%, transparent 50%)' }} />
        <div className="relative">
          <div className="text-xs mb-3 px-2 py-1 rounded w-fit" style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace' }}>
            {selectedcourse.code} · {selectedcourse.level}
          </div>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{selectedcourse.title}</h2>
          <p className="text-sm max-w-2xl mb-5" style={{ color: '#94a3b8', lineHeight: '1.7' }}>{selectedcourse.description}</p>
          <div className="flex items-center gap-5 text-sm" style={{ color: '#64748b' }}>
            <span>👤 {selectedcourse.faculty}</span>
            <span>🏷 {selectedcourse.category}</span>
            <span>📦 {selectedcourse.units.length} units</span>
            <span>👥 {selectedcourse.enrolledStudents.length} enrolled</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl" style={{ border: '1px solid #1a2540' }}>
            <div className="px-5 py-4" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
              <h3 className="font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Course Content</h3>
            </div>
            <div style={{ background: '#111827' }}>
              {course?.units.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: '#334155' }}>No units available.</div>
              ) : (
                course?.units.map((unit, idx) => (
                  <div key={unit.id} style={{ borderBottom: '1px solid #1a2540' }}>
                    <div className="px-5 py-3 flex items-center gap-3" style={{ background: '#0d1420' }}>
                      <span className="text-xs font-bold" style={{ color: '#7c3aed' }}>{idx + 1}</span>
                      <span className="text-sm font-medium text-white">{unit.title}</span>
                      <span className="ml-auto text-xs" style={{ color: '#475569' }}>{unit.content.length} items</span>
                    </div>

                    {unit.content.map(item => (
                      <button key={item.id}
                        className="w-full flex items-center gap-3 px-8 py-3 text-left transition-colors"
                        style={{ color: '#94a3b8' }}
                        onMouseEnter={e => { (e.currentTarget.style.background = '#141d2e'); (e.currentTarget.style.color = '#e2e8f0') }}
                        onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = '#94a3b8') }}
                        onClick={() => navigate('faculty-document-preview', { content: item, course:selectedcourse })}>
                        <span>{item.type === 'pdf' ? '📄' : item.type === 'video' ? '🎥' :  item.type ==='image'? '🖼️' : '🔗' }</span>
                        <span className="text-sm">{item.title}</span>
                        <span className="ml-auto text-xs" style={{ color: '#334155' }}>{item.type}</span>
                      </button>
                    ))}
                    <div className="px-8 py-3 relative" style={{ background: '#0f172a' }}>

                      {unit.content && unit.content.length > 0 && (
                        <div className="space-y-1.5 mb-3">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Unit Content</div>
                          {unit.content.map((item) => {
                           
                            const iconMap: Record<string, string> = {
                              pdf: '📄',
                              video: '🎥',
                              image: '🖼️',
                              link: '🔗',
                              quiz: '❓'
                            };
                          
                            return (
                              <div 
                                key={item.id}
                                onClick={() => handleContentClick(item)} 
                                className="group flex items-center justify-between p-2 rounded-md bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition"
                              >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <span className="text-sm">{iconMap[item.type] || '📁'}</span>
                                  <span className="text-xs font-medium text-slate-200 truncate group-hover:text-indigo-300 transition">
                                    {item.title}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-900">
                                  {item.type}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      

                      <button
                        type="button"
                        onClick={() => setActiveUnitForDropdown(activeUnitForDropdown === unit.id ? null : unit.id)}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1.5"
                        >
                      <span>+ Add Content to Unit</span>
                      </button>

                      {/* Dropdown options */}
                      {activeUnitForDropdown === unit.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveUnitForDropdown(null)} 
                        />
                        <div 
                          className="absolute left-8 mt-2 w-56 rounded-lg p-3 space-y-2 shadow-2xl z-20" 
                          style={{ background: '#1e293b', border: '1px solid #334155' }}
                        >
                        <div className="text-xs font-semibold text-slate-400 mb-1">Select Content Type:</div>
                          {/*PDF*/}
                          <button
                            type="button"
                            onClick={() => {
                              handleOpenFileDialog(unit.id,"pdf");
                              setActiveUnitForDropdown(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-slate-200 rounded hover:bg-slate-700 transition flex items-center gap-2"
                          >
                          <span>📄</span> Add PDF Document
                          </button>

                          {/*video*/}
                          <button
                            type="button"
                            onClick={() => {
                              handleOpenFileDialog(unit.id,"video");
                              setActiveUnitForDropdown(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-slate-200 rounded hover:bg-slate-700 transition flex items-center gap-2"
                          >
                            <span>🎥</span> Add Video
                          </button>

                          {/*Image*/}
                          <button
                            type="button"
                            onClick={() => {
                              handleOpenFileDialog(unit.id,"image");
                              setActiveUnitForDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                          >
                            <span>🖼️</span> Add Img 
                          </button>

                          {/*Link / URL*/}
                          <button
                            type="button"
                            onClick={() => {
                              handleOpenFileDialog(unit.id,"link");
                              setActiveUnitForDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                          >
                            <span>🔗</span> Add Link / URL 
                          </button>

                        </div>
                        </>
                      )}
                    </div>
                      
                      
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Syllabus */}
          <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
            <h3 className="font-semibold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Syllabus</h3>
            {selectedcourse.syllabus.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-start gap-2 py-2" style={{ borderBottom: '1px solid #1a2540' }}>
                <span className="text-xs flex-shrink-0 mt-1" style={{ color: '#475569' }}>{i + 1}.</span>
                <span className="text-xs text-white">{s.topic}</span>
              </div>
            ))}
          </div>

          {/* Experiments */}
          <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1a2540' }}>
            <h3 className="font-semibold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Experiments</h3>
            {selectedcourse.experiments.slice(0, 4).map(e => (
              <div key={e.id} className="py-2" style={{ borderBottom: '1px solid #1a2540' }}>
                <div className="text-xs font-medium text-white">{e.title}</div>
              </div>
            ))}
          </div>
        </div>

          <input 
            type="file" 
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept={fileAccept}
            onChange={handleFileChange}
          />

      </div>
    </div>
  )
}
