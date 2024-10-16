import { fetchPdfText } from '@/lib/utils/api_calls';
import { createClient } from '@/lib/utils/supabase/server';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const contact = formData.get('contact') as string;
  const file = formData.get('file') as File;
  const linkedIn = formData.get('linkedIn') as string;
  const location = formData.get('location') as string;
  const workPreference = formData.get('workPreference') as string;
  const salaryExpectation = formData.get('salaryExpectation') as string;
  const additionalInfo = formData.get('additionalInfo') as string;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `resume.pdf`;
  const filePath = path.join(process.cwd(), 'lib', 'data', 'documents', fileName)

  try {
    await writeFile(filePath, buffer);
    console.log(`File saved to ${filePath}`);

    // TODO: Save profile information to a database
    // Here you would typically save the profile information to a database
    // For this example, we'll just log it
    const result_fetchResumeContent = await fetchPdfText(filePath)
    console.log(result_fetchResumeContent);
    console.log('Profile info:', { name, email, contact, linkedIn, location, workPreference, salaryExpectation, additionalInfo });

    console.log("Received request in POST route");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) {
      const userEmail = user.email;
      const userName = user.user_metadata?.full_name;

      const { data: profileData, error: profileError } = await supabase
        .from('all_profiles')
        .select('profile_id')
        .eq('profile_id', user.id)
        .single();

      const { data: candidateData, error: candidateError } = await supabase
        .from('candidate_profiles')
        .select('candidate_id')
        .eq('candidate_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (candidateError) {
        console.error('Error fetching candidate profile:', candidateError);
      } else if (profileData) {
        if (candidateData) {
          const { data, error } = await supabase
            .from('candidate_profiles')
            .update({
              name: name,
              email: email,
              contact: contact,
              resume_content: result_fetchResumeContent,
              linkedin_url: linkedIn,
              current_location: location,
              work_environment: workPreference,
              salary_expectation: salaryExpectation,
              additional_info: additionalInfo
            })
            .eq('candidate_id', user.id)
            .select()
            ;

          if (error) {
            console.error('Error updating candidate profile:', error);
          } else {
            console.log('Candidate profile updated successfully:', data);
          }
        } else {
          console.log('Candidate profile does not exist for the given candidate_id:', user.id);
        }
      } else {
        console.error('Profile does not exist for the given candidate_id:', user.id);
      }
    } else {
      console.error('User ID is not available.');
    }

    return NextResponse.json({ message: 'Candidate profile saved successfully' });
  } catch (error) {
    console.error('Error saving updating candidate profile data file:', error);
    return NextResponse.json({ error: 'Failed to save update candidate profile data file' }, { status: 500 });
  }
}
