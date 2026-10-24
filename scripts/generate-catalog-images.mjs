import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

// Art-directed phone crop: the ensemble continues beyond the right edge.
await sharp('public/images/shopify-demo/coleccion/wachi-hero-horizontal.png')
  .extract({ left: 250, top: 0, width: 586, height: 941 })
  .webp({ quality: 90 }).toFile('public/images/shopify-demo/coleccion/wachi-mobile-left.webp');

const sources = [
  'shopify-demo/coleccion/wachi-mobile-left.webp',
  'shopify-demo/accesorios-tarjetero.jpeg',
  'gallery/cabina-bosque-photo.webp',
  'next-season/vestuario.webp',
  'next-season/iluminacion.webp',
  'joyeria/joyeria4.webp',
  'next-season/esenciales-fondo-texturado.webp',
  ...['banqueta-fondo-blanco', 'mesa-fondo-blanco', 'silla-fondo-blanco', 'wachi-fondo-blanco', 'wachi-hero-horizontal'].map(name => `shopify-demo/coleccion/${name}.png`),
];
const manifest = {};
await mkdir('public/images/catalog-optimized', { recursive: true });
for (const source of sources) {
  const input = `public/images/${source}`;
  const metadata = await sharp(input).metadata();
  const widths = [...new Set([480, 800, 1200, 1600].map(width => Math.min(width, metadata.width)))];
  const variants = [];
  const photographicDetail = source === 'gallery/cabina-bosque-photo.webp';
  for (const width of widths) {
    const name = source.replaceAll('/', '-').replace(/\.[^.]+$/, '') + `-${width}.${photographicDetail ? 'avif' : 'webp'}`;
    const resized = sharp(input).resize({ width, withoutEnlargement: true });
    await (photographicDetail ? resized.avif({ quality: 55, effort: 5 }) : resized.webp({ quality: 85 })).toFile(`public/images/catalog-optimized/${name}`);
    variants.push({ width, src: `/images/catalog-optimized/${name}` });
  }
  manifest[`/images/${source}`] = { width: metadata.width, height: metadata.height, variants };
}
await writeFile('src/data/catalog-images.json', JSON.stringify(manifest, null, 2) + '\n');
