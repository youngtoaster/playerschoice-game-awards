export const INITIAL_CATEGORIES = [
  {
    id: "game-of-the-year",
    name: "Game of the Year",
    shortName: "GOTY",
    tagline: "The pinnacle of player-voted gaming excellence across all creative and technical fields.",
    icon: "Trophy",
    badgeColor: "amber",
    nominees: [
      "astro-bot",
      "black-myth-wukong",
      "metaphor-refantazio",
      "final-fantasy-vii-rebirth",
      "balatro",
      "elden-ring-shadow-of-the-erdtree"
    ],
    communityNominations: {
      "astro-bot": 1420,
      "black-myth-wukong": 1980,
      "metaphor-refantazio": 1250,
      "final-fantasy-vii-rebirth": 1340,
      "balatro": 1890,
      "elden-ring-shadow-of-the-erdtree": 1620,
      "helldivers-2": 890,
      "silent-hill-2-remake": 710
    },
    isLocked: false
  },
  {
    id: "best-art-direction",
    name: "Best Art Direction",
    shortName: "Art Direction",
    tagline: "Recognizing outstanding creative and technical achievement in visual design and animation.",
    icon: "Palette",
    badgeColor: "purple",
    nominees: [
      "black-myth-wukong",
      "metaphor-refantazio",
      "hades-ii",
      "animal-well",
      "astro-bot"
    ],
    communityNominations: {
      "black-myth-wukong": 1650,
      "metaphor-refantazio": 1420,
      "hades-ii": 1390,
      "animal-well": 1120,
      "astro-bot": 890
    },
    isLocked: false
  },
  {
    id: "best-narrative",
    name: "Best Narrative & Story",
    shortName: "Narrative",
    tagline: "For outstanding storytelling and narrative development in a game.",
    icon: "BookOpen",
    badgeColor: "blue",
    nominees: [
      "final-fantasy-vii-rebirth",
      "metaphor-refantazio",
      "silent-hill-2-remake",
      "dragon-age-the-veilguard"
    ],
    communityNominations: {
      "final-fantasy-vii-rebirth": 1540,
      "metaphor-refantazio": 1420,
      "silent-hill-2-remake": 1205,
      "dragon-age-the-veilguard": 890
    },
    isLocked: false
  },
  {
    id: "best-score-music",
    name: "Best Score and Music",
    shortName: "Score & Music",
    tagline: "Celebrating excellence in soundtrack, original score, licensed music, and musical direction.",
    icon: "Music",
    badgeColor: "emerald",
    nominees: [
      "final-fantasy-vii-rebirth",
      "metaphor-refantazio",
      "astro-bot",
      "silent-hill-2-remake",
      "stellar-blade"
    ],
    communityNominations: {
      "final-fantasy-vii-rebirth": 1820,
      "metaphor-refantazio": 1430,
      "astro-bot": 1120,
      "silent-hill-2-remake": 990,
      "stellar-blade": 940
    },
    isLocked: false
  },
  {
    id: "best-indie",
    name: "Best Independent Game",
    shortName: "Best Indie",
    tagline: "For outstanding creative and technical achievement in a game made outside the traditional publisher system.",
    icon: "Sparkles",
    badgeColor: "rose",
    nominees: [
      "balatro",
      "animal-well",
      "hades-ii"
    ],
    communityNominations: {
      "balatro": 2450,
      "animal-well": 1640,
      "hades-ii": 1820
    },
    isLocked: false
  },
  {
    id: "best-action-adventure",
    name: "Best Action / Adventure",
    shortName: "Action/Adv",
    tagline: "For the best action/adventure game combining combat with traversal and puzzle solving.",
    icon: "Sword",
    badgeColor: "orange",
    nominees: [
      "astro-bot",
      "black-myth-wukong",
      "space-marine-2",
      "stellar-blade",
      "silent-hill-2-remake"
    ],
    communityNominations: {
      "astro-bot": 1390,
      "black-myth-wukong": 1780,
      "space-marine-2": 1450,
      "stellar-blade": 1120,
      "silent-hill-2-remake": 980
    },
    isLocked: false
  },
  {
    id: "best-rpg",
    name: "Best Role Playing Game",
    shortName: "Best RPG",
    tagline: "For the best game designed with rich player character customization and progression.",
    icon: "Shield",
    badgeColor: "indigo",
    nominees: [
      "metaphor-refantazio",
      "final-fantasy-vii-rebirth",
      "dragon-age-the-veilguard",
      "elden-ring-shadow-of-the-erdtree"
    ],
    communityNominations: {
      "elden-ring-shadow-of-the-erdtree": 1940,
      "metaphor-refantazio": 1620,
      "final-fantasy-vii-rebirth": 1580,
      "dragon-age-the-veilguard": 820
    },
    isLocked: false
  },
  {
    id: "best-multiplayer",
    name: "Best Multiplayer & Co-op",
    shortName: "Multiplayer",
    tagline: "For outstanding multiplayer gameplay and design, including co-op and massively multiplayer experiences.",
    icon: "Users",
    badgeColor: "cyan",
    nominees: [
      "helldivers-2",
      "space-marine-2"
    ],
    communityNominations: {
      "helldivers-2": 2680,
      "space-marine-2": 1870
    },
    isLocked: false
  },
  {
    id: "most-anticipated",
    name: "Most Anticipated Game",
    shortName: "Most Anticipated",
    tagline: "The upcoming title that gamers across the world cannot wait to play in the coming years.",
    icon: "Clock",
    badgeColor: "amber",
    nominees: [
      "gta-vi",
      "monster-hunter-wilds",
      "ghost-of-yotei",
      "doom-the-dark-ages",
      "death-stranding-2"
    ],
    communityNominations: {
      "gta-vi": 3890,
      "monster-hunter-wilds": 2410,
      "ghost-of-yotei": 2180,
      "doom-the-dark-ages": 1840,
      "death-stranding-2": 1620
    },
    isLocked: false,
    allowUnreleased: true // Explicit override for Anticipated category
  }
];
