import { createClient } from '@/lib/utils/supabase/server';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
    try {
        const supabase = createClient();

        // Read the text file content
        const filename = 'interview_audio.txt';
        const filePath = path.join(process.cwd(), 'lib', 'data', 'audio', filename);
        const interview_audio_text = await fs.readFile(filePath, 'utf-8');

        console.log('Attempting to update the latest interview entry');

        // First, get the latest entry
        const { data: latestEntry, error: fetchError } = await supabase
            .from('candidate_profiles')
            .select('candidate_id')
            .order('candidate_id', { ascending: false })
            .limit(1)
            .single();

        if (fetchError) {
            console.error('Error fetching latest entry:', fetchError);
            throw fetchError;
        }

        if (!latestEntry) {
            return NextResponse.json({ error: 'No entries found in the table' }, { status: 404 });
        }

        // Now update the latest entry
        const { data, error } = await supabase
            .from('candidate_profiles')
            .update({ interview_audio_text: interview_audio_text })
            .eq('candidate_id', latestEntry.candidate_id)
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Updated audio data:', data);

        return NextResponse.json({ message: 'Audio data updated successfully' });
    } catch (error) {
        console.error('Error in Audio update API route:', error);
        return NextResponse.json({ error: 'Failed to update audio data' }, { status: 500 });
    }
}
