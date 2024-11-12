'use server';

import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/utils/supabase/admin';

function generatePassword(email: string): string {
  if (!email) throw new Error('Email is required to generate password');
  const initials = email.substring(0, 2).toLowerCase();
  return `${initials}landmarkbr`;
}

async function checkExistingUser(email: string) {
  const { data, error } = await supabaseAdmin
    .from('auth.users')
    .select('email')
    .eq('email', email)
    .single();

  return !!data;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Starting user import process...');
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'preview';
    const previewOnly = mode === 'preview';

    console.log(`Running in ${mode.toUpperCase()} mode`);

    // Define CSV path
    const CSV_FILE_PATH = path.join(
      process.cwd(),
      'utils/csv/stafflist/user-emails-csv.csv',
    );

    // Check if file exists
    if (!fs.existsSync(CSV_FILE_PATH)) {
      return NextResponse.json(
        {
          error: 'CSV file not found',
          path: CSV_FILE_PATH,
        },
        { status: 404 },
      );
    }

    // Read and parse CSV with BOM handling
    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    // Modify the validation to handle potential BOM in column name
    const hasEmailColumn = Object.keys(records[0]).some(
      (key) => key.replace(/^\uFEFF/, '') === 'email',
    );

    if (!records.length || !hasEmailColumn) {
      return NextResponse.json(
        {
          error: 'Invalid CSV format. File must have an "email" column',
          columns: Object.keys(records[0]),
          firstRow: records[0],
        },
        { status: 400 },
      );
    }

    // Get the actual email key (with or without BOM)
    const emailKey = Object.keys(records[0]).find(
      (key) => key.replace(/^\uFEFF/, '') === 'email',
    );

    const results = {
      toBeCreated: [] as { email: string; password: string }[],
      skipped: [] as { email: string; reason: string }[],
      failed: [] as { email: string; error: any }[],
      success: [] as { email: string; password: string }[],
      summary: {
        totalProcessed: 0,
        toBeCreated: 0,
        skipped: 0,
        success: 0,
        failed: 0,
      },
    };

    // Process each record using the correct key
    for (const record of records) {
      try {
        const email = record[emailKey!]?.trim();

        if (!email) {
          console.log(`❌ Skipping empty email`);
          results.failed.push({
            email: 'unknown',
            error: 'Empty email address',
          });
          continue;
        }

        const exists = await checkExistingUser(email);
        const password = generatePassword(email);

        if (exists) {
          console.log(`⏭️  Skipping existing user: ${email}`);
          results.skipped.push({
            email,
            reason: 'User already exists in auth.users',
          });
        } else {
          console.log(`📝 User to be created: ${email}`);
          results.toBeCreated.push({ email, password });
        }
      } catch (error: any) {
        console.error(`❌ Error processing record:`, error);
        results.failed.push({
          email: record[emailKey!] || 'unknown',
          error: error.message,
        });
      }
    }

    // Create users if not in preview mode
    if (!previewOnly) {
      console.log('\n🚀 Starting user creation...');
      for (const user of results.toBeCreated) {
        try {
          console.log(`\nAttempting to create user: ${user.email}`);

          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            password: user.password,
          });

          if (error) {
            console.error(`❌ Failed to create user ${user.email}:`, error);
            throw error;
          }

          console.log(`✅ Successfully created user: ${user.email}`);
          results.success.push(user);
        } catch (error: any) {
          console.error(`❌ Error creating user ${user.email}:`, error);
          results.failed.push({
            email: user.email,
            error: error.message,
          });
        }
      }
    }

    // Update summary
    results.summary = {
      totalProcessed: records.length,
      toBeCreated: results.toBeCreated.length,
      skipped: results.skipped.length,
      success: previewOnly ? 0 : results.success.length,
      failed: results.failed.length,
    };

    console.log('\n📊 Summary:', results.summary);

    return NextResponse.json({
      mode,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Process failed:', error);
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
