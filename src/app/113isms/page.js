import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sections } from '@/data/oneThirteenisms';

export const metadata = {
  title: '113isms · Terraform Lore',
  description: 'Quotes and snippets from the Mathcastles co-founder.',
  // Hidden page: reachable by direct URL only, kept out of search indexes.
  robots: { index: false, follow: false },
};

export default function OneThirteenismsPage() {
  return (
    <div className="content-wrapper">
      <Header />
      <main className="flex-1 px-6">
        <h1 className="text-3xl mb-2">113isms</h1>
        <p className="text-sm mb-12 dim-70" style={{ maxWidth: '640px', lineHeight: '1.6' }}>
          Quotes and snippets from the Mathcastles co-founder. Sourced manually from
          Twitter spaces I&apos;ve listened in on and podcast appearances.
        </p>

        <div style={{ maxWidth: '720px' }}>
          {sections.map((section) => (
            <section key={section.label} className="mb-12">
              <h2 className="text-xs mb-2 dim-50" style={{ letterSpacing: '0.04em' }}>
                {section.label}
              </h2>
              {section.transcript && (
                <a
                  href={`/113isms/transcripts/${section.transcript}`}
                  className="inline-block text-xs mb-5 dim-65"
                  style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}
                >
                  read the full transcript &rarr;
                </a>
              )}
              <ul className="flex flex-col">
                {section.items.map((item, i) =>
                  item.type === 'quote' ? (
                    <li
                      key={i}
                      className="mb-5"
                      style={{
                        borderLeft: '1px solid rgba(232, 232, 232, 0.18)',
                        paddingLeft: '14px',
                      }}
                    >
                      <p className="text-sm dim-85" style={{ lineHeight: '1.6' }}>
                        &ldquo;{item.text}&rdquo;
                      </p>
                      {item.note && (
                        <p className="text-xs mt-1 dim-35">{item.note}</p>
                      )}
                    </li>
                  ) : (
                    <li key={i} className="mb-5" style={{ paddingLeft: '14px' }}>
                      <p className="text-sm dim-45" style={{ lineHeight: '1.6' }}>
                        <span className="dim-40">&rsaquo;&nbsp;</span>
                        {item.text}
                      </p>
                    </li>
                  )
                )}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
