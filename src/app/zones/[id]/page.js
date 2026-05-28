import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import ParcelViewer from '@/components/ParcelViewer';
import { MetadataTable, ExternalLinks } from '@/components/DetailSections';
import HypercastleMap, { groupHypercastle, levelLabel } from '@/components/HypercastleMap';
import { zones, CATEGORIES } from '@/data/zones';
import { ZONE_PARCEL_IDS } from '@/data/parcelIds';

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// Minimal inline renderer for markdown-style [text](url) links in descriptions.
function renderWithLinks(text) {
  if (!text) return text;
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const out = [];
  let last = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
        {m[1]}
      </a>
    );
    last = regex.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export async function generateStaticParams() {
  return zones.filter((z) => z.status !== 'unknown').map((z) => ({ id: z.id }));
}

// Extract first 1–2 complete sentences, never cutting mid-sentence
function firstSentences(text, max = 200) {
  if (!text) return '';
  const sentences = text.split(/(?<=[.!?])\s+/);
  let out = sentences[0];
  if (out.length < 100 && sentences[1] && out.length + sentences[1].length + 1 <= max) {
    out += ' ' + sentences[1];
  }
  return out.length <= max ? out : out.slice(0, max);
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const zone = zones.find((z) => z.id === id);
  if (!zone) return {};
  const title = `${zone.name} - terraform lore`;
  const ref = zone.reference ?? zone.guess ?? zone.suggestion ?? '';

  const description = firstSentences(zone.description);
  const ogDescription = ref ? `${zone.name}: ${ref}. ${firstSentences(zone.description, 160)}` : description;
  // OG image is handled by opengraph-image.js (palette swatches + zone name)
  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description: ogDescription,
      url: `https://terraformlore.xyz/zones/${id}`,
      siteName: 'terraform lore',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@TerraformsOTC',
      title,
      description: ogDescription,
    },
    alternates: {
      canonical: `https://terraformlore.xyz/zones/${id}`,
    },
  };
}

