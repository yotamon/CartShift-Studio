import * as fs from 'fs';
import * as path from 'path';

const translationsFile = path.join(process.cwd(), 'lib/translations.ts');
const content = fs.readFileSync(translationsFile, 'utf-8');

const extractObject = (startMarker: string, _endMarker: string): string => {
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return '';

  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let i = startIdx + startMarker.length;

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

    if (char === '"' || char === "'" || char === '`') {
      inString = !inString;
      i++;
      continue;
    }

    if (!inString) {
      if (char === '{') depth++;
      if (char === '}') {
        depth--;
        if (depth === 0) {
          return content.substring(startIdx + startMarker.length, i + 1);
        }
      }
    }

    i++;
  }

  return '';
};

const enContent = extractObject('en: {', '},');
const heContent = extractObject('he: {', '},');

const messagesDir = path.join(process.cwd(), 'messages');
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

const convertToJSON = (tsContent: string): any => {
  const cleaned = tsContent
    .replace(/(\w+):/g, '"$1":')
    .replace(/'/g, '"')
    .replace(/`/g, '"')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']');

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Parse error:', e);
    return {};
  }
};

if (enContent) {
  const enObj = convertToJSON(enContent);
  fs.writeFileSync(
    path.join(messagesDir, 'en.json'),
    JSON.stringify(enObj, null, 2)
  );
  console.log('✓ Created messages/en.json');
}

if (heContent) {
  const heObj = convertToJSON(heContent);
  fs.writeFileSync(
    path.join(messagesDir, 'he.json'),
    JSON.stringify(heObj, null, 2)
  );
  console.log('✓ Created messages/he.json');
}

