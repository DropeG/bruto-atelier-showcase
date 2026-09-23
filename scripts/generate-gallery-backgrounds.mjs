import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const data = await fs.readFile('src/data/Gallery.tsx', 'utf8');
const sources = [...data.matchAll(/thumbnail:\s*"([^"]+)"/g)].map(match => match[1]);
const manifest = {};
await fs.mkdir('public/images/gallery/responsive', { recursive: true });
for (const source of sources) {
  const original = 'public' + source;
  const { width, height } = await sharp(original).metadata();
  const stem = path.parse(source).name;
  const variants = [];
  for (const target of [800, 1600, 2400].filter(value => value <= width)) {
    const src = `/images/gallery/responsive/${stem}-${target}.webp`;
    await sharp(original).resize({ width: target, withoutEnlargement: true }).webp({ quality: 85 }).toFile('public' + src);
    variants.push({ width: target, src });
  }
  const placeholder = await sharp(original).resize({ width: 32 }).webp({ quality: 50 }).toBuffer();
  manifest[source] = { width, height, placeholder: `data:image/webp;base64,${placeholder.toString('base64')}`, variants };
}
await fs.writeFile('src/data/gallery-backgrounds.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Generated backgrounds for ${sources.length} gallery items`);
