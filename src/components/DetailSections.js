/**
 * Shared building blocks for zone and biome detail pages.
 * Eliminates ~120 lines of duplication between zones/[id] and biomes/[id].
 */

// Used by biome detail pages (two static images, equal columns).
// Zone detail pages use ParcelViewer + inline reference instead (fixed 277px parcel column).
export function ImageGrid({ images, name, altText, isTheory, sampleLabel = 'zone parcel' }) {
  if (!images || (!images.zone && !images.reference)) return null;

  return (
    <div
      className="grid gap-4 mb-10"
      style={{ gridTemplateColumns: images.zone && images.reference ? '1fr 1fr' : '1fr' }}
    >
      {images.zone && (
        <div>
          <p className="text-xs mb-2 dim-55">{sampleLabel}</p>
          <img src={images.zone} alt={`${name} ${sampleLabel}`} className="w-full block" loading="lazy" />
        </div>
      )}
      {images.reference && (
        <div>
          <p className="text-xs mb-2 dim-55">{isTheory ? 'possible reference' : 'reference'}</p>
          <img src={images.reference} alt={altText} className="w-full block" loading="lazy" />
        </div>
      )}
    </div>
  );
}

export function MetadataTable({ rows }) {
  const valid = rows.filter((r) => r.value);
  if (valid.length === 0) return null;

  return (
    <div className="mb-10 border-top">
      {valid.map(({ label, value }) => (
        <div key={label} className="flex justify-between items-center py-3 border-bottom">
          <span className="text-xs dim-55">{label}</span>
          <span className="text-xs dim-80">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function ExternalLinks({ referenceLink, explorerUrl, sourceUrl }) {
  return (
    <div className="flex gap-6 flex-wrap mb-20">
      {referenceLink && (
        <a href={referenceLink} target="_blank" rel="noopener noreferrer" className="text-xs dim-55">
          reference ↗
        </a>
      )}
      <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-xs dim-55">
        view on explorer ↗
      </a>
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs dim-55">
          source thread ↗
        </a>
      )}
    </div>
  );
}
