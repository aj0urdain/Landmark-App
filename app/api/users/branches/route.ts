import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/utils/supabase/admin';

// Map states to branch IDs
const STATE_TO_BRANCH: Record<string, number> = {
  VIC: 5,
  NSW: 10,
  QLD: 6,
};

async function getUserId(email: string) {
  console.log(`🔍 Looking up user ID for email: ${email}`);
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (error) {
    console.error(`❌ Error fetching user ID: ${error.message}`);
    throw new Error(`Error fetching user ID: ${error.message}`);
  }

  console.log(`✅ Found user ID for email: ${email}`);
  return data.id;
}

async function checkExistingBranchAssignment(userId: string, branchId: number) {
  const { data, error } = await supabaseAdmin
    .from('user_branches')
    .select('*')
    .eq('user_id', userId)
    .eq('branch_id', branchId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error checking existing branch assignment: ${error.message}`);
  }

  return !!data;
}

export async function GET(request: NextRequest) {
  try {
    console.log('\n🚀 Starting branch assignment process...');
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'preview';
    const previewOnly = mode === 'preview';

    console.log(`\n⚙️ Running in ${mode.toUpperCase()} mode`);

    const CSV_FILE_PATH = path.join(
      process.cwd(),
      'utils/csv/stafflist/staff-branches.csv',
    );

    console.log(`📂 Reading CSV file from: ${CSV_FILE_PATH}`);

    if (!fs.existsSync(CSV_FILE_PATH)) {
      return NextResponse.json(
        { error: 'CSV file not found', path: CSV_FILE_PATH },
        { status: 404 },
      );
    }

    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    console.log(`📊 Found ${records.length} records in CSV`);

    const results = {
      toBeUpdated: [] as any[],
      skipped: [] as any[],
      failed: [] as any[],
      success: [] as any[],
      summary: {
        totalProcessed: 0,
        toBeUpdated: 0,
        skipped: 0,
        success: 0,
        failed: 0,
      },
    };

    // Process records
    for (const record of records) {
      try {
        const email = record.email?.trim();
        const state = record.state?.trim();

        if (!email || !state) {
          results.failed.push({
            record,
            error: 'Missing required fields (email or state)',
          });
          continue;
        }

        const branchId = STATE_TO_BRANCH[state];
        if (!branchId) {
          results.failed.push({
            record,
            error: `Invalid state: ${state}`,
          });
          continue;
        }

        const userId = await getUserId(email);
        const exists = await checkExistingBranchAssignment(userId, branchId);

        if (exists) {
          console.log(`⏭️ User ${email} already assigned to branch ${branchId}`);
          results.skipped.push({
            email,
            state,
            branchId,
            reason: 'Branch assignment already exists',
          });
          continue;
        }

        if (previewOnly) {
          results.toBeUpdated.push({ email, state, branchId });
        } else {
          const { error: insertError } = await supabaseAdmin
            .from('user_branches')
            .insert({ user_id: userId, branch_id: branchId });

          if (insertError) {
            throw new Error(`Error inserting branch assignment: ${insertError.message}`);
          }

          console.log(`✅ Successfully assigned ${email} to branch ${branchId}`);
          results.success.push({ email, state, branchId });
        }
      } catch (error: any) {
        console.error(`❌ Error processing record:`, error);
        results.failed.push({
          email: record.email || 'unknown',
          error: error.message,
        });
      }
    }

    results.summary = {
      totalProcessed: records.length,
      toBeUpdated: results.toBeUpdated.length,
      skipped: results.skipped.length,
      success: previewOnly ? 0 : results.success.length,
      failed: results.failed.length,
    };

    console.log('\n📊 Final Summary:', results.summary);
    console.log('✨ Process completed successfully\n');

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
