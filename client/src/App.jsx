import React, { useState } from 'react';
import { Navbar }          from './components/sections';
import { AuthModal }       from './components/modals';
import CommunityFeed       from './components/CommunityFeed';
import {
  LandingPage,
  MapView,
  UserDashboard,
  UserProfilePage,
  AdminDashboard,
  OnboardingWizard,
} from './pages';
import useLocalStorage from './hooks/useLocalStorage';

const DEFAULT_PREFS = {
  needsMeals:          false,
  needsShelter:        false,
  needsMedical:        false,
  needsCounseling:     false,
  needsChildcare:      false,
  needsEmployment:     false,
  requiresWheelchair:  false,
  requiresPetFriendly: false,
  requiresFamily:      false,
  requiresVeteran:     false,
  useGPS:              true,
  maxDistance:         5,
};

/**
 * App – root component.
 * Manages global navigation state, user session, preferences, and bookmarks.
 */
function App() {
  const [view, setView]               = useState('home');
  const [user, setUser]               = useLocalStorage('nutrilife_user', null);
  const [prefs, setPrefs]             = useLocalStorage('nutrilife_prefs', DEFAULT_PREFS);
  const [bookmarks, setBookmarks]     = useLocalStorage('nutrilife_bookmarks', []);
  const [authOpen, setAuthOpen]       = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Navigate – redirect unauthenticated users for protected views
  const handleNavigate = (nextView) => {
    const protectedViews = ['dashboard', 'profile'];
    if (protectedViews.includes(nextView) && !user) {
      setAuthOpen(true);
      return;
    }
    setView(nextView);
  };

  // Auth
  const handleLogin = ({ email }) => {
    // Mock auth – in production this would call userApi.login()
    const mockUser = { id: Date.now(), name: email.split('@')[0], email, role: 'user', joinedAt: new Date().toISOString(), checkIns: [] };
    setUser(mockUser);
    setView('dashboard');
  };

  const handleRegister = ({ name, email }) => {
    const newUser = { id: Date.now(), name, email, role: 'user', joinedAt: new Date().toISOString(), checkIns: [] };
    setUser(newUser);
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  // Bookmarks
  const handleBookmark = (shelterId) => {
    setBookmarks((prev) =>
      prev.includes(shelterId) ? prev.filter((id) => id !== shelterId) : [...prev, shelterId]
    );
  };

  // Onboarding complete
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setView('dashboard');
  };

  // Render active page
  const renderPage = () => {
    if (showOnboarding) {
      return (
        <OnboardingWizard
          prefs={prefs}
          onPrefsChange={setPrefs}
          onComplete={handleOnboardingComplete}
        />
      );
    }

    switch (view) {
      case 'home':
        return <LandingPage onNavigate={handleNavigate} onAuthOpen={() => setAuthOpen(true)} />;

      case 'map':
        return (
          <MapView
            user={user}
            prefs={prefs}
            bookmarks={bookmarks}
            onBookmark={handleBookmark}
          />
        );

      case 'dashboard':
        return user ? (
          <UserDashboard
            user={user}
            prefs={prefs}
            bookmarks={bookmarks}
            onBookmark={handleBookmark}
            onNavigate={handleNavigate}
          />
        ) : null;

      case 'profile':
        return user ? (
          <UserProfilePage
            user={user}
            prefs={prefs}
            onPrefsChange={setPrefs}
            onLogout={handleLogout}
          />
        ) : null;

      case 'community':
        return <CommunityFeed user={user} onAuthOpen={() => setAuthOpen(true)} />;

      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard user={user} /> : null;

      default:
        return <LandingPage onNavigate={handleNavigate} onAuthOpen={() => setAuthOpen(true)} />;
    }
  };

  return (
    <>
      {!showOnboarding && (
        <Navbar
          currentView={view}
          onNavigate={handleNavigate}
          user={user}
          onAuthOpen={() => setAuthOpen(true)}
          onLogout={handleLogout}
        />
      )}

      <main>{renderPage()}</main>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  );
}

export default App;
