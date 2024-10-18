import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'utils', 'csv', 'csvmarketing.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as Record<string, string>[];

    const cleanedRecords = records.map((record) => {
      const cleanedRecord: Record<string, string> = {};
      for (const [key, value] of Object.entries(record)) {
        const cleanKey = key.replace(/^\uFEFF/, ''); // Remove BOM if present
        cleanedRecord[cleanKey] = value;
      }
      return cleanedRecord;
    });

    const updateResults = [];

    for (const record of cleanedRecords) {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update({
          first_name: record.first_name,
          last_name: record.last_name,
          business_number: record.business_number,
          mobile_number: record.mobile_number,
          birthday: record.birthday,
          work_anniversary: record.work_anniversary,
        })
        .eq('email', record.email)
        .select();

      console.log(data);

      updateResults.push({
        email: record.email,
        success: data !== null && data.length > 0,
        data: data,
        error: error?.message,
      });
    }

    return NextResponse.json(updateResults, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json({ error: 'Error processing CSV' }, { status: 500 });
  }
}
