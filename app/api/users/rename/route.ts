import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'preview';
    const previewOnly = mode === 'preview';

    console.log(`Running in ${mode.toUpperCase()} mode`);

    // Define directory path with your specific path
    const DIRECTORY_PATH = '/Users/aarongirton/Documents/Marketing/Staff Photos/Test';

    if (!fs.existsSync(DIRECTORY_PATH)) {
      return NextResponse.json(
        { error: 'Directory not found', path: DIRECTORY_PATH },
        { status: 404 },
      );
    }

    const files = fs.readdirSync(DIRECTORY_PATH);
    console.log('Found files:', files);

    const results = {
      toBeRenamed: [] as { oldName: string; newName: string }[],
      renamed: [] as { oldName: string; newName: string }[],
      failed: [] as { file: string; error: string }[],
      summary: {
        totalProcessed: 0,
        toBeRenamed: 0,
        renamed: 0,
        failed: 0,
      },
    };

    for (const file of files) {
      if (!file.endsWith('.png')) {
        console.log(`Skipping non-PNG file: ${file}`);
        continue;
      }

      try {
        console.log(`Processing file: ${file}`);

        // Match the pattern staff-_XXXX_firstname-lastname.png
        const match = file.match(/staff-_(\d{4})_(.+?)\.png$/);

        if (!match) {
          console.log(`No match for file: ${file}`);
          results.failed.push({
            file,
            error: 'Filename does not match expected pattern',
          });
          continue;
        }

        const namePart = match[2]; // This will be firstname-lastname
        const newFileName = `staff-photo-${namePart}.png`;

        console.log(`Match found: ${namePart}`);

        if (previewOnly) {
          results.toBeRenamed.push({
            oldName: file,
            newName: newFileName,
          });
        } else {
          const oldPath = path.join(DIRECTORY_PATH, file);
          const newPath = path.join(DIRECTORY_PATH, newFileName);

          fs.renameSync(oldPath, newPath);

          results.renamed.push({
            oldName: file,
            newName: newFileName,
          });
        }
      } catch (error: any) {
        results.failed.push({
          file,
          error: error.message,
        });
      }
    }

    // Update summary
    results.summary = {
      totalProcessed: files.length,
      toBeRenamed: results.toBeRenamed.length,
      renamed: previewOnly ? 0 : results.renamed.length,
      failed: results.failed.length,
    };

    return NextResponse.json({
      mode,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Process failed:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
