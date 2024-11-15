import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';
import { pdfToText } from 'pdf-ts';

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const contact = formData.get('contact') as string;
  const fileResume = formData.get('fileResume') as File;
  const fileLiProfile = formData.get('fileLiProfile') as File;
  const linkedIn = formData.get('linkedIn') as string;
  const location = formData.get('location') as string;
  const workPreference = formData.get('workPreference') as string;
  const salaryExpectation = formData.get('salaryExpectation') as string;
  const additionalInfo = formData.get('additionalInfo') as string;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  console.log("User ID:", user.id);
  const user_id = user.id;

  if (!fileResume || !fileLiProfile) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }

  const rawFiles: Record<string, File> = {
    fileResume: fileResume,
    fileLiProfile: fileLiProfile,
  }

  try {
    const fileContents = await fileBufferText(rawFiles);
    const result_fetchResumeContent = fileContents["fileResume"];
    const result_fetchLiProfileContent = fileContents["fileLiProfile"];

    // console.log('Profile info:', { name, email, contact, linkedIn, location, workPreference, salaryExpectation, additionalInfo });

    console.log("Received request in POST route");

    if (user?.id) {
      const userEmail = user.email;
      const userName = user.user_metadata?.full_name;

      const { data: profileData, error: profileError } = await supabase
        .from('all_profiles')
        .select('profile_id')
        .eq('profile_id', user.id)
        // .single()
        ;

      const { data: candidateData, error: candidateError } = await supabase
        .from('candidate_profiles')
        .select('candidate_id')
        .eq('candidate_id', user.id)
        // .single()
        ;

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (candidateError) {
        console.error('Error fetching candidate profile:', candidateError);
      } else if (profileData) {
        if (candidateData) {
          console.log("Updating profile...");;

          const { data, error } = await supabase
            .from('candidate_profiles')
            .update({
              name: name,
              email: email,
              contact: contact,
              resume_content: result_fetchResumeContent,
              liProfile_content: result_fetchLiProfileContent,
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

async function fileBufferText(rawFiles: Record<string, File>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  console.log("User ID:", user.id);
  const user_id = user.id;

  const fileContents: Record<string, string> = {};

  for (const [key, file] of Object.entries(rawFiles)) {
    if (file instanceof File) {
      console.log(`Processing ${key}... inside fileBufferText if`);
      const bytes = await file.arrayBuffer();
      // const buffer = Buffer.from(bytes);

      const fileName = `${key}.pdf`;

      const { data: ResumesBucketUploadData, error: ResumesBucketUploadError } = await supabase
        .storage
        .from('resumes')
        .upload(`${user_id}/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        })

      console.log("After upload to Supabase Storage...Error?");

      console.log("ResumesBucketUploadData:", ResumesBucketUploadData);
      console.log("ResumesBucketUploadError:", ResumesBucketUploadError);

      if (ResumesBucketUploadError) {
        throw new Error('Failed to upload resume documents to Supabase Storage');
      }

      console.log("Resume files saved successfully");

      try {
        const result = await fetchPdfText(fileName);
        // console.log(`Content of ${key}:`, result);

        fileContents[key] = result.text;
      } catch (error) {
        console.error(`Error processing ${key}:`, error);
      }
    }
  }
  // console.log("Processed file contents:", fileContents);

  return fileContents;
}

async function fetchPdfText(fileName: string) {
  console.log("File Name:", fileName);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated in fetchPdfText');
  }

  console.log("User ID:", user.id);
  const user_id = user.id;

  const { data: ResumesBucketDownloadData, error: ResumesBucketDownloadError } = await supabase
    .storage
    .from('resumes')
    .download(`${user_id}/${fileName}`)

  console.log("ResumesBucketDownloadData:", ResumesBucketDownloadData);
  console.log("ResumesBucketDownloadError:", ResumesBucketDownloadError);

  if (!ResumesBucketDownloadData) {
    throw new Error('Failed to download PDF file');
  }

  const pdfBuffer = Buffer.from(await ResumesBucketDownloadData.arrayBuffer())

  try {
    const textFromPdfBuffer = await pdfToText(pdfBuffer);
    return {
      message: 'Text extracted from PDF successfully',
      text: textFromPdfBuffer
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}
