# Recruit AI Agentic Platform

<img width="1439" alt="Screenshot 2024-12-03 at 5 49 47 PM" src="https://github.com/user-attachments/assets/57aa91e1-e515-4a08-bc8e-a92911de1751">

-------

The workflow

A. Recruiter workflow

```mermaid

graph TD
    R[Recruiter] 
    JD[Job Description]
    QR[Questions]
    Req[Job Requirements]
    GQ[Generated questions]
    Characteristics
    Personality
    Skills
    R --> JD
    R --> QR
    R --> Req
    Req --> GQ
    JD --> GQ
    plus[add]
    QR --> plus
    GQ --> plus
    R --> Characteristics --> GQ
    R --> Personality --> GQ
    R --> Skills --> GQ
    plus --> Questions
    Questions --> RecruiterAgent

```

B. Candidate workflow

```mermaid

graph TD
    C[Candidate] 
    Profile
    Resume
    Linkedin
    C --> Profile
    C --> Resume
    C --> LinkedIn
    C --> QuestionsAnswers
    ApplicantAgent
    Profile --> ApplicantAgent
    Resume --> ApplicantAgent
    LinkedIn --> ApplicantAgent
    QuestionsAnswers --> ApplicantAgent
    ApplicantAgent --> U[Understand Skills Etc]
    ApplicantAgent --> U1[Understand Personality]
    ApplicantAgent --> U2[Understand Characteristics]
    CombineInformation
    U --> CombineInformation
    U1 --> CombineInformation
    U2 --> CombineInformation
    CombineInformation 
    QuestionsFromRecruiter
    ApplicantAgent2[ApplicantAgent]
    QuestionsFromRecruiter --> ApplicantAgent2
    CombineInformation --> ApplicantAgent2
    ApplicantAgent2 --> Answers
    ApplicantAgent2 --> Reasoning
    ApplicantAgent2 --> ReferenceContextForReasoning[Reference Context For Reasoning]
    ApplicantAgent2 --> Reranking[Reranking]
    

```

-------

Screenshots:

#### A. Recruiters

1. Recruiter Dashboard

<img width="1439" alt="Screenshot 2024-12-03 at 5 59 14 PM" src="https://github.com/user-attachments/assets/decbe337-9493-4167-a0e6-bc7d2e84d17a">

----------

2. Candidate Evaluation

<img width="1439" alt="Screenshot 2024-12-03 at 5 59 32 PM" src="https://github.com/user-attachments/assets/db2813cd-c18e-4436-a1d9-db6cc8431c0a">

-------

3. Candidate Comparison

<img width="819" alt="Screenshot 2024-12-03 at 6 00 09 PM" src="https://github.com/user-attachments/assets/38ebf31a-492d-4e30-94cc-59b6b8bd5ada">

-------

#### B. Candidates

1. Candidate Dashboard

<img width="1439" alt="Screenshot 2024-12-03 at 6 00 42 PM" src="https://github.com/user-attachments/assets/0536744f-435c-45ff-84c6-6ff84021b83e">

---------

2. Candidate Profile

<img width="1439" alt="Screenshot 2024-12-03 at 6 01 00 PM" src="https://github.com/user-attachments/assets/28ff8b93-10a2-4948-8202-ad3927023182">


-------

3. Interview Process

<img width="702" alt="Screenshot 2024-12-03 at 6 01 22 PM" src="https://github.com/user-attachments/assets/54d96e49-8696-426f-8c4a-73970df8ae08">



   















