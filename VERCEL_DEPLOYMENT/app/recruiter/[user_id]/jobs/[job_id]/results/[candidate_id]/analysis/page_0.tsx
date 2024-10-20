import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from '@/lib/utils/supabase/server';
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";

export default async function Component() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // return redirect("/login");
    return redirect("/");
  }

  const data = {
    candidate_selection: {
      selected: true,
      reasoning: "The candidate should be selected for the next round because they are highly qualified for a DevOps development role. They have demonstrated a comprehensive set of relevant skills and experiences that align well with the requirements of such a position. Although the candidate's ability to lead a small team is not specified, their technical expertise and practical experience in DevOps make them a suitable candidate for the role.",
    },
    questions: [
      "How good is this candidate for DevOps development?",
      "How good is this candidate at leading a small team?",
    ],
    answers: [
      {
        answer: "The candidate is highly qualified for a DevOps development role. They have demonstrated a comprehensive set of relevant skills and experiences that align well with the requirements of such a position. The candidate has hands-on experience with Docker and Kubernetes for container orchestration, which are crucial for deploying, managing, and scaling applications, a core aspect of DevOps. Additionally, they have automated and streamlined DevOps processes using GitHub Actions, indicating practical knowledge of CI/CD workflows. \n\nFurthermore, their experience in deploying applications on AWS and designing cloud architectures demonstrates their proficiency with cloud infrastructure, which is essential in modern DevOps. They possess considerable expertise in various AWS services, including EC2, RDS, S3, and Lambda, which are often used in DevOps tasks for deployment and automation. Their technical background is solidified by a Master's degree in Computer Science with coursework in areas relevant to DevOps, such as \"Data Processing at Scale\" and \"Cloud Computing.\"\n\nThe candidate's experience with technologies like Apache Kafka and RabbitMQ illustrates their capability to handle data pipelines and messaging, which are vital in managing distributed systems. Their skills in Python for scripting and automation further enhance their suitability for managing and automating infrastructure tasks. Overall, the candidate's extensive background in relevant technologies and their practical experience make them a strong fit for a DevOps development role.",
      },
      {
        answer: "The candidate's ability to lead a small team is not specified in the provided details, so an assessment of their skill in this area cannot be made.",
      },
    ],
    relevant_contexts: [
      [
        {
          yes_or_no: true,
          reasoning: "The candidate has direct experience related to DevOps development as evidenced by their involvement in streamlining and automating DevOps processes and restructuring CI/CD workflows. This indicates practical involvement and understanding of DevOps practices, which is crucial for a DevOps development role.",
          relevant_context: [
            "Streamlined and automated DevOps processes by restructuring CI/CD workflows with GitHub Actions.",
          ],
        },
        {
          yes_or_no: true,
          reasoning: "The candidate's educational background is highly relevant for a position in DevOps development. Their Master's degree in Computer Science from a reputable institution like Arizona State University provides a strong foundation in the technical skills and knowledge crucial for DevOps roles. Furthermore, the coursework in \"Data Processing at Scale\" and \"Cloud Computing\" directly aligns with essential DevOps concepts such as scalable infrastructure management and cloud services integration, indicating that the candidate possesses relevant academic training for DevOps development.",
          relevant_context: [
            "Master of Science - MS, Computer Science",
            "Arizona State University",
            "Required courses, Data Processing at Scale, Cloud Computing",
          ],
        },
        // ... (other relevant contexts)
      ],
      [],
    ],
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Candidate Evaluation</CardTitle>
          <CardDescription>
            Selection Status: {data.candidate_selection.selected ? (
              <span className="text-green-600 font-semibold">Selected</span>
            ) : (
              <span className="text-red-600 font-semibold">Not Selected</span>
            )}
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
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.answers[index].answer}</p>
            {data.relevant_contexts[index].length > 0 && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="relevant-contexts">
                  <AccordionTrigger>Relevant Contexts</AccordionTrigger>
                  <AccordionContent>
                    {data.relevant_contexts[index].map((context, contextIndex) => (
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