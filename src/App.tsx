import React, { useState } from 'react'
import QuizFlow from './components/QuizFlow'
import Landing from './Landing'
import Footer from './components/Footer'

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
      {showQuiz ? (
        <QuizFlow onBackToLanding={handleBackToLanding} />
      ) : (
        <Landing onStart={handleStart} />
      )}
      <Footer />
    </div>
  )
}

export default App
