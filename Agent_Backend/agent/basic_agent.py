from typing import List, Type, TypeVar, Any
from pydantic import BaseModel
from openai import OpenAI


# Define a generic type variable
T = TypeVar("T", bound=BaseModel)

client: OpenAI = OpenAI()


def parse_input(
    system_content: str,
    user_content: str,
    response_format: Type[T],
    model: str = "gpt-4o-2024-08-06",
) -> T:
    """
    Generates a response from OpenAI based on the given inputs and model.

    Args:
        model (str): The OpenAI model to use for the completion.
        system_content (str): Content for the system role.
        user_content (str): Content for the user query.
        response_format (Type[T]): The class type of the response format (a Pydantic model).

    Returns:
        T: Parsed response from the completion in the type specified by response_format.
    """
    completion = client.beta.chat.completions.parse(
        model=model,
        messages=[
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_content},
        ],
        response_format=response_format,
    )

    if completion.choices[0].message.parsed is None:
        raise ValueError("Failed to parse response.")

    return completion.choices[0].message.parsed


def get_openai_text_response(
    system_prompt: str, user_prompt: str, model: str = "gpt-4o"
) -> str:
    client = OpenAI()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    if not response.choices[0].message.content:
        raise ValueError("Failed to generate response.")

    return response.choices[0].message.content


# TODO: use groq later.

