import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ConfirmationPage from './components/ConfirmationPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/success" element={<ConfirmationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
