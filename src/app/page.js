'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ItemCard from '@/components/ItemCard';
import SubmitForm from '@/components/SubmitForm';
import { zones, confirmedZones, uncertainZones, llmZones, unknownZones, CATEGORIES } from '@/data/zones';

const FILTERS = [
  { key: 'all',       label: 'all' },
  { key: 'confirmed', label: 'confirmed' },
  { key: 'uncertain', label: 'uncertain' },
  { key: 'llm',       label: 'LLM suggestions' },
  { key: 'unknown',   label: 'unknown' },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: 'all categories' },
  ...Object.entries(CATEGORIES).map(([key, val]) => ({ key, label: val.label })),
];

export default function Home() {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return zones.filter((z) => {
      if (filter !== 'all' && z.status !== filter) return false;
      if (categoryFilter !== 'all' && z.category !== categoryFilter) return false;
      if (search) {
        const searchable = `${z.name} ${z.reference || ''} ${z.guess || ''} ${z.suggestion || ''}`.toLowerCase();
        if (!searchable.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [filter, categoryFilter, search]);

  return (
    <div className="content-wrapper">
      <Header />
      <main className="flex-1 px-6">
        <h1 className="text-3xl mb-2">zone references</h1>
        <p className="text-sm mb-2 dim-70" style={{ lineHeight: '1.6' }}>
          The Terraforms creators embedded a rich mix of pop culture, media, and artistic references into the collection&apos;s zones and biomes. The community has been cataloguing these Easter Eggs for years, and much remains undiscovered. We have used LLMs to aggregate what we already know and extend the search. Some plausible suggestions have been included here.
        </p>
        <p className="text-sm mb-10 dim-35">
          {confirmedZones.length} confirmed &nbsp;·&nbsp; {llmZones.length} LLM suggestions &nbsp;·&nbsp; {uncertainZones.length} uncertain &nbsp;·&nbsp; {unknownZones.length} unknown &nbsp;·&nbsp; 75 total zones
        </p>

        {/* Status filter */}
        <div className="flex flex-wrap gap-3 mb-5">
          {FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => { setFilter(key); setCategoryFilter('all'); }}
              className="btn-primary btn-sm" style={{ opacity: filter === key ? 1 : 0.35 }}>
              [{label}]
            </button>
          ))}
        </div>

        {/* Category filter */}
        {filter !== 'unknown' && (
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORY_FILTERS.map(({ key, label }) => {
              const cat = CATEGORIES[key];
              const isActive = categoryFilter === key;
              return (
                <button key={key} onClick={() => setCategoryFilter(key)}
                  className="text-xs btn-text"
                  style={{
                    padding: '3px 7px',
                    border: `1px solid ${isActive && cat ? cat.color : 'rgba(232,232,232,0.2)'}`,
                    color: isActive && cat ? cat.color : 'rgba(232,232,232,0.5)',
                    opacity: isActive ? 1 : 0.6,
                    transition: 'opacity 0.15s',
                  }}>
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        {filter !== 'unknown' && (
          <div className="mb-8" style={{ maxWidth: '360px' }}>
            <input type="search" name="search" id="zone-search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="search zones or references..." className="w-full px-3 py-2" />
          </div>
        )}

        <p className="text-xs mb-6 dim-30">{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</p>

        {/* Grid */}
        <div className="grid-border" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filtered.map((zone) => (
            <ItemCard key={zone.id} item={zone} href={`/zones/${zone.id}`}
              category={CATEGORIES[zone.category]} palette={zone.palette} linkUnknown />
          ))}
        </div>

        {filtered.length === 0 && <p className="text-sm mt-8 dim-40">no results. try adjusting filters or search.</p>}

        <div className="mt-20 divider" />
        <SubmitForm type="zone" />
      </main>
      <Footer />
    </div>
  );
}
