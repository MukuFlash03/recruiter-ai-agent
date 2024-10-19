import { NewProfileResponse } from '../types/all_profiles';


/*
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
*/

/*
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
*/

export async function saveAudio(audioData: string, questionNumber: number) {
  const response = await fetch('/api/save-audio-file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audioData, questionNumber }),
  })
  return response.json()
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

export async function fetchInterviewData({ job_id }: { job_id: string }) {
  console.log('job_id in fetchInterviewData:', job_id);
  console.log('job_id again in fetchInterviewData:', job_id);

  const response = await fetch(`/api/read-interviews-data?job_id=${job_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({ job_id: job_id }),
  });

  console.log("After getting response from fetch api/read-interviews-data");

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
        // body: JSON.stringify(candidate_data),
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const response = await fetch(`${baseUrl}/api/insert-job-postings`, {
    // const response = await fetch('/api/insert-job-postings', {
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
  const responseData = await response.json();
  console.log('Response data:', responseData);
  // console.log('Response text:', await response.text());
  // console.log('Response JSON:', response.json());

  // return response.json();
  return responseData;
}

export async function insertNewProfile(user_id: string, role: string) {
  console.log(`User ID in insertNewProfile: ${user_id}`);
  console.log(`Role in insertNewProfile: ${role}`);

  const userData = {
    user_id: user_id,
    role: role,
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const response = await fetch(`${baseUrl}/api/insert-all-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error('Failed to insert new profile data');
  }

  console.log('Response from server:', response);
  const responseData = await response.json();
  console.log('Response data:', responseData);
  // console.log('Response text:', await response.text());
  // console.log('Response JSON:', response.json());

  // return response.json();
  return responseData;
}

export async function insertCandidateProfile(profileData: NewProfileResponse) {
  console.log(`User ID in insertCandidateProfile: ${profileData.profile_id}`);
  console.log(`Role in insertCandidateProfile: ${profileData.role}`);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const response = await fetch(`${baseUrl}/api/insert-candidate-profile`, {
    // const response = await fetch('/api/insert-candidate-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error('Failed to insert new profile data');
  }


  console.log('Response from server:', response);
  const responseData = await response.json();
  console.log('Response data:', responseData);
  // console.log('Response text:', await response.text());
  // console.log('Response JSON:', response.json());

  // return response.json();
  return responseData;
}

export async function insertRecruiterProfile(profileData: NewProfileResponse) {
  console.log(`User ID in insertCandidateProfile: ${profileData.profile_id}`);
  console.log(`Role in insertCandidateProfile: ${profileData.role}`);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const response = await fetch(`${baseUrl}/api/insert-recruiter-profile`, {
    // const response = await fetch('/api/insert-recruiter-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error('Failed to insert new profile data');
  }


  console.log('Response from server:', response);
  const responseData = await response.json();
  console.log('Response data:', responseData);
  // console.log('Response text:', await response.text());
  // console.log('Response JSON:', response.json());

  // return response.json();
  return responseData;
}


// Mock profile check
export async function checkProfileComplete() {
  const { data } = await fetchCandidateProfile();

  console.log('Data in checkProfileComplete:', data);

  if (data.length === 0) {
    return false;
  }


  if (data[0].work_environment === null) {
    return false;
  }
  return true;
  // Simulate API call
  // await new Promise(resolve => setTimeout(resolve, 500))
  // return false // Change this to true to simulate a completed profile
  // return true // Change this to true to simulate a completed profile
}