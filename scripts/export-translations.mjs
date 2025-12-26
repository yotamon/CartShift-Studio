import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const tempFile = path.join(projectRoot, 'temp-translations.mjs');

const translationsFile = path.join(projectRoot, 'lib/translations.ts');
const content = fs.readFileSync(translationsFile, 'utf-8');

const enStart = content.indexOf('en: {');
const heStart = content.indexOf('he: {');
const enEnd = content.lastIndexOf('},', heStart);
const heEnd = content.lastIndexOf('},');

if (enStart === -1 || heStart === -1) {
  console.error('Could not find translation objects');
  process.exit(1);
}

const enContent = content.substring(enStart + 4, enEnd + 1);
const heContent = content.substring(heStart + 4, heEnd + 1);

const tempCode = `
const translations = {
  en: ${enContent},
  he: ${heContent}
};

export default translations;
`;

fs.writeFileSync(tempFile, tempCode);

try {
  const translations = await import(`file://${tempFile}`);
  const defaultExport = translations.default;

  const messagesDir = path.join(projectRoot, 'messages');
  if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(messagesDir, 'en.json'),
    JSON.stringify(defaultExport.en, null, 2)
  );
  console.log('✓ Created messages/en.json');

  fs.writeFileSync(
    path.join(messagesDir, 'he.json'),
    JSON.stringify(defaultExport.he, null, 2)
  );
  console.log('✓ Created messages/he.json');

  fs.unlinkSync(tempFile);
  console.log('✓ Cleaned up temporary file');
} catch (error) {
  console.error('Error:', error.message);
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
  process.exit(1);
}

