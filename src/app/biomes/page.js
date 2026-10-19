'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ItemCard from '@/components/ItemCard';
import { biomes, confirmedBiomes, uncertainBiomes, unknownBiomes, BIOME_CATEGORIES, BIOME_SETS } from '@/data/biomes';

const FILTERS = [
  { key: 'all',       label: 'all' },
  { key: 'confirmed', label: 'confirmed' },
  { key: 'uncertain', label: 'uncertain' },
  { key: 'unknown',   label: 'unknown' },
];

export default function BiomesPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return biomes.filter((b) => {
      if (filter !== 'all' && b.status !== filter) return false;
      if (search) {
        const searchable = `${b.name} ${b.nickname || ''} ${b.reference || ''} ${b.guess || ''} ${b.set || ''}`.toLowerCase();
        if (!searchable.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [filter, search]);

  return (
    <div className="content-wrapper">
      <Header />
      <main className="flex-1 px-6">
        <h1 className="text-3xl mb-2">biome references</h1>
        <p className="text-sm mb-2 dim-55" style={{ lineHeight: '1.6' }}>
          We know far less about Terraform biome character set references. Maybe there are just fewer, or maybe they haven't yet gotten as much attention as the zones.
        </p>
        <p className="text-sm mb-10 dim-35">
          {confirmedBiomes.length} confirmed &nbsp;·&nbsp; {uncertainBiomes.length} uncertain &nbsp;·&nbsp; {unknownBiomes.length} unknown &nbsp;·&nbsp; 92 total biomes
        </p>

        <div className="flex flex-wrap gap-3 mb-5">
          {FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className="btn-primary btn-sm" style={{ opacity: filter === key ? 1 : 0.35 }}>
              [{label}]
            </button>
          ))}
        </div>

        {filter !== 'unknown' && (
          <div className="mb-8" style={{ maxWidth: '360px' }}>
            <input type="search" name="search" id="biome-search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="search biomes or references..." className="w-full px-3 py-2" />
          </div>
        )}

        <p className="text-xs mb-6 dim-30">{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</p>

        <div className="grid-border" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {filtered.map((biome) => (
            <ItemCard key={biome.id} item={biome} href={`/biomes/${biome.id}`}
              category={BIOME_CATEGORIES[biome.category]} subtitle={biome.nickname}
              set={BIOME_SETS[biome.set]} />
          ))}
        </div>

        {filtered.length === 0 && <p className="text-sm mt-8 dim-40">no results. try adjusting filters or search.</p>}

      </main>
      <Footer />
    </div>
  );
}
