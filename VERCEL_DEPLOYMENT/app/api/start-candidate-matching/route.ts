import { startJobCandidateMatching } from '@/lib/operations/startAnalysis';
import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log("Inside start-candidate-matching route");

  const { jobId, recruiter_id } = await request.json();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Start the matching process asynchronously
  try {
    // Your matching logic here
    // This could involve calling other services or running complex algorithms
    // FastAPI Agent AI endpoint

    if (user?.id) {
      console.log("Simulating matching process by sleeping for 5 seconds");

      // Simulate a time-consuming process
      // await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay

      await startJobCandidateMatching({
        job_id: jobId,
        recruiter_id: user.id,
      })

      console.log("Back after 5 seconds");

      console.log("Before trying to update analysis_status in Supabase");

      const { data, error } = await supabase
        .from('job_postings')
        // .select()
        .update({
          analysis_status: true
        })
        .eq('job_id', jobId)
        .eq('recruiter_id', user.id)
        // .select()
        ;

      console.log("After trying to update analysis_status in Supabase");

      console.log("Data from Supabase update:", data);
      console.log("Error from Supabase update:", error);


      if (error) {
        console.error('Error during matching process:', error);
      } else {
        console.log('Job->Candidates Matching process completed for job:', jobId);
      }
    } else {
      console.error('User ID is not available.');
    }

    return NextResponse.json({ message: 'Job->Candidates Matching process completed for job' });
  } catch (error) {
    console.error('Error in job->candidates matching process:', error);
    return NextResponse.json({ error: 'Error in job->candidates matching process' }, { status: 500 });
  }
}

