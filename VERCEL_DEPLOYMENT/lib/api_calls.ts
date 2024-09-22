
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

/*
export async function fetchPdfText(filePath: string) {
    const response = await fetch('/api/fetch-pdf-text', {
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
*/
