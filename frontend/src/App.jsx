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
import ConsentVerify from './pages/ConsentVerify'
import Receivers from './pages/Receivers'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateAvatar />} />
        <Route path="/preview" element={<AvatarPreview />} />
        <Route path="/preview/:id" element={<AvatarPreview />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/view/:id" element={<CitizenView />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/receivers" element={<Receivers />} />
        <Route path="/consent" element={<ConsentOTP />} />
        <Route path="/consent/verify" element={<ConsentVerify />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ask-avatar" element={<AskAvatar />} />
      </Routes>
    </Router>
  )
}

export default App
