import React, { useState, useEffect } from 'react'
import AfterSalesQuiz from './AfterSalesQuiz'
import Landing from './Landing'

function App() {
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    // Check if URL has ?start=1 parameter OR if we're on a specific path
    const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    
    if (urlParams.get('start') === '1' || path === '/quiz' || path === '/results') {
      setShowQuiz(true);
    }
  }, []);

  const handleStart = () => {
    setShowQuiz(true);
    // Update URL without page reload
    window.history.pushState({}, '', '?start=1');
    // Force a small change to trigger deployment
  };

  return (
    <div className="App">
      {showQuiz ? (
        <AfterSalesQuiz />
      ) : (
        <Landing onStart={handleStart} />
      )}
    </div>
  )
}

export default App
