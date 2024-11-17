from typing import List, Type, TypeVar, Any
from pydantic import BaseModel
from openai import OpenAI
import PyPDF2
import asyncio
import os
import sys
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Setup path resolution
API_DIR = Path(__file__).parent
ROOT_DIR = API_DIR.parent
sys.path.append(str(API_DIR))

current_file_path = os.path.abspath(__file__)
parent_directory = os.path.dirname(os.path.dirname(current_file_path))
sys.path.append(parent_directory)

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

tmpp_db = os.path.join(os.path.dirname(parent_directory), "tmpp_db")
experience_file = os.path.join(tmpp_db, "experiences.json")
education_file = os.path.join(tmpp_db, "educations.json")
project_file = os.path.join(tmpp_db, "projects.json")
skill_file = os.path.join(tmpp_db, "skills.json")
personal_details_file = os.path.join(tmpp_db, "personal_details.json")
question_answer_file = os.path.join(tmpp_db, "question_answers.json")
achievement_file = os.path.join(tmpp_db, "achievements.json")

from _agent._basic_agent import (
    parse_input,
    get_openai_text_response,
    parse_input_async,
    get_openai_text_response_async,
)


def read_prepared_qna(file_path):
    with open(file_path, "r") as file:
        content = file.read()
    return content


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.

    :param file_path: Path to the PDF file
    :return: Extracted text content
    """
    text = ""
    with open(file_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text


async def get_user_info(candidate_data) -> Any:
    base_folder = os.path.join(parent_directory, "data")
    # resume_path = os.path.join(base_folder, "Resume", "Mukul_Resume.pdf")
    # linkedin_path = os.path.join(base_folder, "LinkedIn", "Mukul_LI_Profile.pdf")
    # questions_path = os.path.join(base_folder, "QnA", "Questions.txt")
    # answers_path = os.path.join(base_folder, "QnA", "Mukul_Answers.txt")

    # resume_content = extract_text_from_pdf(resume_path)
    # linkedin_content = extract_text_from_pdf(linkedin_path)

    print("Inside get_user_info in test_basic_agent.py")

    standard_answers = candidate_data["interview_audio_texts"]
    print("\n\nStandard Answers:")
    print(standard_answers)

    resume_content = candidate_data["resume_content"]
    print("\n\nResume Content:")
    print(resume_content)

    liProfile_content = candidate_data["liProfile_content"]
    print("\n\nLinkedIn Content:")
    print(liProfile_content)

    merged_content = resume_content + liProfile_content
    
    global standard_questions
    raw_questions = standard_questions
    print("\n\nRaw Questions:")
    print(raw_questions)

    raw_answers = []
    for answer in standard_answers:
        raw_answers.append(answer["text"])
    print("\n\nRaw Answers:")
    print(raw_answers)

    # questions = raw_questions.split("\n\n")
    # questions = [question for question in questions if question.startswith("Q")]

    # answers = raw_answers.split("-----------------")

    question_answer_list = []
    for question, answer in zip(raw_questions, raw_answers):
        question_answer_list.append(QuestionAnswer(question=question, answer=answer))

    qa_list: QuestionAnswerList = QuestionAnswerList(
        question_answer_list=question_answer_list
    )

    print("\n\nQuestion Answer List:")
    print(qa_list)

    task_list: Any = []
    # Example usage

    """
    Uncomment below
    """
    
    experiences_task = parse_input_async(
        system_content="Extract the experiences from the resume.",
        user_content=merged_content,
        response_format=ExperienceList,
    )
    educations_task = parse_input_async(
        system_content="Extract the educations from the resume.",
        user_content=merged_content,
        response_format=EducationList,
    )
    skills_task = parse_input_async(
        system_content="Extract the skills from the resume.",
        user_content=merged_content,
        response_format=SkillList,
    )

    projects_task = parse_input_async(
        system_content="Extract the projects from the resume.",
        user_content=merged_content,
        response_format=ProjectList,
    )

    achievements_task = parse_input_async(
        system_content="Extract the achievements from the resume.",
        user_content=merged_content,
        response_format=AchievementList,
    )

    personal_details_task = parse_input_async(
        system_content="""Extract the personal details of name, \
                email, location and phone from the resume.""",
        user_content=merged_content,
        response_format=PersonalDetails,
    )

    task_list = [
        asyncio.create_task(task)
        for task in [
            experiences_task,
            educations_task,
            skills_task,
            projects_task,
            achievements_task,
            personal_details_task,
        ]
    ]

    experiences, educations, skills, projects, achievements, personal_details = (
        await asyncio.gather(*task_list)
    )

    import json

    # with open(experience_file, "w") as f:
    #     json.dump(experiences.model_dump(), f, indent=4)

    # with open(education_file, "w") as f:
    #     json.dump(educations.model_dump(), f, indent=4)

    # with open(skill_file, "w") as f:
    #     json.dump(skills.model_dump(), f, indent=4)

    # with open(project_file, "w") as f:
    #     json.dump(projects.model_dump(), f, indent=4)

    # with open(achievement_file, "w") as f:
    #     json.dump(achievements.model_dump(), f, indent=4)

    # with open(personal_details_file, "w") as f:
    #     json.dump(personal_details.model_dump(), f, indent=4)

    # with open(question_answer_file, "w") as f:
    #     json.dump(qa_list.model_dump(), f, indent=4)
    
    """
    Uncomment above
    """

    # user = User(
    #     # personal_details=personal_details,
    #     # experiences=experiences,
    #     # educations=educations,
    #     # skills=skills,
    #     projects=projects.model_dump(),
    #     achievements=achievements,
    #     questionAnswer=qa_list,
    # )

    # for i, experience in enumerate(experiences.experiences):
    #     print("Company", i + 1, experience.company)
    #     print("Title", i + 1, experience.title)
    #     print("Location", i + 1, experience.location)
    #     print("Start Date", i + 1, experience.start_date)
    #     print("End Date", i + 1, experience.end_date)

    # Example usage
    # user_prompt = "What is the capital of France?"
    # system_prompt = "You are a helpful assistant."
    # result = get_openai_text_response(
    #     user_prompt=user_prompt, system_prompt=system_prompt
    # )
    # print(result)

    return (experiences, educations, skills, projects, achievements, personal_details, qa_list)


if __name__ == "__main__":

    import asyncio

    # asyncio.run(get_user_info())
