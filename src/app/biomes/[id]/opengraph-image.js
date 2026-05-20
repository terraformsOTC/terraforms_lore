import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { biomes } from '@/data/biomes';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Cache font buffers for the container lifetime (avoids re-reading on every request)
let _fontData, _fontData2, _monoData;
function getFonts() {
  if (!_fontData)  _fontData  = readFileSync(join(process.cwd(), 'public/fonts/NotoSansSymbols2-Regular.ttf'));
  if (!_fontData2) _fontData2 = readFileSync(join(process.cwd(), 'public/fonts/NotoSansMono-Regular.ttf'));
  if (!_monoData)  _monoData  = readFileSync(join(process.cwd(), 'public/fonts/SpaceMono-Regular.ttf'));
  return { fontData: _fontData, fontData2: _fontData2, monoData: _monoData };
}

export function generateStaticParams() {
  return biomes.filter((b) => b.status !== 'unknown').map((b) => ({ id: b.id }));
}

export default async function Image({ params }) {
  const { id } = await params;
  const biome = biomes.find((b) => b.id === id);
  if (!biome) return new ImageResponse(<div>Not found</div>, { ...size });

  const { fontData, fontData2, monoData } = getFonts();

  const chars = biome.characterSet ?? '';
  const label = biome.name;
  const ref = biome.guess ?? biome.reference ?? '';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        backgroundColor: '#0a0a0a',
        color: '#e8e8e8',
        position: 'relative',
      }}
    >
      {/* Character set */}
      {chars && (
        <div
          style={{
            display: 'flex',
            fontSize: '96px',
            letterSpacing: '12px',
            marginBottom: '48px',
            fontFamily: 'NotoSymbols2, NotoMono',
            opacity: 0.9,
          }}
        >
          {chars}
        </div>
      )}

      {/* Biome name */}
      <div
        style={{
          fontSize: '64px',
          fontFamily: 'SpaceMono',
          fontWeight: 400,
          lineHeight: 1.05,
          marginBottom: ref ? '20px' : '0',
        }}
      >
        {label}
      </div>

      {/* Reference if known */}
      {ref && (
        <div style={{ fontSize: '26px', fontFamily: 'SpaceMono', opacity: 0.5 }}>
          {ref}
        </div>
      )}

      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '44px',
          right: '80px',
          fontSize: '18px',
          fontFamily: 'SpaceMono',
          opacity: 0.2,
          letterSpacing: '0.05em',
        }}
      >
        terraform lore
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'NotoSymbols2', data: fontData,  weight: 400, style: 'normal' },
        { name: 'NotoMono',     data: fontData2, weight: 400, style: 'normal' },
        { name: 'SpaceMono',    data: monoData,  weight: 400, style: 'normal' },
      ],
    }
  );
}
