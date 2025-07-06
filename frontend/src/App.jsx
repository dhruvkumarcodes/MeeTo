import React from 'react'
import { Route, Routes } from 'react-router'
import NotificationPage from './pages/NotificationPage'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage copy'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from './pages/OnboardingPage'
import LoginPage from './pages/loginPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </div>
  )
}

export default App
