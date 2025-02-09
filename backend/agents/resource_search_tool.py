from langchain.tools import BaseTool
from typing import Optional, Type
from pydantic import BaseModel, Field
from langchain_community.chat_models import ChatPerplexity
import os
from dotenv import load_dotenv

_ = load_dotenv()

class SearchInput(BaseModel):
    query: str = Field(description="The search query to look up information")

class SearchTool(BaseTool):
    name: str = "search"
    description: str = "Useful for searching information online using Perplexity AI"
    args_schema: Type[BaseModel] = SearchInput
    
    def _run(self, query: str) -> str:
        """Use this tool to search for information using Perplexity AI."""
        enhanced_query = f"{query}\n\nPlease identify all required resources across these categories:\n- Personnel (medical staff, volunteers)\n- Equipment & supplies\n- Permits/licenses\n- Facilities/venue\n- Transportation\n- Safety requirements\n\n"
        
        print("Using Perplexity" + query)

        perplexity = ChatPerplexity(api_key=os.getenv('PERPLEXITY_API_KEY'), model="sonar-pro")
        response = perplexity.invoke(enhanced_query)
        return response.content
    
    async def _arun(self, query: str) -> str:
        """Use this tool asynchronously."""
        raise NotImplementedError("Async not implemented")