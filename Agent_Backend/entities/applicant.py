from pydantic import BaseModel


class Education(BaseModel):
    degree: str
    institution: str
    start_date: str
    end_date: str
    grade: str
    reference_context: list[str]


class EducationList(BaseModel):
    education: list[Education]


class Experience(BaseModel):
    title: str
    company: str
    location: str
    start_date: str
    end_date: str
    description: str
    reference_context: list[str]
    reasoning: str
    skills: list[str]


class ExperienceList(BaseModel):
    experiences: list[Experience]


class SkillList(BaseModel):
    name: list[str]
    reference_context: list[str]


class Project(BaseModel):
    name: str
    description: str
    start_date: str
    end_date: str
    reference_context: list[str]
    skills: list[str]


class ProjectList(BaseModel):
    projects: list[Project]


class Achievement(BaseModel):
    title: str
    description: str
    reference_context: list[str]


class AchievementList(BaseModel):
    achievements: list[Achievement]


class QuestionAnswer(BaseModel):
    question: str
    answer: str


class QuestionAnswerList(BaseModel):
    question_answer_list: list[QuestionAnswer]


class PersonalDetails(BaseModel):
    name: str
    email: str
    phone: str
    location: str


class User(BaseModel):
    personal_details: PersonalDetails
    experience: list[Experience]
    skills: SkillList
    achievements: list[Achievement]
    projects: list[Project]
    education: list[Education]
    questionAnswer: list[QuestionAnswerList]
