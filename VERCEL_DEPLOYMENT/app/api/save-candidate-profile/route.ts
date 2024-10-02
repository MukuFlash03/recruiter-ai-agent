import { fetchPdfText } from '@/lib/utils/api_calls';
import { createClient } from '@/lib/utils/supabase/server';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const contact = formData.get('contact') as string;
    const file = formData.get('file') as File;
    const linkedIn = formData.get('linkedIn') as string;
    const location = formData.get('location') as string;
    const workPreference = formData.get('workPreference') as string;
    const salaryExpectation = formData.get('salaryExpectation') as string;
    const additionalInfo = formData.get('additionalInfo') as string;

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
        console.log('Profile info:', { name, email, contact, linkedIn, location, workPreference, salaryExpectation, additionalInfo });

        console.log("Received request in POST route");

        const supabase = createClient();
        const { data, error } = await supabase
            .from('candidate_profiles')
            .insert({
                name: name,
                email: email,
                contact: contact,
                resume_content: result_fetchResumeContent,
                linkedin_url: linkedIn,
                current_location: location,
                work_environment: workPreference,
                salary_expectation: salaryExpectation,
                additional_info: additionalInfo
            });

        if (error) throw error;

        // return NextResponse.json({ message: 'Job posting inserted successfully', data });
        return NextResponse.json({ message: 'Profile saved successfully' });
    } catch (error) {
        console.error('Error saving inserting profile data file:', error);
        return NextResponse.json({ error: 'Failed to save insert profile dta file' }, { status: 500 });
    }
}