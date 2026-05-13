import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Freebies from './pages/Freebies';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/freebies" element={<Freebies />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="border-t border-gray-800 py-8 mt-auto text-center text-gray-500 text-sm">
          <p>Data provided by CheapShark API & GameStatus</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
