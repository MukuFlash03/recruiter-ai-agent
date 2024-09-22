# Workflow

# For each question asked by the Recruiter
# Check user experiences.
# Get the relevant experiences
# First agent should say if this is relevant or not.
# Second agent should answer the question.
# You also add the reference context you obtained from the question.


#
from typing import Any
from basic_agent import (
    parse_input_async,
    parse_input,
    groq_text,
    get_openai_text_response,
    get_openai_text_response_async,
)
import asyncio
from test_basic_agent import (
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


async def check_relevance(question: str, model_object: Any):
    system_prompt = """I am providing you with some details about a candidate for a job. 
    I will provide you with a question and also with some context about the candidate.
    I want you to tell if that experience is relevant or not. 
    
    The context of the user might be potentially provided in Json format.

    If it is relevant: then I want you to provide the reasoning why it is relevant.
    Then also give the relevant context why it is relevant.

    If it is not relevant: then I want you to provide the reasoning
    why it is not relevant.
    """

    user_prompt = (
        f"Question:\n{question} \n\n Candidate Context:{model_object.model_dump_json()}"
    )

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
    Candidate will third person. 
    """


async def get_all_relevant_contents(
    user_profile_list: list[Any], input_questions: list[str]
):
    relevant_contexts = []
    # TODO: Run Async here
    for user_profile_chunk in user_profile_list:
        for input_question in input_questions:
            relevance = await check_relevance(
                question=input_question, model_object=user_profile_chunk
            )
            if relevance.yes_or_no:
                relevant_contexts.append(relevance)


async def select_candidate(user_profile_list: list[Any], input_questions: list[str]):

    relevant_contexts = await get_all_relevant_contents(
        user_profile_list, input_questions
    )

    # TODO: Another agent that based on the relevant context say if the candidate
    # is selected for next round or not.


async def candidate_agents_answer(user_profile: list[Any], input_questions: list[str]):
    for input_question in input_questions:
        relevant_contents = await get_all_relevant_contents(
            user_profile_list=user_profile, input_questions=[input_question]
        )

    # TODO: Another agent to answer the question


if __name__ == "__main__":
    experiences, educations, skills, projects, achievements, personal_details = (
        asyncio.run(get_user_info())
    )

    pass
