# 🏆 PlayersChoice Game Awards (PCGA)

> **The World's Definitive Player-Voted Video Game Honours.**  
> No critic juries. No corporate backrooms. The global gaming community nominates the contenders and crowns the champions.

---

## 🌟 Overview

**PlayersChoice Game Awards** is an interactive, cinematic digital awards platform designed to return authority to real players. Inspired by the visual prestige of Geoff Keighley’s The Game Awards and BAFTA Games Awards, PlayersChoice is completely player-governed from first nomination to final trophy.

### ⚡ Key Highlights

* **Democratic Community Nominations**: Unlike critic-curated ceremonies, players submit titles directly into any award category, establishing a real-time community leaderboard.
* **Official Ballot Voting**: Top community contenders face off on the official ballot. Authenticated players cast one verified vote per category.
* **The 1-Month Release Cut-Off Rule**: Any game can be voted in for this yearly awards show, but **must have been released at least 1 month prior to the official award show ceremony date set by the administrator**. Titles released within the 30-day blackout window before the gala are ineligible for competitive categories (exempting *Most Anticipated Game*).
* **Universal Guest Access + Google Authentication**: Visitors can freely explore all 16 categories, watch trailers, review Metacritic/community scores, and inspect rankings without logging in. Google authentication is required strictly at the moment of submitting a nomination or casting a vote.
* **Holographic Digital Voter Pass**: Generates a collectible 3D digital credential pass showing the player's Google avatar, unique voter number, verification status, and full ballot completion summary.
* **Admin Command Suite (Master PIN: `7777`)**: Full control over ceremony dates, dynamic 1-month cut-off calculation, live metadata and artwork auto-puller, 1-click batch sync, category curation, and vote auditing.
* **Cinematic Obsidian Gala Aesthetic**: 60fps golden stardust/ember particle canvas, frosted glassmorphism, responsive 44px+ touch targets, and Web Audio API synthesized tactile sound effects.

---

## 🛠️ Tech Stack

* **Framework**: React 18
* **Build Tool**: Vite
* **Styling**: Tailwind CSS, PostCSS, Autoprefixer
* **Icons**: Lucide React
* **Effects**: Canvas 2D Embers Particle Engine, Canvas Confetti
* **Audio**: Native Web Audio API Sound Synthesizer (Zero asset latency)
* **Fonts**: Cinzel (Headlines), Syne (Editorial), Plus Jakarta Sans (UI)

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+ (tested with Node 24+)
* npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/youngtoaster/playerschoice-game-awards.git
cd playerschoice-game-awards

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Administrator Access

Click the **Sliders icon** in the top navigation bar to access the **Admin Command Center**.

* **Default Access PIN**: `7777`
* **Features**:
  * Set Award Ceremony Date & Time
  * Auto-compute 1-Month Release Cut-off Date
  * Lifecycle Phase Switcher (`Nomination Phase` / `Voting Phase` / `Ceremony Phase`)
  * Game Metadata & Artwork Puller (Live search & auto-import)
  * Batch Refresh Metadata for all catalog games
  * Category Management & Top Nominee Promotion
  * Real-Time Vote Audit & JSON Export

---

## 📜 License

MIT License. Crafted for the global gaming community.
