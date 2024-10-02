from supabase import create_client, Client
from typing import Union
from dotenv import load_dotenv
import os

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_ANON_KEY", "")

supabase: Client = create_client(url, key)

# def user_exists(key: str = "email", value: str = None):
#     user = supabase.from_("users").select("*").eq(key, value).execute()
#     return len(user.data) > 0

def get_candidate_profiles(candidate_id: Union[str, None] = None):
  try:
    if candidate_id is None:
      candidate_profiles = supabase\
          .table("candidate_profiles")\
          .select("*")\
          .execute()
      print(candidate_profiles)
      return candidate_profiles
    else:
      candidate_profile = supabase\
          .table("candidate_profiles")\
          .select("*")\
          .eq("candidate_id", candidate_id)\
          .execute()
      print(candidate_profile)
      return candidate_profile
  except Exception as e:
      print(f"Error: {e}")
      return {"message": "Candidate profile not found"}

def get_job_postings(job_id: Union[str, None] = None):
  try:
    if job_id is None:
      job_postings = supabase\
          .table("job_postings")\
          .select("*")\
          .execute()
      print(job_postings)
      return job_postings
    else:
      job_posting = supabase\
          .table("job_postings")\
          .select("*")\
          .eq("job_id", job_id)\
          .execute()
      print(job_posting)
      return job_posting
  except Exception as e:
      print(f"Error: {e}")
      return {"message": "Job posting not found"}
