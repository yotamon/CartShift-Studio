import fs from 'fs';

const filePath = 'messages/src/en/portal.json';
const content = fs.readFileSync(filePath, 'utf8');

try {
  JSON.parse(content);
  console.log('JSON is valid!');
} catch (e) {
  const match = e.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1]);
    const lines = content.substring(0, pos).split('\n');
    const lineNum = lines.length;
    const col = pos - content.substring(0, pos).lastIndexOf('\n');
    
    console.log(`Error at line ${lineNum}, column ${col}`);
    console.log(`Position: ${pos}`);
    
    // Show context
    const start = Math.max(0, pos - 200);
    const end = Math.min(content.length, pos + 100);
    const context = content.substring(start, end);
    console.log('\nContext:');
    console.log(context);
    
    // Show the specific line
    console.log(`\nLine ${lineNum}:`);
    console.log(lines[lineNum - 1]);
  } else {
    console.log('Error:', e.message);
  }
}
