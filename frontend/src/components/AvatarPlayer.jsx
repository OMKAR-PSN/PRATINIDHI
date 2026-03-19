import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'
import { useState, useRef } from 'react'

export default function AvatarPlayer({ videoUrl, title, compact = false }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(pct || 0)
    }
  }

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden shadow-xl ${compact ? 'max-w-sm' : 'max-w-2xl'} w-full`}>
      {/* Video */}
      <div className="relative aspect-video bg-black">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-3">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-sm text-gray-600">No video generated yet</p>
          </div>
        )}

        {/* Play overlay */}
        {videoUrl && !isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-saffron-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={togglePlay} className="text-white hover:text-saffron-400 transition-colors">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={handleRestart} className="text-white hover:text-saffron-400 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={toggleMute} className="text-white hover:text-saffron-400 transition-colors">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
        {title && <span className="text-sm text-gray-400 truncate max-w-[200px]">{title}</span>}
        <button onClick={handleFullscreen} className="text-white hover:text-saffron-400 transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
