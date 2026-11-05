import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import { ParcelAndReference, ExternalLinks, VideoEmbed } from '@/components/DetailSections';
import { biomePages, seedTraits, BIOME_CATEGORIES, BIOME_SETS } from '@/data/biomes';
import { BIOME_PARCEL_IDS } from '@/data/parcelIds';

export async function generateStaticParams() {
  return biomePages.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const biome = biomePages.find((b) => b.id === id);
  if (!biome) return {};
  const title = biome.nickname
    ? `${biome.name} - ${biome.nickname} - terraform lore`
    : `${biome.name} - terraform lore`;
  return {
    title,
    description: biome.description?.slice(0, 160),
    alternates: { canonical: `https://terraformlore.xyz/biomes/${id}` },
  };
}

export default async function BiomePage({ params }) {
  const { id } = await params;
  const biome = biomePages.find((b) => b.id === id);
  if (!biome) notFound();

  const isTheory = biome.status === 'uncertain';
  const cat = BIOME_CATEGORIES[biome.category];
  const biomeSet = BIOME_SETS[biome.set];
  const ref = biome.guess || biome.reference || 'unknown';
  const isSeedTrait = seedTraits.includes(biome);
  const displayTitle = biome.nickname ? `${biome.name} - ${biome.nickname}` : biome.name;

  return (
    <div className="content-wrapper">
      <Header />
      <main className="flex-1 px-6" style={{ maxWidth: '900px' }}>

        <a href="/biomes" className="text-xs dim-40 inline-block mb-8">← biome references</a>

        {/* Character set - mirrors the palette swatch on zone pages */}
        {biome.characterSet && (
          <div className="mb-8">
            <div className="flex flex-wrap" style={{ gap: '12px' }}>
              {[...biome.characterSet].map((char, i) => (
                <div key={i} className="text-center">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      border: '1px solid rgba(232,232,232,0.12)',
                      fontSize: '28px',
                      fontFamily: "var(--font-noto-symbols), 'Courier New', monospace",
                    }}
                  >
                    {char}
                  </div>
                  <pre className="text-xs mt-2 dim-35" style={{ fontFamily: 'inherit', margin: '6px 0 0' }}>{i}</pre>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 dim-25">
              {[...biome.characterSet].length} character{[...biome.characterSet].length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className="flex justify-between items-start gap-4 mb-6">
          <h1 className="text-3xl">{displayTitle}</h1>
          <StatusBadge status={biome.status} category={cat} set={biomeSet} className="mt-2" />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(232,232,232,0.12)', marginBottom: '24px' }} />

        <p className="text-sm dim-40 mb-4">mathcastles reference</p>
        <p className="text-sm mb-8" style={{ opacity: isTheory ? 0.45 : 0.7 }}>{ref}</p>
        <p className="text-sm mb-10 dim-65" style={{ lineHeight: '1.8' }}>{biome.description}</p>

        <ParcelAndReference
          parcelIds={BIOME_PARCEL_IDS[biome.id]}
          name={biome.name}
          label={isSeedTrait ? `${biome.name} parcel` : 'biome parcel'}
          image={biome.images?.reference}
          altText={ref}
          isTheory={isTheory}
        />

        <VideoEmbed video={biome.video} />

        <ExternalLinks
          referenceLink={biome.referenceLink}
          explorerUrl={isSeedTrait ? null : 'https://terraformexplorer.xyz/biomes'}
          sourceUrl={biome.sourceUrl}
        />

        {/* Community references */}
        {biome.referencedBy?.length > 0 && (
          <div className="mt-10">
            <p className="text-sm dim-55 mb-4">community references</p>
            {biome.referencedBy.map((entry, i) => (
              <div key={i} className="border-top pt-4 pb-4">
                <p className="text-sm dim-80" style={{ lineHeight: '1.7' }}>{entry.description}</p>
                {entry.tweet && (
                  <div className="mt-4 p-4" style={{ border: '1px solid rgba(232,232,232,0.1)', maxWidth: '480px' }}>
                    <p className="text-xs dim-80" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>{entry.tweet.text}</p>
                    {entry.tweet.image && (
                      <img src={entry.tweet.image} alt="" loading="lazy" style={{ display: 'block', width: '100%', marginTop: '12px', maxHeight: '320px', objectFit: 'cover' }} />
                    )}
                    <div className="flex gap-3 mt-3" style={{ opacity: 0.4 }}>
                      <span className="text-xs">@{entry.tweet.author}</span>
                      <span className="text-xs">{entry.tweet.date}</span>
                      {entry.sourceLink && (
                        <a href={entry.sourceLink} target="_blank" rel="noopener noreferrer"
                          className="text-xs" style={{ color: 'inherit' }}>↗</a>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex gap-4 mt-3" style={{ opacity: 0.3 }}>
                  {entry.handle && <span className="text-xs">submitted by {entry.handle}</span>}
                  {!entry.tweet && entry.sourceLink && (
                    <a href={entry.sourceLink} target="_blank" rel="noopener noreferrer"
                      className="text-xs" style={{ color: 'inherit' }}>source ↗</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
