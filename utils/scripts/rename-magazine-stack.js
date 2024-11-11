const fs = require('fs');
const path = require('path');

function renameMagazineFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files
      .filter((file) => file.endsWith('.jpg'))
      .forEach((file) => {
        const match = file.match(/Magazine-Stack[_\s](\d+)/i);

        if (match) {
          const number = match[1];
          const paddedNumber = number.padStart(3, '0');
          const newFilename = `portfolio_magazine_stack_${paddedNumber}.jpg`;

          const oldPath = path.join(directory, file);
          const newPath = path.join(directory, newFilename);

          fs.rename(oldPath, newPath, (err) => {
            if (err) {
              console.error(`Error renaming ${file}:`, err);
            } else {
              console.log(`Renamed: ${file} -> ${newFilename}`);
            }
          });
        } else {
          console.log(`No magazine stack number found in: ${file}`);
        }
      });
  });
}

function previewRename(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files
      .filter((file) => file.endsWith('.jpg'))
      .forEach((file) => {
        const match = file.match(/Magazine-Stack[_\s](\d+)/i);

        if (match) {
          const number = match[1];
          const paddedNumber = number.padStart(3, '0');
          const newFilename = `portfolio_magazine_stack_${paddedNumber}.jpg`;
          console.log(`-> ${newFilename}`);
        } else {
          console.log(`No magazine stack number found in: ${file}`);
        }
      });
  });
}

// Usage:
const directory = '/Users/aarongirton/Downloads/Assets - Aaron/Magazine Stack';

const command = process.argv[2];

if (command === 'preview') {
  console.log('Preview mode - no files will be renamed\n');
  previewRename(directory);
} else if (command === 'rename') {
  console.log('Renaming files...\n');
  renameMagazineFiles(directory);
} else {
  console.log('Please specify either "preview" or "rename"');
}
