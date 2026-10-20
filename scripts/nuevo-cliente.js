#!/usr/bin/env node
/**
 * Uso: npm run nuevo-cliente -- <plantilla> <nombre-carpeta>
 * Ej:  npm run nuevo-cliente -- 08-boda-campestre 2027-03-boda-juan-ana
 */
import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const [plantilla, nombreCarpeta] = process.argv.slice(2);

if (!plantilla || !nombreCarpeta) {
  console.error('Uso: npm run nuevo-cliente -- <plantilla> <nombre-carpeta>');
  console.error('Ej:  npm run nuevo-cliente -- 08-boda-campestre 2027-03-boda-juan-ana');
  process.exit(1);
}

const root      = resolve(import.meta.dirname, '..');
const srcDir    = join(root, 'templates', plantilla);
const destDir   = join(root, 'clientes', nombreCarpeta);

if (!existsSync(srcDir)) {
  console.error(`❌ Plantilla no encontrada: templates/${plantilla}`);
  process.exit(1);
}
if (existsSync(destDir)) {
  console.error(`❌ Ya existe: clientes/${nombreCarpeta}`);
  process.exit(1);
}

// 1. Copiar plantilla → clientes/
console.log(`📁 Copiando templates/${plantilla} → clientes/${nombreCarpeta}...`);
cpSync(srcDir, destDir, {
  recursive: true,
  filter: (src) => !src.includes('node_modules') && !src.includes('/dist/'),
});

// 2. Ajustar package.json
const pkgPath = join(destDir, 'package.json');
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.name = nombreCarpeta;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`📝 package.json → name: "${nombreCarpeta}"`);
}

// 3. Crear README.md
const readme = `# ${nombreCarpeta}

| Campo | Valor |
|---|---|
| **Dominio** | (pendiente configurar) |
| **Proyecto Cloudflare Pages** | (pendiente crear) |
| **Plantilla base** | \`templates/${plantilla}\` |
| **EVENTO_ID Supabase** | (pendiente definir) |
| **Fecha del evento** | (pendiente) |
| **Estado** | 🔧 En construcción |

## Deploy

\`\`\`bash
npm run build
npx wrangler pages deploy dist --project-name=NOMBRE-CF-PROJECT
\`\`\`

## Variables de entorno (.env local)

\`\`\`
VITE_SUPABASE_URL=https://sljydxuogmkdlznwwzms.supabase.co
VITE_SUPABASE_ANON_KEY=<ver .env local>
\`\`\`
`;
writeFileSync(join(destDir, 'README.md'), readme);
console.log('📄 README.md creado');

// 4. Agregar fila en CLIENTES.md
const clientesPath = join(root, 'CLIENTES.md');
const fila = `| ${nombreCarpeta} | \`${plantilla}\` | \`clientes/${nombreCarpeta}\` | (pendiente) | (pendiente) | (pendiente) | 🔧 En construcción |\n`;
const contenido = readFileSync(clientesPath, 'utf8');
const insertPos  = contenido.indexOf('\n---');
const updated    = contenido.slice(0, insertPos) + '\n' + fila + contenido.slice(insertPos);
writeFileSync(clientesPath, updated);
console.log('📋 Fila agregada en CLIENTES.md');

console.log(`\n✅ Listo. Próximos pasos:`);
console.log(`   1. cd clientes/${nombreCarpeta}`);
console.log(`   2. cp ../.env .env   (o crear .env con las vars)`);
console.log(`   3. npm install`);
console.log(`   4. Editar src/ con los datos del cliente`);
console.log(`   5. Crear proyecto en Cloudflare Pages y actualizar README.md y CLIENTES.md`);
