
export async function saveRecording(base64AudioMessage: string) {
    const response = await fetch('/api/save-recorded-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioData: base64AudioMessage }),
    });
    if (!response.ok) {
        console.log(response);
        throw new Error('Failed to save recording');
    }
    return response.json();
}

export async function saveAudio(base64AudioMessage: string) {
    const response = await fetch('/api/save-audio-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioData: base64AudioMessage }),
    });
    if (!response.ok) {
        console.log(response);
        throw new Error('Failed to save audio');
    }
    return response.json();
}


export async function fetchPdfText(filePath: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/fetch-pdf-text`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: filePath }),
    });
    if (!response.ok) {
        console.log(response);
        throw new Error('Failed to extract text from resume PDF');
    }
    return response.json();
}

export async function fetchJobPostings() {
    const response = await fetch('/api/read-job-postings', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify(candidate_data),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch job postings data');
    }

    return response.json();
}

// this is hacked for now to show the profile for the candidate dashboard
export async function fetchCandidateProfile() {
    const response = await fetch('/api/read-candidate-profiles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify(candidate_data),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch candidate profiles');
    }

    return response.json();
}

// export async function fetchInterviewData(candidate_data: { job_id: string }) {
export async function fetchInterviewData() {
    const response = await fetch('/api/read-interviews-data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify(candidate_data),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch interviews data');
    }

    return response.json();
}

/*
export async function insertJobPostings() {
    const response = await fetch('/api/insert-job-postings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidate_data),
    });

    if (!response.ok) {
        throw new Error('Failed to insert job postings data');
    }

    return response.json();
}
*/

import { JobPostingData } from '@/lib/types/jobs'; // You'll need to create this type

export async function insertJobPostings(formData: JobPostingData) {
    console.log('Form data in insertJobPostings:', formData);

    const response = await fetch('/api/insert-job-postings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to insert job postings data');
    }

    console.log('Response from server:', response);
    console.log('Response text:', await response.text());
    // console.log('Response JSON:', response.json());

    return response.json();
}
