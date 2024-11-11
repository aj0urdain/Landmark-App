const fs = require('fs');
const path = require('path');

function checkMissingPortfolios(files) {
  // Extract all portfolio numbers from filenames
  const portfolioNumbers = files
    .filter((file) => file.endsWith('.pdf'))
    .map((file) => {
      const match = file.match(/Portfolio[_\s](\d{2,3})/i);
      return match ? parseInt(match[1]) : null;
    })
    .filter((num) => num !== null);

  // Create array of expected numbers from 129 to 172
  const expectedNumbers = Array.from({ length: 172 - 129 + 1 }, (_, i) => i + 129);

  // Find missing numbers
  const missingNumbers = expectedNumbers.filter((num) => !portfolioNumbers.includes(num));

  if (missingNumbers.length > 0) {
    console.log('\nMissing portfolio numbers:');
    missingNumbers.forEach((num) => {
      console.log(`Portfolio ${num} is missing`);
    });
  } else {
    console.log('\nAll portfolio numbers from 129 to 172 are present');
  }
}

function renamePortfolioFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Check for missing portfolios first
    checkMissingPortfolios(files);

    // Continue with renaming...
    files
      .filter((file) => file.endsWith('.pdf'))
      .forEach((file) => {
        const match = file.match(/Portfolio[_\s](\d{2,3})/i);

        if (match) {
          const number = match[1];
          const paddedNumber = number.padStart(3, '0');
          const newFilename = `portfolio_magazine_${paddedNumber}.pdf`;

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
          console.log(`No portfolio number found in: ${file}`);
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

    // Check for missing portfolios first
    checkMissingPortfolios(files);

    files
      .filter((file) => file.endsWith('.pdf'))
      .forEach((file) => {
        const match = file.match(/Portfolio[_\s](\d{2,3})/i);

        if (match) {
          const number = match[1];
          const paddedNumber = number.padStart(3, '0');
          const newFilename = `portfolio_magazine_${paddedNumber}.pdf`;
          //   console.log(`Would rename: ${file} -> ${newFilename}`);
          console.log(`-> ${newFilename}`);
        } else {
          console.log(`No portfolio number found in: ${file}`);
        }
      });
  });
}

// Usage:
const directory = '/Users/aarongirton/Downloads/Assets - Aaron';

const command = process.argv[2];

if (command === 'preview') {
  console.log('Preview mode - no files will be renamed\n');
  previewRename(directory);
} else if (command === 'rename') {
  console.log('Renaming files...\n');
  renamePortfolioFiles(directory);
} else {
  console.log('Please specify either "preview" or "rename"');
}
