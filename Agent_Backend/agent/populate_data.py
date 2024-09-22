import sys
import os

current_file_path = os.path.abspath(__file__)
parent_directory = os.path.dirname(os.path.dirname(current_file_path))
sys.path.append(parent_directory)

from agent import basic_agent  # type: ignore
from entities import recruiter  # type: ignore
from entities import applicant  # type: ignore
