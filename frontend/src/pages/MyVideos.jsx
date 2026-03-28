import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getMyAvatarVideos,
  toggleAvatarVideoPublic,
  deleteAvatarVideo,
} from '../services/api'

const LANGUAGE_OPTIONS = [
  { label: 'All Languages', code: '' },
  { label: 'Hindi', code: 'hi' },
  { label: 'Marathi', code: 'mr' },
  { label: 'Tamil', code: 'ta' },
  { label: 'Telugu', code: 'te' },
  { label: 'Kannada', code: 'kn' },
  { label: 'Bengali', code: 'bn' },
  { label: 'Gujarati', code: 'gu' },
  { label: 'Punjabi', code: 'pa' },
  { label: 'English', code: 'en' },
]

const LANG_COLORS = {
  hi: 'from-orange-500 to-red-500',
  mr: 'from-yellow-500 to-orange-500',
  ta: 'from-blue-500 to-indigo-500',
  te: 'from-teal-500 to-cyan-500',
  kn: 'from-purple-500 to-violet-500',
  bn: 'from-green-500 to-teal-500',
  gu: 'from-pink-500 to-rose-500',
  pa: 'from-amber-500 to-yellow-500',
  en: 'from-slate-400 to-slate-500',
}

export default function MyVideos() {
  const navigate = useNavigate()
  const leaderId = localStorage.getItem('leader_id') || ''

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filterLang, setFilterLang] = useState('')
  const [searchTitle, setSearchTitle] = useState('')
  const [openMenu, setOpenMenu] = useState(null) // video_id of the open 3-dot menu

  const menuRef = useRef(null)

  const fetchVideos = async (pg = 1) => {
    if (!leaderId) return
    setLoading(true)
    try {
      const params = { page: pg, limit: 12 }
      if (filterLang) params.language = filterLang
      const res = await getMyAvatarVideos(leaderId, params)
      const data = res.data
      let vids = data.videos || []
      // Client-side search
      if (searchTitle) {
        const q = searchTitle.toLowerCase()
        vids = vids.filter(v => (v.title || '').toLowerCase().includes(q))
      }
      setVideos(vids)
      setTotal(data.total || 0)
      setTotalPages(data.total_pages || 1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos(page)
    // eslint-disable-next-line
  }, [page, filterLang])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTogglePublic = async (video) => {
    try {
      await toggleAvatarVideoPublic(leaderId, video.id)
      setVideos(prev =>
        prev.map(v => v.id === video.id ? { ...v, is_public: !v.is_public } : v)
      )
    } catch (e) {
      console.error(e)
    }
    setOpenMenu(null)
  }

  const handleDelete = async (video) => {
    if (!window.confirm(`Delete this ${video.language_name} video? This cannot be undone.`)) return
    try {
      await deleteAvatarVideo(leaderId, video.id)
      setVideos(prev => prev.filter(v => v.id !== video.id))
      setTotal(prev => prev - 1)
    } catch (e) {
      console.error(e)
    }
    setOpenMenu(null)
  }

  const copyLink = (video) => {
    navigator.clipboard.writeText(video.cloudinary_url || '')
    setOpenMenu(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">My Avatar Videos</h1>
            <p className="text-sm text-gray-400">{total} video{total !== 1 ? 's' : ''} generated</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/generate-avatar')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
        >
          + Generate New
        </button>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 border-b border-gray-800 flex flex-wrap gap-3 items-center">
        <select
          value={filterLang}
          onChange={e => { setFilterLang(e.target.value); setPage(1) }}
          className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {LANGUAGE_OPTIONS.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchVideos(1)}
          placeholder="Search by title..."
          className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-52"
        />
        <button
          onClick={() => fetchVideos(1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm transition"
        >
          Search
        </button>
        {(filterLang || searchTitle) && (
          <button
            onClick={() => { setFilterLang(''); setSearchTitle(''); fetchVideos(1) }}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-800" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-6">🎬</div>
            <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
            <p className="text-gray-400 mb-6">Generate your first avatar video to reach all your receivers in their native language.</p>
            <button
              onClick={() => navigate('/dashboard/generate-avatar')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Generate Avatar Video
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" ref={menuRef}>
              {videos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  onTogglePublic={handleTogglePublic}
                  onDelete={handleDelete}
                  onCopyLink={copyLink}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 text-sm transition"
                >
                  ← Prev
                </button>
                <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 text-sm transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function VideoCard({ video, openMenu, setOpenMenu, onTogglePublic, onDelete, onCopyLink }) {
  const gradClass = LANG_COLORS[video.target_language] || 'from-gray-500 to-gray-600'
  const isMenuOpen = openMenu === video.id

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch { return '' }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-black/50 group">
      {/* Thumbnail / Video Preview */}
      <div className="relative h-44 bg-gray-800 overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradClass} flex items-center justify-center`}>
            <span className="text-4xl">🎬</span>
          </div>
        )}
        {/* Language Badge */}
        <div className={`absolute top-2 left-2 bg-gradient-to-r ${gradClass} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow`}>
          {video.language_name || video.target_language}
        </div>
        {/* Public/Private Badge */}
        <div className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-1 rounded-full
          ${video.is_public
            ? 'bg-green-500/80 text-white'
            : 'bg-gray-700/80 text-gray-300'
          }`}
        >
          {video.is_public ? '🌐 Public' : '🔒 Private'}
        </div>
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={video.cloudinary_url}
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
            onClick={e => e.stopPropagation()}
          >
            ▶
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm truncate">{video.title || 'Untitled'}</h4>
            <p className="text-gray-500 text-xs mt-0.5">{formatDate(video.created_at)}</p>
          </div>
          {/* 3-dot menu */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(isMenuOpen ? null : video.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
            >
              ⋯
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-8 min-w-44 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                <button
                  onClick={() => onTogglePublic(video)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2 transition"
                >
                  {video.is_public ? '🔒 Make Private' : '🌐 Make Public'}
                </button>
                <button
                  onClick={() => onCopyLink(video)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2 transition"
                >
                  🔗 Copy Share Link
                </button>
                <a
                  href={video.cloudinary_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2 transition block"
                  onClick={() => setOpenMenu(null)}
                >
                  ⬇️ Download
                </a>
                <hr className="border-gray-700 my-1" />
                <button
                  onClick={() => onDelete(video)}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span>👁 {video.view_count || 0} views</span>
          {video.receivers_count > 0 && <span>👥 {video.receivers_count} receivers</span>}
          {video.duration_seconds > 0 && <span>⏱ {video.duration_seconds}s</span>}
        </div>
      </div>
    </div>
  )
}
