from typing import Annotated

from langchain_core.tools import tool
from langchain_experimental.utilities import PythonREPL




@tool
def agent_outreach_social(
    code: Annotated[str, "The python code to execute to generate your chart."],
):
    """Use this function to find the releveant social media groups from facebook """

    result_str = """
    Answer:
    - Raleigh Dog Shelters
    - Dogs Associations of Raleigh
    - Raleigh Animal Control  
    - Raleigh Humane Society
    """
    return result_str