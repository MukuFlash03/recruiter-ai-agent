'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewsCandidateResponse } from "@/lib/types/interviews";
import { fetchCustomQuestions, fetchInterviewAnalysis } from '@/lib/utils/api_calls';
import { createClient } from "@/lib/utils/supabase/client";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CandidatesAnalysisPage() {
  // const [analysisData, setAnalysisData] = useState<InterviewsCandidateResponse>();
  const [analysisData, setAnalysisData] = useState<InterviewsCandidateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);


  const supabase = createClient();

  const params = useParams();
  // const jobId = params.job_id;
  const jobId = Array.isArray(params.job_id) ? params.job_id[0] : params.job_id;
  const candidateId = Array.isArray(params.candidate_id) ? params.candidate_id[0] : params.candidate_id;
  console.log("Job ID from params:", jobId);
  console.log("Candidate ID from params:", candidateId);

  console.log("Before useEffect in CandidatesAnalysisPage");

  useEffect(() => {
    const fetchUserAndLoadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect('/login');
      }

      try {
        const data = await fetchInterviewAnalysis({
          job_id: jobId,
          recruiter_id: user.id,
          candidate_id: candidateId,
        });

        console.log("Fetched data:", data);


        const customQuestionsData = await fetchCustomQuestions({
          job_id: jobId,
          recruiter_id: user.id,
        });

        setCustomQuestions(customQuestionsData.data["0"].custom_questions);
        setAnalysisData(data.data[0]);
      } catch (err) {
        setError('Failed to fetch candidate analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLoadData();

    // }, [jobId, candidateId]);
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !analysisData) {
    return <div>Error: {error || 'Failed to load data'}</div>;
  }

  console.log("After useEffect in CandidatesAnalysisPage");

  console.log("Logging analysisData in CandidatesAnalysisPage:");
  console.log(analysisData);

  const data = {
    candidate_name: analysisData.candidate_profiles.name,
    candidate_selection: {
      selected: analysisData.interview_decision,
      reasoning: analysisData.reasoning_summary
    },
    match_pct: analysisData.match_pct,
    questions: customQuestions,
    answers: analysisData.custom_answers || [],
    relevant_contexts: analysisData.relevant_contexts || []
  }

  console.log("Checking relevant_contexts:");
  console.log(data.relevant_contexts);
  console.log(data.relevant_contexts["1"]);




  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{`Candidate Evaluation: ${data.candidate_name}`}</CardTitle>
          <CardDescription>
            Selection Status: {data.candidate_selection.selected ? (
              <span className="text-green-600 font-semibold">Selected</span>
            ) : (
              <span className="text-red-600 font-semibold">Not Selected</span>
            )}
          </CardDescription>
          <CardDescription>
            Match: {data.match_pct}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{data.candidate_selection.reasoning}</p>
        </CardContent>
      </Card>

      {data.questions.map((question, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.answers[index]}</p>
            {data.relevant_contexts["1"] && data.relevant_contexts["1"].length > 0 && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="relevant-contexts">
                  <AccordionTrigger>Relevant Contexts</AccordionTrigger>
                  <AccordionContent>
                    {data.relevant_contexts["1"].map((context, contextIndex) => (
                      <div key={contextIndex} className="mb-4 p-4 bg-gray-50 rounded-md">
                        <div className="flex items-center mb-2">
                          {context.yes_or_no ? (
                            <CheckCircledIcon className="w-5 h-5 text-green-600 mr-2" />
                          ) : (
                            <CrossCircledIcon className="w-5 h-5 text-red-600 mr-2" />
                          )}
                          <span className="font-semibold">
                            {context.yes_or_no ? "Relevant" : "Not Relevant"}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{context.reasoning}</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {context.relevant_context.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}