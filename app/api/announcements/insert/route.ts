'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🚀 Starting bulk announcement creation...');

  try {
    console.log('📊 Fetching departments...');
    const { data: departments, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('id, department_name');

    if (deptError) {
      console.error('❌ Error fetching departments:', deptError);
      throw deptError;
    }

    console.log(`✅ Found ${departments.length} departments:`, departments);

    // Create welcome announcement for each department
    console.log('📝 Creating announcement objects...');
    const announcements = departments.map((dept) => {
      console.log(`  Creating announcement for ${dept.department_name} (ID: ${dept.id})`);
      return {
        article_type: 'announcement',
        author_id: 'e2570807-6d18-4f80-921c-f66fa4d8b76a',
        title: `Welcome to the ${dept.department_name} Department!`,
        description: `This is an announcement post made for the ${dept.department_name} department for the launch of Landmark!`,
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: {
                id: crypto.randomUUID(),
                level: 1,
                textAlign: 'left',
                'data-toc-id': crypto.randomUUID(),
              },
              content: [{ text: 'Welcome!', type: 'text' }],
            },
            {
              type: 'paragraph',
              attrs: {
                id: crypto.randomUUID(),
                class: null,
                textAlign: 'left',
              },
            },
          ],
        },
        departments: [dept.id],
        cover_image:
          'https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/user_uploads/e2570807-6d18-4f80-921c-f66fa4d8b76a/lmbg-e2570807-6d18-4f80-921c-f66fa4d8b76a.webp',
        public: false,
      };
    });

    console.log('💾 Inserting announcements into database...');
    const { data: insertedAnnouncements, error: insertError } = await supabaseAdmin
      .from('articles')
      .insert(announcements)
      .select();

    if (insertError) {
      console.error('❌ Error inserting announcements:', insertError);
      throw insertError;
    }

    console.log(`✅ Successfully inserted ${insertedAnnouncements.length} announcements`);
    return NextResponse.json({
      success: true,
      count: insertedAnnouncements.length,
      announcements: insertedAnnouncements,
    });
  } catch (error) {
    console.error('❌ Error creating bulk announcements:', error);
    return NextResponse.json(
      { error: 'Failed to create announcements' },
      { status: 500 },
    );
  }
}
