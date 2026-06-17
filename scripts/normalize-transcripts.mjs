// Normalize the three 113 source transcripts into a single, consistent on-site
// shape and write them as JSON into src/data/transcripts/.
//
// Source files live in the author's Obsidian vault (not in this repo). Re-run
// this only if those sources change:
//   node scripts/normalize-transcripts.mjs
//
// Cleanup level: "light editorial polish" — collapse auto-transcription glitch
// artifacts (a word stuttered many times, runs of "um/uh" filler, duplicated
// fragments) and lightly tidy casing/spacing for readability. No substantive
// words are cut and nothing is paraphrased. Timestamps are dropped.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'src', 'data', 'transcripts');

const VAULT = '/Users/jameseddington/Documents/Obsidian Vault/Assets';
const SRC = {
  hivemind: path.join(VAULT, '113Hivemind_transcript_June2024.md'),
  netSociety: path.join(
    VAULT,
    '113 podcast -Net Society Ep21 The Call is Coming From Inside The Blockchain.md'
  ),
  may2026: path.join(
    VAULT,
    '113spacesMay2026Trading_cards,_NFTs,_collectibles,_think_piece_simulacra_utterance.txt'
  ),
};

// ---------------------------------------------------------------------------
// Text cleanup helpers
// ---------------------------------------------------------------------------

const FILLER = new Set([
  'um', 'umm', 'ummm', 'uh', 'uhh', 'uhhh', 'uhm', 'erm', 'er', 'mm', 'mmm',
  'hmm', 'hmmm',
]);

// alnum core of a token, lowercased — used to compare consecutive words
const core = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

// Collapse runs of an identical phrase, e.g. "you know you know" -> "you know".
function collapsePhrases(text) {
  const phrases = [
    'you know what i mean',
    'you know',
    'i mean',
    'kind of',
    'sort of',
    'or something',
    'or whatever',
  ];
  for (const p of phrases) {
    const re = new RegExp(`\\b(${p})(\\s+\\1\\b)+`, 'gi');
    text = text.replace(re, '$1');
  }
  return text;
}

// Collapse an immediately repeated run of words, e.g.
// "how did the how did the" -> "how did the", "get to get to" -> "get to".
// These back-to-back phrase repeats are speech restarts / transcription
// stutters. Window up to 6 words; longest match wins; iterates to fixpoint.
function collapseRepeatedNgrams(tokens) {
  let changed = true;
  while (changed) {
    changed = false;
    for (let n = 6; n >= 1; n--) {
      for (let i = 0; i + 2 * n <= tokens.length; i++) {
        let match = true;
        for (let k = 0; k < n; k++) {
          if (core(tokens[i + k]) !== core(tokens[i + n + k])) {
            match = false;
            break;
          }
        }
        if (match) {
          tokens.splice(i + n, n); // drop the second copy
          changed = true;
        }
      }
      if (changed) break; // restart scan after any edit
    }
  }
  return tokens;
}

// Drop filler tokens (um/uh/…) and collapse repeated words/phrases.
function dropFillerAndDuplicates(text) {
  const tokens = text.split(/\s+/).filter((t) => t && !FILLER.has(core(t)));
  return collapseRepeatedNgrams(tokens).join(' ');
}

