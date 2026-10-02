import { zones } from '@/data/zones';
import { biomes } from '@/data/biomes';

const BASE = 'https://terraformlore.xyz';

export default function sitemap() {
  const zoneUrls = zones
    .map((z) => ({
      url: `${BASE}/zones/${z.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  const biomeUrls = biomes
    .filter((b) => b.status !== 'unknown')
    .map((b) => ({
      url: `${BASE}/biomes/${b.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/biomes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...zoneUrls,
    ...biomeUrls,
  ];
}
