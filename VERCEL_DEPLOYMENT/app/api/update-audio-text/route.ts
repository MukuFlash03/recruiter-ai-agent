import { createClient } from '@/lib/utils/supabase/server';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const candidate_id = user?.id;

    /*
    const filename = 'interview_audio.txt';
    const filePath = path.join(process.cwd(), 'lib', 'data', 'audio', filename);
    const interview_audio_text = await fs.readFile(filePath, 'utf-8');
    */

    // const { audioTexts } = await request.json();
    // console.log("Audio texts received from Request");
    // console.log(audioTexts);

    const { audioFileNames } = await request.json();
    console.log("Audio filenames received from Request");
    console.log(audioFileNames);

    console.log('Attempting to update the latest interview entry');

    const { data: latestEntry, error: fetchError } = await supabase
      .from('candidate_profiles')
      .select('candidate_id')
      .eq('candidate_id', candidate_id)
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

    const audioTexts = await Promise.all(audioFileNames.map(async (fileName, index) => {
      if (fileName) {
        const filePath = path.join(process.cwd(), 'lib', 'data', 'audio', fileName.replace('.mp3', '.txt'));
        const text = await fs.readFile(filePath, 'utf-8');
        return {
          questionNumber: index + 1,
          fileName: fileName,
          text: text
        };
      }
      return null;
    }));

    const audioData = audioTexts.filter(item => item !== null);

    const { data, error } = await supabase
      .from('candidate_profiles')
      // .update({ interview_audio_text: interview_audio_text })
      .update({ interview_audio_texts: audioData })
      .eq('candidate_id', latestEntry.candidate_id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Updated audio data:', data[0].interview_audio_texts);

    return NextResponse.json({ message: 'Audio data updated successfully' });
  } catch (error) {
    console.error('Error in Audio update API route:', error);
    return NextResponse.json({ error: 'Failed to update audio data' }, { status: 500 });
  }
}