// Light casing fixes: standalone "i" -> "I", sentence-start capitalisation.
function fixCasing(text) {
  text = text
    .replace(/\bi\b/g, 'I')
    .replace(/\bi'm\b/gi, "I'm")
    .replace(/\bi'll\b/gi, "I'll")
    .replace(/\bi've\b/gi, "I've")
    .replace(/\bi'd\b/gi, "I'd");
  // Capitalise first alpha char after a sentence terminator or at the start.
  text = text.replace(/(^|[.?!]\s+)([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase());
  return text;
}

function tidySpacing(text) {
  return text
    .replace(/\s+([,.;:?!])/g, '$1') // no space before punctuation
    .replace(/\s{2,}/g, ' ')
    .replace(/,\s*,/g, ',')
    .trim();
}

// Full single-segment cleanup pipeline.
function clean(text) {
  let t = text.replace(/\s+/g, ' ').trim();
  t = dropFillerAndDuplicates(t);
  t = collapsePhrases(t);
  t = tidySpacing(t);
  t = fixCasing(t);
  return t;
}

// ---------------------------------------------------------------------------
// Paragraph reflow for the un-paragraphed Hivemind transcript
// ---------------------------------------------------------------------------

function splitSentences(text) {
  // Split keeping terminators attached to the sentence.
  const parts = text.split(/([.?!]+)(\s+)/);
  const sentences = [];
  for (let i = 0; i < parts.length; i += 3) {
    const body = parts[i] || '';
    const term = parts[i + 1] || '';
    const s = (body + term).trim();
    if (s) sentences.push(s);
  }
  return sentences;
}

// A "sentence" with no internal punctuation can be enormous (the source has
// long unpunctuated runs). Soft-split very long ones at clause words.
function softSplit(sentence, maxWords = 70) {
  const words = sentence.split(' ');
  if (words.length <= maxWords) return [sentence];
  const chunks = [];
  let cur = [];
  const breakAfter = new Set(['and', 'but', 'so', 'because', 'or']);
  for (let i = 0; i < words.length; i++) {
    cur.push(words[i]);
    const w = core(words[i]);
    const endsClause = /[,;]$/.test(words[i]) || breakAfter.has(w);
    if (cur.length >= 45 && endsClause) {
      chunks.push(cur.join(' '));
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur.join(' '));
  return chunks;
}

function reflowToParagraphs(text, targetWords = 80) {
  const sentences = splitSentences(text).flatMap((s) => softSplit(s));
  const paras = [];
  let cur = [];
  let count = 0;
  for (const s of sentences) {
    cur.push(s);
    count += s.split(' ').length;
    if (count >= targetWords) {
      paras.push(cur.join(' '));
      cur = [];
      count = 0;
    }
  }
  if (cur.length) paras.push(cur.join(' '));
  return paras;
}

// Merge consecutive turns by the same speaker into one turn.
function mergeTurns(turns) {
  const merged = [];
  for (const t of turns) {
    const last = merged[merged.length - 1];
    if (last && last.speaker === t.speaker) {
      last.paras.push(...t.paras);
    } else {
      merged.push({ speaker: t.speaker, paras: [...t.paras] });
    }
  }
  // drop empty paragraphs / empty turns
  for (const t of merged) t.paras = t.paras.filter((p) => p && p.trim());
  return merged.filter((t) => t.paras.length);
}

// ---------------------------------------------------------------------------
// Per-source parsers
// ---------------------------------------------------------------------------

function parseHivemind(raw) {
  const body = raw
    .split('\n')
    .filter((l) => !l.startsWith('#')) // drop the markdown title
    .join(' ');
  const cleaned = clean(body);
  const paras = reflowToParagraphs(cleaned);
  return mergeTurns([{ speaker: null, paras }]);
}

// The auto-transcriber hears 113 ("one one three") as a spoken number when the
// hosts address him by name, and renders it inconsistently. Normalise those
// address forms back to "113". Scoped to this transcript: in context every
// "one('one')? three" / "one two and three" here is the hosts naming 113.
const NET_FIXUPS = [
  [/\bone,?\s+two\s+and\s+three\b/gi, '113'],
  [/\bone,?\s+one,?\s+three\b/gi, '113'],
  [/\bone,?\s+three\b/gi, '113'],
];

// The source auto-transcript starts mid-exchange (the open was clipped). This
// is the missing intro, supplied by the author from the original recording:
// Aaron sets up the running "Habsburg" bit, Chris retorts and turns it on him,
// and Aaron's reply ("I don't…") is where the source transcript picks up.
const NET_INTRO = [
  { speaker: 'Aaron', paras: ["I guess we're all living in the shadow of the Habsburg Empire."] },
  {
    speaker: 'Chris',
    paras: [
      "Wasn't that obvious?",
      "So don't you feel the Hapsburg is looming over you every day?",
    ],
  },
];

function applyFixups(turns, fixups) {
  for (const turn of turns) {
    turn.paras = turn.paras.map((p) =>
      fixups.reduce((acc, [re, to]) => acc.replace(re, to), p)
    );
  }
  return turns;
}

// The Net Society source is a hand-cleaned markdown transcript: a bare speaker
// name on its own line (Aaron / Chris / Pri / Derek / 113) marks a turn change,
// blank-line-separated paragraphs follow, and the opening block (before any
// label) is the host, Aaron. It is already cleaned, so paragraphs are taken
// verbatim (trimmed) rather than re-run through the polish pipeline.
function parseNetSociety(raw) {
  const lines = raw.split('\n');
  const labelRe = /^(Aaron|Chris|Pri|Derek|113)\s*$/;
  const titleIdx = lines.findIndex((l) => /^#\s/.test(l));
  const start = titleIdx === -1 ? 0 : titleIdx + 1;
  const turns = [];
  let speaker = 'Aaron'; // the opening block is the host
  for (let i = start; i < lines.length; i++) {
    const line = lines[i].trim();
    if (labelRe.test(line)) {
      speaker = line;
      continue;
    }
    if (line === '') continue;
    turns.push({ speaker, paras: [line] });
  }
  return applyFixups(mergeTurns([...NET_INTRO, ...turns]), NET_FIXUPS);
}

function parseMay2026(raw) {
  const lines = raw.split('\n');
  const speakerRe = /^Speaker ([A-Z]):\s*$/;
  const turns = [];
  let speaker = '113';
  for (const line of lines) {
    const m = line.match(speakerRe);
    if (m) {
      // Speaker A is the host (113); keep the rest as anonymous guests.
      speaker = m[1] === 'A' ? '113' : `Guest ${m[1]}`;
      continue;
    }
    if (line.trim() === '') continue;
    const para = clean(line);
    if (para) turns.push({ speaker, paras: [para] });
  }
  return mergeTurns(turns);
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const transcripts = [
  {
    slug: 'hivemind-june-2024',
    title: '113 Hivemind',
    kind: 'Private discussion',
    date: 'June 2024',
    dateSort: '2024-06',
    source: null,
    blurb:
      'A long private conversation — 113 on Xerox PARC, the unfinished medium of computing, ' +
      'aesthetic arrest, and why crypto is the un-gatekept place an artist can actually work.',
    turns: parseHivemind(fs.readFileSync(SRC.hivemind, 'utf8')),
  },
  {
    slug: 'net-society-ep21',
    title: 'The Call Is Coming From Inside the Blockchain',
    kind: 'Net Society · Episode 21',
    date: '2025',
    dateSort: '2025-01',
    source: { label: 'Net Society · Ep 21', url: 'https://share.transistor.fm/s/4cdc9190' },
    blurb:
      '113 joins Aaron, Chris and Pri to talk Ethereum as a cultural settlement layer, ' +
      'art vs. product, the Imperium and the Dominion, and treating computation as an ' +
      'artistic medium with dignity.',
    turns: parseNetSociety(fs.readFileSync(SRC.netSociety, 'utf8')),
  },
  {
    slug: 'twitter-spaces-may-2026',
    title: 'Trading Cards, NFTs, Collectibles & “Think-Piece” Simulacra',
    kind: 'Twitter Spaces',
    date: 'May 2026',
    dateSort: '2026-05',
    source: null,
    blurb:
      'A ~2.5-hour Twitter Space: 113 on the word “art” as crypto’s original sin, reclaiming ' +
      '“NFTs”, Beeple as party favours, novelty as emergent phenomena, and exiting art entirely.',
    turns: parseMay2026(fs.readFileSync(SRC.may2026, 'utf8')),
  },
];

for (const t of transcripts) {
  const file = path.join(OUT_DIR, `${t.slug}.json`);
  fs.writeFileSync(file, JSON.stringify(t, null, 2) + '\n');
  const words = t.turns.reduce(
    (n, turn) => n + turn.paras.reduce((m, p) => m + p.split(' ').length, 0),
    0
  );
  console.log(
    `${t.slug}: ${t.turns.length} turns, ` +
      `${t.turns.reduce((n, x) => n + x.paras.length, 0)} paragraphs, ~${words} words`
  );
}
