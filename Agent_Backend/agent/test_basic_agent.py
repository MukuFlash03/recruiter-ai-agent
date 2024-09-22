from typing import List, Type, TypeVar, Any
from pydantic import BaseModel
from openai import OpenAI
import PyPDF2
import sys
import os
import asyncio

current_file_path = os.path.abspath(__file__)
parent_directory = os.path.dirname(os.path.dirname(current_file_path))
sys.path.append(parent_directory)

from entities.applicant import (
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

from basic_agent import (
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


async def main():
    base_folder = "Agent_Backend/"
    # base_folder = ""
    resume_path = f"{base_folder}data/Resume/Mukul_Resume.pdf"
    linkedin_path = f"{base_folder}data/LinkedIn/Mukul_LI_Profile.pdf"
    questions_path = f"{base_folder}data/QnA/Questions.txt"
    answers_path = f"{base_folder}data/QnA/Mukul_Answers.txt"

    resume_content = extract_text_from_pdf(resume_path)
    linkedin_content = extract_text_from_pdf(linkedin_path)

    merged_content = resume_content + linkedin_content

    raw_questions = read_prepared_qna(questions_path)
    raw_answers = read_prepared_qna(answers_path)

    questions = raw_questions.split("\n\n")
    questions = [question for question in questions if question.startswith("Q")]

    answers = raw_answers.split("-----------------")

    question_answer_list = []
    for question, answer in zip(questions, answers):
        question_answer_list.append(QuestionAnswer(question=question, answer=answer))

    qa_list: QuestionAnswerList = QuestionAnswerList(
        question_answer_list=question_answer_list
    )

    task_list: Any = []
    # Example usage
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

    # user = User(
    #     # personal_details=personal_details,
    #     # experiences=experiences,
    #     # educations=educations,
    #     # skills=skills,
    #     projects=projects.model_dump(),
    #     achievements=achievements,
    #     questionAnswer=qa_list,
    # )

    for i, experience in enumerate(experiences.experiences):
        print("Company", i + 1, experience.company)
        print("Title", i + 1, experience.title)
        print("Location", i + 1, experience.location)
        print("Start Date", i + 1, experience.start_date)
        print("End Date", i + 1, experience.end_date)

    # Example usage
    user_prompt = "What is the capital of France?"
    system_prompt = "You are a helpful assistant."
    result = get_openai_text_response(
        user_prompt=user_prompt, system_prompt=system_prompt
    )
    print(result)


if __name__ == "__main__":

    import asyncio

    asyncio.run(main())
