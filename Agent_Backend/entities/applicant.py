from pydantic import BaseModel


class Experience(BaseModel):
    title: str
    company: str
    location: str
    start_date: str
    end_date: str
    description: str
    reference_context: list[str]
    reasoning: str

class Experiences(BaseModel):
    experiences: list[Experience]
class Skill(BaseModel):
    name: str
    proficiency: str
    experience: int
    reference_context: list[str]


class Expertise(BaseModel):
    name: str
    description: str
    reference_context: list[str]


class Achievement(BaseModel):
    title: str
    description: str
    reference_context: list[str]


class PersonalityTrait(BaseModel):
    name: str
    description: str
    reference_context: list[str]


class CodingCulture(BaseModel):
    name: str
    description: str
    reference_context: list[str]


class User(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    experience: list[Experience]
    skills: list[Skill]
    expertise: list[Expertise]
    achievements: list[Achievement]
    personality_traits: list[PersonalityTrait]
    coding_culture: list[CodingCulture]
    reference_context: list[str]
    reasoning: str
    user_id: str
    user_type: str
