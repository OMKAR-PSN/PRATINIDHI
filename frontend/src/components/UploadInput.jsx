import { Upload, Image, X } from 'lucide-react'
import { useState, useRef } from 'react'

export default function UploadInput({ label, accept = 'image/*', onFileSelect, preview = true }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const inputRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      if (preview && selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected))
      }
      onFileSelect && onFileSelect(selected)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) {
      setFile(dropped)
      if (preview && dropped.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(dropped))
      }
      onFileSelect && onFileSelect(dropped)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreviewUrl(null)
    if (inputRef.current) inputRef.current.value = ''
    onFileSelect && onFileSelect(null)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
      )}
      
      {!file ? (
        <div
          className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary-300 hover:bg-primary-50/30 transition-all cursor-pointer group"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop your file here, or <span className="text-primary-500 underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border border-gray-200 rounded-2xl overflow-hidden bg-white">
          {previewUrl ? (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <Image className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
          {previewUrl && (
            <div className="px-4 py-3 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
