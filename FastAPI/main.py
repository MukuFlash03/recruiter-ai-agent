from fastapi import FastAPI, BackgroundTasks, HTTPException, Request
from typing import Dict, Any, Union
from db.operations import get_candidate_profiles, get_job_postings

import sys
import os

current_file_path = os.path.abspath(__file__)
parent_directory = os.path.dirname(os.path.dirname(current_file_path))
sys.path.append(parent_directory)
sys.path.append(f"{parent_directory}/Agent_Backend")
sys.path.append(f"{parent_directory}/Agent_Backend/agent")

from Agent_Backend.agent.test_basic_agent import get_user_info
from Agent_Backend.agent.workflow import end_to_end_agent

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


@app.post("/analyze_candidates")
async def analyze_candidates(request: Request, questions: Questions) -> Any:
    """
    An asynchronous API route that processes a list of questions.
    """
    # Simulate some async processing
    await asyncio.sleep(1)  # Simulate IO-bound operation

    return_json = await end_to_end_agent(all_questions=questions.questions)
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

@app.get("/candidates")
async def get_candidates(candidate_id: Union[str, None] = None) -> Union[Dict[str, Any], Any]:  
    """
    Retrieve candidate profiles information from the database.
    """
    candidates = get_candidate_profiles(candidate_id)
    if candidates is None:
        raise HTTPException(status_code=404, detail="Candidates data not found")
    return candidates

@app.get("/jobs")
async def get_jobs(job_id: Union[str, None] = None) -> Union[Dict[str, Any], Any]:  
# async def get_candidates(user_id: str) -> Dict[str, Any]:
    """
    Retrieve job postings information from the database.
    """
    jobs = get_job_postings(job_id)
    if jobs is None:
        raise HTTPException(status_code=404, detail="Jobs data not found")
    return jobs
