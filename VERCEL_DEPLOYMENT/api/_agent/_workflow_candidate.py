# Workflow

# For each question asked by the Recruiter
# Check user experiences.
# Get the relevant experiences
# First agent should say if this is relevant or not.
# Second agent should answer the question.
# You also add the reference context you obtained from the question.


from typing import Any
from _agent._basic_agent import (
    parse_input_async,
    parse_input,
    groq_text,
    get_openai_text_response,
    get_openai_text_response_async,
)
import asyncio
from _agent._test_basic_agent import (
    experience_file,
    education_file,
    project_file,
    skill_file,
    achievement_file,
    personal_details_file,
    question_answer_file,
    get_user_info,
)

from pydantic import BaseModel
import json
from _db._operations import \
  get_candidate_profiles, \
  get_job_postings, \
  get_interview_data, \
  insert_interviews_data, \
  get_all_job_postings
  
from _db._helpers import \
  organize_interview_data, \
  get_org_interviews_data, \
  organize_job_postings_data, \
  get_org_job_postings, \
  organize_candidate_profiles, \
  get_org_candidate_profiles, \
  get_org_all_job_postings
from _custom_types._agent import CandidateID

from _custom_types._applicant import (
    User,
    ExperienceList,
    EducationList,
    SkillList,
    ProjectList,
    AchievementList,
    QuestionAnswer,
    QuestionAnswerList,
    PersonalDetails,
)

standard_questions = [
  "Tell me a bit about yourself",
  "What are you looking for in your next role?",
  "Pick a project you are proud of and tell us why",
  "What's your biggest professional achievement?",
  "How do you handle challenging situations at work?"
]

def read_json_file(filename: str) -> dict:
    with open(filename, "r") as f:
        json_file = json.load(f)
    return json_file


def read_json_file_into_model(filename: str, model: Any) -> dict:
    json_out = read_json_file(filename)
    model_out = model(**json_out)
    return model_out


class Relevance(BaseModel):
    yes_or_no: bool
    reasoning: str
    relevant_context: list[str]


class AnswerToQuestion(BaseModel):
    answer: str


async def check_relevance(question: str, model_object: Any):
    system_prompt = """I am providing you with some details about a candidate for a job. 
    I will provide you with a question and also with some context about the candidate.
    I want you to tell if that experience is relevant or not. 
    
    The context of the user might be potentially provided in Json format.

    If it is relevant: then I want you to provide the reasoning why it is relevant.
    Then also give the relevant context why it is relevant.

    If it is not relevant: then I want you to provide the reasoning
    why it is not relevant.

    The relevant context should be the exact verbatim from the original context.
    """

    user_prompt = f"Question:\n{question} \n\n Candidate Context:{model_object.model_dump_json(indent=4)}"

    output_relevance: Relevance = await parse_input_async(
        system_content=system_prompt,
        user_content=user_prompt,
        response_format=Relevance,
    )
    return output_relevance


async def answer_the_question(question: str, relevant_context_list: list[Any]):
    system_prompt = """I am providing you with some details about a candidate for a job. 
    I will provide you with a question and also with some relevant context 
    about the candidate.
    I want you to answer the question provided on behalf of the candidate.
    
    Your answer should refer the candidate in third person. 
    If the name is provided in the context, you can use the name.
    If not you can use the pronoun 'he' or 'she'. 
    """
    relevant_context_list = [
        context.model_dump_json(indent=4) for context in relevant_context_list
    ]

    relevant_context_str = "\n".join(relevant_context_list)
    user_prompt = (
        f"Question:\n{question} \n\n Relevant Context:\n{relevant_context_str}"
    )

    output_answer: AnswerToQuestion = await parse_input_async(
        system_content=system_prompt,
        user_content=user_prompt,
        response_format=AnswerToQuestion,
    )
    return output_answer


class SelectionOfCandidate(BaseModel):
    selected: bool
    reasoning: str
    match_pct: str
    relevant_context: list[str]


class CharacteristicValues(BaseModel):
    problem_solving: str
    technical_skills: str
    leadership: str
    communication: str
    teamwork: str
    adaptability: str
    creativity: str
    relevant_context: list[str]


