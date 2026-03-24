/**
 * ConsentModal.jsx — OTP Consent Verification Component
 * भारत Avatar Platform — India Innovates 2026
 */

import React, { useState } from 'react';
import { requestConsent, verifyConsent } from '../api';

function ConsentModal({ avatarColor, onVerified }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'verified'
  const [phone, setPhone] = useState('');
  const [consentId, setConsentId] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await requestConsent(phone);
      setConsentId(data.consent_id);
      setDemoOtp(data.demo_otp);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyConsent(consentId, otp);
      setStep('verified');
      onVerified && onVerified();
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verified') {
    return (
      <div className="rounded-xl p-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-emerald-800">Consent Verified ✓</p>
          <p className="text-sm text-emerald-600">You can now generate avatar videos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-lg">🔒</span>
        <h4 className="font-semibold text-gray-800">Consent Verification</h4>
      </div>

      <div className="p-5">
        {step === 'phone' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Biometric OTP verification is required before avatar creation. This ensures deepfake-proof content generation.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                id="consent-phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none text-lg tracking-wider"
                style={{ focusRingColor: avatarColor }}
                maxLength={10}
              />
            </div>
            <button
              id="send-otp-btn"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-semibold transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: avatarColor }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            {/* Demo OTP info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-amber-500 text-lg">💡</span>
              <div>
                <p className="text-sm font-medium text-amber-800">Demo Mode</p>
                <p className="text-sm text-amber-700">
                  Your OTP is: <span className="font-bold text-lg tracking-widest">{demoOtp}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Enter 6-Digit OTP
              </label>
              <input
                id="otp-input"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="● ● ● ● ● ●"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent 
                           outline-none text-2xl text-center tracking-[0.5em] font-mono"
                maxLength={6}
              />
            </div>

            <button
              id="verify-otp-btn"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-semibold transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: avatarColor }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsentModal;
