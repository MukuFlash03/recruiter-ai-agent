import { createClient } from '@/lib/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log("GET Request received at /api/read-job-questions");
  try {
    const job_id = request.nextUrl.searchParams.get('job_id');
    console.log("Job ID in GET route:", job_id);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const recruiter_id = user?.id;

    const { data, error } = await supabase
      .from('job_postings')
      .select("custom_questions")
      .eq('recruiter_id', recruiter_id)
      .eq('job_id', job_id)
      ;

    if (error) throw error;

    console.log("Fetched job custom questions:", data);

    return NextResponse.json({ message: 'Job custom questions fetched successfully', data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch job custom questions' }, { status: 500 });
  }
}