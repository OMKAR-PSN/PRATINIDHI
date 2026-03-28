import { ChevronDown } from 'lucide-react'

export default function LanguageSelector() {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer group">
      {/* Indic Translation Icon (अ/A) */}
      <div className="flex items-baseline font-bold text-saffron-500 leading-none tracking-tight">
        <span className="text-[17px] font-sans">अ</span>
        <span className="text-[13px] font-sans ml-[1px]">A</span>
      </div>
      
      {/* Language Text */}
      <span className="text-gray-800 font-medium text-[15px] ml-1">English</span>
      
      {/* Dropdown Chevron */}
      <ChevronDown className="w-4 h-4 text-gray-500 ml-1 group-hover:text-gray-800 transition-colors" />
    </div>
  )
}
