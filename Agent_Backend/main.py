from fastapi import FastAPI, BackgroundTasks, HTTPException, Request
from typing import Dict, Any, Union
from db.operations import get_candidate_profiles, get_job_postings, get_interview_data
from db.helpers import \
  organize_interview_data, \
  get_org_interviews_data, \
  organize_job_postings_data, \
  get_org_job_postings, \
  organize_candidate_profiles, \
  get_org_candidate_profiles

import sys
import os

current_file_path = os.path.abspath(__file__)
parent_directory = os.path.dirname(os.path.dirname(current_file_path))
sys.path.append(parent_directory)
sys.path.append(f"{parent_directory}/Agent_Backend")
sys.path.append(f"{parent_directory}/Agent_Backend/agent")

from agent.test_basic_agent import get_user_info
from agent.workflow import end_to_end_agent

app = FastAPI()


# Function to be run in the background
def background_task(message: str) -> None:
    """
    A simple background task that simulates some processing.
    """
    print(f"Processing background task with message: {message}")


# Asynchronous route with background task
from typing import List, Any
from fastapi import FastAPI
import asyncio
from pydantic import BaseModel

app = FastAPI()


class Questions(BaseModel):
    questions: list[str]


# @app.post("/analyze_candidates")
# async def analyze_candidates(request: Request, questions: Questions) -> Any:
#     """
#     An asynchronous API route that processes a list of questions.
#     """
#     # Simulate some async processing
#     await asyncio.sleep(1)  # Simulate IO-bound operation

#     return_json = await end_to_end_agent(all_questions=questions.questions)
#     # Example response, you can replace this with actual processing

#     return return_json


@app.get("/get_candidate_profiles")
async def getCandidateProfiles(
    candidate_id: Union[str, None] = None
) -> Union[Dict[str, Any], Any]:  
    """
    Retrieve candidate profiles information from the database.
    """
    print("Inside getCandidateProfiles FastAPI route")
    # candidates = get_candidate_profiles(candidate_id)
    candidates_data, organized_candidate_profiles, keys_list = get_candidate_profiles(candidate_id)
    print("Candidates data:")
    print(candidates_data)
    
    print("Organized candidate profiles:")
    print(organized_candidate_profiles)

    print("Organized candidate profiles keys:")
    print(keys_list)

    return candidates_data

@app.get("/get_job_postings")
async def getJobPostings(
    recruiter_id: str,
    job_id: Union[str, None] = None
) -> Union[Dict[str, Any], Any]:  
# async def get_candidates(user_id: str) -> Dict[str, Any]:
    """
    Retrieve job postings information from the database.
    """
    # job_postings_data = get_job_postings(recruiter_id, job_id)
    job_postings_data, organized_job_postings = get_job_postings(recruiter_id, job_id)
    
    print("Job postings data:")
    print(job_postings_data)

    print("Organized job postings:")
    print(organized_job_postings)
    
    return job_postings_data

@app.get("/get_interviews_data")
async def getInterviewData(
    recruiter_id: str,
    job_id: Union[str, None] = None,
    candidate_id: Union[str, None] = None
) -> Union[Dict[str, Any], Any]:  

    """
    Retrieve interview data for candidates information from the database.
    """
    interviews_data, organized_interviews = get_interview_data(recruiter_id, job_id, candidate_id)
  
    print("Interviews data:")
    print(interviews_data)

    print("Organized interviews:")
    print(organized_interviews)

    return interviews_data

@app.get("/get_candidates_analysis")
async def getCandidatesAnalysis(
    recruiter_id: str,
    job_id: str,
) -> Union[Dict[str, Any], Any]:
    """
    An asynchronous API route that processes a list of questions.
    """
    # Simulate some async processing
    await asyncio.sleep(1)  # Simulate IO-bound operation

    return_json = await end_to_end_agent(recruiter_id, job_id)
    # Example response, you can replace this with actual processing

    return return_json














# Synchronous route with background task
@app.get("/sync_with_background", response_model=Dict[str, str])
def sync_with_background(
    message: str, background_tasks: BackgroundTasks
) -> Dict[str, str]:
    """
    A synchronous API route that starts a background task.
    """
    background_tasks.add_task(background_task, message)
    return {"message": "Sync call with background task started"}


# Asynchronous route with background task
@app.get("/async_with_background", response_model=Dict[str, str])
async def async_with_background(
    message: str, background_tasks: BackgroundTasks
) -> Dict[str, str]:
    """
    An asynchronous API route that starts a background task.
    """
    background_tasks.add_task(background_task, message)
    return {"message": "Async call with background task started"}


# Error handling route with background task (sync)
@app.get("/sync_with_background/error", response_model=Dict[str, str])
def sync_with_background_error(background_tasks: BackgroundTasks) -> Dict[str, str]:
    """
    A synchronous route that raises an error but still starts a background task.
    """
    background_tasks.add_task(background_task, "Task despite error")
    raise HTTPException(
        status_code=400, detail="Sync error occurred with background task."
    )


# Error handling route with background task (async)
@app.get("/async_with_background/error", response_model=Dict[str, str])
async def async_with_background_error(
    background_tasks: BackgroundTasks,
) -> Dict[str, str]:
    """
    An asynchronous route that raises an error but still starts a background task.
    """
    background_tasks.add_task(background_task, "Task despite error")
    raise HTTPException(
        status_code=400, detail="Async error occurred with background task."
    )