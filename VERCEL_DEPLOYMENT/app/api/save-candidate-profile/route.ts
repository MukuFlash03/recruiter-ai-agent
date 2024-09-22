import { fetchPdfText } from '@/lib/api_calls';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const linkedIn = formData.get('linkedIn') as string;
    const portfolio = formData.get('portfolio') as string;
    const github = formData.get('github') as string;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `resume.pdf`;
    const filePath = path.join(process.cwd(), 'lib', 'data', 'documents', fileName)

    try {
        await writeFile(filePath, buffer);
        console.log(`File saved to ${filePath}`);

        // TODO: Save profile information to a database
        // Here you would typically save the profile information to a database
        // For this example, we'll just log it
        const result_fetchResumeContent = await fetchPdfText(filePath)
        console.log(result_fetchResumeContent);
        console.log('Profile info:', { linkedIn, portfolio, github });

        return NextResponse.json({ message: 'Profile saved successfully' });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }
}