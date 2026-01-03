/**
 * Merge translation source files into production files
 * Run before build via `npm run prebuild`
 *
 * Features:
 * - Validates JSON syntax with line number reporting
 * - Detects duplicate keys across files
 * - Reports file sizes and compression stats
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Try to use jsonlint if available, otherwise fall back to native JSON.parse
let jsonlint;
try {
  jsonlint = require('jsonlint');
} catch {
  jsonlint = null;
}

const messagesDir = path.join(process.cwd(), 'messages');
const srcDir = path.join(messagesDir, 'src');
const locales = ['en', 'he'];

/**
 * Parse JSON with detailed error message using jsonlint if available
 */
function parseJsonWithLineNumbers(content, filePath) {
  try {
    // Use jsonlint for better error messages if available
    if (jsonlint) {
      return jsonlint.parse(content);
    }
    return JSON.parse(content);
  } catch (error) {
    console.error(`\n❌ JSON Syntax Error in ${filePath}`);
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

/**
 * Recursively validate all string values are non-empty
 */
function validateContent(obj, path = '') {
  const warnings = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof value === 'string' && value.trim() === '') {
      warnings.push(`Empty string at "${currentPath}"`);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      warnings.push(...validateContent(value, currentPath));
    }
  }
  return warnings;
}

function mergeTranslations(locale) {
  const localeDir = path.join(srcDir, locale);
  const outputPath = path.join(messagesDir, `${locale}.json`);

  // Check if source directory exists
  if (!fs.existsSync(localeDir)) {
    console.error(`❌ Source directory not found: ${localeDir}`);
    process.exit(1);
  }

  // Get all JSON files in the locale directory
  const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json')).sort();

  if (files.length === 0) {
    console.error(`❌ No JSON files found in ${localeDir}`);
    process.exit(1);
  }

  // Merge all files
  const merged = {};
  let totalKeys = 0;

  for (const file of files) {
    const filePath = path.join(localeDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const content = parseJsonWithLineNumbers(rawContent, `${locale}/${file}`);

    // Validate content
    const warnings = validateContent(content);
    if (warnings.length > 0) {
      console.warn(`⚠️  Warnings in ${locale}/${file}:`);
      warnings.forEach(w => console.warn(`   - ${w}`));
    }

    // Check for duplicate keys
    for (const key of Object.keys(content)) {
      if (merged[key]) {
        console.error(`❌ Duplicate key "${key}" found in ${locale}/${file}`);
        console.error(`   Key was already defined in another file`);
        process.exit(1);
      }
      merged[key] = content[key];
      totalKeys++;
    }
  }

  // Write merged output with consistent formatting
  const output = JSON.stringify(merged, null, 2);
  fs.writeFileSync(outputPath, output);

  // Calculate compression stats
  const rawSize = Buffer.byteLength(output, 'utf8');
  const gzipSize = zlib.gzipSync(output).length;
  const brotliSize = zlib.brotliCompressSync(output).length;

  console.log(`✅ ${locale}.json merged`);
  console.log(`   Files: ${files.join(', ')}`);
  console.log(`   Keys: ${totalKeys} top-level`);
  console.log(`   Size: ${(rawSize / 1024).toFixed(1)} KB (gzip: ${(gzipSize / 1024).toFixed(1)} KB, brotli: ${(brotliSize / 1024).toFixed(1)} KB)`);
}

console.log('🔧 Merging translation files...\n');

for (const locale of locales) {
  mergeTranslations(locale);
  console.log('');
}

console.log('✅ All translations merged successfully!');

