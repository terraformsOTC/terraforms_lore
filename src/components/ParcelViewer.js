'use client';

import { useState, useEffect } from 'react';

/**
 * Renders a randomly selected live parcel from a zone or biome as an animated iframe.
 * Picks a new random parcel each time the page is loaded.
 */
export default function ParcelViewer({ parcelIds, name, label }) {
  const [tokenId, setTokenId] = useState(null);

  useEffect(() => {
    const id = parcelIds[Math.floor(Math.random() * parcelIds.length)];
    setTokenId(id);
  }, [parcelIds]);

  return (
    <div>
      <p className="text-xs mb-2 dim-55">{label}</p>
      <div style={{ position: 'relative', width: '100%', maxWidth: '277px', aspectRatio: '277 / 400' }}>
        {/* Loading placeholder */}
        <div
          className="absolute inset-0 bg-placeholder"
          style={{ display: tokenId ? 'none' : 'block' }}
        />
        {tokenId && (
          <iframe
            key={tokenId}
            src={`https://tokens.mathcastles.xyz/terraforms/token-html/${tokenId}`}
            title={`${name} parcel #${tokenId}`}
            scrolling="no"
            sandbox="allow-scripts"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        )}
      </div>
      {tokenId && (
        <p className="text-xs mt-2 dim-55">#{tokenId}</p>
      )}
    </div>
  );
}
