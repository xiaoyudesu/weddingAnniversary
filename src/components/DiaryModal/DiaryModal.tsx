import React from 'react'
import { X } from 'lucide-react'

interface DiaryModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  date: string
  subtext?: string
}

export const DiaryModal: React.FC<DiaryModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  date, 
  subtext 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-lg w-full max-h-[80vh] shadow-2xl border border-white/20 overflow-hidden">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-pink-100 p-6 flex justify-between items-center rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{date}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-100 rounded-full transition-all duration-300 group"
          >
            <X className="w-6 h-6 text-gray-600 group-hover:text-pink-600 transition-colors" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="p-8">
            {/* 副标题 - 如果有的话 */}
            {subtext && (
              <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 shadow-sm">
                <p className="text-pink-800 text-lg font-medium text-center leading-relaxed">
                  {subtext}
                </p>
              </div>
            )}
            
            {/* 日记内容 - 更好的格式化 */}
            <div className="prose prose-pink max-w-none">
              <div className="text-gray-800 leading-relaxed text-base font-medium space-y-4">
                {content.split('\n').map((paragraph, index) => {
                  if (!paragraph.trim()) return null
                  return (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* 装饰性底部 */}
          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 h-2" />
        </div>
      </div>
    </div>
  )
}