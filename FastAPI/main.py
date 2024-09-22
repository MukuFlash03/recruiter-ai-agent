from fastapi import FastAPI, BackgroundTasks, HTTPException
from typing import Dict

import sys
import os

current_file_path = os.path.abspath(__file__)
parent_directory = os.path.dirname(os.path.dirname(current_file_path))
sys.path.append(parent_directory)
sys.path.append(f"{parent_directory}/Agent_Backend")
sys.path.append(f"{parent_directory}/Agent_Backend/agent")

from Agent_Backend.agent.test_basic_agent import get_user_info

app = FastAPI()


# Function to be run in the background
def background_task(message: str) -> None:
    """
    A simple background task that simulates some processing.
    """
    print(f"Processing background task with message: {message}")


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
