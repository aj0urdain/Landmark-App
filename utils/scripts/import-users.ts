import { parse } from 'csv-parse/sync';
import fs from 'fs';
import dotenv from 'dotenv';

import { supabaseAdmin as supabase } from '../supabase/admin';
import path from 'path';

dotenv.config();

// Define the CSV file path directly in the script
const CSV_FILE_PATH = path.join(
  __dirname,
  '/Users/aarongirton/Documents/Development/Landmark-App/utils/csv/stafflist/user-emails-csv.csv',
);
// Or use absolute path:
// const CSV_FILE_PATH = '/absolute/path/to/your/users.csv';

function generatePassword(email: string): string {
  const initials = email.substring(0, 2).toLowerCase();
  return `${initials}landmarkbr`;
}

async function checkExistingUser(email: string) {
  const { data, error } = await supabase
    .from('auth.users')
    .select('email')
    .eq('email', email)
    .single();

  return !!data;
}

async function processUsers(previewOnly: boolean = false) {
  try {
    // Verify file exists
    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error(`CSV file not found at: ${CSV_FILE_PATH}`);
      return;
    }

    // Read and parse CSV
    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const records = parse(fileContent, { columns: true });

    const results = {
      toBeCreated: [] as { email: string; password: string }[],
      skipped: [] as { email: string; reason: string }[],
      failed: [] as { email: string; error: any }[],
      success: [] as { email: string; password: string }[],
    };

    // First pass - check all emails and generate passwords
    for (const record of records) {
      const email = record.email;
      const password = generatePassword(email);

      try {
        const exists = await checkExistingUser(email);

        if (exists) {
          results.skipped.push({
            email,
            reason: 'User already exists in auth.users',
          });
        } else {
          results.toBeCreated.push({ email, password });
        }
      } catch (error) {
        results.failed.push({ email, error });
      }
    }

    // If not preview mode, create the users
    if (!previewOnly) {
      for (const user of results.toBeCreated) {
        try {
          const { error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
          });

          if (authError) throw authError;

          results.success.push(user);
        } catch (error) {
          results.failed.push({ email: user.email, error });
        }
      }
    }

    // Generate report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logContent = `
Import Results (${timestamp})
==========================

${previewOnly ? '*** PREVIEW MODE - NO USERS WERE ACTUALLY CREATED ***\n' : ''}

Users to be created:
${results.toBeCreated.map((user) => `- ${user.email} (password will be: ${user.password})`).join('\n')}

Users skipped (already exist):
${results.skipped.map(({ email, reason }) => `- ${email}: ${reason}`).join('\n')}

${
  !previewOnly
    ? `
Successfully created users:
${results.success.map((user) => `- ${user.email} (password: ${user.password})`).join('\n')}
`
    : ''
}

Failed operations:
${results.failed.map(({ email, error }) => `- ${email}: ${error}`).join('\n')}

Summary:
--------
Total records processed: ${records.length}
To be created: ${results.toBeCreated.length}
Skipped (existing): ${results.skipped.length}
${!previewOnly ? `Successfully created: ${results.success.length}` : ''}
Failed: ${results.failed.length}
    `;

    const logFileName = `user-import-${previewOnly ? 'preview' : 'results'}-${timestamp}.txt`;
    fs.writeFileSync(logFileName, logContent);
    console.log(`\nReport generated: ${logFileName}`);
  } catch (error) {
    console.error('Process failed:', error);
  }
}

// Simplified command line handling
const mode = process.argv[2]?.toLowerCase() || 'preview';

if (!['preview', 'import'].includes(mode)) {
  console.error('Please specify either "preview" or "import" as the argument');
  console.log('Usage: ts-node script.ts [preview|import]');
  process.exit(1);
}

console.log(`Running in ${mode.toUpperCase()} mode...`);
console.log(`Using CSV file: ${CSV_FILE_PATH}`);
processUsers(mode === 'preview');
