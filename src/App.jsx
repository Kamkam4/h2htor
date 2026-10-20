import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBattle from './components/HeroBattle';
import UpcomingMatches from './components/UpcomingMatches';
import StatsOverview from './components/StatsOverview';
import MatchList from './components/MatchList';
import AdminPanel from './components/AdminPanel';
import PlayerProfileModal from './components/PlayerProfileModal';
import Footer from './components/Footer';
import { INITIAL_MATCHES } from './data/initialMatches';
import { sound } from './utils/sound';
import { dbService } from './services/matchesService';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  // Navigation: 'public' or 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        return 'admin';
      }
    }
    return 'public';
  });

  const [matches, setMatches] = useState(() => {
    try {
      const saved = localStorage.getItem('h2h_tournament_series_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load matches from storage', e);
    }
    return INITIAL_MATCHES;
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPlayerName, setSelectedPlayerName] = useState('loozollo');

  // Load from Supabase on start if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    const initDb = async () => {
      try {
        const remoteMatches = await dbService.getMatches();
        if (!isMounted) return;

        if (remoteMatches && remoteMatches.length > 0) {
          setMatches(remoteMatches);
        } else {
          // If Supabase table is empty, seed with initial matches
          await dbService.seedIfEmpty(INITIAL_MATCHES);
        }
      } catch (err) {
        console.error('Failed to init Supabase:', err);
      }
    };

    initDb();

    // Subscribe to live real-time changes
    const unsubscribe = dbService.subscribe(async () => {
      const updated = await dbService.getMatches();
      if (isMounted && updated) {
        setMatches(updated);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync to local storage as fallback cache
  useEffect(() => {
    try {
      localStorage.setItem('h2h_tournament_series_v2', JSON.stringify(matches));
    } catch (e) {
      console.error('Failed to save matches to storage', e);
    }
  }, [matches]);

  // Handle URL hash changes & secret shortcut (Ctrl+Shift+A or Alt+A)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
      }
    };

    const handleKeyDown = (e) => {
      // Secret Admin Shortcut: Ctrl+Shift+A or Alt+A
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        sound.playClick();
        if (window.location.hash === '#admin') {
          window.location.hash = '';
          setCurrentView('public');
        } else {
          window.location.hash = 'admin';
          setCurrentView('admin');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublic = () => {
    window.location.hash = '';
    setCurrentView('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sound toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.muted = nextMuted;
  };

  // Stats calculation (only completed matches count towards wins & scores)
  const completedMatches = matches.filter(m => m.status !== 'upcoming');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  const loozolloWins = completedMatches.filter(m => m.winner === 'loozollo').length;
  const kamkamaWins = completedMatches.filter(m => m.winner === 'kamkama').length;
  const draws = completedMatches.filter(m => m.winner === 'draw').length;
  const totalMatches = completedMatches.length;

  const loozolloTotalScore = completedMatches.reduce((acc, m) => acc + (Number(m.loozolloScore) || 0), 0);
  const kamkamaTotalScore = completedMatches.reduce((acc, m) => acc + (Number(m.kamkamaScore) || 0), 0);

  // Match mutations from Admin
  const handleSaveMatch = async (savedMatch) => {
    // Optimistic UI update
    setMatches(prev => {
      const exists = prev.some(m => m.id === savedMatch.id);
      if (exists) {
        return prev.map(m => m.id === savedMatch.id ? savedMatch : m);
      }
      return [savedMatch, ...prev];
    });

    // Save to Supabase if connected
    if (isSupabaseConfigured) {
      await dbService.saveMatch(savedMatch);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('ნამდვილად გსურთ მატჩის წაშლა?')) {
      setMatches(prev => prev.filter(m => m.id !== matchId));

      // Delete from Supabase if connected
      if (isSupabaseConfigured) {
        await dbService.deleteMatch(matchId);
      }
    }
  };

  const handleImportMatches = (imported) => {
    setMatches(imported);
    if (isSupabaseConfigured) {
      imported.forEach(m => dbService.saveMatch(m));
    }
  };

  const handleResetMatches = () => {
    setMatches(INITIAL_MATCHES);
    if (isSupabaseConfigured) {
      INITIAL_MATCHES.forEach(m => dbService.saveMatch(m));
    }
  };

  const handleClearMatches = () => {
    setMatches([]);
  };

  const handleOpenProfile = (playerName) => {
    sound.playClick();
    setSelectedPlayerName(playerName);
    setIsProfileModalOpen(true);
  };

  // Render Admin View
  if (currentView === 'admin') {
    return (
      <AdminPanel
        matches={matches}
        isSupabaseConnected={isSupabaseConfigured}
        onSaveMatch={handleSaveMatch}
        onDeleteMatch={handleDeleteMatch}
        onBackToSite={navigateToPublic}
        onResetMatches={handleResetMatches}
        onClearMatches={handleClearMatches}
        onImportMatches={handleImportMatches}
      />
    );
  }

  // Render Public / Spectator View (100% clean, no admin buttons visible)
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col bg-cyber-grid">
      
      {/* Navigation Bar (No admin button visible) */}
      <Navbar
        matches={matches}
        loozolloWins={loozolloWins}
        kamkamaWins={kamkamaWins}
        draws={draws}
        onOpenAdmin={navigateToAdmin}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Arena */}
      <main className="flex-1">
        
        {/* Top Priority Sector: Featured Upcoming Battle (Zero Scrolling) */}
        <UpcomingMatches upcomingMatches={upcomingMatches} />

        {/* Hero Duel Arena */}
        <HeroBattle
          loozolloWins={loozolloWins}
          kamkamaWins={kamkamaWins}
          draws={draws}
          totalMatches={totalMatches}
          loozolloTotalScore={loozolloTotalScore}
          kamkamaTotalScore={kamkamaTotalScore}
          lastMatches={matches}
          onOpenProfile={handleOpenProfile}
        />

        {/* In-depth Analytics & Breakdown */}
        <StatsOverview
          matches={matches}
          loozolloWins={loozolloWins}
          kamkamaWins={kamkamaWins}
          draws={draws}
        />

        {/* Read-Only Interactive Match History */}
        <MatchList matches={matches} />
      </main>

      {/* Footer (No admin button visible) */}
      <Footer />

      {/* Modals */}
      <PlayerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        playerName={selectedPlayerName}
        matches={completedMatches}
      />

    </div>
  );
}
