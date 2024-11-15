from pydantic import BaseModel
from typing import Optional


class JobRecruiterID(BaseModel):
  recruiter_id: str
  job_id: str


class RelevantContext(BaseModel):
  yes_or_no: bool
  reasoning: str
  relevant_context: list[str]
