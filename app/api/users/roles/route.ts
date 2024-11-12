import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/utils/supabase/admin';

async function getOrCreateRole(roleName: string) {
  console.log(`🔍 Looking up role: "${roleName}"`);
  // First try to get existing role
  const { data: existingRole, error: fetchError } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('role_name', roleName)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error(`❌ Error fetching role: ${fetchError.message}`);
    throw new Error(`Error fetching role: ${fetchError.message}`);
  }

  if (existingRole) {
    console.log(`✅ Found existing role: "${roleName}"`);
    return existingRole.id;
  }

  console.log(`📝 Creating new role: "${roleName}"`);
  // Create new role if it doesn't exist
  const { data: newRole, error: insertError } = await supabaseAdmin
    .from('roles')
    .insert({ role_name: roleName })
    .select('id')
    .single();

  if (insertError) {
    throw new Error(`Error creating role: ${insertError.message}`);
  }

  return newRole.id;
}

async function getOrCreateDepartment(departmentName: string) {
  console.log(`🔍 Looking up department: "${departmentName}"`);
  // First try to get existing department
  const { data: existingDept, error: fetchError } = await supabaseAdmin
    .from('departments')
    .select('id')
    .eq('department_name', departmentName)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error(`❌ Error fetching department: ${fetchError.message}`);
    throw new Error(`Error fetching department: ${fetchError.message}`);
  }

  if (existingDept) {
    console.log(`✅ Found existing department: "${departmentName}"`);
    return existingDept.id;
  }

  console.log(`📝 Creating new department: "${departmentName}"`);
  // Create new department if it doesn't exist
  const { data: newDept, error: insertError } = await supabaseAdmin
    .from('departments')
    .insert({ department_name: departmentName })
    .select('id')
    .single();

  if (insertError) {
    throw new Error(`Error creating department: ${insertError.message}`);
  }

  return newDept.id;
}

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

export async function GET(request: NextRequest) {
  try {
    console.log('\n🚀 Starting role and department assignment process...');
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'preview';
    const previewOnly = mode === 'preview';

    console.log(`\n⚙️ Running in ${mode.toUpperCase()} mode`);

    const CSV_FILE_PATH = path.join(
      process.cwd(),
      'utils/csv/stafflist/staff-raw-roles.csv',
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

    // Track unique roles and departments for preview
    const uniqueRoles = new Set<string>();
    const uniqueDepartments = new Set<string>();
    const existingRoles = new Set<string>();
    const existingDepartments = new Set<string>();

    if (previewOnly) {
      console.log('\n🔍 Starting preview analysis...');
      // Get all existing roles and departments
      const { data: currentRoles } = await supabaseAdmin
        .from('roles')
        .select('role_name');

      const { data: currentDepartments } = await supabaseAdmin
        .from('departments')
        .select('department_name');

      const existingRoleNames = new Set(currentRoles?.map((r) => r.role_name) || []);
      const existingDeptNames = new Set(
        currentDepartments?.map((d) => d.department_name) || [],
      );

      // Process records for preview
      for (const record of records) {
        const email = record.email?.trim();
        const role = record.role?.trim();
        const department = record.department?.trim();

        if (!email || !role || !department) {
          results.failed.push({
            record,
            error: 'Missing required fields (email, role, or department)',
          });
          continue;
        }

        uniqueRoles.add(role);
        uniqueDepartments.add(department);

        if (existingRoleNames.has(role)) {
          existingRoles.add(role);
        }

        if (existingDeptNames.has(department)) {
          existingDepartments.add(department);
        }

        results.toBeUpdated.push({ email, role, department });
      }

      // Calculate new items
      const newRoles = [...uniqueRoles].filter((role) => !existingRoles.has(role));
      const newDepartments = [...uniqueDepartments].filter(
        (dept) => !existingDepartments.has(dept),
      );

      console.log('\n📊 Preview Analysis:');
      console.log('Roles:');
      console.log(`  • Total unique roles: ${uniqueRoles.size}`);
      console.log(`  • Existing roles: ${existingRoles.size}`);
      console.log(`  • New roles to create: ${newRoles.length}`);
      if (newRoles.length > 0) {
        console.log('  • New roles:', newRoles);
      }

      console.log('\nDepartments:');
      console.log(`  • Total unique departments: ${uniqueDepartments.size}`);
      console.log(`  • Existing departments: ${existingDepartments.size}`);
      console.log(`  • New departments to create: ${newDepartments.length}`);
      if (newDepartments.length > 0) {
        console.log('  • New departments:', newDepartments);
      }

      console.log('\nAssignments:');
      console.log(`  • Total user assignments to process: ${records.length}`);
    } else {
      console.log('\n⚡ Starting execution mode...');
      for (const record of records) {
        try {
          console.log(`\n📎 Processing record for email: ${record.email}`);
          const email = record.email?.trim();
          const role = record.role?.trim();
          const department = record.department?.trim();

          if (!email || !role || !department) {
            results.failed.push({
              record,
              error: 'Missing required fields (email, role, or department)',
            });
            continue;
          }

          const userId = await getUserId(email);
          const roleId = await getOrCreateRole(role);
          const departmentId = await getOrCreateDepartment(department);

          // Insert or update user_roles
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .upsert(
              { user_id: userId, role_id: roleId },
              { onConflict: 'user_id,role_id' },
            );

          if (roleError) {
            throw new Error(`Error updating user_roles: ${roleError.message}`);
          }

          // Insert or update user_departments
          const { error: deptError } = await supabaseAdmin
            .from('user_departments')
            .upsert(
              {
                user_id: userId,
                department_id: departmentId,
              },
              { onConflict: 'user_id,department_id' },
            );

          if (deptError) {
            throw new Error(`Error updating user_departments: ${deptError.message}`);
          }

          console.log(`✅ Successfully processed ${record.email}`);
          results.success.push({ email, role, department });
        } catch (error: any) {
          console.error(`❌ Error processing record for ${record.email}:`, error);
          results.failed.push({
            email: record.email || 'unknown',
            error: error.message,
          });
        }
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
      previewAnalysis: previewOnly
        ? {
            roles: {
              total: uniqueRoles.size,
              existing: existingRoles.size,
              new: uniqueRoles.size - existingRoles.size,
              newRoles: [...uniqueRoles].filter((role) => !existingRoles.has(role)),
              existingRoles: [...existingRoles],
            },
            departments: {
              total: uniqueDepartments.size,
              existing: existingDepartments.size,
              new: uniqueDepartments.size - existingDepartments.size,
              newDepartments: [...uniqueDepartments].filter(
                (dept) => !existingDepartments.has(dept),
              ),
            },
            assignments: records.length,
          }
        : undefined,
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
