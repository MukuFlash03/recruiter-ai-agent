from pydantic import BaseModel
from typing import Optional


class JobRecruiterID(BaseModel):
  recruiter_id: str
  job_id: str
