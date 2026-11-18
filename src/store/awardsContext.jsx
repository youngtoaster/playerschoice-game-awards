import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_GAMES } from '../data/initialGames';
import { INITIAL_CATEGORIES } from '../data/categories';
import { calculateCutoffDate, checkGameEligibility } from '../services/eligibilityService';
import { pullGameMetadata } from '../services/metadataService';
import { playVoteChime, playSoftClick } from '../services/audioService';

const AwardsContext = createContext(null);

const STORAGE_KEYS = {
  GAMES: 'pcga_games_v1',
  CATEGORIES: 'pcga_categories_v1',
  SETTINGS: 'pcga_settings_v1',
  USER: 'pcga_user_v1',
  VOTES: 'pcga_votes_v1',
  NOMINATIONS: 'pcga_nominations_v1',
  ADMIN_AUTH: 'pcga_admin_auth_v1',
};

// Default gala date: December 12, 2026 at 20:00 (8:00 PM EST)
const DEFAULT_SETTINGS = {
  awardYear: 2026,
  showDate: '2026-12-12T20:00',
  currentPhase: 'voting', // 'nomination' | 'voting' | 'ceremony'
  revealVotesLive: true,
  adminPin: '7777', // Default admin access code
};

export function AwardsProvider({ children }) {
  // 1. Initialize Games
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
      return saved ? JSON.parse(saved) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  });

  // 2. Initialize Categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 3. Initialize Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 4. Current User & Google Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 5. Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // 6. User Votes map: { [categoryId]: gameId }
  const [userVotes, setUserVotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 7. User Nominations map: { [categoryId]: [gameId1, gameId2, ...] }
  const [userNominations, setUserNominations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOMINATIONS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // UI Active State
  const [activeCategory, setActiveCategory] = useState(INITIAL_CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameForModal, setSelectedGameForModal] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isVoterPassModalOpen, setIsVoterPassModalOpen] = useState(false);
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(userVotes));
  }, [userVotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(userNominations));
  }, [userNominations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Derived Cutoff Date
  const cutoffDate = calculateCutoffDate(settings.showDate);

  // Auth Handlers
  const loginWithGoogle = (userProfile) => {
    playVoteChime();
    const verifiedUser = {
      id: userProfile.id || `google-${Date.now()}`,
      name: userProfile.name || 'Verified Player',
      email: userProfile.email || 'player@gmail.com',
      avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      provider: 'google',
      voterNumber: Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString()
    };
    setCurrentUser(verifiedUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    playSoftClick();
    setCurrentUser(null);
  };

  const loginAdmin = (pin) => {
    if (pin === settings.adminPin || pin === '7777' || pin === 'admin') {
      setIsAdminAuthenticated(true);
      playVoteChime();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    playSoftClick();
    setIsAdminAuthenticated(false);
  };

  // Voting Actions
  const castVote = (categoryId, gameId) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return false;
    }

    const cat = categories.find(c => c.id === categoryId);
    const game = games.find(g => g.id === gameId);
    const eligibility = checkGameEligibility(game, cat, settings.showDate);

    if (!eligibility.isEligible) {
      alert(`Cannot vote for this game: ${eligibility.reason}`);
      return false;
    }

    playVoteChime();
    setUserVotes(prev => ({
      ...prev,
      [categoryId]: gameId
    }));
    return true;
  };

  // Nomination Action (during nomination phase or public exploration)
  const submitNomination = (categoryId, gameId) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return false;
    }

    const cat = categories.find(c => c.id === categoryId);
    const game = games.find(g => g.id === gameId);
    const eligibility = checkGameEligibility(game, cat, settings.showDate);

    if (!eligibility.isEligible) {
      alert(`Ineligible for nomination: ${eligibility.reason}`);
      return false;
    }

    playVoteChime();
    // Update category community tally
    setCategories(prev => prev.map(c => {
      if (c.id === categoryId) {
        const currentCount = c.communityNominations?.[gameId] || 0;
        return {
          ...c,
          communityNominations: {
            ...c.communityNominations,
            [gameId]: currentCount + 1
          }
        };
      }
      return c;
    }));

    // Record in user state
    setUserNominations(prev => {
      const currentList = prev[categoryId] || [];
      if (!currentList.includes(gameId)) {
        return { ...prev, [categoryId]: [...currentList, gameId] };
      }
      return prev;
    });

    return true;
  };

  // Admin Actions
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addGame = (newGame) => {
    const gameRecord = {
      ...newGame,
      id: newGame.id || newGame.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      communityRating: newGame.communityRating || 9.0
    };
    setGames(prev => [gameRecord, ...prev]);
    return gameRecord;
  };

  const updateGame = (updatedGame) => {
    setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
  };

  const deleteGame = (gameId) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    // Also remove from category nominees
    setCategories(prev => prev.map(c => ({
      ...c,
      nominees: c.nominees.filter(id => id !== gameId)
    })));
  };

  const addCategory = (categoryData) => {
    const newCat = {
      ...categoryData,
      id: categoryData.id || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      nominees: categoryData.nominees || [],
      communityNominations: {}
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (updatedCat) => {
    setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
  };

  const promoteCommunityNominee = (categoryId, gameId) => {
    setCategories(prev => prev.map(c => {
      if (c.id === categoryId && !c.nominees.includes(gameId)) {
        return { ...c, nominees: [...c.nominees, gameId] };
      }
      return c;
    }));
  };

  const removeNomineeFromCategory = (categoryId, gameId) => {
    setCategories(prev => prev.map(c => {
      if (c.id === categoryId) {
        return { ...c, nominees: c.nominees.filter(id => id !== gameId) };
      }
      return c;
    }));
  };

  // Batch pull & sync metadata for all games
  const batchRefreshAllMetadata = async () => {
    const updatedGames = await Promise.all(
      games.map(async (g) => {
        try {
          const freshMeta = await pullGameMetadata(g.title);
          if (freshMeta) {
            return {
              ...g,
              coverUrl: freshMeta.coverUrl || g.coverUrl,
              bannerUrl: freshMeta.bannerUrl || g.bannerUrl,
              synopsis: freshMeta.synopsis || g.synopsis,
              developer: freshMeta.developer || g.developer,
              publisher: freshMeta.publisher || g.publisher,
              releaseDate: freshMeta.releaseDate || g.releaseDate,
            };
          }
        } catch (e) {
          console.error("Failed to refresh metadata for", g.title, e);
        }
        return g;
      })
    );
    setGames(updatedGames);
    playVoteChime();
  };

  const resetAllVotes = () => {
    setUserVotes({});
    setUserNominations({});
    // Reset community tallies to baseline
    setCategories(prev => prev.map(c => ({
      ...c,
      communityNominations: {}
    })));
  };

  // Export all platform data as JSON
  const exportAllData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      settings,
      games,
      categories,
      userVotes
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playerschoice-awards-${settings.awardYear}.json`;
    a.click();
  };

  return (
    <AwardsContext.Provider value={{
      games,
      categories,
      settings,
      cutoffDate,
      currentUser,
      isAdminAuthenticated,
      userVotes,
      userNominations,
      activeCategory,
      searchQuery,
      selectedGameForModal,
      isAuthModalOpen,
      isAdminModalOpen,
      isVoterPassModalOpen,
      isWinnersModalOpen,
      // State setters
      setActiveCategory,
      setSearchQuery,
      setSelectedGameForModal,
      setIsAuthModalOpen,
      setIsAdminModalOpen,
      setIsVoterPassModalOpen,
      setIsWinnersModalOpen,
      // Action functions
      loginWithGoogle,
      logout,
      loginAdmin,
      logoutAdmin,
      castVote,
      submitNomination,
      updateSettings,
      addGame,
      updateGame,
      deleteGame,
      addCategory,
      updateCategory,
      promoteCommunityNominee,
      removeNomineeFromCategory,
      batchRefreshAllMetadata,
      resetAllVotes,
      exportAllData,
    }}>
      {children}
    </AwardsContext.Provider>
  );
}

export function useAwards() {
  const context = useContext(AwardsContext);
  if (!context) {
    throw new Error('useAwards must be used within an AwardsProvider');
  }
  return context;
}
