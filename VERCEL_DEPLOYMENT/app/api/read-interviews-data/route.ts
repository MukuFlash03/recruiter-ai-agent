import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('interviews')
            .select()
        if (error) throw error;
        console.log(request);

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
                score,
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