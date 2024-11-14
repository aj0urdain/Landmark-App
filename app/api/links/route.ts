import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/utils/supabase/admin';

interface Link {
  title: string;
  url: string;
  departments: string[] | null;
  branches: string[] | null;
  teams: string[] | null;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

interface Department {
  id: number;
  department_name: string;
}

interface Branch {
  id: number;
  branch_name: string;
}

interface Team {
  id: number;
  team_name: string;
}

function parseArrayString(str: string): string[] {
  console.log(`  🔍 Parsing array string: "${str}"`);
  const match = str.match(/\[(.*)\]/);
  if (!match) {
    console.log('  ⚠️ No array pattern found, returning empty array');
    return [];
  }

  const result = match[1]
    .split(',')
    .map((item) => {
      const trimmed = item.trim();
      console.log(`    • Processing value: "${trimmed}"`);
      return trimmed.replace(/['"]/g, '');
    })
    .filter((item) => item.length > 0);

  console.log(`  ✅ Parsed array: [${result.join(', ')}]`);
  return result;
}

function parseLine(line: string, currentCategory: string): Link | null {
  console.log(`\n📝 Processing line: "${line}"`);

  if (!line.trim() || line.startsWith('#')) {
    console.log('  ⏭️ Skipping empty line or category header');
    return null;
  }

  const parts = line.split(',');
  if (parts.length < 2) {
    console.log('  ❌ Invalid line format (needs at least title and URL)');
    return null;
  }

  const title = parts[0].trim();
  const url = parts[1].trim();

  console.log(`  📌 Title: "${title}"`);
  console.log(`  🔗 URL: "${url}"`);

  let departments = null;
  let branches = null;
  let teams = null;

  // Process remaining parts (arrays)
  for (let i = 2; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    console.log(`  👉 Processing part: "${part}"`);
    const [arrayType] = part.toLowerCase().split(' ');

    switch (arrayType) {
      case 'departments':
        departments = parseArrayString(part);
        break;
      case 'branches':
        branches = parseArrayString(part);
        break;
      case 'teams':
        teams = parseArrayString(part);
        break;
      default:
        console.log(`  ⚠️ Unknown array type: ${arrayType}`);
    }
  }

  return {
    title,
    url,
    departments,
    branches,
    teams,
    category: currentCategory,
  };
}

async function lookupIds(links: Link[]) {
  console.log('\n🔍 Looking up IDs for categories, departments, branches, and teams...');

  const [
    { data: categories },
    { data: departments },
    { data: branches },
    { data: teams },
  ] = await Promise.all([
    supabaseAdmin.from('link_categories').select('id, name'),
    supabaseAdmin.from('departments').select('id, department_name'),
    supabaseAdmin.from('branches').select('id, branch_name'),
    supabaseAdmin.from('teams').select('id, team_name'),
  ]);

  console.log('\n📊 Available departments in database:');
  departments?.forEach((d) => console.log(`  • ${d.department_name} (ID: ${d.id})`));

  const processedLinks = links.map((link) => {
    console.log(`\n🔗 Processing link: ${link.title}`);

    // Find category ID
    const categoryId = categories?.find(
      (cat) => cat.name.toLowerCase() === link.category.toLowerCase(),
    )?.id;

    // Map department names to IDs
    const departmentIds =
      link.departments
        ?.map((dept) => {
          const found = departments?.find(
            (d) => d.department_name.toLowerCase() === dept.toLowerCase(),
          );
          console.log(
            `  • Looking up department "${dept}": ${found ? `Found ID ${found.id}` : 'Not found'}`,
          );
          return found?.id;
        })
        .filter(Boolean) || [];

    // Map branch names to IDs
    const branchIds =
      link.branches
        ?.map((branch) => {
          const found = branches?.find(
            (b) => b.branch_name.toLowerCase() === branch.toLowerCase(),
          );
          console.log(
            `  • Looking up branch "${branch}": ${found ? `Found ID ${found.id}` : 'Not found'}`,
          );
          return found?.id;
        })
        .filter(Boolean) || [];

    // Map team names to IDs
    const teamIds =
      link.teams
        ?.map((team) => {
          const found = teams?.find(
            (t) => t.team_name.toLowerCase() === team.toLowerCase(),
          );
          console.log(
            `  • Looking up team "${team}": ${found ? `Found ID ${found.id}` : 'Not found'}`,
          );
          return found?.id;
        })
        .filter(Boolean) || [];

    console.log(`  ✅ Final department IDs: [${departmentIds.join(', ')}]`);
    console.log(`  ✅ Final branch IDs: [${branchIds.join(', ')}]`);
    console.log(`  ✅ Final team IDs: [${teamIds.join(', ')}]`);

    return {
      title: link.title,
      url: link.url,
      category_id: categoryId,
      departments: departmentIds,
      branches: branchIds,
      teams: teamIds,
    };
  });

  return processedLinks;
}

async function insertLinks(processedLinks: any[]) {
  console.log('\n📥 Starting database insertion...');
  const results = {
    success: [] as any[],
    failed: [] as any[],
    summary: {
      total: processedLinks.length,
      success: 0,
      failed: 0,
    },
  };

  for (const link of processedLinks) {
    try {
      console.log(`\n🔗 Inserting link: ${link.title}`);

      const { data, error } = await supabaseAdmin
        .from('links')
        .insert({
          title: link.title,
          url: link.url,
          category_id: link.category_id,
          departments: link.departments,
          branches: link.branches,
          teams: link.teams,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error inserting ${link.title}:`, error.message);
        results.failed.push({ link, error: error.message });
        results.summary.failed++;
      } else {
        console.log(`✅ Successfully inserted ${link.title}`);
        results.success.push(data);
        results.summary.success++;
      }
    } catch (error: any) {
      console.error(`❌ Exception inserting ${link.title}:`, error.message);
      results.failed.push({ link, error: error.message });
      results.summary.failed++;
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  try {
    console.log('\n🚀 Starting links processing...');
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'preview';
    const previewOnly = mode === 'preview';

    console.log(`\n⚙️ Running in ${mode.toUpperCase()} mode`);

    const filePath = path.join(process.cwd(), 'utils/scripts/links.txt');
    console.log(`\n📂 Reading file from: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath);
      return NextResponse.json(
        { error: 'File not found', path: filePath },
        { status: 404 },
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    console.log(`📊 Found ${lines.length} lines in file`);

    let currentCategory = '';
    const links: Link[] = [];
    const categories = new Set<string>();

    for (const line of lines) {
      if (line.startsWith('#')) {
        currentCategory = line.replace('#', '').trim();
        categories.add(currentCategory);
        console.log(`\n📑 Category: ${currentCategory}`);
        continue;
      }

      const parsedLink = parseLine(line, currentCategory);
      if (parsedLink) {
        links.push(parsedLink);
      }
    }

    console.log(`\n📊 Processing Summary:`);
    console.log(`  • Total categories: ${categories.size}`);
    console.log(`  • Total links: ${links.length}`);

    // Collect unique values
    const uniqueDepartments = new Set<string>();
    const uniqueBranches = new Set<string>();
    const uniqueTeams = new Set<string>();

    links.forEach((link) => {
      if (link.departments) {
        link.departments.forEach((dept) => uniqueDepartments.add(dept));
      }
      if (link.branches) {
        link.branches.forEach((branch) => uniqueBranches.add(branch));
      }
      if (link.teams) {
        link.teams.forEach((team) => uniqueTeams.add(team));
      }
    });

    console.log('\n📊 Access Control Summary:');
    console.log('\nDepartments:');
    console.log(
      Array.from(uniqueDepartments)
        .sort()
        .map((dept) => `  • ${dept}`)
        .join('\n'),
    );

    console.log('\nBranches:');
    console.log(
      Array.from(uniqueBranches)
        .sort()
        .map((branch) => `  • ${branch}`)
        .join('\n'),
    );

    console.log('\nTeams:');
    console.log(
      Array.from(uniqueTeams)
        .sort()
        .map((team) => `  • ${team}`)
        .join('\n'),
    );

    if (!previewOnly) {
      const processedLinks = await lookupIds(links);
      const results = await insertLinks(processedLinks);

      console.log('\n📊 Insertion Summary:');
      console.log(`  • Total processed: ${results.summary.total}`);
      console.log(`  • Successfully inserted: ${results.summary.success}`);
      console.log(`  • Failed: ${results.summary.failed}`);

      return NextResponse.json({
        mode,
        results,
        message: 'Database insertion completed',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      mode,
      previewData: {
        totalCategories: categories.size,
        categories: Array.from(categories),
        totalLinks: links.length,
        sample: links.slice(0, 3),
      },
      data: previewOnly ? links : undefined,
      message: previewOnly ? 'Preview completed' : 'CSV file created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file', details: error },
      { status: 500 },
    );
  }
}
