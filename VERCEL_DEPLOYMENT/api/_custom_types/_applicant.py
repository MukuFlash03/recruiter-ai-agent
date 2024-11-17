from pydantic import BaseModel


class Education(BaseModel):
    degree: str
    institution: str
    start_date: str
    end_date: str
    grade: str
    reference_context: list[str]
    tags: list[str]


class EducationList(BaseModel):
    education: list[Education]
    tags: list[str]


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
    tags: list[str]


class ExperienceList(BaseModel):
    experiences: list[Experience]
    tags: list[str]


class SkillList(BaseModel):
    name: list[str]
    reference_context: list[str]
    tags: list[str]


class Project(BaseModel):
    name: str
    description: str
    start_date: str
    end_date: str
    reference_context: list[str]
    skills: list[str]
    tags: list[str]


class ProjectList(BaseModel):
    projects: list[Project]
    tags: list[str]


class Achievement(BaseModel):
    title: str
    description: str
    reference_context: list[str]
    tags: list[str]


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


# DO NOT USE THIS FOR NOW. Directly output each stuff as model_dump()
class User(BaseModel):
    personal_details: PersonalDetails
    experience: ExperienceList
    skills: SkillList
    achievements: AchievementList
    projects: ProjectList
    education: EducationList
    questionAnswer: QuestionAnswerList
