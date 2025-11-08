import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import QuizFlow from './components/QuizFlow'
import Landing from './Landing'
import Footer from './components/Footer'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import CookiePolicy from './pages/CookiePolicy'

function App() {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStart = () => {
    setShowQuiz(true);
  };

  const handleBackToLanding = () => {
    setShowQuiz(false);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/privacy-policy" element={
          <>
            <PrivacyPolicy />
            <Footer />
          </>
        } />
        <Route path="/terms-of-use" element={
          <>
            <TermsOfUse />
            <Footer />
          </>
        } />
        <Route path="/cookie-policy" element={
          <>
            <CookiePolicy />
            <Footer />
          </>
        } />
        <Route path="/" element={
          <>
            {showQuiz ? (
              <QuizFlow onBackToLanding={handleBackToLanding} />
            ) : (
              <Landing onStart={handleStart} />
            )}
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}

export default App
