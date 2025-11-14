import React, { useState } from 'react'
import { Heart, Calendar, ZoomIn } from 'lucide-react'
import { TimelineNode } from '../../data/timelineData2'

interface TimelineCardProps {
  node: TimelineNode
  onDiaryClick: () => void
  isActive: boolean
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ 
  node, 
  onDiaryClick, 
  isActive 
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const openImageModal = () => {
    if (node.image) {
      setIsImageModalOpen(true)
    }
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  // 获取背景样式
  const getBackgroundStyle = () => {
    if (node.image) {
      return {
        backgroundImage: `url(${node.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    } else if (node.themeColor) {
      return {}
    } else {
      return {}
    }
  }

  return (
    <div style={{width:'100%'}} className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700 transform ${
      isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
    }`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full border border-white/20">
        {/* 图片区域 - 无图片时显示更优雅的渐变和装饰 */}
        <div 
          className={`relative h-72 cursor-pointer group ${
            node.image 
              ? '' 
              : node.themeColor 
                ? `bg-gradient-to-br ${node.themeColor}` 
                : 'bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200'
          }`}
          style={node.image ? {
            backgroundImage: `url(${node.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          } : {}}
          onClick={openImageModal}
        >
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* 无图片时显示subtext */}
          {!node.image && node.subtext && (
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <div className={`text-xl font-medium text-center leading-relaxed drop-shadow-lg ${
                node.themeColor?.includes('green') 
                  ? 'text-green-800' 
                  : node.themeColor?.includes('purple')
                    ? 'text-purple-800'
                    : node.themeColor?.includes('pink')
                      ? 'text-pink-800'
                      : node.themeColor?.includes('blue')
                        ? 'text-blue-800'
                        : 'text-gray-800'
              }`}>
                {node.subtext}
              </div>
            </div>
          )}
          
          {/* 图片放大按钮 */}
          {node.image && (
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </div>
          )}
          
          {/* 标题覆盖 */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-white text-3xl font-bold drop-shadow-lg leading-tight">
              {node.title}
            </h2>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-8">
          <div className="flex items-center text-gray-600 text-base mb-6">
            <Calendar className="w-5 h-5 mr-3 text-pink-500" />
            <span className="font-medium">{node.date}</span>
          </div>

          <button
            onClick={onDiaryClick}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            <span>查看日记</span>
          </button>
        </div>
      </div>
          
      {/* 图片放大模态框 */}
      {isImageModalOpen && node.image && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={node.image}
              alt={node.title}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-300"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}