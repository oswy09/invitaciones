/**
 * build-templates.mjs
 * Buildea cada template con su base path y copia el dist a public/plantillas/[slug]/
 * Ejecutar: node scripts/build-templates.mjs
 */
import { execSync } from 'child_process';
import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../templates');
const PUBLIC = resolve(__dirname, '../public/demos');

const TEMPLATES = [
  { dir: '01-dino',        slug: 'dino' },
  { dir: '02-stork',       slug: 'stork' },
  { dir: '03-space',       slug: 'space' },
  { dir: '04-Moderna',     slug: 'boda-moderna' },
  { dir: '05-Futbol_Ron',  slug: 'futbol' },
  { dir: '06-Boda-loving', slug: 'boda-loving' },
  { dir: '07 - boda-cine', slug: 'boda-cine' },
];

for (const { dir, slug } of TEMPLATES) {
  const templatePath = resolve(ROOT, dir);
  const destPath = resolve(PUBLIC, slug);

  if (!existsSync(templatePath)) {
    console.log(`⚠️  Skipping ${dir} — carpeta no encontrada`);
    continue;
  }

  console.log(`\n🔨 Building ${dir} → /plantillas/${slug}/`);
  try {
    execSync('npm run build', { cwd: templatePath, stdio: 'inherit' });
    mkdirSync(destPath, { recursive: true });
    // Limpiar destino antes de copiar
    rmSync(destPath, { recursive: true, force: true });
    cpSync(resolve(templatePath, 'dist'), destPath, { recursive: true });
    console.log(`✅ ${slug} copiado a public/plantillas/${slug}/`);
  } catch (err) {
    console.error(`❌ Error en ${dir}:`, err.message);
  }
}

console.log('\n🎉 Todos los templates buildeados y copiados.');
