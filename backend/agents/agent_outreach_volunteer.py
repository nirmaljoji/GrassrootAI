from langchain.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field

class VolunteerOutreachInput(BaseModel):
    event_details: str = Field(description="The event details to include in the volunteer outreach email")

class VolunteerOutreachTool(BaseTool):
    name: str = "volunteer_outreach"
    description: str = "Generates a volunteer outreach email with event details and call to action"
    args_schema: Type[BaseModel] = VolunteerOutreachInput
    
    def _run(self, event_details: str) -> str:
        """Generate a volunteer outreach email with the given event details."""
        email_template = f"""
        Subject: Join Us! Volunteers Needed for Upcoming Community Event
        
        Body:
        Dear Community Members,

        We are excited to announce an upcoming event and we need your help to make it a success!

        Event Details:
        {event_details}

        Why Volunteer?
        - Make a positive impact in your community
        - Gain valuable experience
        - Meet like-minded individuals
        - Be part of something meaningful

        How to Sign Up:
        If you're interested in volunteering, please reply to this email with:
        1. Your name
        2. Contact information
        3. Any relevant experience
        4. Your availability

        Together, we can make this event a great success!

        Best regards,
        The Event Team
        """
        return email_template
    
    async def _arun(self, event_details: str) -> str:
        """Use this tool asynchronously."""
        raise NotImplementedError("Async not implemented")