import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        console.log("Received request in POST route");

        const bodyText = await request.text();
        console.log("Raw request body:", bodyText);

        const {
            candidate_id, name,
            email, contact,
            current_location, work_environment,
            salary_expectation, additional_info
        } = JSON.parse(bodyText);

        const supabase = createClient();
        const { data, error } = await supabase
            .from('job_postings')
            .insert({
                candidate_id: candidate_id,
                name: name,
                email: email,
                contact: contact,
                current_location: current_location,
                work_environment: work_environment,
                salary_expectation: salary_expectation,
                job_title: jobTitle,
                company_name: companyName,
                job_description: jobDescription,
                required_skills: requiredSkills,
                custom_questions: questions
            });

        if (error) throw error;

        return NextResponse.json({ message: 'Job posting inserted successfully', data });
    } catch (error) {
        console.error('Error inserting job posting:', error);
        return NextResponse.json({ error: 'Failed to insert job posting' }, { status: 500 });
    }
}
