// Desktop-only hypercastle position diagram.
// 20 stacked dark-grey diamond tiles (level 20 at top → level 1 at bottom).
// A zone's active level gets a bright white centre box, with a semi-transparent
// white accent diamond per elevation offset above (+N) or below (-N); 0 overlaps
// the centre. Multiple elevations (e.g. Holo +4/-4) stack accents above and below.
// Whole-layer levels (no elevation, e.g. Alto/Kairo) get a single centred
// accent. At the extremes (±4) the accent tip touches the base box.

const TILE_H      = 10;          // px — diamond tile height
const ROW_GAP     = 15;          // px — vertical gap between tiles (even rhythm)
const DIAMOND_COL = 150;         // px — column the diamond is centred in (widest tile)
const LABEL_GAP   = 30;          // px — gap between diamond column and label start
const MAX_CELLS   = 13;
const ELEV_STEP   = TILE_H / 4;  // px per elevation unit → ±4 touches the base

const BASE_TILE   = 'rgba(232,232,232,0.09)'; // dark grey base box (inactive levels)
const ACTIVE_BASE = 'rgba(232,232,232,0.90)'; // bright white centre box for the active level
const ACCENT      = 'rgba(232,232,232,0.60)'; // semi-transparent white elevation accent
const DIAMOND   = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';

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

// Elevation positions (in units) to draw an accent for. Whole-layer levels
// and bare elevation-0 both render a single centred accent.
function accentElevations(entry) {
  if (!entry) return [];
  if (entry.all || entry.elevs.length === 0) return [0];
  return entry.elevs;
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
              style={{ display: 'flex', alignItems: 'center', height: `${TILE_H}px` }}
            >
              {/* Diamond column — dark-grey base box plus elevation accent(s) */}
              <div
                style={{ position: 'relative', width: `${DIAMOND_COL}px`, height: `${TILE_H}px`, flexShrink: 0 }}
              >
                <div
                  style={{
                    position:        'absolute',
                    left:            '50%',
                    top:             '50%',
                    transform:       'translate(-50%, -50%)',
                    width:           `${tileW}px`,
                    height:          `${TILE_H}px`,
                    backgroundColor: isActive ? ACTIVE_BASE : BASE_TILE,
                    clipPath:        DIAMOND,
                  }}
                />
                {accentElevations(entry).map((e, i) => (
                  <div
                    key={i}
                    style={{
                      position:        'absolute',
                      left:            '50%',
                      top:             '50%',
                      transform:       `translate(-50%, -50%) translateY(${-e * ELEV_STEP}px)`,
                      width:           `${tileW}px`,
                      height:          `${TILE_H}px`,
                      backgroundColor: ACCENT,
                      clipPath:        DIAMOND,
                    }}
                  />
                ))}
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
