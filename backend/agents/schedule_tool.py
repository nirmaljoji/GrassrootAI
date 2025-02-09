from langchain.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
from langchain_community.chat_models import ChatPerplexity
import os
from dotenv import load_dotenv

_ = load_dotenv()

class ScheduleInput(BaseModel):
    name: str = Field(description="The name of the Event that is being conducted")

class ScheduleTool(BaseTool):
    name: str = "schedule_event"
    description: str = "Generates a detailed schedule with timelines for the given Event"
    args_schema: Type[BaseModel] = ScheduleInput
    
    def _run(self, name: str) -> str:
        """Generate a schedule with timelines for the given event details."""
        schedule_template = f"""Based on the event: {name}
                                Here is an example of a timeline for an event

                                - Venue Booking and Permits: 30 days
                                - Initial Announcement: 25 days
                                - Fundraising Campaign: 20 days
                                - Volunteer Recruitment: 15 days
                                - Social Media Outreach: 10 days
                                - Resource Procurement: 7 days
                                - Final Preparations: 3 days
                                - Event Day Setup: 1 day"""
        
        print("Using Perplexity for Scheduling")

        perplexity = ChatPerplexity(api_key=os.getenv('PERPLEXITY_API_KEY'), model="sonar-pro")
        response = perplexity.invoke(schedule_template)
        return response.content
    
    async def _arun(self, name: str) -> str:
        """Use this tool asynchronously."""
        raise NotImplementedError("Async not implemented")