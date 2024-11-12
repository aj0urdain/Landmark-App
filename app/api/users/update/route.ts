import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { format, parse as dateParse } from 'date-fns';

import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/utils/supabase/admin';

function convertToFullDate(dateString: string): string {
  // Handle work_anniversary format (e.g., "5-Aug-24")
  if (dateString.includes('-')) {
    const parsedDate = dateParse(dateString, 'd-MMM-yy', new Date());
    return format(parsedDate, 'yyyy-MM-dd');
  }

  // Handle birthday format (e.g., "28th July")
  const cleanDate = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');
  const parsedDate = dateParse(cleanDate, 'd MMMM', new Date());
  parsedDate.setFullYear(2000);
  return format(parsedDate, 'yyyy-MM-dd');
}

async function updateUserProfile(
  email: string,
  userData: {
    first_name?: string;
    last_name?: string;
    birthday?: string;
    work_anniversary?: string;
    business_number?: string;
    mobile_number?: string;
  },
) {
  const { data: existingUser, error: fetchError } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (fetchError) {
    throw new Error(`Error fetching user profile: ${fetchError.message}`);
  }

  if (!existingUser) {
    throw new Error('User profile not found');
  }

  const { error: updateError } = await supabaseAdmin
    .from('user_profiles')
    .update(userData)
    .eq('email', email);

  if (updateError) {
    throw new Error(`Error updating user profile: ${updateError.message}`);
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Starting user profile update process...');
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'preview';
    const previewOnly = mode === 'preview';

    console.log(`Running in ${mode.toUpperCase()} mode`);

    const CSV_FILE_PATH = path.join(
      process.cwd(),
      'utils/csv/stafflist/staff-raw-info.csv',
    );

    if (!fs.existsSync(CSV_FILE_PATH)) {
      return NextResponse.json(
        {
          error: 'CSV file not found',
          path: CSV_FILE_PATH,
        },
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

    for (const record of records) {
      try {
        const email = record.email?.trim();

        if (!email) {
          results.failed.push({
            record,
            error: 'Missing email',
          });
          continue;
        }

        const userData = {
          first_name: record.first_name?.trim(),
          last_name: record.last_name?.trim(),
          birthday: record.birthday ? convertToFullDate(record.birthday) : null,
          work_anniversary: record.work_anniversary
            ? convertToFullDate(record.work_anniversary)
            : null,
          business_number: record.business_number?.replace(/\s+/g, '')?.trim(),
          mobile_number: record.mobile_number?.replace(/\s+/g, '')?.trim(),
        };

        if (previewOnly) {
          results.toBeUpdated.push({ email, updates: userData });
        } else {
          await updateUserProfile(email, userData);
          results.success.push({ email, updates: userData });
        }
      } catch (error: any) {
        console.error(`Error processing record:`, error);
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

    console.log('\n📊 Summary:', results.summary);

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
