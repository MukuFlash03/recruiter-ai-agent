from supabase import create_client, Client
from typing import Union, Dict, Any, List, Tuple, Set
from fastapi import HTTPException
from dotenv import load_dotenv
import os
from db.helpers import \
  organize_interview_data, \
  get_org_interviews_data, \
  organize_job_postings_data, \
  get_org_job_postings, \
  organize_candidate_profiles, \
  get_org_candidate_profiles
from custom_types import RelevantContext

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
# key: str = os.environ.get("SUPABASE_ANON_KEY", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client = create_client(url, key)

# def user_exists(key: str = "email", value: str = None):
#     user = supabase.from_("users").select("*").eq(key, value).execute()
#     return len(user.data) > 0

def get_candidate_profiles(
    candidate_id: Union[str, None] = None
) -> Tuple[List[Dict[str, Any]] | None, Dict[str, Dict[str, Any]], List[str]]:
  try:
    candidates_data: List[Dict[str, Any]] | None = []
    if candidate_id is None:
      candidate_profiles = supabase\
          .table("candidate_profiles")\
          .select("*")\
          .execute()
      print(candidate_profiles)
      candidates_data = candidate_profiles.data
      # return candidate_profiles.data
    else:
      candidate_profiles = supabase\
          .table("candidate_profiles")\
          .select("*")\
          .eq("candidate_id", candidate_id)\
          .execute()
      print(candidate_profiles)
      candidates_data = candidate_profiles.data
      # return candidate_profiles.data
    
    if candidates_data is None:
        raise HTTPException(status_code=404, detail="Candidates data not found")

    organized_candidate_profiles: Dict[str, Dict[str, Any]] = organize_candidate_profiles(candidates_data)
    print("\n\nOrganized candidate profiles:")
    print(organized_candidate_profiles)

    print("\n\nOrganized candidate profiles keys:")
    keys_list = list(organized_candidate_profiles.keys())
    print(keys_list)

    return candidates_data, organized_candidate_profiles, keys_list
  except Exception as e:
      print(f"message: Candidate profile not found; Error: {e}")
      return None, {}, []

def get_job_postings(
    recruiter_id: str,
    job_id: Union[str, None] = None
) -> Tuple[List[Dict[str, Any]] | None, Dict[str, Dict[str, Dict[str, Any]]]]:
  try:
    job_postings_data: List[Dict[str, Any]] | None = []
    if job_id is None:
      job_postings = supabase\
          .table("job_postings")\
          .select("*")\
          .eq("recruiter_id", recruiter_id)\
          .execute()
      # print(job_postings)
      job_postings_data = job_postings.data
      # return job_postings.data
    else:
      job_postings = supabase\
          .table("job_postings")\
          .select("*")\
          .eq("recruiter_id", recruiter_id)\
          .eq("job_id", job_id)\
          .execute()
      # print(job_postings)
      job_postings_data = job_postings.data
      # return job_postings.data
    
    if job_postings_data is None:
        raise HTTPException(status_code=404, detail="Jobs data not found")
    
    print("\n\nJob postings data in supabase get job postings operations:")
    print(job_postings_data)
    
    organized_job_postings = organize_job_postings_data(job_postings_data)
    print("\n\nOrganized job postings:")
    print(organized_job_postings)

    return job_postings_data, organized_job_postings
  except Exception as e:
      print(f"message: Job posting not found; Error: {e}")
      return None, {}

