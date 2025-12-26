import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const translationsFile = path.join(projectRoot, 'lib/translations.ts');
const content = fs.readFileSync(translationsFile, 'utf-8');

function extractObject(content, startMarker) {
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return null;

  let i = startIdx + startMarker.length;
  let depth = 0;
  let inString = false;
  let stringChar = null;
  let escapeNext = false;
  let startPos = i;

  while (i < content.length) {
    const char = content[i];

    if (escapeNext) {
      escapeNext = false;
      i++;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      i++;
      continue;
    }

    if (!inString && (char === '"' || char === "'" || char === '`')) {
      inString = true;
      stringChar = char;
      i++;
      continue;
    }

    if (inString && char === stringChar) {
      inString = false;
      stringChar = null;
      i++;
      continue;
    }

    if (!inString) {
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0) {
          return content.substring(startPos, i + 1);
        }
      }
    }

    i++;
  }

  return null;
}

function convertToJSON(tsContent) {
  let json = tsContent
    .trim()
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
    .replace(/([{,]\s*)'([^']*)':/g, '$1"$2":')
    .replace(/([{,]\s*)`([^`]*)`:/g, '$1"$2":')
    .replace(/'/g, '"')
    .replace(/`/g, '"')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/\s+/g, ' ');

  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('JSON parse error:', e.message);
    const errorPos = e.message.match(/position (\d+)/);
    if (errorPos) {
      const pos = parseInt(errorPos[1]);
      console.error('Around position', pos, ':', json.substring(Math.max(0, pos - 50), Math.min(json.length, pos + 50)));
    }
    return null;
  }
}

const enContent = extractObject(content, 'en: {');
const heContent = extractObject(content, 'he: {');

const messagesDir = path.join(projectRoot, 'messages');
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

if (enContent) {
  const enObj = convertToJSON(enContent);
  if (enObj) {
    fs.writeFileSync(
      path.join(messagesDir, 'en.json'),
      JSON.stringify(enObj, null, 2)
    );
    console.log('✓ Created messages/en.json');
  } else {
    console.log('✗ Failed to create messages/en.json');
  }
}

if (heContent) {
  const heObj = convertToJSON(heContent);
  if (heObj) {
    fs.writeFileSync(
      path.join(messagesDir, 'he.json'),
      JSON.stringify(heObj, null, 2)
    );
    console.log('✓ Created messages/he.json');
  } else {
    console.log('✗ Failed to create messages/he.json');
  }
}

