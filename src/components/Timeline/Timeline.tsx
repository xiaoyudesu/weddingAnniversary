import React, { useState, useEffect, useRef } from 'react'
import { TimelineCard } from './TimelineCard'
import { DiaryModal } from '../DiaryModal/DiaryModal'
import { timelineData2 } from '../../data/timelineData2'
import { ChevronLeft, ChevronRight, Heart, Calendar, Clock, Play, Pause } from 'lucide-react'
import musicFile from '@/assets/青麦の道.mp3'

export const Timeline: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedDiary, setSelectedDiary] = useState<typeof timelineData2[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 计算时间统计 - 基于当前页面日期，从第1天开始计算
  const calculateDaysFromDate = (startDate: string, endDate: string): number => {
    // 解析日期字符串，确保正确处理YYYY-MM-DD格式
    const startParts = startDate.split('-').map(Number)
    const endParts = endDate.split('-').map(Number)
    
    // 创建日期对象，月份需要减1（JavaScript中月份从0开始）
    const start = new Date(startParts[0], startParts[1] - 1, startParts[2])
    const end = new Date(endParts[0], endParts[1] - 1, endParts[2])
    
    // 设置时间为午夜以避免时区问题
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    
    const diffTime = end.getTime() - start.getTime()
    // 加1天，让起始日算为第1天而不是第0天
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  // 简化显示 - 分离数字和单位，便于分行显示
  const formatDaysDisplay = (days: number): { number: string; unit: string } => {
    return { number: days.toString(), unit: '天' }
  }

  // 获取当前页面日期
  const getCurrentPageDate = () => {
    return timelineData2[currentIndex]?.date || new Date().toISOString().split('T')[0]
  }

  // 基于当前页面日期的动态统计
  const getDynamicStats = () => {
    const currentDate = getCurrentPageDate()
    
    // 重要日期 - 使用与时间线数据一致的格式 (YYYY-MM-DD)
    const firstMeetingDate = '2022-04-24' // 相知开始
    const reunionDate = '2023-02-04' // 再相遇开始  
    const marriageDate = '2024-11-23' // 结婚开始
    
    const stats = []
    
    // 相知统计 - 从第一次相遇开始
    if (currentDate >= firstMeetingDate) {
      const days = calculateDaysFromDate(firstMeetingDate, currentDate)
      if (days >= 0) { // 确保天数不为负数
        stats.push({
          label: '相知',
          days: days,
          icon: Heart,
          color: 'text-pink-600',
          iconColor: 'text-pink-500'
        })
      }
    }
    
    // 再相遇统计 - 从重逢开始
    if (currentDate >= reunionDate) {
      const days = calculateDaysFromDate(reunionDate, currentDate)
      if (days >= 0) { // 确保天数不为负数
        stats.push({
          label: '再相遇',
          days: days,
          icon: Calendar,
          color: 'text-purple-600',
          iconColor: 'text-purple-500'
        })
      }
    }
    
    // 结婚统计 - 从结婚开始
    if (currentDate >= marriageDate) {
      const days = calculateDaysFromDate(marriageDate, currentDate)
      if (days >= 0) { // 确保天数不为负数
        stats.push({
          label: '领证',
          days: days,
          icon: Clock,
          color: 'text-indigo-600',
          iconColor: 'text-indigo-500'
        })
      }
    }
    
    return stats
  }

  const dynamicStats = getDynamicStats()

  // 调试信息
  useEffect(() => {
    console.log('当前索引:', currentIndex)
    console.log('当前页面日期:', getCurrentPageDate())
    console.log('动态统计:', dynamicStats)
    console.log('当前数据项:', timelineData2[currentIndex])
  }, [currentIndex])

  const nextNode = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % timelineData2.length)
      setIsTransitioning(false)
    }, 300)
  }

  const prevNode = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + timelineData2.length) % timelineData2.length)
      setIsTransitioning(false)
    }, 300)
  }

  const openDiary = (node: typeof timelineData2[0]) => {
    setSelectedDiary(node)
    setIsModalOpen(true)
  }

  const closeDiary = () => {
    setIsModalOpen(false)
    setSelectedDiary(null)
  }

  // 音乐播放控制
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio(musicFile)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3 // 设置音量为30%
    
    // 自动播放
    const playAudio = async () => {
      try {
        await audioRef.current?.play()
      } catch {
        console.log('自动播放被阻止，等待用户交互')
        setIsPlaying(false)
      }
    }
    
    playAudio()
    
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('键盘事件:', event.key)
      if (event.key === 'ArrowLeft') {
        prevNode()
      } else if (event.key === 'ArrowRight') {
        nextNode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 触摸滑动支持 - 添加过渡效果
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.changedTouches[0].screenX
    }

    const handleTouchEnd = (event: TouchEvent) => {
      touchEndX = event.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) {
        nextNode() // 向左滑动
      }
      if (touchEndX > touchStartX + 50) {
        prevNode() // 向右滑动
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isTransitioning])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* 音乐控制按钮 */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group absolute overflow-hidden flex items-center justify-center w-12 h-12"
        title={isPlaying ? '暂停音乐' : '播放音乐'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 group-hover:text-pink-700 leading-none" />
        ) : (
          <Play className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-pink-600 leading-none" />
        )}
        {isPlaying && (
          <div className="eq-wrap">
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
          </div>
        )}
      </button>
      {/* 背景图片模糊效果 */}
      {timelineData2[currentIndex].image && (
        <div className="fixed inset-0 z-0">
          <img
            src={timelineData2[currentIndex].image}
            alt=""
            className="w-full h-full object-cover blur-xl opacity-20 scale-110"
          />

        </div>
      )}

      {/* 时间统计 - 基于当前页面日期的动态统计 */}
      <div className="fixed top-4 left-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="text-center mb-2">
            <span className="text-sm font-medium text-gray-600">截至 {getCurrentPageDate()}</span>
          </div>
          <div className="flex justify-center space-x-4">
            {dynamicStats.map((stat, index) => {
              const formatted = formatDaysDisplay(stat.days)
              return (
                <div key={index} className="text-center min-w-16">
                  <div className="flex items-center justify-center mb-1">
                    <stat.icon className={`w-4 h-4 ${stat.iconColor} mr-1`} />
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} leading-tight`}>
                    {formatted.number}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatted.unit}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      

      {/* 时间轴内容 - 添加过渡效果 */}
      <div className={`flex items-center justify-center min-h-screen relative z-10 transition-all duration-300 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <TimelineCard
          node={timelineData2[currentIndex]}
          onDiaryClick={() => openDiary(timelineData2[currentIndex])}
          isActive={true}
        />
      </div>

      {/* 日记弹窗 */}
      {selectedDiary && (
        <DiaryModal
          isOpen={isModalOpen}
          onClose={closeDiary}
          title={selectedDiary.title}
          content={selectedDiary.diary.content}
          date={selectedDiary.date}
          subtext={selectedDiary.subtext}
        />
      )}

      {/* 底部提示 */}
      <div className="fixed left-0 right-0 bottom-4 z-20 flex items-center justify-center gap-4 px-4 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={prevNode}
          className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group nav-button flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12"
          title="上一页"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-pink-600 leading-none" />
        </button>
        <p className="text-gray-700 text-sm bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          {currentIndex + 1} / {timelineData2.length}
        </p>
        <button
          onClick={nextNode}
          className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group nav-button flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12"
          title="下一页"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-pink-600 leading-none" />
        </button>
      </div>
    </div>
  )
}
