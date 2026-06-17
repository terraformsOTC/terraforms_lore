import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranscript, transcriptSlugs } from '@/data/transcripts';

export function generateStaticParams() {
  return transcriptSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = getTranscript(slug);
  if (!t) return {};
  return {
    title: `${t.title} · 113isms · Terraform Lore`,
    description: t.blurb,
    // Hidden page: reachable by direct URL only, kept out of search indexes.
    robots: { index: false, follow: false },
  };
}

export default async function TranscriptPage({ params }) {
  const { slug } = await params;
  const t = getTranscript(slug);
  if (!t) notFound();

  return (
    <div className="content-wrapper">
      <Header />
      <main className="flex-1 px-6">
        <a href="/113isms" className="text-xs dim-50">
          [&larr; 113isms]
        </a>

        <header className="mt-6 mb-10" style={{ maxWidth: '680px' }}>
          <p className="text-xs mb-2 dim-50" style={{ letterSpacing: '0.04em' }}>
            {t.kind} &middot; {t.date}
          </p>
          <h1 className="text-3xl mb-4">{t.title}</h1>
          {t.blurb && (
            <p className="text-sm dim-70" style={{ lineHeight: '1.6' }}>
              {t.blurb}
            </p>
          )}
          {t.source && (
            <p className="text-xs mt-4 dim-50">
              source:{' '}
              <a
                href={t.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dim-100"
                style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}
              >
                {t.source.label}
              </a>
            </p>
          )}
          <p className="text-xs mt-4 dim-35" style={{ lineHeight: '1.6' }}>
            Auto-transcribed and lightly cleaned for readability — timestamps and
            transcription stutters removed, wording otherwise unchanged. Errors are
            the machine&apos;s.
          </p>
        </header>

        <article style={{ maxWidth: '680px' }}>
          {t.turns.map((turn, ti) => (
            <div key={ti} className="mb-7">
              {turn.speaker && (
                <p
                  className={`text-xs mb-2 ${
                    turn.speaker === '113' ? 'dim-70' : 'dim-45'
                  }`}
                  style={{ letterSpacing: '0.06em', textTransform: 'lowercase' }}
                >
                  {turn.speaker}
                </p>
              )}
              {turn.paras.map((p, pi) => (
                <p
                  key={pi}
                  className="text-sm dim-85 mb-3"
                  style={{ lineHeight: '1.75' }}
                >
                  {p}
                </p>
              ))}
            </div>
          ))}
        </article>

        <div className="mt-12 mb-4">
          <a href="/113isms" className="text-xs dim-50">
            [&larr; back to 113isms]
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
