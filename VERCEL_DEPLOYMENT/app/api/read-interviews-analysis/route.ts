import { createClient } from '@/lib/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log("GET Request received at /api/read-interviews-data");
  try {
    const job_id = request.nextUrl.searchParams.get('job_id');
    console.log("Job ID in GET route:", job_id);

    const candidate_id = request.nextUrl.searchParams.get('candidate_id');
    console.log("Candidate ID in GET route:", candidate_id);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const recruiter_id = user?.id;

    console.log("Recruiter ID:", recruiter_id);
    console.log("Job ID:", job_id);
    console.log("Candidate ID:", candidate_id);

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
            characteristic_values,
            candidate_profiles (name)
          `
      )
      .eq('recruiter_id', recruiter_id)
      .eq('job_id', job_id)
      .eq('candidate_id', candidate_id)
      ;

    if (error) throw error;

    return NextResponse.json({ message: 'Analysis data fetched successfully', data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch analysis data' }, { status: 500 });
  }
}
