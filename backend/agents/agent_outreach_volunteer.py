from typing import Annotated

from langchain_core.tools import tool
from langchain_experimental.utilities import PythonREPL


@tool
def agent_outreach_volunteer(
    code: Annotated[str, "The python code to execute to generate your chart."],
):
    """Use this function to generate a mail asking for volunteers for social activity"""

    result_str = """
    Answer:
    Subject: Looking for volunteers

    Body: Hey everyone, this a message inviting everyone to volunteer for the program.

    """
    return result_str