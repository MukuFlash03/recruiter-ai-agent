import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log("Received request in POST route for insert-all-profile");

    const bodyText = await request.text();
    console.log("Raw request body:", bodyText);

    const { user_id, role } = JSON.parse(bodyText);

    const supabase = createClient();

    console.log("User ID:", user_id);
    console.log("Role: ", role);

    if (user_id) {
      const { data: profileData, error: profileError } = await supabase
        .from('all_profiles')
        .select('profile_id')
        .eq('profile_id', user_id)
        .single();

      // if (profileError) {
      //   console.error('Error fetching profile:', profileError);
      // } else 
      if (!profileData) {
        const { data, error } = await supabase
          .from('all_profiles')
          .insert({
            profile_id: user_id,
            role: role,
          })
          .select()
          ;

        if (error) {
          console.error(`Error inserting new profile with ${role} role: `, error);
        } else {
          console.log(`New profile with ${role} role inserted successfully: `, data);
        }
      } else {
        console.log('Profile already exists for the given user_id:', user_id);
      }
    } else {
      console.error('User ID is not available.');
    }

    return NextResponse.json({ message: 'New profile saved successfully' });
  } catch (error) {
    console.error('Error saving inserting new profile data file:', error);
    return NextResponse.json({ error: 'Failed to save insert new profile data file' }, { status: 500 });
  }
}