if __name__ == "__main__":

    example_content = """
Contact
www.linkedin.com/in/eordax
(LinkedIn)

Top Skills
Artificial Intelligence (AI)
Machine Learning
MLOps

Languages
Español (Native or Bilingual)
Inglés (Native or Bilingual)

Certifications
AWS Certified Cloud Practitioner

Eduardo Ordax

Generative AI Lead @ AWS ☁️ | Startup Advisor | Public Speaker
Madrid, Community of Madrid, Spain

Summary
One of my favorite quotes that I strive to live by every day is, "To
give anything less than your best is to sacrifice the gift." In addition to
this guiding principle, I have a daily ritual that I cherish - rising early
in the morning to run a few miles, setting the tone for an energised
and productive day ahead."
With a strong technical foundation, I have over 15 years of extensive
experience in sales and business development. Throughout my
career, I've successfully led cross-functional teams and in recent
years, I've honed my expertise in Artificial Intelligence and Machine
Learning. In the ever-evolving landscape of AI and ML, organisations
are grappling with the need to accelerate their journey. To overcome
that, I work as the AI/ML Go to Market EMEA Lead at AWS, where I
assist customers around the world in harnessing the full potential of
Artificial Intelligence.
I am passionate about actively engaging in discussions surrounding
these topics and connecting with fellow professionals in the field to
exchange knowledge and experiences
I am a proud parent of two amazing children, whom I consider to be
among the most wonderful accomplishments in this world

Experience
Amazon Web Services (AWS)
2 years 4 months

Principal Go to Market Generative AI
June 2024 - Present (4 months)
Greater Madrid Metropolitan Area

Go to Market expert for AI & ML AWS services in EMEA. Responsible for
providing business and technical expertise to help our customers succeed.

Page 1 of 4

This involves leading the Go to Market for Generative AI, scaling activities with
other stakeholders and shaping the evolution of our AI Services and Products.

Principal MLOps EMEA

June 2022 - June 2024 (2 years 1 month)
EMEA
Responsible for building business and technical relationships with large
enterprises and operate as their trusted advisor, ensuring they get the most
out of the cloud at every stage of their journey in adopting Machine Learning
across their organisation.

Vodafone
General Manager AI

July 2020 - June 2022 (2 years)
Madrid y alrededores
The Analytics manager will lead the analytics strategy within Vodafone Group
across all the countries in order to:
Contribute to the creation, delivery and evolution of the insight strategy to
maximize the benefit of significant investment in data and business intelligence
tools.
Co-lead the development and delivery of a commercial roadmap of data
products and services.
Manage the definition and delivery of actionable insight for both Business-AsUsual activities and ad-hoc/project based initiatives.

Vodafone Business
Manager Big Data & Advanced Analytics
April 2019 - July 2020 (1 year 4 months)
Madrid Area, Spain

Lead the creation of advanced analytics products that provides actionable
business insights to Vodafone and its customers.
Identify opportunities to generate value internally and external customers
through the use of predictive models with large and varied datasets.
Optimise use of existing big data technology.
Contribute to the definition of the data monetisation strategy for enterprise
customers.

Vodafone
Manager Partners & Solutions

March 2014 - April 2019 (5 years 2 months)
Page 2 of 4

Madrid
Responsible for building, maintaining and managing sound relationships with
the customers through our team of Partners and Solution Selling Program.

Vodacom
Business Development Manager

May 2012 - March 2014 (1 year 11 months)
To help position Vodacom Business as a Mobile Solution Partner in
solving service delivery issues for corporate customers. Achievement of
sales objectives by identifying, creating and pursuing newrevenue growth
opportunities, within targeted customers.

Vodafone
4 years 3 months

Sales Support Specialist

January 2012 - May 2012 (5 months)
Sales support professionals work in the administration side of the business.
My job includes handling correspondence, reviewing and distributing sales
related documents, creating new sales opportunities, examine client accounts,
prepare and distribute financial and sales reports to advise team members.
They also assist sales teams with new ideas and suggestions to achieve their
targets.

key Account Manager

September 2008 - January 2012 (3 years 5 months)
Responsible for the management of the sales and relationship with strategic
customers.
To engage in a variety of tasks including project management, coordination,
strategic planning, relationship management, negotiation, leadership and
innovative development of opportunities. keeping record of transaction of sale
and purchase goods.

Pre-Sales Specialist

March 2008 - September 2008 (7 months)
To lead the development of sales propositions, researching sales markets,
creating sales plans that match specific market needs with Upstream’s
solutions. As well, responsible of building up existing sales collateral, to
present innovative and add value commercial proposals.

Thales
Page 3 of 4

Junior Programmer & Analyst

September 2007 - March 2008 (7 months)

Education
Universidad de Valladolid
Master Postgraduade: Marketing & Project Managment, Project
Management · (2008 - 2009)

Launchpad AI
Data Scientist Intensive Program (320h), Big Data & Analytics · (2019 - 2019)

University of Derby Corporate
Telecoms Mini MBA Programme, Technology and Business · (2013 - 2013)

Educational Testing Service (ETS)
Test of English for International Communication (TOEIC), English C1
Level · (2011 - 2011)

Katholieke Hogeschool Zuid-West Vlaanderen . Kortrijk
Final Project, Informatics · (2007 - 2007)

Page 4 of 4


"""
    # Define a sample response format class for math reasoning

    class Experience(BaseModel):
        title: str
        company: str
        location: str
        start_date: str
        end_date: str
        description: str
        reference_context: list[str]
        reasoning: str

    class Experiences(BaseModel):
        experiences: List[Experience]

    class MathReasoning(BaseModel):
        steps: List[str]
        result: str

    # Example usage
    experiences: Experiences = parse_input(
        system_content="You are a helpful math tutor. Guide the user through the solution step by step.",
        user_content="how can I solve 8x + 7 = -23",
        response_format=Experiences,
    )

    for i, experience in enumerate(experiences.experiences):
        print("Company", i + 1, experience.company)
        print("Title", i + 1, experience.title)
        print("Location", i + 1, experience.location)
        print("Start Date", i + 1, experience.start_date)
        print("End Date", i + 1, experience.end_date)

    # Example usage
    user_prompt = "What is the capital of France?"
    system_prompt = "You are a helpful assistant."
    result = get_openai_text_response(
        user_prompt=user_prompt, system_prompt=system_prompt
    )
    print(result)