export default async function ZonePage({ params }) {
  const { id } = await params;
  const zone = zones.find((z) => z.id === id);
  if (!zone || zone.status === 'unknown') notFound();

  const isTheory = zone.status === 'uncertain' || zone.status === 'llm';
  const cat = CATEGORIES[zone.category];
  const ref = zone.suggestion || zone.guess || zone.reference;
  const parcelIds = ZONE_PARCEL_IDS[id] || null;
  const hasReference = zone.images?.reference;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${zone.name} - ${ref}`,
    description: zone.description?.slice(0, 200) ?? '',
    url: `https://terraformlore.xyz/zones/${id}`,
    isPartOf: { '@type': 'WebSite', name: 'terraform lore', url: 'https://terraformlore.xyz' },
    about: { '@type': 'Thing', name: zone.name },
    ...(zone.creditTo && { author: { '@type': 'Person', name: zone.creditTo } }),
  };

  return (
    <div className="content-wrapper">
      {/* Safe: all jsonLd values come from hardcoded zones.js - never user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <div
        className="flex-1 px-6"
        style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}
      >
      <main style={{ flex: '1 1 0', minWidth: 0, maxWidth: '900px' }}>

        <a href="/" className="text-sm dim-55 inline-block mb-8">← zone references</a>

        {/* Palette */}
        {zone.palette?.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap" style={{ gap: '12px' }}>
              {zone.palette.map((color, i) => (
                <div key={i} className="group text-center">
                  <div className="flex items-center justify-center" style={{ width: '60px', height: '60px', backgroundColor: color }}>
                    <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                       style={{ color: isLightColor(color) ? '#000' : '#fff', lineHeight: 1.2 }}>
                      {color}
                    </p>
                  </div>
                  <pre className="text-xs mt-2 dim-55" style={{ fontFamily: 'inherit', margin: '6px 0 0' }}>{i}</pre>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 dim-55">{zone.palette.length} colour{zone.palette.length !== 1 ? 's' : ''}</p>
          </div>
        )}

        {/* Title + badge */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <h1 className="text-3xl">{zone.name}</h1>
          <StatusBadge status={zone.status} category={cat} twin={zone.twin} className="mt-2" />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(232,232,232,0.12)', marginBottom: '24px' }} />

        <p className="text-sm dim-55 mb-4">mathcastles reference</p>
        <p className="text-sm mb-8" style={{ opacity: isTheory ? 0.65 : 0.85 }}>{ref}</p>
        <p className="text-sm mb-10 dim-80" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>{renderWithLinks(zone.description)}</p>

        {/* Hypercastle position — mobile only (desktop shows the visual map) */}
        {zone.hypercastle?.length > 0 && (
          <div className="mb-10 lg:hidden">
            <p className="text-sm dim-55 mb-3">hypercastle position</p>
            {[...groupHypercastle(zone.hypercastle).entries()]
              .sort((a, b) => b[0] - a[0])
              .map(([level, entry]) => (
                <p key={level} className="text-sm dim-80 mb-1">{levelLabel(level, entry)}</p>
              ))}
          </div>
        )}

        {/* Parcel + reference image side by side */}
        {(parcelIds || hasReference) && (
          <div
            className="grid gap-6 mb-10"
            style={{ gridTemplateColumns: parcelIds && hasReference ? '277px 1fr' : '277px' }}
          >
            {parcelIds && (
              <ParcelViewer parcelIds={parcelIds} zoneName={zone.name} />
            )}
            {hasReference && (
              <div>
                <p className="text-xs mb-2 dim-55">{isTheory ? 'possible reference' : 'reference'}</p>
                <img
                  src={zone.images.reference}
                  alt={ref}
                  loading="lazy"
                  style={{ display: 'block', width: '100%', maxHeight: '400px', objectFit: 'contain', objectPosition: 'left top' }}
                />
              </div>
            )}
          </div>
        )}

        {!isTheory && (
          <MetadataTable rows={[
            { label: 'rarity', value: zone.rarity },
          ]} />
        )}

        <ExternalLinks
          referenceLink={zone.referenceLink}
          explorerUrl={`https://terraformexplorer.xyz/zones/${encodeURIComponent(zone.name)}`}
          sourceUrl={zone.sourceUrl}
        />

        {/* Community references */}
        {zone.referencedBy?.length > 0 && (
          <div className="mt-10">
            <p className="text-sm dim-55 mb-4">community references</p>
            {zone.referencedBy.map((entry, i) => (
              <div key={i} className="border-top pt-4 pb-4">
                <p className="text-sm dim-80" style={{ lineHeight: '1.7' }}>{entry.description}</p>
                {entry.tweet && (
                  <a
                    href={entry.sourceLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 p-4 block"
                    style={{ border: '1px solid rgba(232,232,232,0.1)', maxWidth: '480px', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div style={{ opacity: 0.5 }}>
                        <span className="text-xs">@{entry.tweet.author}</span>
                        <span className="text-xs" style={{ marginLeft: '8px' }}>{entry.tweet.date}</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.3, flexShrink: 0 }}>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.733-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <p className="text-xs dim-80" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>{entry.tweet.text}</p>
                    {entry.tweet.image && (
                      <img src={entry.tweet.image} alt="" loading="lazy" style={{ display: 'block', width: '100%', marginTop: '12px', maxHeight: '320px', objectFit: 'cover' }} />
                    )}
                  </a>
                )}
                <div className="flex gap-4 mt-3" style={{ opacity: 0.3 }}>
                  {entry.handle && <span className="text-xs">submitted by {entry.handle}</span>}
                  {!entry.tweet && entry.sourceLink && (
                    <a href={entry.sourceLink} target="_blank" rel="noopener noreferrer"
                      className="text-xs" style={{ color: 'inherit' }}>
                      source ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Desktop-only hypercastle map sidebar */}
      {zone.hypercastle?.length > 0 && (
        <aside
          className="hidden lg:block"
          style={{ width: '350px', flexShrink: 0, position: 'sticky', top: '40px' }}
        >
          <HypercastleMap hypercastle={zone.hypercastle} />
        </aside>
      )}
      </div>
      <Footer />
    </div>
  );
}
