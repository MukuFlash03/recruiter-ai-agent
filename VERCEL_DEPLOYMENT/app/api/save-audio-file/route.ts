import speechToText from '@/lib/operations/speechToText';
import { createClient } from '@/lib/utils/supabase/server';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  console.log("User ID:", user.id);
  const user_id = user.id;

  const data = await request.json()
  // const audioData = data.audioData
  // const fileName = 'interview_audio.mp3'
  const { audioData, questionNumber } = data
  const fileName = `interview_audio_q${questionNumber}.mp3`
  const filePath = path.join(process.cwd(), 'lib', 'data', 'audio', fileName)

  console.log("Uploaded file name: ", fileName);

  console.log("Attempting to upload audio MP3 file...For user ID:", user_id);
  console.log("Attempting to save to Supabase Storage...");


  try {
    const buffer = Buffer.from(audioData.split(',')[1], 'base64')
    const blob = new Blob([buffer], { type: 'audio/mp3' })
    const file = new File([blob], fileName, { type: 'audio/mp3' })

    const { data: InterviewsBucketAudioData, error: InterviewsBucketAudioError } = await supabase
      .storage
      .from('interviews')
      .upload(`${user_id}/audio/${fileName}`, file, {
        cacheControl: '3600',
        upsert: true
      })

    console.log("After upload to Supabase Storage...Error?");

    console.log("InterviewsBucketAudioData:", InterviewsBucketAudioData);
    console.log("InterviewsBucketAudioError:", InterviewsBucketAudioError);

    if (InterviewsBucketAudioError) {
      throw new Error('Failed to upload interview audio MP3 file to Supabase Storage');
    }

    console.log("List of files in the bucket:");

    const { data: InterviewsBucketAudioListData, error: InterviewsBucketAudioListError } = await supabase
      .storage
      .from('books_pages')
      .list(`${user_id}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })

    console.log("InterviewsBucketAudioListData:", InterviewsBucketAudioListData);
    console.log("InterviewsBucketAudioListError:", InterviewsBucketAudioListError);


    fs.writeFileSync(filePath, buffer)
    speechToText(filePath)
    return NextResponse.json({
      message: 'File saved successfully',
      fileName,
    })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ message: 'Error saving file' }, { status: 500 })
  }
}
