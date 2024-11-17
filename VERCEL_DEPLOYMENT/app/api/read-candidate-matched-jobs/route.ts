import { createClient } from '@/lib/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log("GET Request received at /api/read-candidate-matched-jobs");
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const candidate_id = user?.id;
    console.log("Candidate ID in GET route:", candidate_id);

    const { data: InterviewJobsData, error: InterviewJobsError } = await supabase
      .from('interviews')
      .select(`
            job_id,
            match_pct
          `
      )
      .eq('candidate_id', candidate_id)
      .gt('match_pct', 90)
      ;

    if (InterviewJobsError) throw InterviewJobsError;

    console.log("Fetched job_ids, match_pct:", InterviewJobsData);

    const jobIds = InterviewJobsData.map(job => job.job_id);
    console.log("Job IDs:", jobIds);


    const { data: MatchedJobsData, error: MatchedJobsError } = await supabase
      .from('job_postings')
      .select(`
        job_id,
        job_title,
        company_name,
        company_url,
        job_description,
        required_skills
        `)
      .in('job_id', jobIds)
      ;

    if (MatchedJobsError) throw MatchedJobsError;

    return NextResponse.json({ message: 'Candidate matched jobs fetched successfully', MatchedJobsData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch candidate matched jobs data' }, { status: 500 });
  }
}
