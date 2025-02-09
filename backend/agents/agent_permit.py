import os
from dotenv import load_dotenv
from typing import Optional, Type
from pydantic import BaseModel, Field
from langchain.tools import BaseTool
from langchain_community.chat_models import ChatPerplexity

_ = load_dotenv()

class PermitInput(BaseModel):
    query: str = Field(
        description="The search query to determine required permits for an event"
    )

class PermitSearchTool(BaseTool):
    name: str = "permit_search"
    description: str = (
        "Useful for determining the exact permits required for an event "
        "(such as a blood donation drive, food drive, or park cleanup) "
        "using Perplexity AI."
    )
    args_schema: Type[BaseModel] = PermitInput

    def _run(self, query: str) -> str:
        """
        Use this tool to search for permits required for an event using Perplexity AI.
        It enhances the original query with instructions to list all the necessary permits,
        considering event-specific details such as date, time, and location.
        """
        enhanced_query = (
            f"{query}\n\n"
            "Please identify all required permits for the event. Consider details like date, time, "
            "and location. List each permit on a separate line with a brief description if applicable. "
            "For example, if the event is a blood donation drive or food drive, include any health department or "
            "temporary event permits that may be required."
        )
        print("Using Perplexity for permits")
        perplexity = ChatPerplexity(api_key=os.getenv('PERPLEXITY_API_KEY'), model="sonar-pro")
        response = perplexity.invoke(enhanced_query)
        return response.content

    async def _arun(self, query: str) -> str:
        """Asynchronous run is not implemented."""
        raise NotImplementedError("Async not implemented")