async def candidate_selection_function(questions: list[str], answers: list[str]):
    system_prompt = """I am providing you with some details about a candidate for a job. 
    I will provide you with a set of questions and also with some answers 
    about the candidate.
    I want you to tell if the candidate should is selected for the next round or not.
    
    Your answer should refer the candidate in third person. 
    If the name is provided in the context, you can use the name.
    If not you can use the pronoun 'he' or 'she'. 

    The relevant context should be the exact verbatim from the original context.

    Finally, based on your final judgment, assign the candidate a score of match percentage between 0 and 100.
    This would represent how well the candidate matches the job description.
    """

    user_prompt = ""
    for question, answer in zip(questions, answers):
        user_prompt += f"Question:\n{question} \n\n Answer:\n{answer}\n\n"

    output_selection: SelectionOfCandidate = await parse_input_async(
        system_content=system_prompt,
        user_content=user_prompt,
        response_format=SelectionOfCandidate,
    )
    return output_selection

async def gauge_characteristic_traits(qa_list: QuestionAnswerList):
    system_prompt = """I am providing you with some details about a candidate for a job. 
    I will provide you with a set of questions and also with some answers 
    about the candidate.
    I will also provide with the job details including job description and core principles and characteristic values of the company.
    I want you to tell how closely the candidate's behavioral traits and values match with the job description and core principles and characteristic values of the company.

    Gauge the candidate for these dimensions:
    Problem Solving, Technical Skills, Leadership, Communication, Teamwork, Adaptability, Creativity.

    For each of these dimensions, provide a score between 0 and 5.

    The final output format should only be the scores for each of the dimensions.
    Do not give any reasoning or explanation for the score.
    
    Your answer should refer the candidate in third person. 
    If the name is provided in the context, you can use the name.
    If not you can use the pronoun 'he' or 'she'. 

    The relevant context should be the exact verbatim from the original context.
    """

    user_prompt = ""
    for qa in qa_list.question_answer_list:
        user_prompt += f"Question:\n{qa.question} \n\n Answer:\n{qa.answer}\n\n"


    output_characteristic: CharacteristicValues = await parse_input_async(
        system_content=system_prompt,
        user_content=user_prompt,
        response_format=CharacteristicValues,
    )
    return output_characteristic


async def get_all_relevant_content_for_a_single_question(
    question: str, user_profile_list: list[Any]
):
    experiences, educations, skills, projects, achievements, personal_details, qa_list = (
        user_profile_list
    )
    tasks: Any = []
    for experience in experiences.experiences:
        tasks.append(
            asyncio.create_task(
                check_relevance(
                    question=question,
                    model_object=experience,
                )
            )
        )

    for education in educations.education:
        tasks.append(
            asyncio.create_task(
                check_relevance(
                    question=question,
                    model_object=education,
                )
            )
        )

    for project in projects.projects:
        tasks.append(
            asyncio.create_task(
                check_relevance(
                    question=question,
                    model_object=project,
                )
            )
        )

    tasks.append(
        asyncio.create_task(
            check_relevance(
                question=question,
                model_object=skills,
            )
        )
    )

    for achievement in achievements.achievements:
        tasks.append(
            asyncio.create_task(
                check_relevance(
                    question=question,
                    model_object=achievement,
                )
            )
        )

    relevances = await asyncio.gather(*tasks)

    relevant_chunks = [relevance for relevance in relevances if relevance.yes_or_no]
    irrelevant_chunks = [
        relevance for relevance in relevances if not relevance.yes_or_no
    ]
    print(relevances)

    return relevant_chunks


async def select_candidate(user_profile_list: list[Any], input_questions: list[str]):

    tasks = []
    for question in input_questions:
        tasks.append(
            asyncio.create_task(
                get_all_relevant_content_for_a_single_question(
                    question=question,
                    user_profile_list=user_profile_list,
                )
            )
        )
    relevant_contexts = await asyncio.gather(*tasks)

    answer_tasks = []
    for question, relevant_context in zip(input_questions, relevant_contexts):
        answer_tasks.append(
            asyncio.create_task(
                answer_the_question(
                    question=question, relevant_context_list=relevant_context
                )
            )
        )

    answers = await asyncio.gather(*answer_tasks)
    candidate_selection = await candidate_selection_function(
        questions=input_questions, answers=answers
    )

    candidate_characterstics = await gauge_characteristic_traits(
        qa_list=user_profile_list[6]
    )

    return candidate_selection, answers, relevant_contexts, candidate_characterstics


