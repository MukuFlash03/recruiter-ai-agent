import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { user_id, interview_id } = await request.json();

        const supabase = createClient();

        console.log('Attempting to update interview with ID:', interview_id);

        const { data, error } = await supabase
            .from('interviews')
            .update({ status: 'completed' })
            .eq('interview_id', interview_id)
            .select()

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Updated data:', data);

        return NextResponse.json({ message: 'Interview data updated successfully' });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Failed to update interview data' }, { status: 500 });
    }
}