from langchain.tools import BaseTool
from typing import Optional, Type
from pydantic import BaseModel, Field
from langchain_community.chat_models import ChatPerplexity
import os
from dotenv import load_dotenv

_ = load_dotenv()

class OutreachSocialInput(BaseModel):
    name: str = Field(description="The name of the Event that is being conducted")
    location: str = Field(description="The location of the Event that is being conducted")

class OutreachSocialTool(BaseTool):
    name: str = "event_search"
    location: str = "Location of the Event"
    description: str = "Useful for searching information online using Perplexity AI using Event Name and Location"
    args_schema: Type[BaseModel] = OutreachSocialInput
    
    def _run(self, name: str, location: str) -> str:
        """Use this tool to search for information using Perplexity AI."""

        enhanced_query = f"Can you return the Facebook group names that are relevant to post if i am conducting a {name} camp in {location}. List out only the group names and nothing else"
            
        print("Using Perplexity" + enhanced_query)

        perplexity = ChatPerplexity(api_key=os.getenv('PERPLEXITY_API_KEY'), model="sonar-pro")
        response = perplexity.invoke(enhanced_query)
        return response.content
    
    async def _arun(self, query: str) -> str:
        """Use this tool asynchronously."""
        raise NotImplementedError("Async not implemented")