// Full transcripts linked from the 113isms page.
//
// The JSON files in this folder are generated from the author's source
// transcripts by scripts/normalize-transcripts.mjs — do not hand-edit them.
// Each transcript has the shape:
//   { slug, title, kind, date, dateSort, source, blurb, turns }
// where turns is [{ speaker: string | null, paras: string[] }].

import hivemind from './hivemind-june-2024.json';
import netSociety from './net-society-ep21.json';
import may2026 from './twitter-spaces-may-2026.json';

// Ordered oldest → newest to match the 113isms index.
export const transcripts = [hivemind, netSociety, may2026].sort((a, b) =>
  a.dateSort.localeCompare(b.dateSort)
);

export const transcriptSlugs = transcripts.map((t) => t.slug);

export function getTranscript(slug) {
  return transcripts.find((t) => t.slug === slug) || null;
}

// Lightweight metadata (no body) for listings.
export const transcriptIndex = transcripts.map(
  ({ slug, title, kind, date, dateSort, blurb }) => ({
    slug,
    title,
    kind,
    date,
    dateSort,
    blurb,
  })
);
