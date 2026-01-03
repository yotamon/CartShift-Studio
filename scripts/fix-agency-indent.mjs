import fs from 'fs';

const filePath = 'messages/src/en/portal.json';
const content = fs.readFileSync(filePath, 'utf8');

// Find the agency section and fix indentation
const lines = content.split('\n');
let inAgency = false;
let agencyStart = -1;
let agencyEnd = -1;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"agency": {')) {
    inAgency = true;
    agencyStart = i;
    braceCount = 1;
  }
  
  if (inAgency) {
    // Count braces to find where agency section ends
    for (const char of lines[i]) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    if (braceCount === 0) {
      agencyEnd = i;
      break;
    }
  }
}

// Fix indentation: properties at level 2 (inside agency) should have 6 spaces
// Properties at level 3 should have 8 spaces, etc.
for (let i = agencyStart + 1; i < agencyEnd; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  if (!trimmed || trimmed.startsWith('//')) continue;
  
  // Count leading spaces
  const leadingSpaces = line.length - line.trimStart().length;
  
  // If it's a property at root of agency (should be 6 spaces)
  if (trimmed.startsWith('"') && trimmed.includes('":')) {
    // Check if it's a top-level property in agency
    if (leadingSpaces === 4) {
      lines[i] = '      ' + trimmed;
    } else if (leadingSpaces === 6 && !trimmed.startsWith('"') && !trimmed.includes('":')) {
      // This might be a value, leave it
    }
  }
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Fixed indentation in agency section');
