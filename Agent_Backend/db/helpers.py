from typing import Dict, Any, List, Union

def organize_interview_data(interviews_data: List[Dict[str, Any]]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
    organized_data = {}
    
    for interview in interviews_data:
        recruiter_id = interview['recruiter_id']
        candidate_id = interview['candidate_id']
        
        if recruiter_id not in organized_data:
            organized_data[recruiter_id] = {}
        
        if candidate_id not in organized_data[recruiter_id]:
            organized_data[recruiter_id][candidate_id] = []
        
        organized_data[recruiter_id][candidate_id].append(interview)
    
    return organized_data

def get_org_interviews_data(organized_data: Dict[str, Dict[str, List[Dict[str, Any]]]], 
                   recruiter_id: str, 
                   candidate_id: str) -> List[Dict[str, Any]]:
    return organized_data.get(recruiter_id, {}).get(candidate_id, [])

def organize_job_postings_data(job_postings_data: List[Dict[str, Any]]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
    organized_data = {}
    
    for job_posting in job_postings_data:
        recruiter_id = job_posting['recruiter_id']
        job_id = job_posting['job_id']
        
        if recruiter_id not in organized_data:
            organized_data[recruiter_id] = {}
        
        if job_id not in organized_data[recruiter_id]:
            organized_data[recruiter_id][job_id] = []
        
        organized_data[recruiter_id][job_id].append(job_posting)
    
    return organized_data

def get_org_job_postings(organized_data: Dict[str, Dict[str, List[Dict[str, Any]]]], 
                   recruiter_id: str, 
                   job_id: str) -> List[Dict[str, Any]]:
    return organized_data.get(recruiter_id, {}).get(job_id, [])


def organize_candidate_profiles(candidate_profiles: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    organized_data = {}
    
    for profile in candidate_profiles:
        candidate_id = profile['candidate_id']
        
        if candidate_id not in organized_data:
            organized_data[candidate_id] = []
        
        organized_data[candidate_id] = (profile)
    
    return organized_data

def get_org_candidate_profiles(
    organized_data: Dict[str, List[Dict[str, Any]]], 
    candidate_id: str
) -> List[Dict[str, Any]]:
    return organized_data.get(candidate_id, [])