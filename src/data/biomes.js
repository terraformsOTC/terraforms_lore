// Biome rarity tiers - sourced from TerraformsEstimator pricing model
export const BIOME_RARITIES = {
  mythical:  { label: 'mythical',  color: '#e879f9' },
  rare:      { label: 'rare',      color: '#60a5fa' },
  premium:   { label: 'premium',   color: '#34d399' },
  uncommon:  { label: 'uncommon',  color: '#fbbf24' },
  floor:     { label: 'floor',     color: 'rgba(232,232,232,0.3)' },
};

// Biome category labels (for confirmed references)
export const BIOME_CATEGORIES = {
  language:     { label: 'language',      color: '#a78bfa' },
  film:         { label: 'film',          color: '#f87171' },
  nature:       { label: 'nature',        color: '#6ee7b7' },
  art:          { label: 'art',           color: '#60a5fa' },
  architecture: { label: 'architecture',  color: '#fb923c' },
  abstract:     { label: 'abstract',      color: '#d4d4d4' },
  technology:   { label: 'technology',    color: '#38bdf8' },
};

// Biome collector sets — groups of biomes sharing a character theme
export const BIOME_SETS = {
  chess:  { label: 'chess set',  color: '#e8c97a', attainability: 'easy',   bottleneck: 39 },
  binary: { label: 'binary set', color: '#4ade80', attainability: 'easy',   bottleneck: 89 },
  blocky: { label: 'blocky set', color: '#93c5fd', attainability: 'medium', bottleneck: 10 },
};

// Rarity lookup by biome number
const RARITY_MAP = {
  // Mythical
  0: 'mythical', 10: 'mythical', 11: 'mythical', 17: 'mythical',
  73: 'mythical', 74: 'mythical', 76: 'mythical', 77: 'mythical',
  78: 'mythical', 79: 'mythical', 81: 'mythical',
  // Rare
  12: 'rare', 13: 'rare', 14: 'rare', 15: 'rare', 16: 'rare',
  18: 'rare', 19: 'rare', 20: 'rare', 39: 'rare',
  75: 'rare', 80: 'rare', 82: 'rare', 87: 'rare', 88: 'rare',
  // Premium
  1: 'premium', 2: 'premium', 8: 'premium', 40: 'premium', 42: 'premium',
  84: 'premium', 85: 'premium', 89: 'premium', 90: 'premium', 91: 'premium',
  // Uncommon
  3: 'uncommon', 4: 'uncommon', 5: 'uncommon', 6: 'uncommon', 7: 'uncommon',
  9: 'uncommon', 21: 'uncommon', 22: 'uncommon', 23: 'uncommon',
  24: 'uncommon', 25: 'uncommon', 26: 'uncommon', 28: 'uncommon',
  29: 'uncommon', 30: 'uncommon', 34: 'uncommon', 35: 'uncommon',
  36: 'uncommon', 37: 'uncommon', 38: 'uncommon', 41: 'uncommon',
  58: 'uncommon', 65: 'uncommon', 66: 'uncommon', 67: 'uncommon',
  68: 'uncommon', 69: 'uncommon', 83: 'uncommon', 86: 'uncommon',
};

function rarity(n) {
  return RARITY_MAP[n] ?? 'floor';
}

// Helper: build a biome id
function bid(n) {
  return `biome-${n}`;
}

