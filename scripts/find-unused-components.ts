import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'components');
const srcDir = process.cwd();

// Get all component files
function getComponentFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getComponentFiles(fullPath));
    } else if (/\.(tsx|jsx)$/.test(item)) {
      files.push(fullPath);
    }
  });

  return files;
}

// Check if component is imported anywhere
function findComponentUsage(componentPath: string): boolean {
  const componentName = path.basename(componentPath, path.extname(componentPath));
  let isUsed = false;

  function searchInFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = new RegExp(
      `import.*?{.*?${componentName}.*?}.*?from|import.*?${componentName}.*?from`,
    );
    if (importRegex.test(content)) {
      isUsed = true;
    }
  }

  // Recursively search all files
  function searchDir(dir: string) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        searchDir(fullPath);
      } else if (/\.(tsx|jsx|ts|js)$/.test(item)) {
        if (fullPath !== componentPath) {
          searchInFile(fullPath);
        }
      }
    });
  }

  searchDir(srcDir);
  return isUsed;
}

// Find unused components
const componentFiles = getComponentFiles(componentsDir);
const unusedComponents = componentFiles.filter((file) => !findComponentUsage(file));

console.log('Unused components:');
unusedComponents.forEach((file) => {
  console.log(path.relative(process.cwd(), file));
});
