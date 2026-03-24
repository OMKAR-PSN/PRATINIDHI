import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConsentVerify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('No verification token provided in the URL.');
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        await axios.get(`${backendUrl}/api/consent/verify-magic-link?token=${token}`);
        setStatus('success');
        
        // Redirect to dashboard after 3 seconds on success
        setTimeout(() => {
            navigate('/dashboard'); // or wherever the user should go
        }, 3000);

      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.detail || 'Failed to verify email consent. The link may have expired.'
        );
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-off-white flex flex-col justify-center items-center p-6 tech-grid">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center">
        {status === 'verifying' && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-deep-blue mb-2 font-heading">Verifying Consent...</h2>
            <p className="text-gray-600">Please wait while we confirm your email authorization.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-deep-blue mb-2 font-heading">Consent Verified!</h2>
            <p className="text-gray-600 mb-6">Your email consent has been securely recorded. Your identity is verified.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-gradient-saffron text-white rounded-xl font-semibold hover-lift"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in-up">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-deep-blue mb-2 font-heading">Verification Failed</h2>
            <p className="text-red-600 mb-6">{errorMessage}</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3 bg-white border-2 border-deep-blue text-deep-blue rounded-xl font-semibold hover-lift"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentVerify;
