import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log("Received request in POST route");

    const bodyText = await request.text();
    console.log("Raw request body:", bodyText);

    const { jobTitle, companyName, jobDescription, requiredSkills, questions } = JSON.parse(bodyText);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        recruiter_id: user?.id,
        job_title: jobTitle,
        company_name: companyName,
        job_description: jobDescription,
        required_skills: requiredSkills,
        custom_questions: questions
      });

    if (error) throw error;

    return NextResponse.json({ message: 'Job posting inserted successfully', data });
  } catch (error) {
    console.error('Error inserting job posting:', error);
    return NextResponse.json({ error: 'Failed to insert job posting' }, { status: 500 });
  }
}
