import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log("Received request in POST route for insert-recruiter-profile");

    const bodyText = await request.text();
    console.log("Raw request body:", bodyText);

    const { profile_id, role, name, email } = JSON.parse(bodyText);

    const supabase = createClient();

    if (profile_id) {
      const { data: profileData, error: profileError } = await supabase
        .from('all_profiles')
        .select('profile_id')
        .eq('profile_id', profile_id)
        .single();

      const { data: recruiterData, error: recruiterError } = await supabase
        .from('recruiter_profiles')
        .select('recruiter_id')
        .eq('recruiter_id', profile_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // } else if (recruiterError) {
        //   console.error('Error fetching recruiter profile:', recruiterError);
      } else if (profileData) {
        if (!recruiterData) {
          const { data, error } = await supabase
            .from('recruiter_profiles')
            .insert({
              recruiter_id: profile_id,
              name: name,
              email: email,
            })
            .select()
            ;

          if (error) {
            console.error('Error inserting recruiter profile:', error);
          } else {
            console.log('Recruiter profile inserted successfully:', data);
          }
        } else {
          console.log('Recruiter profile already exists for the given recruiter_id:', profile_id);
        }
      } else {
        console.error('Profile does not exist for the given recruiter_id:', profile_id);
      }
    } else {
      console.error('User ID is not available.');
    }

    return NextResponse.json({ message: 'Recruiter profile saved successfully' });
  } catch (error) {
    console.error('Error saving inserting recruiter profile data file:', error);
    return NextResponse.json({ error: 'Failed to save insert recruiter profile data file' }, { status: 500 });
  }
}