def get_interview_data(
    recruiter_id: str,
    job_id: Union[str, None] = None,
    candidate_id: Union[str, None] = None
) -> Tuple[List[Dict[str, Any]] | None, Dict[str, Dict[str, Dict[str, Any]]]]:
  try:
    interviews_data: List[Dict[str, Any]] | None = []
    
    if candidate_id is None and job_id is None:
      print("candidate_id and job_id are None")
      interviews_data_db = supabase\
          .table("interviews")\
          .select("*")\
          .eq("recruiter_id", recruiter_id)\
          .execute()
      print(interviews_data_db)
      interviews_data = interviews_data_db.data
      # return interviews_data_db.data
    elif job_id is not None and candidate_id is None:
      print("job_id is not None")
      interviews_data_db = supabase\
          .table("interviews")\
          .select("*")\
          .eq("recruiter_id", recruiter_id)\
          .eq("job_id", job_id)\
          .execute()
      print(interviews_data_db)
      interviews_data = interviews_data_db.data
      # return interviews_data_db.data
    elif candidate_id is not None and job_id is None:
      print("\n\ncandidate_id is not None")
      interviews_data_db = supabase\
          .table("interviews")\
          .select("*")\
          .eq("recruiter_id", recruiter_id)\
          .eq("candidate_id", candidate_id)\
          .execute()
      print(interviews_data_db)
      interviews_data = interviews_data_db.data
      # return interviews_data_db.data
    else:
      print("\n\ncandidate_id and job_id are not None")
      interviews_data_db = supabase\
          .table("interviews")\
          .select("*")\
          .eq("recruiter_id", recruiter_id)\
          .eq("job_id", job_id)\
          .eq("candidate_id", candidate_id)\
          .execute()
      print(interviews_data_db)
      interviews_data = interviews_data_db.data
      # return interviews_data_db.data
    
    if interviews_data is None:
        raise HTTPException(status_code=404, detail="Interviews data not found")

    organized_interviews: Dict[str, Dict[str, Dict[str, Any]]] = organize_interview_data(interviews_data)
    # print(organized_interviews)

    return interviews_data, organized_interviews

  except Exception as e:
      print(f"message: Interview data not found; Error: {e}")
      return None, {}

def insert_interviews_data(
    candidate_selection_json: Dict[str, Any]
):
  print("\n\nInside insert_interviews_data function")
  try:
    candidate_ids = list(candidate_selection_json.keys())

    for candidate_id in candidate_ids:
      print("\n\nInside for loop for candidate_id: ", candidate_id)
      
      candidate_selection_data: Dict[str, Any] = candidate_selection_json[candidate_id]

      selected: bool = candidate_selection_data["candidate_selection"]["selected"]
      print("selected: ", selected)
      print()

      reasoning_summary: str =  candidate_selection_data["candidate_selection"]["reasoning"]
      print("reasoning_summary: ", reasoning_summary)
      print()

      match_pct: str = candidate_selection_data["candidate_selection"]["match_pct"]
      print("match_pct: ", match_pct)
      print()

      recruiter_id: str = candidate_selection_data["ids"]["recruiter_id"]
      print("recruiter_id: ", recruiter_id)
      print()

      job_id: str = candidate_selection_data["ids"]["job_id"]
      print("job_id: ", job_id)
      print()

      answers: List[Dict[str, Any]] = candidate_selection_data["custom_answers"]
      print("answers: ", answers)
      print()

      custom_answers: List[str] = []
      for answer in answers:
         custom_answers.append(answer["answer"])
      print("custom_answers: ", custom_answers)
      print()

      print("*"*100)

      relevant_contexts: List[List[RelevantContext]] = candidate_selection_data["relevant_contexts"]
      print("relevant_contexts: ", relevant_contexts)
      print()
      print("*"*100)

      answer_contexts: Dict[str, List[RelevantContext]] = {}
      ctx_idx = 1
      for relevant_context in relevant_contexts:
         answer_contexts[str(ctx_idx)] = relevant_context

      response = (
          supabase.table("interviews")
          .upsert({ 
            "candidate_id": candidate_id,
            "recruiter_id": recruiter_id,
            "job_id": job_id,
            "interview_decision": selected,
            "reasoning_summary": reasoning_summary,
            "match_pct": match_pct,
            "custom_answers": custom_answers,
            "relevant_contexts": answer_contexts,
          },
          on_conflict ="recruiter_id, job_id, candidate_id"
          )
          .execute()
      )

      # response = (
      #   supabase.table("interviews")
      #   .insert({
      #     "candidate_id": candidate_id,
      #     "recruiter_id": recruiter_id,
      #     "job_id": job_id,
      #     "interview_decision": selected,
      #     "reasoning_summary": reasoning_summary,
      #     "match_pct": match_pct,
      #     "custom_answers": custom_answers,
      #     "relevant_contexts": answer_contexts,
      #   })
      #   .execute()
      # )
  
    return response
  except Exception as e:
      print(f"message: Candidate profile not found; Error: {e}")
      return None, {}, []
