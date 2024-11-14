import { createClient } from '@/lib/utils/supabase/server';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import { pdfToText } from 'pdf-ts';

export async function POST(request: Request) {
  const { filePath } = await request.json();
  console.log("File Path:", filePath);

  const fileName = filePath.split('/').pop()
  console.log("File Name:", fileName);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated in fetch-pdf-text route');
  }

  console.log("User ID:", user.id);
  const user_id = user.id;

  const { data: ResumesBucketDownloadData, error: ResumesBucketDownloadError } = await supabase
    .storage
    .from('interviews')
    .download(`${user_id}/${filePath}`)

  console.log("ResumesBucketDownloadData:", ResumesBucketDownloadData);
  console.log("ResumesBucketDownloadError:", ResumesBucketDownloadError);

  if (!ResumesBucketDownloadData) {
    throw new Error('Failed to download PDF file');
  }

  const pdfBuffer = Buffer.from(await ResumesBucketDownloadData.arrayBuffer())

  // const blob = new Blob([buffer], {
  //   type: 'application/pdf'
  // })

  // const file = new File(
  //   [blob],
  //   filePath.split('/').pop() || 'document.pdf',
  //   {
  //     type: 'application/pdf',
  //     lastModified: Date.now()
  //   }
  // )

  try {
    const pdf = await fs.readFile(filePath);
    const text = await pdfToText(pdf);

    const textFromPdfBuffer = await pdfToText(pdfBuffer);
    console.log("\n***********************\n");
    console.log("\n***********************\n");
    console.log("textFromPdfBuffer in fetch-pdf-text route.ts:");
    console.log(textFromPdfBuffer);
    console.log("\n***********************\n");
    console.log("\n***********************\n");

    return NextResponse.json({ message: 'Text extracted from PDF successfully', text });
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
  }
}