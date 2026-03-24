import { useState, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Fingerprint, CheckCircle2, ArrowLeft, Loader2, Camera, Key, Lock } from 'lucide-react'
import Webcam from 'react-webcam'
import { verifyPin } from '../services/api'

export default function ConsentOTP() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [authMode, setAuthMode] = useState('biometric')
  const [securityPin, setSecurityPin] = useState('')
  const webcamRef = useRef(null)

  const leaderId = localStorage.getItem('leaderId') || 'admin'

  const captureFace = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
  }, [webcamRef])

  const handleVerify = async () => {
    if (!capturedImage) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/consent/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leader_id: leaderId, face_image: capturedImage })
      })
      let data
      try { data = await res.json() } catch { data = { detail: 'Server error. Please try again.' } }
      if (!res.ok) throw new Error(data.detail || "Biometric match failed")

      localStorage.setItem('consentToken', data.consent_token)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
      setCapturedImage(null) // clear image so they try again
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPin = async () => {
    if (securityPin.length !== 6) return
    setLoading(true)
    setError('')
    try {
      const { data } = await verifyPin(leaderId, securityPin)
      localStorage.setItem('consentToken', data.consent_token)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Invalid PIN")
      setSecurityPin('')
    } finally {
      setLoading(false)
    }
  }

  const renderCapture = () => (
    <div className="glass-card p-10 rounded-3xl shadow-xl relative overflow-hidden text-center">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="mb-4">
        <h2 className="font-heading font-bold text-3xl text-gray-900 tracking-tight flex items-center justify-center gap-3">
          {authMode === 'biometric' ? <Fingerprint className="w-8 h-8 text-blue-600" /> : <Key className="w-8 h-8 text-blue-600" />} 
          Identity Verification
        </h2>
        <p className="text-gray-500 mt-2 text-sm">Please verify your identity to approve avatar generation.</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => { setAuthMode('biometric'); setError(''); }} 
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'biometric' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Face Scan
        </button>
        <button 
          onClick={() => { setAuthMode('pin'); setError(''); }} 
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'pin' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Security PIN
        </button>
      </div>

      {authMode === 'biometric' ? (
        <>
          <div className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden relative border-2 border-dashed border-gray-200 shadow-inner mb-6">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover" />
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                className="w-full h-full object-cover"
                mirrored={true}
              />
            )}
            
            {!capturedImage && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-64 border-2 border-white/50 rounded-full border-dashed animate-pulse" />
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm font-medium mb-4 animate-shake">{error}</p>}

          <div className="w-full flex gap-3">
            {!capturedImage ? (
              <button
                onClick={captureFace}
                className="w-full py-4 rounded-xl gradient-primary text-white font-bold tracking-wide flex items-center justify-center gap-2 hover:shadow-lg transition-all btn-press"
              >
                <Camera className="w-5 h-5" /> Capture & Verify
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCapturedImage(null)}
                  disabled={loading}
                  className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all btn-press"
                >
                  Retake
                </button>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="flex-[2] py-4 rounded-xl gradient-primary text-white font-bold flex items-center justify-center transition-all btn-press shadow-lg"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Identity'}
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50/80 border border-blue-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <div className="w-full relative mb-6">
             <input type="password" maxLength={6} value={securityPin} onChange={e => setSecurityPin(e.target.value.replace(/\D/g, ''))} placeholder="••••••" className="w-full text-center text-4xl tracking-widest py-4 glass-card rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none font-bold text-gray-800" />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium mb-4 animate-shake w-full text-left">{error}</p>}

          <button onClick={handleVerifyPin} disabled={loading || securityPin.length !== 6} className="w-full py-4 rounded-xl gradient-primary text-white font-bold tracking-wide flex items-center justify-center gap-2 hover:shadow-lg transition-all btn-press disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unlock with PIN'}
          </button>
        </div>
      )}
    </div>
  )

  const renderSuccess = () => (
    <div className="glass-card p-10 rounded-3xl shadow-xl shadow-green-900/5 text-center relative overflow-hidden animate-zoom-in">
      <div className="absolute inset-0 bg-green-500/5" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 relative">
        <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20" style={{ animationIterationCount: 1 }} />
        <CheckCircle2 className="w-12 h-12 text-green-600 relative z-10" />
      </div>
      <h2 className="font-heading font-bold text-3xl text-gray-900 relative">Match Verified</h2>
      <button onClick={() => navigate('/create?autoGenerate=true')} className="mt-10 w-full py-4 rounded-xl bg-gray-900 text-white font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all btn-press relative cursor-pointer">
        Publish Broadcast <ArrowLeft className="w-5 h-5 rotate-180" />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01NC42MjcgMTEuNjc1bDQuNjU4IDQuNjU4LTMuOTAyIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAyLTMuOTAxem0tMTUuNTE1IDIuNTNsNC42NTggNC42NThsLTMuOTAxIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAxLTMuOTAxem0xNS41MTUgMTUuNTE1bDQuNjU4IDQuNjU4LTMuOTAyIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAyLTMuOTAxem0tMTUuNTE1IDIuNTNsNC42NTggNC42NTdsLTMuOTAxIDMuOTAxLTQuNjU4LTQuNjU3IDMuOTAxLTMuOTAxem0xNC4yNjUtMzAuOTAxbDQuNjU4IDQuNjU4LTMuOTAxIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAxLTMuOTAxem0tMTUuNTE1IDIuNTNsNC42NTggNC42NThsLTMuOTAyIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAyLTMuOTAxem0xNS41MTUgMTUuNTE1bDQuNjU4IDQuNjU4LTMuOTAxIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAxLTMuOTAxem0tMTUuNTE1IDIuNTNsNC42NTggNC42NThsLTMuOTAyIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAyLTMuOTAxem0xNS41MTUtMTMuNzQ2bDQuNjU4IDQuNjU4LTMuOTAxIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAxLTMuOTAxem0tMTUuNTE1IDIuNTNsNC42NTggNC42NTdsLTMuOTAyIDMuOTAxLTQuNjU4LTQuNjU3IDMuOTAyLTMuOTAxem0xNS41MTUgMTUuNTE1bDQuNjU4IDQuNjU4LTMuOTAxIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAxLTMuOTAxem0tMTUuNTE1IDIuNTNsNC42NTggNC42NThsLTMuOTAyIDMuOTAxLTQuNjU4LTQuNjU4IDMuOTAyLTMuOTAxem0xLjI1LTExLjI0M2wyNC42IDMyLjUxLTMuOTAyIDMuOTAxLTI0LjYtMzIuNTEgMy45MDItMy45MDF6bTQuODctMjQuMDg0bDMyLjUxIDI0LjYtMy45MDEgMy45Ay0zMi41MS0yNC42IDMuOTAxLTMuOTAxem00Ljc0Mi00Ljc0MmwzMi41MSAyNC42LTMuOTAxIDMuOTAxLTMyLjUxLTI0LjYgMy45MDEtMy45MDF6IiBmaWxsPSIjZjhmOWZhIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]">
      <div className="absolute top-8 left-8">
        <Link to="/create" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white max-w-fit shadow-sm border border-gray-100 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all">
          <ArrowLeft className="w-4 h-4" /> Cancel Auth
        </Link>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {success ? renderSuccess() : renderCapture()}
      </div>
    </div>
  )
}
