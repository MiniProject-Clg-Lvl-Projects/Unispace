import { useApp } from '../../context'
import { Btn, EmptyState } from '../../components/ui'
import type {IContentItem} from '../../types';
import { useEffect, useState } from 'react';
import CoursePreview from './CoursePreview';

 interface ContentPreviewProps {
    item: IContentItem | null;
    onClose: () => void;
}

export const ContentPreviewModal: React.FC<ContentPreviewProps> = ({ item, onClose }) => {
  if (!item) return null;
  const fileUrl = `http://localhost:3000/api/content/${item.content}`;
  return (
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
      </div>);
}


export default function DocumentPreview() {
  const { selectedCourse: course, selectedContent: content, navigate } = useApp()

  if (!content || !course) return <EmptyState icon="📄" title="No document selected" message="Select a document to preview." />

  const allContent = course.units.flatMap(u => u.content.map((c, i) => ({ ...c, unitTitle: u.title, idx: i, unitId: u.id })))
  const currentIdx = allContent.findIndex(c => c.id === content.id)
  const prev = currentIdx > 0 ? allContent[currentIdx - 1] : null
  const next = currentIdx < allContent.length - 1 ? allContent[currentIdx + 1] : null

  const typeIcon = content.type === 'pdf' ? '📄' : content.type === 'video' ? '🎥' : '❓'
  const typeBg = content.type === 'pdf' ? '#7c3aed' : content.type === 'video' ? '#0d9488' : '#f59e0b'
  const [selectedItem, setSelectedItem] = useState<IContentItem | null>(null)
  const [isVideoLoaded,setVideoLoaded] = useState<boolean>();
  
  useEffect(()=>{
    setSelectedItem(allContent[currentIdx]);
  },[]);

  const loadVideo = (item: IContentItem) =>{
    setVideoLoaded(true);
    setSelectedItem(item);
  }
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl" style={{ background: `${typeBg}22` }}>{typeIcon}</div>
          <div>
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{content.title}</h1>
            <p className="text-xs" style={{ color: '#475569' }}>{course.title}</p>
          </div>
        </div>
        <Btn variant="secondary" size="sm" onClick={() => navigate('faculty-course-preview', { course })}>✕ Close</Btn>
      </div>

      {/* Document viewer */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a2540' }} >
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2540' }}>
          <span className="text-sm" style={{ color: '#64748b' }}>{content.title}</span>
          <div className="ml-auto flex gap-2">
            {/* <button className="text-xs px-2 py-1 rounded" style={{ background: '#1a2540', color: '#64748b' }}>⊞ Fullscreen</button>
            <button className="text-xs px-2 py-1 rounded" style={{ background: '#1a2540', color: '#64748b' }}>↓ Download</button> */}
          </div>
        </div>

        {/* Content area */}
          <div className="p-8" style={{ background: '#111827', minHeight: '400px' }} >
          {content.type === 'video' ? ( 
            isVideoLoaded ? (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl" style={{ background: '#0a0f1a', border: '2px dashed #1e2d4e' }}>

              <div className="text-5xl mb-4">🎥</div>
              
              <p className="text-white font-medium mb-2">{content.title}</p>
              <p className="text-sm" style={{ color: '#475569' }}>Video content — click play to watch</p>
               <button className="mt-4 w-14 h-14 rounded-full flex items-center justify-center text-xl"
                style={{ background: '#7c3aed', color: '#fff' }} onClick={()=> {
                  loadVideo(content);
                }}>▶</button> 
            </div>
            ):(

              <ContentPreviewModal
              item={selectedItem}
              onClose = {() => setSelectedItem(null)}
              />
              
            )

          ) : content.type === 'quiz' ? (
            <div className="space-y-5">
              <div className="p-4 rounded-lg" style={{ background: '#0a0f1a', border: '1px solid #1a2540' }}>
                <p className="text-sm font-medium text-white mb-1">📝 Quiz Instructions</p>
                <p className="text-sm" style={{ color: '#64748b', lineHeight: '1.7' }}>{content.content}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="prose max-w-none">
                {content.content.split('\n').map((para, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed"
                    style={{
                      color: '#94a3b8',
                      lineHeight: '1.8',
                      marginBottom: '1rem'
                    }}
                  >
                    {para}
                  </p>
                ))}

                {selectedItem && (
                  <ContentPreviewModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#0a0f1a', borderTop: '1px solid #1a2540' }}>
          <Btn variant="secondary" size="sm" disabled={!prev} onClick={()=>{
            if(!prev) return;
            setSelectedItem(prev);
            navigate('faculty-document-preview', { content: prev, course })
          }}>
            
            ← Previous
          </Btn>
          <span className="text-xs" style={{ color: '#475569' }}>
            {currentIdx + 1} of {allContent.length}
          </span>
          <Btn variant="primary" size="sm" disabled={!next}
          onClick={()=>{
            if(!next) return;
            setSelectedItem(next);
            navigate('faculty-document-preview', { content: next, course })
          }}>
            Next →
          </Btn>
        </div>
      </div>
    </div>
  )
}
