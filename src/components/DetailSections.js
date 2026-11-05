/**
 * Shared building blocks for zone and biome detail pages.
 * Eliminates ~120 lines of duplication between zones/[id] and biomes/[id].
 */

import ParcelViewer from './ParcelViewer';

// A live parcel beside the reference image, on zone and biome pages alike.
export function ParcelAndReference({ parcelIds, name, label, image, altText, isTheory }) {
  if (!parcelIds && !image) return null;

  return (
    <div
      className="grid gap-6 mb-10"
      style={{ gridTemplateColumns: parcelIds && image ? '277px 1fr' : '277px' }}
    >
      {parcelIds && <ParcelViewer parcelIds={parcelIds} name={name} label={label} />}
      {image && (
        <div>
          <p className="text-xs mb-2 dim-55">{isTheory ? 'possible reference' : 'reference'}</p>
          <img
            src={image}
            alt={altText}
            loading="lazy"
            style={{ display: 'block', width: '100%', maxHeight: '400px', objectFit: 'contain', objectPosition: 'left top' }}
          />
        </div>
      )}
    </div>
  );
}

export function VideoEmbed({ video }) {
  if (!video) return null;

  return (
    <div className="mb-10">
      <p className="text-xs mb-2 dim-55">reference video</p>
      <iframe
        src={video.src}
        title={video.title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full block"
        style={{ aspectRatio: '16 / 9', border: 'none' }}
      />
      <a href={video.link} target="_blank" rel="noopener noreferrer" className="text-xs dim-55 inline-block mt-2">
        watch on vimeo ↗
      </a>
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
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-xs dim-55">
          view on explorer ↗
        </a>
      )}
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs dim-55">
          source thread ↗
        </a>
      )}
    </div>
  );
}
