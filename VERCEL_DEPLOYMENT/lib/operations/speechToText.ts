'use server';

import { createClient } from '@/lib/utils/supabase/server';
import Groq from "groq-sdk";

const groq = new Groq();

async function speechToText(filePath: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  console.log("User ID:", user.id);
  const user_id = user.id;

  const { data: InterviewsBucketAudioData, error: InterviewsBucketAudioError } = await supabase
    .storage
    .from('interviews')
    .download(filePath)

  console.log("InterviewsBucketAudioData:", InterviewsBucketAudioData);
  console.log("InterviewsBucketAudioError:", InterviewsBucketAudioError);

  if (!InterviewsBucketAudioData) {
    throw new Error('Failed to download file');
  }

  const buffer = Buffer.from(await InterviewsBucketAudioData.arrayBuffer())

  const blob = new Blob([buffer], {
    type: 'audio/mp3'
  })

  const file = new File(
    [blob],
    filePath.split('/').pop() || 'audio.mp3',
    {
      type: 'audio/mp3',
      lastModified: Date.now()
    }
  )

  const transcription = await groq.audio.transcriptions.create({
    file: file,
    model: "distil-whisper-large-v3-en",
    response_format: "json",
    language: "en",
    temperature: 0.0,
  });

  console.log("Checking filePath in speechToText:", filePath.split('/').pop());

  console.log(transcription.text);
  writeToFile(transcription.text, filePath.split('/').pop());
}

async function writeToFile(content: string, filePathMP3: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  console.log("User ID:", user.id);
  const user_id = user.id;

  try {
    const filePath = filePathMP3.replace('.mp3', '.txt')
    const blob = new Blob([content], { type: 'text/plain' })
    const file = new File([blob], filePath, { type: 'text/plain' })

    const { data: InterviewsBucketTextData, error: InterviewsBucketTextError } = await supabase
      .storage
      .from('interviews')
      .upload(`${user_id}/text/${filePath}`, file, {
        cacheControl: '3600',
        upsert: true
      })

    console.log("After upload to Supabase Storage...Error?");

    console.log("InterviewsBucketTextData:", InterviewsBucketTextData);
    console.log("InterviewsBucketTextError:", InterviewsBucketTextError);

    if (InterviewsBucketTextError) {
      throw new Error('Failed to upload interview text file to Supabase Storage');
    }

    console.log(`File written successfully: ${filePath}`);
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

export default speechToText;