import os
import PyPDF2
import json
import re
from groq import Groq

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.
    
    :param file_path: Path to the PDF file
    :return: Extracted text content
    """
    text = ""
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

def extract_json_from_text(text: str) -> str:
    """
    Extract JSON content from a string that may contain additional text.
    
    :param text: The input text that may contain JSON
    :return: Extracted JSON string
    """
    json_match = re.search(r'```json\n(.*?)```', text, re.DOTALL)
    if json_match:
        return json_match.group(1)
    else:
        # If no JSON block is found, try to find content between the first and last curly braces
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json_match.group(0)
    raise ValueError("No valid JSON found in the text")

def parse_document(document_text, document_type):
    """
    Parse the document text using Groq API.
    
    :param document_text: The text content of the document
    :param document_type: Type of document ('resume' or 'linkedin')
    :return: Parsed document information
    """
    prompt = f"""
    Parse the following {document_type} and extract key information:

    {document_text}

    Return the extracted information as a JSON object with the following structure:
    {{
        "personal_info": {{"name": "", "email": "", "phone": ""}},
        "work_experience": [
            {{"company": "", "position": "", "duration": "", "responsibilities": []}}
        ],
        "education": [
            {{"degree": "", "institution": "", "year": ""}}
        ],
        "skills": [],
        "projects": [
            {{"name": "", "description": "", "technologies": []}}
        ],
        "achievements": [],
        "extracurriculars": []
    }}
    """
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an expert at parsing resumes and professional documents."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama3-8b-8192",
    )
    
    # print(chat_completion.choices[0].message.content)
    # return chat_completion.choices[0].message.content
    # return json.loads(chat_completion.choices[0].message.content)

    response_content = chat_completion.choices[0].message.content
    print("Raw API response:", response_content)  # For debugging
    
    try:
        json_content = extract_json_from_text(response_content)
        return json.loads(json_content)
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Attempted to parse: {json_content}")
        raise
    except ValueError as e:
        print(f"Value Error: {e}")
        print(f"Full response: {response_content}")
        raise

def parse_qa_file(file_path):
    """
    Parse a Q&A file and extract questions and answers.
    
    :param file_path: Path to the Q&A text file
    :return: List of dictionaries containing questions and answers
    """
    qa_list = []
    current_question = ""
    current_answer = ""
    
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()
            if line.startswith("Q:"):
                if current_question and current_answer:
                    qa_list.append({"question": current_question, "answer": current_answer})
                current_question = line[2:].strip()
                current_answer = ""
            elif line.startswith("A:"):
                current_answer = line[2:].strip()
            elif line == "-----------------" or not line:
                if current_question and current_answer:
                    qa_list.append({"question": current_question, "answer": current_answer})
                    current_question = ""
                    current_answer = ""
            else:
                current_answer += " " + line

    if current_question and current_answer:
        qa_list.append({"question": current_question, "answer": current_answer})
    return qa_list

def process_candidate_data(resume_path, linkedin_path, qa_path):
    """
    Process all candidate data: resume, LinkedIn profile, and Q&A.
    
    :param resume_path: Path to the resume PDF
    :param linkedin_path: Path to the LinkedIn profile PDF
    :param qa_path: Path to the Q&A text file
    :return: Processed candidate data
    """
    # Extract and parse resume
    resume_text = extract_text_from_pdf(resume_path)
    resume_data = parse_document(resume_text, "resume")
    
    # Extract and parse LinkedIn profile
    linkedin_text = extract_text_from_pdf(linkedin_path)
    linkedin_data = parse_document(linkedin_text, "linkedin")
    
    # Parse Q&A
    qa_data = parse_qa_file(qa_path)
    
    # Combine all data
    candidate_profile = {
        "resume": resume_data,
        "linkedin": linkedin_data,
        "qa_responses": qa_data
    }
    
    return candidate_profile

# Example usage
resume_path = "data/Resume/Mukul_Resume.pdf"
linkedin_path = "data/LinkedIn/Mukul_LI_Profile.pdf"
qa_path = "data/QnA/Mukul_QnA.txt"

resume_content = extract_text_from_pdf(resume_path)
linkedin_content = extract_text_from_pdf(linkedin_path)

print("*" * 50)
print("Resume Content:")
print(parse_document(resume_content, "resume"))
print("*" * 50)
print("LinkedIn Content:")
print(parse_document(linkedin_content, "linkedin"))
print("*" * 50)
print("QnA Content:")
print(parse_qa_file(qa_path))

candidate_data = process_candidate_data(resume_path, linkedin_path, qa_path)
print(json.dumps(candidate_data, indent=2))

output_file_path = "data/Scraped/candidate_data.json"
with open(output_file_path, "w") as json_file:
    json.dump(candidate_data, json_file, indent=2)

print(f"Candidate data has been saved to {output_file_path}")

