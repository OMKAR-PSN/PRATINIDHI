import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getReceivers, addReceiver, uploadReceivers } from '../services/api'
import { Users, UserPlus, Phone, Mail, Globe, MapPin, CheckSquare, Loader2, Upload } from 'lucide-react'

export default function Receivers() {
  const [receivers, setReceivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  
  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    receiver_email: '',
    receiver_type: 'citizen',
    language: 'hindi',
    state: '',
    district: '',
    has_whatsapp: false,
    is_app_user: false
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const leaderId = localStorage.getItem('leaderId')

  const fetchReceivers = async () => {
    try {
      const { data } = await getReceivers(leaderId || 'admin')
      setReceivers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (leaderId) fetchReceivers()
  }, [leaderId])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    
    if (!formData.receiver_name) {
      setFormError('Receiver name is required')
      return
    }
    if (!formData.receiver_phone && !formData.receiver_email && !formData.is_app_user) {
      setFormError('At least one contact method (Phone, Email, or App) must be provided')
      return
    }

    setAdding(true)
    try {
      await addReceiver({ ...formData, leader_id: leaderId || 'admin' })
      setFormSuccess('Contact added successfully!')
      setFormData({
        receiver_name: '', receiver_phone: '', receiver_email: '', 
        receiver_type: 'citizen', language: 'hindi', state: '', district: '', 
        has_whatsapp: false, is_app_user: false
      })
      fetchReceivers()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to add contact')
    } finally {
      setAdding(false)
      setTimeout(() => setFormSuccess(''), 3000)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setFormError('')
    setFormSuccess('')
    setLoading(true)
    try {
      const { data } = await uploadReceivers(leaderId || 'admin', file)
      setFormSuccess(data.message)
      fetchReceivers()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to upload file. Please check the format.')
    } finally {
      setLoading(false)
      e.target.value = '' // Reset so same file can be re-uploaded
      setTimeout(() => setFormSuccess(''), 5000)
    }
  }

  return (
    <div className="min-h-screen gradient-subtle tech-grid flex">
      <Sidebar />
      <div className="ml-64 p-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" /> My Receivers
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your private broadcast list</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="file" accept=".csv,.xlsx,.xls" id="csvUpload" className="hidden" onChange={handleFileUpload} />
            <label htmlFor="csvUpload" className="px-4 py-2.5 rounded-xl glass-card text-gray-700 font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-white transition-all btn-press shadow-sm border border-gray-200/50">
              <Upload className="w-4 h-4 text-emerald-500" /> Upload CSV / Excel
            </label>
            <span className="text-xs font-bold px-3 py-2 bg-white/50 rounded-xl text-gray-600 border border-gray-200/50">
              Total: {receivers.length}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-saffron-500" /> Add New Contact
              </h3>
              
              {formError && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">{formError}</div>}
              {formSuccess && <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-xs font-semibold">{formSuccess}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 text-sm">
                  <label className="font-semibold text-gray-700">Full Name *</label>
                  <input type="text" name="receiver_name" value={formData.receiver_name} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400" placeholder="e.g. Rahul Sharma" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-sm">
                    <label className="font-semibold text-gray-700 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</label>
                    <input type="tel" name="receiver_phone" value={formData.receiver_phone} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="+91..." />
                  </div>
                  <div className="space-y-1 text-sm">
                    <label className="font-semibold text-gray-700 flex items-center gap-1"><Mail className="w-3 h-3"/> Email</label>
                    <input type="email" name="receiver_email" value={formData.receiver_email} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="@gmail.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-sm">
                    <label className="font-semibold text-gray-700 flex items-center gap-1"><Globe className="w-3 h-3"/> Language</label>
                    <select name="language" value={formData.language} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100">
                      <option value="hindi">Hindi</option>
                      <option value="marathi">Marathi</option>
                      <option value="tamil">Tamil</option>
                      <option value="telugu">Telugu</option>
                      <option value="kannada">Kannada</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-sm">
                    <label className="font-semibold text-gray-700">Type</label>
                    <select name="receiver_type" value={formData.receiver_type} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100">
                      <option value="citizen">Citizen</option>
                      <option value="member">Party Member</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-sm">
                    <label className="font-semibold text-gray-700 flex items-center gap-1"><MapPin className="w-3 h-3"/> State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="State" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <label className="font-semibold text-gray-700">District</label>
                    <input type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="District" />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input type="checkbox" name="has_whatsapp" checked={formData.has_whatsapp} onChange={handleInputChange} className="rounded border-gray-300 w-3.5 h-3.5" />
                    Has WhatsApp
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input type="checkbox" name="is_app_user" checked={formData.is_app_user} onChange={handleInputChange} className="rounded border-gray-300 w-3.5 h-3.5" />
                    App User
                  </label>
                </div>

                <button type="submit" disabled={adding} className="w-full mt-4 py-3 rounded-xl gradient-primary text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 btn-press transition-all hover:shadow-lg disabled:opacity-50">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Contact'}
                </button>
              </form>
            </div>
          </div>

          {/* Table Column */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 shadow-sm overflow-hidden h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-500" /> Contact Roster
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600 border border-gray-200">
                  Total: {receivers.length}
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 opacity-50">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                  <p className="text-sm">Syncing Roster...</p>
                </div>
              ) : receivers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <Users className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm font-semibold text-gray-500">No receivers added yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Use the form to build your list.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="pb-3 px-2">Name</th>
                        <th className="pb-3 px-2">Contact</th>
                        <th className="pb-3 px-2">Language</th>
                        <th className="pb-3 px-2">Location</th>
                        <th className="pb-3 px-2">Tags</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivers.map(r => (
                        <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-2 font-semibold text-gray-800">{r.receiver_name}</td>
                          <td className="py-3 px-2 text-gray-600">
                            {r.receiver_phone || '-'} <br/>
                            <span className="text-xs font-medium text-gray-400">{r.receiver_email}</span>
                          </td>
                          <td className="py-3 px-2 text-gray-600 capitalize">{r.language}</td>
                          <td className="py-3 px-2 text-gray-600">
                            {r.state || 'N/A'}{r.district ? `, ${r.district}` : ''}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              {r.has_whatsapp && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">WA</span>}
                              {r.is_app_user && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">APP</span>}
                              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded capitalize">{r.receiver_type}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
