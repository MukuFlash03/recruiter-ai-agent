from pydantic import BaseModel


class RequiredSkill(BaseModel):
    name: str
    proficiency: str
    experience: int
    reference_context: list[str]
    tags: list[str]


class RequiredExpertise(BaseModel):
    name: str
    description: str
    reference_context: list[str]
    tags: list[str]


class RequiredPersonalityTrait(BaseModel):
    name: str
    description: str
    reference_context: list[str]
    tags: list[str]


class Question(BaseModel):
    question: str
    reference_context: list[str]
    tags: list[str]


class Questions(BaseModel):
    questions: list[Question]


class ExpectedAnswer(BaseModel):
    answer: str
    reference_context: list[str]
    tags: list[str]
