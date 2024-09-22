
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

