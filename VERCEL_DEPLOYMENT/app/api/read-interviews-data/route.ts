import { createClient } from '@/lib/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log("GET Request received at /api/read-interviews-data");
  try {
    const job_id = request.nextUrl.searchParams.get('job_id');
    console.log("Job ID in GET route:", job_id);

    // const bodyText = await request.text();
    // console.log("Raw request body:", bodyText);

    // const { job_id } = JSON.parse(bodyText);

    // const job_id = '2'

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const recruiter_id = user?.id;

    console.log("Recruiter ID:", recruiter_id);
    console.log("Job ID:", job_id);


    const { data, error } = await supabase
      .from('interviews')
      .select(`
            interview_id,
            candidate_id,
            recruiter_id,
            job_id,
            interview_decision,
            match_pct,
            reasoning_summary,
            custom_answers,
            relevant_contexts,
            candidate_profiles (name)
          `
      )
      .eq('recruiter_id', recruiter_id)
      .eq('job_id', job_id)
      ;

    if (error) throw error;

    return NextResponse.json({ message: 'Interviews data fetched successfully', data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch interviews data' }, { status: 500 });
  }
}


/*
export async function GET(request: Request) {
    try {
        const { job_id } = await request.json();

        const supabase = createClient();
        const { data, error } = await supabase
            .from('interviews')
            .select(`
                candidate_id,
                job_id,
                match_pct,
                interview_decision,
                candidate_profiles!inner(name, email, contact),
                job_postings!inner(job_title, company_name)
            `)
        // .eq('interview_decision', "TRUE")
        // .eq('job_id', job_id)

        if (error) throw error;
        console.log(request);

        return NextResponse.json({ message: 'Interview candidates data fetched successfully', data });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch interview candidates data' }, { status: 500 });
    }
}
*/