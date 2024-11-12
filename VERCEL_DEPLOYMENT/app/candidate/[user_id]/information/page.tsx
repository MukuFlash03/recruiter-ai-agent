'use client'

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { SelectedCandidateFields } from "@/lib/types/candidate_profiles";
import { fetchCandidateProfile } from '@/lib/utils/api_calls';
import { createClient } from "@/lib/utils/supabase/client";
import Link from 'next/link';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecruiterResultsPage() {
  const [candidateData, setCandidateData] = useState<SelectedCandidateFields>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  const params = useParams();
  const userId = Array.isArray(params.user_id) ? params.user_id[0] : params.user_id;
  console.log("User ID from params:", userId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return redirect('/login');
      }

      setUser(user);
      return user;
    };

    const loadData = async (currentUser: any) => {
      if (!currentUser || !userId) {
        console.error("User not available");
        setError('User information not available');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCandidateProfile();
        setCandidateData(data.data[0]);
        console.log("Fetched candidate profile data in UI", data);
      } catch (err) {
        console.error("Error fetching candidate profile data:", err);
        setError('Failed to fetch candidate profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser().then(loadData);
  }, [userId]);

  if (loading)
    return <LoadingSpinner message="Fetching matched candidates..." />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not authenticated</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Candidate Profile
        </h1>
        <div className="flex space-x-4 justify-end">
          <Link href={`/candidate/${user.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {candidateData && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div>
                <h2 className="text-2xl text-black font-bold">{candidateData.name}</h2>
                <p className="text-gray-600">{candidateData.current_location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
                  <p className="text-gray-600">Email: {candidateData.email}</p>
                  <p className="text-gray-600">Phone: {candidateData.contact}</p>
                  <a href={candidateData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    LinkedIn Profile
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Preferences</h3>
                  <p className="text-gray-600">Work Environment: {candidateData.work_environment}</p>
                  <p className="text-gray-600">Salary Expectation: {candidateData.salary_expectation}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Resume Content</h3>
                  <div className="max-h-60 overflow-y-auto bg-gray-50 p-4 rounded">
                    <p className="text-gray-600 whitespace-pre-line">{candidateData.resume_content}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Additional Information</h3>
                  <p className="text-gray-600">{candidateData.additional_info}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )

}