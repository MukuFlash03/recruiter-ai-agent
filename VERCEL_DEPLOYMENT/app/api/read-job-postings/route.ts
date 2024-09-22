import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('job_postings')
            .select()
        if (error) throw error;
        console.log(request);

        return NextResponse.json({ message: 'Job Postings data fetched successfully', data });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch job postings data' }, { status: 500 });
    }
}