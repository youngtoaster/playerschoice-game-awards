import React, { useState } from 'react';
import { useAwards } from '../store/awardsContext';
import { calculateCutoffDate } from '../services/eligibilityService';
import { searchGameMetadata, pullGameMetadata } from '../services/metadataService';
import { 
  X, 
  Sliders, 
  Calendar, 
  ShieldAlert, 
  RefreshCw, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Flame, 
  Download, 
  Lock, 
  KeyRound, 
  Award, 
  Trophy,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { playSoftClick, playVoteChime } from '../services/audioService';

export default function AdminCommandModal() {
  const { 
    isAdminModalOpen, 
    setIsAdminModalOpen, 
    isAdminAuthenticated, 
    loginAdmin, 
    logoutAdmin,
    settings,
    updateSettings,
    games,
    addGame,
    updateGame,
    deleteGame,
    categories,
    addCategory,
    updateCategory,
    promoteCommunityNominee,
    removeNomineeFromCategory,
    batchRefreshAllMetadata,
    resetAllVotes,
    exportAllData,
    userVotes
  } = useAwards();

  // Local state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'metadata' | 'games' | 'categories' | 'audit'

  // Schedule form state
  const [tempShowDate, setTempShowDate] = useState(settings.showDate);
  const [tempPhase, setTempPhase] = useState(settings.currentPhase);
  const [tempRevealVotes, setTempRevealVotes] = useState(settings.revealVotesLive);
  const [tempAwardYear, setTempAwardYear] = useState(settings.awardYear);

  // Metadata puller state
  const [metaSearchQuery, setMetaSearchQuery] = useState('');
  const [isSearchingMeta, setIsSearchingMeta] = useState(false);
  const [metaSearchResults, setMetaSearchResults] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // Game edit state
  const [editingGame, setEditingGame] = useState(null);
  const [isAddingNewGame, setIsAddingNewGame] = useState(false);
  const [gameFormData, setGameFormData] = useState({
    title: '',
    developer: '',
    publisher: '',
    releaseDate: '2024-10-15',
    coverUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    genres: 'Action, RPG',
    platforms: 'PC, PS5, Xbox Series X',
    synopsis: '',
    isCustomOverride: false
  });

  // Category new modal
  const [newCatName, setNewCatName] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');

  if (!isAdminModalOpen) return null;

  const handleClose = () => {
    playSoftClick();
    setIsAdminModalOpen(false);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleSaveSchedule = () => {
    updateSettings({
      showDate: tempShowDate,
      currentPhase: tempPhase,
      revealVotesLive: tempRevealVotes,
      awardYear: Number(tempAwardYear)
    });
    playVoteChime();
    alert('Award Show Settings & 1-Month Cut-off successfully updated!');
  };

  const handleSearchMetadata = async (e) => {
    e.preventDefault();
    if (!metaSearchQuery.trim()) return;
    setIsSearchingMeta(true);
    try {
      const results = await searchGameMetadata(metaSearchQuery);
      setMetaSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingMeta(false);
    }
  };

  const handleAddFromMetadata = (meta) => {
    addGame({
      ...meta,
      id: meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
    playVoteChime();
    alert(`Added "${meta.title}" to games catalog!`);
  };

  const handleBatchRefresh = async () => {
    setBatchLoading(true);
    await batchRefreshAllMetadata();
    setBatchLoading(false);
    alert('All games metadata, artwork, and release dates refreshed successfully!');
  };

  const handleSaveGameForm = (e) => {
    e.preventDefault();
    const formatted = {
      ...gameFormData,
      genres: typeof gameFormData.genres === 'string' ? gameFormData.genres.split(',').map(s => s.trim()) : gameFormData.genres,
      platforms: typeof gameFormData.platforms === 'string' ? gameFormData.platforms.split(',').map(s => s.trim()) : gameFormData.platforms,
    };

    if (editingGame) {
      updateGame({ ...editingGame, ...formatted });
      setEditingGame(null);
    } else {
      addGame(formatted);
      setIsAddingNewGame(false);
    }
    playVoteChime();
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      tagline: newCatTagline.trim() || 'A prestigious player-voted category.',
      icon: 'Award',
      badgeColor: 'amber',
      nominees: []
    });
    setNewCatName('');
    setNewCatTagline('');
    playVoteChime();
  };

  const previewCutoff = calculateCutoffDate(tempShowDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-obsidian-900 border border-amber-500/40 shadow-2xl flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-obsidian-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>ADMIN COMMAND CENTER</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Full Control
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Orchestrate dates, enforce 1-month cut-off, pull metadata, edit games & categories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  logoutAdmin();
                  handleClose();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors"
              >
                Log Out Admin
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PIN Authentication Gate */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-gold-glow">
              <KeyRound className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white mb-2">
              Administrator Verification
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter the master access PIN to access the award show control suite. (Default PIN: <strong className="text-amber-300">7777</strong>)
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter 4-digit PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold bg-obsidian-950 text-amber-300 px-4 py-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                {pinError && (
                  <p className="text-xs text-rose-400 mt-1.5 font-semibold">
                    Incorrect PIN. Try default: 7777
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-obsidian-950 shadow-gold-glow hover:brightness-110 transition-all"
              >
                Unlock Command Center
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Suite */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-60 bg-obsidian-950/80 border-r border-white/5 p-3 flex md:flex-col gap-1.5 overflow-x-auto">
              {[
                { id: 'schedule', label: 'Dates & Cut-Off', icon: Calendar },
                { id: 'metadata', label: 'Metadata & Artwork', icon: RefreshCw },
                { id: 'games', label: 'Game Catalog', icon: Layers },
                { id: 'categories', label: 'Categories & Nominees', icon: Trophy },
                { id: 'audit', label: 'Vote Audit & Export', icon: Flame },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playSoftClick();
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-left ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-obsidian-900">
              
              {/* TAB 1: SCHEDULE & 1-MONTH CUT-OFF */}
              {activeTab === 'schedule' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                      Award Ceremony Date & Eligibility Rule
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure the exact gala date. The system automatically computes the 1-month cut-off date to determine which games can be nominated and voted on.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>Live 1-Month Cut-off Rule</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Based on Award Date <strong>{tempShowDate}</strong>, the calculated release cut-off date is:
                    </p>
                    <div className="mt-2 text-xl font-cinzel font-black text-amber-400">
                      {previewCutoff}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Any title released after this date is marked <em>Cut-Off Ineligible</em> across the site unless overridden.
                    </p>
                  </div>

                  <div className="space-y-4 bg-obsidian-850 p-5 rounded-2xl border border-white/5">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Award Show Ceremony Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={tempShowDate}
                        onChange={(e) => setTempShowDate(e.target.value)}
                        className="w-full bg-obsidian-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Award Year
                      </label>
                      <input
                        type="number"
                        value={tempAwardYear}
                        onChange={(e) => setTempAwardYear(e.target.value)}
                        className="w-full bg-obsidian-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Current Platform Lifecycle Phase
                      </label>
                      <select
                        value={tempPhase}
                        onChange={(e) => setTempPhase(e.target.value)}
                        className="w-full bg-obsidian-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                      >
                        <option value="nomination">Nomination Phase (Player submissions open)</option>
                        <option value="voting">Official Voting Phase (Official ballot active)</option>
                        <option value="ceremony">Ceremony / Winners Phase (Results revealed)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xs font-semibold text-slate-300 block">
                          Public Live Vote Tallies
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Show percentage bars to players in real time
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={tempRevealVotes}
                        onChange={(e) => setTempRevealVotes(e.target.checked)}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSchedule}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-obsidian-950 shadow-gold-glow transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save Schedule & Cut-off Settings</span>
                  </button>
                </div>
              )}

              {/* TAB 2: METADATA & ARTWORK ENGINE */}
              {activeTab === 'metadata' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                        Game Metadata & Artwork Sync Engine
                      </h3>
                      <p className="text-xs text-slate-400">
                        Search and auto-pull key art, banners, trailers, release dates, and studio metadata.
                      </p>
                    </div>

                    <button
                      onClick={handleBatchRefresh}
                      disabled={batchLoading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-obsidian-800 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shadow-sm transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${batchLoading ? 'animate-spin' : ''}`} />
                      <span>Batch Refresh All ({games.length}) Games</span>
                    </button>
                  </div>

                  {/* Metadata Search Form */}
                  <form onSubmit={handleSearchMetadata} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search game title to pull metadata (e.g. Civilization VII, Avowed, Zelda, Doom)..."
                        value={metaSearchQuery}
                        onChange={(e) => setMetaSearchQuery(e.target.value)}
                        className="w-full bg-obsidian-950 text-sm text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearchingMeta}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-obsidian-950 transition-all flex items-center gap-1.5"
                    >
                      {isSearchingMeta ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      <span>Pull Metadata</span>
                    </button>
                  </form>

                  {/* Search Results Display */}
                  {metaSearchResults.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                        Metadata Results ({metaSearchResults.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {metaSearchResults.map((meta, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-obsidian-850 border border-white/10 flex gap-4">
                            <img
                              src={meta.coverUrl}
                              alt={meta.title}
                              className="w-20 h-28 object-cover rounded-xl border border-white/10 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-sm text-white truncate">{meta.title}</h5>
                              <p className="text-xs text-slate-400 mt-0.5">{meta.developer} • {meta.releaseDate}</p>
                              <p className="text-xs text-slate-300 line-clamp-2 mt-1.5">{meta.synopsis}</p>
                              <button
                                onClick={() => handleAddFromMetadata(meta)}
                                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-obsidian-950 hover:bg-amber-300 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Import to Catalog</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GAME CATALOG & EDITOR */}
              {activeTab === 'games' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                        Game Catalog Management ({games.length} Titles)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Edit game records, override cut-off eligibility, update key art or add custom titles.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingNewGame(true);
                        setEditingGame(null);
                        setGameFormData({
                          title: '',
                          developer: '',
                          publisher: '',
                          releaseDate: '2024-10-15',
                          coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                          bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
                          trailerUrl: 'https://www.youtube.com/embed/gI8T3gU9X78',
                          genres: 'Action, RPG',
                          platforms: 'PC, PS5',
                          synopsis: 'A premier gaming experience nominated by the community.',
                          isCustomOverride: false
                        });
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-obsidian-950"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Game</span>
                    </button>
                  </div>

                  {/* Add / Edit Game Form Modal */}
                  {(isAddingNewGame || editingGame) && (
                    <div className="p-6 rounded-2xl bg-obsidian-850 border border-amber-500/30 mb-6">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <h4 className="font-bold text-sm text-white">
                          {editingGame ? `Edit: ${editingGame.title}` : 'Add New Game'}
                        </h4>
                        <button
                          onClick={() => {
                            setEditingGame(null);
                            setIsAddingNewGame(false);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleSaveGameForm} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Game Title</label>
                          <input
                            type="text"
                            required
                            value={gameFormData.title}
                            onChange={(e) => setGameFormData({ ...gameFormData, title: e.target.value })}
                            className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Release Date (YYYY-MM-DD)</label>
                          <input
                            type="date"
                            required
                            value={gameFormData.releaseDate}
                            onChange={(e) => setGameFormData({ ...gameFormData, releaseDate: e.target.value })}
                            className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Developer</label>
                          <input
                            type="text"
                            value={gameFormData.developer}
                            onChange={(e) => setGameFormData({ ...gameFormData, developer: e.target.value })}
                            className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Publisher</label>
                          <input
                            type="text"
                            value={gameFormData.publisher}
                            onChange={(e) => setGameFormData({ ...gameFormData, publisher: e.target.value })}
                            className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-slate-400 block mb-1">Cover Image URL</label>
                          <input
                            type="text"
                            value={gameFormData.coverUrl}
                            onChange={(e) => setGameFormData({ ...gameFormData, coverUrl: e.target.value })}
                            className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-slate-400 block mb-1">Trailer Embed URL</label>
                          <input
                            type="text"
                            value={gameFormData.trailerUrl}
                            onChange={(e) => setGameFormData({ ...gameFormData, trailerUrl: e.target.value })}
                            className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-slate-400 block mb-1">Synopsis</label>
                          <textarea
                            rows={3}
                            value={gameFormData.synopsis}
                            onChange={(e) => setGameFormData({ ...gameFormData, synopsis: e.target.value })}
                            className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="customOverride"
                            checked={gameFormData.isCustomOverride}
                            onChange={(e) => setGameFormData({ ...gameFormData, isCustomOverride: e.target.checked })}
                            className="w-4 h-4 accent-amber-500 rounded"
                          />
                          <label htmlFor="customOverride" className="text-xs text-amber-300 font-semibold cursor-pointer">
                            Grant Admin Eligibility Override (Force eligible regardless of release date)
                          </label>
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingGame(null);
                              setIsAddingNewGame(false);
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 rounded-xl text-xs font-bold bg-amber-400 text-obsidian-950 shadow-gold-glow"
                          >
                            Save Game
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Games Catalog List */}
                  <div className="space-y-2">
                    {games.map(game => (
                      <div
                        key={game.id}
                        className="flex items-center justify-between gap-4 p-3 rounded-xl bg-obsidian-850 border border-white/5 hover:border-white/10"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={game.coverUrl}
                            alt={game.title}
                            className="w-10 h-14 rounded-lg object-cover border border-white/10"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{game.title}</h4>
                            <p className="text-[11px] text-slate-400">{game.developer} • Released: {game.releaseDate}</p>
                            {game.isCustomOverride && (
                              <span className="text-[10px] text-amber-400 font-bold">Admin Override Active</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingGame(game);
                              setIsAddingNewGame(false);
                              setGameFormData({
                                title: game.title,
                                developer: game.developer,
                                publisher: game.publisher || '',
                                releaseDate: game.releaseDate,
                                coverUrl: game.coverUrl,
                                bannerUrl: game.bannerUrl || '',
                                trailerUrl: game.trailerUrl || '',
                                genres: Array.isArray(game.genres) ? game.genres.join(', ') : game.genres,
                                platforms: Array.isArray(game.platforms) ? game.platforms.join(', ') : game.platforms,
                                synopsis: game.synopsis || '',
                                isCustomOverride: Boolean(game.isCustomOverride)
                              });
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400"
                            title="Edit game"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete "${game.title}" from catalog?`)) {
                                deleteGame(game.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Delete game"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 4: CATEGORIES & NOMINEES */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                      Categories & Ballot Nominees
                    </h3>
                    <p className="text-xs text-slate-400">
                      Promote top player-nominated contenders onto the official ballot or configure new awards.
                    </p>
                  </div>

                  {/* Add Category Form */}
                  <form onSubmit={handleAddCategorySubmit} className="p-4 rounded-2xl bg-obsidian-850 border border-white/5 flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="New Award Category Name..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-1 bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                    />
                    <input
                      type="text"
                      placeholder="Category Tagline / Description..."
                      value={newCatTagline}
                      onChange={(e) => setNewCatTagline(e.target.value)}
                      className="flex-1 bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-obsidian-950 hover:bg-amber-300"
                    >
                      Add Category
                    </button>
                  </form>

                  {/* Categories List */}
                  <div className="space-y-4">
                    {categories.map(cat => {
                      const communityNominations = cat.communityNominations || {};
                      const topCommunity = Object.entries(communityNominations)
                        .sort((a, b) => b[1] - a[1]);

                      return (
                        <div key={cat.id} className="p-5 rounded-2xl bg-obsidian-850 border border-white/5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-cinzel font-bold text-base text-white">{cat.name}</h4>
                              <p className="text-xs text-slate-400">{cat.tagline}</p>
                            </div>
                            <span className="text-xs font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                              {cat.nominees?.length || 0} Official Nominees
                            </span>
                          </div>

                          {/* Current Official Nominees */}
                          <div className="mb-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                              Locked on Ballot:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {cat.nominees?.map(gameId => {
                                const g = games.find(item => item.id === gameId);
                                return (
                                  <span
                                    key={gameId}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-obsidian-950 text-slate-200 border border-white/10"
                                  >
                                    <span>{g?.title || gameId}</span>
                                    <button
                                      onClick={() => removeNomineeFromCategory(cat.id, gameId)}
                                      className="text-slate-400 hover:text-rose-400"
                                      title="Remove from ballot"
                                    >
                                      ✕
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Promote Top Community Nominations */}
                          {topCommunity.length > 0 && (
                            <div className="pt-3 border-t border-white/5">
                              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                                Top Community Player Submissions:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {topCommunity.slice(0, 5).map(([gameId, count]) => {
                                  const g = games.find(item => item.id === gameId);
                                  const alreadyOnBallot = cat.nominees?.includes(gameId);

                                  return (
                                    <button
                                      key={gameId}
                                      disabled={alreadyOnBallot}
                                      onClick={() => promoteCommunityNominee(cat.id, gameId)}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                        alreadyOnBallot
                                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 cursor-default'
                                          : 'bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border-white/10'
                                      }`}
                                    >
                                      <span>{g?.title || gameId}</span>
                                      <span className="text-[10px] text-amber-400 font-bold">({count} votes)</span>
                                      {!alreadyOnBallot && <Plus className="w-3 h-3 text-amber-400" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: VOTE AUDIT & EXPORT */}
              {activeTab === 'audit' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                      Vote Audit & Telemetry Dashboard
                    </h3>
                    <p className="text-xs text-slate-400">
                      Inspect total voter activity, export election data, or purge test records.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-obsidian-850 border border-white/5">
                      <span className="text-xs text-slate-400 block">Total User Ballots</span>
                      <span className="text-2xl font-cinzel font-black text-amber-400 mt-1 block">
                        {Object.keys(userVotes).length > 0 ? 1 : 0} Session Active
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-obsidian-850 border border-white/5">
                      <span className="text-xs text-slate-400 block">Total Catalog Titles</span>
                      <span className="text-2xl font-cinzel font-black text-white mt-1 block">
                        {games.length}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-obsidian-850 border border-white/5 space-y-4">
                    <h4 className="font-bold text-sm text-white">Data Management</h4>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={exportAllData}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
                      >
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>Export All Data (JSON)</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to reset all platform votes and voter ballots? This cannot be undone.')) {
                            resetAllVotes();
                            alert('All votes have been reset.');
                          }
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Reset All Votes & Ballots</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
