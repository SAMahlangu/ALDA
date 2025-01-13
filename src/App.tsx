import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Mic, MessageSquareText, FileText, Calculator, Menu, X } from 'lucide-react';
import SpeechToText from './components/SpeechToText';
import TextToSpeech from './components/TextToSpeech';
import PdfReader from './components/PdfReader';
import ChangeCalculator from './components/ChangeCalculator';

const NavLink = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </Link>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-200 ease-in-out bg-white border-r border-gray-200`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-800">ALDA</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 px-3 py-4 space-y-1">
              <NavLink to="/speech-to-text" icon={Mic}>
                Speech to Text
              </NavLink>
              <NavLink to="/text-to-speech" icon={MessageSquareText}>
                Text to Speech
              </NavLink>
              <NavLink to="/pdf-reader" icon={FileText}>
                PDF Reader
              </NavLink>
              <NavLink to="/calculator" icon={Calculator}>
                Change Calculator
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-4 text-gray-500 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/speech-to-text" element={<SpeechToText />} />
                <Route path="/text-to-speech" element={<TextToSpeech />} />
                <Route path="/pdf-reader" element={<PdfReader />} />
                <Route path="/calculator" element={<ChangeCalculator />} />
                <Route path="/" element={<SpeechToText />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;