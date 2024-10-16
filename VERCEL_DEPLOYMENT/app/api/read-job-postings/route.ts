import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const recruiter_id = user?.id;

    const { data, error } = await supabase
      .from('job_postings')
      .select()
      .eq('recruiter_id', recruiter_id);
    if (error) throw error;

    console.log("Fetched job postings data:", data);


    return NextResponse.json({ message: 'Job Postings data fetched successfully', data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch job postings data' }, { status: 500 });
  }
}