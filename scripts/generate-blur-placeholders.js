#!/usr/bin/env node

/**
 * Script para generar blur placeholders reales usando sharp
 * 
 * Uso: node scripts/generate-blur-placeholders.js
 * 
 * Este script:
 * 1. Busca todas las imágenes en /public/images/home/*.webp
 * 2. Genera una miniatura borrosa de cada una
 * 3. Convierte a Base64
 * 4. Actualiza /src/lib/blur-placeholders.ts
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../public/images/home');
const OUTPUT_FILE = path.join(__dirname, '../src/lib/blur-placeholders.ts');
const BLUR_SIZE = 10; // 10x10 píxeles es suficiente para blur

async function generateBlurPlaceholder(imagePath) {
  try {
    // Reducir imagen a 10x10 píxeles
    const blurredBuffer = await sharp(imagePath)
      .resize(BLUR_SIZE, BLUR_SIZE, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    // Convertir a Base64
    const base64 = blurredBuffer.toString('base64');
    return `data:image/webp;base64,${base64}`;
  } catch (error) {
    console.error(`❌ Error generando blur para ${imagePath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎨 Generando blur placeholders reales...\n');

  // Buscar todas las imágenes
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Directorio no encontrado: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.webp'))
    .sort();

  if (files.length === 0) {
    console.error('❌ No se encontraron imágenes .webp en', IMAGES_DIR);
    process.exit(1);
  }

  console.log(`📸 Encontradas ${files.length} imágenes\n`);

  const blurPlaceholders = {};

  // Generar blur para cada imagen
  for (const file of files) {
    const imagePath = path.join(IMAGES_DIR, file);
    const key = file.replace('.webp', ''); // ej: "image1"

    process.stdout.write(`  Procesando ${file}... `);

    const blurDataUrl = await generateBlurPlaceholder(imagePath);
    if (blurDataUrl) {
      blurPlaceholders[key] = blurDataUrl;
      console.log('✅');
    } else {
      console.log('⚠️  (usando fallback)');
      // Fallback: usar un blur genérico
      blurPlaceholders[key] = 'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=';
    }
  }

  // Generar código TypeScript
  const tsCode = `/**
 * Blur placeholders generados automáticamente
 * Generado: ${new Date().toISOString()}
 * 
 * Estos son Base64 de imágenes miniatura (10x10px) en WebP
 * Se usan como placeholder mientras carga la imagen completa
 * 
 * Para regenerar: npm run generate:blur
 */

export const blurPlaceholders: { [key: string]: string } = {
${Object.entries(blurPlaceholders)
  .map(([key, value]) => `  ${key}: "${value}",`)
  .join('\n')}
};

export const getBlurDataUrl = (imageKey: string): string | undefined => {
  return blurPlaceholders[imageKey];
};
`;

  // Guardar archivo
  fs.writeFileSync(OUTPUT_FILE, tsCode);

  console.log(`\n✅ Archivo guardado en: ${OUTPUT_FILE}`);
  console.log(`📊 Total de blur placeholders generados: ${Object.keys(blurPlaceholders).length}\n`);

  // Mostrar estadísticas
  let totalSize = 0;
  for (const [key, value] of Object.entries(blurPlaceholders)) {
    const size = value.length;
    totalSize += size;
  }
  console.log(`💾 Tamaño total (sin comprimir): ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`📝 Tamaño promedio por placeholder: ${(totalSize / Object.keys(blurPlaceholders).length / 1024).toFixed(2)} KB\n`);

  console.log('🎉 ¡Blur placeholders listos! Las imágenes ahora mostrarán preview borroso.\n');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