// status: 'confirmed' | 'uncertain' | 'unknown'
// All 92 biomes (0–91)
export const biomes = [

  // ─── COMMUNITY THEORIES ──────────────────────────────────────────────────

  {
    id: bid(69),
    number: 69,
    name: 'Biome 69',
    nickname: 'Net Art',
    status: 'uncertain',
    category: 'art',
    rarity: rarity(69),
    reference: null,
    referenceDetail: null,
    description:
      'Community theory: the character set used in Biome 69 may reference the Simple Net Art Diagram - a 1997 work by MTAA (T.Whid and M.River) that reduces the entire concept of net art to a single image: two computers connected by a wire, with the annotation "The art happens here" pointing to the network between them. One of the most iconic and widely reproduced works of early internet art.',
    images: { zone: null, reference: '/images/biome69-reference.gif' },
    sourceUrl: null,
    creditTo: null,
    referenceLink: 'https://anthology.rhizome.org/simple-net-art-diagram',
    guess: 'Simple Net Art Diagram - MTAA (1997)',
    characterSet: '🖳══════🖳🖳',
  },

  // ─── UNKNOWN (0–91, sorted numerically, excluding confirmed/guess above) ──

  { id: bid(0),  number: 0,  name: 'Biome 0',  nickname: null, status: 'unknown', category: null, rarity: rarity(0),  images: null, guess: null, set: 'blocky', characterSet: '▆▇▆▇▉▊▋█▊' },
  { id: bid(1),  number: 1,  name: 'Biome 1',  nickname: null, status: 'unknown', category: null, rarity: rarity(1),  images: null, guess: null, set: 'blocky', characterSet: '▚▛▜▙▗▘▝▟▞' },
  { id: bid(2),  number: 2,  name: 'Biome 2',  nickname: null, status: 'unknown', category: null, rarity: rarity(2),  images: null, guess: null, set: 'blocky', characterSet: '▇▚▚▚▞▞▞▞▇' },
  { id: bid(3),  number: 3,  name: 'Biome 3',  nickname: null, status: 'unknown', category: null, rarity: rarity(3),  images: null, guess: null, set: 'blocky', characterSet: '▅▂▅▃▂▃▃▂▅' },
  { id: bid(4),  number: 4,  name: 'Biome 4',  nickname: null, status: 'unknown', category: null, rarity: rarity(4),  images: null, guess: null, set: 'blocky', characterSet: '▅▂▃▃▂▃▃▂▆' },
  { id: bid(5),  number: 5,  name: 'Biome 5',  nickname: null, status: 'unknown', category: null, rarity: rarity(5),  images: null, guess: null, set: 'blocky', characterSet: '█▂▂▂▂▂▂▂█' },
  { id: bid(6),  number: 6,  name: 'Biome 6',  nickname: null, status: 'unknown', category: null, rarity: rarity(6),  images: null, guess: null, set: 'blocky', characterSet: '▂█▂▂▂▂██▂' },
  { id: bid(7),  number: 7,  name: 'Biome 7',  nickname: null, status: 'unknown', category: null, rarity: rarity(7),  images: null, guess: null, set: 'blocky', characterSet: '█▄░░▒▓▀░▄' },
  { id: bid(8),  number: 8,  name: 'Biome 8',  nickname: null, status: 'unknown', category: null, rarity: rarity(8),  images: null, guess: null, set: 'blocky', characterSet: '▝▒▛▒▝▅░░▒' },
  { id: bid(9),  number: 9,  name: 'Biome 9',  nickname: null, status: 'unknown', category: null, rarity: rarity(9),  images: null, guess: null, set: 'blocky', characterSet: '█▓░░▒▒▒▒▓' },
  { id: bid(10), number: 10, name: 'Biome 10', nickname: null, status: 'unknown', category: null, rarity: rarity(10), images: null, guess: null, set: 'blocky', characterSet: '▌▄█░▒▓▓▀▐' },
  { id: bid(11), number: 11, name: 'Biome 11', nickname: null, status: 'unknown', category: null, rarity: rarity(11), images: null, guess: null, set: 'blocky', characterSet: '█▌▐▄▀░▒▓▓' },
  { id: bid(12), number: 12, name: 'Biome 12', nickname: null, status: 'unknown', category: null, rarity: rarity(12), images: null, guess: null, set: 'blocky', characterSet: '▉――▉――――▆' },
  { id: bid(13), number: 13, name: 'Biome 13', nickname: null, status: 'unknown', category: null, rarity: rarity(13), images: null, guess: null, set: 'blocky', characterSet: '░░█▄▒▓▀░▄' },
  { id: bid(14), number: 14, name: 'Biome 14', nickname: null, status: 'unknown', category: null, rarity: rarity(14), images: null, guess: null, set: 'blocky', characterSet: '░░▒▓▓▒▒▒░' },
  { id: bid(15), number: 15, name: 'Biome 15', nickname: null, status: 'unknown', category: null, rarity: rarity(15), images: null, guess: null, set: 'blocky', characterSet: '⛆░░⛆⛆⛆░▒▒' },
  { id: bid(16), number: 16, name: 'Biome 16', nickname: null, status: 'unknown', category: null, rarity: rarity(16), images: null, guess: null, set: 'blocky', characterSet: '⛆▒░▓▓▓░▒⛆' },
  { id: bid(17), number: 17, name: 'Biome 17', nickname: null, status: 'unknown', category: null, rarity: rarity(17), images: null, guess: null, characterSet: '⛆░++++▒▒▒' },
  { id: bid(18), number: 18, name: 'Biome 18', nickname: null, status: 'unknown', category: null, rarity: rarity(18), images: null, guess: null, characterSet: '█╔╔╣═╣═╣█' },
  { id: bid(19), number: 19, name: 'Biome 19', nickname: null, status: 'unknown', category: null, rarity: rarity(19), images: null, guess: null, characterSet: '╚░░╝═╣══╝' },
  { id: bid(20), number: 20, name: 'Biome 20', nickname: null, status: 'unknown', category: null, rarity: rarity(20), images: null, guess: null, characterSet: '╝═╣░░╔══▒' },
  { id: bid(21), number: 21, name: 'Biome 21', nickname: null, status: 'unknown', category: null, rarity: rarity(21), images: null, guess: null, characterSet: '═╚╔⾂⾂⾂═╝═' },
  { id: bid(22), number: 22, name: 'Biome 22', nickname: null, status: 'unknown', category: null, rarity: rarity(22), images: null, guess: null, characterSet: '▒🏔▒☎☎▒🏔☆░' },
  { id: bid(23), number: 23, name: 'Biome 23', nickname: null, status: 'unknown', category: null, rarity: rarity(23), images: null, guess: null, characterSet: '🌧🌧░⾂▒░🏔🏔🏔' },
  { id: bid(24), number: 24, name: 'Biome 24', nickname: null, status: 'unknown', category: null, rarity: rarity(24), images: null, guess: null, characterSet: '🏔╣╔╣╚═╔🏔🏔' },
  { id: bid(25), number: 25, name: 'Biome 25', nickname: null, status: 'unknown', category: null, rarity: rarity(25), images: null, guess: null, characterSet: '🖳░➫⋆.➫░░🕱' },
  { id: bid(26), number: 26, name: 'Biome 26', nickname: null, status: 'unknown', category: null, rarity: rarity(26), images: null, guess: null, set: 'chess', characterSet: '🗠🗠░♖░░🗠░♘' },
  { id: bid(27), number: 27, name: 'Biome 27', nickname: null, status: 'unknown', category: null, rarity: rarity(27), images: null, guess: null, set: 'chess', characterSet: '🗠🗠░🖳░🗠🗠░♖' },
  { id: bid(28), number: 28, name: 'Biome 28', nickname: null, status: 'unknown', category: null, rarity: rarity(28), images: null, guess: null, characterSet: '🗡░🗡⋆🗡🗡░░🗡' },
  { id: bid(29), number: 29, name: 'Biome 29', nickname: null, status: 'unknown', category: null, rarity: rarity(29), images: null, guess: null, characterSet: '🗡░🗡⋆🗡⛱░░⛱' },
  {
    id: bid(30),
    number: 30,
    name: 'Biome 30',
    nickname: 'Daisy Chain',
    status: 'uncertain',
    category: 'technology',
    rarity: rarity(30),
    images: null,
    guess: 'Daisy chain (electrical engineering)',
    description:
      'The character set alternates ⛓ (chains) with ❀ (a florette, read as a daisy): a daisy chain. In electrical and electronic engineering, a daisy chain is a wiring scheme that connects devices one after another, in a line or a ring, named after a garland of daisies. MIDI gear, SCSI drives, Thunderbolt devices and DisplayPort monitors are all chained this way. Biome 30 is the only biome that pairs the two glyphs.',
    referenceLink: 'https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)',
    characterSet: '⛓░❀🗠❀⛓❀░⛓',
  },
  { id: bid(31), number: 31, name: 'Biome 31', nickname: null, status: 'unknown', category: null, rarity: rarity(31), images: null, guess: null, characterSet: '⛓░🗡🗠🗡⛓➫░⛓' },
  {
    id: bid(32),
    number: 32,
    name: 'Biome 32',
    nickname: 'Blockchain',
    status: 'uncertain',
    category: 'art',
    rarity: rarity(32),
    images: null,
    guess: 'Blockchain + Rare Pepe on-chain art culture',
    description:
      'The terminal (🖳), seven chain links (⛓ = blockchain), and Egyptian frog hieroglyph (𓆏 = Rare Pepe/crypto frog) compress the history of on-chain art into a single line: computing → blockchain → Rare Pepe culture. Rare Pepe was one of the first on-chain art movements, beginning on the Bitcoin blockchain in 2016.',
    characterSet: '🖳⛓⛓⛓⛓⛓⛓⛓𓆏',
  },
  { id: bid(33), number: 33, name: 'Biome 33', nickname: null, status: 'unknown', category: null, rarity: rarity(33), images: null, guess: null, characterSet: '🖳⛓⛓⛓⛓⛓⛓⛓🖳' },
  { id: bid(34), number: 34, name: 'Biome 34', nickname: null, status: 'unknown', category: null, rarity: rarity(34), images: null, guess: null, characterSet: '🏔██╣═╣▄█🏔' },
  { id: bid(35), number: 35, name: 'Biome 35', nickname: null, status: 'unknown', category: null, rarity: rarity(35), images: null, guess: null, characterSet: '🏔███████🏔' },
  { id: bid(36), number: 36, name: 'Biome 36', nickname: null, status: 'unknown', category: null, rarity: rarity(36), images: null, guess: null, characterSet: '🏔▂▅▅▅▂▂🏔🏔' },
  { id: bid(37), number: 37, name: 'Biome 37', nickname: null, status: 'unknown', category: null, rarity: rarity(37), images: null, guess: null, characterSet: '🖫⛓🖫███🖫⛓🖫' },
  { id: bid(38), number: 38, name: 'Biome 38', nickname: null, status: 'unknown', category: null, rarity: rarity(38), images: null, guess: null, set: 'chess', characterSet: '♘♜▂▂▂♜♜♜♖' },
  { id: bid(39), number: 39, name: 'Biome 39', nickname: null, status: 'unknown', category: null, rarity: rarity(39), images: null, guess: null, set: 'chess', characterSet: '♜♘   ♖♖♖♜' },
  { id: bid(40), number: 40, name: 'Biome 40', nickname: null, status: 'unknown', category: null, rarity: rarity(40), images: null, guess: null, characterSet: '❀⋮⋮⋮❀❀⋮⋮❀' },
  { id: bid(41), number: 41, name: 'Biome 41', nickname: null, status: 'unknown', category: null, rarity: rarity(41), images: null, guess: null, characterSet: '⛓░🕱🕱🕱🕈▒░⛓' },
  { id: bid(42), number: 42, name: 'Biome 42', nickname: 'Big Grass',    status: 'unknown', category: null, rarity: rarity(42), images: null, guess: null, characterSet: '⛆༽༼༼༼༼༼༽⛆' },
  { id: bid(43), number: 43, name: 'Biome 43', nickname: null,           status: 'unknown', category: null, rarity: rarity(43), images: null, guess: null, characterSet: '░░⋆░.░░░🏠' },
  { id: bid(44), number: 44, name: 'Biome 44', nickname: null, status: 'unknown', category: null, rarity: rarity(44), images: null, guess: null, characterSet: '🏠⛆░░⛱⋰⋰⋰⋰' },
  { id: bid(45), number: 45, name: 'Biome 45', nickname: null, status: 'unknown', category: null, rarity: rarity(45), images: null, guess: null, characterSet: '⋮⋮⋮⋮⋮░░░░' },
  { id: bid(46), number: 46, name: 'Biome 46', nickname: null, status: 'unknown', category: null, rarity: rarity(46), images: null, guess: null, characterSet: '❀..⫯⫯..⫯❀' },
  { id: bid(47), number: 47, name: 'Biome 47', nickname: null, status: 'unknown', category: null, rarity: rarity(47), images: null, guess: null, characterSet: '⛫⛫⛫⋰⋰⋰⛫⛫⛫' },
  { id: bid(48), number: 48, name: 'Biome 48', nickname: null, status: 'unknown', category: null, rarity: rarity(48), images: null, guess: null, characterSet: '⚑⋰⋰⋰⋰⋰⋰⋰🏔' },
  { id: bid(49), number: 49, name: 'Biome 49', nickname: null, status: 'unknown', category: null, rarity: rarity(49), images: null, guess: null, characterSet: '🏔═══════🏔' },
  { id: bid(50), number: 50, name: 'Biome 50', nickname: null, status: 'unknown', category: null, rarity: rarity(50), images: null, guess: null, characterSet: '🕈🞗🞗🞗⩎⛆⍝⛆⍝' },
  { id: bid(51), number: 51, name: 'Biome 51', nickname: null, status: 'unknown', category: null, rarity: rarity(51), images: null, guess: null, characterSet: '⍝.░░░..✗⍝' },
  { id: bid(52), number: 52, name: 'Biome 52', nickname: null, status: 'unknown', category: null, rarity: rarity(52), images: null, guess: null, characterSet: '⋰⋰⋮⋮⋮⋯⋯⋱⋱' },
  { id: bid(53), number: 53, name: 'Biome 53', nickname: null, status: 'unknown', category: null, rarity: rarity(53), images: null, guess: null, characterSet: '🕱🕱🀰🀰🀰🀰⛓⛓⛓' },
  { id: bid(54), number: 54, name: 'Biome 54', nickname: null, status: 'unknown', category: null, rarity: rarity(54), images: null, guess: null, set: 'binary', characterSet: '🕱🕱001100🖳' },
  { id: bid(55), number: 55, name: 'Biome 55', nickname: null, status: 'unknown', category: null, rarity: rarity(55), images: null, guess: null, characterSet: '𓁹..⇩⇩..🗁🗁' },
  { id: bid(56), number: 56, name: 'Biome 56', nickname: null, status: 'unknown', category: null, rarity: rarity(56), images: null, guess: null, characterSet: '⟰⋮⋮⫯⋮⋮⟰⟰⟰' },
  { id: bid(57), number: 57, name: 'Biome 57', nickname: null, status: 'unknown', category: null, rarity: rarity(57), images: null, guess: null, characterSet: '..######⛫' },
  { id: bid(58), number: 58, name: 'Biome 58', nickname: null, status: 'unknown', category: null, rarity: rarity(58), images: null, guess: null, set: 'binary', characterSet: '000..1111' },
  { id: bid(59), number: 59, name: 'Biome 59', nickname: null, status: 'unknown', category: null, rarity: rarity(59), images: null, guess: null, characterSet: '⌬╚╔╣╣═══⌬' },
  { id: bid(60), number: 60, name: 'Biome 60', nickname: null, status: 'unknown', category: null, rarity: rarity(60), images: null, guess: null, characterSet: '⎛⎛░░░░░⎞⎞' },
  { id: bid(61), number: 61, name: 'Biome 61', nickname: null, status: 'unknown', category: null, rarity: rarity(61), images: null, guess: null, characterSet: '❀⋮⋮༽༽⋮⋮⋮❀' },
  { id: bid(62), number: 62, name: 'Biome 62', nickname: null, status: 'unknown', category: null, rarity: rarity(62), images: null, guess: null, characterSet: '🗡🞗🞗🞗🞗𓁹𓁹𓁹🗝' },
  { id: bid(63), number: 63, name: 'Biome 63', nickname: null, status: 'unknown', category: null, rarity: rarity(63), images: null, guess: null, characterSet: '⌬༼༼༼༼༼༼༼⌬' },
  { id: bid(64), number: 64, name: 'Biome 64', nickname: null,            status: 'unknown', category: null, rarity: rarity(64), images: null, guess: null, characterSet: '⋮⋮⋮⌬⌬⋮⋮⋮🗝' },
  { id: bid(65), number: 65, name: 'Biome 65', nickname: 'Little Grass', status: 'unknown', category: null, rarity: rarity(65), images: null, guess: null, characterSet: '༼༼༼༽༽༽༽༽༽' },
  { id: bid(66), number: 66, name: 'Biome 66', nickname: null,            status: 'unknown', category: null, rarity: rarity(66), images: null, guess: null, characterSet: '🖳🖳🖳🞗🞗🗊🗊🗊🗊' },
  { id: bid(67), number: 67, name: 'Biome 67', nickname: null, status: 'unknown', category: null, rarity: rarity(67), images: null, guess: null, characterSet: '✎༽༽༽༽༽༽༽✎' },
  { id: bid(68), number: 68, name: 'Biome 68', nickname: null, status: 'unknown', category: null, rarity: rarity(68), images: null, guess: null, characterSet: '♥♡..🗠🗠..♡' },
  {
    id: bid(70),
    number: 70,
    name: 'Biome 70',
    nickname: 'Rare Pepe',
    status: 'uncertain',
    category: 'art',
    rarity: rarity(70),
    images: null,
    guess: 'Rare Pepe / Pepe the Frog — Bitcoin blockchain, 2016',
    description:
      'Mirrors the structure of the confirmed Biome 69 (MTAA Simple Net Art Diagram), replacing one terminal with 𓆏 — the Egyptian frog hieroglyph (U+1318F), adopted in crypto culture as an ironic high-status representation of Pepe the Frog. Rare Pepe was one of the earliest on-chain art movements, beginning on Bitcoin in 2016 and predating Ethereum NFTs.',
    characterSet: '𓆏══════🖳🖳',
  },
  {
    id: bid(71),
    number: 71,
    name: 'Biome 71',
    nickname: 'gm',
    status: 'uncertain',
    category: 'art',
    rarity: rarity(71),
    images: null,
    guess: 'Web3 "gm" (good morning) greeting culture, ~2020–2022',
    description:
      '"gm" (good morning) became the defining daily ritual of NFT Twitter and crypto culture roughly 2020–2022 — a shorthand greeting exchanged between collectors, artists, and builders to signal community membership and optimism. The terminal bookends (🖳) tie it to the net art lineage of Biome 69.',
    characterSet: '🖳♥♥gm♥♥♥🖳',
  },
  {
    id: bid(72),
    number: 72,
    name: 'Biome 72',
    nickname: '城',
    status: 'uncertain',
    category: 'architecture',
    rarity: rarity(72),
    images: null,
    guess: 'Hypercastle self-reference — 城 (castle/city in Japanese and Chinese)',
    description:
      '城 (jō / chéng) means "castle" or "walled city" in both Japanese and Chinese. Sharing the same structural template as the adjacent Biome 71 (terminal + hearts + text + hearts + terminal), this is likely a self-referential nod to the Hypercastle — the 3D aggregate structure that emerges when all of Terraforms is rendered as a single object in cyberspace.',
    characterSet: '🖳♥♥城城♥♥♥🖳',
  },
  {
    id: bid(73),
    number: 73,
    name: 'Biome 73',
    nickname: 'Noughts and Crosses',
    status: 'uncertain',
    category: 'abstract',
    rarity: rarity(73),
    images: null,
    guess: 'Tic-tac-toe / Noughts and Crosses — rendered in blackletter Unicode',
    description:
      '𝕺 (Mathematical Bold Fraktur O) and 𝖃 (Mathematical Bold Fraktur X) are the O and X of tic-tac-toe, rendered in ornate medieval type. 🞗 (crossed square) serves as the separator between the two players\' pieces. Biome 76 appears to be a variant of this set, mixing in 城 (castle) — possibly a chess rook or Hypercastle allusion.',
    characterSet: '𝕺𝕺𝕺🞗🞗🞗𝖃𝖃𝖃',
  },
  { id: bid(74), number: 74, name: 'Biome 74', nickname: null, status: 'unknown', category: null, rarity: rarity(74), images: null, guess: null, characterSet: '░░░🟣🟣🟣🟣🟣░' },
  {
    id: bid(75),
    number: 75,
    name: 'Biome 75',
    nickname: '지하철역',
    status: 'uncertain',
    category: 'architecture',
    rarity: rarity(75),
    images: null,
    guess: 'Seoul Metro / Korean subway signage',
    description:
      '지 and 역 are the constituent syllables of 지하철역 (subway station in Korean). The pattern — three repetitions of each, separated by dashes — mimics the directional route displays inside Seoul Metro carriages, which show upcoming and past stations as repeating blocks of characters with a separator in the middle.',
    characterSet: '지지지---역역역',
  },
  {
    id: bid(76),
    number: 76,
    name: 'Biome 76',
    nickname: null,
    status: 'uncertain',
    category: 'abstract',
    rarity: rarity(76),
    images: null,
    guess: 'Variant of Biomes 73 and 72 — blackletter O/X + castle 城',
    description:
      'Combines the blackletter tic-tac-toe motif of Biome 73 (𝕺 = O, 𝖃 = X) with the 城 castle character of Biome 72. May represent a chess-castle/rook element within the noughts-and-crosses sequence, or be a third variation in the same family.',
    characterSet: '𝕺🞗🞗🞗城城𝖃𝖃𝖃',
  },
  { id: bid(77), number: 77, name: 'Biome 77', nickname: null, status: 'unknown', category: null, rarity: rarity(77), images: null, guess: null, characterSet: '▧══▧═══▧▧' },
  { id: bid(78), number: 78, name: 'Biome 78', nickname: null, status: 'unknown', category: null, rarity: rarity(78), images: null, guess: null, characterSet: '▧▧⬚▧⬚⬚⬚▧▧' },
  { id: bid(79), number: 79, name: 'Biome 79', nickname: null, status: 'unknown', category: null, rarity: rarity(79), images: null, guess: null, characterSet: '▩▩▧🞗🞗🞗🞗▧▩' },
  { id: bid(80), number: 80, name: 'Biome 80', nickname: null, status: 'unknown', category: null, rarity: rarity(80), images: null, guess: null, characterSet: '◩◩◪..◩◩◪◪' },
  { id: bid(81), number: 81, name: 'Biome 81', nickname: null, status: 'unknown', category: null, rarity: rarity(81), images: null, guess: null, characterSet: '◩◪◪⛆⛆◩◩◩⛆' },
  { id: bid(82), number: 82, name: 'Biome 82', nickname: null, status: 'unknown', category: null, rarity: rarity(82), images: null, guess: null, characterSet: '╳╱╱╱╳╲╲╲╳' },
  { id: bid(83), number: 83, name: 'Biome 83', nickname: null, status: 'unknown', category: null, rarity: rarity(83), images: null, guess: null, characterSet: '🌢⚑⚑⚑⚑⚑⚑⚑★' },
  { id: bid(84), number: 84, name: 'Biome 84', nickname: null, status: 'unknown', category: null, rarity: rarity(84), images: null, guess: null, characterSet: '___|||_||' },
  { id: bid(85), number: 85, name: 'Biome 85', nickname: null, status: 'unknown', category: null, rarity: rarity(85), images: null, guess: null, set: 'chess', characterSet: '♜♖░░░░♘♘♛' },
  { id: bid(86), number: 86, name: 'Biome 86', nickname: null, status: 'unknown', category: null, rarity: rarity(86), images: null, guess: null, characterSet: '🖧🞗🞗🞗🞗🞗🖧🗈🗈' },
  { id: bid(87), number: 87, name: 'Biome 87', nickname: null, status: 'unknown', category: null, rarity: rarity(87), images: null, guess: null, characterSet: '▂✗✗⛆⛆✗✗⛆▂' },
  { id: bid(88), number: 88, name: 'Biome 88', nickname: null, status: 'unknown', category: null, rarity: rarity(88), images: null, guess: null, characterSet: '{}---%%%%' },
  { id: bid(89), number: 89, name: 'Biome 89', nickname: null, status: 'unknown', category: null, rarity: rarity(89), images: null, guess: null, set: 'binary', characterSet: '0...-^../' },
  { id: bid(90), number: 90, name: 'Biome 90', nickname: null, status: 'unknown', category: null, rarity: rarity(90), images: null, guess: null, characterSet: '_~~~~.*⫯❀' },
  { id: bid(91), number: 91, name: 'Biome 91', nickname: null, status: 'unknown', category: null, rarity: rarity(91), images: null, guess: null, characterSet: '🟣╚╔╣╣═══⛓' },
];

export const confirmedBiomes = biomes.filter(b => b.status === 'confirmed');
export const uncertainBiomes  = biomes.filter(b => b.status === 'uncertain');
export const unknownBiomes   = biomes.filter(b => b.status === 'unknown');

