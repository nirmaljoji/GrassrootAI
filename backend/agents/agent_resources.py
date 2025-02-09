from typing import Annotated

from langchain_core.tools import tool
from langchain_experimental.utilities import PythonREPL




@tool
def agent_resources(
    code: Annotated[str, "The python code to execute to generate your chart."],
):
    """Use this function to decise what all resources and items are needed to conduct a resource"""

    result_str = """
    Answer:
    - Food Facility Health Permit 
    - Food Handlers License (North Carolina Food Handler Card) 
    - Seller's Permit 
    - Food collection containers 
    - Refrigeration equipment for perishable items 
    - Sorting and packaging materials 
    - Vehicles for food pickup and delivery 
    - Warehouse or storage facility 
    - Volunteers for food collection, sorting, and distribution 
    - Drivers with valid licenses for pickup and delivery 
    - Staff trained in food safety procedures 
    - Adherence to food safety guidelines and regulations 
    - Compliance with health department standards
    """
    return result_str