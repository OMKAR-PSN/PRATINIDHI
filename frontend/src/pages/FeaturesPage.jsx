import React from 'react'
import Sidebar from '../components/Sidebar'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center py-24 glass-card rounded-3xl p-12">
            <div className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              Relocated
            </div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Features Overview Moved
            </h1>
            <p className="text-gray-500 text-lg mb-8">
              The comprehensive 20-point platform features overview has been moved to our public Landing Page for better visibility to all citizens and officials.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              View Features on Landing Page
            </Link>
        </div>
      </div>
    </div>
  )
}

