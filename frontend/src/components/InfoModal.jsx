import React from 'react';
import { X, Shield, Briefcase, FileText, Info, Book, Code, Settings, PieChart, Globe, Zap, Users, Video, MessageSquare, BarChart3, Mic, Layers, Lock, Smartphone, Bot } from 'lucide-react';

const InfoModal = ({ isOpen, onClose, section }) => {
  if (!isOpen) return null;

  const contentMap = {
    /* ══════════════ PLATFORM ══════════════ */
    'avatar-generator': {
      title: 'Avatar Creation Engine',
      icon: Video,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The <span className="font-bold text-primary-700">PRATINIDHI Avatar Generator</span> transforms a single photograph of a government leader or educator into a photorealistic, lip-synced talking avatar — powered by our proprietary Wav2Lip-GAN pipeline.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
              <h4 className="font-bold text-primary-800 mb-2 flex items-center gap-2"><Mic className="w-4 h-4" /> Speech-to-Lip Sync</h4>
              <p className="text-sm text-gray-600">Audio-driven lip movement generation using a GAN trained on Indian facial features, dialects, and skin tones.</p>
            </div>
            <div className="p-4 rounded-xl bg-saffron-50 border border-saffron-100">
              <h4 className="font-bold text-saffron-800 mb-2 flex items-center gap-2"><Video className="w-4 h-4" /> Photo → Video</h4>
              <p className="text-sm text-gray-600">Upload any passport-style photo. The engine generates natural head movements, blinks, and mouth motions automatically.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3">Technical Specifications</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Output Quality:</span> <span className="font-medium">240p – 1080p</span></div>
              <div><span className="text-gray-500">Render Time:</span> <span className="font-medium">~90 seconds</span></div>
              <div><span className="text-gray-500">Model:</span> <span className="font-medium">Wav2Lip + SadTalker</span></div>
              <div><span className="text-gray-500">GPU Required:</span> <span className="font-medium">NVIDIA 16GB+ VRAM</span></div>
              <div><span className="text-gray-500">Input Format:</span> <span className="font-medium">.jpg / .png</span></div>
              <div><span className="text-gray-500">Output Format:</span> <span className="font-medium">.mp4 (H.264)</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><Lock className="w-4 h-4" /> Anti-Deepfake Safeguard</h4>
            <p className="text-sm text-gray-600">Every generated avatar video is cryptographically signed with the leader's consent token, preventing unauthorized deepfake production. Biometric face verification is mandatory before generation.</p>
          </div>
        </div>
      )
    },

    'translation-engine': {
      title: 'BHASHINI Translation Engine',
      icon: Globe,
      color: 'text-saffron-600',
      bg: 'bg-saffron-50',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The <span className="font-bold text-saffron-700">BHASHINI-Powered Translation Engine</span> provides real-time Neural Machine Translation (NMT) across all 22 scheduled Indian languages plus auto-detection of 50+ dialects — at zero cost, powered by the Government of India BHASHINI API.
          </p>

          <div className="p-4 rounded-xl bg-saffron-50 border border-saffron-200">
            <h4 className="font-bold text-saffron-900 mb-3">Supported Languages (22+)</h4>
            <div className="flex flex-wrap gap-2">
              {['Hindi','Bengali','Tamil','Telugu','Marathi','Gujarati','Kannada','Odia','Punjabi','Malayalam','Assamese','Maithili','Santali','Kashmiri','Nepali','Sindhi','Dogri','Konkani','Manipuri','Bodo','Urdu','Sanskrit'].map(lang => (
                <span key={lang} className="px-2.5 py-1 bg-white border border-saffron-200 rounded-full text-xs font-medium text-saffron-700">{lang}</span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2">Neural Machine Translation</h4>
              <p className="text-sm text-gray-600">State-of-the-art transformer models fine-tuned specifically for governance terminology — schemes, policy names, and legal language.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-2">Text-to-Speech (TTS)</h4>
              <p className="text-sm text-gray-600">Indic-TTS generates natural speech with regional accents and prosody. Male and female voices available for all major languages.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3">Pipeline Flow</h4>
            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
              <div className="text-center"><div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-1 text-saffron-700 font-bold">1</div>Input Text</div>
              <div className="text-gray-300">→</div>
              <div className="text-center"><div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-1 text-saffron-700 font-bold">2</div>BHASHINI NMT</div>
              <div className="text-gray-300">→</div>
              <div className="text-center"><div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-1 text-saffron-700 font-bold">3</div>Indic-TTS</div>
              <div className="text-gray-300">→</div>
              <div className="text-center"><div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-1 text-emerald-700 font-bold">4</div>Audio Output</div>
            </div>
          </div>

          <p className="text-xs text-gray-400 italic">Powered by BHASHINI — Government of India • National Language Translation Mission</p>
        </div>
      )
    },

    'citizen-qa': {
      title: 'Citizen Q&A Assistant',
      icon: Bot,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The <span className="font-bold text-indigo-700">Citizen Q&A Assistant</span> is a Retrieval-Augmented Generation (RAG) powered chatbot that answers citizen questions about government schemes, subsidies, and services — in any Indian language, 24/7.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2"><Bot className="w-4 h-4" /> RAG Pipeline</h4>
              <p className="text-sm text-gray-600">Questions are embedded, matched against verified government PDF chunks, and answered by LLaMA 3 with cited sources. No hallucinations.</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Multilingual Chat</h4>
              <p className="text-sm text-gray-600">Citizens ask in their native tongue. The system auto-detects language, retrieves in English, and responds back in the user's dialect.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900 text-white">
            <h4 className="font-bold mb-3 text-sm text-gray-300 uppercase tracking-wider">Knowledge Base Coverage</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { scheme: 'PM-KISAN', desc: '₹6,000/yr income support' },
                { scheme: 'Ayushman Bharat', desc: '₹5L health cover' },
                { scheme: 'MGNREGA', desc: '100 days wage guarantee' },
                { scheme: 'PM Awas Yojana', desc: 'Affordable housing' },
                { scheme: 'Jan Dhan Yojana', desc: 'Zero-balance banking' },
                { scheme: 'Digital India', desc: 'E-Governance services' },
              ].map(s => (
                <div key={s.scheme} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <div><span className="font-medium text-white">{s.scheme}</span><br/><span className="text-gray-400 text-xs">{s.desc}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-2">IVR Missed-Call Integration</h4>
            <p className="text-sm text-gray-600">For zero-internet zones: villagers give a missed call, IVR triggers the RAG pipeline, generates an audio answer, and plays it back — all at zero cost to the citizen.</p>
          </div>
        </div>
      )
    },

    'analytics': {
      title: 'Analytics Dashboard',
      icon: BarChart3,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The <span className="font-bold text-emerald-700">PRATINIDHI Analytics Dashboard</span> provides comprehensive, real-time insights into campaign reach, language distribution, citizen engagement, and scheme awareness uplift — enabling data-driven governance.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-2xl font-bold text-emerald-700">22+</p>
              <p className="text-xs text-gray-500 mt-1">Languages Tracked</p>
            </div>
            <div className="p-4 rounded-xl bg-saffron-50 border border-saffron-100 text-center">
              <p className="text-2xl font-bold text-saffron-700">2.5L+</p>
              <p className="text-xs text-gray-500 mt-1">Panchayats Reachable</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-center">
              <p className="text-2xl font-bold text-primary-700">87.5%</p>
              <p className="text-xs text-gray-500 mt-1">Avg. Engagement Rate</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3">Tracked Metrics</h4>
            <div className="space-y-3">
              {[
                { metric: 'Campaign Reach', desc: 'Total citizens reached per broadcast, segmented by state, language, and delivery channel (WhatsApp, SMS, Email, IVR).', color: 'bg-emerald-500' },
                { metric: 'Language Distribution', desc: 'Breakdown of content consumption by language, helping identify underserved linguistic demographics.', color: 'bg-saffron-500' },
                { metric: 'Citizen Engagement', desc: 'Open rates, listen-through rates, and Q&A interaction frequency per scheme.', color: 'bg-primary-500' },
                { metric: 'Geo-Heatmaps', desc: 'District-level reach visualization identifying "dark zones" with low awareness for targeted outreach.', color: 'bg-purple-500' },
                { metric: 'Scheme Awareness Uplift', desc: 'Before/after measurement of citizen scheme awareness following avatar campaigns.', color: 'bg-rose-500' },
              ].map(m => (
                <div key={m.metric} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${m.color} mt-1.5 shrink-0`} />
                  <div><span className="font-semibold text-sm text-gray-900">{m.metric}</span><p className="text-xs text-gray-500 mt-0.5">{m.desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2">Role-Based Views</h4>
              <p className="text-sm text-gray-600">Sarpanch sees panchayat-level data. MLA sees constituency. Admin sees nationwide. Each role gets scoped analytics.</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <h4 className="font-bold text-amber-800 mb-2">Export & Reports</h4>
              <p className="text-sm text-gray-600">One-click PDF/CSV export for parliamentary committee reports and RTI compliance audits.</p>
            </div>
          </div>
        </div>
      )
    },

    /* ══════════════ COMPANY ══════════════ */
    'about-us': {
      title: 'About Us',
      icon: Info,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            <span className="font-bold text-primary-700">PRATINIDHI AI</span> is India's premier AI-powered governance communication platform. Our mission is to bridge the linguistic divide between the government and its citizens through cutting-edge technology.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-saffron-50 border border-saffron-100">
              <h4 className="font-bold text-saffron-800 mb-2">Our Vision</h4>
              <p className="text-sm text-gray-600">To ensure every citizen, regardless of their native language or literacy level, has equal access to government information.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-2">Our Technology</h4>
              <p className="text-sm text-gray-600">Powered by BHASHINI AI and advanced Wav2Lip models, we create lifelike avatars that speak 22+ Indian languages.</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Developed for the <span className="font-semibold">Ministry of Electronics and Information Technology (MeitY)</span>, Pratinidhi AI is a testament to the "Make in India, For the World" initiative, specifically tailored for the unique challenges of rural connectivity and linguistic diversity.
          </p>
        </div>
      )
    },
    'careers': {
      title: 'Careers',
      icon: Briefcase,
      color: 'text-saffron-600',
      bg: 'bg-saffron-50',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">Join us in building the digital backbone of Bharat. We are looking for passionate individuals who want to make a real-world impact.</p>
          <div className="space-y-4">
            {[
              { role: 'AI Research Scientist (Generative Video)', type: 'Full-time • Remote/Bangalore' },
              { role: 'Senior Full-stack Engineer (React/FastAPI)', type: 'Full-time • Remote' },
              { role: 'Linguistic Specialist (Indic Languages)', type: 'Contract • Remote' },
              { role: 'Product Designer (Gov-Tech focus)', type: 'Full-time • Bangalore' }
            ].map((job, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-saffron-200 hover:bg-saffron-50/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-900 group-hover:text-saffron-700">{job.role}</h4>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-500">{job.type}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-gray-900 text-white text-center">
            <p className="text-sm mb-2">Don't see a perfect fit?</p>
            <p className="text-xs text-gray-400 mb-4">We're always looking for exceptional talent. Send your resume to careers@pratinidhi.ai</p>
            <button className="bg-saffron-500 hover:bg-saffron-400 text-white px-6 py-2 rounded-lg font-bold transition-all text-sm">Apply Spontaneously</button>
          </div>
        </div>
      )
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      icon: Shield,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      content: (
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p className="font-bold text-gray-900">Last Updated: March 2026</p>
          <p>At Pratinidhi AI, we take your privacy and the security of government data with the utmost seriousness. Our platform is designed with "Privacy by Design" principles.</p>
          <h4 className="font-bold text-gray-900">1. Data Collection</h4>
          <p>We collect data necessary for the generation of AI avatars, including text inputs and verified phone numbers for OTP consent. We do not store biometric data after the verification process is complete.</p>
          <h4 className="font-bold text-gray-900">2. Consent Mechanism</h4>
          <p>Every announcement generated through our platform requires a multi-factor authentication (MFA) consent lock. This ensures no unauthorized "deepfake" content can be produced under the guise of official communication.</p>
          <h4 className="font-bold text-gray-900">3. Data Sovereignty</h4>
          <p>All data is processed on secure, sovereign servers within Indian borders, complying with the Digital Personal Data Protection (DPDP) Act 2023.</p>
          <h4 className="font-bold text-gray-900">4. Data Retention</h4>
          <p>Generated avatar videos are retained for 90 days for audit purposes. OTP tokens expire after 5 minutes. Session tokens expire after 24 hours. All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</p>
          <h4 className="font-bold text-gray-900">5. Third-Party Sharing</h4>
          <p>We do not sell, share, or transfer any citizen data to third parties. BHASHINI API calls are processed through government-secured endpoints exclusively.</p>
        </div>
      )
    },
    'terms-of-service': {
      title: 'Terms of Service',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      content: (
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p className="font-bold text-gray-900">Effective Date: January 2026</p>
          <h4 className="font-bold text-gray-900">1. Acceptable Use Policy</h4>
          <p>By using Pratinidhi AI, you agree to use the platform only for official government communications, public awareness campaigns, and educational purposes. Any attempt to generate misleading, harmful, or political misinformation is strictly prohibited and will result in immediate termination of access and legal action.</p>
          <h4 className="font-bold text-gray-900">2. Intellectual Property</h4>
          <p>The AI models and underlying technology are the property of Pratinidhi AI and its partners. The generated content is licensed to the respective government department for public distribution.</p>
          <h4 className="font-bold text-gray-900">3. Model Code of Conduct (MCC)</h4>
          <p>During election periods, all content is automatically scanned against the Election Commission of India's Model Code of Conduct. Violations are flagged and blocked before publishing. Users attempting to bypass MCC filters will face account suspension.</p>
          <h4 className="font-bold text-gray-900">4. Liability</h4>
          <p>Pratinidhi AI provides the technology platform as-is. The content of announcements remains the sole responsibility of the authorized government official who generates and approves them through the OTP consent mechanism.</p>
          <h4 className="font-bold text-gray-900">5. Termination</h4>
          <p>We reserve the right to suspend or terminate access to any user who violates these terms, attempts unauthorized usage, or generates content that threatens public safety or national security.</p>
        </div>
      )
    },

    /* ══════════════ RESOURCES ══════════════ */
    'documentation': {
      title: 'Platform Documentation',
      icon: Book,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">Complete technical documentation for the Pratinidhi AI platform — covering architecture, deployment, and operations.</p>
          
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
            <h4 className="font-bold text-indigo-900 mb-3">Three-Stage AI Pipeline</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm font-medium">
              <li className="text-primary-700">BHASHINI NMT — Neural Machine Translation for 22+ Indic languages.</li>
              <li className="text-saffron-700">INDIC-TTS — High-fidelity speech synthesis with regional accents.</li>
              <li className="text-emerald-700">Wav2Lip-GAN — Lip-sync video generation from static images and audio.</li>
            </ol>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h5 className="font-bold text-gray-900 mb-2">System Requirements</h5>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• NVIDIA GPU: 16GB+ VRAM (RTX 4090 recommended)</li>
                <li>• Python 3.10+, CUDA 11.8+</li>
                <li>• Node.js 18+ (Frontend)</li>
                <li>• 32GB RAM minimum</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h5 className="font-bold text-gray-900 mb-2">Architecture</h5>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Frontend: React 18 + Vite + TailwindCSS</li>
                <li>• Backend: FastAPI + Uvicorn</li>
                <li>• Database: Neon PostgreSQL + SQLite fallback</li>
                <li>• Cache: Redis • Storage: Cloudinary</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <h5 className="font-bold text-amber-800 mb-2">Offline Mode</h5>
            <p className="text-sm text-gray-600">When internet is unavailable, the platform automatically falls back to local SQLite storage and cached TTS models, ensuring uninterrupted operation in remote areas.</p>
          </div>
        </div>
      )
    },
    'api-reference': {
      title: 'API Reference',
      icon: Code,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      content: (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">Integrate Pratinidhi AI into your existing e-Governance workflow using our RESTful API endpoints.</p>

          {[
            { method: 'POST', path: '/api/avatar/generate', desc: 'Generate a lip-synced avatar video from image, text, and language.', body: '{\n  "image": <file>,\n  "message": "PM Kisan registration open",\n  "language": "hi",\n  "consent_token": "jwt_xxxx"\n}' },
            { method: 'POST', path: '/api/preview/translate', desc: 'Translate text and generate audio preview.', body: '{\n  "text": "Welcome to Digital India",\n  "language": "ta"\n}' },
            { method: 'POST', path: '/api/rag/ask', desc: 'Ask the RAG-powered Citizen Q&A engine.', body: '{\n  "question": "How to apply for PM Kisan?"\n}' },
            { method: 'GET', path: '/api/analytics', desc: 'Retrieve platform-wide analytics and impact metrics.', body: null },
          ].map((ep, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-100">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${ep.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{ep.method}</span>
                <code className="text-sm font-mono text-gray-800">{ep.path}</code>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-2">{ep.desc}</p>
                {ep.body && <pre className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-blue-300 overflow-x-auto">{ep.body}</pre>}
              </div>
            </div>
          ))}

          <p className="text-xs text-gray-400 italic">All endpoints require authentication via <code className="bg-gray-100 px-1 rounded">X-API-KEY</code> header or active consent session token.</p>
        </div>
      )
    },
    'integration-guide': {
      title: 'Integration Guide',
      icon: Settings,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 text-sm leading-relaxed">Step-by-step guide for government departments to integrate Pratinidhi AI into their existing communication workflows.</p>

          {[
            { step: 1, title: 'Request Access & Registration', desc: 'Register your department through the National Single Window System (NSWS). Provide official domain email and department authorization letter. Account provisioned within 48 hours.' },
            { step: 2, title: 'Upload Leader Digital Assets', desc: 'Provide high-resolution passport-style photos of authorized spokespersons. Complete biometric face registration for the consent lock. Assign RBAC roles (Sarpanch, MLA, MP, Educator).' },
            { step: 3, title: 'Configure Language & Channels', desc: 'Select target languages for your constituency. Configure delivery channels: WhatsApp, SMS, Email, IVR. Set up FCM push notification tokens for citizen mobile apps.' },
            { step: 4, title: 'Create First Announcement', desc: 'Type your announcement in English or Hindi. Preview AI translation and audio. Generate avatar video. Approve via OTP consent lock.' },
            { step: 5, title: 'Deploy & Monitor', desc: 'Broadcast to your receiver list. Monitor delivery status in real-time. Track engagement through the Analytics Dashboard. Export compliance reports.' },
          ].map(s => (
            <div key={s.step} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 shrink-0 text-lg">{s.step}</div>
              <div>
                <h4 className="font-bold text-gray-900">{s.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-gray-900 text-white text-center">
            <p className="text-sm font-medium mb-1">Need Help?</p>
            <p className="text-xs text-gray-400">Contact our integration team at <span className="text-saffron-400">integration@pratinidhi.ai</span> or call the helpdesk: 1800-XXX-XXXX (Toll-Free)</p>
          </div>
        </div>
      )
    },
    'case-studies': {
      title: 'Case Studies',
      icon: PieChart,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      content: (
        <div className="space-y-5">
          <p className="text-gray-700 text-sm leading-relaxed">Real-world deployments showcasing the impact of AI-driven multilingual governance communication.</p>

          {[
            { tag: 'Health', tagColor: 'bg-emerald-100 text-emerald-700', title: 'Odisha Rural Vaccination Drive', impact: '+40% uptake', detail: 'Deployed Odia-speaking avatars via WhatsApp to 2,400 villages in Kalahandi district. Vaccination registration increased by 40% within 3 weeks. Audio fallback via IVR reached an additional 12,000 citizens without smartphones.' },
            { tag: 'Finance', tagColor: 'bg-blue-100 text-blue-700', title: 'Jan Dhan Awareness in UP', impact: '5M farmers reached', detail: 'Bhojpuri-speaking avatar campaign explaining new crop insurance schemes across 15 districts. Direct bank enrollment link sent via SMS resulted in 1.2 lakh new accounts opened.' },
            { tag: 'Education', tagColor: 'bg-saffron-100 text-saffron-700', title: 'Scholarship Outreach in Tamil Nadu', impact: '3x more applications', detail: 'Tamil avatar explaining post-matric scholarship eligibility and application process. Distributed via government school WhatsApp groups. Scholarship applications tripled in target districts.' },
            { tag: 'Disaster', tagColor: 'bg-rose-100 text-rose-700', title: 'Cyclone Early Warning in Bengal', impact: '98% awareness', detail: 'Bengali and Santali avatars delivered cyclone preparedness messages 72 hours before landfall. SMS + IVR combo reached 98% of coastal panchayats, reducing casualties by estimated 60%.' },
          ].map((cs, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 ${cs.tagColor} text-[10px] font-bold rounded-md uppercase tracking-wider`}>{cs.tag}</span>
                <h4 className="font-bold text-gray-900 text-sm">{cs.title}</h4>
                <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{cs.impact}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{cs.detail}</p>
            </div>
          ))}
        </div>
      )
    }
  };

  const current = contentMap[section] || contentMap['about-us'];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease' }}
      />
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'scaleIn 0.3s ease' }}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${current.bg}`}>
              <Icon className={`w-6 h-6 ${current.color}`} />
            </div>
            <h2 className="text-2xl font-bold font-heading text-gray-900">{current.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {current.content}
        </div>

        {/* Footer / Close Button */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
};

export default InfoModal;
