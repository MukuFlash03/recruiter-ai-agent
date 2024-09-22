from typing import List, Type, TypeVar, Any
from pydantic import BaseModel
from openai import OpenAI
import PyPDF2
import sys
import os

current_file_path = os.path.abspath(__file__)
parent_directory = os.path.dirname(os.path.dirname(current_file_path))
sys.path.append(parent_directory)

from entities.applicant import User, ExperienceList, EducationList, SkillList, ProjectList, AchievementList, QuestionAnswer, QuestionAnswerList

# Define a generic type variable
T = TypeVar("T", bound=BaseModel)

client: OpenAI = OpenAI()

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.
    
    :param file_path: Path to the PDF file
    :return: Extracted text content
    """
    text = ""
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

def parse_input(
    system_content: str,
    user_content: str,
    response_format: Type[T],
    model: str = "gpt-4o-2024-08-06",
) -> T:
    """
    Generates a response from OpenAI based on the given inputs and model.

    Args:
        model (str): The OpenAI model to use for the completion.
        system_content (str): Content for the system role.
        user_content (str): Content for the user query.
        response_format (Type[T]): The class type of the response format (a Pydantic model).

    Returns:
        T: Parsed response from the completion in the type specified by response_format.
    """
    completion = client.beta.chat.completions.parse(
        model=model,
        messages=[
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_content},
        ],
        response_format=response_format,
    )

    if completion.choices[0].message.parsed is None:
        raise ValueError("Failed to parse response.")

    return completion.choices[0].message.parsed


def get_openai_text_response(
    system_prompt: str, user_prompt: str, model: str = "gpt-4o"
) -> str:
    client = OpenAI()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    if not response.choices[0].message.content:
        raise ValueError("Failed to generate response.")

    return response.choices[0].message.content

def read_prepared_qna(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    return content

# TODO: use groq later.

if __name__ == "__main__":

    resume_path = "data/Resume/Mukul_Resume.pdf"
    linkedin_path = "data/LinkedIn/Mukul_LI_Profile.pdf"
    questions_path = "data/QnA/Questions.txt"
    answers_path = "data/QnA/Mukul_Answers.txt"

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
    
    qa_list: QuestionAnswerList = QuestionAnswerList(question_answer_list=question_answer_list)


    # Example usage
    experiences: ExperienceList = parse_input(
        system_content="Extract the experiences from the resume.",
        user_content=merged_content,
        response_format=ExperienceList,
    )
    
    educations: EducationList = parse_input(
        system_content="Extract the educations from the resume.",
        user_content=merged_content,
        response_format=EducationList,
    )

    skills: SkillList = parse_input(
        system_content="Extract the skills from the resume.",
        user_content=merged_content,
        response_format=SkillList,
    )

    projects: ProjectList = parse_input(
        system_content="Extract the projects from the resume.",
        user_content=merged_content,
        response_format=ProjectList,
    )

    achievements: AchievementList = parse_input(
        system_content="Extract the achievements from the resume.",
        user_content=merged_content,
        response_format=AchievementList,
    )

    name: str = parse_input(
        system_content="Extract the name from the resume.",
        user_content=merged_content,
        response_format=str,
    )

    email: str = parse_input(
        system_content="Extract the email from the resume.",
        user_content=merged_content,
        response_format=str,
    )
    phone: str = parse_input(
        system_content="Extract the phone number from the resume.",
        user_content=merged_content,
        response_format=str,
    )
    location: str = parse_input(
        system_content="Extract the location from the resume.",
        user_content=merged_content,
        response_format=str,
    )




    user = User(
        name=name,
        email=email,
        phone=phone,
        location=location,
        experiences=experiences,
        educations=educations,
        skills=skills,
        projects=projects,
        achievements=achievements,
        questionAnswer=qa_list

    )


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
