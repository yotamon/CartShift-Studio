const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const srcBase = path.join(projectRoot, 'app/[locale]/portal/org/[orgId]');
const destBase = path.join(projectRoot, 'app/[locale]/portal/(workspace)');

const filesToMove = [
  'consultations/ConsultationsClient.tsx',
  'files/FilesClient.tsx',
  'pricing/PricingListClient.tsx',
  'pricing/[pricingId]/PricingDetailClient.tsx',
  'pricing/[pricingId]/edit/EditPricingForm.tsx',
  'pricing/new/CreatePricingForm.tsx',
  'requests/new/NewRequestClient.tsx',
  'settings/SettingsClient.tsx',
  'team/TeamClient.tsx'
];

filesToMove.forEach(relPath => {
  const srcPath = path.join(srcBase, relPath);
  const destPath = path.join(destBase, relPath);
  const destDir = path.dirname(destPath);
  const fileName = path.basename(relPath);
  const componentName = fileName.replace('.tsx', '');
  const pagePath = path.join(destDir, 'page.tsx');

  if (fs.existsSync(srcPath)) {
    console.log(`Processing ${fileName}...`);

    // 1. Create dest directory if not exists
    if (!fs.existsSync(destDir)) {
      console.log(`Creating directory: ${destDir}`);
      fs.mkdirSync(destDir, { recursive: true });
    }

    // 2. Move File
    console.log(`Moving file to ${destPath}`);
    // Using copy + unlink instead of rename because rename can fail across partitions (though unlikely here)
    // and it allows us to verify content before deleting
    fs.copyFileSync(srcPath, destPath);
    fs.unlinkSync(srcPath);

    // 3. Update page.tsx
    if (fs.existsSync(pagePath)) {
      console.log(`Updating imports in ${pagePath}`);
      let pageContent = fs.readFileSync(pagePath, 'utf8');

      // Construct the likely old import path string to search for.
      // RelPath uses forward slashes in import.
      const relPathForward = relPath.replace(/\\/g, '/').replace('.tsx', '');
      const oldImportPath = `@/app/[locale]/portal/org/[orgId]/${relPathForward}`;
      const newImportPath = `./${componentName}`;

      if (pageContent.includes(oldImportPath)) {
          console.log(`Found exact import path. Replacing...`);
          const newContent = pageContent.replace(oldImportPath, newImportPath);
          fs.writeFileSync(pagePath, newContent, 'utf8');
      } else {
           console.log(`Exact import path not found. Trying flexible regex replacement...`);
           // Regex to match: import ComponentName from '...any path...'
           const regex = new RegExp(`import\\s+${componentName}\\s+from\\s+['"].*['"]`, 'g');
           if (regex.test(pageContent)) {
               console.log(`Regex matched. Replacing...`);
               const newContent = pageContent.replace(regex, `import ${componentName} from './${componentName}'`);
               fs.writeFileSync(pagePath, newContent, 'utf8');
           } else {
               console.log(`WARNING: Could not update import in ${pagePath}`);
           }
      }
    } else {
        console.log(`No page.tsx found at ${pagePath} to update.`);
    }
    console.log('---');
  } else {
    console.log(`Source file not found (skipped): ${srcPath}`);
  }
});

console.log('Refactor script completed.');
