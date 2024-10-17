import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log("Received request in POST route for insert-candidate-profile");

    const bodyText = await request.text();
    console.log("Raw request body:", bodyText);

    const { profile_id, role, name, email } = JSON.parse(bodyText);

    const supabase = createClient();

    if (profile_id) {
      const { data: profileData, error: profileError } = await supabase
        .from('all_profiles')
        .select('profile_id')
        .eq('profile_id', profile_id)
        // .single()
        ;

      const { data: candidateData, error: candidateError } = await supabase
        .from('candidate_profiles')
        .select('candidate_id')
        .eq('candidate_id', profile_id)
        // .single()
        ;

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // } else if (candidateError) {
        //   console.error('Error fetching candidate profile:', candidateError);
      } else if (profileData) {
        if (candidateData.length === 0) {
          const { data, error } = await supabase
            .from('candidate_profiles')
            .insert({
              candidate_id: profile_id,
              name: name,
              email: email,
            })
            // .select()
            ;

          if (error) {
            console.error('Error inserting candidate profile:', error);
          } else {
            console.log('Candidate profile inserted successfully:', data);
          }
        } else {
          console.log('Candidate profile already exists for the given candidate_id:', profile_id);
        }
      } else {
        console.error('Profile does not exist for the given candidate_id:', profile_id);
      }
    } else {
      console.error('User ID is not available.');
    }

    return NextResponse.json({ message: 'Candidate profile saved successfully' });
  } catch (error) {
    console.error('Error saving inserting candidate profile data file:', error);
    return NextResponse.json({ error: 'Failed to save insert candidate profile data file' }, { status: 500 });
  }
}
