import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Journal from './pages/Journal';
import HealthTracker from './pages/HealthTracker';

import ChatBot from './pages/ChatBot';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <Router>
      <div className="font-sans text-gray-900 bg-warm-white min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/health" element={<HealthTracker />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
