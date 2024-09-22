from typing import List, Type, TypeVar, Any
from pydantic import BaseModel
from openai import OpenAI
import PyPDF2
import sys
import os

current_file_path = os.path.abspath(__file__)
parent_directory = os.path.dirname(os.path.dirname(current_file_path))
sys.path.append(parent_directory)


# Define a generic type variable
T = TypeVar("T", bound=BaseModel)

client: OpenAI = OpenAI()


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


# TODO: use groq later.

if __name__ == "__main__":
    pass
