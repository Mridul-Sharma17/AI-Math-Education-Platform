import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { ProblemSolver } from './components/ProblemSolver';
import { AISolver } from './components/AISolver';
import { Calculator } from './components/Calculator';
import { ResearchTracks } from './components/ResearchTracks';
import { TeamProfiles } from './components/TeamProfiles';

export default function App() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      const { supabase } = await import('./utils/supabase/client');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('auth');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      return <AuthPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'problem-solver':
        return <ProblemSolver />;
      case 'ai-solver':
        return <AISolver />;
      case 'calculator':
        return <Calculator />;
      case 'research':
        return <ResearchTracks />;
      case 'team':
        return <TeamProfiles />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {isAuthenticated && (
        <Navigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main className={isAuthenticated ? "ml-64 min-h-screen" : "min-h-screen"}>
        {renderPage()}
      </main>
    </div>
  );
}