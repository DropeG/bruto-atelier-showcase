import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const sources = [
  'next-season/vestuario.webp',
  'next-season/iluminacion.webp',
  'joyeria/joyeria4.webp',
  'next-season/esenciales-fondo-texturado.webp',
];
const manifest = {};
await mkdir('public/images/catalog-optimized', { recursive: true });
for (const source of sources) {
  const input = `public/images/${source}`;
  const metadata = await sharp(input).metadata();
  const widths = [...new Set([480, 800, 1200, 1600].map(width => Math.min(width, metadata.width)))];
  const variants = [];
  for (const width of widths) {
    const name = source.replaceAll('/', '-').replace(/\.[^.]+$/, '') + `-${width}.webp`;
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toFile(`public/images/catalog-optimized/${name}`);
    variants.push({ width, src: `/images/catalog-optimized/${name}` });
  }
  manifest[`/images/${source}`] = { width: metadata.width, height: metadata.height, variants };
}
await writeFile('src/data/catalog-images.json', JSON.stringify(manifest, null, 2) + '\n');