async def agent_matched_jobs(candidate_id: str):
    print("\n\nInside agent_matched_jobs workflow")

    print("\n\nCandidate ID:", candidate_id)

    candidates_data, organized_candidate_profiles, keys_list = get_candidate_profiles(candidate_id)

    print("\n\nCandidate Data:")
    print(candidates_data)
    print()
    print("\n\nOrganized Candidate Profile:")
    print(organized_candidate_profiles)
    print()
    print("\n\nKeys List:")
    print(keys_list)
    print()

    global standard_questions
    print("\n\nStandard Questions:")
    print(standard_questions)

    candidate_data = organized_candidate_profiles[candidate_id]

    experiences, educations, skills, projects, achievements, personal_details, qa_list = (
        await get_user_info(candidate_data)
    )

    job_postings_data, organized_job_postings, keys_list  = get_all_job_postings()
    print("\n\nJob Postings:")
    print(job_postings_data)
    print()
    print("\n\nOrganized Job Postings:")
    print(organized_job_postings)
    print()
    
    json_to_return = {}
    for job_id in keys_list:
        print("\n\n Checking job posting data in for loop in workflow for job_id: ", job_id)

        job_posting_data = organized_job_postings[job_id]
        print("\n\nJob Posting Data:")
        print(job_posting_data)

        recruiter_id = job_posting_data["recruiter_id"]
        print("\n\nRecruiter ID:")
        print(recruiter_id)

        # experiences, educations, skills, projects, achievements, personal_details, qa_list = (
        #     await get_user_info(candidate_data)
        # )

        # specific_job_data = get_org_all_job_postings(organized_job_postings, job_id)      
        # print("\n\nSpecific Job Posting Data:")
        # print(specific_job_data)

        # custom_questions = specific_job_data["custom_questions"]
        custom_questions = job_posting_data["custom_questions"]
        print("\n\nCustom Questions:")
        print(custom_questions)

        # all_questions = standard_questions + custom_questions
        all_questions = custom_questions
        print("\n\nAll Questions:")
        print(all_questions)

        print("\n\nInside agent_matched_jobs workflow; before select_candidate()")

        candidate_selection, answers, relevant_contexts, candidate_characterstics = await select_candidate(
            user_profile_list=[
                experiences,
                educations,
                skills,
                projects,
                achievements,
                personal_details,
                qa_list,
            ],
            input_questions=all_questions,
        )

        print("Inside agent_matched_jobs workflow; after select_candidate()")

        print("\n\nCandidate Matched Jobs Selection:")
        print(candidate_selection)

        # print("\n\nMatch percentage:")
        # print(candidate_selection.match_pct)
        
        print("\n\nBefore populating JSON for candidate:", candidate_id)
        json_to_return[candidate_id] = {}
        json_to_return[candidate_id]["ids"] = {
            "recruiter_id": recruiter_id, 
            "job_id": job_id
        }
        json_to_return[candidate_id]["candidate_selection"] = candidate_selection.model_dump()
        json_to_return[candidate_id]["custom_answers"] = [answer.model_dump() for answer in answers]
        # json_to_return[candidate_id]["custom_questions"] = custom_questions
        json_to_return[candidate_id]["relevant_contexts"] = [
            [context.model_dump() for context in relevant_context]
            for relevant_context in relevant_contexts
        ]
        json_to_return[candidate_id]["candidate_characterstics"] = candidate_characterstics.model_dump()

        print("\n\nJSON to return in workflow agent_matched_jobs for job_id:", job_id)
        print(json.dumps(json_to_return, indent=4))
        # print(json_to_return)

        print("Before inserting matched jobs interviews data to DB")
        insert_interviews_data(json_to_return)
        print("After inserting matched jobs interviews data to DB")
    
        json_to_return = {}

    print("\n\nReturning back after executing workflow agent_matched_jobs")
    # return json_to_return

if __name__ == "__main__":
    print("Running workflow main...")
