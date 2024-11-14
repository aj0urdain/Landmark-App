import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'preview';
    const previewOnly = mode === 'preview';

    console.log(`Running in ${mode.toUpperCase()} mode`);

    // Get all users with non-null profile pictures
    const { data: users, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, first_name, last_name, profile_picture')
      .not('profile_picture', 'is', null);

    if (error) {
      throw error;
    }

    const results = {
      toBeUpdated: [] as any[],
      updated: [] as any[],
      failed: [] as any[],
      summary: {
        totalProcessed: 0,
        toBeUpdated: 0,
        updated: 0,
        failed: 0,
      },
    };

    for (const user of users) {
      try {
        if (!user.first_name || !user.last_name) {
          results.failed.push({
            id: user.id,
            error: 'Missing first_name or last_name',
          });
          continue;
        }

        // Create the new profile picture URL
        const newProfilePicture = `https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/staff_images/staff-photo-${user.first_name.toLowerCase()}-${user.last_name.toLowerCase()}.png`;

        if (previewOnly) {
          results.toBeUpdated.push({
            id: user.id,
            oldPath: user.profile_picture,
            newPath: newProfilePicture,
          });
        } else {
          const { error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update({ profile_picture: newProfilePicture })
            .eq('id', user.id);

          if (updateError) {
            throw updateError;
          }

          results.updated.push({
            id: user.id,
            oldPath: user.profile_picture,
            newPath: newProfilePicture,
          });
        }
      } catch (error: any) {
        results.failed.push({
          id: user.id,
          error: error.message,
        });
      }
    }

    // Update summary
    results.summary = {
      totalProcessed: users.length,
      toBeUpdated: results.toBeUpdated.length,
      updated: results.updated.length,
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
      { error: 'Internal server error', details: error.message },
      { status: 500 },
    );
  }
}
