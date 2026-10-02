import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { zones } from '@/data/zones';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return zones.map((z) => ({ id: z.id }));
}

export default async function Image({ params }) {
  const { id } = await params;
  const zone = zones.find((z) => z.id === id);
  if (!zone) return new ImageResponse(<div>Not found</div>, { ...size });

  const fontData = readFileSync(join(process.cwd(), 'public/fonts/SpaceMono-Regular.ttf'));

  const ref = zone.status === 'unknown' ? 'reference unknown' : zone.reference ?? zone.guess ?? zone.suggestion ?? '';
  const palette = zone.palette ?? [];

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
        fontFamily: 'SpaceMono',
        color: '#e8e8e8',
        position: 'relative',
      }}
    >
      {palette.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '52px' }}>
          {palette.map((color, i) => (
            <div
              key={i}
              style={{ width: '52px', height: '52px', backgroundColor: color, flexShrink: 0 }}
            />
          ))}
        </div>
      )}

      <div
        style={{
          fontSize: '80px',
          fontWeight: 400,
          lineHeight: 1.05,
          marginBottom: '28px',
          letterSpacing: '-1px',
        }}
      >
        {zone.name}
      </div>

      {ref && (
        <div style={{ fontSize: '28px', opacity: 0.5 }}>
          {ref}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '44px',
          right: '80px',
          fontSize: '18px',
          opacity: 0.2,
          letterSpacing: '0.05em',
        }}
      >
        terraform lore
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: 'SpaceMono', data: fontData, weight: 400, style: 'normal' }],
    }
  );
}
