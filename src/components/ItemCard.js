import Link from 'next/link';
import StatusBadge from './StatusBadge';

/**
 * Unified card for both zones and biomes.
 *
 * Props:
 *   item      - zone or biome object
 *   href      - link target (e.g. /zones/foo or /biomes/biome-42)
 *   category  - resolved category object { label, color } or null
 *   subtitle  - optional secondary text next to the name (e.g. biome nickname)
 *   palette   - optional hex array to render as a color swatch bar
 *   linkUnknown - link an unidentified item to its page (zones have one;
 *                 unknown biomes do not)
 */
export default function ItemCard({ item, href, category, subtitle, palette, set, linkUnknown = false }) {
  if (item.status === 'unknown') {
    const card = (
      <div className="card-border p-4 flex items-center justify-between">
        <div>
          <span className="text-sm dim-40">{item.name}</span>
          {subtitle && <span className="text-xs ml-2 dim-20">- {subtitle}</span>}
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {set && (
            <span className="text-xs px-1 shrink-0"
              style={{ color: set.color, border: `1px solid ${set.color}`, opacity: 0.85 }}>
              {set.label}
            </span>
          )}
          {!subtitle && (
            <span className="text-xs px-1 dim-20" style={{ border: '1px solid var(--border-dim)' }}>
              unidentified
            </span>
          )}
        </div>
      </div>
    );
    return linkUnknown
      ? <Link href={href} className="block" style={{ textDecoration: 'none', color: 'inherit' }}>{card}</Link>
      : card;
  }

  const ref = item.suggestion || item.guess || item.reference;

  return (
    <Link href={href} className="card-border block" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="p-4">
        {palette && palette.length > 0 && (
          <div className="flex mb-3" style={{ height: '6px', gap: '1px' }}>
            {palette.map((color, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: color }} />
            ))}
          </div>
        )}

        <div className="flex justify-between items-start gap-2 mb-1">
          <div>
            <span className="text-sm">{item.name}</span>
            {subtitle && <span className="text-xs ml-2 dim-35">- {subtitle}</span>}
          </div>
          <StatusBadge status={item.status} category={category} twin={item.twin} set={set} />
        </div>

        <p className="text-xs mt-1 dim-65">{ref}</p>
        <p className="text-xs mt-2 dim-25">→</p>
      </div>
    </Link>
  );
}
