import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'
import CreateAvatar from './pages/CreateAvatar'
import AvatarPreview from './pages/AvatarPreview'
import CitizenView from './pages/CitizenView'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import AskAvatar from './pages/AskAvatar'
import Messages from './pages/Messages'
import ConsentOTP from './pages/ConsentOTP'
import FeaturesPage from './pages/FeaturesPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/create" element={<CreateAvatar />} />
        <Route path="/preview" element={<AvatarPreview />} />
        <Route path="/preview/:id" element={<AvatarPreview />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/view/:id" element={<CitizenView />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/consent" element={<ConsentOTP />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ask-avatar" element={<AskAvatar />} />
      </Routes>
    </Router>
  )
}

export default App
