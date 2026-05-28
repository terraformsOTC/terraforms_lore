// Desktop-only hypercastle position diagram.
// 20 stacked flat diamond tiles (level 20 at top → level 1 at bottom).
// Active level(s) are highlighted and labelled with the zone's elevation(s)
// on that level — e.g. "Level 16: -2", "Level 14: +4, -4".
// Levels that occupy the whole layer (no elevation) just read "Level N".

const TILE_H      = 10;   // px — diamond tile height
const ROW_GAP     = 15;   // px — vertical gap between tiles (even rhythm)
const DIAMOND_COL = 150;  // px — column the diamond is centred in (widest tile)
const LABEL_GAP   = 30;   // px — gap between diamond column and label start
const MAX_CELLS   = 13;

const ACTIVE_COLOR  = 'rgba(232,232,232,0.90)';
const INACTIVE_TILE = 'rgba(232,232,232,0.09)';

// Width in cells per level — peak at 13–14, tapering to a point at 1 and 20.
const WIDTHS = [
  0,                       // [0]  unused
  1,  3,  4,  5,  6,       // [1]–[5]
  7,  8,  9, 10, 11,       // [6]–[10]
  12, 12, 13, 13, 10,      // [11]–[15]
  8,  6,  5,  4,  1,       // [16]–[20]
];

// Group a zone's hypercastle entries by level. Each level records whether it
// spans all elevations and the list of specific elevations present.
export function groupHypercastle(hypercastle) {
  const byLevel = new Map();
  hypercastle.forEach(({ level, elevation }) => {
    if (!byLevel.has(level)) byLevel.set(level, { all: false, elevs: [] });
    const entry = byLevel.get(level);
    if (elevation === undefined) entry.all = true;
    else entry.elevs.push(elevation);
  });
  return byLevel;
}

// "Level 16: -2" / "Level 14: +4, -4" / "Level 3" (whole layer).
export function levelLabel(level, entry) {
  if (!entry || entry.all || entry.elevs.length === 0) return `Level ${level}`;
  const list = [...entry.elevs]
    .sort((a, b) => b - a)
    .map((e) => (e > 0 ? `+${e}` : `${e}`))
    .join(', ');
  return `Level ${level}: ${list}`;
}

export default function HypercastleMap({ hypercastle }) {
  if (!hypercastle?.length) return null;

  const byLevel = groupHypercastle(hypercastle);

  return (
    <div style={{ fontFamily: 'Courier New, monospace', paddingLeft: '20px' }}>
      {/* line-height + margin mirror the "zone references" link (text-sm, mb-8)
          so the first diamond row aligns with the top of the palette swatches */}
      <p style={{ fontSize: '14px', lineHeight: '1.25rem', opacity: 0.55, marginBottom: '32px', letterSpacing: '0.04em' }}>
        hypercastle position
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: `${ROW_GAP}px` }}>
        {Array.from({ length: 20 }, (_, i) => 20 - i).map((level) => {
          const tileW    = Math.round((WIDTHS[level] / MAX_CELLS) * DIAMOND_COL);
          const entry    = byLevel.get(level);
          const isActive = entry !== undefined;

          return (
            <div
              key={level}
              style={{
                display:    'flex',
                alignItems: 'center',
                height:     `${TILE_H}px`,
              }}
            >
              {/* Diamond, centred in a fixed-width column */}
              <div
                style={{
                  width:          `${DIAMOND_COL}px`,
                  display:        'flex',
                  justifyContent: 'center',
                  flexShrink:     0,
                }}
              >
                <div
                  style={{
                    width:           `${tileW}px`,
                    height:          `${TILE_H}px`,
                    backgroundColor: isActive ? ACTIVE_COLOR : INACTIVE_TILE,
                    clipPath:        'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }}
                />
              </div>

              {/* Level label — left-aligned at a fixed x, never wraps */}
              <span
                style={{
                  marginLeft: `${LABEL_GAP}px`,
                  fontSize:   '14px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  opacity:    isActive ? 0.9 : 0.5,
                  userSelect: 'none',
                }}
              >
                {levelLabel(level, entry)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
