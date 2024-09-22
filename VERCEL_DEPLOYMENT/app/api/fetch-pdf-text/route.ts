import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import { pdfToText } from 'pdf-ts';

export async function POST(request: Request) {
    try {
        const { filePath } = await request.json();
        const pdf = await fs.readFile(filePath);
        const text = await pdfToText(pdf);
        return NextResponse.json({ message: 'Text extracted from PDF successfully', text });
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
    }
}